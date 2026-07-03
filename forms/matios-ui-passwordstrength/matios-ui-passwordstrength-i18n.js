/* ============================================================
   MATIOS UI — matios-ui-passwordstrength-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.PasswordStrength
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.PasswordStrength': {
      levelWeak:         'Débil',
      levelFair:         'Regular',
      levelStrong:       'Fuerte',
      levelVeryStrong:   'Muy fuerte',
      minLength_one:     'Mínimo {n} caracter',
      minLength_many:    'Mínimo {n} caracteres',
      maxLength_one:     'Máximo {n} caracter',
      maxLength_many:    'Máximo {n} caracteres',
      minUppercase_one:  'Al menos {n} mayúscula',
      minUppercase_many: 'Al menos {n} mayúsculas',
      minLowercase_one:  'Al menos {n} minúscula',
      minLowercase_many: 'Al menos {n} minúsculas',
      minNumbers_one:    'Al menos {n} número',
      minNumbers_many:   'Al menos {n} números',
      minSpecial_one:    'Al menos {n} símbolo ({list})',
      minSpecial_many:   'Al menos {n} símbolos ({list})',
      demo: {
        subtitle:            'Medidor de fortaleza de contraseña en tiempo real. Configurable: largo mínimo/máximo, mayúsculas, minúsculas, números y símbolos especiales.',
        s1Title:             '1 — Básico (solo largo mínimo)',
        s2Title:             '2 — Reglas completas',
        s3Title:             '3 — Solo barra (sin checklist)',
        s4Title:             '4 — Integración con MTS.Validate',
        s5Title:             '5 — onChange callback',
        labelPassword:       'Contraseña',
        labelNewPassword:    'Nueva contraseña',
        labelConfirm:        'Confirmar contraseña',
        btnSave:             'Guardar contraseña',
        errRequirements:     'No cumple los requisitos.',
        errMismatch:         'No coinciden.',
        savedPrefix:         '✓ score: ',
        savedLevel:          ' — nivel: ',
        logPlaceholder:      'Escribe algo para ver el callback...',
        logScore:            'score: ',
        logLevel:            'level: ',
        logValid:            'isValid: '
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.PasswordStrength': {
      levelWeak:         'Weak',
      levelFair:         'Fair',
      levelStrong:       'Strong',
      levelVeryStrong:   'Very strong',
      minLength_one:     'Minimum {n} character',
      minLength_many:    'Minimum {n} characters',
      maxLength_one:     'Maximum {n} character',
      maxLength_many:    'Maximum {n} characters',
      minUppercase_one:  'At least {n} uppercase letter',
      minUppercase_many: 'At least {n} uppercase letters',
      minLowercase_one:  'At least {n} lowercase letter',
      minLowercase_many: 'At least {n} lowercase letters',
      minNumbers_one:    'At least {n} number',
      minNumbers_many:   'At least {n} numbers',
      minSpecial_one:    'At least {n} symbol ({list})',
      minSpecial_many:   'At least {n} symbols ({list})',
      demo: {
        subtitle:            'Real-time password strength meter. Configurable: min/max length, uppercase, lowercase, numbers and special symbols.',
        s1Title:             '1 — Basic (minimum length only)',
        s2Title:             '2 — Full rules',
        s3Title:             '3 — Bar only (no checklist)',
        s4Title:             '4 — Integration with MTS.Validate',
        s5Title:             '5 — onChange callback',
        labelPassword:       'Password',
        labelNewPassword:    'New password',
        labelConfirm:        'Confirm password',
        btnSave:             'Save password',
        errRequirements:     'Does not meet the requirements.',
        errMismatch:         'Do not match.',
        savedPrefix:         '✓ score: ',
        savedLevel:          ' — level: ',
        logPlaceholder:      'Type something to see the callback...',
        logScore:            'score: ',
        logLevel:            'level: ',
        logValid:            'isValid: '
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.PasswordStrength': {
      levelWeak:         'Fraca',
      levelFair:         'Regular',
      levelStrong:       'Forte',
      levelVeryStrong:   'Muito forte',
      minLength_one:     'Mínimo {n} caractere',
      minLength_many:    'Mínimo {n} caracteres',
      maxLength_one:     'Máximo {n} caractere',
      maxLength_many:    'Máximo {n} caracteres',
      minUppercase_one:  'Pelo menos {n} maiúscula',
      minUppercase_many: 'Pelo menos {n} maiúsculas',
      minLowercase_one:  'Pelo menos {n} minúscula',
      minLowercase_many: 'Pelo menos {n} minúsculas',
      minNumbers_one:    'Pelo menos {n} número',
      minNumbers_many:   'Pelo menos {n} números',
      minSpecial_one:    'Pelo menos {n} símbolo ({list})',
      minSpecial_many:   'Pelo menos {n} símbolos ({list})',
      demo: {
        subtitle:            'Medidor de força de senha em tempo real. Configurável: comprimento mínimo/máximo, maiúsculas, minúsculas, números e símbolos especiais.',
        s1Title:             '1 — Básico (apenas comprimento mínimo)',
        s2Title:             '2 — Regras completas',
        s3Title:             '3 — Apenas barra (sem checklist)',
        s4Title:             '4 — Integração com MTS.Validate',
        s5Title:             '5 — onChange callback',
        labelPassword:       'Senha',
        labelNewPassword:    'Nova senha',
        labelConfirm:        'Confirmar senha',
        btnSave:             'Salvar senha',
        errRequirements:     'Não atende aos requisitos.',
        errMismatch:         'Não coincidem.',
        savedPrefix:         '✓ score: ',
        savedLevel:          ' — nível: ',
        logPlaceholder:      'Digite algo para ver o callback...',
        logScore:            'score: ',
        logLevel:            'level: ',
        logValid:            'isValid: '
      }
    }
  });

})(window);
