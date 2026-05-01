/* ============================================================
   MATIOS UI — MTS.DataTableColumnVisibilityPlugin  v1.1.0
   Plugin de visibilidad de columnas para MTS.DataTable.

   Dependencias: MTS.Button (matios-ui-button.css + matios-ui-button.js)

   Agrega un botón [|||] al toolbar (slot derecho extremo).
   Abre un dropdown checklist con todas las columnas togueables.
   Columnas ocultas no se renderizan — sin llamada al API.

   Columnas excluidas del toggle:
     - La columna de acciones (__mts_actions__)
     - Columnas marcadas con alwaysVisible: true

   Uso:
     const colVis = new MTS.DataTableColumnVisibilityPlugin()

     new MTS.DataTable({
       columns: [
         { field: 'id',   label: '#',      alwaysVisible: true },
         { field: 'name', label: 'Nombre' },
         { field: 'role', label: 'Rol' },
       ],
       plugins: [colVis],
       ...
     })
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DataTableColumnVisibilityPlugin = class DataTableColumnVisibilityPlugin {

  static descriptor = {
    name:     'MTS.DataTableColumnVisibilityPlugin',
    version:  '1.2.0',
    type:     'columnVisibility',
    requires: ['MTS.DataTable', 'MTS.Button'],
    provides: 'columnVisibility',
  }

  /* ----------------------------------------------------------
     CONSTRUCTOR
  ---------------------------------------------------------- */
  constructor(options = {}) {
    this._table           = null
    this._containerEl     = null
    this._btnEl           = null      // <button> raw
    this._btnInstance     = null      // MTS.Button instance
    this._dropdownEl      = null
    this._isOpen          = false
    this._originalColumns = []
    this._hidden          = new Set()

    this._onDocClick = this._onDocClick.bind(this)
    this._onDocKey   = this._onDocKey.bind(this)
  }

  /* ----------------------------------------------------------
     CICLO DE VIDA
  ---------------------------------------------------------- */
  install(table) {
    this._table           = table
    this._originalColumns = [...table._cfg.columns]

    this._containerEl = this._buildContainer()
    table.setToolbarActions(this._containerEl)
  }

  uninstall() {
    if (!this._table) return
    this._closeDropdown()

    this._table._cfg.columns = [...this._originalColumns]
    this._table.setToolbarActions(null)

    this._btnInstance     = null
    this._btnEl           = null
    this._containerEl     = null
    this._table           = null
  }

  /* ----------------------------------------------------------
     RENDER — contenedor del botón
  ---------------------------------------------------------- */
  _buildContainer() {
    const el = document.createElement('div')
    el.className = 'mts-dt-colvis'

    /* Crear <button> y delegar a MTS.Button */
    const btn = document.createElement('button')
    btn.type = 'button'

    const iconHtml = typeof MTS?.Icon?.get === 'function' ? MTS.Icon.get('columns') : ''

    this._btnInstance = new MTS.Button(btn, {
      variant:  'secondary',
      size:     'sm',
      iconLeft: iconHtml,
      iconOnly: true,
    })

    btn.title = this._t('toggle')
    btn.setAttribute('aria-label',   this._t('toggle'))
    btn.setAttribute('aria-pressed', 'false')
    btn.addEventListener('click', e => { e.stopPropagation(); this._toggleDropdown() })

    this._btnEl = btn
    el.appendChild(btn)
    return el
  }

  /* ----------------------------------------------------------
     DROPDOWN
  ---------------------------------------------------------- */
  _toggleDropdown() {
    this._isOpen ? this._closeDropdown() : this._openDropdown()
  }

  _openDropdown() {
    if (this._isOpen) return
    this._isOpen = true

    const dropdown = document.createElement('div')
    dropdown.className = 'mts-dt-colvis__dropdown'

    const toggleable = this._originalColumns.filter(col =>
      col.field !== '__mts_actions__' && !col.alwaysVisible
    )

    if (!toggleable.length) {
      const msg = document.createElement('div')
      msg.className   = 'mts-dt-colvis__empty'
      msg.textContent = this._t('empty')
      dropdown.appendChild(msg)
    } else {
      toggleable.forEach(col => {
        const isVisible = !this._hidden.has(col.field)

        const item = document.createElement('label')
        item.className = 'mts-dt-colvis__item'

        const cb = document.createElement('input')
        cb.type      = 'checkbox'
        cb.checked   = isVisible
        cb.className = 'mts-checkbox'
        cb.addEventListener('change', () => {
          if (cb.checked) {
            this._hidden.delete(col.field)
          } else {
            this._hidden.add(col.field)
          }
          this._applyVisibility()
        })

        const lbl = document.createElement('span')
        lbl.textContent = col.label || col.field

        item.appendChild(cb)
        item.appendChild(lbl)
        dropdown.appendChild(item)
      })
    }

    /* Posicionar — alineado a la derecha del botón */
    const rect = this._btnEl.getBoundingClientRect()
    dropdown.style.top   = `${rect.bottom + 4 + window.scrollY}px`
    dropdown.style.right = `${window.innerWidth - rect.right + window.scrollX}px`

    document.body.appendChild(dropdown)
    this._dropdownEl = dropdown

    document.addEventListener('click',   this._onDocClick, { capture: true })
    document.addEventListener('keydown', this._onDocKey)
  }

  _closeDropdown() {
    if (!this._isOpen) return
    this._isOpen = false
    this._dropdownEl?.remove()
    this._dropdownEl = null
    document.removeEventListener('click',   this._onDocClick, { capture: true })
    document.removeEventListener('keydown', this._onDocKey)
  }

  _onDocClick(e) {
    if (!this._containerEl?.contains(e.target) && !this._dropdownEl?.contains(e.target)) {
      this._closeDropdown()
    }
  }

  _onDocKey(e) {
    if (e.key === 'Escape') this._closeDropdown()
  }

  /* ----------------------------------------------------------
     APLICAR VISIBILIDAD — modifica _cfg.columns y redibuja
  ---------------------------------------------------------- */
  _t(key) {
    return this._table?._cfg?.locale?.colvis?.[key] ?? key
  }

  _applyVisibility() {
    this._table._cfg.columns = this._originalColumns.filter(col =>
      col.field === '__mts_actions__' ||
      col.alwaysVisible               ||
      !this._hidden.has(col.field)
    )

    /* aria-pressed refleja si hay columnas ocultas */
    this._btnEl?.setAttribute('aria-pressed', this._hidden.size > 0 ? 'true' : 'false')

    this._table.redraw()
  }
}
