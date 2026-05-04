# MTS.Alert

🇬🇧 Inline alert and banner component with variants, icons, action buttons and auto-dismiss. Works via JS and pure HTML/CSS.
🇪🇸 Componente de alerta y banner inline con variantes, íconos, botones de acción y auto-dismiss. Funciona via JS y HTML/CSS puro.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-alert.css">
<script src="matios-ui-alert.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `variant` | `string` | `'info'` | `'info'` · `'success'` · `'warning'` · `'danger'` |
| `title` | `string` | `''` | 🇬🇧 Optional title / 🇪🇸 Título opcional |
| `message` | `string` | `''` | 🇬🇧 Main message / 🇪🇸 Mensaje principal |
| `closable` | `boolean` | `true` | 🇬🇧 Show close button / 🇪🇸 Mostrar botón de cierre |
| `icon` | `boolean` | `true` | 🇬🇧 Show icon / 🇪🇸 Mostrar ícono |
| `action` | `string` | `null` | 🇬🇧 Action button label / 🇪🇸 Label del botón de acción |
| `autoDismiss` | `number` | `0` | 🇬🇧 Auto-close after ms (0 = disabled) / 🇪🇸 Auto-cerrar tras ms (0 = deshabilitado) |
| `onAction` | `function` | — | 🇬🇧 Fires when action button is clicked / 🇪🇸 Se dispara al hacer click en el botón de acción |
| `onClose` | `function` | — | 🇬🇧 Fires when alert is closed / 🇪🇸 Se dispara al cerrar la alerta |

---

## Events / Eventos

```js
new MTS.Alert('#my-alert', {
  variant: 'warning',
  message: 'Session expires soon.',
  action:  'Renew',
  // Fires when action button is clicked / Se dispara al hacer click en el botón de acción
  onAction: (e) => renewSession(),
  // Fires when alert is closed / Se dispara al cerrar la alerta
  onClose:  (e) => console.log('closed'),
});
```

---

## HTML Usage / Uso HTML

```html
<!-- Pure CSS — no JS needed / CSS puro — sin JS -->
<div class="mts-alert mts-alert--success">
  <div class="mts-alert__icon">...</div>
  <div class="mts-alert__body">
    <div class="mts-alert__title">Success</div>
    <div class="mts-alert__message">Changes saved correctly.</div>
  </div>
</div>

<!-- JS-powered / Con JS -->
<div id="my-alert"></div>
<script>
  new MTS.Alert('#my-alert', {
    variant: 'success',
    title:   'Saved',
    message: 'Changes saved correctly.',
    onClose: (e) =&gt; console.log('closed'),
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Basic / Básico
new MTS.Alert('#alert-container', {
  variant: 'info',
  message: 'A new version is available.',
});

// With title and action / Con título y acción
new MTS.Alert('#alert-container', {
  variant: 'warning',
  title:   'Session expiring',
  message: 'Your session expires in 5 minutes.',
  action:  'Renew now',
  // Fires on action click / Se dispara al hacer click en la acción
  onAction: (e) => renewSession(),
  // Fires when closed / Se dispara al cerrar
  onClose:  (e) => console.log('dismissed'),
});

// Auto-dismiss / Auto-cerrar
new MTS.Alert('#alert-container', {
  variant:     'success',
  message:     'File uploaded successfully.',
  autoDismiss: 4000,  // closes after 4s / cierra tras 4s
  closable:    false,
});

// Banner (full width) / Banner (ancho completo)
new MTS.Alert('#banner', {
  variant: 'danger',
  title:   'Service outage',
  message: 'Some services are currently unavailable.',
  closable: true,
});
```

---

## HTML Declarative / HTML Declarativo

```html
<!-- data-* attributes initialize automatically / Los atributos data-* inicializan automáticamente -->
<div id="my-alert"
  data-variant="success"
  data-title="Done"
  data-message="Your changes were saved."
  data-closable
  data-auto-dismiss="5000">
</div>

<script>
  new MTS.Alert('#my-alert');
</script>
```

---

## API

```js
const alert = new MTS.Alert('#container', { ... });

// Close programmatically / Cerrar programáticamente
alert.close()

// Register listeners / Registrar listeners
alert.on('close',  (e) => console.log('closed'))
alert.on('action', (e) => console.log('action clicked'))
```

---

## DOM Event / Evento DOM

```js
document.getElementById('my-alert')
  .addEventListener('mts:alert:close', () => console.log('closed'));
```

---
