/* ============================================================
   MATIOS UI — MTS.DataTableMenu  v1.0.0
   Utilidad interna compartida del ecosistema DataTable.

   Centraliza el render, posicionamiento y navegación por
   teclado de todos los menús flotantes del DataTable.

   NO es un plugin de tabla — es instanciado internamente
   por los plugins que necesitan mostrar un menú.

   Uso interno (en un plugin):
     this._menu = new MTS.DataTableMenu({
       onClose: () => console.log('menú cerrado'),
     })

     // Mostrar con items ya resueltos
     this._menu.show([
       { label: 'Editar',   icon: 'edit',  action: () => {} },
       { separator: true },
       { label: 'Eliminar', icon: 'trash', danger: true, action: () => {} },
     ], x, y)

     // Cerrar programáticamente
     this._menu.destroy()

   Render del botón trigger (columna de acciones):
     MTS.DataTableMenu.renderTrigger()           // "Acciones ∨"
     MTS.DataTableMenu.renderTrigger('Opciones') // label custom
   ============================================================ */

var MTS = MTS || {};

MTS.DataTableMenu = class DataTableMenu {

  /* ----------------------------------------------------------
     CONSTRUCTOR
  ---------------------------------------------------------- */
  constructor(options = {}) {
    this._onClose = options.onClose ?? null
    this._menuEl  = null

    this._onDocumentClick = this._onDocumentClick.bind(this)
    this._onKeyDown       = this._onKeyDown.bind(this)
  }

  /* ----------------------------------------------------------
     ESTADO
  ---------------------------------------------------------- */
  get isOpen() { return !!this._menuEl }

  /* ----------------------------------------------------------
     RENDER ESTÁTICO — botón trigger de columna de acciones
  ---------------------------------------------------------- */
  static renderTrigger(label = 'Acciones') {
    const icon = typeof MTS?.Icon?.get === 'function' ? MTS.Icon.get('chevron-down') : '▾'
    return `<button type="button" class="mts-dt-trigger"><span>${label}</span>${icon}</button>`
  }

  /* ----------------------------------------------------------
     SHOW — renderiza y posiciona el menú flotante

     items[]:
       { label, icon, danger, disabled, shortcut, action }
       { separator: true }

     Los items ya vienen resueltos por el plugin (conditions
     aplicadas, batch ya calculado). Esta utilidad solo renderiza.
  ---------------------------------------------------------- */
  show(items, x, y) {
    // Reset silencioso — sin disparar onClose
    this._destroyInternal()

    // Limpiar separadores huérfanos (inicio / fin / consecutivos)
    const cleaned = items.filter((def, idx, arr) => {
      if (!def.separator) return true
      const prev = arr[idx - 1]
      const next = arr[idx + 1]
      return prev && !prev.separator && next && !next.separator
    })

    if (cleaned.length === 0) return

    const menu = document.createElement('ul')
    menu.className = 'mts-dt-menu'
    menu.setAttribute('role', 'menu')

    cleaned.forEach(def => {
      if (def.separator) {
        const li = document.createElement('li')
        li.className = 'mts-dt-menu__separator'
        li.setAttribute('role', 'separator')
        menu.appendChild(li)
        return
      }

      const li = document.createElement('li')
      li.className = 'mts-dt-menu__item'
      li.setAttribute('role', 'menuitem')
      li.tabIndex  = -1
      if (def.danger)   li.classList.add('mts-dt-menu__item--danger')
      if (def.disabled) { li.classList.add('mts-dt-menu__item--disabled'); li.setAttribute('aria-disabled', 'true') }

      if (def.icon) {
        const iconEl = document.createElement('span')
        iconEl.className = 'mts-dt-menu__icon'
        iconEl.setAttribute('aria-hidden', 'true')
        iconEl.innerHTML = typeof MTS?.Icon?.get === 'function' ? MTS.Icon.get(def.icon) : ''
        li.appendChild(iconEl)
      }

      const labelEl = document.createElement('span')
      labelEl.className   = 'mts-dt-menu__label'
      labelEl.textContent = def.label
      li.appendChild(labelEl)

      if (def.shortcut) {
        const kbdEl = document.createElement('span')
        kbdEl.className   = 'mts-dt-menu__shortcut'
        kbdEl.textContent = def.shortcut
        li.appendChild(kbdEl)
      }

      if (!def.disabled && typeof def.action === 'function') {
        li.addEventListener('click', () => {
          this._destroyInternal()
          this._fireClose()
          def.action()
        })
      }

      menu.appendChild(li)
    })

    document.body.appendChild(menu)
    this._menuEl = menu

    /* Posicionamiento — evitar salir del viewport */
    const { width: mw, height: mh } = menu.getBoundingClientRect()
    const vw = window.innerWidth, vh = window.innerHeight
    let left = x, top = y
    if (left + mw > vw - 8) left = x - mw
    if (top  + mh > vh - 8) top  = y - mh
    if (left < 8) left = 8
    if (top  < 8) top  = 8
    menu.style.left = `${left + window.scrollX}px`
    menu.style.top  = `${top  + window.scrollY}px`

    menu.querySelector('.mts-dt-menu__item:not(.mts-dt-menu__item--disabled)')?.focus()
    document.addEventListener('click',   this._onDocumentClick)
    document.addEventListener('keydown', this._onKeyDown)
  }

  /* ----------------------------------------------------------
     DESTROY — cierre explícito (dispara onClose)
  ---------------------------------------------------------- */
  destroy() {
    if (!this._menuEl) return
    this._destroyInternal()
    this._fireClose()
  }

  /* ----------------------------------------------------------
     PRIVADOS
  ---------------------------------------------------------- */
  _destroyInternal() {
    if (!this._menuEl) return
    this._menuEl.remove()
    this._menuEl = null
    document.removeEventListener('click',   this._onDocumentClick)
    document.removeEventListener('keydown', this._onKeyDown)
  }

  _fireClose() {
    if (typeof this._onClose === 'function') this._onClose()
  }

  _onDocumentClick(e) {
    if (this._menuEl && !this._menuEl.contains(e.target)) {
      this._destroyInternal()
      this._fireClose()
    }
  }

  _onKeyDown(e) {
    if (!this._menuEl) return
    if (e.key === 'Escape') {
      e.preventDefault()
      this._destroyInternal()
      this._fireClose()
      return
    }
    const els = [...this._menuEl.querySelectorAll('.mts-dt-menu__item:not(.mts-dt-menu__item--disabled)')]
    const idx = els.indexOf(document.activeElement)
    if (e.key === 'ArrowDown')                   { e.preventDefault(); (els[idx + 1] ?? els[0])?.focus() }
    else if (e.key === 'ArrowUp')                { e.preventDefault(); (els[idx - 1] ?? els[els.length - 1])?.focus() }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.activeElement?.click() }
  }
}
