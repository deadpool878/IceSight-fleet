const CACHE_NAME = 'icesight-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/simulator.html',
  '/dashboard.html',
  '/view-advisory.html',
  '/logo.png',
  '/manifest.json'
];

// Install — cache core files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())
  );
});

// Fetch — network first, fallback to cache
self.addEventListener('fetch', e => {
  // Skip non-GET and external requests (Supabase, TensorFlow, fonts)
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);

  // For CDN resources (Supabase, TF.js, fonts) — cache first
  if (url.hostname.includes('cdn.jsdelivr.net') || url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(resp => {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          return resp;
        }).catch(() => cached);
      })
    );
    return;
  }

  // For Supabase API and Open-Meteo — network only (can't cache live data)
  if (url.hostname.includes('supabase.co') || url.hostname.includes('open-meteo.com')) return;

  // For local files — network first, cache fallback
  e.respondWith(
    fetch(e.request).then(resp => {
      const clone = resp.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return resp;
    }).catch(() => caches.match(e.request))
  );
});
