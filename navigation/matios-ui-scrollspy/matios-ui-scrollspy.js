/* ============================================================
   MATIOS UI — matios-ui-scrollspy.js
   MTS.ScrollSpy — Resalta el nav item de la sección activa
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.ScrollSpy = class MtsScrollSpy {
  /**
   * @param {object} options
   * @param {string|Array} options.sections  Selector CSS o array de selectores de secciones
   * @param {string}       options.nav       Selector del contenedor de navegación
   * @param {string}       options.linkAttr  Atributo del link que contiene el ID — default: 'href'
   * @param {number}       options.offset    Offset en px desde el top — default: 80
   * @param {string}       options.activeClass Clase CSS para el link activo — default: 'active'
   * @param {function}     options.onChange  ({ id, section, link }) => {}
   */
  constructor(options = {}) {
    // Section selectors or array of selectors / Selectores de sección o arreglo de selectores
    const sels = options.sections || [];
    this._sections = (typeof sels === 'string' ? [sels] : sels)
      .flatMap(s => [...document.querySelectorAll(s)])
      .filter(Boolean);

    // Nav container selector / Selector del contenedor de navegación
    this._navEl = options.nav ? document.querySelector(options.nav) : null;

    // Link attribute containing the section ID / Atributo del link que contiene el ID de sección
    this._linkAttr = options.linkAttr || 'href';

    // Scroll offset in px from top / Offset en px desde el top
    this._offset = options.offset ?? 80;

    // CSS class applied to the active link / Clase CSS aplicada al link activo
    this._activeClass = options.activeClass || 'active';

    this._current   = null;
    this._listeners = {};

    // Fires when active section changes: ({ id, section, link }) => {}
    // Se dispara al cambiar la sección activa
    if (options.onChange) this.on('change', options.onChange);

    this._onScroll = this._check.bind(this);
    window.addEventListener('scroll', this._onScroll, { passive: true });
    this._check();
  }

  destroy() { window.removeEventListener('scroll', this._onScroll); }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }

  _check() {
    let active = null;
    const scrollY = window.scrollY || window.pageYOffset;

    this._sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top + scrollY - this._offset;
      if (scrollY >= top) active = sec;
    });

    const id = active?.id || (this._sections[0]?.id ?? '');
    if (id === this._current) return;
    this._current = id;

    /* Actualizar clases en el nav */
    if (this._navEl) {
      this._navEl.querySelectorAll('[' + this._linkAttr + ']').forEach(link => {
        const val = link.getAttribute(this._linkAttr) || '';
        const linkId = val.replace('#', '');
        link.classList.toggle(this._activeClass, linkId === id);
      });
    }

    const link = this._navEl?.querySelector('[' + this._linkAttr + '="#' + id + '"]') || null;
    this._emit('change', { id, section: active, link });
  }
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    if (this._navEl) {
      this._navEl.dispatchEvent(new CustomEvent(`mts:scrollspy:${event}`, { bubbles: true, detail }));
    }
  }
};
