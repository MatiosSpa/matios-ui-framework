# MTS.CopyButton

🇬🇧 Copy-to-clipboard button with automatic visual feedback, target element support and custom icons.
🇪🇸 Botón de copiar al portapapeles con feedback visual automático, soporte de elemento objetivo e íconos personalizados.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-button.css">
<link rel="stylesheet" href="matios-ui-copybutton.css">
<script src="matios-ui-button.js"></script>
<script src="matios-ui-copybutton.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `text` | `string` | `null` | 🇬🇧 Static text to copy / 🇪🇸 Texto estático a copiar |
| `target` | `string\|Element` | `null` | 🇬🇧 Selector/element whose `value` or `textContent` to copy / 🇪🇸 Selector/elemento cuyo `value` o `textContent` copiar |
| `label` | `string` | `'Copiar'` | 🇬🇧 Button label / 🇪🇸 Label del botón |
| `labelCopied` | `string` | `'¡Copiado!'` | 🇬🇧 Label after copying / 🇪🇸 Label tras copiar |
| `icon` | `string` | clipboard SVG | 🇬🇧 Default icon / 🇪🇸 Ícono por defecto |
| `iconCopied` | `string` | check SVG | 🇬🇧 Icon after copying / 🇪🇸 Ícono tras copiar |
| `variant` | `string` | `'secondary'` | 🇬🇧 Button variant / 🇪🇸 Variante del botón |
| `size` | `string` | `''` | `'sm'` · `''` · `'lg'` |
| `iconOnly` | `boolean` | `false` | 🇬🇧 Icon only, no label / 🇪🇸 Solo ícono, sin label |
| `resetDelay` | `number` | `2000` | 🇬🇧 ms before resetting to initial state / 🇪🇸 ms antes de resetear al estado inicial |
| `onCopy` | `function` | — | 🇬🇧 Fires after copying: `(text) => {}` / 🇪🇸 Se dispara tras copiar |

---

## Events / Eventos

🇬🇧 Use `onCopy` in the constructor. This is the recommended approach.
🇪🇸 Usa `onCopy` en el constructor. Este es el enfoque recomendado.

```js
new MTS.CopyButton('#my-btn', {
  text: 'npm install matios-ui',
  // Fires after successful copy / Se dispara tras una copia exitosa
  onCopy: (text) => {
    console.log('Copied:', text);
  },
});
```

---

## HTML Usage / Uso HTML

```html
<!-- Static text / Texto estático -->
<button id="btn-copy"
  data-text="npm install matios-ui"
  data-label="Copy"
  data-variant="secondary">
</button>
<script>
  new MTS.CopyButton('#btn-copy', {
    onCopy: (text) => console.log('copied:', text),
  });
</script>

<!-- Copy from input / Copiar desde un input -->
<div style="display:flex;gap:4px;">
  <input id="api-key" class="mts-input" value="sk-1234567890abcdef" readonly>
  <button id="btn-key" data-icon-only data-variant="ghost"></button>
</div>
<script>
  new MTS.CopyButton('#btn-key', {
    target: '#api-key',
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Copy static text / Copiar texto estático
const btn = new MTS.CopyButton('#my-btn', {
  text:        'npm install matios-ui',
  label:       'Copy',
  labelCopied: 'Copied!',
  variant:     'secondary',
  resetDelay:  2000,
  onCopy: (text) => console.log('copied:', text),
});

// Copy from another element / Copiar desde otro elemento
new MTS.CopyButton('#btn-copy', {
  target:   '#code-block',  // reads .value or .textContent
  iconOnly: true,
  size:     'sm',
  variant:  'ghost',
});
```

---

## API

```js
const btn = new MTS.CopyButton('#my-btn', { ... });

// Change text to copy at runtime / Cambiar texto a copiar en runtime
btn.setText('new text to copy')

// Trigger copy programmatically / Disparar copia programáticamente
btn.copy()

// Destroy / Destruir
btn.destroy()
```

---
