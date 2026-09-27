#!/usr/bin/env python3
"""Fjern ugyldig word-map-cache (public.map) etter boksynk.

En endret node gjør noden OG alle foreldrene ugyldige – helt opp til roten. Da
cache-stien `wher` har bokens korteste entydige prefiks som første token
(f.eks. l*n*p.n.nulls = LifeDemanded… · NO · PREM), så en endret bok tømmer
hele grenen sin: boken (prefikset) + alle barn. `--wher P` tømmer en gitt gren.

Checksum gater slettingen: sist kjente sha1 per bok ligger i cachen som en
reservert rad (what='CRC', wher=<books.book>). Uendret bok ⇒ ingenting skjer.

  python cache.py                # tøm hvis en bok er endret (checksum-gate)
  python cache.py --rebuild      # samme
  python cache.py --rebuild-all  # tøm alltid
  python cache.py --wher l*n*p   # tøm bare denne grenen
  python cache.py --dry-run      # vis, slett ingenting
"""
import hashlib, json, os, re, subprocess, sys

REPO = subprocess.check_output(['git', 'rev-parse', '--show-toplevel']).decode().strip()
BOOK_DIR = os.path.join(REPO, 'aniPublicOfficialReportSelfService_Html', 'wwwroot', 'Book')
DB_JS = 'https://aigap.no/db.js'
CRC = 'CRC'  # reservert filter for bøkenes checksum – aldri en ekte cache-rad

def get(url, headers=None):
    if not url.startswith(('http://', 'https://')):
        with open(url, encoding='utf-8') as f:
            return f.read()
    cmd = ['curl', '-fsSL', '--max-time', '30']
    for k, v in (headers or {}).items():
        cmd += ['-H', f'{k}: {v}']
    return subprocess.check_output(cmd + [url]).decode()

def rest(url, key, path, method='GET', body=None):
    cmd = ['curl', '-fsSL', '--max-time', '30', '-X', method, f'{url}/rest/v1/{path}',
           '-H', f'apikey: {key}', '-H', f'Authorization: Bearer {key}', '-H', 'Prefer: return=minimal']
    if body is not None:
        cmd += ['-H', 'Content-Type: application/json', '-d', json.dumps(body)]
    return subprocess.check_output(cmd).decode()

def book_sha(deployed):
    """sha1 over bokens synkede filer (.pdf + sidecar-.md) – kun checksum."""
    d = os.path.join(BOOK_DIR, deployed.rsplit('/', 1)[0]) if deployed else ''
    if not d or not os.path.isdir(d):
        return ''
    h = hashlib.sha1()
    for f in sorted(os.listdir(d)):
        p = os.path.join(d, f)
        if os.path.isfile(p) and f.endswith(('.pdf', '.md')):
            h.update(open(p, 'rb').read())
    return h.hexdigest()

def on_branch(node, path):
    """node = stamfar-til-eller-seg-selv av path (token-grense '*' eller '.')."""
    return path == node or (path.startswith(node) and path[len(node):len(node) + 1] in ('*', '.'))

def hi_cut(ns, c):
    """korteste entydige prefiks (lowercase) blant ns – speiler play.js hiCut."""
    lo = lambda x: str(x or '').strip().lower()
    n = lo(c)
    if re.fullmatch(r'\d+', n):
        return n
    k = 1
    while k < len(n) and sum(1 for x in ns if lo(x)[:k] == n[:k]) > 1:
        k += 1
    return n[:k]

def shelf_slugs():
    """bokens rekkefølge på hyllen – bestemmer hiCut-prefikset i `wher`."""
    try:
        with open(os.path.join(BOOK_DIR, 'b', 'shelf.json'), encoding='utf-8') as f:
            return [str(x.get('book') or '') for x in json.load(f).get('books', []) if x.get('book')]
    except OSError:
        return []

def wipe(url, key, dry):
    rows = json.loads(rest(url, key, 'map?select=whatwhere') or '[]')
    if not dry:
        rest(url, key, 'map?whatwhere=not.is.null', 'DELETE')
    return len(rows)

def purge(url, key, branches, dry):
    """Slett hver rad på (eller over) en gren: noden + foreldre + barn."""
    rows = json.loads(rest(url, key, 'map_show?select=whatwhere,what,wher') or '[]')
    ids = [r['whatwhere'] for r in rows if r['what'] != CRC and r['wher']
           and any(on_branch(b, r['wher']) or on_branch(r['wher'], b) for b in branches)]
    if ids and not dry:
        rest(url, key, 'map?whatwhere=in.(%s)' % ','.join(ids), 'DELETE')
    return len(ids)

def main():
    args = sys.argv[1:]
    dry = '--dry-run' in args
    cfg = get(DB_JS)
    m = re.search(r'window\.SUPABASE=\{url:"([^"]+)",publishableKey:"([^"]+)"\}', cfg)
    if not m:
        sys.exit(f'kunne ikke lese SUPABASE fra {DB_JS}')
    url, key = m.group(1), m.group(2)

    if '--rebuild-all' in args:
        print(f'{"[dry] ville tømt" if dry else "tømte"} hele public.map ({wipe(url, key, dry)} rader)')
        return

    if '--wher' in args:  # eksplisitt gren, hopp over checksum
        br = [a for i, a in enumerate(args) if i and args[i - 1] == '--wher']
        print(f'{"[dry] ville fjernet" if dry else "fjernet"} {purge(url, key, br, dry)} rader på gren(ene) {br}')
        return

    meta = {r['wher']: (r['words'] or {}) for r in json.loads(
        rest(url, key, f'map_show?select=wher,words,what&what=eq.{CRC}') or '[]')}
    changed = []
    for b in json.loads(rest(url, key, 'books?select=book,deployed') or '[]'):
        slug, dep = (b.get('book') or '').strip(), (b.get('deployed') or '').strip()
        sha = book_sha(dep)
        if not (slug and sha) or sha == (meta.get(slug) or {}).get('sha1'):
            print(f'[{slug or "?"}] uendret – hopper over')
            continue
        changed.append((slug, sha))
    if not changed:
        print('ingen bøker endret')
        return
    n = purge(url, key, [hi_cut(shelf_slugs(), s) for s, _ in changed], dry)  # gren = bokens prefiks i wher
    if not n and not dry:
        n = wipe(url, key, dry)  # rader uten gjenkjennelig prefiks kan ikke skilles – tøm alt
    if not dry:
        for slug, sha in changed:
            rest(url, key, 'rpc/map_set', 'POST', {'what': CRC, 'wher': slug, 'words': {'sha1': sha}})
    print(f'{"[dry] ville fjernet" if dry else "fjernet"} {n} cache-rader ({len(changed)} endret bok(er))')

if __name__ == '__main__':
    main()
