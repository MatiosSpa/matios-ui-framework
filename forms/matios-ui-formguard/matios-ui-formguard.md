# MTS.FormGuard

Declarative dirty-tracking for forms. A single `MTS.FormGuard.start()` call in the app shell; plugins only add HTML attributes — zero extra JavaScript.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-formguard.css">
<script src="matios-ui-formguard.js"></script>
```

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

### `start()` message options

`messages.unsavedChanges` (native `confirm()` fallback), `messages.modalTitle`, `messages.modalBody`,
`messages.btnKeep`, `messages.btnDiscard`, `messages.btnSave`.

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

## Changelog

### 2026-05-21
- Component created. Declarative singleton: `start` / `stop` / `syncAll` / `sync` / `hasUnsavedChanges` / `getDirtyCount`.
- MutationObserver auto adopt/release; reversible per-control snapshot dirty tracking.
- 3-button modal (MTS.Modal + `confirm()` fallback); `beforeunload` guard when dirty.
- `_mtsInstance` convention across Input, Toggle, Select, Checkbox, CheckboxGroup, Radio, Slider, TagInput,
  DatePicker.Base, RichEditor, NumberInput, PhoneInput.
- Events: `mts:form:dirty-change`, `mts:form:before-navigate`, `mts:form:save-ack`, `mts:form:snapshot-sync`.
