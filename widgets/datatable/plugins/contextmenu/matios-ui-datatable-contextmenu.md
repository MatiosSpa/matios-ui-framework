# MTS.DataTableContextMenuPlugin

Right-click context menu (and an optional three-dots actions column) for `MTS.DataTable`. Items are context-aware: each
can be shown/hidden per row via `condition` and runs an `action` with the row object.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-datatable-contextmenu.css">
<script src="matios-ui-datatable-contextmenu.js"></script>
```

Requires `MTS.DataTable`. Set `actionColumn: true` on the table to also get the three-dots button per row.

---

## Complete example (copy-paste)

Base table + the plugin fully wired (right-click a row, or use the actions column):

```html
<div id="usersTable"></div>
```

```js
const contextMenu = new MTS.DataTableContextMenuPlugin({
  items: [
    { label: 'View detail', icon: 'eye',
      action: function (item) { console.log('View', item.name); } },

    { label: 'Edit', icon: 'edit', shortcut: 'E',
      condition: function (item) { return item.status === 'active'; },   // show only when it returns true
      action:    function (item) { console.log('Edit', item.name); } },

    { separator: true },

    { label: 'Activate', icon: 'check-circle',
      condition: function (item) { return item.status === 'inactive'; },
      action:    function (item) { console.log('Activate', item.name); } },
    { label: 'Deactivate', icon: 'pause',
      condition: function (item) { return item.status === 'active'; },
      action:    function (item) { console.log('Deactivate', item.name); } },

    { separator: true },

    { label: 'Delete', icon: 'trash', danger: true,
      action: function (item) { console.log('Delete', item.name); } },
  ],
  onOpen:  function (item) {},   // menu opened on a row
  onClose: function () {},
});

const datatable = new MTS.DataTable({
  elementId: 'usersTable',
  rowId:     'id',
  columns: [
    { field: 'id',     label: '#',      sortable: true, align: 'end', width: '60px' },
    { field: 'name',   label: 'Name',   sortable: true },
    { field: 'status', label: 'Status', align: 'center',
      render: function (value) {
        const cls = value === 'active' ? 'mts-badge--success' : 'mts-badge--danger';
        return `<span class="mts-badge ${cls}">${value === 'active' ? 'Active' : 'Inactive'}</span>`;
      } },
  ],
  dataSource:   { url: '/api/users', method: 'GET' },   // or a function — see MTS.DataTable ▸ DataSource
  pageSize:     8,
  search:       { enabled: true, minChars: 1, width: '240px' },
  actionColumn: true,            // adds the three-dots column that opens the same menu
  plugins:      [contextMenu],   // install the plugin
});
```

---

## Item options

| Field | Type | Description |
|-------|------|-------------|
| `label` | string | Entry text |
| `icon` | string | `MTS.Icon` name (`edit`, `trash`, `eye`…) |
| `action` | function | `(item) => {}` — runs with the full row object |
| `shortcut` | string | Keyboard hint shown on the right (e.g. `'E'`) |
| `condition` | function | `(item) => boolean` — show the item only when it returns `true` |
| `danger` | boolean | Red / destructive styling |
| `separator` | boolean | `{ separator: true }` — a divider (no label) |

## Plugin options

| Option | Type | Description |
|--------|------|-------------|
| `items` | array | The menu items (above) |
| `onOpen` | function | `(item) => {}` — the menu opened on a row |
| `onClose` | function | `() => {}` — the menu closed |

> **Actions column:** `actionColumn: true` on the table (with optional `actionColumnLabel` / `actionColumnWidth`) adds a
> three-dots button per row that opens the same menu. Right-click on any row works regardless.
