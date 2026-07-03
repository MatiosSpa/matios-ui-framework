/* ============================================================
   MATIOS UI — matios-ui-paneldropdown.js
   MTS.PanelDropdown — Panel flotante anclado a un trigger
   0 dependencias.
   Version: 1.0.0

   API:
     new MTS.PanelDropdown(triggerEl, options)
     options.header    { title, badge? } | null
     options.items     [{ id, title, description?, timestamp?, dot?, icon?, unread?, onClick? }]
     options.footer    { label, onClick } | null
     options.width     número en px — default: 320
     options.maxHeight número en px — default: 420
     options.position  'bottom-end' | 'bottom-start' — default: 'bottom-end'
     options.onOpen    function()
     options.onClose   function()

   Métodos:
     .open()
     .close()
     .toggle()
     .setItems(items)
     .setHeaderBadge(n)
     .destroy()

   Eventos:
     open | close
   ============================================================ */

window.MTS = window.MTS || {};

MTS.PanelDropdown = class MtsPanelDropdown {

  /** Instancia actualmente abierta (singleton por documento) */
  static get _current() { return MtsPanelDropdown.__current || null; }
  static set _current(v) { MtsPanelDropdown.__current = v; }

  /**
   * @param {Element}  triggerEl           Elemento que abre/cierra el panel
   * @param {object}   options
   * @param {object}   options.header       { title, badge? } — null para omitir
   * @param {Array}    options.items        Ítems del cuerpo
   * @param {object}   options.footer       { label, onClick } — null para omitir
   * @param {number}   options.width        Ancho del panel en px (default: 320)
   * @param {number}   options.maxHeight    Altura máxima del body en px (default: 420)
   * @param {string}   options.position     'bottom-end' | 'bottom-start' (default: 'bottom-end')
   * @param {function} options.onOpen
   * @param {function} options.onClose
   */
  constructor(triggerEl, options) {
    options = options || {};

    this._trigger   = typeof triggerEl === 'string'
      ? document.querySelector(triggerEl)
      : triggerEl;
    if (!this._trigger) { console.error('[MTS.PanelDropdown] Trigger no encontrado'); return; }

    // Header: { title, badge? } o null
    this._header    = options.header    || null;

    // Items del cuerpo
    this._items     = options.items     || [];

    // Footer: { label, onClick } o null
    this._footer    = options.footer    || null;

    // Ancho del panel en px
    this._width     = options.width     || 320;

    // Altura máxima del body con scroll
    this._maxHeight = options.maxHeight || 420;

    // Posición relativa al trigger
    this._position  = options.position  || 'bottom-end';

    // Listeners internos
    this._listeners = {};
    if (options.onOpen)  this.on('open',  options.onOpen);
    if (options.onClose) this.on('close', options.onClose);

    // Estado
    this._open    = false;
    this._panelEl = null;

    // Click en trigger
    let self = this;
    this._triggerHandler = function(e) {
      e.stopPropagation();
      self.toggle();
    };
    this._trigger.addEventListener('click', this._triggerHandler);

    // Click fuera cierra
    this._docHandler = function(e) {
      if (self._panelEl && !self._panelEl.contains(e.target) && e.target !== self._trigger) {
        self.close();
      }
    };

    // Scroll: reposiciona si el trigger sigue visible; cierra si salió del viewport
    this._scrollHandler = function() {
      if (!self._open) return;
      let r = self._trigger.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) {
        self.close();
      } else {
        self._positionPanel();
      }
    };
  }

  /* ── API pública ──────────────────────────────────────────── */

  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(function(f) { return f !== cb; }); return this; }

  open() {
    if (this._open) return this;
    // Cerrar cualquier otra instancia abierta antes de abrir esta
    let current = MTS.PanelDropdown._current;
    if (current && current !== this) current.close();
    MTS.PanelDropdown._current = this;
    this._open = true;
    this._panelEl = this._buildPanel();
    document.body.appendChild(this._panelEl);
    this._positionPanel();
    document.addEventListener('click', this._docHandler);
    window.addEventListener('scroll', this._scrollHandler, true);
    this._emit('open');
    return this;
  }

  close() {
    if (!this._open) return this;
    this._open = false;
    if (this._panelEl) {
      this._panelEl.remove();
      this._panelEl = null;
    }
    document.removeEventListener('click', this._docHandler);
    window.removeEventListener('scroll', this._scrollHandler, true);
    if (MTS.PanelDropdown._current === this) MTS.PanelDropdown._current = null;
    this._emit('close');
    return this;
  }

  toggle() {
    return this._open ? this.close() : this.open();
  }

  setItems(items) {
    this._items = items || [];
    if (this._open && this._panelEl) {
      let bodyEl = this._panelEl.querySelector('.mts-paneldropdown__body');
      if (bodyEl) {
        bodyEl.innerHTML = '';
        this._renderItems(bodyEl);
      }
    }
    return this;
  }

  setHeaderBadge(n) {
    if (this._header) this._header.badge = n;
    if (this._open && this._panelEl) {
      let badgeEl = this._panelEl.querySelector('.mts-paneldropdown__header-badge');
      if (badgeEl) {
        if (n !== null && n !== undefined && n !== 0) {
          badgeEl.textContent = n;
          badgeEl.style.display = '';
        } else {
          badgeEl.style.display = 'none';
        }
      }
    }
    return this;
  }

  destroy() {
    this.close();
    this._trigger.removeEventListener('click', this._triggerHandler);
    this._listeners = {};
    this._scrollHandler = null;
  }

  /* ── Build del panel ──────────────────────────────────────── */

  _buildPanel() {
    let self  = this;
    let panel = document.createElement('div');
    panel.className = 'mts-paneldropdown';
    panel.style.width = this._width + 'px';

    // Evitar que click dentro del panel lo cierre
    panel.addEventListener('click', function(e) { e.stopPropagation(); });

    // Header
    if (this._header) {
      let header = document.createElement('div');
      header.className = 'mts-paneldropdown__header';

      let title = document.createElement('span');
      title.className = 'mts-paneldropdown__header-title';
      title.textContent = this._header.title || '';
      header.appendChild(title);

      let badge = document.createElement('span');
      badge.className = 'mts-paneldropdown__header-badge';
      if (this._header.badge !== null && this._header.badge !== undefined && this._header.badge !== 0) {
        badge.textContent = this._header.badge;
      } else {
        badge.style.display = 'none';
      }
      header.appendChild(badge);
      panel.appendChild(header);
    }

    // Body
    let body = document.createElement('div');
    body.className = 'mts-paneldropdown__body';
    body.style.maxHeight = this._maxHeight + 'px';
    this._renderItems(body);
    panel.appendChild(body);

    // Footer
    if (this._footer) {
      let footer = document.createElement('div');
      footer.className = 'mts-paneldropdown__footer';

      let footerBtn = document.createElement('button');
      footerBtn.type = 'button';
      footerBtn.className = 'mts-paneldropdown__footer-btn';
      footerBtn.textContent = this._footer.label || '';
      if (this._footer.onClick) {
        footerBtn.addEventListener('click', function() {
          self.close();
          self._footer.onClick();
        });
      }
      footer.appendChild(footerBtn);
      panel.appendChild(footer);
    }

    return panel;
  }

  _renderItems(container) {
    let self = this;
    this._items.forEach(function(item) {

      // Divider
      if (item.divider) {
        let div = document.createElement('div');
        div.className = 'mts-paneldropdown__divider';
        container.appendChild(div);
        return;
      }

      let btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mts-paneldropdown__item' +
        (item.unread ? ' mts-paneldropdown__item--unread' : '');

      // Dot de color
      if (item.dot) {
        let dot = document.createElement('span');
        dot.className = 'mts-paneldropdown__item-dot';
        dot.style.background = item.dot;
        btn.appendChild(dot);
      }

      // Ícono
      if (item.icon) {
        let iconWrap = document.createElement('span');
        iconWrap.className = 'mts-paneldropdown__item-icon';
        let ico = document.createElement('i');
        // Acepta 'user' o 'mts-icon-user' (mismo criterio que MTS.Icon.get)
        let iconCls = item.icon.indexOf('mts-icon-') === 0 ? item.icon : 'mts-icon-' + item.icon;
        ico.className = 'mts-icon ' + iconCls;
        iconWrap.appendChild(ico);
        btn.appendChild(iconWrap);
      }

      // Contenido (title + desc)
      let content = document.createElement('span');
      content.className = 'mts-paneldropdown__item-content';

      let titleEl = document.createElement('span');
      titleEl.className = 'mts-paneldropdown__item-title';
      titleEl.textContent = item.title || '';
      content.appendChild(titleEl);

      if (item.description) {
        let descEl = document.createElement('span');
        descEl.className = 'mts-paneldropdown__item-desc';
        descEl.textContent = item.description;
        content.appendChild(descEl);
      }

      btn.appendChild(content);

      // Timestamp
      if (item.timestamp) {
        let timeEl = document.createElement('span');
        timeEl.className = 'mts-paneldropdown__item-time';
        timeEl.textContent = item.timestamp;
        btn.appendChild(timeEl);
      }

      if (item.onClick) {
        btn.addEventListener('click', function() {
          self.close();
          item.onClick(item);
        });
      }

      container.appendChild(btn);
    });
  }

  /* ── Posicionamiento ──────────────────────────────────────── */

  _positionPanel() {
    if (!this._panelEl || !this._trigger) return;
    let rect        = this._trigger.getBoundingClientRect();
    let panel       = this._panelEl;
    // offsetHeight fuerza reflow síncrono — evita leer 0 antes del primer paint
    let panelHeight = panel.offsetHeight || this._maxHeight;
    let top         = rect.bottom + 6;
    let left;

    if (this._position === 'bottom-start') {
      left = rect.left;
    } else {
      // bottom-end: alinea el borde derecho del panel con el del trigger
      left = rect.right - this._width;
    }

    // Corrección viewport derecho
    if (left + this._width > window.innerWidth - 8) {
      left = window.innerWidth - this._width - 8;
    }
    // Corrección viewport izquierdo
    if (left < 8) { left = 8; }
    // Corrección viewport inferior — usa altura real del panel renderizado
    if (top + panelHeight > window.innerHeight - 8) {
      top = rect.top - panelHeight - 6;
    }
    // Corrección viewport superior (por si el flip queda fuera también)
    if (top < 8) { top = 8; }

    panel.style.top  = top  + 'px';
    panel.style.left = left + 'px';
  }

  /* ── Emit ─────────────────────────────────────────────────── */

  _emit(event, detail) {
    detail = detail || {};
    (this._listeners[event] || []).forEach(function(fn) { fn(detail); });
  }
};
