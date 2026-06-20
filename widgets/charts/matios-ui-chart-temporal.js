/**
 * MTS.ChartCandlestick / MTS.ChartGantt (v2.0.0)
 * SVG puro · 0 dependencias · XSS-safe
 *
 * Dep: matios-ui-chart.js (debe cargarse antes)
 *
 * Exporta:
 *   MTS.ChartCandlestick — OHLC, cuerpo + sombra, eje X categórico
 *   MTS.ChartGantt       — Gantt interactivo con fechas, drag, resize y dependencias
 *
 * Candlestick:
 *   data.labels    {string[]}
 *   data.datasets[0].values = [{open, high, low, close}, ...]
 *   options:
 *     bullColor    {string}  — color barra alcista. Default: '#10b981'
 *     bearColor    {string}  — color barra bajista. Default: '#e53935'
 *     wickWidth    {number}  — grosor de la mecha en px. Default: 1.5
 *     paddingInner {number}  — fracción de gap entre velas. Default: 0.25
 *     yAxis        { min, max, ticks, formatter }
 *     height, margin, animate
 *
 * Gantt v2.0:
 *   data.tasks = [{ id, label, start, end, color, group, deps:[] }]
 *   options:
 *     scale        {'day'|'week'|'month'}  — unidad del eje X. Default: 'week'
 *     editable     {boolean}  — habilita drag + resize. Default: false
 *     rowHeight    {number}   — alto de cada fila en px. Default: 36
 *     labelWidth   {number}   — ancho de columna de etiquetas en px. Default: 160
 *     onTaskMove   {function} — callback({ id, label, start, end })
 *     onTaskResize {function} — callback({ id, label, start, end })
 *     onClick      {function} — callback({ id, label, start, end, color })
 *     height, animate
 */
(function (global) {
  'use strict';

  if (!global.MTS || !global.MTS.Chart) {
    throw new Error('matios-ui-chart-temporal.js: MTS.Chart no encontrado. Incluir matios-ui-chart.js primero.');
  }

  const MtsChart = global.MTS.Chart;
  const u        = MtsChart._utils;

  // ── MtsChartCandlestick ──────────────────────────────────────────────────────

  class MtsChartCandlestick extends MtsChart {
    get _type() { return 'candlestick'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)      { this._svg.remove();      this._svg      = null; }

      const cfg      = this._cfg;
      const data     = cfg.data    || {};
      const opts     = cfg.options || {};
      const labels   = data.labels || [];
      const vals     = (data.datasets && data.datasets[0] && data.datasets[0].values) || [];
      const n        = Math.min(labels.length, vals.length);
      if (n === 0) return;

      const bullColor  = opts.bullColor    || '#10b981';
      const bearColor  = opts.bearColor    || '#e53935';
      const wickW      = opts.wickWidth    != null ? opts.wickWidth    : 1.5;
      const innerFrac  = opts.paddingInner != null ? opts.paddingInner : 0.25;
      const outerFrac  = opts.paddingOuter != null ? opts.paddingOuter : 0.04;
      const animate    = opts.animate !== false;

      const W         = this._el.clientWidth || 400;
      const heightOpt = opts.height || 320;
      const mg        = {
        top:    (opts.margin && opts.margin.top    != null) ? opts.margin.top    : 20,
        right:  (opts.margin && opts.margin.right  != null) ? opts.margin.right  : 16,
        bottom: (opts.margin && opts.margin.bottom != null) ? opts.margin.bottom : 44,
        left:   (opts.margin && opts.margin.left   != null) ? opts.margin.left   : 64,
      };
      const chartW = W - mg.left - mg.right;
      const chartH = heightOpt - mg.top - mg.bottom;
      if (chartW <= 0 || chartH <= 0) return;

      let allLow = [], allHigh = [];
      for (let i = 0; i < n; i++) { allLow.push(vals[i].low); allHigh.push(vals[i].high); }
      const rawMin  = (opts.yAxis && opts.yAxis.min != null) ? opts.yAxis.min : Math.min.apply(null, allLow);
      const rawMax  = (opts.yAxis && opts.yAxis.max != null) ? opts.yAxis.max : Math.max.apply(null, allHigh);
      const yNice   = u.niceScale(rawMin, rawMax, (opts.yAxis && opts.yAxis.ticks) ? opts.yAxis.ticks : 5);
      const yRange  = yNice.max - yNice.min || 1;
      const yScale  = function (v) { return chartH - (v - yNice.min) / yRange * chartH; };
      const yFmt    = (opts.yAxis && opts.yAxis.formatter) ? opts.yAxis.formatter : u.defaultFmt;

      const outerPx  = chartW * outerFrac;
      const bandStep = (chartW - 2 * outerPx) / n;
      const bandW    = Math.max(2, bandStep * (1 - innerFrac));
      function xBand(i) { return outerPx + i * bandStep + (bandStep - bandW) / 2; }

      const svg  = u.svgEl('svg', { width: W, height: heightOpt, 'class': 'mts-chart__svg', role: 'img', 'aria-label': 'Candlestick chart' });
      this._svg  = svg;
      const g    = u.svgEl('g', { transform: 'translate(' + mg.left + ',' + mg.top + ')' });
      svg.appendChild(g);

      if (opts.grid !== false) {
        const gGrid = u.svgEl('g', { 'class': 'mts-chart__grid' });
        for (let ti = 0; ti < yNice.ticks.length; ti++) {
          const y = Math.round(yScale(yNice.ticks[ti]));
          gGrid.appendChild(u.svgEl('line', { x1: 0, y1: y, x2: chartW, y2: y, 'class': 'mts-chart__grid-line' }));
        }
        g.appendChild(gGrid);
      }

      const self    = this;
      const barTgts = [];

      for (let i = 0; i < n; i++) {
        const c    = vals[i];
        const bull = c.close >= c.open;
        const col  = bull ? bullColor : bearColor;
        const bx   = Math.round(xBand(i));
        const cx   = Math.round(bx + bandW / 2);
        const yH   = Math.round(yScale(c.high));
        const yL   = Math.round(yScale(c.low));
        const yO   = Math.round(yScale(c.open));
        const yCl  = Math.round(yScale(c.close));
        const bTop = Math.min(yO, yCl);
        const bBot = Math.max(yO, yCl);
        const bh   = Math.max(1, bBot - bTop);
        const midY = Math.round((yO + yCl) / 2);

        g.appendChild(u.svgEl('line', {
          x1: cx, y1: yH, x2: cx, y2: yL,
          stroke: col, 'stroke-width': wickW,
        }));

        const body = u.svgEl('rect', {
          x: bx, y: animate ? midY : bTop,
          width: Math.round(bandW), height: animate ? 0 : bh,
          fill: col, rx: 1, 'class': 'mts-chart__bar', style: 'cursor:pointer',
        });

        (function (el, c, lbl, col, i) {
          el.addEventListener('mouseenter', function (e) {
            const t = self._tooltipEl;
            while (t.firstChild) t.removeChild(t.firstChild);
            const header = document.createElement('div');
            header.className = 'mts-chart__tooltip-dataset';
            const dot = document.createElement('span');
            dot.className = 'mts-chart__tooltip-dot';
            dot.style.background = col;
            const nm = document.createElement('span');
            nm.textContent = lbl;
            header.appendChild(dot); header.appendChild(nm);
            t.appendChild(header);
            const rows = [['Open', c.open], ['High', c.high], ['Low', c.low], ['Close', c.close]];
            for (let ri = 0; ri < rows.length; ri++) {
              const row = document.createElement('div');
              row.className = 'mts-chart__tooltip-row';
              const lb = document.createElement('span');
              lb.className = 'mts-chart__tooltip-label';
              lb.textContent = rows[ri][0];
              const vl = document.createElement('span');
              vl.className = 'mts-chart__tooltip-value';
              vl.textContent = yFmt(rows[ri][1]);
              row.appendChild(lb); row.appendChild(vl);
              t.appendChild(row);
            }
            t.classList.add('mts-chart__tooltip--visible');
            self._moveTooltip(e);
            el.setAttribute('opacity', '0.75');
          });
          el.addEventListener('mousemove',  function (e) { self._moveTooltip(e); });
          el.addEventListener('mouseleave', function ()  { self._hideTooltip(); el.setAttribute('opacity', '1'); });
          el.addEventListener('click',      function ()  { self._emit('click', { label: lbl, open: c.open, high: c.high, low: c.low, close: c.close, index: i, color: col }); });
        }(body, c, labels[i] || '', col, i));

        if (animate) barTgts.push({ el: body, fromY: midY, toY: bTop, toH: bh });
        g.appendChild(body);
      }

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

      const gAxisX = u.svgEl('g', { 'class': 'mts-chart__axis mts-chart__axis--x', transform: 'translate(0,' + chartH + ')' });
      gAxisX.appendChild(u.svgEl('line', { x1: 0, y1: 0, x2: chartW, y2: 0, 'class': 'mts-chart__axis-line' }));
      const labelStep = Math.max(1, Math.ceil(n / 10));
      for (let i = 0; i < n; i += labelStep) {
        const x = Math.round(xBand(i) + bandW / 2);
        gAxisX.appendChild(u.svgEl('line', { x1: x, y1: 0, x2: x, y2: 4, 'class': 'mts-chart__axis-tick' }));
        const lbl = u.svgEl('text', { x: x, y: 16, 'text-anchor': 'middle', 'class': 'mts-chart__axis-label' });
        lbl.textContent = labels[i];
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
            b.el.setAttribute('height', Math.max(0, b.toH * ease));
          }
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < barTgts.length; i++) {
              barTgts[i].el.setAttribute('y',      barTgts[i].toY);
              barTgts[i].el.setAttribute('height', barTgts[i].toH);
            }
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  // ── MtsChartGantt v2.0 ───────────────────────────────────────────────────────

  class MtsChartGantt extends MtsChart {
    get _type() { return 'gantt'; }

    // ── Date helpers ──────────────────────────────────────────────────────────

    _parseDate(s) {
      if (typeof s === 'number') return s;
      const p = String(s).split('-');
      if (p.length === 3) return new Date(+p[0], +p[1] - 1, +p[2]).getTime();
      return new Date(s).getTime();
    }

    _tsToStr(ts) {
      const d   = new Date(ts);
      const y   = d.getFullYear();
      const m   = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return y + '-' + m + '-' + day;
    }

    _isoWeek(ts) {
      const d      = new Date(ts);
      const jan4   = new Date(d.getFullYear(), 0, 4);
      const start1 = new Date(jan4);
      start1.setDate(jan4.getDate() - (jan4.getDay() + 6) % 7);
      return Math.max(1, Math.floor((d.getTime() - start1.getTime()) / (7 * 86400000)) + 1);
    }

    _snapToScale(ts, scale) {
      const d = new Date(ts);
      if (scale === 'week') {
        d.setDate(d.getDate() - (d.getDay() + 6) % 7);
      } else if (scale === 'month') {
        d.setDate(1);
      }
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }

    _addScale(ts, n, scale) {
      const d = new Date(ts);
      if (scale === 'day')   d.setDate(d.getDate() + n);
      if (scale === 'week')  d.setDate(d.getDate() + n * 7);
      if (scale === 'month') d.setMonth(d.getMonth() + n);
      return d.getTime();
    }

    _fmtFull(ts) {
      const d  = new Date(ts);
      const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return d.getDate() + ' ' + mo[d.getMonth()] + ' ' + d.getFullYear();
    }

    _buildCols(xMin, xMax, scale) {
      const cols = [];
      let ts = this._snapToScale(xMin, scale);
      // Ensure we start at or before xMin
      while (ts > xMin) ts = this._addScale(ts, -1, scale);
      while (ts <= xMax) {
        cols.push(ts);
        ts = this._addScale(ts, 1, scale);
      }
      return cols;
    }

    _minScaleMs(scale) {
      if (scale === 'day')   return 86400000;
      if (scale === 'week')  return 7 * 86400000;
      return 28 * 86400000; // month (approx)
    }

    // ── Main render ───────────────────────────────────────────────────────────

    _render() {
      if (this._animReq)    { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)        { this._svg.remove(); this._svg = null; }
      if (this._dragCleanup){ this._dragCleanup(); this._dragCleanup = null; }

      const cfg   = this._cfg;
      const data  = cfg.data    || {};
      const opts  = cfg.options || {};

      // Deep-clone tasks so internal _start/_end don't mutate original
      const rawTasks = data.tasks || [];
      if (!rawTasks.length) return;

      const tasks = rawTasks.map(function(t) {
        return {
          id:    t.id    || String(Math.random()),
          label: t.label || '',
          start: t.start,
          end:   t.end,
          color: t.color || null,
          group: t.group || null,
          deps:  t.deps  ? t.deps.slice() : [],
          _src:  t,       // reference to original
        };
      });

      const scale    = opts.scale     || 'week';
      const editable = opts.editable  === true;
      const rowH     = opts.rowHeight  != null ? opts.rowHeight  : 36;
      const labelW   = opts.labelWidth != null ? opts.labelWidth : 160;
      const animate  = opts.animate !== false;

      const MONTH_HDR_H  = 26; // top header row (month names)
      const SCALE_HDR_H  = 22; // bottom header row (weeks/days/months)
      const HEADER_H     = MONTH_HDR_H + SCALE_HDR_H;
      const MONTHS       = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

      const self = this;

      // Parse dates
      for (let i = 0; i < tasks.length; i++) {
        tasks[i]._start = self._parseDate(tasks[i].start);
        tasks[i]._end   = self._parseDate(tasks[i].end);
      }

      // X range
      let xMin = Infinity, xMax = -Infinity;
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i]._start < xMin) xMin = tasks[i]._start;
        if (tasks[i]._end   > xMax) xMax = tasks[i]._end;
      }
      xMin = this._snapToScale(xMin, scale);
      xMax = this._addScale(this._snapToScale(xMax, scale), 1, scale);

      const W          = this._el.clientWidth || 700;
      const chartAreaW = W - labelW;
      if (chartAreaW < 60) return;

      const xRange  = xMax - xMin || 1;
      const xScale  = function(ts) { return (ts - xMin) / xRange * chartAreaW; };
      const xInvert = function(px) { return xMin + px / chartAreaW * xRange; };

      // Build columns
      const cols = this._buildCols(xMin, xMax, scale);
      if (!cols.length) return;
      const colW = chartAreaW / cols.length;

      // Build row list
      const rows     = [];
      const seenGrp  = {};
      const taskById = {};
      for (let i = 0; i < tasks.length; i++) {
        taskById[tasks[i].id] = tasks[i];
        if (tasks[i].group && !seenGrp[tasks[i].group]) {
          seenGrp[tasks[i].group] = true;
          rows.push({ type: 'group', label: tasks[i].group });
        }
        rows.push({ type: 'task', task: tasks[i] });
      }

      const chartH = rows.length * rowH;
      const H      = opts.height || (chartH + HEADER_H + 4);

      // ── SVG root ────────────────────────────────────────────────────────────
      const svg = u.svgEl('svg', {
        width: W, height: H,
        'class': 'mts-chart__svg',
        role: 'img', 'aria-label': 'Gantt chart',
        style: 'user-select:none',
      });
      this._svg = svg;

      // Arrow marker defs
      const defs   = u.svgEl('defs');
      const marker = u.svgEl('marker', { id: 'mts-gantt-arrow', markerWidth: 7, markerHeight: 7, refX: 6, refY: 3.5, orient: 'auto' });
      const arrowP = u.svgEl('path', { d: 'M0,0.5 L0,6.5 L7,3.5 Z', fill: 'var(--mts-text-muted,#6b7280)' });
      marker.appendChild(arrowP);
      defs.appendChild(marker);
      svg.appendChild(defs);

      // ── Chart area group (offset below header, after label column) ──────────
      const gChart = u.svgEl('g', { transform: 'translate(' + labelW + ',' + HEADER_H + ')' });
      svg.appendChild(gChart);

      // ── Alternating column backgrounds ──────────────────────────────────────
      for (let ci = 0; ci < cols.length; ci++) {
        const cx = xScale(cols[ci]);
        const cw = ci < cols.length - 1
          ? xScale(cols[ci + 1]) - xScale(cols[ci])
          : xScale(this._addScale(cols[ci], 1, scale)) - xScale(cols[ci]);
        if (ci % 2 === 1) {
          gChart.appendChild(u.svgEl('rect', {
            x: cx.toFixed(1), y: 0,
            width: cw.toFixed(1), height: chartH,
            fill: 'var(--mts-bg-surface-2, rgba(255,255,255,0.03))',
          }));
        }
      }

      // ── Vertical grid lines ─────────────────────────────────────────────────
      for (let ci = 0; ci < cols.length; ci++) {
        const cx = Math.round(xScale(cols[ci]));
        gChart.appendChild(u.svgEl('line', {
          x1: cx, y1: 0, x2: cx, y2: chartH,
          'class': 'mts-chart__grid-line',
        }));
      }

      // ── Header ──────────────────────────────────────────────────────────────
      const gHeader = u.svgEl('g');
      svg.appendChild(gHeader);

      // Header backgrounds
      gHeader.appendChild(u.svgEl('rect', {
        x: 0, y: 0, width: W, height: HEADER_H,
        fill: 'var(--mts-bg-surface-2, rgba(0,0,0,0.3))',
      }));

      // Month row (spans multiple columns)
      let prevM = -1, mStart = 0;

      function flushMonth(endCi) {
        if (prevM < 0) return;
        const mx0 = xScale(cols[mStart]);
        const mx1 = endCi < cols.length
          ? xScale(cols[endCi])
          : xScale(self._addScale(cols[cols.length - 1], 1, scale));
        const mw = mx1 - mx0;
        if (mw < 4) return;
        // Left border
        gHeader.appendChild(u.svgEl('line', {
          x1: (labelW + mx0).toFixed(1), y1: 0,
          x2: (labelW + mx0).toFixed(1), y2: MONTH_HDR_H,
          stroke: 'var(--mts-border-color,#334155)', 'stroke-width': 1,
        }));
        // Month label
        const ml = u.svgEl('text', {
          x: (labelW + mx0 + mw / 2).toFixed(1),
          y: (MONTH_HDR_H / 2).toFixed(1),
          'text-anchor': 'middle', 'dominant-baseline': 'middle',
          'class': 'mts-chart__axis-label',
          style: 'font-size:10px;font-weight:700',
        });
        const d0 = new Date(cols[mStart]);
        ml.textContent = MONTHS[d0.getMonth()] + ' ' + d0.getFullYear();
        gHeader.appendChild(ml);
      }

      for (let ci = 0; ci < cols.length; ci++) {
        const m = new Date(cols[ci]).getMonth();
        if (m !== prevM) { flushMonth(ci); prevM = m; mStart = ci; }
      }
      flushMonth(cols.length);

      // Divider between month row and scale row
      gHeader.appendChild(u.svgEl('line', {
        x1: labelW, y1: MONTH_HDR_H, x2: W, y2: MONTH_HDR_H,
        stroke: 'var(--mts-border-color,#334155)', 'stroke-width': 0.5,
      }));

      // Scale row labels (week numbers / days / months)
      for (let ci = 0; ci < cols.length; ci++) {
        const cx = xScale(cols[ci]);
        const cw = ci < cols.length - 1
          ? xScale(cols[ci + 1]) - cx
          : xScale(this._addScale(cols[ci], 1, scale)) - cx;
        if (cw < 14) continue;
        const sl = u.svgEl('text', {
          x: (labelW + cx + cw / 2).toFixed(1),
          y: (MONTH_HDR_H + SCALE_HDR_H / 2).toFixed(1),
          'text-anchor': 'middle', 'dominant-baseline': 'middle',
          'class': 'mts-chart__axis-label', style: 'font-size:10px',
        });
        const cd = new Date(cols[ci]);
        if (scale === 'week')       sl.textContent = 'W' + self._isoWeek(cols[ci]);
        else if (scale === 'day')   sl.textContent = String(cd.getDate());
        else                        sl.textContent = MONTHS[cd.getMonth()];
        gHeader.appendChild(sl);
      }

      // Header bottom border
      gHeader.appendChild(u.svgEl('line', {
        x1: 0, y1: HEADER_H, x2: W, y2: HEADER_H,
        stroke: 'var(--mts-border-color,#334155)', 'stroke-width': 1,
      }));

      // Label column header cell
      gHeader.appendChild(u.svgEl('rect', {
        x: 0, y: 0, width: labelW, height: HEADER_H,
        fill: 'var(--mts-bg-surface-2, rgba(0,0,0,0.3))',
      }));
      const hlbl = u.svgEl('text', {
        x: 8, y: (HEADER_H / 2).toFixed(1),
        'dominant-baseline': 'middle',
        'class': 'mts-chart__axis-label',
        style: 'font-size:11px;font-weight:700',
      });
      hlbl.textContent = 'Tarea';
      gHeader.appendChild(hlbl);

      // ── Rows ────────────────────────────────────────────────────────────────
      const taskMeta = {}; // id → meta object for drag + dep rendering
      const barTgts  = [];
      let   taskIdx  = 0;

      const gRows = u.svgEl('g');
      gChart.appendChild(gRows);

      for (let ri = 0; ri < rows.length; ri++) {
        const row  = rows[ri];
        const rowY = ri * rowH;

        if (row.type === 'group') {
          // Group header background
          gRows.appendChild(u.svgEl('rect', {
            x: -labelW, y: rowY, width: W, height: rowH,
            fill: 'var(--mts-bg-surface-2, rgba(255,255,255,0.05))',
          }));
          const gl = u.svgEl('text', {
            x: -labelW + 8, y: rowY + rowH / 2,
            'dominant-baseline': 'middle',
            'class': 'mts-chart__axis-label',
            style: 'font-weight:700;font-size:11px',
          });
          gl.textContent = row.label;
          gRows.appendChild(gl);
          continue;
        }

        // ── Task row ──────────────────────────────────────────────────────────
        const task    = row.task;
        const color   = task.color || u.PALETTE[taskIdx % u.PALETTE.length];
        const barPad  = 5;
        const barY    = rowY + barPad;
        const barH2   = rowH - barPad * 2;
        const BAR_MIN = 4;
        const HANDLE  = 8;

        // Row separator
        gRows.appendChild(u.svgEl('line', {
          x1: -labelW, y1: rowY, x2: chartAreaW, y2: rowY,
          stroke: 'var(--mts-border-color,#334155)', 'stroke-width': 0.5, opacity: 0.5,
        }));

        // Task label
        const tl = u.svgEl('text', {
          x: -8, y: rowY + rowH / 2,
          'text-anchor': 'end', 'dominant-baseline': 'middle',
          'class': 'mts-chart__axis-label', style: 'font-size:11px',
        });
        tl.textContent = task.label;
        gRows.appendChild(tl);

        // Bar
        const bx = xScale(task._start);
        const bw = Math.max(BAR_MIN, xScale(task._end) - xScale(task._start));

        const bar = u.svgEl('rect', {
          x: bx.toFixed(1), y: barY,
          width: animate ? 0 : bw.toFixed(1), height: barH2,
          fill: color, rx: 3, opacity: 0.88,
          'class': 'mts-chart__bar',
          style: editable ? 'cursor:grab' : 'cursor:pointer',
        });

        // Inner label
        const ilbl = u.svgEl('text', {
          x: (bx + bw / 2).toFixed(1), y: barY + barH2 / 2,
          'text-anchor': 'middle', 'dominant-baseline': 'middle',
          style: 'font-size:10px;fill:#fff;pointer-events:none;font-family:inherit',
        });
        ilbl.setAttribute('opacity', bw > 50 ? '1' : '0');
        ilbl.textContent = task.label;

        gRows.appendChild(bar);
        gRows.appendChild(ilbl);

        // Resize handles (only if editable)
        let lH = null, rH = null;
        if (editable) {
          lH = u.svgEl('rect', {
            x: bx.toFixed(1), y: barY, width: HANDLE, height: barH2,
            fill: 'rgba(255,255,255,0.0)', style: 'cursor:ew-resize',
          });
          rH = u.svgEl('rect', {
            x: (bx + bw - HANDLE).toFixed(1), y: barY, width: HANDLE, height: barH2,
            fill: 'rgba(255,255,255,0.0)', style: 'cursor:ew-resize',
          });
          gRows.appendChild(lH);
          gRows.appendChild(rH);
        }

        // Tooltip / hover events
        (function(barEl, task, col, ilblEl, lHEl, rHEl) {
          barEl.addEventListener('mouseenter', function(e) {
            self._showTooltip(
              e, task.label,
              '',
              self._fmtFull(task._start) + ' → ' + self._fmtFull(task._end),
              col
            );
            barEl.setAttribute('opacity', '1');
            barEl.style.cursor = editable ? 'grab' : 'pointer';
          });
          barEl.addEventListener('mousemove',  function(e) { self._moveTooltip(e); });
          barEl.addEventListener('mouseleave', function()  {
            self._hideTooltip();
            barEl.setAttribute('opacity', '0.88');
          });
          barEl.addEventListener('click', function() {
            self._emit('click', { id: task.id, label: task.label, start: task.start, end: task.end, color: col });
            if (opts.onClick) opts.onClick({ id: task.id, label: task.label, start: task.start, end: task.end, color: col });
          });
        }(bar, task, color, ilbl, lH, rH));

        if (animate) barTgts.push({ el: bar, toW: bw });

        taskMeta[task.id] = {
          task:    task,
          color:   color,
          barEl:   bar,
          ilbl:    ilbl,
          lH:      lH,
          rH:      rH,
          barY:    barY,
          barH2:   barH2,
          rowY:    rowY,
        };

        taskIdx++;
      }

      // ── Dependency arrows ──────────────────────────────────────────────────
      const gDeps = u.svgEl('g');
      gChart.appendChild(gDeps);
      this._gDeps   = gDeps;
      this._taskMeta = taskMeta;
      this._tasks    = tasks;
      this._xScale   = xScale;
      this._renderDeps();

      // ── Label column separator ─────────────────────────────────────────────
      svg.appendChild(u.svgEl('line', {
        x1: labelW, y1: 0, x2: labelW, y2: H,
        stroke: 'var(--mts-border-color,#334155)', 'stroke-width': 1,
      }));

      this._el.insertBefore(svg, this._tooltipEl);

      // ── Drag & resize ──────────────────────────────────────────────────────
      if (editable) {
        this._setupDrag(svg, tasks, taskMeta, xScale, xInvert, xMin, xMax, chartAreaW, labelW, HEADER_H, scale, opts);
      }

      // ── Entry animation ────────────────────────────────────────────────────
      if (animate && barTgts.length) {
        const duration = opts.animateDuration || 600;
        const t0 = performance.now();
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          for (let i = 0; i < barTgts.length; i++) {
            barTgts[i].el.setAttribute('width', (barTgts[i].toW * ease).toFixed(1));
          }
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            for (let i = 0; i < barTgts.length; i++) {
              barTgts[i].el.setAttribute('width', barTgts[i].toW.toFixed(1));
            }
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }

    // ── Render dependency arrows ───────────────────────────────────────────────
    _renderDeps() {
      const gDeps    = this._gDeps;
      const taskMeta = this._taskMeta;
      const tasks    = this._tasks;
      const xScale   = this._xScale;
      while (gDeps.firstChild) gDeps.removeChild(gDeps.firstChild);

      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (!task.deps || !task.deps.length) continue;
        const tgt = taskMeta[task.id];
        if (!tgt) continue;

        for (let di = 0; di < task.deps.length; di++) {
          const src = taskMeta[task.deps[di]];
          if (!src) continue;

          // Source: right edge center of predecessor bar
          const sx = parseFloat(src.barEl.getAttribute('x')) + parseFloat(src.barEl.getAttribute('width'));
          const sy = src.barY + src.barH2 / 2;

          // Target: left edge center of task bar
          const tx = parseFloat(tgt.barEl.getAttribute('x'));
          const ty = tgt.barY + tgt.barH2 / 2;

          const gap  = tx - sx;
          const cp1x = sx + Math.max(16, gap * 0.4);
          const cp2x = tx - Math.max(16, gap * 0.4);

          const d = 'M ' + sx.toFixed(1) + ' ' + sy.toFixed(1) +
            ' C ' + cp1x.toFixed(1) + ' ' + sy.toFixed(1) +
            ' '   + cp2x.toFixed(1) + ' ' + ty.toFixed(1) +
            ' '   + tx.toFixed(1)   + ' ' + ty.toFixed(1);

          gDeps.appendChild(u.svgEl('path', {
            d: d,
            fill: 'none',
            stroke: 'var(--mts-text-muted,#6b7280)',
            'stroke-width': 1.5,
            'stroke-dasharray': '4 3',
            opacity: 0.75,
            'marker-end': 'url(#mts-gantt-arrow)',
          }));
        }
      }
    }

    // ── Drag & resize setup ───────────────────────────────────────────────────
    _setupDrag(svg, tasks, taskMeta, xScale, xInvert, xMin, xMax, chartAreaW, labelW, headerH, scale, opts) {
      const self     = this;
      let   ds       = null; // drag state

      function pxToTs(px) { return xInvert(px); }

      function svgX(e) {
        return e.clientX - svg.getBoundingClientRect().left - labelW;
      }

      function updateBarEl(meta) {
        const task = meta.task;
        const bx   = xScale(task._start);
        const bw   = Math.max(4, xScale(task._end) - xScale(task._start));
        meta.barEl.setAttribute('x',     bx.toFixed(1));
        meta.barEl.setAttribute('width', bw.toFixed(1));
        meta.ilbl.setAttribute('x',  (bx + bw / 2).toFixed(1));
        meta.ilbl.setAttribute('opacity', bw > 50 ? '1' : '0');
        if (meta.lH) {
          meta.lH.setAttribute('x', bx.toFixed(1));
          meta.rH.setAttribute('x', (bx + bw - 8).toFixed(1));
        }
        self._renderDeps();
      }

      function onMouseDown(e) {
        if (e.button !== 0) return;
        const el  = e.target;
        const ids = Object.keys(taskMeta);
        let   meta = null, type = null;
        for (let i = 0; i < ids.length; i++) {
          const m = taskMeta[ids[i]];
          if (el === m.lH)    { type = 'resize-left';  meta = m; break; }
          if (el === m.rH)    { type = 'resize-right'; meta = m; break; }
          if (el === m.barEl) { type = 'move';         meta = m; break; }
        }
        if (!meta) return;
        e.preventDefault();
        self._hideTooltip();
        if (type === 'move') meta.barEl.style.cursor = 'grabbing';
        ds = {
          type:       type,
          meta:       meta,
          startPx:    svgX(e),
          origStart:  meta.task._start,
          origEnd:    meta.task._end,
        };
      }

      function onMouseMove(e) {
        if (!ds) return;
        e.preventDefault();
        const dx   = svgX(e) - ds.startPx;
        const dt   = dx / chartAreaW * (xMax - xMin);
        const task = ds.meta.task;
        const minD = self._minScaleMs(scale);

        if (ds.type === 'move') {
          let ns = self._snapToScale(ds.origStart + dt, scale);
          const dur = ds.origEnd - ds.origStart;
          if (ns < xMin) ns = xMin;
          if (ns + dur > xMax) ns = xMax - dur;
          task._start = ns;
          task._end   = ns + dur;
        } else if (ds.type === 'resize-right') {
          let ne = self._snapToScale(ds.origEnd + dt, scale);
          if (ne > xMax) ne = xMax;
          if (ne < task._start + minD) ne = self._addScale(task._start, 1, scale);
          task._end = ne;
        } else {
          let ns = self._snapToScale(ds.origStart + dt, scale);
          if (ns < xMin) ns = xMin;
          if (ns > task._end - minD) ns = self._addScale(task._end, -1, scale);
          task._start = ns;
        }
        updateBarEl(ds.meta);
      }

      function onMouseUp() {
        if (!ds) return;
        const meta = ds.meta;
        const task = meta.task;

        // Write back to source object
        task.start    = self._tsToStr(task._start);
        task.end      = self._tsToStr(task._end);
        task._src.start = task.start;
        task._src.end   = task.end;

        if (ds.type === 'move') {
          meta.barEl.style.cursor = 'grab';
          const payload = { id: task.id, label: task.label, start: task.start, end: task.end };
          self._emit('taskMove', payload);
          if (opts.onTaskMove) opts.onTaskMove(payload);
        } else {
          const payload = { id: task.id, label: task.label, start: task.start, end: task.end };
          self._emit('taskResize', payload);
          if (opts.onTaskResize) opts.onTaskResize(payload);
        }
        ds = null;
      }

      svg.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup',   onMouseUp);

      this._dragCleanup = function() {
        svg.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup',   onMouseUp);
      };
    }
  }

  global.MTS.ChartCandlestick = MtsChartCandlestick;
  global.MTS.ChartGantt       = MtsChartGantt;

}(typeof window !== 'undefined' ? window : this));
