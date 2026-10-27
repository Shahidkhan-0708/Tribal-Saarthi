import fs from 'node:fs';

async function listComponents() {
  const res = await fetch('https://designsystem.digital.gov/components/');
  const html = await res.text();
  const matches = html.match(/href="\/components\/([^"/]+)\/"/g) || [];
  const compSlugs = [...new Set(matches.map(m => m.replace(/href="\/components\/|\/"/g, '')))];
  console.log('Component slugs:', compSlugs.length, compSlugs);
}

listComponents();
