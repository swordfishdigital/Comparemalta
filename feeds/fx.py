"""FX rates from the European Central Bank (official EUR reference rates, ~16:00 CET each TARGET day)."""
import xml.etree.ElementTree as ET

from .common import CONFIG, OUT, SEED, STATE, http_get, load_json, now_iso, save_json

NS = {"e": "http://www.ecb.int/vocabulary/2002-08-01/eurofxref"}


def _parse(xml_text: str) -> dict[str, dict[str, float]]:
    root = ET.fromstring(xml_text)
    out = {}
    for day in root.findall(".//e:Cube[@time]", NS):
        out[day.get("time")] = {c.get("currency"): float(c.get("rate")) for c in day.findall("e:Cube", NS)}
    return out


def run(status):
    cfg = load_json(CONFIG / "sources.json")["fx"]
    try:
        hist = _parse(http_get(cfg["ecb_hist90"]).text)
        dates = sorted(hist)
        latest, prev = dates[-1], dates[-2]
        rates = []
        for ccy in cfg["show"]:
            if ccy not in hist[latest]:
                continue
            series = [hist[d].get(ccy) for d in dates if hist[d].get(ccy)]
            r, p = hist[latest][ccy], hist[prev].get(ccy, hist[latest][ccy])
            rates.append({"ccy": ccy, "rate": r, "change_pct": round((r / p - 1) * 100, 3), "spark": series[-30:]})
        data = {"base": "EUR", "date": latest, "source": "ECB euro foreign exchange reference rates",
                "updated": now_iso(), "rates": rates, "all": hist[latest]}
        save_json(STATE / "fx.json", data)
        status.ok("fx", len(rates))
    except Exception as e:  # noqa: BLE001
        data = load_json(STATE / "fx.json") or load_json(SEED / "fx.json")
        data["stale"] = True
        status.stale("fx", e)
    save_json(OUT / "fx.json", data)
