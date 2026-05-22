# MTS.FormGuard

Dirty-tracking declarativo para formularios. Una sola llamada `MTS.FormGuard.start()` en el shell de la aplicación; los plugins solo agregan atributos HTML — cero JavaScript adicional.

---

## Instalación

```html
<link  rel="stylesheet" href="matios-ui-formguard.css">
<script src="matios-ui-formguard.js"></script>
```

Inicializar en el shell (una sola vez, al arrancar la app):

```js
MTS.FormGuard.start();
```

Con mensajes personalizados:

```js
MTS.FormGuard.start({
  messages: {
    modalTitle:  'Cambios pendientes',
    modalBody:   'Hay cambios sin guardar en el formulario.',
    btnKeep:     'Seguir editando',
    btnDiscard:  'Descartar',
    btnSave:     'Guardar y salir'
  }
});
```

---

## Uso básico

Agregar `data-mts-form` al contenedor del formulario. FormGuard lo adopta automáticamente (sea que esté en el DOM al inicio o que se inyecte después vía SPA).

```html
<div data-mts-form data-mts-form-id="user-profile">

  <!-- MTS components — rastreados automáticamente via _mtsInstance -->
  <div id="input-nombre"></div>
  <div id="select-rol"></div>

  <!-- Controles nativos — rastreados automáticamente -->
  <input type="text" name="notas">

  <button data-mts-form-back>Volver</button>
  <button id="btn-guardar">Guardar</button>

</div>
```

```js
// Componentes MTS — instanciarlos normalmente, sin tocar FormGuard
new MTS.Input('#input-nombre', { label: 'Nombre' });
new MTS.Select('#select-rol',  { options: [...] });
```

---

## Atributos HTML

| Atributo | En elemento | Descripción |
|---|---|---|
| `data-mts-form` | Contenedor | Marca el formulario gestionado |
| `data-mts-form-id` | Contenedor | ID único del form (auto-generado si se omite) |
| `data-mts-form-save` | Contenedor | Selector CSS del botón guardar — recibe el dot rojo y es el que se clickea en "Guardar y salir" |
| `data-mts-form-back` | Botón | Intercepta el click si el form está sucio y muestra el modal de confirmación |
| `data-mts-form-watch` | Control nativo | Fuerza el tracking en un elemento aunque no sea input/select/textarea estándar |
| `data-mts-form-ignore` | Subtree | Excluye ese nodo y todos sus descendientes del tracking |
| `data-mts-form-title-target` | Contenedor | Selector CSS del elemento donde se inyecta el ` *` de dirty. Si se omite, usa `.mts-card__title` dentro del form |

---

## Opciones de `start()`

| Opción | Tipo | Descripción |
|---|---|---|
| `messages.unsavedChanges` | string | Mensaje del `confirm()` nativo (fallback si no hay MTS.Modal) |
| `messages.modalTitle` | string | Título del MTS.Modal |
| `messages.modalBody` | string | Cuerpo del MTS.Modal |
| `messages.btnKeep` | string | Botón "Seguir editando" |
| `messages.btnDiscard` | string | Botón "Descartar cambios" |
| `messages.btnSave` | string | Botón "Guardar y salir" |

---

## API

| Método | Descripción |
|---|---|
| `MTS.FormGuard.start(options?)` | Inicia el tracking. Idempotente — llamadas repetidas se ignoran. |
| `MTS.FormGuard.stop()` | Detiene el tracking y limpia todo el estado. |
| `MTS.FormGuard.syncAll()` | Re-toma el snapshot de todos los forms activos (útil después de `setValue()` masivo). |
| `MTS.FormGuard.sync(formId)` | Re-toma el snapshot de un form específico por su `data-mts-form-id`. |
| `MTS.FormGuard.hasUnsavedChanges()` | `boolean` — true si hay al menos un form sucio. |
| `MTS.FormGuard.getDirtyCount()` | `number` — cantidad de forms sucios. |

---

## Eventos DOM

### Eventos emitidos por FormGuard

Todos burbujean desde el elemento `[data-mts-form]`.

| Evento | `e.detail` | Descripción |
|---|---|---|
| `mts:form:dirty-change` | `{ formId, isDirty }` | El estado dirty del form cambió |
| `mts:form:before-navigate` | `{ formId }` | Cancelable. Se emite antes de abrir el modal de navegación. `e.preventDefault()` cancela el modal. |

```js
document.addEventListener('mts:form:dirty-change', function (e) {
  console.log('Form', e.detail.formId, 'dirty:', e.detail.isDirty);
});
```

### Eventos que el consumidor puede disparar

Disparar sobre cualquier descendiente del `[data-mts-form]` (o el propio elemento) — FormGuard los escucha por burbujeo.

| Evento | `detail` | Descripción |
|---|---|---|
| `mts:form:save-ack` | `{ formId? }` | El plugin confirmó que el guardado fue exitoso. FormGuard resetea el snapshot. |
| `mts:form:snapshot-sync` | — | Fuerza un re-snapshot inmediato sin marcar dirty (útil después de `setValue()` programático). |

```js
// Después de un save exitoso en el plugin:
document.querySelector('[data-mts-form-id="user-profile"]').dispatchEvent(
  new CustomEvent('mts:form:save-ack', { bubbles: true, detail: { formId: 'user-profile' } })
);

// Después de cargar datos programáticamente:
document.querySelector('[data-mts-form]').dispatchEvent(
  new CustomEvent('mts:form:snapshot-sync', { bubbles: true })
);
```

---

## Variables CSS

| Variable | Valor default | Descripción |
|---|---|---|
| `--mts-color-warning` | `#f59e0b` | Color del asterisco dirty |
| `--mts-color-danger` | `#ef4444` | Color del dot en el botón guardar |
| `--mts-bg-surface` | `#ffffff` | Color del borde del dot |

---

## Notas

### Componentes rastreados automáticamente

FormGuard rastrea todos los elementos que cumplan al menos una condición:
1. Tienen `._mtsInstance` — cualquier componente MTS instanciado sobre ese nodo
2. Tienen `data-mts-form-watch` — control nativo marcado explícitamente
3. Son `<input>`, `<select>` o `<textarea>` nativos (excepto `type=submit/button/reset/image`)

Los elementos con `data-mts-form-ignore` y todos sus descendientes son excluidos.
Los formularios anidados (`[data-mts-form]` dentro de otro) son tratados como unidades independientes.

### Dirty tracking reversible

Si el usuario revierte un campo a su valor original, FormGuard lo detecta y marca el form como limpio de nuevo. La comparación usa `===` para primitivos y `JSON.stringify()` para arrays/objetos.

### MutationObserver

FormGuard usa un `MutationObserver` sobre `document.body` con `{ childList: true, subtree: true }`. Los formularios inyectados vía SPA o `innerHTML` son adoptados automáticamente cuando aparecen en el DOM y liberados cuando desaparecen — sin ningún código adicional en el plugin.

### Flujo del modal "Guardar y salir"

1. El usuario hace click en un elemento `[data-mts-form-back]` con el form sucio
2. Se emite `mts:form:before-navigate` (cancelable)
3. Se abre MTS.Modal (o `confirm()` como fallback)
4. Si el usuario elige **"Guardar y salir"**: FormGuard clickea el botón de `data-mts-form-save` y espera hasta 10 s el evento `mts:form:save-ack` desde el plugin
5. Al recibir el ack: cierra el modal, resetea el snapshot y continúa la navegación

### beforeunload — cierre de pestaña o navegación externa

Cuando hay forms sucios, FormGuard registra un listener de `beforeunload`. Al disparar muestra **MTS.Modal** con dos opciones:

- **Seguir editando** — cierra el modal, el usuario permanece en la página.
- **Salir sin guardar** — cierra el modal, elimina el listener y resetea el dirty state. El siguiente intento de navegar/cerrar ya no es bloqueado.

**Limitación del browser**: en cierre de pestaña (`Ctrl+W` / click en la X del browser) algunos browsers muestran su propio dialog nativo encima del modal. Esto es una restricción de seguridad del browser — no existe API web para suprimirlo. Si tu caso de uso requiere el dialog nativo en lugar del modal, reemplazá `_mountBeforeUnload` con un handler que solo haga `e.returnValue = ''`.

---

## Changelog

### 2026-05-21
- Componente creado
- Singleton declarativo: `start()`, `stop()`, `syncAll()`, `sync()`, `hasUnsavedChanges()`, `getDirtyCount()`
- MutationObserver: adopt/release automático
- Dirty tracking reversible con snapshot por control
- Modal 3 botones (MTS.Modal + fallback `confirm()`)
- beforeunload cuando hay forms sucios
- Convención `_mtsInstance` en: Input, Toggle, Select, Checkbox, CheckboxGroup, Radio, Slider, TagInput, DatePicker.Base, RichEditor, NumberInput, PhoneInput
- Eventos: `mts:form:dirty-change`, `mts:form:before-navigate`, `mts:form:save-ack`, `mts:form:snapshot-sync`
