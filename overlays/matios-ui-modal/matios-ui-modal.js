/* ============================================================
   MATIOS UI — matios-ui-modal.js
   MTS.Modal — Componente de diálogo / modal
   
   Eventos DOM : mts:modal:show | mts:modal:shown
                 mts:modal:hide | mts:modal:hidden
   API fluida  : modal.on('shown', cb) | modal.off('shown', cb)

   Requiere: matios-ui-base.css + matios-ui-modal.css
   Version:  1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Modal = class MtsModal {

  /* ============================================================
     Constructor
     ============================================================ */

  /**
   * @param {object} options
   *
   * — Contenido —
   * @param {string}          options.id            ID del modal (auto-generado si no se provee)
   * @param {string}          options.title         Título del modal
   * @param {string|Element}  options.body          Contenido del body (HTML string o Element)
   * @param {string|Element}  options.footer        Contenido del footer (HTML string o Element)
   * @param {Array}           options.buttons        Botones del footer — ver estructura abajo
   *
   * — Comportamiento —
   * @param {string}   options.size              'sm'|'md'|'lg'|'xl'|'fullscreen' — default: 'md'
   * @param {boolean}  options.closable          Muestra botón X y cierra con Esc — default: true
   * @param {boolean}  options.backdrop          Click fuera cierra — default: true
   * @param {boolean}  options.scrollable        Body scrolleable — default: false
   * @param {boolean}  options.centered          Centrado verticalmente — default: true
   * @param {boolean}  options.static            No cierra con Esc ni backdrop — default: false
   *
   * — Callbacks (alternativa a .on()) —
   * @param {function} options.onShow
   * @param {function} options.onShown
   * @param {function} options.onHide
   * @param {function} options.onHidden
   *
   * — Backward compat —
   * @param {string}   options.elementId         ID de un modal HTML existente (migración Bootstrap)
   *
   * — Estructura de buttons —
   * buttons: [
   *   {
   *     id:       'btn-confirm',       // opcional
   *     label:    'Confirmar',
   *     variant:  'primary',           // primary|secondary|ghost|danger
   *     close:    true,                // cierra el modal al hacer click
   *     disabled: false,
   *     onClick:  () => {}
   *   }
   * ]
   */
  constructor(options = {}) {
    this.id         = options.id        || `mts-modal-${Date.now()}`;
    this.title      = options.title     || '';
    this.body       = options.body      || '';
    this.footer     = options.footer    || null;
    this.buttons    = options.buttons   || [];
    this.size       = options.size      || 'md';
    this.closable   = options.closable  ?? true;
    this.backdrop   = options.static    ? false : (options.backdrop ?? true);
    this.scrollable = options.scrollable ?? false;
    this.centered   = options.centered   ?? true;
    this.static     = options.static     ?? false;

    // Listeners internos
    this._listeners  = {};
    this._isOpen     = false;
    this._focusTrap  = null;
    this._prevFocus  = null;

    // Backward compat Bootstrap
    this._elementId  = options.elementId || null;

    // Callbacks directos
    if (options.onShow)    this.on('show',    options.onShow);
    if (options.onShown)   this.on('shown',   options.onShown);
    if (options.onHide)    this.on('hide',    options.onHide);
    if (options.onHidden)  this.on('hidden',  options.onHidden);

    // Si viene de un elementId existente, envuelve ese elemento
    if (this._elementId) {
      this._wrapExistingElement();
    } else {
      this._buildDOM();
    }

    this._bindEvents();
  }

  /* ============================================================
     API PÚBLICA
     ============================================================ */

  /** Abre el modal */
  show() {
    if (this._isOpen) return this;

    // Evento show — cancelable
    if (!this._emit('show')) return this;

    this._prevFocus = document.activeElement;
    this._isOpen    = true;

    // Registrar Esc solo mientras el modal está abierto
    document.addEventListener('keydown', this._onKeyDown);

    document.body.classList.add('mts-modal-open');
    this._backdropEl.classList.add('mts-modal-backdrop--visible');
    this._dialogEl.removeAttribute('hidden');
    this._dialogEl.setAttribute('aria-hidden', 'false');

    // Forzar reflow para animar
    void this._dialogEl.offsetHeight;
    this._dialogEl.classList.add('mts-modal--visible');

    // Esperar animación antes de disparar 'shown'
    this._onTransitionEnd(this._contentEl, () => {
      this._trapFocus();
      this._emit('shown');
    });

    return this;
  }

  /** Cierra el modal */
  hide() {
    if (!this._isOpen) return this;

    // Evento hide — cancelable
    if (!this._emit('hide')) return this;

    this._isOpen = false;
    this._dialogEl.classList.remove('mts-modal--visible');

    // Remover Esc listener inmediatamente al cerrar
    document.removeEventListener('keydown', this._onKeyDown);

    this._onTransitionEnd(this._contentEl, () => {
      this._dialogEl.setAttribute('aria-hidden', 'true');
      this._dialogEl.setAttribute('hidden', '');
      this._backdropEl.classList.remove('mts-modal-backdrop--visible');
      document.body.classList.remove('mts-modal-open');
      this._releaseFocus();
      this._emit('hidden');
    });

    return this;
  }

  /** Toggle show/hide */
  toggle() {
    return this._isOpen ? this.hide() : this.show();
  }

  /** Actualiza el título */
  setTitle(html) {
    if (this._titleEl) this._titleEl.innerHTML = html;
    this.title = html;
    return this;
  }

  /** Actualiza el body */
  setBody(content) {
    if (this._bodyEl) {
      this._bodyEl.innerHTML = '';
      if (content instanceof Element) {
        this._bodyEl.appendChild(content);
      } else {
        this._bodyEl.innerHTML = content;
      }
    }
    return this;
  }

  /** Habilita/deshabilita un botón por ID */
  setButtonDisabled(buttonId, disabled) {
    const btn = this._footerEl?.querySelector(`#${buttonId}`);
    if (btn) btn.disabled = disabled;
    return this;
  }

  /** Actualiza el label de un botón por ID */
  setButtonLabel(buttonId, label) {
    const btn = this._footerEl?.querySelector(`#${buttonId}`);
    if (btn) btn.textContent = label;
    return this;
  }

  /** Muestra spinner de carga en un botón */
  setButtonLoading(buttonId, loading) {
    const btn = this._footerEl?.querySelector(`#${buttonId}`);
    if (!btn) return this;
    btn.disabled = loading;
    if (loading) {
      btn.dataset.originalLabel = btn.textContent;
      btn.innerHTML = `<span class="mts-spinner mts-spinner--sm"></span> ${btn.dataset.originalLabel}`;
    } else {
      btn.textContent = btn.dataset.originalLabel || btn.textContent;
    }
    return this;
  }

  /** Destruye la instancia y elimina el DOM */
  destroy() {
    this.hide();
    this._releaseFocus();
    // Remover el listener de Esc del document
    if (this._onKeyDown) {
      document.removeEventListener('keydown', this._onKeyDown);
      this._onKeyDown = null;
    }
    setTimeout(() => {
      this._dialogEl?.remove();
      this._backdropEl?.remove();
    }, 350);
  }

  /** Registra un listener de evento */
  on(event, cb) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(cb);
    return this;
  }

  /** Remueve un listener */
  off(event, cb) {
    if (!this._listeners[event]) return this;
    this._listeners[event] = this._listeners[event].filter(fn => fn !== cb);
    return this;
  }

  /** ¿Está abierto? */
  get isOpen() { return this._isOpen; }

  /** Referencia al elemento del modal */
  get element() { return this._dialogEl; }

  /* ============================================================
     MÉTODOS ESTÁTICOS — Modales de conveniencia
     ============================================================ */

  /**
   * Modal de confirmación
   * Soporta dos estilos:
   *   Promise:  MTS.Modal.confirm({...}).then(ok => { if(ok) ... })
   *   Callback: MTS.Modal.confirm({..., onConfirm: () => {}, onCancel: () => {} })
   * @returns {Promise<boolean>}
   */
  static confirm({
    title   = '¿Estás seguro?',
    message = '',
    confirmLabel = null,
    cancelLabel  = null,
    /* aliases para compatibilidad */
    confirmText  = null,
    cancelText   = null,
    variant = 'danger',
    size    = 'sm',
    /* callbacks opcionales — si se pasan, se ejecutan además de resolver la Promise */
    onConfirm = null,
    onCancel  = null,
  } = {}) {
    const okLabel  = confirmLabel || confirmText || 'Confirmar';
    const nokLabel = cancelLabel  || cancelText  || 'Cancelar';
    return new Promise(resolve => {
      const modal = new MTS.Modal({
        title,
        size,
        static: true,
        body: `<p class="mts-modal-confirm__message">${message}</p>`,
        buttons: [
          {
            id:      'mts-confirm-cancel',
            label:   nokLabel,
            variant: 'ghost',
            close:   true,
            onClick: () => { if (onCancel) onCancel(); resolve(false); },
          },
          {
            id:      'mts-confirm-ok',
            label:   okLabel,
            variant,
            close:   true,
            onClick: () => { if (onConfirm) onConfirm(); resolve(true); },
          },
        ],
        onHidden: () => modal.destroy(),
      });
      modal.show();
    });
  }

  /**
   * Modal de alerta simple
   * @returns {Promise<void>}
   */
  static alert({
    title    = 'Aviso',
    message  = '',
    label    = 'Aceptar',
    size     = 'sm',
    onAccept = null,
  } = {}) {
    return new Promise(resolve => {
      const modal = new MTS.Modal({
        title,
        size,
        static: true,
        body: `<p class="mts-modal-confirm__message">${message}</p>`,
        buttons: [
          {
            id:      'mts-alert-ok',
            label,
            variant: 'primary',
            close:   true,
            onClick: () => { if (onAccept) onAccept(); resolve(); },
          },
        ],
        onHidden: () => modal.destroy(),
      });
      modal.show();
    });
  }

  /**
   * Modal de prompt (input de texto)
   * @returns {Promise<string|null>} — null si cancela
   */
  static prompt({
    title       = 'Ingresa un valor',
    label       = '',
    placeholder = '',
    value       = '',
    confirmLabel = 'Aceptar',
    cancelLabel  = 'Cancelar',
    size         = 'sm',
  } = {}) {
    return new Promise(resolve => {
      const inputId = `mts-prompt-input-${Date.now()}`;
      const modal   = new MTS.Modal({
        title,
        size,
        static: true,
        body: `
          <div class="mts-form-group">
            ${label ? `<label class="mts-label" for="${inputId}">${label}</label>` : ''}
            <input
              id="${inputId}"
              type="text"
              class="mts-input"
              placeholder="${placeholder}"
              value="${value}"
              autocomplete="off"
            >
          </div>
        `,
        buttons: [
          {
            id:      'mts-prompt-cancel',
            label:   cancelLabel,
            variant: 'ghost',
            close:   true,
            onClick: () => resolve(null),
          },
          {
            id:      'mts-prompt-ok',
            label:   confirmLabel,
            variant: 'primary',
            close:   true,
            onClick: () => {
              const input = document.getElementById(inputId);
              resolve(input ? input.value : null);
            },
          },
        ],
        onShown:  () => document.getElementById(inputId)?.focus(),
        onHidden: () => modal.destroy(),
      });
      modal.show();
    });
  }

  /* ============================================================
     CONSTRUCCIÓN DEL DOM
     ============================================================ */

  _buildDOM() {
    // — Backdrop —
    this._backdropEl = document.createElement('div');
    this._backdropEl.className = 'mts-modal-backdrop';

    // — Dialog —
    this._dialogEl = document.createElement('div');
    this._dialogEl.className  = `mts-modal mts-modal--${this.size}`;
    this._dialogEl.id         = this.id;
    this._dialogEl.setAttribute('role', 'dialog');
    this._dialogEl.setAttribute('aria-modal', 'true');
    this._dialogEl.setAttribute('aria-hidden', 'true');
    this._dialogEl.setAttribute('hidden', '');
    if (this.centered)   this._dialogEl.classList.add('mts-modal--centered');
    if (this.scrollable) this._dialogEl.classList.add('mts-modal--scrollable');

    // — Content —
    this._contentEl = document.createElement('div');
    this._contentEl.className = 'mts-modal__content';

    // — Header —
    this._headerEl = document.createElement('div');
    this._headerEl.className = 'mts-modal__header';

    this._titleEl = document.createElement('h5');
    this._titleEl.className   = 'mts-modal__title';
    this._titleEl.innerHTML   = this.title;
    this._headerEl.appendChild(this._titleEl);

    if (this.closable) {
      const closeBtn = document.createElement('button');
      closeBtn.className        = 'mts-modal__close';
      closeBtn.setAttribute('aria-label', 'Cerrar');
      closeBtn.innerHTML        = '&times;';
      closeBtn.addEventListener('click', () => this.hide());
      this._headerEl.appendChild(closeBtn);
    }

    // — Body —
    this._bodyEl = document.createElement('div');
    this._bodyEl.className = 'mts-modal__body';
    if (this.body instanceof Element) {
      this._bodyEl.appendChild(this.body);
    } else {
      this._bodyEl.innerHTML = this.body;
    }

    // — Footer —
    this._footerEl = null;
    if (this.buttons.length > 0 || this.footer) {
      this._footerEl = document.createElement('div');
      this._footerEl.className = 'mts-modal__footer';

      if (this.footer) {
        if (this.footer instanceof Element) {
          this._footerEl.appendChild(this.footer);
        } else {
          this._footerEl.innerHTML = this.footer;
        }
      }

      this.buttons.forEach(btn => {
        this._footerEl.appendChild(this._buildButton(btn));
      });
    }

    // — Ensamblado —
    this._contentEl.appendChild(this._headerEl);
    this._contentEl.appendChild(this._bodyEl);
    if (this._footerEl) this._contentEl.appendChild(this._footerEl);
    this._dialogEl.appendChild(this._contentEl);

    document.body.appendChild(this._backdropEl);
    document.body.appendChild(this._dialogEl);
  }

  _buildButton(btn) {
    const el = document.createElement('button');
    el.className   = `mts-btn mts-btn--${btn.variant || 'secondary'}`;
    el.textContent = btn.label || '';
    if (btn.id)       el.id       = btn.id;
    if (btn.disabled) el.disabled = true;

    el.addEventListener('click', () => {
      /* Emitir evento DOM con info del botón */
      this._dialogEl?.dispatchEvent(new CustomEvent('mts:modal:buttonClick', {
        bubbles: true,
        detail: { label: btn.label, id: btn.id, variant: btn.variant, modal: this }
      }));
      if (btn.onClick) btn.onClick(this);
      if (btn.close)   this.hide();
    });

    return el;
  }

  /* ============================================================
     BACKWARD COMPAT — envuelve un elemento existente
     Para migrar desde Bootstrap sin tocar el HTML del cshtml
     ============================================================ */

  _wrapExistingElement() {
    const existing = document.getElementById(this._elementId);
    if (!existing) {
      console.warn(`[MTS.Modal] Elemento no encontrado: #${this._elementId}`);
      this._buildDOM();
      return;
    }

    // Reutiliza el elemento existente — solo agrega clases MTS
    this._dialogEl  = existing;
    this._contentEl = existing.querySelector('.modal-content') || existing;
    this._headerEl  = existing.querySelector('.modal-header')  || null;
    this._titleEl   = existing.querySelector('.modal-title')   || null;
    this._bodyEl    = existing.querySelector('.modal-body')    || null;
    this._footerEl  = existing.querySelector('.modal-footer')  || null;

    // Migrar clases Bootstrap → MTS
    existing.classList.remove('modal', 'fade');
    existing.classList.add('mts-modal', `mts-modal--${this.size}`);
    if (this.centered) existing.classList.add('mts-modal--centered');

    this._contentEl.classList.remove('modal-content');
    this._contentEl.classList.add('mts-modal__content');

    if (this._headerEl) {
      this._headerEl.classList.remove('modal-header');
      this._headerEl.classList.add('mts-modal__header');
    }

    if (this._bodyEl) {
      this._bodyEl.classList.remove('modal-body');
      this._bodyEl.classList.add('mts-modal__body');
    }

    if (this._footerEl) {
      this._footerEl.classList.remove('modal-footer');
      this._footerEl.classList.add('mts-modal__footer');
    }

    existing.setAttribute('aria-hidden', 'true');
    existing.setAttribute('role', 'dialog');
    existing.setAttribute('aria-modal', 'true');
    existing.setAttribute('hidden', '');

    // Backdrop
    this._backdropEl = document.createElement('div');
    this._backdropEl.className = 'mts-modal-backdrop';
    document.body.appendChild(this._backdropEl);
  }

  /* ============================================================
     EVENTOS
     ============================================================ */

  _bindEvents() {
    // Esc para cerrar — se agrega/remueve en show()/hide()
    this._onKeyDown = (e) => {
      if (e.key === 'Escape' && this._isOpen && this.closable && !this.static) {
        this.hide();
      }
    };

    // Click en backdrop
    this._dialogEl.addEventListener('click', (e) => {
      if (e.target === this._dialogEl && this.backdrop && !this.static) {
        this.hide();
      }
    });
  }

  /**
   * Emite evento interno + CustomEvent en el elemento DOM
   * @returns {boolean} false si se canceló con preventDefault()
   */
  _emit(eventName, detail = {}) {
    // 1. Listeners internos registrados con .on()
    const handlers = this._listeners[eventName] || [];
    let cancelled  = false;

    const syntheticEvent = {
      type:          eventName,
      target:        this,
      preventDefault: () => { cancelled = true; },
      detail,
    };

    handlers.forEach(fn => fn(syntheticEvent));
    if (cancelled) return false;

    // 2. CustomEvent en el elemento DOM — mts:modal:shown, etc.
    const domEvent = new CustomEvent(`mts:modal:${eventName}`, {
      bubbles:    true,
      cancelable: eventName === 'show' || eventName === 'hide',
      detail:     { modal: this, ...detail },
    });

    const notCancelled = this._dialogEl.dispatchEvent(domEvent);
    return notCancelled;
  }

  /* ============================================================
     FOCUS TRAP — Accesibilidad
     ============================================================ */

  _trapFocus() {
    const focusable = this._contentEl.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), ' +
      'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (!focusable.length) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    // Forzar foco solo si el foco actual está fuera del modal
    // Evita interferir con drag & drop u otros estados activos del documento
    const active = document.activeElement;
    if (!this._contentEl.contains(active)) {
      // Pequeño defer para no interrumpir transiciones o eventos en curso
      requestAnimationFrame(() => first.focus());
    }

    this._focusTrap = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    };

    this._contentEl.addEventListener('keydown', this._focusTrap);
  }

  _releaseFocus() {
    if (this._focusTrap) {
      this._contentEl?.removeEventListener('keydown', this._focusTrap);
      this._focusTrap = null;
    }
    if (this._prevFocus) {
      try { this._prevFocus.focus(); } catch {}
      this._prevFocus = null;
    }
  }

  /* ============================================================
     UTILIDADES
     ============================================================ */

  _onTransitionEnd(el, cb) {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      el.removeEventListener('transitionend', handler);
      cb();
    };
    const handler = () => finish();
    el.addEventListener('transitionend', handler);
    // Fallback si no hay transición CSS
    setTimeout(finish, 350);
  }

  /* ============================================================
     BACKWARD COMPAT — API Bootstrap
     ============================================================ */

  // bootstrap.Modal(el).show() / .hide()
  static getInstance(elementId) {
    return MTS.Modal._instances?.[elementId] || null;
  }
};

// Registro de instancias para getInstance()
MTS.Modal._instances = {};
