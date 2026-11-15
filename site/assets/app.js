/* CompareMalta.ai — static front-end (EN / MT / IT). Reads JSON produced daily by /feeds into /data. */
(() => {
"use strict";
const V = window.CMV;

const T = {
 en:{mHi:"Hi, I'm Merill — Malta's blue rock thrush. Every morning I check the rates, fees and prices so you don't have to.",tip:"Merill's tip",tipTxt:"Look at the total cost, not just the headline rate — fees and terms can change the ranking.",mNo:"Merill looked everywhere but found nothing. Try another word.",banking:"Banking & Fintech",credit:"Loans & Cards",telco:"Telco",insurance:"Insurance",investing:"Investing",dining:"Food & Dining",news:"News",markets:"Markets",calc:"Tools",
  heroTitle:"Compare money, mobile and more in Malta.",heroLead:"Business accounts, bank accounts, loans, mortgages, cards, telco plans, insurance and restaurants — ranked with a transparent CompareMalta Score and refreshed every day.",
  search:"Search a product, bank or restaurant…",go:"Search",featured:"Featured: SME business accounts",featuredLead:"Malta's first side-by-side business account comparison — banks and EMIs.",
  seeAll:"See all",categories:"Compare by category",best:"Top pick",todayDining:"Today's dining picks",latestNews:"Latest Malta news",marketSnap:"Markets today",fx:"FX rates (ECB)",
  filter:"Filter…",sortBy:"Sort by",score:"Score",visit:"Visit",affiliated:"Related party",topPick:"Top pick",checked:"Checked",notChecked:"Catalogue data",stale:"Last known",
  all:"All",sources:"Sources",mse:"Malta Stock Exchange",global:"Global indices & commodities",crypto:"Crypto (EUR)",
  loanCalc:"Loan calculator",mortCalc:"Mortgage calculator",fxCalc:"Currency converter",amount:"Amount (€)",amt:"Amount",rate:"Interest rate (% p.a.)",years:"Term (years)",fee:"Upfront fees (€)",
  monthly:"Monthly payment",totalPay:"Total repayment",totalInt:"Total interest",aprc:"Est. APRC",price:"Property price (€)",deposit:"Deposit (€)",from:"From",to:"To",
  area:"Area",cuisine:"Cuisine",priceL:"Price",openMaps:"Open",diningLead:"Filter by area, cuisine and budget.",
  demo:"Preview mode: figures are sample data. Live values replace them on the first daily feed run.",
  disclaimer:"CompareMalta.ai is an independent comparison service. Rates and fees are collected daily from providers' public pages and may change; always confirm with the provider before applying. Not financial advice. Rows marked “Related party” are connected to the site's owners and are scored with the same formula as every other provider.",
  feeds:"Feed health",updated:"Updated",scoreHow:"How the score works",scoreTxt:"Each metric is normalised across all providers in the category (best = 1, worst = 0), weighted, and scaled to 10. Weights:",
  noRes:"No results.",results:"results",low:"lower is better",high:"higher is better",free:"Free",unlimited:"Unlimited",providers:"providers compared",daily:"Updated daily",cats:"categories"},
 mt:{mHi:"Bonġu, jien il-Merill — l-għasfur nazzjonali ta' Malta. Kull filgħodu niċċekkja r-rati, il-miżati u l-prezzijiet biex m'għandekx għalfejn.",tip:"Il-parir ta' Merill",tipTxt:"Ħares lejn l-ispiża totali, mhux biss lejn ir-rata — il-miżati u t-termini jistgħu jbiddlu l-klassifika.",mNo:"Merill fittex kullimkien iżda ma sab xejn. Ipprova kelma oħra.",banking:"Bankar u Fintech",credit:"Self u Karti",telco:"Telco",insurance:"Assigurazzjoni",investing:"Investiment",dining:"Ikel u Restoranti",news:"Aħbarijiet",markets:"Swieq",calc:"Għodod",
  heroTitle:"Qabbel il-flus, il-mobile u aktar f'Malta.",heroLead:"Kontijiet tan-negozju, kontijiet bankarji, self, self għad-dar, karti, pjanijiet tat-telefon, assigurazzjoni u restoranti — ikklassifikati b'CompareMalta Score trasparenti u aġġornati kuljum.",
  search:"Fittex prodott, bank jew restorant…",go:"Fittex",featured:"Prominenti: kontijiet tan-negozju għall-SMEs",featuredLead:"L-ewwel paragun ta' kontijiet tan-negozju f'Malta — banek u EMIs, wieħed ħdejn l-ieħor.",
  seeAll:"Ara kollox",categories:"Qabbel skont il-kategorija",best:"L-aħjar għażla",todayDining:"L-għażliet tal-ikel għal-lum",latestNews:"L-aħħar aħbarijiet minn Malta",marketSnap:"Is-swieq illum",fx:"Rati tal-kambju (ECB)",
  filter:"Iffiltra…",sortBy:"Ordna skont",score:"Punteġġ",visit:"Żur",affiliated:"Parti relatata",topPick:"L-aħjar",checked:"Iċċekkjat",notChecked:"Data tal-katalgu",stale:"L-aħħar magħruf",
  all:"Kollha",sources:"Sorsi",mse:"Borża ta' Malta",global:"Indiċijiet globali u komoditajiet",crypto:"Kripto (EUR)",
  loanCalc:"Kalkulatur tas-self",mortCalc:"Kalkulatur tas-self għad-dar",fxCalc:"Konvertitur tal-munita",amount:"Ammont (€)",amt:"Ammont",rate:"Rata tal-imgħax (% fis-sena)",years:"Terminu (snin)",fee:"Miżati bil-quddiem (€)",
  monthly:"Ħlas fix-xahar",totalPay:"Ħlas totali lura",totalInt:"Imgħax totali",aprc:"APRC stmat",price:"Prezz tal-propjetà (€)",deposit:"Depożitu (€)",from:"Minn",to:"Għal",
  area:"Żona",cuisine:"Kċina",priceL:"Prezz",openMaps:"Iftaħ",diningLead:"Iffiltra skont iż-żona, il-kċina u l-baġit.",
  demo:"Modalità ta' preview: iċ-ċifri huma data ta' kampjun. Il-valuri live jissostitwuhom fl-ewwel aġġornament ta' kuljum.",
  disclaimer:"CompareMalta.ai huwa servizz ta' paragun indipendenti. Ir-rati u l-miżati jinġabru kuljum mill-paġni pubbliċi tal-fornituri u jistgħu jinbidlu; dejjem ikkonferma mal-fornitur qabel tapplika. Mhux parir finanzjarju. Ir-ringieli mmarkati “Parti relatata” huma konnessi mas-sidien tas-sit u jingħataw punteġġ bl-istess formula bħal kull fornitur ieħor.",
  feeds:"Stat tal-feeds",updated:"Aġġornat",scoreHow:"Kif jaħdem il-punteġġ",scoreTxt:"Kull metrika tiġi normalizzata fost il-fornituri kollha fil-kategorija (l-aħjar = 1, l-agħar = 0), tingħata piż u tiġi skalata għal 10. Piżijiet:",
  noRes:"L-ebda riżultat.",results:"riżultati",low:"inqas huwa aħjar",high:"aktar huwa aħjar",free:"B'xejn",unlimited:"Bla limitu",providers:"fornituri mqabbla",daily:"Aġġornat kuljum",cats:"kategoriji"},
 it:{mHi:"Ciao, sono Merill, il passero solitario di Malta. Ogni mattina controllo tassi, commissioni e prezzi al posto tuo.",tip:"Il consiglio di Merill",tipTxt:"Guarda il costo totale, non solo il tasso: commissioni e condizioni possono cambiare la classifica.",mNo:"Merill ha cercato ovunque ma non ha trovato nulla. Prova un'altra parola.",banking:"Banca e Fintech",credit:"Prestiti e Carte",telco:"Telco",insurance:"Assicurazioni",investing:"Investimenti",dining:"Ristoranti",news:"Notizie",markets:"Mercati",calc:"Strumenti",
  heroTitle:"Confronta conti, mobile e molto altro a Malta.",heroLead:"Conti business, conti correnti, prestiti, mutui, carte, offerte telefoniche, assicurazioni e ristoranti — classificati con un CompareMalta Score trasparente e aggiornati ogni giorno.",
  search:"Cerca un prodotto, una banca o un ristorante…",go:"Cerca",featured:"In evidenza: conti business per PMI",featuredLead:"Il primo confronto dei conti business a Malta: banche e IMEL fianco a fianco.",
  seeAll:"Vedi tutti",categories:"Confronta per categoria",best:"Scelta migliore",todayDining:"I ristoranti consigliati oggi",latestNews:"Ultime notizie da Malta",marketSnap:"Mercati oggi",fx:"Tassi di cambio (BCE)",
  filter:"Filtra…",sortBy:"Ordina per",score:"Punteggio",visit:"Visita",affiliated:"Parte correlata",topPick:"Migliore",checked:"Verificato",notChecked:"Dati di catalogo",stale:"Ultimo valore noto",
  all:"Tutti",sources:"Fonti",mse:"Borsa di Malta",global:"Indici globali e materie prime",crypto:"Cripto (EUR)",
  loanCalc:"Calcolatore prestito",mortCalc:"Calcolatore mutuo",fxCalc:"Convertitore di valuta",amount:"Importo (€)",amt:"Importo",rate:"Tasso d'interesse (% annuo)",years:"Durata (anni)",fee:"Spese iniziali (€)",
  monthly:"Rata mensile",totalPay:"Totale da rimborsare",totalInt:"Interessi totali",aprc:"TAEG stimato",price:"Prezzo dell'immobile (€)",deposit:"Anticipo (€)",from:"Da",to:"A",
  area:"Zona",cuisine:"Cucina",priceL:"Prezzo",openMaps:"Apri",diningLead:"Filtra per zona, cucina e budget.",
  demo:"Modalità anteprima: i dati sono di esempio. I valori reali li sostituiscono al primo aggiornamento giornaliero.",
  disclaimer:"CompareMalta.ai è un servizio di confronto indipendente. Tassi e commissioni sono raccolti ogni giorno dalle pagine pubbliche dei fornitori e possono cambiare; verifica sempre con il fornitore prima di aderire. Non costituisce consulenza finanziaria. Le righe contrassegnate “Parte correlata” sono collegate ai proprietari del sito e ricevono il punteggio con la stessa formula di tutti gli altri fornitori.",
  feeds:"Stato dei feed",updated:"Aggiornato",scoreHow:"Come funziona il punteggio",scoreTxt:"Ogni metrica viene normalizzata tra tutti i fornitori della categoria (migliore = 1, peggiore = 0), ponderata e riportata su 10. Pesi:",
  noRes:"Nessun risultato.",results:"risultati",low:"più basso è meglio",high:"più alto è meglio",free:"Gratis",unlimited:"Illimitati",providers:"fornitori confrontati",daily:"Aggiornato ogni giorno",cats:"categorie"}
};
const COLS = {
 en:{provider:"Provider",product:"Product",monthly_fee:"Monthly fee",sepa_fee:"SEPA transfer",multi_currency:"Multi-currency",onboarding_days:"Onboarding (days)",licence:"Licence",card_fee:"Card fee / yr",atm_abroad_pct:"ATM abroad",app:"Mobile app",rate:"Rate",term_months:"Term (months)",min_deposit:"Min. deposit",apr:"Interest",aprc:"APRC",max_amount:"Max amount",max_term_years:"Max term (yrs)",fees:"Fees",rate_type:"Type",ltv:"Max LTV",max_term:"Max term",first_time:"First-time buyer",annual_fee:"Annual fee",fx_fee:"FX fee",rewards:"Rewards",fx_markup:"FX markup",iban:"IBAN",corridor:"Corridor",fee:"Fee",fx_margin:"FX margin",speed:"Speed",price:"Monthly",data_gb:"Data (GB)",eu_roaming_gb:"EU roaming (GB)",contract:"Contract",speed_mbps:"Speed (Mbps)",tv:"TV",type:"Type",from_price:"From / yr",online_quote:"Online quote",trade_fee:"Trade fee",custody_pct:"Custody / yr",mse_access:"MSE access",area:"Area",cuisine:"Cuisine",price_level:"Price",rating:"Rating",highlight:"Highlight"},
 mt:{provider:"Fornitur",product:"Prodott",monthly_fee:"Miżata fix-xahar",sepa_fee:"Trasferiment SEPA",multi_currency:"Multi-munita",onboarding_days:"Ftuħ (jiem)",licence:"Liċenzja",card_fee:"Miżata tal-karta/sena",atm_abroad_pct:"ATM barra",app:"App mobbli",rate:"Rata",term_months:"Terminu (xhur)",min_deposit:"Depożitu minimu",apr:"Imgħax",aprc:"APRC",max_amount:"Ammont massimu",max_term_years:"Terminu massimu (snin)",fees:"Miżati",rate_type:"Tip",ltv:"LTV massimu",max_term:"Terminu massimu",first_time:"L-ewwel dar",annual_fee:"Miżata annwali",fx_fee:"Miżata tal-kambju",rewards:"Premjijiet",fx_markup:"Markup tal-kambju",iban:"IBAN",corridor:"Rotta",fee:"Miżata",fx_margin:"Marġni tal-kambju",speed:"Ħeffa",price:"Fix-xahar",data_gb:"Data (GB)",eu_roaming_gb:"Roaming UE (GB)",contract:"Kuntratt",speed_mbps:"Veloċità (Mbps)",tv:"TV",type:"Tip",from_price:"Minn/sena",online_quote:"Kwotazzjoni online",trade_fee:"Miżata tat-trade",custody_pct:"Kustodja/sena",mse_access:"Aċċess għall-MSE",area:"Żona",cuisine:"Kċina",price_level:"Prezz",rating:"Klassifikazzjoni",highlight:"Speċjalità"},
 it:{provider:"Fornitore",product:"Prodotto",monthly_fee:"Canone mensile",sepa_fee:"Bonifico SEPA",multi_currency:"Multivaluta",onboarding_days:"Apertura (giorni)",licence:"Licenza",card_fee:"Costo carta/anno",atm_abroad_pct:"Prelievo estero",app:"App mobile",rate:"Tasso",term_months:"Durata (mesi)",min_deposit:"Deposito minimo",apr:"Interesse",aprc:"TAEG",max_amount:"Importo massimo",max_term_years:"Durata max (anni)",fees:"Spese",rate_type:"Tipo",ltv:"LTV massimo",max_term:"Durata massima",first_time:"Prima casa",annual_fee:"Canone annuo",fx_fee:"Commissione cambio",rewards:"Premi",fx_markup:"Ricarico cambio",iban:"IBAN",corridor:"Tratta",fee:"Commissione",fx_margin:"Margine cambio",speed:"Velocità",price:"Mensile",data_gb:"Dati (GB)",eu_roaming_gb:"Roaming UE (GB)",contract:"Contratto",speed_mbps:"Velocità (Mbps)",tv:"TV",type:"Tipo",from_price:"Da/anno",online_quote:"Preventivo online",trade_fee:"Commissione trade",custody_pct:"Custodia/anno",mse_access:"Accesso MSE",area:"Zona",cuisine:"Cucina",price_level:"Prezzo",rating:"Valutazione",highlight:"Punto forte"}
};
const LOCALE = {en: "en-GB", mt: "mt-MT", it: "it-IT"};
const NAV = [["banking","business-accounts"],["credit","personal-loans"],["telco","telco-mobile"],["insurance","insurance"],["investing","investing"],["dining","dining"],["news","news"],["markets","markets"],["calc","calculators"]];
const GROUP_NAV = {"Banka & Fintech":"banking","Kredi":"credit","Telekom":"telco","Sigorta":"insurance","Yatırım":"investing","Yaşam":"dining"};

let lang = "en";
try { lang = localStorage.getItem("cm_lang") || ({mt: "mt", it: "it"}[(navigator.language || "en").slice(0, 2)] || "en"); } catch (e) {}
if (!T[lang]) lang = "en";
const t = k => T[lang][k] ?? T.en[k] ?? k;
const D = {};
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const nf = (v, d = 2) => Number(v).toLocaleString(LOCALE[lang], {minimumFractionDigits: d, maximumFractionDigits: d});
const chg = v => `<span class="${v >= 0 ? "up" : "down"}">${v >= 0 ? "▲" : "▼"} ${nf(Math.abs(v))}%</span>`;
const ago = iso => { if (!iso) return ""; const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleString(LOCALE[lang], {day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}); };
const loc = (c, f) => c[`${f}_${lang}`] || c[`${f}_en`] || c[f];
const catTitle = c => loc(c, "title");
const colLabel = c => COLS[lang][c.key] || COLS.en[c.key] || c.label;

async function get(name) {
  if (D[name]) return D[name];
  try { const r = await fetch(`data/${name}.json`, {cache: "no-cache"}); D[name] = await r.json(); } catch (e) { D[name] = null; }
  return D[name];
}

function fmt(v, f) {
  if (v === null || v === undefined || v === "") return '<span class="muted">—</span>';
  switch (f) {
    case "eur": return v === 0 ? `<span class="free">${t("free")}</span>` : "€" + nf(v);
    case "eur0": return "€" + nf(v, 0);
    case "pct": return nf(v) + "%";
    case "pct0": return nf(v, 0) + "%";
    case "num": return v >= 999 ? t("unlimited") : nf(v, 0);
    case "bool": return v ? '<span class="yes">✓</span>' : '<span class="no">✕</span>';
    case "price": return '<span class="price">' + "€".repeat(v) + "</span>";
    case "rating": return "★ " + nf(v, 1);
    default: return esc(v);
  }
}
const scoreBadge = s => `<span class="score ${s >= 7 ? "" : s >= 4.5 ? "mid" : "low"}">${nf(s, 1)}</span>`;

function spark(vals, w = 90, h = 26) {
  if (!vals || vals.length < 2) return "";
  const lo = Math.min(...vals), hi = Math.max(...vals), rng = hi - lo || 1;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1) * w).toFixed(1)},${(h - 2 - (v - lo) / rng * (h - 4)).toFixed(1)}`).join(" ");
  const up = vals[vals.length - 1] >= vals[0];
  return `<svg class="spark" viewBox="0 0 ${w} ${h}"><polyline fill="none" stroke="${up ? "#12805c" : "#c8102e"}" stroke-width="1.6" points="${pts}"/></svg>`;
}

/* ---------- chrome ---------- */
function renderNav(route) {
  const grp = D.categories?.config[route]?.group;
  const active = NAV.find(([k, r]) => r === route)?.[0] || (grp && GROUP_NAV[grp]) || "";
  $("#nav").innerHTML = NAV.map(([k, r]) => `<a href="#${r}" class="${k === active ? "on" : ""}">${t(k)}</a>`).join("");
  $("#langSel").value = lang;
  document.documentElement.lang = lang;
}
async function renderChrome() {
  const [fx, mk, st, news] = await Promise.all([get("fx"), get("markets"), get("status"), get("news")]);
  const parts = [];
  (fx?.rates || []).slice(0, 6).forEach(r => parts.push(`<span><b>EUR/${r.ccy}</b>${nf(r.rate, 4)} ${chg(r.change_pct)}</span>`));
  (mk?.global || []).forEach(r => parts.push(`<span><b>${esc(r.name)}</b>${nf(r.price)} ${chg(r.change_pct)}</span>`));
  (mk?.mse || []).slice(0, 6).forEach(r => parts.push(`<span><b>MSE:${esc(r.symbol)}</b>€${nf(r.price, 3)} ${chg(r.change_pct)}</span>`));
  $("#tickerTrack").innerHTML = parts.join("") + parts.join("");
  const b = $("#demoBanner"); b.hidden = !(fx?.demo || mk?.demo || news?.demo); b.textContent = t("demo");
  $("#footDisclaimer").textContent = t("disclaimer");
  if (st) {
    const okRatio = st.total ? st.ok / st.total : 0;
    $("#footStatus").innerHTML = `<b>${t("feeds")}</b><br><span class="dot ${okRatio > .8 ? "" : "warn"}"></span>${st.ok}/${st.total} OK · ${t("updated")} ${ago(st.generated)}`;
  }
}

/* ---------- shared blocks ---------- */
const mkRow = r => { const mse = /^[A-Z0-9]{2,5}$/.test(r.symbol || "");
  return `<div class="mk-row"><span class="n">${esc(mse ? r.symbol : r.name)}<br><small class="muted">${esc(mse ? r.name : "")}</small></span><span class="p">${nf(r.price, r.price < 10 ? 3 : 2)}<br>${chg(r.change_pct)}</span></div>`; };
const newsImg = n => n.image ? `<img class="thumb" src="${esc(n.image)}" alt="" loading="lazy" onerror="this.outerHTML=window.CMV.newsThumb('${esc(n.topic)}')">` : V.newsThumb(n.topic);
const newsList = items => items.length ? items.map(n => `
  <a class="news-item" href="${esc(n.url)}" target="_blank" rel="noopener">
    <div class="news-img">${newsImg(n)}</div>
    <div><div class="meta"><span class="t">${esc(n.topic)}</span>${esc(n.source)}${n.published ? " · " + ago(n.published) : ""}</div>
    <h3>${esc(n.title)}</h3><div class="muted sum">${esc(n.summary)}</div></div>
  </a>`).join("") : `<p class="muted">${t("noRes")}</p>`;
const dishCard = (r, i) => `
  <div class="card dish">
    <div class="dish-img">${r.photo ? `<img class="cover" src="${esc(r.photo)}" alt="${esc(r.provider)}" loading="lazy">` : V.foodCover(r.provider, r.cuisine)}<span class="num">${i + 1}</span></div>
    <div class="dish-body">
      <div class="meta">${esc(r.area)} · ${esc(r.cuisine)}</div>
      <h3>${esc(r.provider)}</h3>
      <div><span class="price">${"€".repeat(r.price_level || 2)}</span> · ★ ${nf(r.rating || 0, 1)} <span class="muted">(${r.reviews || 0})</span></div>
      <p class="muted hl">${esc(r.highlight || "")}</p>
      <a class="btn ghost" href="${esc(r.maps || r.url)}" target="_blank" rel="noopener">${t("openMaps")} ↗</a>
    </div>
  </div>`;

/* ---------- pages ---------- */
async function pageHome() {
  const [cats, news, dining, mk, fx, ba] = await Promise.all([get("categories"), get("news"), get("dining"), get("markets"), get("fx"), get("cat-business-accounts")]);
  const cfg = cats.config, top = (ba?.items || []).slice(0, 5);
  const nProv = new Set(cats.index.length ? (await Promise.all(cats.index.map(c => get("cat-" + c.slug)))).flatMap(d => (d?.items || []).map(r => r.provider)) : []).size;
  return `
  <section class="hero">
    <div>
      <div class="eyebrow"><svg width="16" height="11" viewBox="0 0 16 11" style="vertical-align:-1px;margin-right:6px;border-radius:2px;box-shadow:0 0 0 1px #0002"><rect width="8" height="11" fill="#fff"/><rect x="8" width="8" height="11" fill="#c8102e"/></svg>${t("daily")}</div>
      <h1>${t("heroTitle")}</h1>
      <p class="lead">${t("heroLead")}</p>
      <form class="search" id="searchForm"><input id="q" placeholder="${t("search")}" autocomplete="off"><button class="btn red">${t("go")}</button></form>
      <div id="searchRes"></div>
      <div class="stats"><div><b>${cats.index.length}</b><span>${t("cats")}</span></div><div><b>${nProv}</b><span>${t("providers")}</span></div><div><b>3</b><span>EN · MT · IT</span></div></div>
    </div>
    <div class="hero-visual">${V.hero()}<div class="bubble"><b>Merill</b> ${t("mHi")}</div></div>
  </section>

  <section class="feature">
    <div class="feature-l">${V.mascot(110, "wink", "peek")}${V.iconTile("business-accounts", 56)}
      <span class="tag">${t("featured")}</span>
      <h2>${esc(catTitle(cfg["business-accounts"]))}</h2>
      <p>${t("featuredLead")}</p>
      <a class="btn" href="#business-accounts">${t("seeAll")} →</a>
    </div>
    <ol class="feature-list">${top.map((r, i) => `<li><span class="rank">${i + 1}</span>${V.mono(r.provider, 36)}<span class="fl-name"><b>${esc(r.provider)}</b><small>${esc(r.product)}${r.affiliated ? ` · <em>${t("affiliated")}</em>` : ""}</small></span>${scoreBadge(r.score)}</li>`).join("")}</ol>
  </section>

  <section class="section">
    <div class="sec-head"><h2>${t("categories")}</h2></div>
    <div class="grid g4">${cats.index.map(c => `
      <a class="card cat ${cfg[c.slug].featured ? "feat" : ""}" href="#${c.slug}">
        ${V.iconTile(c.slug)}
        <h3>${esc(catTitle(cfg[c.slug]))}</h3>
        <div class="best">${t("best")}: <b>${esc(c.best || "—")}</b> · ${c.count} ${t("results")}</div>
      </a>`).join("")}
    </div>
  </section>

  <section class="section">
    <div class="sec-head"><h2>${t("todayDining")}</h2><a href="#dining">${t("seeAll")} →</a></div>
    <div class="grid g3">${(dining?.picks || []).map(dishCard).join("")}</div>
  </section>

  <section class="section grid g3">
    <div class="card" style="grid-column:span 2">
      <div class="sec-head"><h2>${t("latestNews")}</h2><a href="#news">${t("seeAll")} →</a></div>
      ${newsList((news?.items || []).slice(0, 5))}
    </div>
    <div class="card">
      <div class="sec-head"><h2>${t("marketSnap")}</h2><a href="#markets">${t("seeAll")} →</a></div>
      ${(mk?.mse || []).slice(0, 5).map(mkRow).join("")}
      <div style="height:10px"></div>
      ${(mk?.global || []).slice(0, 4).map(mkRow).join("")}
      <h3 style="margin-top:16px">${t("fx")}</h3>
      ${(fx?.rates || []).slice(0, 4).map(r => `<div class="mk-row"><span class="n">EUR/${r.ccy}</span>${spark(r.spark)}<span class="p">${nf(r.rate, 4)}<br>${chg(r.change_pct)}</span></div>`).join("")}
    </div>
  </section>`;
}

async function pageCategory(slug) {
  const [cats, data] = await Promise.all([get("categories"), get("cat-" + slug)]);
  const cfg = cats.config[slug];
  if (!cfg || !data) return `<p>${t("noRes")}</p>`;
  const extra = cfg.calculator ? `<div class="section grid g2">${cfg.calculator === "loan" ? loanCalcHtml() : mortCalcHtml()}</div>` : "";
  const weights = cfg.score.map(s => `${colLabel(cfg.columns.find(c => c.key === s.key) || {key: s.key})} ${Math.round(s.w * 100)}% (${t(s.dir)})`).join(" · ");
  setTimeout(() => bindTable(cfg, data.items), 0);
  return `
  <div class="page-head with-ico">
    ${V.iconTile(slug, 64)}
    <div>
      <div class="meta">${esc(t(GROUP_NAV[cfg.group] || "banking"))}</div>
      <h1>${esc(catTitle(cfg))}</h1>
      <p class="muted" style="max-width:720px">${esc(loc(cfg, "intro"))}</p>
    </div>
  </div>
  <div class="chips">${Object.entries(cats.config).filter(([, c]) => c.group === cfg.group).map(([k, c]) => `<a class="chip ${k === slug ? "on" : ""}" href="#${k}">${V.icon(k, 15)} ${esc(catTitle(c))}</a>`).join("")}</div>
  <div class="toolbar">
    <input id="flt" placeholder="${t("filter")}">
    <select id="srt"><option value="score">${t("sortBy")}: ${t("score")}</option>${cfg.columns.filter(c => c.fmt && c.fmt !== "bool").map(c => `<option value="${c.key}">${t("sortBy")}: ${esc(colLabel(c))}</option>`).join("")}</select>
    <span class="fresh" style="align-self:center">${t("updated")} ${ago(data.updated)}</span>
  </div>
  <div class="tbl-wrap"><table><thead><tr>
    ${cfg.columns.map(c => `<th data-k="${c.key}">${esc(colLabel(c))}</th>`).join("")}<th data-k="score">${t("score")}</th><th></th>
  </tr></thead><tbody id="tb"></tbody></table></div>
  <div class="tip">${V.mascot(64)}<div><b>${t("tip")}</b><br>${t("tipTxt")}</div></div>
  <p class="fresh" style="margin-top:10px"><b>${t("scoreHow")}:</b> ${t("scoreTxt")} ${esc(weights)}.</p>
  ${extra}`;
}

function bindTable(cfg, items) {
  let key = "score", dir = -1;
  const lowKeys = new Set(cfg.score.filter(s => s.dir === "low").map(s => s.key));
  const bestScore = Math.max(...items.map(r => r.score || 0));
  const draw = () => {
    const q = ($("#flt")?.value || "").toLowerCase();
    const rows = items.filter(r => !q || JSON.stringify(r).toLowerCase().includes(q))
      .sort((a, b) => { const x = a[key], y = b[key]; return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))) * dir; });
    $("#tb").innerHTML = rows.length ? rows.map(r => `<tr>
      ${cfg.columns.map((c, i) => i === 0 ? `<td class="prov"><div class="prov-in">${V.mono(r[c.key])}<div>${esc(r[c.key])}${r.score === bestScore ? ` <span class="badge top">${t("topPick")}</span>` : ""}${r.affiliated ? ` <span class="badge aff">${t("affiliated")}</span>` : ""}
          <small>${r.checked ? `${r.stale ? t("stale") : t("checked")} ${ago(r.checked)}` : t("notChecked")}</small></div></div></td>` : `<td>${fmt(r[c.key], c.fmt)}</td>`).join("")}
      <td>${scoreBadge(r.score || 0)}</td>
      <td><a class="btn" href="${esc(r.url)}" target="_blank" rel="noopener sponsored">${t("visit")} ↗</a></td></tr>`).join("")
      : `<tr><td colspan="99"><div class="empty">${V.mascot(80)}<span>${t("mNo")}</span></div></td></tr>`;
    document.querySelectorAll("th").forEach(th => th.classList.toggle("sorted", th.dataset.k === key));
  };
  $("#flt").oninput = draw;
  $("#srt").onchange = e => { key = e.target.value; dir = key === "score" ? -1 : (lowKeys.has(key) ? 1 : -1); draw(); };
  document.querySelectorAll("th[data-k]").forEach(th => th.onclick = () => { const k = th.dataset.k; dir = key === k ? -dir : (k === "score" ? -1 : lowKeys.has(k) ? 1 : -1); key = k; draw(); });
  draw();
  bindCalcs();
}

async function pageNews() {
  const news = await get("news");
  const items = news?.items || [];
  const topics = [...new Set(items.map(n => n.topic))], sources = [...new Set(items.map(n => n.source))];
  setTimeout(() => {
    let tp = "", sr = "";
    const draw = () => { $("#nl").innerHTML = newsList(items.filter(n => (!tp || n.topic === tp) && (!sr || n.source === sr))); };
    document.querySelectorAll("[data-tp]").forEach(b => b.onclick = () => { tp = b.dataset.tp; document.querySelectorAll("[data-tp]").forEach(x => x.classList.toggle("on", x === b)); draw(); });
    document.querySelectorAll("[data-sr]").forEach(b => b.onclick = () => { sr = b.dataset.sr; document.querySelectorAll("[data-sr]").forEach(x => x.classList.toggle("on", x === b)); draw(); });
    draw();
  }, 0);
  return `<div class="page-head with-ico">${V.iconTile("news", 64)}<div><h1>${t("news")}</h1><p class="muted">${t("updated")} ${ago(news?.updated)}</p></div></div>
    <div class="chips"><button class="chip on" data-tp="">${t("all")}</button>${topics.map(x => `<button class="chip" data-tp="${esc(x)}">${esc(x)}</button>`).join("")}</div>
    <div class="chips"><button class="chip on" data-sr="">${t("sources")}: ${t("all")}</button>${sources.map(x => `<button class="chip" data-sr="${esc(x)}">${esc(x)}</button>`).join("")}</div>
    <div class="card" id="nl"></div>`;
}

async function pageMarkets() {
  const [mk, fx] = await Promise.all([get("markets"), get("fx")]);
  return `<div class="page-head with-ico">${V.iconTile("investing", 64)}<div><h1>${t("markets")}</h1><p class="muted">${t("updated")} ${ago(mk?.updated)}</p></div></div>
  <div class="grid g2">
    <div class="card"><h2>${t("mse")}</h2>${(mk?.mse || []).map(mkRow).join("")}</div>
    <div class="card"><h2>${t("global")}</h2>${(mk?.global || []).map(mkRow).join("")}
      <h2 style="margin-top:18px">${t("crypto")}</h2>${(mk?.crypto || []).map(mkRow).join("")}</div>
  </div>
  <div class="grid g2 section">
    <div class="card"><h2>${t("fx")}</h2><p class="fresh">${esc(fx?.source || "")} · ${esc(fx?.date || "")}</p>
      ${(fx?.rates || []).map(r => `<div class="mk-row"><span class="n">EUR/${r.ccy}</span>${spark(r.spark)}<span class="p">${nf(r.rate, 4)}<br>${chg(r.change_pct)}</span></div>`).join("")}</div>
    <div>${fxCalcHtml(fx)}</div>
  </div>`;
}

async function pageDining() {
  const [dining, data] = await Promise.all([get("dining"), get("cat-restaurants")]);
  const items = data?.items || [];
  const areas = [...new Set(items.map(r => r.area))].sort(), cuis = [...new Set(items.map(r => r.cuisine))].sort();
  setTimeout(() => {
    const draw = () => {
      const a = $("#fa").value, c = $("#fc").value, p = +$("#fp").value;
      $("#dl").innerHTML = items.filter(r => (!a || r.area === a) && (!c || r.cuisine === c) && (!p || r.price_level <= p)).map(dishCard).join("") || `<p class="muted">${t("noRes")}</p>`;
    };
    ["#fa", "#fc", "#fp"].forEach(s => $(s).onchange = draw); draw();
  }, 0);
  return `<div class="page-head with-ico">${V.iconTile("restaurants", 64)}<div><h1>${t("dining")}</h1><p class="muted">${t("diningLead")}</p></div></div>
  <h2>${t("todayDining")}</h2><div class="grid g3">${(dining?.picks || []).map(dishCard).join("")}</div>
  <div class="toolbar section">
    <select id="fa"><option value="">${t("area")}: ${t("all")}</option>${areas.map(x => `<option>${esc(x)}</option>`).join("")}</select>
    <select id="fc"><option value="">${t("cuisine")}: ${t("all")}</option>${cuis.map(x => `<option>${esc(x)}</option>`).join("")}</select>
    <select id="fp"><option value="0">${t("priceL")}: ${t("all")}</option><option value="1">€</option><option value="2">≤ €€</option><option value="3">≤ €€€</option></select>
  </div>
  <div class="grid g3" id="dl"></div>`;
}

async function pageCalcs() {
  const fx = await get("fx");
  setTimeout(bindCalcs, 0);
  return `<div class="page-head with-ico">${V.iconTile("personal-loans", 64)}<div><h1>${t("calc")}</h1></div></div><div class="grid g3">${loanCalcHtml()}${mortCalcHtml()}${fxCalcHtml(fx)}</div>`;
}

/* ---------- calculators ---------- */
const field = (id, label, val, attrs = "") => `<label for="${id}">${label}</label><input id="${id}" type="number" value="${val}" ${attrs}>`;
const loanCalcHtml = () => `<div class="card calc" data-calc="loan"><h3>${V.icon("personal-loans", 18)} ${t("loanCalc")}</h3>
  ${field("l_amt", t("amount"), 15000, 'min="500" step="500"')}${field("l_rate", t("rate"), 6.5, 'step="0.05"')}${field("l_yrs", t("years"), 5, 'min="1" max="15"')}${field("l_fee", t("fee"), 50)}
  <div class="out" id="l_out"></div></div>`;
const mortCalcHtml = () => `<div class="card calc" data-calc="mort"><h3>${V.icon("mortgages", 18)} ${t("mortCalc")}</h3>
  ${field("m_price", t("price"), 300000, 'step="5000"')}${field("m_dep", t("deposit"), 30000, 'step="1000"')}${field("m_rate", t("rate"), 3.5, 'step="0.05"')}${field("m_yrs", t("years"), 30, 'min="5" max="40"')}
  <div class="out" id="m_out"></div></div>`;
const fxCalcHtml = fx => { const opts = ["EUR", ...(fx?.rates || []).map(r => r.ccy)].map(c => `<option>${c}</option>`).join("");
  setTimeout(bindCalcs, 0);
  return `<div class="card calc" data-calc="fx"><h3>${V.icon("money-transfer", 18)} ${t("fxCalc")}</h3>${field("f_amt", t("amt"), 1000)}
  <div class="grid g2"><div><label>${t("from")}</label><select id="f_from">${opts}</select></div><div><label>${t("to")}</label><select id="f_to">${opts.replace("<option>GBP", "<option selected>GBP")}</select></div></div>
  <div class="out" id="f_out"></div><p class="fresh">ECB · ${esc(fx?.date || "")}</p></div>`; };

function pmt(P, ratePct, years) { const r = ratePct / 100 / 12, n = years * 12; return r ? P * r / (1 - Math.pow(1 + r, -n)) : P / n; }
function aprc(P, fee, m, n) {
  let lo = 0, hi = 0.05; for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; let pv = 0; for (let j = 1; j <= n; j++) pv += m / Math.pow(1 + mid, j); pv > P - fee ? lo = mid : hi = mid; }
  return (Math.pow(1 + lo, 12) - 1) * 100; }
const v = id => parseFloat(document.getElementById(id)?.value) || 0;
const kv = (k, val, big) => big ? `<div class="muted" style="font-size:13px">${k}</div><div class="big">${val}</div>` : `<div class="kv"><span>${k}</span><b>${val}</b></div>`;

function bindCalcs() {
  const L = () => { if (!$("#l_out")) return; const P = v("l_amt"), n = v("l_yrs") * 12, m = pmt(P, v("l_rate"), v("l_yrs"));
    $("#l_out").innerHTML = kv(t("monthly"), "€" + nf(m), 1) + kv(t("totalPay"), "€" + nf(m * n + v("l_fee"))) + kv(t("totalInt"), "€" + nf(m * n - P)) + kv(t("aprc"), nf(aprc(P, v("l_fee"), m, n)) + "%"); };
  const M = () => { if (!$("#m_out")) return; const P = Math.max(0, v("m_price") - v("m_dep")), m = pmt(P, v("m_rate"), v("m_yrs"));
    $("#m_out").innerHTML = kv(t("monthly"), "€" + nf(m), 1) + kv("LTV", nf(P / (v("m_price") || 1) * 100, 0) + "%") + kv(t("totalInt"), "€" + nf(m * v("m_yrs") * 12 - P, 0)); };
  const F = () => { if (!$("#f_out")) return; const all = Object.assign({EUR: 1}, D.fx?.all || {}); const a = v("f_amt"), f = $("#f_from").value, to = $("#f_to").value;
    const res = a / all[f] * all[to]; $("#f_out").innerHTML = kv(`${nf(a)} ${f} =`, `${nf(res)} ${to}`, 1) + kv(`1 ${f}`, `${nf(all[to] / all[f], 4)} ${to}`); };
  document.querySelectorAll("[data-calc] input,[data-calc] select").forEach(el => el.oninput = el.onchange = () => { L(); M(); F(); });
  L(); M(); F();
}

/* ---------- search ---------- */
async function bindSearch() {
  const form = $("#searchForm"); if (!form) return;
  const cats = await get("categories"), slugs = Object.keys(cats.config);
  const all = (await Promise.all(slugs.map(s => get("cat-" + s)))).flatMap((d, i) => (d?.items || []).map(r => ({...r, _slug: slugs[i]})));
  const run = () => { const q = $("#q").value.trim().toLowerCase(); if (q.length < 2) { $("#searchRes").innerHTML = ""; return; }
    const hits = all.filter(r => `${r.provider} ${r.product || ""} ${r.cuisine || ""} ${r.area || ""}`.toLowerCase().includes(q)).slice(0, 8);
    $("#searchRes").innerHTML = `<div class="card search-res">${hits.map(r => `<a class="kv" href="#${r._slug}"><span class="prov-in">${V.mono(r.provider, 26)}<span><b>${esc(r.provider)}</b> ${esc(r.product || r.cuisine || "")}</span></span><span class="muted">${esc(catTitle(cats.config[r._slug]))}</span></a>`).join("") || `<div class="empty">${V.mascot(56)}<span>${t("mNo")}</span></div>`}</div>`; };
  $("#q").oninput = run; form.onsubmit = e => { e.preventDefault(); run(); };
}

/* ---------- router ---------- */
async function route() {
  const r = (location.hash || "#home").slice(1) || "home";
  await get("categories");
  renderNav(r);
  $("#nav").classList.remove("open");
  let html;
  if (r === "news") html = await pageNews();
  else if (r === "markets") html = await pageMarkets();
  else if (r === "dining") html = await pageDining();
  else if (r === "calculators") html = await pageCalcs();
  else if (D.categories?.config[r]) html = await pageCategory(r);
  else html = await pageHome();
  $("#app").innerHTML = html;
  if (!D.categories?.config[r] && !["news", "markets", "dining", "calculators"].includes(r)) bindSearch();
  if (r === "markets") bindCalcs();
  window.scrollTo(0, 0);
}
$("#langSel").onchange = e => { lang = e.target.value; try { localStorage.setItem("cm_lang", lang); } catch (err) {} renderChrome(); route(); };
$("#menuBtn").onclick = () => $("#nav").classList.toggle("open");
window.addEventListener("hashchange", route);
const fb = document.getElementById("footBird"); if (fb) fb.innerHTML = V.mascot(90, "wink");
document.querySelectorAll(".logo-mark").forEach(e => e.innerHTML = V.logo(e.closest(".foot") ? 26 : 30));
renderChrome(); route();
})();
