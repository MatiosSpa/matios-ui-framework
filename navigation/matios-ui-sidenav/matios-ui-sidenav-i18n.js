/* ============================================================
   MATIOS UI — matios-ui-sidenav-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.SideNav
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.SideNav': {
      collapse:             'Colapsar',
      expand:               'Expandir',
      demo: {
        subtitle:           'Navegación lateral colapsable. Requiere una instancia de MTS.Menu en modo tree.',
        s1Title:            '1 — Con MTS.Menu',
        s2Title:            '2 — Colapsable',
        resultBasic:        '— selecciona un item —',
        resultApi:          '— usa la API —',
        groupMain:          'Principal',
        groupSettings:      'Ajustes',
        itemAllProducts:    'Todos los productos',
        itemAddProduct:     'Agregar producto',
        itemHome:           'Inicio',
        itemMessages:       'Mensajes',
        activePrefix:       'activo → ',
        collapsedPrefix:    'colapsado: '
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.SideNav': {
      collapse:             'Collapse',
      expand:               'Expand',
      demo: {
        subtitle:           'Collapsible side navigation. Requires an MTS.Menu instance in tree mode.',
        s1Title:            '1 — With MTS.Menu',
        s2Title:            '2 — Collapsible',
        resultBasic:        '— select an item —',
        resultApi:          '— use the API —',
        groupMain:          'Main',
        groupSettings:      'Settings',
        itemAllProducts:    'All products',
        itemAddProduct:     'Add product',
        itemHome:           'Home',
        itemMessages:       'Messages',
        activePrefix:       'active → ',
        collapsedPrefix:    'collapsed: '
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.SideNav': {
      collapse:             'Recolher',
      expand:               'Expandir',
      demo: {
        subtitle:           'Navegação lateral recolhível. Requer uma instância de MTS.Menu no modo tree.',
        s1Title:            '1 — Com MTS.Menu',
        s2Title:            '2 — Recolhível',
        resultBasic:        '— selecione um item —',
        resultApi:          '— use a API —',
        groupMain:          'Principal',
        groupSettings:      'Configurações',
        itemAllProducts:    'Todos os produtos',
        itemAddProduct:     'Adicionar produto',
        itemHome:           'Início',
        itemMessages:       'Mensagens',
        activePrefix:       'ativo → ',
        collapsedPrefix:    'recolhido: '
      }
    }
  });

})(window);
