/* ============================================================
   MATIOS UI — matios-ui-toggle-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Toggle
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Toggle': {
      demo: {
        subtitle:               'Switch on/off en distintos tamaños, con label, disabled y API programática.',
        s1Title:                '1 — Tamaños',
        s2Title:                '2 — Con label y eventos',
        s3Title:                '3 — Deshabilitado',
        s4Title:                '4 — API programática',
        labelSmall:             'Pequeño',
        labelMedium:            'Mediano (default)',
        labelLarge:             'Grande',
        labelNotifications:     'Notificaciones activas',
        labelMaintenance:       'Modo mantenimiento',
        labelNotAvailable:      'No disponible',
        labelForcedActive:      'Activo forzado',
        labelControlled:        'Toggle controlado',
        resultS2Placeholder:    '— interactúa con los toggles —',
        resultApiPlaceholder:   '— usa los botones para llamar la API —',
        echoNotifications:      'Notificaciones: ',
        echoMaintenance:        'Mantenimiento: ',
        echoNoLabel:            'Sin label: ',
        echoChanged:            'cambió: ',
        echoIsChecked:          'isChecked() → ',
        echoSetTrue:            'setChecked(true) ✓',
        echoSetFalse:           'setChecked(false) ✓',
        echoToggle:             'toggle() → ahora: '
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Toggle': {
      demo: {
        subtitle:               'On/off switch in different sizes, with label, disabled and programmatic API.',
        s1Title:                '1 — Sizes',
        s2Title:                '2 — With label and events',
        s3Title:                '3 — Disabled',
        s4Title:                '4 — Programmatic API',
        labelSmall:             'Small',
        labelMedium:            'Medium (default)',
        labelLarge:             'Large',
        labelNotifications:     'Active notifications',
        labelMaintenance:       'Maintenance mode',
        labelNotAvailable:      'Not available',
        labelForcedActive:      'Forced active',
        labelControlled:        'Controlled toggle',
        resultS2Placeholder:    '— interact with the toggles —',
        resultApiPlaceholder:   '— use the buttons to call the API —',
        echoNotifications:      'Notifications: ',
        echoMaintenance:        'Maintenance: ',
        echoNoLabel:            'No label: ',
        echoChanged:            'changed: ',
        echoIsChecked:          'isChecked() → ',
        echoSetTrue:            'setChecked(true) ✓',
        echoSetFalse:           'setChecked(false) ✓',
        echoToggle:             'toggle() → now: '
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Toggle': {
      demo: {
        subtitle:               'Interruptor on/off em diferentes tamanhos, com label, desabilitado e API programática.',
        s1Title:                '1 — Tamanhos',
        s2Title:                '2 — Com label e eventos',
        s3Title:                '3 — Desabilitado',
        s4Title:                '4 — API programática',
        labelSmall:             'Pequeno',
        labelMedium:            'Médio (default)',
        labelLarge:             'Grande',
        labelNotifications:     'Notificações ativas',
        labelMaintenance:       'Modo manutenção',
        labelNotAvailable:      'Não disponível',
        labelForcedActive:      'Ativo forçado',
        labelControlled:        'Toggle controlado',
        resultS2Placeholder:    '— interaja com os toggles —',
        resultApiPlaceholder:   '— use os botões para chamar a API —',
        echoNotifications:      'Notificações: ',
        echoMaintenance:        'Manutenção: ',
        echoNoLabel:            'Sem label: ',
        echoChanged:            'mudou: ',
        echoIsChecked:          'isChecked() → ',
        echoSetTrue:            'setChecked(true) ✓',
        echoSetFalse:           'setChecked(false) ✓',
        echoToggle:             'toggle() → agora: '
      }
    }
  });

})(window);
