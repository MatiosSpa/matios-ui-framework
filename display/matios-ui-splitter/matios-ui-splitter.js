/* ============================================================
   MATIOS UI — matios-ui-splitter.js
   MTS.Splitter — Paneles redimensionables con drag
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.Splitter = class MtsSplitter {
  /**
   * @param {string|Element} selector  Contenedor con exactamente 2 hijos
   * @param {object} options
   * @param {string}   options.direction   'horizontal'|'vertical' — default: 'horizontal'
   * @param {number}   options.initialSize Tamaño inicial del primer panel en % — default: 50
   * @param {number}   options.minSize     Mínimo en % para cada panel — default: 10
   * @param {number}   options.maxSize     Máximo en % para el primer panel — default: 90
   * @param {boolean}  options.collapsible Permite colapsar paneles con doble click — default: false
   * @param {string}   options.gutterSize  Tamaño del divisor CSS — default: '6px'
   * @param {function} options.onChange    ({ sizes, firstSize, secondSize }) => {}
   * @param {function} options.onDragStart
   * @param {function} options.onDragEnd   ({ sizes }) => {}
   */
  constructor(selector, options = {}) {
    this._el       = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    this.direction   = options.direction   || 'horizontal';
    this._size       = options.initialSize ?? 50;
    this.minSize     = options.minSize     ?? 10;
    this.maxSize     = options.maxSize     ?? 90;
    this.collapsible = options.collapsible ?? false;
    this.gutterSize  = options.gutterSize  || '6px';
    this._onChange   = options.onChange    || null;
    this._onDragStart = options.onDragStart || null;
    this._onDragEnd   = options.onDragEnd   || null;
    this._dragging   = false;
    this._collapsed  = null; // null | 'first' | 'second'
    this._build();
  }

  /* ── API ── */
  setSize(pct)       { this._size = this._clamp(pct); this._applySize(); return this; }
  getSizes()         { return { firstSize: this._size, secondSize: 100 - this._size }; }
  collapseFirst()    { this._collapsePanel('first');  return this; }
  collapseSecond()   { this._collapsePanel('second'); return this; }
  restore()          { this._collapsed = null; this._size = this._prevSize || 50; this._applySize(); return this; }
  destroy()          { this._el.innerHTML = ''; }

  _build() {
    const panels = [...this._el.children];
    if (panels.length < 2) { console.error('[MTS.Splitter] Necesita 2 hijos'); return; }

    const [panelA, panelB] = panels;
    this._panelA = panelA;
    this._panelB = panelB;

    /* Estilos del contenedor */
    this._el.style.display  = 'flex';
    this._el.style.flexDirection = this.direction === 'vertical' ? 'column' : 'row';
    this._el.style.overflow = 'hidden';

    /* Estilos de paneles */
    [panelA, panelB].forEach(p => {
      p.style.overflow = 'hidden';
      p.style.flexShrink = '0';
    });

    /* Gutter */
    const gutter = document.createElement('div');
    gutter.className = 'mts-splitter__gutter mts-splitter__gutter--' + this.direction;
    if (this.direction === 'horizontal') {
      gutter.style.width  = this.gutterSize;
      gutter.style.cursor = 'col-resize';
    } else {
      gutter.style.height = this.gutterSize;
      gutter.style.cursor = 'row-resize';
    }

    /* Drag handle visual */
    const handle = document.createElement('div');
    handle.className = 'mts-splitter__handle';
    gutter.appendChild(handle);

    /* Doble click para colapsar */
    if (this.collapsible) {
      gutter.addEventListener('dblclick', () => {
        if (this._collapsed) this.restore();
        else this.collapseSecond();
      });
    }

    /* Insertar gutter entre los 2 paneles */
    this._el.insertBefore(gutter, panelB);
    this._gutter = gutter;
    this._applySize();
    this._bindDrag(gutter);
  }

  _bindDrag(gutter) {
    const isH = this.direction === 'horizontal';

    const onMove = (clientPos) => {
      if (!this._dragging) return;
      const rect  = this._el.getBoundingClientRect();
      const total = isH ? rect.width : rect.height;
      const pos   = clientPos - (isH ? rect.left : rect.top);
      this._size  = this._clamp((pos / total) * 100);
      this._applySize();
      if (this._onChange) this._onChange(this.getSizes());
    };

    const onMouseMove = (e) => onMove(isH ? e.clientX : e.clientY);
    const onTouchMove = (e) => { e.preventDefault(); onMove(isH ? e.touches[0].clientX : e.touches[0].clientY); };

    const stop = () => {
      if (!this._dragging) return;
      this._dragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup',   stop);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend',  stop);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      gutter.classList.remove('mts-splitter__gutter--dragging');
      if (this._onDragEnd) this._onDragEnd(this.getSizes());
    };

    gutter.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this._dragging = true;
      gutter.classList.add('mts-splitter__gutter--dragging');
      document.body.style.cursor    = isH ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup',   stop);
      if (this._onDragStart) this._onDragStart();
    });

    gutter.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this._dragging = true;
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend',  stop);
      if (this._onDragStart) this._onDragStart();
    }, { passive: false });
  }

  _applySize() {
    if (!this._panelA || !this._panelB) return;
    const isH = this.direction === 'horizontal';
    const prop = isH ? 'width' : 'height';
    this._panelA.style[prop] = this._size + '%';
    this._panelB.style[prop] = (100 - this._size) + '%';
    /* Gutter flex: no shrink/grow */
    this._gutter.style.flexShrink = '0';
  }

  _collapsePanel(which) {
    this._prevSize  = this._size;
    this._collapsed = which;
    this._size = which === 'first' ? 0 : 100;
    this._applySize();
  }

  _clamp(v) { return Math.max(this.minSize, Math.min(this.maxSize, v)); }
};
