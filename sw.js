/*** [27z]-31
abcdefgh
*/
self.addEventListener('install', function(event)
{
  event.waitUntil(
    caches.open('saloncch').then(function(cache) {
      return cache.addAll([ '/', '/index.html', '/client.js', '/style.css',
               '/manifest.json', '/aux/aux.js', '/aux/ibm.ttf', '/aux/quack.wav',
               '/aux/icon-144.png', '/aux/a.jpg', '/aux/b.png', '/aux/c.png']);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.delete('saloncch').then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request, {ignoreSearch:true})
    .then(function(response) {
      return response || fetch(event.request)
    })
  );
});


/*** [31c]
defg
*/
// ****************************************************************************** 
/*self.addEventListener('install', function(event)
{
  self.skipWaiting();
  
  event.waitUntil(
      
      caches.delete('saloncch').then(function() {

        caches.open('saloncch').then(function(cache) {
          return cache.addAll([ '/', '/index.html', '/client.js', '/style.css',
                 '/manifest.json', '/aux/aux.js', '/aux/ibm.ttf', '/aux/quack.wav',
                 '/aux/icon-144.png', '/aux/a.jpg', '/aux/b.png', '/aux/c.png']); 
        });
      })
  );
});

self.addEventListener('activate', function(event) {
// event.waitUntil(
   return self.clients.claim();
   
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
//    caches.match(event.request, {ignoreSearch:true})
    
  
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request)
    })
  );
});
*/

// In this sample, there is no reason to create event listeners unless the methods we want to use
// are available. In a real-world service worker, you'd likely include the skipWaiting() or
// clients.claim() call as part of the promise chain that is passed to waitUntil() in your
// existing event listeners.
/*
  self.addEventListener('install', function(e) {
    // See https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-global-scope-skipwaiting
    e.waitUntil(
      
        caches.open('saloncch').then(function(cache) {
          self.skipWaiting();
          return cache.addAll([ '/', '/index.html', '/client.js', '/style.css',
                 '/manifest.json', '/aux/aux.js', '/aux/ibm.ttf', '/aux/quack.wav',
                 '/aux/icon-144.png', '/aux/a.jpg', '/aux/b.png', '/aux/c.png']); 
        })
      
    );
  });

  self.addEventListener('activate', function(e) {
    // See https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#clients-claim-method
    e.waitUntil(self.clients.claim());
  });


self.addEventListener('fetch', function(event) {
  event.respondWith(
//    caches.match(event.request, {ignoreSearch:true})
    
  
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request)
    })
  );
});
*/

