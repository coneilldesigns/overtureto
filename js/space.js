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
    section.classList.add("no-3d"); // no WebGL: show the flat logo
    return;
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
  // one mesh per piece of the mark, so the intro can fly them in separately
  const opts = { depth: 150, curveSegments: 10, bevelEnabled: true, bevelThickness: 26, bevelSize: 14, bevelSegments: 8 };
  const geos = shapes.map((sh) => new THREE.ExtrudeGeometry(sh, opts));
  const box = new THREE.Box3();
  geos.forEach((g) => { g.computeBoundingBox(); box.union(g.boundingBox); });
  const mid = box.getCenter(new THREE.Vector3());
  geos.forEach((g) => g.translate(-mid.x, -mid.y, -mid.z));
  const span = box.max.x - box.min.x;

  const chrome = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0.92, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 2.1,
    emissive: 0xff3b3b, emissiveIntensity: 0,
  });
  const logo = new THREE.Group();
  const pieces = geos.map((g) => { const m = new THREE.Mesh(g, chrome); logo.add(m); return m; });
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

  // ---------- intro: the pieces fly in red-hot and lock on four beats at 128 BPM, then extrude and cool to chrome ----------
  let seen = false;
  try { seen = sessionStorage.getItem("ov-intro") === "1"; sessionStorage.setItem("ov-intro", "1"); } catch {}
  const INTRO = !reduce && !seen;
  const BEAT = 60 / 128, FLY = 0.42, LAST = 0.3 + 4 * BEAT, T_END = LAST + 1.6;
  // biggest pieces land first, the centre dot lands on the fourth beat
  const size = (m) => { m.geometry.computeBoundingSphere(); return m.geometry.boundingSphere.radius; };
  [...pieces].sort((a, b) => size(b) - size(a)).forEach((m, i, all) => {
    const beat = all.length > 1 ? Math.round((i * 3) / (all.length - 1)) : 3;
    const dir = Math.random() * Math.PI * 2;
    m.userData = {
      land: 0.3 + (beat + 1) * BEAT,
      from: new THREE.Vector3(Math.cos(dir) * span * 1.4, Math.sin(dir) * span * 1.1, span * (0.8 + Math.random() * 0.8)),
      rot: [(Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 4],
    };
  });
  // a red shockwave when the last piece locks
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.97, 1, 128),
    new THREE.MeshBasicMaterial({ color: 0xff3b3b, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  ring.visible = false;
  scene.add(ring);
  const ease = (x) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 4);
  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  // arriving from another page in warp (js/site.js): the stars are still streaking, so this starfield slows
  // down on the same curve and the mark flies in out of the distance
  const ARRIVE = document.documentElement.classList.contains("warp-in") && !reduce;
  const inOut = (x) => { x = clamp01(x); return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2; };
  let arriveT = 0; // advances by frame time, so a slow frame pauses the fly-in instead of making it jump

  // any scroll, tap or key jumps straight to the finished mark
  let introStart = -1, skipped = false;
  const skip = () => { skipped = true; };
  if (INTRO) {
    document.documentElement.classList.add("is-intro");
    section.classList.add("is-3d");
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach((ev) => addEventListener(ev, skip, { once: true, passive: true }));
  }

  // ---------- sizing: the mark fills about 62% of the shorter side ----------
  const fit = () => {
    const w = section.clientWidth, h = section.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const visW = visH * camera.aspect;
    const target = Math.min(visH, visW) * (w < 700 ? 0.66 : 0.54);
    baseScale = target / span;
    logo.scale.setScalar(baseScale);
  };
  let baseScale = 1;
  fit();
  addEventListener("resize", fit);

  // ---------- interaction: drag to spin, pointer tilts ----------
  let spin = reduce || INTRO ? 0 : 0.55, angle = INTRO ? 0 : 0.4, dragging = false, lastX = 0, tiltX = 0, tiltY = 0;
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
    // intro clock: it, and everything it drives, sits at its end state when there is no intro
    if (INTRO && introStart < 0) introStart = now;
    const it = INTRO && !skipped ? Math.min(T_END, (now - introStart) / 1000) : T_END;
    if (ARRIVE) arriveT += Math.min(dt, 1 / 30);
    rig.position.z = ARRIVE && !INTRO ? -70 * (1 - ease(arriveT / 1.5)) : 0;
    const settle = clamp01((it - LAST - 0.3) / 1.2); // idle motion fades in once the mark is built
    let pulse = 0;
    for (const m of pieces) {
      const { land, from, rot } = m.userData, k = ease((it - (land - FLY)) / FLY);
      m.visible = it > land - FLY;
      m.position.copy(from).multiplyScalar(1 - k);
      m.rotation.set(rot[0] * (1 - k), rot[1] * (1 - k), rot[2] * (1 - k));
      if (it > land) pulse += Math.exp(-(it - land) * 9);
    }
    logo.scale.set(baseScale, baseScale, baseScale * (0.04 + 0.96 * ease((it - LAST) / 0.55)));
    // red-hot while assembling: the metal is dark so the glow reads as the button red, then it cools to chrome
    const heat = Math.pow(1 - clamp01((it - LAST - 0.15) / 0.9), 1.5);
    chrome.emissiveIntensity = 0.85 * heat; // above ~1 the tone mapping washes red out to salmon
    chrome.color.setScalar(1 - 0.94 * heat);
    rim.intensity = 40 + 320 * pulse;
    const shock = (it - LAST) / 0.9;
    ring.visible = shock > 0 && shock < 1;
    if (ring.visible) { ring.scale.setScalar(baseScale * span * (0.55 + 2.6 * ease(shock))); ring.material.opacity = 0.85 * (1 - shock); }
    camera.position.set((Math.random() - 0.5) * pulse * 0.05, (Math.random() - 0.5) * pulse * 0.05, 9);
    if (INTRO && it > LAST + 0.1) document.documentElement.classList.remove("is-intro");

    if (!dragging) { spin += (base * settle - spin) * Math.min(1, dt * 1.6); angle += spin * dt; }
    rig.rotation.y = angle;
    sweep.position.set(Math.sin(t * 0.7) * 4, 1.5 + Math.cos(t * 0.5), 4.5);
    rig.rotation.x += ((reduce ? 0.12 : (Math.sin(t * 0.45) * 0.14 + tiltX) * settle) - rig.rotation.x) * 0.06;
    rig.rotation.z += ((reduce ? 0 : -tiltY * 0.3 * settle) - rig.rotation.z) * 0.06;
    rig.position.y = reduce ? 0 : Math.sin(t * 0.9) * 0.12 * settle;
    if (!reduce) {
      stars.rotation.z = t * 0.012;
      stars.rotation.y = tiltY * 0.08;
      const p = starGeo.attributes.position.array;
      const warp = Math.max(
        1 + 34 * (1 - ease(it / (LAST + 0.4))), // out of hyperspace as the mark locks
        ARRIVE ? 1 + 30 * (1 - inOut(now / 2000)) : 1, // page warp, timed from page start like the background
      );
      for (let i = 2; i < p.length; i += 3) { p[i] += dt * 2.2 * warp; if (p[i] > -4) p[i] -= 76; }
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
