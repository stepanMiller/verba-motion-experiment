#!/usr/bin/env python3
"""Verify all transport parts, decode and verify the approved forest B exports."""
from pathlib import Path
import base64,hashlib,json
root=Path(__file__).resolve().parents[1]
manifest=json.loads((root/'assets/incoming/forest/manifest.json').read_text())
for file in manifest['files']:
    parts=[]
    for item in file['parts']:
        raw=(root/item['path']).read_bytes()
        assert len(raw)==item['bytes'],item['path']
        assert hashlib.sha256(raw).hexdigest()==item['sha256'],item['path']
        parts.append(raw.strip())
    data=base64.b64decode(b''.join(parts),validate=True)
    assert len(data)==file['bytes'],file['filename']
    assert hashlib.sha256(data).hexdigest()==file['sha256'],file['filename']
    (root/'assets/motion'/file['filename']).write_bytes(data)
    print(file['filename'],len(data),file['sha256'])
