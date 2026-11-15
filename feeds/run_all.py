"""Entry point: python -m feeds.run_all   (CM_OFFLINE=1 to build from seed/state only)."""
import sys

from . import fx, logos, markets, news, products, restaurants
from .common import OUT, FeedStatus, now_iso, save_json, log


def main() -> int:
    status = FeedStatus()
    # restaurants first: products.run reads its state for the restaurants category
    for mod in (fx, markets, news, restaurants, logos, products):
        try:
            mod.run(status)
        except Exception as e:  # noqa: BLE001  one broken feed never blocks the others
            status.stale(mod.__name__, e)
    ok = sum(1 for v in status.items.values() if v["status"] == "ok")
    save_json(OUT / "status.json", {"generated": now_iso(), "ok": ok, "total": len(status.items), "feeds": status.items})
    log.info("feeds done: %d/%d ok", ok, len(status.items))
    return 0


if __name__ == "__main__":
    sys.exit(main())
