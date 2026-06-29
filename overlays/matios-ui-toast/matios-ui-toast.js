/* ============================================================
   MATIOS UI — matios-ui-toast.js
   MTS.Toast — Notificaciones fugaces (snackbar)
   Version: 1.0.0
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Toast = (() => {
  const CONTAINERS = {};

  /* Obtener o crear el contenedor de una posición */
  function _getContainer(position) {
    if (CONTAINERS[position]) return CONTAINERS[position];
    const c = document.createElement('div');
    c.className = `mts-toast-container mts-toast-container--${position}`;
    document.body.appendChild(c);
    CONTAINERS[position] = c;
    return c;
  }

  /**
   * MTS.Toast.show(options)
   * @param {object} options
   * @param {string}   options.message    Texto del toast (requerido)
   * @param {string}   options.title      Título opcional
   * @param {string}   options.variant    'default'|'success'|'warning'|'danger'|'info' — default: 'default'
   * @param {string}   options.position   'top-right'|'top-left'|'top-center'|
   *                                       'bottom-right'|'bottom-left'|'bottom-center'
   *                                       default: 'bottom-right'
   * @param {number}   options.duration   ms antes de cerrar — 0 = no cierra — default: 4000
   * @param {boolean}  options.closable   Botón × — default: true
   * @param {string}   options.icon       HTML de ícono override
   * @param {string}   options.action     Label del botón de acción
   * @param {function} options.onAction   Callback del botón de acción
   * @param {function} options.onClose    Callback al cerrar
   * @returns {object} { close() }
   */
  function show(options = {}) {
    // Toast variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'loading'
    // Variante del toast
    const variant = options.variant || 'default';

    // Position: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center'
    // Posición en pantalla
    const position = options.position || 'bottom-right';

    // Duration in ms before auto-close (0 = no auto-close) / Duración en ms antes de cerrar (0 = no cierra)
    const duration = options.duration ?? (variant === 'loading' ? 0 : 4000);

    // Show close button / Mostrar botón de cierre
    const closable = options.closable ?? (variant !== 'loading');

    const container = _getContainer(position);

    /* Ícono por variante */
    const ICONS = {
      default: MTS.Icon.get('alert-circle'),
      success: MTS.Icon.get('check'),
      warning: MTS.Icon.get('alert-triangle'),
      danger:  MTS.Icon.get('x-circle'),
      info:    MTS.Icon.get('info'),
      loading: `<span class="mts-toast__spinner"></span>`,
    };

    const toast = document.createElement('div');
    toast.className = `mts-toast mts-toast--${variant}`;
    toast.setAttribute('role', 'alert');

    /* Ícono */
    const iconWrap = document.createElement('div');
    iconWrap.className = 'mts-toast__icon';
    iconWrap.innerHTML = options.icon || ICONS[variant] || ICONS.default;
    toast.appendChild(iconWrap);

    /* Contenido */
    const content = document.createElement('div');
    content.className = 'mts-toast__content';
    if (options.title) {
      const title = document.createElement('div');
      title.className = 'mts-toast__title';
      title.textContent = options.title;
      content.appendChild(title);
    }
    const msg = document.createElement('div');
    msg.className = 'mts-toast__message';
    msg.textContent = options.message;
    content.appendChild(msg);

    /* Botón acción */
    if (options.action) {
      const actBtn = document.createElement('button');
      actBtn.className = 'mts-toast__action';
      actBtn.textContent = options.action;
      actBtn.addEventListener('click', () => {
        if (options.onAction) options.onAction({ type: 'action' });
        close();
      });
      content.appendChild(actBtn);
    }

    toast.appendChild(content);

    /* Botón cerrar */
    if (closable) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'mts-toast__close';
      closeBtn.innerHTML = '×';
      closeBtn.addEventListener('click', close);
      toast.appendChild(closeBtn);
    }

    /* Barra de progreso */
    if (duration > 0) {
      const bar = document.createElement('div');
      bar.className = 'mts-toast__progress';
      bar.style.animationDuration = duration + 'ms';
      toast.appendChild(bar);
    }

    /* Insertar desde abajo en posiciones bottom, desde arriba en top */
    const isBottom = position.startsWith('bottom');
    if (isBottom) container.appendChild(toast);
    else container.insertBefore(toast, container.firstChild);

    /* Animar entrada */
    requestAnimationFrame(() => toast.classList.add('mts-toast--visible'));

    /* Auto-close */
    let timer = null;
    if (duration > 0) {
      timer = setTimeout(close, duration);
    }

    function close() {
      clearTimeout(timer);
      toast.classList.remove('mts-toast--visible');
      toast.classList.add('mts-toast--hiding');
      toast.addEventListener('transitionend', () => {
        toast.remove();
        if (options.onClose) options.onClose({ type: 'close' });
      }, { once: true });
    }

    return { close };
  }

  /* Atajos por variante */
  ['success', 'warning', 'danger', 'info', 'loading'].forEach(v => {
    show[v] = (message, opts = {}) => show({ ...opts, message, variant: v });
  });

  return { show };
})();
