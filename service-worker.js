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
    "revision": "a60cf40e522f9e8ceddeb9320aae7c85"
  },
  {
    "url": "api/index.html",
    "revision": "471bf2b33b705e075c2e408bd1940b1c"
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
    "url": "assets/js/10.35260cc8.js",
    "revision": "c5402d48d37c3acf681982d26096f2cd"
  },
  {
    "url": "assets/js/11.c4ae871d.js",
    "revision": "57e21216917f6759cbcfbd57ab6609f3"
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
    "url": "assets/js/9.20370be3.js",
    "revision": "a4125b667fdb0f1b95dd2c0eafae9fe5"
  },
  {
    "url": "assets/js/app.8b91847a.js",
    "revision": "4f0620cfa9d1fde23b46f9e3bdcafc91"
  },
  {
    "url": "faq/index.html",
    "revision": "8ddee5b9ab7b6c6778f314b5769c3ac1"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "5a5ae066b55b4cf37ea9d819114435b6"
  },
  {
    "url": "guide/index.html",
    "revision": "c7bb50745b3c7f961807326563c042a5"
  },
  {
    "url": "index.html",
    "revision": "69f80edce524b7ddeef9b6589bbfd301"
  },
  {
    "url": "zh/api/index.html",
    "revision": "4826e2485c43ac2010a97023013f60f4"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "c0d91fe2a1117a70b4fc8d214d6ed8f0"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "e9f0d45611e6a1838a76fe41cfc7f593"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "28477e460562235cc8a5dd5aabcf8603"
  },
  {
    "url": "zh/index.html",
    "revision": "7c6e8f381c92cc2404e3b92444355f6d"
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
