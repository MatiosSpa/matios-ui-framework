# MTS.Calendar

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
  const calendarUI = new MTS.CalendarUI('#calendar', {
    calendarOptions: { view: MTS.Calendar.VIEW.WEEK, days: MTS.Calendar.DAYS_MON_FRI, startTime: '08:00', endTime: '19:00' },
    onEvent: async function (action, event, cal) {
      const A = MTS.CalendarUI.ACTION;
      if (action === A.CREATE) await fetch('/api/events', { method: 'POST', body: JSON.stringify(event) });
      if (action === A.UPDATE || action === A.DROP || action === A.RESIZE)
        await fetch('/api/events/' + event.uid, { method: 'PUT', body: JSON.stringify(event) });
      if (action === A.DELETE) await fetch('/api/events/' + event.uid, { method: 'DELETE' });
    },
  });
  await calendarUI.init();
  const raw = await fetch('/api/events').then(function (r) { return r.json(); });
  calendarUI.cal.setEvents(raw.map(function (e) { return MTS.CalendarEvent.fromAPI(e, calendarUI.cal).toJSON(); }));
}
```

> If your app has a fixed header, use `height: calc(100vh - 60px)` on the container instead of `mts-vh-100`.

---

## Complete example (copy-paste)

Everything wired: load, all raw events, the persistence funnel, your own button, and the three ways to open a
create flow. Built-in UI text (modals, nav, buttons) is driven by the component i18n — set `locale` to `'es'`,
`'en'` or `'pt'`; your own labels (`eventTypes`, your buttons) are yours to localize.

```html
<button type="button" id="btnNewEvent">+ New event</button>   <!-- your button, native or MTS — same onclick -->
<div id="calendar" class="mts-vh-100"></div>
```

```js
// (optional) your transport, if you prefer HttpClient over fetch:
// const http = new MTS.HttpClient({ baseUrl: '/api' });

const calendarUI = new MTS.CalendarUI('#calendar', {

  calendarOptions: {
    // ── Views & layout — use the enums instead of magic strings ──
    view:   MTS.Calendar.VIEW.WEEK,       // VIEW.WEEK | MONTH | DAY | SCHEDULE — plain 'week' still works
    views:  MTS.Calendar.VIEWS_ALL,       // ['week','month','day','schedule']
    days:   MTS.Calendar.DAYS_MON_FRI,    // [1..5]  (DAYS_MON_SAT | MON_SUN | SUN_SAT)
    startTime: '08:00',  endTime: '19:00',  slotSize: 60,
    draggable: true,  resizable: true,   // language is global: MTS.setLanguage('en') at startup, no per-instance locale
    showNowLine: true,  showMiniCal: true,  snapMinutes: 15,  maxMonthEvents: 3,  autoRefetch: true,

    // ── LOAD: called on init and on navigation. You own the transport ──
    dataSource: async function (ctx) {
      // ctx = { dateStart, dateEnd ('YYYY-MM-DD'), view, offset }
      const raw = await fetch('/api/events?start=' + ctx.dateStart + '&end=' + ctx.dateEnd)
        .then(function (r) { return r.json(); });
      // ── or with HttpClient (you handle auth/interceptors): ──
      // const res = await http.get('/events', { params: { start: ctx.dateStart, end: ctx.dateEnd } });
      // if (!res.success) throw new Error(res.message);
      // const raw = res.data;
      return raw.map(function (e) { return MTS.CalendarEvent.fromAPI(e, calendarUI.cal).toJSON(); });
    },

    // ── REACT: raw events (read / intercept). The detail of each one is noted inline: ──
    onReady:          function (e) {}, // { events, visibleDays }
    onEventClick:     function (e) {}, // { event, day, colIndex, dayNumber, date, x, y, el }  → event.data = your fields
    onEventDblClick:  function (e) {}, // { event, day, colIndex, dayNumber }   (default: opens edit modal)
    onEventRightClick:function (e) {}, // { event, day, colIndex, dayNumber, date, el, elId, dataset }
    onSlotClick:      function (e) {}, // { day, colIndex, dayNumber, moduleIndex, date, dateISO, slot, beginTime, endTime }
    onSlotDblClick:   function (e) {}, // same cellData  (default: opens create modal)
    onRangeSelect:    function (e) {}, // { day, dayNumber, date, dateISO, startSlotIndex, endSlotIndex, beginTime, endTime, startH, startM, endH, endM }
    onDayClick:       function (e) {}, // { day, date, index, dayNumber, dateISO }   (month view)
    onMoreDayClick:   function (e) {}, // { events, date }
    onEventDragStart: function (e) {}, // { event, day }
    onEventDrop:      function (e) {}, // { event, fromDay, toDay, fromDate, toDate }   → persisted via onEvent('drop')
    onEventResizeEnd: function (e) {}, // { event, oldEnd, newEnd }                     → persisted via onEvent('resize')
    onEventCollision: function (e) {}, // { event, collidingEvent, targetDay }
    onLockedCollision:function (e) {}, // { event, lockedEvent, targetDay }
    onWeekChange:     function (e) {}, // { dateStart, dateEnd, offset, view }
    onNavigate:       function (e) {}, // { dateStart, dateEnd, offset, view }
    onViewChange:     function (e) {}, // { view }
    onError:          function (e) {}, // { error }  (dataSource threw)
  },

  eventTypes: [
    { value: 'meeting', label: 'Meeting' },   // your domain data — you localize these
    { value: 'task',    label: 'Task' },
  ],

  // ── SAVE: single persistence funnel. All your save logic lives here (once). ──
  // The `action` is set by CalendarUI (or you trigger it with commit()). Where each one comes from:
  //   ACTION.CREATE ← save the create modal      ACTION.DROP   ← drop after drag (no modal)
  //   ACTION.UPDATE ← save the edit modal        ACTION.RESIZE ← end of resize (no modal)
  //   ACTION.DELETE ← confirm delete
  onEvent: async function (action, event, calendar) {
    if (action === MTS.CalendarUI.ACTION.CREATE) {
      const saved = await fetch('/api/events', { method: 'POST', body: JSON.stringify(event) })
        .then(function (r) { return r.json(); });
      // ── or: const saved = (await http.post('/events', event)).data; ──
      return { ...event, uid: saved.id, id: saved.id };   // return the persisted event → painted with the real id
    }
    if (action === MTS.CalendarUI.ACTION.UPDATE ||
        action === MTS.CalendarUI.ACTION.DROP   ||
        action === MTS.CalendarUI.ACTION.RESIZE) {
      await fetch('/api/events/' + event.uid, { method: 'PUT', body: JSON.stringify(event) });
      // ── or: await http.put('/events/' + event.uid, event); ──
    }
    if (action === MTS.CalendarUI.ACTION.DELETE) {
      await fetch('/api/events/' + event.uid, { method: 'DELETE' });
      // ── or: await http.delete('/events/' + event.uid); ──
    }
  },

  // ── (optional) Replace any built-in modal with your own ──
  // renderNewEventModal:    function (cal, event) { return Promise.resolve(/* event | null */); },
  // renderEventEditModal:   function (cal, event) { /* ... */ },
  // renderEventDetailModal: function (cal, event) { /* ... */ },
  // renderEventDeleteModal: function (cal, event) { return Promise.resolve(confirm('Delete?') ? event : null); },
});

await calendarUI.init();


// ── Build an event object (note `data`: your domain fields ride here) ──
const event = {
  uid:         'tmp-1',              // your id (temporary until saved)
  title:       'Sprint planning',
  startDate:   '2026-07-06',
  endDate:     '2026-07-06',
  startHour:   '09:00',
  endHour:     '11:00',
  color:       '#3b82f6',
  locked:      false,
  description: 'Q3 kickoff',
  data: {                            // free object → materialized as data-* on the chip
    tipo:        'meeting',
    responsable: 'Ana',
    sala:        'B-204',
  },
};


// ── Your own button — three ways to trigger "create" ──
const btn = document.getElementById('btnNewEvent');

// A) Reuse CalendarUI's built-in modal (fires onEvent + paints automatically):
btn.onclick = () => calendarUI.openNewModal();

// B) Your own UI → single funnel (persists via onEvent + paints the grid):
btn.onclick = () => calendarUI.commit(MTS.CalendarUI.ACTION.CREATE, event);

// C) Fully manual (you persist and paint; onEvent is not involved):
btn.onclick = async () => {
  const saved = await fetch('/api/events', { method: 'POST', body: JSON.stringify(event) }).then(r => r.json());
  calendarUI.cal.addEvent({ ...event, uid: saved.id, id: saved.id });
};


// ── Read your data back ──
// calendarUI.cal.getData('tmp-1', 'responsable')   → 'Ana'
// inside onEventClick:  e.detail.event.data.sala    → 'B-204'  (and in the DOM: data-sala="B-204")
```

### Where each `action` comes from (set by CalendarUI, not you)

| User interaction | `action` | Modal? |
|---|---|---|
| Save the create modal (new event) | `ACTION.CREATE` | built-in or your `renderNewEventModal` |
| Save the edit modal (existing event) | `ACTION.UPDATE` | built-in or your `renderEventEditModal` |
| Confirm delete | `ACTION.DELETE` | built-in or your `renderEventDeleteModal` |
| Drop after dragging | `ACTION.DROP` | **none** (gesture) |
| End of resize | `ACTION.RESIZE` | **none** (gesture) |

### Your button — the three paths

| Path | Persist | Paint grid | Uses `onEvent`? |
|---|---|---|---|
| **A.** `openNewModal()` | you, in `onEvent` | CalendarUI (auto) | ✅ |
| **B.** `commit(action, event)` | you, in `onEvent` | `commit` (auto) | ✅ |
| **C.** manual | you, inline | you (`addEvent`) | ❌ |

> **Why `onEvent`?** It's the single place your save-to-backend logic lives, so it isn't duplicated across every
> button and gesture. It is mandatory for **drag & drop** and **resize** — those have no button or modal to hook
> into. `commit(action, event)` lets *you* trigger that same funnel from your own UI (and it paints the grid for you).

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

The UI orchestrator — manages creation, modals and all callbacks. `const calendarUI = new MTS.CalendarUI(selector, options); await calendarUI.init();`

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `calendarOptions` | object | `{}` | `MTS.Calendar` internal options |
| `onEvent` | function | `null` | Persistence callback after any confirmed action |
| `renderNewEventModal` / `renderEventEditModal` / `renderEventDetailModal` / `renderEventDeleteModal` | function | `null` | Override the built-in modals |
| `eventTypes` | array | defaults | Event types for the modal select |
| `colors` | array | 20 colors | Color-picker palette |

### `onEvent(action, event, cal)`

Single callback after the user confirms any modal action. `action` ∈ `MTS.CalendarUI.ACTION.{CREATE, UPDATE, DELETE,
DROP, RESIZE}` (plain strings `'create'`… still work). On create, replace the temporary uid with the real DB id:

```js
onEvent: async function (action, event, calendar) {
  const A = MTS.CalendarUI.ACTION;
  if (action === A.CREATE) {
    const saved = await fetch('/api/events', { method: 'POST', body: JSON.stringify(event) }).then(function (r) { return r.json(); });
    calendar.updateEvent(event.uid, { uid: saved.id, id: saved.id });
  }
  // A.UPDATE | A.DROP | A.RESIZE → PUT /api/events/:uid ; A.DELETE → DELETE /api/events/:uid
}
```

### Methods

`calendarUI.init()` (Promise) · `calendarUI.cal` / `calendarUI.getCalendar()` · `calendarUI.getEvents()` · `calendarUI.openNewModal()` ·
`calendarUI.openEditModal(event)` · `calendarUI.openDetailModal(event)` · `calendarUI.addColor(id, hex, label)` · `calendarUI.setEventTypes(types)`.

**`commit(action, event)`** — trigger the persistence funnel from your own UI (button/modal): calls `onEvent(action,
event)` and then paints the grid (`addEvent`/`updateEvent`/`removeEvent`) based on the action. `onEvent` may return the
persisted event (e.g. with the real id on a create) and that is what gets painted. Same funnel used by the built-in
modals and by drag/resize. `action` is one of `MTS.CalendarUI.ACTION.{CREATE, UPDATE, DELETE, DROP, RESIZE}`.

**Enums** (values are plain strings, so `'week'` / `'create'` still work): `MTS.Calendar.VIEW.{WEEK, MONTH, DAY,
SCHEDULE}` · `MTS.Calendar.VIEWS_ALL` (`['week','month','day','schedule']`) · `MTS.CalendarUI.ACTION.{CREATE, UPDATE,
DELETE, DROP, RESIZE}`.

---

## MTS.Calendar

The calendar instance, normally accessed via `calendarUI.cal` after `await calendarUI.init()`.

### calendarOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `view` | string | `'week'` | `'week'` · `'month'` · `'day'` · `'schedule'` |
| `views` | array | all 4 | Views available in the toolbar |
| `days` | array | `DAYS_MON_FRI` | Weekdays to show |
| `startTime` / `endTime` | string | `'08:00'` / `'20:00'` | Grid time range |
| `slotSize` | number | `60` | Slot size in minutes |
| `slots` | array | `null` | Custom slots (ignores `startTime`/`endTime`/`slotSize`) |
| `locale` | string | `'es'` | `'es'` · `'en'` · `'pt'` — built-in UI text (modals, nav, buttons) comes from the component i18n |
| `draggable` / `resizable` | boolean | `true` | Allow drag & drop / resize |
| `readonly` | boolean | `false` | Block all write interactions |
| `allowOverlap` | boolean | `false` | Allow overlapping events |
| `showNowLine` / `showTooltips` / `showMiniCal` | boolean | `true`/`true`/`false` | Now line / tooltips / mini calendar |
| `snapMinutes` | number | `15` | Drag snap granularity |
| `eventDensity` | string | `'comfortable'` | `'compact'` · `'comfortable'` · `'spacious'` |
| `maxMonthEvents` | number | `3` | Max visible events per day in month view |
| `autoRefetch` | boolean | `true` | Reload datasource on navigation |
| `dataSource` / `dataSourceParser` | function | `null` | Async event loader / response transform (lowercase `datasource` still accepted as alias) |
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

## dataSource

An async function called automatically on navigation. It receives the navigation context and must return events in
internal format. It works exactly like the `dataSource` of `MTS.DataTable` / `MTS.GanttChart` — **you own the
transport** (native `fetch`, `MTS.HttpClient`, auth, interceptors); the component only renders what you return.

```js
dataSource: async function (ctx) {
  // ctx.dateStart / ctx.dateEnd ('YYYY-MM-DD'), ctx.view, ctx.offset (0 = current period)
  const raw = await fetch('/api/events?start=' + ctx.dateStart + '&end=' + ctx.dateEnd).then(function (r) { return r.json(); });
  return raw.map(function (item) { return MTS.CalendarEvent.fromAPI(item, cal).toJSON(); });
}
```

> **Naming:** `dataSource` (camelCase) is the canonical option, aligned with `MTS.DataTable` and `MTS.GanttChart`.
> The legacy lowercase `datasource` still works as an alias, so existing code keeps running. Same for
> `dataSourceParser` / `dataSourceParams` (aliases: `datasourceParser` / `datasourceParams`).

A **static array** of events is also accepted in place of the function (no fetch is made).

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

### 2026-07-01
- `dataSource` (camelCase) is now the canonical loader option, aligned with `MTS.DataTable` / `MTS.GanttChart`. The
  legacy lowercase `datasource` still works as an alias (same for `dataSourceParser` / `dataSourceParams`). No breaking change.
- **Enums** added (values stay plain strings — non-breaking): `MTS.Calendar.VIEW` / `VIEWS_ALL` and
  `MTS.CalendarUI.ACTION` — typo-safe alternatives to the `'week'` / `'create'` magic strings.
- **`calendarUI.commit(action, event)`** — public method to trigger the persistence funnel (`onEvent`) + paint the grid
  from your own button/modal, without reimplementing it.
- **Fixed:** the built-in delete now calls `onEvent('delete', …)` before removing from the grid (previously it removed
  visually but never notified the persistence layer, so deletions weren't sent to the backend).
- **i18n:** added the built-in `pt` (Brazilian Portuguese) locale — `locale` is now `'es'` · `'en'` · `'pt'`.
- Added a full **copy-paste example** covering load, all events, the persistence funnel, and the three ways to wire your own button.

### 2026-06-29
- Icons migrated to `MTS.Icon` (nav → `chevron-left`/`chevron-right`, print → `printer`, event menu → `info`/`edit`/
  `trash`, add-event → `add`, empty schedule → `calendar`); dropped inline SVG. The schedule empty-state inline styles
  were moved to a `.mts-calendar__schedule-empty` class. Requires `matios-ui-icons.js`.

### Initial
- Full calendar (week/month/day/agenda) with drag & drop, resize, async datasource (`autoRefetch`), overridable
  modals, `MTS.CalendarEvent.fromAPI` normalization, locked/readonly modes, CSV/iCal/print export, DevPanel, and a
  Service-Worker mock API for development.
