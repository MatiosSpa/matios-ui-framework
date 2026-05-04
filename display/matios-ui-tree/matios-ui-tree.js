/* ============================================================
   MATIOS UI — matios-ui-tree.js
   MTS.Tree — Árbol colapsable de jerarquías
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.Tree = class MtsTree {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {Array}    options.nodes       Árbol de nodos — ver estructura
   * @param {boolean}  options.expandAll   Expandir todo al inicio — default: false
   * @param {boolean}  options.selectable  Permite seleccionar nodos — default: false
   * @param {boolean}  options.checkable   Muestra checkboxes — default: false
   * @param {boolean}  options.showIcons   Muestra íconos folder/file — default: true
   * @param {boolean}  options.showLines   Muestra líneas de conexión — default: true
   * @param {function} options.onSelect    ({ node, path }) => {}
   * @param {function} options.onToggle    ({ node, expanded }) => {}
   * @param {function} options.onCheck     ({ node, checked, checkedIds }) => {}
   *
   * Estructura de nodo:
   * { id, label, icon?, children?[], expanded?, selected?, checked?, disabled?, badge? }
   */
  constructor(selector, options = {}) {
    this._el         = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    this.nodes       = this._cloneNodes(options.nodes || []);
    this.expandAll   = options.expandAll   ?? false;
    this.selectable  = options.selectable  ?? false;
    this.checkable   = options.checkable   ?? false;
    this.showIcons   = options.showIcons   ?? true;
    this.showLines   = options.showLines   ?? true;
    this._selected  = null;
    this._listeners = {};

    // Fires when a node is selected: ({ node, path }) => {}
    // Se dispara al seleccionar un nodo
    if (options.onSelect) this.on('select', options.onSelect);

    // Fires when a node expands/collapses: ({ node, expanded }) => {}
    // Se dispara al expandir o colapsar un nodo
    if (options.onToggle) this.on('toggle', options.onToggle);

    // Fires when a checkbox changes: ({ node, checked, checkedIds }) => {}
    // Se dispara al cambiar un checkbox
    if (options.onCheck)  this.on('check',  options.onCheck);

    if (this.expandAll) this._expandAllNodes(this.nodes);
    this._build();
  }

  /* ── API ── */
  expand(id)        { const n=this._findNode(id); if(n){n.expanded=true; this._build();} return this; }
  collapse(id)      { const n=this._findNode(id); if(n){n.expanded=false;this._build();} return this; }
  expandAll2()      { this._expandAllNodes(this.nodes); this._build(); return this; }
  collapseAll()     { this._collapseAllNodes(this.nodes); this._build(); return this; }
  select(id)        { this._selectNode(id); return this; }
  check(id, val)    { const n=this._findNode(id); if(n){n.checked=val??true; this._build();} return this; }
  getChecked()      { return this._getCheckedIds(this.nodes); }
  getSelected()     { return this._selected; }
  setNodes(nodes)   { this.nodes=this._cloneNodes(nodes); if(this.expandAll)this._expandAllNodes(this.nodes); this._build(); return this; }
  on(e,cb)          { if(!this._listeners[e])this._listeners[e]=[]; this._listeners[e].push(cb); return this; }
  destroy()         { this._el.innerHTML=''; }

  _build() {
    this._el.innerHTML = '';
    this._syncClasses(['mts-tree'].concat(this.showLines ? ['mts-tree--lines'] : []));
    const ul = this._buildLevel(this.nodes, 0);
    this._el.appendChild(ul);
  }

  _buildLevel(nodes, depth) {
    const ul = document.createElement('ul');
    ul.className = 'mts-tree__list';
    nodes.forEach((node, idx) => {
      const isLast = idx === nodes.length - 1;
      ul.appendChild(this._buildNode(node, depth, isLast));
    });
    return ul;
  }

  _buildNode(node, depth, isLast) {
    const li = document.createElement('li');
    li.className = 'mts-tree__item' + (isLast ? ' mts-tree__item--last' : '');

    const row = document.createElement('div');
    row.className = 'mts-tree__row'
      + (node.selected ? ' mts-tree__row--selected' : '')
      + (node.disabled ? ' mts-tree__row--disabled' : '');
    row.style.paddingLeft = (depth * 20) + 'px';

    const hasChildren = node.children && node.children.length > 0;

    /* Toggle arrow */
    const toggle = document.createElement('span');
    toggle.className = 'mts-tree__toggle';
    if (hasChildren) {
      toggle.innerHTML = node.expanded
        ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>'
        : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 6l6 6-6 6"/></svg>';
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (node.disabled) return;
        node.expanded = !node.expanded;
        this._build();
        this._emit('toggle', { node, expanded: node.expanded });
      });
    }
    row.appendChild(toggle);

    /* Checkbox */
    if (this.checkable) {
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'mts-tree__checkbox';
      cb.checked = !!node.checked;
      cb.disabled = !!node.disabled;
      cb.addEventListener('click', (e) => e.stopPropagation());
      cb.addEventListener('change', () => {
        node.checked = cb.checked;
        if (node.children) this._setChildrenChecked(node.children, cb.checked);
        this._build();
        const ids = this.getChecked();
        this._emit('check', { node, checked: cb.checked, checkedIds: ids });
      });
      row.appendChild(cb);
    }

    /* Ícono */
    if (this.showIcons) {
      const ico = document.createElement('span');
      ico.className = 'mts-tree__icon';
      if (node.icon) {
        ico.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(node.icon) : node.icon;
      } else if (hasChildren) {
        ico.innerHTML = node.expanded
          ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>'
          : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>';
      } else {
        ico.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>';
      }
      row.appendChild(ico);
    }

    /* Label */
    const label = document.createElement('span');
    label.className = 'mts-tree__label';
    label.textContent = node.label;
    row.appendChild(label);

    /* Badge */
    if (node.badge !== undefined && node.badge !== null) {
      const badge = document.createElement('span');
      badge.className = 'mts-badge mts-badge--default mts-badge--xs';
      badge.textContent = node.badge;
      row.appendChild(badge);
    }

    /* Click para seleccionar */
    if (this.selectable && !node.disabled) {
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        this._selectNode(node.id);
        const path = this._getPath(node.id, this.nodes, []);
        this._emit('select', { node, path });
      });
    }

    li.appendChild(row);

    /* Hijos */
    if (hasChildren && node.expanded) {
      li.appendChild(this._buildLevel(node.children, depth + 1));
    }

    return li;
  }

  _selectNode(id) {
    this._clearSelected(this.nodes);
    const n = this._findNode(id);
    if (n) { n.selected = true; this._selected = n; }
    this._build();
  }

  /* ── Utils ── */
  _cloneNodes(nodes) {
    return nodes.map(n => ({ ...n, children: n.children ? this._cloneNodes(n.children) : undefined }));
  }
  _findNode(id, nodes) {
    nodes = nodes || this.nodes;
    for (const n of nodes) {
      if (n.id === id) return n;
      if (n.children) { const f = this._findNode(id, n.children); if (f) return f; }
    }
    return null;
  }
  _expandAllNodes(nodes)   { nodes.forEach(n => { n.expanded=true;  if(n.children)this._expandAllNodes(n.children); }); }
  _collapseAllNodes(nodes) { nodes.forEach(n => { n.expanded=false; if(n.children)this._collapseAllNodes(n.children); }); }
  _clearSelected(nodes)    { nodes.forEach(n => { n.selected=false; if(n.children)this._clearSelected(n.children); }); }
  _setChildrenChecked(nodes, val) { nodes.forEach(n => { n.checked=val; if(n.children)this._setChildrenChecked(n.children,val); }); }
  _getCheckedIds(nodes) {
    let ids = [];
    nodes.forEach(n => { if(n.checked)ids.push(n.id); if(n.children)ids=ids.concat(this._getCheckedIds(n.children)); });
    return ids;
  }
  _getPath(id, nodes, path) {
    for (const n of nodes) {
      const curr = [...path, n];
      if (n.id === id) return curr;
      if (n.children) { const f = this._getPath(id, n.children, curr); if(f) return f; }
    }
    return null;
  }

  _syncClasses(classes) {
    const previousMatiosClasses = [...this._el.classList].filter(cls =>
      cls === 'mts-tree' || cls.startsWith('mts-tree--')
    );
    if (previousMatiosClasses.length) this._el.classList.remove(...previousMatiosClasses);
    this._el.classList.add(...classes.filter(Boolean));
  }

  _emit(event, detail) {
    (this._listeners[event]||[]).forEach(fn=>fn({type:event,detail}));
    this._el.dispatchEvent(new CustomEvent('mts:tree:'+event, {bubbles:true,detail}));
  }
};
