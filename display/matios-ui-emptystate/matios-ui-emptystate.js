/* ============================================================
   MATIOS UI — matios-ui-emptystate.js
   MTS.EmptyState — Estado vacío con ilustración SVG y CTA
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.EmptyState = class MtsEmptyState {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {string}   options.variant    'no-data'|'search'|'error'|'permissions'|'custom'
   * @param {string}   options.title
   * @param {string}   options.description
   * @param {string}   options.action     Label del botón CTA
   * @param {function} options.onAction
   * @param {string}   options.icon       SVG custom
   * @param {string}   options.size       'sm'|'md'|'lg' — default: 'md'
   */
  constructor(selector, options = {}) {
    this._el       = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    // Preset variant: 'no-data' | 'search' | 'error' | 'permissions' | 'custom'
    // Variante predefinida
    this.variant = options.variant || 'no-data';

    // Title text (auto from variant if not set) / Texto del título (auto desde variante)
    this.title = options.title || this._defaultTitle();

    // Description text / Texto de descripción
    this.description = options.description || this._defaultDescription();

    // CTA button label / Label del botón CTA
    this.action = options.action || null;

    // Custom SVG icon (overrides variant icon) / Ícono SVG custom (sobreescribe el de la variante)
    this.customIcon = options.icon || null;

    // Size: 'sm' | 'md' | 'lg' / Tamaño
    this.size = options.size || 'md';

    this._listeners = {};

    // Fires when CTA button is clicked / Se dispara al hacer click en el botón CTA
    if (options.onAction) this.on('action', options.onAction);

    this._build();
  }

  update(opts = {}) { Object.assign(this, opts); this._build(); return this; }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }

  _build() {
    this._el.className = `mts-emptystate mts-emptystate--${this.size}`;
    this._el.innerHTML = '';

    const icon = document.createElement('div');
    icon.className = 'mts-emptystate__icon';
    icon.innerHTML = this.customIcon || this._getIcon();
    this._el.appendChild(icon);

    const title = document.createElement('h3');
    title.className = 'mts-emptystate__title';
    title.textContent = this.title;
    this._el.appendChild(title);

    if (this.description) {
      const desc = document.createElement('p');
      desc.className = 'mts-emptystate__description';
      desc.textContent = this.description;
      this._el.appendChild(desc);
    }

    if (this.action) {
      const btn = document.createElement('button');
      btn.className = 'mts-btn mts-btn--primary';
      btn.textContent = this.action;
      btn.addEventListener('click', () => this._emit('action', {}));
      this._el.appendChild(btn);
    }
  }

  _defaultTitle() {
    const titles = { 'no-data': 'Sin datos', 'search': 'Sin resultados', 'error': 'Algo salió mal', 'permissions': 'Acceso denegado' };
    return titles[this.variant] || 'Sin contenido';
  }

  _defaultDescription() {
    const descs = {
      'no-data':     'No hay datos para mostrar en este momento.',
      'search':      'Intenta con otros términos de búsqueda.',
      'error':       'Ocurrió un error inesperado. Intenta nuevamente.',
      'permissions': 'No tienes permisos para ver este contenido.',
    };
    return descs[this.variant] || '';
  }

  _getIcon() {
    const icons = {
      'no-data': `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="20" width="60" height="45" rx="4" stroke="currentColor" stroke-width="2.5" fill="none"/>
        <path d="M10 30h60" stroke="currentColor" stroke-width="2"/>
        <path d="M25 45h30M25 55h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="60" cy="57" r="14" fill="var(--mts-bg-surface)" stroke="currentColor" stroke-width="2.5"/>
        <path d="M55 57h10M60 52v10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
      'search': `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="35" cy="35" r="20" stroke="currentColor" stroke-width="2.5"/>
        <path d="M50 50l16 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M28 35h14M35 28v14" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
      </svg>`,
      'error': `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="28" stroke="currentColor" stroke-width="2.5"/>
        <path d="M40 25v20M40 52v4" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      </svg>`,
      'permissions': `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="38" width="44" height="28" rx="4" stroke="currentColor" stroke-width="2.5"/>
        <path d="M28 38V28a12 12 0 0 1 24 0v10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        <circle cx="40" cy="52" r="4" fill="currentColor"/>
        <path d="M40 56v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
    };
    return icons[this.variant] || icons['no-data'];
  }
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el?.dispatchEvent(new CustomEvent(`mts:emptystate:action`, { bubbles: true, detail }));
  }
};
