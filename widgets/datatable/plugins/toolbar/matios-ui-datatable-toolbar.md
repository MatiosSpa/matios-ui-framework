# MTS.DataTableToolbarPlugin

Action button bar above the DataTable. Buttons can be static or **reactive to the table state** via `condition` and `update()`.

---

## Installation

```js
const toolbar = new MTS.DataTableToolbarPlugin({ buttons: [/* … */] });
new MTS.DataTable({ plugins: [toolbar] /* … */ });
```

**Dependencies:** `matios-ui-button.css` + `matios-ui-button.js`.

---

## Complete example (copy-paste)

Base table + a toolbar with static buttons and a state-reactive one (`Delete selection` enables only when rows are
selected — note `onSelectionChange → toolbar.update()`):

```html
<div id="usersTable"></div>
```

```js
const toolbar = new MTS.DataTableToolbarPlugin({
  buttons: [
    { label: 'New',    icon: 'plus',     tooltip: 'Create a new record', action: function (table) { console.log('new'); } },
    { label: 'Export', icon: 'download', tooltip: 'Export visible data',  action: function () { console.log('export'); } },
    { icon: 'refresh', tooltip: 'Reload table',                            action: function (table) { table.reload(); } },

    { separator: true },

    { label: 'Delete selection', icon: 'trash', danger: true, tooltip: 'Delete the selected records',
      condition: function (table) { return table.getSelection().length > 0; },   // enabled only with a selection
      action:    function (table) { console.log('delete', table.getSelection().map(function (i) { return i.name; })); } },
  ],
});

const datatable = new MTS.DataTable({
  elementId: 'usersTable',
  rowId:     'id',
  columns: [
    { field: 'id',     label: '#',      sortable: true, align: 'end', width: '60px' },
    { field: 'name',   label: 'Name',   sortable: true },
    { field: 'email',  label: 'Email',  sortable: true },
    { field: 'status', label: 'Status', align: 'center' },
  ],
  dataSource: { url: '/api/users', method: 'GET' },
  pageSize:   8,
  search:     { enabled: true, minChars: 1, width: '240px' },
  selection:  { mode: 'multi' },
  plugins:    [toolbar],
  onSelectionChange: function () { toolbar.update(); },   // re-evaluate button conditions
});
```

---

## Button options

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Visible text (optional if `icon` is set) |
| `icon` | `string` | MTS icon name without prefix (e.g. `'plus'`) (optional if `label` is set) |
| `tooltip` | `string` | `title` + `aria-label` for icon-only buttons |
| `variant` | `string` | MTS.Button variant (default `'secondary'`) |
| `danger` | `boolean` | Shorthand for `variant: 'danger'` |
| `disabled` | `boolean` | Always disabled, regardless of state |
| `condition` | `(table) → boolean` | If it returns `false` the button is disabled. Re-evaluated by `update()` |
| `action` | `(table) → void` | Click callback, receives the DataTable instance |

`{ separator: true }` creates a visual break between button groups.

---

## API

| Method | Description |
|--------|-------------|
| `update()` | Re-evaluate every `condition` and enable/disable buttons (does not re-render — only toggles `disabled`) |
| `addButtons(buttons, id)` | Append a button set (preceded by an auto separator); `id` namespaces it for removal. Chainable |
| `removeButtons(id)` | Remove the button set with that `id` and re-render. Chainable |

---

## Context-reactive toolbar

Buttons with `condition` enable/disable dynamically. The mechanism is deliberate and manual: the dev decides **when**
to call `toolbar.update()`. The standard pattern is to react to selection:

```js
new MTS.DataTable({
  plugins: [toolbar],
  onSelectionChange: function () { toolbar.update(); },
});
```

It is manual (not automatic) because each table has its own business logic — making it automatic would require the
plugin to know that logic and break separation of concerns.

### Example — Activate / Deactivate user

```js
const toolbar = new MTS.DataTableToolbarPlugin({
  buttons: [
    {
      label: 'Activate', icon: 'check-circle', tooltip: 'Activate the selected user',
      condition: function (table) { const sel = table.getSelection(); return sel.length === 1 && sel[0].status === 'inactive'; },
      action: function (table) { const u = table.getSelection()[0]; console.log('[users.onActivate]', u); },
    },
    {
      label: 'Deactivate', icon: 'pause', tooltip: 'Deactivate the selected user',
      condition: function (table) { const sel = table.getSelection(); return sel.length === 1 && sel[0].status === 'active'; },
      action: function (table) { const u = table.getSelection()[0]; console.log('[users.onDeactivate]', u); },
    },
  ],
});

new MTS.DataTable({ plugins: [toolbar], onSelectionChange: function () { toolbar.update(); } });
```

### Example — DocumentManager (Upload, Move, Delete)

When the toolbar coexists with `MTS.DocumentManagerPlugin`, buttons can read the current folder via `dm.getItem()`
(close over the `dm` reference):

```js
const dm = new MTS.DocumentManagerPlugin({ /* … */ });
const toolbar = new MTS.DataTableToolbarPlugin({
  buttons: [
    { label: 'Upload', icon: 'upload', action: function () { console.log('[dm.onUpload]', dm.getItem()); } },
    { separator: true },
    { label: 'Move',   icon: 'move',  condition: function (t) { return t.getSelection().length > 0; }, action: function (t) { console.log('[dm.onMove]', t.getSelection()); } },
    { label: 'Delete', icon: 'trash', danger: true, condition: function (t) { return t.getSelection().length > 0; }, action: function (t) { console.log('[dm.onDelete]', t.getSelection()); } },
  ],
});

new MTS.DataTable({ plugins: [toolbar, dm], onSelectionChange: function () { toolbar.update(); } });
```

---

## Button injection from other plugins

Other plugins can add their own buttons via `addButtons` / `removeButtons`, integrating without knowing the initial
config. The `id` acts as a namespace so a set can be added/removed as a block:

```js
// In a plugin's install():
const toolbar = table.getPlugin('MTS.DataTableToolbarPlugin');
if (toolbar) toolbar.addButtons([{ label: 'Approve', icon: 'check-circle', condition: cond, action: act }], 'myPlugin');

// In uninstall():
if (toolbar) toolbar.removeButtons('myPlugin');
```

`MTS.DocumentManagerWorkflowPlugin` uses this via `showInToolbar: true`, injecting workflow buttons (Start, Send,
Approve, Sign, Reject, Restart). Their conditions use **state unanimity**: all selected items must share the same
state for the action to enable. Requires the toolbar to be installed **before** the DM in the plugins array and
`toolbar.update()` called on `onSelectionChange`.

---

## Changelog

### Initial
- Action toolbar plugin: static or state-reactive buttons (`condition` + `update()`), separators, runtime
  `addButtons` / `removeButtons` with namespacing, and cross-plugin injection (`showInToolbar`).
