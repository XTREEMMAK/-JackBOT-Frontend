const CACHE_NAME = 'jackbot-v2';
const OFFLINE_URL = '/offline';

const ASSETS_TO_CACHE = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Vite fingerprints these with a content hash, so once cached they never
// change under the same URL - safe to serve straight from cache forever.
const IMMUTABLE_PATH_PREFIX = '/_app/immutable/';

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Network-first: always try the network so a stale/invalid session (e.g.
// behind an SSO reverse proxy) has a chance to redirect to login instead of
// being masked by an indefinitely-cached app shell. Only fall back to the
// cache (and then the offline page, for navigations) when the network
// request itself fails, i.e. genuinely offline.
function networkFirst(event) {
  return fetch(event.request)
    .then(response => {
      if (response && response.status === 200 && response.type === 'basic') {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
      }
      return response;
    })
    .catch(() => {
      return caches.match(event.request).then(cached => {
        if (cached) {
          return cached;
        }
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    });
}

function cacheFirst(event) {
  return caches.match(event.request).then(cached => {
    if (cached) {
      return cached;
    }
    return fetch(event.request).then(response => {
      if (response && response.status === 200 && response.type === 'basic') {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseToCache));
      }
      return response;
    });
  });
}

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip non-GET requests (e.g. the /api/webhook POST) - let those go
  // straight to the network untouched.
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip Chrome extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  const url = new URL(event.request.url);
  const isImmutableAsset = url.origin === self.location.origin && url.pathname.startsWith(IMMUTABLE_PATH_PREFIX);

  event.respondWith(isImmutableAsset ? cacheFirst(event) : networkFirst(event));
});

// Message event - for communication with the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
