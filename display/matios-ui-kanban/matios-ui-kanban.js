/* ============================================================
   MATIOS UI — matios-ui-kanban.js
   MTS.Kanban — Tablero Kanban con drag & drop entre columnas
   Eventos DOM: mts:kanban:move | mts:kanban:drop | mts:kanban:cardClick
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Kanban = class MtsKanban {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {Array}    options.columns    [{ id, title, color?, wip?, cards:[] }]
   *   cards: [{ id, title, description?, tags?[], assignee?, priority? }]
   * @param {boolean}  options.addCards   Permite agregar tarjetas — default: false
   * @param {function} options.onMove     (card, fromColId, toColId, newIndex) => {}
   * @param {function} options.onCardClick (card, colId) => {}
   * @param {function} options.onAddCard  (colId) => {}
   */
  constructor(selector, options = {}) {
    this._el      = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    this.columns  = options.columns   || [];
    this.addCards = options.addCards  ?? false;
    this.onMove   = options.onMove    || null;
    this.onCardClick = options.onCardClick || null;
    this.onAddCard   = options.onAddCard   || null;
    this._dragCard   = null;
    this._dragCol    = null;
    this._listeners  = {};
    this._build();
  }

  /* API */
  addCard(colId, card)    { const col = this.columns.find(c => c.id === colId); if (col) { col.cards.push(card); this._renderColumn(colId); } return this; }
  removeCard(cardId)      { this.columns.forEach(col => { col.cards = col.cards.filter(c => c.id !== cardId); }); this._build(); return this; }
  moveCard(cardId, toColId, idx = 0) {
    let card, fromCol;
    this.columns.forEach(col => { const i = col.cards.findIndex(c => c.id === cardId); if (i >= 0) { card = col.cards.splice(i, 1)[0]; fromCol = col; }});
    const toCol = this.columns.find(c => c.id === toColId);
    if (card && toCol) { toCol.cards.splice(idx, 0, card); this._build(); }
    return this;
  }
  setColumns(cols) { this.columns = cols; this._build(); return this; }
  on(e, cb)        { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  destroy()        { this._el.innerHTML = ''; }

  _build() {
    this._el.className = 'mts-kanban';
    this._el.innerHTML = '';
    this.columns.forEach(col => {
      const colEl = this._buildColumn(col);
      this._el.appendChild(colEl);
    });
  }

  _buildColumn(col) {
    const colEl = document.createElement('div');
    colEl.className = 'mts-kanban__col';
    colEl.dataset.colId = col.id;

    // Header
    const header = document.createElement('div');
    header.className = 'mts-kanban__col-header';
    const dot = document.createElement('span');
    dot.className = 'mts-kanban__col-dot';
    if (col.color) dot.style.background = col.color;
    const title = document.createElement('span');
    title.className = 'mts-kanban__col-title';
    title.textContent = col.title;
    const count = document.createElement('span');
    count.className = 'mts-kanban__col-count';
    count.textContent = col.cards.length;
    if (col.wip && col.cards.length >= col.wip) count.classList.add('mts-kanban__col-count--over');

    header.appendChild(dot);
    header.appendChild(title);
    header.appendChild(count);
    colEl.appendChild(header);

    // Cards list
    const list = document.createElement('div');
    list.className = 'mts-kanban__list';
    list.dataset.colId = col.id;
    col.cards.forEach(card => list.appendChild(this._buildCard(card, col.id)));

    // Drag over handlers en la lista
    list.addEventListener('dragover', (e) => {
      e.preventDefault();
      list.classList.add('mts-kanban__list--over');
      const afterEl = this._getDragAfterEl(list, e.clientY);
      const drag    = this._el.querySelector('.mts-kanban__card--dragging');
      if (drag) { afterEl ? list.insertBefore(drag, afterEl) : list.appendChild(drag); }
    });
    list.addEventListener('dragleave', (e) => { if (!list.contains(e.relatedTarget)) list.classList.remove('mts-kanban__list--over'); });
    list.addEventListener('drop', (e) => {
      e.preventDefault();
      list.classList.remove('mts-kanban__list--over');
      if (!this._dragCard) return;
      const fromColId = this._dragCol;
      const toColId   = col.id;
      const newIndex  = [...list.querySelectorAll('.mts-kanban__card:not(.mts-kanban__card--dragging)')].indexOf(this._el.querySelector('.mts-kanban__card--dragging'));
      // Actualizar data
      const fromCol = this.columns.find(c => c.id === fromColId);
      const toCol   = this.columns.find(c => c.id === toColId);
      if (fromCol && toCol) {
        const ci = fromCol.cards.findIndex(c => c.id === this._dragCard);
        const card = fromCol.cards.splice(ci, 1)[0];
        toCol.cards.splice(Math.max(0, newIndex), 0, card);
        count.textContent = toCol.cards.length;
        if (this.onMove) this.onMove(card, fromColId, toColId, newIndex);
        this._emit('move', { card, fromColId, toColId, newIndex });
        this._emit('drop', { card, toColId });
      }
      this._dragCard = null; this._dragCol = null;
    });

    colEl.appendChild(list);

    // Botón agregar
    if (this.addCards) {
      const addBtn = document.createElement('button');
      addBtn.className = 'mts-kanban__add';
      addBtn.innerHTML = `<span>+</span> Agregar tarjeta`;
      addBtn.addEventListener('click', () => { if (this.onAddCard) this.onAddCard(col.id); this._emit('addCard', { colId: col.id }); });
      colEl.appendChild(addBtn);
    }

    return colEl;
  }

  _buildCard(card, colId) {
    const el = document.createElement('div');
    el.className = 'mts-kanban__card';
    el.draggable = true;
    el.dataset.cardId = card.id;
    if (card.priority) el.classList.add(`mts-kanban__card--${card.priority}`);

    el.addEventListener('dragstart', (e) => {
      this._dragCard = card.id; this._dragCol = colId;
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => el.classList.add('mts-kanban__card--dragging'), 0);
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('mts-kanban__card--dragging');
      this._el.querySelectorAll('.mts-kanban__list--over').forEach(l => l.classList.remove('mts-kanban__list--over'));
    });

    if (this.onCardClick) el.addEventListener('click', () => { this.onCardClick(card, colId); this._emit('cardClick', { card, colId }); });

    const title = document.createElement('div');
    title.className = 'mts-kanban__card-title';
    title.textContent = card.title;
    el.appendChild(title);

    if (card.description) { const d = document.createElement('div'); d.className = 'mts-kanban__card-desc'; d.textContent = card.description; el.appendChild(d); }

    if (card.tags?.length || card.assignee) {
      const footer = document.createElement('div');
      footer.className = 'mts-kanban__card-footer';
      if (card.tags?.length) {
        const tagsEl = document.createElement('div');
        tagsEl.className = 'mts-kanban__card-tags';
        card.tags.forEach(tag => {
          const t = document.createElement('span');
          t.className = 'mts-kanban__card-tag';
          t.textContent = tag;
          tagsEl.appendChild(t);
        });
        footer.appendChild(tagsEl);
      }
      if (card.assignee) {
        const av = MTS.Avatar?.create ? MTS.Avatar.create({ name: card.assignee, size: 'xs' }) : document.createElement('span');
        if (!MTS.Avatar?.create) av.textContent = card.assignee.slice(0, 2);
        footer.appendChild(av);
      }
      el.appendChild(footer);
    }

    return el;
  }

  _renderColumn(colId) {
    const colEl = this._el.querySelector(`[data-col-id="${colId}"]`);
    if (colEl) { const newEl = this._buildColumn(this.columns.find(c => c.id === colId)); colEl.replaceWith(newEl); }
  }

  _getDragAfterEl(container, y) {
    const cards = [...container.querySelectorAll('.mts-kanban__card:not(.mts-kanban__card--dragging)')];
    return cards.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:kanban:${event}`, { bubbles: true, detail }));
  }
};
