// Where "Ask the Thrush" sends questions. "api" = same origin (/api/ask), used by agent/dev.mjs.
// In production set this to the deployed Cloudflare Worker, e.g. "https://comparemalta-agent.<account>.workers.dev".
// If the agent cannot be reached, the site falls back to its built-in keyword search.
window.CM_AGENT_URL = window.CM_AGENT_URL || "api";
