# co-body

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![David deps][david-image]][david-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/co-body.svg?style=flat-square
[npm-url]: https://npmjs.org/package/co-body
[travis-image]: https://img.shields.io/travis/cojs/co-body.svg?style=flat-square
[travis-url]: https://travis-ci.org/cojs/co-body
[coveralls-image]: https://img.shields.io/coveralls/cojs/co-body.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/cojs/co-body?branch=master
[david-image]: https://img.shields.io/david/cojs/co-body.svg?style=flat-square
[david-url]: https://david-dm.org/cojs/co-body
[download-image]: https://img.shields.io/npm/dm/co-body.svg?style=flat-square
[download-url]: https://npmjs.org/package/co-body

  Parse request bodies with generators inspired by [Raynos/body](https://github.com/Raynos/body).

## Installation

```bash
$ npm install co-body
```

## Options

  - `limit` number or string representing the request size limit (1mb for json and 56kb for form-urlencoded)
  - `strict` when set to `true`, JSON parser will only accept arrays and objects; when `false` will accept anything `JSON.parse` accepts. Defaults to `true`. (also `strict` mode will always return object).
  - `queryString` an object of options when parsing query strings and form data. See [qs](https://github.com/hapijs/qs) for more information.
  - `returnRawBody` when set to `true`, the return value of `co-body` will be an object with two properties: `{ parsed: /* parsed value */, raw: /* raw body */}`.
  - `jsonTypes` is used to determine what media type **co-body** will parse as **json**, this option is passed directly to the [type-is](https://github.com/jshttp/type-is) library.
  - `formTypes` is used to determine what media type **co-body** will parse as **form**, this option is passed directly to the [type-is](https://github.com/jshttp/type-is) library.
  - `textTypes` is used to determine what media type **co-body** will parse as **text**, this option is passed directly to the [type-is](https://github.com/jshttp/type-is) library.

more options available via [raw-body](https://github.com/stream-utils/raw-body#getrawbodystream-options-callback):

## Example

```js
// application/json
var body = await parse.json(req);

// explicit limit
var body = await parse.json(req, { limit: '10kb' });

// application/x-www-form-urlencoded
var body = await parse.form(req);

// text/plain
var body = await parse.text(req);

// either
var body = await parse(req);

// custom type
var body = await parse(req, { textTypes: ['text', 'html'] });
```

## Koa

  This lib also supports `ctx.req` in Koa (or other libraries),
  so that you may simply use `this` instead of `this.req`.

```js
// application/json
var body = await parse.json(this);

// application/x-www-form-urlencoded
var body = await parse.form(this);

// text/plain
var body = await parse.text(this);

// either
var body = await parse(this);
```

# License

  MIT
