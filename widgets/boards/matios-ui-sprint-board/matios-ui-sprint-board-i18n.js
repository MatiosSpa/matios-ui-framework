/* ============================================================
   matios-ui-sprint-board-i18n.js
   Textos propios de MTS.SprintBoard (es/en/pt). Namespace
   MTS.SprintBoard; se consume con MTS.getString()['MTS.SprintBoard'].
   El locale base sigue siendo base/matios-ui-i18n.js.
   ============================================================ */
(function () {
  'use strict';
  if (!window.MTS || typeof MTS.registerLocale !== 'function') {
    if (window.console) { window.console.warn('[sprint-board-i18n] MTS.registerLocale no disponible.'); }
    return;
  }

  MTS.registerLocale('es', {
    'MTS.SprintBoard': {
      colTodo: 'Por hacer', colWip: 'En curso', colDone: 'Completado',
      noSprint: 'Sin sprint activo', sprintFallback: 'Sprint',
      startSprint: 'Iniciar Sprint', closeSprint: 'Cerrar Sprint',
      addStoryInline: '+ Historia', addStoryDefault: '+ Agregar historia',
      backlog: 'Backlog', backlogEmpty: 'Backlog vacío',
      capacity: 'Capacidad', sp: 'SP',
      moveToSprint: 'Mover al Sprint', moveToBacklog: 'Mover al Backlog',
      titlePh: 'Título de la historia *', add: 'Agregar', cancel: 'Cancelar',
      ui: {
        brand: 'MTS.SprintBoard', cardTitle: 'Historia',
        save: 'Guardar', cancel: 'Cancelar', del: 'Eliminar', needTitle: 'Ingresa un título',
        fTitle: 'Título', fType: 'Tipo', fPriority: 'Prioridad', fPoints: 'Puntos (SP)', fAssignee: 'Responsable', fDesc: 'Descripción',
        types: { userstory: 'Historia', task: 'Tarea', bug: 'Bug', epic: 'Épica', spike: 'Spike' },
        priorities: { low: 'Baja', medium: 'Media', high: 'Alta', critical: 'Crítica' }
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.SprintBoard': {
      colTodo: 'To do', colWip: 'In progress', colDone: 'Done',
      noSprint: 'No active sprint', sprintFallback: 'Sprint',
      startSprint: 'Start sprint', closeSprint: 'Close sprint',
      addStoryInline: '+ Story', addStoryDefault: '+ Add story',
      backlog: 'Backlog', backlogEmpty: 'Empty backlog',
      capacity: 'Capacity', sp: 'SP',
      moveToSprint: 'Move to sprint', moveToBacklog: 'Move to backlog',
      titlePh: 'Story title *', add: 'Add', cancel: 'Cancel',
      ui: {
        brand: 'MTS.SprintBoard', cardTitle: 'Story',
        save: 'Save', cancel: 'Cancel', del: 'Delete', needTitle: 'Enter a title',
        fTitle: 'Title', fType: 'Type', fPriority: 'Priority', fPoints: 'Points (SP)', fAssignee: 'Assignee', fDesc: 'Description',
        types: { userstory: 'User story', task: 'Task', bug: 'Bug', epic: 'Epic', spike: 'Spike' },
        priorities: { low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical' }
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.SprintBoard': {
      colTodo: 'A fazer', colWip: 'Em curso', colDone: 'Concluído',
      noSprint: 'Sem sprint ativo', sprintFallback: 'Sprint',
      startSprint: 'Iniciar Sprint', closeSprint: 'Encerrar Sprint',
      addStoryInline: '+ História', addStoryDefault: '+ Adicionar história',
      backlog: 'Backlog', backlogEmpty: 'Backlog vazio',
      capacity: 'Capacidade', sp: 'SP',
      moveToSprint: 'Mover ao Sprint', moveToBacklog: 'Mover ao Backlog',
      titlePh: 'Título da história *', add: 'Adicionar', cancel: 'Cancelar',
      ui: {
        brand: 'MTS.SprintBoard', cardTitle: 'História',
        save: 'Salvar', cancel: 'Cancelar', del: 'Excluir', needTitle: 'Digite um título',
        fTitle: 'Título', fType: 'Tipo', fPriority: 'Prioridade', fPoints: 'Pontos (SP)', fAssignee: 'Responsável', fDesc: 'Descrição',
        types: { userstory: 'História', task: 'Tarefa', bug: 'Bug', epic: 'Épico', spike: 'Spike' },
        priorities: { low: 'Baixa', medium: 'Média', high: 'Alta', critical: 'Crítica' }
      }
    }
  });
})();
