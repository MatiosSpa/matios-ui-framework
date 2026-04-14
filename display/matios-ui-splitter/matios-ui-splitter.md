# MTS.Splitter

[EN] Resizable split pane — horizontal or vertical, min/max sizes, collapsible panels with double click.
[ES] Panel divisor redimensionable — horizontal o vertical, tamaños mín/máx, paneles colapsables con doble click.

---

## Installation / Instalación

```html
<link rel="stylesheet" href="matios-ui-base.css">
<link rel="stylesheet" href="matios-ui-splitter.css">
<script src="matios-ui-splitter.js"></script>
```

---

## Options / Opciones

| Option | Type | Default | [EN] Description / [ES] Descripción |
|--------|------|---------|--------------------------------------|
| `direction` | `string` | `'horizontal'` | `'horizontal'` · `'vertical'` |
| `initialSize` | `number` | `50` | [EN] Initial first panel size in % / [ES] Tamaño inicial del primer panel en % |
| `minSize` | `number` | `10` | [EN] Minimum size in % / [ES] Tamaño mínimo en % |
| `maxSize` | `number` | `90` | [EN] Maximum size in % / [ES] Tamaño máximo en % |
| `collapsible` | `boolean` | `false` | [EN] Allow collapse/expand with double click / [ES] Colapsar/expandir con doble click |
| `gutterSize` | `string` | `'6px'` | [EN] Handle width/height / [ES] Ancho/alto del divisor |
| `onChange` | `function` | — | [EN] `({ sizes, firstSize, secondSize }) => {}` Fires while dragging / [ES] Se dispara al arrastrar |
| `onDragStart` | `function` | — | [EN] Fires when drag starts / [ES] Se dispara al iniciar arrastre |
| `onDragEnd` | `function` | — | [EN] `({ sizes }) => {}` Fires when drag ends / [ES] Se dispara al terminar arrastre |

---

## Events / Eventos

```js
new MTS.Splitter('#my-splitter', {
  direction: 'horizontal',
  // Fires while dragging / Se dispara mientras se arrastra
  onChange: (e) => {
    console.log(e.detail.firstSize);  // → 42.5 (%)
    console.log(e.detail.secondSize); // → 57.5 (%)
    console.log(e.detail.sizes);      // → { firstSize, secondSize }
  },
  // Fires when drag starts / Se dispara al iniciar el arrastre
  onDragStart: (e) => console.log('drag started'),
  // Fires when drag ends / Se dispara al terminar el arrastre
  onDragEnd: (e) => {
    console.log(e.detail.firstSize);
    saveLayout(e.detail);
  },
});
```

---

## HTML Usage / Uso HTML

```html
<div id="my-splitter" style="height: 400px;">
  <div>Left panel content</div>
  <div>Right panel content</div>
</div>

<script>
  new MTS.Splitter('#my-splitter', {
    direction:   'horizontal',
    initialSize: 30,
    minSize:     20,
    maxSize:     80,
    collapsible: true,
    onChange: (e) =&gt; console.log(e.detail.firstSize),
  });
</script>
```

---

## JavaScript Usage / Uso JavaScript

```js
// Horizontal (default) / Horizontal (por defecto)
new MTS.Splitter('#my-splitter', {
  direction:   'horizontal',
  initialSize: 35,   // first panel starts at 35%
  minSize:     20,
  maxSize:     80,
  onChange:    (e) => updateEditorSize(e.detail.firstSize),
  onDragEnd:   (e) => saveLayout(e.detail),
});

// Vertical / Vertical
new MTS.Splitter('#my-splitter', {
  direction:   'vertical',
  initialSize: 60,
  collapsible: true,   // double click to collapse / doble click para colapsar
  gutterSize:  '8px',
  onChange:    (e) => console.log(e.detail.firstSize + '%'),
});
```

---

## API

```js
const sp = new MTS.Splitter('#my-splitter', { ... });

// Get current sizes / Obtener tamaños actuales
sp.getSizes()
// → { firstSize: 35, secondSize: 65 }

// Set size programmatically / Establecer tamaño programáticamente
sp.setSize(40)   // first panel = 40%

// Collapse / expand / Colapsar / expandir
sp.collapse()
sp.expand()

// Register listeners / Registrar listeners
sp.on('change',    (e) => console.log(e.detail.firstSize))
sp.on('dragstart', (e) => {})
sp.on('dragend',   (e) => saveLayout(e.detail))
sp.off('change',   handler)

// Destroy / Destruir
sp.destroy()
```

---

## DOM Events / Eventos DOM

```js
el.addEventListener('mts:splitter:change',    (e) => console.log(e.detail));
el.addEventListener('mts:splitter:dragstart', () => {});
el.addEventListener('mts:splitter:dragend',   (e) => console.log(e.detail));
```

---

## Changelog

| Version | Description |
|---------|-------------|
| 1.1.0 | [EN] Normalized to `.on()`, bilingual docs / [ES] Normalizado a `.on()`, docs bilingüe |
| 1.0.0 | [EN] Initial release — horizontal/vertical, collapsible, min/max / [ES] Versión inicial |
