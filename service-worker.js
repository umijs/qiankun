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
    "revision": "9e11abfa591633830e39f2129bbd9824"
  },
  {
    "url": "api/index.html",
    "revision": "d726ade2f42cf8c2f9d34e91024addfe"
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
    "url": "assets/js/app.c7aa082e.js",
    "revision": "1ac7a21c1e4c24ba01cb9236423463f3"
  },
  {
    "url": "faq/index.html",
    "revision": "0efad653a0ca3bead63bf7443c385ebf"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "d888de29e6d2559b761aff786f8a0a56"
  },
  {
    "url": "guide/index.html",
    "revision": "7fc43cfb0fe310ad4a163ae5b5f90b18"
  },
  {
    "url": "index.html",
    "revision": "677a92476306dd4bed6ce56ea5ba3ab0"
  },
  {
    "url": "zh/api/index.html",
    "revision": "9ee54ac84f926ad3d3c470a3b6eaa34a"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "492e96d0f83252d66c6e8a64843816e8"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "9d3cf32feaf82f7a1653ca417d4c6f09"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "5adf93df162ffcd9b1bd5cb14e1456f8"
  },
  {
    "url": "zh/index.html",
    "revision": "3b056086109b86a86631dfb03d80248b"
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
