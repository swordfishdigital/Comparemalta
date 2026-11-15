"""Daily Malta news from publisher RSS feeds. Stores headline, link, source, time and a short summary only."""
import hashlib
import re
from datetime import datetime, timezone

from .common import CONFIG, SEED, STATE, OUT, http_get, load_json, now_iso, save_json

TOPICS = {
    "Property": r"\b(property|properties|rent|rental|housing|apartment|planning authority|construction|real estate)",
    "Business": r"\b(econom|budget|inflation|gdp|tax|bank|finance|fintech|invest|mfsa|central bank|eur|market|business|igaming|property)",
    "Politics": r"\b(minister|parliament|government|abela|opposition|election|labour|nationalist|pn|pl)\b",
    "Lifestyle": r"\b(restaurant|food|festa|event|concert|culture|travel|weather|sport|football)",
    "Tech": r"\b(ai|tech|digital|startup|crypto|blockchain|app)\b",
}


def _topic(text: str) -> str:
    t = text.lower()
    for name, rx in TOPICS.items():
        if re.search(rx, t):
            return name
    return "Malta"


def _image(e):
    """Publisher image from RSS: media:content / media:thumbnail / enclosure / first <img> in the summary."""
    for m in (e.get("media_content") or []) + (e.get("media_thumbnail") or []):
        if m.get("url"):
            return m["url"]
    for l in e.get("links", []):
        if l.get("rel") == "enclosure" and str(l.get("type", "")).startswith("image"):
            return l.get("href")
    m = re.search(r'<img[^>]+src="([^"]+)"', e.get("summary", "") + str(e.get("content", "")))
    return m.group(1) if m else None


def _og_image(url):
    """Preview image the publisher declares for social sharing (og:image / twitter:image)."""
    try:
        from bs4 import BeautifulSoup

        soup = BeautifulSoup(http_get(url, timeout=10, retries=0).text[:300_000], "html.parser")
        for key in ("og:image:secure_url", "og:image", "twitter:image"):
            tag = soup.find("meta", attrs={"property": key}) or soup.find("meta", attrs={"name": key})
            if tag and tag.get("content", "").startswith("http"):
                return tag["content"]
    except Exception:  # noqa: BLE001
        return None
    return None


def _add_og_images(items, status):
    from concurrent.futures import ThreadPoolExecutor

    cache = load_json(STATE / "news_images.json", {})
    todo = [i for i in items if not i.get("image") and i["url"] not in cache]
    with ThreadPoolExecutor(8) as ex:
        for i, img in zip(todo, ex.map(lambda x: _og_image(x["url"]), todo)):
            cache[i["url"]] = img
    for i in items:
        i["image"] = i.get("image") or cache.get(i["url"])
    keep = {i["url"] for i in items}
    save_json(STATE / "news_images.json", {k: v for k, v in cache.items() if k in keep})
    status.ok("news.images", sum(1 for i in items if i.get("image")))


def run(status, max_items=80):
    import feedparser

    feeds = load_json(CONFIG / "sources.json")["news"]
    items, seen = [], set()
    from concurrent.futures import ThreadPoolExecutor

    def fetch(f):
        try:
            return f, http_get(f["url"]).content, None
        except Exception as ex:  # noqa: BLE001
            return f, None, ex

    with ThreadPoolExecutor(8) as pool:
        fetched = list(pool.map(fetch, feeds))
    for f, raw, err in fetched:
        try:
            if err:
                raise err
            parsed = feedparser.parse(raw)
            n = 0
            for e in parsed.entries[:25]:
                key = hashlib.md5(e.get("link", e.get("title", "")).encode()).hexdigest()[:12]
                if key in seen:
                    continue
                seen.add(key)
                ts = e.get("published_parsed") or e.get("updated_parsed")
                when = datetime(*ts[:6], tzinfo=timezone.utc).isoformat() if ts else now_iso()
                image = _image(e)
                summary = re.sub(r"<[^>]+>", "", e.get("summary", ""))[:220]
                items.append({"id": key, "title": e.get("title", "").strip(), "url": e.get("link"), "source": f["name"],
                              "published": when, "summary": summary, "image": image, "topic": _topic(e.get("title", "") + " " + summary)})
                n += 1
            status.ok(f"news.{f['name']}", n)
        except Exception as ex:  # noqa: BLE001
            status.stale(f"news.{f['name']}", ex)
    if items:
        items.sort(key=lambda x: x["published"], reverse=True)
        _add_og_images(items[:max_items], status)
        data = {"updated": now_iso(), "items": items[:max_items]}
        save_json(STATE / "news.json", data)
    else:
        data = load_json(STATE / "news.json") or load_json(SEED / "news.json")
        data["stale"] = True
    save_json(OUT / "news.json", data)
