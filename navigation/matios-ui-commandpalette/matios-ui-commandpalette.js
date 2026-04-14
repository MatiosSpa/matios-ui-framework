/* ============================================================
   MATIOS UI — matios-ui-commandpalette.js
   MTS.CommandPalette — Command palette ⌘K style
   Version: 1.1.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.CommandPalette = class MtsCommandPalette {
  constructor(options = {}) {
    // Command list: [{ id, label, description?, group?, icon?, shortcut?, keywords?[], action, disabled? }]
    // Lista de comandos
    this.commands = options.commands || [];

    // Input placeholder / Placeholder del input
    this.placeholder = options.placeholder || 'Buscar comando...';

    // Hotkey letter — default: 'k' (⌘K / Ctrl+K) / Tecla para abrir
    this.hotkey = options.hotkey || 'k';

    // Show dark overlay / Mostrar fondo oscuro
    this.overlay = options.overlay ?? true;

    // Max visible results / Máximo de resultados visibles
    this.maxResults = options.maxResults ?? 8;

    this._el          = null;
    this._active      = 0;
    this._results     = [];
    this._searchTimer = null;
    this._listeners   = {};

    // Fires when palette opens / Se dispara al abrir la paleta
    if (options.onOpen)   this.on('open',   options.onOpen);

    // Fires when palette closes / Se dispara al cerrar la paleta
    if (options.onClose)  this.on('close',  options.onClose);

    // Fires when a command is selected: ({ id, command }) => {} / Se dispara al seleccionar un comando
    if (options.onSelect) this.on('select', options.onSelect);

    // Async search function: (query) => Promise<commands[]> | commands[]
    // Función de búsqueda async — se usa en lugar de la búsqueda local
    if (options.onSearch) this.on('search', options.onSearch);

    this._init();
  }

  /* ── API ─────────────────────────────────────────────── */

  // Open the palette / Abrir la paleta
  open()  { this._render(); return this; }

  // Close the palette / Cerrar la paleta
  close() { this._destroy(); return this; }

  // Toggle open/close / Alternar abierto/cerrado
  toggle() { this._el ? this._destroy() : this._render(); return this; }

  // Replace command list / Reemplazar lista de comandos
  setCommands(cmds) { this.commands = cmds; return this; }

  // Add commands to existing list / Agregar comandos a la lista existente
  addCommands(cmds) { this.commands = this.commands.concat(cmds); return this; }

  // Register event listener / Registrar listener de evento
  on(e, cb) { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }

  // Remove event listener / Eliminar listener de evento
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }

  // Destroy and unbind hotkey / Destruir y desvincular hotkey
  destroy() { this._destroy(); document.removeEventListener('keydown', this._hotkeyFn); }

  /* ── Init ────────────────────────────────────────────── */

  _init() {
    this._hotkeyFn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === this.hotkey) {
        e.preventDefault();
        this.toggle();
      }
    };
    document.addEventListener('keydown', this._hotkeyFn);
  }

  /* ── Render ──────────────────────────────────────────── */

  _render() {
    this._destroy();

    const overlay = document.createElement('div');
    overlay.className = 'mts-cmd__overlay';
    overlay.addEventListener('click', () => this._destroy());

    const wrap = document.createElement('div');
    wrap.className = 'mts-cmd';
    wrap.addEventListener('click', e => e.stopPropagation());

    const inputWrap = document.createElement('div');
    inputWrap.className = 'mts-cmd__input-wrap';

    const searchIcon = document.createElement('div');
    searchIcon.className = 'mts-cmd__search-icon';
    searchIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>';

    const input = document.createElement('input');
    input.type          = 'text';
    input.className     = 'mts-cmd__input';
    input.placeholder   = this.placeholder;
    input.autocomplete  = 'off';
    input.spellcheck    = false;

    const kbdHint = document.createElement('kbd');
    kbdHint.className   = 'mts-cmd__esc';
    kbdHint.textContent = 'ESC';

    inputWrap.appendChild(searchIcon);
    inputWrap.appendChild(input);
    inputWrap.appendChild(kbdHint);
    wrap.appendChild(inputWrap);

    const list = document.createElement('div');
    list.className  = 'mts-cmd__list';
    this._listEl    = list;
    wrap.appendChild(list);

    const footer = document.createElement('div');
    footer.className = 'mts-cmd__footer';
    footer.innerHTML = '<span><kbd>↑↓</kbd> navegar</span><span><kbd>↵</kbd> ejecutar</span><span><kbd>ESC</kbd> cerrar</span>';
    wrap.appendChild(footer);

    overlay.appendChild(wrap);
    document.body.appendChild(overlay);
    this._el      = overlay;
    this._inputEl = input;

    input.addEventListener('input', () => {
      clearTimeout(this._searchTimer);
      this._searchTimer = setTimeout(() => this._search(input.value.trim()), 120);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape')    { e.preventDefault(); this._destroy(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); this._move(1); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); this._move(-1); }
      if (e.key === 'Enter')     { e.preventDefault(); this._execute(); }
    });

    this._search('');
    setTimeout(() => input.focus(), 30);
    this._emit('open', {});
  }

  /* ── Search ──────────────────────────────────────────── */

  _search(query) {
    this._active = 0;

    // Use async search handler if registered / Usar handler async si está registrado
    const searchHandlers = this._listeners['search'] || [];
    if (searchHandlers.length) {
      Promise.resolve(searchHandlers[0]({ type: 'search', detail: { query } })).then(cmds => {
        this._results = (cmds || []).slice(0, this.maxResults);
        this._renderResults(query);
      });
      return;
    }

    // Local search / Búsqueda local
    const q = query.toLowerCase();
    this._results = !q
      ? this.commands.filter(c => !c.disabled).slice(0, this.maxResults)
      : this.commands.filter(c => !c.disabled && (
          c.label.toLowerCase().includes(q) ||
          (c.description || '').toLowerCase().includes(q) ||
          (c.group || '').toLowerCase().includes(q) ||
          (c.keywords || []).some(kw => kw.toLowerCase().includes(q))
        )).slice(0, this.maxResults);

    this._renderResults(query);
  }

  _renderResults(query) {
    const list = this._listEl;
    if (!list) return;
    list.innerHTML = '';

    if (!this._results.length) {
      const empty = document.createElement('div');
      empty.className   = 'mts-cmd__empty';
      empty.textContent = query ? `Sin resultados para "${query}"` : 'No hay comandos disponibles';
      list.appendChild(empty);
      return;
    }

    // Group results / Agrupar resultados
    const groups = {};
    const order  = [];
    this._results.forEach(cmd => {
      const g = cmd.group || '';
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(cmd);
    });

    let globalIdx = 0;
    order.forEach(groupName => {
      if (groupName) {
        const grpEl = document.createElement('div');
        grpEl.className   = 'mts-cmd__group';
        grpEl.textContent = groupName;
        list.appendChild(grpEl);
      }
      groups[groupName].forEach(cmd => {
        const item = document.createElement('div');
        item.className    = 'mts-cmd__item' + (globalIdx === this._active ? ' mts-cmd__item--active' : '');
        item.dataset.idx  = globalIdx;

        if (cmd.icon) {
          const ico = document.createElement('div');
          ico.className = 'mts-cmd__item-icon';
          ico.innerHTML = cmd.icon;
          item.appendChild(ico);
        }

        const text  = document.createElement('div');
        text.className = 'mts-cmd__item-text';
        const label = document.createElement('span');
        label.className   = 'mts-cmd__item-label';
        label.textContent = cmd.label;
        text.appendChild(label);
        if (cmd.description) {
          const desc = document.createElement('span');
          desc.className   = 'mts-cmd__item-desc';
          desc.textContent = cmd.description;
          text.appendChild(desc);
        }
        item.appendChild(text);

        if (cmd.shortcut) {
          const sh = document.createElement('kbd');
          sh.className   = 'mts-cmd__shortcut';
          sh.textContent = cmd.shortcut;
          item.appendChild(sh);
        }

        item.addEventListener('mouseenter', () => {
          this._active = +item.dataset.idx;
          this._highlightActive();
        });
        item.addEventListener('click', () => {
          this._active = +item.dataset.idx;
          this._execute();
        });

        list.appendChild(item);
        globalIdx++;
      });
    });
  }

  _move(dir) {
    const len = this._results.length;
    if (!len) return;
    this._active = (this._active + dir + len) % len;
    this._highlightActive();
    this._listEl?.querySelectorAll('.mts-cmd__item')?.[this._active]?.scrollIntoView({ block: 'nearest' });
  }

  _highlightActive() {
    this._listEl?.querySelectorAll('.mts-cmd__item').forEach((el, i) => {
      el.classList.toggle('mts-cmd__item--active', i === this._active);
    });
  }

  _execute() {
    const cmd = this._results[this._active];
    if (!cmd) return;
    this._destroy();
    this._emit('select', { id: cmd.id, command: cmd });
    if (cmd.action) cmd.action(cmd);
  }

  _destroy() {
    if (!this._el) return;
    this._el.remove();
    this._el = null;
    this._emit('close', {});
  }

  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    document.dispatchEvent(new CustomEvent(`mts:commandpalette:${event}`, { bubbles: true, detail }));
  }
};
