# MTS.LockScreen

Full-screen re-authentication overlay (Windows/macOS lock-screen style). When a session lapses, **lock the screen and
ask for the password in place** instead of redirecting to login and losing the page context.

UI + events only — it does **not** know about auth, endpoints or sessions. It delegates the check through
`onUnlock(password, done)`; the consumer (shell) re-authenticates and calls `done(ok[, msgError])`. Same pattern as
`MTS.SessionTimeout`. Reuses `MTS.Avatar`, `MTS.Input`, `MTS.Button`.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-avatar.css">
<link rel="stylesheet" href="matios-ui-input.css">
<link rel="stylesheet" href="matios-ui-button.css">
<link rel="stylesheet" href="matios-ui-lockscreen.css">

<script src="matios-ui-avatar.js"></script>
<script src="matios-ui-input.js"></script>
<script src="matios-ui-button.js"></script>
<script src="matios-ui-i18n.js"></script>
<script src="matios-ui-lockscreen-i18n.js"></script>
<script src="matios-ui-lockscreen.js"></script>
```

---

## Usage

```js
const lock = new MTS.LockScreen({
  userName:  'Pedro Gómez',
  avatarUrl: '/uploads/u/123.jpg',   // optional — falls back to initials + auto color
  onUnlock: function (password, done) {
    // the consumer re-authenticates (userName is known + the typed password)
    reauth(password)
      .then(function () { done(true); })            // ok → closes the lock
      .catch(function () { done(false); });          // fail → inline error, stays open
  },
  onForgot: function () { goToReset(); },            // optional
});

lock.show();
```

The component never validates the password or calls an endpoint — that is the consumer's job inside `onUnlock`.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `userName` | `string` | `''` | Name shown under the avatar |
| `avatarUrl` | `string` | `null` | Photo URL; if missing, uses initials |
| `initials` | `string` | from `userName` | Manual initials override |
| `avatarColor` | `string` | auto from name | Background color of the initials avatar |
| `showForgot` | `boolean` | `true` | Show the "forgot my password" link |
| `autoShow` | `boolean` | `false` | Show the overlay right after instantiating |
| `messages` | `object` | i18n | Per-instance text overrides (see below). When omitted, comes from i18n (es/en/pt). **Never hardcoded.** |
| `onUnlock` | `function` | — | `(password, done)` — re-auth here; `done(true)` closes, `done(false[, msg])` shows the error |
| `onForgot` | `function` | — | Called on the "forgot" link click |

`messages` keys: `title`, `subtitle`, `passwordPlaceholder`, `btnUnlock`, `forgot`, `errorInvalid`.

---

## API

| Method | Description |
|--------|-------------|
| `show()` | Show the overlay (covers the app, focus to the password, focus trapped). Chainable |
| `hide()` | Close the overlay. Chainable |
| `setBusy(bool)` | "Verifying…" state (button spinner + disabled input) |
| `setError(msg)` | Inline error under the field (also done by `done(false, msg)`) |
| `clearError()` | Clear the error |
| `setUser({ userName, avatarUrl, initials, avatarColor })` | Update the shown identity (re-renders the avatar) |
| `destroy()` | Remove the overlay from the DOM and clear listeners |

### Behavior
- **Enter** in the password field = click on "Unlock".
- While `onUnlock` runs → `setBusy(true)`; on `done()` → `setBusy(false)`.
- `done(true)` closes; `done(false, msg)` shows `msg`, clears the password and re-focuses it. `done()` is idempotent.
- Real UI lock: focus trapped inside the overlay, background scroll blocked, the app behind is covered/blurred.

> **Security note.** This is a **UX/privacy** lock, not a security boundary — data already rendered stays in the DOM
> behind the overlay. Real protection (session invalidation + re-auth) is the shell's responsibility inside `onUnlock`.

---

## Events

Dispatched on the overlay root (for consumers that prefer listeners):

| Event | Detail | When |
|-------|--------|------|
| `mts:lockscreen:shown` | — | Shown |
| `mts:lockscreen:unlock` | `{ password }` | Submit (Enter or button) |
| `mts:lockscreen:forgot` | — | "Forgot" link clicked |
| `mts:lockscreen:hidden` | — | Closed (unlock OK or `hide()`) |

Same events are available as callbacks via `on('shown'|'unlock'|'forgot'|'hidden', fn)`.

---

## CSS Classes

| Class | Element |
|---|---|
| `.mts-lockscreen` (`--visible`) | Full-screen overlay (z-index `--mts-z-lockscreen` = 800; blur cover + solid fallback) |
| `.mts-lockscreen__card` | Centered card |
| `.mts-lockscreen__avatar` / `__title` / `__name` / `__subtitle` | Identity block |
| `.mts-lockscreen__field` / `__btn` / `__error` / `__forgot` | Password / button / inline error / forgot link |
| `body.mts-lockscreen-open` | Added while visible — blocks background scroll |

All colors/spacing use `--mts-*` tokens. The password uses `autocomplete: "browser-off"`.

---

## i18n

All chrome text (title, subtitle, password placeholder, unlock button, "forgot" link, invalid-password error) comes from
the shipped locale bundle — **nothing is hardcoded**. The namespace is `MTS.LockScreen` and ships `es`, `en` and `pt`.

Set the language **once**, globally, at app start:

```js
MTS.setLanguage('en');   // 'es' | 'en' | 'pt'
```

There is no per-instance `locale` option. To override individual strings for a single lock screen, pass `messages`:

```js
const lock = new MTS.LockScreen({
  userName: 'Pedro Gómez',
  messages: {
    title:               'Session locked',
    subtitle:            'Enter your password to continue',
    passwordPlaceholder: 'Password',
    btnUnlock:           'Unlock',
    forgot:              'Forgot my password',
    errorInvalid:        'Wrong password',
  },
  onUnlock: function (password, done) { /* … */ },
});
```

Resolution order per key: `messages[key]` (instance override) → `MTS.getString()['MTS.LockScreen'].messages[key]`
(active language) → built-in fallback. Requires `base/matios-ui-i18n.js` loaded before `matios-ui-lockscreen-i18n.js`.

| Key | `en` | `es` | `pt` |
|-----|------|------|------|
| `title` | Screen locked | Sesión bloqueada | Tela bloqueada |
| `subtitle` | Enter your password to continue | Ingresa tu clave para continuar | Digite sua senha para continuar |
| `passwordPlaceholder` | Password | Clave | Senha |
| `btnUnlock` | Unlock | Ingresar | Entrar |
| `forgot` | Forgot my password | Olvidé mi clave | Esqueci minha senha |
| `errorInvalid` | Wrong password | Clave incorrecta | Senha incorreta |

---

## Accessibility

- `role="dialog"` + `aria-modal="true"` + focus trap; initial focus on the password field.
- The unlock button announces its busy state; the error region is `aria-live="polite"`.
