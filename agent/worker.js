/**
 * CompareMalta.ai "Ask Blue" agent.
 *
 * Runs as a Cloudflare Worker (or locally via agent/dev.mjs). The browser posts a question;
 * the worker runs a Claude tool-use loop over the site's own daily JSON data and returns
 * a short answer plus up to three picks. Product links, scores and figures in the picks are
 * filled in from the data by the worker, never by the model, so nothing can be invented.
 *
 * Env:
 *   ANTHROPIC_API_KEY  (secret)  Claude API key
 *   SITE_URL                     where the site's /data/*.json lives, e.g. https://comparemalta.ai
 *   ALLOWED_ORIGINS              comma-separated origins allowed to call the agent ("*" for dev)
 *   MODEL                        default claude-sonnet-5-5
 *   CONTACT_WEBHOOK   (secret)   where partnership enquiries are posted (Slack/Zapier/Make/Formspree URL)
 *   NEWSLETTER_PROVIDER          mailchimp | brevo | webhook, plus MAILCHIMP_API_KEY + MAILCHIMP_LIST_ID,
 *                                or BREVO_API_KEY + BREVO_LIST_ID + BREVO_DOI_TEMPLATE_ID, or NEWSLETTER_WEBHOOK
 */

const API = "https://api.anthropic.com/v1/messages";
const MAX_STEPS = 6;
const MAX_Q = 600;
const LANGS = { en: "English", mt: "Maltese (Malti)", it: "Italian" };

/* ---------------- data access (cached per isolate for 5 minutes) ---------------- */
const cache = new Map();
async function data(env, name) {
  const hit = cache.get(name);
  if (hit && Date.now() - hit.t < 300_000) return hit.v;
  const r = await fetch(`${env.SITE_URL.replace(/\/$/, "")}/data/${name}.json`, { cf: { cacheTtl: 300 } });
  if (!r.ok) throw new Error(`data ${name}: HTTP ${r.status}`);
  const v = await r.json();
  cache.set(name, { t: Date.now(), v });
  return v;
}

const SLIM = (row, cols) => {
  const out = { provider: row.provider };
  for (const c of cols) if (row[c] !== undefined && row[c] !== null) out[c] = row[c];
  for (const k of ["product", "score", "affiliated", "checked", "demo", "stale"]) if (row[k] !== undefined) out[k] = row[k];
  return out;
};

/* ---------------- tools the model can call ---------------- */
const TOOLS = [
  {
    name: "list_categories",
    description: "List every comparison category on CompareMalta.ai with its slug, title, the fields available for each product and how the Blue score (0-10) is weighted. Call this first if unsure which category fits.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "search_products",
    description: "Return products in one category, ranked by Blue score unless sort_by is given. Use filters to respect the user's constraints (e.g. min_deposit <= 20000, multi_currency = true, data_gb >= 999, area = 'Valletta'). Numbers are euros, percentages are plain numbers (2.6 = 2.6%). data_gb 999 means unlimited.",
    input_schema: {
      type: "object",
      properties: {
        category: { type: "string", description: "Category slug from list_categories" },
        filters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              field: { type: "string" },
              op: { type: "string", enum: ["<=", ">=", "=", "!=", "contains"] },
              value: {},
            },
            required: ["field", "op", "value"],
          },
        },
        sort_by: { type: "string", description: "Field to sort by, or 'score' (default)" },
        order: { type: "string", enum: ["asc", "desc"] },
        limit: { type: "integer", minimum: 1, maximum: 10 },
      },
      required: ["category"],
    },
  },
  {
    name: "get_markets",
    description: "Latest market snapshot: Malta Stock Exchange equities and index, global indices and commodities, crypto in EUR, ECB deposit rate and EUR FX rates, with update times.",
    input_schema: { type: "object", properties: { mse_symbols: { type: "array", items: { type: "string" } } } },
  },
  {
    name: "convert_currency",
    description: "Convert an amount between currencies using today's ECB reference rates.",
    input_schema: { type: "object", properties: { amount: { type: "number" }, from: { type: "string" }, to: { type: "string" } }, required: ["amount", "from", "to"] },
  },
  {
    name: "loan_calculator",
    description: "Monthly repayment, total repaid and total interest for a loan or mortgage (annuity).",
    input_schema: { type: "object", properties: { amount: { type: "number" }, annual_rate_pct: { type: "number" }, years: { type: "number" }, upfront_fees: { type: "number" } }, required: ["amount", "annual_rate_pct", "years"] },
  },
  {
    name: "get_news",
    description: "Today's Malta headlines from local publishers (title, source, time, short summary, link). Optional topic: Business, Property, Politics, Lifestyle, Tech, Malta.",
    input_schema: { type: "object", properties: { topic: { type: "string" }, limit: { type: "integer", minimum: 1, maximum: 10 } } },
  },
  {
    name: "show_results",
    description: "Finish. Give the reply the user will read and up to three picks. Every pick must be a product returned by search_products in this conversation. If you need more information from the user, ask one short question in `answer` and leave picks empty.",
    input_schema: {
      type: "object",
      properties: {
        answer: { type: "string", description: "2-4 short sentences in the user's language. Plain text, no markdown, no em dashes." },
        picks: {
          type: "array",
          maxItems: 3,
          items: {
            type: "object",
            properties: {
              category: { type: "string" },
              provider: { type: "string" },
              product: { type: "string" },
              why: { type: "string", description: "One short reason in the user's language" },
            },
            required: ["category", "provider", "why"],
          },
        },
        open_category: { type: "string", description: "Optional category slug for a 'see full table' link" },
      },
      required: ["answer"],
    },
  },
];

function cmp(a, op, b) {
  if (op === "contains") return String(a ?? "").toLowerCase().includes(String(b).toLowerCase());
  if (typeof b === "boolean") return op === "!=" ? a !== b : a === b;
  if (op === "=") return String(a).toLowerCase() === String(b).toLowerCase();
  if (op === "!=") return String(a).toLowerCase() !== String(b).toLowerCase();
  const x = Number(a), y = Number(b);
  if (Number.isNaN(x)) return false;
  return op === "<=" ? x <= y : x >= y;
}

async function runTool(env, name, input, seen) {
  switch (name) {
    case "list_categories": {
      const c = await data(env, "categories");
      return Object.entries(c.config).map(([slug, cfg]) => ({
        slug, title: cfg.title_en, fields: cfg.columns.map(x => x.key),
        score_weights: cfg.score.map(s => `${s.key} ${Math.round(s.w * 100)}% (${s.dir === "low" ? "lower is better" : "higher is better"})`),
        products: (c.index.find(i => i.slug === slug) || {}).count,
      }));
    }
    case "search_products": {
      const c = await data(env, "categories");
      const cfg = c.config[input.category];
      if (!cfg) return { error: `Unknown category '${input.category}'. Call list_categories.` };
      const d = await data(env, "cat-" + input.category);
      let rows = d.items.filter(r => (input.filters || []).every(f => cmp(r[f.field], f.op, f.value)));
      const key = input.sort_by || "score";
      const dir = input.order || (key === "score" ? "desc" : "asc");
      rows.sort((a, b) => ((a[key] ?? 0) > (b[key] ?? 0) ? 1 : -1) * (dir === "desc" ? -1 : 1));
      rows = rows.slice(0, input.limit || 6);
      rows.forEach(r => seen.add(`${input.category}|${r.provider}|${r.product || ""}`));
      return { category: input.category, updated: d.updated, sample_data: d.items.some(r => r.demo), results: rows.map(r => SLIM(r, cfg.columns.map(x => x.key))) };
    }
    case "get_markets": {
      const [m, fx] = await Promise.all([data(env, "markets"), data(env, "fx")]);
      const mse = input.mse_symbols?.length ? m.mse.filter(x => input.mse_symbols.includes(x.symbol)) : m.mse.slice(0, 12);
      return { updated: m.updated, mse_index: m.mse_index, mse, global: m.global, crypto: m.crypto, ecb_deposit_rate: fx.policy, fx_date: fx.date, fx: fx.rates?.map(r => ({ ccy: r.ccy, eur_rate: r.rate, change_pct: r.change_pct })), sample_data: !!(m.demo || fx.demo) };
    }
    case "convert_currency": {
      const fx = await data(env, "fx");
      const all = { EUR: 1, ...(fx.all || {}) };
      const f = input.from.toUpperCase(), t = input.to.toUpperCase();
      if (!all[f] || !all[t]) return { error: `Unsupported currency. Available: ${Object.keys(all).join(", ")}` };
      return { amount: input.amount, from: f, to: t, result: +(input.amount / all[f] * all[t]).toFixed(2), rate: +(all[t] / all[f]).toFixed(6), source: "ECB reference rate", date: fx.date };
    }
    case "loan_calculator": {
      const P = input.amount, r = input.annual_rate_pct / 1200, n = Math.round(input.years * 12);
      const m = r ? P * r / (1 - Math.pow(1 + r, -n)) : P / n;
      return { monthly: +m.toFixed(2), total_repaid: +(m * n + (input.upfront_fees || 0)).toFixed(2), total_interest: +(m * n - P).toFixed(2), months: n };
    }
    case "get_news": {
      const n = await data(env, "news");
      const items = n.items.filter(i => !input.topic || i.topic.toLowerCase() === input.topic.toLowerCase()).slice(0, input.limit || 5);
      return { updated: n.updated, items: items.map(i => ({ title: i.title, source: i.source, published: i.published, summary: i.summary, url: i.url, topic: i.topic })) };
    }
    default:
      return { error: `Unknown tool ${name}` };
  }
}

/* resolve the model's picks against real data: links, scores and key figures come from JSON only */
async function resolvePicks(env, picks = [], seen) {
  const c = await data(env, "categories");
  const out = [];
  for (const p of picks.slice(0, 3)) {
    const cfg = c.config[p.category];
    if (!cfg) continue;
    const d = await data(env, "cat-" + p.category);
    const row = d.items.find(r => r.provider.toLowerCase() === String(p.provider).toLowerCase() && (!p.product || !r.product || String(r.product).toLowerCase() === String(p.product).toLowerCase()))
             || d.items.find(r => r.provider.toLowerCase() === String(p.provider).toLowerCase());
    if (!row || !seen.has(`${p.category}|${row.provider}|${row.product || ""}`)) continue;
    const keyCol = cfg.columns.find(x => x.key === cfg.score[0].key) || cfg.columns[2];
    out.push({ category: p.category, provider: row.provider, product: row.product || row.area || "", why: String(p.why || "").slice(0, 220),
      key: { field: keyCol.key, fmt: keyCol.fmt || null, value: row[keyCol.key] ?? null }, score: row.score ?? null,
      url: row.url || row.maps || null, apply_url: row.apply_url || null, logo: row.logo || null, logo_light: !!row.logo_light, affiliated: !!row.affiliated, demo: !!row.demo });
  }
  return out;
}

const SYSTEM = (lang, today) => `You are Blue, the blue rock thrush (Malta's national bird, il-merill in Maltese) who runs "Ask Blue" on CompareMalta.ai, Malta's comparison site.
Today is ${today}. Reply in ${LANGS[lang] || "English"}.

How you work:
- Use the tools to look things up. Only state rates, fees, prices or figures that a tool returned in this conversation. Never guess or use outside knowledge for numbers.
- Pick the category, apply the user's constraints with filters, and finish with show_results (at most three picks, best first).
- Rankings follow the Blue score unless the user asked for something specific (cheapest, highest rate, fastest).
- If a result has sample_data or demo true, say briefly that figures are sample data for now. If a row is affiliated, mention it is a related party.
- For merchants asking about POS or card payments, work out the monthly cost from their card turnover when they give it (fee_pct x turnover + fee_fixed x sales + monthly_fee) and say which plan is cheapest at that volume.
- You compare and explain; you do not give personal financial advice. For loans and mortgages remind the user to confirm the final offer with the provider in one short clause.
- If the request is unclear or outside what the site covers, ask one short question or say what you can compare.
- Style: warm, plain, brief. 2 to 4 short sentences. No markdown, no lists, no em dashes.`;

/* ---------------- Claude tool-use loop ---------------- */
async function claude(env, body) {
  const r = await fetch(API, {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json",
      // Service keys that are not scoped to a workspace need the workspace id on every call.
      ...(env.ANTHROPIC_WORKSPACE_ID ? { "anthropic-workspace-id": env.ANTHROPIC_WORKSPACE_ID } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Claude API ${r.status}: ${(await r.text()).slice(0, 300)}`);
  return r.json();
}

export async function ask(env, { q, lang = "en", history = [] }) {
  const seen = new Set();
  const messages = [
    ...history.slice(-6).map(h => ({ role: h.role === "assistant" ? "assistant" : "user", content: String(h.content).slice(0, MAX_Q) })),
    { role: "user", content: q.slice(0, MAX_Q) },
  ];
  const trace = [];
  for (let step = 0; step < MAX_STEPS; step++) {
    const res = await claude(env, {
      model: env.MODEL || "claude-sonnet-5-5",
      max_tokens: 1200,
      system: SYSTEM(lang, new Date().toISOString().slice(0, 10)),
      tools: TOOLS,
      // Newer models only accept "auto" (and "none"), so we steer with instructions instead of forcing a tool.
      tool_choice: { type: "auto" },
      messages,
    });
    messages.push({ role: "assistant", content: res.content });
    const calls = res.content.filter(b => b.type === "tool_use");
    const done = calls.find(b => b.name === "show_results");
    if (done) {
      const picks = await resolvePicks(env, done.input.picks, seen);
      return { answer: String(done.input.answer || "").replace(/\s*[—–]\s*/g, ", "), picks, open_category: done.input.open_category || picks[0]?.category || null, trace };
    }
    if (!calls.length) {
      const text = res.content.filter(b => b.type === "text").map(b => b.text).join(" ").trim();
      return { answer: text, picks: [], open_category: null, trace };
    }
    const results = [];
    for (const call of calls) {
      let out;
      try { out = await runTool(env, call.name, call.input || {}, seen); } catch (e) { out = { error: String(e.message || e) }; }
      trace.push(call.name);
      results.push({ type: "tool_result", tool_use_id: call.id, content: JSON.stringify(out).slice(0, 12000) });
    }
    if (step >= MAX_STEPS - 2) results.push({ type: "text", text: "You have enough data. Finish now by calling show_results." });
    messages.push({ role: "user", content: results });
  }
  return { answer: "", picks: [], open_category: null, trace };
}

/* ---------------- HTTP: CORS, limits, routing ---------------- */
const buckets = new Map(); // best-effort per-isolate rate limit: 20 requests / 10 min / IP
function limited(ip) {
  const now = Date.now(), b = buckets.get(ip) || { n: 0, t: now };
  if (now - b.t > 600_000) { b.n = 0; b.t = now; }
  b.n++; buckets.set(ip, b);
  return b.n > 20;
}
function cors(env, origin) {
  const allowed = (env.ALLOWED_ORIGINS || "*").split(",").map(s => s.trim());
  const ok = allowed.includes("*") || allowed.includes(origin);
  return { "access-control-allow-origin": ok ? (allowed.includes("*") ? "*" : origin) : "null", "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type", vary: "origin" };
}
const json = (obj, status, headers) => new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json; charset=utf-8", ...headers } });

/* ---------------- partnership / contact form ---------------- */
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i;
async function contact(request, env, h) {
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "local";
  if (limited("c:" + ip)) return json({ error: "rate_limited" }, 429, h);
  let b; try { b = await request.json(); } catch { return json({ error: "bad json" }, 400, h); }
  const clip = (v, n) => String(v || "").trim().slice(0, n);
  const lead = { name: clip(b.name, 100), company: clip(b.company, 120), email: clip(b.email, 160), topic: clip(b.topic, 80),
    message: clip(b.message, 3000), lang: clip(b.lang, 2), page: clip(b.page, 300), at: new Date().toISOString() };
  if (!lead.name || !lead.company || !EMAIL.test(lead.email) || !lead.message) return json({ error: "invalid" }, 400, h);
  const text = `New partnership enquiry (${lead.topic})\n${lead.name}, ${lead.company} <${lead.email}>\n\n${lead.message}`;
  try {
    if (env.CONTACT_WEBHOOK) {  // Slack/Teams incoming webhook, Zapier/Make, Formspree... anything that accepts JSON
      const r = await fetch(env.CONTACT_WEBHOOK, { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify({ text, ...lead }) });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
    } else if (env.saveLead) {
      await env.saveLead(lead);  // local dev: appended to data/state/leads.jsonl
    } else {
      return json({ error: "contact not configured" }, 503, h);
    }
    return json({ ok: true }, 200, h);
  } catch (e) {
    console.error(e);
    return json({ error: "send_failed" }, 502, h);
  }
}

/* ---------------- weekly newsletter signup ----------------
   NEWSLETTER_PROVIDER = mailchimp | brevo | webhook. Mailchimp and Brevo both send a confirmation email first
   (double opt-in), which is what GDPR expects for marketing email in Malta and the EU. */
async function subscribe(request, env, h) {
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "local";
  if (limited("s:" + ip)) return json({ error: "rate_limited" }, 429, h);
  let b; try { b = await request.json(); } catch { return json({ error: "bad json" }, 400, h); }
  if (b.website) return json({ ok: true, double_opt_in: true }, 200, h);  // honeypot: pretend success
  const email = String(b.email || "").trim().toLowerCase().slice(0, 190);
  const lang = ["en", "mt", "it"].includes(b.lang) ? b.lang : "en";
  if (!EMAIL.test(email) || !b.consent) return json({ error: "invalid" }, 400, h);
  const sub = { email, lang, source: String(b.source || "site").slice(0, 40), at: new Date().toISOString() };
  try {
    const p = (env.NEWSLETTER_PROVIDER || "").toLowerCase();
    if (p === "mailchimp") {
      const dc = String(env.MAILCHIMP_API_KEY).split("-").pop();
      const r = await fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${env.MAILCHIMP_LIST_ID}/members`, {
        method: "POST", headers: { authorization: "Basic " + btoa("cm:" + env.MAILCHIMP_API_KEY), "content-type": "application/json" },
        body: JSON.stringify({ email_address: email, status: "pending", language: lang, tags: [`lang-${lang}`, sub.source] }),
      });
      if (!r.ok && !/Member Exists/i.test(await r.text())) throw new Error(`mailchimp ${r.status}`);
      return json({ ok: true, double_opt_in: true }, 200, h);
    }
    if (p === "brevo") {
      const r = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
        method: "POST", headers: { "api-key": env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ email, includeListIds: [Number(env.BREVO_LIST_ID)], templateId: Number(env.BREVO_DOI_TEMPLATE_ID),
          redirectionUrl: env.BREVO_REDIRECT_URL || "https://comparemalta.ai/#newsletter", attributes: { LANGUAGE: lang.toUpperCase() } }),
      });
      if (!r.ok) throw new Error(`brevo ${r.status}`);
      return json({ ok: true, double_opt_in: true }, 200, h);
    }
    if (p === "webhook" && env.NEWSLETTER_WEBHOOK) {
      const r = await fetch(env.NEWSLETTER_WEBHOOK, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(sub) });
      if (!r.ok) throw new Error(`webhook ${r.status}`);
      return json({ ok: true, double_opt_in: false }, 200, h);
    }
    if (env.saveSubscriber) { await env.saveSubscriber(sub); return json({ ok: true, double_opt_in: false }, 200, h); }
    return json({ error: "newsletter not configured" }, 503, h);
  } catch (e) {
    console.error(e);
    return json({ error: "subscribe_failed" }, 502, h);
  }
}

export default {
  async fetch(request, env) {
    const h = cors(env, request.headers.get("origin") || "");
    if (request.method === "OPTIONS") return new Response(null, { headers: h });
    const url = new URL(request.url);
    if (url.pathname === "/health") return json({ ok: true, model: env.MODEL || "claude-sonnet-5-5", key: !!env.ANTHROPIC_API_KEY }, 200, h);
    if (url.pathname === "/contact" && request.method === "POST") return contact(request, env, h);
    if (url.pathname === "/subscribe" && request.method === "POST") return subscribe(request, env, h);
    if (url.pathname !== "/ask" || request.method !== "POST") return json({ error: "not found" }, 404, h);
    if (!env.ANTHROPIC_API_KEY) return json({ error: "agent not configured" }, 503, h);
    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "local";
    if (limited(ip)) return json({ error: "rate_limited" }, 429, h);
    let body;
    try { body = await request.json(); } catch { return json({ error: "bad json" }, 400, h); }
    const q = String(body.q || "").trim();
    if (!q) return json({ error: "empty question" }, 400, h);
    try {
      const out = await ask(env, { q, lang: ["en", "mt", "it"].includes(body.lang) ? body.lang : "en", history: Array.isArray(body.history) ? body.history : [] });
      return json(out, 200, h);
    } catch (e) {
      console.error(e);
      return json({ error: "agent_failed" }, 502, h);
    }
  },
};
