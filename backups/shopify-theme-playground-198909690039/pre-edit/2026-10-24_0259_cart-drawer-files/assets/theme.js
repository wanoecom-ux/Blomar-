(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  $$('[data-rotator]').forEach((root) => {
    const items = $$('.announce__item', root);
    if (items.length < 2) return;
    let i = 0;
    const show = (n) => { items[i].classList.remove('is-active'); i = (n + items.length) % items.length; items[i].classList.add('is-active'); };
    let timer = setInterval(() => show(i + 1), 4500);
    const reset = () => { clearInterval(timer); timer = setInterval(() => show(i + 1), 4500); };
    $('[data-rotator-next]', root)?.addEventListener('click', () => { show(i + 1); reset(); });
    $('[data-rotator-prev]', root)?.addEventListener('click', () => { show(i - 1); reset(); });
  });

  const menu = $('#MobileMenu');
  $$('[data-menu-open]').forEach((b) => b.addEventListener('click', () => { menu?.classList.add('is-open'); menu?.setAttribute('aria-hidden', 'false'); }));
  $$('[data-menu-close]').forEach((b) => b.addEventListener('click', () => { menu?.classList.remove('is-open'); menu?.setAttribute('aria-hidden', 'true'); }));
  menu?.addEventListener('click', (e) => { if (e.target === menu) { menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true'); } });

  $$('[data-carousel]').forEach((root) => {
    const track = $('[data-carousel-track]', root);
    if (!track) return;
    const step = () => (track.firstElementChild?.getBoundingClientRect().width || 300) + 16;
    $('[data-carousel-next]', root)?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    $('[data-carousel-prev]', root)?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  });

  const drawer = $('#CartDrawer');
  const openDrawer = () => { drawer?.classList.add('is-open'); drawer?.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; };
  const closeDrawer = () => { drawer?.classList.remove('is-open'); drawer?.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
  $$('[data-cart-open]').forEach((a) => a.addEventListener('click', (e) => { if (!drawer) return; e.preventDefault(); openDrawer(); }));
  $$('[data-drawer-close]').forEach((b) => b.addEventListener('click', closeDrawer));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });

  const root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
  const refreshCart = async () => {
    const res = await fetch(`${root}?sections=cart-drawer-content`).catch(() => null);
    let html = null;
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      html = data && data['cart-drawer-content'];
    }
    if (!html) { window.location.reload(); return; }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const fresh = doc.querySelector('[data-cart-fragment]');
    $$('[data-cart-body]').forEach((el) => { el.innerHTML = fresh ? fresh.innerHTML : ''; });
    const count = fresh?.getAttribute('data-count') || '0';
    $$('[data-cart-count]').forEach((el) => { el.textContent = count; });
  };

  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-qty-change]');
    if (!btn) return;
    const line = btn.closest('[data-line]')?.getAttribute('data-line');
    if (!line) return;
    btn.disabled = true;
    await fetch(`${root}cart/change.js`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ line: Number(line), quantity: Number(btn.getAttribute('data-qty-change')) })
    }).catch(() => null);
    await refreshCart();
  });

  $$('[data-product]').forEach((section) => {
    const slides = $$('.gallery__slide', section);
    const thumbs = $$('[data-thumb]', section);
    let current = Math.max(0, slides.findIndex((s) => s.classList.contains('is-active')));
    const showSlide = (n) => {
      if (!slides.length) return;
      slides[current]?.classList.remove('is-active');
      thumbs[current]?.classList.remove('is-active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      thumbs[current]?.classList.add('is-active');
      thumbs[current]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    };
    thumbs.forEach((t, idx) => t.addEventListener('click', () => showSlide(idx)));
    $('[data-gallery-next]', section)?.addEventListener('click', () => showSlide(current + 1));
    $('[data-gallery-prev]', section)?.addEventListener('click', () => showSlide(current - 1));
    let touchX = null;
    const main = $('.gallery__main', section);
    main?.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    main?.addEventListener('touchend', (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) showSlide(current + (dx < 0 ? 1 : -1));
      touchX = null;
    });

    const form = $('[data-product-form]', section);
    const idInput = $('[data-variant-input]', section);
    const priceEl = $('[data-price]', section);
    const compareEl = $('[data-compare]', section);
    const stickyPrice = $('[data-sticky-price]', section);
    const addBtn = $('[data-add]', section);
    const addLabel = $('[data-add-label]', section);
    const addText = addLabel?.textContent;
    const errorEl = $('[data-error]', section);

    $$('input[name="variant-choice"]', section).forEach((radio) => {
      radio.addEventListener('change', () => {
        $$('.pack', section).forEach((p) => p.classList.toggle('is-selected', p.contains(radio)));
        if (idInput) idInput.value = radio.value;
        if (priceEl) priceEl.textContent = radio.dataset.price;
        if (stickyPrice) stickyPrice.textContent = radio.dataset.price;
        if (compareEl) { compareEl.textContent = radio.dataset.compare || ''; compareEl.hidden = !radio.dataset.compare; }
        const available = radio.dataset.available === 'true';
        if (addBtn) addBtn.disabled = !available;
        if (addLabel) addLabel.textContent = available ? addText : 'Sold out';
        const mediaId = radio.dataset.media;
        if (mediaId) {
          const idx = slides.findIndex((s) => s.dataset.mediaId === mediaId);
          if (idx > -1) showSlide(idx);
        }
        const url = new URL(window.location.href);
        url.searchParams.set('variant', radio.value);
        window.history.replaceState({}, '', url.toString());
      });
    });

    form?.addEventListener('submit', async (e) => {
      if (!drawer) return;
      e.preventDefault();
      if (errorEl) errorEl.hidden = true;
      if (addBtn) addBtn.disabled = true;
      const res = await fetch(`${root}cart/add.js`, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) }).catch(() => null);
      if (addBtn) addBtn.disabled = false;
      if (!res || !res.ok) {
        const data = res ? await res.json().catch(() => ({})) : {};
        if (errorEl) { errorEl.textContent = data.description || 'Something went wrong. Please try again.'; errorEl.hidden = false; }
        return;
      }
      await refreshCart();
      openDrawer();
    });

    const sticky = $('[data-sticky-buy]', section);
    if (sticky && addBtn && 'IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { sticky.hidden = entry.isIntersecting || entry.boundingClientRect.top > 0; }).observe(addBtn);
    }
  });

  $$('[data-tabs]').forEach((root) => {
    const tabs = $$('[role="tab"]', root);
    tabs.forEach((tab) => tab.addEventListener('click', () => {
      tabs.forEach((t) => { const on = t === tab; t.classList.toggle('is-active', on); t.setAttribute('aria-selected', on); const p = document.getElementById(t.getAttribute('aria-controls')); if (p) p.hidden = !on; });
    }));
  });

  const links = $$('.subnav__link');
  if (links.length && 'IntersectionObserver' in window) {
    const map = new Map();
    links.forEach((l) => { const t = document.getElementById(l.getAttribute('href').slice(1)); if (t) map.set(t, l); });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { links.forEach((l) => l.classList.remove('is-active')); map.get(en.target)?.classList.add('is-active'); } });
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, t) => io.observe(t));
  }
})();