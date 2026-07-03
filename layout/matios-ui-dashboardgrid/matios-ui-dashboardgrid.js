/* ============================================================
   MATIOS UI — matios-ui-dashboardgrid.js
   MTS.DashboardGrid — Grid de dashboard con drag-drop y tray
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DashboardGrid = class MtsDashboardGrid {

  /**
   * @param {string|Element} selector  Contenedor del componente
   * @param {object}         options
   * @param {number}         options.columns             Columnas del grid (default 12)
   * @param {number}         options.rowHeight           Alto de fila en px (default 80)
   * @param {number}         options.gap                 Gap en px (default 12)
   * @param {boolean}        options.editable            Modo edición (default false)
   * @param {string}         options.collisionMode       'displace' | 'block' (default 'displace')
   * @param {number}         options.emptyAreaMinHeight  Min-height en px aplicado al grid interno
   *                                                     cuando esta vacio. Evita que _isOverGrid()
   *                                                     devuelva false porque rect.height = 0
   *                                                     (necesario para que el drag desde el tray
   *                                                     pueda registrar drop en grid vacio).
   *                                                     Default: 0 (sin min-height).
   * @param {string}         options.accent              Color de la franja superior decorativa de
   *                                                     cada item. Identidad visual del dashboard
   *                                                     aportada por el grid (no por el contenido).
   *                                                     null (default) | 'primary' | 'success' |
   *                                                     'warning' | 'danger' | 'info'.
   * @param {function}       options.onItemMounted       Callback invocado por cada item DESPUES de
   *                                                     inyectar su html en el __content. Recibe
   *                                                     (el, item). Util para que el consumidor
   *                                                     active bindings declarativos (data-mts-bind),
   *                                                     instancie sub-componentes (MTS.Chart,
   *                                                     MTS.DataTable), conecte listeners, etc.
   *                                                     El backend NO puede inyectar JS (innerHTML
   *                                                     pasa por MTS.Sanitize si esta disponible).
   *                                                     El frontend que pasa este callback SI puede.
   *                                                     Default: null.
   * @param {Array}          options.items               Widgets actuales en el grid
   * @param {Array}          options.availableItems      Widgets disponibles en el tray
   * @param {function}       options.onWidgetsChange     Callback con layout actualizado
   */
  constructor(selector, options) {
    options = options || {};

    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!this._el) {
      console.error('[MTS.DashboardGrid] Elemento no encontrado:', selector);
      return;
    }

    this._columns            = options.columns            || 12;
    this._rowHeight          = options.rowHeight          || 80;
    this._gap                = options.gap                || 12;
    this._editable           = !!options.editable;
    this._collisionMode      = options.collisionMode      || 'displace';
    this._emptyAreaMinHeight = options.emptyAreaMinHeight || 0;
    this._accent             = options.accent             || null;
    this._onItemMounted      = typeof options.onItemMounted === 'function' ? options.onItemMounted : null;
    this._debug              = !!options.debug;
    this._items              = this._cloneItems(options.items         || []);
    this._availableItems     = this._cloneItems(options.availableItems|| []);
    this._onWidgetsChange    = options.onWidgetsChange    || null;

    // Estado de drag activo
    this._dragState     = null;
    // Referencia al elemento placeholder dentro del grid
    this._placeholderEl = null;
    // Ghost que sigue al cursor en drag desde tray
    this._ghostEl       = null;

    // Handlers bound para poder removerlos
    this._boundMousemove = this._onDocMousemove.bind(this);
    this._boundMouseup   = this._onDocMouseup.bind(this);
    this._boundKeydown   = this._onDocKeydown.bind(this);

    this._build();
  }

  /* ════════════════════════════════════════════════════
     I18N
     ════════════════════════════════════════════════════ */

  /** Resuelve una key de i18n del namespace MTS.DashboardGrid; usa fallback si no existe */
  _t(key, fallback) {
    const loc = (window.MTS && typeof MTS.getString === 'function')
      ? MTS.getString()['MTS.DashboardGrid']
      : null;
    return (loc && loc[key] != null) ? loc[key] : fallback;
  }

  /* ════════════════════════════════════════════════════
     API PÚBLICA
     ════════════════════════════════════════════════════ */

  /** Reemplaza los items del grid y re-renderiza */
  setItems(items) {
    this._items = this._cloneItems(items || []);
    this._renderItems();
    return this;
  }

  /** Reemplaza los items del tray */
  setAvailableItems(items) {
    this._availableItems = this._cloneItems(items || []);
    this._renderTray();
    return this;
  }

  /** Activa o desactiva el modo edición */
  setEditable(editable) {
    this._editable = !!editable;
    this._el.classList.toggle('mts-dashboardgrid--editable', this._editable);
    this._renderItems();
    this._renderTray();
    return this;
  }

  /** Retorna snapshot del layout actual (solo id, col, row, w, h) */
  getItems() {
    return this._items.map(function(item) {
      return { id: item.id, col: item.col, row: item.row, w: item.w, h: item.h };
    });
  }

  /** Agrega un item programáticamente — busca primera posición libre */
  addItem(item) {
    const w   = item.w || 1;
    const h   = item.h || 1;
    const pos = this._findFirstFreePosition(w, h);
    const newItem = Object.assign({}, item, { col: pos.col, row: pos.row });
    this._items.push(newItem);
    this._buildItemElement(newItem);
    this._emitChange();
    return this;
  }

  /** Elimina un item del grid programáticamente */
  removeItem(id) {
    const self = this;
    this._items = this._items.filter(function(i) { return i.id !== id; });
    const el = self._gridEl.querySelector('[data-dg-id="' + id + '"]');
    if (el) el.remove();
    this._emitChange();
    return this;
  }

  /** Limpia listeners y DOM */
  destroy() {
    this._stopDrag();
    document.removeEventListener('mousemove', this._boundMousemove);
    document.removeEventListener('mouseup',   this._boundMouseup);
    document.removeEventListener('keydown',   this._boundKeydown);
    while (this._el.firstChild) this._el.removeChild(this._el.firstChild);
    this._el.classList.remove('mts-dashboardgrid', 'mts-dashboardgrid--editable');
  }

  /* ════════════════════════════════════════════════════
     CONSTRUCCIÓN DEL DOM
     ════════════════════════════════════════════════════ */

  _build() {
    while (this._el.firstChild) this._el.removeChild(this._el.firstChild);
    this._el.classList.add('mts-dashboardgrid');
    if (this._editable) this._el.classList.add('mts-dashboardgrid--editable');

    // Modifier de accent (solo si esta configurado)
    if (this._accent) {
      this._el.classList.add('mts-dashboardgrid--accent-' + this._accent);
    }

    // Grid (compone con mts-grid del framework base)
    this._gridEl = document.createElement('div');
    this._gridEl.className = 'mts-dashboardgrid__grid mts-grid';
    this._gridEl.style.setProperty('--mts-columns',       this._columns);
    this._gridEl.style.setProperty('--mts-gap',           this._gap + 'px');
    this._gridEl.style.setProperty('--mts-dg-row-height', this._rowHeight + 'px');
    // Min-height del grid para garantizar area de drop cuando esta vacio
    // (sin esto, _isOverGrid() devuelve false porque rect.height = 0)
    if (this._emptyAreaMinHeight > 0) {
      this._gridEl.style.minHeight = this._emptyAreaMinHeight + 'px';
    }
    this._el.appendChild(this._gridEl);

    // Tray
    this._trayEl = document.createElement('aside');
    this._trayEl.className = 'mts-dashboardgrid__tray';
    this._el.appendChild(this._trayEl);

    this._renderItems();
    this._renderTray();
  }

  /* ────────────────────────────────────────
     ITEMS
     ──────────────────────────────────────── */

  _renderItems() {
    const existing = this._gridEl.querySelectorAll('.mts-dashboardgrid__item');
    existing.forEach(function(el) { el.remove(); });

    const self = this;
    this._items.forEach(function(item) {
      self._buildItemElement(item);
    });
  }

  _buildItemElement(item) {
    const self = this;

    const el = document.createElement('div');
    el.className = 'mts-dashboardgrid__item';
    el.setAttribute('data-dg-id', item.id);
    el.setAttribute('tabindex', '0');
    if (item.title) el.setAttribute('aria-label', item.title);
    if (item.locked) el.classList.add('mts-dashboardgrid__item--locked');

    this._applyItemPosition(el, item);

    // Controles de edición (solo si editable y no locked)
    if (this._editable && !item.locked) {
      // Drag handle
      const dragHandle = document.createElement('div');
      dragHandle.className = 'mts-dashboardgrid__drag-handle';
      const dragLabel = this._t('dragHandle', 'Mover widget');
      dragHandle.setAttribute('aria-label', dragLabel);
      dragHandle.setAttribute('title', dragLabel);
      dragHandle.setAttribute('role', 'button');
      dragHandle.setAttribute('tabindex', '0');

      const dragIcon = document.createElement('span');
      dragIcon.className = 'mts-dashboardgrid__drag-icon';
      dragIcon.setAttribute('aria-hidden', 'true');
      dragHandle.appendChild(dragIcon);
      el.appendChild(dragHandle);

      dragHandle.addEventListener('mousedown', function(e) {
        self._startDragMove(e, item, el);
      });
      dragHandle.addEventListener('keydown', function(e) {
        self._onHandleKeydown(e, item, el);
      });

      // Botón eliminar
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'mts-dashboardgrid__remove-btn';
      const removeLabel = this._t('removeWidget', 'Eliminar widget');
      removeBtn.setAttribute('aria-label', removeLabel);
      removeBtn.setAttribute('title', removeLabel);
      removeBtn.textContent = '×';
      el.appendChild(removeBtn);

      removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        self._sendToTray(item.id);
      });

      // Resize handle
      const resizeHandle = document.createElement('div');
      resizeHandle.className = 'mts-dashboardgrid__resize-handle';
      const resizeLabel = this._t('resizeHandle', 'Redimensionar widget');
      resizeHandle.setAttribute('aria-label', resizeLabel);
      resizeHandle.setAttribute('title', resizeLabel);
      resizeHandle.setAttribute('role', 'button');
      resizeHandle.setAttribute('tabindex', '0');
      el.appendChild(resizeHandle);

      resizeHandle.addEventListener('mousedown', function(e) {
        self._startResize(e, item, el);
      });
    }

    // Title bar (solo si el item declara title)
    if (item.title) {
      const titleBar = document.createElement('div');
      titleBar.className = 'mts-dashboardgrid__title-bar';

      const titleEl = document.createElement('div');
      titleEl.className = 'mts-dashboardgrid__title';
      titleEl.textContent = item.title;
      titleBar.appendChild(titleEl);

      el.appendChild(titleBar);
    }

    // Contenido del widget — solo el "interior" semantico, sin wrappers
    const content = document.createElement('div');
    content.className = 'mts-dashboardgrid__content';
    if (item.html) {
      content.innerHTML = (typeof MTS !== 'undefined' && MTS.Sanitize)
        ? MTS.Sanitize.html(item.html)
        : item.html;
    }
    el.appendChild(content);

    this._gridEl.appendChild(el);

    // Hook: el consumidor puede activar bindings, instanciar sub-componentes,
    // conectar listeners, etc. SOLO el frontend ejecuta este callback — el
    // backend nunca llega a este punto (el HTML del backend pasa por
    // MTS.Sanitize antes de ser inyectado, asi que <script> y on* se eliminan).
    if (this._onItemMounted) {
      try {
        this._onItemMounted(el, item);
      } catch (e) {
        if (this._debug && window.console && console.error) {
          console.error('[MTS.DashboardGrid] onItemMounted threw:', e);
        }
      }
    }

    return el;
  }

  _applyItemPosition(el, item) {
    el.style.setProperty('--mts-dg-col', item.col);
    el.style.setProperty('--mts-dg-row', item.row);
    el.style.setProperty('--mts-dg-w',   item.w);
    el.style.setProperty('--mts-dg-h',   item.h);
  }

  /* ────────────────────────────────────────
     TRAY
     ──────────────────────────────────────── */

  _renderTray() {
    while (this._trayEl.firstChild) this._trayEl.removeChild(this._trayEl.firstChild);

    if (!this._editable) {
      this._trayEl.style.display = 'none';
      return;
    }
    this._trayEl.style.display = '';

    const title = document.createElement('div');
    title.className = 'mts-dashboardgrid__tray-title';
    title.textContent = this._t('trayTitle', 'Widgets disponibles');
    this._trayEl.appendChild(title);

    if (this._availableItems.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'mts-dashboardgrid__tray-empty';
      empty.textContent = this._t('trayEmpty', 'Todos los widgets están en el dashboard');
      this._trayEl.appendChild(empty);
      return;
    }

    const self = this;
    this._availableItems.forEach(function(item) {
      const trayItem = document.createElement('div');
      trayItem.className = 'mts-dashboardgrid__tray-item';
      trayItem.setAttribute('data-dg-id', item.id);
      trayItem.setAttribute('tabindex', '0');
      trayItem.setAttribute('title', item.title || item.id);

      const icon = document.createElement('span');
      icon.className = 'mts-dashboardgrid__tray-icon';
      icon.setAttribute('aria-hidden', 'true');
      trayItem.appendChild(icon);

      const label = document.createElement('span');
      label.className = 'mts-dashboardgrid__tray-label';
      label.textContent = item.title || item.id;
      trayItem.appendChild(label);

      const size = document.createElement('span');
      size.className = 'mts-dashboardgrid__tray-size';
      size.textContent = (item.w || 1) + '×' + (item.h || 1);
      trayItem.appendChild(size);

      trayItem.addEventListener('mousedown', function(e) {
        self._startDragTray(e, item, trayItem);
      });

      self._trayEl.appendChild(trayItem);
    });
  }

  /* ════════════════════════════════════════════════════
     DRAG — MOVER (item del grid)
     ════════════════════════════════════════════════════ */

  _startDragMove(e, item, el) {
    if (item.locked) return;
    e.preventDefault();
    e.stopPropagation();

    this._dragState = {
      type:       'move',
      item:       Object.assign({}, item),
      itemEl:     el,
      currentCol: item.col,
      currentRow: item.row,
      started:    false
    };

    this._attachDocListeners();
  }

  /* ════════════════════════════════════════════════════
     DRAG — DESDE TRAY (agregar al grid)
     ════════════════════════════════════════════════════ */

  _startDragTray(e, item, trayItemEl) {
    e.preventDefault();

    this._dragState = {
      type:        'tray',
      item:        Object.assign({}, item),
      trayItemEl:  trayItemEl,
      currentCol:  1,
      currentRow:  1,
      started:     false,
      overGrid:    false
    };

    this._attachDocListeners();
  }

  /* ════════════════════════════════════════════════════
     RESIZE
     ════════════════════════════════════════════════════ */

  _startResize(e, item, el) {
    if (item.locked) return;
    e.preventDefault();
    e.stopPropagation();

    this._dragState = {
      type:       'resize',
      item:       Object.assign({}, item),
      itemEl:     el,
      currentW:   item.w,
      currentH:   item.h,
      started:    false
    };

    this._attachDocListeners();
  }

  /* ════════════════════════════════════════════════════
     HANDLERS DE DOCUMENTO (mousemove / mouseup)
     ════════════════════════════════════════════════════ */

  _onDocMousemove(e) {
    if (!this._dragState) return;
    const ds = this._dragState;

    // Threshold de inicio: 4px
    if (!ds.started) {
      const dx = Math.abs(e.clientX - (ds._startX || e.clientX));
      const dy = Math.abs(e.clientY - (ds._startY || e.clientY));
      if (!ds._startX) { ds._startX = e.clientX; ds._startY = e.clientY; }
      if (dx < 4 && dy < 4) return;
      ds.started = true;
      this._onDragStart(ds);
    }

    if (ds.type === 'move')   this._onMoveDrag(e, ds);
    if (ds.type === 'tray')   this._onTrayDrag(e, ds);
    if (ds.type === 'resize') this._onResizeDrag(e, ds);
  }

  _onDocMouseup(e) {
    this._detachDocListeners();
    if (!this._dragState) return;

    const ds = this._dragState;
    this._dragState = null;

    if (!ds.started) return;

    if (ds.type === 'move')   this._commitMove(ds);
    if (ds.type === 'tray')   this._commitTray(e, ds);
    if (ds.type === 'resize') this._commitResize(ds);
  }

  /* ────────────────────────────────────────
     INICIO DE DRAG (visual)
     ──────────────────────────────────────── */

  _onDragStart(ds) {
    if (ds.type === 'move') {
      ds.itemEl.classList.add('mts-dashboardgrid__item--dragging');
      this._showPlaceholder(ds.item.col, ds.item.row, ds.item.w, ds.item.h);
    }
    if (ds.type === 'tray') {
      ds.trayItemEl.classList.add('mts-dashboardgrid__tray-item--dragging');
      this._showGhost(ds.item.title || ds.item.id);
    }
    if (ds.type === 'resize') {
      ds.itemEl.classList.add('mts-dashboardgrid__item--resizing');
      this._showPlaceholder(ds.item.col, ds.item.row, ds.item.w, ds.item.h);
    }
  }

  /* ────────────────────────────────────────
     DRAG — MOVE
     ──────────────────────────────────────── */

  _onMoveDrag(e, ds) {
    const snapped = this._snapToCell(e.clientX, e.clientY, ds.item.w, ds.item.h);

    if (snapped.col === ds.currentCol && snapped.row === ds.currentRow) return;
    ds.currentCol = snapped.col;
    ds.currentRow = snapped.row;

    this._updatePlaceholder(snapped.col, snapped.row, ds.item.w, ds.item.h);
    this._evaluateCollision(ds.item.id, snapped.col, snapped.row, ds.item.w, ds.item.h);
  }

  /* ────────────────────────────────────────
     DRAG — TRAY
     ──────────────────────────────────────── */

  _onTrayDrag(e, ds) {
    this._moveGhost(e.clientX, e.clientY);

    const overGrid = this._isOverGrid(e.clientX, e.clientY);

    if (overGrid) {
      const w = ds.item.w || 1;
      const h = ds.item.h || 1;

      if (!ds.overGrid) {
        ds.overGrid = true;
        this._showPlaceholder(ds.currentCol, ds.currentRow, w, h);
      }

      const snapped = this._snapToCell(e.clientX, e.clientY, w, h);

      if (snapped.col !== ds.currentCol || snapped.row !== ds.currentRow) {
        ds.currentCol = snapped.col;
        ds.currentRow = snapped.row;
        this._updatePlaceholder(snapped.col, snapped.row, w, h);
        this._evaluateCollision('__tray_preview__', snapped.col, snapped.row, w, h);
      }
    } else {
      if (ds.overGrid) {
        ds.overGrid = false;
        this._hidePlaceholder();
        this._resetItemPositions(null);
      }
    }
  }

  /* ────────────────────────────────────────
     DRAG — RESIZE
     ──────────────────────────────────────── */

  _onResizeDrag(e, ds) {
    const rect  = this._gridEl.getBoundingClientRect();
    const cellW = (rect.width  + this._gap) / this._columns;
    const cellH = this._rowHeight + this._gap;

    let newW = Math.round((e.clientX - rect.left - (ds.item.col - 1) * cellW) / cellW);
    let newH = Math.round((e.clientY - rect.top  - (ds.item.row - 1) * cellH) / cellH);

    newW = Math.max(ds.item.minW || 1, newW);
    newH = Math.max(ds.item.minH || 1, newH);
    if (ds.item.maxW) newW = Math.min(ds.item.maxW, newW);
    if (ds.item.maxH) newH = Math.min(ds.item.maxH, newH);
    // No salir del grid horizontalmente
    newW = Math.min(newW, this._columns - ds.item.col + 1);
    newH = Math.max(1, newH);

    if (newW === ds.currentW && newH === ds.currentH) return;
    ds.currentW = newW;
    ds.currentH = newH;

    this._updatePlaceholder(ds.item.col, ds.item.row, newW, newH);
    this._evaluateCollision(ds.item.id, ds.item.col, ds.item.row, newW, newH);
  }

  /* ════════════════════════════════════════════════════
     COMMIT
     ════════════════════════════════════════════════════ */

  _commitMove(ds) {
    ds.itemEl.classList.remove('mts-dashboardgrid__item--dragging');
    this._hidePlaceholder();

    const testItem = {
      id:  ds.item.id,
      col: ds.currentCol,
      row: ds.currentRow,
      w:   ds.item.w,
      h:   ds.item.h
    };
    const others = this._items.filter(function(i) { return i.id !== ds.item.id; });

    if (this._collisionMode === 'block' && this._hasCollision(others, testItem)) {
      this._resetItemPositions(null);
      return;
    }

    const item = this._findItem(ds.item.id);
    if (!item) return;

    item.col = ds.currentCol;
    item.row = ds.currentRow;

    if (this._collisionMode === 'displace') {
      this._items = this._resolveDisplace(this._items, ds.item.id);
    }

    this._applyAllPositions();
    this._emitChange();
  }

  _commitTray(e, ds) {
    ds.trayItemEl.classList.remove('mts-dashboardgrid__tray-item--dragging');
    this._hideGhost();
    this._hidePlaceholder();
    this._resetItemPositions(null);

    if (!ds.overGrid || !this._isOverGrid(e.clientX, e.clientY)) return;

    const w = ds.item.w || 1;
    const h = ds.item.h || 1;
    const newItem = Object.assign({}, ds.item, {
      col: ds.currentCol,
      row: ds.currentRow,
      w:   w,
      h:   h
    });

    const others = this._items.slice();
    if (this._collisionMode === 'block' && this._hasCollision(others, newItem)) return;

    this._items.push(newItem);
    this._availableItems = this._availableItems.filter(function(i) { return i.id !== ds.item.id; });

    if (this._collisionMode === 'displace') {
      this._items = this._resolveDisplace(this._items, newItem.id);
    }

    this._renderItems();

    // Animación de entrada para el widget recién agregado desde el tray
    const newEl = this._gridEl.querySelector('[data-dg-id="' + newItem.id + '"]');
    if (newEl) {
      newEl.classList.add('mts-dashboardgrid__item--entering');
      newEl.addEventListener('animationend', function() {
        newEl.classList.remove('mts-dashboardgrid__item--entering');
      }, { once: true });
    }

    this._renderTray();
    this._emitChange();
  }

  _commitResize(ds) {
    ds.itemEl.classList.remove('mts-dashboardgrid__item--resizing');
    this._hidePlaceholder();

    const item = this._findItem(ds.item.id);
    if (!item) return;

    const testItem = { id: item.id, col: item.col, row: item.row, w: ds.currentW, h: ds.currentH };
    const others   = this._items.filter(function(i) { return i.id !== item.id; });

    if (this._collisionMode === 'block' && this._hasCollision(others, testItem)) {
      this._resetItemPositions(null);
      return;
    }

    item.w = ds.currentW;
    item.h = ds.currentH;

    if (this._collisionMode === 'displace') {
      this._items = this._resolveDisplace(this._items, item.id);
    }

    this._applyAllPositions();
    this._emitChange();
  }

  /* ════════════════════════════════════════════════════
     ELIMINAR → TRAY
     ════════════════════════════════════════════════════ */

  _sendToTray(id) {
    const item = this._findItem(id);
    if (!item) return;

    this._items = this._items.filter(function(i) { return i.id !== id; });
    this._availableItems.push({
      id:    item.id,
      html:  item.html,
      title: item.title || item.id,
      w:     item.w,
      h:     item.h,
      minW:  item.minW,
      minH:  item.minH,
      maxW:  item.maxW,
      maxH:  item.maxH
    });

    this._renderItems();
    this._renderTray();
    this._emitChange();
  }

  /* ════════════════════════════════════════════════════
     PLACEHOLDER
     ════════════════════════════════════════════════════ */

  _showPlaceholder(col, row, w, h) {
    if (!this._placeholderEl) {
      this._placeholderEl = document.createElement('div');
      this._placeholderEl.className = 'mts-dashboardgrid__placeholder';
      this._gridEl.appendChild(this._placeholderEl);
    }
    this._updatePlaceholder(col, row, w, h);
  }

  _updatePlaceholder(col, row, w, h) {
    if (!this._placeholderEl) return;
    this._placeholderEl.style.setProperty('--mts-dg-col', col);
    this._placeholderEl.style.setProperty('--mts-dg-row', row);
    this._placeholderEl.style.setProperty('--mts-dg-w',   w);
    this._placeholderEl.style.setProperty('--mts-dg-h',   h);
  }

  _hidePlaceholder() {
    if (this._placeholderEl) {
      this._placeholderEl.remove();
      this._placeholderEl = null;
    }
  }

  /* ════════════════════════════════════════════════════
     GHOST (drag desde tray)
     ════════════════════════════════════════════════════ */

  _showGhost(label) {
    if (this._ghostEl) this._ghostEl.remove();

    this._ghostEl = document.createElement('div');
    this._ghostEl.className = 'mts-dashboardgrid__ghost';

    const icon = document.createElement('span');
    icon.className = 'mts-dashboardgrid__ghost-icon';
    icon.setAttribute('aria-hidden', 'true');
    this._ghostEl.appendChild(icon);

    const text = document.createElement('span');
    text.textContent = label;
    this._ghostEl.appendChild(text);

    document.body.appendChild(this._ghostEl);
  }

  _moveGhost(x, y) {
    if (!this._ghostEl) return;
    this._ghostEl.style.setProperty('left', x + 'px');
    this._ghostEl.style.setProperty('top',  y + 'px');
  }

  _hideGhost() {
    if (this._ghostEl) {
      this._ghostEl.remove();
      this._ghostEl = null;
    }
  }

  /* ════════════════════════════════════════════════════
     COLISIÓN Y DISPLACE
     ════════════════════════════════════════════════════ */

  _evaluateCollision(movedId, col, row, w, h) {
    const testItem = { id: movedId, col: col, row: row, w: w, h: h };
    const others   = this._items.filter(function(i) { return i.id !== movedId; });
    const collides = this._hasCollision(others, testItem);

    if (this._collisionMode === 'block') {
      if (collides) {
        this._placeholderEl.classList.add('mts-dashboardgrid__placeholder--block');
      } else {
        this._placeholderEl.classList.remove('mts-dashboardgrid__placeholder--block');
      }
      this._resetItemPositions(movedId);
    } else {
      // displace: previsualizar desplazamiento animado
      this._placeholderEl.classList.remove('mts-dashboardgrid__placeholder--block');
      if (collides) {
        const allWithMoved = others.concat([testItem]);
        const resolved     = this._resolveDisplace(allWithMoved, movedId);
        this._previewDisplace(resolved, movedId);
      } else {
        this._resetItemPositions(movedId);
      }
    }
  }

  _hasCollision(items, testItem) {
    for (let i = 0; i < items.length; i++) {
      if (this._overlaps(items[i], testItem)) return true;
    }
    return false;
  }

  _overlaps(a, b) {
    return a.col < b.col + b.w && a.col + a.w > b.col
        && a.row < b.row + b.h && a.row + a.h > b.row;
  }

  /**
   * Resuelve colisiones por desplazamiento hacia abajo (gravedad ↓).
   * El item con fixedId no se mueve — los demás se empujan.
   * Terminación garantizada: items solo se mueven a row mayor.
   */
  _resolveDisplace(items, fixedId) {
    let fixed    = null;
    const others = [];

    items.forEach(function(item) {
      if (item.id === fixedId) {
        fixed = Object.assign({}, item);
      } else {
        others.push(Object.assign({}, item));
      }
    });

    if (!fixed) return items.slice();

    // Ordenar por row ASC, col ASC — resolvemos de arriba hacia abajo
    others.sort(function(a, b) {
      return a.row !== b.row ? a.row - b.row : a.col - b.col;
    });

    const resolved = [fixed];
    const self     = this;

    others.forEach(function(item) {
      let iterations = 0;
      while (self._hasCollision(resolved, item) && iterations < 500) {
        item.row++;
        iterations++;
      }
      resolved.push(item);
    });

    return resolved;
  }

  /**
   * Previsualiza el desplazamiento vía transform: translate() — GPU, sin reflow de grid.
   * Los CSS vars de los items NO se tocan durante el preview; solo al commitear.
   */
  _previewDisplace(resolved, excludeId) {
    const self  = this;
    const rect  = this._gridEl.getBoundingClientRect();
    const cellW = rect.width > 0 ? (rect.width + this._gap) / this._columns : 0;
    const cellH = this._rowHeight + this._gap;

    resolved.forEach(function(resolvedItem) {
      if (resolvedItem.id === excludeId) return;
      const el = self._gridEl.querySelector('[data-dg-id="' + resolvedItem.id + '"]');
      if (!el) return;
      const current = self._findItem(resolvedItem.id);
      if (!current) return;
      const dx = (resolvedItem.col - current.col) * cellW;
      const dy = (resolvedItem.row - current.row) * cellH;
      el.style.setProperty('transform', 'translate(' + dx + 'px,' + dy + 'px)');
    });
  }

  /**
   * Restaura posiciones originales — el transform vuelve a translate(0,0)
   * con la animación spring (efecto flotando de regreso).
   */
  _resetItemPositions(excludeId) {
    const self = this;
    this._items.forEach(function(item) {
      if (excludeId && item.id === excludeId) return;
      const el = self._gridEl.querySelector('[data-dg-id="' + item.id + '"]');
      if (!el) return;
      self._applyItemPosition(el, item);
      el.style.setProperty('transform', 'translate(0,0)');
    });
  }

  /**
   * Aplica posiciones finales a todos los items SIN animación (para commits).
   * Desactiva transitions en el frame actual y las restaura en el siguiente
   * para evitar spring visual al hacer snap a la posición final del commit.
   */
  _applyAllPositions() {
    const self = this;
    this._items.forEach(function(item) {
      const el = self._gridEl.querySelector('[data-dg-id="' + item.id + '"]');
      if (!el) return;
      el.style.setProperty('transition', 'none');
      self._applyItemPosition(el, item);
      el.style.removeProperty('transform');
      requestAnimationFrame(function() {
        el.style.removeProperty('transition');
      });
    });
  }

  /* ════════════════════════════════════════════════════
     SNAP
     ════════════════════════════════════════════════════ */

  _snapToCell(mouseX, mouseY, w, h) {
    const rect  = this._gridEl.getBoundingClientRect();
    const cellW = (rect.width  + this._gap) / this._columns;
    const cellH = this._rowHeight + this._gap;

    let col = Math.floor((mouseX - rect.left) / cellW) + 1;
    let row = Math.floor((mouseY - rect.top)  / cellH) + 1;

    // Clamp: el item debe caber dentro del número de columnas
    col = Math.max(1, Math.min(this._columns - w + 1, col));
    row = Math.max(1, row);

    return { col: col, row: row };
  }

  _isOverGrid(mouseX, mouseY) {
    const rect = this._gridEl.getBoundingClientRect();
    return mouseX >= rect.left && mouseX <= rect.right
        && mouseY >= rect.top  && mouseY <= rect.bottom;
  }

  /* ════════════════════════════════════════════════════
     KEYBOARD (accesibilidad)
     ════════════════════════════════════════════════════ */

  _onHandleKeydown(e, item, el) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();

    // Activar modo teclado: las flechas mueven el widget
    if (this._dragState && this._dragState.type === 'keyboard') {
      // Enter/Space confirma el drop
      this._commitKeyboardMove();
      return;
    }

    this._dragState = {
      type:       'keyboard',
      item:       Object.assign({}, item),
      itemEl:     el,
      currentCol: item.col,
      currentRow: item.row
    };

    el.classList.add('mts-dashboardgrid__item--dragging');
    this._showPlaceholder(item.col, item.row, item.w, item.h);
    document.addEventListener('keydown', this._boundKeydown);
  }

  _onDocKeydown(e) {
    if (!this._dragState || this._dragState.type !== 'keyboard') return;
    const ds = this._dragState;

    if (e.key === 'Escape') {
      e.preventDefault();
      this._cancelKeyboardMove(ds);
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._commitKeyboardMove();
      return;
    }

    const delta = { col: 0, row: 0 };
    if (e.key === 'ArrowLeft')  delta.col = -1;
    if (e.key === 'ArrowRight') delta.col =  1;
    if (e.key === 'ArrowUp')    delta.row = -1;
    if (e.key === 'ArrowDown')  delta.row =  1;

    if (!delta.col && !delta.row) return;
    e.preventDefault();

    const newCol = Math.max(1, Math.min(this._columns - ds.item.w + 1, ds.currentCol + delta.col));
    const newRow = Math.max(1, ds.currentRow + delta.row);

    ds.currentCol = newCol;
    ds.currentRow = newRow;

    this._updatePlaceholder(newCol, newRow, ds.item.w, ds.item.h);
    this._evaluateCollision(ds.item.id, newCol, newRow, ds.item.w, ds.item.h);
  }

  _commitKeyboardMove() {
    if (!this._dragState || this._dragState.type !== 'keyboard') return;
    const ds = this._dragState;
    document.removeEventListener('keydown', this._boundKeydown);

    ds.itemEl.classList.remove('mts-dashboardgrid__item--dragging');
    this._hidePlaceholder();

    const item = this._findItem(ds.item.id);
    if (item) {
      item.col = ds.currentCol;
      item.row = ds.currentRow;
      if (this._collisionMode === 'displace') {
        this._items = this._resolveDisplace(this._items, ds.item.id);
      }
      this._applyAllPositions();
      this._emitChange();
    }

    this._dragState = null;
  }

  _cancelKeyboardMove(ds) {
    document.removeEventListener('keydown', this._boundKeydown);
    ds.itemEl.classList.remove('mts-dashboardgrid__item--dragging');
    this._hidePlaceholder();
    this._resetItemPositions(null);
    this._dragState = null;
  }

  /* ════════════════════════════════════════════════════
     LISTENERS
     ════════════════════════════════════════════════════ */

  _attachDocListeners() {
    document.addEventListener('mousemove', this._boundMousemove);
    document.addEventListener('mouseup',   this._boundMouseup);
  }

  _detachDocListeners() {
    document.removeEventListener('mousemove', this._boundMousemove);
    document.removeEventListener('mouseup',   this._boundMouseup);
  }

  _stopDrag() {
    this._detachDocListeners();
    document.removeEventListener('keydown', this._boundKeydown);
    this._hidePlaceholder();
    this._hideGhost();
    if (this._dragState) {
      if (this._dragState.itemEl) {
        this._dragState.itemEl.classList.remove(
          'mts-dashboardgrid__item--dragging',
          'mts-dashboardgrid__item--resizing'
        );
      }
      if (this._dragState.trayItemEl) {
        this._dragState.trayItemEl.classList.remove('mts-dashboardgrid__tray-item--dragging');
      }
      this._dragState = null;
    }
    this._resetItemPositions(null);
  }

  /* ════════════════════════════════════════════════════
     HELPERS
     ════════════════════════════════════════════════════ */

  _findItem(id) {
    for (let i = 0; i < this._items.length; i++) {
      if (this._items[i].id === id) return this._items[i];
    }
    return null;
  }

  _cloneItems(items) {
    return (items || []).map(function(item) { return Object.assign({}, item); });
  }

  _findFirstFreePosition(w, h) {
    for (let row = 1; row <= 1000; row++) {
      for (let col = 1; col <= this._columns - w + 1; col++) {
        const test = { id: '__free__', col: col, row: row, w: w, h: h };
        if (!this._hasCollision(this._items, test)) {
          return { col: col, row: row };
        }
      }
    }
    return { col: 1, row: 1 };
  }

  _emitChange() {
    const layout = this.getItems();
    if (this._debug) {
      console.group('[MTS.DashboardGrid] onWidgetsChange — ' + layout.length + ' item(s)');
      layout.forEach(function(item) {
        console.log('%c' + item.id, 'font-weight:700', '→ col:' + item.col + ' row:' + item.row + ' w:' + item.w + ' h:' + item.h);
      });
      console.groupEnd();
    }
    if (!this._onWidgetsChange) return;
    this._onWidgetsChange(layout);
  }
};
