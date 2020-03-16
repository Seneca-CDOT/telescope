// show a notification after 15 seconds (the notification permission must be granted first)
setTimeout(() => {
  window.self.ServiceWorkerRegistration.showNotification('Hello, world!');
}, 15000);
