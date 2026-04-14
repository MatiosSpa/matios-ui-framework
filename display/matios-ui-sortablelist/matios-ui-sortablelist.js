/* ============================================================
   MATIOS UI — matios-ui-sortablelist.js
   MTS.SortableList — Lista reordenable con drag & drop
   Eventos DOM: mts:sortable:reorder | mts:sortable:itemClick
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.SortableList = class MtsSortableList {
  /**
   * @param {string|Element} selector
   * @param {object} options
   *
   * — Items —
   * @param {Array}    options.items        [{ id, title, description?, meta?, icon?, avatar?, badge?, disabled? }]
   *
   * — Apariencia —
   * @param {string}   options.variant      'default'|'flush'|'compact' — default: 'default'
   * @param {boolean}  options.numbered     Muestra número de orden — default: false
   * @param {boolean}  options.showHandle   Muestra ⠿ handle explícito — default: true
   *
   * — Comportamiento —
   * @param {boolean}  options.locked       Lista en modo lectura, sin drag — default: false
   * @param {boolean}  options.moveButtons  Muestra botones ↑ ↓ — default: false
   *
   * — Callbacks —
   * @param {function} options.onReorder    (items, fromIndex, toIndex) => {}
   * @param {function} options.onItemClick  (item, index) => {}
   */
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) { console.error('[MTS.SortableList] No encontrado:', selector); return; }

    this.items       = options.items       ? options.items.map((item, i) => ({ ...item, _idx: i })) : [];
    this.variant     = options.variant     || 'default';
    this.numbered    = options.numbered    ?? false;
    this.showHandle  = options.showHandle  ?? true;
    this.locked      = options.locked      ?? false;
    this.moveButtons = options.moveButtons ?? false;

    this._listeners   = {};
    this._dragItem    = null;
    this._dragFromIdx = null;

    // Fires when items are reordered: ({ items, fromIndex, toIndex }) => {}
    // Se dispara al reordenar los ítems
    if (options.onReorder)   this.on('reorder',   options.onReorder);

    // Fires when an item is clicked: ({ item, index }) => {}
    // Se dispara al hacer click en un ítem
    if (options.onItemClick) this.on('itemClick', options.onItemClick);

    this._build();
  }

  /* ── API pública ─────────────────────────────────────── */

  getItems()               { return [...this.items]; }
  setItems(items)          { this.items = items.map((item, i) => ({ ...item, _idx: i })); this._build(); return this; }
  addItem(item, index)     {
    const newItem = { ...item, _idx: 0 };
    if (index === undefined) this.items.push(newItem);
    else this.items.splice(index, 0, newItem);
    this._reindex();
    this._build();
    return this;
  }
  removeItem(id)           { this.items = this.items.filter(i => i.id !== id); this._reindex(); this._build(); return this; }
  updateItem(id, props)    { const i = this.items.find(i => i.id === id); if (i) Object.assign(i, props); this._build(); return this; }
  lock()                   { this.locked = true;  this._build(); return this; }
  unlock()                 { this.locked = false; this._build(); return this; }
  on(e, cb)                { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb)               { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }
  destroy()                { this._el.innerHTML = ''; }

  /* ── Build ───────────────────────────────────────────── */

  _reindex() {
    this.items.forEach((item, i) => item._idx = i);
  }

  _build() {
    this._el.innerHTML = '';
    this._el.className = `mts-sortable mts-sortable--${this.variant}${this.locked ? ' mts-sortable--locked' : ''}`;

    this.items.forEach((item, idx) => {
      this._el.appendChild(this._buildItem(item, idx));
    });
  }

  _buildItem(item, idx) {
    const row = document.createElement('div');
    row.className = 'mts-sortable__item' + (item.disabled ? ' mts-sortable__item--disabled' : '');
    row.dataset.id  = item.id;
    row.dataset.idx = idx;

    if (!this.locked && !item.disabled) {
      row.draggable = true;
      this._bindDrag(row, item, idx);
    }

    /* ── Handle ── */
    if (this.showHandle && !this.locked) {
      const handle = document.createElement('div');
      handle.className = 'mts-sortable__handle' + (item.disabled ? ' mts-sortable__handle--disabled' : '');
      handle.innerHTML = '<svg width="14" height="20" viewBox="0 0 14 20" fill="currentColor"><circle cx="4" cy="4" r="1.5"/><circle cx="10" cy="4" r="1.5"/><circle cx="4" cy="10" r="1.5"/><circle cx="10" cy="10" r="1.5"/><circle cx="4" cy="16" r="1.5"/><circle cx="10" cy="16" r="1.5"/></svg>';
      handle.title = 'Arrastrar para reordenar';
      row.appendChild(handle);
    }

    /* ── Número de orden ── */
    if (this.numbered) {
      const num = document.createElement('div');
      num.className = 'mts-sortable__num';
      num.textContent = idx + 1;
      row.appendChild(num);
    }

    /* ── Ícono / Avatar ── */
    if (item.icon || item.avatar) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'mts-sortable__icon';
      if (item.icon) {
        iconWrap.innerHTML = item.icon;
      } else if (item.avatar) {
        const av = document.createElement('span');
        av.className = 'mts-sortable__avatar';
        av.textContent = item.avatar.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
        if (item.avatarColor) av.style.background = item.avatarColor;
        iconWrap.appendChild(av);
      }
      row.appendChild(iconWrap);
    }

    /* ── Contenido ── */
    const content = document.createElement('div');
    content.className = 'mts-sortable__content';

    const title = document.createElement('div');
    title.className = 'mts-sortable__title';
    title.textContent = item.title;
    content.appendChild(title);

    if (item.description && this.variant !== 'compact') {
      const desc = document.createElement('div');
      desc.className = 'mts-sortable__desc';
      desc.textContent = item.description;
      content.appendChild(desc);
    }
    row.appendChild(content);

    /* ── Badge ── */
    if (item.badge) {
      const badge = document.createElement('span');
      badge.className = `mts-badge mts-badge--${item.badge.variant || 'default'}`;
      badge.textContent = item.badge.label ?? item.badge;
      row.appendChild(badge);
    }

    /* ── Meta (derecha) ── */
    if (item.meta) {
      const meta = document.createElement('div');
      meta.className = 'mts-sortable__meta';
      meta.textContent = item.meta;
      row.appendChild(meta);
    }

    /* ── Botones ↑ ↓ ── */
    if (this.moveButtons && !this.locked && !item.disabled) {
      const btns = document.createElement('div');
      btns.className = 'mts-sortable__move-btns';

      const up = document.createElement('button');
      up.className = 'mts-sortable__move-btn';
      up.innerHTML = '↑';
      up.title = 'Mover arriba';
      up.disabled = idx === 0;
      up.addEventListener('click', (e) => { e.stopPropagation(); this._move(idx, idx - 1); });

      const down = document.createElement('button');
      down.className = 'mts-sortable__move-btn';
      down.innerHTML = '↓';
      down.title = 'Mover abajo';
      down.disabled = idx === this.items.length - 1;
      down.addEventListener('click', (e) => { e.stopPropagation(); this._move(idx, idx + 1); });

      btns.appendChild(up);
      btns.appendChild(down);
      row.appendChild(btns);
    }

    /* ── Click en item ── */
    row.addEventListener('click', () => {
      this._emit('itemClick', { item, index: idx });
    });

    return row;
  }

  /* ── Drag & Drop ─────────────────────────────────────── */

  _bindDrag(row, item, idx) {
    row.addEventListener('dragstart', (e) => {
      this._dragItem    = item;
      this._dragFromIdx = idx;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', item.id);
      setTimeout(() => row.classList.add('mts-sortable__item--dragging'), 0);
    });

    row.addEventListener('dragend', () => {
      row.classList.remove('mts-sortable__item--dragging');
      this._el.querySelectorAll('.mts-sortable__item--over').forEach(el => {
        el.classList.remove('mts-sortable__item--over');
        el.classList.remove('mts-sortable__item--over-top');
        el.classList.remove('mts-sortable__item--over-bottom');
      });
      this._dragItem    = null;
      this._dragFromIdx = null;
    });

    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const overIdx = +row.dataset.idx;
      if (overIdx === this._dragFromIdx) return;

      this._el.querySelectorAll('.mts-sortable__item').forEach(el => {
        el.classList.remove('mts-sortable__item--over', 'mts-sortable__item--over-top', 'mts-sortable__item--over-bottom');
      });

      row.classList.add('mts-sortable__item--over');
      const rect   = row.getBoundingClientRect();
      const middle = rect.top + rect.height / 2;
      row.classList.add(e.clientY < middle
        ? 'mts-sortable__item--over-top'
        : 'mts-sortable__item--over-bottom');
    });

    row.addEventListener('dragleave', (e) => {
      if (!row.contains(e.relatedTarget)) {
        row.classList.remove('mts-sortable__item--over', 'mts-sortable__item--over-top', 'mts-sortable__item--over-bottom');
      }
    });

    row.addEventListener('drop', (e) => {
      e.preventDefault();
      const toIdx = +row.dataset.idx;
      if (toIdx === this._dragFromIdx || this._dragFromIdx === null) return;

      /* Determinar si insertar antes o después */
      const rect   = row.getBoundingClientRect();
      const middle = rect.top + rect.height / 2;
      const insertAfter = e.clientY >= middle;
      const finalIdx = insertAfter
        ? (toIdx > this._dragFromIdx ? toIdx : toIdx + 1)
        : (toIdx < this._dragFromIdx ? toIdx : toIdx - 1);

      this._move(this._dragFromIdx, Math.max(0, Math.min(finalIdx, this.items.length - 1)));
    });
  }

  /* ── Mover item de fromIdx a toIdx ──────────────────── */

  _move(fromIdx, toIdx) {
    if (fromIdx === toIdx) return;
    toIdx = Math.max(0, Math.min(toIdx, this.items.length - 1));

    const moved = this.items.splice(fromIdx, 1)[0];
    this.items.splice(toIdx, 0, moved);
    this._reindex();
    this._build();

    this._emit('reorder', {
      items:     this.getItems(),
      fromIndex: fromIdx,
      toIndex:   toIdx,
      item:      moved,
    });
  }

  /* ── Emit ────────────────────────────────────────────── */

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:sortable:${event}`, { bubbles: true, detail }));
  }
};
