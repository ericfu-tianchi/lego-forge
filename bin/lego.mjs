#!/usr/bin/env node
// lego — the toolkit's command line.
//   lego new <name>              start a set: sets/<name>/brief.md + build.mjs
//   lego build <set>             run build.mjs → check → sets/<set>/out/ (viewer .html, .ldr, parts .csv, report.txt)
//   lego shots <set> [--only t] [--ref img --view v]  review images → out/sheet.png (six views), out/hero.png; with --ref, out/compare.png
//                                (the reference beside a render; --view hero|front|back|left|right|top picks the angle that matches it)
//   lego parts [words…]          search the parts catalogue (id, size, studs)
//   lego gallery                 (maintainers) render docs/gallery/<category>.png — every part, labelled
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [cmd, ...rest] = process.argv.slice(2);
const setDir = (s) => { if (!s) usage(); const d = fs.existsSync(s) && fs.statSync(s).isDirectory() ? path.resolve(s) : path.join(ROOT, 'sets', s); if (!fs.existsSync(path.join(d, 'build.mjs'))) { console.error(`no build.mjs in ${d}`); process.exit(2); } return d; };
function usage() { console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 7).map((l) => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(1); }

if (cmd === 'build') {
  const dir = setDir(rest[0]); const out = path.join(dir, 'out'); fs.mkdirSync(out, { recursive: true });
  const { check, report } = await import('../engine/check.mjs'); const { html, ldr, bom, slug } = await import('../engine/export.mjs');
  let model; try { const mod = await import(pathToFileURL(path.join(dir, 'build.mjs')).href + '?t=' + Date.now()); model = typeof mod.default === 'function' ? await mod.default() : mod.default; }
  catch (e) { console.error('✗ build.mjs threw an error:\n' + (e.stack ?? e)); process.exit(1); }
  if (!model?.parts) { console.error('✗ build.mjs must `export default` the Model'); process.exit(1); }
  model.pack(); const res = check(model); const text = report(res);
  fs.writeFileSync(path.join(out, 'report.txt'), text + '\n'); console.log(text);
  fs.writeFileSync(path.join(out, 'set.html'), html(model, res.stats)); fs.writeFileSync(path.join(out, 'model.ldr'), ldr(model)); fs.writeFileSync(path.join(out, 'parts.csv'), bom(model));
  fs.writeFileSync(path.join(out, 'check.json'), JSON.stringify(res, null, 1));
  console.log(`→ ${path.relative(process.cwd(), path.join(out, 'set.html'))}  (open in a browser)`);
  process.exit(res.ok ? 0 : 1);
} else if (cmd === 'shots') {
  const dir = setDir(rest[0]); const out = path.join(dir, 'out'); const only = rest.includes('--only') ? rest[rest.indexOf('--only') + 1] : null;
  const page = path.join(out, 'set.html'); if (!fs.existsSync(page)) { console.error('run `lego build` first'); process.exit(1); }
  const rep = fs.existsSync(path.join(out, 'report.txt')) ? fs.readFileSync(path.join(out, 'report.txt'), 'utf8') : ''; if (rep.startsWith('FAIL')) console.log('! the last build FAILED the check — these images show a model that cannot be built as is');
  if (fs.statSync(path.join(dir, 'build.mjs')).mtimeMs > fs.statSync(page).mtimeMs) console.log('! build.mjs changed since the last build — run `lego build` first');
  let chromium; try { ({ chromium } = await import('playwright')); } catch { console.error('shots need Playwright: npm i -D playwright && npx playwright install chromium'); process.exit(1); }
  const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--use-gl=angle'] });
  const shot = async (q, file, w, h) => { const pg = await browser.newPage({ viewport: { width: w, height: h } }); await pg.goto(pathToFileURL(page).href + '?' + q); await pg.waitForFunction(() => window.__ready === true, null, { timeout: 120000 }); await pg.waitForTimeout(200); await pg.screenshot({ path: file }); await pg.close(); };
  const sfx = only ? `-${only}` : ''; const oq = only ? `&only=${encodeURIComponent(only)}` : '';
  await shot('sheet' + oq, path.join(out, `sheet${sfx}.png`), 1800, 1200);
  await shot('view=hero' + oq, path.join(out, `hero${sfx}.png`), 1200, 1200);
  const ref = rest.includes('--ref') ? path.resolve(rest[rest.indexOf('--ref') + 1]) : null; const view = rest.includes('--view') ? rest[rest.indexOf('--view') + 1] : 'hero';
  if (ref) {
    await shot(`view=${view}&still` + oq, path.join(out, 'view.png'), 1200, 1200);
    const pg = await browser.newPage({ viewport: { width: 2400, height: 1200 } });
    const b64 = (f) => 'data:image/png;base64,' + fs.readFileSync(f).toString('base64'); const ext = path.extname(ref).slice(1).toLowerCase().replace('jpg', 'jpeg');
    await pg.setContent(`<body style="margin:0;display:flex;background:#f2f0ea"><div style="width:1200px;height:1200px;display:flex;align-items:center;justify-content:center"><img style="max-width:1200px;max-height:1200px" src="data:image/${ext};base64,${fs.readFileSync(ref).toString('base64')}"></div><img style="width:1200px;height:1200px" src="${b64(path.join(out, 'view.png'))}"></body>`);
    await pg.waitForTimeout(300); await pg.screenshot({ path: path.join(out, 'compare.png') }); await pg.close(); console.log(`→ ${path.relative(process.cwd(), path.join(out, 'compare.png'))} (reference | render, view ${view})`);
  }
  await browser.close(); console.log(`→ ${path.relative(process.cwd(), path.join(out, `sheet${sfx}.png`))}, hero${sfx}.png`);
} else if (cmd === 'parts') {
  const { CATALOG } = await import('../engine/catalog.mjs'); const words = rest.map((w) => w.toLowerCase());
  const hits = Object.values(CATALOG).filter((p) => words.every((w) => `${p.id} ${p.name} ${p.cat}`.toLowerCase().includes(w)));
  for (const p of hits.slice(0, 80)) console.log(`${p.id.padEnd(11)} ${p.name.slice(0, 60).padEnd(60)} ${p.w}×${p.d} · ${p.h}p · ${p.studs.length} studs${p.female.length ? '' : ' · no anti-studs'}`);
  if (hits.length > 80) console.log(`… ${hits.length - 80} more — narrow the search`);
} else if (cmd === 'gallery') {
  const { CATALOG } = await import('../engine/catalog.mjs'); const { chromium } = await import('playwright');
  const js = fs.readFileSync(path.join(ROOT, 'viewer/dist/gallery.js'), 'utf8'); fs.mkdirSync(path.join(ROOT, 'docs/gallery'), { recursive: true });
  const cats = [...new Set(Object.values(CATALOG).map((p) => p.cat))]; const browser = await chromium.launch({ args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] });
  for (const cat of cats) {
    const parts = Object.values(CATALOG).filter((p) => p.cat === cat && !/^Moved/.test(p.name)).map((p) => ({ id: p.id, name: p.name.slice(0, 34), geo: JSON.parse(fs.readFileSync(path.join(ROOT, 'engine/parts/geo', p.id + '.json'), 'utf8')) }));
    const H = Math.ceil(parts.length / 6) * 260 + 60; const pg = await browser.newPage({ viewport: { width: 1560, height: H } });
    await pg.setContent(`<html><body style="margin:0;background:#f2f0ea;font:13px -apple-system,Helvetica,sans-serif;color:#333"><canvas id="c" style="position:absolute;left:0;top:0"></canvas><div id="labels"></div><style>#labels div{position:absolute;text-align:center;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:0 6px;box-sizing:border-box}#labels h1{position:absolute;left:16px;top:6px;margin:0;font-size:22px}</style><script>window.GALLERY=${JSON.stringify({ title: cat, parts })}</script><script>${js}</script></body></html>`);
    await pg.waitForFunction(() => window.__ready === true, null, { timeout: 120000 }); await pg.screenshot({ path: path.join(ROOT, 'docs/gallery', cat + '.png'), fullPage: true }); await pg.close(); console.log(`docs/gallery/${cat}.png (${parts.length})`);
  }
  await browser.close();
} else if (cmd === 'new') {
  const name = rest[0]; if (!name) usage(); const d = path.join(ROOT, 'sets', name); if (fs.existsSync(d)) { console.error(`${d} exists`); process.exit(1); }
  fs.mkdirSync(d, { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'templates/brief.md'), path.join(d, 'brief.md')); fs.copyFileSync(path.join(ROOT, 'templates/build.mjs'), path.join(d, 'build.mjs'));
  console.log(`→ sets/${name}/brief.md, build.mjs`);
} else usage();
