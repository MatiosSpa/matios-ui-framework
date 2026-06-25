/* ============================================================
   MATIOS UI — matios-ui-lockscreen-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.LockScreen
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.LockScreen': {
      messages: {
        title:               'Sesión bloqueada',
        subtitle:            'Ingresa tu clave para continuar',
        passwordPlaceholder: 'Clave',
        btnUnlock:           'Ingresar',
        forgot:              'Olvidé mi clave',
        errorInvalid:        'Clave incorrecta'
      },
      demo: {
        subtitle:    'Overlay de re-autenticación in-place (estilo lock screen). Solo UI + eventos; la verificación la cablea el consumidor.',
        s1Title:     '1 — Básico (clave correcta: "matios")',
        s2Title:     '2 — Sin foto (iniciales) + sin "olvidé mi clave"',
        s3Title:     '3 — API (show / setError / setBusy / setUser)',
        btnLock:     'Bloquear pantalla',
        hintTry:     'Prueba "matios" para desbloquear; cualquier otra cosa muestra error.',
        userName:    'Pedro Gómez',
        userName2:   'Ana Torres',
        result:      '— bloquea e intenta desbloquear —',
        unlocked:    'Desbloqueado ✓',
        forgotMsg:   'Click en "Olvidé mi clave"'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.LockScreen': {
      messages: {
        title:               'Screen locked',
        subtitle:            'Enter your password to continue',
        passwordPlaceholder: 'Password',
        btnUnlock:           'Unlock',
        forgot:              'Forgot my password',
        errorInvalid:        'Wrong password'
      },
      demo: {
        subtitle:    'In-place re-authentication overlay (lock-screen style). UI + events only; the consumer wires the actual check.',
        s1Title:     '1 — Basic (correct password: "matios")',
        s2Title:     '2 — No photo (initials) + no "forgot" link',
        s3Title:     '3 — API (show / setError / setBusy / setUser)',
        btnLock:     'Lock screen',
        hintTry:     'Try "matios" to unlock; anything else shows an error.',
        userName:    'Pedro Gómez',
        userName2:   'Ana Torres',
        result:      '— lock and try to unlock —',
        unlocked:    'Unlocked ✓',
        forgotMsg:   'Clicked "Forgot my password"'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.LockScreen': {
      messages: {
        title:               'Tela bloqueada',
        subtitle:            'Digite sua senha para continuar',
        passwordPlaceholder: 'Senha',
        btnUnlock:           'Entrar',
        forgot:              'Esqueci minha senha',
        errorInvalid:        'Senha incorreta'
      },
      demo: {
        subtitle:    'Overlay de reautenticação in-place (estilo tela de bloqueio). Apenas UI + eventos; o consumidor liga a verificação.',
        s1Title:     '1 — Básico (senha correta: "matios")',
        s2Title:     '2 — Sem foto (iniciais) + sem "esqueci a senha"',
        s3Title:     '3 — API (show / setError / setBusy / setUser)',
        btnLock:     'Bloquear tela',
        hintTry:     'Tente "matios" para desbloquear; qualquer outra coisa mostra erro.',
        userName:    'Pedro Gómez',
        userName2:   'Ana Torres',
        result:      '— bloqueie e tente desbloquear —',
        unlocked:    'Desbloqueado ✓',
        forgotMsg:   'Clicou em "Esqueci minha senha"'
      }
    }
  });

})(window);
