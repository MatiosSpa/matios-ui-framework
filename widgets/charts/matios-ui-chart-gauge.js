/**
 * MTS.ChartGaugeLinear / MTS.ChartGaugeRadial (v2.1.0)
 * SVG puro · 0 dependencias · XSS-safe
 *
 * Dep: matios-ui-chart.js (debe cargarse antes)
 *
 * Exporta:
 *   MTS.ChartGaugeLinear — barra de progreso con thresholds y zonas de color
 *   MTS.ChartGaugeRadial — arco SVG 180°/270° con aguja fill y thresholds
 *
 * Opciones comunes:
 *   value       {number}    — valor actual (requerido)
 *   min         {number}    — Default: 0
 *   max         {number}    — Default: 100
 *   thresholds  {Array}     — [{ value, color }, ...] zonas de color
 *   formatter   {Function}  — formatea el valor. Default: u.defaultFmt
 *   animate     {boolean}   — Default: true
 *
 * GaugeLinear adicional:
 *   trackHeight {number}    — altura de la barra en px. Default: 12
 *   showLabel   {boolean}   — mostrar valor bajo la barra. Default: true
 *   showTicks   {boolean}   — mostrar marcas de threshold. Default: true
 *
 * GaugeRadial adicional:
 *   angle       {number}    — 180 o 270. Default: 180
 *   trackWidth  {number}    — grosor del arco en px. Default: 16
 *   centerText  {string}    — texto central. Default: valor formateado
 *   centerSubText {string}  — subtítulo central
 *   showTicks   {boolean}   — marcas en los thresholds. Default: true
 */
(function (global) {
  'use strict';

  if (!global.MTS || !global.MTS.Chart) {
    throw new Error('matios-ui-chart-gauge.js: MTS.Chart no encontrado. Incluir matios-ui-chart.js primero.');
  }

  const MtsChart = global.MTS.Chart;
  const u        = MtsChart._utils;

  function _arcPath(cx, cy, r, startDeg, sweepDeg) {
    const s      = startDeg * Math.PI / 180;
    const e      = (startDeg + sweepDeg) * Math.PI / 180;
    const sx     = cx + r * Math.cos(s);
    const sy     = cy + r * Math.sin(s);
    const ex     = cx + r * Math.cos(e);
    const ey     = cy + r * Math.sin(e);
    const large  = sweepDeg > 180 ? 1 : 0;
    return 'M' + sx.toFixed(3) + ',' + sy.toFixed(3)
         + ' A' + r + ',' + r + ' 0 ' + large + ',1 '
         + ex.toFixed(3) + ',' + ey.toFixed(3);
  }

  // ── MtsChartGaugeLinear ──────────────────────────────────────────────────────

  class MtsChartGaugeLinear extends MtsChart {
    get _type() { return 'gauge-linear'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)     { this._svg.remove(); this._svg = null; }

      const opts        = this._cfg.options || {};
      const value       = opts.value       != null ? opts.value       : 0;
      const minVal      = opts.min         != null ? opts.min         : 0;
      const maxVal      = opts.max         != null ? opts.max         : 100;
      const thresholds  = opts.thresholds  || [];
      const trackH      = opts.trackHeight != null ? opts.trackHeight : 12;
      const showLabel   = opts.showLabel   !== false;
      const showTicks   = opts.showTicks   !== false;
      const fmt         = opts.formatter   || u.defaultFmt;
      const animate     = opts.animate     !== false;
      const defColor    = opts.color       || u.PALETTE[0];

      const W      = this._el.clientWidth || 300;
      const padL   = 8, padR = 8, padT = 8, padB = 8;
      const labelH = showLabel ? 26 : 0;
      const H      = opts.height || (padT + trackH + labelH + padB);
      const chartW = W - padL - padR;
      const trackY = padT;
      const range  = (maxVal - minVal) || 1;
      const pct    = Math.max(0, Math.min(1, (value - minVal) / range));
      const valueX = pct * chartW;
      const rx     = trackH / 2;

      // Color del fill según threshold
      let fillColor = defColor;
      if (thresholds.length > 0) {
        for (let i = 0; i < thresholds.length; i++) {
          fillColor = thresholds[i].color;
          if (value <= thresholds[i].value) break;
        }
      }

      const svg = u.svgEl('svg', { width: W, height: H, 'class': 'mts-chart__svg' });
      this._svg = svg;
      const g   = u.svgEl('g', { transform: 'translate(' + padL + ',0)' });
      svg.appendChild(g);

      // Track fondo
      g.appendChild(u.svgEl('rect', {
        x: 0, y: trackY, width: chartW, height: trackH, rx: rx,
        'class': 'mts-chart__gauge-track',
      }));

      // ClipPath — anima el área visible del fill
      const clipId = 'gc' + (Math.random() * 1e8 | 0).toString(36);
      const defs   = u.svgEl('defs');
      const clip   = u.svgEl('clipPath', { id: clipId });
      const clipR  = u.svgEl('rect', { x: 0, y: trackY - 1, width: animate ? 0 : valueX, height: trackH + 2 });
      clip.appendChild(clipR);
      defs.appendChild(clip);
      svg.appendChild(defs);

      const fillG = u.svgEl('g', { 'clip-path': 'url(#' + clipId + ')' });

      if (thresholds.length > 0) {
        let prevPct = 0;
        for (let i = 0; i < thresholds.length; i++) {
          const zPct  = Math.min(1, (thresholds[i].value - minVal) / range);
          const x1    = prevPct * chartW;
          const x2    = zPct * chartW;
          const lrx   = prevPct === 0 ? rx : 0;
          const rrx   = zPct >= 1 ? rx : 0;
          if (x2 > x1) {
            fillG.appendChild(u.svgEl('rect', {
              x: x1, y: trackY, width: x2 - x1, height: trackH,
              rx: lrx, fill: thresholds[i].color, 'class': 'mts-chart__gauge-fill',
            }));
            // Parchar esquina derecha si no es el último zone
            if (rrx === 0 && x2 < chartW) {
              fillG.appendChild(u.svgEl('rect', {
                x: x2 - rx, y: trackY, width: rx, height: trackH,
                rx: 0, fill: thresholds[i].color,
              }));
            }
          }
          prevPct = zPct;
          if (prevPct >= 1) break;
        }
      } else {
        fillG.appendChild(u.svgEl('rect', {
          x: 0, y: trackY, width: chartW, height: trackH,
          rx: rx, fill: fillColor, 'class': 'mts-chart__gauge-fill',
        }));
      }
      g.appendChild(fillG);

      // Marcas de threshold
      if (showTicks && thresholds.length > 1) {
        for (let i = 0; i < thresholds.length - 1; i++) {
          const tx = Math.round(((thresholds[i].value - minVal) / range) * chartW);
          g.appendChild(u.svgEl('rect', {
            x: tx - 1, y: trackY, width: 2, height: trackH,
            fill: 'var(--mts-bg-base, #0f172a)',
          }));
        }
      }

      // Label valor
      if (showLabel) {
        const lbl = u.svgEl('text', {
          x: Math.max(rx, Math.min(valueX, chartW - rx)), y: trackY + trackH + 16,
          'class': 'mts-chart__gauge-label',
        });
        lbl.textContent = fmt(value);
        g.appendChild(lbl);
      }

      this._el.insertBefore(svg, this._tooltipEl);
      svg.style.cursor = 'pointer';
      svg.addEventListener('click', function () { self._emit('click', { value: value, min: minVal, max: maxVal, color: fillColor }); });

      if (animate && valueX > 0) {
        const duration = opts.animateDuration || 600;
        const t0       = performance.now();
        const self     = this;
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          clipR.setAttribute('width', valueX * ease);
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            clipR.setAttribute('width', valueX);
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  // ── MtsChartGaugeRadial ──────────────────────────────────────────────────────

  class MtsChartGaugeRadial extends MtsChart {
    get _type() { return 'gauge-radial'; }

    _render() {
      if (this._animReq) { cancelAnimationFrame(this._animReq); this._animReq = null; }
      if (this._svg)     { this._svg.remove(); this._svg = null; }

      const opts       = this._cfg.options || {};
      const value      = opts.value      != null ? opts.value      : 0;
      const minVal     = opts.min        != null ? opts.min        : 0;
      const maxVal     = opts.max        != null ? opts.max        : 100;
      const angle      = opts.angle      === 270 ? 270 : 180;
      const thresholds = opts.thresholds || [];
      const trackW     = opts.trackWidth != null ? opts.trackWidth : 16;
      const showTicks  = opts.showTicks  !== false;
      const fmt        = opts.formatter  || u.defaultFmt;
      const animate    = opts.animate    !== false;
      const defColor   = opts.color      || u.PALETTE[0];

      const range    = (maxVal - minVal) || 1;
      const valuePct = Math.max(0, Math.min(1, (value - minVal) / range));

      const W    = this._el.clientWidth || 300;
      const padH = 12;
      const padT = 12;
      const padB = 12;
      const cx   = W / 2;
      const r    = W / 2 - padH - trackW / 2;

      if (r < 10) return;

      const startAngle = angle === 270 ? 135 : 180;
      const sweepAngle = angle;

      let cy, H;
      if (angle === 270) {
        cy = padT + r + trackW / 2;
        H  = opts.height || Math.round(cy + r * 0.707 + trackW / 2 + 52 + padB);
      } else {
        cy = padT + r + trackW / 2;
        H  = opts.height || Math.round(cy + trackW / 2 + 52 + padB);
      }

      // Color fill desde thresholds
      let fillColor = defColor;
      if (thresholds.length > 0) {
        for (let i = 0; i < thresholds.length; i++) {
          fillColor = thresholds[i].color;
          if (value <= thresholds[i].value) break;
        }
      }

      const svg = u.svgEl('svg', { width: W, height: H, 'class': 'mts-chart__svg' });
      this._svg = svg;

      // Arco de fondo (track completo)
      svg.appendChild(u.svgEl('path', {
        d:             _arcPath(cx, cy, r, startAngle, sweepAngle),
        'stroke-width': trackW,
        'class':        'mts-chart__gauge-arc-track',
      }));

      // Arco de valor
      const valueSweep  = valuePct * sweepAngle;
      let   valueArcEl  = null;
      if (valuePct > 0.001) {
        valueArcEl = u.svgEl('path', {
          d:             _arcPath(cx, cy, r, startAngle, valueSweep),
          stroke:        fillColor,
          'stroke-width': trackW,
          'class':        'mts-chart__gauge-arc-fill',
        });
        svg.appendChild(valueArcEl);
      }

      // Marcas de threshold
      if (showTicks && thresholds.length > 1) {
        for (let i = 0; i < thresholds.length - 1; i++) {
          const tPct  = (thresholds[i].value - minVal) / range;
          const tRad  = (startAngle + tPct * sweepAngle) * Math.PI / 180;
          const inner = r - trackW / 2;
          const outer = r + trackW / 2;
          svg.appendChild(u.svgEl('line', {
            x1: (cx + inner * Math.cos(tRad)).toFixed(2),
            y1: (cy + inner * Math.sin(tRad)).toFixed(2),
            x2: (cx + outer * Math.cos(tRad)).toFixed(2),
            y2: (cy + outer * Math.sin(tRad)).toFixed(2),
            'class': 'mts-chart__gauge-arc-tick',
          }));
        }
      }

      // Texto central
      const showCenter = opts.centerText !== false;
      if (showCenter) {
        const textY = angle === 270 ? cy : cy + 22;
        const subY  = textY + 22;

        const bigLbl = u.svgEl('text', { x: cx, y: textY, 'class': 'mts-chart__gauge-center-text' });
        bigLbl.textContent = opts.centerText != null ? opts.centerText : fmt(value);
        svg.appendChild(bigLbl);

        if (opts.centerSubText) {
          const sub = u.svgEl('text', { x: cx, y: subY, 'class': 'mts-chart__gauge-center-sub' });
          sub.textContent = opts.centerSubText;
          svg.appendChild(sub);
        }
      }

      this._el.insertBefore(svg, this._tooltipEl);
      svg.style.cursor = 'pointer';
      svg.addEventListener('click', function () { self._emit('click', { value: value, min: minVal, max: maxVal, color: fillColor }); });

      // Animación: stroke-dashoffset
      if (animate && valueArcEl && valuePct > 0.001) {
        const arcLen = valueSweep * Math.PI / 180 * r;
        valueArcEl.setAttribute('stroke-dasharray',  arcLen);
        valueArcEl.setAttribute('stroke-dashoffset', arcLen);
        const duration = opts.animateDuration || 700;
        const t0       = performance.now();
        const self     = this;
        function step(now) {
          if (!self._svg || !self._svg.isConnected) { self._animReq = null; return; }
          const t    = Math.min((now - t0) / duration, 1);
          const ease = u.easeOut(t);
          valueArcEl.setAttribute('stroke-dashoffset', arcLen * (1 - ease));
          if (t < 1) {
            self._animReq = requestAnimationFrame(step);
          } else {
            self._animReq = null;
            valueArcEl.removeAttribute('stroke-dasharray');
            valueArcEl.removeAttribute('stroke-dashoffset');
          }
        }
        this._animReq = requestAnimationFrame(step);
      }
    }
  }

  global.MTS.ChartGaugeLinear = MtsChartGaugeLinear;
  global.MTS.ChartGaugeRadial = MtsChartGaugeRadial;

}(typeof window !== 'undefined' ? window : this));
