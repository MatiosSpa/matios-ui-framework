/* ============================================================
   MATIOS UI — matios-ui-icons.js  v1.0.0

   Sistema de íconos SVG via clases CSS.
   Uso:
     <i class="mts-icon mts-icon-trash"></i>
     <i class="mts-icon mts-icon-trash mts-icon--filled"></i>
     <i class="mts-icon mts-icon-trash mts-icon--sm"></i>
     <i class="mts-icon mts-icon-trash mts-icon--lg"></i>
     <i class="mts-icon mts-icon-trash mts-icon--xl"></i>

   JS:
     MTS.Icon.get('trash')              → string SVG
     MTS.Icon.render('trash', el)       → inserta en elemento
     MTS.Icon.list()                    → array de nombres
     MTS.Icon.initAll()                 → inicializa todos los <i class="mts-icon">

   Categorías:
     acción · navegación · estado · archivo · comunicación
     datos · dispositivo · edición · finanzas · media
     personas · seguridad · tiempo · ui · layout

   ============================================================ */

window.MTS = window.MTS || {};

/* ============================================================
   DEFINICIÓN DE ÍCONOS — 300+ outline / filled
   Cada ícono: { o: 'outline path', f: 'filled path' }
   Cuando no hay 'f', usa 'o' para ambos modos.
   viewBox siempre 0 0 24 24, stroke-width 1.8
   ============================================================ */

const ICONS = {

  /* ── ACCIÓN ──────────────────────────────────────────── */
  'search':       { o: `<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4" stroke-linecap="round"/>` },
  'search-plus':  { o: `<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4M8 11h6M11 8v6" stroke-linecap="round"/>` },
  'search-minus': { o: `<circle cx="11" cy="11" r="7"/><path d="m16.5 16.5 4 4M8 11h6" stroke-linecap="round"/>` },
  'filter':       { o: `<path d="M3 6h18M7 12h10M10 18h4" stroke-linecap="round"/>`,
                    f: `<path d="M3 5h18a1 1 0 0 1 .7 1.7L14 14v5a1 1 0 0 1-1.4.9l-2-.8A1 1 0 0 1 10 18v-4L3.3 6.7A1 1 0 0 1 3 5z" stroke-linejoin="round"/>` },
  'sort':         { o: `<path d="M3 6h18M7 12h10M11 18h2" stroke-linecap="round"/>` },
  'sort-asc':     { o: `<path d="M3 6h18M7 12h10M11 18h2M17 3v6M17 3l-2 2M17 3l2 2" stroke-linecap="round" stroke-linejoin="round"/>` },
  'sort-desc':    { o: `<path d="M3 6h18M7 12h10M11 18h2M17 21v-6M17 21l-2-2M17 21l2-2" stroke-linecap="round" stroke-linejoin="round"/>` },
  'add':          { o: `<path d="M12 4v16M4 12h16" stroke-linecap="round"/>` },
  'plus':         { o: `<path d="M12 4v16M4 12h16" stroke-linecap="round"/>` },
  'add-circle':   { o: `<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8" stroke-linecap="round"/>`,
                    f: `<path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>` },
  'minus':        { o: `<path d="M4 12h16" stroke-linecap="round"/>` },
  'close':        { o: `<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/>` },
  'x':            { o: `<path d="M18 6 6 18M6 6l12 12" stroke-linecap="round"/>` },
  'close-circle': { o: `<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6" stroke-linecap="round"/>` },
  'check':        { o: `<path d="M4 12l5.5 5.5L20 7" stroke-linecap="round" stroke-linejoin="round"/>` },
  'check-circle': { o: `<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6" stroke-linecap="round" stroke-linejoin="round"/>`,
                    f: `<path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-1 14-4-4 1.4-1.4 2.6 2.6 6.6-6.6L19 8l-8 8z"/>` },
  'check-all':    { o: `<path d="M2 12l4 4L14 8M7 12l4 4 7-8" stroke-linecap="round" stroke-linejoin="round"/>` },
  'check-square': { o: `<polyline points="9 11 12 14 22 4" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke-linecap="round" stroke-linejoin="round"/>` },
  'copy':         { o: `<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>` },
  'cut':          { o: `<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="m20 4-8.12 8.12M14.47 14.48 20 20M8.41 13.41l-1.88 1.88" stroke-linecap="round"/>` },
  'paste':        { o: `<path d="M9 2h6a1 1 0 0 1 1 1v1H8V3a1 1 0 0 1 1-1z"/><rect x="4" y="4" width="16" height="17" rx="2"/><path d="M9 12h6M9 16h4" stroke-linecap="round"/>` },
  'trash':        { o: `<path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke-linecap="round"/>`,
                    f: `<path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1zM3 7h18v1a1 1 0 0 1-1 1h-.08L19 20a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4.08 9H4a1 1 0 0 1-1-1V7zM10 12v5M14 12v5" stroke-linecap="round"/>` },
  'trash-2':      { o: `<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>` },
  'edit':         { o: `<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke-linejoin="round"/>` },
  'edit-2':       { o: `<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>` },
  'edit-3':       { o: `<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3l-13 13L3 21l1.5-5.5 13-12z"/>` },
  'save':         { o: `<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>` },
  'download':     { o: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>` },
  'upload':       { o: `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>` },
  'upload-cloud': { o: `<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>` },
  'download-cloud':{ o: `<polyline points="8 17 12 21 16 17"/><line x1="12" y1="21" x2="12" y2="12"/><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"/>` },
  'refresh':      { o: `<path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke-linecap="round"/>` },
  'refresh-cw':   { o: `<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>` },
  'rotate-ccw':   { o: `<polyline points="1 4 1 10 7 10" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" stroke-linecap="round" stroke-linejoin="round"/>` },
  'rotate-cw':    { o: `<polyline points="23 4 23 10 17 10" stroke-linecap="round" stroke-linejoin="round"/><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10" stroke-linecap="round" stroke-linejoin="round"/>` },
  'sync':         { o: `<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>` },
  'undo':         { o: `<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" stroke-linecap="round"/>` },
  'redo':         { o: `<path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" stroke-linecap="round"/>` },
  'share':        { o: `<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>` },
  'github':       { o: `<path fill="currentColor" stroke="none" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>` },
  'share-2':      { o: `<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>` },
  'link':         { o: `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>` },
  'link-2':       { o: `<path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3M8 12h8"/>` },
  'external-link':{ o: `<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>` },
  'maximize':     { o: `<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>` },
  'minimize':     { o: `<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>` },
  'fullscreen':   { o: `<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>` },
  'zoom-in':      { o: `<circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6" stroke-linecap="round"/>` },
  'zoom-out':     { o: `<circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35M8 11h6" stroke-linecap="round"/>` },
  'pin':          { o: `<path d="M12 17v5M9 10h6"/><path d="M5 10 8 3h8l3 7H5z"/><path d="M5 10a7 7 0 0 0 14 0"/>` },
  'bookmark':     { o: `<path d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>`,
                    f: `<path d="M19 21 12 16 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor" stroke="none"/>` },
  'tag':          { o: `<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>` },
  'flag':         { o: `<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>` },
  'move':         { o: `<polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/>` },
  'drag':         { o: `<path d="M5 9h14M5 15h14" stroke-linecap="round"/>` },
  'drag-handle':  { o: `<circle cx="9" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="17" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="17" r="1" fill="currentColor" stroke="none"/>` },
  'lock':         { o: `<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
                    f: `<path d="M17 11V7A5 5 0 0 0 7 7v4H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2z" fill="currentColor" stroke="none"/>` },
  'lock-open':    { o: `<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>` },
  'unlock':       { o: `<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>` },
  'key':          { o: `<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>` },
  'eye':          { o: `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>` },
  'eye-off':      { o: `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>` },
  'star':         { o: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
                    f: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="none"/>` },
  'heart':        { o: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>`,
                    f: `<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" stroke="none"/>` },
  'like':         { o: `<path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>` },
  'dislike':      { o: `<path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>` },

  /* ── NAVEGACIÓN ──────────────────────────────────────── */
  'home':         { o: `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
                    f: `<path d="M12 2 3 9v13h6v-8h6v8h6V9L12 2z" fill="currentColor" stroke="none"/>` },
  'menu':         { o: `<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>` },
  'menu-2':       { o: `<path d="M4 6h16M4 12h8M4 18h16" stroke-linecap="round"/>` },
  'sidebar':      { o: `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>` },
  'sidebar-right':{ o: `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M15 3v18"/>` },
  'grid':         { o: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>` },
  'grid-2':       { o: `<path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z"/>` },
  'list':         { o: `<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>` },
  'sitemap':      { o: `<rect x="9" y="3" width="6" height="5" rx="1"/><rect x="3" y="16" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="6" y2="16"/><line x1="18" y1="12" x2="18" y2="16"/>` },
  'layout':       { o: `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>` },
  'columns':      { o: `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18"/>` },
  'rows':         { o: `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18"/>` },
  'arrow-left':   { o: `<line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>` },
  'arrow-right':  { o: `<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>` },
  'arrow-up':     { o: `<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>` },
  'arrow-down':   { o: `<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>` },
  'arrow-down-circle': { o: `<circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/>` },
  'arrow-up-right':{ o: `<line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>` },
  'arrow-back':   { o: `<path d="M19 12H5M12 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round"/>` },
  'chevron-left': { o: `<polyline points="15 18 9 12 15 6"/>` },
  'chevron-right':{ o: `<polyline points="9 18 15 12 9 6"/>` },
  'chevron-up':   { o: `<polyline points="18 15 12 9 6 15"/>` },
  'chevron-down': { o: `<polyline points="6 9 12 15 18 9"/>` },
  'chevrons-left':{ o: `<polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/>` },
  'chevrons-right':{ o: `<polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/>` },
  'more-horizontal':{ o: `<circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/>` },
  'more-vertical':{ o: `<circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/>` },
  'back':         { o: `<path d="M9 14L4 9l5-5M4 9h16" stroke-linecap="round" stroke-linejoin="round"/>` },
  'forward':      { o: `<path d="M15 14l5-5-5-5M19 9H3" stroke-linecap="round" stroke-linejoin="round"/>` },

  /* ── ESTADO ──────────────────────────────────────────── */
  'info':         { o: `<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>`,
                    f: `<path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" stroke="none"/>` },
  'warning':      { o: `<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>`,
                    f: `<path d="M12 2 1 21h22L12 2zm1 14h-2v-4h2v4zm0 3h-2v-2h2v2z" fill="currentColor" stroke="none"/>` },
  'error':        { o: `<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>`,
                    f: `<path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 13h-2v-2h2v2zm0-4h-2V7h2v4z" fill="currentColor" stroke="none"/>` },
  'success':      { o: `<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>`,
                    f: `<path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm-1 14-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4-7 7z" fill="currentColor" stroke="none"/>` },
  'help':         { o: `<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>` },
  'alert':        { o: `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>` },
  'alert-circle': { o: `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>` },
  'alert-triangle': { o: `<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>` },
  'ban':          { o: `<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>` },
  'shield':       { o: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
                    f: `<path d="M12 1 4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-4z" fill="currentColor" stroke="none"/>` },
  'shield-check': { o: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4" stroke-linecap="round" stroke-linejoin="round"/>` },
  'activity':     { o: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>` },
  'trending-up':  { o: `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>` },
  'trending-down':{ o: `<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>` },
  'pulse':        { o: `<path d="M2 12h4l3-9 4 18 3-9h6" stroke-linecap="round" stroke-linejoin="round"/>` },

  /* ── ARCHIVO ─────────────────────────────────────────── */
  'file':         { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>` },
  'file-text':    { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>` },
  'book':         { o: `<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>` },
  'graduation-cap': { o: `<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5" stroke-linecap="round" stroke-linejoin="round"/><line x1="22" y1="10" x2="22" y2="16"/>` },
  'academic-cap': { o: `<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5" stroke-linecap="round" stroke-linejoin="round"/><line x1="22" y1="10" x2="22" y2="16"/>` },
  'file-plus':    { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>` },
  'file-minus':   { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/>` },
  'file-check':   { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/>` },
  'file-x':       { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="12" x2="15" y2="18"/><line x1="15" y1="12" x2="9" y2="18"/>` },
  'file-pdf':     { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8.5 18l3-7 3 7M9.7 15.5h3.6" stroke-linecap="round" stroke-linejoin="round"/>` },
  'file-image':   { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="10" cy="14" r="2"/><path d="m20 17-1.09-1.09a2 2 0 0 0-2.82 0L10 22"/>` },
  'file-video':   { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polygon points="10 11 16 14 10 17 10 11"/>` },
  'file-audio':   { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M11 17H9a2 2 0 0 1 0-4h1v-4l4-1v4h1a2 2 0 0 1 0 4h-1"/>` },
  'file-code':    { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="10 13 8 15 10 17"/><polyline points="14 13 16 15 14 17"/>` },
  'file-zip':     { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="12" x2="12" y2="18"/><path d="M10 12h4v2h-4zM10 16h4v2h-4z"/>` },

  /* ── OFIMATICA / OFFICE ───────────────────────────────── */
  'file-word':       { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="8 11 9.5 18 12 14 14.5 18 16 11"/>` },
  'file-excel':      { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="11.5" x2="16" y2="11.5"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="8" y1="18.5" x2="16" y2="18.5"/><line x1="12" y1="11.5" x2="12" y2="18.5"/>` },
  'file-powerpoint': { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8.5 19v-8h2.5c3 0 3 4 0 4H8.5"/>` },
  'file-access':     { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><ellipse cx="12" cy="12.5" rx="4" ry="1.5"/><path d="M8 12.5v4c0 .83 1.79 1.5 4 1.5c2.21 0 4-.67 4-1.5v-4"/>` },
  'file-project':    { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="12" x2="14" y2="12"/><line x1="11" y1="15" x2="16" y2="15"/><line x1="8" y1="18" x2="13" y2="18"/>` },
  'file-visio':      { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polygon points="12 11 16.5 15 12 19 7.5 15"/>` },
  'file-onenote':    { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8.5" y1="11" x2="8.5" y2="19"/><line x1="8.5" y1="11" x2="15.5" y2="19"/><line x1="15.5" y1="11" x2="15.5" y2="19"/>` },
  'file-publisher':  { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M8 12h3v6H8z"/><path d="M13 12h3v6h-3z"/>` },
  'file-outlook':    { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><rect x="7.5" y="12" width="9" height="6.5" rx="0.5"/><polyline points="7.5 12 12 15.5 16.5 12"/>` },
  'file-csv':        { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="11" y2="13"/><line x1="12.5" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="11.5" y2="17"/><line x1="13" y1="17" x2="16" y2="17"/>` },

  'folder':       { o: `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>`,
                    f: `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z" fill="currentColor" stroke="none"/>` },
  'folder-open':  { o: `<path d="M6 14l1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"/>` },
  'folder-plus':  { o: `<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>` },
  'archive':      { o: `<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>` },
  'inbox':        { o: `<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 17.76 4H6.24a2 2 0 0 0-1.79 1.11z"/>` },
  'database':     { o: `<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>` },
  'server':       { o: `<rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>` },
  'cloud':        { o: `<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>` },
  'hard-drive':   { o: `<line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 17.76 4H6.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/>` },

  /* ── COMUNICACIÓN ────────────────────────────────────── */
  'mail':         { o: `<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/>`,
                    f: `<path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" fill="currentColor" stroke="none"/>` },
  'mail-open':    { o: `<path d="M21 5l-9 7L3 5"/><path d="M3 5H21V19H3V5z"/><path d="M3 5l9 7 9-7"/>` },
  'send':         { o: `<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>`,
                    f: `<polygon points="22 2 15 22 11 13 2 9 22 2" fill="currentColor" stroke="none"/>` },
  'message':      { o: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>`,
                    f: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" fill="currentColor" stroke="none"/>` },
  'message-circle':{ o: `<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>` },
  'messages':     { o: `<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h8M8 14h4"/>` },
  'bell':         { o: `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>`,
                    f: `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9zM13.73 21a2 2 0 0 1-3.46 0" fill="currentColor" stroke="none"/>` },
  'bell-off':     { o: `<path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18.63 13A17.89 17.89 0 0 1 18 8"/><path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14"/><path d="M18 8a6 6 0 0 0-9.33-5"/><line x1="1" y1="1" x2="23" y2="23"/>` },
  'phone':        { o: `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.15-1.15a2 2 0 0 1 2.12-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>` },
  'video':        { o: `<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>` },
  'video-off':    { o: `<path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"/><line x1="1" y1="1" x2="23" y2="23"/>` },
  'wifi':         { o: `<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 16 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>` },
  'bluetooth':    { o: `<polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/>` },
  'rss':          { o: `<path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"/>` },
  'at-sign':      { o: `<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>` },
  'globe':        { o: `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>` },
  'navigation':   { o: `<polygon points="3 11 22 2 13 21 11 13 3 11"/>` },

  /* ── DATOS / CHARTS ──────────────────────────────────── */
  'bar-chart':    { o: `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>` },
  'bar-chart-2':  { o: `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>`,
                    f: `<path d="M6 14h4v6H6zM10 4h4v16h-4zM14 10h4v10h-4zM2 20h20v2H2z" fill="currentColor" stroke="none"/>` },
  'pie-chart':    { o: `<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>` },
  'line-chart':   { o: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>` },
  'area-chart':   { o: `<path d="M2 20 9 9l4 6 4-4 5 9H2z"/>` },
  'gauge':        { o: `<path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/><path d="M12 4a8 8 0 0 0-8 8h2m14 0a8 8 0 0 0-8-8"/><path d="M12 12 8 8"/>` },
  'table':        { o: `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>` },
  'calendar':     { o: `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`,
                    f: `<path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8 2v2M16 2v2M3 10h18" fill="currentColor" stroke="none"/>` },
  'kanban':       { o: `<path d="M3 3h6v14H3zM9 3h6v9H9zM15 3h6v5h-6z"/>` },
  'chart-up':     { o: `<path d="M3 20h18"/><path d="m4 17 4-5 5 2 6-8"/>` },
  'report':       { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>` },
  'analytics':    { o: `<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="12" r="2"/><path d="m7.4 16.7 3.2-3.2M13.4 10.7l3.2-3.2"/>` },

  /* ── DISPOSITIVO ─────────────────────────────────────── */
  'monitor':      { o: `<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>` },
  'laptop':       { o: `<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>` },
  'tablet':       { o: `<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>` },
  'mobile':       { o: `<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>` },
  'printer':      { o: `<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>` },
  'keyboard':     { o: `<rect x="2" y="6" width="20" height="12" rx="2"/><line x1="6" y1="10" x2="6.01" y2="10"/><line x1="10" y1="10" x2="10.01" y2="10"/><line x1="14" y1="10" x2="14.01" y2="10"/><line x1="18" y1="10" x2="18.01" y2="10"/><line x1="6" y1="14" x2="18" y2="14"/>` },
  'mouse':        { o: `<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 6v4"/>` },
  'headphones':   { o: `<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z"/>` },
  'camera':       { o: `<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>` },
  'mic':          { o: `<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>` },
  'mic-off':      { o: `<line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>` },
  'speaker':      { o: `<rect x="4" y="2" width="8" height="20" rx="2"/><path d="M9 22v-2.5m4-7.5a5 5 0 0 1 0 7m3-10a9 9 0 0 1 0 13"/>` },
  'battery':      { o: `<rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="13" x2="23" y2="11"/>` },
  'battery-charging':{ o: `<path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"/><line x1="23" y1="13" x2="23" y2="11"/><polyline points="11 6 7 12 13 12 9 18"/>` },
  'cpu':          { o: `<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>` },
  'power':        { o: `<path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>` },
  'settings':     { o: `<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>` },
  'sliders':      { o: `<line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>` },
  'toggle-left':  { o: `<rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="8" cy="12" r="3" fill="currentColor" stroke="none"/>` },
  'toggle-right': { o: `<rect x="1" y="5" width="22" height="14" rx="7"/><circle cx="16" cy="12" r="3" fill="currentColor" stroke="none"/>` },
  'tool':         { o: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>` },
  'palette':      { o: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z"/><circle cx="6.5" cy="11.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="9.5" cy="7.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="14.5" cy="7.5" r="1.25" fill="currentColor" stroke="none"/><circle cx="17.5" cy="11.5" r="1.25" fill="currentColor" stroke="none"/>` },

  /* ── EDICIÓN / TEXTO ─────────────────────────────────── */
  'bold':         { o: `<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>` },
  'italic':       { o: `<line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>` },
  'underline':    { o: `<path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/>` },
  'strikethrough':{ o: `<path d="M17.3 12.3a4.06 4.06 0 0 1-1.7 5.3 6.7 6.7 0 0 1-3.5.9 11.82 11.82 0 0 1-4.2-.8"/><path d="M7.7 7.7A4.64 4.64 0 0 1 12 5.5a11.82 11.82 0 0 1 4.2.8"/><line x1="3" y1="12" x2="21" y2="12"/>` },
  'align-left':   { o: `<line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>` },
  'align-center': { o: `<line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/>` },
  'align-right':  { o: `<line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>` },
  'align-justify':{ o: `<line x1="21" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="3" y2="18"/>` },
  'type':         { o: `<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>` },
  'code':         { o: `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>` },
  'code-2':       { o: `<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>` },
  'terminal':     { o: `<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>` },
  'hash':         { o: `<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>` },
  'at':           { o: `<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/>` },
  'quote':        { o: `<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>` },
  'list-ordered': { o: `<line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>` },
  'list-bullet':  { o: `<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/>` },

  /* ── FINANZAS ────────────────────────────────────────── */
  'credit-card':  { o: `<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>` },
  'dollar':       { o: `<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>` },
  'percent':      { o: `<line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>` },
  'shopping-cart':{ o: `<circle cx="9" cy="21" r="1" fill="currentColor" stroke="none"/><circle cx="20" cy="21" r="1" fill="currentColor" stroke="none"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>` },
  'shopping-bag': { o: `<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>` },
  'package':      { o: `<line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>` },
  'gift':         { o: `<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>` },
  'receipt':      { o: `<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><line x1="16" y1="8" x2="8" y2="8"/><line x1="16" y1="12" x2="8" y2="12"/><line x1="12" y1="16" x2="8" y2="16"/>` },
  'wallet':       { o: `<path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>` },
  'coins':        { o: `<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/>` },

  /* ── PERSONAS ─────────────────────────────────────────── */
  'user':         { o: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
                    f: `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2z" fill="currentColor" stroke="none"/><circle cx="12" cy="7" r="4" fill="currentColor" stroke="none"/>` },
  'users':        { o: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>` },
  'user-plus':    { o: `<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>` },
  'user-minus':   { o: `<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/>` },
  'user-check':   { o: `<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/>` },
  'user-x':       { o: `<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/>` },
  'contact':      { o: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 11a8 8 0 0 0-11.99-.04"/>` },
  'briefcase':    { o: `<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>` },
  'building':     { o: `<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" stroke-linecap="round"/>` },
  'building-2':   { o: `<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2M10 6h4M10 10h4M10 14h4M10 18h4" stroke-linecap="round" stroke-linejoin="round"/>` },
  'bank':         { o: `<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>` },
  'badge':        { o: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>` },
  'award':        { o: `<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>` },
  'team':         { o: `<path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM3 22a9 9 0 1 1 18 0H3z"/>` },

  /* ── MEDIA ────────────────────────────────────────────── */
  'play':         { o: `<polygon points="5 3 19 12 5 21 5 3"/>`,
                    f: `<polygon points="5 3 19 12 5 21 5 3" fill="currentColor" stroke="none"/>` },
  'pause':        { o: `<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>`,
                    f: `<rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none"/>` },
  'stop':         { o: `<rect x="3" y="3" width="18" height="18" rx="2"/>`,
                    f: `<rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor" stroke="none"/>` },
  'skip-back':    { o: `<polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/>` },
  'skip-forward': { o: `<polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/>` },
  'fast-forward': { o: `<polygon points="13 19 22 12 13 5 13 19"/><polygon points="2 19 11 12 2 5 2 19"/>` },
  'rewind':       { o: `<polygon points="11 19 2 12 11 5 11 19"/><polygon points="22 19 13 12 22 5 22 19"/>` },
  'volume':       { o: `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>` },
  'volume-mute':  { o: `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>` },
  'music':        { o: `<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>` },
  'image':        { o: `<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>` },
  'images':       { o: `<rect x="5" y="5" width="16" height="16" rx="2"/><path d="M5 15l4-4 4 4 3-3 4 4"/><circle cx="8" cy="9" r="1"/>` },
  'video-camera': { o: `<path d="M23 7 16 12 23 17V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>` },
  'film':         { o: `<rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/>` },

  /* ── TIEMPO ──────────────────────────────────────────── */
  'clock':        { o: `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>` },
  'clock-2':      { o: `<path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/><path d="M12 6v6l4 2"/>` },
  'timer':        { o: `<path d="M10 2h4"/><path d="M12 14 8 10"/><circle cx="12" cy="14" r="8"/>` },
  'stopwatch':    { o: `<path d="M12 10v4l3 3"/><circle cx="12" cy="14" r="8"/><path d="M9 2h6"/>` },
  'calendar-day': { o: `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>` },
  'calendar-plus':{ o: `<path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="19" y1="16" x2="19" y2="22"/><line x1="16" y1="19" x2="22" y2="19"/>` },
  'sunrise':      { o: `<path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="2" x2="12" y2="9"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="8 6 12 2 16 6"/>` },
  'sunset':       { o: `<path d="M17 18a5 5 0 0 0-10 0"/><line x1="12" y1="9" x2="12" y2="2"/><line x1="4.22" y1="10.22" x2="5.64" y2="11.64"/><line x1="1" y1="18" x2="3" y2="18"/><line x1="21" y1="18" x2="23" y2="18"/><line x1="18.36" y1="11.64" x2="19.78" y2="10.22"/><line x1="23" y1="22" x2="1" y2="22"/><polyline points="16 5 12 9 8 5"/>` },
  'moon':         { o: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>` },
  'sun':          { o: `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>` },
  'hourglass':    { o: `<path d="M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>` },

  /* ── UI ──────────────────────────────────────────────── */
  'loading':      { o: `<line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>` },
  'spinner':      { o: `<path d="M21 12a9 9 0 1 1-6.219-8.56" stroke-linecap="round"/>` },
  'dots':         { o: `<circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/>` },
  'plus-circle':  { o: `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>` },
  'minus-circle': { o: `<circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/>` },
  'x-circle':     { o: `<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>` },
  'slash':        { o: `<circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>` },
  'divide':       { o: `<circle cx="12" cy="6" r="1" fill="currentColor" stroke="none"/><line x1="5" y1="12" x2="19" y2="12"/><circle cx="12" cy="18" r="1" fill="currentColor" stroke="none"/>` },
  'equal':        { o: `<line x1="5" y1="9" x2="19" y2="9"/><line x1="5" y1="15" x2="19" y2="15"/>` },
  'infinity':     { o: `<path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4zm0 0c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z"/>` },
  'map':          { o: `<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>` },
  'map-pin':      { o: `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`,
                    f: `<path d="M12 0C8.13 0 5 3.13 5 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor" stroke="none"/>` },
  'compass':      { o: `<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>` },
  'crosshair':    { o: `<circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>` },
  'target':       { o: `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>` },
  'feather':      { o: `<path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/>` },
  'aperture':     { o: `<circle cx="12" cy="12" r="10"/><line x1="14.31" y1="8" x2="20.05" y2="17.94"/><line x1="9.69" y1="8" x2="21.17" y2="8"/><line x1="7.38" y1="12" x2="13.12" y2="2.06"/><line x1="9.69" y1="16" x2="3.95" y2="6.06"/><line x1="14.31" y1="16" x2="2.83" y2="16"/><line x1="16.62" y1="12" x2="10.88" y2="21.94"/>` },
  'layers':       { o: `<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>` },
  'layout-2':     { o: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>` },
  'panel-left':   { o: `<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="3" y="3" width="7" height="18" rx="1" fill="currentColor" opacity=".2" stroke="none"/>` },
  'panel-top':    { o: `<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="3" y="3" width="18" height="7" rx="1" fill="currentColor" opacity=".2" stroke="none"/>` },
  'split':        { o: `<path d="M16 3h5v5M8 3H3v5M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3M21 3l-7.828 7.828A4 4 0 0 0 12 13.7V22"/>` },
  'expand':       { o: `<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>` },
  'shrink':       { o: `<path d="M15 15h6v6M9 9H3V3M21 21l-7-7M3 3l7 7"/>` },
  'options':      { o: `<circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="5"  r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/>` },
  'drag-2':       { o: `<path d="M5 9h14M5 15h14" stroke-linecap="round" stroke-width="2"/>` },
  'grip':         { o: `<circle cx="9" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="9" cy="17" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="17" r="1" fill="currentColor" stroke="none"/>` },
  'app':          { o: `<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>` },
  'qr-code':      { o: `<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h.01M17 14h3M14 17h3M17 17v3M20 17v.01M14 20h.01"/>` },
  'scan':         { o: `<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/>` },
  'cursor':       { o: `<path d="m4 4 7.07 17 2.51-7.39L21 11.07z"/>` },
  'click':        { o: `<path d="M4.5 9.5V5a2 2 0 0 1 4 0v4.5"/><path d="M8.5 5.5a2 2 0 0 1 4 0v2"/><path d="M12.5 7.5a2 2 0 0 1 4 0v3"/><path d="M16.5 10.5a2 2 0 1 1 4 0v3l-2 5H9.7a2 2 0 0 1-1.96-1.6L6.5 12.5"/>` },
  'selection':    { o: `<path d="M3 3h4v4H3zM17 3h4v4h-4zM3 17h4v4H3zM17 17h4v4h-4z" fill="currentColor" opacity=".3" stroke="none"/><rect x="3" y="3" width="18" height="18" rx="0" fill="none" stroke="currentColor" stroke-dasharray="3 3"/>` },

  /* ── SEGURIDAD ────────────────────────────────────────── */
  'fingerprint':  { o: `<path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5C5.5 18 6 15 6 12c0-3.3 2.7-6 6-6"/><path d="M10 11c0-1.1.9-2 2-2"/><path d="M12 9c2.2 0 4 1.8 4 4 0 1.2-.5 3-1.5 4.5"/><path d="M7 14c.2-1 .6-3 .7-4"/><path d="M16 16c1.4-1 3-1 3.5.5S19 19 16 19c-2 0-4 0-6 2"/>` },
  'security':     { o: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>` },
  'vpn':          { o: `<circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>` },
  'incognito':    { o: `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><circle cx="12" cy="12" r="3"/><line x1="1" y1="1" x2="23" y2="23"/>` },
  'verified':     { o: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/><path d="m8 12 3 3 5-5" stroke-linecap="round" stroke-linejoin="round"/>` },

  /* ── LAYOUT / ESTRUCTURA ─────────────────────────────── */
  'header':       { o: `<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="3" y="3" width="18" height="5" rx="1" fill="currentColor" opacity=".25" stroke="none"/>` },
  'footer':       { o: `<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="3" y="16" width="18" height="5" rx="1" fill="currentColor" opacity=".25" stroke="none"/>` },
  'content':      { o: `<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="3" y="8" width="18" height="8" rx="0" fill="currentColor" opacity=".15" stroke="none"/>` },
  'widget':       { o: `<rect x="2" y="3" width="9" height="9" rx="2"/><rect x="13" y="3" width="9" height="5" rx="2"/><rect x="13" y="12" width="9" height="9" rx="2"/><rect x="2" y="16" width="9" height="5" rx="2"/>` },
  'window':       { o: `<rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 9h20M7 3v6"/>` },
  'card':         { o: `<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>` },
  'form':         { o: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/>` },

  /* ── AGILE / BOARDS ──────────────────────────────────── */
  'book-open':    { o: `<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>` },
  'bug':          { o: `<rect x="8" y="6" width="8" height="14" rx="4"/><path d="m19 7-3 2"/><path d="m5 7 3 2"/><path d="m19 19-3-2"/><path d="m5 19 3-2"/><path d="M20 13h-4"/><path d="M4 13h4"/><path d="m10 4 1-2 1 2"/>` },
  'lightning':    { o: `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>` },
};

/* ============================================================
   MTS.Icon — API pública
   ============================================================ */

MTS.Icon = {

  /* SVG base con viewBox, stroke y fill por defecto */
  _svg(paths, filled = false) {
    const arr = Array.isArray(paths) ? paths : [paths];
    const content = arr.join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`;
  },

  /* Obtener SVG string de un ícono
     get('trash')               → outline SVG
     get('trash', true)         → filled SVG           */
  get(name, filled = false) {
    /* Búsqueda tolerante + defensiva:
       - Acepta el nombre pelado ('trash') y la forma de clase CSS
         ('mts-icon-trash'), recortando espacios → funciona con y sin prefijo.
       - Valida charset y largo: un nombre real es [a-z0-9-] y a lo sumo ~26
         chars con prefijo ('mts-icon-arrow-down-circle'); cualquier cosa rara
         (markup, strings enormes, prefijos inválidos) se rechaza temprano.
       - Lookup por propiedad PROPIA: evita que claves heredadas del prototipo
         ('constructor', '__proto__', 'toString') resuelvan a basura.
       Nota: el `name` nunca se interpola en el SVG devuelto → sin vector XSS. */
    let key = String(name == null ? '' : name).trim();
    if (key.indexOf('mts-icon-') === 0) key = key.slice(9); // 'mts-icon-' = 9 chars

    const valid = /^[a-z0-9-]{1,32}$/.test(key);
    const icon = (valid && Object.prototype.hasOwnProperty.call(ICONS, key)) ? ICONS[key] : null;
    if (!icon) {
      console.warn(`[MTS.Icon] Ícono no encontrado: "${name}"`);
      return this._svg(`<circle cx="12" cy="12" r="9" stroke-dasharray="3 3"/>`, false);
    }
    const paths = filled && icon.f ? icon.f : icon.o;
    return this._svg(paths, filled && !!icon.f);
  },

  /* Insertar SVG en un elemento DOM
     render('trash', document.getElementById('mi-icono'))
     render('trash', el, true)  → filled               */
  render(name, el, filled = false) {
    if (!el) return;
    el.innerHTML = this.get(name, filled);
  },

  /* Lista de todos los nombres de íconos disponibles */
  list() {
    return Object.keys(ICONS).sort();
  },

  /* Inicializar todos los <i class="mts-icon mts-icon-*"> del DOM
     Llamar una vez tras cargar el DOM.
     Se llama automáticamente en DOMContentLoaded.            */
  initAll(root = document) {
    root.querySelectorAll('[class*="mts-icon-"]').forEach(el => {
      /* Extraer nombre del ícono desde las clases */
      const cls    = [...el.classList];
      const prefix = cls.find(c => c.startsWith('mts-icon-') && c !== 'mts-icon');
      if (!prefix) return;
      const name   = prefix.replace('mts-icon-', '');
      const filled = el.classList.contains('mts-icon--filled');
      el.innerHTML = this.get(name, filled);
      el.setAttribute('aria-hidden', 'true');
    });
  },
};

/* Auto-inicializar en DOMContentLoaded */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => MTS.Icon.initAll());
} else {
  MTS.Icon.initAll();
}

/* Observar cambios en el DOM para inicializar íconos dinámicos */
if (typeof MutationObserver !== 'undefined') {
  const _startObserver = () => {
    if (!document.body) return;
    const observer = new MutationObserver(mutations => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          if (node.classList?.contains('mts-icon')) MTS.Icon.initAll(node.parentElement);
          else if (node.querySelectorAll?.('[class*="mts-icon-"]').length) MTS.Icon.initAll(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _startObserver);
  } else {
    _startObserver();
  }
}
