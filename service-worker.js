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
    "revision": "b2a18b6efed1817446195b63af3ab5c8"
  },
  {
    "url": "api/index.html",
    "revision": "08c4afc85bc2835bc44b530250f7b8c6"
  },
  {
    "url": "assets/css/0.styles.b60dbe72.css",
    "revision": "f0e2ef567acd5c71f8861490db9bb772"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.6499211f.js",
    "revision": "c5402d48d37c3acf681982d26096f2cd"
  },
  {
    "url": "assets/js/11.1efbb372.js",
    "revision": "57e21216917f6759cbcfbd57ab6609f3"
  },
  {
    "url": "assets/js/12.834b3b97.js",
    "revision": "7baae73d7669fa0e53c8d6d03e593e05"
  },
  {
    "url": "assets/js/13.881fc36e.js",
    "revision": "4a2f78daa4503d796cb54dfee5dd62ab"
  },
  {
    "url": "assets/js/14.f82c43f9.js",
    "revision": "d3f24384b34066950e6e737c8e9d3e84"
  },
  {
    "url": "assets/js/15.a66b636b.js",
    "revision": "0be66769c3c772ad3fa8e49f03a848d4"
  },
  {
    "url": "assets/js/16.abaaecdb.js",
    "revision": "955f6c66d71bb3296d459ee623e8965d"
  },
  {
    "url": "assets/js/17.8b2925ac.js",
    "revision": "00e72849355852dcbe068c7135e6dd95"
  },
  {
    "url": "assets/js/2.b25794af.js",
    "revision": "35f4ca32a4f4f66ce35cfa17d1bf972d"
  },
  {
    "url": "assets/js/3.0164b3a4.js",
    "revision": "c1a1cf48d8380d7fe869aa7ae807460d"
  },
  {
    "url": "assets/js/4.3ae9d82a.js",
    "revision": "b6b99ecb1a9dccd7782786f1e923acde"
  },
  {
    "url": "assets/js/5.23910528.js",
    "revision": "4038d31880965200b2a84e12a58baace"
  },
  {
    "url": "assets/js/6.4ea80c66.js",
    "revision": "249a6eaf5ae059b4349ec6d4012c4105"
  },
  {
    "url": "assets/js/7.55c9405f.js",
    "revision": "2b7fee38c2cb6765fe74d45b8281cef1"
  },
  {
    "url": "assets/js/8.506b9ab1.js",
    "revision": "8b4d41553b1205390f084a8cd553daf9"
  },
  {
    "url": "assets/js/9.cb2f04b2.js",
    "revision": "a4125b667fdb0f1b95dd2c0eafae9fe5"
  },
  {
    "url": "assets/js/app.0c03f5c9.js",
    "revision": "1862cb993248bdb39b6650682c0fafd3"
  },
  {
    "url": "faq/index.html",
    "revision": "bd7ed126912db02544ef5779e97b194b"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "a68beff7471eeadad10eab29a8baead8"
  },
  {
    "url": "guide/index.html",
    "revision": "6fd6c2d18047ab6b2e972f15008cd837"
  },
  {
    "url": "index.html",
    "revision": "90b65379993a787bffbf7bc7505aba56"
  },
  {
    "url": "zh/api/index.html",
    "revision": "b30c3535f44a584d003573c785d57959"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "9215ea44d2f3a9ef32e1cd238e6ccece"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "57b030c9436c32222410c8930fcd98a2"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "8fe610058085cf5151950815030a40e3"
  },
  {
    "url": "zh/index.html",
    "revision": "e8b002005b4f1a810696bfc92d8cad70"
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
