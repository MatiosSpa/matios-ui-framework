/* ============================================================
   MATIOS UI — matios-ui-slider-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Slider
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Slider': {
      messages: { required: 'Este campo es obligatorio' },
      demo: {
        subtitle:            'Slider simple, rango doble y control programático usando el patrón de demo estándar.',
        s1Title:             '1 — Slider simple',
        s2Title:             '2 — Rango doble',
        s3Title:             '3 — API',
        resultSimple:        '— mueve los sliders —',
        resultRange:         '— mueve los rangos —',
        resultApi:           '— usa los botones —',
        labelVolume:         'Volumen',
        labelBrightness:     'Brillo',
        labelTemperature:    'Temperatura',
        labelAgeRange:       'Rango de edad',
        labelPrice:          'Precio',
        labelApiDemo:        'Demo de API',
        echoVolume:          'Volumen → ',
        echoBrightness:      'Brillo → ',
        echoTemperature:     'Temperatura → ',
        echoAge:             'Edad → ',
        echoPrice:           'Precio → ',
        echoChange:          'cambio → ',
        echoSetValue:        'setValue('
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Slider': {
      messages: { required: 'This field is required' },
      demo: {
        subtitle:            'Simple slider, dual range and programmatic control using the standard demo pattern.',
        s1Title:             '1 — Simple slider',
        s2Title:             '2 — Dual range',
        s3Title:             '3 — API',
        resultSimple:        '— move the sliders —',
        resultRange:         '— move the ranges —',
        resultApi:           '— use the buttons —',
        labelVolume:         'Volume',
        labelBrightness:     'Brightness',
        labelTemperature:    'Temperature',
        labelAgeRange:       'Age range',
        labelPrice:          'Price',
        labelApiDemo:        'API demo',
        echoVolume:          'Volume → ',
        echoBrightness:      'Brightness → ',
        echoTemperature:     'Temperature → ',
        echoAge:             'Age → ',
        echoPrice:           'Price → ',
        echoChange:          'change → ',
        echoSetValue:        'setValue('
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Slider': {
      messages: { required: 'Este campo é obrigatório' },
      demo: {
        subtitle:            'Slider simples, intervalo duplo e controle programático usando o padrão de demo padrão.',
        s1Title:             '1 — Slider simples',
        s2Title:             '2 — Intervalo duplo',
        s3Title:             '3 — API',
        resultSimple:        '— mova os sliders —',
        resultRange:         '— mova os intervalos —',
        resultApi:           '— use os botões —',
        labelVolume:         'Volume',
        labelBrightness:     'Brilho',
        labelTemperature:    'Temperatura',
        labelAgeRange:       'Faixa etária',
        labelPrice:          'Preço',
        labelApiDemo:        'Demo de API',
        echoVolume:          'Volume → ',
        echoBrightness:      'Brilho → ',
        echoTemperature:     'Temperatura → ',
        echoAge:             'Idade → ',
        echoPrice:           'Preço → ',
        echoChange:          'mudança → ',
        echoSetValue:        'setValue('
      }
    }
  });

})(window);
