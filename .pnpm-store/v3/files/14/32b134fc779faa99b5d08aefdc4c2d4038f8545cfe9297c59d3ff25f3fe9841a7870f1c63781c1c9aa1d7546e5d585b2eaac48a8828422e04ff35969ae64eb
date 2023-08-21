# [**koa-bodyparser**](https://github.com/koajs/bodyparser)


[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Coveralls][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![node version][node-image]][node-url]

[npm-image]: https://img.shields.io/npm/v/koa-bodyparser.svg?style=flat-square
[npm-url]: https://npmjs.com/package/koa-bodyparser
[travis-image]: https://img.shields.io/travis/koajs/bodyparser.svg?style=flat-square
[travis-url]: https://travis-ci.org/koajs/bodyparser
[coveralls-image]: https://img.shields.io/coveralls/koajs/bodyparser.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/koajs/bodyparser?branch=master
[david-image]: https://img.shields.io/david/koajs/bodyparser.svg?style=flat-square
[david-url]: https://david-dm.org/koajs/bodyparser
[node-image]: https://img.shields.io/badge/node.js-%3E=_8-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/

A body parser for koa, based on [co-body](https://github.com/tj/co-body). support `json`, `form` and `text` type body.

> Notice: this module doesn't support parsing multipart format data, please use [`@koa/multer`](https://github.com/koajs/multer) to parse multipart format data.

## Install

[![NPM](https://nodei.co/npm/koa-bodyparser.png?downloads=true)](https://nodei.co/npm/koa-bodyparser/)

## Usage

```js
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
app.use(bodyParser());

app.use(async ctx => {
  // the parsed body will store in ctx.request.body
  // if nothing was parsed, body will be an empty object {}
  ctx.body = ctx.request.body;
});
```

## Options

* **enableTypes**: parser will only parse when request type hits enableTypes, support `json/form/text/xml`, default is `['json', 'form']`.
* **encoding**: requested encoding. Default is `utf-8` by `co-body`.
* **formLimit**: limit of the `urlencoded` body. If the body ends up being larger than this limit, a 413 error code is returned. Default is `56kb`.
* **jsonLimit**: limit of the `json` body. Default is `1mb`.
* **textLimit**: limit of the `text` body. Default is `1mb`.
* **xmlLimit**: limit of the `xml` body. Default is `1mb`.
* **strict**: when set to true, JSON parser will only accept arrays and objects. Default is `true`. See [strict mode](https://github.com/cojs/co-body#options) in `co-body`. In strict mode, `ctx.request.body` will always be an object(or array), this avoid lots of type judging. But text body will always return string type.
* **detectJSON**: custom json request detect function. Default is `null`.

  ```js
  app.use(bodyParser({
    detectJSON: function (ctx) {
      return /\.json$/i.test(ctx.path);
    }
  }));
  ```

* **extendTypes**: support extend types:

  ```js
  app.use(bodyParser({
    extendTypes: {
      json: ['application/x-javascript'] // will parse application/x-javascript type body as a JSON string
    }
  }));
  ```

* **onerror**: support custom error handle, if `koa-bodyparser` throw an error, you can customize the response like:

  ```js
  app.use(bodyParser({
    onerror: function (err, ctx) {
      ctx.throw(422, 'body parse error');
    }
  }));
  ```

* **disableBodyParser**: you can dynamic disable body parser by set `ctx.disableBodyParser = true`.

  ```js
  app.use(async (ctx, next) => {
    if (ctx.path === '/disable') ctx.disableBodyParser = true;
    await next();
  });
  app.use(bodyParser());
  ```

## Raw Body

You can access raw request body by `ctx.request.rawBody` after `koa-bodyparser` when:

1. `koa-bodyparser` parsed the request body.
2. `ctx.request.rawBody` is not present before `koa-bodyparser`.

## Koa 1 Support

To use `koa-bodyparser` with koa@1, please use [bodyparser 2.x](https://github.com/koajs/bodyparser/tree/2.x).

```bash
npm install koa-bodyparser@2 --save
```

#### Licences
---
[MIT](LICENSE)
