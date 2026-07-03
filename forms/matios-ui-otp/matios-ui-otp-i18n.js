/* ============================================================
   MATIOS UI — matios-ui-otp-i18n.js
   i18n del componente (es / en / pt)
   Namespace: MTS.OTP
   ============================================================ */

(function (global) {
  let MTS = global.MTS = global.MTS || {};
  if (typeof MTS.registerLanguage !== 'function') { return; } // requiere base/matios-ui-i18n.js

  MTS.registerLanguage('es', { 'MTS.OTP': { messages: { required: 'Este campo es obligatorio', boxLabel: 'Carácter {n} de {total}', resend: 'Reenviar código' } } });
  MTS.registerLanguage('en', { 'MTS.OTP': { messages: { required: 'This field is required', boxLabel: 'Character {n} of {total}', resend: 'Resend code' } } });
  MTS.registerLanguage('pt', { 'MTS.OTP': { messages: { required: 'Este campo é obrigatório', boxLabel: 'Caractere {n} de {total}', resend: 'Reenviar código' } } });

})(window);
