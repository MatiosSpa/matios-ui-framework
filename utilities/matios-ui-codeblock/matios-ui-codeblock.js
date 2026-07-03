/* ============================================================
   MATIOS UI — matios-ui-codeblock.js
   MTS.CodeBlock — syntax highlighting para snippets reutilizables
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.CodeBlock = class MtsCodeBlock {
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!this._el) { console.error('[MTS.CodeBlock] Not found / No encontrado:', selector); return; }

    const ds = this._el.dataset || {};
    this.code = options.code ?? ds.code ?? '';
    this.language = options.language ?? ds.language ?? 'text';
    this.title = options.title ?? ds.title ?? '';
    this.subtitle = options.subtitle ?? ds.subtitle ?? '';
    this.copyable = options.copyable ?? ds.copyable !== 'false';
    this.toolbar  = options.toolbar  ?? ds.toolbar  !== 'false';
    this.wrap = options.wrap ?? ds.wrap === 'true';
    this.height = options.height ?? ds.height ?? 'auto';

    let _copy = options.copy || {};
    this.copy = {
      iconOnly:     _copy.iconOnly     !== undefined ? _copy.iconOnly     : true,
      label:        _copy.label        !== undefined ? _copy.label        : this._t('copy', 'Copiar'),
      labelCopied:  _copy.labelCopied  !== undefined ? _copy.labelCopied  : this._t('copied', '¡Copiado!'),
      tooltip:      _copy.tooltip      !== undefined ? _copy.tooltip      : this._t('tooltip', 'Copiar'),
    };

    this._copyInstance = null;
    this._fallbackCopyHandler = null;
    this._copyTimer = null;
    this._build();
  }

  _t(key, fallback) {
    let table = (window.MTS && typeof MTS.getString === 'function') ? (MTS.getString()['MTS.CodeBlock'] || {}) : {};
    return table[key] !== undefined ? table[key] : fallback;
  }

  setCode(code) {
    this.code = code ?? '';
    this._renderCode();
    this._syncCopyButton();
    return this;
  }

  setLanguage(language) {
    this.language = language || 'text';
    this._renderToolbar();
    this._renderCode();
    return this;
  }

  setTitle(title, subtitle) {
    this.title = title ?? '';
    if (subtitle !== undefined) this.subtitle = subtitle ?? '';
    this._renderToolbar();
    return this;
  }

  destroy() {
    clearTimeout(this._copyTimer);
    if (this._copyInstance && typeof this._copyInstance.destroy === 'function') this._copyInstance.destroy();
    this._el.innerHTML = '';
  }

  _build() {
    this._el.innerHTML = '';
    this._el.classList.add('mts-codeblock');
    this._el.classList.toggle('mts-codeblock--wrap', !!this.wrap);
    this._el.style.setProperty('--mts-codeblock-height', this.height || 'auto');

    this._toolbar = document.createElement('div');
    this._toolbar.className = 'mts-codeblock__toolbar';
    this._el.appendChild(this._toolbar);

    this._pre = document.createElement('pre');
    this._pre.className = 'mts-codeblock__pre';
    this._el.appendChild(this._pre);

    this._codeEl = document.createElement('code');
    this._codeEl.className = 'mts-codeblock__code';
    this._pre.appendChild(this._codeEl);

    this._renderToolbar();
    this._renderCode();
  }

  _renderToolbar() {
    this._toolbar.innerHTML = '';

    const meta = document.createElement('div');
    meta.className = 'mts-codeblock__meta';

    if (this.title) {
      const title = document.createElement('p');
      title.className = 'mts-codeblock__title';
      title.textContent = this.title;
      meta.appendChild(title);
    }

    if (this.subtitle) {
      const subtitle = document.createElement('p');
      subtitle.className = 'mts-codeblock__subtitle';
      subtitle.textContent = this.subtitle;
      meta.appendChild(subtitle);
    }

    const shouldShowMeta = !!(this.title || this.subtitle);
    if (shouldShowMeta) this._toolbar.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'mts-codeblock__actions';

    let langHost = document.createElement('span');
    langHost.className = 'mts-codeblock__lang';
    let langText = MTS.CodeBlock.normalizeLanguage(this.language).toUpperCase();
    if (window.MTS && MTS.Badge) {
      new MTS.Badge(langHost, { label: langText, variant: 'secondary', size: 'sm' });
    } else {
      langHost.textContent = langText;
    }
    actions.appendChild(langHost);

    if (this.copyable) {
      const copyHost = document.createElement('button');
      copyHost.type = 'button';
      copyHost.className = 'mts-btn mts-btn--secondary mts-btn--sm';
      if (this.copy.tooltip) copyHost.title = this.copy.tooltip;
      actions.appendChild(copyHost);
      this._copyHost = copyHost;
    } else {
      this._copyHost = null;
      this._copyInstance = null;
    }

    this._toolbar.appendChild(actions);
    this._toolbar.hidden = !this.toolbar || !(shouldShowMeta || this.copyable || this.language);
    this._syncCopyButton();
  }

  _syncCopyButton() {
    if (!this._copyHost) return;
    if (this._fallbackCopyHandler) {
      this._copyHost.removeEventListener('click', this._fallbackCopyHandler);
      this._fallbackCopyHandler = null;
    }

    if (this._copyInstance && typeof this._copyInstance.setText === 'function') {
      this._copyInstance.setText(this.code);
      return;
    }

    if (window.MTS && MTS.CopyButton) {
      this._copyInstance = new MTS.CopyButton(this._copyHost, {
        text:         this.code,
        variant:      'secondary',
        size:         'sm',
        iconOnly:     this.copy.iconOnly,
        label:        this.copy.label,
        labelCopied:  this.copy.labelCopied,
      });
      return;
    }

    this._copyHost.innerHTML = '<span class="mts-btn__label">' + MTS.CodeBlock._escapeHtml(this.copy.label) + '</span>';
    this._fallbackCopyHandler = () => {
      const text = this.code || '';
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => this._showFallbackCopied());
        return;
      }
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this._showFallbackCopied();
    };
    this._copyHost.addEventListener('click', this._fallbackCopyHandler);
  }

  _showFallbackCopied() {
    this._copyHost.innerHTML = '<span class="mts-btn__label">' + MTS.CodeBlock._escapeHtml(this.copy.labelCopied) + '</span>';
    clearTimeout(this._copyTimer);
    this._copyTimer = setTimeout(() => {
      if (this._copyHost) this._copyHost.innerHTML = '<span class="mts-btn__label">' + MTS.CodeBlock._escapeHtml(this.copy.label) + '</span>';
    }, 1800);
  }

  _renderCode() {
    this._codeEl.innerHTML = MTS.CodeBlock.highlight(this.code, this.language);
    this._codeEl.setAttribute('data-language', MTS.CodeBlock.normalizeLanguage(this.language));
  }

  static normalizeLanguage(language) {
    const value = String(language || 'text').toLowerCase();
    const aliases = {
      js: 'javascript',
      mjs: 'javascript',
      cjs: 'javascript',
      ts: 'typescript',
      jsx: 'jsx',
      tsx: 'tsx',
      markup: 'html',
      svg: 'html',
      xaml: 'xml',
      csproj: 'xml',
      config: 'xml',
      scss: 'css',
      less: 'css',
      yml: 'yaml',
      sh: 'bash',
      shell: 'bash',
      zsh: 'bash',
      ps1: 'powershell',
      psm1: 'powershell',
      pwsh: 'powershell',
      cs: 'csharp',
      'c#': 'csharp'
    };
    return aliases[value] || value;
  }

  static highlight(code, language) {
    const lang = MTS.CodeBlock.normalizeLanguage(language);
    const value = String(code ?? '');
    if (!value) return '';

    switch (lang) {
      case 'html':
      case 'xml':
        return MTS.CodeBlock._highlightMarkup(value);
      case 'css':
        return MTS.CodeBlock._highlightCss(value);
      case 'javascript':
      case 'typescript':
      case 'jsx':
      case 'tsx':
        return MTS.CodeBlock._highlightScript(value, lang);
      case 'csharp':
        return MTS.CodeBlock._highlightCSharp(value);
      case 'java':
        return MTS.CodeBlock._highlightJava(value);
      case 'json':
        return MTS.CodeBlock._highlightJson(value);
      case 'sql':
        return MTS.CodeBlock._highlightSql(value);
      case 'bash':
        return MTS.CodeBlock._highlightBash(value);
      case 'powershell':
        return MTS.CodeBlock._highlightPowerShell(value);
      case 'yaml':
        return MTS.CodeBlock._highlightYaml(value);
      default:
        return MTS.CodeBlock._escapeHtml(value);
    }
  }

  static _token(className, value) {
    return '<span class="mts-codeblock__token ' + className + '">' + value + '</span>';
  }

  static _escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  static _stash(text, regex, className) {
    MTS.__codeBlockStashSeq = (MTS.__codeBlockStashSeq || 0) + 1;
    const uid = MTS.__codeBlockStashSeq;
    const bucket = [];
    const replaced = text.replace(regex, function (match) {
      const key = '\u0000MTSCB' + uid + '_' + bucket.length + '\u0000';
      bucket.push(match);
      return key;
    });
    const tokenPattern = new RegExp('\\u0000MTSCB' + uid + '_(\\d+)\\u0000', 'g');
    return {
      text: replaced,
      restore(value) {
        return value.replace(tokenPattern, function (_, index) {
          return MTS.CodeBlock._token(className, bucket[+index] || '');
        });
      },
      map(value, callback) {
        return value.replace(tokenPattern, function (_, index) {
          return callback(bucket[+index] || '', +index);
        });
      }
    };
  }

  static _stashWords(text, words, className, flags) {
    if (!Array.isArray(words) || !words.length) {
      return { text: text, restore(value) { return value; } };
    }
    const escaped = words.map(function (word) {
      return String(word).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    });
    return MTS.CodeBlock._stash(text, new RegExp('\\b(' + escaped.join('|') + ')\\b', flags || 'g'), className);
  }

  static _highlightMarkup(code) {
    let text = MTS.CodeBlock._escapeHtml(code);
    const comments = MTS.CodeBlock._stash(text, /(&lt;!--[\s\S]*?--&gt;)/g, 'mts-codeblock__token--comment');
    text = comments.text;
    const metas = MTS.CodeBlock._stash(text, /(&lt;!DOCTYPE[\s\S]*?&gt;|&lt;\?xml[\s\S]*?\?&gt;)/gi, 'mts-codeblock__token--meta');
    text = metas.text;

    text = text.replace(/(&lt;\/?)([A-Za-z][\w:-]*)([\s\S]*?)(\/?&gt;)/g, function (_, open, tag, attrs, close) {
      return MTS.CodeBlock._token('mts-codeblock__token--punct', open) +
        MTS.CodeBlock._token('mts-codeblock__token--tag', tag) +
        MTS.CodeBlock._highlightMarkupAttrs(attrs) +
        MTS.CodeBlock._token('mts-codeblock__token--punct', close);
    });

    text = metas.restore(text);
    text = comments.restore(text);
    return text;
  }

  static _highlightMarkupAttrs(attrs) {
    if (!attrs) return '';
    let text = attrs;
    const strings = MTS.CodeBlock._stash(text, /("(?:\\.|[^"])*"|'(?:\\.|[^'])*')/g, 'mts-codeblock__token--string');
    text = strings.text;
    text = text.replace(/([:@A-Za-z_][-:.A-Za-z0-9_]*)(\s*=\s*)/g, function (_, name, op) {
      return MTS.CodeBlock._token('mts-codeblock__token--attr', name) +
        MTS.CodeBlock._token('mts-codeblock__token--operator', op);
    });
    return strings.restore(text);
  }

  static _highlightCss(code) {
    let text = MTS.CodeBlock._escapeHtml(code);
    const comments = MTS.CodeBlock._stash(text, /(\/\*[\s\S]*?\*\/)/g, 'mts-codeblock__token--comment');
    text = comments.text;
    const strings = MTS.CodeBlock._stash(text, /("(?:\\.|[^"])*"|'(?:\\.|[^'])*')/g, 'mts-codeblock__token--string');
    text = strings.text;
    const atRules = MTS.CodeBlock._stash(text, /(@[A-Za-z-]+)/g, 'mts-codeblock__token--keyword');
    text = atRules.text;
    const selectors = MTS.CodeBlock._stash(text, /(^|[\}\n])(\s*[^@}{\n][^{]*?)(\s*\{)/g, 'mts-codeblock__token--selector');
    text = selectors.map(selectors.text, function (original) {
      const match = original.match(/(^|[\}\n])([\s\S]*?)(\s*\{)$/);
      if (!match) return original;
      return match[1] + MTS.CodeBlock._token('mts-codeblock__token--selector', match[2]) +
        MTS.CodeBlock._token('mts-codeblock__token--punct', match[3]);
    });
    const properties = MTS.CodeBlock._stash(text, /([A-Za-z-]+)(\s*:)/g, 'mts-codeblock__token--property');
    text = properties.map(properties.text, function (original) {
      const match = original.match(/^([A-Za-z-]+)(\s*:)$/);
      if (!match) return original;
      return MTS.CodeBlock._token('mts-codeblock__token--property', match[1]) +
        MTS.CodeBlock._token('mts-codeblock__token--operator', match[2]);
    });
    const colors = MTS.CodeBlock._stash(text, /(#[0-9a-fA-F]{3,8})\b/g, 'mts-codeblock__token--number');
    text = colors.text;
    const numbers = MTS.CodeBlock._stash(text, /\b(\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|fr|ms|s|deg)?)\b/g, 'mts-codeblock__token--number');
    text = numbers.text;
    const important = MTS.CodeBlock._stash(text, /\b(!important)\b/g, 'mts-codeblock__token--keyword');
    text = important.text;

    text = important.restore(text);
    text = numbers.restore(text);
    text = colors.restore(text);
    text = properties.restore(text);
    text = selectors.restore(text);
    text = atRules.restore(text);
    text = strings.restore(text);
    text = comments.restore(text);
    return text;
  }

  static _highlightScript(code, lang) {
    const keywords = [
      'async', 'await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
      'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'for', 'from', 'function',
      'if', 'import', 'in', 'instanceof', 'let', 'new', 'null', 'return', 'super', 'switch', 'this',
      'throw', 'true', 'try', 'typeof', 'undefined', 'var', 'while', 'yield'
    ];
    const types = ['Array', 'Boolean', 'Date', 'Map', 'Number', 'Object', 'Promise', 'Record', 'Set', 'String'];
    if (lang !== 'javascript') {
      keywords.push('abstract', 'as', 'enum', 'implements', 'interface', 'namespace', 'private', 'protected', 'public', 'readonly', 'type');
      types.push('any', 'unknown', 'never', 'void', 'string', 'number', 'boolean');
    }
    return MTS.CodeBlock._highlightScriptLike(code, keywords, types, true);
  }

  static _highlightCSharp(code) {
    return MTS.CodeBlock._highlightScriptLike(
      code,
      ['abstract', 'as', 'async', 'await', 'base', 'bool', 'break', 'case', 'catch', 'class', 'const', 'continue', 'decimal', 'default', 'do', 'else', 'enum', 'event', 'false', 'finally', 'for', 'foreach', 'get', 'if', 'in', 'interface', 'internal', 'is', 'lock', 'namespace', 'new', 'null', 'override', 'private', 'protected', 'public', 'readonly', 'record', 'return', 'sealed', 'set', 'static', 'struct', 'switch', 'this', 'throw', 'true', 'try', 'using', 'var', 'virtual', 'void', 'while'],
      ['Action', 'CancellationToken', 'DateTime', 'Guid', 'HttpClient', 'IEnumerable', 'IServiceCollection', 'List', 'Task', 'ValueTask', 'int', 'long', 'string'],
      false,
      {
        stringPattern: /(@?"(?:[^"]|"")*"|\$@"(?:[^"]|"")*"|@"(?:[^"]|"")*"|\$"(?:\\.|[^"])*"|'(?:\\.|[^'])*')/g,
        annotationPattern: /(\[[A-Za-z_][\w.()",\s]*\])/g
      }
    );
  }

  static _highlightJava(code) {
    return MTS.CodeBlock._highlightScriptLike(
      code,
      ['abstract', 'assert', 'boolean', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default', 'do', 'else', 'enum', 'extends', 'false', 'final', 'finally', 'for', 'if', 'implements', 'import', 'instanceof', 'interface', 'new', 'null', 'package', 'private', 'protected', 'public', 'record', 'return', 'static', 'super', 'switch', 'this', 'throw', 'throws', 'true', 'try', 'void', 'while'],
      ['ArrayList', 'BigDecimal', 'HashMap', 'Integer', 'List', 'Map', 'Optional', 'ResponseEntity', 'String'],
      false,
      {
        annotationPattern: /(@[A-Za-z_][\w.]*)/g
      }
    );
  }

  static _highlightScriptLike(code, keywords, types, allowDecorators, options) {
    const cfg = options || {};
    let text = MTS.CodeBlock._escapeHtml(code);
    const comments = MTS.CodeBlock._stash(text, /(\/\*[\s\S]*?\*\/|(^|[^:])\/\/.*$)/gm, 'mts-codeblock__token--comment');
    text = comments.text;
    const strings = MTS.CodeBlock._stash(text, cfg.stringPattern || /(`(?:\\[\s\S]|[^`])*`|"(?:\\.|[^"])*"|'(?:\\.|[^'])*')/g, 'mts-codeblock__token--string');
    text = strings.text;
    const annotations = cfg.annotationPattern ? MTS.CodeBlock._stash(text, cfg.annotationPattern, 'mts-codeblock__token--annotation') : null;
    if (annotations) text = annotations.text;
    const decorators = allowDecorators ? MTS.CodeBlock._stash(text, /(@[A-Za-z_$][\w$]*)/g, 'mts-codeblock__token--annotation') : null;
    if (decorators) text = decorators.text;
    const keywordMarks = MTS.CodeBlock._stashWords(text, keywords, 'mts-codeblock__token--keyword');
    text = keywordMarks.text;
    const typeMarks = MTS.CodeBlock._stashWords(text, types, 'mts-codeblock__token--type');
    text = typeMarks.text;
    const numbers = MTS.CodeBlock._stash(text, /\b(\d+(?:\.\d+)?)\b/g, 'mts-codeblock__token--number');
    text = numbers.text;
    const functions = MTS.CodeBlock._stash(text, /\b([A-Za-z_$][\w$]*)(?=\s*\()/g, 'mts-codeblock__token--fn');
    text = functions.text;

    text = functions.restore(text);
    text = numbers.restore(text);
    text = typeMarks.restore(text);
    text = keywordMarks.restore(text);
    if (decorators) text = decorators.restore(text);
    if (annotations) text = annotations.restore(text);
    text = strings.restore(text);
    text = comments.restore(text);
    return text;
  }

  static _highlightJson(code) {
    let text = MTS.CodeBlock._escapeHtml(code);
    const keys = MTS.CodeBlock._stash(text, /("(?:\\.|[^"])*")(\s*:)/g, 'mts-codeblock__token--property');
    text = keys.map(keys.text, function (original) {
      const match = original.match(/^("(?:\\.|[^"])*")(\s*:)$/);
      if (!match) return original;
      return MTS.CodeBlock._token('mts-codeblock__token--property', match[1]) +
        MTS.CodeBlock._token('mts-codeblock__token--operator', match[2]);
    });
    const stringValues = MTS.CodeBlock._stash(text, /:\s*("(?:\\.|[^"])*")/g, 'mts-codeblock__token--string');
    text = stringValues.map(stringValues.text, function (original) {
      const match = original.match(/^:\s*("(?:\\.|[^"])*")$/);
      if (!match) return original;
      return ': ' + MTS.CodeBlock._token('mts-codeblock__token--string', match[1]);
    });
    const booleans = MTS.CodeBlock._stash(text, /\b(true|false|null)\b/g, 'mts-codeblock__token--keyword');
    text = booleans.text;
    const numbers = MTS.CodeBlock._stash(text, /\b(-?\d+(?:\.\d+)?)\b/g, 'mts-codeblock__token--number');
    text = numbers.text;

    text = numbers.restore(text);
    text = booleans.restore(text);
    text = stringValues.restore(text);
    text = keys.restore(text);
    return text;
  }

  static _highlightSql(code) {
    let text = MTS.CodeBlock._escapeHtml(code);
    const comments = MTS.CodeBlock._stash(text, /(\/\*[\s\S]*?\*\/|--.*$)/gm, 'mts-codeblock__token--comment');
    text = comments.text;
    const strings = MTS.CodeBlock._stash(text, /('(?:''|[^'])*')/g, 'mts-codeblock__token--string');
    text = strings.text;
    const keywords = MTS.CodeBlock._stashWords(text, [
      'add', 'alter', 'and', 'as', 'asc', 'by', 'case', 'create', 'delete', 'desc', 'distinct', 'drop',
      'else', 'end', 'from', 'group', 'having', 'insert', 'into', 'join', 'left', 'limit', 'not', 'null',
      'offset', 'on', 'or', 'order', 'outer', 'primary', 'right', 'select', 'set', 'table', 'top', 'union',
      'update', 'values', 'when', 'where'
    ], 'mts-codeblock__token--keyword');
    text = keywords.text;
    const functions = MTS.CodeBlock._stash(text, /\b(COUNT|SUM|AVG|MIN|MAX|NOW|GETDATE|COALESCE)(?=\s*\()/gi, 'mts-codeblock__token--fn');
    text = functions.text;
    const numbers = MTS.CodeBlock._stash(text, /\b(-?\d+(?:\.\d+)?)\b/g, 'mts-codeblock__token--number');
    text = numbers.text;

    text = numbers.restore(text);
    text = functions.restore(text);
    text = keywords.restore(text);
    text = strings.restore(text);
    text = comments.restore(text);
    return text;
  }

  static _highlightBash(code) {
    let text = MTS.CodeBlock._escapeHtml(code);
    const comments = MTS.CodeBlock._stash(text, /(^\s*#.*$)/gm, 'mts-codeblock__token--comment');
    text = comments.text;
    const strings = MTS.CodeBlock._stash(text, /("(?:\\.|[^"])*"|'(?:\\.|[^'])*')/g, 'mts-codeblock__token--string');
    text = strings.text;
    const keywords = MTS.CodeBlock._stashWords(text, ['case', 'do', 'done', 'elif', 'else', 'esac', 'export', 'fi', 'for', 'function', 'if', 'in', 'local', 'readonly', 'return', 'then', 'until', 'while'], 'mts-codeblock__token--keyword');
    text = keywords.text;
    const vars = MTS.CodeBlock._stash(text, /(\$[A-Za-z_][\w]*|\$\{[^}]+\})/g, 'mts-codeblock__token--var');
    text = vars.text;
    const numbers = MTS.CodeBlock._stash(text, /\b(\d+(?:\.\d+)?)\b/g, 'mts-codeblock__token--number');
    text = numbers.text;

    text = numbers.restore(text);
    text = vars.restore(text);
    text = keywords.restore(text);
    text = strings.restore(text);
    text = comments.restore(text);
    return text;
  }

  static _highlightPowerShell(code) {
    let text = MTS.CodeBlock._escapeHtml(code);
    const comments = MTS.CodeBlock._stash(text, /(^\s*#.*$|&lt;#[\s\S]*?#&gt;)/gm, 'mts-codeblock__token--comment');
    text = comments.text;
    const strings = MTS.CodeBlock._stash(text, /("(?:\\.|[^"])*"|'(?:\\.|[^'])*')/g, 'mts-codeblock__token--string');
    text = strings.text;
    const keywords = MTS.CodeBlock._stashWords(text, ['begin', 'break', 'catch', 'class', 'continue', 'do', 'else', 'end', 'elseif', 'filter', 'finally', 'for', 'foreach', 'function', 'if', 'in', 'param', 'process', 'return', 'switch', 'throw', 'trap', 'try', 'until', 'while'], 'mts-codeblock__token--keyword');
    text = keywords.text;
    const vars = MTS.CodeBlock._stash(text, /(\$[A-Za-z_][\w:.-]*|\$\{[^}]+\})/g, 'mts-codeblock__token--var');
    text = vars.text;
    const functions = MTS.CodeBlock._stash(text, /\b([A-Z][A-Za-z-]+)(?=\s)/g, 'mts-codeblock__token--fn');
    text = functions.text;
    const numbers = MTS.CodeBlock._stash(text, /\b(\d+(?:\.\d+)?)\b/g, 'mts-codeblock__token--number');
    text = numbers.text;

    text = numbers.restore(text);
    text = functions.restore(text);
    text = vars.restore(text);
    text = keywords.restore(text);
    text = strings.restore(text);
    text = comments.restore(text);
    return text;
  }

  static _highlightYaml(code) {
    let text = MTS.CodeBlock._escapeHtml(code);
    const comments = MTS.CodeBlock._stash(text, /(^\s*#.*$)/gm, 'mts-codeblock__token--comment');
    text = comments.text;
    const strings = MTS.CodeBlock._stash(text, /("(?:\\.|[^"])*"|'(?:\\.|[^'])*')/g, 'mts-codeblock__token--string');
    text = strings.text;
    const properties = MTS.CodeBlock._stash(text, /^(\s*[^:\n]+)(\s*:)/gm, 'mts-codeblock__token--property');
    text = properties.map(properties.text, function (original) {
      const match = original.match(/^(\s*[^:\n]+)(\s*:)$/);
      if (!match) return original;
      return MTS.CodeBlock._token('mts-codeblock__token--property', match[1]) +
        MTS.CodeBlock._token('mts-codeblock__token--operator', match[2]);
    });
    const booleans = MTS.CodeBlock._stash(text, /\b(true|false|null)\b/g, 'mts-codeblock__token--keyword');
    text = booleans.text;
    const numbers = MTS.CodeBlock._stash(text, /\b(-?\d+(?:\.\d+)?)\b/g, 'mts-codeblock__token--number');
    text = numbers.text;

    text = numbers.restore(text);
    text = booleans.restore(text);
    text = properties.restore(text);
    text = strings.restore(text);
    text = comments.restore(text);
    return text;
  }
};
