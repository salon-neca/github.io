
// *** r02 a
self.addEventListener('install', e => {
  caches.delete('saloncch').then(cache => {
      caches.open('saloncch').then(cache => {
        return cache.addAll([ '/', '/index.html', '/client.js', '/icons/aux.js',
          '/style.css', '/manifest.json', '/icons/ibm.ttf', '/icons/quack.wav' ])
          .then(() => self.skipWaiting());
      }); });
});
self.addEventListener('activate', event => {self.clients.claim(); });
self.addEventListener('fetch', event => {event.respondWith(
  caches.match(event.request, {ignoreSearch:true})
    .then( response => {return response || fetch(event.request)} ) );
});
