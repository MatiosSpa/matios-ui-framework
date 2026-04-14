# MTS.Paging

[EN] Standalone pagination component with page size selector, info text, edge buttons and server response integration. Designed to integrate with MTS.DataTable.
[ES] Componente de paginación standalone con selector de tamaño de página, texto informativo, botones de borde e integración con respuesta del servidor. Diseñado para integrarse con MTS.DataTable.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-paging.css">
<script src="matios-ui-paging.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `total` | `number` | `0` | [EN] Total record count / [ES] Total de registros |
| `page` | `number` | `1` | [EN] Current page (1-based) / [ES] Página actual (base 1) |
| `pageSize` | `number` | `10` | [EN] Records per page / [ES] Registros por página |
| `pageSizes` | `number[]` | `[10,25,50,100]` | [EN] Page size options / [ES] Opciones de tamaño de página |
| `maxVisible` | `number` | `5` | [EN] Max visible page buttons / [ES] Máx botones de página visibles |
| `showInfo` | `boolean` | `true` | [EN] Show "Showing 1-10 of 150" / [ES] Mostrar "Mostrando 1-10 de 150" |
| `showPageSize` | `boolean` | `true` | [EN] Show page size selector / [ES] Mostrar selector de tamaño |
| `showEdges` | `boolean` | `true` | [EN] Always show first/last page / [ES] Mostrar siempre primera/última página |
| `variant` | `string` | `'primary'` | `'primary'` · `'secondary'` · `'ghost'` |
| `size` | `string` | `''` | `''` · `'sm'` · `'lg'` |
| `onChange` | `function` | — | [EN] `({ page, pageSize }) => {}` Any change / [ES] Cualquier cambio |
| `onNext` | `function` | — | [EN] `({ page }) => {}` Next page / [ES] Página siguiente |
| `onPrev` | `function` | — | [EN] `({ page }) => {}` Previous page / [ES] Página anterior |
| `onPageClick` | `function` | — | [EN] `({ page }) => {}` Page number click / [ES] Click en número de página |
| `onPageSizeChange` | `function` | — | [EN] `({ pageSize }) => {}` Size changed / [ES] Tamaño de página cambiado |

---

## Events / Eventos

```js
const pager = new MTS.Paging('#my-pager', {
  total:    150,
  page:     1,
  pageSize: 10,
  // Fires on any page/size change — most common / Se dispara en cualquier cambio
  onChange: (e) => {
    console.log(e.detail.page);     // → 2
    console.log(e.detail.pageSize); // → 10
    loadPage(e.detail.page, e.detail.pageSize);
  },
  // Fires specifically on next / Se dispara específicamente al avanzar
  onNext: (e) => console.log('next:', e.detail.page),
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic / Básico
const pager = new MTS.Paging('#my-pager', {
  total:    150,
  page:     1,
  pageSize: 10,
  onChange: (e) => loadData(e.detail.page, e.detail.pageSize),
});

// Full config / Configuración completa
new MTS.Paging('#my-pager', {
  total:        500,
  page:         1,
  pageSize:     25,
  pageSizes:    [10, 25, 50, 100],
  maxVisible:   7,
  showInfo:     true,
  showPageSize: true,
  showEdges:    true,
  variant:      'primary',
  size:         '',
  onChange:        (e) => fetchData(e.detail.page, e.detail.pageSize),
  onPageSizeChange:(e) => console.log('size:', e.detail.pageSize),
});
```

---

## Server Response / Respuesta del servidor

```js
const pager = new MTS.Paging('#my-pager', {
  total:    0,
  onChange: (e) => fetchAndUpdate(e.detail.page, e.detail.pageSize),
});

async function fetchAndUpdate(page, pageSize) {
  const res = await fetch(`/api/users?page=${page}&pageSize=${pageSize}`);
  const data = await res.json();

  // Feed server response directly / Pasar respuesta del servidor directamente
  pager.setResponse({
    page:       data.page,
    pageSize:   data.pageSize,
    total:      data.total,
    totalPages: data.totalPages,
    hasNext:    data.hasNext,
    hasPrev:    data.hasPrev,
  });
}
```

---

## API

```js
const pager = new MTS.Paging('#my-pager', { total: 150 });

// Navigate / Navegar
pager.setPage(3)
pager.next()
pager.prev()

// Update config / Actualizar configuración
pager.setTotal(200)
pager.setPageSize(25)

// Feed server response / Pasar respuesta del servidor
pager.setResponse({ page, pageSize, total, totalPages, hasNext, hasPrev })

// Get current state / Obtener estado actual
pager.getState()
// → { page: 2, pageSize: 10, total: 150, totalPages: 15 }

// Register listeners / Registrar listeners
pager.on('change',        (e) => console.log(e.detail))
pager.on('next',          (e) => console.log(e.detail.page))
pager.on('prev',          (e) => console.log(e.detail.page))
pager.on('pageClick',     (e) => console.log(e.detail.page))
pager.on('pageSizeChange',(e) => console.log(e.detail.pageSize))
pager.off('change', handler)
```

---

## DOM Events / Eventos DOM

```js
el.addEventListener('mts:paging:change',        (e) => console.log(e.detail));
el.addEventListener('mts:paging:next',           (e) => console.log(e.detail.page));
el.addEventListener('mts:paging:prev',           (e) => console.log(e.detail.page));
el.addEventListener('mts:paging:pageClick',      (e) => console.log(e.detail.page));
el.addEventListener('mts:paging:pageSizeChange', (e) => console.log(e.detail.pageSize));
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] All callbacks normalized to `.on()`, bilingual docs / [ES] Todos los callbacks normalizados a `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release / [ES] Versión inicial |
