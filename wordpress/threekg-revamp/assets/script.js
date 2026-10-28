/* ============================================================
   ThreeKG® — interactions
   canvas dot field · cursor · work previews · menu
   ============================================================ */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------
     canvas dot field (hero)
     ---------------------------------------------------------- */
  const canvas = document.getElementById("field");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, dpr = 1;
    let dots = [];
    const mouse = { x: -9999, y: -9999 };
    let running = true;
    let rafId = null;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduceMotion) draw(0); // render one static frame
    }

    function build() {
      dots = [];
      const gap = 34;
      const cols = Math.ceil(w / gap) + 2;
      const rows = Math.ceil(h / gap) + 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const stagger = r % 2 ? gap / 2 : 0;
          const x0 = c * gap + stagger;
          const y0 = r * gap;
          dots.push({ x0: x0, y0: y0, x: x0, y: y0 });
        }
      }
      dots = dots.filter(function (d) { return d.x0 <= w + gap && d.y0 <= h + gap; });
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      const R = 150; // mouse interaction radius
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        // idle drift
        let x = d.x0 + Math.sin(t * 0.55 + d.x0 * 0.008 + d.y0 * 0.012) * 2.4;
        let y = d.y0 + Math.cos(t * 0.5 + d.x0 * 0.01 + d.y0 * 0.006) * 2.4;

        // mouse repel + highlight
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let f = 0;
        if (dist < R && dist > 0.01) {
          f = 1 - dist / R;
          const push = f * 26;
          x += (dx / dist) * push;
          y += (dy / dist) * push;
        }

        const alpha = 0.16 + f * 0.7;
        const size = 1 + f * 1.7;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = f > 0.05
          ? "rgba(255, 59, 0, " + alpha.toFixed(3) + ")"
          : "rgba(16, 16, 16, " + alpha.toFixed(3) + ")";
        ctx.fill();
      }
    }

    function loop(tms) {
      if (!running) return;
      draw(tms / 1000);
      rafId = requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", function (e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }, { passive: true });

    window.addEventListener("pointerleave", function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    // pause when hero not visible
    if ("IntersectionObserver" in window && !reduceMotion) {
      new IntersectionObserver(function (entries) {
        const visible = entries[0].isIntersecting;
        if (visible && running === false) {
          running = true;
          rafId = requestAnimationFrame(loop);
        } else if (!visible && running === true) {
          running = false;
          if (rafId) cancelAnimationFrame(rafId);
        }
      }).observe(canvas);
    }

    let resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    resize();
    if (!reduceMotion) rafId = requestAnimationFrame(loop);
  }

  /* ----------------------------------------------------------
     custom cursor
     ---------------------------------------------------------- */
  const cursor = document.querySelector(".cursor");
  if (cursor && window.matchMedia("(pointer: fine)").matches) {
    let cx = -50, cy = -50, tx = -50, ty = -50;
    window.addEventListener("pointermove", function (e) {
      tx = e.clientX;
      ty = e.clientY;
      cursor.classList.add("is-visible");
    }, { passive: true });
    document.documentElement.addEventListener("mouseleave", function () {
      cursor.classList.remove("is-visible");
    });

    (function cursorLoop() {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      cursor.style.transform = "translate(" + (cx - 0) + "px," + (cy - 0) + "px) translate(-50%,-50%)";
      requestAnimationFrame(cursorLoop);
    })();

    document.querySelectorAll("a, button, .work-block").forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("is-hover"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("is-hover"); });
    });
  }

  /* ----------------------------------------------------------
     featured work — editorial alternating blocks
     ---------------------------------------------------------- */

  /* ----------------------------------------------------------
     menu overlay
     ---------------------------------------------------------- */
  const menu = document.getElementById("menu");
  const toggle = document.getElementById("menuToggle");

  if (menu && toggle) {
    let previousFocus;
    const background = Array.from(document.querySelectorAll("main, footer, .site-header, .profile-nav")).filter(function (element) { return !element.contains(menu); });
    function setMenu(open) {
      if (open) previousFocus = document.activeElement;
      menu.classList.toggle("is-open", open);
      menu.setAttribute("aria-hidden", String(!open));
      menu.inert = !open;
      background.forEach(function (element) { element.inert = open; });
      document.body.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "close ×" : "menu";
      if (open) menu.querySelector("a").focus({ preventScroll: true });
      else if (previousFocus) previousFocus.focus({ preventScroll: true });
    }
    toggle.addEventListener("click", function () { setMenu(!menu.classList.contains("is-open")); });
    menu.querySelector(".menu__close")?.addEventListener("click", function () { setMenu(false); });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    window.addEventListener("keydown", function (e) {
      if (!menu.classList.contains("is-open")) return;
      if (e.key === "Escape") { e.preventDefault(); setMenu(false); }
      if (e.key === "Tab") {
        const items = Array.from(menu.querySelectorAll("a, button"));
        const index = items.indexOf(document.activeElement);
        const next = (index + (e.shiftKey ? -1 : 1) + items.length) % items.length;
        e.preventDefault(); items[next].focus();
      }
    });
  }

  /* ----------------------------------------------------------
     showreel — video after hero
     click to play/pause, auto-pause when scrolled out of view
     ---------------------------------------------------------- */
  const reelFrame = document.querySelector(".showreel__frame");
  const reelVideo = document.getElementById("showreelVideo");
  const reelPlay = document.getElementById("showreelPlay");

  if (reelFrame && reelVideo && reelPlay) {
    function reelToggle() {
      if (reelVideo.readyState < 2) {
        reelPlay.querySelector(".mono").textContent = "video not found";
        return;
      }
      if (reelVideo.paused) {
        reelVideo.muted = true; // autoplay policy safe
        reelVideo.play();
        reelFrame.classList.add("is-playing");
        reelPlay.setAttribute("aria-label", "Pause symbol motion");
      } else {
        reelVideo.pause();
        reelFrame.classList.remove("is-playing");
        reelPlay.setAttribute("aria-label", "Play symbol motion");
      }
    }

    reelFrame.addEventListener("click", reelToggle);
    reelFrame.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        reelToggle();
      }
    });

    // pause when scrolled out of view
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting && !reelVideo.paused) {
          reelVideo.pause();
          reelFrame.classList.remove("is-playing");
          reelPlay.setAttribute("aria-label", "Play symbol motion");
        }
      }, { threshold: 0.15 }).observe(reelFrame);
    }

    // error fallback: show a note if the file is still a placeholder / missing
    reelVideo.addEventListener("error", function () {
      reelPlay.querySelector(".mono").textContent = "Motion unavailable";
    });
  }

  /* ----------------------------------------------------------
     brand preload overlay — full symbol sequence once per load
     ---------------------------------------------------------- */
  (function loaderInit() {
    const loader = document.getElementById("loader");
    const video = document.getElementById("loaderVideo");
    if (!loader) return;

    let done = false;
    function finish() {
      if (done) return;
      done = true;
      loader.classList.add("is-done");
      document.body.classList.remove("is-loading");
      document.dispatchEvent(new Event("3kg:ready"));
      try { video.pause(); } catch (e) {}
      setTimeout(function () { loader.remove(); }, 700);
    }

    if (reduceMotion) { finish(); return; }

    // 2x pace keeps the brand moment under ~4.5s
    video.playbackRate = 2;
    video.play().catch(function () { /* autoplay blocked — waits for 'playing' */ });

    video.addEventListener("playing", function () {
      loader.classList.add("is-skippable");
    });
    video.addEventListener("ended", finish);
    video.addEventListener("error", finish);

    // click / tap to skip
    loader.addEventListener("pointerdown", function () { finish(); });
    window.addEventListener("keydown", function onKey(e) {
      if (done) { window.removeEventListener("keydown", onKey); return; }
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        finish();
        window.removeEventListener("keydown", onKey);
      }
    });

    // hard safety cap in case stalling drags on
    setTimeout(finish, 2200);
  })();

  /* ----------------------------------------------------------
     services — dot-to-symbol cards
     engine ported from 3KG_Profile_Hover_Experiment.html:
     procedural SVG renderer, hover contracts to a dot and
     ping-pongs; plays a one-shot construct on scroll reveal
     ---------------------------------------------------------- */
  (function servicesSymbols() {
    const buttons = document.querySelectorAll(".symbol-btn");
    if (!buttons.length) return;

    const NS = "http://www.w3.org/2000/svg";
    const N = 192, TAU = 2 * Math.PI, STROKE = 19, ROUND = 0.75;
    const clamp = x => Math.max(0, Math.min(1, x));
    const mix = (a, b, t) => a + (b - a) * t;
    const ease = x => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
    const lock = x => { x = clamp(x); return ease(x) + 0.018 * Math.sin(4 * Math.PI * x) * Math.pow(Math.sin(Math.PI * x), 2); };
    const rotate = (pts, deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return pts.map(pt => [pt[0] * c - pt[1] * s, pt[0] * s + pt[1] * c]); };
    const blend = (a, b, q) => a.map((p, i) => [mix(p[0], b[i][0], q), mix(p[1], b[i][1], q)]);
    const cross = (a, b) => a[0] * b[1] - a[1] * b[0];

    function circle(r) {
      return Array.from({ length: N }, function (_, i) {
        const a = -Math.PI / 2 + i * TAU / N;
        return [r * Math.cos(a), r * Math.sin(a)];
      });
    }
    function rounded(vertices) {
      const result = [];
      const corners = vertices.map(function (v, i) {
        const a = vertices[(i + vertices.length - 1) % vertices.length];
        const b = vertices[(i + 1) % vertices.length];
        const da = Math.hypot(v[0] - a[0], v[1] - a[1]);
        const db = Math.hypot(v[0] - b[0], v[1] - b[1]);
        const trim = ROUND * 0.42 * Math.min(da, db);
        return {
          v: v,
          enter: [mix(v[0], a[0], trim / da), mix(v[1], a[1], trim / da)],
          exit: [mix(v[0], b[0], trim / db), mix(v[1], b[1], trim / db)]
        };
      });
      corners.forEach(function (c, i) {
        for (let j = 0; j < 9; j++) {
          const t = j / 8;
          result.push([(1 - t) * (1 - t) * c.enter[0] + 2 * (1 - t) * t * c.v[0] + t * t * c.exit[0],
                       (1 - t) * (1 - t) * c.enter[1] + 2 * (1 - t) * t * c.v[1] + t * t * c.exit[1]]);
        }
        const next = corners[(i + 1) % corners.length].enter;
        for (let j = 1; j < 9; j++) {
          result.push([mix(c.exit[0], next[0], j / 8), mix(c.exit[1], next[1], j / 8)]);
        }
      });
      return result;
    }
    function radial(vertices) {
      const pts = rounded(vertices);
      return Array.from({ length: N }, function (_, i) {
        const a = -Math.PI / 2 + i * TAU / N;
        const ray = [Math.cos(a), Math.sin(a)];
        let near = Infinity;
        pts.forEach(function (v, j) {
          const b = pts[(j + 1) % pts.length];
          const s = [b[0] - v[0], b[1] - v[1]];
          const d = cross(ray, s);
          if (Math.abs(d) < 1e-8) return;
          const t = cross(v, s) / d;
          const u = cross(v, ray) / d;
          if (t > 0 && u >= -1e-7 && u <= 1 + 1e-7) near = Math.min(near, t);
        });
        return [ray[0] * near, ray[1] * near];
      });
    }

    const square = radial([[-72, -72], [72, -72], [72, 72], [-72, 72]]);
    const forms = {
      brand: circle(76),
      studio: rotate(square, 45),
      production: radial([[-65, -78], [65, 0], [-65, 78]]),
      tech: square,
      "selected-work": radial([[0, -86], [74.478, -43], [74.478, 43], [0, 86], [-74.478, 43], [-74.478, -43]])
    };
    const origin = circle(76);

    function makeElement(tag, attributes, parent) {
      const el = document.createElementNS(NS, tag);
      Object.keys(attributes).forEach(function (k) { el.setAttribute(k, attributes[k]); });
      parent.append(el);
      return el;
    }

    function renderer(svg, key) {
      const group = makeElement("g", { fill: "none", stroke: "currentColor", "stroke-width": STROKE, "stroke-linejoin": "round" }, svg);
      const paths = [];
      for (let i = 0; i < 8; i++) paths.push(makeElement("path", {}, group));
      const caps = [];
      for (let i = 0; i < 16; i++) caps.push(makeElement("ellipse", { fill: "currentColor", stroke: "none" }, group));
      const dot = makeElement("circle", { r: STROKE / 2, fill: "currentColor", stroke: "none" }, group);
      function path(pts, index, closed) {
        const el = paths[index];
        el.style.display = "";
        el.setAttribute("d", "M" + pts.map(p => p[0].toFixed(3) + "," + p[1].toFixed(3)).join("L") + (closed ? "Z" : ""));
        if (!closed) {
          [0, 1].forEach(function (end) {
            const j = end ? pts.length - 1 : 0;
            const k = end ? j - 1 : 1;
            const p = pts[j], q = pts[k];
            const cap = caps[index * 2 + end];
            const angle = Math.atan2(p[1] - q[1], p[0] - q[0]) * 180 / Math.PI;
            cap.style.display = "";
            cap.setAttribute("cx", p[0]);
            cap.setAttribute("cy", p[1]);
            cap.setAttribute("rx", STROKE / 2 * ROUND);
            cap.setAttribute("ry", STROKE / 2);
            cap.setAttribute("transform", "rotate(" + angle + " " + p[0] + " " + p[1] + ")");
          });
        }
      }
      return function (progress) {
        paths.forEach(p => { p.style.display = "none"; });
        caps.forEach(p => { p.style.display = "none"; });
        dot.style.display = "none";
        const q = ease(progress);
        if (progress <= 0) { dot.style.display = ""; return; }
        if (forms[key]) {
          const body = blend(origin, forms[key], lock((progress - 0.1) / 0.9));
          const angle = (key === "studio" ? -45 : -10) * Math.pow(Math.sin(Math.PI * progress), 2);
          const pts = rotate(body.map(pt => [pt[0] * q, pt[1] * q]), angle);
          const xs = pts.map(p => p[0]);
          const ys = pts.map(p => p[1]);
          const cx = (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2;
          const cy = (Math.min.apply(null, ys) + Math.max.apply(null, ys)) / 2;
          path(pts.map(pt => [pt[0] - cx, pt[1] - cy]), 0, true);
        } else {
          const count = key === "campaigns" ? 8 : 4;
          const base = key === "xperience" ? 45 : 0;
          const index = -32 * Math.pow(Math.sin(Math.PI * progress), 2);
          for (let i = 0; i < count; i++) {
            const a = (-90 + base + i * 360 / count + index) * Math.PI / 180;
            const r = Math.max(0.001, 80 * q);
            path([[0, 0], [Math.cos(a) * r, Math.sin(a) * r]], i);
            caps[i * 2 + 1].setAttribute("rx", STROKE / 2 * mix(1, ROUND, q));
          }
        }
      };
    }

    const states = new Map();
    let active = null, pinned = null;

    buttons.forEach(function (button) {
      const card = button.closest(".svc-card");
      const svg = button.querySelector("svg");
      const key = button.dataset.category;
      const st = {
        key: key,
        button: button,
        card: card,
        draw: renderer(svg, key),
        phase: 1,
        ping: 0,
        reveal: false,
        revealStart: 0,
        settling: false,
        from: 1,
        left: 0
      };
      states.set(button, st);
      st.draw(1);
    });

    function choose(next) {
      if (next === active) return;
      const now = performance.now();
      active = next;
      states.forEach(function (st) {
        const key = st.key;
        const isActive = key === active;
        st.button.classList.toggle("is-active", isActive);
        if (st.button.tagName === "BUTTON") st.button.setAttribute("aria-pressed", String(key === pinned));
        if (isActive) {
          st.ping = now;
          st.settling = false;
          st.reveal = false;
          if (reduceMotion) { st.phase = 1; st.draw(1); }
        } else if (!st.reveal && st.phase !== 1) {
          st.from = st.phase;
          st.left = now;
          st.settling = true;
        }
      });
    }

    function tick(now) {
      states.forEach(function (st) {
        const key = st.key;
        if (key === active && st.button.closest(".profile-nav.is-docked")) {
          st.phase = 1; st.draw(1);
        } else if (key === active) {
          /* contract to the dot, then ping-pong (experiment timing) */
          const elapsed = (now - st.ping) / 1000;
          const period = 2.3;
          const cycle = elapsed % period;
          const phase = cycle < 0.95 ? 1 - cycle / 0.95
                      : cycle < 1.12 ? 0
                      : cycle < 2.07 ? (cycle - 1.12) / 0.95
                      : 1;
          st.phase = clamp(phase);
          st.draw(st.phase);
        } else if (st.reveal) {
          const p = (now - st.revealStart) / 1300;
          if (p >= 1) { st.reveal = false; st.phase = 1; st.draw(1); }
          else { st.phase = p; st.draw(p); }
        } else if (st.settling) {
          const q = ease((now - st.left) / 240);
          st.phase = mix(st.from, 1, q);
          st.draw(st.phase);
          if (q === 1) st.settling = false;
        }
      });
      requestAnimationFrame(tick);
    }

    if (reduceMotion) {
      states.forEach(function (st) { st.draw(1); });
      return;
    }

    const coarse = window.matchMedia("(hover: none)").matches;

    states.forEach(function (st) {
      const zone = st.button.closest(".svc-card") || st.button;
      zone.addEventListener("mouseenter", function () { choose(st.key); });
      zone.addEventListener("mouseleave", function () { choose(pinned || null); });
      st.button.addEventListener("focus", function () { choose(st.key); });
      st.button.addEventListener("blur", function () { if (pinned !== st.key) choose(pinned || null); });
      st.button.addEventListener("click", function (e) {
        if (coarse || e.pointerType === "touch") {
          pinned = pinned === st.key ? null : st.key;
          choose(pinned || st.key);
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { pinned = null; choose(null); }
    });
    document.addEventListener("pointerdown", function (e) {
      if (pinned && !e.target.closest(".svc-card, .work__symbol")) { pinned = null; choose(null); }
    });

    /* one-shot construct when a card scrolls into view */
    if ("IntersectionObserver" in window) {
      const all = Array.prototype.slice.call(document.querySelectorAll(".svc-card .symbol-btn"))
        .map(function (button) { return button.closest(".svc-card"); });
      const svcIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          let button, delay = 0;
          if (entry.target.classList.contains("svc-card")) {
            button = entry.target.querySelector(".symbol-btn");
            delay = (all.indexOf(entry.target) % 3) * 170;
          } else {
            button = entry.target;
          }
          const st = states.get(button);
          setTimeout(function () {
            if (st.key === active) return; // already animating via hover
            st.reveal = true;
            st.revealStart = performance.now();
          }, delay);
          svcIO.unobserve(entry.target);
        });
      }, { threshold: 0.35 });
      all.forEach(function (card) { svcIO.observe(card); });
      const hex = document.querySelector(".work__symbol");
      if (hex) svcIO.observe(hex);
    }

    requestAnimationFrame(tick);
  })();

  /* ----------------------------------------------------------
     services — direct SVG geometry morphs scrubbed by scroll
     ---------------------------------------------------------- */
  (function servicesScrollStory() {
    const section = document.querySelector(".services");
    const cards = Array.prototype.slice.call(document.querySelectorAll(".services__card"));
    const svg = document.querySelector(".services__morph-svg");
    const inner = section && section.querySelector(".services__inner");
    if (!section || !cards.length || !svg) return;

    const NS = "http://www.w3.org/2000/svg";
    const N = 192;
    const TAU = Math.PI * 2;
    const STRANDS = 8;
    const POINTS = 25;
    const STROKE = 19;
    const ROUNDNESS = 0.09;
    let ticking = false;
    const clamp01 = function (x) { return Math.max(0, Math.min(1, x)); };
    const mix = function (a, b, t) { return a + (b - a) * t; };
    const smooth = function (x) { x = clamp01(x); return x * x * x * (x * (x * 6 - 15) + 10); };
    const lock = function (x) {
      x = clamp01(x);
      return smooth(x) + 0.018 * Math.sin(4 * Math.PI * x) * Math.pow(Math.sin(Math.PI * x), 2);
    };

    function rotatePoint(point, degrees) {
      const angle = degrees * Math.PI / 180;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      return [point[0] * cosine - point[1] * sine, point[0] * sine + point[1] * cosine];
    }

    function roundedVertices(vertices) {
      const points = [];
      const corners = vertices.map(function (vertex, i) {
        const previous = vertices[(i + vertices.length - 1) % vertices.length];
        const next = vertices[(i + 1) % vertices.length];
        const previousDistance = Math.hypot(vertex[0] - previous[0], vertex[1] - previous[1]);
        const nextDistance = Math.hypot(vertex[0] - next[0], vertex[1] - next[1]);
        const trim = ROUNDNESS * 0.42 * Math.min(previousDistance, nextDistance);
        return {
          vertex: vertex,
          enter: [mix(vertex[0], previous[0], trim / previousDistance), mix(vertex[1], previous[1], trim / previousDistance)],
          exit: [mix(vertex[0], next[0], trim / nextDistance), mix(vertex[1], next[1], trim / nextDistance)]
        };
      });
      corners.forEach(function (corner, i) {
        for (let j = 0; j < 9; j++) {
          const t = j / 8;
          points.push([
            (1 - t) * (1 - t) * corner.enter[0] + 2 * (1 - t) * t * corner.vertex[0] + t * t * corner.exit[0],
            (1 - t) * (1 - t) * corner.enter[1] + 2 * (1 - t) * t * corner.vertex[1] + t * t * corner.exit[1]
          ]);
        }
        const nextEnter = corners[(i + 1) % corners.length].enter;
        for (let j = 1; j < 9; j++) {
          points.push([mix(corner.exit[0], nextEnter[0], j / 8), mix(corner.exit[1], nextEnter[1], j / 8)]);
        }
      });
      return points;
    }

    function cross(a, b) { return a[0] * b[1] - a[1] * b[0]; }

    function radial(vertices) {
      const outline = roundedVertices(vertices);
      return Array.from({ length: N }, function (_, i) {
        const angle = -Math.PI / 2 + i * TAU / N;
        const ray = [Math.cos(angle), Math.sin(angle)];
        let nearest = Infinity;
        outline.forEach(function (point, j) {
          const next = outline[(j + 1) % outline.length];
          const segment = [next[0] - point[0], next[1] - point[1]];
          const denominator = cross(ray, segment);
          if (Math.abs(denominator) < 1e-8) return;
          const distance = cross(point, segment) / denominator;
          const position = cross(point, ray) / denominator;
          if (distance > 0 && position >= -1e-7 && position <= 1 + 1e-7) nearest = Math.min(nearest, distance);
        });
        return [ray[0] * nearest, ray[1] * nearest];
      });
    }

    function circle(radius) {
      return Array.from({ length: N }, function (_, i) {
        const angle = -Math.PI / 2 + i * TAU / N;
        return [Math.cos(angle) * radius, Math.sin(angle) * radius];
      });
    }

    function contourStrands(contour) {
      return Array.from({ length: STRANDS }, function (_, strand) {
        return Array.from({ length: POINTS }, function (_, point) {
          return contour[(strand * 24 + point) % N];
        });
      });
    }

    function armStrands(angles) {
      return angles.map(function (angle) {
        const radians = angle * Math.PI / 180;
        return Array.from({ length: POINTS }, function (_, point) {
          const radius = 80 * point / (POINTS - 1);
          return [Math.cos(radians) * radius, Math.sin(radians) * radius];
        });
      });
    }

    const squareContour = radial([[-72, -72], [72, -72], [72, 72], [-72, 72]]);
    const forms = {
      dot: contourStrands(circle(0.001)),
      brand: contourStrands(circle(76)),
      design: armStrands([-90, -90, 0, 0, 90, 90, 180, 180]),
      tech: contourStrands(squareContour),
      studio: contourStrands(squareContour.map(function (point) { return rotatePoint(point, 45); })),
      campaigns: armStrands([-90, -45, 0, 45, 90, 135, 180, 225]),
      production: contourStrands(radial([[-65, -78], [65, 0], [-65, 78]])),
      xperience: armStrands([-45, -45, 45, 45, 135, 135, 225, 225])
    };

    const paths = Array.from({ length: STRANDS }, function () {
      const path = document.createElementNS(NS, "path");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "currentColor");
      path.setAttribute("stroke-width", STROKE);
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      svg.append(path);
      return path;
    });

    function setPath(path, points) {
      path.setAttribute("d", "M" + points.map(function (point) {
        return point[0].toFixed(3) + "," + point[1].toFixed(3);
      }).join("L"));
    }

    function drawSymbol(key) {
      forms[key].forEach(function (strand, i) { setPath(paths[i], strand); });
    }

    function drawTransition(fromKey, toKey, progress) {
      const source = forms[fromKey];
      const target = forms[toKey];
      const q = clamp01(progress);
      source.forEach(function (strand, i) {
        const delay = (i % 4) * 0.012;
        const local = lock((q - delay) / (1 - 0.036));
        const orbit = Math.sin(Math.PI * local);
        const rotation = (i % 2 ? 1 : -1) * 8 * orbit;
        const angle = -Math.PI / 2 + (i + 0.5) * TAU / STRANDS;
        const offset = 4.5 * orbit;
        const points = strand.map(function (point, j) {
          const destination = target[i][j];
          const blended = [mix(point[0], destination[0], local), mix(point[1], destination[1], local)];
          const rotated = rotatePoint(blended, rotation);
          return [rotated[0] + Math.cos(angle) * offset, rotated[1] + Math.sin(angle) * offset];
        });
        setPath(paths[i], points);
      });
    }

    // Static small symbols use the very same contours as the large indicator.
    cards.forEach(function (card) {
      const small = card.querySelector(".service-symbol");
      if (!small) return;
      forms[card.dataset.service].forEach(function (strand) {
        const path = document.createElementNS(NS, "path");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "currentColor");
        path.setAttribute("stroke-width", STROKE);
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        setPath(path, strand);
        small.append(path);
      });
    });

    let snapState = null;
    let settleTimer = 0;
    let snapFrame = 0;
    let snapping = false;
    let pointerDown = false;
    let touching = false;
    let lastScroll = window.scrollY;
    let direction = 1;
    const scopeLines = cards.map(function (card) {
      return Array.prototype.slice.call(card.querySelectorAll(".svc-card__scope li"));
    });

    function renderCards(step, morph) {
      cards.forEach(function (card, i) {
        const amount = i < step ? 1 : i === step ? morph : 0;
        const complete = amount >= 1;
        card.classList.toggle("is-complete", complete);
        card.classList.toggle("is-revealing", amount > 0 && !complete);
        card.classList.toggle("is-active", i === step);
        card.inert = !complete;
        card.setAttribute("aria-hidden", String(!complete));
        card.style.setProperty("--title-progress", smooth(amount / 0.2).toFixed(4));
        scopeLines[i].forEach(function (line, n) {
          // First line starts with the morph; the final line finishes exactly
          // at its endpoint. Scrubbing backwards reverses the same sequence.
          const delay = scopeLines[i].length > 1 ? n / (scopeLines[i].length - 1) * 0.68 : 0;
          const progress = smooth((amount - delay) / 0.32);
          line.style.setProperty("--line-progress", progress.toFixed(4));
        });
      });
      section.dataset.completed = String(Math.min(cards.length, step + (morph >= 1 ? 1 : 0)));
    }

    let visualPhase = null;
    let visualTarget = 0;
    let visualFrame = 0;
    let visualTime = 0;
    const DRIFT_TIME = 220;

    function paintPhase(phase) {
      const step = Math.min(cards.length - 1, Math.max(0, Math.ceil(phase) - 1));
      const morph = clamp01(phase - step);
      const from = step === 0 ? "dot" : cards[step - 1].dataset.service;
      drawTransition(from, cards[step].dataset.service, morph);
      renderCards(step, morph);
      section.dataset.morph = cards[step].dataset.service;
      section.dataset.morphComplete = String(morph === 1);
    }

    function driftTo(step, morph, immediate) {
      visualTarget = step + morph;
      if (immediate || visualPhase === null || Math.abs(visualTarget - visualPhase) < 0.0008) {
        cancelAnimationFrame(visualFrame);
        visualFrame = 0;
        visualPhase = visualTarget;
        paintPhase(visualPhase);
        section.dataset.drifting = "false";
        return;
      }
      if (visualFrame) return;
      visualTime = performance.now();
      section.dataset.drifting = "true";
      function drift(now) {
        const dt = Math.min(64, Math.max(0, now - visualTime));
        visualTime = now;
        // A frame-rate-independent trailing response gives the symbol weight.
        // Copy uses this same phase, so its final lines share the long tail.
        visualPhase += (visualTarget - visualPhase) * (1 - Math.exp(-dt / DRIFT_TIME));
        const arrived = Math.abs(visualTarget - visualPhase) < 0.0008;
        if (arrived) visualPhase = visualTarget;
        paintPhase(visualPhase);
        if (!arrived) visualFrame = requestAnimationFrame(drift);
        else {
          visualFrame = 0;
          section.dataset.drifting = "false";
        }
      }
      visualFrame = requestAnimationFrame(drift);
    }

    function flowStops() {
      const origin = inner.getBoundingClientRect().top + window.scrollY;
      const columns = getComputedStyle(section.querySelector(".services__list")).gridTemplateColumns.split(" ").length;
      const stops = [];
      cards.forEach(function (card, i) {
        const natural = origin + card.offsetTop + (i % columns) * 72 - innerHeight * 0.62;
        // Separate neighbours into complete, non-overlapping morphs.
        stops.push(i ? Math.max(natural, stops[i - 1] + 72) : natural);
      });
      return stops;
    }

    function update() {
      ticking = false;
      const fits = inner.scrollHeight <= innerHeight - 96;
      const sequenced = !reduceMotion && fits;
      const flowing = !reduceMotion && !fits;
      const mode = reduceMotion ? "static" : sequenced ? "pinned" : "flow";
      section.dataset.sequenceMode = mode;
      section.classList.toggle("is-sequenced", sequenced);
      section.classList.toggle("is-flowing", flowing);
      const rect = section.getBoundingClientRect();
      let step = 0;
      let morph = 0;
      if (reduceMotion) {
        cancelAnimationFrame(visualFrame);
        visualFrame = 0;
        renderCards(cards.length, 1);
        drawSymbol(cards[0].dataset.service);
        snapState = null;
      } else {
        let stops;
        let start;
        let end;
        if (flowing) {
          stops = flowStops();
          start = stops[0] - 120;
          end = stops[stops.length - 1] + 48;
          for (let i = 0; i < cards.length; i++) {
            const transitionStart = i ? stops[i - 1] + 16 : start;
            if (window.scrollY > transitionStart) {
              step = i;
              morph = clamp01((window.scrollY - transitionStart) / (stops[i] - transitionStart));
            }
          }
        } else {
          const distance = Math.max(1, section.offsetHeight - inner.offsetHeight);
          start = rect.top + window.scrollY - 96;
          end = start + distance;
          const timeline = clamp01((window.scrollY - start) / distance) * cards.length;
          step = Math.min(cards.length - 1, Math.floor(timeline));
          const local = timeline >= cards.length ? 1 : timeline - step;
          morph = clamp01(local / 0.72);
          stops = cards.map(function (_, i) { return start + distance * (i + 0.86) / cards.length; });
        }
        driftTo(step, morph, rect.bottom <= 0 || rect.top >= innerHeight);
        snapState = { step: step, progress: morph, stops: stops, start: start, end: end, mode: mode };
      }
      svg.classList.add("is-visible");
      svg.style.opacity = "1";
    }

    function queueUpdate() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    function cancelSnap() {
      clearTimeout(settleTimer);
      cancelAnimationFrame(snapFrame);
      snapFrame = 0;
      snapping = false;
      section.dataset.snapping = "false";
    }

    function settle() {
      if (reduceMotion || snapping || pointerDown || touching || document.hidden) return;
      update();
      const state = snapState;
      const y = window.scrollY;
      if (!state || y <= state.start || y >= state.end) return;
      // The first and last stops are open boundaries: normal scrolling can
      // leave the section in either direction without being pulled back.
      if (direction < 0 && y <= state.stops[0]) return;
      if (direction > 0 && y >= state.stops[state.stops.length - 1]) return;
      const index = state.progress < 1 && direction < 0 ? state.step - 1 : state.step;
      if (index < 0) return;
      const target = Math.ceil(state.stops[index] + 0.5);
      const distance = target - y;
      if (Math.abs(distance) < 2 && state.progress === 1) return;
      const began = performance.now();
      const duration = Math.min(1500, Math.max(1050, Math.abs(distance) * 2.4));
      snapping = true;
      section.dataset.snapping = "true";
      section.dataset.snapTarget = cards[index].dataset.service;
      function animate(now) {
        const elapsed = clamp01((now - began) / duration);
        window.scrollTo({ top: mix(y, target, smooth(elapsed)), behavior: "instant" });
        update();
        if (elapsed < 1) snapFrame = requestAnimationFrame(animate);
        else {
          snapFrame = 0;
          snapping = false;
          lastScroll = window.scrollY;
          section.dataset.snapping = "false";
        }
      }
      snapFrame = requestAnimationFrame(animate);
    }

    function armSettle() {
      clearTimeout(settleTimer);
      if (!reduceMotion && !snapping && !pointerDown && !touching) settleTimer = setTimeout(settle, 180);
    }

    window.addEventListener("scroll", function () {
      const y = window.scrollY;
      if (!snapping && Math.abs(y - lastScroll) > 0.5) direction = y > lastScroll ? 1 : -1;
      lastScroll = y;
      queueUpdate();
      armSettle();
    }, { passive: true });
    window.addEventListener("wheel", function (event) {
      cancelSnap();
      if (Math.abs(event.deltaY) > 0.5) direction = event.deltaY > 0 ? 1 : -1;
    }, { passive: true });
    window.addEventListener("pointerdown", function () { pointerDown = true; cancelSnap(); }, { passive: true });
    window.addEventListener("pointerup", function () { pointerDown = false; armSettle(); }, { passive: true });
    window.addEventListener("pointercancel", function () { pointerDown = false; armSettle(); }, { passive: true });
    window.addEventListener("touchstart", function () { touching = true; cancelSnap(); }, { passive: true });
    window.addEventListener("touchend", function () { touching = false; armSettle(); }, { passive: true });
    window.addEventListener("touchcancel", function () { touching = false; armSettle(); }, { passive: true });
    window.addEventListener("keydown", function (event) {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " ", "Tab", "Enter", "Escape"].indexOf(event.key) >= 0) { cancelSnap(); armSettle(); }
    });
    window.addEventListener("click", function () { cancelSnap(); armSettle(); }, { capture: true });
    window.addEventListener("resize", function () { cancelSnap(); cancelAnimationFrame(visualFrame); visualFrame = 0; visualPhase = null; queueUpdate(); });
    if (document.fonts) document.fonts.ready.then(queueUpdate);

    /* belt-and-braces: whenever the section (or its edges) are near the
       viewport, force an update and make the stage symbol visible even if
       scroll-position logic stalls (fast wheel, momentum scrolling) */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          svg.classList.add("is-visible");
          queueUpdate();
        });
      }, { rootMargin: "25% 0px 25% 0px" }).observe(section);
    }

    queueUpdate();
  })();

  /* ----------------------------------------------------------
     scroll reveals
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }
})();
