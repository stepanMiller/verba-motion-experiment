# SVG arrows and network diagnosis — 16 October 2026

Branch: `fix/media-quality`, continuing from `ff5a012`. Not published; no paid generation or account/network settings changed.

## Updated controls

All 14 directional arrows now use a consistent 24×24 inline SVG set, 1.25px strokes and rounded joins/caps. Rightward arrows indicate actions; downward arrows indicate scrolling/download. No Unicode arrow glyphs or emoji. Existing visible Russian control labels provide accessible names; decorative SVGs have `aria-hidden=true`, `focusable=false` and ignore pointer events.

Action icons move 3px in their direction over 220ms on hover or keyboard focus. Touch hover effects are disabled. Reduced-motion disables both the transition and displacement. Keyboard focus has an explicit 2px current-color outline with a 5px offset. Existing touch targets remain at least 44×44 CSS pixels; larger buttons/tabs retain their original dimensions. Text, sections, video files, posters and the approved page transitions are unchanged in this commit.

## Validation

`python3 scripts/check_static.py`, `node --check app.js`, `node --check scripts/arrows_qa.mjs`, static export, standalone generation and `git diff --check` pass.

Dedicated Playwright QA passed six combinations: widths 1440, 390, 375 × normal/reduced motion. Checks cover all 14 icon semantics and accessible text labels, visible focus, directional animation, zero reduced-motion movement, minimum target size, ArrowRight tab navigation, and no HTTP/runtime errors. Desktop/mobile screenshots were visually inspected.

Full regression also passed: 34/34 checks at each of 1440, 390 and 375px (102 total), plus reduced-motion at all three widths, autoplay-denial and missing-video fixtures (5 scenarios). Both videos, hero transition, tabs, dialogs, FAQ and download remain functional. [Regression results](quality-evidence/arrows/regression-results.json).

- [Dedicated results](quality-evidence/arrows/results.json)
- [Desktop focus screenshot](quality-evidence/arrows/desktop-focus.png)
- [Mobile reduced-motion focus screenshot](quality-evidence/arrows/mobile-reduced-focus.png)

Repeat with existing Playwright and a running local server:

```sh
GSTACK_ROOT=/opt/codex/cua_node/lib VERBA_DEMO_URL=http://127.0.0.1:4175/ VERBA_QA_OUTPUT=/tmp/verba-arrows-new node scripts/arrows_qa.mjs
```

The old local port 4173 was occupied by an unresponsive process after environment restart; its initial test attempt returned `net::ERR_EMPTY_RESPONSE`. A fresh loopback preview on port 4175 was used for successful QA. No external network change was required. Browser coverage is Chromium on Linux with touch emulation, not physical Safari/iPhone.

## Exact location of HTTP 403

A fresh `curl -I` request on 16 October 2026 to both the official MP4 and existing GitHub Pages URL returned:

```text
curl: (56) CONNECT tunnel failed, response 403
HTTP/1.1 403 Forbidden
content-length: 16
content-type: text/plain
server: envoy
connection: close
```

Targets:

- `https://verbamayr.ru/upload/video/promo_.mp4`
- `https://stepanmiller.github.io/verba-motion-experiment/`

The rejection occurs at the environment's outbound proxy CONNECT step, before the HTTPS tunnel/TLS connection to the target origin is established. Therefore this observed error is a network gateway access restriction, **not evidence of an HTTP refusal from the VERBA origin**, and not evidence that an asset does not exist. The response does not disclose the precise gateway policy/rule ID. No bypass, proxy removal, alternate-IP routing or account/access setting changes were attempted.

## Still unfinished

- Hero still uses the existing 1280×720 MP4 (532,109 bytes) and 1280×720 poster (51,280 bytes). No higher-quality master has been obtained. Both the hero film and cover still need a verified better source; scaling/re-encoding the existing file is not represented as new detail.
- Photos remain the authentic repository sources plus previously added downsampled responsive variants. True original-detail improvement remains blocked by official source access. The parent task is preparing atmospheric candidates; real rooms and the physician have not been replaced with invented images.
- The parent task has two forest exports at 2560×1440 awaiting user selection. Neither has been integrated or substituted here. No new Runway credits were spent.
- Publication is explicitly on hold pending selection of the forest and completion of media integration/QA. This branch is not a new live demo.
