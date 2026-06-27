/**
 * MTS.ChartScatter / MTS.ChartBubble / MTS.ChartHistogram / MTS.ChartBoxPlot (v1.0.0)
 * SVG puro · 0 dependencias · XSS-safe
 *
 * Dep: matios-ui-chart.js (debe cargarse antes)
 *
 * Exporta:
 *   MTS.ChartScatter   — puntos en espacio X/Y continuo
 *   MTS.ChartBubble    — Scatter con radio como tercer eje
 *   MTS.ChartHistogram — barras con bins calculados por el componente
 *   MTS.ChartBoxPlot   — mediana, Q1, Q3, min, max por categoría
 *
 * Opciones comunes:
 *   height    {number}   — alto en px. Default: 300
 *   margin    {object}   — { top, right, bottom, left }
 *   grid      {boolean}  — Default: true
 *   animate   {boolean}  — Default: true
 *   legend    {boolean}  — Default: true (oculto en Scatter con 1 dataset)
 *
 * Scatter / Bubble:
 *   data.datasets[i].values = [{x, y}]      (Scatter)
 *   data.datasets[i].values = [{x, y, r}]   (Bubble — r en unidades de datos)
 *   pointRadius {number}  — radio del punto en px. Default: 5 (Scatter)
 *   rMin        {number}  — radio mínimo en px para Bubble. Default: 4
 *   rMax        {number}  — radio máximo en px para Bubble. Default: 24
 *   xAxis / yAxis: { min, max, ticks, formatter }
 *
 * Histogram:
 *   data.values = [...]                      (shorthand)
 *   data.datasets = [{ values, label }]      (multi)
 *   bins {number}  — número de bins. Default: automático (Sturges)
 *
 * BoxPlot:
 *   data.labels = [...]
 *   data.datasets[i].values = [[...], [...], ...] (un array por categoría)
 *   data.datasets[i].stats  = [{min,q1,median,q3,max,whiskerLo,whiskerHi,outliers}]
 *   yAxis: { min, max, ticks, formatter }
 */
(function (global) {
  'use strict';

  if (!global.MTS || !global.MTS.Chart) {
    throw new Error('matios-ui-chart-statistical.js: MTS.Chart no encontrado. Incluir matios-ui-chart.js primero.');
  }

  const MtsChart = global.MTS.Chart;
  const u        = MtsChart._utils;

  // ── Tooltip X/Y (Scatter + Bubble) ──────────────────────────────────────────

  function _showTooltipXY(self, e, xVal, yVal, rVal, dsLabel, color, xFmt, yFmt) {
    const t = self._tooltipEl;
    while (t.firstChild) t.removeChild(t.firstChild);

    if (dsLabel) {
      const ds  = document.createElement('div');
      ds.className = 'mts-chart__tooltip-dataset';
      const dot = document.createElement('span');
      dot.className = 'mts-chart__tooltip-dot';
      dot.style.background = color;
      const nm  = document.createElement('span');
      nm.textContent = dsLabel;
      ds.appendChild(dot); ds.appendChild(nm);
      t.appendChild(ds);
    }

    let pairs = [['x', xFmt(xVal)], ['y', yFmt(yVal)]];
    if (rVal != null) pairs.push(['r', u.defaultFmt(rVal)]);

    for (let pi = 0; pi < pairs.length; pi++) {
      const row = document.createElement('div');
      row.className = 'mts-chart__tooltip-row';
      const lbl = document.createElement('span');
      lbl.className = 'mts-chart__tooltip-label';
      lbl.textContent = pairs[pi][0];
      const val = document.createElement('span');
      val.className = 'mts-chart__tooltip-value';
      val.textContent = pairs[pi][1];
      row.appendChild(lbl); row.appendChild(val);
      t.appendChild(row);
    }

    t.classList.add('mts-chart__tooltip--visible');
    self._moveTooltip(e);
  }

  // ── Ejes XY compartidos (Scatter + Bubble) ───────────────────────────────────

  function _appendAxesXY(g, chartW, chartH, xNice, yNice, xFmt, yFmt, u) {
    const gAxisY = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--y' });
    gAxisY.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: 0, y2: chartH, 'class': 'mts-chart__axis-line' }));
    for (let ti = 0; ti < yNice.ticks.length; ti++) {
      const y = Math.round(chartH - (yNice.ticks[ti] - yNice.min) / (yNice.max - yNice.min || 1) * chartH);
      gAxisY.appendChild(u.svgEl('line', { x1: -4, y1: y, x2: 0, y2: y, 'class': 'mts-chart__axis-tick' }));
      const lbl = u.svgEl('text', { x: -10, y: y, 'text-anchor': 'end', 'dominant-baseline': 'middle', 'class': 'mts-chart__axis-label' });
      lbl.textContent = yFmt(yNice.ticks[ti]);
      gAxisY.appendChild(lbl);
    }
    g.appendChild(gAxisY);

    const gAxisX = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--x', transform: 'translate(0,' + chartH + ')' });
    gAxisX.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: chartW, y2: 0, 'class': 'mts-chart__axis-line' }));
    for (let ti = 0; ti < xNice.ticks.length; ti++) {
      const x = Math.round((xNice.ticks[ti] - xNice.min) / (xNice.max - xNice.min || 1) * chartW);
      gAxisX.appendChild(u.svgEl('line', { x1: x, y1: 0, x2: x, y2: 4, 'class': 'mts-chart__axis-tick' }));
      const lbl = u.svgEl('text', { x: x, y: 16, 'text-anchor': 'middle', 'class': 'mts-chart__axis-label' });
      lbl.textContent = xFmt(xNice.ticks[ti]);
      gAxisX.appendChild(lbl);
    }
    g.appendChild(gAxisX);
  }

  function _appendGridXY(g, chartW, chartH, xNice, yNice, u) {
    const gGrid = u.svgEl('g', { 'class': 'mts-chart__grid' });
    for (let ti = 0; ti < yNice.ticks.length; ti++) {
      const y = Math.round(chartH - (yNice.ticks[ti] - yNice.min) / (yNice.max - yNice.min || 1) * chartH);
      gGrid.appendChild(u.svgEl('line', { x1: 0, y1: y, x2: chartW, y2: y, 'class': 'mts-chart__grid-line' }));
    }
    for (let ti = 0; ti < xNice.ticks.length; ti++) {
      const x = Math.round((xNice.ticks[ti] - xNice.min) / (xNice.max - xNice.min || 1) * chartW);
      gGrid.appendChild(u.svgEl('line', { x1: x, y1: 0, x2: x, y2: chartH, 'class': 'mts-chart__grid-line' }));
    }
    g.appendChild(gGrid);
  }

  // ── MtsChartScatter ──────────────────────────────────────────────────────────

  class MtsChartScatter extends MtsChart {
    get _type() { return 'scatter'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }
      if (this._legendEl) { this._legendEl.remove(); this._legendEl = null; }

      const cfg      = this._cfg;
      const data     = cfg.data    || { datasets: [] };
      const opts     = cfg.options || {};
      const datasets = data.datasets || [];
      if (datasets.length === 0) return;

      const W         = this._el.clientWidth || 400;
      const heightOpt = opts.height || 300;
      const mg        = {
        top:    (opts.margin && opts.margin.top    != null) ? opts.margin.top    : 20,
        right:  (opts.margin && opts.margin.right  != null) ? opts.margin.right  : 20,
        bottom: (opts.margin && opts.margin.bottom != null) ? opts.margin.bottom : 44,
        left:   (opts.margin && opts.margin.left   != null) ? opts.margin.left   : 56,
      };
      const chartW = W - mg.left - mg.right;
      const chartH = heightOpt - mg.top - mg.bottom;
      if (chartW <= 0 || chartH <= 0) return;

      let allX = [], allY = [];
      for (let d = 0; d < datasets.length; d++) {
        const vals = datasets[d].values || [];
        for (let i = 0; i < vals.length; i++) { allX.push(vals[i].x); allY.push(vals[i].y); }
      }
      if (allX.length === 0) return;

      const xNice  = u.niceScale(
        (opts.xAxis && opts.xAxis.min != null) ? opts.xAxis.min : Math.min.apply(null, allX),
        (opts.xAxis && opts.xAxis.max != null) ? opts.xAxis.max : Math.max.apply(null, allX),
        (opts.xAxis && opts.xAxis.ticks) ? opts.xAxis.ticks : 5
      );
      const yNice  = u.niceScale(
        (opts.yAxis && opts.yAxis.min != null) ? opts.yAxis.min : Math.min.apply(null, allY),
        (opts.yAxis && opts.yAxis.max != null) ? opts.yAxis.max : Math.max.apply(null, allY),
        (opts.yAxis && opts.yAxis.ticks) ? opts.yAxis.ticks : 5
      );
      const xRange  = xNice.max - xNice.min || 1;
      const yRange  = yNice.max - yNice.min || 1;
      const xScale  = function (v) { return (v - xNice.min) / xRange * chartW; };
      const yScale  = function (v) { return chartH - (v - yNice.min) / yRange * chartH; };
      const xFmt    = (opts.xAxis && opts.xAxis.formatter) ? opts.xAxis.formatter : u.defaultFmt;
      const yFmt    = (opts.yAxis && opts.yAxis.formatter) ? opts.yAxis.formatter : u.defaultFmt;
      const dotR    = (opts.pointRadius != null) ? opts.pointRadius : 5;
      const animate = opts.animate !== false;
      const self    = this;

      const svg = u.svgEl('svg', { width: W, height: heightOpt, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Scatter chart' });
      this._svg = svg;
      const g   = u.svgEl('g', { transform: 'translate(' + mg.left + ',' + mg.top + ')' });
      svg.appendChild(g);

      if (opts.grid !== false) _appendGridXY(g, chartW, chartH, xNice, yNice, u);

      const dots = [];
      for (let d = 0; d < datasets.length; d++) {
        const ds    = datasets[d];
        const color = ds.color || u.PALETTE[d % u.PALETTE.length];
        const vals  = ds.values || [];
        for (let i = 0; i < vals.length; i++) {
          const pt     = vals[i];
          const cx     = Math.round(xScale(pt.x));
          const cy     = Math.round(yScale(pt.y));
          const circle = u.svgEl('circle', {
            cx: cx, cy: cy, r: animate ? 0 : dotR,
            fill: color, opacity: 0.8, 'class': 'mts-chart__scatter-dot', style: 'cursor:pointer',
          });
          (function (el, pt, dsLabel, col) {
            el.addEventListener('mouseenter', function (e) { _showTooltipXY(self, e, pt.x, pt.y, null, dsLabel, col, xFmt, yFmt); el.setAttribute('opacity', '1'); });
            el.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
            el.addEventListener('mouseleave', function ()  { self._hideTooltip(); el.setAttribute('opacity', '0.8'); });
            el.addEventListener('click',      function ()  { self._emit('click', { x: pt.x, y: pt.y, datasetIndex: d, index: i, color: col }); });
          }(circle, pt, ds.label || '', color));
          if (animate) dots.push({ el: circle, r: dotR });
          g.appendChild(circle);
        }
      }

      _appendAxesXY(g, chartW, chartH, xNice, yNice, xFmt, yFmt, u);
      this._el.insertBefore(svg, this._tooltipEl);
      if (opts.legend !== false && datasets.length > 1) this._legendEl = this._buildLegend(datasets, 'mts-chart__legend-dot--circle');

      if (animate && dots.length > 0) {
        const duration = opts.animateDuration || 400;
        const t0 = performance.now();
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < dots.length; i++) dots[i].el.setAttribute('r', dots[i].r * ease);
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < dots.length; i++) dots[i].el.setAttribute('r', dots[i].r);
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  // ── MtsChartBubble ───────────────────────────────────────────────────────────

  class MtsChartBubble extends MtsChart {
    get _type() { return 'bubble'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }
      if (this._legendEl) { this._legendEl.remove(); this._legendEl = null; }

      const cfg      = this._cfg;
      const data     = cfg.data    || { datasets: [] };
      const opts     = cfg.options || {};
      const datasets = data.datasets || [];
      if (datasets.length === 0) return;

      const W         = this._el.clientWidth || 400;
      const heightOpt = opts.height || 300;
      const mg        = {
        top:    (opts.margin && opts.margin.top    != null) ? opts.margin.top    : 20,
        right:  (opts.margin && opts.margin.right  != null) ? opts.margin.right  : 24,
        bottom: (opts.margin && opts.margin.bottom != null) ? opts.margin.bottom : 44,
        left:   (opts.margin && opts.margin.left   != null) ? opts.margin.left   : 56,
      };
      const chartW = W - mg.left - mg.right;
      const chartH = heightOpt - mg.top - mg.bottom;
      if (chartW <= 0 || chartH <= 0) return;

      let allX = [], allY = [], allR = [];
      for (let d = 0; d < datasets.length; d++) {
        const vals = datasets[d].values || [];
        for (let i = 0; i < vals.length; i++) {
          allX.push(vals[i].x); allY.push(vals[i].y);
          if (vals[i].r != null) allR.push(vals[i].r);
        }
      }
      if (allX.length === 0) return;

      const rMinPx   = (opts.rMin != null) ? opts.rMin : 4;
      const rMaxPx   = (opts.rMax != null) ? opts.rMax : 24;
      const rDataMin = allR.length ? Math.min.apply(null, allR) : 0;
      const rDataMax = allR.length ? Math.max.apply(null, allR) : 1;
      const rRange   = (rDataMax - rDataMin) || 1;
      function rScale(rv) {
        if (!allR.length || rv == null) return (rMinPx + rMaxPx) / 2;
        return rMinPx + ((rv - rDataMin) / rRange) * (rMaxPx - rMinPx);
      }

      const xNice  = u.niceScale(
        (opts.xAxis && opts.xAxis.min != null) ? opts.xAxis.min : Math.min.apply(null, allX),
        (opts.xAxis && opts.xAxis.max != null) ? opts.xAxis.max : Math.max.apply(null, allX),
        (opts.xAxis && opts.xAxis.ticks) ? opts.xAxis.ticks : 5
      );
      const yNice  = u.niceScale(
        (opts.yAxis && opts.yAxis.min != null) ? opts.yAxis.min : Math.min.apply(null, allY),
        (opts.yAxis && opts.yAxis.max != null) ? opts.yAxis.max : Math.max.apply(null, allY),
        (opts.yAxis && opts.yAxis.ticks) ? opts.yAxis.ticks : 5
      );
      const xRange  = xNice.max - xNice.min || 1;
      const yRange  = yNice.max - yNice.min || 1;
      const xScale  = function (v) { return (v - xNice.min) / xRange * chartW; };
      const yScale  = function (v) { return chartH - (v - yNice.min) / yRange * chartH; };
      const xFmt    = (opts.xAxis && opts.xAxis.formatter) ? opts.xAxis.formatter : u.defaultFmt;
      const yFmt    = (opts.yAxis && opts.yAxis.formatter) ? opts.yAxis.formatter : u.defaultFmt;
      const animate = opts.animate !== false;
      const self    = this;

      const svg = u.svgEl('svg', { width: W, height: heightOpt, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Bubble chart' });
      this._svg = svg;
      const g   = u.svgEl('g', { transform: 'translate(' + mg.left + ',' + mg.top + ')' });
      svg.appendChild(g);

      if (opts.grid !== false) _appendGridXY(g, chartW, chartH, xNice, yNice, u);

      const bubbles = [];
      for (let d = 0; d < datasets.length; d++) {
        const ds    = datasets[d];
        const color = ds.color || u.PALETTE[d % u.PALETTE.length];
        const vals  = datasets[d].values || [];
        for (let i = 0; i < vals.length; i++) {
          const pt     = vals[i];
          const cx     = Math.round(xScale(pt.x));
          const cy     = Math.round(yScale(pt.y));
          const pr     = rScale(pt.r);
          const circle = u.svgEl('circle', {
            cx: cx, cy: cy, r: animate ? 0 : pr,
            fill: color, opacity: 0.55, stroke: color, 'stroke-width': 1.5,
            'class': 'mts-chart__scatter-dot', style: 'cursor:pointer',
          });
          (function (el, pt, dsLabel, col, finalR) {
            el.addEventListener('mouseenter', function (e) { _showTooltipXY(self, e, pt.x, pt.y, pt.r, dsLabel, col, xFmt, yFmt); el.setAttribute('opacity', '0.8'); });
            el.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
            el.addEventListener('mouseleave', function ()  { self._hideTooltip(); el.setAttribute('opacity', '0.55'); });
            el.addEventListener('click',      function ()  { self._emit('click', { x: pt.x, y: pt.y, r: pt.r, datasetIndex: d, index: i, color: col }); });
          }(circle, pt, ds.label || '', color, pr));
          if (animate) bubbles.push({ el: circle, r: pr });
          g.appendChild(circle);
        }
      }

      _appendAxesXY(g, chartW, chartH, xNice, yNice, xFmt, yFmt, u);
      this._el.insertBefore(svg, this._tooltipEl);
      if (opts.legend !== false && datasets.length > 1) this._legendEl = this._buildLegend(datasets, 'mts-chart__legend-dot--circle');

      if (animate && bubbles.length > 0) {
        const duration = opts.animateDuration || 500;
        const t0 = performance.now();
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < bubbles.length; i++) bubbles[i].el.setAttribute('r', bubbles[i].r * ease);
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < bubbles.length; i++) bubbles[i].el.setAttribute('r', bubbles[i].r);
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  // ── MtsChartHistogram ────────────────────────────────────────────────────────

  class MtsChartHistogram extends MtsChart {
    get _type() { return 'histogram'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }
      if (this._legendEl) { this._legendEl.remove(); this._legendEl = null; }

      const cfg  = this._cfg;
      const data = cfg.data    || {};
      const opts = cfg.options || {};

      const datasets = data.datasets ? data.datasets : data.values ? [{ values: data.values, label: data.label || '' }] : [];
      if (datasets.length === 0) return;

      const W         = this._el.clientWidth || 400;
      const heightOpt = opts.height || 300;
      const mg        = {
        top:    (opts.margin && opts.margin.top    != null) ? opts.margin.top    : 20,
        right:  (opts.margin && opts.margin.right  != null) ? opts.margin.right  : 16,
        bottom: (opts.margin && opts.margin.bottom != null) ? opts.margin.bottom : 44,
        left:   (opts.margin && opts.margin.left   != null) ? opts.margin.left   : 56,
      };
      const chartW = W - mg.left - mg.right;
      const chartH = heightOpt - mg.top - mg.bottom;
      if (chartW <= 0 || chartH <= 0) return;

      let globalMin = Infinity, globalMax = -Infinity;
      for (let d = 0; d < datasets.length; d++) {
        const vals = datasets[d].values || [];
        for (let i = 0; i < vals.length; i++) {
          if (vals[i] < globalMin) globalMin = vals[i];
          if (vals[i] > globalMax) globalMax = vals[i];
        }
      }
      if (!isFinite(globalMin)) return;

      const dataMin = (opts.xAxis && opts.xAxis.min != null) ? opts.xAxis.min : globalMin;
      const dataMax = (opts.xAxis && opts.xAxis.max != null) ? opts.xAxis.max : globalMax;
      const maxN    = Math.max.apply(null, datasets.map(function (d) { return (d.values || []).length; }));
      const nBins   = (opts.bins != null) ? opts.bins : Math.max(5, Math.min(40, Math.ceil(Math.log2(maxN) + 1)));

      function computeBins(values) {
        const bw     = (dataMax - dataMin) / nBins || 1;
        const counts = new Array(nBins).fill(0);
        for (let i = 0; i < values.length; i++) {
          let idx = Math.floor((values[i] - dataMin) / bw);
          if (idx >= nBins) idx = nBins - 1;
          if (idx < 0)      idx = 0;
          counts[idx]++;
        }
        const bins = [];
        for (let i = 0; i < nBins; i++) {
          bins.push({ lo: dataMin + i * bw, hi: dataMin + (i + 1) * bw, count: counts[i] });
        }
        return bins;
      }

      const allBinSets = datasets.map(function (ds) { return computeBins(ds.values || []); });

      let maxCount = 0;
      for (let d = 0; d < allBinSets.length; d++) {
        for (let i = 0; i < allBinSets[d].length; i++) {
          if (allBinSets[d][i].count > maxCount) maxCount = allBinSets[d][i].count;
        }
      }
      if (maxCount === 0) maxCount = 1;

      const yNice   = u.niceScale(0, maxCount, (opts.yAxis && opts.yAxis.ticks) ? opts.yAxis.ticks : 5);
      const yRange  = yNice.max - yNice.min || 1;
      const yScale  = function (v) { return chartH - v / yRange * chartH; };
      const yFmt    = (opts.yAxis && opts.yAxis.formatter) ? opts.yAxis.formatter : function (v) { return String(Math.round(v)); };
      const xFmt    = (opts.xAxis && opts.xAxis.formatter) ? opts.xAxis.formatter : u.defaultFmt;
      const animate = opts.animate !== false;
      const self    = this;
      const binW    = chartW / nBins;
      const nD      = datasets.length;
      const yZero   = chartH;

      const svg = u.svgEl('svg', { width: W, height: heightOpt, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Histogram' });
      this._svg = svg;
      const g   = u.svgEl('g', { transform: 'translate(' + mg.left + ',' + mg.top + ')' });
      svg.appendChild(g);

      if (opts.grid !== false) {
        const gGrid = u.svgEl('g', { 'class': 'mts-chart__grid' });
        for (let ti = 0; ti < yNice.ticks.length; ti++) {
          const y = Math.round(yScale(yNice.ticks[ti]));
          gGrid.appendChild(u.svgEl('line', { x1: 0, y1: y, x2: chartW, y2: y, 'class': 'mts-chart__grid-line' }));
        }
        g.appendChild(gGrid);
      }

      const barTgts = [];
      for (let d = 0; d < nD; d++) {
        const ds    = datasets[d];
        const color = ds.color || u.PALETTE[d % u.PALETTE.length];
        const bins  = allBinSets[d];
        const dsW   = nD > 1 ? (binW / nD) - 0.5 : binW;
        const dsOff = nD > 1 ? d * (binW / nD) : 0;

        for (let i = 0; i < bins.length; i++) {
          const bin = bins[i];
          const bx  = i * binW + dsOff;
          const bh  = Math.max(0, chartH - yScale(bin.count));
          const by  = yScale(bin.count);
          const rect = u.svgEl('rect', {
            x: Math.round(bx), y: animate ? yZero : Math.round(by),
            width: Math.max(1, Math.round(dsW)), height: animate ? 0 : Math.round(bh),
            fill: color, opacity: 0.85, 'class': 'mts-chart__bar',
          });
          (function (el, bin, dsLabel, col, dsIdx, binIdx) {
            el.addEventListener('mouseenter', function (e) { self._showTooltip(e, xFmt(bin.lo) + ' – ' + xFmt(bin.hi), bin.count, dsLabel, col); el.setAttribute('opacity', '1'); });
            el.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
            el.addEventListener('mouseleave', function ()  { self._hideTooltip(); el.setAttribute('opacity', '0.85'); });
            el.addEventListener('click',      function ()  { self._emit('click', { lo: bin.lo, hi: bin.hi, count: bin.count, datasetIndex: dsIdx, index: binIdx, color: col }); });
          }(rect, bin, ds.label || '', color, d, i));
          if (animate) barTgts.push({ el: rect, ty: Math.round(by), th: Math.round(bh) });
          g.appendChild(rect);
        }
      }

      // Eje Y
      const gAxisY = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--y' });
      gAxisY.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: 0, y2: chartH, 'class': 'mts-chart__axis-line' }));
      for (let ti = 0; ti < yNice.ticks.length; ti++) {
        const y = Math.round(yScale(yNice.ticks[ti]));
        gAxisY.appendChild(u.svgEl('line', { x1: -4, y1: y, x2: 0, y2: y, 'class': 'mts-chart__axis-tick' }));
        const lbl = u.svgEl('text', { x: -10, y: y, 'text-anchor': 'end', 'dominant-baseline': 'middle', 'class': 'mts-chart__axis-label' });
        lbl.textContent = yFmt(yNice.ticks[ti]);
        gAxisY.appendChild(lbl);
      }
      g.appendChild(gAxisY);

      // Eje X
      const gAxisX = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--x', transform: 'translate(0,' + chartH + ')' });
      gAxisX.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: chartW, y2: 0, 'class': 'mts-chart__axis-line' }));
      const xLabelStep = Math.max(1, Math.ceil(nBins / 5));
      const bins0      = allBinSets[0];
      for (let i = 0; i <= nBins; i += xLabelStep) {
        const x   = Math.round(i * binW);
        const val = i < bins0.length ? bins0[i].lo : (bins0.length > 0 ? bins0[bins0.length - 1].hi : 0);
        gAxisX.appendChild(u.svgEl('line', { x1: x, y1: 0, x2: x, y2: 4, 'class': 'mts-chart__axis-tick' }));
        const lbl = u.svgEl('text', { x: x, y: 16, 'text-anchor': 'middle', 'class': 'mts-chart__axis-label' });
        lbl.textContent = xFmt(val);
        gAxisX.appendChild(lbl);
      }
      g.appendChild(gAxisX);

      this._el.insertBefore(svg, this._tooltipEl);
      if (opts.legend !== false && nD > 1) this._legendEl = this._buildLegend(datasets);

      if (animate && barTgts.length > 0) {
        const duration = opts.animateDuration || 500;
        const t0 = performance.now();
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < barTgts.length; i++) {
            const b = barTgts[i];
            b.el.setAttribute('y',      yZero + (b.ty - yZero) * ease);
            b.el.setAttribute('height', b.th * ease);
          }
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < barTgts.length; i++) { barTgts[i].el.setAttribute('y', barTgts[i].ty); barTgts[i].el.setAttribute('height', barTgts[i].th); }
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  // ── MtsChartBoxPlot ──────────────────────────────────────────────────────────

  class MtsChartBoxPlot extends MtsChart {
    get _type() { return 'box-plot'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }
      if (this._legendEl) { this._legendEl.remove(); this._legendEl = null; }

      const cfg      = this._cfg;
      const data     = cfg.data    || { labels: [], datasets: [] };
      const opts     = cfg.options || {};
      const labels   = data.labels   || [];
      const datasets = data.datasets || [];
      const nCat     = labels.length;
      const nD       = datasets.length;
      if (nCat === 0 || nD === 0) return;

      const W         = this._el.clientWidth || 400;
      const heightOpt = opts.height || 300;
      const mg        = {
        top:    (opts.margin && opts.margin.top    != null) ? opts.margin.top    : 20,
        right:  (opts.margin && opts.margin.right  != null) ? opts.margin.right  : 16,
        bottom: (opts.margin && opts.margin.bottom != null) ? opts.margin.bottom : 44,
        left:   (opts.margin && opts.margin.left   != null) ? opts.margin.left   : 56,
      };
      const chartW = W - mg.left - mg.right;
      const chartH = heightOpt - mg.top - mg.bottom;
      if (chartW <= 0 || chartH <= 0) return;

      function calcStats(vals) {
        if (!vals || vals.length === 0) return null;
        const sorted = vals.slice().sort(function (a, b) { return a - b; });
        const n      = sorted.length;
        const q1     = sorted[Math.floor(n * 0.25)];
        const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
        const q3     = sorted[Math.floor(n * 0.75)];
        const iqr    = q3 - q1;
        const lo     = q1 - 1.5 * iqr;
        const hi     = q3 + 1.5 * iqr;
        let whiskerLo = sorted[0], whiskerHi = sorted[n - 1];
        for (let i = 0;     i < n; i++) { if (sorted[i]     >= lo) { whiskerLo = sorted[i];     break; } }
        for (let i = n - 1; i >= 0; i--) { if (sorted[i]   <= hi) { whiskerHi = sorted[i];     break; } }
        const outliers = sorted.filter(function (v) { return v < lo || v > hi; });
        return { min: sorted[0], max: sorted[n - 1], q1: q1, median: median, q3: q3, whiskerLo: whiskerLo, whiskerHi: whiskerHi, outliers: outliers };
      }

      const statsMatrix = [];
      for (let d = 0; d < nD; d++) {
        const dsStats = [];
        const raw     = datasets[d];
        for (let c = 0; c < nCat; c++) {
          let st;
          if (raw.stats && raw.stats[c]) {
            st = raw.stats[c];
          } else if (raw.values && raw.values[c] != null) {
            st = Array.isArray(raw.values[c]) ? calcStats(raw.values[c]) : null;
          } else {
            st = null;
          }
          dsStats.push(st);
        }
        statsMatrix.push(dsStats);
      }

      let allVals = [];
      for (let d = 0; d < nD; d++) {
        for (let c = 0; c < nCat; c++) {
          const st = statsMatrix[d][c];
          if (st) allVals = allVals.concat([st.whiskerLo, st.whiskerHi, st.q1, st.q3, st.median], st.outliers || []);
        }
      }
      if (allVals.length === 0) return;

      const rawMin  = (opts.yAxis && opts.yAxis.min != null) ? opts.yAxis.min : Math.min.apply(null, allVals);
      const rawMax  = (opts.yAxis && opts.yAxis.max != null) ? opts.yAxis.max : Math.max.apply(null, allVals);
      const yNice   = u.niceScale(rawMin, rawMax, (opts.yAxis && opts.yAxis.ticks) ? opts.yAxis.ticks : 5);
      const yRange  = yNice.max - yNice.min || 1;
      const yScale  = function (v) { return chartH - (v - yNice.min) / yRange * chartH; };
      const yFmt    = (opts.yAxis && opts.yAxis.formatter) ? opts.yAxis.formatter : u.defaultFmt;
      const animate = opts.animate !== false;
      const self    = this;

      const outerFrac = (opts.paddingOuter != null) ? opts.paddingOuter : 0.05;
      const innerFrac = (opts.paddingInner != null) ? opts.paddingInner : 0.30;
      const outerPx   = chartW * outerFrac;
      const bandStep  = (chartW - 2 * outerPx) / nCat;
      const bandW     = Math.max(1, bandStep * (1 - innerFrac));
      const subW      = Math.max(4, bandW / nD);
      const boxW      = Math.max(4, subW * 0.7);

      function xSubCenter(c, d) {
        const groupX = outerPx + c * bandStep + (bandStep - bandW) / 2;
        return nD === 1 ? groupX + bandW / 2 : groupX + d * subW + subW / 2;
      }

      const svg = u.svgEl('svg', { width: W, height: heightOpt, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Box plot' });
      this._svg = svg;
      const g   = u.svgEl('g', { transform: 'translate(' + mg.left + ',' + mg.top + ')' });
      svg.appendChild(g);

      if (opts.grid !== false) {
        const gGrid = u.svgEl('g', { 'class': 'mts-chart__grid' });
        for (let ti = 0; ti < yNice.ticks.length; ti++) {
          const y = Math.round(yScale(yNice.ticks[ti]));
          gGrid.appendChild(u.svgEl('line', { x1: 0, y1: y, x2: chartW, y2: y, 'class': 'mts-chart__grid-line' }));
        }
        g.appendChild(gGrid);
      }

      const animTgts = [];

      for (let d = 0; d < nD; d++) {
        const ds    = datasets[d];
        const color = ds.color || u.PALETTE[d % u.PALETTE.length];

        for (let c = 0; c < nCat; c++) {
          const st = statsMatrix[d][c];
          if (!st) continue;

          const cx   = xSubCenter(c, d);
          const bx   = Math.round(cx - boxW / 2);
          const bw   = Math.round(boxW);
          const cxr  = Math.round(cx);
          const capW = Math.round(boxW * 0.45);

          const yQ1  = Math.round(yScale(st.q1));
          const yQ3  = Math.round(yScale(st.q3));
          const yMed = Math.round(yScale(st.median));
          const yWlo = Math.round(yScale(st.whiskerLo));
          const yWhi = Math.round(yScale(st.whiskerHi));

          // Whisker line
          const whisker = u.svgEl('line', {
            x1: cxr, y1: animate ? yMed : yWhi, x2: cxr, y2: animate ? yMed : yWlo,
            stroke: color, 'stroke-width': 1.5, 'stroke-dasharray': '3 2', opacity: 0.7,
          });
          g.appendChild(whisker);
          if (animate) animTgts.push({ type: 'whisker', el: whisker, fromY1: yMed, toY1: yWhi, fromY2: yMed, toY2: yWlo });

          // Whisker caps
          const capHi = u.svgEl('line', {
            x1: cxr - capW, y1: animate ? yMed : yWhi, x2: cxr + capW, y2: animate ? yMed : yWhi,
            stroke: color, 'stroke-width': 1.5,
          });
          const capLo = u.svgEl('line', {
            x1: cxr - capW, y1: animate ? yMed : yWlo, x2: cxr + capW, y2: animate ? yMed : yWlo,
            stroke: color, 'stroke-width': 1.5,
          });
          g.appendChild(capHi);
          g.appendChild(capLo);
          if (animate) {
            animTgts.push({ type: 'cap', el: capHi, fromY: yMed, toY: yWhi });
            animTgts.push({ type: 'cap', el: capLo, fromY: yMed, toY: yWlo });
          }

          // Box Q1–Q3
          const boxH = Math.max(2, yQ1 - yQ3);
          const box  = u.svgEl('rect', {
            x: bx, y: animate ? yMed : yQ3,
            width: bw, height: animate ? 0 : boxH,
            fill: color, opacity: 0.3, stroke: color, 'stroke-width': 1.5,
            'class': 'mts-chart__bar', rx: 2,
          });
          g.appendChild(box);
          if (animate) animTgts.push({ type: 'box', el: box, fromY: yMed, toY: yQ3, toH: boxH });

          // Median line
          g.appendChild(u.svgEl('line', {
            x1: bx, y1: yMed, x2: bx + bw, y2: yMed,
            stroke: color, 'stroke-width': 2.5,
          }));

          // Outliers
          if (st.outliers && st.outliers.length > 0) {
            for (let oi = 0; oi < st.outliers.length; oi++) {
              g.appendChild(u.svgEl('circle', {
                cx: cxr, cy: Math.round(yScale(st.outliers[oi])), r: 3,
                fill: 'none', stroke: color, 'stroke-width': 1.5, opacity: 0.7,
              }));
            }
          }

          // Tooltip
          (function (boxEl, st, cat, dsLabel, col, dsIdx, catIdx) {
            function showBoxTip(e) {
              const t = self._tooltipEl;
              while (t.firstChild) t.removeChild(t.firstChild);
              const header = document.createElement('div');
              header.className = 'mts-chart__tooltip-dataset';
              const dot2 = document.createElement('span');
              dot2.className = 'mts-chart__tooltip-dot';
              dot2.style.background = col;
              const nm = document.createElement('span');
              nm.textContent = (dsLabel ? dsLabel + ' · ' : '') + cat;
              header.appendChild(dot2); header.appendChild(nm);
              t.appendChild(header);
              let rows = [['Max', st.max], ['Q3', st.q3], ['Mediana', st.median], ['Q1', st.q1], ['Min', st.min]];
              for (let ri = 0; ri < rows.length; ri++) {
                const row = document.createElement('div');
                row.className = 'mts-chart__tooltip-row';
                const lbl2 = document.createElement('span');
                lbl2.className = 'mts-chart__tooltip-label';
                lbl2.textContent = rows[ri][0];
                const val2 = document.createElement('span');
                val2.className = 'mts-chart__tooltip-value';
                val2.textContent = yFmt(rows[ri][1]);
                row.appendChild(lbl2); row.appendChild(val2);
                t.appendChild(row);
              }
              t.classList.add('mts-chart__tooltip--visible');
              self._moveTooltip(e);
              boxEl.setAttribute('opacity', '0.5');
            }
            boxEl.addEventListener('mouseenter', showBoxTip);
            boxEl.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
            boxEl.addEventListener('mouseleave', function () { self._hideTooltip(); boxEl.setAttribute('opacity', '0.3'); });
            boxEl.addEventListener('click',      function () { self._emit('click', { label: cat, min: st.min, max: st.max, q1: st.q1, q3: st.q3, median: st.median, datasetIndex: dsIdx, index: catIdx, color: col }); });
          }(box, st, labels[c] || '', ds.label || '', color, d, c));
        }
      }

      // Eje Y
      const gAxisY = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--y' });
      gAxisY.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: 0, y2: chartH, 'class': 'mts-chart__axis-line' }));
      for (let ti = 0; ti < yNice.ticks.length; ti++) {
        const y = Math.round(yScale(yNice.ticks[ti]));
        gAxisY.appendChild(u.svgEl('line', { x1: -4, y1: y, x2: 0, y2: y, 'class': 'mts-chart__axis-tick' }));
        const lbl = u.svgEl('text', { x: -10, y: y, 'text-anchor': 'end', 'dominant-baseline': 'middle', 'class': 'mts-chart__axis-label' });
        lbl.textContent = yFmt(yNice.ticks[ti]);
        gAxisY.appendChild(lbl);
      }
      g.appendChild(gAxisY);

      // Eje X
      const gAxisX = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--x', transform: 'translate(0,' + chartH + ')' });
      gAxisX.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: chartW, y2: 0, 'class': 'mts-chart__axis-line' }));
      for (let c = 0; c < labels.length; c++) {
        const x = Math.round(outerPx + c * bandStep + bandStep / 2);
        gAxisX.appendChild(u.svgEl('line', { x1: x, y1: 0, x2: x, y2: 4, 'class': 'mts-chart__axis-tick' }));
        const lbl = u.svgEl('text', { x: x, y: 16, 'text-anchor': 'middle', 'class': 'mts-chart__axis-label' });
        lbl.textContent = labels[c];
        gAxisX.appendChild(lbl);
      }
      g.appendChild(gAxisX);

      this._el.insertBefore(svg, this._tooltipEl);
      if (opts.legend !== false && nD > 1) this._legendEl = this._buildLegend(datasets);

      if (animate && animTgts.length > 0) {
        const duration = opts.animateDuration || 600;
        const t0 = performance.now();
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < animTgts.length; i++) {
            const tgt = animTgts[i];
            if (tgt.type === 'whisker') {
              tgt.el.setAttribute('y1', tgt.fromY1 + (tgt.toY1 - tgt.fromY1) * ease);
              tgt.el.setAttribute('y2', tgt.fromY2 + (tgt.toY2 - tgt.fromY2) * ease);
            } else if (tgt.type === 'cap') {
              const y = tgt.fromY + (tgt.toY - tgt.fromY) * ease;
              tgt.el.setAttribute('y1', y);
              tgt.el.setAttribute('y2', y);
            } else if (tgt.type === 'box') {
              tgt.el.setAttribute('y',      tgt.fromY + (tgt.toY - tgt.fromY) * ease);
              tgt.el.setAttribute('height', tgt.toH * ease);
            }
          }
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < animTgts.length; i++) {
              const tgt = animTgts[i];
              if (tgt.type === 'whisker') { tgt.el.setAttribute('y1', tgt.toY1); tgt.el.setAttribute('y2', tgt.toY2); }
              else if (tgt.type === 'cap')  { tgt.el.setAttribute('y1', tgt.toY); tgt.el.setAttribute('y2', tgt.toY); }
              else if (tgt.type === 'box')  { tgt.el.setAttribute('y', tgt.toY); tgt.el.setAttribute('height', tgt.toH); }
            }
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  global.MTS.ChartScatter   = MtsChartScatter;
  global.MTS.ChartBubble    = MtsChartBubble;
  global.MTS.ChartHistogram = MtsChartHistogram;
  global.MTS.ChartBoxPlot   = MtsChartBoxPlot;

}(typeof window !== 'undefined' ? window : this));
