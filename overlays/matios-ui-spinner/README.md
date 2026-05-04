# MTS.Spinner

Indicadores de carga animados. 10 variantes en 4 grupos, tones de color semántico, 5 tamaños y soporte para overlay de pantalla completa.

---

## Instalación

```html
<link rel="stylesheet" href="matios-ui-spinner.css">
<script src="matios-ui-spinner.js"></script>
```

`matios-ui-spinner.css` requiere `matios-ui-base.css` y un theme de modo cargado previamente.

---

## Uso básico

```html
<div id="my-spinner"></div>

<script>
  new MTS.Spinner('#my-spinner', { variant: 'clock' });
</script>
```

O de forma declarativa via `data-*`:

```html
<div data-variant="clock" data-size="md" class="my-spinner"></div>

<script>
  new MTS.Spinner('.my-spinner');
</script>
```

---

## Opciones

| Opción | Tipo | Default | Descripción |
|---|---|---|---|
| `variant` | `string` | `'clock'` | Tipo de spinner. Ver tabla de variantes. |
| `size` | `string` | `'md'` | Tamaño: `'xs'` · `'sm'` · `'md'` · `'lg'` · `'xl'` |
| `color` | `string` | `null` | Tone semántico o valor CSS. Ver sección de colores. |
| `color2` | `string` | `null` | Color secundario. Solo `dual` y `orbital`. |
| `color3` | `string` | `null` | Color terciario. Solo `orbital`. |
| `label` | `string` | `''` | Texto debajo del spinner. |
| `overlay` | `boolean` | `false` | Overlay de pantalla completa con fondo semitransparente. |

Todos los campos tienen su equivalente `data-*`:

```html
<div
  data-variant="activity"
  data-size="lg"
  data-color="warning"
  data-label="Procesando..."
  data-overlay
></div>
```

> `data-overlay` (sin valor) activa el overlay. `options` siempre tiene prioridad sobre `data-*`.

---

## Variantes

### Grupo Circular

| Variante | Descripción |
|---|---|
| `dual` | Dos anillos concéntricos girando en sentidos opuestos. Soporta `color2`. |
| `comet` | Cuatro arcos superpuestos con delay escalonado — efecto cometa. |
| `roller` | Ocho puntos orbitando en trail con deceleración cúbica. |
| `clock` | Doce puntos en posición de reloj que pulsan en secuencia. |
| `activity` | Doce rayos estilo iOS que se desvanecen rotativamente. |
| `orbital` | Dos anillos en perspectiva 3D. Soporta `color2`. |

### Grupo Barras & Olas

| Variante | Descripción |
|---|---|
| `bars` | Cinco barras verticales estilo ecualizador de audio. |
| `slide` | Una pelota que se desliza de lado a lado sobre un track. |
| `shadow` | Pelota que rebota verticalmente con sombra sincronizada. |

### Grupo Grid

| Variante | Descripción |
|---|---|
| `grid` | Nueve puntos en matriz 3×3 que pulsan en ola diagonal. |

---

## Tamaños

| Valor | Tamaño del inner |
|---|---|
| `xs` | 16 px |
| `sm` | 24 px |
| `md` | 36 px |
| `lg` | 48 px |
| `xl` | 64 px |

---

## Colores

### Tones semánticos

Pasan el nombre como string en `color`. El framework aplica la variable de color correspondiente del tema activo.

| Valor | Variable aplicada |
|---|---|
| *(sin color)* | `--mts-color-primary` |
| `'warning'` | `--mts-color-warning` |
| `'danger'` | `--mts-color-danger` |
| `'success'` | `--mts-color-success` |
| `'muted'` | `--mts-text-muted` |

### Valor CSS directo

Cualquier valor CSS válido se pasa directamente como custom property:

```js
new MTS.Spinner('#sp', { variant: 'comet', color: '#e11d48' });
new MTS.Spinner('#sp', { variant: 'comet', color: 'var(--mts-color-danger)' });
```

### Multi-color: `color2` y `color3`

Solo disponible en variantes que renderizan múltiples elementos independientes:

- **`dual`** — `color` para el anillo exterior, `color2` para el interior.
- **`orbital`** — `color` para el primer anillo 3D, `color2` para el segundo.

Si no se especifican, `color2` y `color3` heredan automáticamente el valor de `color`.

```js
new MTS.Spinner('#sp', {
  variant: 'dual',
  color:  'var(--mts-color-primary)',
  color2: 'var(--mts-color-warning)'
});

new MTS.Spinner('#sp', {
  variant: 'orbital',
  color:  'var(--mts-color-danger)',
  color2: 'var(--mts-color-success)'
});
```

---

## Overlay

Activa un overlay de pantalla completa con fondo semitransparente y el spinner centrado. Ideal para bloquear la UI durante operaciones asíncronas.

```js
var host = document.createElement('div');
document.body.appendChild(host);

var sp = new MTS.Spinner(host, {
  variant: 'clock',
  size: 'xl',
  overlay: true,
  label: 'Cargando...'
});

sp.show();

fetch('/api/data').then(function () {
  sp.hide();
  host.remove();
});
```

---

## API pública

| Método | Retorna | Descripción |
|---|---|---|
| `show()` | `this` | Muestra el spinner (quita `display:none`). Encadenable. |
| `hide()` | `this` | Oculta el spinner (`display:none`). Encadenable. |
| `destroy()` | `void` | Vacía el elemento y elimina todas las clases. |

```js
var sp = new MTS.Spinner('#my-spinner', { variant: 'bars', size: 'lg' });

sp.hide();
// ... más tarde ...
sp.show();
// ... al terminar ...
sp.destroy();
```

---

## Variables CSS

El componente expone tres custom properties que se pueden sobrescribir directamente en el elemento contenedor:

```css
#my-spinner {
  --mts-spinner-color:   #e11d48;
  --mts-spinner-color-2: #f59e0b;
  --mts-spinner-color-3: #22c55e;
}
```

| Variable | Default | Uso |
|---|---|---|
| `--mts-spinner-color` | `var(--mts-color-primary)` | Color principal — todas las variantes |
| `--mts-spinner-color-2` | `var(--mts-spinner-color)` | Color secundario — `dual`, `orbital` |
| `--mts-spinner-color-3` | `var(--mts-spinner-color)` | Color terciario — `orbital` |
