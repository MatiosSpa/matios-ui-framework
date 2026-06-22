# MTS.Modal

Full-featured dialog modal with sizes, scrollable body, footer buttons, focus trap and convenience helpers (confirm, alert, prompt).

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-modal.css">
<script src="matios-ui-modal.js"></script>
```

---

## Usage

```js
// Basic
const modal = new MTS.Modal({
  title: 'Edit user',
  body:  '<div id="user-form"></div>',
  size:  'md',
  buttons: [
    { label: 'Cancel', variant: 'ghost',   close: true },
    { label: 'Save',   variant: 'primary', onClick: function () { saveUser(); } },
  ],
  onShown:  function () { initForm('#user-form'); },
  onHidden: function () { console.log('closed'); },
});
modal.show();

// Large, scrollable
new MTS.Modal({ title: 'Terms of service', body: longContent, size: 'lg', scrollable: true,
  buttons: [{ label: 'Accept', variant: 'primary', close: true }] }).show();

// Static — the user must click a button
new MTS.Modal({ title: 'Required action', body: '<p>You must complete this step.</p>', static: true,
  buttons: [{ label: 'Done', variant: 'primary', close: true }] }).show();
```

### Convenience helpers

```js
MTS.Modal.confirm({
  title: 'Delete record', message: 'This action cannot be undone.',
  confirm: 'Delete', cancel: 'Cancel', danger: true,
  onConfirm: function () { deleteRecord(); },
});

MTS.Modal.alert({ title: 'Done', message: 'The record was saved successfully.' });

MTS.Modal.prompt({ title: 'Rename file', placeholder: 'New name...', value: currentName,
  onConfirm: function (value) { renameFile(value); } });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | `''` | Modal header title |
| `body` | `string \| Element` | `''` | Body content |
| `footer` | `string \| Element` | `null` | Footer HTML (overrides `buttons`) |
| `buttons` | `array` | `[]` | Footer buttons (see schema below) |
| `size` | `string` | `'md'` | `'sm'` · `'md'` · `'lg'` · `'xl'` · `'fullscreen'` |
| `radius` | `string` | `'none'` | Panel border-radius — `'none'` · `'sm'` · `'md'` · `'lg'` · `'xl'` |
| `closable` | `boolean` | `true` | Show the × button and allow `Esc` |
| `backdrop` | `boolean` | `true` | Click outside closes the modal |
| `scrollable` | `boolean` | `false` | Scrollable body |
| `centered` | `boolean` | `true` | Vertically centered |
| `static` | `boolean` | `false` | Do not close on `Esc` or backdrop |
| `onShow` | `function` | — | Before show (return `false` to cancel) |
| `onShown` | `function` | — | After fully visible |
| `onHide` | `function` | — | Before hide (return `false` to cancel) |
| `onHidden` | `function` | — | After fully hidden |

### Button schema

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Button text |
| `variant` | `string` | `'primary'` · `'secondary'` · `'ghost'` · `'danger'` |
| `close` | `boolean` | Close the modal on click |
| `disabled` | `boolean` | Disables the button |
| `onClick` | `function` | Click handler |

---

## API

| Method | Description |
|--------|-------------|
| `show()` / `hide()` / `toggle()` | Control visibility |
| `setTitle(text)` | Update the title |
| `setBody(value)` | Update the body (string or Element) |
| `setButtonState(id, patch)` | Update a button (`{ disabled, label }`) |
| `on(event, cb)` / `off(event, cb)` | Listen to `'show'` / `'shown'` / `'hide'` / `'hidden'` |
| `destroy()` | Destroy the instance |

```js
const modal = new MTS.Modal({ title: 'Edit' });
modal.show();
modal.setButtonState('btn-save', { disabled: true, label: 'Saving...' });
```

> `setTitle`/`setBody` with a string set `textContent` (safe for untrusted data); pass an `Element` to inject markup.

---

## Events

| Method | DOM event | When |
|--------|-----------|------|
| `onShow` | `mts:modal:show` | Before show (cancelable) |
| `onShown` | `mts:modal:shown` | Fully visible |
| `onHide` | `mts:modal:hide` | Before hide (cancelable) |
| `onHidden` | `mts:modal:hidden` | Fully hidden |

```js
document.addEventListener('mts:modal:shown', function (e) { console.log('shown'); });
```

---

## Accessibility

- Focus is trapped inside the modal while open and restored to the trigger on close; `Esc` closes (unless `static`).
- The dialog exposes its title as the accessible name; `closable: false` requires an explicit in-content close path.

---

## Changelog

### 2026-06-21
- Fix: stacked modals — a modal opened over another now gets an incremental z-index so its backdrop covers the modal below (you could previously click through to the lower modal's buttons). The body scroll-lock is released only when the last modal closes.

### Initial
- Dialog modal with sizes/radius, scrollable/centered/static modes, footer buttons or custom footer, lifecycle
  hooks, `confirm` / `alert` / `prompt` helpers, focus trap, and `show` / `hide` / `setTitle` / `setBody` / `setButtonState`.
