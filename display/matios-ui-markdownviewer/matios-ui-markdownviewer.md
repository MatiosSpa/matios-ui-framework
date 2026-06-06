# MTS.MarkdownViewer

Renders remote `.md` files with the framework prose style. Fetch + parse + render in a single line.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-markdownviewer.css">
<script src="matios-ui-markdownviewer.js"></script>
```

Optional — syntax-highlighted code blocks:

```html
<link rel="stylesheet" href="matios-ui-codeblock.css">
<script src="matios-ui-codeblock.js"></script>
```

---

## Usage

```js
new MTS.MarkdownViewer('#help-panel', { url: '/messaging/help/help.en.md' });
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | `string` | `null` | URL of the `.md` file to load on init |

---

## API

| Method | Description |
|--------|-------------|
| `load(url)` | Load a different URL at runtime |
| `destroy()` | Clear the container |

```js
const viewer = new MTS.MarkdownViewer('#container', { url: '/help/intro.md' });
viewer.load('/help/advanced.md');
```

---

## Supported Markdown

| Element | Syntax |
|---------|--------|
| Headers | `#` `##` `###` |
| Bold | `**text**` |
| Inline code | `` `code` `` |
| Code blocks | ` ```lang ` |
| Tables | `\| col \| col \|` |
| Lists | `- item` |
| Links | `[text](url)` |
| Blockquote | `> text` |
| Divider | `---` |

Code blocks use `MTS.CodeBlock` when available in the context; otherwise they render as `<pre><code>`.

---

## Notes

- The fetch is relative to the URL of the document that instantiates the component.
- If the file does not exist or the server returns an error, the container is left empty — no exception is thrown.
- The component does **not** run `MTS.Sanitize` on the generated HTML — the `.md` content is assumed to come from
  a trusted source (controlled by the developer, not the end user).

---

## Changelog

### 2026-05-22
- Component created. Parser extracted from `index.html` and encapsulated as `MTS.MarkdownViewer`.
