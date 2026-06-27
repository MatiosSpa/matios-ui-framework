/* ============================================================
   MATIOS UI — matios-ui-jsonviewer-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.JsonViewer
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.JsonViewer': {
      demo: {
        subtitle:            'Utility para ver payloads JSON, responses y configuraciones con formato, plegado y copia dentro de demos, soporte y tooling.',
        s1Title:             '1 - Pegar / payload / raw invalido',
        inlineTitle:         'Pegar y formatear',
        inlineSubtitle:      'Pega JSON en una linea y formatealo dentro del componente',
        inlinePlaceholder:   'Pega aqui tu JSON y presiona Format',
        payloadTitle:        'Payload de request',
        payloadSubtitle:     'POST /api/workflows',
        invalidTitle:        'Fallback raw',
        invalidSubtitle:     'JSON invalido con mensaje de parseo'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.JsonViewer': {
      demo: {
        subtitle:            'Utility to view JSON payloads, responses and configurations with formatting, folding and copy inside demos, support and tooling.',
        s1Title:             '1 - Paste / payload / invalid raw',
        inlineTitle:         'Paste and format',
        inlineSubtitle:      'Paste single-line JSON and format it inside the component',
        inlinePlaceholder:   'Paste your JSON here and press Format',
        payloadTitle:        'Request payload',
        payloadSubtitle:     'POST /api/workflows',
        invalidTitle:        'Fallback raw',
        invalidSubtitle:     'Invalid JSON with parse message'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.JsonViewer': {
      demo: {
        subtitle:            'Utility para visualizar payloads JSON, respostas e configuracoes com formatacao, recolhimento e copia dentro de demos, suporte e tooling.',
        s1Title:             '1 - Colar / payload / raw invalido',
        inlineTitle:         'Colar e formatar',
        inlineSubtitle:      'Cole JSON em uma linha e formate-o dentro do componente',
        inlinePlaceholder:   'Cole seu JSON aqui e pressione Format',
        payloadTitle:        'Payload de request',
        payloadSubtitle:     'POST /api/workflows',
        invalidTitle:        'Fallback raw',
        invalidSubtitle:     'JSON invalido com mensagem de parse'
      }
    }
  });

})(window);
