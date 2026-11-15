# CompareMalta.ai

Malta comparison site: business & personal accounts, savings, loans, mortgages, credit cards, fintech apps,
money transfer, mobile & broadband, insurance, investing platforms and restaurants, plus daily Malta news,
Malta Stock Exchange, global markets, crypto and ECB FX rates. Everything refreshes automatically every day.

## How it works

```
config/            categories.json (columns + score weights)   sources.json (every feed URL / regex)
data/seed/         curated catalogue: the starting list of providers & products
data/state/        last-known-good values (written by feeds, committed by the bot)
feeds/             Python feed engine  →  writes site/data/*.json
site/              static website (HTML + CSS + vanilla JS, no build step), reads site/data/*.json
.github/workflows/daily.yml   runs feeds twice a day and deploys to GitHub Pages
```

| Feed | Source | Schedule |
|---|---|---|
| FX | ECB euro reference rates (daily + 90-day history) | 16:30 Malta, weekdays |
| Global indices, gold, Brent | Yahoo Finance chart API | 05:15 + 16:30 |
| Crypto | CoinGecko public API | 05:15 + 16:30 |
| Malta Stock Exchange | borzamalta.com.mt home page “Latest Equity Prices” | 16:30 |
| News | RSS: Times of Malta, MaltaToday, Newsbook, Malta Independent, Lovin Malta, Business Now | 05:15 + 16:30 |
| Products (rates, fees, prices) | providers' public pages, regex per field (`config/sources.json`) | 05:15 |
| Restaurants | Google Places API (New) if `GOOGLE_PLACES_KEY` is set, otherwise curated list | 05:15 |

**Resilience:** every feed falls back to the last-known-good value, then to seed. A broken source never
blanks the site; rows show "Checked <date>" or "Last known" so users see freshness. `site/data/status.json`
reports health and the workflow fails (→ GitHub email) when fewer than half of the feeds succeed.

**Thrush score (0 to 10):** per category, each metric is min-max normalised across providers, weighted
(`config/categories.json → score`), and scaled to 10. The formula is shown under every table.

## Languages & visuals

- UI in **English, Maltese, Italian** (`T` and `COLS` in `site/assets/app.js`; category titles/intros as `title_mt`, `intro_it` … in `config/categories.json`). Default follows the browser language; choice is remembered.
- Maltese and Italian strings were machine-drafted. Have a native speaker review before launch.
- All artwork is original inline SVG (`site/assets/visuals.js`): harbour hero, category icons, provider monograms, Maltese-tile food covers, news fallbacks. No third-party logos.
- Real photos: news uses the publisher's RSS image when present (falls back to the illustration). Restaurants store a Google Places photo reference; serve it through a small `/img/place` proxy (e.g. a Cloudflare Worker) so the API key stays server-side, and show Google attribution.

## Ask the Thrush (AI agent)

The Compare box and the "Ask the Thrush" button talk to an AI agent (`agent/worker.js`) built on the Claude API with tool use.
The agent can only answer from the site's own daily data: it calls tools (`list_categories`, `search_products`, `get_markets`,
`convert_currency`, `loan_calculator`, `get_news`) and finishes with `show_results`. Product links, scores and figures in the
picks are filled in by the worker from `site/data/*.json`, never by the model, and picks the model did not actually look up are dropped.
If the agent is unreachable, the site falls back to its built-in keyword search.

- **Codespaces / local:** add `ANTHROPIC_API_KEY` as a Codespaces secret (GitHub → Settings → Codespaces → Secrets, give this repo access),
  then `node agent/dev.mjs` serves the site and the agent together on port 8000.
- **Production (Cloudflare Workers):** repo secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `ANTHROPIC_API_KEY`, repo variable
  `AGENT_ENABLED=true`; the `deploy-agent` workflow deploys on every change under `agent/`. Then set `window.CM_AGENT_URL` in
  `site/config.js` to the Worker URL. `ALLOWED_ORIGINS` in `agent/wrangler.toml` limits which sites may call it; there is also a
  per-IP limit of 20 questions per 10 minutes.
- Model: `MODEL` in `wrangler.toml` (default `claude-sonnet-5-5`).

## Run locally

```bash
pip install -r requirements.txt
python -m feeds.run_all            # live
CM_OFFLINE=1 python -m feeds.run_all   # from seed/state only
cd site && python -m http.server 8000  # open http://localhost:8000
```

## Deploy

1. Push the repo to GitHub, Settings → Pages → Source: **GitHub Actions**.
2. (Optional) Settings → Secrets → `GOOGLE_PLACES_KEY` for live restaurant data.
3. Point `comparemalta.ai` DNS to GitHub Pages (or Cloudflare Pages with the same `site/` folder).
4. Actions → daily-feeds → Run workflow once.

## Before launch (checklist)

- [ ] Replace seed product figures with verified ones; run feeds and check each `product.*` entry in `status.json`.
      Regexes in `sources.json` are first drafts (`"verified": false`) and need a pass against each live page.
- [ ] MSE parser: confirm the table selector on borzamalta.com.mt (or license MSE data feed).
- [ ] News: we store headline, ≤220-char summary and link only, and always link out. Check each publisher's RSS terms.
- [ ] Google Places: show Google attribution where Places data is displayed (Maps Platform terms).
- [ ] Legal: MFSA rules on credit intermediation / referral fees if adding "Apply" flows; affiliate disclosure
      (`"affiliated": true` rows show a "Related party" badge); GDPR cookie notice if analytics are added.

## Adding a category

Add a block to `config/categories.json` (columns + score), add rows to `data/seed/products.json`, optionally add
scrape targets to `config/sources.json`. The site picks it up automatically.
