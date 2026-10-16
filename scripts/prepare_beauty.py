#!/usr/bin/env python3
"""Decode the approved transport and create web derivatives without upscaling."""
from pathlib import Path
import base64,hashlib,json,io
from PIL import Image
root=Path(__file__).resolve().parents[1]
data=base64.b64decode((root/'assets/incoming/beauty-verbaskin-v2.png.base64').read_text())
assert len(data)==2269809
assert hashlib.sha256(data).hexdigest()=='0675a0756cc349c71d812a397e3f3355784b3be8c74bcfa241fd0e3f94e3dc2a'
source=Image.open(io.BytesIO(data));assert source.size==(1122,1402)
for width in [480,800,1122]:
    image=source if width==1122 else source.resize((width,round(source.height*width/source.width)),Image.Resampling.LANCZOS)
    target=root/f'assets/motion/beauty-verbaskin-{width}.webp'
    image.save(target,'WEBP',quality=94,method=6)
    print(target.name,image.size,target.stat().st_size)
