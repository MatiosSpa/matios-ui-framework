/* ============================================================
   MATIOS UI — matios-ui-httpclient-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.HttpClient
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.HttpClient': {
      demo: {
        subtitle:            'Cliente HTTP con contrato consistente, timeout, retry, interceptores, upload y download usando el patrón estándar de demo.',
        s1Title:             '1 — Petición GET',
        s2Title:             '2 — Petición POST',
        s3Title:             '3 — Manejo de errores',
        s4Title:             '4 — Retry automático',
        s5Title:             '5 — Interceptores',
        s6Title:             '6 — Instancia global',
        s7Title:             '7 — Upload con progreso',
        s8Title:             '8 — Download',
        s9Title:             '9 — Callbacks por request',
        pressButton:         '— presiona el botón —',
        pressAButton:        '— presiona un botón —',
        selectFileHint:      '— selecciona un archivo y presiona Subir —',
        conceptRetry:        'Ejemplo conceptual. Revisa el código JavaScript para la configuración de retry automático y backoff.',
        conceptInterceptors: 'Ejemplo conceptual. Los interceptores permiten agregar headers, auth y manejo global de respuestas sin repetir lógica.',
        conceptGlobal:       'Ejemplo conceptual. Puedes crear una instancia global una vez y reutilizarla en toda la aplicación.',
        conceptCallbacks:    'Ejemplo conceptual. Cada request puede definir callbacks específicos además de los callbacks globales.',
        btnGet:              'Ejecutar GET',
        btnPost:             'Ejecutar POST',
        btnError:            'Forzar 404',
        btnTimeout:          'Forzar timeout',
        btnUpload:           'Subir archivo',
        btnDownload:         'Descargar archivo',
        loading:             'Cargando...',
        sending:             'Enviando...',
        running:            'Ejecutando...',
        waitingTimeout:      'Esperando timeout (1s)...',
        uploadHint:          'PNG, JPG o PDF hasta 10MB',
        selectFileFirst:     'Selecciona un archivo primero',
        uploading:           'Subiendo... ',
        uploadProgress:      'Subiendo... 0%',
        uploadSuccess:       'Archivo subido correctamente',
        downloading:         'Descargando...',
        downloadStarted:     '✓ Descarga iniciada — '
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.HttpClient': {
      demo: {
        subtitle:            'HTTP client with a consistent contract, timeout, retry, interceptors, upload and download using the standard demo pattern.',
        s1Title:             '1 — GET request',
        s2Title:             '2 — POST request',
        s3Title:             '3 — Error handling',
        s4Title:             '4 — Automatic retry',
        s5Title:             '5 — Interceptors',
        s6Title:             '6 — Global instance',
        s7Title:             '7 — Upload with progress',
        s8Title:             '8 — Download',
        s9Title:             '9 — Per-request callbacks',
        pressButton:         '— press the button —',
        pressAButton:        '— press a button —',
        selectFileHint:      '— select a file and press Upload —',
        conceptRetry:        'Conceptual example. Check the JavaScript code for the automatic retry and backoff configuration.',
        conceptInterceptors: 'Conceptual example. Interceptors let you add headers, auth and global response handling without repeating logic.',
        conceptGlobal:       'Conceptual example. You can create a global instance once and reuse it across the whole application.',
        conceptCallbacks:    'Conceptual example. Each request can define specific callbacks in addition to the global callbacks.',
        btnGet:              'Run GET',
        btnPost:             'Run POST',
        btnError:            'Force 404',
        btnTimeout:          'Force timeout',
        btnUpload:           'Upload file',
        btnDownload:         'Download file',
        loading:             'Loading...',
        sending:             'Sending...',
        running:             'Running...',
        waitingTimeout:      'Waiting for timeout (1s)...',
        uploadHint:          'PNG, JPG or PDF up to 10MB',
        selectFileFirst:     'Select a file first',
        uploading:           'Uploading... ',
        uploadProgress:      'Uploading... 0%',
        uploadSuccess:       'File uploaded successfully',
        downloading:         'Downloading...',
        downloadStarted:     '✓ Download started — '
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.HttpClient': {
      demo: {
        subtitle:            'Cliente HTTP com contrato consistente, timeout, retry, interceptores, upload e download usando o padrão padrão de demo.',
        s1Title:             '1 — Requisição GET',
        s2Title:             '2 — Requisição POST',
        s3Title:             '3 — Tratamento de erros',
        s4Title:             '4 — Retry automático',
        s5Title:             '5 — Interceptores',
        s6Title:             '6 — Instância global',
        s7Title:             '7 — Upload com progresso',
        s8Title:             '8 — Download',
        s9Title:             '9 — Callbacks por requisição',
        pressButton:         '— pressione o botão —',
        pressAButton:        '— pressione um botão —',
        selectFileHint:      '— selecione um arquivo e pressione Enviar —',
        conceptRetry:        'Exemplo conceitual. Veja o código JavaScript para a configuração de retry automático e backoff.',
        conceptInterceptors: 'Exemplo conceitual. Os interceptores permitem adicionar headers, auth e tratamento global de respostas sem repetir lógica.',
        conceptGlobal:       'Exemplo conceitual. Você pode criar uma instância global uma vez e reutilizá-la em toda a aplicação.',
        conceptCallbacks:    'Exemplo conceitual. Cada requisição pode definir callbacks específicos além dos callbacks globais.',
        btnGet:              'Executar GET',
        btnPost:             'Executar POST',
        btnError:            'Forçar 404',
        btnTimeout:          'Forçar timeout',
        btnUpload:           'Enviar arquivo',
        btnDownload:         'Baixar arquivo',
        loading:             'Carregando...',
        sending:             'Enviando...',
        running:             'Executando...',
        waitingTimeout:      'Aguardando timeout (1s)...',
        uploadHint:          'PNG, JPG ou PDF até 10MB',
        selectFileFirst:     'Selecione um arquivo primeiro',
        uploading:           'Enviando... ',
        uploadProgress:      'Enviando... 0%',
        uploadSuccess:       'Arquivo enviado com sucesso',
        downloading:         'Baixando...',
        downloadStarted:     '✓ Download iniciado — '
      }
    }
  });

})(window);
