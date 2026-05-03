/* ============================================================
   MATIOS UI — MTS.DocumentManagerUploadPlugin  v1.1.0
   Sub-plugin de upload para MTS.DocumentManagerPlugin.

   Usa MTS.Modal como contenedor del modal de upload.

   Muestra un modal con:
     - Drop zone interna para arrastrar archivos
     - Botón "Seleccionar archivos" (input file oculto)
     - Lista de archivos con estado por archivo
     - Verificación de existencia opcional (uploadCheck.onCheckFileExists)
     - Indicador de progreso por archivo: spinner o barra
     - Integración automática con los eventos del DocumentManagerPlugin

   Opciones propias del plugin (comportamiento del modal):
     uploadProgress:  'bar' | 'spinner'                — indicador de progreso (default: 'bar')
     modalPosition:   'top' | 'center' | 'bottom'      — posición vertical del modal (default: 'top')

   Restricciones leídas desde DocumentManagerPlugin (el host):
     accept        — extensiones/MIME aceptados, ej: '.pdf,.docx,image/*'
     multiple      — permite múltiples archivos
     maxFiles      — nº máximo de archivos por subida
     maxFileSizeMB — peso máximo por archivo en MB

   uploadCheck (opcional):
     { onCheckFileExists: async (file, folder) => Boolean }
     Si se define, verifica cada archivo antes de subir.
     Devuelve true → el archivo ya existe (muestra advertencia).

   Ciclo de upload:
     1. dev llama  dmUpload.open(files?, folder?)
        — files: File[] desde drag o desde input, opcional
        — folder: item de carpeta, opcional (default: dm.getItem())
     2. Se muestra la lista de archivos
     3. Si uploadCheck.onCheckFileExists está definido → chequea c/archivo
     4. Usuario puede agregar/remover archivos desde el modal
     5. Al hacer clic "Subir":
          dm._options.onUpload(file, folder)    — por cada archivo (Promise)
          dm._options.onError(err, file, folder) — si falla alguno
     6. Al terminar todos sin error:
          dm._options.onUploaded(uploadedFiles, folder)
          modal se cierra y recarga la tabla
     7. Si hubo errores: modal permanece abierto para reintentar

   Integración con dropzone del DM:
     El plugin NO intercepta onFileDrop automáticamente.
     El dev conecta explícitamente los dos en su configuración:
       onFileDrop: (files, folder) => { dmUpload.open(files, folder) }

   Dependencias: MTS.DocumentManagerPlugin, MTS.Modal

   Uso:
     const dmUpload = new MTS.DocumentManagerUploadPlugin({
       uploadProgress: 'bar',
       uploadCheck: {
         onCheckFileExists: async (file, folder) => {
           const res = await fetch(`/api/check?name=${file.name}&folder=${folder?.id}`)
           return (await res.json()).exists
         }
       }
     })

     const dm = new MTS.DocumentManagerPlugin({
       dropzone:   true,
       onFileDrop: (files, folder) => { console.log('[dm.onFileDrop]'); console.log({ files, folder }) },
       onUpload:   async (file, folder) => {
         const fd = new FormData()
         fd.append('file', file)
         await fetch('/api/upload', { method: 'POST', body: fd })
       },
       onUploaded: (files, folder) => { console.log('[dm.onUploaded]'); console.log({ files, folder }) },
       onError:    (err, file, folder) => { console.log('[dm.onError]'); console.log({ err, file, folder }) },
       plugins:    [dmUpload, dmContextMenu],
     })
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DocumentManagerUploadPlugin = class DocumentManagerUploadPlugin {

  static descriptor = {
    name:     'MTS.DocumentManagerUploadPlugin',
    version:  '1.1.0',
    type:     'documentManagerUpload',
    requires: ['MTS.DocumentManagerPlugin', 'MTS.Modal'],
    provides: 'documentManagerUpload',
  }

  /* ----------------------------------------------------------
     CONSTRUCTOR
  ---------------------------------------------------------- */
  constructor(options = {}) {
    this._options = {
      uploadProgress: options.uploadProgress ?? 'bar',
      modalPosition:  options.modalPosition  ?? 'top',
      uploadCheck:    options.uploadCheck    ?? null,
      /* accept, multiple, maxFiles, maxFileSizeMB → se leen de dm._options (el host) */
    }

    this._dm          = null
    this._modal       = null   // instancia MTS.Modal
    this._listEl      = null   // div de la lista de archivos
    this._dzEl        = null   // div de la dropzone (para habilitar/deshabilitar)
    this._selectBtnEl = null   // botón "Seleccionar archivos"
    this._inputEl     = null   // input[type=file] oculto
    this._files       = []     // [{ file, state, error }]
    this._uploading   = false
  }

  /* ----------------------------------------------------------
     CICLO DE VIDA
  ---------------------------------------------------------- */
  install(dm) {
    this._dm = dm
    /* El dev conecta explícitamente onFileDrop → dmUpload.open()
       en su configuración del DM. El plugin no intercepta nada aquí. */
  }

  uninstall() {
    this._closeModal()
    this._dm = null
  }

  /* ----------------------------------------------------------
     API PÚBLICA
  ---------------------------------------------------------- */
  open(files = null, folder = null) {
    if (this._modal) this._closeModal()

    const currentFolder = folder ?? this._dm?.getItem() ?? null

    this._files     = []
    this._uploading = false

    if (files?.length) {
      for (const f of files) this._addFileEntry(f)
    }

    this._buildModal(currentFolder)

    if (this._files.length && this._options.uploadCheck?.onCheckFileExists) {
      this._checkAll(currentFolder)
    }
  }

  /* ----------------------------------------------------------
     CONSTRUCCIÓN DEL MODAL (vía MTS.Modal)
  ---------------------------------------------------------- */
  _buildModal(folder) {
    /* Body = wrapper con dropzone + lista */
    const bodyEl = document.createElement('div')
    bodyEl.className = 'mts-dm-upload-body'

    const dropzone = this._buildDropzone(folder)
    bodyEl.appendChild(dropzone)

    this._listEl = document.createElement('div')
    this._listEl.className = 'mts-dm-upload-list'
    bodyEl.appendChild(this._listEl)

    this._modal = new MTS.Modal({
      title:      this._t('title'),
      body:       bodyEl,
      size:       'md',
      position:   this._options.modalPosition,
      scrollable: true,
      closable:   true,
      static:     false,
      buttons: [
        {
          id:      'dmUpload-cancel',
          label:   this._t('cancel'),
          variant: 'secondary',
          close:   true,
        },
        {
          id:      'dmUpload-upload',
          label:   this._t('upload'),
          variant: 'primary',
          onClick: () => this._startUpload(folder),
        },
      ],
      onHidden: () => {
        /* Guard: solo limpiar si es ESTE modal el que cerró,
           no un modal anterior cuyo onHidden llega tarde (350 ms de transición) */
        if (this._modal !== modalRef) return
        this._modal   = null
        this._listEl  = null
        this._inputEl = null
      },
    })

    const modalRef = this._modal   // referencia local para el guard de onHidden
    this._modal.show()

    this._renderFileList()
    this._updateUploadBtn()
  }

  /* ----------------------------------------------------------
     DROP ZONE DEL MODAL
  ---------------------------------------------------------- */
  _buildDropzone(folder) {
    const dz = document.createElement('div')
    dz.className = 'mts-dm-upload-dz'
    this._dzEl = dz

    /* Input file oculto */
    const input = document.createElement('input')
    input.type     = 'file'
    input.accept   = this._dm._options.accept   ?? '*'
    input.multiple = this._dm._options.multiple ?? true
    input.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none'
    input.addEventListener('change', () => {
      if (input.files?.length) {
        this._addFiles(Array.from(input.files), folder)
        input.value = ''
      }
    })
    this._inputEl = input

    const iconWrap = document.createElement('span')
    iconWrap.className = 'mts-dm-upload-dz__icon'
    iconWrap.innerHTML = this._icon('upload-cloud')

    const hintEl = document.createElement('span')
    hintEl.className   = 'mts-dm-upload-dz__hint'
    hintEl.textContent = this._buildHint()

    const selectBtn = document.createElement('button')
    selectBtn.type      = 'button'
    selectBtn.className = 'mts-btn mts-btn--secondary mts-btn--sm'
    selectBtn.textContent = this._t('selectFiles')
    selectBtn.addEventListener('click', () => input.click())
    this._selectBtnEl = selectBtn

    dz.appendChild(input)
    dz.appendChild(iconWrap)
    dz.appendChild(hintEl)
    dz.appendChild(selectBtn)

    /* Drag & drop sobre la zona interna del modal */
    let dzCount = 0
    dz.addEventListener('dragenter', (e) => {
      if (!(e.dataTransfer?.types ?? []).includes('Files')) return
      e.preventDefault()
      dzCount++
      dz.classList.add('mts-dm-upload-dz--active')
    })
    dz.addEventListener('dragover', (e) => {
      if (!(e.dataTransfer?.types ?? []).includes('Files')) return
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    })
    dz.addEventListener('dragleave', () => {
      dzCount = Math.max(0, dzCount - 1)
      if (dzCount === 0) dz.classList.remove('mts-dm-upload-dz--active')
    })
    dz.addEventListener('drop', (e) => {
      e.preventDefault()
      e.stopPropagation()   // evitar que el drop llegue al listener externo del DM
      dzCount = 0
      dz.classList.remove('mts-dm-upload-dz--active')
      let dropped = Array.from(e.dataTransfer.files)
      // Filtrar por extensiones/MIME aceptados
      const accept = this._dm._options.accept ?? '*'
      if (accept && accept !== '*') {
        dropped = dropped.filter(f => MTS.DocumentManagerPlugin._matchesAccept(f, accept))
      }
      if (dropped.length) this._addFiles(dropped, folder)
    })

    return dz
  }

  /* ----------------------------------------------------------
     GESTIÓN DE ARCHIVOS
  ---------------------------------------------------------- */
  _addFileEntry(file) {
    /* Verificar tipo de archivo aceptado */
    const accept = this._dm._options.accept ?? '*'
    if (accept !== '*' && !MTS.DocumentManagerPlugin._matchesAccept(file, accept)) {
      this._files.push({ file, state: 'error', error: this._t('fileTypeNotAllowed') })
      return
    }

    /* Límite de cantidad */
    const maxFiles   = this._dm._options.maxFiles   ?? null
    const uploadable = this._files.filter(e => e.state !== 'error').length
    if (maxFiles && uploadable >= maxFiles) return

    /* Límite de peso */
    const maxFileSizeMB = this._dm._options.maxFileSizeMB ?? null
    if (maxFileSizeMB && file.size > maxFileSizeMB * 1024 * 1024) {
      this._files.push({ file, state: 'error', error: this._t('fileTooLarge') })
      return
    }

    /* Evitar duplicados por nombre */
    const isDuplicate = this._files.some(e => e.file.name === file.name)
    if (!isDuplicate) {
      this._files.push({ file, state: 'pending', error: null, version: null, action: null })
    }
  }

  _addFiles(newFiles, folder) {
    for (const f of newFiles) this._addFileEntry(f)
    this._renderFileList()
    this._updateUploadBtn()
    this._updateDropzone()
    if (this._options.uploadCheck?.onCheckFileExists) {
      this._checkAll(folder)
    }
  }

  /* ----------------------------------------------------------
     RENDER — lista de archivos
  ---------------------------------------------------------- */
  _renderFileList() {
    if (!this._listEl) return
    this._listEl.replaceChildren()

    if (!this._files.length) {
      const empty = document.createElement('div')
      empty.className   = 'mts-dm-upload-list__empty'
      empty.textContent = this._t('noFiles')
      this._listEl.appendChild(empty)
      return
    }

    const onFileExists = this._dm._options.onFileExists ?? 'ask'

    this._files.forEach((entry, idx) => {
      const item = document.createElement('div')
      item.className     = 'mts-dm-upload-item'
      item.dataset.state = entry.state
      if (entry.state === 'exists' && onFileExists === 'ask') {
        item.classList.add('mts-dm-upload-item--conflict')
      }

      /* Icono del tipo de archivo — null si extensión desconocida */
      const fileIconWrap = document.createElement('span')
      fileIconWrap.className = 'mts-dm-upload-item__icon'
      const iconName = this._fileIcon(entry.file.name)
      if (iconName) fileIconWrap.innerHTML = this._icon(iconName)

      /* Info: nombre y peso */
      const infoEl = document.createElement('div')
      infoEl.className = 'mts-dm-upload-item__info'

      const nameEl = document.createElement('span')
      nameEl.className   = 'mts-dm-upload-item__name'
      nameEl.textContent = entry.file.name
      nameEl.title       = entry.file.name

      const metaEl = document.createElement('span')
      metaEl.className   = 'mts-dm-upload-item__meta'
      metaEl.textContent = this._formatSize(entry.file.size)

      infoEl.appendChild(nameEl)
      infoEl.appendChild(metaEl)

      /* Estado */
      const statusEl = document.createElement('div')
      statusEl.className = 'mts-dm-upload-item__status'
      statusEl.appendChild(this._buildStatusEl(entry))

      /* Botón eliminar */
      const removeBtn = document.createElement('button')
      removeBtn.type      = 'button'
      removeBtn.className = 'mts-dm-upload-item__remove'
      removeBtn.innerHTML = this._icon('close')
      removeBtn.setAttribute('aria-label', this._t('removeFile'))
      removeBtn.disabled  = this._uploading || entry.state === 'done'
      removeBtn.addEventListener('click', () => {
        this._files.splice(idx, 1)
        this._renderFileList()
        this._updateUploadBtn()
        this._updateDropzone()
      })

      item.appendChild(fileIconWrap)
      item.appendChild(infoEl)
      item.appendChild(statusEl)
      item.appendChild(removeBtn)

      this._listEl.appendChild(item)
    })
  }

  _buildStatusEl(entry) {
    const wrap = document.createElement('div')

    switch (entry.state) {
      case 'pending':
        wrap.className   = 'mts-dm-upload-status mts-dm-upload-status--pending'
        wrap.textContent = this._t('statusPending')
        break

      case 'checking': {
        wrap.className = 'mts-dm-upload-status mts-dm-upload-status--checking'
        const spin = document.createElement('span')
        spin.className = 'mts-dm-upload-spin'
        spin.innerHTML = this._icon('refresh-cw')
        wrap.appendChild(spin)
        wrap.appendChild(document.createTextNode(' ' + this._t('statusChecking')))
        break
      }

      case 'exists': {
        const onFileExists = this._dm._options.onFileExists ?? 'ask'
        const isAsk        = onFileExists === 'ask'
        wrap.className     = 'mts-dm-upload-status mts-dm-upload-status--exists' +
                             (isAsk ? ' mts-dm-upload-status--conflict' : '')

        /* Línea principal: ⚠ Ya existe + badge de versión */
        const mainLine = document.createElement('span')
        mainLine.className = 'mts-dm-upload-status__line'
        mainLine.innerHTML = this._icon('warning') + ' ' + this._t('statusExists')
        if (entry.version) {
          const badge = document.createElement('span')
          badge.className   = 'mts-dm-upload-version'
          badge.textContent = entry.version
          mainLine.appendChild(badge)
        }
        wrap.appendChild(mainLine)

        if (isAsk) {
          /* Botones de acción: el usuario elige qué hacer */
          const actionsEl = document.createElement('div')
          actionsEl.className = 'mts-dm-upload-item__actions'

          ;[
            { key: 'replace', label: this._t('actionReplace') },
            { key: 'version', label: this._t('actionVersion') },
            { key: 'skip',    label: this._t('actionSkip')    },
          ].forEach(({ key, label }) => {
            const btn = document.createElement('button')
            btn.type      = 'button'
            btn.className = 'mts-dm-upload-action' +
              (entry.action === key ? ' mts-dm-upload-action--active' : '')
            btn.textContent = label
            btn.disabled    = this._uploading
            btn.addEventListener('click', () => {
              entry.action = key
              this._renderFileList()
              this._updateUploadBtn()
            })
            actionsEl.appendChild(btn)
          })
          wrap.appendChild(actionsEl)
        } else {
          /* Auto-mode: mostrar la acción configurada */
          const autoLabels = {
            replace: this._t('actionReplace'),
            version: this._t('actionVersion'),
            skip:    this._t('actionSkip'),
          }
          const autoLabel = autoLabels[onFileExists]
          if (autoLabel) {
            const autoEl = document.createElement('span')
            autoEl.className   = 'mts-dm-upload-action mts-dm-upload-action--auto'
            autoEl.textContent = `→ ${autoLabel}`
            wrap.appendChild(autoEl)
          }
        }
        break
      }

      case 'ready':
        wrap.className = 'mts-dm-upload-status mts-dm-upload-status--ready'
        wrap.innerHTML = this._icon('check') + ' ' + this._t('statusReady')
        break

      case 'uploading':
        wrap.className = 'mts-dm-upload-status mts-dm-upload-status--uploading'
        if (this._options.uploadProgress === 'bar') {
          const bar   = document.createElement('div')
          bar.className = 'mts-dm-upload-progress'
          const inner = document.createElement('div')
          inner.className = 'mts-dm-upload-progress__bar'
          bar.appendChild(inner)
          wrap.appendChild(bar)
        } else {
          const spin = document.createElement('span')
          spin.className = 'mts-dm-upload-spin'
          spin.innerHTML = this._icon('refresh-cw')
          wrap.appendChild(spin)
        }
        break

      case 'done':
        wrap.className = 'mts-dm-upload-status mts-dm-upload-status--done'
        wrap.innerHTML = this._icon('check-circle') + ' ' + this._t('statusDone')
        break

      case 'error':
        wrap.className = 'mts-dm-upload-status mts-dm-upload-status--error'
        wrap.innerHTML = this._icon('alert')
        wrap.appendChild(document.createTextNode(' ' + (entry.error || this._t('statusError'))))
        break

      case 'skipped':
        wrap.className   = 'mts-dm-upload-status mts-dm-upload-status--skipped'
        wrap.textContent = this._t('statusSkipped')
        break
    }

    return wrap
  }

  _updateUploadBtn() {
    if (!this._modal) return
    const onFileExists = this._dm._options.onFileExists ?? 'ask'

    const uploadable = this._files.filter(e => {
      if (e.state === 'pending' || e.state === 'ready') return true
      if (e.state === 'exists') {
        if (onFileExists === 'ask') return e.action === 'replace' || e.action === 'version'
        return onFileExists !== 'skip'
      }
      return false
    })

    /* En modo 'ask': bloquear si hay algún archivo existente sin acción elegida */
    const hasUndecided = onFileExists === 'ask' &&
      this._files.some(e => e.state === 'exists' && e.action === null)

    const count = uploadable.length
    this._modal.setButtonLabel(
      'dmUpload-upload',
      count > 0 ? `${this._t('upload')} (${count})` : this._t('upload')
    )
    this._modal.setButtonDisabled(
      'dmUpload-upload',
      hasUndecided || count === 0 || this._uploading
    )
  }

  /* ----------------------------------------------------------
     VERIFICACIÓN DE EXISTENCIA
  ---------------------------------------------------------- */
  async _checkAll(folder) {
    const checker = this._options.uploadCheck?.onCheckFileExists
    if (typeof checker !== 'function') return

    const onFileExists = this._dm._options.onFileExists ?? 'ask'
    const toCheck      = this._files.filter(e => e.state === 'pending')
    for (const entry of toCheck) entry.state = 'checking'
    this._renderFileList()

    for (const entry of toCheck) {
      try {
        const result = await checker(entry.file, folder)

        if (!result) {
          /* No existe */
          entry.state = 'ready'
        } else {
          /* Existe — result: true | { version: string } */
          entry.version = (result && typeof result === 'object')
            ? (result.version ?? null)
            : null

          switch (onFileExists) {
            case 'replace':
              entry.state  = 'exists'
              entry.action = 'replace'
              break
            case 'version':
              entry.state  = 'exists'
              entry.action = 'version'
              break
            case 'skip':
              entry.state  = 'skipped'
              entry.action = 'skip'
              break
            default: /* 'ask' */
              entry.state  = 'exists'
              entry.action = null   // el usuario elige
              break
          }
        }
      } catch {
        entry.state = 'ready'  /* si el checker falla, asumimos que no existe */
      }
      this._renderFileList()
    }

    this._updateUploadBtn()
  }

  /* ----------------------------------------------------------
     UPLOAD
  ---------------------------------------------------------- */
  async _startUpload(folder) {
    const onUpload = this._dm?._options?.onUpload
    if (typeof onUpload !== 'function') return

    const onFileExists = this._dm._options.onFileExists ?? 'ask'

    /* Marcar como skipped los archivos que el usuario (o la política) decidió omitir */
    this._files
      .filter(e => e.state === 'exists' && (
        onFileExists === 'skip' ||
        (onFileExists === 'ask' && e.action === 'skip')
      ))
      .forEach(e => { e.state = 'skipped' })

    const toUpload = this._files.filter(e => {
      if (e.state === 'pending' || e.state === 'ready') return true
      if (e.state === 'exists') {
        if (onFileExists === 'ask') return e.action === 'replace' || e.action === 'version'
        return onFileExists !== 'skip'
      }
      return false
    })
    if (!toUpload.length) {
      this._renderFileList()
      return
    }

    this._uploading = true
    this._updateUploadBtn()
    this._updateDropzone()
    this._modal?.setButtonDisabled('dmUpload-cancel', true)

    const uploadedFiles = []
    let hadError = false

    for (const entry of toUpload) {
      /* Contexto de conflicto para el callback onUpload */
      const action         = entry.action         // 'replace' | 'version' | null
      const currentVersion = entry.version ?? null // versión actual del archivo existente

      entry.state = 'uploading'
      this._renderFileList()

      try {
        await onUpload(entry.file, folder, { action, currentVersion })
        entry.state = 'done'
        uploadedFiles.push(entry.file)
      } catch (err) {
        entry.state = 'error'
        entry.error = err?.message || this._t('statusError')
        hadError    = true

        if (typeof this._dm?._options?.onError === 'function') {
          this._dm._options.onError(err, entry.file, folder)
        }
      }

      this._renderFileList()
    }

    this._uploading = false
    this._updateUploadBtn()
    this._updateDropzone()
    this._modal?.setButtonDisabled('dmUpload-cancel', false)

    if (uploadedFiles.length && typeof this._dm?._options?.onUploaded === 'function') {
      this._dm._options.onUploaded(uploadedFiles, folder)
    }

    if (!hadError) {
      /* Todo OK — brief delay para que el usuario vea el estado "Subido" */
      setTimeout(() => {
        this._closeModal()
        this._dm?._table?.reload()
      }, 800)
    } else {
      /* Hubo errores — mantener modal abierto, cambiar botón a "Reintentar" */
      this._modal?.setButtonLabel('dmUpload-upload', this._t('retry'))
      this._modal?.setButtonDisabled('dmUpload-upload', false)
    }
  }

  /* ----------------------------------------------------------
     CERRAR MODAL
  ---------------------------------------------------------- */
  _closeModal() {
    if (!this._modal) return
    this._modal.hide()
    /* onHidden limpia _modal, _listEl, _inputEl */
    this._files     = []
    this._uploading = false
  }

  /* ----------------------------------------------------------
     HELPERS
  ---------------------------------------------------------- */

  /** Texto del hint de la dropzone con las restricciones configuradas */
  _buildHint() {
    const parts         = [this._t('dropHint')]
    const acceptLabel   = this._formatAccept(this._dm._options.accept ?? '*')
    const maxFiles      = this._dm._options.maxFiles      ?? null
    const maxFileSizeMB = this._dm._options.maxFileSizeMB ?? null
    if (acceptLabel)   parts.push(acceptLabel)
    if (maxFiles)      parts.push(this._t('maxFiles').replace('{n}', maxFiles))
    if (maxFileSizeMB) parts.push(this._t('maxSize').replace('{n}', maxFileSizeMB))
    return parts.join(' · ')
  }

  /**
   * Convierte el string `accept` del DM en un label legible para el hint.
   * Ejemplos: '.pdf,.docx' → 'PDF, DOCX'
   *           'image/*'    → 'imágenes'
   *           '*'          → '' (sin label)
   */
  _formatAccept(accept) {
    if (!accept || accept === '*') return ''
    const typeLabels = {
      image: 'imágenes', video: 'videos', audio: 'audio',
      text: 'texto', application: 'documentos',
    }
    const labels = accept.split(',').map(p => {
      p = p.trim().toLowerCase()
      if (!p || p === '*') return null
      if (p.endsWith('/*'))  return typeLabels[p.slice(0, -2)] ?? p.slice(0, -2)
      if (p.startsWith('.')) return p.slice(1).toUpperCase()            // '.pdf' → 'PDF'
      return p.split('/').pop().toUpperCase()                            // 'image/jpeg' → 'JPEG'
    }).filter(Boolean)
    return labels.join(', ')
  }

  /** Deshabilita la dropzone cuando se está subiendo o se alcanza el máximo de archivos */
  _updateDropzone() {
    if (!this._dzEl) return
    const maxFiles   = this._dm._options.maxFiles ?? null
    const uploadable = this._files.filter(e => e.state !== 'error').length
    const disabled   = this._uploading || (!!maxFiles && uploadable >= maxFiles)
    this._dzEl.classList.toggle('mts-dm-upload-dz--disabled', disabled)
    if (this._selectBtnEl) this._selectBtnEl.disabled = disabled
    if (this._inputEl)     this._inputEl.disabled     = disabled
  }

  _t(key) {
    const locale   = this._dm?._table?._cfg?.locale?.['MTS.DocumentManagerUploadPlugin'] ?? {}
    const defaults = {
      title:          'Subir archivos',
      cancel:         'Cancelar',
      upload:         'Subir',
      retry:          'Reintentar fallidos',
      dropHint:       'Arrastra archivos aquí',
      selectFiles:    'Seleccionar archivos',
      noFiles:        'No hay archivos seleccionados',
      removeFile:     'Eliminar archivo de la lista',
      fileTooLarge:       'Archivo demasiado grande',
      fileTypeNotAllowed: 'Tipo de archivo no permitido',
      maxFiles:           'Máx. {n} archivos',
      maxSize:            'Máx. {n} MB por archivo',
      actionReplace:      'Reemplazar',
      actionVersion:      'Nueva versión',
      actionSkip:         'Omitir',
      statusPending:  'Pendiente',
      statusChecking: 'Verificando...',
      statusExists:   'Ya existe',
      statusReady:    'Listo',
      statusDone:     'Subido',
      statusError:    'Error al subir',
      statusSkipped:  'Omitido',
    }
    return locale[key] ?? defaults[key] ?? key
  }

  _icon(name) {
    return typeof MTS?.Icon?.get === 'function' ? MTS.Icon.get(name) : ''
  }

  _formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB']
    let v = bytes, u = 0
    while (v >= 1024 && u < units.length - 1) { v /= 1024; u++ }
    return `${u === 0 ? v : v.toFixed(1)} ${units[u]}`
  }

  _fileIcon(filename) {
    const dot = filename.lastIndexOf('.')
    if (dot === -1) return null                        // sin extensión → sin icono
    const ext = filename.slice(dot + 1).toLowerCase()
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
    return map[ext] ?? null                            // extensión desconocida → sin icono
  }
}
