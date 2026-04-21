/* ============================================================
   MATIOS UI — matios-ui-readme-modal.js  v2.0.0
   Panel lateral con README renderizado. Botón "Ver código"
   en cada demo-title que tenga data-section.
   ============================================================ */
window.MTS = window.MTS || {};

MTS.ReadmeModal = (() => {

  const PATH_MAP = {
    input:'matios-ui-input/matios-ui-input.md',
    select:'matios-ui-select/matios-ui-select.md',
    checkbox:'matios-ui-checkbox/matios-ui-checkbox.md',
    transferlist:'matios-ui-transferlist/matios-ui-transferlist.md',
    picker:'matios-ui-picker/matios-ui-picker.md',
    rating:'matios-ui-rating/matios-ui-rating.md',
    taginput:'matios-ui-taginput/matios-ui-taginput.md',
    validation:'matios-ui-validation/matios-ui-validation.md',
    fileupload:'matios-ui-fileupload/matios-ui-fileupload.md',
    paging:'matios-ui-paging/matios-ui-paging.md',
    tabs:'matios-ui-tabs/matios-ui-tabs.md',
    accordion:'matios-ui-accordion/matios-ui-accordion.md',
    breadcrumb:'matios-ui-breadcrumb/matios-ui-breadcrumb.md',
    stepper:'matios-ui-stepper/matios-ui-stepper.md',
    drawer:'matios-ui-drawer/matios-ui-drawer.md',
    dropdown:'matios-ui-dropdown/matios-ui-dropdown.md',
    alert:'matios-ui-alert/matios-ui-alert.md',
    tooltip:'matios-ui-tooltip/matios-ui-tooltip.md',
    modal:'matios-ui-modal/matios-ui-modal.md',
    badge:'matios-ui-badge/matios-ui-badge.md',
    progress:'matios-ui-progress/matios-ui-progress.md',
    avatar:'matios-ui-avatar/matios-ui-avatar.md',
    kpicard:'matios-ui-kpicard/matios-ui-kpicard.md',
    emptystate:'matios-ui-emptystate/matios-ui-emptystate.md',
    timeline:'matios-ui-timeline/matios-ui-timeline.md',
    kanban:'matios-ui-kanban/matios-ui-kanban.md',
    datatable:'matios-ui-datatable/matios-ui-datatable.md',
    'datatable-document':'matios-ui-datatable-document/matios-ui-datatable-document.md',
    charts:'matios-ui-chart/matios-ui-chart.md',
    /* Especiales — rutas relativas a su propia carpeta */
    calendar:'matios-ui-calendar.md',
    icons:'matios-ui-icons.md',
    layout:'matios-ui-layout.md',
  };

  const GROUP_MAP = {
    input:'forms',select:'forms',checkbox:'forms',transferlist:'forms',picker:'forms',rating:'forms',
    taginput:'forms',validation:'forms',fileupload:'forms',paging:'forms',
    tabs:'navigation',accordion:'navigation',breadcrumb:'navigation',
    stepper:'navigation',drawer:'navigation',dropdown:'navigation',
    alert:'overlays',tooltip:'overlays',modal:'overlays',badge:'overlays',progress:'overlays',
    avatar:'display',kpicard:'display',emptystate:'display',timeline:'display',kanban:'display',
    datatable:'data','datatable-document':'data',charts:'data',
    calendar:'calendar',icons:'icons',layout:'layouts',
  };

  let _overlay=null, _panel=null, _cache={}, _currentMd='';

  function _injectStyles() {
    if (document.getElementById('mts-rm-css')) return;
    const s = document.createElement('style');
    s.id = 'mts-rm-css';
    s.textContent = `
.mts-rm-overlay{position:fixed;inset:0;z-index:9000;pointer-events:none;}
.mts-rm-overlay.open{pointer-events:auto;}
.mts-rm-backdrop{position:absolute;inset:0;background:rgba(0,0,0,0);transition:background .25s;}
.mts-rm-overlay.open .mts-rm-backdrop{background:rgba(0,0,0,.5);}
.mts-rm-panel{
  position:absolute;top:0;right:0;bottom:0;width:min(640px,92vw);
  background:var(--mts-bg-surface,#161820);
  border-left:1px solid var(--mts-border-color,#2a2d38);
  display:flex;flex-direction:column;
  transform:translateX(100%);
  transition:transform .28s cubic-bezier(.4,0,.2,1);
  box-shadow:-12px 0 48px rgba(0,0,0,.6);
}
.mts-rm-overlay.open .mts-rm-panel{transform:translateX(0);}
.mts-rm-hdr{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--mts-border-color,#2a2d38);flex-shrink:0;}
.mts-rm-hdr-title{flex:1;font-size:13px;font-weight:700;color:var(--mts-text-primary,#e8eaf0);display:flex;align-items:center;gap:8px;}
.mts-rm-hdr-tag{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;padding:2px 7px;border-radius:4px;background:rgba(79,142,255,.15);color:var(--mts-color-primary,#4f8eff);}
.mts-rm-btn{padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;border:1px solid var(--mts-border-color,#2a2d38);background:var(--mts-bg-surface-2,#1e2028);color:var(--mts-text-muted,#6b7280);cursor:pointer;font-family:inherit;transition:all .12s;}
.mts-rm-btn:hover{border-color:var(--mts-color-primary,#4f8eff);color:var(--mts-color-primary,#4f8eff);}
.mts-rm-close{width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center;background:var(--mts-bg-surface-2,#1e2028);border:1px solid var(--mts-border-color,#2a2d38);cursor:pointer;color:var(--mts-text-muted,#6b7280);font-size:16px;line-height:1;transition:all .12s;}
.mts-rm-close:hover{background:rgba(248,113,113,.1);color:#f87171;}
.mts-rm-body{flex:1;overflow-y:auto;padding:22px 22px 32px;scrollbar-width:thin;scrollbar-color:var(--mts-border-color,#2a2d38) transparent;}
.mts-rm-body::-webkit-scrollbar{width:4px;}
.mts-rm-body::-webkit-scrollbar-thumb{background:var(--mts-border-color,#2a2d38);border-radius:3px;}
.mts-rm-loading{display:flex;align-items:center;justify-content:center;gap:10px;padding:60px 0;color:var(--mts-text-muted,#6b7280);font-size:13px;}
.mts-rm-spin{width:18px;height:18px;border-radius:50%;border:2px solid var(--mts-border-color,#2a2d38);border-top-color:var(--mts-color-primary,#4f8eff);animation:mts-spin .7s linear infinite;}
@keyframes mts-spin{to{transform:rotate(360deg);}}

/* Markdown */
.mts-rm-md{font-size:13.5px;line-height:1.75;color:var(--mts-text-secondary,#a0a8c0);}
.mts-rm-md h1{font-size:18px;font-weight:800;color:var(--mts-text-primary,#e8eaf0);margin:0 0 16px;}
.mts-rm-md h2{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;color:var(--mts-text-muted,#6b7280);margin:26px 0 10px;padding-bottom:6px;border-bottom:1px solid var(--mts-border-color,#2a2d38);}
.mts-rm-md h3{font-size:13px;font-weight:700;color:var(--mts-text-primary,#e8eaf0);margin:16px 0 8px;}
.mts-rm-md p{margin:0 0 12px;}
.mts-rm-md ul,.mts-rm-md ol{margin:0 0 12px;padding-left:18px;}
.mts-rm-md li{margin-bottom:3px;}
.mts-rm-md hr{border:none;border-top:1px solid var(--mts-border-color,#2a2d38);margin:18px 0;}
.mts-rm-md strong{color:var(--mts-text-primary,#e8eaf0);font-weight:700;}
.mts-rm-md a{color:var(--mts-color-primary,#4f8eff);text-decoration:none;}
.mts-rm-md code{font-family:'JetBrains Mono','Fira Code',monospace;font-size:12px;padding:1px 6px;background:var(--mts-bg-surface-2,#1e2028);border:1px solid var(--mts-border-color,#2a2d38);border-radius:4px;color:var(--mts-color-primary,#4f8eff);}
.mts-rm-md pre{background:var(--mts-bg-surface-2,#1e2028);border:1px solid var(--mts-border-color,#2a2d38);border-radius:9px;overflow:hidden;margin:0 0 14px;}
.mts-rm-pre-top{display:flex;align-items:center;justify-content:space-between;padding:6px 12px;background:rgba(0,0,0,.25);border-bottom:1px solid var(--mts-border-color,#2a2d38);}
.mts-rm-pre-lang{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--mts-text-muted,#6b7280);}
.mts-rm-pre-copy{font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;background:transparent;border:1px solid var(--mts-border-color,#2a2d38);color:var(--mts-text-muted,#6b7280);cursor:pointer;font-family:inherit;}
.mts-rm-pre-copy:hover{color:var(--mts-color-primary,#4f8eff);border-color:var(--mts-color-primary,#4f8eff);}
.mts-rm-md pre code{display:block;padding:12px 14px;overflow-x:auto;background:none;border:none;border-radius:0;font-size:12px;color:var(--mts-text-primary,#e8eaf0);line-height:1.65;}
.mts-rm-md table{width:100%;border-collapse:collapse;margin:0 0 14px;font-size:12.5px;}
.mts-rm-md th{padding:6px 12px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:var(--mts-text-muted,#6b7280);background:rgba(0,0,0,.2);border-bottom:1px solid var(--mts-border-color,#2a2d38);}
.mts-rm-md td{padding:7px 12px;border-bottom:1px solid var(--mts-border-color,#2a2d38);}
.mts-rm-md tr:last-child td{border-bottom:none;}
.mts-rm-md tr:hover td{background:rgba(255,255,255,.02);}
.mts-rm-md blockquote{border-left:3px solid var(--mts-color-primary,#4f8eff);padding:8px 14px;margin:0 0 14px;background:rgba(79,142,255,.06);border-radius:0 6px 6px 0;}
/* Syntax */
.hl-kw{color:#c084fc;} .hl-str{color:#86efac;} .hl-num{color:#fbbf24;} .hl-cmt{color:#6b7280;font-style:italic;}
/* Trigger button */
.mts-rm-trigger{display:inline-flex;align-items:center;gap:5px;margin-left:10px;padding:2px 9px;border-radius:5px;font-size:10px;font-weight:600;background:rgba(79,142,255,.1);border:1px solid rgba(79,142,255,.2);color:var(--mts-color-primary,#4f8eff);cursor:pointer;vertical-align:middle;transition:all .12s;white-space:nowrap;}
.mts-rm-trigger:hover{background:var(--mts-color-primary,#4f8eff);color:#fff;border-color:var(--mts-color-primary,#4f8eff);}
`;
    document.head.appendChild(s);
  }

  function _build() {
    if (_panel) return;
    _injectStyles();
    _overlay = document.createElement('div');
    _overlay.className = 'mts-rm-overlay';
    const bd = document.createElement('div');
    bd.className = 'mts-rm-backdrop';
    bd.onclick = () => close();
    _panel = document.createElement('div');
    _panel.className = 'mts-rm-panel';
    _panel.innerHTML = `
      <div class="mts-rm-hdr">
        <div class="mts-rm-hdr-title">
          <span id="mts-rm-title">README</span>
          <span class="mts-rm-hdr-tag">docs</span>
        </div>
        <button class="mts-rm-btn" id="mts-rm-cpbtn">Copiar MD</button>
        <button class="mts-rm-close" onclick="MTS.ReadmeModal.close()">✕</button>
      </div>
      <div class="mts-rm-body" id="mts-rm-body"></div>`;
    _overlay.appendChild(bd);
    _overlay.appendChild(_panel);
    document.body.appendChild(_overlay);
    document.getElementById('mts-rm-cpbtn').onclick = () => {
      navigator.clipboard?.writeText(_currentMd || '');
      const b = document.getElementById('mts-rm-cpbtn');
      b.textContent = '✅ Copiado';
      setTimeout(() => b.textContent = 'Copiar MD', 2000);
    };
    document.addEventListener('keydown', e => { if(e.key==='Escape') close(); });
  }

  async function show(sId, label) {
    _build();
    document.getElementById('mts-rm-title').textContent = label || sId;
    document.getElementById('mts-rm-body').innerHTML =
      '<div class="mts-rm-loading"><div class="mts-rm-spin"></div> Cargando documentación...</div>';
    _overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    const md = await _fetch(sId);
    if (!md) {
      document.getElementById('mts-rm-body').innerHTML =
        '<div class="mts-rm-loading" style="flex-direction:column;gap:8px"><span style="font-size:24px">📄</span>README no encontrado para <code>' + sId + '</code></div>';
      return;
    }
    document.getElementById('mts-rm-body').innerHTML = '<div class="mts-rm-md">' + _md(md) + '</div>';
    _hl();
  }

  function close() {
    _overlay && _overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function attach(root) {
    root = root || document;
    root.querySelectorAll('[data-section]').forEach(el => {
      const sId = el.dataset.section;
      if (!PATH_MAP[sId]) return;
      if (el.querySelector('.mts-rm-trigger')) return;
      const label = el.firstChild?.textContent?.trim() || sId;
      const btn = document.createElement('button');
      btn.className = 'mts-rm-trigger';
      btn.textContent = '{ } Ver código';
      btn.onclick = e => { e.stopPropagation(); show(sId, label); };
      el.appendChild(btn);
    });
  }

  async function _fetch(sId) {
    if (_cache[sId] !== undefined) { _currentMd = _cache[sId]||''; return _cache[sId]; }
    const rel = PATH_MAP[sId];
    if (!rel) { _cache[sId]=null; return null; }
    const group = GROUP_MAP[sId] || '';
    const loc = window.location.pathname;
    let url = group && !loc.includes('/'+group+'/') ? '../'+group+'/'+rel : rel;
    try {
      const r = await fetch(url);
      if (!r.ok) throw 0;
      const t = await r.text();
      _cache[sId] = t; _currentMd = t; return t;
    } catch {
      _cache[sId] = null; return null;
    }
  }

  function _md(md) {
    let h = md.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const blocks = [];
    h = h.replace(/```(\w*)\n?([\s\S]*?)```/g, (_,lang,code) => {
      blocks.push({lang:lang||'js', code:code.trim()});
      return '\x00B'+(blocks.length-1)+'\x00';
    });
    h = h
      .replace(/^---+$/gm,'<hr>')
      .replace(/^### (.+)$/gm,'<h3>$1</h3>')
      .replace(/^## (.+)$/gm,'<h2>$1</h2>')
      .replace(/^# (.+)$/gm,'<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/`([^`]+)`/g,'<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank">$1</a>')
      .replace(/^&gt; (.+)$/gm,'<blockquote>$1</blockquote>')
      .replace(/^\|(.+)\|\s*\n\|[-| :]+\|\s*\n((?:\|.+\|\s*\n?)*)/gm,(_,hd,rows)=>{
        const ths=hd.split('|').filter(c=>c.trim()).map(c=>`<th>${c.trim()}</th>`).join('');
        const trs=rows.trim().split('\n').map(r=>`<tr>${r.split('|').filter(c=>c.trim()).map(c=>`<td>${c.trim()}</td>`).join('')}</tr>`).join('');
        return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
      })
      .replace(/^[\*\-] (.+)$/gm,'<li>$1</li>')
      .replace(/((?:<li>[^<]*<\/li>\n?)+)/g,'<ul>$1</ul>')
      .replace(/^(?!<)(.+)$/gm,'<p>$1</p>');
    h = h.replace(/\x00B(\d+)\x00/g,(_,i)=>{
      const {lang,code}=blocks[+i];
      return `<pre><div class="mts-rm-pre-top"><span class="mts-rm-pre-lang">${lang}</span><button class="mts-rm-pre-copy" onclick="MTS.ReadmeModal._cp(this)">Copiar</button></div><code class="lang-${lang}">${code}</code></pre>`;
    });
    return h;
  }

  function _hl() {
    document.querySelectorAll('#mts-rm-body pre code').forEach(el => {
      let c = el.innerHTML;
      c = c.replace(/(&#x27;[^<]*?&#x27;|&quot;[^<]*?&quot;)/g,'<span class="hl-str">$1</span>');
      c = c.replace(/\/\/[^\n]*/g,'<span class="hl-cmt">$&</span>');
      c = c.replace(/\b(const|let|var|new|return|if|else|for|of|in|function|async|await|class|this|true|false|null|undefined|import|export|from|default)\b/g,'<span class="hl-kw">$1</span>');
      c = c.replace(/\b(\d+\.?\d*)\b/g,'<span class="hl-num">$1</span>');
      el.innerHTML = c;
    });
  }

  function _cp(btn) {
    const code = btn.closest('pre').querySelector('code');
    navigator.clipboard?.writeText(code.textContent||'');
    const o=btn.textContent; btn.textContent='✅';
    setTimeout(()=>btn.textContent=o, 1500);
  }

  return { show, close, attach, _cp };
})();
