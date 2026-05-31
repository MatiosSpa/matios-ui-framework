/* ============================================================
   matios-ui-gantt-chart-i18n.js
   Textos propios de MTS.GanttChart (es/en/pt). Mismo nombre del
   componente + "-i18n". Se registra bajo el namespace del componente
   (MTS.GanttChart) y se consume con MTS.getLocale()['MTS.GanttChart'].
   El locale base (MTS.Locales) sigue siendo la capa común.
   ============================================================ */
(function () {
  'use strict';
  if (!window.MTS || typeof MTS.registerLocale !== 'function') {
    if (window.console) { window.console.warn('[gantt-chart-i18n] MTS.registerLocale no disponible.'); }
    return;
  }

  MTS.registerLocale('es', {
    'MTS.GanttChart': {
      months:           ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      weekPrefix:       'S',
      colWbs:           '#',
      colLabel:         'Tarea',
      colStart:         'Inicio',
      colEnd:           'Fin',
      colDuration:      'Días',
      colDurationHours: 'Horas',
      colPredecessors:  'Predecesoras',
      today:            'Hoy',
      empty:            'No hay tareas',
      errorPrefix:      'Error: ',
      loadError:        'Error al cargar',
      reorderHint:      'Arrastrar para reordenar / anidar',
      baselineLabel:    'Línea base',
      // UI del demo/consumer (toolbar, modales, campos). El componente no arma esto; lo pone el dev.
      ui: {
        menuFile: 'Archivo', menuOpen: 'Abrir…', menuSaveAs: 'Guardar como…',
        menuView: 'Vista', scaleDay: 'Día', scaleWeek: 'Semana', scaleMonth: 'Mes',
        menuColumns: 'Columnas', menuWbs: 'WBS', collapseAll: 'Colapsar todo', expandAll: 'Expandir todo',
        menuEdit: 'Edición', undo: 'Deshacer', redo: 'Rehacer', saveBaseline: 'Guardar línea base', clearBaseline: 'Borrar línea base', addTask: 'Tarea',
        taskTitle: 'Tarea',
        fieldName: 'Tarea', fieldStart: 'Inicio', fieldEnd: 'Fin', fieldProgress: 'Avance %',
        fieldColor: 'Color', fieldDeps: 'Dependencias', fieldResp: 'Responsables',
        depsPlaceholder: 'Agregar tarea…', respPlaceholder: 'Buscar persona…',
        save: 'Guardar', cancel: 'Cancelar', needName: 'Ingresa un nombre',
        saveAsTitle: 'Guardar como', fileName: 'Nombre de archivo', format: 'Formato',
        fmtCsv: 'CSV (.csv)', fmtExcel: 'Excel (.xlsx)', fmtMsproject: 'MS Project (MSPDI .xml)',
        cols: { wbs: 'WBS', name: 'Tarea', assignees: 'Asignados', color: 'Color', start: 'Inicio', end: 'Fin', progress: '%', deps: 'Dependencias', variance: 'Desvío' }
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.GanttChart': {
      months:           ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      weekPrefix:       'W',
      colWbs:           '#',
      colLabel:         'Task name',
      colStart:         'Start',
      colEnd:           'End',
      colDuration:      'Days',
      colDurationHours: 'Hours',
      colPredecessors:  'Predecessors',
      today:            'Today',
      empty:            'No tasks',
      errorPrefix:      'Error: ',
      loadError:        'Failed to load',
      reorderHint:      'Drag to reorder / nest',
      baselineLabel:    'Baseline',
      ui: {
        menuFile: 'File', menuOpen: 'Open…', menuSaveAs: 'Save as…',
        menuView: 'View', scaleDay: 'Day', scaleWeek: 'Week', scaleMonth: 'Month',
        menuColumns: 'Columns', menuWbs: 'WBS', collapseAll: 'Collapse all', expandAll: 'Expand all',
        menuEdit: 'Edit', undo: 'Undo', redo: 'Redo', saveBaseline: 'Save baseline', clearBaseline: 'Clear baseline', addTask: 'Task',
        taskTitle: 'Task',
        fieldName: 'Task', fieldStart: 'Start', fieldEnd: 'End', fieldProgress: 'Progress %',
        fieldColor: 'Color', fieldDeps: 'Dependencies', fieldResp: 'Assignees',
        depsPlaceholder: 'Add task…', respPlaceholder: 'Search person…',
        save: 'Save', cancel: 'Cancel', needName: 'Enter a name',
        saveAsTitle: 'Save as', fileName: 'File name', format: 'Format',
        fmtCsv: 'CSV (.csv)', fmtExcel: 'Excel (.xlsx)', fmtMsproject: 'MS Project (MSPDI .xml)',
        cols: { wbs: 'WBS', name: 'Task', assignees: 'Assignees', color: 'Color', start: 'Start', end: 'End', progress: '%', deps: 'Dependencies', variance: 'Variance' }
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.GanttChart': {
      months:           ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      weekPrefix:       'S',
      colWbs:           '#',
      colLabel:         'Tarefa',
      colStart:         'Início',
      colEnd:           'Fim',
      colDuration:      'Dias',
      colDurationHours: 'Horas',
      colPredecessors:  'Predecessoras',
      today:            'Hoje',
      empty:            'Não há tarefas',
      errorPrefix:      'Erro: ',
      loadError:        'Erro ao carregar',
      reorderHint:      'Arrastar para reordenar / aninhar',
      baselineLabel:    'Linha base',
      ui: {
        menuFile: 'Arquivo', menuOpen: 'Abrir…', menuSaveAs: 'Salvar como…',
        menuView: 'Exibir', scaleDay: 'Dia', scaleWeek: 'Semana', scaleMonth: 'Mês',
        menuColumns: 'Colunas', menuWbs: 'WBS', collapseAll: 'Recolher tudo', expandAll: 'Expandir tudo',
        menuEdit: 'Edição', undo: 'Desfazer', redo: 'Refazer', saveBaseline: 'Salvar linha base', clearBaseline: 'Limpar linha base', addTask: 'Tarefa',
        taskTitle: 'Tarefa',
        fieldName: 'Tarefa', fieldStart: 'Início', fieldEnd: 'Fim', fieldProgress: 'Progresso %',
        fieldColor: 'Cor', fieldDeps: 'Dependências', fieldResp: 'Responsáveis',
        depsPlaceholder: 'Adicionar tarefa…', respPlaceholder: 'Buscar pessoa…',
        save: 'Salvar', cancel: 'Cancelar', needName: 'Digite um nome',
        saveAsTitle: 'Salvar como', fileName: 'Nome do arquivo', format: 'Formato',
        fmtCsv: 'CSV (.csv)', fmtExcel: 'Excel (.xlsx)', fmtMsproject: 'MS Project (MSPDI .xml)',
        cols: { wbs: 'WBS', name: 'Tarefa', assignees: 'Responsáveis', color: 'Cor', start: 'Início', end: 'Fim', progress: '%', deps: 'Dependências', variance: 'Desvio' }
      }
    }
  });
})();
