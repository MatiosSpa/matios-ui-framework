/* ============================================================
   MATIOS UI — matios-ui-tabbar.js
   MTS.TabBar — Navegación estilo app mobile (bottom bar)
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.TabBar = class MtsTabBar {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {Array}    options.tabs       [{ id, label, icon, badge? }]
   * @param {string}   options.active     id del tab activo inicial
   * @param {string}   options.variant    'default'|'pill'|'floating' — default: 'default'
   * @param {boolean}  options.showLabels Muestra labels — default: true
   * @param {function} options.onChange   ({ id, tab }) => {}
   */
  constructor(selector, options = {}) {
    this._el       = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    /* ── data-* → inicialización HTML declarativa ── */
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.active !== undefined) _fromHTML.active = _ds.active;
    if (_ds.variant !== undefined) _fromHTML.variant = _ds.variant;
    if (_ds.showLabels !== undefined) _fromHTML.showLabels = true;
    options = { ..._fromHTML, ...options };

    // Tab items: [{ id, label, icon, badge? }] / Ítems del tab bar
    this.tabs = options.tabs || [];

    // Initially active tab ID / ID del tab activo inicial
    this.active = options.active || (this.tabs[0]?.id ?? '');

    // Visual variant: 'default' | 'pill' | 'floating' / Variante visual
    this.variant = options.variant || 'default';

    // Show labels below icons / Mostrar labels bajo los íconos
    this.showLabels = options.showLabels ?? true;

    this._listeners = {};

    // Fires when active tab changes / Se dispara al cambiar el tab activo
    if (options.onChange) this.on('change', options.onChange);
    this._build();
  }

  setActive(id) {
    this.active = id;
    this._el.querySelectorAll('.mts-tabbar__item').forEach(el => {
      el.classList.toggle('mts-tabbar__item--active', el.dataset.id === id);
    });
    return this;
  }
  setBadge(id, val) {
    const tab = this.tabs.find(t => t.id === id);
    if (tab) { tab.badge = val; this._build(); }
    return this;
  }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  destroy()  { this._el.innerHTML = ''; }

  _build() {
    this._el.innerHTML = '';
    this._el.className = 'mts-tabbar mts-tabbar--' + this.variant + (this.showLabels ? '' : ' mts-tabbar--no-labels');
    const self = this;
    this.tabs.forEach(function(tab) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'mts-tabbar__item' + (tab.id === self.active ? ' mts-tabbar__item--active' : '');
      item.dataset.id = tab.id;

      const iconWrap = document.createElement('div');
      iconWrap.className = 'mts-tabbar__icon';
      iconWrap.innerHTML = tab.icon || '';

      /* Badge */
      if (tab.badge !== undefined && tab.badge !== null && tab.badge !== '') {
        const badge = document.createElement('span');
        badge.className = 'mts-tabbar__badge';
        badge.textContent = tab.badge;
        iconWrap.appendChild(badge);
      }
      item.appendChild(iconWrap);

      if (self.showLabels) {
        const lbl = document.createElement('span');
        lbl.className = 'mts-tabbar__label';
        lbl.textContent = tab.label;
        item.appendChild(lbl);
      }

      item.addEventListener('click', function() {
        self.active = tab.id;
        self._el.querySelectorAll('.mts-tabbar__item').forEach(function(el) {
          el.classList.toggle('mts-tabbar__item--active', el.dataset.id === tab.id);
        });
        (self._listeners['change'] || []).forEach(function(fn) { fn({ type:'change', detail:{ id:tab.id, tab:tab } }); });
        self._el.dispatchEvent(new CustomEvent('mts:tabbar:change', { bubbles:true, detail:{ id:tab.id, tab:tab } }));
      });

      self._el.appendChild(item);
    });
  }
};
