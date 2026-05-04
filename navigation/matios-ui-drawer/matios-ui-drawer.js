/* ============================================================
   MATIOS UI — matios-ui-drawer.js
   MTS.Drawer — Panel lateral deslizante
   Eventos DOM: mts:drawer:open | mts:drawer:close
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Drawer = class MtsDrawer {
  /**
   * @param {object} options
   * @param {string}          options.title
   * @param {string|Element}  options.content
   * @param {string|Element}  options.footer
   * @param {string}          options.position   'left'|'right'|'top'|'bottom' — default: 'right'
   * @param {string}          options.size       'sm'|'md'|'lg'|'full' — default: 'md'
   * @param {boolean}         options.backdrop   — default: true
   * @param {boolean}         options.closable   — default: true
   * @param {boolean}         options.static     No cierra con Esc/backdrop
   * @param {function}        options.onOpen
   * @param {function}        options.onClose
   */
  constructor(options = {}) {
    // Drawer title HTML / HTML del título del drawer
    this.title = options.title || '';

    // Drawer body content (HTML string or Element) / Contenido del cuerpo
    this.content = options.content || '';

    // Drawer footer HTML or Element / Pie del drawer
    this.footer = options.footer || null;

    // Slide-in position: 'left' | 'right' | 'top' | 'bottom' / Posición de deslizamiento
    this.position = options.position || 'right';

    // Size: 'sm' | 'md' | 'lg' | 'full' / Tamaño
    this.size = options.size || 'md';

    // Show backdrop overlay / Mostrar fondo oscuro
    this.backdrop = options.static ? false : (options.backdrop ?? true);

    // Show close button / Mostrar botón de cierre
    this.closable = options.closable ?? true;

    // Static mode — does not close on Esc or backdrop click
    // Modo estático — no cierra con Esc ni click en backdrop
    this.static = options.static ?? false;

    this._isOpen    = false;
    this._listeners = {};

    // Fires when drawer opens / Se dispara al abrir el drawer
    if (options.onOpen)  this.on('open',  options.onOpen);

    // Fires when drawer closes / Se dispara al cerrar el drawer
    if (options.onClose) this.on('close', options.onClose);
    this._build();
  }

  show()   { if (this._isOpen) return this; this._isOpen = true; this._backdropEl.classList.add('mts-drawer-backdrop--visible'); this._drawerEl.removeAttribute('hidden'); requestAnimationFrame(() => requestAnimationFrame(() => this._drawerEl.classList.add('mts-drawer--open'))); document.body.style.overflow = 'hidden'; this._emit('open', {}); return this; }
  hide()   { if (!this._isOpen) return this; this._isOpen = false; this._drawerEl.classList.remove('mts-drawer--open'); this._backdropEl.classList.remove('mts-drawer-backdrop--visible'); setTimeout(() => { this._drawerEl.setAttribute('hidden', ''); document.body.style.overflow = ''; }, 300); this._emit('close', {}); return this; }
  toggle() { return this._isOpen ? this.hide() : this.show(); }
  setTitle(html)   { if (this._titleEl) this._titleEl.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(html) : html; return this; }
  setContent(html) { if (this._bodyEl) { this._bodyEl.innerHTML = ''; typeof html === 'string' ? (this._bodyEl.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(html) : html) : this._bodyEl.appendChild(html); } return this; }
  destroy() { this.hide(); setTimeout(() => { this._drawerEl?.remove(); this._backdropEl?.remove(); }, 350); }
  on(e, cb) { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }

  _build() {
    this._backdropEl = document.createElement('div');
    this._backdropEl.className = 'mts-drawer-backdrop';
    if (this.backdrop && !this.static) this._backdropEl.addEventListener('click', () => this.hide());

    this._drawerEl = document.createElement('div');
    this._drawerEl.className = `mts-drawer mts-drawer--${this.position} mts-drawer--${this.size}`;
    this._drawerEl.setAttribute('role', 'dialog');
    this._drawerEl.setAttribute('aria-modal', 'true');
    this._drawerEl.setAttribute('hidden', '');

    // Header
    const header = document.createElement('div');
    header.className = 'mts-drawer__header';
    this._titleEl = document.createElement('h5');
    this._titleEl.className = 'mts-drawer__title';
    this._titleEl.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(this.title) : this.title;
    header.appendChild(this._titleEl);
    if (this.closable) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'mts-drawer__close';
      closeBtn.innerHTML = '&times;';
      closeBtn.setAttribute('aria-label', 'Cerrar');
      closeBtn.addEventListener('click', () => this.hide());
      header.appendChild(closeBtn);
    }

    // Body
    this._bodyEl = document.createElement('div');
    this._bodyEl.className = 'mts-drawer__body';
    typeof this.content === 'string' ? (this._bodyEl.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(this.content) : this.content) : this._bodyEl.appendChild(this.content);

    this._drawerEl.appendChild(header);
    this._drawerEl.appendChild(this._bodyEl);

    if (this.footer) {
      const footerEl = document.createElement('div');
      footerEl.className = 'mts-drawer__footer';
      typeof this.footer === 'string' ? (footerEl.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(this.footer) : this.footer) : footerEl.appendChild(this.footer);
      this._drawerEl.appendChild(footerEl);
    }

    document.body.appendChild(this._backdropEl);
    document.body.appendChild(this._drawerEl);

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this._isOpen && this.closable && !this.static) this.hide(); });
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._drawerEl?.dispatchEvent(new CustomEvent(`mts:drawer:${event}`, { bubbles: true, detail: { drawer: this, ...detail } }));
  }
};
