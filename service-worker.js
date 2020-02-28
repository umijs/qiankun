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
    "revision": "0baf5d08335d12a31119dcd4329c7a04"
  },
  {
    "url": "api/index.html",
    "revision": "4a653b6421cf1630350d80ea1f4fa1f5"
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
    "url": "assets/js/13.b302d97f.js",
    "revision": "13da774edb586ec2aeeca069569e64da"
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
    "url": "assets/js/8.63d5d13b.js",
    "revision": "b2d3c9fc617e00441194074c8e2c1f38"
  },
  {
    "url": "assets/js/9.f4fe7193.js",
    "revision": "27d455a8718052f2d7262dd10f5fcf53"
  },
  {
    "url": "assets/js/app.d3aa30c6.js",
    "revision": "5474907a78711c3699e1839312868307"
  },
  {
    "url": "faq/index.html",
    "revision": "97686699e304545e7a9d6e239a99df9f"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "b3b80563f06bb7616b2fea5fae467086"
  },
  {
    "url": "guide/index.html",
    "revision": "01cc0351fb0f5d8824d13823d55586c8"
  },
  {
    "url": "index.html",
    "revision": "7d514015fbb6f46538235c2c52876a6f"
  },
  {
    "url": "zh/api/index.html",
    "revision": "3801766bbe5729d3bec45635ca503383"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "c532e1f3986df6d7dfc3c6268db8f17b"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "f6032e7d55c9982d544a22f9128844a0"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "30e1bee6a3870996f5f06e7dfddd8b56"
  },
  {
    "url": "zh/index.html",
    "revision": "8b2e4a93cfcaf3db4e04df20c267f7ac"
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
