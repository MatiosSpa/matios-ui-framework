/* ============================================================
   MATIOS UI — matios-ui-checkbox-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Checkbox
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Checkbox': {
      messages: { required: 'Este campo es obligatorio' },
      demo: {
        subtitle:                'Checkbox individual, estados básicos, grupos vertical y horizontal, y grupo disabled.',
        s1Title:                 '1 — Checkbox individual',
        s2Title:                 '2 — Grupo vertical (default)',
        s3Title:                 '3 — Grupo horizontal',
        s4Title:                 '4 — Grupo completamente deshabilitado',
        labelNormal:             'Normal',
        labelChecked:            'Pre-marcado',
        labelIndeterminate:      'Indeterminado',
        labelDisabled:           'Disabled',
        labelDisabledChecked:    'Disabled checked',
        resultBasicPlaceholder:  '— interactúa con los checkboxes —',
        resultGroupPlaceholder:  '— selecciona opciones —',
        cbAccept:                'Acepto los términos',
        cbPreChecked:            'Pre-marcado',
        cbPartial:               'Selección parcial',
        echoChecked:             'checked: ',
        echoValues:              'valores: ',
        dayMon:                  'Lunes',
        dayTue:                  'Martes',
        dayWed:                  'Miércoles',
        dayThu:                  'Jueves',
        dayFri:                  'Viernes',
        optA:                    'Opción A',
        optB:                    'Opción B',
        optC:                    'Opción C'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Checkbox': {
      messages: { required: 'This field is required' },
      demo: {
        subtitle:                'Single checkbox, basic states, vertical and horizontal groups, and a disabled group.',
        s1Title:                 '1 — Single checkbox',
        s2Title:                 '2 — Vertical group (default)',
        s3Title:                 '3 — Horizontal group',
        s4Title:                 '4 — Fully disabled group',
        labelNormal:             'Normal',
        labelChecked:            'Pre-checked',
        labelIndeterminate:      'Indeterminate',
        labelDisabled:           'Disabled',
        labelDisabledChecked:    'Disabled checked',
        resultBasicPlaceholder:  '— interact with the checkboxes —',
        resultGroupPlaceholder:  '— select options —',
        cbAccept:                'I accept the terms',
        cbPreChecked:            'Pre-checked',
        cbPartial:               'Partial selection',
        echoChecked:             'checked: ',
        echoValues:              'values: ',
        dayMon:                  'Monday',
        dayTue:                  'Tuesday',
        dayWed:                  'Wednesday',
        dayThu:                  'Thursday',
        dayFri:                  'Friday',
        optA:                    'Option A',
        optB:                    'Option B',
        optC:                    'Option C'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Checkbox': {
      messages: { required: 'Este campo é obrigatório' },
      demo: {
        subtitle:                'Checkbox individual, estados básicos, grupos vertical e horizontal, e grupo desabilitado.',
        s1Title:                 '1 — Checkbox individual',
        s2Title:                 '2 — Grupo vertical (padrão)',
        s3Title:                 '3 — Grupo horizontal',
        s4Title:                 '4 — Grupo totalmente desabilitado',
        labelNormal:             'Normal',
        labelChecked:            'Pré-marcado',
        labelIndeterminate:      'Indeterminado',
        labelDisabled:           'Disabled',
        labelDisabledChecked:    'Disabled checked',
        resultBasicPlaceholder:  '— interaja com os checkboxes —',
        resultGroupPlaceholder:  '— selecione opções —',
        cbAccept:                'Aceito os termos',
        cbPreChecked:            'Pré-marcado',
        cbPartial:               'Seleção parcial',
        echoChecked:             'checked: ',
        echoValues:              'valores: ',
        dayMon:                  'Segunda',
        dayTue:                  'Terça',
        dayWed:                  'Quarta',
        dayThu:                  'Quinta',
        dayFri:                  'Sexta',
        optA:                    'Opção A',
        optB:                    'Opção B',
        optC:                    'Opção C'
      }
    }
  });

})(window);
