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
    "revision": "7b19f955d2e7755dd5d391ef6ace09ff"
  },
  {
    "url": "api/index.html",
    "revision": "3fa93aab54f05709766617e467723944"
  },
  {
    "url": "assets/css/0.styles.37ef24a0.css",
    "revision": "90e16e510f450fe13677996f20bd786d"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.2d4ae32b.js",
    "revision": "4c4254f4cde7031f7f1b78d44a040009"
  },
  {
    "url": "assets/js/11.e393a5fd.js",
    "revision": "d5635c5a74ea23de93125529782f4f9b"
  },
  {
    "url": "assets/js/12.ce20c3cf.js",
    "revision": "1c5ff06c19c5cf49b9b6046081ca2612"
  },
  {
    "url": "assets/js/13.0d22ef70.js",
    "revision": "5cf26365dd70231ed0f923f127c1b5fa"
  },
  {
    "url": "assets/js/14.92bf87d3.js",
    "revision": "1002a988c095734e607d8d45c2723a60"
  },
  {
    "url": "assets/js/15.cf82ae6d.js",
    "revision": "5e472575b5fed788c198f15bc38fbc24"
  },
  {
    "url": "assets/js/16.9d2c465d.js",
    "revision": "775d320c64b58795bc43cf3e1798f085"
  },
  {
    "url": "assets/js/2.029282a7.js",
    "revision": "f23fcbd7dd738239d15c187273338b9d"
  },
  {
    "url": "assets/js/3.6df00e53.js",
    "revision": "4cbcf633d457c7d9c91284ab06c61bb2"
  },
  {
    "url": "assets/js/4.b25954ac.js",
    "revision": "472e47215a7e505897174f1444002336"
  },
  {
    "url": "assets/js/5.bf76368f.js",
    "revision": "b2c89f0adfc4b328b70ac8bfcf814420"
  },
  {
    "url": "assets/js/6.4b4c179d.js",
    "revision": "ef7341845f45459f6d3971da8ef47ede"
  },
  {
    "url": "assets/js/7.357c6b4c.js",
    "revision": "41818f10375594d3472a1d14da006d1f"
  },
  {
    "url": "assets/js/8.943fd4b5.js",
    "revision": "27d3c8a21ce8662c00d61193b04d50c1"
  },
  {
    "url": "assets/js/9.7108bf59.js",
    "revision": "3789f5bbf783f86994350c8ab86f1ff0"
  },
  {
    "url": "assets/js/app.2de27aca.js",
    "revision": "1eb07520f5068239edef57c455a7a5be"
  },
  {
    "url": "faq/index.html",
    "revision": "41f0a72a6d2352566fe0bdf3f2a6dab2"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "222477f9d1489c43af69086da5dc7ef1"
  },
  {
    "url": "guide/index.html",
    "revision": "8ec9bce2bb5bbc08742412cbeceab70a"
  },
  {
    "url": "index.html",
    "revision": "5ffa1de8fdcb1eb5ab41eddab5e820ce"
  },
  {
    "url": "zh/api/index.html",
    "revision": "974e46d23d977a9a98a9cfb8990c70d7"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "2d5fe33c9d2aa4507b5b6381c9763538"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "086f5314755c7e056199d31ff0309353"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "fd782ef259603e5db87cf1b29dffd53d"
  },
  {
    "url": "zh/index.html",
    "revision": "fb5cd6fdafcfc143b6aa31bb17e270e5"
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
