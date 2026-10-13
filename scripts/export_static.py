#!/usr/bin/env python3
"""Copy an allowlist to _site for Pages; exclude Git, docs, QA and unused assets."""
from pathlib import Path
import shutil, json
from check_static import ROOT, PUBLIC_TEXT, inspect

refs, report = inspect()
if report['errors']: raise SystemExit(json.dumps(report, ensure_ascii=False))
target = ROOT/'_site'
if target.exists(): shutil.rmtree(target)
target.mkdir()
files = sorted(set(PUBLIC_TEXT)|refs)
for rel in files:
    dest = target/rel; dest.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(ROOT/rel, dest)
for file in (ROOT/'licenses').glob('*.txt'):
    dest = target/'licenses'/file.name; dest.parent.mkdir(exist_ok=True); shutil.copy2(file, dest)
(target/'.nojekyll').write_text('')
print(json.dumps({'status':'pass','output':'_site','files':files,'note':'Static export only; no compilation or dependency install'},ensure_ascii=False,indent=2))
