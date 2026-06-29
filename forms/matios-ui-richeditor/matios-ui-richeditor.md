# MTS.RichEditor

Template editor with merge fields. Mounts over an existing `<textarea>` (progressive enhancement) — without the JS the textarea works on its own; with it, it becomes a WYSIWYG editor with atomic chips, a grouped field palette and basic formatting.

`getValue()` / `setValue()` return and accept the raw Handlebars string, identical to the textarea, making the swap transparent to the consumer.

---

## Installation

```html
<link rel="stylesheet" href="forms/matios-ui-richeditor/matios-ui-richeditor.css">
<script src="utilities/matios-ui-sanitize/matios-ui-sanitize.js"></script>
<script src="forms/matios-ui-richeditor/matios-ui-richeditor.js"></script>
```

`MTS.Sanitize` is optional but recommended — it is used automatically when loaded.

---

## Usage

```html
<textarea id="my-editor"></textarea>
```

```js
const editor = new MTS.RichEditor('#my-editor', {
  catalog: [
    { token: '{{user.firstName}}', label: 'First name',  group: 'User' },
    { token: '{{user.email}}',     label: 'Email',       group: 'User' },
    { token: '{{company.name}}',   label: 'Company name', group: 'Company' },
    { token: '{{otp.code}}',       label: 'OTP code',     group: 'OTP' },
  ],
  height:   '240px',
  onChange: function (e) { console.log(e.detail.value); }, // → Handlebars HTML string
});

// Initial value (from backend) — {{...}} become chips automatically
editor.setValue('<p>Hi {{user.firstName}},</p><p>Your code is {{otp.code}}.</p>');
editor.getValue(); // → '<p>Hi {{user.firstName}},</p><p>Your code is {{otp.code}}.</p>'
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `catalog` | `array` | `[]` | `[{ token, label, group }]` — available merge fields |
| `placeholder` | `string` | localized | Editor placeholder |
| `searchPlaceholder` | `string` | localized | Palette search placeholder |
| `height` | `string` | `'260px'` | Min height of the edit area |
| `minHeight` | `string` | `'120px'` | Min height of the edit area |
| `toolbar` | `array` | `['format','lists','insert','fields']` | Button constants or legacy groups (see below) |
| `labels` | `object` | localized | UI strings for i18n — declare only the keys to override |
| `maxLength` | `number` | `0` | Plain-text character limit (`0` = none) |
| `readonly` | `boolean` | `false` | Not editable (toolbar hidden) |
| `disabled` | `boolean` | `false` | Fully disabled |
| `onChange` | `function` | `null` | `e.detail.value` = Handlebars HTML string |
| `onFocus` / `onBlur` | `function` | `null` | Focus / blur |

---

## Toolbar

The `toolbar` array accepts two formats that can be mixed.

### 1 — `BTN` constants (recommended)

```js
const BTN = MTS.RichEditor.ToolbarButton;

new MTS.RichEditor('#my-editor', {
  toolbar: [
    BTN.BOLD, BTN.ITALIC, BTN.UNDERLINE, BTN.STRIKE, BTN.SEP,
    { button: BTN.FORMAT_BLOCK },
    { button: BTN.FONT_SIZE, label: 'Size', tooltip: 'Font size in px', options: [12, 14, 16, 18, 20, 24, 32] },
    { button: BTN.FONT_FAMILY, label: 'Font', options: [
      { label: 'Default', value: '' },
      { label: 'DM Sans', value: 'DM Sans, sans-serif' },
      { label: 'Georgia', value: 'Georgia, serif' },
    ] },
    BTN.SEP,
    BTN.LIST_UL, BTN.LIST_OL, BTN.INDENT, BTN.OUTDENT, BTN.SEP,
    BTN.LINK, BTN.UNLINK, BTN.TEXT_COLOR, BTN.BG_COLOR, BTN.SEP,
    BTN.TABLE, BTN.HTML_SOURCE, BTN.UNDO, BTN.CLEAN_FORMAT,
    { button: BTN.REDO, show: false }, // defined but hidden
    BTN.SEP,
    { button: BTN.FIELDS, label: 'Fields', tooltip: 'Toggle merge field palette' },
  ],
});
```

**Config object** — `button` (required, a `BTN.*` constant), `label` (visible text), `tooltip` (hover title,
defaults to `label`), `options` (for `FONT_SIZE` / `FONT_FAMILY` / `FORMAT_BLOCK`), `show: false` (hide without
removing).

**Available constants** (`MTS.RichEditor.ToolbarButton`): `BOLD`, `ITALIC`, `UNDERLINE`, `STRIKE`, `FORMAT_BLOCK`
(select: Normal/H1/H2/H3/Quote/Code), `FONT_SIZE` (select), `FONT_FAMILY` (select), `LIST_UL`, `LIST_OL`, `INDENT`,
`OUTDENT`, `ALIGN_LEFT`, `ALIGN_CENTER`, `ALIGN_RIGHT`, `ALIGN_FULL`, `LINK`, `UNLINK`, `TEXT_COLOR`, `BG_COLOR`,
`TABLE` (visual rows × cols picker), `HTML_SOURCE`, `UNDO`, `REDO`, `CLEAN_FORMAT`, `FIELDS`, `SEP` (divider).

### 2 — Legacy group strings

Backward-compatible; groups are separated automatically with `SEP`:

```js
toolbar: ['format', 'lists', 'insert', 'fields']
```

Groups: `'format'` (bold/italic/underline/strike/format-block), `'font'` (size/family), `'lists'`
(ul/ol/indent/outdent), `'align'` (left/center/right/justify), `'insert'` (link/unlink/text-color/bg-color),
`'table'`, `'source'` (HTML source), `'clean'` (undo/redo/clean), `'fields'`.

### Labels (i18n)

Defaults resolve from the active locale; declare only the keys you override:

```js
new MTS.RichEditor('#my-editor', {
  catalog: [/* … */],
  labels: { bold: 'Bold', italic: 'Italic', listUl: 'Bullet list', fields: 'Fields', /* … */ },
});
```

---

## API

| Method | Description |
|--------|-------------|
| `getValue()` | Raw Handlebars string (chips → `{{token}}`) |
| `setValue(str)` | Load a Handlebars string; `{{…}}` become chips automatically |
| `setCatalog(catalog)` | Replace the catalog and refresh the palette (async load) |
| `insertField(token)` | Insert a chip at the current cursor position |
| `setPreview(bool)` | `true` = visual read-only (toolbar + palette hidden) |
| `getCustomFields()` | `[{ token, label, defaultValue }]` of user-defined custom fields |
| `validate()` | Validates `required` (empty = no visible text), inline error + `'validate'` event → `boolean` ([Form Field Contract](../FORM-FIELD-CONTRACT.md)) |
| `setError(msg)` / `clearError()` | Set / clear the error state |
| `focus()` | Focus the editor |
| `destroy()` | Restore the original textarea with the current value and remove the editor |
| `on(event, fn)` / `off(event, fn)` | Listen / unlisten — `'change'` (`e.detail.value`), `'focus'`, `'blur'` |

```js
const editor = new MTS.RichEditor('#my-editor', { catalog: [/* … */] });
editor.insertField('{{user.firstName}}');
const data = { body: editor.getValue(), customFields: editor.getCustomFields() };
```

---

## Events

| Method | DOM event | Payload |
|--------|-----------|---------|
| `onChange` / `on('change', fn)` | `mts:re:change` | `{ value }` (Handlebars HTML string) |
| `onFocus` / `on('focus', fn)` | `mts:re:focus` | — |
| `onBlur` / `on('blur', fn)` | `mts:re:blur` | — |

```js
document.getElementById('my-editor')
  .addEventListener('mts:re:change', function (e) { console.log(e.detail.value); });
```

---

## Field catalog & custom fields

The catalog is an array of `{ token, label, group }` injected by the consumer — the component does not know where
the fields come from; it only shows them in the palette and recognizes them when parsing.

Users can define their own fields from the palette ("+ Custom field"). Each custom field auto-prefixes its token
with `custom.` (→ `{{custom.myField}}`), has a visible label and a static default value (for backend reference).
Custom chips render in orange to distinguish them from catalog chips. The component does not resolve values — that
is the consumer's backend responsibility.

---

## Progressive enhancement

If the component JS is not loaded (or `destroy()` is called), the `<textarea>` works on its own and holds the raw
Handlebars string. The consumer can submit the form unchanged — the value stays compatible.

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

---

## CSS Classes

Validation (form-field contract) - see [Form Field Contract](../FORM-FIELD-CONTRACT.md):

- `.mts-form-error` (inline message), `.mts-form-hint` (helper text), `.mts-label--required` (red asterisk on the label) - shared, single source in `base/matios-ui-base.css`.

---

## Changelog

### 2026-06-29
- Toolbar icons migrated to `MTS.Icon` (lists, indent/outdent, align, link/unlink, text/bg color, undo/redo, clean →
  `eraser`, source → `code`, fields → `grid`, table, palette chevron). `B`/`I`/`U`/`S` stay as typographic glyphs. Six
  new icons added to the set: `indent`, `outdent`, `unlink`, `eraser`, `text-color`, `bg-color`. Requires `matios-ui-icons.js`.

### 2026-06-23
- Validation contract: `required` + `errorMessage` + `validate()` (empty = no visible text) + `setError`/`clearError` (localized message). See [Form Field Contract](../FORM-FIELD-CONTRACT.md).

### 2026-05-21
- Fix: palette items capture `_saveRange()` on `mousedown` (like toolbar buttons) so subsequent fields insert at the
  current cursor position.
- Fix: in HTML-source mode, `insertField()` / `_exec()` no-op on the hidden WYSIWYG editor; toolbar and palette dim
  to indicate they do not apply.

### 2026-05-19
- Renamed to `MTS.RichEditor` (consolidates `MTS.MergeFieldEditor` and `MTS.RichTextEditor`).
- `MTS.RichEditor.ToolbarButton` constants + config-object toolbar format (`{ button, label, tooltip, options, show }`);
  legacy group strings still supported. CSS prefix `mts-re__*` / `mts-re--*`. DOM events `mts:re:{change,focus,blur}`.
- Progressive enhancement over `<textarea>`; atomic chips with exact `{{token}}` round-trip; grouped field palette
  with filter, accordion and custom fields; opt-in `'source'` (raw HTML) and `'table'` groups.
- `labels` i18n system; `setPreview(bool)`; `getCustomFields()`. Requested by matios-genesys / matios-platform-messaging (Phase 2).
