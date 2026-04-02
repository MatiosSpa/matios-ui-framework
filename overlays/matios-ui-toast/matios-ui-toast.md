# MTS.Toast

Notificaciones fugaces (snackbar) con posición, duración, acciones y variantes de color.

## Uso

```js
MTS.Toast.show({
  message:  'Cambios guardados correctamente',
  variant:  'success',
  duration:  4000,
  position: 'bottom-right',
})

// Atajos rápidos
MTS.Toast.show.success('Guardado')
MTS.Toast.show.warning('Revisa los datos')
MTS.Toast.show.danger('Error al conectar')
MTS.Toast.show.info('Nueva versión disponible')
```

## Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `message` | `string` | — | Texto del toast (requerido) |
| `title` | `string` | `null` | Título opcional |
| `variant` | `string` | `'default'` | `'default'` \| `'success'` \| `'warning'` \| `'danger'` \| `'info'` |
| `position` | `string` | `'bottom-right'` | `'top-right'` \| `'top-left'` \| `'top-center'` \| `'bottom-right'` \| `'bottom-left'` \| `'bottom-center'` |
| `duration` | `number` | `4000` | ms antes de cerrar. `0` = no cierra |
| `closable` | `boolean` | `true` | Botón × |
| `action` | `string` | `null` | Label del botón de acción |
| `onAction` | `function` | `null` | Callback del botón de acción |
| `onClose` | `function` | `null` | Callback al cerrar |

## API

```js
const t = MTS.Toast.show({ message: 'Procesando...', duration: 0 })
t.close()  // cerrar programáticamente
```
