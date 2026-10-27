import fs from 'node:fs';

const targetPages = [
  { section: 'Design Principles', url: 'https://designsystem.digital.gov/design-principles/' },
  { section: 'Color Overview', url: 'https://designsystem.digital.gov/design-tokens/color/overview/' },
  { section: 'Color Theme Tokens', url: 'https://designsystem.digital.gov/design-tokens/color/theme-tokens/' },
  { section: 'Color State Tokens', url: 'https://designsystem.digital.gov/design-tokens/color/state-tokens/' },
  { section: 'Color System Tokens', url: 'https://designsystem.digital.gov/design-tokens/color/system-tokens/' },
  { section: 'Typesetting Overview', url: 'https://designsystem.digital.gov/design-tokens/typesetting/overview/' },
  { section: 'Font Family', url: 'https://designsystem.digital.gov/design-tokens/typesetting/font-family/' },
  { section: 'Font Size & Scale', url: 'https://designsystem.digital.gov/design-tokens/typesetting/font-size/' },
  { section: 'Spacing Units', url: 'https://designsystem.digital.gov/design-tokens/spacing-units/' },
  { section: 'Elevation & Shadow', url: 'https://designsystem.digital.gov/design-tokens/shadow/' },
  { section: 'Accessibility Guidelines', url: 'https://designsystem.digital.gov/documentation/accessibility/' },
  { section: 'Data Visualizations', url: 'https://designsystem.digital.gov/components/data-visualizations/' },
  { section: 'Complex Form Pattern', url: 'https://designsystem.digital.gov/patterns/complete-a-complex-form/' },
  { section: 'Form & Validation', url: 'https://designsystem.digital.gov/components/validation/' },
  { section: 'Step Indicator', url: 'https://designsystem.digital.gov/components/step-indicator/' },
  { section: 'Alerts', url: 'https://designsystem.digital.gov/components/alert/' },
  { section: 'Card Component', url: 'https://designsystem.digital.gov/components/card/' },
  { section: 'Table Component', url: 'https://designsystem.digital.gov/components/table/' },
  { section: 'Header Component', url: 'https://designsystem.digital.gov/components/header/' },
  { section: 'Government Banner', url: 'https://designsystem.digital.gov/components/banner/' }
];

function cleanHtml(html) {
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let content = mainMatch ? mainMatch[1] : html;
  
  content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // headings
  content = content.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n');
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n');
  content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n');
  content = content.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n\n#### $1\n');
  
  // list items
  content = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
  content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');
  
  // table elements
  content = content.replace(/<th[^>]*>([\s\S]*?)<\/th>/gi, ' | $1 ');
  content = content.replace(/<td[^>]*>([\s\S]*?)<\/td>/gi, ' | $1 ');
  content = content.replace(/<\/tr>/gi, ' |\n');
  
  // strip tags
  content = content.replace(/<[^>]+>/g, ' ');
  
  content = content.replace(/&amp;/g, '&')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&quot;/g, '"')
                   .replace(/&#39;/g, "'")
                   .replace(/&nbsp;/g, ' ');
  
  content = content.replace(/[ \t]+/g, ' ').replace(/\n\s*\n\s*\n+/g, '\n\n');
  return content.trim();
}

async function runScrape() {
  const scrapedData = [];
  for (const item of targetPages) {
    try {
      console.log(`Scraping [${item.section}] from ${item.url}...`);
      const res = await fetch(item.url);
      if (res.status === 200) {
        const text = await res.text();
        const cleaned = cleanHtml(text);
        scrapedData.push({
          section: item.section,
          url: item.url,
          content: cleaned
        });
        console.log(`✓ Got ${item.section} (${cleaned.length} chars)`);
      } else {
        console.warn(`! HTTP ${res.status} for ${item.url}`);
      }
    } catch (err) {
      console.error(`x Error ${item.url}:`, err.message);
    }
  }

  fs.writeFileSync('scripts/uswds_scraped_raw.json', JSON.stringify(scrapedData, null, 2), 'utf8');
  console.log(`Scraped ${scrapedData.length} sections successfully.`);
}

runScrape();
