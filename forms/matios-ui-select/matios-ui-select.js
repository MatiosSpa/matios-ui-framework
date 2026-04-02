/* ============================================================
   MATIOS UI — matios-ui-select.js
   MTS.Select — Select con búsqueda, multi-select y grupos
   Eventos DOM: mts:select:change | mts:select:open | mts:select:close
   Version: 2.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Select = class MtsSelect {
  /**
   * @param {string|Element} selector  Contenedor
   * @param {object} options
   * @param {Array}    options.options      [{ value, label, group?, icon?, disabled? }]
   * @param {*}        options.value        Valor(es) inicial(es)
   * @param {string}   options.label
   * @param {string}   options.placeholder
   * @param {string}   options.hint
   * @param {boolean}  options.multiple     Multi-select
   * @param {boolean}  options.searchable   Búsqueda en lista
   * @param {boolean}  options.clearable
   * @param {boolean}  options.disabled
   * @param {number}   options.maxSelect    Límite de selección en multi
   * @param {number}   options.debounce     ms para disparar onSearch — default: 300
   * @param {number}   options.minChars     Mínimo de caracteres para disparar onSearch — default: 1
   * @param {function} options.onSearch     async (query) => [{ value, label, ... }]
   *                                        Si se define, la búsqueda es controlada externamente.
   *                                        El dev decide de dónde vienen los datos.
   * @param {function} options.onChange
   */
  constructor(selector, options = {}) {
    this._container = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._container) { console.error('[MTS.Select] No encontrado:', selector); return; }
    /* ── data-* → inicialización HTML declarativa ── */
    const _ds = this._container?.dataset || {};
    const _fromHTML = {};
    if (_ds.label !== undefined) _fromHTML.label = _ds.label;
    if (_ds.placeholder !== undefined) _fromHTML.placeholder = _ds.placeholder;
    if (_ds.hint !== undefined) _fromHTML.hint = _ds.hint;
    if (_ds.value !== undefined) _fromHTML.value = _ds.value;
    if (_ds.multiple !== undefined) _fromHTML.multiple = true;
    if (_ds.searchable !== undefined) _fromHTML.searchable = true;
    if (_ds.clearable !== undefined) _fromHTML.clearable = true;
    if (_ds.disabled !== undefined) _fromHTML.disabled = true;
    if (_ds.maxSelect !== undefined) _fromHTML.maxSelect = parseInt(_ds.maxSelect);
    options = { ..._fromHTML, ...options };


    this.options     = options.options     || [];
    this.label       = options.label       || '';
    this.placeholder = options.placeholder || 'Selecciona...';
    this.hint        = options.hint        || '';
    this.multiple    = options.multiple    ?? false;
    this.searchable  = options.searchable  ?? false;
    this.clearable   = options.clearable   ?? false;
    this.disabled    = options.disabled    ?? false;
    this.maxSelect   = options.maxSelect   || null;
    this.debounce    = options.debounce    ?? 300;
    this.minChars    = options.minChars    ?? 1;
    this._value      = this.multiple
      ? (Array.isArray(options.value) ? options.value : [])
      : (options.value ?? null);
    this._isOpen     = false;
    this._listeners  = {};
    this._search     = '';
    this._debTimer   = null;
    this._isLoading  = false;
    /* onSearch: si se define, el dev controla de dónde vienen las opciones */
    this._onSearch   = options.onSearch || null;

    if (options.onChange)  this.on('change', options.onChange);
    if (options.onSelect)  this.on('change', options.onSelect);  // alias onSelect
    this._build();
    this._bindEvents();
  }

  /* ── API pública ─────────────────────────────────────────── */

  getValue()       { return this._value; }
  getText()        { return this._getText(); }        // retorna el label del valor seleccionado
  get value()      { return this._value; }            // sel.value — acceso directo
  get text()       { return this._getText(); }         // sel.text — acceso directo
  setValue(v)      { this._value = v; this._updateTrigger(); this._syncHidden(); this._emit('change', { value: v }); return this; }
  clear()          { this._value = this.multiple ? [] : null; this._updateTrigger(); this._syncHidden(); this._emit('change', { value: this._value }); return this; }
  setOptions(opts, enable = false) {
    this.options = opts;
    this._renderOptions();
    if (enable) this.enable();
    return this;
  }

  enable() {
    this.disabled = false;
    this._triggerEl.classList.remove('mts-select__trigger--disabled');
    this._triggerEl.setAttribute('tabindex', '0');
    return this;
  }

  disable() {
    this.disabled = true;
    this._triggerEl.classList.add('mts-select__trigger--disabled');
    this._triggerEl.setAttribute('tabindex', '-1');
    this.close();
    return this;
  }

  open() {
    if (this._isOpen) return this;
    this._isOpen = true;
    this._dropdownEl.classList.add('mts-select__dropdown--open');
    this._triggerEl.setAttribute('aria-expanded', 'true');
    /* Si es async, disparar búsqueda inicial vacía al abrir */
    if (this._onSearch && this._searchEl) {
      this._searchEl.value = '';
      this._search = '';
      if (this.minChars === 0) this._triggerSearch('');
    }
    this._searchEl?.focus();
    this._emit('open', {});
    return this;
  }

  close() {
    if (!this._isOpen) return this;
    this._isOpen = false;
    this._dropdownEl.classList.remove('mts-select__dropdown--open');
    this._triggerEl.setAttribute('aria-expanded', 'false');
    this._emit('close', {});
    return this;
  }

  toggle()  { return this._isOpen ? this.close() : this.open(); }
  on(e, cb) { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb){ this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }
  destroy() { this._container.innerHTML = ''; document.removeEventListener('click', this._outsideClick); }

  /* ── Búsqueda externa (onSearch) ──────────────────────────
     El dev pasa onSearch: async (query) => [...opciones]
     El componente llama a esa función, muestra loading
     y renderiza las opciones que devuelve.
     ─────────────────────────────────────────────────────── */
  async _triggerSearch(query) {
    if (!this._onSearch) return;
    this._setLoading(true);
    try {
      const opts = await this._onSearch(query);
      this._setLoading(false);          // quitar spinner ANTES de renderizar
      if (Array.isArray(opts)) {
        this.options = opts;
        this._renderOptions();
      }
    } catch(e) {
      console.error('[MTS.Select] onSearch error:', e);
      this._setLoading(false);
      this.options = [];
      this._renderOptions();
    }
  }

  _setLoading(v) {
    this._isLoading = v;
    if (v) {
      this._listEl.innerHTML = '';
      const loader = document.createElement('div');
      loader.className = 'mts-select__loading';
      loader.innerHTML = '<span class="mts-select__loading-spinner"></span> Buscando...';
      this._listEl.appendChild(loader);
    }
    /* cuando v=false no tocar innerHTML — _renderOptions lo reemplaza */
  }

  /* ── Build ─────────────────────────────────────────────── */

  _build() {
    /* Si el padre ya es mts-form-group, actuar solo como mts-select */
    const parentIsGroup = this._container.parentElement?.classList.contains('mts-form-group');
    if (parentIsGroup) {
      this._container.className = 'mts-select';
      this._container.innerHTML = '';
      this._buildSelectInner(this._container);
      this._renderOptions();
      this._updateTrigger();
      this._syncHidden();
      return;
    }

    this._container.className = 'mts-form-group';

    if (this.label) {
      const lbl = document.createElement('label');
      lbl.className = 'mts-label';
      lbl.textContent = this.label;
      this._container.appendChild(lbl);
    }

    const wrap = document.createElement('div');
    wrap.className = 'mts-select';
    this._buildSelectInner(wrap);
    this._container.appendChild(wrap);

    if (this.hint) {
      const h = document.createElement('span');
      h.className = 'mts-form-hint';
      h.textContent = this.hint;
      this._container.appendChild(h);
    }

    /* Input oculto para forms */
    this._hiddenInput = document.createElement('input');
    this._hiddenInput.type = 'hidden';
    this._hiddenInput.name = this._container.dataset.name || this._container.id || '';
    this._container.appendChild(this._hiddenInput);

    this._renderOptions();
    this._updateTrigger();
    this._syncHidden();
  }

  _buildSelectInner(wrap) {
    this._triggerEl = document.createElement('div');
    this._triggerEl.className = 'mts-select__trigger' + (this.disabled ? ' mts-select__trigger--disabled' : '');
    this._triggerEl.setAttribute('tabindex', this.disabled ? '-1' : '0');
    this._triggerEl.setAttribute('role', 'combobox');
    this._triggerEl.setAttribute('aria-expanded', 'false');
    this._triggerEl.setAttribute('aria-haspopup', 'listbox');

    this._valueEl = document.createElement('span');
    this._valueEl.className = 'mts-select__value';

    const arrow = document.createElement('span');
    arrow.className = 'mts-select__arrow';
    arrow.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

    this._triggerEl.appendChild(this._valueEl);

    if (this.clearable) {
      this._clearBtn = document.createElement('button');
      this._clearBtn.className = 'mts-select__clear';
      this._clearBtn.innerHTML = '&times;';
      this._clearBtn.setAttribute('aria-label', 'Limpiar');
      this._clearBtn.addEventListener('click', (e) => { e.stopPropagation(); this.clear(); });
      this._triggerEl.appendChild(this._clearBtn);
    }

    this._triggerEl.appendChild(arrow);
    wrap.appendChild(this._triggerEl);

    /* Dropdown */
    this._dropdownEl = document.createElement('div');
    this._dropdownEl.className = 'mts-select__dropdown';
    this._dropdownEl.setAttribute('role', 'listbox');

    if (this.searchable) {
      const searchWrap = document.createElement('div');
      searchWrap.className = 'mts-select__search-wrap';
      this._searchEl = document.createElement('input');
      this._searchEl.type = 'text';
      this._searchEl.className = 'mts-select__search';
      this._searchEl.placeholder = 'Buscar...';
      this._searchEl.addEventListener('input', (e) => {
        this._search = e.target.value;
        if (this._onSearch) {
          clearTimeout(this._debTimer);
          if (this._search.length < this.minChars) {
            if (this.minChars > 0) { this.options = []; this._renderOptions(); }
            return;
          }
          this._debTimer = setTimeout(() => this._triggerSearch(this._search), this.debounce);
        } else {
          this._renderOptions();
        }
      });
      searchWrap.appendChild(this._searchEl);
      this._dropdownEl.appendChild(searchWrap);
    }

    this._listEl = document.createElement('div');
    this._listEl.className = 'mts-select__list';
    this._dropdownEl.appendChild(this._listEl);
    wrap.appendChild(this._dropdownEl);

    /* Input oculto (cuando wrap es el container directo) */
    this._hiddenInput = document.createElement('input');
    this._hiddenInput.type = 'hidden';
    this._hiddenInput.name = this._container.dataset.name || this._container.id || '';
    wrap.appendChild(this._hiddenInput);
  }

  /* ── Render opciones ─────────────────────────────────────── */

  _renderOptions() {
    this._listEl.innerHTML = '';
    const q = this._search.toLowerCase();

    /* Si hay onSearch activo, no filtrar localmente — las opciones ya vienen filtradas */
    const filtered = this._onSearch
      ? this.options
      : this.options.filter(o => !q || o.label.toLowerCase().includes(q));

    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'mts-select__empty';
      empty.textContent = this._onSearch && this._search.length < this.minChars
        ? `Escribe al menos ${this.minChars} caracter${this.minChars > 1 ? 'es' : ''} para buscar`
        : 'Sin resultados';
      this._listEl.appendChild(empty);
      return;
    }

    /* Agrupar */
    const groups = {};
    filtered.forEach(opt => {
      const g = opt.group || '__none__';
      if (!groups[g]) groups[g] = [];
      groups[g].push(opt);
    });

    Object.entries(groups).forEach(([group, opts]) => {
      if (group !== '__none__') {
        const header = document.createElement('div');
        header.className = 'mts-select__group-header';
        header.textContent = group;
        this._listEl.appendChild(header);
      }
      opts.forEach(opt => {
        const item = document.createElement('div');
        item.className = 'mts-select__option'
          + (opt.disabled               ? ' mts-select__option--disabled' : '')
          + (this._isSelected(opt.value)? ' mts-select__option--selected' : '');
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', this._isSelected(opt.value));

        if (opt.icon) {
          const ic = document.createElement('span');
          ic.className = 'mts-select__option-icon';
          ic.innerHTML = opt.icon;
          item.appendChild(ic);
        }

        const lbl = document.createElement('span');
        lbl.textContent = opt.label;
        item.appendChild(lbl);

        if (this._isSelected(opt.value)) {
          const check = document.createElement('span');
          check.className = 'mts-select__check';
          check.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
          item.appendChild(check);
        }

        if (!opt.disabled) item.addEventListener('click', () => this._selectOption(opt));
        this._listEl.appendChild(item);
      });
    });
  }

  _selectOption(opt) {
    if (this.multiple) {
      const idx = this._value.indexOf(opt.value);
      if (idx >= 0) {
        this._value.splice(idx, 1);
      } else if (!this.maxSelect || this._value.length < this.maxSelect) {
        this._value.push(opt.value);
      }
      this._renderOptions();
      this._updateTrigger();
      this._syncHidden();
      const selectedOpts = this.options.filter(o => this._value.includes(o.value));
      this._emit('change', {
        value: [...this._value],
        text:  selectedOpts.map(o => o.label),
        options: selectedOpts,
      });
    } else {
      this._value = opt.value;
      this._updateTrigger();
      this._renderOptions();
      this._syncHidden();
      this._emit('change', { value: this._value, text: opt.label, option: opt });
      this.close();
    }
  }

  _isSelected(val) {
    return this.multiple ? this._value.includes(val) : this._value === val;
  }

  _updateTrigger() {
    if (this.multiple) {
      this._valueEl.innerHTML = '';
      if (!this._value.length) {
        this._valueEl.textContent = this.placeholder;
        this._valueEl.classList.add('mts-select__placeholder');
        if (this._clearBtn) this._clearBtn.style.display = 'none';
      } else {
        this._valueEl.classList.remove('mts-select__placeholder');
        this._value.forEach(v => {
          const opt = this.options.find(o => o.value === v);
          if (!opt) return;
          const tag = document.createElement('span');
          tag.className = 'mts-select__tag';
          tag.textContent = opt.label;
          const rm = document.createElement('button');
          rm.innerHTML = '&times;';
          rm.addEventListener('click', (e) => {
            e.stopPropagation();
            this._value.splice(this._value.indexOf(v), 1);
            this._updateTrigger();
            this._renderOptions();
            this._syncHidden();
            this._emit('change', { value: [...this._value] });
          });
          tag.appendChild(rm);
          this._valueEl.appendChild(tag);
        });
        if (this._clearBtn) this._clearBtn.style.display = 'flex';
      }
    } else {
      const opt = this.options.find(o => o.value === this._value);
      if (opt) {
        this._valueEl.textContent = opt.label;
        this._valueEl.classList.remove('mts-select__placeholder');
        if (this._clearBtn) this._clearBtn.style.display = 'flex';
      } else {
        this._valueEl.textContent = this.placeholder;
        this._valueEl.classList.add('mts-select__placeholder');
        if (this._clearBtn) this._clearBtn.style.display = 'none';
      }
    }
  }

  _bindEvents() {
    this._triggerEl.addEventListener('click', () => { if (!this.disabled) this.toggle(); });
    this._triggerEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(); }
      if (e.key === 'Escape') this.close();
    });
    this._outsideClick = (e) => { if (!this._container.contains(e.target)) this.close(); };
    document.addEventListener('click', this._outsideClick);
  }

  _syncHidden() {
    if (!this._hiddenInput) return;
    const v = this._value;
    this._hiddenInput.value = Array.isArray(v) ? v.join(',') : (v ?? '');
    /* data-value y data-text en el container para acceso sin JS */
    this._container.dataset.value = this._hiddenInput.value;
    this._container.dataset.text  = this._getText();
  }

  _getText() {
    if (this.multiple) {
      return this.options
        .filter(o => this._value.includes(o.value))
        .map(o => o.label)
        .join(', ');
    }
    return this.options.find(o => o.value === this._value)?.label ?? '';
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, target: this, detail }));
    this._container.dispatchEvent(new CustomEvent(`mts:select:${event}`, {
      bubbles: true,
      detail: { select: this, ...detail },
    }));
  }
};
