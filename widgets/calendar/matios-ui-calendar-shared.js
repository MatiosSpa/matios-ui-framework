/* ============================================================
   MATIOS UI — matios-ui-calendar-shared.js
   Utilidades compartidas entre todas las vistas del calendario.
   No instanciar directamente — lo usa MTS.Calendar internamente.
   ============================================================ */

window.MTS = window.MTS || {};
MTS._CalendarShared = {

  /* ── Escape / Sanitize ──────────────────────────────────── */

  _esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  },

  _san(html) {
    return typeof MTS !== 'undefined' && MTS.Sanitize ? MTS.Sanitize.html(html) : html;
  },

  /* ── Utils de fecha ─────────────────────────────────────── */

  todayLocal() {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  },

  isoLocal(d) {
    const p = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
  },

  parseTime(str) {
    if (!str) return { h:0, m:0, totalMin:0 };
    const [h,m] = str.split(':').map(Number);
    return { h: h||0, m: m||0, totalMin: (h||0)*60+(m||0) };
  },

  formatTime(totalMin) {
    const h = Math.floor(totalMin/60), m = totalMin%60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  },

  /* ── Utils de días ──────────────────────────────────────── */

  /* dayNumber JS (0=Dom…6=Sáb) → label del locale */
  dayLabel(dayNumber, locale) {
    const short = locale?.days?.short;
    if (!short) return String(dayNumber);
    if (Array.isArray(short)) {
      const idx = dayNumber === 0 ? 6 : dayNumber - 1;
      return short[idx] || String(dayNumber);
    }
    return short[dayNumber] || String(dayNumber);
  },

  /* dayNumber JS → colIdx en el array days */
  dayJsToColIdx(dayJS, days) {
    const idx = days.indexOf(dayJS);
    return idx >= 0 ? idx : -1;
  },

  /* Fecha del inicio de la semana según days[0] */
  weekStart(offset, days) {
    const today    = MTS._CalendarShared.todayLocal();
    const firstDay = days[0];
    const todayDow = today.getDay();
    let diff = todayDow - firstDay;
    if (diff < 0) diff += 7;
    const start = new Date(today);
    start.setDate(today.getDate() - diff + offset * 7);
    return start;
  },

  /* Array de Date para cada día del formato, dado el offset semanal */
  weekDates(offset, days) {
    const start = MTS._CalendarShared.weekStart(offset, days);
    return days.map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  },

  /* ── Utils de slots ─────────────────────────────────────── */

  getSlots(cal) {
    if (cal._slotsCache) return cal._slotsCache;
    const shared = MTS._CalendarShared;
    const base = shared.parseTime(cal._startTime || `${cal.startHour||8}:00`).totalMin;
    const end  = shared.parseTime(cal._endTime   || `${cal.endHour||20}:00`).totalMin;
    const size = cal.slotSize || 60;
    const px   = cal._slotPxVal || (size >= 60 ? 60 : size >= 30 ? 50 : 40);
    const result = [];
    let cur = base, idx = 0;
    while (cur < end) {
      const next = Math.min(cur + size, end);
      result.push({
        index:      idx++,
        beginTime:  shared.formatTime(cur),
        endTime:    shared.formatTime(next),
        hour:       Math.floor(cur/60),
        minute:     cur%60,
        endHour:    Math.floor(next/60),
        endMinute:  next%60,
        px,
        label:      shared.formatTime(cur),
        dur:        next - cur,
      });
      cur = next;
    }
    cal._slotsCache = result;
    return result;
  },

  baseMinute(cal) {
    return MTS._CalendarShared.parseTime(cal._startTime || `${cal.startHour||8}:00`).totalMin;
  },

  endMinute(cal) {
    return MTS._CalendarShared.parseTime(cal._endTime || `${cal.endHour||20}:00`).totalMin;
  },

  totalMinutes(cal) {
    return MTS._CalendarShared.endMinute(cal) - MTS._CalendarShared.baseMinute(cal);
  },

  slotIndexFromTop(top, slots) {
    let acc = 0;
    for (let i = 0; i < slots.length; i++) {
      if (top < acc + slots[i].px) return i;
      acc += slots[i].px;
    }
    return slots.length - 1;
  },

  snapToSlotTop(rawTop, slots) {
    let acc = 0, best = 0, bestDist = Infinity;
    for (const s of slots) {
      const d = Math.abs(rawTop - acc);
      if (d < bestDist) { bestDist = d; best = acc; }
      acc += s.px;
    }
    return best;
  },

  /* ── EventRenderer ─────────────────────────────────────── */

  buildEventEl(ev, colIdx, slots, totalPx, dayNumberJS, date, cal) {
    const shared   = MTS._CalendarShared;
    const base     = shared.baseMinute(cal);
    const total    = shared.totalMinutes(cal);
    const isoLocal = shared.isoLocal.bind(shared);

    /* Calcular top y height */
    let top, height;
    if (cal.slots && ev._module != null) {
      /* Modo slots académicos */
      const resolvedModule = ev._module ?? (ev.moduleNumber != null ? ev.moduleNumber - 1 : null);
      const resolvedCount  = ev.moduleCount ?? 1;
      const si = resolvedModule ?? 0, end = si + resolvedCount;
      if (si >= slots.length) return null;
      let t = 0; for (let i=0;i<si;i++) t+=slots[i]?.px||60; top=t;
      let h = 0; for (let i=si;i<Math.min(end,slots.length);i++) h+=slots[i]?.px||60;
      height = Math.max(h-4, 22);
    } else {
      /* Modo horas — startH/endH fuente de verdad */
      const sH = ev.startH ?? Math.floor(base/60), sM = ev.startM ?? 0;
      const eH = ev.endH   ?? (sH+1),              eM = ev.endM   ?? 0;
      const startMin = sH*60+sM, endMin = eH*60+eM;
      const pxPerMin = totalPx / total;
      top    = (startMin - base) * pxPerMin;
      height = Math.max((endMin - startMin) * pxPerMin - 4, 22);
      if (top + height <= 0 || top >= totalPx) return null;
      if (top < 0) { height += top; top = 0; }
      if (top + height > totalPx) height = totalPx - top - 2;
    }

    const evModule      = ev._module ?? (ev.moduleNumber != null ? ev.moduleNumber - 1 : null);
    const evModuleCount = ev.moduleCount ?? ev.moduleSpan ?? 1;
    const evDateStr     = date ? isoLocal(date) : (ev.date || '0000-00-00');
    const pad           = n => String(n??0).padStart(2,'0');
    const evHourStart   = ev.startH != null
      ? `${pad(ev.startH)}:${pad(ev.startM??0)}`
      : (slots[ev._module??0]?.beginTime ?? '00:00');
    const evHourEnd     = ev.endH != null
      ? `${pad(ev.endH)}:${pad(ev.endM??0)}`
      : (slots[(ev._module??0) + evModuleCount - 1]?.endTime ?? evHourStart);

    const el = document.createElement('div');
    el.className = `mts-calendar__event${ev.color ? ' mts-calendar__event--custom-color' : ''}${ev.locked ? ' mts-calendar__event--locked' : ''}`;
    el.id        = `mts-ev-${ev.id}`;
    el.style.cssText = [
      `position:absolute`, `left:3px`, `right:3px`,
      `top:${Math.round(top)}px`, `height:${Math.round(height)}px`,
      `z-index:2`, `overflow:hidden`,
      `border-radius:var(--mts-radius-md,6px)`,
      `cursor:${ev.locked ? 'default' : 'grab'}`,
      ev.color ? `--ev-color:${ev.color}` : '',
    ].filter(Boolean).join(';');

    el.dataset.eventId     = ev.id;
    el.dataset.moduleNumber = evModule != null ? evModule + 1 : '';
    el.dataset.moduleCount = evModuleCount;
    el.dataset.dayNumber   = dayNumberJS;
    el.dataset.date        = evDateStr;
    el.dataset.hourRange   = `${evHourStart}-${evHourEnd}`;

    /* data-* del campo data */
    if (ev.data && typeof ev.data === 'object') {
      Object.entries(ev.data).forEach(([k,v]) => {
        el.dataset[k] = (Array.isArray(v)||(v&&typeof v==='object'))
          ? JSON.stringify(v) : v;
      });
    }

    /* Contenido base — siempre: título + hora + descripción */
    shared.defaultRenderEvent(ev, el, height, cal);
    /* Hook del dev — encima del contenido base: data-*, extras, overrides */
    if (cal.onEventRender) cal.onEventRender(el, ev);

    return el;
  },

  defaultRenderEvent(ev, el, height, cal) {
    const p   = (n,d=0) => String(n??d).padStart(2,'0');
    const time = ev.startH != null
      ? `${p(ev.startH)}:${p(ev.startM)} – ${p(ev.endH)}:${p(ev.endM)}`
      : '';
    const sub  = ev.description || ev.data?.subtitle || '';
    const title = document.createElement('span');
    title.className   = 'mts-calendar__event-title';
    title.textContent = ev.title || '';
    el.appendChild(title);
    if (time && height > 36) {
      const timeEl = document.createElement('span');
      timeEl.className   = 'mts-calendar__event-time';
      timeEl.textContent = time;
      el.appendChild(timeEl);
    }
    if (sub && height > 52) {
      const subEl = document.createElement('span');
      subEl.className   = 'mts-calendar__event-sub';
      subEl.textContent = sub;
      subEl.title       = sub;
      el.appendChild(subEl);
    }
  },

  /* ── ContextMenu ─────────────────────────────────────────── */

  showCtxMenu(x, y, items, onHide) {
    MTS._CalendarShared.hideCtxMenu();
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:99998;';
    overlay.onclick = () => { MTS._CalendarShared.hideCtxMenu(); onHide?.(); };
    document.body.appendChild(overlay);
    MTS._CalendarShared._ctxOverlay = overlay;

    let html = '';
    const actions = [];
    items.forEach((item, idx) => {
      if (item.divider) { html += '<div class="mts-calendar__ctx-divider"></div>'; actions.push(null); return; }
      const danger   = item.danger ? ' mts-calendar__ctx-item--danger' : '';
      const iconHtml = item.icon   ? `<span class="mts-calendar__ctx-icon">${MTS._CalendarShared._san(item.icon)}</span>` : '';
      html += `<div class="mts-calendar__ctx-item${danger}" data-idx="${idx}">${iconHtml}<span class="mts-calendar__ctx-label">${MTS._CalendarShared._esc(item.label)}</span></div>`;
      actions.push(item.onClick || null);
    });

    const menu = document.createElement('div');
    menu.className = 'mts-calendar__ctx-menu';
    menu.style.cssText = `position:fixed;z-index:99999;left:${x}px;top:${y}px;`;
    menu.innerHTML = html;
    menu.querySelectorAll('[data-idx]').forEach(row => {
      row.addEventListener('mouseup', e => {
        e.stopPropagation();
        const fn = actions[parseInt(row.dataset.idx)];
        MTS._CalendarShared.hideCtxMenu();
        onHide?.();
        if (fn) fn();
      });
    });
    document.body.appendChild(menu);
    MTS._CalendarShared._ctxMenu = menu;
    requestAnimationFrame(() => {
      const r = menu.getBoundingClientRect();
      if (r.right  > window.innerWidth  - 8) menu.style.left = `${x - r.width}px`;
      if (r.bottom > window.innerHeight - 8) menu.style.top  = `${y - r.height}px`;
    });
  },

  hideCtxMenu() {
    MTS._CalendarShared._ctxOverlay?.remove();
    MTS._CalendarShared._ctxMenu?.remove();
    MTS._CalendarShared._ctxOverlay = null;
    MTS._CalendarShared._ctxMenu    = null;
  },

  showEventCtxMenu(x, y, ev, ctx, el, cal, emit) {
    const ICON = {
      view:   `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.5"/><path d="M7 6v4M7 4.5h.01" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      edit:   `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
      delete: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4h10M5 4V2.5h4V4M11 4l-.8 7.5H3.8L3 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    };
    const t = cal._locale?.ctx || {};
    const baseItems = [
      { label: t.view||'Ver evento',      icon:ICON.view,   onClick:()=>emit('viewEventRequest',  {event:ev,...ctx}) },
      { label: t.edit||'Editar evento',   icon:ICON.edit,   onClick:()=>emit('editEventRequest',  {event:ev,...ctx}) },
      { divider:true },
      { label: t.delete||'Eliminar evento', icon:ICON.delete, danger:true, onClick:()=>emit('deleteEventRequest',{event:ev,...ctx}) },
    ];
    const items = cal.contextMenuEvent ? cal.contextMenuEvent(ev, ctx, baseItems, cal) : baseItems;
    if (el) { el.classList.add('mts-calendar__event--ctx-active'); MTS._CalendarShared._ctxActiveEl = el; }
    MTS._CalendarShared.showCtxMenu(x, y, items, () => {
      MTS._CalendarShared._ctxActiveEl?.classList.remove('mts-calendar__event--ctx-active');
      MTS._CalendarShared._ctxActiveEl = null;
    });
  },

};
