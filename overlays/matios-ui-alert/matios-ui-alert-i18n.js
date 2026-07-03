/* ============================================================
   MATIOS UI — matios-ui-alert-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Alert
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.Alert': {
      closeLabel: 'Cerrar',
      demo: {
        subtitle:              'Alertas y banners inline — variantes, botón de acción, auto-dismiss y uso solo CSS.',
        s1Title:               '1 — Variantes',
        s2Title:               '2 — Con acción y auto-dismiss',
        s3Title:               '3 — Solo CSS',

        resultPlaceholder:     '— cierra una alerta —',
        actionResultPlaceholder: '— usa los botones —',

        infoTitle:             'Nueva versión disponible',
        infoMessage:           'Actualiza para obtener las últimas funciones.',
        successTitle:          'Cambios guardados',
        successMessage:        'Tus datos se guardaron correctamente.',
        warningTitle:          'Sesión por expirar',
        warningMessage:        'Tu sesión expira en 5 minutos.',
        dangerTitle:           'Error de conexión',
        dangerMessage:         'No se pudo conectar con el servidor.',

        btnShowAction:         'Mostrar con acción',
        btnShowAutodismiss:    'Auto-dismiss (3s)',
        actionLabel:           'Renovar ahora',
        autodismissMessage:    'Archivo subido correctamente.',
        autodismissCountdown:  'Auto-dismiss en 3 segundos...',

        echoInfo:              'onClose → info',
        echoSuccess:           'onClose → success',
        echoWarning:           'onClose → warning',
        echoDanger:            'onClose → danger',
        echoAction:            'onAction → renovar',
        echoActionClose:       'onClose → descartado',
        echoAutodismiss:       'onClose → auto-dismissed ✓',

        cssInfoMessage:        'Alerta info — solo CSS.',
        cssSuccessTitle:       'Éxito',
        cssSuccessMessage:     'Cambios guardados.',
        cssWarningMessage:     'Advertencia — revisa tu configuración.',
        cssDangerMessage:      'Error — no se pudo completar la operación.'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.Alert': {
      closeLabel: 'Close',
      demo: {
        subtitle:              'Inline alerts and banners — variants, action button, auto-dismiss and CSS-only usage.',
        s1Title:               '1 — Variants',
        s2Title:               '2 — With action and auto-dismiss',
        s3Title:               '3 — CSS only',

        resultPlaceholder:     '— close an alert —',
        actionResultPlaceholder: '— use the buttons —',

        infoTitle:             'New version available',
        infoMessage:           'Update to get the latest features.',
        successTitle:          'Changes saved',
        successMessage:        'Your data was saved successfully.',
        warningTitle:          'Session about to expire',
        warningMessage:        'Your session expires in 5 minutes.',
        dangerTitle:           'Connection error',
        dangerMessage:         'Could not connect to the server.',

        btnShowAction:         'Show with action',
        btnShowAutodismiss:    'Auto-dismiss (3s)',
        actionLabel:           'Renew now',
        autodismissMessage:    'File uploaded successfully.',
        autodismissCountdown:  'Auto-dismiss in 3 seconds...',

        echoInfo:              'onClose → info',
        echoSuccess:           'onClose → success',
        echoWarning:           'onClose → warning',
        echoDanger:            'onClose → danger',
        echoAction:            'onAction → renew',
        echoActionClose:       'onClose → dismissed',
        echoAutodismiss:       'onClose → auto-dismissed ✓',

        cssInfoMessage:        'Info alert — CSS only.',
        cssSuccessTitle:       'Success',
        cssSuccessMessage:     'Changes saved.',
        cssWarningMessage:     'Warning — check your settings.',
        cssDangerMessage:      'Error — the operation could not be completed.'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.Alert': {
      closeLabel: 'Fechar',
      demo: {
        subtitle:              'Alertas e banners inline — variantes, botão de ação, auto-dismiss e uso somente CSS.',
        s1Title:               '1 — Variantes',
        s2Title:               '2 — Com ação e auto-dismiss',
        s3Title:               '3 — Somente CSS',

        resultPlaceholder:     '— feche um alerta —',
        actionResultPlaceholder: '— use os botões —',

        infoTitle:             'Nova versão disponível',
        infoMessage:           'Atualize para obter os recursos mais recentes.',
        successTitle:          'Alterações salvas',
        successMessage:        'Seus dados foram salvos com sucesso.',
        warningTitle:          'Sessão prestes a expirar',
        warningMessage:        'Sua sessão expira em 5 minutos.',
        dangerTitle:           'Erro de conexão',
        dangerMessage:         'Não foi possível conectar ao servidor.',

        btnShowAction:         'Mostrar com ação',
        btnShowAutodismiss:    'Auto-dismiss (3s)',
        actionLabel:           'Renovar agora',
        autodismissMessage:    'Arquivo enviado com sucesso.',
        autodismissCountdown:  'Auto-dismiss em 3 segundos...',

        echoInfo:              'onClose → info',
        echoSuccess:           'onClose → success',
        echoWarning:           'onClose → warning',
        echoDanger:            'onClose → danger',
        echoAction:            'onAction → renovar',
        echoActionClose:       'onClose → descartado',
        echoAutodismiss:       'onClose → auto-dismissed ✓',

        cssInfoMessage:        'Alerta info — somente CSS.',
        cssSuccessTitle:       'Sucesso',
        cssSuccessMessage:     'Alterações salvas.',
        cssWarningMessage:     'Aviso — verifique suas configurações.',
        cssDangerMessage:      'Erro — não foi possível concluir a operação.'
      }
    }
  });

})(window);
