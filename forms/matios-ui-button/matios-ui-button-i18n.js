/* ============================================================
   MATIOS UI — matios-ui-button-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Button
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', {
    'MTS.Button': {
      messages: {
        actions:             'Acciones'
      },
      demo: {
        subtitle:            'Botones con variantes, tamaños, iconos, agrupación y mejora progresiva desde HTML declarativo.',
        s1Title:             '1 — Variantes',
        s2Title:             '2 — Tamaños',
        s3Title:             '3 — Con iconos',
        s4Title:             '4 — Estados',
        s5Title:             '5 — Grupos',
        s6Title:             '6 — MenuButton y SplitButton',
        s7Title:             '7 — Eventos onClick',
        s8Title:             '8 — Sombra y anillo',
        s9Title:             '9 — HTML declarativo + mejora',

        labelIconLeft:       'Icono izquierdo',
        labelIconRight:      'Icono derecho',
        labelIconOnly:       'Solo icono',

        btnSave:             'Guardar',
        btnEdit:             'Editar',
        btnDelete:           'Eliminar',
        btnNext:             'Siguiente',
        btnExport:           'Exportar',

        btnActions:          'Acciones',
        btnDuplicate:        'Duplicar',
        btnSaveDraft:        'Guardar borrador',
        btnSavePublish:      'Guardar y publicar',

        btnCancel:           'Cancelar',
        btnArchive:          'Archivar',

        resultNoActions:     '— sin acciones —',
        resultNoEvents:      '— sin eventos —',
        resultDeclarative:   '— mejora declarativa —'
      }
    }
  });

  MTS.registerLanguage('en', {
    'MTS.Button': {
      messages: {
        actions:             'Actions'
      },
      demo: {
        subtitle:            'Buttons with variants, sizes, icons, grouping and progressive enhancement from declarative HTML.',
        s1Title:             '1 — Variants',
        s2Title:             '2 — Sizes',
        s3Title:             '3 — With icons',
        s4Title:             '4 — States',
        s5Title:             '5 — Groups',
        s6Title:             '6 — MenuButton and SplitButton',
        s7Title:             '7 — onClick events',
        s8Title:             '8 — Shadow and ring',
        s9Title:             '9 — Declarative HTML + enhancement',

        labelIconLeft:       'Left icon',
        labelIconRight:      'Right icon',
        labelIconOnly:       'Icon only',

        btnSave:             'Save',
        btnEdit:             'Edit',
        btnDelete:           'Delete',
        btnNext:             'Next',
        btnExport:           'Export',

        btnActions:          'Actions',
        btnDuplicate:        'Duplicate',
        btnSaveDraft:        'Save draft',
        btnSavePublish:      'Save and publish',

        btnCancel:           'Cancel',
        btnArchive:          'Archive',

        resultNoActions:     '— no actions yet —',
        resultNoEvents:      '— no events yet —',
        resultDeclarative:   '— declarative enhancement —'
      }
    }
  });

  MTS.registerLanguage('pt', {
    'MTS.Button': {
      messages: {
        actions:             'Ações'
      },
      demo: {
        subtitle:            'Botões com variantes, tamanhos, ícones, agrupamento e melhoria progressiva a partir de HTML declarativo.',
        s1Title:             '1 — Variantes',
        s2Title:             '2 — Tamanhos',
        s3Title:             '3 — Com ícones',
        s4Title:             '4 — Estados',
        s5Title:             '5 — Grupos',
        s6Title:             '6 — MenuButton e SplitButton',
        s7Title:             '7 — Eventos onClick',
        s8Title:             '8 — Sombra e anel',
        s9Title:             '9 — HTML declarativo + melhoria',

        labelIconLeft:       'Ícone à esquerda',
        labelIconRight:      'Ícone à direita',
        labelIconOnly:       'Apenas ícone',

        btnSave:             'Salvar',
        btnEdit:             'Editar',
        btnDelete:           'Excluir',
        btnNext:             'Próximo',
        btnExport:           'Exportar',

        btnActions:          'Ações',
        btnDuplicate:        'Duplicar',
        btnSaveDraft:        'Salvar rascunho',
        btnSavePublish:      'Salvar e publicar',

        btnCancel:           'Cancelar',
        btnArchive:          'Arquivar',

        resultNoActions:     '— sem ações —',
        resultNoEvents:      '— sem eventos —',
        resultDeclarative:   '— melhoria declarativa —'
      }
    }
  });

})(window);
