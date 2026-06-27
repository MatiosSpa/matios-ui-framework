/* ============================================================
   MATIOS UI — MTS.OTP
   Input de código de un solo uso (OTP / PIN / código de verificación)
   API: new MTS.OTP(el, options)
   ============================================================ */
(function (global) {
  'use strict';

  /* ── Constructor ─────────────────────────────────────────── */

  function OTP(el, options) {
    this._el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this._el) { return; }

    options = options || {};

    this._length      = Math.min(Math.max(parseInt(options.length) || 6, 1), 9);
    this._type        = options.type === 'alphanumeric' ? 'alphanumeric' : 'numeric';
    this._timer       = options.timer ? parseInt(options.timer) : null;
    this._disabled    = options.disabled === true;
    /* Form-field contract */
    this._required     = options.required === true;
    this._errorMessage = options.errorMessage != null ? options.errorMessage : null;

    this._onComplete  = typeof options.onComplete === 'function' ? options.onComplete : null;
    this._onExpire    = typeof options.onExpire   === 'function' ? options.onExpire   : null;
    this._onChange    = typeof options.onChange   === 'function' ? options.onChange   : null;
    this._onResend    = typeof options.onResend   === 'function' ? options.onResend   : null;
    this._resendLabel = options.resendLabel || 'Reenviar código';

    this._listeners        = {};
    this._inputs           = [];
    this._timerEl          = null;
    this._resendEl         = null;
    this._errorEl          = null;
    this._timerInterval    = null;
    this._timerRemaining   = this._timer;
    this._expired          = false;

    this._build();
    this._bindEvents();

    if (this._timer)    { this._startTimer(); }
    if (this._disabled) { this._applyDisabled(true); }

    this._el._mtsInstance = this;
  }

  /* ── API pública ─────────────────────────────────────────── */

  OTP.prototype.getValue = function () {
    return this._inputs.map(function (inp) { return inp.value; }).join('');
  };

  OTP.prototype.isComplete = function () {
    return this.getValue().length === this._length;
  };

  OTP.prototype.reset = function () {
    clearInterval(this._timerInterval);
    this._expired          = false;
    this._timerRemaining   = this._timer;

    this._inputs.forEach(function (inp) {
      inp.value = '';
      inp.classList.remove('mts-otp__box--filled');
    });

    this.clearError();
    this._applyDisabled(this._disabled);

    if (this._timerEl) {
      this._timerEl.classList.remove('mts-otp__timer--expired');
    }
    if (this._resendEl && this._timer) { this._resendEl.style.display = 'none'; }
    if (this._timer) { this._startTimer(); }

    if (this._inputs[0]) { this._inputs[0].focus(); }
    return this;
  };

  OTP.prototype.setError = function (msg) {
    this._root.classList.add('mts-otp--error');
    if (this._errorEl) { this._errorEl.textContent = msg || ''; }
    return this;
  };

  OTP.prototype.clearError = function () {
    this._root.classList.remove('mts-otp--error');
    if (this._errorEl) { this._errorEl.textContent = ''; }
    return this;
  };

  /* Form-field contract: required = the code must be complete. */
  OTP.prototype.validate = function () {
    let ok = !this._required || this.isComplete();
    if (ok) { this.clearError(); }
    else    { this.setError(this._errorMessage || this._t('required', 'This field is required')); }
    this._emit('validate', { valid: ok, errors: ok ? [] : [(this._errorEl && this._errorEl.textContent) || ''] });
    return ok;
  };

  OTP.prototype._t = function (key, fallback) {
    try {
      let ns = (global.MTS && global.MTS.getLocale) ? global.MTS.getLocale()['MTS.OTP'] : null;
      let m  = ns && ns.messages;
      if (m && m[key] != null) { return m[key]; }
    } catch (e) {}
    return fallback;
  };

  OTP.prototype.focus = function () {
    let first = null;
    for (let i = 0; i < this._inputs.length; i++) {
      if (!this._inputs[i].value) { first = this._inputs[i]; break; }
    }
    (first || this._inputs[0]).focus();
    return this;
  };

  OTP.prototype.disable = function () {
    this._disabled = true;
    this._applyDisabled(true);
    return this;
  };

  OTP.prototype.enable = function () {
    this._disabled = false;
    if (!this._expired) { this._applyDisabled(false); }
    return this;
  };

  OTP.prototype.on = function (event, cb) {
    if (!this._listeners[event]) { this._listeners[event] = []; }
    this._listeners[event].push(cb);
    return this;
  };

  OTP.prototype.off = function (event, cb) {
    this._listeners[event] = (this._listeners[event] || []).filter(function (fn) { return fn !== cb; });
    return this;
  };

  OTP.prototype.destroy = function () {
    clearInterval(this._timerInterval);
    this._el.innerHTML = '';
  };

  /* ── Build ───────────────────────────────────────────────── */

  OTP.prototype._build = function () {
    this._el.innerHTML = '';

    this._root = document.createElement('div');
    this._root.className = 'mts-otp';

    // Cajas
    let boxesEl = document.createElement('div');
    boxesEl.className = 'mts-otp__boxes';

    for (let i = 0; i < this._length; i++) {
      let inp = document.createElement('input');
      inp.type = 'text';
      inp.className = 'mts-otp__box';
      inp.maxLength = 1;
      inp.setAttribute('inputmode',      this._type === 'numeric' ? 'numeric' : 'text');
      inp.setAttribute('autocomplete',   'one-time-code');
      inp.setAttribute('autocorrect',    'off');
      inp.setAttribute('autocapitalize', 'off');
      inp.setAttribute('spellcheck',     'false');
      inp.setAttribute('aria-label',     'Código ' + (i + 1) + ' de ' + this._length);
      this._inputs.push(inp);
      boxesEl.appendChild(inp);
    }

    this._root.appendChild(boxesEl);

    // Timer
    this._timerEl = document.createElement('div');
    this._timerEl.className = 'mts-otp__timer';
    this._timerEl.style.display = this._timer ? '' : 'none';
    if (this._timer) { this._renderTimer(); }
    this._root.appendChild(this._timerEl);

    // Error
    this._errorEl = document.createElement('div');
    this._errorEl.className = 'mts-otp__error';
    this._root.appendChild(this._errorEl);

    // Resend link — solo si se pasó onResend
    if (this._onResend) {
      let resendBtn = document.createElement('button');
      resendBtn.type = 'button';
      resendBtn.className = 'mts-otp__resend';
      resendBtn.textContent = this._resendLabel;
      // Con timer: oculto mientras corre; sin timer: siempre visible
      resendBtn.style.display = this._timer ? 'none' : '';
      this._resendEl = resendBtn;
      this._root.appendChild(resendBtn);
    }

    this._el.appendChild(this._root);
  };

  /* ── Eventos ─────────────────────────────────────────────── */

  OTP.prototype._bindEvents = function () {
    let self = this;

    this._inputs.forEach(function (inp, idx) {

      inp.addEventListener('focus', function () {
        inp.select();
      });

      inp.addEventListener('keydown', function (e) {
        if (self._expired || self._disabled) { return; }

        if (e.key === 'Backspace') {
          e.preventDefault();
          if (inp.value) {
            inp.value = '';
            inp.classList.remove('mts-otp__box--filled');
          } else if (idx > 0) {
            self._inputs[idx - 1].value = '';
            self._inputs[idx - 1].classList.remove('mts-otp__box--filled');
            self._inputs[idx - 1].focus();
          }
          self._notifyChange();
          return;
        }

        if (e.key === 'ArrowLeft'  && idx > 0)                      { e.preventDefault(); self._inputs[idx - 1].focus(); }
        if (e.key === 'ArrowRight' && idx < self._inputs.length - 1) { e.preventDefault(); self._inputs[idx + 1].focus(); }
      });

      inp.addEventListener('input', function () {
        if (self._expired || self._disabled) { inp.value = ''; return; }

        let val = self._type === 'numeric'
          ? inp.value.replace(/\D/g, '')
          : inp.value.replace(/[^a-zA-Z0-9]/g, '');

        val = val.slice(0, 1);
        inp.value = val;

        if (val) {
          inp.classList.add('mts-otp__box--filled');
          if (idx < self._inputs.length - 1) { self._inputs[idx + 1].focus(); }
        } else {
          inp.classList.remove('mts-otp__box--filled');
        }

        self.clearError();
        self._notifyChange();
      });

      inp.addEventListener('paste', function (e) {
        if (self._expired || self._disabled) { e.preventDefault(); return; }
        e.preventDefault();

        let text     = (e.clipboardData || window.clipboardData).getData('text');
        let filtered = self._type === 'numeric'
          ? text.replace(/\D/g, '')
          : text.replace(/[^a-zA-Z0-9]/g, '');

        // Siempre llena desde la caja 0
        for (let i = 0; i < self._inputs.length; i++) {
          self._inputs[i].value = filtered[i] || '';
          self._inputs[i].classList.toggle('mts-otp__box--filled', !!filtered[i]);
        }

        // Foco a la siguiente caja vacía o a la última
        let next = Math.min(filtered.length, self._inputs.length - 1);
        self._inputs[next].focus();

        self.clearError();
        self._notifyChange();
      });
    });

    // Resend
    if (this._resendEl) {
      this._resendEl.addEventListener('click', function () {
        if (self._onResend) { self._onResend(self.reset.bind(self)); }
      });
    }
  };

  /* ── Timer ───────────────────────────────────────────────── */

  OTP.prototype._startTimer = function () {
    let self = this;
    this._renderTimer();
    this._timerInterval = setInterval(function () {
      self._timerRemaining--;
      self._renderTimer();
      if (self._timerRemaining <= 0) {
        clearInterval(self._timerInterval);
        self._expired = true;
        self._timerEl.classList.add('mts-otp__timer--expired');
        self._applyDisabled(true);
        if (self._resendEl) { self._resendEl.style.display = ''; }
        self._emit('expire', {});
        if (self._onExpire) { self._onExpire(); }
      }
    }, 1000);
  };

  OTP.prototype._renderTimer = function () {
    if (!this._timerEl) { return; }
    let s  = Math.max(0, this._timerRemaining);
    let mm = Math.floor(s / 60);
    let ss = s % 60;
    this._timerEl.textContent = mm > 0
      ? mm + ':' + (ss < 10 ? '0' : '') + ss
      : ss + 's';
  };

  /* ── Helpers ─────────────────────────────────────────────── */

  OTP.prototype._notifyChange = function () {
    let code     = this.getValue();
    let complete = code.length === this._length;
    if (this._onChange) { this._onChange(code, complete); }
    this._emit('change', { code: code, complete: complete });
    if (complete) {
      if (this._onComplete) { this._onComplete(code); }
      this._emit('complete', { code: code });
    }
  };

  OTP.prototype._applyDisabled = function (disabled) {
    this._inputs.forEach(function (inp) { inp.disabled = disabled; });
    this._root.classList.toggle('mts-otp--disabled', disabled);
  };

  OTP.prototype._emit = function (event, detail) {
    (this._listeners[event] || []).forEach(function (fn) { fn({ type: event, detail: detail }); });
    this._el.dispatchEvent(new CustomEvent('mts:otp:' + event, { bubbles: true, detail: detail }));
  };

  /* ── Registro ────────────────────────────────────────────── */

  if (!global.MTS) { global.MTS = {}; }
  global.MTS.OTP = OTP;

}(window));
