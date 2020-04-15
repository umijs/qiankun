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
    "revision": "a42d1d2deb49b3bf5e786ae377e24a79"
  },
  {
    "url": "api/index.html",
    "revision": "8c39288a1ef48ff4dd529560a72d4efd"
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
    "url": "assets/js/app.bac9dc25.js",
    "revision": "38300082b8046fbf8d47dd84ffaa7a6f"
  },
  {
    "url": "faq/index.html",
    "revision": "1290bc46a8fdb34e699a37db0b6dbde8"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "af0cfa444bf50ada90af3eda68ba071c"
  },
  {
    "url": "guide/index.html",
    "revision": "941fb77c3de633a29467302376939035"
  },
  {
    "url": "index.html",
    "revision": "b5703f1fadd8d8e963bc40e799938a60"
  },
  {
    "url": "zh/api/index.html",
    "revision": "2965cfe2447ad325e405ace5df219ff6"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "7db6a3cb216fb53f4427d4b3312b0040"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "2f04317ae6c7893022135ca43960320a"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "82fcf5de73afd6a015b9d0dab276da11"
  },
  {
    "url": "zh/index.html",
    "revision": "0359a76851c600ee8e172b514a6ebc8a"
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
