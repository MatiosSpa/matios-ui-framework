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
   * @param {Array}    options.items      [{ id, title, content, icon?, open?, disabled? }]
   * @param {boolean}  options.multiple   Permite múltiples abiertos — default: false
   * @param {boolean}  options.flush      Sin bordes/card — default: false
   * @param {function} options.onOpen
   * @param {function} options.onClose
   */
  constructor(selector, options = {}) {
    this._el      = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    this.items    = options.items    || [];
    this.multiple = options.multiple ?? false;
    this.flush    = options.flush    ?? false;
    this._open    = new Set(this.items.filter(i => i.open).map(i => i.id));
    this._listeners = {};
    if (options.onOpen)  this.on('open',  options.onOpen);
    if (options.onClose) this.on('close', options.onClose);
    this._build();
  }

  open(id)    { this._toggle(id, true);  return this; }
  close(id)   { this._toggle(id, false); return this; }
  toggle(id)  { this._toggle(id, !this._open.has(id)); return this; }
  openAll()   { this.items.forEach(i => this._toggle(i.id, true));  return this; }
  closeAll()  { this.items.forEach(i => this._toggle(i.id, false)); return this; }
  isOpen(id)  { return this._open.has(id); }
  on(e, cb)   { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  destroy()   { this._el.innerHTML = ''; }

  _build() {
    this._el.className = 'mts-accordion' + (this.flush ? ' mts-accordion--flush' : '');
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

    if (item.icon) { const ic = document.createElement('span'); ic.className = 'mts-accordion__icon'; ic.innerHTML = item.icon; header.appendChild(ic); }
    const title = document.createElement('span'); title.className = 'mts-accordion__title'; title.textContent = item.title; header.appendChild(title);
    const arrow = document.createElement('span'); arrow.className = 'mts-accordion__arrow';
    arrow.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    header.appendChild(arrow);

    header.addEventListener('click', () => { if (!item.disabled) this.toggle(item.id); });
    header.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(item.id); }});

    const body = document.createElement('div');
    body.className = 'mts-accordion__body' + (this._open.has(item.id) ? ' mts-accordion__body--open' : '');
    body.id = `mts-acc-body-${item.id}`;
    body.setAttribute('role', 'region');

    const inner = document.createElement('div');
    inner.className = 'mts-accordion__content';
    if (typeof item.content === 'string') inner.innerHTML = item.content;
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
    if (open) { body.style.maxHeight = body.scrollHeight + 'px'; }
    else { body.style.maxHeight = '0'; }
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:accordion:${event}`, { bubbles: true, detail }));
  }
};
