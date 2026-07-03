# MTS.DevPanel

Generic developer panel for any component. It wraps a target element with up to three collapsible panels:

- **Config** (left) — auto-generated from the watched component's `getConfig()`.
- **Code** (right) — auto-generated from the watched component's `getCode()`.
- **Log** (bottom) — activity log, auto-subscribed to the component events listed in `events`.

Designed for demos, QA and live debugging.

---

## Installation

```html
<link rel="stylesheet" href="utilities/matios-ui-devpanel/matios-ui-devpanel.css">
<script src="utilities/matios-ui-devpanel/matios-ui-devpanel-i18n.js"></script>
<script src="utilities/matios-ui-devpanel/matios-ui-devpanel.js"></script>
```

`MTS.Splitter` (optional) is used to make the panels resizable, and `MTS.Icon` (optional) is used for the header icons. Load them before this component if you want those features; the panel degrades gracefully without them.

---

## Usage

```js
const panel = new MTS.DevPanel('#my-component', {
  enabled: true,
  watch:   myComponentInstance,
  panels:  ['config', 'log', 'code'],
  events:  [
    {
      name:    'eventClick',
      badge:   'click',
      label:   'onEventClick',
      payload: function(d) { return d.event && d.event.title; }
    }
  ]
});

panel.log('click', 'Something happened', 'extra detail');
panel.clearLog();
panel.refreshCode();
```

The constructor accepts a CSS selector string or an element as the first argument. That element (the target component's host) is moved into the center of the panel; the panel is inserted right after where the target used to be.

---

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `enabled` | `boolean` | `true` | `false` = full no-op; the target element is left untouched |
| `watch` | `object` | `null` | Component instance — `getConfig()`, `getCode()` and `on()` are read from it |
| `panels` | `string[]` | `['config', 'log', 'code']` | Which panels to render. Any subset of `'config'`, `'log'`, `'code'` |
| `events` | `array` | `[]` | Component events to auto-log (see below) |

### Shape of each entry in `events[]`

| Field | Type | Description |
|---|---|---|
| `name` | `string` | The component event name subscribed via `watch.on(name, fn)` |
| `badge` | `string` | Badge text shown in the log row. Falls back to `'event'` if omitted |
| `label` | `string` | Message text in the log row. Falls back to `name` if omitted |
| `payload` | `function(data)` | Receives the event detail (`e.detail` if present, otherwise `e`) and returns the string shown in the detail cell. Errors thrown inside are swallowed |

Events are only subscribed when the watched component exposes an `on(name, fn)` method.

---

## API

| Method | Description |
|---|---|
| `log(badge, message, detail?)` | Prepends a timestamped row to the log. Keeps at most 200 rows (oldest are dropped) |
| `clearLog()` | Empties the log and resets the counter to `0` |
| `refreshCode()` | Calls `watch.getCode()` and repaints the Code panel. Auto-expands the Code panel the first time it receives content |
| `destroy()` | Detaches all subscribed listeners and restores the original target element in the DOM |

---

## Watched-component contract

`getConfig()` and `getCode()` are the core contract of this component. Both are optional on the watched instance; whatever is missing is simply skipped.

### `getConfig()`

Returns an **array of control descriptors**. The panel groups them by `group`, then renders one control per item and calls `apply` on every change.

| Field | Type | Description |
|---|---|---|
| `group` | `string` | Section header the control is placed under. Defaults to `'General'` |
| `key` | `string` | Stable identifier, written to the control's `data-key` attribute |
| `type` | `string` | Control kind: `'toggle'`, `'select'`, `'time'` or `'number'` |
| `label` | `string` | Visible label |
| `value` | `any` | Current value — pre-selects / pre-fills the control |
| `options` | `array` | For `type: 'select'` only. Array of `{ value, label }` objects |
| `description` | `string` | Optional. Set as the row's `title` (hover tooltip) |
| `apply` | `function(value, instance)` | Called on change with the new value and the watched instance. After it runs, the panel calls `refreshCode()` |

Value passed to `apply` by control type:

| `type` | Value passed to `apply` |
|---|---|
| `toggle` | `boolean` (the new on/off state) |
| `select` | `string` (the selected option value) |
| `time` | `string` (raw text, placeholder `HH:MM`) |
| `number` | `number` (parsed with `parseInt`) |

```js
// Example getConfig() on a component
MyComponent.prototype.getConfig = function() {
  return [
    {
      group:   'Appearance',
      key:     'variant',
      type:    'select',
      label:   'Variant',
      value:   this.variant,
      options: [
        { value: 'primary', label: 'Primary' },
        { value: 'success', label: 'Success' },
        { value: 'danger',  label: 'Danger' }
      ],
      apply:   function(value, instance) { instance.setVariant(value); }
    },
    {
      group:   'Behavior',
      key:     'compact',
      type:    'toggle',
      label:   'Compact',
      value:   this.compact,
      apply:   function(value, instance) { instance.setCompact(value); }
    }
  ];
};
```

### `getCode()`

Returns a **string** of JavaScript representing the component's current configuration. The panel syntax-highlights it and shows it in the Code panel; a copy button copies the rendered text to the clipboard.

```js
MyComponent.prototype.getCode = function() {
  return 'new MyComponent("#host", { variant: "' + this.variant + '" });';
};
```

---

## i18n

Chrome text (panel titles and the log **Clear** button) is read from `MTS.getString()['MTS.DevPanel']`. Set the language once at startup:

```js
MTS.setLanguage('en');
```

There is no per-instance `locale` option. Bundled languages: `es`, `en`, `pt`. Override or add one with `MTS.registerLocale`:

```js
MTS.registerLocale('en', {
  'MTS.DevPanel': {
    configTitle: 'Config',
    codeTitle:   'JavaScript',
    logTitle:    'Activity Log',
    clear:       'Clear'
  }
});
```

| Key | Purpose |
|---|---|
| `configTitle` | Header of the Config panel |
| `codeTitle` | Header of the Code panel |
| `logTitle` | Label of the Activity Log |
| `clear` | Text of the log's clear button |

---

## Notes

- `enabled: false` is a full no-op — the target element is left untouched, useful to keep the panel wired in code but off in production.
- The Code panel starts collapsed and auto-expands the first time `getCode()` returns content.
- The log keeps at most 200 rows in memory; older rows are removed automatically.
- Event badges are rendered with the CSS class `dp-log__badge--<badge>`, so custom badge names can be themed via CSS.
