# MTS.CommandPalette

⌘K-style command palette with keyboard navigation, groups, icons, shortcuts, and local or async search.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-commandpalette.css">
<script src="matios-ui-commandpalette.js"></script>
```

---

## Usage

`MTS.CommandPalette` takes no selector — it appends itself to `document.body` and opens with ⌘K / Ctrl+K.

```js
const cp = new MTS.CommandPalette({
  placeholder: 'Search commands...',
  commands: [
    { id: 'go-home', label: 'Go to Home', description: 'Navigate to the home page', group: 'Navigation',
      icon: '<svg>...</svg>', shortcut: '⌘H', keywords: ['home', 'start'], action: function () { router.push('/'); } },
    { id: 'go-settings', label: 'Settings', group: 'Navigation', shortcut: '⌘,', action: function () { router.push('/settings'); } },
    { id: 'create-file', label: 'Create new file', group: 'Actions', action: function () { createFile(); } },
    { id: 'delete', label: 'Delete selected', group: 'Actions', disabled: true },
  ],
  onSelect: function (e) { console.log('selected:', e.detail.id); },
});
```

### Async search

When `onSearch` is registered it replaces local search. It must return an array or a Promise:

```js
new MTS.CommandPalette({
  onSearch: async function (e) {
    const query = e.detail.query;
    if (!query) return defaultCommands;
    return fetch('/api/search?q=' + query).then(function (r) { return r.json(); });
  },
  onSelect: function (e) { console.log(e.detail.id); },
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `commands` | `array` | `[]` | Command list (see schema below) |
| `placeholder` | `string` | localized | Input placeholder |
| `hotkey` | `string` | `'k'` | Hotkey letter — triggers ⌘K / Ctrl+K |
| `overlay` | `boolean` | `true` | Show the dark backdrop |
| `maxResults` | `number` | `8` | Max visible results |
| `onOpen` | `function` | — | Fires when the palette opens |
| `onClose` | `function` | — | Fires when the palette closes |
| `onSelect` | `function` | — | Fires on command selection — `{ id, command }` |
| `onSearch` | `function` | — | `(query) → commands[]` — async search override (replaces local search) |

### Command schema

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `string` | Display text |
| `description` | `string` | Subtitle |
| `group` | `string` | Group label |
| `icon` | `string` | Icon HTML |
| `shortcut` | `string` | Keyboard shortcut hint |
| `keywords` | `string[]` | Extra search terms |
| `action` | `function` | `(command)` — executed on select |
| `disabled` | `boolean` | Excludes from results |

---

## API

| Method | Description |
|--------|-------------|
| `open()` / `close()` / `toggle()` | Control the palette |
| `setCommands(array)` | Replace the commands |
| `addCommands(array)` | Add commands |
| `on(event, cb)` / `off(event, cb)` | Listen to `'select'` / `'open'` / `'close'` |
| `destroy()` | Destroy and unbind the hotkey |

```js
const cp = new MTS.CommandPalette({ commands: [/* … */] });
cp.toggle();
cp.on('select', function (e) { console.log(e.detail.id); });
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onSelect` | `mts:commandpalette:select` | `{ id, command }` |
| `onOpen` | `mts:commandpalette:open` | — |
| `onClose` | `mts:commandpalette:close` | — |

```js
document.addEventListener('mts:commandpalette:select', function (e) { console.log(e.detail.id, e.detail.command); });
```

---

## Accessibility

- Fully keyboard-driven: the hotkey opens it, arrows move through results, `Enter` runs the command, `Esc` closes.
- The search input is focused on open; `disabled` commands are excluded from results and navigation.

---

## Changelog

### 2026-06-29
- Search icon migrated to `MTS.Icon` (`search`); dropped inline SVG. Requires `matios-ui-icons.js`.

### Initial
- ⌘K command palette with grouped results, icons, shortcut hints, keywords, local or async (`onSearch`) search,
  configurable hotkey/overlay/maxResults, and `open` / `close` / `toggle` / `setCommands` / `addCommands`.
