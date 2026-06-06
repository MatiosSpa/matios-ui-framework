# MTS.Radio

Radio button group component — single selection with vertical or horizontal layout.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-radio.css">
<script src="matios-ui-radio.js"></script>
```

---

## Usage

```js
// Vertical (default)
new MTS.Radio('#radio-priority', {
  name:  'priority',
  value: 'medium',
  options: [
    { value: 'high',   label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low',    label: 'Low' },
  ],
  onChange: function (e) { console.log(e.detail.value); },
});

// Horizontal, with a disabled option
new MTS.Radio('#radio-plan', {
  horizontal: true,
  name:       'plan',
  value:      'free',
  options: [
    { value: 'free',       label: 'Free' },
    { value: 'pro',        label: 'Pro' },
    { value: 'enterprise', label: 'Enterprise (coming soon)', disabled: true },
  ],
});
```

The container only needs to exist in the DOM (`<div id="radio-priority"></div>`).

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `options` | `array` | `[]` | `[{ value, label, disabled? }]` |
| `value` | `string` | `null` | Initially selected value |
| `name` | `string` | auto | Radio group name (unique per group) |
| `disabled` | `boolean` | `false` | Disables all radio buttons |
| `horizontal` | `boolean` | `false` | Horizontal layout |
| `onChange` | `function` | — | Fires when the selection changes — `{ value }` |

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Returns the selected value (`string \| null`) |
| `setValue(value)` | Set the selected value programmatically |

```js
const radio = new MTS.Radio('#my-radio', { options: [/* … */], value: 'a' });
radio.setValue('b');
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` | `mts:radio:change` | `{ value }` |

```js
document.getElementById('my-radio')
  .addEventListener('mts:radio:change', function (e) { console.log(e.detail.value); });
```

---

## Accessibility

- Renders real `<input type="radio">` controls sharing a `name` — arrow keys move selection within the group.
- A `disabled` option is skipped by keyboard navigation; reflect that state visually.

---

## Changelog

### Initial
- Radio group with single selection, vertical/horizontal layout, per-option disable, auto group name,
  `onChange`, and `getValue` / `setValue`.
