/* ============================================================
   MATIOS UI — MTS.DocumentManagerWorkflowPlugin  v2.3.0
   Extensión de workflow para DocumentManagerBaseContextMenuPlugin.

   Agrega acciones de ciclo de vida documental al context menu
   según el valor del campo workflowStatus de cada item.

   El dev DEBE incluir el campo en la respuesta del API.
   Si el campo no existe en el item, no aparece ninguna opción.

   Ciclo de vida:
     null/undefined  →  Iniciar
     draft           →  Enviar a aprobación
     pending         →  Aprobar · Rechazar
     review          →  Firmar · Rechazar
     approved        →  (sin acciones)
     rejected        →  Reiniciar
     signed          →  (estado final, sin acciones)

   Opción showInToolbar:
     Si true, muestra los botones de workflow en una barra de acciones.
     Funciona en dos modos — sin dependencia del toolbar básico:
       · Con MTS.DataTableToolbarPlugin presente → inyecta en él
       · Sin MTS.DataTableToolbarPlugin → renderiza su propia barra
     Los botones se habilitan por "unanimidad de estado":
     TODOS los ítems seleccionados deben compartir el mismo
     estado para que la acción correspondiente se active.

   Uso:
     const dmWorkflow = new MTS.DocumentManagerWorkflowPlugin({
       statusField:       'workflowStatus',   // campo en el item (default)
       showInToolbar:     true,               // inyectar en el toolbar (default: false)
       onStart:           (items) => {},       // null → draft
       onSendForApproval: (items) => {},       // draft → pending
       onApprove:         (items) => {},       // pending → approved
       onSign:            (items) => {},       // review → signed
       onReject:          (items) => {},       // pending|review → rejected
       onRestart:         (items) => {},       // rejected → draft
     })
     dmCtx.use(dmWorkflow)

   Descriptor requerido por DocumentManagerBaseContextMenuPlugin.use():
     - provides: 'dmWorkflow'  — único, no conflictúa con el base
     - events:   lista de eventos propios — validados contra el base
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DocumentManagerWorkflowPlugin = class DocumentManagerWorkflowPlugin {

  static descriptor = {
    name:     'MTS.DocumentManagerWorkflowPlugin',
    version:  '2.3.0',
    type:     'contextMenuExtension',
    provides: 'dmWorkflow',
    events:   ['onStart', 'onSendForApproval', 'onApprove', 'onSign', 'onReject', 'onRestart'],
  }

  /* ----------------------------------------------------------
     CONSTRUCTOR
  ---------------------------------------------------------- */
  constructor(options = {}) {
    this._options = {
      statusField:        options.statusField        ?? 'workflowStatus',
      showInToolbar:      options.showInToolbar       ?? false,
      currentUser:        options.currentUser         ?? null,
      onStart:            options.onStart            ?? null,
      onSendForApproval:  options.onSendForApproval  ?? null,
      onApprove:          options.onApprove          ?? null,
      onSign:             options.onSign             ?? null,
      onReject:           options.onReject           ?? null,
      onRestart:          options.onRestart          ?? null,
      onLoadParticipants: options.onLoadParticipants ?? null,
      onReorder:          options.onReorder          ?? null,
    }

    this._ctxMenu             = null
    this._preview             = null   // ref al PreviewPlugin (via participantsPanel.install)
    this._participantsPanelObj = null  // objeto de sub-panel cacheado
    this._toolbar             = null   // ref al toolbar plugin (caso A)
    this._ownToolbarEl        = null   // barra propia (caso B)
    this._ownBtnInstances     = []     // [{ def, instance }] para update
    this._originalOnSelChange = null   // hook restaurado en uninstall
  }

  /* ----------------------------------------------------------
     INSTALACIÓN — llamado por DocumentManagerBaseContextMenuPlugin.use()
  ---------------------------------------------------------- */
  install(ctxMenu) {
    this._ctxMenu = ctxMenu

    /* ── Context menu items ─────────────────────────────── */
    ctxMenu.addItems((contextItem, items) => {
      const field = this._options.statusField

      // Si ningún item tiene el campo, el plugin no aporta opciones
      if (!(field in contextItem)) return []

      // El estado del context item determina las acciones disponibles
      // (si hay varios seleccionados con estados mixtos, usamos el del clic)
      const ws  = contextItem[field]
      const loc = ctxMenu._dm?._table?._cfg?.locale?.['MTS.DocumentManagerWorkflowPlugin'] ?? {}
      const defs = []

      /* null/undefined — sin workflow iniciado */
      if ((ws === null || ws === undefined) && this._options.onStart) {
        defs.push({
          label:  loc.start ?? 'Iniciar workflow',
          icon:   'play',
          action: () => this._options.onStart(items),
        })
      }

      /* draft — borrador listo para enviar */
      if (ws === 'draft' && this._options.onSendForApproval) {
        defs.push({
          label:  loc.sendForApproval ?? 'Enviar a aprobación',
          icon:   'send',
          action: () => this._options.onSendForApproval(items),
        })
      }

      /* pending — esperando aprobación */
      if (ws === 'pending') {
        if (this._options.onApprove) {
          defs.push({
            label:  loc.approve ?? 'Aprobar',
            icon:   'check-circle',
            action: () => this._options.onApprove(items),
          })
        }
        if (this._options.onReject) {
          defs.push({
            label:  loc.reject ?? 'Rechazar',
            icon:   'x-circle',
            danger: true,
            action: () => this._options.onReject(items),
          })
        }
      }

      /* review — en revisión, listo para firma */
      if (ws === 'review') {
        if (this._options.onSign) {
          defs.push({
            label:  loc.sign ?? 'Firmar',
            icon:   'edit',
            action: () => this._options.onSign(items),
          })
        }
        if (this._options.onReject) {
          defs.push({
            label:  loc.reject ?? 'Rechazar',
            icon:   'x-circle',
            danger: true,
            action: () => this._options.onReject(items),
          })
        }
      }

      /* rejected — rechazado, puede reiniciarse */
      if (ws === 'rejected' && this._options.onRestart) {
        defs.push({
          label:  loc.restart ?? 'Reiniciar workflow',
          icon:   'refresh',
          action: () => this._options.onRestart(items),
        })
      }

      /* approved / signed — estados finales, sin acciones */

      return defs
    })

    /* ── Toolbar (showInToolbar: true) ───────────────────── */
    if (this._options.showInToolbar) {
      const toolbar = ctxMenu._dm?._table?.getPlugin?.('MTS.DataTableToolbarPlugin')
      if (toolbar) {
        /* Caso A: hay toolbar plugin → inyecta en él */
        this._toolbar = toolbar
        toolbar.addButtons(this._buildToolbarButtons(), 'dmWorkflow')
      } else {
        /* Caso B: sin toolbar plugin → barra propia autónoma */
        this._renderOwnToolbar(ctxMenu._dm._table)
      }
    }
  }

  /* ----------------------------------------------------------
     DESINSTALACIÓN — llamado por DocumentManagerContextMenuPlugin.uninstall()
  ---------------------------------------------------------- */
  uninstall() {
    /* Caso A: limpiar botones del toolbar plugin */
    if (this._toolbar) {
      this._toolbar.removeButtons('dmWorkflow')
      this._toolbar = null
    }
    /* Caso B: limpiar barra propia y restaurar onSelectionChange */
    if (this._ownToolbarEl) {
      const table = this._ctxMenu?._dm?._table
      table?.setToolbarLeft(null)
      if (table) table._cfg.onSelectionChange = this._originalOnSelChange
      this._ownToolbarEl        = null
      this._ownBtnInstances     = []
      this._originalOnSelChange = null
    }
    this._ctxMenu = null
  }

  /* ----------------------------------------------------------
     BARRA PROPIA (Caso B) — sin MTS.DataTableToolbarPlugin
  ---------------------------------------------------------- */

  _renderOwnToolbar(table) {
    this._ownToolbarEl = document.createElement('div')
    this._ownToolbarEl.className = 'mts-dt-toolbar-btns'
    this._ownBtnInstances = []

    const groupEl = document.createElement('div')
    groupEl.className = 'mts-btn-group'
    this._buildToolbarButtons().forEach(def => {
      groupEl.appendChild(this._buildOwnBtn(def, table))
    })
    this._ownToolbarEl.appendChild(groupEl)

    table.setToolbarLeft(this._ownToolbarEl)

    /* Hook en onSelectionChange para re-evaluar conditions */
    const orig = table._cfg.onSelectionChange ?? null
    this._originalOnSelChange = orig
    table._cfg.onSelectionChange = (...args) => {
      orig?.(...args)
      this._updateOwnToolbar(table)
    }
  }

  _buildOwnBtn(def, table) {
    const hasLabel = !!def.label
    const hasIcon  = !!def.icon
    const iconOnly = hasIcon && !hasLabel
    const iconHtml = hasIcon && typeof MTS?.Icon?.get === 'function'
      ? MTS.Icon.get(def.icon)
      : null
    const isDisabled = typeof def.condition === 'function'
      ? !def.condition(table)
      : (def.disabled === true)
    const variant = def.danger ? 'danger' : (def.variant ?? 'secondary')

    const el = document.createElement('button')
    el.type  = 'button'
    const instance = new MTS.Button(el, {
      label:    hasLabel ? def.label : '',
      variant,
      size:     'sm',
      iconLeft: iconHtml,
      iconOnly,
      disabled: isDisabled,
    })

    if (def.tooltip) {
      el.title = def.tooltip
      if (iconOnly) el.setAttribute('aria-label', def.tooltip)
    }

    if (typeof def.action === 'function') {
      instance.on('click', () => def.action(table))
    }

    this._ownBtnInstances.push({ def, instance })
    return el
  }

  _updateOwnToolbar(table) {
    this._ownBtnInstances.forEach(({ def, instance }) => {
      if (typeof def.condition !== 'function') return
      def.condition(table) ? instance.enable() : instance.disable()
    })
  }

  /* ----------------------------------------------------------
     TOOLBAR — construcción de botones con condiciones
     Unanimidad de estado: TODOS los ítems seleccionados deben
     compartir el mismo estado para habilitar la acción.
  ---------------------------------------------------------- */
  _buildToolbarButtons() {
    const sf  = this._options.statusField
    const opt = this._options
    const loc = this._ctxMenu?._dm?._table?._cfg?.locale?.['MTS.DocumentManagerWorkflowPlugin'] ?? {}
    const buttons = []

    /* Iniciar — todos sin workflow (null/undefined) */
    if (opt.onStart) {
      buttons.push({
        label:     loc.start       ?? 'Iniciar',
        icon:      'play',
        tooltip:   loc.start       ?? 'Iniciar workflow',
        condition: (table) => {
          const sel = table.getSelection()
          return sel.length > 0 && sel.every(i => i[sf] == null)
        },
        action: (table) => opt.onStart(table.getSelection()),
      })
    }

    /* Enviar a aprobación — todos en draft */
    if (opt.onSendForApproval) {
      buttons.push({
        label:     loc.sendForApproval ?? 'Enviar',
        icon:      'send',
        tooltip:   loc.sendForApproval ?? 'Enviar a aprobación',
        condition: (table) => {
          const sel = table.getSelection()
          return sel.length > 0 && sel.every(i => i[sf] === 'draft')
        },
        action: (table) => opt.onSendForApproval(table.getSelection()),
      })
    }

    /* Aprobar — todos en pending */
    if (opt.onApprove) {
      buttons.push({
        label:     loc.approve ?? 'Aprobar',
        icon:      'check-circle',
        tooltip:   loc.approve ?? 'Aprobar',
        condition: (table) => {
          const sel = table.getSelection()
          return sel.length > 0 && sel.every(i => i[sf] === 'pending')
        },
        action: (table) => opt.onApprove(table.getSelection()),
      })
    }

    /* Firmar — todos en review */
    if (opt.onSign) {
      buttons.push({
        label:     loc.sign ?? 'Firmar',
        icon:      'edit',
        tooltip:   loc.sign ?? 'Firmar',
        condition: (table) => {
          const sel = table.getSelection()
          return sel.length > 0 && sel.every(i => i[sf] === 'review')
        },
        action: (table) => opt.onSign(table.getSelection()),
      })
    }

    /* Rechazar — todos en pending o todos en review (mismo estado) */
    if (opt.onReject) {
      buttons.push({
        label:     loc.reject ?? 'Rechazar',
        icon:      'x-circle',
        tooltip:   loc.reject ?? 'Rechazar',
        danger:    true,
        condition: (table) => {
          const sel = table.getSelection()
          if (!sel.length) return false
          const ws0 = sel[0][sf]
          return (ws0 === 'pending' || ws0 === 'review') &&
                 sel.every(i => i[sf] === ws0)
        },
        action: (table) => opt.onReject(table.getSelection()),
      })
    }

    /* Reiniciar — todos en rejected */
    if (opt.onRestart) {
      buttons.push({
        label:     loc.restart ?? 'Reiniciar',
        icon:      'refresh',
        tooltip:   loc.restart ?? 'Reiniciar workflow',
        condition: (table) => {
          const sel = table.getSelection()
          return sel.length > 0 && sel.every(i => i[sf] === 'rejected')
        },
        action: (table) => opt.onRestart(table.getSelection()),
      })
    }

    return buttons
  }

  /* ----------------------------------------------------------
     PARTICIPANTS PANEL — sub-panel compatible con PreviewPlugin
  ---------------------------------------------------------- */

  get participantsPanel() {
    if (!this._participantsPanelObj) {
      this._participantsPanelObj = this._buildParticipantsPanel()
    }
    return this._participantsPanelObj
  }

  _buildParticipantsPanel() {
    const self = this
    const panel = {
      key:   'participants',
      get label() { return self._t('participants', 'Participantes') },
      get icon()  { return typeof MTS.Icon !== 'undefined' ? MTS.Icon.get('users') : null },

      install: function(preview) {
        self._preview = preview
      },

      uninstall: function() {
        self._preview = null
      },

      render: function(item) {
        return self._buildParticipantSkeleton()
      },

      load: function(item) {
        if (typeof self._options.onLoadParticipants !== 'function') {
          const empty = document.createElement('p')
          empty.className = 'dm-participants__empty'
          empty.textContent = self._t('noParticipants', 'Sin participantes.')
          return empty
        }
        return Promise.resolve(self._options.onLoadParticipants(item))
          .then(function(participants) {
            return self._renderParticipantsPanel(participants || [], item, panel)
          })
          .catch(function(err) {
            console.error('[WorkflowPlugin.participantsPanel] Error al cargar participantes:', err)
            const errEl = document.createElement('p')
            errEl.className = 'dm-participants__empty'
            errEl.textContent = self._t('noParticipants', 'Sin participantes.')
            return errEl
          })
      },
    }
    return panel
  }

  /* ----------------------------------------------------------
     SKELETON — placeholder mientras carga onLoadParticipants
  ---------------------------------------------------------- */

  _buildParticipantSkeleton() {
    const wrap = document.createElement('div')
    wrap.className = 'dm-participants dm-participants--loading'

    for (let i = 0; i < 4; i++) {
      const row = document.createElement('div')
      row.className = 'dm-participants__skeleton-row'

      const avatar = document.createElement('div')
      avatar.className = 'dm-participants__skeleton-avatar'

      const lines = document.createElement('div')
      lines.className = 'dm-participants__skeleton-lines'

      const l1 = document.createElement('div')
      l1.className = 'dm-participants__skeleton-line dm-participants__skeleton-line--title'

      const l2 = document.createElement('div')
      l2.className = 'dm-participants__skeleton-line dm-participants__skeleton-line--sub'

      lines.appendChild(l1)
      lines.appendChild(l2)
      row.appendChild(avatar)
      row.appendChild(lines)
      wrap.appendChild(row)
    }

    return wrap
  }

  /* ----------------------------------------------------------
     RENDER REAL — SortableList + botones de acción
  ---------------------------------------------------------- */

  _renderParticipantsPanel(participants, item, panelObj) {
    const self = this
    const loc  = this._t('__all__', null)  // objeto completo del locale

    const STATUS_VARIANT = {
      pending:  'default',
      approved: 'success',
      rejected: 'danger',
      signed:   'primary',
    }

    const STATUS_LABEL = {
      pending:  (loc && loc.statusPending)  || 'Pendiente',
      approved: (loc && loc.statusApproved) || 'Aprobado',
      rejected: (loc && loc.statusRejected) || 'Rechazado',
      signed:   (loc && loc.statusSigned)   || 'Firmado',
    }

    const wrap = document.createElement('div')
    wrap.className = 'dm-participants'

    /* Estado vacío */
    if (!participants.length) {
      const empty = document.createElement('p')
      empty.className = 'dm-participants__empty'
      empty.textContent = (loc && loc.noParticipants) || 'Sin participantes.'
      wrap.appendChild(empty)
      return wrap
    }

    /* ── SortableList ─────────────────────────────────────── */
    const listEl = document.createElement('div')
    listEl.className = 'dm-participants__list'
    wrap.appendChild(listEl)

    const LOCKED_STATUSES = { approved: true, rejected: true, signed: true }

    const listItems = participants.map(function(p) {
      return {
        id:          p.id,
        title:       p.name + ' ' + p.lastName,
        description: p.user,
        avatar:      p.name + ' ' + p.lastName,
        disabled:    p.cantReorder || !!LOCKED_STATUSES[p.status],
        badge: {
          label:   STATUS_LABEL[p.status]   || p.status,
          variant: STATUS_VARIANT[p.status] || 'default',
        },
      }
    })

    new MTS.SortableList(listEl, {
      items:    listItems,
      numbered: true,
      variant:  'compact',
      onReorder: function(event) {
        if (typeof self._options.onReorder !== 'function') return
        const reordered = event.detail.items.map(function(listItem, idx) {
          var original = participants.find(function(p) { return p.id === listItem.id })
          if (!original) return null
          return Object.assign({}, original, { order: idx + 1 })
        }).filter(Boolean)
        self._options.onReorder(reordered, item)
      },
    })

    /* ── Botones Aprobar / Rechazar ───────────────────────── */
    const canAct = this._isCurrentUserTurn(participants)

    const actions = document.createElement('div')
    actions.className = 'dm-participants__actions'

    const approveEl = document.createElement('div')
    const rejectEl  = document.createElement('div')
    actions.appendChild(approveEl)
    actions.appendChild(rejectEl)

    let btnApprove, btnReject

    function disableBtns() {
      if (btnApprove) { btnApprove.disable() }
      if (btnReject)  { btnReject.disable()  }
    }

    btnApprove = new MTS.Button(approveEl, {
      label:    (loc && loc.approve) || 'Aprobar',
      variant:  'primary',
      size:     'sm',
      iconLeft: typeof MTS.Icon !== 'undefined' ? MTS.Icon.get('check-circle') : '',
      disabled: !canAct,
    })

    btnReject = new MTS.Button(rejectEl, {
      label:    (loc && loc.reject) || 'Rechazar',
      variant:  'danger',
      size:     'sm',
      iconLeft: typeof MTS.Icon !== 'undefined' ? MTS.Icon.get('x-circle') : '',
      disabled: !canAct,
    })

    const currentParticipant = participants.find(function(p) {
      return p.user === self._options.currentUser
    }) || null

    btnApprove.on('click', function() {
      disableBtns()
      if (typeof self._options.onApprove === 'function') {
        self._options.onApprove([item], currentParticipant)
      }
      self._reloadParticipantsPanel(panelObj, item)
    })

    btnReject.on('click', function() {
      disableBtns()
      if (typeof self._options.onReject === 'function') {
        self._options.onReject([item], currentParticipant)
      }
      self._reloadParticipantsPanel(panelObj, item)
    })

    wrap.appendChild(actions)
    return wrap
  }

  /* ----------------------------------------------------------
     HELPERS — turno del usuario actual + reload del panel
  ---------------------------------------------------------- */

  _isCurrentUserTurn(participants) {
    const currentUser = this._options.currentUser
    if (!currentUser) return false

    let userIdx = -1
    for (let i = 0; i < participants.length; i++) {
      if (participants[i].user === currentUser) { userIdx = i; break }
    }

    if (userIdx === -1) return false
    if (participants[userIdx].status !== 'pending') return false

    for (let i = 0; i < userIdx; i++) {
      const s = participants[i].status
      if (s !== 'approved' && s !== 'signed') return false
    }

    return true
  }

  _reloadParticipantsPanel(panelObj, item) {
    const self = this
    if (!self._preview || !self._preview._accEl) return

    const key   = panelObj.key
    const inner = self._preview._accEl.querySelector(
      '#mts-acc-body-' + key + ' .mts-accordion__body-inner'
    )
    if (!inner) return

    const skeleton = panelObj.render(item)
    if (skeleton instanceof Element) { inner.replaceChildren(skeleton) }

    const result = panelObj.load(item)
    if (result && typeof result.then === 'function') {
      result.then(function(el) {
        if (el instanceof Element) {
          inner.replaceChildren(el)
          if (self._preview._refreshAccordionHeight) {
            self._preview._refreshAccordionHeight(key)
          }
        }
      })
    } else if (result instanceof Element) {
      inner.replaceChildren(result)
      if (self._preview._refreshAccordionHeight) {
        self._preview._refreshAccordionHeight(key)
      }
    }
  }

  /* ----------------------------------------------------------
     LOCALE — helper para leer strings del locale activo
  ---------------------------------------------------------- */

  _t(key, fallback) {
    const loc = (
      this._ctxMenu &&
      this._ctxMenu._dm &&
      this._ctxMenu._dm._table &&
      this._ctxMenu._dm._table._cfg &&
      this._ctxMenu._dm._table._cfg.locale &&
      this._ctxMenu._dm._table._cfg.locale['MTS.DocumentManagerWorkflowPlugin']
    ) || {}

    if (key === '__all__') return loc
    return loc[key] !== undefined ? loc[key] : fallback
  }
}
