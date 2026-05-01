/* ============================================================
   MATIOS UI — MTS.UploadUIPlugin  v1.0.0
   Sub-plugin reemplazable de upload UI para MTS.DocumentManagerPlugin.
   ============================================================ */

var MTS = MTS || {};

MTS.UploadUIPlugin = class UploadUIPlugin {

  static descriptor = {
    name:     'MTS.UploadUIPlugin',
    version:  '1.0.0',
    requires: 'MTS.DocumentManagerPlugin',
    provides: ['uploadUI']
  }

  constructor(options = {}) {
    this._container     = null
    this.onUploadReady  = options.onUploadReady  || null
    this.onUploadCancel = options.onUploadCancel || null
  }

  render(container)  { this._container = container /* TODO: Fase 5 */ }
  install(manager)   { /* TODO: Fase 5 */ }
  uninstall(manager) { this._container = null }
}
