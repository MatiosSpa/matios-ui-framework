/* ============================================================
   MATIOS UI — demo-shared.js
   Shared functions for all component demo pages
   Funciones compartidas para todas las páginas de demo
   Version: 2.0.0
   ============================================================ */

/* ── Mode + Accent handling / Manejo de modo y acento ───── */

(function () {
  // Apply mode+accent from URL hash or parent frame on load
  // Aplicar modo+acento desde hash de URL o frame padre al cargar
  var hm = (location.hash || '').match(/mts-mode=([a-z-]+)/);
  var ha = (location.hash || '').match(/mts-accent=([a-z-]+)/);
  if (hm) document.documentElement.setAttribute('data-mts-mode', hm[1]);
  if (ha) document.documentElement.setAttribute('data-mts-accent', ha[1]);
  try {
    var p = window.parent;
    if (p && p !== window) {
      var pm = p.currentModeVal || p.document.documentElement.getAttribute('data-mts-mode');
      var pa = p.currentAccentVal || p.document.documentElement.getAttribute('data-mts-accent');
      if (pm) document.documentElement.setAttribute('data-mts-mode', pm);
      if (pa) document.documentElement.setAttribute('data-mts-accent', pa);
      else document.documentElement.removeAttribute('data-mts-accent');
    }
  } catch (e) {}
})();

// Set mode (dark | light) and notify parent frame
// Establece el modo y notifica al frame padre
function setMode(m) {
  document.documentElement.setAttribute('data-mts-mode', m);
  try {
    if (window.parent && window.parent !== window)
      window.parent.postMessage({ type: 'setMode', mode: m }, '*');
  } catch (e) {}
}

// Set accent (violet | olive | blue | null = default)
// Establece el acento o lo elimina si es null/vacío
function setAccent(a) {
  if (a) {
    document.documentElement.setAttribute('data-mts-accent', a);
  } else {
    document.documentElement.removeAttribute('data-mts-accent');
  }
  try {
    if (window.parent && window.parent !== window)
      window.parent.postMessage({ type: 'setAccent', accent: a || '' }, '*');
  } catch (e) {}
}

function mtsApplyThemeToFrame(frame, mode, accent) {
  if (!frame || !frame.contentWindow) return;
  try {
    var doc = frame.contentWindow.document;
    if (doc && doc.documentElement) {
      if (mode) doc.documentElement.setAttribute('data-mts-mode', mode);
      if (accent) doc.documentElement.setAttribute('data-mts-accent', accent);
      else doc.documentElement.removeAttribute('data-mts-accent');
    }
    frame.contentWindow.postMessage({ type: 'setMode', mode: mode }, '*');
    frame.contentWindow.postMessage({ type: 'setAccent', accent: accent || '' }, '*');
  } catch (err) {}
}

function mtsSyncNestedLauncherFrames() {
  var mode = document.documentElement.getAttribute('data-mts-mode') || 'dark';
  var accent = document.documentElement.getAttribute('data-mts-accent') || '';
  var frames = document.querySelectorAll('.demo-launcher__iframe');
  Array.prototype.forEach.call(frames, function (frame) {
    if (!frame) return;
    var src = frame.getAttribute('src') || '';
    if (!src || src === 'about:blank') return;
    mtsApplyThemeToFrame(frame, mode, accent);
  });
}

// Listen for mode/accent changes from parent / Escucha cambios desde el padre
window.addEventListener('message', function (e) {
  if (!e.data) return;
  if (e.data.type === 'setMode')
    document.documentElement.setAttribute('data-mts-mode', e.data.mode);
  if (e.data.type === 'setAccent') {
    if (e.data.accent)
      document.documentElement.setAttribute('data-mts-accent', e.data.accent);
    else
      document.documentElement.removeAttribute('data-mts-accent');
  }
  if (e.data.type === 'setMode' || e.data.type === 'setAccent') {
    mtsSyncNestedLauncherFrames();
  }
});

// Hide theme switcher when inside an iframe / Ocultar el switcher dentro de un iframe
document.addEventListener('DOMContentLoaded', function () {
  if (window !== window.top) {
    var ts = document.querySelector('.demo-theme');
    if (ts) ts.style.display = 'none';
  }
});

/* ── Code tabs / Pestañas de código ─────────────────────── */

// Switch between HTML and JavaScript tabs
// Alterna entre las pestañas HTML y JavaScript
function switchTab(btn, showId, hideId) {
  btn.parentElement.querySelectorAll('.code-tab').forEach(function (t) {
    t.classList.remove('active');
  });
  btn.classList.add('active');
  document.getElementById(showId).classList.add('active');
  document.getElementById(hideId).classList.remove('active');
}

/* ── Legacy code toggle / Toggle de código legado ───────── */

// Toggle visibility of a code block (older demos)
// Alterna la visibilidad de un bloque de código (demos anteriores)
function toggleCode(id) {
  var el = document.getElementById(id);
  if (el) el.style.display = el.style.display === 'block' ? 'none' : 'block';
}

/* ── Docs panel / Panel de documentación ────────────────── */

// Toggle and lazy-load a markdown docs panel
// Alterna y carga de forma lazy un panel de documentación markdown
function toggleDocs(id, mdPath) {
  var panel = document.getElementById(id);
  if (!panel) return;
  panel.classList.toggle('open');
  if (!panel.classList.contains('open') || panel.dataset.loaded) return;
  panel.innerHTML = '<em style="color:var(--mts-text-muted);font-size:12px">Cargando...</em>';
  fetch(mdPath)
    .then(function (r) { return r.text(); })
    .then(function (md) { panel.innerHTML = mdToHtml(md); panel.dataset.loaded = '1'; })
    .catch(function () { panel.innerHTML = '<em>No se pudo cargar.</em>'; });
}

/* ── Markdown renderer / Renderizador de markdown ───────── */

// Minimal markdown → HTML renderer for docs panels
// Renderizador mínimo de markdown → HTML para paneles de docs
function mdToHtml(md) {
  if (!md) return '';
  var blocks = [];
  var h = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/```(\w*)\n?([\s\S]*?)```/g, function (_, l, c) {
      blocks.push({ lang: l || 'js', code: c.trim() });
      return '\x00B' + (blocks.length - 1) + '\x00';
    })
    .replace(/^---+$/gm, '<hr>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,  '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,   '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/^\|(.+)\|\s*\n\|[-| :]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm, function (_, hdr, rows) {
      function splitCells(line) {
        /* honor escaped pipes (\| = literal | in a GFM cell) — don't split on them */
        var cells = line.replace(/\\\|/g, '\x00').split('|');
        if (cells.length && !cells[0].trim()) cells.shift();
        if (cells.length && !cells[cells.length - 1].trim()) cells.pop();
        return cells.map(function (c) { return c.replace(/\x00/g, '|'); });
      }
      var ths = splitCells(hdr)
        .map(function (c) { return '<th>' + c.trim() + '</th>'; }).join('');
      var trs = rows.trim().split('\n').map(function (r) {
        return '<tr>' + splitCells(r)
          .map(function (c) { return '<td>' + c.trim() + '</td>'; }).join('') + '</tr>';
      }).join('');
      return '<table><thead><tr>' + ths + '</tr></thead><tbody>' + trs + '</tbody></table>';
    })
    .replace(/^[*\-] (.+)$/gm, '<li>$1</li>')
    .replace(/((?:<li>[\s\S]*?<\/li>\n?)+)/g, '<ul>$1</ul>')
    .replace(/^(?!<)(.+)$/gm, '<p>$1</p>');

  function escCode(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  return h.replace(/\x00B(\d+)\x00/g, function (_, i) {
    var b = blocks[+i];
    return '<pre><code class="lang-' + b.lang + '">' + escCode(b.code) + '</code></pre>';
  });
}

/* ── Output helpers / Helpers de output ─────────────────── */

// Show select/picker result in a result box
// Muestra el resultado de un select/picker en un result box
function showSelOutput(id, v, t) {
  var el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'block';
  el.innerHTML = '<b>value:</b> ' + JSON.stringify(v) + '&nbsp;&nbsp;<b>text:</b> ' + JSON.stringify(t);
}

/* ── Global code highlighting + copy experiment / Experimento global ─────── */
/* Appended at end on purpose: easy to remove if needed */
(function () {
  function log() { /* debug logging disabled */ }

  var sharedScript = document.currentScript || Array.prototype.find.call(document.scripts || [], function (s) {
    return s.src && /\/support\/demo-shared\.js(?:\?|#|$)/.test(s.src);
  });
  var sharedScriptUrl = sharedScript && sharedScript.src ? sharedScript.src : '';

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function detectPanelType(panel) {
    var id = (panel.id || '').toLowerCase();
    var labelled = (panel.getAttribute('aria-labelledby') || '').toLowerCase();
    var probe = id + ' ' + labelled;
    if (probe.indexOf('-preview') >= 0) return 'preview';
    if (probe.indexOf('-html') >= 0) return 'html';
    if (probe.indexOf('-js') >= 0 || probe.indexOf('javascript') >= 0) return 'js';
    return 'unknown';
  }

  function isPlaceholderCode(raw, type) {
    var value = String(raw || '').trim();
    if (!value) return true;
    if (/^undefined$/i.test(value)) return true;
    if (type === 'js' && /^(\/\/\s*)?(no\s+javascript|no\s+js|not\s+available)$/i.test(value)) return true;
    return false;
  }

  function hidePanelAndTab(panel, type, raw) {
    if (!panel || panel.dataset.mtsCodeHidden === '1') return;
    var tabId = panel.getAttribute('aria-labelledby') || '';
    var tab = tabId ? document.getElementById(tabId) : null;
    panel.hidden = true;
    panel.style.display = 'none';
    panel.dataset.mtsCodeHidden = '1';
    if (tab) {
      tab.hidden = true;
      tab.style.display = 'none';
      tab.setAttribute('aria-hidden', 'true');
      tab.dataset.mtsCodeHidden = '1';
    }
    log('panel:hidden', {
      id: panel.id || null,
      tabId: tabId || null,
      type: type,
      reason: 'placeholder-code',
      raw: String(raw || '').slice(0, 80)
    });
  }

  function findCodeTarget(panel) {
    return panel.querySelector('pre code, pre, code') || panel;
  }

  function highlightHtmlAttrs(attrs) {
    return attrs.replace(/([:@\w-]+)(\s*=\s*)("[^"]*"|'[^']*'|[^\s"'=<>`]+)/g,
      '<span class="mts-code__attr">$1</span><span class="mts-code__op">$2</span><span class="mts-code__string">$3</span>');
  }

  function highlightHtml(code) {
    var s = escHtml(code);
    s = s.replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="mts-code__comment">$1</span>');
    s = s.replace(/(&lt;!DOCTYPE[\s\S]*?&gt;)/gi, '<span class="mts-code__meta">$1</span>');
    s = s.replace(/(&lt;\/?)([a-zA-Z][\w:-]*)([\s\S]*?)(\/??&gt;)/g, function (_, open, tag, attrs, close) {
      return '<span class="mts-code__punct">' + open + '</span>' +
             '<span class="mts-code__tag">' + tag + '</span>' +
             highlightHtmlAttrs(attrs) +
             '<span class="mts-code__punct">' + close + '</span>';
    });
    return s;
  }

  function stashTokens(src, re, klass) {
    var bucket = [];
    src = src.replace(re, function (m) {
      var key = '\u0000TOK' + bucket.length + '\u0000';
      bucket.push('<span class="' + klass + '">' + m + '</span>');
      return key;
    });
    return {
      text: src,
      restore: function (value) {
        return value.replace(/\u0000TOK(\d+)\u0000/g, function (_, i) { return bucket[+i]; });
      }
    };
  }

  function highlightJs(code) {
    var s = escHtml(code);
    var comments = stashTokens(s, /(\/\*[\s\S]*?\*\/|(^|[^:])\/\/.*$)/gm, 'mts-code__comment');
    s = comments.text;
    var strings = stashTokens(s, /(`(?:\\[\s\S]|[^`])*`|"(?:\\.|[^"])*"|'(?:\\.|[^'])*')/g, 'mts-code__string');
    s = strings.text;

    s = s
      .replace(/\b(const|let|var|function|return|new|if|else|for|while|switch|case|break|continue|true|false|null|undefined|class|this|async|await|try|catch|throw|import|from|export|default)\b/g,
        '<span class="mts-code__keyword">$1</span>')
      .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="mts-code__number">$1</span>')
      .replace(/\b([A-Za-z_$][\w$]*)(?=\s*\()/g, '<span class="mts-code__fn">$1</span>');

    s = strings.restore(s);
    s = comments.restore(s);
    return s;
  }

  var copyAssetsState = 0;
  var copyAssetsPromise = null;
  function ensureCopyAssets() {
    if (!sharedScriptUrl) return Promise.resolve(false);
    if (window.MTS && window.MTS.CopyButton) return Promise.resolve(true);
    if (copyAssetsPromise) return copyAssetsPromise;
    function injectCss(href) {
      if (document.querySelector('link[data-mts-codehl-asset="' + href + '"]')) return;
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.mtsCodehlAsset = href;
      document.head.appendChild(link);
    }
    injectCss(new URL('../forms/matios-ui-button/matios-ui-button.css', sharedScriptUrl).href);
    injectCss(new URL('../forms/matios-ui-copybutton/matios-ui-copybutton.css', sharedScriptUrl).href);
    copyAssetsPromise = new Promise(function (resolve) {
      var existing = document.querySelector('script[data-mts-codehl-copybutton="1"]');
      if (existing) {
        existing.addEventListener('load', function () { resolve(!!(window.MTS && window.MTS.CopyButton)); }, { once: true });
        existing.addEventListener('error', function () { resolve(false); }, { once: true });
        if (window.MTS && window.MTS.CopyButton) resolve(true);
        return;
      }
      var script = document.createElement('script');
      script.src = new URL('../forms/matios-ui-copybutton/matios-ui-copybutton.js', sharedScriptUrl).href;
      script.dataset.mtsCodehlCopybutton = '1';
      script.onload = function () { resolve(!!(window.MTS && window.MTS.CopyButton)); };
      script.onerror = function () { resolve(false); };
      document.head.appendChild(script);
    });
    return copyAssetsPromise;
  }

  function ensureCopyButton(panel, raw, type) {
    if (!panel || !raw) return;
    if (panel.querySelector('.mts-codehl__toolbar')) return;

    var toolbar = document.createElement('div');
    toolbar.className = 'mts-codehl__toolbar';

    var host = document.createElement('button');
    host.type = 'button';
    host.className = 'mts-codehl__copy-host';
    host.dataset.text = raw;
    host.dataset.label = 'Copy';
    host.dataset.labelCopied = 'Copied';
    host.dataset.variant = 'secondary';
    host.dataset.size = 'sm';
    host.dataset.mtsCodeType = type;
    toolbar.appendChild(host);

    panel.insertBefore(toolbar, panel.firstChild);

    ensureCopyAssets().then(function (ok) {
      if (!ok || !(window.MTS && window.MTS.CopyButton)) return;
      if (host.dataset.mtsCopyInit === '1') return;
      host.dataset.mtsCopyInit = '1';
      try { new MTS.CopyButton(host); } catch (e) { log('copybutton:error', e); }
    });
  }

  function processPanel(panel) {
    if (!panel) return;
    if (panel.querySelector('.mts-codeblock')) return;
    var type = detectPanelType(panel);
    var target = findCodeTarget(panel);
    var raw = (target.textContent || '').trim();

    log('panel', {
      id: panel.id || null,
      ariaLabelledBy: panel.getAttribute('aria-labelledby') || null,
      type: type,
      targetTag: target.tagName,
      hiddenAttr: panel.hasAttribute('hidden'),
      textPreview: raw.slice(0, 100)
    });

    if (type === 'preview' || type === 'unknown') return;
    if (isPlaceholderCode(raw, type)) {
      hidePanelAndTab(panel, type, raw);
      return;
    }

    ensureCopyButton(panel, raw, type);

    if (target.dataset.mtsCodeHlProcessed === '1') return;

    target.classList.add('mts-codehl', type === 'html' ? 'mts-codehl--html' : 'mts-codehl--js');
    if (target === panel) {
      panel.classList.add('mts-codehl-panel', type === 'html' ? 'mts-codehl-panel--html' : 'mts-codehl-panel--js');
    }
    target.innerHTML = type === 'html' ? highlightHtml(raw) : highlightJs(raw);
    target.dataset.mtsCodeHlProcessed = '1';
    log('panel:processed', { id: panel.id || null, type: type });
  }

  function processTabs(root) {
    var scope = root || document;
    var navs = scope.querySelectorAll ? scope.querySelectorAll('.mts-tabs__nav') : [];
    var wraps = scope.querySelectorAll ? scope.querySelectorAll('.mts-tabs__panels') : [];
    navs.forEach(function (nav, index) {
      log('nav', {
        index: index,
        id: nav.id || null,
        className: nav.className || '',
        childCount: nav.children.length,
        textPreview: (nav.textContent || '').trim().slice(0, 80)
      });
    });
    wraps.forEach(function (wrap) {
      log('panelsWrap', {
        childCount: wrap.children.length,
        className: wrap.className || ''
      });
      wrap.querySelectorAll('.mts-tabs__panel').forEach(processPanel);
    });
  }

  function schedule(reason) {
    log('schedule', { reason: reason });
    window.requestAnimationFrame(function () { processTabs(document); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    log('boot', { href: location.href });
    schedule('DOMContentLoaded');
  });

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('.mts-tabs__tab,[role="tab"]') : null;
    if (!t) return;
    log('tab-click', {
      id: t.id || null,
      text: (t.textContent || '').trim(),
      ariaControls: t.getAttribute('aria-controls') || null
    });
    setTimeout(function () { schedule('tab-click'); }, 0);
  }, true);

  try {
    var mo = new MutationObserver(function (mutations) {
      var should = false;
      mutations.forEach(function (m) {
        if (m.type === 'childList') {
          Array.prototype.forEach.call(m.addedNodes || [], function (node) {
            if (node.nodeType !== 1) return;
            if (node.matches && (node.matches('.mts-tabs__nav') || node.matches('.mts-tabs__panels') || node.matches('.mts-tabs__panel'))) should = true;
            if (!should && node.querySelector && node.querySelector('.mts-tabs__nav, .mts-tabs__panels, .mts-tabs__panel')) should = true;
          });
        }
        if (m.type === 'attributes' && m.target && m.target.classList && (m.target.classList.contains('mts-tabs__panel') || m.target.classList.contains('mts-tabs__tab'))) {
          should = true;
        }
      });
      if (should) schedule('mutation');
    });
    mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'hidden', 'aria-selected']
    });
  } catch (e) {
    log('mutation:error', e);
  }
})();



/* ── Group launcher helper / Helper para launchers de grupo ───── */

function mtsBuildDemoSrc(src) {
  var mode = document.documentElement.getAttribute('data-mts-mode') || 'dark';
  var accent = document.documentElement.getAttribute('data-mts-accent') || '';
  var hash = 'mts-mode=' + encodeURIComponent(mode);
  if (accent) hash += '&mts-accent=' + encodeURIComponent(accent);
  return src + '#' + hash;
}

function mtsNotifyActiveComponent(component) {
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'mts:accActive', component: component || null }, '*');
    }
  } catch (e) {}
}

function initGroupLauncher(selector, items) {
  if (!window.MTS || !MTS.Accordion) return null;
  var host = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!host || !Array.isArray(items)) return null;

  var sortedItems = items.slice().sort(function (a, b) {
    var at = (a && a.title ? a.title : '').toString().toLocaleLowerCase();
    var bt = (b && b.title ? b.title : '').toString().toLocaleLowerCase();
    return at.localeCompare(bt, undefined, { sensitivity: 'base', numeric: true });
  });

  var accordion = new MTS.Accordion(host, {
    multiple: false,
    items: sortedItems.map(function (item) {
      return {
        id: item.id,
        title: item.title,
        content: function () {
          var wrap = document.createElement('div');
          wrap.className = 'demo-launcher__framewrap';
          var iframe = document.createElement('iframe');
          iframe.className = 'demo-launcher__iframe';
          iframe.id = 'iframe-acc-' + item.id;
          iframe.src = 'about:blank';
          iframe.loading = 'lazy';
          wrap.appendChild(iframe);
          return wrap;
        }
      };
    })
  });

  sortedItems.forEach(function (item) {
    var wrap = host.querySelector('#mts-acc-' + item.id);
    if (!wrap) return;
    wrap.dataset.src = item.src;
    wrap.dataset.component = item.component || item.id;
    var titleNode = wrap.querySelector('.mts-accordion__title');
    if (titleNode) {
      var block = document.createElement('span');
      block.className = 'demo-launcher__titleblock';
      var title = document.createElement('span');
      title.className = 'demo-launcher__title';
      title.textContent = item.title;
      block.appendChild(title);
      if (item.subtitle) {
        var subtitle = document.createElement('span');
        subtitle.className = 'demo-launcher__subtitle';
        subtitle.textContent = item.subtitle;
        block.appendChild(subtitle);
      }
      titleNode.replaceWith(block);
    }
  });

  host.addEventListener('mts:accordion:open', function (e) {
    var id = e.detail && e.detail.id;
    if (!id) return;
    var wrap = host.querySelector('#mts-acc-' + id);
    var iframe = wrap ? wrap.querySelector('.demo-launcher__iframe') : null;
    if (!iframe) return;
    iframe.src = mtsBuildDemoSrc(wrap.dataset.src || '');
    mtsNotifyActiveComponent(wrap.dataset.component || id);
    setTimeout(function () {
      var body = wrap.querySelector('.mts-accordion__body');
      if (body && body.classList.contains('mts-accordion__body--open')) {
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    }, 80);
  });

  host.addEventListener('mts:accordion:close', function (e) {
    var id = e.detail && e.detail.id;
    if (!id) return;
    var wrap = host.querySelector('#mts-acc-' + id);
    var iframe = wrap ? wrap.querySelector('.demo-launcher__iframe') : null;
    if (iframe) iframe.src = 'about:blank';
    if (!host.querySelector('.mts-accordion__body--open')) {
      mtsNotifyActiveComponent(null);
    }
  });

  return accordion;
}

/* ── Global cleanup: remove demo-header-actions / Limpieza global ───────── */
/* Appended at end on purpose: easy to remove if needed */
(function () {
  function removeDemoHeaderActions(root) {
    try {
      var scope = root && root.querySelectorAll ? root : document;
      var nodes = scope.querySelectorAll ? scope.querySelectorAll('div.demo-header-actions') : [];
      Array.prototype.forEach.call(nodes, function (node) {
        if (node && node.parentNode) node.parentNode.removeChild(node);
      });
    } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    removeDemoHeaderActions(document);
  });

  try {
    var mo = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        Array.prototype.forEach.call(m.addedNodes || [], function (node) {
          if (!node || node.nodeType !== 1) return;
          if (node.matches && node.matches('div.demo-header-actions')) {
            if (node.parentNode) node.parentNode.removeChild(node);
            return;
          }
          removeDemoHeaderActions(node);
        });
      });
    });
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
  } catch (e) {}
})();
