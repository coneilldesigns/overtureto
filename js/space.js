/* Overture: the logo, extruded in chrome, spinning in deep space */
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const section = document.querySelector(".space");
const canvas = section?.querySelector(".space__canvas");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

async function init() {
  if (!canvas) return;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return; // no WebGL: the flat logo stays
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  camera.position.set(0, 0, 9);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;

  // ---------- the logo ----------
  const svg = await (await fetch("assets/img/logo.svg")).text();
  const data = new SVGLoader().parse(svg);
  const shapes = [];
  for (const path of data.paths) {
    for (const sp of path.subPaths) for (const c of sp.curves) { if (c.v1) c.v1.y *= -1; if (c.v2) c.v2.y *= -1; }
    shapes.push(...SVGLoader.createShapes(path));
  }
  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: 150, curveSegments: 10, bevelEnabled: true, bevelThickness: 26, bevelSize: 14, bevelSegments: 8,
  });
  geo.center();
  geo.computeBoundingBox();
  const span = geo.boundingBox.max.x - geo.boundingBox.min.x;

  const chrome = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0.92, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 2.1,
  });
  const logo = new THREE.Mesh(geo, chrome);
  const rig = new THREE.Group();
  rig.add(logo);
  scene.add(rig);

  // a hard key from above, and a low red rim from the booking light
  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(3, 5, 6);
  scene.add(key);
  // a light that orbits the front so a highlight sweeps the face as it turns
  const sweep = new THREE.PointLight(0xffffff, 60, 20, 1.4);
  scene.add(sweep);
  const rim = new THREE.PointLight(0xff3b3b, 40, 30, 1.6);
  rim.position.set(-4, -2.5, -3);
  scene.add(rim);

  // ---------- stars ----------
  const STARS = innerWidth < 700 ? 1400 : 2600;
  const pos = new Float32Array(STARS * 3);
  const col = new Float32Array(STARS * 3);
  for (let i = 0; i < STARS; i++) {
    const r = 12 + Math.random() * 70, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[i * 3 + 2] = -Math.abs(r * Math.cos(ph)) - 4;
    const b = 0.35 + Math.random() * 0.65;
    col.set([b, b, b], i * 3);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  starGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const dot = document.createElement("canvas");
  dot.width = dot.height = 32;
  const g = dot.getContext("2d");
  const grd = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grd.addColorStop(0, "rgba(255,255,255,1)"); grd.addColorStop(0.35, "rgba(255,255,255,.5)"); grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd; g.fillRect(0, 0, 32, 32);
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
    size: 0.32, map: new THREE.CanvasTexture(dot), vertexColors: true, transparent: true, depthWrite: false, sizeAttenuation: true,
  }));
  scene.add(stars);

  // ---------- sizing: the mark fills about 62% of the shorter side ----------
  const fit = () => {
    const w = section.clientWidth, h = section.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const visW = visH * camera.aspect;
    const target = Math.min(visH, visW) * (w < 700 ? 0.66 : 0.54);
    logo.scale.setScalar(target / span);
  };
  fit();
  addEventListener("resize", fit);

  // ---------- interaction: drag to spin, pointer tilts ----------
  let spin = reduce ? 0 : 0.55, angle = 0.4, dragging = false, lastX = 0, tiltX = 0, tiltY = 0;
  const base = reduce ? 0 : 0.55;
  section.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; section.setPointerCapture(e.pointerId); });
  section.addEventListener("pointermove", (e) => {
    const r = section.getBoundingClientRect();
    tiltX = ((e.clientY - r.top) / r.height - 0.5) * 0.5;
    tiltY = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
    if (dragging) { spin = (e.clientX - lastX) * 0.9; angle += (e.clientX - lastX) * 0.012; lastX = e.clientX; }
  });
  const release = () => { dragging = false; };
  section.addEventListener("pointerup", release);
  section.addEventListener("pointercancel", release);

  // ---------- loop, paused when off screen ----------
  let visible = true, raf = 0, last = performance.now();
  const clock0 = performance.now();
  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const t = (now - clock0) / 1000;
    if (!dragging) { spin += (base - spin) * Math.min(1, dt * 1.6); angle += spin * dt; }
    rig.rotation.y = angle;
    sweep.position.set(Math.sin(t * 0.7) * 4, 1.5 + Math.cos(t * 0.5), 4.5);
    rig.rotation.x += ((reduce ? 0.12 : Math.sin(t * 0.45) * 0.14 + tiltX) - rig.rotation.x) * 0.06;
    rig.rotation.z += ((reduce ? 0 : -tiltY * 0.3) - rig.rotation.z) * 0.06;
    rig.position.y = reduce ? 0 : Math.sin(t * 0.9) * 0.12;
    if (!reduce) {
      stars.rotation.z = t * 0.012;
      stars.rotation.y = tiltY * 0.08;
      const p = starGeo.attributes.position.array;
      for (let i = 2; i < p.length; i += 3) { p[i] += dt * 2.2; if (p[i] > -4) p[i] -= 76; }
      starGeo.attributes.position.needsUpdate = true;
    }
    renderer.render(scene, camera);
    if (visible && !reduce) raf = requestAnimationFrame(frame);
  };
  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }).observe(section);
  document.addEventListener("visibilitychange", () => {
    cancelAnimationFrame(raf);
    if (!document.hidden && visible) { last = performance.now(); raf = requestAnimationFrame(frame); }
  });
  frame(performance.now());
  section.classList.add("is-3d");
}

init();
