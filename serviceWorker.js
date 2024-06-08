const cacheName = "calc-pwa-v1";
const assets = [
    "./",
    "./index.html",
    "./icons/512.png",
    "./library/decimal.js",
    "./manifest.json",
    "./script.js",
    "./style.css",
    "./theme.css"
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

// self.addEventListener('install', (event) => {
//     console.info('Event: Install');
  
//     event.waitUntil(
//       caches.open(cacheName)
//       .then((cache) => {
//         return cache.addAll(assets)
//         .then(() => {
//             console.info('All files are cached');
//             return self.skipWaiting();
//         })
//         .catch((error) =>  {
//             console.error('Failed to cache', error);
//         })
//       })
//     );
//   });

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            console.log(`[Service Worker] Fetching resource: ${fetchEvent.request.url}`);
            return res || fetch(fetchEvent.request);
        })
    )
})
