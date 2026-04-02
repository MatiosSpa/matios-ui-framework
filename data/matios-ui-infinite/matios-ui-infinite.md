# matios-ui-infinite

Scroll infinito con `IntersectionObserver`. El componente **no hace fetch** — el dev controla los datos a través de `onLoadMore`.

---

## Instalación
```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-infinite.css">
<script src="matios-ui-infinite.js"></script>
```

---

## Uso rápido

```js
const lista = new MTS.Infinite('#mi-lista', {
  onLoadMore: async ({ page, pageSize }) => {
    const res = await fetch(`/api/usuarios?page=${page}&pageSize=${pageSize}`)
    const data = await res.json()
    return {
      items:   data.items,    // array de items
      hasMore: data.hasNext,  // hay más datos?
    }
  },
  renderItem: (item) => `
    <div>
      <strong>${item.nombre}</strong>
      <span>${item.email}</span>
    </div>
  `,
})
```

---

## Configuración completa

```js
new MTS.Infinite('#lista', {

  // — Datos (requerido) —
  onLoadMore: async ({ page, pageSize }) => {
    // El dev hace el fetch que quiera
    const res = await fetch(`/api/items?page=${page}&pageSize=${pageSize}`)
    const data = await res.json()

    return {
      items:   data.items,      // array — requerido
      hasMore: data.hasMore,    // boolean — si false, detiene el scroll
    }
    // También acepta retornar el array directamente:
    // return data.items  ← hasMore se calcula como items.length >= pageSize
  },

  // — Render —
  renderItem: (item, index) => {
    // Puede retornar un string HTML
    return `<div class="mi-card">${item.titulo}</div>`

    // O un elemento DOM
    const el = document.createElement('div')
    el.textContent = item.titulo
    return el
  },

  // — Configuración —
  pageSize:   20,             // registros por carga
  layout:    'vertical',     // 'vertical' | 'grid' | 'table'
  threshold:  0.1,           // sensibilidad del IntersectionObserver (0-1)
  animate:    true,          // animar entrada de items

  // — Textos —
  loaderText: 'Cargando...',
  endText:    'No hay más resultados',

  // — Estado vacío —
  emptyState: {
    icon:    '📭',
    title:   'Sin resultados',
    message: 'No se encontraron items para mostrar',
  },

  // — Callbacks —
  onLoad:  (items, page) => console.log(`Cargada página ${page}, ${items.length} items`),
  onError: (error)       => console.error('Error:', error),
  onEnd:   ()            => console.log('Fin de la lista'),
})
```

---

## Layouts

### Vertical (default)
Items apilados uno debajo del otro.
```js
new MTS.Infinite('#lista', { layout: 'vertical', ... })
```

### Grid
Grid responsivo con columnas automáticas.
```js
new MTS.Infinite('#lista', { layout: 'grid', ... })
```

### Table
El dev renderiza una `<table>` completa dentro del contenedor.
```js
new MTS.Infinite('#tabla-wrap', {
  layout: 'table',
  renderItem: (item) => `<tr><td>${item.nombre}</td><td>${item.email}</td></tr>`,
})
```
> En modo table, el dev es responsable de generar el `<table>` y `<thead>` fuera del componente.

---

## API

```js
const lista = new MTS.Infinite('#lista', config)

lista.reset()              // Vacía la lista y recarga desde página 1
lista.appendItems([...])   // Agrega items manualmente
lista.getCount()           // → número total de items cargados
lista.pause()              // Pausa el IntersectionObserver
lista.resume()             // Reanuda el IntersectionObserver
lista.destroy()            // Destruye la instancia y limpia el DOM

// Eventos
lista.on('load',  ({ detail }) => console.log(detail.items, detail.page))
lista.on('end',   ({ detail }) => console.log('Total:', detail.total))
lista.on('error', ({ detail }) => console.error(detail.error))
```

---

## Eventos DOM

```js
document.getElementById('lista')
  .addEventListener('mts:infinite:load', (e) => {
    console.log('items:', e.detail.items)
    console.log('página:', e.detail.page)
    console.log('total cargado:', e.detail.total)
  })
```

| Evento | Namespace DOM | Detail |
|--------|---------------|--------|
| `load`  | `mts:infinite:load`  | `{ items, page, total }` |
| `end`   | `mts:infinite:end`   | `{ total }` |
| `error` | `mts:infinite:error` | `{ error }` |

---

## Ejemplo con búsqueda

```js
let query = ''

const lista = new MTS.Infinite('#resultados', {
  onLoadMore: async ({ page, pageSize }) => {
    const res = await fetch(`/api/buscar?q=${query}&page=${page}&pageSize=${pageSize}`)
    const data = await res.json()
    return { items: data.results, hasMore: data.hasNext }
  },
  renderItem: (item) => `<div class="mts-surface">${item.titulo}</div>`,
})

// Al cambiar el buscador, resetear la lista
document.getElementById('buscador').addEventListener('input', (e) => {
  query = e.target.value
  lista.reset()
})
```

---

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — IntersectionObserver, layouts, estados, sin fetch interno |
