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
    "revision": "e9d850775d0eb8af7ef2941cf77dba0d"
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
    "url": "assets/js/12.b3550dd4.js",
    "revision": "0ace5ae0b4350bf1ade3de5ca74e943e"
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
    "url": "assets/js/6.c04cd581.js",
    "revision": "c688e196db86e3d6eefcdadd71894c39"
  },
  {
    "url": "assets/js/7.f0c162f7.js",
    "revision": "eaf27092cf971e6e1f144774fbef9cb6"
  },
  {
    "url": "assets/js/8.104c801d.js",
    "revision": "fd4a91d50c68f4edbbb0917b5b3aa84c"
  },
  {
    "url": "assets/js/9.3565c511.js",
    "revision": "0b675b9cc4439de6c231caefd06fb5b5"
  },
  {
    "url": "assets/js/app.b7854231.js",
    "revision": "d826f5ad147306bdae0cc715c6fdecb3"
  },
  {
    "url": "faq/index.html",
    "revision": "eef21e65e523013bba65314012ea9a71"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "ed1836351b1a86d3f31859388ef88e10"
  },
  {
    "url": "guide/index.html",
    "revision": "d54241a88597a96073285514b8d0a918"
  },
  {
    "url": "index.html",
    "revision": "3d79733ff1252f3be5ebf3a828674608"
  },
  {
    "url": "zh/api/index.html",
    "revision": "ecb25953b2438dfc6e6e1ab7748a48c3"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "421af031aa9ef3a1ecd5ea39a4f09526"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "5d04e1557e9b90ad6c187ce098623271"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "12929b649d4241ef13c6df612c0b7efb"
  },
  {
    "url": "zh/index.html",
    "revision": "126aa8d5fe7fa6f493114324642aecbd"
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
