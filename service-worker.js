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
    "revision": "87f47dd61c12f5dc1b94fba65f24154c"
  },
  {
    "url": "api/index.html",
    "revision": "bb07babe28d0a260af52160dc31b7cdf"
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
    "url": "assets/js/13.9993d92e.js",
    "revision": "4b489c8be463b7b5d98c052fecf156c3"
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
    "url": "assets/js/8.c1c37552.js",
    "revision": "ea4aefb9ef58f15db0ae812a0d8b0c87"
  },
  {
    "url": "assets/js/9.d75a035f.js",
    "revision": "38946dd744575e8f5b21feddf578658f"
  },
  {
    "url": "assets/js/app.f817e9bb.js",
    "revision": "8e1047d1a91284d65cb061bde5dae54d"
  },
  {
    "url": "faq/index.html",
    "revision": "4abf825662f59738e890371b6c315f84"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "9193a2f48d6dc48c7e61c23e38719e41"
  },
  {
    "url": "guide/index.html",
    "revision": "117c5519421f607012472cba030072d7"
  },
  {
    "url": "index.html",
    "revision": "d46e6c2c3347e146f94d4b6b8927837d"
  },
  {
    "url": "zh/api/index.html",
    "revision": "50362c3f63c30e6ccf1c3c29386923e4"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "f3371774a2501b6afc529161e11fdf91"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "4edea98e2c75e76685ba3d59cf51c66b"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "131768456489ddcfcac0009a3d623807"
  },
  {
    "url": "zh/index.html",
    "revision": "d103f23bdf5745a000322f1a3a5a552a"
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
