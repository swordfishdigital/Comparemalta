"""Entry point: python -m feeds.run_all   (CM_OFFLINE=1 to build from seed/state only)."""
import os
import sys

from . import articles, fx, fxcompare, logos, markets, news, newsletter, products, restaurants, seo
from .common import OUT, FeedStatus, load_json, now_iso, save_json, log


def main() -> int:
    status = FeedStatus()
    # restaurants first: products.run reads its state for the restaurants category
    only = {m.strip() for m in os.getenv("CM_ONLY", "").split(",") if m.strip()}
    mods = (fx, markets, news, articles, restaurants, logos, products, fxcompare, newsletter)
    for mod in mods:
        if only and mod.__name__.split(".")[-1] not in only:
            continue
        try:
            mod.run(status)
        except Exception as e:  # noqa: BLE001  one broken feed never blocks the others
            status.stale(mod.__name__, e)
    try:  # static SEO/GEO pages are rebuilt after every run, including the 6-hourly news refresh
        seo.run(status)
    except Exception as e:  # noqa: BLE001
        status.stale("seo", e)
    feeds = status.items
    if only:  # partial run (e.g. the 6-hourly news refresh): keep the other feeds' last status
        prev = (load_json(OUT / "status.json") or {}).get("feeds", {})
        feeds = {**prev, **status.items}
    ok = sum(1 for v in feeds.values() if v["status"] == "ok")
    save_json(OUT / "status.json", {"generated": now_iso(), "ok": ok, "total": len(feeds), "feeds": feeds})
    log.info("feeds done: %d/%d ok%s", ok, len(feeds), f" (only {','.join(sorted(only))})" if only else "")
    return 0


if __name__ == "__main__":
    sys.exit(main())
