/* ============================================================
   MATIOS UI â€” matios-ui-input.js
   MTS.Input â€” Input, Textarea con validaciÃ³n y estados
   Eventos DOM: mts:input:change | mts:input:focus | mts:input:blur | mts:input:validate
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Input = class MtsInput {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {string}   options.type        'text'|'email'|'password'|'number'|'textarea' â€” default: 'text'
   * @param {string}   options.label       Label del campo
   * @param {string}   options.placeholder
   * @param {string}   options.hint        Texto de ayuda debajo del input
   * @param {string}   options.value       Valor inicial
   * @param {boolean}  options.required    Campo obligatorio
   * @param {boolean}  options.disabled
   * @param {boolean}  options.readonly
   * @param {string}   options.iconLeft    SVG string del Ã­cono izquierdo
   * @param {string}   options.iconRight   SVG string del Ã­cono derecho
   * @param {boolean}  options.clearable   BotÃ³n Ã— para limpiar
   * @param {boolean}  options.showPassword Toggle para mostrar contraseÃ±a
   * @param {number}   options.maxLength
   * @param {boolean}  options.showCount   Muestra contador de caracteres
   * @param {number}   options.rows        Para textarea â€” default: 4
   * @param {string}   options.resize      Para textarea â€” 'none' | 'vertical' | 'horizontal' | 'both'. Default: 'vertical' (mismo que default del browser).
   * @param {object}   options.rules       Reglas de validaciÃ³n { required, min, max, minLength, maxLength, pattern, custom }
   * @param {boolean}  options.selectOnFocus   Selecciona todo el texto al recibir foco — default: false
   * @param {boolean}  options.nextOnEnter     Enter mueve el foco al siguiente input en el DOM — default: false. No aplica a textarea
   * @param {boolean}  options.validateOnBlur
   * @param {boolean}  options.validateOnInput
   * @param {function} options.onChange
   * @param {function} options.onFocus
   * @param {function} options.onBlur
   */
  constructor(selector, options = {}) {
    this._container = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._container) { console.error('[MTS.Input] No encontrado:', selector); return; }
    /* â”€â”€ data-* â†’ inicializaciÃ³n HTML declarativa â”€â”€ */
    const _ds = this._container?.dataset || {};
    const _fromHTML = {};
    if (_ds.type !== undefined) _fromHTML.type = _ds.type;
    if (_ds.label !== undefined) _fromHTML.label = _ds.label;
    if (_ds.placeholder !== undefined) _fromHTML.placeholder = _ds.placeholder;
    if (_ds.hint !== undefined) _fromHTML.hint = _ds.hint;
    if (_ds.value !== undefined) _fromHTML.value = _ds.value;
    if (_ds.name !== undefined) _fromHTML.name = _ds.name;
    if (_ds.required !== undefined) _fromHTML.required = true;
    if (_ds.disabled !== undefined) _fromHTML.disabled = true;
    if (_ds.readonly !== undefined) _fromHTML.readonly = true;
    if (_ds.clearable !== undefined) _fromHTML.clearable = true;
    if (_ds.showPassword !== undefined) _fromHTML.showPassword = true;
    if (_ds.showCount !== undefined) _fromHTML.showCount = true;
    if (_ds.maxLength !== undefined) _fromHTML.maxLength = parseInt(_ds.maxLength);
    if (_ds.rows          !== undefined) _fromHTML.rows          = parseInt(_ds.rows);
    if (_ds.selectOnFocus !== undefined) _fromHTML.selectOnFocus = true;
    if (_ds.nextOnEnter   !== undefined) _fromHTML.nextOnEnter   = true;
    options = { ..._fromHTML, ...options };


    this.type            = options.type           || 'text';
    this.label           = options.label          || '';
    this.placeholder     = options.placeholder    || '';
    this.hint            = options.hint           || '';
    this.value           = options.value          ?? '';
    this.required        = options.required       ?? false;
    this.errorMessage    = options.errorMessage    ?? null;
    this.disabled        = options.disabled       ?? false;
    this.readonly        = options.readonly       ?? false;
    this.iconLeft        = options.iconLeft       || null;
    this.iconRight       = options.iconRight      || null;
    this.clearable       = options.clearable      ?? false;
    this.showPassword    = options.showPassword   ?? (this.type === 'password');
    this.maxLength       = options.maxLength      || null;
    this.showCount       = options.showCount      ?? false;
    this.rows            = options.rows           ?? 4;
    /* T-COMPANY-WUI-PHASE-J (2026-06-13): control de redimensionado para textarea.
       Acepta 'none' | 'vertical' | 'horizontal' | 'both'. Default 'vertical' preserva
       el comportamiento previo del browser. Solo aplica cuando type='textarea'. */
    {
      const _r = (options.resize != null) ? String(options.resize).toLowerCase() : 'vertical';
      this.resize = (_r === 'none' || _r === 'vertical' || _r === 'horizontal' || _r === 'both') ? _r : 'vertical';
    }
    this.name            = options.name           || null;
    this.autocomplete    = options.autocomplete   ?? null;
    this.selectOnFocus   = options.selectOnFocus  ?? false;
    this.nextOnEnter     = options.nextOnEnter    ?? false;
    this.rules           = options.rules          || {};
    this.renderMode      = options.renderMode     || 'auto';
    this.validateOnBlur  = options.validateOnBlur  ?? true;
    this.validateOnInput = options.validateOnInput ?? false;
    this._listeners      = {};
    this._isValid        = true;
    this._errors         = [];

    if (options.onChange)   this.on('change',   options.onChange);
    if (options.onFocus)    this.on('focus',    options.onFocus);
    if (options.onBlur)     this.on('blur',     options.onBlur);
    if (options.onValidate) this.on('validate', options.onValidate);

    this._build();
    this._bindEvents();
    this._container._mtsInstance = this;
  }

  /* API */
  getValue()          { return this._inputEl?.value ?? ''; }
  setValue(val)       { if (this._inputEl) { this._inputEl.value = val; this._updateCount(); } return this; }
  clear()             { this.setValue(''); this.clearError(); return this; }
  focus()             { this._inputEl?.focus(); return this; }
  disable()           { this._inputEl && (this._inputEl.disabled = true); this._wrapEl?.classList.add('mts-input-wrap--disabled'); return this; }
  enable()            { this._inputEl && (this._inputEl.disabled = false); this._wrapEl?.classList.remove('mts-input-wrap--disabled'); return this; }
  isValid()           { return this._isValid; }

  validate() {
    const val    = this.getValue();
    this._errors = [];
    const r      = this.rules;

    if ((this.required || r.required) && !val.trim()) this._errors.push(this.errorMessage || this._t('required', 'This field is required'));
    if (r.minLength && val.length < r.minLength) this._errors.push(this._t('minLength', 'Minimum {n} characters').replace('{n}', r.minLength));
    if (r.maxLength && val.length > r.maxLength) this._errors.push(this._t('maxLength', 'Maximum {n} characters').replace('{n}', r.maxLength));
    if (r.min !== undefined && Number(val) < r.min) this._errors.push(this._t('min', 'Minimum value: {n}').replace('{n}', r.min));
    if (r.max !== undefined && Number(val) > r.max) this._errors.push(this._t('max', 'Maximum value: {n}').replace('{n}', r.max));
    if (r.pattern && val && !r.pattern.test(val)) this._errors.push(r.patternMessage || this._t('pattern', 'Invalid format'));
    if (r.email && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) this._errors.push(this._t('email', 'Invalid email'));
    if (r.custom) { const msg = r.custom(val); if (msg) this._errors.push(msg); }

    this._isValid = this._errors.length === 0;
    this._renderValidation();
    this._emit('validate', { valid: this._isValid, errors: this._errors });
    return this._isValid;
  }

  setError(msg) {
    this._isValid = false;
    this._errors  = [msg];
    this._renderValidation();
    return this;
  }

  clearError() {
    this._isValid = true;
    this._errors  = [];
    this._renderValidation();
    return this;
  }

  /* Localized message lookup — MTS.Input → messages namespace; falls back to the given default. */
  _t(key, fallback) {
    try {
      const ns = (typeof window !== 'undefined' && window.MTS && MTS.getLocale) ? MTS.getLocale()['MTS.Input'] : null;
      const m  = ns && ns.messages;
      if (m && m[key] != null) return m[key];
    } catch (e) {}
    return fallback;
  }

  on(event, cb)  { if (!this._listeners[event]) this._listeners[event] = []; this._listeners[event].push(cb); return this; }
  off(event, cb) { this._listeners[event] = (this._listeners[event] || []).filter(f => f !== cb); return this; }
  destroy()      { this._container.innerHTML = ''; }

  /* Build */
  _build() {
    const explicitFieldOnly = this.renderMode === 'field-only';
    const explicitStandalone = this.renderMode === 'standalone';
    /* Si el padre ya es mts-form-group (layout HTML), este elemento
       actÃºa solo como wrapper del campo â€” no crea otro mts-form-group */
    const parentIsGroup = this._container.parentElement?.classList.contains('mts-form-group');
    const fieldOnly = explicitFieldOnly || (!explicitStandalone && parentIsGroup);
    if (fieldOnly) {
      this._container.classList.add(...this._getWrapClasses());
      this._container.innerHTML = '';
      const tag = this.type === 'textarea' ? 'textarea' : 'input';
      this._inputEl = document.createElement(tag);
      this._inputEl.className   = this.type === 'textarea' ? 'mts-textarea' : 'mts-input';
      this._inputEl.placeholder = this.placeholder;
      this._inputEl.disabled    = this.disabled;
      this._inputEl.readOnly    = this.readonly;
      this._inputEl.value       = this.value;
      if (this.type !== 'textarea') this._inputEl.type = this.type === 'password' ? 'password' : this.type;
      if (this.name)      this._inputEl.name = this.name;
      if (this.maxLength)     this._inputEl.maxLength   = this.maxLength;
      if (this.autocomplete) this._inputEl.setAttribute('autocomplete', this.autocomplete);
      if (this.type === 'textarea') {
        this._inputEl.rows = this.rows;
        /* T-COMPANY-WUI-PHASE-J (2026-06-13): aplica el modo de resize del textarea. */
        this._inputEl.style.resize = this.resize;
      }
      this._container.appendChild(this._inputEl);
      this._wrapEl = this._container;
      this._feedbackEl = document.createElement('span');
      this._feedbackEl.className = 'mts-form-hint';
      if (this.hint) this._feedbackEl.textContent = this.hint;
      this._container.after(this._feedbackEl);
      return;
    }

    this._container.innerHTML = '';

    if (this.label) {
      const lbl = document.createElement('label');
      lbl.className   = 'mts-label' + (this.required ? ' mts-label--required' : '');
      lbl.textContent = this.label;
      this._container.appendChild(lbl);
    }

    const wrap = document.createElement('div');
    wrap.classList.add(...this._getWrapClasses());

    if (this.iconLeft) {
      const ic = document.createElement('span');
      ic.className  = 'mts-input__icon mts-input__icon--left';
      ic.innerHTML  = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(this.iconLeft) : this.iconLeft;
      wrap.appendChild(ic);
    }

    const tag = this.type === 'textarea' ? 'textarea' : 'input';
    this._inputEl = document.createElement(tag);
    this._inputEl.className   = this.type === 'textarea' ? 'mts-textarea' : 'mts-input';
    this._inputEl.placeholder = this.placeholder;
    this._inputEl.disabled    = this.disabled;
    this._inputEl.readOnly    = this.readonly;
    this._inputEl.value       = this.value;
    if (this.type !== 'textarea') this._inputEl.type = this.type === 'password' ? 'password' : this.type;
    if (this.name) this._inputEl.name = this.name;
    if (this.maxLength)    this._inputEl.maxLength   = this.maxLength;
    if (this.autocomplete) this._inputEl.setAttribute('autocomplete', this.autocomplete);
    if (this.type === 'textarea') this._inputEl.rows = this.rows;
    wrap.appendChild(this._inputEl);

    if (this.clearable) {
      this._clearBtn = document.createElement('button');
      this._clearBtn.className = 'mts-input__icon mts-input__icon--right mts-input__clear';
      this._clearBtn.setAttribute('aria-label', this._t('clear', 'Clear'));
      this._clearBtn.innerHTML = '&times;';
      this._clearBtn.style.display = 'none';
      this._clearBtn.addEventListener('click', () => this.clear());
      wrap.appendChild(this._clearBtn);
    }

    if (this.type === 'password' && this.showPassword) {
      this._eyeBtn = document.createElement('button');
      this._eyeBtn.className = 'mts-input__icon mts-input__icon--right mts-input__eye';
      this._eyeBtn.setAttribute('aria-label', this._t('showPassword', 'Show password'));
      // TODO: reemplazar con MTS.Icons cuando estÃ©n listos
      this._eyeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
      this._eyeBtn.addEventListener('click', () => {
        const show = this._inputEl.type === 'password';
        this._inputEl.type = show ? 'text' : 'password';
        this._eyeBtn.classList.toggle('mts-input__eye--active', show);
      });
      wrap.appendChild(this._eyeBtn);
    }

    if (this.iconRight && !this.clearable && !this.showPassword) {
      const ic = document.createElement('span');
      ic.className = 'mts-input__icon mts-input__icon--right';
      ic.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(this.iconRight) : this.iconRight;
      wrap.appendChild(ic);
    }

    this._container.appendChild(wrap);
    this._wrapEl = wrap;

    if (this.showCount) {
      this._countEl = document.createElement('span');
      this._countEl.className = 'mts-input__count';
      this._updateCount();
      this._container.appendChild(this._countEl);
    }

    this._feedbackEl = document.createElement('span');
    this._feedbackEl.className = 'mts-form-hint';
    if (this.hint) this._feedbackEl.textContent = this.hint;
    this._container.appendChild(this._feedbackEl);

    /* Registrar instancia en el elemento para que MTS.Validate pueda detectarla */
    if (this._inputEl) this._inputEl.__mtsInput = this;
  }

  _getWrapClasses() {
    const classes = ['mts-input-wrap'];
    if (this.iconLeft) classes.push('mts-input-wrap--icon-left');
    if (this.iconRight || this.clearable || this.showPassword) classes.push('mts-input-wrap--icon-right');
    if (this.disabled) classes.push('mts-input-wrap--disabled');
    return classes;
  }

  _bindEvents() {
    this._inputEl.addEventListener('input', (e) => {
      if (this._clearBtn) {
        const disp = e.target.value ? 'flex' : 'none';
        if (this._clearBtn.style.display !== disp) this._clearBtn.style.display = disp;   // idempotent
      }
      this._updateCount();
      if (this.validateOnInput) this.validate();
      this._emit('change', { value: e.target.value });
    });
    this._inputEl.addEventListener('keydown', (e) => {
      if (this.nextOnEnter && e.key === 'Enter' && this.type !== 'textarea') {
        e.preventDefault();
        var next = this._findNextInput();
        if (next) next.focus();
      }
    });
    this._inputEl.addEventListener('focus', () => {
      this._wrapEl.classList.add('mts-input-wrap--focus');
      if (this.selectOnFocus && this.type !== 'password') {
        setTimeout(() => {
          // only select if still the focused element (avoid acting on a stale/blurred node)
          if (this._inputEl && document.activeElement === this._inputEl) this._inputEl.select();
        }, 0);
      }
      this._emit('focus', { value: this.getValue() });
    });
    this._inputEl.addEventListener('blur', () => {
      this._wrapEl.classList.remove('mts-input-wrap--focus');
      if (this.validateOnBlur) this.validate();
      this._emit('blur', { value: this.getValue() });
    });
  }

  _findNextInput() {
    var all = Array.from(document.querySelectorAll(
      'input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])'
    )).filter(function(el) { return el.offsetParent !== null; });
    var idx = all.indexOf(this._inputEl);
    return (idx !== -1 && idx < all.length - 1) ? all[idx + 1] : null;
  }

  _updateCount() {
    if (!this._countEl) return;
    const len = this.getValue().length;
    this._countEl.textContent = this.maxLength ? `${len}/${this.maxLength}` : len;
  }

  _renderValidation() {
    if (!this._wrapEl || !this._feedbackEl) return;
    this._wrapEl.classList.toggle('mts-input-wrap--error', !this._isValid);
    this._wrapEl.classList.remove('mts-input-wrap--success');
    // Idempotent writes: only touch the DOM when the value actually changes, so a repeated
    // validate() (focus/blur cycles) can't emit redundant mutations that feed an observer loop.
    const cls = this._isValid ? 'mts-form-hint' : 'mts-form-error';
    const txt = this._isValid ? (this.hint || '') : (this._errors[0] || '');
    if (this._feedbackEl.className   !== cls) this._feedbackEl.className   = cls;
    if (this._feedbackEl.textContent !== txt) this._feedbackEl.textContent = txt;
  }

  _emit(event, detail = {}) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, target: this, detail }));
    this._inputEl?.dispatchEvent(new CustomEvent(`mts:input:${event}`, { bubbles: true, detail: { input: this, ...detail } }));
  }
};

