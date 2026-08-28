#!/usr/bin/env python3
"""Auto-deploy bøker: leser alle rader fra Supabase `books`-tabellen og laster ned
prod-PDF (Google Slides) til `deployed`-stien, dersom nå er innenfor autosync-vinduet.
Brukes av .github/workflows/sync-pdf.yml."""
import datetime, json, os, re, subprocess, sys

REPO = subprocess.check_output(['git', 'rev-parse', '--show-toplevel']).decode().strip()
BOOK_DIR = os.path.join(REPO, 'aniPublicOfficialReportSelfService_Html', 'wwwroot', 'Book')
DB_JS = os.path.join(BOOK_DIR, 'db.js') # lokal db.js i repoet (leses direkte)

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

def main():
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
    for r in rows:
        book = (r.get('book') or '').strip()
        deployed = (r.get('deployed') or '').strip()
        if deployed and not deployed.startswith('b/'):
            deployed = 'b/' + deployed.lstrip('/')  # alltid under b/-undermappen
        prod = (r.get('prod') or '').strip()
        if not (book and deployed and prod):
            print(f'[{book or "(uten navn)"}] mangler deployed/prod – hopper over')
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
        except Exception as e:
            print(f'[{book}] FEIL: {e}', file=sys.stderr)
    print(f'ferdig: {n} bok(er) synkronisert')

if __name__ == '__main__':
    main()
