/* ============================================================
   MATIOS UI — matios-ui-alert.js
   MTS.Alert — Alertas y banners inline
   Eventos DOM: mts:alert:close
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Alert = class MtsAlert {
  /**
   * @param {string|Element} selector  Contenedor donde se monta
   * @param {object} options
   * @param {string}   options.variant   'info'|'success'|'warning'|'danger' — default: 'info'
   * @param {string}   options.title     Título opcional
   * @param {string}   options.message   Mensaje principal
   * @param {boolean}  options.closable  Botón × — default: true
   * @param {boolean}  options.icon      Muestra ícono — default: true
   * @param {string}   options.action    Label del botón de acción
   * @param {function} options.onAction
   * @param {function} options.onClose
   * @param {number}   options.autoDismiss  ms para auto-cerrar — default: 0
   */
  constructor(selector, options = {}) {
    this._container = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._container) return;
    /* ── data-* → inicialización HTML declarativa ── */
    const _ds = this._container?.dataset || {};
    const _fromHTML = {};
    if (_ds.variant !== undefined) _fromHTML.variant = _ds.variant;
    if (_ds.title !== undefined) _fromHTML.title = _ds.title;
    if (_ds.message !== undefined) _fromHTML.message = _ds.message;
    if (_ds.closable !== undefined) _fromHTML.closable = true;
    if (_ds.autoDismiss !== undefined) _fromHTML.autoDismiss = parseInt(_ds.autoDismiss);
    options = { ..._fromHTML, ...options };

    // Alert variant: 'info' | 'success' | 'warning' | 'danger' / Variante de la alerta
    this.variant = options.variant || 'info';

    // Optional title / Título opcional
    this.title = options.title || '';

    // Main message / Mensaje principal
    this.message = options.message || '';

    // Show close button / Mostrar botón de cierre
    this.closable = options.closable ?? true;

    // Show icon / Mostrar ícono
    this.showIcon = options.icon ?? true;

    // Action button label / Label del botón de acción
    this.action = options.action || null;

    // Auto-dismiss after ms (0 = disabled) / Auto-cerrar después de ms (0 = deshabilitado)
    this.autoDismiss = options.autoDismiss ?? 0;

    this._listeners = {};

    // Fires when action button is clicked / Se dispara al hacer click en el botón de acción
    if (options.onAction) this.on('action', options.onAction);

    // Fires when alert is closed / Se dispara al cerrar la alerta
    if (options.onClose)  this.on('close',  options.onClose);

    this._build();
    if (this.autoDismiss > 0) setTimeout(() => this.close(), this.autoDismiss);
  }

  close() {
    this._el.classList.add('mts-alert--closing');
    setTimeout(() => { this._el?.remove(); this._emit('close', {}); }, 300);
    return this;
  }

  setMessage(msg) { if (this._msgEl) this._msgEl.textContent = msg; return this; }
  on(e, cb)       { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }

  _build() {
    this._el = document.createElement('div');
    this._el.className = `mts-alert mts-alert--${this.variant}`;
    this._el.setAttribute('role', this.variant === 'danger' ? 'alert' : 'status');

    if (this.showIcon) {
      const icon = document.createElement('div');
      icon.className = 'mts-alert__icon';
      icon.innerHTML = this._getIcon();
      this._el.appendChild(icon);
    }

    const body = document.createElement('div');
    body.className = 'mts-alert__body';

    if (this.title) {
      const titleEl = document.createElement('div');
      titleEl.className = 'mts-alert__title';
      titleEl.textContent = this.title;
      body.appendChild(titleEl);
    }

    this._msgEl = document.createElement('div');
    this._msgEl.className = 'mts-alert__message';
    this._msgEl.textContent = this.message;
    body.appendChild(this._msgEl);

    if (this.action && this.onAction) {
      const btn = document.createElement('button');
      btn.className   = 'mts-alert__action';
      btn.textContent = this.action;
      btn.addEventListener('click', () => this._emit('action', {}));
      body.appendChild(btn);
    }

    this._el.appendChild(body);

    if (this.closable) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'mts-alert__close';
      closeBtn.innerHTML = '&times;';
      closeBtn.setAttribute('aria-label', 'Cerrar');
      closeBtn.addEventListener('click', () => this.close());
      this._el.appendChild(closeBtn);
    }

    this._container.appendChild(this._el);
  }

  _getIcon() {
    const icons = {
      info:    `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="8"/><path d="M10 9v5M10 6h.01"/></svg>`,
      success: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="8"/><path d="M6.5 10.5l2.5 2.5 4.5-5"/></svg>`,
      warning: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.13 3.5L2 16h16L10.87 3.5a1 1 0 0 0-1.74 0z"/><path d="M10 8v4M10 14h.01"/></svg>`,
      danger:  `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 14h.01"/></svg>`,
    };
    return icons[this.variant] || icons.info;
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._container?.dispatchEvent(new CustomEvent(`mts:alert:${event}`, { bubbles: true, detail }));
  }

  /* Estático — crea alert sin instanciar */
  static show(selector, options) { return new MTS.Alert(selector, options); }
};
