# MTS.Pagination

Full-featured pagination with page-size selector, record summary, jump-to-page and size variants.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-pagination.css">
<script src="matios-ui-pagination.js"></script>
```

---

## Usage

```js
// Basic
const pag = new MTS.Pagination('#my-pagination', {
  total:    250,
  page:     1,
  pageSize: 25,
  onChange: function (e) { fetchData({ page: e.detail.page, size: e.detail.pageSize }); },
});

// Full options
new MTS.Pagination('#pag-full', {
  total:     1000,
  pageSize:  10,
  pageSizes: [10, 25, 50, 100],
  showSizes: true, // page-size selector
  showInfo:  true, // "Showing 1-10 of 1000"
  showJump:  true, // jump-to-page input
  siblings:  2,    // pages on each side of the active one
  size:      'md',
  onChange:  function (e) { console.log(e.detail); },
});
```

### HTML with `data-*`

```html
<div id="my-pagination" data-total="250" data-page="1" data-page-size="25"></div>
<script> new MTS.Pagination('#my-pagination', { onChange: function (e) { fetchData(e.detail.page, e.detail.pageSize); } }); </script>
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `total` | `number` | `0` | Total number of records |
| `page` | `number` | `1` | Current page (1-based) |
| `pageSize` | `number` | `10` | Records per page |
| `pageSizes` | `number[]` | `[10,25,50,100]` | Page-size options |
| `showSizes` | `boolean` | `true` | Show the page-size selector |
| `showInfo` | `boolean` | `true` | Show "Showing X-Y of Z" |
| `showJump` | `boolean` | `false` | Show the jump-to-page input |
| `siblings` | `number` | `1` | Pages shown on each side of the active one |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` |
| `onChange` | `function` | — | Fires when page or page size changes — `{ page, pageSize, total, from, to }` |

---

## API

| Method | Description |
|--------|-------------|
| `setPage(n)` | Navigate to a page |
| `setTotal(n)` | Update the total (resets to page 1) |
| `setPageSize(n)` | Change the page size (resets to page 1) |
| `getState()` | `{ page, pageSize, total, from, to }` |
| `on(event, cb)` | Listen to `'change'` |

```js
const pag = new MTS.Pagination('#my-pagination', { total: 250 });
pag.setPage(3);
pag.setTotal(500);
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:pagination:change` | `{ page, pageSize, total, from, to }` |

```js
document.getElementById('my-pagination')
  .addEventListener('mts:pagination:change', function (e) { console.log(e.detail.page, e.detail.pageSize); });
```

---

## Accessibility

- Page controls are real buttons with the current page exposed as the active/current state for assistive tech.
- The jump-to-page input and page-size selector are labeled controls reachable by keyboard.

---

## Changelog

### Initial
- Pagination with page-size selector, record summary, jump-to-page, configurable siblings and sizes, `onChange`,
  and `setPage` / `setTotal` / `setPageSize` / `getState`.
