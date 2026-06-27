/* ============================================================
   MATIOS UI — matios-ui-popover-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Popover
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Popover': {
      demo: {
        subtitle:           'Tooltip enriquecido — título, cuerpo HTML, flecha, posiciones, disparo por click/hover.',
        s1Title:            '1 — Posiciones (disparo por click)',
        s2Title:            '2 — Hover + contenido HTML rico',
        resultPlaceholder:  '— haz click en un botón —',
        btnTop:             'Arriba',
        btnBottom:          'Abajo',
        btnLeft:            'Izquierda',
        btnRight:           'Derecha',
        bodyPositions:      'Contenido con <strong>HTML</strong> y posicionamiento inteligente.',
        btnHover:           'Pásame el mouse',
        btnRichHtml:        'HTML rico',
        btnNoClose:         'Sin × cerrar',
        btnWide:            'Popover ancho',
        titleProTip:        'Pro tip',
        bodyProTip:         'Usa <kbd>⌘S</kbd> para guardar rápido.',
        titleProfile:       'Perfil de usuario',
        titleInfo:          'Info',
        bodyInfo:           'Click fuera para cerrar.',
        titleDetails:       'Detalles',
        bodyDetails:        'Este popover tiene un ancho mayor para mostrar más contenido.'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Popover': {
      demo: {
        subtitle:           'Rich tooltip — title, HTML body, arrow, positions, click/hover trigger.',
        s1Title:            '1 — Positions (click trigger)',
        s2Title:            '2 — Hover + rich HTML content',
        resultPlaceholder:  '— click a button —',
        btnTop:             'Top',
        btnBottom:          'Bottom',
        btnLeft:            'Left',
        btnRight:           'Right',
        bodyPositions:      'Content with <strong>HTML</strong> and smart positioning.',
        btnHover:           'Hover me',
        btnRichHtml:        'Rich HTML',
        btnNoClose:         'No × close',
        btnWide:            'Wide popover',
        titleProTip:        'Pro tip',
        bodyProTip:         'Use <kbd>⌘S</kbd> to save quickly.',
        titleProfile:       'User profile',
        titleInfo:          'Info',
        bodyInfo:           'Click outside to close.',
        titleDetails:       'Details',
        bodyDetails:        'This popover has a larger width to show more content.'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Popover': {
      demo: {
        subtitle:           'Tooltip enriquecido — título, corpo HTML, seta, posições, disparo por clique/hover.',
        s1Title:            '1 — Posições (disparo por clique)',
        s2Title:            '2 — Hover + conteúdo HTML rico',
        resultPlaceholder:  '— clique em um botão —',
        btnTop:             'Acima',
        btnBottom:          'Abaixo',
        btnLeft:            'Esquerda',
        btnRight:           'Direita',
        bodyPositions:      'Conteúdo com <strong>HTML</strong> e posicionamento inteligente.',
        btnHover:           'Passe o mouse',
        btnRichHtml:        'HTML rico',
        btnNoClose:         'Sem × fechar',
        btnWide:            'Popover largo',
        titleProTip:        'Dica pro',
        bodyProTip:         'Use <kbd>⌘S</kbd> para salvar rápido.',
        titleProfile:       'Perfil de usuário',
        titleInfo:          'Info',
        bodyInfo:           'Clique fora para fechar.',
        titleDetails:       'Detalhes',
        bodyDetails:        'Este popover tem uma largura maior para mostrar mais conteúdo.'
      }
    }
  });

})(window);
