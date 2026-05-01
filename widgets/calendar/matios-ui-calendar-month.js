/* ============================================================
   MATIOS UI — matios-ui-calendar-month.js
   MTS.MonthView — Vista mensual independiente
   ============================================================ */

window.MTS = window.MTS || {};

MTS.MonthView = class MtsMonthView {
  /* ctx: { gridEl, timesEl, headerEl, events, days, offset,
            locale, maxEvents, readonly, emit, cal } */
  render(ctx) {
    const { gridEl, timesEl, headerEl, events, days, offset,
            locale, maxEvents, readonly, emit, cal } = ctx;
    const S = MTS._CalendarShared;

    timesEl.innerHTML  = ''; timesEl.style.display  = 'none';
    headerEl.innerHTML = ''; headerEl.style.display = 'none';
    gridEl.innerHTML   = ''; gridEl.style.display   = 'block'; gridEl.style.minHeight = '';
    gridEl.className   = 'mts-calendar__grid mts-calendar__grid--month';

    const today    = S.todayLocal();
    const anchor   = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const year     = anchor.getFullYear();
    const month    = anchor.getMonth();
    const daysInM  = new Date(year, month+1, 0).getDate();

    /* Calcular startDow según el primer día del formato (days[0]) */
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const firstDayOfWeek  = days[0]; /* dayNumber JS del primer día configurado */
    let startDow = firstDayOfMonth - firstDayOfWeek;
    if (startDow < 0) startDow += 7;

    /* Cabecera — labels de días desde el locale */
    const shortNames = locale?.days?.short || ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    const head = document.createElement('div');
    head.className = 'mts-calendar__month-head';
    /* Mostrar labels en el orden de days[] */
    days.forEach(dayNum => {
      const th = document.createElement('div');
      th.className   = 'mts-calendar__month-th';
      th.textContent = S.dayLabel(dayNum, locale);
      head.appendChild(th);
    });
    gridEl.appendChild(head);

    /* Celdas */
    const body       = document.createElement('div');
    body.className   = 'mts-calendar__month-body';
    body.style.gridTemplateColumns = `repeat(${days.length},1fr)`;
    const totalCells = Math.ceil((startDow + daysInM) / days.length) * days.length;

    for (let i = 0; i < totalCells; i++) {
      const dayNum = i - startDow + 1;
      const cell   = document.createElement('div');
      cell.className = 'mts-calendar__month-cell';

      if (dayNum >= 1 && dayNum <= daysInM) {
        const date    = new Date(year, month, dayNum);
        const isToday = date.toDateString() === today.toDateString();
        const dow     = date.getDay();
        const colIdx  = S.dayJsToColIdx(dow, days);
        const dayName = S.dayLabel(dow, locale);
        const cellISO = S.isoLocal(date);

        cell.id              = `mts-month-cell-${year}-${month+1}-${dayNum}`;
        cell.dataset.date    = cellISO;
        cell.dataset.dayNumber = dow;
        cell.innerHTML = `<span class="mts-calendar__month-day-num${isToday?' mts-calendar__month-day-num--today':''}">${dayNum}</span>`;

        /* Eventos del día */
        const dayEvs = events.filter(ev => {
          if (colIdx < 0 || ev._colIdx !== colIdx) return false;
          if (ev.date && ev.date !== '0000-00-00') return ev.date === cellISO;
          return true;
        });

        const maxShow = maxEvents ?? 3;
        dayEvs.slice(0, maxShow).forEach(ev => {
          const dot = document.createElement('div');
          dot.className = 'mts-calendar__month-event';
          dot.textContent = ev.title;
          if (ev.color) dot.style.cssText = `border-left-color:${ev.color};background:color-mix(in srgb,${ev.color} 12%,transparent);color:${ev.color};`;
          dot.addEventListener('click', e => {
            e.stopPropagation();
            emit('eventClick', {event:ev, day:dayName, dayNumber:dow, date, x:e.clientX, y:e.clientY, el:dot});
          });
          if (!ev.locked && !readonly) {
            dot.addEventListener('contextmenu', e => {
              e.preventDefault(); e.stopPropagation();
              S.showEventCtxMenu(e.clientX, e.clientY, ev, {day:dayName, date}, dot, cal, emit);
            });
          }
          cell.appendChild(dot);
        });

        /* +N más */
        if (dayEvs.length > maxShow) {
          const hidden = dayEvs.length - maxShow;
          const more   = document.createElement('div');
          more.className       = 'mts-calendar__month-more';
          more.dataset.hasMore = 'true';
          more.textContent     = `+${hidden} más`;
          more.addEventListener('click', e => {
            e.stopPropagation(); e.preventDefault();
            emit('moreDayClick', {
              day: dayName, dayNumber: dow, date,
              dateISO: cellISO,
              events: dayEvs, hiddenEvents: dayEvs.slice(maxShow),
              x: e.clientX, y: e.clientY,
            });
          });
          cell.appendChild(more);
        }

        /* Click en celda → dayClick */
        cell.addEventListener('click', e => {
          if (e.target.closest('.mts-calendar__month-more'))  return;
          if (e.target.closest('.mts-calendar__month-event')) return;
          emit('dayClick', { day:dayName, date, index:colIdx, dayNumber:dow, dateISO:cellISO });
        });

      } else {
        cell.classList.add('mts-calendar__month-cell--empty');
      }

      body.appendChild(cell);
    }

    gridEl.appendChild(body);
  }

  /* Rango de fechas que necesita el datasource */
  getDateRange(offset) {
    const S     = MTS._CalendarShared;
    const today = S.todayLocal();
    const first = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const last  = new Date(today.getFullYear(), today.getMonth() + offset + 1, 0);
    return { dateStart: S.isoLocal(first), dateEnd: S.isoLocal(last) };
  }
};
