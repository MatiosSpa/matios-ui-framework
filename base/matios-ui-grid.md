# matios-ui-grid

Sistema de grid CSS nativo — 12 columnas, responsive, sin JS, sin compilar.

---

## Instalación

```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="../../base/matios-ui-grid.css">
```

---

## Uso básico

```html
<!-- Grid de 12 columnas — default -->
<div class="mts-grid">
  <div class="mts-g-col-6">Mitad izquierda</div>
  <div class="mts-g-col-6">Mitad derecha</div>
</div>

<!-- 3 columnas iguales -->
<div class="mts-grid">
  <div class="mts-g-col-4">Col 1</div>
  <div class="mts-g-col-4">Col 2</div>
  <div class="mts-g-col-4">Col 3</div>
</div>

<!-- Columnas desiguales -->
<div class="mts-grid">
  <div class="mts-g-col-8">Contenido principal</div>
  <div class="mts-g-col-4">Sidebar</div>
</div>
```

---

## CSS Variables de control

Aplicadas directamente en el contenedor `.mts-grid`:

| Variable | Default | Descripción |
|----------|---------|-------------|
| `--mts-columns` | `12` | Número de columnas |
| `--mts-rows` | `1` | Número de filas |
| `--mts-gap` | `1rem` | Gap horizontal y vertical |
| `--mts-col-gap` | — | Gap solo horizontal |
| `--mts-row-gap` | — | Gap solo vertical |

```html
<!-- Grid de 3 columnas con gap grande -->
<div class="mts-grid" style="--mts-columns:3; --mts-gap:2rem">
  ...
</div>
```

---

## Clases de columna

`.mts-g-col-{1..12}` — ocupa N columnas del grid.

| Clase | Columnas |
|-------|----------|
| `.mts-g-col-1` | 1/12 |
| `.mts-g-col-2` | 2/12 |
| `.mts-g-col-3` | 3/12 (25%) |
| `.mts-g-col-4` | 4/12 (33%) |
| `.mts-g-col-6` | 6/12 (50%) |
| `.mts-g-col-8` | 8/12 (66%) |
| `.mts-g-col-12` | 12/12 (100%) |

---

## Responsive

Prefijos por breakpoint: `sm` (576px), `md` (768px), `lg` (992px), `xl` (1200px).

```html
<!-- Full en mobile, mitad en md, tercio en lg -->
<div class="mts-grid">
  <div class="mts-g-col-12 mts-g-col-md-6 mts-g-col-lg-4">...</div>
  <div class="mts-g-col-12 mts-g-col-md-6 mts-g-col-lg-4">...</div>
  <div class="mts-g-col-12 mts-g-col-md-12 mts-g-col-lg-4">...</div>
</div>
```

---

## Modificadores de gap

| Clase | Gap |
|-------|-----|
| `.mts-grid--no-gap` | 0 |
| `.mts-grid--gap-xs` | 4px |
| `.mts-grid--gap-sm` | 8px |
| `.mts-grid--gap-md` | 16px |
| `.mts-grid--gap-lg` | 24px |
| `.mts-grid--gap-xl` | 32px |

---

## Alineación

```html
<div class="mts-grid mts-grid--center">...</div>   <!-- align-items: center -->
<div class="mts-grid mts-grid--start">...</div>    <!-- align-items: start -->
<div class="mts-grid mts-grid--end">...</div>      <!-- align-items: end -->
```

---

## Start column

```html
<!-- Empieza en la columna 3 y ocupa 4 -->
<div class="mts-g-col-4 mts-g-start-3">...</div>
```
