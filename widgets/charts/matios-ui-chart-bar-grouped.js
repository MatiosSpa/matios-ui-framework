/**
 * MTS.ChartBarGrouped (v2.1.0) — barras agrupadas side-by-side
 * SVG puro · 0 dependencias · XSS-safe
 *
 * Dep: matios-ui-chart.js (debe cargarse antes)
 *
 * Exporta:
 *   MTS.ChartBarGrouped — múltiples datasets side-by-side por categoría
 *
 * Opciones globales:
 *   innerGroupPadding  {number}  — fracción de gap entre barras del grupo. Default: 0.12
 *   paddingInner       {number}  — fracción de gap entre grupos. Default: 0.20
 *   paddingOuter       {number}  — fracción de padding externo. Default: 0.05
 */
(function (global) {
  'use strict';

  if (!global.MTS || !global.MTS.Chart) {
    throw new Error('matios-ui-chart-bar-grouped.js: MTS.Chart no encontrado. Incluir matios-ui-chart.js primero.');
  }

  const MtsChart = global.MTS.Chart;
  const u        = MtsChart._utils;

  class MtsChartBarGrouped extends MtsChart {
    get _type() { return 'bar-grouped'; }

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

      // ── Escala Y ───────────────────────────────────────────────────────────
      let allVals = [];
      for (let d = 0; d < nD; d++) allVals = allVals.concat(datasets[d].values || []);
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

      // ── Escala X (banda de grupo) ─────────────────────────────────────────
      const outerFrac     = (opts.paddingOuter != null) ? opts.paddingOuter : 0.05;
      const innerFrac     = (opts.paddingInner != null) ? opts.paddingInner : 0.20;
      const innerGroupGap = (opts.innerGroupPadding != null) ? opts.innerGroupPadding : 0.12;
      const outerPx       = chartW * outerFrac;
      const bandStep      = (chartW - 2 * outerPx) / n;
      const bandWidth     = Math.max(1, bandStep * (1 - innerFrac));
      const subStep       = bandWidth / nD;
      const subWidth      = Math.max(1, subStep * (1 - innerGroupGap));

      function xSub(i, di) {
        const groupX = outerPx + i * bandStep + (bandStep - bandWidth) / 2;
        return groupX + di * subStep + (subStep - subWidth) / 2;
      }
      const xFmt = (opts.xAxis && opts.xAxis.formatter) ? opts.xAxis.formatter : function (v) { return v; };

      // ── SVG ────────────────────────────────────────────────────────────────
      const svg = u.svgEl('svg', { width: W, height: heightOpt, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Grouped bar chart' });
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

      for (let di = 0; di < nD; di++) {
        const ds    = datasets[di];
        const color = ds.color || u.PALETTE[di % u.PALETTE.length];
        const vals  = ds.values || [];

        for (let i = 0; i < vals.length; i++) {
          const value = vals[i];
          const bx    = Math.round(xSub(i, di));
          const bw    = Math.round(subWidth);
          const ty    = Math.round(Math.min(yScale(value), yZero));
          const th    = Math.max(1, Math.abs(Math.round(yScale(value) - yZero)));

          const rect = u.svgEl('rect', {
            x: bx, y: animate ? Math.round(yZero) : ty,
            width: bw, height: animate ? 0 : th,
            rx: 3, fill: value < 0 ? (ds.negativeColor || '#e53935') : color,
            'class': 'mts-chart__bar',
          });

          (function (rect, lbl, val, dsLbl, col) {
            rect.addEventListener('mouseenter', function (e) { self._showTooltip(e, lbl, val, dsLbl, col); rect.setAttribute('opacity', '0.75'); });
            rect.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
            rect.addEventListener('mouseleave', function ()  { self._hideTooltip(); rect.setAttribute('opacity', '1'); });
            rect.addEventListener('click',      function ()  { self._emit('click', { label: lbl, value: val, datasetIndex: di, index: i, color: col }); });
          }(rect, labels[i] || '', value, ds.label || '', color));

          if (animate) barTgts.push({ el: rect, ty: ty, th: th, sy: Math.round(yZero) });
          gBars.appendChild(rect);
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

      // Eje X (centrado en el grupo)
      const gAxisX = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--x', transform: 'translate(0,' + chartH + ')' });
      gAxisX.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: chartW, y2: 0, 'class': 'mts-chart__axis-line' }));
      for (let i = 0; i < labels.length; i++) {
        const x = Math.round(outerPx + i * bandStep + bandStep / 2);
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
  }

  global.MTS.ChartBarGrouped = MtsChartBarGrouped;

}(typeof window !== 'undefined' ? window : this));
