/* ============================================================
   MATIOS UI — matios-ui-select.js
   MTS.Select — Select with search, multi-select and groups
   Version: 2.1.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Select = class MtsSelect {
  constructor(selector, options = {}) {
    // Target container element / Elemento contenedor
    this._container = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!this._container) { console.error('[MTS.Select] Not found / No encontrado:', selector); return; }

    // Read data-* attributes for declarative HTML initialization
    // Lee atributos data-* para inicialización HTML declarativa
    const _ds = this._container?.dataset || {};
    const _fromHTML = {};
    if (_ds.label       !== undefined) _fromHTML.label       = _ds.label;
    if (_ds.placeholder !== undefined) _fromHTML.placeholder = _ds.placeholder;
    if (_ds.hint        !== undefined) _fromHTML.hint        = _ds.hint;
    if (_ds.value       !== undefined) _fromHTML.value       = _ds.value;
    if (_ds.multiple    !== undefined) _fromHTML.multiple    = true;
    if (_ds.searchable  !== undefined) _fromHTML.searchable  = true;
    if (_ds.clearable   !== undefined) _fromHTML.clearable   = true;
    if (_ds.disabled    !== undefined) _fromHTML.disabled    = true;
    if (_ds.required    !== undefined) _fromHTML.required    = true;
    if (_ds.errorMessage !== undefined) _fromHTML.errorMessage = _ds.errorMessage;
    if (_ds.maxSelect   !== undefined) _fromHTML.maxSelect   = parseInt(_ds.maxSelect);
    options = { ..._fromHTML, ...options };

    // Options list: [{ value, label, group?, icon?, disabled? }]
    // Lista de opciones
    this.options = options.options || [];

    // Field label / Etiqueta del campo
    this.label = options.label || '';

    // Placeholder text / Texto placeholder
    this.placeholder = options.placeholder || 'Selecciona...';

    // Helper text / Texto de ayuda
    this.hint = options.hint || '';

    // Allow multiple selection / Permitir selección múltiple
    this.multiple = options.multiple ?? false;

    // Enable search inside the list / Habilitar búsqueda en la lista
    this.searchable = options.searchable ?? false;

    // Show clear button / Mostrar botón limpiar
    this.clearable = options.clearable ?? false;

    // Disables all interaction / Deshabilita toda interacción
    this.disabled = options.disabled ?? false;

    // Form-field contract: required + overridable error message
    this.required     = options.required     ?? false;
    this.errorMessage = options.errorMessage ?? null;
    this._error       = '';

    // Maximum number of selections in multi mode / Máximo de selecciones en modo multi
    this.maxSelect = options.maxSelect || null;

    // Debounce delay for onSearch in ms / Delay debounce para onSearch en ms
    this.debounce = options.debounce ?? 300;

    // Minimum characters to trigger onSearch / Mínimo de caracteres para disparar onSearch
    this.minChars = options.minChars ?? 1;

    this._value = this.multiple
      ? (Array.isArray(options.value) ? options.value : [])
      : (options.value ?? null);

    this._isOpen    = false;
    this._listeners = {};
    this._search    = '';
    this._debTimer  = null;
    this._isLoading = false;

    // External search handler: async (query) => [{ value, label, ... }]
    // Manejador de búsqueda externa: async (query) => [{ value, label, ... }]
    // Async search function: (query) => items[] | Promise<items[]>
    // Función de búsqueda async — proveedor de datos, no un evento
    this._onSearch = options.onSearch || null;
    this.renderMode = options.renderMode || 'auto';

    // Fires when selection changes / Se dispara al cambiar la selección
    if (options.onChange) this.on('change', options.onChange);
    // onSelect is an alias for onChange / onSelect es un alias de onChange
    if (options.onSelect) this.on('change', options.onSelect);

    // Auto-clear a standing validation error whenever the value changes
    var self = this;
    this.on('change', function () { if (self._error) self.clearError(); });

    this._build();
    this._bindEvents();
    this._container._mtsInstance = this;
  }

  /* ── Public API / API pública ────────────────────────────── */

  // Returns current value / Retorna el valor actual
  getValue() { return this._value; }

  // Returns selected option label / Retorna el label de la opción seleccionada
  getText()  { return this._getText(); }

  // Returns the current option list (shallow copy) / Retorna la lista de opciones actual (copia superficial)
  getOptions() { return this.options.slice(); }

  // ── Form-field validation contract ──
  setError(msg) {
    this._error = msg || '';
    if (this._errEl) { this._errEl.textContent = this._error; this._errEl.style.display = this._error ? '' : 'none'; }
    if (this._triggerEl) this._triggerEl.classList.toggle('mts-select__trigger--error', !!this._error);
    return this;
  }
  clearError() { return this.setError(''); }
  validate() {
    const empty = this.multiple
      ? (!Array.isArray(this._value) || this._value.length === 0)
      : (this._value == null || this._value === '');
    const ok = !this.required || !empty;
    if (ok) this.clearError(); else this.setError(this.errorMessage || this._t('required', 'This field is required'));
    this._emit('validate', { valid: ok, errors: ok ? [] : [this._error] });
    return ok;
  }
  _t(key, fallback) {
    try { const ns = (window.MTS && MTS.getLocale) ? MTS.getLocale()['MTS.Select'] : null; const m = ns && ns.messages; if (m && m[key] != null) return m[key]; } catch (e) {}
    return fallback;
  }

  get value() { return this._value; }
  get text()  { return this._getText(); }

  // Sets value programmatically / Establece el valor programáticamente
  setValue(v) {
    this._value = v;
    this._updateTrigger();
    this._syncHidden();
    this._emit('change', { value: v });
    return this;
  }

  // Clears selection / Limpia la selección
  clear() {
    this._value = this.multiple ? [] : null;
    this._updateTrigger();
    this._syncHidden();
    this._emit('change', { value: this._value });
    return this;
  }

  // Replaces option list and optionally enables the select
  // Reemplaza la lista de opciones y opcionalmente habilita el select
  setOptions(opts, enable = false) {
    this.options = opts;
    this._renderOptions();
    if (enable) this.enable();
    return this;
  }

  // Enable / disable interaction / Habilitar / deshabilitar interacción
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

  // Open the dropdown / Abrir el dropdown
  open() {
    if (this._isOpen) return this;
    this._isOpen = true;
    this._positionDropdown();
    this._dropdownEl.classList.add('mts-select__dropdown--open');
    this._triggerEl.setAttribute('aria-expanded', 'true');
    if (this._onSearch && this._searchEl) {
      this._searchEl.value = '';
      this._search = '';
      if (this.minChars === 0) this._triggerSearch('');
    }
    this._searchEl?.focus();
    this._emit('open', {});
    return this;
  }

  // Close the dropdown / Cerrar el dropdown
  close() {
    if (!this._isOpen) return this;
    this._isOpen = false;
    this._dropdownEl.classList.remove('mts-select__dropdown--open');
    this._triggerEl.setAttribute('aria-expanded', 'false');
    this._emit('close', {});
    return this;
  }

  toggle() { return this._isOpen ? this.close() : this.open(); }

  // Register / remove event listeners / Registrar / remover listeners
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }

  // Destroy and clean up / Destruir y limpiar
  destroy() {
    this._dropdownEl?.remove();
    this._container.innerHTML = '';
    document.removeEventListener('click', this._outsideClick);
    window.removeEventListener('scroll', this._onScroll, true);
    window.removeEventListener('resize', this._onResize);
  }

  /* ── External search / Búsqueda externa ─────────────────── */

  // Called when onSearch is defined — dev controls data source
  // Se llama cuando onSearch está definido — el dev controla la fuente de datos
  async _triggerSearch(query) {
    if (!this._onSearch) return;
    this._setLoading(true);
    try {
      const opts = await this._onSearch(query);
      this._setLoading(false);
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
  }

  /* ── Build / Construcción ───────────────────────────────── */

  _build() {
    const explicitFieldOnly = this.renderMode === 'field-only';
    const explicitStandalone = this.renderMode === 'standalone';
    const parentIsGroup = this._container.parentElement?.classList.contains('mts-form-group');
    const fieldOnly = explicitFieldOnly || (!explicitStandalone && parentIsGroup);

    this._container.innerHTML = '';

    if (fieldOnly) {
      this._container.classList.add('mts-select');
      this._buildSelectInner(this._container);
      this._renderOptions();
      this._updateTrigger();
      this._syncHidden();
      return;
    }

    if (this.label) {
      const lbl = document.createElement('label');
      lbl.className   = 'mts-label';
      lbl.textContent = this.label;
      this._container.appendChild(lbl);
    }

    const wrap = document.createElement('div');
    wrap.className = 'mts-select';
    this._buildSelectInner(wrap);
    this._container.appendChild(wrap);

    if (this.hint) {
      const h = document.createElement('span');
      h.className   = 'mts-form-hint';
      h.textContent = this.hint;
      this._container.appendChild(h);
    }

    this._errEl = document.createElement('span');
    this._errEl.className   = 'mts-form-error';
    this._errEl.style.display = this._error ? '' : 'none';
    this._errEl.textContent = this._error || '';
    this._container.appendChild(this._errEl);

    this._hiddenInput      = document.createElement('input');
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
    this._triggerEl.setAttribute('tabindex',     this.disabled ? '-1' : '0');
    this._triggerEl.setAttribute('role',         'combobox');
    this._triggerEl.setAttribute('aria-expanded','false');
    this._triggerEl.setAttribute('aria-haspopup','listbox');

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

    // Dropdown portal — appended to body to escape stacking contexts
    // Portal del dropdown — se agrega al body para escapar contextos de apilamiento
    this._dropdownEl = document.createElement('div');
    this._dropdownEl.className = 'mts-select__dropdown';
    this._dropdownEl.setAttribute('role', 'listbox');

    if (this.searchable) {
      const searchWrap = document.createElement('div');
      searchWrap.className = 'mts-select__search-wrap';
      this._searchEl = document.createElement('input');
      this._searchEl.type        = 'text';
      this._searchEl.className   = 'mts-select__search';
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
    document.body.appendChild(this._dropdownEl);

    this._hiddenInput      = document.createElement('input');
    this._hiddenInput.type = 'hidden';
    this._hiddenInput.name = this._container.dataset.name || this._container.id || '';
    wrap.appendChild(this._hiddenInput);
  }

  /* ── Render options / Renderizar opciones ───────────────── */

  _renderOptions() {
    this._listEl.innerHTML = '';
    const q = this._search.toLowerCase();

    // If onSearch is active, options come pre-filtered from the dev
    // Si onSearch está activo, las opciones vienen pre-filtradas del dev
    const filtered = this._onSearch
      ? this.options
      : this.options.filter(o => !q || o.label.toLowerCase().includes(q));

    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className   = 'mts-select__empty';
      empty.textContent = this._onSearch && this._search.length < this.minChars
        ? `Escribe al menos ${this.minChars} caracter${this.minChars > 1 ? 'es' : ''} para buscar`
        : 'Sin resultados';
      this._listEl.appendChild(empty);
      return;
    }

    // Group options by their group property / Agrupar opciones por su propiedad group
    const groups = {};
    filtered.forEach(opt => {
      const g = opt.group || '__none__';
      if (!groups[g]) groups[g] = [];
      groups[g].push(opt);
    });

    Object.entries(groups).forEach(([group, opts]) => {
      if (group !== '__none__') {
        const header = document.createElement('div');
        header.className   = 'mts-select__group-header';
        header.textContent = group;
        this._listEl.appendChild(header);
      }
      opts.forEach(opt => {
        const item = document.createElement('div');
        item.className = 'mts-select__option'
          + (opt.disabled                ? ' mts-select__option--disabled' : '')
          + (this._isSelected(opt.value) ? ' mts-select__option--selected' : '');
        item.setAttribute('role',          'option');
        item.setAttribute('aria-selected', this._isSelected(opt.value));

        if (opt.icon) {
          const ic = document.createElement('span');
          ic.className = 'mts-select__option-icon';
          ic.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(opt.icon) : opt.icon;
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
      this._emit('change', { value: [...this._value], text: selectedOpts.map(o => o.label), options: selectedOpts });
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
          tag.className   = 'mts-select__tag';
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

  _positionDropdown() {
    const rect = this._triggerEl.getBoundingClientRect();
    const drop = this._dropdownEl;
    drop.style.position = 'fixed';
    drop.style.zIndex   = '9999';
    drop.style.width    = rect.width + 'px';
    drop.style.left     = rect.left  + 'px';
    const gap        = 2;
    const edge       = 8;   // keep the dropdown off the viewport edge
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropH      = drop.offsetHeight || 240;

    // Open below if it fits whole, or if there is more room below than above; otherwise flip up.
    const openBelow = (spaceBelow >= dropH) || (spaceBelow >= spaceAbove);
    if (openBelow) {
      drop.style.top    = (rect.bottom + gap) + 'px';
      drop.style.bottom = 'auto';
    } else {
      drop.style.bottom = (window.innerHeight - rect.top + gap) + 'px';
      drop.style.top    = 'auto';
    }

    // Cap the scrollable list to the available space so the dropdown never spills past
    // the viewport; the list (overflow-y:auto) scrolls when the options don't fit.
    if (this._listEl) {
      const avail   = (openBelow ? spaceBelow : spaceAbove) - gap - edge;
      const searchH = (this._searchEl && this._searchEl.parentElement && this._searchEl.parentElement.offsetHeight)
        || (this._searchEl ? 44 : 0); // measured when visible; approx on first open (still hidden)
      this._listEl.style.maxHeight = Math.max(80, Math.min(260, avail - searchH)) + 'px';
    }
  }

  _bindEvents() {
    this._triggerEl.addEventListener('click', () => { if (!this.disabled) this.toggle(); });
    this._triggerEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(); }
      if (e.key === 'Escape') this.close();
    });

    // Close when clicking outside / Cerrar al hacer click fuera
    this._outsideClick = (e) => {
      if (!this._container.contains(e.target) && !this._dropdownEl.contains(e.target)) {
        this.close();
      }
    };
    document.addEventListener('click', this._outsideClick);

    // Reposition on scroll/resize / Reposicionar en scroll/resize
    this._onScroll = () => { if (this._isOpen) this._positionDropdown(); };
    this._onResize = () => { if (this._isOpen) this._positionDropdown(); };
    window.addEventListener('scroll', this._onScroll, true);
    window.addEventListener('resize', this._onResize);
  }

  _syncHidden() {
    if (!this._hiddenInput) return;
    const v = this._value;
    this._hiddenInput.value      = Array.isArray(v) ? v.join(',') : (v ?? '');
    this._container.dataset.value = this._hiddenInput.value;
    this._container.dataset.text  = this._getText();
  }

  _getText() {
    if (this.multiple) {
      return this.options.filter(o => this._value.includes(o.value)).map(o => o.label).join(', ');
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
