# MTS.MarkdownViewer

Fetches a remote `.md` file, parses it with a lightweight built-in parser, and renders it using the framework prose style. Fetch + parse + render in a single line.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-markdownviewer.css">
<script src="matios-ui-markdownviewer.js"></script>
```

Optional — syntax-highlighted, copyable code blocks. When `MTS.CodeBlock` is present, fenced code blocks are rendered through it; otherwise they fall back to plain `<pre><code>`.

```html
<link rel="stylesheet" href="../../utilities/matios-ui-codeblock/matios-ui-codeblock.css">
<script src="../../utilities/matios-ui-codeblock/matios-ui-codeblock.js"></script>
```

Optional — localized demo/chrome strings for the `MTS.MarkdownViewer` namespace:

```html
<script src="../../base/matios-ui-i18n.js"></script>
<script src="matios-ui-markdownviewer-i18n.js"></script>
```

---

## Usage

The component is element-first: pass an element or a CSS selector as the first argument and an options object as the second. The component builds in place — there is no `.mount()`.

```js
new MTS.MarkdownViewer('#help-panel', {
  url: '/messaging/help/help.en.md'
});
```

If `url` is provided, the file is fetched and rendered on construction.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | `string` | `null` | URL of the `.md` file to fetch and render on construction. If omitted, the container starts empty until `load(url)` is called. |

There are no other options. The component does not accept inline `content`, a `sanitize` flag, table-of-contents/anchor options, a syntax-highlight toggle, or a base-path option.

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `load(url)` | the instance | Fetches a different URL and re-renders. Returns the instance for chaining. |
| `destroy()` | `void` | Empties the container and removes the `mts-mdv` class. |

```js
const viewer = new MTS.MarkdownViewer('#container', {
  url: '/help/intro.md'
});
viewer.load('/help/advanced.md');
```

There is no `setContent`, `update`, `getConfig`, or `getCode` method, and the component emits no events.

---

## Supported Markdown

The built-in parser is intentionally small. It supports the following subset:

| Element | Syntax | Notes |
|---------|--------|-------|
| Headings | `#` `##` `###` | h1–h3 only. No h4–h6, no auto anchors, no table of contents. |
| Bold | `**text**` | Italic and strikethrough are not supported. |
| Inline code | `` `code` `` | |
| Code blocks | ` ```lang ` | Fenced. Rendered via `MTS.CodeBlock` (with a copy button) when available; otherwise `<pre><code>`. |
| Tables | `\| col \| col \|` | GFM pipe tables with a `\| --- \| --- \|` separator row. |
| Lists | `- item` / `* item` | Unordered only. No ordered lists, no nesting. |
| Links | `[text](url)` | Always rendered with `target="_blank"`. Images (`![alt](url)`) are not supported. |
| Blockquote | `> text` | Single-line. |
| Divider | `---` | |

### Literal pipes in table cells

Table cells are split on `|`, honoring the escape sequence `\|`. To place a literal pipe inside a cell, write `\|` — it renders as a single `|` and does not start a new column:

```md
| Feature | Example      |
|---------|--------------|
| Alt     | `a \| b`     |
```

---

## Security

The parser escapes `&`, `<`, and `>` in the source before applying inline rules, so raw HTML in the `.md` is neutralized rather than executed. The component does not call `MTS.Sanitize`; the `.md` content is assumed to come from a trusted source (authored by the developer, not submitted by an end user).

---

## Notes

- The fetch is relative to the URL of the document that instantiates the component.
- If the file does not exist or the server returns a non-2xx status, the container is left empty — no exception is thrown and no error text is shown.

---

## Internationalization

`MTS.MarkdownViewer` participates in the framework's single global language API. The language is set once at application startup and applies to every component:

```js
MTS.setLanguage('en'); // 'es' | 'en' | 'pt'
```

Related global helpers:

| Function | Description |
|----------|-------------|
| `MTS.setLanguage(lang)` | Sets the active language for all components. |
| `MTS.getLanguage()` | Returns the active language code. |
| `MTS.getString()` | Returns the merged string table for the active language. |

There is no per-instance `locale` option, and no `getMessages` / `setLocale` / `getLocale` methods.

The component itself renders no user-facing chrome of its own (no toolbar, no table-of-contents title, no empty-state label), so it has no localizable strings beyond the demo. The `MTS.MarkdownViewer` namespace in `matios-ui-markdownviewer-i18n.js` supplies the demo page text (`es` / `en` / `pt`). The copy button on code blocks is owned and localized by `MTS.CodeBlock`.
