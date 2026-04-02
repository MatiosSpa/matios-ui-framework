/* ============================================================
   MATIOS UI — matios-ui-contextmenu.js
   MTS.ContextMenu — Menú contextual (click derecho / long press)
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.ContextMenu = class MtsContextMenu {
  /**
   * @param {string|Element} target   Elemento que dispara el menú (o 'document' para global)
   * @param {object} options
   * @param {Array}    options.items     Misma estructura que MTS.Dropdown
   *                   [{ label, icon?, shortcut?, divider?, group?, danger?, disabled?, onClick }]
   * @param {function} options.onOpen    ({ x, y, event }) => {}
   * @param {function} options.onClose   () => {}
   * @param {function} options.onSelect  ({ item }) => {}
   * @param {boolean}  options.longPress Activar también con long press (móvil) — default: true
   */
  constructor(target, options = {}) {
    this._target    = target === 'document' ? document : (typeof target === 'string' ? document.querySelector(target) : target);
    if (!this._target) return;
    this.items      = options.items    || [];
    this.onOpen     = options.onOpen   || null;
    this.onClose    = options.onClose  || null;
    this.onSelect   = options.onSelect || null;
    this.longPress  = options.longPress ?? true;
    this._menuEl    = null;
    this._lpTimer   = null;
    this._init();
  }

  /* ── API ── */
  setItems(items) { this.items = items; return this; }
  show(x, y)      { this._open(x, y); return this; }
  hide()          { this._close(); return this; }
  destroy()       { this._close(); this._target?.removeEventListener('contextmenu', this._onCtx); }

  _init() {
    this._onCtx = (e) => {
      e.preventDefault();
      this._open(e.clientX, e.clientY, e);
    };
    this._target.addEventListener('contextmenu', this._onCtx);

    /* Long press para móvil */
    if (this.longPress) {
      this._target.addEventListener('touchstart', (e) => {
        this._lpTimer = setTimeout(() => {
          const t = e.touches[0];
          this._open(t.clientX, t.clientY, e);
        }, 500);
      });
      this._target.addEventListener('touchend',   () => clearTimeout(this._lpTimer));
      this._target.addEventListener('touchmove',  () => clearTimeout(this._lpTimer));
    }

    /* Cerrar al click fuera o Escape */
    document.addEventListener('click',   () => this._close());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this._close(); });
  }

  _open(x, y, event) {
    this._close();

    const menu = document.createElement('div');
    menu.className = 'mts-contextmenu';
    menu.style.cssText = 'position:fixed;z-index:9999;min-width:180px;';

    this.items.forEach((item) => {
      if (item.group) {
        const g = document.createElement('div');
        g.className = 'mts-contextmenu__group';
        g.textContent = item.group;
        menu.appendChild(g);
        return;
      }
      if (item.divider) {
        const d = document.createElement('div');
        d.className = 'mts-contextmenu__divider';
        menu.appendChild(d);
        return;
      }
      const li = document.createElement('div');
      li.className = 'mts-contextmenu__item' +
        (item.danger    ? ' mts-contextmenu__item--danger'   : '') +
        (item.disabled  ? ' mts-contextmenu__item--disabled' : '');

      if (item.icon) {
        const ico = document.createElement('span');
        ico.className = 'mts-contextmenu__icon';
        ico.innerHTML = item.icon;
        li.appendChild(ico);
      }
      const lbl = document.createElement('span');
      lbl.className = 'mts-contextmenu__label';
      lbl.textContent = item.label;
      li.appendChild(lbl);

      if (item.shortcut) {
        const sh = document.createElement('span');
        sh.className = 'mts-contextmenu__shortcut';
        sh.textContent = item.shortcut;
        li.appendChild(sh);
      }

      if (!item.disabled) {
        li.addEventListener('mousedown', (e) => {
          e.preventDefault(); e.stopPropagation();
          this._close();
          if (item.onClick) item.onClick(item);
          if (this.onSelect) this.onSelect({ item });
          this._target.dispatchEvent(new CustomEvent('mts:contextmenu:select', { bubbles:true, detail:{ item } }));
        });
      }
      menu.appendChild(li);
    });

    document.body.appendChild(menu);
    this._menuEl = menu;

    /* Posicionar sin salirse del viewport */
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = menu.getBoundingClientRect();
    let left = x;
    let top  = y;
    if (left + rect.width  > vw) left = vw - rect.width  - 8;
    if (top  + rect.height > vh) top  = vh - rect.height - 8;
    menu.style.left = left + 'px';
    menu.style.top  = top  + 'px';
    menu.classList.add('mts-contextmenu--open');

    if (this.onOpen) this.onOpen({ x, y, event });
  }

  _close() {
    if (this._menuEl) {
      this._menuEl.remove();
      this._menuEl = null;
      if (this.onClose) this.onClose();
    }
  }
};
