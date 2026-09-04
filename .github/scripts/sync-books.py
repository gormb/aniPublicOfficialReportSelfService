#!/usr/bin/env python3
"""Auto-deploy bøker: leser alle rader fra Supabase `books`-tabellen og laster ned
prod-PDF (Google Slides) til `deployed`-stien, dersom nå er innenfor autosync-vinduet.
Brukes av .github/workflows/sync-pdf.yml."""
import datetime, json, os, re, subprocess, sys

REPO = subprocess.check_output(['git', 'rev-parse', '--show-toplevel']).decode().strip()
BOOK_DIR = os.path.join(REPO, 'aniPublicOfficialReportSelfService_Html', 'wwwroot', 'Book')
DB_JS = 'https://gormb.github.io/_/db.js' # SUPABASE-konfig hentes fra DEN deployed versjonen (vedlikeholdes i annet prosjekt) – ingen lokal kopi

def get(url, headers=None):
    if not url.startswith(('http://', 'https://')):  # lokal filsti – les direkte (curl godtar ikke stier uten scheme)
        with open(url, encoding='utf-8') as f:
            return f.read()
    cmd = ['curl', '-fsSL']
    for k, v in (headers or {}).items():
        cmd += ['-H', f'{k}: {v}']
    cmd.append(url)
    return subprocess.check_output(cmd).decode()

def epoch(v):
    if not v:
        return None
    return datetime.datetime.fromisoformat(v.replace('Z', '+00:00')).timestamp()

# ---------------------------------------------------------------------------
# Tekstuttrekk (tiered .md / .json / TOC) – speiler font-tierne i LdD.js:
#   Garamond (vanlig) = common · EBGaramond/CEGaramond = premium ·
#   Calibri = free · Arial = comment. Hvit tekst vises aldri.
_ARIAL_RE    = re.compile(r'arial')
_PREM_RE     = re.compile(r'ebgaramond|cegaramond')
_FREE_RE     = re.compile(r'calibri')
_GARAMOND_RE = re.compile(r'garamond')
_SPOT_RE     = re.compile(r'https://gormb\.github\.io/_/?\?m(?!.*qr$)\S*', re.I)
_MODE_LABEL_RE = re.compile(r'^(?:gratisversjon|premiumversjon|free version|premium version)$', re.I)  # cover-/vannmerke-label – ikke bokinnhold (droppes fra .md)

def _font_tier(font):
    n = re.sub(r'^[^+]*\+', '', (font or '').lower())
    n = re.sub(r'[^a-z0-9]', '', n)
    if _ARIAL_RE.search(n):    return 'comment'
    if _PREM_RE.search(n):     return 'premium'
    if _FREE_RE.search(n):     return 'free'
    if _GARAMOND_RE.search(n): return 'common'
    return 'common'

def _is_white(color):
    return (color or 0) >= 0xfefefe

def _near(a, b, tol):
    return abs(a - b) < tol

def _page_lines(doc, pno):
    """Spans gruppert i linjer (topp→bunn, venstre→høyre) for én side."""
    d = doc[pno].get_text('dict')
    lines = []
    for block in d['blocks']:
        if block.get('type') != 0:
            continue
        for line in block['lines']:
            parts = [{'text': s['text'].strip(), 'font': s['font'],
                      'size': s['size'], 'color': s['color'],
                      'x': s['origin'][0], 'y': s['origin'][1]}
                     for s in sorted(line['spans'], key=lambda sp: sp['origin'][0])
                     if s['text'].strip()]
            if not parts:
                continue
            lines.append({'y': min(p['y'] for p in parts), 'parts': parts})
    lines.sort(key=lambda l: l['y'])
    return lines

def _pdf_style(doc):
    """Kalibrér størrelser/posisjoner fra de 4 siste (template-)slidene:
    cover, kapittel, underkapittel, tekst. body = dominerende størrelse.
    Samsvar på SPAN-nivå – placeholder-linja har også tier-etiketter (premium/freemium)."""
    n = doc.page_count
    s = {}
    for p in range(max(1, n - 3), n + 1):
        for block in doc[p - 1].get_text('dict')['blocks']:
            if block.get('type') != 0:
                continue
            for line in block['lines']:
                for sp in line['spans']:
                    t = sp['text'].strip()
                    if not t:
                        continue
                    size, y = sp['size'], sp['origin'][1]
                    if re.fullmatch(r'Underkapitteltittel(?:en)?|The Sub Chapter Title', t):
                        s['subH'], s['subY'] = size, y
                    elif re.fullmatch(r'Kapitteltittelen|The Chapter Title', t):
                        s['chapH'], s['chapY'] = size, y
                    elif re.fullmatch(r'Navnet På Boken|The Name of the Book', t):
                        s['coverH'] = size
    hist = {}
    for line in _page_lines(doc, n - 1):
        for pt in line['parts']:
            if pt['text']:
                h = round(pt['size'], 1)
                hist[h] = hist.get(h, 0) + 1
    s['body'] = max(hist, key=hist.get) if hist else 10
    return s

def _data(doc, style):
    """Port av cBook.data.get(): strukturerte blokker (chapter/sub/paragraph/link) per side.
    Kapittel vs. underkapittel avgjøres av Y-POSISJON på siden (chapY/subY fra template-sliden),
    ikke bare skriftstørrelse – som i LdD.js. Paragraphs beholder spans (for tier-filtrering)."""
    n = doc.page_count
    chapH = style.get('chapH') or 16
    chapY = style.get('chapY') or -1
    subY = style.get('subY') or -1
    coverH = style.get('coverH')
    tolH = chapH * 0.15
    tolY = 10
    out = []
    for pno in range(max(1, n - 4)):
        page = doc[pno]
        mid = page.rect.width / 2
        spans = []
        for block in page.get_text('dict')['blocks']:
            if block.get('type') != 0:
                continue
            for line in block['lines']:
                for s in line['spans']:
                    t = s['text'].strip()
                    if not t:
                        continue
                    spans.append({'text': t, 'font': s['font'], 'size': s['size'],
                                  'color': s['color'], 'x': s['origin'][0],
                                  'y': s['origin'][1], 'w': s['bbox'][2] - s['bbox'][0]})
        links = [l for l in page.get_links() if l.get('uri')]
        out.append({'type': 'page', 'page': pno + 1})
        for lang, side in (('no', lambda x: x < mid), ('en', lambda x: x > mid)):
            cur = None
            for sp in sorted((s for s in spans if side(s['x'])), key=lambda s: (s['y'], s['x'])):
                text = sp['text']
                bx = [sp['x'], sp['y'], sp['x'] + sp['w'], sp['y'] + sp['size']]
                lk = None
                for l in links:
                    r = l['from']
                    if r.x0 < bx[2] and bx[0] < r.x1 and r.y0 < bx[3] and bx[1] < r.y1:
                        lk = l
                        break
                m = _SPOT_RE.search(text)
                tier = _font_tier(sp['font'])
                def _spn():
                    return {'text': text, 'tier': tier, 'y': sp['y'], 'x': sp['x'],
                            'size': sp['size'], 'color': sp['color']}
                if lk or m:
                    if cur:
                        out.append(cur); cur = None
                    url = lk['uri'] if lk else m.group(0)
                    out.append({'type': 'link', 'page': pno + 1, 'lang': lang, 'text': text,
                                'url': url, 'spotify': bool(_SPOT_RE.search(url)),
                                'tier': tier, 'y': sp['y']})
                elif coverH and sp['size'] >= coverH * 0.85:
                    if cur:
                        out.append(cur); cur = None
                    out.append({'type': 'p', 'page': pno + 1, 'lang': lang, 'spans': [_spn()]})
                elif _near(sp['size'], chapH, tolH):
                    if cur:
                        out.append(cur); cur = None
                    y = sp['y']
                    typ = 'chapter' if _near(y, chapY, tolY) else 'sub' if _near(y, subY, tolY) else 'p'
                    if typ == 'p':
                        out.append({'type': 'p', 'page': pno + 1, 'lang': lang, 'spans': [_spn()]})
                    else:
                        out.append({'type': typ, 'page': pno + 1, 'lang': lang, 'text': text,
                                    'tier': tier, 'y': y})
                elif cur:
                    cur['spans'].append(_spn())
                else:
                    cur = {'type': 'p', 'page': pno + 1, 'lang': lang, 'spans': [_spn()]}
            if cur:
                out.append(cur)
    return out

def _title(doc, style, lang):
    """Port av cBook.data.title(): boktittel fra cover-sliden (side 1), språkbevisst."""
    coverH = style.get('coverH')
    if not coverH:
        return ''
    page = doc[0]
    mid = page.rect.width / 2
    items = []
    for block in page.get_text('dict')['blocks']:
        if block.get('type') != 0:
            continue
        for line in block['lines']:
            for s in line['spans']:
                t = s['text'].strip()
                x = s['origin'][0]
                if t and (x < mid if lang == 'no' else x > mid) and s['size'] >= coverH * 0.85:
                    items.append((s['origin'][1], x, t))
    items.sort()
    return ' '.join(t for _, _, t in items)

def _better_song(a, b):
    def bare_url(t):
        m = _SPOT_RE.search(t or '')
        return bool(m) and m.group(0) == (t or '').strip()
    ai, bi = bare_url(a), bare_url(b)
    if ai != bi:
        return not ai  # foretrekk beskrivende tittel over den nakne URL-en
    return len(a or '') > len(b or '')

_END_RE = re.compile(r'[.?!…]["»”’]?$|["»”’]$')  # linje slutter på .!? eller lukkende anførselstegn → nytt avsnitt

def _para_lines(spans, keep):
    """Slå spans til linjer (etter y), og koble innrykkede linjer til avsnitt
    (linjer som slutter på .!? avslutter avsnittet) – stripper ekstra newlines.
    Hvit tekst og spans utenfor `keep` hoppes over."""
    grouped = []
    for sp in sorted(spans, key=lambda s: (s['y'], s['x'])):
        if sp['tier'] not in keep or _is_white(sp.get('color')):
            continue
        if _MODE_LABEL_RE.match(sp['text']):  # «gratisversjon»/«premiumversjon»-vannmerke/label – ikke bokinnhold
            continue
        if grouped and abs(grouped[-1][0] - sp['y']) < (sp.get('size') or 10) * 0.6:
            grouped[-1][1].append(sp)
        else:
            grouped.append([sp['y'], [sp]])
    paras, cur = [], []
    for _, grp in grouped:
        txt = ' '.join(s['text'] for s in sorted(grp, key=lambda s: s['x']))
        cur.append(txt)
        if _END_RE.search(txt):
            paras.append(' '.join(cur))
            cur = []
    if cur:
        paras.append(' '.join(cur))
    return paras

def _md_lines(data, lang, keep, title):
    lines = [f'# {title}'] if title else ['# TOC']
    songs = {}
    for b in data:
        if b.get('type') == 'link' and b.get('spotify') and b.get('lang') == lang:
            k = (b['page'], b['url'])
            if k not in songs or _better_song(b['text'], songs[k]['text']):
                songs[k] = {'text': b['text'], 'url': b['url']}
    by_page = {}
    for (p, _), s in songs.items():
        by_page.setdefault(p, []).append(s)
    # Sider som allerede har synlig overskrift (kapittel/underkapittel) viser «p. N» selv.
    lang_pages = {b['page'] for b in data if b.get('lang') == lang}
    headed = {b['page'] for b in data
              if b.get('lang') == lang and b.get('type') in ('chapter', 'sub') and b.get('tier') in keep}
    for b in data:
        if b.get('type') == 'page':
            p = b['page']
            if p in lang_pages and p not in headed:
                lines.append(f'#### p. {p}')  # sidetall for sider uten overskrift
            continue
        if b.get('lang') != lang:
            continue
        t = b['type']
        if t == 'chapter' and b['tier'] in keep:
            lines.append(f'## {b["text"]} — p. {b["page"]}')
            lines.extend(f"🎵 {s['text']} ({s['url']}) — p. {b['page']}" for s in by_page.get(b['page'], []))
        elif t == 'sub' and b['tier'] in keep:
            lines.append(f'### {b["text"]} — p. {b["page"]}')
            lines.extend(f"🎵 {s['text']} ({s['url']}) — p. {b['page']}" for s in by_page.get(b['page'], []))
        elif t == 'p':
            lines.extend(_para_lines(b['spans'], keep))
    return lines

def _md_files(base, doc, style, data):
    for lang, label in (('no', 'NO'), ('en', 'EN')):
        title = _title(doc, style, lang) or 'TOC'
        for mode, keep in (('FREE', {'free', 'common'}), ('PREM', {'premium', 'common'})):
            lines = _md_lines(data, lang, keep, title)
            with open(f'{base}_{label}_{mode}.md', 'w', encoding='utf-8') as f:
                f.write('\n'.join(lines) + '\n')

def extract(pdf_path):
    """Lag 4 tiered .md-bøker ved siden av en bok-PDF:
    name_NO_FREE.md, name_NO_PREM.md, name_EN_FREE.md, name_EN_PREM.md
    (tittel + kapittel/underkapittel + sanger + brødtekst, tier-filtrert)."""
    try:
        import pymupdf as _fitz
    except ImportError:
        try:
            import fitz as _fitz
        except ImportError:
            print(f'[{os.path.basename(pdf_path)}] pymupdf mangler – hopper over tekstuttrekk', file=sys.stderr)
            return
    base = os.path.splitext(pdf_path)[0]
    doc = _fitz.open(pdf_path)
    style = _pdf_style(doc)
    data = _data(doc, style)  # port av cBook.data.get(): kapittel/sub via y-posisjon
    _md_files(base, doc, style, data)
    print(f'[{os.path.basename(pdf_path)}] tekstuttrekk: NO/EN × FREE/PREM .md')

def gh(kind, msg):
    """GitHub Actions annotation – surfaces on the run summary as a warning/error badge."""
    if os.environ.get('GITHUB_ACTIONS'):
        print(f'::{kind}::{msg}')
    else:
        print(f'[{kind.upper()}] {msg}', file=sys.stderr)

def _log(url, key, book, k, kind, message):
    """Persist a deploy event to public.log (u=book, d={kind,msg,run}) so it survives the run."""
    d = {'kind': kind, 'msg': message}
    run = os.environ.get('GITHUB_RUN_ID')
    if run:
        d['run'] = run  # group events from the same auto-deploy run in adm
    row = {'k': k, 'u': book or 'sync', 'd': d,
           'ts': datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')}
    cmd = ['curl', '-fsSL', '-X', 'POST', f'{url}/rest/v1/log',
           '-H', f'apikey: {key}', '-H', f'Authorization: Bearer {key}',
           '-H', 'Content-Type: application/json', '-H', 'Prefer: return=minimal',
           '-d', json.dumps(row)]
    try:
        subprocess.run(cmd, check=True, capture_output=True)
    except subprocess.CalledProcessError as e:
        gh('warning', f'[log] kunne ikke skrive til public.log: {e.stderr.decode() or e}')

def log_error(url, key, book, kind, message):
    _log(url, key, book, 'sync_error', kind, message)

def log_ok(url, key, book, message):
    _log(url, key, book, 'sync', 'ok', message)

def main():
    marker = os.path.join(REPO, '.sync-books-errors')
    if os.path.exists(marker):
        os.remove(marker)  # fresh run – only this run's problems should fail it
    cfg = get(DB_JS)
    m = re.search(r'window\.SUPABASE=\{url:"([^"]+)",publishableKey:"([^"]+)"\}', cfg)
    if not m:
        sys.exit(f'kunne ikke lese SUPABASE-konfig fra {DB_JS}')
    url, key = m.group(1), m.group(2)

    headers = {'apikey': key, 'Authorization': f'Bearer {key}'}
    q = f'{url}/rest/v1/books?select=book,deployed,prod,dtautosyncfrom,dtautosyncto'
    rows = json.loads(get(q, headers))

    now = datetime.datetime.now(datetime.timezone.utc).timestamp()
    export_re = re.compile(r'docs\.google\.com/presentation/d/([^/]+)')
    n = 0
    errors = 0
    for r in rows:
        book = (r.get('book') or '').strip()
        deployed = (r.get('deployed') or '').strip()
        if deployed and not deployed.startswith('b/'):
            deployed = 'b/' + deployed.lstrip('/')  # alltid under b/-undermappen
        prod = (r.get('prod') or '').strip()
        if not (book and deployed and prod):
            print(f'[{book or "(uten navn)"}] mangler deployed/prod – hopper over')
            continue
        # Layout guard: deployed must be the NESTED path (b/<book>/b.pdf). The old flat
        # path (b/<book>.pdf) drops files straight into b/ – the "garbage" on every sync.
        if re.fullmatch(r'b/[^/]+', deployed):
            sug = os.path.splitext(deployed)[0] + '/b.pdf'
            msg = f'deployed={deployed!r} er GAMMEL flat layout – sett books.deployed til nestet: {sug!r}'
            gh('error', f'[{book}] {msg}')
            log_error(url, key, book, 'flat_layout', msg)
            errors += 1
            continue
        frm, to = epoch(r.get('dtautosyncfrom')), epoch(r.get('dtautosyncto'))
        if (frm is not None and now < frm) or (to is not None and now > to):
            print(f'[{book}] utenfor autosync-vindu – hopper over')
            continue
        if '/export/pdf' in prod:
            src = prod
        else:
            mm = export_re.search(prod)
            src = f'https://docs.google.com/presentation/d/{mm.group(1)}/export/pdf' if mm else prod
        dest = os.path.join(BOOK_DIR, deployed)
        try:
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            print(f'[{book}] {src} -> {deployed}')
            subprocess.run(['curl', '-fsSL', '-L', src, '-o', dest], check=True)
            n += 1
            extract(dest)  # sidecars: .md / _free.md / _tech.md / .json / _TOC
            log_ok(url, key, book, f'synkronisert {deployed}')
        except Exception as e:
            gh('error', f'[{book}] nedlasting FEIL: {e}')
            log_error(url, key, book, 'download', str(e))
            errors += 1
    print(f'ferdig: {n} bok(er) synkronisert')
    if errors:
        open(marker, 'w').write(f'{errors}\n')  # workflow fails AFTER valid books are pushed

if __name__ == '__main__':
    main()
