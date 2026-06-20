# MTS.StatusBar

Bottom status bar with free `start` / `center` / `end` slots. For IDE-style apps and dashboards — status dots, clickable items and separators.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-statusbar.css">
<script src="matios-ui-statusbar.js"></script>
```

---

## Usage

```html
<div id="my-statusbar"></div>
```

```js
new MTS.StatusBar('#my-statusbar', {
  start:  '<span class="mts-statusbar__item"><span class="mts-statusbar__dot mts-statusbar__dot--success"></span> Connected</span>',
  center: 'Ready',
  end:    '<span class="mts-statusbar__item mts-statusbar__item--clickable">UTF-8</span>',
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `start` | `string \| Element` | `null` | Left slot content |
| `center` | `string \| Element` | `null` | Center slot content |
| `end` | `string \| Element` | `null` | Right slot content |
| `variant` | `string` | `null` | Color variant |
| `height` | `string` | `null` | Override the bar height |
| `border` | `boolean` | `true` | Top border |

---

## API

| Method | Description |
|--------|-------------|
| `setStart(content)` / `setCenter(content)` / `setEnd(content)` | Update a slot (HTML string or Element) |
| `setVariant(variant)` | Change the color variant |
| `getSlot(name)` | Returns the slot Element — `'start'` · `'center'` · `'end'` |
| `destroy()` | Destroy the instance |

```js
const sb = new MTS.StatusBar('#my-statusbar', { center: 'Ready' });
sb.setEnd('Ln 12, Col 4');
new MTS.Button(sb.getSlot('end'), { label: 'Sync', size: 'sm' });
```

---

## CSS Classes

| Class | Description |
|-------|-------------|
| `.mts-statusbar__item` | A status item |
| `.mts-statusbar__item--clickable` | Pointer cursor / interactive item |
| `.mts-statusbar__dot` | Status dot |
| `.mts-statusbar__dot--success / --warning / --danger / --muted` | Dot color |
| `.mts-statusbar__sep` | Vertical separator between items |

---

## Accessibility

- For `--clickable` items, ensure they are reachable by keyboard (use a real control or add `role`/`tabindex` + key handling).
- Status dots are decorative; convey the state in adjacent text.

---

## Changelog

### Initial
- Bottom status bar with start/center/end slots, color variant, status dots, clickable items and separators,
  and `setStart` / `setCenter` / `setEnd` / `setVariant` / `getSlot` API.
