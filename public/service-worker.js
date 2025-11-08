// Cache App Shell
const CACHE_NAME = 'storymap-cache-v1';
const urlsToCache = ['/', '/index.html', '/bundle.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});

// Push Notification
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title || 'StoryMap Notification';
  const options = {
    body: data.body || 'Ada story baru!',
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    data: { url: data.url || '/' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data.url;
  event.waitUntil(clients.openWindow(url));
});
