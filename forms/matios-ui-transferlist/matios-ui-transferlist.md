# MTS.TransferList

Assignment component between two lists — covers Transfer List / Dual Listbox / Pick List / Shuttle patterns. Ideal for assigning profiles to a role, moving items between an origin and a selected list, or blocking duplicates by a validation key. Supports move buttons, drag and drop, custom item rendering, and unique validation on the target.

---

## Installation

```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-transferlist.css">

<!-- Optional: localized chrome (titles, empty text, aria-labels) -->
<script src="../../base/matios-ui-i18n.js"></script>
<script src="matios-ui-transferlist-i18n.js"></script>

<script src="matios-ui-transferlist.js"></script>
```

The i18n scripts are optional. Without them the component falls back to its English literals.

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
    { name: 'Profile B', detail: 'Documents module' }
  ],
  selectedDataSource: [],
  itemLabel:       'name',
  itemDescription: 'detail'
});

// Unique validation on the target + single-button layout + remove x
new MTS.TransferList('#roles-transfer', {
  originTitle:      'Available',
  selectedTitle:    'Assigned',
  itemLabel:        'name',
  itemDescription:  'moduleName',
  validateUnique:   true,
  validateKey:      'moduleId',
  duplicateMessage: 'There is already a profile for that module.',
  draggable:        false,
  buttons: { allToSelected: false, toSelected: true, toOrigin: false, allToOrigin: false },
  removableSelectedItem: true,
  onRequestItem: function (item, moved) { console.log(item, moved); }
});
```

The constructor signature is `new MTS.TransferList(el | selector, options)`. The element is used in place — the component clears and rebuilds its inner HTML.

`validateKey` can be a `string` (an item property) or a `function` returning the value to compare:

```js
validateKey: function (item) { return item.id + '_' + item.creationDate; }
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `label` | `string` | `''` | Top label |
| `hint` | `string` | `''` | Helper text below the lists |
| `originTitle` | `string` | localized `'Origin'` | Origin list title (alias: `availableTitle`) |
| `selectedTitle` | `string` | localized `'Selected'` | Selected list title (alias: `targetTitle`) |
| `originEmptyText` | `string` | localized `'No items available'` | Empty text, origin (alias: `availableEmptyText`) |
| `selectedEmptyText` | `string` | localized `'No items selected'` | Empty text, selected |
| `originDataSource` | `array` | `[]` | Initial origin data (aliases: `availableItems`, `options`) |
| `selectedDataSource` | `array` | `[]` | Initial selected data (aliases: `selectedItems`, `value`) |
| `itemLabel` | `string \| function` | `'label'` | Primary visible text (property name or resolver) |
| `itemDescription` | `string \| function` | `'description'` | Secondary visible text (property name or resolver) |
| `renderItem` | `function` | `null` | Custom item renderer `(item, side, instance) => htmlString` |
| `showMoveButtons` | `boolean` | `true` | Master switch — `false` removes all buttons and wins over `buttons.*` |
| `buttons` | `object` | all `true` | Per-button control (omit the object = all 4 visible, backward-compat) |
| `buttons.allToSelected` | `boolean` | `true` | Show `»` (move all to selected) |
| `buttons.toSelected` | `boolean` | `true` | Show `›` (move active item to selected) |
| `buttons.toOrigin` | `boolean` | `true` | Show `‹` (move active item to origin) |
| `buttons.allToOrigin` | `boolean` | `true` | Show `«` (move all to origin) |
| `removableSelectedItem` | `boolean` | `false` | Show an `x` per item on the selected side — click removes it from the target (does not move it back to origin) |
| `draggable` | `boolean` | `true` | Allow drag and drop between lists |
| `disabled` | `boolean` | `false` | Disables interaction |
| `validateUnique` | `boolean` | `false` | Enable unique validation on the target |
| `validateKey` | `string \| function` | `null` | Key used to compare duplicates (property name or resolver) |
| `duplicateMessage` | `string` | localized `'Duplicate item'` | Message shown when a transfer is blocked |
| `required` | `boolean` | `false` | Form-field contract — at least one selected item required |
| `errorMessage` | `string` | `null` | Custom validation error (falls back to localized `required`) |
| `onRequestItem` | `function` | `null` | `(item, moved)` — fired after every attempted move (recommended API) |
| `onSelectionChange` | `function` | `null` | `(item, side)` — fired when the in-list active item changes |
| `onChange` | `function` | `null` | Legacy — `({ type, detail })` on every list change |
| `onInvalidTransfer` | `function` | `null` | Legacy — `({ type, detail })` on a blocked transfer |

Each item in a data source may be an object (mapped via `itemLabel` / `itemDescription`) or a primitive (normalized to `{ value, label }`).

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Alias of `getSelectedItems()` |
| `setValue(array)` | Replace the selected list |
| `getSelectedItems()` | Items currently on the selected side |
| `getOriginItems()` / `getAvailableItems()` | Items currently on the origin side (`getAvailableItems` is an alias) |
| `setItems({ originDataSource, selectedDataSource })` | Replace both data sources (accepts the same aliases as the options) |
| `moveToSelected(itemOrKey)` | Move one item to the selected side |
| `moveToOrigin(itemOrKey)` / `moveToAvailable(itemOrKey)` | Move one item to the origin side (`moveToAvailable` is an alias) |
| `moveAllToSelected()` | Move all origin items to selected |
| `moveAllToOrigin()` / `moveAllToAvailable()` | Move all selected items to origin (`moveAllToAvailable` is an alias) |
| `clear()` | Clear the selection (alias of `moveAllToOrigin()`) |
| `enable()` / `disable()` | Enable / disable interaction |
| `validate()` | Validates `required` (empty = nothing selected); shows the inline error and emits `validate` → `boolean` |
| `setError(msg)` / `clearError()` | Set / clear the inline error state |
| `on(event, cb)` / `off(event, cb)` | Subscribe / unsubscribe to instance events (see below) |
| `destroy()` | Empties the host element |

`validateKey` / move helpers accept either the real item object or the automatic internal key.

Accepts `required` + `errorMessage` (localized default) — see [Form Field Contract](../FORM-FIELD-CONTRACT.md).

---

## Events

Events are delivered two ways: as a DOM `CustomEvent` on the host element, and to callbacks registered via `on(event, cb)`. In both cases the payload lives in `detail`.

| Event | DOM event | `detail` payload |
|-------|-----------|------------------|
| `request-item` | `mts:transferlist:request-item` | `{ item, moved, from, to, trigger, message?, originItems?, selectedItems? }` — every attempted move (`onRequestItem(item, moved)` is the recommended shorthand) |
| `change` | `mts:transferlist:change` | `{ item, from, to, trigger, originItems, selectedItems }` — a committed change (`trigger` may be `'button'`, `'bulk'`, `'drag'` or `'remove'`) |
| `invalid-transfer` | `mts:transferlist:invalid-transfer` | `{ item, from, to, trigger, message }` — a transfer blocked by unique validation |
| `selection-change` | `mts:transferlist:selection-change` | `{ item, side, originItems, selectedItems }` — the in-list active item changed |
| `validate` | `mts:transferlist:validate` | `{ valid, errors }` — emitted by `validate()` |

```js
var transfer = new MTS.TransferList('#my-transfer', { /* ... */ });
transfer.on('change', function (event) { console.log(event.detail.selectedItems); });
```

### Automatic data attributes

Each rendered item gets `data-mts-item-key` (an automatic internal key) plus every record field mapped to a `data-*` attribute (camelCase field names are lowered to kebab-case). The component imposes no fixed business field names — it takes the real data source and projects it onto the item root.

---

## i18n

Chrome text (list titles, empty text, the duplicate message, the move-button and remove-button `aria-label`s, and the `required` error) is read from the global language via `MTS.getString()['MTS.TransferList'].messages`. Set the language once at startup with `MTS.setLanguage('es' | 'en' | 'pt')`; there is no per-instance `locale` option. Explicit `originTitle` / `selectedTitle` / `originEmptyText` / `selectedEmptyText` / `duplicateMessage` options always override the localized defaults.

Bundled locales: `es`, `en`, `pt`. Keys under `messages`:

| Key | Used for |
|-----|----------|
| `required` | Default validation error |
| `originTitle` | Default origin list title |
| `selectedTitle` | Default selected list title |
| `originEmpty` | Default origin empty text |
| `selectedEmpty` | Default selected empty text |
| `duplicate` | Default blocked-transfer message |
| `moveAllToSelected` / `moveToSelected` / `moveToOrigin` / `moveAllToOrigin` | Move-button `aria-label`s |
| `removeItem` | Remove-`x` `aria-label` |

---

## CSS Classes

Validation (form-field contract) — see [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) — shared, single source in `base/matios-ui-base.css`.

---

## Accessibility

- Move buttons provide a keyboard-operable alternative to drag and drop — keep at least one path enabled.
- Move and remove buttons carry localized `aria-label`s.
- Blocked transfers surface `duplicateMessage`; convey list changes in a status region for assistive tech.
