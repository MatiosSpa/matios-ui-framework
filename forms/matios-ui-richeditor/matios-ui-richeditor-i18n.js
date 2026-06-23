/* ============================================================
   MATIOS UI — matios-ui-richeditor-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.RichEditor
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.RichEditor': {
      messages: { required: 'Este campo es obligatorio' },
      demo: {
        subtitle:          'Editor de plantillas con merge fields — chips atómicos, paleta de campos, formato básico y progressive enhancement sobre un <textarea>.',
        s1Title:           'Editor completo — todas las opciones',
        resultPlaceholder: '— onChange muestra el Handlebars en tiempo real —',
        emptyValue:        '(vacío)',
        noCustomFields:    '(aún no hay campos personalizados — agrega uno desde la paleta)'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.RichEditor': {
      messages: { required: 'This field is required' },
      demo: {
        subtitle:          'Template editor with merge fields — atomic chips, field palette, basic formatting and progressive enhancement over a <textarea>.',
        s1Title:           'Full editor — all options',
        resultPlaceholder: '— onChange shows the Handlebars output in real time —',
        emptyValue:        '(empty)',
        noCustomFields:    '(no custom fields yet — add one from the palette)'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.RichEditor': {
      messages: { required: 'Este campo é obrigatório' },
      demo: {
        subtitle:          'Editor de modelos com merge fields — chips atômicos, paleta de campos, formatação básica e progressive enhancement sobre um <textarea>.',
        s1Title:           'Editor completo — todas as opções',
        resultPlaceholder: '— onChange mostra o Handlebars em tempo real —',
        emptyValue:        '(vazio)',
        noCustomFields:    '(ainda não há campos personalizados — adicione um pela paleta)'
      }
    }
  });

})(window);
