/* ============================================================
   MATIOS UI — matios-ui-tabs-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Tabs
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Tabs': {
      demo: {
        subtitle:            'Underline, pill y card — horizontal y vertical — íconos, badges y API programática.',
        notice:              'Aviso: este demo usa un shell manual para <strong>Preview | HTML | JavaScript</strong> y así evitar el choque entre <strong>MTS.Tabs</strong> externo e interno dentro del mismo componente.',
        s1Title:             '1 — Underline (por defecto)',
        s2Title:             '2 — Pill',
        s3Title:             '3 — Card',
        s4Title:             '4 — Vertical',
        s5Title:             '5 — Con íconos y badges',
        s6Title:             '6 — API — setActive() programático',
        contentPrefix:       'Contenido de ',
        contentSuffix:       '.',
        resultPlaceholder:   '— cambia de pestaña —',
        apiResultPlaceholder:'— usa los botones —',
        onChangePrefix:      'onChange → id: ',
        addTabPrefix:        'addTab → id: ',
        removeTabPrefix:     'removeTab → id: '
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Tabs': {
      demo: {
        subtitle:            'Underline, pill and card — horizontal and vertical — icons, badges and programmatic API.',
        notice:              'Note: this demo uses a manual shell for <strong>Preview | HTML | JavaScript</strong> to avoid the clash between the outer and inner <strong>MTS.Tabs</strong> within the same component.',
        s1Title:             '1 — Underline (default)',
        s2Title:             '2 — Pill',
        s3Title:             '3 — Card',
        s4Title:             '4 — Vertical',
        s5Title:             '5 — With icons and badges',
        s6Title:             '6 — API — programmatic setActive()',
        contentPrefix:       'Content of ',
        contentSuffix:       '.',
        resultPlaceholder:   '— switch tabs —',
        apiResultPlaceholder:'— use the buttons —',
        onChangePrefix:      'onChange → id: ',
        addTabPrefix:        'addTab → id: ',
        removeTabPrefix:     'removeTab → id: '
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Tabs': {
      demo: {
        subtitle:            'Underline, pill e card — horizontal e vertical — ícones, badges e API programática.',
        notice:              'Aviso: este demo usa um shell manual para <strong>Preview | HTML | JavaScript</strong> e assim evitar o choque entre <strong>MTS.Tabs</strong> externo e interno dentro do mesmo componente.',
        s1Title:             '1 — Underline (padrão)',
        s2Title:             '2 — Pill',
        s3Title:             '3 — Card',
        s4Title:             '4 — Vertical',
        s5Title:             '5 — Com ícones e badges',
        s6Title:             '6 — API — setActive() programático',
        contentPrefix:       'Conteúdo de ',
        contentSuffix:       '.',
        resultPlaceholder:   '— troque de aba —',
        apiResultPlaceholder:'— use os botões —',
        onChangePrefix:      'onChange → id: ',
        addTabPrefix:        'addTab → id: ',
        removeTabPrefix:     'removeTab → id: '
      }
    }
  });

})(window);
