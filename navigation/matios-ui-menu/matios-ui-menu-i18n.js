/* ============================================================
   MATIOS UI — matios-ui-menu-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Menu
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Menu': {
      more: 'Más',
      demo: {
        subtitleHtml:   'Menú de navegación con n niveles, íconos y un único <code>onClick</code> — para <strong>MTS.Topbar</strong> (horizontal) y <strong>MTS.SideNav</strong> (árbol).',
        s1Title:        '1 — Horizontal · MTS.Topbar + MTS.Menu',
        s2Title:        '2 — Árbol · MTS.SideNav + MTS.Menu',
        s3Title:        '3 — N niveles · badges · disabled',
        s4Title:        '4 — Una instancia · Topbar horizontal + SideNav árbol sincronizados',
        logHint:        '— click un ítem —',
        logResult:      'key: {key} · label: {label}',
        selectHint:     'Selecciona un ítem',
        keyPrefix:      'key: ',
        lblDashboard:   'Dashboard',
        lblReports:     'Reportes',
        lblSales:       'Ventas',
        lblPurchases:   'Compras',
        lblLogistics:   'Logística',
        lblUsers:       'Usuarios',
        lblConfig:      'Config',
        lblHome:        'Inicio',
        lblOperations:  'Operaciones',
        lblArgentina:   'Argentina',
        lblBuenosAires: 'Buenos Aires',
        lblCordoba:     'Córdoba',
        lblBrazil:      'Brasil',
        lblChile:       'Chile',
        lblAdmin:       'Admin'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Menu': {
      more: 'More',
      demo: {
        subtitleHtml:   'Navigation menu with n levels, icons and a single <code>onClick</code> — for <strong>MTS.Topbar</strong> (horizontal) and <strong>MTS.SideNav</strong> (tree).',
        s1Title:        '1 — Horizontal · MTS.Topbar + MTS.Menu',
        s2Title:        '2 — Tree · MTS.SideNav + MTS.Menu',
        s3Title:        '3 — N levels · badges · disabled',
        s4Title:        '4 — One instance · Horizontal Topbar + Tree SideNav synced',
        logHint:        '— click an item —',
        logResult:      'key: {key} · label: {label}',
        selectHint:     'Select an item',
        keyPrefix:      'key: ',
        lblDashboard:   'Dashboard',
        lblReports:     'Reports',
        lblSales:       'Sales',
        lblPurchases:   'Purchases',
        lblLogistics:   'Logistics',
        lblUsers:       'Users',
        lblConfig:      'Config',
        lblHome:        'Home',
        lblOperations:  'Operations',
        lblArgentina:   'Argentina',
        lblBuenosAires: 'Buenos Aires',
        lblCordoba:     'Córdoba',
        lblBrazil:      'Brazil',
        lblChile:       'Chile',
        lblAdmin:       'Admin'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Menu': {
      more: 'Mais',
      demo: {
        subtitleHtml:   'Menu de navegação com n níveis, ícones e um único <code>onClick</code> — para <strong>MTS.Topbar</strong> (horizontal) e <strong>MTS.SideNav</strong> (árvore).',
        s1Title:        '1 — Horizontal · MTS.Topbar + MTS.Menu',
        s2Title:        '2 — Árvore · MTS.SideNav + MTS.Menu',
        s3Title:        '3 — N níveis · badges · disabled',
        s4Title:        '4 — Uma instância · Topbar horizontal + SideNav árvore sincronizados',
        logHint:        '— clique em um item —',
        logResult:      'key: {key} · label: {label}',
        selectHint:     'Selecione um item',
        keyPrefix:      'key: ',
        lblDashboard:   'Dashboard',
        lblReports:     'Relatórios',
        lblSales:       'Vendas',
        lblPurchases:   'Compras',
        lblLogistics:   'Logística',
        lblUsers:       'Usuários',
        lblConfig:      'Config',
        lblHome:        'Início',
        lblOperations:  'Operações',
        lblArgentina:   'Argentina',
        lblBuenosAires: 'Buenos Aires',
        lblCordoba:     'Córdoba',
        lblBrazil:      'Brasil',
        lblChile:       'Chile',
        lblAdmin:       'Admin'
      }
    }
  });

})(window);
