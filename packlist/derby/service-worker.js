// Bump when deploying change so old caches get replaced
const CACHE_NAME = "derby-pack-v0.0.0";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/star-skate.png",
  "./icons/star-skate.png",
  "./icons/star-skate.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Mix of cache & Network-first - cache for app functionability & network for weather
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req))
    );
  }
  // api.open-meteo.com requests just fetched normally.
});