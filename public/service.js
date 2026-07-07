//https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/CycleTracker/Service_workers

// The version of the cache.
// change whenever APP_STATIC_RESOURCES is changed
const VERSION = "1";

// The name of the cache
const CACHE_NAME = `otsukare-${VERSION}`;

// The static resources that the app needs to function.
var APP_STATIC_RESOURCES = [
    "/",

    "/html/404.html",

    "/html/AAAkana.html",
    "/html/AABkanji.html",
    "/html/AACparticles.html",
    "/html/AADconjugations.html",
    "/html/AAEnumbers & counters.html",
    "/html/AAFplaces.html",
    "/html/AAGtime.html",
    "/html/AAHpeople.html",
    "/html/AAIthis & that.html",
    "/html/AAJquestions.html",

    "/html/home.html",
    "/html/links.html",

    "/js/index.js",
    "/js/kana.js",

    "/css/index.css",
    "/css/kana.css",

    "/json/dakuon.json",
    "/json/kana.json",
    "/json/special.json",
    "/json/yoon.json",

    "/manifest/icon-192.png",
    "/manifest/icon-512.png",
    "/manifest/icon.svg",
    "/manifest/manifest.json",
    "/manifest/service.js"
];

// On install, cache the static resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })(),
  );
});

// delete old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
          return undefined;
        }),
      );
      await clients.claim();
    })(),
  );
});

// On fetch, intercept server requests
// and respond with cached responses instead of going to network
self.addEventListener("fetch", (event) => {
  // As a single page app, direct app to always go to cached home page.
  if (event.request.mode === "navigate") {
    event.respondWith(caches.match("./"));
    return;
  }

  // For all other requests, go to the cache first, and then the network.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request.url);
      if (cachedResponse) {
        // Return the cached response if it's available.
        return cachedResponse;
      }
      // If resource isn't in the cache, return a 404.
      return new Response(null, { status: 404 });
    })(),
  );
});

