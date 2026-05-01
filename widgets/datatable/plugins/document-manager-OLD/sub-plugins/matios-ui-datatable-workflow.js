/* ============================================================
   MATIOS UI — MTS.DocumentWorkflowPlugin  v1.0.0
   Sub-plugin de workflow para MTS.DocumentManagerPlugin.
   ============================================================ */

var MTS = MTS || {};

MTS.DocumentWorkflowPlugin = class DocumentWorkflowPlugin {

  static descriptor = {
    name:     'MTS.DocumentWorkflowPlugin',
    version:  '1.0.0',
    requires: 'MTS.DocumentManagerPlugin',
    provides: ['documentWorkflow']
  }

  constructor(options = {}) {
    this._items          = [...(options.items || [])]
    this._manager        = null
    this.onWorkflowStart = options.onWorkflowStart || null
  }

  install(manager)   { this._manager = manager /* TODO: Fase 5 */ }
  uninstall(manager) { this._manager = null    /* TODO: Fase 5 */ }
}
