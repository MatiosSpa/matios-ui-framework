/* ============================================================
   MATIOS UI — matios-ui-validation.js  v1.0.0
   MTS.Validate — Validación de formularios sin dependencias.
   Inspirado en jQuery Validation, API propia.

   Uso:
     const v = new MTS.Validate('#mi-form', {
       rules: {
         nombre:   { required: true, minLength: 3 },
         email:    { required: true, email: true },
         edad:     { required: true, min: 18, max: 99 },
         pass:     { required: true, minLength: 8, pattern: /(?=.*\d)(?=.*[a-z])/ },
         pass2:    { required: true, equalTo: '#pass' },
         archivo:  { required: true, accept: 'image/*', maxSize: 2 },   // MB
       },
       messages: {
         nombre:   { required: 'El nombre es obligatorio', minLength: 'Mínimo 3 caracteres' },
       },
       onValid:   (data) => enviarFormulario(data),
       onInvalid: (errors) => console.log('Errores:', errors),
     })

     v.validate()           → boolean
     v.isValid()            → boolean
     v.getErrors()          → { campo: 'mensaje', ... }
     v.getData()            → { campo: valor, ... }
     v.clearErrors()
     v.setError('email', 'Ya existe este email')   // error server-side
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Validate = class MtsValidate {

  constructor(selectorOrForm, options = {}) {
    this._form = typeof selectorOrForm === 'string'
      ? document.querySelector(selectorOrForm)
      : selectorOrForm;
    if (!this._form) { console.error('[MTS.Validate] Form no encontrado:', selectorOrForm); return; }

    this.rules    = options.rules    || {};
    this.messages = options.messages || {};
    this.onValid   = options.onValid   || null;
    this.onInvalid = options.onInvalid || null;
    this.validateOnBlur  = options.validateOnBlur  ?? true;
    this.validateOnInput = options.validateOnInput ?? false;
    this._errors  = {};
    this._touched = {};

    this._build();
  }

  /* ============================================================
     API PÚBLICA
     ============================================================ */

  /** Valida el formulario completo. Retorna true si es válido. */
  validate() {
    this._errors = {};
    const fields = Object.keys(this.rules);

    fields.forEach(name => {
      const el = this._getField(name);
      if (!el) return;
      const error = this._validateField(name, el);
      if (error) this._errors[name] = error;
    });

    /* Mostrar / limpiar errores */
    fields.forEach(name => {
      const el = this._getField(name);
      if (!el) return;
      if (this._errors[name]) {
        this._showError(el, this._errors[name]);
      } else {
        this._clearFieldError(el);
        this._showSuccess(el);
      }
    });

    const valid = Object.keys(this._errors).length === 0;
    if (valid) {
      this.onValid?.(this.getData());
    } else {
      this.onInvalid?.(this._errors);
      /* Scroll al primer error */
      const firstErrorField = this._getField(Object.keys(this._errors)[0]);
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstErrorField?.focus();
    }
    return valid;
  }

  isValid()   { return Object.keys(this._errors).length === 0; }
  getErrors() { return { ...this._errors }; }

  /** Recopilar valores de todos los campos */
  getData() {
    const data = {};
    const elements = this._form.querySelectorAll('input, select, textarea');
    elements.forEach(el => {
      if (!el.name) return;
      if (el.type === 'checkbox') {
        data[el.name] = el.checked;
      } else if (el.type === 'radio') {
        if (el.checked) data[el.name] = el.value;
      } else if (el.type === 'file') {
        data[el.name] = el.files;
      } else {
        data[el.name] = el.value;
      }
    });
    return data;
  }

  /** Limpiar todos los errores visualmente */
  clearErrors() {
    this._errors = {};
    this._form.querySelectorAll('.mts-validation-error').forEach(el => el.remove());
    this._form.querySelectorAll('.mts-input-error, .mts-input-success').forEach(el => {
      el.classList.remove('mts-input-error', 'mts-input-success');
    });
  }

  /** Establecer un error manualmente (para errores del servidor) */
  setError(fieldName, message) {
    this._errors[fieldName] = message;
    const el = this._getField(fieldName);
    if (el) this._showError(el, message);
  }

  /** Agregar regla programáticamente */
  addRule(fieldName, rule, message) {
    if (!this.rules[fieldName]) this.rules[fieldName] = {};
    this.rules[fieldName][rule] = true;
    if (message) {
      if (!this.messages[fieldName]) this.messages[fieldName] = {};
      this.messages[fieldName][rule] = message;
    }
  }

  /* ============================================================
     SETUP
     ============================================================ */

  _build() {
    /* Prevenir submit nativo y validar */
    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.validate();
    });

    /* Bind onBlur y onInput por campo */
    Object.keys(this.rules).forEach(name => {
      const el = this._getField(name);
      if (!el) return;

      if (this.validateOnBlur) {
        el.addEventListener('blur', () => {
          if (!this._touched[name]) return;
          const error = this._validateField(name, el);
          if (error) { this._showError(el, error); this._errors[name] = error; }
          else       { this._clearFieldError(el); this._showSuccess(el); delete this._errors[name]; }
        });
      }

      if (this.validateOnInput) {
        el.addEventListener('input', () => {
          if (!this._touched[name]) return;
          const error = this._validateField(name, el);
          if (error) { this._showError(el, error); this._errors[name] = error; }
          else       { this._clearFieldError(el); delete this._errors[name]; }
        });
      }

      el.addEventListener('focus', () => { this._touched[name] = true; });
    });
  }

  /* ============================================================
     VALIDACIÓN — reglas
     ============================================================ */

  _validateField(name, el) {
    const rules = this.rules[name] || {};
    const value = this._getValue(el);
    const msgs  = this.messages[name] || {};

    for (const [rule, param] of Object.entries(rules)) {
      const result = this._applyRule(rule, param, value, el);
      if (result !== true) {
        /* Mensaje personalizado > mensaje por defecto */
        return msgs[rule] || result;
      }
    }
    return null;
  }

  _applyRule(rule, param, value, el) {
    const str  = String(value ?? '').trim();
    const num  = parseFloat(str);
    const isEmpty = str === '' || value === null || value === undefined;

    switch (rule) {

      case 'required':
        if (!param) return true;
        if (el.type === 'checkbox') return el.checked ? true : 'Este campo es obligatorio.';
        if (el.type === 'file')     return el.files?.length > 0 ? true : 'Selecciona un archivo.';
        return !isEmpty ? true : 'Este campo es obligatorio.';

      case 'minLength':
        if (isEmpty) return true;
        return str.length >= param ? true : `Mínimo ${param} caracteres.`;

      case 'maxLength':
        return str.length <= param ? true : `Máximo ${param} caracteres.`;

      case 'min':
        if (isEmpty) return true;
        return num >= param ? true : `El valor mínimo es ${param}.`;

      case 'max':
        if (isEmpty) return true;
        return num <= param ? true : `El valor máximo es ${param}.`;

      case 'email':
        if (!param || isEmpty) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
          ? true : 'Ingresa un email válido.';

      case 'url':
        if (!param || isEmpty) return true;
        try { new URL(str); return true; }
        catch { return 'Ingresa una URL válida.'; }

      case 'number':
        if (!param || isEmpty) return true;
        return !isNaN(num) && str !== '' ? true : 'Ingresa un número válido.';

      case 'integer':
        if (!param || isEmpty) return true;
        return Number.isInteger(Number(str)) ? true : 'Ingresa un número entero.';

      case 'pattern':
        if (isEmpty) return true;
        const rx = param instanceof RegExp ? param : new RegExp(param);
        return rx.test(str) ? true : 'El formato no es válido.';

      case 'equalTo': {
        if (isEmpty) return true;
        const target = document.querySelector(param);
        if (!target) return true;
        const targetVal = String(target.value ?? '').trim();
        return str === targetVal ? true : 'Los valores no coinciden.';
      }

      case 'rut': {
        /* Validación RUT chileno */
        if (!param || isEmpty) return true;
        const clean = str.replace(/[.\-]/g,'').toUpperCase();
        if (clean.length < 2) return 'RUT inválido.';
        const body = clean.slice(0,-1);
        const dv   = clean.slice(-1);
        let sum=0, mul=2;
        for(let i=body.length-1;i>=0;i--,mul=mul===7?2:mul+1) sum+=parseInt(body[i])*mul;
        const expected = 11-(sum%11);
        const dvCalc = expected===11?'0':expected===10?'K':String(expected);
        return dv===dvCalc ? true : 'RUT inválido.';
      }

      case 'phone':
        if (!param || isEmpty) return true;
        return /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{3,4}$/.test(str)
          ? true : 'Ingresa un teléfono válido.';

      case 'date':
        if (!param || isEmpty) return true;
        return !isNaN(Date.parse(str)) ? true : 'Ingresa una fecha válida.';

      case 'minDate': {
        if (isEmpty) return true;
        const d = new Date(str), min = new Date(param);
        return d >= min ? true : `La fecha mínima es ${param}.`;
      }

      case 'maxDate': {
        if (isEmpty) return true;
        const d = new Date(str), max = new Date(param);
        return d <= max ? true : `La fecha máxima es ${param}.`;
      }

      case 'accept': {
        /* Para file inputs — acepta MIME o extensión: 'image/*', '.pdf,.docx' */
        if (!param || !el.files?.length) return true;
        const file = el.files[0];
        const accepted = param.split(',').map(s => s.trim());
        const ok = accepted.some(a => {
          if (a.endsWith('/*')) return file.type.startsWith(a.replace('/*',''));
          if (a.startsWith('.')) return file.name.toLowerCase().endsWith(a.toLowerCase());
          return file.type === a;
        });
        return ok ? true : `Tipo de archivo no permitido. Acepta: ${param}`;
      }

      case 'maxSize': {
        /* param en MB */
        if (!el.files?.length) return true;
        const sizeMB = el.files[0].size / 1024 / 1024;
        return sizeMB <= param ? true : `El archivo no puede superar ${param}MB.`;
      }

      case 'custom':
        /* param es una función (value, el) => true | 'mensaje error' */
        if (typeof param !== 'function') return true;
        const res = param(value, el);
        return res === true ? true : (res || 'Valor inválido.');

      default:
        return true;
    }
  }

  /* ============================================================
     HELPERS DOM
     ============================================================ */

  _getField(name) {
    return this._form.querySelector(`[name="${name}"]`)
      || this._form.querySelector(`#${name}`);
  }

  /* Obtiene la instancia MTS.Input si existe, para usar su API de validación */
  _getMtsInstance(el) {
    if (!el) return null;
    return el.__mtsInput || el.__mtsSelect || null;
  }

  _getValue(el) {
    if (el.type === 'checkbox') return el.checked;
    if (el.type === 'radio') {
      const checked = this._form.querySelector(`[name="${el.name}"]:checked`);
      return checked ? checked.value : null;
    }
    return el.value;
  }

  _showError(el, message) {
    this._clearFieldError(el);
    /* Si es MTS.Input, usar su propia API */
    const mts = this._getMtsInstance(el);
    if (mts?.setError) { mts.setError(message); return; }
    /* Fallback para inputs nativos */
    el.classList.add('mts-input-error');
    el.classList.remove('mts-input-success');
    const wrap = el.closest('.mts-form-group') || el.parentElement;
    const span = document.createElement('span');
    span.className = 'mts-validation-error mts-form-error';
    span.textContent = message;
    wrap.appendChild(span);
  }

  _showSuccess(el) {
    const mts = this._getMtsInstance(el);
    if (mts?.clearError) { mts.clearError(); return; }
    el.classList.add('mts-input-success');
    el.classList.remove('mts-input-error');
  }

  _clearFieldError(el) {
    const mts = this._getMtsInstance(el);
    if (mts?.clearError) { mts.clearError(); return; }
    el.classList.remove('mts-input-error', 'mts-input-success');
    const wrap = el.closest('.mts-form-group') || el.parentElement;
    wrap?.querySelectorAll('.mts-validation-error').forEach(e => e.remove());
  }
};

/* ── Helpers de reglas rápidas ── */
MTS.Validate.rules = {
  required:  (msg) => ({ required: true,  messages: { required:  msg } }),
  email:     (msg) => ({ email:    true,  messages: { email:    msg } }),
  minLength: (n, msg) => ({ minLength: n, messages: { minLength: msg } }),
  maxLength: (n, msg) => ({ maxLength: n, messages: { maxLength: msg } }),
  min:       (n, msg) => ({ min: n,       messages: { min:       msg } }),
  max:       (n, msg) => ({ max: n,       messages: { max:       msg } }),
};
