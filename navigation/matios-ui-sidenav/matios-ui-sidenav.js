/* ============================================================
   MATIOS UI — matios-ui-sidenav.js
   MTS.SideNav — Navegación lateral colapsable tipo dashboard
   Version: 2.1.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.SideNav = class MtsSideNav {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {object}   options.brand        { logo, title, onClick } — cabecera del nav
   * @param {MTS.Menu} options.menu         Instancia de MTS.Menu — se monta en modo tree
   * @param {string}   options.footer       HTML del pie de la nav
   * @param {boolean}  options.collapsed    Iniciar colapsado (solo íconos) — default: false
   * @param {string}   options.collapseBtn  Selector de botón externo de colapso
   * @param {function} options.onCollapse   function({ collapsed }) — se dispara al colapsar/expandir
   */
  constructor(selector, options) {
    options = options || {};
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) return;

    this.brand     = options.brand    || null;
    this.menu      = (options.menu && window.MTS && window.MTS.Menu && options.menu instanceof MTS.Menu)
                       ? options.menu : null;
    this.footer    = options.footer   || '';
    this.collapsed = options.collapsed !== undefined ? !!options.collapsed : false;

    this._menuNavEl = null;
    this._listeners = {};
    this._tipEl     = null;
    this._tipOver   = null;
    this._tipOut    = null;

    if (options.onCollapse) this.on('collapse', options.onCollapse);

    if (options.collapseBtn) {
      var btn = document.querySelector(options.collapseBtn);
      if (btn) btn.addEventListener('click', () => this.toggleCollapse());
    }

    this._build();
  }

  /* ════════════════════════════════════════════════════
     API PÚBLICA
     ════════════════════════════════════════════════════ */

  /** Colapsa (solo íconos) */
  collapse() { this.collapsed = true;  this._applyCollapse(); return this; }

  /** Expande */
  expand()   { this.collapsed = false; this._applyCollapse(); return this; }

  /** Alterna colapso */
  toggleCollapse() { this.collapsed = !this.collapsed; this._applyCollapse(); return this; }

  /** Registra listener de evento */
  on(e, cb)  {
    if (!this._listeners[e]) this._listeners[e] = [];
    this._listeners[e].push(cb);
    return this;
  }

  /** Elimina listener de evento */
  off(e, cb) {
    this._listeners[e] = (this._listeners[e] || []).filter(function(f) { return f !== cb; });
    return this;
  }

  /** Desmonta y limpia */
  destroy() {
    if (this.menu && this._menuNavEl) this.menu._unmount(this._menuNavEl);
    this._destroyTooltip();
    this._el.innerHTML = '';
  }

  /* ════════════════════════════════════════════════════
     PRIVADOS — BUILD
     ════════════════════════════════════════════════════ */

  _build() {
    this._el.innerHTML = '';
    var cls = ['mts-sidenav'];
    if (this.collapsed) cls.push('mts-sidenav--collapsed');
    if (!this.brand)    cls.push('mts-sidenav--no-brand');
    this._syncClasses(cls);

    /* Brand */
    if (this.brand) {
      this._el.appendChild(this._buildBrand());
    }

    /* Toggle btn */
    var self = this;
    var toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'mts-sidenav__toggle';
    this._setToggleIcon(toggleBtn);
    toggleBtn.addEventListener('click', function() { self.toggleCollapse(); });
    this._el.appendChild(toggleBtn);

    /* Nav / MTS.Menu */
    var nav = document.createElement('nav');
    nav.className = 'mts-sidenav__nav';
    if (this.menu) {
      if (this._menuNavEl) this.menu._unmount(this._menuNavEl);
      this._menuNavEl = nav;
      this.menu._mount(nav, 'tree');
    }
    this._el.appendChild(nav);

    /* Footer */
    if (this.footer) {
      var footEl = document.createElement('div');
      footEl.className = 'mts-sidenav__footer';
      footEl.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(this.footer) : this.footer;
      this._el.appendChild(footEl);
    }

    /* Tooltip para estado colapsado */
    this._initTooltip(nav);
  }

  _buildBrand() {
    var b  = this.brand;
    var el = document.createElement('div');
    el.className = 'mts-sidenav__brand';

    if (b.onClick) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', b.onClick);
    }

    if (b.logo) {
      var logoWrap = document.createElement('div');
      logoWrap.className = 'mts-sidenav__brand-logo';
      logoWrap.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(b.logo) : b.logo;
      el.appendChild(logoWrap);
    }

    if (b.title) {
      var titleEl = document.createElement('div');
      titleEl.className = 'mts-sidenav__brand-title';
      titleEl.textContent = b.title;
      el.appendChild(titleEl);
    }

    return el;
  }

  _setToggleIcon(btn) {
    btn.innerHTML = this.collapsed
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>';
    btn.setAttribute('title', this.collapsed ? 'Expandir' : 'Colapsar');
  }

  _applyCollapse() {
    this._el.classList.toggle('mts-sidenav--collapsed', this.collapsed);

    /* Actualizar toggle btn */
    var btn = this._el.querySelector('.mts-sidenav__toggle');
    if (btn) this._setToggleIcon(btn);

    /* Ocultar tooltip si se expande */
    if (!this.collapsed) this._hideTooltip();

    this._emit('collapse', { collapsed: this.collapsed });
  }

  /* ════════════════════════════════════════════════════
     PRIVADOS — TOOLTIP (collapsed)
     ════════════════════════════════════════════════════ */

  /**
   * Crea un elemento tooltip en el body (position:fixed) y lo vincula
   * al nav con event delegation — así escapa el overflow:hidden del sidenav.
   */
  _initTooltip(nav) {
    var self = this;

    /* Singleton por instancia */
    if (!this._tipEl) {
      this._tipEl = document.createElement('div');
      this._tipEl.className = 'mts-sidenav__tip';
      document.body.appendChild(this._tipEl);
    }

    /* Limpiar handlers previos si se llama de nuevo */
    if (this._tipNav && this._tipOver) {
      this._tipNav.removeEventListener('mouseover',  this._tipOver);
      this._tipNav.removeEventListener('mouseout',   this._tipOut);
      this._tipNav.removeEventListener('mouseleave', this._tipOut);
    }

    this._tipNav = nav;

    this._tipOver = function(e) {
      if (!self.collapsed) return;
      var btn = e.target && e.target.closest && e.target.closest('.mts-menu__item--tree');
      if (!btn) return;
      var lbl = btn.querySelector('.mts-menu__label');
      if (!lbl) return;
      var text = lbl.textContent.trim();
      if (!text) return;

      var rect = btn.getBoundingClientRect();
      self._tipEl.textContent = text;
      self._tipEl.style.top  = (rect.top + rect.height / 2) + 'px';
      self._tipEl.style.left = (rect.right + 10) + 'px';
      self._tipEl.classList.add('mts-sidenav__tip--show');
    };

    this._tipOut = function(e) {
      /* Solo ocultar si salimos del botón o del nav */
      var related = e.relatedTarget;
      if (related && related.closest && related.closest('.mts-menu__item--tree')) return;
      self._hideTooltip();
    };

    nav.addEventListener('mouseover',  this._tipOver);
    nav.addEventListener('mouseout',   this._tipOut);
    nav.addEventListener('mouseleave', this._tipOut);
  }

  _hideTooltip() {
    if (this._tipEl) this._tipEl.classList.remove('mts-sidenav__tip--show');
  }

  _destroyTooltip() {
    if (this._tipNav && this._tipOver) {
      this._tipNav.removeEventListener('mouseover',  this._tipOver);
      this._tipNav.removeEventListener('mouseout',   this._tipOut);
      this._tipNav.removeEventListener('mouseleave', this._tipOut);
    }
    if (this._tipEl) {
      this._tipEl.remove();
      this._tipEl = null;
    }
  }

  /* ════════════════════════════════════════════════════
     PRIVADOS — HELPERS
     ════════════════════════════════════════════════════ */

  _syncClasses(classes) {
    var prev = Array.from(this._el.classList).filter(function(c) {
      return c === 'mts-sidenav' || c.startsWith('mts-sidenav--') || c === 'mts-sidenav--no-brand';
    });
    if (prev.length) this._el.classList.remove.apply(this._el.classList, prev);
    this._el.classList.add.apply(this._el.classList, classes.filter(Boolean));
  }

  _emit(event, detail) {
    var self = this;
    (this._listeners[event] || []).forEach(function(fn) { fn({ type: event, detail: detail }); });
    if (this._el && this._el.dispatchEvent) {
      this._el.dispatchEvent(new CustomEvent('mts:sidenav:' + event, { bubbles: true, detail: detail }));
    }
  }
};
