# MTS.DataTable

Datatable dinámico con soporte de paginación, ordenamiento, búsqueda, selección y plugins.
Core puro — sin dependencias externas. Usa `MTS.Table` internamente para el markup y CSS.

---

## Dependencias

```html
<link rel="stylesheet" href="../base/matios-ui-base.css">
<link rel="stylesheet" href="../data/matios-ui-table/matios-ui-table.css">
<link rel="stylesheet" href="matios-ui-datatable.css">
<script src="matios-ui-datatable.js"></script>
```

---

## Uso mínimo

```html
<div id="myTable"></div>
```

```js
new MTS.DataTable({
  elementId: 'myTable',
  columns: [
    { field: 'name',  label: 'Nombre', sortable: true },
    { field: 'email', label: 'Email' },
  ],
  dataSource: async (query) => {
    const res = await fetch('/api/users?' + new URLSearchParams(query))
    return res.json()
  },
})
```

---

## Configuración

### Elemento contenedor

| Opción | Tipo | Descripción |
|---|---|---|
| `elementId` | `string` | Id del elemento HTML donde se monta la tabla. |
| `element` | `HTMLElement` | Alternativa directa al elementId. |

### Columnas

```js
columns: [
  {
    field:         'name',       // campo del objeto de datos
    label:         'Nombre',     // encabezado visible
    sortable:      true,         // habilita ordenamiento en esta columna
    align:         'start',      // 'start' | 'center' | 'end'
    width:         '200px',      // ancho fijo (opcional)
    alwaysVisible: true,         // no se puede ocultar con ColumnVisibility
    render:        (v, row) => v // función de renderizado custom
  }
]
```

`render(value, row)` recibe el valor del campo y el objeto completo de la fila.
Si retorna una cadena con HTML, se interpola via `innerHTML`. Si no hay `render`, se usa `textContent`.

### DataSource

```js
// Función async — forma recomendada
dataSource: async (query) => {
  const res = await http.get('/api/items', { params: query })
  if (!res.success) throw new Error(res.message)
  return res.data
}

// URL directa (GET/POST)
dataSource: {
  url:     '/api/items',
  method:  'GET',         // 'GET' | 'POST'
  headers: {},
  params:  {}             // params base (se fusionan con los del query)
}
```

**Contrato de respuesta del API:**

```js
{
  data:       [],   // array de objetos
  total:      0,    // total de registros (para paginación)
  totalPages: 1     // número total de páginas
}
```

**Query que recibe el dataSource:**

```js
{
  page:    1,         // página actual
  size:    10,        // filas por página
  orderBy: 'name',    // columna de orden activa (null si no hay)
  orderDir:'asc',     // 'asc' | 'desc'
  search:  '',        // texto de búsqueda activo
  // + cualquier parámetro inyectado por plugins (FilterPlugin, etc.)
}
```

### Paginación y layout

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `pageSize` | `number` | `10` | Filas por página. |
| `rowId` | `string` | `null` | Campo que identifica unívocamente cada fila (requerido para selección). |
| `hover` | `boolean` | `true` | Resalta la fila al pasar el cursor. |
| `striped` | `boolean` | `false` | Filas alternadas con fondo diferente. |
| `bordered` | `boolean` | `false` | Bordes en todas las celdas. |
| `compact` | `boolean` | `false` | Celdas con menos padding. |
| `fixedHeader` | `boolean` | `false` | Encabezado fijo al hacer scroll vertical. |
| `fixedHeaderHeight` | `string` | `'400px'` | Altura máxima del área de scroll cuando `fixedHeader: true`. |

### Ordenamiento inicial

```js
sort: { column: 'name', direction: 'asc' }  // 'asc' | 'desc'
```

### Búsqueda

```js
search: {
  enabled:  true,     // muestra el input de búsqueda en el toolbar
  minChars: 1,        // mínimo de caracteres para disparar la búsqueda
  width:    '240px',  // ancho del input
}
```

### Selección

```js
selection: {
  mode:       'multi',  // 'none' | 'single' | 'multi'
  checkboxes: false,    // muestra columna de checkboxes (solo mode: 'multi')
}
```

| `mode` | Comportamiento |
|---|---|
| `'none'` | Sin selección. Default. |
| `'single'` | Solo una fila a la vez. Clic en otra deselecciona la anterior. |
| `'multi'` | Selección múltiple por clic. Con `checkboxes: true` agrega columna de checks y "seleccionar todo". |

> Para deshabilitar la selección: `selection: { mode: 'none' }`.

### Paginación — opciones de página

```js
pagination: {
  pageSizeOptions: [5, 10, 25, 50, 100]  // opciones del selector de filas por página
}
```

> **Importante:** `pageSize` debe estar incluido en `pageSizeOptions`. Si no coincide, el selector no puede pre-seleccionar el valor inicial y muestra el placeholder vacío.
>
> ```js
> // ✗ MAL — 12 no está en la lista, el selector queda vacío
> pageSize: 12,
> pagination: { pageSizeOptions: [5, 10, 25, 50, 100] }
>
> // ✓ BIEN — 12 está en la lista, se pre-selecciona al arrancar
> pageSize: 12,
> pagination: { pageSizeOptions: [12, 25, 50, 100] }
> ```

### Columna de acciones

```js
actionColumn:      true,      // inyecta columna de acciones al final
actionColumnLabel: '',        // label del encabezado (vacío por defecto)
actionColumnWidth: '120px',   // ancho de la columna
```

La columna de acciones la inyecta y controla `MTS.DocumentManagerContextMenuPlugin` cuando `actionColumn: true`.

### Fila con clase dinámica

```js
rowClass: (row) => row.status === 'inactive' ? 'mts-row--muted' : null
```

### Estado persistente

```js
persist: {
  enabled: true,
  key:     'mi-tabla',   // clave en localStorage; auto-generada desde elementId si se omite
}
```

Persiste: página actual, orden, búsqueda y tamaño de página.

### Internacionalización

```js
locale: 'es',   // 'es' | 'en' — requiere matios-ui-datatable-i18n.js

// Override manual de textos (se fusionan sobre el locale activo)
texts: {
  search:   'Buscar...',
  noData:   'Sin resultados',
  loading:  'Cargando...',
  error:    'Error al cargar datos.',
  retry:    'Reintentar',
  showing:  'Mostrando {start}–{end} de {total}',
  perPage:  'Filas:',
  previous: 'Anterior',
  next:     'Siguiente',
}
```

---

## Eventos / Callbacks

```js
new MTS.DataTable({
  // ...

  onSelectionChange: (items) => {
    // Se dispara cada vez que cambia la selección.
    // Recibe directamente el array de objetos seleccionados.
    console.log(items)
  },

  onReady: (table) => {
    // Se dispara una vez, tras el primer render completo
  },

  onLoad: (result, table) => {
    // Se dispara tras cada carga de datos exitosa
  },

  onError: (err, table) => {
    // Se dispara cuando dataSource lanza un error
  },
})
```

---

## API pública

### Carga y navegación

| Método | Descripción |
|---|---|
| `table.load()` | Carga la primera página. |
| `table.reload()` | Recarga la página actual manteniendo el estado. |
| `table.goToPage(n)` | Navega a la página `n`. |
| `table.setSearch(text)` | Establece el texto de búsqueda y recarga. |
| `table.setParams(params)` | Fusiona parámetros extra al query y recarga. |
| `table.clearParams(...keys)` | Elimina parámetros por clave y recarga. |
| `table.redraw()` | Re-renderiza la tabla con los últimos datos sin hacer un nuevo request. |

### Selección

| Método | Descripción |
|---|---|
| `table.getSelection()` | Devuelve un array con los objetos de las filas seleccionadas. |
| `table.clearSelection()` | Deselecciona todas las filas. |
| `table.selectRow(id)` | Selecciona la fila con el id dado. |
| `table.deselectRow(id)` | Deselecciona la fila con el id dado. |

### Plugins

| Método | Descripción |
|---|---|
| `table.use(plugin)` | Instala un plugin en tiempo de ejecución. |
| `table.remove(name)` | Desinstala el plugin con ese `descriptor.name`. |
| `table.getPlugin(name)` | Devuelve la instancia del plugin o `null` si no está instalado. |

### Hooks

Alternativa limpia al monkey-patching de callbacks. Permiten que múltiples plugins suscriban al mismo evento.

| Método | Descripción |
|---|---|
| `table.registerHook(name, fn)` | Registra `fn` como listener del evento `name`. |
| `table.unregisterHook(name, fn)` | Elimina `fn` del evento `name`. |

```js
// Ejemplo — DocumentManagerPlugin usa esto internamente
const onReady = () => { /* inicializar algo */ }
table.registerHook('onReady', onReady)

// Al desinstalar:
table.unregisterHook('onReady', onReady)
```

### Ciclo de vida

| Método | Descripción |
|---|---|
| `table.destroy()` | Desmonta la tabla, desinstala todos los plugins y limpia el DOM. |

---

## Contrato de Plugin

| Requisito | Descripción |
|---|---|
| `static descriptor.name` | Identificador único (ej: `'MTS.DataTableToolbarPlugin'`). |
| `static descriptor.version` | Versión semver. |
| `static descriptor.provides` | Capacidad que expone (evita conflictos). |
| `install(table)` | Llamado al montar. Recibe la instancia del DataTable. |
| `uninstall()` | Llamado al desmontar. Debe limpiar DOM, listeners y referencias. |

---

## Plugins disponibles

| Plugin | Archivo | Descripción |
|---|---|---|
| `MTS.DataTableToolbarPlugin` | `plugins/toolbar/` | Barra de botones reactivos al estado de la tabla. |
| `MTS.DataTableFilterPlugin` | `plugins/filter/` | Chips de filtros (select estático o async). |
| `MTS.DataTableColumnVisibilityPlugin` | `plugins/columnvisibility/` | Panel para ocultar/mostrar columnas. |
| `MTS.DataTableExpandRowPlugin` | `plugins/expandrow/` | Fila expandible con detalle custom. |
| `MTS.DocumentManagerPlugin` | `plugins/documentmanager/` | Gestor de documentos con breadcrumb y drag & drop. |

---
