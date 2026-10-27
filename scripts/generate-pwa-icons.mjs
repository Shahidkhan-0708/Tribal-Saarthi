import {readFile,writeFile} from 'node:fs/promises';
import {chromium} from '@playwright/test';
const logo=await readFile('public/favicon.svg','utf8');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="#4a3420"/><g transform="translate(6.4 6.4) scale(.8)">${logo.replace(/<\/?svg[^>]*>/g,'')}</g></svg>`;
const browser=await chromium.launch({headless:true});
try {
 const page=await browser.newPage();
 for(const size of [180,192,512]){
  const png=await page.evaluate(async({svg,size})=>{const img=new Image();img.src=`data:image/svg+xml;base64,${btoa(svg)}`;await img.decode();const canvas=document.createElement('canvas');canvas.width=canvas.height=size;canvas.getContext('2d').drawImage(img,0,0,size,size);return canvas.toDataURL('image/png').split(',')[1];},{svg,size});
  await writeFile(`public/pilot-icon-${size}.png`,Buffer.from(png,'base64'));
 }
 console.log('Generated three pilot icons from the existing brand artwork.');
}finally{await browser.close();}
