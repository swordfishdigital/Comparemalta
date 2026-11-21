"""Comparison products: merges seed catalogue, last-known-good state and fresh scrapes, then scores.

Flow per category:
  seed (curated catalogue)  ->  overlay state/products.json (last scraped values)
  -> overlay today's scrapes from config/sources.json  -> compute CompareMalta Score (0-10)
Every row carries `checked` (last successful scrape) and `stale` so the UI can show freshness.
"""
import re

from .common import CONFIG, SEED, STATE, OUT, html_to_text, http_get, load_json, now_iso, save_json, to_number


def _key(row):
    return f"{row['provider']}|{row.get('product') or row.get('corridor') or ''}"


def _scrape(src):
    text = html_to_text(http_get(src["url"]).text)
    found = {}
    for field, rx in src["fields"].items():
        m = re.search(rx, text, re.I)
        if m:
            found[field] = to_number(m.group(1))
    if not found:
        raise ValueError("no fields matched")
    return found


# Typical Maltese merchant months used to compare POS offers like for like (average ticket about €12.50 and €16.70)
POS_MONTHS = {"cost_5k": (5000, 400), "cost_20k": (20000, 1200)}


def derive_pos_costs(rows):
    """Monthly cost = card fee on sales above any fee-free allowance + fixed fee per payment + plan fee."""
    for r in rows:
        if not isinstance(r.get("fee_pct"), (int, float)):
            continue
        for key, (sales, n) in POS_MONTHS.items():
            taxed = max(0.0, sales - float(r.get("free_allowance") or 0))
            r[key] = round(taxed * r["fee_pct"] / 100 + n * float(r.get("fee_fixed") or 0) + float(r.get("monthly_fee") or 0), 2)


def score(rows, spec):
    """Weighted min-max normalisation -> 0..10. Booleans count as 1/0. Missing values get the category median."""
    if not rows:
        return
    total_w = sum(s["w"] for s in spec)
    norms = {}
    for s in spec:
        vals = [float(r[s["key"]]) for r in rows if isinstance(r.get(s["key"]), (int, float, bool))]
        if not vals:
            continue
        lo, hi = min(vals), max(vals)
        med = sorted(vals)[len(vals) // 2]
        norms[s["key"]] = (lo, hi, med)
    for r in rows:
        acc = 0.0
        for s in spec:
            if s["key"] not in norms:
                continue
            lo, hi, med = norms[s["key"]]
            v = r.get(s["key"])
            v = float(v) if isinstance(v, (int, float, bool)) else med
            n = 0.5 if hi == lo else (v - lo) / (hi - lo)
            acc += s["w"] * (1 - n if s["dir"] == "low" else n)
        r["score"] = round(10 * acc / total_w, 1)


def run(status):
    cats = load_json(CONFIG / "categories.json")
    seed = load_json(SEED / "products.json")
    state = load_json(STATE / "products.json", {})
    sources = load_json(CONFIG / "sources.json")["products"]

    # 1) fresh scrapes into state (parallel)
    from concurrent.futures import ThreadPoolExecutor

    def attempt(src):
        try:
            return src, _scrape(src), None
        except Exception as e:  # noqa: BLE001
            return src, None, e

    with ThreadPoolExecutor(8) as pool:
        results = list(pool.map(attempt, sources))
    for src, vals, err in results:
        k = f"{src['category']}::{src['provider']}|{src['product']}"
        try:
            if err:
                raise err
            state[k] = {"values": vals, "checked": now_iso(), "source_url": src["url"]}
            status.ok(f"product.{k}", len(vals))
        except Exception as e:  # noqa: BLE001
            if k in state:
                state[k]["stale"] = True
            status.stale(f"product.{k}", e)
    save_json(STATE / "products.json", state)

    # 2) build category files
    from . import links, logos

    index, built = [], {}
    for slug, cfg in cats.items():
        if slug == "fx":
            continue  # live quotes, built by feeds/fxcompare.py
        rows = [dict(r) for r in seed.get(slug, [])]
        if slug == "restaurants":
            live = load_json(STATE / "restaurants.json", {}).get("items")
            if live:
                featured = [r for r in rows if r.get("featured")]
                names = {r["provider"].lower() for r in featured}
                rows = featured + [r for r in live if r["provider"].lower() not in names]
        for r in rows:
            st = state.get(f"{slug}::{_key(r)}")
            if st:
                r.update(st["values"])
                r["checked"] = st["checked"]
                r["stale"] = st.get("stale", False)
                r["source_url"] = st["source_url"]
            else:
                r.setdefault("checked", None)
                r.setdefault("demo", True)
        if slug == "pos":
            derive_pos_costs(rows)
        score(rows, cfg["score"])
        rows.sort(key=lambda r: (bool(r.get("featured")), r.get("score", 0)), reverse=True)  # featured listings are labelled in the UI
        for r in rows:
            r["logo"] = None if slug == "restaurants" else logos.logo_for(r.get("url"))
            r["logo_light"] = bool(r["logo"]) and logos.logo_light(r.get("url"))
        built[slug] = rows
    links.apply(built, status)
    for slug, rows in built.items():
        save_json(OUT / f"cat-{slug}.json", {"slug": slug, "updated": now_iso(), "items": rows})
        index.append({"slug": slug, "count": len(rows), "best": rows[0]["provider"] if rows else None})
    save_json(OUT / "categories.json", {"updated": now_iso(), "config": cats, "index": index})
