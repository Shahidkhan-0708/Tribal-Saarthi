import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve('scripts/recreate_all_22_svgs.mjs');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Insert Component Library Helpers right before makeDefs
const helperMarker = '// -------------------------------------------------------------\n// Defs, Gradients, Shadows & Fonts';
const componentLibraryHelpers = `// -------------------------------------------------------------
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
    return \`<path d="\${arc}" fill="\${s.color}" stroke="#FFFFFF" stroke-width="2" />\`;
  }).join('\\n');

  const centerText = \`
    <text x="\${cx}" y="\${cy - (centerSub ? 2 : -5)}" font-size="14" font-weight="900" fill="#0F172A" text-anchor="middle" class="stat-anchor">\${centerValue}</text>
    \${centerSub ? \`<text x="\${cx}" y="\${cy + 13}" font-size="8.5" font-weight="700" fill="#64748B" text-anchor="middle">\${centerSub}</text>\` : ''}
  \`;

  let legends = '';
  if (legendX !== undefined && legendY !== undefined) {
    legends = \`<g transform="translate(\${legendX}, \${legendY})">
      \${segments.map((s, idx) => {
        const row = Math.floor(idx / legendCols);
        const col = idx % legendCols;
        const lx = col * legendWidth;
        const ly = row * itemHeight;
        return \`
          <g transform="translate(\${lx}, \${ly})">
            <rect x="0" y="2" width="9" height="9" rx="2.5" fill="\${s.color}" />
            <text x="14" y="10" font-size="10.5" font-weight="600" fill="#334155">\${s.label}</text>
            <text x="\${legendWidth - 4}" y="10" font-size="10.5" font-weight="800" fill="\${s.color}" text-anchor="end">\${s.percent}%\${s.amount ? \` · \${s.amount}\` : ''}</text>
          </g>
        \`;
      }).join('\\n')}
    </g>\`;
  }

  return \`
    <g class="donut-chart-component">
      \${paths}
      \${centerText}
      \${legends}
    </g>
  \`;
}

function renderStepperPipelineComponent({ x, y, width, steps }) {
  const stepCount = steps.length;
  const stepSpacing = (width - 40) / (stepCount - 1);

  return \`
    <g transform="translate(\${x}, \${y})" class="pipeline-diagram-component">
      <line x1="20" y1="14" x2="\${width - 20}" y2="14" stroke="#E2E8F0" stroke-width="3" stroke-linecap="round" />
      \${steps.map((st, i) => {
        const sx = 20 + i * stepSpacing;
        const isDone = st.status === 'done';
        const isActive = st.status === 'active';
        
        let nodeIcon = '';
        if (isDone) {
          nodeIcon = \`
            <circle cx="\${sx}" cy="14" r="12" fill="#047857" />
            \${I.check(sx - 6, 8, '#FFFFFF', 12)}
          \`;
        } else if (isActive) {
          nodeIcon = \`
            <circle cx="\${sx}" cy="14" r="14" fill="url(#amberGrad)" />
            <circle cx="\${sx}" cy="14" r="18" fill="none" stroke="#F59E0B" stroke-width="2" stroke-dasharray="3 3" />
            <circle cx="\${sx}" cy="14" r="4.5" fill="#FFFFFF" />
          \`;
        } else {
          nodeIcon = \`
            <circle cx="\${sx}" cy="14" r="11" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5" />
            <text x="\${sx}" y="18" font-size="9.5" font-weight="700" fill="#64748B" text-anchor="middle">\${i + 1}</text>
          \`;
        }

        const textColor = isDone ? '#047857' : (isActive ? '#B45309' : '#64748B');
        const textWeight = isActive ? '800' : '700';

        return \`
          <g>
            \${nodeIcon}
            <text x="\${sx}" y="36" font-size="10" font-weight="\${textWeight}" fill="\${textColor}" text-anchor="middle">\${st.title}</text>
            \${st.sub ? \`<text x="\${sx}" y="\${st.badge ? 47 : 49}" font-size="8.5" font-weight="500" fill="#64748B" text-anchor="middle">\${st.sub}</text>\` : ''}
            \${st.badge ? \`
              <rect x="\${sx - 32}" y="52" width="64" height="15" rx="7.5" fill="\${isActive ? '#FEF3C7' : (isDone ? '#ECFDF5' : '#F1F5F9')}" />
              <text x="\${sx}" y="63" font-size="7.5" font-weight="800" fill="\${textColor}" text-anchor="middle">\${st.badge}</text>
            \` : ''}
          </g>
        \`;
      }).join('\\n')}
    </g>
  \`;
}

function renderMerkleChainComponent({ x, y, width, blocks }) {
  const blockWidth = (width - (blocks.length - 1) * 36) / blocks.length;
  return \`
    <g transform="translate(\${x}, \${y})" class="merkle-chain-component">
      \${blocks.map((b, i) => {
        const bx = i * (blockWidth + 36);
        const arrow = i < blocks.length - 1 ? \`
          <g transform="translate(\${bx + blockWidth}, 26)">
            <line x1="6" y1="0" x2="30" y2="0" stroke="#047857" stroke-width="2" stroke-dasharray="3 2" />
            <polygon points="30,0 24,-4 24,4" fill="#047857" />
            <text x="18" y="-6" font-size="7.5" font-weight="700" fill="#047857" text-anchor="middle" class="mono">SHA-256</text>
          </g>
        \` : '';

        return \`
          <g transform="translate(\${bx}, 0)">
            <rect width="\${blockWidth}" height="58" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.2" />
            <rect width="\${blockWidth}" height="4" rx="2" fill="\${b.color || '#047857'}" />
            <text x="10" y="16" font-size="9.5" font-weight="800" fill="#64748B" class="mono">BLOCK #\${b.id}</text>
            <text x="10" y="30" font-size="10" font-weight="700" fill="#0F172A">\${b.action}</text>
            <text x="10" y="46" font-size="8.5" font-weight="600" fill="#047857" class="mono">\${b.hash}</text>
            <circle cx="\${blockWidth - 14}" cy="16" r="6" fill="#ECFDF5" />
            \${I.check(blockWidth - 18, 12, '#047857', 8)}
            \${arrow}
          </g>
        \`;
      }).join('\\n')}
    </g>
  \`;
}

\n` + helperMarker;

if (!code.includes('renderDonutChartComponent')) {
  code = code.replace(helperMarker, componentLibraryHelpers);
  console.log('✓ Injected Component Library Helpers');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('Helpers written successfully.');
