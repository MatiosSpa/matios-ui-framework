/* ============================================================
   MATIOS UI — matios-ui-formguard-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.FormGuard
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.FormGuard': {
      demo: {
        subtitle:            'Dirty-tracking declarativo — snapshot, modal de navegación, beforeunload, indicadores visuales',

        s1Title:             '1 — Form básico con componentes MTS',
        s1Desc:              'Modifica cualquier campo. Aparece el asterisco en el título y el dot en el botón Guardar. Revierte el cambio — el form vuelve a limpio automáticamente.',
        s1CardTitle:         'Perfil de usuario',
        s1LabelNombre:       'Nombre',
        s1PlaceholderNombre: 'Nombre completo',
        s1LabelRol:          'Rol',
        s1OptAdmin:          'Administrador',
        s1OptEditor:         'Editor',
        s1OptViewer:         'Visualizador',
        s1LabelActivo:       'Cuenta activa',
        s1LabelNotif:        'Recibir notificaciones',
        s1BtnBack:           'Volver',
        s1BtnSave:           'Guardar',
        s1MsgSaved:          'Guardado exitoso — snapshot reseteado.',
        s1MsgDirty:          'El formulario tiene cambios sin guardar.',
        s1MsgClean:          'El formulario está limpio.',

        s2Title:             '2 — Dos formularios independientes',
        s2Desc:              'Cada formulario tiene su propio snapshot. El contador global muestra cuántos están sucios.',
        s2CardATitle:        'Formulario A',
        s2CardBTitle:        'Formulario B',
        s2LabelNombre:       'Nombre',
        s2LabelEmail:        'Email',
        s2LabelEmpresa:      'Empresa',
        s2LabelPais:         'País',
        s2OptChile:          'Chile',
        s2OptArgentina:      'Argentina',
        s2OptColombia:       'Colombia',
        s2BtnBack:           'Volver',
        s2BtnSave:           'Guardar',
        s2DirtyLabel:        'Formularios sucios:',

        s3Title:             '3 — Adopción dinámica (SPA / MutationObserver)',
        s3Desc:              'El formulario se inyecta en el DOM después de que FormGuard ya está activo. Es adoptado automáticamente por el MutationObserver.',
        s3BtnInject:         'Inyectar formulario',
        s3BtnRemove:         'Remover formulario',
        s3CardTitle:         'Form dinámico',
        s3LabelCampo:        'Campo dinámico',

        s4Title:             '4 — snapshot-sync programático',
        s4DescBefore:        'Carga datos vía ',
        s4DescMiddle:        ' y dispara ',
        s4DescAfter:         ' para que FormGuard re-tome el snapshot sin marcar dirty.',
        s4CardTitle:         'Datos cargados',
        s4LabelTitulo:       'Título del proyecto',
        s4LabelEstado:       'Estado',
        s4OptDraft:          'Borrador',
        s4OptActive:         'Activo',
        s4OptArchived:       'Archivado',
        s4BtnLoad:           'Cargar datos',
        s4BtnSave:           'Guardar',
        s4MsgLoaded:         'Datos cargados — snapshot sincronizado. El form está limpio.',
        s4MsgSaved:          'Guardado — snapshot reseteado.',
        s4MsgDirty:          'Hay cambios sin guardar.'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.FormGuard': {
      demo: {
        subtitle:            'Declarative dirty-tracking — snapshot, navigation modal, beforeunload, visual indicators',

        s1Title:             '1 — Basic form with MTS components',
        s1Desc:              'Change any field. The asterisk appears in the title and the dot on the Save button. Revert the change — the form returns to clean automatically.',
        s1CardTitle:         'User profile',
        s1LabelNombre:       'Name',
        s1PlaceholderNombre: 'Full name',
        s1LabelRol:          'Role',
        s1OptAdmin:          'Administrator',
        s1OptEditor:         'Editor',
        s1OptViewer:         'Viewer',
        s1LabelActivo:       'Active account',
        s1LabelNotif:        'Receive notifications',
        s1BtnBack:           'Back',
        s1BtnSave:           'Save',
        s1MsgSaved:          'Saved successfully — snapshot reset.',
        s1MsgDirty:          'The form has unsaved changes.',
        s1MsgClean:          'The form is clean.',

        s2Title:             '2 — Two independent forms',
        s2Desc:              'Each form has its own snapshot. The global counter shows how many are dirty.',
        s2CardATitle:        'Form A',
        s2CardBTitle:        'Form B',
        s2LabelNombre:       'Name',
        s2LabelEmail:        'Email',
        s2LabelEmpresa:      'Company',
        s2LabelPais:         'Country',
        s2OptChile:          'Chile',
        s2OptArgentina:      'Argentina',
        s2OptColombia:       'Colombia',
        s2BtnBack:           'Back',
        s2BtnSave:           'Save',
        s2DirtyLabel:        'Dirty forms:',

        s3Title:             '3 — Dynamic adoption (SPA / MutationObserver)',
        s3Desc:              'The form is injected into the DOM after FormGuard is already active. It is adopted automatically by the MutationObserver.',
        s3BtnInject:         'Inject form',
        s3BtnRemove:         'Remove form',
        s3CardTitle:         'Dynamic form',
        s3LabelCampo:        'Dynamic field',

        s4Title:             '4 — Programmatic snapshot-sync',
        s4DescBefore:        'Load data via ',
        s4DescMiddle:        ' and fire ',
        s4DescAfter:         ' so FormGuard re-takes the snapshot without marking it dirty.',
        s4CardTitle:         'Loaded data',
        s4LabelTitulo:       'Project title',
        s4LabelEstado:       'Status',
        s4OptDraft:          'Draft',
        s4OptActive:         'Active',
        s4OptArchived:       'Archived',
        s4BtnLoad:           'Load data',
        s4BtnSave:           'Save',
        s4MsgLoaded:         'Data loaded — snapshot synced. The form is clean.',
        s4MsgSaved:          'Saved — snapshot reset.',
        s4MsgDirty:          'There are unsaved changes.'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.FormGuard': {
      demo: {
        subtitle:            'Dirty-tracking declarativo — snapshot, modal de navegação, beforeunload, indicadores visuais',

        s1Title:             '1 — Formulário básico com componentes MTS',
        s1Desc:              'Altere qualquer campo. O asterisco aparece no título e o ponto no botão Salvar. Reverta a alteração — o formulário volta a ficar limpo automaticamente.',
        s1CardTitle:         'Perfil de usuário',
        s1LabelNombre:       'Nome',
        s1PlaceholderNombre: 'Nome completo',
        s1LabelRol:          'Função',
        s1OptAdmin:          'Administrador',
        s1OptEditor:         'Editor',
        s1OptViewer:         'Visualizador',
        s1LabelActivo:       'Conta ativa',
        s1LabelNotif:        'Receber notificações',
        s1BtnBack:           'Voltar',
        s1BtnSave:           'Salvar',
        s1MsgSaved:          'Salvo com sucesso — snapshot redefinido.',
        s1MsgDirty:          'O formulário tem alterações não salvas.',
        s1MsgClean:          'O formulário está limpo.',

        s2Title:             '2 — Dois formulários independentes',
        s2Desc:              'Cada formulário tem seu próprio snapshot. O contador global mostra quantos estão sujos.',
        s2CardATitle:        'Formulário A',
        s2CardBTitle:        'Formulário B',
        s2LabelNombre:       'Nome',
        s2LabelEmail:        'Email',
        s2LabelEmpresa:      'Empresa',
        s2LabelPais:         'País',
        s2OptChile:          'Chile',
        s2OptArgentina:      'Argentina',
        s2OptColombia:       'Colômbia',
        s2BtnBack:           'Voltar',
        s2BtnSave:           'Salvar',
        s2DirtyLabel:        'Formulários sujos:',

        s3Title:             '3 — Adoção dinâmica (SPA / MutationObserver)',
        s3Desc:              'O formulário é injetado no DOM depois que o FormGuard já está ativo. Ele é adotado automaticamente pelo MutationObserver.',
        s3BtnInject:         'Injetar formulário',
        s3BtnRemove:         'Remover formulário',
        s3CardTitle:         'Formulário dinâmico',
        s3LabelCampo:        'Campo dinâmico',

        s4Title:             '4 — snapshot-sync programático',
        s4DescBefore:        'Carregue dados via ',
        s4DescMiddle:        ' e dispare ',
        s4DescAfter:         ' para que o FormGuard retome o snapshot sem marcar como dirty.',
        s4CardTitle:         'Dados carregados',
        s4LabelTitulo:       'Título do projeto',
        s4LabelEstado:       'Status',
        s4OptDraft:          'Rascunho',
        s4OptActive:         'Ativo',
        s4OptArchived:       'Arquivado',
        s4BtnLoad:           'Carregar dados',
        s4BtnSave:           'Salvar',
        s4MsgLoaded:         'Dados carregados — snapshot sincronizado. O formulário está limpo.',
        s4MsgSaved:          'Salvo — snapshot redefinido.',
        s4MsgDirty:          'Há alterações não salvas.'
      }
    }
  });

})(window);
