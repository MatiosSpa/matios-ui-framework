/**
 * MTS.ChartAreaStacked (v2.1.0) — áreas apiladas
 * SVG puro · 0 dependencias · XSS-safe
 *
 * Dep: matios-ui-chart.js + matios-ui-chart-line.js (deben cargarse antes)
 *
 * Exporta:
 *   MTS.ChartAreaStacked — cada dataset acumulado sobre el anterior
 *
 * Asume valores no negativos (usa Math.abs internamente).
 *
 * Opciones por dataset:
 *   color        {string}  — Default: paleta interna
 *   lineWidth    {number}  — grosor del borde. Default: 1.5
 *   smooth       {boolean} — curvas Catmull-Rom. Default: true
 *   fillOpacity  {number}  — opacidad del relleno 0-1. Default: 0.55
 */
(function (global) {
  'use strict';

  if (!global.MTS || !global.MTS.Chart) {
    throw new Error('matios-ui-chart-area-stacked.js: MTS.Chart no encontrado. Incluir matios-ui-chart.js primero.');
  }

  const MtsChart = global.MTS.Chart;
  const u        = MtsChart._utils;

  function _smoothPath(pts) {
    if (pts.length === 0) return '';
    if (pts.length === 1) return 'M' + pts[0].x + ',' + pts[0].y;
    let d = 'M' + pts[0].x.toFixed(2) + ',' + pts[0].y.toFixed(2);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0  = pts[i > 0 ? i - 1 : 0];
      const p1  = pts[i];
      const p2  = pts[i + 1];
      const p3  = pts[i + 2] !== undefined ? pts[i + 2] : p2;
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ' C' + cp1x.toFixed(2) + ',' + cp1y.toFixed(2)
         + ' ' + cp2x.toFixed(2) + ',' + cp2y.toFixed(2)
         + ' ' + p2.x.toFixed(2) + ',' + p2.y.toFixed(2);
    }
    return d;
  }

  function _linePath(pts) {
    if (pts.length === 0) return '';
    let d = 'M' + pts[0].x.toFixed(2) + ',' + pts[0].y.toFixed(2);
    for (let i = 1; i < pts.length; i++) {
      d += ' L' + pts[i].x.toFixed(2) + ',' + pts[i].y.toFixed(2);
    }
    return d;
  }

  class MtsChartAreaStacked extends MtsChart {
    get _type() { return 'area-stacked'; }

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
        right:  (opts.margin && opts.margin.right  != null) ? opts.margin.right  : 24,
        bottom: (opts.margin && opts.margin.bottom != null) ? opts.margin.bottom : 44,
        left:   (opts.margin && opts.margin.left   != null) ? opts.margin.left   : 56,
      };
      const chartW = W - mg.left - mg.right;
      const chartH = heightOpt - mg.top - mg.bottom;
      if (chartW <= 0 || chartH <= 0) return;

      // Escala Y: máximo = suma de todos los datasets por punto
      const stackTotals = [];
      for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let d = 0; d < nD; d++) sum += Math.abs((datasets[d].values || [])[i] || 0);
        stackTotals.push(sum);
      }
      const rawMax = (opts.yAxis && opts.yAxis.max != null) ? opts.yAxis.max : Math.max.apply(null, stackTotals);
      const nTicks = (opts.yAxis && opts.yAxis.ticks) ? opts.yAxis.ticks : 5;
      const yNice  = u.niceScale(0, rawMax || 1, nTicks);
      const yRange = yNice.max - yNice.min;
      const yScale = function (v) { return chartH - v / yRange * chartH; };
      const yFmt   = (opts.yAxis && opts.yAxis.formatter) ? opts.yAxis.formatter : u.defaultFmt;

      const xPos = function (i) { return n <= 1 ? chartW / 2 : i * chartW / (n - 1); };
      const xFmt = (opts.xAxis && opts.xAxis.formatter) ? opts.xAxis.formatter : function (v) { return v; };

      const svg = u.svgEl('svg', { width: W, height: heightOpt, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Stacked area chart' });
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

      const gFills = u.svgEl('g', { 'class': 'mts-chart__fills' });
      const gLines = u.svgEl('g', { 'class': 'mts-chart__lines' });
      g.appendChild(gFills);
      g.appendChild(gLines);

      const animate  = opts.animate !== false;
      const animTgts = [];
      const self     = this;

      const baselines = [];
      for (let i = 0; i < n; i++) baselines[i] = 0;

      for (let di = 0; di < nD; di++) {
        const ds          = datasets[di];
        const color       = ds.color       || u.PALETTE[di % u.PALETTE.length];
        const lineWidth   = ds.lineWidth   != null ? ds.lineWidth   : 1.5;
        const smooth      = ds.smooth      !== false;
        const fillOpacity = ds.fillOpacity != null ? ds.fillOpacity : 0.55;
        const vals        = ds.values || [];

        const topPts = [];
        for (let i = 0; i < n; i++) {
          topPts.push({ x: xPos(i), y: yScale(baselines[i] + Math.abs(vals[i] || 0)) });
        }
        const botPts = [];
        for (let i = n - 1; i >= 0; i--) {
          botPts.push({ x: xPos(i), y: yScale(baselines[i]) });
        }

        const topD  = smooth ? _smoothPath(topPts) : _linePath(topPts);
        const botD  = smooth ? _smoothPath(botPts) : _linePath(botPts);
        const areaD = topD + ' ' + botD.replace(/^M/, 'L') + ' Z';

        const fillEl = u.svgEl('path', {
          d: areaD, fill: color,
          'fill-opacity': animate ? 0 : fillOpacity,
          stroke: 'none', 'class': 'mts-chart__fill', style: 'cursor:pointer',
        });
        gFills.appendChild(fillEl);
        (function (el, dsLabel, col, idx) {
          el.addEventListener('click', function () { self._emit('click', { label: dsLabel, datasetIndex: idx, color: col }); });
        }(fillEl, ds.label || '', color, di));

        const linePath = u.svgEl('path', {
          d: topD, stroke: color, 'stroke-width': lineWidth,
          fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
          'class': 'mts-chart__line',
        });
        gLines.appendChild(linePath);

        if (animate) animTgts.push({ path: linePath, len: 0, fillEl: fillEl, fillTarget: fillOpacity });

        for (let i = 0; i < n; i++) baselines[i] += Math.abs(vals[i] || 0);
      }

      // Eje Y
      const gAxisY = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--y' });
      gAxisY.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: 0, y2: chartH, 'class': 'mts-chart__axis-line' }));
      for (let ti = 0; ti < yNice.ticks.length; ti++) {
        const ty = Math.round(yScale(yNice.ticks[ti]));
        gAxisY.appendChild(u.svgEl('line', { x1: -4, y1: ty, x2: 0, y2: ty, 'class': 'mts-chart__axis-tick' }));
        const lbl = u.svgEl('text', { x: -10, y: ty, 'text-anchor': 'end', 'dominant-baseline': 'middle', 'class': 'mts-chart__axis-label' });
        lbl.textContent = yFmt(yNice.ticks[ti]);
        gAxisY.appendChild(lbl);
      }
      g.appendChild(gAxisY);

      // Eje X
      const gAxisX = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--x', transform: 'translate(0,' + chartH + ')' });
      gAxisX.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: chartW, y2: 0, 'class': 'mts-chart__axis-line' }));
      for (let xi = 0; xi < labels.length; xi++) {
        const lx = Math.round(xPos(xi));
        gAxisX.appendChild(u.svgEl('line', { x1: lx, y1: 0, x2: lx, y2: 4, 'class': 'mts-chart__axis-tick' }));
        const lbl = u.svgEl('text', { x: lx, y: 16, 'text-anchor': 'middle', 'class': 'mts-chart__axis-label' });
        lbl.textContent = xFmt(labels[xi]);
        gAxisX.appendChild(lbl);
      }
      g.appendChild(gAxisX);

      this._el.insertBefore(svg, this._tooltipEl);
      if (opts.legend !== false) this._legendEl = this._buildLegend(datasets, 'mts-chart__legend-dot--circle');

      if (animate && animTgts.length > 0) {
        for (let at = 0; at < animTgts.length; at++) {
          const tgt = animTgts[at];
          const len = tgt.path.getTotalLength ? tgt.path.getTotalLength() : 0;
          tgt.len   = len;
          if (len > 0) { tgt.path.setAttribute('stroke-dasharray', len); tgt.path.setAttribute('stroke-dashoffset', len); }
        }
        const duration = opts.animateDuration || 700;
        const t0 = performance.now();
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < animTgts.length; i++) {
            const tgt = animTgts[i];
            if (tgt.len > 0) tgt.path.setAttribute('stroke-dashoffset', tgt.len * (1 - ease));
            if (tgt.fillEl) tgt.fillEl.setAttribute('fill-opacity', tgt.fillTarget * ease);
          }
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < animTgts.length; i++) {
              const tgt = animTgts[i];
              if (tgt.len > 0) { tgt.path.removeAttribute('stroke-dasharray'); tgt.path.removeAttribute('stroke-dashoffset'); }
              if (tgt.fillEl) tgt.fillEl.setAttribute('fill-opacity', tgt.fillTarget);
            }
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  global.MTS.ChartAreaStacked = MtsChartAreaStacked;

}(typeof window !== 'undefined' ? window : this));
