/* globals self:true caches:true, fetch:true */
const CACHE_NAME = 'react-CTC';
// const urlsToCache = [
//   '/bundles/webClient-manifest.js',
//   '/bundles/webClient-react.js',
//   '/bundles/webClient-react-toolbox.js',
//   '/bundles/webClient-vendor.js',
//   '/bundles/webClient.js',
// ];
//
// self.addEventListener('install', (event) => {
//   event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
// });

// self.addEventListener('fetch', (event) => {
//   const url = new self.URL(event.request.url);
//   if (self.location.host === url.host) {
//     console.log(url.pathname);
//   } else {
//     console.log('no match', url);
//   }
//   event.respondWith(caches.match(event.request).then(response => response ||
// fetch(event.request)));
// });

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(
      resp =>
        resp ||
        fetch(event.request).then((response) => {
          console.log('method', event.request.method);
          if (event.request.method === 'GET') {
            console.log('about to cache:', event.request.url);
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone()).catch((err) => {
                console.error(err);
              });
              return response;
            });
          }
          return response;
        })
    )
  );
});
