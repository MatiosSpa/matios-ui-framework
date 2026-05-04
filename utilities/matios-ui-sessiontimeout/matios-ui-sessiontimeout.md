# MTS.SessionTimeout

Gestión de timeout de sesión por inactividad. Muestra una barra de progreso fija en el borde inferior de la página y abre un modal de advertencia con countdown cuando el tiempo está por vencer. Configurable en mensajes, tiempos y acciones.

**Dependencias:** `MTS.Progress`, `MTS.Modal`

---

## Instalación

```html
<link rel="stylesheet" href="matios-ui-progress.css">
<link rel="stylesheet" href="matios-ui-modal.css">
<link rel="stylesheet" href="matios-ui-sessiontimeout.css">

<script src="matios-ui-progress.js"></script>
<script src="matios-ui-modal.js"></script>
<script src="matios-ui-sessiontimeout.js"></script>
```

---

## Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `timeoutMinutes` | `number` | `30` | Minutos totales de inactividad antes de expirar |
| `warningMinutes` | `number` | `5` | Minutos restantes en los que se abre el modal de aviso. `0` desactiva el modal. |
| `titleIcon` | `string` | `'alert-triangle'` | Nombre del ícono `MTS.Icon` que aparece a la izquierda del título. `''` para omitirlo. |
| `titleText` | `string` | `messages.title` | Texto del título del modal. Si no se especifica, usa `messages.title`. |
| `messages.title` | `string` | `'Tu sesión está por vencer'` | Texto base del título (usado si no se define `titleText`) |
| `messages.body` | `string` | `'Por inactividad, tu sesión se cerrará en {time}.'` | Cuerpo del modal. `{time}` se reemplaza con el countdown en vivo (`MM:SS`). |
| `messages.warning` | `string` | `'Si tienes trabajo sin guardar, podrías perderlo.'` | Texto de advertencia debajo del cuerpo. `''` para ocultarlo. |
| `messages.btnRefresh` | `string` | `'Renovar sesión'` | Label del botón primario |
| `messages.btnExpire` | `string` | `'Cerrar sesión'` | Label del botón secundario |
| `onRefresh` | `function(done)` | — | Se llama cuando el usuario presiona "Renovar". Recibe `done()` — llamarlo resetea el timer. Si la renovación falla, no llamar `done()` (el timer sigue corriendo). |
| `onExpire` | `function` | — | Se llama cuando el timer llega a cero o el usuario presiona "Cerrar sesión" |

---

## API

```js
const session = new MTS.SessionTimeout({ ... });

session.reset()       // Resetea el timer al máximo. Cierra el modal si estaba abierto.
session.showWarning() // Abre el modal de advertencia inmediatamente (demo / testing)
session.destroy()     // Destruye el componente, limpia timers y remueve la barra del DOM
```

---

## Uso básico

```js
new MTS.SessionTimeout({
  timeoutMinutes: 30,
  warningMinutes: 5,
  onRefresh: function(done) {
    done(); // sin renovación de token → solo resetea el timer
  },
  onExpire: function() {
    logout();
  },
});
```

---

## Mensajes personalizados

```js
new MTS.SessionTimeout({
  timeoutMinutes: 30,
  warningMinutes: 5,
  titleIcon: 'alert-triangle',
  titleText: 'Atención',
  messages: {
    body:       'Tu sesión expirará en {time}. ¿Sigues aquí?',
    warning:    'Guarda tu trabajo antes de que se cierre la sesión.',
    btnRefresh: 'Sigo trabajando',
    btnExpire:  'Salir ahora',
  },
  onRefresh: function(done) { done(); },
  onExpire:  function()     { logout(); },
});
```

---

## Solo barra (sin modal de aviso)

```js
new MTS.SessionTimeout({
  timeoutMinutes: 30,
  warningMinutes: 0,   // desactiva el modal
  onExpire: function() { logout(); },
});
```

---

## Uso real con renovación de token

```js
const session = new MTS.SessionTimeout({
  timeoutMinutes: 30,
  warningMinutes: 5,
  onRefresh: function(done) {
    fetch('/api/auth/refresh', { method: 'POST' })
      .then(function(res) {
        if (res.ok) {
          done(); // renovación exitosa → resetea el timer
        } else {
          logout(); // token inválido → cerrar
        }
      })
      .catch(function() { logout(); });
  },
  onExpire: function() {
    logout();
  },
});

// Resetear ante actividad relevante (opcional)
document.addEventListener('click', function() { session.reset(); });
```

---

## Notas

- La barra se inyecta automáticamente en `document.body` al crear la instancia. No requiere markup HTML previo.
- El countdown en el modal (`{time}`) se actualiza cada segundo y muestra formato `MM:SS`.
- Si el usuario presiona "Renovar" y `onRefresh` no llama `done()` (p.ej. el servidor rechazó el token), el timer sigue corriendo — el modal no se cierra solo.
- `destroy()` limpia todos los timers e intervalos y remueve la barra del DOM.

---
