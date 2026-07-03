/* ============================================================
   MATIOS UI — matios-ui-label.js
   MTS.Label — Form label with hint, error and badges
   Version: 1.1.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Label = class MtsLabel {
  constructor(selector, options = {}) {
    // Target element (must be a <label> or container) / Elemento objetivo (debe ser <label> o contenedor)
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) { console.error('[MTS.Label] Not found / No encontrado:', selector); return; }

    // Label text / Texto del label
    this.text = options.text ?? this._el.textContent.trim();

    // Show red required asterisk / Mostrar asterisco rojo de requerido
    this.required = options.required ?? false;

    // Show optional badge / Mostrar badge opcional
    this.optional = options.optional ?? false;

    // Helper text shown below the field / Texto de ayuda debajo del campo
    this.hint = options.hint ?? null;

    // Error text shown below the field / Texto de error debajo del campo
    this.error = options.error ?? null;

    // Size variant: 'sm' | '' | 'lg' / Variante de tamaño
    this.size = options.size ?? '';

    // Visually hidden but accessible to screen readers / Oculto visualmente pero accesible
    this.hidden = options.hidden ?? false;

    // The `for` attribute linking to an input id / Atributo `for` que vincula a un input
    this.forId = options.forId ?? null;

    // Extra CSS classes / Clases CSS adicionales
    this.className = options.className ?? '';

    this._build();
  }

  /* ── API ─────────────────────────────────────────────── */

  // Change label text at runtime / Cambiar texto en runtime
  setText(text) {
    this.text = text;
    const span = this._el.querySelector('.mts-label__text');
    if (span) span.textContent = text;
    return this;
  }

  // Show helper text / Mostrar texto de ayuda
  setHint(text) { this.hint = text; this._renderFeedback(); return this; }

  // Show error message / Mostrar mensaje de error
  setError(text) { this.error = text; this._renderFeedback(); return this; }

  // Clear error message / Limpiar mensaje de error
  clearError() { this.error = null; this._renderFeedback(); return this; }

  // Toggle required asterisk / Alternar asterisco requerido
  setRequired(v) {
    this.required = v;
    this._el.classList.toggle('mts-label--required', v);
    return this;
  }

  // Destroy the component / Destruir el componente
  destroy() { this._el.innerHTML = ''; }

  /* Localized chrome lookup — MTS.Label → messages namespace; English fallback. */
  _t(key, fallback) {
    try {
      const ns = (typeof window !== 'undefined' && window.MTS && MTS.getString) ? MTS.getString()['MTS.Label'] : null;
      const m  = ns && ns.messages;
      if (m && m[key] != null) return m[key];
    } catch (e) {}
    return fallback;
  }

  /* ── Build / Construcción ───────────────────────────── */

  _build() {
    this._syncClasses();
    if (this.forId) this._el.setAttribute('for', this.forId);

    // Inner text span / Span interno del texto
    const span = document.createElement('span');
    span.className   = 'mts-label__text';
    span.textContent = this.text;
    this._el.innerHTML = '';
    this._el.appendChild(span);

    // Optional badge / Badge opcional
    if (this.optional) {
      const badge = document.createElement('span');
      badge.className   = 'mts-label__optional';
      badge.textContent = this._t('optional', 'optional');
      this._el.appendChild(badge);
    }

    this._renderFeedback();
  }

  _syncClasses() {
    const previousMatiosClasses = [...this._el.classList].filter(cls =>
      cls === 'mts-label' || cls.startsWith('mts-label--')
    );
    if (previousMatiosClasses.length) this._el.classList.remove(...previousMatiosClasses);

    const classes = ['mts-label'];
    if (this.required)  classes.push('mts-label--required');
    if (this.optional)  classes.push('mts-label--optional');
    if (this.hidden)    classes.push('mts-label--hidden');
    if (this.size)      classes.push('mts-label--' + this.size);
    if (this.className) this.className.split(' ').forEach(c => c && classes.push(c));

    this._el.classList.add(...classes);
  }

  _renderFeedback() {
    // hint and error live OUTSIDE the label, in the parent form-group
    // hint y error viven FUERA del label, en el form-group padre
    const parent = this._el.parentElement;
    if (!parent) return;

    // Remove previous feedback elements / Eliminar feedbacks previos
    parent.querySelectorAll('.mts-label-hint, .mts-label-error').forEach(el => el.remove());

    if (this.error) {
      const err = document.createElement('span');
      err.className   = 'mts-form-error mts-label-error';
      err.textContent = this.error;
      this._el.after(err);
    } else if (this.hint) {
      const hint = document.createElement('span');
      hint.className   = 'mts-form-hint mts-label-hint';
      hint.textContent = this.hint;
      this._el.after(hint);
    }
  }
};
