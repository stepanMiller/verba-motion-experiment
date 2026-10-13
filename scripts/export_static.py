#!/usr/bin/env python3
"""Copy an allowlist to _site; exclude Git, internal reports and unused assets."""
from pathlib import Path
import shutil, json
from check_static import ROOT, PUBLIC_TEXT, inspect

refs, report = inspect()
if report['errors']: raise SystemExit(json.dumps(report, ensure_ascii=False))
target = ROOT/'_site'
if target.exists(): shutil.rmtree(target)
target.mkdir()
evidence = ['demo-evidence/index.html', 'demo-evidence/styles.css', 'demo-evidence/desktop-1440.png',
            'demo-evidence/mobile-390.png', 'demo-evidence/mobile-375.png',
            'demo-evidence/desktop-motion.mp4', 'demo-evidence/mobile-motion.mp4']
files = sorted(set(PUBLIC_TEXT)|refs|set(evidence))
for rel in files:
    if not (ROOT/rel).is_file() or not (ROOT/rel).stat().st_size:
        raise SystemExit('Missing/empty public file: '+rel)
    dest = target/rel; dest.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(ROOT/rel, dest)
for file in (ROOT/'licenses').glob('*.txt'):
    dest = target/'licenses'/file.name; dest.parent.mkdir(exist_ok=True); shutil.copy2(file, dest)
(target/'.nojekyll').write_text('')
print(json.dumps({'status':'pass','output':'_site','files':files,'note':'Static export only; no compilation or dependency install'},ensure_ascii=False,indent=2))
