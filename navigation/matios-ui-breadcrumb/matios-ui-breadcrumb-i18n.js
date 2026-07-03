/* ============================================================
   MATIOS UI — matios-ui-breadcrumb-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Breadcrumb
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Breadcrumb': {
      navLabel:    'Ruta de navegación',
      expandLabel: 'Mostrar ruta completa',
      demo: {
        subtitle:            'Ruta de navegación — separador personalizado, íconos, colapso de desbordamiento, ítems dinámicos.',
        s1Title:             '1 — Básico con onClick',
        s2Title:             '2 — Separadores personalizados',
        s3Title:             '3 — Con íconos',
        s4Title:             '4 — Colapso con maxItems + API',
        resultBasicPlaceholder: '— haz click en un ítem —',
        resultApiPlaceholder:   '— usa los botones —',
        clickPrefix:         'onClick → etiqueta: ',
        clickIndex:          ' | índice: ',
        clickShort:          'onClick → ',
        pushResult:          'push() ✓ — ',
        popResult:           'pop() ✓ — ',
        setItemsResult:      'setItems() ✓',
        itemsSuffix:         ' ítems',
        exampleCategory:     'Categoría',
        exampleCurrentPage:  'Página actual'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Breadcrumb': {
      navLabel:    'Breadcrumb',
      expandLabel: 'Show full path',
      demo: {
        subtitle:            'Navigation breadcrumb — custom separator, icons, collapsible overflow, dynamic items.',
        s1Title:             '1 — Basic with onClick',
        s2Title:             '2 — Custom separators',
        s3Title:             '3 — With icons',
        s4Title:             '4 — Collapsible with maxItems + API',
        resultBasicPlaceholder: '— click an item —',
        resultApiPlaceholder:   '— use the buttons —',
        clickPrefix:         'onClick → label: ',
        clickIndex:          ' | index: ',
        clickShort:          'onClick → ',
        pushResult:          'push() ✓ — ',
        popResult:           'pop() ✓ — ',
        setItemsResult:      'setItems() ✓',
        itemsSuffix:         ' items',
        exampleCategory:     'Category',
        exampleCurrentPage:  'Current page'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Breadcrumb': {
      navLabel:    'Trilha de navegação',
      expandLabel: 'Mostrar caminho completo',
      demo: {
        subtitle:            'Trilha de navegação — separador personalizado, ícones, recolhimento de excesso, itens dinâmicos.',
        s1Title:             '1 — Básico com onClick',
        s2Title:             '2 — Separadores personalizados',
        s3Title:             '3 — Com ícones',
        s4Title:             '4 — Recolhimento com maxItems + API',
        resultBasicPlaceholder: '— clique em um item —',
        resultApiPlaceholder:   '— use os botões —',
        clickPrefix:         'onClick → rótulo: ',
        clickIndex:          ' | índice: ',
        clickShort:          'onClick → ',
        pushResult:          'push() ✓ — ',
        popResult:           'pop() ✓ — ',
        setItemsResult:      'setItems() ✓',
        itemsSuffix:         ' itens',
        exampleCategory:     'Categoria',
        exampleCurrentPage:  'Página atual'
      }
    }
  });

})(window);
