/* Overture: a greyscale Earth turning under the closer. Drag it to spin; the night side glows red. */
import * as THREE from "three";

const section = document.querySelector(".closer");
const canvas = section?.querySelector(".earth");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

const VERT = `
  varying vec2 vUv; varying vec3 vN;
  void main() {
    vUv = uv;
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`;
const FRAG = `
  uniform sampler2D day; uniform sampler2D night; uniform vec3 sun;
  varying vec2 vUv; varying vec3 vN;
  void main() {
    vec3 n = normalize(vN);
    float l = dot(n, normalize(sun));
    float d = texture2D(day, vUv).r;
    d = pow(d, 1.2) * 0.92;
    vec3 col = vec3(d) * smoothstep(-0.25, 0.7, l);
    float city = texture2D(night, vUv).r * smoothstep(0.15, -0.35, l);
    col += vec3(1.0, 0.23, 0.23) * city * 2.4;
    float rim = pow(1.0 - max(n.z, 0.0), 3.0);
    col += vec3(1.0) * rim * 0.35 * smoothstep(-0.4, 0.6, l);
    gl_FragColor = vec4(col, 1.0);
  }`;
const HALO_FRAG = `
  varying vec2 vUv; varying vec3 vN;
  void main() {
    float f = pow(1.0 - abs(normalize(vN).z), 12.0);
    gl_FragColor = vec4(vec3(1.0) * f * 0.9, f);
  }`;

async function init() {
  if (!canvas) return;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return; // no WebGL: the CSS horizon stays
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));

  const loader = new THREE.TextureLoader();
  const [day, night] = await Promise.all(
    ["assets/img/earth.webp", "assets/img/earth-lights.webp"].map((u) => loader.loadAsync(u))
  );
  day.anisotropy = night.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -5000, 5000);
  const geo = new THREE.SphereGeometry(1, 128, 96);
  const globe = new THREE.Mesh(geo, new THREE.ShaderMaterial({
    uniforms: { day: { value: day }, night: { value: night }, sun: { value: new THREE.Vector3(-0.3, 0.55, 0.78) } },
    vertexShader: VERT, fragmentShader: FRAG,
  }));
  const halo = new THREE.Mesh(geo, new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: HALO_FRAG, side: THREE.BackSide,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  const tilt = new THREE.Group(); // lean the north pole toward us so the visible cap shows land, not ice
  tilt.add(globe);
  // 163 Sterling Rd: a red pin on Toronto that pulses
  const dot = document.createElement("canvas");
  dot.width = dot.height = 64;
  const g = dot.getContext("2d"), grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)"); grd.addColorStop(0.18, "rgba(255,59,59,1)"); grd.addColorStop(0.45, "rgba(255,59,59,.35)"); grd.addColorStop(1, "rgba(255,59,59,0)");
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  const pin = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(dot), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  const lat = THREE.MathUtils.degToRad(90 - 43.66), lon = THREE.MathUtils.degToRad(-79.44 + 180);
  pin.position.set(-Math.cos(lon) * Math.sin(lat), Math.cos(lat), Math.sin(lon) * Math.sin(lat)).multiplyScalar(1.004);
  globe.add(pin);
  const rig = new THREE.Group();
  rig.add(halo, tilt);
  scene.add(rig);

  // sizing: a planet much wider than the screen, only its top cap peeking up
  const fit = () => {
    const w = section.clientWidth, h = section.clientHeight;
    renderer.setSize(w, h, false);
    Object.assign(camera, { left: -w / 2, right: w / 2, top: h / 2, bottom: -h / 2 });
    camera.updateProjectionMatrix();
    const R = Math.max(w * 0.72, 560);
    // the cap fills the closer's bottom padding, so it never sits behind the buttons
    const cap = parseFloat(getComputedStyle(section).paddingBottom) * 0.92;
    globe.scale.setScalar(R);
    halo.scale.setScalar(R * 1.012);
    rig.position.set(0, -h / 2 + cap - R, 0);
  };
  section.classList.add("has-earth"); // sets the taller bottom padding the cap sits in, so it must come before fit()
  fit();
  new ResizeObserver(fit).observe(section);

  // ---------- interaction: drag to spin with inertia, scrolling nudges it, the cursor leans it ----------
  const base = reduce ? 0 : 0.05;
  let angle = -0.1, spin = base, dragging = false, lastX = 0, lean = 0, leanTo = 0, lastY = scrollY;
  tilt.rotation.x = -0.6;
  section.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button, input, textarea") || e.button !== 0) return;
    dragging = true; lastX = e.clientX;
    section.setPointerCapture(e.pointerId);
    section.classList.add("is-dragging");
  });
  section.addEventListener("pointermove", (e) => {
    const r = section.getBoundingClientRect();
    leanTo = ((e.clientX - r.left) / r.width - 0.5) * 0.12;
    if (dragging) {
      const dx = e.clientX - lastX; lastX = e.clientX;
      angle += dx * 0.0035; spin = dx * 0.25;
    }
  });
  const release = () => { dragging = false; section.classList.remove("is-dragging"); };
  section.addEventListener("pointerup", release);
  section.addEventListener("pointercancel", release);

  // ---------- loop, only while on screen ----------
  let visible = false, raf = 0, last = performance.now();
  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const dy = scrollY - lastY; lastY = scrollY;
    if (!dragging) {
      spin += dy * 0.004;
      spin += (base - spin) * Math.min(1, dt * 1.2);
      angle += spin * dt;
    }
    lean += (leanTo - lean) * 0.05;
    globe.rotation.y = angle;
    const pulse = 1 + 0.35 * Math.sin(now / 420);
    pin.scale.setScalar((26 / globe.scale.x) * (reduce ? 1 : pulse));
    rig.rotation.z = -lean;
    renderer.render(scene, camera);
    if (visible && !reduce) raf = requestAnimationFrame(frame);
  };
  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) { last = performance.now(); lastY = scrollY; raf = requestAnimationFrame(frame); }
  }).observe(section);
  frame(performance.now());
  section.classList.add("is-earth-on");
}

init().catch(() => {});
