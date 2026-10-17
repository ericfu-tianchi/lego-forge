// Retro 1980s desktop PC — display scale. Grid: x, z studs; y plates (3 = one brick). Front = +z.
import { Model } from '../../engine/model.mjs';
import * as kit from '../../engine/kit.mjs';

const m = new Model({ title: 'Retro PC', subtitle: 'a 1980s beige desktop computer with CRT monitor and keyboard', budget: [300, 1500] });
const g = kit.base(m, { w: 34, d: 36, color: 'Dark Tan' });            // desk top, y = 2

// ---- system unit: x4..29, z3..19, 4 bricks + lid ----
m.section('case', () => {
  m.box(4, g, 3, 26, 17, 12, 'Tan', { hollow: true });
  m.box(4, g + 12, 3, 26, 17, 1, 'Tan', { kind: 'plate' });                 // lid, top y = 15
  // two floppy drives in the 2nd brick course (y 5..7): bezel, black slot, bezel
  for (const x0 of [6, 15]) {
    m.cut(x0, 5, 19, 8, 1, 3);
    m.box(x0, 5, 19, 8, 1, 1, 'Light Bluish Gray', { kind: 'plate' });
    m.box(x0, 7, 19, 8, 1, 1, 'Light Bluish Gray', { kind: 'plate' });
    m.box(x0, 6, 19, 1, 1, 1, 'Light Bluish Gray', { kind: 'plate' });
    m.box(x0 + 1, 6, 19, 6, 1, 1, 'Black', { kind: 'plate' });
    m.box(x0 + 7, 6, 19, 1, 1, 1, 'Light Bluish Gray', { kind: 'plate' });
  }
  m.cut(14, 6, 19, 1, 1, 1); m.cut(21, 6, 19, 1, 1, 1);
  // vent grilles and power switch on the right
  for (const x of [24, 26]) { m.cut(x, 5, 19, 2, 1, 3); m.part('2877', x, 5, 19, 'Dark Bluish Gray'); }
  m.cut(28, 5, 19, 1, 1, 3); m.part('3005', 28, 5, 19, 'Red');
  // back panel: ports and fan grille
  for (let x = 8; x < 26; x += 2) { m.cut(x, 5, 3, 2, 1, 3); m.part('2877', x, 5, 3, 'Dark Bluish Gray'); }
  m.cut(8, 8, 3, 6, 1, 3); m.box(8, 8, 3, 6, 1, 3, 'Black');
  // a darker plinth band along the bottom front
  m.box(4, g, 19, 26, 1, 3, 'Light Bluish Gray');
  m.cut(4, g, 19, 26, 1, 3);
  m.box(4, g, 19, 26, 1, 3, 'Light Bluish Gray');
});

// ---- CRT monitor on top, y 15..43 ----
const my = g + 13;
m.section('monitor', () => {
  // front section (x7..26, z11..19): hollow shell 9 bricks tall
  m.box(7, my, 11, 20, 9, 27, 'Tan', { hollow: true });
  m.box(8, my, 17, 18, 2, 6, 'Tan');                                       // bottom bezel (solid at the front)
  m.box(8, my + 21, 12, 18, 7, 6, 'Tan');                                  // top bezel (solid, carries the lid)
  m.box(8, my + 6, 17, 2, 2, 15, 'Tan'); m.box(24, my + 6, 17, 2, 2, 15, 'Tan');   // side bezels
  m.cut(10, my + 6, 19, 14, 1, 15);                                       // screen opening (x10..23)
  m.box(7, my + 27, 11, 20, 9, 1, 'Tan', { kind: 'plate', top: 'tile' });   // smooth top
  // screen: black glass one stud back, green text pixels "A>_"
  m.box(10, my + 6, 18, 14, 1, 15, 'Black');
  const glyph = ['.X.......', 'X.X......', 'XXX.....XX', 'X.X..X...XX', 'X.X.......'];
  const px = [
    ['..X........', '.X.X.......', '.XXX.......', '.X.X.......', '.X.X.......'],   // A (cols 2-4 after shift)
  ];
  const cells = [];
  const A = ['XXX', 'X..', 'X..', 'X..', 'XXX'], GT = ['X..', '.X.', 'X..'];
  A.forEach((r, i) => [...r].forEach((c, j) => c === 'X' && cells.push([2 + j, i])));
  GT.forEach((r, i) => [...r].forEach((c, j) => c === 'X' && cells.push([6 + j, 1 + i])));
  for (const [dx, dy] of [[10, 3], [11, 3], [10, 4], [11, 4]]) cells.push([dx, dy]);
  for (const [cx, r] of cells) { const x = 10 + cx, y = my + 6 + (4 - r) * 3; m.cut(x, y, 18, 1, 1, 3); m.part('3005', x, y, 18, 'Green'); }
  // bezel knobs
  for (const x of [22, 24]) { m.cut(x, my + 3, 19, 1, 1, 3); m.part('3062b', x, my + 3, 19, 'Dark Bluish Gray'); }

  // side and rear vents (grille bricks replace wall bricks)
  for (const x of [7, 26]) for (const z of [12, 14, 16]) for (const yy of [my + 12, my + 15]) { m.cut(x, yy, z, 1, 2, 3); m.part('2877', x, yy, z, 'Light Bluish Gray', 1); }
  // rear tube: x9..24, z4..10, 7 bricks, then a flat top step and a sloped tail
  m.box(9, my, 4, 16, 7, 21, 'Tan', { hollow: true });
  m.box(9, my + 21, 4, 16, 7, 1, 'Tan', { kind: 'plate' });
  m.box(9, my + 22, 6, 16, 5, 3, 'Tan');
  for (let x = 9; x < 25; x += 4) m.part('3037', x, my + 22, 4, 'Tan', 2);
  for (let x = 10; x < 24; x += 2) for (const yy of [my + 9, my + 12]) { m.cut(x, yy, 4, 2, 1, 3); m.part('2877', x, yy, 4, 'Light Bluish Gray'); }
  for (let x = 10; x < 24; x += 2) m.part('2412b', x, my + 25, 8, 'Dark Bluish Gray');   // vents
});

// ---- keyboard: x8..25, z23..29 ----
m.section('keyboard', () => {
  m.box(8, g, 23, 18, 7, 1, 'Tan', { kind: 'plate' });
  m.box(8, g + 1, 23, 18, 3, 1, 'Tan', { kind: 'plate' });                   // raised back rows
  const key = (x, y, z, c) => m.tile('1x1', x, y, z, c);
  for (let z = 24; z <= 28; z++) for (let x = 9; x <= 24; x++) {
    if (x === 19) continue; const y = z <= 25 ? g + 2 : g + 1;
    if (z === 28 && x >= 12 && x <= 17) continue;
    const dark = x >= 20 || (x <= 11 && z !== 24 && z !== 25) || (z === 24);
    if (!dark && (x + z) % 2) continue;
    key(x, y, z, dark ? 'Dark Bluish Gray' : 'Light Bluish Gray');
  }
  m.tile('6x1', 12, g + 1, 28, 'Light Bluish Gray');
});
// cable from keyboard to the case
m.plate('1x3', 12, g, 20, 'Black');

// ---- a floppy disk on the desk ----
m.section('floppy', () => {
  m.plate('4x4', 28, g, 24, 'Black');
  m.tile('1x2', 29, g + 1, 24, 'White');
  m.part('98138', 29, g + 1, 26, 'Light Bluish Gray');
});

export default m;
