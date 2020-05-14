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
    "revision": "c7a8a0f62886f9ab9630157ec908e9ff"
  },
  {
    "url": "api/index.html",
    "revision": "5ee9b8be4603412a9f555b1a5e7ac917"
  },
  {
    "url": "assets/css/0.styles.0a847183.css",
    "revision": "90e16e510f450fe13677996f20bd786d"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.5c817323.js",
    "revision": "4c4254f4cde7031f7f1b78d44a040009"
  },
  {
    "url": "assets/js/11.60862973.js",
    "revision": "d5635c5a74ea23de93125529782f4f9b"
  },
  {
    "url": "assets/js/12.1fb19687.js",
    "revision": "1c5ff06c19c5cf49b9b6046081ca2612"
  },
  {
    "url": "assets/js/13.8eb5e4bc.js",
    "revision": "5cf26365dd70231ed0f923f127c1b5fa"
  },
  {
    "url": "assets/js/14.f95624e9.js",
    "revision": "1002a988c095734e607d8d45c2723a60"
  },
  {
    "url": "assets/js/15.7e8af3ef.js",
    "revision": "5e472575b5fed788c198f15bc38fbc24"
  },
  {
    "url": "assets/js/16.a260174a.js",
    "revision": "775d320c64b58795bc43cf3e1798f085"
  },
  {
    "url": "assets/js/2.fef6aff1.js",
    "revision": "f23fcbd7dd738239d15c187273338b9d"
  },
  {
    "url": "assets/js/3.1f2c246a.js",
    "revision": "4cbcf633d457c7d9c91284ab06c61bb2"
  },
  {
    "url": "assets/js/4.1cacbedd.js",
    "revision": "472e47215a7e505897174f1444002336"
  },
  {
    "url": "assets/js/5.f7dfde68.js",
    "revision": "b2c89f0adfc4b328b70ac8bfcf814420"
  },
  {
    "url": "assets/js/6.0369573f.js",
    "revision": "ef7341845f45459f6d3971da8ef47ede"
  },
  {
    "url": "assets/js/7.cae3ee6a.js",
    "revision": "41818f10375594d3472a1d14da006d1f"
  },
  {
    "url": "assets/js/8.78c1eaf4.js",
    "revision": "27d3c8a21ce8662c00d61193b04d50c1"
  },
  {
    "url": "assets/js/9.8de23b7c.js",
    "revision": "3789f5bbf783f86994350c8ab86f1ff0"
  },
  {
    "url": "assets/js/app.779506be.js",
    "revision": "c1778a758b9ff4e2300bb8ee39e300e9"
  },
  {
    "url": "faq/index.html",
    "revision": "7a25da42a321bea9f960e92647748166"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "a6affdaa908e5a93cf90161866331c2f"
  },
  {
    "url": "guide/index.html",
    "revision": "474f4a048611f4bf3a72ee77192bcc8c"
  },
  {
    "url": "index.html",
    "revision": "25d67d4071fd86ca188f4f188c20b43c"
  },
  {
    "url": "zh/api/index.html",
    "revision": "852e0d09d62fa23044f3a7b48cada4c1"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "4d1087b871570e84b00b12aa792278e6"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "eaa7ae84bd93aed4ac05acc0651a71cf"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "fb2e94ba736029bdf83c3e4565fb8d77"
  },
  {
    "url": "zh/index.html",
    "revision": "6a729fa96c58d5da631e0acd2394804c"
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
