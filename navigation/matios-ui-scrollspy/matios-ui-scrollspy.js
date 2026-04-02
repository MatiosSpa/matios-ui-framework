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
    const sels = options.sections || [];
    this._sections   = (typeof sels === 'string' ? [sels] : sels)
      .flatMap(s => [...document.querySelectorAll(s)])
      .filter(Boolean);
    this._navEl      = options.nav ? document.querySelector(options.nav) : null;
    this._linkAttr   = options.linkAttr   || 'href';
    this._offset     = options.offset     ?? 80;
    this._activeClass= options.activeClass|| 'active';
    this._onChange   = options.onChange   || null;
    this._current    = null;
    this._onScroll   = this._check.bind(this);
    window.addEventListener('scroll', this._onScroll, { passive:true });
    this._check();
  }

  destroy() { window.removeEventListener('scroll', this._onScroll); }

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
    if (this._onChange) this._onChange({ id, section: active, link });
    if (this._navEl) {
      this._navEl.dispatchEvent(new CustomEvent('mts:scrollspy:change', {
        bubbles: true, detail: { id, section: active, link }
      }));
    }
  }
};
