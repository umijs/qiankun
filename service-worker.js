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
    "revision": "ef73907293eaff73e5bab0d44e989355"
  },
  {
    "url": "api/index.html",
    "revision": "effd3cae2d4c6a7ff60c2b1289e4a31b"
  },
  {
    "url": "assets/css/0.styles.81e21519.css",
    "revision": "774ec53984823549f7bb60998f64da08"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.79c29aaf.js",
    "revision": "bf14ee185354971acf9c3a1f8309e642"
  },
  {
    "url": "assets/js/11.104a2340.js",
    "revision": "f35717c93452ce3db90324fcb6da9cce"
  },
  {
    "url": "assets/js/12.16dd3850.js",
    "revision": "d58ae2d53e5d2e7a0ae2ccebf96c64b9"
  },
  {
    "url": "assets/js/13.a2f4ba04.js",
    "revision": "9489e55a37e823c9288feb64782c70b3"
  },
  {
    "url": "assets/js/14.4b2c6b95.js",
    "revision": "21ceeafc8c2c71f9061ad06ad200d58a"
  },
  {
    "url": "assets/js/15.b0eb891d.js",
    "revision": "5c5e19ec8da3dd3ac0be9f278004fdb1"
  },
  {
    "url": "assets/js/16.1afaef4e.js",
    "revision": "1d72a5fce881751fafe8dc97af6e290d"
  },
  {
    "url": "assets/js/2.abcc74d5.js",
    "revision": "ac904d02d52a433413af01b5af6419dc"
  },
  {
    "url": "assets/js/3.d7a04239.js",
    "revision": "156eeffaf26fae27f10aac3538e66496"
  },
  {
    "url": "assets/js/4.0983d0e4.js",
    "revision": "b54a8cea9354480f83dcd7c756f5c490"
  },
  {
    "url": "assets/js/5.32e15704.js",
    "revision": "74d72d20b78c877ce724c7df884be7cf"
  },
  {
    "url": "assets/js/6.51647356.js",
    "revision": "650e505c6a2cc76b1f1bed6db707c0fb"
  },
  {
    "url": "assets/js/7.178bb0a7.js",
    "revision": "3dc1b6193fa2e1230dabb31b1b72394e"
  },
  {
    "url": "assets/js/8.169bc70e.js",
    "revision": "990545215eed94c00c6be07c108f0449"
  },
  {
    "url": "assets/js/9.f4fe7193.js",
    "revision": "27d455a8718052f2d7262dd10f5fcf53"
  },
  {
    "url": "assets/js/app.711be280.js",
    "revision": "b055e3b85d3c4d40c12fe88ffcbd8ddb"
  },
  {
    "url": "faq/index.html",
    "revision": "53fe537aedb110cd0a490a41d6463156"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "9937e369b66bf0cd8aba434cc757035a"
  },
  {
    "url": "guide/index.html",
    "revision": "1cef0bf0510ed8997f3a768dfb953501"
  },
  {
    "url": "index.html",
    "revision": "efc9b8a08fe5a0389ec7ce77acdcdc45"
  },
  {
    "url": "zh/api/index.html",
    "revision": "5fe4ead529f179c6b0ebbdcbd283b440"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "37b1058e64be4e4477589f09e5e2f61b"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "af4881a7804a2511e9ad149bda5f04aa"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "9416ffc3aa61a8e4aaedf5bea93c54fb"
  },
  {
    "url": "zh/index.html",
    "revision": "85248ea3cbadc5c64b6c5aebc7c5a0b8"
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
