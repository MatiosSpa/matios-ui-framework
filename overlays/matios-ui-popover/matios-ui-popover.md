# MTS.Popover

Rich tooltip with title, HTML body, arrow, close button and smart positioning.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-popover.css">
<script src="matios-ui-popover.js"></script>
```

For localized chrome, also load the shared i18n base and the component locale bundle before the component:

```html
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-popover-i18n.js"></script>
<script src="matios-ui-popover.js"></script>
```

---

## Usage

The first argument is the trigger element (a CSS selector or an `Element`); the second is the options object.

```js
// Click trigger
new MTS.Popover('#btn-help', {
  title: 'What is this?',
  content: '<p>This field requires a valid email address.</p>',
  position: 'bottom',
  trigger: 'click'
});

// Hover trigger
new MTS.Popover('#btn-info', {
  title: 'Pro tip',
  content: '<p>Use <kbd>⌘S</kbd> to save quickly.</p>',
  position: 'top',
  trigger: 'hover'
});

// No close button, custom width, event callbacks
new MTS.Popover('#btn-preview', {
  title: 'Preview',
  content: '<img src="preview.jpg" alt="Preview" class="mts-w-full">',
  closable: false,
  width: '320px',
  onShow: function () { console.log('opened'); },
  onHide: function () { console.log('closed'); }
});
```

### HTML with `data-*`

Options can also be declared on the trigger element with `data-*` attributes. Attributes are merged with the options object, and the options object wins on conflicts.

```html
<button id="my-btn"
  data-title="Need help?"
  data-content="Contact support at help@example.com"
  data-position="top"
  data-trigger="click">Help</button>

<script>
new MTS.Popover('#my-btn');
</script>
```

Supported: `data-title`, `data-content`, `data-position`, `data-trigger`, `data-closable`, `data-width`.

> The presence of `data-closable` (any value) sets `closable` to `true`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | `''` | Popover header title |
| `content` | `string` | `''` | Body HTML or text |
| `position` | `string` | `'bottom'` | `'top'` \| `'bottom'` \| `'left'` \| `'right'` |
| `trigger` | `string` | `'click'` | `'click'` \| `'hover'` \| `'manual'` |
| `offset` | `number` | `8` | Gap in px between the target and the popover |
| `arrow` | `boolean` | `true` | Show the arrow |
| `closable` | `boolean` | `true` | Show the × close button in the header |
| `width` | `string` | `'260px'` | Popover width (any CSS length) |
| `onShow` | `function` | — | Called when the popover shows |
| `onHide` | `function` | — | Called when the popover hides |

Notes:

- `content` is sanitized with `MTS.Sanitize.html()` when that helper is available; otherwise it is inserted as-is.
- `trigger: 'manual'` binds no automatic open/close handlers — you drive the popover with `show()` / `hide()` / `toggle()`. `Esc` still closes it.
- The popover is appended to `document.body`, positioned `fixed`, clamped to the viewport, and rendered at `z-index: 9000`.

---

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `show()` | `this` | Open the popover |
| `hide()` | `this` | Close the popover |
| `toggle()` | `this` | Open if closed, close if open |
| `setContent(html)` | `this` | Replace the body content at runtime |
| `on(event, cb)` | `this` | Subscribe to `'show'` / `'hide'` |
| `off(event, cb)` | `this` | Unsubscribe a callback |
| `destroy()` | — | Close the popover and remove the click handler |

```js
const pop = new MTS.Popover('#my-btn', { title: 'Help' });
pop.setContent('<p>New content</p>');
pop.toggle();
```

---

## Events

Each event fires the matching option callback (`onShow` / `onHide`), any listener added with `on(...)`, and a bubbling `CustomEvent` dispatched on the trigger element.

| Callback | `on(...)` | DOM event | When |
|----------|-----------|-----------|------|
| `onShow` | `'show'` | `mts:popover:show` | The popover shows |
| `onHide` | `'hide'` | `mts:popover:hide` | The popover hides |

```js
document.getElementById('my-btn')
  .addEventListener('mts:popover:show', function () { console.log('shown'); });
```

---

## Internationalization

The component ships a locale bundle in `matios-ui-popover-i18n.js` under the `MTS.Popover` namespace (used by the demo). It builds on the shared i18n base (`matios-ui-i18n.js`).

- Set the language once at startup with `MTS.setLanguage('en')` (`'es'` / `'en'` / `'pt'`).
- Add or override strings with `MTS.registerLocale(lang, { 'MTS.Popover': { ... } })`.
- There is no per-instance `locale` option. The popover chrome has no localizable text of its own — the close button is the `×` glyph — so no strings are read at runtime by the component itself.

```js
MTS.setLanguage('en');
```

---

## Accessibility

- In `click` mode the popover is dismissible with `Esc` and by clicking outside it.
- In `hover` mode the popover stays open while the pointer is over the trigger or the popover, so it can be reached with the mouse.
