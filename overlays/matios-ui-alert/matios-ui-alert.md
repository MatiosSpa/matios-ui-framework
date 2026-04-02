# matios-ui-alert

Alertas y banners inline con variantes semánticas.

## Uso JS
```js
MTS.Alert.show('#contenedor', {
  variant:     'success',     // 'info'|'success'|'warning'|'danger'
  title:       'Guardado',
  message:     'Los cambios se guardaron correctamente.',
  closable:    true,
  autoDismiss: 5000,          // se cierra solo después de 5s
  action:      'Ver detalles',
  onAction:    (alert) => {},
  onClose:     () => {},
})
```

## Uso solo HTML/CSS
```html
<div class="mts-alert mts-alert--warning">
  <div class="mts-alert__icon"><!-- ícono SVG --></div>
  <div class="mts-alert__body">
    <div class="mts-alert__title">Atención</div>
    <div class="mts-alert__message">El archivo supera el tamaño máximo.</div>
  </div>
  <button class="mts-alert__close" onclick="this.closest('.mts-alert').remove()">&times;</button>
</div>

<!-- Banner (sin bordes laterales, ancho completo) -->
<div class="mts-alert mts-alert--info mts-alert--banner">
  <div class="mts-alert__body">
    <div class="mts-alert__message">Versión 2.0 disponible. <a href="#">Ver novedades</a></div>
  </div>
</div>
```

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial |

---

## HTML declarativo

```html
<div id="miAlert"
  data-variant="success"
  data-title="¡Guardado!"
  data-message="Los cambios se guardaron correctamente."
  data-closable>
</div>

<script>
new MTS.Alert('#miAlert', {
  onClose: () => console.log('cerrado'),
})
</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-variant` | `variant` | `info`·`success`·`warning`·`danger` |
| `data-title` | `title` | |
| `data-message` | `message` | |
| `data-closable` | `closable` | (presencia activa) |
| `data-auto-dismiss` | `autoDismiss` | ms para cerrar |

