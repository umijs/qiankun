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
    "revision": "e50941a2852af811400b2129d9a49516"
  },
  {
    "url": "api/index.html",
    "revision": "0bbac1f1904814d2d0fc12173f10cd42"
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
    "url": "assets/js/app.cd0f7a7c.js",
    "revision": "ad6538573aa2fc62dc7a598dfbd63830"
  },
  {
    "url": "faq/index.html",
    "revision": "3fe51c19459eca96206c01390d3b6032"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "aa66d3afa12c2d336e3ccbea46d6270d"
  },
  {
    "url": "guide/index.html",
    "revision": "6efc7f65f58412035690f168f0ca073b"
  },
  {
    "url": "index.html",
    "revision": "9e2a06066f1433cd6ecf1d61745ede53"
  },
  {
    "url": "zh/api/index.html",
    "revision": "03695c6cdf9650b4db147e490a4f8d51"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "eb5f124c8553e8ce8806da0b4aa8982e"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "034c7048bae045f1f1dd7a57febad872"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "6995cf6960c06af8001059ff7433e564"
  },
  {
    "url": "zh/index.html",
    "revision": "20641cf416dd14d72ec32cf5dfaee94b"
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
