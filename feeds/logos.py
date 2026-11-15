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
    canvas = canvas.resize((128, 128), Image.LANCZOS)
    canvas.save(out, "PNG", optimize=True)
    return out.getvalue()


def is_light(png_bytes):
    """True only for transparent logos whose visible pixels are almost all white (invisible on a white tile).
    Logos that bring their own opaque background are left alone."""
    from PIL import Image

    img = Image.open(io.BytesIO(png_bytes)).convert("RGBA")
    data = list(img.getdata())
    opaque = [p for p in data if p[3] > 60]
    if not opaque or len(opaque) / len(data) > 0.9:
        return False
    white = sum(1 for r, g, b, _ in opaque if min(r, g, b) > 225)
    return white / len(opaque) > 0.75


_light = {}


def logo_for(url):
    d = domain(url or "")
    return f"logos/{d}.png" if d and (LOGOS / f"{d}.png").exists() else None


def logo_light(url):
    d = domain(url or "")
    if not d or not (LOGOS / f"{d}.png").exists():
        return False
    if d not in _light:
        _light[d] = is_light((LOGOS / f"{d}.png").read_bytes())
    return _light[d]
