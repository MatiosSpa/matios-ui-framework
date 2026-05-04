/* ============================================================
   MATIOS UI — matios-ui-pageloader.js  v1.0.0
   MTS.PageLoader — Indicador de carga de página.

   Modos:
     'bar'     → barra fija en top o bottom
     'blocker' → overlay completo con spinner o progress circle
     'both'    → barra + overlay simultáneos

   Dependencias: MTS.Progress, MTS.Spinner

   Uso básico:
     const loader = new MTS.PageLoader({ mode: 'bar' });
     loader.start();
     loader.done();
   ============================================================ */

window.MTS = window.MTS || {};

MTS.PageLoader = class MtsPageLoader {

  /* ── Constructor ── */

  constructor(options) {
    options = options || {};

    this._mode            = options.mode            || 'bar';
    this._position        = options.position        || 'top';
    this._variant         = options.variant         || 'primary';
    this._minimum         = options.minimum         !== undefined ? options.minimum  : 0.08;
    this._trickle         = options.trickle         !== false;
    this._trickleSpeed    = options.trickleSpeed    || 400;
    this._speed           = options.speed           || 200;
    this._blur            = options.blur            || false;
    this._backdropOpacity = options.backdropOpacity !== undefined ? options.backdropOpacity : 0.85;

    /* Opciones para los componentes internos */
    this._barOpts    = options.bar    || null;
    this._loaderOpts = options.loader || null;

    this._value          = 0;
    this._running        = false;
    this._trickleTimer   = null;

    this._barWrapEl      = null;
    this._blockerEl      = null;
    this._barProgress    = null;
    this._loaderProgress = null;

    this._build();
  }

  /* ══════════════════════════════════════════════════════════════
     API PÚBLICA
  ══════════════════════════════════════════════════════════════ */

  /** Muestra el loader y empieza el avance automático. */
  start() {
    if (this._running) return;
    this._running = true;
    this._resetStyles();
    this._show();
    this.set(this._minimum);

    if (this._trickle) {
      const self = this;
      this._trickleTimer = setInterval(function() {
        if (self._running) {
          const remaining = 1 - self._value;
          self.increment(remaining * 0.1);
        }
      }, this._trickleSpeed);
    }
  }

  /** Completa al 100% y desaparece con fade out. */
  done() {
    this._clearTrickle();
    this._running = false;
    const self = this;
    this.set(1);
    setTimeout(function() { self._fadeOut(); }, this._speed);
  }

  /** Completa al 100% en color danger y desaparece. */
  error() {
    this._clearTrickle();
    this._running = false;
    if (this._barWrapEl) {
      this._barWrapEl.classList.add('mts-pageloader__bar-wrap--error');
    }
    const self = this;
    this.set(1);
    setTimeout(function() { self._fadeOut(); }, this._speed);
  }

  /** Establece el progreso manualmente (0–1). */
  set(n) {
    this._value = Math.min(1, Math.max(0, n));
    const pct   = Math.round(this._value * 100);
    if (this._barProgress)    { this._barProgress.setValue(pct, true); }
    if (this._loaderProgress) { this._loaderProgress.setValue(pct, true); }
  }

  /** Suma al valor actual. */
  increment(n) {
    this.set(this._value + (n || 0.1));
  }

  /** Destruye el componente y limpia el DOM. */
  destroy() {
    this._clearTrickle();
    if (this._barWrapEl && this._barWrapEl.parentNode) {
      this._barWrapEl.parentNode.removeChild(this._barWrapEl);
    }
    if (this._blockerEl && this._blockerEl.parentNode) {
      this._blockerEl.parentNode.removeChild(this._blockerEl);
    }
    this._barWrapEl      = null;
    this._blockerEl      = null;
    this._barProgress    = null;
    this._loaderProgress = null;
  }

  /* ══════════════════════════════════════════════════════════════
     CONSTRUCCIÓN
  ══════════════════════════════════════════════════════════════ */

  _build() {
    const hasBar     = this._mode === 'bar'     || this._mode === 'both';
    const hasBlocker = this._mode === 'blocker' || this._mode === 'both';

    if (hasBar)     { this._buildBar(); }
    if (hasBlocker) { this._buildBlocker(); }

    this._hide();
  }

  _buildBar() {
    const wrap       = document.createElement('div');
    wrap.className   = 'mts-pageloader__bar-wrap mts-pageloader__bar-wrap--' + this._position;

    /* Insertar en el DOM antes de crear MTS.Progress para que pueda medir */
    wrap.style.display = 'none';
    document.body.appendChild(wrap);

    const barOpts = Object.assign({
      type:    'bar',
      size:    'xs',
      variant: this._variant,
      value:   0,
      rounded: false,
    }, this._barOpts || {});

    this._barProgress = new MTS.Progress(wrap, barOpts);
    this._barWrapEl   = wrap;
  }

  _buildBlocker() {
    const blocker     = document.createElement('div');
    blocker.className = 'mts-pageloader__blocker';
    if (this._blur) { blocker.classList.add('mts-pageloader__blocker--blur'); }

    /* Capa de fondo (controla opacidad sin afectar al contenido) */
    const backdrop     = document.createElement('div');
    backdrop.className = 'mts-pageloader__backdrop';
    backdrop.style.setProperty('--_backdrop-opacity', this._backdropOpacity);
    blocker.appendChild(backdrop);

    /* Centro — flex container que centra el loader */
    const center     = document.createElement('div');
    center.className = 'mts-pageloader__center';
    blocker.appendChild(center);

    /* Contenedor interno — _el del componente (no tocar center para mantener flex) */
    const loaderEl     = document.createElement('div');
    center.appendChild(loaderEl);

    /* Insertar en el DOM antes de crear los componentes internos */
    blocker.style.display = 'none';
    document.body.appendChild(blocker);

    const loaderOpts = this._loaderOpts || {};

    if (loaderOpts.type) {
      /* MTS.Progress (circle) — variant = color */
      const opts           = Object.assign({ variant: this._variant, value: 0 }, loaderOpts);
      this._loaderProgress = new MTS.Progress(loaderEl, opts);
    } else {
      /* MTS.Spinner — variant = tipo de spinner (ring, dual, bars…), no el color */
      const opts = Object.assign({ variant: 'ring', size: 'md' }, loaderOpts);
      new MTS.Spinner(loaderEl, opts);
    }

    this._blockerEl = blocker;
  }

  /* ══════════════════════════════════════════════════════════════
     VISIBILIDAD
  ══════════════════════════════════════════════════════════════ */

  _show() {
    if (this._barWrapEl) { this._barWrapEl.style.display = ''; }
    if (this._blockerEl) { this._blockerEl.style.display = ''; }
  }

  _hide() {
    if (this._barWrapEl) { this._barWrapEl.style.display = 'none'; }
    if (this._blockerEl) { this._blockerEl.style.display = 'none'; }
  }

  _fadeOut() {
    const self       = this;
    const transition = 'opacity ' + this._speed + 'ms ease';

    if (this._barWrapEl) {
      this._barWrapEl.style.transition = transition;
      this._barWrapEl.style.opacity    = '0';
    }
    if (this._blockerEl) {
      this._blockerEl.style.transition = transition;
      this._blockerEl.style.opacity    = '0';
    }

    setTimeout(function() {
      self._hide();
      self._resetStyles();
      if (self._barProgress)    { self._barProgress.setValue(0, false); }
      if (self._loaderProgress) { self._loaderProgress.setValue(0, false); }
    }, self._speed + 50);
  }

  _resetStyles() {
    if (this._barWrapEl) {
      this._barWrapEl.style.opacity    = '';
      this._barWrapEl.style.transition = '';
      this._barWrapEl.classList.remove('mts-pageloader__bar-wrap--error');
    }
    if (this._blockerEl) {
      this._blockerEl.style.opacity    = '';
      this._blockerEl.style.transition = '';
    }
  }

  /* ══════════════════════════════════════════════════════════════
     TIMER
  ══════════════════════════════════════════════════════════════ */

  _clearTrickle() {
    if (this._trickleTimer) {
      clearInterval(this._trickleTimer);
      this._trickleTimer = null;
    }
  }

};
