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
    "revision": "6d7e13b778272450bf8cbcba0fdd1635"
  },
  {
    "url": "assets/css/0.styles.f892cd2a.css",
    "revision": "251ba29ed3fd745995c48f402c365216"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.ea34b78f.js",
    "revision": "e4bf5e93517d56737c9f90c1047d47f4"
  },
  {
    "url": "assets/js/11.dd927cc6.js",
    "revision": "b4e97e2ebd14d9d3e6f33a0540e438b8"
  },
  {
    "url": "assets/js/12.c6be16b4.js",
    "revision": "31fe9117f2c6b5db82626b4cb7e3ee49"
  },
  {
    "url": "assets/js/13.f60c8b35.js",
    "revision": "9594e8be70c617a84ca37d990359e7a2"
  },
  {
    "url": "assets/js/14.d28b6ea3.js",
    "revision": "061f54913e75c303572e8a6e3d871a2d"
  },
  {
    "url": "assets/js/15.c9b1971d.js",
    "revision": "09daac41324780142667443a2dab0ef3"
  },
  {
    "url": "assets/js/16.0e06cf10.js",
    "revision": "1d72a5fce881751fafe8dc97af6e290d"
  },
  {
    "url": "assets/js/17.4315ca29.js",
    "revision": "03056781dfcc73ddd5ac155442cd65c6"
  },
  {
    "url": "assets/js/2.20235d45.js",
    "revision": "e1d79de1e4184c1201a735c60cd1ffce"
  },
  {
    "url": "assets/js/3.096415a6.js",
    "revision": "2c6d94db4c60931974645caf3c5341ed"
  },
  {
    "url": "assets/js/4.5a33d315.js",
    "revision": "b39d274d21e1e00010cc268976d19624"
  },
  {
    "url": "assets/js/5.bdb3e0ea.js",
    "revision": "5431825a405ddf85f82a0d28fc9a088d"
  },
  {
    "url": "assets/js/6.f10bbc6a.js",
    "revision": "95da4032a8f7369da3e18dd05d6f2799"
  },
  {
    "url": "assets/js/7.6207fa87.js",
    "revision": "323fa798925a3e73f862f96dd4eba919"
  },
  {
    "url": "assets/js/8.07e33187.js",
    "revision": "ca940cc5889773456d24d73dd95c7ec2"
  },
  {
    "url": "assets/js/9.8d29c0cf.js",
    "revision": "0b675b9cc4439de6c231caefd06fb5b5"
  },
  {
    "url": "assets/js/app.93555718.js",
    "revision": "6a7b8f51dd1fb9e32c19fc94afe7bfcb"
  },
  {
    "url": "faq/index.html",
    "revision": "1a883a165ce08f4baff7c30a184f8145"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "3f10140b48d1d356ebff109c26c5bbb2"
  },
  {
    "url": "guide/index.html",
    "revision": "957775f7c59baa10a970d43edf4d9fa3"
  },
  {
    "url": "index.html",
    "revision": "11a32fbb88673b0dcf0ca2ca34fc1641"
  },
  {
    "url": "zh/api/index.html",
    "revision": "5f935d6ff2821b517d5b84b189764895"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "15c1f8f35fbda18dc4e53a8a814658d9"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "9156d8a8761ac5327c6c90c0c9e212ae"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "9d4d712c4968f5aea25ef439198d7894"
  },
  {
    "url": "zh/index.html",
    "revision": "d43361b78b8841fbc5bca2b85fc631dc"
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
