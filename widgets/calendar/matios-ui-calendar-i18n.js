/* ============================================================
   MATIOS UI — matios-ui-calendar-i18n.js  v1.0.0

   Textos del calendario por locale.
   Pasar al constructor: locale: 'es'  (default)

   Uso:
     new MTS.Calendar('#cal', { locale: 'es' })
     new MTS.Calendar('#cal', { locale: 'en' })

     // Locale custom:
     MTS.Calendar.registerLocale('pt', { ... })
     new MTS.Calendar('#cal', { locale: 'pt' })
   ============================================================ */

window.MTS = window.MTS || {};

MTS.CalendarLocales = {

  es: {
    today:       'Hoy',
    week:        'Semana',
    month:       'Mes',
    day:         'Día',
    schedule:    'Agenda',
    allDay:      'Todo el día',
    noEvents:    'Sin eventos en este período',
    more:        n => `+${n} más`,
    weekOf:      'Semana del',
    months: [
      'Enero','Febrero','Marzo','Abril','Mayo','Junio',
      'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
    ],
    monthsShort: [
      'Ene','Feb','Mar','Abr','May','Jun',
      'Jul','Ago','Sep','Oct','Nov','Dic',
    ],
    days: {
      mini:  ['L','M','X','J','V','S','D'],
      short: ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],
    },
    export: {
      csv:   'Exportar CSV',
      ical:  'Exportar iCal',
      print: 'Imprimir',
    },
    ctx: {
      view:   'Ver evento',
      edit:   'Editar evento',
      delete: 'Eliminar evento',
      add:    'Nuevo evento',
      color:  'Color',
    },
    locked:    'Horario reservado',
    collision: 'Horario ocupado',
    mod:       'Mod.',
    hour:      'Hora',
  },

  en: {
    today:       'Today',
    week:        'Week',
    month:       'Month',
    day:         'Day',
    schedule:    'Schedule',
    allDay:      'All day',
    noEvents:    'No events in this period',
    more:        n => `+${n} more`,
    weekOf:      'Week of',
    months: [
      'January','February','March','April','May','June',
      'July','August','September','October','November','December',
    ],
    monthsShort: [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec',
    ],
    days: {
      mini:  ['M','T','W','T','F','S','S'],
      short: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    },
    export: {
      csv:   'Export CSV',
      ical:  'Export iCal',
      print: 'Print',
    },
    ctx: {
      view:   'View event',
      edit:   'Edit event',
      delete: 'Delete event',
      add:    'New event',
      color:  'Color',
    },
    locked:    'Reserved slot',
    collision: 'Slot taken',
    mod:       'Slot',
    hour:      'Time',
  },

};

/* Registrar locale custom */
MTS.Calendar.registerLocale = function(key, obj) {
  MTS.CalendarLocales[key] = obj;
};

/* Obtener locale activo — fallback a 'es' */
MTS.Calendar.getLocale = function(key) {
  return MTS.CalendarLocales[key] || MTS.CalendarLocales['es'];
};
