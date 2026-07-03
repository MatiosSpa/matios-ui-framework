# MTS.CodeBlock

Reusable code block with lightweight syntax highlighting and an optional copy button.

---

## Installation

```html
<link rel="stylesheet" href="utilities/matios-ui-codeblock/matios-ui-codeblock.css">
<script src="utilities/matios-ui-codeblock/matios-ui-codeblock.js"></script>
```

Optional dependencies (auto-detected at runtime, no import order enforced):

- `MTS.Badge` — renders the language chip in the toolbar. Falls back to plain text when absent.
- `MTS.CopyButton` — powers the copy action. Falls back to a native Clipboard-API button when absent.
- `base/matios-ui-i18n.js` + `matios-ui-codeblock-i18n.js` — localizes the copy button labels. Without them the component uses its built-in Spanish defaults.

```html
<link rel="stylesheet" href="forms/matios-ui-copybutton/matios-ui-copybutton.css">
<script src="base/matios-ui-i18n.js"></script>
<script src="forms/matios-ui-copybutton/matios-ui-copybutton.js"></script>
<script src="utilities/matios-ui-codeblock/matios-ui-codeblock-i18n.js"></script>
<script src="utilities/matios-ui-codeblock/matios-ui-codeblock.js"></script>
```

---

## Usage

```html
<div id="snippet"></div>
```

```js
new MTS.CodeBlock('#snippet', {
  title:    'role-create/index.html',
  subtitle: 'apps-showcase/roles/role-create/index.html',
  language: 'html',
  code:     '<section class="mts-surface mts-p-4">...</section>'
});
```

The first argument is a CSS selector string or a DOM element. The component builds itself in place inside that element.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `code` | `string` | `''` | Source text to render |
| `language` | `string` | `'text'` | Language or alias (see Supported languages) |
| `title` | `string` | `''` | Short snippet title shown in the toolbar |
| `subtitle` | `string` | `''` | Secondary meta line, e.g. the file path |
| `copyable` | `boolean` | `true` | Show the copy action |
| `toolbar` | `boolean` | `true` | Show the toolbar; when `false` it stays hidden even with title/copy |
| `wrap` | `boolean` | `false` | Enable soft wrapping for long lines |
| `height` | `string` | `'auto'` | CSS value for the block height (sets `--mts-codeblock-height`), e.g. `'400px'` or `'100%'` |
| `copy` | `object` | see below | Copy button configuration |

Every option can also be provided as a `data-*` attribute on the host element (`data-code`, `data-language`, `data-title`, `data-subtitle`, `data-copyable`, `data-toolbar`, `data-wrap`, `data-height`). An explicit option in the constructor takes precedence over the attribute.

### `copy` object

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `iconOnly` | `boolean` | `true` | Render the copy button as an icon only |
| `label` | `string` | i18n `copy` | Idle button label |
| `labelCopied` | `string` | i18n `copied` | Label shown right after copying |
| `tooltip` | `string` | i18n `tooltip` | `title` attribute of the copy button |

The three text defaults come from the active locale (`MTS.CodeBlock` namespace). Pass an explicit value to override the localized default.

---

## API

| Method | Returns | Description |
|--------|---------|-------------|
| `setCode(code)` | `this` | Replace the source code and re-render |
| `setLanguage(language)` | `this` | Change the highlighting language |
| `setTitle(title[, subtitle])` | `this` | Update the title and, optionally, the subtitle |
| `destroy()` | `void` | Clear timers, destroy the copy instance, and empty the host |

```js
const block = new MTS.CodeBlock('#snippet', {
  code:     'const ok = true;',
  language: 'javascript'
});

block.setCode('const ok = false;');
block.setLanguage('typescript');
block.setTitle('main.ts', 'src/main.ts');
block.destroy();
```

### Static helpers

| Method | Returns | Description |
|--------|---------|-------------|
| `MTS.CodeBlock.normalizeLanguage(language)` | `string` | Resolve an alias to its canonical language name |
| `MTS.CodeBlock.highlight(code, language)` | `string` | Return the highlighted HTML for a snippet without building a block |

---

## Supported languages

`html` · `xml` · `css` · `javascript` · `typescript` · `jsx` · `tsx` · `json` · `csharp` · `java` · `sql` · `bash` · `powershell` · `yaml` · `text`

Any unrecognized language renders as escaped plain text.

**Aliases:**

| Alias | Resolves to |
|-------|-------------|
| `js` \| `mjs` \| `cjs` | `javascript` |
| `ts` | `typescript` |
| `markup` \| `svg` | `html` |
| `xaml` \| `csproj` \| `config` | `xml` |
| `scss` \| `less` | `css` |
| `yml` | `yaml` |
| `sh` \| `shell` \| `zsh` | `bash` |
| `ps1` \| `psm1` \| `pwsh` | `powershell` |
| `cs` \| `c#` | `csharp` |

---

## i18n

The component reads its copy button strings from the global i18n table under the `MTS.CodeBlock` namespace. Set the language once at startup with `MTS.setLanguage`; there is no per-instance `locale` option.

```js
MTS.setLanguage('en');
new MTS.CodeBlock('#snippet', { code: 'const ok = true;', language: 'javascript' });
```

Keys under `MTS.CodeBlock`:

| Key | es | en | pt |
|-----|----|----|----|
| `copy` | Copiar | Copy | Copiar |
| `copied` | ¡Copiado! | Copied! | Copiado! |
| `tooltip` | Copiar | Copy | Copiar |

Bundled locales: `es` (default), `en`, `pt`.

For a single instance, override the copy button strings with the `copy` option instead of relying on the active language:

```js
new MTS.CodeBlock('#snippet', {
  code: 'const ok = true;',
  language: 'javascript',
  copy: { label: 'Copy code', labelCopied: 'Copied!', tooltip: 'Copy code' }
});
```

If `base/matios-ui-i18n.js` is not loaded, the component uses its built-in Spanish defaults.

---

## Notes

- If `MTS.CopyButton` is loaded, `CodeBlock` uses it for the copy button; otherwise it falls back to a simple button using the native Clipboard API.
- The highlighting is lightweight and consistent — not a full parser for each language.

---

## Accessibility

- The copy button is a real, keyboard-focusable `<button>` control; the code renders inside `<pre><code>` preserving whitespace.
