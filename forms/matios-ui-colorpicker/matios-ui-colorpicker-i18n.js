/* ============================================================
   MATIOS UI — matios-ui-colorpicker-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.ColorPicker
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.ColorPicker': {
      messages: { required: 'Este campo es obligatorio' },
      demo: {
        subtitle:               'Selector de color standalone — sliders HSL, paleta de presets, salida hex/rgb/hsl.',
        s1Title:                '1 — Trigger (popup) — tamaños',
        s2Title:                '2 — Inline (siempre visible)',
        s3Title:                '3 — Formatos hex · rgb · hsl + API',
        s4Title:                '4 — Sin sliders · deshabilitado',
        s5Title:                '5 — HTML declarativo + enhancement',
        s6Title:                '6 — Paleta: por defecto · presets personalizados',
        resultSelectColor:      '— selecciona un color —',
        resultMoveSliders:      '— mueve los sliders —',
        resultUseButtons:       '— usa los botones —',
        resultDeclarative:      '— enhancement declarativo —',
        labelSmall:             'Small (sm)',
        labelMedium:            'Medium (md)',
        labelLarge:             'Large (lg)',
        labelFormatHex:         'Formato: HEX',
        labelFormatRgb:         'Formato: RGB',
        labelFormatHsl:         'Formato: HSL',
        labelNoSliders:         'Sin sliders',
        labelDisabled:          'Deshabilitado',
        labelTriggerNoPresets:  'Trigger — sin presets definidos',
        labelCustomPresets:     'Presets personalizados',
        labelEventColor:        'Color de evento',
        labelBrandColors:       'Colores de marca',
        echoOnChangePrefix:     'onChange → '
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.ColorPicker': {
      messages: { required: 'This field is required' },
      demo: {
        subtitle:               'Standalone color picker — HSL sliders, preset palette, hex/rgb/hsl output.',
        s1Title:                '1 — Trigger (popup) — sizes',
        s2Title:                '2 — Inline (always visible)',
        s3Title:                '3 — Formats hex · rgb · hsl + API',
        s4Title:                '4 — No sliders · disabled',
        s5Title:                '5 — Declarative HTML + enhancement',
        s6Title:                '6 — Palette: default · custom presets',
        resultSelectColor:      '— pick a color —',
        resultMoveSliders:      '— move the sliders —',
        resultUseButtons:       '— use the buttons —',
        resultDeclarative:      '— declarative enhancement —',
        labelSmall:             'Small (sm)',
        labelMedium:            'Medium (md)',
        labelLarge:             'Large (lg)',
        labelFormatHex:         'Format: HEX',
        labelFormatRgb:         'Format: RGB',
        labelFormatHsl:         'Format: HSL',
        labelNoSliders:         'No sliders',
        labelDisabled:          'Disabled',
        labelTriggerNoPresets:  'Trigger — no presets defined',
        labelCustomPresets:     'Custom presets',
        labelEventColor:        'Event color',
        labelBrandColors:       'Brand colors',
        echoOnChangePrefix:     'onChange → '
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.ColorPicker': {
      messages: { required: 'Este campo é obrigatório' },
      demo: {
        subtitle:               'Seletor de cor standalone — sliders HSL, paleta de presets, saída hex/rgb/hsl.',
        s1Title:                '1 — Trigger (popup) — tamanhos',
        s2Title:                '2 — Inline (sempre visível)',
        s3Title:                '3 — Formatos hex · rgb · hsl + API',
        s4Title:                '4 — Sem sliders · desabilitado',
        s5Title:                '5 — HTML declarativo + enhancement',
        s6Title:                '6 — Paleta: padrão · presets personalizados',
        resultSelectColor:      '— selecione uma cor —',
        resultMoveSliders:      '— mova os sliders —',
        resultUseButtons:       '— use os botões —',
        resultDeclarative:      '— enhancement declarativo —',
        labelSmall:             'Small (sm)',
        labelMedium:            'Medium (md)',
        labelLarge:             'Large (lg)',
        labelFormatHex:         'Formato: HEX',
        labelFormatRgb:         'Formato: RGB',
        labelFormatHsl:         'Formato: HSL',
        labelNoSliders:         'Sem sliders',
        labelDisabled:          'Desabilitado',
        labelTriggerNoPresets:  'Trigger — sem presets definidos',
        labelCustomPresets:     'Presets personalizados',
        labelEventColor:        'Cor do evento',
        labelBrandColors:       'Cores da marca',
        echoOnChangePrefix:     'onChange → '
      }
    }
  });

})(window);
