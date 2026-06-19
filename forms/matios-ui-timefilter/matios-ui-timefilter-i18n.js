/* ============================================================
   MATIOS UI — matios-ui-timefilter-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.TimeFilter
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.TimeFilter': {
      tabRelative:  'Relativo',
      tabAbsolute:  'Absoluto',
      tabQuick:     'Rápido',
      amount:       'Cantidad',
      unit:         'Unidad',
      from:         'Desde',
      to:           'Hasta',
      apply:        'Aplicar',
      lastN:        'Últimos',
      invalidRange: 'Rango inválido.',
      units:    { m: 'minutos', h: 'horas', d: 'días', w: 'semanas' },
      unitsOne: { m: 'minuto', h: 'hora', d: 'día', w: 'semana' },
      presets:  { today: 'Hoy', yesterday: 'Ayer', thisWeek: 'Esta semana', lastWeek: 'Semana pasada', thisMonth: 'Este mes', lastMonth: 'Mes pasado' },
      demo: {
        subtitleHtml: 'Filtro de ventana de tiempo estilo Kibana: modo <strong>relativo</strong> (Últimos N), <strong>absoluto</strong> (desde/hasta) y <strong>rápido</strong> (presets). Resuelve un <code>{from, to}</code> y lo entrega por <code>onChange</code> / <code>get()</code>.',
        s1Title:  '1 — Filtro de tiempo (relativo · absoluto · rápido)',
        s2Title:  '2 — Auto-refresh: la ventana relativa avanza sola',
        applied:  'Rango aplicado',
        liveNote: 'En modo relativo, cada <code>get()</code> recalcula <code>to = ahora</code>. Acá se llama cada 2 s.'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.TimeFilter': {
      tabRelative:  'Relative',
      tabAbsolute:  'Absolute',
      tabQuick:     'Quick',
      amount:       'Amount',
      unit:         'Unit',
      from:         'From',
      to:           'To',
      apply:        'Apply',
      lastN:        'Last',
      invalidRange: 'Invalid range.',
      units:    { m: 'minutes', h: 'hours', d: 'days', w: 'weeks' },
      unitsOne: { m: 'minute', h: 'hour', d: 'day', w: 'week' },
      presets:  { today: 'Today', yesterday: 'Yesterday', thisWeek: 'This week', lastWeek: 'Last week', thisMonth: 'This month', lastMonth: 'Last month' },
      demo: {
        subtitleHtml: 'Kibana-style time-window filter: <strong>relative</strong> (Last N), <strong>absolute</strong> (from/to) and <strong>quick</strong> (presets) modes. Resolves a <code>{from, to}</code> and hands it back through <code>onChange</code> / <code>get()</code>.',
        s1Title:  '1 — Time filter (relative · absolute · quick)',
        s2Title:  '2 — Auto-refresh: the relative window advances on its own',
        applied:  'Applied range',
        liveNote: 'In relative mode every <code>get()</code> recomputes <code>to = now</code>. Here it is called every 2 s.'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.TimeFilter': {
      tabRelative:  'Relativo',
      tabAbsolute:  'Absoluto',
      tabQuick:     'Rápido',
      amount:       'Quantidade',
      unit:         'Unidade',
      from:         'De',
      to:           'Até',
      apply:        'Aplicar',
      lastN:        'Últimos',
      invalidRange: 'Intervalo inválido.',
      units:    { m: 'minutos', h: 'horas', d: 'dias', w: 'semanas' },
      unitsOne: { m: 'minuto', h: 'hora', d: 'dia', w: 'semana' },
      presets:  { today: 'Hoje', yesterday: 'Ontem', thisWeek: 'Esta semana', lastWeek: 'Semana passada', thisMonth: 'Este mês', lastMonth: 'Mês passado' },
      demo: {
        subtitleHtml: 'Filtro de janela de tempo estilo Kibana: modo <strong>relativo</strong> (Últimos N), <strong>absoluto</strong> (de/até) e <strong>rápido</strong> (presets). Resolve um <code>{from, to}</code> e o entrega via <code>onChange</code> / <code>get()</code>.',
        s1Title:  '1 — Filtro de tempo (relativo · absoluto · rápido)',
        s2Title:  '2 — Auto-refresh: a janela relativa avança sozinha',
        applied:  'Intervalo aplicado',
        liveNote: 'No modo relativo, cada <code>get()</code> recalcula <code>to = agora</code>. Aqui é chamado a cada 2 s.'
      }
    }
  });

})(window);
