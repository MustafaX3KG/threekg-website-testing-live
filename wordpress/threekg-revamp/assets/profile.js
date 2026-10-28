/* Content and navigation aligned with the approved 3KG profile, Audit 02 R02.1. */
(function () {
  'use strict';
  const data = window.ThreeKGProfile;
  const work = document.querySelector('[data-profile-work]');
  const assetRoot = new URL('../', document.currentScript.src);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (work) document.body.classList.add('profile-aligned');

  const clientTiles = Array.from(document.querySelectorAll('.client-tile'));
  clientTiles.forEach(function (tile) {
    tile.addEventListener('click', function () {
      const open = tile.getAttribute('aria-expanded') !== 'true';
      clientTiles.forEach(function (item) { item.setAttribute('aria-expanded', String(item === tile && open)); });
    });
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') clientTiles.forEach(function (tile) { tile.setAttribute('aria-expanded', 'false'); });
  });

  if (!data || !work) return;
  const cards = Array.from(work.querySelectorAll('[data-project]'));
  const filters = Array.from(document.querySelectorAll('[data-work-filter]'));
  const count = document.getElementById('workCount');
  const more = document.getElementById('showAllWork');
  const dialog = document.getElementById('projectDialog');
  let category = 'all';
  let expanded = false;
  let activeProject = null;
  let opener = null;
  let returnHash = '#work';

  function filterWork(key, showAll) {
    category = key === 'all' || data.categories[key] ? key : 'all';
    expanded = Boolean(showAll);
    let shown = 0;
    let total = 0;
    cards.forEach(function (card) {
      const match = category === 'all' || card.dataset.workCategory === category;
      if (match) total++;
      card.hidden = !match || (category === 'all' && !expanded && shown >= 6);
      if (!card.hidden) {
        shown++;
        card.classList.add('is-in');
      }
    });
    filters.forEach(function (button) {
      const selected = button.dataset.workFilter === category;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    count.textContent = String(shown).padStart(2, '0') + ' / ' + total + ' projects' +
      (category === 'all' ? '' : ' · ' + data.categories[category]);
    more.hidden = category !== 'all' || expanded;
  }

  function projectList() {
    return data.projects.filter(function (project) {
      return category === 'all' || project.category === category;
    });
  }
  function text(id, content) { document.getElementById(id).textContent = content; }
  function openProject(id) {
    const project = data.projects.find(function (item) { return item.id === id; });
    if (!project) return;
    activeProject = project;
    text('projectTitle', project.name);
    text('projectSubtitle', project.title);
    text('projectCategory', data.categories[project.category] + ' / ' + project.name);
    const film = document.getElementById('projectFilm');
    film.hidden = !project.video;
    if (project.video) film.href = project.video;
    else film.removeAttribute('href');
    const hero = document.getElementById('projectHero');
    const gallery = document.getElementById('projectGallery');
    hero.replaceChildren(); gallery.replaceChildren();
    function artwork(item, index, isHero) {
      const figure = document.createElement('figure'); figure.className = isHero ? 'case-hero__figure' : 'case-figure';
      const button = document.createElement('button'); button.type = 'button'; button.className = 'case-image';
      button.setAttribute('aria-label','Enlarge image ' + (index + 1) + ': ' + item.alt);
      const image = document.createElement('img'); image.src = new URL(item.src,assetRoot).href; image.alt = item.alt;
      image.loading = isHero ? 'eager' : 'lazy'; image.decoding = 'async';
      image.width = item.width; image.height = item.height;
      const zoom = document.createElement('span'); zoom.className = 'case-image__zoom'; zoom.textContent = '↗'; zoom.setAttribute('aria-hidden','true');
      button.append(image,zoom); button.addEventListener('click',() => openImage(index)); figure.append(button);
      if (isHero && item.status?.startsWith('Work in progress')) { const note = document.createElement('figcaption'); note.className = 'case-hero__note'; note.textContent = 'Product presentation study · Work in progress'; figure.append(note); }
      if (!isHero) { const caption = document.createElement('figcaption'); caption.textContent = item.alt + (item.status?.startsWith('Work in progress') ? ' · Work in progress' : ''); figure.append(caption); }
      return figure;
    }
    project.images.forEach((item,index) => { if (index === 0) hero.append(artwork(item,index,true)); else gallery.append(artwork(item,index,false)); });
    hero.hidden = project.images.length === 0;
    document.querySelector('.case-work').hidden = project.images.length < 2;
    document.getElementById('projectGalleryJump').hidden = project.images.length < 2;
    text('projectImageCount',String(project.images.length).padStart(2,'0') + ' images');
    const body = document.getElementById('projectBody'); body.replaceChildren();
    project.body.forEach(paragraph => { const p = document.createElement('p'); p.textContent = paragraph; body.append(p); });
    const noStory = project.body.length === 0 && !project.video;
    document.querySelector('.case-overview').hidden = noStory;
    document.querySelector('.project-dialog__copy').classList.toggle('has-no-story',noStory);
    const meta = document.getElementById('projectMeta'); meta.replaceChildren();
    Object.entries(project.meta).filter(entry => entry[0] !== 'Scope').forEach(entry => {
      const div = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd');
      dt.textContent = entry[0]; dd.textContent = entry[1]; div.append(dt,dd); meta.append(div);
    });
    const scope = document.getElementById('projectScope'); scope.replaceChildren();
    if (project.meta.Scope) {
      const title = document.createElement('h3'); title.textContent = 'What we did'; const list = document.createElement('ul');
      project.meta.Scope.split(' · ').forEach(item => { const li = document.createElement('li'); li.textContent = item; list.append(li); }); scope.append(title,list);
    }
    const story = document.getElementById('projectStory'); story.replaceChildren();
    story.hidden = !project.storySections?.length;
    if (project.storySections?.length) {
      const heading = document.createElement('h3'); heading.textContent = 'The story.'; story.append(heading);
      project.storySections.forEach((section,index) => {
        const detail = document.createElement('details'); detail.className = 'case-chapter'; detail.name = 'project-story'; detail.open = index === 0;
        const summary = document.createElement('summary'); summary.textContent = section.title;
        const indicator = document.createElement('span'); indicator.className = 'case-chapter__indicator'; indicator.setAttribute('aria-hidden','true'); summary.append(indicator);
        const copy = document.createElement('div'); copy.className = 'case-chapter__copy';
        (section.paragraphs || []).forEach(paragraph => { const p = document.createElement('p'); p.textContent = paragraph; copy.append(p); });
        if (section.items?.length) { const ul = document.createElement('ul'); section.items.forEach(item => { const li = document.createElement('li'); li.textContent = item; ul.append(li); }); copy.append(ul); }
        detail.append(summary,copy); story.append(detail);
      });
    }
    const motion = document.getElementById('projectMotion');
    motion.querySelectorAll('video').forEach(video => video.pause()); motion.replaceChildren(); motion.hidden = !project.motion?.length;
    (project.motion || []).forEach(item => {
      const figure = document.createElement('figure'); const video = document.createElement('video');
      video.controls = true; video.playsInline = true; video.preload = 'none'; video.src = new URL(item.src,assetRoot).href;
      if (item.poster) video.poster = new URL(item.poster,assetRoot).href;
      video.width = item.width; video.height = item.height; video.setAttribute('aria-label',item.title);
      const caption = document.createElement('figcaption'); caption.textContent = item.caption || item.title; figure.append(video,caption); motion.append(figure);
    });
    // A direct project link can refer to a category outside the last active filter.
    if (category !== 'all' && project.category !== category) filterWork(project.category, true);
    const list = projectList();
    text('projectPosition', (list.indexOf(project) + 1) + ' / ' + list.length);
    document.getElementById('prevProject').disabled = list.length < 2;
    document.getElementById('nextProject').disabled = list.length < 2;
    const next = list[(list.indexOf(project) + 1) % list.length];
    text('nextProjectName',next.name);
    const nextImage = document.getElementById('nextProjectImage'); nextImage.hidden = !next.images.length;
    if (next.images.length) nextImage.src = new URL(next.images[0].src,assetRoot).href; else nextImage.removeAttribute('src');
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    document.body.classList.add('project-open');
    document.getElementById('closeProject').focus({ preventScroll: true });
  }
  function closeProject(updateHistory) {
    document.querySelectorAll('#projectMotion video').forEach(video => video.pause());
    if (lightbox.open) lightbox.close();
    if (dialog.open) dialog.close();
    document.body.classList.remove('project-open');
    activeProject = null;
    if (updateHistory) history.pushState(null, '', returnHash);
    if (opener && !opener.hidden) opener.focus({ preventScroll: true });
    else if (updateHistory) document.getElementById('work').scrollIntoView({ behavior: 'instant' });
  }
  function readLocation() {
    const hash = location.hash;
    if (hash.startsWith('#project-')) openProject(hash.slice(9));
    else {
      if (dialog.open) closeProject(false);
      if (hash.startsWith('#work-')) filterWork(hash.slice(6), true);
      else if (hash === '#work') filterWork('all', false);
    }
  }
  document.querySelectorAll('[data-filter], [data-work-filter]').forEach(function (control) {
    control.addEventListener('click', function (event) {
      event.preventDefault();
      const key = control.dataset.filter || control.dataset.workFilter;
      filterWork(key, key !== 'all');
      const hash = key === 'all' ? '#work' : '#work-' + key;
      history.pushState(null, '', hash);
      document.getElementById('work').scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth' });
    });
  });
  cards.forEach(function (card) {
    card.addEventListener('click', function (event) {
      event.preventDefault();
      opener = card;
      returnHash = category === 'all' ? '#work' : '#work-' + category;
      history.pushState(null, '', card.getAttribute('href'));
      openProject(card.dataset.project);
    });
  });
  more.addEventListener('click', function () { filterWork('all', true); });
  document.getElementById('closeProject').addEventListener('click', function () { closeProject(true); });
  dialog.addEventListener('cancel', function (event) { event.preventDefault(); closeProject(true); });
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeProject(true);
    }
  });
  function adjacent(direction) {
    if (!activeProject) return;
    const list = projectList();
    const next = list[(list.indexOf(activeProject) + direction + list.length) % list.length];
    history.pushState(null, '', '#project-' + next.id);
    openProject(next.id);
  }
  document.getElementById('prevProject').addEventListener('click', function () { adjacent(-1); });
  document.getElementById('nextProject').addEventListener('click', function () { adjacent(1); });
  // An image viewer keeps detail inspection inside the case study.
  const lightbox = document.getElementById('projectLightbox');
  let imageIndex = 0;
  function renderImage() {
    const item = activeProject?.images[imageIndex]; if (!item) return;
    const image = document.getElementById('projectLargeImage'); image.src = new URL(item.src,assetRoot).href; image.alt = item.alt;
    document.getElementById('projectLargeCaption').textContent = (imageIndex + 1) + ' / ' + activeProject.images.length + ' — ' + item.alt + (item.status?.startsWith('Work in progress') ? ' · Work in progress' : '');
    ['prevProjectImage','nextProjectImage'].forEach(id => document.getElementById(id).hidden = activeProject.images.length < 2);
  }
  function openImage(index) { imageIndex = index; renderImage(); if (!lightbox.open) lightbox.showModal(); }
  function changeImage(direction) { if (!activeProject?.images.length) return; imageIndex = (imageIndex + direction + activeProject.images.length) % activeProject.images.length; renderImage(); }
  document.getElementById('closeProjectImage').addEventListener('click',() => lightbox.close());
  document.getElementById('prevProjectImage').addEventListener('click',() => changeImage(-1));
  document.getElementById('nextProjectImage').addEventListener('click',() => changeImage(1));
  lightbox.addEventListener('click',event => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('keydown',event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); changeImage(event.key === 'ArrowRight' ? 1 : -1); } });
  document.getElementById('projectGalleryJump').addEventListener('click',event => {
    event.preventDefault(); document.getElementById('case-gallery').scrollIntoView({behavior:reduced.matches ? 'instant' : 'smooth'});
  });
  let progressQueued = false;
  function updateProgress() { progressQueued = false; const distance = dialog.scrollHeight - dialog.clientHeight; dialog.style.setProperty('--case-progress',distance > 0 ? dialog.scrollTop / distance : 0); }
  dialog.addEventListener('scroll',() => { if (!progressQueued) { progressQueued = true; requestAnimationFrame(updateProgress); } },{passive:true});
  window.addEventListener('resize',updateProgress);
  window.addEventListener('popstate', readLocation);
  window.addEventListener('hashchange', readLocation);
  filterWork('all', false);
  readLocation();
})();
