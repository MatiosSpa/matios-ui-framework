/* ============================================================
   MATIOS UI — matios-ui-richeditor.js
   MTS.RichEditor — Editor de plantillas con merge fields
   Incluye merge fields opcionales via catalog.
   Progressive enhancement sobre <textarea>.
   getValue() / setValue() = string Handlebars crudo.
   0 dependencias. Sin iframe. Sin librerías externas.
   ============================================================ */
window.MTS = window.MTS || {};

MTS.RichEditor = class MtsRichEditor {
  /**
   * @param {string|Element} selector   <textarea> existente o selector CSS
   * @param {object} options
   * @param {Array}    options.catalog           [{token, label, group}]
   * @param {string}   options.placeholder       default: localized ('MTS.RichEditor'.placeholder)
   * @param {string}   options.searchPlaceholder default: localized ('MTS.RichEditor'.searchPlaceholder)
   * @param {string}   options.height            default: '260px'
   * @param {string}   options.minHeight         default: '120px'
   * @param {boolean}  options.disabled
   * @param {boolean}  options.readonly
   * @param {number}   options.maxLength         0 = sin límite
   * @param {Array}    options.toolbar           Grupos activos. Disponibles:
   *   'format' | 'font' | 'lists' | 'align' | 'insert' | 'source' | 'clean' | 'fields'
   *   default: ['format','lists','insert','fields']
   * @param {number[]} options.fontSizes         Tamaños en px. Requiere grupo 'font' en toolbar.
   *   Ej: [10, 12, 14, 16, 18, 24, 32]
   * @param {Array}    options.fonts             [{label, value}]. Requiere grupo 'font' en toolbar.
   *   Ej: [{ label:'Sans-serif', value:'Arial, sans-serif' }]
   * @param {object}   options.labels            Sobreescribe cualquier string de la UI.
   *   Claves: bold, italic, underline, strike, normal, heading1..3, quote, code,
   *   listUl, listOl, indent, outdent, alignLeft, alignCenter, alignRight, alignFull,
   *   linkInsert, linkRemove, textColor, bgColor, undo, redo, cleanFormat,
   *   htmlSource, fields, fontSize, fontFamily,
   *   urlLabel, urlApply, urlCancel, htmlApply, htmlCancel
   * @param {function} options.onChange          function(e) — e.detail.value = Handlebars string
   * @param {function} options.onFocus
   * @param {function} options.onBlur
   */
  constructor(selector, options) {
    options = options || {};

    /* ── Textarea fuente de verdad (progressive enhancement) ── */
    let el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    this._textarea = (el.tagName === 'TEXTAREA') ? el
      : (el.querySelector('textarea') || document.createElement('textarea'));
    if (!this._textarea.parentNode) el.appendChild(this._textarea);

    /* ── Labels — defaults desde el locale activo (MTS.RichEditor); consumidor sobreescribe lo que necesita ── */
    let t = this._t.bind(this);
    let DEF_LABELS = {
      bold: t('bold', 'Bold'), italic: t('italic', 'Italic'), underline: t('underline', 'Underline'), strike: t('strike', 'Strikethrough'),
      normal: t('normal', 'Normal'), heading1: t('heading1', 'Heading 1'), heading2: t('heading2', 'Heading 2'), heading3: t('heading3', 'Heading 3'),
      quote: t('quote', 'Quote'), code: t('code', 'Code'),
      listUl: t('listUl', 'Bullet list'), listOl: t('listOl', 'Numbered list'), indent: t('indent', 'Indent'), outdent: t('outdent', 'Outdent'),
      alignLeft: t('alignLeft', 'Align left'), alignCenter: t('alignCenter', 'Align center'), alignRight: t('alignRight', 'Align right'), alignFull: t('alignFull', 'Justify'),
      linkInsert: t('linkInsert', 'Insert link'), linkRemove: t('linkRemove', 'Remove link'),
      textColor: t('textColor', 'Text color'), bgColor: t('bgColor', 'Background color'),
      undo: t('undo', 'Undo'), redo: t('redo', 'Redo'), cleanFormat: t('cleanFormat', 'Clear format'),
      htmlSource: t('htmlSource', 'HTML'), fields: t('fields', 'Fields'), fontSize: t('fontSize', 'Size'), fontFamily: t('fontFamily', 'Font'),
      urlLabel: t('urlLabel', 'URL:'), urlApply: t('urlApply', 'Apply'), urlCancel: t('urlCancel', '×'),
      htmlApply: t('htmlApply', 'Apply'), htmlCancel: t('htmlCancel', '×'),
      table: t('table', 'Table'),
    };
    this.labels = Object.assign({}, DEF_LABELS, options.labels || {});

    /* ── Opciones ── */
    this._catalog          = options.catalog          || [];
    this.placeholder       = options.placeholder      || t('placeholder', 'Write your message...');
    this.searchPlaceholder = options.searchPlaceholder || t('searchPlaceholder', 'Search field...');
    this.height            = options.height            || '260px';
    this.minHeight         = options.minHeight         || '120px';
    this.disabled          = options.disabled          || false;
    this.readonly          = options.readonly          || false;
    this.maxLength         = options.maxLength         || 0;
    this.toolbar           = options.toolbar           || ['format', 'lists', 'insert', 'fields'];
    this.fontSizes         = options.fontSizes         || [];
    this.fonts             = options.fonts             || [];

    /* ── Estado interno ── */
    this._savedRange     = null;
    this._listeners      = {};
    this._customFields   = [];
    this._paletteOpen    = false;
    this._groupCollapsed = {};
    this._preview        = false;
    this._htmlMode       = false;

    if (options.onChange) this.on('change', options.onChange);
    if (options.onFocus)  this.on('focus',  options.onFocus);
    if (options.onBlur)   this.on('blur',   options.onBlur);

    /* Form-field contract */
    this.required     = options.required     != null ? options.required : false;
    this.errorMessage = options.errorMessage != null ? options.errorMessage : null;
    this._error       = '';
    let self = this;
    this.on('change', function () { if (self._error) self.clearError(); });

    this._build();
    if (this._el) { this._el._mtsInstance = this; }

    /* Cargar valor inicial del textarea */
    if (this._textarea.value) {
      this._setEditorContent(this._textarea.value);
    }
  }

  /* ══════════════════════════════════════════════════════════════
     API — mismos nombres que el RTE + extensiones de merge fields
  ══════════════════════════════════════════════════════════════ */

  getValue()  { return this._serialize(); }
  getText()   { return this._editor ? this._editor.innerText || '' : ''; }
  focus()     { if (this._editor) this._editor.focus(); return this; }
  clear()     { if (this._editor) { this._editor.innerHTML = ''; this._syncTextarea(); this._updateStatus(); } return this; }

  /* ── Form-field validation contract — required = has visible text ── */
  setError(msg) {
    this._error = msg || '';
    if (!this._errEl || !this._errEl.isConnected) {
      this._errEl = document.createElement('span');
      this._errEl.className = 'mts-form-error';
      if (this._el) { this._el.appendChild(this._errEl); }
    }
    this._errEl.textContent = this._error;
    this._errEl.style.display = this._error ? '' : 'none';
    return this;
  }
  clearError() { return this.setError(''); }
  validate() {
    let ok = !this.required || (this.getText() || '').trim() !== '';
    if (ok) { this.clearError(); } else { this.setError(this.errorMessage || this._t('required', 'This field is required')); }
    this._emit('validate', { valid: ok, errors: ok ? [] : [this._error] });
    return ok;
  }
  _t(key, fallback) {
    try { let ns = (window.MTS && MTS.getString) ? MTS.getString()['MTS.RichEditor'] : null; let m = ns && ns.messages; if (m && m[key] != null) { return m[key]; } } catch (e) {}
    return fallback;
  }

  setValue(html) {
    this._setEditorContent(html || '');
    this._syncTextarea();
    return this;
  }

  disable() {
    this.disabled = true;
    if (this._editor) this._editor.contentEditable = 'false';
    if (this._el) this._el.classList.add('mts-re--disabled');
    return this;
  }

  enable() {
    this.disabled = false;
    if (this._editor) this._editor.contentEditable = 'true';
    if (this._el) this._el.classList.remove('mts-re--disabled');
    return this;
  }

  destroy() {
    this._hideTablePicker();
    if (this._tablePickerEl && this._tablePickerEl.parentNode) {
      this._tablePickerEl.parentNode.removeChild(this._tablePickerEl);
    }
    if (this._el) this._el.remove();
    if (this._textarea) {
      this._textarea.hidden = false;
      this._textarea.value  = this.getValue();
    }
  }

  on(e, cb) {
    if (!this._listeners[e]) this._listeners[e] = [];
    this._listeners[e].push(cb);
    return this;
  }

  off(e, cb) {
    this._listeners[e] = (this._listeners[e] || []).filter(function(f) { return f !== cb; });
    return this;
  }

  /* ── Extensiones de merge fields ── */

  setCatalog(catalog) {
    this._catalog = Array.isArray(catalog) ? catalog : [];
    this._renderPaletteGroups(
      this._paletteSearchEl ? this._paletteSearchEl.value.trim().toLowerCase() : ''
    );
    return this;
  }

  insertField(token) {
    if (this.disabled || this.readonly || this._preview || this._htmlMode) return this;
    let self = this;
    if (this._editor) this._editor.focus();
    this._restoreRange();
    let chip = this._createChip(token);
    let sel  = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      let range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(chip);
      range.setStartAfter(chip);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      if (this._editor) this._editor.appendChild(chip);
    }
    if (!chip.nextSibling || chip.nextSibling.nodeType !== Node.TEXT_NODE) {
      chip.parentNode.insertBefore(document.createTextNode('​'), chip.nextSibling);
    }
    this._syncTextarea();
    this._updateStatus();
    this._emit('change', { value: this.getValue() });
    return this;
  }

  setPreview(bool) {
    this._preview = !!bool;
    if (!this._el) return this;
    this._el.classList.toggle('mts-re--preview', this._preview);
    if (this._editor) {
      this._editor.contentEditable = (this._preview || this.disabled || this.readonly) ? 'false' : 'true';
    }
    return this;
  }

  getCustomFields() {
    return this._customFields.slice();
  }

  /* ══════════════════════════════════════════════════════════════
     BUILD
  ══════════════════════════════════════════════════════════════ */

  _build() {
    let self = this;
    let L    = this.labels;

    /* Ocultar textarea original */
    this._textarea.hidden = true;

    /* Wrapper raíz */
    let el = document.createElement('div');
    el.className = 'mts-re';
    if (this.disabled) el.classList.add('mts-re--disabled');
    this._el = el;

    /* Toolbar */
    let tb = document.createElement('div');
    tb.className = 'mts-re__toolbar';
    this._buildToolbar(tb);
    this._toolbarEl = tb;
    el.appendChild(tb);

    /* Link bar */
    let linkBar = document.createElement('div');
    linkBar.className = 'mts-re__link-bar mts-re__link-bar--hidden';
    let linkLabel = document.createElement('span');
    linkLabel.className = 'mts-re__link-label';
    linkLabel.textContent = L.urlLabel;
    let linkInput = document.createElement('input');
    linkInput.type = 'text';
    linkInput.className = 'mts-re__link-input';
    linkInput.placeholder = this._t('urlPlaceholder', 'https://...');
    linkInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter')  { e.preventDefault(); self._applyLink(linkInput.value); }
      if (e.key === 'Escape') { self._hideLinkBar(); }
    });
    let linkApply = document.createElement('button');
    linkApply.type = 'button';
    linkApply.className = 'mts-re__btn mts-re__btn--sm mts-re__btn--primary';
    linkApply.textContent = L.urlApply;
    linkApply.addEventListener('mousedown', function(e) { e.preventDefault(); });
    linkApply.addEventListener('click', function() { self._applyLink(linkInput.value); });
    let linkCancel = document.createElement('button');
    linkCancel.type = 'button';
    linkCancel.className = 'mts-re__btn mts-re__btn--sm';
    linkCancel.textContent = L.urlCancel;
    linkCancel.addEventListener('mousedown', function(e) { e.preventDefault(); });
    linkCancel.addEventListener('click', function() { self._hideLinkBar(); });
    linkBar.appendChild(linkLabel);
    linkBar.appendChild(linkInput);
    linkBar.appendChild(linkApply);
    linkBar.appendChild(linkCancel);
    this._linkBarEl   = linkBar;
    this._linkInputEl = linkInput;
    el.appendChild(linkBar);

    /* HTML source panel */
    let htmlPanel = document.createElement('div');
    htmlPanel.className = 'mts-re__html-panel mts-re__html-panel--hidden';
    let htmlActions = document.createElement('div');
    htmlActions.className = 'mts-re__html-actions';
    let htmlActionsLabel = document.createElement('span');
    htmlActionsLabel.className = 'mts-re__html-actions-label';
    htmlActionsLabel.textContent = 'HTML';
    let htmlApplyBtn = document.createElement('button');
    htmlApplyBtn.type = 'button';
    htmlApplyBtn.className = 'mts-re__btn mts-re__btn--sm mts-re__btn--primary';
    htmlApplyBtn.textContent = L.htmlApply;
    htmlApplyBtn.addEventListener('mousedown', function(e) { e.preventDefault(); });
    htmlApplyBtn.addEventListener('click', function() { self._applyHtml(); });
    let htmlCancelBtn = document.createElement('button');
    htmlCancelBtn.type = 'button';
    htmlCancelBtn.className = 'mts-re__btn mts-re__btn--sm';
    htmlCancelBtn.textContent = L.htmlCancel;
    htmlCancelBtn.addEventListener('mousedown', function(e) { e.preventDefault(); });
    htmlCancelBtn.addEventListener('click', function() { self._hideHtmlPanel(); });
    htmlActions.appendChild(htmlActionsLabel);
    htmlActions.appendChild(htmlApplyBtn);
    htmlActions.appendChild(htmlCancelBtn);

    /* Host del CodeBlock editable (o textarea de fallback si MTS.CodeBlock no está disponible) */
    let htmlCbHost = document.createElement('div');
    htmlPanel.appendChild(htmlActions);
    htmlPanel.appendChild(htmlCbHost);
    this._htmlPanelEl  = htmlPanel;
    this._htmlCbHost   = htmlCbHost;
    this._htmlCodeBlock = null;
    this._htmlTextarea  = null; /* fallback */

    if (typeof MTS !== 'undefined' && MTS.CodeBlock) {
      this._htmlCodeBlock = new MTS.CodeBlock(htmlCbHost, {
        language: 'html',
        copyable: false,
        toolbar:  false,
        height:   this.height,
        editable: true,
      });
    } else {
      /* Fallback: textarea plano */
      let htmlTextarea = document.createElement('textarea');
      htmlTextarea.className = 'mts-re__html-textarea';
      htmlTextarea.spellcheck = false;
      htmlTextarea.style.height = this.height;
      htmlCbHost.appendChild(htmlTextarea);
      this._htmlTextarea = htmlTextarea;
    }

    el.appendChild(htmlPanel);

    /* Body: flex row */
    let body = document.createElement('div');
    body.className = 'mts-re__body';

    /* Editor wrap */
    let editorWrap = document.createElement('div');
    editorWrap.className = 'mts-re__editor-wrap';
    editorWrap.style.minHeight = this.minHeight;
    editorWrap.style.height    = this.height;

    let editor = document.createElement('div');
    editor.className = 'mts-re__editor';
    editor.contentEditable = (!this.disabled && !this.readonly) ? 'true' : 'false';
    editor.spellcheck = true;
    editor.setAttribute('data-placeholder', this.placeholder);
    if (!this._textarea.value) editor.classList.add('mts-re__editor--empty');

    editor.addEventListener('input', function() {
      editor.classList.toggle('mts-re__editor--empty', !editor.innerHTML || editor.innerHTML === '<br>');
      if (self.maxLength > 0 && self._editor.textContent.length > self.maxLength) {
        document.execCommand('undo');
      }
      self._syncTextarea();
      self._emit('change', { value: self.getValue() });
      self._updateToolbarState();
      self._updateStatus();
    });
    editor.addEventListener('paste',  function(e) { self._onPaste(e); });
    editor.addEventListener('keydown', function(e) { self._onKeydown(e); });
    editor.addEventListener('focus', function(e) {
      el.classList.add('mts-re--focused');
      self._emit('focus', { event: e });
    });
    editor.addEventListener('blur', function(e) {
      el.classList.remove('mts-re--focused');
      self._saveRange();
      self._emit('blur', { event: e });
    });
    editor.addEventListener('keyup',   function() { self._updateToolbarState(); });
    editor.addEventListener('mouseup', function() { self._updateToolbarState(); });

    this._editor    = editor;
    this._toolbarEl = tb;
    editorWrap.appendChild(editor);
    body.appendChild(editorWrap);
    body.appendChild(this._buildPalette());
    this._bodyEl = body;
    el.appendChild(body);

    /* Status bar */
    let status = document.createElement('div');
    status.className = 'mts-re__status';
    this._statusEl = status;
    el.appendChild(status);
    this._updateStatus();

    /* Insertar en el DOM después del textarea */
    this._textarea.parentNode.insertBefore(el, this._textarea.nextSibling);

    /* Table picker — appended a document.body para evitar clipping por overflow */
    this._tablePickerEl      = null;
    this._tablePickerOutside = null;
    document.body.appendChild(this._buildTablePicker());
  }

  /* ══════════════════════════════════════════════════════════════
     TOOLBAR
     Grupos disponibles: format | font | lists | align | insert | source | clean | fields
  ══════════════════════════════════════════════════════════════ */

  _buildToolbar(tb) {
    let self = this;
    let BTN  = MTS.RichEditor.ToolbarButton;

    this._btnMap           = {};
    this._formatSelect     = null;
    this._fontSizeSelect   = null;
    this._fontFamilySelect = null;

    let defs      = this._getButtonDefs();
    this._btnDefs = defs;
    let items     = this._normalizeToolbar(this.toolbar);

    items.forEach(function(item) {

      /* ── Separador ── */
      if (item === BTN.SEP) {
        let sep = document.createElement('div');
        sep.className = 'mts-re__sep';
        tb.appendChild(sep);
        return;
      }

      /* ── Normalizar a config object ── */
      let cfg;
      if (typeof item === 'string') {
        cfg = { button: item };
      } else if (item && item.button) {
        cfg = item;
      } else {
        return;
      }
      if (cfg.show === false) return;

      let def = defs[cfg.button];
      if (!def) return;

      let label   = cfg.label   || self.labels[def.labelKey] || '';
      let tooltip = cfg.tooltip || label;

      /* ── Select ── */
      if (def.type === 'select') {
        let opts = self._resolveSelectOpts(def, cfg);
        if (!opts.length) return;
        let sel = document.createElement('select');
        sel.className = 'mts-re__select';
        sel.title = tooltip;
        opts.forEach(function(o) {
          let opt = document.createElement('option');
          opt.value       = o.value;
          opt.textContent = o.label;
          sel.appendChild(opt);
        });
        sel.addEventListener('mousedown', function() { self._saveRange(); });
        sel.addEventListener('change', function() {
          self._restoreRange();
          def.exec(sel.value);
          if (!def.isFontSize) { if (self._editor) self._editor.focus(); }
        });
        if (def.isFormatBlock) self._formatSelect     = sel;
        if (def.isFontSize)    self._fontSizeSelect   = sel;
        if (def.isFontFamily)  self._fontFamilySelect = sel;
        tb.appendChild(sel);

      /* ── Color picker ── */
      } else if (def.type === 'color' || def.type === 'bgcolor') {
        let wrap = document.createElement('div');
        wrap.className = 'mts-re__color-wrap';
        wrap.title = tooltip;
        let ico = document.createElement('div');
        ico.className = 'mts-re__color-icon';
        ico.innerHTML = def.icon;
        let inp = document.createElement('input');
        inp.type  = 'color';
        inp.value = def.type === 'color' ? '#000000' : '#ffff00';
        inp.className = 'mts-re__color-input';
        inp.addEventListener('input',     function() { self._restoreRange(); def.exec(inp.value); });
        inp.addEventListener('mousedown', function() { self._saveRange(); });
        wrap.appendChild(ico);
        wrap.appendChild(inp);
        tb.appendChild(wrap);

      /* ── Botón ── */
      } else {
        let btn = document.createElement('button');
        btn.type      = 'button';
        btn.className = 'mts-re__btn';
        let iconSpan = document.createElement('span');
        iconSpan.className = 'mts-re__btn-icon';
        iconSpan.innerHTML = (typeof MTS !== 'undefined' && MTS.Sanitize)
          ? MTS.Sanitize.html(def.icon) : def.icon;
        btn.appendChild(iconSpan);
        if (def.hasLabel) {
          let lbl = document.createElement('span');
          lbl.className   = 'mts-re__btn-label';
          lbl.textContent = label;
          btn.appendChild(lbl);
        }
        btn.title = tooltip;
        btn.addEventListener('mousedown', function(e) { e.preventDefault(); self._saveRange(); });
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          def.exec(btn);
          self._updateToolbarState();
          self._updateStatus();
        });
        self._btnMap[cfg.button] = btn;
        tb.appendChild(btn);
      }
    });
  }

  /* Expande el array toolbar (legacy strings o constantes TB) a un array plano normalizado */
  _normalizeToolbar(raw) {
    let self = this;
    let BTN  = MTS.RichEditor.ToolbarButton;

    let LEGACY = {
      format: [BTN.BOLD, BTN.ITALIC, BTN.UNDERLINE, BTN.STRIKE, { button: BTN.FORMAT_BLOCK }],
      font: (function() {
        let acc = [];
        if (self.fontSizes && self.fontSizes.length) acc.push({ button: BTN.FONT_SIZE,   options: self.fontSizes });
        if (self.fonts     && self.fonts.length)     acc.push({ button: BTN.FONT_FAMILY, options: self.fonts });
        return acc;
      })(),
      lists:  [BTN.LIST_UL, BTN.LIST_OL, BTN.INDENT, BTN.OUTDENT],
      align:  [BTN.ALIGN_LEFT, BTN.ALIGN_CENTER, BTN.ALIGN_RIGHT, BTN.ALIGN_FULL],
      insert: [BTN.LINK, BTN.UNLINK, BTN.TEXT_COLOR, BTN.BG_COLOR],
      table:  [BTN.TABLE],
      source: [BTN.HTML_SOURCE],
      clean:  [BTN.UNDO, BTN.REDO, BTN.CLEAN_FORMAT],
      fields: [BTN.FIELDS],
    };

    let result      = [];
    let afterLegacy = false;

    raw.forEach(function(item) {
      if (typeof item === 'string' && LEGACY[item]) {
        /* Grupo legacy — SEP automático entre grupos consecutivos */
        if (afterLegacy && result.length && result[result.length - 1] !== BTN.SEP) {
          result.push(BTN.SEP);
        }
        LEGACY[item].forEach(function(btn) { result.push(btn); });
        afterLegacy = true;
      } else {
        afterLegacy = false;
        result.push(item);
      }
    });

    return result;
  }

  /* Resuelve las opciones finales para un select según su tipo */
  _resolveSelectOpts(def, cfg) {
    let rawOpts = cfg.options;

    if (def.isFormatBlock) {
      if (!rawOpts || !rawOpts.length) return def.defaultOptions;
      /* Slugs ('normal','h1',...) → filtrar defaultOptions */
      if (typeof rawOpts[0] === 'string') {
        return def.defaultOptions.filter(function(o) { return rawOpts.indexOf(o.slug) >= 0; });
      }
      return rawOpts; /* ya son {label, value} */
    }

    if (def.isFontSize) {
      if (!rawOpts || !rawOpts.length) return [];
      if (typeof rawOpts[0] === 'number') {
        return rawOpts.map(function(s) { return { label: s + 'px', value: s + 'px' }; });
      }
      return rawOpts;
    }

    /* fontFamily y cualquier otro select — {label, value} directo */
    return rawOpts || def.defaultOptions || [];
  }

  /* Registro completo de todos los botones disponibles en el toolbar */
  _getButtonDefs() {
    let self = this;
    let L    = this.labels;

    let SVG = {
      bold:      '<b>B</b>',
      italic:    '<i>I</i>',
      underline: '<u>U</u>',
      strike:    '<s>S</s>',
      listUl:    MTS.Icon.get('list-bullet'),
      listOl:    MTS.Icon.get('list-ordered'),
      indent:    MTS.Icon.get('indent'),
      outdent:   MTS.Icon.get('outdent'),
      alignLeft:   MTS.Icon.get('align-left'),
      alignCenter: MTS.Icon.get('align-center'),
      alignRight:  MTS.Icon.get('align-right'),
      alignFull:   MTS.Icon.get('align-justify'),
      link:      MTS.Icon.get('link'),
      unlink:    MTS.Icon.get('unlink'),
      textColor: MTS.Icon.get('text-color'),
      bgColor:   MTS.Icon.get('bg-color'),
      undo:      MTS.Icon.get('undo'),
      redo:      MTS.Icon.get('redo'),
      clean:     MTS.Icon.get('eraser'),
      source:    MTS.Icon.get('code'),
      fields:    MTS.Icon.get('grid'),
      table:     MTS.Icon.get('table'),
    };

    return {
      /* ── Formato ── */
      bold:        { type:'button', icon:SVG.bold,      labelKey:'bold',        cmdState:'bold',               exec:function()  { self._exec('bold'); } },
      italic:      { type:'button', icon:SVG.italic,    labelKey:'italic',      cmdState:'italic',             exec:function()  { self._exec('italic'); } },
      underline:   { type:'button', icon:SVG.underline, labelKey:'underline',   cmdState:'underline',          exec:function()  { self._exec('underline'); } },
      strike:      { type:'button', icon:SVG.strike,    labelKey:'strike',      cmdState:'strikeThrough',      exec:function()  { self._exec('strikeThrough'); } },
      formatBlock: {
        type:'select', isFormatBlock:true, labelKey:'normal',
        defaultOptions:[
          { slug:'normal',     value:'div',        label:L.normal   },
          { slug:'h1',         value:'h1',         label:L.heading1 },
          { slug:'h2',         value:'h2',         label:L.heading2 },
          { slug:'h3',         value:'h3',         label:L.heading3 },
          { slug:'blockquote', value:'blockquote', label:L.quote    },
          { slug:'pre',        value:'pre',        label:L.code     },
        ],
        exec:function(v) { self._exec('formatBlock', v); },
      },
      /* ── Fuente ── */
      fontSize:   { type:'select', isFontSize:true,   labelKey:'fontSize',   defaultOptions:[], exec:function(v) { self._execFontSize(v); } },
      fontFamily: { type:'select', isFontFamily:true, labelKey:'fontFamily', defaultOptions:[], exec:function(v) { self._execFontName(v); } },
      /* ── Listas ── */
      listUl:  { type:'button', icon:SVG.listUl,  labelKey:'listUl',  cmdState:'insertUnorderedList', exec:function() { self._exec('insertUnorderedList'); } },
      listOl:  { type:'button', icon:SVG.listOl,  labelKey:'listOl',  cmdState:'insertOrderedList',   exec:function() { self._exec('insertOrderedList'); } },
      indent:  { type:'button', icon:SVG.indent,  labelKey:'indent',                                  exec:function() { self._exec('indent'); } },
      outdent: { type:'button', icon:SVG.outdent, labelKey:'outdent',                                  exec:function() { self._exec('outdent'); } },
      /* ── Alineación ── */
      alignLeft:   { type:'button', icon:SVG.alignLeft,   labelKey:'alignLeft',   cmdState:'justifyLeft',   exec:function() { self._exec('justifyLeft'); } },
      alignCenter: { type:'button', icon:SVG.alignCenter, labelKey:'alignCenter', cmdState:'justifyCenter', exec:function() { self._exec('justifyCenter'); } },
      alignRight:  { type:'button', icon:SVG.alignRight,  labelKey:'alignRight',  cmdState:'justifyRight',  exec:function() { self._exec('justifyRight'); } },
      alignFull:   { type:'button', icon:SVG.alignFull,   labelKey:'alignFull',   cmdState:'justifyFull',   exec:function() { self._exec('justifyFull'); } },
      /* ── Insertar ── */
      link:      { type:'button', icon:SVG.link,      labelKey:'linkInsert',               exec:function()  { self._saveRange(); self._toggleLinkBar(); } },
      unlink:    { type:'button', icon:SVG.unlink,    labelKey:'linkRemove', cmdState:'unlink', exec:function() { self._exec('unlink'); } },
      textColor: { type:'color',  icon:SVG.textColor, labelKey:'textColor',                exec:function(v) { self._execForeColor(v); } },
      bgColor:   { type:'bgcolor',icon:SVG.bgColor,   labelKey:'bgColor',                  exec:function(v) { self._exec('hiliteColor', v); } },
      /* ── Tabla ── */
      table:     { type:'button', icon:SVG.table,  labelKey:'table',                       exec:function(btn) { self._saveRange(); self._toggleTablePicker(btn); } },
      /* ── HTML source ── */
      htmlSource:  { type:'button', icon:SVG.source, labelKey:'htmlSource', hasLabel:true, exec:function()    { self._toggleHtmlPanel(); } },
      /* ── Historial / limpieza ── */
      undo:        { type:'button', icon:SVG.undo,  labelKey:'undo',                       exec:function() { self._exec('undo'); } },
      redo:        { type:'button', icon:SVG.redo,  labelKey:'redo',                       exec:function() { self._exec('redo'); } },
      cleanFormat: { type:'button', icon:SVG.clean, labelKey:'cleanFormat',                exec:function() { self._exec('removeFormat'); self._exec('unlink'); } },
      /* ── Campos ── */
      fields:      { type:'button', icon:SVG.fields, labelKey:'fields', hasLabel:true,     exec:function() { self._togglePalette(); } },
    };
  }

  /* ══════════════════════════════════════════════════════════════
     MÉTODOS INTERNOS — idénticos al RTE
  ══════════════════════════════════════════════════════════════ */

  _exec(cmd, value) {
    if (this._htmlMode) return;
    this._restoreRange();
    try { document.execCommand(cmd, false, value || null); } catch(e) {}
    if (this._editor) this._editor.focus();
    this._updateToolbarState();
    this._updateStatus();
    this._syncTextarea();
    this._emit('change', { value: this.getValue() });
  }

  _saveRange() {
    let sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && this._editor && this._editor.contains(sel.anchorNode)) {
      this._savedRange = sel.getRangeAt(0).cloneRange();
    }
  }

  _restoreRange() {
    if (!this._savedRange) return;
    let sel = window.getSelection();
    if (sel) { sel.removeAllRanges(); sel.addRange(this._savedRange); }
  }

  _updateToolbarState() {
    let self = this;
    let BTN  = MTS.RichEditor.ToolbarButton;

    /* Botones con cmdState — iterar sobre _btnDefs y consultar queryCommandState */
    if (this._btnDefs) {
      Object.keys(this._btnDefs).forEach(function(key) {
        let def = self._btnDefs[key];
        if (!def.cmdState) return;
        let btn = self._btnMap[key];
        if (!btn) return;
        try { btn.classList.toggle('mts-re__btn--active', document.queryCommandState(def.cmdState)); } catch(e) {}
      });
    }

    /* Select de formato de bloque (párrafo / encabezados)
       queryCommandValue retorna 'p' para párrafos por defecto en la mayoría
       de browsers, pero nuestra opción Normal tiene value:'div'. Normalizamos. */
    if (this._formatSelect) {
      try {
        let fbVal = (document.queryCommandValue('formatBlock') || '').toLowerCase();
        if (fbVal === 'p' || fbVal === '') fbVal = 'div';
        this._formatSelect.value = fbVal;
      } catch(e) {}
    }
    /* Select de familia de fuente — compara primer token de la familia */
    if (this._fontFamilySelect) {
      try {
        let fontName = (document.queryCommandValue('fontName') || '').replace(/['"]/g, '').toLowerCase();
        let ffs = this._fontFamilySelect;
        let fMatched = false;
        Array.prototype.forEach.call(ffs.options, function(opt) {
          if (!opt.value) return;
          let first = opt.value.split(',')[0].trim().toLowerCase();
          if (first && first === fontName.split(',')[0].trim()) { ffs.value = opt.value; fMatched = true; }
        });
        if (!fMatched) ffs.value = ffs.options[0] ? ffs.options[0].value : '';
      } catch(e) {}
    }
    /* Select de tamaño de fuente — computed style del nodo bajo el cursor */
    if (this._fontSizeSelect) {
      try {
        let selObj = window.getSelection();
        let node   = selObj && selObj.focusNode;
        if (node && node.nodeType === 3) node = node.parentNode;
        let computedSize = (node && this._editor && this._editor.contains(node))
          ? window.getComputedStyle(node).fontSize : '';
        let fss      = this._fontSizeSelect;
        let sMatched = false;
        Array.prototype.forEach.call(fss.options, function(opt) {
          if (opt.value && opt.value === computedSize) { fss.value = opt.value; sMatched = true; }
        });
        if (!sMatched) fss.value = fss.options[0] ? fss.options[0].value : '';
      } catch(e) {}
    }
    /* Estado botón HTML source */
    let htmlBtn = this._btnMap[BTN.HTML_SOURCE];
    if (htmlBtn) htmlBtn.classList.toggle('mts-re__btn--active', this._htmlMode);
    /* Estado botón paleta / campos */
    let paletteBtn = this._btnMap[BTN.FIELDS];
    if (paletteBtn) paletteBtn.classList.toggle('mts-re__btn--active', this._paletteOpen);
  }

  _updateStatus() {
    if (!this._statusEl) return;
    let text  = this._editor ? this._editor.innerText || '' : '';
    let words = text.trim() ? text.trim().split(/\s+/).length : 0;
    let chars = text.length;
    this._statusEl.textContent = words + ' ' + this._t('words', 'words') + ' · ' + chars + ' ' + this._t('characters', 'characters');
  }

  _emit(event, detail) {
    let self = this;
    (this._listeners[event] || []).forEach(function(fn) { fn({ type: event, detail: detail }); });
    if (self._textarea) {
      self._textarea.dispatchEvent(new CustomEvent('mts:re:' + event, { bubbles: true, detail: detail }));
    }
  }

  /* ══════════════════════════════════════════════════════════════
     EXTENSIONES MFE
  ══════════════════════════════════════════════════════════════ */

  /* ── Link bar ── */

  _toggleLinkBar() {
    if (this._linkBarEl.classList.contains('mts-re__link-bar--hidden')) {
      this._showLinkBar();
    } else {
      this._hideLinkBar();
    }
  }

  _showLinkBar() {
    this._linkBarEl.classList.remove('mts-re__link-bar--hidden');
    this._linkInputEl.value = '';
    this._linkInputEl.focus();
  }

  _hideLinkBar() {
    this._linkBarEl.classList.add('mts-re__link-bar--hidden');
    if (this._editor) this._editor.focus();
  }

  _applyLink(url) {
    if (!url || !url.trim()) return;
    let safeUrl = (typeof MTS !== 'undefined' && MTS.Sanitize) ? MTS.Sanitize.url(url.trim()) : url.trim();
    if (!safeUrl) return;
    this._hideLinkBar();
    this._exec('createLink', safeUrl);
  }

  /* ── HTML source panel ── */

  _toggleHtmlPanel() {
    if (this._htmlMode) { this._hideHtmlPanel(); } else { this._showHtmlPanel(); }
  }

  _showHtmlPanel() {
    this._htmlMode = true;
    let html = this._prettyHtml(this._serialize());
    if (this._htmlCodeBlock) {
      this._htmlCodeBlock.setCode(html);
    } else if (this._htmlTextarea) {
      this._htmlTextarea.value = html;
    }
    this._htmlPanelEl.classList.remove('mts-re__html-panel--hidden');
    this._bodyEl.classList.add('mts-re__body--hidden');
    /* Atenuar toolbar y paleta — sus controles no aplican en modo HTML crudo */
    if (this._toolbarEl) this._toolbarEl.classList.add('mts-re__toolbar--html-mode');
    if (this._paletteEl) this._paletteEl.classList.add('mts-re__palette--html-mode');
    /* Foco al textarea del CodeBlock o al textarea de fallback */
    let focusTarget = (this._htmlCodeBlock && this._htmlCodeBlock._editTextarea)
      ? this._htmlCodeBlock._editTextarea
      : this._htmlTextarea;
    if (focusTarget) setTimeout(function() { focusTarget.focus(); }, 0);
    this._updateToolbarState();
  }

  _hideHtmlPanel() {
    this._htmlMode = false;
    this._htmlPanelEl.classList.add('mts-re__html-panel--hidden');
    this._bodyEl.classList.remove('mts-re__body--hidden');
    /* Restaurar toolbar y paleta */
    if (this._toolbarEl) this._toolbarEl.classList.remove('mts-re__toolbar--html-mode');
    if (this._paletteEl) this._paletteEl.classList.remove('mts-re__palette--html-mode');
    if (this._editor) this._editor.focus();
    this._updateToolbarState();
  }

  _applyHtml() {
    let raw = this._htmlCodeBlock
      ? this._htmlCodeBlock.getValue()
      : (this._htmlTextarea ? this._htmlTextarea.value : '');
    this._hideHtmlPanel();
    this.setValue(raw);
    this._emit('change', { value: this.getValue() });
  }

  /* ── Paleta toggle ── */

  _togglePalette() {
    this._paletteOpen = !this._paletteOpen;
    if (this._paletteEl) {
      this._paletteEl.classList.toggle('mts-re__palette--hidden', !this._paletteOpen);
    }
    let btn = this._btnMap[MTS.RichEditor.ToolbarButton.FIELDS];
    if (btn) btn.classList.toggle('mts-re__btn--active', this._paletteOpen);
  }

  /* ── Table picker ── */

  _buildTablePicker() {
    let self   = this;
    let COLS   = 8;
    let ROWS   = 8;
    let picker = document.createElement('div');
    picker.className = 'mts-re__table-picker mts-re__table-picker--hidden';

    let label = document.createElement('div');
    label.className = 'mts-re__table-picker-label';
    label.textContent = this.labels.table;
    picker.appendChild(label);

    let grid = document.createElement('div');
    grid.className = 'mts-re__table-picker-grid';
    picker.appendChild(grid);

    /* Construir celdas del grid */
    let cells = [];
    let r, c;
    for (r = 0; r < ROWS; r++) {
      cells[r] = [];
      for (c = 0; c < COLS; c++) {
        (function(row, col) {
          let cell = document.createElement('span');
          cell.className = 'mts-re__table-picker-cell';
          cell.addEventListener('mouseover', function() {
            let i, j;
            for (i = 0; i < ROWS; i++) {
              for (j = 0; j < COLS; j++) {
                cells[i][j].classList.toggle(
                  'mts-re__table-picker-cell--active', i <= row && j <= col
                );
              }
            }
            label.textContent = (col + 1) + ' × ' + (row + 1);
          });
          cell.addEventListener('click', function() {
            self._insertTable(row + 1, col + 1);
            self._hideTablePicker();
          });
          cells[row][col] = cell;
          grid.appendChild(cell);
        })(r, c);
      }
    }

    picker.addEventListener('mouseleave', function() {
      let i, j;
      for (i = 0; i < ROWS; i++) {
        for (j = 0; j < COLS; j++) {
          cells[i][j].classList.remove('mts-re__table-picker-cell--active');
        }
      }
      label.textContent = self.labels.table;
    });

    this._tablePickerEl = picker;
    return picker;
  }

  _toggleTablePicker(btn) {
    if (!this._tablePickerEl) return;
    if (this._tablePickerEl.classList.contains('mts-re__table-picker--hidden')) {
      this._showTablePicker(btn);
    } else {
      this._hideTablePicker();
    }
  }

  _showTablePicker(btn) {
    let self = this;
    let rect = btn.getBoundingClientRect();
    this._tablePickerEl.style.top  = (rect.bottom + 4) + 'px';
    this._tablePickerEl.style.left = rect.left + 'px';
    this._tablePickerEl.classList.remove('mts-re__table-picker--hidden');
    setTimeout(function() {
      self._tablePickerOutside = function(e) {
        if (!self._tablePickerEl.contains(e.target)) { self._hideTablePicker(); }
      };
      document.addEventListener('mousedown', self._tablePickerOutside);
    }, 0);
  }

  _hideTablePicker() {
    if (this._tablePickerEl) {
      this._tablePickerEl.classList.add('mts-re__table-picker--hidden');
    }
    if (this._tablePickerOutside) {
      document.removeEventListener('mousedown', this._tablePickerOutside);
      this._tablePickerOutside = null;
    }
  }

  _insertTable(rows, cols) {
    let html = '<table><tbody>';
    let r, c;
    for (r = 0; r < rows; r++) {
      html += '<tr>';
      for (c = 0; c < cols; c++) { html += '<td>&nbsp;</td>'; }
      html += '</tr>';
    }
    html += '</tbody></table><p><br></p>';
    this._restoreRange();
    try { document.execCommand('insertHTML', false, html); } catch(e) {}
    if (this._editor) this._editor.focus();
    this._syncTextarea();
    this._updateStatus();
    this._emit('change', { value: this.getValue() });
  }

  /* ── Font size — truco font[size="7"] → span[style] ── */

  _execFontSize(size) {
    this._restoreRange();
    document.execCommand('fontSize', false, '7');
    let fonts = this._editor ? this._editor.querySelectorAll('font[size="7"]') : [];
    Array.prototype.forEach.call(fonts, function(f) {
      let span = document.createElement('span');
      span.style.fontSize = size;
      while (f.firstChild) span.appendChild(f.firstChild);
      f.parentNode.replaceChild(span, f);
    });
    if (this._editor) this._editor.focus();
    this._updateStatus();
    this._syncTextarea();
    this._emit('change', { value: this.getValue() });
  }

  /* ── Font family — con styleWithCSS para output limpio ── */

  _execFontName(family) {
    this._restoreRange();
    try { document.execCommand('styleWithCSS', false, true); } catch(e) {}
    try { document.execCommand('fontName', false, family); } catch(e) {}
    try { document.execCommand('styleWithCSS', false, false); } catch(e) {}
    if (this._editor) this._editor.focus();
    this._updateStatus();
    this._syncTextarea();
    this._emit('change', { value: this.getValue() });
  }

  /* ── Color de texto — con styleWithCSS para evitar <font color="..."> ── */

  _execForeColor(color) {
    this._restoreRange();
    try { document.execCommand('styleWithCSS', false, true); } catch(e) {}
    try { document.execCommand('foreColor', false, color); } catch(e) {}
    try { document.execCommand('styleWithCSS', false, false); } catch(e) {}
    if (this._editor) this._editor.focus();
    this._updateStatus();
    this._syncTextarea();
    this._emit('change', { value: this.getValue() });
  }

  /* ── Paleta de campos ── */

  _buildPalette() {
    let self = this;
    let palette = document.createElement('aside');
    palette.className = 'mts-re__palette mts-re__palette--hidden';
    this._paletteEl = palette;

    let searchWrap = document.createElement('div');
    searchWrap.className = 'mts-re__palette-search';
    let searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'mts-re__palette-search-input';
    searchInput.placeholder = this.searchPlaceholder;
    searchInput.addEventListener('input', function() {
      self._renderPaletteGroups(searchInput.value.trim().toLowerCase());
    });
    searchInput.addEventListener('mousedown', function(e) { e.stopPropagation(); });
    this._paletteSearchEl = searchInput;
    searchWrap.appendChild(searchInput);
    palette.appendChild(searchWrap);

    let groupsWrap = document.createElement('div');
    groupsWrap.className = 'mts-re__palette-groups';
    this._paletteGroupsEl = groupsWrap;
    palette.appendChild(groupsWrap);

    let customSection = document.createElement('div');
    customSection.className = 'mts-re__palette-custom';
    this._paletteCustomEl = customSection;
    this._renderCustomSection();
    palette.appendChild(customSection);

    this._renderPaletteGroups('');
    return palette;
  }

  _renderPaletteGroups(filter) {
    let self = this;
    let wrap = this._paletteGroupsEl;
    while (wrap.firstChild) wrap.removeChild(wrap.firstChild);

    let groups     = {};
    let groupOrder = [];
    this._catalog.forEach(function(entry) {
      let g = entry.group || self._t('groupOther', 'Other');
      if (!groups[g]) { groups[g] = []; groupOrder.push(g); }
      groups[g].push(entry);
    });
    if (this._customFields.length > 0) {
      if (!groups['Custom']) groupOrder.push('Custom');
      groups['Custom'] = this._customFields.map(function(cf) {
        return { token: cf.token, label: cf.label, group: 'Custom' };
      });
    }

    let hasVisible = false;
    groupOrder.forEach(function(groupName) {
      let items = groups[groupName].filter(function(entry) {
        if (!filter) return true;
        return entry.label.toLowerCase().indexOf(filter) >= 0
            || entry.token.toLowerCase().indexOf(filter) >= 0;
      });
      if (!items.length) return;
      hasVisible = true;

      let collapsed = filter ? false : !!self._groupCollapsed[groupName];

      let groupEl = document.createElement('div');
      groupEl.className = 'mts-re__palette-group' + (collapsed ? ' mts-re__palette-group--collapsed' : '');

      let header = document.createElement('div');
      header.className = 'mts-re__palette-group-header';
      let headerText = document.createElement('span');
      headerText.textContent = groupName;
      let arrow = document.createElement('span');
      arrow.className = 'mts-re__palette-group-arrow';
      arrow.innerHTML = MTS.Icon.get('chevron-down');
      header.appendChild(headerText);
      header.appendChild(arrow);
      header.addEventListener('mousedown', function(e) { e.preventDefault(); });
      header.addEventListener('click', function() {
        if (filter) return;
        let isNowCollapsed = groupEl.classList.toggle('mts-re__palette-group--collapsed');
        self._groupCollapsed[groupName] = isNowCollapsed;
      });

      let body = document.createElement('div');
      body.className = 'mts-re__palette-group-body';

      items.forEach(function(entry) {
        let item = document.createElement('div');
        item.className = 'mts-re__palette-item';
        if (groupName === 'Custom') item.classList.add('mts-re__palette-item--custom');
        let labelEl = document.createElement('span');
        labelEl.className = 'mts-re__palette-item-label';
        labelEl.textContent = entry.label;
        let tokenEl = document.createElement('span');
        tokenEl.className = 'mts-re__palette-item-token';
        tokenEl.textContent = entry.token;
        item.appendChild(labelEl);
        item.appendChild(tokenEl);
        item.addEventListener('mousedown', function(e) { e.preventDefault(); self._saveRange(); });
        item.addEventListener('click', function() { self.insertField(entry.token); });
        body.appendChild(item);
      });

      groupEl.appendChild(header);
      groupEl.appendChild(body);
      wrap.appendChild(groupEl);
    });

    if (!hasVisible && filter) {
      let empty = document.createElement('div');
      empty.className = 'mts-re__palette-empty';
      empty.textContent = self._t('noResults', 'No results for "{q}"').replace('{q}', filter);
      wrap.appendChild(empty);
    }
  }

  _renderCustomSection() {
    let self = this;
    let wrap = this._paletteCustomEl;
    while (wrap.firstChild) wrap.removeChild(wrap.firstChild);

    let addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'mts-re__btn mts-re__btn--add-custom';
    addBtn.textContent = self._t('customFieldAdd', '+ Custom field');
    addBtn.addEventListener('mousedown', function(e) { e.preventDefault(); });
    addBtn.addEventListener('click', function() {
      form.classList.toggle('mts-re__custom-form--hidden');
    });
    wrap.appendChild(addBtn);

    let form = document.createElement('div');
    form.className = 'mts-re__custom-form mts-re__custom-form--hidden';

    function makeInput(ph) {
      let inp = document.createElement('input');
      inp.type = 'text';
      inp.placeholder = ph;
      inp.className = 'mts-re__custom-input';
      inp.addEventListener('mousedown', function(e) { e.stopPropagation(); });
      return inp;
    }

    let inpToken = makeInput(self._t('customFieldNamePh', 'Field name (e.g. customer)'));
    let inpLabel = makeInput(self._t('customFieldLabelPh', 'Visible label'));
    let inpDV    = makeInput(self._t('customFieldDefaultPh', 'Default value (optional)'));
    let actions  = document.createElement('div');
    actions.className = 'mts-re__custom-actions';

    let saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'mts-re__btn mts-re__btn--primary mts-re__btn--sm';
    saveBtn.textContent = self._t('customFieldSave', 'Add');
    saveBtn.addEventListener('mousedown', function(e) { e.preventDefault(); });
    saveBtn.addEventListener('click', function() {
      let raw   = inpToken.value.trim().replace(/[^a-zA-Z0-9_.]/g, '');
      let label = inpLabel.value.trim();
      if (!raw || !label) return;
      self._customFields.push({ token: '{{custom.' + raw + '}}', label: label, defaultValue: inpDV.value.trim() });
      self._renderPaletteGroups(self._paletteSearchEl ? self._paletteSearchEl.value.trim().toLowerCase() : '');
      inpToken.value = ''; inpLabel.value = ''; inpDV.value = '';
      form.classList.add('mts-re__custom-form--hidden');
    });

    let cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'mts-re__btn mts-re__btn--sm';
    cancelBtn.textContent = self._t('customFieldCancel', 'Cancel');
    cancelBtn.addEventListener('mousedown', function(e) { e.preventDefault(); });
    cancelBtn.addEventListener('click', function() { form.classList.add('mts-re__custom-form--hidden'); });

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);
    form.appendChild(inpToken);
    form.appendChild(inpLabel);
    form.appendChild(inpDV);
    form.appendChild(actions);
    wrap.appendChild(form);
  }

  /* ── Paste / Keydown ── */

  _onPaste(e) {
    e.preventDefault();
    let text = (e.clipboardData || window.clipboardData).getData('text/plain');
    if (!text) return;
    this._insertTextAtCursor(text);
  }

  _onKeydown(e) {
    if (e.key !== 'Backspace' && e.key !== 'Delete') return;
    let sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    let range = sel.getRangeAt(0);
    if (!range.collapsed) return;

    if (e.key === 'Backspace') {
      let node = range.startContainer;
      if (node.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
        let prev = node.previousSibling;
        if (prev && prev.classList && prev.classList.contains('mts-re__chip')) {
          prev.remove(); e.preventDefault();
          this._syncTextarea();
          this._emit('change', { value: this.getValue() });
        }
      }
    }
    if (e.key === 'Delete') {
      let nodeD = range.startContainer;
      if (nodeD.nodeType === Node.TEXT_NODE && range.startOffset === nodeD.nodeValue.length) {
        let next = nodeD.nextSibling;
        if (next && next.classList && next.classList.contains('mts-re__chip')) {
          next.remove(); e.preventDefault();
          this._syncTextarea();
          this._emit('change', { value: this.getValue() });
        }
      }
    }
  }

  /* ── Chips ── */

  _createChip(token) {
    let label    = this._findLabel(token);
    let isCustom = /^\{\{custom\./.test(token);
    let span = document.createElement('span');
    span.className = 'mts-re__chip' + (isCustom ? ' mts-re__chip--custom' : '');
    span.contentEditable = 'false';
    span.draggable = false;
    span.setAttribute('data-token', token);
    span.textContent = label;
    return span;
  }

  _findLabel(token) {
    let i;
    for (i = 0; i < this._catalog.length; i++) {
      if (this._catalog[i].token === token) return this._catalog[i].label;
    }
    for (i = 0; i < this._customFields.length; i++) {
      if (this._customFields[i].token === token) return this._customFields[i].label;
    }
    let m = token.match(/^\{\{(.+)\}\}$/);
    return m ? m[1] : token;
  }

  _tokenizeTextNodes(root) {
    let self    = this;
    let TOKEN_RE = /\{\{[^}]+\}\}/;
    let nodes   = [];
    let walker  = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        if (node.parentNode && node.parentNode.classList &&
            node.parentNode.classList.contains('mts-re__chip')) return NodeFilter.FILTER_REJECT;
        return TOKEN_RE.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function(tn) { self._tokenizeTextNode(tn); });
  }

  _tokenizeTextNode(textNode) {
    let self  = this;
    let parts = textNode.nodeValue.split(/(\{\{[^}]+\}\})/g);
    if (parts.length === 1) return;
    let frag = document.createDocumentFragment();
    parts.forEach(function(part) {
      if (/^\{\{[^}]+\}\}$/.test(part)) {
        frag.appendChild(self._createChip(part));
      } else if (part) {
        frag.appendChild(document.createTextNode(part));
      }
    });
    textNode.parentNode.replaceChild(frag, textNode);
  }

  /* ── Serialización ── */

  /* Formatea HTML usando el DOM como parser — más robusto que regex.
     El browser parsea el HTML en nodos; nosotros recorremos el árbol y
     reconstruimos la salida con indentación para elementos de bloque.
     Elementos inline (strong, em, a, span…) se preservan con outerHTML intacto. */
  _prettyHtml(html) {
    if (!html) return '';

    /* Elementos de bloque — generan salto de línea + indentación propia.
       HR es bloque void (sin hijos). IMG, BR, INPUT son inline/reemplazados
       → van por la rama outerHTML junto a STRONG, EM, A, SPAN, etc. */
    let BLOCK = { P:1, DIV:1, H1:1, H2:1, H3:1, H4:1, H5:1, H6:1,
                  UL:1, OL:1, LI:1, BLOCKQUOTE:1, PRE:1, HR:1,
                  TABLE:1, THEAD:1, TBODY:1, TFOOT:1, TR:1, TD:1, TH:1,
                  FIGURE:1, FIGCAPTION:1,
                  SECTION:1, ARTICLE:1, HEADER:1, FOOTER:1, MAIN:1, NAV:1 };
    let IND = '  ';

    function getAttrs(el) {
      let s = '';
      Array.prototype.forEach.call(el.attributes, function(a) {
        s += ' ' + a.name;
        if (a.value !== '') s += '="' + a.value + '"';
      });
      return s;
    }

    function walk(node, depth) {
      let out = '';
      let pad = IND.repeat(depth);
      Array.prototype.forEach.call(node.childNodes, function(child) {
        if (child.nodeType === 3) {           /* TEXT_NODE — inline, sin tocar */
          if (child.nodeValue.trim()) out += child.nodeValue;
        } else if (child.nodeType === 1) {    /* ELEMENT_NODE */
          let tag = child.tagName;
          if (BLOCK[tag]) {
            if (child.childNodes.length === 0) {
              /* Bloque vacío o void (ej. <hr>) */
              out += '\n' + pad + child.outerHTML;
            } else {
              let inner = walk(child, depth + 1);
              out += '\n' + pad
                   + '<' + tag.toLowerCase() + getAttrs(child) + '>'
                   + inner
                   + '</' + tag.toLowerCase() + '>';
            }
          } else {
            /* Inline (strong, em, a, span, img, br, etc.) — outerHTML intacto */
            out += child.outerHTML;
          }
        }
      });
      return out;
    }

    let wrap = document.createElement('div');
    wrap.innerHTML = html;
    return walk(wrap, 0).trim();
  }

  _serialize() {
    if (!this._editor) return '';
    let clone = this._editor.cloneNode(true);
    clone.querySelectorAll('.mts-re__chip').forEach(function(chip) {
      chip.replaceWith(document.createTextNode(chip.getAttribute('data-token') || ''));
    });
    return clone.innerHTML.replace(/​/g, '');
  }

  _setEditorContent(str) {
    if (!this._editor) return;
    let safe = (typeof MTS !== 'undefined' && MTS.Sanitize) ? MTS.Sanitize.html(str) : str;
    this._editor.innerHTML = safe;
    this._tokenizeTextNodes(this._editor);
    this._editor.classList.toggle('mts-re__editor--empty', !this._editor.textContent.trim());
    this._updateStatus();
  }

  _syncTextarea() {
    if (this._textarea) this._textarea.value = this.getValue();
  }

  _insertTextAtCursor(text) {
    let self  = this;
    let parts = text.split(/(\{\{[^}]+\}\})/g);
    let frag  = document.createDocumentFragment();
    parts.forEach(function(part) {
      if (/^\{\{[^}]+\}\}$/.test(part)) {
        frag.appendChild(self._createChip(part));
      } else if (part) {
        frag.appendChild(document.createTextNode(part));
      }
    });
    let sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      let range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(frag);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      if (this._editor) this._editor.appendChild(frag);
    }
    this._syncTextarea();
    this._updateStatus();
    this._emit('change', { value: this.getValue() });
  }
};

/* ══════════════════════════════════════════════════════════════
   MTS.RichEditor.Toolbar — constantes públicas de botones
   Uso: toolbar: [BTN.BOLD, BTN.ITALIC, BTN.SEP, { button: BTN.LINK, tooltip: 'Enlace' }]
   Compatible con el array legacy de grupos: ['format','lists',...]
══════════════════════════════════════════════════════════════ */
MTS.RichEditor.ToolbarButton = Object.freeze({
  /* Formato de texto */
  BOLD:         'bold',
  ITALIC:       'italic',
  UNDERLINE:    'underline',
  STRIKE:       'strike',
  FORMAT_BLOCK: 'formatBlock',
  /* Fuente */
  FONT_SIZE:    'fontSize',
  FONT_FAMILY:  'fontFamily',
  /* Listas */
  LIST_UL:      'listUl',
  LIST_OL:      'listOl',
  INDENT:       'indent',
  OUTDENT:      'outdent',
  /* Alineación */
  ALIGN_LEFT:   'alignLeft',
  ALIGN_CENTER: 'alignCenter',
  ALIGN_RIGHT:  'alignRight',
  ALIGN_FULL:   'alignFull',
  /* Insertar */
  LINK:         'link',
  UNLINK:       'unlink',
  TEXT_COLOR:   'textColor',
  BG_COLOR:     'bgColor',
  /* Tabla */
  TABLE:        'table',
  /* HTML fuente */
  HTML_SOURCE:  'htmlSource',
  /* Historial / limpieza */
  UNDO:         'undo',
  REDO:         'redo',
  CLEAN_FORMAT: 'cleanFormat',
  /* Merge fields */
  FIELDS:       'fields',
  /* Separador de sección */
  SEP:          '|',
});
