#!/usr/bin/env node
// lego — the toolkit's command line. Works from any folder; sets live in ./lego-sets/<name> (or sets/<name> inside this repo).
//   lego guide                   print the instructions for the agent (AGENTS.md) — start here
//   lego docs <rubric|techniques|colors|parts>   print a reference document
//   lego example <cottage|retro-computer>        copy a worked example into your sets folder (build.mjs + renders)
//   lego new <name>              start a set: <sets>/<name>/brief.md + build.mjs
//   lego build <set>             run build.mjs → check → <set>/out/ (set.html, model.ldr, parts.csv, report.txt)
//   lego shots <set> [--only t] [--ref img --view v]  review images → out/sheet.png (six views), out/hero.png; with --ref, out/compare.png
//   lego parts [words…]          search the parts catalogue (id, size, studs)
//   lego part <id>               one part, top view: where its studs and anti-studs are, which way it faces
//   lego open <set>              open the finished set in the browser and print its link
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url'; import { execSync } from 'node:child_process';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [cmd, ...rest] = process.argv.slice(2);
// first run from a fresh copy: install the two dependencies quietly
if (!fs.existsSync(path.join(ROOT, 'node_modules/three'))) { console.error('· first run: installing dependencies…'); execSync('npm install --omit=dev --no-audit --no-fund --silent', { cwd: ROOT, stdio: 'inherit' }); }
const inside = (p) => !path.relative(ROOT, p).startsWith('..');
const SETS = process.env.LEGO_SETS ? path.resolve(process.env.LEGO_SETS) : inside(process.cwd()) ? path.join(ROOT, 'sets') : path.join(process.cwd(), 'lego-sets');
const setDir = (s) => { if (!s) usage(); const cands = [path.resolve(s), path.join(SETS, s), path.join(ROOT, 'sets', s)]; const d = cands.find((c) => fs.existsSync(path.join(c, 'build.mjs'))); if (!d) { console.error(`no build.mjs for "${s}" (looked in ${cands.join(', ')})`); process.exit(2); } return d; };
function usage() { console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 12).map((l) => l.replace(/^\/\/ ?/, '')).join('\n')); process.exit(1); }
const DOCS = { rubric: 'docs/RUBRIC.md', techniques: 'docs/TECHNIQUES.md', colors: 'docs/COLORS.md', colours: 'docs/COLORS.md', parts: 'docs/PARTS.md' };

if (cmd === 'build') {
  const dir = setDir(rest[0]); const out = path.join(dir, 'out'); fs.mkdirSync(out, { recursive: true });
  const { check, report } = await import('../engine/check.mjs'); const { html, ldr, bom, slug } = await import('../engine/export.mjs');
  let model; try { const mod = await import(pathToFileURL(path.join(dir, 'build.mjs')).href + '?t=' + Date.now());
    const { Model } = await import('../engine/model.mjs'); const kit = await import('../engine/kit.mjs');
    model = typeof mod.default === 'function' ? await mod.default({ Model, kit }) : mod.default; }
  catch (e) { console.error('✗ build.mjs threw an error:\n' + (e.stack ?? e)); process.exit(1); }
  if (!model?.parts) { console.error('✗ build.mjs must `export default function build({ Model, kit }) { … return m; }`'); process.exit(1); }
  model.pack(); const res = check(model); const text = report(res);
  fs.writeFileSync(path.join(out, 'report.txt'), text + '\n'); console.log(text);
  fs.writeFileSync(path.join(out, 'set.html'), html(model, res.stats)); fs.writeFileSync(path.join(out, 'model.ldr'), ldr(model)); fs.writeFileSync(path.join(out, 'parts.csv'), bom(model));
  fs.writeFileSync(path.join(out, 'check.json'), JSON.stringify(res, null, 1));
  console.log(`→ ${pathToFileURL(path.join(out, 'set.html')).href}`);
  process.exit(res.ok ? 0 : 1);
} else if (cmd === 'shots') {
  const dir = setDir(rest[0]); const out = path.join(dir, 'out'); const only = rest.includes('--only') ? rest[rest.indexOf('--only') + 1] : null;
  const page = path.join(out, 'set.html'); if (!fs.existsSync(page)) { console.error('run `lego build` first'); process.exit(1); }
  const rep = fs.existsSync(path.join(out, 'report.txt')) ? fs.readFileSync(path.join(out, 'report.txt'), 'utf8') : ''; if (rep.startsWith('FAIL')) console.log('! the last build FAILED the check — these images show a model that cannot be built as is');
  if (fs.statSync(path.join(dir, 'build.mjs')).mtimeMs > fs.statSync(page).mtimeMs) console.log('! build.mjs changed since the last build — run `lego build` first');
  let chromium; try { ({ chromium } = await import('playwright')); } catch { console.error('shots need Playwright: npm i -D playwright && npx playwright install chromium'); process.exit(1); }
  // GPU first; then a software renderer without Chromium's own sandbox (agent sandboxes such as Codex's often block Chromium's)
  const ARGS = [['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist', '--use-gl=angle'], ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader']];
  const launch = async () => { let last; for (const args of ARGS) { try { return await chromium.launch({ args, chromiumSandbox: false }); } catch (e) { last = e; } } throw last; };
  let browser; try { browser = await launch(); } catch (e) {
    if (/Executable doesn't exist|install/i.test(String(e))) { console.error('· first run: downloading the headless browser for renders…'); try { execSync('npx playwright install chromium', { cwd: ROOT, stdio: 'inherit' }); browser = await launch(); } catch (e2) { e = e2; } }
    if (!browser) { console.error(`✗ RENDERING IS BLOCKED IN THIS ENVIRONMENT — the review images could not be made.\n  ${String(e).split('\n')[0]}\n\n  STOP and ask the user now, before building further: the review loop needs these images.\n  Tell them: "I can't run the headless browser for review renders here. Please allow it — approve running \`lego shots\` with full permissions (Codex: allow the command outside the sandbox / restart with --sandbox danger-full-access; Claude Code: approve the command)."\n  Do not deliver a set you have not looked at.`); process.exit(3); }
  }
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
  const txt = (p) => `${p.id} ${p.name} ${p.cat}`.toLowerCase(); let hits = Object.values(CATALOG).filter((p) => words.every((w) => txt(p).includes(w)));
  if (!hits.length && words.length > 1) { hits = Object.values(CATALOG).filter((p) => words.some((w) => txt(p).includes(w))); if (hits.length) console.log(`(no part matches all of "${words.join(' ')}" — parts matching any of them:)`); }
  if (!hits.length) console.log(`no part matches "${words.join(' ')}". Build it from basic parts (see docs/TECHNIQUES.md), or look at docs/gallery/*.png for a part that has the shape you need.`);
  for (const p of hits.slice(0, 80)) console.log(`${p.id.padEnd(11)} ${p.name.slice(0, 60).padEnd(60)} ${p.w}×${p.d} · ${p.h}p · ${p.studs.length} studs${p.female.length ? '' : ' · no anti-studs'}`);
  if (hits.length > 80) console.log(`… ${hits.length - 80} more — narrow the search`);
} else if (cmd === 'part') {
  const { part } = await import('../engine/catalog.mjs'); const p = part(rest[0] ?? ''); if (!p) { console.error(`no part ${rest[0]} — search with: lego parts <words>`); process.exit(1); }
  console.log(`${p.id} · ${p.name} · ${p.cat}\nfootprint at rot 0: ${p.w} along x × ${p.d} along z · ${p.h} plates tall (${(p.h / 3).toFixed(2)} bricks)`);
  const cell = (x, z, list) => list.some(([a, b]) => Math.abs(a - x) < 0.05 && Math.abs(b - z) < 0.05);
  const grid = (title, list, mark) => { console.log(`\n${title}   (top view, x → right, z ↓ = towards the front)`); for (let j = 0; j < p.d; j++) { let row = '  '; for (let i = 0; i < p.w; i++) { const x = -p.w / 2 + i + 0.5, z = -p.d / 2 + j + 0.5; const filled = p.cols.some(([a, b]) => Math.abs(a - x) < 0.05 && Math.abs(b - z) < 0.05); row += cell(x, z, list) ? ` ${mark} ` : filled ? ' · ' : '   '; } console.log(row); } };
  grid('studs on top  (o = stud, · = no stud)', p.studs.map((s) => [s[0], s[1]]), 'o'); grid('anti-studs underneath  (x = takes a stud from below)', p.female, 'x');
  const off = p.studs.filter((s) => !p.cols.some(([a, b]) => Math.abs(a - s[0]) < 0.05 && Math.abs(b - s[1]) < 0.05)); if (off.length) console.log(`\nstuds between cells (centred): ${off.map((s) => `(${s[0]}, ${s[1]}) from the centre`).join(', ')} — parts above line up with them, not with the cells`);
  const lowTop = p.studs.filter((s) => Math.abs(s[2] - p.h) > 0.05); if (lowTop.length) console.log(`studs below the top: at ${[...new Set(lowTop.map((s) => s[2]))].join(', ')} plates`);
  if (!p.female.length) console.log('\n! no anti-studs: this part cannot sit on studs (it hangs on a clip, bar or pin) — kits place such parts');
  if (/slope|curve/.test(p.cat)) { let gx = 0, gz = 0; const my = p.cols.reduce((a, c) => a + c[3], 0) / p.cols.length; for (const [x, z, , y1] of p.cols) { gx += x * (y1 - my); gz += z * (y1 - my); } if (Math.hypot(gx, gz) > 0.2) console.log(`slope: at rot 0 the face drops towards ${Math.abs(gz) >= Math.abs(gx) ? (gz > 0 ? '−z (back)' : '+z (front)') : gx > 0 ? '−x (left)' : '+x (right)'}; rot turns that direction a quarter at a time: rot 0 front, 1 right, 2 back, 3 left (for a part that faces front at rot 0)`); }
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
} else if (cmd === 'open') {
  const page = path.join(setDir(rest[0]), 'out', 'set.html'); if (!fs.existsSync(page)) { console.error('run `lego build` first'); process.exit(1); }
  const url = pathToFileURL(page).href; const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start ""' : 'xdg-open';
  try { execSync(`${opener} "${page}"`, { stdio: 'ignore' }); } catch {}
  console.log(url);
} else if (cmd === 'guide') {
  console.log(fs.readFileSync(path.join(ROOT, 'AGENTS.md'), 'utf8').replaceAll('node bin/lego.mjs', 'lego') + `\n\n(toolkit folder: ${ROOT} — run the CLI as \`node ${path.join(ROOT, 'bin/lego.mjs')} …\` if \`lego\` is not on your PATH; sets go to ${SETS})`);
} else if (cmd === 'docs') {
  const f = DOCS[(rest[0] ?? '').toLowerCase()]; if (!f) { console.error(`lego docs ${Object.keys(DOCS).join('|')}`); process.exit(1); } console.log(fs.readFileSync(path.join(ROOT, f), 'utf8'));
} else if (cmd === 'example') {
  const n = rest[0]; const src = path.join(ROOT, 'examples', n ?? ''); if (!n || !fs.existsSync(src)) { console.error(`lego example ${fs.readdirSync(path.join(ROOT, 'examples')).join('|')}`); process.exit(1); }
  const d = path.join(SETS, '_examples', n); fs.mkdirSync(d, { recursive: true }); fs.cpSync(src, d, { recursive: true });
  console.log(`→ ${d}/build.mjs and ${d}/out/hero.png — read the build, look at the render`);
} else if (cmd === 'new') {
  const name = rest[0]; if (!name) usage(); const d = path.join(SETS, name); if (fs.existsSync(d)) { console.error(`${d} exists`); process.exit(1); }
  fs.mkdirSync(d, { recursive: true });
  fs.copyFileSync(path.join(ROOT, 'templates/brief.md'), path.join(d, 'brief.md')); fs.copyFileSync(path.join(ROOT, 'templates/build.mjs'), path.join(d, 'build.mjs'));
  console.log(`→ ${path.relative(process.cwd(), d) || d}/brief.md, build.mjs`);
} else usage();
