/* globals self:true caches:true, fetch:true */
const CACHE_NAME = 'react-CTC';
const urlsToCache = [
  '/bundles/webClient-manifest.js',
  '/bundles/webClient-react.js',
  '/bundles/webClient-vendor.js',
  '/bundles/webClient.js',
];

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  caches.match(event.request).then((response) => {
    console.log(event.request.url, typeof response);
  });
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
