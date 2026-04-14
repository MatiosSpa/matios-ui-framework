/* ============================================================
   MATIOS UI — matios-ui-checkbox.js
   MTS.Checkbox | MTS.CheckboxGroup
   Version: 2.1.0
   ============================================================ */

window.MTS = window.MTS || {};

/* ── MTS.Checkbox ─────────────────────────────────────────── */

MTS.Checkbox = class MtsCheckbox {
  constructor(selector, options = {}) {
    // Target container element / Elemento contenedor
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;

    // Text label next to the checkbox / Texto junto al checkbox
    this.label = options.label || '';

    // Initial checked state / Estado inicial
    this.checked = options.checked ?? false;

    // Initial indeterminate state (partial selection) / Estado indeterminado inicial (selección parcial)
    this.indeterminate = options.indeterminate ?? false;

    // Disables all interaction / Deshabilita toda interacción
    this.disabled = options.disabled ?? false;

    // Value associated with this checkbox / Valor asociado a este checkbox
    this.value = options.value || '';

    this._listeners = {};

    // Fires when the checkbox state changes / Se dispara al cambiar el estado
    if (options.onChange) this.on('change', options.onChange);

    this._build();
  }

  // Returns true if checked / Retorna true si está marcado
  isChecked() { return this._inputEl?.checked ?? false; }

  // Sets checked state programmatically / Establece el estado marcado programáticamente
  setChecked(v) {
    if (this._inputEl) { this._inputEl.checked = v; this._inputEl.indeterminate = false; }
    return this;
  }

  // Sets indeterminate state / Establece el estado indeterminado
  setIndeterminate(v) { if (this._inputEl) { this._inputEl.indeterminate = v; } return this; }

  // Toggles the current state / Invierte el estado actual
  toggle() { return this.setChecked(!this.isChecked()); }

  // Registers an event listener / Registra un listener de evento
  on(e, cb) { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }

  _build() {
    this._el.className = 'mts-checkbox-wrap';
    this._inputEl = document.createElement('input');
    this._inputEl.type          = 'checkbox';
    this._inputEl.className     = 'mts-checkbox';
    this._inputEl.checked       = this.checked;
    this._inputEl.indeterminate = this.indeterminate;
    this._inputEl.disabled      = this.disabled;
    this._inputEl.value         = this.value;
    this._inputEl.addEventListener('change', (e) => {
      this._emit('change', { checked: e.target.checked, value: this.value });
    });
    this._el.appendChild(this._inputEl);
    if (this.label) {
      const lbl = document.createElement('label');
      lbl.className   = 'mts-checkbox__label';
      lbl.textContent = this.label;
      lbl.addEventListener('click', () => { if (!this.disabled) this._inputEl.click(); });
      this._el.appendChild(lbl);
    }
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._inputEl?.dispatchEvent(new CustomEvent(`mts:checkbox:${event}`, { bubbles: true, detail }));
  }
};

/* ── MTS.CheckboxGroup ───────────────────────────────────── */

MTS.CheckboxGroup = class MtsCheckboxGroup {
  constructor(selector, options = {}) {
    // Target container element / Elemento contenedor
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;

    // Array of options: [{ value, label, disabled? }] / Arreglo de opciones
    this.options = options.options || [];

    // Initially selected values / Valores seleccionados inicialmente
    this.value = options.value || [];

    // Disables all checkboxes / Deshabilita todos los checkboxes
    this.disabled = options.disabled ?? false;

    // Horizontal layout / Layout horizontal
    this.horizontal = options.horizontal ?? false;

    this._listeners = {};

    // Fires when selection changes / Se dispara al cambiar la selección
    if (options.onChange) this.on('change', options.onChange);

    this._build();
  }

  // Returns array of selected values / Retorna arreglo de valores seleccionados
  getValue() { return [...this.value]; }

  // Registers an event listener / Registra un listener de evento
  on(e, cb) { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }

  _build() {
    this._el.className = 'mts-checkbox-group' + (this.horizontal ? ' mts-checkbox-group--horizontal' : '');
    this.options.forEach(opt => {
      const wrap  = document.createElement('div');
      wrap.className = 'mts-checkbox-wrap';
      const input = document.createElement('input');
      input.type      = 'checkbox';
      input.className = 'mts-checkbox';
      input.value     = opt.value;
      input.checked   = this.value.includes(opt.value);
      input.disabled  = opt.disabled || this.disabled;
      input.addEventListener('change', (e) => {
        if (e.target.checked) this.value.push(opt.value);
        else this.value = this.value.filter(v => v !== opt.value);
        this._emit('change', { value: [...this.value] });
      });
      const lbl = document.createElement('label');
      lbl.className   = 'mts-checkbox__label';
      lbl.textContent = opt.label;
      lbl.addEventListener('click', () => { if (!input.disabled) input.click(); });
      wrap.appendChild(input);
      wrap.appendChild(lbl);
      this._el.appendChild(wrap);
    });
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:checkbox:${event}`, { bubbles: true, detail }));
  }
};
