/* ============================================================
   MATIOS UI — matios-ui-toast-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Toast
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.Toast': {
      demo: {
        subtitle:            'Notificaciones fugaces — variantes, posiciones, botón de acción y estado de carga.',
        s1Title:             '1 — Variantes',
        s2Title:             '2 — Posiciones',
        s3Title:             '3 — Acción + carga',
        btnAction:           'Con acción',
        btnLoading:          'Carga → éxito',
        btnPlain:            'Sin × (2s)',
        resultPlaceholder:   '— usa los botones —',
        actionTitle:         'Actualización disponible',
        actionMessage:       'La versión 2.0 está lista.',
        actionLabel:         'Instalar ahora',
        echoAction:          'onAction → instalar',
        echoClose:           'onClose → descartado',
        loadingResult:       'Cargando... (3s)',
        loadingMessage:      'Subiendo archivo...',
        loadingSuccess:      '¡Archivo subido correctamente!',
        loadingEcho:         'loader.close() → éxito ✓',
        plainSuccess:        '¡Hecho!'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.Toast': {
      demo: {
        subtitle:            'Transient notifications — variants, positions, action button and loading state.',
        s1Title:             '1 — Variants',
        s2Title:             '2 — Positions',
        s3Title:             '3 — Action + loading',
        btnAction:           'With action',
        btnLoading:          'Loading → success',
        btnPlain:            'No × (2s)',
        resultPlaceholder:   '— use the buttons —',
        actionTitle:         'Update available',
        actionMessage:       'Version 2.0 is ready.',
        actionLabel:         'Install now',
        echoAction:          'onAction → install',
        echoClose:           'onClose → dismissed',
        loadingResult:       'Loading... (3s)',
        loadingMessage:      'Uploading file...',
        loadingSuccess:      'Upload complete!',
        loadingEcho:         'loader.close() → success ✓',
        plainSuccess:        'Done!'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.Toast': {
      demo: {
        subtitle:            'Notificações efêmeras — variantes, posições, botão de ação e estado de carregamento.',
        s1Title:             '1 — Variantes',
        s2Title:             '2 — Posições',
        s3Title:             '3 — Ação + carregamento',
        btnAction:           'Com ação',
        btnLoading:          'Carregando → sucesso',
        btnPlain:            'Sem × (2s)',
        resultPlaceholder:   '— use os botões —',
        actionTitle:         'Atualização disponível',
        actionMessage:       'A versão 2.0 está pronta.',
        actionLabel:         'Instalar agora',
        echoAction:          'onAction → instalar',
        echoClose:           'onClose → descartado',
        loadingResult:       'Carregando... (3s)',
        loadingMessage:      'Enviando arquivo...',
        loadingSuccess:      'Arquivo enviado com sucesso!',
        loadingEcho:         'loader.close() → sucesso ✓',
        plainSuccess:        'Pronto!'
      }
    }
  });

})(window);
