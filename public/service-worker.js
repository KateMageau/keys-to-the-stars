// Keys to the Stars — Service Worker
// Minimal service worker to enable PWA install prompt in Chrome

const CACHE_NAME = 'kts-v1';

// On install — cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/glossary.html',
      ]);
    })
  );
  self.skipWaiting();
});

// On activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// On fetch — network first, fall back to cache
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip API calls — always go to network
  if (event.request.url.includes('rapidapi') || event.request.url.includes('api.')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses for static assets
        if (response.ok && event.request.url.includes(self.location.origin)) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
