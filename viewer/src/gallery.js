// Parts gallery: every part of one category in a grid, each labelled with its id, so a builder can see what a part looks like.
// window.GALLERY = { title, parts: [{ id, name, geo }] }
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const G = window.GALLERY; const COLS = 6, CELL = 260, H = Math.ceil(G.parts.length / COLS) * CELL + 60;
const canvas = document.getElementById('c'); const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(COLS * CELL, H, false); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NeutralToneMapping;
const scene = new THREE.Scene(); scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
scene.add(new THREE.HemisphereLight(0xffffff, 0xb0a99c, 0.6)); const sun = new THREE.DirectionalLight(0xffffff, 1.4); sun.position.set(3, 6, 4); scene.add(sun);
const bytes = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
function decode(g) { if (!g) return null; const P = new Int16Array(bytes(g.pos).buffer), N = new Int8Array(bytes(g.nrm).buffer), ib = bytes(g.idx); const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(Float32Array.from(P, (v) => v / g.q), 3)); geo.setAttribute('normal', new THREE.BufferAttribute(Float32Array.from(N, (v) => v / 127), 3));
  if (g.col) geo.setAttribute('color', new THREE.BufferAttribute(Float32Array.from(bytes(g.col), (v) => v / 255), 3)); geo.setIndex(new THREE.BufferAttribute(g.i32 ? new Uint32Array(ib.buffer) : new Uint16Array(ib.buffer), 1)); return geo; }
const main = new THREE.MeshStandardMaterial({ color: 0xc9a46b, roughness: 0.35, side: THREE.DoubleSide }), deco = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.35 }), glass = new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true, opacity: 0.55 });
renderer.setClearColor(0xf2f0ea, 1); renderer.setScissorTest(true); renderer.setViewport(0, 0, COLS * CELL, H); renderer.setScissor(0, 0, COLS * CELL, H); renderer.clear();
const cam = new THREE.PerspectiveCamera(28, 1, 0.01, 500); const labels = [];
G.parts.forEach((p, i) => {
  const grp = new THREE.Group(); for (const [k, mat] of [['main', main], ['deco', deco], ['glass', glass]]) { const g = decode(p.geo[k]); if (g) grp.add(new THREE.Mesh(g, mat)); }
  scene.add(grp); const box = new THREE.Box3().setFromObject(grp); const c = box.getCenter(new THREE.Vector3()), r = box.getSize(new THREE.Vector3()).length() / 2;
  const d = r / Math.sin(THREE.MathUtils.degToRad(14)) * 1.05; cam.position.set(c.x + d * 0.62, c.y + d * 0.5, c.z + d * 0.62); cam.lookAt(c); cam.updateProjectionMatrix();
  const x = (i % COLS) * CELL, top = 60 + Math.floor(i / COLS) * CELL, IH = CELL - 40, y = H - top - IH; renderer.setViewport(x, y, CELL, IH); renderer.setScissor(x, y, CELL, IH); cam.aspect = CELL / IH; cam.updateProjectionMatrix(); renderer.render(scene, cam); scene.remove(grp);
  labels.push(`<div style="left:${x}px;top:${top + IH + 2}px;width:${CELL}px"><b>${p.id}</b> ${p.name}</div>`);
});
document.getElementById('labels').innerHTML = `<h1>${G.title}</h1>` + labels.join('');
window.__ready = true;
