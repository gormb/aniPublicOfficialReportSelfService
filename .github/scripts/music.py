#!/usr/bin/env python3
"""Bind hver sang i boken til kapittel / underkapittel / side – og sett inn rader som mangler.

Sidecarene (.md) er sannheten for hvor en sang står: linja `🎵 [tittel; artist](url)`
ligger under siste `## kapittel` / `### underkapittel`, etter siste `#### p. N`-markør.
Denne leser dem (etter at sync-books.py har skrevet sidecarene) og speiler det inn i
public.music – tabellen der følelsene bindes til handling (contents/relevance) og
teksten hentes fra redir.txt (via txt_id), se music_vw i music.sql.

Bare TOMNE ch/su/page fylles – håndredigering i music.html vinner. `--overwrite`
skriver over også der det står noe. PREM er mesteren (kalles med --overwrite),
FREE er reserve (update-only) i tilfelle en versjon senere får annen sidetall.

  python music.py                     # fyll inn tomme ch/su/page + sett inn nye sanger
  python music.py --overwrite         # overskriv også eksisterende ch/su/page
  python music.py --ed PREM           # bare PREM-sidecaret (default: PREM før FREE)
  python music.py --lg EN             # les engelsk sidecar (default NO)
  python music.py --dry-run           # vis hva som ville skjedd, skriv ingenting

En rad oppdateres bare når dens lg er tom eller lik sidecarets språk, så EN-kjøring
kan ikke skrive engelske kapittelnavn over en NO-rad (id-en er delt mellom språkene).
"""
import glob, json, os, re, subprocess, sys

REPO = subprocess.check_output(['git', 'rev-parse', '--show-toplevel']).decode().strip()
BOOK_DIR = os.path.join(REPO, 'aniPublicOfficialReportSelfService_Html', 'wwwroot', 'Book')
DB_JS = 'https://aigap.no/db.js'  # SUPABASE-konfig fra den deployed versjonen (som sync-books.py)

def get(url, headers=None):
    if not url.startswith(('http://', 'https://')):
        with open(url, encoding='utf-8') as f:
            return f.read()
    cmd = ['curl', '-fsSL', '--max-time', '30']
    for k, v in (headers or {}).items():
        cmd += ['-H', f'{k}: {v}']
    return subprocess.check_output(cmd + [url]).decode()

def rest(url, key, path, method='GET', body=None, prefer='return=minimal'):
    cmd = ['curl', '-fsSL', '--max-time', '30', '-X', method, f'{url}/rest/v1/{path}',
           '-H', f'apikey: {key}', '-H', f'Authorization: Bearer {key}', '-H', f'Prefer: {prefer}']
    if body is not None:
        cmd += ['-H', 'Content-Type: application/json', '-d', json.dumps(body)]
    return subprocess.check_output(cmd).decode()

# sang-URL i sidecaret: https://aigap.no/mXXXX (eller den gamle gormb.github.io-formen)
_SONG_RE = re.compile(r'https://(?:aigap\.no/m|gormb\.github\.io/_/?\?m)([A-Za-z0-9]+)')
_PAGE_RE = re.compile(r'^####\s+p\.\s*(\d+)')

def parse_md(path):
    """(tittel, [ {key,page,ch,su}, … ]) fra ett sidecar. key = id-en i URL-en uten ledende m."""
    title, page, ch, su, songs = '', None, None, None, []
    with open(path, encoding='utf-8') as f:
        for line in f:
            line = line.rstrip('\n')
            m = _PAGE_RE.match(line)
            if m:
                page = int(m.group(1))
            elif line.startswith('### '):
                su = line[4:].strip()
            elif line.startswith('## '):
                ch, su = line[3:].strip(), None
            elif line.startswith('# '):
                title = line[2:].strip()
            elif line.startswith('🎵'):
                u = _SONG_RE.search(line)
                if u:
                    songs.append({'key': u.group(1), 'page': page, 'ch': ch, 'su': su})
    return title, songs

def id_map(redir_rows):
    """URL-nøkkel/alias → redir-id (samme aliaser som music.js: r.id, r.id uten m, m+r.id, qr-strip)."""
    out = {}
    for r in redir_rows:
        i = (r.get('id') or '').strip()
        if not i:
            continue
        keys = {i, 'm' + i}
        if i[:1].lower() == 'm':
            keys.add(i[1:])
        if i.endswith('qr'):
            keys.add(i[:-2])
        if i.endswith('qra'):
            keys.add(i[:-3])
        for k in keys:
            out.setdefault(k, i)
    return out

def main(argv=None):
    args = sys.argv[1:] if argv is None else argv
    dry, over, lg, ed = '--dry-run' in args, '--overwrite' in args, 'NO', ''
    if '--lg' in args:
        lg = args[args.index('--lg') + 1].upper()
    if '--ed' in args:
        ed = args[args.index('--ed') + 1].upper()

    m = re.search(r'window\.SUPABASE=\{url:"([^"]+)",publishableKey:"([^"]+)"\}', get(DB_JS))
    if not m:
        sys.exit(f'kunne ikke lese SUPABASE fra {DB_JS}')
    url, key = m.group(1), m.group(2)

    red = json.loads(rest(url, key, 'redir?select=id,desc,url,group&group=eq.Music') or '[]')
    idof = id_map(red)
    have = {r['id']: r for r in json.loads(rest(url, key, 'music?select=id,ch,su,page,lg') or '[]')}

    # sidecar for språket (og utgaven). Uten --ed: PREM før FREE – første forekomst av en sang vinner
    pattern = f'b_{lg}_{ed}.md' if ed else f'b_{lg}_*.md'
    files = sorted(glob.glob(os.path.join(BOOK_DIR, 'b', '*', pattern)),
                   key=lambda p: (0 if 'PREM' in os.path.basename(p) else 1, p))
    seen, unknown = {}, []
    for path in files:
        title, songs = parse_md(path)
        slug = os.path.basename(os.path.dirname(path))
        for s in songs:
            rid = idof.get(s['key'])
            if not rid:
                unknown.append((s['key'], os.path.basename(path)))
            elif rid not in seen:
                seen[rid] = dict(s, book=title or slug)

    ins, upd = [], []
    for rid, s in seen.items():
        cur = have.get(rid)
        if cur is None:
            ins.append({'id': rid, 'ch': s['ch'], 'su': s['su'], 'page': s['page'],
                        'book': s['book'], 'lg': lg, 'ed': '1'})
            continue
        if cur.get('lg') and cur['lg'] != lg:  # en NO-rad eies ikke av EN-sidecaret (id delt mellom språkene)
            continue
        patch = {f: s[f] for f in ('ch', 'su', 'page')
                 if s[f] not in (None, '') and (over or cur.get(f) in (None, '')) and s[f] != cur.get(f)}
        if patch:
            upd.append((rid, patch))

    for row in ins:
        print(f"+ {row['id']:8} p{row['page']!s:>4}  {row['ch'] or ''} / {row['su'] or ''}")
        if not dry:
            rest(url, key, 'music', 'POST', row, prefer='return=minimal,resolution=merge-duplicates')
    for rid, patch in upd:
        print(f"~ {rid:8} {patch}")
        if not dry:
            rest(url, key, f'music?id=eq.{rid}', 'PATCH', patch)

    tag = f'{lg}/{ed}' if ed else lg
    print(f'[{tag}] {len(files)} sidecar(er): {len(ins)} nye, {len(upd)} oppdatert'
          + (' (dry-run)' if dry else ' i public.music'))
    if unknown:
        print(f'[{tag}] sanger i .md som ikke finnes i redir (Music): '
              + ', '.join(f'{k} ({f})' for k, f in unknown))
    rest_ids = [r['id'] for r in red if r['id'] not in seen]
    if rest_ids:
        print(f'[{tag}] i redir Music, men utenfor bokens tekstdel (blir stående uten side): '
              + ', '.join(rest_ids))

if __name__ == '__main__':
    main()
