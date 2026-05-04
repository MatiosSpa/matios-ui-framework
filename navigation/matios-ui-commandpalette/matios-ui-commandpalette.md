# MTS.CommandPalette

🇬🇧 ⌘K-style command palette with keyboard navigation, groups, icons, shortcuts, local and async search.
🇪🇸 Paleta de comandos estilo ⌘K con navegación por teclado, grupos, íconos, shortcuts y búsqueda local y async.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-commandpalette.css">
<script src="matios-ui-commandpalette.js"></script>
```

---

## Options / Opciones

🇬🇧 `MTS.CommandPalette` takes no selector — it appends itself to `document.body`.
🇪🇸 `MTS.CommandPalette` no recibe selector — se agrega a `document.body`.

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `commands` | `array` | `[]` | 🇬🇧 Command list (see schema below) / 🇪🇸 Lista de comandos |
| `placeholder` | `string` | `'Buscar comando...'` | 🇬🇧 Input placeholder / 🇪🇸 Placeholder del input |
| `hotkey` | `string` | `'k'` | 🇬🇧 Hotkey letter — triggers ⌘K / Ctrl+K / 🇪🇸 Tecla — activa ⌘K / Ctrl+K |
| `overlay` | `boolean` | `true` | 🇬🇧 Show dark backdrop / 🇪🇸 Mostrar fondo oscuro |
| `maxResults` | `number` | `8` | 🇬🇧 Max visible results / 🇪🇸 Máximo de resultados visibles |
| `onOpen` | `function` | — | 🇬🇧 Fires when palette opens / 🇪🇸 Se dispara al abrir |
| `onClose` | `function` | — | 🇬🇧 Fires when palette closes / 🇪🇸 Se dispara al cerrar |
| `onSelect` | `function` | — | 🇬🇧 `({ id, command }) => {}` Fires on command selection / 🇪🇸 Se dispara al seleccionar |
| `onSearch` | `function` | — | 🇬🇧 `(query) => commands[]` Async search override / 🇪🇸 Búsqueda async — reemplaza la búsqueda local |

### Command schema / Esquema de comando

| Property | Type | 🇬🇧 Description / 🇪🇸 Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | 🇬🇧 Unique identifier / 🇪🇸 Identificador único |
| `label` | `string` | 🇬🇧 Display text / 🇪🇸 Texto visible |
| `description` | `string` | 🇬🇧 Subtitle / 🇪🇸 Subtítulo |
| `group` | `string` | 🇬🇧 Group label / 🇪🇸 Etiqueta de grupo |
| `icon` | `string` | 🇬🇧 Icon HTML / 🇪🇸 HTML del ícono |
| `shortcut` | `string` | 🇬🇧 Keyboard shortcut hint / 🇪🇸 Atajo de teclado |
| `keywords` | `string[]` | 🇬🇧 Extra search terms / 🇪🇸 Términos extra de búsqueda |
| `action` | `function` | 🇬🇧 `(command) => {}` Executed on select / 🇪🇸 Se ejecuta al seleccionar |
| `disabled` | `boolean` | 🇬🇧 Excludes from results / 🇪🇸 Excluye de resultados |

---

## Events / Eventos

```js
const cp = new MTS.CommandPalette({
  commands: [...],
  // Fires when palette opens / Se dispara al abrir
  onOpen:  () => console.log('opened'),
  // Fires when palette closes / Se dispara al cerrar
  onClose: () => console.log('closed'),
  // Fires when a command is selected / Se dispara al seleccionar un comando
  onSelect: (e) => {
    console.log(e.detail.id);      // → 'create-file'
    console.log(e.detail.command); // → { id, label, ... }
  },
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic / Básico — opens with ⌘K / abre con ⌘K
const cp = new MTS.CommandPalette({
  placeholder: 'Search commands...',
  commands: [
    // Group: Navigation / Grupo: Navegación
    {
      id:          'go-home',
      label:       'Go to Home',
      description: 'Navigate to the home page',
      group:       'Navigation',
      icon:        '<svg>...</svg>',
      shortcut:    '⌘H',
      keywords:    ['home', 'inicio'],
      action:      () => router.push('/'),
    },
    {
      id:       'go-settings',
      label:    'Settings',
      group:    'Navigation',
      shortcut: '⌘,',
      action:   () => router.push('/settings'),
    },
    // Group: Actions / Grupo: Acciones
    {
      id:     'create-file',
      label:  'Create new file',
      group:  'Actions',
      action: () => createFile(),
    },
    {
      id:       'delete',
      label:    'Delete selected',
      group:    'Actions',
      disabled: true,
    },
  ],
  onSelect: (e) => console.log('selected:', e.detail.id),
});
```

---

## Async Search / Búsqueda async

🇬🇧 When `onSearch` is registered, it replaces local search. Must return an array or a Promise.
🇪🇸 Cuando `onSearch` está registrado, reemplaza la búsqueda local. Debe retornar un arreglo o una Promesa.

```js
const cp = new MTS.CommandPalette({
  // onSearch replaces local search / onSearch reemplaza la búsqueda local
  onSearch: async (e) => {
    const query = e.detail.query;
    if (!query) return defaultCommands;
    const results = await fetch(`/api/search?q=${query}`).then(r => r.json());
    return results;
  },
  onSelect: (e) => console.log(e.detail.id),
});
```

---

## API

```js
const cp = new MTS.CommandPalette({ ... });

// Open / close / toggle / Abrir / cerrar / alternar
cp.open()
cp.close()
cp.toggle()

// Replace commands / Reemplazar comandos
cp.setCommands([...])

// Add commands / Agregar comandos
cp.addCommands([...])

// Register / remove listeners / Registrar / eliminar listeners
cp.on('select', (e) => console.log(e.detail.id))
cp.off('select', handler)

// Destroy and unbind hotkey / Destruir y desvincular hotkey
cp.destroy()
```

---

## DOM Events / Eventos DOM

```js
document.addEventListener('mts:commandpalette:select', (e) => {
  console.log(e.detail.id, e.detail.command);
});
document.addEventListener('mts:commandpalette:open',  () => {});
document.addEventListener('mts:commandpalette:close', () => {});
```

---
