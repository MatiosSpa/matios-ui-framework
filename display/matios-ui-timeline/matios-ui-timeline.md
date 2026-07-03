# MTS.Timeline

Vertical or horizontal timeline with icons, badges, dates, colors and clickable events.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-timeline.css">
<script src="matios-ui-timeline.js"></script>
```

Optional dependencies:

- **`matios-ui-sanitize.js`** — if loaded, the `icon` and `description` HTML is passed through
  `MTS.Sanitize.html()`. When absent, that HTML is inserted as-is.
- **`matios-ui-badge.css`** — required to style the per-event `badge` (the component emits
  `mts-badge` markup; it does not instantiate `MTS.Badge`).

---

## Usage

```js
// Vertical left (default)
new MTS.Timeline('#my-timeline', {
  direction: 'vertical',
  align: 'left',
  events: [
    { title: 'Order charged', date: 'Today',      description: '$248.00 charged.' },
    { title: 'Order shipped', date: 'Yesterday',  description: 'Tracking #9X4712.' },
    { title: 'Order placed',  date: '3 days ago', description: '3 items.' }
  ],
  onEventClick: function (e) { console.log(e.detail.event, e.detail.index); }
});

// Alternating layout
new MTS.Timeline('#my-timeline', {
  align: 'alternate',
  events: [/* … */]
});

// With a badge, a colored dot and a custom icon
new MTS.Timeline('#my-timeline', {
  events: [
    { title: 'Production deploy', date: '2 min ago', badge: { label: 'Success', variant: 'success' } },
    { title: 'Payment received',  color: '#16a34a', icon: '<svg>...</svg>' }
  ]
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `events` | `array` | `[]` | Timeline event items (see schema below) |
| `direction` | `string` | `'vertical'` | `'vertical'` · `'horizontal'` |
| `align` | `string` | `'left'` | `'left'` · `'right'` · `'alternate'` (vertical only) |
| `onEventClick` | `function` | — | Fires on item click — `({ event, index })` |

### Event schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `title` | `string` | Event title (**required**) |
| `description` | `string` | Body text |
| `date` | `string` | Date label |
| `icon` | `string` | SVG icon HTML |
| `color` | `string` | Dot color |
| `badge` | `object` | `{ label, variant }` |

---

## API

| Method | Description |
|--------|-------------|
| `setEvents(array)` | Replace all events |
| `addEvent(event)` | Add one event and re-render |
| `on(event, cb)` / `off(event, cb)` | Register / remove listeners (`'eventclick'`) |

Every method returns the instance, so calls can be chained.

```js
const tl = new MTS.Timeline('#my-timeline', { events: [/* … */] });
tl.addEvent({ title: 'New event', date: 'Just now' });
tl.on('eventclick', function (e) { console.log(e.detail.event, e.detail.index); });
```

---

## Events

| Event | Payload | When |
|-------|---------|------|
| `eventclick` | `{ event, index }` | An event item is clicked |

Items are only made clickable when an `eventclick` listener is registered (via the `onEventClick`
option or `on('eventclick', fn)`). Listener callbacks receive `{ type, detail }`, where `detail`
carries `{ event, index }`.

The same event is also dispatched as a bubbling DOM `CustomEvent` named `mts:timeline:eventclick`,
whose `detail` is `{ event, index }`:

```js
document.getElementById('my-timeline')
  .addEventListener('mts:timeline:eventclick', function (e) { console.log(e.detail.event, e.detail.index); });
```

---

## i18n

The component renders no chrome text of its own — every visible string (titles, dates, descriptions,
badge labels) comes from the `events` you supply, so there is nothing for the component to localize.
Provide already-localized `events` for the active language.

The global language API (`MTS.setLanguage` / `MTS.getLanguage` / `MTS.getString`) still applies to the
surrounding page and to shared components (such as `MTS.Badge`). There is no per-instance `locale` option.

---

## Accessibility

- Each event title should be meaningful on its own; the dot color and icon are decorative.
- For a horizontal timeline, ensure the container is scrollable/focusable when content overflows.
