# MTS.Chart — Flow / Topology (Sankey · Network)

Sankey diagrams with Bézier flows and network graphs with Verlet force simulation. Pure SVG.

---

## Installation

```html
<link rel="stylesheet" href="matios-ui-chart.css">
<script src="matios-ui-chart.js"></script>
<script src="matios-ui-chart-flow.js"></script>
```

---

## Types

| Class | Description |
|-------|-------------|
| `MTS.ChartSankey` | Nodes + flows with proportional width, Bézier curves |
| `MTS.ChartNetwork` | Graphs with physics simulation (Verlet integration) |

---

## Sankey — Data

```js
data: {
  nodes: [
    { id: 'a', label: 'Source A', color: '#1d4ed8' },
    { id: 'b', label: 'Target B', color: '#10b981' },
  ],
  links: [
    { source: 'a', target: 'b', value: 150 },
  ],
}
```

---

## Sankey — Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | `340` | SVG height in px |
| `nodeWidth` | `number` | `16` | Node rectangle width in px |
| `nodePadding` | `number` | `12` | Vertical spacing between nodes in px |
| `linkOpacity` | `number` | `0.45` | Opacity of the flows |
| `animate` | `boolean` | `true` | Fade-in of nodes and flows |
| `formatter` | `function` | — | Formats values in tooltip |
| `margin` | `object` | — | `{ top, right, bottom, left }` |

**onClick** (node) — emits `{ id, label, value, color }`.

---

## Network — Data

```js
data: {
  nodes: [
    { id: 'hub',    label: 'Hub',    color: '#1d4ed8', size: 3.0 },
    { id: 'leaf1',  label: 'Leaf 1', color: '#10b981', size: 1.0 },
  ],
  links: [
    { source: 'hub', target: 'leaf1', value: 2 },
  ],
}
```

`size` controls the node radius (radius = `nodeRadius * √size`).

---

## Network — Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | `380` | SVG height in px |
| `nodeRadius` | `number` | `18` | Base node radius in px |
| `repulsion` | `number` | `4000` | Repulsion force between nodes |
| `springK` | `number` | `0.04` | Stiffness of the links |
| `springLen` | `number` | `120` | Natural link length in px |
| `iterations` | `number` | `180` | Simulation frames before settling |
| `animate` | `boolean` | `true` | Force simulation animation |

**onClick** (node) — emits `{ id, label, size, color }`.

---

## Events

```js
const sankey = new MTS.ChartSankey('#flow', { data, options });

sankey.onClick(function (e) {
  console.log(e.id);     // id of the clicked node
  console.log(e.label);  // label
  console.log(e.value);  // total flow of the node
  console.log(e.color);  // node color
});

const net = new MTS.ChartNetwork('#graph', { data, options });

net.onClick(function (e) {
  console.log(e.id);    // node id
  console.log(e.label); // label
  console.log(e.size);  // relative size
  console.log(e.color); // node color
});
```

---

## Example

```js
new MTS.ChartNetwork('#dependencies', {
  data: {
    nodes: [
      { id: 'app',  label: 'app',  size: 3, color: '#1d4ed8' },
      { id: 'api',  label: 'api',  size: 2, color: '#cc0000' },
      { id: 'auth', label: 'auth', size: 1.5, color: '#f59e0b' },
    ],
    links: [
      { source: 'app', target: 'api',  value: 3 },
      { source: 'api', target: 'auth', value: 2 },
    ],
  },
  options: { height: 380, repulsion: 5000, springLen: 140, animate: true },
});
```
