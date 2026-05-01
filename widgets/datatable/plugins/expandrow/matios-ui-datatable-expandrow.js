/* ============================================================
   MATIOS UI — MTS.DataTableExpandRowPlugin  v1.0.0
   Filas expandibles con panel de detalle configurable.

   Uso:
     new MTS.DataTableExpandRowPlugin({
       render:   (item) => `<div>${item.description}</div>`,
       width:    '48px',    // ancho de la columna toggle (default)
       multiple: false,     // true = varias filas abiertas simultáneamente
     })

   Notas:
     - La columna de toggle se inyecta en la primera posición.
     - El estado de expansión se resetea en cada re-render
       (paginación, sort, búsqueda).
     - El dev puede devolver cualquier HTML desde render(item).
       Los datos del item se reconstruyen desde los data-* del <tr>.
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DataTableExpandRowPlugin = class DataTableExpandRowPlugin {

  static descriptor = {
    name:     'MTS.DataTableExpandRowPlugin',
    version:  '1.1.0',
    type:     'expandRow',
    requires: ['MTS.DataTable'],
    provides: 'expandRow',
  }

  /* ----------------------------------------------------------
     CONSTRUCTOR
  ---------------------------------------------------------- */
  constructor(options = {}) {
    this._options = {
      render:   typeof options.render === 'function' ? options.render : null,
      width:    options.width    ?? '48px',
      multiple: options.multiple ?? false,
    }

    this._table       = null
    this._col         = null
    this._expandedIds = new Set()
    this._onReady     = this._onReady.bind(this)
  }

  /* ----------------------------------------------------------
     CICLO DE VIDA
  ---------------------------------------------------------- */
  install(table) {
    this._table = table

    this._col = {
      field:        '__mts_expand__',
      label:        '',
      width:        this._options.width,
      align:        'center',
      alwaysVisible: true,
      render:       (_, item) => this._renderToggle(item),
    }
    table._cfg.columns.unshift(this._col)
    table.registerHook('onReady', this._onReady)
  }

  uninstall() {
    if (!this._table) return

    this._table.unregisterHook('onReady', this._onReady)

    const idx = this._table._cfg.columns.indexOf(this._col)
    if (idx !== -1) this._table._cfg.columns.splice(idx, 1)

    this._table._el.querySelectorAll('.mts-table__row-detail').forEach(r => r.remove())
    this._expandedIds.clear()
    this._table = null
    this._col   = null
  }

  /* ----------------------------------------------------------
     POST-RENDER
  ---------------------------------------------------------- */
  _onReady() {
    /* Cada re-render es estado fresco — el DOM fue reconstruido */
    this._expandedIds.clear()

    this._table._el.querySelectorAll('.mts-expand-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const row = btn.closest('tr.mts-table__row[data-id]')
        if (row) this._toggle(row)
      })
    })
  }

  /* ----------------------------------------------------------
     TOGGLE
  ---------------------------------------------------------- */
  _toggle(row) {
    const rowId = row.dataset.id
    if (this._expandedIds.has(rowId)) {
      this._collapse(row, rowId)
    } else {
      if (!this._options.multiple) {
        this._expandedIds.forEach(id => {
          const other = this._table._el.querySelector(`tr.mts-table__row[data-id="${id}"]`)
          if (other) this._collapse(other, id)
        })
      }
      this._expand(row, rowId)
    }
  }

  _expand(row, rowId) {
    this._expandedIds.add(rowId)
    this._insertDetailRow(row)
    this._setToggleState(row, true)
  }

  _collapse(row, rowId) {
    this._expandedIds.delete(rowId)
    const next = row.nextElementSibling
    if (next?.classList.contains('mts-table__row-detail')) next.remove()
    this._setToggleState(row, false)
  }

  _setToggleState(row, open) {
    const btn = row.querySelector('.mts-expand-btn')
    if (!btn) return
    btn.classList.toggle('mts-expand-btn--open', open)
    btn.setAttribute('aria-expanded', String(open))
  }

  /* ----------------------------------------------------------
     RENDER
  ---------------------------------------------------------- */
  _renderToggle(item) {
    const rowId     = this._table?._cfg?.rowId ? item[this._table._cfg.rowId] : null
    const isOpen    = rowId !== null && this._expandedIds.has(String(rowId))
    const icon      = typeof MTS?.Icon?.get === 'function' ? MTS.Icon.get('chevron-right') : ''
    const cls       = 'mts-expand-btn' + (isOpen ? ' mts-expand-btn--open' : '')
    return `<button type="button" class="${cls}" aria-expanded="${isOpen}" aria-label="Expandir fila">${icon}</button>`
  }

  _insertDetailRow(row) {
    if (!this._options.render) return

    const existing = row.nextElementSibling
    if (existing?.classList.contains('mts-table__row-detail')) existing.remove()

    const cfg      = this._table._cfg
    const colCount = cfg.columns.length
      + (cfg.selection.mode === 'multi' && cfg.selection.checkboxes ? 1 : 0)

    const item      = MTS.DataTableExpandRowPlugin._itemFromRow(row)
    const detailRow = document.createElement('tr')
    detailRow.className = 'mts-table__row-detail'

    const td = document.createElement('td')
    td.colSpan   = colCount
    td.className = 'mts-table__td-detail'
    td.innerHTML = this._options.render(item)

    detailRow.appendChild(td)
    row.insertAdjacentElement('afterend', detailRow)
  }

  /* ----------------------------------------------------------
     HELPERS
  ---------------------------------------------------------- */
  static _itemFromRow(row) {
    const item = {}
    for (const [key, val] of Object.entries(row.dataset)) {
      if (val === 'null' || val === 'undefined') item[key] = null
      else if (val === 'true')  item[key] = true
      else if (val === 'false') item[key] = false
      else {
        try { item[key] = JSON.parse(val) }
        catch { item[key] = val }
      }
    }
    return item
  }
}
