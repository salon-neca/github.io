// *** 34e
var vrz= 'cch34f';
// ***************************************************************************
self.addEventListener('install', function(event)
{
  event.waitUntil(
    caches.open(vrz).then(function(cache) {
      return cache.addAll(['/', 'index.html', 'client.js', 'style.css',
                           'manifest.json', 'aux/aux.js', 'aux/ibm.ttf',
                           'aux/icon-144.png', 'aux/a.jpg',
                           'aux/b.png', 'aux/c.png']);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event)
{
  event.waitUntil(
    caches.keys().then(function(ns) {
      return Promise.all(ns.map(function(nm) {
        if(nm !== vrz) {
          return caches.delete(nm); }
      }) );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request, {ignoreVary:true, ignoreSearch:true})
    .then(function(response) {
      return response || fetch(event.request)
    })
  );
});
