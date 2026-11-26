/**
 * ClassroomPRO Progressive Web App (PWA) Service Worker
 * Architecture §9:
 * - Application shell caching (HTML, JS/CSS bundles, fonts, icons)
 * - Cache-first / Stale-while-revalidate for published NERDC lesson packages & Cloudinary educational illustrations
 * - Network-first with offline fallback for dynamic API queries
 * - Versioned cache invalidation on new release
 */

const CACHE_VERSION = 'classroompro-pwa-v2';
const SHELL_CACHE = `${CACHE_VERSION}-shell`;
const CONTENT_CACHE = `${CACHE_VERSION}-content`;
const ASSET_CACHE = `${CACHE_VERSION}-assets`;

const APP_SHELL_URLS = [
  '/dashboard',
  '/dashboard/downloads',
  '/dashboard/notes',
  '/dashboard/quizzes',
  '/dashboard/flashcards',
  '/dashboard/videos',
  '/manifest.json',
  '/logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL_URLS).catch(() => {
        // Non-fatal if individual routes are rendered dynamically
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !key.startsWith(CACHE_VERSION))
          .map((staleKey) => caches.delete(staleKey))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. Cloudinary educational diagram assets: Cache-First with background refresh
  if (url.hostname.includes('res.cloudinary.com')) {
    event.respondWith(
      caches.open(ASSET_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const networkResp = await fetch(request);
          if (networkResp && networkResp.ok) {
            cache.put(request, networkResp.clone());
          }
          return networkResp;
        } catch (err) {
          return cached || new Response('', { status: 504, statusText: 'Offline Asset Unavailable' });
        }
      })
    );
    return;
  }

  // 2. NERDC Content Manifests & Packages API: Network-First with Content-Cache Fallback
  if (url.pathname.includes('/api/content/')) {
    event.respondWith(
      caches.open(CONTENT_CACHE).then(async (cache) => {
        try {
          const networkResp = await fetch(request);
          if (networkResp && networkResp.ok) {
            cache.put(request, networkResp.clone());
          }
          return networkResp;
        } catch (err) {
          const cached = await cache.match(request);
          if (cached) return cached;
          return new Response(
            JSON.stringify({ error: 'Offline mode active; package not cached in Service Worker.' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
          );
        }
      })
    );
    return;
  }

  // 3. Next.js static bundles, fonts, and app shell pages: Stale-While-Revalidate
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/_next/') ||
      url.pathname.startsWith('/dashboard') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.svg'))
  ) {
    event.respondWith(
      caches.open(SHELL_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResp) => {
            if (networkResp && networkResp.ok) {
              cache.put(request, networkResp.clone());
            }
            return networkResp;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
