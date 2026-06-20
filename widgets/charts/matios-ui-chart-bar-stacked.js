/**
 * MTS.ChartBarStacked / MTS.ChartBarStackedH (v2.1.0)
 * SVG puro · 0 dependencias · XSS-safe
 *
 * Dep: matios-ui-chart.js (debe cargarse antes)
 *
 * Exporta:
 *   MTS.ChartBarStacked  — barras apiladas verticales
 *   MTS.ChartBarStackedH — barras apiladas horizontales
 *
 * Ambas asumen valores positivos (usa Math.abs internamente).
 */
(function (global) {
  'use strict';

  if (!global.MTS || !global.MTS.Chart) {
    throw new Error('matios-ui-chart-bar-stacked.js: MTS.Chart no encontrado. Incluir matios-ui-chart.js primero.');
  }

  const MtsChart = global.MTS.Chart;
  const u        = MtsChart._utils;

  // ── MtsChartBarStacked (vertical) ────────────────────────────────────────────

  class MtsChartBarStacked extends MtsChart {
    get _type() { return 'bar-stacked'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }
      if (this._legendEl) { this._legendEl.remove(); this._legendEl = null; }

      const cfg      = this._cfg;
      const data     = cfg.data    || { labels: [], datasets: [] };
      const opts     = cfg.options || {};
      const labels   = data.labels   || [];
      const datasets = data.datasets || [];
      const n        = labels.length;
      const nD       = datasets.length;

      if (n === 0 || nD === 0) return;

      const W         = this._el.clientWidth || 400;
      const heightOpt = opts.height || 300;
      const mg = {
        top:    (opts.margin && opts.margin.top    != null) ? opts.margin.top    : 20,
        right:  (opts.margin && opts.margin.right  != null) ? opts.margin.right  : 16,
        bottom: (opts.margin && opts.margin.bottom != null) ? opts.margin.bottom : 44,
        left:   (opts.margin && opts.margin.left   != null) ? opts.margin.left   : 56,
      };
      const chartW = W - mg.left - mg.right;
      const chartH = heightOpt - mg.top - mg.bottom;
      if (chartW <= 0 || chartH <= 0) return;

      // Escala Y: máximo = suma acumulada por categoría
      const totals = [];
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let d = 0; d < nD; d++) sum += Math.abs((datasets[d].values || [])[i] || 0);
        totals.push(sum);
      }
      const rawMax = (opts.yAxis && opts.yAxis.max != null) ? opts.yAxis.max : Math.max.apply(null, totals);
      const nTicks = (opts.yAxis && opts.yAxis.ticks) ? opts.yAxis.ticks : 5;
      const yNice  = u.niceScale(0, rawMax, nTicks);
      const yRange = yNice.max - yNice.min;
      const yScale = function (v) { return chartH - v / yRange * chartH; };
      const yFmt   = (opts.yAxis && opts.yAxis.formatter) ? opts.yAxis.formatter : u.defaultFmt;

      // Escala X (banda)
      const outerFrac = (opts.paddingOuter != null) ? opts.paddingOuter : 0.05;
      const innerFrac = (opts.paddingInner != null) ? opts.paddingInner : 0.25;
      const outerPx   = chartW * outerFrac;
      const bandStep  = (chartW - 2 * outerPx) / n;
      const bandWidth = Math.max(1, bandStep * (1 - innerFrac));
      function xBand(i) { return outerPx + i * bandStep + (bandStep - bandWidth) / 2; }
      const xFmt = (opts.xAxis && opts.xAxis.formatter) ? opts.xAxis.formatter : function (v) { return v; };

      const svg = u.svgEl('svg', { width: W, height: heightOpt, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Stacked bar chart' });
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

      const gBars      = u.svgEl('g', { 'class': 'mts-chart__bars' });
      const animate    = opts.animate !== false;
      const barTgts    = [];
      const self       = this;
      const baselines  = [];
      for (let i = 0; i < n; i++) baselines[i] = 0;

      for (let di = 0; di < nD; di++) {
        const ds    = datasets[di];
        const color = ds.color || u.PALETTE[di % u.PALETTE.length];
        const vals  = ds.values || [];

        for (let i = 0; i < n; i++) {
          const value = Math.abs(vals[i] || 0);
          const base  = baselines[i];
          const top   = base + value;
          const ty    = Math.round(yScale(top));
          const th    = Math.max(1, Math.round(yScale(base) - yScale(top)));

          const rect = u.svgEl('rect', {
            x: Math.round(xBand(i)), y: animate ? Math.round(yScale(base)) : ty,
            width: Math.round(bandWidth), height: animate ? 0 : th,
            rx: 0, fill: color, 'class': 'mts-chart__bar',
          });

          (function (rect, lbl, val, dsLbl, col, total) {
            rect.addEventListener('mouseenter', function (e) { self._showTooltip(e, lbl, val, dsLbl, col); rect.setAttribute('opacity', '0.8'); });
            rect.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
            rect.addEventListener('mouseleave', function ()  { self._hideTooltip(); rect.setAttribute('opacity', '1'); });
            rect.addEventListener('click',      function ()  { self._emit('click', { label: lbl, value: val, datasetIndex: di, index: i, color: col, total: total }); });
          }(rect, labels[i] || '', vals[i] || 0, ds.label || '', color, totals[i]));

          if (animate) barTgts.push({ el: rect, ty: ty, th: th, sy: Math.round(yScale(base)) });
          gBars.appendChild(rect);
          baselines[i] = top;
        }
      }
      g.appendChild(gBars);

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
      for (let i = 0; i < labels.length; i++) {
        const x = Math.round(xBand(i) + bandWidth / 2);
        gAxisX.appendChild(u.svgEl('line', { x1: x, y1: 0, x2: x, y2: 4, 'class': 'mts-chart__axis-tick' }));
        const lbl = u.svgEl('text', { x: x, y: 16, 'text-anchor': 'middle', 'class': 'mts-chart__axis-label' });
        lbl.textContent = xFmt(labels[i]);
        gAxisX.appendChild(lbl);
      }
      g.appendChild(gAxisX);

      this._el.insertBefore(svg, this._tooltipEl);
      if (opts.legend !== false) this._legendEl = this._buildLegend(datasets);

      if (animate && barTgts.length > 0) {
        const duration = opts.animateDuration || 500;
        const t0 = performance.now();
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < barTgts.length; i++) {
            const b = barTgts[i];
            b.el.setAttribute('y',      b.sy - (b.sy - b.ty) * ease);
            b.el.setAttribute('height', Math.max(0, b.th * ease));
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

  // ── MtsChartBarStackedH (horizontal) ─────────────────────────────────────────

  class MtsChartBarStackedH extends MtsChart {
    get _type() { return 'bar-stacked-h'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }
      if (this._legendEl) { this._legendEl.remove(); this._legendEl = null; }

      const cfg      = this._cfg;
      const data     = cfg.data    || { labels: [], datasets: [] };
      const opts     = cfg.options || {};
      const labels   = data.labels   || [];
      const datasets = data.datasets || [];
      const n        = labels.length;
      const nD       = datasets.length;

      if (n === 0 || nD === 0) return;

      const W         = this._el.clientWidth || 400;
      const heightOpt = opts.height || (n * 40 + 60);
      const mg = {
        top:    (opts.margin && opts.margin.top    != null) ? opts.margin.top    : 16,
        right:  (opts.margin && opts.margin.right  != null) ? opts.margin.right  : 24,
        bottom: (opts.margin && opts.margin.bottom != null) ? opts.margin.bottom : 36,
        left:   (opts.margin && opts.margin.left   != null) ? opts.margin.left   : 120,
      };
      const chartW = W - mg.left - mg.right;
      const chartH = heightOpt - mg.top - mg.bottom;
      if (chartW <= 0 || chartH <= 0) return;

      // Escala X: máximo = suma acumulada por categoría
      const totals = [];
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let d = 0; d < nD; d++) sum += Math.abs((datasets[d].values || [])[i] || 0);
        totals.push(sum);
      }
      const rawMax = (opts.xAxis && opts.xAxis.max != null) ? opts.xAxis.max : Math.max.apply(null, totals);
      const nTicks = (opts.xAxis && opts.xAxis.ticks) ? opts.xAxis.ticks : 5;
      const xNice  = u.niceScale(0, rawMax, nTicks);
      const xRange = xNice.max - xNice.min;
      const xScale = function (v) { return v / xRange * chartW; };
      const xFmt   = (opts.xAxis && opts.xAxis.formatter) ? opts.xAxis.formatter : u.defaultFmt;

      // Escala Y (banda)
      const outerFrac  = (opts.paddingOuter != null) ? opts.paddingOuter : 0.05;
      const innerFrac  = (opts.paddingInner != null) ? opts.paddingInner : 0.25;
      const outerPx    = chartH * outerFrac;
      const bandStep   = (chartH - 2 * outerPx) / n;
      const bandHeight = Math.max(1, bandStep * (1 - innerFrac));
      function yBand(i) { return outerPx + i * bandStep + (bandStep - bandHeight) / 2; }
      const yFmt = (opts.yAxis && opts.yAxis.formatter) ? opts.yAxis.formatter : function (v) { return v; };

      const svg = u.svgEl('svg', { width: W, height: heightOpt, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Stacked horizontal bar chart' });
      this._svg = svg;
      const g   = u.svgEl('g', { transform: 'translate(' + mg.left + ',' + mg.top + ')' });
      svg.appendChild(g);

      if (opts.grid !== false) {
        const gGrid = u.svgEl('g', { 'class': 'mts-chart__grid' });
        for (let ti = 0; ti < xNice.ticks.length; ti++) {
          const x = Math.round(xScale(xNice.ticks[ti]));
          gGrid.appendChild(u.svgEl('line', { x1: x, y1: 0, x2: x, y2: chartH, 'class': 'mts-chart__grid-line' }));
        }
        g.appendChild(gGrid);
      }

      const gBars      = u.svgEl('g', { 'class': 'mts-chart__bars' });
      const animate    = opts.animate !== false;
      const barTgts    = [];
      const self       = this;
      const baselines  = [];
      for (let i = 0; i < n; i++) baselines[i] = 0;

      for (let di = 0; di < nD; di++) {
        const ds    = datasets[di];
        const color = ds.color || u.PALETTE[di % u.PALETTE.length];
        const vals  = ds.values || [];

        for (let i = 0; i < n; i++) {
          const value = Math.abs(vals[i] || 0);
          const base  = baselines[i];
          const tx    = Math.round(xScale(base));
          const tw    = Math.max(1, Math.round(xScale(base + value) - xScale(base)));

          const rect = u.svgEl('rect', {
            x: tx, y: Math.round(yBand(i)),
            width: animate ? 0 : tw, height: Math.round(bandHeight),
            rx: 0, fill: color, 'class': 'mts-chart__bar',
          });

          (function (rect, lbl, val, dsLbl, col, total) {
            rect.addEventListener('mouseenter', function (e) { self._showTooltip(e, lbl, val, dsLbl, col); rect.setAttribute('opacity', '0.8'); });
            rect.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
            rect.addEventListener('mouseleave', function ()  { self._hideTooltip(); rect.setAttribute('opacity', '1'); });
            rect.addEventListener('click',      function ()  { self._emit('click', { label: lbl, value: val, datasetIndex: di, index: i, color: col, total: total }); });
          }(rect, labels[i] || '', vals[i] || 0, ds.label || '', color, totals[i]));

          if (animate) barTgts.push({ el: rect, tw: tw });
          gBars.appendChild(rect);
          baselines[i] = base + value;
        }
      }
      g.appendChild(gBars);

      // Eje X
      const gAxisX = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--x', transform: 'translate(0,' + chartH + ')' });
      gAxisX.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: chartW, y2: 0, 'class': 'mts-chart__axis-line' }));
      for (let ti = 0; ti < xNice.ticks.length; ti++) {
        const x = Math.round(xScale(xNice.ticks[ti]));
        gAxisX.appendChild(u.svgEl('line', { x1: x, y1: 0, x2: x, y2: 4, 'class': 'mts-chart__axis-tick' }));
        const lbl = u.svgEl('text', { x: x, y: 16, 'text-anchor': 'middle', 'class': 'mts-chart__axis-label' });
        lbl.textContent = xFmt(xNice.ticks[ti]);
        gAxisX.appendChild(lbl);
      }
      g.appendChild(gAxisX);

      // Eje Y
      const gAxisY = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--y' });
      gAxisY.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: 0, y2: chartH, 'class': 'mts-chart__axis-line' }));
      for (let i = 0; i < labels.length; i++) {
        const y = Math.round(yBand(i) + bandHeight / 2);
        gAxisY.appendChild(u.svgEl('line', { x1: -4, y1: y, x2: 0, y2: y, 'class': 'mts-chart__axis-tick' }));
        const lbl = u.svgEl('text', { x: -10, y: y, 'text-anchor': 'end', 'dominant-baseline': 'middle', 'class': 'mts-chart__axis-label' });
        lbl.textContent = yFmt(labels[i]);
        gAxisY.appendChild(lbl);
      }
      g.appendChild(gAxisY);

      this._el.insertBefore(svg, this._tooltipEl);
      if (opts.legend !== false) this._legendEl = this._buildLegend(datasets);

      if (animate && barTgts.length > 0) {
        const duration = opts.animateDuration || 500;
        const t0 = performance.now();
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < barTgts.length; i++) {
            barTgts[i].el.setAttribute('width', Math.max(0, barTgts[i].tw * ease));
          }
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < barTgts.length; i++) barTgts[i].el.setAttribute('width', barTgts[i].tw);
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  global.MTS.ChartBarStacked  = MtsChartBarStacked;
  global.MTS.ChartBarStackedH = MtsChartBarStackedH;

}(typeof window !== 'undefined' ? window : this));
