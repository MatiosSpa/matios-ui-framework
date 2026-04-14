/* ============================================================
   MATIOS UI — matios-ui-paging.js  v1.0.0
   MTS.Paging — Componente de paginación standalone

   Uso:
     const pager = new MTS.Paging('#paginacion', {
       total:    150,      // total de registros
       page:     1,        // página actual (1-based)
       pageSize: 10,       // registros por página
       
       // Apariencia
       variant:      'primary',   // 'primary'|'secondary'|'ghost'|'custom'
       showInfo:     true,        // mostrar "Mostrando 1–10 de 150"
       showPageSize: true,        // selector de registros por página
       pageSizes:    [10,25,50,100],
       maxVisible:   5,           // páginas visibles antes de mostrar ...
       showEdges:    true,        // mostrar primera y última página siempre
       
       // Callbacks
       onChange:      (page, pageSize) => {},
       onNext:        (page) => {},
       onPrev:        (page) => {},
       onPageClick:   (page) => {},
       onPageSizeChange: (pageSize) => {},
     })

     // Con datos del servidor (respuesta API)
     pager.setResponse({
       page:        1,
       pageSize:    10,
       total:       150,
       totalPages:  15,
       hasNext:     true,
       hasPrev:     false,
       from:        1,
       to:          10,
     })

   API:
     pager.setPage(3)
     pager.setTotal(200)
     pager.setPageSize(25)
     pager.next()
     pager.prev()
     pager.getState()    → { page, pageSize, total, totalPages }
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Paging = class MtsPaging {

  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector) : selector;
    if (!this._el) { console.error('[MTS.Paging] No encontrado:', selector); return; }

    /* Opciones */
    this.total        = options.total        ?? 0;
    this.page         = options.page         ?? 1;
    this.pageSize     = options.pageSize     ?? 10;
    this.variant      = options.variant      || 'primary';
    this.showInfo     = options.showInfo     ?? true;
    this.showPageSize = options.showPageSize ?? false;
    this.pageSizes    = options.pageSizes    || [10, 25, 50, 100];
    this.maxVisible   = options.maxVisible   ?? 5;
    this.showEdges    = options.showEdges    ?? true;
    /* Texto/contenido de botones de navegación — acepta texto, HTML, emoji */
    this.btnFirst     = options.btnFirst     ?? '«';   // ir al inicio
    this.btnPrev      = options.btnPrev      ?? '‹';   // anterior
    this.btnNext      = options.btnNext      ?? '›';   // siguiente
    this.btnLast      = options.btnLast      ?? '»';   // ir al final
    this.showFirst    = options.showFirst    ?? true;  // mostrar botón inicio
    this.showLast     = options.showLast     ?? true;  // mostrar botón final
    this.grouped      = options.grouped      ?? false; // botones agrupados sin gap
    this.size         = options.size         || '';    // 'sm' | '' | 'lg'

    this._listeners = {};

    // Fires on any page/size change: ({ page, pageSize }) => {}
    // Se dispara en cualquier cambio de página o tamaño
    if (options.onChange)        this.on('change',        options.onChange);

    // Fires when advancing to next page: ({ page }) => {}
    // Se dispara al avanzar a la siguiente página
    if (options.onNext)          this.on('next',          options.onNext);

    // Fires when going to previous page: ({ page }) => {}
    // Se dispara al retroceder a la página anterior
    if (options.onPrev)          this.on('prev',          options.onPrev);

    // Fires when a page number is clicked: ({ page }) => {}
    // Se dispara al hacer click en un número de página
    if (options.onPageClick)     this.on('pageClick',     options.onPageClick);

    // Fires when page size changes: ({ pageSize }) => {}
    // Se dispara al cambiar el tamaño de página
    if (options.onPageSizeChange) this.on('pageSizeChange', options.onPageSizeChange);

    this._build();
  }

  /* ============================================================
     API PÚBLICA
     ============================================================ */

  setPage(p) {
    const tp = this.totalPages;
    this.page = Math.max(1, Math.min(p, tp || 1));
    this._render();
    return this;
  }

  next() {
    if (!this.hasNext) return this;
    this.page++;
    this._render();
    this._emit('next',   { page: this.page });
    this._emit('change', { page: this.page, pageSize: this.pageSize });
    return this;
  }

  prev() {
    if (!this.hasPrev) return this;
    this.page--;
    this._render();
    this._emit('prev',   { page: this.page });
    this._emit('change', { page: this.page, pageSize: this.pageSize });
    return this;
  }

  setTotal(n) {
    this.total = n;
    if (this.page > this.totalPages) this.page = Math.max(1, this.totalPages);
    this._render();
    return this;
  }

  setPageSize(n) {
    this.pageSize = n;
    this.page = 1;
    this._render();
    this._emit('pageSizeChange', { pageSize: n });
    this._emit('change', { page: this.page, pageSize: this.pageSize });
    this._emit('pageSizeChange', { pageSize: n });
    return this;
  }

  /* Recibir respuesta del servidor y actualizar el estado */
  setResponse(res) {
    if (res.total       != null) this.total    = res.total;
    if (res.page        != null) this.page     = res.page;
    if (res.pageSize    != null) this.pageSize = res.pageSize;
    /* Soportar hasnext/hasNext ambos */
    if (res.hasNext     != null) this._hasNextOverride = res.hasNext;
    if (res.hasnext     != null) this._hasNextOverride = res.hasnext;
    if (res.hasPrev     != null) this._hasPrevOverride = res.hasPrev;
    if (res.haspreview  != null) this._hasPrevOverride = res.haspreview;
    if (res.totalPages  != null) this._totalPagesOverride = res.totalPages;
    this._render();
    return this;
  }

  getState() {
    return {
      page:       this.page,
      pageSize:   this.pageSize,
      total:      this.total,
      totalPages: this.totalPages,
      hasNext:    this.hasNext,
      hasPrev:    this.hasPrev,
      from:       this.from,
      to:         this.to,
    };
  }

  on(event, fn) {
    (this._listeners[event] = this._listeners[event] || []).push(fn);
    return this;
  }

  destroy() { this._el.innerHTML = ''; }

  /* ── Computados ── */
  get totalPages() {
    return this._totalPagesOverride ?? (Math.ceil(this.total / this.pageSize) || 1);
  }
  get hasNext() {
    return this._hasNextOverride ?? (this.page < this.totalPages);
  }
  get hasPrev() {
    return this._hasPrevOverride ?? (this.page > 1);
  }
  get from() {
    return Math.min((this.page - 1) * this.pageSize + 1, this.total);
  }
  get to() {
    return Math.min(this.page * this.pageSize, this.total);
  }

  /* ============================================================
     BUILD / RENDER
     ============================================================ */

  _build() {
    const classes = ['mts-paging', `mts-paging--${this.variant}`];
    if (this.grouped) classes.push('mts-paging--grouped');
    if (this.size)    classes.push(`mts-paging--${this.size}`);
    this._el.className = classes.join(' ');
    this._render();
  }

  _render() {
    this._el.innerHTML = '';

    /* ── Info de registros ── */
    if (this.showInfo && this.total > 0) {
      const info = document.createElement('div');
      info.className = 'mts-paging__info';
      info.textContent = `Mostrando ${this.from}–${this.to} de ${this.total.toLocaleString()} registros`;
      this._el.appendChild(info);
    }

    /* ── Spacer ── */
    const spacer = document.createElement('div');
    spacer.style.flex = '1';
    this._el.appendChild(spacer);

    /* ── Selector de pageSize ── */
    if (this.showPageSize) {
      const psWrap = document.createElement('div');
      psWrap.className = 'mts-paging__size-wrap';
      const psLabel = document.createElement('span');
      psLabel.className = 'mts-paging__size-label';
      psLabel.textContent = 'Por página:';
      const psSel = document.createElement('select');
      psSel.className = 'mts-paging__size-select';
      this.pageSizes.forEach(n => {
        const opt = document.createElement('option');
        opt.value = n; opt.textContent = n;
        if (n === this.pageSize) opt.selected = true;
        psSel.appendChild(opt);
      });
      psSel.addEventListener('change', () => this.setPageSize(Number(psSel.value)));
      psWrap.appendChild(psLabel);
      psWrap.appendChild(psSel);
      this._el.appendChild(psWrap);
    }

    /* ── Controles de página ── */
    const ctrl = document.createElement('div');
    ctrl.className = 'mts-paging__controls';

    /* Botón ir al inicio */
    if (this.showFirst) {
      ctrl.appendChild(this._makeBtn(this.btnFirst, !this.hasPrev, () => {
        this.setPage(1);
        this._emit('change', { page: this.page, pageSize: this.pageSize });
        this._emit('change', { page: this.page, pageSize: this.pageSize });
      }, 'mts-paging__btn mts-paging__btn--nav', 'Primera página'));
    }

    /* Botón anterior */
    ctrl.appendChild(this._makeBtn(this.btnPrev, !this.hasPrev, () => {
      this.prev();
      this._emit('prev',   { page: this.page });
      this._emit('change', { page: this.page, pageSize: this.pageSize });
    }, 'mts-paging__btn mts-paging__btn--nav', 'Anterior'));

    /* Páginas */
    const pages = this._getPageRange();
    pages.forEach(p => {
      if (p === '...') {
        const dots = document.createElement('span');
        dots.className = 'mts-paging__dots';
        dots.textContent = '···';
        ctrl.appendChild(dots);
      } else {
        const btn = this._makeBtn(String(p), false, () => {
          if (p === this.page) return;
          this.page = p;
          this._render();
          this._emit('pageClick', { page: p });
          this._emit('change', { page: this.page, pageSize: this.pageSize });
          this._emit('change', { page: this.page, pageSize: this.pageSize });
          this._emit('pageClick', { page: p });
        }, `mts-paging__btn${p === this.page ? ' active' : ''}`, `Ir a página ${p}`);
        ctrl.appendChild(btn);
      }
    });

    /* Botón siguiente */
    ctrl.appendChild(this._makeBtn(this.btnNext, !this.hasNext, () => {
      this.next();
    }, 'mts-paging__btn mts-paging__btn--nav', 'Siguiente'));

    /* Botón ir al final */
    if (this.showLast) {
      ctrl.appendChild(this._makeBtn(this.btnLast, !this.hasNext, () => {
        this.setPage(this.totalPages);
        this._emit('change', { page: this.page, pageSize: this.pageSize });
        this._emit('change', { page: this.page, pageSize: this.pageSize });
      }, 'mts-paging__btn mts-paging__btn--nav', 'Última página'));
    }

    this._el.appendChild(ctrl);
  }

  /* Calcular el rango de páginas a mostrar con ... */
  _getPageRange() {
    const tp  = this.totalPages;
    const cur = this.page;
    const max = this.maxVisible;

    if (tp <= max + 2) {
      /* Mostrar todas */
      return Array.from({ length: tp }, (_, i) => i + 1);
    }

    const pages = [];
    const half  = Math.floor(max / 2);
    let start   = Math.max(2, cur - half);
    let end     = Math.min(tp - 1, cur + half);

    /* Ajustar ventana */
    if (cur - half < 2) end   = Math.min(tp - 1, max);
    if (cur + half > tp - 1) start = Math.max(2, tp - max);

    if (this.showEdges) pages.push(1);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < tp - 1) pages.push('...');
    if (this.showEdges) pages.push(tp);

    return pages;
  }

  _makeBtn(text, disabled, onClick, className, title) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.textContent = text;
    btn.disabled    = disabled;
    if (title) btn.title = title;
    if (!disabled) btn.addEventListener('click', onClick);
    return btn;
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:paging:${event}`, { bubbles: true, detail }));
  }
};
