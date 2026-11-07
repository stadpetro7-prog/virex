(() => {
  'use strict';
  const P = window.VIREX_PRODUCTS, CATS = window.VIREX_CATS, COL = window.VIREX_COLORS;
  const PER = 9;
  const BANDS = [['any', 'Any price', () => true], ['u35', 'Under $35', (p) => p.price < 35], ['mid', '$35 – $55', (p) => p.price >= 35 && p.price <= 55], ['o55', 'Over $55', (p) => p.price > 55]];
  const state = { cat: 'all', color: '', price: 'any', sort: 'featured', page: 1 };
  const $ = (s) => document.querySelector(s);
  const el = { cats: $('#catFilter'), colors: $('#colorFilter'), price: $('#priceFilter'), grid: $('#catalogGrid'), count: $('#resultCount'), pager: $('#pager'), sort: $('#sortSelect'), clear: $('#clearFilters') };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // read ?cat= from the URL so links like catalog.html?cat=tops work
  const q = new URLSearchParams(location.search);
  if (CATS.some(([k]) => k === q.get('cat'))) state.cat = q.get('cat');

  const pass = (p, skip) => (skip === 'cat' || state.cat === 'all' || p.cat === state.cat)
    && (skip === 'color' || !state.color || p.color === state.color)
    && (skip === 'price' || BANDS.find((b) => b[0] === state.price)[2](p));
  const sorted = (list) => {
    const l = [...list];
    if (state.sort === 'price-asc') l.sort((a, b) => a.price - b.price);
    else if (state.sort === 'price-desc') l.sort((a, b) => b.price - a.price);
    else if (state.sort === 'new') l.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0));
    return l;
  };

  const card = (p) => `<li class="product" data-reveal>
    <a class="product__img" href="product.html?id=${esc(p.id)}" aria-label="${esc(p.name)}">${p.badge ? `<span class="product__badge">${esc(p.badge)}</span>` : ''}<img src="assets/img/${esc(p.img)}.webp" width="900" height="900" loading="lazy" alt="${esc(p.name)}"></a>
    <h3 class="product__name"><a href="product.html?id=${esc(p.id)}">${esc(p.name)}</a></h3>
    <div class="product__row"><span class="product__price">$${p.price}</span>
      <button class="add" type="button" data-name="${esc(p.name)}" aria-label="Add ${esc(p.name)} to cart"><svg class="ico"><use href="#i-cart"/></svg></button></div>
  </li>`;

  const renderFilters = () => {
    el.cats.innerHTML = CATS.map(([k, label]) => `<li><button type="button" class="${state.cat === k ? 'is-on' : ''}" data-cat="${k}">${label}<span>${P.filter((p) => pass(p, 'cat') && (k === 'all' || p.cat === k)).length}</span></button></li>`).join('');
    const colors = [...new Set(P.map((p) => p.color))];
    el.colors.innerHTML = colors.map((c) => `<button type="button" class="swatch ${state.color === c ? 'is-on' : ''}" data-color="${c}" style="--sw:${COL[c]}" aria-label="${c}" aria-pressed="${state.color === c}" title="${c}"></button>`).join('');
    el.price.innerHTML = BANDS.map(([k, label]) => `<li><button type="button" class="${state.price === k ? 'is-on' : ''}" data-price="${k}">${label}</button></li>`).join('');
  };

  const render = () => {
    const list = sorted(P.filter((p) => pass(p)));
    const pages = Math.max(1, Math.ceil(list.length / PER));
    state.page = Math.min(state.page, pages);
    const slice = list.slice((state.page - 1) * PER, state.page * PER);
    el.grid.innerHTML = slice.length ? slice.map(card).join('') : '<li class="empty">No products match these filters. <button class="link" type="button" data-clear>Clear filters</button></li>';
    el.count.textContent = `${list.length} ${list.length === 1 ? 'product' : 'products'}`;
    el.clear.hidden = state.cat === 'all' && !state.color && state.price === 'any';
    el.pager.innerHTML = pages > 1 ? Array.from({ length: pages }, (_, i) => `<button type="button" class="${i + 1 === state.page ? 'is-on' : ''}" data-page="${i + 1}" aria-label="Page ${i + 1}" ${i + 1 === state.page ? 'aria-current="page"' : ''}>${i + 1}</button>`).join('') : '';
    renderFilters();
    if (window.virex) window.virex.reveal(el.grid);
  };

  const reset = () => { state.cat = 'all'; state.color = ''; state.price = 'any'; state.page = 1; render(); };
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.cat) { state.cat = t.dataset.cat; state.page = 1; render(); }
    else if (t.dataset.color) { state.color = state.color === t.dataset.color ? '' : t.dataset.color; state.page = 1; render(); }
    else if (t.dataset.price) { state.price = t.dataset.price; state.page = 1; render(); }
    else if (t.dataset.page) { state.page = +t.dataset.page; render(); scrollTo({ top: document.querySelector('.catalog').offsetTop - 100, behavior: 'smooth' }); }
    else if (t.id === 'clearFilters' || t.hasAttribute('data-clear')) reset();
  });
  el.sort.addEventListener('change', () => { state.sort = el.sort.value; state.page = 1; render(); });
  render();
})();
