# MTS.SessionTimeout

Inactivity session-timeout management. Shows a fixed progress bar at the bottom of the page and opens a warning modal with a countdown when the session is about to expire. Configurable messages, times and actions.

**Dependencies:** `MTS.Progress`, `MTS.Modal`.

---

## Installation

```html
<link rel="stylesheet" href="forms/matios-ui-progress/matios-ui-progress.css">
<link rel="stylesheet" href="overlays/matios-ui-modal/matios-ui-modal.css">
<link rel="stylesheet" href="utilities/matios-ui-sessiontimeout/matios-ui-sessiontimeout.css">

<script src="forms/matios-ui-progress/matios-ui-progress.js"></script>
<script src="overlays/matios-ui-modal/matios-ui-modal.js"></script>
<script src="utilities/matios-ui-sessiontimeout/matios-ui-sessiontimeout.js"></script>
```

---

## Usage

```js
// Basic
new MTS.SessionTimeout({
  timeoutMinutes: 30,
  warningMinutes: 5,
  onRefresh: function (done) { done(); }, // no token refresh → just reset the timer
  onExpire:  function () { logout(); },
});

// Real usage with token refresh
const session = new MTS.SessionTimeout({
  timeoutMinutes: 30,
  warningMinutes: 5,
  onRefresh: function (done) {
    fetch('/api/auth/refresh', { method: 'POST' })
      .then(function (res) { if (res.ok) { done(); } else { logout(); } })
      .catch(function () { logout(); });
  },
  onExpire: function () { logout(); },
});

// Reset on relevant activity (optional)
document.addEventListener('click', function () { session.reset(); });

// Bar only (no warning modal)
new MTS.SessionTimeout({ timeoutMinutes: 30, warningMinutes: 0, onExpire: function () { logout(); } });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeoutMinutes` | `number` | `30` | Total inactivity minutes before expiring |
| `warningMinutes` | `number` | `5` | Minutes remaining when the warning modal opens (`0` disables it) |
| `titleIcon` | `string` | `'alert-triangle'` | `MTS.Icon` name left of the title (`''` to omit) |
| `titleText` | `string` | `messages.title` | Modal title text |
| `messages.title` | `string` | localized | Base title text |
| `messages.body` | `string` | localized | Modal body. `{time}` is replaced with the live countdown (`MM:SS`) |
| `messages.warning` | `string` | localized | Warning text below the body (`''` to hide) |
| `messages.btnRefresh` | `string` | localized | Primary button label |
| `messages.btnExpire` | `string` | localized | Secondary button label |
| `onRefresh` | `function(done)` | — | Called on "Refresh". Call `done()` to reset the timer; on failed refresh, do not call it (the timer keeps running) |
| `onExpire` | `function` | — | Called when the timer reaches zero or the user chooses "Sign out" |

> Default message strings resolve from the active locale; override via `titleText` / `messages.*` (English example above).

---

## API

| Method | Description |
|--------|-------------|
| `reset()` | Reset the timer to maximum and close the modal if open |
| `showWarning()` | Open the warning modal immediately (demo / testing) |
| `destroy()` | Destroy the component, clear timers and remove the bar from the DOM |

```js
const session = new MTS.SessionTimeout({ timeoutMinutes: 30 });
session.reset();
```

---

## Notes

- The bar is injected into `document.body` on creation — no prior markup required.
- The modal countdown (`{time}`) updates every second in `MM:SS` format.
- If the user presses "Refresh" and `onRefresh` never calls `done()` (e.g. the server rejected the token), the timer
  keeps running — the modal does not close on its own.

---

## Accessibility

- The warning modal traps focus and announces the remaining time; keep `warningMinutes` long enough to read and act.

---

## Changelog

### 2026-05-17
- Install paths corrected to full paths from the framework root.
