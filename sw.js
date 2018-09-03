// *** [31c..i]
// *** defghijklmnopqrs2
// ******************************************************************************
self.addEventListener('install', function(e)
{
  e.waitUntil(
    //      caches.delete('saloncch').then(function() {
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

self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
  // ignoreVary...?  
    caches.match(event.request) //, {ignoreSearch:true}
      .then(function(response) { return response || fetch(event.request); })
  );
});
