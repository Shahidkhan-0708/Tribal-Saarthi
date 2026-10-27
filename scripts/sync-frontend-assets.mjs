import fs from 'node:fs';
import path from 'node:path';

fs.mkdirSync('src/assets', { recursive: true });
let css = fs.readFileSync('frontend/assets/app.css', 'utf8');
css = css.replace(/url\(['"]?fonts\//g, "url('/assets/fonts/");
fs.writeFileSync('src/assets/app.css', css, 'utf8');
console.log('Successfully created src/assets/app.css, size:', css.length);
