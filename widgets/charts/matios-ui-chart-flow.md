# MTS.Chart — Flow / Topology (Sankey · Network)

Sankey diagrams with proportional Bézier flows and network graphs with a
force-directed (Verlet) simulation. Pure SVG, zero dependencies, XSS-safe
(all labels rendered via `textContent`).

Two classes ship in this file, both `extends MTS.Chart`:

| Class | Description |
|-------|-------------|
| `MTS.ChartSankey` | Nodes + flows with proportional width, Bézier curves |
| `MTS.ChartNetwork` | Graphs with force simulation (repulsion + springs + center gravity) |

Both inherit the base `MTS.Chart` API — see
[`matios-ui-chart.md`](matios-ui-chart.md) for the shared constructor, tooltip,
`on` / `onClick`, `update`, `destroy`, and the base `responsive` option. This
page documents only what is specific to Sankey and Network.

---

## Installation

Load the base `matios-ui-chart.js` first, then the flow file. The flow script
throws if `MTS.Chart` is not present.

```html
<link rel="stylesheet" href="matios-ui-chart.css">
<script src="matios-ui-chart.js"></script>
<script src="matios-ui-chart-flow.js"></script>
```

---

## MTS.ChartSankey

```js
new MTS.ChartSankey('#flow', {
  data:    { nodes, links },
  options: { /* see below */ },
});
```

Node columns (depths) are assigned automatically by BFS from the source nodes
(nodes with no incoming links start at depth 0). Node and link heights are
proportional to flow value, normalized per column. Nodes are drawn as rounded
rectangles; flows as filled Bézier ribbons colored by their source node.

### Sankey — Data

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

**Node fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | Unique node id; referenced by links |
| `label` | `string` | no | Display label. Falls back to `id` |
| `color` | `string` | no | Node fill. Falls back to the auto palette by index |

**Link fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | `string` | yes | Id of the origin node |
| `target` | `string` | yes | Id of the destination node |
| `value` | `number` | no | Flow magnitude. Falls back to `0` |

Links whose `source` or `target` is not a known node id are silently skipped.
Rendering is skipped entirely if there are no nodes or no links. A node's value
is `max(sum of outgoing, sum of incoming)`.

### Sankey — Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | `340` | SVG height in px |
| `nodeWidth` | `number` | `16` | Node rectangle width in px |
| `nodePadding` | `number` | `12` | Vertical gap between nodes in a column, in px |
| `linkOpacity` | `number` | `0.45` | Base opacity of the flow ribbons |
| `animate` | `boolean` | `true` | Fade nodes and flows in on render |
| `animateDuration` | `number` | `600` | Fade-in duration in ms (only when `animate` is on) |
| `margin` | `object` | `{ top: 16, right: 8, bottom: 16, left: 8 }` | Inner margins in px; each side falls back individually |

> The tooltip value formatter comes from the base `tooltip.formatter` option
> (see [`matios-ui-chart.md`](matios-ui-chart.md)); when absent, values use the
> default `1.2K` / `3.4M` compact format.

### Sankey — Behavior & events

- **Node hover** — tooltip shows the node `label` and its total value; the node
  rectangle dims to `opacity 0.75`.
- **Link (flow) hover** — tooltip shows `source label → target label` and the
  link `value`; the ribbon brightens to `min(1, linkOpacity + 0.3)`.
- **Node click** — emits `click` with `{ id, label, value, color }`. Clicking a
  flow ribbon does **not** emit an event.

```js
var sankey = new MTS.ChartSankey('#flow', { data: data, options: options });

sankey.onClick(function (e) {
  console.log(e.id);     // clicked node id
  console.log(e.label);  // node label
  console.log(e.value);  // node total value (max of in/out flow)
  console.log(e.color);  // node color
});
```

### Sankey — Example

```js
new MTS.ChartSankey('#chart', {
  data: {
    nodes: [
      { id: 'coal',    label: 'Coal'        },
      { id: 'gas',     label: 'Natural gas' },
      { id: 'nuclear', label: 'Nuclear'     },
      { id: 'elec',    label: 'Electricity' },
      { id: 'heat',    label: 'Heat'        },
      { id: 'indust',  label: 'Industry'    },
      { id: 'home',    label: 'Households'  },
    ],
    links: [
      { source: 'coal',    target: 'elec',   value: 280 },
      { source: 'coal',    target: 'heat',   value: 120 },
      { source: 'gas',     target: 'elec',   value: 200 },
      { source: 'gas',     target: 'heat',   value: 180 },
      { source: 'nuclear', target: 'elec',   value: 340 },
      { source: 'elec',    target: 'indust', value: 310 },
      { source: 'elec',    target: 'home',   value: 260 },
      { source: 'heat',    target: 'indust', value: 180 },
      { source: 'heat',    target: 'home',   value: 120 },
    ],
  },
  options: {
    height:      360,
    nodePadding: 14,
    animate:     true,
  },
});
```

---

## MTS.ChartNetwork

```js
new MTS.ChartNetwork('#graph', {
  data:    { nodes, links },
  options: { /* see below */ },
});
```

Nodes are laid out in a circle, then relaxed by a force simulation: all-pairs
repulsion, spring attraction along links, and a weak pull toward the center.
Nodes are drawn as circles with a label below; links as lines. When `animate`
is on the layout settles frame by frame; when off it runs all frames silently
and renders once.

### Network — Data

```js
data: {
  nodes: [
    { id: 'hub',   label: 'Hub',    color: '#1d4ed8', size: 3.0 },
    { id: 'leaf1', label: 'Leaf 1', color: '#10b981', size: 1.0 },
  ],
  links: [
    { source: 'hub', target: 'leaf1', value: 2 },
  ],
}
```

**Node fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | yes | Unique node id; referenced by links |
| `label` | `string` | no | Display label. Falls back to `id` |
| `color` | `string` | no | Circle fill. Falls back to the auto palette by index |
| `size` | `number` | no | Relative size. Falls back to `1`. Radius = `nodeRadius * √size` |

**Link fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source` | `string` | yes | Id of one endpoint |
| `target` | `string` | yes | Id of the other endpoint |
| `value` | `number` | no | Link weight. Falls back to `1`. Sets stroke width, clamped to `1..4` |

Links referencing an unknown node id are silently skipped. Rendering is skipped
if there are no nodes; a graph with nodes but no links renders the nodes alone.

### Network — Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `height` | `number` | `380` | SVG height in px |
| `nodeRadius` | `number` | `18` | Base node radius in px (before the `√size` factor) |
| `repulsion` | `number` | `4000` | Repulsion strength between every pair of nodes |
| `springK` | `number` | `0.04` | Spring stiffness pulling linked nodes together |
| `springLen` | `number` | `120` | Natural (rest) length of a link spring, in px |
| `iterations` | `number` | `180` | Number of simulation frames before settling |
| `animate` | `boolean` | `true` | Animate the settling; when `false`, run all frames then render once |

> Network has no `nodeWidth`, `nodePadding`, `linkOpacity`, `margin`, or
> `animateDuration` options — those are Sankey-only. Link color and node/link
> opacities are fixed by the CSS/render code, not options.

### Network — Behavior & events

- **Node hover** — tooltip shows the node `label` and its `size`; the circle
  goes to full `opacity 1` (from `0.9`).
- **Node click** — emits `click` with `{ id, label, size, color }`.
- Links are not interactive (no hover/click). There is **no** node dragging.

```js
var net = new MTS.ChartNetwork('#graph', { data: data, options: options });

net.onClick(function (e) {
  console.log(e.id);    // node id
  console.log(e.label); // node label
  console.log(e.size);  // node size (raw value, default 1)
  console.log(e.color); // node color
});
```

### Network — Example

```js
new MTS.ChartNetwork('#dependencies', {
  data: {
    nodes: [
      { id: 'app',  label: 'app',  size: 3,   color: '#1d4ed8' },
      { id: 'api',  label: 'api',  size: 2,   color: '#cc0000' },
      { id: 'auth', label: 'auth', size: 1.5, color: '#f59e0b' },
    ],
    links: [
      { source: 'app', target: 'api',  value: 3 },
      { source: 'api', target: 'auth', value: 2 },
    ],
  },
  options: {
    height:    380,
    repulsion: 5000,
    springLen: 140,
    animate:   true,
  },
});
```

---

## Inherited API

Both classes inherit the base `MTS.Chart` API:

- Constructor `new MTS.ChartSankey(el|selector, { data, options })`
  (in place, no `.mount()`).
- Events via `on('click', fn)` / `onClick(fn)`.
- `update({ data, options })` — replaces config and re-renders.
- `destroy()` — removes the SVG, tooltip, listeners and the `ResizeObserver`.
- `options.responsive` (default `true`) — re-render on container resize.
- `options.tooltip.formatter(value, label)` — custom tooltip value text.

See [`matios-ui-chart.md`](matios-ui-chart.md) for the full base reference. Do
not duplicate it here.
