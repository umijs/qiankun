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
    "url": "api/index.html",
    "revision": "d97a551c32bd9639a340c197bf5dcd94"
  },
  {
    "url": "assets/css/0.styles.ad7e383b.css",
    "revision": "251ba29ed3fd745995c48f402c365216"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.f2395109.js",
    "revision": "e4bf5e93517d56737c9f90c1047d47f4"
  },
  {
    "url": "assets/js/11.4f81f8bf.js",
    "revision": "99bb216bb7753702bdb9ef7b7a2384b6"
  },
  {
    "url": "assets/js/12.5d9adbdd.js",
    "revision": "31fe9117f2c6b5db82626b4cb7e3ee49"
  },
  {
    "url": "assets/js/13.ead0fd81.js",
    "revision": "aa5f41382943c2fe5803625b0147ddf9"
  },
  {
    "url": "assets/js/14.90993a3f.js",
    "revision": "061f54913e75c303572e8a6e3d871a2d"
  },
  {
    "url": "assets/js/15.98ab297f.js",
    "revision": "09daac41324780142667443a2dab0ef3"
  },
  {
    "url": "assets/js/16.e002e4d7.js",
    "revision": "1d72a5fce881751fafe8dc97af6e290d"
  },
  {
    "url": "assets/js/17.db6af6bb.js",
    "revision": "03056781dfcc73ddd5ac155442cd65c6"
  },
  {
    "url": "assets/js/2.e66dd251.js",
    "revision": "e1d79de1e4184c1201a735c60cd1ffce"
  },
  {
    "url": "assets/js/3.63ff2db4.js",
    "revision": "2c6d94db4c60931974645caf3c5341ed"
  },
  {
    "url": "assets/js/4.e9765c44.js",
    "revision": "b39d274d21e1e00010cc268976d19624"
  },
  {
    "url": "assets/js/5.ed3de3b9.js",
    "revision": "5431825a405ddf85f82a0d28fc9a088d"
  },
  {
    "url": "assets/js/6.ed14734e.js",
    "revision": "5a4040ef98887ce2e7d17c3f066b0f88"
  },
  {
    "url": "assets/js/7.70e7c81d.js",
    "revision": "323fa798925a3e73f862f96dd4eba919"
  },
  {
    "url": "assets/js/8.5b169727.js",
    "revision": "fc23473f84e5b7085a0498e729427128"
  },
  {
    "url": "assets/js/9.c62ed377.js",
    "revision": "0b675b9cc4439de6c231caefd06fb5b5"
  },
  {
    "url": "assets/js/app.59cf0ac2.js",
    "revision": "e53bebcf6b4e3bcee3e5332b869121b8"
  },
  {
    "url": "faq/index.html",
    "revision": "4b13f6b0cc644f7bd136c221f03065ee"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "81954f7c1342130797871d1953b5c028"
  },
  {
    "url": "guide/index.html",
    "revision": "572d3858833b492177dea40b35bcc3c8"
  },
  {
    "url": "index.html",
    "revision": "513e021f16cf2f0dfe2b6e489817545a"
  },
  {
    "url": "zh/api/index.html",
    "revision": "53b3fc9d18df46cb0b0d3aa2d1539b4b"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "50a254a97ceade0ae024c9ccb58e7ead"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "441c29dcc1980a2de519e29eb4fb9220"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "393c5bea0a152665c2d4ba95694fec62"
  },
  {
    "url": "zh/index.html",
    "revision": "3a15c4023bb2cbd8e6705d5544c04507"
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
