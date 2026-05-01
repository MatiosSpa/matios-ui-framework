/* ============================================================
   MATIOS UI — MTS.DataTableContextMenuPlugin  v2.0.0
   Plugin de menú contextual para MTS.DataTable.

   Dependencia interna: MTS.DataTableMenu

   Uso:
     const ctx = new MTS.DataTableContextMenuPlugin({
       items: [
         { label: 'Editar',   icon: 'edit',  action: (item, table) => {},
           condition: (item) => item.status === 'active' },
         { separator: true },
         { label: 'Eliminar', icon: 'trash', danger: true,
           action: (item, table) => {} },
       ],
       onOpen:  (item) => {},
       onClose: ()     => {},
     })

     new MTS.DataTable({ plugins: [ctx], ... })

   Columna de acciones (opcional):
     new MTS.DataTable({
       actionColumn:      true,
       actionColumnLabel: '',       // header vacío por defecto
       actionColumnWidth: '120px',
       plugins: [ctx],
     })
   ============================================================ */

var MTS = MTS || {};

MTS.DataTableContextMenuPlugin = class DataTableContextMenuPlugin {

  static descriptor = {
    name:     'MTS.DataTableContextMenuPlugin',
    version:  '2.0.0',
    type:     'contextMenu',
    requires: ['MTS.DataTable', 'MTS.DataTableMenu'],
    provides: 'contextMenu',
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

    this._onContextMenu       = this._onContextMenu.bind(this)
    this._onActionButtonClick = this._onActionButtonClick.bind(this)
  }

  /* ----------------------------------------------------------
     CICLO DE VIDA
  ---------------------------------------------------------- */
  install(table) {
    this._table = table
    table._el.addEventListener('contextmenu', this._onContextMenu)

    if (table._cfg?.actionColumn) {
      this._injectActionColumn(table)
      table._el.addEventListener('click', this._onActionButtonClick, { capture: true })
    }
  }

  uninstall() {
    if (!this._table) return
    this._table._el.removeEventListener('contextmenu', this._onContextMenu)
    this._table._el.removeEventListener('click',       this._onActionButtonClick, { capture: true })
    if (this._injectedCol) {
      const idx = this._table._cfg.columns.indexOf(this._injectedCol)
      if (idx !== -1) this._table._cfg.columns.splice(idx, 1)
      this._injectedCol = null
    }
    this._menu.destroy()
    this._table = null
  }

  /* ----------------------------------------------------------
     API PÚBLICA
  ---------------------------------------------------------- */
  addItem(itemDef) {
    if (!itemDef || (!itemDef.label && !itemDef.separator))
      throw new Error('[MTS.DataTableContextMenuPlugin] addItem: falta label o separator:true')
    this._items.push(itemDef)
    return this
  }

  removeItem(label) {
    this._items = this._items.filter(i => i.label !== label)
    return this
  }

  getItems() { return [...this._items] }

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
     HANDLER — clic derecho
  ---------------------------------------------------------- */
  _onContextMenu(e) {
    const row = e.target.closest('tr.mts-table__row[data-id]')
    if (!row) return
    e.preventDefault()

    const item = this._itemFromRow(row)
    if (!item) return

    const resolved = this._resolveItems(item)
    this._menu.show(resolved, e.clientX, e.clientY)
    if (typeof this.onOpen === 'function') this.onOpen(item)
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

    const item = this._itemFromRow(row)
    if (!item) return

    const rect = btn.getBoundingClientRect()
    const resolved = this._resolveItems(item)
    this._menu.show(resolved, rect.left, rect.bottom + 2)
    if (typeof this.onOpen === 'function') this.onOpen(item)
  }

  /* ----------------------------------------------------------
     RESOLUCIÓN DE ITEMS — aplica conditions y vincula action
  ---------------------------------------------------------- */
  _resolveItems(item) {
    return this._items
      .filter(def => def.separator || typeof def.condition !== 'function' || def.condition(item))
      .map(def => def.separator ? def : {
        ...def,
        action: () => { if (typeof def.action === 'function') def.action(item, this._table) }
      })
  }

  /* ----------------------------------------------------------
     HELPERS
  ---------------------------------------------------------- */
  _itemFromRow(row) {
    const cfg = this._table._cfg
    return this._table._currentData?.find(i =>
      String(i[cfg.rowId ?? 'id']) === row.dataset.id
    ) ?? null
  }
}
