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
    "revision": "e1ca71aad8fc6972a2f918bfb306e8f4"
  },
  {
    "url": "api/index.html",
    "revision": "c466367ccd226411b3511a73b5ed8604"
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
    "url": "assets/js/12.27880053.js",
    "revision": "ebbbb23301559aad77ce568dcdfb2d25"
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
    "url": "assets/js/app.5b8e046a.js",
    "revision": "d6416c23d4d2c1e233a0f1fb4488a2b9"
  },
  {
    "url": "faq/index.html",
    "revision": "567c705d358af2f46d9c1b8d9a4b5482"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "3933f1c1853e54ed4bc4801e33aa06dd"
  },
  {
    "url": "guide/index.html",
    "revision": "ec3a7f06bf99edf6c38ea903b7ff7a9a"
  },
  {
    "url": "index.html",
    "revision": "5f3d7b66dea580376aa738f9f7c4503d"
  },
  {
    "url": "zh/api/index.html",
    "revision": "f69ea5813d2056e7095680de7a4da4fd"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "4171752924816c0eb497319f131e6c82"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "7c49b02638b9395da13f5bfb6f99fd4a"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "befdd7f5df4954597e529088c9bb4b40"
  },
  {
    "url": "zh/index.html",
    "revision": "406108258dea2f639ae523296061e7b9"
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
