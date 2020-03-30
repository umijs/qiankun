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
    "revision": "ae2a9f49429c0092be0a784ff25160ed"
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
    "url": "assets/js/app.a07569d6.js",
    "revision": "9eb556b717562aea224473daf141c97e"
  },
  {
    "url": "faq/index.html",
    "revision": "80a55a5ad7054261b852b9dc9590b1eb"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "12c2551065d9a975456e550ac1340e64"
  },
  {
    "url": "guide/index.html",
    "revision": "a78faed225911a4d6bbaa51251ecfbfd"
  },
  {
    "url": "index.html",
    "revision": "2e018ae3ba82e0f1d695e1ed02b764b1"
  },
  {
    "url": "zh/api/index.html",
    "revision": "0d70f70e7af47d075728764bfc995c87"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "248cadcdf69ced313adcfa3c57fb82d6"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "c16e34455d371bf63841365e568c24f9"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "3073aad800eb045d69618455332753c0"
  },
  {
    "url": "zh/index.html",
    "revision": "56fb5bf9645978721c12a947cebe856a"
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
