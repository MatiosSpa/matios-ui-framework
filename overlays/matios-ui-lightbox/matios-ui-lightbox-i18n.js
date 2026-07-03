/* ============================================================
   MATIOS UI — matios-ui-lightbox-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Lightbox
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.Lightbox': {
      close:    'Cerrar',
      prev:     'Anterior',
      next:     'Siguiente',
      download: 'Descargar',
      counter:  '{current} / {total}',
      demo: {
        subtitle:            'Visor de medios — imágenes, video, YouTube, Vimeo · zoom · miniaturas · auto-bind.',
        s1Title:             '1 — Uso programático',
        s2Title:             '2 — Auto-bind con selector CSS',
        s3Title:             '3 — API + opciones',
        btnOpen0:            'Abrir índice 0',
        btnOpen2:            'Abrir índice 2',
        resultPlaceholder:   '— abre el lightbox —',
        apiResultPlaceholder:'— usa los botones —',
        cap1:                'Paisaje 1 — usa ← → para navegar',
        cap2:                'Paisaje 2 — usa + / - para zoom',
        cap3:                'Paisaje 3 — Esc para cerrar',
        photo1:              'Foto 1 — click para abrir',
        photo2:              'Foto 2 — navegación con ← →',
        photo3:              'Foto 3 — zoom con + / -',
        photo4:              'Foto 4',
        photo5:              'Foto 5',
        photo6:              'Foto 6',
        optA:                'Opción A — animation: slide',
        optB:                'Opción B — download: true',
        optC:                'Opción C — counter: true',
        echoClosed:          'onClose → cerrado'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.Lightbox': {
      close:    'Close',
      prev:     'Previous',
      next:     'Next',
      download: 'Download',
      counter:  '{current} / {total}',
      demo: {
        subtitle:            'Media viewer — images, video, YouTube, Vimeo · zoom · thumbnails · auto-bind.',
        s1Title:             '1 — Programmatic use',
        s2Title:             '2 — Auto-bind with a CSS selector',
        s3Title:             '3 — API + options',
        btnOpen0:            'Open index 0',
        btnOpen2:            'Open index 2',
        resultPlaceholder:   '— open the lightbox —',
        apiResultPlaceholder:'— use the buttons —',
        cap1:                'Landscape 1 — use ← → to navigate',
        cap2:                'Landscape 2 — use + / - to zoom',
        cap3:                'Landscape 3 — Esc to close',
        photo1:              'Photo 1 — click to open',
        photo2:              'Photo 2 — navigate with ← →',
        photo3:              'Photo 3 — zoom with + / -',
        photo4:              'Photo 4',
        photo5:              'Photo 5',
        photo6:              'Photo 6',
        optA:                'Option A — animation: slide',
        optB:                'Option B — download: true',
        optC:                'Option C — counter: true',
        echoClosed:          'onClose → closed'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.Lightbox': {
      close:    'Fechar',
      prev:     'Anterior',
      next:     'Próximo',
      download: 'Baixar',
      counter:  '{current} / {total}',
      demo: {
        subtitle:            'Visualizador de mídia — imagens, vídeo, YouTube, Vimeo · zoom · miniaturas · auto-bind.',
        s1Title:             '1 — Uso programático',
        s2Title:             '2 — Auto-bind com seletor CSS',
        s3Title:             '3 — API + opções',
        btnOpen0:            'Abrir índice 0',
        btnOpen2:            'Abrir índice 2',
        resultPlaceholder:   '— abra o lightbox —',
        apiResultPlaceholder:'— use os botões —',
        cap1:                'Paisagem 1 — use ← → para navegar',
        cap2:                'Paisagem 2 — use + / - para zoom',
        cap3:                'Paisagem 3 — Esc para fechar',
        photo1:              'Foto 1 — clique para abrir',
        photo2:              'Foto 2 — navegação com ← →',
        photo3:              'Foto 3 — zoom com + / -',
        photo4:              'Foto 4',
        photo5:              'Foto 5',
        photo6:              'Foto 6',
        optA:                'Opção A — animation: slide',
        optB:                'Opção B — download: true',
        optC:                'Opção C — counter: true',
        echoClosed:          'onClose → fechado'
      }
    }
  });

})(window);
