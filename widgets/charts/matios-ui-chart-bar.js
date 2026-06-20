/**
 * MTS.ChartBar (v2.1.0) — barras verticales y horizontales
 * SVG puro · 0 dependencias · XSS-safe
 *
 * Dep: matios-ui-chart.js (debe cargarse antes)
 *
 * Exporta:
 *   MTS.ChartBar — barras V (default) y H (orientation:'horizontal')
 *
 * Opciones por dataset:
 *   color          {string}  — color barras positivas. Default: paleta interna
 *   negativeColor  {string}  — color barras negativas. Default: '#e53935'
 *
 * Opciones globales:
 *   paddingInner   {number}  — fracción de gap entre barras. Default: 0.25
 *   paddingOuter   {number}  — fracción de padding externo. Default: 0.05
 *   orientation    {string}  — 'horizontal' | 'h'. Default: vertical
 */
(function (global) {
  'use strict';

  if (!global.MTS || !global.MTS.Chart) {
    throw new Error('matios-ui-chart-bar.js: MTS.Chart no encontrado. Incluir matios-ui-chart.js primero.');
  }

  const MtsChart = global.MTS.Chart;
  const u        = MtsChart._utils;

  class MtsChartBar extends MtsChart {
    get _type() { return 'bar'; }

    _render() {
      const opts = this._cfg.options || {};
      if (opts.orientation === 'horizontal' || opts.orientation === 'h') {
        return this._renderBarH();
      }
      return this._renderBarV();
    }

    _renderBarV() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }
      if (this._legendEl) { this._legendEl.remove(); this._legendEl = null; }

      const cfg      = this._cfg;
      const data     = cfg.data    || { labels: [], datasets: [] };
      const opts     = cfg.options || {};
      const labels   = data.labels   || [];
      const datasets = data.datasets || [];
      const n        = labels.length;

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

      if (chartW <= 0 || chartH <= 0 || n === 0) return;

      // ── Escala Y ───────────────────────────────────────────────────────────
      let allVals = [];
      for (let d = 0; d < datasets.length; d++) allVals = allVals.concat(datasets[d].values || []);
      const dataMax = allVals.length ? Math.max.apply(null, allVals) : 1;
      const dataMin = Math.min(0, allVals.length ? Math.min.apply(null, allVals) : 0);
      const rawMin  = (opts.yAxis && opts.yAxis.min != null) ? opts.yAxis.min : dataMin;
      const rawMax  = (opts.yAxis && opts.yAxis.max != null) ? opts.yAxis.max : dataMax;
      const nTicks  = (opts.yAxis && opts.yAxis.ticks) ? opts.yAxis.ticks : 5;
      const yNice   = u.niceScale(rawMin, rawMax, nTicks);
      const yRange  = yNice.max - yNice.min;
      const yScale  = function (v) { return chartH - (v - yNice.min) / yRange * chartH; };
      const yZero   = yScale(Math.max(yNice.min, 0));
      const yFmt    = (opts.yAxis && opts.yAxis.formatter) ? opts.yAxis.formatter : u.defaultFmt;

      // ── Escala X (banda) ──────────────────────────────────────────────────
      const outerFrac = (opts.paddingOuter != null) ? opts.paddingOuter : 0.05;
      const innerFrac = (opts.paddingInner != null) ? opts.paddingInner : 0.25;
      const outerPx   = chartW * outerFrac;
      const available = chartW - 2 * outerPx;
      const bandStep  = available / n;
      const bandWidth = Math.max(1, bandStep * (1 - innerFrac));

      function xBand(i) { return outerPx + i * bandStep + (bandStep - bandWidth) / 2; }
      const xFmt = (opts.xAxis && opts.xAxis.formatter) ? opts.xAxis.formatter : function (v) { return v; };

      // ── SVG ────────────────────────────────────────────────────────────────
      const svg = u.svgEl('svg', { width: W, height: heightOpt, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Bar chart' });
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

      const gBars   = u.svgEl('g', { 'class': 'mts-chart__bars' });
      const animate = opts.animate !== false;
      const barTgts = [];
      const self    = this;

      for (let di = 0; di < datasets.length; di++) {
        const ds            = datasets[di];
        const color         = ds.color         || u.PALETTE[di % u.PALETTE.length];
        const negativeColor = ds.negativeColor || '#e53935';
        const vals          = ds.values || [];

        for (let i = 0; i < vals.length; i++) {
          const value   = vals[i];
          const barFill = value < 0 ? negativeColor : color;
          const bx      = Math.round(xBand(i));
          const bw      = Math.round(bandWidth);
          const ty      = Math.round(Math.min(yScale(value), yZero));
          const th      = Math.max(1, Math.abs(Math.round(yScale(value) - yZero)));

          const rect = u.svgEl('rect', {
            x: bx, y: animate ? Math.round(yZero) : ty,
            width: bw, height: animate ? 0 : th,
            rx: 3, fill: barFill, 'class': 'mts-chart__bar',
            'data-index': i, 'data-ds': di,
          });

          (function (rect, lbl, val, dsLbl, col) {
            rect.addEventListener('mouseenter', function (e) { self._showTooltip(e, lbl, val, dsLbl, col); rect.setAttribute('opacity', '0.75'); });
            rect.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
            rect.addEventListener('mouseleave', function ()  { self._hideTooltip(); rect.setAttribute('opacity', '1'); });
            rect.addEventListener('click',      function ()  { self._emit('click', { label: lbl, value: val, datasetIndex: di, index: i, color: col }); });
          }(rect, labels[i] || '', value, datasets.length > 1 ? (ds.label || '') : '', color));

          if (animate) barTgts.push({ el: rect, ty: ty, th: th, sy: Math.round(yZero) });
          gBars.appendChild(rect);
        }
      }
      g.appendChild(gBars);

      // Eje Y
      const gAxisY = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--y' });
      gAxisY.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: 0, y2: chartH, 'class': 'mts-chart__axis-line' }));
      for (let ti = 0; ti < yNice.ticks.length; ti++) {
        const tick = yNice.ticks[ti];
        const y    = Math.round(yScale(tick));
        gAxisY.appendChild(u.svgEl('line', { x1: -4, y1: y, x2: 0, y2: y, 'class': 'mts-chart__axis-tick' }));
        const lbl = u.svgEl('text', { x: -10, y: y, 'text-anchor': 'end', 'dominant-baseline': 'middle', 'class': 'mts-chart__axis-label' });
        lbl.textContent = yFmt(tick);
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

      if (yNice.min < 0 && yNice.max > 0) {
        g.appendChild(u.svgEl('line', { x1: 0, y1: Math.round(yZero), x2: chartW, y2: Math.round(yZero), 'class': 'mts-chart__zero-line' }));
      }

      this._el.insertBefore(svg, this._tooltipEl);
      if (opts.legend !== false && datasets.length > 1) this._legendEl = this._buildLegend(datasets);

      if (animate && barTgts.length > 0) {
        const duration = opts.animateDuration || 500;
        const t0 = performance.now();
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < barTgts.length; i++) {
            const b = barTgts[i];
            b.el.setAttribute('y',      b.sy + (b.ty - b.sy) * ease);
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

    _renderBarH() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }
      if (this._legendEl) { this._legendEl.remove(); this._legendEl = null; }

      const cfg      = this._cfg;
      const data     = cfg.data    || { labels: [], datasets: [] };
      const opts     = cfg.options || {};
      const labels   = data.labels   || [];
      const datasets = data.datasets || [];
      const n        = labels.length;

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

      if (chartW <= 0 || chartH <= 0 || n === 0) return;

      // ── Escala X (valores, lineal) ─────────────────────────────────────────
      let allVals = [];
      for (let d = 0; d < datasets.length; d++) allVals = allVals.concat(datasets[d].values || []);
      const dataMax = allVals.length ? Math.max.apply(null, allVals) : 1;
      const dataMin = Math.min(0, allVals.length ? Math.min.apply(null, allVals) : 0);
      const rawMin  = (opts.xAxis && opts.xAxis.min != null) ? opts.xAxis.min : dataMin;
      const rawMax  = (opts.xAxis && opts.xAxis.max != null) ? opts.xAxis.max : dataMax;
      const nTicks  = (opts.xAxis && opts.xAxis.ticks) ? opts.xAxis.ticks : 5;
      const xNice   = u.niceScale(rawMin, rawMax, nTicks);
      const xRange  = xNice.max - xNice.min;
      const xScale  = function (v) { return (v - xNice.min) / xRange * chartW; };
      const xZero   = xScale(Math.max(xNice.min, 0));
      const xFmt    = (opts.xAxis && opts.xAxis.formatter) ? opts.xAxis.formatter : u.defaultFmt;

      // ── Escala Y (categorías, banda) ───────────────────────────────────────
      const outerFrac  = (opts.paddingOuter != null) ? opts.paddingOuter : 0.05;
      const innerFrac  = (opts.paddingInner != null) ? opts.paddingInner : 0.25;
      const outerPx    = chartH * outerFrac;
      const available  = chartH - 2 * outerPx;
      const bandStep   = available / n;
      const bandHeight = Math.max(1, bandStep * (1 - innerFrac));

      function yBand(i) { return outerPx + i * bandStep + (bandStep - bandHeight) / 2; }
      const yFmt = (opts.yAxis && opts.yAxis.formatter) ? opts.yAxis.formatter : function (v) { return v; };

      // ── SVG ────────────────────────────────────────────────────────────────
      const svg = u.svgEl('svg', { width: W, height: heightOpt, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Horizontal bar chart' });
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

      const gBars   = u.svgEl('g', { 'class': 'mts-chart__bars' });
      const animate = opts.animate !== false;
      const barTgts = [];
      const self    = this;

      for (let di = 0; di < datasets.length; di++) {
        const ds            = datasets[di];
        const color         = ds.color         || u.PALETTE[di % u.PALETTE.length];
        const negativeColor = ds.negativeColor || '#e53935';
        const vals          = ds.values || [];

        for (let i = 0; i < vals.length; i++) {
          const value   = vals[i];
          const barFill = value < 0 ? negativeColor : color;
          const by      = Math.round(yBand(i));
          const bh      = Math.round(bandHeight);
          const tx      = Math.round(Math.min(xScale(value), xZero));
          const tw      = Math.max(1, Math.abs(Math.round(xScale(value) - xZero)));

          const rect = u.svgEl('rect', {
            x: animate ? Math.round(xZero) : tx, y: by,
            width: animate ? 0 : tw, height: bh,
            rx: 3, fill: barFill, 'class': 'mts-chart__bar',
            'data-index': i, 'data-ds': di,
          });

          (function (rect, lbl, val, dsLbl, col) {
            rect.addEventListener('mouseenter', function (e) { self._showTooltip(e, lbl, val, dsLbl, col); rect.setAttribute('opacity', '0.75'); });
            rect.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
            rect.addEventListener('mouseleave', function ()  { self._hideTooltip(); rect.setAttribute('opacity', '1'); });
            rect.addEventListener('click',      function ()  { self._emit('click', { label: lbl, value: val, datasetIndex: di, index: i, color: col }); });
          }(rect, labels[i] || '', value, datasets.length > 1 ? (ds.label || '') : '', barFill));

          if (animate) barTgts.push({ el: rect, tx: tx, tw: tw, sx: Math.round(xZero) });
          gBars.appendChild(rect);
        }
      }
      g.appendChild(gBars);

      // Eje X (valores, abajo)
      const gAxisX = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--x', transform: 'translate(0,' + chartH + ')' });
      gAxisX.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: chartW, y2: 0, 'class': 'mts-chart__axis-line' }));
      for (let ti = 0; ti < xNice.ticks.length; ti++) {
        const tick = xNice.ticks[ti];
        const x    = Math.round(xScale(tick));
        gAxisX.appendChild(u.svgEl('line', { x1: x, y1: 0, x2: x, y2: 4, 'class': 'mts-chart__axis-tick' }));
        const lbl = u.svgEl('text', { x: x, y: 16, 'text-anchor': 'middle', 'class': 'mts-chart__axis-label' });
        lbl.textContent = xFmt(tick);
        gAxisX.appendChild(lbl);
      }
      g.appendChild(gAxisX);

      // Eje Y (categorías, izquierda)
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

      if (xNice.min < 0 && xNice.max > 0) {
        g.appendChild(u.svgEl('line', { x1: Math.round(xZero), y1: 0, x2: Math.round(xZero), y2: chartH, 'class': 'mts-chart__zero-line' }));
      }

      this._el.insertBefore(svg, this._tooltipEl);
      if (opts.legend !== false && datasets.length > 1) this._legendEl = this._buildLegend(datasets);

      if (animate && barTgts.length > 0) {
        const duration = opts.animateDuration || 500;
        const t0 = performance.now();
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < barTgts.length; i++) {
            const b = barTgts[i];
            b.el.setAttribute('x',     b.sx + (b.tx - b.sx) * ease);
            b.el.setAttribute('width', Math.max(0, b.tw * ease));
          }
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < barTgts.length; i++) { barTgts[i].el.setAttribute('x', barTgts[i].tx); barTgts[i].el.setAttribute('width', barTgts[i].tw); }
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  global.MTS.ChartBar = MtsChartBar;

}(typeof window !== 'undefined' ? window : this));
