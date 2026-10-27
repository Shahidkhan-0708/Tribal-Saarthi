import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const dirs = [
  'docs/ui-mockups/01-scholar-portal',
  'docs/ui-mockups/02-officer-portal',
  'docs/ui-mockups/03-system-auth',
  'design-plans',
  'docs/ui-mockups'
];

function sanitizeXml(content) {
  // Replace unescaped & with &amp;
  // This matches & that is NOT followed by valid XML entity (amp, lt, gt, quot, apos, #123, #xABC)
  let fixed = content.replace(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');

  // Replace raw < inside text nodes like "< ₹6L" or "<55%" with &lt;
  // Specifically < followed by a space, currency symbol, or digit
  fixed = fixed.replace(/<(?=[\s₹0-9])/g, '&lt;');

  return fixed;
}

let totalFixed = 0;

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
  for (const f of files) {
    const p = path.join(dir, f);
    const original = fs.readFileSync(p, 'utf8');
    const sanitized = sanitizeXml(original);
    if (original !== sanitized) {
      fs.writeFileSync(p, sanitized, 'utf8');
      totalFixed++;
      console.log(`Fixed XML entities in: ${p}`);
    }
  }
}

console.log(`Total files updated: ${totalFixed}`);
