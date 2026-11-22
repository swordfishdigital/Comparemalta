# CompareMalta.ai articles ("Malta today" features)

Three original articles a week (Monday, Wednesday, Friday) appear inside the "Malta today" news stream, on the home page and as static, indexable pages at `/<lang>/articles/<slug>/`.

## How publishing works

1. Add one file: `data/articles/<slug>.json` (slug: lowercase, hyphens, e.g. `best-beaches-malta-2026`).
2. Commit and push to `main`.
3. The `daily-feeds` workflow (every 6 hours, or *Run workflow* by hand) runs `feeds/articles.py`, which downloads the photos, writes `site/data/articles*.json` and the static pages, and adds them to the sitemap and `llms.txt`.

A `date` in the future keeps an article hidden until that day, so articles can be queued. `"draft": true` hides it.

## Format

```json
{
 "slug": "michelin-malta-2026",
 "date": "2026-11-22T16:00:00+00:00",
 "topic":   {"en": "Food & Drink", "mt": "Ikel u Xorb", "it": "Cibo e vino"},
 "kicker":  {"en": "Malta today · Feature", "mt": "Malta llum · Artiklu", "it": "Malta oggi · Approfondimento"},
 "title":   {"en": "...", "mt": "...", "it": "..."},
 "summary": {"en": "1 to 2 sentences", "mt": "...", "it": "..."},
 "intro":   {"en": "paragraph\nparagraph", "mt": "...", "it": "..."},
 "hero_query": "File:Exact Wikimedia Commons file name.jpg",
 "sections": [
  {"heading": {"en": "..."}, "intro": {"en": "optional"},
   "items": [
    {"name": "Place or product", "locality": "Valletta", "price": "€€ (only if verified)",
     "badge": {"en": "1 Star"}, "badge_kind": "star | bib | other",
     "cuisine": {"en": "short type/category line"},
     "text": {"en": "2 to 3 sentences", "mt": "...", "it": "..."},
     "url": "https://official-site (only if verified)",
     "image_query": "File:Exact Commons file.jpg", "image_alt": "What the photo shows"}
   ]}
 ],
 "outro":   {"en": "...", "mt": "...", "it": "..."},
 "sources": [{"name": "Publisher, date", "url": "https://..."}]
}
```

Every text field takes `en`, `mt` and `it`. Items are numbered automatically in order (the "ranking"); an article without a list can use sections with no items.

## Editorial rules

- Useful to people living in or visiting Malta, and ideally tied to what CompareMalta.ai compares: money, banking and fintech, loans and property, telco, shopping and groceries, food and restaurants, travel and transport, practical life in Malta, and timely local events. Mix topics across the week; do not repeat a topic from the last 6 articles (check `data/articles/`).
- Facts only from sources found that day; list them in `sources`. No invented figures, prices, ratings, opening hours or URLs. Leave `price` and `url` out when not verified.
- Write in our own words. Never copy sentences from sources; quotes under 15 words and at most one per source.
- Say how the list is ordered (by distinction, by price, by our own data, alphabetical) and be honest when there is no real ranking.
- No em dashes or en dashes anywhere. Plain, friendly British English; natural Maltese and Italian, not word-for-word translations.
- Neutral on politics; no medical, legal or investment advice; no affiliate claims.
- Photos: only freely licensed Wikimedia Commons files (CC0, public domain, CC BY, CC BY-SA), landscape, showing the real place or a fitting scene. Pin the exact `File:` name after checking it on Commons. Never use photos from restaurants, brands, news sites or social media. Credits are added automatically.
- 8 to 12 list items or 600 to 1,000 words is the usual length.
