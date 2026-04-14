# MTS.CommandPalette

[EN] ⌘K-style command palette with keyboard navigation, groups, icons, shortcuts, local and async search.
[ES] Paleta de comandos estilo ⌘K con navegación por teclado, grupos, íconos, shortcuts y búsqueda local y async.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-commandpalette.css">
<script src="matios-ui-commandpalette.js"></script>
```

---

## Options / Opciones

[EN] `MTS.CommandPalette` takes no selector — it appends itself to `document.body`.
[ES] `MTS.CommandPalette` no recibe selector — se agrega a `document.body`.

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `commands` | `array` | `[]` | [EN] Command list (see schema below) / [ES] Lista de comandos |
| `placeholder` | `string` | `'Buscar comando...'` | [EN] Input placeholder / [ES] Placeholder del input |
| `hotkey` | `string` | `'k'` | [EN] Hotkey letter — triggers ⌘K / Ctrl+K / [ES] Tecla — activa ⌘K / Ctrl+K |
| `overlay` | `boolean` | `true` | [EN] Show dark backdrop / [ES] Mostrar fondo oscuro |
| `maxResults` | `number` | `8` | [EN] Max visible results / [ES] Máximo de resultados visibles |
| `onOpen` | `function` | — | [EN] Fires when palette opens / [ES] Se dispara al abrir |
| `onClose` | `function` | — | [EN] Fires when palette closes / [ES] Se dispara al cerrar |
| `onSelect` | `function` | — | [EN] `({ id, command }) => {}` Fires on command selection / [ES] Se dispara al seleccionar |
| `onSearch` | `function` | — | [EN] `(query) => commands[]` Async search override / [ES] Búsqueda async — reemplaza la búsqueda local |

### Command schema / Esquema de comando

| Property | Type | [EN] Description / [ES] Descripción |
|----------|------|--------------------------------------|
| `id` | `string` | [EN] Unique identifier / [ES] Identificador único |
| `label` | `string` | [EN] Display text / [ES] Texto visible |
| `description` | `string` | [EN] Subtitle / [ES] Subtítulo |
| `group` | `string` | [EN] Group label / [ES] Etiqueta de grupo |
| `icon` | `string` | [EN] Icon HTML / [ES] HTML del ícono |
| `shortcut` | `string` | [EN] Keyboard shortcut hint / [ES] Atajo de teclado |
| `keywords` | `string[]` | [EN] Extra search terms / [ES] Términos extra de búsqueda |
| `action` | `function` | [EN] `(command) => {}` Executed on select / [ES] Se ejecuta al seleccionar |
| `disabled` | `boolean` | [EN] Excludes from results / [ES] Excluye de resultados |

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

[EN] When `onSearch` is registered, it replaces local search. Must return an array or a Promise.
[ES] Cuando `onSearch` está registrado, reemplaza la búsqueda local. Debe retornar un arreglo o una Promesa.

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

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Normalized to `.on()` pattern, added `id` to select detail, bilingual docs / [ES] Normalizado al patrón `.on()`, `id` en detail de select, docs bilingüe |
| 1.0.0 | [EN] Initial release / [ES] Versión inicial |
