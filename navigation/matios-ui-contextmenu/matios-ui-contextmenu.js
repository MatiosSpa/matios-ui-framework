/* ============================================================
   MATIOS UI — matios-ui-contextmenu.js
   MTS.ContextMenu — Right-click / long-press context menu
   Version: 1.1.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.ContextMenu = class MtsContextMenu {
  constructor(target, options = {}) {
    // Target element or 'document' for global / Elemento objetivo o 'document' para global
    this._target = target === 'document'
      ? document
      : (typeof target === 'string' ? document.querySelector(target) : target);
    if (!this._target) return;

    // Menu items — same structure as MTS.Dropdown
    // Ítems del menú — misma estructura que MTS.Dropdown
    this.items = options.items || [];

    // Enable long-press trigger on mobile / Activar trigger long-press en móvil
    this.longPress = options.longPress ?? true;

    this._menuEl   = null;
    this._lpTimer  = null;
    this._listeners = {};

    // Fires when menu opens: ({ x, y, event }) => {} / Se dispara al abrir el menú
    if (options.onOpen)   this.on('open',   options.onOpen);

    // Fires when menu closes / Se dispara al cerrar el menú
    if (options.onClose)  this.on('close',  options.onClose);

    // Fires when an item is selected: ({ id, item }) => {} / Se dispara al seleccionar un ítem
    if (options.onSelect) this.on('select', options.onSelect);

    this._init();
  }

  /* ── API ─────────────────────────────────────────────── */

  // Replace item list / Reemplazar lista de ítems
  setItems(items) { this.items = items; return this; }

  // Show at specific coordinates / Mostrar en coordenadas específicas
  show(x, y) { this._open(x, y); return this; }

  // Hide the menu / Ocultar el menú
  hide() { this._close(); return this; }

  // Register event listener / Registrar listener de evento
  on(e, cb) { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }

  // Remove event listener / Eliminar listener de evento
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }

  // Destroy and unbind events / Destruir y desvincular eventos
  destroy() { this._close(); this._target?.removeEventListener('contextmenu', this._onCtx); }

  /* ── Init ────────────────────────────────────────────── */

  _init() {
    this._onCtx = (e) => {
      e.preventDefault();
      this._open(e.clientX, e.clientY, e);
    };
    this._target.addEventListener('contextmenu', this._onCtx);

    // Long press for mobile / Long press para móvil
    if (this.longPress) {
      this._target.addEventListener('touchstart', (e) => {
        this._lpTimer = setTimeout(() => {
          const t = e.touches[0];
          this._open(t.clientX, t.clientY, e);
        }, 500);
      });
      this._target.addEventListener('touchend',  () => clearTimeout(this._lpTimer));
      this._target.addEventListener('touchmove', () => clearTimeout(this._lpTimer));
    }

    // Close on outside click or Escape / Cerrar al click fuera o Escape
    document.addEventListener('click',   () => this._close());
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this._close(); });
  }

  /* ── Open ────────────────────────────────────────────── */

  _open(x, y, event) {
    this._close();

    const menu = document.createElement('div');
    menu.className  = 'mts-contextmenu';
    menu.style.cssText = 'position:fixed;z-index:9999;min-width:180px;';

    this.items.forEach((item) => {
      if (item.group) {
        const g = document.createElement('div');
        g.className   = 'mts-contextmenu__group';
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
      li.className = 'mts-contextmenu__item'
        + (item.danger   ? ' mts-contextmenu__item--danger'   : '')
        + (item.disabled ? ' mts-contextmenu__item--disabled' : '');

      if (item.icon) {
        const ico = document.createElement('span');
        ico.className = 'mts-contextmenu__icon';
        ico.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(item.icon) : item.icon;
        li.appendChild(ico);
      }
      const lbl = document.createElement('span');
      lbl.className   = 'mts-contextmenu__label';
      lbl.textContent = item.label;
      li.appendChild(lbl);

      if (item.shortcut) {
        const sh = document.createElement('span');
        sh.className   = 'mts-contextmenu__shortcut';
        sh.textContent = item.shortcut;
        li.appendChild(sh);
      }

      if (!item.disabled) {
        li.addEventListener('mousedown', (e) => {
          e.preventDefault(); e.stopPropagation();
          this._close();
          if (item.onClick) item.onClick(item);
          this._emit('select', { id: item.id, item });
        });
      }
      menu.appendChild(li);
    });

    document.body.appendChild(menu);
    this._menuEl = menu;

    // Position without overflowing viewport / Posicionar sin salirse del viewport
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

    this._emit('open', { x, y, event });
  }

  _close() {
    if (this._menuEl) {
      this._menuEl.remove();
      this._menuEl = null;
      this._emit('close', {});
    }
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    const el = this._target === document ? document : this._target;
    el.dispatchEvent(new CustomEvent(`mts:contextmenu:${event}`, { bubbles: true, detail }));
  }
};
