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
const WINDOWS = { '1x2x2': ['60592', '60601', 6], '1x2x3': ['60593', '60602', 9], '1x4x3': ['60594', '60603', 9] };
/** A window in a wall: frame + glass. x, z = min corner of its footprint (a 2- or 4-stud run of the wall), y = bottom.
 *  Cuts its opening out of any box() volume first. size '1x2x2' | '1x2x3' | '1x4x3'; rot 0/2 for walls running along x, 1/3 along z. */
export function window(m, { x, y, z, rot = 0, size = '1x2x2', frame = 'White', glass = 'Trans Clear' }) {
  const [fid, gid, h] = WINDOWS[size] ?? WINDOWS['1x2x2']; const [fw, fd] = footprint(partDef(fid), rot);
  m.cut(x, y, z, fw, fd, h);
  let host; m.rigid(() => { host = m.part(fid, x, y, z, frame, rot); if (host) rider(m, host, gid, glass); }); return host;
}
/** A door: 1×4×6 frame (18 plates tall) with a three-pane door, hinged on the left. Cuts its opening. */
export function door(m, { x, y, z, rot = 0, frame = 'White', color = 'Red' }) {
  const [fw, fd] = footprint(partDef('30179'), rot); m.cut(x, y, z, fw, fd, 18);
  let host; m.rigid(() => { host = m.part('30179', x, y, z, frame, rot); if (host) rider(m, host, '30178c01', color, ld(-32, 0, 0, 0, 0, -1, 0, 1, 0, 1, 0, 0)); }); return host;
}

// ---- roofs ---------------------------------------------------------------------------------------------------------------------
/** A pitched roof over the rectangle x..x+w, z..z+d (studs), starting at plate level y. ridge 'x': the ridge runs along x, the slopes
 *  face +z and −z; ridge 'z': along z. Courses of 45° slopes step in one stud per brick of height; the gable ends are filled with
 *  bricks in `gable` colour (default: the roof colour). Returns the plate level of the top. */
export function roof(m, { x, y, z, w, d, color = 'Dark Bluish Gray', gable, ridge = 'x' }) {
  gable = gable ?? color; const along = ridge === 'x';
  const W = along ? w : d, D = along ? d : w;          // W along the ridge, D across it
  if (D % 2) { m.errors.push(`roof(): the roof must be an even number of studs across the ridge (got ${D})`); return y; }
  const put = (u, v, id, rot, c = color) => { const [px, pz] = along ? [x + u, z + v] : [x + v, z + u]; return m.part(id, px, y + k * 3, pz, c, along ? rot : (rot + 1) % 4); };
  let k = 0;
  // 3039 at rot 0 has its studs on the −z row and slopes down towards +z: the −z course is turned (rot 2) to slope down outwards
  for (; D - 2 * k > 2; k++) {
    for (let u = 0; u < W; u += 2) { const n = Math.min(2, W - u); put(u, k, n === 2 ? '3039' : '3040b', 2); put(u, D - 2 - k, n === 2 ? '3039' : '3040b', 0); }
    if (D - 2 * k > 4) m.box(along ? x : x + k + 2, y + k * 3, along ? z + k + 2 : z, along ? W : D - 4 - 2 * k, along ? D - 4 - 2 * k : W, 3, gable);
  }
  const rest = D - 2 * k;   // 1 or 2 studs left under the ridge
  for (let u = 0; u < W; u += 2) { const n = Math.min(2, W - u); put(u, k, n === 2 ? '3043' : '3044b', 0); }
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
