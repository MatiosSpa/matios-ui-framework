/* ============================================================
   MATIOS UI — MTS.DataTableColumnActionsPlugin  v2.0.0
   Plugin de columna de acciones standalone para MTS.DataTable.

   Dependencia interna: MTS.DataTableMenu

   Inyecta una columna con botón "Acciones" por fila.
   Sin menú contextual por clic derecho — solo la columna.

   Las actions reciben array de items (single o batch):
     - Si el item está en la selección activa → todos los seleccionados
     - Si no → [item] de esa fila

   Uso:
     const colActions = new MTS.DataTableColumnActionsPlugin({
       items: [
         { label: 'Editar',   icon: 'edit',  action: (items) => {} },
         { label: 'Duplicar', icon: 'copy',  action: (items) => {},
           condition: (item, items) => !item.locked },
         { separator: true },
         { label: 'Eliminar', icon: 'trash', danger: true,
           action: (items) => {} },
       ],
       onOpen:  (item)  => {},
       onClose: ()      => {},
     })

     new MTS.DataTable({
       plugins:           [colActions],
       actionColumnLabel: '',       // header vacío por defecto
       actionColumnWidth: '120px',
       ...
     })
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DataTableColumnActionsPlugin = class DataTableColumnActionsPlugin {

  static descriptor = {
    name:     'MTS.DataTableColumnActionsPlugin',
    version:  '2.0.0',
    type:     'columnActions',
    requires: ['MTS.DataTable', 'MTS.DataTableMenu'],
    provides: 'columnActions',
  }

  /* ----------------------------------------------------------
     CONSTRUCTOR
  ---------------------------------------------------------- */
  constructor(options = {}) {
    this._options     = options
    this._items       = [...(options.items || [])]
    this._table       = null
    this._injectedCol = null
    this.onOpen       = options.onOpen  ?? null
    this.onClose      = options.onClose ?? null

    this._menu = new MTS.DataTableMenu({
      onClose: () => { if (typeof this.onClose === 'function') this.onClose() }
    })

    this._onActionButtonClick = this._onActionButtonClick.bind(this)
  }

  /* ----------------------------------------------------------
     CICLO DE VIDA
  ---------------------------------------------------------- */
  install(table) {
    this._table = table
    this._injectActionColumn(table)
    table._el.addEventListener('click', this._onActionButtonClick, { capture: true })
  }

  uninstall() {
    if (!this._table) return
    this._table._el.removeEventListener('click', this._onActionButtonClick, { capture: true })
    if (this._injectedCol) {
      const idx = this._table._cfg.columns.indexOf(this._injectedCol)
      if (idx !== -1) this._table._cfg.columns.splice(idx, 1)
      this._injectedCol = null
    }
    this._menu.destroy()
    this._table = null
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
     Intercepta antes de que el <tr> procese la selección.
  ---------------------------------------------------------- */
  _onActionButtonClick(e) {
    const btn = e.target.closest('.mts-dt-trigger')
    if (!btn) return
    const row = btn.closest('tr.mts-table__row[data-id]')
    if (!row) return

    e.stopPropagation()

    if (this._menu.isOpen) { this._menu.destroy(); return }

    const cfg  = this._table._cfg
    const id   = row.dataset.id
    const item = this._table._currentData?.find(i =>
      String(i[cfg.rowId ?? 'id']) === id
    )
    if (!item) return

    const items    = this._resolveSelection(item)
    const resolved = this._resolveItems(item, items)
    if (!resolved.length) return

    const rect = btn.getBoundingClientRect()
    this._menu.show(resolved, rect.left, rect.bottom + 2)
    if (typeof this.onOpen === 'function') this.onOpen(item)
  }

  /* ----------------------------------------------------------
     RESOLUCIÓN SINGLE vs BATCH
  ---------------------------------------------------------- */
  _resolveSelection(item) {
    const rowId         = this._table._cfg?.rowId ?? 'id'
    const selectedItems = this._table._getSelectedItems?.() ?? []
    const contextId     = String(item[rowId])
    const isInSelection = selectedItems.some(i => String(i[rowId]) === contextId)
    return isInSelection && selectedItems.length > 0 ? selectedItems : [item]
  }

  /* ----------------------------------------------------------
     RESOLUCIÓN DE ITEMS — aplica conditions y vincula action
  ---------------------------------------------------------- */
  _resolveItems(item, items) {
    return this._items
      .filter(def => def.separator || typeof def.condition !== 'function' || def.condition(item, items))
      .map(def => def.separator ? def : {
        ...def,
        action: () => { if (typeof def.action === 'function') def.action(items) }
      })
  }
}
