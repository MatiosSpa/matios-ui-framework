# MTS.Sanitize

Static escaping / sanitization utility for XSS prevention. Zero dependencies. Load it before any component that builds dynamic HTML.

---

## Installation

```html
<script src="utilities/matios-ui-sanitize/matios-ui-sanitize.js"></script>
```

---

## Usage

```js
// Sanitize user HTML before injecting it into the DOM
el.innerHTML = MTS.Sanitize.html(userContent);

// Escape plain text to show it as code inside innerHTML
el.innerHTML = '<pre>' + MTS.Sanitize.escape(sourceCode) + '</pre>';

// Safe text for textContent
el.textContent = MTS.Sanitize.text(formValue);
```

---

## API

| Method | Description |
|---|---|
| `MTS.Sanitize.html(str)` | Sanitizes HTML: removes dangerous tags and event handlers, keeps safe HTML intact. |
| `MTS.Sanitize.escape(str)` | Escapes the 5 special HTML characters (`&`, `<`, `>`, `"`, `'`). Use it to show code as plain text inside `innerHTML`. |
| `MTS.Sanitize.attr(str)` | Escapes for safe use in HTML attribute values (`title`, `aria-label`, `data-*`, etc.). Includes the backtick. |
| `MTS.Sanitize.url(str)` | Validates the URL and blocks dangerous protocols (`javascript:`, `data:`, `vbscript:`). Returns `''` if it is dangerous. |
| `MTS.Sanitize.text(str)` | Converts any value to a plain string. A semantic hint that the value goes to `textContent` — it escapes nothing because `textContent` is safe by nature. |

---

## Examples

```js
// html() — removes <script>, event handlers, href="javascript:"
MTS.Sanitize.html('<b>Hello</b><script>alert(1)</script>')
// → '<b>Hello</b>'

MTS.Sanitize.html('<a href="javascript:alert(1)">click</a>')
// → '<a>click</a>'

// escape() — HTML entities
MTS.Sanitize.escape('<script>alert(1)</script>')
// → '&lt;script&gt;alert(1)&lt;/script&gt;'

// attr() — safe in attribute values
MTS.Sanitize.attr('He said "hi"')
// → 'He said &quot;hi&quot;'

// url() — blocks dangerous protocols
MTS.Sanitize.url('javascript:alert(1)')  // → ''
MTS.Sanitize.url('https://example.com')  // → 'https://example.com'
MTS.Sanitize.url('/documents/file.pdf')  // → '/documents/file.pdf'

// text() — idiomatic for textContent
el.textContent = MTS.Sanitize.text(item.name);
```

---

## When to use each method

| Context | Correct method |
|---|---|
| `el.innerHTML = userValue` | `html()` |
| `el.innerHTML = '<pre>' + code + '</pre>'` | `escape()` |
| `el.setAttribute('title', value)` | `attr()` |
| `el.href = userUrl` | `url()` |
| `el.textContent = value` | `text()` or `textContent` directly |

---

## Notes

- `html()` uses `DOMParser` internally — no external dependencies. If parsing fails, it falls back to `escape()`.
- Tags blocked by `html()`: `<script>`, `<style>`, `<iframe>`, `<object>`, `<embed>`, `<base>`, `<link>`, `<meta>`, `<noscript>`, `<template>`.
- Safe SVG (without `use[href^="javascript:"]`) passes through `html()` without issues.

---

## Changelog

### Initial
- Documentation created from scratch (standard template).
