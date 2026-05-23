# MTS.MarkdownViewer

Renderiza archivos `.md` remotos con el estilo de prosa del framework. Fetch + parse + render en una línea.

---

## Instalación

```html
<link rel="stylesheet" href="matios-ui-markdownviewer.css">
<script src="matios-ui-markdownviewer.js"></script>
```

Opcional — code blocks con syntax highlight:

```html
<link rel="stylesheet" href="matios-ui-codeblock.css">
<script src="matios-ui-codeblock.js"></script>
```

---

## Uso básico

```js
new MTS.MarkdownViewer('#help-panel', {
  url: '/messaging/help/help.es.md'
});
```

---

## Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `url` | `string` | `null` | URL del archivo `.md` a cargar al inicializar |

---

## API

```js
const viewer = new MTS.MarkdownViewer('#container', { url: '/help/intro.md' });

// Cargar una URL distinta en runtime
viewer.load('/help/advanced.md');

// Destruir
viewer.destroy();
```

---

## Markdown soportado

| Elemento | Sintaxis |
|----------|----------|
| Headers | `#` `##` `###` |
| Bold | `**texto**` |
| Inline code | `` `código` `` |
| Code blocks | ` ```lang ` |
| Tablas | `\| col \| col \|` |
| Listas | `- ítem` |
| Links | `[texto](url)` |
| Blockquote | `> texto` |
| Separador | `---` |

Los code blocks usan `MTS.CodeBlock` si está disponible en el contexto. Si no, renderizan como `<pre><code>`.

---

## Notas

- El fetch es relativo a la URL del documento que instancia el componente.
- Si el archivo no existe o el servidor retorna error, el contenedor queda vacío sin lanzar excepción.
- El componente no aplica `MTS.Sanitize` al HTML generado — el contenido del `.md` se asume de fuente confiable (controlada por el desarrollador, no por el usuario final).

---

## Changelog

### 2026-05-22
- Componente creado. Parser extraído de `index.html` y encapsulado como `MTS.MarkdownViewer`.
