# MTS.StatusBar

Bottom status bar with free `start` / `center` / `end` slots. For IDE-style apps and dashboards — status dots, tags, clickable items and separators. It is not navigation — it is context.

Slot content is supplied by you (HTML string or `Element`); the component only lays out the three slots and applies the color variant.

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
  start:
    '<span class="mts-statusbar__item">' +
      '<span class="mts-statusbar__dot mts-statusbar__dot--success"></span>' +
      'Connected' +
    '</span>' +
    '<span class="mts-statusbar__sep"></span>' +
    '<span class="mts-statusbar__item">' +
      '<i class="mts-icon mts-icon-git-branch"></i> main' +
    '</span>',
  end:
    '<span class="mts-statusbar__tag mts-statusbar__tag--primary">DEV</span>' +
    '<span class="mts-statusbar__sep"></span>' +
    '<span class="mts-statusbar__item">v1.0.0</span>'
});
```

The constructor accepts a CSS selector string or an `Element` as the first argument. If the target is not found, it logs an error and returns without building.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `start` | `string \| Element` | `null` | Left slot content (HTML string or `Element`) |
| `center` | `string \| Element` | `null` | Center slot content. When `null`, a spacer is rendered instead so `start` and `end` push apart |
| `end` | `string \| Element` | `null` | Right slot content (HTML string or `Element`) |
| `variant` | `string` | `'default'` | Color variant: `'default'` · `'primary'` · `'inverse'` |
| `border` | `boolean` | `true` | Render the top border |
| `height` | `string` | `null` | Override the bar height (CSS value). When omitted, uses `--mts-statusbar-height` (28px) |

String content is sanitized through `MTS.Sanitize.html()` when that helper is available; otherwise it is injected as-is. `Element` content is appended directly.

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `setStart(content)` | `this` | Replace the `start` slot content (HTML string or `Element`) |
| `setCenter(content)` | `this` | Replace the `center` slot content |
| `setEnd(content)` | `this` | Replace the `end` slot content |
| `setVariant(variant)` | `this` | Change the color variant (`'default'` · `'primary'` · `'inverse'`) |
| `getSlot(name)` | `Element` | Return the slot Element — `'start'` · `'center'` · `'end'` |
| `destroy()` | `void` | Clear the content, class and inline style from the host element |

`setStart` / `setCenter` / `setEnd` / `setVariant` return the instance, so they can be chained.

```js
const sb = new MTS.StatusBar('#my-statusbar', {
  start: '<span class="mts-statusbar__item">Ready</span>'
});

// Update slots individually
sb.setEnd('<span class="mts-statusbar__item">Ln 12, Col 4</span>');

// Change variant on the fly
sb.setVariant('primary');

// Direct reference to the slot element
const el = sb.getSlot('start');   // returns .mts-statusbar__start

// Destroy
sb.destroy();
```

> Note: `setCenter` only has an effect when the instance was built with a non-`null` `center`. When `center` starts as `null`, a spacer is rendered in its place and there is no center slot element to update.

---

## CSS Classes

Slot content is markup you provide. These helper classes ship with the stylesheet:

| Class | Description |
|-------|-------------|
| `.mts-statusbar__item` | A status item |
| `.mts-statusbar__item--clickable` | Pointer cursor / interactive item |
| `.mts-statusbar__dot` | Status dot |
| `.mts-statusbar__dot--success` · `--warning` · `--danger` · `--muted` | Dot color |
| `.mts-statusbar__tag` | Tag / pill |
| `.mts-statusbar__tag--primary` · `--success` · `--warning` · `--danger` | Tag color |
| `.mts-statusbar__sep` | Vertical separator between items |

Structural classes applied by the component: `.mts-statusbar` (host), `.mts-statusbar--primary` / `.mts-statusbar--inverse` (variants), `.mts-statusbar--no-border`, and the slot wrappers `.mts-statusbar__start` / `.mts-statusbar__center` / `.mts-statusbar__end` / `.mts-statusbar__spacer`.

---

## Accessibility

- For `--clickable` items, ensure they are reachable by keyboard (use a real control such as `<button>`, or add `role` / `tabindex` + key handling).
- Status dots are decorative; convey the state in adjacent text.

---

## Internationalization

The component renders no chrome text of its own — every slot is filled with content you supply, so there is nothing to translate at runtime. The bundled `matios-ui-statusbar-i18n.js` registers only the `MTS.StatusBar.demo.*` strings used by the demo page, under the global language set by `MTS.setLanguage('es' | 'en' | 'pt')`. There is no per-instance locale option.
