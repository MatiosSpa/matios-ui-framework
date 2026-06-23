/* ============================================================
   MATIOS UI - matios-ui-transferlist.js
   MTS.TransferList
   Version: 2.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.TransferList = class MtsTransferList {
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._el) { console.error('[MTS.TransferList] Not found / No encontrado:', selector); return; }

    this.label = options.label || '';
    this.hint = options.hint || '';

    this.originTitle = options.originTitle || options.availableTitle || 'Origin';
    this.selectedTitle = options.selectedTitle || options.targetTitle || 'Selected';

    this.originEmptyText = options.originEmptyText || options.availableEmptyText || 'No items available';
    this.selectedEmptyText = options.selectedEmptyText || 'No items selected';

    this.itemLabel = options.itemLabel || 'label';
    this.itemDescription = options.itemDescription || 'description';
    this.renderItem = typeof options.renderItem === 'function' ? options.renderItem : null;

    this.showMoveButtons = options.showMoveButtons !== false;
    var _noBtnObj = options.buttons == null;
    this.buttons = {
      allToSelected: _noBtnObj ? true : options.buttons.allToSelected === true,
      toSelected:    _noBtnObj ? true : options.buttons.toSelected    === true,
      toOrigin:      _noBtnObj ? true : options.buttons.toOrigin      === true,
      allToOrigin:   _noBtnObj ? true : options.buttons.allToOrigin   === true,
    };
    this.removableSelectedItem = options.removableSelectedItem === true;
    this.draggable = options.draggable !== false;
    this.disabled = options.disabled === true;

    this.validateUnique = options.validateUnique === true;
    this.validateKey = options.validateKey || null;
    this.duplicateMessage = options.duplicateMessage || 'Duplicate item';

    this._onRequestItem = typeof options.onRequestItem === 'function' ? options.onRequestItem : null;
    this._onSelectionChange = typeof options.onSelectionChange === 'function' ? options.onSelectionChange : null;

    this._legacyOnChange = typeof options.onChange === 'function' ? options.onChange : null;
    this._legacyOnInvalidTransfer = typeof options.onInvalidTransfer === 'function' ? options.onInvalidTransfer : null;

    this._listeners = {};
    this._activeOriginKey = null;
    this._activeSelectedKey = null;
    this._dragContext = null;

    this.originDataSource = this._normalizeItems(
      options.originDataSource || options.availableItems || options.options || []
    );
    this.selectedDataSource = this._normalizeItems(
      options.selectedDataSource || options.selectedItems || options.value || []
    );

    /* Form-field contract */
    this.required     = options.required     != null ? !!options.required : false;
    this.errorMessage = options.errorMessage != null ? options.errorMessage : null;
    this._error       = '';
    var self = this;
    this.on('change', function () { if (self._error) self.clearError(); });

    this._build();
    this._bindEvents();
    this._render();
  }

  /* ── Form-field validation contract — required = at least one selected ── */
  setError(msg) {
    this._error = msg || '';
    if (!this._errEl || !this._errEl.isConnected) {
      this._errEl = document.createElement('span');
      this._errEl.className = 'mts-form-error';
      this._el.appendChild(this._errEl);
    }
    this._errEl.textContent = this._error;
    this._errEl.style.display = this._error ? '' : 'none';
    return this;
  }
  clearError() { return this.setError(''); }
  validate() {
    var ok = !this.required || this.getSelectedItems().length > 0;
    if (ok) { this.clearError(); } else { this.setError(this.errorMessage || this._t('required', 'This field is required')); }
    this._emit('validate', { valid: ok, errors: ok ? [] : [this._error] });
    return ok;
  }
  _t(key, fallback) {
    try { var ns = (window.MTS && MTS.getLocale) ? MTS.getLocale()['MTS.TransferList'] : null; var m = ns && ns.messages; if (m && m[key] != null) { return m[key]; } } catch (e) {}
    return fallback;
  }

  on(event, cb) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(cb);
    return this;
  }

  off(event, cb) {
    this._listeners[event] = (this._listeners[event] || []).filter(function (fn) { return fn !== cb; });
    return this;
  }

  getValue() {
    return this.getSelectedItems();
  }

  getSelectedItems() {
    return this.selectedDataSource.map(function (entry) { return entry.item; });
  }

  getOriginItems() {
    return this.originDataSource.map(function (entry) { return entry.item; });
  }

  getAvailableItems() {
    return this.getOriginItems();
  }

  setItems(payload) {
    this.originDataSource = this._normalizeItems(
      payload.originDataSource || payload.availableItems || payload.options || []
    );
    this.selectedDataSource = this._normalizeItems(
      payload.selectedDataSource || payload.selectedItems || payload.value || []
    );
    this._activeOriginKey = null;
    this._activeSelectedKey = null;
    this._clearDropState();
    this._render();
    return this;
  }

  setValue(items) {
    this.selectedDataSource = this._normalizeItems(items || []);
    this._activeSelectedKey = null;
    this._clearDropState();
    this._render();
    return this;
  }

  moveToSelected(key) {
    return this._attemptMove(key, 'origin', 'selected', 'button');
  }

  moveToOrigin(key) {
    return this._attemptMove(key, 'selected', 'origin', 'button');
  }

  moveToAvailable(key) {
    return this.moveToOrigin(key);
  }

  moveAllToSelected() {
    return this._moveAll('origin', 'selected', 'bulk');
  }

  moveAllToOrigin() {
    return this._moveAll('selected', 'origin', 'bulk');
  }

  moveAllToAvailable() {
    return this.moveAllToOrigin();
  }

  clear() {
    return this.moveAllToOrigin();
  }

  enable() {
    this.disabled = false;
    this._root.classList.remove('mts-transferlist--disabled');
    return this;
  }

  disable() {
    this.disabled = true;
    this._root.classList.add('mts-transferlist--disabled');
    return this;
  }

  destroy() {
    this._el.innerHTML = '';
  }

  _build() {
    this._el.innerHTML = '';

    if (this.label) {
      var lbl = document.createElement('label');
      lbl.className = 'mts-label';
      lbl.textContent = this.label;
      this._el.appendChild(lbl);
    }

    this._root = document.createElement('div');
    this._root.className = 'mts-transferlist';
    if (this.disabled) this._root.classList.add('mts-transferlist--disabled');

    // Origin column
    var originCol = document.createElement('div');
    originCol.className = 'mts-transferlist__column';
    originCol.innerHTML =
      '<div class="mts-transferlist__header">' +
        '<span class="mts-transferlist__title">' + this._escapeHtml(this.originTitle) + '</span>' +
        '<span class="mts-transferlist__count" data-transfer-count="origin">0</span>' +
      '</div>' +
      '<div class="mts-transferlist__list" data-transfer-list="origin"></div>';
    this._root.appendChild(originCol);

    // Controls — condicional por showMoveButtons + buttons individuales
    var controlsEl = this._buildControls();
    if (controlsEl) {
      this._root.appendChild(controlsEl);
    } else {
      this._root.classList.add('mts-transferlist--no-controls');
    }

    // Selected column
    var selectedCol = document.createElement('div');
    selectedCol.className = 'mts-transferlist__column';
    selectedCol.innerHTML =
      '<div class="mts-transferlist__header">' +
        '<span class="mts-transferlist__title">' + this._escapeHtml(this.selectedTitle) + '</span>' +
        '<span class="mts-transferlist__count" data-transfer-count="selected">0</span>' +
      '</div>' +
      '<div class="mts-transferlist__list" data-transfer-list="selected"></div>';
    this._root.appendChild(selectedCol);

    this._el.appendChild(this._root);

    if (this.hint) {
      var hint = document.createElement('span');
      hint.className = 'mts-form-hint';
      hint.textContent = this.hint;
      this._el.appendChild(hint);
    }

    this._originListEl   = this._root.querySelector('[data-transfer-list="origin"]');
    this._selectedListEl = this._root.querySelector('[data-transfer-list="selected"]');
    this._originCountEl  = this._root.querySelector('[data-transfer-count="origin"]');
    this._selectedCountEl = this._root.querySelector('[data-transfer-count="selected"]');
  }

  _buildControls() {
    if (!this.showMoveButtons) { return null; }

    var btns = [
      { action: 'all-to-selected', label: 'Move all to selected', show: this.buttons.allToSelected, char: '»' },
      { action: 'to-selected',     label: 'Move to selected',     show: this.buttons.toSelected,    char: '›' },
      { action: 'to-origin',       label: 'Move to origin',       show: this.buttons.toOrigin,      char: '‹' },
      { action: 'all-to-origin',   label: 'Move all to origin',   show: this.buttons.allToOrigin,   char: '«' },
    ];

    var visible = btns.filter(function (b) { return b.show; });
    if (!visible.length) { return null; }

    var controlsEl = document.createElement('div');
    controlsEl.className = 'mts-transferlist__controls';

    visible.forEach(function (b) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mts-transferlist__control';
      btn.setAttribute('data-transfer-action', b.action);
      btn.setAttribute('aria-label', b.label);
      btn.textContent = b.char;
      controlsEl.appendChild(btn);
    });

    return controlsEl;
  }

  _bindEvents() {
    var self = this;

    this._root.addEventListener('click', function (event) {
      // Botón (x) de eliminar — se procesa antes que la selección del ítem
      var removeBtn = event.target.closest('[data-transfer-remove]');
      if (removeBtn) {
        event.stopPropagation();
        if (self.disabled) { return; }
        self._removeSelectedItem(removeBtn.getAttribute('data-transfer-remove'));
        return;
      }

      var actionBtn = event.target.closest('[data-transfer-action]');
      if (actionBtn) {
        if (self.disabled) return;

        var action = actionBtn.getAttribute('data-transfer-action');
        if (action === 'to-selected' && self._activeOriginKey != null) self.moveToSelected(self._activeOriginKey);
        if (action === 'to-origin' && self._activeSelectedKey != null) self.moveToOrigin(self._activeSelectedKey);
        if (action === 'all-to-selected') self.moveAllToSelected();
        if (action === 'all-to-origin') self.moveAllToOrigin();
        return;
      }

      var itemEl = event.target.closest('[data-mts-item-key]');
      if (!itemEl || self.disabled) return;

      var side = itemEl.getAttribute('data-transfer-side');
      var key = itemEl.getAttribute('data-mts-item-key');
      var changed = false;

      if (side === 'origin' && String(self._activeOriginKey) !== String(key)) {
        self._activeOriginKey = key;
        changed = true;
      }

      if (side === 'selected' && String(self._activeSelectedKey) !== String(key)) {
        self._activeSelectedKey = key;
        changed = true;
      }

      self._render();
      if (changed) self._notifySelectionChange(side, key);
    });

    if (!this.draggable) return;

    this._root.addEventListener('dragstart', function (event) {
      var itemEl = event.target.closest('[data-mts-item-key]');
      if (!itemEl || self.disabled) return;

      self._dragContext = {
        key: itemEl.getAttribute('data-mts-item-key'),
        from: itemEl.getAttribute('data-transfer-side'),
        el: itemEl
      };

      itemEl.classList.add('mts-transferlist__item--dragging');
      try {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', self._dragContext.key);
      } catch (error) {}
    });

    this._root.addEventListener('dragend', function () {
      self._dragContext = null;
      self._root.querySelectorAll('.mts-transferlist__item--dragging').forEach(function (el) {
        el.classList.remove('mts-transferlist__item--dragging');
      });
      self._clearDropState();
    });

    [this._originListEl, this._selectedListEl].forEach(function (listEl) {
      listEl.addEventListener('dragover', function (event) {
        if (self.disabled || !self._dragContext) return;

        var targetSide = listEl.getAttribute('data-transfer-list');
        if (targetSide === self._dragContext.from) return;

        var entry = self._findEntryByKey(
          self._dragContext.from === 'origin' ? self.originDataSource : self.selectedDataSource,
          self._dragContext.key
        );
        if (!entry) return;

        event.preventDefault();
        self._applyDropState(listEl, self._evaluateMove(entry, self._dragContext.from, targetSide));
      });

      listEl.addEventListener('dragleave', function (event) {
        if (!event.relatedTarget || !listEl.contains(event.relatedTarget)) {
          listEl.classList.remove('mts-transferlist__list--over');
          listEl.classList.remove('mts-transferlist__list--blocked');
          listEl.removeAttribute('data-drop-message');
          listEl.removeAttribute('title');
        }
      });

      listEl.addEventListener('drop', function (event) {
        if (self.disabled || !self._dragContext) return;

        event.preventDefault();
        var targetSide = listEl.getAttribute('data-transfer-list');
        self._attemptMoveByKey(self._dragContext.key, self._dragContext.from, targetSide, 'drag');
      });
    });
  }

  _render() {
    this._renderList('origin', this.originDataSource, this._activeOriginKey, this._originListEl, this.originEmptyText);
    this._renderList('selected', this.selectedDataSource, this._activeSelectedKey, this._selectedListEl, this.selectedEmptyText);
    this._originCountEl.textContent = String(this.originDataSource.length);
    this._selectedCountEl.textContent = String(this.selectedDataSource.length);
  }

  _renderList(side, items, activeKey, host, emptyText) {
    host.innerHTML = '';

    if (!items.length) {
      host.innerHTML = '<div class="mts-transferlist__empty">' + this._escapeHtml(emptyText) + '</div>';
      return;
    }

    var self = this;
    items.forEach(function (entry) {
      var isActive = String(activeKey) === String(entry.key);
      var itemEl = document.createElement('div');
      itemEl.className = 'mts-transferlist__item' + (isActive ? ' mts-transferlist__item--active' : '');
      itemEl.setAttribute('data-mts-item-key', entry.key);
      itemEl.setAttribute('data-transfer-side', side);
      if (self.draggable && !self.disabled) itemEl.setAttribute('draggable', 'true');

      self._applyItemDataset(itemEl, entry.item);

      if (self.renderItem) {
        var _rendered = self.renderItem(entry.item, side, self) || '';
        itemEl.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(_rendered) : _rendered;
      } else {
        var label = self._resolveDisplayValue(entry.item, self.itemLabel);
        var description = self._resolveDisplayValue(entry.item, self.itemDescription);

        itemEl.innerHTML =
          '<div class="mts-transferlist__item-main">' +
            '<div class="mts-transferlist__item-label">' + self._escapeHtml(label || '-') + '</div>' +
            (description ? '<div class="mts-transferlist__item-desc">' + self._escapeHtml(description) + '</div>' : '') +
          '</div>';
      }

      // Botón (x) — solo en lado seleccionado, solo si removableSelectedItem: true
      if (side === 'selected' && self.removableSelectedItem) {
        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'mts-transferlist__item-remove';
        removeBtn.setAttribute('data-transfer-remove', entry.key);
        removeBtn.setAttribute('aria-label', 'Remove item');
        removeBtn.textContent = '×';
        itemEl.appendChild(removeBtn);
      }

      host.appendChild(itemEl);
    });
  }

  _removeSelectedItem(key) {
    var index = -1;
    for (var i = 0; i < this.selectedDataSource.length; i++) {
      if (String(this.selectedDataSource[i].key) === String(key)) { index = i; break; }
    }
    if (index === -1) { return; }

    var entry = this.selectedDataSource[index];
    this.selectedDataSource.splice(index, 1);

    if (String(this._activeSelectedKey) === String(key)) { this._activeSelectedKey = null; }

    this._render();

    if (this._legacyOnChange) {
      this._legacyOnChange({
        type: 'change',
        detail: { item: entry.item, from: 'selected', to: null, trigger: 'remove', originItems: this.getOriginItems(), selectedItems: this.getSelectedItems() }
      });
    }

    this._emit('change', {
      item: entry.item, from: 'selected', to: null, trigger: 'remove',
      originItems: this.getOriginItems(), selectedItems: this.getSelectedItems()
    });
  }

  _moveAll(from, to, trigger) {
    if (from === to) return false;

    var source = from === 'origin' ? this.originDataSource : this.selectedDataSource;
    if (!source.length) return false;

    var moved = false;
    var keys = source.map(function (entry) { return entry.key; });
    for (var i = 0; i < keys.length; i++) {
      moved = this._attemptMoveByKey(keys[i], from, to, trigger) || moved;
    }
    return moved;
  }

  _attemptMoveByKey(key, from, to, trigger) {
    if (from === to) return false;

    return this._attemptMove(key, from, to, trigger);
  }

  _attemptMove(itemOrKey, from, to, trigger) {
    var source = from === 'origin' ? this.originDataSource : this.selectedDataSource;
    var entry = this._findEntry(source, itemOrKey);
    if (!entry) return false;

    var evaluation = this._evaluateMove(entry, from, to);
    if (!evaluation.allowed) {
      this._animateReject(entry.key, from);
      this._notifyRequestItem(entry.item, false);

      if (this._legacyOnInvalidTransfer) {
        this._legacyOnInvalidTransfer({
          type: 'invalid-transfer',
          detail: {
            item: entry.item,
            from: from,
            to: to,
            message: evaluation.message,
            originItems: this.getOriginItems(),
            selectedItems: this.getSelectedItems()
          }
        });
      }

      this._emit('request-item', {
        item: entry.item,
        moved: false,
        from: from,
        to: to,
        trigger: trigger,
        message: evaluation.message
      });
      this._emit('invalid-transfer', {
        item: entry.item,
        from: from,
        to: to,
        trigger: trigger,
        message: evaluation.message
      });
      this._clearDropState();
      return false;
    }

    this._commitMove(entry, from, to, trigger);
    return true;
  }

  _commitMove(entry, from, to, trigger) {
    var source = from === 'origin' ? this.originDataSource : this.selectedDataSource;
    var target = to === 'selected' ? this.selectedDataSource : this.originDataSource;
    var index = source.indexOf(entry);

    if (index === -1) return;

    source.splice(index, 1);
    target.push(entry);

    if (from === 'origin') this._activeOriginKey = null;
    if (from === 'selected') this._activeSelectedKey = null;
    if (to === 'origin') this._activeOriginKey = entry.key;
    if (to === 'selected') this._activeSelectedKey = entry.key;

    this._clearDropState();
    this._render();

    this._notifyRequestItem(entry.item, true);

    if (this._legacyOnChange) {
      this._legacyOnChange({
        type: 'change',
        detail: {
          item: entry.item,
          from: from,
          to: to,
          trigger: trigger,
          originItems: this.getOriginItems(),
          selectedItems: this.getSelectedItems()
        }
      });
    }

    this._emit('request-item', {
      item: entry.item,
      moved: true,
      from: from,
      to: to,
      trigger: trigger,
      originItems: this.getOriginItems(),
      selectedItems: this.getSelectedItems()
    });
    this._emit('change', {
      item: entry.item,
      from: from,
      to: to,
      trigger: trigger,
      originItems: this.getOriginItems(),
      selectedItems: this.getSelectedItems()
    });
  }

  _evaluateMove(entry, from, to) {
    if (from === to) {
      return { allowed: false, message: 'Same side move' };
    }

    if (!this.validateUnique || to !== 'selected') {
      return { allowed: true, message: '' };
    }

    var candidateValue = this._resolveValidateValue(entry.item);
    var duplicated = this.selectedDataSource.some(function (selectedEntry) {
      return String(this._resolveValidateValue(selectedEntry.item)) === String(candidateValue);
    }, this);

    if (duplicated) {
      return {
        allowed: false,
        message: this.duplicateMessage || 'Duplicate item'
      };
    }

    return { allowed: true, message: '' };
  }

  _notifyRequestItem(item, moved) {
    if (this._onRequestItem) this._onRequestItem(item, moved);
  }

  _notifySelectionChange(side, key) {
    var source = side === 'origin' ? this.originDataSource : this.selectedDataSource;
    var entry = this._findEntryByKey(source, key);
    if (!entry) return;

    if (this._onSelectionChange) this._onSelectionChange(entry.item, side);
    this._emit('selection-change', {
      item: entry.item,
      side: side,
      originItems: this.getOriginItems(),
      selectedItems: this.getSelectedItems()
    });
  }

  _applyDropState(listEl, evaluation) {
    this._clearDropState();

    if (evaluation.allowed) {
      listEl.classList.add('mts-transferlist__list--over');
      listEl.removeAttribute('data-drop-message');
      listEl.removeAttribute('title');
      return;
    }

    listEl.classList.add('mts-transferlist__list--blocked');
    listEl.setAttribute('data-drop-message', evaluation.message || 'Blocked');
    listEl.setAttribute('title', evaluation.message || 'Blocked');
  }

  _clearDropState() {
    [this._originListEl, this._selectedListEl].forEach(function (listEl) {
      listEl.classList.remove('mts-transferlist__list--over');
      listEl.classList.remove('mts-transferlist__list--blocked');
      listEl.removeAttribute('data-drop-message');
      listEl.removeAttribute('title');
    });
  }

  _animateReject(key, side) {
    var selector = '[data-transfer-side="' + side + '"][data-mts-item-key="' + key + '"]';
    var itemEl = this._root.querySelector(selector);
    if (!itemEl) return;

    itemEl.classList.remove('mts-transferlist__item--reject');
    void itemEl.offsetWidth;
    itemEl.classList.add('mts-transferlist__item--reject');
    setTimeout(function () {
      itemEl.classList.remove('mts-transferlist__item--reject');
    }, 360);
  }

  _normalizeItems(items) {
    var list = Array.isArray(items) ? items : [];
    var self = this;

    return list.map(function (item) {
      var normalizedItem = item;
      if (!normalizedItem || typeof normalizedItem !== 'object' || Array.isArray(normalizedItem)) {
        normalizedItem = { value: item, label: String(item) };
      }

      return {
        key: self._createInternalKey(),
        item: normalizedItem
      };
    });
  }

  _findEntryByKey(list, key) {
    for (var i = 0; i < list.length; i++) {
      if (String(list[i].key) === String(key)) return list[i];
    }
    return null;
  }

  _resolveDisplayValue(item, config) {
    if (config == null) return '';
    if (typeof config === 'function') return config(item);
    return item && item[config] != null ? item[config] : '';
  }

  _resolveValidateValue(item) {
    if (typeof this.validateKey === 'function') return this.validateKey(item);
    if (typeof this.validateKey === 'string' && item && item[this.validateKey] != null) return item[this.validateKey];
    return JSON.stringify(item);
  }

  _applyItemDataset(itemEl, item) {
    Object.entries(item).forEach(function (entry) {
      var key = entry[0];
      var value = entry[1];
      itemEl.setAttribute('data-' + this._toDataAttributeName(key), this._serializeDatasetValue(value));
    }, this);
  }

  _findEntry(list, itemOrKey) {
    var entry = this._findEntryByKey(list, itemOrKey);
    if (entry) return entry;

    for (var i = 0; i < list.length; i++) {
      if (list[i].item === itemOrKey) return list[i];
    }
    return null;
  }

  _serializeDatasetValue(value) {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  _toDataAttributeName(key) {
    return String(key)
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[_\s]+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
  }

  _createInternalKey() {
    var timestamp = Date.now();
    var guid = (window.crypto && typeof window.crypto.randomUUID === 'function')
      ? window.crypto.randomUUID().replace(/-/g, '').slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
    var random = Math.floor(Math.random() * 1000000000);
    return 'mts_itemKey_' + timestamp + '_' + guid + '_' + random;
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(function (fn) { fn({ type: event, detail: detail }); });
    this._el.dispatchEvent(new CustomEvent('mts:transferlist:' + event, { bubbles: true, detail: detail }));
  }

  _escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};
