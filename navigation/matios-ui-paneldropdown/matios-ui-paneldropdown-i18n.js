/* ============================================================
   MATIOS UI — matios-ui-paneldropdown-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.PanelDropdown
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.PanelDropdown': {
      demo: {
        s1Title:            'Panel de notificaciones',
        s1Subtitle:         'Header con contador de no leídas · ítems con dot de color · timestamp · footer CTA.',
        s2Title:            'Menú de usuario',
        s2Subtitle:         'Sin dot · sin timestamp · ícono por ítem · ítem danger.',
        s3Title:            'Sin header · sin footer',
        s3Subtitle:         'Solo cuerpo con ítems. Útil para menús contextuales simples con contenido enriquecido.',

        notifHeader:        'Notificaciones',
        notif1Title:        'Pedido #1047 entregado',
        notif1Desc:         'Ana Torres recibió su pedido.',
        notif1Time:         'Hace 5 min',
        notif2Title:        'Nuevo usuario registrado',
        notif2Desc:         'Rodrigo Campos se registró.',
        notif2Time:         'Hace 18 min',
        notif3Title:        'Pedido #1044 cancelado',
        notif3Desc:         'Sofía Castro canceló el pedido.',
        notif3Time:         'Hace 42 min',
        notif4Title:        'Pago procesado',
        notif4Desc:         '$4.200 recibidos de Luis Herrera.',
        notif4Time:         'Hace 1 hora',
        notif5Title:        'Reporte mensual generado',
        notif5Desc:         'Reporte de abril listo.',
        notif5Time:         'Hace 2 horas',
        notifFooter:        'Ver todas las notificaciones',

        userProfile:        'Mi perfil',
        userSettings:       'Configuración',
        userHelp:           'Ayuda',
        userLogout:         'Cerrar sesión',

        actionsBtn:         'Acciones',
        actionEdit:         'Editar',
        actionEditDesc:     'Modificar el registro',
        actionDuplicate:    'Duplicar',
        actionDuplicateDesc:'Crear una copia',
        actionExport:       'Exportar',
        actionExportDesc:   'Descargar como CSV',
        actionDelete:       'Eliminar',
        actionDeleteDesc:   'Esta acción no se puede deshacer'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.PanelDropdown': {
      demo: {
        s1Title:            'Notifications panel',
        s1Subtitle:         'Header with unread counter · items with color dot · timestamp · footer CTA.',
        s2Title:            'User menu',
        s2Subtitle:         'No dot · no timestamp · icon per item · danger item.',
        s3Title:            'No header · no footer',
        s3Subtitle:         'Body with items only. Useful for simple context menus with rich content.',

        notifHeader:        'Notifications',
        notif1Title:        'Order #1047 delivered',
        notif1Desc:         'Ana Torres received her order.',
        notif1Time:         '5 min ago',
        notif2Title:        'New user registered',
        notif2Desc:         'Rodrigo Campos signed up.',
        notif2Time:         '18 min ago',
        notif3Title:        'Order #1044 cancelled',
        notif3Desc:         'Sofía Castro cancelled the order.',
        notif3Time:         '42 min ago',
        notif4Title:        'Payment processed',
        notif4Desc:         '$4,200 received from Luis Herrera.',
        notif4Time:         '1 hour ago',
        notif5Title:        'Monthly report generated',
        notif5Desc:         'April report is ready.',
        notif5Time:         '2 hours ago',
        notifFooter:        'View all notifications',

        userProfile:        'My profile',
        userSettings:       'Settings',
        userHelp:           'Help',
        userLogout:         'Log out',

        actionsBtn:         'Actions',
        actionEdit:         'Edit',
        actionEditDesc:     'Modify the record',
        actionDuplicate:    'Duplicate',
        actionDuplicateDesc:'Create a copy',
        actionExport:       'Export',
        actionExportDesc:   'Download as CSV',
        actionDelete:       'Delete',
        actionDeleteDesc:   'This action cannot be undone'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.PanelDropdown': {
      demo: {
        s1Title:            'Painel de notificações',
        s1Subtitle:         'Cabeçalho com contador de não lidas · itens com dot de cor · timestamp · footer CTA.',
        s2Title:            'Menu do usuário',
        s2Subtitle:         'Sem dot · sem timestamp · ícone por item · item danger.',
        s3Title:            'Sem cabeçalho · sem rodapé',
        s3Subtitle:         'Apenas corpo com itens. Útil para menus de contexto simples com conteúdo enriquecido.',

        notifHeader:        'Notificações',
        notif1Title:        'Pedido #1047 entregue',
        notif1Desc:         'Ana Torres recebeu seu pedido.',
        notif1Time:         'Há 5 min',
        notif2Title:        'Novo usuário registrado',
        notif2Desc:         'Rodrigo Campos se registrou.',
        notif2Time:         'Há 18 min',
        notif3Title:        'Pedido #1044 cancelado',
        notif3Desc:         'Sofía Castro cancelou o pedido.',
        notif3Time:         'Há 42 min',
        notif4Title:        'Pagamento processado',
        notif4Desc:         '$4.200 recebidos de Luis Herrera.',
        notif4Time:         'Há 1 hora',
        notif5Title:        'Relatório mensal gerado',
        notif5Desc:         'Relatório de abril pronto.',
        notif5Time:         'Há 2 horas',
        notifFooter:        'Ver todas as notificações',

        userProfile:        'Meu perfil',
        userSettings:       'Configurações',
        userHelp:           'Ajuda',
        userLogout:         'Sair',

        actionsBtn:         'Ações',
        actionEdit:         'Editar',
        actionEditDesc:     'Modificar o registro',
        actionDuplicate:    'Duplicar',
        actionDuplicateDesc:'Criar uma cópia',
        actionExport:       'Exportar',
        actionExportDesc:   'Baixar como CSV',
        actionDelete:       'Excluir',
        actionDeleteDesc:   'Esta ação não pode ser desfeita'
      }
    }
  });

})(window);
