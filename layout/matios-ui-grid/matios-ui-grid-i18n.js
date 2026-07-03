/* ============================================================
   MATIOS UI — matios-ui-grid-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Grid
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.Grid': {
      demo: {
        subtitle:        'Distribución estructural de página con CSS Grid nativo, spans responsivos y helpers de layout.',
        alertTitle:      'Apoyo visual usado en este demo',
        alertMessagePre: 'Esta página solo usa ',
        alertMessageMid: ' y ',
        alertMessageEnd: ' de ',
        alertMessageTail:' para que los límites de la grilla se lean con más facilidad.',
        s1Title:         '1 — Dos mitades',
        s1Desc:          'División básica de 12 columnas usando dos spans iguales de 6/6.',
        s2Title:         '2 — Tres columnas iguales',
        s2Desc:          'Mismo peso visual entre tres bloques de contenido.',
        s3Title:         '3 — Principal + barra lateral',
        s3Desc:          'Un layout clásico 8/4 para la composición de contenido y barra lateral.',
        s4Title:         '4 — Responsivo 12 → 6 → 4',
        s4Desc:          'Se apila en pantallas pequeñas y se redistribuye a medida que crece el espacio.',
        s5Title:         '5 — Columna de inicio + ancho completo',
        s5Desc:          'Ubica un bloque que comienza más adelante en la grilla y fuerza una fila de ancho completo cuando se necesita.',
        s6Title:         '6 — Escala de separación',
        s6Desc:          'Compara separación pequeña, media y grande sin cambiar el contrato de columnas.',
        s7Title:         '7 — Alineación vertical',
        s7Desc:          'Usa la autoalineación del ítem cuando bloques con distintas alturas necesitan distintos anclajes.',
        s8Title:         '8 — Span de fila',
        s8Desc:          'Deja que un ítem abarque más de una fila mientras el resto fluye a su alrededor.',
        s9Title:         '9 — Helpers de barra lateral',
        s9Desc:          'Usa los atajos integrados para layouts comunes de barra lateral o estructura de página.',
        s10Title:        '10 — Auto ajuste',
        s10Desc:         'Ajusta automáticamente tantas columnas como permita el ancho disponible.',
        s11Title:        '11 — API de JavaScript',
        s11Desc:         'El helper renderiza el mismo contrato CSS. No inventa un segundo sistema de layout.'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.Grid': {
      demo: {
        subtitle:        'Structural page layout with native CSS Grid, responsive spans and layout helpers.',
        alertTitle:      'Visual support used in this demo',
        alertMessagePre: 'This page only uses ',
        alertMessageMid: ' and ',
        alertMessageEnd: ' from ',
        alertMessageTail:' to make the grid boundaries easier to read.',
        s1Title:         '1 — Two halves',
        s1Desc:          'Basic 12-column split using two equal 6/6 spans.',
        s2Title:         '2 — Three equal columns',
        s2Desc:          'Same visual weight across three content blocks.',
        s3Title:         '3 — Main + sidebar',
        s3Desc:          'A classic 8/4 layout for content and sidebar composition.',
        s4Title:         '4 — Responsive 12 → 6 → 4',
        s4Desc:          'Stacks on small screens and redistributes as space grows.',
        s5Title:         '5 — Start column + full width',
        s5Desc:          'Place a block starting later in the grid and force a full-width row when needed.',
        s6Title:         '6 — Gap scale',
        s6Desc:          'Compare small, medium and large spacing without changing the column contract.',
        s7Title:         '7 — Vertical alignment',
        s7Desc:          'Use item self-alignment when blocks with different heights need different anchors.',
        s8Title:         '8 — Row span',
        s8Desc:          'Let one item span more than one row while the rest flows around it.',
        s9Title:         '9 — Sidebar helpers',
        s9Desc:          'Use the built-in shortcuts for common sidebar/page shell layouts.',
        s10Title:        '10 — Auto fit',
        s10Desc:         'Automatically fit as many columns as the available width allows.',
        s11Title:        '11 — JavaScript API',
        s11Desc:         'The helper renders the same CSS contract. It does not invent a second layout system.'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.Grid': {
      demo: {
        subtitle:        'Layout estrutural de página com CSS Grid nativo, spans responsivos e helpers de layout.',
        alertTitle:      'Apoio visual usado nesta demonstração',
        alertMessagePre: 'Esta página usa apenas ',
        alertMessageMid: ' e ',
        alertMessageEnd: ' de ',
        alertMessageTail:' para tornar os limites da grade mais fáceis de ler.',
        s1Title:         '1 — Duas metades',
        s1Desc:          'Divisão básica de 12 colunas usando dois spans iguais de 6/6.',
        s2Title:         '2 — Três colunas iguais',
        s2Desc:          'Mesmo peso visual entre três blocos de conteúdo.',
        s3Title:         '3 — Principal + barra lateral',
        s3Desc:          'Um layout clássico 8/4 para a composição de conteúdo e barra lateral.',
        s4Title:         '4 — Responsivo 12 → 6 → 4',
        s4Desc:          'Empilha em telas pequenas e se redistribui à medida que o espaço cresce.',
        s5Title:         '5 — Coluna de início + largura total',
        s5Desc:          'Posicione um bloco que começa mais adiante na grade e force uma linha de largura total quando necessário.',
        s6Title:         '6 — Escala de espaçamento',
        s6Desc:          'Compare espaçamento pequeno, médio e grande sem alterar o contrato de colunas.',
        s7Title:         '7 — Alinhamento vertical',
        s7Desc:          'Use o autoalinhamento do item quando blocos com alturas diferentes precisarem de âncoras diferentes.',
        s8Title:         '8 — Span de linha',
        s8Desc:          'Deixe um item abranger mais de uma linha enquanto o restante flui ao seu redor.',
        s9Title:         '9 — Helpers de barra lateral',
        s9Desc:          'Use os atalhos integrados para layouts comuns de barra lateral ou estrutura de página.',
        s10Title:        '10 — Auto ajuste',
        s10Desc:         'Ajusta automaticamente quantas colunas a largura disponível permitir.',
        s11Title:        '11 — API JavaScript',
        s11Desc:         'O helper renderiza o mesmo contrato CSS. Não inventa um segundo sistema de layout.'
      }
    }
  });

})(window);
