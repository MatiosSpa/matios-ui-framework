/**
 * MTS.ChartSankey / MTS.ChartNetwork (v1.0.0)
 * SVG puro · 0 dependencias · XSS-safe
 *
 * Dep: matios-ui-chart.js (debe cargarse antes)
 *
 * Exporta:
 *   MTS.ChartSankey  — nodos + flujos con ancho proporcional, curvas Bézier
 *   MTS.ChartNetwork — grafos con simulación de fuerzas (Verlet)
 *
 * Sankey:
 *   data.nodes = [{id, label, color}]
 *   data.links = [{source, target, value}]
 *   options:
 *     nodeWidth    {number}  — ancho de nodo en px. Default: 16
 *     nodePadding  {number}  — separación vertical entre nodos. Default: 12
 *     linkOpacity  {number}  — opacidad de los flujos. Default: 0.45
 *     height, margin, animate
 *
 * Network:
 *   data.nodes = [{id, label, color, size}]
 *   data.links = [{source, target, value}]
 *   options:
 *     nodeRadius   {number}  — radio base de nodo en px. Default: 18
 *     repulsion    {number}  — fuerza de repulsión. Default: 4000
 *     springK      {number}  — rigidez del muelle. Default: 0.04
 *     springLen    {number}  — longitud natural del muelle en px. Default: 120
 *     iterations   {number}  — frames de simulación. Default: 180
 *     height, animate
 */
(function (global) {
  'use strict';

  if (!global.MTS || !global.MTS.Chart) {
    throw new Error('matios-ui-chart-flow.js: MTS.Chart no encontrado. Incluir matios-ui-chart.js primero.');
  }

  const MtsChart = global.MTS.Chart;
  const u        = MtsChart._utils;

  // ── MtsChartSankey ───────────────────────────────────────────────────────────

  class MtsChartSankey extends MtsChart {
    get _type() { return 'sankey'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }

      const cfg        = this._cfg;
      const data       = cfg.data    || {};
      const opts       = cfg.options || {};
      const rawNodes   = data.nodes  || [];
      const rawLinks   = data.links  || [];
      if (!rawNodes.length || !rawLinks.length) return;

      const nodeW      = opts.nodeWidth   != null ? opts.nodeWidth   : 16;
      const nodePad    = opts.nodePadding != null ? opts.nodePadding : 12;
      const linkOpac   = opts.linkOpacity != null ? opts.linkOpacity : 0.45;
      const animate    = opts.animate !== false;
      const fmt        = opts.formatter || u.defaultFmt;

      const W          = this._el.clientWidth || 500;
      const H          = opts.height || 340;
      const mg         = {
        top:    (opts.margin && opts.margin.top    != null) ? opts.margin.top    : 16,
        right:  (opts.margin && opts.margin.right  != null) ? opts.margin.right  : 8,
        bottom: (opts.margin && opts.margin.bottom != null) ? opts.margin.bottom : 16,
        left:   (opts.margin && opts.margin.left   != null) ? opts.margin.left   : 8,
      };
      const chartW = W - mg.left - mg.right;
      const chartH = H - mg.top - mg.bottom;
      if (chartW <= 0 || chartH <= 0) return;

      // ── Build node map ───────────────────────────────────────────────────────
      const nodeMap = {};
      for (let i = 0; i < rawNodes.length; i++) {
        const n = rawNodes[i];
        nodeMap[n.id] = {
          id: n.id, label: n.label || n.id, color: n.color || u.PALETTE[i % u.PALETTE.length],
          depth: -1, inLinks: [], outLinks: [], value: 0,
          x: 0, y: 0, h: 0, outSlot: 0, inSlot: 0,
        };
      }

      const links = [];
      for (let i = 0; i < rawLinks.length; i++) {
        const l = rawLinks[i];
        if (!nodeMap[l.source] || !nodeMap[l.target]) continue;
        const link = { source: l.source, target: l.target, value: l.value || 0 };
        links.push(link);
        nodeMap[l.source].outLinks.push(link);
        nodeMap[l.target].inLinks.push(link);
      }

      // ── Assign depths via BFS ────────────────────────────────────────────────
      const ids = Object.keys(nodeMap);
      const queue = [];
      for (let i = 0; i < ids.length; i++) {
        if (nodeMap[ids[i]].inLinks.length === 0) {
          nodeMap[ids[i]].depth = 0;
          queue.push(ids[i]);
        }
      }
      let qi = 0;
      while (qi < queue.length) {
        const id   = queue[qi++];
        const node = nodeMap[id];
        for (let j = 0; j < node.outLinks.length; j++) {
          const tgt = nodeMap[node.outLinks[j].target];
          if (tgt.depth <= node.depth) {
            tgt.depth = node.depth + 1;
            queue.push(tgt.id);
          }
        }
      }
      for (let i = 0; i < ids.length; i++) {
        if (nodeMap[ids[i]].depth === -1) nodeMap[ids[i]].depth = 0;
      }

      // ── Group by column ──────────────────────────────────────────────────────
      let maxDepth = 0;
      for (let i = 0; i < ids.length; i++) {
        if (nodeMap[ids[i]].depth > maxDepth) maxDepth = nodeMap[ids[i]].depth;
      }
      const columns = [];
      for (let d = 0; d <= maxDepth; d++) {
        columns.push(ids.filter(function(id){ return nodeMap[id].depth === d; }));
      }

      // ── Compute node values ──────────────────────────────────────────────────
      for (let i = 0; i < ids.length; i++) {
        const n    = nodeMap[ids[i]];
        const sumO = n.outLinks.reduce(function(s,l){ return s + l.value; }, 0);
        const sumI = n.inLinks.reduce(function(s,l){ return s + l.value; }, 0);
        n.value = Math.max(sumO, sumI) || 1;
      }

      // ── X positions (evenly spaced columns) ─────────────────────────────────
      const colSpan = columns.length > 1 ? (chartW - nodeW) / (columns.length - 1) : 0;
      for (let d = 0; d < columns.length; d++) {
        const x = d === columns.length - 1 ? chartW - nodeW : d * colSpan;
        for (let j = 0; j < columns[d].length; j++) {
          nodeMap[columns[d][j]].x = x;
        }
      }

      // ── Y positions (per-column normalization) ───────────────────────────────
      for (let d = 0; d < columns.length; d++) {
        const col      = columns[d];
        const colTotal = col.reduce(function(s,id){ return s + nodeMap[id].value; }, 0);
        const avail    = chartH - Math.max(0, col.length - 1) * nodePad;
        const scale    = avail / colTotal;
        let   yOff     = 0;
        for (let j = 0; j < col.length; j++) {
          const n = nodeMap[col[j]];
          n.h    = Math.max(2, n.value * scale);
          n.y    = yOff;
          n.outSlot = 0;
          n.inSlot  = 0;
          yOff  += n.h + nodePad;
        }
      }

      // ── SVG ──────────────────────────────────────────────────────────────────
      const svg  = u.svgEl('svg', { width: W, height: H, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Sankey chart' });
      this._svg  = svg;
      const g    = u.svgEl('g', { transform: 'translate(' + mg.left + ',' + mg.top + ')' });
      svg.appendChild(g);
      const self = this;

      // ── Draw links ───────────────────────────────────────────────────────────
      // Sort links per node for cleaner layout
      for (let i = 0; i < ids.length; i++) {
        const n = nodeMap[ids[i]];
        n.outLinks.sort(function(a,b){ return (nodeMap[a.target].depth - nodeMap[b.target].depth) || (nodeMap[a.target].y - nodeMap[b.target].y); });
        n.inLinks.sort( function(a,b){ return (nodeMap[a.source].depth - nodeMap[b.source].depth) || (nodeMap[a.source].y - nodeMap[b.source].y); });
      }

      const animLinks = [];

      for (let i = 0; i < links.length; i++) {
        const lnk = links[i];
        const src = nodeMap[lnk.source];
        const tgt = nodeMap[lnk.target];

        // Link height at source and target proportional to their node heights
        const lhSrc = lnk.value / src.value * src.h;
        const lhTgt = lnk.value / tgt.value * tgt.h;

        const sx   = src.x + nodeW;
        const tx   = tgt.x;
        const midX = (sx + tx) / 2;

        const sy1  = src.y + src.outSlot;
        const sy2  = sy1 + lhSrc;
        const ty1  = tgt.y + tgt.inSlot;
        const ty2  = ty1 + lhTgt;

        src.outSlot += lhSrc;
        tgt.inSlot  += lhTgt;

        const linkColor = src.color;
        const d = [
          'M', sx.toFixed(1), sy1.toFixed(1),
          'C', midX.toFixed(1), sy1.toFixed(1), midX.toFixed(1), ty1.toFixed(1), tx.toFixed(1), ty1.toFixed(1),
          'L', tx.toFixed(1), ty2.toFixed(1),
          'C', midX.toFixed(1), ty2.toFixed(1), midX.toFixed(1), sy2.toFixed(1), sx.toFixed(1), sy2.toFixed(1),
          'Z',
        ].join(' ');

        const path = u.svgEl('path', {
          d: d, fill: linkColor,
          opacity: animate ? 0 : linkOpac, style: 'cursor:pointer',
        });

        (function (el, lnk, srcN, tgtN) {
          el.addEventListener('mouseenter', function (e) {
            self._showTooltip(e, srcN.label + ' → ' + tgtN.label, lnk.value, '', srcN.color);
            el.setAttribute('opacity', Math.min(1, linkOpac + 0.3));
          });
          el.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
          el.addEventListener('mouseleave', function ()  { self._hideTooltip(); el.setAttribute('opacity', linkOpac); });
        }(path, lnk, src, tgt));

        if (animate) animLinks.push(path);
        g.appendChild(path);
      }

      // ── Draw nodes ───────────────────────────────────────────────────────────
      for (let i = 0; i < ids.length; i++) {
        const n = nodeMap[ids[i]];

        const rect = u.svgEl('rect', {
          x: n.x, y: n.y, width: nodeW, height: Math.round(n.h),
          fill: n.color, rx: 3, opacity: animate ? 0 : 1, style: 'cursor:pointer',
        });

        (function (el, n) {
          el.addEventListener('mouseenter', function (e) {
            self._showTooltip(e, n.label, n.value, '', n.color);
            el.setAttribute('opacity', '0.75');
          });
          el.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
          el.addEventListener('mouseleave', function ()  { self._hideTooltip(); el.setAttribute('opacity', '1'); });
          el.addEventListener('click',      function ()  { self._emit('click', { id: n.id, label: n.label, value: n.value, color: n.color }); });
        }(rect, n));

        if (animate) animLinks.push(rect);
        g.appendChild(rect);

        // Node label
        const isLast   = n.depth === maxDepth;
        const lblX     = isLast ? n.x - 6 : n.x + nodeW + 6;
        const anchor   = isLast ? 'end' : 'start';
        const lbl = u.svgEl('text', {
          x: lblX, y: n.y + n.h / 2,
          'text-anchor': anchor, 'dominant-baseline': 'middle',
          'class': 'mts-chart__axis-label', style: 'font-size:11px',
        });
        lbl.textContent = n.label;
        g.appendChild(lbl);
      }

      this._el.insertBefore(svg, this._tooltipEl);

      if (animate && animLinks.length) {
        const duration = opts.animateDuration || 600;
        const t0 = performance.now();
        const self2 = this;
        function step(now) {
          if (!self2._svg || !self2._svg.isConnected) { self2._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < animLinks.length; i++) {
            const el = animLinks[i];
            const target = el.tagName === 'rect' ? 1 : linkOpac;
            el.setAttribute('opacity', target * ease);
          }
          if (t < 1) {
            self2._animReq = requestAnimationFrame(step);
          } else {
            self2._animReq = null;
            for (let i = 0; i < animLinks.length; i++) {
              const el = animLinks[i];
              el.setAttribute('opacity', el.tagName === 'rect' ? 1 : linkOpac);
            }
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  // ── MtsChartNetwork ──────────────────────────────────────────────────────────

  class MtsChartNetwork extends MtsChart {
    get _type() { return 'network'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }

      const cfg      = this._cfg;
      const data     = cfg.data    || {};
      const opts     = cfg.options || {};
      const rawNodes = data.nodes  || [];
      const rawLinks = data.links  || [];
      if (!rawNodes.length) return;

      const baseR     = opts.nodeRadius != null ? opts.nodeRadius : 18;
      const repulsion = opts.repulsion  != null ? opts.repulsion  : 4000;
      const springK   = opts.springK    != null ? opts.springK    : 0.04;
      const springLen = opts.springLen  != null ? opts.springLen  : 120;
      const maxFrames = opts.iterations != null ? opts.iterations : 180;
      const animate   = opts.animate !== false;

      const W   = this._el.clientWidth || 500;
      const H   = opts.height || 380;
      if (W <= 0 || H <= 0) return;

      // Initialize node state
      const nodeIdx  = {};
      const simNodes = rawNodes.map(function(n, i) {
        nodeIdx[n.id] = i;
        const angle = (i / rawNodes.length) * Math.PI * 2;
        const r     = Math.min(W, H) / 3;
        return {
          id:    n.id,
          label: n.label || n.id,
          color: n.color || u.PALETTE[i % u.PALETTE.length],
          size:  n.size  != null ? n.size : 1,
          x:     W / 2 + r * Math.cos(angle) + (Math.random() - 0.5) * 20,
          y:     H / 2 + r * Math.sin(angle) + (Math.random() - 0.5) * 20,
          vx:    0,
          vy:    0,
        };
      });

      const simLinks = [];
      for (let i = 0; i < rawLinks.length; i++) {
        const l = rawLinks[i];
        if (nodeIdx[l.source] == null || nodeIdx[l.target] == null) continue;
        simLinks.push({ si: nodeIdx[l.source], ti: nodeIdx[l.target], value: l.value || 1 });
      }

      // ── SVG skeleton ─────────────────────────────────────────────────────────
      const svg  = u.svgEl('svg', { width: W, height: H, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Network graph' });
      this._svg  = svg;
      const gLinks = u.svgEl('g');
      const gNodes = u.svgEl('g');
      svg.appendChild(gLinks);
      svg.appendChild(gNodes);

      // Create link elements
      const linkEls = simLinks.map(function(l) {
        const el = u.svgEl('line', {
          x1: 0, y1: 0, x2: 0, y2: 0,
          stroke: 'var(--mts-border-color, #334155)',
          'stroke-width': Math.max(1, Math.min(4, l.value || 1)),
          opacity: 0.5,
        });
        gLinks.appendChild(el);
        return el;
      });

      const self = this;

      // Create node elements (circle + label)
      const nodeDots = simNodes.map(function(n, i) {
        const r    = Math.round(baseR * Math.sqrt(n.size));
        const g    = u.svgEl('g', { style: 'cursor:pointer' });
        const circ = u.svgEl('circle', { cx: 0, cy: 0, r: r, fill: n.color, opacity: 0.9 });
        const lbl  = u.svgEl('text', {
          x: 0, y: r + 13, 'text-anchor': 'middle',
          'class': 'mts-chart__axis-label', style: 'font-size:10px',
        });
        lbl.textContent = n.label;
        g.appendChild(circ);
        g.appendChild(lbl);
        gNodes.appendChild(g);

        (function (el, circ, n) {
          el.addEventListener('mouseenter', function (e) {
            self._showTooltip(e, n.label, n.size, '', n.color);
            circ.setAttribute('opacity', '1');
          });
          el.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
          el.addEventListener('mouseleave', function ()  { self._hideTooltip(); circ.setAttribute('opacity', '0.9'); });
          el.addEventListener('click',      function ()  { self._emit('click', { id: n.id, label: n.label, size: n.size, color: n.color }); });
        }(g, circ, n));

        return { g: g, circ: circ, r: r };
      });

      function updatePositions() {
        for (let i = 0; i < simNodes.length; i++) {
          const n = simNodes[i];
          nodeDots[i].g.setAttribute('transform', 'translate(' + n.x.toFixed(1) + ',' + n.y.toFixed(1) + ')');
        }
        for (let i = 0; i < simLinks.length; i++) {
          const l = simLinks[i];
          linkEls[i].setAttribute('x1', simNodes[l.si].x.toFixed(1));
          linkEls[i].setAttribute('y1', simNodes[l.si].y.toFixed(1));
          linkEls[i].setAttribute('x2', simNodes[l.ti].x.toFixed(1));
          linkEls[i].setAttribute('y2', simNodes[l.ti].y.toFixed(1));
        }
      }

      function simStep(damping) {
        // Forces array
        const fx = new Float64Array(simNodes.length);
        const fy = new Float64Array(simNodes.length);

        // Repulsion (all pairs)
        for (let i = 0; i < simNodes.length; i++) {
          for (let j = i + 1; j < simNodes.length; j++) {
            const dx  = simNodes[j].x - simNodes[i].x;
            const dy  = simNodes[j].y - simNodes[i].y;
            const d2  = dx * dx + dy * dy;
            const d   = Math.sqrt(d2) || 1;
            const f   = repulsion / (d2 * d);
            fx[i] -= f * dx;  fy[i] -= f * dy;
            fx[j] += f * dx;  fy[j] += f * dy;
          }
        }

        // Spring attraction
        for (let i = 0; i < simLinks.length; i++) {
          const l  = simLinks[i];
          const dx = simNodes[l.ti].x - simNodes[l.si].x;
          const dy = simNodes[l.ti].y - simNodes[l.si].y;
          const d  = Math.sqrt(dx * dx + dy * dy) || 1;
          const f  = springK * (d - springLen) / d;
          fx[l.si] += f * dx;  fy[l.si] += f * dy;
          fx[l.ti] -= f * dx;  fy[l.ti] -= f * dy;
        }

        // Center gravity
        for (let i = 0; i < simNodes.length; i++) {
          fx[i] += (W / 2 - simNodes[i].x) * 0.015;
          fy[i] += (H / 2 - simNodes[i].y) * 0.015;
        }

        // Integrate
        for (let i = 0; i < simNodes.length; i++) {
          const n = simNodes[i];
          n.vx = (n.vx + fx[i]) * damping;
          n.vy = (n.vy + fy[i]) * damping;
          n.x  = Math.max(nodeDots[i].r, Math.min(W - nodeDots[i].r, n.x + n.vx));
          n.y  = Math.max(nodeDots[i].r, Math.min(H - nodeDots[i].r - 16, n.y + n.vy));
        }
      }

      this._el.insertBefore(svg, this._tooltipEl);

      if (!animate) {
        // Run silently then render once
        for (let f = 0; f < maxFrames; f++) simStep(0.85);
        updatePositions();
        return;
      }

      // Animated settling
      let frame    = 0;
      const self2  = this;
      function loop() {
        if (!self2._svg || !self2._svg.isConnected) { self2._animReq = null; return; }
        const progress = frame / maxFrames;
        const damping  = 0.9 - progress * 0.15;  // gradually increase damping
        simStep(damping);
        updatePositions();
        frame++;
        if (frame < maxFrames) {
          self2._animReq = requestAnimationFrame(loop);
        } else {
          self2._animReq = null;
        }
      }
      this._animReq = requestAnimationFrame(loop);
    }
  }

  global.MTS.ChartSankey  = MtsChartSankey;
  global.MTS.ChartNetwork = MtsChartNetwork;

}(typeof window !== 'undefined' ? window : this));
