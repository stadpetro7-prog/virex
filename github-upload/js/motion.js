/* =========================================================
   VIREX — motion layer. Loaded after main.js; touches only presentation.
   Everything is skipped for prefers-reduced-motion.
   ========================================================= */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  const desktop = matchMedia('(min-width: 901px)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const setD = (el, d) => el.style.setProperty('--d', d + 's');

  /* ---------- 1. text: split headings into masked lines ---------- */
  const splitLines = (el) => {
    if (el.dataset.split) return;
    const lines = [[]];
    [...el.childNodes].forEach((n) => (n.nodeName === 'BR' ? lines.push([]) : lines[lines.length - 1].push(n)));
    el.textContent = '';
    lines.forEach((nodes, i) => {
      const ln = document.createElement('span'); ln.className = 'ln';
      const inner = document.createElement('span'); inner.className = 'ln__i'; inner.style.setProperty('--i', i);
      nodes.forEach((n) => inner.append(n));
      ln.append(inner); el.append(ln);
    });
    el.dataset.split = '1';
  };

  /* copy blocks: eyebrow -> heading -> paragraph arrive one after another instead of as one slab */
  const choreograph = (box, base = 0, step = 0.1) => {
    if (!box) return;
    box.removeAttribute('data-reveal');
    [...box.children].forEach((c, i) => {
      setD(c, base + i * step);
      if (c.matches('.h2')) splitLines(c);
      c.setAttribute('data-reveal', '');
    });
  };
  $$('.about__text, .why__copy, .collection__copy, .mark__copy, .tech__copy, .brand__copy, .faq__copy').forEach((b) => choreograph(b));
  choreograph($('.faq__list'), 0.05, 0.09);
  choreograph($('.promise'), 0, 0.1);
  $$('.products__head .h2, .reviews__head .h2').forEach((h) => { splitLines(h); h.setAttribute('data-reveal', ''); });
  const bt = $('.banner__title'); if (bt) { splitLines(bt); bt.setAttribute('data-reveal', ''); }
  const fb = $('.footer__big'); if (fb) { splitLines(fb); fb.setAttribute('data-reveal', ''); }
  $$('.products__head .eyebrow, .reviews__head .eyebrow, .reviews__sum, .banner__sub, .banner__cta, .ready__copy, .brand__values li, .footer__lead, .footer__promise-copy .eyebrow').forEach((e, i) => {
    if (!e.closest('[data-reveal]')) { setD(e, e.matches('.banner__cta') ? 0.5 : e.matches('.banner__sub') ? 0.35 : e.matches('.brand__values li') ? (i % 3) * 0.08 : 0.05); e.setAttribute('data-reveal', ''); }
  });
  $$('.stats > div').forEach((d, i) => d.style.setProperty('--k', i));
  $$('.support__chips li').forEach((d, i) => d.style.setProperty('--k', i));
  window.virex && window.virex.reveal && window.virex.reveal();

  /* ---------- 2. own observer: photo wipes, soft dissolves, banner, counters ---------- */
  const tag = (sel, attr, val = '', delayStep = 0, delayBase = 0) => $$(sel).forEach((el, i) => {
    el.setAttribute(attr, val); if (delayStep || delayBase) setD(el, delayBase + i * delayStep);
  });
  tag('.mark__tee', 'data-wipe', 'l');
  tag('.mark__badge', 'data-wipe', 'u', 0, 0.25);
  tag('.trio img', 'data-trio', '', 0.16);
  $$('.trio img').forEach((el) => el.classList.add('trio-img'));
  tag('.about__photo', 'data-soft');
  tag('.why__visual', 'data-soft');
  tag('.tech__photo', 'data-soft');
  tag('.brand__photo', 'data-soft');
  tag('.ready__img', 'data-soft');
  tag('.banner', 'data-watch');
  tag('.stats', 'data-watch');
  tag('.support', 'data-watch');

  /* clip-path'ed elements report zero visibility, so those are observed through their parent */
  const proxy = new Map();
  const watch = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const hit = proxy.get(en.target) || [en.target];
    hit.forEach((el) => { el.classList.add('is-in'); if (el.matches('.stats')) countUp(el); });
    watch.unobserve(en.target);
  }), { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  $$('[data-wipe], [data-soft], [data-watch], .trio img').forEach((el) => {
    const clipped = el.matches('[data-wipe], .trio img');
    const host = clipped ? el.parentElement : el;
    if (clipped) proxy.set(host, [...(proxy.get(host) || []), el]);
    watch.observe(host);
  });

  /* ---------- 3. counters: 10K+ / 5★ / 100% / 24h ---------- */
  const countUp = (stats) => $$('dd', stats).forEach((dd, k) => {
    const node = [...dd.childNodes].find((n) => n.nodeType === 3 && /\d/.test(n.nodeValue));
    if (!node) return;
    const m = node.nodeValue.match(/^(\d+)(.*)$/); if (!m) return;
    const to = +m[1], tail = m[2], t0 = performance.now() + k * 140, dur = 1700;
    node.nodeValue = '0' + tail;
    const tick = (now) => {
      const t = clamp((now - t0) / dur);
      node.nodeValue = Math.round(to * (1 - Math.pow(2, -10 * t) * (1 - t))) + tail;   // fast start, soft landing
      if (t < 1) requestAnimationFrame(tick); else node.nodeValue = to + tail;
    };
    requestAnimationFrame(tick);
  });

  /* ---------- 4. shimmer for the blue chapters ---------- */
  ['.tech', '.brand'].forEach((sel) => {
    const s = $(sel); if (!s) return;
    const sh = document.createElement('div'); sh.className = 'shimmer'; sh.setAttribute('aria-hidden', 'true');
    sh.append(document.createElement('i')); s.prepend(sh);
  });

  /* ---------- 5. scroll engine: progress bar, nav spy, parallax ---------- */
  const bar = document.createElement('div'); bar.className = 'progress'; bar.setAttribute('aria-hidden', 'true'); document.body.append(bar);
  const spy = [['products', 'products'], ['technology', 'technology'], ['about', 'about'], ['reviews', 'reviews'], ['faq', 'faq']]
    .map(([id]) => ({ sec: document.getElementById(id), link: $(`.nav a[href="#${id}"]`) })).filter((x) => x.sec && x.link);

  const hero = $('.hero'), people = $('.hero__people'), vShape = $('.hero__v'), heroCopy = $('.hero__copy');
  const layers = [];
  const add = (sel, k, opt = {}) => $$(sel).forEach((el) => layers.push({ el, k, host: opt.host ? el.closest(opt.host) : el.parentElement, rot: opt.rot || 0 }));
  add('.about__photo > img', 44); add('.why__visual > img', 30); add('.tech__photo > img', 44); add('.brand__photo > img', 50);
  add('.ready__img', 20); add('.banner__img', 70, { host: '.banner' });
  const trio = $$('.trio img');
  [-70, 40, -110].forEach((k, i) => trio[i] && layers.push({ el: trio[i], k, host: trio[i].parentElement }));
  add('.mark__tee', 26, { host: '.mark' }); add('.mark__badge', -80, { host: '.mark' });
  add('.mark__ghost', 120, { host: '.mark', rot: 60 });
  add('.stats', -30, { host: '.collection' });
  add('.support', -40, { host: '.faq' });
  const brandLogo = $('.brand__logo');

  let ticking = false, vh = innerHeight;
  const frame = () => {
    ticking = false;
    const sy = scrollY, h = document.documentElement.scrollHeight - vh;
    bar.style.transform = `scaleX(${h > 0 ? clamp(sy / h) : 0})`;

    // nav spy
    let cur = null; spy.forEach((x) => { if (x.sec.getBoundingClientRect().top < vh * 0.4) cur = x; });
    spy.forEach((x) => x.link.classList.toggle('is-active', x === cur));

    if (!desktop.matches) return;
    if (hero && sy < vh * 1.3) {
      if (people) people.style.translate = `0 ${sy * 0.14}px`;
      if (vShape) vShape.style.translate = `0 ${sy * -0.1}px`;
      if (heroCopy) { heroCopy.style.translate = `0 ${sy * -0.16}px`; heroCopy.style.opacity = String(1 - clamp(sy / (vh * 0.8)) * 0.85); }
    }
    layers.forEach((L) => {
      const r = L.host.getBoundingClientRect();
      if (r.bottom < -300 || r.top > vh + 300) return;
      const p = clamp((vh - r.top) / (vh + r.height), -0.2, 1.2);           // 0 = entering, 1 = leaving
      L.el.style.translate = `0 ${((0.5 - p) * 2 * L.k).toFixed(1)}px`;
      if (L.rot) L.el.style.rotate = `${((p - 0.5) * L.rot).toFixed(1)}deg`;
    });
    if (brandLogo) {
      const r = brandLogo.parentElement.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh * 0.9 + r.height * 0.4));
      brandLogo.style.rotate = `${((1 - p) * 22).toFixed(1)}deg`;
      brandLogo.style.translate = `${((1 - p) * 70).toFixed(0)}px ${((1 - p) * 140).toFixed(0)}px`;
      brandLogo.style.opacity = String(clamp(p * 1.6));
    }
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', () => { vh = innerHeight; req(); });
  frame();

  /* ---------- 6. pointer: magnetic buttons, product spotlight ---------- */
  if (fine.matches && desktop.matches) {
    $$('.btn, .cart-pill').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.translate = `${clamp((e.clientX - r.left - r.width / 2) * 0.18, -9, 9)}px ${clamp((e.clientY - r.top - r.height / 2) * 0.28, -7, 7)}px`;
      });
      b.addEventListener('pointerleave', () => { b.style.translate = ''; });
    });
    document.addEventListener('pointermove', (e) => {          // delegated: cards can be re-rendered by filters
      const t = e.target.closest && e.target.closest('.product__img'); if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', `${e.clientX - r.left}px`); t.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  /* ---------- 7. fly-to-cart: the product photo arcs into the header cart ---------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add'); const pill = $('#cartPill');
    if (!btn || !pill || !btn.dataset.name || !btn.animate) return;
    const card = btn.closest('.product, .pdp'); const img = card && $('img', card); if (!img) return;
    const a = img.getBoundingClientRect(), b = pill.getBoundingClientRect(), size = Math.min(a.width, 120);
    const fly = document.createElement('div'); fly.className = 'fly';
    fly.style.cssText = `left:${a.left + a.width / 2 - size / 2}px;top:${a.top + a.height / 2 - size / 2}px;width:${size}px;height:${size}px`;
    const im = document.createElement('img'); im.src = img.currentSrc || img.src; im.alt = ''; fly.append(im); document.body.append(fly);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    fly.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${dx * 0.55}px, ${dy * 0.55 - 120}px) scale(.62) rotate(-10deg)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(.12) rotate(8deg)`, opacity: 0.2 }
    ], { duration: 900, easing: 'cubic-bezier(.45,.05,.55,.95)' }).onfinish = () => {
      fly.remove(); pill.classList.remove('is-bump'); void pill.offsetWidth; pill.classList.add('is-bump');
    };
  });

  /* ---------- 8. reviews: active slide re-animates, gentle autoplay ---------- */
  const track = $('#revTrack'), next = $('#revNext');
  if (track) {
    const slides = $$('.rev', track); let inView = false, hover = false, idx = -1;
    const mark = () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      if (i === idx) return; idx = i;
      slides.forEach((s, n) => { s.classList.remove('is-active'); if (n === i && inView) { void s.offsetWidth; s.classList.add('is-active'); } });
    };
    track.addEventListener('scroll', mark, { passive: true });
    new IntersectionObserver((en) => { inView = en[0].isIntersecting; idx = -1; mark(); }, { threshold: 0.4 }).observe(track);
    const pausers = [track, next, $('#revPrev')].filter(Boolean);
    pausers.forEach((p) => { p.addEventListener('pointerenter', () => (hover = true)); p.addEventListener('pointerleave', () => (hover = false)); });
    setInterval(() => { if (inView && !hover && !document.hidden && !track.contains(document.activeElement) && next) next.click(); }, 6500);
  }

  /* failsafe: never leave anything hidden if the observer misbehaves */
  setTimeout(() => $$('[data-reveal]:not(.is-in)').forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); }), 4000);
})();
