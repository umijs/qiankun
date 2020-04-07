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
    "revision": "4967b41f994d372877c76458d7b9e88c"
  },
  {
    "url": "assets/css/0.styles.8e9170a3.css",
    "revision": "251ba29ed3fd745995c48f402c365216"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.21eb77a0.js",
    "revision": "e4bf5e93517d56737c9f90c1047d47f4"
  },
  {
    "url": "assets/js/11.0d28d9f7.js",
    "revision": "99bb216bb7753702bdb9ef7b7a2384b6"
  },
  {
    "url": "assets/js/12.3c7ecbdf.js",
    "revision": "31fe9117f2c6b5db82626b4cb7e3ee49"
  },
  {
    "url": "assets/js/13.c7d41c9e.js",
    "revision": "6c82b0adc3b5fe5f4bec9a31707461de"
  },
  {
    "url": "assets/js/14.d96b7f3b.js",
    "revision": "061f54913e75c303572e8a6e3d871a2d"
  },
  {
    "url": "assets/js/15.d692ccc6.js",
    "revision": "09daac41324780142667443a2dab0ef3"
  },
  {
    "url": "assets/js/16.05012f05.js",
    "revision": "1d72a5fce881751fafe8dc97af6e290d"
  },
  {
    "url": "assets/js/17.be119f07.js",
    "revision": "03056781dfcc73ddd5ac155442cd65c6"
  },
  {
    "url": "assets/js/2.87bf9a0e.js",
    "revision": "e1d79de1e4184c1201a735c60cd1ffce"
  },
  {
    "url": "assets/js/3.8fcfb9ef.js",
    "revision": "2c6d94db4c60931974645caf3c5341ed"
  },
  {
    "url": "assets/js/4.a72981ea.js",
    "revision": "b39d274d21e1e00010cc268976d19624"
  },
  {
    "url": "assets/js/5.e01e3731.js",
    "revision": "5431825a405ddf85f82a0d28fc9a088d"
  },
  {
    "url": "assets/js/6.fccbde02.js",
    "revision": "5a4040ef98887ce2e7d17c3f066b0f88"
  },
  {
    "url": "assets/js/7.fce7ee0e.js",
    "revision": "323fa798925a3e73f862f96dd4eba919"
  },
  {
    "url": "assets/js/8.27104936.js",
    "revision": "bd2152da26a5eb15fb05d5c1bad2fffc"
  },
  {
    "url": "assets/js/9.1cd40d7e.js",
    "revision": "0b675b9cc4439de6c231caefd06fb5b5"
  },
  {
    "url": "assets/js/app.73973707.js",
    "revision": "96eac72dee37d04bed2539c6b5b05036"
  },
  {
    "url": "faq/index.html",
    "revision": "24a4f9d95590389574cc61c49b6fb77b"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "dafd1c356049957ef34935b7f4af7136"
  },
  {
    "url": "guide/index.html",
    "revision": "ebac58b6a11503dbe422b097eb1182ed"
  },
  {
    "url": "index.html",
    "revision": "be06bcbc4128322593480ac82dfcdcf8"
  },
  {
    "url": "zh/api/index.html",
    "revision": "7f73a654ee3120ec5f772d708f5c3c1e"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "615ae1acd5d1fafff237e8530c9e7b41"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "fbdef8bc25134f674460a54612d37c04"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "f99ac551062127b03e1d684a303f7caa"
  },
  {
    "url": "zh/index.html",
    "revision": "8e17d4a51e642385e01c69ea6e4329d9"
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
