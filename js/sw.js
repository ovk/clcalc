/*global Promise, CACHED_FILES*/

var cacheName = 'vVERSION';

self.addEventListener('install', function (event)
{
    event.waitUntil(caches.open(cacheName).then(function (cache)
    {
        return cache.addAll(CACHED_FILES);
    }));
});

self.addEventListener('activate', function (event)
{
    event.waitUntil(caches.keys().then(function (keys)
    {
        return Promise.all(keys.map(function (key)
        {
            if (key !== cacheName)
            {
                return caches.delete(key);
            }
        }));
    }));
});

self.addEventListener('fetch', function (event)
{
    event.respondWith(caches.match(event.request).then(function (response)
    {
        return response || fetch(event.request);
    }));
});
