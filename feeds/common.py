"""Shared helpers for CompareMalta feeds."""
from __future__ import annotations

import json
import logging
import os
import re
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "config"
SEED = ROOT / "data" / "seed"
OUT = ROOT / "site" / "data"
STATE = ROOT / "data" / "state"  # last-known-good values, committed with the repo

UA = "Mozilla/5.0 (compatible; CompareMaltaBot/1.0; +https://comparemalta.ai/bot)"
log = logging.getLogger("comparemalta")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

OFFLINE = os.getenv("CM_OFFLINE") == "1"


def now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def load_json(path: Path, default=None):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return default


def save_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    tmp.replace(path)


def http_get(url: str, *, timeout: int = 12, retries: int = 1, **kw) -> requests.Response:
    if OFFLINE:
        raise ConnectionError("offline mode")
    last = None
    for attempt in range(retries + 1):
        try:
            r = requests.get(url, timeout=timeout, headers={"User-Agent": UA, **kw.pop("headers", {})}, **kw)
            r.raise_for_status()
            return r
        except Exception as e:  # noqa: BLE001
            last = e
            time.sleep(1)
    raise last  # type: ignore[misc]


def to_number(s: str) -> float:
    return float(s.replace(",", ".").strip())


def html_to_text(html: str) -> str:
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(html, "html.parser")
    for t in soup(["script", "style", "noscript"]):
        t.decompose()
    return re.sub(r"\s+", " ", soup.get_text(" "))


class FeedStatus:
    """Collects per-feed health so the site can show freshness and ops can alert."""

    def __init__(self):
        self.items: dict[str, dict] = {}

    def ok(self, name, count, note=""):
        self.items[name] = {"status": "ok", "count": count, "at": now_iso(), "note": note}

    def stale(self, name, note):
        self.items[name] = {"status": "stale", "at": now_iso(), "note": str(note)[:200]}
        log.warning("feed %s stale: %s", name, note)
