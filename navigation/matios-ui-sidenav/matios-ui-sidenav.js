/* ============================================================
   MATIOS UI — matios-ui-sidenav.js
   MTS.SideNav — Navegación lateral colapsable tipo dashboard
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.SideNav = class MtsSideNav {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {Array}    options.items        Árbol de items de navegación
   *   { id, label, icon?, badge?, href?, children?[], group?, divider?, disabled? }
   * @param {string}   options.active       ID del item activo
   * @param {boolean}  options.collapsed    Colapsado (solo íconos) — default: false
   * @param {string}   options.collapseBtn  Selector del botón externo de colapso
   * @param {string}   options.logo         HTML del logo
   * @param {string}   options.footer       HTML del footer de la nav
   * @param {boolean}  options.accordion    Solo un submenú abierto a la vez — default: true
   * @param {function} options.onChange     ({ item }) => {}
   * @param {function} options.onCollapse   (collapsed) => {}
   */
  constructor(selector, options = {}) {
    this._el       = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    // Navigation items tree / Árbol de ítems de navegación
    // [{ id, label, icon?, badge?, href?, children?[], group?, divider?, disabled? }]
    this.items = options.items || [];

    // Initially active item ID / ID del ítem activo inicial
    this.active = options.active || '';

    // Start collapsed (icons only) / Iniciar colapsado (solo íconos)
    this.collapsed = options.collapsed ?? false;

    // Logo HTML for the nav header / HTML del logo en el header
    this.logo = options.logo || '';

    // Footer HTML / HTML del pie de la nav
    this.footer = options.footer || '';

    // Only one submenu open at a time / Solo un submenú abierto a la vez
    this.accordion = options.accordion ?? true;

    this._openGroups = new Set();
    this._listeners  = {};

    // Fires when active item changes / Se dispara al cambiar el ítem activo
    if (options.onChange)   this.on('change',   options.onChange);

    // Fires when nav collapses or expands / Se dispara al colapsar o expandir
    if (options.onCollapse) this.on('collapse', options.onCollapse);

    // External collapse button selector / Selector del botón externo de colapso
    if (options.collapseBtn) {
      const btn = document.querySelector(options.collapseBtn);
      btn?.addEventListener('click', () => this.toggleCollapse());
    }

    this._autoOpenActive(this.items);
    this._build();
  }

  /* ── API ── */
  setActive(id)      { this.active = id; this._build(); return this; }
  collapse()         { this.collapsed = true;  this._applyCollapse(); return this; }
  expand()           { this.collapsed = false; this._applyCollapse(); return this; }
  toggleCollapse()   { this.collapsed = !this.collapsed; this._applyCollapse(); return this; }
  setItems(items)    { this.items = items; this._autoOpenActive(items); this._build(); return this; }
  setBadge(id, val)  {
    const n = this._findItem(id, this.items);
    if (n) { n.badge = val; this._build(); }
    return this;
  }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }
  destroy()  { this._el.innerHTML = ''; }

  _build() {
    this._el.innerHTML = '';
    this._syncClasses(['mts-sidenav'].concat(this.collapsed ? ['mts-sidenav--collapsed'] : []));

    /* Logo */
    if (this.logo) {
      const logoEl = document.createElement('div');
      logoEl.className = 'mts-sidenav__logo';
      logoEl.innerHTML = this.logo;
      this._el.appendChild(logoEl);
    }

    /* Toggle collapse btn interno */
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'mts-sidenav__toggle';
    toggleBtn.innerHTML = this.collapsed
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>';
    toggleBtn.setAttribute('title', this.collapsed ? 'Expandir' : 'Colapsar');
    toggleBtn.addEventListener('click', () => this.toggleCollapse());
    this._el.appendChild(toggleBtn);

    /* Items */
    const nav = document.createElement('nav');
    nav.className = 'mts-sidenav__nav';
    this._renderItems(this.items, nav, 0);
    this._el.appendChild(nav);

    /* Footer */
    if (this.footer) {
      const footEl = document.createElement('div');
      footEl.className = 'mts-sidenav__footer';
      footEl.innerHTML = this.footer;
      this._el.appendChild(footEl);
    }
  }

  _renderItems(items, container, depth) {
    items.forEach(item => {
      /* Divisor */
      if (item.divider) {
        const div = document.createElement('div');
        div.className = 'mts-sidenav__divider';
        container.appendChild(div);
        return;
      }
      /* Grupo (solo label, no clickable) */
      if (item.group) {
        const grp = document.createElement('div');
        grp.className = 'mts-sidenav__group-label';
        grp.textContent = item.group;
        container.appendChild(grp);
        return;
      }

      const hasChildren = item.children && item.children.length > 0;
      const isOpen      = this._openGroups.has(item.id);
      const isActive    = item.id === this.active;

      /* Item row */
      const row = document.createElement(item.href && !hasChildren ? 'a' : 'button');
      row.className = 'mts-sidenav__item'
        + (isActive    ? ' mts-sidenav__item--active'   : '')
        + (item.disabled ? ' mts-sidenav__item--disabled' : '')
        + (depth > 0   ? ' mts-sidenav__item--sub'      : '');
      if (item.href && !hasChildren) row.href = item.href;
      else row.type = 'button';
      row.style.paddingLeft = depth > 0 ? (16 + depth * 12) + 'px' : '';
      row.setAttribute('title', this.collapsed ? item.label : '');

      /* Ícono */
      if (item.icon) {
        const ico = document.createElement('span');
        ico.className = 'mts-sidenav__icon';
        ico.innerHTML = item.icon;
        row.appendChild(ico);
      } else if (depth === 0) {
        /* Placeholder para alinear sin ícono */
        const ico = document.createElement('span');
        ico.className = 'mts-sidenav__icon mts-sidenav__icon--empty';
        row.appendChild(ico);
      }

      /* Label */
      const lbl = document.createElement('span');
      lbl.className = 'mts-sidenav__label';
      lbl.textContent = item.label;
      row.appendChild(lbl);

      /* Badge */
      if (item.badge !== undefined && item.badge !== null) {
        const badge = document.createElement('span');
        badge.className = 'mts-sidenav__badge';
        badge.textContent = item.badge;
        row.appendChild(badge);
      }

      /* Chevron para submenú */
      if (hasChildren) {
        const chv = document.createElement('span');
        chv.className = 'mts-sidenav__chevron' + (isOpen ? ' mts-sidenav__chevron--open' : '');
        chv.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>';
        row.appendChild(chv);
      }

      if (!item.disabled) {
        row.addEventListener('click', (e) => {
          if (hasChildren) {
            e.preventDefault();
            if (this.accordion) {
              const wasOpen = this._openGroups.has(item.id);
              this._openGroups.clear();
              if (!wasOpen) this._openGroups.add(item.id);
            } else {
              this._openGroups.has(item.id) ? this._openGroups.delete(item.id) : this._openGroups.add(item.id);
            }
            this._build();
          } else {
            this.active = item.id;
            this._build();
            this._emit('change', { id: item.id, item });
          }
        });
      }

      container.appendChild(row);

      /* Submenú */
      if (hasChildren && isOpen) {
        const sub = document.createElement('div');
        sub.className = 'mts-sidenav__sub';
        this._renderItems(item.children, sub, depth + 1);
        container.appendChild(sub);
      }
    });
  }

  _applyCollapse() {
    this._el.classList.toggle('mts-sidenav--collapsed', this.collapsed);
    /* Actualizar toggle btn */
    const btn = this._el.querySelector('.mts-sidenav__toggle');
    if (btn) {
      btn.innerHTML = this.collapsed
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 18l6-6-6-6"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 18l-6-6 6-6"/></svg>';
      btn.setAttribute('title', this.collapsed ? 'Expandir' : 'Colapsar');
    }
    this._emit('collapse', { collapsed: this.collapsed });
  }

  _autoOpenActive(items) {
    const find = (items, targetId) => {
      for (const item of items) {
        if (item.id === targetId) return true;
        if (item.children && find(item.children, targetId)) {
          this._openGroups.add(item.id);
          return true;
        }
      }
      return false;
    };
    if (this.active) find(items, this.active);
  }

  _findItem(id, items) {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.children) { const f = this._findItem(id, item.children); if (f) return f; }
    }
    return null;
  }

  _syncClasses(classes) {
    const previousMatiosClasses = [...this._el.classList].filter(cls =>
      cls === 'mts-sidenav' || cls.startsWith('mts-sidenav--')
    );
    if (previousMatiosClasses.length) this._el.classList.remove(...previousMatiosClasses);
    this._el.classList.add(...classes.filter(Boolean));
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el?.dispatchEvent(new CustomEvent(`mts:sidenav:${event}`, { bubbles: true, detail }));
  }
};
