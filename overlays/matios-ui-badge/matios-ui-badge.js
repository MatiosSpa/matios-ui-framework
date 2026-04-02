/* ============================================================
   MATIOS UI — matios-ui-badge.js
   MTS.Badge — Badges, pills y contadores

   Uso via JS:   new MTS.Badge(element, options)
   Uso via HTML: <span class="mts-badge mts-badge--success">Activo</span>

   Requiere: matios-ui-base.css + matios-ui-badge.css
   Version:  1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Badge = class MtsBadge {

  /* ============================================================
     Constructor
     ============================================================ */

  /**
   * @param {string|Element} selector
   * @param {object} options
   *
   * — Contenido —
   * @param {string}   options.label      Texto del badge
   * @param {number}   options.count      Número — si se provee, muestra contador
   * @param {number}   options.maxCount   Máximo antes de mostrar "99+" — default: 99
   * @param {boolean}  options.dot        Muestra solo un punto sin texto
   *
   * — Apariencia —
   * @param {string}   options.variant    'default'|'primary'|'success'|'warning'|'danger'|'info'|'accent'
   * @param {string}   options.shape      'pill'|'square'|'dot'
   * @param {string}   options.size       'xs'|'sm'|'md'|'lg'
   *
   * — Comportamiento —
   * @param {boolean}  options.removable  Muestra botón × para remover
   * @param {function} options.onRemove   Callback al remover
   * @param {boolean}  options.pulse      Animación de pulso (para dot de notificación)
   */
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!this._el) {
    /* ── data-* → inicialización HTML declarativa ── */
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.label !== undefined) _fromHTML.label = _ds.label;
    if (_ds.count !== undefined) _fromHTML.count = parseInt(_ds.count);
    if (_ds.maxCount !== undefined) _fromHTML.maxCount = parseInt(_ds.maxCount);
    if (_ds.variant !== undefined) _fromHTML.variant = _ds.variant;
    if (_ds.size !== undefined) _fromHTML.size = _ds.size;
    if (_ds.dot !== undefined) _fromHTML.dot = true;
    if (_ds.pulse !== undefined) _fromHTML.pulse = true;
    if (_ds.removable !== undefined) _fromHTML.removable = true;
    options = { ..._fromHTML, ...options };

      console.error(`[MTS.Badge] Elemento no encontrado: ${selector}`);
      return;
    }

    this.label    = options.label    ?? this._el.textContent.trim();
    this.count    = options.count    ?? null;
    this.maxCount = options.maxCount ?? 99;
    this.dot      = options.dot      ?? false;
    this.variant  = options.variant  || 'default';
    this.shape    = options.shape    || 'pill';
    this.size     = options.size     || 'md';
    this.removable = options.removable ?? false;
    this.onRemove  = options.onRemove  || null;
    this.pulse     = options.pulse     ?? false;

    this._render();
  }

  /* ============================================================
     API PÚBLICA
     ============================================================ */

  /** Actualiza el contador */
  setCount(count) {
    this.count = count;
    const label = this._el.querySelector('.mts-badge__label') || this._el;
    label.textContent = this._formatCount(count);
    // Mostrar/ocultar si es 0
    if (count === 0) this._el.classList.add('mts-badge--zero');
    else             this._el.classList.remove('mts-badge--zero');
    return this;
  }

  /** Incrementa el contador */
  increment(by = 1) {
    return this.setCount((this.count || 0) + by);
  }

  /** Decrementa el contador */
  decrement(by = 1) {
    return this.setCount(Math.max(0, (this.count || 0) - by));
  }

  /** Cambia la variante */
  setVariant(variant) {
    this._el.classList.remove(`mts-badge--${this.variant}`);
    this.variant = variant;
    this._el.classList.add(`mts-badge--${this.variant}`);
    return this;
  }

  /** Cambia el label */
  setLabel(label) {
    this.label = label;
    const labelEl = this._el.querySelector('.mts-badge__label') || this._el;
    labelEl.textContent = label;
    return this;
  }

  /** Activa/desactiva el pulso */
  setPulse(active) {
    this.pulse = active;
    this._el.classList.toggle('mts-badge--pulse', active);
    return this;
  }

  /** Muestra el badge */
  show() {
    this._el.classList.remove('mts-badge--hidden');
    return this;
  }

  /** Oculta el badge */
  hide() {
    this._el.classList.add('mts-badge--hidden');
    return this;
  }

  /** Destruye y remueve del DOM */
  destroy() {
    this._el?.remove();
  }

  /* ============================================================
     RENDER
     ============================================================ */

  _render() {
    // Clases base
    this._el.className = [
      'mts-badge',
      `mts-badge--${this.variant}`,
      `mts-badge--${this.shape}`,
      `mts-badge--${this.size}`,
      this.dot      ? 'mts-badge--dot'    : '',
      this.pulse    ? 'mts-badge--pulse'  : '',
      this.removable ? 'mts-badge--removable' : '',
    ].filter(Boolean).join(' ');

    this._el.innerHTML = '';

    if (this.dot) return; // solo el punto, sin contenido

    // Label o count
    const labelEl = document.createElement('span');
    labelEl.className = 'mts-badge__label';
    labelEl.textContent = this.count !== null
      ? this._formatCount(this.count)
      : this.label;
    this._el.appendChild(labelEl);

    // Botón remover
    if (this.removable) {
      const removeBtn = document.createElement('button');
      removeBtn.className = 'mts-badge__remove';
      removeBtn.setAttribute('aria-label', 'Remover');
      removeBtn.innerHTML = '&times;';
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onRemove) this.onRemove(this);
        else this.destroy();
      });
      this._el.appendChild(removeBtn);
    }
  }

  _formatCount(count) {
    if (count > this.maxCount) return `${this.maxCount}+`;
    return String(count);
  }

  /* ============================================================
     MÉTODO ESTÁTICO — crea un badge inline sin selector
     ============================================================ */

  /**
   * Crea un elemento badge listo para insertar en el DOM
   * @returns {HTMLElement}
   */
  static create(options = {}) {
    const el = document.createElement('span');
    new MTS.Badge(el, options);
    return el;
  }

  /**
   * Genera HTML string de un badge (para usar en innerHTML)
   * @returns {string}
   */
  static html(label, variant = 'default', size = 'md', shape = 'pill') {
    return `<span class="mts-badge mts-badge--${variant} mts-badge--${size} mts-badge--${shape}">${label}</span>`;
  }
};
