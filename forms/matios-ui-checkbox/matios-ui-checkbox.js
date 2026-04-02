/* ============================================================
   MATIOS UI — matios-ui-checkbox.js
   MTS.Checkbox | MTS.Radio | MTS.Toggle | MTS.Slider
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

/* ---- CHECKBOX ---- */
MTS.Checkbox = class MtsCheckbox {
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    this.label         = options.label         || '';
    this.checked       = options.checked       ?? false;
    this.indeterminate = options.indeterminate ?? false;
    this.disabled      = options.disabled      ?? false;
    this.value         = options.value         || '';
    this._listeners    = {};
    if (options.onChange) this.on('change', options.onChange);
    this._build();
  }

  isChecked()    { return this._inputEl?.checked ?? false; }
  setChecked(v)  { if (this._inputEl) { this._inputEl.checked = v; this._inputEl.indeterminate = false; } return this; }
  setIndeterminate(v) { if (this._inputEl) { this._inputEl.indeterminate = v; } return this; }
  toggle()       { return this.setChecked(!this.isChecked()); }
  on(e, cb)      { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }

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

/* ---- CHECKBOX GROUP ---- */
MTS.CheckboxGroup = class MtsCheckboxGroup {
  constructor(selector, options = {}) {
    this._el      = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.options  = options.options  || [];
    this.value    = options.value    || [];
    this.disabled = options.disabled ?? false;
    this._listeners = {};
    if (options.onChange) this.on('change', options.onChange);
    this._build();
  }

  getValue() { return [...this.value]; }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }

  _build() {
    this._el.className = 'mts-checkbox-group';
    this.options.forEach(opt => {
      const wrap = document.createElement('div');
      wrap.className = 'mts-checkbox-wrap';
      const input = document.createElement('input');
      input.type     = 'checkbox';
      input.className = 'mts-checkbox';
      input.value    = opt.value;
      input.checked  = this.value.includes(opt.value);
      input.disabled = opt.disabled || this.disabled;
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

/* ---- RADIO GROUP ---- */
MTS.Radio = class MtsRadio {
  constructor(selector, options = {}) {
    this._el      = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.options  = options.options  || [];
    this.value    = options.value    ?? null;
    this.name     = options.name     || `mts-radio-${Date.now()}`;
    this.disabled = options.disabled ?? false;
    this._listeners = {};
    if (options.onChange) this.on('change', options.onChange);
    this._build();
  }

  getValue() { return this.value; }
  setValue(v) { this.value = v; this._el.querySelectorAll('input[type="radio"]').forEach(i => { i.checked = i.value === String(v); }); return this; }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }

  _build() {
    this._el.className = 'mts-radio-group';
    this.options.forEach(opt => {
      const wrap = document.createElement('div');
      wrap.className = 'mts-radio-wrap';
      const input = document.createElement('input');
      input.type     = 'radio';
      input.className = 'mts-radio';
      input.name     = this.name;
      input.value    = opt.value;
      input.checked  = this.value === opt.value;
      input.disabled = opt.disabled || this.disabled;
      input.addEventListener('change', (e) => {
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

/* ---- TOGGLE / SWITCH ---- */
MTS.Toggle = class MtsToggle {
  constructor(selector, options = {}) {
    this._el   = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.label   = options.label   || '';
    this.checked = options.checked ?? false;
    this.disabled = options.disabled ?? false;
    this.size    = options.size    || 'md';
    this._listeners = {};
    if (options.onChange) this.on('change', options.onChange);
    this._build();
  }

  isChecked()   { return this._inputEl?.checked ?? false; }
  setChecked(v) { if (this._inputEl) this._inputEl.checked = v; return this; }
  toggle()      { return this.setChecked(!this.isChecked()); }
  on(e, cb)     { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }

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

/* ---- SLIDER / RANGE ---- */
MTS.Slider = class MtsSlider {
  constructor(selector, options = {}) {
    this._el    = typeof selector === 'string' ? document.querySelector(selector) : selector;
    this.min    = options.min    ?? 0;
    this.max    = options.max    ?? 100;
    this.step   = options.step   ?? 1;
    this.value  = options.value  ?? this.min;
    this.value2 = options.value2 ?? this.max;
    this.range  = options.range  ?? false;
    this.value2 = Array.isArray(options.value) ? options.value[1] : (this.max);
    this.label  = options.label  || '';
    this.showValue = options.showValue ?? true;
    this.labelFormat = options.labelFormat || null;
    this._listeners = {};
    if (options.onChange) this.on('change', options.onChange);
    this._build();
  }

  getValue()  { return this.range ? [Number(this._input1.value), Number(this._input2?.value)] : Number(this._input1.value); }
  setValue(v) {
    if (this.range && Array.isArray(v)) { this._input1.value = v[0]; if (this._input2) this._input2.value = v[1]; }
    else this._input1.value = v;
    this._updateTrack();
    return this;
  }
  on(e, cb)   { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }

  _build() {
    this._el.className = 'mts-slider-wrap';
    if (this.label) {
      const row = document.createElement('div');
      row.className = 'mts-slider__header';
      const lbl = document.createElement('span');
      lbl.className = 'mts-label';
      lbl.textContent = this.label;
      row.appendChild(lbl);
      if (this.showValue) {
        this._valueDisplay = document.createElement('span');
        this._valueDisplay.className = 'mts-slider__value';
        row.appendChild(this._valueDisplay);
      }
      this._el.appendChild(row);
    }

    const track = document.createElement('div');
    track.className = 'mts-slider__track';

    this._fill = document.createElement('div');
    this._fill.className = 'mts-slider__fill';
    track.appendChild(this._fill);

    this._input1 = document.createElement('input');
    this._input1.type  = 'range';
    this._input1.className = 'mts-slider__input';
    this._input1.min   = this.min;
    this._input1.max   = this.max;
    this._input1.step  = this.step;
    this._input1.value = this.value;
    this._input1.addEventListener('input', () => { this._updateTrack(); this._emit('change', { value: this.getValue() }); });
    track.appendChild(this._input1);

    if (this.range) {
      this._input2 = document.createElement('input');
      this._input2.type  = 'range';
      this._input2.className = 'mts-slider__input';
      this._input2.min   = this.min;
      this._input2.max   = this.max;
      this._input2.step  = this.step;
      this._input2.value = this.value2;
      this._input2.addEventListener('input', () => { this._updateTrack(); this._emit('change', { value: this.getValue() }); });
      track.appendChild(this._input2);
    }

    this._el.appendChild(track);
    this._updateTrack();
  }

  _updateTrack() {
    const pct1 = ((Number(this._input1.value) - this.min) / (this.max - this.min)) * 100;
    if (this.range && this._input2) {
      const pct2 = ((Number(this._input2.value) - this.min) / (this.max - this.min)) * 100;
      const left  = Math.min(pct1, pct2);
      const right = Math.max(pct1, pct2);
      const width = right - left;
      this._fill.style.left  = `${left}%`;
      this._fill.style.width = `${width}%`;
      /* z-index dinámico: el thumb más cercano al centro queda encima */
      const mid = (pct1 + pct2) / 2;
      this._input1.style.zIndex = pct1 >= mid ? '4' : '3';
      if (this._input2) this._input2.style.zIndex = pct1 >= mid ? '3' : '4';
      /* Si ambos en el mismo extremo, el input2 queda encima */
      if (Math.abs(pct1 - pct2) < 1) { this._input1.style.zIndex='3'; this._input2.style.zIndex='4'; }
      if (this._valueDisplay) {
        const v = this.getValue();
        this._valueDisplay.textContent = this.labelFormat ? this.labelFormat(v) : `${v[0]} – ${v[1]}`;
      }
    } else {
      this._fill.style.left  = '0%';
      this._fill.style.width = `${pct1}%`;
      if (this._valueDisplay) {
        const v = Number(this._input1.value);
        this._valueDisplay.textContent = this.labelFormat ? this.labelFormat(v) : v;
      }
    }
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:slider:${event}`, { bubbles: true, detail }));
  }
};
