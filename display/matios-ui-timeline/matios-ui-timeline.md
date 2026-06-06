# MTS.Timeline

Vertical or horizontal timeline with icons, badges, dates, colors and clickable events.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-timeline.css">
<script src="matios-ui-timeline.js"></script>
```

---

## Usage

```js
// Vertical left (default)
new MTS.Timeline('#my-timeline', {
  direction: 'vertical',
  align:     'left',
  events: [
    { id: 'deploy', title: 'Production deploy', description: 'v2.4.0 deployed successfully.', date: '2 min ago', badge: { label: 'Success', variant: 'success' } },
    { id: 'review', title: 'Code review',       description: 'PR #142 approved.',             date: '1 hour ago', color: '#7c3aed' },
    { id: 'commit', title: 'Commit pushed',     date: 'Yesterday' },
  ],
  onEventClick: function (e) { console.log(e.detail.event.id); },
});

// Alternating layout
new MTS.Timeline('#my-timeline', { align: 'alternate', events: [/* … */] });

// With custom icons
new MTS.Timeline('#my-timeline', {
  events: [{ title: 'Payment received', icon: '<svg>...</svg>', color: '#16a34a' }],
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

```js
const tl = new MTS.Timeline('#my-timeline', { events: [/* … */] });
tl.addEvent({ id: 'new', title: 'New event', date: 'Just now' });
tl.on('eventclick', function (e) { console.log(e.detail.event.id); });
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onEventClick(fn)` / `on('eventclick', fn)` | `{ event, index }` | An event item is clicked |

Also dispatched as a DOM event:

```js
document.getElementById('my-timeline')
  .addEventListener('mts:timeline:eventclick', function (e) { console.log(e.detail.event, e.detail.index); });
```

---

## Accessibility

- Each event title should be meaningful on its own; the dot color and icon are decorative.
- For a horizontal timeline, ensure the container is scrollable/focusable when content overflows.

---

## Changelog

### Initial
- Timeline with vertical/horizontal direction, left/right/alternate alignment, per-event icon/color/badge/date,
  clickable events (`onEventClick`), and `setEvents` / `addEvent`.
