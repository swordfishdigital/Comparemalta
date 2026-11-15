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
  "telco-mobile": '<path d="M4 20v-3M9 20v-7M14 20V9M19 20V4"/>',
  "telco-broadband": '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
  "insurance": '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  "investing": '<path d="M3 20h18M5 16l4-5 4 3 6-8M15 6h4v4"/>',
  "restaurants": '<path d="M6 3v7a2 2 0 0 0 4 0V3M8 3v18M17 3c-2.5 2-2.5 7 0 9v9"/>',
  "news": '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>',
  "markets": '<path d="M3 20h18M6 16V10M10 16V6M14 16v-4M18 16V8"/>'
};
const TINT = {"business-accounts":"#c8102e","bank-accounts":"#0b2545","savings":"#12805c","personal-loans":"#b8862b","mortgages":"#1d5fbf","credit-cards":"#7a3e9d",
  "fintech":"#0e7c86","money-transfer":"#d0561b","telco-mobile":"#1d5fbf","telco-broadband":"#0e7c86","insurance":"#12805c","investing":"#b8862b","restaurants":"#c8102e"};

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


/* Merill: CompareMalta's mascot: an original stylised Blue Rock Thrush (Monticola solitarius), Malta's national bird.
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
  return `<svg class="mascot ${cls}" width="${size}" height="${Math.round(size * .8)}" viewBox="0 0 120 96" role="img" aria-label="Merill, the CompareMalta blue rock thrush">${birdG(mood)}</svg>`;
}
function logo(size = 32) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#0d2a4a"/>
    <g transform="translate(-3.5 3.5) scale(.38)">${birdG()}</g></svg>`;
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

return {icon, iconTile, mono, foodCover, newsThumb, hero, mascot, logo, TINT};
})();
