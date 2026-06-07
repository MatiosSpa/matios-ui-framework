/* ============================================================
   MATIOS UI — matios-ui-validation-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Validate
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Validate': {
      demo: {
        subtitle:               'Validación de formularios con reglas, mensajes y helpers de API.',
        s1Title:                '1 — Formulario completo',
        s2Title:                '2 — Reglas avanzadas',
        s3Title:                '3 — API — errores del servidor',

        // Sección 1
        fullResultPlaceholder:  '— completa y envía el formulario —',
        nameLabel:              'Nombre completo',
        namePlaceholder:        'Juan Pérez',
        emailLabel:             'Email',
        emailPlaceholder:       'user@ejemplo.com',
        passLabel:              'Contraseña',
        passPlaceholder:        'Mín 8 caracteres',
        pass2Label:             'Confirmar contraseña',
        pass2Placeholder:       'Repite la contraseña',
        submitLabel:            'Enviar formulario',
        msgNameRequired:        'El nombre es requerido',
        msgNameMinLength:       'Mínimo 3 caracteres',

        // Sección 2
        advResultPlaceholder:   '— completa y envía el formulario —',
        rutLabel:               'RUT',
        ageLabel:               'Edad',
        urlLabel:               'Sitio web',
        customLabel:            'Usuario',
        customPlaceholder:      'No uses "admin"',
        customMessage:          'Usuario no permitido',
        validateLabel:          'Validar',

        // Sección 3
        apiResultPlaceholder:   '— usa los botones —',
        apiEmailLabel:          'Email',
        registerLabel:          'Registrar',
        apiAlreadyExists:       'Ya existe',
        echoSetError:           'setError() → Ya existe',
        echoClearErrors:        'clearErrors() ✓'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Validate': {
      demo: {
        subtitle:               'Form validation with rules, messages and API helpers.',
        s1Title:                '1 — Full form',
        s2Title:                '2 — Advanced rules',
        s3Title:                '3 — API — server-side errors',

        // Section 1
        fullResultPlaceholder:  '— fill in and submit the form —',
        nameLabel:              'Full name',
        namePlaceholder:        'John Doe',
        emailLabel:             'Email',
        emailPlaceholder:       'user@example.com',
        passLabel:              'Password',
        passPlaceholder:        'Min 8 characters',
        pass2Label:             'Confirm password',
        pass2Placeholder:       'Repeat the password',
        submitLabel:            'Submit form',
        msgNameRequired:        'Name is required',
        msgNameMinLength:       'At least 3 characters',

        // Section 2
        advResultPlaceholder:   '— fill in and submit the form —',
        rutLabel:               'RUT',
        ageLabel:               'Age',
        urlLabel:               'Website',
        customLabel:            'Username',
        customPlaceholder:      'Do not use "admin"',
        customMessage:          'Username not allowed',
        validateLabel:          'Validate',

        // Section 3
        apiResultPlaceholder:   '— use the buttons —',
        apiEmailLabel:          'Email',
        registerLabel:          'Register',
        apiAlreadyExists:       'Already exists',
        echoSetError:           'setError() → Already exists',
        echoClearErrors:        'clearErrors() ✓'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Validate': {
      demo: {
        subtitle:               'Validação de formulários com regras, mensagens e helpers de API.',
        s1Title:                '1 — Formulário completo',
        s2Title:                '2 — Regras avançadas',
        s3Title:                '3 — API — erros do servidor',

        // Seção 1
        fullResultPlaceholder:  '— preencha e envie o formulário —',
        nameLabel:              'Nome completo',
        namePlaceholder:        'João Silva',
        emailLabel:             'Email',
        emailPlaceholder:       'user@exemplo.com',
        passLabel:              'Senha',
        passPlaceholder:        'Mín 8 caracteres',
        pass2Label:             'Confirmar senha',
        pass2Placeholder:       'Repita a senha',
        submitLabel:            'Enviar formulário',
        msgNameRequired:        'O nome é obrigatório',
        msgNameMinLength:       'Mínimo 3 caracteres',

        // Seção 2
        advResultPlaceholder:   '— preencha e envie o formulário —',
        rutLabel:               'RUT',
        ageLabel:               'Idade',
        urlLabel:               'Site',
        customLabel:            'Usuário',
        customPlaceholder:      'Não use "admin"',
        customMessage:          'Usuário não permitido',
        validateLabel:          'Validar',

        // Seção 3
        apiResultPlaceholder:   '— use os botões —',
        apiEmailLabel:          'Email',
        registerLabel:          'Registrar',
        apiAlreadyExists:       'Já existe',
        echoSetError:           'setError() → Já existe',
        echoClearErrors:        'clearErrors() ✓'
      }
    }
  });

})(window);
