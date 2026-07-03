/* ============================================================
   MATIOS UI — matios-ui-phoneinput-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.PhoneInput
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.PhoneInput': {
      invalid:  'Teléfono inválido',
      required: 'Requerido',
      searchPlaceholder: 'Buscar país...',
      demo: {
        subtitle:               'Input de teléfono con selector de país, formato automático y enhancement progresivo desde HTML declarativo.',
        s1Title:                '1 — Básico — Chile por defecto',
        s2Title:                '2 — Diferentes países iniciales',
        s3Title:                '3 — Tamaños + API',
        s4Title:                '4 — HTML declarativo + enhancement',

        labelPhone:             'Teléfono',
        labelWithHint:          'Con hint',
        labelDisabled:          'Deshabilitado',
        hintAreaCode:           'Incluye el código de área',

        labelMexico:            'México',
        labelArgentina:         'Argentina',
        labelUsa:               'EE.UU.',

        labelLgApi:             'LG + API',
        labelCorporatePhone:    'Teléfono corporativo',
        hintEnhancement:        'Matios UI potencia el HTML base',

        sectionDeclarative:     'HTML declarativo',
        sectionEnhanced:        'HTML declarativo + enhancement',

        resultPlaceholder:      '— interactúa —',
        resultEnhancePlaceholder: '— cambia país o número para ver el enhancement —',

        errorInvalid:           'Número inválido',
        setCountryApplied:      'setCountry(BR) aplicado',
        setErrorApplied:        'setError() aplicado',
        clearErrorApplied:      'clearError() aplicado',

        fullPrefix:             'full: ',
        countryPrefix:          'country: ',
        getValuePrefix:         'getValue() → '
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.PhoneInput': {
      invalid:  'Invalid phone number',
      required: 'Required',
      searchPlaceholder: 'Search country...',
      demo: {
        subtitle:               'Phone input with country selector, automatic formatting and progressive enhancement from declarative HTML.',
        s1Title:                '1 — Basic — Chile default',
        s2Title:                '2 — Different initial countries',
        s3Title:                '3 — Sizes + API',
        s4Title:                '4 — Declarative HTML + enhancement',

        labelPhone:             'Phone',
        labelWithHint:          'With hint',
        labelDisabled:          'Disabled',
        hintAreaCode:           'Include the area code',

        labelMexico:            'Mexico',
        labelArgentina:         'Argentina',
        labelUsa:               'USA',

        labelLgApi:             'LG + API',
        labelCorporatePhone:    'Corporate phone',
        hintEnhancement:        'Matios UI enhances the base HTML',

        sectionDeclarative:     'Declarative HTML',
        sectionEnhanced:        'Declarative HTML + enhancement',

        resultPlaceholder:      '— interact —',
        resultEnhancePlaceholder: '— change country or number to see the enhancement —',

        errorInvalid:           'Invalid number',
        setCountryApplied:      'setCountry(BR) applied',
        setErrorApplied:        'setError() applied',
        clearErrorApplied:      'clearError() applied',

        fullPrefix:             'full: ',
        countryPrefix:          'country: ',
        getValuePrefix:         'getValue() → '
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.PhoneInput': {
      invalid:  'Telefone inválido',
      required: 'Obrigatório',
      searchPlaceholder: 'Buscar país...',
      demo: {
        subtitle:               'Campo de telefone com seletor de país, formatação automática e enhancement progressivo a partir de HTML declarativo.',
        s1Title:                '1 — Básico — Chile padrão',
        s2Title:                '2 — Diferentes países iniciais',
        s3Title:                '3 — Tamanhos + API',
        s4Title:                '4 — HTML declarativo + enhancement',

        labelPhone:             'Telefone',
        labelWithHint:          'Com dica',
        labelDisabled:          'Desabilitado',
        hintAreaCode:           'Inclua o código de área',

        labelMexico:            'México',
        labelArgentina:         'Argentina',
        labelUsa:               'EUA',

        labelLgApi:             'LG + API',
        labelCorporatePhone:    'Telefone corporativo',
        hintEnhancement:        'Matios UI potencializa o HTML base',

        sectionDeclarative:     'HTML declarativo',
        sectionEnhanced:        'HTML declarativo + enhancement',

        resultPlaceholder:      '— interaja —',
        resultEnhancePlaceholder: '— altere o país ou número para ver o enhancement —',

        errorInvalid:           'Número inválido',
        setCountryApplied:      'setCountry(BR) aplicado',
        setErrorApplied:        'setError() aplicado',
        clearErrorApplied:      'clearError() aplicado',

        fullPrefix:             'full: ',
        countryPrefix:          'country: ',
        getValuePrefix:         'getValue() → '
      }
    }
  });

})(window);
