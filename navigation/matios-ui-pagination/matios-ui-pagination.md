# MTS.Pagination

[EN] Full-featured pagination with page size selector, record summary, jump-to-page and size variants.
[ES] Paginación completa con selector de page size, resumen de registros, ir a página y variantes de tamaño.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-pagination.css">
<script src="matios-ui-pagination.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `total` | `number` | `0` | [EN] Total number of records / [ES] Total de registros |
| `page` | `number` | `1` | [EN] Current page (1-based) / [ES] Página actual (base 1) |
| `pageSize` | `number` | `10` | [EN] Records per page / [ES] Registros por página |
| `pageSizes` | `number[]` | `[10,25,50,100]` | [EN] Page size options / [ES] Opciones del selector |
| `showSizes` | `boolean` | `true` | [EN] Show page size selector / [ES] Mostrar selector de page size |
| `showInfo` | `boolean` | `true` | [EN] Show "Showing X-Y of Z" / [ES] Mostrar "Mostrando X-Y de Z" |
| `showJump` | `boolean` | `false` | [EN] Show jump-to-page input / [ES] Mostrar input para ir a página |
| `siblings` | `number` | `1` | [EN] Pages shown on each side of active / [ES] Páginas a cada lado del activo |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `onChange` | `function` | — | [EN] Fires when page or page size changes / [ES] Se dispara al cambiar la página o page size |

---

## Events / Eventos

```js
new MTS.Pagination('#my-pagination', {
  total: 250,
  // Fires when page or page size changes / Se dispara al cambiar la página o page size
  onChange: (e) => {
    console.log(e.detail.page);     // → 3
    console.log(e.detail.pageSize); // → 25
    console.log(e.detail.total);    // → 250
    console.log(e.detail.from);     // → 51
    console.log(e.detail.to);       // → 75
  },
});
```

---

## HTML Usage / Uso HTML

```html
<div id="my-pagination"
  data-total="250"
  data-page="1"
  data-page-size="25">
</div>

<script>
  new MTS.Pagination('#my-pagination', {
    onChange: (e) => fetchData(e.detail.page, e.detail.pageSize),
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic / Básico
const pag = new MTS.Pagination('#my-pagination', {
  total:    250,
  page:     1,
  pageSize: 25,
  // Fires on page or page size change / Se dispara al cambiar página o page size
  onChange: (e) => {
    fetchData({ page: e.detail.page, size: e.detail.pageSize });
  },
});

// Full options / Opciones completas
new MTS.Pagination('#pag-full', {
  total:      1000,
  page:       1,
  pageSize:   10,
  pageSizes:  [10, 25, 50, 100],
  showSizes:  true,   // page size selector / selector de page size
  showInfo:   true,   // "Showing 1-10 of 1000"
  showJump:   true,   // jump to page input / input para ir a página
  siblings:   2,      // pages on each side / páginas a cada lado
  size:       'md',   // 'sm' | 'md' | 'lg'
  onChange: (e) => console.log(e.detail),
});
```

---

## API

```js
const pag = new MTS.Pagination('#my-pagination', { ... });

// Navigate / Navegar
pag.setPage(3)

// Update total (resets to page 1) / Actualizar total (resetea a página 1)
pag.setTotal(500)

// Change page size (resets to page 1) / Cambiar page size (resetea a página 1)
pag.setPageSize(50)

// Get current state / Obtener estado actual
pag.getState()
// → { page: 3, pageSize: 25, total: 250, from: 51, to: 75 }
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-pagination')
  .addEventListener('mts:pagination:change', (e) => {
    console.log(e.detail.page, e.detail.pageSize);
  });
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingües, docs estandarizados |
| 1.0.0 | [EN] Initial release — page size, info, jump, siblings / [ES] Versión inicial |
