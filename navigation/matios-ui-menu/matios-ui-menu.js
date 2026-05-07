/* ============================================================
   MATIOS UI — matios-ui-menu.js
   MTS.Menu — Menú de navegación para MTS.Topbar y MTS.SideNav
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Menu = class MtsMenu {

  /**
   * @param {object}   options
   * @param {Array}    options.items      Árbol de items de navegación
   *   { key, label, icon?, badge?, href?, children?[], disabled?, divider? }
   *   Cualquier prop extra que el dev agregue llega intacta al onClick.
   * @param {string}   options.active     Key del item activo inicial
   * @param {string}   options.trigger    'click' (default) | 'hover' — solo modo horizontal
   * @param {function} options.onClick    function(item) — recibe el item completo
   */
  constructor(options) {
    options = options || {};

    this.items    = options.items   || [];
    this.active   = options.active  || null;
    this.trigger  = options.trigger || 'click';
    this._onClick = options.onClick || null;

    // Lista de hosts montados: [{ el, mode }]
    this._mounts    = [];
    // Keys de items de árbol abiertos
    this._openItems = new Set();
    // Handler global para cerrar dropdowns al click fuera
    this._docHandler = null;

    // Auto-detectar activo por href si no se especificó
    if (!this.active) {
      this._autoDetectActive();
    } else {
      // Si el activo está en un sub-árbol, abrir sus ancestros
      this._openAncestors(this.active, this.items);
    }
  }

  /* ════════════════════════════════════════════════════
     API PÚBLICA
     ════════════════════════════════════════════════════ */

  /** Reemplaza el árbol completo y re-renderiza */
  setItems(items) {
    this.items = items;
    this._rebuildAll();
    return this;
  }

  /** Marca un item como activo y re-renderiza.
   *  Si el item está anidado, abre automáticamente todos sus ancestros. */
  setActive(key) {
    this.active = key;
    if (key) this._openAncestors(key, this.items);
    this._rebuildAll();
    return this;
  }

  /** Retorna el key activo */
  getActive() {
    return this.active;
  }

  /** Actualiza el badge de un item */
  setBadge(key, value) {
    var item = this._findItem(key, this.items);
    if (item) { item.badge = value; this._rebuildAll(); }
    return this;
  }

  /** Deshabilita un item */
  disable(key) {
    var item = this._findItem(key, this.items);
    if (item) { item.disabled = true; this._rebuildAll(); }
    return this;
  }

  /** Habilita un item */
  enable(key) {
    var item = this._findItem(key, this.items);
    if (item) { item.disabled = false; this._rebuildAll(); }
    return this;
  }

  /** Desmonta de todos los hosts y limpia */
  destroy() {
    this._mounts.forEach(function(m) { m.el.innerHTML = ''; });
    this._mounts = [];
    this._removeDocHandler();
  }

  /* ════════════════════════════════════════════════════
     INTERNOS — usados por MTS.Topbar y MTS.SideNav
     ════════════════════════════════════════════════════ */

  /**
   * Monta el menú en un elemento con el modo indicado.
   * Llamado internamente por Topbar ('horizontal') y SideNav ('tree').
   * @param {Element} el    Contenedor donde renderizar
   * @param {string}  mode  'horizontal' | 'tree'
   */
  _mount(el, mode) {
    this._mounts.push({ el: el, mode: mode });
    this._render(el, mode);
  }

  /** Desmonta de un host específico */
  _unmount(el) {
    this._mounts = this._mounts.filter(function(m) { return m.el !== el; });
    el.innerHTML = '';
    if (this._mounts.length === 0) this._removeDocHandler();
  }

  /* ════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════ */

  _rebuildAll() {
    var self = this;
    this._removeDocHandler();
    this._mounts.forEach(function(m) { self._render(m.el, m.mode); });
  }

  _render(el, mode) {
    el.innerHTML = '';
    if (mode === 'horizontal') {
      this._renderHorizontal(el);
    } else {
      this._renderTree(el, this.items, 0);
    }
    if (window.MTS && MTS.Icon) MTS.Icon.initAll();
  }

  /* ────────────────────────────────────────
     HORIZONTAL (topbar)
     ──────────────────────────────────────── */

  _renderHorizontal(container) {
    var self = this;
    container.className = 'mts-menu mts-menu--horizontal';

    this.items.forEach(function(item) {
      if (item.divider) {
        var div = document.createElement('span');
        div.className = 'mts-menu__divider';
        container.appendChild(div);
        return;
      }
      container.appendChild(self._buildHorizontalItem(item));
    });

    // Cerrar dropdowns al click fuera
    if (this.trigger === 'click') {
      this._addDocHandler(container);
    }
  }

  _buildHorizontalItem(item) {
    var self = this;
    var hasChildren = !!(item.children && item.children.length);

    var node = document.createElement('div');
    node.className = 'mts-menu__node';

    var btn = this._buildBtn(item, 'mts-menu__item');

    if (hasChildren) {
      this._appendChevron(btn, 'down');
      node.appendChild(btn);

      var dropdown = document.createElement('div');
      dropdown.className = 'mts-menu__dropdown';
      item.children.forEach(function(child) {
        if (child.divider) {
          dropdown.appendChild(self._mkDivider());
          return;
        }
        dropdown.appendChild(self._buildDropdownItem(child));
      });
      node.appendChild(dropdown);

      if (self.trigger === 'hover') {
        node.addEventListener('mouseenter', function() {
          node.classList.add('mts-menu__node--open');
          self._positionDropdown(dropdown, node);
        });
        node.addEventListener('mouseleave', function() { node.classList.remove('mts-menu__node--open'); });
      } else {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var isOpen = node.classList.contains('mts-menu__node--open');
          // Cerrar todos los otros nodos abiertos del mismo nivel
          var menu = node.closest('.mts-menu');
          if (menu) {
            menu.querySelectorAll('.mts-menu__node--open').forEach(function(n) {
              n.classList.remove('mts-menu__node--open');
            });
          }
          if (!isOpen) {
            node.classList.add('mts-menu__node--open');
            self._positionDropdown(dropdown, node);
          }
        });
      }
    } else {
      node.appendChild(btn);
      btn.addEventListener('click', function() { self._handleClick(item); });
    }

    return node;
  }

  _buildDropdownItem(item) {
    var self = this;
    var hasChildren = !!(item.children && item.children.length);

    var node = document.createElement('div');
    node.className = 'mts-menu__node';

    var btn = this._buildBtn(item, 'mts-menu__item mts-menu__item--dd');

    if (hasChildren) {
      this._appendChevron(btn, 'right');
      node.appendChild(btn);

      var sub = document.createElement('div');
      sub.className = 'mts-menu__dropdown mts-menu__dropdown--sub';
      item.children.forEach(function(child) {
        if (child.divider) { sub.appendChild(self._mkDivider()); return; }
        sub.appendChild(self._buildDropdownItem(child));
      });
      node.appendChild(sub);

      if (self.trigger === 'hover') {
        node.addEventListener('mouseenter', function() { node.classList.add('mts-menu__node--open'); });
        node.addEventListener('mouseleave', function() { node.classList.remove('mts-menu__node--open'); });
      } else {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          node.classList.toggle('mts-menu__node--open');
        });
      }
    } else {
      node.appendChild(btn);
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        // Cerrar todo el menú
        var menu = node.closest('.mts-menu');
        if (menu) {
          menu.querySelectorAll('.mts-menu__node--open').forEach(function(n) {
            n.classList.remove('mts-menu__node--open');
          });
        }
        self._handleClick(item);
      });
    }

    return node;
  }

  /* ────────────────────────────────────────
     TREE (sidebar)
     ──────────────────────────────────────── */

  _renderTree(container, items, depth) {
    var self = this;

    if (depth === 0) {
      container.className = 'mts-menu mts-menu--tree';
    }

    items.forEach(function(item) {
      if (item.divider) {
        container.appendChild(self._mkDivider());
        return;
      }

      if (item.group) {
        var grpEl = document.createElement('div');
        grpEl.className = 'mts-menu__group-label';
        grpEl.textContent = item.group;
        container.appendChild(grpEl);
        return;
      }

      var hasChildren = !!(item.children && item.children.length);
      var isOpen      = self._openItems.has(item.key);

      var btn = self._buildBtn(item,
        'mts-menu__item mts-menu__item--tree' +
        (depth > 0 ? ' mts-menu__item--sub' : '')
      );

      if (hasChildren) {
        self._appendChevron(btn, isOpen ? 'up' : 'down');
        btn.addEventListener('click', function() {
          if (self._openItems.has(item.key)) {
            self._openItems.delete(item.key);
          } else {
            self._openItems.add(item.key);
          }
          self._rebuildAll();
        });
      } else {
        btn.addEventListener('click', function() { self._handleClick(item); });
      }

      container.appendChild(btn);

      if (hasChildren && isOpen) {
        var sub = document.createElement('div');
        sub.className = 'mts-menu__sub';
        self._renderTree(sub, item.children, depth + 1);
        container.appendChild(sub);
      }
    });
  }

  /* ════════════════════════════════════════════════════
     HELPERS DE CONSTRUCCIÓN DOM
     ════════════════════════════════════════════════════ */

  _buildBtn(item, extraClass) {
    var isActive  = item.key && item.key === this.active;
    var isDropdown = extraClass.indexOf('mts-menu__item--dd') !== -1;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = extraClass
      + (isActive       ? ' mts-menu__item--active'   : '')
      + (item.disabled  ? ' mts-menu__item--disabled'  : '');
    if (item.disabled) btn.disabled = true;

    if (item.icon) {
      var ico = document.createElement('span');
      ico.className = 'mts-menu__icon';
      var icoI = document.createElement('i');
      icoI.className = 'mts-icon ' + item.icon;
      ico.appendChild(icoI);
      btn.appendChild(ico);
    } else if (isDropdown) {
      // Placeholder para alinear labels aunque no haya ícono
      var ico = document.createElement('span');
      ico.className = 'mts-menu__icon mts-menu__icon--empty';
      btn.appendChild(ico);
    }

    var lbl = document.createElement('span');
    lbl.className = 'mts-menu__label';
    lbl.textContent = item.label;
    btn.appendChild(lbl);

    if (item.badge !== undefined && item.badge !== null) {
      var badge = document.createElement('span');
      badge.className = 'mts-menu__badge';
      badge.textContent = item.badge;
      btn.appendChild(badge);
    }

    return btn;
  }

  _appendChevron(btn, direction) {
    var chv = document.createElement('span');
    chv.className = 'mts-menu__chevron'
      + (direction === 'up'    ? ' mts-menu__chevron--open'  : '')
      + (direction === 'right' ? ' mts-menu__chevron--right' : '');
    chv.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
    btn.appendChild(chv);
  }

  _mkDivider() {
    var div = document.createElement('div');
    div.className = 'mts-menu__divider';
    return div;
  }

  /* ════════════════════════════════════════════════════
     LÓGICA
     ════════════════════════════════════════════════════ */

  _handleClick(item) {
    this.active = item.key;
    this._rebuildAll();
    if (this._onClick) this._onClick(item);
  }

  _findItem(key, items) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].key === key) return items[i];
      if (items[i].children) {
        var found = this._findItem(key, items[i].children);
        if (found) return found;
      }
    }
    return null;
  }

  _autoDetectActive() {
    var path = window.location.pathname;
    var found = this._findByHref(path, this.items);
    if (found) {
      this.active = found.key;
      this._openAncestors(found.key, this.items);
    }
  }

  /** Abre todos los ancestros del item con el key dado (para acordión) */
  _openAncestors(key, items) {
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (!item.children) continue;
      if (this._containsKey(key, item.children)) {
        this._openItems.add(item.key);
        return true;
      }
      if (this._openAncestors(key, item.children)) {
        this._openItems.add(item.key);
        return true;
      }
    }
    return false;
  }

  /** Comprueba si un key existe en el árbol de items */
  _containsKey(key, items) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].key === key) return true;
      if (items[i].children && this._containsKey(key, items[i].children)) return true;
    }
    return false;
  }

  _findByHref(path, items) {
    for (var i = 0; i < items.length; i++) {
      if (items[i].href && path.indexOf(items[i].href) !== -1) return items[i];
      if (items[i].children) {
        var found = this._findByHref(path, items[i].children);
        if (found) return found;
      }
    }
    return null;
  }

  /* ════════════════════════════════════════════════════
     POSICIONAMIENTO — dropdown horizontal (portal fix)
     ════════════════════════════════════════════════════ */

  /**
   * Posiciona el dropdown con coordenadas fixed relativas al anchorEl.
   * Se llama después de agregar --open (dropdown ya visible → getBCR real).
   * Corrige desborde derecho del viewport.
   */
  _positionDropdown(dropEl, anchorEl) {
    var rect = anchorEl.getBoundingClientRect();
    dropEl.style.top  = (rect.bottom + 4) + 'px';
    dropEl.style.left = rect.left + 'px';
    // Corrección de viewport derecho
    var pr = dropEl.getBoundingClientRect();
    if (pr.right > window.innerWidth - 8) {
      dropEl.style.left = (window.innerWidth - pr.width - 8) + 'px';
    }
  }

  /* ════════════════════════════════════════════════════
     HANDLER GLOBAL (cerrar dropdowns al click fuera)
     ════════════════════════════════════════════════════ */

  _addDocHandler(container) {
    var self = this;
    this._removeDocHandler();
    this._docHandler = function() {
      container.querySelectorAll('.mts-menu__node--open').forEach(function(n) {
        n.classList.remove('mts-menu__node--open');
      });
    };
    document.addEventListener('click', this._docHandler);
  }

  _removeDocHandler() {
    if (this._docHandler) {
      document.removeEventListener('click', this._docHandler);
      this._docHandler = null;
    }
  }
};
