/* ============================================================
   MATIOS UI — matios-ui-imagegallery.js
   MTS.ImageGallery — Grid de imágenes con selección y lightbox
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.ImageGallery = class MtsImageGallery {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {Array}    options.images      [{ id, src, thumb?, alt?, caption?, tags?[] }]
   * @param {string}   options.variant     'grid'|'masonry'|'list' — default: 'grid'
   * @param {number}   options.cols        Columnas — default: 3
   * @param {string}   options.gap         Gap CSS — default: '8px'
   * @param {boolean}  options.selectable  Permite selección múltiple — default: false
   * @param {boolean}  options.lightbox    Abre lightbox al click — default: true
   * @param {boolean}  options.showCaption Muestra caption en hover — default: true
   * @param {Array}    options.filters     Tags para filtrar — default: []
   * @param {function} options.onSelect    ({ selected, image }) => {}
   * @param {function} options.onOpen      ({ image, index }) => {}
   */
  constructor(selector, options = {}) {
    this._el        = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    this.images      = options.images      || [];
    this.variant     = options.variant     || 'grid';
    this.cols        = options.cols        ?? 3;
    this.gap         = options.gap         || '8px';
    this.selectable  = options.selectable  ?? false;
    this.lightbox    = options.lightbox    ?? true;
    this.showCaption = options.showCaption ?? true;
    this.filters     = options.filters     || [];
    this._listeners = {};

    // Fires when selection changes: ({ selected, image }) => {}
    // Se dispara al cambiar la selección
    if (options.onSelect) this.on('select', options.onSelect);

    // Fires when an image opens in lightbox: ({ image, index }) => {}
    // Se dispara al abrir una imagen en el lightbox
    if (options.onOpen)   this.on('open',   options.onOpen);
    this._selected   = new Set();
    this._activeFilter = null;
    this._lbEl       = null;
    this._lbIdx      = 0;
    this._build();
  }

  /* ── API ── */
  setImages(images)    { this.images = images; this._selected.clear(); this._build(); return this; }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }
  getSelected()        { return [...this._selected].map(id => this.images.find(i => i.id === id)).filter(Boolean); }
  clearSelection()     { this._selected.clear(); this._build(); return this; }
  setFilter(tag)       { this._activeFilter = tag; this._build(); return this; }
  clearFilter()        { this._activeFilter = null; this._build(); return this; }
  openLightbox(index)  { this._openLB(index); return this; }
  destroy()            { this._closeLB(); this._el.innerHTML = ''; }

  _filtered() {
    if (!this._activeFilter) return this.images;
    return this.images.filter(img => img.tags && img.tags.includes(this._activeFilter));
  }

  _build() {
    this._el.innerHTML = '';
    this._syncClasses(['mts-imagegallery', 'mts-imagegallery--' + this.variant]);

    /* ── Filtros ── */
    if (this.filters.length) {
      const bar = document.createElement('div');
      bar.className = 'mts-imagegallery__filters';
      const allBtn = document.createElement('button');
      allBtn.type = 'button';
      allBtn.className = 'mts-imagegallery__filter-btn' + (!this._activeFilter ? ' mts-imagegallery__filter-btn--active' : '');
      allBtn.textContent = 'Todos';
      allBtn.addEventListener('click', () => { this._activeFilter = null; this._build(); });
      bar.appendChild(allBtn);
      this.filters.forEach(tag => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'mts-imagegallery__filter-btn' + (this._activeFilter === tag ? ' mts-imagegallery__filter-btn--active' : '');
        btn.textContent = tag;
        btn.addEventListener('click', () => { this._activeFilter = tag; this._build(); });
        bar.appendChild(btn);
      });
      this._el.appendChild(bar);
    }

    /* ── Grid ── */
    const grid = document.createElement('div');
    grid.className = 'mts-imagegallery__grid';
    grid.style.gap = this.gap;
    if (this.variant === 'grid') {
      grid.style.gridTemplateColumns = 'repeat(' + this.cols + ', 1fr)';
    }
    this._el.appendChild(grid);

    const visible = this._filtered();
    if (!visible.length) {
      const empty = document.createElement('div');
      empty.className = 'mts-imagegallery__empty';
      empty.textContent = 'Sin imágenes';
      grid.appendChild(empty);
      return;
    }

    visible.forEach((img, idx) => {
      const card = document.createElement('div');
      card.className = 'mts-imagegallery__card' + (this._selected.has(img.id) ? ' mts-imagegallery__card--selected' : '');

      /* Imagen */
      const imgEl = document.createElement('img');
      imgEl.className = 'mts-imagegallery__img';
      imgEl.src = img.thumb || img.src;
      imgEl.alt = img.alt || img.caption || '';
      imgEl.loading = 'lazy';
      card.appendChild(imgEl);

      /* Overlay */
      const overlay = document.createElement('div');
      overlay.className = 'mts-imagegallery__overlay';

      if (this.selectable) {
        const cb = document.createElement('div');
        cb.className = 'mts-imagegallery__check' + (this._selected.has(img.id) ? ' mts-imagegallery__check--active' : '');
        cb.innerHTML = MTS.Icon.get('check');
        cb.addEventListener('click', (e) => { e.stopPropagation(); this._toggleSelect(img); });
        overlay.appendChild(cb);
      }

      if (this.showCaption && img.caption) {
        const cap = document.createElement('div');
        cap.className = 'mts-imagegallery__caption';
        cap.textContent = img.caption;
        overlay.appendChild(cap);
      }

      if (this.lightbox) {
        const zoomBtn = document.createElement('div');
        zoomBtn.className = 'mts-imagegallery__zoom';
        zoomBtn.innerHTML = MTS.Icon.get('maximize');
        overlay.appendChild(zoomBtn);
        card.addEventListener('click', () => this._openLB(this.images.indexOf(img)));
      }

      card.appendChild(overlay);
      grid.appendChild(card);
    });
  }

  _toggleSelect(img) {
    if (this._selected.has(img.id)) this._selected.delete(img.id);
    else this._selected.add(img.id);
    this._build();
    this._emit('select', { selected: this.getSelected(), image: img });
    this._el.dispatchEvent(new CustomEvent('mts:imagegallery:select', { bubbles: true, detail: { selected: this.getSelected(), image: img } }));
  }

  /* ── Lightbox ── */
  _openLB(idx) {
    this._closeLB();
    this._lbIdx = idx;
    const img = this.images[idx];
    if (!img) return;

    const lb = document.createElement('div');
    lb.className = 'mts-imagegallery__lb';
    lb.addEventListener('click', (e) => { if (e.target === lb) this._closeLB(); });

    const inner = document.createElement('div');
    inner.className = 'mts-imagegallery__lb-inner';

    const imgEl = document.createElement('img');
    imgEl.className = 'mts-imagegallery__lb-img';
    imgEl.src = img.src;
    imgEl.alt = img.alt || '';
    inner.appendChild(imgEl);

    if (img.caption) {
      const cap = document.createElement('div');
      cap.className = 'mts-imagegallery__lb-caption';
      cap.textContent = img.caption;
      inner.appendChild(cap);
    }

    const counter = document.createElement('div');
    counter.className = 'mts-imagegallery__lb-counter';
    counter.textContent = (idx + 1) + ' / ' + this.images.length;
    inner.appendChild(counter);

    lb.appendChild(inner);

    /* Cerrar */
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mts-imagegallery__lb-close';
    closeBtn.innerHTML = '×';
    closeBtn.addEventListener('click', () => this._closeLB());
    lb.appendChild(closeBtn);

    /* Nav prev/next */
    if (this.images.length > 1) {
      const prev = document.createElement('button');
      prev.className = 'mts-imagegallery__lb-nav mts-imagegallery__lb-nav--prev';
      prev.innerHTML = MTS.Icon.get('chevron-left');
      prev.addEventListener('click', () => this._openLB((this._lbIdx - 1 + this.images.length) % this.images.length));
      lb.appendChild(prev);

      const next = document.createElement('button');
      next.className = 'mts-imagegallery__lb-nav mts-imagegallery__lb-nav--next';
      next.innerHTML = MTS.Icon.get('chevron-right');
      next.addEventListener('click', () => this._openLB((this._lbIdx + 1) % this.images.length));
      lb.appendChild(next);
    }

    document.body.appendChild(lb);
    this._lbEl = lb;
    requestAnimationFrame(() => lb.classList.add('mts-imagegallery__lb--visible'));

    /* Keyboard */
    this._lbKeyHandler = (e) => {
      if (e.key === 'Escape') this._closeLB();
      if (e.key === 'ArrowLeft')  this._openLB((this._lbIdx - 1 + this.images.length) % this.images.length);
      if (e.key === 'ArrowRight') this._openLB((this._lbIdx + 1) % this.images.length);
    };
    document.addEventListener('keydown', this._lbKeyHandler);

    this._emit('open', { image: img, index: idx });
    this._el.dispatchEvent(new CustomEvent('mts:imagegallery:open', { bubbles: true, detail: { image: img, index: idx } }));
  }

  _closeLB() {
    if (this._lbEl) { this._lbEl.remove(); this._lbEl = null; }
    if (this._lbKeyHandler) { document.removeEventListener('keydown', this._lbKeyHandler); this._lbKeyHandler = null; }
  }

  _syncClasses(classes) {
    const previousMatiosClasses = [...this._el.classList].filter(cls =>
      cls === 'mts-imagegallery' || cls.startsWith('mts-imagegallery--')
    );
    if (previousMatiosClasses.length) this._el.classList.remove(...previousMatiosClasses);
    this._el.classList.add(...classes.filter(Boolean));
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el?.dispatchEvent(new CustomEvent(`mts:imagegallery:${event}`, { bubbles: true, detail }));
  }
};
