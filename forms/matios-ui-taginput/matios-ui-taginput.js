/* ============================================================
   MATIOS UI â€” matios-ui-taginput.js
   MTS.TagInput â€” Tags with suggestions, debounce and object support
   Version: 2.0.0

   Tags are stored as objects: { uid, name }
     uid  â€” unique identifier (email, id, uuid, etc.)
     name â€” display text shown in the chip

   Usage:
     const ti = new MTS.TagInput('#el', {
       label: 'Invitados',
       onSearch: async (q) => {
         const res = await fetch('/api/users?q=' + q);
         return res.json(); // [{ uid, name }, ...]
       },
       onChange: (e) => console.log(e.detail.tags), // [{ uid, name }, ...]
     });

     ti.getTags();           // â†’ [{ uid, name }, ...]
     ti.setTags([{ uid: 'abc@x.com', name: 'Ana LÃ³pez' }]);
   ============================================================ */

window.MTS = window.MTS || {};

MTS.TagInput = class MtsTagInput {
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;

    const _ds = this._el?.dataset || {};
    const _fromHTML = {};
    if (_ds.label           !== undefined) _fromHTML.label           = _ds.label;
    if (_ds.placeholder     !== undefined) _fromHTML.placeholder     = _ds.placeholder;
    if (_ds.maxTags         !== undefined) _fromHTML.maxTags         = parseInt(_ds.maxTags);
    if (_ds.allowDuplicates !== undefined) _fromHTML.allowDuplicates = true;
    if (_ds.allowCustom     !== undefined) _fromHTML.allowCustom     = true;
    if (_ds.disabled        !== undefined) _fromHTML.disabled        = true;
    options = { ..._fromHTML, ...options };

    /* Tags: siempre array de { uid, name }
       Acepta strings legacy â†’ se normaliza a { uid: str, name: str } */
    this.tags = (options.tags || []).map(t => this._normalize(t));

    /* Sugerencias: [{ uid, name }] o strings */
    this.suggestions = options.suggestions || [];

    this.placeholder     = options.placeholder    || 'Agregar...';
    this.label           = options.label          || '';
    this.maxTags         = options.maxTags        || null;
    this.allowDuplicates = options.allowDuplicates ?? false;
    this.allowCustom     = options.allowCustom    ?? true;
    this.renderMode      = options.renderMode     || 'auto';
    this.debounceMs      = options.debounce       ?? 300;

    /* onSearch: async (query: string) => { uid, name }[]
       Si se provee, reemplaza las suggestions estÃ¡ticas */
    this.onSearch = options.onSearch || null;

    this._listeners     = {};
    this._debounceTimer = null;

    if (options.onChange) this.on('change', options.onChange);
    if (options.onAdd)    this.on('add',    options.onAdd);
    if (options.onRemove) this.on('remove', options.onRemove);

    this._build();
    this._bindEvents();
    this._el._mtsInstance = this;
  }

  /*â”€â”€ NormalizaciÃ³n interna â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  _normalize(tag) {
    if (typeof tag === 'string') return { uid: tag, name: tag };
    /* Acepta { uid, name } o { value, label } (compatibilidad con Select) */
    return {
      uid:  tag.uid  ?? tag.value ?? tag.id ?? String(tag.name || tag.label || tag),
      name: tag.name ?? tag.label ?? String(tag.uid || tag.value || tag),
    };
  }

  /* â”€â”€ API pÃºblica â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

  /* Retorna [{ uid, name }, ...] */
  getTags() { return this.tags.map(t => ({ ...t })); }

  /* Acepta [{ uid, name }] o strings */
  setTags(tags) {
    this.tags = (tags || []).map(t => this._normalize(t));
    this._renderTags();
    return this;
  }

  /* Agrega un tag â€” acepta { uid, name } o string */
  addTag(tag) { this._addTag(this._normalize(tag)); return this; }

  /* Elimina un tag por uid o por objeto { uid } */
  removeTag(tag) {
    const uid = typeof tag === 'string' ? tag : tag.uid;
    this._removeByUid(uid);
    return this;
  }

  /* Reemplaza las sugerencias */
  setSuggestions(s) {
    this.suggestions = s;
    this._renderSuggestions(this._inputEl?.value || '');
    return this;
  }

  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }
  destroy()  { this._el.innerHTML = ''; }

  /* â”€â”€ Build â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  _build() {
    const explicitFieldOnly = this.renderMode === 'field-only';
    const explicitStandalone = this.renderMode === 'standalone';
    const parentIsGroup = this._el.parentElement?.classList.contains('mts-form-group');
    const fieldOnly = explicitFieldOnly || (!explicitStandalone && parentIsGroup);

    this._el.innerHTML = '';

    if (!fieldOnly && this.label) {
      const lbl = document.createElement('label');
      lbl.className   = 'mts-label';
      lbl.textContent = this.label;
      this._el.appendChild(lbl);
    }

    this._wrapEl = document.createElement('div');
    this._wrapEl.className = 'mts-taginput';
    this._buildTagInputContent();
    this._el.appendChild(this._wrapEl);
    this._renderTags();
  }

  _buildTagInputContent() {
    const target = this._wrapEl;
    if (!target) return;

    this._tagsEl = document.createElement('div');
    this._tagsEl.className = 'mts-taginput__tags';

    this._inputEl = document.createElement('input');
    this._inputEl.type        = 'text';
    this._inputEl.className   = 'mts-taginput__input';
    this._inputEl.placeholder = this.tags.length ? '' : this.placeholder;

    target.appendChild(this._tagsEl);
    target.appendChild(this._inputEl);

    this._dropdownEl = document.createElement('div');
    this._dropdownEl.className = 'mts-taginput__dropdown';
    target.appendChild(this._dropdownEl);

    this._renderTags();
  }

  /* â”€â”€ Eventos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  _bindEvents() {
    this._inputEl.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ',') && this._inputEl.value.trim()) {
        e.preventDefault();
        if (this.allowCustom) {
          const val = this._inputEl.value.trim();
          this._addTag({ uid: val, name: val });
        }
      }
      if (e.key === 'Backspace' && !this._inputEl.value && this.tags.length) {
        this._removeByUid(this.tags[this.tags.length - 1].uid);
      }
      if (e.key === 'Escape') this._closeDropdown();
    });

    this._inputEl.addEventListener('input', () => {
      const q = this._inputEl.value;
      clearTimeout(this._debounceTimer);
      this._debounceTimer = setTimeout(async () => {
        if (this.onSearch) {
          const results = await this.onSearch(q);
          this.suggestions = (results || []).map(r => this._normalize(r));
        }
        this._renderSuggestions(q);
      }, this.debounceMs);
    });

    this._inputEl.addEventListener('blur', () => {
      setTimeout(() => this._closeDropdown(), 150);
    });

    (this._wrapEl || this._el).addEventListener('click', () => this._inputEl.focus());
  }

  /* â”€â”€ Internos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  _addTag(tag) {
    if (this.maxTags && this.tags.length >= this.maxTags) return;
    if (!tag?.name) return;
    /* DeduplicaciÃ³n por uid */
    if (!this.allowDuplicates && this.tags.some(t => t.uid === tag.uid)) return;
    this.tags.push(tag);
    this._inputEl.value = '';
    this._closeDropdown();
    this._renderTags();
    this._emit('add',    { tag: { ...tag } });
    this._emit('change', { tags: this.getTags() });
  }

  _removeByUid(uid) {
    const idx = this.tags.findIndex(t => t.uid === uid);
    if (idx < 0) return;
    const tag = this.tags[idx];
    this.tags.splice(idx, 1);
    this._renderTags();
    this._emit('remove', { tag: { ...tag } });
    this._emit('change', { tags: this.getTags() });
  }

  _renderTags() {
    this._tagsEl.innerHTML = '';
    this.tags.forEach(tag => {
      const chip = document.createElement('span');
      chip.className   = 'mts-taginput__tag';
      chip.textContent = tag.name;
      chip.title       = tag.uid !== tag.name ? tag.uid : ''; /* tooltip con uid si difiere del name */
      const rm = document.createElement('button');
      rm.className = 'mts-taginput__tag-remove';
      rm.innerHTML = '&times;';
      rm.setAttribute('aria-label', 'Eliminar ' + tag.name);
      rm.addEventListener('mousedown', (e) => { e.preventDefault(); this._removeByUid(tag.uid); });
      chip.appendChild(rm);
      this._tagsEl.appendChild(chip);
    });
    this._inputEl.placeholder = this.tags.length ? '' : this.placeholder;
  }

  _renderSuggestions(q) {
    this._dropdownEl.innerHTML = '';
    if (!q) { this._closeDropdown(); return; }

    const activeUids = new Set(this.tags.map(t => t.uid));
    const filtered   = this.suggestions.filter(s =>
      s.name.toLowerCase().includes(q.toLowerCase()) && !activeUids.has(s.uid)
    );

    if (!filtered.length) { this._closeDropdown(); return; }

    filtered.slice(0, 8).forEach(s => {
      const item = document.createElement('div');
      item.className = 'mts-taginput__suggestion';

      /* Nombre principal */
      const nameEl = document.createElement('span');
      nameEl.className   = 'mts-taginput__suggestion-name';
      nameEl.textContent = s.name;
      item.appendChild(nameEl);

      /* uid como hint si difiere del name */
      if (s.uid !== s.name) {
        const hintEl = document.createElement('span');
        hintEl.className   = 'mts-taginput__suggestion-hint';
        hintEl.textContent = s.uid;
        item.appendChild(hintEl);
      }

      item.addEventListener('mousedown', (e) => { e.preventDefault(); this._addTag(s); });
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

