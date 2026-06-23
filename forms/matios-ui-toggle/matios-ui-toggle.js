/* ============================================================
   MATIOS UI — matios-ui-toggle.js
   MTS.Toggle
   Version: 1.1.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Toggle = class MtsToggle {
  constructor(selector, options = {}) {
    // Target container element (selector string or DOM element)
    // Elemento contenedor (selector string o elemento DOM)
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;

    // Text label displayed next to the switch
    // Texto que aparece junto al switch
    this.label = options.label || '';

    // Initial checked state
    // Estado inicial del switch
    this.checked = options.checked ?? false;

    // Disables all interaction when true
    // Deshabilita toda interacción cuando es true
    this.disabled = options.disabled ?? false;

    // Visual size variant
    // Variante de tamaño visual
    this.size = options.size || 'md'; // 'sm' | 'md' | 'lg'

    this._listeners = {};

    // Fires whenever the switch state changes
    // Se dispara cada vez que el estado del switch cambia
    if (options.onChange) this.on('change', options.onChange);

    // Form-field contract
    this.required     = options.required     ?? false;
    this.errorMessage = options.errorMessage ?? null;
    this._error       = '';
    const self = this;
    this.on('change', function () { if (self._error) self.clearError(); });

    this._build();
    this._el._mtsInstance = this;
  }

  // Returns true if the switch is currently on
  // Retorna true si el switch está actualmente encendido
  isChecked() { return this._inputEl?.checked ?? false; }

  /* ── Form-field validation contract — required = must be on ── */
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
    const ok = !this.required || this.isChecked();
    if (ok) this.clearError(); else this.setError(this.errorMessage || this._t('required', 'This field is required'));
    this._emit('validate', { valid: ok, errors: ok ? [] : [this._error] });
    return ok;
  }
  _t(key, fallback) {
    try { const ns = (window.MTS && MTS.getLocale) ? MTS.getLocale()['MTS.Toggle'] : null; const m = ns && ns.messages; if (m && m[key] != null) return m[key]; } catch (e) {}
    return fallback;
  }

  // Sets the switch state programmatically
  // Establece el estado del switch programáticamente
  setChecked(v) { if (this._inputEl) this._inputEl.checked = v; return this; }

  // Toggles the current state
  // Invierte el estado actual
  toggle() { return this.setChecked(!this.isChecked()); }

  // Registers an event listener
  // Registra un listener de evento
  on(e, cb) {
    if (!this._listeners[e]) this._listeners[e] = [];
    this._listeners[e].push(cb);
    return this;
  }

  _build() {
    this._syncClasses();
    this._el.innerHTML = '';
    const track = document.createElement('label');
    track.className = 'mts-toggle';

    this._inputEl = document.createElement('input');
    this._inputEl.type     = 'checkbox';
    this._inputEl.checked  = this.checked;
    this._inputEl.disabled = this.disabled;
    this._inputEl.addEventListener('change', (e) => {
      this._emit('change', { checked: e.target.checked });
    });

    const thumb = document.createElement('span');
    thumb.className = 'mts-toggle__thumb';
    track.appendChild(this._inputEl);
    track.appendChild(thumb);
    this._el.appendChild(track);

    if (this.label) {
      const lbl = document.createElement('span');
      lbl.className   = 'mts-toggle__label';
      lbl.textContent = this.label;
      this._el.appendChild(lbl);
    }
  }

  _syncClasses() {
    const previousMatiosClasses = [...this._el.classList].filter(cls =>
      cls === 'mts-toggle-wrap' || cls.startsWith('mts-toggle-wrap--')
    );
    if (previousMatiosClasses.length) this._el.classList.remove(...previousMatiosClasses);
    this._el.classList.add('mts-toggle-wrap', `mts-toggle-wrap--${this.size}`);
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._inputEl?.dispatchEvent(new CustomEvent(`mts:toggle:${event}`, { bubbles: true, detail }));
  }
};
