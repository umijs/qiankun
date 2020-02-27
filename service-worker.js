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
    "revision": "3047b174092fcf18b47591b9399ffd6b"
  },
  {
    "url": "api/index.html",
    "revision": "25f334cfbc51d728e361f61d3cb8ad1d"
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
    "url": "assets/js/10.2bb96794.js",
    "revision": "627c6d4a2f4feaf3608033c57b95381d"
  },
  {
    "url": "assets/js/11.2fb31e34.js",
    "revision": "b3b0ef4582ad5c15185e064f38930cd3"
  },
  {
    "url": "assets/js/12.a92af4f6.js",
    "revision": "fd78f663cf69f2ffdda848882ee6f33e"
  },
  {
    "url": "assets/js/13.ac4a0660.js",
    "revision": "fd9484df6cc53b897b470769a83f8171"
  },
  {
    "url": "assets/js/14.4b2c6b95.js",
    "revision": "21ceeafc8c2c71f9061ad06ad200d58a"
  },
  {
    "url": "assets/js/15.4ac399b1.js",
    "revision": "395cec1501ba824a0c99245570b05b2a"
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
    "url": "assets/js/7.b3057745.js",
    "revision": "dcd27320677c1946d88b98bb80378263"
  },
  {
    "url": "assets/js/8.1a271acf.js",
    "revision": "9c56ee5d407e6bfdb464ce911c438d96"
  },
  {
    "url": "assets/js/9.3c9ed831.js",
    "revision": "005d2c3f25f5c8f0da228768a2fe172b"
  },
  {
    "url": "assets/js/app.349fbfb7.js",
    "revision": "5569867b8270721e0d1375fe4c3db25b"
  },
  {
    "url": "faq/index.html",
    "revision": "1919340c9f00d408ca5b21b694c18eb0"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "00180d56441c1872e097925cbab4e591"
  },
  {
    "url": "guide/index.html",
    "revision": "47e9b3b2da8d2ad0e07eb188e4aa13d2"
  },
  {
    "url": "index.html",
    "revision": "cc093edbdf00bddc6e22ebe3bb64b465"
  },
  {
    "url": "zh/api/index.html",
    "revision": "86de459e0367ab860ca71eae9a7fb1ad"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "c41b1658892825d2aa71c182b3b40f46"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "95f87fab3b972e16899259efeb214889"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "99c5a589dae4c47bbd49ccb778b31610"
  },
  {
    "url": "zh/index.html",
    "revision": "ed3db32dd3f4687c7055df2b4d871aa7"
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
