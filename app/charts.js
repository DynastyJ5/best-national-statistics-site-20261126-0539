// DataNusa charts: small SVG chart builders with no dependencies.
// Every chart is drawn from the data it is given and labelled with its
// units, so a screenshot alone still reads as a chart.

const NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function textEl(x, y, str, attrs = {}) {
  const t = svgEl('text', { x, y, ...attrs });
  t.textContent = str;
  return t;
}

function niceMax(v) {
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p;
}

// Vertical bar chart. series: [{year|label, value}], opts: {unit, color, height}
export function barChart(series, opts = {}) {
  const W = 720, H = opts.height ?? 300, padL = 52, padR = 12, padT = 18, padB = 34;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': opts.label ?? 'Bar chart' });
  const max = niceMax(Math.max(...series.map((d) => d.value)) * 1.08);
  const iw = W - padL - padR, ih = H - padT - padB;
  const bw = Math.min(46, (iw / series.length) * 0.62);
  // gridlines
  for (let g = 0; g <= 4; g++) {
    const v = (max * g) / 4;
    const y = padT + ih - (ih * v) / max;
    svg.appendChild(svgEl('line', { x1: padL, y1: y, x2: W - padR, y2: y, stroke: '#e3ddd0', 'stroke-width': 1 }));
    svg.appendChild(textEl(padL - 8, y + 4, fmtNum(v), { 'text-anchor': 'end', 'font-size': 11, fill: '#6b6455' }));
  }
  series.forEach((d, i) => {
    const cx = padL + (iw * (i + 0.5)) / series.length;
    const h = (ih * d.value) / max;
    const bar = svgEl('rect', {
      x: cx - bw / 2, y: padT + ih - h, width: bw, height: h, rx: 3,
      fill: d.highlight ? '#e8a33d' : (opts.color ?? '#0f766e'),
    });
    svg.appendChild(bar);
    svg.appendChild(textEl(cx, padT + ih - h - 6, fmtNum(d.value), { 'text-anchor': 'middle', 'font-size': 11, fill: '#22303a', 'font-weight': 600 }));
    svg.appendChild(textEl(cx, H - 12, String(d.year ?? d.label), { 'text-anchor': 'middle', 'font-size': 11, fill: '#6b6455' }));
  });
  svg.appendChild(svgEl('line', { x1: padL, y1: padT + ih, x2: W - padR, y2: padT + ih, stroke: '#c9c2b2', 'stroke-width': 1 }));
  return svg;
}

// Line chart with points. series: [{year, value}], opts: {unit, color, min}
export function lineChart(series, opts = {}) {
  const W = 720, H = opts.height ?? 300, padL = 52, padR = 16, padT = 22, padB = 34;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': opts.label ?? 'Line chart' });
  const vals = series.map((d) => d.value);
  const lo = opts.min ?? Math.min(0, ...vals);
  const hi = Math.max(...vals);
  const max = niceMax(hi * 1.05);
  const min = lo < 0 ? -niceMax(Math.abs(lo) * 1.1) : 0;
  const iw = W - padL - padR, ih = H - padT - padB;
  const x = (i) => padL + (iw * i) / (series.length - 1);
  const y = (v) => padT + ih - ((ih * (v - min)) / (max - min));
  for (let g = 0; g <= 4; g++) {
    const v = min + ((max - min) * g) / 4;
    svg.appendChild(svgEl('line', { x1: padL, y1: y(v), x2: W - padR, y2: y(v), stroke: '#e3ddd0', 'stroke-width': 1 }));
    svg.appendChild(textEl(padL - 8, y(v) + 4, fmtNum(v), { 'text-anchor': 'end', 'font-size': 11, fill: '#6b6455' }));
  }
  if (min < 0) {
    svg.appendChild(svgEl('line', { x1: padL, y1: y(0), x2: W - padR, y2: y(0), stroke: '#b0483e', 'stroke-width': 1, 'stroke-dasharray': '4 3' }));
  }
  const pts = series.map((d, i) => `${x(i)},${y(d.value)}`).join(' ');
  svg.appendChild(svgEl('polyline', { points: pts, fill: 'none', stroke: opts.color ?? '#0f766e', 'stroke-width': 2.5, 'stroke-linejoin': 'round' }));
  series.forEach((d, i) => {
    svg.appendChild(svgEl('circle', { cx: x(i), cy: y(d.value), r: 4, fill: '#fff', stroke: opts.color ?? '#0f766e', 'stroke-width': 2 }));
    if (i % 2 === 0 || i === series.length - 1) {
      svg.appendChild(textEl(x(i), y(d.value) - 10, fmtNum(d.value), { 'text-anchor': 'middle', 'font-size': 11, fill: '#22303a', 'font-weight': 600 }));
    }
    svg.appendChild(textEl(x(i), H - 12, String(d.year), { 'text-anchor': 'middle', 'font-size': 11, fill: '#6b6455' }));
  });
  return svg;
}

// Horizontal bars for shares. items: [{sector|label, share|value}]
export function hbarChart(items, opts = {}) {
  const rowH = 34, padL = 8, padT = 8;
  const W = 720, H = padT + items.length * rowH + 8;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': opts.label ?? 'Horizontal bar chart' });
  const max = Math.max(...items.map((d) => d.share ?? d.value));
  const labelW = opts.labelWidth ?? 210;
  const barX = padL + labelW + 10, barW = W - barX - 64;
  items.forEach((d, i) => {
    const y = padT + i * rowH;
    const v = d.share ?? d.value;
    svg.appendChild(textEl(padL, y + 19, d.sector ?? d.label, { 'font-size': 12.5, fill: '#22303a' }));
    svg.appendChild(svgEl('rect', { x: barX, y: y + 6, width: barW, height: 16, rx: 3, fill: '#efe9db' }));
    svg.appendChild(svgEl('rect', {
      x: barX, y: y + 6, width: Math.max(2, (barW * v) / max), height: 16, rx: 3,
      fill: i === 0 ? '#e8a33d' : (opts.color ?? '#0f766e'),
    }));
    svg.appendChild(textEl(barX + barW + 8, y + 19, `${fmtNum(v)}${opts.suffix ?? '%'}`, { 'font-size': 12, fill: '#22303a', 'font-weight': 600 }));
  });
  return svg;
}

// Donut chart. items: [{group|label, share|value}]
export function donutChart(items, opts = {}) {
  const S = 300, cx = S / 2, cy = S / 2, r = 105, inner = 66;
  const svg = svgEl('svg', { viewBox: `0 0 ${S} ${S}`, role: 'img', 'aria-label': opts.label ?? 'Donut chart' });
  const colors = ['#0f766e', '#e8a33d', '#3d6b8e', '#b0483e', '#7a9e4f', '#8a6fb8'];
  const total = items.reduce((a, d) => a + (d.share ?? d.value), 0);
  let a0 = -Math.PI / 2;
  items.forEach((d, i) => {
    const v = d.share ?? d.value;
    const a1 = a0 + (2 * Math.PI * v) / total;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    const path = `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${inner} ${inner} 0 ${large} 0 ${xi0} ${yi0} Z`;
    svg.appendChild(svgEl('path', { d: path, fill: colors[i % colors.length] }));
    a0 = a1;
  });
  const c = textEl(cx, cy - 4, opts.center ?? `${fmtNum(total)}%`, { 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 700, fill: '#22303a' });
  svg.appendChild(c);
  svg.appendChild(textEl(cx, cy + 20, opts.centerSub ?? 'of population', { 'text-anchor': 'middle', 'font-size': 12, fill: '#6b6455' }));
  return svg;
}

function fmtNum(v) {
  if (Math.abs(v) >= 100) return String(Math.round(v));
  if (Number.isInteger(v)) return String(v);
  return v.toFixed(v % 1 === 0 ? 0 : v < 10 && Math.abs(v - Math.round(v * 10) / 10) < 1e-9 ? 1 : 2).replace(/\.0$/, '');
}
