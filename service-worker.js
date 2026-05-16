// PM Audit Platform — Service Worker
// Version : bump this number when you push major updates so old caches are cleared
const CACHE_VERSION = "pm-audit-v6";
const CACHE_NAME = `pm-audit-${CACHE_VERSION}`;

// Files to cache for offline use
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install: pre-cache essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch((err) => {
        console.warn("[SW] Some assets failed to cache:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch strategy: network-first for HTML and Supabase, cache-first for static assets
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // Don't cache Supabase API calls (always fresh data)
  if (url.hostname.includes("supabase.co")) {
    return; // let the browser handle it normally
  }
  
  // Don't cache POST requests
  if (event.request.method !== "GET") {
    return;
  }
  
  // For HTML pages: try network first, fallback to cache
  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Update cache with fresh version
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Network failed, fallback to cache
          return caches.match(event.request).then((cached) => {
            return cached || caches.match("./index.html");
          });
        })
    );
    return;
  }
  
  // For other static assets: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cache successful responses
        if (response && response.status === 200 && response.type === "basic") {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});

// Listen for skipWaiting message from the app
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
