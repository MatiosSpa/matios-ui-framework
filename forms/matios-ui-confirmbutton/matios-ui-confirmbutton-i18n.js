/* ============================================================
   MATIOS UI — matios-ui-confirmbutton-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.ConfirmButton
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.ConfirmButton': {
      messages: {
        delete:                 'Eliminar',
        confirm:                '¿Confirmar?',
        cancel:                 'No'
      },
      demo: {
        subtitle:               'Confirmación inline en dos pasos para acciones sensibles, con enhancement progresivo desde HTML declarativo.',
        s1Title:                '1 — Variantes',
        s2Title:                '2 — Sin timeout',
        s3Title:                '3 — Tamaños',
        s4Title:                '4 — API',
        s5Title:                '5 — HTML declarativo + enhancement',
        resultButtonsHint:      '— interactúa con los botones —',
        resultTimeoutHint:      '— confirma o cancela —',
        resultApiHint:          '— usa los botones para llamar la API —',
        resultEnhanceHint:      '— confirma o cancela para ver el enhancement —',
        labelDeclarative:       'HTML declarativo',
        labelEnhanced:          'HTML declarativo + enhancement',
        echoDeleted:            'onConfirm → eliminado ✓',
        echoArchived:           'onConfirm → archivado ✓',
        echoReset:              'onConfirm → reiniciado ✓',
        echoCancelled:          'onCancel → cancelado',
        echoLoggedOut:          'onConfirm → sesión cerrada ✓',
        echoPublished:          'onConfirm → publicado ✓',
        echoConfirmed:          'onConfirm → confirmado',
        echoResetApplied:       'reset() aplicado',
        echoDisableApplied:     'disable() aplicado',
        echoEnableApplied:      'enable() aplicado'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.ConfirmButton': {
      messages: {
        delete:                 'Delete',
        confirm:                'Confirm?',
        cancel:                 'No'
      },
      demo: {
        subtitle:               'Two-step inline confirmation for sensitive actions, with progressive enhancement from declarative HTML.',
        s1Title:                '1 — Variants',
        s2Title:                '2 — No timeout',
        s3Title:                '3 — Sizes',
        s4Title:                '4 — API',
        s5Title:                '5 — Declarative HTML + enhancement',
        resultButtonsHint:      '— interact with the buttons —',
        resultTimeoutHint:      '— confirm or cancel —',
        resultApiHint:          '— use the buttons to call the API —',
        resultEnhanceHint:      '— confirm or cancel to see the enhancement —',
        labelDeclarative:       'Declarative HTML',
        labelEnhanced:          'Declarative HTML + enhancement',
        echoDeleted:            'onConfirm → deleted ✓',
        echoArchived:           'onConfirm → archived ✓',
        echoReset:              'onConfirm → reset ✓',
        echoCancelled:          'onCancel → cancelled',
        echoLoggedOut:          'onConfirm → logged out ✓',
        echoPublished:          'onConfirm → published ✓',
        echoConfirmed:          'onConfirm → confirmed',
        echoResetApplied:       'reset() applied',
        echoDisableApplied:     'disable() applied',
        echoEnableApplied:      'enable() applied'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.ConfirmButton': {
      messages: {
        delete:                 'Excluir',
        confirm:                'Confirmar?',
        cancel:                 'Não'
      },
      demo: {
        subtitle:               'Confirmação inline em dois passos para ações sensíveis, com enhancement progressivo a partir de HTML declarativo.',
        s1Title:                '1 — Variantes',
        s2Title:                '2 — Sem timeout',
        s3Title:                '3 — Tamanhos',
        s4Title:                '4 — API',
        s5Title:                '5 — HTML declarativo + enhancement',
        resultButtonsHint:      '— interaja com os botões —',
        resultTimeoutHint:      '— confirme ou cancele —',
        resultApiHint:          '— use os botões para chamar a API —',
        resultEnhanceHint:      '— confirme ou cancele para ver o enhancement —',
        labelDeclarative:       'HTML declarativo',
        labelEnhanced:          'HTML declarativo + enhancement',
        echoDeleted:            'onConfirm → excluído ✓',
        echoArchived:           'onConfirm → arquivado ✓',
        echoReset:              'onConfirm → redefinido ✓',
        echoCancelled:          'onCancel → cancelado',
        echoLoggedOut:          'onConfirm → sessão encerrada ✓',
        echoPublished:          'onConfirm → publicado ✓',
        echoConfirmed:          'onConfirm → confirmado',
        echoResetApplied:       'reset() aplicado',
        echoDisableApplied:     'disable() aplicado',
        echoEnableApplied:      'enable() aplicado'
      }
    }
  });

})(window);
