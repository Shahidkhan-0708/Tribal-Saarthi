import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({mode}) => {
 const pilot=loadEnv(mode,process.cwd(),'VITE_').VITE_APP_MODE==='pilot';
 let base='/';
 return {
  server: {
    host: '0.0.0.0',
  },
  plugins: [react(),{
    name:'pilot-installation',
    configResolved(config){base=config.base;},
    transformIndexHtml(){return pilot ? [
      {tag:'link',attrs:{rel:'manifest',href:`${base}pilot.webmanifest`}},
      {tag:'link',attrs:{rel:'apple-touch-icon',href:`${base}pilot-icon-180.png`}},
      {tag:'meta',attrs:{name:'theme-color',content:'#153e32'}},
      {tag:'meta',attrs:{name:'apple-mobile-web-app-capable',content:'yes'}},
    ] : [];},
    generateBundle(_options,bundle){if(pilot)this.emitFile({type:'asset',fileName:'pilot-assets.json',source:JSON.stringify(Object.keys(bundle).filter(name=>/\.(js|css)$/.test(name)).map(name=>`${base}${name}`))});},
  }],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'zustand',
      'react-router-dom',
      '@mui/material/styles',
      '@mui/material/Drawer',
      '@mui/material/Dialog',
    ],
  },
  build: {
    chunkSizeWarningLimit: 900,
  },
  // Vitest owns the src suites; scripts/*.test.mjs are node:test files with their own runner.
  test: {
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', 'scripts/**'],
    testTimeout: 20000,
    fileParallelism: false,
  },
 };
});
