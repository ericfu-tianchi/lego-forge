# LEGO Forge

Turn an idea — a sentence or a photo — into a **real, buildable LEGO set**, with the coding agent you already use.

You describe it; the agent designs it with real LEGO parts, checks that every piece really connects, reviews its own renders, and hands
you a page where the set turns, **takes itself apart and rebuilds itself**. You also get an LDraw file (open it in BrickLink Studio for
building steps and to order the parts) and a parts list.

```
"a cozy street-corner bakery"     →   lego-sets/bakery/out/set.html   (+ model.ldr, parts.csv)
"[photo of your two cats]"        →   lego-sets/two-cats/out/set.html
```

Sets are 300–1,500 parts: detailed enough to be worth building, small enough that the agent gets them right.
Needs [Node.js](https://nodejs.org) 18+. The first run installs everything else by itself.

## Install

**Any agent (Claude Code, Codex, Cursor, Gemini CLI, Kimi, …)** — paste this to your agent:

```
Clone https://github.com/OWNER/lego-forge into ~/lego-forge, then read ~/lego-forge/SKILL.md and use it whenever I ask for a LEGO set.
```

**As a skill** (agents that support `SKILL.md` skills — Claude Code, Codex and others):

```
git clone https://github.com/OWNER/lego-forge ~/.claude/skills/lego-forge     # Claude Code
git clone https://github.com/OWNER/lego-forge ~/.codex/skills/lego-forge      # Codex
```

**As a Claude Code plugin:**

```
/plugin marketplace add OWNER/lego-forge
/plugin install lego-forge@lego-forge
```

Then just ask: *"Build me a LEGO set of a lighthouse on a rocky island."* The agent may ask you one round of questions, then builds.
Open `lego-sets/<name>/out/set.html` in your browser.

## What is inside
- `SKILL.md` / `AGENTS.md` — the method the agent follows: brief → blockout → detail → check → self-review → deliver.
- `engine/` — 450 real LEGO parts (geometry from LDraw, with every stud and anti-stud located), the model API, a brick packer that
  staggers joints, proven sub-builds (buildings, vehicles, windows, roofs, signs, furniture, trees, minifigures…), the buildability
  checker, exporters.
- `bin/lego.mjs` — the command line the agent uses (`guide`, `new`, `build`, `shots`, `parts`, `part`, `docs`, `example`).
- `viewer/` — the page your set lives in (three.js).

## Credits
Part geometry comes from the [LDraw](https://www.ldraw.org) parts library, © LDraw.org contributors, licensed CC BY 2.0.
LEGO® is a trademark of the LEGO Group, which does not sponsor, authorise or endorse this project. Code: MIT.
