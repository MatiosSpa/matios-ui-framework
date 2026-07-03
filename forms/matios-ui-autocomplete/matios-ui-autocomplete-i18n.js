/* ============================================================
   MATIOS UI — matios-ui-autocomplete-i18n.js
   i18n del componente (es / en / pt)
   Namespace: MTS.Autocomplete
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', { 'MTS.Autocomplete': { messages: { required: 'Este campo es obligatorio', empty: 'Sin resultados.', clear: 'Limpiar' } } });
  MTS.registerLanguage('en', { 'MTS.Autocomplete': { messages: { required: 'This field is required', empty: 'No results.', clear: 'Clear' } } });
  MTS.registerLanguage('pt', { 'MTS.Autocomplete': { messages: { required: 'Este campo é obrigatório', empty: 'Sem resultados.', clear: 'Limpar' } } });

})(window);
