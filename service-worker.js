const CACHE_NAME = "ultimateenem-experience-v37-notas-acertos-tri";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./enem-data.js",
  "./habilidades-frequencia-data.js",
  "./enem-tri-acerto-data.js",
  "./enem-notas-acertos-tri-data.js",
  "./enem-intelligence-data.js",
  "./redacao-db.js",
  "./redacao-microdados-data.js",
  "./redacao-inteligencia-stage9-data.js",
  "./manifest.webmanifest",
  "./daily-news-bootstrap.js",
  "./assets/brand/ultimate-enem-prof-cav.png",
  "./assets/brand/plano-diario-foco-prof-cav.png",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          const copy = response.clone();
          if (response.ok && new URL(request.url).origin === self.location.origin) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          if (request.mode === "navigate") return caches.match("./index.html");
          return caches.match(request);
        });
    }),
  );
});
