const CACHE = "eng-levelup-v2";
const ASSETS = [
  "/eng/",
  "/eng/index.html",
  "/eng/manifest.webmanifest",
  "/eng/icon-192.png",
  "/eng/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((r) =>
      r ||
      fetch(e.request).then((res) => {
        const cc = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, cc));
        return res;
      }).catch(() => caches.match("/eng/index.html"))
    )
  );
});