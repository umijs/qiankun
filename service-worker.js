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
    "revision": "b6398880c944af79fce739a6944a6844"
  },
  {
    "url": "api/index.html",
    "revision": "7d9a5e7a30c0d0d26e9263fd2f5332ab"
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
    "url": "assets/js/10.35260cc8.js",
    "revision": "c5402d48d37c3acf681982d26096f2cd"
  },
  {
    "url": "assets/js/11.c4ae871d.js",
    "revision": "57e21216917f6759cbcfbd57ab6609f3"
  },
  {
    "url": "assets/js/12.984303ce.js",
    "revision": "649df570b64f294f5330de7490ae881d"
  },
  {
    "url": "assets/js/13.7b31d599.js",
    "revision": "3689f7faa5a67f05a706be2427500538"
  },
  {
    "url": "assets/js/14.c6be3c4e.js",
    "revision": "d3f24384b34066950e6e737c8e9d3e84"
  },
  {
    "url": "assets/js/15.d46b7b2f.js",
    "revision": "0be66769c3c772ad3fa8e49f03a848d4"
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
    "url": "assets/js/6.df555c53.js",
    "revision": "adf1f74cf9a16255adbbf985858845cc"
  },
  {
    "url": "assets/js/7.ad5ea9f8.js",
    "revision": "1c9086f39eeca8590f3a5a6b3aa69fb1"
  },
  {
    "url": "assets/js/8.fc5f63b2.js",
    "revision": "9e4b16f5267175fdb45510932739dcf5"
  },
  {
    "url": "assets/js/9.20370be3.js",
    "revision": "a4125b667fdb0f1b95dd2c0eafae9fe5"
  },
  {
    "url": "assets/js/app.97d584c6.js",
    "revision": "87da20b5fc33f9ea2da488b414f4eaba"
  },
  {
    "url": "faq/index.html",
    "revision": "934d7e34facfa06f50c77b8a4550c3e7"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "d8cbc3f547da859111828e13d52bda52"
  },
  {
    "url": "guide/index.html",
    "revision": "55043e3150204ed9f0c3606a4eff5baf"
  },
  {
    "url": "index.html",
    "revision": "7a6ef72f27908f1eca24c7411a3c0b52"
  },
  {
    "url": "zh/api/index.html",
    "revision": "1ff1b192a5854f7e0d82b9a7a441a67d"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "8ee7ceb4f20093c66f7960cc6d9fef5e"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "14847b865e87461cb7643afb3706f280"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "c976f2b6674b3fca0a69812cc3006799"
  },
  {
    "url": "zh/index.html",
    "revision": "41d05dfffa0ecdac88d6dcc9e90b17b3"
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
