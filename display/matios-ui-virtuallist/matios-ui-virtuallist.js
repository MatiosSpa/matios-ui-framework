/* ============================================================
   MATIOS UI — matios-ui-virtuallist.js
   MTS.VirtualList — Lista virtualizada para miles de ítems
   Solo renderiza los ítems visibles + buffer.
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.VirtualList = class MtsVirtualList {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {Array}    options.items        Array de datos (cualquier tipo)
   * @param {function} options.renderItem   (item, index) => HTMLElement|string
   * @param {number}   options.itemHeight   Altura fija de cada ítem en px — default: 48
   * @param {number}   options.height       Altura del contenedor — default: 400
   * @param {number}   options.buffer       Ítems extra fuera del viewport — default: 5
   * @param {function} options.onScroll     ({ scrollTop, firstVisible, lastVisible }) => {}
   * @param {function} options.onEndReached ({ total }) => {} — para infinite scroll
   * @param {number}   options.endThreshold  px antes del final para disparar onEndReached — default: 100
   */
  constructor(selector, options = {}) {
    this._el         = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    this.items       = options.items       || [];
    this.renderItem  = options.renderItem  || ((item) => { const d=document.createElement('div'); d.textContent=String(item); return d; });
    this.itemHeight  = options.itemHeight  ?? 48;
    this.height      = options.height      ?? 400;
    this.buffer      = options.buffer      ?? 5;
    this._listeners   = {};

    // Fires on scroll: ({ scrollTop, firstVisible, lastVisible }) => {}
    // Se dispara al hacer scroll
    if (options.onScroll)     this.on('scroll',     options.onScroll);

    // Fires when scroll reaches the end: ({ total }) => {} — for infinite scroll
    // Se dispara al llegar al final — para infinite scroll
    if (options.onEndReached) this.on('endReached', options.onEndReached);
    this.endThreshold  = options.endThreshold ?? 100;
    this._scrollTop  = 0;
    this._endFired   = false;
    this._build();
  }

  /* ── API ── */
  setItems(items)   { this.items = items; this._endFired = false; this._update(); return this; }
  appendItems(items){ this.items = this.items.concat(items); this._endFired = false; this._update(); return this; }
  scrollTo(index)   {
    const top = index * this.itemHeight;
    if (this._scrollEl) this._scrollEl.scrollTop = top;
    return this;
  }
  scrollToIndex(index) { return this.scrollTo(index); }
  scrollToTop()     { if (this._scrollEl) this._scrollEl.scrollTop = 0; return this; }
  getVisibleRange() {
    const first = Math.max(0, Math.floor(this._scrollTop / this.itemHeight) - this.buffer);
    const last  = Math.min(this.items.length - 1, Math.ceil((this._scrollTop + this.height) / this.itemHeight) + this.buffer);
    return { first, last };
  }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }
  destroy()  { this._el.innerHTML = ''; }

  _build() {
    this._el.innerHTML = '';
    this._el.style.position = 'relative';

    /* Scroll container */
    const scroll = document.createElement('div');
    scroll.className = 'mts-vlist';
    scroll.style.height   = this.height + 'px';
    scroll.style.overflowY = 'auto';
    scroll.style.position  = 'relative';
    scroll.style.willChange = 'scroll-position';
    this._scrollEl = scroll;

    /* Spacer total */
    const spacer = document.createElement('div');
    spacer.style.height = (this.items.length * this.itemHeight) + 'px';
    spacer.style.position = 'relative';
    this._spacerEl = spacer;

    /* Visible items container */
    const visible = document.createElement('div');
    visible.className = 'mts-vlist__visible';
    visible.style.cssText = 'position:absolute;top:0;left:0;right:0;';
    this._visibleEl = visible;

    spacer.appendChild(visible);
    scroll.appendChild(spacer);
    this._el.appendChild(scroll);

    scroll.addEventListener('scroll', () => {
      this._scrollTop = scroll.scrollTop;
      this._update();

      const { first, last } = this.getVisibleRange();
      this._emit('scroll', { scrollTop: this._scrollTop, firstVisible: first, lastVisible: last });

      /* End reached */
      if ((this._listeners['endReached']||[]).length && !this._endFired) {
        const remaining = this._spacerEl.offsetHeight - scroll.scrollTop - scroll.offsetHeight;
        if (remaining <= this.endThreshold) {
          this._endFired = true;
          this._emit('endReached', { total: this.items.length });
        }
      }
    }, { passive: true });

    this._update();
  }

  _update() {
    if (!this._visibleEl || !this._spacerEl) return;

    /* Actualizar spacer */
    this._spacerEl.style.height = (this.items.length * this.itemHeight) + 'px';

    const first = Math.max(0, Math.floor(this._scrollTop / this.itemHeight) - this.buffer);
    const last  = Math.min(this.items.length - 1,
      Math.ceil((this._scrollTop + this.height) / this.itemHeight) + this.buffer);

    /* Limpiar y renderizar solo los visibles */
    this._visibleEl.innerHTML = '';
    this._visibleEl.style.top = (first * this.itemHeight) + 'px';

    for (let i = first; i <= last; i++) {
      const item = this.items[i];
      if (item === undefined) continue;

      let el = this.renderItem(item, i);
      if (typeof el === 'string') {
        const wrap = document.createElement('div');
        wrap.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(el) : el;
        el = wrap.firstElementChild || wrap;
      }
      el.style.height    = this.itemHeight + 'px';
      el.style.boxSizing = 'border-box';
      el.style.overflow  = 'hidden';
      this._visibleEl.appendChild(el);
    }
  }
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el?.dispatchEvent(new CustomEvent(`mts:virtuallist:${event}`, { bubbles: true, detail }));
  }
};
