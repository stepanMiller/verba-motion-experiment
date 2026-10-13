#!/usr/bin/env python3
"""Embed the local, reviewed motion prototype; no network or installation."""
from pathlib import Path
import base64, mimetypes, re
root = Path(__file__).resolve().parent
def data_url(name):
    file = root / name
    mime = mimetypes.guess_type(file)[0] or 'application/octet-stream'
    return 'data:' + mime + ';base64,' + base64.b64encode(file.read_bytes()).decode()
html = (root / 'index.html').read_text()
css = (root / 'styles.css').read_text()
css = re.sub(r"url\(['\"]?(assets/[^)'\"]+)['\"]?\)", lambda m: 'url("' + data_url(m[1]) + '")', css)
html = re.sub(r'(src|href|poster)="(assets/[^\"]+)"', lambda m: m[1] + '="' + data_url(m[2]) + '"', html)
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>' + css + '</style>')
html = html.replace('<script type="module" src="app.js"></script>', '')
bundle = (root / 'assets/motion/pretext.js').read_text()
bundle = re.sub(r'export\{[^}]+\};?\s*$', '', bundle)
app = (root / 'app.js').read_text().split('\n', 1)[1]
script = bundle + '\n{const prepare=X1,layout=Z1,setLocale=D1;\n' + app + '\n}'
html = html.replace('</body>', '<script type="module">' + script + '</script></body>')
policy = "default-src data: blob:; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src blob:; form-action 'none'; base-uri 'none'; object-src 'none'"
html = html.replace('<meta charset="utf-8">', '<meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="' + policy + '">')
(root / 'standalone.html').write_text(html)
print('standalone.html:', len(html.encode()), 'bytes')
