/* ============================================================
   MATIOS UI — matios-ui-kanban.js
   MTS.Kanban — Tablero Kanban con drag & drop entre columnas

   Dep: base/matios-ui-base.js (MTS._defineEvents)

   Eventos (via MTS._defineEvents — cada uno devuelve dispose()):
     onLoad | onCardAdd | onCardChange | onCardMove | onCardDelete
     onCardClick | onColumnChange

   DOM events (backward compat):
     mts:kanban:card-add | mts:kanban:card-change | mts:kanban:card-move
     mts:kanban:card-delete | mts:kanban:card-click | mts:kanban:column-change
     mts:kanban:load | mts:kanban:drop
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Kanban = class MtsKanban {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {Array}    options.columns      [{ id, title, color?, wip?, cards:[] }]
   * @param {boolean}  options.addCards     Permite agregar tarjetas — default: false
   * @param {function} options.dataSource   fn(query) => Promise<{columns, cards}> — carga async
   * @param {function} options.onLoad       Constructor handler
   * @param {function} options.onCardAdd    Constructor handler
   * @param {function} options.onCardChange Constructor handler
   * @param {function} options.onCardMove   Constructor handler (antes onMove)
   * @param {function} options.onCardDelete Constructor handler
   * @param {function} options.onCardClick  Constructor handler
   * @param {function} options.onColumnChange Constructor handler
   * @param {function} options.onSearchAssignee (query) => items[] | Promise<items[]>
   */
  constructor(selector, options) {
    var opts = options || {};
    this._el  = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;

    this.columns          = opts.columns   || [];
    this.addCards         = opts.addCards  != null ? opts.addCards : false;
    this._dataSource      = opts.dataSource || null;
    this._dragCard        = null;
    this._dragCol         = null;
    this.onSearchAssignee = opts.onSearchAssignee || null;
    this._addTaskCfg      = opts.addTask || null;
    this.editColumns      = opts.editColumns != null ? opts.editColumns : false;

    // Regla 1: API de eventos explícita via MTS._defineEvents
    MTS._defineEvents(this, [
      'load', 'addTask', 'cardAdd', 'cardChange', 'cardMove', 'cardDelete',
      'cardClick', 'columnChange', 'columnAdd', 'columnRemove',
    ], opts);

    // Override _emit para también despachar DOM events (backward compat)
    var self = this;
    var _mtsEmit = this._emit.bind(this);
    this._emit = function(name, payload) {
      _mtsEmit(name, payload);
      // Convertir camelCase a kebab-case para DOM events
      var domName = 'mts:kanban:' + name.replace(/([A-Z])/g, function(c) { return '-' + c.toLowerCase(); });
      self._el.dispatchEvent(new CustomEvent(domName, { bubbles: true, detail: payload }));
    };

    if (this._dataSource) {
      this._load();
    } else {
      this._build();
    }
  }

  /* ── API pública ────────────────────────────────────────── */

  // i18n: texto propio del componente (capa MTS.Kanban) con fallback.
  _t(key, fallback) {
    var loc = (window.MTS && typeof MTS.getLocale === 'function') ? MTS.getLocale()['MTS.Kanban'] : null;
    return (loc && loc[key] != null) ? loc[key] : fallback;
  }

  // ── Contrato MTS.DevPanel: getConfig() + getCode() ───────
  getConfig() {
    return [
      { group: 'Tarjetas', key: 'addCards', type: 'toggle', label: 'Agregar inline', value: !!this.addCards,
        description: 'Botón "+ Agregar tarjeta" inline por columna',
        apply: function (v, k) { k.addCards = v; k._build(); } },
    ];
  }
  getCode() {
    var sel = (this._el && this._el.id) ? ("'#" + this._el.id + "'") : "'#kanban'";
    return [
      'const kanban = new MTS.Kanban(' + sel + ', {',
      '  dataSource: myDataSource,',
      '  addCards:   ' + (!!this.addCards) + ',',
      '});',
    ].join('\n');
  }

  addCard(colId, card) {
    var col = this.columns.find(function(c) { return c.id === colId; });
    if (col) { col.cards.push(card); this._renderColumn(colId); }
    return this;
  }

  // Normaliza un objeto canónico (alineado a Trello) + alias → { columnId, card }.
  // Acepta: name|title, desc|description, idList|columnId|colId, labels|tags, members|assignee, due.
  _normalizeCanonicalCard(t) {
    t = t || {};
    var columnId = t.columnId || t.idList || t.colId || (this.columns[0] && this.columns[0].id);
    var card = {};
    card.id    = t.id || ('c-' + Date.now());
    card.title = t.title || t.name || '';
    if (t.description != null || t.desc != null) { card.description = t.description || t.desc; }
    if (t.priority) { card.priority = t.priority; }
    var tags = t.tags != null ? t.tags : t.labels;
    if (tags != null) { card.tags = tags; }
    if (t.assignee) { card.assignee = t.assignee; }
    else if (Array.isArray(t.members) && t.members[0]) { card.assignee = t.members[0].name || t.members[0]; }
    if (t.due) { card.due = t.due; }

    var known = { id:1, title:1, name:1, description:1, desc:1, columnId:1, idList:1, colId:1,
                  priority:1, tags:1, labels:1, assignee:1, members:1, due:1 };
    card.extras = {};
    Object.keys(t).forEach(function (k) { if (!known[k]) { card.extras[k] = t[k]; } });

    return { columnId: columnId, card: card };
  }

  // Cosecha de formulario (modal del dev): clave = name||id ; valor = _mtsInstance.getValue()/.value.
  _collectFormData(root) {
    var data = {};
    if (!root) return data;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
      acceptNode: function (node) {
        if (node.hasAttribute && node.hasAttribute('data-mts-collect-ignore')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var node;
    while ((node = walker.nextNode())) {
      var isMts = !!node._mtsInstance;
      var isNative = (node.tagName === 'INPUT' || node.tagName === 'SELECT' || node.tagName === 'TEXTAREA') &&
        node.type !== 'submit' && node.type !== 'button' && node.type !== 'reset' && node.type !== 'image';
      if (!isMts && !isNative) continue;
      if (isNative && !isMts) {
        var p = node.parentNode, inside = false;
        while (p && p !== root) { if (p._mtsInstance) { inside = true; break; } p = p.parentNode; }
        if (inside) continue;
      }
      var key = (node.getAttribute && node.getAttribute('name')) || node.id;
      if (!key) continue;
      if (Object.prototype.hasOwnProperty.call(data, key)) continue;
      var inst = node._mtsInstance, val;
      if (inst && typeof inst.getValue === 'function')       val = inst.getValue();
      else if (inst && typeof inst.isChecked === 'function') val = inst.isChecked();
      else if (inst && typeof inst.getTags === 'function')   val = inst.getTags();
      else if (node.type === 'checkbox' || node.type === 'radio') val = node.checked;
      else val = node.value !== undefined ? node.value : '';
      data[key] = val;
    }
    return data;
  }

  // Cosecha el modal del dev y dispara onAddTask. Lo llama el botón confirmar del modal del dev.
  submitAddTask() {
    var cfg = this._addTaskCfg;
    if (!cfg) return this;
    var root = typeof cfg.form === 'string'  ? document.querySelector(cfg.form)
             : cfg.form ? cfg.form
             : typeof cfg.modal === 'string' ? document.querySelector(cfg.modal)
             : cfg.modal || null;
    if (!root) return this;

    var data = this._collectFormData(root);
    if (typeof cfg.map === 'function') { data = cfg.map(data) || data; }

    var self = this, settled = false;
    function finish(card) {
      if (settled) return;
      settled = true;
      var src = (card && typeof card === 'object') ? card : data;
      var res = self._normalizeCanonicalCard(src);
      self.addCard(res.columnId, res.card);
      self._emit('cardAdd', { card: res.card, colId: res.columnId });
      if (typeof cfg.close === 'function') cfg.close();
    }
    var ev = { data: data, resolve: finish, reject: function () { settled = true; } };
    var has = this._listeners.addTask && this._listeners.addTask.length;
    this._emit('addTask', ev);
    if (!has) finish();
    return this;
  }

  updateCard(id, fields) {
    var card = null;
    this.columns.forEach(function(col) {
      col.cards.forEach(function(c) { if (c.id === id) card = c; });
    });
    if (!card) return this;
    var changed = {};
    Object.keys(fields).forEach(function(k) {
      if (card[k] !== fields[k]) { card[k] = fields[k]; changed[k] = fields[k]; }
    });
    if (Object.keys(changed).length) {
      this._emit('cardChange', { card: card, fields: changed });
      this._build();
    }
    return this;
  }

  removeCard(cardId) {
    var removed = null, fromColId = null;
    this.columns.forEach(function(col) {
      var i = col.cards.findIndex(function(c) { return c.id === cardId; });
      if (i >= 0) { removed = col.cards.splice(i, 1)[0]; fromColId = col.id; }
    });
    if (removed) {
      this._emit('cardDelete', { card: removed, colId: fromColId });
      this._build();
    }
    return this;
  }

  /** Retorna las columnas con sus cards (copia superficial del arreglo de columnas). */
  getColumns() {
    return this.columns.slice();
  }

  /** Retorna las cards de una columna por id, o todas las cards si no se pasa colId. */
  getCards(colId) {
    if (colId != null) {
      var col = this.columns.find(function(c) { return c.id === colId; });
      return col ? col.cards.slice() : [];
    }
    var all = [];
    this.columns.forEach(function(col) { all = all.concat(col.cards); });
    return all;
  }

  moveCard(cardId, toColId, idx) {
    idx = idx != null ? idx : 0;
    var card = null, fromCol = null;
    this.columns.forEach(function(col) {
      var i = col.cards.findIndex(function(c) { return c.id === cardId; });
      if (i >= 0) { card = col.cards.splice(i, 1)[0]; fromCol = col; }
    });
    var toCol = this.columns.find(function(c) { return c.id === toColId; });
    if (card && toCol) { toCol.cards.splice(idx, 0, card); this._build(); }
    return this;
  }

  setColumns(cols) { this.columns = cols; this._build(); return this; }

  // ── Gestión dinámica de columnas ─────────────────────────
  addColumn(col, index) {
    col = col || {};
    if (!col.id) col.id = 'col-' + Date.now();
    if (!Array.isArray(col.cards)) col.cards = [];
    if (index != null && index >= 0 && index <= this.columns.length) this.columns.splice(index, 0, col);
    else this.columns.push(col);
    this._build();
    this._emit('columnAdd', { column: col, index: this.columns.indexOf(col) });
    return this;
  }

  removeColumn(id) {
    var i = this.columns.findIndex(function (c) { return c.id === id; });
    if (i < 0) return this;
    var col = this.columns.splice(i, 1)[0];
    this._build();
    this._emit('columnRemove', { column: col });
    return this;
  }

  renameColumn(id, title) {
    var col = this.columns.find(function (c) { return c.id === id; });
    if (!col || col.title === title) return this;
    col.title = title;
    this._build();
    this._emit('columnChange', { column: col, fields: { title: title } });
    return this;
  }

  reload() {
    if (this._dataSource) { this._load(); } else { this._build(); }
    return this;
  }

  destroy() {
    this._el.innerHTML = ''; // safe: clearing
    this._disposeAllListeners();
  }

  /* ── Interno: load dataSource ───────────────────────────── */

  _load() {
    var self = this;
    var promise;
    try { promise = Promise.resolve(this._dataSource({})); }
    catch(e) { promise = Promise.reject(e); }

    promise.then(function(res) {
      if (res.columns) self.columns = res.columns;
      if (res.cards) {
        var cardMap = {};
        res.cards.forEach(function(c) { cardMap[c.colId] = cardMap[c.colId] || []; cardMap[c.colId].push(c); });
        self.columns.forEach(function(col) { if (cardMap[col.id]) col.cards = cardMap[col.id]; });
      }
      self._build();
      self._emit('load', { columns: self.columns });
    }).catch(function(err) {
      console.error('[MTS.Kanban] dataSource error:', err);
    });
  }

  /* ── Interno: build DOM ─────────────────────────────────── */

  _build() {
    var self = this;

    if (this._addTaskCfg && this._addTaskCfg.showButton !== false) {
      // Estructura con toolbar: [ toolbar (botón) ] sobre [ cols (columnas) ]
      this._syncClasses(['mts-kanban', 'mts-kanban--has-toolbar']);
      this._el.innerHTML = ''; // safe: clearing

      var toolbar = document.createElement('div');
      toolbar.className = 'mts-kanban__toolbar';
      var btn = document.createElement('button');
      btn.type        = 'button';
      btn.className   = 'mts-btn mts-btn--primary mts-btn--sm';
      btn.textContent = this._addTaskCfg.label || this._t('addTaskDefault', '+ Agregar tarea');
      var cfg = this._addTaskCfg;
      btn.addEventListener('click', function() { if (typeof cfg.open === 'function') cfg.open(); });
      toolbar.appendChild(btn);
      this._el.appendChild(toolbar);

      var cols = document.createElement('div');
      cols.className = 'mts-kanban__cols';
      this.columns.forEach(function(col) { cols.appendChild(self._buildColumn(col)); });
      if (this.editColumns) cols.appendChild(this._buildAddColumnTile());
      this._el.appendChild(cols);
      return;
    }

    // Estructura clásica: columnas directas en la raíz (sin cambios)
    this._syncClasses(['mts-kanban']);
    this._el.innerHTML = ''; // safe: clearing
    this.columns.forEach(function(col) {
      self._el.appendChild(self._buildColumn(col));
    });
    if (this.editColumns) this._el.appendChild(this._buildAddColumnTile());
  }

  // Tile "+ Columna" al final del tablero (opción editColumns). Click → input inline → addColumn.
  _buildAddColumnTile() {
    var self = this;
    var tile = document.createElement('div');
    tile.className = 'mts-kanban__add-col';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mts-kanban__add-col-btn';
    var plus = document.createElement('span');
    plus.textContent = '+';
    btn.appendChild(plus);
    btn.appendChild(document.createTextNode(' ' + this._t('addColumn', 'Columna')));
    btn.addEventListener('click', function () {
      var inp = document.createElement('input');
      inp.type = 'text';
      inp.className = 'mts-kanban__add-col-input';
      inp.placeholder = self._t('columnNamePh', 'Nombre de la columna');
      tile.replaceChild(inp, btn);
      inp.focus();
      var commit = function () {
        var v = inp.value.trim();
        if (v) self.addColumn({ title: v });
        else self._build();
      };
      inp.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); commit(); }
        else if (e.key === 'Escape') { self._build(); }
      });
      inp.addEventListener('blur', commit);
    });
    tile.appendChild(btn);
    return tile;
  }

  _buildColumn(col) {
    var self  = this;
    // Modo B (cards aparte por colId): una columna sin tarjetas queda sin `cards`
    // tras la distribución de _load(). Garantizamos siempre un array para no
    // romper el contador ni el listado de abajo (col.cards.length / forEach).
    if (!Array.isArray(col.cards)) col.cards = [];
    var colEl = document.createElement('div');
    colEl.className    = 'mts-kanban__col';
    colEl.dataset.colId = col.id;

    // Header
    var header = document.createElement('div');
    header.className = 'mts-kanban__col-header';

    var dot = document.createElement('span');
    dot.className = 'mts-kanban__col-dot';
    if (col.color) dot.style.background = col.color;

    var titleEl = document.createElement('span');
    titleEl.className   = 'mts-kanban__col-title';
    titleEl.textContent = col.title;

    var count = document.createElement('span');
    count.className   = 'mts-kanban__col-count';
    count.textContent = col.cards.length;
    if (col.wip && col.cards.length >= col.wip) count.classList.add('mts-kanban__col-count--over');

    header.appendChild(dot);
    header.appendChild(titleEl);
    header.appendChild(count);

    // Gestión de columnas (opción editColumns): renombrar (doble clic en título) + borrar (×).
    if (this.editColumns) {
      titleEl.title = this._t('renameHint', 'Doble clic para renombrar');
      titleEl.addEventListener('dblclick', function () {
        var inp = document.createElement('input');
        inp.type = 'text';
        inp.className = 'mts-kanban__col-title-input';
        inp.value = col.title || '';
        header.replaceChild(inp, titleEl);
        inp.focus(); inp.select();
        var done = function () {
          var v = inp.value.trim();
          if (v && v !== col.title) self.renameColumn(col.id, v);
          else self._build();
        };
        inp.addEventListener('keydown', function (e) {
          if (e.key === 'Enter') { e.preventDefault(); done(); }
          else if (e.key === 'Escape') { self._build(); }
        });
        inp.addEventListener('blur', done);
      });

      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'mts-kanban__col-del';
      del.title = this._t('deleteColumn', 'Eliminar columna');
      del.textContent = '×';
      del.addEventListener('click', function () { self.removeColumn(col.id); });
      header.appendChild(del);
    }

    colEl.appendChild(header);

    // Cards list
    var list = document.createElement('div');
    list.className    = 'mts-kanban__list';
    list.dataset.colId = col.id;
    col.cards.forEach(function(card) { list.appendChild(self._buildCard(card, col.id)); });

    // Drag over handlers
    list.addEventListener('dragover', function(e) {
      e.preventDefault();
      list.classList.add('mts-kanban__list--over');
      var afterEl = self._getDragAfterEl(list, e.clientY);
      var drag    = self._el.querySelector('.mts-kanban__card--dragging');
      if (drag) { afterEl ? list.insertBefore(drag, afterEl) : list.appendChild(drag); }
    });

    list.addEventListener('dragleave', function(e) {
      if (!list.contains(e.relatedTarget)) list.classList.remove('mts-kanban__list--over');
    });

    list.addEventListener('drop', function(e) {
      e.preventDefault();
      list.classList.remove('mts-kanban__list--over');
      if (!self._dragCard) return;
      var fromColId   = self._dragCol;
      var toColId     = col.id;
      var draggingEl  = self._el.querySelector('.mts-kanban__card--dragging');
      var allCards    = Array.from(list.querySelectorAll('.mts-kanban__card'));
      var newIndex    = 0;
      for (var i = 0; i < allCards.length; i++) {
        if (allCards[i] === draggingEl) break;
        if (!allCards[i].classList.contains('mts-kanban__card--dragging')) newIndex++;
      }
      var fromCol = self.columns.find(function(c) { return c.id === fromColId; });
      var toCol   = self.columns.find(function(c) { return c.id === toColId; });
      if (fromCol && toCol) {
        var ci   = fromCol.cards.findIndex(function(c) { return c.id === self._dragCard; });
        var card = fromCol.cards.splice(ci, 1)[0];
        toCol.cards.splice(newIndex, 0, card);
        count.textContent = toCol.cards.length;
        if (fromColId !== toColId) {
          var fromCounter = self._el.querySelector('[data-col-id="' + fromColId + '"] .mts-kanban__col-count');
          if (fromCounter) fromCounter.textContent = fromCol.cards.length;
        }
        var position = newIndex + 1;
        self._emit('cardMove', { card: card, fromColId: fromColId, toColId: toColId, position: position, newIndex: newIndex });
        // Mantener backward compat: también emitir 'drop' como evento DOM
        self._el.dispatchEvent(new CustomEvent('mts:kanban:drop', { bubbles: true, detail: { card: card, toColId: toColId, position: position } }));
      }
      self._dragCard = null;
      self._dragCol  = null;
    });

    colEl.appendChild(list);

    // Botón agregar
    if (this.addCards) {
      var addBtn = document.createElement('button');
      addBtn.className = 'mts-kanban__add';
      var addBtnPlus = document.createElement('span');
      addBtnPlus.textContent = '+';
      addBtn.appendChild(addBtnPlus);
      addBtn.appendChild(document.createTextNode(' ' + self._t('addCard', 'Agregar tarjeta')));
      addBtn.addEventListener('click', function() {
        addBtn.style.display = 'none';
        self._showInlineAddForm(colEl, col.id, list, addBtn);
      });
      colEl.appendChild(addBtn);
    }

    return colEl;
  }

  _buildCard(card, colId) {
    var self = this;
    var el   = document.createElement('div');
    el.className   = 'mts-kanban__card';
    el.draggable   = true;
    el.dataset.cardId = card.id;
    if (card.priority) el.classList.add('mts-kanban__card--' + card.priority);

    el.addEventListener('dragstart', function(e) {
      self._dragCard = card.id;
      self._dragCol  = colId;
      document.body.style.cursor = 'grabbing';
      e.dataTransfer.effectAllowed = 'move';
      setTimeout(function() { el.classList.add('mts-kanban__card--dragging'); }, 0);
    });

    el.addEventListener('dragend', function() {
      el.classList.remove('mts-kanban__card--dragging');
      self._el.querySelectorAll('.mts-kanban__list--over').forEach(function(l) { l.classList.remove('mts-kanban__list--over'); });
      document.body.style.cursor = '';
    });

    if (self._listeners['cardClick'] && self._listeners['cardClick'].length) {
      el.addEventListener('click', function() { self._emit('cardClick', { card: card, colId: colId }); });
    }

    var title = document.createElement('div');
    title.className   = 'mts-kanban__card-title';
    title.textContent = card.title;
    el.appendChild(title);

    if (card.description) {
      var d = document.createElement('div');
      d.className   = 'mts-kanban__card-desc';
      d.textContent = card.description;
      el.appendChild(d);
    }

    var hasTags    = card.tags && card.tags.length;
    var hasAssignee = !!card.assignee;

    if (hasTags || hasAssignee) {
      var footer = document.createElement('div');
      footer.className = 'mts-kanban__card-footer';

      var tagsEl = document.createElement('div');
      tagsEl.className = 'mts-kanban__card-tags';
      if (hasTags) {
        card.tags.forEach(function(tag) {
          var t = document.createElement('span');
          t.className   = 'mts-kanban__card-tag';
          t.textContent = typeof tag === 'object' ? (tag.label || '') : tag;
          tagsEl.appendChild(t);
        });
      }
      footer.appendChild(tagsEl);

      if (hasAssignee) {
        var initials = card.assignee.split(' ').map(function(p) { return p[0]; }).join('').slice(0, 2).toUpperCase();
        var av = document.createElement('span');
        av.className   = 'mts-kanban__card-av';
        av.textContent = initials;
        av.title       = card.assignee;
        footer.appendChild(av);
      }
      el.appendChild(footer);
    }

    return el;
  }

  _renderColumn(colId) {
    var colEl = this._el.querySelector('[data-col-id="' + colId + '"]');
    if (!colEl) return;
    var col   = this.columns.find(function(c) { return c.id === colId; });
    if (!col) return;
    colEl.replaceWith(this._buildColumn(col));
  }

  _getDragAfterEl(container, y) {
    var cards = Array.from(container.querySelectorAll('.mts-kanban__card:not(.mts-kanban__card--dragging)'));
    return cards.reduce(function(closest, child) {
      var box    = child.getBoundingClientRect();
      var offset = y - box.top - box.height / 2;
      return offset < 0 && offset > closest.offset ? { offset: offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  _syncClasses(classes) {
    var prev = Array.from(this._el.classList).filter(function(cls) {
      return cls === 'mts-kanban' || cls.startsWith('mts-kanban--');
    });
    if (prev.length) this._el.classList.remove.apply(this._el.classList, prev);
    this._el.classList.add.apply(this._el.classList, classes.filter(Boolean));
  }

  _showInlineAddForm(colEl, colId, list, addBtn) {
    var self = this;
    var form = document.createElement('div');
    form.className = 'mts-kanban__add-form';

    function F(tag, cls, opts) {
      opts = opts || {};
      var el = document.createElement(tag);
      if (cls) el.className = cls;
      Object.keys(opts).forEach(function(k) {
        if (k === 'text') el.textContent = opts[k];
        else el[k] = opts[k];
      });
      return el;
    }

    var titleInput = F('textarea', 'mts-kanban__add-input', { placeholder: self._t('titlePh', 'Título de la tarjeta *'), rows: 2 });
    var descInput  = F('textarea', 'mts-kanban__add-input mts-kanban__add-input--sm', { placeholder: self._t('descPh', 'Descripción (opcional)'), rows: 2 });

    var tagsRow  = F('div', 'mts-kanban__add-row');
    tagsRow.appendChild(F('label', 'mts-kanban__add-label', { text: self._t('tags', 'Tags') }));
    var tagsWrap = F('div', 'mts-kanban__tags-wrap');
    var tagsBox  = F('input', 'mts-kanban__tags-input', { type: 'text', placeholder: self._t('tagsPh', 'Escribe y presiona Enter…') });
    tagsWrap.appendChild(tagsBox);
    tagsRow.appendChild(tagsWrap);
    var _tags = [];

    var renderTags = function() {
      tagsWrap.querySelectorAll('.mts-kanban__tag-pill').forEach(function(p) { p.remove(); });
      _tags.forEach(function(tag, i) {
        var pill = F('span', 'mts-kanban__tag-pill');
        pill.textContent = tag + ' ';
        var _tagRemove = document.createElement('span');
        _tagRemove.className   = 'mts-kanban__tag-remove';
        _tagRemove.textContent = '×';
        pill.appendChild(_tagRemove);
        pill.querySelector('.mts-kanban__tag-remove').addEventListener('click', function() {
          _tags.splice(i, 1); renderTags();
        });
        tagsWrap.insertBefore(pill, tagsBox);
      });
    };

    tagsBox.addEventListener('keydown', function(e) {
      if ((e.key === 'Enter' || e.key === ',') && tagsBox.value.trim()) {
        e.preventDefault();
        var val = tagsBox.value.replace(',', '').trim();
        if (val && !_tags.includes(val)) { _tags.push(val); renderTags(); }
        tagsBox.value = '';
      }
      if (e.key === 'Backspace' && !tagsBox.value && _tags.length) { _tags.pop(); renderTags(); }
    });

    var assigneeRow      = F('div', 'mts-kanban__add-row');
    assigneeRow.appendChild(F('label', 'mts-kanban__add-label', { text: self._t('assigneeLabel', 'Asignado') }));
    var assigneeWrap     = F('div', 'mts-kanban__assignee-wrap');
    var assigneeInput    = F('input', 'mts-kanban__add-field', { type: 'text', placeholder: self._t('assigneePh', 'Buscar usuario…') });
    var assigneeDropdown = F('ul', 'mts-kanban__assignee-dd');
    assigneeDropdown.style.display = 'none';
    assigneeWrap.appendChild(assigneeInput);
    assigneeWrap.appendChild(assigneeDropdown);
    assigneeRow.appendChild(assigneeWrap);
    var _assignee = null;
    var _assigneeTimer = null;

    var hideAssigneeDd = function() { assigneeDropdown.style.display = 'none'; };
    var showAssigneeDd = function(users) {
      assigneeDropdown.innerHTML = ''; // safe: clearing
      if (!users.length) {
        assigneeDropdown.appendChild(F('li', 'mts-kanban__assignee-dd-empty', { text: self._t('noResults', 'Sin resultados') }));
      } else {
        users.forEach(function(u) {
          var li = F('li', 'mts-kanban__assignee-dd-item');
          var av = F('span', 'mts-kanban__assignee-av');
          av.textContent = u.name.split(' ').map(function(p) { return p[0]; }).join('').slice(0, 2).toUpperCase();
          var nm = F('span', '', { text: u.name });
          li.appendChild(av);
          li.appendChild(nm);
          li.addEventListener('mousedown', function(e) {
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

    assigneeInput.addEventListener('input', function() {
      var q = assigneeInput.value.trim();
      _assignee = null;
      assigneeInput.classList.remove('mts-kanban__add-field--selected');
      clearTimeout(_assigneeTimer);
      if (q.length < 2) { hideAssigneeDd(); return; }
      assigneeDropdown.innerHTML = ''; // safe: clearing
      assigneeDropdown.appendChild(F('li', 'mts-kanban__assignee-dd-empty', { text: self._t('searching', 'Buscando…') }));
      assigneeDropdown.style.display = 'block';
      _assigneeTimer = setTimeout(function() {
        var search = self.onSearchAssignee
          ? self.onSearchAssignee(q)
          : Promise.resolve(self._defaultAssigneeSearch(q));
        Promise.resolve(search).then(function(users) { showAssigneeDd(users); });
      }, 300);
    });

    assigneeInput.addEventListener('blur', function() { setTimeout(hideAssigneeDd, 150); });

    var prioRow    = F('div', 'mts-kanban__add-row');
    prioRow.appendChild(F('label', 'mts-kanban__add-label', { text: self._t('priorityLabel', 'Prioridad') }));
    var prioSelect = F('select', 'mts-kanban__add-field');
    [['', self._t('priorityNone', 'Sin prioridad')], ['low', self._t('priorityLow', 'Baja')], ['medium', self._t('priorityMedium', 'Media')], ['high', self._t('priorityHigh', 'Alta')]].forEach(function(item) {
      var o = document.createElement('option');
      o.value       = item[0];
      o.textContent = item[1];
      prioSelect.appendChild(o);
    });
    prioSelect.value = 'medium';
    prioRow.appendChild(prioSelect);

    var actions    = F('div', 'mts-kanban__add-actions');
    var confirmBtn = F('button', 'mts-btn mts-btn--primary mts-btn--sm', { text: self._t('addCard', 'Agregar tarjeta') });
    var cancelBtn  = F('button', 'mts-kanban__form-close', { text: '✕' });

    var cancel = function() { form.remove(); addBtn.style.display = ''; };

    var confirm = function() {
      var titleVal = titleInput.value.trim();
      if (!titleVal) {
        titleInput.focus();
        titleInput.style.borderColor = 'var(--mts-color-danger,#f87171)';
        return;
      }
      var assigneeName = (_assignee && _assignee.name) || assigneeInput.value.trim() || undefined;
      var newCard = {
        id:          'card-' + Date.now(),
        title:       titleVal,
        description: descInput.value.trim() || undefined,
        tags:        _tags.length ? _tags.slice() : undefined,
        assignee:    assigneeName,
        priority:    prioSelect.value || undefined,
      };
      var col = self.columns.find(function(c) { return c.id === colId; });
      if (col) col.cards.push(newCard);
      list.appendChild(self._buildCard(newCard, colId));
      var counter = colEl.querySelector('.mts-kanban__col-count');
      if (counter) counter.textContent = col ? col.cards.length : '';
      self._emit('cardAdd', { card: newCard, colId: colId });
      form.remove();
      addBtn.style.display = '';
    };

    confirmBtn.addEventListener('click', confirm);
    titleInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') cancel();
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); confirm(); }
    });

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

  _defaultAssigneeSearch(query) {
    var USERS = [
      'Ana Torres','Carlos Ruiz','Juan Pérez','María Alarcón',
      'Pedro Díaz','Rosa Medina','Luis García','Sofía Castro',
      'Diego Herrera','Valentina López','Andrés Muñoz','Camila Soto',
    ];
    var q = query.toLowerCase();
    return USERS.filter(function(u) { return u.toLowerCase().includes(q); }).map(function(name) { return { name: name }; });
  }
};
