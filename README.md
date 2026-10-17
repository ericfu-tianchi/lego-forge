# LEGO Forge

Turn an idea — a sentence or a picture — into a **real, buildable LEGO set**, with any coding agent (Claude Code, Codex, Cursor, …).

You describe it; the agent designs it with real LEGO parts, checks that every piece really connects, reviews its own renders, and hands you a page
where the set turns, **takes itself apart and rebuilds itself**. You also get an LDraw file (open it in BrickLink Studio to see building
instructions and order the parts) and a parts list.

```
"a cozy street-corner bakery"      →   sets/bakery/out/set.html   (+ model.ldr, parts.csv)
"[photo of your house]"            →   sets/my-house/out/set.html
```

## Use it
1. `git clone … && cd lego-forge && npm install && npx playwright install chromium`
2. Open the folder with your coding agent and ask for a set: *"Build me a LEGO set of a lighthouse on a rocky island."*
   The agent reads `AGENTS.md` (Claude Code reads it via `CLAUDE.md`) and follows the pipeline. It may ask you one round of questions.
3. Open `sets/<name>/out/set.html`.

Sets are sized for 300–1,500 parts: detailed enough to be worth building, small enough that the agent gets it right.

## What is inside
- `AGENTS.md` — the method the agent follows: brief → blockout → detail → check → self-review → deliver.
- `engine/` — the parts catalogue (real LDraw geometry + where every stud and anti-stud is), the model API, a brick packer that staggers
  joints, proven sub-builds (`kit.mjs`: windows, doors, roofs, trees, minifigures, wheels…), the buildability checker, exporters.
- `viewer/` — the page your set lives in (three.js).
- `bin/lego.mjs` — `new`, `build`, `shots`, `parts`.
- `docs/` — parts list and pictures, colours, review rubric.

## Credits
Part geometry comes from the [LDraw](https://www.ldraw.org) parts library, © LDraw.org contributors, licensed CC BY 2.0.
LEGO® is a trademark of the LEGO Group, which does not sponsor or endorse this project.
