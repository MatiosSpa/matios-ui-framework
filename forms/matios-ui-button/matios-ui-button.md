# MTS.Button

Botón con variantes, tamaños, estados y grupos. Envuelve un `<button>` nativo con una API JS limpia.

---

## Instalación
```html
<link rel="stylesheet" href="../../base/matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-button.css">
<script src="matios-ui-button.js"></script>
```

---

## ─── MTS.Button ───────────────────────────────────────────

### Uso básico
```js
const btn = new MTS.Button('#mi-btn', {
  label:   'Guardar',
  variant: 'primary',
  onClick: (event, instance) => console.log('¡click!'),
})
```

### Variantes
```js
new MTS.Button('#btn', { variant: 'primary'   })   // azul primario (default)
new MTS.Button('#btn', { variant: 'secondary' })   // superficie, con borde
new MTS.Button('#btn', { variant: 'ghost'     })   // solo borde, sin fondo
new MTS.Button('#btn', { variant: 'danger'    })   // rojo — acciones destructivas
new MTS.Button('#btn', { variant: 'warning'   })   // naranja — advertencia
new MTS.Button('#btn', { variant: 'link'      })   // sin borde, apariencia de link
```

### Tamaños
```js
new MTS.Button('#btn', { size: 'xs' })
new MTS.Button('#btn', { size: 'sm' })
new MTS.Button('#btn', { })              // md — default
new MTS.Button('#btn', { size: 'lg' })
new MTS.Button('#btn', { size: 'xl' })
```

### Con íconos
```js
new MTS.Button('#btn', {
  label:     'Descargar',
  iconLeft:  '<svg>...</svg>',
  iconRight: '<svg>...</svg>',
})

// Solo ícono (padding cuadrado)
new MTS.Button('#btn', {
  iconLeft: '<svg>...</svg>',
  iconOnly: true,
})
```

### CSS custom
```js
// Vía className
new MTS.Button('#btn', {
  className: 'mi-clase-extra otra-clase',
})

// Vía style inline
new MTS.Button('#btn', {
  style: { background: '#ff5500', borderColor: '#ff5500', color: '#fff' },
})
```

### Opciones completas
| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `label` | `string` | texto del botón | Texto visible |
| `variant` | `string` | `'primary'` | `'primary'` · `'secondary'` · `'ghost'` · `'danger'` · `'success'` · `'warning'` · `'link'` |
| `size` | `string` | `''` | `'xs'` · `'sm'` · `''` · `'lg'` · `'xl'` |
| `block` | `boolean` | `false` | Ancho 100% |
| `round` | `boolean` | `false` | Border-radius pill |
| `iconOnly` | `boolean` | `false` | Padding cuadrado — sin texto |
| `iconLeft` | `string` | `null` | HTML del ícono izquierdo |
| `iconRight` | `string` | `null` | HTML del ícono derecho |
| `disabled` | `boolean` | `false` | Deshabilitado |
| `loading` | `boolean` | `false` | Muestra spinner |
| `shadow` | `boolean` | `false` | Sombra de color derivada del tema activo |
| `ring` | `boolean` | `false` | Ring semitransparente alrededor del botón |
| `className` | `string` | `''` | Clases CSS adicionales |
| `style` | `object` | `null` | Estilos inline custom |
| `onClick` | `function` | — | `(event, instance) => {}` |

---

## ─── API ──────────────────────────────────────────────────

```js
const btn = new MTS.Button('#btn', { ... })

btn.enable()                   // habilitar
btn.disable()                  // deshabilitar
btn.setLoading(true)           // activar spinner
btn.setLoading(false)          // desactivar spinner
btn.setLabel('Guardado ✓')     // cambiar texto
btn.setVariant('danger')       // cambiar variante
btn.setShadow(true)            // activar sombra de color
btn.setShadow(false)           // desactivar sombra
btn.setRing(true)              // activar ring semitransparente
btn.setRing(false)             // desactivar ring

btn.on('click', (e, instance) => {})   // agregar listener
btn.off('click', fn)                   // remover listener
btn.destroy()                          // destruir instancia
```

---

## ─── Eventos DOM ──────────────────────────────────────────

```js
document.getElementById('mi-btn')
  .addEventListener('mts:button:click', (e) => {
    console.log(e.detail.button)   // instancia MTS.Button
  })
```

---

## ─── MTS.ButtonGroup ──────────────────────────────────────

Agrupa botones visualmente — sin gap, bordes compartidos, border-radius solo en los extremos.

```js
new MTS.ButtonGroup('#mi-grupo', [
  { label: 'Día',    variant: 'secondary', onClick: () => {} },
  { label: 'Semana', variant: 'secondary', onClick: () => {} },
  { label: 'Mes',    variant: 'primary',   onClick: () => {} },
])

// Con tamaño uniforme para todo el grupo
new MTS.ButtonGroup('#mi-grupo', [
  { label: 'Exportar', variant: 'ghost',  onClick: () => {} },
  { label: 'Eliminar', variant: 'danger', onClick: () => {} },
], { size: 'sm' })
```

```js
const grupo = new MTS.ButtonGroup('#grupo', [...])
grupo.getButton(0).disable()     // deshabilitar el primer botón
grupo.getButton(1).setLabel('Nuevo texto')
grupo.getButtons()               // → [MTS.Button, MTS.Button, ...]
```

---

## Changelog
| Versión | Descripción |
|---------|-------------|
| 1.0.0 | Release inicial — variante `warning`, `MTS.ButtonGroup`, CSS custom, loading, onClick |

---

## HTML declarativo

```html
<!-- Solo HTML -->
<button id="miBtn" data-variant="primary" data-label="Guardar" data-shadow data-size="lg"></button>

<!-- Con JS para callbacks -->
<script>
const btn = new MTS.Button('#miBtn', {
  onClick: () => console.log('click'),
})
btn.setLoading(true)
btn.setLabel('Guardando...')
</script>
```

| Atributo | JS | Descripción |
|----------|-----|-------------|
| `data-label` | `label` | Texto del botón |
| `data-variant` | `variant` | `primary`·`secondary`·`ghost`·`danger`·`success` |
| `data-size` | `size` | `sm`·`''`·`lg` |
| `data-disabled` | `disabled` | (presencia activa) |
| `data-loading` | `loading` | (presencia activa) |
| `data-block` | `block` | Ancho completo (presencia activa) |
| `data-round` | `round` | (presencia activa) |
| `data-icon-only` | `iconOnly` | (presencia activa) |
| `data-shadow` | `shadow` | (presencia activa) |
| `data-ring` | `ring` | (presencia activa) |

