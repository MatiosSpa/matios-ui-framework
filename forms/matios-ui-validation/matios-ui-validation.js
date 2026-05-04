/* ============================================================
   MATIOS UI — matios-ui-validation.js  v1.0.0
   MTS.Validate — Validación de formularios sin dependencias.
   Inspirado en jQuery Validation, API propia.

   Uso:
     var v = new MTS.Validate('#mi-form', {
       rules: {
         nombre:  { required: true, minLength: 3 },
         email:   { required: true, email: true },
         edad:    { required: true, min: 18, max: 99 },
         pass:    { required: true, minLength: 8, pattern: /(?=.*\d)(?=.*[a-z])/ },
         pass2:   { required: true, equalTo: '#pass' },
         archivo: { required: true, accept: 'image/*', maxSize: 2 }
       },
       messages: {
         nombre: { required: 'El nombre es obligatorio', minLength: 'Mínimo 3 caracteres' }
       },
       onValid:   function(data)   { enviarFormulario(data); },
       onInvalid: function(errors) { console.log('Errores:', errors); }
     });

     v.validate()                        → boolean
     v.isValid()                         → boolean
     v.getErrors()                       → { campo: 'mensaje', ... }
     v.getData()                         → { campo: valor, ... }
     v.clearErrors()
     v.setError('email', 'Ya existe')    // error server-side
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Validate = function MtsValidate(selectorOrForm, options) {
  options = options || {};

  this._form = typeof selectorOrForm === 'string'
    ? document.querySelector(selectorOrForm)
    : selectorOrForm;
  if (!this._form) { console.error('[MTS.Validate] Form no encontrado:', selectorOrForm); return; }

  // Validation rules per field / Reglas de validación por campo
  this.rules = options.rules || {};

  // Custom error messages per field and rule / Mensajes de error personalizados
  this.messages = options.messages || {};

  // Fires when form is valid on submit / Se dispara cuando el formulario es válido al enviar
  this.onValid = options.onValid || null;

  // Fires when form has errors on submit / Se dispara cuando el formulario tiene errores al enviar
  this.onInvalid = options.onInvalid || null;

  // Validate when field loses focus / Validar al perder foco
  this.validateOnBlur = (options.validateOnBlur !== undefined && options.validateOnBlur !== null)
    ? options.validateOnBlur : true;

  // Validate on every keystroke / Validar en cada tecla
  this.validateOnInput = (options.validateOnInput !== undefined && options.validateOnInput !== null)
    ? options.validateOnInput : false;

  this._errors  = {};
  this._touched = {};

  this._build();
};

/* ============================================================
   API PÚBLICA
   ============================================================ */

/** Valida el formulario completo. Retorna true si es válido. */
MTS.Validate.prototype.validate = function() {
  var self = this;
  var i, name, el, error, fname, fel, firstField;
  this._errors = {};
  var fields = Object.keys(this.rules);

  for (i = 0; i < fields.length; i++) {
    name = fields[i];
    el   = this._getField(name);
    if (!el) continue;
    error = this._validateField(name, el);
    if (error) this._errors[name] = error;
  }

  for (i = 0; i < fields.length; i++) {
    fname = fields[i];
    fel   = this._getField(fname);
    if (!fel) continue;
    if (this._errors[fname]) {
      this._showError(fel, this._errors[fname]);
    } else {
      this._clearFieldError(fel);
      this._showSuccess(fel);
    }
  }

  var valid = Object.keys(this._errors).length === 0;
  if (valid) {
    if (self.onValid) self.onValid(this.getData());
  } else {
    if (self.onInvalid) self.onInvalid(this._errors);
    firstField = this._getField(Object.keys(this._errors)[0]);
    if (firstField) {
      firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstField.focus();
    }
  }
  return valid;
};

MTS.Validate.prototype.isValid = function() {
  return Object.keys(this._errors).length === 0;
};

MTS.Validate.prototype.getErrors = function() {
  var copy = {}, key;
  for (key in this._errors) {
    if (this._errors.hasOwnProperty(key)) copy[key] = this._errors[key];
  }
  return copy;
};

/** Recopilar valores de todos los campos */
MTS.Validate.prototype.getData = function() {
  var data = {};
  var elements = this._form.querySelectorAll('input, select, textarea');
  var i, el;
  for (i = 0; i < elements.length; i++) {
    el = elements[i];
    if (!el.name) continue;
    if (el.type === 'checkbox') {
      data[el.name] = el.checked;
    } else if (el.type === 'radio') {
      if (el.checked) data[el.name] = el.value;
    } else if (el.type === 'file') {
      data[el.name] = el.files;
    } else {
      data[el.name] = el.value;
    }
  }
  return data;
};

/** Limpiar todos los errores visualmente */
MTS.Validate.prototype.clearErrors = function() {
  var i;
  this._errors = {};
  var errorEls = this._form.querySelectorAll('.mts-validation-error');
  for (i = 0; i < errorEls.length; i++) errorEls[i].remove();
  var stateEls = this._form.querySelectorAll('.mts-input-error, .mts-input-success');
  for (i = 0; i < stateEls.length; i++) {
    stateEls[i].classList.remove('mts-input-error', 'mts-input-success');
  }
};

/** Establecer un error manualmente (para errores del servidor) */
MTS.Validate.prototype.setError = function(fieldName, message) {
  this._errors[fieldName] = message;
  var el = this._getField(fieldName);
  if (el) this._showError(el, message);
};

/** Agregar regla programáticamente */
MTS.Validate.prototype.addRule = function(fieldName, rule, message) {
  if (!this.rules[fieldName]) this.rules[fieldName] = {};
  this.rules[fieldName][rule] = true;
  if (message) {
    if (!this.messages[fieldName]) this.messages[fieldName] = {};
    this.messages[fieldName][rule] = message;
  }
};

/* ============================================================
   SETUP
   ============================================================ */

MTS.Validate.prototype._build = function() {
  var self = this;
  var fields = Object.keys(this.rules);

  this._form.addEventListener('submit', function(e) {
    e.preventDefault();
    self.validate();
  });

  for (var i = 0; i < fields.length; i++) {
    (function(name) {
      var el = self._getField(name);
      if (!el) return;

      if (self.validateOnBlur) {
        el.addEventListener('blur', function() {
          if (!self._touched[name]) return;
          var err = self._validateField(name, el);
          if (err) { self._showError(el, err); self._errors[name] = err; }
          else     { self._clearFieldError(el); self._showSuccess(el); delete self._errors[name]; }
        });
      }

      if (self.validateOnInput) {
        el.addEventListener('input', function() {
          if (!self._touched[name]) return;
          var err = self._validateField(name, el);
          if (err) { self._showError(el, err); self._errors[name] = err; }
          else     { self._clearFieldError(el); delete self._errors[name]; }
        });
      }

      el.addEventListener('focus', function() { self._touched[name] = true; });
    })(fields[i]);
  }
};

/* ============================================================
   VALIDACIÓN — reglas
   ============================================================ */

MTS.Validate.prototype._validateField = function(name, el) {
  var rules    = this.rules[name] || {};
  var value    = this._getValue(el);
  var msgs     = this.messages[name] || {};
  var ruleNames = Object.keys(rules);
  var i, rule, param, result;

  for (i = 0; i < ruleNames.length; i++) {
    rule   = ruleNames[i];
    param  = rules[rule];
    result = this._applyRule(rule, param, value, el);
    if (result !== true) {
      return msgs[rule] || result;
    }
  }
  return null;
};

MTS.Validate.prototype._applyRule = function(rule, param, value, el) {
  var str     = String(value !== undefined && value !== null ? value : '').trim();
  var num     = parseFloat(str);
  var isEmpty = str === '' || value === null || value === undefined;
  var i, clean, body, dv, sum, mul, expected, dvCalc;
  var target, targetVal, rx, sizeMB, accepted, a, ok, file, lname, la, res;

  switch (rule) {

    case 'required':
      if (!param) return true;
      if (el.type === 'checkbox') return el.checked ? true : 'Este campo es obligatorio.';
      if (el.type === 'file')     return (el.files && el.files.length > 0) ? true : 'Selecciona un archivo.';
      return !isEmpty ? true : 'Este campo es obligatorio.';

    case 'minLength':
      if (isEmpty) return true;
      return str.length >= param ? true : 'Mínimo ' + param + ' caracteres.';

    case 'maxLength':
      return str.length <= param ? true : 'Máximo ' + param + ' caracteres.';

    case 'min':
      if (isEmpty) return true;
      return num >= param ? true : 'El valor mínimo es ' + param + '.';

    case 'max':
      if (isEmpty) return true;
      return num <= param ? true : 'El valor máximo es ' + param + '.';

    case 'email':
      if (!param || isEmpty) return true;
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str) ? true : 'Ingresa un email válido.';

    case 'url':
      if (!param || isEmpty) return true;
      try { new URL(str); return true; } catch(ex) { return 'Ingresa una URL válida.'; }

    case 'number':
      if (!param || isEmpty) return true;
      return (!isNaN(num) && str !== '') ? true : 'Ingresa un número válido.';

    case 'integer':
      if (!param || isEmpty) return true;
      return Number.isInteger(Number(str)) ? true : 'Ingresa un número entero.';

    case 'pattern':
      if (isEmpty) return true;
      rx = param instanceof RegExp ? param : new RegExp(param);
      return rx.test(str) ? true : 'El formato no es válido.';

    case 'equalTo':
      if (isEmpty) return true;
      target    = document.querySelector(param);
      if (!target) return true;
      targetVal = String(target.value !== undefined && target.value !== null ? target.value : '').trim();
      return str === targetVal ? true : 'Los valores no coinciden.';

    case 'rut':
      if (!param || isEmpty) return true;
      clean = str.replace(/[.\-]/g, '').toUpperCase();
      if (clean.length < 2) return 'RUT inválido.';
      body = clean.slice(0, -1);
      dv   = clean.slice(-1);
      sum  = 0;
      mul  = 2;
      for (i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i]) * mul;
        mul  = mul === 7 ? 2 : mul + 1;
      }
      expected = 11 - (sum % 11);
      dvCalc   = expected === 11 ? '0' : (expected === 10 ? 'K' : String(expected));
      return dv === dvCalc ? true : 'RUT inválido.';

    case 'phone':
      if (!param || isEmpty) return true;
      return /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{3,4}$/.test(str)
        ? true : 'Ingresa un teléfono válido.';

    case 'date':
      if (!param || isEmpty) return true;
      return !isNaN(Date.parse(str)) ? true : 'Ingresa una fecha válida.';

    case 'minDate':
      if (isEmpty) return true;
      return new Date(str) >= new Date(param) ? true : 'La fecha mínima es ' + param + '.';

    case 'maxDate':
      if (isEmpty) return true;
      return new Date(str) <= new Date(param) ? true : 'La fecha máxima es ' + param + '.';

    case 'accept':
      if (!param || !el.files || !el.files.length) return true;
      file     = el.files[0];
      accepted = param.split(',');
      ok       = false;
      for (i = 0; i < accepted.length; i++) {
        a = accepted[i].trim();
        if (a.slice(-2) === '/*') {
          if (file.type.indexOf(a.slice(0, -2)) === 0) { ok = true; break; }
        } else if (a.charAt(0) === '.') {
          lname = file.name.toLowerCase();
          la    = a.toLowerCase();
          if (lname.slice(lname.length - la.length) === la) { ok = true; break; }
        } else if (file.type === a) { ok = true; break; }
      }
      return ok ? true : 'Tipo de archivo no permitido. Acepta: ' + param;

    case 'maxSize':
      if (!el.files || !el.files.length) return true;
      sizeMB = el.files[0].size / 1024 / 1024;
      return sizeMB <= param ? true : 'El archivo no puede superar ' + param + 'MB.';

    case 'custom':
      if (typeof param !== 'function') return true;
      res = param(value, el);
      return res === true ? true : (res || 'Valor inválido.');

    default:
      return true;
  }
};

/* ============================================================
   HELPERS DOM
   ============================================================ */

MTS.Validate.prototype._getField = function(name) {
  return this._form.querySelector('[name="' + name + '"]')
    || this._form.querySelector('#' + name);
};

MTS.Validate.prototype._getMtsInstance = function(el) {
  if (!el) return null;
  return el.__mtsInput || el.__mtsSelect || null;
};

MTS.Validate.prototype._getValue = function(el) {
  if (el.type === 'checkbox') return el.checked;
  if (el.type === 'radio') {
    var checked = this._form.querySelector('[name="' + el.name + '"]:checked');
    return checked ? checked.value : null;
  }
  return el.value;
};

MTS.Validate.prototype._showError = function(el, message) {
  this._clearFieldError(el);
  var mts = this._getMtsInstance(el);
  if (mts && mts.setError) { mts.setError(message); return; }
  el.classList.add('mts-input-error');
  el.classList.remove('mts-input-success');
  var wrap = el.closest('.mts-form-group') || el.parentElement;
  var span = document.createElement('span');
  span.className = 'mts-validation-error mts-form-error';
  span.textContent = message;
  wrap.appendChild(span);
};

MTS.Validate.prototype._showSuccess = function(el) {
  var mts = this._getMtsInstance(el);
  if (mts && mts.clearError) { mts.clearError(); return; }
  el.classList.add('mts-input-success');
  el.classList.remove('mts-input-error');
};

MTS.Validate.prototype._clearFieldError = function(el) {
  var i;
  var mts = this._getMtsInstance(el);
  if (mts && mts.clearError) { mts.clearError(); return; }
  el.classList.remove('mts-input-error', 'mts-input-success');
  var wrap = el.closest('.mts-form-group') || el.parentElement;
  if (wrap) {
    var errorEls = wrap.querySelectorAll('.mts-validation-error');
    for (i = 0; i < errorEls.length; i++) errorEls[i].remove();
  }
};

/* ── Helpers de reglas rápidas ── */
MTS.Validate.rules = {
  required:  function(msg)    { return { required:  true, messages: { required:  msg } }; },
  email:     function(msg)    { return { email:     true, messages: { email:     msg } }; },
  minLength: function(n, msg) { return { minLength: n,   messages: { minLength: msg } }; },
  maxLength: function(n, msg) { return { maxLength: n,   messages: { maxLength: msg } }; },
  min:       function(n, msg) { return { min:       n,   messages: { min:       msg } }; },
  max:       function(n, msg) { return { max:       n,   messages: { max:       msg } }; }
};
