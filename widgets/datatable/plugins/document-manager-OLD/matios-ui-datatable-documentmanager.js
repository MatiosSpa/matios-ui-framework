/* ============================================================
   MATIOS UI — MTS.DocumentManagerPlugin  v1.0.0
   Plugin de gestión de documentos para MTS.DataTable.
   ============================================================ */

var MTS = MTS || {};

MTS.DocumentManagerPlugin = class DocumentManagerPlugin {

  static descriptor = {
    name:     'MTS.DocumentManagerPlugin',
    version:  '1.0.0',
    requires: 'MTS.DataTable',
    provides: ['documentManager', 'contextMenu', 'breadcrumb', 'uploadUI']
  }

  constructor(options = {}) {
    this._options         = options
    this._table           = null
    this._breadcrumbStack = []
    this._plugins         = []
    this._uploadUI        = options.uploadUI || null

    this.onFolderChange   = options.onFolderChange   || null
    this.onItemView       = options.onItemView        || null
    this.onItemEdit       = options.onItemEdit        || null
    this.onItemRename     = options.onItemRename      || null
    this.onItemMove       = options.onItemMove        || null
    this.onItemDelete     = options.onItemDelete      || null
    this.onItemDownload   = options.onItemDownload    || null
    this.onUploadComplete = options.onUploadComplete  || null
    this.onUploadError    = options.onUploadError     || null
  }

  install(table)   { this._table = table /* TODO: Fase 4 */ }
  uninstall(table) { this._table = null  /* TODO: Fase 4 */ }

  use(subPlugin)              { /* TODO: Fase 4 — validar requires + install */ }
  changeFolder(id, name, isBack = false) { /* TODO: Fase 4 */ }
}
