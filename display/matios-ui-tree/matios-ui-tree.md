# MTS.Tree

🇬🇧 Tree view with expand/collapse, selectable nodes, checkboxes with child propagation, icons, badges and connection lines.
🇪🇸 Vista de árbol con expandir/colapsar, nodos seleccionables, checkboxes con propagación a hijos, íconos, badges y líneas de conexión.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-tree.css">
<script src="matios-ui-tree.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `nodes` | `array` | `[]` | 🇬🇧 Node tree (see schema) / 🇪🇸 Árbol de nodos |
| `expandAll` | `boolean` | `false` | 🇬🇧 Expand all nodes on init / 🇪🇸 Expandir todos al inicio |
| `selectable` | `boolean` | `false` | 🇬🇧 Allow node selection / 🇪🇸 Permitir selección de nodos |
| `checkable` | `boolean` | `false` | 🇬🇧 Show checkboxes / 🇪🇸 Mostrar checkboxes |
| `showIcons` | `boolean` | `true` | 🇬🇧 Show folder/file icons / 🇪🇸 Mostrar íconos folder/file |
| `showLines` | `boolean` | `true` | 🇬🇧 Show connection lines / 🇪🇸 Mostrar líneas de conexión |
| `onSelect` | `function` | — | 🇬🇧 `({ node, path }) => {}` Fires on node selection / 🇪🇸 Se dispara al seleccionar un nodo |
| `onToggle` | `function` | — | 🇬🇧 `({ node, expanded }) => {}` Fires on expand/collapse / 🇪🇸 Se dispara al expandir/colapsar |
| `onCheck` | `function` | — | 🇬🇧 `({ node, checked, checkedIds }) => {}` Fires on checkbox change / 🇪🇸 Se dispara al cambiar un checkbox |

### Node schema / Esquema de nodo

| Property | Type | 🇬🇧 Description / 🇪🇸 Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | 🇬🇧 Unique identifier / 🇪🇸 Identificador único |
| `label` | `string` | 🇬🇧 Display text / 🇪🇸 Texto visible |
| `children` | `array` | 🇬🇧 Child nodes / 🇪🇸 Nodos hijos |
| `expanded` | `boolean` | 🇬🇧 Initially expanded / 🇪🇸 Expandido inicialmente |
| `selected` | `boolean` | 🇬🇧 Initially selected / 🇪🇸 Seleccionado inicialmente |
| `checked` | `boolean` | 🇬🇧 Initially checked / 🇪🇸 Marcado inicialmente |
| `icon` | `string` | 🇬🇧 Custom SVG icon / 🇪🇸 Ícono SVG personalizado |
| `badge` | `object` | `{ label, variant? }` |
| `disabled` | `boolean` | 🇬🇧 Disables the node / 🇪🇸 Deshabilita el nodo |

---

## Events / Eventos

```js
new MTS.Tree('#my-tree', {
  nodes: [...],
  selectable: true,
  checkable:  true,
  // Fires when a node is selected / Se dispara al seleccionar un nodo
  onSelect: (e) => {
    console.log(e.detail.node.id);   // → 'src'
    console.log(e.detail.path);      // → ['root', 'src']
  },
  // Fires when a node expands/collapses / Se dispara al expandir/colapsar
  onToggle: (e) => {
    console.log(e.detail.node.id);
    console.log(e.detail.expanded);  // → true | false
  },
  // Fires when checkbox changes / Se dispara al cambiar un checkbox
  onCheck: (e) => {
    console.log(e.detail.node.id);
    console.log(e.detail.checked);      // → true | false
    console.log(e.detail.checkedIds);   // → ['src', 'index.js', ...]
  },
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// File tree / Árbol de archivos
new MTS.Tree('#file-tree', {
  showLines: true,
  showIcons: true,
  selectable: true,
  nodes: [
    {
      id: 'src', label: 'src', expanded: true,
      children: [
        { id: 'components', label: 'components', children: [
          { id: 'button', label: 'Button.js' },
          { id: 'input',  label: 'Input.js' },
        ]},
        { id: 'index', label: 'index.js' },
        { id: 'app',   label: 'App.js', selected: true },
      ],
    },
    {
      id: 'public', label: 'public',
      children: [
        { id: 'index-html', label: 'index.html' },
        { id: 'favicon',    label: 'favicon.ico' },
      ],
    },
  ],
  onSelect: (e) => console.log('selected:', e.detail.node.id),
  onToggle: (e) => console.log('toggled:', e.detail.node.id, e.detail.expanded),
});

// Checkable tree / Árbol con checkboxes
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
  onCheck: (e) => updatePermissions(e.detail.checkedIds),
});

// With badges / Con badges
new MTS.Tree('#org-tree', {
  nodes: [
    { id: 'eng',  label: 'Engineering', badge: { label: '12', variant: 'primary' }, children: [
      { id: 'frontend', label: 'Frontend', badge: { label: '4' } },
      { id: 'backend',  label: 'Backend',  badge: { label: '8' } },
    ]},
    { id: 'design', label: 'Design', badge: { label: '3', variant: 'success' } },
  ],
});
```

---

## API

```js
const tree = new MTS.Tree('#my-tree', { ... });

// Expand / collapse / Expandir / colapsar
tree.expandAll()
tree.collapseAll()
tree.expand('src')
tree.collapse('src')

// Select / deselect / Seleccionar / deseleccionar
tree.select('index')
tree.deselect()

// Get checked IDs / Obtener IDs marcados
tree.getChecked()  // → ['id1', 'id2', ...]

// Register listeners / Registrar listeners
tree.on('select', (e) => console.log(e.detail.node.id))
tree.on('toggle', (e) => console.log(e.detail.expanded))
tree.on('check',  (e) => console.log(e.detail.checkedIds))
tree.off('select', handler)
```

---

## DOM Events / Eventos DOM

```js
el.addEventListener('mts:tree:select', (e) => console.log(e.detail));
el.addEventListener('mts:tree:toggle', (e) => console.log(e.detail));
el.addEventListener('mts:tree:check',  (e) => console.log(e.detail));
```

---
