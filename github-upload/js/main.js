(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };

  /* ---- header: glass bar after scrolling (always on for inner pages) ---- */
  const header = $('#header');
  if (header) {
    const sticky = header.dataset.sticky === 'true';
    const onScroll = () => header.classList.toggle('is-stuck', sticky || scrollY > 24);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- mobile menu ---- */
  const burger = $('#burger');
  const nav = $('#nav');
  if (burger && nav) {
    const setMenu = (open) => {
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
    $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    matchMedia('(min-width: 901px)').addEventListener('change', () => setMenu(false));
  }

  /* ---- scroll reveal (also exposed so JS-rendered cards can opt in) ---- */
  let io = null;
  if ('IntersectionObserver' in window && !reduceMotion) {
    io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  }
  const reveal = (root = document) => $$('[data-reveal]:not(.is-in)', root).forEach((el) => (io ? io.observe(el) : el.classList.add('is-in')));
  reveal();

  /* ---- hero parallax (desktop pointer only) ---- */
  const hero = $('.hero');
  const people = $('.hero__people');
  const vShape = $('.hero__v');
  if (hero && people && vShape && !reduceMotion && matchMedia('(hover: hover) and (min-width: 901px)').matches) {
    let raf = 0;
    hero.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        people.style.transform = `translate3d(${x * -14}px, ${y * -8}px, 0)`;
        vShape.style.transform = `translate3d(${x * 26}px, ${y * 14}px, 0)`;
      });
    });
    hero.addEventListener('pointerleave', () => { people.style.transform = ''; vShape.style.transform = ''; });
  }

  /* ---- cart (demo only: shared counter + toast, remembered between pages) ---- */
  const cartCount = $('#cartCount');
  const cartPill = $('#cartPill');
  const toast = $('#toast');
  let count = store.get('virex.cart', 0);
  let toastTimer = 0;
  const paintCart = () => {
    if (!cartCount) return;
    cartCount.textContent = count;
    if (cartPill) cartPill.setAttribute('aria-label', `Cart, ${count} ${count === 1 ? 'item' : 'items'}`);
  };
  paintCart();
  const addToCart = (name) => {
    count += 1; store.set('virex.cart', count); paintCart();
    if (cartPill) { cartPill.classList.remove('is-bump'); void cartPill.offsetWidth; cartPill.classList.add('is-bump'); }
    if (toast) {
      toast.textContent = '';
      const b = document.createElement('b'); b.textContent = name;
      toast.append(b, ' added to cart');
      toast.classList.add('is-on');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('is-on'), 2200);
    }
  };
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add');
    if (btn && btn.dataset.name) { e.preventDefault(); addToCart(btn.dataset.name); }
  });
  window.virex = { addToCart, reveal, store };

  /* ---- reviews carousel (home page) ---- */
  const track = $('#revTrack');
  if (track) {
    const dots = $$('#revDots i');
    const slides = $$('.rev', track);
    const go = (dir) => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      const next = (i + dir + slides.length) % slides.length;
      track.scrollTo({ left: next * track.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    $('#revPrev').addEventListener('click', () => go(-1));
    $('#revNext').addEventListener('click', () => go(1));
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
    track.addEventListener('scroll', () => {
      const i = Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((d, n) => d.classList.toggle('is-on', n === i));
    }, { passive: true });
  }

  /* ---- layout grid overlay: press G, or tap the "Grid" pill (also ?grid in the URL) ---- */
  const overlay = document.createElement('div');
  overlay.className = 'grid-overlay'; overlay.setAttribute('aria-hidden', 'true');
  const pill = document.createElement('button');
  pill.type = 'button'; pill.className = 'grid-toggle'; pill.setAttribute('aria-pressed', 'false');
  const label = () => {
    const cs = getComputedStyle(document.documentElement);
    const cols = cs.getPropertyValue('--cols').trim();
    pill.textContent = `Grid · ${cols} columns`;
    pill.title = `${cols} columns · margin ${Math.round(parseFloat(getComputedStyle(overlay).left))} px · gutter ${cs.getPropertyValue('--gutter').trim()}`;
  };
  const setGrid = (on) => { document.body.classList.toggle('show-grid', on); pill.setAttribute('aria-pressed', String(on)); label(); };
  document.body.append(overlay, pill);
  label(); addEventListener('resize', label);
  pill.addEventListener('click', () => setGrid(!document.body.classList.contains('show-grid')));
  addEventListener('keydown', (e) => { if ((e.key === 'g' || e.key === 'G') && !e.metaKey && !e.ctrlKey && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) setGrid(!document.body.classList.contains('show-grid')); });
  if (/[?&]grid\b/.test(location.search)) setGrid(true);

  /* ---- FAQ: on desktop every answer sits open beside its question (rows aligned to the 12-column grid); accordion below 1181px ---- */
  const faqList = $('.faq__list');
  if (faqList) {
    const mq = matchMedia('(min-width: 1181px)');
    const items = $$('details', faqList);
    const apply = () => items.forEach((d, i) => {
      if (mq.matches) { d.removeAttribute('name'); d.open = true; }
      else { d.setAttribute('name', 'faq'); d.open = i === 0; }
    });
    faqList.addEventListener('click', (e) => { if (mq.matches && e.target.closest('summary')) e.preventDefault(); });
    mq.addEventListener('change', apply);
    apply();
  }
})();
