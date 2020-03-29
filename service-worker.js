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
    "revision": "cc0e48d6ac30577f9f651b00202923a3"
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
    "url": "assets/js/12.c3438dc9.js",
    "revision": "1bee00bd77aef268195c83312b2f8069"
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
    "url": "assets/js/7.b7705983.js",
    "revision": "27e406433cb3b0b6084694aa340c7829"
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
    "url": "assets/js/app.8c56d416.js",
    "revision": "a5ce2396e39076a65fb6cbeafbb72f62"
  },
  {
    "url": "faq/index.html",
    "revision": "875e0a7939d0b03309064eeb460ee2a7"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "638a130dba8ddb71474d8dc73f1bed74"
  },
  {
    "url": "guide/index.html",
    "revision": "a6de59430ec578c1cab8f08a21f938d0"
  },
  {
    "url": "index.html",
    "revision": "bd0f7d6d53c28934e3323576c592e799"
  },
  {
    "url": "zh/api/index.html",
    "revision": "86cbf073e688ba051fd7adf03b96606d"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "515a8504a79522bbed78835e5b95cf55"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "91ef5810f527b5db841d2cfd1261ee89"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "3101bef243de9dec172cf15587fdf473"
  },
  {
    "url": "zh/index.html",
    "revision": "58fb04fae431e73432ae785f10e46ab9"
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
