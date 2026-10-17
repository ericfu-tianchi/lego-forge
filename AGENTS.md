# LEGO Forge — instructions for the agent

You turn an idea (a sentence, or a picture) into **one LEGO set**: a model made only of real LEGO parts, every part held on real studs,
shown in a page where it turns, takes apart and rebuilds itself. The user gets `sets/<name>/out/set.html` (open in any browser),
plus `model.ldr` (opens in BrickLink Studio) and `parts.csv`.

**The bar is a set someone would be proud to put on a shelf**, not a pile of bricks that passes a test: the subject is recognisable at a
glance, the proportions are right, it looks designed. Target **300–1,500 parts** (hard limit 2,000).

Read this file once, completely, before you start. Then read `docs/TECHNIQUES.md` and the worked examples — `examples/cottage/`
(a minifig-scale scene) and `examples/retro-computer/` (a display-scale object): read each `build.mjs` and look at its `out/hero.png`. The parts list is `docs/PARTS.md` (pictures of every part:
`docs/gallery/<category>.png`), colours `docs/COLORS.md`, the review rubric `docs/RUBRIC.md`.

---

## 0. Setup (once)
```
npm install
npx playwright install chromium      # for review images; skip if it fails and say so to the user
```

## 1. The pipeline — follow it in order

### Step 1 · Brief (and at most one round of questions)
Create the set: `node bin/lego.mjs new <name>` → `sets/<name>/brief.md` and `build.mjs`. Fill in the brief:
- **Subject** in one sentence, and the **scale** (§3).
- **Signature features**: the 3–5 things that make this subject recognisable (a red phone box: the crown on top, the long glazed sides, the
  white "TELEPHONE" band; a retro PC: beige case, deep CRT monitor, keyboard, floppy slot). Everything else is secondary.
- **Size**: footprint in studs, height in plates, part target.
- **Palette**: 4–8 colours from the real thing (§4).
- **Out**: what you leave out on purpose.

**Questions.** Ask when the request cannot be built as asked (a whole city, "every building") — propose the scoped-down set you would
build and let them confirm. Otherwise ask only when an answer would change the result a lot *and* cannot be inferred ("a computer" — a 1980s beige
desktop or a modern laptop?). Put everything in **one message**: the brief as you plan it, the 1–3 questions with your proposed default
for each. If the request is clear, do not ask — say what you are building and build it. Never more than two rounds of questions in total.

**From words only**: you are your own reference. Before the brief, write down what the real thing looks like — its parts, proportions
(width : depth : height), materials and colours, the details people remember. If you have a web search or image tool, look at 2–3 photos.

**From a picture**: look at it carefully before writing the brief. Write down the proportions you can measure (width : depth : height of the
main masses, in pixels → studs), counts (windows, columns, floors), colours, and what cannot be seen (the back) and how you will handle it.
Keep the reference image in the set folder; you will compare against it in step 5.

### Step 2 · Blockout
In `build.mjs`, build the big masses only, as plain `m.box(...)` volumes at the right footprint and height, on a base if it is a scene.
`node bin/lego.mjs build <name>` then `node bin/lego.mjs shots <name>` and look at `out/sheet.png`.
**Get the proportions and silhouette right now** — it is cheap here and expensive later. With a picture: `shots <name> --ref <image> --view front|hero|…`
puts the reference beside the render (`out/compare.png`).

### Step 3 · Detail
Turn the blocks into a model. **Buildings: start from `kit.building`** (it gives a correct, detailed structure in one call), then make it
yours — the details that make *this* building recognisable, its colours, figures and setting. Otherwise: walls with windows and doors (kit), roofs (kit or slopes), the signature features built precisely, then
texture and life (§5). Use `docs/PARTS.md` and `node bin/lego.mjs parts <words>` to find parts. Build in sections (`m.section('tower', () => …)`).

### Step 4 · Check — must PASS
`node bin/lego.mjs build <name>` runs the checker. **0 errors** before you continue. Every message says what is wrong, where (line of
build.mjs and grid position) and what to do. Fix the cause, not the symptom (a part "not connected" usually sits one plate too high, or
on a smooth tile, or on the sloped face of a slope).

### Step 5 · Review — look at your own renders, critically
`node bin/lego.mjs shots <name>` → `out/sheet.png` (six views) and `out/hero.png`. **Open and look at both images every round.**
Close-ups: `shots <name> --only <section>` renders one section alone. With a picture: `--ref <image> --view <angle>` → `out/compare.png`.
(Shots you take during the blockout don't count as review rounds.)
1. **Critique first**: write in `brief.md` at least five concrete problems you can see ("the left wall is a blank 10×12 white surface",
   "the tower is thinner than the door is wide", "the rock is a stepped rectangle"). Builders always rate their own work too high —
   assume a strict LEGO designer is looking.
2. **Then score** with `docs/RUBRIC.md`, applying its caps (a cap is a ceiling: a big blank wall caps Detail at 5 however nice the rest is).
3. Fix the lowest row first, then the next. Repeat steps 3–5 until every row is ≥ 7 — **at most 3 review rounds**; then deliver with an
   honest note of what is still weak.

### Step 6 · Deliver
Tell the user: what you built (one paragraph), the part count, the file to open (`sets/<name>/out/set.html`), and that `model.ldr`
opens in BrickLink Studio for building instructions and part ordering.

---

## 2. Coordinates
```
        −z (back)
          ↑
 −x  ←  (set)  →  +x          x, z: studs (grid columns)       y: plates, up (1 brick = 3 plates)
          ↓                    a part's x, z = the min corner of its footprint; y = its bottom face
        +z (front: faces the viewer)
```
- `rot` turns a part a quarter at a time about its own centre (0–3). Footprints swap: a 2×4 brick is 4×2 at rot 1.
- A part sits on another when its `y` equals the top of the one below: a brick at y = 3 sits on a brick at y = 0; a plate at y = 1 sits on a plate at y = 0.
- The **front is +z**: put the most interesting side there. Figures face the front with rot 0.
- Things that face a direction (kit windows and doors, figures, slopes) use the same rule: **rot 0 faces +z (front), 1 faces +x (right),
  2 faces −z (back), 3 faces −x (left)**. A window in the left wall of a house is rot 3; in the back wall rot 2.
- A wall built with `box()` from x to x+w−1: its front wall is the row z+d−1, its back wall the row z, its left wall column x, right x+w−1.
- Half studs (x = 2.5) only where a jumper plate (15573, 87580) or a kit put them.

## 3. Scale — pick one, keep it everywhere
- **Minifigure scale** (scenes, buildings, vehicles with people): a minifigure is 2×1 studs and ~13 plates tall with hair. A door is 1×4×6
  (18 plates); a storey is 18–24 plates; a car is 4–6 studs wide; a tree 20–35 plates; a lamp post 15–20 plates.
- **Display scale** (an object as a model: a computer, a camera, a guitar): the object itself is the set, sized so its key details can be
  built (often 1:2–1:1 of the real thing for small objects). Every detail is built from parts; nothing is "implied".
- **Micro scale** (a whole city block, a ship): 1 stud ≈ 1–2 m; windows become tiles and grilles, people are left out.
Mixing scales (a minifig next to a micro building) is the most common way a set looks wrong.

**How big.** A set is 300–1,500 parts (the checker refuses under 150). Typical sizes: a house or shop scene 400–1,000 parts on a 24×24–32×32 base;
a vehicle 200–500; an object model 300–800; a landmark 500–1,500. A small subject (a lighthouse, a food cart) gets a setting — ground, water,
rocks, plants, a figure or two — not filler. A minifig-scale building is at least 10×8 studs and 2 storeys (or one storey + roof ≥ 30 plates). A space a minifigure stands in
(a shop, a bus deck) needs ≥ 15 plates of headroom.

**Living things** (people, pets, animals): use the moulded parts at minifig scale — `kit.minifig`, and the animals in `docs/PARTS.md`
(cats 11602 / 13786p03, dog 26078p01, birds, fish, frog). "My cat on the sofa" is a cosy minifig-scale room with a cat on the sofa,
not a brick sculpture of a cat. Sculpting a living thing from bricks is the hardest thing in LEGO design; don't, unless asked for a
display-scale sculpture.

**The level things stand on**: y is always the level of the top surface you put a part on — the base's top (`g`), or `g + 1` on a
plate laid over it (paving, a rug's plate), `g + 3` on a brick.

## 4. Colour
- 4–8 colours. One main colour (the subject's material), one or two secondary, one or two accents used sparingly (doors, signs, flowers).
- Take colours from the real thing / the picture, then pick the nearest LEGO colour (`docs/COLORS.md`). Stone is Tan, Light Bluish Gray or
  Dark Tan; wood is Reddish Brown or Dark Tan; roofs Dark Bluish Gray, Reddish Brown or Dark Red; glass Trans Clear or Trans Light Blue.
- The base is neutral (Dark Bluish Gray, Tan, Green for grass) so the subject stands out.

## 5. What makes a set look designed (the rubric checks these)
1. **Signature features built precisely**, at the right proportion and place — if they are wrong, nothing else matters.
2. **Silhouette and proportion**: compare with the subject; real ratios, compressed only where a part forces it.
3. **No dead surfaces**: break large walls with windows, pilasters (1×1 round bricks), ledges, a contrasting plinth course, grilles; finish
   floors, paths and table-tops with **tiles**; leave studs where they read as texture (grass, roofs) and tile where things are smooth.
4. **Part variety**: slopes for roofs and chamfers, curves for rounded forms, round bricks/plates/cones for columns, lamps, knobs. A set of
   only plain bricks looks like a blockout (the checker warns below 12% specialty parts; good sets are 25–50%).
5. **Life and story** (minifig scale): 1–3 minifigures each doing something legible, a few plants, one or two props. Not a crowd.
6. **One structure**: everything connects; no floating details. Gaps for a minifigure (doors, paths) are at least 2 studs wide.
   A minifigure needs room: keep 1 stud clear on each side of its 2×1 footprint (its arms) and nothing above it for 4 bricks.
   (Only a vehicle on its own wheels may stand loose, as a parked car would.)
7. **Economy**: hollow interiors (`box(..., { hollow: true })`), large plates for floors, no solid fill that cannot be seen.

## 6. The build script (`build.mjs`)
```js
import { Model } from '../../engine/model.mjs';
import * as kit from '../../engine/kit.mjs';
const m = new Model({ title: 'Corner Bakery', subtitle: 'a two-storey shop on a street corner', budget: [600, 1500] });
const g = kit.base(m, { w: 32, d: 24, color: 'Dark Bluish Gray' });          // base: returns the plate level of its top (2)
m.section('shop', () => {
  m.box(4, g, 6, 16, 10, 18, 'Tan', { hollow: true });                         // walls 16×10, 18 plates (6 bricks), hollow
  kit.door(m, { x: 10, y: g, z: 15, color: 'Dark Green' });                     // cuts its own opening in the front wall (z = 15)
  kit.window(m, { x: 5, y: g + 6, z: 15, size: '1x2x3' });
  m.box(4, g + 18, 6, 16, 10, 1, 'Dark Bluish Gray', { kind: 'plate' });        // floor/roof slab
  kit.roof(m, { x: 4, y: g + 19, z: 6, w: 16, d: 10, color: 'Reddish Brown' });
});
kit.minifig(m, { x: 22, y: g, z: 18, torso: 'apron', shirt: 'White', face: 'smile', hair: 'bob', hairColor: 'Dark Brown' });
export default m;
```
### Model methods
| call | does |
|---|---|
| `new Model({ title, subtitle, budget: [min, max], focus, view })` | the set. `focus: '<section>'` frames the opening view closer on that section (the subject of a scene: the cat, the stall); `view: [azimuth°, elevation°]` sets the opening angle (default [35, 24]) |
| `m.part(id, x, y, z, color, rot)` | any part from `docs/PARTS.md` |
| `m.brick(size, x, y, z, color, rot)` · `m.plate(…)` · `m.tile(…)` | a plain part by its LEGO size; rot 0 = long side along x, rot 1 = along z |
| `m.box(x, y, z, w, d, h, color, { hollow, kind, top })` | fills w×d studs × h plates with bricks/plates, joints staggered automatically. `h` multiple of 3 → bricks; `kind: 'plate'` slabs, `'tile'` smooth floors/paths; `hollow: true` = walls one stud thick; `top: 'plate'` = a solid lid on a hollow box (needed for anything narrower built on top: a setback, a chimney); `top: 'tile'` = a solid lid finished with tiles |
| `m.cut(x, y, z, w, d, h)` | removes the box() volume built so far in a region (openings, inlays): box first, then cut (kits cut their own openings) |
| `m.section(tag, fn)` | groups parts (shown in check messages; `shots --only tag` renders just that section) |
| `m.rigid(fn)` | parts that are one unit (as kits use); rarely needed |

`box()` volumes are turned into real bricks after build.mjs runs. Parts placed with `part()` and box volumes may not overlap — cut the box.
`brick/plate/tile` take the LEGO name of the size (`'1x4'`, `'2x6'` — order doesn't matter) and a `rot`: **rot 0 lays the long side
left–right (along x), rot 1 front–back (along z)**. `m.plate('1x6', 3, 1, 0, 'Tan')` runs from x 3 to 8; `m.plate('1x6', 3, 1, 0, 'Tan', 1)` from z 0 to 5.
To see any part's studs and anti-studs from above: `node bin/lego.mjs part <id>`.
Tiles have no studs on top: nothing can be built on them (that is the point) — except that a part placed directly on a tiled
`box()` floor (a figure, a table, a lamp) gets the tiles under it turned into plates automatically, as a builder would leave studs there. Studs only connect to a part whose bottom is exactly on them.
A part centred on an even-width part (a 1×1 on a 2×2) needs a jumper plate (15573, 87580) under it.

### Kit (`engine/kit.mjs`) — proven sub-builds; use them instead of re-inventing
| call | builds |
|---|---|
| `kit.building(m, { x, y, z, w, d, floors, wall, plinth, trim, roof: 'gable'∣'flat', roofColor, window, door, shop: { sign, awning, glazing }, chimney })` | **a finished minifig-scale building** — plinth, quoins, windows with sills on every storey, door, storey bands, roof, chimney; `shop` makes the ground floor a shopfront with an awning and a sign. Start every building from this, then customise and add (it returns the storey levels) |
| `kit.base(m, { x, z, w, d, color, under })` | a 2-plate base that holds together; returns the top level |
| `kit.window(m, { x, y, z, rot, size: '1x2x2'∣'1x2x3'∣'1x4x3', frame, glass, sill })` | frame + glass in a wall (cuts its opening). rot = the side it looks out of (0 front … 3 left); `sill: colour` adds a sill |
| `kit.door(m, { x, y, z, rot, frame, color })` | 1×4×6 door frame + door (cuts its opening; 18 plates tall) |
| `kit.roof(m, { x, y, z, w, d, color, gable, ridge: 'x'∣'z', overhang, stripes: [colours], snow: colour })` | a 45° pitched roof over a rectangle; even number of studs across the ridge; returns the top level |
| `kit.tree(m, { x, y, z, size: 'S'∣'M'∣'L', leaves, cap, trunk })` | a leafy tree on a 2×2 footprint (canopy ~6×6) |
| `kit.pine(m, { x, y, z, big })` · `kit.bush(…)` · `kit.flower(m, { x, y, z, color })` | moulded plants |
| `kit.lamp(m, { x, y, z, color, light })` | a street lamp on one stud |
| `kit.bench(m, { x, y, z, rot, color, legs })` | a garden bench, 4 studs long |
| `kit.fence(m, { x, y, z, len, dir: 'x'∣'z', color })` | a lattice fence (1×4 sections) |
| `kit.flowerBed(m, { x, y, z, w, d, colors, soil })` | a soil plate full of flowers |
| `kit.water(m, { x, y, z, w, d, color, glint })` | water: smooth tiles with glints (lay it on the base) |
| `kit.rocks(m, { x, y, z, w, d, h, colors, seed })` | an irregular rock outcrop (h a multiple of 3); never build rocks as stepped boxes |
| `kit.roundTower(m, { x, y, z, h, size: 2∣4, bands })` | a round tower of round bricks; `bands` repeats colours course by course |
| `kit.wheels(m, { x, y, z, rot, color })` | an axle with wheels under a 4×2 mudguard; y = the surface the tyres stand on (0, or a base's top); returns the level to build the body on. A vehicle may stand loose on a base |
| `kit.island(m, { x, y, z, w, d, h, sand, rock, plateau: { x, z, w, d }, plateauY })` | an island or hill: irregular outline, sand rim, rock relief, a flat terrace to build on. Lay `kit.water` first, then the island over it (later volumes replace earlier ones) |
| `kit.palm(m, { x, y, z, h })` | a palm tree on one stud |
| `kit.parasol(m, { x, y, z, canopy })` | a beach parasol on a 2×2 foot |
| `kit.sign(m, { x, y, z, rot, text, color, brick })` | lettering on a wall: letter tiles (A–Z, 0–9, `. - @`) mounted sideways on side-stud bricks set into the wall course at y; runs to the right as seen from outside |
| `kit.panel(m, { x, y, z, rot, w, rows, color, brick })` | a smooth tiled face on a wall (screens, fascias, display fronts): rows of 2-stud-tall tiles on side-stud bricks, one row every 5 plates |
| `kit.sideRow(m, { x, y, z, rot, len, color })` | just the side-stud bricks (studs facing out) — returns the stud positions for your own mounting |
| `kit.minifig(m, { x, y, z, rot, torso, shirt, legs, face, hair, hairColor, sit })` | a minifigure on 2 studs (2×1 at rot 0/2, 1×2 at rot 1/3). torso/face/hair names: `kit.TORSOS`, `kit.FACES`, `kit.HAIR` (hats included). `sit: true` seats it on a 1×2 cushion plate at y, legs over the front edge |
| `kit.chair(…)` · `kit.bench(…)` · `kit.sofa(…).seats[i]` · `kit.vehicle(…).cabSeat` | each returns a seat: `kit.minifig(m, { ...seat, torso: 'jacket', … })` puts a figure on it, correctly placed |
| `kit.table(m, { x, y, z, color })` · `kit.bookshelf(…)` · `kit.rug(…)` | a round café table on 2×2, a bookshelf, a rug |
| `kit.vehicle(m, { x, y, z, len, kind: 'car'∣'van'∣'truck'∣'bus', color, accent, glass })` | **a finished road vehicle**, 4 wide, front at +z: wheels, chassis, headlights, grille, tail lights, windscreen, cab or body. Start every vehicle from this, then customise. Returns `{ cabSeat, bed }`; it stands loose on its wheels |
| `kit.snowman(m, { x, y, z, hat, scarf })` | a snowman on 2×2 |
| `kit.awning(m, { x, y, z, w, rot, colors, ledge })` | a striped awning: a plate ledge in the wall course at plate level y and slopes reaching out two studs |

**Studs not on top (SNOT).** `kit.sign` and `kit.panel` mount tiles sideways on bricks with studs on their side — the way real sets
put lettering, screens and smooth faces on walls. Rules: y must be the bottom of a brick course of the wall (y, y+3, …); the wall must be
one stud thick there and continue at least one plate above the row (it holds the side-stud bricks down); the tiles stand one plate proud
of the wall, so keep that strip in front clear. A sign is 1 stud tall per letter row; a panel row is 2 studs (5 plates) tall.

## 7. Checker messages and what they mean
- **passes through** — two parts occupy the same space. Move one; or you placed a part *and* a box volume in the same cells (cut the box).
  Collision is checked per stud column: under an arch's opening or a slope's low side there is room; elsewhere a part fills its whole footprint.
- **not connected to the rest of the set** — the message lists the parts of the loose group. It sits on nothing, on a tile (smooth top), on the sloped face of a slope, between plate levels,
  or on studs that don't line up with its underside. Put it exactly on top of studs.
- **no anti-studs underneath** — that part cannot sit on studs at all (clips, bars). Use another part.
- **off the stud grid / between plate levels** — x, z must be whole studs, y whole plates.
- Warnings (budget, specialty share, colour count) are about quality: take them seriously.

## 8. Don'ts
- Don't invent parts or ids: only `docs/PARTS.md`. Don't use parts your scale cannot read (a 1×1 tile as a "window" at minifig scale).
- Don't leave the subject on bare studs floating in space: scenes get a base; objects stand on their own feet/bottom.
- Don't stack everything as solid brick; don't make 2,000 parts of filler.
- Don't skip looking at the renders. The checker proves it can be built, not that it looks right.
