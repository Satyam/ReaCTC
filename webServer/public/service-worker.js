/* globals self:true caches:true, fetch:true */
const CACHE_NAME = 'react-CTC';
const urlsToCache = [
  '/bundles/webClient-manifest.js',
  '/bundles/webClient-react.js',
  '/bundles/webClient-react-toolbox.js',
  '/bundles/webClient-vendor.js',
  '/bundles/webClient.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(caches.match(event.request).then(response => response || fetch(event.request)));
});
