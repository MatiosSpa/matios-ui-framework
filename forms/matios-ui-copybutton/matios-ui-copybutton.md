# matios-ui-copybutton

Botón que copia texto al portapapeles con feedback visual automático.

---

## Instalación

```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="../../forms/matios-ui-button/matios-ui-button.css">
<link rel="stylesheet" href="matios-ui-copybutton.css">
<script src="matios-ui-copybutton.js"></script>
```

---

## Uso básico

```js
// Copiar texto fijo
new MTS.CopyButton('#btn', {
  text: 'npm install matios-ui',
})

// Copiar desde un input
new MTS.CopyButton('#btn', {
  target: '#mi-input',
})

// Solo ícono
new MTS.CopyButton('#btn', {
  text:     'texto a copiar',
  iconOnly: true,
})
```

---

## Opciones

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `text` | `string` | `null` | Texto a copiar directamente |
| `target` | `string\|Element` | `null` | Selector/elemento cuyo `value` o `textContent` copiar |
| `label` | `string` | `'Copiar'` | Texto del botón |
| `labelCopied` | `string` | `'¡Copiado!'` | Texto tras copiar |
| `icon` | `string` | SVG clipboard | Ícono SVG/emoji por defecto |
| `iconCopied` | `string` | SVG check | Ícono SVG/emoji tras copiar |
| `variant` | `string` | `'secondary'` | Variante del botón |
| `size` | `string` | `''` | `'sm'` · `''` · `'lg'` |
| `iconOnly` | `boolean` | `false` | Solo ícono, sin texto |
| `resetDelay` | `number` | `2000` | ms para volver al estado inicial |
| `onCopy` | `function` | `null` | `(text) => {}` — callback tras copiar |

---

## API

```js
const btn = new MTS.CopyButton('#btn', { text: 'hola' })

btn.setText('nuevo texto')  // cambiar el texto a copiar
btn.copy()                  // copiar programáticamente
btn.destroy()               // destruir
```

---

## Patrones de uso

```html
<!-- Inline con input — copy group -->
<div class="mts-copy-group">
  <input id="api-key" class="mts-input" value="sk-1234567890abcdef" readonly>
  <button id="btn-copy"></button>
</div>

<script>
new MTS.CopyButton('#btn-copy', {
  target: '#api-key',
  iconOnly: true,
  variant: 'primary',
})
</script>

<!-- Bloque de código con botón -->
<div style="position:relative">
  <pre id="code-block">npm install matios-ui</pre>
  <button id="btn-code" style="position:absolute;top:8px;right:8px"></button>
</div>

<script>
new MTS.CopyButton('#btn-code', {
  target:   '#code-block',
  iconOnly: true,
  size:     'sm',
  variant:  'ghost',
})
</script>
```

---

## HTML declarativo

```html
<!-- Texto fijo -->
<button id="c1" data-text="npm install matios-ui" data-label="Copiar" data-variant="secondary"></button>

<!-- Desde un input -->
<input id="apiKey" value="sk-abc123" readonly>
<button id="c2" data-target="#apiKey" data-icon-only data-variant="ghost"></button>

<script>
new MTS.CopyButton('#c1', { onCopy: (t) => console.log('copiado:', t) })
new MTS.CopyButton('#c2')
</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-text` | `text` | Texto a copiar |
| `data-target` | `target` | Selector del elemento fuente |
| `data-label` | `label` | |
| `data-label-copied` | `labelCopied` | Texto tras copiar |
| `data-variant` | `variant` | |
| `data-size` | `size` | |
| `data-icon-only` | `iconOnly` | (presencia activa) |
| `data-reset-delay` | `resetDelay` | ms para resetear |

