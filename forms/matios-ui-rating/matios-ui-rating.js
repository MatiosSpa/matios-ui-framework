/* ============================================================
   MATIOS UI — matios-ui-rating.js
   MTS.Rating — Estrellas con hover y medio punto
   Eventos DOM: mts:rating:change | mts:rating:hover
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Rating = class MtsRating {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {number}   options.value     Valor inicial (0-max)
   * @param {number}   options.max       Máximo de estrellas — default: 5
   * @param {boolean}  options.halfStars Permite medios puntos — default: false
   * @param {boolean}  options.readonly
   * @param {string}   options.size      'sm'|'md'|'lg'
   * @param {function} options.onChange
   */
  constructor(selector, options = {}) {
    this._el      = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    /* ── data-* → inicialización HTML declarativa ── */
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.value !== undefined) _fromHTML.value = parseFloat(_ds.value);
    if (_ds.max !== undefined) _fromHTML.max = parseInt(_ds.max);
    if (_ds.halfStars !== undefined) _fromHTML.halfStars = true;
    if (_ds.readonly !== undefined) _fromHTML.readonly = true;
    if (_ds.size !== undefined) _fromHTML.size = _ds.size;
    options = { ..._fromHTML, ...options };

    this.value    = options.value     ?? 0;
    this.max      = options.max       ?? 5;
    this.halfStars = options.halfStars ?? false;
    this.readonly = options.readonly  ?? false;
    this.size     = options.size      || 'md';
    this._hover   = null;
    this._listeners = {};
    if (options.onChange) this.on('change', options.onChange);
    this._build();
  }

  getValue()   { return this.value; }
  setValue(v)  { this.value = Math.min(this.max, Math.max(0, v)); this._render(); return this; }
  on(e, cb)    { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  destroy()    { this._el.innerHTML = ''; }

  _build() {
    this._el.className = `mts-rating mts-rating--${this.size}${this.readonly ? ' mts-rating--readonly' : ''}`;
    this._el.setAttribute('role', 'radiogroup');
    this._render();
  }

  _render() {
    this._el.innerHTML = '';
    const display = this._hover ?? this.value;

    for (let i = 1; i <= this.max; i++) {
      const star = document.createElement('button');
      star.className = 'mts-rating__star';
      star.setAttribute('aria-label', `${i} estrella${i > 1 ? 's' : ''}`);
      star.setAttribute('type', 'button');
      if (this.readonly) { star.disabled = true; }

      const fill = display >= i ? 'full' : display >= i - 0.5 && this.halfStars ? 'half' : 'empty';
      star.classList.add(`mts-rating__star--${fill}`);
      star.innerHTML = this._starSVG(fill);

      if (!this.readonly) {
        star.addEventListener('click', (e) => {
          let val = i;
          if (this.halfStars) {
            const rect = star.getBoundingClientRect();
            val = e.clientX < rect.left + rect.width / 2 ? i - 0.5 : i;
          }
          this.value = val;
          this._hover = null;
          this._render();
          this._emit('change', { value: this.value });
        });
        star.addEventListener('mouseenter', (e) => {
          let val = i;
          if (this.halfStars) {
            const rect = star.getBoundingClientRect();
            val = e.clientX < rect.left + rect.width / 2 ? i - 0.5 : i;
          }
          this._hover = val;
          this._render();
          this._emit('hover', { value: val });
        });
        star.addEventListener('mouseleave', () => {
          this._hover = null;
          this._render();
        });
      }
      this._el.appendChild(star);
    }
  }

  _starSVG(fill) {
    if (fill === 'full') return `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/></svg>`;
    if (fill === 'half') return `<svg viewBox="0 0 24 24"><defs><linearGradient id="h"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="var(--mts-gray-200)"/></linearGradient></defs><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#h)"/></svg>`;
    return `<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="var(--mts-gray-200)" stroke="var(--mts-gray-300)" stroke-width="0.5"/></svg>`;
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:rating:${event}`, { bubbles: true, detail }));
  }
};
