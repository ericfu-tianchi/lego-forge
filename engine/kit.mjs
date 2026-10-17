// Proven sub-builds. Each one places real parts in a way that is known to connect, so a set can use them without re-inventing
// how a window sits in a wall or how a minifigure goes together. All positions are grid positions (x, z studs; y plates).
// Facing: rot 0 = facing +z (the front, towards the default camera); rot 1 = facing +x; rot 2 = −z; rot 3 = −x.
import { part as partDef, footprint, turn, rotM, resolve, PL } from './catalog.mjs';

const mul = (A, B) => [0, 1, 2].flatMap((i) => [0, 1, 2].map((j) => A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j]));
const mulv = (m, v) => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
/** LDraw sub-file line (x y z a..i, LDraw units) → our offset and matrix */
const ld = (x, y, z, ...M) => { const s = [1, -1, -1]; return { p: [x / 20, -y / 20, -z / 20], m: M.map((v, k) => v * s[Math.floor(k / 3)] * s[k % 3]) }; };
/** place a part so that its own anti-stud (fx, fz) lands on the stud at world (sx, sz); returns grid x, z */
function onStud(id, rot, fx, fz, sx, sz) { const d = partDef(id); const [fw, fd] = footprint(d, rot); const [a, b] = turn(fx, fz, rot); return [sx - a - fw / 2, sz - b - fd / 2]; }
/** a free part riding on a host placement: same origin frame, an extra offset/rotation in the host's LDraw frame */
function rider(m, host, id, color, off = { p: [0, 0, 0], m: [1, 0, 0, 0, 1, 0, 0, 0, 1] }) { const r = resolve(host); const w = mulv(r.m, off.p); return m.free(id, color, [r.origin[0] + w[0], r.origin[1] + w[1], r.origin[2] + w[2]], mul(r.m, off.m)); }

// ---- windows and doors -------------------------------------------------------------------------------------------------------
const WINDOWS = { '1x2x2': ['60592', '60601', 6], '1x2x3': ['60593', '60602', 9], '1x4x3': ['60594', '60603', 9, ld(0, 10, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1)] };
/** A window in a wall: frame + glass. x, z = min corner of its footprint (a 2- or 4-stud run of the wall), y = bottom.
 *  Cuts its opening out of any box() volume. size '1x2x2' | '1x2x3' | '1x4x3'. rot = the side the window looks out of: 0 front (+z), 1 right (+x),
 *  2 back (−z), 3 left (−x). sill: a colour → a plate sill under it, sticking out one stud. */
export function window(m, { x, y, z, rot = 0, size = '1x2x2', frame = 'White', glass = 'Trans Clear', sill }) {
  const [fid, gid, h, gOff] = WINDOWS[size] ?? WINDOWS['1x2x2']; const [fw, fd] = footprint(partDef(fid), rot);
  m.cut(x, y, z, fw, fd, h);
  let host; m.rigid(() => { host = m.part(fid, x, y, z, frame, rot); if (host) rider(m, host, gid, glass, gOff); });
  if (sill) {   // a 2-deep plate under the frame: one row in the wall, one sticking out on the outside face (rot 0 → +z, 1 → +x, 2 → −z, 3 → −x)
    const n = Math.max(fw, fd); m.cut(x, y - 1, z, fw, fd, 1);
    const [sx, sz] = [[x, z], [x, z], [x, z - 1], [x - 1, z]][rot]; m.plate(`${n}x2`, sx, y - 1, sz, sill, rot % 2 === 0 ? 0 : 1);
  }
  return host;
}
/** A door: 1×4×6 frame (18 plates tall) with a three-pane door, hinged on the left. Cuts its opening. */
export function door(m, { x, y, z, rot = 0, frame = 'White', color = 'Red' }) {
  const [fw, fd] = footprint(partDef('30179'), rot); m.cut(x, y, z, fw, fd, 18);
  let host; m.rigid(() => { host = m.part('30179', x, y, z, frame, rot); if (host) rider(m, host, '30178c01', color, ld(-32, 0, 0, 0, 0, -1, 0, 1, 0, 1, 0, 0)); }); return host;
}

// ---- roofs ---------------------------------------------------------------------------------------------------------------------
/** A pitched roof over the rectangle x..x+w, z..z+d (studs), starting at plate level y. ridge 'x': the ridge runs along x, the slopes
 *  face +z and −z; ridge 'z': along z. Courses of 45° slopes step in one stud per brick of height; the gable ends are filled with
 *  bricks in `gable` colour (default: the roof colour). overhang: studs the roof reaches past the walls on every side (0 or 1; the slab it
 *  sits on must cover the walls). Returns the plate level of the top. */
export function roof(m, { x, y, z, w, d, color = 'Dark Bluish Gray', gable, ridge = 'x', overhang = 0 }) {
  if (overhang) { x -= overhang; z -= overhang; w += 2 * overhang; d += 2 * overhang; }
  gable = gable ?? color; const along = ridge === 'x';
  const W = along ? w : d, D = along ? d : w;          // W along the ridge, D across it
  if (D % 2) { m.errors.push(`roof(): the roof must be an even number of studs across the ridge (got ${D})`); return y; }
  const put = (u, v, id, rot, c = color) => { const [px, pz] = along ? [x + u, z + v] : [x + v, z + u]; return m.part(id, px, y + k * 3, pz, c, along ? rot : (rot + 1) % 4); };
  let k = 0;
  // 3039 at rot 0 has its studs on the −z row and slopes down towards +z: the −z course is turned (rot 2) to slope down outwards
  // runs of 2-wide slopes along the ridge; every other course starts with a 1-wide one so the joints overlap and the courses hold together
  const runs = (c) => { const r = []; let u = 0; if (c % 2 === 1 && W > 2) { r.push([0, 1]); u = 1; } for (; u < W; u += 2) r.push([u, Math.min(2, W - u)]); return r; };
  for (; D - 2 * k > 2; k++) {
    for (const [u, n] of runs(k)) { put(u, k, n === 2 ? '3039' : '3040b', 2); put(u, D - 2 - k, n === 2 ? '3039' : '3040b', 0); }
    if (D - 2 * k > 4) m.box(along ? x : x + k + 2, y + k * 3, along ? z + k + 2 : z, along ? W : D - 4 - 2 * k, along ? D - 4 - 2 * k : W, 3, gable);
  }
  const rest = D - 2 * k;   // 1 or 2 studs left under the ridge
  for (const [u, n] of runs(k)) put(u, k, n === 2 ? '3043' : '3044b', 0);
  return y + (k + 1) * 3;
}

// ---- trees, plants -----------------------------------------------------------------------------------------------------------------
/** A leafy tree on a 2×2 footprint at x, z (ground level y): round brown trunk, layers of 6×5 leaves turned a quarter each, a round cap.
 *  size: 'S' (2 leaf layers) | 'M' (3) | 'L' (4). */
export function tree(m, { x, y, z, size = 'M', trunk = 'Reddish Brown', leaves = 'Green', cap = 'Bright Green' }) {
  const layers = { S: 3, M: 4, L: 6 }[size] ?? 4; let top = y;
  m.rigid(() => {
    for (let i = 0; i < (size === 'L' ? 3 : 2); i++) { m.part('3941', x, top, z, trunk); top += 3; }
    m.part('87580', x, top, z, trunk); top += 1;                                   // jumper: one stud on the trunk's axis
    const cx = x + 1, cz = z + 1;                                                    // that stud's position
    m.part('3062b', cx - 0.5, top, cz - 0.5, trunk); top += 3;
    for (let i = 0; i < layers; i++) {                                               // leaf layers, a round plate between, each turned a quarter
      const [lx, lz] = onStud('2417', i % 4, 0, -0.5, cx, cz); m.part('2417', lx, top, lz, i % 2 ? cap : leaves, i % 4); top += 1;
      if (i < layers - 1) { m.part('6141', cx - 0.5, top, cz - 0.5, trunk); top += 1; }
    }
    m.part('6141', cx - 0.5, top, cz - 0.5, leaves); top += 1; m.part('4589', cx - 0.5, top, cz - 0.5, cap); top += 3;
  });
  return top;
}
/** A pine tree: one moulded tree on a 4×4 (big) or 3×3 (small) footprint. */
export function pine(m, { x, y, z, big = true, color = 'Dark Green' }) { return m.part(big ? '3471' : '2435', x, y, z, color); }
/** A flower: a 1×1 petal plate on a stud. */
export function flower(m, { x, y, z, color = 'Red' }) { return m.part('24866', x, y, z, color); }
/** A bush: the moulded bush on a 4×4 footprint. */
export function bush(m, { x, y, z, color = 'Green' }) { return m.part('6064b', x, y, z, color); }

// ---- street furniture ---------------------------------------------------------------------------------------------------------
/** A lamp post on one stud: round base, three round bricks, a glowing lamp, a cap. */
export function lamp(m, { x, y, z, color = 'Black', light = 'Trans Yellow' }) {
  m.rigid(() => { let t = y; m.part('6141', x, t, z, color); t += 1; for (let i = 0; i < 4; i++) { m.part('3062b', x, t, z, color); t += 3; } m.part('3062b', x, t, z, light); t += 3; m.part('6141', x, t, z, color); t += 1; m.part('4589', x, t, z, color); });
}

// ---- minifigures -------------------------------------------------------------------------------------------------------------------
export const TORSOS = { plain: '973', jacket: '973p03', overalls: '973p0e', plaid: '973p0l', apron: '973p0o', labcoat: '973p0r', waiter: '973p0t', zipjacket: '973p13', suit: '973p18', dungarees: '973p1r', tracksuit: '973p2b', flowers: '973p2g', scarf: '973p2u', sweater: '973p1y', vneck: '973p0v', stripes: '973p01' };
export const FACES = { grin: '3626bp01', woman: '3626bp02', sunglasses: '3626bp04', eyebrows: '3626bp05', freckles: '3626bp07', lipstick: '3626bp08', lashes: '3626bp09', beard: '3626bp0e', glasses: '3626bp0i', smile: '3626bpa6' };
export const HAIR = { short: '3901', pigtails: '3625', bob: '4530', tousled: '62810', messy: '10048', combed: '92081', spiky: '40233', ponytail: '87990', longbangs: '62696', ponytail2: '13785', wavy: '26139', spiked: '98385', flattop: '30608', layered: '92746', swept: '20877', long: '40239', longwavy: '40251', slick: '64798', midbob: '95328', side: '99930',
  helmet: '3833', cap: '86035', cowboy: '3629', tophat: '3878', wizard: '6131', police: '3624', baseball: '93219' };
/** A minifigure standing on two studs at x, z (its 2×1 footprint, or 1×2 when turned), y = the level it stands on.
 *  torso: a TORSOS key or a part id; shirt = the torso's main colour; face: FACES key; hair: HAIR key (hats too). */
export function minifig(m, { x, y, z, rot = 0, torso = 'plain', shirt = 'Blue', legs = 'Dark Blue', arms, face = 'grin', hair = 'short', hairColor = 'Reddish Brown', skin = 'Yellow' }) {
  let legsP; m.rigid(() => {
    legsP = m.part('73200b-f1', x, y, z, legs, rot); if (!legsP) return;
    const L = resolve(legsP); const at = (o) => { const w = mulv(L.m, o.p); return [L.origin[0] + w[0], L.origin[1] + w[1], L.origin[2] + w[2]]; }; const R = (o) => mul(L.m, o.m);
    const T = ld(0, -32, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1);                        // torso origin: 32 LDU above the hips
    const tor = TORSOS[torso] ?? torso; m.free(tor, shirt, at(T), R(T));
    const sub = (line) => { const o = ld(...line); return { p: [T.p[0] + o.p[0], T.p[1] + o.p[1], T.p[2] + o.p[2]], m: o.m }; };
    const armR = sub([-15.552, 9, 0, 0.985, -0.17, 0, 0.17, 0.985, 0, 0, 0, 1]), armL = sub([15.552, 9, 0, 0.985, 0.17, 0, -0.17, 0.985, 0, 0, 0, 1]);
    const handR = sub([-23.6904, 26.774, -9.8982, 0.985, -0.1202, 0.1202, 0.17, 0.6964, -0.6964, 0, 0.707, 0.707]), handL = sub([23.6904, 26.774, -9.8982, 0.985, 0.1202, -0.1202, -0.17, 0.6964, -0.6964, 0, 0.707, 0.707]);
    m.free('3818', arms ?? shirt, at(armR), R(armR)); m.free('3819', arms ?? shirt, at(armL), R(armL));
    m.free('3820', skin, at(handR), R(handR)); m.free('3820', skin, at(handL), R(handL));
    const H = sub([0, -24, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1]); m.free(FACES[face] ?? face, skin, at(H), R(H));
    if (hair) m.free(HAIR[hair] ?? hair, hairColor, at(H), R(H));
  });
  return legsP;
}

// ---- ground -------------------------------------------------------------------------------------------------------------------------
/** A base: two layers of plates over x..x+w, z..z+d, laid in 8×8 squares whose seams are staggered by 4 studs between the layers, so the
 *  whole base holds together as one piece. Returns the level of its top (y + 2). */
export function base(m, { x = 0, y = 0, z = 0, w, d, color = 'Green', under = 'Dark Bluish Gray' }) {
  for (const [yy, c, off] of [[y, under, 0], [y + 1, color, 4]]) {
    const xs = [x], zs = [z]; for (let v = x + (off || 8); v < x + w; v += 8) xs.push(v); for (let v = z + (off || 8); v < z + d; v += 8) zs.push(v); xs.push(x + w); zs.push(z + d);
    for (let i = 0; i + 1 < xs.length; i++) for (let k = 0; k + 1 < zs.length; k++) m.box(xs[i], yy, zs[k], xs[i + 1] - xs[i], zs[k + 1] - zs[k], 1, c, { kind: 'plate', unit: `base${yy}:${i},${k}` });
  }
  return y + 2;
}

// ---- vehicles -----------------------------------------------------------------------------------------------------------------------
/** An axle with two wheels under a 4×2 mudguard: the wheel-holder plate (pins one stud out each side), a rim and tyre on each pin, and the
 *  mudguard (arches over the wheels) on top. x, z = the mudguard's 4×2 position (x..x+4 at rot 0); y = the level the tyres stand on
 *  (0 = the table, or the top of a base). Returns the level of the mudguard's top (y + 5): build the car body from there.
 *  rot 0: axle along x (the car runs along z); rot 1: axle along z. A vehicle may stand loose on a base: it needs no studs under it. */
export function wheels(m, { x, y = 0, z, rot = 0, color = 'Red', tyre = 'Black', rim = 'Light Bluish Gray' }) {
  const hy = y + 2;   // the holder sits 2 plates up so the tyres touch the surface
  m.rigid(() => {
    const along = rot % 2 === 0; const host = m.part('4600', along ? x + 0.5 : x, hy, along ? z : z + 0.5, 'Black', along ? 0 : 1); if (!host) return;
    for (const s of [1, -1]) { const off = ld(30 * s, 6, 0, 0, 0, -s, 0, 1, 0, s, 0, 0); rider(m, host, '4624', rim, off); rider(m, host, '3641', tyre, off); }
    m.part('3788', x, hy + 1, z, color, along ? 0 : 1);
  }); return hy + 3;
}

// ---- landscape -----------------------------------------------------------------------------------------------------------------------
/** Water over a rectangle: smooth tiles (no studs) with a few round tiles as glints. Lay it on a base (y = the base's top). */
export function water(m, { x, y, z, w, d, color = 'Dark Azure', glint = 'Medium Azure', glints = 0.04 }) {
  const rnd = m.rand; const cells = [];
  for (let i = 0; i < w; i++) for (let k = 0; k < d; k++) if (rnd() < glints) cells.push([x + i, z + k]);
  for (const [cx, cz] of cells) { m.cut(cx, y, cz, 1, 1, 1); m.part('98138', cx, y, cz, glint); }
  m.box(x, y, z, w, d, 1, color, { kind: 'tile' });
}
/** A rock outcrop over a rectangle, up to h plates (a multiple of 3) high: irregular terraces of bricks in two greys, the rims softened with
 *  small slopes. The outline is rounded by itself; give it a rectangle a little larger than the rock you want. Returns nothing. */
export function rocks(m, { x, y, z, w, d, h = 9, colors = ['Dark Bluish Gray', 'Light Bluish Gray'], seed = 1 }) {
  const rnd = m.rand; const cx = (w - 1) / 2, cz = (d - 1) / 2; const H = [];
  const noise = (i, k) => { const s = Math.sin(i * 12.99 + k * 78.23 + seed * 3.1) * 43758.5; return s - Math.floor(s); };
  for (let i = 0; i < w; i++) { H.push([]); for (let k = 0; k < d; k++) {
    const r = Math.hypot((i - cx) / (w / 2), (k - cz) / (d / 2)); const v = (1 - r * r) * 1.15 + (noise(i >> 1, k >> 1) - 0.5) * 0.45;
    H[i].push(Math.max(0, Math.min(h, Math.round((v * h) / 3) * 3))); } }
  for (let i = 0; i < w; i++) for (let k = 0; k < d; k++) { const hh = H[i][k]; if (!hh) continue;
    const c = colors[(noise((i >> 1) + 7, (k >> 1) + 3) < 0.65 ? 0 : 1) % colors.length];   // colour in 2×2 patches, not speckles
    m.box(x + i, y, z + k, 1, 1, hh, c, { unit: `rock${(i >> 1)},${(k >> 1)}` }); }
  // rims: a cheese slope on top of an edge cell, facing its lowest neighbour
  for (let i = 0; i < w; i++) for (let k = 0; k < d; k++) { const hh = H[i][k]; if (!hh) continue;
    const nb = [[1, 0, 1], [-1, 0, 3], [0, 1, 0], [0, -1, 2]].map(([dx, dz, rot]) => [(H[i + dx]?.[k + dz] ?? 0), rot]); const low = nb.reduce((a, b) => (b[0] < a[0] ? b : a));
    if (hh - low[0] >= 3 && noise(i + 3, k + 9) < 0.7) m.part('54200', x + i, y + hh, z + k, colors[noise(i, k + 5) < 0.5 ? 0 : 1], low[1]); }
}
/** A round tower: a stack of round bricks, 2 or 4 studs across, h plates high (multiple of 3). bands: colours that repeat course by course
 *  (['White', 'Red'] for a striped lighthouse). Returns the top level. */
export function roundTower(m, { x, y, z, h, size = 4, bands = ['White'] }) {
  const id = size >= 4 ? '87081' : '3941'; let t = y; let n = 0;
  while (t < y + h) { m.part(id, x, t, z, bands[n % bands.length]); t += 3; n++; }
  return t;
}
/** A lattice fence along x (dir 'x') or z (dir 'z'), len studs long (made of 1×4 fences; len a multiple of 4 reads best). */
export function fence(m, { x, y, z, len, dir = 'x', color = 'White' }) {
  for (let u = 0; u + 4 <= len; u += 4) m.part('3633', dir === 'x' ? x + u : x, y, dir === 'x' ? z : z + u, color, dir === 'x' ? 0 : 1);
}
/** A flower bed: a soil plate with flowers (and a few leaves) on its studs. */
export function flowerBed(m, { x, y, z, w, d, colors = ['Red', 'Yellow', 'Bright Pink', 'White'], soil = 'Reddish Brown', leaves = 'Green', density = 0.6 }) {
  m.box(x, y, z, w, d, 1, soil, { kind: 'plate' });
  for (let i = 0; i < w; i++) for (let k = 0; k < d; k++) { const r = m.rand(); if (r < density) m.part('24866', x + i, y + 1, z + k, colors[Math.floor(m.rand() * colors.length)]); else if (r < density + 0.25) m.part('6141', x + i, y + 1, z + k, leaves); }
}
/** A garden bench, 4 studs long along x (rot 0) or z (rot 1): two round legs, a smooth seat, a backrest at the back edge. */
export function bench(m, { x, y, z, rot = 0, color = 'Reddish Brown', legs = 'Black' }) {
  m.rigid(() => {
    const at = (u, v) => (rot % 2 === 0 ? [x + u, z + v] : [x + v, z + u]);
    for (const u of [0, 3]) { const [a, b] = at(u, 0); m.part('3062b', a, y, b, legs); }
    const [sx, sz] = at(0, 0); m.tile('1x4', sx, y + 3, sz, color, rot % 2);
  });
}

/** A palm tree on one stud: a slim trunk of round bricks in two browns, crowned with two layers of leaves and a small cap. */
export function palm(m, { x, y, z, h = 18, trunk = ['Reddish Brown', 'Dark Tan'], leaves = 'Green', leaves2 = 'Bright Green' }) {
  let t = y; m.rigid(() => {
    for (let i = 0; t < y + h; i++) { m.part('3062b', x, t, z, trunk[i % trunk.length]); t += 3; }
    const cx = x + 0.5, cz = z + 0.5;
    for (const [rot, c] of [[0, leaves], [1, leaves2]]) { const [lx, lz] = onStud('2417', rot, 0, -0.5, cx, cz); m.part('2417', lx, t, lz, c, rot); t += 1; if (rot === 0) { m.part('6141', x, t, z, trunk[0]); t += 1; } }
    m.part('6141', x, t, z, leaves); t += 1;
  }); return t;
}
/** A beach parasol: a round foot, a pole of round bricks on its centre, a 4×4 dish canopy. The canopy spans 4×4 studs around (x+1, z+1). */
export function parasol(m, { x, y, z, h = 12, pole = 'White', canopy = 'Red', foot = 'White' }) {
  let t = y; m.rigid(() => {
    m.part('4032a', x, t, z, foot); t += 1; m.part('87580', x, t, z, foot); t += 1;      // 2×2 round foot, jumper: one stud on the centre
    for (; t < y + h; t += 3) m.part('3062b', x + 0.5, t, z + 0.5, pole);
    m.part('3960', x - 1, t, z - 1, canopy); t += 2; m.part('4589', x + 0.5, t, z + 0.5, canopy); t += 3;
  }); return t;
}
/** An island or a hill: an irregular rounded outline over w × d studs, a sand rim, rock rising to h plates (a multiple of 3), with a flat
 *  terrace (plateau: { x, z, w, d } in model coordinates, at plateauY plates above y) to build on. Water first, then the island. */
export function island(m, { x, y, z, w, d, h = 9, sand = 'Tan', rock = ['Dark Bluish Gray', 'Light Bluish Gray'], plateau, plateauY = 3, seed = 2 }) {
  const noise = (i, k) => { const v = Math.sin(i * 12.99 + k * 78.23 + seed * 3.7) * 43758.5; return v - Math.floor(v); };
  const cx = (w - 1) / 2, cz = (d - 1) / 2;
  const r = (i, k) => Math.hypot((i - cx) / (w / 2), (k - cz) / (d / 2)) + (noise(i >> 1, k >> 1) - 0.5) * 0.25;
  const inP = (X, Z) => plateau && X >= plateau.x && X < plateau.x + plateau.w && Z >= plateau.z && Z < plateau.z + plateau.d;
  for (let i = 0; i < w; i++) for (let k = 0; k < d; k++) {
    const rr = r(i, k); if (rr > 1) continue; const X = x + i, Z = z + k;
    if (inP(X, Z)) { m.box(X, y, Z, 1, 1, plateauY, rock[0], { unit: 'plateau' }); continue; }
    if (rr > 0.78) { m.box(X, y, Z, 1, 1, 1, sand, { kind: 'plate', unit: 'sand' }); continue; }     // the beach ring
    const hh = Math.max(3, Math.min(h, Math.round(((1 - rr) / 0.78) * h * (0.8 + noise(i, k) * 0.4) / 3) * 3));
    const c = rock[noise((i >> 1) + 5, (k >> 1) + 1) < 0.65 ? 0 : 1];
    m.box(X, y, Z, 1, 1, hh, c, { unit: `isl${i >> 1},${k >> 1}` });
  }
}
