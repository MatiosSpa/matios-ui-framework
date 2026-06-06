# MTS.Card

Generic card with header, body, footer, cover image, variants, hover/click states and action buttons. Works via CSS classes alone or with JS.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-card.css">
<script src="matios-ui-card.js"></script>
```

---

## Usage

### JavaScript

```js
// Basic
new MTS.Card('#my-card', {
  title:    'Product name',
  subtitle: 'Category',
  body:     '<p>Product description here.</p>',
  variant:  'elevated',
});

// With image, header actions and footer
new MTS.Card('#card-product', {
  title:      'Mountain Trek',
  subtitle:   'Footwear',
  image:      '/img/product.jpg',
  imageRatio: 'wide',
  body:       '<p>Premium hiking boots.</p>',
  actions: [
    { label: 'Edit',   variant: 'ghost',  onClick: function () { edit(); } },
    { label: 'Delete', variant: 'danger', onClick: function () { remove(); } },
  ],
  footer: [
    { label: 'Cancel', variant: 'ghost',   onClick: function () { cancel(); } },
    { label: 'Buy',    variant: 'primary', onClick: function () { buy(); } },
  ],
  footerAlign: 'between',
});

// Clickable card
new MTS.Card('#card-nav', {
  title:     'Analytics',
  body:      '<p>View your metrics.</p>',
  clickable: true,
  hoverable: true,
  onClick: function (e) { router.push('/analytics'); },
});

// Sharp card (Linear/Jira style) — opt-in border & radius
new MTS.Card('#card-sharp', {
  title:  'My Card',
  body:   '<p>...</p>',
  radius: 'none',
  border: '1',
});
```

### CSS only (no JS)

```html
<div class="mts-card">
  <div class="mts-card__header">
    <div class="mts-card__title">Title</div>
    <div class="mts-card__subtitle">Subtitle</div>
  </div>
  <div class="mts-card__body">
    <p>Card body content.</p>
  </div>
  <div class="mts-card__footer">
    <button class="mts-btn mts-btn--primary">Action</button>
  </div>
</div>
```

### `body` as an HTMLElement

`body` accepts a DOM node directly (no workarounds):

```js
const content = document.createElement('div');
const title = document.createElement('p');
title.className = 'mts-text--semibold';
title.textContent = 'Period summary';
content.appendChild(title);

new MTS.Card('#card-report', { title: 'Monthly sales', body: content });

// Also works with setBody()
const card = new MTS.Card('#my-card', { title: 'Report' });
card.setBody(document.createElement('table'));
```

> If `body` is an `HTMLElement` and a method that triggers `_build()` is called (e.g. `setTitle()`), the node is re-appended automatically — it is not lost.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | `null` | Header title |
| `subtitle` | `string` | `null` | Header subtitle |
| `body` | `string \| HTMLElement` | `null` | Body HTML string or DOM node |
| `image` | `string` | `null` | Cover image URL |
| `imageAlt` | `string` | `''` | Image alt text |
| `imageRatio` | `string` | `'default'` | `'default'` · `'square'` · `'wide'` |
| `variant` | `string` | `null` | `'flat'` · `'elevated'` · `'outlined'` · `'primary'` · `'success'` · `'warning'` · `'danger'` |
| `size` | `string` | `''` | `''` · `'sm'` · `'lg'` |
| `hoverable` | `boolean` | `false` | Lift effect on hover |
| `clickable` | `boolean` | `false` | Make the card clickable |
| `selected` | `boolean` | `false` | Selected state |
| `horizontal` | `boolean` | `false` | Side-by-side (image + content) layout |
| `actions` | `array` | `[]` | Header action buttons `[{ label, icon, variant, onClick }]` |
| `footer` | `array` | `[]` | Footer buttons `[{ label, icon, variant, onClick }]` |
| `footerAlign` | `string` | `'start'` | `'start'` · `'end'` · `'between'` · `'center'` |
| `radius` | `string` | `null` | **Opt-in** corner radius: `'none'` · `'xs'` · `'sm'` · `'md'` · `'lg'` · `'xl'` · `'full'`. `null` = default (radius-lg). Invalid → ignored (warning) |
| `border` | `string` | `null` | **Opt-in** border: `'none'` · `'1'` · `'2'` · `'3'` (number accepted). `null` = default (base border). Invalid → ignored (warning) |
| `onClick` | `function` | — | Fires when a clickable card is clicked |

---

## API

| Method | Description |
|--------|-------------|
| `on(event, cb)` / `off(event, cb)` | Register / remove listeners |
| `setTitle(text)` | Update the header title |
| `setBody(value)` | Update the body (string or `HTMLElement`) |
| `setSelected(bool)` | Toggle the selected state |
| `setLoading(bool)` | Toggle the loading skeleton |
| `setRadius(value)` | Set the corner radius opt-in (`'none'…'full'` \| `null`). Idempotent |
| `setBorder(value)` | Set the border opt-in (`'none'\|'1'\|'2'\|'3'` \| `null`). Idempotent |
| `destroy()` | Clear the card DOM |

```js
const card = new MTS.Card('#my-card', { ... });
card.on('click', function (e) { console.log(e.detail.card); });
card.setRadius('none');
card.setBorder('1');
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onClick(fn)` / `on('click', fn)` | `{ card, event }` | A `clickable` card is clicked |

Also dispatched as a DOM event for external integration:

```js
document.getElementById('my-card')
  .addEventListener('mts:card:click', function (e) { console.log(e.detail.card); });
```

---

## CSS Classes

| Class | Effect |
|-------|--------|
| `.mts-card` | Base card |
| `.mts-card--elevated` | Drop shadow |
| `.mts-card--outlined` | Border only |
| `.mts-card--flat` | No border, no shadow |
| `.mts-card--primary / --success / --warning / --danger` | Colored left border accent |
| `.mts-card--hoverable` | Lift on hover |
| `.mts-card--clickable` | Pointer cursor |
| `.mts-card--selected` | Selected highlight |
| `.mts-card--horizontal` | Side-by-side layout |
| `.mts-card--sm / --lg` | Size modifiers |
| `.mts-card--radius-{none\|xs\|sm\|md\|lg\|xl\|full}` | **Opt-in** radius (uses `--mts-radius-*` tokens). Wins over the default and the variants |
| `.mts-card--border-{none\|1\|2\|3}` | **Opt-in** border (px width, `--mts-border-color`). Wins over `--elevated`/`--flat`/`--outlined` |
| `.mts-card--no-frame` | Removes the visual frame (background + border + radius + shadow); keeps the flex-column layout. Useful when embedded in a container that already provides the frame (e.g. `MTS.DashboardGrid`, drawer, sidebar) |
| `.mts-card--accent-top-{primary\|success\|warning\|danger\|info}` | 3px decorative strip on the **top** border (matches the `mts-kpicard` pattern). Orthogonal to the color variants. Combinable with `--no-frame` |

---

## CSS Variables

The card consumes the framework base tokens (it does not define its own): `--mts-bg-surface`,
`--mts-border-color`, `--mts-radius-*`, `--mts-shadow-*`, `--mts-space-*`, `--mts-text-*`. Theme it via
`data-mts-mode` / `data-mts-accent`, or override the tokens on a scope.

---

## Accessibility

- Use a real heading inside `__title` (or keep it a styled `<div>` consistently) for screen-reader structure.
- For `clickable` cards, handle keyboard activation in your `onClick` consumer (e.g. add `role="button"`,
  `tabindex="0"` and trigger on `Enter`/`Space`) when the card is the primary action target.
- The cover image always has an `alt` (`imageAlt`); keep it descriptive or empty for decorative images.

---

## Changelog

### 2026-05-31
- New modifiers: `mts-card--radius-{none|xs|sm|md|lg|xl|full}` and `mts-card--border-{none|1|2|3}`. **Opt-in**
  control of corner radius and border without changing defaults (declared at the end of the CSS so they win by
  source order over the variants, without `!important`).
- New JS options: `radius`, `border`. New methods: `setRadius(value)`, `setBorder(value)` (idempotent; invalid
  value → ignored with a warning).
- **Backward-compatible**: if `radius`/`border` are not passed, the card is byte-for-byte identical to before.

### 2026-05-07
- `body` accepts an `HTMLElement` in addition to an HTML string.
- `setBody()` detects an `Element` and uses `appendChild` instead of `innerHTML`.
- Robust rebuild: when `body` is a DOM node, `_build()` re-appends it automatically.

### Initial
- Generic card with header, body, footer, image, variants, hover/click states and actions.
