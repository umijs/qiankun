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
    "revision": "d8a54998e2376ba49b4aa8b5b072de67"
  },
  {
    "url": "api/index.html",
    "revision": "68ef93b16caf206a28cc12fe1e97c009"
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
    "url": "assets/js/12.de88d92e.js",
    "revision": "604702d8d627647de57512d203204e5c"
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
    "url": "assets/js/7.00fef25e.js",
    "revision": "05ee24df4b7c0dde0de5b2aff5b182a5"
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
    "url": "assets/js/app.f9498ca9.js",
    "revision": "53611ee7f3a3a202a1c4c932a1e15cc0"
  },
  {
    "url": "faq/index.html",
    "revision": "1db314e016557ef3b3d1ea1001ea618c"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "c8bf7e83fbddf5b1ebb53fcc74565917"
  },
  {
    "url": "guide/index.html",
    "revision": "eb8d8450f91a056028963c794092a6d0"
  },
  {
    "url": "index.html",
    "revision": "60ecc2927dd79c236f3aaa5f0155bc2c"
  },
  {
    "url": "zh/api/index.html",
    "revision": "ccc035c18ecd64073779696818e58c67"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "6d24355ae341e66eb9a697b9d76f49e4"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "1f12b3c1e835a65cc90f44939c83e81c"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "cd62ea8d5c728b1c1e5d147b7cbcd3a4"
  },
  {
    "url": "zh/index.html",
    "revision": "e734c7e5268de7e8dfc67c887242bb54"
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
