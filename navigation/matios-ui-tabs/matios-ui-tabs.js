/* ============================================================
   MATIOS UI â€” matios-ui-tabs.js
   MTS.Tabs â€” PestaÃ±as horizontal/vertical, underline/pill/card
   Eventos DOM: mts:tabs:change
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Tabs = class MtsTabs {
  /**
   * @param {string|Element} selector  Contenedor
   * @param {object} options
   * @param {Array}    options.tabs       [{ id, label, content, icon?, disabled?, badge? }]
   * @param {string}   options.active     ID de la pestaÃ±a activa inicial
   * @param {string}   options.variant    'underline'|'pill'|'card' â€” default: 'underline'
   * @param {string}   options.direction  'horizontal'|'vertical' â€” default: 'horizontal'
   * @param {boolean}  options.lazy       Renderiza el contenido solo al activar
   * @param {function} options.onChange
   */
  constructor(selector, options = {}) {
    this._el         = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) { console.error('[MTS.Tabs] No encontrado:', selector); return; }
    // Tab items: [{ id, label, content, icon?, disabled?, badge? }]
    // PestaÃ±as: arreglo de objetos
    this.tabs = options.tabs || [];

    // Initially active tab ID / ID de la pestaÃ±a activa inicial
    this.active = options.active || this.tabs[0]?.id;

    // Visual variant: 'underline' | 'pill' | 'card' / Variante visual
    this.variant = options.variant || 'underline';

    // Layout direction: 'horizontal' | 'vertical' / DirecciÃ³n del layout
    this.direction = options.direction || 'horizontal';

    // Lazy render â€” only renders panel content when first activated
    // Renderizado lazy â€” solo renderiza el panel al activarse por primera vez
    // Default false: all panels render on build so DOM elements are immediately available
    this.lazy = options.lazy ?? false;

    // Show separator border between nav and panels / Mostrar borde separador nav/paneles
    this.border = options.border ?? true;

    // Separator border width / Grosor del borde separador
    this.borderWidth = options.borderWidth || '2px';

    // Panel height: 'auto' | 'stretch' | '200px' | etc.
    // Alto del panel
    this.height = options.height || '360px';

    // Stretch panels to fill container height (alias for height:'stretch')
    // Estirar paneles para llenar el alto del contenedor
    this.stretch = options.stretch ?? false;

    // Nav width in vertical mode (e.g. '200px') / Ancho del nav en modo vertical
    this.navWidth = options.navWidth || null;

    // Show left border on panel in vertical mode / Mostrar borde izquierdo en panel vertical
    this.panelBorder = options.panelBorder ?? true;

    this._rendered  = new Set();
    this._listeners = {};

    // Fires when active tab changes / Se dispara al cambiar la pestaÃ±a activa
    if (options.onChange) this.on('change', options.onChange);
    this._build();
  }

  /* API */
  setActive(id) {
    if (!this.tabs.find(t => t.id === id)) return this;
    this.active = id;
    this._updateNav();
    this._updatePanels();
    this._emit('change', { id, tab: this.tabs.find(t => t.id === id) });
    return this;
  }
  addTab(tab)    { this.tabs.push(tab); this._build(); return this; }
  removeTab(id)  { this.tabs = this.tabs.filter(t => t.id !== id); if (this.active === id) this.active = this.tabs[0]?.id; this._build(); return this; }
  getTabs()      { return this.tabs.slice(); }
  on(e, cb)      { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  destroy()      { this._el.replaceChildren(); }

  _build() {
    this._el.replaceChildren();
    // Resetear clase limpia â€” quitar modificadores del build anterior
    const isStretch = this.stretch || this.height === 'stretch';
    this._syncClasses([
      `mts-tabs`,
      `mts-tabs--${this.variant}`,
      `mts-tabs--${this.direction}`,
      isStretch ? 'mts-tabs--stretch' : '',
      !isStretch && this.height !== 'auto' ? 'mts-tabs--fixed-panels' : ''
    ]);
    this._el.style.cssText = '';

    // Nav
    this._navEl = document.createElement('div');
    this._navEl.className = 'mts-tabs__nav';
    this._navEl.setAttribute('role', 'tablist');
    /* Borde: clase CSS + variable para el grosor */
    if (!this.border) {
      this._el.classList.add('mts-tabs--no-border');
    } else {
      /* Setear la CSS variable para el grosor â€” el CSS la consume */
      this._el.style.setProperty('--mts-tabs-border-width', this.borderWidth);
    }
    /* Ancho custom del nav vertical */
    if (this.navWidth && this.direction === 'vertical') {
      this._navEl.style.minWidth = this.navWidth;
      this._navEl.style.width    = this.navWidth;
    }

    this.tabs.forEach(tab => {
      const btn = document.createElement('button');
      btn.className = 'mts-tabs__tab' + (tab.id === this.active ? ' mts-tabs__tab--active' : '') + (tab.disabled ? ' mts-tabs__tab--disabled' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', tab.id === this.active);
      btn.setAttribute('aria-controls', `mts-panel-${tab.id}`);
      btn.id = `mts-tab-${tab.id}`;
      btn.disabled = tab.disabled ?? false;

      if (tab.icon) { const ic = document.createElement('span'); ic.className = 'mts-tabs__tab-icon'; ic.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(tab.icon) : tab.icon; btn.appendChild(ic); }
      const lbl = document.createElement('span'); lbl.textContent = tab.label; btn.appendChild(lbl);
      if (tab.badge != null) { const b = document.createElement('span'); b.className = 'mts-tabs__tab-badge'; b.textContent = tab.badge; btn.appendChild(b); }

      btn.addEventListener('click', () => { if (!tab.disabled) this.setActive(tab.id); });
      btn.addEventListener('keydown', (e) => {
        const tabs = this.tabs.filter(t => !t.disabled);
        const idx  = tabs.findIndex(t => t.id === tab.id);
        const keys = this.direction === 'vertical' ? ['ArrowDown','ArrowUp'] : ['ArrowRight','ArrowLeft'];
        if (e.key === keys[0] && idx < tabs.length - 1) { e.preventDefault(); this.setActive(tabs[idx + 1].id); document.getElementById(`mts-tab-${tabs[idx+1].id}`)?.focus(); }
        if (e.key === keys[1] && idx > 0) { e.preventDefault(); this.setActive(tabs[idx - 1].id); document.getElementById(`mts-tab-${tabs[idx-1].id}`)?.focus(); }
      });
      this._navEl.appendChild(btn);
    });
    this._el.appendChild(this._navEl);

    // Panels
    this._panelsEl = document.createElement('div');
    this._panelsEl.className = 'mts-tabs__panels';
    /* Altura del panel */
    if (this.stretch || this.height === 'stretch') {
      this._panelsEl.style.cssText = 'flex:1;overflow:hidden;min-height:0;';
    } else if (this.height && this.height !== 'auto') {
      this._panelsEl.style.height   = this.height;
      this._panelsEl.style.overflow = 'hidden';
      this._panelsEl.style.minHeight = '0';
    } else {
      this._panelsEl.style.height = 'auto';
      this._panelsEl.style.overflow = 'visible';
    }

    this.tabs.forEach(tab => {
      const panel = document.createElement('div');
      panel.className = 'mts-tabs__panel' + (tab.id === this.active ? ' mts-tabs__panel--active' : '');
      panel.id = `mts-panel-${tab.id}`;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `mts-tab-${tab.id}`);

      if (!this.lazy || tab.id === this.active) {
        this._renderContent(panel, tab);
        this._rendered.add(tab.id);
      }
      this._panelsEl.appendChild(panel);
    });
    /* El borde izquierdo lo maneja el CSS via --mts-tabs-border-width */
    /* No aplicar style inline â€” evita conflicto con el CSS */
    this._el.appendChild(this._panelsEl);
  }

  _renderContent(panel, tab) {
    if (typeof tab.content === 'string') panel.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(tab.content) : tab.content;
    else if (tab.content instanceof Element) panel.appendChild(tab.content);
    else if (typeof tab.content === 'function') panel.appendChild(tab.content());
  }

  _updateNav() {
    this._navEl.querySelectorAll('.mts-tabs__tab').forEach((btn, i) => {
      const tab = this.tabs[i];
      btn.classList.toggle('mts-tabs__tab--active', tab?.id === this.active);
      btn.setAttribute('aria-selected', tab?.id === this.active);
    });
  }

  _updatePanels() {
    this._panelsEl.querySelectorAll('.mts-tabs__panel').forEach((panel, i) => {
      const tab = this.tabs[i];
      const isActive = tab?.id === this.active;
      panel.classList.toggle('mts-tabs__panel--active', isActive);
      if (isActive && this.lazy && !this._rendered.has(tab.id)) {
        this._renderContent(panel, tab);
        this._rendered.add(tab.id);
      }
    });
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:tabs:${event}`, { bubbles: true, detail }));
  }

  _syncClasses(classes) {
    const previousMatiosClasses = [...this._el.classList].filter(cls =>
      cls === 'mts-tabs' || cls.startsWith('mts-tabs--')
    );
    if (previousMatiosClasses.length) this._el.classList.remove(...previousMatiosClasses);
    this._el.classList.add(...classes.filter(Boolean));
  }
};

