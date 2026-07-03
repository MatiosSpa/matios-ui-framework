# MTS.FormGuard

Declarative dirty-tracking for forms. A single `MTS.FormGuard.start()` call in the app shell; plugins only add HTML attributes — zero extra JavaScript.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-formguard.css">

<!-- Optional: global i18n table + FormGuard locale strings (load before formguard.js) -->
<script src="../../base/matios-ui-i18n.js"></script>
<script src="matios-ui-formguard-i18n.js"></script>

<!-- Optional: MTS.Modal — used for the in-app confirm dialog; without it FormGuard
     falls back to the native confirm() / beforeunload prompt -->
<script src="../../overlays/matios-ui-modal/matios-ui-modal.js"></script>

<script src="matios-ui-formguard.js"></script>
```

`matios-ui-i18n.js` + `matios-ui-formguard-i18n.js` are optional: without them FormGuard runs with its
built-in Spanish defaults. `matios-ui-modal.js` is also optional — see the [Notes](#notes) on the
`beforeunload` / navigation flow.

Initialize once, in the app shell:

```js
MTS.FormGuard.start();

// With custom messages
MTS.FormGuard.start({
  messages: {
    modalTitle: 'Unsaved changes',
    modalBody:  'There are unsaved changes in the form.',
    btnKeep:    'Keep editing',
    btnDiscard: 'Discard',
    btnSave:    'Save and leave',
  },
});
```

---

## Usage

Add `data-mts-form` to the form container. FormGuard adopts it automatically — whether it is in the DOM at start
or injected later by a SPA.

```html
<div data-mts-form data-mts-form-id="user-profile">
  <!-- MTS components — tracked automatically via _mtsInstance -->
  <div id="input-name"></div>
  <div id="select-role"></div>

  <!-- Native controls — tracked automatically -->
  <input type="text" name="notes">

  <button data-mts-form-back>Back</button>
  <button id="btn-save">Save</button>
</div>
```

```js
// Instantiate MTS components normally — nothing to wire into FormGuard
new MTS.Input('#input-name', { label: 'Name' });
new MTS.Select('#select-role', { options: [/* … */] });
```

---

## HTML attributes

| Attribute | On element | Description |
|-----------|-----------|-------------|
| `data-mts-form` | Container | Marks a managed form |
| `data-mts-form-id` | Container | Unique form id (auto-generated if omitted) |
| `data-mts-form-save` | Container | CSS selector of the save button — receives the red dot and is clicked on "Save and leave" |
| `data-mts-form-back` | Button | Intercepts the click if the form is dirty and shows the confirmation modal |
| `data-mts-form-watch` | Native control | Forces tracking on an element that is not a standard input/select/textarea |
| `data-mts-form-ignore` | Subtree | Excludes that node and all descendants from tracking |
| `data-mts-form-title-target` | Container | CSS selector where the dirty ` *` is injected. Defaults to `.mts-card__title` inside the form |

---

## API

| Method | Description |
|--------|-------------|
| `MTS.FormGuard.start(options?)` | Start tracking. Idempotent — repeated calls are ignored |
| `MTS.FormGuard.stop()` | Stop tracking and clear all state |
| `MTS.FormGuard.syncAll()` | Re-snapshot every active form (useful after a bulk `setValue()`) |
| `MTS.FormGuard.sync(formId)` | Re-snapshot a specific form by its `data-mts-form-id` |
| `MTS.FormGuard.hasUnsavedChanges()` | `boolean` — true if at least one form is dirty |
| `MTS.FormGuard.getDirtyCount()` | `number` — count of dirty forms |

### `start()` message overrides

By default the modal/confirm texts come from the active locale (see [i18n](#i18n)). Pass `options.messages`
to override individual strings — an override always wins over the locale value.

| `messages` key | Where it is used | Overrides locale key |
|----------------|------------------|----------------------|
| `unsavedChanges` | Native `confirm()` fallback (when `MTS.Modal` is not loaded) | `unsavedChanges` |
| `modalTitle` | Title of both the navigation modal and the `beforeunload` modal | `modalTitle` |
| `modalBody` | Body of both the navigation modal and the `beforeunload` modal | `modalBody` / `beforeUnloadBody` |
| `btnKeep` | "Keep editing" button in both modals | `btnKeep` |
| `btnDiscard` | Discard button (navigation modal → `btnDiscard`; `beforeunload` modal → `btnDiscardUnload`) | `btnDiscard` / `btnDiscardUnload` |
| `btnSave` | "Save and leave" button in the navigation modal (only when `data-mts-form-save` is set) | `btnSave` |

Note: a single `messages.modalBody` / `messages.btnDiscard` override replaces the string in *both* modals,
whereas the locale keeps a distinct wording per modal (`modalBody`/`beforeUnloadBody`, `btnDiscard`/`btnDiscardUnload`).

---

## Events

### Emitted by FormGuard (bubble from `[data-mts-form]`)

| Event | `e.detail` | Description |
|-------|-----------|-------------|
| `mts:form:dirty-change` | `{ formId, isDirty }` | The form's dirty state changed |
| `mts:form:before-navigate` | `{ formId }` | Cancelable. Emitted before opening the navigation modal — `e.preventDefault()` cancels it |

### Dispatched by the consumer (FormGuard listens via bubbling)

| Event | `detail` | Description |
|-------|----------|-------------|
| `mts:form:save-ack` | `{ formId? }` | The plugin confirmed a successful save. FormGuard resets the snapshot |
| `mts:form:snapshot-sync` | — | Forces an immediate re-snapshot without marking dirty (after programmatic `setValue()`) |

```js
// After a successful save in the plugin:
document.querySelector('[data-mts-form-id="user-profile"]').dispatchEvent(
  new CustomEvent('mts:form:save-ack', { bubbles: true, detail: { formId: 'user-profile' } })
);
```

---

## CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--mts-color-warning` | `#f59e0b` | Color of the dirty asterisk |
| `--mts-color-danger` | `#ef4444` | Color of the dot on the save button |
| `--mts-bg-surface` | `#ffffff` | Border color of the dot |

---

## Notes

**Automatically tracked controls.** Any element that meets at least one condition: (1) has `._mtsInstance` (any MTS
component instantiated on the node); (2) has `data-mts-form-watch`; (3) is a native `<input>`, `<select>` or
`<textarea>` (except `type=submit/button/reset/image`). Elements with `data-mts-form-ignore` and their descendants
are excluded. Nested forms are treated as independent units.

**Reversible dirty tracking.** If the user reverts a field to its original value, the form is marked clean again.
Comparison uses `===` for primitives and `JSON.stringify()` for arrays/objects.

**MutationObserver.** FormGuard observes `document.body` with `{ childList: true, subtree: true }`, so forms injected
by a SPA or `innerHTML` are adopted when they appear and released when they disappear — no plugin code required.

**"Save and leave" flow.** Click on `[data-mts-form-back]` with a dirty form → `mts:form:before-navigate`
(cancelable) → MTS.Modal (or `confirm()` fallback). On "Save and leave", FormGuard clicks the `data-mts-form-save`
button and waits up to 10s for `mts:form:save-ack`; on ack it closes the modal, resets the snapshot and continues.

**beforeunload.** When forms are dirty, FormGuard registers a `beforeunload` listener and shows MTS.Modal (Keep
editing / Leave without saving). Browser limitation: on tab close some browsers show their own native dialog on top
of the modal — there is no web API to suppress it.

---

## i18n

All modal/confirm strings are read from the global locale table under the namespace `MTS.FormGuard`.
Set the language once at startup; there is no per-instance `locale` option.

```js
MTS.setLanguage('en');   // 'es' (default) | 'en' | 'pt'
MTS.FormGuard.start();
```

Bundled keys (all three languages ship in the bundle):

| Key | Where it is used |
|-----|------------------|
| `modalTitle` | Title of the navigation modal and the `beforeunload` modal |
| `modalBody` | Body of the navigation modal |
| `beforeUnloadBody` | Body of the `beforeunload` modal |
| `btnKeep` | "Keep editing" button |
| `btnDiscard` | Discard button in the navigation modal |
| `btnDiscardUnload` | Discard button in the `beforeunload` modal |
| `btnSave` | "Save and leave" button (navigation modal, only with `data-mts-form-save`) |
| `unsavedChanges` | Message for the native `confirm()` fallback |

Override any of these strings for a single call via `options.messages`
(see [`start()` message overrides](#start-message-overrides) — `options.messages` wins over the locale):

```js
MTS.FormGuard.start({ messages: { btnDiscard: 'Discard and go back' } });
```

Native `beforeunload` limitation: on tab/window close the browser may show its own confirmation
dialog. That prompt text is browser-controlled and cannot be localized by any web API.
