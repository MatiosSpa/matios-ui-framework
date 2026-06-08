/* ============================================================
   MATIOS UI — MTS.DataTable  v1.1.0
   Core puro. Sin dependencias externas.
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DataTable = class DataTable {

  /* ----------------------------------------------------------
     DEFAULTS
  ---------------------------------------------------------- */
  static _defaults = {
    pageSize:  10,
    hover:     true,
    striped:   false,
    bordered:  false,
    compact:   false,
    sort:      { column: null, direction: 'asc' },
    selection: { mode: 'none', checkboxes: false },
    search:    { enabled: false, minChars: 1, width: '240px' },
    pagination: { pageSizeOptions: [5, 10, 25, 50, 100] },
    fixedHeader:       false,
    fixedHeaderHeight: '400px',
    dragDrop:  { enabled: false },
    persist:   { enabled: false, key: null },
    rowClass:  null,
    locale:    'es',
    texts: {
      search:   'Buscar...',
      noData:   'Sin resultados',
      loading:  'Cargando...',
      error:    'Error al cargar datos.',
      retry:    'Reintentar',
      showing:  'Mostrando {start}–{end} de {total}',
      perPage:  'Filas:',
      previous: 'Anterior',
      next:     'Siguiente',
    }
  }

  /* ----------------------------------------------------------
     CONSTRUCTOR
  ---------------------------------------------------------- */
  constructor(config = {}) {
    this._validateConfig(config)

    this._el = typeof config.elementId === 'string'
      ? document.getElementById(config.elementId)
      : config.element

    this._cfg         = this._mergeDefaults(config)
    this._pageSize    = this._cfg.pageSize
    this._pageNum     = 1
    this._search      = ''
    this._orderBy     = this._cfg.sort.column
    this._orderDir    = this._cfg.sort.direction
    this._selectedIds = new Set()
    this._plugins     = new Map()
    this._destroyed   = false
    this._currentData = []
    this._selectAllEl = null
    this._dragIndex   = undefined
    this._dragItem    = undefined

    this.debug           = config.debug ?? false
    this._selectInstance = null

    /* Sistema de hooks — plugins usan registerHook/unregisterHook
       en lugar de monkey-patchear las propiedades onXxx del DataTable */
    this._hooks = {}

    /* Slots del toolbar */
    this._toolbarBreadcrumbEl = null   // slot breadcrumb: DM navegación (fila propia si hay botones)
    this._toolbarLeftEl       = null   // slot izquierdo: botones de acción
    this._toolbarFilterEl     = null   // slot central: chips de filtros
    this._toolbarActionsEl    = null   // slot derecho extremo: column-visibility, etc.

    /* Zonas del layout — se montan una vez, solo se reemplaza el contenido */
    this._toolbarEl       = null   // zona superior completa
    this._contentEl       = null   // zona central: tabla o empty state
    this._footerEl        = null   // zona inferior: paginación
    this._tableWrapHeight = null   // min-height fijo del wrapper
    this._lastResult      = null   // último resultado — usado por redraw()

    this._dataFn = this._resolveDataSource(config.dataSource)
    this._params = { ...(config.dataSource?.params || {}) }

    if (this._cfg.persist.enabled) this._restoreState()

    this._assignHandlers(config)

    if (Array.isArray(config.plugins)) {
      config.plugins.forEach(p => this.use(p))
    }

    this._log('[init] elementId:', config.elementId, '| columns:', this._cfg.columns.length, '| pageSize:', this._pageSize)
    this._el.classList.add('mts-dt')
    this.load()
  }

  /* ----------------------------------------------------------
     VALIDACIÓN DE CONFIG
  ---------------------------------------------------------- */
  _validateConfig(cfg) {
    if (!cfg.elementId && !cfg.element)
      throw new Error('[MTS.DataTable] Falta elementId o element en la configuración')
    if (cfg.elementId && !document.getElementById(cfg.elementId))
      throw new Error(`[MTS.DataTable] Elemento no encontrado: #${cfg.elementId}`)
    if (!Array.isArray(cfg.columns) || cfg.columns.length === 0)
      throw new Error('[MTS.DataTable] columns debe ser un array con al menos una columna')
    if (!cfg.dataSource)
      throw new Error('[MTS.DataTable] Falta dataSource en la configuración')
    cfg.columns.forEach((col, i) => {
      if (!col.field && typeof col.render !== 'function')
        throw new Error(`[MTS.DataTable] Columna [${i}] necesita field o render`)
    })
  }

  /* ----------------------------------------------------------
     MERGE DEFAULTS
  ---------------------------------------------------------- */
  _mergeDefaults(cfg) {
    const d = MTS.DataTable._defaults

    /* Resolver locale desde el sistema global MTS.Locales (matios-ui-i18n.js).
       Fallback a MTS.DataTable.getLocale para retrocompatibilidad. */
    const locKey = cfg.locale ?? d.locale ?? 'es'
    const loc = typeof MTS?.getLocale === 'function'
      ? MTS.getLocale(locKey)
      : (typeof MTS?.DataTable?.getLocale === 'function' ? MTS.DataTable.getLocale(locKey) : {})
    /* Textos del core DataTable — viven en la sección 'MTS.DataTable' del locale */
    const locTexts = loc['MTS.DataTable'] || {}
    /* Exponer locale activo para renders estáticos de plugins (ej: DM renderStatus) */
    MTS.DataTable._activeLocale = loc

    return {
      columns:     cfg.columns,
      rowId:       cfg.rowId       || null,
      hover:       cfg.hover       ?? d.hover,
      striped:     cfg.striped     ?? d.striped,
      bordered:    cfg.bordered    ?? d.bordered,
      compact:     cfg.compact     ?? d.compact,
      pageSize:    cfg.pageSize    ?? d.pageSize,
      fixedHeader:       cfg.fixedHeader       ?? d.fixedHeader,
      fixedHeaderHeight: cfg.fixedHeaderHeight ?? d.fixedHeaderHeight,
      sort: {
        column:    cfg.sort?.column    ?? d.sort.column,
        direction: cfg.sort?.direction ?? d.sort.direction,
      },
      selection: {
        mode:       cfg.selection?.mode       ?? d.selection.mode,
        checkboxes: cfg.selection?.checkboxes ?? d.selection.checkboxes,
      },
      search: {
        enabled:  cfg.search?.enabled  ?? d.search.enabled,
        minChars: cfg.search?.minChars ?? d.search.minChars,
        width:    cfg.search?.width    ?? d.search.width,
      },
      pagination: {
        pageSizeOptions: cfg.pagination?.pageSizeOptions ?? d.pagination.pageSizeOptions,
      },
      dragDrop: { enabled: cfg.dragDrop?.enabled ?? d.dragDrop.enabled },
      persist: {
        enabled: cfg.persist?.enabled ?? d.persist.enabled,
        key:     cfg.persist?.key     ?? (cfg.elementId ? `mts-dt-${cfg.elementId}` : null),
      },
      /* Orden de precedencia: defaults → locale → texts del dev */
      texts:  { ...d.texts, ...locTexts, ...cfg.texts },
      locale: loc,

      rowClass: typeof cfg.rowClass === 'function' ? cfg.rowClass : null,

      /* Columna de acciones — leída por plugins (ContextMenu, DM, etc.) */
      actionColumn:      cfg.actionColumn      ?? false,
      actionColumnLabel: cfg.actionColumnLabel ?? '',
      actionColumnWidth: cfg.actionColumnWidth ?? '120px',
    }
  }

  /* ----------------------------------------------------------
     DATASOURCE
  ---------------------------------------------------------- */
  _resolveDataSource(ds) {
    if (typeof ds === 'function') return ds

    if (ds && typeof ds.url === 'string') {
      return (query) => {
        const method  = (ds.method || 'GET').toUpperCase()
        const headers = { 'Content-Type': 'application/json', ...(ds.headers || {}) }
        const params  = Object.fromEntries(
          Object.entries(query).filter(([, v]) => v !== null && v !== undefined && v !== '')
        )

        if (method === 'GET') {
          const qs = new URLSearchParams(params).toString()
          return fetch(`${ds.url}?${qs}`, { method, headers })
            .then(r => { if (!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.json() })
        }
        return fetch(ds.url, { method, headers, body: JSON.stringify(params) })
          .then(r => { if (!r.ok) throw new Error(`${r.status} ${r.statusText}`); return r.json() })
      }
    }

    throw new Error('[MTS.DataTable] dataSource inválido: debe ser { url } o una función')
  }

  _buildQuery() {
    return {
      pageNumber: this._pageNum,
      pageSize:   this._pageSize,
      search:     this._search,
      orderBy:    this._orderBy  || '',
      orderDir:   this._orderDir || 'asc',
      ...this._params
    }
  }

  /* ----------------------------------------------------------
     PLUGIN SYSTEM
  ---------------------------------------------------------- */
  use(plugin) {
    if (!plugin || typeof plugin !== 'object')
      throw new Error('[MTS.DataTable] Plugin inválido: debe ser una instancia de clase')

    const d = plugin.constructor?.descriptor
    if (!d)       throw new Error('[MTS.DataTable] Plugin inválido: falta static descriptor')
    if (!d.name)  throw new Error('[MTS.DataTable] Plugin inválido: falta descriptor.name')
    if (!d.requires) throw new Error('[MTS.DataTable] Plugin inválido: falta descriptor.requires')
    const reqList = Array.isArray(d.requires) ? d.requires : [d.requires]
    if (!reqList.includes('MTS.DataTable'))
      throw new Error(`[MTS.DataTable] Plugin incompatible: requires="${d.requires}"`)
    if (typeof plugin.install   !== 'function') throw new Error(`[MTS.DataTable] "${d.name}": falta install()`)
    if (typeof plugin.uninstall !== 'function') throw new Error(`[MTS.DataTable] "${d.name}": falta uninstall()`)

    if (this._plugins.has(d.name)) {
      console.warn(`[MTS.DataTable] Plugin ya instalado, ignorando: ${d.name}`)
      return this
    }

    plugin.install(this)
    this._plugins.set(d.name, plugin)
    this._log('[plugin] instalado:', d.name, 'v' + d.version)
    return this
  }

  remove(pluginName) {
    const plugin = this._plugins.get(pluginName)
    if (!plugin) return this
    plugin.uninstall(this)
    this._plugins.delete(pluginName)
    this._log('[plugin] desinstalado:', pluginName)
    return this
  }

  /* ----------------------------------------------------------
     EVENTOS onXXXX
  ---------------------------------------------------------- */
  _assignHandlers(cfg) {
    [
      'onReady', 'onBeforeLoad', 'onAfterLoad', 'onLoadError',
      'onRowRender', 'onRowRendered',
      'onSelectionChange', 'onRowSelect', 'onRowDeselect',
      'onPageChange', 'onSortChange', 'onSearchChange',
      'onRowDragStart', 'onRowDrop'
    ].forEach(h => { if (typeof cfg[h] === 'function') this[h] = cfg[h] })
  }

  _emit(name, ...args) {
    if (this.debug) {
      const payload = args.length === 0 ? '' : args.length === 1 ? args[0] : args
      this._log('[event]', name, '→', payload)
    }
    /* Callback del dev (asignado en config o vía _assignHandlers) */
    if (typeof this[name] === 'function') this[name](...args)
    /* Hooks de plugins — múltiples listeners, orden de registro */
    this._hooks[name]?.forEach(fn => { try { fn(...args) } catch (e) { console.error(`[MTS.DataTable] Hook ${name}:`, e) } })
  }

  _log(...args) { if (this.debug) console.log('[MTS.DataTable]', ...args) }

  /* ----------------------------------------------------------
     CICLO DE DATOS
  ---------------------------------------------------------- */
  _consumeData() {
    if (this._destroyed) return

    const query = this._buildQuery()
    this._log('[load] query →', query)
    this._emit('onBeforeLoad', query)
    this._showLoading()

    this._dataFn(query)
      .then(result => {
        this._log('[load] resultado → total:', result.total, '| página:', result.pageNumber, '/', result.totalPages)
        this._emit('onAfterLoad', result)
        this._renderGrid(result)
      })
      .catch(err => {
        this._log('[load] error →', err.message, err)
        console.error('[MTS.DataTable]', err)
        this._emit('onLoadError', err)
        this._renderError(err)
      })
  }

  /* ----------------------------------------------------------
     RENDER — GRID COMPLETO
     El toolbar se monta una sola vez y permanece entre renders.
     Solo se reemplazan _contentEl (tabla / empty) y _footerEl (paginación).
  ---------------------------------------------------------- */
  _renderGrid(result) {
    this._lastResult = result
    this._selectInstance?.destroy()
    this._selectInstance = null

    this._el.classList.add('mts-dt')

    /* ── Toolbar — montar una vez, nunca destruir ── */
    const needsToolbar = this._cfg.search.enabled    || !!this._toolbarBreadcrumbEl ||
                         !!this._toolbarLeftEl        || !!this._toolbarFilterEl     ||
                         !!this._toolbarActionsEl
    if (needsToolbar && !this._toolbarEl?.isConnected) {
      this._toolbarEl = this._buildToolbar()
      this._el.insertBefore(this._toolbarEl, this._el.firstChild)
    } else if (!needsToolbar && this._toolbarEl?.isConnected) {
      this._toolbarEl.remove()
      this._toolbarEl = null
    }
    /* Sincronizar valor del input de búsqueda (cambios externos via setSearch) */
    if (this._toolbarEl) {
      const inp = this._toolbarEl.querySelector('.mts-input')
      if (inp && inp.value !== this._search) inp.value = this._search
    }

    /* ── Contenido — construir primero, reemplazar atómicamente ── */
    const hasData    = Array.isArray(result.data) && result.data.length > 0
    const newContent = hasData ? this._buildTableWrapper(result.data) : this._buildEmpty()

    /* Aplicar min-height ANTES de insertar — el wrapper ya sabe su tamaño mínimo */
    if (hasData && this._tableWrapHeight && !this._cfg.fixedHeader) {
      newContent.style.minHeight = this._tableWrapHeight + 'px'
    }

    if (this._contentEl?.isConnected) {
      this._contentEl.replaceWith(newContent)
    } else {
      this._el.appendChild(newContent)
    }
    this._contentEl = newContent

    /* Medir el alto del wrapper una vez cuando tiene la página completa.
       offsetHeight es síncrono aquí porque el elemento ya está en el DOM.
       Se resetea al cambiar pageSize (ver _buildPagination onChange). */
    if (hasData && !this._tableWrapHeight && !this._cfg.fixedHeader &&
        result.data.length >= this._pageSize) {
      this._tableWrapHeight = newContent.offsetHeight
      newContent.style.minHeight = this._tableWrapHeight + 'px'
      this._log('[tableWrap] altura fijada:', this._tableWrapHeight + 'px')
    }

    /* ── Footer — construir primero, reemplazar atómicamente ── */
    let newFooter = null
    if (hasData) {
      const showPagination = result.totalPages > 0 &&
        (result.totalPages > 1 || this._cfg.pagination.pageSizeOptions?.length)
      if (showPagination) newFooter = this._buildPagination(result)
    }

    if (this._footerEl?.isConnected) {
      if (newFooter) this._footerEl.replaceWith(newFooter)
      else           this._footerEl.remove()
    } else if (newFooter) {
      this._el.appendChild(newFooter)
    }
    this._footerEl = newFooter

    /* Ocultar overlay DESPUÉS de que el nuevo contenido ya está en el DOM → sin flash */
    this._hideLoading()

    this._emit('onReady')
  }

  /* ----------------------------------------------------------
     RENDER — TOOLBAR
  ---------------------------------------------------------- */
  _buildToolbar() {
    const hasBreadcrumb = !!this._toolbarBreadcrumbEl
    const hasLeft       = !!this._toolbarLeftEl
    const twoRows       = hasBreadcrumb && hasLeft

    const toolbar = document.createElement('div')
    toolbar.className = twoRows ? 'mts-dt-toolbar mts-dt-toolbar--two-row' : 'mts-dt-toolbar'

    if (twoRows) {
      /* ── Fila 1: breadcrumb a ancho completo ── */
      const row1 = document.createElement('div')
      row1.className = 'mts-dt-toolbar__row mts-dt-toolbar__row--breadcrumb'
      row1.appendChild(this._toolbarBreadcrumbEl)
      toolbar.appendChild(row1)

      /* ── Fila 2: botones · filtro · spacer · búsqueda · acciones ── */
      const row2 = document.createElement('div')
      row2.className = 'mts-dt-toolbar__row mts-dt-toolbar__row--main'
      row2.appendChild(this._toolbarLeftEl)
      if (this._toolbarFilterEl)    row2.appendChild(this._toolbarFilterEl)
      const spacer2 = document.createElement('div')
      spacer2.className = 'mts-dt-toolbar__spacer'
      row2.appendChild(spacer2)
      if (this._cfg.search.enabled) row2.appendChild(this._buildSearch())
      if (this._toolbarActionsEl)   row2.appendChild(this._toolbarActionsEl)
      toolbar.appendChild(row2)

    } else {
      /* ── Fila única (comportamiento estándar) ── */
      const leftEl = this._toolbarBreadcrumbEl || this._toolbarLeftEl
      if (leftEl)                   toolbar.appendChild(leftEl)
      if (this._toolbarFilterEl)    toolbar.appendChild(this._toolbarFilterEl)
      const spacer = document.createElement('div')
      spacer.className = 'mts-dt-toolbar__spacer'
      toolbar.appendChild(spacer)
      if (this._cfg.search.enabled) toolbar.appendChild(this._buildSearch())
      if (this._toolbarActionsEl)   toolbar.appendChild(this._toolbarActionsEl)
    }

    return toolbar
  }

  /* Reconstruye el toolbar en caliente cuando cambia algún slot */
  _refreshToolbar() {
    if (!this._toolbarEl?.isConnected) return
    const needsToolbar = this._cfg.search.enabled    || !!this._toolbarBreadcrumbEl ||
                         !!this._toolbarLeftEl        || !!this._toolbarFilterEl     ||
                         !!this._toolbarActionsEl
    if (needsToolbar) {
      const newToolbar = this._buildToolbar()
      this._toolbarEl.replaceWith(newToolbar)
      this._toolbarEl = newToolbar
    } else {
      this._toolbarEl.remove()
      this._toolbarEl = null
    }
  }

  _buildSearch() {
    const wrap = document.createElement('div')
    wrap.className = 'mts-input-wrap mts-input-wrap--icon-right'
    if (this._cfg.search.width) wrap.style.width = this._cfg.search.width

    const input = document.createElement('input')
    input.type         = 'text'
    input.className    = 'mts-input'
    input.placeholder  = this._cfg.texts.search
    input.value        = this._search
    input.autocomplete = 'off'

    const clear = document.createElement('button')
    clear.type      = 'button'
    clear.className = 'mts-input__icon mts-input__icon--right mts-input__clear'
    clear.innerHTML = '&times;'
    clear.style.display = this._search ? 'flex' : 'none'

    input.addEventListener('focus', () => wrap.classList.add('mts-input-wrap--focus'))
    input.addEventListener('blur',  () => wrap.classList.remove('mts-input-wrap--focus'))

    input.addEventListener('input', () => {
      const val = input.value
      clear.style.display = val ? 'flex' : 'none'
      if (val.length >= this._cfg.search.minChars || val.length === 0) {
        this._log('[search] input →', JSON.stringify(val), `(minChars: ${this._cfg.search.minChars})`)
        this._search  = val
        this._pageNum = 1
        this._emit('onSearchChange', val)
        if (this._cfg.persist.enabled) this._persistState()
        this._consumeData()
      } else {
        this._log('[search] input ignorado →', JSON.stringify(val), `(< minChars: ${this._cfg.search.minChars})`)
      }
    })

    clear.addEventListener('click', () => {
      this._log('[search] clear')
      input.value = ''
      clear.style.display = 'none'
      wrap.classList.remove('mts-input-wrap--focus')
      this._search  = ''
      this._pageNum = 1
      this._emit('onSearchChange', '')
      if (this._cfg.persist.enabled) this._persistState()
      this._consumeData()
    })

    wrap.appendChild(input)
    wrap.appendChild(clear)
    return wrap
  }

  /* ----------------------------------------------------------
     RENDER — TABLA
  ---------------------------------------------------------- */
  _buildTableWrapper(data) {
    const wrap = document.createElement('div')
    wrap.className = 'mts-table-wrap'
    if (this._cfg.fixedHeader) {
      /* height fijo — no maxHeight — para que el wrapper siempre ocupe
         exactamente fixedHeaderHeight y el footer nunca suba ni baje */
      wrap.style.height    = this._cfg.fixedHeaderHeight
      wrap.style.overflowY = 'auto'
    }

    const table = document.createElement('table')
    table.className = 'mts-table'
    if (this._cfg.hover)       table.classList.add('mts-table--hover')
    if (this._cfg.striped)     table.classList.add('mts-table--striped')
    if (this._cfg.bordered)    table.classList.add('mts-table--bordered')
    if (this._cfg.compact)     table.classList.add('mts-table--compact')
    if (this._cfg.fixedHeader) table.classList.add('mts-table--fixed')

    table.appendChild(this._buildHeader())
    table.appendChild(this._buildBody(data))
    wrap.appendChild(table)
    return wrap
  }

  _buildHeader() {
    const thead = document.createElement('thead')
    const row   = document.createElement('tr')
    row.className = 'mts-table__row'

    if (this._cfg.selection.mode === 'multi' && this._cfg.selection.checkboxes) {
      const th = document.createElement('th')
      th.className = 'mts-table__th mts-table__th--check'
      const cb = document.createElement('input')
      cb.type      = 'checkbox'
      cb.className = 'mts-checkbox'
      cb.addEventListener('change', () => this._toggleSelectAll(cb.checked))
      this._selectAllEl = cb
      th.appendChild(cb)
      row.appendChild(th)
    }

    this._cfg.columns.forEach(col => {
      const th = document.createElement('th')
      th.className = 'mts-table__th'
      if (col.align === 'center') th.classList.add('mts-table__th--center')
      if (col.align === 'end')    th.classList.add('mts-table__th--end')
      if (col.width) th.style.width = col.width

      if (col.sortable) {
        th.classList.add('mts-table__th--sortable')
        if (this._orderBy === col.field) {
          th.classList.add(this._orderDir === 'asc' ? 'mts-table__th--asc' : 'mts-table__th--desc')
        }
        th.addEventListener('click', () => this._handleSort(col.field))
      }

      const label = document.createElement('span')
      label.textContent = col.label || ''
      th.appendChild(label)

      if (col.sortable) {
        const sort = document.createElement('span')
        sort.className = 'mts-table__sort'
        sort.innerHTML = '<span class="mts-table__sort-up"></span><span class="mts-table__sort-down"></span>'
        th.appendChild(sort)
      }

      row.appendChild(th)
    })

    thead.appendChild(row)
    return thead
  }

  _buildBody(data) {
    this._currentData = data
    const tbody = document.createElement('tbody')
    const frag  = document.createDocumentFragment()
    data.forEach((item, index) => frag.appendChild(this._buildRow(item, index)))
    tbody.appendChild(frag)
    return tbody
  }

  _buildRow(item, index) {
    const row = document.createElement('tr')
    row.className = 'mts-table__row'
    if (this._cfg.rowClass) {
      const extra = this._cfg.rowClass(item)
      if (extra) row.classList.add(...extra.trim().split(/\s+/))
    }

    const rowId = this._cfg.rowId ? item[this._cfg.rowId] : index
    row.dataset.id = rowId

    // Persiste todos los campos del item como data-* para acceso desde plugins
    Object.entries(item).forEach(([key, val]) => {
      if (val === null || val === undefined) row.dataset[key] = 'null'
      else if (typeof val === 'object')     row.dataset[key] = JSON.stringify(val)
      else                                  row.dataset[key] = val
    })

    if (this._cfg.selection.mode === 'multi' && this._cfg.selection.checkboxes) {
      const td = document.createElement('td')
      td.className = 'mts-table__td mts-table__td--check'
      const cb = document.createElement('input')
      cb.type      = 'checkbox'
      cb.className = 'mts-checkbox'
      cb.checked   = this._selectedIds.has(rowId)
      cb.addEventListener('change', () => this._toggleRowSelection(row, item, rowId, cb.checked))
      td.appendChild(cb)
      row.appendChild(td)
    }

    if (this._cfg.selection.mode !== 'none') {
      row.classList.add('mts-table__row--clickable')
      if (this._selectedIds.has(rowId)) row.classList.add('mts-table__row--selected')
      row.addEventListener('click', e => {
        if (e.target.type === 'checkbox') return
        this._handleRowClick(row, item, rowId)
      })
    }

    if (this._cfg.dragDrop.enabled) {
      row.setAttribute('draggable', 'true')
      this._enableDragDrop(row, item, index)
    }

    this._cfg.columns.forEach(col => {
      const td = document.createElement('td')
      td.className = 'mts-table__td'
      if (col.align === 'center') td.classList.add('mts-table__td--center')
      if (col.align === 'end')    td.classList.add('mts-table__td--end')
      if (col.label) td.setAttribute('data-label', col.label)

      if (typeof col.render === 'function') {
        const result = col.render(col.field ? item[col.field] : item, item, td)
        if (typeof result === 'string') td.innerHTML = result
      } else {
        const val = col.field ? item[col.field] : ''
        td.textContent = (val !== null && val !== undefined) ? String(val) : ''
      }

      this._emit('onRowRender', td, item, col)
      row.appendChild(td)
    })

    this._emit('onRowRendered', row, item)
    return row
  }

  _buildEmpty() {
    const wrap  = document.createElement('div')
    wrap.className = 'mts-table-wrap'
    /* Igual que _buildTableWrapper: con fixedHeader el wrapper debe ocupar
       fixedHeaderHeight también en el empty-state, para que el layout no
       colapse ni "salte" al alternar entre estados con/sin datos. */
    if (this._cfg.fixedHeader) {
      wrap.style.height    = this._cfg.fixedHeaderHeight
      wrap.style.overflowY = 'auto'
    }
    const table = document.createElement('table')
    table.className = 'mts-table'
    if (this._cfg.fixedHeader) table.classList.add('mts-table--fixed')
    table.appendChild(this._buildHeader())
    const tbody = document.createElement('tbody')
    const row   = document.createElement('tr')
    const td    = document.createElement('td')
    const cols  = this._cfg.columns.length +
      (this._cfg.selection.mode === 'multi' && this._cfg.selection.checkboxes ? 1 : 0)
    td.colSpan   = cols
    td.className = 'mts-table__td mts-table__empty'

    const icon  = document.createElement('span')
    icon.className   = 'mts-table__empty-icon'
    icon.textContent = '○'

    const title = document.createElement('span')
    title.className   = 'mts-table__empty-title'
    title.textContent = this._cfg.texts.noData

    td.appendChild(icon)
    td.appendChild(title)
    row.appendChild(td)
    tbody.appendChild(row)
    table.appendChild(tbody)
    wrap.appendChild(table)
    return wrap
  }

  /* ----------------------------------------------------------
     RENDER — PAGINACIÓN
  ---------------------------------------------------------- */
  _buildPagination(result) {
    const { total, totalPages } = result
    const start = (this._pageNum - 1) * this._pageSize + 1
    const end   = Math.min(this._pageNum * this._pageSize, total)

    // El wrapper es directamente el footer — no usa .mts-pagination
    // para evitar conflictos de layout con otros componentes dentro de él.
    const footer = document.createElement('div')
    footer.className = 'mts-dt-footer'

    const info = document.createElement('span')
    info.className   = 'mts-dt-footer__info'
    info.textContent = this._cfg.texts.showing
      .replace('{start}', start)
      .replace('{end}',   end)
      .replace('{total}', total)
    footer.appendChild(info)

    const controls = document.createElement('div')
    controls.className = 'mts-dt-footer__controls'

    if (this._cfg.pagination.pageSizeOptions?.length) {
      const lbl = document.createElement('span')
      lbl.className   = 'mts-dt-footer__label'
      lbl.textContent = this._cfg.texts.perPage

      const selectWrap = document.createElement('div')
      selectWrap.className = 'mts-dt-size-select'

      controls.appendChild(lbl)
      controls.appendChild(selectWrap)

      if (typeof MTS?.Select === 'function') {
        this._selectInstance = new MTS.Select(selectWrap, {
          options:  this._cfg.pagination.pageSizeOptions.map(n => ({ value: String(n), label: String(n) })),
          value:    String(this._pageSize),
          label:    '',
          onChange: (e) => {
            this._pageSize        = parseInt(e?.detail?.value ?? e, 10)
            this._pageNum         = 1
            this._tableWrapHeight = null   // re-medir con el nuevo pageSize
            this._log('[pageSize] cambiado a', this._pageSize)
            if (this._cfg.persist.enabled) this._persistState()
            this._consumeData()
          }
        })
      }
    }

    if (totalPages > 1) {
      const nav = document.createElement('nav')
      nav.className = 'mts-dt-footer__nav'

      nav.appendChild(this._buildPageBtn(this._cfg.texts.previous, this._pageNum - 1, this._pageNum <= 1))

      this._paginationWindow(this._pageNum, totalPages).forEach(p => {
        if (p === '...') {
          const btn = document.createElement('button')
          btn.type        = 'button'
          btn.className   = 'mts-pagination__btn mts-pagination__btn--ellipsis'
          btn.textContent = '…'
          btn.disabled    = true
          nav.appendChild(btn)
        } else {
          nav.appendChild(this._buildPageBtn(p, p, false, p === this._pageNum))
        }
      })

      nav.appendChild(this._buildPageBtn(this._cfg.texts.next, this._pageNum + 1, this._pageNum >= totalPages))
      controls.appendChild(nav)
    }

    footer.appendChild(controls)
    return footer
  }

  _buildPageBtn(label, page, disabled = false, active = false) {
    const btn = document.createElement('button')
    btn.type      = 'button'
    btn.className = 'mts-pagination__btn'
    if (active) btn.classList.add('mts-pagination__btn--active')
    btn.textContent = label
    btn.disabled    = disabled
    if (!disabled && !active) btn.addEventListener('click', () => this.goToPage(page))
    return btn
  }

  _paginationWindow(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const pages = [1]
    if (current > 3)          pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
    if (current < total - 2)  pages.push('...')
    pages.push(total)
    return pages
  }

  /* ----------------------------------------------------------
     ESTADOS — loading / error
  ---------------------------------------------------------- */
  _showLoading() {
    this._el.querySelector('.mts-dt-overlay')?.remove()
    const overlay = document.createElement('div')
    overlay.className = 'mts-dt-overlay mts-dt-overlay--loading'
    const spinner = document.createElement('div')
    spinner.className = 'mts-dt-spinner'
    const text = document.createElement('span')
    text.className   = 'mts-dt-overlay__text'
    text.textContent = this._cfg.texts.loading
    overlay.appendChild(spinner)
    overlay.appendChild(text)
    this._el.style.position = 'relative'
    this._el.appendChild(overlay)
  }

  _hideLoading() {
    this._el.querySelector('.mts-dt-overlay')?.remove()
  }

  _renderError(err) {
    this._hideLoading()

    /* Reemplazar solo el contenido — el toolbar permanece */
    this._contentEl?.remove()
    this._footerEl?.remove()
    this._footerEl = null

    const wrap  = document.createElement('div')
    wrap.className = 'mts-dt-error'

    const msg = document.createElement('p')
    msg.className   = 'mts-dt-error__msg'
    msg.textContent = this._cfg.texts.error

    const retry = document.createElement('button')
    retry.type      = 'button'
    retry.className = 'mts-dt-error__retry'
    retry.textContent = this._cfg.texts.retry
    retry.addEventListener('click', () => this._consumeData())

    wrap.appendChild(msg)
    wrap.appendChild(retry)
    this._contentEl = wrap
    this._el.appendChild(this._contentEl)
  }

  /* ----------------------------------------------------------
     SORT
  ---------------------------------------------------------- */
  _handleSort(column) {
    this._orderDir = this._orderBy === column
      ? (this._orderDir === 'asc' ? 'desc' : 'asc')
      : 'asc'
    this._orderBy  = column
    this._pageNum  = 1
    this._log('[sort] column:', this._orderBy, '| dir:', this._orderDir)
    this._emit('onSortChange', this._orderBy, this._orderDir)
    this._consumeData()
  }

  /* ----------------------------------------------------------
     SELECCIÓN
  ---------------------------------------------------------- */
  _handleRowClick(row, item, rowId) {
    this._log('[row] click → id:', rowId, '| item:', item)
    if (this._cfg.selection.mode === 'single') {
      const wasSelected = this._selectedIds.has(rowId)
      this._clearAllSelections(true)   // silent: el emit final lo hace _handleRowClick
      if (!wasSelected) {
        this._selectedIds.add(rowId)
        row.classList.add('mts-table__row--selected')
        this._emit('onRowSelect', item, this._getSelectedItems())
      }
    } else if (this._cfg.selection.mode === 'multi') {
      this._toggleRowSelection(row, item, rowId)
    }
    this._emit('onSelectionChange', this._getSelectedItems())
  }

  _toggleRowSelection(row, item, rowId, forceSelect) {
    const isSelected = this._selectedIds.has(rowId)
    const select     = forceSelect !== undefined ? forceSelect : !isSelected

    if (select && !isSelected) {
      this._log('[selection] seleccionado → id:', rowId)
      this._selectedIds.add(rowId)
      row.classList.add('mts-table__row--selected')
      const cb = row.querySelector('.mts-checkbox')
      if (cb) cb.checked = true
      this._emit('onRowSelect', item, this._getSelectedItems())
    } else if (!select && isSelected) {
      this._log('[selection] deseleccionado → id:', rowId)
      this._selectedIds.delete(rowId)
      row.classList.remove('mts-table__row--selected')
      const cb = row.querySelector('.mts-checkbox')
      if (cb) cb.checked = false
      this._emit('onRowDeselect', item, this._getSelectedItems())
    }

    this._emit('onSelectionChange', this._getSelectedItems())
    this._updateSelectAll()
  }

  _clearAllSelections(silent = false) {
    this._log('[selection] limpiar todo')
    this._el.querySelectorAll('.mts-table__row--selected').forEach(r => r.classList.remove('mts-table__row--selected'))
    this._el.querySelectorAll('tbody .mts-checkbox').forEach(cb => cb.checked = false)
    this._selectedIds.clear()
    if (this._selectAllEl) { this._selectAllEl.checked = false; this._selectAllEl.indeterminate = false }
    if (!silent) this._emit('onSelectionChange', [])
  }

  _toggleSelectAll(checked) {
    this._log('[selection] selectAll →', checked)
    this._currentData.forEach((item, index) => {
      const rowId = this._cfg.rowId ? item[this._cfg.rowId] : index
      checked ? this._selectedIds.add(rowId) : this._selectedIds.delete(rowId)
    })
    this._el.querySelectorAll('tbody .mts-table__row').forEach(row => {
      row.classList.toggle('mts-table__row--selected', checked)
      const cb = row.querySelector('.mts-checkbox')
      if (cb) cb.checked = checked
    })
    this._emit('onSelectionChange', this._getSelectedItems())
  }

  _updateSelectAll() {
    if (!this._selectAllEl) return
    const cbs     = [...this._el.querySelectorAll('tbody .mts-checkbox')]
    const checked = cbs.filter(cb => cb.checked).length
    this._selectAllEl.checked       = checked === cbs.length && cbs.length > 0
    this._selectAllEl.indeterminate = checked > 0 && checked < cbs.length
  }

  _getSelectedItems() {
    if (!this._cfg.rowId || !this._currentData) return []
    return this._currentData.filter(i => this._selectedIds.has(i[this._cfg.rowId]))
  }

  /* ----------------------------------------------------------
     DRAG & DROP
  ---------------------------------------------------------- */
  _enableDragDrop(row, item, index) {
    row.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', String(index))
      row.classList.add('mts-table__row--dragging')
      this._dragIndex = index
      this._dragItem  = item
      this._log('[drag] start → index:', index, '| item:', item)
      this._emit('onRowDragStart', item, index)
    })

    row.addEventListener('dragover', e => {
      e.preventDefault()
      row.classList.add('mts-table__row--drag-over')
    })

    row.addEventListener('dragleave', () => row.classList.remove('mts-table__row--drag-over'))

    row.addEventListener('drop', e => {
      e.preventDefault()
      row.classList.remove('mts-table__row--drag-over')
      if (this._dragIndex === undefined || this._dragIndex === index) return
      this._log('[drag] drop → de index:', this._dragIndex, '→ index:', index)
      this._emit('onRowDrop', this._dragItem, item, this._dragIndex, index)
      this._dragIndex = undefined
      this._dragItem  = undefined
    })

    row.addEventListener('dragend', () => {
      row.classList.remove('mts-table__row--dragging')
      this._el.querySelectorAll('.mts-table__row--drag-over').forEach(r => r.classList.remove('mts-table__row--drag-over'))
    })
  }

  /* ----------------------------------------------------------
     LOCALSTORAGE
  ---------------------------------------------------------- */
  _persistState() {
    if (!this._cfg.persist.key) return
    this._log('[persist] guardando estado → key:', this._cfg.persist.key)
    try {
      localStorage.setItem(this._cfg.persist.key, JSON.stringify({
        pageSize: this._pageSize,
        pageNum:  this._pageNum,
        search:   this._search,
        orderBy:  this._orderBy,
        orderDir: this._orderDir,
      }))
    } catch (e) { console.warn('[MTS.DataTable] No se pudo persistir estado:', e) }
  }

  _restoreState() {
    if (!this._cfg.persist.key) return
    try {
      const raw = localStorage.getItem(this._cfg.persist.key)
      if (!raw) { this._log('[persist] no hay estado guardado → key:', this._cfg.persist.key); return }
      const s = JSON.parse(raw)
      this._log('[persist] restaurando estado →', s)
      if (s.pageSize) this._pageSize = s.pageSize
      if (s.pageNum)  this._pageNum  = s.pageNum
      if (s.search  !== undefined) this._search  = s.search
      if (s.orderBy)  this._orderBy  = s.orderBy
      if (s.orderDir) this._orderDir = s.orderDir
    } catch (e) { console.warn('[MTS.DataTable] No se pudo restaurar estado:', e) }
  }

  _clearPersistedState() {
    if (this._cfg.persist.key) localStorage.removeItem(this._cfg.persist.key)
  }

  /* ----------------------------------------------------------
     API PÚBLICA
  ---------------------------------------------------------- */
  load() {
    this._log('[api] load()')
    this._pageNum = 1
    this._consumeData()
    return this
  }

  reload() {
    this._log('[api] reload()')
    this._consumeData()
    return this
  }

  goToPage(n) {
    this._log('[api] goToPage(', n, ')')
    this._pageNum = n
    this._emit('onPageChange', n, this._buildQuery())
    if (this._cfg.persist.enabled) this._persistState()
    this._consumeData()
    return this
  }

  setSearch(text) {
    this._log('[api] setSearch(', text, ')')
    this._search  = text
    this._pageNum = 1
    this._emit('onSearchChange', text)
    this._consumeData()
    return this
  }

  setParams(params) {
    this._log('[api] setParams(', params, ') → params resultantes:', { ...this._params, ...params })
    this._params = { ...this._params, ...params }
    return this
  }

  setToolbarBreadcrumb(el) {
    this._log('[api] setToolbarBreadcrumb(', el?.className ?? null, ')')
    this._toolbarBreadcrumbEl = el || null
    this._refreshToolbar()
    return this
  }

  setToolbarLeft(el) {
    this._log('[api] setToolbarLeft(', el?.className ?? null, ')')
    this._toolbarLeftEl = el || null
    this._refreshToolbar()
    return this
  }

  setToolbarFilter(el) {
    this._log('[api] setToolbarFilter(', el?.className ?? null, ')')
    this._toolbarFilterEl = el || null
    this._refreshToolbar()
    return this
  }

  setToolbarActions(el) {
    this._log('[api] setToolbarActions(', el?.className ?? null, ')')
    this._toolbarActionsEl = el || null
    this._refreshToolbar()
    return this
  }

  clearParams(...keys) {
    const arr = keys.flat()
    arr.forEach(k => delete this._params[k])
    this._log('[api] clearParams(', arr, ')')
    return this
  }

  /* Registro de hooks para plugins — alternativa limpia al monkey-patch de onXxx.
     Permite múltiples listeners por evento y desinstalación individual. */
  getPlugin(name) {
    return this._plugins.get(name) ?? null
  }

  registerHook(name, fn) {
    if (typeof fn !== 'function') return this
    if (!this._hooks[name]) this._hooks[name] = []
    this._hooks[name].push(fn)
    return this
  }

  unregisterHook(name, fn) {
    if (!this._hooks[name]) return this
    this._hooks[name] = this._hooks[name].filter(h => h !== fn)
    return this
  }

  /* Re-renderiza la tabla con el último resultado sin llamar al API.
     Útil para cambios puramente visuales (visibilidad de columnas, etc.) */
  redraw() {
    this._log('[api] redraw()')
    if (this._lastResult) this._renderGrid(this._lastResult)
    return this
  }

  getSelection() {
    return this._getSelectedItems()
  }

  clearSelection() {
    this._log('[api] clearSelection()')
    this._clearAllSelections()
    return this
  }

  selectRow(id) {
    this._log('[api] selectRow(', id, ')')
    if (!this._cfg.rowId || !this._currentData) return this
    const item = this._currentData.find(i => i[this._cfg.rowId] === id)
    if (!item) { this._log('[api] selectRow — id no encontrado en página actual:', id); return this }
    const row = this._el.querySelector(`tr[data-id="${id}"]`)
    if (row) this._toggleRowSelection(row, item, id, true)
    return this
  }

  deselectRow(id) {
    this._log('[api] deselectRow(', id, ')')
    if (!this._cfg.rowId || !this._currentData) return this
    const item = this._currentData.find(i => i[this._cfg.rowId] === id)
    if (!item) { this._log('[api] deselectRow — id no encontrado en página actual:', id); return this }
    const row = this._el.querySelector(`tr[data-id="${id}"]`)
    if (row) this._toggleRowSelection(row, item, id, false)
    return this
  }

  destroy() {
    this._log('[api] destroy() — plugins instalados:', this._plugins.size)
    this._destroyed = true
    this._selectInstance?.destroy()
    this._selectInstance = null
    this._plugins.forEach(p => p.uninstall(this))
    this._plugins.clear()
    this._el.replaceChildren()
    this._el.classList.remove('mts-dt')
    this._toolbarEl        = null
    this._contentEl        = null
    this._footerEl         = null
    this._tableWrapHeight  = null
    this._lastResult       = null
    this._toolbarBreadcrumbEl = null
    this._toolbarLeftEl       = null
    this._toolbarFilterEl     = null
    this._toolbarActionsEl    = null
    this._log('[api] destroy() completo')
  }
}
