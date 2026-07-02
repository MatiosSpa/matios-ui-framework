/* ============================================================
   MATIOS UI — matios-ui-accordion.js
   MTS.Accordion — Secciones expandibles
   Eventos DOM: mts:accordion:open | mts:accordion:close
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Accordion = class MtsAccordion {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {Array}    options.items          [{ id, title, content, icon?, open?, disabled? }]
   * @param {boolean}  options.multiple       Permite múltiples abiertos — default: false
   * @param {boolean}  options.flush          Sin bordes/card — default: false
   * @param {number}   options.bodyMaxHeight  Altura máxima del cuerpo en px — activa scroll interno
   * @param {function} options.onOpen
   * @param {function} options.onClose
   */
  constructor(selector, options = {}) {
    this._el      = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    // Accordion items: [{ id, title, content, icon?, open?, disabled? }]
    // Ítems del acordeón
    this.items = options.items || [];

    // Allow multiple panels open simultaneously / Permitir múltiples paneles abiertos
    this.multiple = options.multiple ?? false;

    // Flush mode — no card border / Modo flush — sin borde card
    this.flush = options.flush ?? false;

    // Max height for panel body in px — enables internal scroll
    this._bodyMaxHeight = options.bodyMaxHeight ?? null;

    // Track which item IDs are currently open / Seguir qué IDs están actualmente abiertos
    this._open = new Set(this.items.filter(i => i.open).map(i => i.id));

    this._listeners = {};

    // Fires when a panel opens: (e) => e.detail.id / Se dispara al abrir un panel
    if (options.onOpen)  this.on('open',  options.onOpen);

    // Fires when a panel closes: (e) => e.detail.id / Se dispara al cerrar un panel
    if (options.onClose) this.on('close', options.onClose);
    this._build();
  }

  open(id)    { this._toggle(id, true);  return this; }
  close(id)   { this._toggle(id, false); return this; }
  toggle(id)  { this._toggle(id, !this._open.has(id)); return this; }
  openAll()   { this.items.forEach(i => this._toggle(i.id, true));  return this; }
  closeAll()  { this.items.forEach(i => this._toggle(i.id, false)); return this; }
  isOpen(id)  { return this._open.has(id); }

  /**
   * Habilita o deshabilita un ítem del acordeón sin reconstruir el DOM.
   * Si el ítem estaba abierto y se deshabilita, se cierra automáticamente.
   * @param {string}  id       — ID del ítem (options.items[].id)
   * @param {boolean} disabled — true para deshabilitar, false para habilitar
   */
  setItemDisabled(id, disabled) {
    const item = this.items.find(i => i.id === id);
    if (!item) return this;
    item.disabled = disabled;
    const wrap   = this._el.querySelector(`#mts-acc-${id}`);
    if (!wrap) return this;
    const header = wrap.querySelector('.mts-accordion__header');
    wrap.classList.toggle('mts-accordion__item--disabled', disabled);
    if (header) header.disabled = disabled;
    if (disabled && this._open.has(id)) this._setOpen(id, false);
    return this;
  }

  /** Retorna true si el ítem está deshabilitado. */
  isDisabled(id) {
    const item = this.items.find(i => i.id === id);
    return item ? (item.disabled ?? false) : false;
  }

  /**
   * Agrega un ítem al final en runtime, montándolo quirúrgicamente (no reconstruye el resto).
   * Respeta single-open: si se abre y `multiple` es false, colapsa los demás.
   * @param {object}  item            — { id, title, content, icon?, open?, disabled? } (mismo shape que options.items)
   * @param {object} [opts]           — { open?: boolean } atajo para abrirlo al insertar
   */
  addItem(item, opts) {
    opts = opts || {};
    if (!item || item.id == null) return this;
    if (this.items.some(i => i.id === item.id)) return this;   // id único → no-op
    this.items.push(item);
    this._buildItem(item);                                     // _buildItem ya hace el appendChild al contenedor
    if (opts.open || item.open) this.open(item.id);            // open() colapsa el resto si !multiple
    return this;
  }

  /** Quita un ítem por id: lo saca del DOM, del registro y del set de abiertos. */
  removeItem(id) {
    const idx = this.items.findIndex(i => i.id === id);
    if (idx < 0) return this;
    this.items.splice(idx, 1);
    this._open.delete(id);
    const wrap = this._el.querySelector(`#mts-acc-${id}`);
    if (wrap) wrap.remove();
    return this;
  }

  /**
   * Actualiza un ítem ya renderizado in-place, sin reconstruir su contenido
   * (no pierde foco ni estado de los controles internos del item).
   * @param {string} id
   * @param {object} patch — { title?, icon?, disabled? }
   */
  updateItem(id, patch) {
    const item = this.items.find(i => i.id === id);
    if (!item || !patch) return this;
    const wrap = this._el.querySelector(`#mts-acc-${id}`);
    if (patch.title != null) {
      item.title = patch.title;
      const titleEl = wrap ? wrap.querySelector('.mts-accordion__title') : null;
      if (titleEl) titleEl.textContent = patch.title;
    }
    if (patch.icon != null && wrap) {
      item.icon = patch.icon;
      const header = wrap.querySelector('.mts-accordion__header');
      const safe   = (typeof MTS !== 'undefined' && MTS.Sanitize) ? MTS.Sanitize.html(patch.icon) : patch.icon;
      let iconEl   = header ? header.querySelector('.mts-accordion__icon') : null;
      if (!iconEl && header) {
        iconEl = document.createElement('span');
        iconEl.className = 'mts-accordion__icon';
        header.insertBefore(iconEl, header.firstChild);
      }
      if (iconEl) iconEl.innerHTML = safe;
    }
    if (typeof patch.disabled === 'boolean') this.setItemDisabled(id, patch.disabled);
    return this;
  }

  /** Retorna true si existe un ítem con ese id. */
  hasItem(id) { return this.items.some(i => i.id === id); }

  /** Retorna una copia superficial del arreglo de ítems actual. */
  getItems() { return this.items.slice(); }

  on(e, cb)   { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  destroy()   { this._el.innerHTML = ''; }

  _build() {
    this._syncClasses(['mts-accordion'].concat(this.flush ? ['mts-accordion--flush'] : []));
    this._el.innerHTML = '';
    this.items.forEach(item => this._buildItem(item));
  }

  _buildItem(item) {
    const wrap = document.createElement('div');
    wrap.className = 'mts-accordion__item' + (item.disabled ? ' mts-accordion__item--disabled' : '');
    wrap.id = `mts-acc-${item.id}`;

    const header = document.createElement('button');
    header.className = 'mts-accordion__header' + (this._open.has(item.id) ? ' mts-accordion__header--open' : '');
    header.setAttribute('aria-expanded', this._open.has(item.id));
    header.setAttribute('aria-controls', `mts-acc-body-${item.id}`);
    header.disabled = item.disabled ?? false;

    if (item.icon) { const ic = document.createElement('span'); ic.className = 'mts-accordion__icon'; ic.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(item.icon) : item.icon; header.appendChild(ic); }
    const title = document.createElement('span'); title.className = 'mts-accordion__title'; title.textContent = item.title; header.appendChild(title);
    const arrow = document.createElement('span'); arrow.className = 'mts-accordion__arrow';
    arrow.innerHTML = MTS.Icon.get('chevron-down');
    header.appendChild(arrow);

    header.addEventListener('click', () => { if (!item.disabled) this.toggle(item.id); });
    header.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(item.id); }});

    const body = document.createElement('div');
    body.className = 'mts-accordion__body' + (this._open.has(item.id) ? ' mts-accordion__body--open' : '');
    body.id = `mts-acc-body-${item.id}`;
    body.setAttribute('role', 'region');

    const inner = document.createElement('div');
    inner.className = 'mts-accordion__content';
    if (typeof item.content === 'string') inner.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(item.content) : item.content;
    else if (item.content instanceof Element) inner.appendChild(item.content);
    else if (typeof item.content === 'function') inner.appendChild(item.content());
    body.appendChild(inner);

    wrap.appendChild(header);
    wrap.appendChild(body);
    this._el.appendChild(wrap);
  }

  _toggle(id, open) {
    if (!this.multiple && open) {
      this._open.forEach(oid => { if (oid !== id) this._setOpen(oid, false); });
    }
    this._setOpen(id, open);
    this._emit(open ? 'open' : 'close', { id, item: this.items.find(i => i.id === id) });
  }

  _setOpen(id, open) {
    if (open) this._open.add(id); else this._open.delete(id);
    const wrap   = this._el.querySelector(`#mts-acc-${id}`);
    const header = wrap?.querySelector('.mts-accordion__header');
    const body   = wrap?.querySelector('.mts-accordion__body');
    if (!header || !body) return;
    header.classList.toggle('mts-accordion__header--open', open);
    header.setAttribute('aria-expanded', open);
    body.classList.toggle('mts-accordion__body--open', open);
    // Animación de altura
    if (open) {
      if (this._bodyMaxHeight !== null) {
        body.style.maxHeight  = this._bodyMaxHeight + 'px';
        body.style.overflowY  = 'auto';
      } else {
        body.style.maxHeight  = body.scrollHeight + 'px';
        body.style.overflowY  = '';
        /* Tras la transición soltar el max-height a 'none': el body sigue al contenido
           (ej. iframes que auto-ajustan su alto) sin quedar clavado en un px feo. */
        const clearMax = (ev) => {
          if (ev.target !== body || ev.propertyName !== 'max-height') return;
          body.removeEventListener('transitionend', clearMax);
          if (body.classList.contains('mts-accordion__body--open')) body.style.maxHeight = 'none';
        };
        body.addEventListener('transitionend', clearMax);
      }
    } else {
      /* Si venía en 'none', fijar un alto concreto antes de animar a 0 (si no, no hay transición). */
      if (body.style.maxHeight === 'none' || !body.style.maxHeight) {
        body.style.maxHeight = body.scrollHeight + 'px';
        void body.offsetHeight;   // reflow: registra el valor inicial
      }
      body.style.maxHeight = '0';
      body.style.overflowY = '';
    }
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:accordion:${event}`, { bubbles: true, detail }));
  }

  _syncClasses(classes) {
    const previousMatiosClasses = [...this._el.classList].filter(cls =>
      cls === 'mts-accordion' || cls.startsWith('mts-accordion--')
    );
    if (previousMatiosClasses.length) this._el.classList.remove(...previousMatiosClasses);
    this._el.classList.add(...classes.filter(Boolean));
  }
};
