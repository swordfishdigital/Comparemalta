"""Market data: global indices & commodities (Yahoo Finance chart API), crypto (CoinGecko), Malta Stock Exchange (borzamalta.com.mt)."""
import re
from concurrent.futures import ThreadPoolExecutor

from .common import CONFIG, SEED, STATE, OUT, http_get, load_json, now_iso, save_json


def _yahoo_one(item):
    name, sym = item
    j = http_get(f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}", params={"range": "5d", "interval": "1d"}).json()
    meta = j["chart"]["result"][0]["meta"]
    price, prev = meta["regularMarketPrice"], meta.get("chartPreviousClose") or meta.get("previousClose")
    return {"name": name, "symbol": sym, "price": round(price, 4), "change_pct": round((price / prev - 1) * 100, 2) if prev else 0.0}


def _yahoo(symbols: dict):
    with ThreadPoolExecutor(6) as ex:
        out = [r for r in ex.map(lambda it: _safe(_yahoo_one, it), symbols.items()) if r]
    if not out:
        raise ValueError("no Yahoo quotes")
    return out


def _safe(fn, arg):
    try:
        return fn(arg)
    except Exception:  # noqa: BLE001
        return None


def _crypto(ids):
    j = http_get("https://api.coingecko.com/api/v3/simple/price",
                 params={"ids": ",".join(ids), "vs_currencies": "eur", "include_24hr_change": "true"}).json()
    return [{"name": i.capitalize(), "symbol": i, "price": j[i]["eur"], "change_pct": round(j[i].get("eur_24h_change", 0), 2)} for i in ids if i in j]


def _mse(cfg):
    """MSE home page 'Latest Equity Prices': <a href="/reports/SYM">SYM</a> then <span>price</span> <span>change</span>."""
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(http_get(cfg["mse_url"]).text, "html.parser")
    head = soup.find(lambda t: t.name in ("h2", "h3") and "Latest Equity Prices" in t.get_text())
    if not head:
        raise ValueError("'Latest Equity Prices' heading not found")
    names, seen, out = cfg.get("mse_names", {}), set(), []
    for a in head.find_all_next("a", href=re.compile(r"/reports/")):
        if a.find_previous(lambda t: t.name in ("h2", "h3")) is not head:
            break  # left the section
        sym = a.get_text(strip=True).upper()
        if not re.fullmatch(r"[A-Z0-9]{2,6}", sym) or sym in seen:
            continue
        row = a.find_parent("div").parent if a.find_parent("div") else None
        spans = [sp.get_text(strip=True).replace("\u2212", "-") for sp in (row.find_all("span") if row else [])][:2]
        try:
            price, chg = float(spans[0]), float(spans[1])
        except (ValueError, IndexError):
            continue
        seen.add(sym)
        base = price - chg
        out.append({"symbol": sym, "name": names.get(sym, sym), "price": price, "change_pct": round(chg / base * 100, 2) if base else 0.0})
    if not out:
        raise ValueError("MSE prices not found on home page; parser needs update")
    return out


def _mse_index(url):
    """MSE index from the official daily Price List PDF, e.g. 'MSE Equity Total Return Index: 10,591.942 Previous Index: 10,564.612'."""
    import io

    from pypdf import PdfReader

    text = " ".join((pg.extract_text() or "") for pg in PdfReader(io.BytesIO(http_get(url, timeout=25).content)).pages[:3])
    text = re.sub(r"\s+", " ", text)
    for name in ("MSE Equity Price Index", "MSE Equity Total Return Index"):
        m = re.search(re.escape(name) + r":?\s*([\d,]+\.\d+)(?:.{0,40}?Previous Index:?\s*([\d,]+\.\d+))?", text)
        if m:
            val = float(m.group(1).replace(",", ""))
            prev = float(m.group(2).replace(",", "")) if m.group(2) else None
            return {"name": name, "value": val, "change_pct": round((val / prev - 1) * 100, 3) if prev else None}
    raise ValueError("index not found in price list")


def run(status):
    cfg = load_json(CONFIG / "sources.json")["markets"]
    last = load_json(STATE / "markets.json") or load_json(SEED / "markets.json")
    data = {"updated": now_iso(), "global": last["global"], "crypto": last["crypto"], "mse": last["mse"]}
    jobs = {"global": (_yahoo, cfg["yahoo"]), "crypto": (_crypto, cfg["crypto"]), "mse": (_mse, cfg)}
    with ThreadPoolExecutor(3) as ex:
        futs = {k: ex.submit(fn, arg) for k, (fn, arg) in jobs.items()}
    for key, f in futs.items():
        try:
            data[key] = f.result()
            status.ok(f"markets.{key}", len(data[key]))
        except Exception as e:  # noqa: BLE001
            data.setdefault("stale", []).append(key)
            status.stale(f"markets.{key}", e)
    try:
        data["mse_index"] = _mse_index(cfg["mse_pricelist_pdf"])
        status.ok("markets.mse_index", 1)
    except Exception as e:  # noqa: BLE001
        data["mse_index"] = last.get("mse_index")
        status.stale("markets.mse_index", e)
    if not data.get("stale"):
        data.pop("stale", None)
    save_json(STATE / "markets.json", data)
    save_json(OUT / "markets.json", data)
