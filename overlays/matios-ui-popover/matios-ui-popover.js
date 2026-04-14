/* ============================================================
   MATIOS UI — matios-ui-popover.js
   MTS.Popover — Tooltip enriquecido con contenido HTML
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.Popover = class MtsPopover {
  /**
   * @param {string|Element} target
   * @param {object} options
   * @param {string}   options.title     Título del popover
   * @param {string}   options.content   Contenido HTML o texto
   * @param {string}   options.position  'top'|'bottom'|'left'|'right' — default: 'bottom'
   * @param {string}   options.trigger   'click'|'hover' — default: 'click'
   * @param {number}   options.offset    Separación en px — default: 8
   * @param {boolean}  options.arrow     Muestra flecha — default: true
   * @param {boolean}  options.closable  Botón × en header — default: true
   * @param {string}   options.width     Ancho CSS — default: '260px'
   * @param {function} options.onShow
   * @param {function} options.onHide
   */
  constructor(target, options = {}) {
    this._target   = typeof target === 'string' ? document.querySelector(target) : target;
    if (!this._target) return;
    /* ── data-* → inicialización HTML declarativa ── */
    const _ds = this._target?.dataset || {};
    const _fromHTML = {};
    if (_ds.title !== undefined) _fromHTML.title = _ds.title;
    if (_ds.content !== undefined) _fromHTML.content = _ds.content;
    if (_ds.position !== undefined) _fromHTML.position = _ds.position;
    if (_ds.trigger !== undefined) _fromHTML.trigger = _ds.trigger;
    if (_ds.closable !== undefined) _fromHTML.closable = true;
    if (_ds.width !== undefined) _fromHTML.width = _ds.width;
    options = { ..._fromHTML, ...options };

    // Popover title / Título del popover
    this.title = options.title || '';

    // Body content — HTML or text / Contenido del cuerpo — HTML o texto
    this.content = options.content || '';

    // Position: 'top' | 'bottom' | 'left' | 'right' / Posición
    this.position = options.position || 'bottom';

    // Open trigger: 'click' | 'hover' / Evento de apertura
    this.trigger = options.trigger || 'click';

    // Gap between target and popover in px / Separación en px entre target y popover
    this.offset = options.offset ?? 8;

    // Show arrow / Mostrar flecha
    this.arrow = options.arrow ?? true;

    // Show close button in header / Mostrar botón × en el header
    this.closable = options.closable ?? true;

    // Popover width / Ancho del popover
    this.width = options.width || '260px';

    this._pop     = null;
    this._visible = false;
    this._listeners = {};

    // Fires when popover shows / Se dispara al mostrar el popover
    if (options.onShow) this.on('show', options.onShow);

    // Fires when popover hides / Se dispara al ocultar el popover
    if (options.onHide) this.on('hide', options.onHide);

    this._init();
  }

  show()    { this._open(); return this; }
  hide()    { this._close(); return this; }
  toggle()  { this._visible ? this._close() : this._open(); return this; }
  setContent(html) { this.content = html; if (this._pop) this._pop.querySelector('.mts-popover__body').innerHTML = html; return this; }
  destroy() { this._close(); this._target?.removeEventListener('click', this._clickHandler); }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }

  _init() {
    if (this.trigger === 'manual') {
      /* Modo manual — sin bindings automáticos, solo Escape */
    } else if (this.trigger === 'click') {
      this._clickHandler = (e) => { e.stopPropagation(); this.toggle(); };
      this._target.addEventListener('click', this._clickHandler);
      document.addEventListener('click', (e) => {
        if (this._pop && !this._pop.contains(e.target) && e.target !== this._target) this._close();
      });
    } else {
      /* hover */
      this._target.addEventListener('mouseenter', () => this._open());
      this._target.addEventListener('mouseleave', (e) => {
        if (!this._pop?.contains(e.relatedTarget)) this._close();
      });
    }
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') this._close(); });
  }

  _open() {
    if (this._visible) return;
    this._close();

    const pop = document.createElement('div');
    pop.className = 'mts-popover mts-popover--' + this.position;
    pop.style.width = this.width;
    pop.addEventListener('click', e => e.stopPropagation());

    if (this.arrow) {
      const arr = document.createElement('div');
      arr.className = 'mts-popover__arrow';
      pop.appendChild(arr);
    }

    if (this.title || this.closable) {
      const hdr = document.createElement('div');
      hdr.className = 'mts-popover__header';
      if (this.title) {
        const t = document.createElement('div');
        t.className = 'mts-popover__title';
        t.textContent = this.title;
        hdr.appendChild(t);
      }
      if (this.closable) {
        const x = document.createElement('button');
        x.type = 'button';
        x.className = 'mts-popover__close';
        x.innerHTML = '×';
        x.addEventListener('click', () => this._close());
        hdr.appendChild(x);
      }
      pop.appendChild(hdr);
    }

    const body = document.createElement('div');
    body.className = 'mts-popover__body';
    body.innerHTML = this.content;
    pop.appendChild(body);

    if (this.trigger === 'hover') {
      pop.addEventListener('mouseenter', () => clearTimeout(this._hideTimer));
      pop.addEventListener('mouseleave', () => this._close());
    }

    document.body.appendChild(pop);
    this._pop     = pop;
    this._visible = true;
    this._position();

    requestAnimationFrame(() => pop.classList.add('mts-popover--visible'));
    this._emit('show', {});
  }

  _close() {
    if (!this._pop) return;
    this._pop.remove();
    this._pop     = null;
    this._visible = false;
    this._emit('hide', {});
  }

  _position() {
    const tr  = this._target.getBoundingClientRect();
    const pop = this._pop;
    pop.style.position = 'fixed';
    pop.style.zIndex   = '9000';

    /* Posición temporal para medir */
    pop.style.top  = '0';
    pop.style.left = '0';
    const pr = pop.getBoundingClientRect();

    const off = this.offset;
    let top, left;
    switch (this.position) {
      case 'bottom': top = tr.bottom + off;              left = tr.left + tr.width/2 - pr.width/2;  break;
      case 'top':    top = tr.top - pr.height - off;     left = tr.left + tr.width/2 - pr.width/2;  break;
      case 'right':  top = tr.top + tr.height/2 - pr.height/2; left = tr.right + off;               break;
      case 'left':   top = tr.top + tr.height/2 - pr.height/2; left = tr.left - pr.width - off;     break;
    }
    /* Clamp al viewport */
    left = Math.max(8, Math.min(left, window.innerWidth  - pr.width  - 8));
    top  = Math.max(8, Math.min(top,  window.innerHeight - pr.height - 8));
    pop.style.left = left + 'px';
    pop.style.top  = top  + 'px';
  }
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._target?.dispatchEvent(new CustomEvent(`mts:popover:${event}`, { bubbles: true, detail }));
  }
};
