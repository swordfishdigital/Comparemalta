"""Outbound link health. Checks every provider `url` and product `apply_url` at most once a week.
A broken apply_url is dropped so the call to action falls back to the provider's home page."""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone

import requests

from .common import OFFLINE, STATE, UA, load_json, now_iso, save_json

TTL = timedelta(days=7)


def _check(url):
    try:
        r = requests.head(url, timeout=10, allow_redirects=True, headers={"User-Agent": UA})
        if r.status_code in (403, 405, 429) or r.status_code >= 500:  # many sites refuse HEAD or bots; try GET once
            r = requests.get(url, timeout=12, allow_redirects=True, headers={"User-Agent": UA}, stream=True)
        return r.status_code < 400 or r.status_code in (401, 403, 429)  # blocked-but-alive counts as up
    except Exception:  # noqa: BLE001
        return False


def apply(rows_by_cat, status):
    state = load_json(STATE / "links.json", {})
    now = datetime.now(timezone.utc)
    urls = {u for rows in rows_by_cat.values() for r in rows for u in (r.get("url"), r.get("apply_url")) if u and u.startswith("http")}
    due = [u for u in urls if u not in state or now - datetime.fromisoformat(state[u]["checked"]) > TTL]
    if due and not OFFLINE:
        with ThreadPoolExecutor(10) as ex:
            for u, ok in zip(due, ex.map(_check, due)):
                state[u] = {"ok": ok, "checked": now_iso()}
        save_json(STATE / "links.json", state)
    broken = 0
    for rows in rows_by_cat.values():
        for r in rows:
            if r.get("apply_url") and state.get(r["apply_url"], {}).get("ok") is False:
                r["apply_url"] = None
                broken += 1
            if r.get("url") and state.get(r["url"], {}).get("ok") is False:
                r["url_ok"] = False
                broken += 1
    status.ok("links", len(urls), f"{broken} broken")
