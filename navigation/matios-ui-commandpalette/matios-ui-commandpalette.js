/* ============================================================
   MATIOS UI — matios-ui-commandpalette.js
   MTS.CommandPalette — Paleta de comandos tipo ⌘K
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.CommandPalette = class MtsCommandPalette {
  /**
   * @param {object} options
   * @param {Array}    options.commands    Lista de comandos
   *   { id, label, description?, group?, icon?, shortcut?, keywords?[], action, disabled? }
   * @param {string}   options.placeholder Placeholder del input — default: 'Buscar comando...'
   * @param {string}   options.hotkey      Tecla para abrir — default: 'k' (⌘K / Ctrl+K)
   * @param {boolean}  options.overlay     Fondo oscuro — default: true
   * @param {number}   options.maxResults  Máximo resultados visibles — default: 8
   * @param {function} options.onOpen
   * @param {function} options.onClose
   * @param {function} options.onSelect    ({ command }) => {}
   * @param {function} options.onSearch    (query) => commands[] — para búsqueda async
   */
  constructor(options = {}) {
    this.commands    = options.commands    || [];
    this.placeholder = options.placeholder || 'Buscar comando...';
    this.hotkey      = options.hotkey      || 'k';
    this.overlay     = options.overlay     ?? true;
    this.maxResults  = options.maxResults  ?? 8;
    this._onOpen     = options.onOpen      || null;
    this._onClose    = options.onClose     || null;
    this._onSelect   = options.onSelect    || null;
    this._onSearch   = options.onSearch    || null;
    this._el         = null;
    this._active     = 0;
    this._results    = [];
    this._searchTimer = null;
    this._init();
  }

  /* ── API ── */
  open()  { this._render(); return this; }
  close() { this._destroy(); return this; }
  toggle() { this._el ? this._destroy() : this._render(); return this; }
  setCommands(cmds) { this.commands = cmds; return this; }
  addCommands(cmds) { this.commands = this.commands.concat(cmds); return this; }
  destroy() { this._destroy(); document.removeEventListener('keydown', this._hotkeyFn); }

  _init() {
    this._hotkeyFn = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === this.hotkey) {
        e.preventDefault();
        this.toggle();
      }
    };
    document.addEventListener('keydown', this._hotkeyFn);
  }

  _render() {
    this._destroy();

    /* Overlay */
    const overlay = document.createElement('div');
    overlay.className = 'mts-cmd__overlay';
    overlay.addEventListener('click', () => this._destroy());

    /* Wrapper */
    const wrap = document.createElement('div');
    wrap.className = 'mts-cmd';
    wrap.addEventListener('click', e => e.stopPropagation());

    /* Input */
    const inputWrap = document.createElement('div');
    inputWrap.className = 'mts-cmd__input-wrap';

    const searchIcon = document.createElement('div');
    searchIcon.className = 'mts-cmd__search-icon';
    searchIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'mts-cmd__input';
    input.placeholder = this.placeholder;
    input.autocomplete = 'off';
    input.spellcheck = false;

    const kbdHint = document.createElement('kbd');
    kbdHint.className = 'mts-cmd__esc';
    kbdHint.textContent = 'ESC';

    inputWrap.appendChild(searchIcon);
    inputWrap.appendChild(input);
    inputWrap.appendChild(kbdHint);
    wrap.appendChild(inputWrap);

    /* Results */
    const list = document.createElement('div');
    list.className = 'mts-cmd__list';
    this._listEl = list;
    wrap.appendChild(list);

    /* Footer */
    const footer = document.createElement('div');
    footer.className = 'mts-cmd__footer';
    footer.innerHTML = '<span><kbd>↑↓</kbd> navegar</span><span><kbd>↵</kbd> ejecutar</span><span><kbd>ESC</kbd> cerrar</span>';
    wrap.appendChild(footer);

    overlay.appendChild(wrap);
    document.body.appendChild(overlay);
    this._el = overlay;
    this._inputEl = input;

    /* Eventos de input */
    input.addEventListener('input', () => {
      clearTimeout(this._searchTimer);
      this._searchTimer = setTimeout(() => this._search(input.value.trim()), 120);
    });

    /* Navegación con teclado */
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape')    { e.preventDefault(); this._destroy(); }
      if (e.key === 'ArrowDown') { e.preventDefault(); this._move(1); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); this._move(-1); }
      if (e.key === 'Enter')     { e.preventDefault(); this._execute(); }
    });

    /* Mostrar todos al abrir */
    this._search('');
    setTimeout(() => input.focus(), 30);

    if (this._onOpen) this._onOpen();
  }

  _search(query) {
    this._active = 0;

    if (this._onSearch) {
      /* Búsqueda async */
      Promise.resolve(this._onSearch(query)).then(cmds => {
        this._results = (cmds || []).slice(0, this.maxResults);
        this._renderResults(query);
      });
      return;
    }

    /* Búsqueda local */
    const q = query.toLowerCase();
    if (!q) {
      this._results = this.commands.filter(c => !c.disabled).slice(0, this.maxResults);
    } else {
      this._results = this.commands
        .filter(c => !c.disabled && (
          c.label.toLowerCase().includes(q) ||
          (c.description || '').toLowerCase().includes(q) ||
          (c.group || '').toLowerCase().includes(q) ||
          (c.keywords || []).some(kw => kw.toLowerCase().includes(q))
        ))
        .slice(0, this.maxResults);
    }
    this._renderResults(query);
  }

  _renderResults(query) {
    const list = this._listEl;
    if (!list) return;
    list.innerHTML = '';

    if (!this._results.length) {
      const empty = document.createElement('div');
      empty.className = 'mts-cmd__empty';
      empty.textContent = query ? 'Sin resultados para "' + query + '"' : 'No hay comandos disponibles';
      list.appendChild(empty);
      return;
    }

    /* Agrupar */
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
        grpEl.className = 'mts-cmd__group';
        grpEl.textContent = groupName;
        list.appendChild(grpEl);
      }
      groups[groupName].forEach(cmd => {
        const item = document.createElement('div');
        item.className = 'mts-cmd__item' + (globalIdx === this._active ? ' mts-cmd__item--active' : '');
        item.dataset.idx = globalIdx;

        if (cmd.icon) {
          const ico = document.createElement('div');
          ico.className = 'mts-cmd__item-icon';
          ico.innerHTML = cmd.icon;
          item.appendChild(ico);
        }

        const text = document.createElement('div');
        text.className = 'mts-cmd__item-text';
        const label = document.createElement('span');
        label.className = 'mts-cmd__item-label';
        label.textContent = cmd.label;
        text.appendChild(label);
        if (cmd.description) {
          const desc = document.createElement('span');
          desc.className = 'mts-cmd__item-desc';
          desc.textContent = cmd.description;
          text.appendChild(desc);
        }
        item.appendChild(text);

        if (cmd.shortcut) {
          const sh = document.createElement('kbd');
          sh.className = 'mts-cmd__shortcut';
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
    /* Scroll al activo */
    const items = this._listEl?.querySelectorAll('.mts-cmd__item');
    items?.[this._active]?.scrollIntoView({ block: 'nearest' });
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
    if (this._onSelect) this._onSelect({ command: cmd });
    if (cmd.action) cmd.action(cmd);
    document.dispatchEvent(new CustomEvent('mts:commandpalette:select', { detail: { command: cmd } }));
  }

  _destroy() {
    if (!this._el) return;
    this._el.remove();
    this._el = null;
    if (this._onClose) this._onClose();
  }
};
