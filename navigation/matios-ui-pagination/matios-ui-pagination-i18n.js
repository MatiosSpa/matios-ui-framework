/* ============================================================
   MATIOS UI — matios-ui-pagination-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Pagination
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Pagination': {
      demo: {
        subtitle:            'Paginación completa — selector de page size, resumen de registros, ir a página, variantes de tamaño.',
        s1Title:             '1 — Básico con onChange',
        s2Title:             '2 — Con jump + tamaños',
        s3Title:             '3 — API — setPage, setTotal, setPageSize',
        s4Title:             '4 — siblings — páginas visibles a cada lado',
        resultPagePlaceholder: '— cambia de página —',
        resultApiPlaceholder:  '— usa los botones —',
        onChangePrefix:      'onChange → página: ',
        pageSizeLabel:       ' | page size: ',
        fromLabel:           ' | desde: ',
        toLabel:             ' hasta: ',
        setTotalDone:        'setTotal(500) ✓',
        setPageSizeDone:     'setPageSize(50) ✓'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Pagination': {
      demo: {
        subtitle:            'Full pagination — page size selector, record summary, jump-to-page, size variants.',
        s1Title:             '1 — Basic with onChange',
        s2Title:             '2 — With jump + sizes',
        s3Title:             '3 — API — setPage, setTotal, setPageSize',
        s4Title:             '4 — siblings — visible pages on each side',
        resultPagePlaceholder: '— change the page —',
        resultApiPlaceholder:  '— use the buttons —',
        onChangePrefix:      'onChange → page: ',
        pageSizeLabel:       ' | page size: ',
        fromLabel:           ' | from: ',
        toLabel:             ' to: ',
        setTotalDone:        'setTotal(500) ✓',
        setPageSizeDone:     'setPageSize(50) ✓'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Pagination': {
      demo: {
        subtitle:            'Paginação completa — seletor de page size, resumo de registros, ir para página, variantes de tamanho.',
        s1Title:             '1 — Básico com onChange',
        s2Title:             '2 — Com jump + tamanhos',
        s3Title:             '3 — API — setPage, setTotal, setPageSize',
        s4Title:             '4 — siblings — páginas visíveis de cada lado',
        resultPagePlaceholder: '— mude de página —',
        resultApiPlaceholder:  '— use os botões —',
        onChangePrefix:      'onChange → página: ',
        pageSizeLabel:       ' | page size: ',
        fromLabel:           ' | de: ',
        toLabel:             ' até: ',
        setTotalDone:        'setTotal(500) ✓',
        setPageSizeDone:     'setPageSize(50) ✓'
      }
    }
  });

})(window);
