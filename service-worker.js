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
    "revision": "28e61ac76459eadc705160a18e28ffa5"
  },
  {
    "url": "api/index.html",
    "revision": "1591acd48d0041d67a1e0b35b85d5cb2"
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
    "url": "assets/js/app.deb31eed.js",
    "revision": "3c4f36ebc5bb1e63641f4dd9462f94c3"
  },
  {
    "url": "faq/index.html",
    "revision": "7149042b589446ef4bcd251786bfb478"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "da3007e2922e2c03fdb185c65a53e0b7"
  },
  {
    "url": "guide/index.html",
    "revision": "59b533a86e682c3f7e73262969b0490b"
  },
  {
    "url": "index.html",
    "revision": "0d6a1b0ddaff243ba6b0c3a81971ed08"
  },
  {
    "url": "zh/api/index.html",
    "revision": "bf526ca6b718860d3d0281b87e3638df"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "5bb7b1889aa80258d2b45034abb2ac04"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "8ef05b1f33bfb4b95b4dd8f453bbd542"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "3481e7bba41e016086938bb4b91112a3"
  },
  {
    "url": "zh/index.html",
    "revision": "bf67ff1e25bb626ad1cfda5c29452037"
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
