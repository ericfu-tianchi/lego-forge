// Generate docs/PARTS.md (the parts an agent may use) and docs/COLORS.md from the catalogue.
//   node tools/docs.mjs
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { CATALOG } from '../engine/catalog.mjs'; import { COLORS } from '../engine/colors.mjs'; import { BRICK, PLATE, TILE } from '../engine/model.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KIT_ONLY = /^(3818|3819|3820|973|973c01|973p\w+|3626\w+|73200b-f\d|30178c01|60601|60602|60603)$/;   // placed by kit functions
const NOTES = {
  '3039': 'the classic roof slope', '3040b': 'roof slope, 1 wide', '3043': 'roof ridge (two faces)', '3044b': 'roof ridge, 1 wide', '3045': 'hip-roof outer corner', '3046': 'hip-roof inner corner',
  '3665a': 'inverted: overhangs, eaves, undersides', '3660': 'inverted 2×2', '54200': '"cheese" slope: tiny details, roof textures', '85984': 'low 1×2 slope: dashboards, roofs, keyboards',
  '15573': 'jumper: one centred stud — offsets the next part by half a stud', '87580': 'jumper 2×2: one centred stud', '3794b': 'jumper (older id)',
  '6141': 'round 1×1: lights, knobs, flower centres', '4073': 'round 1×1', '98138': 'round tile: dials, plates on tables, eyes', '3070b': 'tile: smooth finish', '2412b': 'grille tile: vents, fronts, drains',
  '3062b': 'round 1×1 brick: posts, trunks, lamp posts', '3941': 'round 2×2 brick: columns, trunks, barrels', '87087': 'stud on one side (SNOT) — decorative here: its side stud is not used by the checker',
  '2417': 'leaves 6×5: tree canopies (see kit.tree)', '2423': 'leaves 4×3 (no anti-studs: rides on a clip — avoid)', '6064b': 'bush', '3471': 'moulded pine tree', '2435': 'small moulded pine', '24866': 'flower 1×1', '98262': 'flower 2×2',
  '3659': 'arch 1×4', '3455': 'arch 1×6', '6182': 'arch 1×4×2', '6108': 'arch 1×12×3 (bridges)', '60592': 'window frame 1×2×2 (use kit.window)', '60593': 'window frame 1×2×3 (use kit.window)', '60594': 'window frame 1×4×3 (use kit.window)',
  '30179': 'door frame 1×4×6 (use kit.door)', '3633': 'lattice fence 1×4', '30055': 'spindled fence 1×4×2', '4865a': 'panel 1×2×1: low walls, counters', '87552': 'panel 1×2×2', '87544': 'panel 1×2×3',
  '73200b-f1': 'minifig legs (use kit.minifig)', '3811': 'baseplate 32×32 (thin; prefer kit.base)', '91405': 'plate 16×16', '4589': 'cone 1×1: tips, lamp tops', '3942b': 'cone 2×2×2', '4740': 'dish 2×2: satellite dishes, lamp shades', '3960': 'dish 4×4',
  '2877': 'grille brick: radiators, speakers, vents', '30136': 'log brick: cabins', '4070': 'headlight brick', '30414': 'studs on one side (decorative)', '6091': 'curved top 1×2: fenders, rounded tops',
  '15068': 'curved 2×2: smooth roofs, car bonnets', '61678': 'curved 4×1: streamlined edges', '93273': 'curved 4×1 double', '11477': 'curved 2×1: small smooth edges', '50950': 'curved 3×1', '24309': 'curved 3×2', '88930': 'curved 2×4 with studs underneath',
  '4600': 'wheel holder plate (wheels: see Vehicles)', '3829c01': 'steering wheel on stand', '2441': 'car base 7×4', '4211': 'car base 4×5',
};
function facing(p) {   // slopes and curves: which way the face drops at rot 0, from the column heights
  if (!/slope|curve/.test(p.cat) || p.cols.length < 2) return '';
  let gx = 0, gz = 0; const my = p.cols.reduce((a, c) => a + c[3], 0) / p.cols.length; for (const [x, z, , y1] of p.cols) { gx += x * (y1 - my); gz += z * (y1 - my); }
  if (Math.hypot(gx, gz) < 0.2) return '';
  return Math.abs(gz) >= Math.abs(gx) ? (gz > 0 ? 'faces −z' : 'faces +z') : (gx > 0 ? 'faces −x' : 'faces +x');
}
const ORDER = ['brick', 'plate', 'tile', 'slope', 'curve', 'round', 'arch', 'window', 'detail', 'plant', 'animal', 'vehicle', 'minifig', 'baseplate'];
const TITLE = { brick: 'Bricks', plate: 'Plates', tile: 'Tiles (no studs on top)', slope: 'Slopes and wedges', curve: 'Curved slopes and curved arches', round: 'Cones, domes, dishes', arch: 'Arches', window: 'Windows, doors, panels, fences', detail: 'Details (bars, brackets, hinges, wings…)', plant: 'Plants', animal: 'Animals', vehicle: 'Vehicles', minifig: 'Minifigure hats, hair and accessories', baseplate: 'Baseplates' };
const L = ['# Parts', '', 'Every part here is a real LEGO part (LDraw id). Size is **x × z studs at rot 0, then height in plates** (3 plates = 1 brick).',
  '"studs" = studs on top (what can be built on it); "no anti-studs" = it cannot sit on studs (it needs a clip or a bar — avoid unless a kit places it).',
  'For slopes and curves, "faces +z" means the sloped face drops towards +z at rot 0; rot 1 turns that to +x, rot 2 to −z, rot 3 to −x.',
  'Plain bricks, plates and tiles are easier through `m.brick(size, …)`, `m.plate(size, …)`, `m.tile(size, …)` and `m.box(…)`.', '',
  `Sized helpers — bricks: ${Object.keys(BRICK).join(', ')} · plates: ${Object.keys(PLATE).join(', ')} · tiles: ${Object.keys(TILE).join(', ')}`, ''];
for (const cat of ORDER) {
  const list = Object.values(CATALOG).filter((p) => p.cat === cat && !KIT_ONLY.test(p.id) && !/^Moved/.test(p.name)); if (!list.length) continue;
  L.push(`## ${TITLE[cat]}`, '', '| id | part | size | top | note |', '|---|---|---|---|---|');
  for (const p of list) L.push(`| ${p.id} | ${p.name.replace(/\|/g, '/')} | ${p.w}×${p.d} · ${+p.h.toFixed(2)}p | ${p.studs.length ? p.studs.length + ' studs' : 'smooth'}${p.female.length ? '' : ' · no anti-studs'} | ${[facing(p), NOTES[p.id] ?? ''].filter(Boolean).join(' · ')} |`);
  L.push('');
}
fs.writeFileSync(path.join(ROOT, 'docs/PARTS.md'), L.join('\n'));
const C = ['# Colours', '', 'Use these names (case and spaces do not matter; "grey" = "gray"). A good set uses 4–8 of them: one main colour, one or two secondary, one or two accents.', '', '| colour | LDraw code | swatch |', '|---|---|---|'];
for (const [n, [code, hex, a]] of Object.entries(COLORS)) C.push(`| ${n} | ${code} | \`${hex}\`${a ? ' (transparent)' : ''} |`);
fs.writeFileSync(path.join(ROOT, 'docs/COLORS.md'), C.join('\n') + '\n');
console.log('docs/PARTS.md, docs/COLORS.md');
