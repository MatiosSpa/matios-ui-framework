/* ============================================================
   MATIOS UI — MTS.ItemList
   Lista enriquecida: avatar · primary · secondary · controls
   inline · selectable · canRemove · scroll con maxItems.
   Soporta init JS puro, HTML + enganche, o mixto.
   API: new MTS.ItemList(el, options)
   ============================================================ */
(function (global) {
  'use strict';

  /* ── Constructor ─────────────────────────────────────────── */

  function ItemList(el, options) {
    this._el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this._el) { return; }

    options = options || {};

    /* Datasource: JS > DOM */
    let domDs          = this._readDatasourceFromDOM();
    this._datasource   = options.datasource ? options.datasource.slice() : domDs;

    this.row             = options.row             || {};
    this.scroll          = options.scroll          != null ? !!options.scroll          : this._boolAttr('scroll');
    this.maxItems        = options.maxItems        != null ? parseInt(options.maxItems) : this._numAttr('max-items', null);
    this.selectable      = options.selectable      != null ? !!options.selectable      : this._boolAttr('selectable');
    this.canRemove       = options.canRemove       != null ? !!options.canRemove       : this._boolAttr('can-remove');
    this.allowDuplicates = options.allowDuplicates != null ? !!options.allowDuplicates : this._boolAttr('allow-duplicates');
    this.disabledBind    = options.disabledBind    || this._el.getAttribute('data-disabled-bind') || null;
    this.empty           = options.empty           || this._el.getAttribute('data-empty') || null;

    this._onAdd    = typeof options.onAdd    === 'function' ? options.onAdd    : null;
    this._onChange = typeof options.onChange === 'function' ? options.onChange : null;
    this._onRemove = typeof options.onRemove === 'function' ? options.onRemove : null;
    this._onAction = typeof options.onAction === 'function' ? options.onAction : null;
    this._onSelect = typeof options.onSelect === 'function' ? options.onSelect : null;

    this._selectedValue = null;
    this._ul            = null;

    this._build();
    this._el._mtsInstance = this;
  }

  /* ── i18n ────────────────────────────────────────────────── */

  ItemList.prototype._t = function (key, fallback) {
    let loc = (window.MTS && typeof MTS.getString === 'function') ? MTS.getString()['MTS.ItemList'] : null;
    return (loc && loc[key] != null) ? loc[key] : fallback;
  };

  /* ── Helpers de atributo ─────────────────────────────────── */

  ItemList.prototype._boolAttr = function (name) {
    let val = this._el.getAttribute('data-' + name);
    return val === 'true' || val === '';
  };

  ItemList.prototype._numAttr = function (name, fallback) {
    let val = this._el.getAttribute('data-' + name);
    return val != null ? parseInt(val) : fallback;
  };

  /* ── Leer datasource del DOM ─────────────────────────────── */

  ItemList.prototype._readDatasourceFromDOM = function () {
    let items = [];
    if (this._el.tagName !== 'UL') { return items; }

    let lis = this._el.querySelectorAll(':scope > li');
    Array.prototype.forEach.call(lis, function (li) {
      let item = {};
      Array.prototype.forEach.call(li.attributes, function (attr) {
        if (attr.name.indexOf('data-') !== 0) { return; }
        let key = attr.name.slice(5).replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); });
        let val = attr.value;
        if (val !== '' && !isNaN(val)) { val = Number(val); }
        else if (val === 'true')  { val = true; }
        else if (val === 'false') { val = false; }
        item[key] = val;
      });
      if (item.value != null) { items.push(item); }
    });
    return items;
  };

  /* ── Build ───────────────────────────────────────────────── */

  ItemList.prototype._build = function () {
    if (this._el.tagName === 'UL') {
      this._ul = this._el;
      if (this._ul.className.indexOf('mts-itemlist') === -1) {
        this._ul.className = (this._ul.className ? this._ul.className + ' ' : '') + 'mts-itemlist';
      }
    } else {
      this._el.innerHTML = '';
      this._ul = document.createElement('ul');
      this._ul.className = 'mts-itemlist';
      this._el.appendChild(this._ul);
    }
    this._renderItems();
  };

  /* ── Render lista completa ───────────────────────────────── */

  ItemList.prototype._renderItems = function () {
    this._ul.innerHTML = '';

    if (!this._datasource.length) {
      let emptyLi = document.createElement('li');
      emptyLi.className = 'mts-itemlist__empty';
      emptyLi.textContent = this.empty != null ? this.empty : this._t('empty', 'No results.');
      this._ul.appendChild(emptyLi);
      this._ul.classList.remove('mts-itemlist--scroll');
      return;
    }

    let self = this;
    this._datasource.forEach(function (item, index) {
      self._ul.appendChild(self._buildItem(item, index));
    });

    this._applyScroll();
  };

  /* ── Render ítem ─────────────────────────────────────────── */

  ItemList.prototype._buildItem = function (item, index) {
    let self       = this;
    let isDisabled = !!(self.disabledBind && item[self.disabledBind]);

    let li = document.createElement('li');
    li.className = 'mts-itemlist__item';
    if (isDisabled)                              { li.classList.add('mts-itemlist__item--disabled'); }
    if (self.selectable && !isDisabled)          { li.classList.add('mts-itemlist__item--selectable'); }
    if (self.selectable && item.value === self._selectedValue) {
      li.classList.add('mts-itemlist__item--selected');
    }

    /* Reflejar TODOS los campos como data-* */
    Object.keys(item).forEach(function (key) {
      let attr = key.replace(/([A-Z])/g, function (_, c) { return '-' + c.toLowerCase(); });
      li.setAttribute('data-' + attr, item[key] != null ? item[key] : '');
    });

    /* Leading */
    if (self.row.leading) { li.appendChild(self._buildLeading(item)); }

    /* Body */
    let body = document.createElement('div');
    body.className = 'mts-itemlist__body';

    if (self.row.primary) {
      let primary = document.createElement('span');
      primary.className = 'mts-itemlist__primary';
      primary.textContent = item[self.row.primary] != null ? String(item[self.row.primary]) : '';
      body.appendChild(primary);
    }
    if (self.row.secondary) {
      let secondary = document.createElement('span');
      secondary.className = 'mts-itemlist__secondary';
      secondary.textContent = item[self.row.secondary] != null ? String(item[self.row.secondary]) : '';
      body.appendChild(secondary);
    }
    li.appendChild(body);

    /* Controls */
    if (self.row.controls && self.row.controls.length) {
      let ctrlWrap = document.createElement('div');
      ctrlWrap.className = 'mts-itemlist__controls';
      self.row.controls.forEach(function (ctrl) {
        let ctrlEl = self._buildControl(ctrl, item, li);
        if (ctrlEl) { ctrlWrap.appendChild(ctrlEl); }
      });
      li.appendChild(ctrlWrap);
    }

    /* Trailing */
    if (self.row.trailing) { li.appendChild(self._buildTrailing(item)); }

    /* canRemove — × automático */
    if (self.canRemove && !isDisabled) {
      let removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'mts-itemlist__remove';
      removeBtn.setAttribute('aria-label', self._t('remove', 'Remove'));
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        self._doRemove(item, li);
      });
      li.appendChild(removeBtn);
    }

    /* Click selectable */
    if (self.selectable && !isDisabled) {
      li.addEventListener('click', function () {
        self._doSelect(item, li);
      });
    }

    return li;
  };

  /* ── Leading ─────────────────────────────────────────────── */

  ItemList.prototype._buildLeading = function (item) {
    let self    = this;
    let leading = self.row.leading;
    let wrap    = document.createElement('div');
    wrap.className = 'mts-itemlist__leading';

    if (leading.type === 'avatar') {
      let src    = leading.bind ? item[leading.bind] : (leading.value || '');
      let name   = self.row.primary ? (item[self.row.primary] || '') : '';

      if (src) {
        let img = document.createElement('img');
        img.className = 'mts-itemlist__avatar';
        img.src = src;
        img.alt = name;
        img.addEventListener('error', function () {
          img.style.display = 'none';
          wrap.appendChild(_makeInitials(name));
        });
        wrap.appendChild(img);
      } else {
        wrap.appendChild(_makeInitials(name));
      }

    } else if (leading.type === 'initials') {
      let text = leading.bind ? (item[leading.bind] || '') : (leading.value || '');
      wrap.appendChild(_makeInitials(text));

    } else if (leading.type === 'icon') {
      let iconName = leading.bind ? (item[leading.bind] || '') : (leading.value || '');
      wrap.appendChild(_makeIcon(iconName));
    }

    return wrap;
  };

  /* ── Trailing ────────────────────────────────────────────── */

  ItemList.prototype._buildTrailing = function (item) {
    let trailing = this.row.trailing;
    let wrap     = document.createElement('div');
    wrap.className = 'mts-itemlist__trailing';

    if (trailing.type === 'icon') {
      let iconName = trailing.bind ? (item[trailing.bind] || '') : (trailing.value || '');
      wrap.appendChild(_makeIcon(iconName));
    }
    return wrap;
  };

  /* ── Control ─────────────────────────────────────────────── */

  ItemList.prototype._buildControl = function (ctrl, item, li) {
    let self = this;

    /* select */
    if (ctrl.type === 'select') {
      let sel = document.createElement('select');
      sel.className = 'mts-itemlist__ctrl-select';
      if (ctrl.options) {
        ctrl.options.forEach(function (opt) {
          let optEl = document.createElement('option');
          optEl.value = opt.value;
          optEl.textContent = opt.label;
          if (ctrl.bind && item[ctrl.bind] == opt.value) { optEl.selected = true; }
          sel.appendChild(optEl);
        });
      }
      sel.addEventListener('change', function (e) {
        e.stopPropagation();
        let newVal = isNaN(sel.value) ? sel.value : Number(sel.value);
        if (ctrl.bind) {
          item[ctrl.bind] = newVal;
          let attr = ctrl.bind.replace(/([A-Z])/g, function (_, c) { return '-' + c.toLowerCase(); });
          li.setAttribute('data-' + attr, newVal);
        }
        self._emit('change', { item: item, control: ctrl.bind || 'select', value: newVal, el: li });
        if (self._onChange) { self._onChange({ detail: { item: item, control: ctrl.bind || 'select', value: newVal, el: li } }); }
      });
      return sel;
    }

    /* badge — solo se pinta si el item trae valor */
    if (ctrl.type === 'badge') {
      let val = ctrl.bind ? item[ctrl.bind] : null;
      if (!val) { return null; }
      let badge   = document.createElement('span');
      badge.className = 'mts-badge';
      let variant = ctrl.variantBind ? item[ctrl.variantBind] : (ctrl.variant || null);
      if (variant) { badge.classList.add('mts-badge--' + variant); }
      badge.textContent = val;
      return badge;
    }

    /* button */
    if (ctrl.type === 'button') {
      let btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mts-itemlist__ctrl-btn';
      if (ctrl.tooltip) { btn.setAttribute('title', ctrl.tooltip); }
      if (ctrl.icon) {
        let iconWrap = _makeIcon(ctrl.icon);
        iconWrap.className = 'mts-itemlist__ctrl-icon';
        btn.appendChild(iconWrap);
      }
      if (ctrl.label) {
        let lbl = document.createElement('span');
        lbl.textContent = ctrl.label;
        btn.appendChild(lbl);
      }
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        if (ctrl.action === 'remove') {
          self._doRemove(item, li);
        } else {
          self._emit('action', { item: item, action: ctrl.action, el: li });
          if (self._onAction) { self._onAction({ detail: { item: item, action: ctrl.action, el: li } }); }
        }
      });
      return btn;
    }

    return null;
  };

  /* ── Scroll ──────────────────────────────────────────────── */

  ItemList.prototype._applyScroll = function () {
    let ul = this._ul;
    if (!this.scroll) {
      ul.classList.remove('mts-itemlist--scroll');
      ul.style.removeProperty('--mts-il-max-height');
      return;
    }

    let active = this.maxItems == null || this._datasource.length > this.maxItems;
    ul.classList.toggle('mts-itemlist--scroll', active);

    if (active && this.maxItems) {
      let maxN = this.maxItems;
      requestAnimationFrame(function () {
        let first = ul.querySelector('.mts-itemlist__item');
        if (first) {
          ul.style.setProperty('--mts-il-max-height', (first.offsetHeight * maxN) + 'px');
        }
      });
    }
  };

  /* ── Acciones internas ───────────────────────────────────── */

  ItemList.prototype._doRemove = function (item, li) {
    let idx = this._datasource.indexOf(item);
    if (idx === -1) { return; }
    this._datasource.splice(idx, 1);
    if (this._selectedValue === item.value) { this._selectedValue = null; }
    this._emit('remove', { item: item, value: item.value, index: idx, el: li });
    if (this._onRemove) { this._onRemove({ detail: { item: item, value: item.value, index: idx, el: li } }); }
    this._renderItems();
  };

  ItemList.prototype._doSelect = function (item, li) {
    if (this._selectedValue === item.value) {
      this._selectedValue = null;
      li.classList.remove('mts-itemlist__item--selected');
      this._emit('select', { item: null, el: li });
      if (this._onSelect) { this._onSelect({ detail: { item: null, el: li } }); }
    } else {
      let prev = this._ul.querySelector('.mts-itemlist__item--selected');
      if (prev) { prev.classList.remove('mts-itemlist__item--selected'); }
      this._selectedValue = item.value;
      li.classList.add('mts-itemlist__item--selected');
      this._emit('select', { item: item, el: li });
      if (this._onSelect) { this._onSelect({ detail: { item: item, el: li } }); }
    }
  };

  /* ── API pública ─────────────────────────────────────────── */

  ItemList.prototype.addItem = function (item) {
    if (!this.allowDuplicates) {
      for (let i = 0; i < this._datasource.length; i++) {
        if (this._datasource[i].value === item.value) { return this; }
      }
    }
    this._datasource.push(item);
    this._renderItems();
    let newEl = this._ul.querySelector('[data-value="' + item.value + '"]:last-child') || this._ul.lastElementChild;
    this._emit('add', { item: item, index: this._datasource.length - 1, el: newEl });
    if (this._onAdd) { this._onAdd({ detail: { item: item, index: this._datasource.length - 1, el: newEl } }); }
    return this;
  };

  ItemList.prototype.removeItem = function (value) {
    let found = null;
    let idx   = -1;
    for (let i = 0; i < this._datasource.length; i++) {
      if (this._datasource[i].value === value) { found = this._datasource[i]; idx = i; break; }
    }
    if (!found) { return this; }
    this._datasource.splice(idx, 1);
    if (this._selectedValue === value) { this._selectedValue = null; }
    this._emit('remove', { item: found, value: value, index: idx, el: null });
    if (this._onRemove) { this._onRemove({ detail: { item: found, value: value, index: idx, el: null } }); }
    this._renderItems();
    return this;
  };

  ItemList.prototype.updateItem = function (value, patch) {
    let item = this.findItem(value);
    if (!item) { return this; }
    Object.keys(patch).forEach(function (k) { item[k] = patch[k]; });
    this._renderItems();
    return this;
  };

  ItemList.prototype.findItem = function (value) {
    for (let i = 0; i < this._datasource.length; i++) {
      if (this._datasource[i].value === value) { return this._datasource[i]; }
    }
    return null;
  };

  ItemList.prototype.getDatasource = function () {
    return this._datasource.slice();
  };

  ItemList.prototype.setDatasource = function (arr) {
    this._datasource    = arr ? arr.slice() : [];
    this._selectedValue = null;
    this._renderItems();
    return this;
  };

  ItemList.prototype.getSelected = function () {
    if (this._selectedValue == null) { return null; }
    let item = this.findItem(this._selectedValue);
    if (!item) { return null; }
    let el = this._ul.querySelector('[data-value="' + this._selectedValue + '"]');
    return { item: item, el: el };
  };

  ItemList.prototype.clearSelection = function () {
    let prev = this._ul.querySelector('.mts-itemlist__item--selected');
    if (prev) { prev.classList.remove('mts-itemlist__item--selected'); }
    this._selectedValue = null;
    return this;
  };

  ItemList.prototype.destroy = function () {
    if (this._ul) { this._ul.innerHTML = ''; }
    if (this._el !== this._ul) { this._el.innerHTML = ''; }
  };

  /* ── Emit ────────────────────────────────────────────────── */

  ItemList.prototype._emit = function (event, detail) {
    this._el.dispatchEvent(new CustomEvent('mts:itemlist:' + event, { bubbles: true, detail: detail }));
  };

  /* ── Helpers privados ────────────────────────────────────── */

  function _initials(text) {
    if (!text) { return '?'; }
    let parts = String(text).trim().split(/\s+/);
    if (parts.length === 1) { return parts[0].slice(0, 2).toUpperCase(); }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function _makeInitials(text) {
    let span = document.createElement('span');
    span.className = 'mts-itemlist__initials';
    span.textContent = _initials(text);
    return span;
  }

  function _makeIcon(name) {
    let wrap = document.createElement('span');
    wrap.className = 'mts-itemlist__icon';
    /* Fuente única de íconos: MTS.Icon (mismo set que el resto de la UI). Sin
       fallback a un ícono "equivocado": si el nombre no existe, MTS.Icon emite
       su console.warn y el slot queda vacío. SVG estático, sin datos de usuario. */
    wrap.innerHTML = (window.MTS && MTS.Icon && typeof MTS.Icon.get === 'function') ? (MTS.Icon.get(name) || '') : '';
    return wrap;
  }

  /* ── Registro ────────────────────────────────────────────── */

  if (!global.MTS) { global.MTS = {}; }
  global.MTS.ItemList = ItemList;

}(window));
