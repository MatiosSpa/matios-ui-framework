/* ============================================================
   MATIOS UI — matios-ui-spinner.js
   MTS.Spinner — Indicadores de carga animados
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Spinner = class MtsSpinner {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {string}   options.variant  'circle'|'dots'|'bars'|'pulse'|'ring' — default: 'circle'
   * @param {string}   options.size     'xs'|'sm'|'md'|'lg'|'xl' — default: 'md'
   * @param {string}   options.color    Color CSS override
   * @param {string}   options.label    Texto debajo del spinner
   * @param {boolean}  options.overlay  Modo overlay pantalla completa — default: false
   */
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) return;
    /* ── data-* → inicialización HTML declarativa ── */
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.variant !== undefined) _fromHTML.variant = _ds.variant;
    if (_ds.size !== undefined) _fromHTML.size = _ds.size;
    if (_ds.label !== undefined) _fromHTML.label = _ds.label;
    if (_ds.overlay !== undefined) _fromHTML.overlay = true;
    if (_ds.color !== undefined) _fromHTML.color = _ds.color;
    options = { ..._fromHTML, ...options };

    // Spinner variant: 'circle' | 'dots' | 'bars' | 'pulse' | 'ring'
    // Variante del spinner
    this.variant = options.variant || 'circle';

    // Size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' / Tamaño
    this.size = options.size || 'md';

    // Custom CSS color override / Override de color CSS
    this.color = options.color || null;

    // Text label below the spinner / Texto debajo del spinner
    this.label = options.label || '';

    // Full-screen overlay mode / Modo overlay pantalla completa
    this.overlay = options.overlay ?? false;

    this._build();
  }

  show()    { this._el.style.display = ''; return this; }
  hide()    { this._el.style.display = 'none'; return this; }
  destroy() { this._el.innerHTML = ''; }

  _syncClasses() {
    const keep = Array.from(this._el.classList).filter(cls => !cls.startsWith('mts-spinner'));
    this._el.className = keep.join(' ');
    this._el.classList.add('mts-spinner', `mts-spinner--${this.size}`);
    if (this.overlay) this._el.classList.add('mts-spinner--overlay');
  }

  _build() {
    this._el.innerHTML = '';
    this._syncClasses();
    if (this.color) this._el.style.setProperty('--mts-spinner-color', this.color);

    const inner = document.createElement('div');
    inner.className = `mts-spinner__inner mts-spinner__inner--${this.variant}`;

    switch (this.variant) {
      case 'circle':
        inner.innerHTML = `<svg viewBox="0 0 50 50" class="mts-spinner__svg"><circle class="mts-spinner__track" cx="25" cy="25" r="20" fill="none" stroke-width="4"/><circle class="mts-spinner__arc" cx="25" cy="25" r="20" fill="none" stroke-width="4" stroke-linecap="round"/></svg>`;
        break;
      case 'ring':
        inner.innerHTML = `<div class="mts-spinner__ring"></div>`;
        break;
      case 'dots':
        for (let i = 0; i < 3; i++) {
          const d = document.createElement('div');
          d.className = 'mts-spinner__dot';
          inner.appendChild(d);
        }
        break;
      case 'bars':
        for (let i = 0; i < 4; i++) {
          const b = document.createElement('div');
          b.className = 'mts-spinner__bar';
          inner.appendChild(b);
        }
        break;
      case 'pulse':
        inner.innerHTML = `<div class="mts-spinner__pulse"></div>`;
        break;
    }

    this._el.appendChild(inner);
    if (this.label) {
      const lbl = document.createElement('div');
      lbl.className = 'mts-spinner__label';
      lbl.textContent = this.label;
      this._el.appendChild(lbl);
    }
  }
};
