# MTS.Tree

Tree view with expand/collapse, selectable nodes, checkboxes with child propagation, icons, badges and connection lines.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-tree.css">
<script src="matios-ui-tree.js"></script>
```

---

## Usage

```js
// File tree
new MTS.Tree('#file-tree', {
  showLines:  true,
  showIcons:  true,
  selectable: true,
  nodes: [
    { id: 'src', label: 'src', expanded: true, children: [
      { id: 'components', label: 'components', children: [
        { id: 'button', label: 'Button.js' },
        { id: 'input',  label: 'Input.js' },
      ]},
      { id: 'index', label: 'index.js' },
      { id: 'app',   label: 'App.js', selected: true },
    ]},
    { id: 'public', label: 'public', children: [
      { id: 'index-html', label: 'index.html' },
      { id: 'favicon',    label: 'favicon.ico' },
    ]},
  ],
  onSelect: function (e) { console.log('selected:', e.detail.node.id); },
  onToggle: function (e) { console.log('toggled:', e.detail.node.id, e.detail.expanded); },
});

// Checkable tree (child propagation)
new MTS.Tree('#perm-tree', {
  checkable: true,
  nodes: [
    { id: 'users', label: 'Users', children: [
      { id: 'users-read',   label: 'Read' },
      { id: 'users-write',  label: 'Write', checked: true },
      { id: 'users-delete', label: 'Delete', disabled: true },
    ]},
    { id: 'reports', label: 'Reports', children: [
      { id: 'reports-view',   label: 'View' },
      { id: 'reports-export', label: 'Export' },
    ]},
  ],
  onCheck: function (e) { updatePermissions(e.detail.checkedIds); },
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `nodes` | `array` | `[]` | Node tree (see schema below) |
| `expandAll` | `boolean` | `false` | Expand all nodes on init |
| `selectable` | `boolean` | `false` | Allow node selection |
| `checkable` | `boolean` | `false` | Show checkboxes |
| `showIcons` | `boolean` | `true` | Show folder/file icons |
| `showLines` | `boolean` | `true` | Show connection lines |
| `onSelect` | `function` | — | Fires on node selection — `({ node, path })` |
| `onToggle` | `function` | — | Fires on expand/collapse — `({ node, expanded })` |
| `onCheck` | `function` | — | Fires on checkbox change — `({ node, checked, checkedIds })` |

### Node schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `string` | Display text |
| `children` | `array` | Child nodes |
| `expanded` | `boolean` | Initially expanded |
| `selected` | `boolean` | Initially selected |
| `checked` | `boolean` | Initially checked |
| `icon` | `string` | Custom SVG icon |
| `badge` | `object` | `{ label, variant? }` |
| `disabled` | `boolean` | Disables the node |

---

## API

| Method | Description |
|--------|-------------|
| `expandAll()` / `collapseAll()` | Expand / collapse the whole tree |
| `expand(id)` / `collapse(id)` | Expand / collapse a single node |
| `select(id)` / `deselect()` | Select / clear selection |
| `getChecked()` | Get the checked node ids `['id1', 'id2', …]` |
| `on(event, cb)` / `off(event, cb)` | Register / remove listeners (`'select'`, `'toggle'`, `'check'`) |

```js
const tree = new MTS.Tree('#my-tree', { nodes: [/* … */] });
tree.expand('src');
tree.on('check', function (e) { console.log(e.detail.checkedIds); });
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onSelect(fn)` / `on('select', fn)` | `{ node, path }` | A node is selected |
| `onToggle(fn)` / `on('toggle', fn)` | `{ node, expanded }` | A node expands/collapses |
| `onCheck(fn)` / `on('check', fn)` | `{ node, checked, checkedIds }` | A checkbox changes (with child propagation) |

Also dispatched as DOM events:

```js
el.addEventListener('mts:tree:select', function (e) { console.log(e.detail); });
el.addEventListener('mts:tree:toggle', function (e) { console.log(e.detail); });
el.addEventListener('mts:tree:check',  function (e) { console.log(e.detail); });
```

---

## Accessibility

- Nodes are operable by keyboard: arrow keys move/expand/collapse, `Enter`/`Space` select or toggle the checkbox.
- A `disabled` node is skipped by selection and checkbox propagation; reflect that state visually.

---

## Changelog

### 2026-06-29
- Icons migrated to `MTS.Icon` (toggle → `chevron-down`/`chevron-right`, folder → `folder` outline/filled, leaf → `file`);
  dropped inline SVG. Requires `matios-ui-icons.js`.

### Initial
- Tree view with expand/collapse, selectable nodes, checkboxes with parent/child propagation, folder/file icons,
  connection lines, badges, and `expand` / `collapse` / `select` / `getChecked` API.
