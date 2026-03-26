# matios-ui-timeline

Línea de tiempo vertical con alineación izquierda, derecha o alternada.

## Uso
```js
new MTS.Timeline('#timeline', {
  direction: 'vertical',     // 'vertical'|'horizontal'
  align:     'left',         // 'left'|'right'|'alternate'
  events: [
    {
      id:          'e1',
      title:       'Documento subido',
      description: 'archivo_contrato.pdf fue subido por Juan Pérez',
      date:        '25/03/2025 10:30',
      color:       '#1a7f4b',
      badge:       { label: 'Completado', variant: 'success' },
    },
    {
      id:    'e2',
      title: 'Revisión pendiente',
      date:  '24/03/2025 15:00',
      badge: { label: 'Pendiente', variant: 'warning' },
    },
  ],
  onEventClick: (event, idx) => console.log('Click en:', event.title),
})

timeline.addEvent({ id: 'e3', title: 'Nuevo evento', date: 'Ahora' })
timeline.setEvents([...])
```

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — vertical, alternate, badges, colores custom |
