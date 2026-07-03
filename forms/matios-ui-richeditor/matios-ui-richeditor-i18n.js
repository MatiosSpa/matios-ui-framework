/* ============================================================
   MATIOS UI — matios-ui-richeditor-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.RichEditor
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.RichEditor': {
      messages: {
        required: 'Este campo es obligatorio',
        /* ── Toolbar ── */
        bold: 'Negrita', italic: 'Cursiva', underline: 'Subrayado', strike: 'Tachado',
        normal: 'Normal', heading1: 'Título 1', heading2: 'Título 2', heading3: 'Título 3',
        quote: 'Cita', code: 'Código',
        listUl: 'Lista', listOl: 'Lista numerada', indent: 'Indentar', outdent: 'Desindentar',
        alignLeft: 'Izquierda', alignCenter: 'Centro', alignRight: 'Derecha', alignFull: 'Justificado',
        linkInsert: 'Insertar enlace', linkRemove: 'Quitar enlace',
        textColor: 'Color de texto', bgColor: 'Color de fondo',
        undo: 'Deshacer', redo: 'Rehacer', cleanFormat: 'Limpiar formato',
        htmlSource: 'HTML', fields: 'Campos', fontSize: 'Tamaño', fontFamily: 'Fuente',
        table: 'Tabla',
        /* ── Diálogos / paneles ── */
        urlLabel: 'URL:', urlApply: 'Aplicar', urlCancel: '×', urlPlaceholder: 'https://...',
        htmlApply: 'Aplicar', htmlCancel: '×',
        /* ── Editor ── */
        placeholder: 'Escribe el mensaje...', searchPlaceholder: 'Buscar campo...',
        words: 'palabras', characters: 'caracteres',
        /* ── Paleta de campos ── */
        groupOther: 'Otros', noResults: 'Sin resultados para "{q}"',
        customFieldAdd: '+ Campo personalizado', customFieldSave: 'Agregar', customFieldCancel: 'Cancelar',
        customFieldNamePh: 'Nombre del campo (ej: cliente)', customFieldLabelPh: 'Etiqueta visible',
        customFieldDefaultPh: 'Valor por defecto (opcional)'
      },
      demo: {
        subtitle:          'Editor de plantillas con merge fields — chips atómicos, paleta de campos, formato básico y progressive enhancement sobre un <textarea>.',
        s1Title:           'Editor completo — todas las opciones',
        resultPlaceholder: '— onChange muestra el Handlebars en tiempo real —',
        emptyValue:        '(vacío)',
        noCustomFields:    '(aún no hay campos personalizados — agrega uno desde la paleta)'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.RichEditor': {
      messages: {
        required: 'This field is required',
        /* ── Toolbar ── */
        bold: 'Bold', italic: 'Italic', underline: 'Underline', strike: 'Strikethrough',
        normal: 'Normal', heading1: 'Heading 1', heading2: 'Heading 2', heading3: 'Heading 3',
        quote: 'Quote', code: 'Code',
        listUl: 'Bullet list', listOl: 'Numbered list', indent: 'Indent', outdent: 'Outdent',
        alignLeft: 'Align left', alignCenter: 'Align center', alignRight: 'Align right', alignFull: 'Justify',
        linkInsert: 'Insert link', linkRemove: 'Remove link',
        textColor: 'Text color', bgColor: 'Background color',
        undo: 'Undo', redo: 'Redo', cleanFormat: 'Clear format',
        htmlSource: 'HTML', fields: 'Fields', fontSize: 'Size', fontFamily: 'Font',
        table: 'Table',
        /* ── Dialogs / panels ── */
        urlLabel: 'URL:', urlApply: 'Apply', urlCancel: '×', urlPlaceholder: 'https://...',
        htmlApply: 'Apply', htmlCancel: '×',
        /* ── Editor ── */
        placeholder: 'Write your message...', searchPlaceholder: 'Search field...',
        words: 'words', characters: 'characters',
        /* ── Field palette ── */
        groupOther: 'Other', noResults: 'No results for "{q}"',
        customFieldAdd: '+ Custom field', customFieldSave: 'Add', customFieldCancel: 'Cancel',
        customFieldNamePh: 'Field name (e.g. customer)', customFieldLabelPh: 'Visible label',
        customFieldDefaultPh: 'Default value (optional)'
      },
      demo: {
        subtitle:          'Template editor with merge fields — atomic chips, field palette, basic formatting and progressive enhancement over a <textarea>.',
        s1Title:           'Full editor — all options',
        resultPlaceholder: '— onChange shows the Handlebars output in real time —',
        emptyValue:        '(empty)',
        noCustomFields:    '(no custom fields yet — add one from the palette)'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.RichEditor': {
      messages: {
        required: 'Este campo é obrigatório',
        /* ── Toolbar ── */
        bold: 'Negrito', italic: 'Itálico', underline: 'Sublinhado', strike: 'Tachado',
        normal: 'Normal', heading1: 'Título 1', heading2: 'Título 2', heading3: 'Título 3',
        quote: 'Citação', code: 'Código',
        listUl: 'Lista', listOl: 'Lista numerada', indent: 'Aumentar recuo', outdent: 'Diminuir recuo',
        alignLeft: 'Esquerda', alignCenter: 'Centro', alignRight: 'Direita', alignFull: 'Justificado',
        linkInsert: 'Inserir link', linkRemove: 'Remover link',
        textColor: 'Cor do texto', bgColor: 'Cor de fundo',
        undo: 'Desfazer', redo: 'Refazer', cleanFormat: 'Limpar formatação',
        htmlSource: 'HTML', fields: 'Campos', fontSize: 'Tamanho', fontFamily: 'Fonte',
        table: 'Tabela',
        /* ── Diálogos / painéis ── */
        urlLabel: 'URL:', urlApply: 'Aplicar', urlCancel: '×', urlPlaceholder: 'https://...',
        htmlApply: 'Aplicar', htmlCancel: '×',
        /* ── Editor ── */
        placeholder: 'Escreva a mensagem...', searchPlaceholder: 'Buscar campo...',
        words: 'palavras', characters: 'caracteres',
        /* ── Paleta de campos ── */
        groupOther: 'Outros', noResults: 'Sem resultados para "{q}"',
        customFieldAdd: '+ Campo personalizado', customFieldSave: 'Adicionar', customFieldCancel: 'Cancelar',
        customFieldNamePh: 'Nome do campo (ex: cliente)', customFieldLabelPh: 'Rótulo visível',
        customFieldDefaultPh: 'Valor padrão (opcional)'
      },
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
