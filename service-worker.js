/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "0a233db5dc7991a75d4af2c079701dd1"
  },
  {
    "url": "api/index.html",
    "revision": "718673ba99006248978e590fea76cd71"
  },
  {
    "url": "assets/css/0.styles.561b124d.css",
    "revision": "f0e2ef567acd5c71f8861490db9bb772"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.35260cc8.js",
    "revision": "c5402d48d37c3acf681982d26096f2cd"
  },
  {
    "url": "assets/js/11.f28e97dc.js",
    "revision": "6727c1e7df055a4ab7d3df544d0c14dc"
  },
  {
    "url": "assets/js/12.0b769208.js",
    "revision": "a4025159d81cc014e02ec46e5756633a"
  },
  {
    "url": "assets/js/13.7b31d599.js",
    "revision": "3689f7faa5a67f05a706be2427500538"
  },
  {
    "url": "assets/js/14.c6be3c4e.js",
    "revision": "d3f24384b34066950e6e737c8e9d3e84"
  },
  {
    "url": "assets/js/15.d46b7b2f.js",
    "revision": "0be66769c3c772ad3fa8e49f03a848d4"
  },
  {
    "url": "assets/js/16.b62491af.js",
    "revision": "955f6c66d71bb3296d459ee623e8965d"
  },
  {
    "url": "assets/js/17.dc2c4e78.js",
    "revision": "00e72849355852dcbe068c7135e6dd95"
  },
  {
    "url": "assets/js/2.7fd8a689.js",
    "revision": "35f4ca32a4f4f66ce35cfa17d1bf972d"
  },
  {
    "url": "assets/js/3.60a0c2c7.js",
    "revision": "c1a1cf48d8380d7fe869aa7ae807460d"
  },
  {
    "url": "assets/js/4.2f51514e.js",
    "revision": "b6b99ecb1a9dccd7782786f1e923acde"
  },
  {
    "url": "assets/js/5.2cac2106.js",
    "revision": "4038d31880965200b2a84e12a58baace"
  },
  {
    "url": "assets/js/6.ee17396a.js",
    "revision": "f383aefd15bc082b894e10437a8d7e19"
  },
  {
    "url": "assets/js/7.7e819aa1.js",
    "revision": "9a39363ebeef5bf6f167ad1165b18ee0"
  },
  {
    "url": "assets/js/8.fc5f63b2.js",
    "revision": "9e4b16f5267175fdb45510932739dcf5"
  },
  {
    "url": "assets/js/9.20370be3.js",
    "revision": "a4125b667fdb0f1b95dd2c0eafae9fe5"
  },
  {
    "url": "assets/js/app.412af685.js",
    "revision": "557e09a3c304ff1b7a2071711a2329c7"
  },
  {
    "url": "faq/index.html",
    "revision": "6b692783e31991ca77930a066b150a0b"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "2f6554c3991ac33bd0c58641f8e8dfe3"
  },
  {
    "url": "guide/index.html",
    "revision": "a1280e2eae6477cfd709b7461a23b790"
  },
  {
    "url": "index.html",
    "revision": "449cd387240c3b18f725967faaeb2a54"
  },
  {
    "url": "zh/api/index.html",
    "revision": "c30742807401dffe27f7db6a708a3d92"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "c8b2cef3e520bbbb923026168307d5ae"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "d7a75f3fbf2ca83041bff2bc840f9f2e"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "1a153389148b8b671f63ded62072294e"
  },
  {
    "url": "zh/index.html",
    "revision": "601efda886c2d8f34289f9c483713950"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
