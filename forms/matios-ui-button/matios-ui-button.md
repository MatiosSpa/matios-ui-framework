# MTS.Button

Button component with variants, sizes, icons, loading state and custom styles. The same file also ships three companions: `MTS.ButtonGroup`, `MTS.MenuButton` (dropdown) and `MTS.SplitButton` (primary action + menu).

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-button.css">
<script src="matios-ui-button.js"></script>

<!-- Optional: MTS.MenuButton / MTS.SplitButton use MTS.Icon for the chevron (falls back to a plain ▾) -->
<script src="matios-ui-icons.js"></script>

<!-- Optional: i18n for MenuButton's default label + demo strings -->
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-button-i18n.js"></script>
```

---

## Usage

### JavaScript

The container only needs to exist in the DOM:

```js
const btn = new MTS.Button('#my-btn', {
  label:   'Save changes',
  variant: 'primary',
  shadow:  true,
  onClick: function (event, instance) {
    instance.setLoading(true);
    instance.setLabel('Saving...');
    setTimeout(function () {
      instance.setLoading(false);
      instance.setLabel('Saved ✓');
    }, 1500);
  },
});
```

### HTML with `data-*`

Declare the button with `data-*` attributes, then instantiate:

```html
<button id="btn-save" data-variant="primary" data-label="Save" data-shadow></button>

<script>
  new MTS.Button('#btn-save', {
    onClick: function (event, instance) {
      instance.setLoading(true);
      setTimeout(function () { instance.setLoading(false); }, 1500);
    },
  });
</script>
```

Available `data-*` attributes: `data-label`, `data-variant`, `data-size`, `data-disabled`, `data-loading`,
`data-block`, `data-round`, `data-icon-only`, `data-shadow`, `data-ring` (boolean attributes activate by presence).

---

## Options

All options are passed as the second argument to the constructor.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | `string` | button text | Visible text |
| `variant` | `string` | `'primary'` | `'primary'` · `'secondary'` · `'ghost'` · `'danger'` · `'success'` · `'warning'` · `'link'` |
| `size` | `string` | `''` | `'xs'` · `'sm'` · `''` · `'lg'` · `'xl'` |
| `block` | `boolean` | `false` | Full width |
| `round` | `boolean` | `false` | Pill border-radius |
| `iconOnly` | `boolean` | `false` | Square padding, no text |
| `iconLeft` | `string` | `null` | Left icon HTML |
| `iconRight` | `string` | `null` | Right icon HTML |
| `disabled` | `boolean` | `false` | Disables interaction |
| `loading` | `boolean` | `false` | Shows a spinner |
| `shadow` | `boolean` | `false` | Colored shadow |
| `ring` | `boolean` | `false` | Semi-transparent ring |
| `className` | `string` | `''` | Extra CSS classes |
| `style` | `object` | `null` | Inline styles |
| `onClick` | `function` | — | Fires on click — `(event, instance)` |

---

## API

| Method | Description |
|--------|-------------|
| `enable()` / `disable()` | Enable / disable interaction |
| `setLoading(bool)` | Show / hide the loading spinner |
| `setLabel(text)` | Change the label at runtime |
| `setVariant(name)` | Change the variant at runtime |
| `setShadow(bool)` / `setRing(bool)` | Toggle shadow / ring |
| `destroy()` | Destroy the instance |

```js
const btn = new MTS.Button('#my-btn', { label: 'Save' });
btn.setLoading(true);
btn.setVariant('secondary');
```

### MTS.ButtonGroup

Groups buttons visually — shared borders, no gap, border-radius only on the edges. Each object accepts the same
options as `MTS.Button`:

```js
const group = new MTS.ButtonGroup('#my-group', [
  { label: 'Day',   variant: 'secondary', onClick: function () {} },
  { label: 'Week',  variant: 'secondary', onClick: function () {} },
  { label: 'Month', variant: 'primary',   onClick: function () {} },
]);

group.setActive(2);
group.getButton(0).disable();
group.getButtons(); // → [MTS.Button, …]
```

`MTS.ButtonGroup(container, buttons, options)` — `buttons` is an array of `MTS.Button` option objects; `options` accepts `size` (uniform size for the group) and `activeOnClick` (default `true` — the clicked button gets `mts-btn--active`).

---

## MTS.MenuButton

A trigger button that opens a dropdown menu. Built into the container you pass (element-first): it appends its own wrapper, trigger and list.

```js
const menu = new MTS.MenuButton('#toolbar', {
  label:   'Actions',
  variant: 'secondary',
  items: [
    { label: 'Edit',      icon: MTS.Icon.get('edit-2'), onClick: function () {} },
    { label: 'Duplicate', icon: MTS.Icon.get('copy'),   onClick: function () {} },
    '---',                                                      // separator
    { label: 'Delete',    icon: MTS.Icon.get('trash'), danger: true, onClick: function () {} },
  ],
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | `string` | localized `'Actions'` | Trigger label |
| `variant` | `string` | `'secondary'` | Trigger variant |
| `size` | `string` | `''` | Trigger size |
| `iconLeft` | `string` | `null` | Left icon HTML on the trigger |
| `iconRight` | `string` | chevron icon | Right icon HTML (defaults to `chevron-down`, or `▾` without `MTS.Icon`) |
| `disabled` | `boolean` | `false` | Disable the trigger |
| `items` | `array` | `[]` | Menu items (see below) |

**Item shape:** `{ label, icon, danger, disabled, onClick }`, or the string `'---'` for a separator. Selecting an item closes the menu, then calls its `onClick`.

| Method | Description |
|--------|-------------|
| `open()` / `close()` / `toggle()` | Control the menu |
| `setItems(items)` | Replace the items and rebuild |
| `getButton()` | The underlying `MTS.Button` trigger instance |
| `destroy()` | Remove the wrapper from the DOM |

The menu closes automatically on an outside click.

---

## MTS.SplitButton

A primary action button plus an arrow that opens a menu of secondary options. Built into the container you pass.

```js
const split = new MTS.SplitButton('#toolbar', {
  label:    'Save',
  variant:  'primary',
  iconLeft: MTS.Icon.get('save'),
  onClick:  function () { save(); },              // primary action
  items: [
    { label: 'Save draft',       onClick: function () {} },
    { label: 'Save and publish', onClick: function () {} },
    '---',
    { label: 'Discard', danger: true, onClick: function () {} },
  ],
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | `string` | `''` | Main button label |
| `variant` | `string` | `'primary'` | Variant of both the main and arrow buttons |
| `size` | `string` | `''` | Size of both buttons |
| `iconLeft` | `string` | `null` | Left icon HTML on the main button |
| `disabled` | `boolean` | `false` | Disable both buttons |
| `onClick` | `function` | — | Primary action (main button click) |
| `items` | `array` | `[]` | Menu items — same shape as `MTS.MenuButton` |

| Method | Description |
|--------|-------------|
| `open()` / `close()` / `toggle()` | Control the menu |
| `setItems(items)` | Replace the items and rebuild |
| `getMainButton()` / `getArrowButton()` | The underlying `MTS.Button` instances |
| `destroy()` | Remove the wrapper from the DOM |

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onClick(fn)` (constructor) | `(event, instance)` | On every click — recommended approach |

Also dispatched as a DOM event for external listeners:

```js
document.getElementById('my-btn')
  .addEventListener('mts:button:click', function (e) { console.log(e.detail.button); });
```

---

## Accessibility

- When the host is a native `<button>`/`<a>`, it stays in place — focusable and activatable with `Enter`/`Space` out of the box, and `disabled` works natively.
- When the host is any other element (`<span>`, `<div>`, …), the component adds button semantics **without changing the DOM**: `role="button"`, `tabindex` (`0` enabled / `-1` disabled), `Enter`/`Space` → click, and `aria-disabled`. So a non-native host is still keyboard-operable and announced as a button.
- For `iconOnly` buttons, provide an accessible name (e.g. `aria-label`) since there is no visible text.
- `disabled` and `loading` block interaction; `loading` should keep the accessible name meaningful.

> **Host note:** `MTS.Button` operates on the element you pass (element-first). Passing a native `<button>` is recommended; non-native hosts now get full button semantics instead of just the visual styling.

---

## Internationalization (i18n)

`MTS.Button` has almost no chrome of its own — the button `label` is developer-supplied, so it is not localized. The only localized string is **`MTS.MenuButton`'s default label** (`Actions`), read from the `MTS.Button` namespace of the active language with an English fallback. Bundled languages: `es`, `en`, `pt`.

```js
MTS.setLanguage('en');   // 'es' | 'en' | 'pt' — set once at startup, before creating components
```

Passing `label` to `MTS.MenuButton` overrides it for that instance. The optional file `matios-ui-button-i18n.js` also carries the strings the demo page uses (under `MTS.Button.demo`).
