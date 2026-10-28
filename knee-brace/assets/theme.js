(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function money(cents) {
    const v = (cents / 100).toFixed(2);
    const fmt = window.kvMoney || '${{amount}}';
    return fmt.replace(/\{\{\s*amount_no_decimals\s*\}\}/, Math.round(cents / 100)).replace(/\{\{\s*amount_with_comma_separator\s*\}\}/, v.replace('.', ',')).replace(/\{\{\s*amount\s*\}\}/, v.replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  }

  /* Mobile menu */
  $$('[data-menu-open]').forEach(b => b.addEventListener('click', () => { const m = $('[data-menu]'); if (m) { m.hidden = false; document.body.style.overflow = 'hidden'; } }));
  $$('[data-menu-close]').forEach(b => b.addEventListener('click', () => { const m = $('[data-menu]'); if (m) { m.hidden = true; document.body.style.overflow = ''; } }));

  /* Footer accordions (mobile) */
  $$('[data-ftr-toggle]').forEach(b => b.addEventListener('click', () => {
    if (window.innerWidth > 989) return;
    const col = b.closest('.ftr__col'); const open = col.classList.toggle('is-open'); b.setAttribute('aria-expanded', open);
  }));

  /* Tabs */
  $$('[data-tabs]').forEach(root => {
    $$('[data-tab]', root).forEach(tab => tab.addEventListener('click', () => {
      const i = tab.dataset.tab;
      $$('[data-tab]', root).forEach(t => { const on = t.dataset.tab === i; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', on); });
      $$('[data-panel]', root).forEach(p => { const on = p.dataset.panel === i; p.hidden = !on; p.classList.toggle('is-active', on); });
    }));
  });

  /* Gallery */
  $$('[data-gallery]').forEach(g => {
    const slides = $$('[data-slide]', g), thumbs = $$('[data-thumb]', g), idx = $('[data-gallery-index]', g);
    let cur = 0;
    const go = i => {
      cur = (i + slides.length) % slides.length;
      slides.forEach((s, k) => { s.classList.toggle('is-active', k === cur); const v = s.querySelector('video'); if (v && k !== cur) v.pause(); });
      thumbs.forEach((t, k) => t.classList.toggle('is-active', k === cur));
      if (idx) idx.textContent = cur + 1;
      const t = thumbs[cur]; if (t) t.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    };
    thumbs.forEach(t => t.addEventListener('click', () => go(+t.dataset.thumb)));
    const p = $('[data-gallery-prev]', g), n = $('[data-gallery-next]', g);
    if (p) p.addEventListener('click', () => go(cur - 1));
    if (n) n.addEventListener('click', () => go(cur + 1));
    let sx = null; const stage = $('.mp__stage', g);
    if (stage) {
      stage.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
      stage.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); sx = null; });
    }
    g.kvGo = id => { const k = slides.findIndex(s => s.dataset.mediaId == id); if (k > -1) go(k); };
  });

  /* Variant picker */
  $$('[data-product]').forEach(root => {
    const json = $('[data-variants]', root); if (!json) return;
    const variants = JSON.parse(json.textContent);
    const input = $('[data-variant-id]', root), price = $('[data-price]', root), compare = $('[data-compare]', root), badge = $('[data-sale-badge]', root);
    const atc = $('[data-atc]', root), label = $('[data-atc-label]', root), sp = $('[data-sticky-price]', root), sc = $('[data-sticky-compare]', root);
    const gallery = $('[data-gallery]', root);
    const atcText = label ? label.textContent : '';
    $$('[data-option-index]', root).forEach(r => r.addEventListener('change', () => {
      const sel = []; $$('fieldset.mp__opt', root).forEach((fs, i) => { const c = $('input:checked', fs); sel[i] = c ? c.value : null; });
      const v = variants.find(v => v.options.every((o, i) => o === sel[i])); if (!v) return;
      const lbl = $(`[data-option-value="${r.dataset.optionIndex}"]`, root); if (lbl) lbl.textContent = r.value;
      if (input) input.value = v.id;
      if (price) price.textContent = money(v.price);
      const sale = v.compare_at_price && v.compare_at_price > v.price;
      if (compare) { compare.hidden = !sale; if (sale) compare.textContent = money(v.compare_at_price); }
      if (badge) badge.hidden = !sale;
      if (sp) sp.textContent = money(v.price);
      if (sc) sc.textContent = sale ? money(v.compare_at_price) : '';
      if (atc) atc.disabled = !v.available;
      if (label) label.textContent = v.available ? atcText : 'Sold out';
      if (v.featured_media && gallery && gallery.kvGo) gallery.kvGo(v.featured_media.id);
      const url = new URL(location.href); url.searchParams.set('variant', v.id); history.replaceState({}, '', url);
    }));

    /* Sticky bar */
    const sticky = $('[data-sticky]', root);
    if (sticky && atc && 'IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { sticky.hidden = e.isIntersecting; }).observe(atc);
    }
  });

  /* Cart drawer */
  const drawer = $('#CartDrawer');
  const body = drawer && $('[data-cart-body]', drawer), foot = drawer && $('[data-cart-foot]', drawer), total = drawer && $('[data-cart-total]', drawer);
  const openCart = () => { if (!drawer) return; drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
  const closeCart = () => { if (!drawer) return; drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  async function renderCart() {
    if (!drawer) return;
    const cart = await fetch('/cart.js').then(r => r.json());
    $$('[data-cart-count]').forEach(c => { c.textContent = cart.item_count; c.hidden = cart.item_count === 0; });
    if (!cart.items.length) { body.innerHTML = '<p class="cd__empty">Your cart is empty.</p>'; foot.hidden = true; return; }
    body.innerHTML = cart.items.map((it, i) => `
      <div class="cd__line">
        ${it.image ? `<img src="${it.image.replace(/(\.[a-z]+)(\?|$)/i, '_200x$1$2')}" alt="">` : '<span></span>'}
        <div><div class="cd__line-title">${esc(it.product_title)}</div>${it.variant_title ? `<div class="cd__line-meta">${esc(it.variant_title)}</div>` : ''}
          <div class="cd__qty"><button type="button" data-q="${i + 1}" data-v="${it.quantity - 1}" aria-label="Decrease">−</button><span>${it.quantity}</span><button type="button" data-q="${i + 1}" data-v="${it.quantity + 1}" aria-label="Increase">+</button></div></div>
        <div class="cd__line-price">${it.original_line_price > it.final_line_price ? `<s>${money(it.original_line_price)}</s>` : ''}${money(it.final_line_price)}</div>
      </div>`).join('');
    total.textContent = money(cart.total_price); foot.hidden = false;
  }
  if (drawer) {
    $$('[data-cart-open]').forEach(b => b.addEventListener('click', async () => { await renderCart(); openCart(); }));
    $$('[data-cart-close]', drawer).forEach(b => b.addEventListener('click', closeCart));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });
    body.addEventListener('click', async e => {
      const b = e.target.closest('[data-q]'); if (!b) return;
      await fetch('/cart/change.js', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ line: +b.dataset.q, quantity: +b.dataset.v }) });
      renderCart();
    });
  }
  $$('[data-product-form]').forEach(form => form.addEventListener('submit', async e => {
    if (!drawer) return;
    e.preventDefault();
    const err = form.querySelector('[data-error]'); if (err) err.hidden = true;
    const btns = $$('button[type=submit]', document).filter(b => b.form === form || form.contains(b)); btns.forEach(b => b.disabled = true);
    try {
      const items = form.kbItems ? form.kbItems() : null;
      const r = await fetch('/cart/add.js', items ? { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) } : { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.description || d.message || 'Could not add to cart');
      await renderCart(); openCart();
    } catch (x) { if (err) { err.textContent = x.message; err.hidden = false; } }
    finally { btns.forEach(b => b.disabled = false); }
  }));
})();
(function () {
  const money = c => { const v = (c / 100).toFixed(2); const f = window.kvMoney || '${{amount}}'; return f.replace(/\{\{\s*amount_no_decimals\s*\}\}/, Math.round(c / 100)).replace(/\{\{\s*amount_with_comma_separator\s*\}\}/, v.replace('.', ',')).replace(/\{\{\s*amount\s*\}\}/, v.replace(/\B(?=(\d{3})+(?!\d))/g, ',')); };

  /* Offer tiers */
  document.querySelectorAll('[data-tiers]').forEach(form => {
    const root = form.closest('[data-product]');
    const tiers = [...form.querySelectorAll('[data-tier]')];
    const idIn = form.querySelector('[data-variant-id]'), qtyIn = form.querySelector('[data-tier-qty]');
    const stickySel = root.querySelector('[data-sticky-select]');
    const sp = root.querySelector('[data-sticky-price]'), sc = root.querySelector('[data-sticky-compare]');
    const active = () => tiers.find(t => t.classList.contains('is-on')) || tiers[0];
    const update = () => {
      tiers.forEach(t => {
        let p = 0, c = 0;
        t.querySelectorAll('[data-tier-select]').forEach(sel => { const o = sel.selectedOptions[0]; p += +o.dataset.price; c += +(o.dataset.compare || 0); });
        const pe = t.querySelector('[data-tier-price]'), ce = t.querySelector('[data-tier-compare]');
        if (p && pe) pe.textContent = money(p);
        if (c && ce) ce.textContent = money(c);
      });
      const t = active(); if (!t) return;
      const sels = [...t.querySelectorAll('[data-tier-select]')];
      /* Sticky bar shows the chosen offer's total */
      const tp = t.querySelector('[data-tier-price]'), tc = t.querySelector('[data-tier-compare]');
      if (sp && tp) sp.textContent = tp.textContent;
      if (sc && tc) sc.textContent = tc.textContent;
      if (sels[0]) idIn.value = sels[0].value;
      qtyIn.value = t.dataset.qty;
      if (stickySel && sels[0]) stickySel.value = sels[0].value;
    };
    tiers.forEach(t => t.querySelector('.zp__tier-input').addEventListener('change', () => { tiers.forEach(x => x.classList.toggle('is-on', x === t)); update(); }));
    form.querySelectorAll('[data-tier-select]').forEach(sel => sel.addEventListener('change', update));
    if (stickySel) stickySel.addEventListener('change', () => { const s0 = active().querySelector('[data-tier-select]'); if (s0) { s0.value = stickySel.value; update(); } });
    form.kbItems = () => {
      const t = active(); const sels = [...t.querySelectorAll('[data-tier-select]')];
      if (!sels.length) return [{ id: +idIn.value, quantity: +t.dataset.qty }];
      const m = {}; sels.forEach(s => { m[s.value] = (m[s.value] || 0) + 1; });
      return Object.keys(m).map(id => ({ id: +id, quantity: m[id] }));
    };
    update();
  });

  /* Size guide popup */
  const dlg = document.getElementById('size-guide');
  if (dlg && dlg.showModal) {
    document.querySelectorAll('a[href="#size-guide"]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); dlg.showModal(); }));
    dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('[data-dlg-close]')) dlg.close(); });
  }

  /* Review pages */
  document.querySelectorAll('[data-rv]').forEach(rv => {
    const items = [...rv.querySelectorAll('.zrv__item')], per = +rv.dataset.per || 5, nav = rv.querySelector('[data-rv-pages]');
    const pages = Math.ceil(items.length / per); if (!nav || pages < 2) return;
    const go = n => { items.forEach((it, i) => { it.hidden = Math.floor(i / per) !== n; }); [...nav.children].forEach((b, i) => b.classList.toggle('is-on', i === n)); };
    for (let i = 0; i < pages; i++) { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Page ' + (i + 1)); b.addEventListener('click', () => { go(i); rv.scrollIntoView({ behavior: 'smooth' }); }); nav.appendChild(b); }
    go(0);
  });
})();
