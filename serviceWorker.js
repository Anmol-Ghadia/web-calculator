const cacheName = "calc-pwa-v1";
const assets = [
    "./",
    "./index.html",
    "./icons/favicon.png",
    "./library/decimal.js",
    "./manifest.json",
    "./script.js",
    "./style.css",
    "./lightTheme.css",
];

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(cacheName).then(cache => {
            
            // console.log("[Service Worker] Caching all: app shell and content");
            assets.forEach(ele => {
                cache.add(ele);
            })
        }).catch(error => {
            console.log("cache add all error: ", error);   
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            console.log(`[Service Worker] Fetching resource: ${fetchEvent.request.url}`);
            return res || fetch(fetchEvent.request);
        })
    )
})
