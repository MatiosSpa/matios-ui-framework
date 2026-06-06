# MTS.Button

Button component with variants, sizes, icons, loading state, groups and custom styles.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-button.css">
<script src="matios-ui-button.js"></script>
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

- Renders a real `<button>` — focusable and activatable with `Enter`/`Space` out of the box.
- For `iconOnly` buttons, provide an accessible name (e.g. `aria-label`) since there is no visible text.
- `disabled` and `loading` block interaction; `loading` should keep the accessible name meaningful.

---

## Changelog

### Initial
- Button with 7 variants, 5 sizes, left/right icons, `iconOnly`, `block`, `round`, `loading`, `shadow`, `ring`,
  `data-*` declarative API, runtime setters, `MTS.ButtonGroup`, and `mts:button:click` DOM event.
