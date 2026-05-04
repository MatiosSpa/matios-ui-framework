/* ============================================================
   MATIOS UI — matios-ui-calendar-schedule.js
   MTS.ScheduleView — Vista agenda/lista independiente
   ============================================================ */

window.MTS = window.MTS || {};

MTS.ScheduleView = class MtsScheduleView {
  /* ctx: { gridEl, timesEl, headerEl, events, days, offset,
            locale, readonly, emit, cal } */
  render(ctx) {
    const { gridEl, timesEl, headerEl, events, days, offset,
            locale, readonly, emit, cal } = ctx;
    const S = MTS._CalendarShared;

    timesEl.innerHTML  = ''; timesEl.style.display = 'none';
    headerEl.innerHTML = ''; headerEl.style.display = 'none';
    /* Schedule usa el scrollEl directamente como contenedor */
    const scrollEl = gridEl.parentElement;
    if (scrollEl) { scrollEl.style.display = 'block'; scrollEl.style.overflowY = 'auto'; }
    gridEl.innerHTML = '';
    gridEl.removeAttribute('style');
    gridEl.className = 'mts-calendar__grid mts-calendar__grid--schedule';

    const today     = S.todayLocal();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + offset);
    const months    = locale?.months || ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

    /* Mostrar 30 días desde startDate */
    for (let d = 0; d < 30; d++) {
      const date    = new Date(startDate);
      date.setDate(startDate.getDate() + d);
      const dow     = date.getDay();
      const colIdx  = S.dayJsToColIdx(dow, days);
      const dayName = S.dayLabel(dow, locale);
      const isToday = date.toDateString() === today.toDateString();
      const dateISO = S.isoLocal(date);

      /* Eventos del día — filtrar por fecha real */
      const dayEvs = events.filter(ev => {
        if (ev.allDay) return false;
        if (ev.date && ev.date !== '0000-00-00') {
          return ev.date === dateISO;
        }
        return ev._colIdx === colIdx && ev._colIdx >= 0;
      }).sort((a,b) => (a.startH*60+(a.startM||0)) - (b.startH*60+(b.startM||0)));

      /* Solo mostrar días con eventos, excepto hoy */
      if (!dayEvs.length && !isToday) continue;

      const dayBlock = document.createElement('div');
      dayBlock.className = 'mts-calendar__schedule-day' + (isToday ? ' mts-calendar__schedule-day--today' : '');

      /* Label del día */
      const dayLabel = document.createElement('div');
      dayLabel.className = 'mts-calendar__schedule-day-label';
      dayLabel.innerHTML = `
        <span class="mts-calendar__schedule-day-num${isToday?' mts-calendar__schedule-day-num--today':''}">${date.getDate()}</span>
        <span class="mts-calendar__schedule-day-name">${dayName} · ${months[date.getMonth()]}</span>`;
      dayBlock.appendChild(dayLabel);

      if (!dayEvs.length) {
        const empty = document.createElement('div');
        empty.className   = 'mts-calendar__schedule-empty';
        empty.textContent = locale?.noEvents || 'Sin eventos en este período';
        dayBlock.appendChild(empty);
      } else {
        dayEvs.forEach(ev => {
          const row = document.createElement('div');
          row.className = 'mts-calendar__schedule-event';
          const p       = n => String(n??0).padStart(2,'0');
          const time    = ev.startH != null ? `${p(ev.startH)}:${p(ev.startM)} – ${p(ev.endH)}:${p(ev.endM)}` : '';
          const evColor = ev.color || '#3b82f6';
          row.style.cssText = `border-left-color:${evColor};background:color-mix(in srgb,${evColor} 10%,transparent);`;
          const _S = MTS._CalendarShared;
          row.innerHTML = `
            <span class="mts-calendar__schedule-event-time">${time}</span>
            <span class="mts-calendar__schedule-event-title">${_S._esc(ev.title||'')}</span>
            ${(ev.description||ev.data?.subtitle)?`<span class="mts-calendar__schedule-event-sub">${_S._esc(ev.description||ev.data?.subtitle||'')}</span>`:''}`;

          row.addEventListener('click', e => {
            e.stopPropagation();
            emit('eventClick', {event:ev, day:dayName, dayNumber:dow, date, x:e.clientX, y:e.clientY, el:row});
          });
          if (!ev.locked && !readonly) {
            row.addEventListener('contextmenu', e => {
              e.preventDefault(); e.stopPropagation();
              S.showEventCtxMenu(e.clientX, e.clientY, ev, {day:dayName, date}, row, cal, emit);
            });
          }
          dayBlock.appendChild(row);
        });
      }

      gridEl.appendChild(dayBlock);
    }

    /* Sin eventos */
    if (!gridEl.children.length) {
      const empty = document.createElement('div');
      empty.className = 'mts-calendar__schedule-no-events';
      empty.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;gap:10px;padding:48px 0;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--mts-text-muted)" stroke-width="1.2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <path d="M16 2v4M8 2v4M3 10h18"/>
          <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>
        </svg>
        <span style="font-size:13px;color:var(--mts-text-muted)">${locale?.noEvents||'Sin eventos en este período'}</span>
      </div>`;
      gridEl.appendChild(empty);
    }
  }

  /* Rango de fechas — 30 días desde hoy + offset */
  destroy() {
    /* Restaurar scrollEl al estado flex para otras vistas */
    const gridEl = document.querySelector('.mts-calendar__grid--schedule');
    if (gridEl?.parentElement) {
      gridEl.parentElement.style.display = '';
      gridEl.parentElement.style.overflowY = '';
    }
  }

  getDateRange(offset) {
    const S     = MTS._CalendarShared;
    const today = S.todayLocal();
    const start = new Date(today); start.setDate(today.getDate() + offset);
    const end   = new Date(start); end.setDate(start.getDate() + 29);
    return { dateStart: S.isoLocal(start), dateEnd: S.isoLocal(end) };
  }
};
