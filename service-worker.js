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
    "revision": "50a098bca98fd79e8208e4b71e54c2e9"
  },
  {
    "url": "api/index.html",
    "revision": "a117c1a4941f505f355cbad8cde207a4"
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
    "url": "assets/js/app.fa4bc176.js",
    "revision": "b8395c4b3bb55212452b8e787875caf4"
  },
  {
    "url": "faq/index.html",
    "revision": "0569656be3c93911e490e64e16d882f0"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "283a227161a139f465c1ab5da320930f"
  },
  {
    "url": "guide/index.html",
    "revision": "b52d990e52fcc4364df91f54c47a0147"
  },
  {
    "url": "index.html",
    "revision": "fbe750367737127efac39f4b5f1911ba"
  },
  {
    "url": "zh/api/index.html",
    "revision": "47cc82f2349b63da20bf19c6578d05ff"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "9af9ac22a1776c1e3dc8f83fe961fa6f"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "000f97da665a1bd3599f458938638076"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "20cbb84bc4f537a122ceeefbd0fb2311"
  },
  {
    "url": "zh/index.html",
    "revision": "c0dec04c3146a7225fe3eebf09c5210c"
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
