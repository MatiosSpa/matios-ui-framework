/* ============================================================
   MATIOS UI — MTS.DocumentManagerPreviewMetadataPanel  v1.1.0
   Panel lateral del PreviewPlugin — metadatos editables del documento.

   Requiere: MTS.DocumentManagerPreviewPlugin, MTS.Button,
             MTS.Input, MTS.Select, MTS.Modal

   Opciones:
     onLoad(item)          → Promise<field[]>   — campos con sus valores actuales
     onSave(item, fields)  → Promise            — fields = array actualizado con nuevos valores

   field = {
     id:      string,                      — identificador único del campo
     label:   string,                      — etiqueta visible
     type:    'input'|'select'|'date'|'number'|'textarea',
     value:   string,                      — valor actual
     options: [{ id, value, text }],       — solo para type:'select'
   }
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DocumentManagerPreviewMetadataPanel = class DocumentManagerPreviewMetadataPanel {

  get key() { return 'dm-metadata'; }

  get label() {
    var loc = MTS.DataTable?._activeLocale?.['MTS.DocumentManagerPreviewMetadataPanel'] ?? {};
    return loc.panelLabel || 'Metadatos';
  }

  get icon() {
    return typeof MTS.Icon !== 'undefined' ? MTS.Icon.get('tag') : null;
  }

  constructor(options) {
    options = options || {};
    this._onLoad      = typeof options.onLoad === 'function' ? options.onLoad : null;
    this._onSave      = typeof options.onSave === 'function' ? options.onSave : null;
    this._editTooltip = options.editTooltip || null;
    this._preview     = null;
  }

  install(preview)  { this._preview = preview; }
  uninstall()       { this._preview = null;    }

  /* ── Skeleton ─────────────────────────────────────────── */

  render(item) {
    var wrap = document.createElement('div');
    wrap.className = 'dm-metadata dm-metadata--loading';
    for (var i = 0; i < 4; i++) {
      var row = document.createElement('div');
      row.className = 'dm-metadata__skeleton-row';

      var label = document.createElement('div');
      label.className = 'dm-metadata__skeleton-label';
      var value = document.createElement('div');
      value.className = 'dm-metadata__skeleton-value dm-metadata__skeleton-value--w' + (i % 4);

      row.appendChild(label);
      row.appendChild(value);
      wrap.appendChild(row);
    }
    return wrap;
  }

  /* ── Load ─────────────────────────────────────────────── */

  load(item) {
    var self = this;
    if (!this._onLoad) {
      return this._buildEmptyEl();
    }
    return Promise.resolve(this._onLoad(item))
      .then(function(fields) {
        return self._renderReadMode(fields || [], item);
      })
      .catch(function(err) {
        console.error('[MTS.DocumentManagerPreviewMetadataPanel] Error al cargar metadatos:', err);
        return self._buildEmptyEl();
      });
  }

  /* ── Modo lectura ─────────────────────────────────────── */

  _renderReadMode(fields, item) {
    var self = this;
    var loc  = MTS.DataTable?._activeLocale?.['MTS.DocumentManagerPreviewMetadataPanel'] ?? {};

    var wrap = document.createElement('div');
    wrap.className = 'dm-metadata';

    if (!fields.length) {
      wrap.appendChild(this._buildEmptyEl());
      return wrap;
    }

    /* Botón Editar — arriba a la derecha */
    if (typeof this._onSave === 'function') {
      var headerEl = document.createElement('div');
      headerEl.className = 'dm-metadata__header';

      var tooltip  = this._editTooltip || loc.edit || 'Editar';
      var editWrap = document.createElement('div');
      var editBtn  = new MTS.Button(editWrap, {
        variant:   'ghost',
        size:      'sm',
        iconLeft:  typeof MTS.Icon !== 'undefined' ? MTS.Icon.get('edit-2') : '',
        ariaLabel: tooltip,
      });
      editBtn._el.setAttribute('title', tooltip);
      editBtn.on('click', function() {
        self._openEditModal(fields, item, wrap);
      });
      headerEl.appendChild(editWrap);
      wrap.appendChild(headerEl);
    }

    /* Lista de campos en modo lectura */
    var listEl = document.createElement('div');
    listEl.className = 'dm-metadata__list';

    fields.forEach(function(field) {
      var row = document.createElement('div');
      row.className = 'dm-metadata__row';

      var labelEl = document.createElement('span');
      labelEl.className   = 'dm-metadata__label';
      labelEl.textContent = field.label + ':';

      var valueEl = document.createElement('span');
      valueEl.className   = 'dm-metadata__value';
      valueEl.textContent = MTS.DocumentManagerPreviewMetadataPanel._displayValue(field);
      valueEl.title       = valueEl.textContent;

      row.appendChild(labelEl);
      row.appendChild(valueEl);
      listEl.appendChild(row);
    });

    wrap.appendChild(listEl);
    return wrap;
  }

  /* ── Modal: editar metadatos ──────────────────────────── */

  _openEditModal(fields, item, readWrap) {
    var self = this;
    var loc  = MTS.DataTable?._activeLocale?.['MTS.DocumentManagerPreviewMetadataPanel'] ?? {};

    /* Construir formulario */
    var formEl = document.createElement('div');
    formEl.className = 'dm-metadata__form';

    /* Mapa de instancias de controles para leer valores al guardar */
    var controlInstances = {};

    fields.forEach(function(field) {
      var group = document.createElement('div');
      group.className = 'dm-metadata__field-group';

      var labelEl = document.createElement('label');
      labelEl.className   = 'dm-metadata__field-label';
      labelEl.textContent = field.label;
      labelEl.setAttribute('for', 'dm-meta-' + field.id);
      group.appendChild(labelEl);

      var controlWrap = document.createElement('div');
      controlWrap.className = 'dm-metadata__field-control';

      if (field.type === 'select') {
        var selectOpts = (field.options || []).map(function(opt) {
          return { value: opt.value, label: opt.text };
        });
        var selectInst = new MTS.Select(controlWrap, {
          id:      'dm-meta-' + field.id,
          options: selectOpts,
          value:   field.value,
        });
        controlInstances[field.id] = { type: 'select', inst: selectInst };

      } else if (field.type === 'textarea') {
        var ta = document.createElement('textarea');
        ta.className = 'dm-metadata__textarea';
        ta.id        = 'dm-meta-' + field.id;
        ta.rows      = 3;
        ta.value     = field.value || '';
        controlWrap.appendChild(ta);
        controlInstances[field.id] = { type: 'textarea', el: ta };

      } else if (field.type === 'number' && typeof MTS.NumberInput === 'function') {
        /* Rich numeric input (theme + step + decimals) instead of the native number spinner. */
        var numInst = new MTS.NumberInput(controlWrap, {
          id:       'dm-meta-' + field.id,
          value:    (field.value != null && field.value !== '') ? Number(field.value) : 0,
          decimals: field.decimals != null ? field.decimals : 0,
        });
        controlInstances[field.id] = { type: 'number', inst: numInst };

      } else if ((field.type === 'date' || field.type === 'datetime') &&
                 MTS.DatePicker && (MTS.DatePicker.Date || MTS.DatePicker.DateTime)) {
        /* Mount the picker on an <input> host so it stays in place — this group already
           renders its own <label>, so a <div> host (which would build a second label) is avoided. */
        var dpInput = document.createElement('input');
        dpInput.id = 'dm-meta-' + field.id;
        controlWrap.appendChild(dpInput);
        var DPClass = (field.type === 'datetime' && MTS.DatePicker.DateTime)
          ? MTS.DatePicker.DateTime
          : MTS.DatePicker.Date;
        var dpInst = new DPClass(dpInput, {});
        if (field.value) {
          var _dv = field.value;
          /* parse a plain yyyy-MM-dd as local midnight to avoid a timezone day-shift */
          if (typeof _dv === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(_dv)) _dv = _dv + 'T00:00:00';
          dpInst.setValue(_dv);
        }
        controlInstances[field.id] = { type: 'date', inst: dpInst, datetime: field.type === 'datetime' };

      } else {
        /* Fallback: native input (text, or native date/number when the rich component isn't loaded). */
        var inputType = field.type === 'date' ? 'date' : (field.type === 'number' ? 'number' : 'text');
        var inputInst = new MTS.Input(controlWrap, {
          id:    'dm-meta-' + field.id,
          type:  inputType,
          value: field.value || '',
        });
        controlInstances[field.id] = { type: 'input', inst: inputInst };
      }

      group.appendChild(controlWrap);
      formEl.appendChild(group);
    });

    var errorEl = document.createElement('span');
    errorEl.className = 'dm-metadata__error';
    errorEl.hidden    = true;
    formEl.appendChild(errorEl);

    var modal = new MTS.Modal({
      title:      loc.editTitle || 'Editar metadatos',
      body:       formEl,
      size:       'md',
      static:     true,
      scrollable: true,
      buttons: [
        {
          label:   loc.cancel || 'Cancelar',
          variant: 'ghost',
          close:   true,
        },
        {
          id:      'dm-meta-save-btn',
          label:   loc.save || 'Guardar',
          variant: 'primary',
          onClick: function() {
            modal.setButtonLoading('dm-meta-save-btn', true);
            errorEl.hidden = true;

            /* Leer valores actuales de cada control */
            var updatedFields = fields.map(function(field) {
              var ctrl     = controlInstances[field.id];
              var newValue = field.value;

              if (ctrl) {
                if (ctrl.type === 'textarea') {
                  newValue = ctrl.el.value;
                } else if (ctrl.type === 'number') {
                  newValue = ctrl.inst.getValue ? ctrl.inst.getValue() : ctrl.inst.value; // number
                } else if (ctrl.type === 'date') {
                  var dv = ctrl.inst.getValue ? ctrl.inst.getValue() : null; // Date | null
                  newValue = (dv instanceof Date) ? self._serializeDate(dv, ctrl.datetime) : (dv || '');
                } else if (ctrl.type === 'select' || ctrl.type === 'input') {
                  newValue = ctrl.inst.getValue ? ctrl.inst.getValue() : ctrl.inst.value;
                }
              }

              return Object.assign({}, field, { value: newValue });
            });

            Promise.resolve(self._onSave(item, updatedFields))
              .then(function() {
                modal.destroy();
                readWrap.replaceWith(self._renderReadMode(updatedFields, item));
              })
              .catch(function(err) {
                console.error('[MTS.DocumentManagerPreviewMetadataPanel] Error al guardar metadatos:', err);
                modal.setButtonLoading('dm-meta-save-btn', false);
                errorEl.textContent = loc.errorSave || 'Error al guardar.';
                errorEl.hidden      = false;
              });
          },
        },
      ],
    });

    modal.show();
  }

  /* ── Helpers ──────────────────────────────────────────── */

  /* Serialize a Date from MTS.DatePicker to a persistable string (yyyy-MM-dd or yyyy-MM-ddTHH:mm). */
  _serializeDate(d, withTime) {
    var p = function(n) { return String(n).padStart(2, '0'); };
    var ymd = d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
    return withTime ? (ymd + 'T' + p(d.getHours()) + ':' + p(d.getMinutes())) : ymd;
  }

  _buildEmptyEl() {
    var loc = MTS.DataTable?._activeLocale?.['MTS.DocumentManagerPreviewMetadataPanel'] ?? {};
    var p = document.createElement('p');
    p.className   = 'dm-metadata__empty';
    p.textContent = loc.noFields || 'Sin metadatos configurados.';
    return p;
  }

  static _displayValue(field) {
    if (field.type === 'select' && Array.isArray(field.options)) {
      var match = field.options.find(function(o) { return o.value === field.value; });
      return match ? match.text : (field.value || '—');
    }
    if ((field.type === 'date' || field.type === 'datetime') && field.value) {
      /* parse yyyy-MM-dd as local midnight, then show with the user's locale */
      var raw = String(field.value);
      var d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw + 'T00:00:00' : raw);
      if (!isNaN(d.getTime())) return field.type === 'datetime' ? d.toLocaleString() : d.toLocaleDateString();
    }
    return field.value || '—';
  }

};
