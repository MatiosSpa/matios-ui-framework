/* ============================================================
   MATIOS UI — MTS.DocumentManagerPreviewPlugin  v1.4.0
   Sub-plugin de vista previa para MTS.DocumentManagerPlugin.

   Muestra un modal fullscreen con:
     - Iframe para renderizar el documento
     - Panel lateral colapsible con acordeón de sub-paneles
     - Sistema de sub-paneles extensible (workflow, tags, versiones, etc.)
     - Botones en el header: ← prev, → next, versión, Reemplazar, Descargar
     - Icono del tipo de archivo en el título

   El plugin NO intercepta onFileClick automáticamente.
   El dev conecta explícitamente:

     const dmPreview = new MTS.DocumentManagerPreviewPlugin({
       panels: [
         new MTS.DocumentManagerPreviewBasicInfoPanel(),
       ],
       urlResolver: function(item) {
         return '/api/documents/' + item.id + '/retrieve';
       },
       onDownload: function(item) {
         window.open('/api/documents/' + item.id + '/download');
       },
       onReplace: function(item, file, version) {
         console.log('[dmPreview.onReplace]', item, file, version);
         // http.post('/api/documents/' + item.id + '/replace', { file, version });
         // version: valor ingresado en el modal de confirmación (decimal: 1.1, 2.3, etc.)
       },
       onPrev: function(currentItem) {
         var files = dm.getItems().filter(function(i) { return i.type === 'file'; });
         var idx   = files.findIndex(function(i) { return i.id === currentItem.id; });
         if (idx > 0) dmPreview.show(files[idx - 1]);
       },
       onNext: function(currentItem) {
         var files = dm.getItems().filter(function(i) { return i.type === 'file'; });
         var idx   = files.findIndex(function(i) { return i.id === currentItem.id; });
         if (idx < files.length - 1) dmPreview.show(files[idx + 1]);
       },
     });

     new MTS.DocumentManagerPlugin({
       accept:  '.pdf,.docx,.xlsx',   // ← el preview lo hereda para onReplace
       onFileClick: function(item) {
         console.log('[dm.onFileClick]', item);
         dmPreview.show(item);
       },
       plugins: [dmPreview, dmContextMenu, dmWorkflow],
     });

   Interfaz de sub-panel:
     {
       key:     string             — ID único del ítem del acordeón
       label:   string             — título del ítem del acordeón
       icon:    string|null        — SVG inline opcional

       install(preview)            — se llama cuando el preview plugin se instala
       uninstall()                 — se llama cuando el preview plugin se desinstala
       render(item) → Element      — contenido sincrónico (skeleton/placeholder)
       load(item)   → Element | Promise<Element>  — carga asíncrona del contenido real
     }

   Opciones:
     panels        Array   — sub-paneles del acordeón lateral
     urlResolver   fn      — function(item) → string | null  (URL del iframe)
     onDownload    fn      — function(item)  (botón "Descargar" en el header)
     onReplace     fn      — function(item, file, version)  (botón "Reemplazar" en el header)
                              Flujo: clic "Reemplazar" → file picker → modal de confirmación
                              (muestra archivo + input de versión) → clic "Subir" → callback
                              file: File seleccionado por el usuario
                              version: valor del input de versión en el modal de confirmación (decimal)
                              accept del file picker: heredado de dm._options.accept
     onPrev        fn      — function(currentItem)  (botón ← en el header)
     onNext        fn      — function(currentItem)  (botón → en el header)
     panelVisible  bool    — panel lateral visible al abrir (default: true)
     panelWidth    string  — ancho del panel lateral abierto (default: '340px')

   Dependencias: MTS.DocumentManagerPlugin, MTS.Modal, MTS.Accordion, MTS.Button, MTS.Icon
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DocumentManagerPreviewPlugin = class DocumentManagerPreviewPlugin {

  static descriptor = {
    name:     'MTS.DocumentManagerPreviewPlugin',
    version:  '1.4.0',
    type:     'documentManagerPreview',
    requires: ['MTS.DocumentManagerPlugin', 'MTS.Modal', 'MTS.Accordion'],
    provides: 'documentManagerPreview',
  };

  /* ----------------------------------------------------------
     CONSTRUCTOR
  ---------------------------------------------------------- */

  constructor(options) {
    options = options || {};

    this._options = {
      panels:       options.panels       || [],
      urlResolver:  options.urlResolver  || null,
      onDownload:   options.onDownload   || null,
      onReplace:    options.onReplace    || null,
      onPrev:       options.onPrev       || null,
      onNext:       options.onNext       || null,
      panelVisible: options.panelVisible !== false,
      panelWidth:   options.panelWidth   || '340px',
    };

    this._dm                = null;
    this._modal             = null;
    this._accordion         = null;
    this._iframe            = null;
    this._spinnerWrap       = null;
    this._panelEl           = null;
    this._panelInner        = null;
    this._toggleBtn         = null;
    this._accEl             = null;
    this._wrapEl            = null;   // contenedor flex principal (iframe + panel)
    this._currentItem       = null;
    this._panelLoaded       = {};
    this._panelOpen         = this._options.panelVisible;
    this._overrideUrl       = null;   // URL opcional pasada en show(item, url)
    this._replaceInput      = null;   // <input type="file"> oculto para onReplace
    this._versionBadgeEl    = null;   // badge read-only "V.x.x" en el header
    this._versionInputEl    = null;   // <input type="number"> en el modal de confirmación
    this._confirmFile       = null;   // File pendiente de confirmar
    this._confirmOverlayEl  = null;   // overlay de confirmación (position:absolute en wrap)
    this._confirmFileEl     = null;   // zona de info del archivo en el overlay
  }

  /* ----------------------------------------------------------
     CICLO DE VIDA — install / uninstall
  ---------------------------------------------------------- */

  install(dm) {
    this._dm = dm;
    var self = this;
    this._options.panels.forEach(function(panel) {
      if (typeof panel.install === 'function') panel.install(self);
    });
  }

  uninstall() {
    this._options.panels.forEach(function(panel) {
      if (typeof panel.uninstall === 'function') panel.uninstall();
    });
    if (this._modal) {
      this._modal.destroy();
      this._modal            = null;
      this._accordion        = null;
      this._iframe           = null;
      this._spinnerWrap      = null;
      this._panelEl          = null;
      this._panelInner       = null;
      this._toggleBtn        = null;
      this._accEl            = null;
      this._wrapEl           = null;
      this._replaceInput     = null;
      this._versionBadgeEl   = null;
      this._versionInputEl   = null;
      this._confirmFile      = null;
      this._confirmOverlayEl = null;
      this._confirmFileEl    = null;
    }
    this._dm          = null;
    this._currentItem = null;
    this._overrideUrl = null;
  }

  /* ----------------------------------------------------------
     API PÚBLICA
  ---------------------------------------------------------- */

  /**
   * Abre el modal de vista previa para el item dado.
   * @param {object} item — ítem del DocumentManagerPlugin (archivo)
   * @param {string} [url] — URL opcional del documento para el iframe.
   *   Si se omite, se usa urlResolver(item).
   *   Permite resolver la URL externamente antes de llamar a show():
   *     dmPreview.show(item, 'https://servidor.com/preview/' + item.id);
   */
  show(item, url) {
    this._currentItem = item;
    this._overrideUrl = url || null;
    this._panelLoaded = {};

    if (!this._modal) {
      this._buildModal();
    }

    this._updateTitle(item);
    this._updateVersionBadge(item);
    this._updateReplaceState(item);
    this._hideConfirm();
    this._resetIframe();
    this._refreshPanels(item);
    this._modal.show();
  }

  /** Cierra el modal */
  hide() {
    if (this._modal) this._modal.hide();
  }

  /* ----------------------------------------------------------
     CONSTRUCCIÓN DEL MODAL
  ---------------------------------------------------------- */

  _buildModal() {
    var self = this;
    var body = this._buildBody();

    this._modal = new MTS.Modal({
      size:     'fullscreen',
      closable: true,
      backdrop: false,
      static:   false,
      body:     body,
      onShown: function() {
        self._loadIframe(self._currentItem);
      },
      onHidden: function() {
        self._clearIframe();
      },
    });

    // Flush: sin padding y sin overflow en el body del modal —
    // el layout lo controla el wrap interno con flex row.
    this._modal._bodyEl.classList.add('mts-modal__body--flush');

    // El título del modal necesita display:flex para mostrar el ícono inline.
    // (Por defecto h5.mts-modal__title tiene white-space:nowrap y overflow:hidden)
    if (this._modal._titleEl) {
      this._modal._titleEl.style.display    = 'flex';
      this._modal._titleEl.style.alignItems = 'center';
      this._modal._titleEl.style.gap        = '6px';
      this._modal._titleEl.style.overflow   = 'hidden';
    }

    // Inyectar botones en el header: ← prev, → next, badge versión, Reemplazar, Descargar
    this._injectHeaderButtons();

    // Overlay de confirmación de reemplazo (sobre el wrap, position:absolute)
    if (this._options.onReplace) {
      this._buildConfirmOverlay();
    }
  }

  _injectHeaderButtons() {
    var self      = this;
    var headerEl  = this._modal._headerEl;
    var titleEl   = this._modal._titleEl;
    var closeBtnEl = headerEl.querySelector('.mts-modal__close');

    // — Botones de navegación: se insertan antes del título —
    // insertBefore(X, title) dos veces produce: [prev][next][title]
    if (this._options.onPrev) {
      var prevEl = document.createElement('button');
      prevEl.type = 'button';
      new MTS.Button(prevEl, {
        iconLeft: MTS.Icon ? MTS.Icon.get('arrow-left') : '←',
        iconOnly: true,
        size:     'sm',
        variant:  'ghost',
      }).on('click', function() {
        if (self._currentItem) self._options.onPrev(self._currentItem);
      });
      prevEl.setAttribute('title', 'Documento anterior');
      prevEl.setAttribute('aria-label', 'Documento anterior');
      headerEl.insertBefore(prevEl, titleEl);
    }

    if (this._options.onNext) {
      var nextEl = document.createElement('button');
      nextEl.type = 'button';
      new MTS.Button(nextEl, {
        iconLeft: MTS.Icon ? MTS.Icon.get('arrow-right') : '→',
        iconOnly: true,
        size:     'sm',
        variant:  'ghost',
      }).on('click', function() {
        if (self._currentItem) self._options.onNext(self._currentItem);
      });
      nextEl.setAttribute('title', 'Documento siguiente');
      nextEl.setAttribute('aria-label', 'Documento siguiente');
      headerEl.insertBefore(nextEl, titleEl);
    }

    // — Badge de versión (read-only): siempre presente, visible si item tiene versión —
    var badgeEl = document.createElement('span');
    badgeEl.className = 'dm-preview__version-badge';
    badgeEl.hidden    = true;
    this._versionBadgeEl = badgeEl;
    if (closeBtnEl) headerEl.insertBefore(badgeEl, closeBtnEl);
    else headerEl.appendChild(badgeEl);

    // — Botón "Reemplazar": abre file picker → modal de confirmación —
    if (this._options.onReplace) {
      var replaceEl = document.createElement('button');
      replaceEl.type = 'button';
      new MTS.Button(replaceEl, {
        label:    'Reemplazar',
        iconLeft: MTS.Icon ? MTS.Icon.get('upload') : '',
        size:     'sm',
        variant:  'ghost',
      }).on('click', function() {
        if (self._replaceInput) self._replaceInput.click();
      });
      if (closeBtnEl) headerEl.insertBefore(replaceEl, closeBtnEl);
      else headerEl.appendChild(replaceEl);
    }

    // — Botón de descarga: se inserta antes del botón × —
    if (this._options.onDownload) {
      var dlEl = document.createElement('button');
      dlEl.type = 'button';
      new MTS.Button(dlEl, {
        label:    'Descargar',
        iconLeft: MTS.Icon ? MTS.Icon.get('download') : '',
        size:     'sm',
        variant:  'ghost',
      }).on('click', function() {
        if (self._currentItem) self._options.onDownload(self._currentItem);
      });
      if (closeBtnEl) headerEl.insertBefore(dlEl, closeBtnEl);
      else headerEl.appendChild(dlEl);
    }
  }

  _buildBody() {
    var self = this;

    var wrap = document.createElement('div');
    wrap.className = 'dm-preview__wrap';
    this._wrapEl = wrap;

    // — Área del iframe —
    var iframeArea = document.createElement('div');
    iframeArea.className = 'dm-preview__iframe-area';

    // Spinner overlay
    var spinnerWrap = document.createElement('div');
    spinnerWrap.className = 'dm-preview__spinner-wrap';
    var spinner = document.createElement('div');
    spinner.className = 'mts-spinner';
    spinnerWrap.appendChild(spinner);
    this._spinnerWrap = spinnerWrap;

    // Iframe
    this._iframe = document.createElement('iframe');
    this._iframe.className = 'dm-preview__iframe';
    this._iframe.setAttribute('frameborder', '0');
    this._iframe.setAttribute('title', 'Vista previa del documento');

    // Botón toggle del panel lateral
    var toggleBtn = document.createElement('button');
    toggleBtn.className = 'dm-preview__toggle-btn';
    toggleBtn.setAttribute('type', 'button');
    toggleBtn.setAttribute('aria-label', 'Mostrar u ocultar panel lateral');
    toggleBtn.innerHTML = this._panelOpen ? this._chevronRight() : this._chevronLeft();
    toggleBtn.addEventListener('click', function() {
      self._togglePanel();
    });
    this._toggleBtn = toggleBtn;

    iframeArea.appendChild(spinnerWrap);
    iframeArea.appendChild(this._iframe);
    iframeArea.appendChild(toggleBtn);

    wrap.appendChild(iframeArea);

    // — Panel lateral colapsible —
    if (this._options.panels.length > 0) {
      var panel = document.createElement('div');
      panel.className = 'dm-preview__panel';
      panel.style.setProperty('--dm-preview-panel-width', this._options.panelWidth);
      if (this._panelOpen) panel.classList.add('dm-preview__panel--open');

      var panelInner = document.createElement('div');
      panelInner.className = 'dm-preview__panel-inner';

      var accEl = document.createElement('div');
      panelInner.appendChild(accEl);
      panel.appendChild(panelInner);
      wrap.appendChild(panel);

      this._panelEl    = panel;
      this._panelInner = panelInner;
      this._accEl      = accEl;

      this._buildAccordion(accEl);
    } else {
      // Sin paneles: ocultar botón de toggle
      toggleBtn.hidden = true;
    }

    // — File input oculto para "Reemplazar" —
    if (this._options.onReplace) {
      var replaceInput = document.createElement('input');
      replaceInput.type   = 'file';
      replaceInput.hidden = true;
      replaceInput.addEventListener('change', function() {
        var file = replaceInput.files && replaceInput.files[0];
        if (!file) return;
        // No dispara onReplace inmediatamente — abre el modal de confirmación
        self._showConfirm(file);
        // Reset aquí para que el mismo archivo pueda seleccionarse de nuevo si cancela
        replaceInput.value = '';
      });
      wrap.appendChild(replaceInput);
      this._replaceInput = replaceInput;
    }

    return wrap;
  }

  _buildAccordion(container) {
    var self   = this;
    var panels = this._options.panels;
    if (!panels.length) return;

    var items = panels.map(function(panel, index) {
      return {
        id:      panel.key,
        title:   panel.label,
        icon:    panel.icon || null,
        open:    index === 0,
        content: function() {
          var div = document.createElement('div');
          div.className = 'dm-preview__acc-content';
          return div;
        },
      };
    });

    this._accordion = new MTS.Accordion(container, {
      items:    items,
      flush:    true,
      multiple: true,
      onOpen: function(e) {
        var key   = e.detail.id;
        var panel = self._findPanel(key);
        if (panel && !self._panelLoaded[key]) {
          self._loadPanel(panel, key);
        }
      },
    });
  }

  /* ----------------------------------------------------------
     CARGA DE SUB-PANELES
  ---------------------------------------------------------- */

  _refreshPanels(item) {
    var self = this;
    this._panelLoaded = {};

    if (!this._accordion) return;

    // Limpiar contenido previo de todos los paneles
    this._options.panels.forEach(function(panel) {
      var inner = self._getAccContent(panel.key);
      if (inner) inner.replaceChildren();
    });

    // Cargar los paneles que están abiertos actualmente
    this._options.panels.forEach(function(panel) {
      if (self._accordion.isOpen(panel.key)) {
        self._loadPanel(panel, panel.key);
      }
    });
  }

  _loadPanel(panel, key) {
    var self  = this;
    var item  = this._currentItem;
    var inner = this._getAccContent(key);
    if (!inner) return;

    // Render sincrónico: skeleton o placeholder
    if (typeof panel.render === 'function') {
      var skeleton = panel.render(item);
      if (skeleton instanceof Element) {
        inner.replaceChildren(skeleton);
        this._refreshAccordionHeight(key);
      }
    }

    // Load asíncrono: contenido real
    if (typeof panel.load === 'function') {
      var result = panel.load(item);

      if (result && typeof result.then === 'function') {
        result.then(function(el) {
          // Verificar que el item sigue siendo el mismo (protección contra race conditions)
          if (self._currentItem !== item) return;
          if (el instanceof Element) {
            inner.replaceChildren(el);
            self._refreshAccordionHeight(key);
          }
        }).catch(function(err) {
          console.error('[MTS.DocumentManagerPreviewPlugin] Error al cargar panel "' + key + '":', err);
        });
      } else if (result instanceof Element) {
        inner.replaceChildren(result);
        this._refreshAccordionHeight(key);
      }
    }

    this._panelLoaded[key] = true;
  }

  _refreshAccordionHeight(key) {
    if (!this._accEl) return;
    var body = this._accEl.querySelector('#mts-acc-body-' + key);
    if (!body || !body.classList.contains('mts-accordion__body--open')) return;
    // RAF para asegurar que el DOM está actualizado antes de medir
    requestAnimationFrame(function() {
      body.style.maxHeight = body.scrollHeight + 'px';
    });
  }

  _getAccContent(key) {
    if (!this._accEl) return null;
    return this._accEl.querySelector('#mts-acc-body-' + key + ' .dm-preview__acc-content');
  }

  /* ----------------------------------------------------------
     IFRAME
  ---------------------------------------------------------- */

  _loadIframe(item) {
    // Prioridad: URL pasada en show(item, url) > urlResolver(item)
    var url = this._overrideUrl;
    if (!url && this._options.urlResolver && item) {
      url = this._options.urlResolver(item);
    }
    if (!url) return;

    var self = this;
    this._spinnerWrap.classList.add('dm-preview__spinner-wrap--visible');
    this._iframe.onload = function() {
      self._spinnerWrap.classList.remove('dm-preview__spinner-wrap--visible');
    };
    // Asignar src fuera del hilo principal para no bloquear la animación de entrada
    setTimeout(function() {
      self._iframe.src = url;
    }, 1);
  }

  _resetIframe() {
    if (this._iframe) {
      this._iframe.onload = null;
      this._iframe.src    = 'about:blank';
    }
    if (this._spinnerWrap) {
      this._spinnerWrap.classList.remove('dm-preview__spinner-wrap--visible');
    }
  }

  _clearIframe() {
    if (this._iframe) {
      this._iframe.onload = null;
      this._iframe.src    = 'about:blank';
    }
  }

  /* ----------------------------------------------------------
     PANEL LATERAL
  ---------------------------------------------------------- */

  _togglePanel() {
    this._panelOpen = !this._panelOpen;

    if (this._panelEl) {
      this._panelEl.classList.toggle('dm-preview__panel--open', this._panelOpen);
    }

    if (this._toggleBtn) {
      this._toggleBtn.innerHTML = this._panelOpen
        ? this._chevronRight()
        : this._chevronLeft();
    }
  }

  /* ----------------------------------------------------------
     TÍTULO DEL MODAL — con icono del tipo de archivo
  ---------------------------------------------------------- */

  _updateTitle(item) {
    if (!this._modal || !item) return;

    var iconName = this._fileIconName(item);
    var iconHtml = '';

    if (window.MTS && MTS.Icon) {
      var svg = MTS.Icon.get(iconName);
      if (svg) {
        iconHtml = '<span class="dm-preview__title-icon">' + svg + '</span>';
      }
    }

    var name = this._escHtml(item.name || '');
    this._modal.setTitle(
      iconHtml + '<span class="dm-preview__title-text">' + name + '</span>'
    );
  }

  /* ----------------------------------------------------------
     REEMPLAZAR — overlay de confirmación + badge de versión
  ---------------------------------------------------------- */

  /**
   * Construye el overlay de confirmación (position:absolute sobre el wrap).
   * Se llama una sola vez desde _buildModal().
   */
  _buildConfirmOverlay() {
    var self = this;

    var overlay = document.createElement('div');
    overlay.className = 'dm-preview__confirm-overlay';
    overlay.hidden    = true;

    var card = document.createElement('div');
    card.className = 'dm-preview__confirm-card';

    // — Título de la card —
    var titleEl = document.createElement('p');
    titleEl.className   = 'dm-preview__confirm-card-title';
    titleEl.textContent = 'Reemplazar documento';

    // — Info del archivo seleccionado (poblada en _showConfirm) —
    var fileEl = document.createElement('div');
    fileEl.className = 'dm-preview__confirm-file';
    this._confirmFileEl = fileEl;

    // — Fila de versión —
    var verRow = document.createElement('div');
    verRow.className = 'dm-preview__confirm-version';

    var verLabel = document.createElement('label');
    verLabel.className   = 'dm-preview__confirm-version-label';
    verLabel.textContent = 'Nueva versión:';
    verLabel.setAttribute('for', 'dm-preview-ver-input');

    var verInput = document.createElement('input');
    verInput.type      = 'number';
    verInput.id        = 'dm-preview-ver-input';
    verInput.min       = '0';
    verInput.step      = 'any';
    verInput.className = 'dm-preview__version-input';
    verInput.setAttribute('aria-label', 'Nueva versión del documento');
    this._versionInputEl = verInput;

    verRow.appendChild(verLabel);
    verRow.appendChild(verInput);

    // — Acciones —
    var actionsEl = document.createElement('div');
    actionsEl.className = 'dm-preview__confirm-actions';

    var cancelEl = document.createElement('button');
    cancelEl.type = 'button';
    new MTS.Button(cancelEl, {
      label:   'Cancelar',
      size:    'sm',
      variant: 'ghost',
    }).on('click', function() {
      self._hideConfirm();
    });

    var submitEl = document.createElement('button');
    submitEl.type = 'button';
    new MTS.Button(submitEl, {
      label:    'Subir',
      iconLeft: MTS.Icon ? MTS.Icon.get('upload') : '',
      size:     'sm',
      variant:  'primary',
    }).on('click', function() {
      if (!self._confirmFile) return;
      var version = parseFloat(self._versionInputEl.value) || 0;
      self._options.onReplace(self._currentItem, self._confirmFile, version);
      self._hideConfirm();
    });

    actionsEl.appendChild(cancelEl);
    actionsEl.appendChild(submitEl);

    card.appendChild(titleEl);
    card.appendChild(fileEl);
    card.appendChild(verRow);
    card.appendChild(actionsEl);
    overlay.appendChild(card);
    this._wrapEl.appendChild(overlay);

    this._confirmOverlayEl = overlay;
  }

  /**
   * Muestra el overlay de confirmación con los datos del archivo seleccionado.
   */
  _showConfirm(file) {
    this._confirmFile = file;

    // Versión sugerida: actual + 0.1, redondeada a 1 decimal
    if (this._versionInputEl) {
      var current = parseFloat(this._currentItem && this._currentItem.version) || 1;
      var next    = Math.round((current + 0.1) * 10) / 10;
      this._versionInputEl.value = next;
    }

    // Poblar info del archivo
    this._renderConfirmFile(file);

    if (this._confirmOverlayEl) {
      this._confirmOverlayEl.hidden = false;
    }
  }

  /**
   * Oculta el overlay de confirmación y limpia el estado pendiente.
   */
  _hideConfirm() {
    if (this._confirmOverlayEl) {
      this._confirmOverlayEl.hidden = true;
    }
    this._confirmFile = null;
  }

  /**
   * Rellena la zona de info del archivo en el overlay de confirmación.
   */
  _renderConfirmFile(file) {
    var fileEl = this._confirmFileEl;
    if (!fileEl) return;
    fileEl.replaceChildren();

    // Ícono del tipo de archivo
    var iconEl = document.createElement('span');
    iconEl.className = 'dm-preview__confirm-file-icon';
    var dotIdx   = file.name.lastIndexOf('.');
    var ext      = dotIdx !== -1 ? file.name.slice(dotIdx + 1) : '';
    var iconName = this._fileIconName({ ext: ext, mimeType: file.type });
    if (window.MTS && MTS.Icon) {
      iconEl.innerHTML = MTS.Icon.get(iconName) || '';
    }

    // Info: nombre + tamaño
    var infoEl = document.createElement('div');
    infoEl.className = 'dm-preview__confirm-file-info';

    var nameEl = document.createElement('span');
    nameEl.className   = 'dm-preview__confirm-file-name';
    nameEl.textContent = file.name;
    nameEl.title       = file.name;

    var sizeEl = document.createElement('span');
    sizeEl.className   = 'dm-preview__confirm-file-size';
    sizeEl.textContent = this._formatBytes(file.size);

    infoEl.appendChild(nameEl);
    infoEl.appendChild(sizeEl);
    fileEl.appendChild(iconEl);
    fileEl.appendChild(infoEl);
  }

  /**
   * Actualiza el badge de versión en el header del modal.
   * Se llama en cada show(item).
   */
  _updateVersionBadge(item) {
    if (!this._versionBadgeEl) return;
    if (item && item.version != null && item.version !== '') {
      this._versionBadgeEl.textContent = 'v' + item.version;
      this._versionBadgeEl.hidden      = false;
    } else {
      this._versionBadgeEl.hidden = true;
    }
  }

  /**
   * Actualiza el accept del file picker con los tipos del DocumentManagerPlugin.
   * Se llama en cada show(item).
   */
  _updateReplaceState(item) {
    if (!this._options.onReplace || !this._replaceInput) return;
    var accept = (this._dm && this._dm._options && this._dm._options.accept)
               ? this._dm._options.accept
               : '*';
    this._replaceInput.accept = (accept === '*') ? '' : accept;
  }

  /**
   * Formatea un tamaño en bytes a una cadena legible (B / KB / MB).
   */
  _formatBytes(bytes) {
    if (bytes == null || isNaN(bytes)) return '';
    if (bytes < 1024)             return bytes + ' B';
    if (bytes < 1024 * 1024)      return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /* ----------------------------------------------------------
     UTILIDADES
  ---------------------------------------------------------- */

  /**
   * Mapea extensión o mimeType del ítem al nombre del ícono de MTS.Icon.
   */
  _fileIconName(item) {
    var ext  = ((item.ext  || item.extension || '')).toLowerCase();
    var mime = ((item.mimeType || item.contentType || '')).toLowerCase();

    if (ext === 'pdf' || mime === 'application/pdf')                              return 'file-pdf';
    if (ext === 'doc'  || ext === 'docx' || mime.indexOf('word') !== -1)          return 'file-word';
    if (ext === 'xls'  || ext === 'xlsx' || mime.indexOf('excel') !== -1
        || mime.indexOf('spreadsheet') !== -1)                                    return 'file-excel';
    if (ext === 'ppt'  || ext === 'pptx' || mime.indexOf('powerpoint') !== -1
        || mime.indexOf('presentation') !== -1)                                   return 'file-powerpoint';
    if (ext === 'mpp'  || mime.indexOf('project') !== -1)                         return 'file-project';
    if (ext === 'vsd'  || ext === 'vsdx' || mime.indexOf('visio') !== -1)         return 'file-visio';
    if (ext === 'one'  || mime.indexOf('onenote') !== -1)                         return 'file-onenote';
    if (ext === 'msg'  || mime.indexOf('outlook') !== -1
        || mime.indexOf('message') !== -1)                                        return 'file-outlook';
    if (ext === 'jpg'  || ext === 'jpeg' || ext === 'png' || ext === 'gif'
        || ext === 'webp' || ext === 'svg' || ext === 'bmp' || ext === 'tiff'
        || mime.indexOf('image/') === 0)                                           return 'file-image';
    if (ext === 'mp4'  || ext === 'avi'  || ext === 'mov' || ext === 'mkv'
        || ext === 'webm' || mime.indexOf('video/') === 0)                        return 'file-video';
    if (ext === 'mp3'  || ext === 'wav'  || ext === 'ogg' || ext === 'aac'
        || ext === 'flac' || mime.indexOf('audio/') === 0)                        return 'file-audio';
    if (ext === 'zip'  || ext === 'rar'  || ext === '7z'  || ext === 'tar'
        || ext === 'gz'  || mime.indexOf('zip') !== -1
        || mime.indexOf('compressed') !== -1)                                     return 'file-zip';
    if (ext === 'csv'  || mime.indexOf('csv') !== -1)                             return 'file-csv';
    if (ext === 'js'   || ext === 'ts'   || ext === 'html' || ext === 'css'
        || ext === 'json' || ext === 'xml' || ext === 'py' || ext === 'java'
        || ext === 'cs'  || ext === 'php' || ext === 'sql'
        || mime.indexOf('javascript') !== -1 || mime.indexOf('json') !== -1
        || mime.indexOf('/html') !== -1  || mime.indexOf('/xml') !== -1)          return 'file-code';
    if (ext === 'txt'  || ext === 'md'   || ext === 'rtf'
        || mime.indexOf('text/') === 0)                                           return 'file-text';
    if (item.type === 'folder')                                                   return 'folder';
    return 'file';
  }

  _findPanel(key) {
    var panels = this._options.panels;
    for (var i = 0; i < panels.length; i++) {
      if (panels[i].key === key) return panels[i];
    }
    return null;
  }

  /** Escapa caracteres HTML especiales para insertar texto en innerHTML */
  _escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Panel abierto → flecha apunta a la derecha (clic = colapsar)
  _chevronRight() {
    return '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
           '<path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
           '</svg>';
  }

  // Panel cerrado → flecha apunta a la izquierda (clic = expandir)
  _chevronLeft() {
    return '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">' +
           '<path d="M10 3l-5 5 5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
           '</svg>';
  }
};


/* ============================================================
   MTS.DocumentManagerPreviewBasicInfoPanel  v1.1.0
   Panel de información básica — built-in.

   Muestra los metadatos del ítem en layout compacto inline:
     Nombre:     Política de Privacidad.pdf
     Tipo:       application/pdf
     Tamaño:     500 KB
     Versión:    3.1
     Creado:     2024-06-01
     Modificado: 2025-01-15
     Estado:     active
     Propietario: Área Legal

   Puede usarse tal cual o como referencia para crear paneles personalizados.
   ============================================================ */

MTS.DocumentManagerPreviewBasicInfoPanel = class DocumentManagerPreviewBasicInfoPanel {

  get key()   { return 'dm-basic-info'; }
  get label() { return 'Información básica'; }
  get icon()  { return null; }

  install(preview) {
    this._preview = preview;
  }

  uninstall() {
    this._preview = null;
  }

  /** Skeleton de carga */
  render(item) {
    var wrap = document.createElement('div');
    wrap.className = 'dm-preview__basic-info dm-preview__basic-info--loading';
    for (var i = 0; i < 6; i++) {
      var row = document.createElement('div');
      row.className = 'dm-preview__info-skeleton-row';
      wrap.appendChild(row);
    }
    return wrap;
  }

  /** Contenido real — acepta async; en producción haría un fetch */
  load(item) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(MTS.DocumentManagerPreviewBasicInfoPanel._buildContent(item));
      }, 0);
    });
  }

  static _buildContent(item) {
    // "Tipo" muestra mimeType si está disponible, si no ext, si no el campo type.
    var tipo = item.mimeType || item.contentType
            || (item.ext ? '.' + item.ext : null)
            || item.type
            || '—';

    var fields = [
      { label: 'Nombre',      value: item.name          || '—' },
      { label: 'Tipo',        value: tipo                       },
      { label: 'Tamaño',      value: item.sizeFormatted  || (item.size ? String(item.size) : '—') },
      { label: 'Versión',     value: item.version        || '—' },
      { label: 'Creado',      value: item.createdAt      || '—' },
      { label: 'Modificado',  value: item.modifiedAt     || item.updatedAt || '—' },
      { label: 'Estado',      value: item.status         || '—' },
      { label: 'Propietario', value: item.owner          || item.author || '—' },
    ];

    var wrap = document.createElement('div');
    wrap.className = 'dm-preview__basic-info';

    fields.forEach(function(field) {
      var row = document.createElement('div');
      row.className = 'dm-preview__info-row';

      var label = document.createElement('span');
      label.className   = 'dm-preview__info-label';
      label.textContent = field.label + ':';

      var value = document.createElement('span');
      value.className   = 'dm-preview__info-value';
      value.textContent = field.value;
      value.title       = field.value;   // tooltip para valores truncados

      row.appendChild(label);
      row.appendChild(value);
      wrap.appendChild(row);
    });

    return wrap;
  }
};
