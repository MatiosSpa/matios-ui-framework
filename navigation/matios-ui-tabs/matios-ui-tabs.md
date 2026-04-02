# matios-ui-tabs

Pestañas horizontal/vertical en 3 variantes: underline, pill y card.

---

## Instalación
```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-tabs.css">
<script src="matios-ui-tabs.js"></script>
```

---

## Uso rápido
```js
const tabs = new MTS.Tabs('#mis-tabs', {
  variant:   'underline',    // 'underline'|'pill'|'card'
  direction: 'horizontal',   // 'horizontal'|'vertical'
  active:    'tab1',
  tabs: [
    { id: 'tab1', label: 'General',    content: '<p>Contenido 1</p>' },
    { id: 'tab2', label: 'Seguridad',  content: '<p>Contenido 2</p>' },
    { id: 'tab3', label: 'Reportes',   content: () => miDiv, disabled: true },
    { id: 'tab4', label: 'Alertas',    content: '<p>...</p>', badge: 3 },
  ],
  onChange: (e) => console.log('Tab activa:', e.detail.id),
})
```

---

## Opciones completas

```js
new MTS.Tabs('#el', {
  // — Apariencia —
  variant:     'underline',   // 'underline' | 'pill' | 'card'
  direction:   'horizontal',  // 'horizontal' | 'vertical'
  active:      'tab1',        // id de la pestaña activa inicial

  // — Borde —
  border:      true,          // mostrar/ocultar el borde de separación nav/panel
  borderWidth: '2px',         // grosor del borde (cualquier valor CSS)

  // — Alto del panel —
  height:      'auto',        // 'auto' | 'stretch' | '300px' | '50vh' | etc.
  stretch:     false,         // alias de height:'stretch' — ocupa todo el espacio disponible

  // — Vertical —
  navWidth:    null,          // ancho del nav en vertical, ej: '200px'

  // — Comportamiento —
  lazy:        true,          // renderizar contenido solo al activar la pestaña
})
```

---

## Alto del panel

```js
// Auto (default) — se ajusta al contenido
new MTS.Tabs('#t1', { height: 'auto' })

// Alto fijo — con scroll interno
new MTS.Tabs('#t2', { height: '300px' })
new MTS.Tabs('#t3', { height: '50vh' })

// Stretch — ocupa todo el espacio disponible hasta el borde de la pantalla
// Requiere que el contenedor padre tenga height definido
new MTS.Tabs('#t4', { height: 'stretch' })
new MTS.Tabs('#t5', { stretch: true })   // alias
```

---

## Borde

```js
// Sin borde de separación
new MTS.Tabs('#t1', { border: false })

// Borde delgado (1px)
new MTS.Tabs('#t2', { borderWidth: '1px' })

// Borde grueso (3px)
new MTS.Tabs('#t3', { borderWidth: '3px' })
```

---

## Vertical

```js
new MTS.Tabs('#t1', {
  direction:   'vertical',
  navWidth:    '180px',    // ancho del sidebar de tabs
  borderWidth: '2px',      // grosor del borde izquierdo del panel
  height:      'stretch',  // ocupa todo el alto disponible
})
```

---

## API
```js
tabs.setActive('tab2')
tabs.addTab({ id: 'nuevo', label: 'Nuevo', content: '...' })
tabs.removeTab('tab3')
```

---

## Eventos DOM
| Evento | Namespace | Detail |
|--------|-----------|--------|
| `change` | `mts:tabs:change` | `{ id, tab }` |

---

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.1.0 | Opciones `border`, `borderWidth`, `height`, `stretch`, `navWidth`. Fix borde izquierdo vertical |
| 1.0.0 | Release inicial — underline, pill, card, horizontal, vertical, lazy load, badges |
