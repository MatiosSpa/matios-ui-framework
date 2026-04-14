/* ============================================================
   MATIOS UI — matios-ui-breadcrumb.js
   MTS.Breadcrumb — Ruta de navegación
   Eventos DOM: mts:breadcrumb:click
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Breadcrumb = class MtsBreadcrumb {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {Array}    options.items      [{ label, href?, onClick?, icon? }]
   * @param {string}   options.separator  HTML del separador — default: '/'
   * @param {number}   options.maxItems   Colapsa si supera — default: null
   * @param {function} options.onClick
   */
  constructor(selector, options = {}) {
    this._el       = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    // Breadcrumb items: [{ label, href?, onClick?, icon? }]
    // Ítems del breadcrumb
    this.items = options.items || [];

    // Separator HTML between items / HTML del separador entre ítems
    this.separator = options.separator || '/';

    // Collapse if items exceed this count (null = no collapse)
    // Colapsar si los ítems superan este número (null = sin colapso)
    this.maxItems = options.maxItems || null;

    this._collapsed = true;
    this._listeners = {};

    // Fires when a breadcrumb item is clicked: (e) => e.detail.item
    // Se dispara al hacer click en un ítem
    if (options.onClick) this.on('click', options.onClick);
    this._build();
  }

  setItems(items) { this.items = items; this._build(); return this; }
  push(item)      { this.items.push(item); this._build(); return this; }
  pop()           { this.items.pop(); this._build(); return this; }
  on(e, cb)       { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  destroy()       { this._el.innerHTML = ''; }

  _build() {
    this._el.innerHTML = '';
    this._el.setAttribute('aria-label', 'Ruta de navegación');

    const nav = document.createElement('nav');
    nav.className = 'mts-breadcrumb';
    const ol = document.createElement('ol');
    ol.className = 'mts-breadcrumb__list';

    let items = [...this.items];
    let collapsed = false;

    if (this.maxItems && items.length > this.maxItems && this._collapsed) {
      const first = items[0];
      const last  = items.slice(-(this.maxItems - 1));
      items = [first, { label: '...', _ellipsis: true }, ...last];
      collapsed = true;
    }

    items.forEach((item, idx) => {
      const li = document.createElement('li');
      li.className = 'mts-breadcrumb__item';
      const isLast = idx === items.length - 1;

      if (item._ellipsis) {
        const btn = document.createElement('button');
        btn.className   = 'mts-breadcrumb__ellipsis';
        btn.textContent = '...';
        btn.setAttribute('aria-label', 'Mostrar ruta completa');
        btn.addEventListener('click', () => { this._collapsed = false; this._build(); });
        li.appendChild(btn);
      } else if (isLast || (!item.href && !item.onClick)) {
        const span = document.createElement('span');
        span.className = 'mts-breadcrumb__current';
        span.setAttribute('aria-current', isLast ? 'page' : undefined);
        if (item.icon) { const ic = document.createElement('span'); ic.innerHTML = item.icon; span.appendChild(ic); }
        span.appendChild(document.createTextNode(item.label));
        li.appendChild(span);
      } else {
        const a = item.href ? document.createElement('a') : document.createElement('button');
        a.className = 'mts-breadcrumb__link';
        if (item.href) a.href = item.href;
        if (item.icon) { const ic = document.createElement('span'); ic.innerHTML = item.icon; a.appendChild(ic); }
        a.appendChild(document.createTextNode(item.label));
        a.addEventListener('click', (e) => {
          if (!item.href) e.preventDefault();
          if (item.onClick) item.onClick(item);
          this._emit('click', { item, index: idx });
        });
        li.appendChild(a);
      }

      if (!isLast) {
        const sep = document.createElement('span');
        sep.className = 'mts-breadcrumb__separator';
        sep.innerHTML = this.separator;
        sep.setAttribute('aria-hidden', 'true');
        li.appendChild(sep);
      }
      ol.appendChild(li);
    });

    nav.appendChild(ol);
    this._el.appendChild(nav);
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:breadcrumb:${event}`, { bubbles: true, detail }));
  }
};
