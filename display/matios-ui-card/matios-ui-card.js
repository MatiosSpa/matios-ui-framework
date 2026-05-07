/* ============================================================
   MATIOS UI — matios-ui-card.js  v1.0.1
   MTS.Card — Card genérica con header, body, footer
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Card = class MtsCard {
  /**
   * @param {string|Element} selector
   * @param {object}  options
   * @param {string}  options.title
   * @param {string}  options.subtitle
   * @param {string|HTMLElement} options.body  HTML string o nodo DOM del cuerpo
   * @param {string}  options.image         URL de imagen
   * @param {string}  options.imageAlt
   * @param {string}  options.imageRatio    'default'|'square'|'wide'
   * @param {string}  options.variant       'flat'|'elevated'|'outlined'|'primary'|'success'|'warning'|'danger'
   * @param {string}  options.size          'sm'|''|'lg'
   * @param {boolean} options.hoverable
   * @param {boolean} options.clickable
   * @param {boolean} options.selected
   * @param {boolean} options.horizontal
   * @param {Array}   options.actions       [{ label, icon, variant, onClick }] â€” en el header
   * @param {Array}   options.footer        [{ label, icon, variant, onClick }] â€” en el footer
   * @param {string}  options.footerAlign   'start'|'end'|'between'|'center'
   * @param {function} options.onClick      Callback si clickable
   */
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) { console.error('[MTS.Card] No encontrado:', selector); return; }

    // Card header title / TÃ­tulo del header
    this.title = options.title ?? null;

    // Card subtitle / SubtÃ­tulo
    this.subtitle = options.subtitle ?? null;

    // Body HTML content / Contenido HTML del cuerpo
    this.body = options.body ?? null;

    // Cover image URL / URL de imagen de portada
    this.image = options.image ?? null;

    // Image alt text / Texto alternativo de la imagen
    this.imageAlt = options.imageAlt ?? '';

    // Image aspect ratio: 'default' | 'square' | 'wide' / RelaciÃ³n de aspecto de la imagen
    this.imageRatio = options.imageRatio ?? 'default';

    // Color variant: 'flat' | 'elevated' | 'outlined' | 'primary' | 'success' | 'warning' | 'danger'
    // Variante de color
    this.variant = options.variant ?? null;

    // Size modifier: '' | 'sm' | 'lg' / Modificador de tamaÃ±o
    this.size = options.size ?? '';

    // Show hover effect / Mostrar efecto hover
    this.hoverable = options.hoverable ?? false;

    // Make card clickable / Hacer la card clickeable
    this.clickable = options.clickable ?? false;

    // Selected state / Estado seleccionado
    this.selected = options.selected ?? false;

    // Horizontal layout / Layout horizontal
    this.horizontal = options.horizontal ?? false;

    // Header action buttons: [{ label, icon, variant, onClick }] / Botones de acciÃ³n en el header
    this.actions = options.actions ?? [];

    // Footer buttons: [{ label, icon, variant, onClick }] / Botones del footer
    this.footer = options.footer ?? [];

    // Footer alignment: 'start' | 'end' | 'between' | 'center' / AlineaciÃ³n del footer
    this.footerAlign = options.footerAlign ?? 'start';

    this._listeners = {};

    // Fires when clickable card is clicked: (e, card) => {} / Se dispara al hacer click en la card clickeable
    if (options.onClick) this.on('click', options.onClick);

    this._build();
  }

  /* â”€â”€ API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }

  setSelected(v) {
    this.selected = v;
    this._el.classList.toggle('mts-card--selected', v);
    return this;
  }

  setTitle(text) {
    this.title = text;
    const el = this._el.querySelector('.mts-card__title');
    if (el) el.textContent = text;
    return this;
  }

  setBody(val) {
    this.body = val;
    const el = this._el.querySelector('.mts-card__body');
    if (el) {
      el.innerHTML = '';
      if (val instanceof Element) {
        el.appendChild(val);
      } else {
        el.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(val) : val;
      }
    }
    return this;
  }

  setLoading(v) {
    this._el.classList.toggle('mts-card--loading', v);
    return this;
  }

  destroy() { this._el.innerHTML = ''; }

  /* â”€â”€ Build â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

  _build() {
    this._syncClasses();
    this._el.innerHTML = '';

    /* Imagen */
    if (this.image) {
      const img = document.createElement('img');
      img.className = 'mts-card__image' +
        (this.imageRatio !== 'default' ? ' mts-card__image--' + this.imageRatio : '');
      img.src = this.image;
      img.alt = this.imageAlt;
      this._el.appendChild(img);
    }

    /* Header */
    if (this.title || this.actions.length) {
      const header = document.createElement('div');
      header.className = 'mts-card__header';

      const content = document.createElement('div');
      content.className = 'mts-card__header-content';

      if (this.title) {
        const title = document.createElement('div');
        title.className = 'mts-card__title';
        title.textContent = this.title;
        content.appendChild(title);
      }

      if (this.subtitle) {
        const sub = document.createElement('div');
        sub.className = 'mts-card__subtitle';
        sub.textContent = this.subtitle;
        content.appendChild(sub);
      }

      header.appendChild(content);

      if (this.actions.length) {
        const acts = document.createElement('div');
        acts.className = 'mts-card__header-actions';
        this.actions.forEach(a => {
          const btn = document.createElement('button');
          btn.className = 'mts-btn mts-btn--' + (a.variant || 'ghost') + ' mts-btn--sm';
          if (a.icon) { const _s = document.createElement('span'); _s.className = 'mts-btn__icon'; _s.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(a.icon) : a.icon; btn.appendChild(_s); }
          if (a.label) { const _s = document.createElement('span'); _s.textContent = a.label; btn.appendChild(_s); }
          if (a.onClick) btn.addEventListener('click', e => { e.stopPropagation(); a.onClick(e); });
          acts.appendChild(btn);
        });
        header.appendChild(acts);
      }

      this._el.appendChild(header);
    }

    /* Body */
    if (this.body !== null) {
      const body = document.createElement('div');
      body.className = 'mts-card__body';
      if (this.body instanceof Element) {
        body.appendChild(this.body);
      } else {
        body.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(this.body) : this.body;
      }
      this._el.appendChild(body);
    }

    /* Footer */
    if (this.footer.length) {
      const footer = document.createElement('div');
      footer.className = 'mts-card__footer mts-card__footer--' + this.footerAlign;
      this.footer.forEach(f => {
        const btn = document.createElement('button');
        btn.className = 'mts-btn mts-btn--' + (f.variant || 'secondary') + ' mts-btn--sm';
          if (f.icon) { const _s = document.createElement('span'); _s.className = 'mts-btn__icon'; _s.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(f.icon) : f.icon; btn.appendChild(_s); }
          if (f.label) { const _s = document.createElement('span'); _s.textContent = f.label; btn.appendChild(_s); }
        if (f.onClick) btn.addEventListener('click', e => { e.stopPropagation(); f.onClick(e); });
        footer.appendChild(btn);
      });
      this._el.appendChild(footer);
    }

    /* Click */
    if (this.clickable) {
      this._el.addEventListener('click', (e) => this._emit('click', { event: e, card: this }));
    }
  }

  _syncClasses() {
    const previousMatiosClasses = [...this._el.classList].filter(cls =>
      cls === 'mts-card' || cls.startsWith('mts-card--')
    );
    if (previousMatiosClasses.length) this._el.classList.remove(...previousMatiosClasses);

    const classes = ['mts-card'];
    if (this.variant)    classes.push('mts-card--' + this.variant);
    if (this.size)       classes.push('mts-card--' + this.size);
    if (this.hoverable)  classes.push('mts-card--hoverable');
    if (this.clickable)  classes.push('mts-card--clickable');
    if (this.selected)   classes.push('mts-card--selected');
    if (this.horizontal) classes.push('mts-card--horizontal');
    this._el.classList.add(...classes);
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el?.dispatchEvent(new CustomEvent(`mts:card:${event}`, { bubbles: true, detail }));
  }
};

