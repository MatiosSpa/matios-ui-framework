# matios-ui-table

Estilos de tabla HTML pura. Sin JS. Sin dependencias externas.
El `MTS.DataTable` usa estas clases internamente — no las duplica.

---

## Instalación
```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-table.css">
```

---

## Estructura base
```html
<div class="mts-table-wrap">
  <table class="mts-table">
    <thead>
      <tr>
        <th class="mts-table__th">Nombre</th>
        <th class="mts-table__th mts-table__th--end">Tamaño</th>
        <th class="mts-table__th mts-table__th--end">Fecha</th>
      </tr>
    </thead>
    <tbody>
      <tr class="mts-table__row">
        <td class="mts-table__td">Documento.pdf</td>
        <td class="mts-table__td mts-table__td--end">2.4 MB</td>
        <td class="mts-table__td mts-table__td--end">12/03/2025</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Modificadores de tabla

| Clase | Descripción |
|-------|-------------|
| `mts-table--hover` | Resalta la fila al pasar el mouse |
| `mts-table--striped` | Filas alternas (zebra) |
| `mts-table--bordered` | Borde en todas las celdas |
| `mts-table--compact` | Padding reducido |
| `mts-table--fixed` | Header sticky (requiere `.mts-table-wrap` con altura fija) |
| `mts-table--flush` | Sin padding en primera/última columna |
| `mts-table--responsive` | Colapso en móvil con `data-label` |

```html
<!-- Hover + zebra -->
<table class="mts-table mts-table--hover mts-table--striped">

<!-- Compacta con bordes -->
<table class="mts-table mts-table--compact mts-table--bordered">

<!-- Header fijo -->
<div class="mts-table-wrap" style="max-height:400px;">
  <table class="mts-table mts-table--fixed mts-table--hover">
```

---

## Columnas ordenables

```html
<th class="mts-table__th mts-table__th--sortable mts-table__th--asc">
  Nombre
  <span class="mts-table__sort">
    <i class="mts-table__sort-up"></i>
    <i class="mts-table__sort-down"></i>
  </span>
</th>
```

| Clase | Descripción |
|-------|-------------|
| `mts-table__th--sortable` | Cursor pointer |
| `mts-table__th--asc` | Flecha arriba activa |
| `mts-table__th--desc` | Flecha abajo activa |

```js
// Toggle sort al click
th.addEventListener('click', () => {
  th.classList.toggle('mts-table__th--asc')
  th.classList.toggle('mts-table__th--desc')
})
```

---

## Alineación

```html
<th class="mts-table__th mts-table__th--center">Centro</th>
<th class="mts-table__th mts-table__th--end">Derecha</th>
<td class="mts-table__td mts-table__td--center">Centro</td>
<td class="mts-table__td mts-table__td--end">Derecha</td>
```

---

## Filas de estado

```html
<tr class="mts-table__row mts-table__row--success">...</tr>
<tr class="mts-table__row mts-table__row--warning">...</tr>
<tr class="mts-table__row mts-table__row--danger">...</tr>
<tr class="mts-table__row mts-table__row--info">...</tr>
<tr class="mts-table__row mts-table__row--selected">...</tr>
<tr class="mts-table__row mts-table__row--clickable" onclick="...">...</tr>
```

---

## Checkbox

```html
<th class="mts-table__th mts-table__th--check">
  <input type="checkbox" class="mts-table__checkbox">
</th>
<td class="mts-table__td mts-table__td--check">
  <input type="checkbox" class="mts-table__checkbox" value="1">
</td>
```

---

## Columna de acciones

```html
<td class="mts-table__td mts-table__td--actions">
  <button class="mts-btn mts-btn--ghost mts-btn--xs">Ver</button>
  <button class="mts-btn mts-btn--ghost mts-btn--xs">Editar</button>
</td>
```

---

## Texto largo con truncado

```html
<td class="mts-table__td mts-table__td--truncate">
  Texto muy largo que se corta con ellipsis...
</td>
```

---

## Estado vacío

```html
<tr class="mts-table__row">
  <td class="mts-table__td mts-table__empty" colspan="4">
    <span class="mts-table__empty-icon">📂</span>
    <p class="mts-table__empty-title">Sin registros</p>
    <p class="mts-table__empty-msg">No hay datos para mostrar</p>
  </td>
</tr>
```

---

## Footer con totales

```html
<tfoot class="mts-table__tfoot">
  <tr>
    <td class="mts-table__td">Total</td>
    <td class="mts-table__td mts-table__td--end">24.8 MB</td>
  </tr>
</tfoot>
```

---

## Responsive (móvil)

```html
<table class="mts-table mts-table--responsive">
  ...
  <tbody>
    <tr class="mts-table__row">
      <td class="mts-table__td" data-label="Nombre">Documento.pdf</td>
      <td class="mts-table__td" data-label="Tamaño">2.4 MB</td>
      <td class="mts-table__td" data-label="Fecha">12/03/2025</td>
    </tr>
  </tbody>
</table>
```

---

## Referencia de clases

### Wrapper
| Clase | Descripción |
|-------|-------------|
| `.mts-table-wrap` | Scroll + border-radius |

### Tabla
| Clase | Descripción |
|-------|-------------|
| `.mts-table` | Base |
| `.mts-table--hover` | Hover en filas |
| `.mts-table--striped` | Zebra |
| `.mts-table--bordered` | Bordes en todas las celdas |
| `.mts-table--compact` | Padding reducido |
| `.mts-table--fixed` | Header sticky |
| `.mts-table--flush` | Sin padding lateral extremo |
| `.mts-table--responsive` | Colapso en móvil |

### Encabezados (th)
| Clase | Descripción |
|-------|-------------|
| `.mts-table__th` | Base |
| `.mts-table__th--sortable` | Cursor + hover |
| `.mts-table__th--asc` | Sort ascendente activo |
| `.mts-table__th--desc` | Sort descendente activo |
| `.mts-table__th--center` | Centrado |
| `.mts-table__th--end` | Derecha |
| `.mts-table__th--check` | Columna checkbox |

### Filas (tr)
| Clase | Descripción |
|-------|-------------|
| `.mts-table__row` | Base |
| `.mts-table__row--clickable` | Cursor pointer |
| `.mts-table__row--selected` | Seleccionada |
| `.mts-table__row--success` | Verde |
| `.mts-table__row--warning` | Amarillo |
| `.mts-table__row--danger` | Rojo |
| `.mts-table__row--info` | Azul |
| `.mts-table__row--dragging` | Estado drag |
| `.mts-table__row--drag-over` | Target del drop |

### Celdas (td)
| Clase | Descripción |
|-------|-------------|
| `.mts-table__td` | Base |
| `.mts-table__td--center` | Centrado |
| `.mts-table__td--end` | Derecha |
| `.mts-table__td--check` | Checkbox |
| `.mts-table__td--truncate` | Ellipsis |
| `.mts-table__td--actions` | Acciones (derecha, nowrap) |

---

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — estilos puros sin JS |
