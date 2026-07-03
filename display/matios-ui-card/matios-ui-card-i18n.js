/* ============================================================
   MATIOS UI — matios-ui-card-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Card
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.Card': {
      demo: {
        subtitle:            'Card genérica — header, body, footer, imagen, variantes, hoverable, clickable, acciones.',
        s1Title:             '1 — Solo CSS (sin JS)',
        s2Title:             '2 — Variantes de color',
        s3Title:             '3 — Hoverable y clickable',
        s4Title:             '4 — Con imagen y acciones',
        s5Title:             '5 — Borde y radio — opcional',

        variantBody:         'Card con variante ',
        hoverBody:           'Pasa el cursor para ver el efecto de elevación.',
        clickBody:           'Haz click en cualquier parte de la card.',
        clickResultPlaceholder: '— haz click en la card clickeable —',
        clickResult:         'onClick → card clickeada ✓',

        imageBody:           'Botas de senderismo premium para terreno difícil.',
        checkoutBody:        'Completa tu compra.',
        actionResultPlaceholder: '— usa los botones de las cards —',
        editLabel:           'Editar',
        deleteLabel:         'Borrar',
        cancelLabel:         'Cancelar',
        buyLabel:            'Comprar',
        actionPrefix:        'action → ',
        footerPrefix:        'footer → ',

        brDefaultTitle:      'Por defecto',
        brDefaultBody:       'radius-lg + borde base (igual que hoy)',
        brSharpTitle:        'Recto',
        brSharpBody:         'radius:none + border:1',
        brSharpNoBorderTitle:'Recto sin borde',
        brSharpNoBorderBody: 'radius:none + border:none',
        brSmallTitle:        'Chico + grueso',
        brSmallBody:         'radius:sm + border:2',
        brPillTitle:         'Píldora',
        brPillBody:          'radius:full',
        brElevatedTitle:     'Elevado + recto',
        brElevatedBody:      'variant elevated + radius:none (gana el modifier)'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.Card': {
      demo: {
        subtitle:            'Generic card — header, body, footer, image, variants, hoverable, clickable, actions.',
        s1Title:             '1 — CSS only (no JS)',
        s2Title:             '2 — Color variants',
        s3Title:             '3 — Hoverable and clickable',
        s4Title:             '4 — With image and actions',
        s5Title:             '5 — Border & Radius — opt-in',

        variantBody:         'Card with ',
        hoverBody:           'Hover to see the lift effect.',
        clickBody:           'Click anywhere on the card.',
        clickResultPlaceholder: '— click the clickable card —',
        clickResult:         'onClick → card clicked ✓',

        imageBody:           'Premium hiking boots for rough terrain.',
        checkoutBody:        'Complete your purchase.',
        actionResultPlaceholder: '— use the card buttons —',
        editLabel:           'Edit',
        deleteLabel:         'Delete',
        cancelLabel:         'Cancel',
        buyLabel:            'Buy',
        actionPrefix:        'action → ',
        footerPrefix:        'footer → ',

        brDefaultTitle:      'Default',
        brDefaultBody:       'radius-lg + base border (same as today)',
        brSharpTitle:        'Sharp',
        brSharpBody:         'radius:none + border:1',
        brSharpNoBorderTitle:'Sharp no border',
        brSharpNoBorderBody: 'radius:none + border:none',
        brSmallTitle:        'Small + thick',
        brSmallBody:         'radius:sm + border:2',
        brPillTitle:         'Pill',
        brPillBody:          'radius:full',
        brElevatedTitle:     'Elevated + sharp',
        brElevatedBody:      'variant elevated + radius:none (modifier wins)'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.Card': {
      demo: {
        subtitle:            'Card genérico — cabeçalho, corpo, rodapé, imagem, variantes, hoverable, clicável, ações.',
        s1Title:             '1 — Somente CSS (sem JS)',
        s2Title:             '2 — Variantes de cor',
        s3Title:             '3 — Hoverable e clicável',
        s4Title:             '4 — Com imagem e ações',
        s5Title:             '5 — Borda e raio — opcional',

        variantBody:         'Card com variante ',
        hoverBody:           'Passe o cursor para ver o efeito de elevação.',
        clickBody:           'Clique em qualquer parte do card.',
        clickResultPlaceholder: '— clique no card clicável —',
        clickResult:         'onClick → card clicado ✓',

        imageBody:           'Botas de trilha premium para terreno difícil.',
        checkoutBody:        'Conclua sua compra.',
        actionResultPlaceholder: '— use os botões dos cards —',
        editLabel:           'Editar',
        deleteLabel:         'Excluir',
        cancelLabel:         'Cancelar',
        buyLabel:            'Comprar',
        actionPrefix:        'action → ',
        footerPrefix:        'footer → ',

        brDefaultTitle:      'Padrão',
        brDefaultBody:       'radius-lg + borda base (igual a hoje)',
        brSharpTitle:        'Reto',
        brSharpBody:         'radius:none + border:1',
        brSharpNoBorderTitle:'Reto sem borda',
        brSharpNoBorderBody: 'radius:none + border:none',
        brSmallTitle:        'Pequeno + grosso',
        brSmallBody:         'radius:sm + border:2',
        brPillTitle:         'Pílula',
        brPillBody:          'radius:full',
        brElevatedTitle:     'Elevado + reto',
        brElevatedBody:      'variant elevated + radius:none (o modifier vence)'
      }
    }
  });

})(window);
