/* ============================================================
   MATIOS UI — matios-ui-card.js  v1.0.0
   MTS.Card — Card genérica con header, body, footer
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Card = class MtsCard {
  /**
   * @param {string|Element} selector
   * @param {object}  options
   * @param {string}  options.title
   * @param {string}  options.subtitle
   * @param {string}  options.body          HTML del cuerpo
   * @param {string}  options.image         URL de imagen
   * @param {string}  options.imageAlt
   * @param {string}  options.imageRatio    'default'|'square'|'wide'
   * @param {string}  options.variant       'flat'|'elevated'|'outlined'|'primary'|'success'|'warning'|'danger'
   * @param {string}  options.size          'sm'|''|'lg'
   * @param {boolean} options.hoverable
   * @param {boolean} options.clickable
   * @param {boolean} options.selected
   * @param {boolean} options.horizontal
   * @param {Array}   options.actions       [{ label, icon, variant, onClick }] — en el header
   * @param {Array}   options.footer        [{ label, icon, variant, onClick }] — en el footer
   * @param {string}  options.footerAlign   'start'|'end'|'between'|'center'
   * @param {function} options.onClick      Callback si clickable
   */
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) { console.error('[MTS.Card] No encontrado:', selector); return; }

    this.title       = options.title       ?? null;
    this.subtitle    = options.subtitle    ?? null;
    this.body        = options.body        ?? null;
    this.image       = options.image       ?? null;
    this.imageAlt    = options.imageAlt    ?? '';
    this.imageRatio  = options.imageRatio  ?? 'default';
    this.variant     = options.variant     ?? null;
    this.size        = options.size        ?? '';
    this.hoverable   = options.hoverable   ?? false;
    this.clickable   = options.clickable   ?? false;
    this.selected    = options.selected    ?? false;
    this.horizontal  = options.horizontal  ?? false;
    this.actions     = options.actions     ?? [];
    this.footer      = options.footer      ?? [];
    this.footerAlign = options.footerAlign ?? 'start';
    this._onClick    = options.onClick     ?? null;

    this._build();
  }

  /* ── API ──────────────────────────────────────────────── */

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

  setBody(html) {
    this.body = html;
    const el = this._el.querySelector('.mts-card__body');
    if (el) el.innerHTML = html;
    return this;
  }

  setLoading(v) {
    this._el.classList.toggle('mts-card--loading', v);
    return this;
  }

  destroy() { this._el.innerHTML = ''; this._el.className = ''; }

  /* ── Build ────────────────────────────────────────────── */

  _build() {
    const classes = ['mts-card'];
    if (this.variant)    classes.push('mts-card--' + this.variant);
    if (this.size)       classes.push('mts-card--' + this.size);
    if (this.hoverable)  classes.push('mts-card--hoverable');
    if (this.clickable)  classes.push('mts-card--clickable');
    if (this.selected)   classes.push('mts-card--selected');
    if (this.horizontal) classes.push('mts-card--horizontal');
    this._el.className = classes.join(' ');
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
          btn.innerHTML = (a.icon ? `<span class="mts-btn__icon">${a.icon}</span>` : '') +
            (a.label ? `<span>${a.label}</span>` : '');
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
      body.innerHTML = this.body;
      this._el.appendChild(body);
    }

    /* Footer */
    if (this.footer.length) {
      const footer = document.createElement('div');
      footer.className = 'mts-card__footer mts-card__footer--' + this.footerAlign;
      this.footer.forEach(f => {
        const btn = document.createElement('button');
        btn.className = 'mts-btn mts-btn--' + (f.variant || 'secondary') + ' mts-btn--sm';
        btn.innerHTML = (f.icon ? `<span class="mts-btn__icon">${f.icon}</span>` : '') +
          (f.label ? `<span>${f.label}</span>` : '');
        if (f.onClick) btn.addEventListener('click', e => { e.stopPropagation(); f.onClick(e); });
        footer.appendChild(btn);
      });
      this._el.appendChild(footer);
    }

    /* Click */
    if (this.clickable && this._onClick) {
      this._el.addEventListener('click', (e) => this._onClick(e, this));
    }
  }
};
