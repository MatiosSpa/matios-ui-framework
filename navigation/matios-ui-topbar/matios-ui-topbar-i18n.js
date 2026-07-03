/* ============================================================
   MATIOS UI — matios-ui-topbar-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Topbar
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.Topbar': {
      demo: {
        subtitle:           'Barra superior para dashboards y apps — brand, slots de contenido y composición con SideNav.',
        s1Title:            '1 — Básico',
        s2Title:            '2 — Slots start y end',
        s3Title:            '3 — Divider y acciones agrupadas',
        s4Title:            '4 — Layout completo (Topbar + SideNav)',
        brandAlert:         'Brand clickeado',
        accountLabel:       'Mi cuenta',
        notificationsTitle: 'Notificaciones',
        searchTitle:        'Buscar',
        settingsTitle:      'Configuración',
        profileTitle:       'Perfil',
        newButton:          '+ Nuevo',
        breadcrumb:         'Clientes / Lista',
        mainContent:        'Contenido principal',
        navHome:            'Inicio',
        navAnalytics:       'Analytics',
        navUsers:           'Usuarios',
        navSettings:        'Config'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.Topbar': {
      demo: {
        subtitle:           'Top bar for dashboards and apps — brand, content slots and composition with SideNav.',
        s1Title:            '1 — Basic',
        s2Title:            '2 — Start and end slots',
        s3Title:            '3 — Divider and grouped actions',
        s4Title:            '4 — Full layout (Topbar + SideNav)',
        brandAlert:         'Brand clicked',
        accountLabel:       'My account',
        notificationsTitle: 'Notifications',
        searchTitle:        'Search',
        settingsTitle:      'Settings',
        profileTitle:       'Profile',
        newButton:          '+ New',
        breadcrumb:         'Customers / List',
        mainContent:        'Main content',
        navHome:            'Home',
        navAnalytics:       'Analytics',
        navUsers:           'Users',
        navSettings:        'Settings'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.Topbar': {
      demo: {
        subtitle:           'Barra superior para dashboards e apps — brand, slots de conteúdo e composição com SideNav.',
        s1Title:            '1 — Básico',
        s2Title:            '2 — Slots start e end',
        s3Title:            '3 — Divider e ações agrupadas',
        s4Title:            '4 — Layout completo (Topbar + SideNav)',
        brandAlert:         'Brand clicado',
        accountLabel:       'Minha conta',
        notificationsTitle: 'Notificações',
        searchTitle:        'Buscar',
        settingsTitle:      'Configurações',
        profileTitle:       'Perfil',
        newButton:          '+ Novo',
        breadcrumb:         'Clientes / Lista',
        mainContent:        'Conteúdo principal',
        navHome:            'Início',
        navAnalytics:       'Analytics',
        navUsers:           'Usuários',
        navSettings:        'Config'
      }
    }
  });

})(window);
