// Local / Codespaces runner: serves the static site AND the agent on one port, so the browser
// talks to /api/ask on the same origin. Usage: ANTHROPIC_API_KEY=... node agent/dev.mjs
// The key comes from the environment (e.g. a Codespaces secret). Never commit it.
import http from "node:http";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import worker from "./worker.js";

const port = Number(process.env.PORT || 8000);
const SITE = fileURLToPath(new URL("../site/", import.meta.url));
const env = {
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  ANTHROPIC_WORKSPACE_ID: process.env.ANTHROPIC_WORKSPACE_ID,
  SITE_URL: process.env.SITE_URL || `http://localhost:${port}`,
  ALLOWED_ORIGINS: "*",
  MODEL: process.env.MODEL || "claude-sonnet-5-5",
  CONTACT_WEBHOOK: process.env.CONTACT_WEBHOOK,
  NEWSLETTER_PROVIDER: process.env.NEWSLETTER_PROVIDER, MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID: process.env.MAILCHIMP_LIST_ID,
  BREVO_API_KEY: process.env.BREVO_API_KEY, BREVO_LIST_ID: process.env.BREVO_LIST_ID, BREVO_DOI_TEMPLATE_ID: process.env.BREVO_DOI_TEMPLATE_ID, NEWSLETTER_WEBHOOK: process.env.NEWSLETTER_WEBHOOK,
  saveSubscriber: async sub => {
    const dir = fileURLToPath(new URL("../data/state/", import.meta.url));
    await mkdir(dir, { recursive: true });
    await appendFile(dir + "subscribers.jsonl", JSON.stringify(sub) + "\n");
    console.log("newsletter signup saved:", sub.email.replace(/^(.).*@/, "$1***@"));
  },
  saveLead: async lead => {
    const dir = fileURLToPath(new URL("../data/state/", import.meta.url));
    await mkdir(dir, { recursive: true });
    await appendFile(dir + "leads.jsonl", JSON.stringify(lead) + "\n");
    console.log("partnership enquiry saved:", lead.company, lead.email);
  },
};
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".md": "text/markdown; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml" };

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (url.pathname.startsWith("/api/")) {
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const r = await worker.fetch(new Request(`http://localhost:${port}${url.pathname.slice(4)}`, {
      method: req.method, headers: req.headers,
      body: ["GET", "HEAD", "OPTIONS"].includes(req.method) ? undefined : Buffer.concat(chunks),
    }), env);
    res.writeHead(r.status, Object.fromEntries(r.headers));
    return res.end(Buffer.from(await r.arrayBuffer()));
  }
  // folders serve their index.html, like GitHub Pages (/en/pos/ -> /en/pos/index.html)
  const path = normalize(join(SITE, decodeURIComponent(url.pathname).replace(/\/$/, "/index.html")));
  if (!path.startsWith(SITE)) { res.writeHead(403); return res.end(); }
  try {
    const body = await readFile(path);
    res.writeHead(200, { "content-type": TYPES[extname(path)] || "application/octet-stream", "cache-control": "no-cache" });
    res.end(body);
  } catch { res.writeHead(404); res.end("not found"); }
}).listen(port, () => console.log(`CompareMalta.ai + Ask Blue on http://localhost:${port} (Claude key set: ${!!env.ANTHROPIC_API_KEY}, model ${env.MODEL})`));
