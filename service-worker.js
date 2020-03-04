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
    "revision": "7f7eb57f620944035a2ea86ce14a0b6d"
  },
  {
    "url": "api/index.html",
    "revision": "9256fe9e9bc9059a58b873d5e8feb4b4"
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
    "url": "assets/js/10.2eaffea4.js",
    "revision": "08abaaf6fa5d6941a763a9b69da52941"
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
    "url": "assets/js/6.48d47bdb.js",
    "revision": "68fb2f88fe9218be036bbbb48c5e62eb"
  },
  {
    "url": "assets/js/7.59cf059c.js",
    "revision": "234a92fbd0340c696d579b29e46c3562"
  },
  {
    "url": "assets/js/8.cbaee370.js",
    "revision": "6bd66b33629eb64a1cf6cd88f36af4a6"
  },
  {
    "url": "assets/js/9.ba667d11.js",
    "revision": "27d455a8718052f2d7262dd10f5fcf53"
  },
  {
    "url": "assets/js/app.17533936.js",
    "revision": "6a9586f14fa695065dadaba400713cbe"
  },
  {
    "url": "faq/index.html",
    "revision": "b472c594a7b912510c4eaddd3c51d278"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "75485f5bc5a0f2db4a977185450a6f93"
  },
  {
    "url": "guide/index.html",
    "revision": "85d76b930a26b3ecc9519bb971ebb379"
  },
  {
    "url": "index.html",
    "revision": "d2ad9131610bcd3cea7427c0a1876aad"
  },
  {
    "url": "zh/api/index.html",
    "revision": "14e1d0e4130236bcbd561375ec2ea43b"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "7ef8684a58ad0d2ff95889a26288aad7"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "6130fc98729a931fe5e38fc0764cfe96"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "fb08834857021e0d871c10572e60741a"
  },
  {
    "url": "zh/index.html",
    "revision": "f2cc465dd8c9a983607cb6fd12776528"
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
