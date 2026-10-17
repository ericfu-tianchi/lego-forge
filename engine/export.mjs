// Outputs of a set: the viewer page (one self-contained .html), an LDraw model (.ldr — opens in BrickLink Studio, LDCad, LeoCAD),
// a parts list (.csv) and the model data (.json).
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { resolve, part as partDef } from './catalog.mjs';
import { colorInfo } from './colors.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function instances(model) {
  return model.parts.map((p) => { const r = resolve(p); const c = colorInfo(p.color); const o = r.origin;
    return [r.def.id, c.hex, c.alpha, +o[0].toFixed(4), +o[1].toFixed(4), +o[2].toFixed(4), ...r.m.map((v) => +v.toFixed(5)), p.tag || '']; });
}
export function html(model, stats) {
  const inst = instances(model); const ids = [...new Set(inst.map((r) => r[0]))];
  const geo = {}; for (const id of ids) { const g = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine/parts/geo', id + '.json'), 'utf8')); if (partDef(id).ds) g.ds = true; geo[id] = g; }
  const SET = { meta: { title: model.meta.title, subtitle: model.meta.subtitle, parts: stats.parts, colors: stats.colors }, geo, inst };
  const tpl = fs.readFileSync(path.join(ROOT, 'viewer/template.html'), 'utf8'); const js = fs.readFileSync(path.join(ROOT, 'viewer/dist/viewer.js'), 'utf8');
  return tpl.replace('/*SET*/null', () => JSON.stringify(SET)).replace('/*VIEWER*/', () => js.replace(/<\/script/g, '<\\/script'));
}
export function ldr(model) {
  const L = [`0 ${model.meta.title}`, `0 Name: ${slug(model.meta.title)}.ldr`, '0 Author: lego-forge', '0 !LICENSE Parts © LDraw.org contributors, CC BY 2.0', ''];
  for (const p of model.parts) { const r = resolve(p); const c = colorInfo(p.color); const o = r.origin, m = r.m;
    // ours → LDraw: x·20, −y·20, −z·20; the rotation conjugated by diag(1, −1, −1)
    const s = [1, -1, -1]; const M = m.map((v, k) => v * s[Math.floor(k / 3)] * s[k % 3]);
    L.push(`1 ${c.code} ${f(o[0] * 20)} ${f(-o[1] * 20)} ${f(-o[2] * 20)} ${M.map(f).join(' ')} ${r.def.id}.dat`); }
  return L.join('\n') + '\n';
}
export function bom(model) {
  const n = new Map(); for (const p of model.parts) { const k = `${p.id}|${p.color}`; n.set(k, (n.get(k) ?? 0) + 1); }
  return 'part,name,colour,quantity\n' + [...n].sort((a, b) => b[1] - a[1]).map(([k, q]) => { const [id, c] = k.split('|'); return `${id},"${partDef(id).name}",${c},${q}`; }).join('\n') + '\n';
}
const f = (v) => { const r = Math.round(v * 1000) / 1000; return Object.is(r, -0) ? '0' : String(r); };
export const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'set';
