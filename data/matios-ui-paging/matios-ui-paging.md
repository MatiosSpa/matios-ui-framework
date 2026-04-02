# matios-ui-paging

Componente de paginación standalone. Recibe los datos de la respuesta del servidor y dibuja los controles automáticamente.

---

## Instalación

```html
<link rel="stylesheet" href="../base/matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-paging/matios-ui-paging.css">
<script src="matios-ui-paging/matios-ui-paging.js"></script>
```

---

## Uso rápido

```js
const pager = new MTS.Paging('#paginacion', {
  total:    150,
  page:     1,
  pageSize: 10,
  onChange: (page, pageSize) => {
    cargarDatos(page, pageSize);
  },
})
```

---

## Con respuesta del servidor

```js
const res = await fetch('/api/v1/usuarios?page=1&pageSize=10');
const data = await res.json();

// data = { items:[...], page:1, pageSize:10, total:150,
//          totalPages:15, hasNext:true, hasPrev:false }

pager.setResponse(data);
```

Campos que acepta `setResponse()`:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `page` | number | Página actual |
| `pageSize` | number | Registros por página |
| `total` | number | Total de registros |
| `totalPages` | number | Total de páginas |
| `hasNext` / `hasnext` | boolean | Hay página siguiente |
| `hasPrev` / `haspreview` | boolean | Hay página anterior |
| `from` | number | Registro inicial de la página |
| `to` | number | Registro final de la página |

---

## Configuración completa

```js
new MTS.Paging('#paginacion', {

  // — Estado inicial —
  total:    100,          // total de registros
  page:     1,            // página actual (1-based)
  pageSize: 10,           // registros por página

  // — Apariencia —
  variant:      'primary',        // 'primary'|'secondary'|'ghost'|'custom'
  showInfo:     true,             // mostrar "Mostrando 1–10 de 100"
  showPageSize: true,             // selector de registros por página
  pageSizes:    [10, 25, 50, 100], // opciones de pageSize
  maxVisible:   5,                // máximo de páginas visibles (el resto se colapsa con ...)
  showEdges:    true,             // siempre mostrar primera y última página

  // — Callbacks —
  onChange:         (page, pageSize) => { cargarDatos(page, pageSize); },
  onNext:           (page) => console.log('siguiente:', page),
  onPrev:           (page) => console.log('anterior:', page),
  onPageClick:      (page) => console.log('click página:', page),
  onPageSizeChange: (ps)   => console.log('pageSize:', ps),
})
```

---

## API

```js
const pager = new MTS.Paging('#paginacion', config)

// Navegación
pager.next()               // ir a la siguiente página
pager.prev()               // ir a la anterior
pager.setPage(5)           // ir a página 5

// Datos
pager.setTotal(200)        // actualizar total de registros
pager.setPageSize(25)      // cambiar pageSize (resetea a página 1)
pager.setResponse({ page:2, total:200, hasNext:true })

// Estado
pager.getState()           // → { page, pageSize, total, totalPages, hasNext, hasPrev, from, to }
```

---

## Variantes visuales

```js
// Primary (default) — botón activo azul
new MTS.Paging('#p1', { variant: 'primary' })

// Secondary — botón activo con fondo surface
new MTS.Paging('#p2', { variant: 'secondary' })

// Ghost — sin bordes, activo con fondo sutil
new MTS.Paging('#p3', { variant: 'ghost' })

// Custom — usa variables CSS propias
new MTS.Paging('#p4', { variant: 'custom' })
// + CSS:
// #p4 { --mts-paging-active-bg: #ff5500; --mts-paging-active-color: #fff; }
```

---

## Eventos DOM

```js
document.getElementById('paginacion')
  .addEventListener('mts:paging:change', (e) => {
    console.log('página:', e.detail.page, 'pageSize:', e.detail.pageSize);
  });

// Eventos disponibles:
// mts:paging:change      → { page, pageSize }
// mts:paging:next        → { page }
// mts:paging:prev        → { page }
// mts:paging:pageClick   → { page }
// mts:paging:pageSizeChange → { pageSize }
```

---

## Integración con DataTable

```js
const tabla = new MTS.DataTable('#tabla', {
  columns: [...],
  datasource: { url: '/api/usuarios', method: 'GET' },
  paginate: false,   // desactivar paginación interna
});

const pager = new MTS.Paging('#paginacion', {
  pageSize: 10,
  onChange: async (page, pageSize) => {
    const res = await fetch(`/api/usuarios?page=${page}&pageSize=${pageSize}`);
    const data = await res.json();
    tabla.setData(data.items);
    pager.setResponse(data);
  },
});

// Carga inicial
pager._onChange?.(1, 10);
```

---

## Changelog

| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — 4 variantes, setResponse(), eventos DOM, ... colapsables |
