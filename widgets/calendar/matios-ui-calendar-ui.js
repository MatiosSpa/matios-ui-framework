/* ============================================================
   MATIOS UI — matios-ui-calendar-ui.js  v1.0.0

   Orquestador de UI del calendario.
   Encapsula: init, modales (nuevo/editar/detalle), drop, delete.

   Uso mínimo:
     const ui = new MTS.CalendarUI('#calendario', {
       locale: 'es',
       // Un solo callback para todas las acciones
       onEvent: async (action, event, cal) => {
         // action: 'create'|'view'|'edit'|'delete'|'drop'|'resize'
         // event:  datos del evento o celda seleccionada
         // cal:    instancia MTS.Calendar
       },
     });
     await ui.init();

   Override de modales (opcional):
     const ui = new MTS.CalendarUI('#calendario', {
       renderNewEventModal:    (cal, event) => { },
       renderEventEditModal:   (cal, event) => { },
       renderEventDetailModal: (cal, event) => { },
       renderEventDeleteModal: (cal, event) => { },
     });
   ============================================================ */

window.MTS = window.MTS || {};

MTS.CalendarUI = class CalendarUI {

  /* ──────────────────────────────────────────
     CONSTRUCTOR
  ────────────────────────────────────────── */
  constructor(selector, options = {}) {
    this._selector = selector;
    this._opts     = options;
    this.cal       = null;

    /* Callback único para todas las acciones */
    this._onEvent  = options.onEvent  || null;

    /* Override de modales — si el dev los define, se usan en vez de los propios */
    this._renderNewEventModal    = options.renderNewEventModal    || null;
    this._renderEventEditModal   = options.renderEventEditModal   || null;
    this._renderEventDetailModal = options.renderEventDetailModal || null;
    this._renderEventDeleteModal = options.renderEventDeleteModal || null;

    /* Tipos de evento para el selector (el dev puede sobreescribirlos) */
    this.EVENT_TYPES = options.eventTypes || [
      { value:'reunion',     label:'Reunión'      },
      { value:'tarea',       label:'Tarea'         },
      { value:'recordatorio',label:'Recordatorio' },
      { value:'demo',        label:'Demo'          },
      { value:'formacion',   label:'Formación'    },
      { value:'otro',        label:'Otro'          },
    ];

    /* Paleta de colores — se puede extender via options.colors */
    this.COLORS = options.colors || [
      { id:'cal-blue-dark',  hex:'#1d4ed8', label:'Azul Oscuro'  },
      { id:'cal-blue',       hex:'#3b82f6', label:'Azul'         },
      { id:'cal-blue-light', hex:'#60a5fa', label:'Azul Claro'   },
      { id:'cal-sky',        hex:'#0ea5e9', label:'Cielo'        },
      { id:'cal-indigo',     hex:'#6366f1', label:'Índigo'       },
      { id:'cal-violet',     hex:'#8b5cf6', label:'Violeta'      },
      { id:'cal-purple',     hex:'#a855f7', label:'Púrpura'      },
      { id:'cal-fuchsia',    hex:'#d946ef', label:'Fucsia'       },
      { id:'cal-emerald',    hex:'#10b981', label:'Esmeralda'    },
      { id:'cal-green',      hex:'#22c55e', label:'Verde'        },
      { id:'cal-teal',       hex:'#14b8a6', label:'Teal'         },
      { id:'cal-lime',       hex:'#84cc16', label:'Lima'         },
      { id:'cal-amber',      hex:'#f59e0b', label:'Ámbar'        },
      { id:'cal-orange',     hex:'#f97316', label:'Naranja'      },
      { id:'cal-coral',      hex:'#fb6f72', label:'Coral'        },
      { id:'cal-rose',       hex:'#f43f5e', label:'Rosa'         },
      { id:'cal-red',        hex:'#ef4444', label:'Rojo'         },
      { id:'cal-red-dark',   hex:'#b91c1c', label:'Rojo Oscuro'  },
      { id:'cal-slate',      hex:'#64748b', label:'Slate'        },
      { id:'cal-gray',       hex:'#6b7280', label:'Gris'         },
    ];
  }

  /* ──────────────────────────────────────────
     INIT
  ────────────────────────────────────────── */
  async init(calendarOptions = {}) {
    const opts = Object.assign({
      view:         'week',
      views:        ['week','month','day','schedule'],
      locale:       'es',
      draggable:    true,
      resizable:    true,
      showTooltips: true,
      showNowLine:  true,
    }, this._opts.calendarOptions || {}, calendarOptions);

    this.cal = new MTS.Calendar(this._selector, Object.assign(opts, {
      onAddEventRequest:    ()           => this._dispatch('create', this.cal.selectedEvent),
      onSlotDblClick:       ()           => this._dispatch('create', this.cal.selectedEvent),
      onRangeSelect:        ()           => this._dispatch('create', this.cal.selectedEvent),
      onEventClick:         ({ detail }) => this._dispatch('view',   detail.event),
      onEditEventRequest:   ({ detail }) => this._dispatch('edit',   detail.event),
      onViewEventRequest:   ({ detail }) => this._dispatch('view',   detail.event),
      onEventDrop:          ({ detail }) => this._dispatch('drop',   detail.event),
      onEventResizeEnd:     ({ detail }) => this._dispatch('resize', detail.event),
      onDeleteEventRequest: ({ detail }) => this._dispatch('delete', detail.event),
    }));
  }

  /* ──────────────────────────────────────────
     DROP
  ────────────────────────────────────────── */
  /* ── Dispatcher central — todas las acciones pasan por aquí ── */
  async _dispatch(action, event) {
    /* Readonly — solo view permitido */
    if (this.cal?.readonly && action !== 'view') return;

    /* Locked — solo view permitido */
    if (event?.locked && action !== 'view') return;

    const overrides = {
      create: this._renderNewEventModal,
      edit:   this._renderEventEditModal,
      view:   this._renderEventDetailModal,
      delete: this._renderEventDeleteModal,
    };

    /* 1. Override de modal — el dev muestra su UI y retorna el evento resultante.
       Si retorna null/undefined → el dev canceló, no llamar onEvent.
       Si retorna un objeto → CalendarUI llama onEvent automáticamente. */
    if (overrides[action]) {
      let result;
      try {
        result = await overrides[action](this.cal, event);
      } catch(err) {
        console.error('[CalendarUI] renderModal error:', err);
        return;
      }
      /* Solo llamar onEvent si el dev retornó datos (no canceló) */
      if (result && this._onEvent) {
        try {
          await this._onEvent(action, result, this.cal);
        } catch(err) {
          console.error('[CalendarUI] onEvent error:', err);
          MTS.Toast?.show({ message: 'Error en onEvent', variant: 'danger', duration: 3000 });
        }
      }
      return;
    }

    /* 2. drop/resize sin modal → onEvent directo */
    if (this._onEvent && (action === 'drop' || action === 'resize')) {
      try {
        await this._onEvent(action, event, this.cal);
      } catch(err) {
        console.error('[CalendarUI] onEvent error:', err);
        MTS.Toast?.show({ message: 'Error en onEvent', variant: 'danger', duration: 3000 });
      }
      return;
    }

    /* 3. Modales propios — siempre para create/view/edit/delete */
    switch (action) {
      case 'create': this.openNewModal();         break;
      case 'view':   this.openDetailModal(event); break;
      case 'edit':   this.openEditModal(event);   break;
      case 'delete': this._defaultDelete(event);  break;
    }
  }

  /* ──────────────────────────────────────────
     DELETE
  ────────────────────────────────────────── */
  _defaultDelete(ev) {
    const confirmMsg = `¿Eliminar "${ev.title}"?`;
    if (window.MTS?.Modal?.confirm) {
      MTS.Modal.confirm({
        title: 'Eliminar evento', variant: 'danger',
        message: confirmMsg,
        confirmText: 'Eliminar', cancelText: 'Cancelar',
        onConfirm: () => this._doDelete(ev),
      });
    } else if (confirm(confirmMsg)) {
      this._doDelete(ev);
    }
  }

  async _doDelete(ev) {
    try {
      this.cal.removeEvent(ev.uid ?? ev.id);
      MTS.Toast?.show({ message: `"${ev.title}" eliminado`, variant: 'danger', duration: 2500 });
    } catch (err) {
      console.error('[CalendarUI] _doDelete error:', err);
      MTS.Toast?.show({ message: 'Error al eliminar', variant: 'danger', duration: 3000 });
    }
  }

  /* ──────────────────────────────────────────
     MODAL NUEVO
  ────────────────────────────────────────── */
  openNewModal() {
    this._openModal(null);
  }

  openEditModal(ev) {
    this._openModal(ev);
  }

  /* ──────────────────────────────────────────
     MODAL NUEVO / EDITAR
  ────────────────────────────────────────── */
  _openModal(existingEvent) {
    const isNew = !existingEvent;
    const se    = this.cal.selectedEvent;
    const slots = this.cal._getSlots ? this.cal._getSlots() : null;

    /* ── Calcular rangos de horas válidos según el slot actual ── */
    const slotStart = slots && se.moduleNumber
      ? slots[se.moduleNumber - 1]?.beginTime || '08:00'
      : null;
    const slotEnd   = slots && se.moduleNumber
      ? slots[se.moduleNumber - 1]?.endTime   || '20:00'
      : null;

    /* ── Valores iniciales ── */
    const initTitle  = existingEvent?.title       || '';
    const initDesc   = existingEvent?.description || '';
    const initType   = existingEvent?.data?.tipo  || this.EVENT_TYPES[0].value;
    const initColor  = existingEvent?.color       || this.COLORS[1].hex;
    const initStartH = existingEvent?.startH ?? se.startH ?? null;
    const initStartM = existingEvent?.startM ?? se.startM ?? 0;
    const initEndH   = existingEvent?.endH   ?? se.endH   ?? null;
    const initEndM   = existingEvent?.endM   ?? se.endM   ?? 0;
    const pad        = n => String(n ?? 0).padStart(2, '0');
    const initStart  = initStartH != null ? `${pad(initStartH)}:${pad(initStartM)}` : (slotStart || '09:00');
    const initEnd    = initEndH   != null ? `${pad(initEndH)}:${pad(initEndM)}`     : (slotEnd   || '10:00');

    /* ── Body del modal ── */
    const body = document.createElement('div');
    body.className = 'mts-form';
    body.style.display = 'flex';
    body.style.flexDirection = 'column';
    body.style.gap = '14px';

    /* ── Título ── */
    const titleGroup = document.createElement('div');
    titleGroup.className = 'mts-form-group';
    const titleInput = new MTS.Input(titleGroup, {
      label:       'Título',
      placeholder: 'Ej: Reunión de equipo',
      value:       initTitle,
      required:    true,
    });

    /* ── Tipo ── */
    const typeGroup = document.createElement('div');
    typeGroup.className = 'mts-form-group';
    const typeSelect = new MTS.Select(typeGroup, {
      label:   'Tipo',
      value:   initType,
      options: this.EVENT_TYPES.map(t => ({
        value: t.value,
        label: t.label,
      })),
    });

    /* ── Horario (solo en modo horas, no en modo slots) ── */
    let startInput = null, endInput = null;
    const hasHours = !slots && (se.startH != null || existingEvent?.startH != null || initStartH != null);

    if (!slots) {
      const timeRow = document.createElement('div');
      timeRow.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:10px;';

      const startGroup = document.createElement('div');
      startGroup.className = 'mts-form-group';
      startInput = new MTS.Input(startGroup, {
        label: 'Inicio', type: 'time', value: initStart, required: true,
      });

      const endGroup = document.createElement('div');
      endGroup.className = 'mts-form-group';
      endInput = new MTS.Input(endGroup, {
        label: 'Fin', type: 'time', value: initEnd, required: true,
      });

      timeRow.appendChild(startGroup);
      timeRow.appendChild(endGroup);
      body.appendChild(titleGroup);
      body.appendChild(typeGroup);
      body.appendChild(timeRow);
    } else {
      body.appendChild(titleGroup);
      body.appendChild(typeGroup);
    }

    /* ── Descripción ── */
    const descGroup = document.createElement('div');
    descGroup.className = 'mts-form-group';
    const descInput = new MTS.Input(descGroup, {
      label:       'Descripción',
      placeholder: 'Notas, lugar, participantes...',
      value:       initDesc,
    });
    body.appendChild(descGroup);

    /* ── Color picker ── */
    const colorGroup = document.createElement('div');
    colorGroup.className = 'mts-form-group';
    const colorLabel = document.createElement('label');
    colorLabel.className = 'mts-form-label';
    colorLabel.textContent = 'Color';
    const colorGrid = document.createElement('div');
    colorGrid.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-top:6px;';

    let selectedColorHex = initColor;
    this.COLORS.forEach(col => {
      const sw = document.createElement('div');
      sw.title = col.label;
      sw.style.cssText = [
        `width:22px;height:22px;border-radius:50%;`,
        `background:${col.hex};cursor:pointer;`,
        `border:3px solid ${col.hex === selectedColorHex ? 'var(--mts-text-primary)' : 'transparent'};`,
        `transition:border-color .12s;box-sizing:border-box;`,
      ].join('');
      sw.onclick = () => {
        colorGrid.querySelectorAll('div').forEach(s => s.style.borderColor = 'transparent');
        sw.style.borderColor = 'var(--mts-text-primary)';
        selectedColorHex = col.hex;
      };
      colorGrid.appendChild(sw);
    });

    colorGroup.appendChild(colorLabel);
    colorGroup.appendChild(colorGrid);
    body.appendChild(colorGroup);

    /* ── Modal ── */
    const titleIcon = window.MTS?.Icon
      ? `<span style="display:inline-flex;align-items:center;gap:8px;">${MTS.Icon.get(isNew ? 'add-circle' : 'edit', 16)} ${isNew ? 'Nuevo evento' : 'Editar evento'}</span>`
      : (isNew ? 'Nuevo evento' : 'Editar evento');

    const modal = new MTS.Modal({
      title:      titleIcon,
      size:       'sm',
      scrollable: true,
      body,
      buttons: [
        {
          label: 'Cancelar', variant: 'ghost',
          onClick: () => { this.cal.clearSelectedEvent(); modal.hide(); },
        },
        {
          label:    isNew ? 'Crear' : 'Guardar',
          variant:  'primary',
          iconLeft: window.MTS?.Icon ? MTS.Icon.get('save', 14) : null,
          onClick:  () => this._saveEvent({
            isNew, existingEvent, se, titleInput, typeSelect,
            startInput, endInput, descInput, selectedColorHexRef: () => selectedColorHex,
            modal,
          }),
        },
      ],
    });

    modal.show();
    /* Focus el título */
    setTimeout(() => titleGroup.querySelector('input')?.focus(), 100);
  }

  /* ──────────────────────────────────────────
     GUARDAR EVENTO
  ────────────────────────────────────────── */
  async _saveEvent({ isNew, existingEvent, se, titleInput, typeSelect,
                     startInput, endInput, descInput, selectedColorHexRef, modal }) {

    const title = titleInput.getValue?.() ?? titleInput.value ?? '';
    const tipo  = typeSelect.getValue?.() ?? '';
    const desc  = descInput.getValue?.()  ?? descInput.value  ?? '';
    const color = selectedColorHexRef();

    /* ── Validaciones ── */
    let valid = true;
    titleInput.setError?.('');

    if (!title.trim()) {
      titleInput.setError?.('El título es obligatorio');
      valid = false;
    }

    /* Validar inicio <= fin solo en modo horas */
    if (startInput && endInput) {
      const startVal = startInput.getValue?.() ?? startInput.value ?? '';
      const endVal   = endInput.getValue?.()   ?? endInput.value   ?? '';

      if (startVal && endVal) {
        const [sh, sm] = startVal.split(':').map(Number);
        const [eh, em] = endVal.split(':').map(Number);
        const startMin = sh * 60 + sm;
        const endMin   = eh * 60 + em;

        if (endMin <= startMin) {
          endInput.setError?.('La hora de fin debe ser mayor al inicio');
          valid = false;
        } else {
          endInput.setError?.('');
        }
      }
    }

    if (!valid) return;

    /* ── Construir evento ── */
    const eventObj = new MTS.CalendarEvent({
      id:          isNew ? -(Date.now()) : existingEvent.id,
      title:       title.trim(),
      description: desc.trim(),
      dayNumber:   isNew ? se.dayNumber   : existingEvent.dayNumber,
      date:        isNew ? se.date        : existingEvent.date,
      color,
      data: {
        tipo,
        ...(existingEvent?.data || {}),
      },
    });

    /* Posición */
    if (se.moduleNumber != null) {
      eventObj.moduleNumber = isNew ? se.moduleNumber : existingEvent.moduleNumber;
      eventObj.moduleCount  = isNew ? se.moduleCount  : existingEvent.moduleCount;
    }

    /* Horario en modo horas */
    if (startInput && endInput) {
      const sv = startInput.getValue?.() ?? '';
      const ev = endInput.getValue?.()   ?? '';
      if (sv && ev) {
        const [sh, sm] = sv.split(':').map(Number);
        const [eh, em] = ev.split(':').map(Number);
        eventObj.startH = sh; eventObj.startM = sm;
        eventObj.endH   = eh; eventObj.endM   = em;
        eventObj.hourRange = eventObj._buildHourRange();
      }
    }

    try {
      /* Notificar al dev via onEvent */
      if (this._onEvent) {
        await this._onEvent(isNew ? 'create' : 'update', eventObj.toJSON(), this.cal);
      }

      if (isNew) {
        this.cal.addEvent(eventObj.toJSON());
        MTS.Toast?.show({ message: `"${title}" creado`, variant: 'success', duration: 2500 });
      } else {
        this.cal.updateEvent(existingEvent.id, eventObj.toJSON());
        MTS.Toast?.show({ message: `"${title}" actualizado`, variant: 'success', duration: 2500 });
      }

      this.cal.clearSelectedEvent();
      modal.hide();
    } catch (err) {
      console.error('[CalendarUI] save error:', err);
      MTS.Toast?.show({ message: 'Error al guardar', variant: 'danger', duration: 3000 });
    }
  }

  /* ──────────────────────────────────────────
     MODAL DETALLE
  ────────────────────────────────────────── */
  openDetailModal(ev) {
    const ic   = n => window.MTS?.Icon ? MTS.Icon.get(n, 15) : '';
    const pad  = n => String(n ?? 0).padStart(2, '0');
    const data = ev.data || {};

    const startStr = ev.startH != null ? `${pad(ev.startH)}:${pad(ev.startM ?? 0)}` : null;
    const endStr   = ev.endH   != null ? `${pad(ev.endH)}:${pad(ev.endM   ?? 0)}`   : null;
    const durMin   = (startStr && endStr)
      ? (ev.endH - ev.startH) * 60 + (ev.endM ?? 0) - (ev.startM ?? 0)
      : null;
    const durStr   = durMin != null
      ? (durMin >= 60 ? `${Math.floor(durMin / 60)}h${durMin % 60 ? ` ${durMin % 60}min` : ''}` : `${durMin}min`)
      : null;

    const _esc = s => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const row = (icon, key, val) => val
      ? `<div style="display:flex;align-items:flex-start;gap:10px;padding:7px 0;border-bottom:1px solid var(--mts-border-color);">
           <span style="color:var(--mts-color-primary);flex-shrink:0;margin-top:1px;">${ic(icon)}</span>
           <div><div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:var(--mts-text-muted);margin-bottom:2px;">${_esc(key)}</div>
           <div style="font-size:13px;color:var(--mts-text-primary)">${_esc(val)}</div></div>
         </div>`
      : '';

    const body = document.createElement('div');
    body.innerHTML = `
      <div style="height:4px;border-radius:2px;background:${ev.color || '#3b82f6'};margin-bottom:12px;"></div>
      ${row('calendar', 'Día', (() => {
        const slots = this.cal._getSlots?.();
        if (slots && ev.moduleNumber) {
          const s = slots[ev.moduleNumber - 1];
          return `Módulo ${ev.moduleNumber}${s ? ` · ${s.beginTime} – ${s.endTime}` : ''}`;
        }
        return startStr ? `${startStr} – ${endStr} <span style="color:var(--mts-text-muted);font-size:12px">(${durStr})</span>` : null;
      })())}
      ${row('tag',      'Tipo',         data.tipo)}
      ${row('user',     'Responsable',  data.responsable)}
      ${row('users',    'Asistentes',   data.asistentes)}
      ${row('map-pin',  'Lugar',        data.sala || data.lugar)}
      ${row('file-text','Descripción',  ev.description)}
      ${ev.date && ev.date !== '0000-00-00'
        ? row('calendar', 'Fecha', ev.date)
        : ''}
      ${ev.locked ? `<div style="display:flex;align-items:center;gap:8px;padding:8px 10px;background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:6px;font-size:12px;color:var(--mts-color-warning);margin-top:8px;">${ic('lock')} Evento bloqueado — solo lectura</div>` : ''}
      <div style="font-size:10px;color:var(--mts-text-muted);margin-top:10px;">ID: ${ev.id}</div>`;

    const modal = new MTS.Modal({
      title: ev.title,
      size:  'sm',
      body,
      buttons: [
        { label: 'Cerrar', variant: 'ghost', onClick: () => modal.hide() },
        ...(!ev.locked ? [{
          label:    'Editar',
          variant:  'primary',
          iconLeft: window.MTS?.Icon ? MTS.Icon.get('edit', 14) : null,
          onClick:  () => { modal.hide(); this.openEditModal(ev); },
        }] : []),
      ],
    });
    modal.show();
  }

  /* ──────────────────────────────────────────
     API PÚBLICA
  ────────────────────────────────────────── */
  getCalendar() { return this.cal; }
  getEvents()   { return this.cal?.getEvents() ?? []; }

  /* Agregar color custom al picker */
  addColor(id, hex, label) {
    this.COLORS.push({ id, hex, label: label || id });
  }

  /* Sobreescribir tipos de evento */
  setEventTypes(types) {
    this.EVENT_TYPES = types;
  }
};
