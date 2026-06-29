# MTS.Calendar (v2)

Full-featured calendar with week, month, day and agenda views, drag & drop, resize, creation/edit modals, an async datasource and a DevPanel for development.

---

## Files

| File | Description |
|------|-------------|
| `matios-ui-calendar.js` | Main orchestrator + `MTS.CalendarEvent` |
| `matios-ui-calendar-ui.js` | UI layer — modals, callbacks, `MTS.CalendarUI` |
| `matios-ui-calendar-{week,day,month,schedule}.js` | View modules |
| `matios-ui-calendar-shared.js` | Shared utilities |
| `matios-ui-calendar-i18n.js` | Translations |
| `matios-ui-calendar.css` / `-colors.css` | Styles / event color palette |
| `sw-calendar.js` | Service Worker — mock API for development |
| `app.js` / `demo.html` | Reference demo |

---

## Installation

The container must have a defined height; the calendar fills 100% of it.

```html
<div id="calendar" class="mts-vh-100"></div>

<script src="matios-ui-calendar-shared.js"></script>
<script src="matios-ui-calendar-week.js"></script>
<script src="matios-ui-calendar-day.js"></script>
<script src="matios-ui-calendar-month.js"></script>
<script src="matios-ui-calendar-schedule.js"></script>
<script src="matios-ui-calendar.js"></script>
<script src="matios-ui-calendar-i18n.js"></script>
<script src="matios-ui-calendar-ui.js"></script>
```

```js
async function start() {
  const ui = new MTS.CalendarUI('#calendar', {
    calendarOptions: { view: 'week', days: MTS.Calendar.DAYS_MON_FRI, startTime: '08:00', endTime: '19:00' },
    onEvent: async function (action, event, cal) {
      if (action === 'create') await fetch('/api/events', { method: 'POST', body: JSON.stringify(event) });
      if (action === 'update' || action === 'drop' || action === 'resize')
        await fetch('/api/events/' + event.uid, { method: 'PUT', body: JSON.stringify(event) });
      if (action === 'delete') await fetch('/api/events/' + event.uid, { method: 'DELETE' });
    },
  });
  await ui.init();
  const raw = await fetch('/api/events').then(function (r) { return r.json(); });
  ui.cal.setEvents(raw.map(function (e) { return MTS.CalendarEvent.fromAPI(e, ui.cal).toJSON(); }));
}
```

> If your app has a fixed header, use `height: calc(100vh - 60px)` on the container instead of `mts-vh-100`.

---

## Event structure

### Required fields

```json
{ "uid": "abc-123", "title": "Team meeting", "startDate": "2026-04-14", "endDate": "2026-04-14",
  "startHour": "09:00", "endHour": "11:00", "color": "#3b82f6", "locked": false }
```

| Field | Type | Description |
|-------|------|-------------|
| `uid` | string | Unique identifier in your system |
| `title` | string | Event title |
| `startDate` / `endDate` | string | `YYYY-MM-DD` (`endDate` defaults to `startDate`) |
| `startHour` / `endHour` | string | `HH:MM` |
| `color` | string | Hex color (default `#3b82f6`) |
| `locked` | boolean | `true` = cannot be moved, edited or deleted (default `false`) |

### Optional fields

`description` (subtitle in chip + detail modal), `allDay` (boolean), and `data` (a free object for your domain data —
the calendar never touches it). The detail modal automatically shows `data.tipo`, `data.responsable`,
`data.asistentes` and `data.sala`/`data.lugar` if present.

---

## MTS.CalendarUI

The UI orchestrator — manages creation, modals and all callbacks. `const ui = new MTS.CalendarUI(selector, options); await ui.init();`

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `calendarOptions` | object | `{}` | `MTS.Calendar` internal options |
| `onEvent` | function | `null` | Persistence callback after any confirmed action |
| `renderNewEventModal` / `renderEventEditModal` / `renderEventDetailModal` / `renderEventDeleteModal` | function | `null` | Override the built-in modals |
| `eventTypes` | array | defaults | Event types for the modal select |
| `colors` | array | 20 colors | Color-picker palette |

### `onEvent(action, event, cal)`

Single callback after the user confirms any modal action. `action` ∈ `'create'` · `'update'` · `'delete'` ·
`'drop'` · `'resize'`. On create, replace the temporary uid with the real DB id:

```js
onEvent: async function (action, event, cal) {
  if (action === 'create') {
    const saved = await fetch('/api/events', { method: 'POST', body: JSON.stringify(event) }).then(function (r) { return r.json(); });
    cal.updateEvent(event.uid, { uid: saved.id, id: saved.id });
  }
  // 'update' | 'drop' | 'resize' → PUT /api/events/:uid ; 'delete' → DELETE /api/events/:uid
}
```

### Methods

`ui.init()` (Promise) · `ui.cal` / `ui.getCalendar()` · `ui.getEvents()` · `ui.openNewModal()` ·
`ui.openEditModal(event)` · `ui.openDetailModal(event)` · `ui.addColor(id, hex, label)` · `ui.setEventTypes(types)`.

---

## MTS.Calendar

The calendar instance, normally accessed via `ui.cal` after `await ui.init()`.

### calendarOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `view` | string | `'week'` | `'week'` · `'month'` · `'day'` · `'schedule'` |
| `views` | array | all 4 | Views available in the toolbar |
| `days` | array | `DAYS_MON_FRI` | Weekdays to show |
| `startTime` / `endTime` | string | `'08:00'` / `'20:00'` | Grid time range |
| `slotSize` | number | `60` | Slot size in minutes |
| `slots` | array | `null` | Custom slots (ignores `startTime`/`endTime`/`slotSize`) |
| `locale` | string | `'es'` | `'es'` · `'en'` |
| `draggable` / `resizable` | boolean | `true` | Allow drag & drop / resize |
| `readonly` | boolean | `false` | Block all write interactions |
| `allowOverlap` | boolean | `false` | Allow overlapping events |
| `showNowLine` / `showTooltips` / `showMiniCal` | boolean | `true`/`true`/`false` | Now line / tooltips / mini calendar |
| `snapMinutes` | number | `15` | Drag snap granularity |
| `eventDensity` | string | `'comfortable'` | `'compact'` · `'comfortable'` · `'spacious'` |
| `maxMonthEvents` | number | `3` | Max visible events per day in month view |
| `autoRefetch` | boolean | `true` | Reload datasource on navigation |
| `datasource` / `datasourceParser` | function | `null` | Async event loader / response transform |
| `docsPath` | string | `null` | Path to a `.md` — shows a "Docs" toolbar button |
| `debug` | boolean | `false` | Internal console logs |

**Day constants:** `MTS.Calendar.DAYS_MON_FRI` `[1..5]` · `DAYS_MON_SAT` · `DAYS_MON_SUN` · `DAYS_SUN_SAT`.

### Methods

`addEvent(event)` · `updateEvent(uid, fields)` · `removeEvent(uid)` · `getEvents()` · `setEvents(events)` ·
`getData(uid, field)` · `setView(view)` · `today()` / `prevWeek()` / `nextWeek()` / `goToOffset(n)` · `refresh()` ·
`destroy()` · `exportCSV()` / `exportICal()` / `print()` · `on(event, cb)` / `off(event, cb)`.

### Events

```js
cal.on('ready',          function (e) {});
cal.on('viewChange',     function (e) {}); // e.detail.view
cal.on('navigate',       function (e) {}); // e.detail.offset
cal.on('weekChange',     function (e) {}); // e.detail.dateStart, dateEnd
cal.on('datasourceLoad', function (e) {}); // e.detail.events
cal.on('error',          function (e) {}); // e.detail.error
cal.on('eventClick',     function (e) {}); // e.detail.event
cal.on('eventDrop',      function (e) {});
cal.on('eventResizeEnd', function (e) {});
cal.on('moreDayClick',   function (e) {}); // e.detail.events, date
```

---

## Datasource

An async function called automatically on navigation. It receives the navigation context and must return events in
internal format:

```js
datasource: async function (ctx) {
  // ctx.dateStart / ctx.dateEnd ('YYYY-MM-DD'), ctx.view, ctx.offset (0 = current period)
  const raw = await fetch('/api/events?start=' + ctx.dateStart + '&end=' + ctx.dateEnd).then(function (r) { return r.json(); });
  return raw.map(function (item) { return MTS.CalendarEvent.fromAPI(item, cal).toJSON(); });
}
```

Date range requested per view — **week**: the 5/6/7 visible days; **month**: 1st to last of the month; **day**: the
visible day; **schedule**: 30 days from the current date.

---

## MTS.CalendarEvent

Converts API events to the internal format:

```js
const events = rawEvents.map(function (e) { return MTS.CalendarEvent.fromAPI(e, cal).toJSON(); });
cal.setEvents(events);
```

`fromAPI` computes `dayNumber`, `date`, `startH/startM/endH/endM` (vertical positioning) and `moduleNumber`/`moduleCount`
(only with custom `slots`) from `startDate`/`startHour`/`endHour`.

---

## Views

- **Week** — time grid with the configured days; drag & drop, resize, click/drag on an empty cell to create.
- **Month** — monthly grid; days over `maxMonthEvents` show "+N more" (opens a day modal).
- **Day** — like week, single day.
- **Agenda (`schedule`)** — chronological list, 30 days from today (only days with events + today), continuous scroll.

---

## Locked & readonly

- **Locked event** (`locked: true`): cannot be moved/edited/deleted; the detail modal shows a read-only notice and
  hides the Edit button. Use for holidays, reserved blocks, confirmed events.
- **Readonly calendar** (`calendarOptions: { readonly: true }`): blocks all writes — no create/move/resize/delete.

---

## Custom modals

By default `MTS.CalendarUI` uses its own modals; replace any with `renderXXXModal(cal, event)` returning a `Promise`.
**Confirm** → resolve the modified event (CalendarUI then calls `onEvent` automatically); **Cancel** → resolve
`null`/`undefined`. Build the modal body with framework components and classes — no inline styles:

```js
renderNewEventModal: function (cal, event) {
  return new Promise(function (resolve) {
    const titleInput = new MTS.Input('#new-ev-title', { label: 'Title', required: true });
    const modal = new MTS.Modal({
      title: 'New event', size: 'sm', body: '<div id="new-ev-title"></div>',
      buttons: [
        { label: 'Cancel', variant: 'ghost',   onClick: function () { modal.hide(); resolve(null); } },
        { label: 'Create', variant: 'primary', onClick: function () {
            const t = titleInput.getValue().trim();
            if (!t) return;
            modal.hide();
            resolve(Object.assign({}, event, { title: t })); // CalendarUI calls onEvent('create', …)
        } },
      ],
    });
    modal.show();
  });
}

// Native confirm for delete:
renderEventDeleteModal: function (cal, event) { return Promise.resolve(confirm('Delete "' + event.title + '"?') ? event : null); }
```

---

## DevPanel

Available in development mode (activated with `?dev` in the URL, or on `localhost` / `127.0.0.1`). Panels: **Config**
(adjust options live), **Log** (clicks/drops/resize/errors) and **Code** (generated JS for the current config).

---

## Mock API

The Service Worker `sw-calendar.js` intercepts requests and serves data from `mock-api/data/` without a real backend.

```html
<script>
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw-calendar.js', { scope: './' });
</script>
```

Endpoints: `GET/POST /widgets/calendar/mock-api/cal_events`, `PUT/DELETE …/cal_events/:uid` (events; GET accepts
`?dateStart&dateEnd`), `GET …/attendees?q=` (TagInput participants), `GET …/meet_places?q=` (Select rooms/places).
`mock-api/data/cal_events.json` has 80 events (2024–2028); **April 2026 has 35** — ideal for testing all views.

---

## Accessibility

- Drag/resize are pointer gestures — creation/edit/detail modals provide the keyboard path; `Esc` closes them.
- `locked` and `readonly` reflect non-editability; convey it in text, not color alone.

---

## Changelog

### 2026-06-29
- Icons migrated to `MTS.Icon` (nav → `chevron-left`/`chevron-right`, print → `printer`, event menu → `info`/`edit`/
  `trash`, add-event → `add`, empty schedule → `calendar`); dropped inline SVG. The schedule empty-state inline styles
  were moved to a `.mts-calendar__schedule-empty` class. Requires `matios-ui-icons.js`.

### Initial
- Full calendar (week/month/day/agenda) with drag & drop, resize, async datasource (`autoRefetch`), overridable
  modals, `MTS.CalendarEvent.fromAPI` normalization, locked/readonly modes, CSV/iCal/print export, DevPanel, and a
  Service-Worker mock API for development.
