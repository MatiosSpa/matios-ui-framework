# MTS.Calendar v2

🇬🇧 Full-featured calendar component with week, month, day and agenda views, drag & drop, resize, creation and editing modals, async datasource and DevPanel for development.
🇪🇸 Componente de calendario completo con vistas semana, mes, día y agenda, drag & drop, resize, modales de creación y edición, datasource async y DevPanel para desarrollo.

---

## Files / Archivos

| File / Archivo | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|
| `matios-ui-calendar.js` | 🇬🇧 Main orchestrator + `MTS.CalendarEvent` / 🇪🇸 Orquestador principal + `MTS.CalendarEvent` |
| `matios-ui-calendar-ui.js` | 🇬🇧 UI layer — modals, callbacks, `MTS.CalendarUI` / 🇪🇸 Capa de UI — modales, callbacks, `MTS.CalendarUI` |
| `matios-ui-calendar-week.js` | 🇬🇧 Week view / 🇪🇸 Vista semana |
| `matios-ui-calendar-day.js` | 🇬🇧 Day view / 🇪🇸 Vista día |
| `matios-ui-calendar-month.js` | 🇬🇧 Month view / 🇪🇸 Vista mes |
| `matios-ui-calendar-schedule.js` | 🇬🇧 Agenda view / 🇪🇸 Vista agenda |
| `matios-ui-calendar-shared.js` | 🇬🇧 Shared utilities / 🇪🇸 Utilidades compartidas |
| `matios-ui-calendar-i18n.js` | 🇬🇧 Translations / 🇪🇸 Traducciones |
| `matios-ui-calendar.css` | 🇬🇧 Calendar styles / 🇪🇸 Estilos del calendario |
| `matios-ui-calendar-colors.css` | 🇬🇧 Event color palette / 🇪🇸 Paleta de colores de eventos |
| `sw-calendar.js` | 🇬🇧 Service Worker — Mock API for development / 🇪🇸 Service Worker — Mock API para desarrollo |
| `app.js` | 🇬🇧 Reference demo / 🇪🇸 Demo de referencia |
| `demo.html` | 🇬🇧 Demo HTML / 🇪🇸 HTML de la demo |

---

## Quickstart

🇬🇧 The minimum to get the calendar running.
🇪🇸 El mínimo absoluto para tener el calendario funcionando.

```html
<!-- 🇬🇧 Container — must have a defined height / 🇪🇸 Contenedor — debe tener altura definida -->
<div id="calendario" style="height: 100vh"></div>

<script src="matios-ui-calendar-shared.js"></script>
<script src="matios-ui-calendar-week.js"></script>
<script src="matios-ui-calendar-day.js"></script>
<script src="matios-ui-calendar-month.js"></script>
<script src="matios-ui-calendar-schedule.js"></script>
<script src="matios-ui-calendar.js"></script>
<script src="matios-ui-calendar-i18n.js"></script>
<script src="matios-ui-calendar-ui.js"></script>

<script>
(async () => {
  const ui = new MTS.CalendarUI('#calendario', {
    calendarOptions: {
      view:      'week',
      days:      MTS.Calendar.DAYS_MON_FRI,
      startTime: '08:00',
      endTime:   '19:00',
    },
    onEvent: async (action, event, cal) => {
      if (action === 'create') await fetch('/api/events', { method: 'POST', body: JSON.stringify(event) });
      if (action === 'update') await fetch('/api/events/' + event.uid, { method: 'PUT',  body: JSON.stringify(event) });
      if (action === 'delete') await fetch('/api/events/' + event.uid, { method: 'DELETE' });
      if (action === 'drop' || action === 'resize') await fetch('/api/events/' + event.uid, { method: 'PUT', body: JSON.stringify(event) });
    },
  });
  await ui.init();

  // 🇬🇧 Load events from your API / 🇪🇸 Cargar eventos desde tu API
  const events = await fetch('/api/events').then(r => r.json());
  ui.cal.setEvents(events.map(e => MTS.CalendarEvent.fromAPI(e, ui.cal).toJSON()));
})();
</script>
```

🇬🇧 The `#calendario` container must have a defined height. The calendar occupies 100% of its container. If your app has a fixed header use `height: calc(100vh - 60px)`.
🇪🇸 El contenedor `#calendario` debe tener altura definida. El calendario ocupa el 100% de su contenedor. Si tu app tiene un header fijo usa `height: calc(100vh - 60px)`.

---

## Event structure / Estructura del evento

### Required fields / Campos obligatorios

🇬🇧 Every event coming from your API must have these fields.
🇪🇸 Todo evento que venga de tu API debe tener estos campos.

```json
{
  "uid":       "abc-123",
  "title":     "Team meeting",
  "startDate": "2026-04-14",
  "endDate":   "2026-04-14",
  "startHour": "09:00",
  "endHour":   "11:00",
  "color":     "#3b82f6",
  "locked":    false
}
```

| Field / Campo | Type / Tipo | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|---|
| `uid` | string | 🇬🇧 Unique identifier in your system / 🇪🇸 Identificador único en tu sistema |
| `title` | string | 🇬🇧 Event title / 🇪🇸 Título del evento |
| `startDate` | string | 🇬🇧 Start date `YYYY-MM-DD` / 🇪🇸 Fecha de inicio `YYYY-MM-DD` |
| `endDate` | string | 🇬🇧 End date. Defaults to `startDate` if omitted / 🇪🇸 Fecha de fin. Si no viene, asume `startDate` |
| `startHour` | string | 🇬🇧 Start time `HH:MM` / 🇪🇸 Hora de inicio `HH:MM` |
| `endHour` | string | 🇬🇧 End time `HH:MM` / 🇪🇸 Hora de fin `HH:MM` |
| `color` | string | 🇬🇧 Event color in hex. Default `#3b82f6` / 🇪🇸 Color del evento en hex. Default `#3b82f6` |
| `locked` | boolean | 🇬🇧 `true` = cannot be moved, edited or deleted. Default `false` / 🇪🇸 `true` = no se puede mover, editar ni eliminar. Default `false` |

### Optional fields / Campos opcionales

| Field / Campo | Type / Tipo | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|---|
| `description` | string | 🇬🇧 Subtitle shown in the event chip and detail modal / 🇪🇸 Subtítulo visible en el evento y modal de detalle |
| `allDay` | boolean | 🇬🇧 All-day event. Default `false` / 🇪🇸 Evento de día completo. Default `false` |
| `data` | object | 🇬🇧 Free object for your domain data — the calendar does not touch it / 🇪🇸 Objeto libre para datos de tu dominio — el calendario no lo toca |

### The `data` field / El campo `data`

🇬🇧 Use `data` to store any additional information. The detail modal automatically shows `data.tipo`, `data.responsable`, `data.asistentes` and `data.sala` / `data.lugar` if they exist.
🇪🇸 Usa `data` para guardar cualquier información adicional. El modal de detalle muestra automáticamente `data.tipo`, `data.responsable`, `data.asistentes` y `data.sala` / `data.lugar` si existen.

```json
{
  "uid": "abc-123",
  "title": "Kick-off proyecto",
  "startDate": "2026-04-14",
  "endDate": "2026-04-14",
  "startHour": "11:00",
  "endHour": "13:00",
  "color": "#64748b",
  "locked": false,
  "data": {
    "tipo": "Reunión",
    "responsable": "Ana López",
    "asistentes": "Diego Vargas, Felipe Reyes",
    "sala": "Sala Nueva York",
    "invitados": [
      { "uid": "ana@empresa.com",   "name": "Ana López"    },
      { "uid": "diego@empresa.com", "name": "Diego Vargas" }
    ]
  }
}
```

---

## MTS.CalendarUI

🇬🇧 The UI orchestrator. Manages calendar creation, modals and all callbacks.
🇪🇸 El orquestador de UI. Gestiona la creación del calendario, los modales y todos los callbacks.

### Constructor

```js
const ui = new MTS.CalendarUI(selector, options);
await ui.init();
```

### Options / Opciones

| Option / Opción | Type / Tipo | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|---|---|
| `calendarOptions` | object | `{}` | 🇬🇧 `MTS.Calendar` internal options / 🇪🇸 Opciones del `MTS.Calendar` interno |
| `onEvent` | function | `null` | 🇬🇧 Persistence callback. Called after any action is confirmed / 🇪🇸 Callback de persistencia. Se llama después de confirmar cualquier acción |
| `renderNewEventModal` | function | `null` | 🇬🇧 Override the creation modal / 🇪🇸 Override del modal de creación |
| `renderEventEditModal` | function | `null` | 🇬🇧 Override the edit modal / 🇪🇸 Override del modal de edición |
| `renderEventDetailModal` | function | `null` | 🇬🇧 Override the detail modal / 🇪🇸 Override del modal de detalle |
| `renderEventDeleteModal` | function | `null` | 🇬🇧 Override the delete modal / 🇪🇸 Override del modal de eliminación |
| `eventTypes` | array | 🇬🇧 See below / 🇪🇸 Ver abajo | 🇬🇧 Event types for the modal select / 🇪🇸 Tipos de evento para el select del modal |
| `colors` | array | 20 colors | 🇬🇧 Color picker palette / 🇪🇸 Paleta del color picker |

### onEvent

🇬🇧 Single callback called after the user confirms any action in the modals.
🇪🇸 Callback único que se llama después de que el usuario confirma cualquier acción en los modales.

```js
onEvent: async (action, event, cal) => {
  // action: 'create' | 'update' | 'delete' | 'drop' | 'resize'
  // event:  🇬🇧 event object with all fields / 🇪🇸 objeto del evento con todos sus campos
  // cal:    🇬🇧 MTS.Calendar instance / 🇪🇸 instancia MTS.Calendar

  switch (action) {
    case 'create':
      const res   = await fetch('/api/events', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(event),
      });
      const saved = await res.json();
      // 🇬🇧 Replace the temporary uid with the real DB id
      // 🇪🇸 Reemplazar el uid temporal con el id real de la BD
      cal.updateEvent(event.uid, { uid: saved.id, id: saved.id });
      break;

    case 'update':
      await fetch('/api/events/' + event.uid, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(event),
      });
      break;

    case 'delete':
      await fetch('/api/events/' + event.uid, { method: 'DELETE' });
      break;

    case 'drop':
    case 'resize':
      // 🇬🇧 Event already moved visually — just persist the new state
      // 🇪🇸 El evento ya fue movido visualmente — solo persiste el nuevo estado
      await fetch('/api/events/' + event.uid, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(event),
      });
      break;
  }
},
```

### Public methods / Métodos públicos

| Method / Método | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|
| `ui.init()` | 🇬🇧 Initializes the calendar. Returns `Promise` / 🇪🇸 Inicializa el calendario. Retorna `Promise` |
| `ui.cal` | 🇬🇧 Direct access to the `MTS.Calendar` instance / 🇪🇸 Acceso directo a la instancia `MTS.Calendar` |
| `ui.getCalendar()` | 🇬🇧 Returns the `MTS.Calendar` instance / 🇪🇸 Retorna la instancia `MTS.Calendar` |
| `ui.getEvents()` | 🇬🇧 Returns the current events array / 🇪🇸 Retorna el array de eventos actuales |
| `ui.openNewModal()` | 🇬🇧 Opens the new event modal programmatically / 🇪🇸 Abre el modal de nuevo evento programáticamente |
| `ui.openEditModal(event)` | 🇬🇧 Opens the edit modal for an event / 🇪🇸 Abre el modal de edición para un evento |
| `ui.openDetailModal(event)` | 🇬🇧 Opens the detail modal for an event / 🇪🇸 Abre el modal de detalle para un evento |
| `ui.addColor(id, hex, label)` | 🇬🇧 Adds a color to the color picker / 🇪🇸 Agrega un color al color picker |
| `ui.setEventTypes(types)` | 🇬🇧 Replaces the event type select options / 🇪🇸 Reemplaza los tipos de evento del select |

### Event types / Tipos de evento

🇬🇧 Default event types. Replace with `eventTypes` option or `ui.setEventTypes(types)`.
🇪🇸 Tipos de evento por defecto. Reemplaza con la opción `eventTypes` o `ui.setEventTypes(types)`.

```js
[
  { value: 'reunion',      label: 'Reunión'      },
  { value: 'tarea',        label: 'Tarea'        },
  { value: 'recordatorio', label: 'Recordatorio' },
  { value: 'demo',         label: 'Demo'         },
  { value: 'formacion',    label: 'Formación'    },
  { value: 'otro',         label: 'Otro'         },
]
```

---

## MTS.Calendar

🇬🇧 The calendar instance. Normally accessed via `ui.cal` after `await ui.init()`.
🇪🇸 La instancia del calendario. Normalmente se accede via `ui.cal` después de `await ui.init()`.

### calendarOptions

| Option / Opción | Type / Tipo | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|---|---|
| `view` | string | `'week'` | 🇬🇧 Initial view: `'week'`, `'month'`, `'day'`, `'schedule'` / 🇪🇸 Vista inicial |
| `views` | array | all 4 | 🇬🇧 Views available in toolbar / 🇪🇸 Vistas disponibles en el toolbar |
| `days` | array | `DAYS_MON_FRI` | 🇬🇧 Days of the week to show / 🇪🇸 Días de la semana a mostrar |
| `startTime` | string | `'08:00'` | 🇬🇧 Grid start time / 🇪🇸 Hora de inicio de la grilla |
| `endTime` | string | `'20:00'` | 🇬🇧 Grid end time / 🇪🇸 Hora de fin de la grilla |
| `slotSize` | number | `60` | 🇬🇧 Slot size in minutes / 🇪🇸 Tamaño del slot en minutos |
| `slots` | array | `null` | 🇬🇧 Custom slots. If defined, ignores `startTime`/`endTime`/`slotSize` / 🇪🇸 Slots personalizados. Si se define, ignora `startTime`/`endTime`/`slotSize` |
| `locale` | string | `'es'` | `'es'` · `'en'` |
| `draggable` | boolean | `true` | 🇬🇧 Allow drag & drop / 🇪🇸 Permite arrastrar eventos |
| `resizable` | boolean | `true` | 🇬🇧 Allow resize / 🇪🇸 Permite redimensionar eventos |
| `readonly` | boolean | `false` | 🇬🇧 Read-only mode — blocks all write interactions / 🇪🇸 Modo lectura — bloquea toda interacción de escritura |
| `allowOverlap` | boolean | `false` | 🇬🇧 Allow overlapping events / 🇪🇸 Permite solapar eventos |
| `showNowLine` | boolean | `true` | 🇬🇧 Show current time line / 🇪🇸 Muestra la línea de hora actual |
| `showTooltips` | boolean | `true` | 🇬🇧 Show event tooltips / 🇪🇸 Muestra tooltips en los eventos |
| `showMiniCal` | boolean | `false` | 🇬🇧 Show mini calendar in toolbar / 🇪🇸 Muestra el mini calendario en el toolbar |
| `snapMinutes` | number | `15` | 🇬🇧 Drag snap granularity (minutes) / 🇪🇸 Granularidad del snap al arrastrar (minutos) |
| `eventDensity` | string | `'comfortable'` | `'compact'` · `'comfortable'` · `'spacious'` |
| `maxMonthEvents` | number | `3` | 🇬🇧 Max visible events per day in month view / 🇪🇸 Máximo de eventos visibles por día en vista mes |
| `autoRefetch` | boolean | `true` | 🇬🇧 Reload datasource on navigation / 🇪🇸 Recarga el datasource al navegar |
| `datasource` | function | `null` | 🇬🇧 Async function to load events / 🇪🇸 Función async para cargar eventos |
| `datasourceParser` | function | `null` | 🇬🇧 Transform datasource response / 🇪🇸 Transformación de la respuesta del datasource |
| `docsPath` | string | `null` | 🇬🇧 Path to `.md` file. Shows "Ver docs" button in toolbar / 🇪🇸 Ruta al `.md`. Muestra el botón "Ver docs" en el toolbar |
| `debug` | boolean | `false` | 🇬🇧 Enable internal logs in browser console / 🇪🇸 Activa logs internos en la consola del navegador |

### Days constants / Constantes de días

```js
MTS.Calendar.DAYS_MON_FRI  // [1,2,3,4,5]     Mon–Fri  / Lun–Vie
MTS.Calendar.DAYS_MON_SAT  // [1,2,3,4,5,6]   Mon–Sat  / Lun–Sáb
MTS.Calendar.DAYS_MON_SUN  // [1,2,3,4,5,6,0] Mon–Sun  / Lun–Dom
MTS.Calendar.DAYS_SUN_SAT  // [0,1,2,3,4,5,6] Sun–Sat  / Dom–Sáb
```

### Public methods / Métodos públicos

| Method / Método | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|
| `cal.addEvent(event)` | 🇬🇧 Add an event / 🇪🇸 Agrega un evento |
| `cal.updateEvent(uid, fields)` | 🇬🇧 Update event fields by uid / 🇪🇸 Actualiza campos de un evento por uid |
| `cal.removeEvent(uid)` | 🇬🇧 Remove an event by uid / 🇪🇸 Elimina un evento por uid |
| `cal.getEvents()` | 🇬🇧 Returns a copy of the events array / 🇪🇸 Retorna una copia del array de eventos |
| `cal.setEvents(events)` | 🇬🇧 Replace all events / 🇪🇸 Reemplaza todos los eventos |
| `cal.getData(uid, field)` | 🇬🇧 Read a `data` field from an event / 🇪🇸 Lee un campo `data` de un evento |
| `cal.setView(view)` | 🇬🇧 Change the active view / 🇪🇸 Cambia la vista activa |
| `cal.today()` | 🇬🇧 Navigate to current period / 🇪🇸 Navega al período actual |
| `cal.prevWeek()` | 🇬🇧 Navigate to previous period / 🇪🇸 Navega al período anterior |
| `cal.nextWeek()` | 🇬🇧 Navigate to next period / 🇪🇸 Navega al período siguiente |
| `cal.goToOffset(n)` | 🇬🇧 Navigate to a specific offset from today / 🇪🇸 Navega a un offset específico desde hoy |
| `cal.refresh()` | 🇬🇧 Reload datasource and rerender / 🇪🇸 Recarga el datasource y rerenderiza |
| `cal.destroy()` | 🇬🇧 Destroy the calendar and clean the DOM / 🇪🇸 Destruye el calendario y limpia el DOM |
| `cal.exportCSV()` | 🇬🇧 Export visible events as CSV / 🇪🇸 Exporta los eventos visibles como CSV |
| `cal.exportICal()` | 🇬🇧 Export visible events as iCal / 🇪🇸 Exporta los eventos visibles como iCal |
| `cal.print()` | 🇬🇧 Open print window with full styles / 🇪🇸 Abre ventana de impresión con estilos completos |
| `cal.on(event, cb)` | 🇬🇧 Subscribe to a calendar event / 🇪🇸 Suscribe a un evento del calendario |
| `cal.off(event, cb)` | 🇬🇧 Unsubscribe from a calendar event / 🇪🇸 Desuscribe de un evento |

### Calendar events / Eventos del calendario

```js
cal.on('ready',          ({ detail }) => {});
cal.on('viewChange',     ({ detail }) => {}); // detail.view
cal.on('navigate',       ({ detail }) => {}); // detail.offset
cal.on('weekChange',     ({ detail }) => {}); // detail.dateStart, detail.dateEnd
cal.on('datasourceLoad', ({ detail }) => {}); // detail.events
cal.on('error',          ({ detail }) => {}); // detail.error
cal.on('eventClick',     ({ detail }) => {}); // detail.event
cal.on('eventDrop',      ({ detail }) => {}); // detail.event
cal.on('eventResizeEnd', ({ detail }) => {}); // detail.event
cal.on('moreDayClick',   ({ detail }) => {}); // detail.events, detail.date
```

---

## Datasource

🇬🇧 Async function called automatically when navigating. Receives the navigation context and must return an array of events in internal format.
🇪🇸 Función async que el calendario llama automáticamente al navegar. Recibe el contexto de navegación y debe retornar un array de eventos en formato interno.

```js
datasource: async (ctx) => {
  // ctx.dateStart — 'YYYY-MM-DD' 🇬🇧 first visible day / 🇪🇸 primer día visible
  // ctx.dateEnd   — 'YYYY-MM-DD' 🇬🇧 last visible day  / 🇪🇸 último día visible
  // ctx.view      — 'week' | 'month' | 'day' | 'schedule'
  // ctx.offset    — 🇬🇧 offset from today (0 = current period) / 🇪🇸 offset desde hoy (0 = período actual)

  const res = await fetch(`/api/events?start=${ctx.dateStart}&end=${ctx.dateEnd}`);
  const raw = await res.json();
  return raw.map(item => MTS.CalendarEvent.fromAPI(item, cal).toJSON());
},
```

🇬🇧 Date range requested by each view:
🇪🇸 Rango de fechas que pide cada vista:

- **week** — 🇬🇧 the 5, 6 or 7 days of the visible week / 🇪🇸 los 5, 6 o 7 días de la semana visible
- **month** — 🇬🇧 1st to last day of the month / 🇪🇸 del 1 al último día del mes
- **day** — 🇬🇧 the visible day only / 🇪🇸 solo el día visible
- **schedule** — 🇬🇧 30 days from current date / 🇪🇸 30 días desde la fecha actual

---

## MTS.CalendarEvent

🇬🇧 Class that converts API events to the internal format.
🇪🇸 Clase que convierte eventos de tu API al formato interno.

### fromAPI(raw, cal)

```js
// 🇬🇧 Convert a single event / 🇪🇸 Convertir un evento
const event = MTS.CalendarEvent.fromAPI(rawEvent, cal).toJSON();

// 🇬🇧 Convert a full array / 🇪🇸 Convertir un array completo
const events = rawEvents.map(e => MTS.CalendarEvent.fromAPI(e, cal).toJSON());
cal.setEvents(events);
```

🇬🇧 `fromAPI` automatically calculates from `startDate`, `startHour` and `endHour`:
🇪🇸 `fromAPI` calcula automáticamente a partir de `startDate`, `startHour` y `endHour`:

- `dayNumber` — 🇬🇧 JS day of week (0=Sun, 1=Mon ... 6=Sat) / 🇪🇸 día de la semana JS (0=Dom, 1=Lun ... 6=Sáb)
- `date` — 🇬🇧 ISO date string / 🇪🇸 fecha ISO del evento
- `startH`, `startM`, `endH`, `endM` — 🇬🇧 hours and minutes for vertical positioning / 🇪🇸 horas y minutos para posicionamiento vertical
- `moduleNumber`, `moduleCount` — 🇬🇧 slot position (only when calendar uses custom `slots`) / 🇪🇸 posición en slots (solo cuando el calendario usa `slots` personalizados)

---

## Views / Vistas

### Week / Semana (`week`)
🇬🇧 Time grid with the configured days. Supports drag & drop, resize and creation by clicking or dragging on an empty cell.
🇪🇸 Grilla horaria con los días configurados. Soporta drag & drop, resize y creación por clic o arrastre en una celda vacía.

### Month / Mes (`month`)
🇬🇧 Monthly grid. Days with more than `maxMonthEvents` (default 3) show "+N more" — clicking it opens a modal with all events for that day.
🇪🇸 Grilla mensual. Los días con más de `maxMonthEvents` (default 3) muestran "+N más" — al hacer clic abre un modal con todos los eventos del día.

### Day / Día (`day`)
🇬🇧 Same as week view but showing a single day.
🇪🇸 Igual que la vista semana pero con un solo día.

### Agenda / Agenda (`schedule`)
🇬🇧 Chronological list. Shows 30 days from today, only days with events (plus today). Continuous scroll — scrolling down reveals the following days.
🇪🇸 Lista cronológica. Muestra 30 días desde hoy, solo los días con eventos (más el día de hoy). Scroll continuo — al bajar van apareciendo los días siguientes.

---

## Locked and Readonly / Locked y Readonly

### Locked event / Evento locked

🇬🇧 An event with `locked: true` cannot be moved, edited or deleted. The detail modal shows a "read-only" notice. The Edit button is hidden.
🇪🇸 Un evento con `locked: true` no puede ser movido, editado ni eliminado. El modal de detalle muestra un aviso de solo lectura. El botón Editar no aparece.

```json
{ "uid": "holiday-001", "title": "National Holiday", "locked": true, "..." : "..." }
```

🇬🇧 Use it for: holidays, reserved blocks, confirmed events that must not be modified from the calendar.
🇪🇸 Úsalo para: feriados, bloques reservados, eventos confirmados que no deben modificarse desde el calendario.

### Readonly calendar / Calendario readonly

🇬🇧 Blocks all writing — no event can be created, moved, resized or deleted.
🇪🇸 Bloquea toda escritura — no se puede crear, mover, redimensionar ni eliminar ningún evento.

```js
calendarOptions: { readonly: true }
```

---

## Custom modals / Modales custom

🇬🇧 By default `MTS.CalendarUI` uses its own modals. You can replace them with your own HTML.
🇪🇸 Por defecto `MTS.CalendarUI` usa sus propios modales. Puedes reemplazarlos con tu propio HTML.

🇬🇧 Each `renderXXXModal` receives `(cal, event)` and must return a `Promise`:
🇪🇸 Cada `renderXXXModal` recibe `(cal, event)` y debe retornar una `Promise`:

- 🇬🇧 **Confirm** → return the modified event → `CalendarUI` calls `onEvent` automatically
- 🇪🇸 **Confirmar** → retornar el evento modificado → `CalendarUI` llama `onEvent` automáticamente
- 🇬🇧 **Cancel** → return `null` or `undefined` → `CalendarUI` does nothing
- 🇪🇸 **Cancelar** → retornar `null` o `undefined` → `CalendarUI` no hace nada

### Creation modal with custom HTML / Modal de creación con HTML propio

```js
const ui = new MTS.CalendarUI('#calendario', {

  renderNewEventModal: async (cal, event) => {
    // 🇬🇧 event has the clicked cell data: date, dayNumber, startH, endH
    // 🇪🇸 event tiene los datos de la celda clickeada: date, dayNumber, startH, endH

    return new Promise((resolve) => {
      const body = document.createElement('div');
      body.style.cssText = 'display:flex;flex-direction:column;gap:12px;';
      body.innerHTML = `
        <div>
          <label style="font-size:12px;font-weight:600">Título *</label>
          <input id="ev-titulo" style="width:100%;margin-top:4px;padding:8px;border:1px solid var(--mts-border-color);border-radius:6px;">
        </div>
        <div>
          <label style="font-size:12px;font-weight:600">Color</label>
          <input id="ev-color" type="color" value="#3b82f6" style="margin-top:4px;">
        </div>`;

      const modal = new MTS.Modal({
        title: 'Nuevo evento',
        size:  'sm',
        body,
        buttons: [
          { label: 'Cancelar', variant: 'ghost',
            onClick: () => { modal.hide(); resolve(null); } },
          { label: 'Crear', variant: 'primary',
            onClick: () => {
              const titulo = body.querySelector('#ev-titulo').value.trim();
              const color  = body.querySelector('#ev-color').value;
              if (!titulo) return;
              modal.hide();
              resolve({ ...event, title: titulo, color });
              // 🇬🇧 CalendarUI calls onEvent('create', result, cal) automatically
              // 🇪🇸 CalendarUI llama onEvent('create', resultado, cal) automáticamente
            },
          },
        ],
      });
      modal.show();
      setTimeout(() => body.querySelector('#ev-titulo')?.focus(), 100);
    });
  },

  onEvent: async (action, event, cal) => {
    if (action === 'create') {
      const res   = await fetch('/api/events', { method: 'POST', body: JSON.stringify(event) });
      const saved = await res.json();
      cal.addEvent({ ...event, uid: saved.id });
    }
  },
});
```

### Native confirm for delete / Confirm nativo para eliminar

```js
renderEventDeleteModal: async (cal, event) => {
  const ok = confirm(`¿Eliminar "${event.title}"?`);
  return ok ? event : null;
},
```

### Extended edit modal / Modal de edición extendido

```js
renderEventEditModal: async (cal, event) => {
  return new Promise((resolve) => {
    const body = document.createElement('div');
    body.style.cssText = 'display:flex;flex-direction:column;gap:12px;';

    const inputTitulo = document.createElement('input');
    inputTitulo.value = event.title || '';
    inputTitulo.placeholder = 'Título';
    inputTitulo.style.cssText = 'padding:8px;border:1px solid var(--mts-border-color);border-radius:6px;';

    const inputSala = document.createElement('input');
    inputSala.value = event.data?.sala || '';
    inputSala.placeholder = 'Sala o lugar';
    inputSala.style.cssText = 'padding:8px;border:1px solid var(--mts-border-color);border-radius:6px;';

    body.appendChild(inputTitulo);
    body.appendChild(inputSala);

    const modal = new MTS.Modal({
      title: 'Editar evento', size: 'sm', body,
      buttons: [
        { label: 'Cancelar', variant: 'ghost',
          onClick: () => { modal.hide(); resolve(null); } },
        { label: 'Guardar',  variant: 'primary',
          onClick: () => {
            modal.hide();
            resolve({ ...event,
              title: inputTitulo.value.trim(),
              data:  { ...event.data, sala: inputSala.value.trim() },
            });
          },
        },
      ],
    });
    modal.show();
  });
},
```

### Custom detail modal / Modal de detalle custom

```js
renderEventDetailModal: async (cal, event) => {
  return new Promise((resolve) => {
    const data = event.data || {};
    const pad  = n => String(n ?? 0).padStart(2, '0');
    const hora = event.startH != null
      ? `${pad(event.startH)}:${pad(event.startM ?? 0)} – ${pad(event.endH)}:${pad(event.endM ?? 0)}`
      : '';

    const body = document.createElement('div');
    body.style.cssText = 'display:flex;flex-direction:column;gap:10px;';
    body.innerHTML = `
      <div style="height:4px;border-radius:2px;background:${event.color || '#3b82f6'}"></div>
      <div style="font-size:15px;font-weight:700">${event.title}</div>
      ${hora              ? `<div style="font-size:13px;color:var(--mts-text-muted)">${hora}</div>` : ''}
      ${data.sala         ? `<div style="font-size:13px">📍 ${data.sala}</div>`                     : ''}
      ${event.description ? `<div style="font-size:13px">${event.description}</div>`               : ''}`;

    const modal = new MTS.Modal({
      title: event.title, size: 'sm', body,
      buttons: [
        { label: 'Cerrar', variant: 'ghost', onClick: () => { modal.hide(); resolve(null); } },
      ],
    });
    modal.show();
  });
},
```

---

## DevPanel

🇬🇧 Available in development mode. Activated with `?dev` in the URL or if the hostname is `localhost` / `127.0.0.1`.
🇪🇸 Disponible en modo desarrollo. Se activa con `?dev` en la URL o si el hostname es `localhost` / `127.0.0.1`.

```js
buildCalendar().then(() => initDevPanel());
```

🇬🇧 Panels:
🇪🇸 Paneles:

- **Config** — 🇬🇧 Adjust all options in real time / 🇪🇸 Ajusta todas las opciones en tiempo real
- **Log** — 🇬🇧 Event log: clicks, drops, resize, errors / 🇪🇸 Log de eventos: clicks, drops, resize, errores
- **Code** — 🇬🇧 Generated JS code with current config, ready to copy / 🇪🇸 Código JS generado con la configuración actual, listo para copiar

---

## Mock API

🇬🇧 The Service Worker `sw-calendar.js` intercepts requests and serves data from `mock-api/data/` without needing a real backend.
🇪🇸 El Service Worker `sw-calendar.js` intercepta las peticiones y sirve datos de `mock-api/data/` sin necesidad de un backend real.

### Activate / Activar

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw-calendar.js', { scope: './' });
  }
</script>
```

### Endpoints

| Endpoint | Method | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|---|
| `/widgets/calendar/mock-api/cal_events` | GET | 🇬🇧 Events. Accepts `?dateStart=YYYY-MM-DD&dateEnd=YYYY-MM-DD` / 🇪🇸 Eventos. Acepta `?dateStart=YYYY-MM-DD&dateEnd=YYYY-MM-DD` |
| `/widgets/calendar/mock-api/cal_events` | POST | 🇬🇧 Create event / 🇪🇸 Crear evento |
| `/widgets/calendar/mock-api/cal_events/:uid` | PUT | 🇬🇧 Update event / 🇪🇸 Actualizar evento |
| `/widgets/calendar/mock-api/cal_events/:uid` | DELETE | 🇬🇧 Delete event / 🇪🇸 Eliminar evento |
| `/widgets/calendar/mock-api/attendees` | GET | 🇬🇧 Participants for TagInput. Accepts `?q=text` / 🇪🇸 Participantes para TagInput. Acepta `?q=texto` |
| `/widgets/calendar/mock-api/meet_places` | GET | 🇬🇧 Rooms and places for Select. Accepts `?q=text` / 🇪🇸 Salas y lugares para Select. Acepta `?q=texto` |

🇬🇧 `mock-api/data/cal_events.json` contains 80 events between 2024 and 2028. **April 2026 has 35 events** — ideal for testing all views. Each event includes `locked: true` or `false`.
🇪🇸 `mock-api/data/cal_events.json` tiene 80 eventos entre 2024 y 2028. **Abril 2026 tiene 35 eventos** — ideal para probar todas las vistas. Cada evento incluye `locked: true` o `false`.

---

## Demo HTML

🇬🇧 For the calendar to fill the screen without the `body` interfering.
🇪🇸 Para que el calendario ocupe toda la pantalla sin que el `body` interfiera.

```html
<style>
  html, body { height: 100%; margin: 0; padding: 0; overflow: hidden; }
  #calendario { height: 100%; }
</style>
<body>
  <div id="calendario"></div>
  <div id="cal-docs-panel"></div>
</body>
```

🇬🇧 If your app has a fixed header, use `height: calc(100vh - HEADER_HEIGHT)` on `#calendario`.
🇪🇸 Si tu app tiene header fijo, usa `height: calc(100vh - ALTO_DEL_HEADER)` en `#calendario`.
