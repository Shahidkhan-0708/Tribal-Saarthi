import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const baseOutDir = path.resolve('docs/ui-mockups');
const scholarDir = path.join(baseOutDir, '01-scholar-portal');
const officerDir = path.join(baseOutDir, '02-officer-portal');
const systemDir = path.join(baseOutDir, '03-system-auth');
const designPlansDir = path.resolve('design-plans');

[scholarDir, officerDir, systemDir, designPlansDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// -------------------------------------------------------------
// High-Precision Lucide Vector Icons Library
// Standard 24x24 viewBox, stroke-width 2, rounded caps/joins
// -------------------------------------------------------------
const I = {
  home: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </g>`,
  book: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </g>`,
  apps: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </g>`,
  doc: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </g>`,
  docCheck: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="m9 15 2 2 4-4"/>
    </g>`,
  help: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </g>`,
  user: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="7" r="4"/>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    </g>`,
  users: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </g>`,
  sync: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </g>`,
  shield: (x, y, color = '#10B981', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </g>`,
  bell: (x, y, color = '#64748B', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </g>`,
  search: (x, y, color = '#64748B', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </g>`,
  check: (x, y, color = '#10B981', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </g>`,
  checkCircle: (x, y, color = '#10B981', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="9 12 11 14 15 10"/>
    </g>`,
  alert: (x, y, color = '#F59E0B', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </g>`,
  download: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </g>`,
  upload: (x, y, color = '#047857', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </g>`,
  clock: (x, y, color = '#64748B', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </g>`,
  arrowRight: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </g>`,
  chevronRight: (x, y, color = '#64748B', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </g>`,
  eye: (x, y, color = '#047857', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </g>`,
  chart: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </g>`,
  sliders: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
      <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
      <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>
    </g>`,
  lock: (x, y, color = '#10B981', size = 14) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </g>`,
  key: (x, y, color = '#FFFFFF', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="7.5" cy="15.5" r="5.5"/>
      <path d="m21 2-9.6 9.6"/>
      <path d="m15.5 7.5 3 3L22 7l-3-3"/>
    </g>`,
  send: (x, y, color = '#047857', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </g>`,
  mic: (x, y, color = '#64748B', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
      <line x1="12" y1="19" x2="12" y2="22"/>
    </g>`,
  filter: (x, y, color = '#64748B', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </g>`,
  x: (x, y, color = '#64748B', size = 18) => `
    <g transform="translate(${x}, ${y}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </g>`,
};

// -------------------------------------------------------------
// Component Library: Recharts / Tremor / Lucide Data Components
// -------------------------------------------------------------
function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad)
  };
}

function makeDonutArc(cx, cy, rOut, rIn, startAngle, endAngle) {
  const sweep = Math.max(0.1, Math.min(359.9, endAngle - startAngle));
  const p1Out = polarToCartesian(cx, cy, rOut, startAngle + sweep);
  const p2Out = polarToCartesian(cx, cy, rOut, startAngle);
  const p1In = polarToCartesian(cx, cy, rIn, startAngle + sweep);
  const p2In = polarToCartesian(cx, cy, rIn, startAngle);
  const largeArc = sweep <= 180 ? 0 : 1;

  return [
    'M', p2Out.x.toFixed(2), p2Out.y.toFixed(2),
    'A', rOut, rOut, 0, largeArc, 1, p1Out.x.toFixed(2), p1Out.y.toFixed(2),
    'L', p1In.x.toFixed(2), p1In.y.toFixed(2),
    'A', rIn, rIn, 0, largeArc, 0, p2In.x.toFixed(2), p2In.y.toFixed(2),
    'Z'
  ].join(' ');
}

function renderDonutChartComponent({
  cx, cy, rOut = 54, rIn = 36, segments, centerValue = '', centerSub = '', legendX, legendY, legendWidth = 160, legendCols = 1, itemHeight = 22
}) {
  let cur = 0;
  const paths = segments.map((s) => {
    const sweep = (s.percent / 100) * 359.9;
    const arc = makeDonutArc(cx, cy, rOut, rIn, cur, cur + sweep);
    cur += sweep;
    return `<path d="${arc}" fill="${s.color}" stroke="#FFFFFF" stroke-width="2" />`;
  }).join('\n');

  const centerText = `
    <text x="${cx}" y="${cy - (centerSub ? 2 : -5)}" font-size="14" font-weight="900" fill="#0F172A" text-anchor="middle" class="stat-anchor">${centerValue}</text>
    ${centerSub ? `<text x="${cx}" y="${cy + 13}" font-size="8.5" font-weight="700" fill="#64748B" text-anchor="middle">${centerSub}</text>` : ''}
  `;

  let legends = '';
  if (legendX !== undefined && legendY !== undefined) {
    legends = `<g transform="translate(${legendX}, ${legendY})">
      ${segments.map((s, idx) => {
        const row = Math.floor(idx / legendCols);
        const col = idx % legendCols;
        const lx = col * legendWidth;
        const ly = row * itemHeight;
        return `
          <g transform="translate(${lx}, ${ly})">
            <rect x="0" y="2" width="9" height="9" rx="2.5" fill="${s.color}" />
            <text x="14" y="10" font-size="10.5" font-weight="600" fill="#334155">${s.label}</text>
            <text x="${legendWidth - 4}" y="10" font-size="10.5" font-weight="800" fill="${s.color}" text-anchor="end">${s.percent}%${s.amount ? ` · ${s.amount}` : ''}</text>
          </g>
        `;
      }).join('\n')}
    </g>`;
  }

  return `
    <g class="donut-chart-component">
      ${paths}
      ${centerText}
      ${legends}
    </g>
  `;
}

function renderStepperPipelineComponent({ x, y, width, steps }) {
  const stepCount = steps.length;
  const stepSpacing = (width - 40) / (stepCount - 1);

  return `
    <g transform="translate(${x}, ${y})" class="pipeline-diagram-component">
      <line x1="20" y1="14" x2="${width - 20}" y2="14" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round" />
      ${steps.map((st, i) => {
        const sx = 20 + i * stepSpacing;
        const isDone = st.status === 'done';
        const isActive = st.status === 'active';
        
        let nodeIcon = '';
        if (isDone) {
          nodeIcon = `
            <circle cx="${sx}" cy="14" r="12" fill="#047857" />
            ${I.check(sx - 6, 8, '#FFFFFF', 12)}
          `;
        } else if (isActive) {
          nodeIcon = `
            <circle cx="${sx}" cy="14" r="14" fill="url(#amberGrad)" />
            <circle cx="${sx}" cy="14" r="18" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="3 3" />
            <circle cx="${sx}" cy="14" r="4.5" fill="#FFFFFF" />
          `;
        } else {
          nodeIcon = `
            <circle cx="${sx}" cy="14" r="11" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5" />
            <text x="${sx}" y="18" font-size="9.5" font-weight="700" fill="#64748B" text-anchor="middle">${i + 1}</text>
          `;
        }

        const textColor = isDone ? '#047857' : (isActive ? '#B45309' : '#64748B');
        const textWeight = isActive ? '800' : '700';

        return `
          <g>
            ${nodeIcon}
            <text x="${sx}" y="36" font-size="10" font-weight="${textWeight}" fill="${textColor}" text-anchor="middle">${st.title}</text>
            ${st.sub ? `<text x="${sx}" y="${st.badge ? 47 : 49}" font-size="8.5" font-weight="500" fill="#64748B" text-anchor="middle">${st.sub}</text>` : ''}
            ${st.badge ? `
              <rect x="${sx - 32}" y="52" width="64" height="15" rx="7.5" fill="${isActive ? '#FEF3C7' : (isDone ? '#ECFDF5' : '#F1F5F9')}" />
              <text x="${sx}" y="63" font-size="7.5" font-weight="800" fill="${textColor}" text-anchor="middle">${st.badge}</text>
            ` : ''}
          </g>
        `;
      }).join('\n')}
    </g>
  `;
}

function renderMerkleChainComponent({ x, y, width, blocks }) {
  const blockWidth = (width - (blocks.length - 1) * 36) / blocks.length;
  return `
    <g transform="translate(${x}, ${y})" class="merkle-chain-component">
      ${blocks.map((b, i) => {
        const bx = i * (blockWidth + 36);
        const arrow = i < blocks.length - 1 ? `
          <g transform="translate(${bx + blockWidth}, 26)">
            <line x1="6" y1="0" x2="30" y2="0" stroke="#047857" stroke-width="2" stroke-dasharray="3 2" />
            <polygon points="30,0 24,-4 24,4" fill="#047857" />
            <text x="18" y="-6" font-size="7.5" font-weight="700" fill="#047857" text-anchor="middle" class="mono">SHA-256</text>
          </g>
        ` : '';

        return `
          <g transform="translate(${bx}, 0)">
            <rect width="${blockWidth}" height="58" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.2" />
            <rect width="${blockWidth}" height="4" rx="2" fill="${b.color || '#047857'}" />
            <text x="10" y="16" font-size="9.5" font-weight="800" fill="#64748B" class="mono">BLOCK #${b.id}</text>
            <text x="10" y="30" font-size="10" font-weight="700" fill="#0F172A">${b.action}</text>
            <text x="10" y="46" font-size="8.5" font-weight="600" fill="#047857" class="mono">${b.hash}</text>
            <circle cx="${blockWidth - 14}" cy="16" r="6" fill="#ECFDF5" />
            ${I.check(blockWidth - 18, 12, '#047857', 8)}
            ${arrow}
          </g>
        `;
      }).join('\n')}
    </g>
  `;
}


// -------------------------------------------------------------
// Defs, Gradients, Shadows & Fonts
// -------------------------------------------------------------
function makeDefs() {
  return `
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&amp;family=JetBrains+Mono:wght@500;600;700&amp;display=swap');
      * { 
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; 
        text-rendering: geometricPrecision; 
        -webkit-font-smoothing: antialiased; 
        -moz-osx-font-smoothing: grayscale;
      }
      .mono { 
        font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; 
        font-feature-settings: "tnum" 1; 
      }
      .title { font-weight: 800; font-size: 20px; fill: #0F172A; letter-spacing: -0.02em; }
      .subtitle { font-weight: 500; font-size: 13px; fill: #64748B; }
      .badge { font-weight: 800; font-size: 10px; text-anchor: middle; letter-spacing: 0.05em; }
      .stat-anchor { font-weight: 900; font-size: 28px; fill: #0F172A; letter-spacing: -0.03em; }
    </style>

    <linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="50%" stop-color="#047857" />
      <stop offset="100%" stop-color="#064E3B" />
    </linearGradient>
    <linearGradient id="brandCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#065F46" />
      <stop offset="100%" stop-color="#022C22" />
    </linearGradient>
    <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="motifGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="35%" stop-color="#F59E0B" />
      <stop offset="65%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
    <linearGradient id="goldButtonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE68A" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <linearGradient id="darkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>

    <!-- Drop Shadows -->
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#0F172A" flood-opacity="0.04" />
      <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#0F172A" flood-opacity="0.06" />
    </filter>
    <filter id="heroShadow" x="-5%" y="-5%" width="110%" height="115%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#047857" flood-opacity="0.08" />
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#047857" flood-opacity="0.12" />
    </filter>
    <filter id="modalShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="24" flood-color="#0F172A" flood-opacity="0.28" />
    </filter>

    <!-- Tribal Pattern -->
    <pattern id="tribalPattern" width="32" height="16" patternUnits="userSpaceOnUse">
      <path d="M0 8 L8 0 L16 8 L8 16 Z M16 8 L24 0 L32 8 L24 16 Z" fill="url(#motifGrad)" fill-opacity="0.12"/>
      <circle cx="8" cy="8" r="1.5" fill="#D97706" />
      <circle cx="24" cy="8" r="1.5" fill="#047857" />
    </pattern>
  </defs>
  `;
}

// -------------------------------------------------------------
// Desktop Chrome Window Frame (1440 x 960)
// -------------------------------------------------------------
function renderDesktopChrome(urlPath = 'scholar/dashboard', title = 'Tribe Saarthi · Ministry of Tribal Affairs') {
  return `
  <!-- Canvas Background -->
  <rect width="1440" height="960" fill="#FAF7F2" rx="14" />

  <!-- Desktop Browser Window Frame (Chrome) -->
  <path d="M0 14 A14 14 0 0 1 14 0 L1426 0 A14 14 0 0 1 1440 14 L1440 38 L0 38 Z" fill="#0F172A" />
  <circle cx="22" cy="19" r="5.5" fill="#EF4444" />
  <circle cx="38" cy="19" r="5.5" fill="#F59E0B" />
  <circle cx="54" cy="19" r="5.5" fill="#10B981" />

  <!-- Active Tab -->
  <path d="M80 38 L95 12 A4 4 0 0 1 99 10 L290 10 A4 4 0 0 1 294 12 L309 38 Z" fill="#1E293B" />
  <circle cx="112" cy="24" r="5" fill="#059669" />
  <text x="126" y="27" font-size="11" font-weight="600" fill="#F8FAFC">${title}</text>

  <!-- Omnibar -->
  <rect x="440" y="8" width="560" height="22" rx="6" fill="#020617" stroke="#334155" stroke-width="1" />
  ${I.lock(450, 12, '#10B981', 14)}
  <text x="720" y="23" font-size="11" font-weight="500" fill="#94A3B8" text-anchor="middle" class="mono">https://tribesaarthi.gov.in/${urlPath}</text>

  <!-- MoTA Geometric Motif Ribbon -->
  <rect x="0" y="38" width="1440" height="3" fill="url(#motifGrad)" />
  `;
}

// -------------------------------------------------------------
// Unified 5-Destination Sidebar (Scholar or Officer)
// -------------------------------------------------------------
function renderSidebar(activeKey = 'home', role = 'student') {
  const isStudent = role === 'student';
  const mainItems = isStudent ? [
    { key: 'home', label: 'Home', icon: I.home },
    { key: 'scholarships', label: 'Scholarships', icon: I.book },
    { key: 'apps', label: 'My Applications', icon: I.apps },
    { key: 'documents', label: 'Documents', icon: I.docCheck, badge: '4/4' },
    { key: 'help', label: 'Help & Grievance', icon: I.help },
  ] : [
    { key: 'queue', label: 'Review Queue', icon: I.docCheck, badge: '14' },
    { key: 'inspection', label: 'Case Inspection', icon: I.eye },
    { key: 'sanction', label: 'Digital Sanctions', icon: I.shield },
    { key: 'analytics', label: 'Coverage Analytics', icon: I.chart },
    { key: 'audit', label: 'Forensic Audit Log', icon: I.doc },
  ];

  const secondaryItems = isStudent ? [
    { key: 'profile', label: 'Profile & PVTG ID', icon: I.user },
    { key: 'family', label: 'Family Consent', icon: I.users },
    { key: 'offline', label: 'Offline Sync', icon: I.sync, badge: 'Queued' },
  ] : [
    { key: 'switchboard', label: 'Sabotage Tester', icon: I.sliders },
  ];

  let out = `
  <!-- Left Sidebar Shell -->
  <rect x="0" y="41" width="250" height="919" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
  
  <!-- Tribal Pattern Accent Header -->
  <rect x="0" y="41" width="250" height="66" fill="url(#tribalPattern)" />
  <rect x="0" y="41" width="250" height="66" fill="#FFFFFF" fill-opacity="0.88" />

  <!-- MoTA Emblem Crest -->
  <g transform="translate(24, 52)">
    <circle cx="18" cy="18" r="18" fill="url(#brandGrad)" />
    <circle cx="18" cy="18" r="14" fill="none" stroke="#FDE68A" stroke-width="1.2" stroke-dasharray="2 1.5" />
    <text x="18" y="23" font-size="12" font-weight="900" fill="#FFFFFF" text-anchor="middle">TS</text>
    <text x="46" y="15" font-size="15" font-weight="800" fill="#0F172A">Tribe Saarthi</text>
    <text x="46" y="28" font-size="9" font-weight="800" fill="#B45309" letter-spacing="0.5">MIN. OF TRIBAL AFFAIRS</text>
  </g>
  <line x1="20" y1="107" x2="230" y2="107" stroke="#F1F5F9" stroke-width="1" />

  <!-- Nav Section 1: Main Work -->
  <text x="24" y="128" font-size="10" font-weight="800" fill="#94A3B8" letter-spacing="0.1em">
    ${isStudent ? 'SCHOLAR PORTAL' : 'OFFICER WORKBENCH'}
  </text>
  `;

  let y = 140;
  for (const it of mainItems) {
    const active = it.key === activeKey;
    if (active) {
      out += `
      <rect x="16" y="${y}" width="218" height="38" rx="10" fill="url(#brandGrad)" filter="url(#cardShadow)" />
      ${it.icon(30, y + 10, '#FDE68A', 18)}
      <text x="58" y="${y + 24}" font-size="12" font-weight="700" fill="#FFFFFF">${it.label}</text>
      ${it.badge ? `
        <rect x="184" y="${y + 9}" width="38" height="20" rx="10" fill="#064E3B" />
        <text x="203" y="${y + 23}" font-size="9" font-weight="800" fill="#FDE68A" class="badge">${it.badge}</text>
      ` : ''}
      `;
    } else {
      out += `
      <rect x="16" y="${y}" width="218" height="38" rx="10" fill="transparent" />
      ${it.icon(30, y + 10, '#64748B', 18)}
      <text x="58" y="${y + 24}" font-size="12" font-weight="600" fill="#334155">${it.label}</text>
      ${it.badge ? `
        <rect x="184" y="${y + 9}" width="38" height="20" rx="10" fill="#F1F5F9" />
        <text x="203" y="${y + 23}" font-size="9" font-weight="700" fill="#64748B" class="badge">${it.badge}</text>
      ` : ''}
      `;
    }
    y += 44;
  }

  // Secondary Section
  y += 12;
  out += `
  <line x1="20" y1="${y}" x2="230" y2="${y}" stroke="#E2E8F0" stroke-width="1" />
  <text x="24" y="${y + 20}" font-size="10" font-weight="800" fill="#94A3B8" letter-spacing="0.1em">
    ${isStudent ? 'ACCOUNT &amp; CONSENT' : 'SYSTEM &amp; TESTING'}
  </text>
  `;
  y += 32;

  for (const it of secondaryItems) {
    const active = it.key === activeKey;
    if (active) {
      out += `
      <rect x="16" y="${y}" width="218" height="36" rx="9" fill="url(#brandGrad)" filter="url(#cardShadow)" />
      ${it.icon(30, y + 9, '#FDE68A', 17)}
      <text x="58" y="${y + 23}" font-size="12" font-weight="700" fill="#FFFFFF">${it.label}</text>
      `;
    } else {
      out += `
      <rect x="16" y="${y}" width="218" height="36" rx="9" fill="transparent" />
      ${it.icon(30, y + 9, '#64748B', 17)}
      <text x="58" y="${y + 23}" font-size="12" font-weight="600" fill="#475569">${it.label}</text>
      ${it.badge ? `
        <rect x="176" y="${y + 8}" width="46" height="18" rx="9" fill="#FEF3C7" />
        <text x="199" y="${y + 21}" font-size="8.5" font-weight="800" fill="#B45309" class="badge">${it.badge}</text>
      ` : ''}
      `;
    }
    y += 40;
  }

  // Sidebar Footer Badge
  out += `
  <g transform="translate(16, 885)">
    <rect width="218" height="54" rx="12" fill="#F8FAFC" stroke="#E2E8F0" />
    <circle cx="20" cy="27" r="5" fill="#10B981" />
    <text x="32" y="24" font-size="11" font-weight="700" fill="#0F172A">DigiLocker Synced</text>
    <text x="32" y="38" font-size="9" fill="#64748B">UIDAI Vault &amp; e-District OK</text>
  </g>
  `;
  return out;
}

// -------------------------------------------------------------
// Top Header Bar
// -------------------------------------------------------------
function renderHeader(title = 'Scholar Dashboard', subtitle = 'Welcome back, Mohan Birhor · BIT Mesra · Domicile: Ranchi, Jharkhand', role = 'student') {
  return `
  <!-- Top Navigation Header -->
  <g transform="translate(250, 41)">
    <rect width="1190" height="64" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
    
    <!-- Title & Context -->
    <text x="32" y="28" font-size="16" font-weight="800" fill="#0F172A">${title}</text>
    <text x="32" y="46" font-size="11" font-weight="500" fill="#64748B">${subtitle}</text>

    <!-- PVTG Priority Chip -->
    <rect x="520" y="20" width="136" height="24" rx="12" fill="#FEF3C7" stroke="#FDE68A" />
    <circle cx="532" cy="32" r="3.5" fill="#D97706" />
    <text x="542" y="36" font-size="10" font-weight="800" fill="#92400E">PVTG Tier-1 Priority</text>

    <!-- Language Selector Pill -->
    <rect x="850" y="19" width="168" height="26" rx="13" fill="#F1F5F9" />
    <text x="864" y="36" font-size="10" font-weight="800" fill="#047857">EN</text>
    <text x="890" y="36" font-size="10" font-weight="600" fill="#64748B">हिंदी</text>
    <text x="922" y="36" font-size="10" font-weight="600" fill="#64748B">ᱥᱟᱱᱛᱟᱲᱤ</text>
    <text x="982" y="36" font-size="10" font-weight="600" fill="#64748B">ଓଡ଼ିଆ</text>

    <!-- Notification Bell -->
    <circle cx="1046" cy="32" r="16" fill="#F8FAFC" stroke="#E2E8F0" />
    ${I.bell(1037, 23, '#475569', 18)}
    <circle cx="1053" cy="24" r="4" fill="#EF4444" />

    <!-- User Profile Chip -->
    <rect x="1076" y="16" width="98" height="32" rx="16" fill="#F8FAFC" stroke="#E2E8F0" />
    <circle cx="1092" cy="32" r="11" fill="url(#brandGrad)" />
    <text x="1092" y="36" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">${role === 'student' ? 'MB' : 'KS'}</text>
    <text x="1110" y="36" font-size="11" font-weight="700" fill="#0F172A">${role === 'student' ? 'Mohan' : 'Dr. Soren'}</text>
  </g>
  `;
}

// =============================================================
// SCREEN 01: Scholar Dashboard Desktop (1440 x 960)
// =============================================================
function make01ScholarDashboardDesktop() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('scholar/dashboard', 'Tribe Saarthi · Scholar Dashboard')}
  ${renderSidebar('home', 'student')}
  ${renderHeader('Scholar Dashboard', 'Welcome back, Mohan Birhor · BIT Mesra · Domicile: Ranchi, Jharkhand', 'student')}

  <!-- Main Viewport Content -->
  <g transform="translate(274, 120)">
    
    <!-- 1. Immediate Task-First Application Tracker Hero Card (Above the Fold) -->
    <g filter="url(#heroShadow)">
      <rect width="1142" height="156" rx="14" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
      <rect width="1142" height="4" rx="2" fill="url(#brandGrad)" />
      
      <!-- Card Header Row -->
      <g transform="translate(24, 20)">
        <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">Post-Matric Scholarship for ST Students (2026-27)</text>
        <text x="0" y="34" font-size="11" font-weight="500" fill="#64748B">Application ID: <tspan font-family="JetBrains Mono" font-weight="600" fill="#0F172A">JH-ST-2026-89412</tspan> · Submitted on 12 Oct 2026</text>
        
        <!-- Sanction Amount Badge -->
        <rect x="760" y="0" width="180" height="34" rx="8" fill="#ECFDF5" stroke="#A7F3D0" />
        <text x="772" y="22" font-size="12" font-weight="800" fill="#047857">₹132,000 Sanctioned</text>
        <text x="898" y="22" font-size="9" font-weight="700" fill="#059669">DBT PENDING</text>

        <!-- Action Button -->
        <rect x="954" y="0" width="140" height="34" rx="8" fill="url(#goldButtonGrad)" />
        <text x="1024" y="21" font-size="11" font-weight="800" fill="#78350F" text-anchor="middle">View Sanction Slip →</text>
      </g>

      <!-- 4-Stage Horizontal Stepper (MUI AlternativeLabel Pattern) -->
      <g transform="translate(60, 84)">
        <!-- Connecting Track -->
        <line x1="30" y1="16" x2="980" y2="16" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round" />
        <line x1="30" y1="16" x2="340" y2="16" stroke="#059669" stroke-width="4" stroke-linecap="round" />
        
        <!-- Stage 1: Done -->
        <circle cx="30" cy="16" r="16" fill="#047857" />
        ${I.check(21, 7, '#FFFFFF', 18)}
        <text x="30" y="46" font-size="11" font-weight="700" fill="#0F172A" text-anchor="middle">Applied &amp; Sealed</text>
        <text x="30" y="58" font-size="9.5" fill="#64748B" text-anchor="middle">12 Oct · Verified ✓</text>

        <!-- Stage 2: Active (College Desk) -->
        <circle cx="340" cy="16" r="16" fill="url(#amberGrad)" filter="url(#cardShadow)" />
        <circle cx="340" cy="16" r="22" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="3 3" />
        ${I.clock(331, 7, '#FFFFFF', 18)}
        <text x="340" y="46" font-size="11" font-weight="800" fill="#B45309" text-anchor="middle">College Nodal Review</text>
        <text x="340" y="58" font-size="9.5" font-weight="600" fill="#D97706" text-anchor="middle">Active at BIT Mesra Desk</text>

        <!-- Stage 3: Upcoming -->
        <circle cx="670" cy="16" r="14" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" />
        <text x="670" y="20" font-size="11" font-weight="700" fill="#64748B" text-anchor="middle">3</text>
        <text x="670" y="46" font-size="11" font-weight="600" fill="#64748B" text-anchor="middle">Ministry Sanction</text>
        <text x="670" y="58" font-size="9.5" fill="#94A3B8" text-anchor="middle">State Welfare Level</text>

        <!-- Stage 4: Upcoming -->
        <circle cx="980" cy="16" r="14" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" />
        <text x="980" y="20" font-size="11" font-weight="700" fill="#64748B" text-anchor="middle">4</text>
        <text x="980" y="46" font-size="11" font-weight="600" fill="#64748B" text-anchor="middle">Direct Bank Transfer</text>
        <text x="980" y="58" font-size="9.5" fill="#94A3B8" text-anchor="middle">Aadhaar Seeded DBT</text>
      </g>
    </g>

    <!-- 2. Three Metric Cards Row -->
    <g transform="translate(0, 176)">
      <!-- Card 1: Sanctioned Benefit -->
      <g filter="url(#cardShadow)">
        <rect width="364" height="116" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="364" height="4" rx="2" fill="#047857" />
        <g transform="translate(20, 20)">
          <circle cx="20" cy="20" r="20" fill="#ECFDF5" />
          ${I.shield(10, 10, '#047857', 20)}
          <text x="52" y="16" font-size="11" font-weight="700" fill="#64748B">SANCTIONED BENEFIT</text>
          <text x="52" y="38" font-size="20" font-weight="800" fill="#0F172A">₹132,000 <tspan font-size="12" font-weight="500" fill="#64748B">/ year</tspan></text>
          <text x="0" y="72" font-size="11" fill="#059669" font-weight="600">✓ Full Tuition (₹98K) + Maintenance (₹34K)</text>
        </g>
      </g>

      <!-- Card 2: Reusable Documents -->
      <g transform="translate(388, 0)" filter="url(#cardShadow)">
        <rect width="364" height="116" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="364" height="4" rx="2" fill="#2563EB" />
        <g transform="translate(20, 20)">
          <circle cx="20" cy="20" r="20" fill="#EFF6FF" />
          ${I.docCheck(10, 10, '#2563EB', 20)}
          <text x="52" y="16" font-size="11" font-weight="700" fill="#64748B">DIGILOCKER VAULT</text>
          <text x="52" y="38" font-size="20" font-weight="800" fill="#0F172A">4 / 4 Verified</text>
          <text x="0" y="72" font-size="11" fill="#2563EB" font-weight="600">✓ Caste, Income, Marksheet &amp; Bonafide</text>
        </g>
      </g>

      <!-- Card 3: Scholar Identity -->
      <g transform="translate(778, 0)" filter="url(#cardShadow)">
        <rect width="364" height="116" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="364" height="4" rx="2" fill="#D97706" />
        <g transform="translate(20, 20)">
          <circle cx="20" cy="20" r="20" fill="#FEF3C7" />
          ${I.user(10, 10, '#D97706', 20)}
          <text x="52" y="16" font-size="11" font-weight="700" fill="#64748B">SCHOLAR IDENTITY</text>
          <text x="52" y="36" font-size="13" font-weight="700" fill="#0F172A">APAAR: <tspan class="mono" font-weight="600">9482-1049-5821</tspan></text>
          <text x="52" y="52" font-size="11" font-weight="600" fill="#64748B">Aadhaar: •••• •••• 4921</text>
          <text x="0" y="72" font-size="11" fill="#D97706" font-weight="600">✓ Birhor Community · Latehar, Jharkhand</text>
        </g>
      </g>
    </g>

    <!-- 3. Bottom Grid: Multi-Registry Verification with Radial Progress & Saarthi Assistant -->
    <g transform="translate(0, 312)">
      <!-- Left Panel (700px): Government Registry Verification Transparency -->
      <g filter="url(#cardShadow)">
        <rect width="700" height="480" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        
        <!-- Header with Radial Meter Component -->
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="14" font-weight="800" fill="#0F172A">Government Registry Cross-Verification</text>
          <text x="0" y="34" font-size="11" fill="#64748B">Automated verification status across central and state government registries</text>
          
          <!-- Radial Progress Ring Component -->
          <g transform="translate(560, 2)">
            ${renderDonutChartComponent({
              cx: 30,
              cy: 20,
              rOut: 20,
              rIn: 13,
              segments: [
                { label: 'Cleared', percent: 75, color: '#047857' },
                { label: 'Pending', percent: 25, color: '#D97706' }
              ],
              centerValue: '75%',
              centerSub: ''
            })}
            <rect x="58" y="10" width="76" height="20" rx="10" fill="#ECFDF5" />
            <text x="96" y="23" font-size="8.5" font-weight="800" fill="#047857" class="badge">3/4 CLEAR</text>
          </g>
        </g>
        <line x1="24" y1="74" x2="676" y2="74" stroke="#F1F5F9" stroke-width="1" />

        <!-- Registry Row 1: UIDAI -->
        <g transform="translate(24, 90)">
          <rect width="652" height="68" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          <circle cx="34" cy="34" r="16" fill="#ECFDF5" />
          ${I.checkCircle(25, 25, '#10B981', 18)}
          <text x="64" y="28" font-size="13" font-weight="700" fill="#0F172A">UIDAI Aadhaar Vault &amp; Demographic Match</text>
          <text x="64" y="46" font-size="11" fill="#64748B">Biometric token authenticated · DOB &amp; Name 100% matched with Aadhaar registry</text>
          <rect x="548" y="20" width="88" height="26" rx="13" fill="#ECFDF5" />
          <text x="592" y="37" font-size="10" font-weight="800" fill="#047857" class="badge">VERIFIED ✓</text>
        </g>

        <!-- Registry Row 2: State e-District ST Certificate -->
        <g transform="translate(24, 168)">
          <rect width="652" height="68" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          <circle cx="34" cy="34" r="16" fill="#ECFDF5" />
          ${I.checkCircle(25, 25, '#10B981', 18)}
          <text x="64" y="28" font-size="13" font-weight="700" fill="#0F172A">Jharkhand State e-District ST Registry</text>
          <text x="64" y="46" font-size="11" fill="#64748B">Certificate #JH/ST/2022/4910 · Issued by SDO Latehar · Birhor PVTG Validated</text>
          <rect x="548" y="20" width="88" height="26" rx="13" fill="#ECFDF5" />
          <text x="592" y="37" font-size="10" font-weight="800" fill="#047857" class="badge">VERIFIED ✓</text>
        </g>

        <!-- Registry Row 3: Revenue Income Registry -->
        <g transform="translate(24, 246)">
          <rect width="652" height="68" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          <circle cx="34" cy="34" r="16" fill="#ECFDF5" />
          ${I.checkCircle(25, 25, '#10B981', 18)}
          <text x="64" y="28" font-size="13" font-weight="700" fill="#0F172A">Revenue Department Income Certificate</text>
          <text x="64" y="46" font-size="11" fill="#64748B">Annual Family Income: ₹1,20,000 · Valid till 31 March 2027 · Non-creamy layer</text>
          <rect x="548" y="20" width="88" height="26" rx="13" fill="#ECFDF5" />
          <text x="592" y="37" font-size="10" font-weight="800" fill="#047857" class="badge">VERIFIED ✓</text>
        </g>

        <!-- Registry Row 4: AISHE College Enrollment -->
        <g transform="translate(24, 324)">
          <rect width="652" height="68" rx="10" fill="#FFFBEB" stroke="#FDE68A" />
          <circle cx="34" cy="34" r="16" fill="#FEF3C7" />
          ${I.clock(25, 25, '#D97706', 18)}
          <text x="64" y="28" font-size="13" font-weight="700" fill="#0F172A">AISHE College Enrollment &amp; Attendance</text>
          <text x="64" y="46" font-size="11" fill="#B45309">BIT Mesra · B.Tech CSE (Roll: 2024-CSE-104) · Awaiting Nodal Officer Approval</text>
          <rect x="548" y="20" width="88" height="26" rx="13" fill="#FEF3C7" />
          <text x="592" y="37" font-size="10" font-weight="800" fill="#B45309" class="badge">IN REVIEW</text>
        </g>

        <!-- Honest Verification Guarantee Box -->
        <g transform="translate(24, 404)">
          <rect width="652" height="54" rx="8" fill="#F0FDF4" stroke="#BBF7D0" />
          ${I.shield(36, 417, '#047857', 20)}
          <text x="68" y="425" font-size="11" font-weight="700" fill="#047857">MoTA Honest Verification Guarantee</text>
          <text x="68" y="442" font-size="10" fill="#475569">If automated registry sync is unavailable, your application routes automatically to human review without cancellation.</text>
        </g>
      </g>

      <!-- Right Panel (422px): Milestone Notices & Saarthi AI Prompt -->
      <g transform="translate(720, 0)">
        <!-- Milestone Updates Card -->
        <g filter="url(#cardShadow)">
          <rect width="422" height="250" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
          <g transform="translate(20, 20)">
            <text x="0" y="16" font-size="14" font-weight="800" fill="#0F172A">Official Milestone Notices</text>
            <text x="0" y="32" font-size="11" fill="#64748B">Authoritative updates from Ministry and Institution</text>
          </g>
          <line x1="20" y1="62" x2="402" y2="62" stroke="#F1F5F9" />

          <!-- Update 1 -->
          <g transform="translate(20, 76)">
            <circle cx="8" cy="12" r="4" fill="#10B981" />
            <text x="20" y="14" font-size="12" font-weight="700" fill="#0F172A">BIT Mesra Desk Verification Begun</text>
            <text x="20" y="30" font-size="10.5" fill="#64748B">Dr. K. Soren opened your case file for bonafide verification.</text>
            <text x="20" y="44" font-size="9.5" fill="#94A3B8" class="mono">14 Oct 2026 · 11:42 AM</text>
          </g>

          <!-- Update 2 -->
          <g transform="translate(20, 140)">
            <circle cx="8" cy="12" r="4" fill="#059669" />
            <text x="20" y="14" font-size="12" font-weight="700" fill="#0F172A">DigiLocker Cryptographic Seal Passed</text>
            <text x="20" y="30" font-size="10.5" fill="#64748B">Caste certificate SHA-256 matches Jharkhand state vault.</text>
            <text x="20" y="44" font-size="9.5" fill="#94A3B8" class="mono">12 Oct 2026 · 02:22 PM</text>
          </g>

          <!-- View all updates link -->
          <text x="20" y="228" font-size="11" font-weight="700" fill="#047857">View Complete Activity History (5 events) →</text>
        </g>

        <!-- Saarthi Conversational Assistant Card -->
        <g transform="translate(0, 268)" filter="url(#cardShadow)">
          <rect width="422" height="212" rx="14" fill="url(#brandCardGrad)" />
          
          <g transform="translate(24, 24)">
            <circle cx="18" cy="18" r="18" fill="#FFFFFF" fill-opacity="0.12" />
            ${I.help(9, 9, '#FDE68A', 18)}
            <text x="46" y="15" font-size="14" font-weight="800" fill="#FFFFFF">Saarthi Tribal Assistant</text>
            <text x="46" y="30" font-size="10" font-weight="600" fill="#A7F3D0">Available in Santhali, Hindi &amp; Odia</text>

            <rect x="0" y="48" width="374" height="64" rx="8" fill="#FFFFFF" fill-opacity="0.08" stroke="#FFFFFF" stroke-opacity="0.16" />
            <text x="14" y="70" font-size="11" font-weight="600" fill="#F8FAFC">"When will my ₹132,000 scholarship be credited?"</text>
            <text x="14" y="92" font-size="10" fill="#D1FAE5">College review takes ~2 days, followed by direct PFMS bank transfer.</text>

            <rect x="0" y="126" width="374" height="34" rx="8" fill="#FFFFFF" />
            <text x="187" y="147" font-size="11" font-weight="800" fill="#065F46" text-anchor="middle">Chat with Saarthi in Your Language →</text>
          </g>
        </g>
      </g>
    </g>

  </g>
</svg>`;
}

function make02ScholarDashboardMobile() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="390" height="844" viewBox="0 0 390 844" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  
  <!-- Canvas Background -->
  <rect width="390" height="844" fill="#FAF7F2" />

  <!-- iOS Status Bar (09:41, Cellular, WiFi, Battery) -->
  <rect width="390" height="44" fill="#0F172A" />
  <text x="32" y="28" font-size="12" font-weight="700" fill="#F8FAFC">09:41</text>
  <circle cx="195" cy="22" r="10" fill="#020617" />
  <circle cx="340" cy="24" r="3" fill="#10B981" />
  <rect x="350" y="18" width="20" height="11" rx="3" fill="none" stroke="#F8FAFC" stroke-width="1.5" />
  <rect x="352" y="20" width="12" height="7" rx="1.5" fill="#F8FAFC" />

  <!-- Mobile App Header Bar -->
  <g transform="translate(0, 44)">
    <rect width="390" height="56" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
    <circle cx="32" cy="28" r="15" fill="url(#brandGrad)" />
    <text x="32" y="32" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle">TS</text>
    <text x="56" y="25" font-size="13" font-weight="800" fill="#0F172A">Tribe Saarthi</text>
    <text x="56" y="38" font-size="8.5" font-weight="800" fill="#B45309">MIN. OF TRIBAL AFFAIRS</text>

    <!-- Language Selector Pill -->
    <rect x="236" y="16" width="68" height="24" rx="12" fill="#F1F5F9" />
    <text x="252" y="32" font-size="9" font-weight="800" fill="#047857">EN</text>
    <text x="276" y="32" font-size="9" font-weight="600" fill="#64748B">हिंदी</text>

    <!-- Notification Bell -->
    <circle cx="328" cy="28" r="14" fill="#F8FAFC" stroke="#E2E8F0" />
    ${I.bell(320, 20, '#475569', 16)}
    <circle cx="334" cy="21" r="3" fill="#EF4444" />

    <!-- Avatar -->
    <circle cx="364" cy="28" r="14" fill="url(#brandGrad)" />
    <text x="364" y="32" font-size="9.5" font-weight="800" fill="#FFFFFF" text-anchor="middle">MB</text>
  </g>

  <!-- Mobile Scrollable Content Area -->
  <g transform="translate(16, 112)">
    
    <!-- Greeting Strip -->
    <g>
      <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">Johar, Mohan Birhor</text>
      <text x="0" y="32" font-size="11" fill="#64748B">BIT Mesra (B.Tech CSE) · Latehar, JH</text>
      
      <rect x="230" y="2" width="128" height="22" rx="11" fill="#FEF3C7" stroke="#FDE68A" />
      <circle cx="240" cy="13" r="3" fill="#D97706" />
      <text x="248" y="16.5" font-size="9" font-weight="800" fill="#92400E">PVTG Tier-1 Priority</text>
    </g>

    <!-- 1. Task-First Action Card (Disbursement Ready) -->
    <g transform="translate(0, 48)" filter="url(#heroShadow)">
      <rect width="358" height="136" rx="14" fill="url(#brandCardGrad)" />
      <rect width="358" height="3" rx="1.5" fill="url(#motifGrad)" />
      
      <circle cx="24" cy="28" r="12" fill="#FFFFFF" fill-opacity="0.15" />
      ${I.shield(14, 18, '#FDE68A', 16)}
      <text x="44" y="26" font-size="9" font-weight="800" fill="#FDE68A" letter-spacing="0.05em">ACTION READY</text>
      <text x="44" y="38" font-size="9" fill="#A7F3D0">Post-Matric ST Grant</text>

      <text x="24" y="70" font-size="20" font-weight="800" fill="#FFFFFF">₹132,000 Sanctioned</text>
      <text x="24" y="86" font-size="10.5" fill="#D1FAE5">Direct Benefit Transfer approved to Bank of India.</text>

      <rect x="24" y="98" width="160" height="28" rx="8" fill="url(#goldButtonGrad)" />
      <text x="104" y="116" font-size="10.5" font-weight="800" fill="#78350F" text-anchor="middle">View Sanction Slip →</text>
    </g>

    <!-- 2. Stepper Card (Compact Horizontal) -->
    <g transform="translate(0, 196)" filter="url(#cardShadow)">
      <rect width="358" height="124" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <text x="16" y="24" font-size="12" font-weight="800" fill="#0F172A">Application Lifecycle</text>
      <text x="16" y="38" font-size="10" fill="#64748B">App #JH-ST-2026-89412 · Stage 2 Active</text>

      <!-- Stepper Track -->
      <line x1="28" y1="68" x2="330" y2="68" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round" />
      <line x1="28" y1="68" x2="128" y2="68" stroke="#059669" stroke-width="3" stroke-linecap="round" />

      <!-- Step 1 -->
      <circle cx="28" cy="68" r="10" fill="#047857" />
      ${I.check(22, 62, '#FFFFFF', 12)}
      <text x="28" y="90" font-size="8.5" font-weight="700" fill="#0F172A" text-anchor="middle">Applied</text>

      <!-- Step 2 -->
      <circle cx="128" cy="68" r="12" fill="url(#amberGrad)" />
      <circle cx="128" cy="68" r="16" fill="none" stroke="#F59E0B" stroke-width="1.5" stroke-dasharray="2 2" />
      <text x="128" y="90" font-size="8.5" font-weight="800" fill="#B45309" text-anchor="middle">College Desk</text>
      <text x="128" y="102" font-size="7.5" fill="#D97706" text-anchor="middle">In Review</text>

      <!-- Step 3 -->
      <circle cx="228" cy="68" r="9" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5" />
      <text x="228" y="71" font-size="8" font-weight="700" fill="#64748B" text-anchor="middle">3</text>
      <text x="228" y="90" font-size="8.5" font-weight="600" fill="#64748B" text-anchor="middle">Ministry</text>

      <!-- Step 4 -->
      <circle cx="328" cy="68" r="9" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5" />
      <text x="328" y="71" font-size="8" font-weight="700" fill="#64748B" text-anchor="middle">4</text>
      <text x="328" y="90" font-size="8.5" font-weight="600" fill="#64748B" text-anchor="middle">DBT Pay</text>
    </g>

    <!-- 3. Two Quick Metric Tiles -->
    <g transform="translate(0, 332)">
      <!-- Tile 1 -->
      <g filter="url(#cardShadow)">
        <rect width="172" height="88" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <circle cx="24" cy="28" r="14" fill="#EFF6FF" />
        ${I.docCheck(14, 18, '#2563EB', 18)}
        <text x="46" y="24" font-size="10" font-weight="700" fill="#64748B">DIGILOCKER</text>
        <text x="46" y="38" font-size="13" font-weight="800" fill="#0F172A">4 / 4 Verified</text>
        <text x="14" y="68" font-size="9" fill="#2563EB" font-weight="600">✓ Caste, Income, Marks</text>
      </g>

      <!-- Tile 2 -->
      <g transform="translate(186, 0)" filter="url(#cardShadow)">
        <rect width="172" height="88" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <circle cx="24" cy="28" r="14" fill="#FEF3C7" />
        ${I.help(14, 18, '#D97706', 18)}
        <text x="46" y="24" font-size="10" font-weight="700" fill="#64748B">SAARTHI AI</text>
        <text x="46" y="38" font-size="13" font-weight="800" fill="#0F172A">Tribal Help</text>
        <text x="14" y="68" font-size="9" fill="#D97706" font-weight="600">Santhali / हिंदी / Odia</text>
      </g>
    </g>

    <!-- 4. Verified Government Status Notice -->
    <g transform="translate(0, 432)" filter="url(#cardShadow)">
      <rect width="358" height="68" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
      <circle cx="28" cy="34" r="14" fill="#ECFDF5" />
      ${I.checkCircle(19, 25, '#047857', 18)}
      <text x="50" y="28" font-size="11.5" font-weight="700" fill="#0F172A">BIT Mesra Academic Verification OK</text>
      <text x="50" y="44" font-size="9.5" fill="#64748B">Dr. K. Soren signed off on bonafide attendance.</text>
    </g>

    <!-- 5. Offline Resilient Queue Banner -->
    <g transform="translate(0, 510)">
      <rect width="358" height="42" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
      ${I.sync(12, 12, '#64748B', 16)}
      <text x="36" y="25" font-size="10" font-weight="600" fill="#475569">Offline Mode Ready · 0 pending changes queued</text>
      <circle cx="340" cy="21" r="4" fill="#10B981" />
    </g>
  </g>

  <!-- Mobile Bottom Navigation Bar (5 Items) -->
  <g transform="translate(0, 772)">
    <rect width="390" height="72" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" />
    
    <!-- Tab 1: Home (Active) -->
    <g transform="translate(24, 8)">
      ${I.home(8, 2, '#047857', 20)}
      <text x="18" y="34" font-size="9" font-weight="800" fill="#047857" text-anchor="middle">Home</text>
      <circle cx="18" cy="40" r="2" fill="#047857" />
    </g>

    <!-- Tab 2: Schemes -->
    <g transform="translate(98, 8)">
      ${I.book(8, 2, '#94A3B8', 20)}
      <text x="18" y="34" font-size="9" font-weight="600" fill="#64748B" text-anchor="middle">Schemes</text>
    </g>

    <!-- Tab 3: Applications -->
    <g transform="translate(176, 8)">
      ${I.apps(8, 2, '#94A3B8', 20)}
      <text x="18" y="34" font-size="9" font-weight="600" fill="#64748B" text-anchor="middle">Apps</text>
    </g>

    <!-- Tab 4: Documents -->
    <g transform="translate(254, 8)">
      ${I.docCheck(8, 2, '#94A3B8', 20)}
      <text x="18" y="34" font-size="9" font-weight="600" fill="#64748B" text-anchor="middle">Docs</text>
      <circle cx="28" cy="4" r="3" fill="#047857" />
    </g>

    <!-- Tab 5: Help -->
    <g transform="translate(330, 8)">
      ${I.help(8, 2, '#94A3B8', 20)}
      <text x="18" y="34" font-size="9" font-weight="600" fill="#64748B" text-anchor="middle">Help</text>
    </g>

    <!-- iOS Home Indicator -->
    <rect x="135" y="60" width="120" height="4" rx="2" fill="#0F172A" />
  </g>
</svg>`;
}

// =============================================================
// SCREEN 03: Scholarship Discovery & Advisory Matching
// =============================================================
function make03ScholarshipDiscovery() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('scholar/discovery', 'Tribe Saarthi · Scholarship Discovery')}
  ${renderSidebar('scholarships', 'student')}
  ${renderHeader('Scholarship Discovery', 'Advisory scheme matching based on verified tribal domicile, income, and enrollment', 'student')}

  <g transform="translate(274, 120)">
    
    <!-- Search & Filter Controls -->
    <g>
      <!-- Search Input -->
      <rect width="680" height="44" rx="10" fill="#FFFFFF" stroke="#E2E8F0" />
      ${I.search(16, 13, '#64748B', 18)}
      <text x="46" y="27" font-size="12" fill="#94A3B8">Search central and state tribal scholarships by course, level, or ministry...</text>
      
      <!-- Filter Chips -->
      <g transform="translate(700, 0)">
        <rect x="0" y="6" width="104" height="32" rx="16" fill="url(#brandGrad)" />
        <text x="52" y="26" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">All (12)</text>

        <rect x="114" y="6" width="140" height="32" rx="16" fill="#FEF3C7" stroke="#FDE68A" />
        <circle cx="128" cy="22" r="3.5" fill="#D97706" />
        <text x="186" y="26" font-size="11" font-weight="800" fill="#92400E" text-anchor="middle">PVTG Priority (3)</text>

        <rect x="264" y="6" width="118" height="32" rx="16" fill="#F1F5F9" />
        <text x="323" y="26" font-size="11" font-weight="600" fill="#475569" text-anchor="middle">Post-Matric (4)</text>

        <rect x="392" y="6" width="50" height="32" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
        ${I.filter(408, 13, '#64748B', 18)}
      </g>
    </g>

    <!-- Top Featured Match Hero Card -->
    <g transform="translate(0, 60)" filter="url(#heroShadow)">
      <rect width="1142" height="172" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <rect width="1142" height="4" rx="2" fill="url(#brandGrad)" />
      
      <g transform="translate(28, 24)">
        <rect x="0" y="0" width="112" height="24" rx="12" fill="#ECFDF5" />
        <text x="56" y="16" font-size="10.5" font-weight="800" fill="#047857" class="badge">98% FIT MATCH</text>

        <text x="0" y="48" font-size="18" font-weight="800" fill="#0F172A">National Overseas Scholarship for Scheduled Tribe Students</text>
        <text x="0" y="68" font-size="12" fill="#64748B">Ministry of Tribal Affairs · Full Tuition + Annual Maintenance for Master's/Ph.D. Abroad</text>

        <!-- Key Parameters Row -->
        <g transform="translate(0, 92)">
          <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">MAX BENEFIT</text>
          <text x="0" y="32" font-size="16" font-weight="800" fill="#047857">₹20,00,000 <tspan font-size="11" font-weight="500" fill="#64748B">/ yr + Airfare</tspan></text>

          <text x="220" y="14" font-size="11" font-weight="700" fill="#64748B">DEADLINE</text>
          <text x="220" y="32" font-size="14" font-weight="700" fill="#B45309">15 Nov 2026 (26 days left)</text>

          <text x="460" y="14" font-size="11" font-weight="700" fill="#64748B">ELIGIBILITY MATCH</text>
          <text x="460" y="32" font-size="12" font-weight="600" fill="#0F172A">ST Birhor ✓ · B.Tech 8.4 CGPA ✓ · Income &lt; ₹6L ✓</text>
        </g>

        <!-- CTA Buttons -->
        <rect x="940" y="76" width="150" height="42" rx="10" fill="url(#brandGrad)" />
        <text x="1015" y="102" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">Apply Online →</text>
      </g>
    </g>

    <!-- Scheme Cards Grid -->
    <g transform="translate(0, 252)">
      <!-- Scheme 1: Post-Matric ST -->
      <g filter="url(#cardShadow)">
        <rect width="364" height="240" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="100" height="22" rx="11" fill="#ECFDF5" />
          <text x="50" y="15" font-size="9.5" font-weight="800" fill="#047857" class="badge">100% MATCH</text>
          
          <text x="0" y="44" font-size="14" font-weight="800" fill="#0F172A">Post-Matric Scholarship for ST</text>
          <text x="0" y="60" font-size="11" fill="#64748B">Govt of Jharkhand &amp; MoTA Shared</text>

          <text x="0" y="94" font-size="10.5" font-weight="700" fill="#64748B">ANNUAL BENEFIT</text>
          <text x="0" y="114" font-size="18" font-weight="800" fill="#047857">₹132,000</text>

          <text x="0" y="144" font-size="11" fill="#64748B">Status: <tspan font-weight="700" fill="#047857">Active Application in Progress</tspan></text>
          <text x="0" y="160" font-size="10" fill="#94A3B8">App ID: JH-ST-2026-89412</text>

          <rect x="0" y="174" width="324" height="34" rx="8" fill="#F1F5F9" />
          <text x="162" y="195" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">View Application Status →</text>
        </g>
      </g>

      <!-- Scheme 2: National Fellowship -->
      <g transform="translate(388, 0)" filter="url(#cardShadow)">
        <rect width="364" height="240" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="94" height="22" rx="11" fill="#EFF6FF" />
          <text x="47" y="15" font-size="9.5" font-weight="800" fill="#2563EB" class="badge">94% MATCH</text>
          
          <text x="0" y="44" font-size="14" font-weight="800" fill="#0F172A">National ST Higher Fellowship</text>
          <text x="0" y="60" font-size="11" fill="#64748B">For M.Tech, M.Phil &amp; Ph.D. Scholars</text>

          <text x="0" y="94" font-size="10.5" font-weight="700" fill="#64748B">STIPEND BENEFIT</text>
          <text x="0" y="114" font-size="18" font-weight="800" fill="#0F172A">₹38,000 <tspan font-size="11" font-weight="500" fill="#64748B">/ month + HRA</tspan></text>

          <text x="0" y="144" font-size="11" fill="#64748B">Deadline: <tspan font-weight="700" fill="#B45309">30 Nov 2026</tspan></text>
          <text x="0" y="160" font-size="10" fill="#94A3B8">Eligibility: Final Year / Graduate Degree</text>

          <rect x="0" y="174" width="324" height="34" rx="8" fill="url(#brandGrad)" />
          <text x="162" y="195" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">Apply for Scheme →</text>
        </g>
      </g>

      <!-- Scheme 3: Top Class Education Scheme -->
      <g transform="translate(778, 0)" filter="url(#cardShadow)">
        <rect width="364" height="240" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(20, 20)">
          <rect x="0" y="0" width="94" height="22" rx="11" fill="#FEF3C7" />
          <text x="47" y="15" font-size="9.5" font-weight="800" fill="#B45309" class="badge">91% MATCH</text>
          
          <text x="0" y="44" font-size="14" font-weight="800" fill="#0F172A">Top Class Education for ST</text>
          <text x="0" y="60" font-size="11" fill="#64748B">Premier Institutes (IIT, NIT, BIT Mesra)</text>

          <text x="0" y="94" font-size="10.5" font-weight="700" fill="#64748B">TUITION &amp; LIVING</text>
          <text x="0" y="114" font-size="18" font-weight="800" fill="#0F172A">100% Tuition Fee</text>

          <text x="0" y="144" font-size="11" fill="#64748B">Eligible: <tspan font-weight="700" fill="#047857">BIT Mesra Notified Institute ✓</tspan></text>
          <text x="0" y="160" font-size="10" fill="#94A3B8">Income Cap: ₹6,00,000 / year</text>

          <rect x="0" y="174" width="324" height="34" rx="8" fill="url(#brandGrad)" />
          <text x="162" y="195" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">Apply for Scheme →</text>
        </g>
      </g>
    </g>

    <!-- Advisory Information Card -->
    <g transform="translate(0, 510)" filter="url(#cardShadow)">
      <rect width="1142" height="64" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
      ${I.shield(20, 20, '#047857', 22)}
      <text x="56" y="28" font-size="12" font-weight="700" fill="#0F172A">Transparent Scheme Advisory Rule</text>
      <text x="56" y="46" font-size="11" fill="#64748B">Matches are computed based on your DigiLocker verified tribal domicile and college enrollment. No personal data is sold or shared with commercial loan providers.</text>
    </g>

  </g>
</svg>`;
}

// =============================================================
// SCREEN 04: Application Flow - Step 1: Personal & Demographic
// =============================================================
function make04ApplicationFlowStep1Profile() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('scholar/apply/step1', 'Tribe Saarthi · Step 1: Profile & Demographics')}
  ${renderSidebar('apps', 'student')}
  ${renderHeader('Apply for Scholarship', 'Step 1 of 3: Personal & Tribal Community Profile', 'student')}

  <g transform="translate(274, 120)">
    
    <!-- 3-Step MUI Stepper -->
    <g filter="url(#cardShadow)">
      <rect width="1142" height="74" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
      
      <!-- Stepper Track -->
      <line x1="180" y1="36" x2="960" y2="36" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round" />
      
      <!-- Step 1: Active -->
      <g transform="translate(180, 22)">
        <circle cx="14" cy="14" r="14" fill="url(#brandGrad)" />
        <text x="14" y="19" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">1</text>
        <text x="38" y="18" font-size="12" font-weight="800" fill="#047857">Personal &amp; Tribal Identity</text>
      </g>

      <!-- Step 2: Upcoming -->
      <g transform="translate(520, 22)">
        <circle cx="14" cy="14" r="14" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" />
        <text x="14" y="19" font-size="12" font-weight="700" fill="#64748B" text-anchor="middle">2</text>
        <text x="38" y="18" font-size="12" font-weight="600" fill="#64748B">Academic &amp; Documents</text>
      </g>

      <!-- Step 3: Upcoming -->
      <g transform="translate(840, 22)">
        <circle cx="14" cy="14" r="14" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" />
        <text x="14" y="19" font-size="12" font-weight="700" fill="#64748B" text-anchor="middle">3</text>
        <text x="38" y="18" font-size="12" font-weight="600" fill="#64748B">Check Answers &amp; Submit</text>
      </g>
    </g>

    <!-- Main Form Card (GOV.UK Question Page Pattern) -->
    <g transform="translate(0, 94)" filter="url(#heroShadow)">
      <rect width="1142" height="690" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      
      <g transform="translate(40, 32)">
        <!-- Question Page Title -->
        <text x="0" y="24" font-size="20" font-weight="800" fill="#0F172A">Confirm your personal details and tribal identity</text>
        <text x="0" y="46" font-size="12" fill="#64748B">Information retrieved automatically from your verified DigiLocker and UIDAI credentials.</text>

        <!-- Form Grid: 2 Columns -->
        <!-- Row 1: Full Name & DOB -->
        <g transform="translate(0, 76)">
          <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">FULL LEGAL NAME (AS PER AADHAAR)</text>
          <rect x="0" y="24" width="500" height="42" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
          <text x="16" y="50" font-size="13" font-weight="700" fill="#0F172A">Mohan Birhor</text>
          <circle cx="476" cy="45" r="8" fill="#ECFDF5" />
          ${I.check(472, 41, '#047857', 10)}

          <text x="540" y="14" font-size="11" font-weight="700" fill="#334155">DATE OF BIRTH</text>
          <rect x="540" y="24" width="500" height="42" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
          <text x="556" y="50" font-size="13" font-weight="600" fill="#0F172A">14 / 08 / 2004</text>
          <circle cx="1016" cy="45" r="8" fill="#ECFDF5" />
          ${I.check(1012, 41, '#047857', 10)}
        </g>

        <!-- Row 2: Gender & Category -->
        <g transform="translate(0, 160)">
          <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">GENDER</text>
          <rect x="0" y="24" width="500" height="42" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
          <text x="16" y="50" font-size="13" font-weight="600" fill="#0F172A">Male</text>

          <text x="540" y="14" font-size="11" font-weight="700" fill="#334155">CONSTITUTIONAL CATEGORY</text>
          <rect x="540" y="24" width="500" height="42" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
          <text x="556" y="50" font-size="13" font-weight="700" fill="#047857">Scheduled Tribe (ST)</text>
        </g>

        <!-- Row 3: Tribal Community & PVTG Priority Selection -->
        <g transform="translate(0, 244)">
          <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">ST TRIBAL COMMUNITY</text>
          <rect x="0" y="24" width="500" height="42" rx="8" fill="#FFFFFF" stroke="#047857" stroke-width="1.5" />
          <text x="16" y="50" font-size="13" font-weight="700" fill="#0F172A">Birhor (Particularly Vulnerable Tribal Group)</text>

          <text x="540" y="14" font-size="11" font-weight="700" fill="#334155">DOMICILE STATE &amp; DISTRICT</text>
          <rect x="540" y="24" width="500" height="42" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
          <text x="556" y="50" font-size="13" font-weight="600" fill="#0F172A">Jharkhand · Latehar District</text>
        </g>

        <!-- PVTG Solemn Declaration Radio Pill -->
        <g transform="translate(0, 332)">
          <rect width="1040" height="74" rx="10" fill="#FEF3C7" stroke="#FDE68A" />
          <circle cx="30" cy="37" r="10" fill="#D97706" />
          <circle cx="30" cy="37" r="4" fill="#FFFFFF" />
          <text x="56" y="32" font-size="12" font-weight="800" fill="#92400E">PVTG Tier-1 Special Priority Eligibility</text>
          <text x="56" y="50" font-size="11" fill="#78350F">Applicants belonging to the 75 recognized PVTG communities receive 100% full fee waiver and priority fast-track sanction.</text>
        </g>

        <!-- Row 4: Annual Family Income & APAAR ID -->
        <g transform="translate(0, 426)">
          <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">ANNUAL FAMILY INCOME (REVENUE VERIFIED)</text>
          <rect x="0" y="24" width="500" height="42" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
          <text x="16" y="50" font-size="13" font-weight="700" fill="#0F172A">₹1,20,000</text>
          <text x="400" y="50" font-size="10" font-weight="700" fill="#047857">REV-JH-2026 ✓</text>

          <text x="540" y="14" font-size="11" font-weight="700" fill="#334155">ACADEMIC APAAR / ABC ID</text>
          <rect x="540" y="24" width="500" height="42" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
          <text x="556" y="50" font-size="13" font-weight="600" fill="#0F172A" class="mono">9482-1049-5821</text>
        </g>

        <!-- Button Actions Row -->
        <g transform="translate(0, 526)">
          <line x1="0" y1="0" x2="1040" y2="0" stroke="#F1F5F9" />
          
          <rect x="0" y="20" width="160" height="42" rx="8" fill="#F1F5F9" />
          <text x="80" y="46" font-size="12" font-weight="700" fill="#475569" text-anchor="middle">Save as Draft</text>

          <rect x="840" y="20" width="200" height="42" rx="8" fill="url(#brandGrad)" />
          <text x="940" y="46" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">Continue to Step 2 →</text>
        </g>
      </g>
    </g>

  </g>
</svg>`;
}

// =============================================================
// SCREEN 05: Application Flow - Step 2: Documents Checklist
// =============================================================
function make05ApplicationFlowStep2Documents() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('scholar/apply/step2', 'Tribe Saarthi · Step 2: Supporting Documents')}
  ${renderSidebar('apps', 'student')}
  ${renderHeader('Apply for Scholarship', 'Step 2 of 3: Document Checklist & DigiLocker Vault', 'student')}

  <g transform="translate(274, 120)">
    
    <!-- 3-Step Stepper -->
    <g filter="url(#cardShadow)">
      <rect width="1142" height="74" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
      <line x1="180" y1="36" x2="960" y2="36" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round" />
      <line x1="180" y1="36" x2="520" y2="36" stroke="#059669" stroke-width="3" stroke-linecap="round" />
      
      <!-- Step 1: Done -->
      <g transform="translate(180, 22)">
        <circle cx="14" cy="14" r="14" fill="#047857" />
        ${I.check(9, 9, '#FFFFFF', 10)}
        <text x="38" y="18" font-size="12" font-weight="700" fill="#0F172A">Personal Details ✓</text>
      </g>

      <!-- Step 2: Active -->
      <g transform="translate(520, 22)">
        <circle cx="14" cy="14" r="14" fill="url(#brandGrad)" />
        <text x="14" y="19" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">2</text>
        <text x="38" y="18" font-size="12" font-weight="800" fill="#047857">Documents &amp; Certificates</text>
      </g>

      <!-- Step 3: Upcoming -->
      <g transform="translate(840, 22)">
        <circle cx="14" cy="14" r="14" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" />
        <text x="14" y="19" font-size="12" font-weight="700" fill="#64748B" text-anchor="middle">3</text>
        <text x="38" y="18" font-size="12" font-weight="600" fill="#64748B">Check Answers &amp; Submit</text>
      </g>
    </g>

    <!-- Document Checklist Body -->
    <g transform="translate(0, 94)" filter="url(#heroShadow)">
      <rect width="1142" height="690" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      
      <g transform="translate(40, 32)">
        <text x="0" y="24" font-size="20" font-weight="800" fill="#0F172A">Upload or import verified documents</text>
        <text x="0" y="46" font-size="12" fill="#64748B">DigiLocker has pre-verified 3 out of 4 mandatory documents. 1 requires college attestation.</text>

        <!-- Slot 1: ST Caste Certificate -->
        <g transform="translate(0, 76)">
          <rect width="1040" height="74" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          <circle cx="36" cy="37" r="18" fill="#ECFDF5" />
          ${I.docCheck(26, 27, '#047857', 20)}
          
          <text x="70" y="30" font-size="13" font-weight="800" fill="#0F172A">Scheduled Tribe Caste Certificate (Birhor PVTG)</text>
          <text x="70" y="48" font-size="11" fill="#64748B">Issued by SDO Latehar, Govt. of Jharkhand · Cert #JH/ST/2022/4910</text>

          <rect x="740" y="24" width="140" height="26" rx="13" fill="#ECFDF5" />
          <text x="810" y="41" font-size="10" font-weight="800" fill="#047857" class="badge">DIGILOCKER SEAL ✓</text>

          <rect x="900" y="22" width="120" height="30" rx="6" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="960" y="41" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">View PDF</text>
        </g>

        <!-- Slot 2: Income Certificate -->
        <g transform="translate(0, 162)">
          <rect width="1040" height="74" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          <circle cx="36" cy="37" r="18" fill="#ECFDF5" />
          ${I.docCheck(26, 27, '#047857', 20)}
          
          <text x="70" y="30" font-size="13" font-weight="800" fill="#0F172A">Annual Family Income Certificate (₹1,20,000)</text>
          <text x="70" y="48" font-size="11" fill="#64748B">Revenue Department · Cert #REV/2026/84920 · Valid till 31 Mar 2027</text>

          <rect x="740" y="24" width="140" height="26" rx="13" fill="#ECFDF5" />
          <text x="810" y="41" font-size="10" font-weight="800" fill="#047857" class="badge">DIGILOCKER SEAL ✓</text>

          <rect x="900" y="22" width="120" height="30" rx="6" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="960" y="41" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">View PDF</text>
        </g>

        <!-- Slot 3: Academic Marksheet -->
        <g transform="translate(0, 248)">
          <rect width="1040" height="74" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          <circle cx="36" cy="37" r="18" fill="#ECFDF5" />
          ${I.docCheck(26, 27, '#047857', 20)}
          
          <text x="70" y="30" font-size="13" font-weight="800" fill="#0F172A">Class 12 / Intermediate Marksheet (82.4%)</text>
          <text x="70" y="48" font-size="11" fill="#64748B">Jharkhand Academic Council (JAC) · Roll #2022-JAC-8921</text>

          <rect x="740" y="24" width="140" height="26" rx="13" fill="#ECFDF5" />
          <text x="810" y="41" font-size="10" font-weight="800" fill="#047857" class="badge">DIGILOCKER SEAL ✓</text>

          <rect x="900" y="22" width="120" height="30" rx="6" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="960" y="41" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">View PDF</text>
        </g>

        <!-- Slot 4: Institute Bonafide Certificate (Requires Attestation) -->
        <g transform="translate(0, 334)">
          <rect width="1040" height="74" rx="10" fill="#FFFBEB" stroke="#FDE68A" />
          <circle cx="36" cy="37" r="18" fill="#FEF3C7" />
          ${I.clock(26, 27, '#D97706', 20)}
          
          <text x="70" y="30" font-size="13" font-weight="800" fill="#0F172A">BIT Mesra Bonafide &amp; Fee Receipt (Current Year)</text>
          <text x="70" y="48" font-size="11" fill="#B45309">Uploaded copy: bit_mesra_fee_2026.pdf (1.2 MB) · Awaiting Nodal Officer Stamp</text>

          <rect x="740" y="24" width="140" height="26" rx="13" fill="#FEF3C7" />
          <text x="810" y="41" font-size="10" font-weight="800" fill="#B45309" class="badge">UPLOADED ✓</text>

          <rect x="900" y="22" width="120" height="30" rx="6" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="960" y="41" font-size="11" font-weight="700" fill="#334155" text-anchor="middle">Replace File</text>
        </g>

        <!-- Drag & Drop Upload Zone -->
        <g transform="translate(0, 424)">
          <rect width="1040" height="84" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-dasharray="4 4" />
          ${I.upload(500, 442, '#047857', 24)}
          <text x="520" y="480" font-size="12" font-weight="700" fill="#0F172A" text-anchor="middle">Drop additional documents here, or <tspan fill="#047857" text-decoration="underline">browse files</tspan></text>
          <text x="520" y="496" font-size="10" fill="#64748B" text-anchor="middle">Supports PDF, JPEG, PNG up to 5MB · Cryptographically sealed upon upload</text>
        </g>

        <!-- Navigation Buttons -->
        <g transform="translate(0, 534)">
          <line x1="0" y1="0" x2="1040" y2="0" stroke="#F1F5F9" />
          
          <rect x="0" y="20" width="160" height="42" rx="8" fill="#F1F5F9" />
          <text x="80" y="46" font-size="12" font-weight="700" fill="#475569" text-anchor="middle">← Back to Step 1</text>

          <rect x="820" y="20" width="220" height="42" rx="8" fill="url(#brandGrad)" />
          <text x="930" y="46" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">Continue to Step 3: Review →</text>
        </g>
      </g>
    </g>

  </g>
</svg>`;
}

// =============================================================
// SCREEN 06: Application Flow - Step 3: Check Answers & Submit
// =============================================================
function make06ApplicationFlowStep3CheckAnswers() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('scholar/apply/step3', 'Tribe Saarthi · Step 3: Check Answers')}
  ${renderSidebar('apps', 'student')}
  ${renderHeader('Apply for Scholarship', 'Step 3 of 3: Check Answers & Solemn Legal Declaration', 'student')}

  <g transform="translate(274, 120)">
    
    <!-- 3-Step Stepper -->
    <g filter="url(#cardShadow)">
      <rect width="1142" height="74" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
      <line x1="180" y1="36" x2="960" y2="36" stroke="#059669" stroke-width="3" stroke-linecap="round" />
      
      <g transform="translate(180, 22)">
        <circle cx="14" cy="14" r="14" fill="#047857" />
        ${I.check(9, 9, '#FFFFFF', 10)}
        <text x="38" y="18" font-size="12" font-weight="700" fill="#0F172A">Personal Details ✓</text>
      </g>

      <g transform="translate(520, 22)">
        <circle cx="14" cy="14" r="14" fill="#047857" />
        ${I.check(9, 9, '#FFFFFF', 10)}
        <text x="38" y="18" font-size="12" font-weight="700" fill="#0F172A">Documents Verified ✓</text>
      </g>

      <g transform="translate(840, 22)">
        <circle cx="14" cy="14" r="14" fill="url(#brandGrad)" />
        <text x="14" y="19" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">3</text>
        <text x="38" y="18" font-size="12" font-weight="800" fill="#047857">Check Answers &amp; Submit</text>
      </g>
    </g>

    <!-- Review Answers Table (GOV.UK Check Answers Pattern) -->
    <g transform="translate(0, 94)" filter="url(#heroShadow)">
      <rect width="1142" height="690" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      
      <g transform="translate(40, 28)">
        <text x="0" y="24" font-size="20" font-weight="800" fill="#0F172A">Check your answers before submitting</text>
        <text x="0" y="44" font-size="12" fill="#64748B">Review your application details. You can change any section before final submission.</text>

        <!-- Check Answers Table -->
        <g transform="translate(0, 64)">
          <!-- Row 1: Personal Details -->
          <line x1="0" y1="0" x2="1040" y2="0" stroke="#E2E8F0" />
          <text x="0" y="24" font-size="12" font-weight="700" fill="#64748B">Personal Details</text>
          <text x="240" y="24" font-size="12" font-weight="700" fill="#0F172A">Mohan Birhor · DOB: 14/08/2004 · Male · APAAR: 9482-1049-5821</text>
          <text x="980" y="24" font-size="11" font-weight="800" fill="#047857">Change</text>

          <!-- Row 2: Tribal & Domicile -->
          <line x1="0" y1="44" x2="1040" y2="44" stroke="#E2E8F0" />
          <text x="0" y="68" font-size="12" font-weight="700" fill="#64748B">Tribal &amp; Domicile</text>
          <text x="240" y="68" font-size="12" font-weight="700" fill="#0F172A">Scheduled Tribe: Birhor (PVTG Tier-1 Priority) · Latehar, Jharkhand</text>
          <text x="980" y="68" font-size="11" font-weight="800" fill="#047857">Change</text>

          <!-- Row 3: Academic Institution -->
          <line x1="0" y1="88" x2="1040" y2="88" stroke="#E2E8F0" />
          <text x="0" y="112" font-size="12" font-weight="700" fill="#64748B">Academic Enrollment</text>
          <text x="240" y="112" font-size="12" font-weight="700" fill="#0F172A">Birla Institute of Technology (BIT Mesra) · B.Tech CSE (2nd Year)</text>
          <text x="980" y="112" font-size="11" font-weight="800" fill="#047857">Change</text>

          <!-- Row 4: Annual Income -->
          <line x1="0" y1="132" x2="1040" y2="132" stroke="#E2E8F0" />
          <text x="0" y="156" font-size="12" font-weight="700" fill="#64748B">Family Income</text>
          <text x="240" y="156" font-size="12" font-weight="700" fill="#0F172A">₹1,20,000 / year (Revenue Certificate #REV/2026/84920)</text>
          <text x="980" y="156" font-size="11" font-weight="800" fill="#047857">Change</text>

          <!-- Row 5: Supporting Documents -->
          <line x1="0" y1="176" x2="1040" y2="176" stroke="#E2E8F0" />
          <text x="0" y="200" font-size="12" font-weight="700" fill="#64748B">Attached Documents</text>
          <text x="240" y="200" font-size="12" font-weight="700" fill="#0F172A">4 Verified Credentials (ST Certificate, Income, Marksheet, Bonafide)</text>
          <text x="980" y="200" font-size="11" font-weight="800" fill="#047857">Change</text>

          <!-- Row 6: Bank Account DBT -->
          <line x1="0" y1="220" x2="1040" y2="220" stroke="#E2E8F0" />
          <text x="0" y="244" font-size="12" font-weight="700" fill="#64748B">Disbursement Bank</text>
          <text x="240" y="244" font-size="12" font-weight="700" fill="#0F172A">Bank of India · Mesra Branch (Aadhaar Seeded NPCI Active)</text>
          <text x="980" y="244" font-size="11" font-weight="800" fill="#047857">Change</text>
          <line x1="0" y1="264" x2="1040" y2="264" stroke="#E2E8F0" />
        </g>

        <!-- Solemn Tribal Legal Declaration Box -->
        <g transform="translate(0, 360)">
          <rect width="1040" height="136" rx="10" fill="#F8FAFC" stroke="#CBD5E1" />
          
          <!-- Checkbox Checked -->
          <rect x="24" y="24" width="22" height="22" rx="4" fill="#047857" />
          ${I.check(27, 27, '#FFFFFF', 16)}

          <text x="58" y="38" font-size="13" font-weight="800" fill="#0F172A">Solemn Tribal Legal Declaration</text>
          <text x="58" y="60" font-size="11" fill="#475569" width="940">
            I hereby solemnly declare under penalty of perjury that I belong to the Birhor Scheduled Tribe community of Jharkhand.
          </text>
          <text x="58" y="76" font-size="11" fill="#475569">
            All submitted credentials and certificates are authentic and cryptographically signed. I understand that any misrepresentation will lead to statutory recovery
          </text>
          <text x="58" y="92" font-size="11" fill="#475569">
            under the Ministry of Tribal Affairs Guidelines and immediate cancellation of all current and future scholarships.
          </text>
        </g>

        <!-- Submission Buttons -->
        <g transform="translate(0, 526)">
          <line x1="0" y1="0" x2="1040" y2="0" stroke="#F1F5F9" />
          
          <rect x="0" y="20" width="160" height="42" rx="8" fill="#F1F5F9" />
          <text x="80" y="46" font-size="12" font-weight="700" fill="#475569" text-anchor="middle">← Back to Edit</text>

          <rect x="790" y="20" width="250" height="42" rx="8" fill="url(#brandGrad)" filter="url(#cardShadow)" />
          <text x="915" y="46" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle">Submit Application Online ✓</text>
        </g>
      </g>
    </g>

  </g>
</svg>`;
}

// =============================================================
// SCREEN 07: Application Lifecycle Tracker (Vertical Timeline)
// =============================================================
function make07ApplicationLifecycleTracker() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('scholar/applications/JH-ST-2026-89412', 'Tribe Saarthi · Application Lifecycle Tracker')}
  ${renderSidebar('apps', 'student')}
  ${renderHeader('Application Lifecycle Tracker', 'Detailed decision timeline and cryptographic milestone records for Application #JH-ST-2026-89412', 'student')}

  <g transform="translate(274, 120)">
    
    <!-- Top Summary Banner -->
    <g filter="url(#heroShadow)">
      <rect width="1142" height="96" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(28, 20)">
        <text x="0" y="16" font-size="16" font-weight="800" fill="#0F172A">Post-Matric Scholarship for ST Students (2026-27)</text>
        <text x="0" y="36" font-size="11" fill="#64748B">Beneficiary: <tspan font-weight="700" fill="#0F172A">Mohan Birhor</tspan> · Scheme Code: <tspan class="mono">MOTA-PMS-ST-2026</tspan> · Submitted: 12 Oct 2026, 02:22 PM</text>

        <rect x="740" y="6" width="180" height="32" rx="16" fill="#FFFBEB" stroke="#FDE68A" />
        <circle cx="754" cy="22" r="4" fill="#D97706" />
        <text x="764" y="26" font-size="10.5" font-weight="800" fill="#B45309">STAGE 2: COLLEGE REVIEW</text>

        <rect x="940" y="4" width="160" height="36" rx="8" fill="url(#brandGrad)" />
        ${I.download(952, 13, '#FFFFFF', 18)}
        <text x="1030" y="27" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">Receipt PDF</text>
      </g>
    </g>

    <!-- Split Content: Vertical Stepper (720px) & Summary Cards (400px) -->
    <g transform="translate(0, 116)">
      <!-- Left Panel: Detailed Vertical Decision Timeline -->
      <g filter="url(#cardShadow)">
        <rect width="720" height="660" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        
        <g transform="translate(32, 28)">
          <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">Application Decision Milestones</text>
          <text x="0" y="34" font-size="11" fill="#64748B">Immutable record of statutory verifications and government actions</text>

          <!-- Vertical Timeline Track -->
          <line x1="20" y1="74" x2="20" y2="520" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round" />
          <line x1="20" y1="74" x2="20" y2="240" stroke="#059669" stroke-width="3" stroke-linecap="round" />

          <!-- Milestone 1: Done -->
          <g transform="translate(0, 70)">
            <circle cx="20" cy="14" r="14" fill="#047857" />
            ${I.check(13, 7, '#FFFFFF', 14)}
            <text x="48" y="14" font-size="13" font-weight="800" fill="#0F172A">Application Submitted &amp; Digitally Sealed</text>
            <text x="48" y="30" font-size="11" fill="#64748B">Online submission authenticated via Aadhaar OTP. Form payload sealed with SHA-256 hash.</text>
            <text x="48" y="46" font-size="10" font-weight="600" fill="#059669" class="mono">12 Oct 2026 · 02:22 PM · Digest: e3b0c44298fc...</text>
          </g>

          <!-- Milestone 2: Done -->
          <g transform="translate(0, 154)">
            <circle cx="20" cy="14" r="14" fill="#047857" />
            ${I.check(13, 7, '#FFFFFF', 14)}
            <text x="48" y="14" font-size="13" font-weight="800" fill="#0F172A">Automated Multi-Registry Cross-Checks Passed</text>
            <text x="48" y="30" font-size="11" fill="#64748B">UIDAI demographic vault, State e-District ST database, and Revenue Income certified.</text>
            <text x="48" y="46" font-size="10" font-weight="600" fill="#059669" class="mono">12 Oct 2026 · 02:23 PM · 3/3 Automated Registries Cleared ✓</text>
          </g>

          <!-- Milestone 3: Active (College Nodal Review) -->
          <g transform="translate(0, 238)">
            <circle cx="20" cy="14" r="16" fill="url(#amberGrad)" />
            <circle cx="20" cy="14" r="22" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="3 3" />
            ${I.clock(11, 5, '#FFFFFF', 18)}
            <text x="52" y="14" font-size="13" font-weight="800" fill="#B45309">Institute Nodal Officer Verification (Current Stage)</text>
            <text x="52" y="30" font-size="11" fill="#0F172A">Assigned Reviewer: <tspan font-weight="700">Dr. K. Soren</tspan> (BIT Mesra Nodal Desk)</text>
            <text x="52" y="46" font-size="11" fill="#64748B">Verifying academic roll #2024-CSE-104 and hostel fee schedule. SLA target: 48h.</text>
            <rect x="52" y="56" width="130" height="22" rx="11" fill="#FEF3C7" />
            <text x="117" y="71" font-size="9" font-weight="800" fill="#B45309" class="badge">ACTIVE REVIEW</text>
          </g>

          <!-- Milestone 4: Upcoming -->
          <g transform="translate(0, 344)">
            <circle cx="20" cy="14" r="13" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" />
            <text x="20" y="18" font-size="10" font-weight="700" fill="#64748B" text-anchor="middle">4</text>
            <text x="48" y="14" font-size="13" font-weight="700" fill="#64748B">District Welfare Officer Sanction Endorsement</text>
            <text x="48" y="30" font-size="11" fill="#94A3B8">Latehar District Welfare Office · Statutory expenditure concurrence.</text>
            <text x="48" y="44" font-size="10" fill="#94A3B8">Estimated Date: 20 Oct 2026</text>
          </g>

          <!-- Milestone 5: Upcoming -->
          <g transform="translate(0, 424)">
            <circle cx="20" cy="14" r="13" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" />
            <text x="20" y="18" font-size="10" font-weight="700" fill="#64748B" text-anchor="middle">5</text>
            <text x="48" y="14" font-size="13" font-weight="700" fill="#64748B">MoTA Central Sanction &amp; PFMS Direct Bank Transfer</text>
            <text x="48" y="30" font-size="11" fill="#94A3B8">Direct credit of ₹132,000 into Bank of India Aadhaar-seeded savings account.</text>
            <text x="48" y="44" font-size="10" fill="#94A3B8">Aadhaar Reference: •••• •••• 4921</text>
          </g>
        </g>
      </g>

      <!-- Right Panel: Application Context & Action Support (400px) -->
      <g transform="translate(742, 0)">
        <!-- Card 1: Scheme Sanction Summary with Component Library Donut & Stepper -->
        <g filter="url(#cardShadow)">
          <rect width="400" height="340" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="14" font-weight="800" fill="#0F172A">Sanction Financial Breakdown</text>
            <line x1="0" y1="30" x2="352" y2="30" stroke="#F1F5F9" />

            <!-- Donut Chart Component -->
            <g transform="translate(0, 40)">
              ${renderDonutChartComponent({
                cx: 64,
                cy: 54,
                rOut: 48,
                rIn: 30,
                segments: [
                  { label: 'Tuition Fees', percent: 74, color: '#047857', amount: '₹98K' },
                  { label: 'Maintenance', percent: 18, color: '#2563EB', amount: '₹24K' },
                  { label: 'PVTG Book Grant', percent: 8, color: '#F59E0B', amount: '₹10K' }
                ],
                centerValue: '₹132K',
                centerSub: '100% Grant',
                legendX: 136,
                legendY: 18,
                legendWidth: 216,
                itemHeight: 26
              })}
            </g>

            <!-- DBT Disbursement Pathway Component -->
            <g transform="translate(0, 168)">
              <rect width="352" height="110" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
              <text x="14" y="20" font-size="10.5" font-weight="800" fill="#047857">DBT DISBURSEMENT PIPELINE</text>
              ${renderStepperPipelineComponent({
                x: 10,
                y: 30,
                width: 332,
                steps: [
                  { title: 'College Desk', sub: 'Verified ✓', status: 'done', badge: 'PASSED' },
                  { title: 'Dist Treasury', sub: 'Concurred ✓', status: 'done', badge: 'PASSED' },
                  { title: 'PFMS DBT', sub: 'Queue Active', status: 'active', badge: 'PENDING' }
                ]
              })}
            </g>

            <!-- Target Bank -->
            <g transform="translate(0, 288)">
              <rect width="352" height="34" rx="8" fill="#ECFDF5" stroke="#A7F3D0" />
              <text x="12" y="22" font-size="11" font-weight="600" fill="#065F46">Target Account: <tspan font-weight="800" fill="#047857">Bank of India · ••••••••9012 (Aadhaar Seeded)</tspan></text>
            </g>
          </g>
        </g>

        <!-- Card 2: Officer Contact & Grievance Support -->
        <g transform="translate(0, 360)" filter="url(#cardShadow)">
          <rect width="400" height="240" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
          <g transform="translate(24, 20)">
            <text x="0" y="16" font-size="14" font-weight="800" fill="#0F172A">Assigned Nodal Desk</text>
            <line x1="0" y1="30" x2="352" y2="30" stroke="#F1F5F9" />

            <g transform="translate(0, 44)">
              <circle cx="20" cy="20" r="20" fill="url(#brandGrad)" />
              <text x="20" y="24" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">KS</text>
              <text x="50" y="16" font-size="13" font-weight="800" fill="#0F172A">Dr. K. Soren</text>
              <text x="50" y="32" font-size="11" fill="#64748B">Associate Professor &amp; ST Welfare Officer · BIT Mesra</text>

              <rect x="0" y="60" width="352" height="54" rx="8" fill="#F0FDF4" stroke="#BBF7D0" />
              <text x="12" y="82" font-size="11" font-weight="700" fill="#047857">Physical Verification Desk Open</text>
              <text x="12" y="98" font-size="10" fill="#475569">Administrative Block, Room 104 · Mon–Fri, 10:00 AM – 4:00 PM</text>

              <rect x="0" y="128" width="352" height="38" rx="8" fill="#F1F5F9" />
              <text x="176" y="152" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">Raise Query with Nodal Officer →</text>
            </g>
          </g>
        </g>
      </g>

    </g>

  </g>
</svg>`;
}

function make08DigiLockerDocumentWallet() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('scholar/wallet', 'Tribe Saarthi · DigiLocker Document Wallet')}
  ${renderSidebar('documents', 'student')}
  ${renderHeader('DigiLocker Document Vault', 'Reusable, cryptographically verified credentials linked to central and state registries', 'student')}

  <g transform="translate(274, 120)">
    
    <!-- Top Sync & Vault Status Bar -->
    <g filter="url(#heroShadow)">
      <rect width="1142" height="80" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(28, 18)">
        <circle cx="22" cy="22" r="22" fill="#ECFDF5" />
        ${I.shield(12, 12, '#047857', 20)}
        <text x="56" y="18" font-size="15" font-weight="800" fill="#0F172A">DigiLocker Central Gateway Connected</text>
        <text x="56" y="36" font-size="11" fill="#64748B">Token ID: <tspan class="mono">DL-AUTH-90412</tspan> · Last sync: 12 minutes ago · 4 / 4 Mandatory Documents Verified</text>

        <!-- Sync Button -->
        <rect x="940" y="6" width="160" height="36" rx="8" fill="url(#brandGrad)" />
        ${I.sync(954, 15, '#FFFFFF', 18)}
        <text x="1030" y="29" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">Sync All Vault Docs</text>
      </g>
    </g>

    <!-- 4 Document Cards in 2x2 Grid -->
    <g transform="translate(0, 102)">
      <!-- Doc 1: ST Caste Certificate -->
      <g filter="url(#cardShadow)">
        <rect width="556" height="240" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 22)">
          <rect x="0" y="0" width="130" height="24" rx="12" fill="#ECFDF5" />
          <text x="65" y="16" font-size="10" font-weight="800" fill="#047857" class="badge">DIGILOCKER SEAL ✓</text>

          <text x="0" y="48" font-size="15" font-weight="800" fill="#0F172A">Scheduled Tribe Caste Certificate</text>
          <text x="0" y="66" font-size="11" fill="#64748B">Birhor Community · Particularly Vulnerable Tribal Group (PVTG)</text>

          <g transform="translate(0, 84)">
            <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">ISSUING AUTHORITY</text>
            <text x="0" y="30" font-size="12" font-weight="700" fill="#0F172A">SDO Latehar, Govt. of Jharkhand</text>

            <text x="260" y="14" font-size="10.5" font-weight="700" fill="#64748B">CERTIFICATE NO.</text>
            <text x="260" y="30" font-size="12" font-weight="600" fill="#0F172A" class="mono">JH/ST/2022/4910</text>

            <text x="0" y="58" font-size="10" fill="#94A3B8" class="mono">SHA-256: 7b3a9c42...901e (Matched)</text>
          </g>

          <line x1="0" y1="160" x2="508" y2="160" stroke="#F1F5F9" />

          <rect x="0" y="170" width="140" height="32" rx="6" fill="#F1F5F9" />
          <text x="70" y="191" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">View PDF Document</text>

          <rect x="154" y="170" width="130" height="32" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
          <text x="219" y="191" font-size="11" font-weight="600" fill="#64748B" text-anchor="middle">Share with Officer</text>
        </g>
      </g>

      <!-- Doc 2: Income Certificate -->
      <g transform="translate(586, 0)" filter="url(#cardShadow)">
        <rect width="556" height="240" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 22)">
          <rect x="0" y="0" width="130" height="24" rx="12" fill="#ECFDF5" />
          <text x="65" y="16" font-size="10" font-weight="800" fill="#047857" class="badge">DIGILOCKER SEAL ✓</text>

          <text x="0" y="48" font-size="15" font-weight="800" fill="#0F172A">Annual Family Income Certificate</text>
          <text x="0" y="66" font-size="11" fill="#64748B">Verified Annual Income: ₹1,20,000 · Non-Creamy Layer</text>

          <g transform="translate(0, 84)">
            <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">ISSUING AUTHORITY</text>
            <text x="0" y="30" font-size="12" font-weight="700" fill="#0F172A">Revenue Department, Latehar</text>

            <text x="260" y="14" font-size="10.5" font-weight="700" fill="#64748B">VALIDITY PERIOD</text>
            <text x="260" y="30" font-size="12" font-weight="700" fill="#047857">Valid till 31 Mar 2027</text>

            <text x="0" y="58" font-size="10" fill="#94A3B8" class="mono">SHA-256: 4f12dc88...1142 (Matched)</text>
          </g>

          <line x1="0" y1="160" x2="508" y2="160" stroke="#F1F5F9" />

          <rect x="0" y="170" width="140" height="32" rx="6" fill="#F1F5F9" />
          <text x="70" y="191" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">View PDF Document</text>

          <rect x="154" y="170" width="130" height="32" rx="6" fill="#FFFFFF" stroke="#E2E8F0" />
          <text x="219" y="191" font-size="11" font-weight="600" fill="#64748B" text-anchor="middle">Share with Officer</text>
        </g>
      </g>

      <!-- Doc 3: APAAR Digital Student Identity -->
      <g transform="translate(0, 260)" filter="url(#cardShadow)">
        <rect width="556" height="240" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 22)">
          <rect x="0" y="0" width="130" height="24" rx="12" fill="#ECFDF5" />
          <text x="65" y="16" font-size="10" font-weight="800" fill="#047857" class="badge">DIGILOCKER SEAL ✓</text>

          <text x="0" y="48" font-size="15" font-weight="800" fill="#0F172A">APAAR / Academic Bank of Credits ID</text>
          <text x="0" y="66" font-size="11" fill="#64748B">National Academic Depository · Ministry of Education</text>

          <g transform="translate(0, 84)">
            <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">APAAR ID NUMBER</text>
            <text x="0" y="30" font-size="13" font-weight="700" fill="#0F172A" class="mono">9482-1049-5821</text>

            <text x="260" y="14" font-size="10.5" font-weight="700" fill="#64748B">ENROLLED COLLEGE</text>
            <text x="260" y="30" font-size="12" font-weight="700" fill="#0F172A">BIT Mesra (Roll: 2024-CSE-104)</text>

            <text x="0" y="58" font-size="10" fill="#94A3B8" class="mono">QR Digest: Verified against NAD central server</text>
          </g>

          <line x1="0" y1="160" x2="508" y2="160" stroke="#F1F5F9" />

          <rect x="0" y="170" width="140" height="32" rx="6" fill="#F1F5F9" />
          <text x="70" y="191" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">View PDF Document</text>
        </g>
      </g>

      <!-- Doc 4: Marksheet -->
      <g transform="translate(586, 260)" filter="url(#cardShadow)">
        <rect width="556" height="240" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 22)">
          <rect x="0" y="0" width="130" height="24" rx="12" fill="#ECFDF5" />
          <text x="65" y="16" font-size="10" font-weight="800" fill="#047857" class="badge">DIGILOCKER SEAL ✓</text>

          <text x="0" y="48" font-size="15" font-weight="800" fill="#0F172A">Senior Secondary (Class 12) Marksheet</text>
          <text x="0" y="66" font-size="11" fill="#64748B">Science Stream · Aggregate: 82.4% · Distinction in Mathematics</text>

          <g transform="translate(0, 84)">
            <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">EDUCATION BOARD</text>
            <text x="0" y="30" font-size="12" font-weight="700" fill="#0F172A">Jharkhand Academic Council (JAC)</text>

            <text x="260" y="14" font-size="10.5" font-weight="700" fill="#64748B">ROLL CODE &amp; NUMBER</text>
            <text x="260" y="30" font-size="12" font-weight="600" fill="#0F172A" class="mono">23014 · 10492</text>

            <text x="0" y="58" font-size="10" fill="#94A3B8" class="mono">SHA-256: 8a90bb12...7741 (Verified)</text>
          </g>

          <line x1="0" y1="160" x2="508" y2="160" stroke="#F1F5F9" />

          <rect x="0" y="170" width="140" height="32" rx="6" fill="#F1F5F9" />
          <text x="70" y="191" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">View PDF Document</text>
        </g>
      </g>
    </g>

    <!-- Bottom Upload Fallback Box -->
    <g transform="translate(0, 620)" filter="url(#cardShadow)">
      <rect width="1142" height="74" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-dasharray="4 4" />
      ${I.upload(36, 642, '#047857', 22)}
      <text x="72" y="652" font-size="12" font-weight="700" fill="#0F172A">Need to upload a document not available in DigiLocker?</text>
      <text x="72" y="668" font-size="11" fill="#64748B">You can upload institutional bonafides, hostel fee slips, or special disability certificates for manual officer attestation.</text>
      
      <rect x="940" y="638" width="160" height="34" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
      <text x="1020" y="659" font-size="11" font-weight="700" fill="#0F172A" text-anchor="middle">Upload File Manually</text>
    </g>

  </g>
</svg>`;
}

// =============================================================
// SCREEN 09: Help & Saarthi Conversational Assistant
// =============================================================
function make09HelpAndSaarthiAssistant() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('scholar/help', 'Tribe Saarthi · Multilingual Help & Saarthi Assistant')}
  ${renderSidebar('help', 'student')}
  ${renderHeader('Help & Saarthi Assistant', 'Conversational support in Santhali, Hindi, English, and Odia with human officer escalation', 'student')}

  <g transform="translate(274, 120)">
    
    <!-- Split Screen: Left (680px) = Saarthi Chat / Right (440px) = Tickets & Helpline -->
    <!-- Left: Saarthi AI Assistant Chat Window -->
    <g filter="url(#heroShadow)">
      <rect width="680" height="780" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      
      <!-- Chat Header -->
      <g transform="translate(24, 20)">
        <circle cx="20" cy="20" r="20" fill="url(#brandGrad)" />
        ${I.help(10, 10, '#FDE68A', 20)}
        <text x="52" y="18" font-size="15" font-weight="800" fill="#0F172A">Saarthi Multilingual Assistant</text>
        <text x="52" y="34" font-size="11" fill="#047857" font-weight="600">● Live · Ministry AI trained on MoTA &amp; State ST Guidelines</text>

        <!-- Language Switcher Tabs inside Chat -->
        <g transform="translate(360, 6)">
          <rect width="270" height="28" rx="14" fill="#F1F5F9" />
          <text x="32" y="18" font-size="10" font-weight="800" fill="#047857">English</text>
          <text x="88" y="18" font-size="10" font-weight="600" fill="#64748B">हिंदी</text>
          <text x="146" y="18" font-size="10" font-weight="600" fill="#64748B">ᱥᱟᱱᱛᱟᱲᱤ</text>
          <text x="228" y="18" font-size="10" font-weight="600" fill="#64748B">ଓଡ଼ିଆ</text>
        </g>
      </g>
      <line x1="0" y1="74" x2="680" y2="74" stroke="#F1F5F9" />

      <!-- Chat Transcript Area -->
      <g transform="translate(24, 94)">
        
        <!-- Assistant Message 1 -->
        <g>
          <rect width="520" height="64" rx="12" fill="#F8FAFC" stroke="#E2E8F0" />
          <text x="18" y="24" font-size="12" font-weight="600" fill="#0F172A">Johar Mohan! How can I assist you with your tribal scholarship today?</text>
          <text x="18" y="44" font-size="11" fill="#64748B">I can answer questions in English, Hindi, Santhali, or Odia about eligibility, deadlines, and DBT status.</text>
          <text x="470" y="54" font-size="9" fill="#94A3B8" class="mono">10:41 AM</text>
        </g>

        <!-- User Message -->
        <g transform="translate(112, 84)">
          <rect width="520" height="48" rx="12" fill="url(#brandGrad)" />
          <text x="20" y="28" font-size="12" font-weight="700" fill="#FFFFFF">When will my ₹132,000 scholarship amount be credited to my account?</text>
          <text x="470" y="38" font-size="9" fill="#D1FAE5" class="mono">10:42 AM</text>
        </g>

        <!-- Assistant Message 2 (Detailed Structured Response) -->
        <g transform="translate(0, 152)">
          <rect width="600" height="236" rx="12" fill="#F8FAFC" stroke="#E2E8F0" />
          <g transform="translate(18, 20)">
            <text x="0" y="14" font-size="12" font-weight="700" fill="#0F172A">Here is the exact status of Application #JH-ST-2026-89412:</text>
            
            <text x="0" y="42" font-size="11.5" fill="#334155">1. <tspan font-weight="700">College Nodal Review (Current):</tspan> In review by Dr. K. Soren at BIT Mesra. Expected completion: 2 days.</text>
            <text x="0" y="66" font-size="11.5" fill="#334155">2. <tspan font-weight="700">District Welfare Sanction:</tspan> Once college signs off, Latehar welfare office takes ~3 working days.</text>
            <text x="0" y="90" font-size="11.5" fill="#334155">3. <tspan font-weight="700">PFMS Direct Bank Transfer:</tspan> Funds will disburse directly to your Bank of India Aadhaar-seeded account.</text>

            <rect x="0" y="112" width="560" height="44" rx="8" fill="#ECFDF5" stroke="#A7F3D0" />
            <text x="14" y="132" font-size="11" font-weight="700" fill="#047857">Estimated Bank Credit: Between 24 Oct and 28 Oct 2026</text>
            <text x="14" y="146" font-size="10" fill="#065F46">You will receive an automated SMS confirmation on +91 94311 ••••• upon transfer.</text>

            <!-- Quick Action Links -->
            <rect x="0" y="170" width="180" height="30" rx="6" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="90" y="189" font-size="10.5" font-weight="700" fill="#047857" text-anchor="middle">Open Lifecycle Tracker →</text>

            <rect x="194" y="170" width="180" height="30" rx="6" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="284" y="189" font-size="10.5" font-weight="700" fill="#64748B" text-anchor="middle">Check Bank DBT Seeding</text>
          </g>
        </g>
      </g>

      <!-- Input Bar (Fixed Bottom) -->
      <g transform="translate(24, 706)">
        <rect width="632" height="52" rx="10" fill="#F8FAFC" stroke="#CBD5E1" />
        <text x="18" y="31" font-size="12" fill="#94A3B8">Ask a question in your preferred language or type query...</text>
        
        <circle cx="560" cy="26" r="16" fill="#F1F5F9" />
        ${I.mic(551, 17, '#64748B', 18)}

        <circle cx="602" cy="26" r="16" fill="url(#brandGrad)" />
        ${I.send(593, 17, '#FFFFFF', 18)}
      </g>
    </g>

    <!-- Right Side (440px): Grievance Tickets & Helpline Directory -->
    <g transform="translate(704, 0)">
      
      <!-- Card 1: Active Support Tickets -->
      <g filter="url(#cardShadow)">
        <rect width="438" height="360" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">Active Support &amp; Grievance Tickets</text>
          <text x="0" y="32" font-size="11" fill="#64748B">Track formal disputes and officer resolutions</text>

          <!-- Ticket 1 -->
          <g transform="translate(0, 52)">
            <rect width="390" height="96" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <g transform="translate(16, 16)">
              <rect x="0" y="0" width="80" height="20" rx="10" fill="#ECFDF5" />
              <text x="40" y="13" font-size="9" font-weight="800" fill="#047857" class="badge">RESOLVED ✓</text>

              <text x="92" y="14" font-size="11" font-weight="700" fill="#64748B" class="mono">#TS-GR-1049</text>
              <text x="0" y="38" font-size="12" font-weight="700" fill="#0F172A">Aadhaar name spacing vs Marksheet mismatch</text>
              <text x="0" y="54" font-size="10.5" fill="#64748B">Resolved by Dr. K. Soren via secondary manual attestation.</text>
              <text x="0" y="68" font-size="9.5" fill="#94A3B8">Closed on 15 Oct 2026</text>
            </g>
          </g>

          <!-- New Grievance Button -->
          <rect x="0" y="166" width="390" height="42" rx="8" fill="url(#brandGrad)" />
          <text x="195" y="192" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">File New Formal Grievance Ticket +</text>

          <!-- Notice -->
          <text x="0" y="234" font-size="10.5" fill="#64748B">Under MoTA Service Standards, all grievances receive mandatory officer response within 7 working days.</text>
        </g>
      </g>

      <!-- Card 2: Dedicated Toll-Free Helplines -->
      <g transform="translate(0, 384)" filter="url(#cardShadow)">
        <rect width="438" height="396" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">MoTA Tribal Helplines</text>
          <text x="0" y="32" font-size="11" fill="#64748B">Free phone assistance in tribal and regional languages</text>

          <g transform="translate(0, 52)">
            <rect width="390" height="74" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <g transform="translate(16, 16)">
              <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">CENTRAL MoTA TOLL-FREE</text>
              <text x="0" y="34" font-size="16" font-weight="900" fill="#047857" class="mono">1800-11-7788</text>
              <text x="0" y="48" font-size="10" fill="#64748B">9:00 AM – 6:00 PM, Mon–Sat · English, Hindi &amp; Santhali</text>
            </g>
          </g>

          <g transform="translate(0, 138)">
            <rect width="390" height="74" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <g transform="translate(16, 16)">
              <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">JHARKHAND STATE ST HELPLINE</text>
              <text x="0" y="34" font-size="16" font-weight="900" fill="#0F172A" class="mono">1800-345-6543</text>
              <text x="0" y="48" font-size="10" fill="#64748B">Welfare Dept. Helpline · Ranchi Call Center</text>
            </g>
          </g>

          <g transform="translate(0, 224)">
            <rect width="390" height="74" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <g transform="translate(16, 16)">
              <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">BIT MESRA NODAL HELPDESK</text>
              <text x="0" y="34" font-size="16" font-weight="900" fill="#2563EB" class="mono">0651-227-5444</text>
              <text x="0" y="48" font-size="10" fill="#64748B">Ext. 204 (Dean Student Welfare Desk)</text>
            </g>
          </g>
        </g>
      </g>

    </g>

  </g>
</svg>`;
}

// =============================================================
// SCREEN 10: Student Profile & PVTG Identity
// =============================================================
function make10StudentProfileAndPvtg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('scholar/profile', 'Tribe Saarthi · Scholar Profile &amp; PVTG Identity')}
  ${renderSidebar('profile', 'student')}
  ${renderHeader('Scholar Demographic Profile', 'Verified identity, tribal community classification, and banking integration', 'student')}

  <g transform="translate(274, 120)">
    
    <!-- Top Hero Scholar Banner -->
    <g filter="url(#heroShadow)">
      <rect width="1142" height="110" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(28, 20)">
        <circle cx="35" cy="35" r="35" fill="url(#brandGrad)" />
        <text x="35" y="42" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle">MB</text>

        <text x="86" y="26" font-size="18" font-weight="800" fill="#0F172A">Mohan Birhor</text>
        <text x="86" y="46" font-size="12" fill="#64748B">Birla Institute of Technology (BIT Mesra) · B.Tech Computer Science (2nd Year)</text>
        <text x="86" y="64" font-size="11" fill="#059669" font-weight="600">Enrolled Roll #2024-CSE-104 · Domicile: Latehar District, Jharkhand</text>

        <rect x="940" y="16" width="160" height="34" rx="8" fill="#F1F5F9" />
        <text x="1020" y="37" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">Request Data Update</text>
      </g>
    </g>

    <!-- Two-Column Profile Details (556px each) -->
    <g transform="translate(0, 130)">
      
      <!-- Left Column: Verified Tribal Demographics with PVTG Grant Allocation Donut -->
      <g filter="url(#cardShadow)">
        <rect width="556" height="520" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">Verified Tribal Demographics</text>
          <text x="0" y="32" font-size="11" fill="#64748B">Certified by Government of Jharkhand &amp; SDO Latehar</text>

          <g transform="translate(0, 48)">
            <!-- Item 1 -->
            <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">TRIBAL COMMUNITY CLASSIFICATION</text>
            <text x="0" y="34" font-size="14" font-weight="800" fill="#0F172A">Birhor Scheduled Tribe</text>
            <rect x="360" y="18" width="140" height="22" rx="11" fill="#FEF3C7" stroke="#FDE68A" />
            <text x="430" y="33" font-size="9" font-weight="800" fill="#92400E" class="badge">PVTG TIER-1 PRIORITY</text>
            <line x1="0" y1="48" x2="508" y2="48" stroke="#F1F5F9" />

            <!-- Item 2 -->
            <text x="0" y="68" font-size="11" font-weight="700" fill="#64748B">DOMICILE RESIDENCE</text>
            <text x="0" y="86" font-size="12.5" font-weight="700" fill="#0F172A">Village: Belta, Block: Mahuadanr, Latehar District, Jharkhand</text>
            <line x1="0" y1="100" x2="508" y2="100" stroke="#F1F5F9" />

            <!-- Item 3 -->
            <text x="0" y="120" font-size="11" font-weight="700" fill="#64748B">FAMILY &amp; GUARDIAN</text>
            <text x="0" y="138" font-size="12.5" font-weight="700" fill="#0F172A">Somra Birhor (Father) · Mobile: +91 94311 •••••</text>
            <line x1="0" y1="152" x2="508" y2="152" stroke="#F1F5F9" />

            <!-- Item 4: Statutory PVTG Entitlements Donut & Component Chips -->
            <g transform="translate(0, 168)">
              <rect width="508" height="240" rx="10" fill="#FEF3C7" stroke="#FDE68A" />
              <g transform="translate(18, 16)">
                <text x="0" y="14" font-size="12" font-weight="800" fill="#92400E">STATUTORY PVTG TIER-1 ENTITLEMENT BREAKDOWN</text>
                <text x="0" y="30" font-size="10.5" fill="#78350F">MoTA Order No. MOTA/PVTG/2026/410 · 100% Comprehensive State Coverage</text>

                <!-- Component Library Donut -->
                <g transform="translate(0, 42)">
                  ${renderDonutChartComponent({
                    cx: 52,
                    cy: 50,
                    rOut: 44,
                    rIn: 26,
                    segments: [
                      { label: 'Full Tuition Grant', percent: 74, color: '#047857', amount: '₹98K' },
                      { label: 'Monthly Maintenance', percent: 18, color: '#2563EB', amount: '₹24K' },
                      { label: 'Special Book Grant', percent: 8, color: '#D97706', amount: '₹10K' }
                    ],
                    centerValue: '100%',
                    centerSub: 'Covered',
                    legendX: 114,
                    legendY: 14,
                    legendWidth: 260,
                    itemHeight: 25
                  })}
                </g>

                <!-- Entitlement Feature Badges -->
                <g transform="translate(0, 162)">
                  <rect x="0" y="0" width="150" height="28" rx="14" fill="#FFFFFF" stroke="#FDE68A" />
                  <text x="75" y="18" font-size="9.5" font-weight="800" fill="#92400E" text-anchor="middle">Zero Parent Contribution</text>

                  <rect x="158" y="0" width="150" height="28" rx="14" fill="#FFFFFF" stroke="#FDE68A" />
                  <text x="233" y="18" font-size="9.5" font-weight="800" fill="#92400E" text-anchor="middle">Monthly Stipend ₹2,000</text>

                  <rect x="316" y="0" width="154" height="28" rx="14" fill="#FFFFFF" stroke="#FDE68A" />
                  <text x="393" y="18" font-size="9.5" font-weight="800" fill="#047857" text-anchor="middle">Direct Aadhaar DBT Credit</text>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>

      <!-- Right Column: Identity Numbers & Bank DBT Seeding -->
      <g transform="translate(586, 0)" filter="url(#cardShadow)">
        <rect width="556" height="520" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 22)">
          <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">National Identity &amp; Banking</text>
          <text x="0" y="32" font-size="11" fill="#64748B">UIDAI Token Vault and Aadhaar-seeded PFMS disbursement</text>

          <g transform="translate(0, 52)">
            <!-- Item 1: Aadhaar -->
            <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">AADHAAR IDENTIFICATION (MASKED)</text>
            <text x="0" y="34" font-size="14" font-weight="800" fill="#0F172A" class="mono">•••• •••• 4921</text>
            <rect x="360" y="18" width="140" height="22" rx="11" fill="#ECFDF5" />
            <text x="430" y="33" font-size="9" font-weight="800" fill="#047857" class="badge">UIDAI VERIFIED ✓</text>
            <line x1="0" y1="50" x2="508" y2="50" stroke="#F1F5F9" />

            <!-- Item 2: APAAR -->
            <text x="0" y="74" font-size="11" font-weight="700" fill="#64748B">ACADEMIC APAAR / ABC ID</text>
            <text x="0" y="94" font-size="14" font-weight="800" fill="#0F172A" class="mono">9482-1049-5821</text>
            <rect x="360" y="78" width="140" height="22" rx="11" fill="#ECFDF5" />
            <text x="430" y="93" font-size="9" font-weight="800" fill="#047857" class="badge">ABC VAULT SYNC ✓</text>
            <line x1="0" y1="110" x2="508" y2="110" stroke="#F1F5F9" />

            <!-- Item 3: Bank Account -->
            <text x="0" y="134" font-size="11" font-weight="700" fill="#64748B">PRIMARY DBT BANK ACCOUNT</text>
            <text x="0" y="154" font-size="14" font-weight="800" fill="#0F172A">Bank of India (Mesra Branch, Ranchi)</text>
            <text x="0" y="172" font-size="11" fill="#64748B">A/C: <tspan class="mono">••••••••9012</tspan> · IFSC: <tspan class="mono">BKID0004910</tspan></text>
            <rect x="360" y="138" width="140" height="22" rx="11" fill="#ECFDF5" />
            <text x="430" y="153" font-size="9" font-weight="800" fill="#047857" class="badge">NPCI SEEDED ✓</text>
            <line x1="0" y1="190" x2="508" y2="190" stroke="#F1F5F9" />

            <!-- Item 4: DigiLocker Link -->
            <text x="0" y="214" font-size="11" font-weight="700" fill="#64748B">DIGILOCKER CONSENT STATUS</text>
            <text x="0" y="234" font-size="13" font-weight="700" fill="#0F172A">Tokenized Direct Read Access</text>
            <text x="0" y="250" font-size="11" fill="#047857">4 of 4 statutory certificates mapped to vault</text>
            <rect x="360" y="218" width="140" height="22" rx="11" fill="#ECFDF5" />
            <text x="430" y="233" font-size="9" font-weight="800" fill="#047857" class="badge">CONSENT ACTIVE ✓</text>
          </g>
        </g>
      </g>

    </g>

  </g>
</svg>`;
}

function make11FamilyAccessConsent() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('scholar/family', 'Tribe Saarthi · Family Access & Consent')}
  ${renderSidebar('family', 'student')}
  ${renderHeader('Family Access & Consent Manager', 'Grant parents or trusted guardians read-only tracking access in regional tribal languages', 'student')}

  <g transform="translate(274, 120)">
    
    <!-- Info Banner -->
    <g filter="url(#heroShadow)">
      <rect width="1142" height="80" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(24, 18)">
        <circle cx="22" cy="22" r="22" fill="#FEF3C7" />
        ${I.users(12, 12, '#D97706', 20)}
        <text x="56" y="18" font-size="15" font-weight="800" fill="#0F172A">Family Read-Only Access Guarantee</text>
        <text x="56" y="36" font-size="11" fill="#64748B">Family members can view application progress and payment alerts via SMS or web without permissions to alter documents or bank details.</text>
      </g>
    </g>

    <!-- Content: Left Active Members (650px) / Right Grant Form (470px) -->
    <g transform="translate(0, 102)">
      <!-- Left: Active Family Members -->
      <g filter="url(#cardShadow)">
        <rect width="650" height="660" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 24)">
          <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">Active Authorized Family Members</text>
          <text x="0" y="34" font-size="11" fill="#64748B">Individuals authorized to track your scholarship</text>

          <!-- Member Card 1 -->
          <g transform="translate(0, 56)">
            <rect width="602" height="136" rx="12" fill="#F8FAFC" stroke="#E2E8F0" />
            <g transform="translate(20, 20)">
              <circle cx="22" cy="22" r="22" fill="url(#brandGrad)" />
              <text x="22" y="27" font-size="13" font-weight="900" fill="#FFFFFF" text-anchor="middle">SB</text>
              
              <text x="56" y="18" font-size="14" font-weight="800" fill="#0F172A">Somra Birhor</text>
              <rect x="160" y="4" width="70" height="20" rx="10" fill="#F1F5F9" />
              <text x="195" y="17" font-size="9" font-weight="700" fill="#475569" class="badge">FATHER</text>

              <rect x="238" y="4" width="60" height="20" rx="10" fill="#ECFDF5" />
              <text x="268" y="17" font-size="9" font-weight="800" fill="#047857" class="badge">ACTIVE ✓</text>

              <text x="56" y="38" font-size="11" fill="#64748B">Mobile: <tspan font-weight="700" fill="#0F172A">+91 94311 •••••</tspan> · Language: <tspan font-weight="700">Santhali / Hindi</tspan></text>
              <text x="56" y="54" font-size="10" fill="#94A3B8">Granted on: 01 Oct 2026 · Access: Read-Only Application Status &amp; SMS Alerts</text>

              <rect x="470" y="58" width="112" height="32" rx="6" fill="#FEE2E2" />
              <text x="526" y="78" font-size="10.5" font-weight="800" fill="#DC2626" text-anchor="middle">Revoke Access</text>
            </g>
          </g>

          <!-- Audit Notice -->
          <g transform="translate(0, 212)">
            <rect width="602" height="74" rx="8" fill="#F0FDF4" stroke="#BBF7D0" />
            <text x="16" y="24" font-size="11" font-weight="700" fill="#047857">Tamper-Evident Consent Logging</text>
            <text x="16" y="42" font-size="10.5" fill="#475569">Every time a guardian accesses your tracking portal or receives an SMS dispatch,</text>
            <text x="16" y="58" font-size="10.5" fill="#475569">an entry is written to your Forensic Activity Log with timestamp and cell ID.</text>
          </g>
        </g>
      </g>

      <!-- Right: Grant New Family Consent Form -->
      <g transform="translate(672, 0)" filter="url(#cardShadow)">
        <rect width="470" height="660" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 24)">
          <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">Grant New Family Consent</text>
          <text x="0" y="34" font-size="11" fill="#64748B">Authorize a new family member via Aadhaar OTP</text>

          <g transform="translate(0, 56)">
            <!-- Input 1 -->
            <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">GUARDIAN FULL NAME</text>
            <rect x="0" y="24" width="422" height="40" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
            <text x="14" y="48" font-size="12" fill="#94A3B8">e.g. Parvati Birhor</text>

            <!-- Input 2 -->
            <g transform="translate(0, 80)">
              <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">RELATIONSHIP</text>
              <rect x="0" y="24" width="422" height="40" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
              <text x="14" y="48" font-size="12" fill="#0F172A">Mother</text>
            </g>

            <!-- Input 3 -->
            <g transform="translate(0, 160)">
              <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">GUARDIAN 10-DIGIT MOBILE NUMBER</text>
              <rect x="0" y="24" width="422" height="40" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
              <text x="14" y="48" font-size="12" fill="#94A3B8">+91 94311 •••••</text>
            </g>

            <!-- Scope Checkboxes -->
            <g transform="translate(0, 240)">
              <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">PERMITTED ACCESS SCOPE</text>

              <rect x="0" y="26" width="18" height="18" rx="4" fill="#047857" />
              ${I.check(2, 28, '#FFFFFF', 14)}
              <text x="28" y="40" font-size="11.5" font-weight="600" fill="#0F172A">SMS alerts for stage approvals &amp; DBT credits</text>

              <rect x="0" y="56" width="18" height="18" rx="4" fill="#047857" />
              ${I.check(2, 58, '#FFFFFF', 14)}
              <text x="28" y="70" font-size="11.5" font-weight="600" fill="#0F172A">Read-only web lifecycle tracking in Santhali/Hindi</text>

              <rect x="0" y="86" width="18" height="18" rx="4" fill="#FFFFFF" stroke="#CBD5E1" />
              <text x="28" y="100" font-size="11.5" fill="#64748B">View certificates &amp; marksheet scans (Optional)</text>
            </g>

            <!-- Button -->
            <g transform="translate(0, 390)">
              <rect width="422" height="44" rx="8" fill="url(#brandGrad)" />
              <text x="211" y="27" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">Send Verification OTP to Guardian →</text>
            </g>
          </g>
        </g>
      </g>
    </g>

  </g>
</svg>`;
}

// =============================================================
// SCREEN 12: Offline Sync Queue (Durable IndexedDB)
// =============================================================
function make12OfflineSyncQueue() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('scholar/offline', 'Tribe Saarthi · Offline Operations Queue')}
  ${renderSidebar('offline', 'student')}
  ${renderHeader('Offline Operations Queue', 'Transactions captured in remote areas are stored in local IndexedDB and synced upon reconnection', 'student')}

  <g transform="translate(274, 120)">
    
    <!-- Network State Card -->
    <g filter="url(#heroShadow)">
      <rect width="1142" height="88" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(24, 20)">
        <circle cx="24" cy="24" r="24" fill="#FEF3C7" />
        ${I.sync(14, 14, '#D97706', 20)}
        <text x="60" y="20" font-size="15" font-weight="800" fill="#0F172A">Simulated Remote Tribal Area · Offline Mode Active</text>
        <text x="60" y="38" font-size="11" fill="#B45309">2 operations queued in browser IndexedDB vault · Auto-sync triggers when network connects</text>

        <rect x="760" y="8" width="160" height="34" rx="8" fill="#F1F5F9" />
        <text x="840" y="29" font-size="11" font-weight="700" fill="#475569" text-anchor="middle">Export Encrypted Backup</text>

        <rect x="936" y="8" width="160" height="34" rx="8" fill="url(#brandGrad)" />
        <text x="1016" y="29" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">Force Sync Queue</text>
      </g>
    </g>

    <!-- Queue Table Card with CRDT Pipeline & Queue Status Donut -->
    <g transform="translate(0, 110)" filter="url(#cardShadow)">
      <rect width="1142" height="660" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(28, 24)">
        <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">Queued Operations Ledger</text>
        <text x="0" y="32" font-size="11" fill="#64748B">IndexedDB storage partition: <tspan class="mono">ts_offline_journal_v2</tspan> · AES-256 local encryption</text>

        <!-- Table Header -->
        <g transform="translate(0, 54)">
          <rect width="1086" height="36" rx="6" fill="#F8FAFC" />
          <text x="16" y="22" font-size="10.5" font-weight="800" fill="#64748B">OP ID</text>
          <text x="110" y="22" font-size="10.5" font-weight="800" fill="#64748B">ACTION TYPE</text>
          <text x="280" y="22" font-size="10.5" font-weight="800" fill="#64748B">PAYLOAD SUMMARY</text>
          <text x="620" y="22" font-size="10.5" font-weight="800" fill="#64748B">LOCAL TIMESTAMP</text>
          <text x="810" y="22" font-size="10.5" font-weight="800" fill="#64748B">STATUS</text>
          <text x="960" y="22" font-size="10.5" font-weight="800" fill="#64748B">INTEGRITY</text>
        </g>

        <!-- Row 1: OP-104 -->
        <g transform="translate(0, 102)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#F1F5F9" />
          <text x="16" y="24" font-size="11.5" font-weight="700" fill="#0F172A" class="mono">OP-104</text>
          <text x="110" y="24" font-size="12" font-weight="700" fill="#0F172A">Address Update</text>
          <text x="280" y="24" font-size="11.5" fill="#475569">Updated domicile hamlet: Belta, Mahuadanr, Latehar</text>
          <text x="620" y="24" font-size="11" fill="#64748B" class="mono">14:12:05 IST</text>
          
          <rect x="810" y="10" width="110" height="22" rx="11" fill="#FEF3C7" />
          <text x="865" y="25" font-size="9" font-weight="800" fill="#B45309" class="badge">QUEUED LOCALLY</text>
          
          <text x="960" y="24" font-size="10" fill="#64748B" class="mono">SHA: a89f3b...</text>
        </g>

        <!-- Row 2: OP-105 -->
        <g transform="translate(0, 154)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#F1F5F9" />
          <text x="16" y="24" font-size="11.5" font-weight="700" fill="#0F172A" class="mono">OP-105</text>
          <text x="110" y="24" font-size="12" font-weight="700" fill="#0F172A">Upload Document</text>
          <text x="280" y="24" font-size="11.5" fill="#475569">File: bit_mesra_fee_receipt.pdf (1.2 MB)</text>
          <text x="620" y="24" font-size="11" fill="#64748B" class="mono">14:15:30 IST</text>
          
          <rect x="810" y="10" width="110" height="22" rx="11" fill="#FEF3C7" />
          <text x="865" y="25" font-size="9" font-weight="800" fill="#B45309" class="badge">QUEUED LOCALLY</text>
          
          <text x="960" y="24" font-size="10" fill="#64748B" class="mono">SHA: c7219e...</text>
        </g>

        <!-- Row 3: OP-103 (Synced) -->
        <g transform="translate(0, 206)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#F1F5F9" />
          <text x="16" y="24" font-size="11.5" font-weight="700" fill="#64748B" class="mono">OP-103</text>
          <text x="110" y="24" font-size="12" font-weight="600" fill="#64748B">Draft Step 2</text>
          <text x="280" y="24" font-size="11.5" fill="#64748B">Document slot confirmations &amp; seals</text>
          <text x="620" y="24" font-size="11" fill="#94A3B8" class="mono">10:02:11 IST</text>
          
          <rect x="810" y="10" width="110" height="22" rx="11" fill="#ECFDF5" />
          <text x="865" y="25" font-size="9" font-weight="800" fill="#047857" class="badge">SYNCED &amp; ACKED</text>
          
          <text x="960" y="24" font-size="10" fill="#047857" class="mono">ACK: #9921 ✓</text>
        </g>

        <!-- Lower Intelligence Section: CRDT Pipeline & Queue Status Donut -->
        <g transform="translate(0, 280)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#E2E8F0" />

          <!-- Left: CRDT Conflict-Free Synchronization Pipeline Diagram -->
          <g transform="translate(0, 24)">
            <text x="0" y="14" font-size="12" font-weight="800" fill="#047857">DETERMINISTIC LAST-WRITE-WINS (LWW) SYNC PIPELINE</text>
            <text x="0" y="30" font-size="10.5" fill="#64748B">Mathematical CRDT rules ensure zero data loss and eliminate overwrites between offline client and officer decisions</text>
            
            <g transform="translate(0, 44)">
              <rect width="720" height="120" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
              ${renderStepperPipelineComponent({
                x: 12,
                y: 20,
                width: 696,
                steps: [
                  { title: 'Local Journal', sub: 'IndexedDB AES-256', status: 'done', badge: 'STORED ✓' },
                  { title: 'Network Probe', sub: 'Connectivity Hook', status: 'active', badge: 'WAITING NET' },
                  { title: 'LWW Arbiter', sub: 'Timestamp Check', status: 'upcoming', badge: 'CRDT MERGE' },
                  { title: 'MoTA Ledger', sub: 'Immutable Sync', status: 'upcoming', badge: 'NIC SEAL' }
                ]
              })}
            </g>
          </g>

          <!-- Right: Queue Status Donut Chart -->
          <g transform="translate(760, 24)">
            <text x="0" y="14" font-size="12" font-weight="800" fill="#0F172A">QUEUE SYNC STATUS</text>
            <text x="0" y="30" font-size="10.5" fill="#64748B">IndexedDB partition distribution</text>

            <g transform="translate(0, 44)">
              <rect width="326" height="120" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
              ${renderDonutChartComponent({
                cx: 56,
                cy: 60,
                rOut: 40,
                rIn: 25,
                segments: [
                  { label: 'Queued Locally', percent: 67, color: '#D97706', amount: '2 Ops' },
                  { label: 'Synced &amp; Acked', percent: 33, color: '#047857', amount: '1 Op' }
                ],
                centerValue: '3 Ops',
                centerSub: 'Vault',
                legendX: 116,
                legendY: 26,
                legendWidth: 196,
                itemHeight: 28
              })}
            </g>
          </g>

        </g>
      </g>
    </g>

  </g>
</svg>`;
}

function make13OfficerReviewQueue() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('officer/review', 'Tribe Saarthi · Officer Review Queue')}
  ${renderSidebar('queue', 'officer')}
  ${renderHeader('Officer Review Queue', 'Dr. K. Soren · BIT Mesra Nodal Verification Desk · Ranchi, Jharkhand', 'officer')}

  <g transform="translate(274, 120)">
    
    <!-- Top 4 KPI Metrics Row -->
    <g>
      <!-- Metric 1: Pending Review -->
      <g filter="url(#cardShadow)">
        <rect width="268" height="92" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="268" height="4" rx="2" fill="#D97706" />
        <g transform="translate(20, 16)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">PENDING DESK REVIEW</text>
          <text x="0" y="42" font-size="24" font-weight="900" fill="#0F172A">14 <tspan font-size="11" font-weight="600" fill="#B45309">Cases</tspan></text>
          <text x="0" y="60" font-size="10.5" font-weight="700" fill="#D97706">⚠ 2 Cases near 24h SLA</text>
        </g>
      </g>

      <!-- Metric 2: Approved & Forwarded -->
      <g transform="translate(292, 0)" filter="url(#cardShadow)">
        <rect width="268" height="92" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="268" height="4" rx="2" fill="#047857" />
        <g transform="translate(20, 16)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">VERIFIED &amp; APPROVED</text>
          <text x="0" y="42" font-size="24" font-weight="900" fill="#047857">128 <tspan font-size="11" font-weight="600" fill="#64748B">Scholars</tspan></text>
          <text x="0" y="60" font-size="10.5" font-weight="600" fill="#059669">✓ 100% Forwarded to District</text>
        </g>
      </g>

      <!-- Metric 3: Deficiencies Issued -->
      <g transform="translate(584, 0)" filter="url(#cardShadow)">
        <rect width="268" height="92" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="268" height="4" rx="2" fill="#F59E0B" />
        <g transform="translate(20, 16)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">DEFICIENCY NOTICES</text>
          <text x="0" y="42" font-size="24" font-weight="900" fill="#B45309">3 <tspan font-size="11" font-weight="600" fill="#64748B">Awaiting Fix</tspan></text>
          <text x="0" y="60" font-size="10.5" font-weight="600" fill="#64748B">15-day cure window active</text>
        </g>
      </g>

      <!-- Metric 4: PVTG Priority Cases -->
      <g transform="translate(876, 0)" filter="url(#cardShadow)">
        <rect width="266" height="92" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="266" height="4" rx="2" fill="#2563EB" />
        <g transform="translate(20, 16)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">PVTG TIER-1 PRIORITY</text>
          <text x="0" y="42" font-size="24" font-weight="900" fill="#2563EB">1 <tspan font-size="11" font-weight="600" fill="#64748B">Mohan Birhor</tspan></text>
          <text x="0" y="60" font-size="10.5" font-weight="700" fill="#047857">★ Instant Review Priority</text>
        </g>
      </g>
    </g>

    <!-- Search & Filter Bar -->
    <g transform="translate(0, 110)">
      <rect width="640" height="42" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
      ${I.search(16, 12, '#64748B', 18)}
      <text x="44" y="26" font-size="12" fill="#94A3B8">Filter queue by Scholar Name, Application ID, or Roll Number...</text>

      <g transform="translate(660, 0)">
        <rect x="0" y="5" width="110" height="32" rx="16" fill="url(#brandGrad)" />
        <text x="55" y="25" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">Pending (14)</text>

        <rect x="120" y="5" width="130" height="32" rx="16" fill="#FEF3C7" stroke="#FDE68A" />
        <circle cx="134" cy="21" r="3.5" fill="#D97706" />
        <text x="185" y="25" font-size="11" font-weight="800" fill="#92400E" text-anchor="middle">PVTG Priority (1)</text>

        <rect x="260" y="5" width="100" height="32" rx="16" fill="#F1F5F9" />
        <text x="310" y="25" font-size="11" font-weight="600" fill="#475569" text-anchor="middle">Deficient (3)</text>

        <rect x="370" y="5" width="110" height="32" rx="16" fill="#F1F5F9" />
        <text x="425" y="25" font-size="11" font-weight="600" fill="#475569" text-anchor="middle">Approved (128)</text>
      </g>
    </g>

    <!-- Queue Applications Table Card with Component Library Caseload Donut & Pipeline -->
    <g transform="translate(0, 168)" filter="url(#heroShadow)">
      <rect width="1142" height="600" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      
      <!-- Table Header -->
      <g transform="translate(24, 20)">
        <rect width="1094" height="36" rx="6" fill="#F8FAFC" />
        <text x="16" y="22" font-size="10.5" font-weight="800" fill="#64748B">APP ID</text>
        <text x="130" y="22" font-size="10.5" font-weight="800" fill="#64748B">SCHOLAR NAME</text>
        <text x="290" y="22" font-size="10.5" font-weight="800" fill="#64748B">COMMUNITY</text>
        <text x="450" y="22" font-size="10.5" font-weight="800" fill="#64748B">SCHEME</text>
        <text x="640" y="22" font-size="10.5" font-weight="800" fill="#64748B">VERIFICATION</text>
        <text x="790" y="22" font-size="10.5" font-weight="800" fill="#64748B">SLA TIMER</text>
        <text x="960" y="22" font-size="10.5" font-weight="800" fill="#64748B" text-anchor="middle">ACTION</text>
      </g>

      <!-- Row 1: Mohan Birhor (PVTG - Highlighted) -->
      <g transform="translate(24, 68)">
        <rect width="1094" height="68" rx="8" fill="#FFFBEB" stroke="#FDE68A" />
        <text x="16" y="28" font-size="12" font-weight="800" fill="#0F172A" class="mono">JH-ST-2026-89412</text>
        <text x="16" y="46" font-size="10" fill="#64748B">12 Oct · 02:22 PM</text>

        <text x="130" y="28" font-size="13" font-weight="800" fill="#0F172A">Mohan Birhor</text>
        <text x="130" y="46" font-size="11" fill="#64748B">Roll: 2024-CSE-104 (B.Tech)</text>

        <rect x="290" y="16" width="130" height="22" rx="11" fill="#FEF3C7" />
        <text x="355" y="31" font-size="9" font-weight="800" fill="#92400E" class="badge">BIRHOR (PVTG) ★</text>

        <text x="450" y="28" font-size="12" font-weight="700" fill="#0F172A">Post-Matric ST</text>
        <text x="450" y="46" font-size="11" fill="#047857" font-weight="700">₹132,000 Sanction</text>

        <rect x="640" y="16" width="110" height="22" rx="11" fill="#ECFDF5" />
        <text x="695" y="31" font-size="9" font-weight="800" fill="#047857" class="badge">4/4 VERIFIED ✓</text>

        <text x="790" y="30" font-size="12" font-weight="800" fill="#B45309">18h remaining</text>
        <text x="790" y="46" font-size="9.5" fill="#D97706">Target: 20 Oct 14:00</text>

        <!-- Workbench Button -->
        <rect x="900" y="14" width="180" height="38" rx="8" fill="url(#brandGrad)" />
        <text x="990" y="38" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">Open Inspection Workbench →</text>
      </g>

      <!-- Row 2: Anita Munda -->
      <g transform="translate(24, 146)">
        <rect width="1094" height="64" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
        <text x="16" y="28" font-size="12" font-weight="700" fill="#0F172A" class="mono">JH-ST-2026-89415</text>
        <text x="16" y="44" font-size="10" fill="#64748B">13 Oct · 10:14 AM</text>

        <text x="130" y="28" font-size="13" font-weight="700" fill="#0F172A">Anita Munda</text>
        <text x="130" y="44" font-size="11" fill="#64748B">Roll: 2024-ECE-042 (B.Tech)</text>

        <text x="290" y="28" font-size="12" font-weight="600" fill="#0F172A">Munda ST</text>
        <text x="290" y="44" font-size="10.5" fill="#64748B">Khunti Domicile</text>

        <text x="450" y="28" font-size="12" font-weight="600" fill="#0F172A">Post-Matric ST</text>
        <text x="450" y="44" font-size="11" fill="#047857">₹124,000</text>

        <rect x="640" y="16" width="110" height="22" rx="11" fill="#ECFDF5" />
        <text x="695" y="31" font-size="9" font-weight="800" fill="#047857" class="badge">3/4 VERIFIED ✓</text>

        <text x="790" y="30" font-size="12" font-weight="600" fill="#475569">26h remaining</text>

        <rect x="920" y="15" width="160" height="34" rx="8" fill="#F1F5F9" />
        <text x="1000" y="36" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">Inspect Case →</text>
      </g>

      <!-- Row 3: Sunil Oraon -->
      <g transform="translate(24, 218)">
        <rect width="1094" height="64" rx="8" fill="#FFFFFF" stroke="#E2E8F0" />
        <text x="16" y="28" font-size="12" font-weight="700" fill="#0F172A" class="mono">JH-ST-2026-89390</text>
        <text x="16" y="44" font-size="10" fill="#64748B">11 Oct · 04:30 PM</text>

        <text x="130" y="28" font-size="13" font-weight="700" fill="#0F172A">Sunil Oraon</text>
        <text x="130" y="44" font-size="11" fill="#64748B">Roll: 2023-ME-089 (3rd Year)</text>

        <text x="290" y="28" font-size="12" font-weight="600" fill="#0F172A">Oraon ST</text>
        <text x="290" y="44" font-size="10.5" fill="#64748B">Ranchi Domicile</text>

        <text x="450" y="28" font-size="12" font-weight="600" fill="#0F172A">Top Class Education</text>
        <text x="450" y="44" font-size="11" fill="#047857">₹150,000</text>

        <rect x="640" y="16" width="110" height="22" rx="11" fill="#ECFDF5" />
        <text x="695" y="31" font-size="9" font-weight="800" fill="#047857" class="badge">4/4 VERIFIED ✓</text>

        <text x="790" y="30" font-size="12" font-weight="600" fill="#475569">30h remaining</text>

        <rect x="920" y="15" width="160" height="34" rx="8" fill="#F1F5F9" />
        <text x="1000" y="36" font-size="11" font-weight="700" fill="#047857" text-anchor="middle">Inspect Case →</text>
      </g>

      <!-- Row 4: Birsa Santhal (Deficient) -->
      <g transform="translate(24, 290)">
        <rect width="1094" height="64" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="16" y="28" font-size="12" font-weight="700" fill="#64748B" class="mono">JH-ST-2026-89381</text>
        <text x="16" y="44" font-size="10" fill="#94A3B8">09 Oct · 11:15 AM</text>

        <text x="130" y="28" font-size="13" font-weight="700" fill="#475569">Birsa Santhal</text>
        <text x="130" y="44" font-size="11" fill="#94A3B8">Roll: 2024-CIV-012</text>

        <text x="290" y="28" font-size="12" font-weight="600" fill="#64748B">Santhal ST</text>

        <text x="450" y="28" font-size="12" font-weight="600" fill="#64748B">Post-Matric ST</text>

        <rect x="640" y="16" width="110" height="22" rx="11" fill="#FEF3C7" />
        <text x="695" y="31" font-size="9" font-weight="800" fill="#B45309" class="badge">DEFICIENT NOTICE</text>

        <text x="790" y="30" font-size="11" font-weight="700" fill="#B45309">11 Days Left to Fix</text>

        <rect x="920" y="15" width="160" height="34" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
        <text x="1000" y="36" font-size="11" font-weight="600" fill="#64748B" text-anchor="middle">View Cure Status</text>
      </g>

      <!-- Bottom Panel: Caseload Donut Chart & 5-Stage Verification Pipeline Diagram -->
      <g transform="translate(24, 370)">
        <line x1="0" y1="0" x2="1094" y2="0" stroke="#E2E8F0" />
        
        <!-- Sub-panel Header -->
        <text x="0" y="24" font-size="13" font-weight="800" fill="#0F172A">CASELOAD DISTRIBUTION &amp; STATUTORY APPROVAL PIPELINE</text>
        <text x="0" y="40" font-size="10.5" fill="#64748B">Real-time status across BIT Mesra queue and subsequent disbursement gateways</text>

        <!-- Left: Donut Chart Component -->
        <g transform="translate(0, 56)">
          <rect width="360" height="150" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          ${renderDonutChartComponent({
            cx: 60,
            cy: 75,
            rOut: 46,
            rIn: 28,
            segments: [
              { label: 'Approved', percent: 88, color: '#047857', amount: '128' },
              { label: 'In Review', percent: 10, color: '#D97706', amount: '14' },
              { label: 'Deficient', percent: 2, color: '#EF4444', amount: '3' }
            ],
            centerValue: '145',
            centerSub: 'Total Cases',
            legendX: 130,
            legendY: 28,
            legendWidth: 216,
            itemHeight: 26
          })}
        </g>

        <!-- Right: 5-Stage Pipeline Diagram Component -->
        <g transform="translate(378, 56)">
          <rect width="716" height="150" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          <text x="16" y="22" font-size="11" font-weight="800" fill="#047857">STATUTORY MULTI-LEVEL VERIFICATION PIPELINE</text>
          ${renderStepperPipelineComponent({
            x: 16,
            y: 44,
            width: 684,
            steps: [
              { title: 'UIDAI Vault', sub: 'Demographic Match', status: 'done', badge: '100% CLEAR' },
              { title: 'e-District ST', sub: 'SDO Latehar Cert', status: 'done', badge: 'SEALED ✓' },
              { title: 'Institute Desk', sub: 'BIT Mesra (Dr. Soren)', status: 'active', badge: 'ACTIVE DESK' },
              { title: 'District Concurrence', sub: 'Latehar Welfare Off', status: 'upcoming', badge: 'EST 20 OCT' },
              { title: 'PFMS DBT', sub: 'Aadhaar Disburse', status: 'upcoming', badge: 'CENTRAL PFMS' }
            ]
          })}
        </g>
      </g>

    </g>

  </g>
</svg>`;
}

function make14OfficerCaseDetailInspection() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('officer/case/JH-ST-2026-89412', 'Tribe Saarthi · Case Inspection Workbench')}
  ${renderSidebar('inspection', 'officer')}
  ${renderHeader('Inspection Workbench', 'Mohan Birhor · App #JH-ST-2026-89412 · Post-Matric Scholarship for ST Students', 'officer')}

  <g transform="translate(274, 120)">
    
    <!-- Split Screen: Left (560px) Data Verification / Right (560px) PDF Viewer -->
    <!-- Left Pane: Declared Data vs Official Registries -->
    <g filter="url(#heroShadow)">
      <rect width="560" height="710" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(24, 24)">
        <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">Registry vs Declared OCR Data</text>
        <text x="0" y="32" font-size="11" fill="#64748B">Automated consistency comparison against statutory registries</text>

        <!-- Verification Table -->
        <g transform="translate(0, 50)">
          <!-- Row 1: Name -->
          <rect width="512" height="64" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
          <text x="16" y="22" font-size="10.5" font-weight="700" fill="#64748B">APPLICANT LEGAL NAME</text>
          <text x="16" y="44" font-size="13" font-weight="800" fill="#0F172A">Mohan Birhor</text>
          <rect x="390" y="16" width="106" height="24" rx="12" fill="#ECFDF5" />
          <text x="443" y="32" font-size="9" font-weight="800" fill="#047857" class="badge">OCR 100% MATCH ✓</text>

          <!-- Row 2: Caste & PVTG -->
          <g transform="translate(0, 72)">
            <rect width="512" height="74" rx="8" fill="#FFFBEB" stroke="#FDE68A" />
            <text x="16" y="22" font-size="10.5" font-weight="700" fill="#92400E">ST COMMUNITY &amp; PVTG STATUS</text>
            <text x="16" y="42" font-size="13" font-weight="800" fill="#0F172A">Birhor (Particularly Vulnerable Tribal Group)</text>
            <text x="16" y="58" font-size="10" fill="#B45309">Verified against Jharkhand Scheduled Tribe Registry #JH-ST-4910</text>
            <rect x="390" y="16" width="106" height="24" rx="12" fill="#FEF3C7" />
            <text x="443" y="32" font-size="9" font-weight="800" fill="#92400E" class="badge">PVTG TIER-1 ✓</text>
          </g>

          <!-- Row 3: Annual Income -->
          <g transform="translate(0, 154)">
            <rect width="512" height="64" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="16" y="22" font-size="10.5" font-weight="700" fill="#64748B">CERTIFIED ANNUAL FAMILY INCOME</text>
            <text x="16" y="44" font-size="13" font-weight="800" fill="#047857">₹1,20,000 / year</text>
            <text x="130" y="44" font-size="11" fill="#64748B">(Below ₹2.5L statutory cap)</text>
            <rect x="390" y="16" width="106" height="24" rx="12" fill="#ECFDF5" />
            <text x="443" y="32" font-size="9" font-weight="800" fill="#047857" class="badge">REVENUE API ✓</text>
          </g>

          <!-- Row 4: Academic Enrollment -->
          <g transform="translate(0, 226)">
            <rect width="512" height="64" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="16" y="22" font-size="10.5" font-weight="700" fill="#64748B">INSTITUTE ENROLLMENT (AISHE ROLL)</text>
            <text x="16" y="44" font-size="13" font-weight="800" fill="#0F172A">BIT Mesra · 2024-CSE-104</text>
            <rect x="390" y="16" width="106" height="24" rx="12" fill="#ECFDF5" />
            <text x="443" y="32" font-size="9" font-weight="800" fill="#047857" class="badge">AISHE ACTIVE ✓</text>
          </g>

          <!-- Row 5: Bank DBT Seeding -->
          <g transform="translate(0, 298)">
            <rect width="512" height="64" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="16" y="22" font-size="10.5" font-weight="700" fill="#64748B">PFMS AADHAAR DBT SEEDING</text>
            <text x="16" y="44" font-size="13" font-weight="800" fill="#0F172A">Bank of India · ••••••••9012</text>
            <rect x="390" y="16" width="106" height="24" rx="12" fill="#ECFDF5" />
            <text x="443" y="32" font-size="9" font-weight="800" fill="#047857" class="badge">NPCI SEEDED ✓</text>
          </g>

          <!-- Officer Verification Note -->
          <g transform="translate(0, 372)">
            <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">OFFICER INSPECTION REMARKS</text>
            <rect x="0" y="24" width="512" height="64" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="14" y="46" font-size="11" fill="#0F172A">Applicant credentials cross-checked against BIT Mesra roll. Bonafide and attendance verified 88%.</text>
          </g>
        </g>
      </g>
    </g>

    <!-- Right Pane: Embedded Document Viewer (560px) -->
    <g transform="translate(582, 0)" filter="url(#heroShadow)">
      <rect width="560" height="710" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(24, 20)">
        <text x="0" y="16" font-size="14" font-weight="800" fill="#0F172A">Digital Document Preview</text>
        <text x="0" y="32" font-size="11" fill="#64748B">Viewing: <tspan font-weight="700">Scheduled Tribe Certificate #JH/ST/2022/4910</tspan></text>

        <!-- Simulated PDF Canvas -->
        <g transform="translate(0, 48)">
          <rect width="512" height="520" rx="10" fill="#FAFAF9" stroke="#E2E8F0" />
          
          <!-- Government Header in PDF -->
          <g transform="translate(20, 24)">
            <circle cx="236" cy="24" r="20" fill="#047857" />
            <text x="236" y="28" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">GOVT OF JHARKHAND</text>
            <text x="236" y="58" font-size="12" font-weight="800" fill="#0F172A" text-anchor="middle">OFFICE OF THE SUB-DIVISIONAL OFFICER, LATEHAR</text>
            <text x="236" y="74" font-size="11" font-weight="700" fill="#B45309" text-anchor="middle">SCHEDULED TRIBE CASTE CERTIFICATE</text>

            <line x1="20" y1="90" x2="452" y2="90" stroke="#CBD5E1" />

            <!-- Body text in Certificate -->
            <text x="20" y="120" font-size="11" fill="#334155">This is to certify that <tspan font-weight="800">MOHAN BIRHOR</tspan>, son of <tspan font-weight="700">Somra Birhor</tspan>,</text>
            <text x="20" y="140" font-size="11" fill="#334155">resident of Village Belta, Mahuadanr, District Latehar, Jharkhand,</text>
            <text x="20" y="160" font-size="11" fill="#334155">belongs to the <tspan font-weight="800">BIRHOR</tspan> Community which is recognized as a</text>
            <text x="20" y="180" font-size="11" font-weight="800" fill="#047857">Particularly Vulnerable Tribal Group (PVTG) under the Constitution (ST) Order 1950.</text>

            <!-- Official Seal & Stamp Graphic -->
            <g transform="translate(60, 240)">
              <circle cx="50" cy="50" r="44" fill="none" stroke="#2563EB" stroke-width="2" stroke-dasharray="4 2" />
              <text x="50" y="44" font-size="8.5" font-weight="800" fill="#2563EB" text-anchor="middle">SDO LATEHAR</text>
              <text x="50" y="58" font-size="7.5" font-weight="700" fill="#2563EB" text-anchor="middle">14 AUG 2022</text>
              <text x="50" y="70" font-size="8" font-weight="800" fill="#047857" text-anchor="middle">DIGITALLY SIGNED</text>
            </g>

            <!-- Vector QR Code -->
            <g transform="translate(300, 240)">
              <rect width="90" height="90" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
              <rect x="8" y="8" width="24" height="24" fill="#0F172A" />
              <rect x="58" y="8" width="24" height="24" fill="#0F172A" />
              <rect x="8" y="58" width="24" height="24" fill="#0F172A" />
              <rect x="40" y="40" width="12" height="12" fill="#0F172A" />
              <text x="45" y="104" font-size="8" font-weight="600" fill="#64748B" text-anchor="middle" class="mono">VERIFY QR</text>
            </g>
          </g>
        </g>

        <!-- Document Selector Pills -->
        <g transform="translate(0, 584)">
          <rect width="116" height="28" rx="14" fill="url(#brandGrad)" />
          <text x="58" y="18" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">Caste Cert ✓</text>

          <rect x="126" y="0" width="116" height="28" rx="14" fill="#F1F5F9" />
          <text x="184" y="18" font-size="10" font-weight="600" fill="#475569" text-anchor="middle">Income Cert ✓</text>

          <rect x="252" y="0" width="116" height="28" rx="14" fill="#F1F5F9" />
          <text x="310" y="18" font-size="10" font-weight="600" fill="#475569" text-anchor="middle">Marksheet ✓</text>

          <rect x="378" y="0" width="134" height="28" rx="14" fill="#F1F5F9" />
          <text x="445" y="18" font-size="10" font-weight="600" fill="#475569" text-anchor="middle">Bonafide Slip</text>
        </g>
      </g>
    </g>

    <!-- Fixed Bottom Workbench Action Bar -->
    <g transform="translate(0, 726)">
      <rect width="1142" height="66" rx="12" fill="#0F172A" filter="url(#heroShadow)" />
      
      <g transform="translate(24, 14)">
        <!-- Return Deficiency -->
        <rect x="0" y="0" width="220" height="38" rx="8" fill="#F59E0B" />
        ${I.alert(14, 10, '#78350F', 18)}
        <text x="120" y="24" font-size="11.5" font-weight="800" fill="#78350F" text-anchor="middle">Issue Deficiency Notice</text>

        <!-- Escalate to District -->
        <rect x="236" y="0" width="190" height="38" rx="8" fill="#1E293B" stroke="#334155" />
        <text x="331" y="24" font-size="11.5" font-weight="700" fill="#F8FAFC" text-anchor="middle">Escalate to District</text>

        <!-- Primary Action: Approve -->
        <rect x="800" y="0" width="294" height="38" rx="8" fill="url(#brandGrad)" />
        ${I.checkCircle(816, 10, '#FFFFFF', 18)}
        <text x="960" y="24" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">Approve &amp; Forward for Sanction ✓</text>
      </g>
    </g>

  </g>
</svg>`;
}

// =============================================================
// SCREEN 15: Formal Deficiency Notice Modal Dialog
// =============================================================
function make15DeficiencyNoticeModal() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('officer/case/JH-ST-2026-89412/deficiency', 'Tribe Saarthi · Deficiency Notice Dialog')}
  
  <!-- Dimmed Background Portal -->
  <g opacity="0.25">
    ${renderSidebar('inspection', 'officer')}
    ${renderHeader('Inspection Workbench', 'Mohan Birhor · App #JH-ST-2026-89412', 'officer')}
  </g>

  <!-- Dark Backdrop Overlay -->
  <rect x="0" y="41" width="1440" height="919" fill="#0F172A" fill-opacity="0.65" />

  <!-- Centered Elevated Modal Window (740px x 620px) -->
  <g transform="translate(350, 160)" filter="url(#modalShadow)">
    <rect width="740" height="620" rx="16" fill="#FFFFFF" stroke="#E2E8F0" />
    <rect width="740" height="6" rx="3" fill="url(#amberGrad)" />

    <g transform="translate(36, 32)">
      <!-- Modal Header -->
      <circle cx="20" cy="20" r="20" fill="#FEF3C7" />
      ${I.alert(10, 10, '#D97706', 20)}
      
      <text x="52" y="18" font-size="18" font-weight="800" fill="#0F172A">Issue Formal Deficiency Notice</text>
      <text x="52" y="36" font-size="12" fill="#64748B">Scholar: <tspan font-weight="700" fill="#0F172A">Mohan Birhor</tspan> · Application ID: <tspan class="mono" font-weight="600">JH-ST-2026-89412</tspan></text>

      <!-- Close Button -->
      <circle cx="640" cy="16" r="14" fill="#F1F5F9" />
      ${I.x(633, 9, '#64748B', 14)}

      <line x1="0" y1="56" x2="668" y2="56" stroke="#F1F5F9" />

      <!-- Form: Deficient Document Selection -->
      <g transform="translate(0, 74)">
        <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">DEFICIENT DOCUMENT OR FIELD</text>
        <rect x="0" y="24" width="668" height="42" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
        <text x="16" y="50" font-size="13" font-weight="700" fill="#0F172A">BIT Mesra Bonafide &amp; Fee Receipt (Document Slot 4)</text>

        <!-- Standard Deficiency Reasons (Checklist) -->
        <g transform="translate(0, 84)">
          <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">SELECT APPLICABLE DEFICIENCY REASONS</text>

          <rect x="0" y="26" width="18" height="18" rx="4" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="28" y="40" font-size="11.5" fill="#475569">Document scan is illegible or cut off</text>

          <rect x="0" y="56" width="18" height="18" rx="4" fill="#D97706" />
          ${I.check(2, 58, '#FFFFFF', 14)}
          <text x="28" y="70" font-size="11.5" font-weight="700" fill="#0F172A">Missing official round seal or signature of Head of Institution</text>

          <rect x="0" y="86" width="18" height="18" rx="4" fill="#D97706" />
          ${I.check(2, 88, '#FFFFFF', 14)}
          <text x="28" y="100" font-size="11.5" font-weight="700" fill="#0F172A">Fee breakdown does not separate tuition fee from caution deposit</text>

          <rect x="0" y="116" width="18" height="18" rx="4" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="28" y="130" font-size="11.5" fill="#475569">Academic year on bonafide does not match 2026-27 session</text>
        </g>

        <!-- Custom Instructions Text Box -->
        <g transform="translate(0, 244)">
          <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">CUSTOM INSTRUCTIONS FOR SCHOLAR (TRANSLATED INTO SANTHALI &amp; HINDI)</text>
          <rect x="0" y="24" width="668" height="74" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
          <text x="14" y="46" font-size="11.5" fill="#0F172A">Please obtain the round seal of the Dean of Student Welfare (DSW) on your fee receipt</text>
          <text x="14" y="64" font-size="11.5" fill="#0F172A">and re-upload clear scan within 15 days to avoid scholarship processing delay.</text>
        </g>

        <!-- Cure Deadline Dropdown -->
        <g transform="translate(0, 360)">
          <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">STATUTORY CURE WINDOW</text>
          <rect x="0" y="24" width="320" height="40" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
          <text x="14" y="48" font-size="12" font-weight="700" fill="#B45309">15 Days (Deadline: 04 Nov 2026)</text>
        </g>

        <!-- Action Row -->
        <g transform="translate(0, 440)">
          <line x1="0" y1="0" x2="668" y2="0" stroke="#F1F5F9" />

          <rect x="0" y="18" width="140" height="42" rx="8" fill="#F1F5F9" />
          <text x="70" y="44" font-size="12" font-weight="700" fill="#475569" text-anchor="middle">Cancel</text>

          <rect x="368" y="18" width="300" height="42" rx="8" fill="url(#amberGrad)" />
          <text x="518" y="44" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">Send Deficiency Notice via SMS &amp; Portal →</text>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

// =============================================================
// SCREEN 16: Cryptographic Digital Sanction Signing Dialog
// =============================================================
function make16DigitalSanctionSigning() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('officer/sanction/JH-ST-2026-89412', 'Tribe Saarthi · Digital Sanction Order Signing')}

  <!-- Dimmed Background Portal -->
  <g opacity="0.25">
    ${renderSidebar('sanction', 'officer')}
    ${renderHeader('Digital Sanction Workbench', 'Dr. K. Soren · Approval Desk', 'officer')}
  </g>

  <!-- Dark Backdrop Overlay -->
  <rect x="0" y="41" width="1440" height="919" fill="#0F172A" fill-opacity="0.65" />

  <!-- Centered Modal Window (760px x 680px) -->
  <g transform="translate(340, 130)" filter="url(#modalShadow)">
    <rect width="760" height="680" rx="16" fill="#FFFFFF" stroke="#E2E8F0" />
    <rect width="760" height="6" rx="3" fill="url(#brandGrad)" />

    <g transform="translate(36, 28)">
      <!-- Header -->
      <circle cx="20" cy="20" r="20" fill="#ECFDF5" />
      ${I.shield(10, 10, '#047857', 20)}

      <text x="52" y="18" font-size="18" font-weight="800" fill="#0F172A">Digital Sanction Order Generation &amp; DSC Signing</text>
      <text x="52" y="36" font-size="12" fill="#64748B">Ministry of Tribal Affairs · Post-Matric Scholarship for Scheduled Tribe Students</text>

      <line x1="0" y1="56" x2="688" y2="56" stroke="#F1F5F9" />

      <!-- Sanction Order Summary with Component Library Allocation Donut -->
      <g transform="translate(0, 70)">
        <rect width="688" height="150" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
        
        <!-- Left details -->
        <g transform="translate(20, 18)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">BENEFICIARY SCHOLAR</text>
          <text x="0" y="34" font-size="13" font-weight="800" fill="#0F172A">Mohan Birhor</text>
          <text x="0" y="50" font-size="11" fill="#64748B">BIT Mesra · B.Tech (2024-CSE-104)</text>
          
          <rect x="0" y="64" width="130" height="22" rx="11" fill="#FEF3C7" />
          <text x="65" y="79" font-size="9" font-weight="800" fill="#92400E" class="badge">BIRHOR (PVTG TIER-1)</text>

          <text x="0" y="108" font-size="10.5" font-weight="700" fill="#047857">TOTAL APPROVED BENEFIT</text>
          <text x="0" y="126" font-size="18" font-weight="900" fill="#047857">₹132,000.00</text>
        </g>

        <!-- Right: Donut Chart for Grant Breakdown -->
        <g transform="translate(280, 12)">
          <text x="0" y="16" font-size="10.5" font-weight="800" fill="#0F172A">STATUTORY GRANT ALLOCATION</text>
          ${renderDonutChartComponent({
            cx: 50,
            cy: 70,
            rOut: 42,
            rIn: 26,
            segments: [
              { label: 'Tuition Fees', percent: 74, color: '#047857', amount: '₹98,000' },
              { label: 'Maintenance', percent: 26, color: '#2563EB', amount: '₹34,000' }
            ],
            centerValue: '₹132K',
            centerSub: 'Full Grant',
            legendX: 110,
            legendY: 34,
            legendWidth: 260,
            itemHeight: 28
          })}
        </g>
      </g>

      <!-- Multi-Party Sign-Off Chain Pipeline Diagram -->
      <g transform="translate(0, 234)">
        <rect width="688" height="96" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
        <text x="16" y="20" font-size="10.5" font-weight="800" fill="#047857">STATUTORY SIGN-OFF CHAIN</text>
        ${renderStepperPipelineComponent({
          x: 10,
          y: 28,
          width: 668,
          steps: [
            { title: 'Student Claim', sub: 'Aadhaar OTP', status: 'done', badge: 'SEALED ✓' },
            { title: 'Institute DSC', sub: 'Dr. K. Soren', status: 'active', badge: 'SIGNING NOW' },
            { title: 'Dist Concurrence', sub: 'Latehar Welfare', status: 'upcoming', badge: 'NEXT' },
            { title: 'MoTA PFMS', sub: 'Treasury Disburse', status: 'upcoming', badge: 'PFMS DBT' }
          ]
        })}
      </g>

      <!-- Cryptographic Hash Box -->
      <g transform="translate(0, 342)">
        <rect width="688" height="50" rx="8" fill="#F0FDF4" stroke="#BBF7D0" />
        <text x="16" y="20" font-size="10.5" font-weight="700" fill="#047857">SHA-256 ORDER DIGEST</text>
        <text x="16" y="38" font-size="10.5" font-weight="600" fill="#065F46" class="mono">9f83b2c174092bfa77e204918e3c881023a9f029148bc7210e4a77912bc0a104</text>
      </g>

      <!-- Signing Method Options -->
      <g transform="translate(0, 404)">
        <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">SELECT AUTHENTICATION METHOD</text>

        <!-- Method 1: DSC USB Token -->
        <rect x="0" y="24" width="330" height="60" rx="8" fill="#FFFBEB" stroke="#FDE68A" />
        <circle cx="24" cy="54" r="8" fill="#D97706" />
        <circle cx="24" cy="54" r="3.5" fill="#FFFFFF" />
        <text x="44" y="46" font-size="12" font-weight="800" fill="#0F172A">Class-3 DSC Token</text>
        <text x="44" y="64" font-size="10.5" fill="#B45309">Inserted: eMudhra USB Token (Dr. K. Soren)</text>

        <!-- Method 2: Aadhaar e-Sign -->
        <g transform="translate(358, 0)">
          <rect x="0" y="24" width="330" height="60" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
          <circle cx="24" cy="54" r="8" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="44" y="46" font-size="12" font-weight="700" fill="#475569">Aadhaar e-Sign OTP</text>
          <text x="44" y="64" font-size="10.5" fill="#64748B">OTP sent to officer registered mobile</text>
        </g>
      </g>

      <!-- Statutory Officer Declaration -->
      <g transform="translate(0, 498)">
        <rect width="688" height="48" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
        <rect x="16" y="15" width="18" height="18" rx="4" fill="#047857" />
        ${I.check(18, 17, '#FFFFFF', 14)}
        <text x="44" y="28" font-size="11" font-weight="700" fill="#0F172A">Statutory Certification under MoTA Guidelines</text>
        <text x="44" y="42" font-size="10" fill="#475569">I certify that all criteria under MoTA Financial Rules 2026 are fulfilled and records verified.</text>
      </g>

      <!-- Action Buttons -->
      <g transform="translate(0, 564)">
        <line x1="0" y1="0" x2="688" y2="0" stroke="#F1F5F9" />

        <rect x="0" y="16" width="140" height="42" rx="8" fill="#F1F5F9" />
        <text x="70" y="42" font-size="12" font-weight="700" fill="#475569" text-anchor="middle">Cancel</text>

        <rect x="368" y="16" width="320" height="42" rx="8" fill="url(#brandGrad)" filter="url(#cardShadow)" />
        ${I.key(384, 27, '#FDE68A', 20)}
        <text x="540" y="42" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">Affix Digital Signature (DSC) →</text>
      </g>
    </g>
  </g>
</svg>`;
}

function make17SabotageSwitchboard() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('officer/sabotage', 'Tribe Saarthi · QA Sabotage Switchboard')}
  ${renderSidebar('switchboard', 'officer')}
  ${renderHeader('QA Resilience &amp; Chaos Testing Switchboard', 'Simulate government gateway outages to verify graceful degradation and offline fallbacks', 'officer')}

  <g transform="translate(274, 120)">
    
    <!-- Top Warning & Status Row -->
    <g filter="url(#heroShadow)">
      <rect width="1142" height="74" rx="14" fill="#0F172A" />
      <g transform="translate(24, 18)">
        <circle cx="20" cy="20" r="18" fill="#EF4444" />
        ${I.alert(11, 11, '#FFFFFF', 18)}
        <text x="52" y="18" font-size="14" font-weight="800" fill="#FFFFFF">Engineering Chaos Simulation Cockpit</text>
        <text x="52" y="34" font-size="11" fill="#94A3B8">Inject network latency, HTTP 503 gateway outages, and duplicate records in staging to verify non-blocking UX.</text>
      </g>
    </g>

    <!-- Visual System Resilience Topology Diagram Component -->
    <g transform="translate(0, 94)">
      <g filter="url(#cardShadow)">
        <rect width="1142" height="260" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="14" font-weight="800" fill="#0F172A">SYSTEM ARCHITECTURE FAULT-TOLERANCE TOPOLOGY</text>
          <text x="0" y="32" font-size="11" fill="#64748B">Live routing visualization showing non-blocking fallback paths during simulated external gateway outages</text>

          <!-- Component Library Topology Diagram -->
          <g transform="translate(0, 48)">
            <!-- Client Box -->
            <rect x="0" y="24" width="170" height="90" rx="10" fill="#F8FAFC" stroke="#047857" stroke-width="2" />
            <text x="16" y="22" font-size="11" font-weight="800" fill="#047857">TRIBAL PWA CLIENT</text>
            <text x="16" y="42" font-size="12" font-weight="700" fill="#0F172A">Scholar Portal</text>
            <rect x="16" y="54" width="110" height="20" rx="10" fill="#ECFDF5" />
            <text x="71" y="67" font-size="8.5" font-weight="800" fill="#047857" class="badge">ACTIVE BROWSER</text>

            <!-- Connector Lines -->
            <path d="M 170 54 L 280 54 L 280 30 L 360 30" stroke="#EF4444" stroke-width="2" fill="none" stroke-dasharray="4 3" />
            <path d="M 170 70 L 360 70" stroke="#F59E0B" stroke-width="2" fill="none" />
            <path d="M 170 86 L 280 86 L 280 110 L 360 110" stroke="#047857" stroke-width="2" fill="none" />

            <!-- Middle Gateway Gate Nodes -->
            <!-- DigiLocker (503 FAULT) -->
            <g transform="translate(360, 8)">
              <rect width="270" height="44" rx="8" fill="#FEF2F2" stroke="#EF4444" stroke-width="1.5" />
              <text x="12" y="18" font-size="10.5" font-weight="800" fill="#DC2626">DigiLocker Gateway</text>
              <rect x="174" y="10" width="84" height="18" rx="9" fill="#EF4444" />
              <text x="216" y="22" font-size="8" font-weight="900" fill="#FFFFFF" class="badge">503 OUTAGE</text>
              <text x="12" y="34" font-size="9" fill="#991B1B">Circuit Tripped ➔ Fallback Active</text>
            </g>

            <!-- Aadhaar (429 RATE LIMIT) -->
            <g transform="translate(360, 56)">
              <rect width="270" height="44" rx="8" fill="#FFFBEB" stroke="#F59E0B" stroke-width="1.5" />
              <text x="12" y="18" font-size="10.5" font-weight="800" fill="#B45309">UIDAI Aadhaar Vault</text>
              <rect x="174" y="10" width="84" height="18" rx="9" fill="#F59E0B" />
              <text x="216" y="22" font-size="8" font-weight="900" fill="#FFFFFF" class="badge">429 LIMIT</text>
              <text x="12" y="34" font-size="9" fill="#78350F">Backoff jitter queue: 2s ➔ 4s ➔ 8s</text>
            </g>

            <!-- Offline Storage -->
            <g transform="translate(360, 104)">
              <rect width="270" height="44" rx="8" fill="#ECFDF5" stroke="#059669" stroke-width="1.5" />
              <text x="12" y="18" font-size="10.5" font-weight="800" fill="#047857">IndexedDB Sandbox</text>
              <rect x="174" y="10" width="84" height="18" rx="9" fill="#047857" />
              <text x="216" y="22" font-size="8" font-weight="900" fill="#FFFFFF" class="badge">OFFLINE OK</text>
              <text x="12" y="34" font-size="9" fill="#065F46">2 mutations queued for sync</text>
            </g>

            <!-- Destination Arrows & Fallback Containers -->
            <path d="M 630 30 L 720 30" stroke="#047857" stroke-width="2" fill="none" />
            <polygon points="720,30 714,26 714,34" fill="#047857" />
            <g transform="translate(724, 8)">
              <rect width="360" height="44" rx="8" fill="#F0FDF4" stroke="#86EFAC" />
              <text x="12" y="18" font-size="10.5" font-weight="800" fill="#047857">Encrypted Local OCR &amp; Human Quarantine Desk</text>
              <text x="12" y="34" font-size="9" fill="#15803D">PDF preserved with SHA-256 seal · Zero student blocking</text>
            </g>

            <path d="M 630 78 L 720 78" stroke="#047857" stroke-width="2" fill="none" />
            <polygon points="720,78 714,74 714,82" fill="#047857" />
            <g transform="translate(724, 56)">
              <rect width="360" height="44" rx="8" fill="#F0FDF4" stroke="#86EFAC" />
              <text x="12" y="18" font-size="10.5" font-weight="800" fill="#047857">Exponential Jitter Circuit Breaker Handler</text>
              <text x="12" y="34" font-size="9" fill="#15803D">Auto-recovers when UIDAI gateway normalizes</text>
            </g>

            <path d="M 630 126 L 720 126" stroke="#047857" stroke-width="2" fill="none" />
            <polygon points="720,126 714,122 714,130" fill="#047857" />
            <g transform="translate(724, 104)">
              <rect width="360" height="44" rx="8" fill="#F0FDF4" stroke="#86EFAC" />
              <text x="12" y="18" font-size="10.5" font-weight="800" fill="#047857">Background Sync ServiceWorker Worker</text>
              <text x="12" y="34" font-size="9" fill="#15803D">Flushes when connectivity restores · Guaranteed LWW</text>
            </g>
          </g>
        </g>
      </g>
    </g>

    <!-- Chaos Controls Grid: Left Donut (380px) & Right Interactive Toggles (742px) -->
    <g transform="translate(0, 370)">
      
      <!-- Left: Chaos Testing Status Donut -->
      <g filter="url(#cardShadow)">
        <rect width="380" height="260" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="13" font-weight="800" fill="#0F172A">CHAOS SIMULATION STATUS</text>
          <text x="0" y="32" font-size="10.5" fill="#64748B">Active fault injection distribution</text>

          <g transform="translate(0, 48)">
            ${renderDonutChartComponent({
              cx: 60,
              cy: 70,
              rOut: 48,
              rIn: 30,
              segments: [
                { label: 'Active Chaos', percent: 40, color: '#EF4444', amount: '2 Faults' },
                { label: 'Nominal Health', percent: 60, color: '#047857', amount: '3 Routes' }
              ],
              centerValue: '40%',
              centerSub: 'Chaos Load',
              legendX: 130,
              legendY: 34,
              legendWidth: 200,
              itemHeight: 28
            })}
          </g>

          <rect x="0" y="196" width="332" height="36" rx="8" fill="#F0FDF4" stroke="#BBF7D0" />
          <text x="12" y="218" font-size="10.5" font-weight="700" fill="#047857">✓ 100% Graceful Degradation Guaranteed</text>
        </g>
      </g>

      <!-- Right: Toggle Controls -->
      <g transform="translate(400, 0)" filter="url(#cardShadow)">
        <rect width="742" height="260" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(24, 20)">
          <text x="0" y="16" font-size="13" font-weight="800" fill="#0F172A">ACTIVE CHAOS INJECTION TOGGLES</text>

          <!-- Toggle 1: DigiLocker -->
          <g transform="translate(0, 36)">
            <rect width="694" height="52" rx="8" fill="#FEF2F2" stroke="#FCA5A5" />
            <text x="16" y="22" font-size="12" font-weight="800" fill="#991B1B">Simulate DigiLocker Gateway Outage (HTTP 503)</text>
            <text x="16" y="38" font-size="10.5" fill="#7F1D1D">Falls back to manual PDF upload with automated quarantine desk ✓</text>
            <rect x="626" y="12" width="52" height="28" rx="14" fill="#047857" />
            <circle cx="662" cy="26" r="11" fill="#FFFFFF" />
          </g>

          <!-- Toggle 2: PFMS Timeout -->
          <g transform="translate(0, 96)">
            <rect width="694" height="52" rx="8" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="16" y="22" font-size="12" font-weight="700" fill="#0F172A">Simulate PFMS Payment Gateway Delay / Timeout (30s drop)</text>
            <text x="16" y="38" font-size="10.5" fill="#64748B">Queues sanction orders in durable DBT outbox rather than failing</text>
            <rect x="626" y="12" width="52" height="28" rx="14" fill="#CBD5E1" />
            <circle cx="640" cy="26" r="11" fill="#FFFFFF" />
          </g>

          <!-- Toggle 3: Forced Offline Mode -->
          <g transform="translate(0, 156)">
            <rect width="694" height="52" rx="8" fill="#ECFDF5" stroke="#A7F3D0" />
            <text x="16" y="22" font-size="12" font-weight="800" fill="#065F46">Forced Remote Tribal Disconnect (Simulated Forest Lack of Signal)</text>
            <text x="16" y="38" font-size="10.5" fill="#047857">Forces browser into ServiceWorker offline sandbox; routes to IndexedDB ✓</text>
            <rect x="626" y="12" width="52" height="28" rx="14" fill="#047857" />
            <circle cx="662" cy="26" r="11" fill="#FFFFFF" />
          </g>
        </g>
      </g>

    </g>

  </g>
</svg>`;
}

function make18CoverageGapAnalytics() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('officer/analytics', 'Tribe Saarthi · Coverage Gap Analytics')}
  ${renderSidebar('analytics', 'officer')}
  ${renderHeader('Coverage Gap &amp; Saturation Analytics', 'District-level saturation tracking for Scheduled Tribe &amp; PVTG students in Jharkhand', 'officer')}

  <g transform="translate(274, 120)">
    
    <!-- 4 KPI Metrics -->
    <g>
      <!-- KPI 1: Visual Anchor from GStack -->
      <g filter="url(#cardShadow)">
        <rect width="268" height="96" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="268" height="4" rx="2" fill="#047857" />
        <g transform="translate(20, 18)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">VERIFIED ST ENROLLMENTS</text>
          <text x="0" y="44" font-size="28" font-weight="900" fill="#0F172A" class="stat-anchor">81,373</text>
          <text x="0" y="62" font-size="10" font-weight="700" fill="#B45309">Enrollment counts ≠ unpaid students</text>
        </g>
      </g>

      <!-- KPI 2 -->
      <g transform="translate(292, 0)" filter="url(#cardShadow)">
        <rect width="268" height="96" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="268" height="4" rx="2" fill="#047857" />
        <g transform="translate(20, 18)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">ENROLLED SCHOLARS</text>
          <text x="0" y="42" font-size="24" font-weight="900" fill="#047857">62,310 <tspan font-size="13" font-weight="700">(74%)</tspan></text>
          <text x="0" y="60" font-size="10.5" font-weight="600" fill="#059669">↑ +14% vs last academic year</text>
        </g>
      </g>

      <!-- KPI 3 -->
      <g transform="translate(584, 0)" filter="url(#cardShadow)">
        <rect width="268" height="96" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="268" height="4" rx="2" fill="#EF4444" />
        <g transform="translate(20, 18)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">PVTG PRIORITY COVERAGE</text>
          <text x="0" y="42" font-size="24" font-weight="900" fill="#DC2626">48% <tspan font-size="13" font-weight="700">(Target: 80%)</tspan></text>
          <text x="0" y="60" font-size="10.5" font-weight="700" fill="#DC2626">⚠ Critical saturation gap</text>
        </g>
      </g>

      <!-- KPI 4 -->
      <g transform="translate(876, 0)" filter="url(#cardShadow)">
        <rect width="266" height="96" rx="12" fill="#FFFFFF" stroke="#E2E8F0" />
        <rect width="266" height="4" rx="2" fill="#D97706" />
        <g transform="translate(20, 18)">
          <text x="0" y="14" font-size="10.5" font-weight="700" fill="#64748B">FUNDS DISBURSED VIA DBT</text>
          <text x="0" y="42" font-size="24" font-weight="900" fill="#0F172A">₹82.2 Cr</text>
          <text x="0" y="60" font-size="10.5" font-weight="600" fill="#047857">100% Aadhaar Seeded PFMS</text>
        </g>
      </g>
    </g>

    <!-- Main Analytics Content: District Saturation Chart (720px) & Action Alert (400px) -->
    <g transform="translate(0, 120)">
      
      <!-- Left: District Saturation Breakdown -->
      <g filter="url(#heroShadow)">
        <rect width="720" height="520" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
        <g transform="translate(28, 24)">
          <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">District Saturation Percentage (ST Beneficiaries)</text>
          <text x="0" y="32" font-size="11" fill="#64748B">Comparison of enrolled students against verified ST population per district</text>

          <!-- Bar Chart -->
          <g transform="translate(0, 60)">
            <!-- Ranchi -->
            <text x="0" y="24" font-size="12" font-weight="700" fill="#0F172A">Ranchi District</text>
            <rect x="140" y="8" width="460" height="24" rx="6" fill="#F1F5F9" />
            <rect x="140" y="8" width="404" height="24" rx="6" fill="url(#brandGrad)" />
            <text x="550" y="24" font-size="12" font-weight="800" fill="#047857">88%</text>

            <!-- Khunti -->
            <g transform="translate(0, 50)">
              <text x="0" y="24" font-size="12" font-weight="700" fill="#0F172A">Khunti District</text>
              <rect x="140" y="8" width="460" height="24" rx="6" fill="#F1F5F9" />
              <rect x="140" y="8" width="363" height="24" rx="6" fill="url(#brandGrad)" />
              <text x="510" y="24" font-size="12" font-weight="800" fill="#047857">79%</text>
            </g>

            <!-- Gumla -->
            <g transform="translate(0, 100)">
              <text x="0" y="24" font-size="12" font-weight="700" fill="#0F172A">Gumla District</text>
              <rect x="140" y="8" width="460" height="24" rx="6" fill="#F1F5F9" />
              <rect x="140" y="8" width="294" height="24" rx="6" fill="#F59E0B" />
              <text x="442" y="24" font-size="12" font-weight="800" fill="#B45309">64%</text>
            </g>

            <!-- Latehar (Critical PVTG Gap) -->
            <g transform="translate(0, 150)">
              <text x="0" y="24" font-size="12" font-weight="800" fill="#DC2626">Latehar District ★</text>
              <rect x="140" y="8" width="460" height="24" rx="6" fill="#FEE2E2" />
              <rect x="140" y="8" width="239" height="24" rx="6" fill="#EF4444" />
              <text x="388" y="24" font-size="12" font-weight="900" fill="#DC2626">52% (GAP)</text>
            </g>

            <!-- Simdega -->
            <g transform="translate(0, 200)">
              <text x="0" y="24" font-size="12" font-weight="700" fill="#0F172A">Simdega District</text>
              <rect x="140" y="8" width="460" height="24" rx="6" fill="#F1F5F9" />
              <rect x="140" y="8" width="266" height="24" rx="6" fill="#F59E0B" />
              <text x="414" y="24" font-size="12" font-weight="800" fill="#B45309">58%</text>
            </g>
          </g>

          <!-- Legend -->
          <g transform="translate(0, 360)">
            <rect x="0" y="0" width="14" height="14" rx="3" fill="#047857" />
            <text x="22" y="11" font-size="11" fill="#64748B">&gt;75% High Saturation</text>

            <rect x="180" y="0" width="14" height="14" rx="3" fill="#F59E0B" />
            <text x="202" y="11" font-size="11" fill="#64748B">55–74% Moderate Gap</text>

            <rect x="370" y="0" width="14" height="14" rx="3" fill="#EF4444" />
            <text x="392" y="11" font-size="11" font-weight="700" fill="#DC2626">&lt;55% Critical Saturation Deficit</text>
          </g>
        </g>
      </g>

      <!-- Right: Actionable Mobile Outreach Campaign Card with Component Library Donut & Stepper -->
      <g transform="translate(742, 0)">
        <g filter="url(#cardShadow)">
          <rect width="400" height="520" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
          <g transform="translate(24, 20)">
            <rect x="0" y="0" width="140" height="24" rx="12" fill="#FEE2E2" />
            <text x="70" y="16" font-size="9.5" font-weight="800" fill="#DC2626" class="badge">ACTION REQUIRED</text>

            <text x="0" y="46" font-size="15" font-weight="800" fill="#0F172A">Latehar PVTG Outreach Saturation</text>
            <text x="0" y="62" font-size="11" fill="#64748B">Targeting 3,400 unenrolled Birhor &amp; Korwa youths</text>

            <!-- 1. Component Library: Donut Chart for Demographic Distribution -->
            <g transform="translate(0, 76)">
              <rect width="352" height="136" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
              <text x="14" y="20" font-size="10.5" font-weight="800" fill="#0F172A">TRIBAL SATURATION DEFICIT</text>
              ${renderDonutChartComponent({
                cx: 60,
                cy: 78,
                rOut: 46,
                rIn: 28,
                segments: [
                  { label: 'Santhal', percent: 38, color: '#047857' },
                  { label: 'Oraon', percent: 28, color: '#10B981' },
                  { label: 'Munda', percent: 20, color: '#2563EB' },
                  { label: 'Birhor (PVTG)', percent: 14, color: '#EF4444' }
                ],
                centerValue: '52%',
                centerSub: 'Coverage',
                legendX: 130,
                legendY: 34,
                legendWidth: 206,
                itemHeight: 22
              })}
            </g>

            <!-- 2. Component Library: Rapid Outreach Pipeline Flow Diagram -->
            <g transform="translate(0, 224)">
              <rect width="352" height="126" rx="10" fill="#FEF3C7" stroke="#FDE68A" />
              <text x="14" y="20" font-size="10.5" font-weight="800" fill="#92400E">RAPID INTERVENTION PIPELINE</text>
              ${renderStepperPipelineComponent({
                x: 10,
                y: 34,
                width: 332,
                steps: [
                  { title: 'Gap Alert', sub: '&lt;55% Deficit', status: 'done', badge: 'RESOLVED' },
                  { title: 'DC MoTA', sub: 'Dispatched', status: 'done', badge: 'SENT ✓' },
                  { title: 'Mobile Van', sub: 'En Route', status: 'active', badge: 'ACTIVE ★' },
                  { title: 'CSC Camps', sub: '3.4K Target', status: 'upcoming', badge: 'SCHEDULED' }
                ]
              })}
            </g>

            <!-- Action Buttons -->
            <g transform="translate(0, 366)">
              <rect x="0" y="0" width="352" height="42" rx="8" fill="url(#brandGrad)" />
              <text x="176" y="26" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">Deploy Mobile Registration Van →</text>

              <rect x="0" y="52" width="352" height="40" rx="8" fill="#F1F5F9" stroke="#E2E8F0" />
              <text x="176" y="77" font-size="11.5" font-weight="700" fill="#047857" text-anchor="middle">Export Block Gap Report (CSV)</text>
            </g>
          </g>
        </g>
      </g>

    </g>

  </g>
</svg>`;
}

function make19ForensicAuditLog() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('officer/audit', 'Tribe Saarthi · Forensic Cryptographic Audit Trail')}
  ${renderSidebar('audit', 'officer')}
  ${renderHeader('Cryptographic Audit Trail', 'Immutable append-only system ledger recording all statutory approvals, decisions, and disbursements', 'officer')}

  <g transform="translate(274, 120)">
    
    <!-- Top Verification Banner -->
    <g filter="url(#heroShadow)">
      <rect width="1142" height="80" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(24, 18)">
        <circle cx="22" cy="22" r="22" fill="#ECFDF5" />
        ${I.shield(12, 12, '#047857', 20)}
        <text x="56" y="18" font-size="15" font-weight="800" fill="#0F172A">Audit Ledger Integrity Verified (Merkle Tree Height: 24)</text>
        <text x="56" y="36" font-size="11" fill="#64748B">Root Digest: <tspan class="mono">#77ab42f8...9910c</tspan> · Synced with National Informatics Centre (NIC) Timestamp Authority</text>

        <rect x="940" y="6" width="160" height="36" rx="8" fill="url(#brandGrad)" />
        <text x="1020" y="29" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">Verify Chain Hashes ✓</text>
      </g>
    </g>

    <!-- Table Card with Merkle Hash Chain & Event Donut Component -->
    <g transform="translate(0, 102)" filter="url(#cardShadow)">
      <rect width="1142" height="660" rx="14" fill="#FFFFFF" stroke="#E2E8F0" />
      <g transform="translate(28, 24)">
        <text x="0" y="16" font-size="15" font-weight="800" fill="#0F172A">System Activity &amp; Decision Ledger</text>
        <text x="0" y="32" font-size="11" fill="#64748B">Every event is signed with the actor's cryptographic token and recorded permanently</text>

        <!-- Table Header -->
        <g transform="translate(0, 52)">
          <rect width="1086" height="34" rx="6" fill="#F8FAFC" />
          <text x="16" y="21" font-size="10.5" font-weight="800" fill="#64748B">EVENT #</text>
          <text x="100" y="21" font-size="10.5" font-weight="800" fill="#64748B">ACTION NAME</text>
          <text x="310" y="21" font-size="10.5" font-weight="800" fill="#64748B">ACTOR</text>
          <text x="490" y="21" font-size="10.5" font-weight="800" fill="#64748B">TARGET RECORD</text>
          <text x="680" y="21" font-size="10.5" font-weight="800" fill="#64748B">TIMESTAMP</text>
          <text x="860" y="21" font-size="10.5" font-weight="800" fill="#64748B">SHA-256 HASH</text>
          <text x="1010" y="21" font-size="10.5" font-weight="800" fill="#64748B">STATUS</text>
        </g>

        <!-- Row 1 -->
        <g transform="translate(0, 96)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#F1F5F9" />
          <text x="16" y="22" font-size="11.5" font-weight="700" fill="#0F172A" class="mono">#9824</text>
          <text x="100" y="22" font-size="12" font-weight="700" fill="#047857">SANCTION_ORDER_SIGNED</text>
          <text x="310" y="22" font-size="12" fill="#0F172A">Dr. K. Soren (BIT Desk)</text>
          <text x="490" y="22" font-size="12" fill="#0F172A" class="mono">JH-ST-2026-89412</text>
          <text x="680" y="22" font-size="11" fill="#64748B" class="mono">18 Oct 15:45:00 IST</text>
          <text x="860" y="22" font-size="11" fill="#64748B" class="mono">4f12de90...81</text>
          
          <rect x="990" y="8" width="80" height="20" rx="10" fill="#ECFDF5" />
          <text x="1030" y="21" font-size="9" font-weight="800" fill="#047857" class="badge">VERIFIED ✓</text>
        </g>

        <!-- Row 2 -->
        <g transform="translate(0, 138)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#F1F5F9" />
          <text x="16" y="22" font-size="11.5" font-weight="700" fill="#0F172A" class="mono">#9823</text>
          <text x="100" y="22" font-size="12" font-weight="700" fill="#B45309">OFFICER_REVIEW_START</text>
          <text x="310" y="22" font-size="12" fill="#0F172A">Dr. K. Soren (BIT Desk)</text>
          <text x="490" y="22" font-size="12" fill="#0F172A" class="mono">JH-ST-2026-89412</text>
          <text x="680" y="22" font-size="11" fill="#64748B" class="mono">18 Oct 15:40:12 IST</text>
          <text x="860" y="22" font-size="11" fill="#64748B" class="mono">9921bc10...14</text>
          
          <rect x="990" y="8" width="80" height="20" rx="10" fill="#ECFDF5" />
          <text x="1030" y="21" font-size="9" font-weight="800" fill="#047857" class="badge">VERIFIED ✓</text>
        </g>

        <!-- Row 3 -->
        <g transform="translate(0, 180)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#F1F5F9" />
          <text x="16" y="22" font-size="11.5" font-weight="700" fill="#0F172A" class="mono">#9822</text>
          <text x="100" y="22" font-size="12" font-weight="700" fill="#2563EB">DIGILOCKER_SEAL_PASS</text>
          <text x="310" y="22" font-size="12" fill="#0F172A">MoTA Gateway Daemon</text>
          <text x="490" y="22" font-size="12" fill="#0F172A" class="mono">Caste Cert #4910</text>
          <text x="680" y="22" font-size="11" fill="#64748B" class="mono">18 Oct 14:22:05 IST</text>
          <text x="860" y="22" font-size="11" fill="#64748B" class="mono">a78f21bb...02</text>
          
          <rect x="990" y="8" width="80" height="20" rx="10" fill="#ECFDF5" />
          <text x="1030" y="21" font-size="9" font-weight="800" fill="#047857" class="badge">VERIFIED ✓</text>
        </g>

        <!-- Row 4 -->
        <g transform="translate(0, 222)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#F1F5F9" />
          <text x="16" y="22" font-size="11.5" font-weight="700" fill="#0F172A" class="mono">#9821</text>
          <text x="100" y="22" font-size="12" font-weight="700" fill="#0F172A">APPLICATION_SUBMITTED</text>
          <text x="310" y="22" font-size="12" fill="#0F172A">Scholar: Mohan Birhor</text>
          <text x="490" y="22" font-size="12" fill="#0F172A" class="mono">JH-ST-2026-89412</text>
          <text x="680" y="22" font-size="11" fill="#64748B" class="mono">18 Oct 14:22:01 IST</text>
          <text x="860" y="22" font-size="11" fill="#64748B" class="mono">e3b0c442...99</text>
          
          <rect x="990" y="8" width="80" height="20" rx="10" fill="#ECFDF5" />
          <text x="1030" y="21" font-size="9" font-weight="800" fill="#047857" class="badge">VERIFIED ✓</text>
        </g>

        <!-- Bottom Forensic Intelligence Section -->
        <g transform="translate(0, 280)">
          <line x1="0" y1="0" x2="1086" y2="0" stroke="#E2E8F0" />

          <!-- Left: Merkle Hash-Chain Cryptographic Diagram -->
          <g transform="translate(0, 24)">
            <text x="0" y="14" font-size="12" font-weight="800" fill="#047857">IMMUTABLE MERKLE HASH-CHAIN LINKAGE</text>
            <text x="0" y="30" font-size="10.5" fill="#64748B">Each block payload contains the SHA-256 header hash of the preceding statutory event</text>
            
            <g transform="translate(0, 44)">
              ${renderMerkleChainComponent({
                x: 0,
                y: 0,
                width: 720,
                blocks: [
                  { id: '9821', action: 'APP_SUBMITTED', hash: 'e3b0...99', color: '#64748B' },
                  { id: '9822', action: 'DIGILOCKER_PASS', hash: 'a78f...02', color: '#2563EB' },
                  { id: '9823', action: 'NODAL_REVIEW', hash: '9921...14', color: '#F59E0B' },
                  { id: '9824', action: 'SANCTION_SIGNED', hash: '4f12...81', color: '#047857' }
                ]
              })}
            </g>

            <rect x="0" y="140" width="720" height="42" rx="8" fill="#F0FDF4" stroke="#BBF7D0" />
            <text x="16" y="165" font-size="11" font-weight="700" fill="#047857">✓ Merkle Tree Proof Root: 77ab42f8...9910c (NIC Timestamp Authority Verified)</text>
          </g>

          <!-- Right: Audit Event Distribution Donut Chart -->
          <g transform="translate(760, 24)">
            <text x="0" y="14" font-size="12" font-weight="800" fill="#0F172A">EVENT TYPE BREAKDOWN</text>
            <text x="0" y="30" font-size="10.5" fill="#64748B">Historical audit ledger distribution</text>

            <g transform="translate(0, 44)">
              <rect width="326" height="138" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
              ${renderDonutChartComponent({
                cx: 56,
                cy: 69,
                rOut: 44,
                rIn: 28,
                segments: [
                  { label: 'Sanction DSC', percent: 35, color: '#047857', amount: '3,438' },
                  { label: 'Vault Seals', percent: 25, color: '#2563EB', amount: '2,456' },
                  { label: 'Officer Review', percent: 25, color: '#F59E0B', amount: '2,456' },
                  { label: 'Ingestions', percent: 15, color: '#64748B', amount: '1,474' }
                ],
                centerValue: '9.8K',
                centerSub: 'Audit Logs',
                legendX: 118,
                legendY: 20,
                legendWidth: 198,
                itemHeight: 26
              })}
            </g>
          </g>

        </g>
      </g>
    </g>

  </g>
</svg>`;
}

function make20PilotSigninPortal() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('pilot/signin', 'Tribe Saarthi · Pilot Sign-in Portal')}

  <!-- Split Screen: Left (600px) MoTA Brand / Right (840px) Sign-in Card -->
  <g transform="translate(0, 41)">
    
    <!-- Left Hero: MoTA Tribal Brand Identity -->
    <rect width="580" height="919" fill="url(#brandCardGrad)" />
    <rect width="580" height="919" fill="url(#tribalPattern)" opacity="0.15" />
    <rect x="577" y="0" width="3" height="919" fill="url(#motifGrad)" />

    <g transform="translate(60, 140)">
      <!-- Crest -->
      <circle cx="40" cy="40" r="40" fill="#FFFFFF" fill-opacity="0.12" />
      <circle cx="40" cy="40" r="32" fill="none" stroke="#FDE68A" stroke-width="2" stroke-dasharray="3 2" />
      <text x="40" y="48" font-size="24" font-weight="900" fill="#FFFFFF" text-anchor="middle">TS</text>

      <text x="0" y="130" font-size="32" font-weight="900" fill="#FFFFFF">Tribe Saarthi</text>
      <text x="0" y="160" font-size="14" font-weight="800" fill="#FDE68A" letter-spacing="0.1em">MINISTRY OF TRIBAL AFFAIRS · GOVT OF INDIA</text>

      <text x="0" y="210" font-size="15" fill="#D1FAE5" width="460">
        Direct Scholarship &amp; DBT Benefit Access for Scheduled Tribe Students Across India.
      </text>

      <!-- 3 Value Pillars -->
      <g transform="translate(0, 270)">
        <circle cx="16" cy="16" r="16" fill="#FFFFFF" fill-opacity="0.1" />
        ${I.shield(6, 6, '#A7F3D0', 20)}
        <text x="44" y="14" font-size="14" font-weight="800" fill="#FFFFFF">Direct Benefit Transfer (DBT)</text>
        <text x="44" y="32" font-size="12" fill="#A7F3D0">Funds credited straight to Aadhaar-seeded accounts.</text>

        <g transform="translate(0, 60)">
          <circle cx="16" cy="16" r="16" fill="#FFFFFF" fill-opacity="0.1" />
          ${I.docCheck(6, 6, '#A7F3D0', 20)}
          <text x="44" y="14" font-size="14" font-weight="800" fill="#FFFFFF">DigiLocker Verified Vault</text>
          <text x="44" y="32" font-size="12" fill="#A7F3D0">Zero paper notarization; instant state e-District checks.</text>
        </g>

        <g transform="translate(0, 120)">
          <circle cx="16" cy="16" r="16" fill="#FFFFFF" fill-opacity="0.1" />
          ${I.help(6, 6, '#A7F3D0', 20)}
          <text x="44" y="14" font-size="14" font-weight="800" fill="#FFFFFF">Multilingual Tribal Assistant</text>
          <text x="44" y="32" font-size="12" fill="#A7F3D0">Available in Santhali (Ol Chiki), Hindi, English &amp; Odia.</text>
        </g>
      </g>
    </g>

    <!-- Right: Pilot Sandbox Sign-in Card -->
    <g transform="translate(680, 110)">
      <g filter="url(#heroShadow)">
        <rect width="660" height="700" rx="16" fill="#FFFFFF" stroke="#E2E8F0" />
        
        <g transform="translate(48, 40)">
          <text x="0" y="24" font-size="22" font-weight="900" fill="#0F172A">Sign in to Tribe Saarthi</text>
          <text x="0" y="46" font-size="12" fill="#64748B">Choose your test persona or enter registered mobile credentials</text>

          <!-- 1-Click Fast Persona Switcher Chips (MUI Toggle Button Group) -->
          <g transform="translate(0, 72)">
            <rect width="564" height="114" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
            <text x="16" y="24" font-size="10.5" font-weight="800" fill="#64748B">1-CLICK FAST PERSONA SWITCHER (PILOT SANDBOX)</text>

            <g transform="translate(16, 36)">
              <!-- Persona 1: Scholar (Active) -->
              <rect x="0" y="0" width="124" height="60" rx="8" fill="url(#brandGrad)" />
              <text x="62" y="26" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">🎓 Scholar</text>
              <text x="62" y="44" font-size="9.5" fill="#D1FAE5" text-anchor="middle">Mohan Birhor</text>

              <!-- Persona 2: Nodal Officer -->
              <rect x="134" y="0" width="124" height="60" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
              <text x="196" y="26" font-size="11" font-weight="700" fill="#0F172A" text-anchor="middle">🏛️ College Nodal</text>
              <text x="196" y="44" font-size="9.5" fill="#64748B" text-anchor="middle">Dr. K. Soren</text>

              <!-- Persona 3: Ministry Admin -->
              <rect x="268" y="0" width="124" height="60" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
              <text x="330" y="26" font-size="11" font-weight="700" fill="#0F172A" text-anchor="middle">⚖️ Ministry Admin</text>
              <text x="330" y="44" font-size="9.5" fill="#64748B" text-anchor="middle">MoTA Director</text>

              <!-- Persona 4: Family Member -->
              <rect x="402" y="0" width="124" height="60" rx="8" fill="#FFFFFF" stroke="#CBD5E1" />
              <text x="464" y="26" font-size="11" font-weight="700" fill="#0F172A" text-anchor="middle">👨‍👩‍👦 Guardian</text>
              <text x="464" y="44" font-size="9.5" fill="#64748B" text-anchor="middle">Somra Birhor</text>
            </g>
          </g>

          <!-- Input Fields -->
          <g transform="translate(0, 216)">
            <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">MOBILE NUMBER OR APAAR ID</text>
            <rect x="0" y="24" width="564" height="44" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
            <text x="16" y="52" font-size="13" font-weight="700" fill="#0F172A">+91 94311 02914</text>

            <g transform="translate(0, 84)">
              <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">PASSWORD / AADHAAR OTP</text>
              <rect x="0" y="24" width="564" height="44" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
              <text x="16" y="52" font-size="16" font-weight="800" fill="#0F172A">••••••••••••</text>
            </g>
          </g>

          <!-- Sign-in Button -->
          <g transform="translate(0, 386)">
            <rect width="564" height="46" rx="8" fill="url(#brandGrad)" filter="url(#cardShadow)" />
            <text x="282" y="29" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle">Sign In to Scholar Portal →</text>

            <rect x="0" y="60" width="564" height="44" rx="8" fill="#F1F5F9" />
            <text x="282" y="87" font-size="12" font-weight="700" fill="#047857" text-anchor="middle">Request 6-Digit OTP via SMS</text>
          </g>

          <!-- Links -->
          <g transform="translate(0, 524)">
            <line x1="0" y1="0" x2="564" y2="0" stroke="#F1F5F9" />
            <text x="0" y="28" font-size="11.5" font-weight="700" fill="#047857">Forgot Password or Lost Phone? →</text>
            <text x="564" y="28" font-size="11" fill="#64748B" text-anchor="end">National Helpline: 1800-11-7788</text>
          </g>
        </g>
      </g>
    </g>

  </g>
</svg>`;
}

// =============================================================
// SCREEN 21: Self-Service Password / OTP Recovery Flow
// =============================================================
function make21PasswordRecoveryFlow() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('pilot/recovery', 'Tribe Saarthi · Password & Credential Recovery')}

  <!-- Canvas -->
  <g transform="translate(0, 41)">
    <!-- Centered Box -->
    <g transform="translate(420, 100)" filter="url(#heroShadow)">
      <rect width="600" height="660" rx="16" fill="#FFFFFF" stroke="#E2E8F0" />
      <rect width="600" height="6" rx="3" fill="url(#brandGrad)" />

      <g transform="translate(40, 36)">
        <!-- Emblem -->
        <circle cx="260" cy="24" r="24" fill="url(#brandGrad)" />
        <text x="260" y="32" font-size="15" font-weight="900" fill="#FFFFFF" text-anchor="middle">TS</text>

        <text x="260" y="74" font-size="20" font-weight="900" fill="#0F172A" text-anchor="middle">Account Credential Recovery</text>
        <text x="260" y="94" font-size="12" fill="#64748B" text-anchor="middle">Ministry of Tribal Affairs · Student Verification Portal</text>

        <!-- Stepper Indicator (1. Mobile -> 2. OTP -> 3. New Password) -->
        <g transform="translate(60, 118)">
          <line x1="30" y1="14" x2="370" y2="14" stroke="#E2E8F0" stroke-width="2" />
          
          <circle cx="30" cy="14" r="14" fill="#047857" />
          <text x="30" y="18" font-size="11" font-weight="800" fill="#FFFFFF" text-anchor="middle">1</text>
          <text x="30" y="42" font-size="10" font-weight="700" fill="#047857" text-anchor="middle">Mobile ID</text>

          <circle cx="200" cy="14" r="14" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" />
          <text x="200" y="18" font-size="11" font-weight="700" fill="#64748B" text-anchor="middle">2</text>
          <text x="200" y="42" font-size="10" font-weight="600" fill="#64748B" text-anchor="middle">Verify OTP</text>

          <circle cx="370" cy="14" r="14" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" />
          <text x="370" y="18" font-size="11" font-weight="700" fill="#64748B" text-anchor="middle">3</text>
          <text x="370" y="42" font-size="10" font-weight="600" fill="#64748B" text-anchor="middle">New Password</text>
        </g>

        <!-- Form Input -->
        <g transform="translate(0, 186)">
          <text x="0" y="14" font-size="11" font-weight="700" fill="#334155">ENTER REGISTERED 10-DIGIT MOBILE NUMBER OR APAAR ID</text>
          <rect x="0" y="24" width="520" height="46" rx="8" fill="#F8FAFC" stroke="#CBD5E1" />
          <text x="16" y="52" font-size="14" font-weight="700" fill="#0F172A">+91 94311 02914</text>

          <text x="0" y="88" font-size="11" fill="#64748B">A 6-digit one-time password (OTP) will be dispatched to your Aadhaar-linked phone.</text>
        </g>

        <!-- Send Button -->
        <g transform="translate(0, 290)">
          <rect width="520" height="46" rx="8" fill="url(#brandGrad)" />
          <text x="260" y="28" font-size="13" font-weight="800" fill="#FFFFFF" text-anchor="middle">Send Verification Code via SMS →</text>
        </g>

        <!-- Offline Tribal Helpdesk Fallback -->
        <g transform="translate(0, 360)">
          <rect width="520" height="110" rx="10" fill="#FFFBEB" stroke="#FDE68A" />
          <g transform="translate(16, 16)">
            <text x="0" y="14" font-size="12" font-weight="800" fill="#92400E">Lost Phone or No Cellular Coverage?</text>
            <text x="0" y="32" font-size="11" fill="#78350F">Tribal scholars without mobile access can visit their nearest</text>
            <text x="0" y="48" font-size="11" fill="#78350F">College Nodal Officer (Dr. K. Soren, BIT Mesra) or Common Service Centre (CSC)</text>
            <text x="0" y="64" font-size="11" fill="#78350F">with their original ST certificate to reset credentials in person.</text>
          </g>
        </g>

        <g transform="translate(0, 500)">
          <text x="260" y="24" font-size="12" font-weight="700" fill="#047857" text-anchor="middle">← Return to Login Portal</text>
        </g>
      </g>
    </g>
  </g>
</svg>`;
}

// =============================================================
// SCREEN 22: Public QR Receipt Verification Portal
// =============================================================
function make22PublicReceiptVerification() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1440" height="960" viewBox="0 0 1440 960" fill="none" xmlns="http://www.w3.org/2000/svg">
  ${makeDefs()}
  ${renderDesktopChrome('verify?receipt=JH-ST-2026-89412', 'Tribe Saarthi · Public Scholarship Verification')}

  <!-- Canvas -->
  <g transform="translate(0, 41)">
    
    <!-- Top Government Masthead -->
    <rect width="1440" height="74" fill="#FFFFFF" stroke="#E2E8F0" />
    <g transform="translate(60, 16)">
      <circle cx="20" cy="20" r="20" fill="url(#brandGrad)" />
      <text x="20" y="26" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">TS</text>

      <text x="52" y="18" font-size="15" font-weight="900" fill="#0F172A">Ministry of Tribal Affairs · Government of India</text>
      <text x="52" y="34" font-size="11" font-weight="700" fill="#B45309">PUBLIC DIGITAL SANCTION VERIFICATION PORTAL</text>
    </g>

    <!-- Centered Tamper-Evident Receipt Certificate Card (780px x 720px) -->
    <g transform="translate(330, 100)" filter="url(#heroShadow)">
      <rect width="780" height="740" rx="16" fill="#FFFFFF" stroke="#E2E8F0" />
      <rect width="780" height="6" rx="3" fill="url(#brandGrad)" />

      <g transform="translate(48, 28)">
        
        <!-- Official Verified Stamp Banner -->
        <g transform="translate(0, 0)">
          <rect width="684" height="60" rx="10" fill="#ECFDF5" stroke="#A7F3D0" />
          <circle cx="36" cy="30" r="18" fill="#047857" />
          ${I.shield(26, 20, '#FFFFFF', 20)}

          <text x="68" y="25" font-size="14" font-weight="800" fill="#047857">OFFICIAL MoTA VERIFIED SANCTION RECEIPT</text>
          <text x="68" y="42" font-size="11" fill="#065F46">Statutory scholarship sanction verified against Ministry Public Key Ledger</text>
        </g>

        <!-- Receipt Metadata Table -->
        <g transform="translate(0, 76)">
          <!-- Row 1 -->
          <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">BENEFICIARY SCHOLAR</text>
          <text x="360" y="14" font-size="11" font-weight="700" fill="#64748B">APPLICATION REFERENCE ID</text>
          
          <text x="0" y="36" font-size="15" font-weight="800" fill="#0F172A">Mohan Birhor</text>
          <text x="0" y="52" font-size="11" fill="#64748B">S/o Somra Birhor · Latehar, Jharkhand</text>

          <text x="360" y="36" font-size="15" font-weight="800" fill="#0F172A" class="mono">JH-ST-2026-89412</text>
          <text x="360" y="52" font-size="11" fill="#64748B">Sanction Order: <tspan class="mono">MOTA/2026/SCH/89412</tspan></text>

          <line x1="0" y1="68" x2="684" y2="68" stroke="#F1F5F9" />

          <!-- Row 2 -->
          <g transform="translate(0, 78)">
            <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">ENROLLED INSTITUTION &amp; COURSE</text>
            <text x="360" y="14" font-size="11" font-weight="700" fill="#64748B">TRIBAL COMMUNITY CLASSIFICATION</text>

            <text x="0" y="34" font-size="13" font-weight="700" fill="#0F172A">Birla Institute of Technology (BIT Mesra)</text>
            <text x="0" y="50" font-size="11" fill="#64748B">B.Tech Computer Science &amp; Engg. (Roll: 2024-CSE-104)</text>

            <text x="360" y="34" font-size="13" font-weight="800" fill="#B45309">Birhor (PVTG Tier-1 Priority)</text>
            <text x="360" y="50" font-size="11" fill="#059669">100% Tuition + Maintenance Grant</text>
          </g>

          <line x1="0" y1="146" x2="684" y2="146" stroke="#F1F5F9" />

          <!-- Row 3: Amount Disbursed -->
          <g transform="translate(0, 156)">
            <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">TOTAL SANCTIONED AMOUNT</text>
            <text x="360" y="14" font-size="11" font-weight="700" fill="#64748B">PFMS DBT CHANNEL</text>

            <text x="0" y="42" font-size="24" font-weight="900" fill="#047857">₹132,000.00</text>
            <text x="0" y="58" font-size="10.5" fill="#64748B">Full Grant: Tuition ₹98K + Maintenance ₹34K</text>

            <text x="360" y="36" font-size="13" font-weight="800" fill="#0F172A">Bank of India (Aadhaar Seeded)</text>
            <text x="360" y="52" font-size="11" fill="#64748B">Account: <tspan class="mono">••••••••9012</tspan> · NPCI Status: Active</text>
          </g>
        </g>

        <!-- Cryptographic Proof Box & QR Code -->
        <g transform="translate(0, 320)">
          <rect width="684" height="136" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          
          <g transform="translate(20, 18)">
            <text x="0" y="14" font-size="11" font-weight="700" fill="#64748B">CRYPTOGRAPHIC RECEIPT SHA-256 DIGEST</text>
            <text x="0" y="34" font-size="10" font-weight="700" fill="#065F46" class="mono">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</text>

            <text x="0" y="60" font-size="10.5" fill="#475569">Certified by Digital Signature: <tspan font-weight="700">Dr. K. Soren, Associate Professor, BIT Mesra</tspan></text>
            <text x="0" y="76" font-size="10.5" fill="#475569">Ministry Public Key ID: <tspan class="mono">MOTA-ROOT-CA-2026</tspan> · Timestamp: 18 Oct 2026, 15:45:00 IST</text>
          </g>

          <!-- Vector QR Code Graphic -->
          <g transform="translate(566, 18)">
            <rect width="90" height="90" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" />
            <rect x="8" y="8" width="24" height="24" fill="#0F172A" />
            <rect x="58" y="8" width="24" height="24" fill="#0F172A" />
            <rect x="8" y="58" width="24" height="24" fill="#0F172A" />
            <rect x="38" y="38" width="14" height="14" fill="#0F172A" />
            <text x="45" y="104" font-size="7.5" font-weight="700" fill="#64748B" text-anchor="middle" class="mono">PUBLIC QR</text>
          </g>
        </g>

        <!-- Component Library: End-to-End Cryptographic Trust Pathway Diagram -->
        <g transform="translate(0, 474)">
          <rect width="684" height="106" rx="10" fill="#F8FAFC" stroke="#E2E8F0" />
          <text x="16" y="20" font-size="10.5" font-weight="800" fill="#047857">END-TO-END CRYPTOGRAPHIC TRUST PATHWAY</text>
          ${renderStepperPipelineComponent({
            x: 10,
            y: 28,
            width: 664,
            steps: [
              { title: 'Biometrics', sub: 'UIDAI Match', status: 'done', badge: 'VERIFIED' },
              { title: 'DigiLocker', sub: 'SDO Seal', status: 'done', badge: 'SEALED ✓' },
              { title: 'Officer DSC', sub: 'Class-3 Token', status: 'done', badge: 'SIGNED ✓' },
              { title: 'Merkle Anchor', sub: 'NIC Timestamp', status: 'done', badge: 'ROOT #77ab' },
              { title: 'PFMS DBT', sub: 'Bank of India', status: 'done', badge: 'SETTLED ✓' }
            ]
          })}
        </g>

        <!-- Actions -->
        <g transform="translate(0, 604)">
          <rect width="684" height="46" rx="8" fill="url(#brandGrad)" />
          ${I.download(240, 14, '#FFFFFF', 18)}
          <text x="352" y="28" font-size="12" font-weight="800" fill="#FFFFFF" text-anchor="middle">Download Signed PDF Certificate (Tamper-Sealed) →</text>
        </g>

      </g>
    </g>

  </g>
</svg>`;
}

// -------------------------------------------------------------
// Generation & Export Manifest
// -------------------------------------------------------------
const allGenerators = [
  // 1. Scholar Portal (12 screens)
  { id: '01', name: '01-scholar-dashboard-desktop.svg', dir: scholarDir, fn: make01ScholarDashboardDesktop, rootCopy: '01-student-home.svg' },
  { id: '02', name: '02-scholar-dashboard-mobile.svg', dir: scholarDir, fn: make02ScholarDashboardMobile, rootCopy: '02-student-mobile.svg' },
  { id: '03', name: '03-scholarship-discovery.svg', dir: scholarDir, fn: make03ScholarshipDiscovery, rootCopy: '03-scholarships.svg' },
  { id: '04', name: '04-application-flow-step1-profile.svg', dir: scholarDir, fn: make04ApplicationFlowStep1Profile },
  { id: '05', name: '05-application-flow-step2-documents.svg', dir: scholarDir, fn: make05ApplicationFlowStep2Documents },
  { id: '06', name: '06-application-flow-step3-check-answers.svg', dir: scholarDir, fn: make06ApplicationFlowStep3CheckAnswers },
  { id: '07', name: '07-application-lifecycle-tracker.svg', dir: scholarDir, fn: make07ApplicationLifecycleTracker, rootCopy: '04-applications-tracker.svg' },
  { id: '08', name: '08-digilocker-document-wallet.svg', dir: scholarDir, fn: make08DigiLockerDocumentWallet, rootCopy: '06-document-wallet.svg' },
  { id: '09', name: '09-help-and-saarthi-assistant.svg', dir: scholarDir, fn: make09HelpAndSaarthiAssistant, rootCopy: '07-help-grievances.svg' },
  { id: '10', name: '10-student-profile-and-pvtg.svg', dir: scholarDir, fn: make10StudentProfileAndPvtg },
  { id: '11', name: '11-family-access-consent.svg', dir: scholarDir, fn: make11FamilyAccessConsent },
  { id: '12', name: '12-offline-sync-queue.svg', dir: scholarDir, fn: make12OfflineSyncQueue },

  // 2. Officer Portal (7 screens)
  { id: '13', name: '13-officer-review-queue.svg', dir: officerDir, fn: make13OfficerReviewQueue, rootCopy: '05-officer-review-queue.svg' },
  { id: '14', name: '14-officer-case-detail-inspection.svg', dir: officerDir, fn: make14OfficerCaseDetailInspection },
  { id: '15', name: '15-deficiency-notice-modal.svg', dir: officerDir, fn: make15DeficiencyNoticeModal },
  { id: '16', name: '16-digital-sanction-signing.svg', dir: officerDir, fn: make16DigitalSanctionSigning },
  { id: '17', name: '17-sabotage-switchboard.svg', dir: officerDir, fn: make17SabotageSwitchboard },
  { id: '18', name: '18-coverage-gap-analytics.svg', dir: officerDir, fn: make18CoverageGapAnalytics },
  { id: '19', name: '19-forensic-audit-log.svg', dir: officerDir, fn: make19ForensicAuditLog },

  // 3. System & Authentication (3 screens)
  { id: '20', name: '20-pilot-signin-portal.svg', dir: systemDir, fn: make20PilotSigninPortal, rootCopy: '08-pilot-signin.svg' },
  { id: '21', name: '21-password-recovery-flow.svg', dir: systemDir, fn: make21PasswordRecoveryFlow },
  { id: '22', name: '22-public-receipt-verification.svg', dir: systemDir, fn: make22PublicReceiptVerification },
];

function sanitizeXml(content) {
  return content
    .replace(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;')
    .replace(/<(?=[\s₹0-9])/g, '&lt;');
}

console.log('Writing all 22 recreated studio-grade vector SVGs...');

for (const item of allGenerators) {
  const content = sanitizeXml(item.fn());
  
  // 1. Write to target sub-folder (01-scholar-portal, 02-officer-portal, 03-system-auth)
  const targetPath = path.join(item.dir, item.name);
  fs.writeFileSync(targetPath, content, 'utf8');

  // 2. Write to design-plans/
  const planPath = path.join(designPlansDir, item.name);
  fs.writeFileSync(planPath, content, 'utf8');

  // 3. Root alias copy if applicable
  if (item.rootCopy) {
    const rootPath = path.join(baseOutDir, item.rootCopy);
    fs.writeFileSync(rootPath, content, 'utf8');
  }

  console.log(`✓ Generated ${item.name} (${content.length} bytes)`);
}

// Write the main scholar redesign into design-plans/scholar-dashboard-redesign.svg
fs.writeFileSync(path.join(designPlansDir, 'scholar-dashboard-redesign.svg'), sanitizeXml(make01ScholarDashboardDesktop()), 'utf8');

// -------------------------------------------------------------
// Generate Modern Interactive HTML Gallery
// -------------------------------------------------------------
function makeGalleryHtml() {
  const cardsHtml = allGenerators.map(item => {
    const relPath = path.relative(baseOutDir, path.join(item.dir, item.name)).replace(/\\/g, '/');
    const title = item.name.replace('.svg', '').replace(/^[0-9]+-/, '').replace(/-/g, ' ');
    return `
      <div class="card">
        <div class="preview">
          <img src="${relPath}" alt="${item.name}" loading="lazy" />
        </div>
        <div class="content">
          <span class="num">Screen ${item.id}</span>
          <h3>${title}</h3>
          <div class="actions">
            <a href="${relPath}" target="_blank" class="btn">View Raw SVG ↗</a>
          </div>
        </div>
      </div>
    `;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tribe Saarthi · Complete 22 Vector SVG Mockup Suite</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #FAF7F2;
      margin: 0;
      padding: 40px 24px;
      color: #0F172A;
    }
    .header {
      max-width: 1400px;
      margin: 0 auto 36px auto;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      background: #FEF3C7;
      color: #92400E;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
      border: 1px solid #FDE68A;
    }
    h1 {
      font-size: 32px;
      font-weight: 900;
      color: #047857;
      margin: 0 0 8px 0;
      letter-spacing: -0.02em;
    }
    p.subtitle {
      font-size: 15px;
      color: #64748B;
      margin: 0 0 24px 0;
      max-width: 900px;
      line-height: 1.5;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 28px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .card {
      background: #FFFFFF;
      border-radius: 16px;
      border: 1px solid #E2E8F0;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 10px 15px -3px rgba(15, 23, 42, 0.03);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      flex-direction: column;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05);
    }
    .preview {
      background: #0F172A;
      padding: 16px;
      height: 240px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #E2E8F0;
    }
    .preview img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 6px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }
    .content {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .num {
      font-size: 11px;
      font-weight: 800;
      color: #047857;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .content h3 {
      margin: 4px 0 16px 0;
      font-size: 16px;
      font-weight: 800;
      color: #0F172A;
      text-transform: capitalize;
    }
    .actions {
      margin-top: auto;
    }
    .btn {
      display: inline-block;
      padding: 8px 16px;
      background: #047857;
      color: #FFFFFF;
      text-decoration: none;
      font-size: 12px;
      font-weight: 700;
      border-radius: 8px;
      transition: background 0.15s;
    }
    .btn:hover {
      background: #065F46;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="badge">MINISTRY OF TRIBAL AFFAIRS · TRIBE SAARTHI DESIGN SYSTEM</div>
    <h1>Complete 22 Vector SVG Mockup Suite</h1>
    <p class="subtitle">
      Recreated to studio-grade vector quality adhering to Material UI component specifications (retrieved via Context7), 
      GOV.UK question-page service standards, honest multi-registry verification transparency, and standardized Lucide vector icons.
    </p>
  </div>
  <div class="grid">
    ${cardsHtml}
  </div>
</body>
</html>`;
}

fs.writeFileSync(path.join(baseOutDir, 'index.html'), makeGalleryHtml(), 'utf8');
console.log('✓ Updated docs/ui-mockups/index.html with interactive 22-screen gallery.');

// -------------------------------------------------------------
// Update ZIP Archives
// -------------------------------------------------------------
try {
  const rootZip = path.resolve('Tribe-Saarthi-Complete-22-SVGs (2).zip');
  const docsZip = path.resolve('docs/Tribe-Saarthi-Complete-22-SVGs.zip');
  
  execSync(`powershell -Command "Compress-Archive -Path 'docs/ui-mockups/*' -DestinationPath '${docsZip}' -Force"`, { stdio: 'inherit' });
  console.log('✓ Successfully updated docs/Tribe-Saarthi-Complete-22-SVGs.zip');

  execSync(`powershell -Command "Compress-Archive -Path 'docs/ui-mockups/*' -DestinationPath '${rootZip}' -Force"`, { stdio: 'inherit' });
  console.log('✓ Successfully updated Tribe-Saarthi-Complete-22-SVGs (2).zip');
} catch (e) {
  console.error('Failed to update zip archives:', e.message);
}

console.log('====================================================');
console.log('ALL 22 SVGS RECREATED & EXPORTED SUCCESSFULLY');
console.log('====================================================');
