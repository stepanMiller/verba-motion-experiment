#!/usr/bin/env python3
"""Reproduce local downsampled photos. Requires Pillow; never upscale a source."""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'assets/motion'
for name, widths in {'mayr':[640], 'mind':[640], 'spa':[640], 'beauty-care':[640,960], 'medical':[960]}.items():
    with Image.open(root / f'{name}.webp') as source:
        for width in widths:
            assert width < source.width
            height = round(source.height * width / source.width)
            source.resize((width,height), Image.Resampling.LANCZOS).save(
                root / f'{name}-{width}.webp', 'WEBP', quality=92, method=6)
