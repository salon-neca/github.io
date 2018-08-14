// *** [18j]..23z-24abcdef[24g]25hijkl[25m]
self.addEventListener('install', e => {
  caches.delete('saloncch').then(cache => {
      caches.open('saloncch').then(cache => {
        return cache.addAll([ '/', '/index.html', '/client.js', '/style.css',
                 '/manifest.json', '/aux/aux.js', '/aux/ibm.ttf', '/aux/quack.wav',
                  '/aux/a.jpg', '/aux/b.png', '/aux/c.png'])
          .then(() => self.skipWaiting());
      }); });
});
self.addEventListener('activate', event => {self.clients.claim(); });
self.addEventListener('fetch', event => {event.respondWith(
  caches.match(event.request, {ignoreSearch:true})
    .then( response => {return response || fetch(event.request)} ) );
});
