/* ============================================================
   MATIOS UI — matios-ui-label.js  v1.0.0
   MTS.Label — Label de formulario con hint, error y badge
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Label = class MtsLabel {
  /**
   * @param {string|Element} selector
   * @param {object}  options
   * @param {string}  options.text        Texto del label
   * @param {boolean} options.required    Muestra asterisco rojo
   * @param {boolean} options.optional    Muestra badge "(opcional)"
   * @param {string}  options.hint        Texto de ayuda (bajo el campo)
   * @param {string}  options.error       Texto de error (bajo el campo)
   * @param {string}  options.size        'sm' | '' | 'lg'
   * @param {boolean} options.hidden      Visualmente oculto pero accesible
   * @param {string}  options.forId       Atributo `for` del label
   * @param {string}  options.className   Clases CSS adicionales
   */
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) { console.error('[MTS.Label] No encontrado:', selector); return; }

    this.text      = options.text      ?? this._el.textContent.trim();
    this.required  = options.required  ?? false;
    this.optional  = options.optional  ?? false;
    this.hint      = options.hint      ?? null;
    this.error     = options.error     ?? null;
    this.size      = options.size      ?? '';
    this.hidden    = options.hidden    ?? false;
    this.forId     = options.forId     ?? null;
    this.className = options.className ?? '';

    this._build();
  }

  /* ── API ──────────────────────────────────────────────── */

  setText(text) {
    this.text = text;
    const span = this._el.querySelector('.mts-label__text');
    if (span) span.textContent = text;
    return this;
  }

  setHint(text) {
    this.hint = text;
    this._renderFeedback();
    return this;
  }

  setError(text) {
    this.error = text;
    this._renderFeedback();
    return this;
  }

  clearError() {
    this.error = null;
    this._renderFeedback();
    return this;
  }

  setRequired(v) {
    this.required = v;
    this._el.classList.toggle('mts-label--required', v);
    return this;
  }

  destroy() { this._el.innerHTML = ''; }

  /* ── Build ────────────────────────────────────────────── */

  _build() {
    const classes = ['mts-label'];
    if (this.required) classes.push('mts-label--required');
    if (this.optional) classes.push('mts-label--optional');
    if (this.hidden)   classes.push('mts-label--hidden');
    if (this.size)     classes.push('mts-label--' + this.size);
    if (this.className) this.className.split(' ').forEach(c => c && classes.push(c));

    this._el.className = classes.join(' ');
    if (this.forId) this._el.setAttribute('for', this.forId);

    const span = document.createElement('span');
    span.className = 'mts-label__text';
    span.textContent = this.text;
    this._el.innerHTML = '';
    this._el.appendChild(span);

    if (this.optional) {
      const badge = document.createElement('span');
      badge.className = 'mts-label__optional';
      badge.textContent = 'opcional';
      this._el.appendChild(badge);
    }

    this._renderFeedback();
  }

  _renderFeedback() {
    /* hint y error viven FUERA del label, en el form-group padre */
    const parent = this._el.parentElement;
    if (!parent) return;

    /* Limpiar feedbacks previos de esta instancia */
    parent.querySelectorAll('.mts-label-hint, .mts-label-error').forEach(el => el.remove());

    if (this.error) {
      const err = document.createElement('span');
      err.className = 'mts-form-error mts-label-error';
      err.textContent = this.error;
      this._el.after(err);
    } else if (this.hint) {
      const hint = document.createElement('span');
      hint.className = 'mts-form-hint mts-label-hint';
      hint.textContent = this.hint;
      this._el.after(hint);
    }
  }
};
