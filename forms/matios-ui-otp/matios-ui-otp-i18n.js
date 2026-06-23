/* ============================================================
   MATIOS UI — matios-ui-otp-i18n.js
   i18n del componente (es / en / pt)
   Namespace: MTS.OTP
   ============================================================ */

(function (global) {
  var MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLocale !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLocale('es', { 'MTS.OTP': { messages: { required: 'Este campo es obligatorio' } } });
  MTS.registerLocale('en', { 'MTS.OTP': { messages: { required: 'This field is required' } } });
  MTS.registerLocale('pt', { 'MTS.OTP': { messages: { required: 'Este campo é obrigatório' } } });

})(window);
