// The buildability check. A set passes only if every part is a real part in a real colour, nothing passes through anything else,
// and every part is held by real stud connections to one single structure (nothing loose, nothing floating).
// Messages are written so the builder can act on them directly: what is wrong, where (line in build.mjs, grid position), what to do.
import { resolve, part as partDef } from './catalog.mjs';

const EPS = 0.06;      // studs: positions must match this closely
const VSKIN = 0.25;    // plates: overlap tolerated vertically (rounded edges, a stud inside the part above)
const HSKIN = 0.12;    // studs: overlap tolerated sideways for exact-transform parts (minifigures)

export function check(model) {
  const parts = model.parts; const R = parts.map((p) => resolve(p));
  const issues = []; const add = (level, i, msg, hint) => issues.push({ level, part: i, msg, hint, where: i == null ? '' : where(parts[i]) });
  for (const e of model.errors) issues.push({ level: 'error', part: null, msg: e, hint: '', where: '' });

  // ---- grid hygiene
  parts.forEach((p, i) => { if (p.free) return; const half = (v) => Math.abs(v * 2 - Math.round(v * 2)) > 1e-6;
    if (half(p.x) || half(p.z)) add('error', i, `${label(p)} sits off the stud grid (x ${p.x}, z ${p.z})`, 'x and z are whole studs (half studs only on a jumper plate)');
    if (Math.abs(p.y - Math.round(p.y)) > 1e-6) add('error', i, `${label(p)} is between plate levels (y ${p.y})`, 'y counts plates: whole numbers only');
    if (p.y < 0) add('error', i, `${label(p)} is below the ground (y ${p.y})`, 'the lowest layer is y = 0'); });

  // ---- collisions: grid columns against grid columns, exact-transform boxes against everything
  const cells = new Map(); const key = (x, z) => `${Math.round(x * 2)},${Math.round(z * 2)}`;
  R.forEach((r, i) => r.cols.forEach(([x, z, a, b]) => { const k = key(x, z); if (!cells.has(k)) cells.set(k, []); cells.get(k).push([i, a, b]); }));
  const clash = new Set();
  for (const list of cells.values()) for (let u = 0; u < list.length; u++) for (let v = u + 1; v < list.length; v++) {
    const [i, a, b] = list[u], [j, c, d] = list[v]; if (i === j || sameGroup(parts[i], parts[j])) continue;
    if (Math.min(b, d) - Math.max(a, c) > VSKIN) { const k = i < j ? `${i}|${j}` : `${j}|${i}`; if (clash.has(k)) continue; clash.add(k);
      add('error', j, `${label(parts[j])} passes through ${label(parts[i])} (${where(parts[i])})`, 'two parts cannot share space — move one, or remove it'); }
  }
  const freeIdx = R.map((r, i) => (r.free ? i : -1)).filter((i) => i >= 0);
  for (const i of freeIdx) { const A = R[i].aabb;
    for (let j = 0; j < parts.length; j++) { if (j === i || sameGroup(parts[i], parts[j])) continue; const r = R[j];
      const hits = r.free ? boxHit(A, r.aabb) : r.cols.some(([x, z, a, b]) => boxHit(A, [x - 0.5, a * 0.4, z - 0.5, x + 0.5, b * 0.4, z + 0.5]));
      if (hits && (r.free ? i < j : true)) { const k = i < j ? `${i}|${j}` : `${j}|${i}`; if (clash.has(k)) continue; clash.add(k); add('error', i, `${label(parts[i])} passes through ${label(parts[j])} (${where(parts[j])})`, 'leave a clear stud of room around a minifigure'); } } }

  // ---- connections: a stud of a part below plugs into an anti-stud of a part whose bottom is exactly at the stud's base
  const adj = parts.map(() => new Set()); const link = (a, b) => { adj[a].add(b); adj[b].add(a); };
  const byBottom = new Map(); R.forEach((r, i) => { if (r.free) return; const y = parts[i].y; if (!byBottom.has(y)) byBottom.set(y, []); byBottom.get(y).push(i); });
  R.forEach((r, i) => { for (const [sx, sz, sy] of r.studs) { const above = byBottom.get(Math.round(sy * 1000) / 1000) ?? byBottom.get(Math.round(sy)); if (!above || Math.abs(sy - Math.round(sy)) > 0.02) continue;
    for (const j of above) { if (j === i) continue; const f = R[j].female; if (f.some(([x, z]) => Math.abs(x - sx) < EPS && Math.abs(z - sz) < EPS) || tube(f, sx, sz)) link(i, j); } } });
  // a rigid unit is connected inside itself
  const groups = new Map(); parts.forEach((p, i) => { if (!p.group) return; if (!groups.has(p.group)) groups.set(p.group, []); groups.get(p.group).push(i); });
  for (const g of groups.values()) for (let k = 1; k < g.length; k++) link(g[0], g[k]);
  // components
  const comp = new Array(parts.length).fill(-1); let n = 0; const sizes = [];
  for (let s = 0; s < parts.length; s++) { if (comp[s] >= 0) continue; const st = [s]; comp[s] = n; let c = 0; while (st.length) { const a = st.pop(); c++; for (const b of adj[a]) if (comp[b] < 0) { comp[b] = n; st.push(b); } } sizes.push(c); n++; }
  const main = sizes.indexOf(Math.max(...sizes));
  const loose = new Map(); parts.forEach((p, i) => { if (comp[i] !== main) { if (!loose.has(comp[i])) loose.set(comp[i], []); loose.get(comp[i]).push(i); } });
  for (const list of loose.values()) {
    const i = list[0]; const what = list.length === 1 ? label(parts[i]) : `${list.length} parts (${label(parts[i])} …)`;
    const onGround = list.some((j) => !parts[j].free && parts[j].y === 0);
    add('error', i, `${what} ${list.length === 1 ? 'is' : 'are'} not connected to the rest of the set${onGround ? ' (standing loose on the table)' : ''}`,
      R[i].female.length || R[i].free ? 'put it on studs: its bottom must sit exactly on top of a part below, over that part\'s studs' : 'this part has no anti-studs underneath — it can only hang on a clip or bar; use a different part');
  }

  // ---- size and character
  const st = model.stats(); const [lo, hi] = model.meta.budget;
  if (st.parts > hi) add('error', null, `${st.parts} parts — over the budget of ${hi}`, 'simplify: fewer filler bricks inside, larger plates under floors');
  if (st.parts < lo) add('warn', null, `${st.parts} parts — under ${lo}: likely too plain`, 'add the details that make the subject recognisable');
  const special = parts.filter((p) => !/^(brick|plate)$/.test(partDef(p.id).cat)).length / Math.max(1, parts.length);
  if (special < 0.12 && parts.length > 100) add('warn', null, `only ${(special * 100).toFixed(0)}% of the parts are not plain bricks/plates`, 'use slopes, tiles, round parts, windows, plants and details: they are what make a set look designed');
  if (st.colors > 12) add('warn', null, `${st.colors} colours — busy`, 'a strong set uses 4–8 colours');
  const errors = issues.filter((x) => x.level === 'error').length;
  return { ok: errors === 0, errors, warnings: issues.length - errors, issues, stats: { ...st, specialShare: +special.toFixed(2), components: n } };
}
const sameGroup = (a, b) => !!a.group && a.group === b.group;
const boxHit = (A, B) => Math.min(A[3], B[3]) - Math.max(A[0], B[0]) > HSKIN && Math.min(A[5], B[5]) - Math.max(A[2], B[2]) > HSKIN && Math.min(A[4], B[4]) - Math.max(A[1], B[1]) > VSKIN * 0.4;
/** the tube between four anti-stud cells of a 2-wide part takes a stud too */
const tube = (f, x, z) => [[-0.5, -0.5], [0.5, -0.5], [-0.5, 0.5], [0.5, 0.5]].every(([a, b]) => f.some(([fx, fz]) => Math.abs(fx - (x + a)) < EPS && Math.abs(fz - (z + b)) < EPS));
export function label(p) { const d = partDef(p.id); return `${d ? d.name.replace(/\s+/g, ' ') : p.id} [${p.id}] ${p.color}`; }
export function where(p) { return `${p.line ? p.line + ' ' : ''}${p.free ? 'kit' : `at x ${p.x} y ${p.y} z ${p.z}${p.rot ? ` rot ${p.rot}` : ''}`}${p.tag ? ` · ${p.tag}` : ''}`; }
export function report(res) {
  const L = [`${res.ok ? 'PASS' : 'FAIL'} · ${res.stats.parts} parts · ${res.stats.types} kinds · ${res.stats.colors} colours · ${res.errors} errors · ${res.warnings} warnings`];
  const shown = res.issues.slice(0, 40);
  for (const x of shown) L.push(`${x.level === 'error' ? '✗' : '!'} ${x.msg}${x.where ? `\n    ${x.where}` : ''}${x.hint ? `\n    → ${x.hint}` : ''}`);
  if (res.issues.length > shown.length) L.push(`… and ${res.issues.length - shown.length} more`);
  return L.join('\n');
}
