/* ============================================================
   matios-ui-kanban-i18n.js
   Textos propios de MTS.Kanban (es/en/pt). Mismo nombre del
   componente + "-i18n". Namespace MTS.Kanban; se consume con
   MTS.getLocale()['MTS.Kanban']. El locale base sigue siendo
   base/matios-ui-i18n.js.
   ============================================================ */
(function () {
  'use strict';
  if (!window.MTS || typeof MTS.registerLocale !== 'function') {
    if (window.console) { window.console.warn('[kanban-i18n] MTS.registerLocale no disponible.'); }
    return;
  }

  MTS.registerLocale('es', {
    'MTS.Kanban': {
      addTaskDefault: '+ Agregar tarea',
      addCard:        'Agregar tarjeta',
      titlePh:        'Título de la tarjeta *',
      descPh:         'Descripción (opcional)',
      tagsPh:         'Escribe y presiona Enter…',
      assigneePh:     'Buscar usuario…',
      searching:      'Buscando…',
      priorityNone:   'Sin prioridad', priorityLow: 'Baja', priorityMedium: 'Media', priorityHigh: 'Alta',
      priorityLabel:  'Prioridad', assigneeLabel: 'Asignado', noResults: 'Sin resultados', tags: 'Etiquetas',
      addColumn:      'Columna', columnNamePh: 'Nombre de la columna', renameHint: 'Doble clic para renombrar', deleteColumn: 'Eliminar columna',
      // UI del demo/consumer (toolbar, modales, columnas). Lo arma el dev.
      ui: {
        brand: 'MTS.Kanban', addCard: '+ Tarjeta',
        cardTitle: 'Tarjeta', modalTitle: 'Nueva tarjeta', editTitle: 'Editar tarjeta',
        fTitle: 'Título', fDesc: 'Descripción', fPriority: 'Prioridad', fAssignee: 'Responsable',
        save: 'Guardar', cancel: 'Cancelar', del: 'Eliminar', needTitle: 'Ingresa un título',
        cols: { todo: 'Por hacer', doing: 'En curso', review: 'En revisión', done: 'Hecho' }
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Kanban': {
      addTaskDefault: '+ Add task',
      addCard:        'Add card',
      titlePh:        'Card title *',
      descPh:         'Description (optional)',
      tagsPh:         'Type and press Enter…',
      assigneePh:     'Search user…',
      searching:      'Searching…',
      priorityNone:   'No priority', priorityLow: 'Low', priorityMedium: 'Medium', priorityHigh: 'High',
      priorityLabel:  'Priority', assigneeLabel: 'Assignee', noResults: 'No results', tags: 'Tags',
      addColumn:      'Column', columnNamePh: 'Column name', renameHint: 'Double-click to rename', deleteColumn: 'Delete column',
      ui: {
        brand: 'MTS.Kanban', addCard: '+ Card',
        cardTitle: 'Card', modalTitle: 'New card', editTitle: 'Edit card',
        fTitle: 'Title', fDesc: 'Description', fPriority: 'Priority', fAssignee: 'Assignee',
        save: 'Save', cancel: 'Cancel', del: 'Delete', needTitle: 'Enter a title',
        cols: { todo: 'To do', doing: 'In progress', review: 'In review', done: 'Done' }
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Kanban': {
      addTaskDefault: '+ Adicionar tarefa',
      addCard:        'Adicionar cartão',
      titlePh:        'Título do cartão *',
      descPh:         'Descrição (opcional)',
      tagsPh:         'Digite e pressione Enter…',
      assigneePh:     'Buscar usuário…',
      searching:      'Buscando…',
      priorityNone:   'Sem prioridade', priorityLow: 'Baixa', priorityMedium: 'Média', priorityHigh: 'Alta',
      priorityLabel:  'Prioridade', assigneeLabel: 'Responsável', noResults: 'Sem resultados', tags: 'Etiquetas',
      addColumn:      'Coluna', columnNamePh: 'Nome da coluna', renameHint: 'Clique duplo para renomear', deleteColumn: 'Excluir coluna',
      ui: {
        brand: 'MTS.Kanban', addCard: '+ Cartão',
        cardTitle: 'Cartão', modalTitle: 'Novo cartão', editTitle: 'Editar cartão',
        fTitle: 'Título', fDesc: 'Descrição', fPriority: 'Prioridade', fAssignee: 'Responsável',
        save: 'Salvar', cancel: 'Cancelar', del: 'Excluir', needTitle: 'Digite um título',
        cols: { todo: 'A fazer', doing: 'Em curso', review: 'Em revisão', done: 'Concluído' }
      }
    }
  });
})();
