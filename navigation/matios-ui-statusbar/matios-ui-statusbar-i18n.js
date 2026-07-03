/* ============================================================
   MATIOS UI — matios-ui-statusbar-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.StatusBar
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.StatusBar': {
      demo: {
        subtitle:        'Barra de estado inferior con slots libres (start, center, end). Ideal para información secundaria: conexión, versión, entorno, atajos, mensajes de estado. No es navegación — es contexto.',
        s1Title:         '1 — Por defecto',
        s2Title:         '2 — Variante primary',
        s3Title:         '3 — Variante inverse',
        s4Title:         '4 — Slot center',
        s5Title:         '5 — Elementos helper',
        s6Title:         '6 — API dinámica',
        appContent:      'contenido de la app',
        connected:       'Conectado',
        disconnected:    'Sin conexión',
        maintenanceMode: 'Modo mantenimiento',
        online:          'Online',
        lastSync:        'Última sincronización: hace 2 min',
        help:            'Ayuda',
        errorsZero:      '0 errores',
        settings:        'Ajustes',
        btnConnected:    'Estado: Conectado',
        btnDisconnected: 'Estado: Sin conexión',
        btnVersion:      'End: v2.1.0',
        btnDefault:      'Variante: default',
        btnPrimary:      'Variante: primary',
        btnInverse:      'Variante: inverse'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.StatusBar': {
      demo: {
        subtitle:        'Bottom status bar with free slots (start, center, end). Ideal for secondary information: connection, version, environment, shortcuts, status messages. It is not navigation — it is context.',
        s1Title:         '1 — Default',
        s2Title:         '2 — Primary variant',
        s3Title:         '3 — Inverse variant',
        s4Title:         '4 — Center slot',
        s5Title:         '5 — Helper elements',
        s6Title:         '6 — Dynamic API',
        appContent:      'app content',
        connected:       'Connected',
        disconnected:    'Offline',
        maintenanceMode: 'Maintenance mode',
        online:          'Online',
        lastSync:        'Last sync: 2 min ago',
        help:            'Help',
        errorsZero:      '0 errors',
        settings:        'Settings',
        btnConnected:    'State: Connected',
        btnDisconnected: 'State: Offline',
        btnVersion:      'End: v2.1.0',
        btnDefault:      'Variant: default',
        btnPrimary:      'Variant: primary',
        btnInverse:      'Variant: inverse'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.StatusBar': {
      demo: {
        subtitle:        'Barra de status inferior com slots livres (start, center, end). Ideal para informações secundárias: conexão, versão, ambiente, atalhos, mensagens de status. Não é navegação — é contexto.',
        s1Title:         '1 — Padrão',
        s2Title:         '2 — Variante primary',
        s3Title:         '3 — Variante inverse',
        s4Title:         '4 — Slot center',
        s5Title:         '5 — Elementos auxiliares',
        s6Title:         '6 — API dinâmica',
        appContent:      'conteúdo do app',
        connected:       'Conectado',
        disconnected:    'Sem conexão',
        maintenanceMode: 'Modo manutenção',
        online:          'Online',
        lastSync:        'Última sincronização: há 2 min',
        help:            'Ajuda',
        errorsZero:      '0 erros',
        settings:        'Ajustes',
        btnConnected:    'Estado: Conectado',
        btnDisconnected: 'Estado: Sem conexão',
        btnVersion:      'End: v2.1.0',
        btnDefault:      'Variante: default',
        btnPrimary:      'Variante: primary',
        btnInverse:      'Variante: inverse'
      }
    }
  });

})(window);
