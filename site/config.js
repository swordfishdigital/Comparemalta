// Where "Ask Blue" sends questions. "api" = same origin (/api/ask), used by agent/dev.mjs.
// Production: Ask Blue runs on the Cloudflare Worker at api.comparemalta.ai (workers.dev kept as fallback).
// If the agent cannot be reached, the site falls back to its built-in keyword search.
// Production: the Cloudflare Worker (agent/). Local dev with agent/dev.mjs on localhost uses "api" (same origin).
window.CM_AGENT_URL = window.CM_AGENT_URL || (/^(localhost|127\.0\.0\.1)$|\.app\.github\.dev$/.test(location.hostname) ? "api" : (/(^|\.)comparemalta\.ai$/.test(location.hostname) ? "https://api.comparemalta.ai" : "https://comparemalta.denizguvendigital.workers.dev"));

// Partnership form: posts to the agent's /contact (forwarded to CONTACT_WEBHOOK). Optionally post somewhere else instead,
// and/or show an email address if sending fails.
window.CM_CONTACT_ENDPOINT = window.CM_CONTACT_ENDPOINT || "";
window.CM_CONTACT_EMAIL = window.CM_CONTACT_EMAIL || "info@comparemalta.ai";

// Newsletter signup: posts to the agent's /subscribe (Mailchimp / Brevo / webhook). Override with any endpoint that accepts JSON.
window.CM_NEWSLETTER_ENDPOINT = window.CM_NEWSLETTER_ENDPOINT || "";
