# MTS.TransferList

Componente de asignacion entre dos listas.

Sirve para patrones tipo:
- `Transfer List`
- `Dual Listbox`
- `Pick List`
- `Shuttle`

Ideal para casos como:
- asignar perfiles a un rol
- mover elementos entre origen y seleccionados
- bloquear duplicados por una llave de validacion

---

## Instalacion

```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-transferlist.css">
<script src="matios-ui-transferlist.js"></script>
```

---

## Uso basico

```js
new MTS.TransferList('#my-transfer', {
  label: 'Perfiles',
  originTitle: 'Disponibles',
  selectedTitle: 'Seleccionados',
  originDataSource: [
    { nombre: 'Perfil A', detalle: 'Modulo usuarios' },
    { nombre: 'Perfil B', detalle: 'Modulo documentos' }
  ],
  selectedDataSource: [],
  itemLabel: 'nombre',
  itemDescription: 'detalle'
});
```

---

## Validacion unica en destino

`validateUnique` permite impedir duplicados en la lista de seleccionados.

```js
new MTS.TransferList('#profiles-transfer', {
  originDataSource: profiles,
  selectedDataSource: [],
  itemLabel: 'name',
  itemDescription: 'description',
  validateUnique: true,
  validateKey: 'moduleId',
  duplicateMessage: 'Ya existe un perfil para ese modulo.',
  onRequestItem: function (item, moved) {
    console.log(item, moved);
  }
});
```

`validateKey` puede ser:
- `string`: usa una propiedad del item
- `function`: devuelve el valor a comparar

```js
validateKey: function (item) {
  return item.id + '_' + item.creationDate;
}
```

---

## Opciones

| Propiedad | Tipo | Default | Descripcion |
|-----------|------|---------|-------------|
| `label` | `string` | `''` | Label superior |
| `hint` | `string` | `''` | Texto de ayuda |
| `originTitle` | `string` | `'Origin'` | Titulo lista origen |
| `selectedTitle` | `string` | `'Selected'` | Titulo lista seleccionada |
| `originEmptyText` | `string` | `'No items available'` | Texto vacio lista origen |
| `selectedEmptyText` | `string` | `'No items selected'` | Texto vacio lista seleccionada |
| `originDataSource` | `array` | `[]` | Data source inicial del origen |
| `selectedDataSource` | `array` | `[]` | Data source inicial de seleccionados |
| `itemLabel` | `string\|function` | `'label'` | Texto principal visible |
| `itemDescription` | `string\|function` | `'description'` | Texto secundario visible |
| `renderItem` | `function` | `null` | Render custom del item |
| `showMoveButtons` | `boolean` | `true` | Master switch — `false` oculta todos los botones sin excepcion |
| `buttons` | `object` | todos `true` | Control individual por boton. Si se omite, los 4 visibles (retrocompat) |
| `buttons.allToSelected` | `boolean` | `true` | Muestra el boton `»` (mover todos al destino) |
| `buttons.toSelected` | `boolean` | `true` | Muestra el boton `›` (mover seleccionado al destino) |
| `buttons.toOrigin` | `boolean` | `true` | Muestra el boton `‹` (mover seleccionado al origen) |
| `buttons.allToOrigin` | `boolean` | `true` | Muestra el boton `«` (mover todos al origen) |
| `removableSelectedItem` | `boolean` | `false` | Muestra una `x` por item en el lado seleccionado. Click elimina el item del destino — no lo mueve al origen |
| `draggable` | `boolean` | `true` | Permite drag and drop |
| `disabled` | `boolean` | `false` | Deshabilita la interaccion |
| `validateUnique` | `boolean` | `false` | Activa validacion unica en destino |
| `validateKey` | `string\|function` | `null` | Llave usada para comparar duplicados |
| `duplicateMessage` | `string` | `'Duplicate item'` | Mensaje visual cuando el drop esta bloqueado |
| `onRequestItem` | `function` | `null` | Callback unico: recibe `(item, moved)` |

---

## API

```js
const transfer = new MTS.TransferList('#transfer', { ... });

transfer.getValue();
transfer.getSelectedItems();
transfer.getOriginItems();
transfer.getAvailableItems();
transfer.setItems({ originDataSource: [], selectedDataSource: [] });
transfer.setValue([]);
transfer.moveToSelected(itemOrInternalKey);
transfer.moveToOrigin(itemOrInternalKey);
transfer.moveToAvailable(itemOrInternalKey);
transfer.moveAllToSelected();
transfer.moveAllToOrigin();
transfer.moveAllToAvailable();
transfer.clear();
transfer.enable();
transfer.disable();
transfer.destroy();
```

---

## Data attributes automáticos

Cada item renderizado recibe:

- `data-mts-item-key` con una llave interna automatica
- todos los campos del registro convertidos automaticamente a `data-*`

La componente no impone nombres fijos de negocio. Toma el datasource real y lo baja al `div` raiz del item.

---

## Eventos DOM

- `mts:transferlist:request-item`
- `mts:transferlist:change`
- `mts:transferlist:invalid-transfer`
- `mts:transferlist:selection-change`

`onRequestItem(item, moved)` es la API principal recomendada para integracion.

---

## Version

## Uso previsto — solo boton › + eliminar con x

```js
new MTS.TransferList('#roles-transfer', {
  originTitle: 'Disponibles',
  selectedTitle: 'Asignados',
  itemLabel: 'name',
  itemDescription: 'moduleName',
  validateUnique: true,
  validateKey: 'moduleId',
  duplicateMessage: 'Ya hay un perfil de ese modulo en el rol.',
  draggable: false,
  showMoveButtons: true,
  buttons: { allToSelected: false, toSelected: true, toOrigin: false, allToOrigin: false },
  removableSelectedItem: true
});
```

Resultado: solo el boton `›` para agregar + una `x` por item en el lado seleccionado para quitar.

---

## Changelog

### 2026-05-22
- `buttons` — control individual de cada boton (`allToSelected`, `toSelected`, `toOrigin`, `allToOrigin`). Si se omite el objeto, los 4 permanecen visibles (retrocompat).
- `showMoveButtons: false` — ahora remueve los botones del DOM (antes solo aplicaba clase CSS). Gana sobre cualquier valor de `buttons.*`.
- `removableSelectedItem` — boton `x` por item en el lado seleccionado. Elimina el item del destino sin moverlo al origen, sin validaciones, sin mecanica de move. Emite `change` con `trigger: 'remove'`.

### 2.0.0
- Nueva API con `originDataSource`, `selectedDataSource`, validacion unica y llave interna automatica.

### 1.0.0
- Release inicial de TransferList.
