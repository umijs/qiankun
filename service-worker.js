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
    "revision": "e517d698dc81a65d7c958e0423a54fc6"
  },
  {
    "url": "api/index.html",
    "revision": "beb8f6f070056cb427dd33a046708331"
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
    "url": "assets/js/12.f095c995.js",
    "revision": "e51179ed760110c1c9a9c8c9431fb497"
  },
  {
    "url": "assets/js/13.25f787b4.js",
    "revision": "6cbd1402f7fa81f3dcfcd6bdaa700310"
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
    "url": "assets/js/7.907c2470.js",
    "revision": "3754428977da04fbaa5069528c02a5e6"
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
    "url": "assets/js/app.00a98fe9.js",
    "revision": "38063ed3bf5074472eee7cab368ff8ff"
  },
  {
    "url": "faq/index.html",
    "revision": "1f81ad680fd77abe8ace395a053d1313"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "a6a464d06235927cc22b358fd7ce47b7"
  },
  {
    "url": "guide/index.html",
    "revision": "ad23c200495453a5e2e9d6a1990ee542"
  },
  {
    "url": "index.html",
    "revision": "a8faca195d21295f791702fac64e7359"
  },
  {
    "url": "zh/api/index.html",
    "revision": "df80a09ff038411f1ca9e2a8c0591a20"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "9872a30b96d067c52d84c3ec3f7adecd"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "6c0e90d2da110f1bf450c87abc35c283"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "d0ea7f3c3e58773ab83ecd7f9d28beb8"
  },
  {
    "url": "zh/index.html",
    "revision": "a0964d2563bbc21fb3eafd3879afe614"
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
