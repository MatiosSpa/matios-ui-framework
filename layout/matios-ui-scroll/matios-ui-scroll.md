# MTS.Scroll

Contenedor scrollable con scrollbar temático (fino, adaptado al tema activo), fades de borde que indican más contenido, y eventos de posición.

## Uso

```html
<div id="mi-scroll" style="height:300px">
  <!-- contenido largo aquí -->
</div>
```

```js
new MTS.Scroll('#mi-scroll', {
  direction: 'vertical',
  onReachEnd: function() {
    console.log('llegaste al final — cargar más datos');
  }
});
```

## Opciones

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `direction` | `string` | `'vertical'` | `'vertical'` \| `'horizontal'` \| `'both'` |
| `shadows` | `boolean` | `true` | Mostrar fades en los bordes del contenedor |
| `fadeBg` | `string` | `null` | Color del fade. Usar cuando el contenedor no está sobre `--mts-bg-body`. Ej: `'var(--mts-bg-surface)'` |
| `fadeSize` | `string` | `null` | Tamaño del fade en CSS. Ej: `'60px'` |
| `threshold` | `number` | `24` | Distancia en px desde el borde para disparar `onReachStart` / `onReachEnd` |
| `onScroll` | `function` | `null` | `({ scrollTop, scrollLeft, percent }) => {}` |
| `onReachStart` | `function` | `null` | Se dispara al llegar al inicio |
| `onReachEnd` | `function` | `null` | Se dispara al llegar al final |

## API

```js
const scroll = new MTS.Scroll('#el', { direction: 'vertical' });

scroll.scrollTo(200)        // mueve a 200px (smooth por default)
scroll.scrollTo(200, false) // mueve a 200px sin animación
scroll.scrollToStart()      // mueve al inicio
scroll.scrollToEnd()        // mueve al final
scroll.getScroll()          // → número de px actuales
scroll.getPercent()         // → porcentaje 0–100
scroll.update()             // recalcula fades (si el contenido cambió dinámicamente)
scroll.destroy()            // elimina el componente y restaura el DOM original
```

## Personalizar el scrollbar vía CSS

El componente expone variables CSS sobrescribibles por elemento:

```css
#mi-scroll {
  --mts-scroll-thumb-color: var(--mts-color-primary);
  --mts-scroll-thumb-hover: var(--mts-color-accent);
  --mts-scroll-bar-size: 6px;
  --mts-scroll-fade-size: 60px;
  --mts-scroll-fade-bg: var(--mts-bg-surface);
}
```

| Variable | Default | Descripción |
|----------|---------|-------------|
| `--mts-scroll-thumb-color` | `var(--mts-border-color)` | Color del thumb del scrollbar |
| `--mts-scroll-thumb-hover` | `var(--mts-color-primary)` | Color del thumb al hover |
| `--mts-scroll-bar-size` | `4px` | Ancho/alto del scrollbar |
| `--mts-scroll-fade-size` | `40px` | Alto/ancho de los fades |
| `--mts-scroll-fade-bg` | `var(--mts-bg-body)` | Color base del gradiente de fade |

## Notas

- El contenedor **necesita altura fija** (`height`, `max-height`, o `flex:1` en un padre flex) para que el scroll funcione.
- Para contenedores sobre `mts-surface` o `mts-surface-2`, pasar `fadeBg: 'var(--mts-bg-surface)'` o el equivalente para que el fade no se vea mal.
- `onReachEnd` es ideal como trigger para infinite scroll — combinable con `MTS.Infinite`.
- `update()` es necesario si el contenido crece dinámicamente después de la inicialización.
