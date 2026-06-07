/* ============================================================
   MATIOS UI — matios-ui-fileupload-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.FileUpload
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.FileUpload': {
      demo: {
        subtitle:            'Zona de archivos con arrastrar y soltar, validación, previsualizaciones y helpers de API.',
        s1Title:             '1 — Imágenes con preview',
        s2Title:             '2 — Documento único',
        s3Title:             '3 — Múltiples tipos + API',
        resultPlaceholder:   '— sube archivos para ver los callbacks —',
        apiPlaceholder:      '— usa los botones —',
        hintImages:          'PNG, JPG hasta 2MB · Máx 5',
        labelSingle:         'Sube tu CV en PDF',
        hintSingle:          'PDF hasta 5MB',
        hintDocs:            'PDF, Word o Excel hasta 10MB',
        echoChange:          'onChange → {n} archivo(s)',
        echoAdd:             'onAdd → "{name}"',
        echoRemove:          'onRemove → "{name}"',
        echoError:           'onError → {error}',
        echoGetFiles:        'getFiles() → {files}',
        echoClear:           'clear() ✓'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.FileUpload': {
      demo: {
        subtitle:            'Drag & drop file zone with validation, previews and API helpers.',
        s1Title:             '1 — Images with preview',
        s2Title:             '2 — Single document',
        s3Title:             '3 — Multiple types + API',
        resultPlaceholder:   '— upload files to see the callbacks —',
        apiPlaceholder:      '— use the buttons —',
        hintImages:          'PNG, JPG up to 2MB · Max 5',
        labelSingle:         'Upload your CV as PDF',
        hintSingle:          'PDF up to 5MB',
        hintDocs:            'PDF, Word or Excel up to 10MB',
        echoChange:          'onChange → {n} file(s)',
        echoAdd:             'onAdd → "{name}"',
        echoRemove:          'onRemove → "{name}"',
        echoError:           'onError → {error}',
        echoGetFiles:        'getFiles() → {files}',
        echoClear:           'clear() ✓'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.FileUpload': {
      demo: {
        subtitle:            'Zona de arrastar e soltar arquivos com validação, pré-visualizações e helpers de API.',
        s1Title:             '1 — Imagens com pré-visualização',
        s2Title:             '2 — Documento único',
        s3Title:             '3 — Múltiplos tipos + API',
        resultPlaceholder:   '— envie arquivos para ver os callbacks —',
        apiPlaceholder:      '— use os botões —',
        hintImages:          'PNG, JPG até 2MB · Máx 5',
        labelSingle:         'Envie seu CV em PDF',
        hintSingle:          'PDF até 5MB',
        hintDocs:            'PDF, Word ou Excel até 10MB',
        echoChange:          'onChange → {n} arquivo(s)',
        echoAdd:             'onAdd → "{name}"',
        echoRemove:          'onRemove → "{name}"',
        echoError:           'onError → {error}',
        echoGetFiles:        'getFiles() → {files}',
        echoClear:           'clear() ✓'
      }
    }
  });

})(window);
