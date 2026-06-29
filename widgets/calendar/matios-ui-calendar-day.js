/* ============================================================
   MATIOS UI — matios-ui-calendar-day.js
   MTS.DayView — Vista de día actual, independiente
   ============================================================ */

window.MTS = window.MTS || {};

MTS.DayView = class MtsDayView {
  constructor() {
    this._dragState   = null;
    this._resizeState = null;
    this._onMouseMove = e => this._handleMouseMove(e);
    this._onMouseUp   = e => this._handleMouseUp(e);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup',   this._onMouseUp);
  }

  destroy() {
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup',   this._onMouseUp);
  }

  /* ── Render ─────────────────────────────────────────────── */
  render(ctx) {
    this._ctx = ctx;
    const { headerEl, timesEl, gridEl, offset, locale, events, cal } = ctx;
    const S     = MTS._CalendarShared;
    const slots = S.getSlots(cal);
    const today = S.todayLocal();

    /* Fecha activa = hoy + offset días */
    const target  = new Date(today);
    target.setDate(today.getDate() + offset);
    const dayJS   = target.getDay();
    const dateISO = S.isoLocal(target);
    const dayLabel = S.dayLabel(dayJS, locale);
    const isToday  = target.toDateString() === today.toDateString();
    const totalPx  = slots.reduce((s, sl) => s + sl.px, 0);

    /* Header */
    headerEl.innerHTML = ''; headerEl.style.display = 'grid';
    headerEl.style.gridTemplateColumns = 'var(--mts-cal-time-w,64px) 1fr';
    const corner = document.createElement('div'); corner.className = 'mts-calendar__corner';
    const dh = document.createElement('div');
    dh.className = 'mts-calendar__day-header' + (isToday ? ' mts-calendar__day-header--today' : '');
    dh.dataset.dayNumber = dayJS;
    dh.dataset.date      = dateISO;
    dh.innerHTML = `
      <span class="mts-calendar__day-name" data-day-number="${dayJS}">${dayLabel}</span>
      <span class="mts-calendar__day-num mts-calendar__day-num--today" data-date="${dateISO}">${target.getDate()}</span>`;
    headerEl.appendChild(corner); headerEl.appendChild(dh);

    /* Times */
    timesEl.innerHTML = ''; timesEl.style.display = 'block'; timesEl.style.flexShrink = '0';
    slots.forEach((slot, si) => {
      const div = document.createElement('div');
      div.className = 'mts-calendar__time-slot';
      div.dataset.moduleNumber = si + 1;
      div.style.height = div.style.minHeight = `${slot.px}px`;
      const label = document.createElement('span');
      label.className   = 'mts-calendar__time-slot-label';
      label.textContent = slot.label;
      div.appendChild(label);
      timesEl.appendChild(div);
    });

    /* Grid — columna única */
    gridEl.innerHTML = ''; gridEl.style.display = 'grid';
    gridEl.style.gridTemplateColumns = '1fr';
    gridEl.style.minHeight = `${totalPx}px`;

    const col = document.createElement('div');
    col.className = 'mts-calendar__col';
    col.dataset.dayNumber = dayJS;
    col.style.height = `${totalPx}px`;

    /* Celdas */
    let accumPx = 0;
    slots.forEach((slot, si) => {
      const cell = this._buildCell({dayLabel, dayJS, si, slot, target, dateISO, accumPx, totalPx, slots, ctx});
      col.appendChild(cell);
      accumPx += slot.px;
    });

    /* NowLine */
    if (ctx.showNowLine && isToday) {
      const line = document.createElement('div');
      line.className = 'mts-calendar__now-line'; line.dataset.nowLine = '1';
      col.appendChild(line);
      this._updateNowLine(line, cal);
    }

    /* Eventos del día — filtrar por fecha real */
    const colIdx = S.dayJsToColIdx(dayJS, ctx.days);
    const dayEvs = events.filter(ev => {
      if (ev.allDay) return false;
      if (ev.date && ev.date !== '0000-00-00') return ev.date === dateISO;
      return ev._colIdx === colIdx && ev._colIdx >= 0;
    });

    if (ctx.allowOverlap) {
      const groups = this._getOverlapGroups(dayEvs, slots, totalPx, cal);
      groups.forEach(group => {
        const n = group.length;
        group.forEach((ev, gi) => {
          const el = S.buildEventEl(ev, colIdx, slots, totalPx, dayJS, target, cal);
          if (!el) return;
          el.style.left = `${gi*100/n}%`; el.style.right = `${(n-gi-1)*100/n}%`; el.style.width = `${100/n}%`;
          this._bindEventListeners(el, ev, colIdx, dayLabel, target, slots, totalPx, dayJS, ctx);
          col.appendChild(el);
        });
      });
    } else {
      dayEvs.forEach(ev => {
        const el = S.buildEventEl(ev, colIdx, slots, totalPx, dayJS, target, cal);
        if (!el) return;
        this._bindEventListeners(el, ev, colIdx, dayLabel, target, slots, totalPx, dayJS, ctx);
        col.appendChild(el);
      });
    }

    gridEl.appendChild(col);
  }

  getDateRange(offset) {
    const S     = MTS._CalendarShared;
    const today = S.todayLocal();
    const d     = new Date(today); d.setDate(today.getDate() + offset);
    const iso   = S.isoLocal(d);
    return { dateStart: iso, dateEnd: iso };
  }

  /* ── Celda ──────────────────────────────────────────────── */
  _buildCell({dayLabel, dayJS, si, slot, target, dateISO, accumPx, totalPx, slots, ctx}) {
    const S    = MTS._CalendarShared;
    const cell = document.createElement('div');
    cell.className = 'mts-calendar__cell';
    cell.style.cssText = `height:${slot.px}px;top:${accumPx}px;position:absolute;left:0;right:0;box-sizing:border-box;border-bottom:1px solid var(--mts-border-color);`;
    const hourRange = `${slot.beginTime}-${slot.endTime??slot.beginTime}`;
    cell.id                   = `mts-day-cell-${dayJS}-${si+1}`;
    cell.dataset.moduleNumber = si + 1;
    cell.dataset.dayNumber    = dayJS;
    cell.dataset.date         = dateISO;
    cell.dataset.hourRange    = hourRange;

    if (ctx.readonly) return cell;

    const cellData = {
      day: dayLabel, colIndex: 0, dayNumber: dayJS,
      moduleIndex: si, date: target, dateISO,
      slot, beginTime: slot.beginTime, endTime: slot.endTime,
    };

    cell.addEventListener('click', e => {
      if (e.target.closest('.mts-calendar__event')) return;
      ctx.setSelectedFromCell?.(dayJS, si, dateISO, hourRange);
      ctx.emit('slotClick', cellData);
    });
    cell.addEventListener('dblclick', e => {
      if (e.target.closest('.mts-calendar__event')) return;
      ctx.setSelectedFromCell?.(dayJS, si, dateISO, hourRange);
      ctx.emit('slotDblClick', cellData);
    });
    cell.addEventListener('contextmenu', e => {
      if (e.target.closest('.mts-calendar__event')) return;
      e.preventDefault(); e.stopPropagation();
      ctx.setSelectedFromCell?.(dayJS, si, dateISO, hourRange);
      ctx.emit('slotRightClick', cellData);
      const ICON_ADD = MTS.Icon.get('add');
      const baseItems = [{ label: ctx.locale?.ctx?.add||'Nuevo evento', icon:ICON_ADD, onClick:()=>ctx.emit('addEventRequest', cellData) }];
      const items = ctx.contextMenuCell ? ctx.contextMenuCell(cellData, baseItems, ctx.cal) : baseItems;
      MTS._CalendarShared.showCtxMenu(e.clientX, e.clientY, items);
    });
    return cell;
  }

  /* ── Event listeners ────────────────────────────────────── */
  _bindEventListeners(el, ev, colIdx, dayLabel, date, slots, totalPx, dayJS, ctx) {
    const S = MTS._CalendarShared;
    el.addEventListener('click', e => {
      e.stopPropagation();
      ctx.emit('eventClick', {event:ev, day:dayLabel, colIndex:colIdx, dayNumber:dayJS, date, x:e.clientX, y:e.clientY, el});
    });
    el.addEventListener('dblclick', e => {
      e.stopPropagation();
      ctx.emit('eventDblClick', {event:ev, day:dayLabel, colIndex:colIdx, dayNumber:dayJS});
    });
    el.addEventListener('contextmenu', e => {
      e.preventDefault(); e.stopPropagation();
      ctx.setSelectedFromEvent?.(ev, dayJS, date, slots);
      ctx.emit('eventRightClick', {event:ev, day:dayLabel, colIndex:colIdx, dayNumber:dayJS, date, el, elId:el.id, dataset:{...el.dataset}});
      S.showEventCtxMenu(e.clientX, e.clientY, ev, {day:dayLabel, colIndex:colIdx, dayNumber:dayJS, date}, el, ctx.cal, ctx.emit);
    });
    if (ctx.draggable && !ev.locked) {
      el.addEventListener('mousedown', e => {
        if (e.target.classList.contains('mts-calendar__event-resize')) return;
        e.preventDefault();
        this._startDrag(e, ev, el, colIdx, parseFloat(el.style.top), parseFloat(el.style.height), slots, totalPx, dayJS, ctx);
      });
    }
    if (ctx.resizable && !ctx.cal.slots && ev.startH != null && ev.endH != null && !ev.locked) {
      const handle = document.createElement('div');
      handle.className = 'mts-calendar__event-resize';
      handle.addEventListener('mousedown', e => { e.stopPropagation(); e.preventDefault(); this._startResize(e, ev, el, totalPx, ctx); });
      el.appendChild(handle);
    }
  }

  /* ── Drag (solo vertical — día único, no cambia columna) ── */
  _startDrag(e, ev, el, colIdx, origTop, origH, slots, totalPx, dayJS, ctx) {
    const S = MTS._CalendarShared;
    this._dragState = {
      ev, el, colIdx, origTop, origH, slots, totalPx, dayJS, ctx,
      startX:e.clientX, startY:e.clientY,
      offsetY: e.clientY - el.getBoundingClientRect().top,
      currentTop: origTop, ghost:null, active:false,
      date: this._ctx ? (() => { const t=S.todayLocal(); t.setDate(t.getDate()+ctx.offset); return t; })() : null,
    };
  }

  _handleMouseMove(e) {
    const S = MTS._CalendarShared;

    if (this._dragState) {
      const ds  = this._dragState;
      const ctx = ds.ctx;
      const cal = ctx.cal;

      if (!ds.active && (Math.abs(e.clientX-ds.startX)>5||Math.abs(e.clientY-ds.startY)>5)) {
        ds.active = true; ds.el.classList.add('mts-calendar__event--dragging');
        ds.ghost  = ds.el.cloneNode(true);
        ds.ghost.classList.add('mts-calendar__event--ghost');
        ds.ghost.style.pointerEvents='none'; ds.ghost.style.zIndex='20';
        ds.el.parentElement.appendChild(ds.ghost);
        ctx.emit('eventDragStart', {event:ds.ev, day:S.dayLabel(ds.dayJS, ctx.locale)});
      }
      if (!ds.active) return;

      const col    = ds.ghost?.parentElement || ds.el.parentElement;
      const rawTop = e.clientY - col.getBoundingClientRect().top - ds.offsetY;
      let clamped;
      if (cal.slots && ds.ev._module != null) {
        clamped = S.snapToSlotTop(rawTop, ds.slots);
      } else {
        const pxPerMin = ds.totalPx / S.totalMinutes(cal);
        const snapPx   = (cal.snapMinutes||15) * pxPerMin;
        clamped = Math.max(0, Math.min(Math.round(rawTop/snapPx)*snapPx, ds.totalPx-ds.origH));
      }
      ds.currentTop = clamped;
      if (ds.ghost) ds.ghost.style.top = `${clamped}px`;
    }

    if (this._resizeState) {
      const rs       = this._resizeState;
      const cal      = rs.ctx.cal;
      const S        = MTS._CalendarShared;
      const pxPerMin = rs.totalPx / S.totalMinutes(cal);
      const snapPx   = (cal.snapMinutes||15) * pxPerMin;
      const maxEndMin = S.endMinute(cal);
      const maxPx    = (maxEndMin - (rs.ev.startH*60+(rs.ev.startM||0))) * pxPerMin;
      const rawH     = e.clientY - rs.el.parentElement.getBoundingClientRect().top - rs.origTop;
      const snH      = Math.min(maxPx, Math.max(snapPx, Math.round(rawH/snapPx)*snapPx));
      rs.el.style.height = `${snH}px`;
      const newEndMin    = rs.ev.startH*60+(rs.ev.startM||0) + Math.round(snH/pxPerMin);
      rs.currentEndH = Math.floor(Math.min(newEndMin, maxEndMin)/60);
      rs.currentEndM = Math.min(newEndMin, maxEndMin) % 60;
      rs.ctx.emit('eventResize', {event:rs.ev, newEndHour:rs.currentEndH, newEndMinute:rs.currentEndM});
    }
  }

  _handleMouseUp(e) {
    const S = MTS._CalendarShared;

    if (this._dragState?.active) {
      const ds  = this._dragState;
      const ctx = ds.ctx;
      const cal = ctx.cal;
      ds.el.classList.remove('mts-calendar__event--dragging');
      ds.ghost?.remove();

      const pxPerMin  = ds.totalPx / S.totalMinutes(cal);
      const newTopMin = S.baseMinute(cal) + Math.round(ds.currentTop/pxPerMin);
      const newSH     = Math.floor(newTopMin/60), newSM = newTopMin%60;
      const durMin    = (ds.ev.endH-ds.ev.startH)*60+((ds.ev.endM||0)-(ds.ev.startM||0));
      const newEMin   = newTopMin + durMin;
      const updates   = { _positioned:true, startH:newSH, startM:newSM, endH:Math.floor(newEMin/60), endM:newEMin%60 };
      if (ds.date) { updates.date = S.isoLocal(ds.date); updates.dayNumber = ds.date.getDay(); }
      ctx.updateEventInternal?.(ds.ev.id, updates);
      ctx.emit('eventDragEnd', {event:{...ds.ev,...updates}, fromHour:ds.ev.startH, toHour:newSH});
      ctx.emit('eventDrop',    {event:{...ds.ev,...updates}, fromHour:ds.ev.startH, toHour:newSH});
    }
    this._dragState = null;

    if (this._resizeState) {
      const rs  = this._resizeState;
      const ctx = rs.ctx;
      rs.el.classList.remove('mts-calendar__event--resizing');
      const nw = {h:rs.currentEndH??rs.ev.endH, m:rs.currentEndM??(rs.ev.endM||0)};
      ctx.updateEventInternal?.(rs.ev.id, {endH:nw.h, endM:nw.m, _positioned:true});
      ctx.emit('eventResizeEnd', {event:{...rs.ev, endH:nw.h, endM:nw.m}, oldEnd:{h:rs.ev.endH,m:rs.ev.endM||0}, newEnd:nw});
    }
    this._resizeState = null;
    this._ctx?.rerender?.();
  }

  _startResize(e, ev, el, totalPx, ctx) {
    this._resizeState = { ev, el, ctx, totalPx, origTop:parseFloat(el.style.top), origH:parseFloat(el.style.height), currentEndH:ev.endH, currentEndM:ev.endM||0 };
    el.classList.add('mts-calendar__event--resizing');
  }

  _getOverlapGroups(events, slots, totalPx, cal) {
    if (!events.length) return [];
    const sorted = [...events].sort((a,b)=>(a.startH*60+(a.startM||0))-(b.startH*60+(b.startM||0)));
    const groups=[]; let current=[sorted[0]];
    const endOf = ev => ev.endH*60+(ev.endM||0);
    let maxEnd = endOf(sorted[0]);
    for (let i=1;i<sorted.length;i++) {
      const ev=sorted[i], startOf=ev.startH*60+(ev.startM||0);
      if (startOf<maxEnd) { current.push(ev); maxEnd=Math.max(maxEnd,endOf(ev)); }
      else { groups.push(current); current=[ev]; maxEnd=endOf(ev); }
    }
    groups.push(current);
    return groups;
  }

  _updateNowLine(line, cal) {
    const S      = MTS._CalendarShared;
    const now    = new Date();
    const nowMin = now.getHours()*60 + now.getMinutes();
    const base   = S.baseMinute(cal);
    const total  = S.totalMinutes(cal);
    const slots  = S.getSlots(cal);
    const totalPx = slots.reduce((s,sl)=>s+sl.px, 0);
    if (nowMin>=base && nowMin<=base+total) {
      line.style.top=`${(nowMin-base)*(totalPx/total)}px`; line.style.display='block';
    } else { line.style.display='none'; }
  }
};
