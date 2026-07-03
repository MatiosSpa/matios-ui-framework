# MTS.Card

Generic card with header, body, footer, cover image, variants, hover/click states and action buttons. Works via CSS classes alone or with JS.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-card.css">
<script src="matios-ui-card.js"></script>
```

Optional: load `matios-ui-sanitize.js` before the card script so string `body`, `actions`/`footer` icons are sanitized. If absent, the string is injected as-is.

---

## Usage

### JavaScript

Element-first: `new MTS.Card(el|selector, options)` builds the card in place (it fully replaces the target element's content).

```js
// Basic
new MTS.Card('#my-card', {
  title:    'Product name',
  subtitle: 'Category',
  body:     '<p>Product description here.</p>',
  variant:  'elevated'
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
    { label: 'Delete', variant: 'danger', onClick: function () { remove(); } }
  ],
  footer: [
    { label: 'Cancel', variant: 'ghost',   onClick: function () { cancel(); } },
    { label: 'Buy',    variant: 'primary', onClick: function () { buy(); } }
  ],
  footerAlign: 'between'
});

// Clickable card
new MTS.Card('#card-nav', {
  title:     'Analytics',
  body:      '<p>View your metrics.</p>',
  clickable: true,
  hoverable: true,
  onClick: function (e) { router.push('/analytics'); }
});
```

### CSS only (no JS)

```html
<div class="mts-card">
  <div class="mts-card__header">
    <div class="mts-card__header-content">
      <div class="mts-card__title">Title</div>
      <div class="mts-card__subtitle">Subtitle</div>
    </div>
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

`body` accepts a DOM node directly, in addition to an HTML string:

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

When `body` is a string it is set via `innerHTML` (sanitized with `MTS.Sanitize.html` when available); when it is an `Element` it is inserted with `appendChild`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | `null` | Header title |
| `subtitle` | `string` | `null` | Header subtitle |
| `body` | `string \| HTMLElement` | `null` | Body HTML string or DOM node |
| `image` | `string` | `null` | Cover image URL |
| `imageAlt` | `string` | `''` | Image alt text |
| `imageRatio` | `string` | `'default'` | `'default'` \| `'square'` \| `'wide'` |
| `variant` | `string` | `null` | `'flat'` \| `'elevated'` \| `'outlined'` \| `'primary'` \| `'success'` \| `'warning'` \| `'danger'` |
| `size` | `string` | `''` | `''` \| `'sm'` \| `'lg'` |
| `hoverable` | `boolean` | `false` | Lift effect on hover |
| `clickable` | `boolean` | `false` | Make the card clickable (emits `click`) |
| `selected` | `boolean` | `false` | Selected state |
| `horizontal` | `boolean` | `false` | Side-by-side (image + content) layout |
| `actions` | `array` | `[]` | Header action buttons `[{ label, icon, variant, onClick }]` |
| `footer` | `array` | `[]` | Footer buttons `[{ label, icon, variant, onClick }]` |
| `footerAlign` | `string` | `'start'` | `'start'` \| `'end'` \| `'between'` \| `'center'` |
| `onClick` | `function` | — | Registered as a `click` listener; fires when a `clickable` card is clicked |

### Action / footer button objects

Each entry of `actions` and `footer` is an object:

| Key | Type | Description |
|-----|------|-------------|
| `label` | `string` | Button text |
| `icon` | `string` | Icon HTML (rendered inside `.mts-btn__icon`; sanitized when `MTS.Sanitize` is available) |
| `variant` | `string` | Button variant. Header actions default to `'ghost'`; footer buttons default to `'secondary'` |
| `onClick` | `function` | Click handler `(event) => {}`. Click propagation is stopped so it does not trigger the card `click` |

---

## API

| Method | Description |
|--------|-------------|
| `on(event, cb)` | Register a listener; returns `this` |
| `off(event, cb)` | Remove a listener; returns `this` |
| `setTitle(text)` | Update the header title (only if a title element exists); returns `this` |
| `setBody(value)` | Update the body with a string or `HTMLElement`; returns `this` |
| `setSelected(bool)` | Toggle the `mts-card--selected` state; returns `this` |
| `setLoading(bool)` | Toggle the `mts-card--loading` skeleton state; returns `this` |
| `destroy()` | Clear the card element's inner HTML |

```js
const card = new MTS.Card('#my-card', { title: 'Report', body: '<p>...</p>' });
card.on('click', function (e) { console.log(e.detail.card); });
card.setTitle('Updated report');
card.setSelected(true);
```

> Note: `setSelected` and `setLoading` toggle classes directly on the element. `setTitle` and `setBody` patch the existing DOM in place; they do not trigger a full rebuild.

---

## Events

The card exposes both a listener API and a native DOM event.

| Registration | Payload | When |
|--------------|---------|------|
| `on('click', fn)` (or the `onClick` option) | `{ event, card }` | A `clickable` card is clicked |

Listener callbacks receive `{ type: 'click', detail: { event, card } }`.

The same event is dispatched on the element as a bubbling `CustomEvent`:

```js
document.getElementById('my-card')
  .addEventListener('mts:card:click', function (e) { console.log(e.detail.card); });
```

Only a `click` event is emitted, and only when `clickable: true`.

---

## CSS Classes

| Class | Effect |
|-------|--------|
| `.mts-card` | Base card |
| `.mts-card--elevated` | Drop shadow |
| `.mts-card--outlined` | Stronger border |
| `.mts-card--flat` | No border, no shadow |
| `.mts-card--primary` / `--success` / `--warning` / `--danger` | Colored left border accent |
| `.mts-card--hoverable` | Lift on hover |
| `.mts-card--clickable` | Pointer cursor + hover/active feedback |
| `.mts-card--selected` | Selected highlight (primary border) |
| `.mts-card--horizontal` | Side-by-side layout (image + content) |
| `.mts-card--sm` / `--lg` | Size modifiers (padding + title size) |
| `.mts-card--loading` | Skeleton state for title / subtitle / body |

Structural elements: `.mts-card__image` (with `--square` / `--wide` ratio modifiers), `.mts-card__header`, `.mts-card__header-content`, `.mts-card__title`, `.mts-card__subtitle`, `.mts-card__header-actions`, `.mts-card__body`, `.mts-card__footer` (with `--start` / `--end` / `--between` / `--center` alignment modifiers).

---

## CSS Variables

The card consumes the framework base tokens (it does not define its own): `--mts-bg-surface`,
`--mts-border-color`, `--mts-radius-*`, `--mts-shadow-*`, `--mts-space-*`, `--mts-text-*`. Theme it via
`data-mts-mode` / `data-mts-accent`, or override the tokens on a scope.

---

## i18n

The card renders no built-in UI text of its own — all visible content (title, subtitle, body, button labels, image alt) is supplied by the developer. There are no localizable runtime strings in the component.

`matios-ui-card-i18n.js` is **demo-only**: it registers the strings used by `demo.html` under the `MTS.Card` namespace (`es` / `en` / `pt`) and is not required at runtime.

If you localize your own card content, set the global language once at startup:

```js
MTS.setLanguage('es'); // or 'en' | 'pt'
```

Register additional locale bundles with `MTS.registerLocale(lang, dictionary)`. There is no per-instance `locale` option.

---

## Accessibility

- Use a real heading inside `__title` (or keep it a styled `<div>` consistently) for screen-reader structure.
- For `clickable` cards, handle keyboard activation in your `onClick` consumer (e.g. add `role="button"`,
  `tabindex="0"` and trigger on `Enter`/`Space`) when the card is the primary action target.
- The cover image always has an `alt` (`imageAlt`); keep it descriptive, or empty for decorative images.
