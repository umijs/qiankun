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
    "revision": "23a0b9967f19d79c3f4dbb65b241a3dc"
  },
  {
    "url": "api/index.html",
    "revision": "733f0f000e64e222fb2add053d4547cf"
  },
  {
    "url": "assets/css/0.styles.bedefebe.css",
    "revision": "774ec53984823549f7bb60998f64da08"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.5b36abd6.js",
    "revision": "bf14ee185354971acf9c3a1f8309e642"
  },
  {
    "url": "assets/js/11.ba941abc.js",
    "revision": "f35717c93452ce3db90324fcb6da9cce"
  },
  {
    "url": "assets/js/12.60412013.js",
    "revision": "d58ae2d53e5d2e7a0ae2ccebf96c64b9"
  },
  {
    "url": "assets/js/13.10c59cb3.js",
    "revision": "9489e55a37e823c9288feb64782c70b3"
  },
  {
    "url": "assets/js/14.4d4a96d6.js",
    "revision": "21ceeafc8c2c71f9061ad06ad200d58a"
  },
  {
    "url": "assets/js/15.73186262.js",
    "revision": "5c5e19ec8da3dd3ac0be9f278004fdb1"
  },
  {
    "url": "assets/js/16.d5f63d6d.js",
    "revision": "1d72a5fce881751fafe8dc97af6e290d"
  },
  {
    "url": "assets/js/2.4468c180.js",
    "revision": "ac904d02d52a433413af01b5af6419dc"
  },
  {
    "url": "assets/js/3.0c9fca0f.js",
    "revision": "156eeffaf26fae27f10aac3538e66496"
  },
  {
    "url": "assets/js/4.9cca4757.js",
    "revision": "b54a8cea9354480f83dcd7c756f5c490"
  },
  {
    "url": "assets/js/5.aeff9b16.js",
    "revision": "74d72d20b78c877ce724c7df884be7cf"
  },
  {
    "url": "assets/js/6.1258f34a.js",
    "revision": "650e505c6a2cc76b1f1bed6db707c0fb"
  },
  {
    "url": "assets/js/7.ad2a5b8e.js",
    "revision": "3dc1b6193fa2e1230dabb31b1b72394e"
  },
  {
    "url": "assets/js/8.b800f7a7.js",
    "revision": "7282fd918649d64f0409ab0c829aa6e3"
  },
  {
    "url": "assets/js/9.ba667d11.js",
    "revision": "27d455a8718052f2d7262dd10f5fcf53"
  },
  {
    "url": "assets/js/app.71cd0405.js",
    "revision": "9e7dc71688de398609779727dc1a8ba0"
  },
  {
    "url": "faq/index.html",
    "revision": "15dd55948982970cb855b4bec7f91029"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "d6c748149d18005e4fcfb33c44dd7406"
  },
  {
    "url": "guide/index.html",
    "revision": "38517058cc8f259cfa13412c99c42186"
  },
  {
    "url": "index.html",
    "revision": "df41bd28681ac238cbfbe3851d3f9245"
  },
  {
    "url": "zh/api/index.html",
    "revision": "b7396cba05df64368e094f14be98b981"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "f317112a9fca52f889251e35e76c594c"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "a0afc7f3ffe712e31da55dbccb8fd617"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "8990535b30f099ec6800793b6cf39991"
  },
  {
    "url": "zh/index.html",
    "revision": "f82c77e4a405e418e0be2db60d60d4d7"
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
