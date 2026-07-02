/* ============================================================
   MATIOS UI — MTS.DataTableFilterPlugin  v1.1.0
   Plugin de filtros predefinidos por columna para MTS.DataTable.

   Agrega un área de filtros al toolbar (slot central).
   Los filtros activos se muestran como chips removibles.
   Los valores se envían al backend como params del query.

   Tipos soportados:
     type: 'select' — opciones estáticas definidas en options[]
     type: 'async'  — opciones dinámicas desde un endpoint

   Definición de filtro:
     field    — nombre del param que se envía al API
     label    — texto visible en el botón/chip
     type     — 'select' | 'async'

     (type: 'select')
     options  — array de strings o [{ value, label }]

     (type: 'async')
     optionsSource  — { url, method?, valueField, labelField, limit?, params?, headers? }
                      method  — 'GET' (default) | 'POST' | ... GET → params/search/limit en la URL;
                                no-GET → viajan en el body JSON.
                      params  — objeto de query params extra
                      headers — cabeceras que se envían en el fetch interno (ej. auth)
     searchable     — true → muestra input de búsqueda (default: true)
     debounce       — ms de espera antes de llamar al API (default: 300)

   Uso — select estático:
     { field: 'status', label: 'Estado', type: 'select',
       options: [{ value: 'active', label: 'Activo' }] }

   Uso — async:
     { field: 'department', label: 'Área', type: 'async',
       optionsSource: { url: '/api/departments', valueField: 'id', labelField: 'name', limit: 20 },
       searchable: true, debounce: 300 }

   Uso — async con auth + params extra (el fetch interno los aplica):
     { field: 'department', label: 'Área', type: 'async',
       optionsSource: {
         url: '/api/departments', valueField: 'id', labelField: 'name', limit: 20,
         params:  { active: true },                       // → ?active=true en la URL
         headers: { Authorization: 'Bearer ' + token },   // → cabecera del request
       } }
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DataTableFilterPlugin = class DataTableFilterPlugin {

  static descriptor = {
    name:     'MTS.DataTableFilterPlugin',
    version:  '1.2.0',
    type:     'filter',
    requires: ['MTS.DataTable'],
    provides: 'filter',
  }

  /* ----------------------------------------------------------
     CONSTRUCTOR
  ---------------------------------------------------------- */
  constructor(options = {}) {
    this._filters  = (options.filters || []).map(f => ({
      ...f,
      options: f.type !== 'async' ? this._normalizeOptions(f.options || []) : [],
    }))
    this._active      = new Map()   // field → { value, label }
    this._table       = null
    this._containerEl = null
    this._dropdownEl  = null
    this._isOpen      = false
    this._openFilter  = null        // filtro actualmente abierto
    this._debounceTimer = null

    this._onDocClick = this._onDocClick.bind(this)
    this._onDocKey   = this._onDocKey.bind(this)
  }

  /* ----------------------------------------------------------
     CICLO DE VIDA
  ---------------------------------------------------------- */
  install(table) {
    this._table       = table
    this._containerEl = this._buildContainer()
    table.setToolbarFilter(this._containerEl)
  }

  uninstall() {
    if (!this._table) return
    this._closeDropdown()
    this._table.setToolbarFilter(null)
    this._containerEl = null
    this._table       = null
  }

  /* ----------------------------------------------------------
     API PÚBLICA
  ---------------------------------------------------------- */
  clearAll() {
    this._active.clear()
    this._table?.clearParams(...this._filters.map(f => f.field))
    this._renderChips()
    this._table?.load()
  }

  /* ----------------------------------------------------------
     NORMALIZAR OPCIONES
  ---------------------------------------------------------- */
  _normalizeOptions(options) {
    return options.map(o =>
      typeof o === 'string'
        ? { value: o, label: o }
        : { value: String(o.value), label: String(o.label ?? o.value) }
    )
  }

  /* ----------------------------------------------------------
     RENDER — contenedor principal
  ---------------------------------------------------------- */
  _buildContainer() {
    const el = document.createElement('div')
    el.className = 'mts-dt-filter'

    this._chipsEl = document.createElement('div')
    this._chipsEl.className = 'mts-dt-filter__chips'
    el.appendChild(this._chipsEl)

    this._btnEl = document.createElement('button')
    this._btnEl.type      = 'button'
    this._btnEl.className = 'mts-dt-filter__btn'
    this._btnEl.innerHTML = `${this._icon('filter')} <span>${this._t('button')}</span> ${this._icon('chevron-down')}`
    this._btnEl.addEventListener('click', e => { e.stopPropagation(); this._toggleDropdown() })
    el.appendChild(this._btnEl)

    return el
  }

  /* ----------------------------------------------------------
     RENDER — chips activos
  ---------------------------------------------------------- */
  _renderChips() {
    this._chipsEl.replaceChildren()

    this._active.forEach(({ label: optLabel }, field) => {
      const filter = this._filters.find(f => f.field === field)
      const chip   = document.createElement('span')
      chip.className = 'mts-dt-filter__chip'

      const text = document.createElement('span')
      text.className   = 'mts-dt-filter__chip-text'
      text.textContent = `${filter?.label ?? field}: ${optLabel}`

      const rm = document.createElement('button')
      rm.type      = 'button'
      rm.className = 'mts-dt-filter__chip-remove'
      rm.setAttribute('aria-label', this._t('removeChip').replace('{label}', filter?.label ?? field))
      rm.innerHTML = this._icon('x')
      rm.addEventListener('click', e => {
        e.stopPropagation()
        this._removeFilter(field)
      })

      chip.appendChild(text)
      chip.appendChild(rm)
      this._chipsEl.appendChild(chip)
    })

    if (this._active.size > 0) {
      const clear = document.createElement('button')
      clear.type      = 'button'
      clear.className = 'mts-dt-filter__clear'
      clear.textContent = this._t('clearAll')
      clear.addEventListener('click', e => { e.stopPropagation(); this.clearAll() })
      this._chipsEl.appendChild(clear)
    }

    this._btnEl?.classList.toggle('mts-dt-filter__btn--active', this._active.size > 0)
  }

  /* ----------------------------------------------------------
     DROPDOWN — apertura con lista de filtros
  ---------------------------------------------------------- */
  _toggleDropdown() {
    this._isOpen ? this._closeDropdown() : this._openDropdown()
  }

  _openDropdown() {
    if (this._isOpen) return
    this._isOpen    = true
    this._openFilter = null

    const dropdown = document.createElement('div')
    dropdown.className = 'mts-dt-filter__dropdown'

    this._filters.forEach((filter, fi) => {
      if (fi > 0) {
        const sep = document.createElement('div')
        sep.className = 'mts-dt-filter__dropdown-sep'
        dropdown.appendChild(sep)
      }

      const group = document.createElement('div')
      group.className = 'mts-dt-filter__group'

      const lbl = document.createElement('div')
      lbl.className   = 'mts-dt-filter__group-label'
      lbl.textContent = filter.label
      group.appendChild(lbl)

      if (filter.type === 'async') {
        this._buildAsyncGroup(filter, group)
      } else {
        this._buildStaticGroup(filter, group)
      }

      dropdown.appendChild(group)
    })

    const rect = this._btnEl.getBoundingClientRect()
    dropdown.style.top  = `${rect.bottom + 4 + window.scrollY}px`
    dropdown.style.left = `${rect.left   + window.scrollX}px`

    document.body.appendChild(dropdown)
    this._dropdownEl = dropdown

    document.addEventListener('click',   this._onDocClick, { capture: true })
    document.addEventListener('keydown', this._onDocKey)
  }

  /* ----------------------------------------------------------
     GRUPO ESTÁTICO — opciones hardcodeadas
  ---------------------------------------------------------- */
  _buildStaticGroup(filter, group) {
    filter.options.forEach(opt => {
      const isActive = this._active.get(filter.field)?.value === opt.value
      group.appendChild(this._buildOption(filter, opt, isActive))
    })
  }

  /* ----------------------------------------------------------
     GRUPO ASYNC — input búsqueda + carga desde API
  ---------------------------------------------------------- */
  _buildAsyncGroup(filter, group) {
    const src = filter.optionsSource || {}

    /* Input de búsqueda */
    const searchWrap = document.createElement('div')
    searchWrap.className = 'mts-dt-filter__async-search'

    const input = document.createElement('input')
    input.type        = 'text'
    input.className   = 'mts-dt-filter__async-input'
    input.placeholder = this._t('searchHint').replace('{label}', filter.label.toLowerCase())
    input.setAttribute('autocomplete', 'off')
    searchWrap.appendChild(input)
    group.appendChild(searchWrap)

    /* Zona de opciones */
    const listEl = document.createElement('div')
    listEl.className = 'mts-dt-filter__async-list'
    group.appendChild(listEl)

    /* Cargar opciones */
    const load = (q = '') => {
      listEl.replaceChildren()
      const spinner = document.createElement('div')
      spinner.className = 'mts-dt-filter__async-spinner'
      spinner.innerHTML = this._icon('refresh')
      listEl.appendChild(spinner)

      const url     = new URL(src.url, location.origin)
      const method  = (src.method || 'GET').toUpperCase()
      const headers = { ...(src.headers || {}) }
      let   fetchOpts

      if (method === 'GET') {
        if (src.params) Object.keys(src.params).forEach(k => url.searchParams.set(k, String(src.params[k])))
        if (q)          url.searchParams.set('search', q)
        if (src.limit)  url.searchParams.set('limit', String(src.limit))
        fetchOpts = { method, headers }
      } else {
        /* No-GET: params/search/limit viajan en el body JSON. Content-Type solo si el dev no lo puso. */
        if (!Object.keys(headers).some(k => k.toLowerCase() === 'content-type')) headers['Content-Type'] = 'application/json'
        const body = { ...(src.params || {}) }
        if (q)         body.search = q
        if (src.limit) body.limit  = src.limit
        fetchOpts = { method, headers, body: JSON.stringify(body) }
      }

      fetch(url.toString(), fetchOpts)
        .then(r => r.json())
        .then(res => {
          listEl.replaceChildren()
          const items = res.data || res || []

          if (!items.length) {
            const empty = document.createElement('div')
            empty.className   = 'mts-dt-filter__async-empty'
            empty.textContent = this._t('noResults')
            listEl.appendChild(empty)
            return
          }

          items.forEach(item => {
            const val   = String(item[src.valueField] ?? item.id    ?? item.value ?? '')
            const label = String(item[src.labelField] ?? item.name  ?? item.label ?? val)
            const isActive = this._active.get(filter.field)?.value === val
            listEl.appendChild(this._buildOption(filter, { value: val, label }, isActive))
          })
        })
        .catch(() => {
          listEl.replaceChildren()
          const err = document.createElement('div')
          err.className   = 'mts-dt-filter__async-empty'
          err.textContent = this._t('loadError')
          listEl.appendChild(err)
        })
    }

    /* Debounce en el input */
    const debounceMs = filter.debounce ?? 300
    input.addEventListener('input', () => {
      clearTimeout(this._debounceTimer)
      this._debounceTimer = setTimeout(() => load(input.value.trim()), debounceMs)
    })

    /* Carga inicial */
    load('')

    /* Foco automático al input */
    requestAnimationFrame(() => input.focus())
  }

  /* ----------------------------------------------------------
     OPCIÓN INDIVIDUAL (compartida entre static y async)
  ---------------------------------------------------------- */
  _buildOption(filter, opt, isActive) {
    const item = document.createElement('button')
    item.type      = 'button'
    item.className = 'mts-dt-filter__option' +
      (isActive ? ' mts-dt-filter__option--active' : '')

    const check = document.createElement('span')
    check.className = 'mts-dt-filter__option-check'
    check.innerHTML = isActive ? this._icon('check') : ''

    const txt = document.createElement('span')
    txt.textContent = opt.label

    item.appendChild(check)
    item.appendChild(txt)
    item.addEventListener('click', () => {
      this._closeDropdown()
      if (isActive) {
        this._removeFilter(filter.field)
      } else {
        this._applyFilter(filter.field, opt.value, opt.label)
      }
    })

    return item
  }

  /* ----------------------------------------------------------
     CERRAR
  ---------------------------------------------------------- */
  _closeDropdown() {
    if (!this._isOpen) return
    clearTimeout(this._debounceTimer)
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
     LÓGICA DE FILTROS
  ---------------------------------------------------------- */
  _applyFilter(field, value, label) {
    this._active.set(field, { value, label })
    this._table.setParams({ [field]: value })
    this._renderChips()
    this._table.load()
  }

  _removeFilter(field) {
    this._active.delete(field)
    this._table.clearParams(field)
    this._renderChips()
    this._table.load()
  }

  /* ----------------------------------------------------------
     HELPERS
  ---------------------------------------------------------- */
  _t(key) {
    return this._table?._cfg?.locale?.['MTS.DataTableFilterPlugin']?.[key] ?? key
  }

  _icon(name) {
    return typeof MTS?.Icon?.get === 'function' ? MTS.Icon.get(name) : ''
  }
}
