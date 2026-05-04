/* ============================================================
   MATIOS UI — matios-ui-datatable-i18n.js  (compatibility shim)

   Este archivo fue reemplazado por base/matios-ui-i18n.js  v1.0.0
   que centraliza los strings de TODOS los componentes MTS.

   Carga base/matios-ui-i18n.js en su lugar:
     <script src="../../base/matios-ui-i18n.js"></script>

   Este shim solo expone MTS.DataTableLocales como alias de
   MTS.Locales para no romper código que lea esa variable.
   ============================================================ */

window.MTS = window.MTS || {};

/* Alias de retrocompatibilidad — apunta al nuevo registro global */
Object.defineProperty(MTS, 'DataTableLocales', {
  get: function() { return MTS.Locales || {}; },
  configurable: true,
});
