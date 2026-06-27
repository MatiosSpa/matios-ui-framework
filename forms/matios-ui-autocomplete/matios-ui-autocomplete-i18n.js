/* ============================================================
   MATIOS UI — matios-ui-autocomplete-i18n.js
   i18n del componente (es / en / pt)
   Namespace: MTS.Autocomplete
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', { 'MTS.Autocomplete': { messages: { required: 'Este campo es obligatorio' } } });
  MTS.registerLocale('en', { 'MTS.Autocomplete': { messages: { required: 'This field is required' } } });
  MTS.registerLocale('pt', { 'MTS.Autocomplete': { messages: { required: 'Este campo é obrigatório' } } });

})(window);
