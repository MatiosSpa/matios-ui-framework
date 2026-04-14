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

    this._build();
  }

  // Returns true if the switch is currently on
  // Retorna true si el switch está actualmente encendido
  isChecked() { return this._inputEl?.checked ?? false; }

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
    this._el.className = `mts-toggle-wrap mts-toggle-wrap--${this.size}`;
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

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._inputEl?.dispatchEvent(new CustomEvent(`mts:toggle:${event}`, { bubbles: true, detail }));
  }
};
