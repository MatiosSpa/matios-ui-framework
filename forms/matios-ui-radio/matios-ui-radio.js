/* ============================================================
   MATIOS UI — matios-ui-radio.js
   MTS.Radio
   Version: 1.1.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Radio = class MtsRadio {
  constructor(selector, options = {}) {
    // Target container element / Elemento contenedor
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;

    // Array of options: [{ value, label, disabled? }] / Arreglo de opciones
    this.options = options.options || [];

    // Initially selected value / Valor seleccionado inicialmente
    this.value = options.value ?? null;

    // Radio group name (must be unique per group) / Nombre del grupo radio (debe ser único por grupo)
    this.name = options.name || `mts-radio-${Date.now()}`;

    // Disables all radio buttons / Deshabilita todos los radio buttons
    this.disabled = options.disabled ?? false;

    // Horizontal layout / Layout horizontal
    this.horizontal = options.horizontal ?? false;

    this._listeners = {};

    // Fires when selection changes / Se dispara al cambiar la selección
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

  // Returns currently selected value / Retorna el valor actualmente seleccionado
  getValue() { return this.value; }

  /* ── Form-field validation contract — required = a value must be selected ── */
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
    const ok = !this.required || this.value != null;
    if (ok) this.clearError(); else this.setError(this.errorMessage || this._t('required', 'This field is required'));
    this._emit('validate', { valid: ok, errors: ok ? [] : [this._error] });
    return ok;
  }
  _t(key, fallback) {
    try { const ns = (window.MTS && MTS.getLocale) ? MTS.getLocale()['MTS.Radio'] : null; const m = ns && ns.messages; if (m && m[key] != null) return m[key]; } catch (e) {}
    return fallback;
  }

  // Sets selected value programmatically / Establece el valor seleccionado programáticamente
  setValue(v) {
    this.value = v;
    this._el.querySelectorAll('input[type="radio"]').forEach(i => { i.checked = i.value === String(v); });
    return this;
  }

  // Registers an event listener / Registra un listener de evento
  on(e, cb) { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }

  _syncClasses() {
    const keep = Array.from(this._el.classList).filter(cls => !cls.startsWith('mts-radio-group'));
    this._el.className = keep.join(' ');
    this._el.classList.add('mts-radio-group');
    if (this.horizontal) this._el.classList.add('mts-radio-group--horizontal');
  }

  _build() {
    this._syncClasses();
    this._el.innerHTML = '';
    this.options.forEach(opt => {
      const wrap  = document.createElement('div');
      wrap.className = 'mts-radio-wrap';
      const input = document.createElement('input');
      input.type      = 'radio';
      input.className = 'mts-radio';
      input.name      = this.name;
      input.value     = opt.value;
      input.checked   = this.value === opt.value;
      input.disabled  = opt.disabled || this.disabled;
      input.addEventListener('change', () => {
        this.value = opt.value;
        this._emit('change', { value: opt.value });
      });
      const lbl = document.createElement('label');
      lbl.className   = 'mts-radio__label';
      lbl.textContent = opt.label;
      lbl.addEventListener('click', () => { if (!input.disabled) input.click(); });
      wrap.appendChild(input);
      wrap.appendChild(lbl);
      this._el.appendChild(wrap);
    });
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:radio:${event}`, { bubbles: true, detail }));
  }
};
