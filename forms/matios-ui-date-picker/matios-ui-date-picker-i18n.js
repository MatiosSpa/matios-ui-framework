/* ============================================================
   MATIOS UI — matios-ui-date-picker-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.DatePicker
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.DatePicker': {
      messages: { required: 'Este campo es obligatorio' },
      chrome: {
        weekdays:    ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        today:       'Hoy',
        now:         'Ahora',
        accept:      'Aceptar',
        clear:       'Limpiar',
        week:        'Semana',
        clearAria:   'Limpiar',
        prevMonth:   'Mes anterior',
        nextMonth:   'Mes siguiente',
        viewMonths:  'Ver meses',
        viewYears:   'Ver años'
      },
      demo: {
        subtitle:            'Selectores de fecha, hora, rango, mes y semana. Cada tipo es una clase independiente.',
        s1Title:             '1 — Fecha / Hora / Fecha y hora',
        s2Title:             '2 — Rango de fechas',
        s3Title:             '3 — Mes / Semana',
        s4Title:             '4 — API común',
        s5Title:             '5 — Rango enlazado (Desde / Hasta) · linkRange',
        labelFrom:           'Desde',
        labelTo:             'Hasta',
        outFrom:             '— inicio —',
        outTo:               '— fin —',
        labelDate:           'Fecha',
        labelTime:           'Hora',
        labelDateTime:       'Fecha y hora',
        labelRange:          'Rango de fechas',
        labelMonth:          'Mes',
        labelWeek:           'Semana',
        outDate:             '— selecciona una fecha —',
        outTime:             '— selecciona una hora —',
        outDateTime:         '— selecciona fecha y hora —',
        outRange:            '— selecciona un rango —',
        outMonth:            '— selecciona un mes —',
        outWeek:             '— selecciona una semana —',
        apiHint:             'API común disponible para todos los tipos de selector.',
        btnNow:              'Ahora',
        btnAccept:           'Aceptar',
        btnToday:            'Hoy',
        btnClear:            'Limpiar',
        btnApply:            'Aplicar',
        localeCode:          'es-CL'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.DatePicker': {
      messages: { required: 'This field is required' },
      chrome: {
        weekdays:    ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        today:       'Today',
        now:         'Now',
        accept:      'Accept',
        clear:       'Clear',
        week:        'Week',
        clearAria:   'Clear',
        prevMonth:   'Previous month',
        nextMonth:   'Next month',
        viewMonths:  'View months',
        viewYears:   'View years'
      },
      demo: {
        subtitle:            'Date, time, range, month and week pickers. Each type is an independent class.',
        s1Title:             '1 — Date / Time / DateTime',
        s2Title:             '2 — Date Range',
        s3Title:             '3 — Month / Week',
        s4Title:             '4 — Common API',
        s5Title:             '5 — Linked range (From / To) · linkRange',
        labelFrom:           'From',
        labelTo:             'To',
        outFrom:             '— start —',
        outTo:               '— end —',
        labelDate:           'Date',
        labelTime:           'Time',
        labelDateTime:       'DateTime',
        labelRange:          'Date Range',
        labelMonth:          'Month',
        labelWeek:           'Week',
        outDate:             '— pick a date —',
        outTime:             '— pick a time —',
        outDateTime:         '— pick date and time —',
        outRange:            '— pick a range —',
        outMonth:            '— pick a month —',
        outWeek:             '— pick a week —',
        apiHint:             'Common API available for every picker type.',
        btnNow:              'Now',
        btnAccept:           'Accept',
        btnToday:            'Today',
        btnClear:            'Clear',
        btnApply:            'Apply',
        localeCode:          'en-US'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.DatePicker': {
      messages: { required: 'Este campo é obrigatório' },
      chrome: {
        weekdays:    ['Se', 'Te', 'Qa', 'Qi', 'Se', 'Sá', 'Do'],
        monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        today:       'Hoje',
        now:         'Agora',
        accept:      'Aceitar',
        clear:       'Limpar',
        week:        'Semana',
        clearAria:   'Limpar',
        prevMonth:   'Mês anterior',
        nextMonth:   'Próximo mês',
        viewMonths:  'Ver meses',
        viewYears:   'Ver anos'
      },
      demo: {
        subtitle:            'Seletores de data, hora, intervalo, mês e semana. Cada tipo é uma classe independente.',
        s1Title:             '1 — Data / Hora / Data e hora',
        s2Title:             '2 — Intervalo de datas',
        s3Title:             '3 — Mês / Semana',
        s4Title:             '4 — API comum',
        s5Title:             '5 — Intervalo vinculado (De / Até) · linkRange',
        labelFrom:           'De',
        labelTo:             'Até',
        outFrom:             '— início —',
        outTo:               '— fim —',
        labelDate:           'Data',
        labelTime:           'Hora',
        labelDateTime:       'Data e hora',
        labelRange:          'Intervalo de datas',
        labelMonth:          'Mês',
        labelWeek:           'Semana',
        outDate:             '— selecione uma data —',
        outTime:             '— selecione uma hora —',
        outDateTime:         '— selecione data e hora —',
        outRange:            '— selecione um intervalo —',
        outMonth:            '— selecione um mês —',
        outWeek:             '— selecione uma semana —',
        apiHint:             'API comum disponível para todos os tipos de seletor.',
        btnNow:              'Agora',
        btnAccept:           'Aceitar',
        btnToday:            'Hoje',
        btnClear:            'Limpar',
        btnApply:            'Aplicar',
        localeCode:          'pt-BR'
      }
    }
  });

})(window);
