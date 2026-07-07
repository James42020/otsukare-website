//https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/CycleTracker/Service_workers

const html = [
[ //404
    "404.html"
], 
[ //content
    "AAAkana.html",
    "AABkanji.html",
    "AACparticles.html",
    "AADconjugations.html",
    "AAEnumbers & counters.html",
    "AAFplaces.html",
    "AAGtime.html",
    "AAHpeople.html",
    "AAIthis & that.html",
    "AAJquestions.html"
],
[ //main
    "home.html",
    "links.html"
]
]
const js = [
    "index.js",
    "kana.js"
]
const css = [
    "index.css",
    "kana.css"
]
const json = [
    "dakuon.json",
    "kana.json",
    "special.json",
    "yoon.json"
]
const manifest = [
    "icon-192.png",
    "icon-512.png",
    "icon.svg",
    "manifest.json",
    "service.js"
]

// The static resources that the app needs to function.
var APP_STATIC_RESOURCES = [
    "/"
];

function setUpStatic(){
    for(i=0;i<html.length;i++){
        for(j=0;j<html[i].length;j++){
            APP_STATIC_RESOURCES.push(`/html/${html[i][j]}`)
        }
    }
    for(i=0;i<js.length;i++){
        APP_STATIC_RESOURCES.push(`/js/${js[i]}`)
    }
    for(i=0;i<css.length;i++){
        APP_STATIC_RESOURCES.push(`/css/${css[i]}`)
    }
    for(i=0;i<json.length;i++){
        APP_STATIC_RESOURCES.push(`/json/${json[i]}`)
    }
    for(i=0;i<manifest.length;i++){
        APP_STATIC_RESOURCES.push(`/manifest/${manifest[i]}`)
    }
}
setUpStatic()

setTimeout(function(){
// The version of the cache.
// change whenever APP_STATIC_RESOURCES is changed
const VERSION = "1";

// The name of the cache
const CACHE_NAME = `otsukare-${VERSION}`;


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

},100)
