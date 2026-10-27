import fs from 'node:fs';
import path from 'node:path';

const dirs = [
  'docs/ui-mockups/01-scholar-portal',
  'docs/ui-mockups/02-officer-portal',
  'docs/ui-mockups/03-system-auth',
  'design-plans',
  'docs/ui-mockups'
];

let foundErrors = 0;

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));
  for (const f of files) {
    const filePath = path.join(dir, f);
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      const regex = /&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g;
      let match;
      while ((match = regex.exec(line)) !== null) {
        foundErrors++;
        console.log(`${filePath}:${idx + 1}:${match.index + 1} -> ${line.trim()}`);
      }
    });
  }
}

console.log(`Total unescaped ampersand occurrences found: ${foundErrors}`);
