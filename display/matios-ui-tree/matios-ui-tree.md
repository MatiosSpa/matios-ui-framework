# MTS.Tree

Collapsible tree view for hierarchies: expand/collapse, selectable nodes, checkboxes with child propagation, folder/file icons, custom icons, badges and connection lines.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-tree.css">
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-tree.js"></script>
```

`matios-ui-icons.js` is required — the tree renders its toggle arrows and folder/file icons through `MTS.Icon.get()`.

If any node supplies a custom `icon`, also include `matios-ui-sanitize.js` so the markup is sanitized before insertion:

```html
<script src="matios-ui-sanitize.js"></script>
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
        { id: 'input',  label: 'Input.js' }
      ]},
      { id: 'index', label: 'index.js' },
      { id: 'app',   label: 'App.js', selected: true }
    ]},
    { id: 'public', label: 'public', children: [
      { id: 'index-html', label: 'index.html' },
      { id: 'favicon',    label: 'favicon.ico' }
    ]}
  ],
  onSelect: function (e) { console.log('selected:', e.detail.node.id); },
  onToggle: function (e) { console.log('toggled:', e.detail.node.id, e.detail.expanded); }
});

// Checkable tree (child propagation)
new MTS.Tree('#perm-tree', {
  checkable: true,
  nodes: [
    { id: 'users', label: 'Users', children: [
      { id: 'users-read',   label: 'Read' },
      { id: 'users-write',  label: 'Write', checked: true },
      { id: 'users-delete', label: 'Delete', disabled: true }
    ]},
    { id: 'reports', label: 'Reports', children: [
      { id: 'reports-view',   label: 'View' },
      { id: 'reports-export', label: 'Export' }
    ]}
  ],
  onCheck: function (e) { updatePermissions(e.detail.checkedIds); }
});
```

The first argument is a CSS selector or an `Element`. The tree renders in place inside that element; there is no `.mount()`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `nodes` | `array` | `[]` | Node tree (see schema below) |
| `expandAll` | `boolean` | `false` | Expand all nodes on init |
| `selectable` | `boolean` | `false` | Allow node selection on click |
| `checkable` | `boolean` | `false` | Show checkboxes |
| `showIcons` | `boolean` | `true` | Show folder/file icons |
| `showLines` | `boolean` | `true` | Show connection lines |
| `onSelect` | `function` | — | Fires on node selection — `({ node, path })` |
| `onToggle` | `function` | — | Fires on expand/collapse — `({ node, expanded })` |
| `onCheck` | `function` | — | Fires on checkbox change — `({ node, checked, checkedIds })` |

The `onSelect`, `onToggle` and `onCheck` callbacks are registered as `on('select' | 'toggle' | 'check', …)` listeners, so they receive the same `{ type, detail }` object as `on(…)` (see Events).

### Node schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier (used by `expand` / `collapse` / `select` / `check` and reported in `checkedIds`) |
| `label` | `string` | Display text |
| `children` | `array` | Child nodes |
| `expanded` | `boolean` | Initially expanded |
| `selected` | `boolean` | Initially selected |
| `checked` | `boolean` | Initially checked |
| `icon` | `string` | Custom icon markup (HTML/SVG). Sanitized via `MTS.Sanitize` when available; overrides the default folder/file icon |
| `badge` | `string` | Text shown in a small badge after the label |
| `disabled` | `boolean` | Disables selection, toggle and checkbox for the node |

A node with a non-empty `children` array is treated as a folder (expandable, gets the folder icon); otherwise it is a leaf (gets the file icon).

---

## API

All methods except `getChecked()`, `getSelected()` and `destroy()` return the instance for chaining.

| Method | Description |
|--------|-------------|
| `expand(id)` | Expand a single node |
| `collapse(id)` | Collapse a single node |
| `expandAll()` | Expand the whole tree (`expandAll2()` is a deprecated alias) |
| `collapseAll()` | Collapse the whole tree |
| `select(id)` | Select a node (clears any previous selection) |
| `check(id, val)` | Check/uncheck a node — `val` defaults to `true` |
| `getChecked()` | Array of checked node ids `['id1', 'id2', …]` |
| `getSelected()` | The currently selected node object, or `null` |
| `setNodes(nodes)` | Replace the node data and re-render |
| `on(event, cb)` | Register a listener (`'select'`, `'toggle'`, `'check'`) |
| `destroy()` | Empty the container |

```js
const tree = new MTS.Tree('#my-tree', { nodes: [/* … */] });
tree.expand('src');
tree.on('check', function (e) { console.log(e.detail.checkedIds); });
```

---

## Events

Listeners registered via the `onSelect` / `onToggle` / `onCheck` options or via `on(event, cb)` receive an object shaped `{ type, detail }`; the fields below live on `detail`.

| Event | `detail` | When |
|-------|----------|------|
| `select` | `{ node, path }` | A node is selected (requires `selectable: true`). `path` is the array of node objects from the root to the selected node |
| `toggle` | `{ node, expanded }` | A node with children is expanded or collapsed |
| `check` | `{ node, checked, checkedIds }` | A checkbox changes (checking/unchecking cascades to descendants) |

Each event is also dispatched as a bubbling DOM `CustomEvent` on the container, named `mts:tree:<event>`, with the same `detail`:

```js
el.addEventListener('mts:tree:select', function (e) { console.log(e.detail); });
el.addEventListener('mts:tree:toggle', function (e) { console.log(e.detail); });
el.addEventListener('mts:tree:check',  function (e) { console.log(e.detail); });
```

---

## i18n

The component itself renders no localizable text — labels, badges and icons all come from your `nodes` data. The only strings in `matios-ui-tree-i18n.js` belong to the demo page, under the `MTS.Tree` namespace (`MTS.Tree.demo.*`), registered for `es` / `en` / `pt`.

Set the language once at startup:

```js
MTS.setLanguage('en'); // 'es' | 'en' | 'pt'
```

There is no per-instance `locale` option.
