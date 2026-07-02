# MTS.DataTableFilterPlugin

Predefined per-column filters for `MTS.DataTable`, shown as removable chips in the toolbar. Each filter's value is sent
to the `dataSource` as a query param (`field`), so filtering happens **server-side**. Options can be **static** (`select`)
or loaded from an endpoint (`async`).

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-datatable-filter.css">
<script src="matios-ui-datatable-filter.js"></script>
```

Requires `MTS.DataTable`.

---

## Complete example (copy-paste)

Base table + one static filter and two async filters (options loaded from an endpoint):

```html
<div id="usersTable"></div>
```

```js
const filterPlugin = new MTS.DataTableFilterPlugin({
  filters: [
    // Static options
    { field: 'status', label: 'Status', type: 'select',
      options: [
        { value: 'active',   label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ] },

    // async via POST — params/search/limit are sent in the JSON body
    { field: 'department', label: 'Department', type: 'async',
      optionsSource: {
        url:        '/api/departments',
        method:     'POST',
        headers:    { Authorization: 'Bearer eyJhbGciOiJIUzI1Ni…', 'X-Tenant': 'acme' },
        valueField: 'id', labelField: 'name', limit: 20,
        params:     { active: true },
      },
      searchable: true, debounce: 300 },

    // async via GET (default) — params/search/limit go in the query string
    { field: 'role', label: 'Role', type: 'async',
      optionsSource: {
        url:        '/api/roles',
        method:     'GET',
        headers:    { Authorization: 'Bearer eyJhbGciOiJIUzI1Ni…' },
        valueField: 'id', labelField: 'name', limit: 20,
      },
      searchable: true, debounce: 300 },
  ],
});

const datatable = new MTS.DataTable({
  elementId: 'usersTable',
  rowId:     'id',
  columns: [
    { field: 'id',         label: '#',          sortable: true, align: 'end', width: '60px' },
    { field: 'name',       label: 'Name',       sortable: true },
    { field: 'department', label: 'Department', sortable: true },
    { field: 'role',       label: 'Role',       sortable: true },
    { field: 'status',     label: 'Status',     align: 'center' },
  ],
  dataSource: { url: '/api/users', method: 'GET' },   // filters arrive as ?status=…&department=… — filter server-side
  pageSize:   8,
  search:     { enabled: true, minChars: 1, width: '240px' },
  plugins:    [filterPlugin],
});
```

---

## Filter definition

| Field | Type | Description |
|-------|------|-------------|
| `field` | string | Name of the query param sent to the API |
| `label` | string | Text shown on the button / chip |
| `type` | string | `'select'` (static) or `'async'` (remote) |

**`type: 'select'`**

| Field | Description |
|-------|-------------|
| `options` | array of strings **or** `[{ value, label }]` |

**`type: 'async'`**

| Field | Description |
|-------|-------------|
| `optionsSource` | `{ url, method?, valueField, labelField, limit?, params?, headers? }` — `method` = `'GET'` (default) or `'POST'`/… (GET → `params`/`search`/`limit` in the query string; non-GET → in the JSON body); `params` = extra params; `headers` = headers sent on the internal fetch (e.g. auth) |
| `searchable` | `true` → shows a search input (default `true`) |
| `debounce` | ms before calling the API while typing (default `300`) |

## Plugin options

| Option | Type | Description |
|--------|------|-------------|
| `filters` | array | The filter definitions (above) |

## API

| Method | Description |
|--------|-------------|
| `clearAll()` | Remove all active filters |

> Active filters are sent to the `dataSource` inside the query object, so your backend (or your `dataSource` function)
> reads them alongside `pageNumber` / `pageSize` / `search` / `orderBy`.
