self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { corps: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.titre || 'Marine Le Masson', {
    body: d.corps || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: d.id || undefined, renotify: !!d.id, data: { url: d.url || './' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of list) {
      if ('focus' in c) {
        if (url.includes('vue=messages')) c.postMessage({ vue: 'messages' });
        return c.focus();
      }
    }
    return self.clients.openWindow(url);
  })());
});
