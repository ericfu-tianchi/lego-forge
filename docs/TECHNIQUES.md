# Techniques

How LEGO designers make simple shapes look like the real thing. Each technique names the parts and, where one exists, the kit call.
A worked example that uses most of them: `examples/cottage/build.mjs` (renders: `examples/cottage/out/hero.png`, `sheet.png`).

## Buildings
- `kit.building` gives the whole structure (plinth, quoins, windows with sills, door, bands, roof, chimney, optional shopfront with sign and
  awning). Build several side by side for a street; then add what is particular to your subject.

## Walls
- **Plinth course**: the bottom brick of a building in a darker or stone colour (`m.box(…, 3, 'Dark Bluish Gray', { hollow: true })`,
  then the walls on top). Reads instantly as "built on a foundation".
- **Corner quoins**: every other brick up the corners in a contrasting colour (`m.cut` the corner cell, `m.brick('1x1', …)`).
- **Pilasters / columns**: 1×1 round bricks (3062b) or 2×2 round bricks (3941) stacked in front of or inside the wall line.
- **Window sills**: `kit.window(..., { sill: 'Light Bluish Gray' })` — a plate that sticks out one stud under the frame.
- **Bands and cornices**: one course of plates in a contrasting colour between storeys; a row of tiles or inverted slopes (3665a) under the eaves.
- **Texture**: log bricks (30136) for cabins, grille bricks (2877) for vents and shopfronts, headlight bricks (4070) for small square windows.
- Never leave a wall wider than ~8 studs and taller than 2 bricks without anything on it.

- **Awnings**: `kit.awning` — striped slopes reaching out from the wall over a shop window or door.
- **Lettering and signs**: `kit.sign` — silver letters on coloured tiles mounted on the wall (a shop name, a number "8", "TACOS").
  Short words read best (2–8 letters); put the sign above the door or along the fascia.
- **Smooth faces**: `kit.panel` — tiles mounted sideways (shop fascias, a screen on a monitor, the smooth front of an appliance).

## Roofs
- `kit.roof` for pitched roofs (45°), with `overhang: 1` when there is a slab under the eaves one stud wider than the walls.
- Roof colours: Dark Bluish Gray (slate), Reddish Brown / Dark Orange (tiles), Dark Red. Gable ends in the wall colour.
- Flat roofs: a plate slab with tiles on top and a 1-brick parapet; add a vent (grille tile) or a water tank (2×2 round bricks).
- Chimneys: a 2×2 column of bricks from the ground up past the ridge, outside a gable wall, capped with a plate.

## Ground and setting
- **Base**: `kit.base` — a 2-plate base that holds together. Size it 2–4 studs bigger than the subject on each side; empty base reads as unfinished.
- **Paths and pavements**: tiles (`m.box(x, y, z, w, d, 1, 'Tan', { kind: 'tile' })`), leaving studs on grass.
- **Water**: `kit.water` (smooth tiles with glints). Stones at its edge: 1×1 round tiles. Lily pads: round tiles set into the water.
- **Islands, hills, cliffs**: `kit.island` (irregular outline, sand rim, rock relief, a flat terrace for a building) over `kit.water`;
  `kit.rocks` for a single outcrop. Never a stepped rectangle.
- **Beach**: `kit.palm`, `kit.parasol`, sand (Tan) ground, water with a sand rim.
- **Plants**: `kit.tree` (leafy), `kit.pine`, `kit.bush`, `kit.flower`, `kit.flowerBed`. Two or three plants of different heights beat a row of identical ones.
- **Street furniture**: `kit.lamp`, `kit.bench`, `kit.fence`.

## Objects at display scale (a computer, a radio, a coffee machine)
- The object stands on its own bottom or on a low **display stand** (a 2-plate base in a dark colour, edged with tiles).
- **Smooth fronts**: `kit.panel` for a screen or a smooth front face; `kit.sign` for a brand word or a model number.
- **Smooth top surfaces**: finish the visible top faces with tiles (`box(…, { top: 'tile' })` on the top course); studs on a product's top look unfinished.
- **Panel lines and details**: grille tiles (2412b) for vents and speakers, 1×1 round tiles (98138) for buttons and knobs, 1×2 jumper plates for
  centred single details, tiles in a contrasting colour for screens and labels.
- **Rounded edges**: curved slopes (11477, 15068, 61678, 93273) along top edges; 1×1 cheese slopes (54200) for small chamfers.
- **Depth**: step faces in and out by one stud (a recessed screen, a protruding drive bay) — flat faces read as boxes.

## Vehicles
- `kit.wheels` gives an axle, two wheels and a mudguard; build the body from its top. Cars are 4–6 studs wide at minifig scale.
- Windscreen 3823 (2×4×2), steering wheel 3829c01, seats 4079. Headlights: 1×1 round plates or tiles in Trans Clear / Trans Yellow on the front.

## Interiors and furniture
- `kit.sofa`, `kit.chair`, `kit.table`, `kit.bookshelf`, `kit.rug`; seat figures with `kit.minifig({ sit: true, y: <seat level> })`.
- Show an interior by leaving the front open or by building only the back and one side wall (a "room box"), at minifig scale.
- Pets: the moulded animals (cat 11602 or 13786p03, dog 26078p01) on a stud of a rug, a sofa seat or the floor.

## Micro scale (cities, skylines)
- Windows are 1×1 tiles, grille tiles (2412b) or headlight bricks (4070) — not window frames. Stack setbacks on solid lids (`box(…, { hollow: true, top: 'plate' })`).
- Trees are 1×1 round plates or cones in green; people are left out. Bridges: arches (3659, 3455, 6108) on piers; water as tiles.
- Each landmark keeps its one signature shape (the Empire State's setbacks and needle, the Flatiron's wedge with 6564/6565 wedges).

## Minifigures
- `kit.minifig` with a printed torso and face (`kit.TORSOS`, `kit.FACES`, `kit.HAIR`). 1–3 per set, each doing something legible: at a door,
  tending flowers, walking a dog (26078p01), sitting at a café table (`sit: true` on a `kit.chair`), on a bench or a sofa. Face the front (rot 0) or side-on; leave 1 stud clear around them.
