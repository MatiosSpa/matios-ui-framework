/* ============================================================
   MATIOS UI — matios-ui-calendar.js  v2.0
   MTS.Calendar — Orquestador. Delega render a vistas.

   Requiere (en orden):
     matios-ui-calendar-shared.js
     matios-ui-calendar-week.js
     matios-ui-calendar-day.js
     matios-ui-calendar-month.js
     matios-ui-calendar-schedule.js
     matios-ui-calendar-i18n.js  (opcional)
   ============================================================ */

window.MTS = window.MTS || {};

MTS.Calendar = class MtsCalendar {

  /* ── Constantes de días ─────────────────────────────────── */
  static get DAYS_MON_FRI() { return [1,2,3,4,5]; }
  static get DAYS_MON_SAT() { return [1,2,3,4,5,6]; }
  static get DAYS_MON_SUN() { return [1,2,3,4,5,6,0]; }
  static get DAYS_SUN_SAT() { return [0,1,2,3,4,5,6]; }

  /* ── Vistas (enum, evita strings mágicos; el valor sigue siendo string) ── */
  static get VIEW()      { return { WEEK: 'week', MONTH: 'month', DAY: 'day', SCHEDULE: 'schedule' }; }
  static get VIEWS_ALL() { return ['week', 'month', 'day', 'schedule']; }

  /* ── Constructor ────────────────────────────────────────── */
  constructor(selector, options = {}) {
    this._el = typeof selector === 'string'
      ? document.querySelector(selector) : selector;
    if (!this._el) { console.error('[MTS.Calendar] No encontrado:', selector); return; }

    /* Config */
    this.view         = options.view      || 'week';
    this.days         = options.days      || MTS.Calendar.DAYS_MON_FRI;
    this.views        = options.views     || ['week','month','day','schedule'];
    this.draggable    = options.draggable    ?? true;
    this.resizable    = options.resizable    ?? true;
    this.readonly     = options.readonly     ?? false;
    this.allowOverlap = options.allowOverlap ?? false;
    this.showNowLine  = options.showNowLine  ?? true;
    this.showMiniCal  = options.showMiniCal  ?? false;
    this.showTooltips = options.showTooltips ?? true;
    this.snapMinutes  = options.snapMinutes  ?? 15;
    this.maxMonthEvents = options.maxMonthEvents ?? 3;
    this.eventDensity = options.eventDensity || 'comfortable';
    this.debug        = options.debug ?? false;
    this.contextMenuEvent = options.contextMenuEvent || null;
    this.contextMenuCell  = options.contextMenuCell  || null;

    if (this.readonly) { this.draggable = false; this.resizable = false; }
    if (options.resources) this.days = options.resources.map(r => r.dayNumber ?? r.label ?? r.id);

    /* Horario */
    this._startTime = options.startTime || null;
    this._endTime   = options.endTime   || null;
    this.startHour  = options.startHour ?? 8;
    this.endHour    = options.endHour   ?? 20;
    this.slotSize   = options.slotSize  ?? 60;
    this.slots      = options.slots     || null;

    /* i18n */
    const localeKey = window.MTS && MTS.getLanguage && MTS.getLanguage();
    this._locale    = MTS.CalendarLanguages?.[localeKey] || null;
    this._t         = key => this._locale?.[key] ?? key;

    /* Datasource — nombre homologado `dataSource` (camelCase, igual que DataTable/Gantt);
       se mantiene `datasource` (minúscula) como alias para no romper el uso previo. */
    this._datasource       = options.dataSource       ?? options.datasource       ?? null;
    this._datasourceParser = options.dataSourceParser || options.datasourceParser || null;
    this._datasourceParams = options.dataSourceParams || options.datasourceParams || {};
    this._autoRefetch      = options.autoRefetch      ?? true;

    /* Callbacks de render */
    this.onEventRender    = options.onEventRender    || null;
    this._renderSlotHeader = options.renderSlotHeader || null;

    /* Estado */
    this._events    = [];
    this._offset    = 0;
    this._loading   = false;
    this._listeners = {};
    this._savedWeekOffset = undefined;
    this._slotsCache      = null;

    /* selectedEvent público */
    this.selectedEvent = this._emptySelectedEvent();

    /* Callbacks opcionales */
    const cbs = [
      'onEventClick','onEventDblClick','onEventRightClick',
      'onSlotClick','onSlotDblClick','onSlotRightClick',
      'onEventDragStart','onEventDragEnd','onEventDrop',
      'onEventResize','onEventResizeEnd',
      'onEventCollision','onLockedCollision',
      'onDayClick','onWeekChange','onViewChange',
      'onReady','onError','onNavigate',
      'onViewEventRequest','onEditEventRequest',
      'onDeleteEventRequest','onAddEventRequest',
      'onRangeSelect','onMoreDayClick',
    ];
    cbs.forEach(cb => {
      if (options[cb]) this.on(
        cb.replace(/^on/,'').replace(/^./,c=>c.toLowerCase()),
        options[cb]
      );
    });

    this._build();
  }

  /* ── API pública ────────────────────────────────────────── */

  addEvent(ev) {
    const S = MTS._CalendarShared;
    const def = { color:'#3b82f6', locked:false, allDay:false, data:{}, _colIdx:null, _module:null, _positioned:false };
    const e   = { ...def, ...ev };
    if (!e.id) e.id = e.uid || String(-(Date.now()));
    if (!e.uid) e.uid = e.id;
    this._events.push(e);
    this._normalizeEvents();
    this._render(false);
    return this;
  }

  updateEvent(id, p) {
    const i = this._events.findIndex(e => (e.uid??e.id) === id || e.id === id);
    if (i >= 0) {
      this._events[i] = { ...this._events[i], ...p, _colIdx:null, _module:null, _positioned:false };
      this._normalizeEvents();
      this._render(false);
    }
    return this;
  }

  /* Actualización interna post-drag/resize — sin re-normalizar */
  _updateEventInternal(id, p) {
    const i = this._events.findIndex(e => (e.uid??e.id) === id || e.id === id);
    if (i >= 0) this._events[i] = { ...this._events[i], ...p };
  }

  removeEvent(id) {
    this._events = this._events.filter(e => (e.uid??e.id) !== id && e.id !== id);
    this._render(false);
    return this;
  }

  getEvents() { return [...this._events]; }

  getData(uid, field) {
    const ev = this._events.find(e => (e.uid??e.id) === uid);
    if (!ev) return undefined;
    if (field !== undefined) return ev.data?.[field];
    return ev.data ? { ...ev.data } : {};
  }

  setView(v) {
    const prevView = this.view;
    if (prevView === v) return this;
    if (v === 'week') {
      this._offset = this._savedWeekOffset ?? 0;
      this._savedWeekOffset = undefined;
    } else {
      if (prevView === 'week') this._savedWeekOffset = this._offset;
      this._offset = 0;
    }
    this.view = v;
    this._emit('viewChange', { view:v });
    if (this._viewBtns)
      Object.entries(this._viewBtns).forEach(([k,b]) =>
        b.classList.toggle('mts-calendar__view-btn--active', k===v));
    if (this._datasource && !Array.isArray(this._datasource)) {
      this._slotsCache = null;
      this._loadDatasource();
    } else {
      this._render(true);
    }
    return this;
  }

  prevWeek()    { this._offset--; this._savedWeekOffset=undefined; this._onNavigate(); return this; }
  nextWeek()    { this._offset++; this._savedWeekOffset=undefined; this._onNavigate(); return this; }
  today()       { this._offset=0; this._savedWeekOffset=undefined; this._onNavigate(); return this; }
  goToOffset(n) { this._offset=n; this._savedWeekOffset=undefined; this._onNavigate(); return this; }

  async refresh() {
    if (this._datasource) await this._loadDatasource();
    else this._render(true);
    return this;
  }

  destroy() {
    this._currentView?.destroy?.();
    clearInterval(this._nowTimer);
    document.removeEventListener('keydown', this._onDocKey);
    this._el.innerHTML = '';
  }

  showLoader() { if (this._loaderEl) this._loaderEl.style.display = 'flex'; return this; }
  hideLoader() { if (this._loaderEl) this._loaderEl.style.display = 'none'; return this; }

  on(e, cb)  { if (!this._listeners[e]) this._listeners[e]=[]; this._listeners[e].push(cb); return this; }
  off(e, cb) { this._listeners[e]=(this._listeners[e]||[]).filter(f=>f!==cb); return this; }

  clearSelectedEvent() { this.selectedEvent = this._emptySelectedEvent(); }

  /* ── selectedEvent ──────────────────────────────────────── */
  _emptySelectedEvent() {
    return { id:null, uid:null, title:'', dayNumber:null, date:null, dateISO:null,
             moduleNumber:null, moduleCount:1, hourRange:null, startH:null, startM:0,
             endH:null, endM:0, color:'#3b82f6', data:{} };
  }

  _setSelectedFromCell(dayNumberJS, moduleIndex, dateStr, hourRange) {
    const S     = MTS._CalendarShared;
    const slots = S.getSlots(this);
    const slot  = slots[moduleIndex];
    Object.assign(this.selectedEvent, {
      id:null, uid:null, title:'',
      dayNumber:    dayNumberJS,
      date:         dateStr || '0000-00-00',
      dateISO:      dateStr,
      moduleNumber: moduleIndex + 1,
      moduleCount:  1,
      hourRange,
      startH: slot?.hour  ?? null,
      startM: slot?.minute ?? 0,
      endH:   slot?.endHour   ?? null,
      endM:   slot?.endMinute ?? 0,
    });
  }

  _setSelectedFromEvent(ev, dayNumberJS, date, slots) {
    const S = MTS._CalendarShared;
    /* date puede ser objeto Date o string ISO — normalizar */
    const dateStr = date
      ? (date instanceof Date ? S.isoLocal(date) : String(date))
      : (ev.date || '0000-00-00');
    Object.assign(this.selectedEvent, {
      id:           ev.id,
      uid:          ev.uid ?? ev.id,
      title:        ev.title,
      dayNumber:    dayNumberJS ?? ev.dayNumber,
      date:         dateStr,
      dateISO:      dateStr,
      moduleNumber: ev.moduleNumber ?? null,
      moduleCount:  ev.moduleCount  ?? 1,
      hourRange:    ev.hourRange ?? null,
      startH:       ev.startH ?? null,
      startM:       ev.startM ?? 0,
      endH:         ev.endH   ?? null,
      endM:         ev.endM   ?? 0,
      color:        ev.color  ?? '#3b82f6',
      description:  ev.description ?? '',
      data:         ev.data ?? {},
    });
  }

  /* ── Build DOM ──────────────────────────────────────────── */
  _build() {
    this._el.innerHTML = '';
    this._el.className = `mts-calendar mts-calendar--${this.view} mts-calendar--density-${this.eventDensity}`;
    this._buildToolbar();

    const wrap       = document.createElement('div'); wrap.className = 'mts-calendar__wrap';
    this._headerEl   = document.createElement('div'); this._headerEl.className = 'mts-calendar__header';
    this._alldayEl   = document.createElement('div'); this._alldayEl.className = 'mts-calendar__allday'; this._alldayEl.style.display = 'none';
    const body       = document.createElement('div'); body.className = 'mts-calendar__body';
    this._scrollEl   = document.createElement('div'); this._scrollEl.className = 'mts-calendar__scroll';
    this._timesEl    = document.createElement('div'); this._timesEl.className  = 'mts-calendar__times';
    this._gridEl     = document.createElement('div'); this._gridEl.className   = 'mts-calendar__grid';
    this._loaderEl   = document.createElement('div'); this._loaderEl.className = 'mts-calendar__loader'; this._loaderEl.style.display = 'none';
    this._loaderEl.innerHTML = `<div class="mts-calendar__loader-spinner"><div></div><div></div><div></div></div><span>Cargando...</span>`;

    this._scrollEl.appendChild(this._timesEl);
    this._scrollEl.appendChild(this._gridEl);
    body.appendChild(this._scrollEl);
    wrap.appendChild(this._headerEl);
    wrap.appendChild(this._alldayEl);
    wrap.appendChild(body);
    wrap.appendChild(this._loaderEl);
    this._el.appendChild(wrap);

    this._onDocKey = e => {
      if (e.key === 'Escape') MTS._CalendarShared.hideCtxMenu();
    };
    document.addEventListener('keydown', this._onDocKey);

    setTimeout(() => {
      if (this._datasource) this._loadDatasource(); else this._render(true);
    }, 0);

    if (this.showNowLine) {
      this._nowTimer = setInterval(() => {
        this._gridEl.querySelectorAll('[data-now-line]').forEach(l => {
          const S   = MTS._CalendarShared;
          const now = new Date();
          const nowMin = now.getHours()*60 + now.getMinutes();
          const base   = S.baseMinute(this);
          const total  = S.totalMinutes(this);
          const slots  = S.getSlots(this);
          const totalPx = slots.reduce((s,sl)=>s+sl.px,0);
          if (nowMin>=base && nowMin<=base+total) {
            l.style.top=`${(nowMin-base)*(totalPx/total)}px`; l.style.display='block';
          } else l.style.display='none';
        });
      }, 60000);
    }
  }

  /* ── Toolbar ─────────────────────────────────────────────── */
  _buildToolbar() {
    const tb   = document.createElement('div'); tb.className = 'mts-calendar__toolbar';
    const left = document.createElement('div'); left.className = 'mts-calendar__toolbar-left';

    const prev = document.createElement('button'); prev.className = 'mts-calendar__nav-btn';
    prev.innerHTML = MTS.Icon.get('chevron-left');
    prev.addEventListener('click', () => this.prevWeek());

    this._periodLabelEl = document.createElement('span'); this._periodLabelEl.className = 'mts-calendar__period';

    const next = document.createElement('button'); next.className = 'mts-calendar__nav-btn';
    next.innerHTML = MTS.Icon.get('chevron-right');
    next.addEventListener('click', () => this.nextWeek());

    const todayBtn = document.createElement('button'); todayBtn.className = 'mts-calendar__today-btn';
    todayBtn.textContent = this._t('today') || 'Hoy';
    todayBtn.addEventListener('click', () => this.today());

    left.appendChild(prev); left.appendChild(this._periodLabelEl); left.appendChild(next); left.appendChild(todayBtn);

    const right     = document.createElement('div'); right.className = 'mts-calendar__toolbar-right';
    const exportW   = document.createElement('div'); exportW.className = 'mts-calendar__toolbar-export';
    const csvBtn    = document.createElement('button'); csvBtn.className = 'mts-calendar__export-btn'; csvBtn.textContent = 'CSV'; csvBtn.addEventListener('click', () => this.exportCSV());
    const icalBtn   = document.createElement('button'); icalBtn.className = 'mts-calendar__export-btn'; icalBtn.textContent = 'iCal'; icalBtn.addEventListener('click', () => this.exportICal());
    const printBtn  = document.createElement('button'); printBtn.className = 'mts-calendar__export-btn';
    printBtn.innerHTML = MTS.Icon.get('printer');
    printBtn.addEventListener('click', () => this.print());
    exportW.appendChild(csvBtn); exportW.appendChild(icalBtn); exportW.appendChild(printBtn);

    if (this.views.length > 1) {
      const labels = { week:this._t('week')||'Semana', month:this._t('month')||'Mes', day:this._t('day')||'Día', schedule:this._t('schedule')||'Agenda' };
      this._viewBtns = {};
      this.views.forEach(v => {
        const btn = document.createElement('button');
        btn.className = 'mts-calendar__view-btn' + (v===this.view?' mts-calendar__view-btn--active':'');
        btn.textContent = labels[v] || v;
        btn.addEventListener('click', () => this.setView(v));
        this._viewBtns[v] = btn; right.appendChild(btn);
      });
    }

    tb.appendChild(left); tb.appendChild(exportW); tb.appendChild(right);
    this._el.appendChild(tb);
  }

  /* ── Render ─────────────────────────────────────────────── */
  _render(emitReady = false) {
    /* Invalidar slots cache al re-renderizar */
    this._slotsCache = null;

    /* Reset posiciones para recalcular */
    this._events.forEach(ev => {
      if (ev._positioned) return;
      ev._colIdx = null;
      if (ev.date) ev._module = null;
    });
    this._normalizeEvents();

    this._el.className = `mts-calendar mts-calendar--${this.view} mts-calendar--density-${this.eventDensity}`;
    this._updatePeriodLabel();

    /* Destruir vista anterior si existe */
    this._currentView?.destroy?.();

    /* Contexto que recibe la vista */
    const ctx = {
      /* DOM */
      headerEl:  this._headerEl,
      timesEl:   this._timesEl,
      gridEl:    this._gridEl,
      alldayEl:  this._alldayEl,
      /* Datos */
      events:    this._events,
      days:      this.days,
      offset:    this._offset,
      locale:    this._locale,
      /* Config */
      cal:         this,
      draggable:   this.draggable,
      resizable:   this.resizable,
      readonly:    this.readonly,
      allowOverlap: this.allowOverlap,
      showNowLine:  this.showNowLine,
      maxEvents:    this.maxMonthEvents,
      /* Callbacks al orquestador */
      emit:               (ev, detail) => this._emit(ev, detail),
      rerender:           () => this._render(false),
      updateEventInternal:(id, p) => this._updateEventInternal(id, p),
      setSelectedFromCell:(dayJS, si, dateStr, hr) => this._setSelectedFromCell(dayJS, si, dateStr, hr),
      setSelectedFromEvent:(ev, dayJS, date, slots) => this._setSelectedFromEvent(ev, dayJS, date, slots),
      contextMenuCell: this.contextMenuCell,
    };

    /* Instanciar y renderizar la vista */
    switch (this.view) {
      case 'week':
        this._currentView = new MTS.WeekView();
        this._currentView.render(ctx);
        break;
      case 'day':
        this._currentView = new MTS.DayView();
        this._currentView.render(ctx);
        break;
      case 'month':
        this._currentView = new MTS.MonthView();
        this._currentView.render(ctx);
        break;
      case 'schedule':
        this._currentView = new MTS.ScheduleView();
        this._currentView.render(ctx);
        break;
    }

    if (emitReady) this._emit('ready', { events: this._events, visibleDays: this.days });
    this._alldayEl.style.display = (this.view === 'week') ? '' : 'none';
  }

  /* ── Normalizar eventos ─────────────────────────────────── */
  _normalizeEvents() {
    const S     = MTS._CalendarShared;
    const dates = this.view === 'week' ? S.weekDates(this._offset, this.days) : null;
    this._events.forEach(ev => {
      if (ev._colIdx != null) return;
      if (typeof ev.dayNumber === 'number') {
        if (dates) {
          const idx = dates.findIndex(d => d && d.getDay() === ev.dayNumber);
          ev._colIdx = idx >= 0 ? idx : -1;
        } else {
          ev._colIdx = S.dayJsToColIdx(ev.dayNumber, this.days);
        }
      } else ev._colIdx = -1;
      if (ev._module == null && ev.moduleNumber != null) ev._module = ev.moduleNumber - 1;
      if (ev.moduleNumber === undefined) ev.moduleNumber = null;
      if (ev.moduleCount == null) ev.moduleCount = ev.moduleSpan ?? 1;
    });
  }

  /* ── Datasource ─────────────────────────────────────────── */
  async _loadDatasource() {
    this.showLoader(); this._loading = true;
    const S      = MTS._CalendarShared;
    const view   = this._getViewInstance();
    const range  = view?.getDateRange?.(this._offset, this.days) || { dateStart: null, dateEnd: null };
    const ctx    = { ...range, offset: this._offset, view: this.view };

    this._log('[MTS.Calendar] _loadDatasource →', ctx);
    try {
      let raw;
      if (Array.isArray(this._datasource)) {
        raw = this._datasource;
      } else if (typeof this._datasource === 'function') {
        raw = await this._datasource({ ...ctx, ...this._datasourceParams });
      }
      const parsed = this._datasourceParser ? this._datasourceParser(raw, ctx) : raw;
      this._events = Array.isArray(parsed) ? parsed : (parsed?.data || []);
      this.hideLoader(); this._loading = false;
      this._emit('datasourceLoad', { events: this._events, ...ctx });
      this._render(true);
    } catch(err) {
      this.hideLoader(); this._loading = false;
      this._emit('error', { error: err });
    }
  }

  _getViewInstance() {
    switch (this.view) {
      case 'week':     return new MTS.WeekView();
      case 'day':      return new MTS.DayView();
      case 'month':    return new MTS.MonthView();
      case 'schedule': return new MTS.ScheduleView();
    }
  }

  /* ── Navigate ───────────────────────────────────────────── */
  _onNavigate() {
    const S     = MTS._CalendarShared;
    const view  = this._currentView || this._getViewInstance();
    const range = view?.getDateRange?.(this._offset, this.days) || {};
    const detail = { ...range, offset: this._offset, view: this.view };
    this._emit('weekChange', detail);
    this._emit('navigate',   detail);
    if (this._datasource && this._autoRefetch && !Array.isArray(this._datasource)) {
      this._slotsCache = null;
      this._loadDatasource();
    } else {
      this._render(false);
    }
    if (this._miniCalEl) this._renderMiniCal(this._miniCalEl);
  }

  /* ── Period label ────────────────────────────────────────── */
  _updatePeriodLabel() {
    if (!this._periodLabelEl) return;
    const S   = MTS._CalendarShared;
    const ms  = this._locale?.monthsShort || ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const mf  = this._locale?.months || ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const today = S.todayLocal();

    if (this.view === 'week') {
      const dates = S.weekDates(this._offset, this.days);
      const s = dates[0], e = dates[dates.length-1];
      const sameMonth = s.getMonth() === e.getMonth();
      const label = sameMonth
        ? `${s.getDate()} – ${e.getDate()} ${ms[s.getMonth()]} ${s.getFullYear()}`
        : `${s.getDate()} ${ms[s.getMonth()]} — ${e.getDate()} ${ms[e.getMonth()]} ${e.getFullYear()}`;
      this._periodLabelEl.textContent = label;
      this._periodLabelEl.dataset.beginDate = S.isoLocal(s);
      this._periodLabelEl.dataset.endDate   = S.isoLocal(e);
    } else if (this.view === 'month') {
      const a = new Date(today.getFullYear(), today.getMonth()+this._offset, 1);
      this._periodLabelEl.textContent = `${mf[a.getMonth()]} ${a.getFullYear()}`;
      const first = new Date(a.getFullYear(), a.getMonth(), 1);
      const last  = new Date(a.getFullYear(), a.getMonth()+1, 0);
      this._periodLabelEl.dataset.beginDate = S.isoLocal(first);
      this._periodLabelEl.dataset.endDate   = S.isoLocal(last);
    } else if (this.view === 'day') {
      const d = S.todayLocal(); d.setDate(d.getDate()+this._offset);
      this._periodLabelEl.textContent = `${d.getDate()} de ${mf[d.getMonth()]} ${d.getFullYear()}`;
      const iso = S.isoLocal(d);
      this._periodLabelEl.dataset.beginDate = iso;
      this._periodLabelEl.dataset.endDate   = iso;
    } else if (this.view === 'schedule') {
      const sDate = S.todayLocal(); sDate.setDate(sDate.getDate()+this._offset);
      const eDate = new Date(sDate); eDate.setDate(sDate.getDate()+29);
      this._periodLabelEl.textContent = `${sDate.getDate()} ${ms[sDate.getMonth()]} — ${eDate.getDate()} ${ms[eDate.getMonth()]} ${eDate.getFullYear()}`;
    }
  }

  /* ── Emit ────────────────────────────────────────────────── */
  _emit(event, detail = {}) {
    (this._listeners[event] || []).forEach(fn => fn({ type:event, detail }));
    this._el.dispatchEvent(new CustomEvent(`mts:calendar:${event}`, { bubbles:true, detail }));
  }

  /* ── Log ─────────────────────────────────────────────────── */
  /* Helpers públicos para uso desde el demo/dev */
  _dayLabel(dayNumber) { return MTS._CalendarShared.dayLabel(dayNumber, this._locale); }
  _isoLocal(d)         { return MTS._CalendarShared.isoLocal(d); }
  _todayLocal()        { return MTS._CalendarShared.todayLocal(); }
  _getSlots()          { return MTS._CalendarShared.getSlots(this); }
  _getWeekDates()      { return MTS._CalendarShared.weekDates(this._offset, this.days); }


  /* ── getConfig — current configuration with metadata ─────── */
  getConfig() {
    const daysPresets = [
      { value: 'MON_FRI', label: 'Mon – Fri', days: MTS.Calendar.DAYS_MON_FRI },
      { value: 'MON_SAT', label: 'Mon – Sat', days: MTS.Calendar.DAYS_MON_SAT },
      { value: 'MON_SUN', label: 'Mon – Sun', days: MTS.Calendar.DAYS_MON_SUN },
      { value: 'SUN_SAT', label: 'Sun – Sat', days: MTS.Calendar.DAYS_SUN_SAT },
    ];
    const daysPreset = daysPresets.find(p =>
      JSON.stringify(p.days) === JSON.stringify(this.days)
    )?.value || 'MON_FRI';

    return [
      /* ── View ── */
      { group:'View', key:'view', type:'select', label:'Default view', value:this.view,
        options:[{value:'week',label:'Week'},{value:'month',label:'Month'},{value:'day',label:'Day'},{value:'schedule',label:'Schedule'}],
        description:'Initial calendar view',
        apply:(v,cal)=>cal.setView(v) },

      { group:'View', key:'days', type:'select', label:'Days', value:daysPreset,
        options:daysPresets.map(p=>({value:p.value,label:p.label})),
        description:'Days of the week to display',
        apply:(v,cal)=>{
          const p=daysPresets.find(x=>x.value===v);
          if(p){cal.days=p.days;cal._slotsCache=null;cal._render(false);}
        }},

      /* ── Schedule ── */
      { group:'Schedule', key:'startTime', type:'time', label:'Start time',
        value:this._startTime||String(this.startHour).padStart(2,'0')+':00',
        description:'Calendar start hour',
        apply:(v,cal)=>{cal._startTime=v;cal._slotsCache=null;cal._render(false);} },

      { group:'Schedule', key:'endTime', type:'time', label:'End time',
        value:this._endTime||String(this.endHour).padStart(2,'0')+':00',
        description:'Calendar end hour',
        apply:(v,cal)=>{cal._endTime=v;cal._slotsCache=null;cal._render(false);} },

      { group:'Schedule', key:'slotSize', type:'select', label:'Slot size', value:this.slotSize,
        options:[{value:15,label:'15 min'},{value:30,label:'30 min'},{value:45,label:'45 min'},{value:60,label:'60 min (1h)'},{value:90,label:'90 min'},{value:120,label:'120 min (2h)'}],
        description:'Size of each time slot in minutes',
        apply:(v,cal)=>{cal.slotSize=parseInt(v);cal._slotsCache=null;cal._render(false);} },

      /* ── Behavior ── */
      { group:'Behavior', key:'draggable', type:'toggle', label:'Drag & Drop', value:this.draggable,
        description:'Allow dragging events',
        apply:(v,cal)=>{cal.draggable=v;cal._render(false);} },

      { group:'Behavior', key:'resizable', type:'toggle', label:'Resize events', value:this.resizable,
        description:'Allow resizing events',
        apply:(v,cal)=>{cal.resizable=v;cal._render(false);} },

      { group:'Behavior', key:'allowOverlap', type:'toggle', label:'Allow overlap', value:this.allowOverlap,
        description:'Allow events to overlap',
        apply:(v,cal)=>{cal.allowOverlap=v;cal._render(false);} },

      { group:'Behavior', key:'readonly', type:'toggle', label:'Read only', value:this.readonly,
        description:'Disable all interactions',
        apply:(v,cal)=>{cal.readonly=v;cal.draggable=!v;cal.resizable=!v;cal._render(false);} },

      { group:'Behavior', key:'snapMinutes', type:'select', label:'Snap (min)', value:this.snapMinutes,
        options:[{value:5,label:'5 min'},{value:15,label:'15 min'},{value:30,label:'30 min'},{value:60,label:'60 min'}],
        description:'Snap interval for drag & resize',
        apply:(v,cal)=>{cal.snapMinutes=parseInt(v);} },

      /* ── Appearance ── */
      { group:'Appearance', key:'showNowLine', type:'toggle', label:'Now line', value:this.showNowLine,
        description:'Show current time indicator',
        apply:(v,cal)=>{cal.showNowLine=v;cal._render(false);} },

      { group:'Appearance', key:'showTooltips', type:'toggle', label:'Tooltips', value:this.showTooltips,
        description:'Show event tooltips on hover',
        apply:(v,cal)=>{cal.showTooltips=v;} },

      { group:'Appearance', key:'eventDensity', type:'select', label:'Density', value:this.eventDensity,
        options:[{value:'compact',label:'Compact'},{value:'comfortable',label:'Comfortable'},{value:'spacious',label:'Spacious'}],
        description:'Event display density',
        apply:(v,cal)=>{cal.eventDensity=v;cal._render(false);} },
    ];
  }

  /* ── getCode — JS string representing current configuration ─ */
  getCode() {
    const pad    = n => String(n??0).padStart(2,'0');
    const daysMap = {};
    daysMap[JSON.stringify(MTS.Calendar.DAYS_MON_FRI)] = 'MTS.Calendar.DAYS_MON_FRI';
    daysMap[JSON.stringify(MTS.Calendar.DAYS_MON_SAT)] = 'MTS.Calendar.DAYS_MON_SAT';
    daysMap[JSON.stringify(MTS.Calendar.DAYS_MON_SUN)] = 'MTS.Calendar.DAYS_MON_SUN';
    daysMap[JSON.stringify(MTS.Calendar.DAYS_SUN_SAT)] = 'MTS.Calendar.DAYS_SUN_SAT';
    const daysStr  = daysMap[JSON.stringify(this.days)] || JSON.stringify(this.days);
    const startT   = this._startTime || (pad(this.startHour) + ':00');
    const endT     = this._endTime   || (pad(this.endHour)   + ':00');
    const selector = this._el?.id ? ("'#" + this._el.id + "'") : "'#calendar'";
    const lines = [
      'const cal = new MTS.Calendar(' + selector + ', {',
      "  view:         '" + this.view + "',",
      '  days:         ' + daysStr + ',',
      "  startTime:    '" + startT + "',",
      "  endTime:      '" + endT + "',",
      '  slotSize:     ' + this.slotSize + ',',
      '  draggable:    ' + this.draggable + ',',
      '  resizable:    ' + this.resizable + ',',
      '  showNowLine:  ' + this.showNowLine + ',',
      '  showTooltips: ' + this.showTooltips + ',',
      '  allowOverlap: ' + this.allowOverlap + ',',
      '  readonly:     ' + this.readonly + ',',
      "  eventDensity: '" + this.eventDensity + "',",
      '  snapMinutes:  ' + this.snapMinutes + ',',
      '',
      '  // — Datasource —',
      '  datasource: async ({ dateStart, dateEnd, view }) => {',
      '    const res = await fetch(`/api/events?start=${dateStart}&end=${dateEnd}`);',
      '    return res.ok ? res.json() : [];',
      '  },',
      '',
      '  // — Event handlers —',
      "  onEventClick:       ({ detail }) => console.log('click', detail.event),",
      "  onEventDrop:        ({ detail }) => console.log('drop',  detail.event),",
      '  onAddEventRequest:  ({ detail }) => { /* open create modal */ },',
      '  onEditEventRequest: ({ detail }) => { /* open edit modal   */ },',
      '});',
    ];
    return lines.join('\n');
  }

  _log(...args) { if (this.debug) console.log(...args); }

  /* ── Export ──────────────────────────────────────────────── */
  exportCSV() {
    const S    = MTS._CalendarShared;
    const rows = [['id','title','dayNumber','date','startH','startM','endH','endM','moduleNumber','moduleCount','color']];
    this._events.forEach(ev => rows.push([ev.id,ev.title,ev.dayNumber,ev.date,ev.startH,ev.startM,ev.endH,ev.endM,ev.moduleNumber,ev.moduleCount,ev.color]));
    const csv = rows.map(r => r.map(c => `"${String(c??'').replace(/"/g,'""')}"`).join(',')).join('\n');
    this._download('calendario.csv','text/csv;charset=utf-8;','\ufeff'+csv);
  }

  exportICal() {
    const S     = MTS._CalendarShared;
    const lines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//MTS.Calendar//ES'];
    const dates = this.view === 'week' ? S.weekDates(this._offset, this.days) : null;
    this._events.forEach(ev => {
      const date = ev.date && ev.date !== '0000-00-00'
        ? new Date(ev.date+'T12:00:00')
        : (dates?.find(d => d && d.getDay()===ev.dayNumber) || dates?.[0] || new Date());
      const pad = n => String(n??0).padStart(2,'0');
      const sH=ev.startH??0,sM=ev.startM??0,eH=ev.endH??(sH+1),eM=ev.endM??0;
      const dtBase = `${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}`;
      const dtStart = `${dtBase}T${pad(sH)}${pad(sM)}00`;
      const dtEnd   = `${dtBase}T${pad(eH)}${pad(eM)}00`;
      lines.push('BEGIN:VEVENT',`UID:${ev.id}@mts.calendar`,`SUMMARY:${ev.title||''}`,`DTSTART:${dtStart}`,`DTEND:${dtEnd}`,'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    this._download('calendario.ics','text/calendar;charset=utf-8;',lines.join('\r\n'));
  }

  print() {
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    /* Copiar todos los estilos del documento actual */
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style'))
      .map(el => el.outerHTML).join('\n');

    /* Copiar variables CSS del :root (modo, accent, etc.) */
    const rootAttrs = Array.from(document.documentElement.attributes)
      .map(a => `${a.name}="${a.value}"`).join(' ');

    printWin.document.write(`
      <!DOCTYPE html>
      <html ${rootAttrs}>
      <head>
        <meta charset="UTF-8">
        <title>Calendario</title>
        ${styles}
        <style>
          html, body { margin: 0; padding: 0; height: auto; }
          .mts-calendar { height: 100vh; }
          .mts-calendar__toolbar-export { display: none !important; }
          .mts-calendar__view-btn { display: none !important; }
          @media print {
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          }
        </style>
      </head>
      <body>${this._el.outerHTML}</body>
      </html>`);

    printWin.document.close();
    printWin.focus();
    setTimeout(() => { printWin.print(); printWin.close(); }, 500);
  }

  _download(filename, type, content) {
    const blob = new Blob([content], { type });
    const a    = document.createElement('a');
    a.href     = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ── Mini Calendar ───────────────────────────────────────── */
  _toggleMiniCal() {
    if (this._miniCalEl) { this._miniCalEl.remove(); this._miniCalEl = null; return; }
    this._miniCalEl = document.createElement('div');
    this._miniCalEl.className = 'mts-calendar__mini';
    this._renderMiniCal(this._miniCalEl);
    this._el.querySelector('.mts-calendar__toolbar')?.appendChild(this._miniCalEl);
  }

  _renderMiniCal(el) {
    const S     = MTS._CalendarShared;
    const today = S.todayLocal();
    const offset = this._miniCalOffset || 0;
    const anchor = new Date(today.getFullYear(), today.getMonth()+offset, 1);
    const year = anchor.getFullYear(), month = anchor.getMonth();
    const daysInM = new Date(year, month+1, 0).getDate();
    const fd = new Date(year, month, 1).getDay();
    const startDow = fd===0?6:fd-1;
    const ms = this._locale?.monthsShort || ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const mini = this._locale?.days?.mini || ['L','M','X','J','V','S','D'];
    el.innerHTML = `
      <div class="mts-mini-cal__header">
        <button class="mts-mini-cal__nav" data-d="-1">‹</button>
        <span class="mts-mini-cal__title">${ms[month]} ${year}</span>
        <button class="mts-mini-cal__nav" data-d="1">›</button>
      </div>
      <div class="mts-mini-cal__grid">
        ${mini.map(d=>`<span class="mts-mini-cal__dow">${d}</span>`).join('')}
        ${Array(startDow).fill('<span></span>').join('')}
        ${Array.from({length:daysInM},(_,i)=>{
          const d=i+1, date=new Date(year,month,d);
          const isToday=date.toDateString()===today.toDateString();
          return `<span class="mts-mini-cal__day${isToday?' mts-mini-cal__day--today':''}" data-date="${S.isoLocal(date)}">${d}</span>`;
        }).join('')}
      </div>`;
    el.querySelectorAll('.mts-mini-cal__nav').forEach(btn =>
      btn.addEventListener('click',()=>{this._miniCalOffset=(this._miniCalOffset||0)+parseInt(btn.dataset.d);this._renderMiniCal(el);}));
    el.querySelectorAll('.mts-mini-cal__day[data-date]').forEach(day =>
      day.addEventListener('click',()=>this._emit('miniCalDayClick',{date:day.dataset.date})));
  }
};

/* ============================================================
   MTS.CalendarEvent — Clase de evento del calendario
   Convierte la estructura del dev a la estructura interna.

   El dev entrega:
     { uid, title, description, startDate, endDate,
       startHour, endHour, color, data }

   El calendario calcula internamente:
     dayNumber, moduleNumber, moduleCount, startH, endH, date

   Uso:
     // Con un calendario activo (recomendado):
     const ev = MTS.CalendarEvent.fromAPI(rawEvent, cal);
     cal.addEvent(ev.toJSON());

     // Sin calendario (posición manual):
     const ev = new MTS.CalendarEvent({ uid, title, ... });

   API de datos:
     cal.getData('uid-xxx')           // → data completa del evento
     cal.getData('uid-xxx', 'sala')   // → valor de data.sala
   ============================================================ */
MTS.CalendarEvent = class MtsCalendarEvent {
  constructor({
    uid          = null,
    id           = null,
    title        = '',
    description  = '',
    startDate    = null,
    endDate      = null,
    startHour    = null,
    endHour      = null,
    color        = '#3b82f6',
    allDay       = false,
    locked       = false,
    data         = {},
    /* Campos internos calculados — no los pasa el dev */
    dayNumber    = null,
    moduleNumber = null,
    moduleCount  = 1,
    startH       = null,
    startM       = 0,
    endH         = null,
    endM         = 0,
    date         = null,
  } = {}) {
    /* uid es el identificador único — obligatorio */
    this.uid         = uid ?? id ?? String(-(Date.now()));
    this.id          = this.uid; /* el calendario usa id internamente */
    this.title       = title;
    this.description = description;
    this.startDate   = startDate;
    this.endDate     = endDate   || startDate;
    this.startHour   = startHour;
    this.endHour     = endHour;
    this.color       = color;
    this.allDay      = allDay;
    this.locked      = locked;
    this.data        = data;

    /* Posición interna — puede venir calculada o se calcula en fromAPI() */
    this.dayNumber    = dayNumber;
    this.moduleNumber = moduleNumber;
    this.moduleCount  = moduleCount;
    this.startH       = startH;
    this.startM       = startM;
    this.endH         = endH;
    this.endM         = endM;
    this.date         = date || startDate;
  }

  /* ── fromAPI: convierte evento del dev usando la config del calendario ── */
  static fromAPI(raw, cal) {
    const ev = new MTS.CalendarEvent(raw);

    /* dayNumber, date, startH, endH — no necesitan cal */
    if (raw.startDate) {
      const d = new Date(raw.startDate + 'T12:00:00');
      ev.dayNumber = d.getDay();
      ev.date      = raw.startDate;
    }
    if (raw.startHour) {
      const [sh, sm] = raw.startHour.split(':').map(Number);
      ev.startH = sh; ev.startM = sm ?? 0;
    }
    if (raw.endHour) {
      const [eh, em] = raw.endHour.split(':').map(Number);
      ev.endH = eh; ev.endM = em ?? 0;
    }

    if (!cal) return ev; /* moduleNumber requiere cal — no disponible sin instancia */

    /* startHour/endHour → moduleNumber + moduleCount (si el calendario tiene slots) */
    const slots = cal._getSlots ? cal._getSlots() : null;
    if (slots && slots.length && raw.startHour && raw.endHour) {
      /* Buscar el slot que contiene startHour */
      const [sh, sm] = raw.startHour.split(':').map(Number);
      const [eh, em] = raw.endHour.split(':').map(Number);
      const startMin = sh * 60 + sm;
      const endMin   = eh * 60 + em;

      let modStart = -1, modEnd = -1;
      slots.forEach((slot, i) => {
        const [bh, bm] = slot.beginTime.split(':').map(Number);
        const [nh, nm] = slot.endTime.split(':').map(Number);
        const slotStart = bh * 60 + bm;
        const slotEnd   = nh * 60 + nm;
        if (modStart < 0 && startMin <= slotEnd && startMin >= slotStart) modStart = i;
        if (endMin > slotStart) modEnd = i;
      });

      if (modStart >= 0) {
        ev.moduleNumber = modStart + 1; /* base 1 */
        ev.moduleCount  = modEnd >= modStart ? (modEnd - modStart + 1) : 1;
      }
    } else if (raw.startHour && raw.endHour && cal.slotSize) {
      /* Modo horas — calcular moduleNumber desde slotSize */
      const [sh] = raw.startHour.split(':').map(Number);
      const [eh] = raw.endHour.split(':').map(Number);
      const calStart = parseInt((cal.startTime || '08:00').split(':')[0]);
      const slotSize = cal.slotSize || 60;
      ev.moduleNumber = Math.floor((sh - calStart) * 60 / slotSize) + 1;
      ev.moduleCount  = Math.max(1, Math.ceil((eh - sh) * 60 / slotSize));
    }

    return ev;
  }

  /* ── toJSON: estructura que consume el calendario internamente ── */
  toJSON() {
    const obj = {
      id:          this.uid,
      uid:         this.uid,
      title:       this.title,
      description: this.description,
      dayNumber:   this.dayNumber,
      color:       this.color,
      locked:      this.locked,
      allDay:      this.allDay,
      data:        this.data,
    };
    if (this.date)    obj.date = this.date;
    if (this.startH != null) {
      obj.startH = this.startH; obj.startM = this.startM ?? 0;
      obj.endH   = this.endH;   obj.endM   = this.endM   ?? 0;
      const pad  = n => String(n).padStart(2,'0');
      obj.hourRange = `${pad(this.startH)}:${pad(this.startM??0)}-${pad(this.endH)}:${pad(this.endM??0)}`;
    }
    if (this.moduleNumber != null) {
      obj.moduleNumber = this.moduleNumber;
      obj.moduleCount  = this.moduleCount;
    }
    return obj;
  }
};

