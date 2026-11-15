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
    """MSE home page lists 'Latest Equity Prices' as links to /reports/SYMBOL followed by 'price change'."""
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(http_get(cfg["mse_url"]).text, "html.parser")
    names, seen, out = cfg.get("mse_names", {}), set(), []
    for a in soup.select('a[href*="/reports/"]'):
        sym = a.get_text(strip=True).upper()
        if not re.fullmatch(r"[A-Z0-9]{2,6}", sym) or sym in seen:
            continue
        nxt = a.find_next(string=re.compile(r"-?\d+\.\d+\s+-?\d+\.\d+"))
        if not nxt:
            continue
        price, chg = map(float, re.search(r"(-?\d+\.\d+)\s+(-?\d+\.\d+)", nxt).groups())
        seen.add(sym)
        base = price - chg
        out.append({"symbol": sym, "name": names.get(sym, sym), "price": price, "change_pct": round(chg / base * 100, 2) if base else 0.0})
    if not out:
        raise ValueError("MSE prices not found on home page; parser needs update")
    return out


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
    if not data.get("stale"):
        data.pop("stale", None)
    save_json(STATE / "markets.json", data)
    save_json(OUT / "markets.json", data)
