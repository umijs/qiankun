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
    "revision": "5de7b3afe6fb14b857c4dbf34b7005df"
  },
  {
    "url": "api/index.html",
    "revision": "a68164e4a7619c1fad12f3453830aeea"
  },
  {
    "url": "assets/css/0.styles.561b124d.css",
    "revision": "f0e2ef567acd5c71f8861490db9bb772"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.01ab7229.js",
    "revision": "41a98c9c12a18343e6da0f1a6c52b4ad"
  },
  {
    "url": "assets/js/11.83905216.js",
    "revision": "ba5f06a8399964ec9a12aa6f4c025840"
  },
  {
    "url": "assets/js/12.d084ec2c.js",
    "revision": "6b044d03f6a8f2bb231b447b61dc33a0"
  },
  {
    "url": "assets/js/13.7b31d599.js",
    "revision": "3689f7faa5a67f05a706be2427500538"
  },
  {
    "url": "assets/js/14.c6be3c4e.js",
    "revision": "d3f24384b34066950e6e737c8e9d3e84"
  },
  {
    "url": "assets/js/15.d46b7b2f.js",
    "revision": "0be66769c3c772ad3fa8e49f03a848d4"
  },
  {
    "url": "assets/js/16.b62491af.js",
    "revision": "955f6c66d71bb3296d459ee623e8965d"
  },
  {
    "url": "assets/js/17.dc2c4e78.js",
    "revision": "00e72849355852dcbe068c7135e6dd95"
  },
  {
    "url": "assets/js/2.7fd8a689.js",
    "revision": "35f4ca32a4f4f66ce35cfa17d1bf972d"
  },
  {
    "url": "assets/js/3.60a0c2c7.js",
    "revision": "c1a1cf48d8380d7fe869aa7ae807460d"
  },
  {
    "url": "assets/js/4.2f51514e.js",
    "revision": "b6b99ecb1a9dccd7782786f1e923acde"
  },
  {
    "url": "assets/js/5.2cac2106.js",
    "revision": "4038d31880965200b2a84e12a58baace"
  },
  {
    "url": "assets/js/6.4e76b181.js",
    "revision": "249a6eaf5ae059b4349ec6d4012c4105"
  },
  {
    "url": "assets/js/7.63346b1e.js",
    "revision": "ee08eeea411bc29953d7f57a42c4aa62"
  },
  {
    "url": "assets/js/8.fc5f63b2.js",
    "revision": "9e4b16f5267175fdb45510932739dcf5"
  },
  {
    "url": "assets/js/9.c7f3acc5.js",
    "revision": "ec7f28d80fd3bffd2df2feb6fa8dc5f2"
  },
  {
    "url": "assets/js/app.a394b951.js",
    "revision": "a766466c5e6d6a47fa2d7e50895db956"
  },
  {
    "url": "faq/index.html",
    "revision": "2b943c3d2a68bcef4bb1f1b867daa666"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "7fba1ca7d2ac9e20ae7a9dddd68e7184"
  },
  {
    "url": "guide/index.html",
    "revision": "036c75cb54491d188036880f9f97d301"
  },
  {
    "url": "index.html",
    "revision": "4ac25048ebffb86a19abd834642a1b6c"
  },
  {
    "url": "zh/api/index.html",
    "revision": "c0754cae566fbe358f3008afd528229b"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "df6c057ebed10e8ed06754dc9177cd3b"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "1b65883decbfdd90ab57419f9cc850b1"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "19a8fc153e69e1b9cd0e8fbd13fe5b51"
  },
  {
    "url": "zh/index.html",
    "revision": "04c4e62a626bf216f7b65ca458fa17c0"
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
