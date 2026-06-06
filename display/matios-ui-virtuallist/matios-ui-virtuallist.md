# MTS.VirtualList

Virtualized list that renders only the visible items — handles 100,000+ rows with minimal DOM. Supports infinite scroll via `onEndReached`.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<script src="matios-ui-virtuallist.js"></script>
```

---

## Usage

```js
// 100,000 items
new MTS.VirtualList('#my-list', {
  items:      Array.from({ length: 100000 }, function (_, i) { return { id: i, name: 'Item ' + i }; }),
  itemHeight: 52,
  height:     500,
  renderItem: function (item, index) {
    const el = document.createElement('div');
    el.className = 'my-row';
    el.innerHTML = '<span>#' + (index + 1) + '</span><span>' + item.name + '</span>';
    return el;
  },
  onScroll: function (e) { console.log('visible:', e.detail.firstVisible, '-', e.detail.lastVisible); },
});

// Infinite scroll
const list = new MTS.VirtualList('#my-list', {
  items:      initialItems,
  renderItem: function (item) { return '<div class="row">' + item.title + '</div>'; },
  onEndReached: async function (e) {
    const more = await fetchPage(page++);
    list.appendItems(more);
  },
});
```

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `array` | `[]` | Data array |
| `renderItem` | `function` | — | Item renderer — `(item, index) → HTMLElement \| string` |
| `itemHeight` | `number` | `48` | Fixed item height in px |
| `height` | `number` | `400` | Container height in px |
| `buffer` | `number` | `5` | Extra items rendered above/below the viewport |
| `endThreshold` | `number` | `100` | Distance in px from the bottom to fire `onEndReached` |
| `onScroll` | `function` | — | Fires on scroll — `({ scrollTop, firstVisible, lastVisible })` |
| `onEndReached` | `function` | — | Fires near the scroll end — `({ total })` |

---

## API

| Method | Description |
|--------|-------------|
| `setItems(array)` | Replace the items |
| `appendItems(array)` | Append items (infinite scroll) |
| `scrollToIndex(i)` | Scroll to a given index |
| `getVisibleRange()` | Returns `{ first, last }` |
| `on(event, cb)` / `off(event, cb)` | Register / remove listeners (`'scroll'`, `'endReached'`) |
| `destroy()` | Remove listeners and clear the DOM |

```js
const list = new MTS.VirtualList('#my-list', { items: [/* … */] });
list.scrollToIndex(500);
list.on('endReached', function (e) { console.log(e.detail.total); });
```

---

## Events

| Method | Payload | When |
|--------|---------|------|
| `onScroll(fn)` / `on('scroll', fn)` | `{ scrollTop, firstVisible, lastVisible }` | On scroll |
| `onEndReached(fn)` / `on('endReached', fn)` | `{ total }` | Scroll reaches near the end |

Also dispatched as DOM events:

```js
el.addEventListener('mts:virtuallist:scroll',     function (e) { console.log(e.detail); });
el.addEventListener('mts:virtuallist:endReached', function (e) { console.log(e.detail.total); });
```

---

## Accessibility

- Only visible rows exist in the DOM, so assistive tech sees a windowed subset. For long lists where full
  navigation matters, expose `total` and the visible range, or pair with a non-virtualized fallback.
- Keep `itemHeight` accurate — a mismatch breaks scroll position mapping and `scrollToIndex`.

---

## Changelog

### Initial
- Virtualized list (fixed row height, configurable buffer), infinite scroll via `onEndReached`, `scrollToIndex`,
  `getVisibleRange`, and `setItems` / `appendItems`.
