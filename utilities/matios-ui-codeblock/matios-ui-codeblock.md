# MTS.CodeBlock

Reusable code block with syntax highlighting and optional copy.

---

## Installation

```html
<link rel="stylesheet" href="utilities/matios-ui-codeblock/matios-ui-codeblock.css">
<script src="utilities/matios-ui-codeblock/matios-ui-codeblock.js"></script>
```

---

## Usage

```html
<div id="snippet"></div>
```

```js
new MTS.CodeBlock('#snippet', {
  title:    'index.html',
  subtitle: 'apps/users/index.html',
  language: 'html',
  code:     '<section class="mts-surface">...</section>',
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `code` | `string` | `''` | Source text to render |
| `language` | `string` | `'text'` | Language or alias (`js`, `ts`, `cs`, `html`, `sql`, …) |
| `title` | `string` | `''` | Short snippet title |
| `subtitle` | `string` | `''` | Secondary meta, e.g. the file path |
| `copyable` | `boolean` | `true` | Show the copy action |
| `wrap` | `boolean` | `false` | Enable `pre-wrap` for long lines |

---

## API

| Method | Description |
|--------|-------------|
| `setCode(code)` | Replace the source code |
| `setLanguage(lang)` | Change the highlighting language |
| `setTitle(title[, subtitle])` | Update the title and subtitle |

```js
const block = new MTS.CodeBlock('#snippet', { code: 'const ok = true;', language: 'javascript' });
block.setCode('const ok = false;');
block.setLanguage('typescript');
block.setTitle('main.ts', 'src/main.ts');
```

---

## Supported languages

`html` · `xml` · `css` · `javascript` · `typescript` · `jsx` · `tsx` · `json` · `csharp` · `java` · `sql` · `bash`
· `powershell` · `yaml` · `text`

**Aliases:** `js` → `javascript`, `ts` → `typescript`, `cs` → `csharp`, `sh` → `bash`, `ps1` → `powershell`,
`markup` → `html`, `scss`/`less` → `css`.

---

## Notes

- If `MTS.CopyButton` is loaded, `CodeBlock` uses it for the copy button; otherwise it falls back to a simple button
  using the native Clipboard API.
- The highlighting is lightweight and consistent — not a full parser for each language.

---

## Accessibility

- The copy button is a real, keyboard-focusable control; the code renders inside `<pre><code>` preserving whitespace.

---

## Changelog

### 2026-05-17
- Documentation homologated to the standard template; install paths added from the framework root.
