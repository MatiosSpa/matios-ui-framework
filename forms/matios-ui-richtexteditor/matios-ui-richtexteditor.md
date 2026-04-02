# MTS.RichTextEditor

Editor WYSIWYG basado en `contentEditable`. 0 dependencias, sin iframes, sin librerías externas.

## Uso
```js
const rte = new MTS.RichTextEditor('#el', {
  value:   '<p>Contenido inicial</p>',
  height:  '300px',
  toolbar: ['format', 'lists', 'align', 'insert', 'clean'],
  onChange: (html) => console.log(html),
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `value` | `string` | `''` | HTML inicial |
| `placeholder` | `string` | `'Escribe aquí...'` | |
| `height` | `string` | `'240px'` | Alto del área |
| `minHeight` | `string` | `'120px'` | Alto mínimo |
| `disabled` | `boolean` | `false` | |
| `readonly` | `boolean` | `false` | |
| `toolbar` | `Array` | todos | Grupos: `'format'`\|`'lists'`\|`'align'`\|`'insert'`\|`'clean'` |
| `onChange` | `function` | `null` | `(html) => {}` |
| `onFocus` / `onBlur` | `function` | `null` | |

## API
```js
rte.getValue()           // → HTML string
rte.setValue('<p>Hola</p>')
rte.getText()            // → texto plano sin HTML
rte.insertHTML('<em>texto</em>')
rte.clear()
rte.focus()
rte.disable() / rte.enable()
rte.destroy()
```

## Toolbar
```js
// Solo negrita, cursiva y limpiar
new MTS.RichTextEditor('#el', {
  toolbar: ['format', 'clean'],
})

// Toolbar mínima
new MTS.RichTextEditor('#el', {
  toolbar: ['format'],
})
```
