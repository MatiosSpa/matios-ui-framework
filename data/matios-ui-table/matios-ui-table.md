# MTS.Table

🇬🇧 CSS-only table component — no JavaScript required. Provides styled classes for all table states, variants and layouts.
🇪🇸 Componente de tabla solo CSS — sin JavaScript. Clases estilizadas para todos los estados, variantes y layouts de tabla.

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
        <th class="mts-table__th">Name</th>
        <th class="mts-table__th">Email</th>
        <th class="mts-table__th mts-table__th--center">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr class="mts-table__row">
        <td class="mts-table__td">Ana García</td>
        <td class="mts-table__td">ana@example.com</td>
        <td class="mts-table__td mts-table__td--center">
          <span class="mts-badge mts-badge--success">Active</span>
        </td>
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
<table class="mts-table mts-table--compact">...</table>

<!-- Flush — inside a card/surface / Dentro de un card o surface -->
<table class="mts-table mts-table--flush">...</table>

<!-- Combined / Combinado -->
<table class="mts-table mts-table--striped mts-table--hover mts-table--compact">...</table>
```

---

## Sortable Headers / Cabeceras ordenables

```html
<thead>
  <tr>
    <th class="mts-table__th mts-table__th--sortable mts-table__th--asc">
      Name
      <span class="mts-table__sort">
        <span class="mts-table__sort-up"></span>
        <span class="mts-table__sort-down"></span>
      </span>
    </th>
    <th class="mts-table__th mts-table__th--sortable">
      Email
      <span class="mts-table__sort">
        <span class="mts-table__sort-up"></span>
        <span class="mts-table__sort-down"></span>
      </span>
    </th>
    <th class="mts-table__th mts-table__th--sortable mts-table__th--desc">
      Date
      <span class="mts-table__sort">
        <span class="mts-table__sort-up"></span>
        <span class="mts-table__sort-down"></span>
      </span>
    </th>
  </tr>
</thead>
```

---

## Fixed Header / Cabecera fija

🇬🇧 Add `.mts-table--fixed` to the table and `max-height + overflow-y: auto` to the wrapper.
🇪🇸 Agrega `.mts-table--fixed` a la tabla y `max-height + overflow-y: auto` al wrapper.

```html
<div class="mts-table-wrap" style="max-height: 300px; overflow-y: auto;">
  <table class="mts-table mts-table--hover mts-table--fixed">
    ...
  </table>
</div>
```

---

## Row States / Estados de fila

```html
<tr class="mts-table__row mts-table__row--selected">...</tr>  <!-- selected / seleccionado -->
<tr class="mts-table__row mts-table__row--success">...</tr>   <!-- success / éxito -->
<tr class="mts-table__row mts-table__row--warning">...</tr>   <!-- warning / advertencia -->
<tr class="mts-table__row mts-table__row--danger">...</tr>    <!-- danger / error -->
<tr class="mts-table__row mts-table__row--info">...</tr>      <!-- info -->
<tr class="mts-table__row mts-table__row--muted">...</tr>     <!-- muted / opaco -->
<tr class="mts-table__row mts-table__row--clickable">...</tr> <!-- pointer cursor / cursor pointer -->
```

---

## Column Alignment / Alineación de columna

```html
<th class="mts-table__th mts-table__th--end">Amount</th>
<td class="mts-table__td mts-table__td--end">$1,250.00</td>

<th class="mts-table__th mts-table__th--center">Status</th>
<td class="mts-table__td mts-table__td--center"><span class="mts-badge">...</span></td>
```

---

## Actions Column / Columna de acciones

```html
<th class="mts-table__th mts-table__th--actions">Actions</th>
<td class="mts-table__td mts-table__td--actions">
  <button class="mts-btn mts-btn--ghost mts-btn--sm mts-btn--icon">✏️</button>
  <button class="mts-btn mts-btn--ghost mts-btn--sm mts-btn--icon">🗑️</button>
</td>
```

---

## Checkbox Column / Columna checkbox

```html
<th class="mts-table__th mts-table__th--check">
  <input type="checkbox" class="mts-table__checkbox" id="chk-all">
</th>
<td class="mts-table__td mts-table__td--check">
  <input type="checkbox" class="mts-table__checkbox">
</td>
```

---

## Empty State / Estado vacío

```html
<tbody>
  <tr>
    <td colspan="5" class="mts-table__empty">
      <i class="mts-icon mts-icon-inbox mts-icon--xl mts-table__empty-icon"></i>
      <div class="mts-table__empty-title">No records found</div>
      <div class="mts-table__empty-msg">Try adjusting your filters.</div>
    </td>
  </tr>
</tbody>
```

---

## Truncated Text / Texto truncado

```html
<td class="mts-table__td mts-table__td--truncate" style="max-width:200px" title="Full text here">
  Very long text that gets truncated...
</td>
```

---

## Footer / Pie de tabla

```html
<tfoot>
  <tr class="mts-table__tfoot">
    <td class="mts-table__td" colspan="3">Total</td>
    <td class="mts-table__td mts-table__td--end">$12,450.00</td>
  </tr>
</tfoot>
```

---

## Responsive

🇬🇧 Add `.mts-table--responsive` to the table. Add `data-label` to each `td` with the column name — used as the label in mobile view.
🇪🇸 Agrega `.mts-table--responsive` a la tabla. Agrega `data-label` a cada `td` con el nombre de la columna — se usa como etiqueta en vista móvil.

```html
<table class="mts-table mts-table--responsive">
  <thead>...</thead>
  <tbody>
    <tr class="mts-table__row">
      <td class="mts-table__td" data-label="Name">Ana García</td>
      <td class="mts-table__td" data-label="Email">ana@example.com</td>
      <td class="mts-table__td" data-label="Status">Active</td>
    </tr>
  </tbody>
</table>
```

---

## CSS Class Reference / Referencia de clases CSS

### Wrapper
| Class | 🇬🇧 Description / 🇪🇸 Descripción |
|-------|--------------------------------------|
| `.mts-table-wrap` | 🇬🇧 Scrollable wrapper / 🇪🇸 Contenedor con scroll |

### Table
| Class | 🇬🇧 Description / 🇪🇸 Descripción |
|-------|--------------------------------------|
| `.mts-table` | 🇬🇧 Base table / 🇪🇸 Tabla base |
| `.mts-table--striped` | 🇬🇧 Alternate row colors / 🇪🇸 Filas alternadas |
| `.mts-table--hover` | 🇬🇧 Row hover highlight / 🇪🇸 Highlight al hover |
| `.mts-table--bordered` | 🇬🇧 Cell borders / 🇪🇸 Bordes en celdas |
| `.mts-table--compact` | 🇬🇧 Compact padding / 🇪🇸 Padding compacto |
| `.mts-table--flush` | 🇬🇧 Removes outer padding (use inside cards) / 🇪🇸 Elimina padding externo (usar dentro de cards) |
| `.mts-table--fixed` | 🇬🇧 Sticky header (requires `max-height` on wrapper) / 🇪🇸 Cabecera fija (requiere `max-height` en wrapper) |
| `.mts-table--responsive` | 🇬🇧 Stacks rows on mobile using `data-label` / 🇪🇸 Apila filas en móvil usando `data-label` |

### Headers / Cabeceras
| Class | 🇬🇧 Description / 🇪🇸 Descripción |
|-------|--------------------------------------|
| `.mts-table__th` | 🇬🇧 Header cell / 🇪🇸 Celda de cabecera |
| `.mts-table__th--sortable` | 🇬🇧 Sortable column (adds cursor + hover) / 🇪🇸 Columna ordenable (agrega cursor + hover) |
| `.mts-table__th--asc` | 🇬🇧 Ascending sort active / 🇪🇸 Orden ascendente activo |
| `.mts-table__th--desc` | 🇬🇧 Descending sort active / 🇪🇸 Orden descendente activo |
| `.mts-table__th--end` | 🇬🇧 Right align / 🇪🇸 Alineación derecha |
| `.mts-table__th--center` | 🇬🇧 Center align / 🇪🇸 Alineación central |
| `.mts-table__th--check` | 🇬🇧 Checkbox column (fixed width) / 🇪🇸 Columna checkbox (ancho fijo) |
| `.mts-table__th--actions` | 🇬🇧 Actions column / 🇪🇸 Columna de acciones |
| `.mts-table__sort` | 🇬🇧 Sort icon container / 🇪🇸 Contenedor del ícono de orden |
| `.mts-table__sort-up` | 🇬🇧 Up arrow (CSS triangle) / 🇪🇸 Flecha arriba (triángulo CSS) |
| `.mts-table__sort-down` | 🇬🇧 Down arrow (CSS triangle) / 🇪🇸 Flecha abajo (triángulo CSS) |

### Rows / Filas
| Class | 🇬🇧 Description / 🇪🇸 Descripción |
|-------|--------------------------------------|
| `.mts-table__row` | 🇬🇧 Table row / 🇪🇸 Fila de tabla |
| `.mts-table__row--selected` | 🇬🇧 Selected state / 🇪🇸 Estado seleccionado |
| `.mts-table__row--success` | 🇬🇧 Success highlight / 🇪🇸 Highlight éxito |
| `.mts-table__row--warning` | 🇬🇧 Warning highlight / 🇪🇸 Highlight advertencia |
| `.mts-table__row--danger` | 🇬🇧 Danger highlight / 🇪🇸 Highlight error |
| `.mts-table__row--info` | 🇬🇧 Info highlight / 🇪🇸 Highlight info |
| `.mts-table__row--muted` | 🇬🇧 Muted / disabled appearance / 🇪🇸 Apariencia opaca / deshabilitada |
| `.mts-table__row--clickable` | 🇬🇧 Pointer cursor on hover / 🇪🇸 Cursor pointer al hover |
| `.mts-table__row--dragging` | 🇬🇧 Row being dragged / 🇪🇸 Fila siendo arrastrada |
| `.mts-table__row--drag-over` | 🇬🇧 Drop target indicator / 🇪🇸 Indicador de destino del drag |

### Cells / Celdas
| Class | 🇬🇧 Description / 🇪🇸 Descripción |
|-------|--------------------------------------|
| `.mts-table__td` | 🇬🇧 Table cell / 🇪🇸 Celda de tabla |
| `.mts-table__td--end` | 🇬🇧 Right align / 🇪🇸 Alineación derecha |
| `.mts-table__td--center` | 🇬🇧 Center align / 🇪🇸 Alineación central |
| `.mts-table__td--check` | 🇬🇧 Checkbox column (fixed width) / 🇪🇸 Columna checkbox (ancho fijo) |
| `.mts-table__td--actions` | 🇬🇧 Actions column (right-aligned, no-wrap) / 🇪🇸 Columna de acciones (derecha, sin wrap) |
| `.mts-table__td--truncate` | 🇬🇧 Truncates overflow with ellipsis (requires `max-width`) / 🇪🇸 Trunca el desborde con ellipsis (requiere `max-width`) |

### Footer / Pie
| Class | 🇬🇧 Description / 🇪🇸 Descripción |
|-------|--------------------------------------|
| `.mts-table__tfoot` | 🇬🇧 Footer row (bold, top border) / 🇪🇸 Fila de pie (negrita, borde superior) |

### Empty State / Estado vacío
| Class | 🇬🇧 Description / 🇪🇸 Descripción |
|-------|--------------------------------------|
| `.mts-table__empty` | 🇬🇧 Empty state cell (centered, padded) / 🇪🇸 Celda de estado vacío (centrada, con padding) |
| `.mts-table__empty-icon` | 🇬🇧 Icon above empty message / 🇪🇸 Ícono sobre el mensaje vacío |
| `.mts-table__empty-title` | 🇬🇧 Primary empty message / 🇪🇸 Mensaje principal vacío |
| `.mts-table__empty-msg` | 🇬🇧 Secondary empty message / 🇪🇸 Mensaje secundario vacío |

### Checkbox
| Class | 🇬🇧 Description / 🇪🇸 Descripción |
|-------|--------------------------------------|
| `.mts-table__checkbox` | 🇬🇧 Styled checkbox (accent-color primary) / 🇪🇸 Checkbox estilizado (accent-color primary) |

---
