/* ============================================================
   MATIOS UI — matios-ui-richtexteditor.js
   MTS.RichTextEditor — Editor WYSIWYG basado en contentEditable
   0 dependencias. Sin iframe. Sin librerías externas.
   Version: 1.0.0
   ============================================================ */
window.MTS = window.MTS || {};

MTS.RichTextEditor = class MtsRichTextEditor {
  /**
   * @param {string|Element} selector
   * @param {object} options
   * @param {string}   options.value        HTML inicial
   * @param {string}   options.placeholder  — default: 'Escribe aquí...'
   * @param {string}   options.height       Alto del área — default: '240px'
   * @param {string}   options.minHeight    — default: '120px'
   * @param {boolean}  options.disabled
   * @param {boolean}  options.readonly
   * @param {Array}    options.toolbar      Grupos de botones a mostrar
   *   default: ['format','lists','align','insert','clean']
   *   Opciones: 'format','lists','align','insert','clean','table'
   * @param {function} options.onChange     (html) => {}
   * @param {function} options.onFocus
   * @param {function} options.onBlur
   */
  constructor(selector, options = {}) {
    this._el      = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) return;
    // Initial HTML content / Contenido HTML inicial
    this._value = options.value || '';

    // Placeholder text / Texto placeholder
    this.placeholder = options.placeholder || 'Escribe aquí...';

    // Editor area height / Alto del área del editor
    this.height = options.height || '240px';

    // Minimum editor height / Alto mínimo del editor
    this.minHeight = options.minHeight || '120px';

    // Disables editing / Deshabilita la edición
    this.disabled = options.disabled ?? false;

    // Read-only mode / Modo solo lectura
    this.readonly = options.readonly ?? false;

    // Toolbar groups to show: 'format' | 'lists' | 'align' | 'insert' | 'clean' | 'table'
    // Grupos de toolbar a mostrar
    this.toolbar = options.toolbar || ['format','lists','align','insert','clean'];

    // Fires when content changes (receives HTML string) / Se dispara al cambiar el contenido
    this._savedRange = null;
    this._listeners  = {};

    // Fires when content changes: ({ html }) => {} / Se dispara al cambiar el contenido
    if (options.onChange) this.on('change', options.onChange);

    // Fires when editor gains focus / Se dispara al enfocar el editor
    if (options.onFocus)  this.on('focus',  options.onFocus);

    // Fires when editor loses focus / Se dispara al perder foco
    if (options.onBlur)   this.on('blur',   options.onBlur);

    this._build();
  }

  /* ── API ── */
  getValue()        { return this._editor?.innerHTML || ''; }
  setValue(html)    { if (this._editor) { this._editor.innerHTML = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(html) : html; } return this; }
  getText()         { return this._editor?.innerText || ''; }
  focus()           { this._editor?.focus(); return this; }
  clear()           { if (this._editor) this._editor.innerHTML = ''; return this; }
  disable()         { this.disabled = true;  if (this._editor) this._editor.contentEditable = 'false'; this._el.classList.add('mts-rte--disabled'); return this; }
  enable()          { this.disabled = false; if (this._editor) this._editor.contentEditable = 'true';  this._el.classList.remove('mts-rte--disabled'); return this; }
  insertHTML(html)  { this._restoreRange(); document.execCommand('insertHTML', false, html); return this; }
  on(e, cb)  { if (!this._listeners[e]) this._listeners[e] = []; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e] = (this._listeners[e] || []).filter(f => f !== cb); return this; }
  destroy()  { this._el.innerHTML = ''; }

  _syncClasses() {
    const keep = Array.from(this._el.classList).filter(cls => !cls.startsWith('mts-rte'));
    this._el.className = keep.join(' ');
    this._el.classList.add('mts-rte');
    if (this.disabled) this._el.classList.add('mts-rte--disabled');
  }

  /* ── Build ── */
  _build() {
    this._el.innerHTML = '';
    this._syncClasses();

    /* Toolbar */
    const tb = document.createElement('div');
    tb.className = 'mts-rte__toolbar';
    this._buildToolbar(tb);
    this._el.appendChild(tb);

    /* Editor */
    const editorWrap = document.createElement('div');
    editorWrap.className = 'mts-rte__editor-wrap';
    editorWrap.style.minHeight = this.minHeight;
    editorWrap.style.height    = this.height;

    const editor = document.createElement('div');
    editor.className = 'mts-rte__editor';
    editor.contentEditable = (!this.disabled && !this.readonly) ? 'true' : 'false';
    editor.spellcheck = true;
    editor.innerHTML  = typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(this._value) : this._value;

    /* Placeholder */
    if (!this._value) editor.classList.add('mts-rte__editor--empty');
    editor.setAttribute('data-placeholder', this.placeholder);

    editor.addEventListener('input', () => {
      editor.classList.toggle('mts-rte__editor--empty', !editor.innerHTML || editor.innerHTML === '<br>');
      this._emit('change', { html: editor.innerHTML });
      this._updateToolbarState();
    });
    editor.addEventListener('focus', (e) => {
      this._el.classList.add('mts-rte--focused');
      this._emit('focus', { event: e });
    });
    editor.addEventListener('blur', (e) => {
      this._el.classList.remove('mts-rte--focused');
      this._saveRange();
      this._emit('blur', { event: e });
    });
    editor.addEventListener('keyup', () => this._updateToolbarState());
    editor.addEventListener('mouseup', () => this._updateToolbarState());

    this._editor   = editor;
    this._toolbarEl = tb;
    editorWrap.appendChild(editor);
    this._el.appendChild(editorWrap);

    /* Status bar */
    const status = document.createElement('div');
    status.className = 'mts-rte__status';
    this._statusEl = status;
    this._el.appendChild(status);
    this._updateStatus();
  }

  /* ── Toolbar ── */
  _buildToolbar(tb) {
    const GROUPS = {
      format: [
        { cmd:'bold',          icon:'<b>B</b>',                  title:'Negrita (⌘B)',    exec:() => this._exec('bold') },
        { cmd:'italic',        icon:'<i>I</i>',                  title:'Cursiva (⌘I)',    exec:() => this._exec('italic') },
        { cmd:'underline',     icon:'<u>U</u>',                  title:'Subrayado (⌘U)', exec:() => this._exec('underline') },
        { cmd:'strikeThrough', icon:'<s>S</s>',                  title:'Tachado',         exec:() => this._exec('strikeThrough') },
        { type:'select', title:'Formato', options:[
          { label:'Normal',      value:'div'   },
          { label:'Título 1',    value:'h1'    },
          { label:'Título 2',    value:'h2'    },
          { label:'Título 3',    value:'h3'    },
          { label:'Cita',        value:'blockquote' },
          { label:'Código',      value:'pre'   },
        ], exec:(v) => this._exec('formatBlock', v) },
      ],
      lists: [
        { cmd:'insertUnorderedList', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>', title:'Lista', exec:() => this._exec('insertUnorderedList') },
        { cmd:'insertOrderedList',   icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-2-2-2"/></svg>', title:'Lista numerada', exec:() => this._exec('insertOrderedList') },
        { cmd:'indent',   icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/><polyline points="9 12 13 12"/><polyline points="9 10 13 12 9 14"/></svg>', title:'Indentar', exec:() => this._exec('indent') },
        { cmd:'outdent',  icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16"/><polyline points="13 12 9 12"/><polyline points="13 10 9 12 13 14"/></svg>', title:'Desindentar', exec:() => this._exec('outdent') },
      ],
      align: [
        { cmd:'justifyLeft',   icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>', title:'Izquierda', exec:() => this._exec('justifyLeft') },
        { cmd:'justifyCenter', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>', title:'Centro', exec:() => this._exec('justifyCenter') },
        { cmd:'justifyRight',  icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>', title:'Derecha', exec:() => this._exec('justifyRight') },
        { cmd:'justifyFull',   icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>', title:'Justificado', exec:() => this._exec('justifyFull') },
      ],
      insert: [
        { icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>', title:'Insertar enlace', exec:() => {
          this._restoreRange();
          const url = prompt('URL del enlace:');
          if (url) this._exec('createLink', url);
        }},
        { cmd:'unlink', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.84 12.25l1.72-1.71h-.02a5.004 5.004 0 00-.12-7.07 5.006 5.006 0 00-6.95 0l-1.72 1.71"/><path d="M5.17 11.75l-1.71 1.71a5.004 5.004 0 00.12 7.07 5.006 5.006 0 006.95 0l1.71-1.71"/><line x1="8" y1="2" x2="8" y2="5"/><line x1="2" y1="8" x2="5" y2="8"/><line x1="16" y1="19" x2="16" y2="22"/><line x1="19" y1="16" x2="22" y2="16"/></svg>', title:'Quitar enlace', exec:() => this._exec('unlink') },
        { type:'color', title:'Color de texto', exec:(v) => this._exec('foreColor', v) },
        { type:'bgcolor', title:'Color de fondo', exec:(v) => this._exec('hiliteColor', v) },
      ],
      clean: [
        { cmd:'undo', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>', title:'Deshacer (⌘Z)', exec:() => this._exec('undo') },
        { cmd:'redo', icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7"/></svg>', title:'Rehacer (⌘Y)', exec:() => this._exec('redo') },
        { icon:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>', title:'Limpiar formato', exec:() => { this._exec('removeFormat'); this._exec('unlink'); } },
      ],
    };

    this._btnMap = {};
    let firstGroup = true;

    this.toolbar.forEach(groupKey => {
      const group = GROUPS[groupKey];
      if (!group) return;
      if (!firstGroup) {
        const sep = document.createElement('div');
        sep.className = 'mts-rte__sep';
        tb.appendChild(sep);
      }
      firstGroup = false;

      group.forEach(item => {
        if (item.type === 'select') {
          const sel = document.createElement('select');
          sel.className = 'mts-rte__select';
          sel.title = item.title;
          item.options.forEach(o => {
            const opt = document.createElement('option');
            opt.value = o.value; opt.textContent = o.label;
            sel.appendChild(opt);
          });
          sel.addEventListener('mousedown', () => this._saveRange());
          sel.addEventListener('change', () => {
            this._restoreRange();
            item.exec(sel.value);
            this._editor?.focus();
          });
          this._formatSelect = sel;
          tb.appendChild(sel);

        } else if (item.type === 'color' || item.type === 'bgcolor') {
          const wrap = document.createElement('div');
          wrap.className = 'mts-rte__color-wrap';
          wrap.title = item.title;
          const ico = document.createElement('div');
          ico.className = 'mts-rte__color-icon';
          ico.innerHTML = item.type === 'color'
            ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 8h4l-3.5 3 1.5 5-5-3-5 3 1.5-5L5 10h4z"/></svg>'
            : '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="3"/></svg>';
          const inp = document.createElement('input');
          inp.type = 'color'; inp.value = '#000000';
          inp.className = 'mts-rte__color-input';
          inp.addEventListener('input', () => { this._restoreRange(); item.exec(inp.value); });
          inp.addEventListener('mousedown', () => this._saveRange());
          wrap.appendChild(ico); wrap.appendChild(inp);
          tb.appendChild(wrap);

        } else {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'mts-rte__btn';
          btn.innerHTML = item.icon;
          btn.title = item.title || '';
          btn.addEventListener('mousedown', (e) => { e.preventDefault(); this._saveRange(); });
          btn.addEventListener('click', (e) => { e.preventDefault(); item.exec(); this._updateToolbarState(); this._updateStatus(); });
          if (item.cmd) this._btnMap[item.cmd] = btn;
          tb.appendChild(btn);
        }
      });
    });
  }

  _exec(cmd, value) {
    this._restoreRange();
    try { document.execCommand(cmd, false, value || null); } catch(e) {}
    this._editor?.focus();
    this._updateToolbarState();
    this._updateStatus();
    this._emit('change', { html: this._editor?.innerHTML || '' });
  }

  _saveRange() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && this._editor?.contains(sel.anchorNode)) {
      this._savedRange = sel.getRangeAt(0).cloneRange();
    }
  }

  _restoreRange() {
    if (!this._savedRange) return;
    const sel = window.getSelection();
    if (sel) { sel.removeAllRanges(); sel.addRange(this._savedRange); }
  }

  _updateToolbarState() {
    const STATES = ['bold','italic','underline','strikeThrough','insertUnorderedList','insertOrderedList','justifyLeft','justifyCenter','justifyRight','justifyFull'];
    STATES.forEach(cmd => {
      const btn = this._btnMap[cmd];
      if (btn) btn.classList.toggle('mts-rte__btn--active', document.queryCommandState(cmd));
    });
    if (this._formatSelect) {
      try { this._formatSelect.value = document.queryCommandValue('formatBlock') || 'div'; } catch(e) {}
    }
  }

  _updateStatus() {
    if (!this._statusEl) return;
    const text = this._editor?.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    this._statusEl.textContent = words + ' palabras · ' + chars + ' caracteres';
  }
  _emit(event, detail) {
    (this._listeners[event] || []).forEach(fn => fn({ type: event, detail }));
    this._el?.dispatchEvent(new CustomEvent(`mts:rte:${event}`, { bubbles: true, detail }));
  }
};
