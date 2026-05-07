const CACHE = 'motivation-v1';

self.addEventListener('install', (event) => {
  // Pre-cache the app shell so offline launch works
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(['/', '/dashboard']))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Remove stale caches from previous versions
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET and cross-origin requests
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;

  // Skip API routes and auth routes — always hit the network
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) return;

  if (request.mode === 'navigate') {
    // Navigation: network-first, fall back to cached shell
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
  } else {
    // Static assets: cache-first
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(request, clone));
            return res;
          })
      )
    );
  }
});
