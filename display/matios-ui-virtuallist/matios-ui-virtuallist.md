# MTS.VirtualList

🇬🇧 Virtualized list that renders only visible items — handles 100,000+ rows with minimal DOM. Supports infinite scroll via `onEndReached`.
🇪🇸 Lista virtualizada que solo renderiza los ítems visibles — maneja 100,000+ filas con DOM mínimo. Soporta scroll infinito con `onEndReached`.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<script src="matios-ui-virtuallist.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | 🇬🇧 Description / 🇪🇸 Descripción |
|--------|------|---------|--------------------------------------|
| `items` | `array` | `[]` | 🇬🇧 Data array / 🇪🇸 Array de datos |
| `renderItem` | `function` | — | 🇬🇧 `(item, index) => HTMLElement\|string` Item renderer / 🇪🇸 Renderizador de ítems |
| `itemHeight` | `number` | `48` | 🇬🇧 Fixed item height in px / 🇪🇸 Altura fija del ítem en px |
| `height` | `number` | `400` | 🇬🇧 Container height in px / 🇪🇸 Altura del contenedor en px |
| `buffer` | `number` | `5` | 🇬🇧 Extra items to render above/below / 🇪🇸 Ítems extra a renderizar arriba/abajo |
| `endThreshold` | `number` | `100` | 🇬🇧 px from bottom to fire `onEndReached` / 🇪🇸 px desde el fondo para disparar `onEndReached` |
| `onScroll` | `function` | — | 🇬🇧 `({ scrollTop, firstVisible, lastVisible }) => {}` / 🇪🇸 Se dispara al hacer scroll |
| `onEndReached` | `function` | — | 🇬🇧 `({ total }) => {}` Fires near scroll end / 🇪🇸 Se dispara cerca del final del scroll |

---

## Events / Eventos

```js
new MTS.VirtualList('#my-list', {
  items:      bigArray,
  renderItem: (item, i) => `<div>${i}: ${item.name}</div>`,
  // Fires on scroll / Se dispara al hacer scroll
  onScroll: (e) => {
    console.log(e.detail.scrollTop);     // → px scrolled
    console.log(e.detail.firstVisible);  // → first visible index
    console.log(e.detail.lastVisible);   // → last visible index
  },
  // Fires when near the end — for infinite scroll / Se dispara cerca del final
  onEndReached: (e) => {
    console.log(e.detail.total); // → current item count
    loadMoreItems();
  },
});
```

---

## JavaScript Usage / Uso JavaScript

```js
// 100,000 items / 100,000 ítems
new MTS.VirtualList('#my-list', {
  items:      Array.from({ length: 100000 }, (_, i) => ({ id: i, name: `Item ${i}` })),
  itemHeight: 52,
  height:     500,
  renderItem: (item, index) => {
    const el = document.createElement('div');
    el.className = 'my-row';
    el.innerHTML = `<span>#${index + 1}</span><span>${item.name}</span>`;
    return el;
  },
  onScroll: (e) => console.log('visible:', e.detail.firstVisible, '-', e.detail.lastVisible),
});

// Infinite scroll / Scroll infinito
const list = new MTS.VirtualList('#my-list', {
  items:      initialItems,
  renderItem: (item) => `<div class="row">${item.title}</div>`,
  // Fires when near the end / Se dispara cerca del final del scroll
  onEndReached: async (e) => {
    const more = await fetchPage(page++);
    list.appendItems(more);
  },
});
```

---

## API

```js
const list = new MTS.VirtualList('#my-list', { items: [...] });

// Replace items / Reemplazar ítems
list.setItems([...])

// Append items (infinite scroll) / Agregar ítems al final
list.appendItems([...])

// Scroll to index / Hacer scroll a un índice
list.scrollToIndex(500)

// Get visible range / Obtener rango visible
list.getVisibleRange()  // → { first: 0, last: 10 }

// Register listeners / Registrar listeners
list.on('scroll',     (e) => console.log(e.detail.firstVisible))
list.on('endReached', (e) => console.log(e.detail.total))
list.off('scroll',    handler)

// Destroy / Destruir
list.destroy()
```

---

## DOM Events / Eventos DOM

```js
el.addEventListener('mts:virtuallist:scroll',     (e) => console.log(e.detail));
el.addEventListener('mts:virtuallist:endReached',  (e) => console.log(e.detail.total));
```

---
