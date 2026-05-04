/* ============================================================
   MATIOS UI — matios-ui-pagination.js
   MTS.Pagination — Paginación completa con page size y resumen
   Version: 1.2.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.Pagination = class MtsPagination {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {number}   options.total       Total de registros
   * @param {number}   options.page        Página actual — default: 1
   * @param {number}   options.pageSize    Registros por página — default: 10
   * @param {Array}    options.pageSizes   Opciones de page size — default: [10,25,50,100]
   * @param {boolean}  options.showSizes   Muestra selector de page size — default: true
   * @param {boolean}  options.showInfo    Muestra "Mostrando X-Y de Z" — default: true
   * @param {boolean}  options.showJump    Input para ir a página — default: false
   * @param {number}   options.siblings    Páginas a cada lado del activo — default: 1
   * @param {string}   options.size        'sm'|'md'|'lg' — default: 'md'
   * @param {function} options.onChange    ({ page, pageSize, total, from, to }) => {}
   */
  constructor(selector, options = {}) {
    this._el       = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    /* ── data-* → inicialización HTML declarativa ── */
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.total !== undefined) _fromHTML.total = parseInt(_ds.total);
    if (_ds.page !== undefined) _fromHTML.page = parseInt(_ds.page);
    if (_ds.pageSize !== undefined) _fromHTML.pageSize = parseInt(_ds.pageSize);
    if (_ds.size !== undefined) _fromHTML.size = _ds.size;
    if (_ds.showInfo !== undefined) _fromHTML.showInfo = true;
    if (_ds.showJump !== undefined) _fromHTML.showJump = true;
    options = { ..._fromHTML, ...options };

    // Total number of records / Total de registros
    this.total = options.total ?? 0;

    // Current page (1-based) / Página actual (base 1)
    this.page = options.page ?? 1;

    // Records per page / Registros por página
    this.pageSize = options.pageSize ?? 10;

    // Page size options for the selector / Opciones del selector de page size
    this.pageSizes = options.pageSizes || [10, 25, 50, 100];

    // Show page size selector / Mostrar selector de page size
    this.showSizes = options.showSizes ?? true;

    // Show "Showing X-Y of Z" summary / Mostrar resumen "Mostrando X-Y de Z"
    this.showInfo = options.showInfo ?? true;

    // Show jump-to-page input / Mostrar input para ir a página
    this.showJump = options.showJump ?? false;

    // Pages shown on each side of the active page / Páginas a cada lado del activo
    this.siblings = options.siblings ?? 1;

    // Size variant: 'sm' | 'md' | 'lg' / Variante de tamaño
    this.size = options.size || 'md';

    this._listeners = {};

    // Fires when page or page size changes / Se dispara al cambiar la página o el page size
    if (options.onChange) this.on('change', options.onChange);
    this._build();
  }

  /* ── API ── */
  setPage(p)     { this.page = Math.max(1, Math.min(p, this._totalPages())); this._build(); this._emit(); return this; }
  setTotal(t)    { this.total = t; this.page = 1; this._build(); return this; }
  setPageSize(s) { this.pageSize = s; this.page = 1; this._build(); this._emit(); return this; }
  getState()     { return { page:this.page, pageSize:this.pageSize, total:this.total, from:this._from(), to:this._to() }; }
  on(e, cb)      { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }

  _totalPages() { return Math.max(1, Math.ceil(this.total / this.pageSize)); }
  _from()       { return this.total === 0 ? 0 : (this.page - 1) * this.pageSize + 1; }
  _to()         { return Math.min(this.page * this.pageSize, this.total); }

  _emit() {
    const detail = this.getState();
    (this._listeners['change'] || []).forEach(fn => fn({ type:'change', detail }));
    this._el.dispatchEvent(new CustomEvent('mts:pagination:change', { bubbles:true, detail }));
  }

  _pages() {
    const total = this._totalPages();
    const p = this.page;
    const s = this.siblings;
    const pages = [];
    const add = (n) => { if (n >= 1 && n <= total && !pages.includes(n)) pages.push(n); };

    add(1); add(total);
    for (let i = p - s; i <= p + s; i++) add(i);
    pages.sort((a, b) => a - b);

    /* Insertar '...' donde hay saltos */
    const result = [];
    for (let i = 0; i < pages.length; i++) {
      if (i > 0 && pages[i] - pages[i-1] > 1) result.push('...' + i);
      result.push(pages[i]);
    }
    return result;
  }

  _build() {
    this._el.replaceChildren();
    this._syncClasses(['mts-pagination', 'mts-pagination--' + this.size]);
    const tp = this._totalPages();

    /* Info "Mostrando X-Y de Z" */
    if (this.showInfo) {
      const info = document.createElement('span');
      info.className = 'mts-pagination__info';
      info.textContent = this.total === 0
        ? 'Sin resultados'
        : 'Mostrando ' + this._from() + '–' + this._to() + ' de ' + this.total;
      this._el.appendChild(info);
    }

    const right = document.createElement('div');
    right.className = 'mts-pagination__right';

    /* Selector de page size */
    if (this.showSizes) {
      const sizeWrap = document.createElement('div');
      sizeWrap.className = 'mts-pagination__sizes';
      const lbl = document.createElement('span');
      lbl.className = 'mts-pagination__sizes-label';
      lbl.textContent = 'Filas:';
      const sel = document.createElement('select');
      sel.className = 'mts-pagination__size-select';
      this.pageSizes.forEach(s => {
        const o = document.createElement('option');
        o.value = s; o.textContent = s;
        if (s === this.pageSize) o.selected = true;
        sel.appendChild(o);
      });
      sel.addEventListener('change', () => this.setPageSize(Number(sel.value)));
      sizeWrap.appendChild(lbl);
      sizeWrap.appendChild(sel);
      right.appendChild(sizeWrap);
    }

    /* Controles de páginas */
    const nav = document.createElement('div');
    nav.className = 'mts-pagination__nav';

    const btn = (label, page, disabled, isEllipsis) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'mts-pagination__btn' +
        (page === this.page ? ' mts-pagination__btn--active' : '') +
        (isEllipsis ? ' mts-pagination__btn--ellipsis' : '');
      b.disabled = disabled || isEllipsis;
      b.textContent = label;
      if (!disabled && !isEllipsis) b.addEventListener('click', () => this.setPage(page));
      return b;
    };

    nav.appendChild(btn('‹', this.page - 1, this.page === 1, false));
    this._pages().forEach(p => {
      if (typeof p === 'string') nav.appendChild(btn('…', 0, true, true));
      else nav.appendChild(btn(p, p, false, false));
    });
    nav.appendChild(btn('›', this.page + 1, this.page === tp, false));

    right.appendChild(nav);

    /* Jump to page */
    if (this.showJump) {
      const jumpWrap = document.createElement('div');
      jumpWrap.className = 'mts-pagination__jump';
      const lbl = document.createElement('span');
      lbl.textContent = 'Ir a:';
      lbl.className = 'mts-pagination__sizes-label';
      const inp = document.createElement('input');
      inp.type = 'number'; inp.min = 1; inp.max = tp;
      inp.className = 'mts-pagination__jump-input';
      inp.placeholder = this.page;
      inp.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const v = parseInt(inp.value);
          if (!isNaN(v)) { this.setPage(v); inp.value = ''; }
        }
      });
      jumpWrap.appendChild(lbl);
      jumpWrap.appendChild(inp);
      right.appendChild(jumpWrap);
    }

    this._el.appendChild(right);
  }

  _syncClasses(classes) {
    const previousMatiosClasses = [...this._el.classList].filter(cls =>
      cls === 'mts-pagination' || cls.startsWith('mts-pagination--')
    );
    if (previousMatiosClasses.length) this._el.classList.remove(...previousMatiosClasses);
    this._el.classList.add(...classes.filter(Boolean));
  }
};
