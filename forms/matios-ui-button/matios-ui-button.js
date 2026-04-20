/* ============================================================
   MATIOS UI â€” matios-ui-button.js
   MTS.Button | MTS.ButtonGroup
   Version: 1.2.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Button = class MtsButton {
  constructor(selector, options = {}) {
    // Target element (selector string or DOM element)
    // Elemento objetivo (selector string o elemento DOM)
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) { console.error('[MTS.Button] Not found / No encontrado:', selector); return; }

    // Read data-* attributes from HTML for declarative initialization
    // Lee atributos data-* del HTML para inicializaciÃ³n declarativa
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.label     !== undefined) _fromHTML.label     = _ds.label;
    if (_ds.variant   !== undefined) _fromHTML.variant   = _ds.variant;
    if (_ds.size      !== undefined) _fromHTML.size      = _ds.size;
    if (_ds.disabled  !== undefined) _fromHTML.disabled  = true;
    if (_ds.loading   !== undefined) _fromHTML.loading   = true;
    if (_ds.block     !== undefined) _fromHTML.block     = true;
    if (_ds.round     !== undefined) _fromHTML.round     = true;
    if (_ds.iconOnly  !== undefined) _fromHTML.iconOnly  = true;
    if (_ds.shadow    !== undefined) _fromHTML.shadow    = true;
    if (_ds.ring      !== undefined) _fromHTML.ring      = true;
    options = { ..._fromHTML, ...options };

    // Visible button text / Texto visible del botÃ³n
    this.label = options.label ?? this._el.textContent.trim();

    // Visual variant / Variante visual
    this.variant = options.variant || 'primary';

    // Size variant: 'xs' | 'sm' | '' | 'lg' | 'xl'
    // Variante de tamaÃ±o
    this.size = options.size || '';

    // Full width / Ancho completo
    this.block = options.block ?? false;

    // Pill border-radius / Border-radius pill
    this.round = options.round ?? false;

    // Square padding, icon only / Padding cuadrado, solo Ã­cono
    this.iconOnly = options.iconOnly ?? false;

    // Disables all interaction / Deshabilita toda interacciÃ³n
    this.disabled = options.disabled ?? false;

    // Shows loading spinner / Muestra spinner de carga
    this.loading = options.loading ?? false;

    // Left icon HTML / HTML del Ã­cono izquierdo
    this.iconLeft = options.iconLeft || null;

    // Right icon HTML / HTML del Ã­cono derecho
    this.iconRight = options.iconRight || null;

    // Extra CSS classes / Clases CSS adicionales
    this.className = options.className || '';

    // Inline styles / Estilos inline
    this.customStyle = options.style || null;

    // Colored shadow / Sombra de color
    this.shadow = options.shadow ?? false;

    // Semitransparent ring / Ring semitransparente
    this.ring = options.ring ?? false;

    // Fires on click / Se dispara al hacer click
    // Fires when button is clicked: (event, button) => {} / Se dispara al hacer click
    this._listeners = {};
    if (options.onClick) this.on('click', options.onClick);
    this._build();
    this._bindEvents();
  }

  /* â”€â”€ API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

  // Enable interaction / Habilitar interacciÃ³n
  enable()  { this.disabled = false; this._el.disabled = false; this._el.classList.remove('mts-btn--disabled'); return this; }

  // Disable interaction / Deshabilitar interacciÃ³n
  disable() { this.disabled = true;  this._el.disabled = true;  this._el.classList.add('mts-btn--disabled');    return this; }

  // Show or hide loading spinner / Mostrar u ocultar spinner de carga
  setLoading(v) {
    this.loading = v;
    this._el.disabled = v || this.disabled;
    const sp = this._el.querySelector('.mts-btn__spinner');
    if (v && !sp) {
      const el = document.createElement('span');
      el.className = 'mts-btn__spinner';
      this._el.insertBefore(el, this._el.firstChild);
    } else if (!v && sp) {
      sp.remove();
    }
    return this;
  }

  // Change visible label at runtime / Cambiar texto visible en runtime
  setLabel(text) {
    this.label = text;
    const lbl = this._el.querySelector('.mts-btn__label');
    if (lbl) lbl.textContent = text;
    return this;
  }

  // Change variant at runtime / Cambiar variante en runtime
  setVariant(variant) {
    ['primary','secondary','ghost','danger','success','warning','link'].forEach(v =>
      this._el.classList.remove('mts-btn--' + v));
    this.variant = variant;
    this._el.classList.add('mts-btn--' + variant);
    return this;
  }

  // Toggle colored shadow / Activar o desactivar sombra de color
  setShadow(v) { this.shadow = v; this._el.classList.toggle('mts-btn--shadow', v); return this; }

  // Toggle semitransparent ring / Activar o desactivar ring semitransparente
  setRing(v)   { this.ring   = v; this._el.classList.toggle('mts-btn--ring',   v); return this; }

  // Register an event listener / Registrar un listener de evento
  on(event, cb)  { (this._listeners[event] = this._listeners[event] || []).push(cb); return this; }

  // Remove an event listener / Eliminar un listener de evento
  off(event, cb) { this._listeners[event] = (this._listeners[event] || []).filter(f => f !== cb); return this; }

  // Destroy the instance / Destruir la instancia
  destroy() { this._el.replaceWith(this._el.cloneNode(true)); }

  /* â”€â”€ Build â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

  _build() {
    this._syncClasses();
    this._el.disabled  = this.disabled || this.loading;
    this._el.innerHTML = '';

    if (this.customStyle) Object.assign(this._el.style, this.customStyle);

    if (this.loading) {
      const sp = document.createElement('span');
      sp.className = 'mts-btn__spinner';
      this._el.appendChild(sp);
    }
    if (this.iconLeft) {
      const ic = document.createElement('span');
      ic.className = 'mts-btn__icon-left';
      ic.innerHTML = this.iconLeft;
      this._el.appendChild(ic);
    }
    if (!this.iconOnly && this.label) {
      const lbl = document.createElement('span');
      lbl.className   = 'mts-btn__label';
      lbl.textContent = this.label;
      this._el.appendChild(lbl);
    }
    if (this.iconRight) {
      const ic = document.createElement('span');
      ic.className = 'mts-btn__icon-right';
      ic.innerHTML = this.iconRight;
      this._el.appendChild(ic);
    }
  }

  _syncClasses() {
    const previousMatiosClasses = [...this._el.classList].filter(cls =>
      cls === 'mts-btn' || cls.startsWith('mts-btn--')
    );
    if (previousMatiosClasses.length) this._el.classList.remove(...previousMatiosClasses);

    const classes = ['mts-btn', 'mts-btn--' + this.variant];
    if (this.size)      classes.push('mts-btn--' + this.size);
    if (this.block)     classes.push('mts-btn--block');
    if (this.round)     classes.push('mts-btn--round');
    if (this.iconOnly)  classes.push('mts-btn--icon');
    if (this.disabled)  classes.push('mts-btn--disabled');
    if (this.shadow)    classes.push('mts-btn--shadow');
    if (this.ring)      classes.push('mts-btn--ring');
    if (this.className) this.className.split(' ').forEach(c => c && classes.push(c));

    this._el.classList.add(...classes);
  }

  _bindEvents() {
    this._el.addEventListener('click', (e) => {
      if (this.disabled || this.loading) { e.preventDefault(); return; }
      (this._listeners['click'] || []).forEach(fn => fn(e, this));
      this._el.dispatchEvent(new CustomEvent('mts:button:click', {
        bubbles: true, detail: { button: this },
      }));
    });
  }
};

/* â”€â”€ MTS.ButtonGroup â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

MTS.ButtonGroup = class MtsButtonGroup {
  constructor(selector, buttons = [], options = {}) {
    // Target container element / Elemento contenedor
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) { console.error('[MTS.ButtonGroup] Not found / No encontrado:', selector); return; }

    // Mark clicked button as active / Marcar botÃ³n clickeado como activo
    this._activeOnClick = options.activeOnClick ?? true;
    this._syncClasses();
    this._instances     = [];

    buttons.forEach((cfg, idx) => {
      const btn = document.createElement('button');
      btn.type  = 'button';
      this._el.appendChild(btn);

      const originalOnClick = cfg.onClick || null;
      const instance = new MTS.Button(btn, {
        ...cfg,
        // Uniform size for the group / TamaÃ±o uniforme para el grupo
        size:    cfg.size || options.size || '',
        onClick: null,
      });
      this._instances.push(instance);

      btn.addEventListener('click', (e) => {
        if (instance.disabled || instance.loading) return;
        if (this._activeOnClick) this._setActive(idx);
        originalOnClick?.(e, instance);
      });
    });

    this._applyGroupStyles();
  }

  // Set active button by index / Establecer botÃ³n activo por Ã­ndice
  setActive(index) { this._setActive(index); return this; }

  _syncClasses() {
    const keep = Array.from(this._el.classList).filter(cls => !cls.startsWith('mts-btn-group'));
    this._el.className = keep.join(' ');
    this._el.classList.add('mts-btn-group');
  }

  _setActive(activeIdx) {
    this._instances.forEach((inst, i) => {
      inst._el.classList.toggle('mts-btn--active', i === activeIdx);
    });
  }

  _applyGroupStyles() {
    const total = this._instances.length;
    const r     = 'var(--mts-radius-md)';
    this._instances.forEach((inst, i) => {
      const el = inst._el;
      el.style.margin      = '0';
      el.style.borderRight = i < total - 1 ? '0' : '';
      if      (total === 1)        el.style.borderRadius = r;
      else if (i === 0)            el.style.borderRadius = r + ' 0 0 ' + r;
      else if (i === total - 1)    el.style.borderRadius = '0 ' + r + ' ' + r + ' 0';
      else                         el.style.borderRadius = '0';
    });
  }

  // Get all button instances / Obtener todas las instancias de botÃ³n
  getButtons()     { return this._instances; }

  // Get button instance by index / Obtener instancia de botÃ³n por Ã­ndice
  getButton(index) { return this._instances[index] || null; }
};

/* â”€â”€ MTS.MenuButton â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
/*
  BotÃ³n con menÃº desplegable encapsulado.

  const mb = new MTS.MenuButton(container, {
    label:   'Acciones',
    variant: 'secondary',
    items: [
      { label: 'Editar',   icon: MTS.Icon.get('edit-2'), onClick: () => {} },
      { label: 'Duplicar', icon: MTS.Icon.get('copy'),   onClick: () => {} },
      '---',
      { label: 'Eliminar', icon: MTS.Icon.get('trash'),  danger: true, onClick: () => {} },
    ],
  });
*/
MTS.MenuButton = class MtsMenuButton {
  constructor(container, options = {}) {
    this._container = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    if (!this._container) { console.error('[MTS.MenuButton] No encontrado:', container); return; }

    this._items   = options.items   || [];
    this._open    = false;
    this._wrap    = document.createElement('div');
    this._wrap.className = 'mts-menu-wrap';

    /* BotÃ³n trigger */
    const btnEl = document.createElement('button');
    btnEl.type  = 'button';
    this._wrap.appendChild(btnEl);
    this._btn = new MTS.Button(btnEl, {
      label:     options.label    || 'Acciones',
      variant:   options.variant  || 'secondary',
      size:      options.size     || '',
      iconLeft:  options.iconLeft || null,
      iconRight: options.iconRight ?? MTS.Icon?.get('chevron-down', 14) ?? 'â–¾',
      disabled:  options.disabled || false,
    });

    /* Lista del menÃº */
    this._list = document.createElement('div');
    this._list.className = 'mts-menu-list';
    this._wrap.appendChild(this._list);
    this._buildItems();

    this._container.appendChild(this._wrap);
    this._bindEvents();
  }

  _buildItems() {
    this._list.innerHTML = '';
    this._items.forEach(item => {
      if (item === '---') {
        const sep = document.createElement('div');
        sep.className = 'mts-menu-sep';
        this._list.appendChild(sep);
        return;
      }
      const btn = document.createElement('button');
      btn.className = 'mts-menu-item' + (item.danger ? ' mts-menu-item--danger' : '');
      btn.type = 'button';
      if (item.icon) {
        const ic = document.createElement('span');
        ic.className = 'mts-menu-item__icon';
        ic.innerHTML = item.icon;
        btn.appendChild(ic);
      }
      btn.appendChild(document.createTextNode(item.label));
      if (item.disabled) btn.disabled = true;
      btn.addEventListener('click', () => {
        this.close();
        item.onClick?.();
      });
      this._list.appendChild(btn);
    });
  }

  _syncClasses() {
    const previousMatiosClasses = [...this._el.classList].filter(cls =>
      cls === 'mts-btn' || cls.startsWith('mts-btn--')
    );
    if (previousMatiosClasses.length) this._el.classList.remove(...previousMatiosClasses);

    const classes = ['mts-btn', 'mts-btn--' + this.variant];
    if (this.size)      classes.push('mts-btn--' + this.size);
    if (this.block)     classes.push('mts-btn--block');
    if (this.round)     classes.push('mts-btn--round');
    if (this.iconOnly)  classes.push('mts-btn--icon');
    if (this.disabled)  classes.push('mts-btn--disabled');
    if (this.shadow)    classes.push('mts-btn--shadow');
    if (this.ring)      classes.push('mts-btn--ring');
    if (this.className) this.className.split(' ').forEach(c => c && classes.push(c));

    this._el.classList.add(...classes);
  }

  _bindEvents() {
    this._btn._el.addEventListener('click', (e) => {
      e.stopPropagation();
      this._open ? this.close() : this.open();
    });
    document.addEventListener('click', (e) => {
      if (!this._wrap.contains(e.target)) this.close();
    });
  }

  open()  { this._open = true;  this._list.classList.add('mts-menu-list--open');    this._btn._el.classList.add('mts-btn--active'); }
  close() { this._open = false; this._list.classList.remove('mts-menu-list--open'); this._btn._el.classList.remove('mts-btn--active'); }
  toggle(){ this._open ? this.close() : this.open(); }

  setItems(items) { this._items = items; this._buildItems(); }
  getButton()     { return this._btn; }
  destroy()       { this._wrap.remove(); }
};

/* â”€â”€ MTS.SplitButton â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
/*
  BotÃ³n principal + flecha que abre menÃº de opciones.

  const sb = new MTS.SplitButton(container, {
    label:   'Guardar',
    variant: 'primary',
    iconLeft: MTS.Icon.get('save'),
    onClick: () => {},          // acciÃ³n principal
    items: [
      { label: 'Guardar borrador',   onClick: () => {} },
      { label: 'Guardar y publicar', onClick: () => {} },
      '---',
      { label: 'Descartar', danger: true, onClick: () => {} },
    ],
  });
*/
MTS.SplitButton = class MtsSplitButton {
  constructor(container, options = {}) {
    this._container = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    if (!this._container) { console.error('[MTS.SplitButton] No encontrado:', container); return; }

    this._items   = options.items   || [];
    this._open    = false;
    this._variant = options.variant || 'primary';

    this._wrap = document.createElement('div');
    this._wrap.className = 'mts-split-wrap';

    /* BotÃ³n principal */
    const mainEl = document.createElement('button');
    mainEl.type  = 'button';
    this._btnMain = new MTS.Button(mainEl, {
      label:    options.label   || '',
      variant:  this._variant,
      size:     options.size    || '',
      iconLeft: options.iconLeft|| null,
      disabled: options.disabled|| false,
      onClick:  options.onClick || null,
    });

    /* BotÃ³n flecha â€” mismo variant, mismo size, iconOnly */
    const arrowEl = document.createElement('button');
    arrowEl.type  = 'button';
    this._btnArrow = new MTS.Button(arrowEl, {
      variant:  this._variant,
      size:     options.size || '',
      iconLeft: MTS.Icon?.get('chevron-down', 14) ?? 'â–¾',
      iconOnly: true,
      disabled: options.disabled || false,
    });

    /* Lista del menÃº */
    this._list = document.createElement('div');
    this._list.className = 'mts-menu-list mts-menu-list--right';
    this._buildItems();

    this._wrap.appendChild(mainEl);
    this._wrap.appendChild(arrowEl);
    this._wrap.appendChild(this._list);
    this._container.appendChild(this._wrap);
    this._bindEvents();
  }

  _buildItems() {
    this._list.innerHTML = '';
    this._items.forEach(item => {
      if (item === '---') {
        const sep = document.createElement('div');
        sep.className = 'mts-menu-sep';
        this._list.appendChild(sep);
        return;
      }
      const btn = document.createElement('button');
      btn.className = 'mts-menu-item' + (item.danger ? ' mts-menu-item--danger' : '');
      btn.type = 'button';
      if (item.icon) {
        const ic = document.createElement('span');
        ic.className = 'mts-menu-item__icon';
        ic.innerHTML = item.icon;
        btn.appendChild(ic);
      }
      btn.appendChild(document.createTextNode(item.label));
      if (item.disabled) btn.disabled = true;
      btn.addEventListener('click', () => {
        this.close();
        item.onClick?.();
      });
      this._list.appendChild(btn);
    });
  }

  _syncClasses() {
    const previousMatiosClasses = [...this._el.classList].filter(cls =>
      cls === 'mts-btn' || cls.startsWith('mts-btn--')
    );
    if (previousMatiosClasses.length) this._el.classList.remove(...previousMatiosClasses);

    const classes = ['mts-btn', 'mts-btn--' + this.variant];
    if (this.size)      classes.push('mts-btn--' + this.size);
    if (this.block)     classes.push('mts-btn--block');
    if (this.round)     classes.push('mts-btn--round');
    if (this.iconOnly)  classes.push('mts-btn--icon');
    if (this.disabled)  classes.push('mts-btn--disabled');
    if (this.shadow)    classes.push('mts-btn--shadow');
    if (this.ring)      classes.push('mts-btn--ring');
    if (this.className) this.className.split(' ').forEach(c => c && classes.push(c));

    this._el.classList.add(...classes);
  }

  _bindEvents() {
    this._btnArrow._el.addEventListener('click', (e) => {
      e.stopPropagation();
      this._open ? this.close() : this.open();
    });
    document.addEventListener('click', (e) => {
      if (!this._wrap.contains(e.target)) this.close();
    });
  }

  open()  { this._open = true;  this._list.classList.add('mts-menu-list--open');    this._btnArrow._el.classList.add('mts-btn--active'); }
  close() { this._open = false; this._list.classList.remove('mts-menu-list--open'); this._btnArrow._el.classList.remove('mts-btn--active'); }
  toggle(){ this._open ? this.close() : this.open(); }

  setItems(items) { this._items = items; this._buildItems(); }
  getMainButton()  { return this._btnMain;  }
  getArrowButton() { return this._btnArrow; }
  destroy()        { this._wrap.remove(); }
};

