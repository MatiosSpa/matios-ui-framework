/**
 * MTS.ChartPie (v1.0.0)
 * Pie y Donut — SVG puro · 0 dependencias · XSS-safe
 *
 * Dep: matios-ui-chart.js  (debe cargarse antes)
 *
 * API de datos:
 *   data.labels              {string[]}  — nombre de cada sector
 *   data.datasets[0].values  {number[]}  — valor de cada sector
 *   data.datasets[0].colors  {string[]}  — color por sector (opcional, default: paleta interna)
 *
 * Opciones:
 *   options.height           {number}   — alto total del SVG. Default: 320
 *   options.innerRadius      {number}   — radio interior en px (>0 = donut). Default: 0
 *   options.centerText       {string}   — texto principal en el centro del donut
 *   options.centerSubText    {string}   — subtexto en el centro del donut
 *   options.labels           {boolean|Object}  — false: ocultar callouts. Default: true
 *   options.labels.formatter {Function} — fn(value, label, pct) → string
 *   options.legend           {boolean}  — Default: true
 *   options.animate          {boolean}  — Default: true
 *   options.animateDuration  {number}   — ms. Default: 600
 *   options.responsive       {boolean}  — Default: true
 *
 * Seguridad:
 *   - labels, dataset.label, valores → textContent. Nunca innerHTML con datos externos.
 *   - centerText / centerSubText son opciones del desarrollador (trusted) → textContent.
 */
(function (global) {
  'use strict';

  if (!global.MTS || !global.MTS.Chart) {
    throw new Error('matios-ui-chart-pie.js: MTS.Chart no encontrado. Incluir matios-ui-chart.js primero.');
  }

  const MtsChart = global.MTS.Chart;
  const u        = MtsChart._utils; // { svgEl, niceScale, defaultFmt, easeOut, PALETTE }
  const TWO_PI   = Math.PI * 2;

  function f(v) { return v.toFixed(2); }

  // ── Generadores de path ──────────────────────────────────────────────────────

  function _arcPath(cx, cy, r, innerR, startAngle, endAngle) {
    const x1    = cx + r * Math.cos(startAngle);
    const y1    = cy + r * Math.sin(startAngle);
    const x2    = cx + r * Math.cos(endAngle);
    const y2    = cy + r * Math.sin(endAngle);
    const large = (endAngle - startAngle > Math.PI) ? 1 : 0;

    if (innerR > 0) {
      const ix1 = cx + innerR * Math.cos(endAngle);
      const iy1 = cy + innerR * Math.sin(endAngle);
      const ix2 = cx + innerR * Math.cos(startAngle);
      const iy2 = cy + innerR * Math.sin(startAngle);
      return 'M' + f(x1)  + ',' + f(y1)
           + ' A' + r + ',' + r + ' 0 ' + large + ' 1 ' + f(x2) + ',' + f(y2)
           + ' L' + f(ix1) + ',' + f(iy1)
           + ' A' + innerR + ',' + innerR + ' 0 ' + large + ' 0 ' + f(ix2) + ',' + f(iy2)
           + ' Z';
    }
    return 'M' + f(cx) + ',' + f(cy)
         + ' L' + f(x1) + ',' + f(y1)
         + ' A' + r + ',' + r + ' 0 ' + large + ' 1 ' + f(x2) + ',' + f(y2)
         + ' Z';
  }

  // Círculo completo cuando un sector ocupa el 100% (el arco SVG no puede ser 360°)
  function _fullCircle(cx, cy, r, innerR) {
    const t = f(cy - r);
    const b = f(cy + r);
    const cxf = f(cx);
    if (innerR > 0) {
      const it = f(cy - innerR);
      const ib = f(cy + innerR);
      return 'M' + cxf + ',' + t
           + ' A' + r + ',' + r + ' 0 1 1 ' + cxf + ',' + b
           + ' A' + r + ',' + r + ' 0 1 1 ' + cxf + ',' + t + ' Z'
           + ' M' + cxf + ',' + it
           + ' A' + innerR + ',' + innerR + ' 0 1 0 ' + cxf + ',' + ib
           + ' A' + innerR + ',' + innerR + ' 0 1 0 ' + cxf + ',' + it + ' Z';
    }
    return 'M' + cxf + ',' + t
         + ' A' + r + ',' + r + ' 0 1 1 ' + cxf + ',' + b
         + ' A' + r + ',' + r + ' 0 1 1 ' + cxf + ',' + t + ' Z';
  }

  // ── MtsChartPie ──────────────────────────────────────────────────────────────

  class MtsChartPie extends MtsChart {
    get _type() { return 'pie'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }
      if (this._legendEl) { this._legendEl.remove(); this._legendEl = null; }

      const cfg      = this._cfg;
      const data     = cfg.data    || { labels: [], datasets: [] };
      const opts     = cfg.options || {};
      const labels   = data.labels   || [];
      const datasets = data.datasets || [];

      if (!datasets.length) return;
      const ds     = datasets[0];
      const values = ds.values || [];
      const n      = values.length;
      if (n === 0) return;

      // ── Colores ────────────────────────────────────────────────────────────
      const colors = [];
      for (let i = 0; i < n; i++) {
        colors.push((ds.colors && ds.colors[i]) ? ds.colors[i] : u.PALETTE[i % u.PALETTE.length]);
      }

      // ── Dimensiones ────────────────────────────────────────────────────────
      const W          = this._el.clientWidth || 400;
      const heightOpt  = opts.height || 320;
      const showLabels = opts.labels !== false;
      const labelMg    = showLabels ? 68 : 20;

      const cx = W / 2;
      const cy = heightOpt / 2;
      const r  = Math.max(10, Math.min(cx - labelMg, cy - labelMg));

      // innerRadius: px absoluto (≥1) o fracción (0–1) del radio
      let innerR = opts.innerRadius || 0;
      if (innerR > 0 && innerR < 1) innerR = innerR * r;
      innerR = Math.max(0, Math.min(Math.round(innerR), r - 4));

      // ── Total ──────────────────────────────────────────────────────────────
      const total = values.reduce(function (s, v) { return s + Math.abs(v); }, 0);
      if (total === 0) return;

      // ── Sectores ───────────────────────────────────────────────────────────
      const sectors = [];
      let angle = -Math.PI / 2; // empieza en la parte superior
      for (let i = 0; i < n; i++) {
        const abs   = Math.abs(values[i]);
        const sweep = (abs / total) * TWO_PI;
        const start = angle;
        const end   = angle + sweep;
        sectors.push({
          start: start,
          end:   end,
          sweep: sweep,
          color: colors[i],
          label: labels[i] || '',
          value: values[i],
          pct:   abs / total,
        });
        angle = end;
      }

      // ── SVG ────────────────────────────────────────────────────────────────
      const svg = u.svgEl('svg', {
        width:   W,
        height:  heightOpt,
        'class': 'mts-chart__svg',
        role:    'img',
        'aria-label': innerR > 0 ? 'Donut chart' : 'Pie chart',
      });
      this._svg = svg;

      const g = u.svgEl('g');
      svg.appendChild(g);

      // ── Grupos ─────────────────────────────────────────────────────────────
      const gSectors = u.svgEl('g', { 'class': 'mts-chart__sectors' });
      const gLabels  = u.svgEl('g', { 'class': 'mts-chart__pie-labels' });
      g.appendChild(gSectors);
      g.appendChild(gLabels);

      const animate  = opts.animate !== false;
      const sectorEls = [];
      const self      = this;

      // ── Dibuja sectores ────────────────────────────────────────────────────
      const labelCfg = (opts.labels && typeof opts.labels === 'object') ? opts.labels : {};
      const labelFmt = labelCfg.formatter || function (val, lbl, pct) {
        return lbl ? lbl + ' · ' + Math.round(pct * 100) + '%' : Math.round(pct * 100) + '%';
      };

      for (let i = 0; i < sectors.length; i++) {
        const s = sectors[i];
        // Calcular path completo
        const fullD = (s.sweep > TWO_PI - 0.0001)
          ? _fullCircle(cx, cy, r, innerR)
          : _arcPath(cx, cy, r, innerR, s.start, s.end);

        const path = u.svgEl('path', {
          d:       animate ? '' : fullD,
          fill:    s.color,
          stroke:  'var(--mts-bg-surface, #fff)',
          'stroke-width': 1.5,
          'class': 'mts-chart__sector',
        });

        // Capturar variables para closures
        (function (path, sector, idx) {
          path.addEventListener('mouseenter', function (e) {
            self._showTooltip(e, sector.label, sector.value, '', sector.color);
            path.setAttribute('opacity', '0.82');
          });
          path.addEventListener('mousemove', function (e) {
            self._moveTooltip(e);
          });
          path.addEventListener('mouseleave', function () {
            self._hideTooltip();
            path.setAttribute('opacity', '1');
          });
          path.addEventListener('click', function () {
            self._emit('click', {
              label: sector.label,
              value: sector.value,
              index: idx,
              color: sector.color,
              pct:   sector.pct,
            });
          });
        }(path, s, i));

        gSectors.appendChild(path);
        sectorEls.push({ el: path, fullD: fullD, start: s.start, end: s.end });
      }

      // ── Labels callout ─────────────────────────────────────────────────────
      if (showLabels) {
        for (let i = 0; i < sectors.length; i++) {
          const s    = sectors[i];
          if (s.pct < 0.04) continue; // sector muy pequeño — omitir label

          const mid  = (s.start + s.end) / 2;
          const cos  = Math.cos(mid);
          const sin  = Math.sin(mid);
          const x1   = cx + r * cos;
          const y1   = cy + r * sin;
          const x2   = cx + (r + 14) * cos;
          const y2   = cy + (r + 14) * sin;
          const side = cos >= 0 ? 1 : -1;
          const x3   = x2 + side * 16;
          const y3   = y2;

          // Línea guía
          const line = u.svgEl('polyline', {
            points:  f(x1) + ',' + f(y1) + ' ' + f(x2) + ',' + f(y2) + ' ' + f(x3) + ',' + f(y3),
            'class': 'mts-chart__pie-callout',
            stroke:  s.color,
          });
          gLabels.appendChild(line);

          // Texto — XSS-safe
          const txt = u.svgEl('text', {
            x:             f(x3 + side * 4),
            y:             f(y3),
            'text-anchor': cos >= 0 ? 'start' : 'end',
            'class':       'mts-chart__pie-label-text',
          });
          txt.textContent = labelFmt(s.value, s.label, s.pct); // XSS-safe
          gLabels.appendChild(txt);
        }
      }

      // ── Centro del donut ───────────────────────────────────────────────────
      if (innerR > 0) {
        const centerText    = opts.centerText    || '';
        const centerSubText = opts.centerSubText || '';

        if (centerText) {
          const dy = centerSubText ? '-0.4em' : '0';
          const main = u.svgEl('text', {
            x: f(cx), y: f(cy),
            'class': 'mts-chart__pie-center-text',
            dy: dy,
          });
          main.textContent = centerText; // XSS-safe — opción del desarrollador
          g.appendChild(main);
        }

        if (centerSubText) {
          const sub = u.svgEl('text', {
            x: f(cx), y: f(cy),
            'class': 'mts-chart__pie-center-sub',
            dy: centerText ? '1.3em' : '0',
          });
          sub.textContent = centerSubText; // XSS-safe
          g.appendChild(sub);
        }
      }

      // Insertar SVG antes del tooltip
      this._el.insertBefore(svg, this._tooltipEl);

      // ── Leyenda ────────────────────────────────────────────────────────────
      if (opts.legend !== false) {
        this._legendEl = this._buildPieLegend(labels, colors, n);
      }

      // ── Animación (sweep) ──────────────────────────────────────────────────
      if (animate && sectorEls.length > 0) {
        const duration = opts.animateDuration || 600;
        const t0       = performance.now();
        const BASE     = -Math.PI / 2;

        if (showLabels) gLabels.setAttribute('opacity', '0');

        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }

          const t        = Math.min((now - t0) / duration, 1);
          const ease     = u.easeOut(t);
          const maxAngle = BASE + ease * TWO_PI;

          for (let i = 0; i < sectorEls.length; i++) {
            const se = sectorEls[i];
            if (se.start >= maxAngle) {
              se.el.setAttribute('d', '');
            } else if (se.end <= maxAngle) {
              se.el.setAttribute('d', se.fullD);
            } else {
              se.el.setAttribute('d', _arcPath(cx, cy, r, innerR, se.start, maxAngle));
            }
          }

          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < sectorEls.length; i++) {
              sectorEls[i].el.setAttribute('d', sectorEls[i].fullD);
            }
            if (showLabels) gLabels.setAttribute('opacity', '1');
          }
        }

        this._animReq = requestAnimationFrame(step);
      }
    }

    _buildPieLegend(labels, colors, n) {
      const wrap = document.createElement('div');
      wrap.className = 'mts-chart__legend';

      for (let i = 0; i < n; i++) {
        const item = document.createElement('div');
        item.className = 'mts-chart__legend-item';

        const dot = document.createElement('span');
        dot.className = 'mts-chart__legend-dot mts-chart__legend-dot--circle';
        dot.style.background = colors[i];

        const lbl = document.createElement('span');
        lbl.className = 'mts-chart__legend-label';
        lbl.textContent = labels[i] || ('Serie ' + (i + 1)); // XSS-safe

        item.appendChild(dot);
        item.appendChild(lbl);
        wrap.appendChild(item);
      }

      this._el.appendChild(wrap);
      return wrap;
    }
  }

  global.MTS.ChartPie = MtsChartPie;

}(typeof window !== 'undefined' ? window : this));
