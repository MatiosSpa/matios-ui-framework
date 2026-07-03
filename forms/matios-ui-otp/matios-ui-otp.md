# MTS.OTP

One-time code input (OTP / PIN / activation code). Individual boxes with auto-advance, smart paste, an optional expiry timer, a native resend link and an error state.

```js
new MTS.OTP(el | selector, options)
```

The component builds itself in place inside the given element. There is no `.mount()`.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-otp.css">
<script src="matios-ui-otp.js"></script>

<!-- Optional: only needed to localize the built-in text (see i18n) -->
<script src="../../base/matios-ui-i18n.js"></script>
<script src="matios-ui-otp-i18n.js"></script>
```

Without the i18n files the component works standalone using its English fallbacks.

---

## Usage

```js
new MTS.OTP('#otp', {
  length: 6,
  type: 'numeric',
  onComplete: function (code) {
    console.log(code);
  }
});

// With timer + resend link
new MTS.OTP('#otp', {
  length: 6,
  timer: 60,
  resendLabel: "Didn't get the code? Resend",
  onResend: function (reset) {
    api.resendCode().then(function () {
      reset();
    });
  }
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `length` | `number` | `6` | Number of boxes. Clamped to the range `1`–`9`. |
| `type` | `string` | `'numeric'` | `'numeric'` (digits only) or `'alphanumeric'` (letters and numbers). Any other value falls back to `'numeric'`. |
| `timer` | `number` | `null` | Expiry countdown in seconds. `null` (or omitted) means no timer. |
| `disabled` | `boolean` | `false` | Start disabled. |
| `required` | `boolean` | `false` | Opt-in for `validate()`: it fails until the code is complete. |
| `errorMessage` | `string` | `null` | Overrides the `required` message. When `null`, the localized default is used. |
| `onComplete` | `function` | — | Called when every box is filled. Receives `(code)`. |
| `onChange` | `function` | — | Called on every change. Receives `(code, complete)`. |
| `onExpire` | `function` | — | Called when the timer reaches `0`. |
| `onResend` | `function` | — | Presence renders a resend link. Receives `(resetFn)`; call `resetFn()` when your API confirms success. |
| `resendLabel` | `string` | localized `'Resend code'` | Text of the resend link. Only used when `onResend` is set. |

---

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `getValue()` | `string` | Current code, partial or complete (concatenation of all boxes). |
| `isComplete()` | `boolean` | Whether the number of entered characters equals `length`. |
| `reset()` | `this` | Clears the boxes, clears the error, restarts the timer (if any) and focuses the first box. |
| `validate()` | `boolean` | Validates `required` (fails until complete). Shows the inline error and emits `'validate'`. |
| `setError(msg)` | `this` | Applies the error state and sets the message. |
| `clearError()` | `this` | Removes the error state and clears the message. |
| `focus()` | `this` | Focuses the first empty box (or the first box if all are filled). |
| `disable()` | `this` | Disables interaction. |
| `enable()` | `this` | Re-enables interaction (no effect while expired). |
| `on(event, cb)` | `this` | Subscribes to an event (`'change'`, `'complete'`, `'expire'`, `'validate'`). |
| `off(event, cb)` | `this` | Removes a previously registered listener. |
| `destroy()` | — | Stops the timer and empties the host element. |

---

## Behavior notes

- **Auto-advance**: typing a valid character moves focus to the next box; `Backspace` clears the current box or steps back and clears the previous one; `ArrowLeft` / `ArrowRight` move between boxes.
- **Filtering**: `numeric` keeps digits only; `alphanumeric` keeps letters and digits. Invalid characters are discarded on input and on paste.
- **Paste**: pasting from any box distributes the string always starting at box 0, discarding characters invalid for the configured `type`, then focuses the next empty box (or the last box).
- **Resend link**: rendered only when `onResend` is provided. With a `timer`, the link is hidden while the countdown runs and appears on expiry; without a `timer` it is visible from the start. `onResend` receives the component's `reset` function so the consumer decides when to call it.
- **Timer**: while running it shows `m:ss` (or `Ns` under a minute). On reaching `0` the boxes are disabled, the `'expire'` event fires and `onExpire` is called.

---

## Events

Emitted both as DOM `CustomEvent`s (bubbling, on the host element) and to `on(...)` listeners. The `validate` event is delivered to `on(...)` listeners only.

| Event | Fires when | `detail` |
|-------|-----------|----------|
| `mts:otp:change` | Every change | `{ code, complete }` |
| `mts:otp:complete` | All boxes filled | `{ code }` |
| `mts:otp:expire` | Timer reached `0` | `{}` |
| `validate` (listener only) | `validate()` runs | `{ valid, errors }` |

```js
var otp = new MTS.OTP('#otp', { length: 6 });

otp.on('complete', function (e) {
  console.log(e.detail.code);
});

document.querySelector('#otp').addEventListener('mts:otp:change', function (e) {
  console.log(e.detail.code, e.detail.complete);
});
```

---

## CSS Classes

- `.mts-otp` — root element.
- `.mts-otp__boxes` — box container.
- `.mts-otp__box` — each single-character input; `.mts-otp__box--filled` when it has a value.
- `.mts-otp__timer` — countdown; `.mts-otp__timer--expired` after expiry.
- `.mts-otp__error` — inline error message.
- `.mts-otp__resend` — resend link (button).
- `.mts-otp--error` — error state on the control (red border), toggled by `setError()` / `clearError()`.
- `.mts-otp--disabled` — disabled state.

---

## i18n

The component reads its built-in text from the global language table under the namespace `MTS.OTP`. Set the language once at startup with `MTS.setLanguage('en' | 'es' | 'pt')`; the boxes' `aria-label`, the `required` message and the default resend label follow it. There is no per-instance `locale` option.

Keys under `MTS.OTP.messages`:

| Key | Default (en) | Used for |
|-----|--------------|----------|
| `required` | `This field is required` | Default `validate()` error (when `errorMessage` is `null`). |
| `boxLabel` | `Character {n} of {total}` | Per-box `aria-label`. `{n}` = box number, `{total}` = `length`. |
| `resend` | `Resend code` | Default resend link text (when `resendLabel` is not passed). |

Per instance you can override the validation error text with the `errorMessage` option and the resend link text with the `resendLabel` option; both win over the localized defaults.

Bundled locales: `es`, `en`, `pt`. Without `matios-ui-i18n.js` + `matios-ui-otp-i18n.js`, the English fallbacks shown above are used.

---

## Accessibility

- Each box is a real `<input>` with an `aria-label` (`boxLabel`) that announces its position.
- Keep an accessible label on the group and surface the error state to assistive technology.
