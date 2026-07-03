/* ============================================================
   MATIOS UI — matios-ui-rating.js
   MTS.Rating — Star rating with hover and half-star support
   Version: 1.1.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Rating = class MtsRating {
  constructor(selector, options = {}) {
    // Target container element / Elemento contenedor
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;

    // Read data-* attributes for declarative HTML initialization
    // Lee atributos data-* para inicialización HTML declarativa
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.value    !== undefined) _fromHTML.value    = parseFloat(_ds.value);
    if (_ds.max      !== undefined) _fromHTML.max      = parseInt(_ds.max);
    if (_ds.halfStars !== undefined) _fromHTML.halfStars = true;
    if (_ds.readonly !== undefined) _fromHTML.readonly = true;
    if (_ds.size     !== undefined) _fromHTML.size     = _ds.size;
    options = { ..._fromHTML, ...options };

    // Initial rating value (0 to max) / Valor inicial (0 a max)
    this.value = options.value ?? 0;

    // Total number of stars / Total de estrellas
    this.max = options.max ?? 5;

    // Allow half-star ratings / Permitir valoraciones de medio punto
    this.halfStars = options.halfStars ?? false;

    // Disables interaction, display only / Deshabilita interacción, solo display
    this.readonly = options.readonly ?? false;

    // Size variant: 'sm' | 'md' | 'lg' / Variante de tamaño
    this.size = options.size || 'md';

    this._hover     = null;
    this._listeners = {};

    // Fires when rating value changes / Se dispara al cambiar el valor
    if (options.onChange) this.on('change', options.onChange);

    // Form-field contract
    this.required     = options.required     ?? false;
    this.errorMessage = options.errorMessage ?? null;
    this._error       = '';
    const self = this;
    this.on('change', function () { if (self._error) self.clearError(); });

    this._build();
  }

  // Returns current rating value / Retorna el valor actual
  getValue() { return this.value; }

  // Sets rating value programmatically / Establece el valor programáticamente
  setValue(v) { this.value = Math.min(this.max, Math.max(0, v)); this._render(); return this; }

  /* ── Form-field validation contract — required = a star must be picked ── */
  setError(msg) {
    this._error = msg || '';
    if (!this._errEl || !this._errEl.isConnected) {
      this._errEl = document.createElement('span');
      this._errEl.className = 'mts-form-error';
      this._el.appendChild(this._errEl);
    }
    this._errEl.textContent = this._error;
    this._errEl.style.display = this._error ? '' : 'none';
    return this;
  }
  clearError() { return this.setError(''); }
  validate() {
    const ok = !this.required || this.value > 0;
    if (ok) this.clearError(); else this.setError(this.errorMessage || this._t('required', 'This field is required'));
    this._emit('validate', { valid: ok, errors: ok ? [] : [this._error] });
    return ok;
  }
  _t(key, fallback) {
    try { const ns = (window.MTS && MTS.getString) ? MTS.getString()['MTS.Rating'] : null; const m = ns && ns.messages; if (m && m[key] != null) return m[key]; } catch (e) {}
    return fallback;
  }

  // Registers an event listener / Registra un listener de evento
  on(e, cb) { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }

  // Destroys the component / Destruye el componente
  destroy() { this._el.innerHTML = ''; }

  _syncClasses() {
    const keep = Array.from(this._el.classList).filter(cls => !cls.startsWith('mts-rating'));
    this._el.className = keep.join(' ');
    this._el.classList.add('mts-rating', `mts-rating--${this.size}`);
    if (this.readonly) this._el.classList.add('mts-rating--readonly');
  }

  _build() {
    this._syncClasses();
    this._el.setAttribute('role', 'radiogroup');
    this._render();
  }

  _render() {
    this._el.innerHTML = '';
    const display = this._hover ?? this.value;

    for (let i = 1; i <= this.max; i++) {
      const star = document.createElement('button');
      star.className = 'mts-rating__star';
      const starLabel = this._t('starLabel', '{n} stars').replace('{n}', String(i));
      star.setAttribute('aria-label', starLabel);
      star.setAttribute('type', 'button');
      if (this.readonly) { star.disabled = true; }

      const fill = display >= i ? 'full'
        : display >= i - 0.5 && this.halfStars ? 'half'
        : 'empty';
      star.classList.add(`mts-rating__star--${fill}`);
      star.innerHTML = this._starSVG(fill);

      if (!this.readonly) {
        star.addEventListener('click', (e) => {
          let val = i;
          if (this.halfStars) {
            const rect = star.getBoundingClientRect();
            val = e.clientX < rect.left + rect.width / 2 ? i - 0.5 : i;
          }
          this.value  = val;
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
