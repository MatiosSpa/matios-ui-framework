/* ============================================================
   MATIOS UI — MTS.MarkdownViewer
   Renders a remote .md file using the framework's prose styles.
   API: new MTS.MarkdownViewer(el, { url })
        instance.load(url)
        instance.destroy()
   ============================================================ */
(function (global) {
  'use strict';

  var _uid = 0;

  /* ── Constructor ─────────────────────────────────────────── */

  function MarkdownViewer(el, options) {
    this._el = typeof el === 'string' ? document.querySelector(el) : el;
    if (!this._el) { return; }

    options      = options || {};
    this._url    = options.url || null;
    this._id     = 'mts-mdv-' + (++_uid);

    this._build();

    if (this._url) { this._fetch(this._url); }
  }

  /* ── Build ───────────────────────────────────────────────── */

  MarkdownViewer.prototype._build = function () {
    this._el.classList.add('mts-mdv');
    this._contentEl = document.createElement('div');
    this._contentEl.className = 'mts-mdv__prose';
    this._el.appendChild(this._contentEl);
  };

  /* ── Fetch ───────────────────────────────────────────────── */

  MarkdownViewer.prototype._fetch = function (url) {
    var self = this;
    fetch(url)
      .then(function (res) {
        if (!res.ok) { throw new Error('HTTP ' + res.status); }
        return res.text();
      })
      .then(function (md) {
        self._render(self._parse(md));
      })
      .catch(function () {
        self._contentEl.innerHTML = '';
      });
  };

  /* ── Parser ──────────────────────────────────────────────── */

  MarkdownViewer.prototype._parse = function (md) {
    var blocks = [];

    var h = md
      .replace(/```(\w*)\n?([\s\S]*?)```/g, function (_, lang, code) {
        blocks.push({ lang: lang || 'text', code: code.trim() });
        return '\x00B' + (blocks.length - 1) + '\x00';
      })
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/^---+$/gm,         '<hr>')
      .replace(/^### (.+)$/gm,     '<h3>$1</h3>')
      .replace(/^## (.+)$/gm,      '<h2>$1</h2>')
      .replace(/^# (.+)$/gm,       '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g,   '<strong>$1</strong>')
      .replace(/`([^`]+)`/g,       '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/^&gt; (.+)$/gm,    '<blockquote>$1</blockquote>')
      .replace(/^\|(.+)\|\s*\n\|[-| :]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm, function (_, hdr, rows) {
        var ths = hdr.split('|')
          .filter(function (c) { return c.trim(); })
          .map(function (c) { return '<th>' + c.trim() + '</th>'; })
          .join('');
        var trs = rows.trim().split('\n')
          .map(function (r) {
            return '<tr>' + r.split('|')
              .filter(function (c) { return c.trim(); })
              .map(function (c) { return '<td>' + c.trim() + '</td>'; })
              .join('') + '</tr>';
          })
          .join('');
        return '<table><thead><tr>' + ths + '</tr></thead><tbody>' + trs + '</tbody></table>';
      })
      .replace(/^[\*\-] (.+)$/gm, '<li>$1</li>')
      .replace(/((?:<li>[^<]*<\/li>\n?)+)/g, '<ul>$1</ul>')
      .replace(/^(?!<)(.+)$/gm,   '<p>$1</p>');

    return { html: h, blocks: blocks };
  };

  /* ── Render ──────────────────────────────────────────────── */

  MarkdownViewer.prototype._render = function (parsed) {
    var self   = this;
    var blocks = parsed.blocks;
    var uid    = this._id;

    var h = parsed.html.replace(/\x00B(\d+)\x00/g, function (_, i) {
      return '<div id="' + uid + '-cb-' + i + '" class="mts-mdv__codeblock"></div>';
    });

    this._contentEl.innerHTML = h;

    blocks.forEach(function (block, i) {
      var el = document.getElementById(uid + '-cb-' + i);
      if (!el) { return; }
      if (window.MTS && MTS.CodeBlock) {
        new MTS.CodeBlock(el, { code: block.code, language: block.lang, copyable: true });
      } else {
        var pre  = document.createElement('pre');
        var code = document.createElement('code');
        code.textContent = block.code;
        pre.appendChild(code);
        el.appendChild(pre);
      }
    });
  };

  /* ── API pública ─────────────────────────────────────────── */

  MarkdownViewer.prototype.load = function (url) {
    this._url = url;
    this._fetch(url);
    return this;
  };

  MarkdownViewer.prototype.destroy = function () {
    this._el.innerHTML = '';
    this._el.classList.remove('mts-mdv');
  };

  /* ── Registro ────────────────────────────────────────────── */

  if (!global.MTS) { global.MTS = {}; }
  global.MTS.MarkdownViewer = MarkdownViewer;

}(window));
