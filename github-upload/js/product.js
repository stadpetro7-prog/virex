(() => {
  'use strict';
  const P = window.VIREX_PRODUCTS, CATS = Object.fromEntries(window.VIREX_CATS);
  const id = new URLSearchParams(location.search).get('id');
  const p = P.find((x) => x.id === id) || P[0];
  const root = document.getElementById('pdp');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sizes = p.cat === 'accessories' ? [] : ['XS', 'S', 'M', 'L', 'XL'];
  document.title = `${p.name} — Virex`;

  const related = P.filter((x) => x.id !== p.id && x.cat === p.cat).concat(P.filter((x) => x.cat !== p.cat)).slice(0, 4);
  const rel = (x) => `<li class="product"><a class="product__img" href="product.html?id=${esc(x.id)}" aria-label="${esc(x.name)}"><img src="assets/img/${esc(x.img)}.webp" width="900" height="900" loading="lazy" alt="${esc(x.name)}"></a>
    <h3 class="product__name"><a href="product.html?id=${esc(x.id)}">${esc(x.name)}</a></h3>
    <div class="product__row"><span class="product__price">$${x.price}</span><button class="add" type="button" data-name="${esc(x.name)}" aria-label="Add ${esc(x.name)} to cart"><svg class="ico"><use href="#i-cart"/></svg></button></div></li>`;

  root.innerHTML = `
  <section class="pdp">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="catalog.html">Catalog</a><span aria-hidden="true">/</span><a href="catalog.html?cat=${esc(p.cat)}">${esc(CATS[p.cat])}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.name)}</span></nav>
    <div class="pdp__gallery"><div class="pdp__main">${p.badge ? `<span class="product__badge">${esc(p.badge)}</span>` : ''}<img src="assets/img/${esc(p.img)}.webp" width="900" height="900" alt="${esc(p.name)}"></div></div>
    <div class="pdp__info">
      <p class="eyebrow">${esc(CATS[p.cat])}</p>
      <h1 class="h2">${esc(p.name)}</h1>
      <p class="pdp__price">$${p.price}</p>
      <p class="pdp__desc">${esc(p.desc)}</p>
      <div class="pdp__row"><span class="pdp__label">Colour</span><span class="pdp__color"><i style="--sw:${esc(window.VIREX_COLORS[p.color])}"></i>${esc(p.color)}</span></div>
      ${sizes.length ? `<div class="pdp__row"><span class="pdp__label">Size</span><div class="sizes" id="sizes" role="radiogroup" aria-label="Size">${sizes.map((s, i) => `<button type="button" role="radio" aria-checked="${i === 2}" class="${i === 2 ? 'is-on' : ''}">${s}</button>`).join('')}</div></div>` : ''}
      <button class="btn btn--lime pdp__add add" type="button" data-name="${esc(p.name)}">Add to cart <svg class="ico"><use href="#i-cart"/></svg></button>
      <ul class="pdp__perks"><li>Free delivery over $60</li><li>30-day returns</li><li>Ships within 24 hours</li></ul>
      <div class="pdp__acc">
        <details open><summary>Details<svg class="ico"><use href="#i-plus"/></svg></summary><p>${esc(p.desc)} Reflective Virex V emblem, flat seams and a regular fit.</p></details>
        <details><summary>Materials &amp; care<svg class="ico"><use href="#i-plus"/></svg></summary><p>Lightweight technical knit with four-way stretch and moisture wicking. Machine wash at 30°C, no fabric softener, air dry.</p></details>
      </div>
    </div>
  </section>
  <section class="related"><div class="related__head"><p class="eyebrow">You may also like</p><h2 class="h2">More from Virex</h2></div>
    <ul class="catalog-grid related__grid">${related.map(rel).join('')}</ul></section>`;

  const sz = document.getElementById('sizes');
  if (sz) sz.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    sz.querySelectorAll('button').forEach((x) => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-checked', String(x === b)); });
  });
})();
