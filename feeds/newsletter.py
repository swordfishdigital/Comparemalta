"""Weekly newsletter issue (EN / MT / IT), rebuilt on every run during the week.

Outputs (all static, served with the site):
  site/newsletter/<lang>/<YYYY-Www>.html   the issue as an email-friendly HTML page
  site/newsletter/<lang>/feed.xml          RSS of the last 12 issues (for RSS-to-email in Mailchimp / Brevo)
  site/data/newsletter.json                latest issue summary for the site's newsletter page
The issue content comes only from the site's own data: best pick per category, markets with week-on-week
change, and the week's top Malta headlines with links to the publishers.
"""
import html
import os
from datetime import datetime, timezone
from email.utils import format_datetime

from .common import OUT, STATE, load_json, now_iso, save_json

SITE = "https://comparemalta.ai"
DIR = OUT.parent / "newsletter"
CATS = ["savings", "mortgages", "personal-loans", "credit-cards", "business-accounts", "telco-mobile", "telco-broadband", "money-transfer"]
L = {
    "en": {"title": "CompareMalta weekly", "week": "Week", "intro": "Your Monday rundown of the best rates, plans and prices in Malta, plus the markets and the week's news.",
           "picks": "Best picks this week", "markets": "Markets this week", "news": "Malta this week", "see": "See the full table", "read": "Read",
           "foot": "You receive this because you subscribed on CompareMalta.ai. Rankings are never paid for. Not financial advice.", "unsub": "Unsubscribe",
           "new": "new top pick", "same": "still top", "sample": "Figures are sample data while live feeds are being connected."},
    "mt": {"title": "CompareMalta kull ġimgħa", "week": "Ġimgħa", "intro": "Is-sommarju tiegħek tat-Tnejn tal-aħjar rati, pjanijiet u prezzijiet f'Malta, flimkien mas-swieq u l-aħbarijiet tal-ġimgħa.",
           "picks": "L-aħjar għażliet tal-ġimgħa", "markets": "Is-swieq din il-ġimgħa", "news": "Malta din il-ġimgħa", "see": "Ara t-tabella sħiħa", "read": "Aqra",
           "foot": "Qed tirċievi dan għax issottoskrivejt fuq CompareMalta.ai. Il-klassifiki qatt ma jitħallsu. Mhux parir finanzjarju.", "unsub": "Ħassar is-sottoskrizzjoni",
           "new": "l-aħjar għażla ġdida", "same": "għadu l-ewwel", "sample": "Iċ-ċifri huma data ta' kampjun sakemm jiġu konnessi l-feeds live."},
    "it": {"title": "CompareMalta settimanale", "week": "Settimana", "intro": "Il tuo riepilogo del lunedì con i migliori tassi, piani e prezzi a Malta, più i mercati e le notizie della settimana.",
           "picks": "Le migliori scelte della settimana", "markets": "I mercati questa settimana", "news": "Malta questa settimana", "see": "Vedi la tabella completa", "read": "Leggi",
           "foot": "Ricevi questa email perché ti sei iscritto su CompareMalta.ai. Le classifiche non sono mai a pagamento. Non è consulenza finanziaria.", "unsub": "Annulla l'iscrizione",
           "new": "nuova scelta migliore", "same": "ancora in testa", "sample": "I dati sono di esempio finché i feed live non saranno collegati."},
}
FREE = {"en": "Free", "mt": "B'xejn", "it": "Gratis"}
UNLIMITED = {"en": "Unlimited", "mt": "Bla limitu", "it": "Illimitati"}
UTM = "utm_source=newsletter&utm_medium=email&utm_campaign={week}"
E = html.escape


def _week(now):
    y, w, _ = now.isocalendar()
    return f"{y}-W{w:02d}"


def _fmt(v, f, lang="en"):
    if v is None:
        return "-"
    try:
        if f == "pct":
            return f"{v:.2f}%"
        if f == "pct0":
            return f"{v:.0f}%"
        if f == "eur":
            return FREE[lang] if v == 0 else f"€{v:,.2f}"
        if f == "eur0":
            return f"€{v:,.0f}"
        if f == "num":
            return UNLIMITED[lang] if v >= 999 else f"{v:,.0f}"
        return E(str(v))
    except Exception:  # noqa: BLE001
        return E(str(v))


def _chg(c):
    if c is None:
        return ""
    color, arrow = ("#4fe0a6", "▲") if c >= 0 else ("#ff8a7d", "▼")
    return f' <span style="color:{color}">{arrow} {abs(c):.2f}%</span>'


KEY_LABEL = {
    "en": {"rate": "rate", "aprc": "APRC", "annual_fee": "annual fee", "monthly_fee": "per month", "price": "per month", "fee": "fee"},
    "mt": {"rate": "rata", "aprc": "APRC", "annual_fee": "miżata annwali", "monthly_fee": "fix-xahar", "price": "fix-xahar", "fee": "miżata"},
    "it": {"rate": "tasso", "aprc": "TAEG", "annual_fee": "canone annuo", "monthly_fee": "al mese", "price": "al mese", "fee": "commissione"},
}
UNSUB = os.getenv("NEWSLETTER_UNSUB_TAG", "*|UNSUB|*")  # Mailchimp merge tag; for Brevo use {{ unsubscribe }}


def _issue(lang, week, picks, markets, news, demo):
    t = L[lang]
    utm = UTM.format(week=week)
    pick_rows = "".join(
        f'<tr><td style="padding:12px 0;border-bottom:1px solid #eee3d3"><div style="font:600 12px Arial;color:#9b3d1a;text-transform:uppercase;letter-spacing:.08em">{E(p["cat_title"])}</div>'
        f'<div style="font:700 16px Arial;color:#0d2a4a;margin:3px 0">{E(p["provider"])} <span style="font-weight:400;color:#6c7685">{E(p.get("product") or "")}</span></div>'
        f'<div style="font:700 18px Arial;color:#2b4cc4">{_fmt(p["key_value"], p["key_fmt"], lang)} <span style="font:400 12px Arial;color:#6c7685">{E(KEY_LABEL[lang].get(p["key"], p["key"]))} · {t["new"] if p["new"] else t["same"]}</span></div></td>'
        f'<td style="padding:12px 0;border-bottom:1px solid #eee3d3;text-align:right;vertical-align:middle"><a href="{SITE}/#{p["slug"]}?{utm}" style="font:700 13px Arial;color:#fff;background:#2b4cc4;padding:9px 14px;border-radius:8px;text-decoration:none">{t["see"]} →</a></td></tr>'
        for p in picks)
    mk_rows = "".join(f'<tr><td style="padding:8px 0;color:#fff;font:14px Arial">{E(m["name"])}</td>'
                      f'<td style="padding:8px 0;text-align:right;color:#fff;font:700 14px Arial">{E(m["value"])}{_chg(m["chg"])}</td></tr>' for m in markets)
    news_rows = "".join(f'<tr><td style="padding:10px 0;border-bottom:1px solid #eee3d3"><div style="font:600 11px Arial;color:#6c7685;text-transform:uppercase">{E(n["source"])}</div>'
                        f'<a href="{E(n["url"])}" style="font:700 15px Arial;color:#0d2a4a;text-decoration:none">{E(n["title"])}</a></td></tr>' for n in news)
    sample = f'<p style="font:12px Arial;color:#6d4c00;background:#fff4d6;padding:8px 12px;border-radius:8px">{t["sample"]}</p>' if demo else ""
    return f"""<!DOCTYPE html><html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>{t["title"]} · {t["week"]} {week[-2:]}</title></head>
<body style="margin:0;background:#f3eee6"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3eee6"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
<tr><td style="background:#0d2a4a;border-radius:16px 16px 0 0;padding:22px 26px"><div style="font:700 20px Arial;color:#fff">CompareMalta<span style="color:#8fa7ff">.ai</span></div>
<div style="font:700 11px Arial;color:#f2b58e;letter-spacing:.12em;text-transform:uppercase;margin-top:6px">{t["title"]} · {t["week"]} {int(week[-2:])}</div></td></tr>
<tr><td style="background:#fff;padding:24px 26px"><p style="font:15px/1.5 Arial;color:#3e4c5e;margin:0 0 14px">{t["intro"]}</p>{sample}
<h2 style="font:700 20px Arial;color:#0d2a4a;margin:18px 0 4px">{t["picks"]}</h2><table role="presentation" width="100%" cellpadding="0" cellspacing="0">{pick_rows}</table></td></tr>
<tr><td style="background:#0d2a4a;padding:18px 26px"><div style="font:700 11px Arial;color:#f2b58e;letter-spacing:.12em;text-transform:uppercase;margin-bottom:6px">{t["markets"]}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0">{mk_rows}</table></td></tr>
<tr><td style="background:#fff;padding:22px 26px"><h2 style="font:700 20px Arial;color:#0d2a4a;margin:0 0 4px">{t["news"]}</h2><table role="presentation" width="100%" cellpadding="0" cellspacing="0">{news_rows}</table></td></tr>
<tr><td style="background:#e9e1d2;border-radius:0 0 16px 16px;padding:16px 26px;font:12px/1.5 Arial;color:#3e4c5e">{t["foot"]} <a href="{UNSUB}" style="color:#0d2a4a">{t["unsub"]}</a></td></tr>
</table></td></tr></table></body></html>"""


def run(status):
    now = datetime.now(timezone.utc)
    week = _week(now)
    cats = load_json(OUT / "categories.json")["config"]
    hist = load_json(STATE / "weekly.json", {})
    prev_week = sorted(k for k in hist if k < week)[-1:] or [None]
    prev = hist.get(prev_week[0], {}) if prev_week[0] else {}

    picks, snap, demo = [], {"picks": {}, "markets": {}}, False
    for slug in CATS:
        d = load_json(OUT / f"cat-{slug}.json")
        if not d or not d["items"]:
            continue
        top, cfg = d["items"][0], cats[slug]
        col = next((c for c in cfg["columns"] if c["key"] == cfg["score"][0]["key"]), cfg["columns"][2])
        demo = demo or bool(top.get("demo"))
        snap["picks"][slug] = top["provider"]
        picks.append({"slug": slug, "cat_title_en": cfg["title_en"], "cat_titles": {l: cfg.get(f"title_{l}") or cfg["title_en"] for l in L},
                      "provider": top["provider"], "product": top.get("product"), "key_value": top.get(col["key"]), "key_fmt": col.get("fmt"),
                      "key": col["key"], "new": prev.get("picks", {}).get(slug) not in (None, top["provider"])})

    fx, mk = load_json(OUT / "fx.json") or {}, load_json(OUT / "markets.json") or {}
    rate = {r["ccy"]: r["rate"] for r in fx.get("rates", [])}
    raw = [("MSE " + (mk.get("mse_index") or {}).get("name", "Index").replace("MSE ", ""), (mk.get("mse_index") or {}).get("value"), 2),
           ("EUR / USD", rate.get("USD"), 4), ("EUR / GBP", rate.get("GBP"), 4)]
    raw += [(g["name"], g["price"], 2) for g in mk.get("global", []) if g["name"] in ("Euro Stoxx 50", "Brent", "Gold (USD/oz)")]
    markets = []
    for name, val, dp in raw:
        if val is None:
            continue
        snap["markets"][name] = val
        pv = prev.get("markets", {}).get(name)
        markets.append({"name": name, "value": f"{val:,.{dp}f}", "chg": (val / pv - 1) * 100 if pv else None})

    news = (load_json(OUT / "news.json") or {}).get("items", [])[:5]
    hist[week] = snap
    save_json(STATE / "weekly.json", {k: hist[k] for k in sorted(hist)[-26:]})

    latest = {"week": week, "updated": now_iso(), "issues": {}}
    for lang in L:
        for p in picks:
            p["cat_title"] = p["cat_titles"][lang]
        doc = _issue(lang, week, picks, markets, news, demo)
        (DIR / lang).mkdir(parents=True, exist_ok=True)
        (DIR / lang / f"{week}.html").write_text(doc, encoding="utf-8")
        issues = sorted((DIR / lang).glob("20*-W*.html"), reverse=True)[:12]
        items = "".join(
            f"<item><title>{E(L[lang]['title'])} · {E(f.stem)}</title><link>{SITE}/newsletter/{lang}/{f.name}</link><guid>{SITE}/newsletter/{lang}/{f.name}</guid>"
            f"<pubDate>{format_datetime(datetime.fromisocalendar(int(f.stem[:4]), int(f.stem[-2:]), 1).replace(tzinfo=timezone.utc))}</pubDate>"
            f"<description>{E(f.read_text(encoding='utf-8'))}</description></item>" for f in issues)
        (DIR / lang / "feed.xml").write_text(
            f'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>{E(L[lang]["title"])}</title><link>{SITE}/#newsletter</link>'
            f"<description>{E(L[lang]['intro'])}</description><language>{lang}</language>{items}</channel></rss>", encoding="utf-8")
        latest["issues"][lang] = f"newsletter/{lang}/{week}.html"
    save_json(OUT / "newsletter.json", latest)
    status.ok("newsletter", len(picks), week)
