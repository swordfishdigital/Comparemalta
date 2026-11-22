"""Build social preview images (Open Graph, 1200x630) for WhatsApp, Facebook, LinkedIn, X and iMessage.

Run locally after design changes:  python3 tools/og_images.py
Needs node + jsdom (to render the site's own SVG art from site/assets/visuals.js), rsvg-convert and Pillow.
Writes site/og/home.png, site/og/<lang>/{money-health,articles,cat-<slug>}.png. Article pages use their own photo."""
import json, os, subprocess, tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
OUT = SITE / "og"
FONT = "/usr/share/fonts/opentype/inter/Inter-{}.otf"
NAVY, NAVY2, BLUE, PEACH, MUTED = (13, 42, 74), (8, 28, 51), (43, 76, 196), (242, 181, 142), (180, 198, 222)
W, H = 1200, 630
f = lambda w, s: ImageFont.truetype(FONT.format(w), s)

def svgs(cats):
    js = f"""const {{JSDOM}}=require("jsdom"),fs=require("fs");const w=new JSDOM("",{{runScripts:"outside-only"}}).window;
w.eval(fs.readFileSync({json.dumps(str(SITE/'assets/visuals.js'))},"utf8"));const V=w.CMV,o={{}};
o.mascot=V.mascot(600,"wink");o.hero=V.hero();for(const c of {json.dumps(cats)})o["cat-"+c]=V.catBanner(c);
o.articles=V.catBanner("news");process.stdout.write(JSON.stringify(o));"""
    out = subprocess.run(["node", "-e", js], capture_output=True, text=True, cwd=os.environ.get("JSDOM_DIR", "/tmp/jt"), check=True).stdout
    o = json.loads(out)
    o["hero"] = drop_group(o["hero"], '<g transform="translate(445 124) scale(1.55)">')  # one Blue per image
    return o

def drop_group(svg, start):
    i = svg.find(start)
    if i < 0: return svg
    depth, j = 0, i
    while True:
        a, b = svg.find("<g", j), svg.find("</g>", j)
        if a != -1 and a < b: depth += 1; j = a + 2
        else:
            depth -= 1; j = b + 4
            if depth == 0: return svg[:i] + svg[j:]

def raster(svg, width):
    with tempfile.NamedTemporaryFile("w", suffix=".svg", delete=False) as t:
        t.write(svg); p = t.name
    png = p + ".png"; subprocess.run(["rsvg-convert", "-w", str(width), p, "-o", png], check=True)
    return Image.open(png).convert("RGBA")

def base():
    im = Image.new("RGB", (W, H), NAVY); d = ImageDraw.Draw(im)
    for y in range(H):  # soft vertical gradient
        k = y / H; d.line([(0, y), (W, y)], fill=tuple(int(NAVY[i] * (1 - k) + NAVY2[i] * k) for i in range(3)))
    for x in range(30, W, 60):
        for y in range(30, H, 60): d.rectangle([x, y, x + 3, y + 3], fill=(24, 58, 98))
    return im

def brand(d, x, y, size=34):
    d.text((x, y), "CompareMalta", font=f("Bold", size), fill="white")
    w = d.textlength("CompareMalta", font=f("Bold", size)); d.text((x + w, y), ".ai", font=f("Bold", size), fill=PEACH)

def wrap(d, text, font, maxw):
    lines, cur = [], ""
    for word in text.split():
        t = (cur + " " + word).strip()
        if d.textlength(t, font=font) <= maxw: cur = t
        else: lines.append(cur); cur = word
    return lines + [cur] if cur else lines

def card(title, sub, art=None, mascot=None, tag=None):
    im = base(); d = ImageDraw.Draw(im)
    if art is not None:  # illustration panel on the right, rounded
        a = art.copy(); a.thumbnail((540, 420)); bg = Image.new("RGBA", a.size, (20, 52, 92, 255)); bg.alpha_composite(a); a = bg; mask = Image.new("L", a.size, 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, *a.size], 28, fill=255)
        im.paste(a, (W - a.width - 50, (H - a.height) // 2), mask)
    if mascot is not None:
        m = mascot.copy(); m.thumbnail((220, 180)); im.paste(m, (W - m.width - 30, H - m.height - 20), m)
    brand(d, 60, 56, 32)
    if tag: d.rounded_rectangle([60, 120, 60 + d.textlength(tag, font=f("Bold", 20)) + 32, 158], 19, fill=BLUE); d.text((76, 126), tag, font=f("Bold", 20), fill="white")
    y = 190
    for line in wrap(d, title, f("Bold", 58), 500)[:3]: d.text((60, y), line, font=f("Bold", 58), fill="white"); y += 68
    y += 10
    for line in wrap(d, sub, f("Medium", 26), 500)[:3]: d.text((60, y), line, font=f("Medium", 26), fill=MUTED); y += 36
    return im.convert("RGB")

def home(mascot, hero):
    im = base(); d = ImageDraw.Draw(im)
    h = hero.copy(); h = h.resize((640, int(640 * h.height / h.width))); h = h.crop((0, 40, 640, 40 + 420))
    mask = Image.new("L", h.size, 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, *h.size], 30, fill=255)
    im.paste(h, (500, 105), mask)
    m = mascot.copy(); m.thumbnail((380, 320)); glow = Image.new("RGBA", im.size, (0, 0, 0, 0))
    im.paste(m, (300, 300), m)  # Blue sits in the centre so square crops (WhatsApp small previews) still show him
    brand(d, 60, 70, 52)
    d.text((60, 150), "Malta's AI comparison site", font=f("SemiBold", 32), fill="white")
    for i, t in enumerate(["Banks · Loans · Cards · POS · FX", "Telco · Groceries · Money Health"]): d.text((60, 210 + i * 40), t, font=f("Medium", 26), fill=MUTED)
    d.rounded_rectangle([60, 312, 300, 360], 24, fill=BLUE); d.text((84, 322), "Ask Blue →", font=f("Bold", 24), fill="white")
    return im.convert("RGB")

def gauge_svg(score=78):
    import math
    frac = (score - 1) / 99; L = math.pi * 120
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 175"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#ff6b5b"/><stop offset=".35" stop-color="#ffb547"/><stop offset=".6" stop-color="#ffe066"/><stop offset=".8" stop-color="#7bdc8f"/><stop offset="1" stop-color="#2fd18b"/></linearGradient></defs>
<path d="M30 150 A120 120 0 0 1 270 150" fill="none" stroke="#ffffff" stroke-opacity=".15" stroke-width="22" stroke-linecap="round"/>
<path d="M30 150 A120 120 0 0 1 270 150" fill="none" stroke="url(#g)" stroke-width="22" stroke-linecap="round" stroke-dasharray="{L}" stroke-dashoffset="{L*(1-frac)}"/>
<text x="150" y="140" text-anchor="middle" font-family="Inter" font-weight="700" font-size="58" fill="#fff">{score}<tspan font-size="20" fill="#9fb0c9">/100</tspan></text></svg>"""

T = {"en": {"mh": ("Money Health", "Your free Money Health Score from 1 to 100, in about 3 minutes. Answers first, documents only if you choose."), "art": ("Blue's picks", "Guides, rankings and deep dives to help you live, eat and bank better in Malta."), "tag": "Compare in Malta"},
     "mt": {"mh": ("Saħħa Finanzjarja", "Il-Money Health Score tiegħek b'xejn minn 1 sa 100, f'madwar 3 minuti."), "art": ("L-għażliet ta' Blue", "Gwidi, klassifiki u analiżi biex tgħix, tiekol u tibbankja aħjar f'Malta."), "tag": "Qabbel f'Malta"},
     "it": {"mh": ("Money Health", "Il tuo Money Health Score gratuito da 1 a 100, in circa 3 minuti."), "art": ("Le scelte di Blue", "Guide, classifiche e approfondimenti per vivere, mangiare e gestire i soldi meglio a Malta."), "tag": "Confronta a Malta"}}

def main():
    cfg = json.loads((SITE / "data/categories.json").read_text())["config"]
    art = svgs(list(cfg))
    mascot = raster(art["mascot"], 600); hero = raster(art["hero"], 1000)
    OUT.mkdir(exist_ok=True); home(mascot, hero).save(OUT / "home.png", optimize=True)
    gauge = raster(gauge_svg(), 560)
    for lang, t in T.items():
        (OUT / lang).mkdir(exist_ok=True)
        card(*t["mh"], art=gauge, mascot=mascot, tag={"en": "1 to 100", "mt": "1 sa 100", "it": "da 1 a 100"}[lang]).save(OUT / lang / "money-health.png", optimize=True)
        card(*t["art"], art=raster(art["articles"], 700), mascot=mascot, tag="Blue").save(OUT / lang / "articles.png", optimize=True)
        for slug, c in cfg.items():
            title = c.get(f"title_{lang}") or c.get("title_en") or slug
            sub = (c.get(f"intro_{lang}") or c.get("intro_en") or "").split(".")[0][:120]
            card(title, sub, art=raster(art["cat-" + slug], 700), mascot=mascot, tag=t["tag"]).save(OUT / lang / f"cat-{slug}.png", optimize=True)
    print("og images:", sum(1 for _ in OUT.rglob("*.png")))

if __name__ == "__main__":
    main()
