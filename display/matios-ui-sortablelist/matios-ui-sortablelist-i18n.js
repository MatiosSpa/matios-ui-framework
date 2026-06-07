/* ============================================================
   MATIOS UI — matios-ui-sortablelist-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.SortableList
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.SortableList': {
      demo: {
        subtitle:                'Lista reordenable por arrastre — numerada, botones de mover, íconos, badges y controles de API.',
        s1Title:                 '1 — Flujo de aprobaciones',
        s2Title:                 '2 — Lista de prioridades — íconos y meta',
        s3Title:                 '3 — Variantes',
        s4Title:                 '4 — API — addItem · removeItem · lock · unlock',

        resultPlaceholder:       '— reordena la lista —',
        apiResultPlaceholder:    '— usa los botones —',

        wfTitle1:                'Revisión de diseño',
        wfTitle2:                'API Backend',
        wfTitle3:                'Pruebas QA',
        wfTitle4:                'Despliegue a producción',
        wfTitle5:                'Documentar changelog',
        badgePending:            'Pendiente',
        badgeInProgress:         'En progreso',
        badgeBlocked:            'Bloqueado',
        badgeTodo:               'Por hacer',

        echoReorder:             'onReorder → desde:',
        echoReorderTo:           ' hasta:',
        echoItemClick:           'onItemClick → ',
        echoApiReorder:          'reordenado → ',

        newItemPrefix:           'Nuevo ítem #'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.SortableList': {
      demo: {
        subtitle:                'Drag-and-drop sortable list — numbered, move buttons, icons, badges and API controls.',
        s1Title:                 '1 — Approval workflow',
        s2Title:                 '2 — Priority list — icons and meta',
        s3Title:                 '3 — Variants',
        s4Title:                 '4 — API — addItem · removeItem · lock · unlock',

        resultPlaceholder:       '— reorder the list —',
        apiResultPlaceholder:    '— use the buttons —',

        wfTitle1:                'Design review',
        wfTitle2:                'Backend API',
        wfTitle3:                'QA testing',
        wfTitle4:                'Deploy to production',
        wfTitle5:                'Document changelog',
        badgePending:            'Pending',
        badgeInProgress:         'In progress',
        badgeBlocked:            'Blocked',
        badgeTodo:               'Todo',

        echoReorder:             'onReorder → from:',
        echoReorderTo:           ' to:',
        echoItemClick:           'onItemClick → ',
        echoApiReorder:          'reordered → ',

        newItemPrefix:           'New item #'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.SortableList': {
      demo: {
        subtitle:                'Lista reordenável por arrastar — numerada, botões de mover, ícones, badges e controles de API.',
        s1Title:                 '1 — Fluxo de aprovações',
        s2Title:                 '2 — Lista de prioridades — ícones e meta',
        s3Title:                 '3 — Variantes',
        s4Title:                 '4 — API — addItem · removeItem · lock · unlock',

        resultPlaceholder:       '— reordene a lista —',
        apiResultPlaceholder:    '— use os botões —',

        wfTitle1:                'Revisão de design',
        wfTitle2:                'API Backend',
        wfTitle3:                'Testes QA',
        wfTitle4:                'Implantação em produção',
        wfTitle5:                'Documentar changelog',
        badgePending:            'Pendente',
        badgeInProgress:         'Em andamento',
        badgeBlocked:            'Bloqueado',
        badgeTodo:               'A fazer',

        echoReorder:             'onReorder → de:',
        echoReorderTo:           ' para:',
        echoItemClick:           'onItemClick → ',
        echoApiReorder:          'reordenado → ',

        newItemPrefix:           'Novo item #'
      }
    }
  });

})(window);
