# matios-ui-tabs

Pestañas horizontal/vertical en 3 variantes: underline, pill y card.

## Instalación
```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-tabs.css">
<script src="matios-ui-tabs.js"></script>
```

## Uso rápido
```js
const tabs = new MTS.Tabs('#mis-tabs', {
  variant:   'underline',    // 'underline'|'pill'|'card'
  direction: 'horizontal',   // 'horizontal'|'vertical'
  active:    'tab1',
  tabs: [
    { id: 'tab1', label: 'Secciones',   content: '<p>Contenido 1</p>' },
    { id: 'tab2', label: 'Docentes',    content: '<p>Contenido 2</p>' },
    { id: 'tab3', label: 'Reportes',    content: () => document.getElementById('mi-div'), disabled: true },
    { id: 'tab4', label: 'Notificaciones', content: '<p>...</p>', badge: 3 },
  ],
  onChange: (e) => console.log('Tab activa:', e.detail.id),
})
```

## API
```js
tabs.setActive('tab2')
tabs.addTab({ id: 'nuevo', label: 'Nuevo', content: '...' })
tabs.removeTab('tab3')
```

## Eventos DOM
| Evento | Namespace |
|--------|-----------|
| `change` | `mts:tabs:change` |

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — underline, pill, card, horizontal, vertical, lazy load, badges |
