const cacheName = "calc-pwa-v1.1";
const assets = [
    "./",
    "./index.html",
    "./icons/favicon.png",
    "./icons/favicon.ico",
    "./library/decimal.js",
    "./manifest.json",
    "./domScript.js",
    "./logic.js",
    "./styles/style.css",
    "./styles/lightTheme.css",
    "./manifest.json",
    'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&family=Teko:wght@300..700&display=swap'
];

// create a cache upon install
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

// Service requests using cache-first approach 
//      and updating the cache in background if possible
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                // Return the cached response if found
                // Fetch the latest version in the background
                event.waitUntil(
                    fetch(event.request).then(response => {
                        return caches.open(cacheName).then(cache => {
                            cache.put(event.request, response.clone());
                            return response;
                        });
                    })
                );
                return cachedResponse;
            }

            // If the request is not in the cache, fetch from the network
            return fetch(event.request).then(response => {
                return caches.open(cacheName).then(cache => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            }).catch(() => {
                // If the network request fails and there is no cache, return a fallback response (optional)
            });
        })
    );
});

// prune old caches
self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key === cacheName) {
                        return;
                    }
                    return caches.delete(key);
                }),
            );
        }),
    );
});
