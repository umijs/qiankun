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
    "revision": "5f4b6726e241c48652abb60cfc2461ea"
  },
  {
    "url": "api/index.html",
    "revision": "4e0549bbd22b9610dc52f6cceb5d9ad6"
  },
  {
    "url": "assets/css/0.styles.fc1e806d.css",
    "revision": "f0e2ef567acd5c71f8861490db9bb772"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.3c778875.js",
    "revision": "c5402d48d37c3acf681982d26096f2cd"
  },
  {
    "url": "assets/js/11.33e5b9e3.js",
    "revision": "57e21216917f6759cbcfbd57ab6609f3"
  },
  {
    "url": "assets/js/12.06a8ae72.js",
    "revision": "cb9a64bb4b1319de80d71a46886b0aca"
  },
  {
    "url": "assets/js/13.7dfc8ad6.js",
    "revision": "3689f7faa5a67f05a706be2427500538"
  },
  {
    "url": "assets/js/14.806bd251.js",
    "revision": "d3f24384b34066950e6e737c8e9d3e84"
  },
  {
    "url": "assets/js/15.18344409.js",
    "revision": "0be66769c3c772ad3fa8e49f03a848d4"
  },
  {
    "url": "assets/js/16.eeee98e9.js",
    "revision": "955f6c66d71bb3296d459ee623e8965d"
  },
  {
    "url": "assets/js/17.812551af.js",
    "revision": "00e72849355852dcbe068c7135e6dd95"
  },
  {
    "url": "assets/js/2.901d275e.js",
    "revision": "35f4ca32a4f4f66ce35cfa17d1bf972d"
  },
  {
    "url": "assets/js/3.6bab7681.js",
    "revision": "c1a1cf48d8380d7fe869aa7ae807460d"
  },
  {
    "url": "assets/js/4.a97c5341.js",
    "revision": "b6b99ecb1a9dccd7782786f1e923acde"
  },
  {
    "url": "assets/js/5.1a437c30.js",
    "revision": "4038d31880965200b2a84e12a58baace"
  },
  {
    "url": "assets/js/6.9a0720f9.js",
    "revision": "249a6eaf5ae059b4349ec6d4012c4105"
  },
  {
    "url": "assets/js/7.f4bbaabc.js",
    "revision": "7bfdf4a246d200612f200c12ce9d5114"
  },
  {
    "url": "assets/js/8.0a47e2bf.js",
    "revision": "9e4b16f5267175fdb45510932739dcf5"
  },
  {
    "url": "assets/js/9.a7a77cb6.js",
    "revision": "a4125b667fdb0f1b95dd2c0eafae9fe5"
  },
  {
    "url": "assets/js/app.273fe787.js",
    "revision": "ab1f6d0037fed9d7b847e91e74e6a62e"
  },
  {
    "url": "faq/index.html",
    "revision": "8224320ca17141312a91d08794dbf5dd"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "41fbdfa68ac99e388b5495fbd9d0345f"
  },
  {
    "url": "guide/index.html",
    "revision": "6c455031572c03a737e462d1269c397e"
  },
  {
    "url": "index.html",
    "revision": "1b9513946b4eb9f64169335a41e3bdbc"
  },
  {
    "url": "zh/api/index.html",
    "revision": "04ec04f0233868454868750818d4cb14"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "69b44396d071f73394123cd4d12f52cc"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "54d934fb274a0352059594d04b7e1c24"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "278592813a7f56ffc864a3ed82d24ec4"
  },
  {
    "url": "zh/index.html",
    "revision": "480075a2f130fa66b39a97be24cafae4"
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
