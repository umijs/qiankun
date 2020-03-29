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
    "revision": "9243d96e6877ad01b4b62afa16d17290"
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
    "url": "assets/js/10.48c58a16.js",
    "revision": "3c6073fb24135673bc070ddfeede7934"
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
    "url": "assets/js/13.a2649534.js",
    "revision": "aeb8b9a417378dd692c5388150af2b27"
  },
  {
    "url": "assets/js/14.a2b88e6f.js",
    "revision": "061f54913e75c303572e8a6e3d871a2d"
  },
  {
    "url": "assets/js/15.30799f45.js",
    "revision": "a61f8b7023c1f58f6c997cfc6f4c0a03"
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
    "url": "assets/js/8.9c57d943.js",
    "revision": "f25cda126985aa9cc72af23720de891a"
  },
  {
    "url": "assets/js/9.3565c511.js",
    "revision": "0b675b9cc4439de6c231caefd06fb5b5"
  },
  {
    "url": "assets/js/app.ae6469d9.js",
    "revision": "10e40043cb464a8e9e0a353a6d4c0581"
  },
  {
    "url": "faq/index.html",
    "revision": "6a212d4e90ad780f9a37a807abd313c6"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "57abbd3c827ac4cac65f543a83227f9d"
  },
  {
    "url": "guide/index.html",
    "revision": "9b5c6dc2d9ea50495ee5604ab33f225f"
  },
  {
    "url": "index.html",
    "revision": "bfd8dbc65a76fe2560babbf674442745"
  },
  {
    "url": "zh/api/index.html",
    "revision": "c55abd8bb61d91032c146f5f951cbe0e"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "7e66246b0474aedc84de1c69cb2ebe00"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "0d6d1d3a8b2318231c9bf307cb0463d5"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "fe0e07da050e7b5699ab5a35e7621761"
  },
  {
    "url": "zh/index.html",
    "revision": "76f35d73a706263e26b65a340c2f19e5"
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
