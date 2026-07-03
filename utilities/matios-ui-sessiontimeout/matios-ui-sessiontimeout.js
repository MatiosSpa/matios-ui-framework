/* ============================================================
   MATIOS UI — matios-ui-sessiontimeout.js  v1.0.0
   MTS.SessionTimeout — Gestión de timeout de sesión por inactividad.
   Muestra una barra de progreso fija en el borde inferior y un modal
   de advertencia configurable cuando el tiempo está por vencer.

   Dependencias: MTS.Progress, MTS.Modal

   Uso básico:
     new MTS.SessionTimeout({
       timeoutMinutes: 30,
       warningMinutes: 5,
       onRefresh: function(done) { renovarToken(); done(); },
       onExpire:  function()     { logout(); },
     });
   ============================================================ */

window.MTS = window.MTS || {};

MTS.SessionTimeout = class MtsSessionTimeout {

  /* ── Constructor ── */

  /* ── i18n helper ── */

  _t(key, fallback) {
    const strings = (window.MTS && typeof MTS.getString === 'function' && MTS.getString()) || {};
    const ns      = strings['MTS.SessionTimeout'] || {};
    return ns[key] != null ? ns[key] : fallback;
  }

  constructor(options) {
    options = options || {};

    const MSG_DEFAULTS = {
      title:      this._t('title',      'Your session is about to expire'),
      body:       this._t('body',       'Due to inactivity, your session will close in {time}.'),
      warning:    this._t('warning',    'If you have unsaved work, you could lose it.'),
      btnRefresh: this._t('btnRefresh', 'Renew session'),
      btnExpire:  this._t('btnExpire',  'Sign out'),
    };

    const userMsg        = options.messages || {};
    this._msg            = {
      title:      userMsg.title      || MSG_DEFAULTS.title,
      body:       userMsg.body       !== undefined ? userMsg.body      : MSG_DEFAULTS.body,
      warning:    userMsg.warning    !== undefined ? userMsg.warning   : MSG_DEFAULTS.warning,
      btnRefresh: userMsg.btnRefresh || MSG_DEFAULTS.btnRefresh,
      btnExpire:  userMsg.btnExpire  || MSG_DEFAULTS.btnExpire,
    };

    this._timeoutMs  = (options.timeoutMinutes !== undefined ? options.timeoutMinutes : 30) * 60 * 1000;
    this._warningMs  = (options.warningMinutes !== undefined ? options.warningMinutes : 5)  * 60 * 1000;

    // Icon name (MTS.Icon) shown next to the modal title / Nombre de ícono junto al título del modal
    this._titleIcon  = options.titleIcon !== undefined ? options.titleIcon : 'alert-triangle';

    // Title text — falls back to messages.title / Texto del título — usa messages.title si no se especifica
    this._titleText  = options.titleText !== undefined ? options.titleText : this._msg.title;

    this._onRefresh  = options.onRefresh || null;
    this._onExpire   = options.onExpire  || null;

    this._endTime      = 0;
    this._tickInterval = null;
    this._warningShown = false;
    this._refreshing   = false;
    this._modal        = null;
    this._countdownEl  = null;
    this._progressBar  = null;
    this._barContainer = null;

    this._buildBar();
    this._start();
  }

  /* ══════════════════════════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════════════════════════ */

  /** Resetea el timer al máximo. Cierra el modal si estaba abierto. */
  reset() {
    this._warningShown = false;
    this._refreshing   = false;
    this._endTime      = Date.now() + this._timeoutMs;
    if (this._modal) {
      this._modal.hide();
      this._modal = null;
    }
    if (this._progressBar) {
      this._progressBar.setValue(100, false);
    }
  }

  /** Muestra el modal de advertencia inmediatamente (útil para testing y demo). */
  showWarning() {
    if (this._warningShown) return;
    this._openWarningModal();
  }

  /** Destruye el componente, limpia timers y remueve la barra del DOM. */
  destroy() {
    this._stopTick();
    if (this._modal) {
      this._modal.hide();
      this._modal = null;
    }
    if (this._barContainer && this._barContainer.parentNode) {
      this._barContainer.parentNode.removeChild(this._barContainer);
    }
    this._barContainer = null;
    this._progressBar  = null;
    this._countdownEl  = null;
  }

  /* ══════════════════════════════════════════════════════════════
     BARRA DE PROGRESO
  ══════════════════════════════════════════════════════════════ */

  _buildBar() {
    const container = document.createElement('div');
    container.className = 'mts-session-timeout';

    this._progressBar = new MTS.Progress(container, {
      type:    'bar',
      size:    'xs',
      variant: 'primary',
      value:   100,
      rounded: false,
    });

    document.body.appendChild(container);
    this._barContainer = container;
  }

  /* ══════════════════════════════════════════════════════════════
     TIMER
  ══════════════════════════════════════════════════════════════ */

  _start() {
    const self = this;
    this._endTime      = Date.now() + this._timeoutMs;
    this._tickInterval = setInterval(function() { self._tick(); }, 1000);
  }

  _stopTick() {
    if (this._tickInterval) {
      clearInterval(this._tickInterval);
      this._tickInterval = null;
    }
  }

  _tick() {
    const remaining = this._remainingMs();
    const pct       = (remaining / this._timeoutMs) * 100;

    this._progressBar.setValue(Math.max(0, pct), false);

    if (this._countdownEl) {
      this._countdownEl.textContent = this._formatTime(remaining);
    }

    if (this._warningMs > 0 && !this._warningShown && remaining <= this._warningMs) {
      this._openWarningModal();
    }

    if (remaining <= 0) {
      this._expire();
    }
  }

  _remainingMs() {
    return Math.max(0, this._endTime - Date.now());
  }

  _formatTime(ms) {
    const totalSec = Math.ceil(ms / 1000);
    const min      = Math.floor(totalSec / 60);
    const sec      = totalSec % 60;
    return min + ':' + (sec < 10 ? '0' : '') + sec;
  }

  /* ══════════════════════════════════════════════════════════════
     MODAL DE ADVERTENCIA
  ══════════════════════════════════════════════════════════════ */

  _buildModalTitle() {
    let wrap = document.createElement('span');
    wrap.className = 'mts-session-timeout__title';
    if (this._titleIcon) {
      let icon = document.createElement('i');
      icon.className = 'mts-icon mts-icon-' + this._titleIcon;
      wrap.appendChild(icon);
      wrap.appendChild(document.createTextNode(' '));
    }
    wrap.appendChild(document.createTextNode(this._titleText));
    return wrap;
  }

  _openWarningModal() {
    this._warningShown = true;
    const self         = this;
    const bodyEl       = this._buildModalBody();

    this._modal = new MTS.Modal({
      title:    this._buildModalTitle(),
      body:     bodyEl,
      size:     'sm',
      radius:   'xl',
      static:   true,
      closable: false,
      buttons:  [
        {
          label:   this._msg.btnRefresh,
          variant: 'primary',
          close:   false,
          onClick: function() { self._onRefreshClick(); },
        },
        {
          label:   this._msg.btnExpire,
          variant: 'ghost',
          close:   false,
          onClick: function() { self._expire(); },
        },
      ],
    });

    this._modal.show();
    if (window.MTS && MTS.Icon) { MTS.Icon.initAll(); }
  }

  _buildModalBody() {
    const bodyEl   = document.createElement('div');
    const parts    = this._msg.body.split('{time}');

    /* Párrafo principal con countdown inline */
    const textEl = document.createElement('p');
    textEl.className = 'mts-session-timeout__body-text';

    if (parts[0]) {
      textEl.appendChild(document.createTextNode(parts[0]));
    }

    this._countdownEl           = document.createElement('span');
    this._countdownEl.className = 'mts-session-timeout__countdown';
    this._countdownEl.textContent = this._formatTime(this._remainingMs());
    textEl.appendChild(this._countdownEl);

    if (parts.length > 1 && parts[1]) {
      textEl.appendChild(document.createTextNode(parts[1]));
    }

    bodyEl.appendChild(textEl);

    /* Párrafo de advertencia */
    if (this._msg.warning) {
      const warnEl           = document.createElement('p');
      warnEl.className       = 'mts-session-timeout__warning';
      warnEl.textContent     = this._msg.warning;
      bodyEl.appendChild(warnEl);
    }

    return bodyEl;
  }

  /* ══════════════════════════════════════════════════════════════
     ACCIONES
  ══════════════════════════════════════════════════════════════ */

  _onRefreshClick() {
    if (this._refreshing) return;
    this._refreshing = true;
    const self       = this;

    function done() { self.reset(); }

    if (this._onRefresh) {
      this._onRefresh(done);
    } else {
      done();
    }
  }

  _expire() {
    this._stopTick();
    if (this._modal) {
      this._modal.hide();
      this._modal = null;
    }
    if (this._onExpire) {
      this._onExpire();
    }
  }

};
