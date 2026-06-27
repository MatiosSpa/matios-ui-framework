/* ============================================================
   MATIOS UI — matios-ui-transferlist-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.TransferList
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.TransferList': {
      messages: { required: 'Este campo es obligatorio' },
      demo: {
        subtitle:              'Transferencia entre listas con datasource origen/seleccionado, arrastrar y soltar, botones opcionales y validacion unica en destino. Los ejemplos combinan casos genericos y un caso real de negocio.',
        s1Title:               '1 - Basico',
        s2Title:               '2 - Columnas visibles',
        s3Title:               '3 - Participantes de evento',
        s4Title:               '4 - Planes por region',
        s5Title:               '5 - Roles por modulo',
        s6Title:               '6 - Botones individuales + eliminar con x',

        s1Label:               'Categorias destacadas',
        s1OriginTitle:         'Disponibles',
        s1SelectedTitle:       'Activas',

        s2Label:               'Columnas visibles',
        s2Hint:                'Define que columnas apareceran en una tabla personalizada.',
        s2OriginTitle:         'Biblioteca de columnas',
        s2SelectedTitle:       'Columnas activas',

        s3Label:               'Participantes',
        s3Hint:                'Ejemplo sin botones laterales: solo arrastrar y soltar.',
        s3OriginTitle:         'Lista de espera',
        s3SelectedTitle:       'Confirmados',

        s4Label:               'Planes destacados',
        s4Hint:                'Solo se permite un plan por region en la lista derecha.',
        s4OriginTitle:         'Planes candidatos',
        s4SelectedTitle:       'Portafolio activo',
        s4DuplicateMessage:    'Solo puede haber un plan por region.',
        s4AddedTitle:          'Plan agregado',
        s4AddedMessage:        'Se movio <strong>{name}</strong> al portafolio activo.',
        s4BlockedTitle:        'Transferencia bloqueada',
        s4BlockedMessage:      'Ya existe un plan activo para la region <strong>{region}</strong>.',

        s5Label:               'Perfiles del rol',
        s5Hint:                'Arrastra o mueve entre listas. No se permite repetir modulo en seleccionados.',
        s5OriginTitle:         'Perfiles disponibles',
        s5SelectedTitle:       'Perfiles del rol',
        s5DuplicateMessage:    'Solo se permite un perfil por modulo.',
        s5MovedTitle:          'Item transferido',
        s5MovedMessage:        'Se movio <strong>{name}</strong> correctamente.',
        s5BlockedTitle:        'Transferencia bloqueada',
        s5BlockedMessage:      'No se puede mover <strong>{name}</strong> porque ya existe un perfil del mismo modulo en destino.',

        s6Label:               'Perfiles del rol',
        s6Hint:                'Solo el boton para agregar. La x quita el item del destino sin moverlo al origen.',
        s6OriginTitle:         'Disponibles',
        s6SelectedTitle:       'Asignados',
        s6DuplicateMessage:    'Ya hay un perfil de ese modulo en el rol.'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.TransferList': {
      messages: { required: 'This field is required' },
      demo: {
        subtitle:              'Transfer between lists with origin/selected datasource, drag and drop, optional buttons and unique validation on the target. The examples combine generic cases and a real business case.',
        s1Title:               '1 - Basic',
        s2Title:               '2 - Visible columns',
        s3Title:               '3 - Event attendees',
        s4Title:               '4 - Plans by region',
        s5Title:               '5 - Roles by module',
        s6Title:               '6 - Individual buttons + remove with x',

        s1Label:               'Featured categories',
        s1OriginTitle:         'Available',
        s1SelectedTitle:       'Active',

        s2Label:               'Visible columns',
        s2Hint:                'Define which columns will appear in a custom table.',
        s2OriginTitle:         'Column library',
        s2SelectedTitle:       'Active columns',

        s3Label:               'Attendees',
        s3Hint:                'Example without side buttons: drag and drop only.',
        s3OriginTitle:         'Waiting list',
        s3SelectedTitle:       'Confirmed',

        s4Label:               'Featured plans',
        s4Hint:                'Only one plan per region is allowed in the right list.',
        s4OriginTitle:         'Candidate plans',
        s4SelectedTitle:       'Active portfolio',
        s4DuplicateMessage:    'There can only be one plan per region.',
        s4AddedTitle:          'Plan added',
        s4AddedMessage:        '<strong>{name}</strong> was moved to the active portfolio.',
        s4BlockedTitle:        'Transfer blocked',
        s4BlockedMessage:      'An active plan already exists for the <strong>{region}</strong> region.',

        s5Label:               'Role profiles',
        s5Hint:                'Drag or move between lists. Repeating a module in the selected list is not allowed.',
        s5OriginTitle:         'Available profiles',
        s5SelectedTitle:       'Role profiles',
        s5DuplicateMessage:    'Only one profile per module is allowed.',
        s5MovedTitle:          'Item transferred',
        s5MovedMessage:        '<strong>{name}</strong> was moved successfully.',
        s5BlockedTitle:        'Transfer blocked',
        s5BlockedMessage:      'Cannot move <strong>{name}</strong> because a profile from the same module already exists in the target.',

        s6Label:               'Role profiles',
        s6Hint:                'Only the button to add. The x removes the item from the target without moving it back to the origin.',
        s6OriginTitle:         'Available',
        s6SelectedTitle:       'Assigned',
        s6DuplicateMessage:    'There is already a profile from that module in the role.'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.TransferList': {
      messages: { required: 'Este campo é obrigatório' },
      demo: {
        subtitle:              'Transferencia entre listas com datasource origem/selecionado, arrastar e soltar, botoes opcionais e validacao unica no destino. Os exemplos combinam casos genericos e um caso real de negocio.',
        s1Title:               '1 - Basico',
        s2Title:               '2 - Colunas visiveis',
        s3Title:               '3 - Participantes de evento',
        s4Title:               '4 - Planos por regiao',
        s5Title:               '5 - Perfis por modulo',
        s6Title:               '6 - Botoes individuais + remover com x',

        s1Label:               'Categorias em destaque',
        s1OriginTitle:         'Disponiveis',
        s1SelectedTitle:       'Ativas',

        s2Label:               'Colunas visiveis',
        s2Hint:                'Define quais colunas aparecerao em uma tabela personalizada.',
        s2OriginTitle:         'Biblioteca de colunas',
        s2SelectedTitle:       'Colunas ativas',

        s3Label:               'Participantes',
        s3Hint:                'Exemplo sem botoes laterais: apenas arrastar e soltar.',
        s3OriginTitle:         'Lista de espera',
        s3SelectedTitle:       'Confirmados',

        s4Label:               'Planos em destaque',
        s4Hint:                'Apenas um plano por regiao e permitido na lista da direita.',
        s4OriginTitle:         'Planos candidatos',
        s4SelectedTitle:       'Portfolio ativo',
        s4DuplicateMessage:    'So pode haver um plano por regiao.',
        s4AddedTitle:          'Plano adicionado',
        s4AddedMessage:        '<strong>{name}</strong> foi movido para o portfolio ativo.',
        s4BlockedTitle:        'Transferencia bloqueada',
        s4BlockedMessage:      'Ja existe um plano ativo para a regiao <strong>{region}</strong>.',

        s5Label:               'Perfis do papel',
        s5Hint:                'Arraste ou mova entre listas. Nao e permitido repetir modulo nos selecionados.',
        s5OriginTitle:         'Perfis disponiveis',
        s5SelectedTitle:       'Perfis do papel',
        s5DuplicateMessage:    'So e permitido um perfil por modulo.',
        s5MovedTitle:          'Item transferido',
        s5MovedMessage:        '<strong>{name}</strong> foi movido com sucesso.',
        s5BlockedTitle:        'Transferencia bloqueada',
        s5BlockedMessage:      'Nao e possivel mover <strong>{name}</strong> porque ja existe um perfil do mesmo modulo no destino.',

        s6Label:               'Perfis do papel',
        s6Hint:                'Apenas o botao para adicionar. O x remove o item do destino sem move-lo de volta para a origem.',
        s6OriginTitle:         'Disponiveis',
        s6SelectedTitle:       'Atribuidos',
        s6DuplicateMessage:    'Ja existe um perfil desse modulo no papel.'
      }
    }
  });

})(window);
