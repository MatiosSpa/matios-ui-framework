# MTS.Table

[EN] CSS-only table component — no JavaScript required. Provides styled classes for all table states, variants and layouts.
[ES] Componente de tabla solo CSS — sin JavaScript. Clases estilizadas para todos los estados, variantes y layouts de tabla.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-table.css">
```

---

## Base Structure / Estructura base

```html
<div class="mts-table-wrap">
  <table class="mts-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Ana García</td>
        <td>ana@example.com</td>
        <td><span class="mts-badge mts-badge--success">Active</span></td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Variants / Variantes

```html
<!-- Striped rows / Filas rayadas -->
<table class="mts-table mts-table--striped">...</table>

<!-- Hover effect / Efecto hover -->
<table class="mts-table mts-table--hover">...</table>

<!-- Bordered / Con bordes -->
<table class="mts-table mts-table--bordered">...</table>

<!-- Compact / Compacto -->
<table class="mts-table mts-table--sm">...</table>

<!-- Combined / Combinado -->
<table class="mts-table mts-table--striped mts-table--hover mts-table--sm">...</table>
```

---

## Sortable Headers / Cabeceras ordenables

```html
<thead>
  <tr>
    <th class="mts-table__th--sort mts-table__th--asc">Name ↑</th>
    <th class="mts-table__th--sort">Email</th>
    <th class="mts-table__th--sort mts-table__th--desc">Date ↓</th>
  </tr>
</thead>
```

---

## Row States / Estados de fila

```html
<tr class="mts-table__tr--selected">...</tr>  <!-- selected / seleccionado -->
<tr class="mts-table__tr--success">...</tr>   <!-- success / éxito -->
<tr class="mts-table__tr--warning">...</tr>   <!-- warning / advertencia -->
<tr class="mts-table__tr--danger">...</tr>    <!-- danger / error -->
<tr class="mts-table__tr--muted">...</tr>     <!-- muted / opaco -->
```

---

## Column Alignment / Alineación de columna

```html
<th class="mts-table__th--right">Amount</th>
<td class="mts-table__td--right">$1,250.00</td>

<th class="mts-table__th--center">Status</th>
<td class="mts-table__td--center"><span class="mts-badge">...</span></td>
```

---

## Actions Column / Columna de acciones

```html
<th class="mts-table__th--actions">Actions</th>
<td class="mts-table__td--actions">
  <button class="mts-btn mts-btn--ghost mts-btn--sm mts-btn--icon">✏️</button>
  <button class="mts-btn mts-btn--ghost mts-btn--sm mts-btn--icon mts-btn--danger">🗑️</button>
</td>
```

---

## Checkbox Column / Columna checkbox

```html
<th class="mts-table__th--check">
  <input type="checkbox" class="mts-checkbox">
</th>
<td class="mts-table__td--check">
  <input type="checkbox" class="mts-checkbox">
</td>
```

---

## Empty State / Estado vacío

```html
<tbody>
  <tr>
    <td colspan="5" class="mts-table__empty">
      <div class="mts-table__empty-icon">📭</div>
      <div class="mts-table__empty-text">No records found</div>
    </td>
  </tr>
</tbody>
```

---

## Truncated Text / Texto truncado

```html
<td class="mts-table__td--truncate" style="max-width:200px" title="Full text here">
  Very long text that gets truncated...
</td>
```

---

## Footer / Pie de tabla

```html
<tfoot>
  <tr class="mts-table__tr--total">
    <td colspan="3">Total</td>
    <td class="mts-table__td--right">$12,450.00</td>
  </tr>
</tfoot>
```

---

## CSS Class Reference / Referencia de clases CSS

### Wrapper
| Class | [EN] Description / [ES] Descripción |
|-------|--------------------------------------|
| `.mts-table-wrap` | [EN] Scrollable wrapper / [ES] Contenedor con scroll |

### Table
| Class | [EN] Description / [ES] Descripción |
|-------|--------------------------------------|
| `.mts-table` | [EN] Base table / [ES] Tabla base |
| `.mts-table--striped` | [EN] Alternate row colors / [ES] Filas alternadas |
| `.mts-table--hover` | [EN] Row hover highlight / [ES] Highlight al hover |
| `.mts-table--bordered` | [EN] Cell borders / [ES] Bordes en celdas |
| `.mts-table--sm` | [EN] Compact padding / [ES] Padding compacto |

### Headers / Cabeceras
| Class | [EN] Description / [ES] Descripción |
|-------|--------------------------------------|
| `.mts-table__th--sort` | [EN] Sortable indicator / [ES] Indicador ordenable |
| `.mts-table__th--asc` | [EN] Ascending sort / [ES] Orden ascendente |
| `.mts-table__th--desc` | [EN] Descending sort / [ES] Orden descendente |
| `.mts-table__th--right` | [EN] Right align / [ES] Alineación derecha |
| `.mts-table__th--center` | [EN] Center align / [ES] Alineación central |
| `.mts-table__th--check` | [EN] Checkbox column / [ES] Columna checkbox |
| `.mts-table__th--actions` | [EN] Actions column / [ES] Columna de acciones |

### Rows / Filas
| Class | [EN] Description / [ES] Descripción |
|-------|--------------------------------------|
| `.mts-table__tr--selected` | [EN] Selected state / [ES] Estado seleccionado |
| `.mts-table__tr--success` | [EN] Success highlight / [ES] Highlight éxito |
| `.mts-table__tr--warning` | [EN] Warning highlight / [ES] Highlight advertencia |
| `.mts-table__tr--danger` | [EN] Danger highlight / [ES] Highlight error |
| `.mts-table__tr--muted` | [EN] Muted / disabled / [ES] Opaco / deshabilitado |
| `.mts-table__tr--total` | [EN] Footer total row / [ES] Fila de total en footer |

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual docs, standardized structure / [ES] Docs bilingüe, estructura estandarizada |
| 1.0.0 | [EN] Initial release / [ES] Versión inicial |
