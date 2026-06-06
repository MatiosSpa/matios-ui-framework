# MTS.Popover

Rich tooltip with title, HTML body, arrow, close button and smart positioning.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-popover.css">
<script src="matios-ui-popover.js"></script>
```

---

## Usage

The first argument is the trigger element.

```js
// Click trigger
new MTS.Popover('#btn-help', {
  title: 'What is this?', content: '<p>This field requires a valid email address.</p>',
  position: 'bottom', trigger: 'click',
});

// Hover trigger
new MTS.Popover('#btn-info', {
  title: 'Pro tip', content: '<p>Use <kbd>⌘S</kbd> to save quickly.</p>', position: 'top', trigger: 'hover',
});

// No close button, custom width
new MTS.Popover('#btn-preview', {
  title: 'Preview', content: '<img src="preview.jpg" alt="Preview" class="mts-w-full">',
  closable: false, width: '320px',
  onShow: function () { console.log('opened'); },
  onHide: function () { console.log('closed'); },
});
```

### HTML with `data-*`

```html
<button id="my-btn"
  data-title="Need help?"
  data-content="Contact support at help@example.com"
  data-position="top"
  data-trigger="click">Help</button>

<script> new MTS.Popover('#my-btn'); </script>
```

Supported `data-*`: `data-title`, `data-content`, `data-position`, `data-trigger`, `data-closable`, `data-width`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | `''` | Popover header title |
| `content` | `string` | `''` | Body HTML or text |
| `position` | `string` | `'bottom'` | `'top'` · `'bottom'` · `'left'` · `'right'` |
| `trigger` | `string` | `'click'` | `'click'` · `'hover'` |
| `offset` | `number` | `8` | Gap in px between target and popover |
| `arrow` | `boolean` | `true` | Show the arrow |
| `closable` | `boolean` | `true` | Show the × in the header |
| `width` | `string` | `'260px'` | Popover width |
| `onShow` | `function` | — | Fires when the popover shows |
| `onHide` | `function` | — | Fires when the popover hides |

---

## API

| Method | Description |
|--------|-------------|
| `show()` / `hide()` / `toggle()` | Control the popover |
| `setContent(value)` | Update the body at runtime |
| `setTitle(text)` | Update the header title |
| `on(event, cb)` / `off(event, cb)` | Listen to `'show'` / `'hide'` |
| `destroy()` | Destroy the instance |

```js
const pop = new MTS.Popover('#my-btn', { title: 'Help' });
pop.setContent('<p>New content</p>');
pop.toggle();
```

---

## Events

| Method | DOM event | When |
|--------|-----------|------|
| `onShow` | `mts:popover:show` | The popover shows |
| `onHide` | `mts:popover:hide` | The popover hides |

```js
document.getElementById('my-btn')
  .addEventListener('mts:popover:show', function () { console.log('shown'); });
```

---

## Accessibility

- In `click` mode the popover is dismissible with `Esc` and outside click; focus returns to the trigger.
- Use the `focus`/`hover` trigger thoughtfully so keyboard users can reach the content.

---

## Changelog

### Initial
- Rich popover with title + HTML body, arrow, close button, click/hover triggers, smart positioning, custom width,
  `data-*` declarative API, `setContent` / `setTitle`, and `onShow` / `onHide`.
