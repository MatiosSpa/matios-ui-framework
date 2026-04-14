/* ============================================================
   MATIOS UI — matios-ui-infinite.js  v1.0.0
   MTS.Infinite — Scroll infinito con IntersectionObserver

   El componente NO hace fetch. El dev controla los datos
   a través de onLoadMore.

   Uso:
     const list = new MTS.Infinite('#mi-lista', {
       onLoadMore: async ({ page, pageSize }) => {
         const res = await fetch(`/api/items?page=${page}&pageSize=${pageSize}`)
         const data = await res.json()
         return {
           items:   data.items,   // array de items a renderizar
           hasMore: data.hasNext, // hay más datos?
         }
       },
       renderItem: (item) => `<div class="mi-card">${item.nombre}</div>`,
     })
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Infinite = class MtsInfinite {

  /**
   * @param {string|Element} selector
   * @param {object}  options
   * @param {function} options.onLoadMore        async ({ page, pageSize }) => { items, hasMore }
   * @param {function} options.renderItem        (item, index) => HTMLString | HTMLElement
   * @param {number}   options.pageSize          Registros por carga — default: 20
   * @param {string}   options.layout            'vertical'|'grid'|'table' — default: 'vertical'
   * @param {number}   options.threshold         IntersectionObserver threshold — default: 0.1
   * @param {string}   options.loaderText        Texto del loader — default: 'Cargando...'
   * @param {string}   options.endText           Texto al terminar — default: 'No hay más resultados'
   * @param {object}   options.emptyState        { icon, title, message }
   * @param {boolean}  options.animate           Animar entrada de items — default: true
   * @param {function} options.onLoad            (items, page) => {} — callback post carga
   * @param {function} options.onError           (error) => {}
   * @param {function} options.onEnd             () => {} — al llegar al final
   */
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) { console.error('[MTS.Infinite] No encontrado:', selector); return; }

    /* Opciones */
    // Data loader — async ({ page, pageSize }) => { items, hasMore } — not an event, required
    // Cargador de datos — no es un evento, es requerido
    this._onLoadMore = options.onLoadMore || null;

    // Item renderer: (item, index) => HTMLString | HTMLElement / Renderizador de ítems
    this._renderItem = options.renderItem || null;
    this.pageSize     = options.pageSize    ?? 20;
    this.layout       = options.layout      || 'vertical';
    this.threshold    = options.threshold   ?? 0.1;
    this.loaderText   = options.loaderText  || 'Cargando...';
    this.endText      = options.endText     || 'No hay más resultados';
    this.animate      = options.animate     ?? true;
    this.emptyState   = options.emptyState  || { icon: '📭', title: 'Sin resultados', message: '' };
    // Fires after each load: ({ items, page }) => {} / Se dispara tras cada carga
    if (options.onLoad)  this.on('load',  options.onLoad);

    // Fires on load error: ({ error }) => {} / Se dispara al ocurrir un error
    if (options.onError) this.on('error', options.onError);

    // Fires when all data is loaded / Se dispara al cargar todos los datos
    if (options.onEnd)   this.on('end',   options.onEnd);

    /* Estado */
    this._page        = 1;
    this._loading     = false;
    this._hasMore     = true;
    this._totalLoaded = 0;
    this._listeners   = {};
    this._observer    = null;

    this._build();
    this._observe();
  }

  /* ============================================================
     API PÚBLICA
     ============================================================ */

  /** Resetea la lista y vuelve a cargar desde la página 1 */
  reset() {
    this._page        = 1;
    this._loading     = false;
    this._hasMore     = true;
    this._totalLoaded = 0;
    this._listEl.innerHTML = '';
    this._hideAll();
    this._observe();
    return this;
  }

  /** Agrega items manualmente sin pasar por onLoadMore */
  appendItems(items) {
    items.forEach((item, i) => this._appendItem(item, this._totalLoaded + i));
    this._totalLoaded += items.length;
    return this;
  }

  /** Retorna el total de items cargados */
  getCount() { return this._totalLoaded; }

  /** Pausa el observer (deja de detectar scroll) */
  pause() {
    this._observer?.unobserve(this._sentinelEl);
    return this;
  }

  /** Reanuda el observer */
  resume() {
    if (this._hasMore) this._observer?.observe(this._sentinelEl);
    return this;
  }

  /** Destruye la instancia */
  destroy() {
    this._observer?.disconnect();
    this._el.innerHTML = '';
  }

  on(event, fn) {
    (this._listeners[event] = this._listeners[event] || []).push(fn);
    return this;
  }

  /* ============================================================
     BUILD
     ============================================================ */

  _build() {
    this._el.className = 'mts-infinite';

    /* Lista */
    this._listEl = document.createElement('div');
    this._listEl.className = `mts-infinite__list mts-infinite__list--${this.layout}`;
    this._el.appendChild(this._listEl);

    /* Sentinel */
    this._sentinelEl = document.createElement('div');
    this._sentinelEl.className = 'mts-infinite__sentinel';
    this._el.appendChild(this._sentinelEl);

    /* Loader */
    this._loaderEl = document.createElement('div');
    this._loaderEl.className = 'mts-infinite__loader';
    this._loaderEl.innerHTML = `
      <span class="mts-infinite__loader-spinner"></span>
      <span>${this.loaderText}</span>
    `;
    this._el.appendChild(this._loaderEl);

    /* Empty state */
    this._emptyEl = document.createElement('div');
    this._emptyEl.className = 'mts-infinite__empty';
    this._emptyEl.innerHTML = `
      <span class="mts-infinite__empty-icon">${this.emptyState.icon || '📭'}</span>
      <span class="mts-infinite__empty-title">${this.emptyState.title || 'Sin resultados'}</span>
      ${this.emptyState.message
        ? `<span class="mts-infinite__empty-msg">${this.emptyState.message}</span>`
        : ''}
    `;
    this._el.appendChild(this._emptyEl);

    /* End */
    this._endEl = document.createElement('div');
    this._endEl.className = 'mts-infinite__end';
    this._endEl.textContent = this.endText;
    this._el.appendChild(this._endEl);

    /* Error */
    this._errorEl = document.createElement('div');
    this._errorEl.className = 'mts-infinite__error';
    this._el.appendChild(this._errorEl);
  }

  /* ============================================================
     INTERSECTION OBSERVER
     ============================================================ */

  _observe() {
    this._observer?.disconnect();

    this._observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this._loading && this._hasMore) {
          this._load();
        }
      },
      { threshold: this.threshold }
    );

    this._observer.observe(this._sentinelEl);
  }

  /* ============================================================
     CARGA
     ============================================================ */

  async _load() {
    if (!this._onLoadMore || this._loading || !this._hasMore) return;

    this._loading = true;
    this._showLoader();
    this._hideError();

    try {
      const result = await this._onLoadMore({
        page:     this._page,
        pageSize: this.pageSize,
      });

      const items   = result?.items   ?? result ?? [];
      const hasMore = result?.hasMore ?? (items.length >= this.pageSize);

      if (this._page === 1 && items.length === 0) {
        this._showEmpty();
      } else {
        items.forEach((item, i) => {
          this._appendItem(item, this._totalLoaded + i);
        });
        this._totalLoaded += items.length;
        this._page++;
      }

      this._hasMore = hasMore;

      if (!hasMore) {
        this._observer?.unobserve(this._sentinelEl);
        if (this._totalLoaded > 0) this._showEnd();
        this._emit('end', { total: this._totalLoaded });
      }

      this._emit('load', { items, page: this._page - 1 });
      this._emit('load', { items, page: this._page - 1, total: this._totalLoaded });

    } catch (err) {
      console.error('[MTS.Infinite] onLoadMore error:', err);
      this._showError(err?.message || 'Error al cargar datos');
      this._emit('error', { error: err });
      this._emit('error', { error: err });
    } finally {
      this._loading = false;
      this._hideLoader();
    }
  }

  /* ============================================================
     RENDER DE ITEMS
     ============================================================ */

  _appendItem(item, index) {
    let el;

    if (this._renderItem) {
      const result = this._renderItem(item, index);
      if (typeof result === 'string') {
        const wrap = document.createElement('div');
        wrap.className = 'mts-infinite__item';
        wrap.innerHTML = result;
        el = wrap;
      } else if (result instanceof HTMLElement) {
        el = result;
      }
    } else {
      /* Fallback: JSON como texto */
      const wrap = document.createElement('div');
      wrap.className = 'mts-infinite__item';
      wrap.textContent = JSON.stringify(item);
      el = wrap;
    }

    if (el) {
      if (this.animate) el.classList.add('mts-infinite__item--entering');
      this._listEl.appendChild(el);
    }
  }

  /* ============================================================
     ESTADOS VISUALES
     ============================================================ */

  _showLoader()  { this._loaderEl.classList.add('mts-infinite__loader--visible'); }
  _hideLoader()  { this._loaderEl.classList.remove('mts-infinite__loader--visible'); }

  _showEmpty()   { this._emptyEl.classList.add('mts-infinite__empty--visible'); }
  _hideEmpty()   { this._emptyEl.classList.remove('mts-infinite__empty--visible'); }

  _showEnd()     { this._endEl.classList.add('mts-infinite__end--visible'); }
  _hideEnd()     { this._endEl.classList.remove('mts-infinite__end--visible'); }

  _showError(msg) {
    this._errorEl.innerHTML = `
      <span>⚠️ ${msg}</span>
      <button class="mts-btn mts-btn--ghost mts-btn--xs" onclick="this.closest('.mts-infinite__error').dispatchEvent(new CustomEvent('retry'))">
        Reintentar
      </button>
    `;
    this._errorEl.classList.add('mts-infinite__error--visible');
    this._errorEl.addEventListener('retry', () => {
      this._hideError();
      this._load();
    }, { once: true });
  }

  _hideError() { this._errorEl.classList.remove('mts-infinite__error--visible'); }

  _hideAll() {
    this._hideLoader();
    this._hideEmpty();
    this._hideEnd();
    this._hideError();
  }

  /* ============================================================
     EVENTOS
     ============================================================ */

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:infinite:${event}`, {
      bubbles: true,
      detail,
    }));
  }
};
