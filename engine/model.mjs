// The model a build script writes. Grid: x and z in studs, y in plates (a brick is 3 plates); x/z/y of a part is the min corner of its
// footprint and its bottom face. rot is a quarter turn count about the vertical axis (0–3), turning the part about its own centre.
import { CATALOG, part as partDef, footprint, resolve as resolveP } from './catalog.mjs';
import { colorName } from './colors.mjs';

export const BRICK = { '1x1': '3005', '1x2': '3004', '1x3': '3622', '1x4': '3010', '1x6': '3009', '1x8': '3008', '1x10': '6111', '1x12': '6112', '2x2': '3003', '2x3': '3002', '2x4': '3001', '2x6': '2456', '2x8': '3007', '2x10': '3006' };
export const PLATE = { '1x1': '3024', '1x2': '3023b', '1x3': '3623', '1x4': '3710', '1x6': '3666', '1x8': '3460', '1x10': '4477', '1x12': '60479', '2x2': '3022', '2x3': '3021', '2x4': '3020', '2x6': '3795', '2x8': '3034', '2x10': '3832', '2x12': '2445',
  '4x4': '3031', '4x6': '3032', '4x8': '3035', '4x10': '3030', '4x12': '3029', '6x6': '3958', '6x8': '3036', '6x10': '3033', '6x12': '3028', '6x16': '3027', '8x8': '41539', '8x16': '92438', '16x16': '91405' };
export const TILE = { '1x1': '3070b', '1x2': '3069b', '1x3': '63864', '1x4': '2431', '1x6': '6636', '1x8': '4162', '2x2': '3068b', '2x3': '26603', '2x4': '87079' };
const SIZES = { brick: BRICK, plate: PLATE, tile: TILE };

function mulberry32(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export class Model {
  /** @param {{ title: string, subtitle?: string, budget?: [number, number], seed?: number }} meta */
  constructor(meta = {}) {
    this.meta = { title: 'Untitled set', subtitle: '', budget: [300, 2000], ...meta };
    this.parts = []; this.vox = new Map(); this.cuts = []; this.owner = new Map(); this.warnings = []; this.deferred = []; this.rand = mulberry32(meta.seed ?? 1); this.tag = ''; this.groupId = null; this._groups = 0; this.errors = [];
    this._src = null;
  }
  /** Mark everything placed inside fn with a tag (shown by the checker and usable in renders: --only <tag>). */
  section(tag, fn) { const t = this.tag; this.tag = tag; try { fn(); } finally { this.tag = t; } return this; }
  /** A real part by its LDraw id. Returns the placement. */
  part(id, x, y, z, color, rot = 0) {
    const def = partDef(id); if (!def) { this.errors.push(`unknown part id '${id}' (see docs/PARTS.md)`); return null; }
    const c = colorName(color); if (!c) { this.errors.push(`unknown colour '${color}' on part ${id} (see docs/COLORS.md)`); return null; }
    const p = { id: def.id, x, y, z, rot: ((rot % 4) + 4) % 4, color: c, tag: this.tag, group: this.groupId, line: callerLine() };
    this.parts.push(p); return p;
  }
  /** Plain bricks, plates and tiles by their LEGO name: '1x4', '2x4', '2x2'. rot 0 lays the long side along x (left–right), rot 1 along z
   *  (front–back). x, z are still the min corner of the footprint. */
  brick(size, x, y, z, color, rot = 0) { return this.sized('brick', size, x, y, z, color, rot); }
  plate(size, x, y, z, color, rot = 0) { return this.sized('plate', size, x, y, z, color, rot); }
  tile(size, x, y, z, color, rot = 0) { return this.sized('tile', size, x, y, z, color, rot); }
  sized(kind, size, x, y, z, color, rot = 0) {
    const [a, b] = String(size).toLowerCase().split('x').map(Number); const key = a <= b ? `${a}x${b}` : `${b}x${a}`; const id = SIZES[kind][key];
    if (!id) { this.errors.push(`no ${kind} ${size} — available: ${Object.keys(SIZES[kind]).join(', ')}`); return null; }
    const def = partDef(id); const longAlongX = def.w >= def.d;   // the catalogue orientation of this part
    return this.part(id, x, y, z, color, (rot % 2 === 0) === longAlongX ? 0 : 1);
  }
  /** Fill a box with bricks/plates/tiles: w × d studs, h plates (bricks need h a multiple of 3 to stay bricks). The packer staggers the joints.
   *  opts.hollow leaves the inside empty (walls one stud thick); opts.top: 'tile' caps the top layer with tiles. */
  box(x, y, z, w, d, h, color, opts = {}) {
    if (!colorName(color)) { this.errors.push(`unknown colour '${color}' in box() at ${callerLine() || 'kit'} (see docs/COLORS.md)`); return this; }
    for (const c of this.cuts) if (c[1] > y && x < c[0] + c[3] && c[0] < x + w && y < c[1] + c[5] && c[1] < y + h && z < c[2] + c[4] && c[2] < z + d)   // an opening inside a wall built after it
      this.warnings.push(`box() at ${callerLine() || 'kit'} fills space an earlier cut() emptied (${c[6] || 'a kit'}): cuts only remove what was boxed before them — if that opening should stay open, box first and cut after`);
    const kind = opts.kind ?? (h % 3 === 0 ? 'brick' : 'plate'); const capped = opts.hollow && (opts.top || opts.cap);
    for (let i = 0; i < w; i++) for (let k = 0; k < d; k++) for (let j = 0; j < h; j++) {
      const inside = i > 0 && i < w - 1 && k > 0 && k < d - 1;
      // hollow: walls one stud thick; with a top, the top layer (two layers under a tile finish) is solid so the lid holds together
      if (opts.hollow && inside && !(capped && j >= h - (opts.top === 'tile' ? 2 : 1))) continue;
      const top = j === h - 1 && opts.top === 'tile';
      // hollow walls: each wall is its own run, and the corners change hands course by course so the walls interlock
      let unit = opts.unit; const lid = capped && j >= h - (opts.top === 'tile' ? 2 : 1);
      if (lid) unit = `${opts.unit ?? ''}lid${x},${z}`;                         // the lid: one unit over walls and interior, so its plates bridge them
      if (opts.hollow && !inside && !lid) {
        const course = kind === 'brick' ? Math.floor(j / 3) : j; const fb = k === 0 || k === d - 1, lr = i === 0 || i === w - 1;
        const side = fb && lr ? (course % 2 ? (i === 0 ? 'L' : 'R') : (k === 0 ? 'B' : 'F')) : fb ? (k === 0 ? 'B' : 'F') : (i === 0 ? 'L' : 'R');
        unit = `${opts.unit ?? ''}wall${x},${z}:${side}`;
      }
      this.vox.set(`${x + i},${y + j},${z + k}`, { color: colorName(color) ?? color, kind: top ? 'tile' : lid && kind === 'brick' ? 'plate' : kind, tag: this.tag, group: this.groupId, unit });
    }
    return this;
  }
  /** Remove box() volume from a region (an opening for a window or door). It removes what has been boxed so far: box first, then cut. */
  cut(x, y, z, w, d, h) {
    for (let i = 0; i < w; i++) for (let k = 0; k < d; k++) for (let j = 0; j < h; j++) this.vox.delete(`${x + i},${y + j},${z + k}`);
    this.cuts.push([x, y, z, w, d, h, callerLine()]); return this;
  }
  /** Parts placed inside fn form one rigid unit (a minifigure): they may touch each other and count as connected to each other. */
  rigid(fn) { const g = this.groupId; this.groupId = `g${++this._groups}`; try { fn(); } finally { this.groupId = g; } return this; }
  /** A part placed by an exact transform (kits only): p = LDraw origin in model units (studs; y in studs, not plates), m = row-major 3×3. */
  free(id, color, p, m) {
    const def = partDef(id); if (!def) { this.errors.push(`unknown part id '${id}'`); return null; }
    const c = colorName(color); if (!c) { this.errors.push(`unknown colour '${color}' on part ${id}`); return null; }
    const q = { id: def.id, color: c, free: { p, m }, tag: this.tag, group: this.groupId, line: callerLine() }; this.parts.push(q); return q;
  }
  /** Turn the box volumes into real parts (called by the CLI before checking). */
  /** run fn when the build script has finished, just before packing (kits use it to place details only where volume is left) */
  defer(fn) { this.deferred.push([fn, this.tag, this.groupId]); }
  pack() {
    for (const [fn, tag, g] of this.deferred.splice(0)) { const t0 = this.tag, g0 = this.groupId; this.tag = tag; this.groupId = g; try { fn(); } finally { this.tag = t0; this.groupId = g0; } }
    // a part standing on a tiled floor: the tile cells under it become plates (same colour), so it has studs to stand on — the way a
    // builder leaves a stud exposed where a figure or a table goes
    const tileToPlate = Object.fromEntries(Object.entries(TILE).filter(([k]) => PLATE[k]).map(([k, id]) => [id, PLATE[k]]));
    const tileParts = this.parts.filter((q) => !q.free && tileToPlate[q.id]);
    for (const p of this.parts) { if (p.free || tileToPlate[p.id]) continue; const r = resolveP(p); for (const [fx, fz] of r.female) {
      const k = `${Math.floor(fx)},${p.y - 1},${Math.floor(fz)}`; const v = this.vox.get(k); if (v && v.kind === 'tile') this.vox.set(k, { ...v, kind: 'plate', unit: (v.unit ?? '') + '~stand' });
      for (const q of tileParts) { if (q.y !== p.y - 1 || !tileToPlate[q.id]) continue; const d = partDef(q.id); const [fw, fd] = footprint(d, q.rot); if (fx > q.x && fx < q.x + fw && fz > q.z && fz < q.z + fd) q.id = tileToPlate[q.id]; } } }   // a placed tile too
    if (!this.vox.size) return this;
    const layers = new Map(); for (const k of this.vox.keys()) { const [x, y, z] = k.split(',').map(Number); if (!layers.has(y)) layers.set(y, []); layers.get(y).push([x, z]); }
    const used = new Set(); const ys = [...layers.keys()].sort((a, b) => a - b);
    const K = (x, y, z) => `${x},${y},${z}`;
    for (const y of ys) {
      const cells = layers.get(y);
      const flipB = Math.floor(y / 3) % 2 === 1, flipP = y % 2 === 1;   // alternate courses: bricks every 3 plates, plates every plate
      // every other course walks the cells column by column, so the runs along z take the corners there and the walls interlock
      const flip = this.vox.get(`${cells[0][0]},${y},${cells[0][1]}`)?.kind === 'brick' ? flipB : flipP;
      cells.sort((a, b) => (flip ? a[0] - b[0] || a[1] - b[1] : a[1] - b[1] || a[0] - b[0]));
      const brickAt = (x, z) => { const v = this.vox.get(K(x, y, z)); if (!v || v.kind !== 'brick' || used.has(K(x, y, z))) return null;
        for (let dy = 1; dy < 3; dy++) { const u = this.vox.get(K(x, y + dy, z)); if (!u || u.kind !== 'brick' || u.color !== v.color || u.group !== v.group || used.has(K(x, y + dy, z))) return null; } return v; };
      // straight one-stud-wide runs (walls, edges): split them so no joint sits over a joint of the course below, and no run ends in a
      // single-stud piece — the course then holds the course below together
      this.packRuns(y, cells, brickAt, used, K);
      for (const [x, z] of cells) { const v = brickAt(x, z); if (!v) continue;
        const [w, d] = this.bestRect(x, z, (cx, cz) => { const u = brickAt(cx, cz); return !!u && u.color === v.color && u.tag === v.tag && u.group === v.group && u.unit === v.unit; }, BRICK, flipB, (cx, cz) => { const u = this.vox.get(K(cx, y, cz)); return !!u && u.kind === 'brick' && u.color === v.color && u.unit === v.unit; });
        for (let i = 0; i < w; i++) for (let k = 0; k < d; k++) for (let dy = 0; dy < 3; dy++) used.add(K(x + i, y + dy, z + k));
        this.emit('brick', x, y, z, w, d, v); }
      for (const [x, z] of cells) { const k0 = K(x, y, z); if (used.has(k0)) continue; const v = this.vox.get(k0); const kind = v.kind === 'tile' ? 'tile' : 'plate';
        const ok = (cx, cz) => { const k = K(cx, y, cz); const u = this.vox.get(k); return !!u && !used.has(k) && u.color === v.color && u.tag === v.tag && u.group === v.group && u.unit === v.unit && (u.kind === 'tile') === (kind === 'tile'); };
        const [w, d] = this.bestRect(x, z, ok, kind === 'tile' ? TILE : PLATE, flipP, (cx, cz) => { const u = this.vox.get(K(cx, y, cz)); return !!u && u.color === v.color && u.unit === v.unit && (u.kind === 'tile') === (kind === 'tile'); });
        for (let i = 0; i < w; i++) for (let k = 0; k < d; k++) used.add(K(x + i, y, z + k));
        this.emit(kind, x, y, z, w, d, v); }
    }
    this.vox.clear(); return this;
  }
  packRuns(y, cells, brickAt, used, K) {
    const props = (v) => `${v.color}|${v.tag}|${v.group}|${v.unit}`;
    for (const mode of ['brick', 'plate']) {
      const can = (x, z) => { if (used.has(K(x, y, z))) return null; const v = this.vox.get(K(x, y, z)); if (!v) return null;
        if (mode === 'brick') return brickAt(x, z); return v.kind === 'brick' && brickAt(x, z) ? null : v; };
      const seen = new Set();
      for (const [x0, z0] of cells) {
        const v0 = can(x0, z0); if (!v0 || seen.has(`${x0},${z0}`)) continue;
        // the connected region of identical cells
        const comp = []; const st = [[x0, z0]]; seen.add(`${x0},${z0}`);
        while (st.length) { const [x, z] = st.pop(); comp.push([x, z]); for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = `${x + dx},${z + dz}`; if (seen.has(k)) continue; const u = can(x + dx, z + dz); if (u && props(u) === props(v0) && (mode === 'brick' || (u.kind === 'tile') === (v0.kind === 'tile'))) { seen.add(k); st.push([x + dx, z + dz]); } } }
        const alongX = comp.every(([, z]) => z === comp[0][1]), alongZ = comp.every(([x]) => x === comp[0][0]);
        if (comp.length < 2 || !(alongX || alongZ)) continue;
        const kind = mode === 'brick' ? 'brick' : v0.kind === 'tile' ? 'tile' : 'plate'; const table = kind === 'brick' ? BRICK : kind === 'tile' ? TILE : PLATE;
        const lens = Object.keys(table).map((k) => k.split('x').map(Number)).filter(([a]) => a === 1).map(([, b]) => b).concat([1]).filter((v, i, a) => a.indexOf(v) === i);
        const a0 = alongX ? Math.min(...comp.map((c) => c[0])) : Math.min(...comp.map((c) => c[1])); const L = comp.length; const fixed = alongX ? comp[0][1] : comp[0][0];
        const at = (p) => (alongX ? [a0 + p, fixed] : [fixed, a0 + p]);
        const below = y - (kind === 'brick' ? 1 : 1); const bad = new Set();
        for (let p = 1; p < L; p++) { const [ax, az] = at(p - 1), [bx, bz] = at(p); const o1 = this.owner.get(K(ax, below, az)), o2 = this.owner.get(K(bx, below, bz)); if (o1 !== undefined && o2 !== undefined && o1 !== o2) bad.add(p); }
        // dynamic programme: fewest joints over a joint below, then no single-stud end pieces, then fewest pieces
        const cost = (p, len) => (bad.has(p) && p !== L ? 100 : 0) + ((len === 1 && L >= 3) ? 10 : 0) + 1;
        const best = new Array(L + 1).fill(Infinity), prev = new Array(L + 1).fill(-1); best[0] = 0;
        for (let p = 0; p < L; p++) if (best[p] < Infinity) for (const len of lens) { const q = p + len; if (q > L) continue; const c = best[p] + cost(q, len); if (c < best[q]) { best[q] = c; prev[q] = p; } }
        const cuts = []; for (let q = L; q > 0; q = prev[q]) cuts.unshift([prev[q], q - prev[q]]);
        for (const [p, len] of cuts) { const [x, z] = at(p); const [w, d] = alongX ? [len, 1] : [1, len];
          for (let i = 0; i < w; i++) for (let k = 0; k < d; k++) for (let dy = 0; dy < (kind === 'brick' ? 3 : 1); dy++) used.add(K(x + i, y + dy, z + k));
          this.emit(kind, x, y, z, w, d, v0); }
      }
    }
  }
  bestRect(x, z, ok, table, flip, inRun = ok) {
    const fits = [];
    for (const key of Object.keys(table)) { const [a, b] = key.split('x').map(Number); for (const [w, d] of a === b ? [[a, b]] : [[a, b], [b, a]]) {
      let good = true; for (let i = 0; i < w && good; i++) for (let k = 0; k < d; k++) if (!ok(x + i, z + k)) { good = false; break; }
      if (good) fits.push([w, d, w * d]); } }
    if (!fits.length) return [1, 1];
    fits.sort((p, q) => q[2] - p[2] || (flip ? p[0] - q[0] : q[0] - p[0]));
    let f = fits[0];
    // running bond: on every other course, a narrow run (a wall) starts with a short piece, so its joints fall between the joints below
    if (flip && Math.min(f[0], f[1]) <= 2) {
      if (f[0] > f[1] && f[0] > 2 && !inRun(x - 1, z)) f = fits.find((g) => g[1] === f[1] && g[0] === 2) ?? fits.find((g) => g[1] === f[1] && g[0] === 1) ?? f;
      else if (f[1] > f[0] && f[1] > 2 && !inRun(x, z - 1)) f = fits.find((g) => g[0] === f[0] && g[1] === 2) ?? fits.find((g) => g[0] === f[0] && g[1] === 1) ?? f;
    }
    return [f[0], f[1]];
  }
  emit(kind, x, y, z, w, d, v) {
    const key = w <= d ? `${w}x${d}` : `${d}x${w}`; const id = SIZES[kind][key]; const def = partDef(id);
    this.parts.push({ id, x, y, z, rot: def.w === w ? 0 : 1, color: v.color, tag: v.tag, group: v.group, line: 'box()' });
    const idx = this.parts.length - 1; const hh = kind === 'brick' ? 3 : 1; for (let i = 0; i < w; i++) for (let k = 0; k < d; k++) for (let dy = 0; dy < hh; dy++) this.owner.set(`${x + i},${y + dy},${z + k}`, idx);
  }
  stats() { const ids = new Set(), colors = new Set(); for (const p of this.parts) { ids.add(p.id); colors.add(p.color); } return { parts: this.parts.length, types: ids.size, colors: colors.size }; }
}
function callerLine() { const s = new Error().stack?.split('\n') ?? []; const l = s.find((x) => /build\.mjs|sets\//.test(x)); const m = l && /:(\d+):\d+\)?$/.exec(l); return m ? `build.mjs:${m[1]}` : ''; }
export { footprint, CATALOG };
