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
    "revision": "da7a1462c8e4d04825781ceff3fcef96"
  },
  {
    "url": "api/index.html",
    "revision": "62a5b7ca539eb29558addee7712a8822"
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
    "url": "assets/js/13.31433193.js",
    "revision": "be09af45021e430c94b8d4dc05553000"
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
    "url": "assets/js/8.4c4270a0.js",
    "revision": "3e0f29b8a2a310331e98e37ae53d9b63"
  },
  {
    "url": "assets/js/9.f4fe7193.js",
    "revision": "27d455a8718052f2d7262dd10f5fcf53"
  },
  {
    "url": "assets/js/app.89395e02.js",
    "revision": "9b849570850ca4bb4878c13c583a9d61"
  },
  {
    "url": "faq/index.html",
    "revision": "78bcd83e900744edbedb0bb09526f7ec"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "0456a3aa1a3cbf09fdeac7444c8f7041"
  },
  {
    "url": "guide/index.html",
    "revision": "cd83575d86c13d90de86c991c72af8ff"
  },
  {
    "url": "index.html",
    "revision": "3cbb9026cd58e9211c5ab35bb7de4e23"
  },
  {
    "url": "zh/api/index.html",
    "revision": "905514e4ff27cffcf2f7e82a16755f76"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "03f73a5a598d884468b4bf8797083eac"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "3acf94672f5441aa9d75b95937a4fb26"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "116f0f4a211f845e0cae5e2f6890f05e"
  },
  {
    "url": "zh/index.html",
    "revision": "12031b3174c93953582c36e66d4f581f"
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
