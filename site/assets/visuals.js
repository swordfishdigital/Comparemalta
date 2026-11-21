/* CompareMalta.ai: original inline SVG artwork: hero scene, category icons, provider monograms, food covers, news fallbacks.
   Everything is drawn in code, so it works offline and under strict CSP. No third-party logos are reproduced. */
window.CMV = (() => {
"use strict";

const ICON_PATHS = {
  "business-accounts": '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',
  "bank-accounts": '<path d="M3 10l9-6 9 6M5 10v8M9.7 10v8M14.3 10v8M19 10v8M3 21h18"/>',
  "savings": '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>',
  "personal-loans": '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9.5v5M18 9.5v5"/>',
  "mortgages": '<path d="M3 11l9-7 9 7M5 9.5V20h14V9.5M10 20v-6h4v6"/>',
  "credit-cards": '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
  "fintech": '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  "money-transfer": '<path d="M4 8h15l-3.5-3.5M20 16H5l3.5 3.5"/>',
  "pos": '<rect x="6" y="2" width="12" height="20" rx="2"/><rect x="9" y="5" width="6" height="4" rx="1"/><path d="M9 13h1M12 13h1M15 13h0M9 16h1M12 16h1M15 16h0M9 19h6"/>',
  "telco-mobile": '<path d="M4 20v-3M9 20v-7M14 20V9M19 20V4"/>',
  "telco-broadband": '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
  "insurance": '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  "investing": '<path d="M3 20h18M5 16l4-5 4 3 6-8M15 6h4v4"/>',
  "restaurants": '<path d="M6 3v7a2 2 0 0 0 4 0V3M8 3v18M17 3c-2.5 2-2.5 7 0 9v9"/>',
  "news": '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>',
  "markets": '<path d="M3 20h18M6 16V10M10 16V6M14 16v-4M18 16V8"/>'
};
const TINT = {"business-accounts":"#c8102e","bank-accounts":"#0b2545","savings":"#12805c","personal-loans":"#b8862b","mortgages":"#1d5fbf","credit-cards":"#7a3e9d",
  "fintech":"#0e7c86","money-transfer":"#d0561b","pos":"#7a3e9d","telco-mobile":"#1d5fbf","telco-broadband":"#0e7c86","insurance":"#12805c","investing":"#b8862b","restaurants":"#c8102e"};

function icon(key, size = 22, color = "currentColor") {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[key] || ICON_PATHS.news}</svg>`;
}
function iconTile(key, size = 44) {
  const c = TINT[key] || "#0b2545";
  return `<span class="ico-tile" style="width:${size}px;height:${size}px;background:${c}14;color:${c}">${icon(key, Math.round(size * .5))}</span>`;
}

function hash(s) { let h = 2166136261; for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
const MONO = ["#0b2545", "#c8102e", "#12805c", "#1d5fbf", "#b8862b", "#7a3e9d", "#0e7c86", "#d0561b"];
function mono(name, size = 34) {
  const words = String(name).replace(/[^A-Za-zÀ-ž0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  const ini = (words.length > 1 ? words[0][0] + words[1][0] : (words[0] || "?").slice(0, 2)).toUpperCase();
  const c = MONO[hash(name) % MONO.length];
  return `<span class="mono" style="width:${size}px;height:${size}px;background:${c};font-size:${Math.round(size * .38)}px">${ini}</span>`;
}

/* Maltese-tile pattern: four petals in a square, as on traditional cement floor tiles. */
function tilePattern(id, a, b) {
  return `<pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse">
    <rect width="40" height="40" fill="${a}"/>
    <path d="M20 4c4 6 4 10 0 16-4-6-4-10 0-16zM20 36c-4-6-4-10 0-16 4 6 4 10 0 16zM4 20c6-4 10-4 16 0-6 4-10 4-16 0zM36 20c-6 4-10 4-16 0 6-4 10-4 16 0z" fill="${b}" opacity=".55"/>
    <circle cx="20" cy="20" r="2.4" fill="${b}"/><path d="M0 0h40v40H0z" fill="none" stroke="${b}" stroke-opacity=".25"/></pattern>`;
}

const GLYPH = {
  fish: '<path d="M150 112c22-26 72-30 104 0-32 30-82 26-104 0z" fill="#1d5fbf"/><path d="M252 112l26-18v36z" fill="#1d5fbf"/><circle cx="174" cy="106" r="4" fill="#fff"/><path d="M196 96c6 10 6 22 0 32M214 96c6 10 6 22 0 32" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>',
  pizza: '<circle cx="200" cy="110" r="46" fill="#e8b04a"/><circle cx="200" cy="110" r="38" fill="#d9532b"/><path d="M200 72v76M162 110h76M173 83l54 54M227 83l-54 54" stroke="#e8b04a" stroke-width="3"/><g fill="#fbe6b0"><circle cx="186" cy="94" r="6"/><circle cx="218" cy="102" r="6"/><circle cx="196" cy="128" r="6"/><circle cx="222" cy="124" r="5"/></g>',
  pot: '<path d="M158 102h84l-8 44c-2 8-8 12-16 12h-36c-8 0-14-4-16-12z" fill="#b5532f"/><rect x="150" y="92" width="100" height="12" rx="6" fill="#8e3d20"/><path d="M190 92c0-8 20-8 20 0" stroke="#8e3d20" stroke-width="6" fill="none"/><path d="M176 72c-4-8 4-12 0-20M200 72c-4-8 4-12 0-20M224 72c-4-8 4-12 0-20" stroke="#9aa3b0" stroke-width="3" fill="none" stroke-linecap="round"/>',
  cloche: '<path d="M148 134a52 52 0 0 1 104 0z" fill="#c9a46a"/><rect x="138" y="134" width="124" height="8" rx="4" fill="#8f7140"/><circle cx="200" cy="78" r="7" fill="#8f7140"/><path d="M170 112c6-14 18-22 30-24" stroke="#fff" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"/>',
  farm: '<circle cx="186" cy="112" r="22" fill="#d9532b"/><circle cx="216" cy="104" r="18" fill="#e8b04a"/><circle cx="210" cy="128" r="16" fill="#12805c"/><path d="M186 90c2-8 8-12 14-12" stroke="#12805c" stroke-width="4" fill="none" stroke-linecap="round"/>',
  plate: '<path d="M176 74v34a8 8 0 0 0 16 0V74M184 74v76M224 74c-10 8-10 30 0 36v40" stroke="#0b2545" stroke-width="6" fill="none" stroke-linecap="round"/>'
};
function glyphFor(cuisine) {
  const c = String(cuisine).toLowerCase();
  if (/sea|fish|fisk|pesce/.test(c)) return ["fish", "#dbeaf5", "#1d5fbf"];
  if (/pizza|ital/.test(c)) return ["pizza", "#fbe6d4", "#d9532b"];
  if (/tradition|maltese|gozit|malti/.test(c)) return ["pot", "#f3e3c7", "#b5532f"];
  if (/fine|european|tasting/.test(c)) return ["cloche", "#efe6d6", "#8f7140"];
  if (/farm/.test(c)) return ["farm", "#e3f1e6", "#12805c"];
  return ["plate", "#efe6d6", "#0b2545"];
}
function foodCover(name, cuisine) {
  const [g, bg, fg] = glyphFor(cuisine), id = "t" + hash(name);
  return `<svg class="cover" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${String(cuisine).replace(/"/g, "")}">
    <defs>${tilePattern(id, bg, fg)}<radialGradient id="${id}g"><stop offset=".55" stop-color="#000" stop-opacity=".0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></radialGradient></defs>
    <rect width="400" height="220" fill="url(#${id})"/><rect width="400" height="220" fill="url(#${id}g)"/>
    <ellipse cx="200" cy="120" rx="84" ry="80" fill="#000" opacity=".08"/>
    <circle cx="200" cy="112" r="78" fill="#fff"/><circle cx="200" cy="112" r="64" fill="none" stroke="${fg}" stroke-opacity=".18" stroke-width="2"/>
    ${GLYPH[g]}</svg>`;
}

const TOPIC = {Business: ["#0b2545", "markets"], Politics: ["#7a3e9d", "bank-accounts"], Lifestyle: ["#c8102e", "restaurants"], Tech: ["#0e7c86", "fintech"], Malta: ["#1d5fbf", "news"]};
function newsThumb(topic) {
  const [c, ic] = TOPIC[topic] || TOPIC.Malta, id = "n" + hash(topic);
  return `<svg class="thumb" viewBox="0 0 160 110" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${tilePattern(id, c, "#ffffff")}</defs>
    <rect width="160" height="110" fill="url(#${id})" opacity=".9"/><rect width="160" height="110" fill="${c}" opacity=".55"/>
    <g transform="translate(62 37)" color="#fff">${icon(ic, 36, "#fff")}</g></svg>`;
}


/* Blue: CompareMalta's mascot: an original stylised Blue Rock Thrush (Monticola solitarius), Malta's national bird.
   Drawn facing right in a 120x100 box; feet touch y≈88. */
function birdG(mood = "") {
  const eye = mood === "wink"
    ? '<path d="M85.5 31.5q2.5-2 5 0" stroke="#0b1520" stroke-width="1.8" fill="none" stroke-linecap="round"/>'
    : '<circle cx="88" cy="31" r="2.8" fill="#0b1520"/><circle cx="88.9" cy="30.1" r=".9" fill="#fff"/>';
  return `<g class="merill">
    <path d="M36 60L7 73l4 6 6-2-3 6 26-15z" fill="#21477e"/>
    <path d="M12 75l22-12M15 80l20-14" stroke="#16335d" stroke-width="1.2" opacity=".7"/>
    <path d="M60 74l-2 13M68 74l1 13" stroke="#2a2f36" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M53 88h9M64 88h9" stroke="#2a2f36" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M34 60c0-20 22-28 40-24 12 2 18 12 14 22-4 12-26 18-42 14-6-2-12-6-12-12z" fill="#3b70b3"/>
    <path d="M56 70c12 1 26-4 30-13 1 9-12 17-30 13z" fill="#5d93d4" opacity=".9"/>
    <path d="M44 52c8-10 26-10 34 0-8 8-24 12-38 14z" fill="#264f8c"/>
    <path d="M48 56c8-3 18-4 26-3M46 60c8-2 16-3 24-2" stroke="#4a7fc0" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <circle cx="84" cy="34" r="13.5" fill="#477fc4"/>
    <path d="M73 28c4-6 12-8 18-4" stroke="#7aa9e0" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="M96 31l15 3.4-15 3.4z" fill="#1b2633"/>
    ${eye}
  </g>`;
}
function mascot(size = 120, mood = "", cls = "") {
  return `<svg class="mascot ${cls}" width="${size}" height="${Math.round(size * .8)}" viewBox="0 0 120 96" role="img" aria-label="Blue, the CompareMalta blue rock thrush">${birdG(mood)}</svg>`;
}
function logo(size = 32) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#0d2a4a"/>
    <g transform="translate(-3.5 3.5) scale(.38)">${birdG()}</g></svg>`;
}


/* Category illustrations: 48px grid, 1.75 stroke, duotone (currentColor line, --ic-soft fill, --ic-accent detail).
   Matches the design document: royal-blue line icons on stone/white, peach accents on navy. */
const CI = {
  bank: `<path d="M8 18L24 8l16 10z" fill="var(--ic-soft)"/><path d="M8 18L24 8l16 10M10 18h28M13 22v12M21 22v12M27 22v12M35 22v12M9 38h30M7 42h34"/><circle cx="24" cy="14.2" r="2.2" fill="var(--ic-accent)" stroke="none"/>`,
  home: `<path d="M10 42V16l11-7 11 7v26z" fill="var(--ic-soft)"/><path d="M10 42V16l11-7 11 7v26M6 42h38M18 42v-7a3 3 0 0 1 6 0v7"/><rect x="14" y="18.5" width="14" height="8.5" rx="1" fill="var(--ic-bg)"/><path d="M21 18.5V27M14 22.7h14M12.5 27h17"/><circle cx="38" cy="29" r="3.6" fill="var(--ic-accent)"/><path d="M38 32.6V41M38 37.5h2.6"/>`,
  cards: `<rect x="12" y="9" width="29" height="19" rx="3" fill="var(--ic-soft)"/><rect x="7" y="18" width="30" height="20" rx="3" fill="var(--ic-bg)"/><path d="M7 24.5h30M22 33h10"/><rect x="11" y="28.5" width="6.5" height="5" rx="1.2" fill="var(--ic-accent)" stroke="none"/>`,
  business: `<rect x="7" y="16" width="34" height="23" rx="3" fill="var(--ic-soft)"/><path d="M18 16v-3a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3M7 26h34"/><rect x="7" y="16" width="34" height="23" rx="3" fill="none"/><rect x="20.5" y="22.5" width="7" height="7" rx="1.5" fill="var(--ic-accent)"/>`,
  phone: `<rect x="13" y="6" width="19" height="36" rx="4" fill="var(--ic-soft)"/><path d="M20 10.5h5M21.5 37.5h2"/><path d="M18.5 30v-2.5M22.5 30v-6M26.5 30v-9.5" stroke="var(--ic-accent)" stroke-width="2.6"/><path d="M36 17a8 8 0 0 1 0 12M40 13a13.5 13.5 0 0 1 0 20"/>`,
  eat: `<circle cx="24" cy="28" r="11" fill="var(--ic-soft)"/><circle cx="24" cy="28" r="6.2" fill="var(--ic-bg)"/><path d="M7 15v7a2.2 2.2 0 0 0 4.4 0v-7M9.2 15v27M41 15c-2.4 2-2.4 8.5 0 10.5V42"/><path d="M20 11c-1.6-2 1.6-3 0-5.5M24.5 11c-1.6-2 1.6-3 0-5.5M29 11c-1.6-2 1.6-3 0-5.5" stroke="var(--ic-accent)"/>`,
  markets: `<path d="M7 37l8.5-8 8 4 9-12 9.5-6V40H7z" fill="var(--ic-soft)" stroke="none"/><path d="M7 8v32h35M7 37l8.5-8 8 4 9-12 9.5-6"/><circle cx="15.5" cy="29" r="2" fill="var(--ic-bg)"/><circle cx="23.5" cy="33" r="2" fill="var(--ic-bg)"/><circle cx="32.5" cy="21" r="2" fill="var(--ic-bg)"/><circle cx="42" cy="15" r="3" fill="var(--ic-accent)"/>`,
  news: `<path d="M8 11h27v29H12a4 4 0 0 1-4-4z" fill="var(--ic-soft)"/><path d="M35 17h5v19a4 4 0 0 1-4 4h-1M13 17h17M13 23h8M13 28.5h8M13 34h17"/><rect x="24" y="22" width="7" height="7.5" rx="1" fill="var(--ic-accent)" stroke="none"/><path d="M8 11h27v29H12a4 4 0 0 1-4-4z" fill="none"/>`,
  savings: `<path d="M9 30v6c0 2 4.9 3.6 11 3.6s11-1.6 11-3.6v-6" fill="var(--ic-soft)"/><ellipse cx="20" cy="30" rx="11" ry="3.6" fill="var(--ic-bg)"/><path d="M9 22.5V30M31 22.5V30"/><ellipse cx="20" cy="22.5" rx="11" ry="3.6" fill="var(--ic-accent)"/><path d="M33 15l7-7M34.5 8H40v5.5"/>`,
  loan: `<rect x="6" y="13" width="36" height="22" rx="3" fill="var(--ic-soft)"/><circle cx="24" cy="24" r="6" fill="var(--ic-bg)"/><path d="M26.6 21.4a3.4 3.4 0 1 0 0 5.2M20.6 23.2h4.2M20.6 25h4.2"/><circle cx="11.5" cy="18.5" r="1.8" fill="var(--ic-accent)" stroke="none"/><circle cx="36.5" cy="29.5" r="1.8" fill="var(--ic-accent)" stroke="none"/><path d="M10 39h28"/>`,
  fintech: `<rect x="9" y="6" width="18" height="34" rx="4" fill="var(--ic-soft)"/><path d="M16 10.5h4"/><rect x="21" y="22" width="20" height="13" rx="2.5" fill="var(--ic-bg)"/><path d="M21 26.5h20"/><rect x="24" y="29.5" width="5" height="3" rx=".8" fill="var(--ic-accent)" stroke="none"/>`,
  pos: `<rect x="13" y="5" width="22" height="38" rx="4" fill="var(--ic-soft)"/><rect x="17" y="9" width="14" height="9" rx="1.5" fill="var(--ic-bg)"/><path d="M20 23.5h1.5M26.5 23.5H28M20 28.5h1.5M26.5 28.5H28M20 33.5h8"/><path d="M38 14a6 6 0 0 1 0 9M41.5 11a11 11 0 0 1 0 15" stroke="var(--ic-accent)" stroke-width="2.4"/>`,
  transfer: `<circle cx="24" cy="24" r="15" fill="var(--ic-soft)" stroke="none"/><path d="M11 19h24l-5.5-5.5M37 29H13l5.5 5.5"/><circle cx="35" cy="19" r="2.4" fill="var(--ic-accent)" stroke="none"/>`,
  wifi: `<rect x="8" y="30" width="32" height="10" rx="3" fill="var(--ic-soft)"/><path d="M14 30v-5M34 30v-5"/><circle cx="14" cy="35" r="1.6" fill="var(--ic-accent)" stroke="none"/><circle cx="19.5" cy="35" r="1.6" fill="var(--ic-accent)" stroke="none"/><path d="M12 15a17 17 0 0 1 24 0M16.5 19.5a10.5 10.5 0 0 1 15 0"/><circle cx="24" cy="23.5" r="1.8" fill="currentColor" stroke="none"/>`,
  shield: `<path d="M24 6l15 5.5v11c0 9.5-6.5 15.5-15 18.5-8.5-3-15-9-15-18.5v-11z" fill="var(--ic-soft)"/><path d="M17.5 23.5l4.5 4.5 9-9" stroke="var(--ic-accent)" stroke-width="2.6"/>`,
  invest: `<rect x="9" y="27" width="7" height="13" rx="1.5" fill="var(--ic-soft)"/><rect x="20.5" y="20" width="7" height="20" rx="1.5" fill="var(--ic-soft)"/><rect x="32" y="13" width="7" height="27" rx="1.5" fill="var(--ic-accent)"/><path d="M6 42h36M9 18l9-7 6 4 9-8M28 7h5v5"/>`
};
const CI_FOR = {"bank-accounts":"bank",banking:"bank",mortgages:"home",loans:"home","credit-cards":"cards",cards:"cards","business-accounts":"business",business:"business",
  "telco-mobile":"phone",telco:"phone",restaurants:"eat",dining:"eat",eat:"eat",markets:"markets",news:"news",today:"news",savings:"savings","personal-loans":"loan",
  fintech:"fintech","money-transfer":"transfer",pos:"pos","telco-broadband":"wifi",insurance:"shield",investing:"invest"};
function catIcon(key, size = 44) {
  return `<svg class="ci" width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CI[CI_FOR[key] || key] || CI.news}</svg>`;
}


/* Category banners: same language as the restaurant covers (Maltese tile pattern, white plate, filled glyph).
   Glyphs are drawn in a 100x100 box; C = category colour, D = navy, A = accent. */
const BG = {
  bank:["#e3e8fb","#2b4cc4","#f2b58e"], home:["#fbe6d8","#c4683a","#f6c453"], cards:["#efe4f6","#7a3e9d","#f2b58e"],
  business:["#e2f2ec","#18805b","#f6c453"], phone:["#def0f2","#0e7c86","#f2b58e"], eat:["#fbe2dd","#c03a2b","#f6c453"],
  markets:["#f6ecd6","#b8862b","#2b4cc4"], news:["#0d2a4a","#f2b58e","#2b4cc4"], savings:["#e2f2ec","#18805b","#f6c453"],
  loan:["#fbe6d8","#c4683a","#18805b"], fintech:["#e3e8fb","#2b4cc4","#f2b58e"], transfer:["#def0f2","#0e7c86","#f2b58e"],
  wifi:["#def0f2","#0e7c86","#f2b58e"], pos:["#efe4f6","#7a3e9d","#f6c453"], shield:["#e2f2ec","#18805b","#f6c453"], invest:["#f6ecd6","#b8862b","#2b4cc4"]
};
const D = "#0d2a4a";
const GL = {
  bank: (C, A) => `<path d="M18 40L50 20l32 20z" fill="${C}"/><circle cx="50" cy="32" r="5" fill="${A}"/><rect x="24" y="44" width="8" height="26" rx="2" fill="${C}"/><rect x="38" y="44" width="8" height="26" rx="2" fill="${C}"/><rect x="54" y="44" width="8" height="26" rx="2" fill="${C}"/><rect x="68" y="44" width="8" height="26" rx="2" fill="${C}"/><rect x="16" y="72" width="68" height="8" rx="2" fill="${D}"/>`,
  home: (C, A) => `<path d="M24 82V42l26-20 26 20v40z" fill="${C}"/><rect x="33" y="44" width="34" height="14" rx="2" fill="${A}"/><path d="M50 44v14M33 51h34" stroke="${C}" stroke-width="2"/><rect x="30" y="58" width="40" height="3" fill="${D}"/><rect x="43" y="64" width="14" height="18" rx="7" fill="${D}"/><circle cx="82" cy="66" r="6" fill="${A}"/><path d="M82 72v12M82 79h4" stroke="${D}" stroke-width="3" stroke-linecap="round"/>`,
  cards: (C, A) => `<rect x="30" y="24" width="52" height="34" rx="6" fill="${A}"/><rect x="18" y="38" width="56" height="36" rx="6" fill="${C}"/><rect x="18" y="46" width="56" height="7" fill="${D}" opacity=".85"/><rect x="25" y="59" width="12" height="9" rx="2" fill="#f6c453"/><rect x="44" y="62" width="22" height="4" rx="2" fill="#fff" opacity=".7"/>`,
  business: (C, A) => `<path d="M38 36v-7a5 5 0 0 1 5-5h14a5 5 0 0 1 5 5v7" stroke="${D}" stroke-width="5" fill="none"/><rect x="16" y="36" width="68" height="44" rx="8" fill="${C}"/><rect x="16" y="54" width="68" height="5" fill="${D}" opacity=".3"/><rect x="43" y="49" width="14" height="14" rx="3" fill="${A}"/>`,
  phone: (C, A) => `<rect x="30" y="16" width="36" height="68" rx="9" fill="${C}"/><rect x="35" y="24" width="26" height="48" rx="3" fill="#fff"/><rect x="39" y="56" width="5" height="10" rx="1" fill="${A}"/><rect x="46" y="49" width="5" height="17" rx="1" fill="${A}"/><rect x="53" y="41" width="5" height="25" rx="1" fill="${A}"/><path d="M73 38a14 14 0 0 1 0 22M80 31a24 24 0 0 1 0 36" stroke="${D}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  eat: (C, A) => `<circle cx="50" cy="56" r="24" fill="${C}"/><circle cx="50" cy="56" r="15" fill="${A}"/><path d="M14 30v14a5 5 0 0 0 10 0V30M19 30v54" stroke="${D}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M86 30c-6 4-6 18 0 22v32" stroke="${D}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M42 26c-3-4 3-6 0-11M50 26c-3-4 3-6 0-11M58 26c-3-4 3-6 0-11" stroke="${C}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  markets: (C, A) => `<rect x="20" y="58" width="13" height="22" rx="3" fill="${C}" opacity=".55"/><rect x="38" y="46" width="13" height="34" rx="3" fill="${C}" opacity=".8"/><rect x="56" y="34" width="13" height="46" rx="3" fill="${C}"/><path d="M18 52l20-12 16 6 24-20" stroke="${D}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="78" cy="26" r="6" fill="${A}"/><rect x="14" y="80" width="72" height="4" rx="2" fill="${D}"/>`,
  news: (C, A) => `<rect x="20" y="22" width="52" height="58" rx="5" fill="${D}"/><rect x="72" y="32" width="10" height="44" rx="4" fill="${C}"/><rect x="27" y="30" width="38" height="6" rx="2" fill="#fff"/><rect x="27" y="42" width="16" height="16" rx="2" fill="${A}"/><rect x="47" y="43" width="18" height="4" rx="2" fill="#fff" opacity=".7"/><rect x="47" y="51" width="18" height="4" rx="2" fill="#fff" opacity=".7"/><rect x="27" y="64" width="38" height="4" rx="2" fill="#fff" opacity=".7"/><rect x="27" y="71" width="28" height="4" rx="2" fill="#fff" opacity=".7"/>`,
  savings: (C, A) => `<ellipse cx="44" cy="72" rx="22" ry="7" fill="${C}"/><rect x="22" y="58" width="44" height="14" fill="${C}"/><ellipse cx="44" cy="58" rx="22" ry="7" fill="${A}"/><rect x="22" y="44" width="44" height="14" fill="${C}" opacity=".85"/><ellipse cx="44" cy="44" rx="22" ry="7" fill="${A}"/><path d="M70 36l12-12M74 24h8v8" stroke="${D}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  loan: (C, A) => `<rect x="14" y="30" width="72" height="42" rx="7" fill="${C}"/><circle cx="50" cy="51" r="13" fill="#fff"/><path d="M55 44a8 8 0 1 0 0 14M43 49h9M43 54h9" stroke="${D}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="24" cy="40" r="4" fill="${A}"/><circle cx="76" cy="62" r="4" fill="${A}"/>`,
  fintech: (C, A) => `<rect x="22" y="16" width="34" height="64" rx="8" fill="${C}"/><rect x="27" y="24" width="24" height="44" rx="3" fill="#fff"/><rect x="42" y="48" width="44" height="28" rx="5" fill="${D}"/><rect x="42" y="55" width="44" height="6" fill="${A}"/><rect x="47" y="66" width="10" height="6" rx="1.5" fill="#f6c453"/>`,
  transfer: (C, A) => `<path d="M18 38h54l-12-12" stroke="${C}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M82 62H28l12 12" stroke="${D}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="76" cy="38" r="6" fill="${A}"/>`,
  wifi: (C, A) => `<path d="M18 40a46 46 0 0 1 64 0M28 50a32 32 0 0 1 44 0M38 60a18 18 0 0 1 24 0" stroke="${C}" stroke-width="6" fill="none" stroke-linecap="round"/><rect x="20" y="68" width="60" height="16" rx="5" fill="${D}"/><circle cx="32" cy="76" r="3" fill="${A}"/><circle cx="42" cy="76" r="3" fill="${A}"/>`,
  pos: (C, A) => `<rect x="30" y="14" width="40" height="72" rx="9" fill="${C}"/><rect x="36" y="22" width="28" height="18" rx="3" fill="#fff"/><rect x="40" y="27" width="14" height="4" rx="2" fill="${A}"/><g fill="#fff"><rect x="37" y="47" width="7" height="6" rx="1.5"/><rect x="46.5" y="47" width="7" height="6" rx="1.5"/><rect x="56" y="47" width="7" height="6" rx="1.5"/><rect x="37" y="57" width="7" height="6" rx="1.5"/><rect x="46.5" y="57" width="7" height="6" rx="1.5"/><rect x="56" y="57" width="7" height="6" rx="1.5"/></g><rect x="37" y="68" width="26" height="8" rx="3" fill="${A}"/><path d="M76 36a12 12 0 0 1 0 18M83 30a21 21 0 0 1 0 30" stroke="${D}" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="12" y="44" width="26" height="17" rx="3" fill="${D}" transform="rotate(-14 25 52)"/><rect x="12" y="49" width="26" height="4" fill="${A}" transform="rotate(-14 25 52)"/>`,
  shield: (C, A) => `<path d="M50 14l30 11v20c0 20-13 32-30 38-17-6-30-18-30-38V25z" fill="${C}"/><path d="M36 50l9 9 19-19" stroke="${A}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
};
GL.invest = GL.markets;
function catBanner(key, dark = false) {
  const k = CI_FOR[key] || key, [bg, fg, acc] = BG[k] || BG.bank, id = "cb" + hash(key + dark);
  const ring = dark ? "rgba(255,255,255,.18)" : fg;
  return `<svg class="cat-banner" viewBox="0 0 400 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>${tilePattern(id, bg, fg)}<radialGradient id="${id}g"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${dark ? .35 : .14}"/></radialGradient></defs>
    <rect width="400" height="150" fill="url(#${id})"/>${dark ? `<rect width="400" height="150" fill="${bg}" opacity=".55"/>` : ""}<rect width="400" height="150" fill="url(#${id}g)"/>
    <ellipse cx="200" cy="84" rx="62" ry="60" fill="#000" opacity=".08"/>
    <circle cx="200" cy="75" r="60" fill="#fff"/><circle cx="200" cy="75" r="51" fill="none" stroke="${ring}" stroke-opacity=".18" stroke-width="2"/>
    <g transform="translate(152.5 27.5) scale(.95)">${(GL[k] || GL.bank)(dark ? "#2b4cc4" : fg, acc)}</g></svg>`;
}

/* Hero: an imagined harbour skyline: limestone blocks, a dome, a bell tower, enclosed wooden balconies, bastion walls and a luzzu. */
function hero() {
  const blocks = [[18,178,70,92],[84,150,58,120],[138,190,52,80],[186,162,64,108],[370,170,62,100],[428,140,70,130],[494,182,56,88],[546,158,80,112]];
  const stone = ["#ecd9b1", "#e4cc9c", "#dcc08a", "#e8d3a6"];
  const balc = ["#c8102e", "#12805c", "#1d5fbf", "#d0561b"];
  let b = "";
  blocks.forEach(([x, y, w, h], i) => {
    b += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${stone[i % 4]}"/><rect x="${x}" y="${y}" width="${w}" height="5" fill="#c9ad78"/>`;
    for (let r = y + 18; r < y + h - 40; r += 34) for (let cx = x + 10; cx < x + w - 14; cx += 22) {
      if ((i + r + cx) % 3 === 0) {
        const col = balc[(i + Math.floor(r / 34)) % 4];
        b += `<rect x="${cx - 3}" y="${r - 3}" width="18" height="22" rx="1.5" fill="${col}"/><path d="M${cx + 6} ${r - 3}v22M${cx - 3} ${r + 8}h18" stroke="#fff" stroke-opacity=".55"/><rect x="${cx - 5}" y="${r + 19}" width="22" height="3" fill="#8f7140"/>`;
      } else b += `<rect x="${cx}" y="${r}" width="10" height="16" rx="5" fill="#7d6640" opacity=".55"/>`;
    }
  });
  return `<svg class="hero-art" viewBox="0 0 640 440" role="img" aria-label="Illustrated Maltese harbour">
  <defs>
    <linearGradient id="hs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe0f2"/><stop offset=".7" stop-color="#f6ead2"/></linearGradient>
    <linearGradient id="hw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a86bd"/><stop offset="1" stop-color="#0b2545"/></linearGradient>
    <clipPath id="hc"><rect width="640" height="440" rx="22"/></clipPath>
  </defs>
  <g clip-path="url(#hc)">
    <rect width="640" height="440" fill="url(#hs)"/>
    <circle cx="520" cy="86" r="44" fill="#f6c453" opacity=".85"/>
    <path d="M60 70c18-10 40-10 56 0M420 50c14-8 30-8 44 0" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".8"/>
    ${b}
    <g>
      <rect x="262" y="186" width="96" height="84" fill="#e8d3a6"/>
      <rect x="276" y="160" width="68" height="30" fill="#dfc591"/>
      <path d="M272 162a38 46 0 0 1 76 0z" fill="#c9a46a"/><path d="M290 140c8-12 22-18 34-16" stroke="#fff" stroke-opacity=".4" stroke-width="5" fill="none" stroke-linecap="round"/>
      <rect x="303" y="104" width="14" height="14" fill="#dfc591"/><path d="M310 84v20M303 92h14" stroke="#8f7140" stroke-width="3"/>
      <rect x="296" y="214" width="28" height="56" rx="14" fill="#7d6640" opacity=".6"/>
      <rect x="358" y="128" width="26" height="142" fill="#e2c998"/><path d="M356 128l15-26 15 26z" fill="#c9a46a"/><rect x="364" y="146" width="14" height="22" rx="7" fill="#7d6640" opacity=".6"/><circle cx="371" cy="184" r="6" fill="#fff" stroke="#8f7140" stroke-width="2"/>
    </g>
    <path d="M0 262h640v46H0z" fill="#d4b47c"/>
    <path d="M0 262h640" stroke="#b99a63" stroke-width="3"/>
    ${Array.from({length: 32}, (_, i) => `<rect x="${i * 20 + 4}" y="254" width="11" height="9" fill="#d4b47c"/>`).join("")}
    <path d="M0 280h640M0 296h640" stroke="#c4a46c" stroke-opacity=".6"/>
    <rect y="306" width="640" height="134" fill="url(#hw)"/>
    <ellipse cx="530" cy="257" rx="40" ry="3" fill="#000" opacity=".12"/>
    <g transform="translate(445 124) scale(1.55)">${birdG()}</g>
    ${Array.from({length: 9}, (_, i) => `<path d="M${(i * 83) % 600} ${330 + (i * 37) % 100}q14-6 28 0t28 0" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>`).join("")}
    <g transform="translate(150 344)">
      <path d="M0 0c40 10 150 10 196 0l-10 26c-50 10-130 10-176 0z" fill="#f6c453"/>
      <path d="M4 9c50 9 140 9 186 0" stroke="#1d5fbf" stroke-width="7"/><path d="M8 19c48 8 130 8 178 0" stroke="#c8102e" stroke-width="5"/>
      <path d="M0 0l-12-30 12 4zM196 0l12-30-12 4z" fill="#12805c"/>
      <ellipse cx="24" cy="6" rx="8" ry="4.5" fill="#fff"/><circle cx="25" cy="6" r="2.6" fill="#0b2545"/>
      <path d="M96 0v-44M96 -44l26 30H96" stroke="#7d6640" stroke-width="3" fill="#fff"/>
      <path d="M2 36c60 8 130 8 190 0" stroke="#fff" stroke-opacity=".25" stroke-width="5"/>
    </g>
  </g></svg>`;
}

return {icon, iconTile, mono, foodCover, newsThumb, hero, mascot, logo, catIcon, catBanner, TINT};
})();
