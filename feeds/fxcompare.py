"""FX: live cost of sending or exchanging €1,000 from Malta, per provider and currency.

Quotes come from Wise's public comparison data (the same feed behind wise.com/compare), collected for senders in
Malta. We keep international money-transfer providers that serve Maltese customers, skip foreign retail banks, and
rank every quote by its total cost against the mid-market rate (fee plus exchange-rate markup), so different
currencies are comparable. Runs with the daily feed and every 6 hours with the news refresh."""
from __future__ import annotations

import re

from .common import CONFIG, OFFLINE, OUT, SEED, STATE, http_get, load_json, log, now_iso, save_json

AMOUNT = 1000
CORRIDORS = ["USD", "GBP", "CHF", "TRY", "PHP", "INR", "NPR", "AUD"]
API = "https://api.wise.com/v4/comparisons/?sourceCurrency=EUR&targetCurrency={c}&sendAmount={a}&sourceCountry=MT"
SOURCE_PAGE = "https://wise.com/gb/compare/"


def _speed(q) -> str | None:
    d = ((q.get("deliveryEstimation") or {}).get("duration") or {}).get("max")
    if not d:
        return None
    m = re.match(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?", d)
    if not m:
        return None
    days, hours, mins = (int(x or 0) for x in m.groups())
    hours += days * 24
    if hours == 0:
        return "Minutes" if mins else "Instant"
    return f"Within {hours} h" if hours < 24 else f"Within {round(hours / 24)} day" + ("s" if hours >= 48 else "")


def _quotes(ccy, directory):
    data = http_get(API.format(c=ccy, a=AMOUNT)).json()
    provs = data.get("providers", [])
    mid = next((q["rate"] for p in provs for q in p.get("quotes", []) if q.get("isConsideredMidMarketRate")), None)
    rows = []
    for p in provs:
        name = p.get("name", "")
        meta = directory.get(name.lower())
        if not meta or not p.get("quotes"):
            continue  # foreign retail banks and providers we have not mapped for Malta
        # several quotes can exist (different source countries); a Malta quote wins, else the best one
        qs = sorted(p["quotes"], key=lambda q: (q.get("sourceCountry") != "MT", -(q.get("receivedAmount") or 0)))
        q = qs[0]
        got = q.get("receivedAmount")
        if not got:
            continue
        base = (mid or q["rate"]) * AMOUNT
        rows.append({
            "provider": meta["provider"], "product": f"EUR → {ccy}", "corridor": ccy,
            "you_get": round(got, 2), "fee": round(q.get("fee") or 0, 2), "fx_rate": round(q["rate"], 4),
            "markup": round(max(q.get("markup") or 0, 0), 2),
            "total_cost_pct": round(max(0.0, (base - got) / base * 100), 2),
            "speed": _speed(q), "url": meta["url"], "source_url": SOURCE_PAGE,
            "checked": q.get("dateCollected") or now_iso(), "demo": False, "mid": mid,
        })
    # providers outside the comparison feed that publish fixed pricing (e.g. a markup per plan): priced at today's mid rate
    if mid:
        for meta in {id(m): m for m in directory.values()}.values():
            pr = meta.get("pricing")
            if not pr or ccy not in pr.get("corridors", CORRIDORS):
                continue
            fee, mk = float(pr.get("fee", 0)), float(pr["markup"])
            got = round((AMOUNT - fee) * mid * (1 - mk / 100), 2)
            rows.append({
                "provider": meta["provider"], "product": f"EUR → {ccy}" + (f" ({pr['plan']})" if pr.get("plan") else ""), "corridor": ccy,
                "you_get": got, "fee": fee, "fx_rate": round(mid * (1 - mk / 100), 4), "markup": mk,
                "total_cost_pct": round((mid * AMOUNT - got) / (mid * AMOUNT) * 100, 2), "speed": pr.get("speed"),
                "url": meta["url"], "source_url": pr.get("source_url") or meta["url"], "note": pr.get("note"),
                "checked": now_iso(), "demo": False, "mid": mid,
            })
    return rows


def run(status):
    from . import logos
    from .products import score

    cats = load_json(OUT / "categories.json") or {}
    cfg = (cats.get("config") or {}).get("fx") or load_json(CONFIG / "categories.json").get("fx")
    directory = {r["provider"].lower(): r for r in load_json(SEED / "products.json").get("fx", [])}
    directory.update({a.lower(): r for r in directory.copy().values() for a in r.get("aliases", [])})
    prev = load_json(STATE / "fxcompare.json", {})
    rows, ok = [], 0
    for ccy in CORRIDORS:
        try:
            if OFFLINE:
                raise RuntimeError("offline")
            got = _quotes(ccy, directory)
            if not got:
                raise ValueError("no quotes")
            rows += got
            ok += 1
        except Exception as e:  # noqa: BLE001  keep the last good quotes for this currency
            old = [dict(r, stale=True) for r in prev.get("items", []) if r.get("corridor") == ccy]
            rows += old
            status.stale(f"fxcompare.{ccy}", e)
    if not rows:
        status.stale("fxcompare", "no quotes yet")
        return
    if ok:
        save_json(STATE / "fxcompare.json", {"items": rows, "updated": now_iso()})
    score(rows, cfg["score"])
    # best first within each currency, currencies in a fixed order
    rows.sort(key=lambda r: (CORRIDORS.index(r["corridor"]) if r["corridor"] in CORRIDORS else 99, -r.get("score", 0)))
    for r in rows:
        r["logo"] = logos.logo_for(r.get("url"))
        r["logo_light"] = bool(r["logo"]) and logos.logo_light(r.get("url"))
    save_json(OUT / "cat-fx.json", {"slug": "fx", "updated": now_iso(), "amount": AMOUNT, "corridors": CORRIDORS, "items": rows})
    if ok:
        status.ok("fxcompare", len(rows), f"{ok}/{len(CORRIDORS)} currencies live")
    log.info("fxcompare: %d quotes across %d currencies", len(rows), ok)
