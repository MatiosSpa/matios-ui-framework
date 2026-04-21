# MTS.TransferList

Componente de asignacion entre dos listas.

Sirve para patrones tipo:
- `Transfer List`
- `Dual Listbox`
- `Pick List`
- `Shuttle`

Ideal para casos como:
- asignar perfiles a un rol
- mover elementos entre disponibles y seleccionados
- validar reglas antes del traslado

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
const transfer = new MTS.TransferList('#my-transfer', {
  label: 'Perfiles',
  availableTitle: 'Disponibles',
  selectedTitle: 'Seleccionados',
  availableItems: [
    { id: 'a', label: 'Perfil A', description: 'Modulo usuarios' },
    { id: 'b', label: 'Perfil B', description: 'Modulo documentos' }
  ],
  selectedItems: [],
  itemKey: 'id',
  itemLabel: 'label',
  itemDescription: 'description'
});
```

---

## Validacion antes de mover

`beforeTransfer` permite bloquear una transferencia.

Puede devolver:
- `true`: permite mover
- `false`: bloquea
- `string`: bloquea y usa el string como mensaje

```js
new MTS.TransferList('#profiles-transfer', {
  availableItems: profiles,
  selectedItems: [],
  itemKey: 'id',
  itemLabel: 'name',
  itemDescription: 'description',
  beforeTransfer: ({ item, to, selectedItems }) => {
    if (to !== 'selected') return true;

    const duplicatedModule = selectedItems.some((selected) =>
      selected.moduleId === item.moduleId
    );

    if (duplicatedModule) {
      return 'Ya existe un perfil seleccionado para ese modulo.';
    }

    return true;
  }
});
```

---

## Opciones

| Propiedad | Tipo | Default | Descripcion |
|-----------|------|---------|-------------|
| `label` | `string` | `''` | Label superior |
| `hint` | `string` | `''` | Texto de ayuda |
| `availableTitle` | `string` | `'Disponibles'` | Titulo lista izquierda |
| `selectedTitle` | `string` | `'Seleccionados'` | Titulo lista derecha |
| `availableItems` | `array` | `[]` | Items disponibles |
| `selectedItems` | `array` | `[]` | Items seleccionados |
| `value` | `array` | `[]` | Alias de `selectedItems` |
| `options` | `array` | `[]` | Alias de `availableItems` |
| `itemKey` | `string|function` | `value/id/label` | Clave unica por item |
| `itemLabel` | `string|function` | `'label'` | Texto principal |
| `itemDescription` | `string|function` | `'description'` | Texto secundario |
| `itemMeta` | `string|function` | `null` | Meta a la derecha |
| `renderItem` | `function` | `null` | Render custom del item |
| `draggable` | `boolean` | `true` | Permite drag & drop |
| `disabled` | `boolean` | `false` | Deshabilita toda la interaccion |
| `beforeTransfer` | `function` | `null` | Hook de validacion antes del traslado |
| `onChange` | `function` | - | Evento de cambio |
| `onInvalidTransfer` | `function` | - | Evento cuando se bloquea un traslado |

---

## API

```js
const transfer = new MTS.TransferList('#transfer', { ... });

transfer.getValue();
transfer.getSelectedItems();
transfer.getAvailableItems();
transfer.setItems({ availableItems: [], selectedItems: [] });
transfer.setValue([]);
transfer.moveToSelected('item-id');
transfer.moveToAvailable('item-id');
transfer.moveAllToSelected();
transfer.moveAllToAvailable();
transfer.clear();
transfer.enable();
transfer.disable();
transfer.destroy();
```

---

## Eventos

```js
transfer.on('change', (e) => {
  console.log(e.detail.selectedItems);
});

transfer.on('invalid-transfer', (e) => {
  console.log(e.detail.message);
});
```

Tambien emite eventos DOM:

- `mts:transferlist:change`
- `mts:transferlist:invalid-transfer`

---

## Version

| Version | Descripcion |
|---------|-------------|
| 1.0.0 | Release inicial de TransferList |
