/* ============================================================
   MATIOS UI — matios-ui-spinner.js
   MTS.Spinner — Indicadores de carga animados
   Version: 3.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.Spinner = class MtsSpinner {
  /**
   * @param {string|Element} selector
   * @param {object}  options
   * @param {string}  options.variant  Tipo de spinner — obligatorio
   * @param {string}  options.size     'xs'|'sm'|'md'|'lg'|'xl'        default: 'md'
   * @param {string}  options.color    Tone ('warning'|'danger'|'success'|'muted')
   *                                   o valor CSS ('#hex', 'var(...)')  default: primary
   * @param {string}  options.color2   Color secundario — orbital y triple
   * @param {string}  options.color3   Color terciario  — solo triple
   * @param {string}  options.label    Texto debajo del spinner
   * @param {boolean} options.overlay  Overlay pantalla completa         default: false
   */
  constructor(selector, options) {
    options = options || {};

    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) return;

    /* Inicialización declarativa via data-* */
    var ds = this._el.dataset || {};
    var fromHTML = {}, k;
    if (ds.variant  !== undefined) fromHTML.variant  = ds.variant;
    if (ds.size     !== undefined) fromHTML.size     = ds.size;
    if (ds.color    !== undefined) fromHTML.color    = ds.color;
    if (ds.color2   !== undefined) fromHTML.color2   = ds.color2;
    if (ds.color3   !== undefined) fromHTML.color3   = ds.color3;
    if (ds.label    !== undefined) fromHTML.label    = ds.label;
    if (ds.overlay  !== undefined) fromHTML.overlay  = true;

    /* data-* como base, options como override */
    var merged = {};
    for (k in fromHTML) { merged[k] = fromHTML[k]; }
    for (k in options)  { merged[k] = options[k];  }

    this.variant = merged.variant || 'ring';
    this.size    = merged.size    || 'md';
    this.color   = merged.color   || null;
    this.color2  = merged.color2  || null;
    this.color3  = merged.color3  || null;
    this.label   = merged.label   || '';
    this.overlay = merged.overlay || false;

    this._build();
  }

  /* ════════════════════════════════════════════════════
     API PÚBLICA
     ════════════════════════════════════════════════════ */

  show()    { this._el.style.display = ''; return this; }
  hide()    { this._el.style.display = 'none'; return this; }
  destroy() { this._el.innerHTML = ''; this._el.className = ''; }

  /* ════════════════════════════════════════════════════
     PRIVADOS
     ════════════════════════════════════════════════════ */

  _syncClasses() {
    var keep = [], list = this._el.classList, i;
    for (i = 0; i < list.length; i++) {
      if (!list[i].startsWith('mts-spinner')) keep.push(list[i]);
    }
    this._el.className = keep.join(' ');
    this._el.classList.add('mts-spinner', 'mts-spinner--' + this.size);
    if (this.overlay) this._el.classList.add('mts-spinner--overlay');
  }

  _applyColor() {
    var tones = { warning: 1, danger: 1, success: 1, muted: 1 };
    var el = this._el;

    if (this.color) {
      if (tones[this.color]) {
        el.classList.add('mts-spinner--' + this.color);
      } else {
        el.style.setProperty('--mts-spinner-color', this.color);
      }
    }

    if (this.color2) {
      el.style.setProperty('--mts-spinner-color-2', this.color2);
      el.style.setProperty('--mts-spinner-bounce-color-2', this.color2);
    }
    if (this.color3) el.style.setProperty('--mts-spinner-color-3', this.color3);
  }

  _createElement(cls) {
    var el = document.createElement('div');
    if (cls) el.className = cls;
    return el;
  }

  _build() {
    this._el.innerHTML = '';
    this._syncClasses();
    this._applyColor();

    var inner = document.createElement('div');
    inner.className = 'mts-spinner__inner--' + this.variant;

    var i;

    switch (this.variant) {

      case 'dual':    /* sin hijos — ::after en CSS */          break;
      case 'triple':  /* sin hijos — ::before/::after en CSS */ break;
      case 'orbital': /* sin hijos — ::before/::after en CSS */ break;
      case 'dots':    /* sin hijos — ::after en CSS */          break;

      case 'ring':     for (i = 0; i < 4;  i++) inner.appendChild(this._createElement()); break;
      case 'bars':     for (i = 0; i < 3;  i++) inner.appendChild(this._createElement()); break;
      case 'roller':   for (i = 0; i < 8;  i++) inner.appendChild(this._createElement()); break;
      case 'clock':    for (i = 0; i < 12; i++) inner.appendChild(this._createElement()); break;
      case 'ellipsis': for (i = 0; i < 4;  i++) inner.appendChild(this._createElement()); break;
      case 'grid':     for (i = 0; i < 9;  i++) inner.appendChild(this._createElement()); break;
      case 'ripple':   for (i = 0; i < 2;  i++) inner.appendChild(this._createElement()); break;
      case 'activity': for (i = 0; i < 12; i++) inner.appendChild(this._createElement()); break;
      case 'bounce':   for (i = 0; i < 5;  i++) inner.appendChild(this._createElement()); break;

      default: break;
    }

    var body = this._createElement('mts-spinner__body');
    body.appendChild(inner);
    this._el.appendChild(body);

    if (this.label) {
      var lbl = this._createElement('mts-spinner__label');
      lbl.textContent = this.label;
      this._el.appendChild(lbl);
    }
  }
};
