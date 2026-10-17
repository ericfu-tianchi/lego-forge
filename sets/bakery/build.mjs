// Corner Bakery. Grid: x, z studs; y plates (3 = one brick). Front = +z.
import { Model } from '../../engine/model.mjs';
import * as kit from '../../engine/kit.mjs';

const m = new Model({ title: 'Corner Bakery', subtitle: 'a cosy two-storey shop on the corner', budget: [700, 1500] });
const g = kit.base(m, { w: 36, d: 30, color: 'Light Bluish Gray', under: 'Dark Bluish Gray' });

const X = 6, Z = 4, W = 20, D = 12;   // building footprint
const F = Z + D - 1;                  // front wall row (z = 15)
const E = X + W - 1;                  // east wall column (x = 25)

// ---- road: an L of dark tiles along the front (z) and the east side (x)
m.section('street', () => {
  m.box(0, g, 26, 36, 4, 1, 'Dark Bluish Gray', { kind: 'plate' });
  m.box(31, g, 0, 5, 26, 1, 'Dark Bluish Gray', { kind: 'plate' });
  for (let x = 2; x < 30; x += 6) m.tile('4x1', x, g + 1, 28, 'White');
  for (let z = 2; z < 24; z += 6) m.tile('1x4', 33, g + 1, z, 'White');
});

m.section('shop', () => {
  m.box(X, g, Z, W, D, 12, 'Tan', { hollow: true });
  m.box(X, g + 12, Z, W, D, 6, 'Reddish Brown', { hollow: true });             // sign / cornice band
  m.cut(X + 6, g + 12, F, 8, 1, 6); m.box(X + 6, g + 12, F, 8, 1, 6, 'Dark Green');   // the green shop sign
  kit.door(m, { x: X + 14, y: g, z: F, color: 'Dark Green', frame: 'Reddish Brown' });
  for (const x of [X + 2, X + 4, X + 8, X + 10]) kit.window(m, { x, y: g + 3, z: F, size: '1x2x3', frame: 'Reddish Brown', glass: 'Trans Yellow' });
  for (const z of [Z + 2, Z + 6]) kit.window(m, { x: E, y: g + 3, z, rot: 1, size: '1x2x3', frame: 'Reddish Brown', glass: 'Trans Yellow' });
  for (const x of [X + 4, X + 12]) kit.window(m, { x, y: g + 3, z: Z, rot: 2, size: '1x2x3', frame: 'Reddish Brown' });
  for (const x of [X + 6, X + 12]) { let y = g; for (let k = 0; k < 4; k++) { m.part('3062b', x, y, F + 1, 'White'); y += 3; } }   // pilasters
});

m.section('upper', () => {
  m.box(X, g + 18, Z, W, D + 2, 1, 'Reddish Brown', { kind: 'plate' });          // floor slab, overhangs 2 studs at the front
  m.box(X, g + 19, Z, W, D, 18, 'Tan', { hollow: true });
  for (const x of [X + 2, X + 8, X + 14]) kit.window(m, { x, y: g + 22, z: F, size: '1x2x3', frame: 'White' });
  for (const z of [Z + 2, Z + 7]) kit.window(m, { x: E, y: g + 22, z, rot: 1, size: '1x2x3', frame: 'White' });
  for (const x of [X + 4, X + 12]) kit.window(m, { x, y: g + 22, z: Z, rot: 2, size: '1x2x3', frame: 'White' });
  m.box(X, g + 37, Z, W, D, 1, 'Dark Bluish Gray', { kind: 'plate' });
  kit.roof(m, { x: X, y: g + 38, z: Z, w: W, d: D, color: 'Dark Red', gable: 'Tan' });
});

m.section('awning', () => {
  for (let i = 0; i < W; i += 2) m.part('3039', X + i, g + 19, F + 1, (i / 2) % 2 ? 'White' : 'Red', 0);
  for (const x of [X, E]) { let y = g; for (let k = 0; k < 6; k++) { m.part('3062b', x, y, F + 2, 'Reddish Brown'); y += 3; } }
});

m.section('chimney', () => {
  m.box(E + 1, g, Z + 4, 2, 2, 6, 'Dark Bluish Gray');
  m.box(E + 1, g + 6, Z + 4, 2, 2, 45, 'Dark Red');
  m.box(E + 1, g + 51, Z + 4, 2, 2, 1, 'Dark Bluish Gray', { kind: 'plate' });
  for (const z of [Z + 4, Z + 5]) m.part('3062b', E + 1, g + 52, z, 'Dark Bluish Gray');
});

m.section('interior', () => {
  m.box(X + 2, g, Z + 8, 9, 1, 3, 'Reddish Brown');                                // counter
  m.box(X + 2, g + 3, Z + 8, 9, 1, 1, 'White', { kind: 'plate' });
  for (const [x, c] of [[X + 3, 'Bright Light Orange'], [X + 5, 'Medium Nougat'], [X + 6, 'Bright Light Orange'], [X + 8, 'Medium Nougat'], [X + 9, 'Bright Light Orange']]) m.part('6141', x, g + 4, Z + 8, c);
  m.box(X + 2, g, Z + 1, 12, 1, 9, 'Reddish Brown', { hollow: true });             // back shelves
  kit.minifig(m, { x: X + 8, y: g, z: Z + 6, torso: 'apron', shirt: 'White', legs: 'Dark Bluish Gray', face: 'smile', hair: 'cap', hairColor: 'White' });
});

m.section('life', () => {
  kit.minifig(m, { x: 27, y: g, z: 12, rot: 3, torso: 'sweater', shirt: 'Blue', legs: 'Dark Blue', face: 'lashes', hair: 'ponytail', hairColor: 'Dark Brown' });
  kit.tree(m, { x: 2, y: g, z: 19, size: 'L', leaves: 'Green', cap: 'Bright Green' });
  for (const [tx, tz] of [[29, 11]]) { m.part('3062b', tx, g, tz, 'Reddish Brown'); m.part('3062b', tx, g + 3, tz, 'Reddish Brown'); m.part('4032a', tx - 0.5, g + 6, tz - 0.5, 'Tan'); }
  kit.lamp(m, { x: 29, y: g, z: 23 });
  for (const [tx, tz] of [[29, 14], [29, 8]]) { m.part('3062b', tx, g, tz, 'Reddish Brown'); m.part('6141', tx, g + 3, tz, 'Red'); }   // stools
  for (const [x, c] of [[24, 'Red'], [25, 'Yellow']]) { m.part('3062b', x, g, F + 1, 'Reddish Brown'); kit.flower(m, { x, y: g + 3, z: F + 1, color: c }); }
  for (const y of [g, g + 3]) m.box(X + 2, y, F + 1, 2, 2, 3, 'Reddish Brown', { hollow: false });   // bread crates
  for (const [x, z, c] of [[X + 2, F + 1, 'Bright Light Orange'], [X + 3, F + 1, 'Medium Nougat'], [X + 2, F + 2, 'Medium Nougat'], [X + 3, F + 2, 'Bright Light Orange']]) m.part('6141', x, g + 6, z, c);
  kit.bush(m, { x: 27, y: g, z: 0, color: 'Green' });
});

export default m;
