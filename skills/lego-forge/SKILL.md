---
name: lego-forge
description: Design a real, buildable LEGO set from an idea or a picture — real LEGO parts only, every part checked to connect on studs — and deliver a web page where the set turns, takes itself apart and rebuilds, plus an LDraw model (BrickLink Studio) and a parts list. Use when the user asks for a LEGO set, a LEGO model or "make X in LEGO", from words or from a photo.
---

# LEGO Forge

The toolkit is two folders above this file (the plugin root, which contains `bin/lego.mjs`). Below, `<toolkit>` means that folder.

1. Run `node <toolkit>/bin/lego.mjs guide` and follow the guide it prints, exactly — it is the whole method
   (brief → blockout → detail → check → self-review → deliver). The guide writes `lego …`: always type the full `node <toolkit>/bin/lego.mjs …` instead (there is no `lego` command on the PATH; don't define an alias).
2. Work in the user's current folder: sets are created in `./lego-sets/<name>/`. When it is done, run `lego open <name>` and give the user
   the printed link as a clickable link first — they should be one click from seeing their set.
3. The first run installs the toolkit's dependencies and, for review images, a headless browser (once). The method depends on looking at
   those images: if rendering is blocked (sandbox, permissions), stop and ask the user to allow it — don't carry on without them.
