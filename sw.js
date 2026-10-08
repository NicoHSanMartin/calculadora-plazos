const CACHE = "plazos-oj-v2";
const FILES = [
  "./calculadora_judicial_corrientes.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./favicon.ico"
];

self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(c) { return c.addAll(FILES); })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    })
  );
  self.clients.claim();
});

// Network first: siempre intenta traer la versión nueva; si no hay conexión, usa la guardada.
self.addEventListener("fetch", function(e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request, { cache: "no-cache" })
      .then(function(resp) {
        if (resp && resp.ok) {
          const copia = resp.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, copia); });
        }
        return resp;
      })
      .catch(function() { return caches.match(e.request); })
  );
});
