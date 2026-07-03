/* ============================================================
   MATIOS UI — matios-ui-drawer-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Drawer
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.Drawer': {
      closeLabel: 'Cerrar',
      demo: {
        subtitle:           'Panel lateral deslizante — izquierda, derecha, arriba, abajo · sm/md/lg/full · modo estático.',
        s1Title:            '1 — Posiciones',
        s2Title:            '2 — Tamaños',
        s3Title:            '3 — Estático (no cierra con Esc/backdrop) + API',
        contentPosition:    'Posición del drawer: ',
        contentHint:        'Haz click fuera o presiona Esc para cerrar.',
        resultPlaceholder:  '— abre un drawer —',
        onOpenPrefix:       'onOpen → posición: ',
        onClosePrefix:      'onClose → ',
        titleRight:         'Drawer derecho',
        titleLeft:          'Drawer izquierdo',
        titleTop:           'Drawer superior',
        titleBottom:        'Panel inferior',
        titleSmall:         'Pequeño (sm)',
        titleMedium:        'Mediano (md)',
        titleLarge:         'Grande (lg)',
        titleFull:          'Ancho completo',
        titleStatic:        'Drawer estático',
        staticLine1:        'Este drawer <strong>no cierra</strong> con Esc ni haciendo click en el backdrop.',
        staticLine2:        'Solo cierra con el botón ×.'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.Drawer': {
      closeLabel: 'Close',
      demo: {
        subtitle:           'Sliding side panel — left, right, top, bottom · sm/md/lg/full · static mode.',
        s1Title:            '1 — Positions',
        s2Title:            '2 — Sizes',
        s3Title:            '3 — Static (does not close with Esc/backdrop) + API',
        contentPosition:    'Drawer position: ',
        contentHint:        'Click outside or press Esc to close.',
        resultPlaceholder:  '— open a drawer —',
        onOpenPrefix:       'onOpen → position: ',
        onClosePrefix:      'onClose → ',
        titleRight:         'Right drawer',
        titleLeft:          'Left drawer',
        titleTop:           'Top drawer',
        titleBottom:        'Bottom sheet',
        titleSmall:         'Small (sm)',
        titleMedium:        'Medium (md)',
        titleLarge:         'Large (lg)',
        titleFull:          'Full width',
        titleStatic:        'Static drawer',
        staticLine1:        'This drawer <strong>does not close</strong> with Esc nor by clicking the backdrop.',
        staticLine2:        'It only closes with the × button.'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.Drawer': {
      closeLabel: 'Fechar',
      demo: {
        subtitle:           'Painel lateral deslizante — esquerda, direita, topo, base · sm/md/lg/full · modo estático.',
        s1Title:            '1 — Posições',
        s2Title:            '2 — Tamanhos',
        s3Title:            '3 — Estático (não fecha com Esc/backdrop) + API',
        contentPosition:    'Posição do drawer: ',
        contentHint:        'Clique fora ou pressione Esc para fechar.',
        resultPlaceholder:  '— abra um drawer —',
        onOpenPrefix:       'onOpen → posição: ',
        onClosePrefix:      'onClose → ',
        titleRight:         'Drawer direito',
        titleLeft:          'Drawer esquerdo',
        titleTop:           'Drawer superior',
        titleBottom:        'Painel inferior',
        titleSmall:         'Pequeno (sm)',
        titleMedium:        'Médio (md)',
        titleLarge:         'Grande (lg)',
        titleFull:          'Largura total',
        titleStatic:        'Drawer estático',
        staticLine1:        'Este drawer <strong>não fecha</strong> com Esc nem clicando no backdrop.',
        staticLine2:        'Fecha apenas com o botão ×.'
      }
    }
  });

})(window);
