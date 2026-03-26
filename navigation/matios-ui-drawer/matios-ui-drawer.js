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
    this.title    = options.title    || '';
    this.content  = options.content  || '';
    this.footer   = options.footer   || null;
    this.position = options.position || 'right';
    this.size     = options.size     || 'md';
    this.backdrop = options.static   ? false : (options.backdrop ?? true);
    this.closable = options.closable ?? true;
    this.static   = options.static   ?? false;
    this._isOpen  = false;
    this._listeners = {};
    if (options.onOpen)  this.on('open',  options.onOpen);
    if (options.onClose) this.on('close', options.onClose);
    this._build();
  }

  show()   { if (this._isOpen) return this; this._isOpen = true; this._backdropEl.classList.add('mts-drawer-backdrop--visible'); this._drawerEl.removeAttribute('hidden'); requestAnimationFrame(() => requestAnimationFrame(() => this._drawerEl.classList.add('mts-drawer--open'))); document.body.style.overflow = 'hidden'; this._emit('open', {}); return this; }
  hide()   { if (!this._isOpen) return this; this._isOpen = false; this._drawerEl.classList.remove('mts-drawer--open'); this._backdropEl.classList.remove('mts-drawer-backdrop--visible'); setTimeout(() => { this._drawerEl.setAttribute('hidden', ''); document.body.style.overflow = ''; }, 300); this._emit('close', {}); return this; }
  toggle() { return this._isOpen ? this.hide() : this.show(); }
  setTitle(html)   { if (this._titleEl) this._titleEl.innerHTML = html; return this; }
  setContent(html) { if (this._bodyEl) { this._bodyEl.innerHTML = ''; typeof html === 'string' ? (this._bodyEl.innerHTML = html) : this._bodyEl.appendChild(html); } return this; }
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
    this._titleEl.innerHTML = this.title;
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
    typeof this.content === 'string' ? (this._bodyEl.innerHTML = this.content) : this._bodyEl.appendChild(this.content);

    this._drawerEl.appendChild(header);
    this._drawerEl.appendChild(this._bodyEl);

    if (this.footer) {
      const footerEl = document.createElement('div');
      footerEl.className = 'mts-drawer__footer';
      typeof this.footer === 'string' ? (footerEl.innerHTML = this.footer) : footerEl.appendChild(this.footer);
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
