/* ============================================================
   MATIOS UI — matios-ui-calendar-i18n.js  v1.0.0

   Textos del calendario por locale. Idiomas incluidos: es (default), en, pt.
   Pasar al constructor: locale: 'es' | 'en' | 'pt'

   Uso:
     new MTS.Calendar('#cal', { locale: 'es' })
     new MTS.Calendar('#cal', { locale: 'en' })
     new MTS.Calendar('#cal', { locale: 'pt' })

     // Locale custom (cualquier otro idioma):
     MTS.Calendar.registerLocale('fr', { ... })
     new MTS.Calendar('#cal', { locale: 'fr' })
   ============================================================ */

window.MTS = window.MTS || {};

MTS.CalendarLanguages = {

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

  pt: {
    today:       'Hoje',
    week:        'Semana',
    month:       'Mês',
    day:         'Dia',
    schedule:    'Agenda',
    allDay:      'Dia inteiro',
    noEvents:    'Sem eventos neste período',
    more:        n => `+${n} mais`,
    weekOf:      'Semana de',
    months: [
      'Janeiro','Fevereiro','Março','Abril','Maio','Junho',
      'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro',
    ],
    monthsShort: [
      'Jan','Fev','Mar','Abr','Mai','Jun',
      'Jul','Ago','Set','Out','Nov','Dez',
    ],
    days: {
      mini:  ['S','T','Q','Q','S','S','D'],
      short: ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
    },
    export: {
      csv:   'Exportar CSV',
      ical:  'Exportar iCal',
      print: 'Imprimir',
    },
    ctx: {
      view:   'Ver evento',
      edit:   'Editar evento',
      delete: 'Excluir evento',
      add:    'Novo evento',
      color:  'Cor',
    },
    locked:    'Horário reservado',
    collision: 'Horário ocupado',
    mod:       'Mód.',
    hour:      'Hora',
  },

};

/* alias de compatibilidad */
MTS.CalendarLocales = MTS.CalendarLanguages;

/* Registrar idioma custom */
MTS.Calendar.registerLanguage = function(key, obj) {
  MTS.CalendarLanguages[key] = obj;
};
/* alias de compatibilidad */
MTS.Calendar.registerLocale = MTS.Calendar.registerLanguage;

