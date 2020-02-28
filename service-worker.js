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
    "revision": "7b2f4a71d8e8d35d5275d5cffdf762cf"
  },
  {
    "url": "api/index.html",
    "revision": "846c0285d1263b12cae92195177495e1"
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
    "url": "assets/js/app.8fde179c.js",
    "revision": "66ccc71cc76bffcb7257a19eb14e19fa"
  },
  {
    "url": "faq/index.html",
    "revision": "bbe6135661626c4726554d7bfc74b6c0"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "4a4991c9407f51fe2099caf4764e262e"
  },
  {
    "url": "guide/index.html",
    "revision": "cc887f849d5eb08700271182566f67d3"
  },
  {
    "url": "index.html",
    "revision": "c777e8abda5e627641a58c50d55e9d8c"
  },
  {
    "url": "zh/api/index.html",
    "revision": "f1e7c24c657067509ce932f2a153a7a5"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "0fdb07aa53bd88b5d5be879a168797f6"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "9b294ab18e5a6bf32edf8314342817eb"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "9754e2f029d7bc2ecbca797dc672e16a"
  },
  {
    "url": "zh/index.html",
    "revision": "cb001331d98c6000f460b1b310f09354"
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
