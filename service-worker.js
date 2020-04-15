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
    "revision": "b302843c3bbdd1b347389e37b17413c9"
  },
  {
    "url": "api/index.html",
    "revision": "5856b06e754cb0ed5ac6fcbf19284e9e"
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
    "url": "assets/js/10.32c36dc1.js",
    "revision": "106bd8ac0b38959b169ecff6d4b7a524"
  },
  {
    "url": "assets/js/11.6916f6f2.js",
    "revision": "bd6a9c349efe9b343db306f023aa7868"
  },
  {
    "url": "assets/js/12.8320c3ff.js",
    "revision": "b5b72a70b6b58438e0badf47aa3e7dff"
  },
  {
    "url": "assets/js/13.ca4ab652.js",
    "revision": "90b3d9b42b4db4242b146fa226644e27"
  },
  {
    "url": "assets/js/14.3d82b9e4.js",
    "revision": "9ab35447ee0181288ad1cef6e3faed2e"
  },
  {
    "url": "assets/js/15.36abb755.js",
    "revision": "c3f2928a45dcae9ca0d6652b958106d5"
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
    "url": "assets/js/7.b7dc9079.js",
    "revision": "34660a3048069572e281e5bb34419676"
  },
  {
    "url": "assets/js/8.a097fa43.js",
    "revision": "aa5e5798a836ebe67810b3fbcdec6d18"
  },
  {
    "url": "assets/js/9.20370be3.js",
    "revision": "a4125b667fdb0f1b95dd2c0eafae9fe5"
  },
  {
    "url": "assets/js/app.b83e4fa9.js",
    "revision": "05b84c80d8d13f3ad9a3d7acd255a84e"
  },
  {
    "url": "faq/index.html",
    "revision": "3afc335b848d13c6dadd14b70c716fe0"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "1ae24ff1b8d5d8ad677a3bb6ba4e6c8d"
  },
  {
    "url": "guide/index.html",
    "revision": "5564b44173eb4c0989189460e2b73560"
  },
  {
    "url": "index.html",
    "revision": "8b3bdb45e076bca05a91f43500758b9a"
  },
  {
    "url": "zh/api/index.html",
    "revision": "5dfdbf1285e1d7d81d05b350aeb70bad"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "e75c91c1bba431cc877c16a812a96345"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "3552ef750366d0306462546c9f5017c7"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "539995748bb4957bef1ea9201382518f"
  },
  {
    "url": "zh/index.html",
    "revision": "fc92e5a7ac843099cda9e56f4d04a2fd"
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
