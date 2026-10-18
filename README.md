# LEGO Forge

**Say an idea, or send a photo. Your coding agent builds it as a real LEGO set** — one you can spin, take apart and rebuild in the browser, and actually buy and build.

![Sets built by agents with LEGO Forge](docs/showcase.jpg)

- **Real LEGO parts only** — 450 official moulds from the LDraw library, every stud where the real part has it.
- **Actually buildable** — every brick is checked to lock onto studs: nothing floats, nothing overlaps.
- **Looks designed** — proven sub-builds (buildings, vehicles, signs, furniture, minifigures, trees…) and a self-review loop.
- **One click to see it** — a single web page where the set turns, takes itself apart and rebuilds.
- **Build it for real** — an LDraw file for BrickLink Studio (instructions, ordering) and a parts list.
- **Any agent** — Claude Code, Codex, Cursor, Gemini, Kimi… Nothing to set up but Node.js 18+.

## Install

Paste this to your agent:

```
Clone https://github.com/ericfu-tianchi/lego-forge to ~/lego-forge, read ~/lego-forge/SKILL.md, and use it whenever I ask for a LEGO set.
```

Claude Code plugin: `/plugin marketplace add ericfu-tianchi/lego-forge` then `/plugin install lego-forge@lego-forge`.

## Use

> *Build me a LEGO set of a cozy street-corner bakery.*

> *Make my two cats in LEGO.* (with a photo)

---
By Tianchi Fu · MIT · part geometry © LDraw.org contributors, CC BY 2.0
