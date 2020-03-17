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
    "revision": "9b535bf8e93fb14f7c647cf887881dc5"
  },
  {
    "url": "api/index.html",
    "revision": "615d55483496aba6f31f59b1818fadfc"
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
    "url": "assets/js/14.25b6635a.js",
    "revision": "633387e758e6588a352333a84e7fcea1"
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
    "url": "assets/js/9.43c9ba69.js",
    "revision": "21697f88922a23eed1745d77fabc5eb4"
  },
  {
    "url": "assets/js/app.dbf304b8.js",
    "revision": "92d374681432b07622f88dabca947694"
  },
  {
    "url": "faq/index.html",
    "revision": "a24234b3415063b2ba3e5be70309a403"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "13b7ddc13a12efd6e37bfe797056b651"
  },
  {
    "url": "guide/index.html",
    "revision": "978d4fef476851032e3061f5d178bdcf"
  },
  {
    "url": "index.html",
    "revision": "bdb92f71b8f0a5529e58d9f2788c2828"
  },
  {
    "url": "zh/api/index.html",
    "revision": "4c1e0a8454cf7152aa9bc49b8ba1fbf0"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "c9a37fcc60671b683a7c4b1d40baef54"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "5e4f9cfe1e367c7f5a3df916dbc90945"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "a43582b493d56a21aeb8a79b23567e66"
  },
  {
    "url": "zh/index.html",
    "revision": "e75a190f5b38fb99d6939209f2b8f615"
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
