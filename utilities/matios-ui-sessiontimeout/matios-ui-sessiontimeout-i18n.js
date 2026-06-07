/* ============================================================
   MATIOS UI — matios-ui-sessiontimeout-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.SessionTimeout
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.SessionTimeout': {
      demo: {
        subtitle:        'Gestión de timeout de sesión por inactividad. Barra de progreso fija en el borde inferior + modal de advertencia con countdown configurable. Compatible con cualquier estrategia de renovación de token.',
        s1Title:         '1 — Básico',
        s2Title:         '2 — Mensajes personalizados',
        s3Title:         '3 — Solo barra (sin modal de aviso)',
        s4Title:         '4 — Uso real con onRefresh / onExpire',

        p1Hint:          'La barra de sesión aparece en el borde inferior de la página.',
        p1BtnLabel:      'Simular aviso de sesión',

        p2BtnLabel:      'Simular aviso personalizado',
        p2Title:         'Atención',
        p2Body:          'Tu sesión expirará en {time}. ¿Sigues aquí?',
        p2Warning:       'Guarda tu trabajo antes de que se cierre la sesión.',
        p2BtnRefresh:    'Sigo trabajando',
        p2BtnExpire:     'Salir ahora',

        p3HintPrefix:    'Con ',
        p3HintSuffix:    ' la barra se agota silenciosamente sin abrir el modal.',
        p3BtnLabel:      'Activar (solo barra)',

        p4Hint1:         'Patrón completo para producción. ',
        p4Hint2:         ' hace el fetch a la API y llama ',
        p4Hint3:         ' al terminar. Si falla, no llama ',
        p4Hint4:         ' — el timer sigue corriendo.',

        toastExpired:    'Sesión expirada.'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.SessionTimeout': {
      demo: {
        subtitle:        'Session timeout management on inactivity. Fixed progress bar at the bottom edge + warning modal with configurable countdown. Compatible with any token refresh strategy.',
        s1Title:         '1 — Basic',
        s2Title:         '2 — Custom messages',
        s3Title:         '3 — Bar only (no warning modal)',
        s4Title:         '4 — Real usage with onRefresh / onExpire',

        p1Hint:          'The session bar appears at the bottom edge of the page.',
        p1BtnLabel:      'Simulate session warning',

        p2BtnLabel:      'Simulate custom warning',
        p2Title:         'Attention',
        p2Body:          'Your session will expire in {time}. Are you still here?',
        p2Warning:       'Save your work before the session closes.',
        p2BtnRefresh:    'I\'m still working',
        p2BtnExpire:     'Leave now',

        p3HintPrefix:    'With ',
        p3HintSuffix:    ' the bar runs out silently without opening the modal.',
        p3BtnLabel:      'Activate (bar only)',

        p4Hint1:         'Full pattern for production. ',
        p4Hint2:         ' performs the fetch to the API and calls ',
        p4Hint3:         ' when done. If it fails, it does not call ',
        p4Hint4:         ' — the timer keeps running.',

        toastExpired:    'Session expired.'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.SessionTimeout': {
      demo: {
        subtitle:        'Gestão de timeout de sessão por inatividade. Barra de progresso fixa na borda inferior + modal de aviso com contagem regressiva configurável. Compatível com qualquer estratégia de renovação de token.',
        s1Title:         '1 — Básico',
        s2Title:         '2 — Mensagens personalizadas',
        s3Title:         '3 — Apenas barra (sem modal de aviso)',
        s4Title:         '4 — Uso real com onRefresh / onExpire',

        p1Hint:          'A barra de sessão aparece na borda inferior da página.',
        p1BtnLabel:      'Simular aviso de sessão',

        p2BtnLabel:      'Simular aviso personalizado',
        p2Title:         'Atenção',
        p2Body:          'Sua sessão expirará em {time}. Ainda está aí?',
        p2Warning:       'Salve seu trabalho antes que a sessão seja encerrada.',
        p2BtnRefresh:    'Continuo trabalhando',
        p2BtnExpire:     'Sair agora',

        p3HintPrefix:    'Com ',
        p3HintSuffix:    ' a barra se esgota silenciosamente sem abrir o modal.',
        p3BtnLabel:      'Ativar (apenas barra)',

        p4Hint1:         'Padrão completo para produção. ',
        p4Hint2:         ' faz o fetch para a API e chama ',
        p4Hint3:         ' ao terminar. Se falhar, não chama ',
        p4Hint4:         ' — o timer continua rodando.',

        toastExpired:    'Sessão expirada.'
      }
    }
  });

})(window);
