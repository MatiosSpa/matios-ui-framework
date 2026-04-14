# MTS.Timeline

[EN] Vertical or horizontal timeline with icons, badges, dates, colors and clickable events.
[ES] Línea de tiempo vertical u horizontal con íconos, badges, fechas, colores y eventos clickeables.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-timeline.css">
<script src="matios-ui-timeline.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `events` | `array` | `[]` | [EN] Timeline event items (see schema) / [ES] Ítems de eventos |
| `direction` | `string` | `'vertical'` | `'vertical'` · `'horizontal'` |
| `align` | `string` | `'left'` | `'left'` · `'right'` · `'alternate'` (vertical only) |
| `onEventClick` | `function` | — | [EN] `({ event, index }) => {}` Fires on item click / [ES] Se dispara al hacer click en un ítem |

### Event schema / Esquema de evento

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | [EN] Unique identifier / [ES] Identificador único |
| `title` | `string` | [EN] Event title (required) / [ES] Título del evento (requerido) |
| `description` | `string` | [EN] Body text / [ES] Texto del cuerpo |
| `date` | `string` | [EN] Date label / [ES] Etiqueta de fecha |
| `icon` | `string` | [EN] SVG icon HTML / [ES] HTML del ícono SVG |
| `color` | `string` | [EN] Dot color / [ES] Color del punto |
| `badge` | `object` | `{ label, variant }` |

---

## Events / Eventos

```js
new MTS.Timeline('#my-timeline', {
  events: [...],
  // Fires when an event item is clicked / Se dispara al hacer click en un ítem
  onEventClick: (e) => {
    console.log(e.detail.event); // → { id, title, date, ... }
    console.log(e.detail.index); // → 2
  },
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Vertical left (default) / Vertical izquierda (default)
new MTS.Timeline('#my-timeline', {
  direction: 'vertical',
  align:     'left',
  events: [
    {
      id:          'deploy',
      title:       'Production deploy',
      description: 'v2.4.0 deployed successfully.',
      date:        '2 min ago',
      badge:       { label: 'Success', variant: 'success' },
    },
    {
      id:          'review',
      title:       'Code review',
      description: 'PR #142 approved.',
      date:        '1 hour ago',
      color:       '#7c3aed',
    },
    {
      id:    'commit',
      title: 'Commit pushed',
      date:  'Yesterday',
    },
  ],
  onEventClick: (e) => console.log(e.detail.event.id),
});

// Alternating layout / Layout alternado
new MTS.Timeline('#my-timeline', {
  align: 'alternate',
  events: [...],
});

// With custom icons / Con íconos personalizados
new MTS.Timeline('#my-timeline', {
  events: [
    {
      title: 'Payment received',
      icon:  '<svg>...</svg>',
      color: '#16a34a',
    },
  ],
});
```

---

## API

```js
const tl = new MTS.Timeline('#my-timeline', { events: [...] });

// Replace all events / Reemplazar todos los eventos
tl.setEvents([...])

// Add one event and re-render / Agregar un evento y re-renderizar
tl.addEvent({ id: 'new', title: 'New event', date: 'Just now' })

// Register / remove listeners / Registrar / eliminar listeners
tl.on('eventclick', (e) => console.log(e.detail.event.id))
tl.off('eventclick', handler)
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-timeline')
  .addEventListener('mts:timeline:eventclick', (e) => {
    console.log(e.detail.event, e.detail.index);
  });
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] `onEventClick` normalized to `.on()`, bilingual docs / [ES] Normalizado a `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release — vertical/horizontal, alternate, icons, badges / [ES] Versión inicial |
