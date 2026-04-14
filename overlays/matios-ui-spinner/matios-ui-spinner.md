# MTS.Spinner

[EN] Animated loading indicator with five variants, five sizes, custom colors, label text and full-screen overlay mode.
[ES] Indicador de carga animado con cinco variantes, cinco tamaños, colores personalizados, texto de label y modo overlay pantalla completa.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-spinner.css">
<script src="matios-ui-spinner.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `variant` | `string` | `'circle'` | `'circle'` · `'dots'` · `'bars'` · `'pulse'` · `'ring'` |
| `size` | `string` | `'md'` | `'xs'` · `'sm'` · `'md'` · `'lg'` · `'xl'` |
| `color` | `string` | `null` | [EN] Custom CSS color / [ES] Color CSS personalizado |
| `label` | `string` | `''` | [EN] Text below the spinner / [ES] Texto debajo del spinner |
| `overlay` | `boolean` | `false` | [EN] Full-screen overlay mode / [ES] Modo overlay pantalla completa |

---

## JavaScript Usage / Uso JavaScript

```js
// Basic circle / Círculo básico
new MTS.Spinner('#loading', {
  variant: 'circle',
  size:    'md',
});

// Dots variant / Variante de puntos
new MTS.Spinner('#loading-dots', {
  variant: 'dots',
  size:    'lg',
});

// With label / Con label
new MTS.Spinner('#loading-label', {
  variant: 'circle',
  size:    'lg',
  label:   'Loading data...',
});

// Custom color / Color personalizado
new MTS.Spinner('#loading-custom', {
  variant: 'ring',
  size:    'md',
  color:   '#7c3aed',
});

// Full-screen overlay / Overlay pantalla completa
const overlay = new MTS.Spinner('#loading-overlay', {
  variant: 'circle',
  size:    'xl',
  overlay: true,
  label:   'Processing...',
});
overlay.show();
// Later / Luego:
overlay.hide();
```

---

## HTML Declarative / HTML Declarativo

```html
<div id="my-spinner"
  data-variant="dots"
  data-size="lg"
  data-label="Loading...">
</div>

<script>
  new MTS.Spinner('#my-spinner');
</script>
```

| Attribute / Atributo | JS Option |
|----------------------|-----------|
| `data-variant` | `variant` |
| `data-size` | `size` |
| `data-label` | `label` |
| `data-color` | `color` |
| `data-overlay` | `overlay` |

---

## CSS Only / Solo CSS

```html
<!-- Circle spinner without JS / Sin JS -->
<div class="mts-spinner mts-spinner--md">
  <div class="mts-spinner__inner mts-spinner__inner--circle"></div>
</div>
```

---

## API

```js
const spinner = new MTS.Spinner('#my-spinner', { ... });

// Show / hide / Mostrar / ocultar
spinner.show()
spinner.hide()

// Destroy / Destruir
spinner.destroy()
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingüe, docs estandarizados |
| 1.0.0 | [EN] Initial release — circle/dots/bars/pulse/ring, overlay / [ES] Versión inicial |
