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
    "revision": "b1397f813683bca12f4ceb15f25a6f6c"
  },
  {
    "url": "api/index.html",
    "revision": "3818bda22ede57102772fcefc228163f"
  },
  {
    "url": "assets/css/0.styles.81e21519.css",
    "revision": "774ec53984823549f7bb60998f64da08"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.d795a137.js",
    "revision": "55050a8fc449681e1db09c7338db69bf"
  },
  {
    "url": "assets/js/11.104a2340.js",
    "revision": "f35717c93452ce3db90324fcb6da9cce"
  },
  {
    "url": "assets/js/12.16dd3850.js",
    "revision": "d58ae2d53e5d2e7a0ae2ccebf96c64b9"
  },
  {
    "url": "assets/js/13.ac4a0660.js",
    "revision": "fd9484df6cc53b897b470769a83f8171"
  },
  {
    "url": "assets/js/14.4b2c6b95.js",
    "revision": "21ceeafc8c2c71f9061ad06ad200d58a"
  },
  {
    "url": "assets/js/15.4ac399b1.js",
    "revision": "395cec1501ba824a0c99245570b05b2a"
  },
  {
    "url": "assets/js/16.1afaef4e.js",
    "revision": "1d72a5fce881751fafe8dc97af6e290d"
  },
  {
    "url": "assets/js/2.abcc74d5.js",
    "revision": "ac904d02d52a433413af01b5af6419dc"
  },
  {
    "url": "assets/js/3.d7a04239.js",
    "revision": "156eeffaf26fae27f10aac3538e66496"
  },
  {
    "url": "assets/js/4.0983d0e4.js",
    "revision": "b54a8cea9354480f83dcd7c756f5c490"
  },
  {
    "url": "assets/js/5.32e15704.js",
    "revision": "74d72d20b78c877ce724c7df884be7cf"
  },
  {
    "url": "assets/js/6.51647356.js",
    "revision": "650e505c6a2cc76b1f1bed6db707c0fb"
  },
  {
    "url": "assets/js/7.178bb0a7.js",
    "revision": "3dc1b6193fa2e1230dabb31b1b72394e"
  },
  {
    "url": "assets/js/8.739ef042.js",
    "revision": "6b3f63dabfccf0d7c75d88d65767efa7"
  },
  {
    "url": "assets/js/9.f4fe7193.js",
    "revision": "27d455a8718052f2d7262dd10f5fcf53"
  },
  {
    "url": "assets/js/app.87ee1190.js",
    "revision": "8e9327c72a8b18937a436c0666e0dd5f"
  },
  {
    "url": "faq/index.html",
    "revision": "f8a6f6e074919e6a179e1755603fba17"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "e9bffadf0d14c0f3b7adaf54b0a70c8c"
  },
  {
    "url": "guide/index.html",
    "revision": "a28bef40a80ed58d88345855f988b510"
  },
  {
    "url": "index.html",
    "revision": "651b4572b4bbc447698104fbee66a5f0"
  },
  {
    "url": "zh/api/index.html",
    "revision": "c24ff9467cd0421cc7b90e05b6d2962d"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "e957ddc979d0410b8c6f30849e2d68c7"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "e079e2aa7f301c66cae496be988c76e2"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "010c4027f957772bf782e4c9eed17bb4"
  },
  {
    "url": "zh/index.html",
    "revision": "9d0efabaf043d2ef3af9122f39014c00"
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
