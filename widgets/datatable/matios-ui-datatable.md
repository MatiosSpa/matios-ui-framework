# MTS.DataTable

Dynamic data table with pagination, sorting, search, selection and plugins. Pure core — no external dependencies. Uses `MTS.Table` internally for markup and CSS.

---

## Installation

```html
<link rel="stylesheet" href="../base/matios-ui-base.css">
<link rel="stylesheet" href="../data/matios-ui-table/matios-ui-table.css">
<link rel="stylesheet" href="matios-ui-datatable.css">
<script src="matios-ui-datatable.js"></script>
```

---

## Complete example (copy-paste)

Everything wired: columns with a custom render, remote `dataSource` (paging/sort/search happen server-side), selection,
events and the methods you'll call later. `query` carries the paging/sort/search state on every load.

```html
<div id="usersTable"></div>
```

```js
// (optional) your transport, if you prefer HttpClient over fetch:
// const http = new MTS.HttpClient({ baseUrl: '/api' });

const datatable = new MTS.DataTable({
  elementId: 'usersTable',
  rowId:     'id',                     // field that uniquely identifies each row (required for selection)

  columns: [
    { field: 'name',   label: 'Name',   sortable: true },
    { field: 'email',  label: 'Email' },
    { field: 'status', label: 'Status', align: 'center',
      render: function (value, row) {  // custom cell — return an HTML string or plain text
        return value === 'active' ? 'Active' : 'Inactive';
      } },
  ],

  // ── LOAD: called on init and on every page / sort / search change. You own the transport. ──
  dataSource: async function (query) {
    // query = { pageNumber, pageSize, orderBy, orderDir, search, ...pluginParams }
    const res = await fetch('/api/users?' + new URLSearchParams(query));
    return res.json();                 // must return { data: [...], total, totalPages }
    // ── or with HttpClient (you handle auth/interceptors): ──
    // const res = await http.get('/users', { params: query });
    // if (!res.success) throw new Error(res.message);
    // return res.data;                // { data, total, totalPages }
  },

  pageSize:   10,
  pagination: { pageSizeOptions: [10, 25, 50, 100] },
  sort:       { column: 'name', direction: 'asc' },
  search:     { enabled: true, minChars: 1, width: '240px' },
  selection:  { mode: 'multi', checkboxes: true },   // 'none' | 'single' | 'multi'
  hover:      true,
  striped:    false,

  // ── Events (real callback names — full list in the Events section below) ──
  onReady:           function () {},                   // once, after the first render
  onAfterLoad:       function (result) {},             // after each load — result = { data, total, totalPages }
  onLoadError:       function (err) {},                // when dataSource throws
  onSelectionChange: function (items) {},              // array of selected row objects
});

// ── Methods (call later) ──
// datatable.reload();                      // reload current page keeping state
// datatable.setSearch('john');             // set search text and reload
// datatable.setParams({ tenantId: 42 });   // merge extra query params and reload
// datatable.goToPage(2);
// datatable.getSelection();                // array of selected rows
```

> **Zero-config alternative:** instead of the function, pass `dataSource: { url: '/api/users', headers, params }` and the
> table fetches it for you (native `fetch`). See [DataSource](#datasource) for both forms.

---

## Configuration

### Container

| Option | Type | Description |
|--------|------|-------------|
| `elementId` | `string` | Id of the host element |
| `element` | `HTMLElement` | Direct alternative to `elementId` |

### Columns

```js
columns: [
  {
    field:         'name',     // data object field
    label:         'Name',     // visible header
    sortable:      true,       // enable sorting on this column
    align:         'start',    // 'start' | 'center' | 'end'
    width:         '200px',    // fixed width (optional)
    alwaysVisible: true,       // cannot be hidden via ColumnVisibility
    render:        function (v, row) { return v; }, // custom renderer
  },
]
```

`render(value, row)` receives the field value and the full row object. If it returns an HTML string it is set via
`innerHTML`; without `render`, `textContent` is used.

### DataSource

```js
// 1) Function (recommended) — YOU own the transport: MTS.HttpClient, auth,
//    interceptors, a custom client… This is the override point for HttpClient.
const http = new MTS.HttpClient({ baseUrl: '/api' });
dataSource: async (query) => {
  const res = await http.get('/items', { params: query });   // ← MTS.HttpClient
  if (!res.success) throw new Error(res.message);
  return res.data;                                           // { data, total, totalPages }
};

// 2) Direct URL — zero-config. The table fetches it for you with native fetch().
dataSource: {
  url:     '/api/items',
  method:  'GET',
  headers: { Authorization: 'Bearer ' + token },   // sent on every request
  params:  { tenantId: 42 },                        // merged with page/size/orderBy/search
};
```

**Built-in `{ url }` behavior:**
- `headers` — sent on every request (e.g. `{ Authorization: 'Bearer …' }`).
- `params` — fixed query params merged with the paging/sort/search query (`page,size,orderBy,orderDir,search`); the live query wins on key clash.
- `Content-Type: application/json` is added **only** for non-GET requests (which carry a body) and **only if you didn't set your own** — so a plain GET won't trigger an unnecessary CORS preflight.

> **Need HttpClient, auth, or a custom transport?** Use the **function** form (option 1) — that's the override point. The `{ url }` form uses a built-in native `fetch` for the simple case.

**API response contract:** `{ data: [], total: 0, totalPages: 1 }`.

**Query the dataSource receives:** `{ pageNumber, pageSize, orderBy, orderDir, search, … }` (plus any params injected by
plugins such as FilterPlugin).

### Pagination & layout

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pageSize` | `number` | `10` | Rows per page |
| `rowId` | `string` | `null` | Field uniquely identifying each row (required for selection) |
| `hover` | `boolean` | `true` | Highlight the row on hover |
| `striped` | `boolean` | `false` | Alternating row background |
| `bordered` | `boolean` | `false` | Borders on all cells |
| `compact` | `boolean` | `false` | Less cell padding |
| `fixedHeader` | `boolean` | `false` | Sticky header on vertical scroll |
| `fixedHeaderHeight` | `string` | `'400px'` | Max scroll-area height when `fixedHeader: true` |

### Initial sort, search & selection

```js
sort:   { column: 'name', direction: 'asc' },         // 'asc' | 'desc'
search: { enabled: true, minChars: 1, width: '240px' },
selection: { mode: 'multi', checkboxes: false },      // 'none' | 'single' | 'multi'
```

| `mode` | Behavior |
|--------|----------|
| `'none'` | No selection (default) |
| `'single'` | One row at a time |
| `'multi'` | Multiple by click; with `checkboxes: true` adds a checkbox column and "select all" |

### Page-size options

```js
pagination: { pageSizeOptions: [5, 10, 25, 50, 100] }
```

> **Important:** `pageSize` must be included in `pageSizeOptions`, otherwise the selector cannot pre-select the
> initial value and shows an empty placeholder.

### Action column, row class, persistence, i18n

```js
actionColumn: true, actionColumnLabel: '', actionColumnWidth: '120px', // controlled by DocumentManagerContextMenuPlugin
rowClass: function (row) { return row.status === 'inactive' ? 'mts-row--muted' : null; },
persist:  { enabled: true, key: 'my-table' },        // persists page, sort, search, page size
// Language is global — call MTS.setLanguage('en') once at startup; there is no per-instance locale option.
texts:    { search: 'Search...', noData: 'No results', /* … merged over the active language */ },
```

---

## Events / Callbacks

Passed as options (see the complete example above). Real callback names and signatures:

| Callback | Signature | Fires |
|----------|-----------|-------|
| `onReady` | `()` | once, after the first full render |
| `onBeforeLoad` | `(query)` | before each request |
| `onAfterLoad` | `(result)` | after each successful load — `result` = `{ data, total, totalPages }` |
| `onLoadError` | `(err)` | when `dataSource` throws |
| `onSelectionChange` | `(items)` | selection changes — `items` = array of selected rows |
| `onRowSelect` / `onRowDeselect` | `(item, items)` | a single row is (de)selected |
| `onPageChange` | `(page, query)` | page changes |
| `onSortChange` | `(orderBy, orderDir)` | sort changes |
| `onSearchChange` | `(text)` | search text changes |
| `onRowRender` / `onRowRendered` | `(td, item, col)` / `(row, item)` | cell / row render hooks |
| `onRowDragStart` / `onRowDrop` | `(item, index)` / `(dragItem, item, from, to)` | row drag & drop |

---

## API

### Load & navigation

| Method | Description |
|--------|-------------|
| `load()` | Load the first page |
| `reload()` | Reload the current page keeping state |
| `goToPage(n)` | Navigate to page `n` |
| `setSearch(text)` | Set the search text and reload |
| `setParams(params)` / `clearParams(...keys)` | Merge / remove extra query params and reload |
| `redraw()` | Re-render with the latest data without a new request |
| `getData()` | Rows currently loaded/rendered (the active page) as a shallow copy. The table is paged/data-source driven, so this is the current page — not the whole dataset |

### Selection

| Method | Description |
|--------|-------------|
| `getSelection()` | Array of selected row objects |
| `clearSelection()` | Deselect all rows |
| `selectRow(id)` / `deselectRow(id)` | Select / deselect a row by id |

### Plugins, hooks & lifecycle

| Method | Description |
|--------|-------------|
| `use(plugin)` / `remove(name)` / `getPlugin(name)` | Install / uninstall / get a plugin at runtime |
| `registerHook(name, fn)` / `unregisterHook(name, fn)` | Subscribe/unsubscribe to a lifecycle event (multiple plugins can share it) |
| `destroy()` | Unmount the table, uninstall all plugins and clear the DOM |

```js
const onReady = function () { /* … */ };
table.registerHook('onReady', onReady);
table.unregisterHook('onReady', onReady);
```

---

## Plugin contract

| Requirement | Description |
|-------------|-------------|
| `static descriptor.name` | Unique id (e.g. `'MTS.DataTableToolbarPlugin'`) |
| `static descriptor.version` | Semver version |
| `static descriptor.provides` | Capability it exposes (avoids conflicts) |
| `install(table)` | Called on mount, receives the DataTable instance |
| `uninstall()` | Called on unmount — must clean up DOM, listeners and references |

## Available plugins

| Plugin | Folder | Description |
|--------|--------|-------------|
| `MTS.DataTableToolbarPlugin` | `plugins/toolbar/` | Button bar reactive to table state |
| `MTS.DataTableFilterPlugin` | `plugins/filter/` | Filter chips (static or async select) |
| `MTS.DataTableColumnVisibilityPlugin` | `plugins/columnvisibility/` | Panel to show/hide columns |
| `MTS.DataTableExpandRowPlugin` | `plugins/expandrow/` | Expandable row with custom detail |
| `MTS.DocumentManagerPlugin` | `plugins/documentmanager/` | Document manager with breadcrumb and drag & drop |

---

## Accessibility

- Built on `MTS.Table` semantics (real `<th>` headers with scope); sortable headers expose the current sort state.
- Selection checkboxes and pagination controls are keyboard-operable; reflect the selected/current state in text.

---

## Changelog

### 2026-07-01
- `{ url }` dataSource now merges `ds.params` with the paging/sort/search query, and adds `Content-Type: application/json`
  only for non-GET requests when the dev didn't set one (avoids an unnecessary CORS preflight on GET). `headers` unchanged.

### 2026-06-23
- `getData()` — read back the rows currently rendered (active page) as a shallow copy, mirroring `getSelection()`.

### Initial
- Dynamic data table: async/URL dataSource with a fixed response contract, pagination, sorting, search, single/multi
  selection, persistence, i18n, custom renderers/row classes, a plugin system with lifecycle hooks, and five plugins.
