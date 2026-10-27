import fs from 'node:fs';

async function fetchLinks() {
  const res = await fetch('https://designsystem.digital.gov/');
  const html = await res.text();
  const matches = html.match(/href="([^"]+)"/g) || [];
  const links = [...new Set(matches.map(m => m.replace(/href="|"/g, '')))]
    .filter(l => l.startsWith('/') && !l.startsWith('//') && !l.endsWith('.css') && !l.endsWith('.js') && !l.endsWith('.png') && !l.endsWith('.svg'));
  
  console.log(`Found ${links.length} links on homepage:`);
  console.log(links.sort());
}

fetchLinks();
