const CACHE_NAME = 'arsis-os-v2-maverick';
// All files to cache for offline functionality and PWA installation
const urlsToCache = [
  // Core
  './',
  './index.html',
  './manifest.json',
  './metadata.json',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants.tsx',
  './sw.js',
  './config.ts',
  
  // Icons from manifest
  './icon-192.png',
  './icon-512.png',

  // Hooks, Contexts, and Services
  './hooks/useDraggable.ts',
  './contexts/MusicContext.tsx',
  './contexts/SecurityContext.tsx',
  './services/userProfile.ts',
  './services/storageService.ts',
  './services/localDbService.ts',
  
  // Components
  './components/TopBar.tsx',
  './components/Dock.tsx',
  './components/Window.tsx',
  './components/DesktopIcon.tsx',
  './components/SystemOverlay.tsx',
  './components/ContextMenu.tsx',
  './components/MissionControl.tsx',
  './components/ApiMonitorWidget.tsx',
  './components/Spotlight.tsx',
  './components/Launchpad.tsx',
  './components/LoadingScreen.tsx',
  './components/LoginScreen.tsx',
  './components/ControlCenter.tsx',
  './components/NotificationCenter.tsx',
  './components/NotificationToast.tsx',
  './components/PasscodePrompt.tsx',
  './components/Icons.tsx',
  
  // Apps
  './apps/Notes.tsx',
  './apps/Terminal.tsx',
  './apps/Weather.tsx',
  './apps/MyDocs.tsx',
  './apps/Calculator.tsx',
  './apps/About.tsx',
  './apps/Stocks.tsx',
  './apps/Houston.tsx',
  './apps/Settings.tsx',
  './apps/Imaginarium.tsx',
  './apps/Calendar.tsx',
  './apps/Music.tsx',
  './apps/PhotoBooth.tsx',
  './apps/ArsisId.tsx',
  './apps/DefenseIOS.tsx',
  './apps/NetworkInfo.tsx',
  './apps/Installer.tsx',
  './apps/AppStore.tsx',
  './apps/Maverick.tsx',
  './apps/Shortcuts.tsx',
  './apps/SystemMonitor.tsx',
  './apps/Contacts.tsx',
  './apps/News.tsx',
  './apps/Clock.tsx',
  './apps/Codex.tsx',
  
  // CDN resources
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/client',
  'https://aistudiocdn.com/@google/genai@^1.18.0'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all URLs, but don't fail the install if one fails
        const cachePromises = urlsToCache.map(urlToCache => {
            return cache.add(urlToCache).catch(err => {
                console.warn(`Failed to cache ${urlToCache}:`, err);
            });
        });
        return Promise.all(cachePromises);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache, fetch from network
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        ).catch(err => {
            console.error('Fetch failed; network request failed.', err);
        });
      })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});