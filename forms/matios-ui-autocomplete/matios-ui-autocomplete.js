/* ============================================================
   MATIOS UI — MTS.Autocomplete
   Se cuelga de un <input> existente. Dropdown async o estático,
   value separado del text, teclas, X para limpiar.
   API: new MTS.Autocomplete(inputEl, options)
   ============================================================ */
(function (global) {
  'use strict';

  /* ── Constructor ─────────────────────────────────────────── */

  function Autocomplete(el, options) {
    this._input = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this._input || this._input.tagName !== 'INPUT') { return; }

    options = options || {};

    this._valueField = options.valueField || 'value';
    this._textField  = options.textField  || 'text';
    this._minChars   = options.minChars  != null ? parseInt(options.minChars) : 1;
    this._debounceMs = options.debounce  != null ? parseInt(options.debounce)  : 300;
    this._empty      = options.empty != null ? options.empty : this._t('empty', 'No results.');
    this._datasource = options.datasource != null ? options.datasource : null;

    this._onSelect = typeof options.onSelect === 'function' ? options.onSelect : null;
    this._onChange = typeof options.onChange === 'function' ? options.onChange : null;
    this._onClear  = typeof options.onClear  === 'function' ? options.onClear  : null;

    this._selectedItem = null;
    this._timer        = null;
    this._dropdown     = null;
    this._clearBtn     = null;
    this._wrap         = null;
    this._activeIndex  = -1;
    this._results      = [];
    /* Form-field contract */
    this._required     = options.required === true;
    this._errorMessage = options.errorMessage != null ? options.errorMessage : null;
    this._error        = '';

    this._build();
    this._bindEvents();
    this._input._mtsInstance = this;
  }

  /* ── Build ───────────────────────────────────────────────── */

  Autocomplete.prototype._build = function () {
    /* Envuelve el input en .mts-ac__wrap */
    let wrap = document.createElement('div');
    wrap.className = 'mts-ac__wrap';
    this._input.parentNode.insertBefore(wrap, this._input);
    wrap.appendChild(this._input);
    this._wrap = wrap;

    /* Form-field error slot — below the field */
    let errEl = document.createElement('span');
    errEl.className = 'mts-form-error';
    errEl.style.display = 'none';
    wrap.insertAdjacentElement('afterend', errEl);
    this._errEl = errEl;

    /* Botón × */
    let clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'mts-ac__clear';
    clearBtn.setAttribute('aria-label', this._t('clear', 'Clear'));
    clearBtn.textContent = '×';
    clearBtn.style.display = 'none';
    wrap.appendChild(clearBtn);
    this._clearBtn = clearBtn;

    /* Dropdown — portal en body */
    let dropdown = document.createElement('ul');
    dropdown.className = 'mts-ac__dropdown';
    dropdown.style.display = 'none';
    document.body.appendChild(dropdown);
    this._dropdown = dropdown;
  };

  /* ── Eventos ─────────────────────────────────────────────── */

  Autocomplete.prototype._bindEvents = function () {
    let self = this;

    /* Input */
    this._input.addEventListener('input', function () {
      if (self._error) { self.clearError(); }   // auto-clear while editing
      let val = self._input.value;
      self._clearBtn.style.display = val ? '' : 'none';

      /* Si el usuario edita después de seleccionar → resetea value */
      if (self._selectedItem && val !== self._selectedItem[self._textField]) {
        self._selectedItem = null;
        self._input.removeAttribute('data-mts-value');
        if (self._onChange) { self._onChange(null); }
      }

      clearTimeout(self._timer);
      if (val.length < self._minChars) { self._closeDropdown(); return; }
      self._timer = setTimeout(function () { self._query(val); }, self._debounceMs);
    });

    /* Teclado */
    this._input.addEventListener('keydown', function (e) {
      if (!self._isOpen()) { return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); self._moveActive(1);  return; }
      if (e.key === 'ArrowUp')   { e.preventDefault(); self._moveActive(-1); return; }
      if (e.key === 'Escape')    { self._closeDropdown(); return; }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (self._activeIndex >= 0 && self._results[self._activeIndex]) {
          self._selectItem(self._results[self._activeIndex]);
        }
      }
    });

    /* Botón X */
    this._clearBtn.addEventListener('click', function () {
      self.clear();
      self._input.focus();
    });

    /* Click fuera → cierra */
    this._outsideHandler = function (e) {
      if (!self._wrap.contains(e.target) && !self._dropdown.contains(e.target)) {
        self._closeDropdown();
      }
    };
    document.addEventListener('mousedown', this._outsideHandler);

    /* Reposicionar en scroll / resize */
    this._repositionHandler = function () {
      if (self._isOpen()) { self._positionDropdown(); }
    };
    window.addEventListener('scroll',  this._repositionHandler, true);
    window.addEventListener('resize',  this._repositionHandler);
  };

  /* ── Query ───────────────────────────────────────────────── */

  Autocomplete.prototype._query = function (query) {
    let self = this;

    if (typeof this._datasource === 'function') {
      this._setLoading(true);
      this._datasource(query, function (results) {
        self._setLoading(false);
        self._showResults(results || []);
      });

    } else if (Array.isArray(this._datasource)) {
      let q        = query.toLowerCase();
      let filtered = this._datasource.filter(function (item) {
        return String(item[self._textField] || '').toLowerCase().indexOf(q) !== -1;
      });
      this._showResults(filtered);
    }
  };

  /* ── Mostrar resultados ──────────────────────────────────── */

  Autocomplete.prototype._showResults = function (results) {
    let self = this;
    this._results     = results;
    this._activeIndex = -1;
    this._dropdown.innerHTML = '';

    if (!results.length) {
      let emptyLi = document.createElement('li');
      emptyLi.className = 'mts-ac__empty';
      emptyLi.textContent = this._empty;
      this._dropdown.appendChild(emptyLi);
    } else {
      results.forEach(function (item, idx) {
        let li = document.createElement('li');
        li.className = 'mts-ac__item';
        li.textContent = item[self._textField] != null ? String(item[self._textField]) : '';
        li.addEventListener('mousedown', function (e) {
          e.preventDefault(); /* evita blur del input */
          self._selectItem(item);
        });
        li.addEventListener('mouseenter', function () { self._setActive(idx); });
        self._dropdown.appendChild(li);
      });
    }

    this._openDropdown();
  };

  /* ── Seleccionar ítem ────────────────────────────────────── */

  Autocomplete.prototype._selectItem = function (item) {
    let text  = item[this._textField]  != null ? String(item[this._textField])  : '';
    let value = item[this._valueField] != null ? String(item[this._valueField]) : '';

    this._selectedItem = item;
    this._input.value  = text;
    this._input.setAttribute('data-mts-value', value);
    this._clearBtn.style.display = text ? '' : 'none';

    this._closeDropdown();
    if (this._onSelect) { this._onSelect(item); }
    if (this._onChange) { this._onChange(item); }
  };

  /* ── Dropdown ────────────────────────────────────────────── */

  Autocomplete.prototype._openDropdown = function () {
    this._dropdown.style.display = '';
    this._positionDropdown();
    this._wrap.classList.add('mts-ac__wrap--open');
  };

  Autocomplete.prototype._closeDropdown = function () {
    this._dropdown.style.display = 'none';
    this._wrap.classList.remove('mts-ac__wrap--open');
    this._activeIndex = -1;
    this._results     = [];
  };

  Autocomplete.prototype._isOpen = function () {
    return this._dropdown.style.display !== 'none';
  };

  Autocomplete.prototype._positionDropdown = function () {
    let rect = this._input.getBoundingClientRect();
    this._dropdown.style.top   = (rect.bottom + 4) + 'px';
    this._dropdown.style.left  = rect.left + 'px';
    this._dropdown.style.width = rect.width + 'px';
  };

  /* ── Navegación teclado ──────────────────────────────────── */

  Autocomplete.prototype._moveActive = function (dir) {
    let items = this._dropdown.querySelectorAll('.mts-ac__item');
    if (!items.length) { return; }
    let next = this._activeIndex + dir;
    if (next < 0)              { next = items.length - 1; }
    if (next >= items.length)  { next = 0; }
    this._setActive(next);
  };

  Autocomplete.prototype._setActive = function (idx) {
    let items = this._dropdown.querySelectorAll('.mts-ac__item');
    Array.prototype.forEach.call(items, function (li) {
      li.classList.remove('mts-ac__item--active');
    });
    this._activeIndex = idx;
    if (items[idx]) {
      items[idx].classList.add('mts-ac__item--active');
      items[idx].scrollIntoView({ block: 'nearest' });
    }
  };

  /* ── Loading ─────────────────────────────────────────────── */

  Autocomplete.prototype._setLoading = function (loading) {
    this._wrap.classList.toggle('mts-ac__wrap--loading', loading);
  };

  /* ── API pública ─────────────────────────────────────────── */

  Autocomplete.prototype.getValue = function () {
    return this._input.getAttribute('data-mts-value');
  };

  /* ── Form-field validation contract ── */
  Autocomplete.prototype.setError = function (msg) {
    this._error = msg || '';
    if (this._errEl) { this._errEl.textContent = this._error; this._errEl.style.display = this._error ? '' : 'none'; }
    if (this._wrap)  { this._wrap.classList.toggle('mts-ac__wrap--error', !!this._error); }
    return this;
  };
  Autocomplete.prototype.clearError = function () { return this.setError(''); };
  Autocomplete.prototype.validate = function () {
    let v  = this.getValue();
    let ok = !this._required || (v != null && v !== '');
    if (ok) { this.clearError(); }
    else    { this.setError(this._errorMessage || this._t('required', 'This field is required')); }
    try { this._input.dispatchEvent(new CustomEvent('mts:autocomplete:validate', { bubbles: true, detail: { valid: ok, errors: ok ? [] : [this._error] } })); } catch (e) {}
    return ok;
  };
  Autocomplete.prototype._t = function (key, fallback) {
    try {
      let ns = (global.MTS && global.MTS.getString) ? global.MTS.getString()['MTS.Autocomplete'] : null;
      let m  = ns && ns.messages;
      if (m && m[key] != null) { return m[key]; }
    } catch (e) {}
    return fallback;
  };

  Autocomplete.prototype.getText = function () {
    return this._input.value;
  };

  Autocomplete.prototype.getItem = function () {
    return this._selectedItem;
  };

  Autocomplete.prototype.setValue = function (value, text) {
    this._input.value = text != null ? String(text) : '';
    this._input.setAttribute('data-mts-value', value != null ? String(value) : '');
    this._selectedItem                    = {};
    this._selectedItem[this._valueField]  = value;
    this._selectedItem[this._textField]   = text;
    this._clearBtn.style.display = this._input.value ? '' : 'none';
    return this;
  };

  Autocomplete.prototype.clear = function () {
    this._input.value  = '';
    this._input.removeAttribute('data-mts-value');
    this._selectedItem = null;
    this._clearBtn.style.display = 'none';
    this._closeDropdown();
    if (this._onClear)  { this._onClear(); }
    if (this._onChange) { this._onChange(null); }
    return this;
  };

  Autocomplete.prototype.destroy = function () {
    clearTimeout(this._timer);
    document.removeEventListener('mousedown', this._outsideHandler);
    window.removeEventListener('scroll',  this._repositionHandler, true);
    window.removeEventListener('resize',  this._repositionHandler);
    if (this._dropdown && this._dropdown.parentNode) {
      this._dropdown.parentNode.removeChild(this._dropdown);
    }
    /* Desenvuelve el input */
    if (this._wrap && this._wrap.parentNode) {
      this._wrap.parentNode.insertBefore(this._input, this._wrap);
      this._wrap.parentNode.removeChild(this._wrap);
    }
    this._input.removeAttribute('data-mts-value');
  };

  /* ── Registro ────────────────────────────────────────────── */

  if (!global.MTS) { global.MTS = {}; }
  global.MTS.Autocomplete = Autocomplete;

}(window));
