// Cache name
const cacheName = 'news-v1';
// Static assets to be store at cache
const staticAssets = [
    './',
    './index.html',
    './style.css',
    './index.js',
    './newsApi.js',
    './manifest.webmanifest',
    './news-article.js'
];

// Install event listener 
self.addEventListener('install', async e => {
    //open cache with a given name and add files there    
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting(); // Service worker enter the activate phase
});


// Activate event listener
// Best time to manage cache
self.addEventListener('activate', e => {
    // service starts serving the application - start fetching and caching on 1st time
    self.clients.claim();
});

// Fetch event listener
// Listener will intercept any request from the app to network
self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);

    // If we want to get the assets that we referenciate as cachable we should hit cache first, internet otherwise
    // If we want to get the articles we should hit the network first, cache otherwise
    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(req));
    } else {
        e.respondWith(networkAndCache(req));
    }
});

// Cache first -> then internet
// If the cache is not acessible, go to the internet
async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

// Internet first and cache results
// If internet is not accessible, hit the cache
async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cached = await cache.match(req);
        return cached;
    }
}
