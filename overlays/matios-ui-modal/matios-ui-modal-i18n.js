/* ============================================================
   MATIOS UI — matios-ui-modal-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.Modal
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.Modal': {
      chrome: {
        closeAriaLabel: 'Cerrar',
        confirmTitle:   '¿Estás seguro?',
        confirmLabel:   'Confirmar',
        cancelLabel:    'Cancelar',
        alertTitle:     'Aviso',
        acceptLabel:    'Aceptar',
        promptTitle:    'Ingresa un valor'
      },
      demo: {
        subtitle:            'Diálogo modal — tamaños, botones de pie, scrollable, estático, helpers confirm/alert/prompt.',
        s1Title:             '1 — Tamaños',
        s2Title:             '2 — Helpers rápidos',
        s3Title:             '3 — Estático + cuerpo scrollable',
        s4Title:             '4 — Radio de borde',
        resultPlaceholder:   '— abre un modal —',
        helperPlaceholder:   '— usa los helpers —',
        modalSizeTitle:      'Modal — tamaño: ',
        modalSizeBody:       'Contenido del modal con tamaño ',
        btnCancel:           'Cancelar',
        btnAccept:           'Aceptar',
        confirmTitle:        'Eliminar registro',
        confirmMessage:      'Esta acción no se puede deshacer.',
        confirmConfirm:      'Eliminar',
        confirmCancel:       'Cancelar',
        confirmDone:         'confirmado',
        confirmCancelled:    'cancelado',
        alertTitle:          'Listo',
        alertMessage:        'Los cambios fueron guardados correctamente.',
        alertDone:           'aceptado',
        promptTitle:         'Renombrar archivo',
        promptPlaceholder:   'Nuevo nombre...',
        promptValue:         'documento.pdf',
        promptCancelled:     'cancelado',
        staticBtn:           'Modal estático',
        scrollableBtn:       'Cuerpo scrollable',
        staticTitle:         'Acción requerida',
        staticBody:          'Este modal no cierra con Esc ni haciendo click fuera.',
        staticOk:            'Entendido',
        termsTitle:          'Términos y condiciones',
        termsReject:         'Rechazar',
        termsAccept:         'Aceptar',
        radiusTitle:         'Radio de borde: ',
        radiusBody:          'Este modal usa ',
        radiusClose:         'Cerrar'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.Modal': {
      chrome: {
        closeAriaLabel: 'Close',
        confirmTitle:   'Are you sure?',
        confirmLabel:   'Confirm',
        cancelLabel:    'Cancel',
        alertTitle:     'Notice',
        acceptLabel:    'OK',
        promptTitle:    'Enter a value'
      },
      demo: {
        subtitle:            'Dialog modal — sizes, footer buttons, scrollable, static, confirm/alert/prompt helpers.',
        s1Title:             '1 — Sizes',
        s2Title:             '2 — Convenience helpers',
        s3Title:             '3 — Static + scrollable body',
        s4Title:             '4 — Border radius',
        resultPlaceholder:   '— open a modal —',
        helperPlaceholder:   '— use the helpers —',
        modalSizeTitle:      'Modal — size: ',
        modalSizeBody:       'Modal content with size ',
        btnCancel:           'Cancel',
        btnAccept:           'Accept',
        confirmTitle:        'Delete record',
        confirmMessage:      'This action cannot be undone.',
        confirmConfirm:      'Delete',
        confirmCancel:       'Cancel',
        confirmDone:         'confirmed',
        confirmCancelled:    'cancelled',
        alertTitle:          'Done',
        alertMessage:        'Your changes were saved successfully.',
        alertDone:           'accepted',
        promptTitle:         'Rename file',
        promptPlaceholder:   'New name...',
        promptValue:         'document.pdf',
        promptCancelled:     'cancelled',
        staticBtn:           'Static modal',
        scrollableBtn:       'Scrollable body',
        staticTitle:         'Action required',
        staticBody:          'This modal does not close with Esc or by clicking outside.',
        staticOk:            'Got it',
        termsTitle:          'Terms and conditions',
        termsReject:         'Reject',
        termsAccept:         'Accept',
        radiusTitle:         'Border radius: ',
        radiusBody:          'This modal uses ',
        radiusClose:         'Close'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.Modal': {
      chrome: {
        closeAriaLabel: 'Fechar',
        confirmTitle:   'Tem certeza?',
        confirmLabel:   'Confirmar',
        cancelLabel:    'Cancelar',
        alertTitle:     'Aviso',
        acceptLabel:    'OK',
        promptTitle:    'Digite um valor'
      },
      demo: {
        subtitle:            'Diálogo modal — tamanhos, botões de rodapé, scrollable, estático, helpers confirm/alert/prompt.',
        s1Title:             '1 — Tamanhos',
        s2Title:             '2 — Helpers rápidos',
        s3Title:             '3 — Estático + corpo scrollable',
        s4Title:             '4 — Raio de borda',
        resultPlaceholder:   '— abra um modal —',
        helperPlaceholder:   '— use os helpers —',
        modalSizeTitle:      'Modal — tamanho: ',
        modalSizeBody:       'Conteúdo do modal com tamanho ',
        btnCancel:           'Cancelar',
        btnAccept:           'Aceitar',
        confirmTitle:        'Excluir registro',
        confirmMessage:      'Esta ação não pode ser desfeita.',
        confirmConfirm:      'Excluir',
        confirmCancel:       'Cancelar',
        confirmDone:         'confirmado',
        confirmCancelled:    'cancelado',
        alertTitle:          'Pronto',
        alertMessage:        'As alterações foram salvas com sucesso.',
        alertDone:           'aceito',
        promptTitle:         'Renomear arquivo',
        promptPlaceholder:   'Novo nome...',
        promptValue:         'documento.pdf',
        promptCancelled:     'cancelado',
        staticBtn:           'Modal estático',
        scrollableBtn:       'Corpo scrollable',
        staticTitle:         'Ação necessária',
        staticBody:          'Este modal não fecha com Esc nem clicando fora.',
        staticOk:            'Entendido',
        termsTitle:          'Termos e condições',
        termsReject:         'Rejeitar',
        termsAccept:         'Aceitar',
        radiusTitle:         'Raio de borda: ',
        radiusBody:          'Este modal usa ',
        radiusClose:         'Fechar'
      }
    }
  });

})(window);
