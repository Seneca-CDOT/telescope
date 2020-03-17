const cacheName = 'v1';

// Call Install Event
window.self.addEventListener('install', e => {
  console.log(`Service Worker Installed`);
});

// Call Activate Event
window.self.addEventListener('activate', e => {
  console.log(`Service Worker Activated`);

  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log('Service Worker Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
window.self.addEventListener('fetch', e => {
  console.log('Service Worker Fetching');
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Make copy of response
        const resClone = res.clone();
        // Open cache
        caches.open(cacheName).then(cache => {
          // Add response to cache
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(err => caches.match(e.request).then(res => res))
  );
});

// show a notification after 15 seconds (the notification permission must be granted first)
setTimeout(() => {
  window.self.ServiceWorkerRegistration.showNotification('Hello, world!');
}, 15000);
