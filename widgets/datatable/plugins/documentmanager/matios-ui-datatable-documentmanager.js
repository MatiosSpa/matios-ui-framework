/* ============================================================
   MATIOS UI — MTS.DocumentManagerPlugin  v3.5.0
   Plugin de gestión de documentos para MTS.DataTable.

   Funcionalidades:
     - Breadcrumb de navegación (slot izquierdo del toolbar)
     - Zonas de clic diferenciadas por área:
         nombre/icono  → carpeta: navega | archivo: onFileClick
         resto de fila → selección manejada por el DataTable (selection.mode)
     - Drag & Drop folder-aware: arrastrar item sobre carpeta → onDrop
     - Dropzone externo: arrastrar archivos del OS sobre la tabla → onFileDrop
     - Sistema de sub-plugins: plugins: [...]
         Cada sub-plugin recibe install(dm) — el DM es el host.

   La selección (single/multi) se configura en el DataTable:
     selection: { mode: 'multi' }   — sin checkboxes
     selection: { mode: 'single' }  — una sola fila

   Opciones:
     new MTS.DocumentManagerPlugin({
       rootLabel:    'Documentos',
       breadcrumb:   true,
       dragDrop:     false,

       // Dropzone externo — archivos del OS arrastrados sobre la tabla
       dropzone:     false,
       onFileDrop:   (files, folder) => {},   // files: File[], folder: item|null

       // Restricciones de archivo — aplicadas en dropzone Y en el modal de upload
       accept:        '*',       // extensiones/MIME aceptados, ej: '.pdf,.docx,image/*'
       multiple:      true,      // permite seleccionar varios archivos
       maxFiles:      null,      // nº máximo de archivos por subida (null = sin límite)
       maxFileSizeMB: null,      // peso máximo por archivo en MB (null = sin límite)

       // Política cuando un archivo ya existe (requiere uploadCheck.onCheckFileExists)
       //   'ask'     → muestra botones por archivo: Reemplazar / Nueva versión / Omitir
       //   'replace' → reemplaza automáticamente sin preguntar
       //   'version' → crea nueva versión automáticamente sin preguntar
       //   'skip'    → omite el archivo automáticamente sin preguntar
       onFileExists:  'ask',

       // Ciclo de vida de upload — consumidos por DocumentManagerUploadPlugin
       onUpload:     async (file, folder, { action, currentVersion }) => {},  // HTTP por archivo
       onUploaded:   (files, folder) => {},          // éxito total
       onError:      (err, file, folder) => {},      // error por archivo

       onFileClick:  (item) => {},
       onDrop:       (items, targetFolder) => {},
       plugins:      [dmContextMenu, ...],
     })
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DocumentManagerPlugin = class DocumentManagerPlugin {

  static descriptor = {
    name:     'MTS.DocumentManagerPlugin',
    version:  '3.5.0',
    type:     'documentManager',
    requires: ['MTS.DataTable', 'MTS.Icon'],
    provides: 'documentManager',
  }

  /* ----------------------------------------------------------
     CONSTRUCTOR
  ---------------------------------------------------------- */
  constructor(options = {}) {
    this._options = {
      rootLabel:            options.rootLabel            ?? 'Documentos',
      breadcrumb:           options.breadcrumb           ?? true,
      dragDrop:             options.dragDrop             ?? false,
      dropzone:             options.dropzone             ?? false,
      // Restricciones de archivo
      accept:               options.accept               ?? '*',
      multiple:             options.multiple             ?? true,
      maxFiles:             options.maxFiles             ?? null,
      maxFileSizeMB:        options.maxFileSizeMB        ?? null,
      onFileExists:         options.onFileExists         ?? 'ask',
      // Eventos
      onFileClick:          options.onFileClick          ?? null,
      onDrop:               options.onDrop               ?? null,
      onFileDrop:           options.onFileDrop           ?? null,
      onUpload:             options.onUpload             ?? null,
      onUploaded:           options.onUploaded           ?? null,
      onError:              options.onError              ?? null,
      onContextMenuRequest: options.onContextMenuRequest ?? null,
      plugins:              options.plugins              ?? [],
    }

    this._table             = null
    this._stack             = []
    this._breadcrumbEl      = null
    this._draggedItem       = null
    this._patchedCols       = []
    this._dropzoneOverlay   = null   // overlay visual del dropzone externo
    this._externalDragCount = 0      // contador de dragenter anidados

    // Bound listeners — guardados como propiedades para poder removerlos en uninstall()
    this._onTableReadyBound    = this._onTableReady.bind(this)
    this._onNameClick          = this._onNameClick.bind(this)
    this._onContextMenu        = this._onContextMenu.bind(this)
    this._onDragStart          = this._onDragStart.bind(this)
    this._onDragOver           = this._onDragOver.bind(this)
    this._onDragLeave          = this._onDragLeave.bind(this)
    this._onDrop               = this._onDrop.bind(this)
    this._onDragEnd            = this._onDragEnd.bind(this)
    this._onExternalDragEnter  = this._onExternalDragEnter.bind(this)
    this._onExternalDragOver   = this._onExternalDragOver.bind(this)
    this._onExternalDragLeave  = this._onExternalDragLeave.bind(this)
    this._onExternalDrop       = this._onExternalDrop.bind(this)
  }

  /* ----------------------------------------------------------
     CICLO DE VIDA
  ---------------------------------------------------------- */
  install(table) {
    this._table = table

    /* Hook onReady — se registra limpiamente, sin pisar otros listeners */
    table.registerHook('onReady', this._onTableReadyBound)

    if (this._options.breadcrumb) {
      this._breadcrumbEl = document.createElement('nav')
      this._breadcrumbEl.className = 'mts-dm-breadcrumb'
      this._breadcrumbEl.setAttribute('aria-label', table._cfg?.locale?.dm?.nav ?? 'Navegación de carpetas')
      table.setToolbarBreadcrumb(this._breadcrumbEl)
      this._renderBreadcrumb()
    }

    // capture:true — se ejecuta ANTES del listener click del <tr> (selección del DataTable)
    table._el.addEventListener('click',       this._onNameClick,   { capture: true })
    table._el.addEventListener('contextmenu', this._onContextMenu)

    if (this._options.dragDrop) {
      table._el.addEventListener('dragstart', this._onDragStart)
      table._el.addEventListener('dragover',  this._onDragOver)
      table._el.addEventListener('dragleave', this._onDragLeave)
      table._el.addEventListener('drop',      this._onDrop)
      table._el.addEventListener('dragend',   this._onDragEnd)
    }

    if (this._options.dropzone) {
      table._el.addEventListener('dragenter', this._onExternalDragEnter)
      table._el.addEventListener('dragover',  this._onExternalDragOver)
      table._el.addEventListener('dragleave', this._onExternalDragLeave)
      table._el.addEventListener('drop',      this._onExternalDrop)
    }

    table.setParams({ parentId: 'null' })

    /* Parchamos columnas que usen renders estáticos para aislar el locale de esta tabla */
    const locStatus = table._cfg?.locale?.dm?.status         ?? {}
    const locWf     = table._cfg?.locale?.dm?.workflowStatus ?? {}
    ;(table._cfg?.columns ?? []).forEach(col => {
      if (col.render === MTS.DocumentManagerPlugin.renderStatus) {
        const original = col.render
        col.render = (v) => MTS.DocumentManagerPlugin._statusHtml(v, locStatus)
        this._patchedCols.push({ col, original })
      } else if (col.render === MTS.DocumentManagerPlugin.renderWorkflowStatus) {
        const original = col.render
        col.render = (v) => MTS.DocumentManagerPlugin._workflowStatusHtml(v, locWf)
        this._patchedCols.push({ col, original })
      }
    })

    /* Instalar sub-plugins — el DM es el host */
    this._options.plugins.forEach(p => {
      if (typeof p.install === 'function') p.install(this)
    })
  }

  uninstall() {
    if (!this._table) return

    /* Desinstalar sub-plugins en orden inverso */
    ;[...this._options.plugins].reverse().forEach(p => {
      if (typeof p.uninstall === 'function') p.uninstall()
    })

    this._table.unregisterHook('onReady', this._onTableReadyBound)
    this._table._el.removeEventListener('click',       this._onNameClick,   { capture: true })
    this._table._el.removeEventListener('contextmenu', this._onContextMenu)
    if (this._options.dragDrop) {
      this._table._el.removeEventListener('dragstart', this._onDragStart)
      this._table._el.removeEventListener('dragover',  this._onDragOver)
      this._table._el.removeEventListener('dragleave', this._onDragLeave)
      this._table._el.removeEventListener('drop',      this._onDrop)
      this._table._el.removeEventListener('dragend',   this._onDragEnd)
    }

    if (this._options.dropzone) {
      this._table._el.removeEventListener('dragenter', this._onExternalDragEnter)
      this._table._el.removeEventListener('dragover',  this._onExternalDragOver)
      this._table._el.removeEventListener('dragleave', this._onExternalDragLeave)
      this._table._el.removeEventListener('drop',      this._onExternalDrop)
      this._dropzoneOverlay?.remove()
      this._dropzoneOverlay   = null
      this._externalDragCount = 0
    }

    this._table.setToolbarBreadcrumb(null)
    this._breadcrumbEl = null
    this._patchedCols.forEach(({ col, original }) => { col.render = original })
    this._patchedCols  = []
    this._table        = null
  }

  /* ----------------------------------------------------------
     POST-RENDER — setea atributos tras cada rebuild del DOM
  ---------------------------------------------------------- */
  _onTableReady() {
    if (!this._options.dragDrop) return
    this._table?._el.querySelectorAll('tr.mts-table__row[data-id]').forEach(row => {
      row.setAttribute('draggable', 'true')
    })
  }

  /* ----------------------------------------------------------
     NAVEGACIÓN
  ---------------------------------------------------------- */
  _navigateTo(folderId, folderName) {
    this._stack.push({ id: folderId, name: folderName })
    this._table.setParams({ parentId: folderId })
    this._renderBreadcrumb()
    this._table.load()
  }

  _navigateToIndex(index) {
    if (index < 0) {
      this._stack = []
      this._table.setParams({ parentId: 'null' })
    } else {
      this._stack = this._stack.slice(0, index + 1)
      this._table.setParams({ parentId: this._stack[index].id })
    }
    this._renderBreadcrumb()
    this._table.load()
  }

  /* ----------------------------------------------------------
     BREADCRUMB
  ---------------------------------------------------------- */
  _renderBreadcrumb() {
    const el = this._breadcrumbEl
    if (!el) return
    el.replaceChildren()

    const isRoot  = this._stack.length === 0
    const rootBtn = this._makeBreadcrumbBtn(this._options.rootLabel, 'folder', isRoot)
    if (!isRoot) rootBtn.addEventListener('click', () => this._navigateToIndex(-1))
    el.appendChild(rootBtn)

    this._stack.forEach((folder, idx) => {
      const sep = document.createElement('span')
      sep.className   = 'mts-dm-breadcrumb__sep'
      sep.textContent = '/'
      sep.setAttribute('aria-hidden', 'true')
      el.appendChild(sep)

      const isLast = idx === this._stack.length - 1
      const btn    = this._makeBreadcrumbBtn(folder.name, 'folder', isLast)
      if (!isLast) btn.addEventListener('click', () => this._navigateToIndex(idx))
      el.appendChild(btn)
    })
  }

  _makeBreadcrumbBtn(label, iconName, isActive) {
    const btn = document.createElement('button')
    btn.type      = 'button'
    btn.className = 'mts-dm-breadcrumb__item' + (isActive ? ' mts-dm-breadcrumb__item--active' : '')
    btn.disabled  = isActive

    // Icono: SVG desde MTS.Icon (fuente interna confiable) → innerHTML seguro
    const iconHtml = this._icon(iconName)
    if (iconHtml) {
      const iconWrap = document.createElement('span')
      iconWrap.innerHTML = iconHtml
      const iconNode = iconWrap.firstElementChild ?? iconWrap
      btn.appendChild(iconNode)
    }

    // Label: viene del servidor (nombre de carpeta) → textContent para prevenir XSS
    const span = document.createElement('span')
    span.textContent = label
    btn.appendChild(span)

    return btn
  }

  /* ----------------------------------------------------------
     HANDLER — clic en zona de nombre (capture)
     Intercepta ANTES del handler de selección del DataTable.

     Carpeta  → navega (stopPropagation — no selecciona la fila)
     Archivo  → onFileClick (stopPropagation — no selecciona la fila)

     Clic fuera del nombre → no hace nada → el DataTable selecciona
  ---------------------------------------------------------- */
  _onNameClick(e) {
    if (e.target.closest('input, button, a')) return
    const nameCell = e.target.closest('.mts-dm-cell-name')
    if (!nameCell) return

    const row = e.target.closest('tr.mts-table__row[data-id]')
    if (!row) return

    // Detenemos la propagación — el DataTable NO seleccionará esta fila
    e.stopPropagation()

    const item = MTS.DocumentManagerPlugin._itemFromRow(row)

    if (item.type === 'folder') {
      this._navigateTo(item.id, item.name)
    } else {
      if (typeof this._options.onFileClick === 'function') {
        this._options.onFileClick(item)
      }
    }
  }

  /* ----------------------------------------------------------
     HANDLER — clic derecho (delega a onContextMenuRequest)
  ---------------------------------------------------------- */
  _onContextMenu(e) {
    const row = e.target.closest('tr.mts-table__row[data-id]')
    if (!row) return
    e.preventDefault()
    const item = MTS.DocumentManagerPlugin._itemFromRow(row)
    if (typeof this._options.onContextMenuRequest === 'function') {
      this._options.onContextMenuRequest(item, e.clientX, e.clientY)
    }
  }

  /* ----------------------------------------------------------
     DRAG & DROP — mover items a carpetas
  ---------------------------------------------------------- */
  _onDragStart(e) {
    const row = e.target.closest('tr.mts-table__row[data-id]')
    if (!row) return
    this._draggedItem = MTS.DocumentManagerPlugin._itemFromRow(row)
    row.classList.add('mts-dm-row--dragging')
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(this._draggedItem.id))
  }

  _onDragOver(e) {
    if (!this._draggedItem) return
    const row = e.target.closest('tr.mts-table__row[data-id]')
    if (!row) return
    const item = MTS.DocumentManagerPlugin._itemFromRow(row)
    if (item.type === 'folder' && item.id !== this._draggedItem.id) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      this._table._el.querySelectorAll('.mts-dm-row--drop-target').forEach(r => {
        if (r !== row) r.classList.remove('mts-dm-row--drop-target')
      })
      row.classList.add('mts-dm-row--drop-target')
    }
  }

  _onDragLeave(e) {
    const row = e.target.closest('tr.mts-table__row[data-id]')
    if (row) row.classList.remove('mts-dm-row--drop-target')
  }

  _onDrop(e) {
    e.preventDefault()
    const row = e.target.closest('tr.mts-table__row[data-id]')
    if (!row || !this._draggedItem) return
    row.classList.remove('mts-dm-row--drop-target')
    const target = MTS.DocumentManagerPlugin._itemFromRow(row)
    if (target.type === 'folder' && target.id !== this._draggedItem.id) {
      if (typeof this._options.onDrop === 'function') {
        // Si el item arrastrado está entre los seleccionados, mueve toda la selección
        const selectedItems  = this._table?._getSelectedItems?.() ?? []
        const draggedId      = String(this._draggedItem[this._table?._cfg?.rowId ?? 'id'])
        const isInSelection  = selectedItems.some(i => String(i[this._table?._cfg?.rowId ?? 'id']) === draggedId)
        const itemsToMove    = isInSelection && selectedItems.length > 0
          ? selectedItems
          : [this._draggedItem]
        this._options.onDrop(itemsToMove, target)
      }
    }
    this._draggedItem = null
  }

  _onDragEnd() {
    this._draggedItem = null
    this._table?._el.querySelectorAll('.mts-dm-row--dragging, .mts-dm-row--drop-target').forEach(r => {
      r.classList.remove('mts-dm-row--dragging', 'mts-dm-row--drop-target')
    })
  }

  /* ----------------------------------------------------------
     DROPZONE EXTERNO — archivos del OS arrastrados sobre la tabla
  ---------------------------------------------------------- */

  /** Devuelve true si el drag viene del OS (Files) y no es un drag interno */
  _isExternalDrag(e) {
    return (e.dataTransfer?.types ?? []).includes('Files') && !this._draggedItem
  }

  _onExternalDragEnter(e) {
    if (!this._isExternalDrag(e)) return
    e.preventDefault()
    this._externalDragCount++
    if (this._externalDragCount === 1) {
      if (!this._dropzoneOverlay) {
        this._dropzoneOverlay = this._buildDropzoneOverlay()
        this._table._el.appendChild(this._dropzoneOverlay)
      }
      this._dropzoneOverlay.classList.add('mts-dm-dropzone-overlay--visible')
    }
  }

  _onExternalDragOver(e) {
    if (!this._isExternalDrag(e)) return
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  _onExternalDragLeave(e) {
    if (!this._isExternalDrag(e)) return
    this._externalDragCount = Math.max(0, this._externalDragCount - 1)
    if (this._externalDragCount === 0) {
      this._dropzoneOverlay?.classList.remove('mts-dm-dropzone-overlay--visible')
    }
  }

  _onExternalDrop(e) {
    if (!this._isExternalDrag(e)) return
    e.preventDefault()
    this._externalDragCount = 0
    this._dropzoneOverlay?.classList.remove('mts-dm-dropzone-overlay--visible')

    let files = Array.from(e.dataTransfer.files)
    if (!files.length) return

    // Filtrar por extensiones/MIME aceptados
    const accept = this._options.accept
    if (accept && accept !== '*') {
      files = files.filter(f => MTS.DocumentManagerPlugin._matchesAccept(f, accept))
    }
    if (!files.length) return

    // Respetar multiple: false → solo el primer archivo
    if (!this._options.multiple) files = [files[0]]

    if (typeof this._options.onFileDrop === 'function') {
      this._options.onFileDrop(files, this.getItem())
    }
  }

  _buildDropzoneOverlay() {
    const overlay = document.createElement('div')
    overlay.className = 'mts-dm-dropzone-overlay'

    const inner = document.createElement('div')
    inner.className = 'mts-dm-dropzone-overlay__inner'

    const iconWrap = document.createElement('span')
    iconWrap.innerHTML = this._icon('upload-cloud')

    const label = document.createElement('span')
    label.textContent = this._table?._cfg?.locale?.dm?.dropzoneLabel ?? 'Suelta los archivos aquí'

    inner.appendChild(iconWrap)
    inner.appendChild(label)
    overlay.appendChild(inner)
    return overlay
  }

  /* ----------------------------------------------------------
     API PÚBLICA
  ---------------------------------------------------------- */

  /* Retorna el item (carpeta) actual de navegación.
     null si el usuario está en el root. */
  getItem() {
    return this._stack.length > 0
      ? this._stack[this._stack.length - 1]
      : null
  }

  /* Retorna los items actualmente visibles en la tabla (página actual).
     Útil en onCheckFileExists para detectar duplicados sin llamada HTTP. */
  getItems() {
    return this._table?._currentData ?? []
  }

  /* ----------------------------------------------------------
     HELPERS PRIVADOS
  ---------------------------------------------------------- */
  _icon(name) {
    return typeof MTS?.Icon?.get === 'function' ? MTS.Icon.get(name) : ''
  }

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

  /* ----------------------------------------------------------
     HELPERS ESTÁTICOS DE RENDER (usados en columnas)
  ---------------------------------------------------------- */
  static renderName(value, row) {
    const iconName = row.type === 'folder'
      ? 'folder'
      : MTS.DocumentManagerPlugin._extToIcon(row.ext || '')
    const icon = typeof MTS?.Icon?.get === 'function' ? MTS.Icon.get(iconName) : ''
    const cls  = row.type === 'folder' ? 'mts-dm-cell-name mts-dm-cell-name--folder' : 'mts-dm-cell-name'
    return `<span class="${cls}">${icon}<span>${value}</span></span>`
  }

  static renderSize(value) {
    if (value === null || value === undefined)
      return '<span class="mts-dm-cell--muted">—</span>'
    const units = ['B', 'KB', 'MB', 'GB']
    let v = value, u = 0
    while (v >= 1024 && u < units.length - 1) { v /= 1024; u++ }
    return `<span>${u === 0 ? v : v.toFixed(1)} ${units[u]}</span>`
  }

  static renderStatus(value) {
    return MTS.DocumentManagerPlugin._statusHtml(value, MTS.DataTable?._activeLocale?.dm?.status ?? {})
  }

  static renderWorkflowStatus(value) {
    return MTS.DocumentManagerPlugin._workflowStatusHtml(value, MTS.DataTable?._activeLocale?.dm?.workflowStatus ?? {})
  }

  static _statusHtml(value, loc = {}) {
    if (value === null || value === undefined)
      return '<span class="mts-dm-cell--muted">—</span>'
    const map = {
      active:   ['mts-badge--success',   loc.active   ?? 'Activo'],
      archived: ['mts-badge--secondary', loc.archived ?? 'Archivado'],
      deleted:  ['mts-badge--danger',    loc.deleted  ?? 'Eliminado'],
    }
    const [cls, label] = map[value] || ['mts-badge--secondary', value]
    return `<span class="mts-badge ${cls}">${label}</span>`
  }

  static _workflowStatusHtml(value, loc = {}) {
    if (value === null || value === undefined)
      return '<span class="mts-dm-cell--muted">—</span>'
    const map = {
      draft:    ['mts-badge--secondary', loc.draft    ?? 'Borrador'],
      pending:  ['mts-badge--warning',   loc.pending  ?? 'Pendiente'],
      review:   ['mts-badge--info',      loc.review   ?? 'En revisión'],
      approved: ['mts-badge--success',   loc.approved ?? 'Aprobado'],
      rejected: ['mts-badge--danger',    loc.rejected ?? 'Rechazado'],
      signed:   ['mts-badge--primary',   loc.signed   ?? 'Firmado'],
    }
    const [cls, label] = map[value] || ['mts-badge--secondary', value]
    return `<span class="mts-badge ${cls}">${label}</span>`
  }

  /**
   * Comprueba si un File pasa el filtro de `accept`.
   * Soporta: '*', '.ext', 'type/*', 'type/subtype', combinados con comas.
   */
  static _matchesAccept(file, accept) {
    if (!accept || accept === '*') return true
    const name = (file.name || '').toLowerCase()
    const mime = (file.type || '').toLowerCase()
    const dot  = name.lastIndexOf('.')
    const ext  = dot !== -1 ? name.slice(dot) : ''   // incluye el punto: '.pdf'

    return accept.split(',').map(s => s.trim().toLowerCase()).some(p => {
      if (!p || p === '*') return true
      if (p.endsWith('/*'))  return mime.startsWith(p.slice(0, -1))  // 'image/*'
      if (p.startsWith('.')) return ext === p                          // '.pdf'
      return mime === p                                                 // 'application/pdf'
    })
  }

  static _extToIcon(ext) {
    const map = {
      // PDF
      pdf:  'file-pdf',
      // Word
      doc: 'file-word', docx: 'file-word', dot: 'file-word', dotx: 'file-word', odt: 'file-word',
      // Texto plano
      txt: 'file-text', rtf: 'file-text', md: 'file-text',
      // Excel
      xls: 'file-excel', xlsx: 'file-excel', xlsm: 'file-excel', xlsb: 'file-excel', ods: 'file-excel',
      // CSV
      csv: 'file-csv',
      // PowerPoint
      ppt: 'file-powerpoint', pptx: 'file-powerpoint', pps: 'file-powerpoint', ppsx: 'file-powerpoint', odp: 'file-powerpoint',
      // Access
      mdb: 'file-access', accdb: 'file-access', accde: 'file-access', odb: 'file-access',
      // Project
      mpp: 'file-project', mpt: 'file-project',
      // Visio
      vsd: 'file-visio', vsdx: 'file-visio', vdx: 'file-visio', vss: 'file-visio', vstx: 'file-visio',
      // OneNote
      one: 'file-onenote', onetoc2: 'file-onenote',
      // Publisher
      pub: 'file-publisher',
      // Outlook / email
      msg: 'file-outlook', eml: 'file-outlook', ost: 'file-outlook', pst: 'file-outlook',
      // Imágenes
      jpg:  'file-image', jpeg: 'file-image', png:  'file-image',
      gif:  'file-image', svg:  'file-image', webp: 'file-image',
      bmp:  'file-image', tiff: 'file-image', ico:  'file-image', odg: 'file-image',
      // Video
      mp4:  'file-video', avi:  'file-video', mov: 'file-video',
      mkv:  'file-video', webm: 'file-video', flv: 'file-video',
      // Audio
      mp3:  'file-audio', wav: 'file-audio', ogg: 'file-audio',
      flac: 'file-audio', aac: 'file-audio', m4a: 'file-audio',
      // Código
      js:   'file-code', ts:   'file-code', jsx:  'file-code', tsx: 'file-code',
      py:   'file-code', java: 'file-code', cs:   'file-code', cpp: 'file-code',
      html: 'file-code', css:  'file-code', json: 'file-code', xml: 'file-code',
      sql:  'file-code', sh:   'file-code', yaml: 'file-code', yml: 'file-code',
      // Comprimidos
      zip: 'file-zip', rar: 'file-zip', gz:  'file-zip',
      tar: 'file-zip', '7z': 'file-zip', bz2: 'file-zip',
    }
    return map[ext.toLowerCase()] ?? 'file'   // tabla → siempre muestra algo
  }
}
