# MTS.DataTableColumnVisibilityPlugin

Adds a toolbar button that opens a panel to **show / hide columns**. Zero config — it reads the table's own `columns`.
Mark a column `alwaysVisible: true` to keep it from being hidden.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-datatable-columnvisibility.css">
<script src="matios-ui-datatable-columnvisibility.js"></script>
```

Requires `MTS.DataTable` and `MTS.Button`.

---

## Complete example (copy-paste)

Base table + the plugin. `#` and `Name` can't be hidden (`alwaysVisible`); the rest are toggleable:

```html
<div id="usersTable"></div>
```

```js
const columnVisibility = new MTS.DataTableColumnVisibilityPlugin();   // no options — reads the table columns

const datatable = new MTS.DataTable({
  elementId: 'usersTable',
  rowId:     'id',
  columns: [
    { field: 'id',         label: '#',          sortable: true, align: 'end', width: '60px', alwaysVisible: true },
    { field: 'name',       label: 'Name',       sortable: true,                              alwaysVisible: true },
    { field: 'email',      label: 'Email',      sortable: true },
    { field: 'department', label: 'Department', sortable: true },
    { field: 'role',       label: 'Role',       sortable: true },
    { field: 'joinDate',   label: 'Join date',  sortable: true, align: 'end', width: '140px' },
    { field: 'status',     label: 'Status',     align: 'center' },
  ],
  dataSource: { url: '/api/users', method: 'GET' },
  pageSize:   8,
  search:     { enabled: true, minChars: 1, width: '240px' },
  plugins:    [columnVisibility],
});
```

---

## Options

None. The plugin has no constructor options — it derives everything from the table's `columns`.

## Column flag

| Flag | Where | Description |
|------|-------|-------------|
| `alwaysVisible` | on a `columns[]` entry | `true` → the column can't be hidden (excluded from the toggle panel) |
