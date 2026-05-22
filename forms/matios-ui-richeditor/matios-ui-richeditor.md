# MTS.RichEditor

Editor de plantillas con merge fields. Monta sobre un `<textarea>` existente (progressive enhancement) — sin el JS, el textarea funciona solo; con él, se convierte en un editor WYSIWYG con chips atómicos, paleta de campos agrupada y formato básico.

`getValue()` / `setValue()` retornan y reciben el string Handlebars crudo idéntico al del textarea, lo que hace el swap transparente para el consumidor.

---

## Instalación

```html
<link rel="stylesheet" href="forms/matios-ui-richeditor/matios-ui-richeditor.css">
<script src="utilities/matios-ui-sanitize/matios-ui-sanitize.js"></script>
<script src="forms/matios-ui-richeditor/matios-ui-richeditor.js"></script>
```

`MTS.Sanitize` es opcional pero recomendado — se usa automáticamente si está cargado.

---

## Uso básico

```html
<textarea id="mi-editor"></textarea>
```

```js
const editor = new MTS.RichEditor('#mi-editor', {
  catalog: [
    { token: '{{user.firstName}}',  label: 'Nombre',        group: 'Usuario' },
    { token: '{{user.email}}',      label: 'Email',          group: 'Usuario' },
    { token: '{{company.name}}',    label: 'Nombre empresa', group: 'Empresa' },
    { token: '{{otp.code}}',        label: 'Código OTP',     group: 'OTP' },
  ],
  height:   '240px',
  onChange: function(val) {
    console.log(val); // → Handlebars HTML string
  }
});
```

Con valor inicial (desde backend):

```js
editor.setValue(
  '<p>Hola {{user.firstName}},</p>' +
  '<p>Tu código es {{otp.code}}.</p>'
);

editor.getValue();
// → '<p>Hola {{user.firstName}},</p><p>Tu código es {{otp.code}}.</p>'
```

---

## Opciones

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `catalog` | `array` | `[]` | `[{ token, label, group }]` — catálogo de campos disponibles |
| `placeholder` | `string` | `'Escribe el mensaje...'` | Texto placeholder del editor |
| `searchPlaceholder` | `string` | `'Buscar campo...'` | Texto placeholder del buscador de la paleta |
| `height` | `string` | `'260px'` | Altura mínima del área de edición |
| `toolbar` | `array` | `['format','lists','insert','fields']` | Array de botones o grupos legacy. Ver sección **Toolbar** abajo. |
| `minHeight` | `string` | `'120px'` | Altura mínima del área de edición |
| `labels` | `object` | ver abajo | Strings de la UI para multilenguaje. Solo se necesita declarar las claves a sobreescribir. |
| `maxLength` | `number` | `0` | Límite de caracteres (texto plano). `0` = sin límite |
| `readonly` | `boolean` | `false` | Editor no editable (toolbar oculta) |
| `disabled` | `boolean` | `false` | Editor completamente deshabilitado |
| `onChange` | `function` | `null` | `function(e)` — `e.detail.value` = Handlebars HTML string |
| `onFocus` | `function` | `null` | `function(e)` — editor enfocado |
| `onBlur` | `function` | `null` | `function(e)` — editor desenfocado |

---

## Toolbar

El array `toolbar` acepta dos formatos que pueden mezclarse:

### 1 — Constantes `BTN` (formato recomendado)

```js
var BTN = MTS.RichEditor.ToolbarButton;

var editor = new MTS.RichEditor('#mi-editor', {
  toolbar: [
    // Constante directa — usa label/tooltip por defecto del componente
    BTN.BOLD, BTN.ITALIC, BTN.UNDERLINE, BTN.STRIKE,
    BTN.SEP,

    // Config object — permite sobreescribir label, tooltip, options y show
    { button: BTN.FORMAT_BLOCK },
    { button: BTN.FONT_SIZE,   label: 'Size', tooltip: 'Font size in px',
      options: [12, 14, 16, 18, 20, 24, 32] },
    { button: BTN.FONT_FAMILY, label: 'Font',
      options: [
        { label: 'Default',     value: '' },
        { label: 'DM Sans',     value: 'DM Sans, sans-serif' },
        { label: 'Georgia',     value: 'Georgia, serif' },
      ] },
    BTN.SEP,

    BTN.LIST_UL, BTN.LIST_OL, BTN.INDENT, BTN.OUTDENT,
    BTN.SEP,

    BTN.LINK, BTN.UNLINK, BTN.TEXT_COLOR, BTN.BG_COLOR,
    BTN.SEP,

    BTN.TABLE, BTN.HTML_SOURCE, BTN.UNDO, BTN.CLEAN_FORMAT,
    { button: BTN.REDO, show: false },   // definida pero oculta
    BTN.SEP,

    { button: BTN.FIELDS, label: 'Fields', tooltip: 'Toggle merge field palette' },
  ],
});
```

#### Propiedades del config object

| Propiedad | Tipo | Descripción |
|---|---|---|
| `button` | `BTN.*` | **Requerido.** Constante del botón. |
| `label` | `string` | Texto visible en el botón. Sobreescribe el label por defecto. |
| `tooltip` | `string` | Tooltip del hover (`title`). Default: igual que `label`. |
| `options` | `array` | Opciones del select. Aplica a `FONT_SIZE`, `FONT_FAMILY` y `FORMAT_BLOCK`. |
| `show` | `boolean` | `false` = oculta el botón sin borrarlo del array. |

#### Constantes disponibles (`MTS.RichEditor.ToolbarButton`)

| Constante | Tipo | Descripción |
|---|---|---|
| `BOLD` | botón | Negrita |
| `ITALIC` | botón | Cursiva |
| `UNDERLINE` | botón | Subrayado |
| `STRIKE` | botón | Tachado |
| `FORMAT_BLOCK` | select | Párrafo / encabezados (Normal, H1, H2, H3, Cita, Código) |
| `FONT_SIZE` | select | Tamaño de fuente. Requiere `options: [...]`. |
| `FONT_FAMILY` | select | Familia de fuente. Requiere `options: [...]`. |
| `LIST_UL` | botón | Lista con viñetas |
| `LIST_OL` | botón | Lista numerada |
| `INDENT` | botón | Indentar |
| `OUTDENT` | botón | Desindentar |
| `ALIGN_LEFT` | botón | Alinear izquierda |
| `ALIGN_CENTER` | botón | Centrar |
| `ALIGN_RIGHT` | botón | Alinear derecha |
| `ALIGN_FULL` | botón | Justificar |
| `LINK` | botón | Insertar enlace |
| `UNLINK` | botón | Quitar enlace |
| `TEXT_COLOR` | color | Color de texto |
| `BG_COLOR` | color | Color de fondo |
| `TABLE` | botón | Insertar tabla (picker visual de filas × columnas) |
| `HTML_SOURCE` | botón | Abrir/cerrar panel HTML fuente |
| `UNDO` | botón | Deshacer |
| `REDO` | botón | Rehacer |
| `CLEAN_FORMAT` | botón | Limpiar formato |
| `FIELDS` | botón | Toggle de paleta de campos |
| `SEP` | separador | Línea divisoria vertical entre grupos |

### 2 — Grupos legacy (strings)

Formato compatible con versiones anteriores. Los grupos se separan automáticamente con `SEP`:

```js
toolbar: ['format', 'lists', 'insert', 'fields']
```

| Grupo | Botones incluidos |
|---|---|
| `'format'` | BOLD, ITALIC, UNDERLINE, STRIKE, FORMAT_BLOCK |
| `'font'` | FONT_SIZE (si `fontSizes`), FONT_FAMILY (si `fonts`) |
| `'lists'` | LIST_UL, LIST_OL, INDENT, OUTDENT |
| `'align'` | ALIGN_LEFT, ALIGN_CENTER, ALIGN_RIGHT, ALIGN_FULL |
| `'insert'` | LINK, UNLINK, TEXT_COLOR, BG_COLOR |
| `'table'` | TABLE |
| `'source'` | HTML_SOURCE |
| `'clean'` | UNDO, REDO, CLEAN_FORMAT |
| `'fields'` | FIELDS |

---

### Labels (multilenguaje)

Los defaults son en español. Declarar sólo las claves a sobreescribir:

```js
// Ejemplo en inglés
const editor = new MTS.RichEditor('#mi-editor', {
  catalog: [...],
  labels: {
    bold: 'Bold', italic: 'Italic', underline: 'Underline', strike: 'Strikethrough',
    normal: 'Normal', heading1: 'Heading 1', heading2: 'Heading 2', heading3: 'Heading 3',
    quote: 'Quote', code: 'Code',
    listUl: 'Bullet list', listOl: 'Numbered list', indent: 'Indent', outdent: 'Outdent',
    alignLeft: 'Left', alignCenter: 'Center', alignRight: 'Right', alignFull: 'Justify',
    linkInsert: 'Insert link', linkRemove: 'Remove link',
    textColor: 'Text color', bgColor: 'Background color',
    undo: 'Undo', redo: 'Redo', cleanFormat: 'Clear formatting',
    htmlSource: 'HTML', fields: 'Fields', fontSize: 'Size', fontFamily: 'Font',
    urlLabel: 'URL:', urlApply: 'Apply', urlCancel: '×',
    htmlApply: 'Apply', htmlCancel: '×',
  }
});
```

---

## API

| Método | Descripción |
|---|---|
| `getValue()` | Retorna el string Handlebars crudo (chips → `{{token}}`) |
| `setValue(str)` | Carga un string Handlebars. Los `{{...}}` se convierten a chips automáticamente. |
| `setCatalog(catalog)` | Reemplaza el catálogo y actualiza la paleta. Útil para carga asíncrona desde una API. |
| `insertField(token)` | Inserta un chip en la posición actual del cursor |
| `setPreview(bool)` | `true` = modo read-only visual (toolbar + paleta ocultas) |
| `getCustomFields()` | Retorna `[{token, label, defaultValue}]` de los campos custom definidos |
| `focus()` | Enfoca el editor |
| `destroy()` | Restaura el textarea original con el valor actual y elimina el editor del DOM |
| `on(event, fn)` | Registra un listener. Eventos: `'change'` (`e.detail.value`), `'focus'`, `'blur'` |
| `off(event, fn)` | Elimina un listener |

```js
const editor = new MTS.RichEditor('#mi-editor', { catalog: [...] });

// Insertar campo en el cursor (desde código externo)
editor.insertField('{{user.firstName}}');

// Leer el valor (Handlebars string)
const template = editor.getValue();

// Cargar valor guardado
editor.setValue('<p>Hola {{user.firstName}},</p>');

// Preview — mostrar sin edición
editor.setPreview(true);
editor.setPreview(false); // volver a editar

// Custom fields definidos por el usuario
const customs = editor.getCustomFields();
// → [{ token: '{{custom.campo}}', label: 'Mi campo', defaultValue: 'valor' }]

editor.destroy(); // limpia y restaura el textarea
```

---

## Eventos DOM

```js
document.getElementById('mi-editor')
  .addEventListener('mts:re:change', function(e) {
    console.log(e.detail.value); // Handlebars HTML string
  });

document.getElementById('mi-editor')
  .addEventListener('mts:re:focus', function() { /* ... */ });
```

---

## Catálogo de campos

El catálogo es un array de objetos `{ token, label, group }` que el consumidor inyecta. El componente no sabe de dónde vienen los campos — solo los muestra en la paleta y los reconoce al parsear.

```js
const catalog = [
  { token: '{{user.firstName}}',  label: 'Nombre',          group: 'Usuario' },
  { token: '{{user.lastName}}',   label: 'Apellido',         group: 'Usuario' },
  { token: '{{company.name}}',    label: 'Nombre empresa',   group: 'Empresa' },
  { token: '{{otp.code}}',        label: 'Código OTP',       group: 'OTP' },
  { token: '{{link.reset}}',      label: 'Enlace de reset',  group: 'Enlace' },
];
```

---

## Custom fields

El usuario puede definir campos propios desde la paleta (botón `+ Campo personalizado`). Cada campo custom tiene:
- **Token**: se auto-prefija con `custom.` → `{{custom.miCampo}}`
- **Etiqueta visible** en la paleta y en el chip
- **Valor por defecto** estático (para referencia del backend)

Los chips custom se muestran en color naranja para distinguirlos de los del catálogo.

El componente no resuelve valores — eso es responsabilidad del backend del consumidor.

```js
// Guardar customs junto al template al guardar el formulario
const data = {
  body:         editor.getValue(),
  customFields: editor.getCustomFields(),
};
```

---

## Progressive enhancement

Si el JS del componente no está cargado (o se llama `destroy()`), el `<textarea>` funciona solo y contiene el string Handlebars crudo. El consumidor puede hacer submit del formulario sin cambios — el valor sigue siendo compatible.

```html
<!-- El consumidor no necesita cambiar nada cuando llegue el componente -->
<form>
  <textarea name="templateBody" id="body-editor"></textarea>
  <button type="submit">Guardar</button>
</form>

<script>
  // Solo agregar esto cuando el componente esté disponible
  new MTS.RichEditor('#body-editor', { catalog: CATALOG });
</script>
```

---

## Notas

- El round-trip entre chips y Handlebars es exacto: `getValue()` nunca altera ni corrompe los tokens `{{...}}`.
- Al pegar texto desde el portapapeles, el HTML externo se descarta y se trabaja solo con texto plano — cualquier `{{...}}` en el texto pegado se convierte automáticamente a chips.
- La serialización (`getValue()`) clona el DOM del editor para no alterar el contenido visible mientras se lee el valor.
- Los chips son `contenteditable="false"` — los browsers modernos los tratan como un carácter único para cursor y selección.

---

## Changelog

### 2026-05-21
- **Fix bug 1** — Items de la paleta de campos ahora capturan `_saveRange()` en `mousedown`, igual que los botones de toolbar. Antes, el segundo campo (y siguientes) se insertaban en la posición del cursor anterior en lugar de la posición actual.
- **Fix bug 2** — En modo HTML source (`_htmlMode`): `insertField()` y `_exec()` retornan inmediatamente sin operar sobre el editor WYSIWYG oculto. Toolbar y paleta se atenúan visualmente (`opacity:.4; pointer-events:none`) para indicar que no aplican en modo edición de HTML crudo.

### 2026-05-19
- Componente renombrado a `MTS.RichEditor` (reemplaza y consolida `MTS.MergeFieldEditor` y `MTS.RichTextEditor`)
- `MTS.RichEditor.ToolbarButton` — objeto estático con constantes de botón (`BTN.BOLD`, `BTN.SEP`, etc.)
- Nuevo formato de toolbar: constantes directas (`BTN.BOLD`) + config objects `{ button, label, tooltip, options, show }`
  - `label` sobreescribe el texto visible del botón
  - `tooltip` sobreescribe el title del hover (default: igual que label)
  - `show: false` oculta el botón sin borrarlo del array
- Formato legacy de grupos (`'format'`, `'lists'`, etc.) sigue siendo compatible
- Prefijo CSS: `mts-re__*` / `mts-re--*`
- Eventos DOM: `mts:re:change`, `mts:re:focus`, `mts:re:blur`
- Progressive enhancement sobre `<textarea>`
- Chips atómicos con round-trip exacto `{{token}}` ↔ chip DOM
- Paleta de campos agrupada con filtro, acordeón y custom fields
- Grupo `'source'` opt-in: panel HTML editable en crudo
- Grupo `'table'` opt-in: picker visual de filas × columnas
- `labels` — sistema multilenguaje: defaults en español, sobreescribible por clave
- `setPreview(bool)` — modo read-only visual
- `getCustomFields()` — expone los campos definidos por el usuario
- Solicitado por: matios-genesys / matios-platform-messaging (Fase 2)
