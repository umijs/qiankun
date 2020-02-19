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
    "revision": "d189e44c44308758fe61209524ba2c83"
  },
  {
    "url": "api/index.html",
    "revision": "a43b7b9ae5e65f9b37960c6352cb9f13"
  },
  {
    "url": "assets/css/0.styles.c8edd4bd.css",
    "revision": "774ec53984823549f7bb60998f64da08"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.45aafcdb.js",
    "revision": "ee16ecd0423c622951ca5ce5b2300a95"
  },
  {
    "url": "assets/js/11.0c2900e9.js",
    "revision": "bdeae8db2f7eb023922bd31046e82c04"
  },
  {
    "url": "assets/js/12.1cd950a0.js",
    "revision": "443a9f457a92b77bdbf260f1fc8feda3"
  },
  {
    "url": "assets/js/13.95ac6765.js",
    "revision": "a7f1bec138e20c03f59aa735d2346a63"
  },
  {
    "url": "assets/js/14.337ab15d.js",
    "revision": "bf225f2e4a81b8f522ade051524e6edb"
  },
  {
    "url": "assets/js/15.552a8e0a.js",
    "revision": "f8cd1ddde724169d31c77ecd5fc75929"
  },
  {
    "url": "assets/js/16.56f91e99.js",
    "revision": "9a17df3e3a35a3fc67cdf4ed3a442a15"
  },
  {
    "url": "assets/js/2.a44e031b.js",
    "revision": "2a958d109fa4be79841725cb86e754fb"
  },
  {
    "url": "assets/js/3.3225a086.js",
    "revision": "3ed1d221cfea1afcddc2aafc2498f2ba"
  },
  {
    "url": "assets/js/4.b57ea8d3.js",
    "revision": "27f94b967fb4d48b71630515edb6d7dd"
  },
  {
    "url": "assets/js/5.b4d3fe4a.js",
    "revision": "e32c13cba2a58bc91703536f01b66f97"
  },
  {
    "url": "assets/js/6.c5e6f162.js",
    "revision": "8074cc35d13847d7572f1e466bc79088"
  },
  {
    "url": "assets/js/7.25f9898a.js",
    "revision": "76e33a1aa1a6d5de1131f7b038e93e8d"
  },
  {
    "url": "assets/js/8.14551885.js",
    "revision": "0df4510853379e8ef0fe40b3c4299f63"
  },
  {
    "url": "assets/js/9.d75a035f.js",
    "revision": "38946dd744575e8f5b21feddf578658f"
  },
  {
    "url": "assets/js/app.3563c78b.js",
    "revision": "d06b0404e9826185a2a6266de414e022"
  },
  {
    "url": "faq/index.html",
    "revision": "2fd567c349807e0f9097a00b3ec26414"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "90d025ea3969f6fa9af42ec7d6d201ab"
  },
  {
    "url": "guide/index.html",
    "revision": "b62f27487d166a6b488407e58f7e6db0"
  },
  {
    "url": "index.html",
    "revision": "5ad7f5eae37eef5e9000f4c7a2856d25"
  },
  {
    "url": "zh/api/index.html",
    "revision": "8672096e98b4156f8ac7669236e43846"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "2b60c0eb061323917751aab3c1d244d3"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "522286220a17a7a2d08f56048c397d6f"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "1e2b5eab12171597811f9a6995184912"
  },
  {
    "url": "zh/index.html",
    "revision": "e7f1dce9ddfd4262db6500c94c5a3927"
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
