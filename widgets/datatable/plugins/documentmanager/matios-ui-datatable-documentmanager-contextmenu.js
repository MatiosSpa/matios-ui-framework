/* ============================================================
   MATIOS UI — MTS.DocumentManagerContextMenuPlugin  v3.1.0
   Context menu para MTS.DocumentManagerPlugin.

   Dependencia interna: MTS.DataTableMenu

   Se instala como sub-plugin del DM — recibe el DM como host:
     dm.install(dm)  →  this._dm = dm  →  dm._table disponible

   Extensible mediante plugins: [...]
     Cada sub-plugin recibe install(ctxMenu) y agrega ítems
     via ctxMenu.addItems(fn).

   Uso:
     const dmCtx = new MTS.DocumentManagerContextMenuPlugin({
       onView:      (item)  => {},  // single
       onDownload:  (items) => {},  // batch
       onOpen:      (item)  => {},  // single
       onRename:    (item)  => {},  // single
       onMove:      (items) => {},  // batch
       onDelete:    (items) => {},  // batch
       plugins:     [dmWorkflow],   // sub-plugins del context menu
     })

     const dm = new MTS.DocumentManagerPlugin({
       plugins: [dmCtx],
     })

   Columna de acciones (opcional — lida por el DataTable):
     new MTS.DataTable({ actionColumn: true, ... })
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DocumentManagerContextMenuPlugin = class DocumentManagerContextMenuPlugin {

  static _PROTECTED_EVENTS   = new Set(['onView', 'onDownload', 'onOpen', 'onRename', 'onMove', 'onDelete'])
  static _PROTECTED_PROVIDES = 'dmContextMenu'

  static descriptor = {
    name:     'MTS.DocumentManagerContextMenuPlugin',
    version:  '3.1.0',
    type:     'contextMenu',
    requires: ['MTS.DocumentManagerPlugin', 'MTS.DataTableMenu'],
    provides: 'dmContextMenu',
  }

  /* ----------------------------------------------------------
     CONSTRUCTOR — sin dm: lo recibe en install(dm)
  ---------------------------------------------------------- */
  constructor(options = {}) {
    this._dm      = null
    this._options = {
      onView:     options.onView     ?? null,
      onDownload: options.onDownload ?? null,
      onOpen:     options.onOpen     ?? null,
      onRename:   options.onRename   ?? null,
      onMove:     options.onMove     ?? null,
      onDelete:   options.onDelete   ?? null,
    }

    this._subPlugins    = [...(options.plugins || [])]
    this._extraItemFns  = []
    this._registeredMap = new Map()
    this._injectedCol   = null

    this._menu = new MTS.DataTableMenu()

    this._onActionButtonClick = this._onActionButtonClick.bind(this)
  }

  /* ----------------------------------------------------------
     CICLO DE VIDA — host = MTS.DocumentManagerPlugin
  ---------------------------------------------------------- */
  install(dm) {
    this._dm = dm

    /* Conectar al hook de context menu del DM */
    dm._options.onContextMenuRequest = (item, x, y) => this._onRequest(item, x, y)

    /* Columna de acciones — tabla ya disponible en dm._table */
    const table = dm._table
    if (table?._cfg?.actionColumn) {
      this._injectActionColumn(table)
      table._el.addEventListener('click', this._onActionButtonClick, { capture: true })
    }

    /* Instalar sub-plugins — este plugin es el host */
    this._subPlugins.forEach(p => this._installSubPlugin(p))
  }

  uninstall() {
    if (!this._dm) return

    ;[...this._subPlugins].reverse().forEach(p => {
      if (typeof p.uninstall === 'function') p.uninstall()
    })

    const table = this._dm._table
    if (table && this._injectedCol) {
      table._el.removeEventListener('click', this._onActionButtonClick, { capture: true })
      const idx = table._cfg.columns.indexOf(this._injectedCol)
      if (idx !== -1) table._cfg.columns.splice(idx, 1)
      this._injectedCol = null
    }

    this._menu.destroy()
    this._dm = null
  }

  /* ----------------------------------------------------------
     SISTEMA DE SUB-PLUGINS
     Sub-plugins se registran via plugins: [...] en el constructor.
     Pueden extenderse externamente via addItems(fn).
  ---------------------------------------------------------- */
  _installSubPlugin(plugin) {
    if (!plugin || typeof plugin !== 'object') return

    const d    = plugin.constructor?.descriptor ?? plugin.descriptor ?? {}
    const name = d.name ?? 'Plugin desconocido'

    /* Conflicto de provides */
    if (d.provides) {
      if (d.provides === this.constructor._PROTECTED_PROVIDES) {
        console.warn(`[MTS.DocumentManagerContextMenuPlugin] ⚠ Conflicto: '${d.provides}' es reservado. '${name}' no instalado.`)
        return
      }
      if (this._registeredMap.has(d.provides)) {
        console.warn(`[MTS.DocumentManagerContextMenuPlugin] ⚠ Conflicto: '${d.provides}' ya registrado por '${this._registeredMap.get(d.provides)}'. '${name}' no instalado.`)
        return
      }
    }

    /* Conflicto de eventos protegidos */
    if (Array.isArray(d.events)) {
      const conflicts = d.events.filter(e => this.constructor._PROTECTED_EVENTS.has(e))
      if (conflicts.length) {
        console.warn(`[MTS.DocumentManagerContextMenuPlugin] ⚠ Eventos protegidos en '${name}': [${conflicts.join(', ')}]. No instalado.`)
        return
      }
    }

    if (typeof plugin.install === 'function') {
      plugin.install(this)
      if (d.provides) this._registeredMap.set(d.provides, name)
    }
  }

  /* API pública para extensiones directas (sin sub-plugin formal) */
  addItems(fn) {
    if (typeof fn === 'function') this._extraItemFns.push(fn)
    return this
  }

  /* ----------------------------------------------------------
     COLUMNA DE ACCIONES
  ---------------------------------------------------------- */
  _injectActionColumn(table) {
    const col = {
      field:    '__mts_actions__',
      label:    table._cfg.actionColumnLabel ?? '',
      width:    table._cfg.actionColumnWidth  ?? '120px',
      align:    'end',
      sortable: false,
      render:   () => MTS.DataTableMenu.renderTrigger(),
    }
    table._cfg.columns.push(col)
    this._injectedCol = col
  }

  /* ----------------------------------------------------------
     HANDLER — clic en trigger de columna (capture phase)
  ---------------------------------------------------------- */
  _onActionButtonClick(e) {
    const btn = e.target.closest('.mts-dt-trigger')
    if (!btn) return
    const row = btn.closest('tr.mts-table__row[data-id]')
    if (!row) return

    e.stopPropagation()

    if (this._menu.isOpen) { this._menu.destroy(); return }

    const item = MTS.DocumentManagerPlugin._itemFromRow(row)
    const rect = btn.getBoundingClientRect()
    this._onRequest(item, rect.left, rect.bottom + 2)
  }

  /* ----------------------------------------------------------
     REQUEST — construye y muestra el menú
  ---------------------------------------------------------- */
  _onRequest(contextItem, x, y) {
    const items = this._resolveItems(contextItem)
    const base  = contextItem.type === 'folder'
      ? this._folderItems(contextItem, items)
      : this._fileItems(contextItem, items)

    const extra = this._extraItemFns.flatMap(fn => {
      try {
        const defs = fn(contextItem, items) || []
        return defs.filter(def => {
          if (def.separator) return true
          if (typeof def.condition !== 'function') return true
          try { return def.condition(contextItem, items) } catch { return false }
        })
      } catch { return [] }
    })

    const allDefs = extra.length ? [...base, { separator: true }, ...extra] : base
    this._menu.show(allDefs, x, y)
  }

  /* ----------------------------------------------------------
     RESOLUCIÓN SINGLE vs BATCH
  ---------------------------------------------------------- */
  _resolveItems(contextItem) {
    const table         = this._dm._table
    const rowId         = table?._cfg?.rowId ?? 'id'
    const selectedItems = table?._getSelectedItems?.() ?? []
    const contextId     = String(contextItem[rowId])
    const isInSelection = selectedItems.some(i => String(i[rowId]) === contextId)
    return isInSelection && selectedItems.length > 0 ? selectedItems : [contextItem]
  }

  /* ----------------------------------------------------------
     ITEMS BASE — archivo
  ---------------------------------------------------------- */
  _fileItems(contextItem, items) {
    const loc       = this._dm?._table?._cfg?.locale?.['MTS.DocumentManagerContextMenuPlugin'] ?? {}
    const allLocked = items.every(i => i.locked)
    return [
      { label: loc.view     ?? 'Ver',       icon: 'eye',      action: () => this._emit('onView',          contextItem) },
      { label: loc.download ?? 'Descargar', icon: 'download', action: () => this._emitBatch('onDownload', contextItem), disabled: allLocked },
      { separator: true },
      { label: loc.rename   ?? 'Renombrar', icon: 'edit',     action: () => this._emit('onRename',        contextItem) },
      { label: loc.move     ?? 'Mover',     icon: 'folder',   action: () => this._emitBatch('onMove',     contextItem) },
      { separator: true },
      { label: loc.delete   ?? 'Eliminar',  icon: 'trash',    action: () => this._emitBatch('onDelete',   contextItem), danger: true },
    ]
  }

  /* ----------------------------------------------------------
     ITEMS BASE — carpeta
  ---------------------------------------------------------- */
  _folderItems(contextItem, items) {
    const loc = this._dm?._table?._cfg?.locale?.['MTS.DocumentManagerContextMenuPlugin'] ?? {}
    return [
      { label: loc.open   ?? 'Abrir',     icon: 'folder-open', action: () => {
          this._dm._navigateTo(contextItem.id, contextItem.name)
          this._emit('onOpen', contextItem)
        }
      },
      { separator: true },
      { label: loc.rename ?? 'Renombrar', icon: 'edit',   action: () => this._emit('onRename',      contextItem) },
      { label: loc.move   ?? 'Mover',     icon: 'folder', action: () => this._emitBatch('onMove',   contextItem) },
      { separator: true },
      { label: loc.delete ?? 'Eliminar',  icon: 'trash',  action: () => this._emitBatch('onDelete', contextItem), danger: true },
    ]
  }

  _emit(event, item) {
    if (typeof this._options[event] === 'function') this._options[event](item)
  }

  _emitBatch(event, contextItem) {
    if (typeof this._options[event] === 'function') {
      this._options[event](this._resolveItems(contextItem))
    }
  }
}
