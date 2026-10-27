import fs from 'node:fs';

const pages = [
  '/design-principles/',
  '/design-tokens/color/',
  '/design-tokens/typesetting/',
  '/design-tokens/spacing-units/',
  '/design-tokens/shadow/',
  '/documentation/accessibility/',
  '/components/data-visualizations/',
  '/patterns/intro/',
  '/patterns/complete-a-complex-form/',
  '/patterns/select-a-language/',
  '/how-to-use-uswds/'
];

function cleanHtml(html) {
  // extract main content
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  let content = mainMatch ? mainMatch[1] : html;
  
  // remove scripts, styles
  content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // convert headings
  content = content.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n');
  content = content.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n');
  content = content.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n');
  content = content.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n\n#### $1\n');
  
  // convert list items
  content = content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
  content = content.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');
  
  // remove remaining tags
  content = content.replace(/<[^>]+>/g, ' ');
  
  // decode entities
  content = content.replace(/&amp;/g, '&')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&quot;/g, '"')
                   .replace(/&#39;/g, "'")
                   .replace(/&nbsp;/g, ' ');
  
  // collapse multiple whitespace
  content = content.replace(/[ \t]+/g, ' ').replace(/\n\s*\n\s*\n+/g, '\n\n');
  return content.trim();
}

async function scrapeKeyPages() {
  const results = {};
  for (const page of pages) {
    try {
      console.log(`Fetching ${page}...`);
      const res = await fetch(`https://designsystem.digital.gov${page}`);
      const html = await res.text();
      results[page] = cleanHtml(html);
      console.log(`✓ Fetched ${page} (${results[page].length} chars)`);
    } catch (e) {
      console.error(`Failed ${page}:`, e.message);
    }
  }

  fs.writeFileSync('scripts/scraped_uswds_summary.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Saved summary to scripts/scraped_uswds_summary.json');
}

scrapeKeyPages();
