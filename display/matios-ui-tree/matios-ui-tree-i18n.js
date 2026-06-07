/* ============================================================
   MATIOS UI — matios-ui-tree-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Tree
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Tree': {
      demo: {
        subtitle:                'Vista de árbol con expandir/colapsar, selección, checkboxes y API básica para escenarios jerárquicos.',
        s1Title:                 '1 — Básico colapsable — árbol de archivos',
        s2Title:                 '2 — Seleccionable + onSelect',
        s3Title:                 '3 — Marcable con propagación a hijos',
        s4Title:                 '4 — Badges + íconos personalizados + API',
        labelLinesDefault:       'showLines: true (por defecto)',
        labelLinesOff:           'showLines: false',
        selectPlaceholder:       '— haz click en un nodo —',
        checkPlaceholder:        '— marca/desmarca checkboxes —',
        apiPlaceholder:          '— usa la API —',
        selectEchoPrefix:        'onSelect → id: ',
        selectEchoPath:          ' path: ',
        checkEchoPrefix:         'onCheck → marcado: ',
        checkEchoIds:            ' ids: ',
        selectedPrefix:          'seleccionado → ',
        apiPrefix:               'API → '
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Tree': {
      demo: {
        subtitle:                'Tree view with expand/collapse, selection, checkboxes and a basic API for hierarchical scenarios.',
        s1Title:                 '1 — Collapsible basics — file tree',
        s2Title:                 '2 — Selectable + onSelect',
        s3Title:                 '3 — Checkable with child propagation',
        s4Title:                 '4 — Badges + custom icons + API',
        labelLinesDefault:       'showLines: true (default)',
        labelLinesOff:           'showLines: false',
        selectPlaceholder:       '— click a node —',
        checkPlaceholder:        '— check/uncheck checkboxes —',
        apiPlaceholder:          '— use the API —',
        selectEchoPrefix:        'onSelect → id: ',
        selectEchoPath:          ' path: ',
        checkEchoPrefix:         'onCheck → checked: ',
        checkEchoIds:            ' ids: ',
        selectedPrefix:          'selected → ',
        apiPrefix:               'API → '
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Tree': {
      demo: {
        subtitle:                'Visualização em árvore com expandir/recolher, seleção, checkboxes e uma API básica para cenários hierárquicos.',
        s1Title:                 '1 — Básico recolhível — árvore de arquivos',
        s2Title:                 '2 — Selecionável + onSelect',
        s3Title:                 '3 — Marcável com propagação aos filhos',
        s4Title:                 '4 — Badges + ícones personalizados + API',
        labelLinesDefault:       'showLines: true (padrão)',
        labelLinesOff:           'showLines: false',
        selectPlaceholder:       '— clique em um nó —',
        checkPlaceholder:        '— marque/desmarque checkboxes —',
        apiPlaceholder:          '— use a API —',
        selectEchoPrefix:        'onSelect → id: ',
        selectEchoPath:          ' path: ',
        checkEchoPrefix:         'onCheck → marcado: ',
        checkEchoIds:            ' ids: ',
        selectedPrefix:          'selecionado → ',
        apiPrefix:               'API → '
      }
    }
  });

})(window);
