/* ============================================================
   MATIOS UI â€” matios-ui-numberinput.js
   MTS.NumberInput â€” Input numÃ©rico con +/-, min/max, step,
                     formato moneda/porcentaje/personalizado
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.NumberInput = class MtsNumberInput {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {number}   options.value        Valor inicial â€” default: 0
   * @param {number}   options.min          MÃ­nimo â€” default: null
   * @param {number}   options.max          MÃ¡ximo â€” default: null
   * @param {number}   options.step         Paso de incremento â€” default: 1
   * @param {number}   options.decimals     Decimales a mostrar â€” default: 0
   * @param {string}   options.label        Etiqueta
   * @param {string}   options.placeholder  Placeholder
   * @param {string}   options.hint         Texto de ayuda
   * @param {string}   options.prefix       Prefijo visible (ej: '$')
   * @param {string}   options.suffix       Sufijo visible (ej: '%', 'kg')
   * @param {string}   options.format       'plain'|'currency'|'percent' â€” default: 'plain'
   * @param {string}   options.locale       Locale para formato â€” default: 'es-CL'
   * @param {string}   options.currency     Moneda para format currency â€” default: 'CLP'
   * @param {boolean}  options.disabled     â€” default: false
   * @param {boolean}  options.readonly     â€” default: false
   * @param {string}   options.size         'sm'|'md'|'lg' â€” default: 'md'
   * @param {function} options.onChange     (value, formattedValue) => {}
   * @param {function} options.onFocus
   * @param {function} options.onBlur
   */
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) { console.error('[MTS.NumberInput] No encontrado:', selector); return; }
    /* â”€â”€ data-* â†’ inicializaciÃ³n HTML declarativa â”€â”€ */
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.label !== undefined) _fromHTML.label = _ds.label;
    if (_ds.placeholder !== undefined) _fromHTML.placeholder = _ds.placeholder;
    if (_ds.hint !== undefined) _fromHTML.hint = _ds.hint;
    if (_ds.value !== undefined) _fromHTML.value = parseFloat(_ds.value);
    if (_ds.min !== undefined) _fromHTML.min = parseFloat(_ds.min);
    if (_ds.max !== undefined) _fromHTML.max = parseFloat(_ds.max);
    if (_ds.step !== undefined) _fromHTML.step = parseFloat(_ds.step);
    if (_ds.decimals !== undefined) _fromHTML.decimals = parseInt(_ds.decimals);
    if (_ds.prefix !== undefined) _fromHTML.prefix = _ds.prefix;
    if (_ds.suffix !== undefined) _fromHTML.suffix = _ds.suffix;
    if (_ds.disabled !== undefined) _fromHTML.disabled = true;
    if (_ds.readonly !== undefined) _fromHTML.readonly = true;
    if (_ds.required !== undefined) _fromHTML.required = true;
    if (_ds.errorMessage !== undefined) _fromHTML.errorMessage = _ds.errorMessage;
    if (_ds.size !== undefined) _fromHTML.size = _ds.size;
    options = { ..._fromHTML, ...options };


    this.value       = (options.value !== undefined) ? options.value : 0;   // explicit null = empty (for required)
    this.required    = options.required    ?? false;
    this.errorMessage = options.errorMessage ?? null;
    this.min         = options.min         ?? null;
    this.max         = options.max         ?? null;
    this.step        = options.step        ?? 1;
    this.decimals    = options.decimals    ?? 0;
    this.label       = options.label       || '';
    this.placeholder = options.placeholder || '';
    this.hint        = options.hint        || '';
    this.prefix      = options.prefix      || '';
    this.suffix      = options.suffix      || '';
    this.format      = options.format      || 'plain';
    this.locale      = options.locale      || 'es-CL';
    this.currency    = options.currency    || 'CLP';
    this.disabled    = options.disabled    ?? false;
    this.readonly    = options.readonly    ?? false;
    this.size        = options.size        || 'md';
    this.renderMode  = options.renderMode  || 'auto';
    this._error        = '';
    this._holdTimer    = null;
    this._holdInterval = null;
    this._listeners    = {};

    // Fires when value changes: ({ value, formatted }) => {}
    // Se dispara al cambiar el valor
    if (options.onChange) this.on('change', options.onChange);

    // Fires when input gains focus / Se dispara al enfocar el input
    if (options.onFocus)  this.on('focus',  options.onFocus);

    // Fires when input loses focus / Se dispara al perder el foco
    if (options.onBlur)   this.on('blur',   options.onBlur);

    this._build();
    this._el._mtsInstance = this;
  }

  /*â”€â”€ API pÃºblica â”€â”€ */
  getValue()       { return this.value; }
  setValue(v, silent = false) {
    this.value = (v == null || v === '') ? null : this._clamp(Number(v));
    if (this._input) this._input.value = this._formatDisplay(this.value);
    this._updateBtns();
    if (!silent) this._emit('change', { value: this.value, formatted: this._formatDisplay(this.value) });
    return this;
  }
  setMin(v)        { this.min = v; this._updateBtns(); return this; }
  setMax(v)        { this.max = v; this._updateBtns(); return this; }
  setError(msg)    { this._error = msg; this._renderError(); return this; }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }
  clearError()     { this._error = ''; this._renderError(); return this; }
  /* Form-field contract: required = a value must be entered (null = empty). */
  validate() {
    var ok = !this.required || this.value != null;
    if (ok) this.clearError(); else this.setError(this.errorMessage || this._t('required', 'This field is required'));
    this._emit('validate', { valid: ok, errors: ok ? [] : [this._error] });
    return ok;
  }
  _t(key, fallback) {
    try { var ns = (window.MTS && MTS.getLocale) ? MTS.getLocale()['MTS.NumberInput'] : null; var m = ns && ns.messages; if (m && m[key] != null) return m[key]; } catch (e) {}
    return fallback;
  }
  disable()        { this.disabled = true;  this._build(); return this; }
  enable()         { this.disabled = false; this._build(); return this; }
  focus()          { this._input?.focus(); return this; }

  /* â”€â”€ Build â”€â”€ */
  _build() {
    const explicitFieldOnly = this.renderMode === 'field-only';
    const explicitStandalone = this.renderMode === 'standalone';
    const parentIsGroup = this._el.parentElement?.classList.contains('mts-form-group');
    const fieldOnly = explicitFieldOnly || (!explicitStandalone && parentIsGroup);

    this._el.innerHTML = '';
    this._el.classList.add('mts-numberinput');

    /* Label */
    if (!fieldOnly && this.label) {
      const lbl = document.createElement('label');
      lbl.className = 'mts-numberinput__label';
      lbl.textContent = this.label;
      this._el.appendChild(lbl);
    }

    /* Wrapper */
    const wrap = document.createElement('div');
    wrap.className = `mts-numberinput__wrap mts-numberinput__wrap--${this.size}${this.disabled ? ' mts-numberinput__wrap--disabled' : ''}`;

    /* BotÃ³n âˆ’ */
    const btnDec = document.createElement('button');
    btnDec.type = 'button';
    btnDec.className = 'mts-numberinput__btn mts-numberinput__btn--dec';
    btnDec.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    btnDec.disabled = this.disabled || this.readonly || (this.min !== null && this.value <= this.min);
    this._bindHold(btnDec, () => this._step(-1));

    /* Prefix */
    if (this.prefix) {
      const pre = document.createElement('span');
      pre.className = 'mts-numberinput__prefix';
      pre.textContent = this.prefix;
      wrap.appendChild(pre);
    }

    /* Input */
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'mts-numberinput__input';
    input.value = this._formatDisplay(this.value);
    input.placeholder = this.placeholder;
    input.disabled = this.disabled;
    input.readOnly = this.readonly;
    input.inputMode = 'decimal';
    this._input = input;

    input.addEventListener('focus', (e) => {
      if (this._error) this.clearError();   // auto-clear while editing
      /* Mostrar valor numÃ©rico puro al editar */
      input.value = (this.value == null || this.value === 0) ? '' : String(this.value);
      input.select();
      wrap.classList.add('mts-numberinput__wrap--focus');
      this._emit('focus', { event: e });
    });
    input.addEventListener('blur', (e) => {
      const raw = input.value.trim();
      if (raw === '') {
        this.value = null;   // empty input → not entered
      } else {
        const parsed = parseFloat(raw.replace(/[^0-9.,-]/g, '').replace(',', '.'));
        this.value = this._clamp(isNaN(parsed) ? (this.value == null ? null : this.value) : parsed);
      }
      input.value = this._formatDisplay(this.value);
      wrap.classList.remove('mts-numberinput__wrap--focus');
      this._updateBtns();
      this._emit('change', { value: this.value, formatted: this._formatDisplay(this.value) });
      this._emit('blur', { event: e });
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp')   { e.preventDefault(); this._step(1);  }
      if (e.key === 'ArrowDown') { e.preventDefault(); this._step(-1); }
      if (e.key === 'Enter')     { input.blur(); }
    });

    /* BotÃ³n + */
    const btnInc = document.createElement('button');
    btnInc.type = 'button';
    btnInc.className = 'mts-numberinput__btn mts-numberinput__btn--inc';
    btnInc.innerHTML = '<svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    btnInc.disabled = this.disabled || this.readonly || (this.max !== null && this.value >= this.max);
    this._bindHold(btnInc, () => this._step(1));

    this._btnDec = btnDec;
    this._btnInc = btnInc;

    wrap.appendChild(btnDec);
    wrap.appendChild(input);

    /* Suffix */
    if (this.suffix) {
      const suf = document.createElement('span');
      suf.className = 'mts-numberinput__suffix';
      suf.textContent = this.suffix;
      wrap.appendChild(suf);
    }

    wrap.appendChild(btnInc);
    this._wrap = wrap;
    this._el.appendChild(wrap);

    /* Hint */
    if (this.hint) {
      const hint = document.createElement('div');
      hint.className = 'mts-numberinput__hint';
      hint.textContent = this.hint;
      this._el.appendChild(hint);
    }

    /* Error */
    const errorEl = document.createElement('div');
    errorEl.className = 'mts-numberinput__error';
    this._errorEl = errorEl;
    this._el.appendChild(errorEl);
    this._renderError();
  }

  _step(dir) {
    const newVal = this._clamp(
      parseFloat((this.value + dir * this.step).toFixed(this.decimals + 2))
    );
    if (newVal === this.value) return;
    this.value = newVal;
    if (this._input) this._input.value = this._formatDisplay(this.value);
    this._updateBtns();
    this._emit('change', { value: this.value, formatted: this._formatDisplay(this.value) });
    /* Flash visual */
    this._wrap?.classList.add('mts-numberinput__wrap--active');
    setTimeout(() => this._wrap?.classList.remove('mts-numberinput__wrap--active'), 120);
  }

  _clamp(v) {
    if (v == null || isNaN(v)) return v;
    if (this.min !== null && v < this.min) return this.min;
    if (this.max !== null && v > this.max) return this.max;
    return parseFloat(v.toFixed(this.decimals + 2));
  }

  _formatDisplay(v) {
    if (v == null || v === '') return '';   // empty render for "not entered"
    if (this.format === 'currency') {
      return new Intl.NumberFormat(this.locale, {
        style: 'currency', currency: this.currency,
        minimumFractionDigits: this.decimals,
        maximumFractionDigits: this.decimals,
      }).format(v);
    }
    if (this.format === 'percent') {
      return new Intl.NumberFormat(this.locale, {
        style: 'percent',
        minimumFractionDigits: this.decimals,
        maximumFractionDigits: this.decimals,
      }).format(v / 100);
    }
    return new Intl.NumberFormat(this.locale, {
      minimumFractionDigits: this.decimals,
      maximumFractionDigits: this.decimals,
    }).format(v);
  }

  _updateBtns() {
    if (!this._btnDec || !this._btnInc) return;
    this._btnDec.disabled = this.disabled || this.readonly || (this.min !== null && this.value <= this.min);
    this._btnInc.disabled = this.disabled || this.readonly || (this.max !== null && this.value >= this.max);
  }

  _renderError() {
    if (!this._errorEl) return;
    this._errorEl.textContent = this._error;
    this._errorEl.style.display = this._error ? 'block' : 'none';
    this._wrap?.classList.toggle('mts-numberinput__wrap--error', !!this._error);
  }

  /* Hold â€” mantener presionado acelera */
  _bindHold(btn, fn) {
    const start = () => {
      fn();
      this._holdTimer = setTimeout(() => {
        this._holdInterval = setInterval(fn, 80);
      }, 400);
    };
    const stop = () => {
      clearTimeout(this._holdTimer);
      clearInterval(this._holdInterval);
    };
    btn.addEventListener('mousedown', start);
    btn.addEventListener('touchstart', (e) => { e.preventDefault(); start(); });
    ['mouseup','mouseleave','touchend'].forEach(ev => btn.addEventListener(ev, stop));
    btn.addEventListener('click', (e) => e.stopPropagation());
  }
  _emit(event, detail) {
    var listeners = this._listeners[event] || [];
    if (event === 'change') {
      listeners.forEach(function(fn) { fn(detail.value, detail.formatted); });
    } else {
      listeners.forEach(function(fn) { fn({ type: event, detail: detail }); });
    }
    if (this._el) {
      this._el.dispatchEvent(new CustomEvent('mts:numberinput:' + event, { bubbles: true, detail: detail }));
    }
  }
};

