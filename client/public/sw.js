/**
 * QuranLens Progressive Web App (PWA) Service Worker
 * Version: 1.0.0
 * 
 * Provides robust offline reading, background caching of verified Quranic text,
 * translation, Tafsir, and scientific analysis data.
 */

const STATIC_CACHE = 'quranlens-static-v1';
const DATA_CACHE = 'quranlens-data-v1';
const FONT_CACHE = 'quranlens-fonts-v1';

// Critical app shell resources cached on installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/manifest.json',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-maskable.png',
  '/icons/icon.svg',
  '/icons/icon-maskable.svg',
];

// Essential API endpoints pre-cached for immediate offline availability
const PRECACHE_API = [
  '/api/surahs',
  '/api/science',
  '/api/topics',
  '/api/analysis/surah/1',
  '/api/analysis/ayah/1/1',
];

// 1. Install Event: Cache app shell & initial datasets
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const staticCache = await caches.open(STATIC_CACHE);
      try {
        await staticCache.addAll(PRECACHE_ASSETS);
      } catch (err) {
        console.warn('[SW] Some precache assets failed to load:', err);
      }

      // Try pre-caching basic API payloads if backend is reachable
      const dataCache = await caches.open(DATA_CACHE);
      for (const url of PRECACHE_API) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            await dataCache.put(url, res);
          }
        } catch (e) {
          // Non-blocking during offline installation
        }
      }

      await self.skipWaiting();
    })()
  );
});

// 2. Activate Event: Clean up outdated caches & claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((name) => {
          if (name !== STATIC_CACHE && name !== DATA_CACHE && name !== FONT_CACHE) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

// 3. Fetch Event: Multi-tiered offline strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET requests (e.g. POST for notes or chat)
  if (request.method !== 'GET') {
    return;
  }

  // Strategy A: HTML Navigation (SPA routes like /surahs, /surah/1, /ayah/1/1)
  // Network first -> Fallback to cached index.html so React Router takes over offline
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // Offline fallback: serve cached index.html
          const cache = await caches.open(STATIC_CACHE);
          const cachedIndex = (await cache.match('/index.html')) || (await cache.match('/'));
          if (cachedIndex) return cachedIndex;

          return new Response(
            `<!DOCTYPE html><html lang="ur" dir="rtl"><head><meta charset="utf-8"/><title>QuranLens — آف لائن</title><style>body{font-family:sans-serif;text-align:center;padding:50px;background:#064e3b;color:#fff;}h1{color:#fde047;}</style></head><body><h1>آپ آف لائن ہیں</h1><p>قرآن لینز کی محفوظ شدہ سورتیں پڑھنے کے لیے ایپ دوبارہ کھولیں۔</p><button onclick="location.reload()" style="padding:10px 20px;border-radius:10px;background:#eab308;border:none;font-weight:bold;cursor:pointer;">دوبارہ کوشش کریں</button></body></html>`,
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        }
      })()
    );
    return;
  }

  // Strategy B: Google Fonts (Amiri, Noto Nastaliq Urdu, Noto Naskh Arabic)
  // Cache First with Stale-While-Revalidate
  if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(FONT_CACHE);
        const cached = await cache.match(request);
        if (cached) return cached;

        try {
          const response = await fetch(request);
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
          return response;
        } catch (err) {
          return cached || new Response('', { status: 408 });
        }
      })()
    );
    return;
  }

  // Strategy C: API Calls (/api/surahs, /api/analysis, /api/science, /api/topics)
  // Network first with automatic cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(DATA_CACHE);
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          // Serve cached API response when offline
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          // If not in cache, return friendly JSON error so client fallbacks can trigger
          return new Response(
            JSON.stringify({
              success: false,
              offline: true,
              message: 'Offline mode active. Using client local storage and in-memory Quran dataset.',
            }),
            {
              headers: { 'Content-Type': 'application/json' },
              status: 200,
            }
          );
        }
      })()
    );
    return;
  }

  // Strategy D: Static assets (JS, CSS, SVGs, PNGs, Vite chunks)
  // Stale-While-Revalidate: serve cached immediately, update in background
  event.respondWith(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      const cached = await cache.match(request);

      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => null);

      return cached || (await fetchPromise) || new Response('', { status: 404 });
    })()
  );
});

// 4. Message Event: allow client to trigger immediate update
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
