/* ============================================================
   MATIOS UI - matios-ui-transferlist.js
   MTS.TransferList
   Version: 1.0.0
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
    this.availableTitle = options.availableTitle || 'Disponibles';
    this.selectedTitle = options.selectedTitle || 'Seleccionados';
    this.availableEmptyText = options.availableEmptyText || 'Sin elementos disponibles';
    this.selectedEmptyText = options.selectedEmptyText || 'Sin elementos seleccionados';
    this.availableItems = Array.isArray(options.availableItems || options.options) ? [...(options.availableItems || options.options || [])] : [];
    this.selectedItems = Array.isArray(options.selectedItems || options.value) ? [...(options.selectedItems || options.value || [])] : [];
    this.itemKey = options.itemKey || null;
    this.itemLabel = options.itemLabel || 'label';
    this.itemDescription = options.itemDescription || 'description';
    this.itemMeta = options.itemMeta || null;
    this.renderItem = typeof options.renderItem === 'function' ? options.renderItem : null;
    this.draggable = options.draggable !== false;
    this.disabled = options.disabled === true;
    this.beforeTransfer = typeof options.beforeTransfer === 'function' ? options.beforeTransfer : null;

    this._listeners = {};
    this._activeAvailableKey = null;
    this._activeSelectedKey = null;
    this._dragContext = null;

    if (options.onChange) this.on('change', options.onChange);
    if (options.onInvalidTransfer) this.on('invalid-transfer', options.onInvalidTransfer);

    this._build();
    this._bindEvents();
    this._render();
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
    return this.selectedItems.slice();
  }

  getSelectedItems() {
    return this.selectedItems.slice();
  }

  getAvailableItems() {
    return this.availableItems.slice();
  }

  setItems(payload) {
    this.availableItems = Array.isArray(payload.availableItems) ? payload.availableItems.slice() : [];
    this.selectedItems = Array.isArray(payload.selectedItems) ? payload.selectedItems.slice() : [];
    this._activeAvailableKey = null;
    this._activeSelectedKey = null;
    this._render();
    return this;
  }

  setValue(items) {
    this.selectedItems = Array.isArray(items) ? items.slice() : [];
    this._activeSelectedKey = null;
    this._render();
    return this;
  }

  moveToSelected(key) {
    return this._moveItem(key, 'available', 'selected');
  }

  moveToAvailable(key) {
    return this._moveItem(key, 'selected', 'available');
  }

  moveAllToSelected() {
    return this._moveAll('available', 'selected');
  }

  moveAllToAvailable() {
    return this._moveAll('selected', 'available');
  }

  clear() {
    return this.moveAllToAvailable();
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

    this._root.innerHTML =
      '<div class="mts-transferlist__column">' +
        '<div class="mts-transferlist__header">' +
          '<span class="mts-transferlist__title">' + this._escapeHtml(this.availableTitle) + '</span>' +
          '<span class="mts-transferlist__count" data-transfer-count="available">0</span>' +
        '</div>' +
        '<div class="mts-transferlist__list" data-transfer-list="available"></div>' +
      '</div>' +
      '<div class="mts-transferlist__controls">' +
        '<button type="button" class="mts-transferlist__control" data-transfer-action="all-to-selected" aria-label="Mover todos a seleccionados">&raquo;</button>' +
        '<button type="button" class="mts-transferlist__control" data-transfer-action="to-selected" aria-label="Mover a seleccionados">&rsaquo;</button>' +
        '<button type="button" class="mts-transferlist__control" data-transfer-action="to-available" aria-label="Mover a disponibles">&lsaquo;</button>' +
        '<button type="button" class="mts-transferlist__control" data-transfer-action="all-to-available" aria-label="Mover todos a disponibles">&laquo;</button>' +
      '</div>' +
      '<div class="mts-transferlist__column">' +
        '<div class="mts-transferlist__header">' +
          '<span class="mts-transferlist__title">' + this._escapeHtml(this.selectedTitle) + '</span>' +
          '<span class="mts-transferlist__count" data-transfer-count="selected">0</span>' +
        '</div>' +
        '<div class="mts-transferlist__list" data-transfer-list="selected"></div>' +
      '</div>';

    this._el.appendChild(this._root);

    if (this.hint) {
      var hint = document.createElement('span');
      hint.className = 'mts-form-hint';
      hint.textContent = this.hint;
      this._el.appendChild(hint);
    }

    this._availableListEl = this._root.querySelector('[data-transfer-list="available"]');
    this._selectedListEl = this._root.querySelector('[data-transfer-list="selected"]');
    this._availableCountEl = this._root.querySelector('[data-transfer-count="available"]');
    this._selectedCountEl = this._root.querySelector('[data-transfer-count="selected"]');
  }

  _bindEvents() {
    var self = this;

    this._root.addEventListener('click', function (event) {
      var actionBtn = event.target.closest('[data-transfer-action]');
      if (actionBtn) {
        if (self.disabled) return;
        var action = actionBtn.getAttribute('data-transfer-action');
        if (action === 'to-selected' && self._activeAvailableKey != null) self.moveToSelected(self._activeAvailableKey);
        if (action === 'to-available' && self._activeSelectedKey != null) self.moveToAvailable(self._activeSelectedKey);
        if (action === 'all-to-selected') self.moveAllToSelected();
        if (action === 'all-to-available') self.moveAllToAvailable();
        return;
      }

      var itemEl = event.target.closest('[data-transfer-item-key]');
      if (!itemEl || self.disabled) return;

      var side = itemEl.getAttribute('data-transfer-side');
      var key = itemEl.getAttribute('data-transfer-item-key');
      if (side === 'available') self._activeAvailableKey = key;
      if (side === 'selected') self._activeSelectedKey = key;
      self._render();
    });

    if (!this.draggable) return;

    this._root.addEventListener('dragstart', function (event) {
      var itemEl = event.target.closest('[data-transfer-item-key]');
      if (!itemEl || self.disabled) return;

      self._dragContext = {
        key: itemEl.getAttribute('data-transfer-item-key'),
        from: itemEl.getAttribute('data-transfer-side')
      };

      itemEl.classList.add('mts-transferlist__item--dragging');
      try {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', JSON.stringify(self._dragContext));
      } catch (error) {}
    });

    this._root.addEventListener('dragend', function (event) {
      var itemEl = event.target.closest('[data-transfer-item-key]');
      if (itemEl) itemEl.classList.remove('mts-transferlist__item--dragging');
      self._availableListEl.classList.remove('mts-transferlist__list--over');
      self._selectedListEl.classList.remove('mts-transferlist__list--over');
      self._dragContext = null;
    });

    [this._availableListEl, this._selectedListEl].forEach(function (listEl) {
      listEl.addEventListener('dragover', function (event) {
        if (self.disabled || !self._dragContext) return;
        event.preventDefault();
        listEl.classList.add('mts-transferlist__list--over');
      });

      listEl.addEventListener('dragleave', function () {
        listEl.classList.remove('mts-transferlist__list--over');
      });

      listEl.addEventListener('drop', function (event) {
        if (self.disabled) return;
        event.preventDefault();
        listEl.classList.remove('mts-transferlist__list--over');

        var targetSide = listEl.getAttribute('data-transfer-list');
        var drag = self._dragContext;
        if (!drag || drag.from === targetSide) return;

        self._moveItem(drag.key, drag.from, targetSide);
      });
    });
  }

  _render() {
    this._renderList('available', this.availableItems, this._activeAvailableKey, this._availableListEl, this.availableEmptyText);
    this._renderList('selected', this.selectedItems, this._activeSelectedKey, this._selectedListEl, this.selectedEmptyText);
    this._availableCountEl.textContent = String(this.availableItems.length);
    this._selectedCountEl.textContent = String(this.selectedItems.length);
  }

  _renderList(side, items, activeKey, host, emptyText) {
    host.innerHTML = '';

    if (!items.length) {
      host.innerHTML = '<div class="mts-transferlist__empty">' + this._escapeHtml(emptyText) + '</div>';
      return;
    }

    var self = this;
    items.forEach(function (item) {
      var key = self._getItemKey(item);
      var isActive = String(activeKey) === String(key);
      var itemEl = document.createElement('div');
      itemEl.className = 'mts-transferlist__item' + (isActive ? ' mts-transferlist__item--active' : '');
      itemEl.setAttribute('data-transfer-item-key', key);
      itemEl.setAttribute('data-transfer-side', side);
      if (self.draggable && !self.disabled) itemEl.setAttribute('draggable', 'true');

      if (self.renderItem) {
        itemEl.innerHTML = self.renderItem(item, side, self) || '';
      } else {
        var label = self._getFieldValue(item, self.itemLabel);
        var description = self._getFieldValue(item, self.itemDescription);
        var meta = self._getFieldValue(item, self.itemMeta);

        itemEl.innerHTML =
          '<div class="mts-transferlist__item-main">' +
            '<div class="mts-transferlist__item-label">' + self._escapeHtml(label || '-') + '</div>' +
            (description ? '<div class="mts-transferlist__item-desc">' + self._escapeHtml(description) + '</div>' : '') +
          '</div>' +
          (meta ? '<div class="mts-transferlist__item-meta">' + self._escapeHtml(meta) + '</div>' : '');
      }

      host.appendChild(itemEl);
    });
  }

  _moveItem(key, from, to) {
    if (from === to) return false;

    var source = from === 'available' ? this.availableItems : this.selectedItems;
    var target = to === 'selected' ? this.selectedItems : this.availableItems;
    var item = this._findItemByKey(source, key);
    if (!item) return false;

    var validation = this._validateTransfer(item, from, to);
    if (validation !== true) {
      this._emit('invalid-transfer', {
        item: item,
        from: from,
        to: to,
        message: typeof validation === 'string' ? validation : 'Transferencia no permitida.',
        availableItems: this.getAvailableItems(),
        selectedItems: this.getSelectedItems()
      });
      return false;
    }

    this._removeItemByKey(source, key);
    target.push(item);

    if (from === 'available') this._activeAvailableKey = null;
    if (from === 'selected') this._activeSelectedKey = null;
    if (to === 'available') this._activeAvailableKey = String(key);
    if (to === 'selected') this._activeSelectedKey = String(key);

    this._render();
    this._emit('change', {
      item: item,
      from: from,
      to: to,
      mode: 'single',
      availableItems: this.getAvailableItems(),
      selectedItems: this.getSelectedItems()
    });
    return true;
  }

  _moveAll(from, to) {
    if (from === to) return false;

    var source = from === 'available' ? this.availableItems : this.selectedItems;
    if (!source.length) return false;

    var moved = [];
    var blocked = [];
    var keys = source.map(this._getItemKey.bind(this));

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var currentSource = from === 'available' ? this.availableItems : this.selectedItems;
      var item = this._findItemByKey(currentSource, key);
      if (!item) continue;

      var validation = this._validateTransfer(item, from, to);
      if (validation !== true) {
        blocked.push({
          item: item,
          message: typeof validation === 'string' ? validation : 'Transferencia no permitida.'
        });
        continue;
      }

      this._removeItemByKey(currentSource, key);
      if (to === 'selected') this.selectedItems.push(item);
      else this.availableItems.push(item);
      moved.push(item);
    }

    this._activeAvailableKey = null;
    this._activeSelectedKey = null;
    this._render();

    if (moved.length) {
      this._emit('change', {
        item: null,
        items: moved,
        blocked: blocked,
        from: from,
        to: to,
        mode: 'bulk',
        availableItems: this.getAvailableItems(),
        selectedItems: this.getSelectedItems()
      });
    }

    for (var j = 0; j < blocked.length; j++) {
      this._emit('invalid-transfer', {
        item: blocked[j].item,
        from: from,
        to: to,
        message: blocked[j].message,
        availableItems: this.getAvailableItems(),
        selectedItems: this.getSelectedItems()
      });
    }

    return moved.length > 0;
  }

  _validateTransfer(item, from, to) {
    if (!this.beforeTransfer) return true;
    var result = this.beforeTransfer({
      item: item,
      from: from,
      to: to,
      availableItems: this.getAvailableItems(),
      selectedItems: this.getSelectedItems(),
      instance: this
    });
    if (result === false) return false;
    if (typeof result === 'string') return result;
    return true;
  }

  _getItemKey(item) {
    if (typeof this.itemKey === 'function') return this.itemKey(item);
    if (typeof this.itemKey === 'string' && item && item[this.itemKey] != null) return item[this.itemKey];
    if (item && item.value != null) return item.value;
    if (item && item.id != null) return item.id;
    return this._getFieldValue(item, this.itemLabel);
  }

  _getFieldValue(item, config) {
    if (config == null) return '';
    if (typeof config === 'function') return config(item);
    return item && item[config] != null ? item[config] : '';
  }

  _findItemByKey(list, key) {
    for (var i = 0; i < list.length; i++) {
      if (String(this._getItemKey(list[i])) === String(key)) return list[i];
    }
    return null;
  }

  _removeItemByKey(list, key) {
    for (var i = 0; i < list.length; i++) {
      if (String(this._getItemKey(list[i])) === String(key)) {
        list.splice(i, 1);
        return true;
      }
    }
    return false;
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
