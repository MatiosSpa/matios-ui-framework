# MTS.DataTableColumnActionsPlugin

Standalone **actions column** for `MTS.DataTable`: injects its own three-dots column, and each action runs on the
**currently selected rows** — so it pairs with `selection: { mode: 'multi' }` for bulk actions. (For a per-row
right-click menu instead, use `MTS.DataTableContextMenuPlugin`.)

---

## Installation

```html
<link rel="stylesheet" href="../contextmenu/matios-ui-datatable-contextmenu.css">
<script src="matios-ui-datatable-columnactions.js"></script>
```

Requires `MTS.DataTable` and `MTS.DataTableMenu`.

---

## Complete example (copy-paste)

Base table + the plugin. Select rows, then open the actions menu — the `action` receives the selected rows:

```html
<div id="usersTable"></div>
```

```js
const columnActions = new MTS.DataTableColumnActionsPlugin({
  items: [
    { label: 'View detail', icon: 'eye',
      action: function (items) { console.log('View', items.map(i => i.name)); } },   // items = selected rows

    { label: 'Edit', icon: 'edit',
      condition: function (item) { return item.status === 'active'; },   // per-row visibility
      action:    function (items) { console.log('Edit', items.map(i => i.name)); } },

    { separator: true },

    { label: 'Activate', icon: 'check-circle',
      condition: function (item) { return item.status === 'inactive'; },
      action:    function (items) { console.log('Activate', items.map(i => i.name)); } },
    { label: 'Deactivate', icon: 'pause',
      condition: function (item) { return item.status === 'active'; },
      action:    function (items) { console.log('Deactivate', items.map(i => i.name)); } },

    { separator: true },

    { label: 'Delete', icon: 'trash', danger: true,
      action: function (items) { console.log('Delete', items.map(i => i.name)); } },
  ],
  onOpen:  function (item) {},
  onClose: function () {},
});

const datatable = new MTS.DataTable({
  elementId: 'usersTable',
  rowId:     'id',
  columns: [
    { field: 'id',     label: '#',      sortable: true, align: 'end', width: '60px' },
    { field: 'name',   label: 'Name',   sortable: true },
    { field: 'email',  label: 'Email',  sortable: true },
    { field: 'status', label: 'Status', align: 'center',
      render: function (value) {
        const cls = value === 'active' ? 'mts-badge--success' : 'mts-badge--danger';
        return `<span class="mts-badge ${cls}">${value === 'active' ? 'Active' : 'Inactive'}</span>`;
      } },
  ],
  dataSource: { url: '/api/users', method: 'GET' },   // or a function — see MTS.DataTable ▸ DataSource
  pageSize:   8,
  search:     { enabled: true, minChars: 1, width: '240px' },
  selection:  { mode: 'multi' },   // the plugin acts on the selected rows
  plugins:    [columnActions],     // injects its own actions column
});
```

---

## Item options

| Field | Type | Description |
|-------|------|-------------|
| `label` | string | Entry text |
| `icon` | string | `MTS.Icon` name |
| `action` | function | `(items) => {}` — receives the **array of selected rows** |
| `condition` | function | `(item) => boolean` — show the item only when it returns `true` (evaluated per row) |
| `danger` | boolean | Red / destructive styling |
| `separator` | boolean | `{ separator: true }` — a divider |

## Plugin options

| Option | Type | Description |
|--------|------|-------------|
| `items` | array | The menu items (above) |
| `onOpen` | function | `(item) => {}` |
| `onClose` | function | `() => {}` |

> **vs `ContextMenuPlugin`:** ColumnActions is its own column and its `action` gets the **selected rows** (`items`) — good
> for bulk actions with `selection: 'multi'`. ContextMenu is a right-click menu whose `action` gets the **single** row.
