# MTS.Infinite

[EN] Infinite scroll with IntersectionObserver — vertical list, grid and table layouts. The component does not fetch data; the developer controls loading via `onLoadMore`.
[ES] Scroll infinito con IntersectionObserver — layouts vertical, grid y table. El componente no hace fetch; el desarrollador controla la carga via `onLoadMore`.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-infinite.css">
<script src="matios-ui-infinite.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `onLoadMore` | `function` | — | [EN] `async ({ page, pageSize }) => { items, hasMore }` **Required** / [ES] **Requerido** |
| `renderItem` | `function` | — | [EN] `(item, index) => HTMLString\|Element` Item renderer / [ES] Renderizador de ítems |
| `pageSize` | `number` | `20` | [EN] Items per load / [ES] Ítems por carga |
| `layout` | `string` | `'vertical'` | `'vertical'` · `'grid'` · `'table'` |
| `threshold` | `number` | `0.1` | [EN] IntersectionObserver threshold / [ES] Umbral del observer |
| `loaderText` | `string` | `'Cargando...'` | [EN] Loading text / [ES] Texto de carga |
| `endText` | `string` | `'No hay más resultados'` | [EN] End of data text / [ES] Texto al terminar |
| `animate` | `boolean` | `true` | [EN] Animate item entrance / [ES] Animar entrada de ítems |
| `emptyState` | `object` | `{ icon, title, message }` | [EN] Empty state config / [ES] Config del estado vacío |
| `onLoad` | `function` | — | [EN] `({ items, page }) => {}` Fires after each load / [ES] Se dispara tras cada carga |
| `onError` | `function` | — | [EN] `({ error }) => {}` Fires on load error / [ES] Se dispara al ocurrir un error |
| `onEnd` | `function` | — | [EN] `({ total }) => {}` Fires when all data is loaded / [ES] Se dispara al cargar todos los datos |

---

## Events / Eventos

```js
new MTS.Infinite('#my-list', {
  onLoadMore: async ({ page, pageSize }) => {
    const res = await fetch(`/api/items?page=${page}&size=${pageSize}`);
    const data = await res.json();
    return { items: data.items, hasMore: data.hasNext };
  },
  renderItem: (item) => `<div class="card">${item.title}</div>`,
  // Fires after each load / Se dispara tras cada carga
  onLoad: (e) => {
    console.log(e.detail.items);  // → loaded items
    console.log(e.detail.page);   // → page number loaded
  },
  // Fires when all data is loaded / Se dispara al no haber más datos
  onEnd: (e) => {
    console.log(e.detail.total);  // → total items loaded
  },
  // Fires on error / Se dispara al ocurrir un error
  onError: (e) => {
    console.error(e.detail.error);
    showErrorToast();
  },
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Vertical list (default) / Lista vertical
new MTS.Infinite('#my-list', {
  pageSize:   20,
  layout:     'vertical',
  onLoadMore: async ({ page, pageSize }) => {
    const data = await api.getUsers({ page, pageSize });
    return { items: data.users, hasMore: data.hasNext };
  },
  renderItem: (user, index) => `
    <div class="user-row">
      <span>#${index + 1}</span>
      <span>${user.name}</span>
      <span>${user.email}</span>
    </div>`,
  onLoad: (e) => console.log(`Loaded page ${e.detail.page}: ${e.detail.items.length} items`),
  onEnd:  (e) => console.log(`All done — ${e.detail.total} total items`),
});

// Grid layout / Layout grid
new MTS.Infinite('#my-grid', {
  layout:   'grid',
  pageSize: 12,
  onLoadMore: async ({ page, pageSize }) => {
    const data = await api.getProducts({ page, pageSize });
    return { items: data.items, hasMore: data.hasNext };
  },
  renderItem: (product) => `
    <div class="product-card">
      <img src="${product.image}">
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
    </div>`,
});
```

---

## API

```js
const list = new MTS.Infinite('#my-list', { onLoadMore: ..., renderItem: ... });

// Reset and reload from page 1 / Resetear y recargar desde página 1
list.reset()

// Load next page manually / Cargar siguiente página manualmente
list.loadMore()

// Register listeners / Registrar listeners
list.on('load',  (e) => console.log(e.detail.items))
list.on('end',   (e) => console.log(e.detail.total))
list.on('error', (e) => console.error(e.detail.error))
list.off('load', handler)

// Destroy / Destruir
list.destroy()
```

---

## DOM Events / Eventos DOM

```js
el.addEventListener('mts:infinite:load',  (e) => console.log(e.detail));
el.addEventListener('mts:infinite:end',   (e) => console.log(e.detail.total));
el.addEventListener('mts:infinite:error', (e) => console.error(e.detail.error));
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] `onLoad/onError/onEnd` normalized to `.on()`, bilingual docs / [ES] Normalizados a `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release — vertical/grid/table, IntersectionObserver / [ES] Versión inicial |
