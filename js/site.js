/* Overture: the UV torch and everything it drives */
(() => {
  const doc = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- nav ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => nav && nav.classList.toggle("is-scrolled", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const menuBtn = document.querySelector(".menu-btn");
  const drawer = document.getElementById("drawer");
  const setMenu = (open) => {
    doc.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.querySelector(".menu-btn__txt").textContent = open ? "Close" : "Menu";
    drawer.toggleAttribute("inert", !open);
    document.body.style.overflow = open ? "hidden" : "";
    if (open) drawer.querySelector("a")?.focus();
  };
  if (menuBtn && drawer) {
    drawer.setAttribute("inert", "");
    menuBtn.addEventListener("click", () => setMenu(!doc.classList.contains("menu-open")));
    addEventListener("keydown", (e) => {
      if (e.key === "Escape" && doc.classList.contains("menu-open")) { setMenu(false); menuBtn.focus(); }
    });
  }

  /* ---------- hero stamp ---------- */
    const stampLetters = document.querySelectorAll(".hero__stamp span");
  stampLetters.forEach((s, i) => {
    s.style.setProperty("--i", i);
    s.style.setProperty("--rot", `${(Math.sin(i * 7.3) * 6).toFixed(1)}deg`);
    s.style.setProperty("--rot2", `${(Math.sin(i * 3.1) * 1.4).toFixed(1)}deg`);
  });
  // heads stamp in when they come into view (the home intro sits below the space hero)
  const liveIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const h = en.target;
      h.classList.add("is-live");
      liveIO.unobserve(h);
      const n = h.querySelectorAll(".hero__stamp span").length;
      if (n) setTimeout(() => h.classList.add("is-landed"), reduce ? 0 : n * 85 + 700);
    });
  }, { threshold: 0.25 });
  document.querySelectorAll(".hero, .phead").forEach((h) => liveIO.observe(h));

  /* ---------- the torch: one beam drives every reveal ---------- */
  const torch = document.querySelector(".torch");
  const plates = [...document.querySelectorAll(".uv")];
  const visible = new Set();
  const pointer = { x: innerWidth * 0.5, y: innerHeight * 0.4, active: false, moved: 0 };
  const beam = { x: pointer.x, y: pointer.y };

  if (!reduce && plates.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? visible.add(en.target) : visible.delete(en.target)));
    }, { rootMargin: "120px 0px" });
    plates.forEach((p, i) => { p.dataset.seed = i; io.observe(p); });

    addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; pointer.moved = performance.now();
    }, { passive: true });
    document.addEventListener("pointerleave", () => { pointer.active = false; });
    addEventListener("touchmove", (e) => {
      const t = e.touches[0]; pointer.x = t.clientX; pointer.y = t.clientY; pointer.moved = performance.now();
    }, { passive: true });

    const tick = (now) => {
      // idle or touch: the beam drifts on its own, sweeping the room
      const idle = !finePointer || !pointer.active || now - pointer.moved > 2600;
      const tx = idle ? innerWidth * (0.5 + 0.34 * Math.sin(now / 2300)) : pointer.x;
      const ty = idle ? innerHeight * (0.45 + 0.22 * Math.sin(now / 1700 + 1)) : pointer.y;
      const k = idle ? 0.04 : 0.22;
      beam.x += (tx - beam.x) * k;
      beam.y += (ty - beam.y) * k;
      if (torch) torch.style.transform = `translate3d(${beam.x}px, ${beam.y}px, 0)`;

      for (const p of visible) {
        const r = p.getBoundingClientRect();
        let lx = beam.x - r.left, ly = beam.y - r.top;
        // plates far from the beam get their own slow sweep so nothing stays dark on phones
        if (!finePointer) {
          const s = +p.dataset.seed;
          lx = r.width * (0.5 + 0.38 * Math.sin(now / 2100 + s * 1.7));
          ly = r.height * (0.5 + 0.3 * Math.sin(now / 1500 + s));
        }
        p.style.setProperty("--lx", `${lx.toFixed(1)}px`);
        p.style.setProperty("--ly", `${ly.toFixed(1)}px`);
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  } else if (torch) {
    torch.remove();
  }

  /* ---------- index list: a lit photo follows the beam ---------- */
  const peek = document.querySelector(".peek");
  if (peek && finePointer && !reduce) {
    const imgs = peek.querySelectorAll("img");
    let px = 0, py = 0, cx = 0, cy = 0, raf = 0;
    const follow = () => {
      cx += (px - cx) * 0.18; cy += (py - cy) * 0.18;
      peek.style.transform = `translate3d(${cx + 28}px, ${cy - peek.offsetHeight / 2}px, 0) rotate(${(px - cx) * 0.02}deg)`;
      raf = requestAnimationFrame(follow);
    };
    document.querySelectorAll("[data-peek]").forEach((a) => {
      a.addEventListener("pointerenter", (e) => {
        px = cx = e.clientX; py = cy = e.clientY;
        imgs.forEach((im) => (im.style.opacity = im.dataset.key === a.dataset.peek ? 1 : 0));
        peek.classList.add("on");
        cancelAnimationFrame(raf); raf = requestAnimationFrame(follow);
      });
      a.addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY; });
      a.addEventListener("pointerleave", () => { peek.classList.remove("on"); setTimeout(() => cancelAnimationFrame(raf), 400); });
    });
  }

  /* ---------- reveals ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
  const pendingReveals = [...document.querySelectorAll("[data-reveal], .hours")];
  pendingReveals.forEach((el) => revealIO.observe(el));
  // fast scrolls and jump links can skip past an observer entry; never leave anything above the fold hidden
  let sweepQueued = false;
  const sweep = () => {
    sweepQueued = false;
    for (const el of pendingReveals) {
      if (!el.classList.contains("is-in") && el.getBoundingClientRect().top < innerHeight * 0.95) el.classList.add("is-in");
    }
    document.querySelectorAll(".tickets:not(.is-dropping), .rail:not(.is-dropping), .mixer:not(.is-dropping), .adrift:not(.is-dropping)").forEach((row) => {
      if (row.getBoundingClientRect().top < innerHeight * 0.95) row.classList.add("is-dropping");
    });
  };
  addEventListener("scroll", () => { if (!sweepQueued) { sweepQueued = true; setTimeout(sweep, 120); } }, { passive: true });
  addEventListener("load", sweep);

  /* DJM mixer: one channel open at a time; hover on desktop, tap or keyboard anywhere */
  document.querySelectorAll(".mixer").forEach((mx) => {
    const chs = [...mx.querySelectorAll("[data-ch]")];
    const open = (ch) => chs.forEach((c) => {
      const on = c === ch;
      c.classList.toggle("is-open", on);
      c.querySelector(".ch__strip").setAttribute("aria-expanded", String(on));
    });
    // hover opens a channel only from its strip, after a short dwell, and never mid-slide,
    // so strips moving under a still cursor can't set off a chain of opens
    let lockUntil = 0, dwell = 0;
    const tryOpen = (ch) => {
      if (ch.classList.contains("is-open") || performance.now() < lockUntil) return;
      lockUntil = performance.now() + 850;
      open(ch);
    };
    chs.forEach((ch) => {
      const strip = ch.querySelector(".ch__strip");
      strip.addEventListener("click", () => { lockUntil = 0; tryOpen(ch); });
      if (finePointer) {
        strip.addEventListener("pointerenter", () => { clearTimeout(dwell); dwell = setTimeout(() => tryOpen(ch), 140); });
        strip.addEventListener("pointerleave", () => clearTimeout(dwell));
      }
    });
  });

  /* rooms adrift: each photo scrolls at its own speed, so they slide past each other with depth */
  const adrift = document.querySelector(".adrift");
  if (adrift && !reduce && matchMedia("(min-width: 801px)").matches) {
    const items = [...adrift.querySelectorAll(".fr")];
    let queued = false;
    const place = () => {
      queued = false;
      const mid = innerHeight / 2;
      items.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        const off = (r.top + r.height / 2 - mid) * parseFloat(el.style.getPropertyValue("--sp"));
        el.style.setProperty("--py", `${off.toFixed(1)}px`);
      });
    };
    addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(place); } }, { passive: true });
    place();
  }

  /* drifting belt: the readout shows whichever room you point at or focus; clicking a photo opens that room on the studios page */
  const readout = document.querySelector(".readout");
  if (readout) {
    const set = (it) => {
      const d = it.dataset, q = (k) => readout.querySelector(`[data-r="${k}"]`);
      if (q("name").textContent === d.name) return;
      q("ch").textContent = `CH ${d.ch}`;
      q("name").textContent = d.name;
      q("type").textContent = d.type;
      q("gear").textContent = d.gear;
      q("cap").textContent = d.cap;
      q("book").textContent = `Book ${d.name}`;
      q("book").href = d.book;
      q("details").href = `studios.html#${d.room}`;
      document.querySelectorAll(".belt__item").forEach((b) => b.classList.toggle("is-on", b.dataset.room === d.room));
      readout.classList.remove("is-swap"); void readout.offsetWidth; readout.classList.add("is-swap");
    };
    document.querySelectorAll(".belt__item").forEach((it) => {
      it.addEventListener("click", () => set(it));
      it.addEventListener("focus", () => set(it));
      if (finePointer) it.addEventListener("pointerenter", () => set(it));
    });
    document.querySelectorAll('.belt__item[data-room="nova"]').forEach((b) => b.classList.add("is-on"));
  }

  /* rooms: drop in one by one once their row scrolls into view */
  const dropIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add("is-dropping");
      dropIO.unobserve(en.target);
    });
  }, { threshold: 0.2 });
  document.querySelectorAll(".tickets, .rail, .mixer, .adrift").forEach((row) => {
    [...row.children].forEach((el, i) => el.style.setProperty("--n", i));
    dropIO.observe(row);
  });

  /* hour bars: one cell per hour */
  document.querySelectorAll(".hours__track").forEach((t) => {
    const h = +t.dataset.hours;
    t.innerHTML = Array.from({ length: 20 }, (_, i) => `<i class="${i < h ? "f" : ""}${i >= 16 ? " pk" : ""}" style="--k:${i}"></i>`).join("");
  });

  /* manifesto words fluoresce as you scroll through them */
  const words = [...document.querySelectorAll(".manifesto .wd")];
  if (words.length) {
    const block = document.querySelector(".manifesto");
    const lightWords = () => {
      const r = block.getBoundingClientRect();
      // starts as the top enters, every word is lit by the time the block is centred in the viewport
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height / 2 + innerHeight * 0.35)));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < n));
    };
    if (reduce) words.forEach((w) => w.classList.add("on"));
    else { addEventListener("scroll", lightWords, { passive: true }); lightWords(); }
  }

  /* ---------- rail arrows ---------- */
  document.querySelectorAll("[data-rail]").forEach((nav) => {
    const rail = document.getElementById(nav.dataset.rail);
    nav.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
      const step = rail.firstElementChild.getBoundingClientRect().width + 24;
      rail.scrollBy({ left: b.dataset.dir === "next" ? step : -step, behavior: reduce ? "auto" : "smooth" });
    }));
  });

  /* ---------- forms: write a pre-filled email to the studio ---------- */
  const STUDIO = "axel.e@overtureto.com";
  document.querySelectorAll("form[data-mail]").forEach((form) => {
    const status = form.querySelector(".form__status");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      form.querySelectorAll("[required]").forEach((f) => {
        const field = f.closest(".field");
        const err = field?.querySelector(".field__err");
        let msg = "";
        if (!f.value.trim()) msg = `Add your ${f.dataset.name || "details"} so we can reply.`;
        else if (f.type === "email" && !/^\S+@\S+\.\S+$/.test(f.value)) msg = "That email looks incomplete. Check for a typo.";
        field?.classList.toggle("has-error", !!msg);
        if (err) err.textContent = msg;
        f.setAttribute("aria-invalid", msg ? "true" : "false");
        if (msg && ok) { f.focus(); ok = false; }
      });
      if (!ok) { status.textContent = ""; return; }
      const data = new FormData(form);
      const lines = [];
      for (const [k, v] of data) if (String(v).trim() && k !== "subscribe") lines.push(`${k}: ${v}`);
      if (data.get("subscribe")) lines.push("Newsletter: yes please");
      const subject = form.dataset.mail;
      location.href = `mailto:${STUDIO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      status.textContent = "Your email app should open with everything filled in. Hit send and we'll reply soon.";
      status.classList.add("ok");
    });
  });

  /* ---------- memories: one studio photo at a time glitches in somewhere around the intro ---------- */
  document.querySelectorAll(".memories").forEach((box) => {
    if (reduce) return;
    const pool = box.dataset.pool.split(",");
    let last = [], timer = 0, live = false;
    const rand = (a, b) => a + Math.random() * (b - a);
    const spawn = () => {
      const W = box.clientWidth, H = box.clientHeight, narrow = W < 700;
      const w = Math.round(narrow ? rand(110, 160) : rand(170, Math.min(320, W * 0.22)));
      const h = w * 0.75;
      // keep to the sides on wide screens so the headline and buttons stay clear
      let x;
      if (narrow) x = rand(4, W - w - 4);
      else x = Math.random() < 0.5 ? rand(W * 0.02, W * 0.26 - w * 0.3) : rand(W * 0.74 - w * 0.7, W * 0.98 - w);
      const y = rand(H * 0.1, H * 0.92 - h);
      let name; do { name = pool[Math.floor(Math.random() * pool.length)]; } while (last.includes(name));
      last = [name, ...last].slice(0, 4);
      const fig = document.createElement("figure");
      fig.className = "mem";
      fig.style.cssText = `--w:${w}px;--o:${narrow ? 0.24 : rand(0.32, 0.46).toFixed(2)};--life:${rand(3.4, 4.6).toFixed(2)}s;left:${x}px;top:${y}px`;
      fig.innerHTML = `<img src="assets/img/${name}.webp" alt="" decoding="async">`;
      fig.addEventListener("animationend", (e) => { if (e.target === fig) fig.remove(); });
      box.appendChild(fig);
    };
    const loop = () => { if (!live) return; spawn(); timer = setTimeout(loop, rand(1400, 2200)); };
    new IntersectionObserver(([en]) => {
      live = en.isIntersecting; clearTimeout(timer);
      if (live) timer = setTimeout(loop, 600);
    }).observe(box);
  });

  /* ---------- CDJ deck: a waveform scrolling past the playhead at 128 BPM ---------- */
  const BPM = 128, PX_PER_BEAT = 26;
  const track = (() => {
    // a made-up four-to-the-floor track: kick on every beat, hats between, phrases every 32 beats
    const beats = 512, per = 8, out = new Float32Array(beats * per);
    let r = 7;
    const rnd = () => ((r = (r * 16807) % 2147483647) / 2147483647);
    for (let b = 0; b < beats; b++) {
      const phrase = Math.floor(b / 32) % 4, breakdown = phrase === 2 && b % 32 < 16;
      for (let k = 0; k < per; k++) {
        const kick = breakdown ? 0.15 : Math.max(0, 1 - k / 2.2) * 0.85;
        const body = (breakdown ? 0.28 : 0.42) + 0.18 * Math.sin(b / 5 + k) + rnd() * 0.18;
        const hat = k === 4 ? 0.2 : 0;
        out[b * per + k] = Math.min(1, Math.max(0.06, kick + body * 0.6 + hat));
      }
    }
    return out;
  })();
  document.querySelectorAll(".deck").forEach((deck) => {
    const cv = deck.querySelector(".deck__wave"), c = cv.getContext("2d"), timeEl = deck.querySelector(".deck__time");
    let w = 0, h = 0, on = true, t0 = performance.now(), raf = 0;
    // ink colour as "r,g,b": white on the black decks, black where the strip is a white band
    const ink = getComputedStyle(deck).getPropertyValue("--wave-ink").trim() || "255,255,255";
    const size = () => {
      const d = Math.min(devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * d; cv.height = h * d; c.setTransform(d, 0, 0, d, 0, 0);
    };
    const paint = (now) => {
      const secs = 30 + (reduce ? 12 : (now - t0) / 1000);
      const beatPos = (secs * BPM) / 60;
      const head = w * 0.38, mid = h / 2, step = PX_PER_BEAT / 8;
      c.clearRect(0, 0, w, h);
      // beat grid
      for (let x = head - (beatPos % 1) * PX_PER_BEAT - Math.ceil(head / PX_PER_BEAT) * PX_PER_BEAT; x < w; x += PX_PER_BEAT) {
        const bar = Math.round(beatPos + (x - head) / PX_PER_BEAT) % 4 === 0;
        c.fillStyle = bar ? `rgba(${ink},.22)` : `rgba(${ink},.07)`;
        c.fillRect(Math.round(x), 0, 1, bar ? h : 5);
      }
      // waveform bars, played part dimmer
      const first = beatPos * 8 - head / step;
      for (let x = 0; x < w; x += step) {
        const i = Math.floor(first + x / step);
        if (i < 0) continue;
        const v = track[i % track.length], a = v * (mid - 3);
        c.fillStyle = x < head ? `rgba(${ink},.38)` : `rgba(${ink},.95)`;
        c.fillRect(x, mid - a, Math.max(1, step - 1), a * 2);
      }
      // playhead
      c.fillStyle = "#ff3b3b"; c.fillRect(head - 1, 0, 2, h);
      c.fillStyle = "rgba(255,59,59,.18)"; c.fillRect(head - 6, 0, 12, h);
      const m = Math.floor(secs / 60), sec = secs % 60;
      timeEl.textContent = `${String(m).padStart(2, "0")}:${sec.toFixed(1).padStart(4, "0")}`;
      if (on && !reduce) raf = requestAnimationFrame(paint);
    };
    size(); addEventListener("resize", size);
    new IntersectionObserver(([en]) => {
      on = en.isIntersecting; cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(paint);
    }).observe(deck);
    paint(performance.now());
  });

  /* DJM channel meters bounce to the same beat */
  const meters = [...document.querySelectorAll(".meter")];
  if (meters.length) {
    const cells = meters.map((m) => [...m.children]);
    cells.forEach((cs) => cs.forEach((c, i) => { if (i >= 10) c.classList.add("pk"); }));
    const level = (now, k) => {
      const beat = (now / 1000) * (BPM / 60) + k * 0.13;
      const env = Math.pow(1 - (beat % 1), 2.4);
      return Math.round(4 + env * 7 + Math.sin(now / 700 + k) * 1.2);
    };
    let mOn = true;
    const tickMeters = (now) => {
      cells.forEach((cs, k) => { const l = reduce ? 8 : level(now, k); cs.forEach((c, i) => c.classList.toggle("on", i < l)); });
      if (!reduce && mOn) requestAnimationFrame(tickMeters);
    };
    new IntersectionObserver(([en]) => { const was = mOn; mOn = en.isIntersecting; if (mOn && !was) requestAnimationFrame(tickMeters); })
      .observe(meters[0].closest(".tickets, .mixer"));
    requestAnimationFrame(tickMeters);
  }

  /* ---------- a spiral galaxy that wakes up as the manifesto scrolls by, with a shooting star on arrival ---------- */
  // one per page header and the manifesto; data-x / data-y / data-size place it in its section, data-glow brightens it
  document.querySelectorAll(".galaxy").forEach((galaxy) => {
    const gpx = parseFloat(galaxy.dataset.x || 0.74), gpy = parseFloat(galaxy.dataset.y || 0.4), gsz = parseFloat(galaxy.dataset.size || 1), glow = parseFloat(galaxy.dataset.glow || 1);
    const zone = galaxy.parentElement, gx = galaxy.getContext("2d");
    const GDPR = Math.min(devicePixelRatio || 1, 1.5);
    let gw = 0, gh = 0, gRaf = 0, gOn = false, comet = null, nextComet = 0;
    const N = Math.round((innerWidth < 700 ? 2200 : 5200) * Math.min(glow, 1.5)), dsz = 1 + (glow - 1) * 0.35;
    const dust = Array.from({ length: N }, () => {
      const arm = Math.floor(Math.random() * 3), r = Math.random() ** 1.6;
      return {
        r, a: arm * (Math.PI * 2 / 3) + r * 5.2 + (Math.random() - 0.5) * (0.55 - r * 0.25),
        o: (Math.random() - 0.5) * 0.06, s: 0.4 + Math.random() * 1.3, red: Math.random() < 0.12 && r > 0.25,
        tw: Math.random() * 6.28,
      };
    });
    const size = () => {
      gw = zone.clientWidth; gh = zone.clientHeight;
      galaxy.width = gw * GDPR; galaxy.height = gh * GDPR;
      gx.setTransform(GDPR, 0, 0, GDPR, 0, 0);
    };
    const shoot = (now) => {
      comet = { x: gw * (0.35 + Math.random() * 0.3), y: gh * (0.05 + Math.random() * 0.2), t0: now, dur: 1100 };
      nextComet = now + 5000 + Math.random() * 6000;
    };
    const paint = (now) => {
      gx.clearRect(0, 0, gw, gh);
      const box = zone.getBoundingClientRect();
      const prog = Math.max(0, Math.min(1, 1 - (box.top + box.height / 2) / innerHeight)); // 0 entering, 1 leaving
      const wide = gw > 760;
      const cx = wide ? gw * gpx : gw * 0.7, cy = wide ? gh * gpy : gh * 0.22;
      const R = Math.min(wide ? gw * 0.36 : gw * 0.6, gh * 0.75) * (0.85 + prog * 0.3) * gsz;
      const spin = now * 0.00004 + prog * 0.9, tilt = 0.42, rot = -0.45;
      const cr = Math.cos(rot), sr = Math.sin(rot);
      // core
      gx.save(); gx.translate(cx, cy); gx.rotate(rot); gx.scale(1, tilt);
      const halo = gx.createRadialGradient(0, 0, 0, 0, 0, R * 1.05);
      // infrared: a white-hot core that drops straight into the button red, strong enough to read as red not maroon
      const ir = (v) => Math.min(1, v * glow).toFixed(3);
      halo.addColorStop(0, `rgba(255,245,240,${ir(0.55)})`); halo.addColorStop(0.05, `rgba(255,107,107,${ir(0.38)})`);
      halo.addColorStop(0.16, `rgba(255,59,59,${ir(0.24)})`); halo.addColorStop(0.4, `rgba(255,59,59,${ir(0.09)})`);
      halo.addColorStop(1, "rgba(255,59,59,0)");
      gx.fillStyle = halo; gx.fillRect(-R * 1.1, -R * 1.1, R * 2.2, R * 2.2);
      gx.restore();
      gx.globalCompositeOperation = "lighter";
      for (const d of dust) {
        const ang = d.a + spin * (1.6 - d.r);
        const lx = Math.cos(ang) * d.r * R, ly = Math.sin(ang) * d.r * R * tilt + d.o * R;
        const x = cx + lx * cr - ly * sr, y = cy + lx * sr + ly * cr;
        const a = Math.min(1, (1 - d.r * 0.75) * (0.55 + 0.45 * Math.sin(now / 1100 + d.tw)) * glow);
        gx.fillStyle = d.red ? `rgba(255,59,59,${Math.min(1, 0.55 + a * 0.6).toFixed(3)})` : `rgba(255,255,255,${(a * 0.85).toFixed(3)})`;
        gx.fillRect(x, y, d.s * dsz, d.s * dsz);
      }
      gx.globalCompositeOperation = "source-over";
      // comet
      if (!comet && now > nextComet) shoot(now);
      if (comet) {
        const p = (now - comet.t0) / comet.dur;
        if (p >= 1) comet = null;
        else if (p > 0) {
          const hx = comet.x + p * gw * 0.45, hy = comet.y + p * gh * 0.32, len = 220 * Math.sin(Math.PI * p);
          const tx = hx - len, ty = hy - len * 0.7;
          const g = gx.createLinearGradient(hx, hy, tx, ty);
          g.addColorStop(0, "rgba(255,255,255,.95)"); g.addColorStop(0.3, "rgba(255,120,120,.35)"); g.addColorStop(1, "rgba(255,59,59,0)");
          gx.strokeStyle = g; gx.lineWidth = 2; gx.lineCap = "round"; gx.beginPath(); gx.moveTo(hx, hy); gx.lineTo(tx, ty); gx.stroke();
          gx.fillStyle = "rgba(255,255,255,.9)"; gx.beginPath(); gx.arc(hx, hy, 1.8, 0, 6.283); gx.fill();
        }
      }
      if (gOn && !reduce) gRaf = requestAnimationFrame(paint);
    };
    size();
    addEventListener("resize", size);
    new IntersectionObserver(([en]) => {
      gOn = en.isIntersecting;
      cancelAnimationFrame(gRaf);
      if (gOn) {
        galaxy.classList.add("is-on");
        const now = performance.now();
        if (!reduce) shoot(now + 350);
        gRaf = requestAnimationFrame(paint);
      }
    }, { threshold: 0.15 }).observe(zone);
  });

  /* ---------- deep space behind every page: parallax stars that streak when you scroll fast ---------- */
  const cosmos = document.createElement("canvas");
  cosmos.className = "cosmos";
  cosmos.setAttribute("aria-hidden", "true");
  document.body.prepend(cosmos);
  const ctx = cosmos.getContext("2d");
  let W = 0, H = 0, stars = [], lastY = scrollY, vel = 0, spaceRaf = 0, shooting = null;
  const DPR = Math.min(devicePixelRatio || 1, 1.5);
  const seed = () => {
    W = innerWidth; H = innerHeight;
    cosmos.width = W * DPR; cosmos.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = Math.min(520, Math.round((W * H) / 2600));
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H, z: 0.15 + Math.random() ** 2 * 0.85,
      tw: Math.random() * Math.PI * 2,
    }));
  };
  const draw = (now) => {
    const dy = scrollY - lastY; lastY = scrollY;
    vel += (dy - vel) * 0.18;
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.y -= dy * s.z * 0.45;
      s.x += s.z * 0.04;
      if (s.y < -20) s.y += H + 40; else if (s.y > H + 20) s.y -= H + 40;
      if (s.x > W + 2) s.x -= W + 4;
      const a = (0.35 + s.z * 0.65) * (0.75 + 0.25 * Math.sin(now / 900 + s.tw));
      const r = 0.4 + s.z * 1.3;
      const streak = Math.max(-70, Math.min(70, vel * s.z * 1.1));
      ctx.strokeStyle = ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
      if (Math.abs(streak) > 3) {
        ctx.strokeStyle = `rgba(255,255,255,${(a * 0.7).toFixed(3)})`;
        ctx.lineWidth = r * 0.85; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x, s.y + streak); ctx.stroke();
      } else {
        ctx.fillRect(s.x - r / 2, s.y - r / 2, r, r);
      }
    }
    // the odd shooting star
    if (!shooting && Math.random() < 0.0025) shooting = { x: Math.random() * W * 0.7, y: Math.random() * H * 0.4, life: 0 };
    if (shooting) {
      shooting.life += 1;
      const p = shooting.life / 45, len = 140 * Math.sin(Math.PI * Math.min(p, 1));
      const hx = shooting.x + shooting.life * 9, hy = shooting.y + shooting.life * 4;
      const g = ctx.createLinearGradient(hx, hy, hx - len, hy - len * 0.44);
      g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = g; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx - len, hy - len * 0.44); ctx.stroke();
      if (p >= 1) shooting = null;
    }
    spaceRaf = requestAnimationFrame(draw);
  };
  seed();
  addEventListener("resize", seed);
  if (reduce) { draw(0); cancelAnimationFrame(spaceRaf); }
  else {
    spaceRaf = requestAnimationFrame(draw);
    document.addEventListener("visibilitychange", () => {
      cancelAnimationFrame(spaceRaf);
      if (!document.hidden) { lastY = scrollY; spaceRaf = requestAnimationFrame(draw); }
    });
  }

  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
