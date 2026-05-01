/* ============================================================
   MATIOS UI — MTS.DocumentManagerPreviewPlugin  v1.0.0
   Sub-plugin de vista previa para MTS.DocumentManagerPlugin.

   Muestra un modal fullscreen con:
     - Iframe para renderizar el documento
     - Panel lateral colapsible con acordeón de sub-paneles
     - Sistema de sub-paneles extensible (workflow, tags, versiones, etc.)

   El plugin NO intercepta onFileClick automáticamente.
   El dev conecta explícitamente:

     const dmPreview = new MTS.DocumentManagerPreviewPlugin({
       panels: [
         new MTS.DocumentManagerPreviewBasicInfoPanel(),
       ],
       urlResolver: function(item) {
         return '/api/documents/' + item.id + '/retrieve';
       },
     });

     new MTS.DocumentManagerPlugin({
       onFileClick: function(item) {
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
     panelVisible  bool    — panel lateral visible al abrir (default: true)
     panelWidth    string  — ancho del panel lateral abierto (default: '340px')

   Dependencias: MTS.DocumentManagerPlugin, MTS.Modal, MTS.Accordion
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DocumentManagerPreviewPlugin = class DocumentManagerPreviewPlugin {

  static descriptor = {
    name:     'MTS.DocumentManagerPreviewPlugin',
    version:  '1.0.0',
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
      panelVisible: options.panelVisible !== false,
      panelWidth:   options.panelWidth   || '340px',
    };

    this._dm          = null;
    this._modal       = null;
    this._accordion   = null;
    this._iframe      = null;
    this._spinnerWrap = null;
    this._panelEl     = null;
    this._panelInner  = null;
    this._toggleBtn   = null;
    this._accEl       = null;
    this._currentItem = null;
    this._panelLoaded = {};
    this._panelOpen   = this._options.panelVisible;
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
      this._modal       = null;
      this._accordion   = null;
      this._iframe      = null;
      this._spinnerWrap = null;
      this._panelEl     = null;
      this._panelInner  = null;
      this._toggleBtn   = null;
      this._accEl       = null;
    }
    this._dm          = null;
    this._currentItem = null;
  }

  /* ----------------------------------------------------------
     API PÚBLICA
  ---------------------------------------------------------- */

  /**
   * Abre el modal de vista previa para el item dado.
   * @param {object} item — ítem del DocumentManagerPlugin (archivo)
   */
  show(item) {
    this._currentItem = item;
    this._panelLoaded = {};

    if (!this._modal) {
      this._buildModal();
    }

    this._updateTitle(item);
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

    // Flush: sin padding y sin overflow en el body del modal para controlar
    // el layout internamente con flex row.
    this._modal._bodyEl.classList.add('mts-modal__body--flush');
  }

  _buildBody() {
    var self = this;

    var wrap = document.createElement('div');
    wrap.className = 'dm-preview__wrap';

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
    // Usar RAF para asegurar que el DOM está actualizado antes de medir
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
    if (!this._options.urlResolver || !item) return;
    var url = this._options.urlResolver(item);
    if (!url) return;

    var self = this;
    this._spinnerWrap.classList.add('dm-preview__spinner-wrap--visible');
    this._iframe.onload = function() {
      self._spinnerWrap.classList.remove('dm-preview__spinner-wrap--visible');
    };
    // Asignar src fuera del hilo principal para evitar bloqueo durante la animación de entrada
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
     UTILIDADES
  ---------------------------------------------------------- */

  _updateTitle(item) {
    if (!this._modal || !item) return;
    var name = item.name || '';
    this._modal.setTitle(name);
  }

  _findPanel(key) {
    var panels = this._options.panels;
    for (var i = 0; i < panels.length; i++) {
      if (panels[i].key === key) return panels[i];
    }
    return null;
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
   MTS.DocumentManagerPreviewBasicInfoPanel  v1.0.0
   Panel de información básica — built-in.

   Muestra los metadatos del ítem: nombre, tipo, tamaño, fechas, estado.
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

  /** Retorna un skeleton mientras se carga el contenido real */
  render(item) {
    var wrap = document.createElement('div');
    wrap.className = 'dm-preview__basic-info dm-preview__basic-info--loading';
    for (var i = 0; i < 5; i++) {
      var row = document.createElement('div');
      row.className = 'dm-preview__info-skeleton-row';
      wrap.appendChild(row);
    }
    return wrap;
  }

  /** Retorna el contenido real (acepta async) */
  load(item) {
    // En producción, aquí irías a buscar datos al servidor.
    // Por ahora construye con los datos que vienen en el ítem.
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(MTS.DocumentManagerPreviewBasicInfoPanel._buildContent(item));
      }, 0);
    });
  }

  static _buildContent(item) {
    var fields = [
      { label: 'Nombre',     value: item.name          || '—' },
      { label: 'Tipo',       value: item.type           || item.extension || '—' },
      { label: 'Tamaño',     value: item.size           || '—' },
      { label: 'Creado',     value: item.createdAt      || '—' },
      { label: 'Modificado', value: item.updatedAt      || item.modifiedAt || '—' },
      { label: 'Estado',     value: item.status         || '—' },
      { label: 'Propietario',value: item.owner          || item.author || '—' },
    ];

    var wrap = document.createElement('div');
    wrap.className = 'dm-preview__basic-info';

    fields.forEach(function(field) {
      var row = document.createElement('div');
      row.className = 'dm-preview__info-row';

      var label = document.createElement('span');
      label.className   = 'dm-preview__info-label';
      label.textContent = field.label;

      var value = document.createElement('span');
      value.className   = 'dm-preview__info-value';
      value.textContent = field.value;

      row.appendChild(label);
      row.appendChild(value);
      wrap.appendChild(row);
    });

    return wrap;
  }
};
