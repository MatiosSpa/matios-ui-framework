/* ============================================================
   MATIOS UI — matios-ui-splitter-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Splitter
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Splitter': {
      demo: {
        subtitle:            'Paneles redimensionables con drag. Horizontal, vertical y colapsable.',
        s1Title:             '1 — Horizontal — arrastra el divisor',
        s2Title:             '2 — Vertical + colapsable con doble click',
        panelLeftTitle:      'Panel izquierdo',
        panelLeftText:       'Arrastra el divisor central para redimensionar los paneles.',
        panelRightTitle:     'Panel derecho',
        panelRightText:      'El tamaño mínimo es 15% y el máximo 85%.',
        panelTopTitle:       'Panel superior',
        panelTopText:        'Doble click en el divisor para colapsar el panel inferior.',
        panelBottomTitle:    'Panel inferior',
        panelBottomText:     'Restaura haciendo doble click nuevamente en el divisor.',
        resultPlaceholder:   '— arrastra el divisor —',
        onChangePrefix:      'onChange → primer panel: ',
        onChangeMid:         '% | segundo: ',
        getSizesPrefix:      'getSizes() → ',
        loading:             'Cargando...',
        errorLabel:          'Error.'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Splitter': {
      demo: {
        subtitle:            'Resizable panels with drag. Horizontal, vertical and collapsible.',
        s1Title:             '1 — Horizontal — drag the divider',
        s2Title:             '2 — Vertical + collapsible with double click',
        panelLeftTitle:      'Left panel',
        panelLeftText:       'Drag the central divider to resize the panels.',
        panelRightTitle:     'Right panel',
        panelRightText:      'The minimum size is 15% and the maximum is 85%.',
        panelTopTitle:       'Top panel',
        panelTopText:        'Double-click the divider to collapse the bottom panel.',
        panelBottomTitle:    'Bottom panel',
        panelBottomText:     'Restore by double-clicking the divider again.',
        resultPlaceholder:   '— drag the divider —',
        onChangePrefix:      'onChange → first panel: ',
        onChangeMid:         '% | second: ',
        getSizesPrefix:      'getSizes() → ',
        loading:             'Loading...',
        errorLabel:          'Error.'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Splitter': {
      demo: {
        subtitle:            'Painéis redimensionáveis com arraste. Horizontal, vertical e recolhível.',
        s1Title:             '1 — Horizontal — arraste o divisor',
        s2Title:             '2 — Vertical + recolhível com clique duplo',
        panelLeftTitle:      'Painel esquerdo',
        panelLeftText:       'Arraste o divisor central para redimensionar os painéis.',
        panelRightTitle:     'Painel direito',
        panelRightText:      'O tamanho mínimo é 15% e o máximo 85%.',
        panelTopTitle:       'Painel superior',
        panelTopText:        'Clique duplo no divisor para recolher o painel inferior.',
        panelBottomTitle:    'Painel inferior',
        panelBottomText:     'Restaure clicando duas vezes novamente no divisor.',
        resultPlaceholder:   '— arraste o divisor —',
        onChangePrefix:      'onChange → primeiro painel: ',
        onChangeMid:         '% | segundo: ',
        getSizesPrefix:      'getSizes() → ',
        loading:             'Carregando...',
        errorLabel:          'Erro.'
      }
    }
  });

})(window);
