# MTS.DataTableExpandRowPlugin

Adds an expand/collapse toggle column to `MTS.DataTable`. Clicking a row's toggle opens a detail row underneath,
rendered by your `render(item)` function.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-datatable-expandrow.css">
<script src="matios-ui-datatable-expandrow.js"></script>
```

Requires `MTS.DataTable`.

---

## Complete example (copy-paste)

Base table + the plugin. `render(item)` returns the HTML for the expanded detail:

```html
<div id="usersTable"></div>
```

```js
const expandRow = new MTS.DataTableExpandRowPlugin({
  // render(item) → HTML string for the detail row (item = the full row object)
  render: function (item) {
    return `
      <div class="mts-expand-detail">
        <div><strong>Email</strong><br>${item.email ?? '—'}</div>
        <div><strong>Department</strong><br>${item.department ?? '—'}</div>
        <div><strong>Role</strong><br>${item.role ?? '—'}</div>
        <div><strong>Status</strong><br>${item.status ?? '—'}</div>
      </div>`;
  },
  // multiple: true,   // allow several rows expanded at once (default: false → one at a time)
  // width: '48px',    // toggle column width (default: '48px')
});

const datatable = new MTS.DataTable({
  elementId: 'usersTable',
  rowId:     'id',
  columns: [
    { field: 'id',         label: '#',          sortable: true, align: 'end', width: '60px' },
    { field: 'name',       label: 'Name',       sortable: true },
    { field: 'email',      label: 'Email',      sortable: true },
    { field: 'department', label: 'Department', sortable: true },
    { field: 'role',       label: 'Role',       sortable: true },
  ],
  dataSource: { url: '/api/users', method: 'GET' },
  pageSize:   8,
  search:     { enabled: true, minChars: 1, width: '260px' },
  plugins:    [expandRow],
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `render` | function | — | `(item) => HTMLString` — content of the expanded detail row, receives the full row object |
| `multiple` | boolean | `false` | `true` → several rows can be expanded at once; `false` → expanding one collapses the others |
| `width` | string | `'48px'` | Width of the toggle column |
