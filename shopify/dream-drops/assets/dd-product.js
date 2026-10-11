/* Dream Drops product page: gallery, bundle tiers, add to cart, sticky bar, reviews, scroll links. */
(() => {
  const root = document.querySelector('[data-dd-product]');

  /* ---------- Gallery ---------- */
  const gallery = root && root.querySelector('[data-dd-gallery]');
  if (gallery) {
    const track = gallery.querySelector('[data-dd-track]');
    const slides = [...track.children];
    const marks = [...gallery.querySelectorAll('[data-dd-thumb]')];
    let index = 0;

    const mark = (i) => {
      index = i;
      marks.forEach((m) => m.setAttribute('aria-current', String(Number(m.dataset.ddThumb) === i)));
      const thumb = gallery.querySelector(`.dd-gallery__thumb[data-dd-thumb="${i}"]`);
      if (thumb) thumb.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    };
    const go = (i) => {
      const n = (i + slides.length) % slides.length;
      track.scrollTo({ left: slides[n].offsetLeft, behavior: 'smooth' });
      mark(n);
    };

    marks.forEach((m) => m.addEventListener('click', () => go(Number(m.dataset.ddThumb))));
    // Next arrow beside the mobile dots.
    const dots = gallery.querySelector('.dd-gallery__dots');
    if (dots) {
      const next = document.createElement('button');
      next.type = 'button';
      next.className = 'dd-gallery__next';
      next.setAttribute('aria-label', 'Next image');
      next.textContent = '›';
      next.addEventListener('click', () => go(index + 1));
      dots.appendChild(next);
    }
    gallery.querySelector('[data-dd-prev]')?.addEventListener('click', () => go(index - 1));
    gallery.querySelector('[data-dd-next]')?.addEventListener('click', () => go(index + 1));
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') go(index + 1);
      if (e.key === 'ArrowLeft') go(index - 1);
    });

    let t;
    track.addEventListener('scroll', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const i = Math.round(track.scrollLeft / track.clientWidth);
        if (i !== index) mark(i);
      }, 80);
    }, { passive: true });
  }

  /* ---------- Bundle tiers ---------- */
  const form = root && root.querySelector('[data-dd-form]');
  if (form) {
    const variantInput = form.querySelector('[data-dd-variant-input]');
    const planInput = form.querySelector('[data-dd-plan-input]');
    const addBtn = form.querySelector('[data-dd-add]');
    const errorEl = form.querySelector('[data-dd-error]');
    const stock = form.querySelector('[data-dd-stock]');
    const sticky = root.querySelector('[data-dd-sticky]');

    const setText = (el, text) => { if (el) el.textContent = text; };

    const apply = (radio) => {
      const d = radio.dataset;
      variantInput.value = radio.value;
      if (d.plan) { planInput.value = d.plan; planInput.disabled = false; }
      else { planInput.value = ''; planInput.disabled = true; }

      if (addBtn) {
        addBtn.disabled = !d.available;
        addBtn.textContent = d.available ? addBtn.dataset.label : 'Sold out';
      }

      if (stock) {
        const qty = Number(d.inventory);
        const limit = Number(stock.dataset.threshold);
        const show = d.tracked && qty > 0 && qty <= limit;
        stock.hidden = !show;
        if (show) {
          stock.querySelector('[data-dd-stock-text]').innerHTML = stock.dataset.template.replace('[count]', qty);
          stock.querySelector('[data-dd-stock-bar]').style.width = `${Math.min(100, (qty / (Number(stock.dataset.barMax) || limit)) * 100)}%`;
        }
      }

      if (sticky) {
        setText(sticky.querySelector('[data-dd-sticky-price]'), d.price);
        setText(sticky.querySelector('[data-dd-sticky-compare]'), d.compare || '');
        const save = sticky.querySelector('[data-dd-sticky-save]');
        save.hidden = !d.save;
        setText(sticky.querySelector('[data-dd-sticky-save-pct]'), d.save || '');
      }

      // Keep the URL in step with the chosen variant so the page can be shared or reloaded.
      const url = new URL(window.location.href);
      url.searchParams.set('variant', radio.value);
      history.replaceState(null, '', url);
    };

    form.querySelectorAll('.dd-tier input[type="radio"]').forEach((r) => r.addEventListener('change', () => apply(r)));

    /* ---------- Bundle app placement ---------- */
    // Apps such as Kaching Bundles insert their widget just above the product form and write the chosen
    // deal into the form's quantity and properties inputs. Move the widget into the bundle slot so it sits
    // where the bundle picker belongs; its own controls are left out of the add-to-cart request below.
    const slot = form.querySelector('[data-dd-bundle-slot]');
    const buybox = form.parentElement;
    if (slot && buybox) {
      const place = () => {
        const widget = buybox.querySelector('kaching-bundle, kaching-bundles-block');
        if (widget && widget.parentElement !== slot) slot.appendChild(widget);
      };
      place();
      new MutationObserver(place).observe(buybox, { childList: true, subtree: true });
    }

    /* ---------- Add to cart ---------- */
    const cartAddUrl = (window.routes && window.routes.cart_add_url) || '/cart/add';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!addBtn || addBtn.disabled) return;
      errorEl.textContent = '';
      addBtn.classList.add('is-loading');
      addBtn.setAttribute('aria-busy', 'true');

      const drawer = document.querySelector('cart-drawer');
      // Leave the bundle widget's own controls out of the request; the deal it chose is already in the form's inputs.
      const widgetFields = slot ? [...slot.querySelectorAll('[name]:not([disabled])')] : [];
      widgetFields.forEach((el) => { el.disabled = true; });
      const body = new FormData(form);
      widgetFields.forEach((el) => { el.disabled = false; });
      if (drawer && typeof drawer.getSectionsToRender === 'function') {
        body.append('sections', drawer.getSectionsToRender().map((s) => s.id).join(','));
        body.append('sections_url', window.location.pathname);
      }

      try {
        // Free gifts: add any gift that isn't in the cart yet, before the product, so the drawer shows both.
        const giftIds = (root.querySelector('[data-dd-gifts]')?.dataset.giftIds || '').split(',').filter(Boolean).map(Number);
        if (giftIds.length) {
          try {
            const cart = await (await fetch('/cart.js', { headers: { Accept: 'application/json' } })).json();
            const inCart = new Set(cart.items.map((i) => i.variant_id));
            const items = giftIds.filter((id) => !inCart.has(id)).map((id) => ({ id, quantity: 1, properties: { _free_gift: 'Dream Drops' } }));
            if (items.length) {
              await fetch(`${cartAddUrl}.js`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ items }) });
            }
          } catch (giftErr) { /* A gift that can't be added never blocks the product itself. */ }
        }

        const res = await fetch(`${cartAddUrl}.js`, { method: 'POST', headers: { Accept: 'application/json' }, body });
        const data = await res.json();
        if (!res.ok || data.status) {
          errorEl.textContent = data.description || data.message || 'Could not add to cart. Please try again.';
          return;
        }
        if (drawer && data.sections && typeof drawer.renderContents === 'function') {
          drawer.renderContents(data);
          drawer.classList.remove('is-empty');
        } else {
          window.location.href = (window.routes && window.routes.cart_url) || '/cart';
        }
      } catch (err) {
        errorEl.textContent = 'Could not add to cart. Please check your connection and try again.';
      } finally {
        addBtn.classList.remove('is-loading');
        addBtn.removeAttribute('aria-busy');
      }
    });

    /* ---------- Sticky bar ---------- */
    if (sticky && addBtn) {
      const stickyBtn = sticky.querySelector('[data-dd-sticky-add]');
      stickyBtn.addEventListener('click', () => {
        if (addBtn.disabled) {
          document.getElementById('dd-buybox')?.scrollIntoView({ behavior: 'smooth' });
          return;
        }
        form.requestSubmit ? form.requestSubmit() : addBtn.click();
      });
      // Show the bar once the main button has scrolled above the screen. A scroll check (not an
      // IntersectionObserver) so a fast fling or anchor jump past the button can't leave it hidden.
      let ticking = false;
      const update = () => {
        ticking = false;
        const passed = addBtn.getBoundingClientRect().bottom < 0;
        sticky.classList.toggle('is-visible', passed);
        sticky.setAttribute('aria-hidden', String(!passed));
        stickyBtn.tabIndex = passed ? 0 : -1;
      };
      window.addEventListener('scroll', () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
      }, { passive: true });
      update();
    }
  }

  /* ---------- Scroll-to-buy-box links ---------- */
  document.querySelectorAll('[data-dd-scroll-buy]').forEach((a) => a.addEventListener('click', (e) => {
    const target = document.getElementById('dd-buybox');
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  /* ---------- Accordion images: tap to view full size ---------- */
  const zoomImgs = document.querySelectorAll('.dd-acc__image');
  if (zoomImgs.length) {
    const overlay = document.createElement('div');
    overlay.className = 'dd-zoom';
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image viewer');
    overlay.innerHTML = '<button type="button" class="dd-zoom__close" aria-label="Close">✕</button><img alt=""><p class="dd-zoom__hint">Tap the image to zoom</p>';
    document.body.appendChild(overlay);
    const big = overlay.querySelector('img');
    const closeBtn = overlay.querySelector('.dd-zoom__close');
    let opener = null;

    const close = () => {
      overlay.hidden = true;
      overlay.classList.remove('is-zoomed');
      document.documentElement.style.overflow = '';
      if (opener) opener.focus();
    };
    const open = (img) => {
      opener = img;
      // Ask Shopify's image CDN for a larger copy than the one shown in the accordion.
      big.src = (img.currentSrc || img.src).replace(/([?&])width=\d+/, '$1width=1800');
      big.alt = img.alt;
      overlay.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      closeBtn.focus();
    };

    zoomImgs.forEach((img) => {
      img.tabIndex = 0;
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `View ${img.alt || 'image'} full size`);
      img.addEventListener('click', () => open(img));
      img.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(img); } });
    });
    big.addEventListener('click', (e) => { e.stopPropagation(); overlay.classList.toggle('is-zoomed'); });
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !overlay.hidden) close(); });
  }

  /* ---------- Reviews: filter + load more ---------- */
  document.querySelectorAll('[data-dd-reviews]').forEach((wrap) => {
    const cards = [...wrap.querySelectorAll('[data-dd-review]')];
    const filters = [...wrap.querySelectorAll('[data-dd-filter]')];
    const more = wrap.querySelector('[data-dd-more]');
    const shown = wrap.querySelector('[data-dd-shown]');
    const step = Number(wrap.dataset.step) || 6;
    let limit = step;
    let tag = 'all';

    const render = () => {
      const matching = cards.filter((c) => tag === 'all' || c.dataset.tag === tag);
      cards.forEach((c) => { c.hidden = true; });
      matching.slice(0, limit).forEach((c) => { c.hidden = false; });
      const visible = Math.min(limit, matching.length);
      if (shown) shown.textContent = `Showing ${visible} of ${matching.length} reviews`;
      if (more) more.hidden = visible >= matching.length;
    };

    filters.forEach((f) => f.addEventListener('click', () => {
      tag = f.dataset.ddFilter;
      limit = step;
      filters.forEach((x) => x.setAttribute('aria-pressed', String(x === f)));
      render();
    }));
    more?.addEventListener('click', () => { limit += step; render(); });
    render();
  });
})();
