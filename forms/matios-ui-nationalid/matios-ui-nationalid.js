/* ============================================================
   MATIOS UI — matios-ui-nationalid.js
   MTS.NationalId — Format + validate national / tax IDs per country
   (RUN·RUT, CPF·CNPJ, CUIT, DNI·NIE, RUC, NIT, CI, Cédula, NIF…)

   Two layers:
     · MTS.NationalId          → pure core (no DOM): registry + format + validate
     · MTS.NationalId.Input    → input component (added in the UI layer)

   Add a country at runtime with MTS.NationalId.registerCountry(code, def) — see
   the "REGISTRY — how to add a country" block near the bottom.
   ============================================================ */

window.MTS = window.MTS || {};

MTS.NationalId = (function () {
  'use strict';

  /* Registry of countries, keyed by ISO-2 (uppercase). */
  const COUNTRIES = {};

  /* ── helpers ─────────────────────────────────────────────── */

  function clean(value) {
    /* Keep digits + uppercase letters (some IDs carry a 'K' DV or a leading letter). */
    return String(value == null ? '' : value).toUpperCase().replace(/[^0-9A-Z]/g, '');
  }

  function onlyDigits(value) {
    return String(value == null ? '' : value).replace(/[^0-9]/g, '');
  }

  function allSame(str) {
    return str.length > 0 && /^(.)\1*$/.test(str);
  }

  /* Group a digit string in blocks of `size` from the RIGHT, joined by `sep`. */
  function groupRight(digits, size, sep) {
    let out = '';
    let count = 0;
    for (let i = digits.length - 1; i >= 0; i--) {
      out = digits[i] + out;
      count++;
      if (count % size === 0 && i > 0) out = sep + out;
    }
    return out;
  }

  /* Apply a fixed-length mask of '#' placeholders left-to-right. */
  function maskFixed(digits, mask) {
    let out = '';
    let di = 0;
    for (let i = 0; i < mask.length && di < digits.length; i++) {
      if (mask[i] === '#') out += digits[di++];
      else { out += mask[i]; }
    }
    return out;
  }

  /* Chilean-style mod 11 DV: returns '0'..'9' or 'K'. `body` = digits before the DV. */
  function dvMod11Cl(body) {
    let sum = 0;
    let mul = 2;
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i], 10) * mul;
      mul = mul === 7 ? 2 : mul + 1;
    }
    const res = 11 - (sum % 11);
    if (res === 11) return '0';
    if (res === 10) return 'K';
    return String(res);
  }

  /* ── COUNTRY DEFINITIONS ─────────────────────────────────────
     Each: { name, defaultType, detect?(raw)->typeKey, types:{ key:{
       label, placeholder, maxDigits, format(clean)->string, validate(clean)->{valid,dv?} } } }
     `validate` receives the cleaned value (digits + 'K'/letters, upper-cased).
     ──────────────────────────────────────────────────────────── */

  /* CHILE — RUN (persons) and RUT (companies): same mod-11 algorithm. */
  function clFormat(c) {
    const v = clean(c);
    if (!v) return '';
    const body = v.slice(0, -1).replace(/[^0-9]/g, '');
    const dv = v.slice(-1);
    if (!body) return dv;
    return groupRight(body, 3, '.') + '-' + dv;
  }
  function clValidate(c) {
    const v = clean(c);
    const body = v.slice(0, -1).replace(/[^0-9]/g, '');
    const dv = v.slice(-1);
    if (body.length < 6 || !/^[0-9K]$/.test(dv)) return { valid: false, dv: null };
    return { valid: dvMod11Cl(body) === dv, dv: dv };
  }
  COUNTRIES.CL = {
    name: 'Chile', defaultType: 'rut',
    types: {
      rut: { label: 'RUT', placeholder: '12.345.678-5', maxDigits: 9, format: clFormat, validate: clValidate },
      run: { label: 'RUN', placeholder: '12.345.678-5', maxDigits: 9, format: clFormat, validate: clValidate }
    }
  };

  /* BRAZIL — CPF (persons, 11) and CNPJ (companies, 14). */
  function cpfValidate(c) {
    const d = onlyDigits(c);
    if (d.length !== 11 || allSame(d)) return { valid: false };
    function dig(slice, start) {
      let s = 0;
      for (let i = 0; i < slice; i++) s += parseInt(d[i], 10) * (start - i);
      const r = (s * 10) % 11;
      return r === 10 ? 0 : r;
    }
    return { valid: dig(9, 10) === parseInt(d[9], 10) && dig(10, 11) === parseInt(d[10], 10) };
  }
  function cnpjValidate(c) {
    const d = onlyDigits(c);
    if (d.length !== 14 || allSame(d)) return { valid: false };
    const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    function dig(weights) {
      let s = 0;
      for (let i = 0; i < weights.length; i++) s += parseInt(d[i], 10) * weights[i];
      const r = s % 11;
      return r < 2 ? 0 : 11 - r;
    }
    return { valid: dig(w1) === parseInt(d[12], 10) && dig(w2) === parseInt(d[13], 10) };
  }
  COUNTRIES.BR = {
    name: 'Brazil', defaultType: 'cpf',
    detect: function (raw) { return onlyDigits(raw).length > 11 ? 'cnpj' : 'cpf'; },
    types: {
      cpf: { label: 'CPF', placeholder: '000.000.000-00', maxDigits: 11,
        format: function (c) { return maskFixed(onlyDigits(c), '###.###.###-##'); }, validate: cpfValidate },
      cnpj: { label: 'CNPJ', placeholder: '00.000.000/0000-00', maxDigits: 14,
        format: function (c) { return maskFixed(onlyDigits(c), '##.###.###/####-##'); }, validate: cnpjValidate }
    }
  };

  /* ARGENTINA — CUIT / CUIL (11 digits, mod 11). */
  function cuitValidate(c) {
    const d = onlyDigits(c);
    if (d.length !== 11) return { valid: false, dv: null };
    const w = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let s = 0;
    for (let i = 0; i < 10; i++) s += parseInt(d[i], 10) * w[i];
    let dv = 11 - (s % 11);
    if (dv === 11) dv = 0; else if (dv === 10) dv = 9;
    return { valid: dv === parseInt(d[10], 10), dv: String(dv) };
  }
  COUNTRIES.AR = {
    name: 'Argentina', defaultType: 'cuit',
    types: {
      cuit: { label: 'CUIT/CUIL', placeholder: '20-12345678-6', maxDigits: 11,
        format: function (c) { return maskFixed(onlyDigits(c), '##-########-#'); }, validate: cuitValidate }
    }
  };

  /* SPAIN — DNI/NIF (8 digits + letter) and NIE (X/Y/Z + 7 digits + letter), mod 23. */
  const ES_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';
  function nifValidate(c) {
    let v = clean(c);
    if (!/^[XYZ]?[0-9]{7,8}[A-Z]$/.test(v)) return { valid: false, dv: null };
    const letter = v.slice(-1);
    let num = v.slice(0, -1);
    const map = { X: '0', Y: '1', Z: '2' };
    if (map[num[0]] !== undefined) num = map[num[0]] + num.slice(1);
    const expected = ES_LETTERS[parseInt(num, 10) % 23];
    return { valid: expected === letter, dv: letter };
  }
  COUNTRIES.ES = {
    name: 'Spain', defaultType: 'dni',
    detect: function (raw) { return /^[XYZ]/.test(clean(raw)) ? 'nie' : 'dni'; },
    types: {
      dni: { label: 'DNI/NIF', placeholder: '12345678Z', maxDigits: 9,
        format: function (c) { return clean(c); }, validate: nifValidate },
      nie: { label: 'NIE', placeholder: 'X1234567L', maxDigits: 9,
        format: function (c) { return clean(c); }, validate: nifValidate }
    }
  };

  /* PERU — RUC (11 digits, mod 11). */
  function rucPeValidate(c) {
    const d = onlyDigits(c);
    if (d.length !== 11) return { valid: false, dv: null };
    const w = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let s = 0;
    for (let i = 0; i < 10; i++) s += parseInt(d[i], 10) * w[i];
    let dv = 11 - (s % 11);
    if (dv === 10) dv = 0; else if (dv === 11) dv = 1;
    return { valid: dv === parseInt(d[10], 10), dv: String(dv) };
  }
  COUNTRIES.PE = {
    name: 'Peru', defaultType: 'ruc',
    types: {
      ruc: { label: 'RUC', placeholder: '20123456789', maxDigits: 11,
        format: function (c) { return onlyDigits(c); }, validate: rucPeValidate }
    }
  };

  /* COLOMBIA — NIT (mod 11, prime weights from the right). */
  function nitValidate(c) {
    const d = onlyDigits(c);
    if (d.length < 5) return { valid: false, dv: null };
    const body = d.slice(0, -1);
    const check = parseInt(d.slice(-1), 10);
    const w = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
    let s = 0;
    for (let i = 0; i < body.length; i++) s += parseInt(body[body.length - 1 - i], 10) * w[i];
    const r = s % 11;
    const dv = r > 1 ? 11 - r : r;
    return { valid: dv === check, dv: String(dv) };
  }
  COUNTRIES.CO = {
    name: 'Colombia', defaultType: 'nit',
    types: {
      nit: { label: 'NIT', placeholder: '900.123.456-7', maxDigits: 10,
        format: function (c) { const d = onlyDigits(c); if (d.length < 2) return d; return groupRight(d.slice(0, -1), 3, '.') + '-' + d.slice(-1); },
        validate: nitValidate }
    }
  };

  /* URUGUAY — CI / Cédula (7 digits + check, weights 2987634). */
  function ciUyValidate(c) {
    const d = onlyDigits(c);
    if (d.length < 7) return { valid: false, dv: null };
    const full = d.slice(-8).padStart(8, '0');
    const body = full.slice(0, 7);
    const check = parseInt(full[7], 10);
    const w = [2, 9, 8, 7, 6, 3, 4];
    let s = 0;
    for (let i = 0; i < 7; i++) s += parseInt(body[i], 10) * w[i];
    const dv = (10 - (s % 10)) % 10;
    return { valid: dv === check, dv: String(dv) };
  }
  COUNTRIES.UY = {
    name: 'Uruguay', defaultType: 'ci',
    types: {
      ci: { label: 'CI', placeholder: '1.234.567-2', maxDigits: 8,
        format: function (c) { const d = onlyDigits(c); if (d.length < 2) return d; return groupRight(d.slice(0, -1), 3, '.') + '-' + d.slice(-1); },
        validate: ciUyValidate }
    }
  };

  /* ECUADOR — Cédula (10 digits, mod 10 with 2-1 coefficients). */
  function cedulaEcValidate(c) {
    const d = onlyDigits(c);
    if (d.length !== 10) return { valid: false, dv: null };
    const prov = parseInt(d.slice(0, 2), 10);
    if (prov < 1 || prov > 24) return { valid: false, dv: null };
    let s = 0;
    for (let i = 0; i < 9; i++) {
      let p = parseInt(d[i], 10) * (i % 2 === 0 ? 2 : 1);
      if (p > 9) p -= 9;
      s += p;
    }
    const dv = (10 - (s % 10)) % 10;
    return { valid: dv === parseInt(d[9], 10), dv: String(dv) };
  }
  COUNTRIES.EC = {
    name: 'Ecuador', defaultType: 'cedula',
    types: {
      cedula: { label: 'Cédula', placeholder: '1710034065', maxDigits: 10,
        format: function (c) { return onlyDigits(c); }, validate: cedulaEcValidate }
    }
  };

  /* PORTUGAL — NIF (9 digits, mod 11). */
  function nifPtValidate(c) {
    const d = onlyDigits(c);
    if (d.length !== 9) return { valid: false, dv: null };
    let s = 0;
    for (let i = 0; i < 8; i++) s += parseInt(d[i], 10) * (9 - i);
    let dv = 11 - (s % 11);
    if (dv >= 10) dv = 0;
    return { valid: dv === parseInt(d[8], 10), dv: String(dv) };
  }
  COUNTRIES.PT = {
    name: 'Portugal', defaultType: 'nif',
    types: {
      nif: { label: 'NIF', placeholder: '123 456 789', maxDigits: 9,
        format: function (c) { return groupRight(onlyDigits(c), 3, ' '); }, validate: nifPtValidate }
    }
  };

  /* UNITED STATES — SSN / EIN: format-only (no public checksum). */
  COUNTRIES.US = {
    name: 'United States', defaultType: 'ssn',
    detect: function (raw) { return onlyDigits(raw).length > 9 ? 'ein' : 'ssn'; },
    types: {
      ssn: { label: 'SSN', placeholder: '123-45-6789', maxDigits: 9, formatOnly: true,
        format: function (c) { return maskFixed(onlyDigits(c), '###-##-####'); },
        validate: function (c) { const d = onlyDigits(c); return { valid: d.length === 9 && d.slice(0, 3) !== '000' && d.slice(3, 5) !== '00' && d.slice(5) !== '0000', dv: null }; } },
      ein: { label: 'EIN', placeholder: '12-3456789', maxDigits: 9, formatOnly: true,
        format: function (c) { return maskFixed(onlyDigits(c), '##-#######'); },
        validate: function (c) { return { valid: onlyDigits(c).length === 9, dv: null }; } }
    }
  };

  /* ── REGISTRY — how to add a country ─────────────────────────
     MTS.NationalId.registerCountry('AR', {
       name: 'Argentina',
       defaultType: 'cuit',
       detect: function (raw) { return ... typeKey or null; },   // optional (auto)
       types: {
         cuit: {
           label: 'CUIT',
           placeholder: '20-12345678-6',
           maxDigits: 11,                       // real digit cap (drives truncation)
           format:   function (clean) { return '...'; },
           validate: function (clean) { return { valid: true, dv: '6' }; }
         }
       }
     });
     ──────────────────────────────────────────────────────────── */

  function registerCountry(code, def) {
    COUNTRIES[String(code).toUpperCase()] = def;
    return MTS.NationalId;
  }
  function getCountry(code) { return COUNTRIES[String(code).toUpperCase()] || null; }
  function countries() { return Object.keys(COUNTRIES).sort(); }

  function resolveType(code, value, type) {
    const c = getCountry(code);
    if (!c) return null;
    if (type && type !== 'auto' && c.types[type]) return type;
    if (c.detect) { const t = c.detect(value); if (t && c.types[t]) return t; }
    return c.defaultType || Object.keys(c.types)[0];
  }

  function format(code, value, type) {
    const c = getCountry(code);
    if (!c) return String(value == null ? '' : value);
    const t = resolveType(code, clean(value), type);
    const def = c.types[t];
    return def ? def.format(value) : String(value == null ? '' : value);
  }

  function validate(code, value, type) {
    const cv = clean(value);
    const c = getCountry(code);
    if (!c) return { valid: false, raw: cv, formatted: String(value == null ? '' : value), dv: null, type: null, country: String(code || '').toUpperCase() };
    const t = resolveType(code, cv, type);
    const def = c.types[t];
    const out = def ? def.validate(value) : { valid: false, dv: null };
    return {
      valid: !!out.valid,
      raw: cv,
      formatted: def ? def.format(value) : cv,
      dv: out.dv != null ? out.dv : null,
      type: t,
      country: String(code).toUpperCase()
    };
  }

  return {
    registerCountry: registerCountry,
    getCountry: getCountry,
    countries: countries,
    resolveType: resolveType,
    format: format,
    validate: validate,
    clean: clean,
    onlyDigits: onlyDigits
  };
})();

/* ============================================================
   MTS.NationalId.Input — UI component on top of the pure core
   ============================================================ */

MTS.NationalId.Input = class MtsNationalIdInput {

  /**
   * @param {string|Element} selector  host element (a <div>)
   * @param {object} options
   *   country       ISO-2 (req)        'CL'
   *   type          'auto'|typeKey     'auto'
   *   label         field label
   *   placeholder   override (else the country/type default)
   *   value         initial value
   *   required      boolean
   *   size          'sm'|'md'|'lg'     'md'
   *   disabled      boolean
   *   errorMessage  override of the i18n default ("{doc}" → RUT/CPF/…)
   *   maxLength     override of the derived attribute cap
   *   autocomplete  default 'browser-off'
   *   onChange      function({ raw, formatted, valid, dv, type, country })
   */
  constructor(selector, options) {
    options = options || {};
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) { console.error('[MTS.NationalId.Input] not found:', selector); return; }

    this.country      = String(options.country || 'CL').toUpperCase();
    this.type         = options.type || 'auto';
    this.label        = options.label || '';
    this.placeholder  = options.placeholder != null ? options.placeholder : null;
    this.required     = options.required != null
      ? !!options.required
      : !!(this._el && this._el.dataset && this._el.dataset.required !== undefined);
    this.size         = options.size || 'md';
    this.disabled     = !!options.disabled;
    this.errorMessage = options.errorMessage != null ? options.errorMessage : null;
    this._maxLenOpt   = options.maxLength != null ? options.maxLength : null;
    this._listeners   = {};
    this._raw         = MTS.NationalId.clean(options.value || '');

    if (options.onChange) this.on('change', options.onChange);

    this._build();
  }

  /* ── locale ── */
  _t(key, fallback) {
    try {
      const loc = (window.MTS && MTS.getLocale) ? MTS.getLocale() : null;
      const ns = loc && loc['MTS.NationalId'];
      if (ns && ns[key] != null) return ns[key];
    } catch (e) {}
    return fallback;
  }

  _typeDef() {
    const c = MTS.NationalId.getCountry(this.country);
    if (!c) return null;
    const t = MTS.NationalId.resolveType(this.country, this._raw, this.type);
    return c.types[t] || null;
  }

  _derivedMaxLen() {
    if (this._maxLenOpt != null) return this._maxLenOpt;
    const def = this._typeDef();
    const maxDigits = def && def.maxDigits ? def.maxDigits : 12;
    const sample = MTS.NationalId.format(this.country, '0'.repeat(maxDigits), this.type) || '';
    return sample.length + 2; // formatted length + small buffer (won't block the formatter)
  }

  /* ── build ── */
  _build() {
    const self = this;
    this._el.classList.add('mts-nationalid');
    this._el.innerHTML = ''; // safe: clearing

    if (this.label) {
      const lbl = document.createElement('label');
      lbl.className = 'mts-nationalid__label' + (this.required ? ' mts-nationalid__label--required' : '');
      lbl.textContent = this.label;
      this._el.appendChild(lbl);
      this._labelEl = lbl;
    }

    const wrap = document.createElement('div');
    wrap.className = 'mts-nationalid__wrap mts-nationalid__wrap--' + this.size + (this.disabled ? ' mts-nationalid__wrap--disabled' : '');

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'mts-nationalid__input';
    input.autocomplete = 'off';
    input.placeholder = this.placeholder != null ? this.placeholder : (this._typeDef() ? this._typeDef().placeholder : '');
    input.setAttribute('inputmode', 'text');
    input.maxLength = this._derivedMaxLen();
    if (this.disabled) input.disabled = true;
    input.value = MTS.NationalId.format(this.country, this._raw, this.type);
    wrap.appendChild(input);
    this._el.appendChild(wrap);

    const err = document.createElement('span');
    err.className = 'mts-nationalid__error';
    err.setAttribute('aria-live', 'polite');
    this._el.appendChild(err);

    this._wrapEl = wrap;
    this._input = input;
    this._errEl = err;

    /* a11y: link label/input/error */
    if (!input.id) input.id = 'mts-nid-' + Math.abs(this._hash(String(this.country) + this.label)).toString(36);
    if (this._labelEl) this._labelEl.setAttribute('for', input.id);
    err.id = input.id + '-err';
    input.setAttribute('aria-describedby', err.id);

    /* format-as-you-type with digit-count caret restore */
    input.addEventListener('input', function () { self._onInput(); });
    input.addEventListener('focus', function () { wrap.classList.add('mts-nationalid__wrap--focus'); });
    input.addEventListener('blur',  function () { wrap.classList.remove('mts-nationalid__wrap--focus'); self._validateNow(); });
  }

  _hash(s) { let h = 0; for (let i = 0; i < s.length; i++) { h = (h << 5) - h + s.charCodeAt(i); h |= 0; } return h; }

  _onInput() {
    const input = this._input;
    const caret = input.selectionStart;
    const leftClean = MTS.NationalId.clean(input.value.slice(0, caret)).length;

    let cleaned = MTS.NationalId.clean(input.value);
    const def = this._typeDef();
    if (def && def.maxDigits) cleaned = cleaned.slice(0, def.maxDigits);
    this._raw = cleaned;

    const formatted = MTS.NationalId.format(this.country, cleaned, this.type);
    input.value = formatted;

    /* caret after the same number of significant (alphanumeric) chars */
    let pos = formatted.length;
    if (leftClean <= 0) {
      pos = 0;
    } else {
      let seen = 0;
      for (let i = 0; i < formatted.length; i++) {
        const ch = formatted.charCodeAt(i);
        const isAlnum = (ch >= 48 && ch <= 57) || (ch >= 65 && ch <= 90) || (ch >= 97 && ch <= 122);
        if (isAlnum) { seen++; if (seen === leftClean) { pos = i + 1; break; } }
      }
    }
    try { input.setSelectionRange(pos, pos); } catch (e) {}

    this.clearError(); // limpiar mientras edita; se revalida en blur
    this._emit('change', this.getValue());
  }

  _validateNow() {
    /* Vacío: error sólo si es requerido. */
    if (!this._raw) {
      if (this.required) this.setError(this._t('required', 'Required'));
      else this.clearError();
      return !this.required;
    }
    /* Con contenido: se valida el formato/checksum (sea requerido u opcional). */
    const res = MTS.NationalId.validate(this.country, this._raw, this.type);
    if (!res.valid) {
      const def = this._typeDef();
      const doc = def && def.label ? def.label : 'ID';
      const msg = this.errorMessage != null ? this.errorMessage : this._t('invalid', 'Invalid {doc}').replace('{doc}', doc);
      this.setError(msg);
    } else {
      this.clearError();
    }
    return res.valid;
  }

  /* ── API pública ── */
  getValue() {
    const res = MTS.NationalId.validate(this.country, this._raw, this.type);
    /* Gate de required: vacío es válido salvo que sea requerido. */
    res.valid = this._raw ? res.valid : !this.required;
    return res;
  }
  isValid()  { return this.getValue().valid; }

  /* Form-field contract: validates required + format, renders the error inline and returns the result. */
  validate() {
    const valid = this._validateNow();
    const msg   = (this._errEl && this._errEl.textContent) || '';
    this._emit('validate', { valid: valid, errors: valid ? [] : (msg ? [msg] : []) });
    return valid;
  }

  setValue(v) {
    this._raw = MTS.NationalId.clean(v || '');
    const def = this._typeDef();
    if (def && def.maxDigits) this._raw = this._raw.slice(0, def.maxDigits);
    if (this._input) this._input.value = MTS.NationalId.format(this.country, this._raw, this.type);
    this._emit('change', this.getValue());
    return this;
  }

  setCountry(code) {
    this.country = String(code).toUpperCase();
    this._raw = '';
    this._build();
    return this;
  }

  setError(msg) {
    if (this._wrapEl) this._wrapEl.classList.add('mts-nationalid__wrap--error');
    if (this._input)  this._input.setAttribute('aria-invalid', 'true');
    if (this._errEl)  this._errEl.textContent = msg || '';
    return this;
  }
  clearError() {
    if (this._wrapEl) this._wrapEl.classList.remove('mts-nationalid__wrap--error');
    if (this._input)  this._input.removeAttribute('aria-invalid');
    if (this._errEl)  this._errEl.textContent = '';
    return this;
  }

  on(event, cb)  { (this._listeners[event] = this._listeners[event] || []).push(cb); return this; }
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(function (fn) { fn(detail); });
    if (this._el) this._el.dispatchEvent(new CustomEvent('mts:nationalid:' + event, { bubbles: true, detail: detail }));
  }

  destroy() {
    if (this._el) this._el.innerHTML = ''; // safe: clearing
    this._listeners = {};
  }
};

