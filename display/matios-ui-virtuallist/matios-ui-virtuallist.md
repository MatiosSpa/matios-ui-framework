# MTS.VirtualList

Virtualized list that renders only the visible items — handles 100,000+ rows with minimal DOM. Supports infinite scroll via `onEndReached`.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-virtuallist.css">
<script src="matios-ui-virtuallist.js"></script>
```

If a `renderItem` returns an HTML string, `MTS.Sanitize` (from `matios-ui-sanitize.js`) is used to sanitize it when present — load it to enable sanitization.

---

## Usage

```js
// 100,000 items
const list = new MTS.VirtualList('#my-list', {
  items: Array.from({ length: 100000 }, function (_, i) {
    return { id: i, name: 'Item ' + i };
  }),
  itemHeight: 52,
  height: 500,
  renderItem: function (item, index) {
    const el = document.createElement('div');
    el.className = 'my-row';
    el.innerHTML = '<span>#' + (index + 1) + '</span><span>' + item.name + '</span>';
    return el;
  },
  onScroll: function (e) {
    console.log('visible:', e.detail.firstVisible, '-', e.detail.lastVisible);
  }
});

list.scrollToIndex(50000);
```

```js
// Infinite scroll
let page = 1;
const list = new MTS.VirtualList('#my-list', {
  items: fetchPage(page++),
  itemHeight: 56,
  height: 400,
  endThreshold: 150,
  renderItem: function (item) {
    return '<div class="row">' + item.title + '</div>';
  },
  onEndReached: function (e) {
    const more = fetchPage(page++);
    list.appendItems(more);
  }
});
```

The first argument is a CSS selector string or an `Element`. If it resolves to nothing, the constructor returns without building.

---

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `items` | `array` | `[]` | Data array (any element type) |
| `renderItem` | `function` | `String(item)` in a `<div>` | Item renderer — `(item, index)` returns `HTMLElement \| string`. A string is sanitized (when `MTS.Sanitize` is present) and its first element child is used |
| `itemHeight` | `number` | `48` | Fixed item height in px. Every row is forced to this height |
| `height` | `number` | `400` | Scroll container height in px |
| `buffer` | `number` | `5` | Extra items rendered above and below the viewport |
| `endThreshold` | `number` | `100` | Distance in px from the bottom at which `onEndReached` fires |
| `onScroll` | `function` | — | Registered as an `'scroll'` listener — `({ scrollTop, firstVisible, lastVisible })` |
| `onEndReached` | `function` | — | Registered as an `'endReached'` listener — `({ total })` |

There is no variable / dynamic row-height mode — `itemHeight` is fixed and used for all layout math.

---

## API

| Method | Description |
|--------|-------------|
| `setItems(array)` | Replace the items and re-render (resets the `endReached` guard) |
| `appendItems(array)` | Append items and re-render (infinite scroll; resets the `endReached` guard) |
| `scrollTo(index)` | Scroll so the given index is at the top |
| `scrollToIndex(index)` | Alias of `scrollTo(index)` |
| `scrollToTop()` | Scroll back to the top |
| `getVisibleRange()` | Returns `{ first, last }` (buffer-inclusive index range) |
| `on(event, cb)` | Register a listener (`'scroll'`, `'endReached'`) |
| `off(event, cb)` | Remove a listener |
| `destroy()` | Clear the container DOM |

`setItems`, `appendItems`, `scrollTo`, `scrollToIndex`, `scrollToTop`, `on`, and `off` return the instance for chaining.

```js
const list = new MTS.VirtualList('#my-list', { items: [/* … */] });
list.scrollToIndex(500);
list.on('endReached', function (e) { console.log(e.detail.total); });
```

---

## Events

| Event | Payload | When |
|-------|---------|------|
| `scroll` | `{ scrollTop, firstVisible, lastVisible }` | On every scroll |
| `endReached` | `{ total }` | Scroll reaches within `endThreshold` px of the bottom (fires once until items change) |

Listeners registered through `onScroll` / `onEndReached` options, or via `on('scroll', fn)` / `on('endReached', fn)`, receive `{ type, detail }`.

Each event is also dispatched as a bubbling DOM `CustomEvent` on the container, with the payload in `event.detail`:

```js
el.addEventListener('mts:virtuallist:scroll', function (e) {
  console.log(e.detail);
});
el.addEventListener('mts:virtuallist:endReached', function (e) {
  console.log(e.detail.total);
});
```

---

## i18n

The component renders no built-in chrome text — every row comes from your `renderItem`, so there is nothing to translate at runtime. The bundled `matios-ui-virtuallist-i18n.js` only holds strings for the demo page under the `MTS.VirtualList` namespace.

Language is set once, globally, at startup:

```js
MTS.setLanguage('en'); // 'es' | 'en' | 'pt'
```

There is no per-instance `locale` option.

---

## Accessibility

- Only visible rows exist in the DOM, so assistive tech sees a windowed subset. For long lists where full
  navigation matters, expose `total` and the visible range, or pair with a non-virtualized fallback.
- Keep `itemHeight` accurate — a mismatch breaks scroll position mapping and `scrollToIndex`.
