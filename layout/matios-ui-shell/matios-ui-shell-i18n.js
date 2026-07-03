/* ============================================================
   MATIOS UI — matios-ui-shell-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Shell
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.Shell': {
      demo: {
        subtitle:        'Orquestador de layout. Aplica CSS Grid al elemento raíz y asigna áreas nombradas a cada slot. No crea ni mueve elementos — solo agrega clases.',
        s1Title:         '1 — Combinaciones de layout',
        s2Title:         '2 — Preview interactivo',
        s3Title:         '3 — Patrón Masterpage',
        cardMainOnly:    'Solo main',
        cardTop:         'top',
        cardSide:        'side',
        cardStatus:      'status',
        cardTopSide:     'top + side',
        cardTopStatus:   'top + status',
        cardSideStatus:  'side + status',
        cardFull:        'top + side + status',
        toggleTopbar:    'Topbar',
        toggleSidenav:   'SideNav',
        toggleStatusbar: 'StatusBar',
        slotTopbar:      'Topbar',
        slotSide:        'Side',
        slotStatusbar:   'StatusBar',
        slotMain:        'main',
        slotMainMaster:  'main (masterpage)'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.Shell': {
      demo: {
        subtitle:        'Layout orchestrator. Applies CSS Grid to the root element and assigns named areas to each slot. It does not create or move elements — it only adds classes.',
        s1Title:         '1 — Layout combinations',
        s2Title:         '2 — Interactive preview',
        s3Title:         '3 — Masterpage pattern',
        cardMainOnly:    'Main only',
        cardTop:         'top',
        cardSide:        'side',
        cardStatus:      'status',
        cardTopSide:     'top + side',
        cardTopStatus:   'top + status',
        cardSideStatus:  'side + status',
        cardFull:        'top + side + status',
        toggleTopbar:    'Topbar',
        toggleSidenav:   'SideNav',
        toggleStatusbar: 'StatusBar',
        slotTopbar:      'Topbar',
        slotSide:        'Side',
        slotStatusbar:   'StatusBar',
        slotMain:        'main',
        slotMainMaster:  'main (masterpage)'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.Shell': {
      demo: {
        subtitle:        'Orquestrador de layout. Aplica CSS Grid ao elemento raiz e atribui áreas nomeadas a cada slot. Não cria nem move elementos — apenas adiciona classes.',
        s1Title:         '1 — Combinações de layout',
        s2Title:         '2 — Preview interativo',
        s3Title:         '3 — Padrão Masterpage',
        cardMainOnly:    'Somente main',
        cardTop:         'top',
        cardSide:        'side',
        cardStatus:      'status',
        cardTopSide:     'top + side',
        cardTopStatus:   'top + status',
        cardSideStatus:  'side + status',
        cardFull:        'top + side + status',
        toggleTopbar:    'Topbar',
        toggleSidenav:   'SideNav',
        toggleStatusbar: 'StatusBar',
        slotTopbar:      'Topbar',
        slotSide:        'Side',
        slotStatusbar:   'StatusBar',
        slotMain:        'main',
        slotMainMaster:  'main (masterpage)'
      }
    }
  });

})(window);
