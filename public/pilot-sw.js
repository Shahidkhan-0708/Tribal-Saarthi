const CACHE = 'tribe-pilot-shell-v2';
const root = new URL('./', self.location.href).href;
const staticUrls=['pilot.webmanifest','pilot-icon-180.png','pilot-icon-192.png','pilot-icon-512.png'].map(path=>new URL(path,root).href);
function publicAsset(value) {
  try { const url = new URL(value, root); return url.origin === self.location.origin && !url.search && (staticUrls.includes(url.href) || url.pathname.includes('/assets/') && /\.(js|css|woff2?|png|jpg|jpeg|svg)$/.test(url.pathname)) ? url.href : null; } catch { return null; }
}
self.addEventListener('install', event => { event.waitUntil((async()=>{
 const response=await fetch(new URL('pilot-assets.json',root),{cache:'no-store'});if(!response.ok)throw new Error('Pilot asset manifest unavailable');
 const assets=await response.json();if(!Array.isArray(assets) || assets.length>100 || assets.some(path=>!publicAsset(path)))throw new Error('Invalid pilot asset manifest');
 await (await caches.open(CACHE)).addAll([root,...staticUrls,...assets.map(publicAsset)]);
 await self.skipWaiting();
})()); });
self.addEventListener('message', event => {
  if (event.data?.type !== 'warm-shell' || !Array.isArray(event.data.urls)) return;
  event.waitUntil(caches.open(CACHE).then(cache => Promise.all(event.data.urls.map(publicAsset).filter(Boolean).map(url => cache.add(url).catch(() => {})))));
});
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('tribe-pilot-shell-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || request.headers.has('authorization')) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(async response => {
      if (response.ok && !url.search && url.href === root) await (await caches.open(CACHE)).put(root, response.clone());
      return response;
    }).catch(() => caches.match(root).then(response => response || Response.error())));
    return;
  }
  // Only compiled public assets belong in the response cache; account data stays in scoped IndexedDB.
  if (!publicAsset(url.href)) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(request); if (cached) return cached;
    const response = await fetch(request); if (response.ok && response.type === 'basic') await cache.put(request, response.clone()); return response;
  }));
});
