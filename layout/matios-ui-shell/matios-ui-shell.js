/* ============================================================
   MATIOS UI — matios-ui-shell.js
   MTS.Shell — Orquestador de layout: Topbar + SideNav + StatusBar + main
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.Shell = class MtsShell {
  /**
   * Aplica CSS Grid al elemento raíz y asigna áreas a cada slot.
   * No crea ni mueve elementos — solo agrega clases. Los hijos
   * ya deben ser descendientes directos del elemento raíz.
   *
   * @param {string|Element} selector   Elemento raíz del shell (div, body, etc.)
   * @param {object} options
   * @param {MTS.Topbar|string|Element}    options.topbar     Instancia MTS, selector o Element
   * @param {MTS.SideNav|string|Element}   options.sidenav    Instancia MTS, selector o Element
   * @param {MTS.StatusBar|string|Element} options.statusbar  Instancia MTS, selector o Element
   * @param {string|Element}               options.main       Selector o Element del contenido principal
   * @param {string}                       options.height     Altura del shell — default: 100vh
   */
  constructor(selector, options) {
    options = options || {};
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) {
      console.error('[MTS.Shell] Selector no encontrado:', selector);
      return;
    }

    this._topbar    = options.topbar    || null;
    this._sidenav   = options.sidenav   || null;
    this._statusbar = options.statusbar || null;
    this._main      = options.main      || null;
    this._height    = options.height    || null;

    this._build();
  }

  /* ════════════════════════════════════════════════════
     API PÚBLICA
     ════════════════════════════════════════════════════ */

  /**
   * Reemplaza el contenido del slot main — patrón masterpage.
   * El shell persiste; solo cambia el interior del viewport.
   * @param {string|Element|null} content  HTML string, Element, o null para limpiar
   */
  setMain(content) {
    if (!this._mainEl) return this;
    this._mainEl.innerHTML = '';
    if (content === null || content === undefined) return this;
    if (typeof content === 'string') {
      this._mainEl.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(content) : content;
    } else if (content instanceof Element) {
      this._mainEl.appendChild(content);
    }
    if (window.MTS && MTS.Icon) MTS.Icon.initAll();
    return this;
  }

  /**
   * Retorna el Element del slot indicado.
   * @param {'topbar'|'sidenav'|'main'|'statusbar'} name
   */
  getSlot(name) {
    let map = {
      topbar:    this._topbarEl,
      sidenav:   this._sidenavEl,
      main:      this._mainEl,
      statusbar: this._statusbarEl
    };
    return map[name] || null;
  }

  /** Desmonta: elimina las clases que Shell agregó */
  destroy() {
    this._el.classList.remove(
      'mts-shell', 'mts-shell--top', 'mts-shell--side', 'mts-shell--status'
    );
    this._el.style.removeProperty('--mts-shell-height');
    [this._topbarEl, this._sidenavEl, this._mainEl, this._statusbarEl]
      .filter(Boolean)
      .forEach(function(el) {
        el.classList.remove(
          'mts-shell__topbar', 'mts-shell__sidenav',
          'mts-shell__main', 'mts-shell__statusbar'
        );
      });
  }

  /* ════════════════════════════════════════════════════
     PRIVADOS
     ════════════════════════════════════════════════════ */

  _build() {
    /* Resolver referencias → Elements */
    this._topbarEl    = this._resolve(this._topbar);
    this._sidenavEl   = this._resolve(this._sidenav);
    this._mainEl      = this._resolve(this._main);
    this._statusbarEl = this._resolve(this._statusbar);

    /* Clases de slot */
    if (this._topbarEl)    this._topbarEl.classList.add('mts-shell__topbar');
    if (this._sidenavEl)   this._sidenavEl.classList.add('mts-shell__sidenav');
    if (this._mainEl)      this._mainEl.classList.add('mts-shell__main');
    if (this._statusbarEl) this._statusbarEl.classList.add('mts-shell__statusbar');

    /* Modificadores en el root → activan el grid template correcto */
    let cls = ['mts-shell'];
    if (this._topbarEl)    cls.push('mts-shell--top');
    if (this._sidenavEl)   cls.push('mts-shell--side');
    if (this._statusbarEl) cls.push('mts-shell--status');
    this._el.className = cls.join(' ');

    /* Altura personalizada */
    if (this._height) {
      this._el.style.setProperty('--mts-shell-height', this._height);
    }
  }

  /**
   * Resuelve un slot a un Element.
   * Acepta: instancia MTS (tiene ._el) | selector string | Element | null
   */
  _resolve(ref) {
    if (!ref) return null;
    if (ref._el instanceof Element) return ref._el;      // instancia MTS
    if (ref instanceof Element)     return ref;           // Element directo
    if (typeof ref === 'string')    return document.querySelector(ref); // selector
    return null;
  }
};
