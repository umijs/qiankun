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
    "revision": "84666c83bd41457af74a0ce3a9a6d841"
  },
  {
    "url": "api/index.html",
    "revision": "19ad1072b2fc5efbfb94b4a6060fef07"
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
    "url": "assets/js/app.76977282.js",
    "revision": "c9a30bd19a0f5366364449c040bda704"
  },
  {
    "url": "faq/index.html",
    "revision": "7d16f6094c7947af6ebb30c518fec525"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "8094d753bd70172d8c9c86198180c636"
  },
  {
    "url": "guide/index.html",
    "revision": "dd23ba2d5f92e5eddf4d5007c05f066f"
  },
  {
    "url": "index.html",
    "revision": "96c5688a061e77ebce3f21b073cc49a6"
  },
  {
    "url": "zh/api/index.html",
    "revision": "9afbdaae0c5c4a6db7aa56dffcccecc3"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "9634f795247c500800568033d9c7cd08"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "b0514c98d8b5e1af4c2bbca050fbc423"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "cfcb2b2358227713e291416914325d21"
  },
  {
    "url": "zh/index.html",
    "revision": "6b912f65519b838709ee7820a4276758"
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
