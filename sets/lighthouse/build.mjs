// Lighthouse on a rocky island. See AGENTS.md §6. Grid: x, z studs; y plates (3 = one brick). Front = +z.
import { Model } from '../../engine/model.mjs';
import * as kit from '../../engine/kit.mjs';

const m = new Model({ title: 'Lighthouse', subtitle: 'a striped tower on a small rocky island', budget: [300, 1500] });

// sea: a 24 × 20 base of plates, water on top
const g = kit.base(m, { w: 24, d: 20, color: 'Medium Azure', under: 'Dark Bluish Gray' });   // g = 2

// rock: two tiers of bricks and a plate level, corners cut so the island is not a rectangle
m.section('rock', () => {
  m.box(2, g, 2, 20, 16, 1, 'Tan', { kind: 'plate' });                             // beach: a 1-stud sand ring around the rock
  m.box(3, g, 3, 18, 14, 3, 'Dark Bluish Gray');
  m.cut(3, g, 3, 2, 2, 3); m.cut(19, g, 3, 2, 2, 3); m.cut(3, g, 15, 2, 2, 3); m.cut(19, g, 15, 2, 2, 3);
  m.box(5, g + 3, 5, 14, 10, 3, 'Dark Bluish Gray');
  m.cut(5, g + 3, 5, 2, 2, 3); m.cut(17, g + 3, 5, 2, 2, 3); m.cut(5, g + 3, 13, 2, 2, 3); m.cut(17, g + 3, 13, 2, 2, 3);
  m.box(3, g, 3, 2, 2, 1, 'Tan', { kind: 'plate' }); m.box(19, g, 3, 2, 2, 1, 'Tan', { kind: 'plate' });   // sand back in the cut corners
  m.box(3, g, 15, 2, 2, 1, 'Tan', { kind: 'plate' }); m.box(19, g, 15, 2, 2, 1, 'Tan', { kind: 'plate' });
  m.box(6, g + 6, 6, 12, 8, 1, 'Dark Bluish Gray', { kind: 'plate' });
  m.part('6064b', 6, g + 7, 6, 'Green');                                          // a bush on the back-left rock
  m.part('24866', 16, g + 7, 7, 'Red');                                             // a red flower by the storehouse
});
const top = g + 7;   // 9: the rock's flat top, where the tower stands

// keeper's storehouse at the foot of the tower (front, +z): three bricks, one window, gabled roof
m.section('storehouse', () => {
  m.box(10, top, 12, 4, 2, 9, 'White', { hollow: true });
  kit.window(m, { x: 11, y: top + 3, z: 13, rot: 0, size: '1x2x2' });
  kit.roof(m, { x: 10, y: top + 9, z: 12, w: 4, d: 2, color: 'Dark Red', ridge: 'z' });
});

// tower: 4 × 4 round bricks, white with red bands, one round per brick level, centred on (12, 10)
m.section('tower', () => {
  const bands = ['Dark Bluish Gray', 'White', 'Red', 'White', 'White', 'Red', 'White', 'White', 'Red'];   // stone plinth, then the bands
  bands.forEach((c, i) => m.part('87081', 10, top + i * 3, 8, c));
  m.part('3958', 9, top + 27, 7, 'Dark Bluish Gray');             // gallery plate 6 × 6: a 1-stud ring around the tower
});

// railing: spindled fences on the four sides, round posts at the corners (y = top of the gallery)
m.section('railing', () => {
  const y = top + 28;
  m.part('30055', 10, y, 7, 'Black', 0); m.part('30055', 10, y, 12, 'Black', 0);
  m.part('30055', 9, y, 8, 'Black', 1); m.part('30055', 14, y, 8, 'Black', 1);
  for (const [x, z] of [[9, 7], [14, 7], [9, 12], [14, 12]]) { m.part('3062b', x, y, z, 'Black'); m.part('3062b', x, y + 3, z, 'Black'); }
});

// lantern: two glass rounds, a dark red dome, a cone finial on the dome's centre stud (a 2 × 2 cone centred on the corner point)
m.section('lantern', () => {
  const y = top + 28;
  m.part('87081', 10, y, 8, 'Trans Yellow'); m.part('87081', 10, y + 3, 8, 'Trans Yellow');
  m.part('3960', 10, y + 6, 8, 'Dark Red');
  m.part('98100', 11, y + 8, 9, 'Dark Red');
});

// two minifigures: the keeper by the storehouse, a visitor on the rock
m.section('people', () => {
  kit.minifig(m, { x: 15, y: top, z: 11, torso: 'vneck', shirt: 'Red', legs: 'Black', skin: 'Tan', face: 'grin', hair: 'cap', hairColor: 'Dark Red' });
  kit.minifig(m, { x: 7, y: top, z: 12, torso: 'plain', shirt: 'Medium Azure', legs: 'Black', skin: 'Tan', face: 'smile', hair: 'short', hairColor: 'Black' });
});

export default m;
