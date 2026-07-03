# MTS.Pagination

Full-featured pagination with page-size selector, record summary, jump-to-page and size variants.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-pagination.css">
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-pagination-i18n.js"></script>
<script src="matios-ui-pagination.js"></script>
```

`matios-ui-i18n.js` and `matios-ui-pagination-i18n.js` are optional. Without them the component falls back to the built-in English strings.

---

## Usage

```js
// Basic
const pag = new MTS.Pagination('#my-pagination', {
  total:    250,
  page:     1,
  pageSize: 25,
  onChange: function (e) { fetchData(e.detail.page, e.detail.pageSize); }
});

// Full options
new MTS.Pagination('#pag-full', {
  total:     1000,
  page:      1,
  pageSize:  10,
  pageSizes: [10, 25, 50, 100],
  showSizes: true,
  showInfo:  true,
  showJump:  true,
  siblings:  2,
  size:      'md',
  onChange:  function (e) { console.log(e.detail); }
});
```

### HTML with `data-*`

The component reads `data-total`, `data-page`, `data-page-size`, `data-size`, `data-show-info` and `data-show-jump` from the element. Explicit `options` always win over `data-*`.

```html
<div id="my-pagination"
     data-total="250"
     data-page="1"
     data-page-size="25"></div>

<script>
  new MTS.Pagination('#my-pagination', {
    onChange: function (e) { fetchData(e.detail.page, e.detail.pageSize); }
  });
</script>
```

> The mere presence of `data-show-info` or `data-show-jump` (any value) enables that feature.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `total` | `number` | `0` | Total number of records |
| `page` | `number` | `1` | Current page (1-based) |
| `pageSize` | `number` | `10` | Records per page |
| `pageSizes` | `number[]` | `[10, 25, 50, 100]` | Page-size options offered by the selector |
| `showSizes` | `boolean` | `true` | Show the page-size selector |
| `showInfo` | `boolean` | `true` | Show the "Showing X–Y of Z" summary |
| `showJump` | `boolean` | `false` | Show the jump-to-page input |
| `siblings` | `number` | `1` | Pages shown on each side of the active page |
| `size` | `string` | `'md'` | `'sm'` \| `'md'` \| `'lg'` |
| `onChange` | `function` | — | Fires when page or page size changes — receives `{ type, detail }` where `detail` is `{ page, pageSize, total, from, to }` |

The first and last pages are always shown; gaps between the sibling window and the boundaries are collapsed into an ellipsis (`…`).

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `setPage(n)` | `this` | Navigate to page `n` (clamped to `1…totalPages`); emits `change` |
| `setTotal(n)` | `this` | Update the total and reset to page 1 (does **not** emit `change`) |
| `setPageSize(n)` | `this` | Change the page size and reset to page 1; emits `change` |
| `getState()` | `object` | `{ page, pageSize, total, from, to }` |
| `on(event, cb)` | `this` | Subscribe to `'change'` |

```js
const pag = new MTS.Pagination('#my-pagination', { total: 250, pageSize: 25 });

pag.setPage(3);
pag.setTotal(500);
pag.setPageSize(50);

pag.getState();
// → { page: 1, pageSize: 50, total: 500, from: 1, to: 50 }
```

---

## Events

| Callback | DOM event | Payload (`detail`) |
|----------|-----------|--------------------|
| `onChange` | `mts:pagination:change` | `{ page, pageSize, total, from, to }` |

Both fire together whenever the page or the page size changes (`setPage` / `setPageSize` / user clicks). The DOM event bubbles.

```js
document.getElementById('my-pagination')
  .addEventListener('mts:pagination:change', function (e) {
    console.log(e.detail.page, e.detail.pageSize);
  });
```

---

## i18n

The visible chrome (record summary, empty state, "Rows:" and "Go to:" labels) is localized through the shared `MTS.getString()` API under the `MTS.Pagination` namespace. Set the language once at startup:

```js
MTS.setLanguage('es'); // 'es' | 'en' | 'pt'
```

Bundled keys:

| Key | English | Notes |
|-----|---------|-------|
| `empty` | `No results` | Shown when `total` is `0` |
| `info` | `Showing {from}–{to} of {total}` | Summary; placeholders are interpolated |
| `rowsLabel` | `Rows:` | Page-size selector label |
| `jumpLabel` | `Go to:` | Jump-to-page input label |

There is no per-instance `locale` option — the language is global.

---

## Accessibility

- Page controls are real `<button>` elements; the active page carries the `mts-pagination__btn--active` state.
- The jump-to-page input and the page-size selector are labeled controls reachable by keyboard.
