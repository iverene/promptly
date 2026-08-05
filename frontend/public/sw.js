const CACHE_NAME = 'promptly-shell-v2';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/favicon.svg', '/pwa-192.png', '/pwa-512.png', '/pwa-maskable-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
  self.clients.claim();
});

function canCache(request, url) {
  return request.method === 'GET'
    && url.origin === self.location.origin
    && !url.pathname.startsWith('/api/')
    && !request.headers.has('Authorization');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (!canCache(request, url)) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request)
      .then((response) => {
        if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', response.clone()));
        return response;
      })
      .catch(() => caches.match('/index.html')));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
    return response;
  })));
});
