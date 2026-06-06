# MTS.Drawer

Sliding side panel with backdrop, four positions, four sizes, static mode and programmatic control.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-drawer.css">
<script src="matios-ui-drawer.js"></script>
```

---

## Usage

`MTS.Drawer` does not take a selector — it appends itself to `document.body`.

```js
// Basic
const drawer = new MTS.Drawer({
  title:    'Filters',
  content:  '<div id="filter-form"></div>',
  position: 'right',
  size:     'md',
  onOpen:   function () { console.log('opened'); },
  onClose:  function () { console.log('closed'); },
});
drawer.show();

// Left navigation
new MTS.Drawer({ title: 'Navigation', position: 'left', size: 'sm', content: '<nav>...</nav>' });

// With footer + static mode (must click a button to close)
const confirmDrawer = new MTS.Drawer({
  title:   'Delete record',
  content: '<p>Are you sure you want to delete this record?</p>',
  footer:  '<button class="mts-btn mts-btn--ghost" data-action="cancel">Cancel</button>' +
           '<button class="mts-btn mts-btn--danger" data-action="confirm">Confirm</button>',
  static:  true,
});
// Wire the footer buttons after creation (avoid inline handlers)
confirmDrawer.el.querySelector('[data-action="cancel"]').addEventListener('click', function () { confirmDrawer.hide(); });

// Bottom sheet
new MTS.Drawer({ title: 'Options', position: 'bottom', size: 'sm', content: '<ul>...</ul>' });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | `''` | Drawer header title |
| `content` | `string \| Element` | `''` | Body content |
| `footer` | `string \| Element` | `null` | Footer content |
| `position` | `string` | `'right'` | `'left'` · `'right'` · `'top'` · `'bottom'` |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` · `'full'` |
| `backdrop` | `boolean` | `true` | Show the backdrop overlay |
| `closable` | `boolean` | `true` | Show the close button |
| `static` | `boolean` | `false` | Do not close on `Esc` or backdrop click |
| `onOpen` | `function` | — | Fires when the drawer opens |
| `onClose` | `function` | — | Fires when the drawer closes |

---

## API

| Method | Description |
|--------|-------------|
| `show()` / `hide()` / `toggle()` | Control visibility |
| `setTitle(text)` | Update the header title |
| `setContent(value)` | Update the body content |
| `on(event, cb)` | Listen to `'open'` / `'close'` |
| `destroy()` | Destroy and remove from the DOM |

```js
const drawer = new MTS.Drawer({ title: 'Settings' });
drawer.show();
drawer.setContent('<p>New content</p>');
```

---

## Events

| Method | DOM event | When |
|--------|-----------|------|
| `onOpen` | `mts:drawer:open` | The drawer opens |
| `onClose` | `mts:drawer:close` | The drawer closes |

```js
document.addEventListener('mts:drawer:open', function (e) { console.log('opened'); });
```

---

## Accessibility

- While open, focus is trapped inside the drawer and `Esc` closes it (unless `static`); closing returns focus.
- The backdrop click closes the drawer in non-static mode; provide an explicit close control for `closable: false`.

---

## Changelog

### Initial
- Sliding drawer with left/right/top/bottom positions, sm/md/lg/full sizes, backdrop, static mode, footer,
  `show` / `hide` / `toggle` / `setTitle` / `setContent`, and `onOpen` / `onClose`.
