"""Search (SEO) and answer-engine (GEO) layer.

The interactive site is a single-page app, which search engines and AI assistants read poorly. After every feed run
this module writes a crawlable, static copy of the important content, in English, Malti and Italiano:

  site/<lang>/                      language home: top pick per category, markets, today's news
  site/<lang>/<category>/           one page per comparison: quick answer, full table, FAQ, sources
  site/<lang>/<category>/index.md   the same page as Markdown, for AI crawlers
  site/<lang>/methodology/          how the Blue score works
  site/sitemap.xml                  every page with hreflang alternates and lastmod
  site/robots.txt                   open to search and AI crawlers
  site/llms.txt, site/llms-full.txt site guide and every current table in Markdown (llmstxt.org)

Every page carries a canonical URL, hreflang alternates, Open Graph tags and schema.org JSON-LD (WebPage, BreadcrumbList,
ItemList of products, FAQPage, Dataset). Figures always come from the same JSON the app uses, so the static pages,
the app and Ask Blue never disagree."""
from __future__ import annotations

import html
import json
import re
from datetime import datetime, timezone
from pathlib import Path

from .common import OUT, load_json, log, now_iso

SITE = OUT.parent
BASE = "https://comparemalta.ai"
LANGS = ("en", "mt", "it")
LOCALE = {"en": "en_GB", "mt": "mt_MT", "it": "it_IT"}
MONTHS = {
    "en": "January February March April May June July August September October November December".split(),
    "mt": "Jannar Frar Marzu April Mejju Ġunju Lulju Awwissu Settembru Ottubru Novembru Diċembru".split(),
    "it": "gennaio febbraio marzo aprile maggio giugno luglio agosto settembre ottobre novembre dicembre".split(),
}
FINANCIAL = {"bank-accounts", "savings", "personal-loans", "mortgages", "credit-cards", "business-accounts", "pos", "fx",
             "fintech", "money-transfer", "insurance", "investing"}
# AI and search crawlers we explicitly welcome (robots.txt allows everyone; naming them makes the intent clear)
BOTS = ["Googlebot", "Bingbot", "Google-Extended", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User",
        "Claude-SearchBot", "anthropic-ai", "PerplexityBot", "Perplexity-User", "Applebot", "Applebot-Extended",
        "DuckDuckBot", "CCBot", "Meta-ExternalAgent", "Amazonbot", "MistralAI-User"]

S = {
 "en": dict(
    best="Best {t} in Malta", month="{m} {y}", updated="Updated {d}", quick="Quick answer",
    lead="We compare {n} {t_l} from {k} providers in Malta, checked {d}.",
    top="Top pick: {p} ({score}/10 Blue score).", extreme="{dir_word} {label}: {p} at {v}.",
    lowest="Lowest", highest="Highest", sample="Some figures are sample data while the live feed for that provider is being connected; check with the provider before you decide.",
    table="Full comparison", rank="How we rank", rank_txt="First we hide products that do not fit your needs (amount, term, deposit, currency) and never rank different kinds of product together; then the lowest total cost wins. The Blue score (0 to 10) summarises this for the default view and weighs: {w}. Nobody can pay for a better position.",
    top_seg="Top pick for each option: {x}.", low_seg="Lowest starting price by type: {x}.", seg_months="{n} months", no_score="Insurance has no overall score: cover, excess and exclusions differ, so compare the policy wording, not only the starting price.",
    faq="Questions and answers", sources="Sources", src_txt="Figures are taken from each provider's own website.",
    interactive="Open the interactive table", ask="Ask Blue", home="Home", all="All comparisons", methodology="How we rank",
    q_best="What is the best {t_l} in Malta right now?",
    a_best="On {d}, {p} has the highest Blue score in our comparison ({score}/10), with {label} of {v}.",
    q_ext="Which {t_l} has the {dir_l} {label}?", a_ext="{p} has the {dir_l} {label} at {v} (checked {d}).",
    q_rank="How does CompareMalta.ai rank {t_l}?", a_rank="Every product gets a Blue score from 0 to 10 from these weights: {w}. Rankings are independent and cannot be bought.",
    q_fresh="How often are these {t_l} updated?", a_fresh="Every day. Our feeds read the providers' websites each morning; this page was last rebuilt on {d}.",
    site_title="CompareMalta.ai: compare banks, loans, mortgages, cards, POS and mobile plans in Malta",
    site_desc="Malta's AI comparison site. Rates, fees and plans from the providers we cover, side by side, refreshed daily in English, Malti and Italiano. Ask Blue for the best pick in seconds.",
    h_home="Compare everything in Malta, side by side", h_sub="Rates, fees and plans from Maltese banks, fintechs, telcos and payment providers, refreshed every day. Ask Blue, our AI assistant, for the best pick in seconds.",
    cats="Comparisons", markets="Markets today", news="Malta news today", top_in="Top pick", see="Compare",
    meth_title="How CompareMalta.ai ranks products", meth_lead="Every comparison uses public prices from each provider's own website, refreshed by our feeds every day. We turn them into a Blue score from 0 to 10.",
    meth_rules=["Step 1, eligibility: products that do not fit your amount, term, deposit or currency are hidden, and different kinds of product (12 and 24 month deposits, fixed and variable mortgages, car and home insurance) are never ranked together.", "Step 2, cost: among what fits, the lowest total cost for your numbers wins. For card payments (POS) you enter your own monthly sales, average sale and card mix.", "Step 3, preferences: speed, app and hardware count only after cost.", "Insurance has no overall score, because cover differs.", "Each category has its own weights, shown on every comparison page.", "Missing values count as the category median, so a gap never helps or hurts much.", "Providers cannot pay to rank higher. Partnerships never change the order.", "Sample figures are labelled until a live feed for that provider is connected."],
    fx="Euro exchange rates (ECB)", rate="ECB deposit rate",
 ),
 "mt": dict(
    best="L-aħjar {t} f'Malta", month="{m} {y}", updated="Aġġornat {d}", quick="Tweġiba qasira",
    lead="Inqabblu {n} prodotti ta' {t_l} minn {k}-il fornitur f'Malta, iċċekkjati {d}.",
    top="L-ewwel għażla: {p} ({score}/10 Blue score).", extreme="{dir_word} {label}: {p} b'{v}.",
    lowest="L-iktar baxx", highest="L-ogħla", sample="Xi figuri huma data ta' kampjun sakemm jitqabbad il-feed live ta' dak il-fornitur; iċċekkja mal-fornitur qabel tiddeċiedi.",
    table="Paragun sħiħ", rank="Kif nikklassifikaw", rank_txt="L-ewwel naħbu l-prodotti li ma jaqblux mal-bżonnijiet tiegħek (ammont, terminu, depożitu, munita) u qatt ma nqabblu tipi differenti ta' prodott flimkien; imbagħad jirbaħ l-inqas spiża totali. Il-Blue score (0 sa 10) jiġbor dan għall-veduta standard u jiżen: {w}. Ħadd ma jista' jħallas għal post aħjar.",
    top_seg="L-ewwel għażla għal kull għażla: {x}.", low_seg="L-inqas prezz tal-bidu skont it-tip: {x}.", seg_months="{n} xhur", no_score="L-assigurazzjoni m'għandhiex score ġenerali: il-kopertura, l-eċċess u l-esklużjonijiet ivarjaw, għalhekk qabbel il-kundizzjonijiet tal-polza, mhux il-prezz tal-bidu biss.",
    faq="Mistoqsijiet u tweġibiet", sources="Sorsi", src_txt="Il-figuri jittieħdu mis-sit ta' kull fornitur.",
    interactive="Iftaħ it-tabella interattiva", ask="Staqsi lil Blue", home="Paġna ewlenija", all="Il-paraguni kollha", methodology="Kif nikklassifikaw",
    q_best="X'inhu l-aħjar {t_l} f'Malta bħalissa?",
    a_best="Fil-{d}, {p} għandu l-ogħla Blue score fil-paragun tagħna ({score}/10), b'{label} ta' {v}.",
    q_ext="Liema {t_l} għandu l-{dir_l} {label}?", a_ext="{p} għandu l-{dir_l} {label}, {v} (iċċekkjat {d}).",
    q_rank="Kif jikklassifika CompareMalta.ai {t_l}?", a_rank="Kull prodott jieħu Blue score minn 0 sa 10 b'dawn il-piżijiet: {w}. Il-klassifiki huma indipendenti u ma jinxtrawx.",
    q_fresh="Kemm-il darba jiġu aġġornati dawn il-{t_l}?", a_fresh="Kuljum. Il-feeds tagħna jaqraw is-siti tal-fornituri kull filgħodu; din il-paġna nbniet mill-ġdid fil-{d}.",
    site_title="CompareMalta.ai: qabbel banek, self, self għad-dar, karti, POS u pjanijiet tal-mowbajl f'Malta",
    site_desc="Is-sit tal-paragun AI ta' Malta. Rati, miżati u pjanijiet tal-fornituri li nkopru, ħdejn xulxin, aġġornati kuljum bl-Ingliż, bil-Malti u bit-Taljan. Staqsi lil Blue għall-aħjar għażla f'sekondi.",
    h_home="Qabbel kollox f'Malta, ħdejn xulxin", h_sub="Rati, miżati u pjanijiet minn banek, fintechs, telcos u fornituri tal-ħlasijiet f'Malta, aġġornati kuljum. Staqsi lil Blue, l-assistent AI tagħna, għall-aħjar għażla.",
    cats="Paraguni", markets="Is-swieq illum", news="Aħbarijiet ta' Malta llum", top_in="L-ewwel għażla", see="Qabbel",
    meth_title="Kif CompareMalta.ai jikklassifika l-prodotti", meth_lead="Kull paragun juża prezzijiet pubbliċi mis-sit ta' kull fornitur, aġġornati kuljum mill-feeds tagħna. Nibdluhom f'Blue score minn 0 sa 10.",
    meth_rules=["Pass 1, eliġibbiltà: il-prodotti li ma jaqblux mal-ammont, it-terminu, id-depożitu jew il-munita tiegħek jinħbew, u tipi differenti ta' prodott qatt ma jitqabblu flimkien.", "Pass 2, spiża: minn dak li jaqbel, jirbaħ l-inqas spiża totali għan-numri tiegħek. Għall-POS iddaħħal il-bejgħ tiegħek fix-xahar, il-bejgħ medju u t-tip ta' karti.", "Pass 3, preferenzi: veloċità, app u apparat jgħoddu biss wara l-ispiża.", "L-assigurazzjoni m'għandhiex score ġenerali, għax il-kopertura tvarja.", "Kull kategorija għandha l-piżijiet tagħha, murija f'kull paġna tal-paragun.", "Valur nieqes jgħodd bħala l-medjan tal-kategorija.", "Il-fornituri ma jistgħux iħallsu biex jitilgħu fil-klassifika.", "Figuri ta' kampjun huma mmarkati sakemm jitqabbad feed live."],
    fx="Rati tal-kambju tal-euro (BĊE)", rate="Rata tad-depożitu tal-BĊE",
 ),
 "it": dict(
    best="{t} a Malta: confronto e migliori offerte", month="{m} {y}", updated="Aggiornato il {d}", quick="Risposta rapida",
    lead="Confrontiamo {n} offerte di {t_l} di {k} fornitori a Malta, verificate il {d}.",
    top="Prima scelta: {p} ({score}/10 Blue score).", extreme="{label_cap} {dir_word}: {p} con {v}.",
    lowest="più basso", highest="più alto", sample="Alcuni valori sono dati di esempio finché non colleghiamo il feed live di quel fornitore; verifica con il fornitore prima di decidere.",
    table="Confronto completo", rank="Come classifichiamo", rank_txt="Prima nascondiamo i prodotti non adatti alle tue esigenze (importo, durata, anticipo, valuta) e non mettiamo mai in classifica insieme prodotti di tipo diverso; poi vince il costo totale più basso. Il Blue score (da 0 a 10) riassume questo nella vista predefinita e pesa: {w}. Nessuno può pagare per una posizione migliore.",
    top_seg="Prima scelta per ogni opzione: {x}.", low_seg="Prezzo di partenza più basso per tipo: {x}.", seg_months="{n} mesi", no_score="Le assicurazioni non hanno un punteggio complessivo: coperture, franchigie ed esclusioni cambiano, quindi confronta le condizioni di polizza e non solo il prezzo di partenza.",
    faq="Domande e risposte", sources="Fonti", src_txt="I valori sono presi dal sito di ciascun fornitore.",
    interactive="Apri la tabella interattiva", ask="Chiedi a Blue", home="Home", all="Tutti i confronti", methodology="Come classifichiamo",
    q_best="Qual è la migliore offerta di {t_l} a Malta in questo momento?",
    a_best="Il {d}, {p} ha il Blue score più alto del nostro confronto ({score}/10), con {label} pari a {v}.",
    q_ext="Quale offerta di {t_l} ha {dir_l} {label}?", a_ext="{p} ha {dir_l} {label}: {v} (verificato il {d}).",
    q_rank="Come classifica CompareMalta.ai le offerte di {t_l}?", a_rank="Ogni prodotto riceve un Blue score da 0 a 10 con questi pesi: {w}. Le classifiche sono indipendenti e non si possono comprare.",
    q_fresh="Ogni quanto vengono aggiornati questi dati?", a_fresh="Ogni giorno. I nostri feed leggono i siti dei fornitori ogni mattina; questa pagina è stata rigenerata il {d}.",
    site_title="CompareMalta.ai: confronta banche, prestiti, mutui, carte, POS e offerte mobile a Malta",
    site_desc="Il sito di confronto AI di Malta. Tassi, commissioni e offerte dei fornitori che copriamo, a confronto, aggiornati ogni giorno in inglese, maltese e italiano. Chiedi a Blue la scelta migliore in pochi secondi.",
    h_home="Confronta tutto a Malta, fianco a fianco", h_sub="Tassi, commissioni e offerte di banche, fintech, operatori e fornitori di pagamenti a Malta, aggiornati ogni giorno. Chiedi a Blue, il nostro assistente AI, la scelta migliore.",
    cats="Confronti", markets="Mercati oggi", news="Notizie da Malta oggi", top_in="Prima scelta", see="Confronta",
    meth_title="Come CompareMalta.ai classifica i prodotti", meth_lead="Ogni confronto usa i prezzi pubblici presi dal sito di ciascun fornitore, aggiornati ogni giorno dai nostri feed. Li trasformiamo in un Blue score da 0 a 10.",
    meth_rules=["Passo 1, idoneità: i prodotti non adatti a importo, durata, anticipo o valuta vengono nascosti, e prodotti di tipo diverso (depositi a 12 e 24 mesi, mutui fissi e variabili, assicurazione auto e casa) non vengono mai messi in classifica insieme.", "Passo 2, costo: tra quelli adatti vince il costo totale più basso per i tuoi numeri. Per i POS inserisci vendite mensili, scontrino medio e tipi di carta.", "Passo 3, preferenze: velocità, app e hardware contano solo dopo il costo.", "Le assicurazioni non hanno un punteggio complessivo, perché le coperture cambiano.", "Ogni categoria ha i suoi pesi, indicati in ogni pagina di confronto.", "Un valore mancante conta come la mediana della categoria.", "I fornitori non possono pagare per salire in classifica.", "I dati di esempio sono segnalati finché non colleghiamo un feed live."],
    fx="Cambi dell'euro (BCE)", rate="Tasso sui depositi BCE",
 ),
}
# Italian articles for the "lowest/highest" phrase ("il più basso" etc.) read better without them in the FAQ question
DIR_L = {"en": {"low": "lowest", "high": "highest"}, "mt": {"low": "iktar baxx", "high": "ogħla"},
         "it": {"low": "il valore più basso di", "high": "il valore più alto di"}}


def esc(v) -> str:
    return html.escape(str(v), quote=True)


def _cols() -> dict:
    """Column labels: parsed from the app's COLS dictionary so the static pages and the app use the same words."""
    js = (SITE / "assets" / "app.js").read_text(encoding="utf-8")
    block = js[js.index("const COLS = {"):]
    block = block[: block.index("\n};") + 3]
    out = {}
    for lang in LANGS:
        m = re.search(r"\n\s*" + lang + r":(\{.*?\})(,\n|\n)", block)
        if m:
            out[lang] = json.loads(re.sub(r'([{,])(\w+):"', r'\1"\2":"', m.group(1)))
    return out


def nf(v, d=2, lang="en"):
    s = f"{v:,.{d}f}"
    if lang in ("mt",):
        return s
    if lang == "it":
        return s.replace(",", "X").replace(".", ",").replace("X", ".")
    return s


def fmt(v, f, lang, yes="✓", no="✕"):
    if v is None or v == "":
        return "-"
    if f == "eur":
        return "€0" if v == 0 else "€" + nf(v, 2, lang)
    if f == "eur0":
        return "€" + nf(v, 0, lang)
    if f == "pct":
        return nf(v, 2, lang) + "%"
    if f == "pct0":
        return nf(v, 0, lang) + "%"
    if f == "num":
        return "∞" if v >= 999 else nf(v, 0, lang)
    if f == "bool":
        return yes if v else no
    if f == "price":
        return "€" * int(v)
    if f == "amt":
        return nf(v, 2, lang)
    if f == "rate":
        return nf(v, 4, lang)
    if f == "rating":
        return "★ " + nf(v, 1, lang)
    return str(v)


def date_txt(iso, lang):
    d = datetime.fromisoformat(iso.replace("Z", "+00:00")) if iso else datetime.now(timezone.utc)
    return f"{d.day} {MONTHS[lang][d.month - 1]} {d.year}"


def url(lang, slug=None):
    return f"{BASE}/{lang}/" + (f"{slug}/" if slug else "")


def title_of(cfg, lang):
    return cfg.get(f"title_{lang}") or cfg.get("title_en") or cfg.get("title")


def intro_of(cfg, lang):
    return cfg.get(f"intro_{lang}") or cfg.get("intro_en") or ""


def weights(cfg, cols, lang):
    if not cfg["score"]:
        return ""
    tot = sum(s["w"] for s in cfg["score"]) or 1
    return ", ".join(f"{cols[lang].get(s['key'], s['key'])} {round(100 * s['w'] / tot)}%" for s in cfg["score"])


def product_name(r):
    return " ".join(x for x in [r.get("provider"), r.get("product") or r.get("area")] if x)


# ---------------------------------------------------------------- page chrome
CSS_EXTRA = """
.seo-wrap{max-width:1080px;margin:0 auto;padding:28px 20px 60px}
.seo-crumb{font-size:13px;color:#5b6b80;margin-bottom:14px}.seo-crumb a{color:inherit}
.seo-h1{font-family:'Space Grotesk',Inter,sans-serif;font-size:clamp(28px,4vw,42px);line-height:1.1;margin:6px 0 10px;color:#0d2a4a}
.seo-intro{font-size:17px;color:#3a4a60;max-width:760px}
.seo-answer{background:#eef3fb;border-left:4px solid #2b4cc4;border-radius:12px;padding:16px 18px;margin:22px 0;font-size:16px;line-height:1.55}
.seo-answer h2{font-size:14px;letter-spacing:.06em;text-transform:uppercase;margin:0 0 6px;color:#2b4cc4}
.seo-table{width:100%;border-collapse:collapse;font-size:14.5px;background:#fff;border-radius:12px;overflow:hidden}
.seo-table th,.seo-table td{padding:10px 12px;border-bottom:1px solid #e6ebf2;text-align:left;vertical-align:middle}
.seo-table th{background:#0d2a4a;color:#fff;font-weight:600;font-size:13px}
.seo-table td.prov{display:flex;gap:10px;align-items:center;font-weight:600}.seo-table img{width:28px;height:28px;border-radius:7px;object-fit:contain;background:#fff}
.seo-scroll{overflow-x:auto;border:1px solid #e6ebf2;border-radius:12px}
.seo-sec{margin-top:34px}.seo-sec h2{font-family:'Space Grotesk',Inter,sans-serif;color:#0d2a4a;font-size:24px;margin:0 0 12px}
.seo-faq details{border:1px solid #e6ebf2;border-radius:10px;padding:12px 14px;margin:8px 0;background:#fff}.seo-faq summary{font-weight:600;cursor:pointer}
.seo-cta{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}
.seo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.seo-card{display:block;border:1px solid #e6ebf2;border-radius:14px;padding:14px 16px;background:#fff;color:inherit;text-decoration:none}
.seo-card b{display:block;color:#0d2a4a;margin-bottom:4px}.seo-card small{color:#5b6b80}
.seo-news li{margin:6px 0}.seo-muted{color:#5b6b80;font-size:13px}
.seo-lang a{margin-left:8px;font-weight:600;color:#0d2a4a;text-decoration:none}.seo-lang a[aria-current]{color:#2b4cc4;text-decoration:underline}
"""


def head(lang, title, desc, canonical, alternates, depth, jsonld, md_href=None, image=None, wh=(1200, 630), og_type="website"):
    img = image if (image or "").startswith("http") else f"{BASE}/{image or 'og/home.png'}"
    up = "../" * depth
    alt = "".join(f'<link rel="alternate" hreflang="{l}" href="{u}">' for l, u in alternates.items())
    alt += f'<link rel="alternate" hreflang="x-default" href="{alternates.get("en", canonical)}">'
    md = f'<link rel="alternate" type="text/markdown" href="{md_href}">' if md_href else ""
    ld = "".join(f'<script type="application/ld+json">{json.dumps(j, ensure_ascii=False)}</script>' for j in jsonld)
    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>/* reloads inside the app come back to the app; search engines and people opening a shared link stay on this page */try{{if(sessionStorage.getItem("cm_spa")){{var p=location.pathname.split("/").filter(Boolean),r=!p[1]?"home":p[1]==="methodology"?"how-we-rank":p[1]==="articles"?(p[2]?"article/"+p[2]:"articles"):p[1];location.replace("/?lang="+p[0]+"#"+r)}}}}catch(e){{}}</script>
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<link rel="canonical" href="{canonical}">
{alt}{md}
<link rel="alternate" type="text/plain" title="LLM guide" href="{BASE}/llms.txt">
<meta property="og:type" content="{og_type}"><meta property="og:site_name" content="CompareMalta.ai">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{canonical}"><meta property="og:locale" content="{LOCALE[lang]}">
<meta property="og:image" content="{img}"><meta property="og:image:secure_url" content="{img}"><meta property="og:image:type" content="image/{'jpeg' if img.endswith(('.jpg', '.jpeg')) else 'png'}"><meta property="og:image:width" content="{wh[0]}"><meta property="og:image:height" content="{wh[1]}"><meta property="og:image:alt" content="{esc(title)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(title)}"><meta name="twitter:description" content="{esc(desc)}"><meta name="twitter:image" content="{img}">
<link rel="icon" href="{up}favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{up}assets/style.css">
<style>{CSS_EXTRA}</style>
{ld}
</head>
<body>"""


def topbar(lang, depth, alternates, nav):
    up = "../" * depth
    langs = "".join(f'<a href="{u.replace(BASE + "/", up)}" hreflang="{l}"{" aria-current=page" if l == lang else ""}>{l.upper()}</a>'
                    for l, u in alternates.items())
    links = "".join(f'<a href="{up}{lang}/{slug}/">{esc(t)}</a>' for slug, t in nav)
    return f"""<header class="top"><div class="wrap top-in">
<a href="{up}{lang}/" class="logo"><span class="logo-mark"></span><span>CompareMalta<span class="ai">.ai</span></span></a>
<nav class="nav" aria-label="Comparisons">{links}</nav>
<div class="tools"><span class="seo-lang">{langs}</span><a class="btn blue" href="{up}?lang={lang}#ask">{esc(S[lang]['ask'])}</a></div>
</div></header>"""


def footer(lang, depth, cats):
    up = "../" * depth
    s = S[lang]
    links = " · ".join(f'<a href="{up}{lang}/{slug}/">{esc(title_of(cfg, lang))}</a>' for slug, cfg in cats.items())
    return f"""<footer class="foot"><div class="wrap"><p class="seo-muted">{links}</p>
<p class="seo-muted"><a href="{up}{lang}/methodology/">{esc(s['methodology'])}</a> · <a href="{up}llms.txt">llms.txt</a> · <a href="{up}sitemap.xml">Sitemap</a> · <a href="mailto:info@comparemalta.ai">info@comparemalta.ai</a> · © {datetime.now().year} CompareMalta.ai</p></div></footer>
</body></html>"""


ORG = {"@type": "Organization", "@id": f"{BASE}/#org", "name": "CompareMalta.ai", "url": f"{BASE}/", "email": "info@comparemalta.ai",
       "logo": f"{BASE}/favicon.svg", "areaServed": {"@type": "Country", "name": "Malta"},
       "description": "Independent AI comparison site for Malta: banking, loans, mortgages, cards, POS, telco, insurance, investing and restaurants."}


def crumbs(items):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": u} for i, (n, u) in enumerate(items)]}


# ---------------------------------------------------------------- category pages
def category_page(lang, slug, cfg, data, cols, cats, nav, updated):
    s = S[lang]
    rows = data.get("items", [])
    if not rows:
        return None, None
    t = title_of(cfg, lang)
    t_l = t if lang == "mt" else " ".join(w if sum(ch.isupper() for ch in w) > 1 else w.lower() for w in t.split())
    d = date_txt(data.get("updated") or updated, lang)
    no_score = bool(cfg.get("no_score"))
    cav = cfg.get("caveat") or {}
    no_score_txt = cav.get(lang) or cav.get("en") or s["no_score"]  # each unscored category says why in its own words
    key = (cfg["score"] or cfg.get("highlights") or [{"key": cfg["columns"][2]["key"], "dir": "low"}])[0]
    keycol = next((c for c in cfg["columns"] if c["key"] == key["key"]), cfg["columns"][2] if len(cfg["columns"]) > 2 else cfg["columns"][-1])
    label = cols[lang].get(keycol["key"], keycol["key"])
    label = label if sum(ch.isupper() for ch in label) > 1 else label[:1].lower() + label[1:]  # keep acronyms like APRC
    valued0 = [r for r in rows if isinstance(r.get(key["key"]), (int, float)) and not isinstance(r.get(key["key"]), bool)]
    best = rows[0] if not no_score else ((min if key["dir"] == "low" else max)(valued0, key=lambda r: r[key["key"]]) if valued0 else rows[0])
    valued = [r for r in rows if isinstance(r.get(keycol["key"]), (int, float)) and not isinstance(r.get(keycol["key"]), bool)]
    ext = (min if key["dir"] == "low" else max)(valued, key=lambda r: r[keycol["key"]]) if valued else None
    providers = len({r["provider"] for r in rows})
    demo = any(r.get("demo") for r in rows)
    w = weights(cfg, cols, lang)
    v_best = fmt(best.get(keycol["key"]), keycol.get("fmt"), lang)

    seg = cfg.get("segment")
    seg_txt = ""
    if seg:  # never one winner across different kinds of product (12 vs 24 months, fixed vs variable, car vs home)
        parts = []
        for v in sorted({r.get(seg["key"]) for r in rows if r.get(seg["key"]) is not None}, key=lambda x: (isinstance(x, str), x)):
            grp = [r for r in rows if r.get(seg["key"]) == v]
            g = (sorted(grp, key=lambda r: -(r.get("score") or 0)) if not no_score else
                 sorted([r for r in grp if isinstance(r.get(key["key"]), (int, float))], key=lambda r: r[key["key"]] * (1 if key["dir"] == "low" else -1)))
            if g:
                name = s["seg_months"].format(n=v) if seg.get("fmt") == "months" else f"{seg.get('prefix', '')}{v}"
                parts.append(f"{name}: {product_name(g[0])} ({fmt(g[0].get(keycol['key']), keycol.get('fmt'), lang)})")
        seg_txt = s["low_seg" if no_score else "top_seg"].format(x="; ".join(parts)) if parts else ""
    answer = " ".join(filter(None, [
        s["lead"].format(n=len(rows), t_l=t_l, k=providers, d=d),
        seg_txt or ("" if no_score else s["top"].format(p=product_name(best), score=nf(best.get("score", 0), 1, lang))),
        no_score_txt if no_score else "",
        s["extreme"].format(dir_word=s["lowest" if key["dir"] == "low" else "highest"], label=label, label_cap=label[:1].upper() + label[1:], p=product_name(ext),
                            v=fmt(ext[keycol["key"]], keycol.get("fmt"), lang)) if ext and not seg else "",
        s["sample"] if demo else ""]))

    faq = [] if no_score else [(s["q_best"].format(t_l=t_l), (seg_txt + " " if seg_txt else "") + s["a_best"].format(d=d, p=product_name(best), score=nf(best.get("score", 0), 1, lang), label=label, v=v_best))]
    if ext and not seg:
        faq.append((s["q_ext"].format(t_l=t_l, dir_l=DIR_L[lang][key["dir"]], label=label),
                    s["a_ext"].format(p=product_name(ext), dir_l=DIR_L[lang][key["dir"]], label=label, v=fmt(ext[keycol["key"]], keycol.get("fmt"), lang), d=d)))
    faq.append((s["q_rank"].format(t_l=t_l), no_score_txt if no_score else s["a_rank"].format(w=w)))
    faq.append((s["q_fresh"].format(t_l=t_l), s["a_fresh"].format(d=d)))

    show = [c for c in cfg["columns"] if c["key"] not in ("provider",)]
    head_cells = "".join(f"<th>{esc(cols[lang].get(c['key'], c['key']))}</th>" for c in [cfg["columns"][0]] + show) + ("" if no_score else "<th>Blue score</th>")
    body = []
    for r in rows:
        logo = f'<img src="../../{esc(r["logo"])}" alt="" loading="lazy">' if r.get("logo") else ""
        name = f'<a href="{esc(r["url"])}" rel="nofollow noopener" target="_blank">{esc(r["provider"])}</a>' if r.get("url") else esc(r["provider"])
        cells = "".join(f"<td>{esc(fmt(r.get(c['key']), c.get('fmt'), lang))}</td>" for c in show)
        body.append(f'<tr><td class="prov">{logo}{name}</td>{cells}{"" if no_score else f"<td><b>{nf(r.get('score', 0), 1, lang)}</b></td>"}</tr>')

    notes = "".join(f"<li><b>{esc(product_name(r))}</b>: {esc(r['note'])}</li>" for r in rows if r.get("note"))
    notes = f'<ul class="seo-muted" style="margin-top:12px">{notes}</ul>' if notes else ""
    srcs = sorted({r.get("source_url") or r.get("url") for r in rows if (r.get("source_url") or r.get("url")) and "google." not in (r.get("source_url") or r.get("url"))})
    alternates = {l: url(l, slug) for l in LANGS}
    canonical = alternates[lang]
    title = f"{s['best'].format(t=t)} ({s['month'].format(m=MONTHS[lang][int(updated[5:7]) - 1].capitalize() if lang == 'en' else MONTHS[lang][int(updated[5:7]) - 1], y=updated[:4])}) | CompareMalta.ai"
    desc = (answer[:155].rsplit(" ", 1)[0] + "…") if len(answer) > 158 else answer

    item_type = "Restaurant" if slug == "restaurants" else ("FinancialProduct" if slug in FINANCIAL else "Product")
    items = []
    for i, r in enumerate(rows):
        it = {"@type": item_type, "name": product_name(r), "url": r.get("url"),
              "additionalProperty": [{"@type": "PropertyValue", "name": cols["en"].get(c["key"], c["key"]), "value": r.get(c["key"])}
                                     for c in show if r.get(c["key"]) not in (None, "")]}
        if item_type == "Restaurant":
            it.update({"servesCuisine": r.get("cuisine"), "address": {"@type": "PostalAddress", "addressLocality": r.get("area"), "addressCountry": "MT"}})
        else:
            org = {"@type": "Organization", "name": r["provider"]}
            if r.get("url"):
                org["url"] = r["url"]
            it["provider" if item_type == "FinancialProduct" else "brand"] = org
            for k in ("rate", "apr", "aprc"):
                if isinstance(r.get(k), (int, float)) and item_type == "FinancialProduct":
                    it.setdefault("annualPercentageRate", r[k])
        it = {k: v for k, v in it.items() if v not in (None, [], "")}
        items.append({"@type": "ListItem", "position": i + 1, "item": it})
    jsonld = [
        {"@context": "https://schema.org", "@type": "WebPage", "@id": canonical, "url": canonical, "name": title, "description": desc,
         "inLanguage": lang, "dateModified": updated, "isPartOf": {"@id": f"{BASE}/#site"}, "publisher": {"@id": f"{BASE}/#org"},
         "about": t, "speakable": {"@type": "SpeakableSpecification", "cssSelector": [".seo-h1", ".seo-answer"]},
         "breadcrumb": crumbs([(S[lang]["home"], url(lang)), (t, canonical)])},
        {"@context": "https://schema.org", "@type": "ItemList", "name": s["best"].format(t=t), "numberOfItems": len(rows),
         "itemListOrder": "https://schema.org/ItemListOrderDescending", "itemListElement": items},
        {"@context": "https://schema.org", "@type": "FAQPage", "inLanguage": lang,
         "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]},
        {"@context": "https://schema.org", "@type": "Dataset", "name": f"{s['best'].format(t=t)}: CompareMalta.ai", "description": answer,
         "url": canonical, "dateModified": updated, "inLanguage": lang, "creator": {"@id": f"{BASE}/#org"},
         "isAccessibleForFree": True, "spatialCoverage": "Malta",
         "distribution": [{"@type": "DataDownload", "encodingFormat": "application/json", "contentUrl": f"{BASE}/data/cat-{slug}.json"},
                          {"@type": "DataDownload", "encodingFormat": "text/markdown", "contentUrl": f"{canonical}index.md"}]},
    ]
    page = head(lang, title, desc, canonical, alternates, 2, jsonld, f"{canonical}index.md", image=f"og/{lang}/cat-{slug}.png") + topbar(lang, 2, alternates, nav) + f"""
<main class="seo-wrap">
<div class="seo-crumb"><a href="../">{esc(s['home'])}</a> › {esc(t)}</div>
<p class="seo-muted">{esc(s['updated'].format(d=d))}</p>
<h1 class="seo-h1">{esc(s['best'].format(t=t))}</h1>
<p class="seo-intro">{esc(intro_of(cfg, lang))}</p>
<section class="seo-answer"><h2>{esc(s['quick'])}</h2><p>{esc(answer)}</p></section>
<div class="seo-cta"><a class="btn navy" href="../../?lang={lang}#{slug}">{esc(s['interactive'])}</a><a class="btn blue" href="../../?lang={lang}#ask">{esc(s['ask'])}</a></div>
<section class="seo-sec"><h2>{esc(s['table'])}</h2><div class="seo-scroll"><table class="seo-table"><thead><tr>{head_cells}</tr></thead><tbody>{''.join(body)}</tbody></table></div>{notes}</section>
<section class="seo-sec"><h2>{esc(s['rank'])}</h2><p>{esc(no_score_txt if no_score else s['rank_txt'].format(w=w))} <a href="../methodology/">{esc(s['methodology'])} →</a></p></section>
<section class="seo-sec seo-faq"><h2>{esc(s['faq'])}</h2>{''.join(f'<details open><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q, a in faq)}</section>
<section class="seo-sec"><h2>{esc(s['sources'])}</h2><p class="seo-muted">{esc(s['src_txt'])}</p><ul class="seo-muted">{''.join(f'<li><a href="{esc(u)}" rel="nofollow noopener">{esc(u)}</a></li>' for u in srcs)}</ul></section>
</main>""" + footer(lang, 2, cats)

    md = [f"# {s['best'].format(t=t)}", "", f"_{s['updated'].format(d=d)} · {canonical}_", "", f"## {s['quick']}", "", answer, "",
          f"## {s['table']}", "", "| " + " | ".join([cols[lang].get('provider', 'Provider')] + [cols[lang].get(c['key'], c['key']) for c in show] + ([] if no_score else ["Blue score"])) + " |",
          "|" + "---|" * (len(show) + (1 if no_score else 2))]
    for r in rows:
        md.append("| " + " | ".join([r["provider"]] + [fmt(r.get(c["key"]), c.get("fmt"), lang).replace("|", "/") for c in show] + ([] if no_score else [nf(r.get("score", 0), 1, lang)])) + " |")
    md += [""] + [f"- {product_name(r)}: {r['note']}" for r in rows if r.get("note")]
    md += ["", f"## {s['rank']}", "", no_score_txt if no_score else s["rank_txt"].format(w=w), "", f"## {s['faq']}", ""]
    for q, a in faq:
        md += [f"**{q}**", "", a, ""]
    md += [f"## {s['sources']}", ""] + [f"- {u}" for u in srcs]
    return page, "\n".join(md) + "\n"


# ---------------------------------------------------------------- language home + methodology
def lang_home(lang, cats, datas, cols, nav, updated, markets, fx, news):
    s = S[lang]
    alternates = {l: url(l) for l in LANGS}
    canonical = alternates[lang]
    cards = []
    for slug, cfg in cats.items():
        rows = datas.get(slug, {}).get("items", [])
        best = rows[0] if rows else None
        sub = f"{s['top_in']}: {product_name(best)}" if best else ""
        cards.append(f'<a class="seo-card" href="{slug}/"><b>{esc(title_of(cfg, lang))}</b><small>{esc(sub)}</small></a>')
    fx_rows = ""
    if fx and fx.get("rates"):
        by = {r["ccy"]: r["rate"] for r in fx["rates"] if isinstance(r, dict)}
        fx_rows = "".join(f"<li>EUR/{k}: {nf(by[k], 4, lang)}</li>" for k in ("USD", "GBP", "CHF", "TRY", "JPY") if k in by)
        pol = fx.get("policy") or {}
        if pol.get("rate") is not None:
            fx_rows += f"<li>{esc(s['rate'])}: {nf(pol['rate'], 2, lang)}%</li>"
    mse = ""
    if markets and markets.get("mse_index"):
        mi = markets["mse_index"]
        mse = f"<li>{esc(mi.get('name', 'MSE'))}: {nf(mi.get('value') or mi.get('price') or 0, 3, lang)}</li>"
    news_items = (news or {}).get("items", [])[:8]
    news_html = "".join(f'<li><a href="{esc(n["url"])}" rel="noopener">{esc(n["title"])}</a> <span class="seo-muted">({esc(n.get("source", ""))})</span></li>' for n in news_items)
    jsonld = [
        {"@context": "https://schema.org", **ORG},
        {"@context": "https://schema.org", "@type": "WebSite", "@id": f"{BASE}/#site", "url": f"{BASE}/", "name": "CompareMalta.ai",
         "inLanguage": list(LANGS), "publisher": {"@id": f"{BASE}/#org"},
         "potentialAction": {"@type": "SearchAction", "target": f"{BASE}/?lang={lang}&q={{search_term_string}}#ask", "query-input": "required name=search_term_string"}},
        {"@context": "https://schema.org", "@type": "CollectionPage", "@id": canonical, "url": canonical, "name": s["site_title"], "inLanguage": lang,
         "dateModified": updated, "hasPart": [{"@type": "WebPage", "url": url(lang, slug), "name": title_of(cfg, lang)} for slug, cfg in cats.items()]},
    ]
    if news_items:
        jsonld.append({"@context": "https://schema.org", "@type": "ItemList", "name": s["news"], "itemListElement": [
            {"@type": "ListItem", "position": i + 1, "url": n["url"], "name": n["title"]} for i, n in enumerate(news_items)]})
    page = head(lang, s["site_title"], s["site_desc"], canonical, alternates, 1, jsonld) + topbar(lang, 1, alternates, nav) + f"""
<main class="seo-wrap">
<p class="seo-muted">{esc(s['updated'].format(d=date_txt(updated, lang)))}</p>
<h1 class="seo-h1">{esc(s['h_home'])}</h1>
<p class="seo-intro">{esc(s['h_sub'])}</p>
<div class="seo-cta"><a class="btn blue" href="../?lang={lang}#ask">{esc(s['ask'])}</a><a class="btn navy" href="../?lang={lang}#home">{esc(s['interactive'])}</a></div>
<section class="seo-sec"><h2>{esc(s['cats'])}</h2><div class="seo-grid">{''.join(cards)}</div></section>
<section class="seo-sec"><h2>{esc(s['markets'])}</h2><ul>{fx_rows}{mse}</ul><p class="seo-muted">{esc(s['fx'])}</p></section>
<section class="seo-sec seo-news"><h2>{esc(s['news'])}</h2><ul>{news_html}</ul></section>
</main>""" + footer(lang, 1, cats)
    return page


def methodology(lang, cats, cols, nav, updated):
    s = S[lang]
    alternates = {l: url(l, "methodology") for l in LANGS}
    canonical = alternates[lang]
    per = "".join(f"<li><b>{esc(title_of(cfg, lang))}</b>: {esc(weights(cfg, cols, lang) or s['no_score'])}</li>" for cfg in cats.values())
    jsonld = [{"@context": "https://schema.org", "@type": "WebPage", "@id": canonical, "url": canonical, "name": s["meth_title"], "inLanguage": lang,
               "dateModified": updated, "publisher": {"@id": f"{BASE}/#org"},
               "breadcrumb": crumbs([(s["home"], url(lang)), (s["methodology"], canonical)])}]
    return head(lang, f"{s['meth_title']} | CompareMalta.ai", s["meth_lead"], canonical, alternates, 2, jsonld) + topbar(lang, 2, alternates, nav) + f"""
<main class="seo-wrap"><div class="seo-crumb"><a href="../">{esc(s['home'])}</a> › {esc(s['methodology'])}</div>
<h1 class="seo-h1">{esc(s['meth_title'])}</h1><p class="seo-intro">{esc(s['meth_lead'])}</p>
<section class="seo-sec"><ul>{''.join(f'<li>{esc(x)}</li>' for x in s['meth_rules'])}</ul></section>
<section class="seo-sec"><h2>{esc(s['rank'])}</h2><ul>{per}</ul></section></main>""" + footer(lang, 2, cats)


def money_health(lang, nav, cats):
    """Static, shareable landing page for Money Health (the tool itself runs in the app)."""
    c = json.loads((Path(__file__).parent / "mh_copy.json").read_text(encoding="utf-8"))[lang]
    s = S[lang]
    alternates = {l: url(l, "money-health") for l in LANGS}
    canonical = alternates[lang]
    title = f"{c['nav']}: {c['h1']} | CompareMalta.ai"
    desc = f"{c['lead']} {c['lead2']}"
    jsonld = [{"@context": "https://schema.org", "@type": "WebApplication", "name": f"CompareMalta {c['nav']}", "url": canonical, "inLanguage": lang,
               "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "offers": {"@type": "Offer", "price": "0", "priceCurrency": "EUR"},
               "description": desc, "publisher": {"@id": f"{BASE}/#org"}},
              {"@context": "https://schema.org", **crumbs([(s["home"], url(lang)), (c["nav"], canonical)])}]
    pillars = "".join(f'<li><b>{esc(a)}</b>: {esc(b)}</li>' for a, b in c["pillars"])
    return head(lang, title, desc, canonical, alternates, 2, jsonld, image=f"og/{lang}/money-health.png") + topbar(lang, 2, alternates, nav) + f"""
<main class="seo-wrap"><div class="seo-crumb"><a href="../">{esc(s['home'])}</a> › {esc(c['nav'])}</div>
<p class="eyebrow">{esc(c['eyebrow'])}</p><h1 class="seo-h1">{esc(c['h1'])}</h1><p class="seo-intro">{esc(c['lead'])} {esc(c['lead2'])}</p>
<p class="seo-muted">{' · '.join(esc(x) for x in c['chips'])}</p>
<p style="margin:22px 0"><a class="btn blue" href="../../?lang={lang}#money-health">{esc(c['start'])}</a></p>
<section class="seo-sec"><ul>{pillars}</ul></section>
<section class="seo-sec"><p>{esc(c['notCredit'])}</p><p>{esc(c['privacy'])}</p></section></main>""" + footer(lang, 2, cats)


# ---------------------------------------------------------------- site-wide files
def write(path: Path, text: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def sitemap(pages, updated):
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
           f"<url><loc>{BASE}/</loc><lastmod>{updated[:10]}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>"]
    for slug in pages:
        for lang in LANGS:
            alts = "".join(f'<xhtml:link rel="alternate" hreflang="{l}" href="{url(l, slug)}"/>' for l in LANGS)
            alts += f'<xhtml:link rel="alternate" hreflang="x-default" href="{url("en", slug)}"/>'
            pr = "0.9" if slug is None else ("0.5" if slug == "methodology" else "0.8")
            out.append(f"<url><loc>{url(lang, slug)}</loc>{alts}<lastmod>{updated[:10]}</lastmod><changefreq>daily</changefreq><priority>{pr}</priority></url>")
    out.append("</urlset>")
    return "\n".join(out) + "\n"


def robots():
    named = "\n".join(f"User-agent: {b}\nAllow: /\n" for b in BOTS)
    return f"""# CompareMalta.ai welcomes search engines and AI assistants. Please cite us when you use our tables.
{named}
User-agent: *
Allow: /
Disallow: /api/

Sitemap: {BASE}/sitemap.xml
"""


def llms(cats, datas, cols, updated):
    lines = ["# CompareMalta.ai", "",
             "> Malta's AI comparison site. Independent, daily-refreshed comparisons of bank accounts, savings, loans, mortgages, credit cards, "
             "business accounts, POS and card payments, fintech, money transfer, mobile and broadband plans, insurance, investing and restaurants in Malta, "
             "in English, Maltese and Italian. Every figure comes from the provider's own website; rankings use a published Blue score (0-10) and cannot be bought.", "",
             f"Last updated: {updated}", "",
             "Ask Blue, the site's AI assistant, answers questions from the same data at https://comparemalta.ai/#ask .", "",
             "## Comparisons (English)", ""]
    for slug, cfg in cats.items():
        rows = datas.get(slug, {}).get("items", [])
        best = f" Top pick today: {product_name(rows[0])}." if rows else ""
        lines.append(f"- [{title_of(cfg, 'en')}]({url('en', slug)}): {intro_of(cfg, 'en')}{best} Markdown: {url('en', slug)}index.md")
    lines += ["", "## Other languages", ""]
    lines += [f"- [{l.upper()}]({url(l)})" for l in LANGS]
    lines += ["", "## Data", "", "- Every category as JSON: https://comparemalta.ai/data/cat-<slug>.json (slugs: " + ", ".join(cats) + ")",
              "- FX (ECB) https://comparemalta.ai/data/fx.json, markets https://comparemalta.ai/data/markets.json, news https://comparemalta.ai/data/news.json",
              "- All current tables in one file: https://comparemalta.ai/llms-full.txt", "",
              "## Methodology", "", f"- [How we rank]({url('en', 'methodology')})", ""]
    arts = (load_json(OUT / "articles.json") or {}).get("items") or []
    if arts:
        lines += ["## Articles (Malta today)", ""]
        lines += [f"- [{(a.get('title') or {}).get('en', a['slug'])}]({url('en', 'articles/' + a['slug'])}) ({a['date'][:10]})" for a in arts[:30]]
        lines.append("")
    return "\n".join(lines)


def run(status):
    cfg_all = load_json(OUT / "categories.json") or {}
    cats = cfg_all.get("config") or {}
    if not cats:
        status.stale("seo", RuntimeError("no categories.json yet"))
        return
    updated = cfg_all.get("updated") or now_iso()
    cols = _cols()
    datas = {slug: load_json(OUT / f"cat-{slug}.json") or {} for slug in cats}
    fx, markets, news = load_json(OUT / "fx.json"), load_json(OUT / "markets.json"), load_json(OUT / "news.json")
    navkeys = ["bank-accounts", "savings", "mortgages", "personal-loans", "credit-cards", "business-accounts", "pos", "fx", "telco-mobile"]
    count, full = 0, ["# CompareMalta.ai: all current comparisons", "", f"Generated {updated}. Source: https://comparemalta.ai", ""]
    for lang in LANGS:
        nav = [(k, title_of(cats[k], lang)) for k in navkeys if k in cats]
        for slug, cfg in cats.items():
            page, md = category_page(lang, slug, cfg, datas[slug], cols, cats, nav, updated)
            if not page:
                continue
            write(SITE / lang / slug / "index.html", page)
            write(SITE / lang / slug / "index.md", md)
            if lang == "en":
                full += [md, ""]
            count += 1
        write(SITE / lang / "index.html", lang_home(lang, cats, datas, cols, nav, updated, markets, fx, news))
        write(SITE / lang / "methodology" / "index.html", methodology(lang, cats, cols, nav, updated))
        write(SITE / lang / "money-health" / "index.html", money_health(lang, nav, cats))
    art_slugs = []
    try:  # editorial articles ("Malta today" features)
        import sys

        from . import articles as _arts
        art_pages, art_slugs = _arts.static_pages(sys.modules[__name__])
        for parts, page, md in art_pages:
            write(SITE.joinpath(*parts) / "index.html", page)
            write(SITE.joinpath(*parts) / "index.md", md)
    except Exception as e:  # noqa: BLE001
        log.warning("seo: article pages failed: %s", e)
    write(SITE / "sitemap.xml", sitemap([None, *cats.keys(), "money-health", "methodology", *art_slugs], updated))
    write(SITE / "robots.txt", robots())
    write(SITE / "llms.txt", llms(cats, datas, cols, updated))
    write(SITE / "llms-full.txt", "\n".join(full))
    status.ok("seo", count, f"{count} static pages in {len(LANGS)} languages, sitemap, robots, llms.txt")
    log.info("seo: %d category pages, sitemap with %d urls", count, (len(cats) + 2) * len(LANGS) + 1)
