#!/usr/bin/env python3
"""Recover Kanak AI frontend with verified TLS; never changes Vercel."""
from pathlib import Path
from urllib.request import Request, urlopen
import ssl, re, json, hashlib, zipfile
ROOT = Path(__file__).resolve().parent
SITE = ROOT / 'editable-site'
SITE.mkdir(exist_ok=True)
try:
    import certifi
    context = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    context = ssl.create_default_context(cafile='/etc/ssl/cert.pem')
def fetch(url):
    with urlopen(Request(url, headers={'User-Agent':'Mozilla/5.0'}), context=context, timeout=30) as response:
        if response.status != 200: raise ValueError(response.status)
        return response.read()
source = fetch('https://kanak-ai-site-six.vercel.app/').decode('utf-8')
if '<title>Kanak AI' not in source or '</html>' not in source:
    raise SystemExit('Response is not the complete Kanak AI frontend')
(ROOT/'original-index.html').write_text(source)
styles = re.findall(r'<style\b[^>]*>(.*?)</style>', source, re.S|re.I)
scripts = re.findall(r'<script\b[^>]*>(.*?)</script>', source, re.S|re.I)
(SITE/'styles.css').write_text('\n'.join(styles))
(SITE/'app.js').write_text('\n'.join(scripts))
editable = re.sub(r'<style\b[^>]*>.*?</style>', '<link rel="stylesheet" href="styles.css">', source, flags=re.S|re.I)
editable = re.sub(r'<script\b[^>]*>.*?</script>', '<script src="app.js"></script>', editable, flags=re.S|re.I)
errors=[]
for name in ['live-account-summary.png','live-account-pnl.png','live-account-risk.png']:
    try:
        data=fetch('https://kanak-ai-site-six.vercel.app/proof/'+name)
        if not data.startswith(b'\x89PNG'): raise ValueError('Not PNG')
        (SITE/'proof').mkdir(exist_ok=True)
        (SITE/'proof'/name).write_bytes(data)
    except Exception as e: errors.append({'asset':'proof/'+name,'error':str(e)})
font_url = re.search(r'<link href="(https://fonts.googleapis.com/css2[^\"]+)"',source).group(1)
css=fetch(font_url).decode()
(SITE/'fonts').mkdir(exist_ok=True)
for url in set(re.findall(r'url\((https://[^)]+)\)',css)):
    data=fetch(url)
    name=hashlib.sha256(data).hexdigest()[:16]+'.woff2'
    (SITE/'fonts'/name).write_bytes(data)
    css=css.replace(url,'fonts/'+name)
(SITE/'fonts.css').write_text(css)
editable=editable.replace(font_url,'fonts.css')
editable=re.sub(r'<link rel="preconnect" href="https://fonts.googleapis.com">\n?', '',editable)
(SITE/'index.html').write_text(editable)
report={'source':'https://kanak-ai-site-kanakmay26-4532s-projects.vercel.app/','public_alias':'https://kanak-ai-site-six.vercel.app/','deployment':'dpl_Gp1NBsEV6S8SHnNFW47k6BCByXab','github':'KanakAi repository is empty; other accessible repositories are unrelated trading dashboards.','missing_assets':errors,'limitations':['Three proof images are referenced but absent from the live deployment.','TradingView requires internet.','Checkout requires original server APIs and payment credentials, excluded from this frontend backup.'],'tls':'Certificate and hostname verification enabled using certifi or macOS CA bundle.'}
(ROOT/'recovery-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps({'html_bytes':len(source.encode()),'css_bytes':(SITE/'styles.css').stat().st_size,'js_bytes':(SITE/'app.js').stat().st_size,'fonts':len(list((SITE/'fonts').iterdir())),'missing_assets':errors},indent=2))
