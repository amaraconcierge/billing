/* Amara pop-up notifications. This small file lets your computer or phone show Amara notifications even
   when Amara is closed. It only shows notifications and opens Amara when you click one; it does not
   store or cache anything else. Upload it next to index.html (same folder). */
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(e){
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch(x){ d = { title: 'Amara', body: e.data ? e.data.text() : '' }; }
  // Always show it (Safari stops sending pop-ups to sites that receive one without showing it)
  e.waitUntil(self.registration.showNotification(d.title || 'Amara', {
    body: d.body || '',
    tag: d.tag || undefined,          // several messages in one chat replace each other instead of piling up
    renotify: !!d.tag,
    icon: 'icon-192.png',
    badge: 'badge-96.png',
    data: { url: d.url || './' },
    timestamp: Date.now()
  }));
});

self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list){
    for (var i = 0; i < list.length; i++){
      var c = list[i];
      if (c.url.indexOf(self.registration.scope) === 0){
        c.postMessage({ amaraOpen: url });
        return c.focus();
      }
    }
    return self.clients.openWindow(url);
  }));
});
