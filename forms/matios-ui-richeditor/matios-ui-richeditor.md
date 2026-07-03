# MTS.RichEditor

Template editor with merge fields. Enhances an existing `<textarea>` (progressive enhancement) — without the JS the textarea works on its own; with it, it becomes a WYSIWYG editor with atomic chips, a grouped field palette and basic formatting.

`getValue()` / `setValue()` return and accept the raw Handlebars string, identical to the textarea, making the swap transparent to the consumer.

---

## Installation

```html
<link rel="stylesheet" href="forms/matios-ui-richeditor/matios-ui-richeditor.css">
<script src="icons/matios-ui-icons.js"></script>
<script src="base/matios-ui-i18n.js"></script>
<script src="utilities/matios-ui-sanitize/matios-ui-sanitize.js"></script>
<script src="forms/matios-ui-richeditor/matios-ui-richeditor-i18n.js"></script>
<script src="forms/matios-ui-richeditor/matios-ui-richeditor.js"></script>
```

- `matios-ui-icons.js` (`MTS.Icon`) is **required** — the toolbar icons are pulled from it.
- `matios-ui-i18n.js` + `matios-ui-richeditor-i18n.js` provide the localized UI strings. Without them the component falls back to built-in English defaults.
- `MTS.Sanitize` (`matios-ui-sanitize.js`) is optional but recommended — used automatically when loaded to sanitize pasted/loaded HTML and link URLs.
- `MTS.CodeBlock` (`matios-ui-codeblock.js`) is optional — when present, the `HTML_SOURCE` panel uses an editable CodeBlock; otherwise it falls back to a plain `<textarea>`.

---

## Usage

```html
<textarea id="my-editor"></textarea>
```

```js
const editor = new MTS.RichEditor('#my-editor', {
  catalog: [
    { token: '{{user.firstName}}', label: 'First name',   group: 'User' },
    { token: '{{user.email}}',     label: 'Email',        group: 'User' },
    { token: '{{company.name}}',   label: 'Company name', group: 'Company' },
    { token: '{{otp.code}}',       label: 'OTP code',     group: 'OTP' }
  ],
  height: '240px',
  onChange: function (e) { console.log(e.detail.value); } // Handlebars HTML string
});

// Initial value (from backend) — {{...}} become chips automatically
editor.setValue('<p>Hi {{user.firstName}},</p><p>Your code is {{otp.code}}.</p>');
editor.getValue(); // '<p>Hi {{user.firstName}},</p><p>Your code is {{otp.code}}.</p>'
```

The constructor accepts a `<textarea>` element or a CSS selector. If the target is a container that is not a `<textarea>`, the component uses its first inner `<textarea>` (or creates one). If the selector matches nothing, the constructor returns without building.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `catalog` | `array` | `[]` | `[{ token, label, group }]` — available merge fields |
| `placeholder` | `string` | localized | Editor placeholder text |
| `searchPlaceholder` | `string` | localized | Field-palette search placeholder |
| `height` | `string` | `'260px'` | Height of the edit area |
| `minHeight` | `string` | `'120px'` | Minimum height of the edit area |
| `toolbar` | `array` | `['format','lists','insert','fields']` | Button constants or legacy group strings (see below) |
| `fontSizes` | `number[]` | `[]` | Sizes in px for the legacy `'font'` group (e.g. `[12, 14, 16, 18, 24]`) |
| `fonts` | `array` | `[]` | `[{ label, value }]` for the legacy `'font'` group |
| `labels` | `object` | localized | Overrides individual UI strings — declare only the keys to override |
| `maxLength` | `number` | `0` | Plain-text character limit (`0` = no limit) |
| `readonly` | `boolean` | `false` | Editor not editable (toolbar stays visible) |
| `disabled` | `boolean` | `false` | Fully disabled (adds `mts-re--disabled`) |
| `required` | `boolean` | `false` | Form-field contract — `validate()` fails when there is no visible text |
| `errorMessage` | `string` | `null` | Custom message for the failed `required` validation (defaults to the localized `required` string) |
| `onChange` | `function` | `null` | `e.detail.value` = Handlebars HTML string |
| `onFocus` | `function` | `null` | Focus |
| `onBlur` | `function` | `null` | Blur |

---

## Toolbar

The `toolbar` array accepts two formats that can be mixed.

### 1 — `BTN` constants (recommended)

```js
const BTN = MTS.RichEditor.ToolbarButton;

new MTS.RichEditor('#my-editor', {
  toolbar: [
    BTN.BOLD,
    BTN.ITALIC,
    BTN.UNDERLINE,
    BTN.STRIKE,
    BTN.SEP,
    { button: BTN.FORMAT_BLOCK },
    { button: BTN.FONT_SIZE, label: 'Size', tooltip: 'Font size in px', options: [12, 14, 16, 18, 20, 24, 32] },
    { button: BTN.FONT_FAMILY, label: 'Font', options: [
      { label: 'Default', value: '' },
      { label: 'DM Sans', value: 'DM Sans, sans-serif' },
      { label: 'Georgia', value: 'Georgia, serif' }
    ] },
    BTN.SEP,
    BTN.LIST_UL,
    BTN.LIST_OL,
    BTN.INDENT,
    BTN.OUTDENT,
    BTN.SEP,
    BTN.LINK,
    BTN.UNLINK,
    BTN.TEXT_COLOR,
    BTN.BG_COLOR,
    BTN.SEP,
    BTN.TABLE,
    BTN.HTML_SOURCE,
    BTN.UNDO,
    BTN.CLEAN_FORMAT,
    { button: BTN.REDO, show: false },
    BTN.SEP,
    { button: BTN.FIELDS, label: 'Fields', tooltip: 'Toggle merge field palette' }
  ]
});
```

**Config object** — `button` (required, a `BTN.*` constant), `label` (visible text; only rendered on the label-bearing buttons `HTML_SOURCE` and `FIELDS`), `tooltip` (hover title, defaults to `label`), `options` (for `FONT_SIZE` / `FONT_FAMILY` / `FORMAT_BLOCK`), `show: false` (skip without removing the entry).

**Available constants** (`MTS.RichEditor.ToolbarButton`): `BOLD`, `ITALIC`, `UNDERLINE`, `STRIKE`, `FORMAT_BLOCK` (select: Normal/H1/H2/H3/Quote/Code), `FONT_SIZE` (select), `FONT_FAMILY` (select), `LIST_UL`, `LIST_OL`, `INDENT`, `OUTDENT`, `ALIGN_LEFT`, `ALIGN_CENTER`, `ALIGN_RIGHT`, `ALIGN_FULL`, `LINK`, `UNLINK`, `TEXT_COLOR`, `BG_COLOR`, `TABLE` (visual rows × cols picker), `HTML_SOURCE`, `UNDO`, `REDO`, `CLEAN_FORMAT`, `FIELDS`, `SEP` (divider).

**`FORMAT_BLOCK` options** — pass slugs to filter the built-in list, or full `{ label, value }` objects. Slugs: `'normal'`, `'h1'`, `'h2'`, `'h3'`, `'blockquote'`, `'pre'`.

**`FONT_SIZE` / `FONT_FAMILY`** — render only when they have options. `FONT_SIZE` accepts a `number[]` (turned into `Npx`) or `{ label, value }[]`; `FONT_FAMILY` accepts `{ label, value }[]`.

### 2 — Legacy group strings

Backward-compatible; consecutive groups are separated automatically with `SEP`:

```js
toolbar: ['format', 'lists', 'insert', 'fields']
```

| Group | Buttons |
|-------|---------|
| `'format'` | bold, italic, underline, strike, format-block |
| `'font'` | font size, font family (needs `fontSizes` / `fonts` options) |
| `'lists'` | ul, ol, indent, outdent |
| `'align'` | left, center, right, justify |
| `'insert'` | link, unlink, text color, bg color |
| `'table'` | table picker |
| `'source'` | HTML source |
| `'clean'` | undo, redo, clear format |
| `'fields'` | field palette toggle |

Group strings and `BTN` entries can be combined in the same array.

### Labels (i18n)

Toolbar text and tooltips resolve from the active locale (namespace `MTS.RichEditor`). To override individual strings per instance, pass `labels` — only the declared keys are overridden:

```js
new MTS.RichEditor('#my-editor', {
  labels: { bold: 'Bold', italic: 'Italic', listUl: 'Bullet list', fields: 'Fields' }
});
```

`labels` keys: `bold`, `italic`, `underline`, `strike`, `normal`, `heading1`, `heading2`, `heading3`, `quote`, `code`, `listUl`, `listOl`, `indent`, `outdent`, `alignLeft`, `alignCenter`, `alignRight`, `alignFull`, `linkInsert`, `linkRemove`, `textColor`, `bgColor`, `undo`, `redo`, `cleanFormat`, `htmlSource`, `fields`, `fontSize`, `fontFamily`, `table`, `urlLabel`, `urlApply`, `urlCancel`, `htmlApply`, `htmlCancel`.

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Raw Handlebars string (chips → `{{token}}`) |
| `setValue(str)` | Load a Handlebars string; `{{…}}` become chips automatically. Returns `this` |
| `getText()` | Plain text of the editor (`innerText`) |
| `clear()` | Empty the editor. Returns `this` |
| `setCatalog(catalog)` | Replace the catalog and refresh the palette (async load). Returns `this` |
| `insertField(token)` | Insert a chip at the current cursor position. Returns `this` |
| `setPreview(bool)` | `true` = visual read-only (editor not editable). Returns `this` |
| `getCustomFields()` | `[{ token, label, defaultValue }]` of user-defined custom fields |
| `validate()` | Validates `required` (empty = no visible text), shows inline error + emits `'validate'` → `boolean` ([Form Field Contract](../FORM-FIELD-CONTRACT.md)) |
| `setError(msg)` / `clearError()` | Set / clear the inline error state. Returns `this` |
| `focus()` | Focus the editor. Returns `this` |
| `disable()` / `enable()` | Toggle the disabled state. Returns `this` |
| `destroy()` | Restore the original `<textarea>` (unhidden, holding the current value) and remove the editor UI |
| `on(event, fn)` / `off(event, fn)` | Listen / unlisten — `'change'`, `'focus'`, `'blur'`, `'validate'`. Returns `this` |

```js
const editor = new MTS.RichEditor('#my-editor', { catalog: [/* … */] });
editor.insertField('{{user.firstName}}');
const data = { body: editor.getValue(), customFields: editor.getCustomFields() };
```

---

## Events

| Constructor option | `on(...)` event | DOM event (on the textarea) | Payload |
|--------------------|-----------------|-----------------------------|---------|
| `onChange` | `'change'` | `mts:re:change` | `{ value }` (Handlebars HTML string) |
| `onFocus` | `'focus'` | `mts:re:focus` | `{ event }` (native focus event) |
| `onBlur` | `'blur'` | `mts:re:blur` | `{ event }` (native blur event) |
| — | `'validate'` | `mts:re:validate` | `{ valid, errors }` |

Instance callbacks receive `{ type, detail }`; DOM events carry the payload in `event.detail`.

```js
document.getElementById('my-editor')
  .addEventListener('mts:re:change', function (e) { console.log(e.detail.value); });
```

---

## Field catalog & custom fields

The catalog is an array of `{ token, label, group }` injected by the consumer — the component does not know where the fields come from; it only shows them in the palette (grouped, filterable, collapsible) and recognizes the tokens when parsing. Entries without a `group` fall into a localized "Other" group.

Users can define their own fields from the palette ("+ Custom field"). Each custom field auto-prefixes its token with `custom.` (→ `{{custom.myField}}`), has a visible label and a static default value (for backend reference). Custom chips render in a distinct color. The component does not resolve values — that is the consumer's backend responsibility.

---

## i18n

Single global language API. Set the language once at startup:

```js
MTS.setLanguage('en'); // 'es' | 'en' | 'pt'
```

All UI text (toolbar tooltips, format-block options, link/HTML panels, editor + palette placeholders, status bar, custom-field form, validation message) is read from the `MTS.RichEditor` namespace via `MTS.getString()`. Bundled locales: `es`, `en`, `pt`. There is no per-instance `locale` option — for one-off overrides use the `labels` option (toolbar strings).

The namespace `messages` keys include: `required`, all `labels` keys above, plus `placeholder`, `searchPlaceholder`, `urlPlaceholder`, `words`, `characters`, `groupOther`, `noResults` (`{q}` = the search term), `customFieldAdd`, `customFieldSave`, `customFieldCancel`, `customFieldNamePh`, `customFieldLabelPh`, `customFieldDefaultPh`.

---

## Progressive enhancement

If the component JS is not loaded (or `destroy()` is called), the `<textarea>` works on its own and holds the raw Handlebars string. The consumer can submit the form unchanged — the value stays compatible.

```html
<form>
  <textarea name="templateBody" id="body-editor"></textarea>
  <button type="submit">Save</button>
</form>
<script> new MTS.RichEditor('#body-editor', { catalog: CATALOG }); </script>
```

---

## Notes

- The chip ↔ Handlebars round-trip is exact: `getValue()` never alters or corrupts `{{…}}` tokens.
- On paste, external HTML is discarded and only plain text is kept; any `{{…}}` in the pasted text becomes chips.
- Serialization clones the editor DOM so reading the value never disturbs the visible content.
- Chips are `contenteditable="false"` — modern browsers treat them as a single character for cursor and selection.
- `maxLength` counts plain text; exceeding it undoes the last input.

---

## CSS Classes

Validation (form-field contract) — see [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) — shared, single source in `base/matios-ui-base.css`.
- Component prefix: `mts-re__*` (elements) / `mts-re--*` (modifiers).
