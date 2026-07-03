# MTS.Infinite

Infinite scroll driven by an `IntersectionObserver` — vertical, grid and table layouts. The component does **not** fetch: the developer supplies data through the overridable `onLoadMore` hook.

---

## Installation

```html
<link rel="stylesheet" href="data/matios-ui-infinite/matios-ui-infinite.css">
<script src="data/matios-ui-infinite/matios-ui-infinite.js"></script>

<!-- Optional: HTML sanitizer. When present, string output from renderItem
     and the empty-state icon are passed through MTS.Sanitize.html() -->
<script src="utilities/matios-ui-sanitize/matios-ui-sanitize.js"></script>

<!-- Optional: i18n for the component chrome + demo strings (see the i18n section) -->
<script src="base/matios-ui-i18n.js"></script>
<script src="data/matios-ui-infinite/matios-ui-infinite-i18n.js"></script>
```

---

## Usage

```js
const list = new MTS.Infinite('#my-list', {
  pageSize: 12,
  layout: 'vertical',
  onLoadMore: function (opts) {
    return fetch('/api/items?page=' + opts.page + '&pageSize=' + opts.pageSize)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        return { items: data.items, hasMore: data.hasNext };
      });
  },
  renderItem: function (item, index) {
    return '<div class="card">#' + (index + 1) + ' ' + item.title + '</div>';
  },
  onLoad: function (e) { console.log('page', e.detail.page, e.detail.items.length); },
  onEnd:  function (e) { console.log('total', e.detail.total); },
  onError: function (e) { console.error(e.detail.error); },
});
```

The container must be scrollable (or shorter than its content) for the observer to fire. The sentinel sits after the list; when it scrolls into view and there is more data, `onLoadMore` is called for the next page.

---

## Options

Passed as the second constructor argument. Merged over the defaults below.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onLoadMore` | `function` | `null` | `async ({ page, pageSize }) → { items, hasMore }`. The data loader. Nothing loads without it. See [Data contract](#data-contract) |
| `renderItem` | `function` | `null` | `(item, index) → HTMLString \| HTMLElement`. When omitted, each item is rendered as `JSON.stringify(item)` text |
| `pageSize` | `number` | `20` | Records requested per load; passed to `onLoadMore` |
| `layout` | `string` | `'vertical'` | `'vertical'` \| `'grid'` \| `'table'`. Applied as the `mts-infinite__list--<layout>` modifier class |
| `threshold` | `number` | `0.1` | `IntersectionObserver` threshold for the sentinel |
| `loaderText` | `string` | i18n `MTS.Infinite.loaderText` | Text shown in the loader while a page loads. Defaults to the active-language string; pass to override |
| `endText` | `string` | i18n `MTS.Infinite.endText` | Text shown once all data has loaded. Defaults to the active-language string; pass to override |
| `animate` | `boolean` | `true` | Adds the `mts-infinite__item--entering` class to each appended item |
| `emptyState` | `object` | i18n `{ icon: '📭', title, message }` | Empty-state shown when page 1 returns zero items. Keys: `icon`, `title`, `message`; `title`/`message` default to the active-language `emptyTitle`/`emptyMessage` |
| `onLoad` | `function` | — | Shorthand for `on('load', fn)`. See [Events](#events) |
| `onError` | `function` | — | Shorthand for `on('error', fn)` |
| `onEnd` | `function` | — | Shorthand for `on('end', fn)` |

> `loaderText`, `endText` and the empty-state `title`/`message` default to the **active language** (namespace `MTS.Infinite`) — set it once with `MTS.setLanguage(...)`. Passing the option overrides the localized default for that instance. See [i18n](#i18n).

---

## Data contract

`onLoadMore` is the single overridable async hook. The component calls it with the current pagination and expects a result object:

```js
onLoadMore: function (opts) {
  // opts.page      → 1-based page number (starts at 1, auto-increments)
  // opts.pageSize  → the configured pageSize option
  return Promise.resolve({
    items:   [ /* … the records to render this page … */ ],
    hasMore: true,   // false signals end-of-data
  });
}
```

**Argument** — an object `{ page, pageSize }`.

**Return** — a `Promise` (or value) resolving to:

- `items` — the array of records for this page. Each is passed to `renderItem`.
- `hasMore` — `boolean`. **This is how end-of-data is signalled.** When `false`, the observer stops observing the sentinel, the end message is shown (if any items were loaded) and the `end` event fires.

**Shorthand / fallbacks handled by the code:**

- Returning a **bare array** instead of `{ items, hasMore }` is accepted — the array is treated as `items`.
- If `hasMore` is omitted, it is inferred as `items.length >= pageSize` (a short page ends the list).
- If **page 1** resolves to an empty `items` array, the empty-state is shown instead of the end message.
- If `onLoadMore` throws / rejects, the loader is hidden, an inline error with a **Retry** button is shown, and the `error` event fires. Retrying re-runs `onLoadMore` for the same page.

---

## Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `reset()` | `this` | Clear the list, reset to page 1, re-attach the observer and reload |
| `appendItems(items)` | `this` | Render an array of items directly, bypassing `onLoadMore`; bumps the loaded count |
| `getCount()` | `number` | Total items loaded so far |
| `pause()` | `this` | Stop observing the sentinel (suspends auto-loading) |
| `resume()` | `this` | Resume observing the sentinel (only if `hasMore` is still `true`) |
| `on(event, fn)` | `this` | Register a listener for `'load'` \| `'end'` \| `'error'` |
| `destroy()` | `undefined` | Disconnect the observer and empty the container |

```js
const list = new MTS.Infinite('#my-list', {
  onLoadMore: function (opts) { return loadPage(opts.page, opts.pageSize); },
  renderItem: function (item) { return '<div class="card">' + item.title + '</div>'; },
});

list.on('load', function (e) { console.log(e.detail.items); });
list.appendItems([{ title: 'Pinned' }]);
console.log(list.getCount());
list.pause();
list.resume();
list.reset();
```

There is no `loadMore()` or `off()` method.

---

## Events

Registered with `on(event, fn)` (or the `onLoad` / `onEnd` / `onError` option shorthands). Each also dispatches a bubbling `CustomEvent` on the container element. Handlers receive `{ type, detail }` (option/`on` form) or a `CustomEvent` whose `detail` holds the payload (DOM form).

| Event | `on()` name | DOM event | `detail` payload |
|-------|-------------|-----------|------------------|
| Load | `'load'` | `mts:infinite:load` | `{ items, page, total }` |
| End | `'end'` | `mts:infinite:end` | `{ total }` |
| Error | `'error'` | `mts:infinite:error` | `{ error }` |

- `load` fires after every successful page load; `page` is the page that was just loaded.
- `end` fires once, when `hasMore` becomes `false`.
- `error` fires when `onLoadMore` rejects.

```js
el.addEventListener('mts:infinite:load', function (e) {
  console.log(e.detail.page, e.detail.items, e.detail.total);
});
```

---

## i18n

Language is **global** — one setting drives the chrome of every MTS component on the page. There is **no** per-instance `locale` option.

The component localizes its own chrome: `loaderText`, `endText` and the empty-state `title`/`message` are read from the **`'MTS.Infinite'`** namespace of the active language (via `MTS.getString()` / `MTS.getLanguage()`), with a Spanish literal fallback when the i18n script isn't loaded and a per-instance option override. The `matios-ui-infinite-i18n.js` file also registers the strings the **demo** page uses (under `MTS.Infinite.demo`).

Load the two optional scripts (see [Installation](#installation)) and set the language **once at startup**:

```html
<script src="base/matios-ui-i18n.js"></script>
<script src="data/matios-ui-infinite/matios-ui-infinite-i18n.js"></script>
<script>
MTS.setLanguage('en');   // 'es' (default) | 'en' | 'pt' | any registered code
</script>
```

Read the active strings with `MTS.getString()` (returns the whole table for the active language) and the active code with `MTS.getLanguage()`:

```js
const strings = MTS.getString()['MTS.Infinite'];
console.log(strings.demo.subtitle);
console.log(MTS.getLanguage());   // 'en'
```

**Per-instance override:** the `loaderText`, `endText` and `emptyState` (`{ icon, title, message }`) options override the active-language chrome for that instance:

```js
new MTS.Infinite(el, { onLoadMore, loaderText: 'Loading more…', endText: 'That is everything' });
```

Bundled languages: `es`, `en`, `pt`.

---

## Notes

- `renderItem` may return an HTML **string** or a DOM **`HTMLElement`**. When a string is returned and `MTS.Sanitize` is loaded, it is passed through `MTS.Sanitize.html()`; still sanitize any user-supplied HTML yourself.
- `layout: 'grid'` applies a CSS grid to the list; `layout: 'table'` expects the container to behave as table body markup.
- The observer disconnects automatically once `hasMore` is `false`; `reset()` re-attaches it.

---

## Accessibility

- Surface the loading and end-of-list states (e.g. `aria-busy`) so assistive tech knows when more content is coming.
- The scrollable container should be keyboard-reachable; provide a manual control that calls `reset()` (or paginated navigation) as a fallback for users who cannot scroll-trigger the observer.
