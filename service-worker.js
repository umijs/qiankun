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
    "revision": "7656f9465ac74a0d04c0a7dfabc08b55"
  },
  {
    "url": "api/index.html",
    "revision": "23ed8ca20cc34e69b21f5b7e8febaf00"
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
    "url": "assets/js/app.f7401607.js",
    "revision": "ebdff2bfc266fe3de424de2b915cef7e"
  },
  {
    "url": "faq/index.html",
    "revision": "31ed67ae3a54749b30647263c13211ed"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "fb257aa1aafa45bba5ff7bcfbdecd91b"
  },
  {
    "url": "guide/index.html",
    "revision": "7e26b6925a48fb050dc61d6cb782e1aa"
  },
  {
    "url": "index.html",
    "revision": "7df0eaa3f30c54ac1384870402cf7b5f"
  },
  {
    "url": "zh/api/index.html",
    "revision": "6374bc4d1ed5302fa351e1ff4de7c225"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "d1d15b673ec9f4eeddc1d3284832e905"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "5771d176a811865b353f1f547ac5dc4a"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "52e717e2377891395675fad230d65063"
  },
  {
    "url": "zh/index.html",
    "revision": "5fea82786ad6b0eb9c38b412c7901fb1"
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
