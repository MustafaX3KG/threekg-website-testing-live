/* Website navigation and opening sequence. Portfolio filters stay in profile.js. */
(function () {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');
  const navLinks = Array.from(document.querySelectorAll('.website-nav a'));
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
  let navQueued = false;
  function updateHeader() {
    navQueued = false;
    if (!header) return;
    header.classList.toggle('is-scrolled', scrollY > 24);
    let active = -1;
    sections.forEach((section, i) => { if (section && section.getBoundingClientRect().top < innerHeight * .38) active = i; });
    const team = document.getElementById('team');
    if (team && team.getBoundingClientRect().top < innerHeight * .38 && team.getBoundingClientRect().bottom > innerHeight * .38) active = 0;
    navLinks.forEach((link, i) => { if (i === active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  }
  window.addEventListener('scroll', () => { if (!navQueued) { navQueued = true; requestAnimationFrame(updateHeader); } }, { passive: true });
  updateHeader();
  matchMedia('(min-width: 901px)').addEventListener('change', event => {
    if (event.matches && document.body.classList.contains('menu-open')) document.querySelector('.menu__close').click();
  });

  const hero = document.querySelector('.website-hero');
  if (!hero) return;
  if (!reduced.matches) {
    hero.classList.add('has-hero-motion');
    function enter() {
      requestAnimationFrame(() => hero.classList.add('hero--entered'));
      setTimeout(() => hero.classList.add('hero--impact'), 1650);
    }
    if (document.body.classList.contains('is-loading')) document.addEventListener('3kg:ready', enter, { once: true });
    else enter();
  }

  const carousel = hero.querySelector('.hero-feature');
  const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
  let activeSlide = 0;
  carousel.dataset.active = "0";
  function showSlide(index) {
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== activeSlide; slide.classList.toggle('is-active', i === activeSlide); });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === activeSlide)));
    carousel.dataset.active = String(activeSlide);
    document.getElementById('heroCurrent').textContent = String(activeSlide + 1).padStart(2,'0');
    queueFilm();
  }
  dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
  carousel.querySelector('[data-hero-prev]').addEventListener('click', () => showSlide(activeSlide - 1));
  carousel.querySelector('[data-hero-next]').addEventListener('click', () => showSlide(activeSlide + 1));
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); showSlide(activeSlide + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  let swipeStart;
  carousel.addEventListener('pointerdown', event => { if (event.pointerType === 'touch') swipeStart = [event.clientX, event.clientY]; });
  carousel.addEventListener('pointerup', event => {
    if (!swipeStart) return;
    const dx = event.clientX - swipeStart[0], dy = event.clientY - swipeStart[1]; swipeStart = null;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) showSlide(activeSlide + (dx < 0 ? 1 : -1));
  });
  carousel.addEventListener('pointercancel', () => { swipeStart = null; });

  const film = document.getElementById('brandFilm');
  let filmQueued = false;
  let wantedTime = 0;
  function updateFilm() {
    filmQueued = false;
    if (reduced.matches || activeSlide !== 0 || !Number.isFinite(film.duration)) return;
    const rect = hero.getBoundingClientRect();
    const viewport = hero.querySelector('.hero__viewport');
    const distance = Math.max(innerHeight * .35, hero.offsetHeight - viewport.offsetHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / distance));
    wantedTime = progress * Math.max(0, film.duration - .05);
    if (!film.seeking && Math.abs(film.currentTime - wantedTime) > .035) {
      try { film.currentTime = wantedTime; } catch (_) { /* Poster remains visible until media is ready. */ }
    }
  }
  function queueFilm() { if (!filmQueued) { filmQueued = true; requestAnimationFrame(updateFilm); } }
  film.addEventListener('loadedmetadata', queueFilm);
  film.addEventListener('seeked', () => { if (Math.abs(film.currentTime - wantedTime) > .035) queueFilm(); });
  window.addEventListener('scroll', queueFilm, { passive: true });
  window.addEventListener('resize', queueFilm);
  queueFilm();
})();

(function interactiveTeam() {
  'use strict';
  const group = document.querySelector('.team-interactive');
  if (!group) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const people = Array.from(group.querySelectorAll('.team-hotspot'));
  const cursor = document.querySelector('.cursor');
  let pinned = null, active = null, frame;
  function activate(person) {
    active = person;
    if (person) {
      const bounds = group.getBoundingClientRect();
      const anchor = bounds.left + bounds.width * parseFloat(person.style.getPropertyValue('--person-x')) / 100;
      const half = person.querySelector('.team-hotspot__label').offsetWidth / 2;
      const offset = Math.max(bounds.left + half + 4 - anchor,Math.min(bounds.right - half - 4 - anchor,0));
      const stem = innerWidth <= 700 ? 26 : 38;
      person.style.setProperty('--magnet-x',offset + 'px');
      person.style.setProperty('--leader-angle',Math.atan2(offset,stem) * 180 / Math.PI + 'deg');
      person.style.setProperty('--leader-length',Math.hypot(offset,stem) + 'px');
    }
    people.forEach(item => { const on = item === person; item.classList.toggle('is-active', on); item.setAttribute('aria-expanded', String(on)); });
    group.querySelectorAll('.team-photo-color').forEach(layer => layer.classList.toggle('is-active', layer.dataset.person === person?.dataset.person));
  }
  function reset(person) {
    ['--magnet-x','--magnet-y','--leader-angle','--leader-length'].forEach(name => person?.style.removeProperty(name));
  }
  group.addEventListener('pointerenter', () => cursor?.classList.add('is-team-hidden'));
  group.addEventListener('pointerleave', () => { cursor?.classList.remove('is-team-hidden'); if (frame) cancelAnimationFrame(frame); reset(active); if (!pinned) activate(null); });
  group.querySelectorAll('.team-photo-hit').forEach(hit => {
    const person = people.find(item => item.dataset.person === hit.dataset.person);
    hit.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { pinned = null; reset(active); activate(person); } });
    hit.addEventListener('pointerleave', () => { if (!pinned) { reset(person); activate(null); } });
    hit.addEventListener('click', event => {
      if (event.pointerType === 'touch' || !matchMedia('(hover:hover)').matches) { pinned = pinned === person ? null : person; activate(pinned); }
      else activate(person);
    });
  });
  group.addEventListener('pointermove', event => {
    if (!active || reduced.matches || pinned) return;
    if (frame) cancelAnimationFrame(frame);
    const person = active, x = event.clientX, y = event.clientY;
    frame = requestAnimationFrame(() => {
      if (active !== person) return;
      const rect = group.getBoundingClientRect();
      const anchorX = rect.left + rect.width * parseFloat(person.style.getPropertyValue('--person-x')) / 100;
      const anchorY = rect.top + rect.height * parseFloat(person.style.getPropertyValue('--person-y')) / 100;
      let mx = Math.max(-10,Math.min(10,(x-anchorX)*.13));
      const my = Math.max(-6,Math.min(6,(y-anchorY)*.1));
      const labelHalf = person.querySelector('.team-hotspot__label').offsetWidth / 2;
      mx = Math.max(rect.left + labelHalf + 4 - anchorX,Math.min(rect.right-labelHalf-4-anchorX,mx));
      const stem = innerWidth <= 700 ? 26 : 38;
      person.style.setProperty('--magnet-x',mx+'px'); person.style.setProperty('--magnet-y',my+'px');
      person.style.setProperty('--leader-angle',Math.atan2(mx,stem-my)*180/Math.PI+'deg');
      person.style.setProperty('--leader-length',Math.hypot(mx,stem-my)+'px');
    });
  });
  people.forEach(person => {
    person.addEventListener('focus', () => { pinned = null; activate(person); });
    person.addEventListener('blur', () => { if (!pinned) activate(null); });
    person.addEventListener('click', () => { pinned = pinned === person ? null : person; activate(pinned); });
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { pinned = null; reset(active); activate(null); } });
  document.addEventListener('pointerdown', event => { if (!group.contains(event.target)) { pinned = null; reset(active); activate(null); } });
})();
