# MTS.TransferList

Assignment component between two lists — covers Transfer List / Dual Listbox / Pick List / Shuttle patterns. Ideal for assigning profiles to a role, moving items between source and selected, or blocking duplicates by a validation key.

---

## Installation

```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-transferlist.css">
<script src="matios-ui-transferlist.js"></script>
```

---

## Usage

```js
// Basic
new MTS.TransferList('#my-transfer', {
  label:         'Profiles',
  originTitle:   'Available',
  selectedTitle: 'Selected',
  originDataSource: [
    { name: 'Profile A', detail: 'Users module' },
    { name: 'Profile B', detail: 'Documents module' },
  ],
  selectedDataSource: [],
  itemLabel:       'name',
  itemDescription: 'detail',
});

// Unique validation on the target + single-button layout
new MTS.TransferList('#roles-transfer', {
  originTitle:     'Available',
  selectedTitle:   'Assigned',
  itemLabel:       'name',
  itemDescription: 'moduleName',
  validateUnique:  true,
  validateKey:     'moduleId',
  duplicateMessage: 'There is already a profile for that module.',
  draggable:       false,
  buttons: { allToSelected: false, toSelected: true, toOrigin: false, allToOrigin: false },
  removableSelectedItem: true,
  onRequestItem: function (item, moved) { console.log(item, moved); },
});
```

`validateKey` can be a `string` (an item property) or a `function` returning the value to compare:

```js
validateKey: function (item) { return item.id + '_' + item.creationDate; }
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | `string` | `''` | Top label |
| `hint` | `string` | `''` | Helper text |
| `originTitle` | `string` | `'Origin'` | Source list title |
| `selectedTitle` | `string` | `'Selected'` | Selected list title |
| `originEmptyText` | `string` | `'No items available'` | Empty text, source |
| `selectedEmptyText` | `string` | `'No items selected'` | Empty text, selected |
| `originDataSource` | `array` | `[]` | Initial source data |
| `selectedDataSource` | `array` | `[]` | Initial selected data |
| `itemLabel` | `string \| function` | `'label'` | Primary visible text |
| `itemDescription` | `string \| function` | `'description'` | Secondary visible text |
| `renderItem` | `function` | `null` | Custom item renderer |
| `showMoveButtons` | `boolean` | `true` | Master switch — `false` removes all buttons |
| `buttons` | `object` | all `true` | Per-button control (omit = all 4 visible, backward-compat) |
| `buttons.allToSelected` | `boolean` | `true` | Show `»` (move all to target) |
| `buttons.toSelected` | `boolean` | `true` | Show `›` (move selected to target) |
| `buttons.toOrigin` | `boolean` | `true` | Show `‹` (move selected to origin) |
| `buttons.allToOrigin` | `boolean` | `true` | Show `«` (move all to origin) |
| `removableSelectedItem` | `boolean` | `false` | Show an `x` per item on the selected side — click removes it from the target (does not move it back to origin) |
| `draggable` | `boolean` | `true` | Allow drag and drop |
| `disabled` | `boolean` | `false` | Disables interaction |
| `validateUnique` | `boolean` | `false` | Enable unique validation on the target |
| `validateKey` | `string \| function` | `null` | Key used to compare duplicates |
| `duplicateMessage` | `string` | `'Duplicate item'` | Message shown when a drop is blocked |
| `onRequestItem` | `function` | `null` | Single callback — receives `(item, moved)` |

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` / `setValue(array)` | Get / set the selected values |
| `getSelectedItems()` / `getOriginItems()` / `getAvailableItems()` | Read each list |
| `setItems({ originDataSource, selectedDataSource })` | Replace both data sources |
| `moveToSelected(item)` / `moveToOrigin(item)` / `moveToAvailable(item)` | Move one (item or internal key) |
| `moveAllToSelected()` / `moveAllToOrigin()` / `moveAllToAvailable()` | Move all |
| `clear()` | Clear the selection |
| `enable()` / `disable()` | Enable / disable interaction |
| `destroy()` | Destroy the instance |

---

## Events

| DOM event | Description |
|-----------|-------------|
| `mts:transferlist:request-item` | An item move was requested (`onRequestItem(item, moved)` is the recommended API) |
| `mts:transferlist:change` | The lists changed (includes `trigger`, e.g. `'remove'`) |
| `mts:transferlist:invalid-transfer` | A transfer was blocked by unique validation |
| `mts:transferlist:selection-change` | The current in-list selection changed |

### Automatic data attributes

Each rendered item gets `data-mts-item-key` (an automatic internal key) plus every record field mapped to `data-*`.
The component imposes no fixed business field names — it takes the real data source and lowers it onto the item root.

---

## Accessibility

- Move buttons provide a keyboard-operable alternative to drag-and-drop — keep at least one path enabled.
- Blocked transfers surface `duplicateMessage`; convey list changes in a status region for assistive tech.

---

## Changelog

### 2026-05-22
- `buttons` — per-button control (`allToSelected`, `toSelected`, `toOrigin`, `allToOrigin`); omit the object to keep
  all four visible (backward-compat).
- `showMoveButtons: false` now removes the buttons from the DOM (was CSS-only) and wins over any `buttons.*`.
- `removableSelectedItem` — `x` per item on the selected side; removes from the target without moving it to origin,
  no validation, emits `change` with `trigger: 'remove'`.

### New data-source API
- `originDataSource` / `selectedDataSource`, unique validation, and automatic internal item keys.

### Initial
- First release of TransferList.
