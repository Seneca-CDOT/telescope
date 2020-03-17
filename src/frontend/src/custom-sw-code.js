// Call Install Event
window.self.addEventListener('install', e => {
  console.log(`Service Worker Installed`);
});

// Call Activate Event
window.self.addEventListener('activate', e => {
  console.log(`Service Worker Activated`);
});

// show a notification after 15 seconds (the notification permission must be granted first)
setTimeout(() => {
  window.self.ServiceWorkerRegistration.showNotification('Hello, world!');
}, 15000);
