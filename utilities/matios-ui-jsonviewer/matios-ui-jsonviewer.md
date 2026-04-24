# MTS.JsonViewer

[EN] Collapsible JSON viewer for payloads, config, diagnostics, and structured responses. Accepts a raw JSON string or a JavaScript object, formats it, and lets the user expand, collapse, paste, and copy the result.
[ES] Visor plegable de JSON para payloads, config, diagnostico y respuestas estructuradas. Acepta un string JSON o un objeto JavaScript, lo formatea y permite expandir, colapsar, pegar y copiar el resultado.

---

## Installation / Instalacion

```html
<link rel="stylesheet" href="utilities/matios-ui-jsonviewer/matios-ui-jsonviewer.css">
<script src="icons/matios-ui-icons.js"></script>
<script src="forms/matios-ui-copybutton/matios-ui-copybutton.js"></script>
<script src="utilities/matios-ui-jsonviewer/matios-ui-jsonviewer.js"></script>
```

`matios-ui-icons.js` es opcional, pero mejora los toggles con iconos Matios.

---

## Quickstart

```js
new MTS.JsonViewer('#payload', {
  title: 'Request body',
  subtitle: 'POST /api/roles',
  data: '{"name":"Admin","active":true,"modules":["users","billing"]}',
  copyable: true
});
```

Tambien puedes pasar un objeto directamente:

```js
new MTS.JsonViewer('#session', {
  title: 'Session',
  data: {
    user: 'demo@matios.dev',
    roles: ['owner', 'billing-admin'],
    active: true
  }
});
```

Si quieres pegar JSON directamente dentro del componente:

```js
new MTS.JsonViewer('#editor', {
  title: 'Paste and format',
  editable: true,
  placeholder: 'Pega aqui tu JSON y presiona Format'
});
```

---

## Constructor options / Opciones

| Option | Type | Default | Description |
|---|---|---|---|
| `data` | `string \| object \| array` | `''` | JSON string o estructura JS a visualizar |
| `title` | `string` | `''` | Titulo superior |
| `subtitle` | `string` | `''` | Texto secundario |
| `copyable` | `boolean` | `true` | Muestra boton copiar |
| `height` | `string` | `'auto'` | Alto del componente |
| `collapsedDepth` | `number \| null` | `null` | Colapsa nodos a partir de cierta profundidad |
| `emptyText` | `string` | `'Sin datos JSON.'` | Texto para estado vacio |
| `editable` | `boolean` | `false` | Muestra textarea interna para pegar JSON |
| `placeholder` | `string` | `'Pega aqui un JSON y presiona Format.'` | Placeholder de la textarea |

---

## Methods / Metodos

### `setData(data)`

Actualiza el payload y vuelve a renderizar el arbol.

```js
viewer.setData('{"status":"ok","items":[1,2,3]}');
viewer.setData({ status: 'ok', items: [1, 2, 3] });
```

### `setTitle(title, subtitle?)`

Actualiza titulo y subtitulo del toolbar.

### `expandAll()`

Expande todos los nodos.

### `collapseAll()`

Colapsa todos los nodos hijos del root.

### `format()`

Si el componente esta en modo `editable`, toma el contenido de la textarea, intenta parsearlo y lo formatea dentro del viewer.

### `destroy()`

Limpia el componente.

---

## Invalid JSON / JSON invalido

Si `data` es string y `JSON.parse()` falla:

- muestra el mensaje de error
- conserva el texto raw
- permite copiar el contenido original

Eso sirve para soporte, debugging o validacion rapida de payloads mal formados.

---

## Good fit / Donde calza bien

- `DiagnosticsPanel`
- `HttpClient`
- inspectores de requests/responses
- configuracion de modulos
- visores de session
- demos de payloads API
