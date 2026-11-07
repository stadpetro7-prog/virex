/* =========================================================
   VIREX — "Popular products" with the whole range (used by the single-file build).
   Renders all SKUs from products.js into #productGrid, with category chips that filter in place
   and a "View all / Show fewer" toggle. Needs products.js loaded first.
   Image sources: window.VIREX_IMG (name -> data URI, filled by the build); otherwise assets/img/<name>.webp.
   ========================================================= */
(() => {
  'use strict';
  const P = window.VIREX_PRODUCTS, grid = document.getElementById('productGrid');
  if (!P || !grid) return;
  const $ = (s, r = document) => r.querySelector(s);
  const FIRST = 8;                                   // two rows of four until "View all"
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // the six photos already in the page keep their embedded source
  const have = {}; [...grid.querySelectorAll('img')].forEach((im, i) => { have['prod-' + (i + 1)] = im.getAttribute('src'); });
  const src = (name) => (window.VIREX_IMG && window.VIREX_IMG[name]) || have[name] || `assets/img/${name}.webp`;

  const CATS = [['all', 'All'], ['tops', 'Tops'], ['bottoms', 'Bottoms'], ['outerwear', 'Outerwear'], ['accessories', 'Accessories']];
  const state = { cat: 'all', all: false };
  const cats = $('.cats'), more = $('.products__tools .link');
  grid.classList.add('shop');                         // lets the stylesheet show more than the first four cards

  cats.innerHTML = CATS.map(([k, l]) => `<a href="#products" data-cat="${k}">${l}</a>`).join('');
  const sync = () => $$chips().forEach((a) => { const on = a.dataset.cat === state.cat; a.classList.toggle('is-on', on); a.setAttribute('aria-pressed', String(on)); });
  const $$chips = () => [...cats.querySelectorAll('a')];

  const card = (p, i) => `<li class="product" data-reveal style="--d:${(i % 4) * 0.07}s">
    <div class="product__img">${p.badge ? `<span class="product__badge">${esc(p.badge)}</span>` : ''}<img src="${src(p.img)}" width="900" height="900" loading="lazy" alt="${esc(p.name)}"></div>
    <h3 class="product__name">${esc(p.name)}</h3>
    <div class="product__row"><span class="product__price">$${p.price}</span>
      <button class="add" type="button" data-name="${esc(p.name)}" aria-label="Add ${esc(p.name)} to cart"><svg class="ico"><use href="#i-cart"/></svg></button></div>
  </li>`;

  const render = () => {
    const list = P.filter((p) => state.cat === 'all' || p.cat === state.cat);
    const shown = state.all ? list : list.slice(0, FIRST);
    grid.classList.toggle('is-all', state.all);
    grid.innerHTML = shown.map(card).join('');
    if (window.virex && window.virex.reveal) window.virex.reveal(grid);
    sync();
    const hidden = list.length - shown.length;
    more.hidden = list.length <= FIRST;
    more.firstChild.nodeValue = state.all ? 'Show fewer ' : `View all ${list.length} products `;
    more.setAttribute('aria-expanded', String(state.all));
  };

  cats.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-cat]'); if (!a) return;
    e.preventDefault(); state.cat = a.dataset.cat; state.all = false; render();
  });
  more.addEventListener('click', (e) => { e.preventDefault(); state.all = !state.all; render(); });
  more.setAttribute('role', 'button');
  render();
})();
