# MTS.ConfirmButton

Botón con confirmación inline en 2 pasos. Evita confirmaciones accidentales sin necesidad de un modal. Incluye barra de timeout que auto-cancela.

## Uso
```js
new MTS.ConfirmButton('#el', {
  label:          'Eliminar registro',
  confirmLabel:   '¿Confirmar eliminación?',
  cancelLabel:    'No',
  variant:        'secondary',
  confirmVariant: 'danger',
  timeout:         4000,
  onConfirm: () => eliminarRegistro(),
  onCancel:  () => console.log('cancelado'),
})
```

## Opciones
| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `label` | `string` | `'Eliminar'` | Label del botón inicial |
| `confirmLabel` | `string` | `'¿Confirmar?'` | Label al pedir confirmación |
| `cancelLabel` | `string` | `'No'` | Label del botón cancelar |
| `variant` | `string` | `'secondary'` | Variante del botón inicial |
| `confirmVariant` | `string` | `'danger'` | Variante al confirmar |
| `size` | `string` | `'md'` | `'sm'`\|`'md'`\|`'lg'` |
| `timeout` | `number` | `4000` | ms para auto-cancelar. `0` = sin timeout |
| `iconLeft` | `string` | `''` | HTML de ícono |
| `onConfirm` | `function` | `null` | Al confirmar |
| `onCancel` | `function` | `null` | Al cancelar o timeout |

---

## HTML declarativo

```html
<button id="miBtn"
  data-label="Eliminar registro"
  data-confirm-label="Sí, eliminar"
  data-cancel-label="Cancelar"
  data-variant="danger"
  data-timeout="5">
</button>

<script>
new MTS.ConfirmButton('#miBtn', {
  onConfirm: () => eliminar(),
  onCancel:  () => console.log('cancelado'),
})
</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-label` | `label` | Texto inicial |
| `data-confirm-label` | `confirmLabel` | Texto al confirmar |
| `data-cancel-label` | `cancelLabel` | Texto para cancelar |
| `data-variant` | `variant` | Variante |
| `data-confirm-variant` | `confirmVariant` | Variante al confirmar |
| `data-size` | `size` | |
| `data-timeout` | `timeout` | Segundos auto-cancelar |
| `data-disabled` | `disabled` | (presencia activa) |

