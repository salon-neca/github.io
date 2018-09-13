// *** 33v
// *** 33 nopqrstuvx
// *********************************************************************
self.addEventListener('install', function(event)
{
  event.waitUntil(
    caches.open('saloncch').then(function(cache) {
      return cache.addAll([ '/', '/index.html', '/client.js', '/style.css',
                           '/manifest.json', '/aux/aux.js', '/aux/ibm.ttf',
                           '/aux/quack.wav', '/aux/icon-144.png',
                           '/aux/a.jpg', '/aux/b.png', '/aux/c.png']);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
       self.clients.claim()
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      return response || fetch(event.request)
    })
  );
});
