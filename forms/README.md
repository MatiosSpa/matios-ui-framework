# Forms

Input and form components. From primitive controls (input, checkbox, radio) to advanced widgets (date picker, rich editor, file upload). All follow the MTS pattern: progressive enhancement from native HTML, an instance-based JS API, and no external dependencies.

---

## Components

| Component | JS class | Description |
|-----------|----------|-------------|
| `matios-ui-button` | `MTS.Button` | Buttons with variants, sizes, icons, grouping and progressive enhancement of `<button>`/`<a>`. |
| `matios-ui-checkbox` | `MTS.Checkbox` / `MTS.CheckboxGroup` | Individual checkbox and vertical/horizontal groups with disabled and indeterminate states. |
| `matios-ui-colorpicker` | `MTS.ColorPicker` | Color picker with HSL sliders, preset palette and hex/rgb/hsl output. |
| `matios-ui-confirmbutton` | `MTS.ConfirmButton` | Two-step inline confirmation for sensitive actions, with timeout and danger variants. |
| `matios-ui-copybutton` | `MTS.CopyButton` | Copies text or target content to the clipboard with configurable visual feedback. |
| `matios-ui-date-picker` | `MTS.DatePicker.{Date,Time,DateTime,DateRange,Month,Week}` | Date, time, range, month and week pickers — each type an independent class over a shared base. |
| `matios-ui-fileupload` | `MTS.FileUpload` | Drag & drop zone with type/size validation, previews and upload helpers. |
| `matios-ui-formlayout` | — (CSS only) | Form layout system — stack, grid, horizontal, inline, sections and responsive columns. |
| `matios-ui-formguard` | `MTS.FormGuard` | Declarative dirty-tracking for forms (unsaved-changes guard). |
| `matios-ui-input` | `MTS.Input` | Text fields and textarea with validation, states and progressive enhancement. |
| `matios-ui-label` | `MTS.Label` | Form labels with required/optional badges, hint and error message. |
| `matios-ui-numberinput` | `MTS.NumberInput` | Numeric input with +/− buttons, min/max, step and currency/percentage formats. |
| `matios-ui-passwordstrength` | `MTS.PasswordStrength` | Real-time password-strength meter with configurable rules. |
| `matios-ui-phoneinput` | `MTS.PhoneInput` | Phone input with country selector and automatic regional formatting. |
| `matios-ui-radio` | `MTS.Radio` | Vertical/horizontal radio groups with disabled states and a programmatic API. |
| `matios-ui-rating` | `MTS.Rating` | Star rating with size variants, read-only mode and progressive enhancement. |
| `matios-ui-richeditor` | `MTS.RichEditor` | Template editor with merge fields — WYSIWYG, no dependencies, no iframe. |
| `matios-ui-select` | `MTS.Select` | Custom select with search, multi-select and async loading. |
| `matios-ui-slider` | `MTS.Slider` | Single and dual-range slider with programmatic control. |
| `matios-ui-taginput` | `MTS.TagInput` | Tag input with local suggestions and async search. |
| `matios-ui-toggle` | `MTS.Toggle` | On/off switch in multiple sizes with label, disabled state and a programmatic API. |
| `matios-ui-transferlist` | `MTS.TransferList` | Dual-list transfer with datasource, drag & drop and move buttons. |
| `matios-ui-validation` | `MTS.Validate` | Form validation with rules, messages and API helpers. |

---

## Notes

- All input components follow the **progressive-enhancement** pattern: they work as native HTML if the JS does not load.
- `matios-ui-formlayout` is CSS-only — no JS instance required.
- Validation integrates with `MTS.Input`, `MTS.Select` and other controls via `MTS.Validate`.
- `matios-ui-picker/` is a leftover duplicate of `matios-ui-date-picker/` — use the latter.

> For detailed documentation of each component, see its individual `.md` file.
