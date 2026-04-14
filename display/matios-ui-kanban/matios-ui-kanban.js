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
    this._listeners = {};
    this._dragCard        = null;
    this._dragCol         = null;
    this._listeners       = {};
    // Async assignee search: (query) => items[] | Promise<items[]>
    // Búsqueda async de asignados — debe retornar arreglo o Promesa
    this.onSearchAssignee = options.onSearchAssignee || null;

    // Fires when a card is moved: ({ card, fromColId, toColId, position, newIndex }) => {}
    // Se dispara al mover una tarjeta
    if (options.onMove)      this.on('move',      options.onMove);

    // Fires when a card is clicked: ({ card, colId }) => {}
    // Se dispara al hacer click en una tarjeta
    if (options.onCardClick) this.on('cardClick', options.onCardClick);

    // Fires when a new card is added: ({ card, colId }) => {}
    // Se dispara al agregar una nueva tarjeta
    if (options.onAddCard)   this.on('cardAdd',   options.onAddCard);
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
      /* Calcular la posición real: contar cuántos cards NO-dragging hay ANTES del dragging en la lista */
      const draggingEl = this._el.querySelector('.mts-kanban__card--dragging');
      const allCards   = [...list.querySelectorAll('.mts-kanban__card')];
      let newIndex = 0;
      for (let i = 0; i < allCards.length; i++) {
        if (allCards[i] === draggingEl) break;
        if (!allCards[i].classList.contains('mts-kanban__card--dragging')) newIndex++;
      }
      /* Actualizar data */
      const fromCol = this.columns.find(c => c.id === fromColId);
      const toCol   = this.columns.find(c => c.id === toColId);
      if (fromCol && toCol) {
        const ci = fromCol.cards.findIndex(c => c.id === this._dragCard);
        const card = fromCol.cards.splice(ci, 1)[0];
        toCol.cards.splice(newIndex, 0, card);
        count.textContent = toCol.cards.length;
        /* Actualizar contador origen si es columna diferente */
        if (fromColId !== toColId) {
          const fromCounter = this._el.querySelector(`[data-col-id="${fromColId}"] .mts-kanban__col-count`);
          if (fromCounter) fromCounter.textContent = fromCol.cards.length;
        }
        const position = newIndex + 1;
        this._emit('move', { card, fromColId, toColId, position, newIndex });
        this._emit('drop', { card, toColId, position });
      }
      this._dragCard = null; this._dragCol = null;
    });

    colEl.appendChild(list);

    // Botón agregar
    if (this.addCards) {
      const addBtn = document.createElement('button');
      addBtn.className = 'mts-kanban__add';
      addBtn.innerHTML = `<span>+</span> Agregar tarjeta`;
      addBtn.addEventListener('click', () => { addBtn.style.display='none'; this._showInlineAddForm(colEl, col.id, list, addBtn); });
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
      document.body.style.cursor = 'grabbing';
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(() => el.classList.add('mts-kanban__card--dragging'), 0);
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('mts-kanban__card--dragging');
      this._el.querySelectorAll('.mts-kanban__list--over').forEach(l => l.classList.remove('mts-kanban__list--over'));
      document.body.style.cursor = '';
    });

    if (this._listeners['cardClick']?.length) el.addEventListener('click', () => { this._emit('cardClick', { card, colId }); });

    const title = document.createElement('div');
    title.className = 'mts-kanban__card-title';
    title.textContent = card.title;
    el.appendChild(title);

    if (card.description) { const d = document.createElement('div'); d.className = 'mts-kanban__card-desc'; d.textContent = card.description; el.appendChild(d); }

    if (card.tags?.length || card.assignee) {
      const footer = document.createElement('div');
      footer.className = 'mts-kanban__card-footer';

      /* Tags — flex:1 + overflow hidden para no empujar el avatar */
      const tagsEl = document.createElement('div');
      tagsEl.className = 'mts-kanban__card-tags';
      if (card.tags?.length) {
        card.tags.forEach(tag => {
          const t = document.createElement('span');
          t.className = 'mts-kanban__card-tag';
          t.textContent = tag;
          tagsEl.appendChild(t);
        });
      }
      footer.appendChild(tagsEl);

      /* Avatar — siempre a la derecha, flex-shrink:0 */
      if (card.assignee) {
        const initials = card.assignee.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase();
        const av = document.createElement('span');
        av.className = 'mts-kanban__card-av';
        av.textContent = initials;
        av.title = card.assignee;
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

  _showInlineAddForm(colEl, colId, list, addBtn) {
    const form = document.createElement('div');
    form.className = 'mts-kanban__add-form';

    /* ── Helper ── */
    const F = (tag, cls, attrs = {}) => {
      const el = document.createElement(tag);
      if (cls) el.className = cls;
      Object.entries(attrs).forEach(([k, v]) => { if (k !== 'text') el[k] = v; });
      if (attrs.text) el.textContent = attrs.text;
      return el;
    };

    /* ═══ TÍTULO ═══ */
    const titleInput = F('textarea', 'mts-kanban__add-input', { placeholder:'Título de la tarjeta *', rows:2 });

    /* ═══ DESCRIPCIÓN ═══ */
    const descInput = F('textarea', 'mts-kanban__add-input mts-kanban__add-input--sm', { placeholder:'Descripción (opcional)', rows:2 });

    /* ═══ TAGS — estilo TagInput ═══ */
    const tagsRow  = F('div', 'mts-kanban__add-row');
    tagsRow.appendChild(F('label', 'mts-kanban__add-label', { text:'🏷 Tags' }));
    const tagsWrap = F('div', 'mts-kanban__tags-wrap');
    const tagsBox  = F('input', 'mts-kanban__tags-input', { type:'text', placeholder:'Escribe y presiona Enter...' });
    tagsWrap.appendChild(tagsBox);
    tagsRow.appendChild(tagsWrap);
    const _tags = [];   // array de tags activos

    const renderTags = () => {
      tagsWrap.querySelectorAll('.mts-kanban__tag-pill').forEach(p => p.remove());
      _tags.forEach((tag, i) => {
        const pill = F('span', 'mts-kanban__tag-pill');
        pill.innerHTML = tag + ' <span class="mts-kanban__tag-remove">×</span>';
        pill.querySelector('.mts-kanban__tag-remove').addEventListener('click', () => {
          _tags.splice(i, 1); renderTags();
        });
        tagsWrap.insertBefore(pill, tagsBox);
      });
    };

    tagsBox.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ',') && tagsBox.value.trim()) {
        e.preventDefault();
        const val = tagsBox.value.replace(',','').trim();
        if (val && !_tags.includes(val)) { _tags.push(val); renderTags(); }
        tagsBox.value = '';
      }
      if (e.key === 'Backspace' && !tagsBox.value && _tags.length) {
        _tags.pop(); renderTags();
      }
    });

    /* ═══ ASIGNADO — autocomplete async ═══ */
    const assigneeRow = F('div', 'mts-kanban__add-row');
    assigneeRow.appendChild(F('label', 'mts-kanban__add-label', { text:'👤 Asignado' }));
    const assigneeWrap   = F('div', 'mts-kanban__assignee-wrap');
    const assigneeInput  = F('input', 'mts-kanban__add-field', { type:'text', placeholder:'Buscar usuario...' });
    const assigneeDropdown = F('ul', 'mts-kanban__assignee-dd');
    assigneeDropdown.style.display = 'none';
    assigneeWrap.appendChild(assigneeInput);
    assigneeWrap.appendChild(assigneeDropdown);
    assigneeRow.appendChild(assigneeWrap);
    let _assignee = null;   // { name, avatar? }
    let _assigneeTimer = null;

    const hideAssigneeDd = () => { assigneeDropdown.style.display = 'none'; };
    const showAssigneeDd = (users) => {
      assigneeDropdown.innerHTML = '';
      if (!users.length) {
        const li = F('li', 'mts-kanban__assignee-dd-empty', { text: 'Sin resultados' });
        assigneeDropdown.appendChild(li);
      } else {
        users.forEach(u => {
          const li = F('li', 'mts-kanban__assignee-dd-item');
          const av = F('span', 'mts-kanban__assignee-av');
          av.textContent = u.name.split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase();
          const nm = F('span', '', { text: u.name });
          li.appendChild(av); li.appendChild(nm);
          li.addEventListener('mousedown', (e) => {
            e.preventDefault();
            _assignee = u;
            assigneeInput.value = u.name;
            assigneeInput.classList.add('mts-kanban__add-field--selected');
            hideAssigneeDd();
          });
          assigneeDropdown.appendChild(li);
        });
      }
      assigneeDropdown.style.display = 'block';
    };

    assigneeInput.addEventListener('input', () => {
      const q = assigneeInput.value.trim();
      _assignee = null;
      assigneeInput.classList.remove('mts-kanban__add-field--selected');
      clearTimeout(_assigneeTimer);
      if (q.length < 2) { hideAssigneeDd(); return; }
      assigneeDropdown.innerHTML = '<li class="mts-kanban__assignee-dd-empty">Buscando...</li>';
      assigneeDropdown.style.display = 'block';
      _assigneeTimer = setTimeout(() => {
        /* Llamada a la función de búsqueda — configurable vía onSearchAssignee */
        const search = this.onSearchAssignee
          ? this.onSearchAssignee(q)
          : Promise.resolve(this._defaultAssigneeSearch(q));
        Promise.resolve(search).then(users => showAssigneeDd(users));
      }, 300);
    });
    assigneeInput.addEventListener('blur', () => setTimeout(hideAssigneeDd, 150));

    /* ═══ PRIORIDAD ═══ */
    const prioRow    = F('div', 'mts-kanban__add-row');
    prioRow.appendChild(F('label', 'mts-kanban__add-label', { text:'⚡ Prioridad' }));
    const prioSelect = F('select', 'mts-kanban__add-field');
    [['', 'Sin prioridad'], ['low', 'Baja ↓'], ['medium', 'Media →'], ['high', 'Alta ↑']].forEach(([v, t]) => {
      const o = document.createElement('option'); o.value = v; o.textContent = t; prioSelect.appendChild(o);
    });
    prioSelect.value = 'medium';
    prioRow.appendChild(prioSelect);

    /* ═══ ACCIONES ═══ */
    const actions    = F('div', 'mts-kanban__add-actions');
    const confirmBtn = F('button', 'mts-btn mts-btn--primary mts-btn--sm', { text:'Agregar tarjeta' });
    const cancelBtn  = F('button', 'mts-kanban__form-close', { text:'✕' });

    const cancel = () => { form.remove(); addBtn.style.display = ''; };

    const confirm = () => {
      const title = titleInput.value.trim();
      if (!title) {
        titleInput.focus();
        titleInput.style.borderColor = 'var(--mts-color-danger,#f87171)';
        return;
      }
      /* Si escribió texto en asignado pero no seleccionó de la lista, usarlo igual */
      const assigneeName = _assignee?.name || assigneeInput.value.trim() || undefined;
      const newCard = {
        id:          'card-' + Date.now(),
        title,
        description: descInput.value.trim() || undefined,
        tags:        _tags.length ? [..._tags] : undefined,
        assignee:    assigneeName,
        priority:    prioSelect.value || undefined,
      };
      const col = this.columns.find(c => c.id === colId);
      if (col) col.cards.push(newCard);
      list.appendChild(this._buildCard(newCard, colId));
      const counter = colEl.querySelector('.mts-kanban__col-count');
      if (counter) counter.textContent = col ? col.cards.length : '';
      this._emit('cardAdd', { card: newCard, colId });
      form.remove();
      addBtn.style.display = '';
    };

    confirmBtn.addEventListener('click', confirm);
    titleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') cancel();
      titleInput.style.borderColor = '';
    });

    /* Botón cerrar en top-right del form */
    cancelBtn.addEventListener('click', cancel);
    form.style.position = 'relative';
    form.appendChild(cancelBtn);

    form.appendChild(titleInput);
    form.appendChild(descInput);
    form.appendChild(tagsRow);
    form.appendChild(assigneeRow);
    form.appendChild(prioRow);
    actions.appendChild(confirmBtn);
    form.appendChild(actions);
    colEl.insertBefore(form, addBtn);
    titleInput.focus();
  }

  /* Búsqueda de asignados por defecto — sobreescribible con onSearchAssignee */
  _defaultAssigneeSearch(query) {
    const USERS = [
      'Ana Torres','Carlos Ruiz','Juan Pérez','María Alarcón',
      'Pedro Díaz','Rosa Medina','Luis García','Sofía Castro',
      'Diego Herrera','Valentina López','Andrés Muñoz','Camila Soto',
    ];
    const q = query.toLowerCase();
    return USERS.filter(u => u.toLowerCase().includes(q)).map(name => ({ name }));
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:kanban:${event}`, { bubbles: true, detail }));
  }
};
