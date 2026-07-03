# MTS.CommandPalette

⌘K-style command palette with keyboard navigation, groups, icons, shortcuts, and local or async search.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-commandpalette.css">
<script src="matios-ui-icons.js"></script>
<script src="matios-ui-sanitize.js"></script>
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-commandpalette-i18n.js"></script>
<script src="matios-ui-commandpalette.js"></script>
```

`matios-ui-icons.js` is required (the built-in search icon uses `MTS.Icon.get('search')`).
`matios-ui-sanitize.js` is optional — when present, command `icon` HTML is sanitized before insertion.
The two i18n files are optional — without them the palette falls back to its internal Spanish strings.

---

## Usage

`MTS.CommandPalette` takes no selector — it appends itself to `document.body` and binds a global hotkey (⌘K / Ctrl+K by default) that toggles it open and closed.

```js
const cp = new MTS.CommandPalette({
  placeholder: 'Search command...',
  commands: [
    { id: 'go-home', label: 'Go to Home', description: 'Navigate to the home page', group: 'Navigation',
      icon: '<svg>...</svg>', shortcut: '⌘H', keywords: ['home', 'start'], action: function () { router.push('/'); } },
    { id: 'go-settings', label: 'Settings', group: 'Navigation', shortcut: '⌘,', action: function () { router.push('/settings'); } },
    { id: 'create-file', label: 'Create new file', group: 'Actions', action: function () { createFile(); } },
    { id: 'delete', label: 'Delete selected', group: 'Actions', disabled: true }
  ],
  onSelect: function (e) { console.log('selected:', e.detail.id); }
});
```

### Async search

When `onSearch` is registered it fully replaces local filtering. It receives an event object
`{ type: 'search', detail: { query } }` and must return an array or a Promise resolving to one:

```js
new MTS.CommandPalette({
  onSearch: function (e) {
    const query = e.detail.query;
    if (!query) return defaultCommands;
    return fetch('/api/search?q=' + query).then(function (r) { return r.json(); });
  },
  onSelect: function (e) { console.log(e.detail.id); }
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `commands` | `array` | `[]` | Command list (see schema below) |
| `placeholder` | `string` | localized `'Buscar comando...'` | Input placeholder |
| `hotkey` | `string` | `'k'` | Hotkey letter — combined with ⌘ / Ctrl to toggle the palette |
| `overlay` | `boolean` | `true` | Reserved flag (the dark backdrop always renders) |
| `maxResults` | `number` | `8` | Max visible results |
| `onOpen` | `function` | — | Registered as an `open` listener |
| `onClose` | `function` | — | Registered as a `close` listener |
| `onSelect` | `function` | — | Registered as a `select` listener — payload `{ id, command }` |
| `onSearch` | `function` | — | Async search override — `(e) → commands[] \| Promise<commands[]>` (replaces local search) |

### Command schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier (echoed in the `select` payload) |
| `label` | `string` | Display text (searched) |
| `description` | `string` | Subtitle (searched) |
| `group` | `string` | Group label — headers group the results (searched) |
| `icon` | `string` | Icon HTML (sanitized via `MTS.Sanitize` when available) |
| `shortcut` | `string` | Keyboard shortcut hint shown on the right |
| `keywords` | `string[]` | Extra search terms |
| `action` | `function` | `(command)` — executed on select, after the palette closes |
| `disabled` | `boolean` | Excludes the command from results and navigation |

---

## API

| Method | Description |
|--------|-------------|
| `open()` | Render and open the palette |
| `close()` | Close and remove the palette |
| `toggle()` | Open if closed, close if open |
| `setCommands(array)` | Replace the command list |
| `addCommands(array)` | Append to the command list |
| `on(event, cb)` | Add a listener for `'open'` / `'close'` / `'select'` / `'search'` |
| `off(event, cb)` | Remove a previously added listener |
| `destroy()` | Close the palette and unbind the global hotkey |

`open` / `close` / `toggle` / `setCommands` / `addCommands` / `on` / `off` return the instance (chainable).

```js
const cp = new MTS.CommandPalette({ commands: [/* … */] });
cp.toggle();
cp.on('select', function (e) { console.log(e.detail.id); });
```

---

## Events

Each event fires the registered callback with `{ type, detail }` and also dispatches a
bubbling `CustomEvent` on `document`.

| Option | `on()` event | DOM event | Payload (`detail`) |
|--------|--------------|-----------|--------------------|
| `onOpen` | `'open'` | `mts:commandpalette:open` | `{}` |
| `onClose` | `'close'` | `mts:commandpalette:close` | `{}` |
| `onSelect` | `'select'` | `mts:commandpalette:select` | `{ id, command }` |
| `onSearch` | `'search'` | — | called with `{ type: 'search', detail: { query } }`; no DOM event |

```js
document.addEventListener('mts:commandpalette:select', function (e) { console.log(e.detail.id, e.detail.command); });
```

Note: `onSearch` is not a passive notification — it is the search provider. Only the first
registered `search` handler is used, and its return value becomes the result list.

---

## Keyboard

| Key | Action |
|-----|--------|
| ⌘K / Ctrl+K | Toggle the palette (hotkey letter configurable via `hotkey`) |
| `↑` / `↓` | Move through results |
| `Enter` | Run the active command |
| `Esc` | Close the palette |

---

## i18n

Chrome text (input placeholder, the `ESC` badge, the footer hints, and the empty-state
messages) is read from the `MTS.CommandPalette` namespace via the global language API.
Set the language once at startup with `MTS.setLanguage('en' | 'es' | 'pt')`; ships `es`
(default), `en`, and `pt`. There is no per-instance `locale` option.

| Key | Default (es) | Used for |
|-----|--------------|----------|
| `placeholder` | `Buscar comando...` | Search input placeholder (overridden by the `placeholder` option) |
| `esc` | `ESC` | Badge inside the input and the footer close hint |
| `hintNavigate` | `navegar` | Footer `↑↓` hint |
| `hintRun` | `ejecutar` | Footer `↵` hint |
| `hintClose` | `cerrar` | Footer `ESC` hint |
| `noResults` | `Sin resultados para "{query}"` | Empty state while searching (`{query}` is substituted) |
| `empty` | `No hay comandos disponibles` | Empty state with no query |

The search input placeholder can be overridden per instance with the `placeholder` option.

---

## Accessibility

- Fully keyboard-driven: the hotkey opens it, arrows move through results, `Enter` runs the command, `Esc` closes.
- The search input is autofocused on open; `disabled` commands are excluded from results and navigation.
- The input uses `autocomplete="off"` and `spellcheck="false"`.
