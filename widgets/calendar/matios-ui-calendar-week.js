/* ============================================================
   MATIOS UI — matios-ui-calendar-week.js
   MTS.WeekView — Vista semanal con DragDrop y Resize propios
   ============================================================ */

window.MTS = window.MTS || {};

MTS.WeekView = class MtsWeekView {
  constructor() {
    this._dragState   = null;
    this._resizeState = null;
    this._rangeState  = null;
    this._onMouseMove = e => this._handleMouseMove(e);
    this._onMouseUp   = e => this._handleMouseUp(e);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseup',   this._onMouseUp);
  }

  destroy() {
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup',   this._onMouseUp);
  }

  /* ── Render principal ───────────────────────────────────── */
  render(ctx) {
    this._ctx = ctx;
    const { headerEl, timesEl, gridEl, alldayEl, days, offset,
            locale, events, slots: calSlots, cal } = ctx;
    const S     = MTS._CalendarShared;
    const slots = S.getSlots(cal);
    const dates = S.weekDates(offset, days);
    const today = S.todayLocal();

    /* Header */
    this._renderHeader(headerEl, dates, days, today, locale, calSlots, ctx);
    /* Times */
    this._renderTimes(timesEl, slots);
    /* AllDay */
    this._renderAllDay(alldayEl, events, dates, days, locale, ctx);
    /* Grid */
    this._renderGrid(gridEl, dates, days, today, slots, events, ctx);
  }

  getDateRange(offset, days) {
    const S     = MTS._CalendarShared;
    const dates = S.weekDates(offset, days);
    return {
      dateStart: S.isoLocal(dates[0]),
      dateEnd:   S.isoLocal(dates[dates.length - 1]),
    };
  }

  /* ── Header ─────────────────────────────────────────────── */
  _renderHeader(el, dates, days, today, locale, calSlots, ctx) {
    const S = MTS._CalendarShared;
    el.innerHTML = ''; el.style.display = 'grid';
    el.style.gridTemplateColumns = `var(--mts-cal-time-w,64px) repeat(${days.length},1fr)`;

    const corner = document.createElement('div');
    corner.className = 'mts-calendar__corner';
    if (calSlots) {
      corner.innerHTML = `<span class="mts-calendar__corner-mod">${locale?.mod||'Mod.'}</span>
                          <span class="mts-calendar__corner-hora">${locale?.hour||'Hora'}</span>`;
    }
    el.appendChild(corner);

    days.forEach((dayNum, i) => {
      const date      = dates?.[i];
      const isToday   = date && date.toDateString() === today.toDateString();
      const dayJS     = date ? date.getDay() : dayNum;
      const dateStr   = date ? S.isoLocal(date) : '0000-00-00';
      const dayLabel  = S.dayLabel(dayJS, locale);
      const cell      = document.createElement('div');
      cell.className  = 'mts-calendar__day-header' + (isToday ? ' mts-calendar__day-header--today' : '');
      cell.dataset.dayNumber = dayJS;
      cell.dataset.date      = dateStr;
      cell.innerHTML = date
        ? `<span class="mts-calendar__day-name" data-day-number="${dayJS}">${dayLabel}</span>
           <span class="mts-calendar__day-num${isToday?' mts-calendar__day-num--today':''}" data-date="${dateStr}">${date.getDate()}</span>`
        : `<span class="mts-calendar__day-name" data-day-number="${dayJS}">${dayLabel}</span>`;

      cell.addEventListener('click', () => ctx.emit('dayClick', {
        day: dayLabel, date: date||null, index: i,
        dayNumber: dayJS, dateISO: dateStr,
      }));
      el.appendChild(cell);
    });
  }

  /* ── Times col ──────────────────────────────────────────── */
  _renderTimes(el, slots) {
    el.innerHTML = ''; el.style.display = 'block'; el.style.flexShrink = '0';
    slots.forEach((slot, si) => {
      const div = document.createElement('div');
      div.className = 'mts-calendar__time-slot';
      div.dataset.moduleNumber = si + 1;
      div.style.height = div.style.minHeight = `${slot.px}px`;
      const label = document.createElement('span');
      label.className   = 'mts-calendar__time-slot-label';
      label.textContent = slot.label;
      div.appendChild(label);
      el.appendChild(div);
    });
  }

  /* ── AllDay ─────────────────────────────────────────────── */
  _renderAllDay(el, events, dates, days, locale, ctx) {
    const S       = MTS._CalendarShared;
    const allDayEvs = events.filter(ev => ev.allDay);
    if (!allDayEvs.length) { el.style.display = 'none'; return; }
    el.style.display = 'grid';
    el.style.gridTemplateColumns = `var(--mts-cal-time-w,64px) repeat(${days.length},1fr)`;
    el.innerHTML = '';
    const corner = document.createElement('div');
    corner.className   = 'mts-calendar__allday-corner';
    corner.textContent = locale?.allDay || 'Todo el día';
    el.appendChild(corner);

    days.forEach((dayNum, i) => {
      const date = dates?.[i];
      const cell = document.createElement('div');
      cell.className = 'mts-calendar__allday-cell';
      const dayEvs = allDayEvs.filter(ev => {
        if (ev.date && date) return new Date(ev.date).toDateString() === date.toDateString();
        return ev._colIdx === i;
      });
      const dayLabel = S.dayLabel(date ? date.getDay() : dayNum, locale);
      dayEvs.forEach(ev => {
        const chip = document.createElement('div');
        chip.className = 'mts-calendar__allday-event';
        const c = ev.color || '#3b82f6';
        chip.style.cssText = `background:color-mix(in srgb,${c} 15%,transparent);color:${c};border-color:${c};`;
        chip.textContent = ev.title;
        chip.addEventListener('click', e => {
          e.stopPropagation();
          ctx.emit('eventClick', {event:ev, day:dayLabel, date:date||null, allDay:true, x:e.clientX, y:e.clientY, el:chip});
        });
        if (!ev.locked && !ctx.readonly) {
          chip.addEventListener('contextmenu', e => {
            e.preventDefault(); e.stopPropagation();
            S.showEventCtxMenu(e.clientX, e.clientY, ev, {day:dayLabel, date}, chip, ctx.cal, ctx.emit);
          });
        }
        cell.appendChild(chip);
      });
      el.appendChild(cell);
    });
  }

  /* ── Grid ───────────────────────────────────────────────── */
  _renderGrid(gridEl, dates, days, today, slots, events, ctx) {
    const S       = MTS._CalendarShared;
    const cal     = ctx.cal;
    const totalPx = slots.reduce((s, sl) => s + sl.px, 0);
    gridEl.innerHTML = ''; gridEl.style.display = 'grid';
    gridEl.style.gridTemplateColumns = `repeat(${days.length},1fr)`;
    gridEl.style.minHeight = `${totalPx}px`;

    days.forEach((dayNum, colIdx) => {
      const date      = dates?.[colIdx] || null;
      const dayJS     = date ? date.getDay() : dayNum;
      const dayLabel  = S.dayLabel(dayJS, ctx.locale);
      const dateStr   = date ? S.isoLocal(date) : '0000-00-00';
      const col       = document.createElement('div');
      col.className   = 'mts-calendar__col';
      col.dataset.colIndex  = colIdx;
      col.dataset.dayNumber = dayJS;
      col.style.height = col.style.minHeight = `${totalPx}px`;

      let accumPx = 0;
      slots.forEach((slot, si) => {
        const cell = this._buildCell({dayLabel, colIdx, dayJS, si, slot, date, dateStr, accumPx, totalPx, slots, ctx});
        col.appendChild(cell);
        accumPx += slot.px;
      });

      /* NowLine */
      if (ctx.showNowLine && date && date.toDateString() === today.toDateString()) {
        const line = document.createElement('div');
        line.className = 'mts-calendar__now-line'; line.dataset.nowLine = '1';
        col.appendChild(line);
        this._updateNowLine(line, cal);
      }

      /* Eventos del día */
      const dayEvs = this._getEventsForDay(colIdx, date, events, ctx);
      if (ctx.allowOverlap) {
        const groups = this._getOverlapGroups(dayEvs, slots, totalPx, cal);
        groups.forEach(group => {
          const n = group.length;
          group.forEach((ev, gi) => {
            const el = S.buildEventEl(ev, colIdx, slots, totalPx, dayJS, date, cal);
            if (!el) return;
            el.style.left  = `${gi * 100/n}%`;
            el.style.right = `${(n-gi-1) * 100/n}%`;
            el.style.width = `${100/n}%`;
            this._bindEventListeners(el, ev, colIdx, dayLabel, date, slots, totalPx, dayJS, ctx);
            col.appendChild(el);
          });
        });
      } else {
        dayEvs.forEach(ev => {
          const el = S.buildEventEl(ev, colIdx, slots, totalPx, dayJS, date, cal);
          if (!el) return;
          this._bindEventListeners(el, ev, colIdx, dayLabel, date, slots, totalPx, dayJS, ctx);
          col.appendChild(el);
        });
      }

      gridEl.appendChild(col);
    });
  }

  /* ── Celda ──────────────────────────────────────────────── */
  _buildCell({dayLabel, colIdx, dayJS, si, slot, date, dateStr, accumPx, totalPx, slots, ctx}) {
    const S    = MTS._CalendarShared;
    const cell = document.createElement('div');
    cell.className = 'mts-calendar__cell';
    cell.style.cssText = `height:${slot.px}px;top:${accumPx}px;position:absolute;left:0;right:0;box-sizing:border-box;border-bottom:1px solid var(--mts-border-color);`;
    const hourRange = `${slot.beginTime}-${slot.endTime??slot.beginTime}`;
    cell.id                   = `mts-cell-${dayJS}-${si+1}`;
    cell.dataset.moduleNumber = si + 1;
    cell.dataset.dayNumber    = dayJS;
    cell.dataset.date         = dateStr;
    cell.dataset.hourRange    = hourRange;

    if (ctx.readonly) return cell;

    const cellData = {
      day: dayLabel, colIndex: colIdx, dayNumber: dayJS,
      moduleIndex: si, date, dateISO: dateStr,
      slot, beginTime: slot.beginTime, endTime: slot.endTime,
    };

    cell.addEventListener('mousedown', e => {
      if (e.target.closest('.mts-calendar__event') || e.button !== 0) return;
      this._startRangeSelect(e, cellData, colIdx, slot, accumPx, ctx);
    });
    cell.addEventListener('click', e => {
      if (e.target.closest('.mts-calendar__event')) return;
      ctx.setSelectedFromCell?.(dayJS, si, dateStr, hourRange);
      ctx.emit('slotClick', cellData);
    });
    cell.addEventListener('dblclick', e => {
      if (e.target.closest('.mts-calendar__event')) return;
      ctx.setSelectedFromCell?.(dayJS, si, dateStr, hourRange);
      ctx.emit('slotDblClick', cellData);
    });
    cell.addEventListener('contextmenu', e => {
      if (e.target.closest('.mts-calendar__event')) return;
      e.preventDefault(); e.stopPropagation();
      ctx.setSelectedFromCell?.(dayJS, si, dateStr, hourRange);
      ctx.emit('slotRightClick', cellData);
      const ICON_ADD = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2v10M2 7h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
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
      ctx.emit('eventRightClick', {event:ev, day:dayLabel, colIndex:colIdx, dayNumber:dayJS, date,
        el, elId:el.id, dataset:{...el.dataset}});
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
      handle.addEventListener('mousedown', e => {
        e.stopPropagation(); e.preventDefault();
        this._startResize(e, ev, el, totalPx, ctx);
      });
      el.appendChild(handle);
    }
  }

  /* ── Drag ───────────────────────────────────────────────── */
  _startDrag(e, ev, el, colIdx, origTop, origH, slots, totalPx, dayJS, ctx) {
    const S = MTS._CalendarShared;
    this._dragState = {
      ev, el, colIdx, origColIdx:colIdx, origDayJS:dayJS,
      startX:e.clientX, startY:e.clientY,
      offsetY: e.clientY - el.getBoundingClientRect().top,
      origTop, origH, slots, totalPx,
      currentColIdx:colIdx, currentTop:origTop,
      weekDates: S.weekDates(ctx.offset, ctx.days),
      ghost:null, active:false, collision:null, isLockedCollision:false,
      ctx,
    };
  }

  _handleMouseMove(e) {
    const S = MTS._CalendarShared;

    /* Range select */
    if (this._rangeState && !this._dragState) {
      const rs    = this._rangeState;
      const slots = S.getSlots(this._ctx?.cal);
      const col   = this._ctx?.gridEl?.querySelectorAll('.mts-calendar__col')[rs.colIdx];
      if (col) {
        const rawTop = e.clientY - col.getBoundingClientRect().top;
        const si     = S.slotIndexFromTop(rawTop, slots);
        rs.endSlot   = slots[si] || rs.startSlot;
        const sI = Math.min(rs.startSlot.index, rs.endSlot.index);
        const eI = Math.max(rs.startSlot.index, rs.endSlot.index);
        let accTop=0; for(let i=0;i<sI;i++) accTop+=slots[i].px;
        let h=0; for(let i=sI;i<=eI;i++) h+=slots[i].px;
        if (rs.el) { rs.el.style.top=`${accTop+2}px`; rs.el.style.height=`${h-4}px`; }
      }
    }

    if (this._dragState) {
      const ds  = this._dragState;
      const ctx = ds.ctx;
      const cal = ctx.cal;
      const S   = MTS._CalendarShared;

      if (!ds.active && (Math.abs(e.clientX-ds.startX)>5||Math.abs(e.clientY-ds.startY)>5)) {
        ds.active = true; ds.el.classList.add('mts-calendar__event--dragging');
        ds.ghost  = ds.el.cloneNode(true);
        ds.ghost.classList.add('mts-calendar__event--ghost');
        ds.ghost.style.pointerEvents='none'; ds.ghost.style.zIndex='20';
        ds.el.parentElement.appendChild(ds.ghost);
        ctx.emit('eventDragStart', {event:ds.ev, day:S.dayLabel(ctx.days[ds.colIdx], ctx.locale)});
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

      /* Colisión */
      const targetDate = ds.weekDates?.[ds.currentColIdx] || null;
      const collision  = ctx.allowOverlap ? null : this._findCollisionByTop(ds.ev, ds.currentColIdx, clamped, ds.slots, ds.totalPx, targetDate, ctx);
      const isLocked   = collision?.locked ?? false;
      ds.collision = collision; ds.isLockedCollision = isLocked;

      if (collision) {
        if (ds.ghost) { ds.ghost.style.opacity=isLocked?'0.3':'0.5'; ds.ghost.style.outline=`2px solid ${isLocked?'#64748b':'var(--mts-color-danger)'}`; ds.ghost.style.filter=isLocked?'saturate(0.1)':'saturate(0.4)'; }
        this._clearCellHighlights(ctx);
        const tc = this._getCellAt(ds.currentColIdx, clamped, ds.slots, ctx);
        if (tc) tc.classList.add(isLocked?'mts-calendar__cell--locked-target':'mts-calendar__cell--collision');
        this._showCollisionTooltip(e.clientX, e.clientY, collision, isLocked);
      } else {
        if (ds.ghost) { ds.ghost.style.opacity='0.65'; ds.ghost.style.outline='none'; ds.ghost.style.filter='none'; }
        this._clearCellHighlights(ctx); this._hideCollisionTooltip();
      }
      if (ds.ghost) ds.ghost.style.top = `${clamped}px`;

      /* Cambiar columna */
      const cols = [...(ctx.gridEl?.querySelectorAll('.mts-calendar__col')||[])];
      cols.forEach((c, ci) => {
        const r = c.getBoundingClientRect();
        if (e.clientX>=r.left && e.clientX<=r.right && ci!==ds.currentColIdx) {
          ds.ghost?.parentElement?.removeChild(ds.ghost);
          c.appendChild(ds.ghost);
          ds.currentColIdx = ci;
          this._clearCellHighlights(ctx);
        }
      });
    }

    if (this._resizeState) {
      const rs      = this._resizeState;
      const cal     = rs.ctx.cal;
      const S       = MTS._CalendarShared;
      const pxPerMin = rs.totalPx / S.totalMinutes(cal);
      const snapPx   = (cal.snapMinutes||15) * pxPerMin;
      const minPx    = snapPx;
      const maxEndMin = S.endMinute(cal);
      const maxPx    = (maxEndMin - (rs.ev.startH*60+(rs.ev.startM||0))) * pxPerMin;
      const rawH     = e.clientY - rs.el.parentElement.getBoundingClientRect().top - rs.origTop;
      const snH      = Math.min(maxPx, Math.max(minPx, Math.round(rawH/snapPx)*snapPx));
      rs.el.style.height = `${snH}px`;
      const newEndMin    = rs.ev.startH*60+(rs.ev.startM||0) + Math.round(snH/pxPerMin);
      const clampedEnd   = Math.min(newEndMin, maxEndMin);
      rs.currentEndH = Math.floor(clampedEnd/60);
      rs.currentEndM = clampedEnd % 60;
      rs.ctx.emit('eventResize', {event:rs.ev, newEndHour:rs.currentEndH, newEndMinute:rs.currentEndM, delta:snH-rs.origH});
    }
  }

  _handleMouseUp(e) {
    const S = MTS._CalendarShared;

    if (this._rangeState) { this._finishRangeSelect(); return; }

    this._clearCellHighlights(this._ctx);
    this._hideCollisionTooltip();

    if (this._dragState?.active) {
      const ds  = this._dragState;
      const ctx = ds.ctx;
      const cal = ctx.cal;
      ds.el.classList.remove('mts-calendar__event--dragging');

      if (ds.collision) {
        ds.ghost?.remove();
        this._bounceBack(ds.el, ds.origTop);
        if (ds.isLockedCollision) ctx.emit('lockedCollision', {event:ds.ev, lockedEvent:ds.collision, targetDay:S.dayLabel(ctx.days[ds.currentColIdx], ctx.locale)});
        else ctx.emit('eventCollision', {event:ds.ev, collidingEvent:ds.collision, targetDay:S.dayLabel(ctx.days[ds.currentColIdx], ctx.locale)});
        this._dragState = null;
        ctx.rerender?.();
        return;
      }

      ds.ghost?.remove();
      const newColIdx     = ds.currentColIdx;
      const targetDate    = ds.weekDates?.[newColIdx] || null;
      const targetDateISO = targetDate ? S.isoLocal(targetDate) : null;
      const targetDayJS   = targetDate ? targetDate.getDay() : null;

      /* Actualizar evento en el store del orquestador */
      let updates;
      if (cal.slots && ds.ev._module != null) {
        const newModuleIdx  = S.slotIndexFromTop(ds.currentTop, ds.slots);
        const preserveCount = ds.ev.moduleCount ?? 1;
        updates = { _colIdx:newColIdx, _module:newModuleIdx, _positioned:true, moduleNumber:newModuleIdx+1, moduleCount:preserveCount };
        if (targetDateISO) updates.date = targetDateISO;
        if (targetDayJS !== null) updates.dayNumber = targetDayJS;
        ctx.updateEventInternal?.(ds.ev.id, updates);
        ctx.emit('eventDragEnd', { event:{...ds.ev,...updates}, fromDay:S.dayLabel(ctx.days[ds.origColIdx], ctx.locale), toDay:S.dayLabel(ctx.days[newColIdx], ctx.locale), fromModule:ds.ev.moduleNumber, toModule:newModuleIdx+1, fromDate:ds.ev.date, toDate:targetDateISO });
        ctx.emit('eventDrop', { event:{...ds.ev,...updates}, fromDay:S.dayLabel(ctx.days[ds.origColIdx], ctx.locale), toDay:S.dayLabel(ctx.days[newColIdx], ctx.locale), fromDate:ds.ev.date, toDate:targetDateISO });
      } else {
        const pxPerMin  = ds.totalPx / S.totalMinutes(cal);
        const newTopMin = S.baseMinute(cal) + Math.round(ds.currentTop/pxPerMin);
        const newSH = Math.floor(newTopMin/60), newSM = newTopMin%60;
        const durMin = (ds.ev.endH-ds.ev.startH)*60+((ds.ev.endM||0)-(ds.ev.startM||0));
        const newEMin = newTopMin + durMin;
        updates = { _colIdx:newColIdx, _module:null, _positioned:true, startH:newSH, startM:newSM, endH:Math.floor(newEMin/60), endM:newEMin%60 };
        if (targetDateISO) updates.date = targetDateISO;
        if (targetDayJS !== null) updates.dayNumber = targetDayJS;
        ctx.updateEventInternal?.(ds.ev.id, updates);
        ctx.emit('eventDragEnd', { event:{...ds.ev,...updates}, fromDay:S.dayLabel(ctx.days[ds.origColIdx], ctx.locale), toDay:S.dayLabel(ctx.days[newColIdx], ctx.locale), fromHour:ds.ev.startH, toHour:newSH, fromDate:ds.ev.date, toDate:targetDateISO });
        ctx.emit('eventDrop', { event:{...ds.ev,...updates}, fromDay:S.dayLabel(ctx.days[ds.origColIdx], ctx.locale), toDay:S.dayLabel(ctx.days[newColIdx], ctx.locale), fromHour:ds.ev.startH, toHour:newSH, fromDate:ds.ev.date, toDate:targetDateISO });
      }
    }

    this._dragState = null;

    if (this._resizeState) {
      const rs  = this._resizeState;
      const ctx = rs.ctx;
      rs.el.classList.remove('mts-calendar__event--resizing');
      const old = {h:rs.ev.endH, m:rs.ev.endM||0};
      const nw  = {h:rs.currentEndH??rs.ev.endH, m:rs.currentEndM??(rs.ev.endM||0)};
      ctx.updateEventInternal?.(rs.ev.id, {endH:nw.h, endM:nw.m, _positioned:true});
      ctx.emit('eventResizeEnd', {event:{...rs.ev, endH:nw.h, endM:nw.m}, oldEnd:old, newEnd:nw});
    }

    this._resizeState = null;
    this._ctx?.rerender?.();
  }

  /* ── Resize ─────────────────────────────────────────────── */
  _startResize(e, ev, el, totalPx, ctx) {
    this._resizeState = {
      ev, el, ctx, totalPx,
      origTop: parseFloat(el.style.top),
      origH:   parseFloat(el.style.height),
      currentEndH: ev.endH, currentEndM: ev.endM||0,
    };
    el.classList.add('mts-calendar__event--resizing');
  }

  /* ── Range select ───────────────────────────────────────── */
  _startRangeSelect(e, cellData, colIdx, slot, accumPx, ctx) {
    const ghost = document.createElement('div');
    ghost.className = 'mts-calendar__range-ghost';
    ghost.style.cssText = `position:absolute;left:3px;right:3px;top:${accumPx+2}px;height:${slot.px-4}px;z-index:8;pointer-events:none;border-radius:6px;`;
    const col = ctx.gridEl?.querySelectorAll('.mts-calendar__col')[colIdx];
    this._rangeState = { colIdx, startSlot:slot, startAccumPx:accumPx, cellData, startY:e.clientY, endSlot:slot, el:ghost, ctx };
    if (col) col.appendChild(ghost);
  }

  _cancelRangeSelect() {
    this._rangeState?.el?.remove();
    this._rangeState = null;
  }

  _finishRangeSelect() {
    const S  = MTS._CalendarShared;
    const rs = this._rangeState;
    if (!rs) return;
    rs.el?.remove();
    const slots = S.getSlots(rs.ctx.cal);
    const sI    = Math.min(rs.startSlot.index, rs.endSlot.index);
    const eI    = Math.max(rs.startSlot.index, rs.endSlot.index);
    const sSlot = slots[sI], eSlot = slots[eI];
    const detail = {
      day: rs.cellData.day, colIndex: rs.colIdx,
      dayNumber: rs.cellData.dayNumber,
      date: rs.cellData.date, dateISO: rs.cellData.dateISO,
      startSlotIndex:sI, endSlotIndex:eI,
      beginTime:sSlot.beginTime, endTime:eSlot.endTime,
      startH:sSlot.hour, startM:sSlot.minute,
      endH:eSlot.endHour, endM:eSlot.endMinute,
    };
    rs.ctx.setSelectedFromCell?.(detail.dayNumber, sI, detail.dateISO||'0000-00-00', `${sSlot.beginTime}-${eSlot.endTime}`);
    this._rangeState = null;
    rs.ctx.emit('rangeSelect', detail);
    rs.ctx.emit('addEventRequest', detail);
  }

  /* ── Colisión ───────────────────────────────────────────── */
  _findCollisionByTop(ev, targetColIdx, targetTop, slots, totalPx, targetDate, ctx) {
    const S         = MTS._CalendarShared;
    const targetISO = targetDate ? S.isoLocal(targetDate) : null;
    const others    = ctx.events.filter(e => {
      if (e.id === ev.id || e._colIdx !== targetColIdx) return false;
      if (targetISO && e.date && e.date !== '0000-00-00') return e.date === targetISO;
      return true;
    });
    if (ctx.cal.slots && ev._module != null) {
      const ts = S.slotIndexFromTop(targetTop, slots);
      const te = ts + (ev.moduleCount??1) - 1;
      return others.find(e => { const es=e._module??0,ee=es+(e.moduleCount??1)-1; return ts<=ee&&es<=te; }) || null;
    }
    const pxPerMin = totalPx / S.totalMinutes(ctx.cal);
    const base     = S.baseMinute(ctx.cal);
    const nsM      = base + Math.round(targetTop/pxPerMin);
    const dur      = (ev.endH-ev.startH)*60+((ev.endM||0)-(ev.startM||0));
    const neM      = nsM + Math.max(dur, 15);
    return others.find(e => {
      const esM=e.startH*60+(e.startM||0), eeM=e.endH*60+(e.endM||0);
      return nsM<eeM && neM>esM;
    }) || null;
  }

  _getOverlapGroups(events, slots, totalPx, cal) {
    const S = MTS._CalendarShared;
    if (!events.length) return [];
    const getModule = ev => ev._module ?? null;
    const sorted = [...events].sort((a,b) => {
      const aS = getModule(a)!=null ? getModule(a) : (a.startH*60+(a.startM||0));
      const bS = getModule(b)!=null ? getModule(b) : (b.startH*60+(b.startM||0));
      return aS-bS;
    });
    const groups=[]; let current=[sorted[0]];
    const endOf = ev => getModule(ev)!=null ? getModule(ev)+(ev.moduleCount??1) : (ev.endH*60+(ev.endM||0));
    let maxEnd = endOf(sorted[0]);
    for (let i=1;i<sorted.length;i++) {
      const ev=sorted[i], startOf=getModule(ev)!=null?getModule(ev):(ev.startH*60+(ev.startM||0));
      if (startOf<maxEnd) { current.push(ev); maxEnd=Math.max(maxEnd,endOf(ev)); }
      else { groups.push(current); current=[ev]; maxEnd=endOf(ev); }
    }
    groups.push(current);
    return groups;
  }

  /* ── Helpers ─────────────────────────────────────────────── */
  _getEventsForDay(colIdx, date, events, ctx) {
    const S      = MTS._CalendarShared;
    const base   = events.filter(ev => ev._colIdx === colIdx && ev._colIdx >= 0 && !ev.allDay);
    if (!date) return base;
    const colISO = S.isoLocal(date);
    return base.filter(ev => {
      if (!ev.date || ev.date === '0000-00-00') return true;
      return ev.date === colISO;
    });
  }

  _bounceBack(el, origTop) {
    el.style.transition = 'top .3s cubic-bezier(.34,1.56,.64,1)';
    el.style.top = `${origTop}px`;
    setTimeout(() => { if (el) el.style.transition = ''; }, 400);
  }

  _getCellAt(colIdx, top, slots, ctx) {
    const S  = MTS._CalendarShared;
    const si = S.slotIndexFromTop(top, slots);
    const col = ctx.gridEl?.querySelectorAll('.mts-calendar__col')[colIdx];
    return col?.querySelectorAll('.mts-calendar__cell')[si] || null;
  }

  _clearCellHighlights(ctx) {
    ctx?.gridEl?.querySelectorAll('.mts-calendar__cell--collision,.mts-calendar__cell--locked-target')
      .forEach(c => c.classList.remove('mts-calendar__cell--collision','mts-calendar__cell--locked-target'));
  }

  _showCollisionTooltip(x, y, colEv, isLocked) {
    this._hideCollisionTooltip();
    const tt = document.createElement('div');
    tt.className = 'mts-calendar__collision-tooltip';
    tt.textContent = isLocked ? 'Horario reservado' : `Conflicto con: ${colEv?.title||'otro evento'}`;
    tt.style.cssText = `position:fixed;left:${x+14}px;top:${y-10}px;z-index:10001;pointer-events:none;`;
    document.body.appendChild(tt);
    this._collisionTT = tt;
    requestAnimationFrame(() => {
      const r = tt.getBoundingClientRect();
      if (r.right  > window.innerWidth  - 8) tt.style.left = `${x-r.width-14}px`;
      if (r.bottom > window.innerHeight - 8) tt.style.top  = `${y-r.height-10}px`;
    });
  }

  _hideCollisionTooltip() {
    this._collisionTT?.remove();
    this._collisionTT = null;
  }

  _updateNowLine(line, cal) {
    const S      = MTS._CalendarShared;
    const now    = new Date();
    const nowMin = now.getHours()*60 + now.getMinutes();
    const base   = S.baseMinute(cal);
    const total  = S.totalMinutes(cal);
    const slots  = S.getSlots(cal);
    const totalPx = slots.reduce((s,sl)=>s+sl.px, 0);
    if (nowMin >= base && nowMin <= base+total) {
      line.style.top     = `${(nowMin-base)*(totalPx/total)}px`;
      line.style.display = 'block';
    } else {
      line.style.display = 'none';
    }
  }
};
