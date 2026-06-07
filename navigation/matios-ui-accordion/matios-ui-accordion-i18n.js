/* ============================================================
   MATIOS UI — matios-ui-accordion-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Accordion
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Accordion': {
      demo: {
        subtitle:            'Secciones expandibles — uno o varios paneles abiertos, modo flush, íconos, control programático.',
        s1Title:             '1 — Básico — un panel abierto (por defecto)',
        s2Title:             '2 — Múltiple + Flush (sin bordes card)',
        s3Title:             '3 — Con íconos',
        s4Title:             '4 — API — control programático',

        resultBasic:         '— abre o cierra un panel —',
        resultApi:           '— usa los botones —',
        onOpenPrefix:        'onOpen → ',
        onClosePrefix:       'onClose → ',

        q1Title:             '¿Qué es Matios UI?',
        q1Content:           'Una librería de componentes sin dependencias para UIs modernas.',
        q2Title:             '¿Cómo se instala?',
        q2Content:           'Agrega los archivos CSS y JS a tu proyecto.',
        q3Title:             '¿Es gratuito?',
        q3Content:           'Sí, licencia MIT.',
        q4Title:             'Funciones premium',
        q4Content:           'Próximamente.',

        secAOpen:            'Sección A — permanece abierta',
        secAContent:         'Contenido A — pueden estar varios abiertos.',
        secB:                'Sección B',
        secBContent:         'Contenido B.',
        secC:                'Sección C',
        secCContent:         'Contenido C.',

        settingsTitle:       'Configuración',
        settingsContent:     'Configuración de la aplicación.',
        profileTitle:        'Perfil',
        profileContent:      'Perfil del usuario.',
        notifTitle:          'Notificaciones',
        notifContent:        'Preferencias de notificaciones.',

        panel1:              'Panel 1',
        panel1Content:       'Contenido del panel 1.',
        panel2:              'Panel 2',
        panel2Content:       'Contenido del panel 2.',
        panel3:              'Panel 3',
        panel3Content:       'Contenido del panel 3.'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Accordion': {
      demo: {
        subtitle:            'Expandable sections — single or multiple open, flush mode, icons, programmatic control.',
        s1Title:             '1 — Basic — single open (default)',
        s2Title:             '2 — Multiple + Flush (no card borders)',
        s3Title:             '3 — With icons',
        s4Title:             '4 — API — programmatic control',

        resultBasic:         '— open or close a panel —',
        resultApi:           '— use the buttons —',
        onOpenPrefix:        'onOpen → ',
        onClosePrefix:       'onClose → ',

        q1Title:             'What is Matios UI?',
        q1Content:           'A dependency-free component library for modern UIs.',
        q2Title:             'How do I install it?',
        q2Content:           'Add the CSS and JS files to your project.',
        q3Title:             'Is it free?',
        q3Content:           'Yes, MIT license.',
        q4Title:             'Premium features',
        q4Content:           'Coming soon.',

        secAOpen:            'Section A — stays open',
        secAContent:         'Content A — several can be open at once.',
        secB:                'Section B',
        secBContent:         'Content B.',
        secC:                'Section C',
        secCContent:         'Content C.',

        settingsTitle:       'Settings',
        settingsContent:     'Application settings.',
        profileTitle:        'Profile',
        profileContent:      'User profile.',
        notifTitle:          'Notifications',
        notifContent:        'Notification preferences.',

        panel1:              'Panel 1',
        panel1Content:       'Panel 1 content.',
        panel2:              'Panel 2',
        panel2Content:       'Panel 2 content.',
        panel3:              'Panel 3',
        panel3Content:       'Panel 3 content.'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Accordion': {
      demo: {
        subtitle:            'Seções expansíveis — um ou vários painéis abertos, modo flush, ícones, controle programático.',
        s1Title:             '1 — Básico — um painel aberto (padrão)',
        s2Title:             '2 — Múltiplo + Flush (sem bordas card)',
        s3Title:             '3 — Com ícones',
        s4Title:             '4 — API — controle programático',

        resultBasic:         '— abra ou feche um painel —',
        resultApi:           '— use os botões —',
        onOpenPrefix:        'onOpen → ',
        onClosePrefix:       'onClose → ',

        q1Title:             'O que é o Matios UI?',
        q1Content:           'Uma biblioteca de componentes sem dependências para UIs modernas.',
        q2Title:             'Como instalar?',
        q2Content:           'Adicione os arquivos CSS e JS ao seu projeto.',
        q3Title:             'É gratuito?',
        q3Content:           'Sim, licença MIT.',
        q4Title:             'Recursos premium',
        q4Content:           'Em breve.',

        secAOpen:            'Seção A — permanece aberta',
        secAContent:         'Conteúdo A — vários podem ficar abertos.',
        secB:                'Seção B',
        secBContent:         'Conteúdo B.',
        secC:                'Seção C',
        secCContent:         'Conteúdo C.',

        settingsTitle:       'Configurações',
        settingsContent:     'Configurações do aplicativo.',
        profileTitle:        'Perfil',
        profileContent:      'Perfil do usuário.',
        notifTitle:          'Notificações',
        notifContent:        'Preferências de notificações.',

        panel1:              'Painel 1',
        panel1Content:       'Conteúdo do painel 1.',
        panel2:              'Painel 2',
        panel2Content:       'Conteúdo do painel 2.',
        panel3:              'Painel 3',
        panel3Content:       'Conteúdo do painel 3.'
      }
    }
  });

})(window);
