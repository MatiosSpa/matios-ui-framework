/**
 * MTS.ChartHeatmap / MTS.ChartTreemap / MTS.ChartRadar
 * MTS.ChartWaterfall / MTS.ChartFunnel (v1.0.0)
 * SVG puro · 0 dependencias · XSS-safe
 *
 * Dep: matios-ui-chart.js (debe cargarse antes)
 *
 * Exporta:
 *   MTS.ChartHeatmap   — grid de celdas con escala de color
 *   MTS.ChartTreemap   — rectángulos anidados, algoritmo squarify
 *   MTS.ChartRadar     — polígono sobre ejes radiales equidistantes
 *   MTS.ChartWaterfall — deltas acumulados, baseline variable
 *   MTS.ChartFunnel    — trapecios centrados con % de conversión
 *
 * Heatmap:
 *   data.xLabels  {string[]}
 *   data.yLabels  {string[]}
 *   data.values   {number[][]}  — [fila][col]
 *   options: colorLow, colorHigh, cellPadding, showValues, formatter
 *
 * Treemap:
 *   data.datasets [{label, value, color}]
 *   options: padding, showValues, formatter
 *
 * Radar:
 *   data.labels   {string[]}
 *   data.datasets [{label, color, values}]
 *   options: min, max, levels, fillOpacity, animate
 *
 * Waterfall:
 *   data.labels   {string[]}
 *   data.datasets [{values}]  — values: number[] | {value, type:'total'|'start'}[]
 *   options: positiveColor, negativeColor, totalColor, connector, yAxis, height
 *
 * Funnel:
 *   data.labels   {string[]}
 *   data.values   {number[]}
 *   options: colors, showPercentage, height, margin
 */
(function (global) {
  'use strict';

  if (!global.MTS || !global.MTS.Chart) {
    throw new Error('matios-ui-chart-composite.js: MTS.Chart no encontrado. Incluir matios-ui-chart.js primero.');
  }

  const MtsChart = global.MTS.Chart;
  const u        = MtsChart._utils;

  // ── Color interpolation ──────────────────────────────────────────────────────

  function _hexRgb(hex) {
    const h = hex.replace('#', '');
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  }
  function _rgbHex(r, g, b) {
    return '#' + [r,g,b].map(function(c){ return ('0'+Math.round(c).toString(16)).slice(-2); }).join('');
  }
  function _lerpColor(hexA, hexB, t) {
    const a = _hexRgb(hexA), b = _hexRgb(hexB);
    return _rgbHex(a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t);
  }

  // ── Squarify ─────────────────────────────────────────────────────────────────

  function _squarify(nodes, x, y, w, h) {
    const result = [];
    if (!nodes.length || w <= 0 || h <= 0) return result;
    const total = nodes.reduce(function(s,n){ return s + Math.max(0,n.value); }, 0);
    if (!total) return result;

    const sorted = nodes.slice().sort(function(a,b){ return b.value - a.value; });

    function worstRatio(vals, rowSum, shortSide) {
      if (!vals.length) return Infinity;
      const stripW = rowSum / shortSide;
      let worst = 0;
      for (let i = 0; i < vals.length; i++) {
        const itemL = vals[i] / stripW;
        const r = Math.max(stripW / itemL, itemL / stripW);
        if (r > worst) worst = r;
      }
      return worst;
    }

    function lay(nodes, nodeTotal, x, y, w, h) {
      if (!nodes.length || w <= 0 || h <= 0) return;
      if (nodes.length === 1) { result.push({ node: nodes[0], x: x, y: y, w: w, h: h }); return; }

      const area  = w * h;
      const short = Math.min(w, h);
      const aOf   = function(n) { return n.value / nodeTotal * area; };

      let row    = [aOf(nodes[0])];
      let rowSum = row[0];
      let i      = 1;

      for (; i < nodes.length; i++) {
        const a = aOf(nodes[i]);
        if (worstRatio(row.concat(a), rowSum + a, short) <= worstRatio(row, rowSum, short)) {
          row.push(a); rowSum += a;
        } else { break; }
      }

      const stripDim = rowSum / short;
      let off = 0;
      for (let j = 0; j < row.length; j++) {
        const itemL = row[j] / stripDim;
        if (w >= h) {
          result.push({ node: nodes[j], x: Math.round(x), y: Math.round(y + off), w: Math.round(stripDim), h: Math.round(itemL) });
        } else {
          result.push({ node: nodes[j], x: Math.round(x + off), y: Math.round(y), w: Math.round(itemL), h: Math.round(stripDim) });
        }
        off += itemL;
      }

      const rest = nodes.slice(i);
      if (!rest.length) return;
      const restTotal = rest.reduce(function(s,n){ return s + n.value; }, 0);
      if (w >= h) { lay(rest, restTotal, x + stripDim, y, w - stripDim, h); }
      else        { lay(rest, restTotal, x, y + stripDim, w, h - stripDim); }
    }

    lay(sorted, total, x, y, w, h);
    return result;
  }

  // ── MtsChartHeatmap ──────────────────────────────────────────────────────────

  class MtsChartHeatmap extends MtsChart {
    get _type() { return 'heatmap'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }

      const cfg      = this._cfg;
      const data     = cfg.data    || {};
      const opts     = cfg.options || {};
      const xLabels  = data.xLabels || [];
      const yLabels  = data.yLabels || [];
      const matrix   = data.values  || [];
      const nX       = xLabels.length;
      const nY       = yLabels.length;
      if (!nX || !nY || !matrix.length) return;

      const colorLow  = opts.colorLow  || '#0d2b6b';
      const colorHigh = opts.colorHigh || '#3b82f6';
      const cellPad   = opts.cellPadding != null ? opts.cellPadding : 2;
      const showVals  = opts.showValues === true;
      const fmt       = opts.formatter || u.defaultFmt;
      const animate   = opts.animate !== false;

      const W         = this._el.clientWidth || 400;
      const labelH    = 24;
      const labelW    = 56;
      const cellW     = Math.max(8, (W - labelW) / nX);
      const cellH     = opts.cellHeight || Math.max(8, Math.min(cellW, 40));
      const H         = opts.height || (labelH + nY * (cellH + cellPad) + 8);

      const svg = u.svgEl('svg', { width: W, height: H, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Heatmap' });
      this._svg = svg;

      // Compute global min/max
      let gMin = Infinity, gMax = -Infinity;
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < (matrix[r] || []).length; c++) {
          const v = matrix[r][c];
          if (v < gMin) gMin = v;
          if (v > gMax) gMax = v;
        }
      }
      const gRange = (gMax - gMin) || 1;

      // X axis labels
      for (let c = 0; c < nX; c++) {
        const xl = u.svgEl('text', {
          x: labelW + c * (cellW + cellPad) + cellW / 2, y: labelH - 4,
          'text-anchor': 'middle', 'class': 'mts-chart__axis-label',
        });
        xl.textContent = xLabels[c];
        svg.appendChild(xl);
      }

      const self    = this;
      const animEls = [];

      for (let r = 0; r < nY; r++) {
        const row   = matrix[r] || [];
        const yPos  = labelH + r * (cellH + cellPad);

        // Y axis label
        const yl = u.svgEl('text', {
          x: labelW - 6, y: yPos + cellH / 2,
          'text-anchor': 'end', 'dominant-baseline': 'middle', 'class': 'mts-chart__axis-label',
        });
        yl.textContent = yLabels[r];
        svg.appendChild(yl);

        for (let c = 0; c < nX; c++) {
          const val  = row[c] != null ? row[c] : 0;
          const t    = (val - gMin) / gRange;
          const fill = _lerpColor(colorLow, colorHigh, t);
          const xPos = labelW + c * (cellW + cellPad);

          const rect = u.svgEl('rect', {
            x: xPos, y: yPos, width: Math.max(1, cellW - cellPad), height: cellH,
            fill: fill, rx: 3, opacity: animate ? 0 : 1,
            'class': 'mts-chart__heatmap-cell', style: 'cursor:pointer',
          });

          (function (el, val, xl, yl, row, col) {
            el.addEventListener('mouseenter', function (e) { self._showTooltip(e, xl + ' · ' + yl, val, '', fill); el.setAttribute('opacity', '1'); });
            el.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
            el.addEventListener('mouseleave', function ()  { self._hideTooltip(); el.setAttribute('opacity', '1'); });
            el.addEventListener('click',      function ()  { self._emit('click', { xLabel: xl, yLabel: yl, value: val, row: row, col: col }); });
          }(rect, val, xLabels[c], yLabels[r], r, c));

          if (animate) animEls.push(rect);
          svg.appendChild(rect);

          if (showVals && cellW > 28 && cellH > 14) {
            const lbl = u.svgEl('text', {
              x: xPos + (cellW - cellPad) / 2, y: yPos + cellH / 2,
              'text-anchor': 'middle', 'dominant-baseline': 'middle',
              'class': 'mts-chart__axis-label', style: 'pointer-events:none',
            });
            lbl.textContent = fmt(val);
            svg.appendChild(lbl);
          }
        }
      }

      this._el.insertBefore(svg, this._tooltipEl);

      if (animate && animEls.length) {
        const duration = opts.animateDuration || 500;
        const t0 = performance.now();
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < animEls.length; i++) animEls[i].setAttribute('opacity', ease);
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < animEls.length; i++) animEls[i].setAttribute('opacity', 1);
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  // ── MtsChartTreemap ──────────────────────────────────────────────────────────

  class MtsChartTreemap extends MtsChart {
    get _type() { return 'treemap'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }

      const cfg      = this._cfg;
      const data     = cfg.data    || {};
      const opts     = cfg.options || {};
      const nodes    = (data.datasets || []).filter(function(n){ return n.value > 0; });
      if (!nodes.length) return;

      const W       = this._el.clientWidth || 400;
      const H       = opts.height || 320;
      const pad     = opts.padding != null ? opts.padding : 2;
      const showVal = opts.showValues !== false;
      const fmt     = opts.formatter || u.defaultFmt;
      const animate = opts.animate !== false;

      const total = nodes.reduce(function(s,n){ return s + n.value; }, 0);
      const tiles  = _squarify(nodes, 0, 0, W, H);

      const svg  = u.svgEl('svg', { width: W, height: H, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Treemap' });
      this._svg = svg;
      const self = this;
      const animEls = [];

      for (let i = 0; i < tiles.length; i++) {
        const tile   = tiles[i];
        const node   = tile.node;
        const color  = node.color || u.PALETTE[i % u.PALETTE.length];
        const tx     = tile.x + pad;
        const ty     = tile.y + pad;
        const tw     = Math.max(0, tile.w - pad * 2);
        const th     = Math.max(0, tile.h - pad * 2);
        if (tw < 2 || th < 2) continue;

        const rect = u.svgEl('rect', {
          x: tx, y: ty, width: tw, height: th,
          fill: color, rx: 4, opacity: animate ? 0 : 0.85,
          'class': 'mts-chart__bar', style: 'cursor:pointer',
        });

        (function (el, node, col) {
          el.addEventListener('mouseenter', function (e) {
            self._showTooltip(e, node.label || '', node.value, '', col);
            el.setAttribute('opacity', '1');
          });
          el.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
          el.addEventListener('mouseleave', function ()  { self._hideTooltip(); el.setAttribute('opacity', '0.85'); });
          el.addEventListener('click',      function ()  { self._emit('click', { label: node.label, value: node.value, color: col }); });
        }(rect, node, color));

        if (animate) animEls.push(rect);
        svg.appendChild(rect);

        // Label inside tile
        if (tw > 30 && th > 18) {
          const lbl = u.svgEl('text', {
            x: tx + tw / 2, y: ty + (th < 40 ? th / 2 : th / 2 - 8),
            'text-anchor': 'middle', 'dominant-baseline': 'middle',
            'class': 'mts-chart__treemap-label', style: 'pointer-events:none',
          });
          lbl.textContent = node.label || '';
          svg.appendChild(lbl);

          if (showVal && th > 40) {
            const pct = u.svgEl('text', {
              x: tx + tw / 2, y: ty + th / 2 + 14,
              'text-anchor': 'middle', 'dominant-baseline': 'middle',
              'class': 'mts-chart__treemap-sub', style: 'pointer-events:none',
            });
            pct.textContent = fmt(node.value) + ' (' + Math.round(node.value / total * 100) + '%)';
            svg.appendChild(pct);
          }
        }
      }

      this._el.insertBefore(svg, this._tooltipEl);

      if (animate && animEls.length) {
        const duration = opts.animateDuration || 500;
        const t0 = performance.now();
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < animEls.length; i++) animEls[i].setAttribute('opacity', 0.85 * ease);
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < animEls.length; i++) animEls[i].setAttribute('opacity', 0.85);
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  // ── MtsChartRadar ────────────────────────────────────────────────────────────

  class MtsChartRadar extends MtsChart {
    get _type() { return 'radar'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }
      if (this._legendEl) { this._legendEl.remove(); this._legendEl = null; }

      const cfg      = this._cfg;
      const data     = cfg.data    || {};
      const opts     = cfg.options || {};
      const labels   = data.labels   || [];
      const datasets = data.datasets || [];
      const n        = labels.length;
      if (n < 3 || !datasets.length) return;

      const W           = this._el.clientWidth || 400;
      const H           = opts.height || Math.min(W, 380);
      const pad         = 56;
      const cx          = W / 2;
      const cy          = H / 2;
      const r           = Math.min(W, H) / 2 - pad;
      const minVal      = opts.min != null ? opts.min : 0;
      const maxVal      = opts.max != null ? opts.max : 100;
      const valRange    = (maxVal - minVal) || 1;
      const levels      = opts.levels != null ? opts.levels : 5;
      const fillOpacity = opts.fillOpacity != null ? opts.fillOpacity : 0.15;
      const animate     = opts.animate !== false;

      function angleOf(i)  { return (i / n) * Math.PI * 2 - Math.PI / 2; }
      function ptOf(i, pct) {
        const a = angleOf(i);
        return { x: cx + pct * r * Math.cos(a), y: cy + pct * r * Math.sin(a) };
      }
      function polyPts(pcts) {
        return pcts.map(function(pct, i){ const p = ptOf(i, pct); return p.x.toFixed(2) + ',' + p.y.toFixed(2); }).join(' ');
      }

      const svg  = u.svgEl('svg', { width: W, height: H, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Radar chart' });
      this._svg = svg;
      const self = this;

      // Grid rings
      for (let l = 1; l <= levels; l++) {
        const pct  = l / levels;
        const pts  = [];
        for (let i = 0; i < n; i++) { const p = ptOf(i, pct); pts.push(p.x.toFixed(2) + ',' + p.y.toFixed(2)); }
        svg.appendChild(u.svgEl('polygon', {
          points: pts.join(' '), fill: 'none',
          stroke: 'var(--mts-border-color, #334155)', 'stroke-width': 1,
        }));
      }

      // Axis lines + labels
      for (let i = 0; i < n; i++) {
        const outer = ptOf(i, 1);
        svg.appendChild(u.svgEl('line', {
          x1: cx, y1: cy, x2: outer.x.toFixed(2), y2: outer.y.toFixed(2),
          stroke: 'var(--mts-border-color, #334155)', 'stroke-width': 1,
        }));
        const lpt = ptOf(i, 1.18);
        const lbl = u.svgEl('text', {
          x: lpt.x.toFixed(2), y: lpt.y.toFixed(2),
          'text-anchor': 'middle', 'dominant-baseline': 'middle', 'class': 'mts-chart__axis-label',
          style: 'font-size:11px',
        });
        lbl.textContent = labels[i];
        svg.appendChild(lbl);
      }

      // Datasets
      const animLines = [];
      for (let d = 0; d < datasets.length; d++) {
        const ds    = datasets[d];
        const color = ds.color || u.PALETTE[d % u.PALETTE.length];
        const vals  = ds.values || [];
        const pcts  = vals.map(function(v){ return Math.max(0, Math.min(1, (v - minVal) / valRange)); });

        const fillPoly = u.svgEl('polygon', {
          points: polyPts(pcts), fill: color,
          opacity: animate ? 0 : fillOpacity,
        });
        const strokePoly = u.svgEl('polygon', {
          points: polyPts(pcts), fill: 'none',
          stroke: color, 'stroke-width': 2,
          opacity: animate ? 0 : 1,
        });
        svg.appendChild(fillPoly);
        svg.appendChild(strokePoly);
        if (animate) animLines.push({ fill: fillPoly, stroke: strokePoly, targetFill: fillOpacity });

        // Dots on each axis
        for (let i = 0; i < n; i++) {
          const p   = ptOf(i, pcts[i]);
          const dot = u.svgEl('circle', {
            cx: p.x.toFixed(2), cy: p.y.toFixed(2), r: 4,
            fill: color, 'stroke': 'var(--mts-bg-surface,#1e293b)', 'stroke-width': 1.5,
            opacity: animate ? 0 : 1, style: 'cursor:pointer',
          });
          (function (el, val, lbl, col, dsIdx, ptIdx) {
            el.addEventListener('mouseenter', function (e) { self._showTooltip(e, lbl, val, ds.label || '', col); el.setAttribute('r', 6); });
            el.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
            el.addEventListener('mouseleave', function ()  { self._hideTooltip(); el.setAttribute('r', 4); });
            el.addEventListener('click',      function ()  { self._emit('click', { label: lbl, value: val, datasetIndex: dsIdx, index: ptIdx, color: col }); });
          }(dot, vals[i], labels[i], color, d, i));
          if (animate) animLines.push({ fill: dot, stroke: null, targetFill: 1 });
          svg.appendChild(dot);
        }
      }

      this._el.insertBefore(svg, this._tooltipEl);
      if (opts.legend !== false && datasets.length > 1) this._legendEl = this._buildLegend(datasets, 'mts-chart__legend-dot--circle');

      if (animate && animLines.length) {
        const duration = opts.animateDuration || 600;
        const t0 = performance.now();
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < animLines.length; i++) {
            const al = animLines[i];
            al.fill.setAttribute('opacity', al.targetFill * ease);
            if (al.stroke) al.stroke.setAttribute('opacity', ease);
          }
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < animLines.length; i++) {
              animLines[i].fill.setAttribute('opacity', animLines[i].targetFill);
              if (animLines[i].stroke) animLines[i].stroke.setAttribute('opacity', 1);
            }
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  // ── MtsChartWaterfall ────────────────────────────────────────────────────────

  class MtsChartWaterfall extends MtsChart {
    get _type() { return 'waterfall'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }

      const cfg      = this._cfg;
      const data     = cfg.data    || {};
      const opts     = cfg.options || {};
      const labels   = data.labels || [];
      const rawVals  = (data.datasets && data.datasets[0] && data.datasets[0].values) || [];
      if (!labels.length || !rawVals.length) return;

      const posColor   = opts.positiveColor || '#10b981';
      const negColor   = opts.negativeColor || '#e53935';
      const totColor   = opts.totalColor    || '#3b82f6';
      const connector  = opts.connector !== false;
      const fmt        = (opts.yAxis && opts.yAxis.formatter) ? opts.yAxis.formatter : u.defaultFmt;
      const animate    = opts.animate !== false;

      // Normalize values
      const bars = [];
      let running = 0;
      for (let i = 0; i < rawVals.length; i++) {
        const raw = rawVals[i];
        let value, type;
        if (raw != null && typeof raw === 'object') {
          value = raw.value != null ? raw.value : running;
          type  = raw.type  || 'delta';
        } else {
          value = raw != null ? raw : 0;
          type  = 'delta';
        }
        if (type === 'total') {
          bars.push({ label: labels[i], base: 0, value: running, type: 'total', color: totColor });
        } else if (type === 'start') {
          bars.push({ label: labels[i], base: 0, value: value, type: 'start', color: value >= 0 ? posColor : negColor });
          running = value;
        } else {
          bars.push({ label: labels[i], base: running, value: value, type: 'delta', color: value >= 0 ? posColor : negColor });
          running += value;
        }
      }

      const W         = this._el.clientWidth || 400;
      const heightOpt = opts.height || 320;
      const mg        = {
        top:    (opts.margin && opts.margin.top    != null) ? opts.margin.top    : 24,
        right:  (opts.margin && opts.margin.right  != null) ? opts.margin.right  : 16,
        bottom: (opts.margin && opts.margin.bottom != null) ? opts.margin.bottom : 44,
        left:   (opts.margin && opts.margin.left   != null) ? opts.margin.left   : 64,
      };
      const chartW = W - mg.left - mg.right;
      const chartH = heightOpt - mg.top - mg.bottom;
      if (chartW <= 0 || chartH <= 0) return;

      // Y scale
      let allY = [];
      for (let i = 0; i < bars.length; i++) {
        allY.push(bars[i].base, bars[i].base + bars[i].value);
      }
      const rawMin  = (opts.yAxis && opts.yAxis.min != null) ? opts.yAxis.min : Math.min.apply(null, allY);
      const rawMax  = (opts.yAxis && opts.yAxis.max != null) ? opts.yAxis.max : Math.max.apply(null, allY);
      const yNice   = u.niceScale(rawMin, rawMax, (opts.yAxis && opts.yAxis.ticks) ? opts.yAxis.ticks : 5);
      const yRange  = yNice.max - yNice.min || 1;
      const yScale  = function(v){ return chartH - (v - yNice.min) / yRange * chartH; };
      const yZero   = yScale(0);

      // X band
      const n         = bars.length;
      const outerFrac = (opts.paddingOuter != null) ? opts.paddingOuter : 0.04;
      const innerFrac = (opts.paddingInner != null) ? opts.paddingInner : 0.25;
      const outerPx   = chartW * outerFrac;
      const bandStep  = (chartW - 2 * outerPx) / n;
      const bandW     = Math.max(1, bandStep * (1 - innerFrac));
      function xBand(i) { return outerPx + i * bandStep + (bandStep - bandW) / 2; }

      const svg  = u.svgEl('svg', { width: W, height: heightOpt, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Waterfall chart' });
      this._svg = svg;
      const g    = u.svgEl('g', { transform: 'translate(' + mg.left + ',' + mg.top + ')' });
      svg.appendChild(g);

      // Grid
      if (opts.grid !== false) {
        const gGrid = u.svgEl('g', { 'class': 'mts-chart__grid' });
        for (let ti = 0; ti < yNice.ticks.length; ti++) {
          const y = Math.round(yScale(yNice.ticks[ti]));
          gGrid.appendChild(u.svgEl('line', { x1: 0, y1: y, x2: chartW, y2: y, 'class': 'mts-chart__grid-line' }));
        }
        g.appendChild(gGrid);
      }

      // Zero line
      if (yNice.min < 0 && yNice.max > 0) {
        g.appendChild(u.svgEl('line', { x1: 0, y1: Math.round(yZero), x2: chartW, y2: Math.round(yZero), 'class': 'mts-chart__zero-line' }));
      }

      const self    = this;
      const barTgts = [];

      for (let i = 0; i < bars.length; i++) {
        const bar  = bars[i];
        const bx   = Math.round(xBand(i));
        const bw   = Math.round(bandW);
        const top  = Math.round(yScale(Math.max(bar.base, bar.base + bar.value)));
        const bot  = Math.round(yScale(Math.min(bar.base, bar.base + bar.value)));
        const bh   = Math.max(1, bot - top);
        const midY = Math.round(yScale(bar.base));

        const rect = u.svgEl('rect', {
          x: bx, y: animate ? midY : top,
          width: bw, height: animate ? 0 : bh,
          fill: bar.color, rx: 3, 'class': 'mts-chart__bar', style: 'cursor:pointer',
        });

        (function (el, bar) {
          el.addEventListener('mouseenter', function (e) { self._showTooltip(e, bar.label, bar.value, bar.type === 'total' ? 'Total' : '', bar.color); el.setAttribute('opacity', '0.75'); });
          el.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
          el.addEventListener('mouseleave', function ()  { self._hideTooltip(); el.setAttribute('opacity', '1'); });
          el.addEventListener('click',      function ()  { self._emit('click', { label: bar.label, value: bar.value, type: bar.type, color: bar.color }); });
        }(rect, bar));

        if (animate) barTgts.push({ el: rect, fromY: midY, toY: top, toH: bh });
        g.appendChild(rect);

        // Connector to next bar
        if (connector && i < bars.length - 1) {
          const nextBase = bars[i + 1].base;
          const connY    = Math.round(yScale(bars[i].type === 'total' ? bars[i].value : bars[i].base + bars[i].value));
          const nextX    = Math.round(xBand(i + 1));
          g.appendChild(u.svgEl('line', {
            x1: bx + bw, y1: connY, x2: nextX, y2: connY,
            stroke: 'var(--mts-text-muted,#64748b)', 'stroke-width': 1, 'stroke-dasharray': '3 2',
          }));
        }

        // Value label above/below bar
        if (bh > 8) {
          const lblY = top - 6;
          const lbl  = u.svgEl('text', {
            x: bx + bw / 2, y: lblY,
            'text-anchor': 'middle', 'class': 'mts-chart__axis-label', style: 'font-size:10px',
          });
          lbl.textContent = (bar.value >= 0 ? '+' : '') + fmt(bar.value);
          g.appendChild(lbl);
        }
      }

      // Eje Y
      const gAxisY = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--y' });
      gAxisY.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: 0, y2: chartH, 'class': 'mts-chart__axis-line' }));
      for (let ti = 0; ti < yNice.ticks.length; ti++) {
        const y = Math.round(yScale(yNice.ticks[ti]));
        gAxisY.appendChild(u.svgEl('line', { x1: -4, y1: y, x2: 0, y2: y, 'class': 'mts-chart__axis-tick' }));
        const lbl = u.svgEl('text', { x: -10, y: y, 'text-anchor': 'end', 'dominant-baseline': 'middle', 'class': 'mts-chart__axis-label' });
        lbl.textContent = fmt(yNice.ticks[ti]);
        gAxisY.appendChild(lbl);
      }
      g.appendChild(gAxisY);

      // Eje X
      const gAxisX = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--x', transform: 'translate(0,' + chartH + ')' });
      gAxisX.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: chartW, y2: 0, 'class': 'mts-chart__axis-line' }));
      for (let i = 0; i < bars.length; i++) {
        const x = Math.round(xBand(i) + bandW / 2);
        gAxisX.appendChild(u.svgEl('line', { x1: x, y1: 0, x2: x, y2: 4, 'class': 'mts-chart__axis-tick' }));
        const lbl = u.svgEl('text', { x: x, y: 16, 'text-anchor': 'middle', 'class': 'mts-chart__axis-label' });
        lbl.textContent = bars[i].label;
        gAxisX.appendChild(lbl);
      }
      g.appendChild(gAxisX);

      this._el.insertBefore(svg, this._tooltipEl);

      if (animate && barTgts.length) {
        const duration = opts.animateDuration || 500;
        const t0 = performance.now();
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < barTgts.length; i++) {
            const b = barTgts[i];
            b.el.setAttribute('y',      b.fromY + (b.toY - b.fromY) * ease);
            b.el.setAttribute('height', b.toH * ease);
          }
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < barTgts.length; i++) { barTgts[i].el.setAttribute('y', barTgts[i].toY); barTgts[i].el.setAttribute('height', barTgts[i].toH); }
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  // ── MtsChartFunnel ───────────────────────────────────────────────────────────

  class MtsChartFunnel extends MtsChart {
    get _type() { return 'funnel'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }

      const cfg    = this._cfg;
      const data   = cfg.data    || {};
      const opts   = cfg.options || {};
      const labels = data.labels || [];
      const values = data.values || [];
      const n      = Math.min(labels.length, values.length);
      if (n === 0) return;

      const showPct = opts.showPercentage !== false;
      const fmt     = opts.formatter || u.defaultFmt;
      const animate = opts.animate !== false;

      const W         = this._el.clientWidth || 400;
      const H         = opts.height || (n * 56 + 32);
      const mg        = {
        top:    (opts.margin && opts.margin.top    != null) ? opts.margin.top    : 16,
        right:  (opts.margin && opts.margin.right  != null) ? opts.margin.right  : 16,
        bottom: (opts.margin && opts.margin.bottom != null) ? opts.margin.bottom : 16,
        left:   (opts.margin && opts.margin.left   != null) ? opts.margin.left   : 16,
      };
      const chartW  = W - mg.left - mg.right;
      const chartH  = H - mg.top - mg.bottom;
      const stageH  = chartH / n;
      const maxVal  = values[0] || 1;
      const maxW    = chartW * 0.7;
      const cx      = mg.left + chartW / 2;
      const labelX  = mg.left + chartW * 0.15;
      const valueX  = mg.left + chartW * 0.85;

      const svg  = u.svgEl('svg', { width: W, height: H, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Funnel chart' });
      this._svg = svg;
      const self = this;
      const animEls = [];

      for (let i = 0; i < n; i++) {
        const color    = (opts.colors && opts.colors[i]) || u.PALETTE[i % u.PALETTE.length];
        const topW     = (values[i] / maxVal) * maxW;
        const botW     = i < n - 1 ? (values[i + 1] / maxVal) * maxW : topW * 0.6;
        const topY     = mg.top + i * stageH;
        const botY     = topY + stageH - 2;
        const padV     = 1;

        const pts = [
          (cx - topW / 2).toFixed(1) + ',' + (topY + padV).toFixed(1),
          (cx + topW / 2).toFixed(1) + ',' + (topY + padV).toFixed(1),
          (cx + botW / 2).toFixed(1) + ',' + (botY - padV).toFixed(1),
          (cx - botW / 2).toFixed(1) + ',' + (botY - padV).toFixed(1),
        ].join(' ');

        const poly = u.svgEl('polygon', {
          points: pts, fill: color, opacity: animate ? 0 : 0.85,
          'class': 'mts-chart__bar', style: 'cursor:pointer',
        });

        (function (el, val, lbl, col, idx) {
          const pct = idx > 0 ? (val / values[idx - 1] * 100).toFixed(1) + '%' : '100%';
          el.addEventListener('mouseenter', function (e) { self._showTooltip(e, lbl, val, pct, col); el.setAttribute('opacity', '1'); });
          el.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
          el.addEventListener('mouseleave', function ()  { self._hideTooltip(); el.setAttribute('opacity', '0.85'); });
          el.addEventListener('click',      function ()  { self._emit('click', { label: lbl, value: val, index: idx, color: col }); });
        }(poly, values[i], labels[i], color, i));

        if (animate) animEls.push(poly);
        svg.appendChild(poly);

        // Stage label (left)
        const lblEl = u.svgEl('text', {
          x: labelX, y: topY + stageH / 2,
          'text-anchor': 'middle', 'dominant-baseline': 'middle',
          'class': 'mts-chart__axis-label', style: 'font-size:11px;pointer-events:none',
        });
        lblEl.textContent = labels[i];
        svg.appendChild(lblEl);

        // Value / % (right)
        const valStr = fmt(values[i]) + (showPct && i > 0 ? ' (' + (values[i] / values[i - 1] * 100).toFixed(0) + '%)' : '');
        const valEl  = u.svgEl('text', {
          x: valueX, y: topY + stageH / 2,
          'text-anchor': 'middle', 'dominant-baseline': 'middle',
          'class': 'mts-chart__axis-label', style: 'font-size:11px;font-weight:600;pointer-events:none',
        });
        valEl.textContent = valStr;
        svg.appendChild(valEl);
      }

      this._el.insertBefore(svg, this._tooltipEl);

      if (animate && animEls.length) {
        const duration = opts.animateDuration || 600;
        const t0 = performance.now();
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < animEls.length; i++) animEls[i].setAttribute('opacity', 0.85 * ease);
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < animEls.length; i++) animEls[i].setAttribute('opacity', 0.85);
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  global.MTS.ChartHeatmap   = MtsChartHeatmap;
  global.MTS.ChartTreemap   = MtsChartTreemap;
  global.MTS.ChartRadar     = MtsChartRadar;
  global.MTS.ChartWaterfall = MtsChartWaterfall;
  global.MTS.ChartFunnel    = MtsChartFunnel;

}(typeof window !== 'undefined' ? window : this));
