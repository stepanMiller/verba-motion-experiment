#!/usr/bin/env python3
"""Restore the verified official hero poster without changing its pixels."""
from pathlib import Path
import base64,hashlib
root=Path(__file__).resolve().parents[1]
raw=base64.b64decode((root/'assets/incoming/official-pool-1920x1080.webp.base64').read_text())
assert len(raw)==114574
assert hashlib.sha256(raw).hexdigest()=='78a754a9d8725df275c51773aa91f242f2c91d12c6fe224b26d6a48d9a141f82'
(root/'assets/motion/hero-pool-poster.webp').write_bytes(raw)
print('Verified official poster restored byte-for-byte')
