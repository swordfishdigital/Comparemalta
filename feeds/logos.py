"""Provider logos. Once a week, for every provider domain, find the best square icon the provider
publishes for itself (apple-touch-icon, then <link rel=icon> with the largest size, then /favicon.ico),
normalise it to a 128x128 PNG and save it to site/logos/<domain>.png. Sites the feed cannot reach keep
their previous logo; providers without one fall back to the monogram badge in the UI."""
import io
import re
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from urllib.parse import urljoin, urlparse

from .common import OFFLINE, OUT, SEED, STATE, http_get, load_json, now_iso, save_json

LOGOS = OUT.parent / "logos"
TTL = timedelta(days=7)
SKIP = ("google.", "maps.app")


def domain(url):
    try:
        host = urlparse(url).netloc.lower()
    except Exception:  # noqa: BLE001
        return None
    host = host[4:] if host.startswith("www.") else host
    return None if not host or any(s in host for s in SKIP) else host


def _candidates(site):
    """Icon URLs declared in the home page, best first."""
    from bs4 import BeautifulSoup

    html = http_get(site, timeout=12).text
    soup = BeautifulSoup(html, "html.parser")
    found = []
    for link in soup.find_all("link", href=True):
        rel = " ".join(link.get("rel") or []).lower()
        if "icon" not in rel:
            continue
        sizes = link.get("sizes", "")
        m = re.search(r"(\d+)x\d+", sizes)
        size = int(m.group(1)) if m else (180 if "apple" in rel else 32)
        if link["href"].lower().endswith(".svg"):
            size = 512
        found.append((size + (40 if "apple" in rel else 0), urljoin(site, link["href"])))
    found.sort(reverse=True)
    return [u for _, u in found] + [urljoin(site, "/apple-touch-icon.png"), urljoin(site, "/favicon.ico")]


def _to_png(raw, url):
    from PIL import Image

    if url.lower().endswith(".svg") or raw.lstrip()[:5] in (b"<?xml", b"<svg "):
        try:
            import cairosvg  # optional

            raw = cairosvg.svg2png(bytestring=raw, output_width=256, output_height=256)
        except Exception:  # noqa: BLE001
            return None
    img = Image.open(io.BytesIO(raw))
    if getattr(img, "n_frames", 1) > 1 or img.format == "ICO":  # pick the largest frame of an .ico
        sizes = getattr(img, "ico", None) and img.ico.sizes()
        if sizes:
            img = img.ico.getimage(max(sizes))
    img = img.convert("RGBA")
    if min(img.size) < 32:
        return None  # too small to look good
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    side = max(img.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(img, ((side - img.width) // 2, (side - img.height) // 2))
    out = io.BytesIO()
    canvas.resize((128, 128), Image.LANCZOS).save(out, "PNG", optimize=True)
    return out.getvalue()


def fetch_logo(dom):
    site = f"https://{dom}/"
    try:
        cands = _candidates(site)
    except Exception:  # noqa: BLE001
        cands = [urljoin(site, "/apple-touch-icon.png"), urljoin(site, "/favicon.ico")]
    cands = cands[:6] + [f"https://www.google.com/s2/favicons?domain={dom}&sz=128"]  # last resort, still self-hosted
    for u in cands:
        try:
            png = _to_png(http_get(u, timeout=12, retries=0).content, u)
            if png:
                (LOGOS / f"{dom}.png").write_bytes(png)
                return True, u
        except Exception:  # noqa: BLE001
            continue
    return False, None


def run(status):
    LOGOS.mkdir(parents=True, exist_ok=True)
    seed = load_json(SEED / "products.json")
    doms = sorted({d for rows in seed.values() for r in rows for d in [domain(r.get("url", ""))] if d})
    state = load_json(STATE / "logos.json", {})
    now = datetime.now(timezone.utc)
    due = [d for d in doms if d not in state or now - datetime.fromisoformat(state[d]["checked"]) > TTL
           or (state[d]["ok"] and not (LOGOS / f"{d}.png").exists())]
    if due and not OFFLINE:
        with ThreadPoolExecutor(8) as ex:
            for d, (ok, src) in zip(due, ex.map(fetch_logo, due)):
                prev_ok = state.get(d, {}).get("ok") and (LOGOS / f"{d}.png").exists()
                state[d] = {"ok": ok or bool(prev_ok), "src": src or state.get(d, {}).get("src"), "checked": now_iso()}
        save_json(STATE / "logos.json", state)
    have = sum(1 for d in doms if (LOGOS / f"{d}.png").exists())
    status.ok("logos", have, f"{have}/{len(doms)} providers have a logo")


def logo_for(url):
    d = domain(url or "")
    return f"logos/{d}.png" if d and (LOGOS / f"{d}.png").exists() else None
