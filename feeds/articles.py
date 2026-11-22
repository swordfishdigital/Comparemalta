"""CompareMalta.ai articles ("Malta today" features).

Articles are written as JSON in data/articles/<slug>.json (see docs/ARTICLES.md for the format). Each run:

  * resolves every picture from Wikimedia Commons (freely licensed photos only), saves a resized copy under
    site/article-img/<slug>/ and keeps the author and licence so the page can credit them;
  * writes site/data/articles.json (the index the news stream mixes in) and site/data/articles/<slug>.json (full text);
  * returns static, crawlable pages (site/<lang>/articles/<slug>/) for seo.py to write and add to the sitemap.

Articles with a future "date" stay hidden until that day, so several can be queued at once."""
from __future__ import annotations

import html
import io
import re
from datetime import datetime, timezone
from urllib.parse import quote

from .common import OUT, ROOT, STATE, http_get, load_json, log, now_iso, save_json

SRC = ROOT / "data" / "articles"
IMG = OUT.parent / "article-img"
LANGS = ("en", "mt", "it")
FREE = re.compile(r"^(cc0|public domain|pd|cc by(-sa)? ?[0-9.]*|cc-by(-sa)?-[0-9.]+)", re.I)
COMMONS = "https://commons.wikimedia.org/w/api.php"


def _txt(v, lang):
    if isinstance(v, dict):
        return v.get(lang) or v.get("en") or ""
    return v or ""


def _strip(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s or ""))).strip()


def _author(raw: str) -> str:
    """Photographer's name only: Commons 'Artist' fields often add a link wrapper or a sentence of description."""
    m = re.search(r"<a[^>]*>(.*?)</a>", raw or "", re.S)
    name = _strip(m.group(1) if m else raw)
    name = re.split(r"\s{2,}|\s(?:This|A|An|The|I)\s|\s\.|[.;(]\s", name)[0].strip(" .,-")
    return name[:60] or "Wikimedia Commons"


def _commons(query: str):
    """First freely licensed bitmap on Wikimedia Commons for a search, with credit."""
    exact = query.startswith("File:")  # a pinned file name is used as is; a search takes the first suitable result
    params = {"action": "query", "format": "json", "prop": "imageinfo", "iiprop": "url|extmetadata|size", "iiurlwidth": 1200,
              **({"titles": query} if exact else {"generator": "search", "gsrsearch": f"{query} filetype:bitmap", "gsrnamespace": 6, "gsrlimit": 8})}
    data = http_get(COMMONS, params=params, timeout=15).json()
    pages = sorted((data.get("query") or {}).get("pages", {}).values(), key=lambda p: p.get("index", 99))
    for p in pages:
        ii = (p.get("imageinfo") or [{}])[0]
        meta = ii.get("extmetadata") or {}
        lic = _strip((meta.get("LicenseShortName") or {}).get("value", ""))
        if not FREE.match(lic) or (not exact and ((ii.get("width") or 0) < 800 or (ii.get("width") or 0) < (ii.get("height") or 0))):
            continue  # free licence, landscape, big enough
        src, w, h = ii.get("thumburl") or ii.get("url"), ii.get("width") or 1, ii.get("height") or 1
        need = min(w, int(620 * w / h) + 1)  # wide panoramas need a wider thumbnail to stay sharp after the 16:10 crop
        if need >= w and not ii.get("url", "").lower().endswith((".tif", ".tiff")):
            src = ii.get("url") or src  # the original is small enough
        elif need > 1200 and re.search(r"/(lossy-page1-)?1200px-", src or ""):
            src = re.sub(r"/(lossy-page1-)?1200px-", lambda m: f"/{m.group(1) or ''}{need}px-", src)
        return {"file": p["title"], "src": src, "page": ii.get("descriptionurl"),
                "author": _author((meta.get("Artist") or {}).get("value", "")), "license": lic}
    return None


def _save(src_url, dest):
    from PIL import Image

    img = Image.open(io.BytesIO(http_get(src_url, timeout=20).content)).convert("RGB")
    w, h = img.size
    target = 16 / 10
    if w / h > target:
        nw = int(h * target); img = img.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w / target); img = img.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.resize((960, 600), Image.LANCZOS).save(dest, "JPEG", quality=80, optimize=True, progressive=True)


def _picture(slug, key, query, cache):
    """Return {image, credit} for one picture, downloading it once and reusing it afterwards."""
    if not query:
        return {}
    dest = IMG / slug / f"{key}.jpg"
    ck = f"{slug}/{key}"
    hit = cache.get(ck)
    if hit and hit.get("query") == query and hit.get("v") == 2 and dest.exists():
        return {"image": f"article-img/{slug}/{key}.jpg", "credit": hit["credit"]}
    try:
        found = _commons(query)
        if not found:
            return {}
        _save(found["src"], dest)
        credit = {"author": found["author"], "license": found["license"], "url": found["page"], "file": found["file"]}
        cache[ck] = {"query": query, "credit": credit, "v": 2}
        return {"image": f"article-img/{slug}/{key}.jpg", "credit": credit}
    except Exception as e:  # noqa: BLE001  a missing photo never blocks an article
        log.warning("articles: no picture for %s (%s): %s", ck, query, e)
        if hit and dest.exists():
            return {"image": f"article-img/{slug}/{key}.jpg", "credit": hit["credit"]}
        return {}


def load_all():
    """Published articles, newest first, with pictures resolved."""
    cache = load_json(STATE / "article_images.json", {})
    today = datetime.now(timezone.utc).date().isoformat()
    out = []
    for f in sorted(SRC.glob("*.json")):
        a = load_json(f)
        if not a or a.get("draft") or str(a.get("date", "9999"))[:10] > today:
            continue
        slug = a.setdefault("slug", f.stem)
        a.update({f"hero_{k}": v for k, v in _picture(slug, "hero", a.get("hero_query"), cache).items()})
        n = 0
        for sec in a.get("sections", []):
            for it in sec.get("items", []):
                n += 1
                it.update(_picture(slug, f"{n:02d}", it.get("image_query"), cache))
        out.append(a)
    save_json(STATE / "article_images.json", cache)
    out.sort(key=lambda a: a["date"], reverse=True)
    return out


def run(status):
    arts = load_all()
    (OUT / "articles").mkdir(parents=True, exist_ok=True)
    keep = set()
    for a in arts:
        save_json(OUT / "articles" / f"{a['slug']}.json", a)
        keep.add(f"{a['slug']}.json")
    for f in (OUT / "articles").glob("*.json"):
        if f.name not in keep:
            f.unlink()
    index = [{k: a.get(k) for k in ("slug", "date", "topic", "title", "summary", "hero_image", "hero_credit", "kicker")} for a in arts]
    save_json(OUT / "articles.json", {"updated": now_iso(), "items": index})
    pics = sum(1 for a in arts for s in a.get("sections", []) for i in s.get("items", []) if i.get("image"))
    status.ok("articles", len(arts), f"{len(arts)} articles, {pics} pictures")


# ---------- static pages (called from seo.run) ----------
L = {
    "en": {"home": "Home", "today": "Malta today", "by": "By CompareMalta.ai", "photos": "Photos", "sources": "Sources",
           "visit": "Website", "map": "Map", "read": "Read on CompareMalta.ai", "more": "More from Malta today"},
    "mt": {"home": "Paġna ewlenija", "today": "Malta llum", "by": "Minn CompareMalta.ai", "photos": "Ritratti", "sources": "Sorsi",
           "visit": "Websajt", "map": "Mappa", "read": "Aqra fuq CompareMalta.ai", "more": "Aktar minn Malta llum"},
    "it": {"home": "Home", "today": "Malta oggi", "by": "A cura di CompareMalta.ai", "photos": "Foto", "sources": "Fonti",
           "visit": "Sito web", "map": "Mappa", "read": "Leggi su CompareMalta.ai", "more": "Altro da Malta oggi"},
}
CSS = """.art-hero{border-radius:18px;overflow:hidden;margin:18px 0 6px;aspect-ratio:16/10;background:#0d2a4a}.art-hero img,.art-item img{width:100%;height:100%;object-fit:cover;display:block}
.art-credit{font-size:12px;color:#5b6b80;margin:4px 0 18px}.art-credit a{color:inherit}
.art-body{font-size:17px;line-height:1.65;color:#22324a;max-width:760px}
.art-sec h2{font-family:'Space Grotesk',Inter,sans-serif;color:#0d2a4a;font-size:26px;margin:36px 0 6px}
.art-item{display:grid;grid-template-columns:minmax(0,300px) 1fr;gap:18px;align-items:start;border-top:1px solid #e6ebf2;padding:18px 0}
.art-item .ph{aspect-ratio:16/10;border-radius:12px;overflow:hidden;background:#eef3fb;position:relative}
.art-item .rk{position:absolute;left:10px;top:10px;background:#0d2a4a;color:#fff;font-weight:700;border-radius:999px;min-width:34px;height:34px;display:grid;place-items:center}
.art-item h3{margin:0 0 4px;font-size:21px;color:#0d2a4a}.art-item .meta{font-size:13.5px;color:#5b6b80;margin-bottom:8px}
.art-badge{display:inline-block;font-size:12px;font-weight:700;border-radius:999px;padding:3px 9px;margin-right:6px;background:#fdecef;color:#b3122e}
.art-badge.bib{background:#fff4e0;color:#9a5b00}.art-badge.other{background:#eef3fb;color:#2b4cc4}
.art-item.nophoto{grid-template-columns:1fr}
.art-mx{width:100%;border-collapse:collapse;font-size:14.5px;background:#fff}.art-mx th,.art-mx td{padding:10px 12px;border-bottom:1px solid #e6ebf2;text-align:center}
.art-mx th{background:#0d2a4a;color:#fff;font-size:13px}.art-mx td:first-child,.art-mx th:first-child{text-align:left}
.art-mx .sc{font-weight:700}.art-mx .s0{background:#fde2e2;color:#a01818}.art-mx .s1{background:#fdeadb;color:#a2460a}.art-mx .s2{background:#fff4d6;color:#8a5d00}
.art-mx .s3{background:#eef7dc;color:#4f6b10}.art-mx .s4{background:#dff3e6;color:#17713b}.art-mx .s5{background:#cdeeda;color:#0b5e2c}
.art-mx .tot{background:#0d2a4a;color:#fff}.art-mx tr.bench td{font-style:italic;opacity:.75}
@media(max-width:700px){.art-item{grid-template-columns:1fr}}"""


def _credit_txt(c, lang):
    if not c:
        return ""
    lic = html.escape(c.get("license", ""))
    return f'{L[lang]["photos"]}: <a href="{html.escape(c.get("url") or "#")}" rel="nofollow noopener" target="_blank">{html.escape(c.get("author", ""))}</a>, {lic}, Wikimedia Commons'


def static_pages(seo):
    """Yield (path_parts, html, md) for every article and language, using seo.py's page chrome."""
    arts = [load_json(f) for f in sorted((OUT / "articles").glob("*.json"))]
    arts = sorted([a for a in arts if a], key=lambda a: a["date"], reverse=True)
    pages = []
    for a in arts:
        slug = a["slug"]
        alternates = {l: seo.url(l, f"articles/{slug}") for l in LANGS}
        for lang in LANGS:
            s = L[lang]
            title, summary = _txt(a["title"], lang), _txt(a["summary"], lang)
            canonical = alternates[lang]
            items_ld, body, md = [], [], [f"# {title}", "", summary, ""]
            rank = 0
            for sec in a.get("sections", []):
                h = _txt(sec.get("heading"), lang)
                body.append(f'<section class="art-sec"><h2>{html.escape(h)}</h2>')
                if sec.get("intro"):
                    body.append(f'<p class="art-body">{html.escape(_txt(sec["intro"], lang))}</p>')
                md += [f"## {h}", ""]
                mx = sec.get("matrix")
                if mx:
                    cols, top = mx["columns"], mx.get("max", 5)
                    avg = lambda sc: sum(sc[c["key"]] for c in cols) / len(cols)
                    th = "".join(f'<th title="{html.escape(_txt(c.get("help"), lang))}">{html.escape(_txt(c["label"], lang))}</th>' for c in cols)
                    rows = mx["rows"] + ([dict(mx["benchmark"], bench=True)] if mx.get("benchmark") else [])
                    trs = "".join(
                        f'<tr{" class=bench" if r.get("bench") else ""}><td><b>{html.escape(_txt(r["name"], lang))}</b><br><small>{html.escape(r.get("sub", ""))}</small></td>'
                        + "".join(f'<td class="sc s{r["scores"][c["key"]]}">{r["scores"][c["key"]]}</td>' for c in cols)
                        + f'<td class="sc tot">{avg(r["scores"]):.1f}</td></tr>' for r in rows)
                    body.append(f'<div class="seo-scroll"><table class="art-mx"><thead><tr><th></th>{th}<th>Overall</th></tr></thead><tbody>{trs}</tbody></table></div><p class="seo-muted">0 to {top}</p>')
                    md += ["| | " + " | ".join(_txt(c["label"], lang) for c in cols) + " | Overall |", "|---" * (len(cols) + 2) + "|"]
                    md += [f"| {_txt(r['name'], lang)} | " + " | ".join(str(r["scores"][c["key"]]) for c in cols) + f" | {avg(r['scores']):.1f} |" for r in rows]
                    md.append("")
                for it in sec.get("items", []):
                    rank += 1
                    badge = _txt(it.get("badge"), lang)
                    bcls = "art-badge " + html.escape(it.get("badge_kind") or "")
                    img = f'<img src="../../../{it["image"]}" alt="{html.escape(it.get("image_alt") or it["name"])}" loading="lazy">' if it.get("image") else ""
                    links = " · ".join(x for x in [
                        f'<a href="{html.escape(it["url"])}" rel="noopener" target="_blank">{s["visit"]} ↗</a>' if it.get("url") else "",
                        f'<a href="https://www.google.com/maps/search/?api=1&query={quote(it["name"] + ", " + it.get("locality", "") + ", Malta")}" rel="noopener" target="_blank">{s["map"]} ↗</a>'] if x)
                    ph = "" if it.get("no_photo") else f'<div class="ph">{img}<span class="rk">{rank}</span></div>'
                    body.append(f'''<article class="art-item{" nophoto" if it.get("no_photo") else ""}">{ph}<div>
<h3>{html.escape(it["name"])}</h3><div class="meta"><span class="{bcls}">{html.escape(badge)}</span>{" · ".join(html.escape(x) for x in [it.get("locality", ""), _txt(it.get("cuisine"), lang), it.get("price", "")] if x)}</div>
<p class="art-body" style="margin:0 0 8px">{html.escape(_txt(it.get("text"), lang))}</p><div class="seo-muted">{links}</div>
<div class="art-credit">{_credit_txt(it.get("credit"), lang)}</div></div></article>''')
                    md += [f"{rank}. **{it['name']}** ({badge}), {it.get('locality', '')}: {_txt(it.get('text'), lang)}", ""]
                    items_ld.append({"@type": "ListItem", "position": rank, "item": {"@type": it.get("schema_type") or "Place", "name": it["name"],
                                     "address": {"@type": "PostalAddress", "addressLocality": it.get("locality", ""), "addressCountry": "MT"},
                                     **({"url": it["url"]} if it.get("url") else {})}})
                body.append("</section>")
            if a.get("outro"):
                body.append(f'<p class="art-body" style="margin-top:28px">{html.escape(_txt(a["outro"], lang))}</p>')
                md += [_txt(a["outro"], lang), ""]
            srcs = a.get("sources") or []
            if srcs:
                body.append(f'<p class="seo-muted" style="margin-top:22px"><b>{s["sources"]}:</b> ' + " · ".join(
                    f'<a href="{html.escape(x["url"])}" rel="nofollow noopener" target="_blank">{html.escape(x["name"])}</a>' for x in srcs) + "</p>")
                md += [f"{s['sources']}: " + ", ".join(f"[{x['name']}]({x['url']})" for x in srcs), ""]
            hero = a.get("hero_image")
            ld = [{"@context": "https://schema.org", "@type": "NewsArticle", "headline": title, "description": summary,
                   "datePublished": a["date"], "dateModified": a.get("updated", a["date"]), "inLanguage": lang,
                   "mainEntityOfPage": canonical, "author": {"@id": f"{seo.BASE}/#org"}, "publisher": seo.ORG,
                   **({"image": f"{seo.BASE}/{hero}"} if hero else {})},
                  {"@context": "https://schema.org", "@type": "ItemList", "name": title, "itemListElement": items_ld},
                  {"@context": "https://schema.org", **seo.crumbs([(s["home"], seo.url(lang)), (s["today"], seo.url(lang)), (title, canonical)])}]
            page = seo.head(lang, f"{title} | CompareMalta.ai", summary, canonical, alternates, 3, ld, md_href=canonical + "index.md")
            page = page.replace("</style>", CSS + "</style>", 1)
            if hero:
                page = page.replace('content="https://comparemalta.ai/og.png"', f'content="{seo.BASE}/{hero}"', 1)
            page += seo.topbar(lang, 3, alternates, [])
            page += f'''<main class="wrap seo-main"><p class="eyebrow">{html.escape(_txt(a.get("kicker"), lang) or s["today"])} · {seo.date_txt(a["date"], lang)}</p>
<h1 class="seo-h1">{html.escape(title)}</h1><p class="seo-intro">{html.escape(summary)}</p><p class="seo-muted">{s["by"]}</p>
{f'<div class="art-hero"><img src="../../../{hero}" alt="{html.escape(title)}"></div><div class="art-credit">{_credit_txt(a.get("hero_credit"), lang)}</div>' if hero else ""}
{"".join(f'<p class="art-body">{html.escape(p)}</p>' for p in _txt(a.get("intro"), lang).split(chr(10)) if p.strip())}
{"".join(body)}
<p style="margin:30px 0"><a class="btn blue" href="../../../?lang={lang}#article/{slug}">{s["read"]}</a></p></main>'''
            page += seo.footer(lang, 3, {})
            pages.append(((lang, "articles", slug), page, "\n".join(md)))
    return pages, [f"articles/{a['slug']}" for a in arts]
