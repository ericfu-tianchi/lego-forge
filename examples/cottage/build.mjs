// Worked example · minifigure scale scene: a garden cottage. Read it as a pattern for buildings in a setting.
import { Model } from '../../engine/model.mjs';
import * as kit from '../../engine/kit.mjs';

const m = new Model({ title: 'Garden Cottage', subtitle: 'a whitewashed cottage with a pond and a flower garden', budget: [400, 900] });
const g = kit.base(m, { w: 32, d: 24, color: 'Green' });                       // base top at g = 2

// ---- the cottage: 14 × 8 studs, stone plinth, white walls, windows with sills, a door, a pitched roof
const X = 3, Z = 4, W = 14, D = 8;
m.section('cottage', () => {
  m.box(X, g, Z, W, D, 3, 'Dark Bluish Gray', { hollow: true });             // plinth course: one brick of stone
  m.box(X, g + 3, Z, W, D, 15, 'White', { hollow: true });                    // walls: 5 bricks
  for (const cx of [X, X + W - 1]) for (const cz of [Z, Z + D - 1]) {         // corner quoins: alternate stone blocks up the corners
    for (let y = g + 6; y < g + 18; y += 6) { m.cut(cx, y, cz, 1, 1, 3); m.brick('1x1', cx, y, cz, 'Light Bluish Gray'); }
  }
  kit.door(m, { x: X + 5, y: g, z: Z + D - 1, color: 'Dark Red' });            // front wall is z = Z + D − 1 (faces +z)
  kit.window(m, { x: X + 1, y: g + 6, z: Z + D - 1, size: '1x2x3', frame: 'Dark Green', sill: 'Light Bluish Gray' });
  kit.window(m, { x: X + 10, y: g + 6, z: Z + D - 1, size: '1x2x3', frame: 'Dark Green', sill: 'Light Bluish Gray' });
  kit.window(m, { x: X + W - 1, y: g + 6, z: Z + 3, rot: 1, size: '1x2x2', frame: 'Dark Green', sill: 'Light Bluish Gray' });
  kit.window(m, { x: X + 3, y: g + 6, z: Z, rot: 2, size: '1x4x3', frame: 'Dark Green' });
  m.box(X, g + 18, Z, W, D, 1, 'Reddish Brown', { kind: 'plate' });          // eaves slab
  kit.roof(m, { x: X, y: g + 19, z: Z, w: W, d: D, color: 'Dark Bluish Gray', gable: 'White' });
  // chimney on the left gable end, outside the wall, up past the ridge
  m.box(X - 2, g, Z + 3, 2, 2, 33, 'Dark Bluish Gray');
  m.plate('2x2', X - 2, g + 33, Z + 3, 'Black');
});

// ---- garden: path, fence, flower beds, a tree, a pond with rocks
m.section('garden', () => {
  m.box(X + 5, g, Z + D, 4, 24 - Z - D, 1, 'Tan', { kind: 'tile' });           // path from the door to the front edge
  kit.flowerBed(m, { x: X, y: g, z: Z + D + 1, w: 4, d: 2 });
  kit.flowerBed(m, { x: X + 10, y: g, z: Z + D + 1, w: 4, d: 2, colors: ['Bright Pink', 'White', 'Medium Lavender'] });
  kit.fence(m, { x: 0, y: g, z: 23, len: 8 }); kit.fence(m, { x: 12, y: g, z: 23, len: 12 });
  kit.tree(m, { x: 22, y: g, z: 3, size: 'L' });
  kit.water(m, { x: 21, y: g, z: 13, w: 8, d: 6 });
  for (const [x, z] of [[20, 13], [20, 15], [21, 19], [24, 19], [29, 14], [29, 16]]) m.part('98138', x, g, z, 'Light Bluish Gray');   // stones round the pond
  for (const [x, z] of [[23, 15], [26, 16], [25, 14]]) { m.cut(x, g, z, 1, 1, 1); m.part('98138', x, g, z, 'Bright Green'); }        // lily pads: round tiles set into the water
  kit.bush(m, { x: 26, y: g, z: 8 }); kit.bush(m, { x: 18, y: g, z: 0 }); kit.pine(m, { x: 27, y: g, z: 0, big: false });
  kit.bench(m, { x: 22, y: g, z: 21 });
  kit.lamp(m, { x: X + 4, y: g, z: 21 });
  for (const [x, z] of [[19, 20], [30, 11], [1, 13]]) kit.flower(m, { x, y: g, z, color: 'Yellow' });
});

// ---- life: the gardener at the beds, someone at the door with a dog
m.section('figures', () => {
  kit.minifig(m, { x: X + 1, y: g, z: Z + D + 4, torso: 'apron', shirt: 'White', legs: 'Dark Blue', face: 'smile', hair: 'bob', hairColor: 'Dark Brown' });
  kit.minifig(m, { x: X + 10, y: g, z: Z + D + 4, rot: 3, torso: 'plaid', shirt: 'Dark Red', legs: 'Sand Blue', face: 'beard', hair: 'cap', hairColor: 'Dark Green' });
  m.part('26078p01', X + 12, g, Z + D + 6, 'White', 1);
});
export default m;
