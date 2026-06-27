/* ============================================================
   MATIOS UI — matios-ui-imagegallery-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.ImageGallery
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.ImageGallery': {
      demo: {
        subtitle:               'Galería de imágenes — grid, masonry, lista · filtros por categoría · selección múltiple · lightbox integrado.',
        s1Title:                '1 — Grid con filtros y lightbox',
        s2Title:                '2 — Selección múltiple',
        s3Title:                '3 — Variante masonry + lista',
        resultOpenPlaceholder:  '— haz click en una imagen para abrirla —',
        resultSelectPlaceholder:'— haz click en imágenes para seleccionarlas —',
        openEcho:               'onOpen → "{caption}" índice:{index}',
        selectEcho:             'onSelect → {count} imagen(es) seleccionada(s)',
        cleared:                'clearSelection() → selección limpiada',
        getSelectedPrefix:      'getSelected() → '
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.ImageGallery': {
      demo: {
        subtitle:               'Image gallery — grid, masonry, list · filters by category · multi-selection · built-in lightbox.',
        s1Title:                '1 — Grid with filters and lightbox',
        s2Title:                '2 — Multi-selection',
        s3Title:                '3 — Masonry + list variant',
        resultOpenPlaceholder:  '— click an image to open it —',
        resultSelectPlaceholder:'— click images to select them —',
        openEcho:               'onOpen → "{caption}" index:{index}',
        selectEcho:             'onSelect → {count} image(s) selected',
        cleared:                'clearSelection() → selection cleared',
        getSelectedPrefix:      'getSelected() → '
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.ImageGallery': {
      demo: {
        subtitle:               'Galeria de imagens — grade, masonry, lista · filtros por categoria · seleção múltipla · lightbox integrado.',
        s1Title:                '1 — Grade com filtros e lightbox',
        s2Title:                '2 — Seleção múltipla',
        s3Title:                '3 — Variante masonry + lista',
        resultOpenPlaceholder:  '— clique em uma imagem para abri-la —',
        resultSelectPlaceholder:'— clique nas imagens para selecioná-las —',
        openEcho:               'onOpen → "{caption}" índice:{index}',
        selectEcho:             'onSelect → {count} imagem(ns) selecionada(s)',
        cleared:                'clearSelection() → seleção limpa',
        getSelectedPrefix:      'getSelected() → '
      }
    }
  });

})(window);
