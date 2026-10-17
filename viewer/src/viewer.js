// The set viewer: one self-contained page per set. Real LDraw geometry, instanced; drag to turn, scroll to zoom;
// Take apart (the bricks burst and drift) and Rebuild (they rain back into place, bottom layer first).
// URL options: ?sheet (six review views in one image) · ?view=hero|front|back|left|right|top · ?only=<tag> · ?still (no intro, no idle spin)
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const SET = window.SET; const Q = new URLSearchParams(location.search);
const SHEET = Q.has('sheet'), STILL = Q.has('still') || SHEET || Q.has('view'), ONLY = Q.get('only');

// ---- renderer, scene, light -------------------------------------------------------------------------------------------------
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: STILL });
renderer.setPixelRatio(Math.min(2, devicePixelRatio)); renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer); scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.add(new THREE.HemisphereLight(0xffffff, 0xb9b2a6, 0.55));
const sun = new THREE.DirectionalLight(0xffffff, 1.6); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02; scene.add(sun, sun.target);
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 2000);

// ---- geometry --------------------------------------------------------------------------------------------------------------
const bytes = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
function decode(g) {
  if (!g) return null; const P = new Int16Array(bytes(g.pos).buffer), N = new Int8Array(bytes(g.nrm).buffer), ib = bytes(g.idx);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(Float32Array.from(P, (v) => v / g.q), 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(Float32Array.from(N, (v) => v / 127), 3));
  if (g.col) geo.setAttribute('color', new THREE.BufferAttribute(Float32Array.from(bytes(g.col), (v) => v / 255), 3));
  geo.setIndex(new THREE.BufferAttribute(g.i32 ? new Uint32Array(ib.buffer) : new Uint16Array(ib.buffer), 1)); return geo;
}
/** shrink a part by a hair about its own centre so the seams between bricks read, as they do on a real model */
function seam(geos) { const b = new THREE.Box3(); for (const g of geos) if (g) { g.computeBoundingBox(); b.union(g.boundingBox); } const c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3()); const k = [s.x, s.y, s.z].map((v) => (v > 0.1 ? (v - 0.018) / v : 1));
  for (const g of geos) if (g) { const P = g.attributes.position.array; for (let i = 0; i < P.length; i += 3) { P[i] = c.x + (P[i] - c.x) * k[0]; P[i + 1] = c.y + (P[i + 1] - c.y) * k[1]; P[i + 2] = c.z + (P[i + 2] - c.z) * k[2]; } g.computeBoundingBox(); } }
const GEO = {}; for (const [id, g] of Object.entries(SET.geo)) { GEO[id] = { main: decode(g.main), deco: decode(g.deco), glass: decode(g.glass), ds: g.ds }; seam([GEO[id].main, GEO[id].deco, GEO[id].glass]); }

// ---- instances --------------------------------------------------------------------------------------------------------------
// SET.inst: [id, '#rrggbb', alpha, x, y, z, m0..m8, tag] — the LDraw origin of each part and its rotation, in studs (y up)
const items = SET.inst.filter((r) => !ONLY || r[15] === ONLY).map((r, i) => {
  const m = new THREE.Matrix4().set(r[6], r[7], r[8], 0, r[9], r[10], r[11], 0, r[12], r[13], r[14], 0, 0, 0, 0, 1);
  const pos = new THREE.Vector3(r[3], r[4], r[5]); const quat = new THREE.Quaternion().setFromRotationMatrix(m);
  return { id: r[0], hex: r[1], alpha: r[2], home: { pos, quat }, i };
});
const box = new THREE.Box3(); for (const it of items) box.expandByPoint(it.home.pos); for (const it of items) { const b = GEO[it.id].main?.boundingBox; }
// a precise box: every part's geometry bounds
{ box.makeEmpty(); const tmp = new THREE.Box3(), M = new THREE.Matrix4(); for (const it of items) { const g = GEO[it.id].main ?? GEO[it.id].deco ?? GEO[it.id].glass; g.computeBoundingBox(); M.compose(it.home.pos, it.home.quat, new THREE.Vector3(1, 1, 1)); tmp.copy(g.boundingBox).applyMatrix4(M); box.union(tmp); } }
const center = box.getCenter(new THREE.Vector3()); const size = box.getSize(new THREE.Vector3()); const radius = size.length() / 2;
for (const it of items) it.home.pos.sub(new THREE.Vector3(center.x, box.min.y, center.z));   // model stands on y = 0, centred
const groupKey = (it) => `${it.id}|${it.alpha < 1 ? 't' : 'o'}`;
const batches = new Map(); for (const it of items) { const k = groupKey(it); if (!batches.has(k)) batches.set(k, []); batches.get(k).push(it); }
const matO = new THREE.MeshStandardMaterial({ roughness: 0.32, metalness: 0, envMapIntensity: 0.75 });
const matDS = matO.clone(); matDS.side = THREE.DoubleSide;
const matT = new THREE.MeshPhysicalMaterial({ roughness: 0.05, metalness: 0, transparent: true, opacity: 0.55, envMapIntensity: 1.3, depthWrite: false });
const matGlass = new THREE.MeshPhysicalMaterial({ roughness: 0.05, metalness: 0, transparent: true, opacity: 0.5, vertexColors: true, envMapIntensity: 1.3, depthWrite: false });
const matDeco = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0, vertexColors: true, envMapIntensity: 0.75, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
const meshes = []; const col = new THREE.Color();
for (const [k, list] of batches) {
  const g = GEO[list[0].id]; const trans = k.endsWith('|t');
  if (g.main) { const mesh = new THREE.InstancedMesh(g.main, trans ? matT : g.ds ? matDS : matO, list.length); mesh.castShadow = !trans; mesh.receiveShadow = true; mesh.frustumCulled = false;
    list.forEach((it, j) => { col.set(it.hex); if (trans) col.multiplyScalar(1.0); mesh.setColorAt(j, col); it.slots = [[mesh, j]]; }); if (trans) mesh.renderOrder = 2; scene.add(mesh); meshes.push(mesh); }
  if (g.glass) { const mesh = new THREE.InstancedMesh(g.glass, matGlass, list.length); mesh.renderOrder = 2; mesh.frustumCulled = false; list.forEach((it, j) => { (it.slots ??= []).push([mesh, j]); }); scene.add(mesh); meshes.push(mesh); }
  if (g.deco) { const mesh = new THREE.InstancedMesh(g.deco, matDeco, list.length); mesh.castShadow = true; mesh.receiveShadow = true; mesh.frustumCulled = false;
    list.forEach((it, j) => { (it.slots ??= []).push([mesh, j]); }); scene.add(mesh); meshes.push(mesh); }
}
const M4 = new THREE.Matrix4(), ONE = new THREE.Vector3(1, 1, 1);
function pose(it, pos, quat, s = 1) { M4.compose(pos, quat, s === 1 ? ONE : new THREE.Vector3(s, s, s)); for (const [mesh, j] of it.slots) mesh.setMatrixAt(j, M4); }
function commit() { for (const m of meshes) m.instanceMatrix.needsUpdate = true; }
for (const it of items) pose(it, it.home.pos, it.home.quat); commit();

// ground: a soft shadow catcher
const ground = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.ShadowMaterial({ opacity: 0.18 })); ground.rotation.x = -Math.PI / 2; ground.scale.setScalar(radius * 8); ground.receiveShadow = true; scene.add(ground);
sun.position.set(radius * 1.2, radius * 2.2, radius * 1.6); sun.target.position.set(0, size.y * 0.3, 0);
const sc = sun.shadow.camera; sc.left = sc.bottom = -radius * 1.6; sc.right = sc.top = radius * 1.6; sc.near = 0.1; sc.far = radius * 8; sc.updateProjectionMatrix();

// ---- camera ------------------------------------------------------------------------------------------------------------------
const target = new THREE.Vector3(0, size.y * 0.42, 0);
const fitDist = (fov, aspect) => { const vf = THREE.MathUtils.degToRad(fov) / 2, hf = Math.atan(Math.tan(vf) * aspect); return (radius * 0.92) / Math.sin(Math.min(vf, hf)); };
const VIEWS = { hero: [0.62, 0.42], front: [0, 0.12], back: [Math.PI, 0.12], left: [-Math.PI / 2, 0.12], right: [Math.PI / 2, 0.12], top: [0.0001, 1.5], hero2: [-2.4, 0.5] };
function place(cam, az, el, aspect, k = 1) { const d = fitDist(cam.fov, aspect) * k; cam.position.set(target.x + Math.sin(az) * Math.cos(el) * d, target.y + Math.sin(el) * d, target.z + Math.cos(az) * Math.cos(el) * d); cam.lookAt(target); }
const controls = new OrbitControls(camera, canvas); controls.target.copy(target); controls.enableDamping = true; controls.dampingFactor = 0.08; controls.minDistance = radius * 0.6; controls.maxDistance = radius * 6; controls.maxPolarAngle = Math.PI * 0.49;
controls.autoRotate = !STILL; controls.autoRotateSpeed = 0.6;

function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();
const [az0, el0] = VIEWS[Q.get('view') ?? 'hero'] ?? VIEWS.hero; place(camera, az0, el0, camera.aspect, 1.0); controls.update();

// ---- take apart / rebuild ----------------------------------------------------------------------------------------------------
// state: 'built' | 'apart' | 'rebuilding'. Both motions are closed-form functions of time, so they look the same on every machine.
let state = 'built', t0 = 0; const clock = new THREE.Clock();
const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
items.forEach((it) => {
  const p = it.home.pos; const dir = new THREE.Vector3(p.x, 0, p.z); if (dir.lengthSq() < 1e-4) dir.set(rnd(it.i, 1) - 0.5, 0, rnd(it.i, 2) - 0.5); dir.normalize();
  const sp = 0.8 + rnd(it.i, 3) * 1.4; it.vel = new THREE.Vector3(dir.x * sp * radius * 0.5, (0.4 + rnd(it.i, 4) * 0.9) * radius * 0.45 + (p.y / Math.max(1, size.y)) * radius * 0.3, dir.z * sp * radius * 0.5);
  it.spin = new THREE.Vector3(rnd(it.i, 5) - 0.5, rnd(it.i, 6) - 0.5, rnd(it.i, 7) - 0.5).normalize(); it.rate = 0.6 + rnd(it.i, 8) * 1.6;
  it.drift = new THREE.Vector3(rnd(it.i, 9) - 0.5, rnd(it.i, 10) - 0.5, rnd(it.i, 11) - 0.5).multiplyScalar(radius * 0.02);
});
const tmpP = new THREE.Vector3(), tmpQ = new THREE.Quaternion(), spinQ = new THREE.Quaternion();
function apartPose(it, t) {   // burst out fast, slow to a drift that never quite stops
  const k = 1 - Math.exp(-t * 2.2); tmpP.copy(it.home.pos).addScaledVector(it.vel, k).addScaledVector(it.drift, t);
  spinQ.setFromAxisAngle(it.spin, it.rate * (k * 2.2 + t * 0.15)); tmpQ.copy(it.home.quat).premultiply(spinQ); return [tmpP, tmpQ];
}
const ys = items.map((it) => it.home.pos.y); const yMin = Math.min(...ys), yMax = Math.max(...ys);
const order = items.map((it) => (it.home.pos.y - yMin) / Math.max(1e-6, yMax - yMin) * 0.85 + rnd(it.i, 12) * 0.15);
const REBUILD = 3.2, LAND = 0.55;
function rebuildPose(it, t, from) {   // each brick falls into place in turn, the bottom layer first, and settles with a small bounce
  const start = order[it.i] * (REBUILD - LAND); const k = Math.min(1, Math.max(0, (t - start) / LAND));
  if (k <= 0) return from; const e = k < 1 ? 1 - Math.pow(1 - k, 3) : 1; const bounce = Math.sin(Math.PI * Math.min(1, k * 1.4)) * 0.06 * (1 - k);
  tmpP.copy(from[0]).lerp(it.home.pos, e); tmpP.y += bounce * radius * 0.05; tmpQ.copy(from[1]).slerp(it.home.quat, e); return [tmpP, tmpQ];
}
let apartAt = 0; const snapshot = new Map();
function setState(s) {
  if (s === 'apart') { state = 'apart'; t0 = clock.elapsedTime; }
  if (s === 'rebuilding') { const ta = clock.elapsedTime - t0; for (const it of items) { const [p, q] = state === 'apart' ? apartPose(it, ta) : intro(it); snapshot.set(it, [p.clone(), q.clone()]); } state = 'rebuilding'; t0 = clock.elapsedTime; }
  ui();
}
function intro(it) { const p = it.home.pos.clone(); p.y += radius * 2.2 + rnd(it.i, 13) * radius * 0.6; p.x += (rnd(it.i, 14) - 0.5) * radius * 0.4; p.z += (rnd(it.i, 15) - 0.5) * radius * 0.4; return [p, it.home.quat.clone().premultiply(new THREE.Quaternion().setFromAxisAngle(it.spin, 2))]; }

// ---- UI -------------------------------------------------------------------------------------------------------------------------
const $ = (id) => document.getElementById(id);
$('title').textContent = SET.meta.title; $('sub').textContent = SET.meta.subtitle || ''; $('count').textContent = `${SET.meta.parts.toLocaleString('en-US')} pieces · ${SET.meta.colors} colours`;
document.title = SET.meta.title;
function ui() { $('apart').hidden = state !== 'built'; $('rebuild').hidden = state === 'built'; $('rebuild').disabled = state === 'rebuilding'; }
$('apart').onclick = () => setState('apart'); $('rebuild').onclick = () => setState('rebuilding');
if (SHEET || STILL) document.body.classList.add('still');

// ---- loop -----------------------------------------------------------------------------------------------------------------------
if (!STILL) { for (const it of items) snapshot.set(it, intro(it)); state = 'rebuilding'; t0 = 0; }
ui();
function frame() {
  const t = clock.getElapsedTime();
  if (state === 'apart') { const ta = t - t0; for (const it of items) { const [p, q] = apartPose(it, ta); pose(it, p, q); } commit(); }
  else if (state === 'rebuilding') { const tr = t - t0; for (const it of items) { const [p, q] = rebuildPose(it, tr, snapshot.get(it)); pose(it, p, q); } commit(); if (tr > REBUILD + 0.1) { for (const it of items) pose(it, it.home.pos, it.home.quat); commit(); state = 'built'; ui(); } }
  controls.update(); renderer.render(scene, camera); requestAnimationFrame(frame);
}
function sheet() {   // six views in a 3 × 2 grid, for review
  const W = 1800, H = 1200; renderer.setPixelRatio(1); renderer.setSize(W, H, false); canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
  const names = ['hero', 'front', 'right', 'back', 'left', 'top']; renderer.setScissorTest(true); renderer.setClearColor(0xf2f0ea, 1);
  const cam = new THREE.PerspectiveCamera(30, 1.5, 0.1, 2000);
  names.forEach((n, i) => { const x = (i % 3) * 600, y = H - (Math.floor(i / 3) + 1) * 600; renderer.setViewport(x, y, 600, 600); renderer.setScissor(x, y, 600, 600); cam.aspect = 1; cam.updateProjectionMatrix(); place(cam, ...VIEWS[n], 1, 0.94); renderer.render(scene, cam); });
  $('labels').innerHTML = names.map((n, i) => `<span style="left:${(i % 3) * 600 + 12}px;top:${Math.floor(i / 3) * 600 + 10}px">${n}</span>`).join('');
}
if (SHEET) { sheet(); window.__ready = true; } else { frame(); requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; })); }
