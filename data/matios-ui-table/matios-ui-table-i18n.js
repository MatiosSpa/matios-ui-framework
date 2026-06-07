/* ============================================================
   MATIOS UI — matios-ui-table-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Table
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Table': {
      demo: {
        subtitle:            'Componente de tabla CSS-only — sin JavaScript requerido. Variantes, estados de fila, cabeceras ordenables, columnas de acciones.',
        s1Title:             '1 — Base',
        s2Title:             '2 — Variantes',
        s3Title:             '3 — Combinadas (toggle interactivo)',
        s4Title:             '4 — Estados de fila',
        s5Title:             '5 — Cabeceras ordenables',
        s6Title:             '6 — Checkbox y selección múltiple',
        s7Title:             '7 — Columna de acciones',
        s8Title:             '8 — Estado vacío',
        s9Title:             '9 — Footer y totales',
        s10Title:            '10 — Header fijo (scroll vertical)',
        s11Title:            '11 — Texto truncado',
        s12Title:            '12 — Responsive',
        s13Title:            '13 — Loading skeleton',

        colName:             'Nombre',
        colEmail:            'Email',
        colRole:             'Rol',
        colStatus:           'Estado',
        colDate:             'Fecha',
        colProduct:          'Producto',
        colCategory:         'Categoría',
        colPrice:            'Precio',
        colSku:              'SKU',
        colStock:            'Stock',
        colUser:             'Usuario',
        colAppliedClass:     'Clase aplicada',
        colActions:          'Acciones',
        colDescription:      'Descripción',

        badgeActive:         'Activo',
        badgePending:        'Pendiente',
        badgeSuspended:      'Suspendido',
        badgeInactive:       'Inactivo',

        stateSelected:       'Seleccionado',
        stateSuccess:        'Éxito',
        stateWarning:        'Advertencia',
        stateDanger:         'Error',
        stateInfo:           'Info',

        emptyTitle:          'No se encontraron registros',
        emptyMsg:            'Intenta con otros filtros o agrega un nuevo elemento.',

        totalLabel:          'Total',

        responsiveHint:      'Reduce el ancho de la ventana para ver el colapso de columnas en móvil.',

        chkPlaceholder:      '— selecciona filas —',
        chkRowSingular:      'fila seleccionada',
        chkRowPlural:        'filas seleccionadas',

        reloadButton:        '↺ Simular carga'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Table': {
      demo: {
        subtitle:            'CSS-only table component — no JavaScript required. Variants, row states, sortable headers, action columns.',
        s1Title:             '1 — Base',
        s2Title:             '2 — Variants',
        s3Title:             '3 — Combined (interactive toggle)',
        s4Title:             '4 — Row states',
        s5Title:             '5 — Sortable headers',
        s6Title:             '6 — Checkbox and multiple selection',
        s7Title:             '7 — Actions column',
        s8Title:             '8 — Empty state',
        s9Title:             '9 — Footer and totals',
        s10Title:            '10 — Fixed header (vertical scroll)',
        s11Title:            '11 — Truncated text',
        s12Title:            '12 — Responsive',
        s13Title:            '13 — Loading skeleton',

        colName:             'Name',
        colEmail:            'Email',
        colRole:             'Role',
        colStatus:           'Status',
        colDate:             'Date',
        colProduct:          'Product',
        colCategory:         'Category',
        colPrice:            'Price',
        colSku:              'SKU',
        colStock:            'Stock',
        colUser:             'User',
        colAppliedClass:     'Applied class',
        colActions:          'Actions',
        colDescription:      'Description',

        badgeActive:         'Active',
        badgePending:        'Pending',
        badgeSuspended:      'Suspended',
        badgeInactive:       'Inactive',

        stateSelected:       'Selected',
        stateSuccess:        'Success',
        stateWarning:        'Warning',
        stateDanger:         'Error',
        stateInfo:           'Info',

        emptyTitle:          'No records found',
        emptyMsg:            'Try other filters or add a new item.',

        totalLabel:          'Total',

        responsiveHint:      'Reduce the window width to see the columns collapse on mobile.',

        chkPlaceholder:      '— select rows —',
        chkRowSingular:      'row selected',
        chkRowPlural:        'rows selected',

        reloadButton:        '↺ Simulate loading'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Table': {
      demo: {
        subtitle:            'Componente de tabela CSS-only — sem JavaScript necessário. Variantes, estados de linha, cabeçalhos ordenáveis, colunas de ações.',
        s1Title:             '1 — Base',
        s2Title:             '2 — Variantes',
        s3Title:             '3 — Combinadas (toggle interativo)',
        s4Title:             '4 — Estados de linha',
        s5Title:             '5 — Cabeçalhos ordenáveis',
        s6Title:             '6 — Checkbox e seleção múltipla',
        s7Title:             '7 — Coluna de ações',
        s8Title:             '8 — Estado vazio',
        s9Title:             '9 — Rodapé e totais',
        s10Title:            '10 — Cabeçalho fixo (scroll vertical)',
        s11Title:            '11 — Texto truncado',
        s12Title:            '12 — Responsivo',
        s13Title:            '13 — Loading skeleton',

        colName:             'Nome',
        colEmail:            'Email',
        colRole:             'Função',
        colStatus:           'Status',
        colDate:             'Data',
        colProduct:          'Produto',
        colCategory:         'Categoria',
        colPrice:            'Preço',
        colSku:              'SKU',
        colStock:            'Estoque',
        colUser:             'Usuário',
        colAppliedClass:     'Classe aplicada',
        colActions:          'Ações',
        colDescription:      'Descrição',

        badgeActive:         'Ativo',
        badgePending:        'Pendente',
        badgeSuspended:      'Suspenso',
        badgeInactive:       'Inativo',

        stateSelected:       'Selecionado',
        stateSuccess:        'Sucesso',
        stateWarning:        'Aviso',
        stateDanger:         'Erro',
        stateInfo:           'Info',

        emptyTitle:          'Nenhum registro encontrado',
        emptyMsg:            'Tente outros filtros ou adicione um novo item.',

        totalLabel:          'Total',

        responsiveHint:      'Reduza a largura da janela para ver as colunas recolherem no celular.',

        chkPlaceholder:      '— selecione linhas —',
        chkRowSingular:      'linha selecionada',
        chkRowPlural:        'linhas selecionadas',

        reloadButton:        '↺ Simular carregamento'
      }
    }
  });

})(window);
