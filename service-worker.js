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
    "revision": "f7c9457a4cf057c00a927356de9cf09f"
  },
  {
    "url": "api/index.html",
    "revision": "6e831b139391f8a56c8efbb512645c68"
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
    "url": "assets/js/12.d084ec2c.js",
    "revision": "6b044d03f6a8f2bb231b447b61dc33a0"
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
    "url": "assets/js/6.4e76b181.js",
    "revision": "249a6eaf5ae059b4349ec6d4012c4105"
  },
  {
    "url": "assets/js/7.63346b1e.js",
    "revision": "ee08eeea411bc29953d7f57a42c4aa62"
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
    "url": "assets/js/app.27a3b4f3.js",
    "revision": "ef58b2e2e5866a7c1be28ed5ed9b26b6"
  },
  {
    "url": "faq/index.html",
    "revision": "e44ef73388e4b6a3ec40ad4e99443a9a"
  },
  {
    "url": "guide/getting-started.html",
    "revision": "b8b91cb174fcece95c943eb3978bed04"
  },
  {
    "url": "guide/index.html",
    "revision": "db1484fa03fe5af54d0f1e55210b369a"
  },
  {
    "url": "index.html",
    "revision": "5c6b8e46fe95e7068556db36dbdec432"
  },
  {
    "url": "zh/api/index.html",
    "revision": "ab31deefbacd7a928fd90e981c95bc38"
  },
  {
    "url": "zh/faq/index.html",
    "revision": "9db5a2e6b51c107182abf52fd56d8af4"
  },
  {
    "url": "zh/guide/getting-started.html",
    "revision": "a6f6cf08539a7e4edb9cb8a3aae83b94"
  },
  {
    "url": "zh/guide/index.html",
    "revision": "8c67472bf9a1e42c5d110c0856b7676c"
  },
  {
    "url": "zh/index.html",
    "revision": "59c934ef94e6a652ce1bc53162c69198"
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
