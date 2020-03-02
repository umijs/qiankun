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
    "revision": "169a4c758f0d079102ed20e93fa41265"
  },
  {
    "url": "api/index.html",
    "revision": "3adfa4e311c9f88207bed5c931b9a318"
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
    "url": "assets/js/app.1d78f282.js",
    "revision": "c3edc84aafbff0193354102b9204c963"
  },
  {
    "url": "faq/index.html",
    "revision": "727a53dad777206ac4044f2c55e8375f"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "d7af386770ad8f1893737a19d6e8a838"
  },
  {
    "url": "guide/index.html",
    "revision": "37ab4fd98c4a9e8c1bb3ac0a4fda5468"
  },
  {
    "url": "index.html",
    "revision": "f13bd74e5b53ab3fd92bc95ff6337dc2"
  },
  {
    "url": "zh/api/index.html",
    "revision": "711aba4bc4a9fcc1147050c5636fef2f"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "d98a0619000e318672be0aeca6a226cd"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "31817bff969fc85541a0db3a3c14a5ef"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "9b1f5efa8ab953233bb1f11afdc803b9"
  },
  {
    "url": "zh/index.html",
    "revision": "4d4cc0e5a78fa339cf903cdcf90f63cc"
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
