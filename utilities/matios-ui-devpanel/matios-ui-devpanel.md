# MTS.DevPanel

Generic development panel for any component. Wraps an element with three collapsible panels: Config (left), Code (right) and Log (bottom). Designed for demos, QA and live debugging.

---

## Installation

```html
<link rel="stylesheet" href="utilities/matios-ui-devpanel/matios-ui-devpanel.css">
<script src="utilities/matios-ui-devpanel/matios-ui-devpanel.js"></script>
```

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
    },
  ],
});

panel.log('click', 'Something happened', 'extra detail');
panel.clearLog();
panel.refreshCode();
```

---

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `enabled` | `boolean` | `true` | `false` = no-op, the component is left untouched |
| `watch` | `object` | `null` | Component instance — `getConfig()` and `getCode()` are read from it |
| `panels` | `string[]` | `['config', 'log', 'code']` | Panels to show |
| `events` | `array` | `[]` | Events to auto-log (see below) |

### Shape of each entry in `events[]`

| Field | Type | Description |
|---|---|---|
| `name` | `string` | The component event name (e.g. `'eventClick'`) |
| `badge` | `string` | Badge label in the log (e.g. `'click'`) |
| `label` | `string` | Descriptive text in the log |
| `payload` | `function(data)` | Extracts the detail to show from the event payload |

---

## API

| Method | Description |
|---|---|
| `log(badge, message, detail?)` | Adds a timestamped entry to the log. Keeps a maximum of 200 rows. |
| `clearLog()` | Clears the log and resets the counter |
| `refreshCode()` | Calls `watch.getCode()` and updates the Code panel |
| `destroy()` | Disconnects all listeners and restores the original element in the DOM |

---

## Watched-component contract

The component passed in `watch` may optionally implement:

| Method | Returns | Description |
|---|---|---|
| `getConfig()` | `array` | Interactive configuration items. Each item: `{ key, type, label, value, options?, apply }` |
| `getCode()` | `string` | JS code representing the component's current configuration |

```js
// Example getConfig() in a component
MyComponent.prototype.getConfig = function() {
  return [
    {
      key:     'variant',
      type:    'select',
      label:   'Variant',
      value:   this.variant,
      options: ['primary', 'success', 'danger'],
      apply:   function(val) { this.setVariant(val); }.bind(this)
    }
  ];
};

MyComponent.prototype.getCode = function() {
  return 'new MyComponent("#host", { variant: "' + this.variant + '" });';
};
```

---

## Notes

- `enabled: false` is a full no-op — the target component is left untouched, useful to toggle the panel in production without changing any other code.
- The Code panel auto-expands the first time it receives content from `getCode()`.
- The log keeps a maximum of 200 rows in memory — the oldest ones are removed automatically.

---

## Changelog

### Initial
- Documentation created from scratch (standard template).
