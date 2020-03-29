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
    "url": "api/index.html",
    "revision": "f826b0b18c25aa54316796a39990d370"
  },
  {
    "url": "assets/css/0.styles.a6fd8785.css",
    "revision": "251ba29ed3fd745995c48f402c365216"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.19d811a7.js",
    "revision": "1a1e24fb69b354d27688bb76ad73b5e6"
  },
  {
    "url": "assets/js/11.7f1d2ce4.js",
    "revision": "99bb216bb7753702bdb9ef7b7a2384b6"
  },
  {
    "url": "assets/js/12.20a09c0a.js",
    "revision": "62a2b5cef2b4543f4ba8da98c678910a"
  },
  {
    "url": "assets/js/13.fee62acf.js",
    "revision": "652cdb3f3317893896accc1f44ea7437"
  },
  {
    "url": "assets/js/14.a2b88e6f.js",
    "revision": "061f54913e75c303572e8a6e3d871a2d"
  },
  {
    "url": "assets/js/15.fac88083.js",
    "revision": "e759e8d88e0a1519539f95e746e8c706"
  },
  {
    "url": "assets/js/16.53d2cb33.js",
    "revision": "1d72a5fce881751fafe8dc97af6e290d"
  },
  {
    "url": "assets/js/17.36104c50.js",
    "revision": "03056781dfcc73ddd5ac155442cd65c6"
  },
  {
    "url": "assets/js/2.c66f83d4.js",
    "revision": "e1d79de1e4184c1201a735c60cd1ffce"
  },
  {
    "url": "assets/js/3.2c0b8aab.js",
    "revision": "2c6d94db4c60931974645caf3c5341ed"
  },
  {
    "url": "assets/js/4.5069acaa.js",
    "revision": "b39d274d21e1e00010cc268976d19624"
  },
  {
    "url": "assets/js/5.272b4ea1.js",
    "revision": "5431825a405ddf85f82a0d28fc9a088d"
  },
  {
    "url": "assets/js/6.8f23f4f9.js",
    "revision": "5a4040ef98887ce2e7d17c3f066b0f88"
  },
  {
    "url": "assets/js/7.6f1a76d3.js",
    "revision": "336c156dc81fb734a545ce05a8935918"
  },
  {
    "url": "assets/js/8.342787e9.js",
    "revision": "15e3efca7511bdb070acf26f128c7e4f"
  },
  {
    "url": "assets/js/9.3565c511.js",
    "revision": "0b675b9cc4439de6c231caefd06fb5b5"
  },
  {
    "url": "assets/js/app.6ef31f52.js",
    "revision": "047a0cef81da308caa6f2b159941f2e0"
  },
  {
    "url": "faq/index.html",
    "revision": "d0d271200b2334c053a2df43ac6ecfce"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "f7817fcbff5bc15068f67d5f69d8900a"
  },
  {
    "url": "guide/index.html",
    "revision": "98e6dd63cac4344fb1352da18ca6e6ef"
  },
  {
    "url": "index.html",
    "revision": "33fd903da9ced5ebf9ed7ce2579c21c2"
  },
  {
    "url": "zh/api/index.html",
    "revision": "787321992bddccf3c7c5fb59c8c10fa1"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "f150063641598dba977ee896d9c7b27d"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "0ffdd1e509e6a5f1fe7dab091fc43f9a"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "23373baee1018a003623d79d7609b718"
  },
  {
    "url": "zh/index.html",
    "revision": "8d054259a3d3014dad4bd5f70f7ae980"
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
