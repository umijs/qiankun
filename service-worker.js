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
    "revision": "c1fcab3063ec3f17f0e8e5de0e17fda7"
  },
  {
    "url": "api/index.html",
    "revision": "79b7243c4c50d4d47ecc62221532e02c"
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
    "url": "assets/js/10.79c29aaf.js",
    "revision": "bf14ee185354971acf9c3a1f8309e642"
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
    "url": "assets/js/15.b0eb891d.js",
    "revision": "5c5e19ec8da3dd3ac0be9f278004fdb1"
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
    "url": "assets/js/6.dd28064e.js",
    "revision": "68fb2f88fe9218be036bbbb48c5e62eb"
  },
  {
    "url": "assets/js/7.04cf036a.js",
    "revision": "234a92fbd0340c696d579b29e46c3562"
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
    "url": "assets/js/app.14d43278.js",
    "revision": "6da8ed268e0fa3cd5a9e6d18bbb5dfac"
  },
  {
    "url": "faq/index.html",
    "revision": "5c738838e34088367daccad2b516bc4a"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "2dc279b4e9c43a73e3baef786049284a"
  },
  {
    "url": "guide/index.html",
    "revision": "250b67ff24f8937c79ecbbe28077335e"
  },
  {
    "url": "index.html",
    "revision": "5542dc420de9182dfb2a8e8313228eab"
  },
  {
    "url": "zh/api/index.html",
    "revision": "c93fefa52ac89c216d0644bc117d95ff"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "a113de00357f3110f1e3a34ed4fa48ab"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "69f2ebe51b0c3b2587a79e528c32ca1d"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "3f0d726520b15a762a93fba7c8d52fe2"
  },
  {
    "url": "zh/index.html",
    "revision": "2c90ef22f371d55329875c166343cf7c"
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
