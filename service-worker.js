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
    "revision": "7400a9a02dddeb31a62a677ffcb22eec"
  },
  {
    "url": "api/index.html",
    "revision": "8e810c3d534fdc4c83efe532015e6e77"
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
    "url": "assets/js/11.f28e97dc.js",
    "revision": "6727c1e7df055a4ab7d3df544d0c14dc"
  },
  {
    "url": "assets/js/12.0b769208.js",
    "revision": "a4025159d81cc014e02ec46e5756633a"
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
    "url": "assets/js/6.ee17396a.js",
    "revision": "f383aefd15bc082b894e10437a8d7e19"
  },
  {
    "url": "assets/js/7.7e819aa1.js",
    "revision": "9a39363ebeef5bf6f167ad1165b18ee0"
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
    "url": "assets/js/app.93690070.js",
    "revision": "3f9aec34e1e887e201dd7927fc672b5f"
  },
  {
    "url": "faq/index.html",
    "revision": "57c5657788cd2a8289805d321efada45"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "64ce6fa0d97fad207390b54e1fad18a6"
  },
  {
    "url": "guide/index.html",
    "revision": "00f30115257bae1312a26b0344544676"
  },
  {
    "url": "index.html",
    "revision": "22aba88bba1b7395efce9b1306e21fb2"
  },
  {
    "url": "zh/api/index.html",
    "revision": "8fbecbb9b717ebe2b82ff0c177d21b2d"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "32cd41fe80767ac7280b59006e7362fa"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "701eb54f5469b9cd6ba02228d60ed48b"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "af6017e5a5c679e998ef96209a16fa0b"
  },
  {
    "url": "zh/index.html",
    "revision": "acfa2686702daa6df91d445bcfd517f0"
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
