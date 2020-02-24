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
    "revision": "d509f33193e0ac54f813087604ad9e47"
  },
  {
    "url": "api/index.html",
    "revision": "37b79ede2244c8178a7b3b3d8330864f"
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
    "url": "assets/js/13.1a0c5c1b.js",
    "revision": "fd9484df6cc53b897b470769a83f8171"
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
    "url": "assets/js/8.3b6dcf79.js",
    "revision": "6b3f63dabfccf0d7c75d88d65767efa7"
  },
  {
    "url": "assets/js/9.d120f337.js",
    "revision": "27d455a8718052f2d7262dd10f5fcf53"
  },
  {
    "url": "assets/js/app.f1c14a89.js",
    "revision": "eca10cc55784e4b5235b744021bf6073"
  },
  {
    "url": "faq/index.html",
    "revision": "284a5730adeb9afdfa0d91635bc9f241"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "aa19b31ece0849c0049156b85a11bfa3"
  },
  {
    "url": "guide/index.html",
    "revision": "d27527a387e37612b5c86e82afbdf9b7"
  },
  {
    "url": "index.html",
    "revision": "a68ae43d0a0128e436a9fea6f1deb01a"
  },
  {
    "url": "zh/api/index.html",
    "revision": "42ac359fd5d84435517cf16328572a1c"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "bc3ba744164d5a8d57e39d31f0b8379a"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "0b1d91bdafc98e9cb301be76b791dfb8"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "7c61aa578c102aa38a8e59719e79ecc2"
  },
  {
    "url": "zh/index.html",
    "revision": "787c4ca936999da83f5c6041f4c51dd9"
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
