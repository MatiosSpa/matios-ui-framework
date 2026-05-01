/* ============================================================
   MATIOS UI — MTS.DataTableToolbarPlugin  v1.2.0
   Plugin de toolbar de botones para MTS.DataTable.

   Dependencias: MTS.Button (matios-ui-button.css + matios-ui-button.js)

   Usa MTS.Button internamente para garantizar consistencia visual
   con el resto del ecosistema MTS (inputs, selects, etc.).

   Los botones se agrupan usando mts-btn-group.
   Los separadores { separator: true } crean cortes entre grupos.

   Cada botón puede tener:
     label     — texto visible (opcional si hay icon)
     icon      — nombre del icono MTS sin prefijo, ej: 'plus' (opcional si hay label)
     tooltip   — atributo title + aria-label en icon-only (recomendado)
     variant   — variante MTS.Button ('secondary' por defecto, 'danger' para destructivos)
     danger    — true → shorthand para variant: 'danger'
     disabled  — true → siempre deshabilitado
     condition — (table) => boolean → deshabilitado dinámico; se actualiza con update()
     action    — (table) => {} — recibe la instancia del DataTable

   API pública:
     plugin.update()                 — re-evalúa conditions sin re-renderizar
     plugin.addButtons(buttons, id)  — inyecta botones desde un plugin externo
     plugin.removeButtons(id)        — elimina botones inyectados por id

   Uso:
     const toolbar = new MTS.DataTableToolbarPlugin({
       buttons: [
         { label: 'Nuevo',    icon: 'plus',  tooltip: 'Crear',    action: (t) => {} },
         { icon: 'refresh',                  tooltip: 'Recargar', action: (t) => t.reload() },
         { separator: true },
         { label: 'Eliminar', icon: 'trash', danger: true,
           tooltip: 'Eliminar selección',
           condition: (t) => t.getSelection().length > 0,
           action: (t) => {} },
       ],
     })

     new MTS.DataTable({
       plugins: [toolbar],
       onSelectionChange: () => toolbar.update(),
       ...
     })
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DataTableToolbarPlugin = class DataTableToolbarPlugin {

  static descriptor = {
    name:     'MTS.DataTableToolbarPlugin',
    version:  '1.2.0',
    type:     'toolbar',
    requires: ['MTS.DataTable', 'MTS.Button'],
    provides: 'toolbar',
  }

  /* ----------------------------------------------------------
     CONSTRUCTOR
  ---------------------------------------------------------- */
  constructor(options = {}) {
    this._buttons      = [...(options.buttons || [])]
    this._extraSets    = new Map()   // id → buttons[] (inyectados por plugins)
    this._table        = null
    this._containerEl  = null
    this._btnInstances = []          // [{ def, instance: MTS.Button }]
  }

  /* ----------------------------------------------------------
     CICLO DE VIDA
  ---------------------------------------------------------- */
  install(table) {
    this._table = table
    this._containerEl = document.createElement('div')
    this._containerEl.className = 'mts-dt-toolbar-btns'
    this._fillContainer()
    table.setToolbarLeft(this._containerEl)
  }

  uninstall() {
    if (!this._table) return
    this._table.setToolbarLeft(null)
    this._btnInstances = []
    this._containerEl  = null
    this._table        = null
  }

  /* ----------------------------------------------------------
     API PÚBLICA
  ---------------------------------------------------------- */

  /* Re-evalúa conditions en todas las instancias — sin re-render.
     Llamar desde onSelectionChange u otros eventos del DataTable. */
  update() {
    this._btnInstances.forEach(({ def, instance }) => {
      if (typeof def.condition !== 'function') return
      const enabled = def.condition(this._table)
      enabled ? instance.enable() : instance.disable()
    })
  }

  /* Inyecta un conjunto de botones desde un plugin externo.
     Se añaden al final con un separador automático.
     id — identificador único del conjunto (usado para removeButtons). */
  addButtons(buttons, id) {
    if (!Array.isArray(buttons) || !buttons.length || !id) return this
    this._extraSets.set(id, buttons)
    this._rerender()
    return this
  }

  /* Elimina el conjunto de botones inyectado con el id dado. */
  removeButtons(id) {
    if (!this._extraSets.has(id)) return this
    this._extraSets.delete(id)
    this._rerender()
    return this
  }

  /* ----------------------------------------------------------
     RENDER — contenedor de grupos
  ---------------------------------------------------------- */

  /* Devuelve todos los botones: los del dev + los inyectados por plugins */
  _getAllButtons() {
    const all = [...this._buttons]
    this._extraSets.forEach(buttons => {
      if (buttons.length) {
        all.push({ separator: true })
        all.push(...buttons)
      }
    })
    return all
  }

  /* Limpia el contenedor y lo rellena de nuevo con todos los botones */
  _rerender() {
    if (!this._containerEl) return
    this._btnInstances = []
    this._containerEl.replaceChildren()
    this._fillContainer()
  }

  /* Construye los grupos de botones dentro del contenedor */
  _fillContainer() {
    const buttons = this._getAllButtons()

    /* Partir el array en grupos según separadores */
    const groups = []
    let group    = []
    buttons.forEach(def => {
      if (def.separator) {
        if (group.length) { groups.push(group); group = [] }
      } else {
        group.push(def)
      }
    })
    if (group.length) groups.push(group)

    groups.forEach((grp, i) => {
      if (i > 0) {
        const sep = document.createElement('div')
        sep.className = 'mts-dt-toolbar-btns__sep'
        sep.setAttribute('aria-hidden', 'true')
        this._containerEl.appendChild(sep)
      }

      const groupEl = document.createElement('div')
      groupEl.className = 'mts-btn-group'
      grp.forEach(def => {
        const btnEl = this._buildBtn(def)
        groupEl.appendChild(btnEl)
      })
      this._containerEl.appendChild(groupEl)
    })
  }

  /* ----------------------------------------------------------
     RENDER — botón individual via MTS.Button
  ---------------------------------------------------------- */
  _buildBtn(def) {
    const hasLabel = !!def.label
    const hasIcon  = !!def.icon
    const iconOnly = hasIcon && !hasLabel

    const iconHtml = hasIcon && typeof MTS?.Icon?.get === 'function'
      ? MTS.Icon.get(def.icon)
      : null

    const isDisabled = def.disabled === true ||
      (typeof def.condition === 'function' && !def.condition(this._table))

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
      instance.on('click', () => def.action(this._table))
    }

    this._btnInstances.push({ def, instance })

    return el
  }
}
