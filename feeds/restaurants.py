"""Restaurants: Google Places API (New) text search when GOOGLE_PLACES_KEY is set; otherwise curated seed.
Also picks a deterministic 'today's picks' set that rotates daily."""
import hashlib
import os
from datetime import date

import requests

from .common import CONFIG, SEED, STATE, OUT, OFFLINE, load_json, now_iso, save_json

PRICE = {"PRICE_LEVEL_INEXPENSIVE": 1, "PRICE_LEVEL_MODERATE": 2, "PRICE_LEVEL_EXPENSIVE": 3, "PRICE_LEVEL_VERY_EXPENSIVE": 4}


def _places(key, query):
    r = requests.post(
        "https://places.googleapis.com/v1/places:searchText",
        headers={"X-Goog-Api-Key": key,
                 "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.priceLevel,places.primaryTypeDisplayName,places.googleMapsUri,places.websiteUri,places.photos"},
        json={"textQuery": query, "regionCode": "MT", "languageCode": "en"}, timeout=20)
    r.raise_for_status()
    for p in r.json().get("places", []):
        yield {"provider": p["displayName"]["text"], "area": p.get("formattedAddress", "").split(",")[-2].strip() if "," in p.get("formattedAddress", "") else "",
               "cuisine": p.get("primaryTypeDisplayName", {}).get("text", "Restoran"), "price_level": PRICE.get(p.get("priceLevel"), 2),
               "rating": p.get("rating"), "reviews": p.get("userRatingCount", 0), "highlight": "",
               "url": p.get("websiteUri") or p.get("googleMapsUri"), "maps": p.get("googleMapsUri"),
               # Places photo: served through our /img proxy (see README) so the API key never reaches the browser.
               "photo": f"/img/place?name={p['photos'][0]['name']}" if p.get("photos") else None}


def run(status):
    key = os.getenv("GOOGLE_PLACES_KEY")
    items = []
    if key and not OFFLINE:
        seen = set()
        for q in load_json(CONFIG / "sources.json")["restaurants"]["google_places_queries"]:
            try:
                for p in _places(key, q):
                    if p["provider"] not in seen and (p["reviews"] or 0) >= 50:
                        seen.add(p["provider"])
                        items.append(p)
            except Exception as e:  # noqa: BLE001
                status.stale(f"restaurants.{q}", e)
        if items:
            status.ok("restaurants", len(items))
    if not items:
        items = load_json(STATE / "restaurants.json", {}).get("items") or load_json(SEED / "products.json")["restaurants"]
        status.stale("restaurants", "using cached/seed list (set GOOGLE_PLACES_KEY for live data)")
    else:
        save_json(STATE / "restaurants.json", {"items": items, "updated": now_iso()})

    seed_day = int(hashlib.md5(date.today().isoformat().encode()).hexdigest(), 16)
    good = sorted([i for i in items if (i.get("rating") or 0) >= 4.4], key=lambda i: i["provider"])
    picks = [good[(seed_day + k * 7) % len(good)] for k in range(min(3, len(good)))] if good else []
    save_json(OUT / "dining.json", {"updated": now_iso(), "date": date.today().isoformat(), "picks": picks})
