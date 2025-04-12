const CACHE_NAME = `maze-pwa`
const CACHE_CONTENT = [
  '/',
  '/main.js',
  '/css/styles.css',
  '/css/fontawesome.min.css',
  '/css/solid.min.css',
  '/webfonts/fa-solid-900.ttf',
  '/webfonts/fa-solid-900.woff2',
  '/gridBase0.json',
  '/gridBase1.json',
  '/gridBase2.json',
  '/gridBase3.json',
  '/gridBase4.json',
  '/gridBase5.json',
  '/gridBase6.json',
  '/gridBase7.json',
  '/gridBase8.json',
  '/gridBase9.json',
];

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(CACHE_CONTENT);
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Get the resource from the cache.
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
        try {
          // If the resource was not in the cache, try the network.
          const fetchResponse = await fetch(event.request);

          // Save the resource in the cache and return it.
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        } catch (e) {
          // The network failed.
        }
    }
  })());
});