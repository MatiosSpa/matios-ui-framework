/* ============================================================
   MATIOS UI — matios-ui-dropdown.js
   MTS.Dropdown — Menú desplegable con grupos y submenús
   Eventos DOM: mts:dropdown:open | mts:dropdown:close | mts:dropdown:select
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Dropdown = class MtsDropdown {
  /**
   * @param {string|Element} trigger  Elemento que dispara el dropdown
   * @param {object} options
   * @param {Array}    options.items     [{ id, label, icon?, disabled?, divider?, group?, items?[] }]
   * @param {string}   options.position  'bottom-start'|'bottom-end'|'top-start'|'top-end' — default: 'bottom-start'
   * @param {string}   options.trigger   'click'|'hover' — default: 'click'
   * @param {number}   options.offset    px de separación — default: 4
   * @param {function} options.onSelect
   * @param {function} options.onOpen
   * @param {function} options.onClose
   */
  constructor(trigger, options = {}) {
    this._trigger  = typeof trigger === 'string' ? document.querySelector(trigger) : trigger;
    if (!this._trigger) { console.error('[MTS.Dropdown] Trigger no encontrado'); return; }
    // Menu items: [{ id, label, icon?, disabled?, divider?, group?, items?[] }]
    // Ítems del menú
    this.items = options.items || [];

    // Popup position relative to trigger / Posición del popup respecto al trigger
    this.position = options.position || 'bottom-start';

    // Open trigger: 'click' | 'hover' / Evento de apertura
    this.triggerOn = options.trigger || 'click';

    // Gap in px between trigger and menu / Separación en px entre trigger y menú
    this.offset = options.offset ?? 4;

    this._isOpen    = false;
    this._listeners = {};

    // Fires when a menu item is selected / Se dispara al seleccionar un ítem
    if (options.onSelect) this.on('select', options.onSelect);

    // Fires when dropdown opens / Se dispara al abrir el dropdown
    if (options.onOpen)   this.on('open',   options.onOpen);

    // Fires when dropdown closes / Se dispara al cerrar el dropdown
    if (options.onClose)  this.on('close',  options.onClose);
    this._build();
    this._bindEvents();
  }

  open()   { if (this._isOpen) return; this._isOpen = true; this._menuEl.removeAttribute('hidden'); this._position(); requestAnimationFrame(() => this._menuEl.classList.add('mts-dropdown--open')); this._emit('open', {}); return this; }
  close()  { if (!this._isOpen) return; this._isOpen = false; this._menuEl.classList.remove('mts-dropdown--open'); setTimeout(() => this._menuEl.setAttribute('hidden', ''), 150); this._emit('close', {}); return this; }
  toggle() { return this._isOpen ? this.close() : this.open(); }
  setItems(items) { this.items = items; this._renderMenu(); return this; }
  on(e, cb) { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  destroy() { this._menuEl?.remove(); document.removeEventListener('click', this._outsideClick); }

  _build() {
    this._trigger.setAttribute('aria-haspopup', 'true');
    this._trigger.setAttribute('aria-expanded', 'false');

    this._menuEl = document.createElement('ul');
    this._menuEl.className = 'mts-dropdown';
    this._menuEl.setAttribute('role', 'menu');
    this._menuEl.setAttribute('hidden', '');
    document.body.appendChild(this._menuEl);
    this._renderMenu();
  }

  _renderMenu() {
    this._menuEl.innerHTML = '';
    this.items.forEach(item => {
      if (item.divider) { const li = document.createElement('li'); li.className = 'mts-dropdown__divider'; li.setAttribute('role', 'separator'); this._menuEl.appendChild(li); return; }
      if (item.group)   { const li = document.createElement('li'); li.className = 'mts-dropdown__group'; li.textContent = item.group; this._menuEl.appendChild(li); return; }

      const li = document.createElement('li');
      li.className = 'mts-dropdown__item' + (item.disabled ? ' mts-dropdown__item--disabled' : '') + (item.danger ? ' mts-dropdown__item--danger' : '');
      li.setAttribute('role', 'menuitem');

      if (item.icon) { const ic = document.createElement('span'); ic.className = 'mts-dropdown__item-icon'; ic.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(item.icon) : item.icon; li.appendChild(ic); }
      const lbl = document.createElement('span'); lbl.textContent = item.label; li.appendChild(lbl);
      if (item.shortcut) { const sc = document.createElement('span'); sc.className = 'mts-dropdown__shortcut'; sc.textContent = item.shortcut; li.appendChild(sc); }
      if (item.items?.length) { const arr = document.createElement('span'); arr.className = 'mts-dropdown__arrow'; arr.innerHTML = '›'; li.appendChild(arr); this._buildSubmenu(li, item.items); }

      if (!item.disabled) {
        li.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!item.items?.length) { this.close(); if (item.onClick) item.onClick(item); this._emit('select', { id: item.id, item }); }
        });
      }
      this._menuEl.appendChild(li);
    });
  }

  _buildSubmenu(parent, items) {
    const sub = document.createElement('ul');
    sub.className = 'mts-dropdown mts-dropdown--submenu';
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'mts-dropdown__item' + (item.disabled ? ' mts-dropdown__item--disabled' : '');
      li.setAttribute('role', 'menuitem');
      if (item.icon) { const ic = document.createElement('span'); ic.className = 'mts-dropdown__item-icon'; ic.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(item.icon) : item.icon; li.appendChild(ic); }
      const lbl = document.createElement('span'); lbl.textContent = item.label; li.appendChild(lbl);
      if (!item.disabled) li.addEventListener('click', (e) => { e.stopPropagation(); this.close(); if (item.onClick) item.onClick(item); this._emit('select', { id: item.id, item }); });
      sub.appendChild(li);
    });
    parent.appendChild(sub);
    parent.classList.add('mts-dropdown__item--has-sub');
  }

  _position() {
    const rect = this._trigger.getBoundingClientRect();
    const scroll = { x: window.scrollX, y: window.scrollY };
    this._menuEl.style.position = 'absolute';

    const [vPos, hPos] = this.position.split('-');
    if (vPos === 'bottom') this._menuEl.style.top  = `${rect.bottom + scroll.y + this.offset}px`;
    else                   this._menuEl.style.top  = `${rect.top + scroll.y - this._menuEl.offsetHeight - this.offset}px`;
    if (hPos === 'start')  this._menuEl.style.left = `${rect.left + scroll.x}px`;
    else                   this._menuEl.style.left = `${rect.right + scroll.x - this._menuEl.offsetWidth}px`;
  }

  _bindEvents() {
    if (this.triggerOn === 'click') {
      this._trigger.addEventListener('click', (e) => { e.stopPropagation(); this.toggle(); this._trigger.setAttribute('aria-expanded', this._isOpen); });
    } else {
      this._trigger.addEventListener('mouseenter', () => this.open());
      this._trigger.addEventListener('mouseleave', () => setTimeout(() => { if (!this._menuEl.matches(':hover')) this.close(); }, 150));
      this._menuEl.addEventListener('mouseleave', () => this.close());
    }
    this._trigger.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(); } if (e.key === 'Escape') this.close(); });
    this._outsideClick = (e) => { if (!this._trigger.contains(e.target) && !this._menuEl.contains(e.target)) this.close(); };
    document.addEventListener('click', this._outsideClick);
    window.addEventListener('scroll', () => { if (this._isOpen) this._position(); }, true);
    window.addEventListener('resize', () => { if (this._isOpen) this._position(); });
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._trigger.dispatchEvent(new CustomEvent(`mts:dropdown:${event}`, { bubbles: true, detail: { dropdown: this, ...detail } }));
  }
};
