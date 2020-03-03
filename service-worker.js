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
    "revision": "8c4b259bb826b6a4d4958703dcc6f0e7"
  },
  {
    "url": "api/index.html",
    "revision": "7297f58e884d07fd4a27e31560cec4bd"
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
    "url": "assets/js/8.400fbc55.js",
    "revision": "990545215eed94c00c6be07c108f0449"
  },
  {
    "url": "assets/js/9.ba667d11.js",
    "revision": "27d455a8718052f2d7262dd10f5fcf53"
  },
  {
    "url": "assets/js/app.3847e6e9.js",
    "revision": "eb76738df4d5e5a6c5cd904503a55be8"
  },
  {
    "url": "faq/index.html",
    "revision": "175944f3597dea809f73c214392e8d63"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "269389cead532a113661b99970654be8"
  },
  {
    "url": "guide/index.html",
    "revision": "e74562fd5c264ec4319c549170ad191f"
  },
  {
    "url": "index.html",
    "revision": "750a8aacb21b293b7f701400cbf2a809"
  },
  {
    "url": "zh/api/index.html",
    "revision": "cdc58c530a41004336ef6a053ecea2d2"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "ffb99e94bc985c259a1884e6a1e73b83"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "5e22b566a6e6de14d537e51ee99117ce"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "b6ba1d6f5ab48ffe1b66a7acf5afe381"
  },
  {
    "url": "zh/index.html",
    "revision": "611eb4381682c760b706d5e130b800d0"
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
