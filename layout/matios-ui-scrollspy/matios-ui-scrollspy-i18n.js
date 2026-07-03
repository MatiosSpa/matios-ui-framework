/* ============================================================
   MATIOS UI — matios-ui-scrollspy-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.ScrollSpy
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.ScrollSpy': {
      demo: {
        subtitle:        'Resalta el link activo al hacer scroll por las secciones.',
        s1Title:         '1 — Demo interactivo — scroll dentro del panel',
        navIntro:        'Introducción',
        navInstall:      'Instalación',
        navUsage:        'Uso básico',
        navApi:          'API',
        navEvents:       'Eventos',
        introP1:         'MTS.ScrollSpy resalta el enlace activo según la sección visible dentro del contenedor de scroll.',
        introP2:         'Este ejemplo usa un panel interno con scroll para validar que la navegación cambie correctamente al recorrer cada bloque.',
        introP3:         'La idea es mantener el panel izquierdo sincronizado con el contenido derecho sin depender del scroll global de la ventana.',
        installP1:       'Incluye el archivo CSS para el nav y el JS del componente en la página donde lo necesites.',
        installP2:       'El nav puede usar enlaces con <code>href="#id"</code> y el componente se encarga de aplicar la clase activa.',
        installP3:       'También puedes ajustar el offset si tienes headers fijos o separaciones visuales adicionales.',
        usageP1:         'Define tus secciones con IDs únicos y pásalas en la opción <code>sections</code>.',
        usageP2:         'Luego indica el selector del nav y, si el scroll ocurre dentro de un panel, usa <code>scrollContainer</code>.',
        usageP3:         'Con eso el componente cambia el estado activo automáticamente mientras se desplaza el contenido.',
        apiP1:           'La instancia mantiene sincronizado el nav y expone <code>destroy()</code> para limpiar listeners cuando el componente ya no se usa.',
        apiP2:           'También puedes reaccionar a cada cambio con <code>onChange</code> y obtener el <code>id</code>, la sección y el link activo.',
        apiP3:           'Esto sirve para analytics, headers contextuales o navegación secundaria.',
        eventsP1:        'En cada cambio puedes actualizar textos de estado, métricas o cualquier otro indicador visual.',
        eventsP2:        'En esta demo, el panel inferior muestra el nombre de la sección activa mientras haces scroll.',
        eventsP3:        'Si llegas hasta aquí, ScrollSpy debería marcar correctamente la última sección del panel.',
        resultPlaceholder: '— haz scroll en el panel de arriba —',
        activePrefix:    'sección activa: ',
        loading:         'Cargando...',
        loadError:       'Error al cargar.'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.ScrollSpy': {
      demo: {
        subtitle:        'Highlights the active link as you scroll through the sections.',
        s1Title:         '1 — Interactive demo — scroll inside the panel',
        navIntro:        'Introduction',
        navInstall:      'Installation',
        navUsage:        'Basic usage',
        navApi:          'API',
        navEvents:       'Events',
        introP1:         'MTS.ScrollSpy highlights the active link based on the section visible inside the scroll container.',
        introP2:         'This example uses an inner scrollable panel to verify that navigation updates correctly as you move through each block.',
        introP3:         'The goal is to keep the left panel in sync with the right-hand content without relying on the global window scroll.',
        installP1:       'Include the CSS file for the nav and the component JS on the page where you need it.',
        installP2:       'The nav can use links with <code>href="#id"</code> and the component takes care of applying the active class.',
        installP3:       'You can also adjust the offset if you have fixed headers or additional visual spacing.',
        usageP1:         'Define your sections with unique IDs and pass them in the <code>sections</code> option.',
        usageP2:         'Then set the nav selector and, if scrolling happens inside a panel, use <code>scrollContainer</code>.',
        usageP3:         'With that, the component switches the active state automatically as the content scrolls.',
        apiP1:           'The instance keeps the nav in sync and exposes <code>destroy()</code> to clean up listeners when the component is no longer used.',
        apiP2:           'You can also react to each change with <code>onChange</code> and get the <code>id</code>, the section and the active link.',
        apiP3:           'This is useful for analytics, contextual headers or secondary navigation.',
        eventsP1:        'On each change you can update status text, metrics or any other visual indicator.',
        eventsP2:        'In this demo, the bottom panel shows the name of the active section as you scroll.',
        eventsP3:        'If you made it this far, ScrollSpy should correctly mark the last section of the panel.',
        resultPlaceholder: '— scroll in the panel above —',
        activePrefix:    'active section: ',
        loading:         'Loading...',
        loadError:       'Failed to load.'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.ScrollSpy': {
      demo: {
        subtitle:        'Destaca o link ativo ao rolar pelas seções.',
        s1Title:         '1 — Demo interativa — rolagem dentro do painel',
        navIntro:        'Introdução',
        navInstall:      'Instalação',
        navUsage:        'Uso básico',
        navApi:          'API',
        navEvents:       'Eventos',
        introP1:         'MTS.ScrollSpy destaca o link ativo conforme a seção visível dentro do contêiner de rolagem.',
        introP2:         'Este exemplo usa um painel interno com rolagem para validar que a navegação muda corretamente ao percorrer cada bloco.',
        introP3:         'A ideia é manter o painel esquerdo sincronizado com o conteúdo direito sem depender da rolagem global da janela.',
        installP1:       'Inclua o arquivo CSS para o nav e o JS do componente na página onde precisar.',
        installP2:       'O nav pode usar links com <code>href="#id"</code> e o componente cuida de aplicar a classe ativa.',
        installP3:       'Você também pode ajustar o offset se tiver cabeçalhos fixos ou espaçamentos visuais adicionais.',
        usageP1:         'Defina suas seções com IDs únicos e passe-as na opção <code>sections</code>.',
        usageP2:         'Depois indique o seletor do nav e, se a rolagem ocorrer dentro de um painel, use <code>scrollContainer</code>.',
        usageP3:         'Com isso o componente muda o estado ativo automaticamente enquanto o conteúdo é rolado.',
        apiP1:           'A instância mantém o nav sincronizado e expõe <code>destroy()</code> para limpar listeners quando o componente não for mais usado.',
        apiP2:           'Você também pode reagir a cada mudança com <code>onChange</code> e obter o <code>id</code>, a seção e o link ativo.',
        apiP3:           'Isso serve para analytics, cabeçalhos contextuais ou navegação secundária.',
        eventsP1:        'A cada mudança você pode atualizar textos de status, métricas ou qualquer outro indicador visual.',
        eventsP2:        'Nesta demo, o painel inferior mostra o nome da seção ativa enquanto você rola.',
        eventsP3:        'Se você chegou até aqui, o ScrollSpy deve marcar corretamente a última seção do painel.',
        resultPlaceholder: '— role no painel acima —',
        activePrefix:    'seção ativa: ',
        loading:         'Carregando...',
        loadError:       'Erro ao carregar.'
      }
    }
  });

})(window);
