/* ============================================================
   MATIOS UI — matios-ui-input-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Input
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.Input': {
      messages: {
        required:     'Este campo es obligatorio',
        minLength:    'Mínimo {n} caracteres',
        maxLength:    'Máximo {n} caracteres',
        min:          'Valor mínimo: {n}',
        max:          'Valor máximo: {n}',
        pattern:      'Formato inválido',
        email:        'Email inválido',
        clear:        'Limpiar',
        showPassword: 'Mostrar contraseña'
      },
      demo: {
        subtitle:               'Campos de texto, textarea, validación, estados y enhancement progresivo desde HTML declarativo.',

        s1Title:                '1 — Tipos básicos',
        s2Title:                '2 — Textarea y contador',
        s3Title:                '3 — Estados visuales',
        s4Title:                '4 — Validación',
        s5Title:                '5 — Eventos',
        s6Title:                '6 — API programática',
        s7Title:                '7 — HTML declarativo + enhancement',
        s8Title:                '8 — selectOnFocus',
        s9Title:                '9 — nextOnEnter',
        s10Title:               '10 — Autocomplete datasource estático',
        s11Title:               '11 — Autocomplete datasource async (simulado)',

        // s1
        nameLabel:              'Nombre',
        namePlaceholder:        'Ingresa tu nombre',
        nameHint:               'Mínimo 3 caracteres',
        emailLabel:             'Correo electrónico',
        emailPlaceholder:       'usuario@ejemplo.com',
        passwordLabel:          'Contraseña',
        quantityLabel:          'Cantidad',

        // s2
        descriptionLabel:       'Descripción',
        descriptionPlaceholder: 'Escribe aquí...',

        // s3
        disabledLabel:          'Campo deshabilitado',
        disabledValue:          'No editable',
        readonlyLabel:          'Solo lectura',
        readonlyValue:          'Valor fijo',
        clearableLabel:         'Con botón limpiar',
        clearablePlaceholder:   'Escribe algo...',
        searchLabel:            'Buscar',
        searchPlaceholder:      'Buscar...',

        // s4
        validResultPlaceholder: '— interactúa con los campos, la validación ocurre al perder foco —',
        userLabel:              'Usuario',
        userLenPlaceholder:     'mínimo 4, máximo 20 caracteres',
        validatedPrefix:        'Validado — válido: ',

        // s5
        eventsLabel:            'Campo con eventos',
        eventsPlaceholder:      'Escribe algo...',
        eventsHint:             'Observa los eventos en el panel inferior',
        eventsResultPlaceholder: '— interactúa con el campo —',
        echoFocus:              'focus',
        echoValidPart:          'válido: ',

        // s6
        apiLabel:               'Campo controlado',
        apiPlaceholder:         'Controlado por API',
        apiResultPlaceholder:   '— usa los botones para llamar la API —',
        apiExternalError:       'Error externo del servidor',

        // s7
        declarativeBlockLabel:  'HTML declarativo',
        declarativeLabel:       'Nombre completo',
        declarativePlaceholder: 'Ingresa tu nombre',
        declarativeHint:        'Inicializado desde data-*',
        enhancedBlockLabel:     'HTML declarativo + enhancement',
        enhancedLabel:          'Correo',
        enhancedPlaceholder:    'usuario@empresa.com',
        enhancedHint:           'Matios UI potencia el HTML base',
        enhancementResultPlaceholder: '— escribe y cambia el foco para ver el enhancement —',

        // s8
        sofHelp:                'Haz clic en cualquier campo — el texto se selecciona automáticamente',
        sofNameLabel:           'Nombre completo',
        sofNameHint:            'Clic para seleccionar todo',
        sofQtyLabel:            'Cantidad',
        sofQtyHint:             'Útil para editar números rápido',
        sofPwdLabel:            'Contraseña (excluida)',
        sofPwdHint:             'selectOnFocus no aplica a password',
        sofResultPlaceholder:   '— haz clic en los campos para ver el comportamiento —',
        sofFocusName:           'focus en Nombre → texto seleccionado',
        sofFocusQty:            'focus en Cantidad → texto seleccionado',
        sofFocusPwd:            'focus en Contraseña → selectOnFocus no aplica',

        // s9
        noeHelp:                'Navega con Enter — como si fuera Tab',
        noeNameLabel:           'Nombre',
        noeLastLabel:           'Apellido',
        noeEmailLabel:          'Email',
        noeAgeLabel:            'Edad',
        noeResultPlaceholder:   '— presiona Enter en cada campo para avanzar al siguiente —',
        noeFocusName:           'foco en Nombre',
        noeFocusLast:           'foco en Apellido',
        noeFocusEmail:          'foco en Email',
        noeFocusAge:            'foco en Edad — último campo',

        // s10
        countryLabel:           'País',
        countryPlaceholder:     'Escribe para filtrar...',
        countryPrompt:          'Selecciona un país...',

        // s11
        userAsyncPlaceholder:   'Ej: Ana, Luis, María...',
        userAsyncPrompt:        'Selecciona un usuario...',
        getValueNull:           'null (sin selección)'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.Input': {
      messages: {
        required:     'This field is required',
        minLength:    'Minimum {n} characters',
        maxLength:    'Maximum {n} characters',
        min:          'Minimum value: {n}',
        max:          'Maximum value: {n}',
        pattern:      'Invalid format',
        email:        'Invalid email',
        clear:        'Clear',
        showPassword: 'Show password'
      },
      demo: {
        subtitle:               'Text fields, textarea, validation, states and progressive enhancement from declarative HTML.',

        s1Title:                '1 — Basic types',
        s2Title:                '2 — Textarea and counter',
        s3Title:                '3 — Visual states',
        s4Title:                '4 — Validation',
        s5Title:                '5 — Events',
        s6Title:                '6 — Programmatic API',
        s7Title:                '7 — Declarative HTML + enhancement',
        s8Title:                '8 — selectOnFocus',
        s9Title:                '9 — nextOnEnter',
        s10Title:               '10 — Autocomplete static datasource',
        s11Title:               '11 — Autocomplete async datasource (simulated)',

        // s1
        nameLabel:              'Name',
        namePlaceholder:        'Enter your name',
        nameHint:               'Minimum 3 characters',
        emailLabel:             'Email',
        emailPlaceholder:       'user@example.com',
        passwordLabel:          'Password',
        quantityLabel:          'Quantity',

        // s2
        descriptionLabel:       'Description',
        descriptionPlaceholder: 'Type here...',

        // s3
        disabledLabel:          'Disabled field',
        disabledValue:          'Not editable',
        readonlyLabel:          'Read only',
        readonlyValue:          'Fixed value',
        clearableLabel:         'With clear button',
        clearablePlaceholder:   'Type something...',
        searchLabel:            'Search',
        searchPlaceholder:      'Search...',

        // s4
        validResultPlaceholder: '— interact with the fields, validation runs on blur —',
        userLabel:              'Username',
        userLenPlaceholder:     'minimum 4, maximum 20 characters',
        validatedPrefix:        'Validated — valid: ',

        // s5
        eventsLabel:            'Field with events',
        eventsPlaceholder:      'Type something...',
        eventsHint:             'Watch the events in the panel below',
        eventsResultPlaceholder: '— interact with the field —',
        echoFocus:              'focus',
        echoValidPart:          'valid: ',

        // s6
        apiLabel:               'Controlled field',
        apiPlaceholder:         'Controlled by API',
        apiResultPlaceholder:   '— use the buttons to call the API —',
        apiExternalError:       'External server error',

        // s7
        declarativeBlockLabel:  'Declarative HTML',
        declarativeLabel:       'Full name',
        declarativePlaceholder: 'Enter your name',
        declarativeHint:        'Initialized from data-*',
        enhancedBlockLabel:     'Declarative HTML + enhancement',
        enhancedLabel:          'Email',
        enhancedPlaceholder:    'user@company.com',
        enhancedHint:           'Matios UI enhances the base HTML',
        enhancementResultPlaceholder: '— type and change focus to see the enhancement —',

        // s8
        sofHelp:                'Click any field — the text is selected automatically',
        sofNameLabel:           'Full name',
        sofNameHint:            'Click to select all',
        sofQtyLabel:            'Quantity',
        sofQtyHint:             'Useful for editing numbers quickly',
        sofPwdLabel:            'Password (excluded)',
        sofPwdHint:             'selectOnFocus does not apply to password',
        sofResultPlaceholder:   '— click the fields to see the behavior —',
        sofFocusName:           'focus on Name → text selected',
        sofFocusQty:            'focus on Quantity → text selected',
        sofFocusPwd:            'focus on Password → selectOnFocus does not apply',

        // s9
        noeHelp:                'Navigate with Enter — as if it were Tab',
        noeNameLabel:           'First name',
        noeLastLabel:           'Last name',
        noeEmailLabel:          'Email',
        noeAgeLabel:            'Age',
        noeResultPlaceholder:   '— press Enter in each field to move to the next one —',
        noeFocusName:           'focus on First name',
        noeFocusLast:           'focus on Last name',
        noeFocusEmail:          'focus on Email',
        noeFocusAge:            'focus on Age — last field',

        // s10
        countryLabel:           'Country',
        countryPlaceholder:     'Type to filter...',
        countryPrompt:          'Select a country...',

        // s11
        userAsyncPlaceholder:   'e.g. Ana, Luis, María...',
        userAsyncPrompt:        'Select a user...',
        getValueNull:           'null (no selection)'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.Input': {
      messages: {
        required:     'Este campo é obrigatório',
        minLength:    'Mínimo {n} caracteres',
        maxLength:    'Máximo {n} caracteres',
        min:          'Valor mínimo: {n}',
        max:          'Valor máximo: {n}',
        pattern:      'Formato inválido',
        email:        'Email inválido',
        clear:        'Limpar',
        showPassword: 'Mostrar senha'
      },
      demo: {
        subtitle:               'Campos de texto, textarea, validação, estados e enhancement progressivo a partir de HTML declarativo.',

        s1Title:                '1 — Tipos básicos',
        s2Title:                '2 — Textarea e contador',
        s3Title:                '3 — Estados visuais',
        s4Title:                '4 — Validação',
        s5Title:                '5 — Eventos',
        s6Title:                '6 — API programática',
        s7Title:                '7 — HTML declarativo + enhancement',
        s8Title:                '8 — selectOnFocus',
        s9Title:                '9 — nextOnEnter',
        s10Title:               '10 — Autocomplete datasource estático',
        s11Title:               '11 — Autocomplete datasource async (simulado)',

        // s1
        nameLabel:              'Nome',
        namePlaceholder:        'Digite seu nome',
        nameHint:               'Mínimo de 3 caracteres',
        emailLabel:             'E-mail',
        emailPlaceholder:       'usuario@exemplo.com',
        passwordLabel:          'Senha',
        quantityLabel:          'Quantidade',

        // s2
        descriptionLabel:       'Descrição',
        descriptionPlaceholder: 'Escreva aqui...',

        // s3
        disabledLabel:          'Campo desabilitado',
        disabledValue:          'Não editável',
        readonlyLabel:          'Somente leitura',
        readonlyValue:          'Valor fixo',
        clearableLabel:         'Com botão limpar',
        clearablePlaceholder:   'Escreva algo...',
        searchLabel:            'Buscar',
        searchPlaceholder:      'Buscar...',

        // s4
        validResultPlaceholder: '— interaja com os campos, a validação ocorre ao perder o foco —',
        userLabel:              'Usuário',
        userLenPlaceholder:     'mínimo 4, máximo 20 caracteres',
        validatedPrefix:        'Validado — válido: ',

        // s5
        eventsLabel:            'Campo com eventos',
        eventsPlaceholder:      'Escreva algo...',
        eventsHint:             'Observe os eventos no painel inferior',
        eventsResultPlaceholder: '— interaja com o campo —',
        echoFocus:              'focus',
        echoValidPart:          'válido: ',

        // s6
        apiLabel:               'Campo controlado',
        apiPlaceholder:         'Controlado pela API',
        apiResultPlaceholder:   '— use os botões para chamar a API —',
        apiExternalError:       'Erro externo do servidor',

        // s7
        declarativeBlockLabel:  'HTML declarativo',
        declarativeLabel:       'Nome completo',
        declarativePlaceholder: 'Digite seu nome',
        declarativeHint:        'Inicializado a partir de data-*',
        enhancedBlockLabel:     'HTML declarativo + enhancement',
        enhancedLabel:          'E-mail',
        enhancedPlaceholder:    'usuario@empresa.com',
        enhancedHint:           'Matios UI potencializa o HTML base',
        enhancementResultPlaceholder: '— escreva e mude o foco para ver o enhancement —',

        // s8
        sofHelp:                'Clique em qualquer campo — o texto é selecionado automaticamente',
        sofNameLabel:           'Nome completo',
        sofNameHint:            'Clique para selecionar tudo',
        sofQtyLabel:            'Quantidade',
        sofQtyHint:             'Útil para editar números rapidamente',
        sofPwdLabel:            'Senha (excluída)',
        sofPwdHint:             'selectOnFocus não se aplica a password',
        sofResultPlaceholder:   '— clique nos campos para ver o comportamento —',
        sofFocusName:           'focus em Nome → texto selecionado',
        sofFocusQty:            'focus em Quantidade → texto selecionado',
        sofFocusPwd:            'focus em Senha → selectOnFocus não se aplica',

        // s9
        noeHelp:                'Navegue com Enter — como se fosse Tab',
        noeNameLabel:           'Nome',
        noeLastLabel:           'Sobrenome',
        noeEmailLabel:          'E-mail',
        noeAgeLabel:            'Idade',
        noeResultPlaceholder:   '— pressione Enter em cada campo para avançar ao próximo —',
        noeFocusName:           'foco em Nome',
        noeFocusLast:           'foco em Sobrenome',
        noeFocusEmail:          'foco em E-mail',
        noeFocusAge:            'foco em Idade — último campo',

        // s10
        countryLabel:           'País',
        countryPlaceholder:     'Digite para filtrar...',
        countryPrompt:          'Selecione um país...',

        // s11
        userAsyncPlaceholder:   'Ex: Ana, Luis, María...',
        userAsyncPrompt:        'Selecione um usuário...',
        getValueNull:           'null (sem seleção)'
      }
    }
  });

})(window);
