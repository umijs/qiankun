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
    "revision": "882113fa9da503c09123c0bfe4cd071b"
  },
  {
    "url": "api/index.html",
    "revision": "8db9ebc18cba07436a43f04df8f81b66"
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
    "url": "assets/js/10.1f122c32.js",
    "revision": "55050a8fc449681e1db09c7338db69bf"
  },
  {
    "url": "assets/js/11.89a36612.js",
    "revision": "f35717c93452ce3db90324fcb6da9cce"
  },
  {
    "url": "assets/js/12.cc03d3cb.js",
    "revision": "fd78f663cf69f2ffdda848882ee6f33e"
  },
  {
    "url": "assets/js/13.2c40235a.js",
    "revision": "2b414666a90c3a4f516a922446569d11"
  },
  {
    "url": "assets/js/14.7d7fb8ff.js",
    "revision": "21ceeafc8c2c71f9061ad06ad200d58a"
  },
  {
    "url": "assets/js/15.ffab6ab5.js",
    "revision": "395cec1501ba824a0c99245570b05b2a"
  },
  {
    "url": "assets/js/16.50a7d223.js",
    "revision": "1d72a5fce881751fafe8dc97af6e290d"
  },
  {
    "url": "assets/js/2.dcb8fc66.js",
    "revision": "ac904d02d52a433413af01b5af6419dc"
  },
  {
    "url": "assets/js/3.c9dd1c35.js",
    "revision": "156eeffaf26fae27f10aac3538e66496"
  },
  {
    "url": "assets/js/4.8be22387.js",
    "revision": "b54a8cea9354480f83dcd7c756f5c490"
  },
  {
    "url": "assets/js/5.00b77e90.js",
    "revision": "74d72d20b78c877ce724c7df884be7cf"
  },
  {
    "url": "assets/js/6.7500126a.js",
    "revision": "650e505c6a2cc76b1f1bed6db707c0fb"
  },
  {
    "url": "assets/js/7.1d5f978b.js",
    "revision": "50e4964d464534edfeda9fb165e98ed2"
  },
  {
    "url": "assets/js/8.41791258.js",
    "revision": "55267f481103afd9bf4b28858a595c09"
  },
  {
    "url": "assets/js/9.d120f337.js",
    "revision": "27d455a8718052f2d7262dd10f5fcf53"
  },
  {
    "url": "assets/js/app.c1ed933a.js",
    "revision": "83872ee3fdc9c12a4f6cbfd6200c6aa2"
  },
  {
    "url": "faq/index.html",
    "revision": "7a1e279ddbbd1e4ee1521781a7606b3a"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "06780ba293df238dea21c24010b036d3"
  },
  {
    "url": "guide/index.html",
    "revision": "26d175e3adfe90b7fb12ee29e5aa19f1"
  },
  {
    "url": "index.html",
    "revision": "44d7563214d4d63eccfcb9c9bd2ed73a"
  },
  {
    "url": "zh/api/index.html",
    "revision": "9d4ccab57165369249fd61e182e7e7b8"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "6de89ad9ab0d057e52c6734cbcd1e17d"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "18c9014ee9d5545b82b4fc11c6bd2b19"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "d25227f08b4a52c76f7fd72e2f6f6198"
  },
  {
    "url": "zh/index.html",
    "revision": "2633e78a44f99be690d2d86ff4b82756"
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
