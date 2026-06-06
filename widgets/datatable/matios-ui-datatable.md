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

## Usage

```html
<div id="myTable"></div>
```

```js
new MTS.DataTable({
  elementId: 'myTable',
  columns: [
    { field: 'name',  label: 'Name', sortable: true },
    { field: 'email', label: 'Email' },
  ],
  dataSource: async function (query) {
    const res = await fetch('/api/users?' + new URLSearchParams(query));
    return res.json();
  },
});
```

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
// Async function — recommended
dataSource: async function (query) {
  const res = await http.get('/api/items', { params: query });
  if (!res.success) throw new Error(res.message);
  return res.data;
}

// Direct URL (GET/POST)
dataSource: { url: '/api/items', method: 'GET', headers: {}, params: {} }
```

**API response contract:** `{ data: [], total: 0, totalPages: 1 }`.

**Query the dataSource receives:** `{ page, size, orderBy, orderDir, search, … }` (plus any params injected by
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
locale:   'es',                                       // 'es' | 'en' — requires matios-ui-datatable-i18n.js
texts:    { search: 'Search...', noData: 'No results', /* … merged over the active locale */ },
```

---

## Events / Callbacks

```js
new MTS.DataTable({
  onSelectionChange: function (items) { console.log(items); }, // array of selected objects
  onReady:           function (table) {},                       // once, after the first full render
  onLoad:            function (result, table) {},               // after each successful data load
  onError:           function (err, table) {},                  // when dataSource throws
});
```

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

### Initial
- Dynamic data table: async/URL dataSource with a fixed response contract, pagination, sorting, search, single/multi
  selection, persistence, i18n, custom renderers/row classes, a plugin system with lifecycle hooks, and five plugins.
