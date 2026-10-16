#!/usr/bin/env python3
"""Validate the deployable static files without adding a build system."""
from html.parser import HTMLParser
from pathlib import Path
import re, json, hashlib

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_TEXT = ['index.html', 'styles.css', 'app.js', 'assets/motion/pretext.js']

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.refs = set(); self.ids = []; self.anchors = []; self.videos = {}; self.images = []
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get('id'): self.ids.append(a['id'])
        for key in ['src', 'href', 'poster', 'data-src']:
            value = a.get(key, '')
            if value.startswith('assets/'): self.refs.add(value)
        for candidate in a.get('srcset', '').split(','):
            value = candidate.strip().split(' ')[0]
            if value.startswith('assets/'): self.refs.add(value)
        if tag == 'a' and a.get('href', '').startswith('#'): self.anchors.append(a['href'][1:])
        if tag == 'video': self.videos[a.get('id')] = a
        if tag == 'img': self.images.append(a)

def inspect():
    html = (ROOT/'index.html').read_text(); css = (ROOT/'styles.css').read_text(); app = (ROOT/'app.js').read_text()
    page = Page(); page.feed(html)
    page.refs.update(re.findall(r'''url\(["']?(assets/[^)'" ]+)''', css))
    page.refs.add('assets/motion/pretext.js')
    errors = []
    if len(page.ids) != len(set(page.ids)): errors.append('Duplicate HTML IDs')
    for target in page.anchors:
        if target not in page.ids: errors.append('Missing anchor: '+target)
    for ref in page.refs:
        path = ROOT/ref
        if not path.is_file() or not path.stat().st_size: errors.append('Missing/empty asset: '+ref)
    if any('alt' not in image for image in page.images): errors.append('Image without alt attribute')
    for name, content in [('index.html', html), ('app.js', app), ('styles.css', css)]:
        if re.search(r'verba\s+mayr|верба\s+майер|ранее\s+verba', content, re.I): errors.append('Obsolete brand in '+name)
        if any(0x1F300 <= ord(char) <= 0x1FAFF for char in content): errors.append('Pictographic emoji in '+name)
        if re.search(r'AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{30,}|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY', content): errors.append('Possible credential in '+name)
    forest = page.videos.get('forest-video', {})
    if 'src' in forest or 'loop' in forest or forest.get('preload') != 'none': errors.append('Forest must be lazy and non-looping')
    if not forest.get('poster') or not forest.get('data-src'): errors.append('Forest poster/source missing')
    hero = page.videos.get('hero-video', {})
    if 'src' in hero or hero.get('preload') != 'none' or not hero.get('data-src'): errors.append('Hero must defer video loading until motion is allowed')
    if hero.get('poster') != 'assets/motion/hero-poster.webp': errors.append('Approved hero poster changed')
    if 'Питание и привычки по методу Майера' not in app: errors.append('Confirmed MAYR method unexpectedly removed')
    report = {'architecture':'Static HTML/CSS/ES module; no production build required', 'status':'pass' if not errors else 'fail', 'assets':len(page.refs), 'html_ids':len(page.ids), 'internal_anchor_count':len(page.anchors), 'errors':errors}
    return page.refs, report

if __name__ == '__main__':
    _, report = inspect(); print(json.dumps(report, ensure_ascii=False, indent=2)); raise SystemExit(bool(report['errors']))
