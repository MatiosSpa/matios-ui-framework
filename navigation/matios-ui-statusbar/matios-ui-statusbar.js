/* ============================================================
   MATIOS UI — matios-ui-statusbar.js
   MTS.StatusBar — Barra de estado inferior con slots libres
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.StatusBar = class MtsStatusBar {
  /**
   * @param {string|Element} selector
   * @param {object}  options
   * @param {string|Element} options.start    Slot izquierdo — HTML libre
   * @param {string|Element} options.center   Slot central   — HTML libre
   * @param {string|Element} options.end      Slot derecho   — HTML libre
   * @param {string}  options.variant   'default' | 'primary' | 'inverse'
   * @param {boolean} options.border    Border-top — default: true
   * @param {string}  options.height    Altura CSS — default: usa --mts-statusbar-height (28px)
   */
  constructor(selector, options) {
    options = options || {};
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) {
      console.error('[MTS.StatusBar] Selector no encontrado:', selector);
      return;
    }

    this.start   = options.start   !== undefined ? options.start   : null;
    this.center  = options.center  !== undefined ? options.center  : null;
    this.end     = options.end     !== undefined ? options.end     : null;
    this.variant = options.variant || 'default';
    this.border  = options.border  !== undefined ? !!options.border : true;
    this.height  = options.height  || null;

    this._startEl  = null;
    this._centerEl = null;
    this._endEl    = null;

    this._build();
  }

  /* ════════════════════════════════════════════════════
     API PÚBLICA
     ════════════════════════════════════════════════════ */

  /** Actualiza el slot start */
  setStart(content) {
    this.start = content;
    if (this._startEl) {
      this._startEl.innerHTML = '';
      this._inject(this._startEl, content);
      this._initIcons();
    }
    return this;
  }

  /** Actualiza el slot center */
  setCenter(content) {
    this.center = content;
    if (this._centerEl) {
      this._centerEl.innerHTML = '';
      this._inject(this._centerEl, content);
      this._initIcons();
    }
    return this;
  }

  /** Actualiza el slot end */
  setEnd(content) {
    this.end = content;
    if (this._endEl) {
      this._endEl.innerHTML = '';
      this._inject(this._endEl, content);
      this._initIcons();
    }
    return this;
  }

  /** Cambia la variante de color */
  setVariant(variant) {
    this.variant = variant;
    this._syncClasses();
    return this;
  }

  /** Retorna el Element del slot solicitado ('start' | 'center' | 'end') */
  getSlot(name) {
    return this._el.querySelector('.mts-statusbar__' + name);
  }

  /** Desmonta y limpia */
  destroy() {
    this._el.innerHTML = '';
    this._el.className = '';
    this._el.removeAttribute('style');
  }

  /* ════════════════════════════════════════════════════
     PRIVADOS
     ════════════════════════════════════════════════════ */

  _build() {
    this._el.innerHTML = '';
    this._syncClasses();

    if (this.height) {
      this._el.style.setProperty('--mts-statusbar-height', this.height);
    }

    /* Slot start */
    this._startEl = document.createElement('div');
    this._startEl.className = 'mts-statusbar__start';
    if (this.start !== null) this._inject(this._startEl, this.start);
    this._el.appendChild(this._startEl);

    /* Slot center o spacer */
    if (this.center !== null) {
      this._centerEl = document.createElement('div');
      this._centerEl.className = 'mts-statusbar__center';
      this._inject(this._centerEl, this.center);
      this._el.appendChild(this._centerEl);
    } else {
      var spacer = document.createElement('div');
      spacer.className = 'mts-statusbar__spacer';
      this._el.appendChild(spacer);
    }

    /* Slot end */
    this._endEl = document.createElement('div');
    this._endEl.className = 'mts-statusbar__end';
    if (this.end !== null) this._inject(this._endEl, this.end);
    this._el.appendChild(this._endEl);

    this._initIcons();
  }

  _syncClasses() {
    var cls = ['mts-statusbar'];
    if (this.variant && this.variant !== 'default') {
      cls.push('mts-statusbar--' + this.variant);
    }
    if (!this.border) cls.push('mts-statusbar--no-border');
    this._el.className = cls.join(' ');
  }

  _inject(el, content) {
    if (content === null || content === undefined) return;
    if (typeof content === 'string') {
      el.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(content) : content;
    } else if (content instanceof Element) {
      el.appendChild(content);
    }
  }

  _initIcons() {
    if (window.MTS && MTS.Icon) MTS.Icon.initAll();
  }
};
