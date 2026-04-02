/* ============================================================
   MATIOS UI — matios-ui-taginput.js
   MTS.TagInput — Tags con sugerencias y debounce
   Eventos DOM: mts:taginput:add | mts:taginput:remove | mts:taginput:change
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.TagInput = class MtsTagInput {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {Array}    options.tags          Tags iniciales
   * @param {Array}    options.suggestions   Sugerencias [ string | { value, label } ]
   * @param {string}   options.placeholder
   * @param {string}   options.label
   * @param {number}   options.maxTags
   * @param {boolean}  options.allowDuplicates
   * @param {boolean}  options.allowCustom   Permite tags no en suggestions
   * @param {number}   options.debounce      ms para disparar onSearch
   * @param {function} options.onSearch      (query) => {} — para búsqueda asíncrona
   * @param {function} options.onChange
   * @param {function} options.onAdd
   * @param {function} options.onRemove
   */
  constructor(selector, options = {}) {
    this._el     = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    /* ── data-* → inicialización HTML declarativa ── */
    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.label !== undefined) _fromHTML.label = _ds.label;
    if (_ds.placeholder !== undefined) _fromHTML.placeholder = _ds.placeholder;
    if (_ds.maxTags !== undefined) _fromHTML.maxTags = parseInt(_ds.maxTags);
    if (_ds.allowDuplicates !== undefined) _fromHTML.allowDuplicates = true;
    if (_ds.allowCustom !== undefined) _fromHTML.allowCustom = true;
    if (_ds.disabled !== undefined) _fromHTML.disabled = true;
    options = { ..._fromHTML, ...options };

    this.tags           = [...(options.tags || [])];
    this.suggestions    = options.suggestions    || [];
    this.placeholder    = options.placeholder    || 'Agregar...';
    this.label          = options.label          || '';
    this.maxTags        = options.maxTags        || null;
    this.allowDuplicates = options.allowDuplicates ?? false;
    this.allowCustom    = options.allowCustom    ?? true;
    this.debounceMs     = options.debounce       ?? 300;
    this.onSearch       = options.onSearch       || null;
    this._listeners     = {};
    this._debounceTimer = null;
    this._filtered      = [];

    if (options.onChange) this.on('change', options.onChange);
    if (options.onAdd)    this.on('add',    options.onAdd);
    if (options.onRemove) this.on('remove', options.onRemove);

    this._build();
    this._bindEvents();
  }

  getTags()         { return [...this.tags]; }
  setTags(tags)     { this.tags = [...tags]; this._renderTags(); return this; }
  addTag(tag)       { this._addTag(tag); return this; }
  removeTag(tag)    { this._removeTag(tag); return this; }
  setSuggestions(s) { this.suggestions = s; this._renderSuggestions(this._inputEl?.value || ''); return this; }
  on(e, cb)         { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  destroy()         { this._el.innerHTML = ''; }

  _build() {
    /* Si el padre ya es mts-form-group, actuar solo como wrapper del campo */
    const parentIsGroup = this._el.parentElement?.classList.contains('mts-form-group');
    if (parentIsGroup) {
      this._el.className = 'mts-taginput';
      this._el.innerHTML = '';
      this._buildTagInputContent();
      return;
    }

    this._el.className = 'mts-form-group';
    if (this.label) {
      const lbl = document.createElement('label');
      lbl.className = 'mts-label';
      lbl.textContent = this.label;
      this._el.appendChild(lbl);
    }

    this._wrapEl = document.createElement('div');
    this._wrapEl.className = 'mts-taginput';
    this._buildTagInputContent();
    this._el.appendChild(this._wrapEl);
    this._el.appendChild(this._dropdownEl);
    this._renderTags();
  }

  _buildTagInputContent() {
    const target = this._el.classList.contains('mts-taginput') ? this._el : this._wrapEl;
    if (!target) return;

    this._tagsEl = document.createElement('div');
    this._tagsEl.className = 'mts-taginput__tags';

    this._inputEl = document.createElement('input');
    this._inputEl.type = 'text';
    this._inputEl.className = 'mts-taginput__input';
    this._inputEl.placeholder = this.tags.length ? '' : this.placeholder;

    target.appendChild(this._tagsEl);
    target.appendChild(this._inputEl);

    this._dropdownEl = document.createElement('div');
    this._dropdownEl.className = 'mts-taginput__dropdown';
    target.after(this._dropdownEl);

    this._renderTags();
  }

  _bindEvents() {
    this._inputEl.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ',') && this._inputEl.value.trim()) {
        e.preventDefault();
        if (this.allowCustom) this._addTag(this._inputEl.value.trim());
      }
      if (e.key === 'Backspace' && !this._inputEl.value && this.tags.length) {
        this._removeTag(this.tags[this.tags.length - 1]);
      }
      if (e.key === 'Escape') this._closeDropdown();
    });

    this._inputEl.addEventListener('input', () => {
      const q = this._inputEl.value;
      clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(() => {
        if (this.onSearch) this.onSearch(q);
        else this._renderSuggestions(q);
      }, this.debounceMs);
    });

    this._inputEl.addEventListener('blur', () => {
      setTimeout(() => this._closeDropdown(), 150);
    });

    (this._wrapEl || this._el).addEventListener('click', () => this._inputEl.focus());
  }

  _addTag(tag) {
    if (this.maxTags && this.tags.length >= this.maxTags) return;
    if (!this.allowDuplicates && this.tags.includes(tag)) return;
    if (!tag) return;
    this.tags.push(tag);
    this._inputEl.value = '';
    this._closeDropdown();
    this._renderTags();
    this._emit('add',    { tag });
    this._emit('change', { tags: [...this.tags] });
  }

  _removeTag(tag) {
    const idx = this.tags.lastIndexOf(tag);
    if (idx >= 0) this.tags.splice(idx, 1);
    this._renderTags();
    this._emit('remove', { tag });
    this._emit('change', { tags: [...this.tags] });
  }

  _renderTags() {
    this._tagsEl.innerHTML = '';
    this.tags.forEach(tag => {
      const chip = document.createElement('span');
      chip.className = 'mts-taginput__tag';
      chip.textContent = tag;
      const rm = document.createElement('button');
      rm.className = 'mts-taginput__tag-remove';
      rm.innerHTML = '&times;';
      rm.addEventListener('mousedown', (e) => { e.preventDefault(); this._removeTag(tag); });
      chip.appendChild(rm);
      this._tagsEl.appendChild(chip);
    });
    this._inputEl.placeholder = this.tags.length ? '' : this.placeholder;
  }

  _renderSuggestions(q) {
    this._dropdownEl.innerHTML = '';
    if (!q) { this._closeDropdown(); return; }
    const filtered = this.suggestions.filter(s => {
      const label = typeof s === 'string' ? s : s.label;
      return label.toLowerCase().includes(q.toLowerCase()) && !this.tags.includes(label);
    });
    if (!filtered.length) { this._closeDropdown(); return; }
    filtered.slice(0, 8).forEach(s => {
      const label = typeof s === 'string' ? s : s.label;
      const item  = document.createElement('div');
      item.className = 'mts-taginput__suggestion';
      item.textContent = label;
      item.addEventListener('mousedown', (e) => { e.preventDefault(); this._addTag(label); });
      this._dropdownEl.appendChild(item);
    });
    this._dropdownEl.classList.add('mts-taginput__dropdown--open');
  }

  _closeDropdown() {
    this._dropdownEl.classList.remove('mts-taginput__dropdown--open');
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:taginput:${event}`, { bubbles: true, detail }));
  }
};
