/* ============================================================
   MATIOS UI — matios-ui-formguard.js
   MTS.FormGuard — Dirty-tracking declarativo para formularios
   API global singleton: MTS.FormGuard.start(options)

   Atributos HTML (en el elemento [data-mts-form]):
     data-mts-form               Marca el formulario gestionado
     data-mts-form-id            ID único del form (auto si se omite)
     data-mts-form-back          En botones: intercepta navegación hacia atrás
     data-mts-form-save          Selector CSS del botón guardar (para el modal + dot)
     data-mts-form-watch         En controles nativos: fuerza tracking aunque no sean MTS
     data-mts-form-ignore        Subtree excluido del tracking
     data-mts-form-title-target  Selector CSS del elemento donde se inserta el ' *'

   Eventos DOM (bubbles desde el elemento [data-mts-form]):
     mts:form:dirty-change       { formId, isDirty }
     mts:form:before-navigate    { formId }  cancelable

   Eventos DOM que el consumidor puede disparar:
     mts:form:save-ack           { formId? }  — reset del snapshot tras guardar exitoso
     mts:form:snapshot-sync      — re-snapshot programático (tras setValue masivo)

   Convención: los componentes MTS exponen el._mtsInstance = instancia
   ============================================================ */

(function (window) {
  'use strict';

  window.MTS = window.MTS || {};

  /* ── Utilidades privadas ─────────────────────────────────── */

  var _uidCounter = 0;
  function _uid() {
    _uidCounter++;
    return 'mfg-' + _uidCounter + '-' + Math.random().toString(36).slice(2, 7);
  }

  function _serialize(val) {
    if (val === null || val === undefined) { return ''; }
    if (typeof val === 'object') { return JSON.stringify(val); }
    return String(val);
  }

  function _readValue(el) {
    var inst = el._mtsInstance;
    if (inst) {
      if (typeof inst.getValue   === 'function') { return inst.getValue();   }
      if (typeof inst.isChecked  === 'function') { return inst.isChecked();  }
      if (typeof inst.getTags    === 'function') { return inst.getTags();    }
    }
    if (el.type === 'checkbox' || el.type === 'radio') { return el.checked; }
    return el.value !== undefined ? el.value : '';
  }

  /* ── Estado privado del singleton ───────────────────────── */

  var _started        = false;
  var _options        = {};
  var _forms          = new Map();   /* formEl → FormState */
  var _dirtyCount     = 0;
  var _observer       = null;
  var _beforeUnloadFn = null;

  /* ── FormState ───────────────────────────────────────────── */

  function FormState(formEl) {
    this.el             = formEl;
    this.id             = formEl.dataset.mtsFormId || _uid();
    this.snapshot       = new Map();  /* guardId → serializedValue */
    this.controls       = [];
    this.isDirty        = false;
    this._snapshotReady = false;  /* true tras el primer collect exitoso */
  }

  /* ── collectControls ─────────────────────────────────────── */

  function collectControls(formEl) {
    var results = [];
    var seen    = new Set();

    var walker = document.createTreeWalker(
      formEl,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: function (node) {
          /* excluir el nodo raíz del form (es el propio formEl) */
          if (node === formEl) { return NodeFilter.FILTER_SKIP; }
          /* excluir subtrees marcados como ignorados */
          if (node.hasAttribute && node.hasAttribute('data-mts-form-ignore')) {
            return NodeFilter.FILTER_REJECT;
          }
          /* excluir formularios anidados */
          if (node.hasAttribute && node.hasAttribute('data-mts-form') && node !== formEl) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    var node;
    while ((node = walker.nextNode())) {
      var include = false;

      if (node._mtsInstance) {
        /* componente MTS — siempre incluir */
        include = true;
      } else if (node.hasAttribute && node.hasAttribute('data-mts-form-watch')) {
        /* control nativo marcado explícitamente */
        include = true;
      } else if (
        (node.tagName === 'INPUT' || node.tagName === 'SELECT' || node.tagName === 'TEXTAREA') &&
        node.type !== 'submit' && node.type !== 'button' && node.type !== 'reset' && node.type !== 'image'
      ) {
        /* input nativo estándar sin instancia MTS */
        include = true;
      }

      if (include && !seen.has(node)) {
        seen.add(node);
        if (!node._mtsGuardId) { node._mtsGuardId = _uid(); }
        results.push(node);
      }
    }
    return results;
  }

  /* ── Snapshot ────────────────────────────────────────────── */

  function takeSnapshot(formState) {
    formState.snapshot.clear();
    for (var i = 0; i < formState.controls.length; i++) {
      var el = formState.controls[i];
      formState.snapshot.set(el._mtsGuardId, _serialize(_readValue(el)));
    }
  }

  /* ── Dirty check ─────────────────────────────────────────── */

  function computeIsDirty(formState) {
    for (var i = 0; i < formState.controls.length; i++) {
      var el      = formState.controls[i];
      var current  = _serialize(_readValue(el));
      var original = formState.snapshot.get(el._mtsGuardId);
      if (current !== original) { return true; }
    }
    return false;
  }

  /* ── Dirty UI indicators ─────────────────────────────────── */

  function _updateDirtyUI(formState, isDirty) {
    /* título — selector explícito o .mts-card__title dentro del form */
    var titleTarget = null;
    if (formState.el.dataset.mtsFormTitleTarget) {
      titleTarget = document.querySelector(formState.el.dataset.mtsFormTitleTarget);
    } else {
      titleTarget = formState.el.querySelector('.mts-card__title, [data-mts-form-title]');
    }

    if (titleTarget) {
      var existingMark = titleTarget.querySelector('.mts-formguard__dirty-mark');
      if (isDirty && !existingMark) {
        var mark = document.createElement('span');
        mark.className = 'mts-formguard__dirty-mark';
        mark.setAttribute('aria-hidden', 'true');
        mark.textContent = ' *';
        titleTarget.appendChild(mark);
      } else if (!isDirty && existingMark) {
        existingMark.parentNode.removeChild(existingMark);
      }
    }

    /* botón guardar — dot via CSS ::after */
    var saveSel = formState.el.dataset.mtsFormSave;
    if (saveSel) {
      var saveBtn = document.querySelector(saveSel);
      if (saveBtn) {
        if (isDirty) {
          saveBtn.classList.add('mts-formguard__save--dirty');
        } else {
          saveBtn.classList.remove('mts-formguard__save--dirty');
        }
      }
    }
  }

  /* ── updateDirty ─────────────────────────────────────────── */

  function updateDirty(formState) {
    var wasDirty = formState.isDirty;
    formState.isDirty = computeIsDirty(formState);

    if (formState.isDirty !== wasDirty) {
      if (formState.isDirty) { _dirtyCount++; } else { _dirtyCount = Math.max(0, _dirtyCount - 1); }
      _updateDirtyUI(formState, formState.isDirty);
      _mountBeforeUnload();
      formState.el.dispatchEvent(new CustomEvent('mts:form:dirty-change', {
        bubbles: true,
        detail:  { formId: formState.id, isDirty: formState.isDirty }
      }));
    }
  }

  /* ── beforeunload ────────────────────────────────────────── */

  function _mountBeforeUnload() {
    if (_dirtyCount > 0 && !_beforeUnloadFn) {
      _beforeUnloadFn = function (e) {
        e.preventDefault();
        /* MTS.Modal si está disponible — el browser puede mostrar su propio
           dialog encima en algunos casos (close-tab), pero al menos el modal
           aparece para navegación por URL o back del browser.
           Si MTS.Modal no está cargado, cae al returnValue nativo. */
        if (window.MTS && window.MTS.Modal) {
          _showBeforeUnloadModal();
        } else {
          e.returnValue = '';
        }
      };
      window.addEventListener('beforeunload', _beforeUnloadFn);
    } else if (_dirtyCount === 0 && _beforeUnloadFn) {
      window.removeEventListener('beforeunload', _beforeUnloadFn);
      _beforeUnloadFn = null;
    }
  }

  function _showBeforeUnloadModal() {
    var messages   = _options.messages || {};
    var title      = messages.modalTitle   || 'Cambios sin guardar';
    var body       = messages.modalBody    || 'Tienes cambios sin guardar. Si sales ahora, se perderán.';
    var btnKeep    = messages.btnKeep      || 'Seguir editando';
    var btnDiscard = messages.btnDiscard   || 'Salir sin guardar';

    var modal = new MTS.Modal({
      title: title,
      body:  body,
      size:  'sm',
      closeOnBackdrop: false,
      footer: [
        {
          label: btnKeep, variant: 'ghost',
          onClick: function () { modal.close(); }
        },
        {
          label: btnDiscard, variant: 'danger',
          onClick: function () {
            modal.close();
            /* remover el listener y limpiar dirty — el siguiente intento de
               cerrar/navegar ya no será bloqueado */
            if (_beforeUnloadFn) {
              window.removeEventListener('beforeunload', _beforeUnloadFn);
              _beforeUnloadFn = null;
            }
            _forms.forEach(function (fs) { resetForm(fs); });
          }
        }
      ]
    });
    modal.open();
  }

  /* ── Handlers de cambio por burbujeo ─────────────────────── */

  var _MTS_EVENTS = [
    'mts:input:change',      'mts:toggle:change',    'mts:select:change',
    'mts:checkbox:change',   'mts:radio:change',     'mts:slider:change',
    'mts:taginput:change',   'mts:picker:change',    'mts:numberinput:change',
    'mts:phoneinput:change', 'mts:re:change'
  ];

  function _onAnyChange(e) {
    var formEl = e.target.closest('[data-mts-form]');
    if (!formEl) { return; }
    var formState = _forms.get(formEl);
    if (!formState || !formState._snapshotReady) { return; }
    updateDirty(formState);
  }

  function _onNativeChange(e) {
    /* evitar doble procesamiento para elementos ya cubiertos por _mtsInstance */
    if (e.target._mtsInstance) { return; }
    _onAnyChange(e);
  }

  /* ── Intercepción de navegación (botón back) ─────────────── */

  function _onClickCapture(e) {
    var btn = e.target.closest('[data-mts-form-back]');
    if (!btn) { return; }

    /* resolver el form asociado */
    var formEl = null;
    var backVal = btn.dataset.mtsFormBack;
    if (backVal) {
      /* data-mts-form-back="selector" apunta al form */
      formEl = document.querySelector(backVal);
    }
    if (!formEl) {
      /* buscar el form contenedor del botón */
      formEl = btn.closest('[data-mts-form]');
    }
    if (!formEl) {
      /* si el botón está fuera, tomar cualquier form sucio */
      var first = null;
      _forms.forEach(function (fs) { if (fs.isDirty && !first) { first = fs.el; } });
      formEl = first;
    }
    if (!formEl) { return; }

    var formState = _forms.get(formEl);
    if (!formState || !formState.isDirty) { return; }

    e.preventDefault();
    e.stopPropagation();

    openNavigateModal(formState, function () {
      /* replay del click original con la guardia temporalmente desactivada */
      btn.removeAttribute('data-mts-form-back');
      btn.click();
      btn.setAttribute('data-mts-form-back', backVal || '');
    });
  }

  /* ── Modal de navegación ─────────────────────────────────── */

  function openNavigateModal(formState, proceedFn) {
    var allowed = formState.el.dispatchEvent(new CustomEvent('mts:form:before-navigate', {
      bubbles: true, cancelable: true,
      detail: { formId: formState.id }
    }));
    if (!allowed) { return; }

    var saveSel = formState.el.dataset.mtsFormSave;

    if (window.MTS && window.MTS.Modal) {
      _openMtsModal(formState, proceedFn, saveSel);
    } else {
      /* fallback nativo */
      var msg = (_options.messages && _options.messages.unsavedChanges)
        || 'Tienes cambios sin guardar. ¿Deseas descartarlos?';
      if (confirm(msg)) {
        resetForm(formState);
        proceedFn();
      }
    }
  }

  function _openMtsModal(formState, proceedFn, saveSel) {
    var messages   = _options.messages || {};
    var title      = messages.modalTitle   || 'Cambios sin guardar';
    var body       = messages.modalBody    || 'Tienes cambios sin guardar en este formulario.';
    var btnKeep    = messages.btnKeep      || 'Seguir editando';
    var btnDiscard = messages.btnDiscard   || 'Descartar cambios';
    var btnSave    = messages.btnSave      || 'Guardar y salir';

    var footerBtns = [
      { label: btnKeep, variant: 'ghost',   onClick: function () { modal.close(); } },
      { label: btnDiscard, variant: 'danger', onClick: function () { modal.close(); resetForm(formState); proceedFn(); } }
    ];
    if (saveSel) {
      footerBtns.push({
        label: btnSave, variant: 'primary',
        onClick: function () { _handleSaveAndExit(formState, modal, proceedFn); }
      });
    }

    var modal = new MTS.Modal({ title: title, body: body, size: 'sm', closeOnBackdrop: false, footer: footerBtns });
    modal.open();
  }

  function _handleSaveAndExit(formState, modal, proceedFn) {
    var saveSel = formState.el.dataset.mtsFormSave;
    if (!saveSel) { modal.close(); proceedFn(); return; }
    var saveBtn = document.querySelector(saveSel);
    if (saveBtn) { saveBtn.click(); }

    function onAck(e) {
      if (e.detail && e.detail.formId && e.detail.formId !== formState.id) { return; }
      formState.el.removeEventListener('mts:form:save-ack', onAck);
      modal.close();
      resetForm(formState);
      proceedFn();
    }
    formState.el.addEventListener('mts:form:save-ack', onAck);
    /* timeout fallback de seguridad: 10 s */
    setTimeout(function () { formState.el.removeEventListener('mts:form:save-ack', onAck); }, 10000);
  }

  /* ── resetForm ───────────────────────────────────────────── */

  function resetForm(formState) {
    takeSnapshot(formState);
    var wasDirty = formState.isDirty;
    formState.isDirty = false;
    if (wasDirty) {
      _dirtyCount = Math.max(0, _dirtyCount - 1);
      _updateDirtyUI(formState, false);
      _mountBeforeUnload();
      formState.el.dispatchEvent(new CustomEvent('mts:form:dirty-change', {
        bubbles: true,
        detail: { formId: formState.id, isDirty: false }
      }));
    }
  }

  /* ── mts:form:snapshot-sync ──────────────────────────────── */

  function _onSnapshotSync(e) {
    var formEl = e.target.closest('[data-mts-form]');
    if (!formEl) { return; }
    var formState = _forms.get(formEl);
    if (!formState) { return; }
    /* re-collect por si hay nuevos controles desde el último adopt */
    formState.controls       = collectControls(formEl);
    formState._snapshotReady = true;
    resetForm(formState);
  }

  /* ── Adopt / Release ─────────────────────────────────────── */

  function adopt(formEl) {
    if (_forms.has(formEl)) { return; }
    var formState = new FormState(formEl);
    _forms.set(formEl, formState);
    /* Diferimos el collect con setTimeout(0) para que los componentes MTS
       (que pueden instanciarse en el mismo bloque de script después de start())
       ya hayan puesto su _mtsInstance en el DOM antes de que corramos el TreeWalker. */
    setTimeout(function () {
      if (!_forms.has(formEl)) { return; }  /* ya fue released */
      formState.controls       = collectControls(formEl);
      takeSnapshot(formState);
      formState._snapshotReady = true;
    }, 0);
  }

  function release(formEl) {
    var formState = _forms.get(formEl);
    if (!formState) { return; }
    if (formState.isDirty) {
      _dirtyCount = Math.max(0, _dirtyCount - 1);
      _updateDirtyUI(formState, false);
      _mountBeforeUnload();
    }
    _forms.delete(formEl);
  }

  /* ── MutationObserver ────────────────────────────────────── */

  function _startObserver() {
    _observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mut) {
        mut.addedNodes.forEach(function (node) {
          if (node.nodeType !== 1) { return; }
          if (node.hasAttribute && node.hasAttribute('data-mts-form')) { adopt(node); }
          if (node.querySelectorAll) {
            node.querySelectorAll('[data-mts-form]').forEach(adopt);
          }
        });
        mut.removedNodes.forEach(function (node) {
          if (node.nodeType !== 1) { return; }
          if (node.hasAttribute && node.hasAttribute('data-mts-form')) { release(node); }
          if (node.querySelectorAll) {
            node.querySelectorAll('[data-mts-form]').forEach(release);
          }
        });
      });
    });
    _observer.observe(document.body, { childList: true, subtree: true });
  }

  /* ── Bind / unbind listeners globales ────────────────────── */

  function _bindListeners() {
    _MTS_EVENTS.forEach(function (evName) { document.addEventListener(evName, _onAnyChange, true); });
    document.addEventListener('input',                   _onNativeChange, true);
    document.addEventListener('change',                  _onNativeChange, true);
    document.addEventListener('click',                   _onClickCapture, true);
    document.addEventListener('mts:form:snapshot-sync',  _onSnapshotSync, true);
  }

  function _unbindListeners() {
    _MTS_EVENTS.forEach(function (evName) { document.removeEventListener(evName, _onAnyChange, true); });
    document.removeEventListener('input',                  _onNativeChange, true);
    document.removeEventListener('change',                 _onNativeChange, true);
    document.removeEventListener('click',                  _onClickCapture, true);
    document.removeEventListener('mts:form:snapshot-sync', _onSnapshotSync, true);
  }

  /* ── API pública ─────────────────────────────────────────── */

  MTS.FormGuard = {

    /**
     * Inicia FormGuard. Adopta todos los [data-mts-form] existentes
     * y observa el DOM para adoptar/liberar los que aparezcan/desaparezcan.
     *
     * @param {object} [options]
     * @param {object} [options.messages]  Sobreescribe los textos de la UI.
     *   {
     *     unsavedChanges : 'Tienes cambios sin guardar...',  // confirm() fallback
     *     modalTitle     : 'Cambios sin guardar',
     *     modalBody      : 'Tienes cambios sin guardar...',
     *     btnKeep        : 'Seguir editando',
     *     btnDiscard     : 'Descartar cambios',
     *     btnSave        : 'Guardar y salir'
     *   }
     */
    start: function (options) {
      if (_started) { return this; }
      _started = true;
      _options = options || {};
      document.querySelectorAll('[data-mts-form]').forEach(adopt);
      _startObserver();
      _bindListeners();
      return this;
    },

    /** Detiene FormGuard y limpia todo el estado. */
    stop: function () {
      if (!_started) { return this; }
      _unbindListeners();
      if (_observer) { _observer.disconnect(); _observer = null; }
      if (_beforeUnloadFn) {
        window.removeEventListener('beforeunload', _beforeUnloadFn);
        _beforeUnloadFn = null;
      }
      _forms.forEach(function (fs) { _updateDirtyUI(fs, false); });
      _forms.clear();
      _dirtyCount = 0;
      _started    = false;
      _options    = {};
      return this;
    },

    /**
     * Re-toma el snapshot de todos los formularios activos.
     * Úsalo después de cargar datos programáticamente en todos los forms.
     */
    syncAll: function () {
      _forms.forEach(function (formState) {
        formState.controls = collectControls(formState.el);
        resetForm(formState);
      });
      return this;
    },

    /**
     * Re-toma el snapshot de un formulario específico.
     * @param {string} formId — valor de data-mts-form-id
     */
    sync: function (formId) {
      _forms.forEach(function (formState) {
        if (formState.id === formId) {
          formState.controls = collectControls(formState.el);
          resetForm(formState);
        }
      });
      return this;
    },

    /** Retorna true si hay al menos un formulario con cambios sin guardar. */
    hasUnsavedChanges: function () { return _dirtyCount > 0; },

    /** Retorna el número de formularios con cambios sin guardar. */
    getDirtyCount: function () { return _dirtyCount; }

  };

}(window));
