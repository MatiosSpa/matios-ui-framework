/**
 * MTS.ChartSparkline (v2.1.0) — línea mini sin ejes ni labels
 * SVG puro · 0 dependencias · XSS-safe
 *
 * Dep: matios-ui-chart.js (debe cargarse antes)
 *
 * Exporta:
 *   MTS.ChartSparkline — línea inline para KPIs / tablas
 *
 * Data shorthand:
 *   data: { values: [1,2,3,...], color: '#hex' }
 *   — o estándar —
 *   data: { datasets: [{ values: [...], color: '...' }] }
 *
 * Opciones globales (y por dataset):
 *   color        {string}  — Default: paleta interna
 *   lineWidth    {number}  — Default: 2
 *   smooth       {boolean} — Catmull-Rom. Default: true
 *   fill         {boolean} — área bajo la línea. Default: false
 *   fillOpacity  {number}  — Default: 0.15
 *   showDots     {boolean} — mostrar dots interactivos. Default: false
 *   dotRadius    {number}  — Default: 3
 *   height       {number}  — Default: 60
 *   padding      {number}  — padding interno SVG. Default: 4
 */
(function (global) {
  'use strict';

  if (!global.MTS || !global.MTS.Chart) {
    throw new Error('matios-ui-chart-sparkline.js: MTS.Chart no encontrado. Incluir matios-ui-chart.js primero.');
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

  class MtsChartSparkline extends MtsChart {
    get _type() { return 'sparkline'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)     { this._svg.remove(); this._svg = null; }

      const cfg  = this._cfg;
      const raw  = cfg.data    || {};
      const opts = cfg.options || {};

      // Normalizar: shorthand { values } o estándar { datasets }
      const datasets = Array.isArray(raw.values)
        ? [{ values: raw.values, color: raw.color }]
        : (raw.datasets || []);

      if (!datasets.length) return;

      const W      = this._el.clientWidth || 200;
      const H      = opts.height  != null ? opts.height  : 60;
      const pad    = opts.padding != null ? opts.padding : 4;
      const chartW = W - pad * 2;
      const chartH = H - pad * 2;
      if (chartW <= 0 || chartH <= 0) return;

      // Y scale global (todos los datasets)
      let allVals = [];
      for (let d = 0; d < datasets.length; d++) allVals = allVals.concat(datasets[d].values || []);
      if (!allVals.length) return;

      const rawMin = Math.min.apply(null, allVals);
      const rawMax = Math.max.apply(null, allVals);
      const yRange = rawMax === rawMin ? 1 : rawMax - rawMin;
      const yScale = function (v) { return chartH - (v - rawMin) / yRange * chartH; };

      const xPos = function (i, len) {
        return len <= 1 ? chartW / 2 : i * chartW / (len - 1);
      };

      const svg = u.svgEl('svg', { width: W, height: H, 'class': 'mts-chart__svg' });
      this._svg = svg;
      const g   = u.svgEl('g', { transform: 'translate(' + pad + ',' + pad + ')' });
      svg.appendChild(g);

      const animate  = opts.animate !== false;
      const animTgts = [];
      const self     = this;

      for (let di = 0; di < datasets.length; di++) {
        const ds = datasets[di];

        const color       = ds.color       != null ? ds.color       : (opts.color       || u.PALETTE[di % u.PALETTE.length]);
        const lineWidth   = ds.lineWidth   != null ? ds.lineWidth   : (opts.lineWidth   != null ? opts.lineWidth   : 2);
        const smooth      = (ds.smooth      !== undefined ? ds.smooth      : opts.smooth)      !== false;
        const fill        = !!(ds.fill      !== undefined ? ds.fill        : opts.fill);
        const fillOpacity = ds.fillOpacity != null ? ds.fillOpacity : (opts.fillOpacity != null ? opts.fillOpacity : 0.15);
        const showDots    = !!(ds.showDots  !== undefined ? ds.showDots    : opts.showDots);
        const dotRadius   = ds.dotRadius   != null ? ds.dotRadius   : (opts.dotRadius   != null ? opts.dotRadius   : 3);
        const vals        = ds.values || [];

        if (!vals.length) continue;

        const pts = [];
        for (let i = 0; i < vals.length; i++) {
          pts.push({ x: xPos(i, vals.length), y: yScale(vals[i]) });
        }

        // Fill
        if (fill) {
          const lineD = smooth ? _smoothPath(pts) : _linePath(pts);
          const areaD = lineD
            + ' L' + pts[pts.length - 1].x.toFixed(2) + ',' + chartH.toFixed(2)
            + ' L' + pts[0].x.toFixed(2) + ',' + chartH.toFixed(2) + ' Z';
          const fillEl = u.svgEl('path', {
            d:              areaD,
            fill:           color,
            'fill-opacity': animate ? 0 : fillOpacity,
            stroke:         'none',
            'class':        'mts-chart__fill',
          });
          g.appendChild(fillEl);
          if (animate) animTgts.push({ type: 'fill', el: fillEl, fillTarget: fillOpacity });
        }

        // Línea
        const lineD    = smooth ? _smoothPath(pts) : _linePath(pts);
        const linePath = u.svgEl('path', {
          d:                 lineD,
          stroke:            color,
          'stroke-width':    lineWidth,
          fill:              'none',
          'stroke-linecap':  'round',
          'stroke-linejoin': 'round',
          'class':           'mts-chart__line',
        });
        g.appendChild(linePath);
        if (animate) animTgts.push({ type: 'line', el: linePath, len: 0 });

        // Dots (con tooltip)
        if (showDots) {
          for (let j = 0; j < pts.length; j++) {
            (function (pt, val, col) {
              const circle = u.svgEl('circle', {
                cx: pt.x.toFixed(2), cy: pt.y.toFixed(2), r: dotRadius,
                fill: col, stroke: 'none', 'class': 'mts-chart__dot',
                opacity: animate ? 0 : 1,
              });
              circle.addEventListener('mouseenter', function (e) {
                self._showTooltip(e, '', val, '', col);
                circle.setAttribute('r', dotRadius + 2);
              });
              circle.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
              circle.addEventListener('mouseleave', function () {
                self._hideTooltip();
                circle.setAttribute('r', dotRadius);
              });
              circle.addEventListener('click', function () { self._emit('click', { value: val, datasetIndex: di, index: j, color: col }); });
              g.appendChild(circle);
              if (animate) animTgts.push({ type: 'dot', el: circle });
            }(pts[j], vals[j], color));
          }
        }
      }

      this._el.insertBefore(svg, this._tooltipEl);

      if (animate && animTgts.length > 0) {
        for (let at = 0; at < animTgts.length; at++) {
          const tgt = animTgts[at];
          if (tgt.type === 'line') {
            const len = tgt.el.getTotalLength ? tgt.el.getTotalLength() : 0;
            tgt.len   = len;
            if (len > 0) { tgt.el.setAttribute('stroke-dasharray', len); tgt.el.setAttribute('stroke-dashoffset', len); }
          }
        }
        const duration = opts.animateDuration || 400;
        const t0       = performance.now();

        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < animTgts.length; i++) {
            const tgt = animTgts[i];
            if (tgt.type === 'line' && tgt.len > 0) tgt.el.setAttribute('stroke-dashoffset', tgt.len * (1 - ease));
            if (tgt.type === 'fill') tgt.el.setAttribute('fill-opacity', tgt.fillTarget * ease);
          }
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < animTgts.length; i++) {
              const tgt = animTgts[i];
              if (tgt.type === 'line' && tgt.len > 0) {
                tgt.el.removeAttribute('stroke-dasharray');
                tgt.el.removeAttribute('stroke-dashoffset');
              }
              if (tgt.type === 'dot') tgt.el.setAttribute('opacity', 1);
            }
          }
        }

        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  global.MTS.ChartSparkline = MtsChartSparkline;

}(typeof window !== 'undefined' ? window : this));
