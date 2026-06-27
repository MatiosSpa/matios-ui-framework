/* ============================================================
   MATIOS UI — matios-ui-topbar.js
   MTS.Topbar — Barra superior para dashboards y apps
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Topbar = class MtsTopbar {

  /**
   * @param {string|Element} selector   Elemento que se convierte en topbar
   * @param {object}  options
   * @param {object}  options.brand       { logo, title, subtitle, href, onClick }
   * @param {string|Element} options.start   Slot izquierdo (entre brand y spacer)
   * @param {string|Element} options.center  Slot central (reemplaza el spacer)
   * @param {string|Element} options.end     Slot derecho
   * @param {MTS.Menu} options.menu      Instancia de MTS.Menu — renderiza en modo horizontal
   *                                     Tiene prioridad sobre center si ambos se proveen.
   * @param {string}  options.height     Altura CSS — default: usa --mts-topbar-height (52px)
   * @param {boolean} options.sticky     Sticky top:0 — default: false
   * @param {boolean} options.shadow     Box-shadow — default: true
   * @param {boolean} options.border     Border-bottom — default: true
   */
  constructor(selector, options) {
    options = options || {};
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!this._el) {
      console.error('[MTS.Topbar] Selector no encontrado:', selector);
      return;
    }

    this.brand  = options.brand  || null;
    this.start  = options.start  !== undefined ? options.start  : null;
    this.center = options.center !== undefined ? options.center : null;
    this.end    = options.end    !== undefined ? options.end    : null;
    this.menu   = (options.menu && window.MTS && window.MTS.Menu && options.menu instanceof MTS.Menu) ? options.menu : null;
    this.height = options.height || null;
    this.sticky = options.sticky  !== undefined ? options.sticky  : false;
    this.shadow = options.shadow  !== undefined ? options.shadow  : true;
    this.border = options.border  !== undefined ? options.border  : true;

    this._startEl  = null;
    this._centerEl = null;
    this._endEl    = null;
    this._menuEl   = null;

    this._build();
  }

  /* ════════════════════════════════════════════════════
     API PÚBLICA
     ════════════════════════════════════════════════════ */

  /** Actualiza el brand y reconstruye */
  setBrand(brand) {
    this.brand = brand;
    this._build();
    return this;
  }

  /** Actualiza el slot start con HTML o Element */
  setStart(content) {
    this.start = content;
    if (this._startEl) {
      this._startEl.innerHTML = '';
      this._inject(this._startEl, content);
    }
    return this;
  }

  /** Actualiza el slot end con HTML o Element */
  setEnd(content) {
    this.end = content;
    if (this._endEl) {
      this._endEl.innerHTML = '';
      this._inject(this._endEl, content);
    }
    return this;
  }

  /** Actualiza el slot center (requiere rebuild por ser estructural) */
  setCenter(content) {
    this.center = content;
    this._build();
    return this;
  }

  /**
   * Retorna el Element del slot solicitado
   * @param {'brand'|'start'|'center'|'spacer'|'end'} name
   */
  getSlot(name) {
    return this._el.querySelector('.mts-topbar__' + name);
  }

  /** Elimina el componente y restaura el elemento */
  destroy() {
    if (this.menu && this._menuEl) this.menu._unmount(this._menuEl);
    this._el.innerHTML = '';
    this._el.className = '';
    this._el.removeAttribute('style');
  }

  /* ════════════════════════════════════════════════════
     PRIVADOS
     ════════════════════════════════════════════════════ */

  _build() {
    this._el.innerHTML = '';

    let classes = ['mts-topbar'];
    if (this.sticky)  classes.push('mts-topbar--sticky');
    if (!this.shadow) classes.push('mts-topbar--no-shadow');
    if (!this.border) classes.push('mts-topbar--no-border');
    this._el.className = classes.join(' ');

    if (this.height) {
      this._el.style.setProperty('--mts-topbar-height', this.height);
    }

    /* 1. Brand */
    if (this.brand) {
      this._el.appendChild(this._buildBrand());
    }

    /* 2. Start slot */
    this._startEl = document.createElement('div');
    this._startEl.className = 'mts-topbar__start';
    if (this.start !== null) this._inject(this._startEl, this.start);
    this._el.appendChild(this._startEl);

    /* 3. Menu, center slot o spacer — menu tiene prioridad sobre center */
    if (this.menu) {
      if (this._menuEl) this.menu._unmount(this._menuEl);
      this._menuEl = document.createElement('div');
      this._menuEl.className = 'mts-topbar__menu';
      this.menu._mount(this._menuEl, 'horizontal');
      this._el.appendChild(this._menuEl);
    } else if (this.center !== null) {
      this._centerEl = document.createElement('div');
      this._centerEl.className = 'mts-topbar__center';
      this._inject(this._centerEl, this.center);
      this._el.appendChild(this._centerEl);
    } else {
      let spacer = document.createElement('div');
      spacer.className = 'mts-topbar__spacer';
      this._el.appendChild(spacer);
    }

    /* 4. End slot */
    this._endEl = document.createElement('div');
    this._endEl.className = 'mts-topbar__end';
    if (this.end !== null) this._inject(this._endEl, this.end);
    this._el.appendChild(this._endEl);
  }

  _buildBrand() {
    let b   = this.brand;
    let tag = b.href ? 'a' : 'button';
    let el  = document.createElement(tag);
    el.className = 'mts-topbar__brand';

    if (b.href) {
      el.href = b.href;
    } else {
      el.type = 'button';
    }

    if (b.onClick) {
      el.addEventListener('click', b.onClick);
    }

    if (b.logo) {
      let logoWrap = document.createElement('div');
      logoWrap.className = 'mts-topbar__logo';
      logoWrap.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(b.logo) : b.logo;
      el.appendChild(logoWrap);
    }

    if (b.title || b.subtitle) {
      let info = document.createElement('div');
      info.className = 'mts-topbar__brand-info';

      if (b.title) {
        let titleEl = document.createElement('div');
        titleEl.className = 'mts-topbar__title';
        titleEl.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(b.title) : b.title;
        info.appendChild(titleEl);
      }

      if (b.subtitle) {
        let subEl = document.createElement('div');
        subEl.className = 'mts-topbar__subtitle';
        subEl.textContent = b.subtitle;
        info.appendChild(subEl);
      }

      el.appendChild(info);
    }

    return el;
  }

  _inject(el, content) {
    if (content === null || content === undefined) return;
    if (typeof content === 'string') {
      el.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(content) : content;
    } else if (content instanceof Element) {
      el.appendChild(content);
    }
  }
};
