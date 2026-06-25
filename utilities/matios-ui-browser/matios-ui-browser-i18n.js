/* ============================================================
   MATIOS UI — matios-ui-browser-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Browser
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Browser': {
      demo: {
        subtitle:               'Utilidad universal de APIs del navegador. Prueba cada módulo en esta misma página.',

        guardTitle:             '🛡️ Guard — Protección de página',
        guardNote:              'Genera fricción, no seguridad real. devtools se engancha en captura (F12 sí se intenta frenar), pero un usuario determinado igual lo saltea (menú, etc.). Para lockdown real → kiosk/Electron.',
        guardContextMenu:       'Bloquear clic derecho (contextMenu)',
        guardTextSelect:        'Bloquear selección de texto (textSelect)',
        guardDragImages:        'Bloquear arrastrar imágenes (dragImages)',
        guardCopy:              'Bloquear Ctrl+C (copy)',
        guardPrint:             'Bloquear Ctrl+P (print)',
        guardSave:              'Bloquear Ctrl+S (save)',
        guardDevtools:          'Intentar bloquear DevTools (F12 · Ctrl+Shift+I/J/C · Ctrl+U)',

        locationTitle:          '📍 Location — Geolocalización',
        locationGet:            'Obtener posición',
        locationRequesting:     'Solicitando...',

        notifTitle:             '🔔 Notifications — Notificaciones',
        notifRequest:           'Pedir permiso',
        notifSend:              'Enviar notificación',
        notifCurrentPermission: 'Permiso actual: ',
        notifPermission:        'Permiso: ',
        notifBody:              '¡Notificación de prueba desde la demo!',
        notifSent:              'Notificación enviada',

        clipTitle:              '📋 Clipboard — Portapapeles',
        clipCopy:               'Copiar texto',
        clipRead:               'Leer portapapeles',
        clipText:               'Texto copiado desde MTS.Browser demo 📋',
        clipCopied:             '✓ Texto copiado al portapapeles',

        fsTitle:                '🖥️ Fullscreen — Pantalla completa',
        fsToggle:               'Alternar pantalla completa',
        fsActive:               'Activo: ',

        wlTitle:                '💡 Wake Lock — Mantener pantalla activa',
        wlNote:                 'Evita que la pantalla se apague. Útil en formularios largos o dashboards de monitoreo.',
        wlEnable:               'Activar',
        wlDisable:              'Desactivar',
        wlActive:               'Activo: ',
        wlEnabled:              'Wake Lock activo — la pantalla no se apagará',
        wlReleased:             'Wake Lock liberado',

        netTitle:               '🌐 Network — Estado de la red',
        netRefresh:             'Actualizar',
        netOnline:              'Online: ',

        batTitle:               '🔋 Battery — Estado de la batería',
        batRead:                'Leer batería',

        vibTitle:               '📳 Vibration — Vibración',
        vibNote:                'Solo disponible en dispositivos móviles.',
        vibVibrate:             'Vibrar 200ms',
        vibPattern:             'Patrón',
        vibStop:                'Detener',
        vibSent:                'Vibración enviada',
        vibPatternSent:         'Patrón [200, 100, 200, 100, 400] enviado',
        vibStopped:             'Vibración detenida',

        shareTitle:             '📤 Share — Compartir nativo',
        shareButton:            'Compartir esta página',
        shareSupported:         'Web Share API disponible',
        shareUnsupported:       'No disponible en este navegador/dispositivo',
        shareText:              'Utilidad universal de APIs del navegador',
        shareShared:            'Compartido',
        shareCanceled:          'Cancelado por el usuario',

        visTitle:               '👁️ Visibility — Visibilidad de pestaña',
        visNote:                'Cambia de pestaña y vuelve para ver el evento.',
        visCurrent:             'Estado actual',
        visVisiblePrefix:       'visible: ',
        visChangesPrefix:       ' | cambios: ',

        mediaTitle:             '📷 Media — Cámara · Micrófono · Pantalla',
        mediaCamera:            'Cámara',
        mediaMicrophone:        'Micrófono',
        mediaScreen:            'Pantalla',
        mediaStop:              'Detener',
        mediaListDevices:       'Listar dispositivos',
        mediaCameraActive:      'Cámara activa — tracks: ',
        mediaMicrophoneActive:  'Micrófono activo — tracks: ',
        mediaScreenActive:      'Screen capture activo — tracks: ',
        mediaStopped:           'Stream detenido',

        orientTitle:            '🧭 Orientation — Orientación del dispositivo',
        orientNote:             'Solo disponible en dispositivos móviles.',
        orientWatch:            'Observar orientación',

        storageTitle:          '💾 Storage — localStorage / sessionStorage',
        storageWriteLocal:      'Escribir local',
        storageReadLocal:       'Leer local',
        storageClearLocal:      'Limpiar local',
        storageQuota:           'Ver cuota',
        storageQuotaUnavailable:'Storage Estimate API no disponible'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Browser': {
      demo: {
        subtitle:               'Universal browser API utility. Try each module right on this page.',

        guardTitle:             '🛡️ Guard — Page protection',
        guardNote:              'Friction, not real security. devtools hooks the capture phase (F12 is suppressed in modern browsers), but a determined user still gets around it (menu, etc.). For real lockdown → kiosk/Electron.',
        guardContextMenu:       'Block right-click (contextMenu)',
        guardTextSelect:        'Block text selection (textSelect)',
        guardDragImages:        'Block image dragging (dragImages)',
        guardCopy:              'Block Ctrl+C (copy)',
        guardPrint:             'Block Ctrl+P (print)',
        guardSave:              'Block Ctrl+S (save)',
        guardDevtools:          'Try to block DevTools (F12 · Ctrl+Shift+I/J/C · Ctrl+U)',

        locationTitle:          '📍 Location — Geolocation',
        locationGet:            'Get position',
        locationRequesting:     'Requesting...',

        notifTitle:             '🔔 Notifications',
        notifRequest:           'Request permission',
        notifSend:              'Send notification',
        notifCurrentPermission: 'Current permission: ',
        notifPermission:        'Permission: ',
        notifBody:              'Test notification from the demo!',
        notifSent:              'Notification sent',

        clipTitle:              '📋 Clipboard',
        clipCopy:               'Copy text',
        clipRead:               'Read clipboard',
        clipText:               'Text copied from the MTS.Browser demo 📋',
        clipCopied:             '✓ Text copied to clipboard',

        fsTitle:                '🖥️ Fullscreen',
        fsToggle:               'Toggle fullscreen',
        fsActive:               'Active: ',

        wlTitle:                '💡 Wake Lock — Keep screen awake',
        wlNote:                 'Prevents the screen from turning off. Useful for long forms or monitoring dashboards.',
        wlEnable:               'Enable',
        wlDisable:              'Disable',
        wlActive:               'Active: ',
        wlEnabled:              'Wake Lock active — the screen will not turn off',
        wlReleased:             'Wake Lock released',

        netTitle:               '🌐 Network — Network status',
        netRefresh:             'Refresh',
        netOnline:              'Online: ',

        batTitle:               '🔋 Battery — Battery status',
        batRead:                'Read battery',

        vibTitle:               '📳 Vibration',
        vibNote:                'Only available on mobile devices.',
        vibVibrate:             'Vibrate 200ms',
        vibPattern:             'Pattern',
        vibStop:                'Stop',
        vibSent:                'Vibration sent',
        vibPatternSent:         'Pattern [200, 100, 200, 100, 400] sent',
        vibStopped:             'Vibration stopped',

        shareTitle:             '📤 Share — Native share',
        shareButton:            'Share this page',
        shareSupported:         'Web Share API available',
        shareUnsupported:       'Not available on this browser/device',
        shareText:              'Universal browser API utility',
        shareShared:            'Shared',
        shareCanceled:          'Canceled by the user',

        visTitle:               '👁️ Visibility — Tab visibility',
        visNote:                'Switch tabs and come back to see the event.',
        visCurrent:             'Current state',
        visVisiblePrefix:       'visible: ',
        visChangesPrefix:       ' | changes: ',

        mediaTitle:             '📷 Media — Camera · Microphone · Screen',
        mediaCamera:            'Camera',
        mediaMicrophone:        'Microphone',
        mediaScreen:            'Screen',
        mediaStop:              'Stop',
        mediaListDevices:       'List devices',
        mediaCameraActive:      'Camera active — tracks: ',
        mediaMicrophoneActive:  'Microphone active — tracks: ',
        mediaScreenActive:      'Screen capture active — tracks: ',
        mediaStopped:           'Stream stopped',

        orientTitle:            '🧭 Orientation — Device orientation',
        orientNote:             'Only available on mobile devices.',
        orientWatch:            'Watch orientation',

        storageTitle:          '💾 Storage — localStorage / sessionStorage',
        storageWriteLocal:      'Write local',
        storageReadLocal:       'Read local',
        storageClearLocal:      'Clear local',
        storageQuota:           'View quota',
        storageQuotaUnavailable:'Storage Estimate API not available'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Browser': {
      demo: {
        subtitle:               'Utilitário universal de APIs do navegador. Teste cada módulo nesta mesma página.',

        guardTitle:             '🛡️ Guard — Proteção de página',
        guardNote:              'Fricção, não segurança real. devtools engancha na fase de captura (F12 é suprimido nos navegadores modernos), mas um usuário determinado ainda contorna (menu, etc.). Para lockdown real → kiosk/Electron.',
        guardContextMenu:       'Bloquear clique direito (contextMenu)',
        guardTextSelect:        'Bloquear seleção de texto (textSelect)',
        guardDragImages:        'Bloquear arrastar imagens (dragImages)',
        guardCopy:              'Bloquear Ctrl+C (copy)',
        guardPrint:             'Bloquear Ctrl+P (print)',
        guardSave:              'Bloquear Ctrl+S (save)',
        guardDevtools:          'Tentar bloquear DevTools (F12 · Ctrl+Shift+I/J/C · Ctrl+U)',

        locationTitle:          '📍 Location — Geolocalização',
        locationGet:            'Obter posição',
        locationRequesting:     'Solicitando...',

        notifTitle:             '🔔 Notifications — Notificações',
        notifRequest:           'Pedir permissão',
        notifSend:              'Enviar notificação',
        notifCurrentPermission: 'Permissão atual: ',
        notifPermission:        'Permissão: ',
        notifBody:              'Notificação de teste da demo!',
        notifSent:              'Notificação enviada',

        clipTitle:              '📋 Clipboard — Área de transferência',
        clipCopy:               'Copiar texto',
        clipRead:               'Ler área de transferência',
        clipText:               'Texto copiado da demo MTS.Browser 📋',
        clipCopied:             '✓ Texto copiado para a área de transferência',

        fsTitle:                '🖥️ Fullscreen — Tela cheia',
        fsToggle:               'Alternar tela cheia',
        fsActive:               'Ativo: ',

        wlTitle:                '💡 Wake Lock — Manter tela ativa',
        wlNote:                 'Evita que a tela se apague. Útil em formulários longos ou dashboards de monitoramento.',
        wlEnable:               'Ativar',
        wlDisable:              'Desativar',
        wlActive:               'Ativo: ',
        wlEnabled:              'Wake Lock ativo — a tela não se apagará',
        wlReleased:             'Wake Lock liberado',

        netTitle:               '🌐 Network — Estado da rede',
        netRefresh:             'Atualizar',
        netOnline:              'Online: ',

        batTitle:               '🔋 Battery — Estado da bateria',
        batRead:                'Ler bateria',

        vibTitle:               '📳 Vibration — Vibração',
        vibNote:                'Disponível apenas em dispositivos móveis.',
        vibVibrate:             'Vibrar 200ms',
        vibPattern:             'Padrão',
        vibStop:                'Parar',
        vibSent:                'Vibração enviada',
        vibPatternSent:         'Padrão [200, 100, 200, 100, 400] enviado',
        vibStopped:             'Vibração parada',

        shareTitle:             '📤 Share — Compartilhamento nativo',
        shareButton:            'Compartilhar esta página',
        shareSupported:         'Web Share API disponível',
        shareUnsupported:       'Não disponível neste navegador/dispositivo',
        shareText:              'Utilitário universal de APIs do navegador',
        shareShared:            'Compartilhado',
        shareCanceled:          'Cancelado pelo usuário',

        visTitle:               '👁️ Visibility — Visibilidade da aba',
        visNote:                'Troque de aba e volte para ver o evento.',
        visCurrent:             'Estado atual',
        visVisiblePrefix:       'visible: ',
        visChangesPrefix:       ' | mudanças: ',

        mediaTitle:             '📷 Media — Câmera · Microfone · Tela',
        mediaCamera:            'Câmera',
        mediaMicrophone:        'Microfone',
        mediaScreen:            'Tela',
        mediaStop:              'Parar',
        mediaListDevices:       'Listar dispositivos',
        mediaCameraActive:      'Câmera ativa — tracks: ',
        mediaMicrophoneActive:  'Microfone ativo — tracks: ',
        mediaScreenActive:      'Captura de tela ativa — tracks: ',
        mediaStopped:           'Stream parado',

        orientTitle:            '🧭 Orientation — Orientação do dispositivo',
        orientNote:             'Disponível apenas em dispositivos móveis.',
        orientWatch:            'Observar orientação',

        storageTitle:          '💾 Storage — localStorage / sessionStorage',
        storageWriteLocal:      'Escrever local',
        storageReadLocal:       'Ler local',
        storageClearLocal:      'Limpar local',
        storageQuota:           'Ver cota',
        storageQuotaUnavailable:'Storage Estimate API não disponível'
      }
    }
  });

})(window);
