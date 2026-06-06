# MTS.Infinite

Infinite scroll with IntersectionObserver — vertical, grid and table layouts. The component does not fetch; the developer controls loading via `onLoadMore`.

---

## Installation

```html
<link rel="stylesheet" href="data/matios-ui-infinite/matios-ui-infinite.css">
<script src="data/matios-ui-infinite/matios-ui-infinite.js"></script>
```

---

## Usage

```js
new MTS.Infinite('#my-list', {
  onLoadMore: async function (opts) {
    const res  = await fetch('/api/items?page=' + opts.page + '&size=' + opts.pageSize);
    const data = await res.json();
    return { items: data.items, hasMore: data.hasNext };
  },
  renderItem: function (item) { return '<div class="card">' + item.title + '</div>'; },
});

// Grid layout with callbacks
new MTS.Infinite('#my-grid', {
  layout:   'grid',
  pageSize: 12,
  onLoadMore: async function (opts) {
    const data = await api.getProducts({ page: opts.page, pageSize: opts.pageSize });
    return { items: data.items, hasMore: data.hasNext };
  },
  renderItem: function (product) {
    return '<div class="product-card"><h3>' + product.name + '</h3><p>$' + product.price + '</p></div>';
  },
  onLoad:  function (e) { console.log('Page ' + e.detail.page + ': ' + e.detail.items.length + ' items'); },
  onEnd:   function (e) { console.log('Total: ' + e.detail.total); },
  onError: function (e) { console.error(e.detail.error); },
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onLoadMore` | `function` | — | `async ({ page, pageSize }) → { items, hasMore }`. **Required** |
| `renderItem` | `function` | — | `(item, index) → HTMLString \| Element`. Item renderer |
| `pageSize` | `number` | `20` | Items per load |
| `layout` | `string` | `'vertical'` | `'vertical'` · `'grid'` · `'table'` |
| `threshold` | `number` | `0.1` | IntersectionObserver threshold |
| `loaderText` | `string` | localized | Text while loading |
| `endText` | `string` | localized | Text when the list ends |
| `animate` | `boolean` | `true` | Animate item entrance |
| `emptyState` | `object` | `{ icon, title, message }` | Empty-state configuration |
| `onLoad` | `function` | — | `({ items, page })` — fires after each load |
| `onError` | `function` | — | `({ error })` — fires on error |
| `onEnd` | `function` | — | `({ total })` — fires when all data is loaded |

---

## API

| Method | Description |
|--------|-------------|
| `reset()` | Reset and reload from page 1 |
| `loadMore()` | Load the next page manually |
| `on(event, fn)` / `off(event, fn)` | Listen to `'load'` / `'end'` / `'error'` |
| `destroy()` | Disconnect the observer and clear the DOM |

```js
const list = new MTS.Infinite('#my-list', { onLoadMore: async function (o) { /* … */ }, renderItem: function (i) { /* … */ } });
list.on('load', function (e) { console.log(e.detail.items); });
list.loadMore();
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onLoad` | `mts:infinite:load` | `{ items, page }` |
| `onEnd` | `mts:infinite:end` | `{ total }` |
| `onError` | `mts:infinite:error` | `{ error }` |

```js
el.addEventListener('mts:infinite:load', function (e) { console.log(e.detail); });
```

---

## Notes

- `onLoadMore` should always resolve to `{ items: [], hasMore: false }`; if it rejects, the component fires `onError` automatically.
- `renderItem` may return an HTML string or a DOM `Element`. Sanitize user-supplied HTML with `MTS.Sanitize.html()` first.
- `layout: 'table'` expects the container to be a `<tbody>`; `layout: 'grid'` applies CSS grid to the container.
- The observer disconnects automatically when `hasMore` is `false`.

---

## Accessibility

- Surface the loading state (`aria-busy`) and the end-of-list message so assistive tech knows when more is coming.
- Provide a manual `loadMore()` trigger (button) as a fallback for users who cannot scroll-trigger the observer.

---

## Changelog

### 2026-05-17
- Documentation homologated to the standard template; example arrow functions replaced with `function ()`.
