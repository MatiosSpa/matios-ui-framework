/* ============================================================
   MATIOS UI — matios-ui-tabs.js
   MTS.Tabs — Pestañas horizontal/vertical, underline/pill/card
   Eventos DOM: mts:tabs:change
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Tabs = class MtsTabs {
  /**
   * @param {string|Element} selector  Contenedor
   * @param {object} options
   * @param {Array}    options.tabs       [{ id, label, content, icon?, disabled?, badge? }]
   * @param {string}   options.active     ID de la pestaña activa inicial
   * @param {string}   options.variant    'underline'|'pill'|'card' — default: 'underline'
   * @param {string}   options.direction  'horizontal'|'vertical' — default: 'horizontal'
   * @param {boolean}  options.lazy       Renderiza el contenido solo al activar
   * @param {function} options.onChange
   */
  constructor(selector, options = {}) {
    this._el         = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) { console.error('[MTS.Tabs] No encontrado:', selector); return; }
    this.tabs        = options.tabs        || [];
    this.active      = options.active      || this.tabs[0]?.id;
    this.variant     = options.variant     || 'underline';
    this.direction   = options.direction   || 'horizontal';
    this.lazy        = options.lazy        ?? true;
    /* Nuevas opciones */
    this.border      = options.border      ?? true;       // mostrar borde de separación nav/panel
    this.borderWidth = options.borderWidth || '2px';      // grosor del borde
    this.height      = options.height      || 'auto';     // 'auto'|'stretch'|'200px'|etc.
    this.stretch     = options.stretch     ?? false;      // alias de height:'stretch'
    this.navWidth    = options.navWidth    || null;       // ancho del nav vertical (ej: '200px')
    this.panelBorder = options.panelBorder ?? true;       // borde izq en panel (vertical)
    this._rendered   = new Set();
    this._listeners  = {};
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
  on(e, cb)      { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  destroy()      { this._el.innerHTML = ''; }

  _build() {
    this._el.innerHTML = '';
    // Resetear clase limpia — quitar modificadores del build anterior
    this._el.className = `mts-tabs mts-tabs--${this.variant} mts-tabs--${this.direction}`;
    this._el.style.cssText = '';
    /* Altura stretch */
    if (this.stretch || this.height === 'stretch') {
      this._el.style.cssText = 'height:100%;display:flex;flex-direction:' + (this.direction==='vertical'?'row':'column') + ';';
    }

    // Nav
    this._navEl = document.createElement('div');
    this._navEl.className = 'mts-tabs__nav';
    this._navEl.setAttribute('role', 'tablist');
    /* Borde: clase CSS + variable para el grosor */
    if (!this.border) {
      this._el.classList.add('mts-tabs--no-border');
    } else {
      /* Setear la CSS variable para el grosor — el CSS la consume */
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

      if (tab.icon) { const ic = document.createElement('span'); ic.className = 'mts-tabs__tab-icon'; ic.innerHTML = tab.icon; btn.appendChild(ic); }
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
      this._panelsEl.style.cssText = 'flex:1;overflow:auto;min-height:0;';
    } else if (this.height && this.height !== 'auto') {
      this._panelsEl.style.height   = this.height;
      this._panelsEl.style.overflow = 'auto';
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
    /* No aplicar style inline — evita conflicto con el CSS */
    this._el.appendChild(this._panelsEl);
  }

  _renderContent(panel, tab) {
    if (typeof tab.content === 'string') panel.innerHTML = tab.content;
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
};
