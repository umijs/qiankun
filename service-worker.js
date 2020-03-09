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
    "revision": "1486ee8b68d3ce9ed456973ba5a42ab6"
  },
  {
    "url": "api/index.html",
    "revision": "66e52a2f728bb30740c8fcf6be4723d3"
  },
  {
    "url": "assets/css/0.styles.bedefebe.css",
    "revision": "774ec53984823549f7bb60998f64da08"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.96c35cfd.js",
    "revision": "b38801de6c958376fe21b141b0433c9f"
  },
  {
    "url": "assets/js/11.730dcf81.js",
    "revision": "b3b0ef4582ad5c15185e064f38930cd3"
  },
  {
    "url": "assets/js/12.46aca462.js",
    "revision": "122a0f93050eb8d5bd3930cfbe20d468"
  },
  {
    "url": "assets/js/13.10c59cb3.js",
    "revision": "9489e55a37e823c9288feb64782c70b3"
  },
  {
    "url": "assets/js/14.4d4a96d6.js",
    "revision": "21ceeafc8c2c71f9061ad06ad200d58a"
  },
  {
    "url": "assets/js/15.73186262.js",
    "revision": "5c5e19ec8da3dd3ac0be9f278004fdb1"
  },
  {
    "url": "assets/js/16.d5f63d6d.js",
    "revision": "1d72a5fce881751fafe8dc97af6e290d"
  },
  {
    "url": "assets/js/2.4468c180.js",
    "revision": "ac904d02d52a433413af01b5af6419dc"
  },
  {
    "url": "assets/js/3.0c9fca0f.js",
    "revision": "156eeffaf26fae27f10aac3538e66496"
  },
  {
    "url": "assets/js/4.9cca4757.js",
    "revision": "b54a8cea9354480f83dcd7c756f5c490"
  },
  {
    "url": "assets/js/5.aeff9b16.js",
    "revision": "74d72d20b78c877ce724c7df884be7cf"
  },
  {
    "url": "assets/js/6.808fb3a1.js",
    "revision": "b971bd59083b9e5a8e42b08a486a9b3d"
  },
  {
    "url": "assets/js/7.59cf059c.js",
    "revision": "234a92fbd0340c696d579b29e46c3562"
  },
  {
    "url": "assets/js/8.9dc81c90.js",
    "revision": "ca020cba390f0a2d06fb0cf7672356af"
  },
  {
    "url": "assets/js/9.743b1b87.js",
    "revision": "86120362b12b65da4764db95006e7711"
  },
  {
    "url": "assets/js/app.864f6ebc.js",
    "revision": "047a98b4f8dc6ce4c1137869fb753b9a"
  },
  {
    "url": "faq/index.html",
    "revision": "2bbc9bdf8248121f773e3a7d86b1e529"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "01b3a84586a23bd0c379ec10fb3c97d8"
  },
  {
    "url": "guide/index.html",
    "revision": "5d58fc57d6a2937a2dc4184f98f0359f"
  },
  {
    "url": "index.html",
    "revision": "de46627bc6b87ce6b340b9a0c36fb7f1"
  },
  {
    "url": "zh/api/index.html",
    "revision": "a005084f96e56d2860438ec9137ef16b"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "f125b483781c01a476e5a922f99756ca"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "2ffffd062038b2f83c341daacf53cae9"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "0513efe5380d78ce14271f88b0462586"
  },
  {
    "url": "zh/index.html",
    "revision": "3a2c9ee30fe3f76f3e17eab5e0e807a7"
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
