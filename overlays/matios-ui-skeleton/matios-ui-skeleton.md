# MTS.Skeleton

[EN] Animated loading placeholder with multiple layout variants: text, circle, rect, card, list and table.
[ES] Placeholder animado de carga con múltiples variantes de layout: text, circle, rect, card, list y table.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-skeleton.css">
<script src="matios-ui-skeleton.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `variant` | `string` | `'text'` | `'text'` · `'circle'` · `'rect'` · `'card'` · `'table'` · `'list'` |
| `lines` | `number` | `3` | [EN] Text lines (variant `'text'`) / [ES] Líneas de texto |
| `rows` | `number` | `4` | [EN] Table rows (variant `'table'`) / [ES] Filas de tabla |
| `cols` | `number` | `4` | [EN] Table columns (variant `'table'`) / [ES] Columnas de tabla |
| `items` | `number` | `3` | [EN] List items (variant `'list'`) / [ES] Ítems de lista |
| `width` | `string` | `'100%'` | [EN] Container width / [ES] Ancho del contenedor |
| `height` | `string` | `null` | [EN] Container height / [ES] Alto del contenedor |
| `animation` | `string` | `'pulse'` | `'pulse'` · `'wave'` · `'none'` |

---

## JavaScript Usage / Uso JavaScript

```js
// Text lines / Líneas de texto
new MTS.Skeleton('#loading-text', {
  variant:   'text',
  lines:     4,
  animation: 'pulse',
});

// Avatar circle / Círculo de avatar
new MTS.Skeleton('#loading-avatar', {
  variant: 'circle',
  width:   '48px',
  height:  '48px',
});

// Rectangle / Rectángulo
new MTS.Skeleton('#loading-image', {
  variant: 'rect',
  width:   '100%',
  height:  '200px',
});

// Card layout / Layout de tarjeta
new MTS.Skeleton('#loading-card', {
  variant: 'card',
});

// List items / Ítems de lista
new MTS.Skeleton('#loading-list', {
  variant: 'list',
  items:   5,
});

// Table / Tabla
new MTS.Skeleton('#loading-table', {
  variant: 'table',
  rows:    5,
  cols:    4,
});

// Wave animation / Animación wave
new MTS.Skeleton('#loading-wave', {
  variant:   'text',
  lines:     3,
  animation: 'wave',
});
```

---

## HTML Usage / Uso HTML

```html
<div id="user-card"></div>

<script>
  // Show skeleton while loading / Mostrar skeleton mientras carga
  const sk = new MTS.Skeleton('#user-card', { variant: 'card' });

  fetchUser().then(data => {
    sk.destroy();
    renderUser('#user-card', data);
  });
</script>
```

---

## CSS Only / Solo CSS

```html
<!-- Single bone without JS / Hueso individual sin JS -->
<div class="mts-skeleton__bone mts-skeleton__bone--pulse"
     style="width:100%;height:16px;border-radius:4px">
</div>
```

---

## API

```js
const sk = new MTS.Skeleton('#loading', { variant: 'card' });

// Show / hide / Mostrar / ocultar
sk.show()
sk.hide()

// Destroy skeleton and clear container / Destruir skeleton y limpiar contenedor
sk.destroy()
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingüe, docs estandarizados |
| 1.0.0 | [EN] Initial release — text/circle/rect/card/list/table, pulse/wave / [ES] Versión inicial |
