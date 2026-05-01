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
      statusField:       options.statusField       ?? 'workflowStatus',
      showInToolbar:     options.showInToolbar      ?? false,
      onStart:           options.onStart           ?? null,
      onSendForApproval: options.onSendForApproval ?? null,
      onApprove:         options.onApprove         ?? null,
      onSign:            options.onSign            ?? null,
      onReject:          options.onReject          ?? null,
      onRestart:         options.onRestart         ?? null,
    }

    this._ctxMenu = null
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
      const loc = ctxMenu._dm?._table?._cfg?.locale?.dm?.workflow ?? {}
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
    const loc = this._ctxMenu?._dm?._table?._cfg?.locale?.dm?.workflow ?? {}
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
}
