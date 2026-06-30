/* ============================================================
   demo.js — MTS.Calendar demo
   Sections:
     1. THEME & HELPERS
     2. CALENDAR SETUP
     3. EVENT MODALS
     4. CONFIG PANEL
     5. ACTIVITY LOG
     6. CODE PANEL
     7. MISC
   ============================================================ */

/* ── HTTP client (dogfood: MTS.HttpClient con base absoluta calculada desde la
   ubicación → location-independent; el SW de calendar la intercepta) ── */
const http = new MTS.HttpClient({ baseUrl: new URL('mock-api', location.href).pathname });

/* ── Global state — before any function that uses them ── */
/* ─── Definición de todos los eventos — label, tipo badge, extractor de payload ─── */
const EV_DEFS = [
  { key:'eventClick',       badge:'click',  label:'onEventClick',       payload: d=>`event: ${str(d.event?.title)}, day: ${num(d.event?.day)}` },
  { key:'eventDblClick',    badge:'click',  label:'onEventDblClick',     payload: d=>`event: ${str(d.event?.title)}` },
  { key:'eventRightClick',  badge:'click',  label:'onEventRightClick',   payload: d=>`event: ${str(d.event?.title)}, elId: ${str(d.elId||'')}, dataset: {...}` },
  { key:'slotClick',        badge:'click',  label:'onSlotClick',         payload: d=>fmtCellPayload(d) },
  { key:'slotDblClick',     badge:'click',  label:'onSlotDblClick',      payload: d=>fmtCellPayload(d) },
  { key:'slotRightClick',   badge:'click',  label:'onSlotRightClick',    payload: d=>fmtCellPayload(d) },
  { key:'viewEventRequest', badge:'click',  label:'onViewEventRequest',  payload: d=>`event: ${str(d.event?.title)}` },
  { key:'editEventRequest', badge:'edit',   label:'onEditEventRequest',  payload: d=>`event: ${str(d.event?.title)}` },
  { key:'deleteEventRequest',badge:'delete',label:'onDeleteEventRequest',payload: d=>`event: ${str(d.event?.title)}, id: ${num(d.event?.id)}, elId: ${str(d.elId||'')}` },
  { key:'addEventRequest',  badge:'add',    label:'onAddEventRequest',   payload: d=>fmtCellPayload(d) },
  { key:'rangeSelect',      badge:'range',  label:'onRangeSelect',       payload: d=>fmtCellPayload(d, true) },
  { key:'eventDragStart',   badge:'drag',   label:'onEventDragStart',    payload: d=>`event: ${str(d.event?.title)}, day: ${str(d.day||'')}` },
  { key:'eventDrop',        badge:'drag',   label:'onEventDrop',         payload: d=>`event: ${str(d.event?.title)}, fromDay: ${num(d.fromDay)}, toDay: ${num(d.toDay)}` },
  { key:'eventResize',      badge:'edit',   label:'onEventResize',       payload: d=>`event: ${str(d.event?.title)}, newEndHour: ${num(d.newEndHour)}` },
  { key:'eventResizeEnd',   badge:'edit',   label:'onEventResizeEnd',    payload: d=>`event: ${str(d.event?.title)}, oldEnd: ${num(d.oldEnd?.h)}h, newEnd: ${num(d.newEnd?.h)}h` },
  { key:'eventCollision',   badge:'drag',   label:'onEventCollision',    payload: d=>`event: ${str(d.event?.title)}, collides: ${str(d.collidingEvent?.title||'')}` },
  { key:'lockedCollision',  badge:'drag',   label:'onLockedCollision',   payload: d=>`event: ${str(d.event?.title)}` },
  { key:'dayClick',         badge:'nav',    label:'onDayClick',          payload: d=>`day: ${str(d.day||'')}, dayNumber: ${num(d.dayNumber??'')}, dateISO: ${str(d.dateISO||'')}` },
  { key:'weekChange',       badge:'nav',    label:'onWeekChange',        payload: d=>`offset: ${num(d.offset)}, view: ${str(d.view||'')}` },
  { key:'viewChange',       badge:'nav',    label:'onViewChange',        payload: d=>`view: ${str(d.view||'')}` },
  { key:'moreDayClick',     badge:'click',  label:'onMoreDayClick',      payload: d=>`day: ${str(d.day||'')}, total: ${num(d.events?.length)}` },
  { key:'navigate',         badge:'nav',    label:'onNavigate',          payload: d=>`offset: ${num(d.offset)}, view: ${str(d.view||'')}` },
  { key:'ready',            badge:'api',    label:'onReady',             payload: d=>`events: ${num(d.events?.length)}` },
  { key:'error',            badge:'api',    label:'onError',             payload: d=>`error: ${str(d.error?.message||'')}` },
];

/* ════════════════════════════════════════════════════
   1. THEME & HELPERS
   ════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════ */
function ts() {
  const n = new Date();
  return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`;
}
function fmt(n) { return String(n??0).padStart(2,'0'); }
function _esc(s) { return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function buildSlots(startTime, endTime, slotMin) {
  const [sh,sm]=startTime.split(':').map(Number),[eh,em]=endTime.split(':').map(Number);
  const startM=sh*60+(sm||0),endM=eh*60+(em||0);
  const slots=[];let cur=startM;
  while(cur<endM){
    const next=Math.min(cur+slotMin,endM),dur=next-cur;
    const bH=Math.floor(cur/60),bM=cur%60,eH=Math.floor(next/60),eM=next%60;
    const f=n=>String(n).padStart(2,'0');
    slots.push({id:slots.length+1,label:`${f(bH)}:${f(bM)} - ${f(eH)}:${f(eM)}`,beginTime:`${f(bH)}:${f(bM)}`,endTime:`${f(eH)}:${f(eM)}`,durationMin:dur});
    cur=next;
  }
  return slots;
}

/* ═══════════════════════════════════════════════
   COLORES
   ═══════════════════════════════════════════════ */
/* Los colores se toman de CalendarUI — ver matios-ui-calendar-colors.css */
const COLOR_OPTIONS = [
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

/* ════════════════════════════════════════════════════
   2. CALENDAR SETUP
   ════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   DATOS INICIALES
   ═══════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════
   FUENTES DE DATOS — simula un fetch real
   ═══════════════════════════════════════════════ */

let _dataMode = 'eventos';

/* getEvent — Calendario común: reuniones, eventos, agenda (~100 eventos en 3 meses) */

/* Parsers para cada formato de mock-api */
/* Parsea HH:MM a { h, m } */

/* Fetch events from cal_events API via Service Worker */
async function fetchEvents(ctx = {}) {
  const loader = document.getElementById('dataLoader');
  if (loader) { loader.classList.add('loading'); loader.querySelector('span').textContent = 'Loading...'; }
  try {
    const env = await http.get('cal_events', { params: {
      dateStart: ctx.dateStart || '',
      dateEnd:   ctx.dateEnd   || '',
      view:      ctx.view      || 'week',
    }});
    if (!env.success) throw new Error(env.message || `HTTP ${env.status}`);
    const raw = env.data;
    const evs = (Array.isArray(raw) ? raw : (raw?.data || []))
      .map(item => MTS.CalendarEvent.fromAPI(item, cal).toJSON());
    if (loader) { loader.classList.remove('loading'); loader.classList.add('ok'); loader.querySelector('span').textContent = `${evs.length} events`; }
    return evs;
  } catch(err) {
    if (loader) { loader.classList.remove('loading'); loader.classList.add('err'); loader.querySelector('span').textContent = 'Error'; }
    log('api', `Datasource error: ${err.message}`);
    return [];
  }
}

let _formInstances = {};
let _lastRightClick = null; /* persiste el div del último click derecho */

/* ═══════════════════════════════════════════════
   ESTADO DE CONFIG
   ═══════════════════════════════════════════════ */
const CFG = {
  days:      MTS.Calendar.DAYS_MON_FRI,
  header:    'both',
  startTime: '08:00',
  endTime:   '19:00',
  slotSize:  60,
  slotLabel: 'auto',
  slots:     null,
  drag:      true,
  resize:    true,
  nowline:   true,
  tooltip:   true,
  overlap:   false,
  readonly:  false,
  density:   'comfortable',
  snap:      15,
  minical:   false,
  debug:     false,         /* debug mode — activa logs internos del calendario */
};

/* ═══════════════════════════════════════════════
   MODO HORARIO (toolbar select)
   ═══════════════════════════════════════════════ */
function changeScheduleMode(mode){
  if(mode==='custom'){ openCustomScheduleModal(); return; }
  const configs={
    horas:    {startTime:'08:00',endTime:'19:00',slotSize:60, slotLabel:'time',  slots:null},
    m45:      {slots:buildSlots('08:00','19:00',45), startTime:'08:00',endTime:'19:00',slotSize:45, slotLabel:'range'},
    m90:      {slots:buildSlots('08:00','19:00',90), startTime:'08:00',endTime:'19:00',slotSize:90, slotLabel:'range'},
  };
  const c=configs[modo]||configs.horas;
  Object.assign(CFG,c);
  document.getElementById('cfgStart').value=c.startTime||'08:00';
  document.getElementById('cfgEnd').value=c.endTime||'19:00';
  document.getElementById('cfgSlot').value=Math.min(c.slotSize,120);
  document.getElementById('cfgSlotLabel').value=c.slotLabel||'auto';
  /* Slots cambian → recargar desde fuente para evitar estado sucio */
  buildCalendar([]);
  const label={horas:'horas 1h',m45:'módulos 45min',m90:'módulos 90min'}[modo] || modo;
  log('view',`Modo horario: ${label}`);
  toast('info',`Modo: ${label}`);
}

function openCustomScheduleModal(){
  const body=document.createElement('div'); body.className='event-form';
  const row=document.createElement('div'); row.className='event-form__row'; body.appendChild(row);
  const wS=document.createElement('div'); row.appendChild(wS);
  const wE=document.createElement('div'); row.appendChild(wE);
  const wM=document.createElement('div'); body.appendChild(wM);
  const inS=new MTS.Input(wS,{label:'Hora inicio',placeholder:'08:00',value:'08:00',hint:'HH:MM'});
  const inE=new MTS.Input(wE,{label:'Hora fin',placeholder:'19:00',value:'19:00',hint:'HH:MM'});
  const inM=new MTS.Input(wM,{label:'Tamaño slot (minutos)',placeholder:'60',value:'60',type:'number'});
  const modal=new MTS.Modal({
    title:'✏️ Horario personalizado',size:'sm',body,
    buttons:[
      {label:'Cancelar',variant:'ghost',onClick:()=>modal.hide()},
      {label:'Aplicar',variant:'primary',onClick:()=>{
        const st=inS.getValue()||'08:00',et=inE.getValue()||'19:00',min=parseInt(inM.getValue())||60;
        CFG.slots=buildSlots(st,et,min); CFG.startTime=st; CFG.endTime=et;
        CFG.slotSize=min; CFG.slotLabel='range';
        document.getElementById('cfgStart').value=st;
        document.getElementById('cfgEnd').value=et;
        document.getElementById('cfgSlot').value=Math.min(min,120);
        document.getElementById('cfgSlotLabel').value='range';
        buildCalendar([]);
        log('view',`Horario custom: ${st}–${et} ${min}min`);
        modal.hide(); toast('info',`Horario ${st}–${et} / ${min}min aplicado`);
      }},
    ],
  });
  modal.show();
}

/* ═══════════════════════════════════════════════
   BUILD CALENDAR — única fuente de verdad
   ═══════════════════════════════════════════════ */
/* ─── Cambiar fuente de datos ─── */
async function changeDataMode(mode) {
  _dataMode = modo;
  /* Cambio de fuente → recargar SIEMPRE desde cero, sin estado previo */
  document.getElementById('modoHorario').value = 'horas';
  changeScheduleMode('horas');
  log('api', `Fuente de datos: ${modo}`);
}

let cal;

/* ════════════════════════════════════════════════════
   3. EVENT MODALS
   ════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   MODAL "+N MÁS" — todos los eventos del día
   ═══════════════════════════════════════════════ */
function openMoreEventsModal(detail) {
  const evs     = detail.events || [];
  const dateStr = detail.date instanceof Date
    ? detail.date.toLocaleDateString('es-CL',{weekday:'long',day:'numeric',month:'long'})
    : (detail.dateISO || '');
  const p = n => String(n ?? 0).padStart(2, '0');

  const body = document.createElement('div');
  body.style.cssText = 'display:flex;flex-direction:column;gap:6px;';

  evs.forEach(ev => {
    const row = document.createElement('div');
    row.style.cssText = [
      'display:flex;align-items:center;gap:10px;',
      'padding:8px 10px;border-radius:var(--mts-radius-md);',
      'cursor:pointer;border:1px solid var(--mts-border-color);',
      'transition:background .1s;',
    ].join('');
    row.addEventListener('mouseenter', () => row.style.background = 'var(--mts-bg-surface-2)');
    row.addEventListener('mouseleave', () => row.style.background = '');

    const hora = ev.startH != null
      ? `${p(ev.startH)}:${p(ev.startM??0)} – ${p(ev.endH??ev.startH+1)}:${p(ev.endM??0)}`
      : 'Todo el día';

    row.innerHTML = `
      <span style="width:10px;height:10px;border-radius:50%;background:${ev.color||'var(--mts-color-primary)'};flex-shrink:0"></span>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600;color:var(--mts-text-primary);
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${_esc(ev.title)}</div>
        <div style="font-size:11px;color:var(--mts-text-muted);margin-top:1px">${hora}</div>
      </div>
      ${ev.data?.tipo?`<span style="font-size:10px;font-weight:600;padding:2px 7px;border-radius:99px;background:var(--mts-bg-surface-2);color:var(--mts-text-muted)">${_esc(ev.data.tipo)}</span>`:''}`;

    row.addEventListener('click', () => { modal.hide(); openEventDetail(ev); });
    body.appendChild(row);
  });

  const modal = new MTS.Modal({
    title:      `${detail.day} · ${evs.length} eventos`,
    size:       'sm',
    scrollable: true,
    body,
    buttons: [{ label:'Cerrar', icon:MTS.Icon.get('close',14), variant:'ghost', onClick: () => modal.hide() }],
  });
  modal.show();
}

async function buildCalendar(events){
  try{ if(cal) cal.destroy(); }catch(e){}
  document.getElementById('calendario').innerHTML='';

  const horario = CFG.slots
    ? { slots:CFG.slots }
    : { startTime:CFG.startTime||'08:00', endTime:CFG.endTime||'19:00',
        slotSize:CFG.slotSize||60, slotLabel:CFG.slotLabel||'auto' };

  cal = new MTS.Calendar('#calendario', Object.assign({
    view:'week', views:['week','month','day','schedule'],
    days:CFG.days, headerFormat:CFG.header,
    draggable:CFG.drag, resizable:CFG.resize,
    showNowLine:CFG.nowline, showTooltips:CFG.tooltip,
    allowOverlap:CFG.overlap, readonly:CFG.readonly,
    eventDensity:CFG.density, snapMinutes:CFG.snap,
    showMiniCal:CFG.minical,
    debug: true,
    /* datasource como función async — recibe el contexto de navegación */
    datasource: async (ctx) => {
      const evs = await fetchEvents(ctx);
      return evs;
    },
    datasourceParser: raw => Array.isArray(raw) ? raw : raw?.data || [],

    /* Menú contextual — usa el 4to arg (instance) para emitir sobre la instancia correcta.
       baseItems ya tiene Editar y Eliminar cableados a this internamente. */
    contextMenuEvent:(ev,ctx,baseItems,instance)=>[
      { label:'Ver detalle',
        icon:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.3"/><path d="M7 6v4M7 4.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
        onClick:()=>instance._emit('viewEventRequest',{event:ev,...ctx}) },
      ...baseItems.filter(i=>i.label&&i.label.includes('ditar')),
      { divider:true },
      ...baseItems.filter(i=>i.danger),
    ],

    onEventRender:(el,event)=>{
      /* data-* extras del campo data — el contenido base (título, hora, sub)
         lo agrega defaultRenderEvent automáticamente antes de este hook */
      if (event.data && typeof event.data === 'object') {
        Object.entries(event.data).forEach(([k,v]) => {
          el.dataset[k] = (Array.isArray(v) || (v && typeof v === 'object'))
            ? JSON.stringify(v) : v;
        });
      }
    },

    onReady: ({detail})=>{
      log('api',`Listo — ${detail.events.length} eventos`);
    },

    /* Click simple → abre detalle directamente */
    onEventClick: ({detail})=>{
      log('click',`Click: "${detail.event.title}"`,`día ${detail.event.day}`);
      if(!detail.event.locked) openEventDetail(detail.event);
    },
    onEventDblClick: ({detail})=>{
      log('click',`DblClick: "${detail.event.title}"`);
    },
    onEventRightClick: ({detail})=>{
      /* Persistir todo — el div, su id, su dataset — independiente de closures */
      _lastRightClick = {
        ev:      detail.event,
        el:      detail.el,
        elId:    detail.elId,
        dataset: detail.dataset,
      };
      /* Log con el ID del div + TODOS los data-* */
      const dsStr = [
        `elId: "${detail.elId}"`,
        ...Object.entries(detail.dataset||{}).map(([k,v])=>`data-${k}="${v}"`),
      ].join(' · ');
      log('click', `RightClick: "${detail.event.title}"`, dsStr);
    },

    /* Menú contextual → eventos semánticos */
    onViewEventRequest: ({detail})=>{
      log('click',`Ver detalle: "${detail.event.title}"`);
      openEventDetail(detail.event);
    },
    onEditEventRequest: ({detail})=>{
      log('click',`Editar: "${detail.event.title}"`);
      openEditEventModal(detail.event);
    },
    onDeleteEventRequest: ({detail})=>{
      const saved    = _lastRightClick;
      const evTitle  = detail.event?.title || saved?.ev?.title || '?';
      const evId     = detail.event?.id    ?? saved?.ev?.id;
      const elId     = saved?.elId;

      /* Log con elId + data-* completo */
      const dsStr = [
        `elId: "${elId||'?'}"`,
        ...Object.entries(saved?.dataset||{}).map(([k,v])=>`data-${k}="${v}"`),
      ].join(' · ');
      log('delete', `Eliminar solicitado: "${evTitle}"`, dsStr);

      MTS.Modal.confirm({
        title:       'Eliminar evento',
        message:     `¿Eliminar "${evTitle}"? Esta acción no se puede deshacer.`,
        variant:     'danger',
        confirmText: 'Eliminar',
        cancelText:  'Cancelar',
        onConfirm: () => {
          /* Eliminar del array interno — esto es lo que realmente importa */
          if (evId != null) {
            cal.removeEvent(evId);
            console.log('[demo] removeEvent →', evId, evTitle);
          }
          _lastRightClick = null;
          log('delete', `"${evTitle}" eliminado`, `eventId:${evId}`);
          toast('danger', `"${evTitle}" eliminado`);
        },
      });
    },
    onAddEventRequest: ({detail})=>{
      log('click',`Agregar en celda: día ${detail.dayNumber} módulo ${detail.moduleIndex+1}`,detail.beginTime||'');
      openNewEventModal();
    },

    /* Slots */
    onSlotClick: ({detail})=>{
      log('click',`Celda: ${detail.day}`,detail.beginTime||'');
    },
    onSlotDblClick: ({detail})=>{
      log('click',`DblClick celda: día ${detail.dayNumber} módulo ${detail.moduleIndex+1}`,detail.beginTime||'');
      openNewEventModal();
    },
    onSlotRightClick: ({detail})=>{
      log('click',`RightClick celda: ${detail.day}`,detail.beginTime||'');
    },

    /* Rango — solo log; addEventRequest se dispara automáticamente después */
    onRangeSelect: ({detail})=>{
      log('click',`Rango: módulo ${detail.startSlotIndex+1}–${detail.endSlotIndex+1}`,`día ${detail.dayNumber}`);
    },

    /* Drag & drop */
    onEventDragStart: ({detail})=>{
    },
    onEventDrop: ({detail})=>{
      const ev=detail.event;
      log('drag',`"${ev.title}" movido`,`→ dayNumber:${ev.dayNumber} · módulo ${ev.moduleNumber??'?'} · date:${ev.date||'?'}`);
      console.log('[demo] eventDrop →', {id:ev.id, title:ev.title, dayNumber:ev.dayNumber, moduleNumber:ev.moduleNumber, moduleCount:ev.moduleCount, date:ev.date});
      toast('info',`"${ev.title}" reubicado`);
    },

    /* Resize */
    onEventResize: ({detail})=>{
    },
    onEventResizeEnd: ({detail})=>{
      const ev=detail.event;
      log('resize',`"${ev.title}" redimensionado`,`${detail.oldEnd?.h}h → ${detail.newEnd?.h}h`);
      toast('info',`"${ev.title}" redimensionado`);
    },

    /* Colisión */
    onEventCollision: ({detail})=>{
      log('drag',`⚠ Colisión con "${detail.collidingEvent?.title}"`,'bloqueado');
      toast('warning',`Colisión con "${detail.collidingEvent?.title}"`);
    },
    onLockedCollision: ({detail})=>{
      log('drag','🔒 Slot bloqueado','no permitido');
      toast('warning','Slot bloqueado');
    },

    /* Navegación */
    onDayClick: ({detail})=>{
      log('nav',`Día: ${detail.day}`);
    },
    onWeekChange: ({detail})=>{
      const wk=detail.dateStart?new Date(detail.dateStart+'T12:00:00').toLocaleDateString('es-CL',{day:'2-digit',month:'short'}):'';
      log('nav',`Semana cambiada`,`offset:${detail.offset}${wk?' · '+wk:''}`);
      console.log('[demo] weekChange →', { dateStart: detail.dateStart, dateEnd: detail.dateEnd, view: detail.view });
    },
    onViewChange: ({detail})=>{
      log('view',`Vista: ${detail.view}`);
    },
    onNavigate: ({detail})=>{
    },
    onMoreDayClick: ({detail})=>{
      log('click',`+más: ${detail.day}`,`${detail.events?.length} eventos`);
      openMoreEventsModal(detail);
    },
    onError: ({detail})=>{
      log('api',`Error: ${detail.error?.message||detail.error}`);
    },

  }, horario));

  return cal;
}

/* ═══════════════════════════════════════════════
   MODAL NUEVO / EDITAR
   ═══════════════════════════════════════════════ */
function buildEventForm(){
  /* Lee directamente de cal.selectedEvent — fuente única de verdad */
  const se = cal.selectedEvent;
  Object.values(_formInstances).forEach(i=>{try{i.destroy?.()}catch(e){}});
  _formInstances={};
  /* Color inicial: buscar id por hex en COLOR_OPTIONS */
  const _initHex = se.color || '#3b82f6'; /* initial hex for ColorPicker */
  const c=document.createElement('div'); c.className='event-form';
  c.innerHTML=`
    <div class="event-form__full" id="ef-t"></div>
    <div class="event-form__row"><div id="ef-d"></div><div id="ef-tipo"></div></div>
    <div class="event-form__row"><div id="ef-si"></div><div id="ef-sf"></div></div>
    <div class="event-form__full" id="ef-i"></div>
    <div class="event-form__full" id="ef-l"></div>
    <div class="event-form__full" id="ef-n"></div>
    <div><label class="form-label">Color</label><div class="color-grid" id="ef-col"></div></div>`;
  const fmt2=n=>String(n??0).padStart(2,'0');
  /* Fecha del slot — para el Picker de fecha */
  const _diaISO = (se.date && se.date !== '0000-00-00') ? se.date : null;
  /* Hora inicio/fin desde hourRange */
  const [_hrStart='09:00', _hrEnd='10:00'] = (se.hourRange||'09:00-10:00').split('-');
  _formInstances.titulo=new MTS.Input(c.querySelector('#ef-t'),{label:'Título *',placeholder:'Ej: Reunión de equipo',value:se.title||'',clearable:true,maxLength:80,autocomplete:'new-password'});
  /* Picker de fecha — muestra la fecha real del slot */
  const _diaWrap = c.querySelector('#ef-d');
  _diaWrap.className = 'mts-form-group';
  _diaWrap.innerHTML = '<label class="mts-form-label">Día</label><input type="text" class="mts-input__field" readonly autocomplete="new-password">';
  const _diaInput = _diaWrap.querySelector('input');
  _formInstances.dia = new MTS.DatePicker.Date(_diaInput, {
    format:    'DD/MM/YYYY',
    locale:    'es-CL',
    clearable: false,
    readonly:  true,
  });
  if (_diaISO) _formInstances.dia.setValue(new Date(_diaISO + 'T12:00:00'));
  _formInstances.tipo=new MTS.Select(c.querySelector('#ef-tipo'),{label:'Tipo',value:se.data?.tipo||'Reunion',options:[{value:'Reunion',label:'Reunión'},{value:'Cliente',label:'Cliente'},{value:'Demo',label:'Demo'},{value:'Formacion',label:'Formación'},{value:'Social',label:'Social'},{value:'Otro',label:'Otro'}]});
  /* Time pickers — rango y paso del calendario */
  const _calStartH = parseInt((CFG.startTime||'08:00').split(':')[0]);
  const _calEndH   = parseInt((CFG.endTime  ||'19:00').split(':')[0]);
  const _calStep   = CFG.slotSize || 60;
  const _siWrap = c.querySelector('#ef-si');
  _siWrap.className = 'mts-form-group';
  const _siLbl = document.createElement('label');
  _siLbl.className = 'mts-form-label';
  _siLbl.textContent = 'Hora inicio';
  const _siInput = document.createElement('input'); _siInput.autocomplete='new-password';
  _siInput.type = 'text';
  _siWrap.appendChild(_siLbl);
  _siWrap.appendChild(_siInput);
  _formInstances.inicio = new MTS.DatePicker.Time(_siInput, {
    startHour:  _calStartH,
    endHour:    _calEndH,
    timeStep:   _calStep,
    btnNow:     'Ahora',
    btnAccept:  'Aceptar',
  });
  if (_hrStart) {
    const [_sh, _sm] = _hrStart.split(':').map(Number);
    const _sd = new Date(); _sd.setHours(_sh, _sm || 0, 0, 0);
    _formInstances.inicio.setValue(_sd);
  }
  const _sfWrap = c.querySelector('#ef-sf');
  _sfWrap.className = 'mts-form-group';
  const _sfLbl = document.createElement('label');
  _sfLbl.className = 'mts-form-label';
  _sfLbl.textContent = 'Hora fin';
  const _sfInput = document.createElement('input'); _sfInput.autocomplete='new-password';
  _sfInput.type = 'text';
  _sfWrap.appendChild(_sfLbl);
  _sfWrap.appendChild(_sfInput);
  _formInstances.fin = new MTS.DatePicker.Time(_sfInput, {
    startHour:  _calStartH,
    endHour:    _calEndH,
    timeStep:   _calStep,
    btnNow:     'Ahora',
    btnAccept:  'Aceptar',
  });
  if (_hrEnd) {
    const [_eh, _em] = _hrEnd.split(':').map(Number);
    const _ed = new Date(); _ed.setHours(_eh, _em || 0, 0, 0);
    _formInstances.fin.setValue(_ed);
  }
  /* Invitados — TagInput con autocomplete contra mock-api/attendees */
  /* Invitados: solo precargar si es edición (se.id existe), no en nuevo evento */
  const _invitadosVal = se.id ? (se.data?.invitados || []) : [];
  _formInstances.invitados = new MTS.TagInput(c.querySelector('#ef-i'), {
    label:       'Invitados',
    placeholder: 'Buscar por nombre o email...',
    allowCustom: false,
    debounce:    300,
    tags:        _invitadosVal,
    onSearch: async (q) => {
      try {
        const env = await http.get('attendees', { params: q ? { q } : {} });
        if (!env.success) return [];
        return env.data; // → [{ uid, name }]
      } catch { return []; }
    },
  });
  /* Disable browser autocomplete on TagInput internal input */
  if (_formInstances.invitados._inputEl) {
    _formInstances.invitados._inputEl.setAttribute('autocomplete', 'new-password');
    _formInstances.invitados._inputEl.setAttribute('name', `guests-${Date.now()}`);
  }

  /* Sala / Lugar — Select con autocomplete contra mock-api/meet_places */
  const _lugarVal = se.data?.sala || se.data?.lugar || '';
  _formInstances.lugar = new MTS.Select(c.querySelector('#ef-l'), {
    label:       'Sala / Lugar',
    placeholder: 'Buscar sala o lugar...',
    searchable:  true,
    clearable:   true,
    minChars:    0,
    value:       _lugarVal || null,
    options:     [],
    onSearch: async (q) => {
      try {
        const env = await http.get('meet_places', { params: q ? { q } : {} });
        if (!env.success) return [];
        const data = env.data;
        return data.map(p => ({ value: p.place, label: p.place, hint: p.capacity + ' personas' }));
      } catch { return []; }
    },
  });
  /* Pre-cargar opciones al abrir */
  if (_lugarVal) {
    _formInstances.lugar.setOptions([{ value: _lugarVal, label: _lugarVal }]);
  }
  _formInstances.notas=new MTS.Input(c.querySelector('#ef-n'),{label:'Notas',type:'textarea',placeholder:'Notas adicionales...',rows:2,value:se.data?.notas||'',autocomplete:'new-password',maxLength:500});
  /* No resize on textarea */
  const _notasTA = c.querySelector('#ef-n textarea');
  if (_notasTA) _notasTA.style.resize = 'none';
  /* Color picker — MTS.ColorPicker inline, solo paleta */
  const _colorPicker = new MTS.ColorPicker(c.querySelector('#ef-col'), {
    triggerVariant:   'preview',
    previewText:      'Así se verá el evento',
    showSliders:      false,
    showInput:        false,
    showPresets:      true,
    showFormatSwitch: false,
    format:           'hex',
    value:            se.color || '#3b82f6',
    presets: [
      '#0a1628','#0d2b6b','#1d4ed8','#3b82f6',  /* Navy → cielo   */
      '#0c2a35','#115e59','#0f766e','#10b981',  /* Petrol → menta */
      '#3b0000','#7f0000','#cc0000','#e53935',  /* Crimson        */
      '#451a00','#92400e','#f59e0b','#ffb737',  /* Ámbar          */
      '#2e1065','#4c1d95','#7c3aed','#a78bfa',  /* Violet         */
    ],
  });
  return {container:c, colorPicker:_colorPicker};
}

function getFormValues(colorPicker){
  const titulo = _formInstances.titulo?.getValue()?.trim() || '';
  const tipo   = _formInstances.tipo?.getValue() || 'Interna';

  /* Fecha — usar fecha local sin desfase UTC */
  const _pickerDate = _formInstances.dia?.getValue();
  const pad = n => String(n||0).padStart(2,'0');
  const diaDate = _pickerDate instanceof Date
    ? `${_pickerDate.getFullYear()}-${pad(_pickerDate.getMonth()+1)}-${pad(_pickerDate.getDate())}`
    : null;
  const dia = _pickerDate instanceof Date ? _pickerDate.getDay() : null;

  /* Horas — leer del picker o del input directo */
  const _iniDate = _formInstances.inicio?.getValue();
  const _finDate = _formInstances.fin?.getValue();
  const ini = _iniDate instanceof Date
    ? [_iniDate.getHours(), _iniDate.getMinutes()]
    : (_formInstances.inicio?._input?.value || '09:00').split(':').map(Number);
  const fin = _finDate instanceof Date
    ? [_finDate.getHours(), _finDate.getMinutes()]
    : (_formInstances.fin?._input?.value || '10:00').split(':').map(Number);

  const startH = parseInt(ini[0]) || 9;
  const startM = parseInt(ini[1] ?? 0) || 0;
  const endH   = parseInt(fin[0]) || 10;
  const endM   = parseInt(fin[1] ?? 0) || 0;

  const invitados = _formInstances.invitados?.getTags() || [];
  return {
    titulo, dia, diaDate, tipo,
    startH, startM, endH, endM,
    startHour: `${pad(startH)}:${pad(startM)}`,
    endHour:   `${pad(endH)}:${pad(endM)}`,
    invitados,
    lugar:  _formInstances.lugar?.getValue()  || '',
    notas:  _formInstances.notas?.getValue()  || '',
    color:     colorPicker.getValue?.() ?? colorPicker.value,
  };
}

function openNewEventModal() {
  /* cal.selectedEvent ya fue poblado por el calendario — leer desde ahí */
  const se = cal.selectedEvent;
  const {container,colorPicker}=buildEventForm();
  const modal=new MTS.Modal({title:'Nuevo evento',size:'md',scrollable:true,body:container,buttons:[
    {label:'Cancelar', icon:MTS.Icon.get('close',14), variant:'ghost', onClick:()=>{ cal.clearSelectedEvent(); modal.hide(); }},
    {label:'Crear evento', icon:MTS.Icon.get('calendar-plus',14), variant:'primary',onClick: async ()=>{
      const v = getFormValues(colorPicker);
      if (!v.titulo) { toast('warning','El título es obligatorio'); return; }
      const colorHex = v.color; /* MTS.ColorPicker.getValue() returns hex */

      /* Build raw con la nueva estructura { uid, startDate, startHour, endHour } */
      const raw = {
        uid:         crypto.randomUUID(), /* uid temporal — el server asignará el definitivo */
        title:       v.titulo,
        description: `${v.tipo}${v.lugar?' · '+v.lugar:''}`,
        startDate:   v.diaDate   || se.date || new Date().toISOString().split('T')[0],
        endDate:     v.diaDate   || se.date || new Date().toISOString().split('T')[0],
        startHour:   v.startHour,
        endHour:     v.endHour,
        color:       colorHex,
        data:        { tipo:v.tipo, invitados:v.invitados, sala:v.lugar, notas:v.notas },
      };

      try {
        /* Simulate POST → /cal_events */
        const env  = await http.post('cal_events', raw);
        const json = env.data || {};
        /* Use server uid si viene */
        if (json.uid) raw.uid = json.uid;
        log('add', `POST /cal_events → ${json.message || (env.success ? 'ok' : env.message)}`, `uid: ${raw.uid}`);
      } catch(e) {
        log('add', 'POST /cal_events falló — usando uid local', raw.uid);
      }

      /* Convert to internal interna del calendario */
      const ev = MTS.CalendarEvent.fromAPI(raw, cal).toJSON();
      cal.addEvent(ev);
      log('add', `Creado: "${ev.title}"`, `date:${ev.date} · ${v.startHour}–${v.endHour}`);
      toast('success', `"${v.titulo}" agregado`);
      cal.clearSelectedEvent();
      modal.hide();
    }},
  ]});
  modal.show();
}

function openEditEventModal(event){
  /* Poblar selectedEvent con el evento existente antes de abrir el formulario */
  /* (normalmente ya está poblado por el click, pero lo reforzamos aquí) */
  if(cal.selectedEvent.id !== event.id){
    cal._setSelectedFromEvent(event, event.dayNumber??0, event.date, cal._getSlots());
  }
  const se = cal.selectedEvent;
  const {container,colorPicker}=buildEventForm();
  const modal=new MTS.Modal({title:'Editar evento',size:'md',scrollable:true,body:container,buttons:[
    {label:'Cancelar', icon:MTS.Icon.get('close',14), variant:'ghost', onClick:()=>{ cal.clearSelectedEvent(); modal.hide(); }},
    {label:'Guardar cambios', icon:MTS.Icon.get('save',14), variant:'primary',onClick: async ()=>{
      const v = getFormValues(colorPicker);
      if (!v.titulo) { toast('warning','El título es obligatorio'); return; }
      const colorHex = v.color; /* MTS.ColorPicker.getValue() returns hex */

      /* Build raw actualizado */
      const uid = event.uid || event.id;
      const raw = {
        uid,
        title:       v.titulo,
        description: `${v.tipo}${v.lugar?' · '+v.lugar:''}`,
        startDate:   v.diaDate   || event.date,
        endDate:     v.diaDate   || event.date,
        startHour:   v.startHour,
        endHour:     v.endHour,
        color:       colorHex,
        data:        { ...event.data, tipo:v.tipo, invitados:v.invitados, sala:v.lugar, notas:v.notas },
      };

      try {
        /* Simulate PUT → /cal_events/{uid} */
        const env  = await http.put(`cal_events/${uid}`, raw);
        const json = env.data || {};
        log('add', `PUT /cal_events/${uid} → ${json.message || (env.success ? 'ok' : env.message)}`, `uid: ${uid}`);
      } catch(e) {
        log('add', 'PUT /cal_events falló — actualizando localmente', uid);
      }

      /* Convert to internal interna y actualizar */
      const updated = MTS.CalendarEvent.fromAPI(raw, cal).toJSON();
      cal.updateEvent(uid, updated);
      log('add', `Editado: "${v.titulo}"`, `date:${raw.startDate} · ${v.startHour}–${v.endHour}`);
      toast('success', `"${v.titulo}" actualizado`);
      cal.clearSelectedEvent();
      modal.hide();
    }},
  ]});
  modal.show();
}

/* ═══════════════════════════════════════════════
   DETALLE EVENTO
   ═══════════════════════════════════════════════ */
function openEventDetail(event){
  /* Poblar selectedEvent con el evento que se está viendo */
  cal._setSelectedFromEvent(event, event.dayNumber??0, event.date, cal._getSlots());
  const colorInfo=event.color ? {hex:event.color} : (COLOR_OPTIONS.find(c=>c.id===event.colorClass)||{hex:'#4f8eff'});
  const p=n=>String(n??0).padStart(2,'0');
  const startStr=`${p(event.startH)}:${p(event.startM||0)}`;
  const endStr=`${p(event.endH)}:${p(event.endM||0)}`;
  const durMin=(event.endH-event.startH)*60+(event.endM||0)-(event.startM||0);
  const durStr=durMin>=60?`${Math.floor(durMin/60)}h ${durMin%60>0?durMin%60+'min':''}`.trim():`${durMin}min`;
  const dayName = cal._dayLabel(event.dayNumber) || 'Día '+event.dayNumber;
  const body=document.createElement('div'); body.className='event-detail';
  const ic = n => MTS.Icon.get(n, 16);
  body.innerHTML=`
    <div class="event-detail__color-bar" style="background:${colorInfo.hex}"></div>
    ${event.allDay?`<div style="padding:6px 10px;background:var(--mts-color-primary-light);border-radius:6px;font-size:12px;color:var(--mts-color-primary);font-weight:600;display:flex;align-items:center;gap:6px">${ic('calendar')} Todo el día</div>`:''}
    <div class="event-detail__row">${ic('calendar')}<div><div class="event-detail__key">Día</div><div class="event-detail__val">${_esc(dayName)}${event.date && event.date!=='0000-00-00' ? ` <span style="color:var(--mts-text-muted);font-size:12px">${_esc(event.date)}</span>` : ''}</div></div></div>
    ${!event.allDay?`<div class="event-detail__row">${ic('clock')}<div><div class="event-detail__key">Horario</div><div class="event-detail__val">${_esc(startStr)} – ${_esc(endStr)} <span style="color:var(--mts-text-muted);font-size:12px">(${_esc(durStr)})</span></div></div></div>`:''}
    ${event.data?.tipo?`<div class="event-detail__row">${ic('tag')}<div><div class="event-detail__key">Tipo</div><div class="event-detail__val">${_esc(event.data.tipo)}</div></div></div>`:''}
    ${event.data?.responsable?`<div class="event-detail__row">${ic('user')}<div><div class="event-detail__key">Responsable</div><div class="event-detail__val">${_esc(event.data.responsable)}</div></div></div>`:''}
    ${(event.data?.invitados?.length)?`<div class="event-detail__row">${ic('users')}<div><div class="event-detail__key">Invitados</div><div class="event-detail__val">${event.data.invitados.map(function(i){return _esc(i.name);}).join(', ')}</div></div></div>`:''}
    ${(event.data?.sala||event.data?.lugar)?`<div class="event-detail__row">${ic('map-pin')}<div><div class="event-detail__key">Lugar</div><div class="event-detail__val">${_esc(event.data.sala||event.data.lugar)}</div></div></div>`:''}
    ${event.data?.asistentes?`<div class="event-detail__row">${ic('users')}<div><div class="event-detail__key">Asistentes</div><div class="event-detail__val">${_esc(String(event.data.asistentes))}</div></div></div>`:''}
    ${event.data?.notas?`<div class="event-detail__row">${ic('file-text')}<div><div class="event-detail__key">Notas</div><div class="event-detail__val">${_esc(event.data.notas)}</div></div></div>`:''}
    ${event.locked?`<div style="padding:8px 12px;background:rgba(251,191,36,.08);border:1px solid rgba(251,191,36,.2);border-radius:6px;font-size:12px;color:var(--mts-color-warning);display:flex;align-items:center;gap:6px">${ic('lock')} Evento bloqueado — solo lectura</div>`:''}
    <div style="font-size:11px;color:var(--mts-text-muted);margin-top:4px">ID: ${_esc(String(event.id))}</div>`;
  const modal=new MTS.Modal({title:event.title,size:'sm',body,
    buttons:event.locked?[
      {label:'Cerrar', icon:MTS.Icon.get('close',14), variant:'ghost', onClick:()=>modal.hide()},
    ]:[
      {label:'Cerrar', icon:MTS.Icon.get('close',14), variant:'ghost', onClick:()=>modal.hide()},
      {label:'Editar', icon:MTS.Icon.get('edit',14), variant:'primary', onClick:()=>{modal.hide();openEditEventModal(event);}},
    ]
  });
  modal.show();
}

/* ════════════════════════════════════════════════════
   4. CONFIG PANEL
   ════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   PANEL CONFIG — TOGGLES Y SELECTORES
   ═══════════════════════════════════════════════ */

function toggleDebug() {
  CFG.debug = !CFG.debug;
  document.getElementById('tog-debug').classList.toggle('on', CFG.debug);
  if (cal) cal.debug = CFG.debug;
  console.log(`[demo] debug mode: ${CFG.debug ? 'ON ✅' : 'OFF'}`);
  log('view', `Debug mode: ${CFG.debug ? 'ON' : 'OFF'}`);
  toast(CFG.debug ? 'info' : 'info', `Debug ${CFG.debug ? 'activado — revisa la consola' : 'desactivado'}`);
}

function changeMockApi(val) {
  /* Single API endpoint — kept for backward compat with config panel */
  buildCalendar([]);
  if (val) log('api', `API: ${val}`);
}

function toggleConfigOption(opt){
  CFG[opt]=!CFG[opt];
  document.getElementById('tog-'+opt).classList.toggle('on',CFG[opt]);
  applyConfig();
}

function applyConfig(){
  const daysMap={lv:MTS.Calendar.DAYS_MON_FRI,ls:MTS.Calendar.DAYS_MON_SAT,ld:MTS.Calendar.DAYS_MON_SUN,ds:MTS.Calendar.DAYS_SUN_SAT};
  CFG.days    = daysMap[document.getElementById('cfgDays').value]||MTS.Calendar.DAYS_MON_FRI;
  CFG.header  = document.getElementById('cfgHeader').value;
  CFG.density = document.getElementById('cfgDensity').value;
  CFG.snap    = parseInt(document.getElementById('cfgSnap').value)||15;
  const evs = cal.getEvents();
  buildCalendar(evs);
}

function applySchedule(){
  const startTime = document.getElementById('cfgStart').value||'08:00';
  const endTime   = document.getElementById('cfgEnd').value||'19:00';
  const slotMin   = parseInt(document.getElementById('cfgSlot').value)||60;
  const slotLabel = document.getElementById('cfgSlotLabel').value;
  CFG.startTime=startTime; CFG.endTime=endTime;
  CFG.slotSize=slotMin; CFG.slotLabel=slotLabel; CFG.slots=null;
  document.getElementById('modoHorario').value='horas';
  /* Cambio de slots → recargar desde fuente para evitar estado sucio */
  buildCalendar([]);
  log('view',`Horario: ${startTime}–${endTime} slots ${slotMin}min label:${slotLabel}`);
  toast('info',`Horario ${startTime}–${endTime} aplicado`);
}

/* ════════════════════════════════════════════════════
   5. ACTIVITY LOG
   ════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   LOGGER INFERIOR
   ═══════════════════════════════════════════════ */
function log(type, msg, detail = '') {
  /* Delegate to DevPanel if available */
  if (typeof devPanel !== 'undefined' && devPanel) {
    devPanel.log(type, msg, detail);
  }
}
function clearLog(e) { e?.stopPropagation(); if (typeof devPanel !== 'undefined' && devPanel) devPanel.clearLog(); }

/* ═══════════════════════════════════════════════
   TOAST
   ═══════════════════════════════════════════════ */
function toast(type, message) {
  MTS.Toast.show({ message: message, variant: type, position: 'bottom-right', duration: 3000 });
}

/* ════════════════════════════════════════════════════
   6. CODE PANEL
   ════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   JS PANEL — SYNTAX HELPERS
   ═══════════════════════════════════════════════ */
function kw(s){ return `<span class="kw">${s}</span>`; }
function fn(s){ return `<span class="fn">${s}</span>`; }
function str(s){ return `<span class="str">"${s}"</span>`; }
function num(n){ return `<span class="num">${n}</span>`; }
function cmt(s){ return `<span class="cmt">// ${s}</span>`; }
function hl(s,key,changedKey){ return key===changedKey?`<span class="changed">${s}</span>`:s; }

/* ─── Helper: formatea el payload completo de una celda ─── */
function fmtCellPayload(d, isRange=false) {
  const parts = [
    `day: ${str(d.day||'')}`,
    `colIndex: ${num(d.colIndex??'')}`,
    `dayNumber: ${num(d.dayNumber??'')} ${cmt('0=Dom…6=Sáb')}`,
  ];
  if (d.dateISO)    parts.push(`dateISO: ${str(d.dateISO)}`);
  if (d.beginTime)  parts.push(`beginTime: ${str(d.beginTime)}`);
  if (d.endTime && isRange) parts.push(`endTime: ${str(d.endTime)}`);
  return parts.join(', ');
}

/* ─── Renderiza el panel JS completo (config + eventos) ─── */

/* Disparar evento en el panel — resalta la línea y actualiza el payload */

/* ════════════════════════════════════════════════════
   7. MISC
   ════════════════════════════════════════════════════ */

function resetEvents(){
  document.getElementById('apiPill').className='api-pill';
  document.getElementById('apiPillText').textContent='Sin cargar';
  cal.refresh();
  log('nav','Eventos recargados desde datasource');
  toast('info','Calendario recargado');
}

function importICal(input){
  if(!input.files[0]) return;
  cal.importICal(input.files[0]);
  log('api',`iCal importado: ${input.files[0].name}`);
  toast('success','iCal importado correctamente');
  input.value='';
}

/* ── DevPanel ────────────────────────────────────────────── */
function initDevPanel() {
  const isDev = new URLSearchParams(location.search).has('dev'); /* off by default; add ?dev to show */
  if (!isDev || !MTS.DevPanel) return;
  devPanel = new MTS.DevPanel(document.getElementById('calendario'), {
    enabled: true,
    panels:  ['config', 'log', 'code'],
    watch:   cal,
    events:  (typeof EV_DEFS !== 'undefined' ? EV_DEFS : []).map(def => ({
      name:    def.key,
      badge:   def.badge,
      label:   def.label,
      payload: def.payload ? d => { try { return def.payload(d); } catch(e) { return ''; } } : null,
    })),
  });
}

/* ── Init ────────────────────────────────────────────────── */
buildCalendar([]).then(() => initDevPanel());
