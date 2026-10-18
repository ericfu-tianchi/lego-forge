// Worked example · display scale: a 1980s home computer on a desk. Read it as a pattern for objects: smooth (tiled) tops,
// a recessed screen made with SNOT (kit.panel), lettering (kit.sign), grilles and round tiles for detail, a tiled display stand.

export default function build({ Model, kit }) {
const m = new Model({ title: 'Home Computer 1984', subtitle: 'a beige desktop with its monitor and keyboard', budget: [300, 900] });
const g = kit.base(m, { w: 30, d: 24, color: 'Reddish Brown', under: 'Dark Brown' });     // the desk top
const CASE = { x: 5, z: 3, w: 20, d: 12 }, KEYS = { x: 6, z: 17, w: 18, d: 5 };
m.section('desk', () => {
  m.box(0, g, 0, 30, 24, 1, 'Reddish Brown', { kind: 'tile' });                         // smooth desk top…
  m.cut(CASE.x, g, CASE.z, CASE.w, CASE.d, 1); m.cut(KEYS.x, g, KEYS.z, KEYS.w, KEYS.d, 1); // …except where things stand (cut before they are built)
  m.cut(26, g, 18, 2, 2, 1); m.part('3899', 26, g, 18, 'White');                            // a coffee cup
});

// ---- system unit: 20 × 12, 7 plates high, smooth top, drive bays and a badge on the front (z = 14 is its front wall)
m.section('case', () => {
  m.box(CASE.x, g, CASE.z, CASE.w, CASE.d, 9, 'Tan', { hollow: true, top: 'tile' });
  kit.panel(m, { x: CASE.x + 2, y: g + 3, z: CASE.z + CASE.d - 1, w: 8, color: 'Light Bluish Gray', brick: 'Tan' });   // drive bay fascia
  for (const z of [CASE.z + 2, CASE.z + 4, CASE.z + 6]) { m.cut(CASE.x + 17, g + 8, z, 2, 1, 1); m.part('2412b', CASE.x + 17, g + 8, z, 'Dark Bluish Gray'); }   // vents in the lid, beside the monitor
  kit.sign(m, { x: CASE.x + 13, y: g + 3, z: CASE.z + CASE.d - 1, text: 'PC 84', color: 'Dark Brown', brick: 'Tan' });
  for (const x of [CASE.x + 13, CASE.x + 15]) m.part('2877', x, g, CASE.z + CASE.d - 1, 'Tan');   // grille under the badge
  m.cut(CASE.x + 13, g, CASE.z + CASE.d - 1, 4, 1, 3);
});
// ---- monitor: sits on the case, deep CRT body, black screen in a bezel
m.section('monitor', () => {
  const y0 = g + 9, X = CASE.x + 3, Z = CASE.z + 1, W = 14, D = 10;
  m.box(X, y0 - 1, Z, W, D, 1, 'Tan', { kind: 'plate' });                                    // its foot replaces the lid there
  m.box(X, y0, Z, W, D, 15, 'Tan', { hollow: true });                                        // the CRT housing
  kit.panel(m, { x: X + 2, y: y0 + 3, z: Z + D - 1, w: 10, rows: 2, color: 'Black', brick: 'Tan' });   // the screen: 10 × 4 studs
  m.box(X + 2, y0 + 15, Z, W - 4, D - 2, 3, 'Tan', { hollow: true, top: 'tile' });          // the tapering back
  for (const x of [X, X + W - 2]) m.box(x, y0 + 15, Z, 2, D - 2, 1, 'Tan', { kind: 'tile' });   // smooth shoulders beside it
  m.box(X, y0 + 15, Z + D - 2, W, 2, 1, 'Tan', { kind: 'plate' });
  m.box(X, y0 + 16, Z + D - 2, W, 2, 1, 'Tan', { kind: 'tile' });
  for (const [x, c] of [[X + W - 3, 'Red'], [X + W - 2, 'Dark Bluish Gray']]) { m.cut(x, y0 + 16, Z + D - 1, 1, 1, 1); m.part('98138', x, y0 + 16, Z + D - 1, c); }   // knobs on the ledge
});
// ---- keyboard: a low wedge with keys in two greys and a long space bar
m.section('keyboard', () => {
  m.box(KEYS.x, g, KEYS.z, KEYS.w, KEYS.d, 1, 'Tan', { kind: 'plate' });
  for (let r = 0; r < 4; r++) for (let c = 0; c < KEYS.w; c++) {
    const x = KEYS.x + c, z = KEYS.z + r; if (r === 3 && c >= 4 && c < 14) continue;
    m.part('3070b', x, g + 1, z, (c < 2 || c >= KEYS.w - 2) ? 'Dark Bluish Gray' : 'Light Bluish Gray');
  }
  m.tile('1x6', KEYS.x + 4, g + 1, KEYS.z + 3, 'Light Bluish Gray'); m.tile('1x4', KEYS.x + 10, g + 1, KEYS.z + 3, 'Light Bluish Gray');
  m.box(KEYS.x, g + 1, KEYS.z + 4, KEYS.w, 1, 1, 'Tan', { kind: 'tile' });
});
// ---- a floppy disk
m.section('disk', () => { m.cut(2, g, 18, 3, 3, 1); m.plate('2x3', 2, g, 18, 'Black', 1); m.plate('1x3', 4, g, 18, 'Black', 1); m.tile('2x2', 2, g + 1, 19, 'White'); m.tile('1x2', 4, g + 1, 18, 'Flat Silver', 1); });
return m;
}
