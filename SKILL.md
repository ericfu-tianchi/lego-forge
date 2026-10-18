---
name: lego-forge
description: Design a real, buildable LEGO set from an idea or a picture — real LEGO parts only, every part checked to connect on studs — and deliver a web page where the set turns, takes itself apart and rebuilds, plus an LDraw model (BrickLink Studio) and a parts list. Use when the user asks for a LEGO set, a LEGO model or "make X in LEGO", from words or from a photo.
---

# LEGO Forge

This folder is the toolkit. Its command line is `node <this folder>/bin/lego.mjs`.

1. Run `node <this folder>/bin/lego.mjs guide` and follow the guide it prints, exactly — it is the whole method
   (brief → blockout → detail → check → self-review → deliver). Call the CLI as `node <this folder>/bin/lego.mjs` wherever the guide writes `lego`.
2. Work in the user's current folder: sets are created in `./lego-sets/<name>/`; the user opens `./lego-sets/<name>/out/set.html`.
3. The first run installs the toolkit's dependencies and, for review images, a headless browser (once).
