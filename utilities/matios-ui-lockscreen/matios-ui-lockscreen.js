/* ============================================================
   MATIOS UI — matios-ui-lockscreen.js  v1.0.0
   MTS.LockScreen — Overlay full-screen de re-autenticación in-place
   (estilo lock screen de Windows/macOS).

   SOLO UI + eventos: NO sabe de auth, endpoints ni sesión. Delega la
   verificación vía onUnlock(password, done). El consumidor (shell)
   re-autentica y llama done(ok[, msgError]). Mismo patrón que MTS.SessionTimeout.

   Dependencias: MTS.Avatar, MTS.Input, MTS.Button (+ i18n propio).

   Uso básico:
     let lock = new MTS.LockScreen({
       userName: 'Pedro Gómez',
       avatarUrl: '/uploads/u/123.jpg',
       onUnlock: function (password, done) {
         reauth(password)
           .then(function () { done(true); })
           .catch(function () { done(false); });   // o done(false, 'Clave incorrecta')
       },
       onForgot: function () { goToReset(); },
     });
     lock.show();
   ============================================================ */

window.MTS = window.MTS || {};

MTS.LockScreen = class MtsLockScreen {

  constructor(options) {
    options = options || {};

    this.userName    = options.userName    || '';
    this.avatarUrl   = options.avatarUrl   || null;
    this.initials    = options.initials    || null;
    this.avatarColor = options.avatarColor || null;
    this.showForgot  = options.showForgot !== undefined ? !!options.showForgot : true;

    // Overrides de texto por instancia; si faltan, salen del i18n (NUNCA hardcode)
    this._msg = options.messages || {};

    this._onUnlock  = typeof options.onUnlock === 'function' ? options.onUnlock : null;
    this._onForgot  = typeof options.onForgot === 'function' ? options.onForgot : null;

    this._listeners = {};
    this._visible   = false;
    this._busy      = false;

    this._build();
    if (options.autoShow) this.show();
  }

  /* ── i18n: messages[key] (instancia) → locale → fallback ── */
  _t(key, fallback) {
    if (this._msg[key] != null) return this._msg[key];
    try {
      const ns = (window.MTS && MTS.getLocale) ? MTS.getLocale()['MTS.LockScreen'] : null;
      const m  = ns && ns.messages;
      if (m && m[key] != null) return m[key];
    } catch (e) {}
    return fallback;
  }

  /* ── Eventos ── */
  on(event, cb) { if (!this._listeners[event]) this._listeners[event] = []; this._listeners[event].push(cb); return this; }
  off(event, cb) { this._listeners[event] = (this._listeners[event] || []).filter(function (f) { return f !== cb; }); return this; }
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(function (fn) { fn({ type: event, detail: detail }); });
    if (this._el) this._el.dispatchEvent(new CustomEvent('mts:lockscreen:' + event, { bubbles: true, detail: detail }));
  }

  /* ── Build ── */
  _build() {
    const self = this;

    const el = document.createElement('div');
    el.className = 'mts-lockscreen';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.hidden = true;
    this._el = el;

    const card = document.createElement('div');
    card.className = 'mts-lockscreen__card';
    el.appendChild(card);

    /* Avatar (foto o iniciales+color, como el topbar) */
    this._avWrap = document.createElement('div');
    this._avWrap.className = 'mts-lockscreen__avatar';
    card.appendChild(this._avWrap);
    this._renderAvatar();

    /* Título · nombre · subtítulo */
    this._titleEl = document.createElement('div');
    this._titleEl.className = 'mts-lockscreen__title';
    this._titleEl.textContent = this._t('title', 'Sesión bloqueada');
    card.appendChild(this._titleEl);

    this._nameEl = document.createElement('div');
    this._nameEl.className = 'mts-lockscreen__name';
    this._nameEl.textContent = this.userName;
    card.appendChild(this._nameEl);

    this._subEl = document.createElement('div');
    this._subEl.className = 'mts-lockscreen__subtitle';
    this._subEl.textContent = this._t('subtitle', 'Ingresa tu clave para continuar');
    card.appendChild(this._subEl);

    /* Campo de clave */
    const pwWrap = document.createElement('div');
    pwWrap.className = 'mts-lockscreen__field';
    card.appendChild(pwWrap);
    this._pw = new MTS.Input(pwWrap, {
      type:         'password',
      placeholder:  this._t('passwordPlaceholder', 'Clave'),
      autocomplete: 'browser-off',
      maxLength:    255,
    });
    this._pwEl = pwWrap.querySelector('input');
    if (this._pwEl) {
      this._pwEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); self._submit(); }
      });
    }

    /* Error inline */
    this._errEl = document.createElement('div');
    this._errEl.className = 'mts-form-error mts-lockscreen__error';
    this._errEl.setAttribute('aria-live', 'polite');
    this._errEl.style.display = 'none';
    card.appendChild(this._errEl);

    /* Botón Ingresar */
    const btnWrap = document.createElement('div');
    btnWrap.className = 'mts-lockscreen__btn';
    card.appendChild(btnWrap);
    this._btn = new MTS.Button(btnWrap, { label: this._t('btnUnlock', 'Ingresar'), variant: 'primary' });
    this._btn.on('click', function () { self._submit(); });

    /* Olvidé mi clave */
    if (this.showForgot) {
      this._forgotEl = document.createElement('button');
      this._forgotEl.type = 'button';
      this._forgotEl.className = 'mts-lockscreen__forgot';
      this._forgotEl.textContent = this._t('forgot', 'Olvidé mi clave');
      this._forgotEl.addEventListener('click', function () {
        self._emit('forgot', {});
        if (self._onForgot) self._onForgot();
      });
      card.appendChild(this._forgotEl);
    }

    /* Focus trap dentro del overlay */
    el.addEventListener('keydown', function (e) { self._onKeydown(e); });

    document.body.appendChild(el);
  }

  _renderAvatar() {
    this._avatar = new MTS.Avatar(this._avWrap, {
      src:      this.avatarUrl,
      name:     this.userName,
      initials: this.initials,
      color:    this.avatarColor,
      size:     'xl',
    });
  }

  _onKeydown(e) {
    if (e.key !== 'Tab') return;
    const f = this._focusables();
    if (!f.length) return;
    const first = f[0];
    const last  = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  _focusables() {
    const sel = 'input:not([disabled]), button:not([disabled]), a[href]';
    return Array.prototype.slice.call(this._el.querySelectorAll(sel))
      .filter(function (n) { return n.offsetParent !== null; });
  }

  /* ── API ── */
  show() {
    if (this._visible) return this;
    const self = this;
    this._el.hidden = false;
    document.body.classList.add('mts-lockscreen-open');   // bloquea scroll de fondo
    this._visible = true;
    this.clearError();
    requestAnimationFrame(function () {
      self._el.classList.add('mts-lockscreen--visible');
      if (self._pwEl) self._pwEl.focus();
    });
    this._emit('shown', {});
    return this;
  }

  hide() {
    if (!this._visible) return this;
    this._el.classList.remove('mts-lockscreen--visible');
    this._el.hidden = true;
    document.body.classList.remove('mts-lockscreen-open');
    this._visible = false;
    this._emit('hidden', {});
    return this;
  }

  setBusy(busy) {
    this._busy = !!busy;
    if (this._btn && this._btn.setLoading) this._btn.setLoading(this._busy);
    if (this._pwEl) this._pwEl.disabled = this._busy;
    return this;
  }

  setError(msg) {
    if (!this._errEl) return this;
    this._errEl.textContent = msg || '';
    this._errEl.style.display = msg ? '' : 'none';
    return this;
  }

  clearError() { return this.setError(''); }

  setUser(u) {
    u = u || {};
    if (u.userName    !== undefined) { this.userName    = u.userName || '';  if (this._nameEl) this._nameEl.textContent = this.userName; }
    if (u.avatarUrl   !== undefined) this.avatarUrl   = u.avatarUrl || null;
    if (u.initials    !== undefined) this.initials    = u.initials || null;
    if (u.avatarColor !== undefined) this.avatarColor = u.avatarColor || null;
    this._renderAvatar();   // recrea avatar (foto/iniciales/color) in-place
    return this;
  }

  _submit() {
    if (this._busy) return;
    const self = this;
    const pw = (this._pw && this._pw.getValue) ? this._pw.getValue() : (this._pwEl ? this._pwEl.value : '');
    this.clearError();
    this._emit('unlock', { password: pw });

    if (!this._onUnlock) return;

    let settled = false;
    this.setBusy(true);
    this._onUnlock(pw, function (ok, msg) {
      if (settled) return;   // done() idempotente
      settled = true;
      self.setBusy(false);
      if (self._pw && self._pw.setValue) self._pw.setValue('');
      if (ok) {
        self.hide();
      } else {
        self.setError(msg || self._t('errorInvalid', 'Clave incorrecta'));
        if (self._pwEl) self._pwEl.focus();
      }
    });
  }

  destroy() {
    document.body.classList.remove('mts-lockscreen-open');
    if (this._el && this._el.parentNode) this._el.parentNode.removeChild(this._el);
    this._listeners = {};
  }
};
