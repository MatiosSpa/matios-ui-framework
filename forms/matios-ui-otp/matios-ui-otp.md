# MTS.OTP

One-time code input (OTP / PIN / activation code). Individual boxes with auto-advance, smart paste, a configurable timer and an error state.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-otp.css">
<script src="matios-ui-otp.js"></script>
```

---

## Usage

```js
new MTS.OTP('#otp', {
  length: 6,
  type:   'numeric',
  onComplete: function (code) { console.log(code); }, // → '483920'
});

// With timer + resend link
new MTS.OTP('#otp', {
  length:      6,
  timer:       60,
  resendLabel: "Didn't get the code? Resend",
  onResend: function (reset) {
    api.resendCode().then(function () { reset(); }); // reset boxes + timer on success
  },
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `length` | `number` | `6` | Number of boxes (1–9) |
| `type` | `string` | `'numeric'` | `'numeric'` (digits only) · `'alphanumeric'` (letters and numbers) |
| `timer` | `number` | `null` | Expiry in seconds (`null` = no timer) |
| `disabled` | `boolean` | `false` | Start disabled |
| `required` | `boolean` | `false` | Opt-in `validate()` — fails until the code is complete (see [Form Field Contract](../FORM-FIELD-CONTRACT.md)) |
| `errorMessage` | `string` | `null` | Overrides the `required` message (localized default when `null`) |
| `onComplete` | `function` | — | Fires when all boxes are filled — `(code)` |
| `onChange` | `function` | — | Fires on every change — `(code, isComplete)` |
| `onExpire` | `function` | — | Fires when the timer reaches 0 |
| `onResend` | `function` | — | Renders a resend link — `(resetFn)`; call `resetFn()` when the API confirms success |
| `resendLabel` | `string` | localized | Resend link text |

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Partial or complete string |
| `isComplete()` | Whether all boxes are filled |
| `reset()` | Clear boxes + restart timer |
| `validate()` | Validates `required` (fails until complete), inline error + `'validate'` event → `boolean` |
| `setError(msg)` / `clearError()` | Set / clear the error state |
| `focus()` | Focus the first empty box |
| `disable()` / `enable()` | Toggle interaction |
| `destroy()` | Destroy the instance |

---

## Behavior notes

- **Resend link**: `onResend` receives the component's `reset` function so the consumer decides *when* to call it
  (e.g. after the API responds). With `timer`, the link is hidden while the countdown runs and appears on expiry;
  without `timer` it is always visible. Without `onResend`, no link is rendered.
- **Paste**: pasting (Ctrl+V) from any box distributes the string always from box 0; characters invalid for the
  configured `type` are discarded.

---

## Events

| DOM event | When |
|-----------|------|
| `mts:otp:change` | Every change — `detail: { code, complete }` |
| `mts:otp:complete` | All boxes filled — `detail: { code }` |
| `mts:otp:expire` | Timer reached 0 |

---

## Accessibility

- Each box is a real input with auto-advance; keep an accessible label on the group and announce the error state.

---

## Changelog

### 2026-06-23
- Validation contract: `required` + `errorMessage` + `validate()` (required = complete code) + own i18n (es/en/pt). See [Form Field Contract](../FORM-FIELD-CONTRACT.md).

### 2026-05-24
- `onResend` + `resendLabel`: native resend link (appears on expiry with a timer; always visible without one).
  Receives `resetFn` so the consumer controls when to reset.

### 2026-05-22
- Component created. `length` 1–9, `type` numeric/alphanumeric, configurable `timer`, smart paste from box 0,
  `setError`/`clearError`, `reset`, `_mtsInstance` for FormGuard.
