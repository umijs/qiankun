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
    "revision": "6a80588e3cbf6448f8bebbc53c0e87e2"
  },
  {
    "url": "assets/css/0.styles.a6fd8785.css",
    "revision": "251ba29ed3fd745995c48f402c365216"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.4decf3cc.js",
    "revision": "e4bf5e93517d56737c9f90c1047d47f4"
  },
  {
    "url": "assets/js/11.7f1d2ce4.js",
    "revision": "99bb216bb7753702bdb9ef7b7a2384b6"
  },
  {
    "url": "assets/js/12.5b4c7132.js",
    "revision": "31fe9117f2c6b5db82626b4cb7e3ee49"
  },
  {
    "url": "assets/js/13.20118370.js",
    "revision": "aa5f41382943c2fe5803625b0147ddf9"
  },
  {
    "url": "assets/js/14.a2b88e6f.js",
    "revision": "061f54913e75c303572e8a6e3d871a2d"
  },
  {
    "url": "assets/js/15.ee660837.js",
    "revision": "09daac41324780142667443a2dab0ef3"
  },
  {
    "url": "assets/js/16.53d2cb33.js",
    "revision": "1d72a5fce881751fafe8dc97af6e290d"
  },
  {
    "url": "assets/js/17.36104c50.js",
    "revision": "03056781dfcc73ddd5ac155442cd65c6"
  },
  {
    "url": "assets/js/2.c66f83d4.js",
    "revision": "e1d79de1e4184c1201a735c60cd1ffce"
  },
  {
    "url": "assets/js/3.2c0b8aab.js",
    "revision": "2c6d94db4c60931974645caf3c5341ed"
  },
  {
    "url": "assets/js/4.5069acaa.js",
    "revision": "b39d274d21e1e00010cc268976d19624"
  },
  {
    "url": "assets/js/5.272b4ea1.js",
    "revision": "5431825a405ddf85f82a0d28fc9a088d"
  },
  {
    "url": "assets/js/6.8f23f4f9.js",
    "revision": "5a4040ef98887ce2e7d17c3f066b0f88"
  },
  {
    "url": "assets/js/7.f13648f5.js",
    "revision": "323fa798925a3e73f862f96dd4eba919"
  },
  {
    "url": "assets/js/8.4d7f74b3.js",
    "revision": "fc23473f84e5b7085a0498e729427128"
  },
  {
    "url": "assets/js/9.3565c511.js",
    "revision": "0b675b9cc4439de6c231caefd06fb5b5"
  },
  {
    "url": "assets/js/app.7b9f4b89.js",
    "revision": "f4ff28aed1e2600863e629b29c432416"
  },
  {
    "url": "faq/index.html",
    "revision": "92f867627fe9d9d8f3ce446636d25d21"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "1b93636cc3b8f76bf60ad7e3a6f1c881"
  },
  {
    "url": "guide/index.html",
    "revision": "f0adf9a3609a36561db49e46d6de1bd0"
  },
  {
    "url": "index.html",
    "revision": "de8ed49a0ede47ffadc79525c2f69da1"
  },
  {
    "url": "zh/api/index.html",
    "revision": "dd0038704122a5441f06b153a85f5978"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "a765ed629c079d67c3c2046ec293c64a"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "c953d76576bda0e7c044d0d13ce54236"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "dafee2abcb468eaf1e9c1d2505e3277f"
  },
  {
    "url": "zh/index.html",
    "revision": "63aa3d1e9098ec2f29a7651a028b1ef7"
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
