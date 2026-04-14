# MTS.RichTextEditor

[EN] WYSIWYG rich text editor based on `contentEditable`. No dependencies, no iframe, no external libraries.
[ES] Editor de texto enriquecido WYSIWYG basado en `contentEditable`. 0 dependencias, sin iframe, sin librerías externas.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-richtexteditor.css">
<script src="matios-ui-richtexteditor.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `value` | `string` | `''` | [EN] Initial HTML content / [ES] Contenido HTML inicial |
| `placeholder` | `string` | `'Escribe aquí...'` | |
| `height` | `string` | `'240px'` | [EN] Editor area height / [ES] Alto del área del editor |
| `minHeight` | `string` | `'120px'` | [EN] Minimum height / [ES] Alto mínimo |
| `toolbar` | `array` | `['format','lists','align','insert','clean']` | [EN] Toolbar groups / [ES] Grupos de toolbar |
| `disabled` | `boolean` | `false` | [EN] Disables editing / [ES] Deshabilita la edición |
| `readonly` | `boolean` | `false` | [EN] Read-only mode / [ES] Modo solo lectura |
| `onChange` | `function` | — | [EN] `(html) => {}` Fires on content change / [ES] Se dispara al cambiar el contenido |
| `onFocus` | `function` | — | [EN] Fires on focus / [ES] Se dispara al enfocar |
| `onBlur` | `function` | — | [EN] Fires on blur / [ES] Se dispara al perder foco |

---

## Toolbar Groups / Grupos de Toolbar

| Group / Grupo | Buttons / Botones |
|---------------|-------------------|
| `'format'` | Bold, Italic, Underline, Strikethrough, H1, H2 |
| `'lists'` | Unordered list, Ordered list |
| `'align'` | Left, Center, Right, Justify |
| `'insert'` | Link, Image URL, Horizontal rule |
| `'clean'` | Remove formatting |
| `'table'` | Insert table |

---

## Events / Eventos

[EN] Use `onChange`, `onFocus` and `onBlur` in the constructor.
[ES] Usa `onChange`, `onFocus` y `onBlur` en el constructor.

```js
new MTS.RichTextEditor('#my-editor', {
  // Fires on every content change, receives HTML / Se dispara al cambiar, recibe HTML
  onChange: (html) => {
    console.log(html); // → '<p><strong>Hello</strong></p>'
  },

  // Fires when editor gains focus / Se dispara al enfocar el editor
  onFocus: () => console.log('focused'),

  // Fires when editor loses focus / Se dispara al perder foco
  onBlur: (html) => console.log('blurred:', html),
});
```

---

## HTML Usage / Uso HTML

```html
<div id="editor-notes"></div>

<script>
  new MTS.RichTextEditor('#editor-notes', {
    placeholder: 'Write your notes here...',
    height:      '300px',
    onChange:    (html) => console.log(html),
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Full toolbar / Toolbar completa
const rte = new MTS.RichTextEditor('#my-editor', {
  // Initial HTML / HTML inicial
  value: '<p>Hello <strong>world</strong></p>',

  // Placeholder / Placeholder
  placeholder: 'Start writing...',

  // Editor height / Alto del editor
  height:    '300px',
  minHeight: '150px',

  // All toolbar groups / Todos los grupos de toolbar
  toolbar: ['format', 'lists', 'align', 'insert', 'clean'],

  // Fires on change / Se dispara al cambiar
  onChange: (html) => console.log(html),
  onFocus:  ()     => console.log('focused'),
  onBlur:   (html) => console.log('blurred'),
});

// Minimal toolbar / Toolbar mínima
new MTS.RichTextEditor('#editor-min', {
  toolbar:  ['format', 'clean'],
  height:   '180px',
  onChange: (html) => console.log(html),
});
```

---

## API

```js
const rte = new MTS.RichTextEditor('#my-editor', { ... });

// Get HTML content / Obtener contenido HTML
rte.getValue()          // → '<p>Hello <strong>world</strong></p>'

// Get plain text / Obtener texto plano
rte.getText()           // → 'Hello world'

// Set HTML content / Establecer contenido HTML
rte.setValue('<p>New content</p>')

// Clear content / Limpiar contenido
rte.clear()

// Focus the editor / Enfocar el editor
rte.focus()

// Insert HTML at cursor / Insertar HTML en la posición del cursor
rte.insertHTML('<strong>inserted</strong>')

// Enable / disable editing / Habilitar / deshabilitar edición
rte.disable()
rte.enable()

// Destroy / Destruir
rte.destroy()
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual docs, standardized structure / [ES] Docs bilingüe, estructura estandarizada |
| 1.0.0 | [EN] Initial release — contentEditable, toolbar groups, no dependencies / [ES] Versión inicial |
