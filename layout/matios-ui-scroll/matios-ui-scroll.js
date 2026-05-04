/* ============================================================
   MATIOS UI — matios-ui-scroll.js
   MTS.Scroll — Contenedor scrollable con scrollbar temático,
                sombras de borde y eventos de posición
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Scroll = class MtsScroll {

  /**
   * @param {string|Element} selector  Contenedor a transformar en scroll
   * @param {object}  options
   * @param {string}  options.direction     'vertical' | 'horizontal' | 'both'  — default: 'vertical'
   * @param {boolean} options.shadows       Mostrar fades en los bordes          — default: true
   * @param {string}  options.fadeBg        Color del fade (CSS color / var())   — default: null (usa CSS var)
   * @param {string}  options.fadeSize      Tamaño del fade CSS                  — default: null (usa CSS var)
   * @param {number}  options.threshold     px desde el borde para onReachStart/End — default: 24
   * @param {function} options.onScroll      ({ scrollTop, scrollLeft, percent }) => {}
   * @param {function} options.onReachStart  () => {}   Al llegar al inicio
   * @param {function} options.onReachEnd    () => {}   Al llegar al final
   */
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!this._el) {
      console.error('[MTS.Scroll] Selector no encontrado:', selector);
      return;
    }

    /* ── Opciones ─────────────────────────────────────────── */
    this.direction  = options.direction  || 'vertical';
    this.shadows    = options.shadows    ?? true;
    this.fadeBg     = options.fadeBg     || null;
    this.fadeSize   = options.fadeSize   || null;
    this.threshold  = options.threshold  ?? 24;

    this._onScroll     = options.onScroll     || null;
    this._onReachStart = options.onReachStart || null;
    this._onReachEnd   = options.onReachEnd   || null;

    /* ── Estado privado ───────────────────────────────────── */
    this._viewport   = null;
    this._fadeStart  = null;
    this._fadeEnd    = null;
    this._atStart    = true;
    this._atEnd      = false;
    this._scrollHandler = null;

    this._build();
  }

  /* ════════════════════════════════════════════════════════
     API PÚBLICA
     ════════════════════════════════════════════════════════ */

  /**
   * Mueve el scroll a una posición específica en px
   * @param {number}  pos
   * @param {boolean} smooth  — default: true
   */
  scrollTo(pos, smooth) {
    smooth = smooth !== false;
    var isH = this.direction === 'horizontal';
    var opts = { behavior: smooth ? 'smooth' : 'auto' };
    opts[isH ? 'left' : 'top'] = pos;
    this._viewport.scrollTo(opts);
    return this;
  }

  /** Mueve al inicio */
  scrollToStart(smooth) { return this.scrollTo(0, smooth); }

  /** Mueve al final */
  scrollToEnd(smooth) {
    var isH = this.direction === 'horizontal';
    var max = isH
      ? this._viewport.scrollWidth  - this._viewport.clientWidth
      : this._viewport.scrollHeight - this._viewport.clientHeight;
    return this.scrollTo(max, smooth);
  }

  /** Posición actual del scroll en px */
  getScroll() {
    return this.direction === 'horizontal'
      ? this._viewport.scrollLeft
      : this._viewport.scrollTop;
  }

  /** Porcentaje scrolleado (0–100) */
  getPercent() {
    var isH = this.direction === 'horizontal';
    var pos  = isH ? this._viewport.scrollLeft  : this._viewport.scrollTop;
    var max  = isH
      ? this._viewport.scrollWidth  - this._viewport.clientWidth
      : this._viewport.scrollHeight - this._viewport.clientHeight;
    return max <= 0 ? 100 : Math.round((pos / max) * 100);
  }

  /** Actualiza fades manualmente (útil si el contenido cambia dinámicamente) */
  update() {
    this._updateFades();
    return this;
  }

  /** Elimina el componente y restaura el DOM original */
  destroy() {
    if (this._viewport && this._scrollHandler) {
      this._viewport.removeEventListener('scroll', this._scrollHandler);
    }
    var content = this._viewport ? this._viewport.innerHTML : '';
    this._el.innerHTML = content;
    this._el.classList.remove(
      'mts-scroll',
      'mts-scroll--vertical',
      'mts-scroll--horizontal',
      'mts-scroll--both'
    );
  }

  /* ════════════════════════════════════════════════════════
     PRIVADOS
     ════════════════════════════════════════════════════════ */

  _build() {
    /* Mover contenido existente al viewport */
    var content = this._el.innerHTML;
    this._el.innerHTML = '';

    /* Clases del bloque raíz */
    this._el.classList.add('mts-scroll', 'mts-scroll--' + this.direction);

    /* Viewport */
    var viewport = document.createElement('div');
    viewport.className = 'mts-scroll__viewport';
    viewport.innerHTML = content;
    this._viewport = viewport;
    this._el.appendChild(viewport);

    /* CSS vars opcionales */
    if (this.fadeBg)   this._el.style.setProperty('--mts-scroll-fade-bg',   this.fadeBg);
    if (this.fadeSize) this._el.style.setProperty('--mts-scroll-fade-size', this.fadeSize);

    /* Fades */
    if (this.shadows) {
      this._fadeStart = this._makeFade('start');
      this._fadeEnd   = this._makeFade('end');
      this._el.appendChild(this._fadeStart);
      this._el.appendChild(this._fadeEnd);
    }

    /* Eventos */
    this._bindScroll();

    /* Estado inicial */
    this._updateFades();
  }

  _makeFade(side) {
    var el = document.createElement('div');
    el.className = 'mts-scroll__fade mts-scroll__fade--' + side;
    return el;
  }

  _bindScroll() {
    var self = this;
    this._scrollHandler = function () {
      self._updateFades();
      self._checkReach();
      if (self._onScroll) {
        self._onScroll({
          scrollTop:  self._viewport.scrollTop,
          scrollLeft: self._viewport.scrollLeft,
          percent:    self.getPercent()
        });
      }
    };
    this._viewport.addEventListener('scroll', this._scrollHandler, { passive: true });
  }

  _updateFades() {
    if (!this.shadows) return;

    var isH  = this.direction === 'horizontal';
    var pos  = isH ? this._viewport.scrollLeft  : this._viewport.scrollTop;
    var size = isH ? this._viewport.scrollWidth  : this._viewport.scrollHeight;
    var vis  = isH ? this._viewport.clientWidth  : this._viewport.clientHeight;

    var atStart = pos <= 0;
    var atEnd   = pos >= size - vis - 1;

    this._fadeStart.classList.toggle('mts-scroll__fade--visible', !atStart);
    this._fadeEnd.classList.toggle('mts-scroll__fade--visible',   !atEnd);
  }

  _checkReach() {
    var isH  = this.direction === 'horizontal';
    var pos  = isH ? this._viewport.scrollLeft  : this._viewport.scrollTop;
    var size = isH ? this._viewport.scrollWidth  : this._viewport.scrollHeight;
    var vis  = isH ? this._viewport.clientWidth  : this._viewport.clientHeight;
    var max  = size - vis;

    /* onReachStart */
    if (pos <= this.threshold && !this._atStart) {
      this._atStart = true;
      this._atEnd   = false;
      if (this._onReachStart) this._onReachStart();
    }

    /* onReachEnd */
    if (pos >= max - this.threshold && !this._atEnd) {
      this._atEnd   = true;
      this._atStart = false;
      if (this._onReachEnd) this._onReachEnd();
    }

    /* Resetear flags si el usuario volvió al centro */
    if (pos > this.threshold)       this._atStart = false;
    if (pos < max - this.threshold) this._atEnd   = false;
  }
};
