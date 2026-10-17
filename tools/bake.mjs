// Bake real LEGO parts from the LDraw library into the engine: geometry for the viewer and the connection data the checker needs.
//   node tools/bake.mjs 3001 3004 …        bake these ids (adds to the catalogue)
//   node tools/bake.mjs --list             bake every id in tools/partlist.txt
//   options: --force (re-bake existing)
// Library: LDRAW_DIR = an unzipped LDraw complete.zip (folder with parts/ and p/). Without it, files are fetched one by one from
// library.ldraw.org and cached in .ldraw-cache/. Parts are © LDraw.org contributors, CC BY 2.0.
//
// Units ("ours"): 1 = one stud pitch (8 mm), y up; a plate is 0.4, a brick 1.2. LDraw → ours: x/20, −y/20, −z/20.
// For every part we store, relative to the centre of its body's footprint and its bottom face (heights in plates):
//   studs   top studs [x, z, y]            female  anti-stud cells [x, z] on the bottom face
//   cols    occupied columns [x, z, y0, y1] per footprint cell — the collision model
// Geometry is split in two: `main` takes the colour the builder gives the part, `deco` keeps the colours printed on it (faces, signs).
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { mergeVertices, toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GEO = path.join(ROOT, 'engine/parts/geo'), CAT = path.join(ROOT, 'engine/parts/catalog.json'), CACHE = path.join(ROOT, '.ldraw-cache');
const LIB = process.env.LDRAW_DIR ? path.resolve(process.env.LDRAW_DIR) : null;
const REMOTE = 'https://library.ldraw.org/library/official/';
const args = process.argv.slice(2), force = args.includes('--force');
let ids = args.filter((a) => !a.startsWith('--'));
if (args.includes('--list')) ids = fs.readFileSync(path.join(ROOT, 'tools/partlist.txt'), 'utf8').split('\n').map((l) => l.replace(/#.*/, '')).join(' ').split(/\s+/).filter(Boolean);
ids = [...new Set(ids)];
if (!ids.length) { console.error('usage: node tools/bake.mjs <id> … | --list [--force]'); process.exit(1); }
fs.mkdirSync(GEO, { recursive: true });
const catalog = fs.existsSync(CAT) ? JSON.parse(fs.readFileSync(CAT, 'utf8')) : {};

// ---- file access: local library, cache, or one-by-one download ------------------------------------------------------------
let last = 0;
const memo = new Map();
async function readFile(rel) {
  if (memo.has(rel)) return memo.get(rel);
  let out = null;
  for (const base of [LIB, CACHE]) if (base && !out) for (const t of [rel, rel.toLowerCase()]) { const f = path.join(base, t); if (fs.existsSync(f) && fs.statSync(f).isFile()) { out = fs.readFileSync(f, 'utf8'); break; } }
  if (!out && !LIB) {
    const wait = Math.max(0, last + 300 - Date.now()); if (wait) await new Promise((r) => setTimeout(r, wait)); last = Date.now();
    const r = await fetch(REMOTE + rel.toLowerCase(), { headers: { 'User-Agent': 'lego-forge' } });
    if (r.status === 200) { out = await r.text(); const f = path.join(CACHE, rel.toLowerCase()); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, out); }
  }
  memo.set(rel, out); return out;
}
const SUBS = ['parts/', 'p/', 'parts/s/', 'p/48/', 'p/8/'];
async function findFile(name) { name = name.replace(/\\/g, '/'); if (name.startsWith('s/')) { const t = await readFile('parts/' + name); if (t) return t; } for (const s of SUBS) { const t = await readFile(s + name); if (t) return t; } return null; }

// ---- colours ---------------------------------------------------------------------------------------------------------------------
const COLORS = {}, TRANS = new Set();
for (const line of String(await readFile('LDConfig.ldr') ?? '').split('\n')) { const m = /!COLOUR\s+(\S+)\s+CODE\s+(\d+)\s+VALUE\s+#([0-9A-Fa-f]{6})/.exec(line); if (m) { COLORS[m[2]] = m[3]; if (/ALPHA\s+([0-9]+)/.test(line) && +/ALPHA\s+([0-9]+)/.exec(line)[1] < 200) TRANS.add(m[2]); } }
if (!COLORS['0']) throw new Error('LDConfig.ldr not found — set LDRAW_DIR');

// ---- a small LDraw parser: triangles with colour codes, BFC-correct winding, stud primitives -----------------------------------
const mul = (A, B) => { const R = new Array(12).fill(0); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) R[r * 3 + c] = A[r * 3] * B[c] + A[r * 3 + 1] * B[3 + c] + A[r * 3 + 2] * B[6 + c]; for (let r = 0; r < 3; r++) R[9 + r] = A[r * 3] * B[9] + A[r * 3 + 1] * B[10] + A[r * 3 + 2] * B[11] + A[9 + r]; return R; };
const apply = (M, p) => [M[0] * p[0] + M[1] * p[1] + M[2] * p[2] + M[9], M[3] * p[0] + M[4] * p[1] + M[5] * p[2] + M[10], M[6] * p[0] + M[7] * p[1] + M[8] * p[2] + M[11]];
const rotv = (M, v) => [M[0] * v[0] + M[1] * v[1] + M[2] * v[2], M[3] * v[0] + M[4] * v[1] + M[5] * v[2], M[6] * v[0] + M[7] * v[1] + M[8] * v[2]];
const det3 = (M) => M[0] * (M[4] * M[8] - M[5] * M[7]) - M[1] * (M[3] * M[8] - M[5] * M[6]) + M[2] * (M[3] * M[7] - M[4] * M[6]);
const STUD = /^stud(2|2a|6|6a|p01|10|15|17a|18a)?\.dat$/;
/** → { tris: [{ c: colour code ('16' = the part's own colour), p: [9 numbers, LDraw frame] }], studs: [{ at, dir }], certified } */
async function parse(name) {
  const tris = [], studs = [], tubes = []; let certified = true;
  async function walk(text, M, color, invert, depth, isTop) {
    let ccw = true, inv = false, cert = false;
    for (const raw of text.split('\n')) {
      const t = raw.trim().split(/\s+/); if (!t[0]) continue;
      if (t[0] === '0') { if (t[1] === 'BFC') { const w = t.slice(2); if (w.includes('CERTIFY')) cert = true; if (w.includes('CW')) ccw = false; if (w.includes('CCW')) ccw = true; if (w.includes('INVERTNEXT')) inv = true; } continue; }
      const col = t[1] === '16' ? color : t[1];
      if (t[0] === '1' && t.length >= 15) {
        const n = t.slice(2, 14).map(Number); const L = [n[3], n[4], n[5], n[6], n[7], n[8], n[9], n[10], n[11], n[0], n[1], n[2]]; const W = mul(M, L);
        const sub = t.slice(14).join(' '); const base = path.basename(sub.replace(/\\/g, '/')).toLowerCase();
        if (STUD.test(base)) studs.push({ at: apply(W, [0, 0, 0]), dir: rotv(W, [0, -1, 0]) });
        if (/^stud4(a|o|s|h|f)?\.dat$/.test(base)) tubes.push(apply(W, [0, 0, 0]));
        const txt = depth < 12 ? await findFile(sub) : null; if (txt) await walk(txt, W, col, invert !== (inv !== (det3(L) < 0)), depth + 1, false);
        inv = false; continue;
      }
      if (t[0] === '3' || t[0] === '4') {
        const k = t[0] === '3' ? 3 : 4; const pts = []; for (let i = 0; i < k; i++) pts.push(apply(M, t.slice(2 + i * 3, 5 + i * 3).map(Number)));
        const flip = ccw === invert;   // vertices go counter-clockwise when (ccw, not inverted) or (cw, inverted)
        const tri = (a, b, c) => tris.push({ c: col, p: flip ? [...a, ...c, ...b] : [...a, ...b, ...c], cert: cert || !isTop });
        tri(pts[0], pts[1], pts[2]); if (k === 4) tri(pts[0], pts[2], pts[3]);
      }
    }
    if (isTop && !cert) certified = false;
  }
  const text = await findFile(name); if (!text) return null;
  await walk(text, [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], '16', false, 0, true);
  return { tris, studs, tubes, certified, header: text.split('\n')[0].replace(/^0\s*/, '').trim() };
}

// ---- geometry helpers ---------------------------------------------------------------------------------------------------------
function clipY(t, x0, x1, z0, z1) {   // y range of triangle t clipped to the vertical prism x∈[x0,x1], z∈[z0,z1]
  let poly = [t.slice(0, 3), t.slice(3, 6), t.slice(6, 9)];
  for (const [ax, lim, keepGreater] of [[0, x0, true], [0, x1, false], [2, z0, true], [2, z1, false]]) {
    const o = []; for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length]; const ia = keepGreater ? a[ax] >= lim : a[ax] <= lim, ib = keepGreater ? b[ax] >= lim : b[ax] <= lim;
      if (ia) o.push(a); if (ia !== ib) { const k = (lim - a[ax]) / (b[ax] - a[ax]); o.push(a.map((v, j) => v + (b[j] - v) * k)); } }
    poly = o; if (!poly.length) return null;
  }
  let lo = Infinity, hi = -Infinity; for (const p of poly) { lo = Math.min(lo, p[1]); hi = Math.max(hi, p[1]); } return [lo, hi];
}
function triBox(t, c, h) {   // triangle–box overlap (separating axes)
  const v = [0, 1, 2].map((i) => [t[i * 3] - c[0], t[i * 3 + 1] - c[1], t[i * 3 + 2] - c[2]]);
  for (let a = 0; a < 3; a++) { const mn = Math.min(v[0][a], v[1][a], v[2][a]), mx = Math.max(v[0][a], v[1][a], v[2][a]); if (mn > h[a] || mx < -h[a]) return false; }
  const e = [0, 1, 2].map((i) => v[(i + 1) % 3].map((x, j) => x - v[i][j]));
  const n = [e[0][1] * e[1][2] - e[0][2] * e[1][1], e[0][2] * e[1][0] - e[0][0] * e[1][2], e[0][0] * e[1][1] - e[0][1] * e[1][0]];
  const axes = [n]; for (const ei of e) for (const u of [[1, 0, 0], [0, 1, 0], [0, 0, 1]]) axes.push([u[1] * ei[2] - u[2] * ei[1], u[2] * ei[0] - u[0] * ei[2], u[0] * ei[1] - u[1] * ei[0]]);
  for (const ax of axes) { if (Math.abs(ax[0]) + Math.abs(ax[1]) + Math.abs(ax[2]) < 1e-12) continue; const p = v.map((x) => x[0] * ax[0] + x[1] * ax[1] + x[2] * ax[2]); const r = h[0] * Math.abs(ax[0]) + h[1] * Math.abs(ax[1]) + h[2] * Math.abs(ax[2]); if (Math.min(...p) > r || Math.max(...p) < -r) return false; }
  return true;
}
const b64 = (a) => Buffer.from(a.buffer, a.byteOffset, a.byteLength).toString('base64');
function meshOf(list, withColor) {   // triangles (ours) → creased-normal indexed geometry, quantised
  const pos = new Float32Array(list.length * 9); list.forEach((t, i) => pos.set(t.p, i * 9));
  let g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  if (withColor) { const col = new Float32Array(list.length * 9); const c = new THREE.Color(); list.forEach((t, i) => { c.set('#' + (COLORS[t.c] ?? '808080')); for (let k = 0; k < 3; k++) col.set([c.r, c.g, c.b], i * 9 + k * 3); }); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); }
  g = toCreasedNormals(g, (32 * Math.PI) / 180); g = mergeVertices(g, 1e-4); g.computeBoundingBox(); const bb = g.boundingBox;
  let Q = 1024; while (Math.max(...[bb.min.x, bb.min.y, bb.min.z, bb.max.x, bb.max.y, bb.max.z].map(Math.abs)) * Q > 32767) Q /= 2;
  const P = Int16Array.from(g.attributes.position.array, (v) => Math.round(v * Q)), N = Int8Array.from(g.attributes.normal.array, (v) => Math.round(v * 127));
  const idx = g.index.array; const I = g.attributes.position.count < 65536 ? new Uint16Array(idx) : new Uint32Array(idx);
  const o = { q: Q, i32: I instanceof Uint32Array, pos: b64(P), nrm: b64(N), idx: b64(I) };
  if (withColor) o.col = b64(Uint8Array.from(g.attributes.color.array, (v) => Math.round(v * 255)));
  return o;
}
function category(n) {
  for (const [re, c] of [[/^Minifig/, 'minifig'], [/^(Plant|Flower|Tree|Leaves)/, 'plant'], [/^Animal/, 'animal'], [/^Tile/, 'tile'], [/^Plate/, 'plate'], [/Curved/, 'curve'], [/^(Slope|Wedge)/, 'slope'],
    [/^Brick/, 'brick'], [/^(Window|Glass|Door|Panel|Fence|Shutter|Wall)/, 'window'], [/^Arch/, 'arch'], [/^(Cone|Dish|Dome|Cylinder|Round)/, 'round'], [/^(Wheel|Tyre|Tire|Car |Vehicle|Steering|Mudguard)/, 'vehicle'], [/^Baseplate/, 'baseplate']])
    if (re.test(n)) return c;
  return 'detail';
}

// ---- bake ----------------------------------------------------------------------------------------------------------------------
const STUD_H = 0.2125, PL = 0.4; let done = 0;
for (let id of ids) {
  let res = await parse(id + '.dat'); if (!res) { console.log(`✗ ${id}: not in the LDraw library`); continue; }
  for (let hop = 0; hop < 4; hop++) { const moved = /^~Moved to (\S+)/.exec(res.header); if (!moved) break; console.log(`· ${id} → ${moved[1]} (moved)`); id = moved[1]; res = await parse(id + '.dat'); }
  if (/Obsolete/i.test(res.header)) { console.log(`✗ ${id}: obsolete (${res.header})`); continue; }
  if (catalog[id] && !force && fs.existsSync(path.join(GEO, id + '.json'))) continue;
  // LDraw → ours, and split by colour
  const toOurs = (p) => p.map((v, i) => (i % 3 === 0 ? v / 20 : -v / 20));
  const all = res.tris.map((t) => ({ c: t.c, p: toOurs(t.p) }));
  const isMain = (t) => t.c === '16' || t.c === '24'; const main = all.filter(isMain), deco = all.filter((t) => !isMain(t) && !TRANS.has(t.c)), glass = all.filter((t) => !isMain(t) && TRANS.has(t.c));
  const tris = all.map((t) => t.p);
  const bb = new THREE.Box3(); for (const t of tris) for (let i = 0; i < 9; i += 3) bb.expandByPoint(new THREE.Vector3(t[i], t[i + 1], t[i + 2]));
  const studs0 = res.studs.map((s) => ({ at: [s.at[0] / 20, -s.at[1] / 20, -s.at[2] / 20], dir: [s.dir[0], -s.dir[1], -s.dir[2]] }));
  const up = studs0.filter((s) => s.dir[1] > 0.9);
  const topStud = up.length ? Math.max(...up.map((u) => u.at[1])) : -Infinity;
  const top = up.length && Math.abs(bb.max.y - (topStud + STUD_H)) < 0.08 ? topStud : bb.max.y;   // the body ends where the top studs begin
  const body = [bb.min.x, bb.min.y, bb.min.z, bb.max.x, Math.max(top, bb.min.y + 0.01), bb.max.z];
  for (const s of studs0) { if (Math.abs(s.dir[1]) > 0.1) continue;   // side studs stick out of the body: the body ends at their base
    if (s.dir[0] > 0.9) body[3] = Math.min(body[3], s.at[0]); if (s.dir[0] < -0.9) body[0] = Math.max(body[0], s.at[0]);
    if (s.dir[2] > 0.9) body[5] = Math.min(body[5], s.at[2]); if (s.dir[2] < -0.9) body[2] = Math.max(body[2], s.at[2]); }
  const cx = (body[0] + body[3]) / 2, cz = (body[2] + body[5]) / 2;
  // the connection plane: whole plates below the top studs (a wheel-holder's pins or a hanging detail reach below it)
  let y0 = body[1]; if (up.length) { const k = (topStud - bb.min.y) / PL; if (Math.abs(k - Math.round(k)) > 0.05) y0 = topStud - Math.max(1, Math.round(k)) * PL; }
  body[1] = Math.min(body[1], y0);
  const W = Math.max(1, Math.round(body[3] - body[0] - 0.1)), D = Math.max(1, Math.round(body[5] - body[2] - 0.1)), H = (body[4] - y0) / PL;
  const studs = up.map((s) => [+(s.at[0] - cx).toFixed(3), +(s.at[2] - cz).toFixed(3), +((s.at[1] - y0) / PL).toFixed(2)]);
  // studs pointing sideways (SNOT): [x, z, y (plates), dx, dz] — where kits can mount tiles and plates on their side
  const side = studs0.filter((s) => Math.abs(s.dir[1]) < 0.1).map((s) => [+(s.at[0] - cx).toFixed(3), +(s.at[2] - cz).toFixed(3), +((s.at[1] - y0) / PL).toFixed(2), Math.round(s.dir[0]), Math.round(s.dir[2])]);
  const cols = [], female = [];
  for (let i = 0; i < W; i++) for (let j = 0; j < D; j++) {
    const x = -W / 2 + i + 0.5, z = -D / 2 + j + 0.5, X = cx + x, Z = cz + z;
    let lo = Infinity, hi = -Infinity, reach = false;
    for (const t of tris) {
      const r = clipY(t, X - 0.3, X + 0.3, Z - 0.3, Z + 0.3);
      if (r) { const isStud = r[1] > top + 0.02 && up.some((s) => Math.hypot(s.at[0] - X, s.at[2] - Z) < 0.4); if (!isStud) { lo = Math.min(lo, r[0]); hi = Math.max(hi, Math.min(r[1], top)); } }
      const w = clipY(t, X - 0.45, X + 0.45, Z - 0.45, Z + 0.45); if (w && w[0] < y0 + 0.06) reach = true;
    }
    if (hi > lo) cols.push([+x.toFixed(3), +z.toFixed(3), +((lo - y0) / PL).toFixed(2), +((hi - y0) / PL).toFixed(2)]);
    // an anti-stud: the room a stud needs is empty, and the part reaches down to its bottom face around it
    const empty = !tris.some((t) => triBox(t, [X, y0 + 0.11, Z], [0.2, 0.08, 0.2]));
    if (empty && reach) female.push([+x.toFixed(3), +z.toFixed(3)]);
  }
  // no anti-stud found in the cells: a stud tube (stud4) at the bottom takes a stud (birds, some animals); an animal stands on one stud
  if (!female.length) for (const t of res.tubes) { const p = [t[0] / 20, -t[1] / 20, -t[2] / 20]; if (Math.abs(p[1] - y0) < 0.35) female.push([+(p[0] - cx).toFixed(3), +(p[2] - cz).toFixed(3)]); }
  if (!female.length && /^Animal/.test(res.header.replace(/^[~=_|]+/, '')) && cols.some((c) => c[2] < 0.1)) { const c = cols.reduce((a, b) => (Math.hypot(a[0], a[1]) <= Math.hypot(b[0], b[1]) ? a : b)); female.push([c[0], c[1]]); }
  const name = res.header.replace(/^[~=_|]+/, '').replace(/\s+/g, ' ');
  catalog[id] = { id, name, cat: category(name), w: W, d: D, h: +H.toFixed(2), body: body.map((v) => +v.toFixed(4)), base: +y0.toFixed(4), studs, female, cols, ...(side.length ? { side } : {}), deco: deco.length > 0 || glass.length > 0, ...(res.certified ? {} : { ds: true }) };
  fs.writeFileSync(path.join(GEO, id + '.json'), JSON.stringify({ main: main.length ? meshOf(main, false) : null, deco: deco.length ? meshOf(deco, true) : null, glass: glass.length ? meshOf(glass, true) : null }));
  done++; console.log(`✓ ${id} ${name} · ${W}×${D}×${H.toFixed(2)}p · ${studs.length} studs · ${female.length} anti-studs${deco.length ? ' · printed' : ''}${res.certified ? '' : ' · not BFC'}`);
}
const sorted = Object.fromEntries(Object.entries(catalog).sort(([a], [b]) => a.localeCompare(b, 'en', { numeric: true })));
fs.writeFileSync(CAT, '{\n' + Object.entries(sorted).map(([k, v]) => JSON.stringify(k) + ':' + JSON.stringify(v)).join(',\n') + '\n}\n');
console.log(`baked ${done} · catalogue ${Object.keys(sorted).length} parts`);
