/**
 * MTS.ChartLine (v2.1.0) — líneas y áreas simples
 * SVG puro · 0 dependencias · XSS-safe
 *
 * Dep: matios-ui-chart.js (debe cargarse antes)
 *
 * Exporta:
 *   MTS.ChartLine — líneas y áreas simples (fill:true en el dataset)
 *
 * Opciones por dataset:
 *   color        {string}  — color de línea/área. Default: paleta interna
 *   lineWidth    {number}  — grosor del trazo en px. Default: 2
 *   smooth       {boolean} — curvas Catmull-Rom. Default: true
 *   showDots     {boolean} — mostrar puntos. Default: true
 *   dotRadius    {number}  — radio del punto en px. Default: 4
 *   fill         {boolean} — rellenar área bajo la línea. Default: false
 *   fillOpacity  {number}  — opacidad del relleno 0-1. Default: 0.12
 */
(function (global) {
  'use strict';

  if (!global.MTS || !global.MTS.Chart) {
    throw new Error('matios-ui-chart-line.js: MTS.Chart no encontrado. Incluir matios-ui-chart.js primero.');
  }

  const MtsChart = global.MTS.Chart;
  const u        = MtsChart._utils; // { svgEl, niceScale, defaultFmt, easeOut, PALETTE }

  // ── Generadores de path ──────────────────────────────────────────────────────

  /**
   * Construye un path SVG suavizado usando Catmull-Rom → cubic bezier.
   * @param  {Array<{x:number,y:number}>} pts
   * @return {string}
   */
  function _smoothPath(pts) {
    if (pts.length === 0) return '';
    if (pts.length === 1) return 'M' + pts[0].x + ',' + pts[0].y;
    let d = 'M' + pts[0].x.toFixed(2) + ',' + pts[0].y.toFixed(2);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0  = pts[i > 0 ? i - 1 : 0];
      const p1  = pts[i];
      const p2  = pts[i + 1];
      const p3  = pts[i + 2] !== undefined ? pts[i + 2] : p2;
      // Conversión Catmull-Rom → cubic bezier (factor 1/6)
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

  /**
   * Construye un path SVG de segmentos rectos.
   * @param  {Array<{x:number,y:number}>} pts
   * @return {string}
   */
  function _linePath(pts) {
    if (pts.length === 0) return '';
    let d = 'M' + pts[0].x.toFixed(2) + ',' + pts[0].y.toFixed(2);
    for (let i = 1; i < pts.length; i++) {
      d += ' L' + pts[i].x.toFixed(2) + ',' + pts[i].y.toFixed(2);
    }
    return d;
  }

  // ── MtsChartLine ─────────────────────────────────────────────────────────────

  class MtsChartLine extends MtsChart {
    get _type() { return 'line'; }

    _render() {
      // Cancelar animación pendiente
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      // Remover SVG y leyenda anteriores
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
        right:  (opts.margin && opts.margin.right  != null) ? opts.margin.right  : 24,
        bottom: (opts.margin && opts.margin.bottom != null) ? opts.margin.bottom : 44,
        left:   (opts.margin && opts.margin.left   != null) ? opts.margin.left   : 56,
      };

      const chartW = W - mg.left - mg.right;
      const chartH = heightOpt - mg.top - mg.bottom;

      if (chartW <= 0 || chartH <= 0 || n === 0) return;

      // ── Escala Y ───────────────────────────────────────────────────────────
      let allVals = [];
      for (let d = 0; d < datasets.length; d++) {
        allVals = allVals.concat(datasets[d].values || []);
      }
      const dataMax = allVals.length ? Math.max.apply(null, allVals) : 1;
      const dataMin = Math.min(0, allVals.length ? Math.min.apply(null, allVals) : 0);
      const rawMin  = (opts.yAxis && opts.yAxis.min != null) ? opts.yAxis.min : dataMin;
      const rawMax  = (opts.yAxis && opts.yAxis.max != null) ? opts.yAxis.max : dataMax;
      const nTicks  = (opts.yAxis && opts.yAxis.ticks) ? opts.yAxis.ticks : 5;
      const yNice   = u.niceScale(rawMin, rawMax, nTicks);
      const yRange  = yNice.max - yNice.min;
      const yScale  = function (v) {
        return chartH - (v - yNice.min) / yRange * chartH;
      };
      const yZero   = yScale(Math.max(yNice.min, 0));
      const yFmt    = (opts.yAxis && opts.yAxis.formatter) ? opts.yAxis.formatter : u.defaultFmt;

      // ── Escala X (posiciones de puntos, borde a borde) ────────────────────
      const xPos = function (i) {
        if (n <= 1) return chartW / 2;
        return i * chartW / (n - 1);
      };
      const xFmt = (opts.xAxis && opts.xAxis.formatter) ? opts.xAxis.formatter : function (v) { return v; };

      // ── SVG ────────────────────────────────────────────────────────────────
      const svg = u.svgEl('svg', {
        width:   W,
        height:  heightOpt,
        'class': 'mts-chart__svg',
        role:    'img',
        'aria-label': 'Line chart',
      });
      this._svg = svg;

      const g = u.svgEl('g', {
        transform: 'translate(' + mg.left + ',' + mg.top + ')',
      });
      svg.appendChild(g);

      // ── Grid ───────────────────────────────────────────────────────────────
      if (opts.grid !== false) {
        const gGrid = u.svgEl('g', { 'class': 'mts-chart__grid' });
        for (let ti = 0; ti < yNice.ticks.length; ti++) {
          const gy = Math.round(yScale(yNice.ticks[ti]));
          gGrid.appendChild(u.svgEl('line', {
            x1: 0, y1: gy, x2: chartW, y2: gy,
            'class': 'mts-chart__grid-line',
          }));
        }
        g.appendChild(gGrid);
      }

      // ── Fills (detrás de las líneas) ───────────────────────────────────────
      const gFills = u.svgEl('g', { 'class': 'mts-chart__fills' });
      g.appendChild(gFills);

      // ── Lines ──────────────────────────────────────────────────────────────
      const gLines = u.svgEl('g', { 'class': 'mts-chart__lines' });
      g.appendChild(gLines);

      // ── Dots ───────────────────────────────────────────────────────────────
      const gDots = u.svgEl('g', { 'class': 'mts-chart__dots' });
      g.appendChild(gDots);

      const animate  = opts.animate !== false;
      const animTgts = []; // [{ path, len, fillEl, fillTarget, dots }]
      const self     = this;

      for (let di = 0; di < datasets.length; di++) {
        const ds          = datasets[di];
        const color       = ds.color       || u.PALETTE[di % u.PALETTE.length];
        const lineWidth   = ds.lineWidth   != null ? ds.lineWidth   : 2;
        const smooth      = ds.smooth      !== false; // default: true
        const showDots    = ds.showDots    !== false; // default: true
        const dotRadius   = ds.dotRadius   != null ? ds.dotRadius   : 4;
        const fill        = !!ds.fill;
        const fillOpacity = ds.fillOpacity != null ? ds.fillOpacity : 0.12;
        const vals        = ds.values || [];

        // Construir array de puntos {x, y}
        const pts = [];
        for (let i = 0; i < vals.length; i++) {
          pts.push({ x: xPos(i), y: yScale(vals[i]) });
        }
        if (pts.length === 0) continue;

        // ── Fill (área bajo la línea) ───────────────────────────────────────
        let fillEl = null;
        if (fill) {
          const linePart = smooth ? _smoothPath(pts) : _linePath(pts);
          const lastX    = pts[pts.length - 1].x;
          const firstX   = pts[0].x;
          const areaD    = linePart
            + ' L' + lastX.toFixed(2)  + ',' + yZero.toFixed(2)
            + ' L' + firstX.toFixed(2) + ',' + yZero.toFixed(2)
            + ' Z';
          fillEl = u.svgEl('path', {
            d:              areaD,
            fill:           color,
            'fill-opacity': animate ? 0 : fillOpacity,
            stroke:         'none',
            'class':        'mts-chart__fill',
          });
          gFills.appendChild(fillEl);
        }

        // ── Línea ───────────────────────────────────────────────────────────
        const lineD    = smooth ? _smoothPath(pts) : _linePath(pts);
        const linePath = u.svgEl('path', {
          d:                  lineD,
          stroke:             color,
          'stroke-width':     lineWidth,
          fill:               'none',
          'stroke-linecap':   'round',
          'stroke-linejoin':  'round',
          'class':            'mts-chart__line',
        });
        gLines.appendChild(linePath);

        // ── Dots ────────────────────────────────────────────────────────────
        const dotEls = [];
        if (showDots) {
          for (let j = 0; j < pts.length; j++) {
            // Capturar variables para closures
            (function (pt, lbl, val, dsLbl, col, idx) {
              const circle = u.svgEl('circle', {
                cx: pt.x.toFixed(2),
                cy: pt.y.toFixed(2),
                r:  dotRadius,
                stroke:         col,
                'stroke-width': 2,
                'class':        'mts-chart__dot',
                opacity:        animate ? 0 : 1,
              });

              circle.addEventListener('mouseenter', function (e) {
                self._showTooltip(e, lbl, val, dsLbl, col);
                circle.setAttribute('r', dotRadius + 2);
              });
              circle.addEventListener('mousemove', function (e) {
                self._moveTooltip(e);
              });
              circle.addEventListener('mouseleave', function () {
                self._hideTooltip();
                circle.setAttribute('r', dotRadius);
              });
              circle.addEventListener('click', function () {
                self._emit('click', { label: lbl, value: val, datasetIndex: di, index: idx, color: col });
              });

              gDots.appendChild(circle);
              dotEls.push(circle);
            }(pts[j], labels[j] || '', vals[j], datasets.length > 1 ? (ds.label || '') : '', color, j));
          }
        }

        if (animate) {
          animTgts.push({
            path:       linePath,
            len:        0,          // se calcula después del append al DOM
            fillEl:     fillEl,
            fillTarget: fillOpacity,
            dots:       dotEls,
          });
        }
      }

      // ── Eje Y ──────────────────────────────────────────────────────────────
      const gAxisY = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--y' });
      gAxisY.appendChild(u.svgEl('line', {
        x1: 0, y1: 0, x2: 0, y2: chartH,
        'class': 'mts-chart__axis-line',
      }));
      for (let ti = 0; ti < yNice.ticks.length; ti++) {
        const tick = yNice.ticks[ti];
        const ty   = Math.round(yScale(tick));
        gAxisY.appendChild(u.svgEl('line', {
          x1: -4, y1: ty, x2: 0, y2: ty,
          'class': 'mts-chart__axis-tick',
        }));
        const yLbl = u.svgEl('text', {
          x: -10, y: ty,
          'text-anchor':       'end',
          'dominant-baseline': 'middle',
          'class':             'mts-chart__axis-label',
        });
        yLbl.textContent = yFmt(tick); // XSS-safe
        gAxisY.appendChild(yLbl);
      }
      g.appendChild(gAxisY);

      // ── Eje X ──────────────────────────────────────────────────────────────
      const gAxisX = u.svgEl('g', {
        'class':   'mts-chart__axis mts-chart__axis--x',
        transform: 'translate(0,' + chartH + ')',
      });
      gAxisX.appendChild(u.svgEl('line', {
        x1: 0, y1: 0, x2: chartW, y2: 0,
        'class': 'mts-chart__axis-line',
      }));
      for (let xi = 0; xi < labels.length; xi++) {
        const lx = Math.round(xPos(xi));
        gAxisX.appendChild(u.svgEl('line', {
          x1: lx, y1: 0, x2: lx, y2: 4,
          'class': 'mts-chart__axis-tick',
        }));
        const xLbl = u.svgEl('text', {
          x: lx, y: 16,
          'text-anchor': 'middle',
          'class':       'mts-chart__axis-label',
        });
        xLbl.textContent = xFmt(labels[xi]); // XSS-safe
        gAxisX.appendChild(xLbl);
      }
      g.appendChild(gAxisX);

      // ── Línea del cero (solo cuando hay valores negativos) ─────────────────
      if (yNice.min < 0 && yNice.max > 0) {
        g.appendChild(u.svgEl('line', {
          x1: 0, y1: Math.round(yZero), x2: chartW, y2: Math.round(yZero),
          'class': 'mts-chart__zero-line',
        }));
      }

      // Insertar SVG antes del tooltip (que ya está en el DOM)
      this._el.insertBefore(svg, this._tooltipEl);

      // ── Leyenda ────────────────────────────────────────────────────────────
      if (opts.legend !== false && datasets.length > 1) {
        this._legendEl = this._buildLegend(datasets, 'mts-chart__legend-dot--circle');
      }

      // ── Animación (stroke-dashoffset) ──────────────────────────────────────
      if (animate && animTgts.length > 0) {
        // Obtener longitud de cada path — requiere que el SVG esté en el DOM
        for (let at = 0; at < animTgts.length; at++) {
          const tgt = animTgts[at];
          const len = tgt.path.getTotalLength ? tgt.path.getTotalLength() : 0;
          tgt.len   = len;
          if (len > 0) {
            tgt.path.setAttribute('stroke-dasharray',  len);
            tgt.path.setAttribute('stroke-dashoffset', len);
          }
        }

        const duration = opts.animateDuration || 600;
        const t0       = performance.now();

        function step(now) {
          // Abortar si el SVG fue removido del DOM
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }

          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);

          for (let i = 0; i < animTgts.length; i++) {
            const tgt = animTgts[i];
            if (tgt.len > 0) {
              tgt.path.setAttribute('stroke-dashoffset', tgt.len * (1 - ease));
            }
            if (tgt.fillEl) {
              tgt.fillEl.setAttribute('fill-opacity', tgt.fillTarget * ease);
            }
          }

          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            // Limpiar dasharray/dashoffset + mostrar dots
            for (let i = 0; i < animTgts.length; i++) {
              const tgt = animTgts[i];
              if (tgt.len > 0) {
                tgt.path.removeAttribute('stroke-dasharray');
                tgt.path.removeAttribute('stroke-dashoffset');
              }
              if (tgt.fillEl) {
                tgt.fillEl.setAttribute('fill-opacity', tgt.fillTarget);
              }
              for (let di = 0; di < tgt.dots.length; di++) {
                tgt.dots[di].setAttribute('opacity', 1);
              }
            }
          }
        }

        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  global.MTS.ChartLine = MtsChartLine;

}(typeof window !== 'undefined' ? window : this));
