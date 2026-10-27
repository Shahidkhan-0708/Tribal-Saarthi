import fs from 'node:fs';

async function findTokenPages() {
  const pages = [
    'https://designsystem.digital.gov/design-tokens/',
    'https://designsystem.digital.gov/design-tokens/color/overview/',
    'https://designsystem.digital.gov/design-tokens/color/system-tokens/',
    'https://designsystem.digital.gov/design-tokens/color/theme-tokens/',
    'https://designsystem.digital.gov/design-tokens/color/state-tokens/',
    'https://designsystem.digital.gov/design-tokens/typesetting/overview/',
    'https://designsystem.digital.gov/design-tokens/typesetting/font-family/',
    'https://designsystem.digital.gov/design-tokens/typesetting/font-size/',
    'https://designsystem.digital.gov/design-tokens/typesetting/line-height/',
  ];

  const results = [];
  for (const p of pages) {
    try {
      const res = await fetch(p);
      console.log(`${p} -> ${res.status}`);
      if (res.status === 200) {
        results.push(p);
      }
    } catch (e) {
      console.log(`${p} -> error ${e.message}`);
    }
  }

  // Also fetch design-tokens main page and find all links
  const res = await fetch('https://designsystem.digital.gov/design-tokens/');
  const html = await res.text();
  const matches = html.match(/href="([^"]+)"/g) || [];
  const links = [...new Set(matches.map(m => m.replace(/href="|"/g, '')))].filter(l => l.startsWith('/design-tokens/'));
  console.log('All design token links:', links);
}

findTokenPages();
