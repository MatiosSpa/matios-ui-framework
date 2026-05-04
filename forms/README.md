# Forms

🇬🇧 Input and form components. Covers everything from primitive controls (input, checkbox, radio) to advanced widgets (date picker, rich text editor, file upload). All follow the MTS pattern: progressive enhancement from native HTML, instance-based JS API, no external dependencies.
🇪🇸 Componentes de entrada de datos y formularios. Cubren desde controles primitivos (input, checkbox, radio) hasta widgets avanzados (date picker, rich text editor, file upload). Todos siguen el patrón MTS: enhancement progresivo desde HTML nativo, API por instancia JS, sin dependencias externas.

---

## Components / Componentes

| Componente | Clase JS | 🇬🇧 Description / 🇪🇸 Descripción |
|---|---|---|
| `matios-ui-button` | `MTS.Button` | 🇬🇧 Buttons with variants, sizes, icons, grouping and progressive enhancement of `<button>` or `<a>` elements. / 🇪🇸 Botones con variantes, tamaños, iconos, agrupación y enhancement progresivo de `<button>` o `<a>`. |
| `matios-ui-checkbox` | `MTS.Checkbox` | 🇬🇧 Individual checkbox and vertical/horizontal groups with disabled and indeterminate states. / 🇪🇸 Checkbox individual y grupos vertical/horizontal con estados disabled e indeterminate. |
| `matios-ui-colorpicker` | `MTS.ColorPicker` | 🇬🇧 Color picker with HSL sliders, preset palette and hex/rgb/hsl output. / 🇪🇸 Selector de color con sliders HSL, paleta de presets y output hex/rgb/hsl. |
| `matios-ui-confirmbutton` | `MTS.ConfirmButton` | 🇬🇧 Two-step inline confirmation for sensitive actions, with timeout and danger variants. / 🇪🇸 Confirmación inline en dos pasos para acciones sensibles, con timeout y variantes de peligro. |
| `matios-ui-copybutton` | `MTS.CopyButton` | 🇬🇧 Copies text or target content to the clipboard with configurable visual feedback. / 🇪🇸 Copia texto o contenido objetivo al portapapeles con feedback visual configurable. |
| `matios-ui-date-picker` | `MTS.DatePicker` · `MTS.TimePicker` · `MTS.DateRangePicker` · `MTS.MonthPicker` · `MTS.WeekPicker` | 🇬🇧 Date, time, range, month and week pickers. Each type is an independent class. / 🇪🇸 Selectores de fecha, hora, rango, mes y semana. Cada tipo es una clase independiente. |
| `matios-ui-fileupload` | `MTS.FileUpload` | 🇬🇧 Drag & drop zone with type/size validation, previews and upload helpers. / 🇪🇸 Zona drag & drop con validación de tipo/tamaño, previews y helpers de upload. |
| `matios-ui-formlayout` | — (CSS only) | 🇬🇧 Form layout system — stack, grid, horizontal, inline, sections and responsive columns. / 🇪🇸 Sistema de layout para formularios — stack, grid, horizontal, inline, sections y columnas responsivas. |
| `matios-ui-input` | `MTS.Input` | 🇬🇧 Text fields and textarea with validation, states (error/success/disabled) and progressive enhancement. / 🇪🇸 Campos de texto y textarea con validación, estados (error/success/disabled) y enhancement progresivo. |
| `matios-ui-label` | `MTS.Label` | 🇬🇧 Form labels with required/optional badges, hint and error message. / 🇪🇸 Etiquetas de formulario con badges required/optional, hint y mensaje de error. |
| `matios-ui-numberinput` | `MTS.NumberInput` | 🇬🇧 Numeric input with +/− buttons, min/max, step and currency/percentage formats. / 🇪🇸 Input numérico con botones +/−, min/max, step y formatos de moneda y porcentaje. |
| `matios-ui-passwordstrength` | `MTS.PasswordStrength` | 🇬🇧 Real-time password strength meter with configurable rules. / 🇪🇸 Medidor de fortaleza de contraseña en tiempo real con reglas configurables. |
| `matios-ui-phoneinput` | `MTS.PhoneInput` | 🇬🇧 Phone input with country selector, automatic regional formatting and progressive enhancement. / 🇪🇸 Input de teléfono con selector de país, formato automático por región y enhancement progresivo. |
| `matios-ui-picker` | `MTS.DatePicker` (alias) | 🇬🇧 Legacy alias — use `matios-ui-date-picker`. / 🇪🇸 Alias legacy — usar `matios-ui-date-picker`. |
| `matios-ui-radio` | `MTS.Radio` | 🇬🇧 Vertical/horizontal radio button groups with disabled states and programmatic API. / 🇪🇸 Grupo de radio buttons vertical/horizontal con estados disabled y API programática. |
| `matios-ui-rating` | `MTS.Rating` | 🇬🇧 Star rating with size variants, read-only mode and progressive enhancement. / 🇪🇸 Calificación por estrellas con variantes de tamaño, solo lectura y enhancement progresivo. |
| `matios-ui-richtexteditor` | `MTS.RichTextEditor` | 🇬🇧 WYSIWYG editor — contentEditable, no dependencies, no iframe. / 🇪🇸 Editor WYSIWYG — contentEditable, sin dependencias, sin iframe. |
| `matios-ui-select` | `MTS.Select` | 🇬🇧 Custom select with search, multi-select, async loading and cascade support. / 🇪🇸 Select personalizado con búsqueda, multi-select, carga asíncrona y soporte cascada. |
| `matios-ui-slider` | `MTS.Slider` | 🇬🇧 Single and dual-range slider with programmatic control. / 🇪🇸 Slider simple y rango doble con control programático. |
| `matios-ui-taginput` | `MTS.TagInput` | 🇬🇧 Tag input with local suggestions, async search and progressive enhancement. / 🇪🇸 Etiquetas con sugerencias locales, búsqueda async y enhancement progresivo. |
| `matios-ui-toggle` | `MTS.Toggle` | 🇬🇧 On/off switch in multiple sizes with label, disabled state and programmatic API. / 🇪🇸 Switch on/off en distintos tamaños con label, disabled y API programática. |
| `matios-ui-transferlist` | `MTS.TransferList` | 🇬🇧 Dual-list transfer with datasource, drag & drop and move buttons. / 🇪🇸 Transferencia entre listas con datasource, drag & drop y botones de movimiento. |
| `matios-ui-validation` | `MTS.Validation` | 🇬🇧 Form validation with rules, messages and API helpers. / 🇪🇸 Validación de formularios con reglas, mensajes y API helpers. |

---

## Notes / Notas

- 🇬🇧 All input components follow the **progressive enhancement** pattern: they work as native HTML if JS does not load. / 🇪🇸 Todos los componentes de input siguen el patrón **enhancement progresivo**: funcionan como HTML nativo si el JS no carga.
- 🇬🇧 `matios-ui-date-picker` and `matios-ui-picker` share the same base; use `matios-ui-date-picker`. / 🇪🇸 `matios-ui-date-picker` y `matios-ui-picker` comparten la misma base; usar `matios-ui-date-picker`.
- 🇬🇧 `matios-ui-formlayout` is CSS-only — no JS instance required. / 🇪🇸 `matios-ui-formlayout` es CSS puro — no requiere instancia JS.
- 🇬🇧 Validation integrates with `MTS.Input`, `MTS.Select` and other controls via `MTS.Validation`. / 🇪🇸 La validación se integra con `MTS.Input`, `MTS.Select` y demás controles vía `MTS.Validation`.
---

🇬🇧 **To see detailed documentation for each component, expand the accordion in the demo and read its individual .md file.**
🇪🇸 **Para ver la documentación detallada de cada componente, expanda el acordeón en el demo y lea el .md individual.**
