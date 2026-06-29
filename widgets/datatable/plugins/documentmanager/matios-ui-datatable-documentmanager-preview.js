/* ============================================================
   MATIOS UI — MTS.DocumentManagerPreviewPlugin  v1.7.0
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
         // Debe retornar Promise para activar la barra de progreso indeterminada.
         // En producción usa MTS.HttpClient.upload():
         return http.upload('/api/documents/' + item.id + '/replace', file, {
           data: { version: version },
         }).then(function(res) {
           if (!res.success) throw new Error(res.message || 'Error al subir.');
         });
       },
       onPrev: function(currentItem) {
         let files = dm.getItems().filter(function(i) { return i.type === 'file'; });
         let idx   = files.findIndex(function(i) { return i.id === currentItem.id; });
         if (idx > 0) dmPreview.show(files[idx - 1]);
       },
       onNext: function(currentItem) {
         let files = dm.getItems().filter(function(i) { return i.type === 'file'; });
         let idx   = files.findIndex(function(i) { return i.id === currentItem.id; });
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
     onReplace     fn      — function(item, file, version)
                              Flujo: clic "Reemplazar" → file picker → modal de confirmación
                              (archivo + versión) → clic "Subir" → callback
                              file: File seleccionado
                              version: entero del input de versión
                              Debe retornar Promise para activar barra indeterminada/éxito/error
                              accept del file picker: heredado de dm._options.accept
     onPrev        fn      — function(currentItem)  (botón ← en el header)
     onNext        fn      — function(currentItem)  (botón → en el header)
     panelVisible  bool    — panel lateral visible al abrir (default: true)
     panelWidth    string  — ancho del panel lateral abierto (default: '340px')

   Dependencias: MTS.DocumentManagerPlugin, MTS.Modal, MTS.Accordion, MTS.Button, MTS.Badge, MTS.Icon


   ── CONTRATO DE CAMPOS (item) ───────────────────────────────
   Los paneles y features del plugin leen los siguientes campos
   del objeto `item` recibido de MTS.DocumentManagerPlugin.
   El dev es libre de incluir solo los que necesite; los campos
   ausentes se omiten o muestran '—'.

   Campo          Tipo          Usado por
   ─────────────────────────────────────────────────────────────
   id             string|num    urlResolver, onDownload, onReplace
   name           string        Título del modal, BasicInfoPanel
   type           'file'|'folder'  Ícono del modal, BasicInfoPanel (Tipo)
   ext            string        Ícono del modal, mismatch warning, BasicInfoPanel (Tipo)
   mimeType       string        Ícono del modal, BasicInfoPanel (Tipo)
   contentType    string        Ícono del modal, BasicInfoPanel (Tipo)
   version        string|num    Badge de versión en header, BasicInfoPanel (Versión)
                                  El input de nueva versión sugiere parseInt(version)+1
   sizeFormatted  string        BasicInfoPanel (Tamaño)  ← preferido
   size           number        BasicInfoPanel (Tamaño)  ← fallback (se convierte a string)
   createdAt      string        BasicInfoPanel (Creado)
   modifiedAt     string        BasicInfoPanel (Modificado)  ← preferido
   updatedAt      string        BasicInfoPanel (Modificado)  ← fallback
   status         string        BasicInfoPanel (Estado)
   owner          string        BasicInfoPanel (Propietario)  ← preferido
   author         string        BasicInfoPanel (Propietario)  ← fallback

   Los paneles personalizados pueden leer cualquier campo adicional
   que el dev incluya en sus objetos de datos. El contrato anterior
   aplica solo a los paneles built-in.
   ─────────────────────────────────────────────────────────────
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DocumentManagerPreviewPlugin = class DocumentManagerPreviewPlugin {

  static descriptor = {
    name:     'MTS.DocumentManagerPreviewPlugin',
    version:  '1.7.0',
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
    this._versionBadgeEl    = null;   // elemento del badge read-only en el header
    this._versionBadgeApi   = null;   // instancia MTS.Badge del badge de versión
    this._versionInputEl    = null;   // <input type="number"> en el modal de confirmación
    this._confirmFile       = null;   // File pendiente de confirmar
    this._extMismatch       = false;  // true si la extensión del archivo no coincide
    this._confirmOverlayEl  = null;   // overlay de confirmación (position:absolute en wrap)
    this._confirmFileEl     = null;   // zona de info del archivo en el overlay
    this._confirmContentEl  = null;   // zona dinámica: versión / spinner / estado
    this._confirmActionsEl  = null;   // zona de botones del overlay
    this._confirmVerRowEl   = null;   // fila de versión (reutilizada entre estados)
    this._confirmCancelEl   = null;   // botón Cancelar (reutilizado)
    this._confirmSubmitEl   = null;   // botón Subir (reutilizado)
  }

  /* ----------------------------------------------------------
     CICLO DE VIDA — install / uninstall
  ---------------------------------------------------------- */

  install(dm) {
    this._dm = dm;
    let self = this;
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
      this._versionBadgeApi  = null;
      this._versionInputEl   = null;
      this._confirmFile      = null;
      this._extMismatch      = false;
      this._confirmOverlayEl = null;
      this._confirmFileEl    = null;
      this._confirmContentEl = null;
      this._confirmActionsEl = null;
      this._confirmVerRowEl  = null;
      this._confirmCancelEl  = null;
      this._confirmSubmitEl  = null;
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
    let self = this;
    let body = this._buildBody();

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
    let self      = this;
    let headerEl  = this._modal._headerEl;
    let titleEl   = this._modal._titleEl;
    let closeBtnEl = headerEl.querySelector('.mts-modal__close');

    // — Botones de navegación: se insertan antes del título —
    // insertBefore(X, title) dos veces produce: [prev][next][title]
    if (this._options.onPrev) {
      let prevEl = document.createElement('button');
      prevEl.type = 'button';
      new MTS.Button(prevEl, {
        iconLeft: MTS.Icon ? MTS.Icon.get('arrow-left') : '←',
        iconOnly: true,
        size:     'sm',
        variant:  'ghost',
      }).on('click', function() {
        if (self._currentItem) self._options.onPrev(self._currentItem);
      });
      prevEl.setAttribute('title',      this._t('prevDoc', 'Documento anterior'));
      prevEl.setAttribute('aria-label', this._t('prevDoc', 'Documento anterior'));
      headerEl.insertBefore(prevEl, titleEl);
    }

    if (this._options.onNext) {
      let nextEl = document.createElement('button');
      nextEl.type = 'button';
      new MTS.Button(nextEl, {
        iconLeft: MTS.Icon ? MTS.Icon.get('arrow-right') : '→',
        iconOnly: true,
        size:     'sm',
        variant:  'ghost',
      }).on('click', function() {
        if (self._currentItem) self._options.onNext(self._currentItem);
      });
      nextEl.setAttribute('title',      this._t('nextDoc', 'Documento siguiente'));
      nextEl.setAttribute('aria-label', this._t('nextDoc', 'Documento siguiente'));
      headerEl.insertBefore(nextEl, titleEl);
    }

    // — Badge de versión (read-only): MTS.Badge, hidden al inicio.
    //   No se inserta aquí — _updateTitle() lo adjunta al span del nombre. —
    let badgeEl = document.createElement('span');
    this._versionBadgeEl  = badgeEl;
    this._versionBadgeApi = new MTS.Badge(badgeEl, {
      label:   '',
      variant: 'primary',
      size:    'xs',
      shape:   'pill',
    });
    this._versionBadgeApi.hide();

    // — Botón "Reemplazar": abre file picker → modal de confirmación —
    if (this._options.onReplace) {
      let replaceEl = document.createElement('button');
      replaceEl.type = 'button';
      new MTS.Button(replaceEl, {
        label:    this._t('replace', 'Reemplazar'),
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
      let dlEl = document.createElement('button');
      dlEl.type = 'button';
      new MTS.Button(dlEl, {
        label:    this._t('download', 'Descargar'),
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
    let self = this;

    let wrap = document.createElement('div');
    wrap.className = 'dm-preview__wrap';
    this._wrapEl = wrap;

    // — Área del iframe —
    let iframeArea = document.createElement('div');
    iframeArea.className = 'dm-preview__iframe-area';

    // Spinner overlay
    let spinnerWrap = document.createElement('div');
    spinnerWrap.className = 'dm-preview__spinner-wrap';
    let spinner = document.createElement('div');
    spinner.className = 'mts-spinner';
    spinnerWrap.appendChild(spinner);
    this._spinnerWrap = spinnerWrap;

    // Iframe
    this._iframe = document.createElement('iframe');
    this._iframe.className = 'dm-preview__iframe';
    this._iframe.setAttribute('frameborder', '0');
    this._iframe.setAttribute('title', this._t('iframeTitle', 'Vista previa del documento'));

    // Botón toggle del panel lateral
    let toggleBtn = document.createElement('button');
    toggleBtn.className = 'dm-preview__toggle-btn';
    toggleBtn.setAttribute('type', 'button');
    toggleBtn.setAttribute('aria-label', this._t('panelToggle', 'Mostrar u ocultar panel lateral'));
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
      let panel = document.createElement('div');
      panel.className = 'dm-preview__panel';
      panel.style.setProperty('--dm-preview-panel-width', this._options.panelWidth);
      if (this._panelOpen) panel.classList.add('dm-preview__panel--open');

      let panelInner = document.createElement('div');
      panelInner.className = 'dm-preview__panel-inner';

      let accEl = document.createElement('div');
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
      let replaceInput = document.createElement('input');
      replaceInput.type   = 'file';
      replaceInput.hidden = true;
      replaceInput.addEventListener('change', function() {
        let file = replaceInput.files && replaceInput.files[0];
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
    let self   = this;
    let panels = this._options.panels;
    if (!panels.length) return;

    let items = panels.map(function(panel, index) {
      return {
        id:      panel.key,
        title:   panel.label,
        icon:    panel.icon || null,
        open:    index === 0,
        content: function() {
          let div = document.createElement('div');
          div.className = 'dm-preview__acc-content';
          return div;
        },
      };
    });

    this._accordion = new MTS.Accordion(container, {
      items:    items,
      flush:    true,
      multiple: false,
      onOpen: function(e) {
        let key   = e.detail.id;
        let panel = self._findPanel(key);
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
    let self = this;
    this._panelLoaded = {};

    if (!this._accordion) return;

    // Limpiar contenido previo de todos los paneles
    this._options.panels.forEach(function(panel) {
      let inner = self._getAccContent(panel.key);
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
    let self  = this;
    let item  = this._currentItem;
    let inner = this._getAccContent(key);
    if (!inner) return;

    // Render sincrónico: skeleton o placeholder
    if (typeof panel.render === 'function') {
      let skeleton = panel.render(item);
      if (skeleton instanceof Element) {
        inner.replaceChildren(skeleton);
        this._refreshAccordionHeight(key);
      }
    }

    // Load asíncrono: contenido real
    if (typeof panel.load === 'function') {
      let result = panel.load(item);

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
    let body = this._accEl.querySelector('#mts-acc-body-' + key);
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

  /**
   * Carga una URL arbitraria en el iframe del preview sin cambiar el item activo.
   * Usado por paneles laterales (ej. VersionsPanel) para navegar entre versiones.
   * @param {string} url
   */
  loadUrl(url) {
    this._overrideUrl = url;
    this._loadIframe(this._currentItem);
  }

  _loadIframe(item) {
    // Prioridad: URL pasada en show(item, url) > urlResolver(item)
    let url = this._overrideUrl;
    if (!url && this._options.urlResolver && item) {
      url = this._options.urlResolver(item);
    }
    if (!url) return;

    let self = this;
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

    let iconName = this._fileIconName(item);
    let name = item.name || '';
    let titleEl = this._modal._titleEl;

    // Sin acceso al nodo del título → fallback al API público (texto plano).
    // MTS.Modal.setTitle() con un string usa textContent, así que un SVG en
    // ese string se mostraría escapado (como texto). Por eso armamos nodos.
    if (!titleEl) { this._modal.setTitle(name); return; }

    titleEl.innerHTML = ''; // safe: clearing

    if (window.MTS && MTS.Icon) {
      let svg = MTS.Icon.get(iconName);
      if (svg) {
        let iconEl = document.createElement('span');
        iconEl.className = 'dm-preview__title-icon';
        iconEl.innerHTML = svg; // fuente confiable (MTS.Icon)
        titleEl.appendChild(iconEl);
      }
    }

    let textEl = document.createElement('span');
    textEl.className = 'dm-preview__title-text';
    textEl.textContent = name; // textContent escapa solo
    titleEl.appendChild(textEl);

    this._modal.title = name; // mantener sincronizada la prop del modal

    // Re-adjuntar el badge de versión junto al nombre.
    if (this._versionBadgeEl) {
      textEl.insertAdjacentElement('afterend', this._versionBadgeEl);
    }
  }

  /* ----------------------------------------------------------
     REEMPLAZAR — overlay de confirmación + badge de versión
  ---------------------------------------------------------- */

  /**
   * Construye el overlay de confirmación (position:absolute sobre el wrap).
   * Se llama una sola vez desde _buildModal().
   * Pre-construye los elementos reutilizables entre estados (file info, ver row, botones).
   */
  _buildConfirmOverlay() {
    let self = this;

    let overlay = document.createElement('div');
    overlay.className = 'dm-preview__confirm-overlay';
    overlay.hidden    = true;

    let card = document.createElement('div');
    card.className = 'dm-preview__confirm-card';

    // — Título —
    let titleEl = document.createElement('p');
    titleEl.className   = 'dm-preview__confirm-card-title';
    titleEl.textContent = this._t('confirmTitle', 'Reemplazar documento');

    // — Info del archivo (siempre en el card; se oculta en estado success) —
    let fileEl = document.createElement('div');
    fileEl.className = 'dm-preview__confirm-file';
    this._confirmFileEl = fileEl;

    // — Zona dinámica: versión / spinner / éxito / error —
    let contentEl = document.createElement('div');
    contentEl.className = 'dm-preview__confirm-content';
    this._confirmContentEl = contentEl;

    // — Acciones (se reemplaza según el estado) —
    let actionsEl = document.createElement('div');
    actionsEl.className = 'dm-preview__confirm-actions';
    this._confirmActionsEl = actionsEl;

    // Pre-construir fila de versión (reutilizada en estados idle y error→retry)
    let verRow = document.createElement('div');
    verRow.className = 'dm-preview__confirm-version';
    let verLabel = document.createElement('label');
    verLabel.className   = 'dm-preview__confirm-version-label';
    verLabel.textContent = this._t('confirmVersionLabel', 'Nueva versión:');
    verLabel.setAttribute('for', 'dm-preview-ver-input');
    let verInput = document.createElement('input');
    verInput.type      = 'number';
    verInput.id        = 'dm-preview-ver-input';
    verInput.min       = '1';
    verInput.step      = '1';
    verInput.className = 'dm-preview__version-input';
    verInput.setAttribute('aria-label', this._t('confirmVersionAriaLabel', 'Nueva versión del documento'));
    verRow.appendChild(verLabel);
    verRow.appendChild(verInput);
    this._confirmVerRowEl = verRow;
    this._versionInputEl  = verInput;

    // Pre-construir botones Cancelar y Subir
    let cancelEl = document.createElement('button');
    cancelEl.type = 'button';
    new MTS.Button(cancelEl, { label: this._t('confirmCancel', 'Cancelar'), size: 'sm', variant: 'ghost' })
      .on('click', function() { self._hideConfirm(); });
    this._confirmCancelEl = cancelEl;

    let submitEl = document.createElement('button');
    submitEl.type = 'button';
    new MTS.Button(submitEl, {
      label:    this._t('confirmUpload', 'Subir'),
      iconLeft: MTS.Icon ? MTS.Icon.get('upload') : '',
      size:     'sm',
      variant:  'primary',
    }).on('click', function() { self._submitReplace(); });
    this._confirmSubmitEl = submitEl;

    card.appendChild(titleEl);
    card.appendChild(fileEl);
    card.appendChild(contentEl);
    card.appendChild(actionsEl);
    overlay.appendChild(card);
    this._wrapEl.appendChild(overlay);
    this._confirmOverlayEl = overlay;
  }

  /**
   * Muestra el overlay con los datos del archivo seleccionado, en estado idle.
   */
  _showConfirm(file) {
    this._confirmFile = file;

    // Versión sugerida: versión actual (entero) + 1
    if (this._versionInputEl) {
      let current = parseInt(this._currentItem && this._currentItem.version, 10) || 1;
      this._versionInputEl.value = current + 1;
    }

    // Detectar si la extensión del archivo seleccionado difiere del documento actual
    let dotIdx  = file.name.lastIndexOf('.');
    let newExt  = dotIdx !== -1 ? file.name.slice(dotIdx + 1).toLowerCase() : '';
    let currExt = ((this._currentItem && this._currentItem.ext) || '').toLowerCase();
    this._extMismatch = (newExt !== '' && currExt !== '' && newExt !== currExt);

    this._renderConfirmFile(file);
    this._setConfirmState('idle');

    if (this._confirmOverlayEl) {
      this._confirmOverlayEl.hidden = false;
    }
  }

  /**
   * Oculta el overlay y limpia el archivo pendiente.
   */
  _hideConfirm() {
    if (this._confirmOverlayEl) {
      this._confirmOverlayEl.hidden = true;
    }
    this._confirmFile = null;
  }

  /**
   * Llama a onReplace. Si retorna Promise muestra barra indeterminada → éxito/error.
   * Si no retorna Promise, cierra inmediatamente (sin feedback).
   */
  _submitReplace() {
    let self = this;
    if (!this._confirmFile) return;

    let version = parseInt(this._versionInputEl.value, 10) || 1;

    let result = this._options.onReplace(
      this._currentItem, this._confirmFile, version
    );

    if (result && typeof result.then === 'function') {
      this._setConfirmState('loading');
      result.then(function() {
        self._setConfirmState('success');
        setTimeout(function() {
          self._hideConfirm();
          // Recargar el iframe con el documento actualizado
          self._loadIframe(self._currentItem);
        }, 1500);
      }).catch(function(err) {
        let msg = (err && err.message) ? err.message : self._t('confirmError', 'Error al subir el archivo.');
        self._setConfirmState('error', msg);
      });
    } else {
      // Sin Promise — cierre inmediato (comportamiento básico)
      this._hideConfirm();
    }
  }

  /**
   * Actualiza la zona dinámica y los botones del overlay según el estado.
   *   'idle'    — versión (+ advertencia extensión si _extMismatch) + Cancelar/Subir
   *   'loading' — barra indeterminada + "Subiendo..."
   *   'success' — ícono check + "Documento reemplazado." (auto-cierra)
   *   'error'   — mensaje de error + Reintentar/Cerrar
   */
  _setConfirmState(state, message) {
    let self      = this;
    let contentEl = this._confirmContentEl;
    let actionsEl = this._confirmActionsEl;
    let fileEl    = this._confirmFileEl;

    if (!contentEl || !actionsEl) return;
    contentEl.replaceChildren();
    actionsEl.replaceChildren();

    if (state === 'idle') {
      if (fileEl) fileEl.hidden = false;
      contentEl.appendChild(this._confirmVerRowEl);

      // Advertencia si la extensión del nuevo archivo no coincide con el documento actual
      if (this._extMismatch) {
        let warnEl = document.createElement('div');
        warnEl.className = 'dm-preview__confirm-warning';
        let warnIcon = document.createElement('span');
        warnIcon.className = 'dm-preview__confirm-warning-icon';
        if (window.MTS && MTS.Icon) warnIcon.innerHTML = MTS.Icon.get('alert-triangle') || '';
        let warnText = document.createElement('span');
        warnText.textContent = this._t('confirmExtWarning', 'El archivo seleccionado tiene una extensión diferente al documento actual.');
        warnEl.appendChild(warnIcon);
        warnEl.appendChild(warnText);
        contentEl.appendChild(warnEl);
      }

      actionsEl.appendChild(this._confirmCancelEl);
      actionsEl.appendChild(this._confirmSubmitEl);

    } else if (state === 'loading') {
      if (fileEl) fileEl.hidden = false;

      // Barra de progreso indeterminada
      let progressWrap = document.createElement('div');
      progressWrap.className = 'dm-preview__confirm-progress';
      let progressBar = document.createElement('div');
      progressBar.className = 'dm-preview__confirm-progress-bar';
      progressWrap.appendChild(progressBar);

      // Texto "Subiendo..."
      let loadingText = document.createElement('span');
      loadingText.className   = 'dm-preview__confirm-status-text';
      loadingText.textContent = this._t('confirmUploading', 'Subiendo...');

      contentEl.appendChild(progressWrap);
      contentEl.appendChild(loadingText);
      // Sin botones — no se puede cancelar una subida en curso

    } else if (state === 'success') {
      if (fileEl) fileEl.hidden = true;
      let successEl = document.createElement('div');
      successEl.className = 'dm-preview__confirm-status dm-preview__confirm-status--success';
      let successIcon = document.createElement('span');
      successIcon.className = 'dm-preview__confirm-status-icon';
      if (window.MTS && MTS.Icon) successIcon.innerHTML = MTS.Icon.get('check-circle') || '✓';
      let successText = document.createElement('span');
      successText.className   = 'dm-preview__confirm-status-text';
      successText.textContent = this._t('confirmSuccess', 'Documento reemplazado.');
      successEl.appendChild(successIcon);
      successEl.appendChild(successText);
      contentEl.appendChild(successEl);

    } else if (state === 'error') {
      if (fileEl) fileEl.hidden = false;
      let errorEl = document.createElement('div');
      errorEl.className = 'dm-preview__confirm-status dm-preview__confirm-status--error';
      let errorIcon = document.createElement('span');
      errorIcon.className = 'dm-preview__confirm-status-icon';
      if (window.MTS && MTS.Icon) errorIcon.innerHTML = MTS.Icon.get('alert-circle') || '✕';
      let errorText = document.createElement('span');
      errorText.className   = 'dm-preview__confirm-status-text';
      errorText.textContent = message || this._t('confirmError', 'Error al subir el archivo.');
      errorEl.appendChild(errorIcon);
      errorEl.appendChild(errorText);
      contentEl.appendChild(errorEl);

      let retryEl = document.createElement('button');
      retryEl.type = 'button';
      new MTS.Button(retryEl, { label: self._t('confirmRetry', 'Reintentar'), size: 'sm', variant: 'ghost' })
        .on('click', function() { self._setConfirmState('idle'); });

      let closeEl = document.createElement('button');
      closeEl.type = 'button';
      new MTS.Button(closeEl, { label: self._t('confirmClose', 'Cerrar'), size: 'sm', variant: 'ghost' })
        .on('click', function() { self._hideConfirm(); });

      actionsEl.appendChild(retryEl);
      actionsEl.appendChild(closeEl);
    }
  }

  /**
   * Rellena la zona de info del archivo en el overlay de confirmación.
   */
  _renderConfirmFile(file) {
    let fileEl = this._confirmFileEl;
    if (!fileEl) return;
    fileEl.replaceChildren();

    // Ícono del tipo de archivo
    let iconEl = document.createElement('span');
    iconEl.className = 'dm-preview__confirm-file-icon';
    let dotIdx   = file.name.lastIndexOf('.');
    let ext      = dotIdx !== -1 ? file.name.slice(dotIdx + 1) : '';
    let iconName = this._fileIconName({ ext: ext, mimeType: file.type });
    if (window.MTS && MTS.Icon) {
      iconEl.innerHTML = MTS.Icon.get(iconName) || '';
    }

    // Info: nombre + tamaño
    let infoEl = document.createElement('div');
    infoEl.className = 'dm-preview__confirm-file-info';

    let nameEl = document.createElement('span');
    nameEl.className   = 'dm-preview__confirm-file-name';
    nameEl.textContent = file.name;
    nameEl.title       = file.name;

    let sizeEl = document.createElement('span');
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
    if (!this._versionBadgeApi) return;
    if (item && item.version != null && item.version !== '') {
      this._versionBadgeApi.setLabel('v' + item.version);
      this._versionBadgeApi.show();
    } else {
      this._versionBadgeApi.hide();
    }
  }

  /**
   * Actualiza el accept del file picker con los tipos del DocumentManagerPlugin.
   * Se llama en cada show(item).
   */
  _updateReplaceState(item) {
    if (!this._options.onReplace || !this._replaceInput) return;
    let accept = (this._dm && this._dm._options && this._dm._options.accept)
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
    let ext  = ((item.ext  || item.extension || '')).toLowerCase();
    let mime = ((item.mimeType || item.contentType || '')).toLowerCase();

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

  /**
   * Retorna el string del locale para la key dada.
   * Lee la sección 'MTS.DocumentManagerPreviewPlugin' del locale activo.
   * Si no encuentra la key, retorna el fallback hardcodeado (siempre en español).
   */
  _t(key, fallback) {
    let loc = this._dm?._table?._cfg?.locale?.['MTS.DocumentManagerPreviewPlugin'] ?? {};
    return loc[key] !== undefined ? loc[key] : (fallback !== undefined ? fallback : key);
  }

  _findPanel(key) {
    let panels = this._options.panels;
    for (let i = 0; i < panels.length; i++) {
      if (panels[i].key === key) return panels[i];
    }
    return null;
  }

  /** Escapa caracteres HTML especiales — delega a MTS.Sanitize si está disponible */
  _escHtml(str) {
    return typeof MTS.Sanitize !== 'undefined'
      ? MTS.Sanitize.html(str)
      : String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
  }

  // Panel abierto → flecha apunta a la derecha (clic = colapsar)
  _chevronRight() {
    return MTS.Icon.get('chevron-right');
  }

  // Panel cerrado → flecha apunta a la izquierda (clic = expandir)
  _chevronLeft() {
    return MTS.Icon.get('chevron-left');
  }
};


/* ============================================================
   MTS.DocumentManagerPreviewBasicInfoPanel  v1.2.0
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

   Uso básico (campos por defecto):
     new MTS.DocumentManagerPreviewBasicInfoPanel()

   Uso con campos personalizados:
     new MTS.DocumentManagerPreviewBasicInfoPanel({
       fields: [
         { label: 'Nombre',     field: 'name'      },
         { label: 'Versión',    field: 'version'   },
         { label: 'Modificado', field: 'modifiedAt'},
         { label: 'Área',       resolve: function(item) { return item.department || '—'; } },
       ]
     })

   Cada entrada del array `fields` puede ser:
     { label, field   }  — lee item[field] directamente
     { label, resolve }  — llama resolve(item) para obtener el valor

   Si `fields` no se pasa, usa DEFAULT_FIELDS (comportamiento anterior, retrocompatible).

   Puede usarse tal cual o como referencia para crear paneles personalizados.
   ============================================================ */

MTS.DocumentManagerPreviewBasicInfoPanel = class DocumentManagerPreviewBasicInfoPanel {

  get key()   { return 'dm-basic-info'; }
  get label() {
    let loc = MTS.DataTable?._activeLocale?.['MTS.DocumentManagerPreviewBasicInfoPanel'] ?? {};
    return loc.panelLabel || 'Información básica';
  }
  get icon()  { return typeof MTS.Icon !== 'undefined' ? MTS.Icon.get('info') : null; }

  constructor(options) {
    options = options || {};
    this._fields = Array.isArray(options.fields) && options.fields.length > 0
      ? options.fields
      : MTS.DocumentManagerPreviewBasicInfoPanel.DEFAULT_FIELDS;
    this._preview = null;
  }

  /**
   * Campos por defecto — equivale al comportamiento de v1.1.0.
   * El dev puede clonar y modificar este array como punto de partida.
   */
  static get DEFAULT_FIELDS() {
    return [
      {
        labelKey: 'fieldName',   label: 'Nombre',
        resolve: function(item) { return item.name || '—'; },
      },
      {
        labelKey: 'fieldType',   label: 'Tipo',
        resolve: function(item) {
          return item.mimeType || item.contentType
              || (item.ext ? '.' + item.ext : null)
              || item.type
              || '—';
        },
      },
      {
        labelKey: 'fieldSize',   label: 'Tamaño',
        resolve: function(item) {
          return item.sizeFormatted || (item.size != null ? String(item.size) : '—');
        },
      },
      {
        labelKey: 'fieldVersion', label: 'Versión',
        resolve: function(item) { return item.version != null ? String(item.version) : '—'; },
      },
      {
        labelKey: 'fieldCreatedAt',  label: 'Creado',
        resolve: function(item) { return item.createdAt || '—'; },
      },
      {
        labelKey: 'fieldModifiedAt', label: 'Modificado',
        resolve: function(item) { return item.modifiedAt || item.updatedAt || '—'; },
      },
      {
        labelKey: 'fieldStatus',  label: 'Estado',
        resolve: function(item) { return item.status || '—'; },
      },
      {
        labelKey: 'fieldOwner',   label: 'Propietario',
        resolve: function(item) { return item.owner || item.author || '—'; },
      },
    ];
  }

  install(preview) {
    this._preview = preview;
  }

  uninstall() {
    this._preview = null;
  }

  /** Skeleton de carga — tantas filas como campos configurados */
  render(item) {
    let wrap = document.createElement('div');
    wrap.className = 'dm-preview__basic-info dm-preview__basic-info--loading';
    for (let i = 0; i < this._fields.length; i++) {
      let row = document.createElement('div');
      row.className = 'dm-preview__info-row';

      let labelSk = document.createElement('div');
      labelSk.className = 'dm-preview__info-skeleton-label';

      let valueSk = document.createElement('div');
      valueSk.className = 'dm-preview__info-skeleton-value dm-preview__info-skeleton-value--w' + (i % 4);

      row.appendChild(labelSk);
      row.appendChild(valueSk);
      wrap.appendChild(row);
    }
    return wrap;
  }

  /** Contenido real — acepta async; en producción haría un fetch */
  load(item) {
    let fields  = this._fields;
    let loc     = MTS.DataTable?._activeLocale?.['MTS.DocumentManagerPreviewBasicInfoPanel'] ?? {};
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(MTS.DocumentManagerPreviewBasicInfoPanel._buildContent(item, fields, loc));
      }, 0);
    });
  }

  /**
   * Construye el DOM de la lista de campos a partir de `item`, `fields` y `loc`.
   * Cada entrada puede tener:
   *   { label, field }              — lee item[field]; label hardcodeado
   *   { labelKey, label, resolve }  — labelKey resuelve el texto desde `loc`; label es fallback
   *   { label, resolve }            — llama resolve(item); label hardcodeado
   * @param {object} item
   * @param {Array}  fields
   * @param {object} [loc] — sección del locale 'MTS.DocumentManagerPreviewBasicInfoPanel'
   */
  static _buildContent(item, fields, loc) {
    loc = loc || {};
    let wrap = document.createElement('div');
    wrap.className = 'dm-preview__basic-info';

    fields.forEach(function(fieldDef) {
      let rawValue;
      if (typeof fieldDef.resolve === 'function') {
        try { rawValue = fieldDef.resolve(item); } catch (e) { rawValue = '—'; }
      } else if (fieldDef.field != null) {
        rawValue = item[fieldDef.field];
      }

      let displayValue = (rawValue != null && rawValue !== '') ? String(rawValue) : '—';

      /* Resolver label: localizado > labelKey > label hardcodeado */
      let labelText = (fieldDef.labelKey && loc[fieldDef.labelKey])
        || fieldDef.label
        || fieldDef.labelKey
        || '';

      let row = document.createElement('div');
      row.className = 'dm-preview__info-row';

      let labelEl = document.createElement('span');
      labelEl.className   = 'dm-preview__info-label';
      labelEl.textContent = labelText + ':';

      let valueEl = document.createElement('span');
      valueEl.className   = 'dm-preview__info-value';
      valueEl.textContent = displayValue;
      valueEl.title       = displayValue;   // tooltip para valores truncados

      row.appendChild(labelEl);
      row.appendChild(valueEl);
      wrap.appendChild(row);
    });

    return wrap;
  }
};
