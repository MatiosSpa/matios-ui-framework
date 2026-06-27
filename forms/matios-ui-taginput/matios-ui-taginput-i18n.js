/* ============================================================
   MATIOS UI — matios-ui-taginput-i18n.js
   i18n del componente + textos del demo (es / en / pt)
   Namespace: MTS.TagInput
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', {
    'MTS.TagInput': {
      messages: { required: 'Este campo es obligatorio' },
      demo: {
        subtitle:                  'Etiquetas con sugerencias locales, búsqueda async y enhancement progresivo desde HTML declarativo.',
        s1Title:                   '1 — Sugerencias locales',
        s2Title:                   '2 — Autocomplete async',
        s3Title:                   '3 — Límite máximo',
        s4Title:                   '4 — HTML declarativo + enhancement',
        resultBasicPlaceholder:    '— agrega o elimina etiquetas —',
        resultAsyncPlaceholder:    '— escribe para buscar —',
        resultMaxPlaceholder:      '— máximo 3 etiquetas —',
        resultDeclarativePlaceholder: '— HTML declarativo + enhancement —',
        labelTags:                 'Etiquetas',
        labelGuests:               'Invitados',
        labelSkills:               'Skills',
        placeholderSearchUser:     'Buscar usuario...',
        placeholderSearchOrType:   'Buscar o escribir...',
        tagUrgent:                 'Urgente',
        tagPending:                'Pendiente',
        tagApproved:               'Aprobado',
        tagBlocked:                'Bloqueado',
        tagReview:                 'Revisión'
      }
    }
  });

  MTS.registerLocale('en', {
    'MTS.TagInput': {
      messages: { required: 'This field is required' },
      demo: {
        subtitle:                  'Tags with local suggestions, async search and progressive enhancement from declarative HTML.',
        s1Title:                   '1 — Local suggestions',
        s2Title:                   '2 — Async autocomplete',
        s3Title:                   '3 — Maximum limit',
        s4Title:                   '4 — Declarative HTML + enhancement',
        resultBasicPlaceholder:    '— add or remove tags —',
        resultAsyncPlaceholder:    '— type to search —',
        resultMaxPlaceholder:      '— maximum 3 tags —',
        resultDeclarativePlaceholder: '— declarative HTML + enhancement —',
        labelTags:                 'Tags',
        labelGuests:               'Guests',
        labelSkills:               'Skills',
        placeholderSearchUser:     'Search user...',
        placeholderSearchOrType:   'Search or type...',
        tagUrgent:                 'Urgent',
        tagPending:                'Pending',
        tagApproved:               'Approved',
        tagBlocked:                'Blocked',
        tagReview:                 'Review'
      }
    }
  });

  MTS.registerLocale('pt', {
    'MTS.TagInput': {
      messages: { required: 'Este campo é obrigatório' },
      demo: {
        subtitle:                  'Etiquetas com sugestões locais, busca assíncrona e enhancement progressivo a partir de HTML declarativo.',
        s1Title:                   '1 — Sugestões locais',
        s2Title:                   '2 — Autocomplete assíncrono',
        s3Title:                   '3 — Limite máximo',
        s4Title:                   '4 — HTML declarativo + enhancement',
        resultBasicPlaceholder:    '— adicione ou remova etiquetas —',
        resultAsyncPlaceholder:    '— digite para buscar —',
        resultMaxPlaceholder:      '— máximo 3 etiquetas —',
        resultDeclarativePlaceholder: '— HTML declarativo + enhancement —',
        labelTags:                 'Etiquetas',
        labelGuests:               'Convidados',
        labelSkills:               'Skills',
        placeholderSearchUser:     'Buscar usuário...',
        placeholderSearchOrType:   'Buscar ou digitar...',
        tagUrgent:                 'Urgente',
        tagPending:                'Pendente',
        tagApproved:               'Aprovado',
        tagBlocked:                'Bloqueado',
        tagReview:                 'Revisão'
      }
    }
  });

})(window);
