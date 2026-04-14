# MTS.Toast

[EN] Transient notification (snackbar) with variants, positions, action button, auto-dismiss and loading state. Static API — no instantiation required.
[ES] Notificación fugaz (snackbar) con variantes, posiciones, botón de acción, auto-dismiss y estado de carga. API estática — no requiere instanciación.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-toast.css">
<script src="matios-ui-toast.js"></script>
```

---

## Options / Opciones

[EN] `MTS.Toast` is a static API — call `MTS.Toast.show(options)` directly.
[ES] `MTS.Toast` es una API estática — llama `MTS.Toast.show(options)` directamente.

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `message` | `string` | — | [EN] Toast message (required) / [ES] Mensaje del toast (requerido) |
| `title` | `string` | `null` | [EN] Optional title / [ES] Título opcional |
| `variant` | `string` | `'default'` | `'default'` · `'success'` · `'warning'` · `'danger'` · `'info'` · `'loading'` |
| `position` | `string` | `'bottom-right'` | `'top-right'` · `'top-left'` · `'top-center'` · `'bottom-right'` · `'bottom-left'` · `'bottom-center'` |
| `duration` | `number` | `4000` | [EN] Auto-close after ms (0 = manual close) / [ES] Cerrar tras ms (0 = cierre manual) |
| `closable` | `boolean` | `true` | [EN] Show × button / [ES] Mostrar botón × |
| `action` | `string` | `null` | [EN] Action button label / [ES] Label del botón de acción |
| `icon` | `string` | auto | [EN] Custom icon HTML / [ES] HTML del ícono personalizado |
| `onAction` | `function` | — | [EN] Fires when action button is clicked / [ES] Se dispara al hacer click en la acción |
| `onClose` | `function` | — | [EN] Fires when toast closes / [ES] Se dispara al cerrar el toast |

---

## JavaScript Usage / Uso JavaScript

```js
// Basic / Básico
MTS.Toast.show({ message: 'Changes saved.' });

// Success
MTS.Toast.show({
  variant: 'success',
  message: 'File uploaded successfully.',
  duration: 3000,
});

// Warning with title / Advertencia con título
MTS.Toast.show({
  variant:  'warning',
  title:    'Low storage',
  message:  'Only 2GB remaining.',
  duration: 6000,
});

// Danger / Error
MTS.Toast.show({
  variant:  'danger',
  message:  'Connection failed. Please try again.',
  duration: 0,      // stays until closed / permanece hasta cerrar
  closable: true,
});

// With action button / Con botón de acción
MTS.Toast.show({
  variant:  'info',
  message:  'New version available.',
  action:   'Update now',
  // Fires when action is clicked / Se dispara al hacer click en la acción
  onAction: () => installUpdate(),
  // Fires when toast closes / Se dispara al cerrar el toast
  onClose:  () => console.log('dismissed'),
});

// Loading state / Estado de carga
const loader = MTS.Toast.show({
  variant:  'loading',
  message:  'Uploading file...',
  duration: 0,       // does not auto-close / no cierra automáticamente
  closable: false,
});
loader.close(); // close manually when done / cerrar manualmente al terminar

// Top center position / Posición arriba al centro
MTS.Toast.show({
  variant:  'success',
  message:  'Saved!',
  position: 'top-center',
  duration: 2000,
});
```

---

## Return Value / Valor de retorno

[EN] `MTS.Toast.show()` returns an object with a `close()` method to dismiss the toast programmatically.
[ES] `MTS.Toast.show()` retorna un objeto con un método `close()` para cerrar el toast programáticamente.

```js
const toast = MTS.Toast.show({
  variant:  'loading',
  message:  'Processing...',
  duration: 0,
});

// Later... / Más tarde...
await doHeavyWork();
toast.close();

MTS.Toast.show({ variant: 'success', message: 'Done!' });
```

---

## Positions / Posiciones

| Value | [EN] Location / [ES] Ubicación |
|-------|--------------------------------|
| `'top-right'` | [EN] Top right corner / [ES] Esquina superior derecha |
| `'top-left'` | [EN] Top left corner / [ES] Esquina superior izquierda |
| `'top-center'` | [EN] Top center / [ES] Centro superior |
| `'bottom-right'` | [EN] Bottom right (default) / [ES] Esquina inferior derecha (default) |
| `'bottom-left'` | [EN] Bottom left corner / [ES] Esquina inferior izquierda |
| `'bottom-center'` | [EN] Bottom center / [ES] Centro inferior |

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Bilingual comments, standardized docs / [ES] Comentarios bilingüe, docs estandarizados |
| 1.0.0 | [EN] Initial release — variants, positions, action, loading / [ES] Versión inicial |
