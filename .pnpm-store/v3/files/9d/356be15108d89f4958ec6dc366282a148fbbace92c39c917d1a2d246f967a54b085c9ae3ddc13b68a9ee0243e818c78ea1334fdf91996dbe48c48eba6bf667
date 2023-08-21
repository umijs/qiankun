# 👽 ufo

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]
[![JSDocs][jsdocs-src]][jsdocs-href]

URL utils for humans.

## Install

Install using npm or your favourite package manager:

```bash
npm i ufo
```

Import:

```js
// CommonJS
const { normalizeURL, joinURL } = require('ufo')

// ESM
import { normalizeURL, joinURL } from 'ufo'

// Deno
import { parseURL } from 'https://unpkg.com/ufo/dist/index.mjs'
```

**Notice:** You may need to transpile package and add URL polyfill for legacy environments

## Usage

### `normalizeURL`

- Ensures URL is properly encoded
- Ensures pathname starts with slash
- Preserves protocol/host if provided

```ts
normalizeURL('test?query=123 123#hash, test')
// test?query=123%20123#hash,%20test

normalizeURL('http://localhost:3000')
// http://localhost:3000/
```

### `joinURL`

```ts
joinURL('a', '/b', '/c')
// a/b/c
```

### `resolveURL`

```ts
resolveURL('http://foo.com/foo?test=123#token', 'bar', 'baz')
// http://foo.com/foo/bar/baz?test=123#token
```

### `parseURL`

```ts
parseURL('http://foo.com/foo?test=123#token')
// { protocol: 'http:', auth: '', host: 'foo.com', pathname: '/foo', search: '?test=123', hash: '#token' }

parseURL('foo.com/foo?test=123#token')
// { pathname: 'foo.com/foo', search: '?test=123', hash: '#token' }

parseURL('foo.com/foo?test=123#token', 'https://')
// { protocol: 'https:', auth: '', host: 'foo.com', pathname: '/foo', search: '?test=123', hash: '#token' }
```

### `stringifyParsedURL`

```ts
const obj = parseURL('http://foo.com/foo?test=123#token')
obj.host = 'bar.com'

stringifyParsedURL(obj)
// http://bar.com/foo?test=123#token
```

### `withQuery`

```ts
withQuery('/foo?page=a', { token: 'secret' })
// /foo?page=a&token=secret
```

### `getQuery`

```ts
getQuery('http://foo.com/foo?test=123&unicode=%E5%A5%BD')
// { test: '123', unicode: '好' }
```

### `parseFilename`

```ts
// Result: filename.ext
parseFilename('http://example.com/path/to/filename.ext')

// Result: undefined
parseFilename('/path/to/.hidden-file', { strict: true })
```

### `$URL`

Implementing URL interface with improvements:

- Supporting schemeless and hostless URLs
- Supporting relative URLs
- Preserving trailing-slash status
- Decoded and mutable class properties (`protocol`, `host`, `auth`, `pathname`, `query`, `hash`)
- Consistent URL parser independent of environment
- Consistent encoding independent of environment
- Punycode support for host encoding

```ts
new $URL('http://localhost:3000/hello?world=true')
// { protocol: 'http:', host: 'localhost:3000', auth: '', pathname: '/hello', query: { world: 'true' }, hash: '' }
```

### `withTrailingSlash`

Ensures url ends with a trailing slash.

```ts
withTrailingSlash('/foo')
// /foo/
```

Set the second option to `true` to support query parameters:

```ts
withTrailingSlash('/path?query=true', true)
// /path/?query=true
```

### `withoutTrailingSlash`

Ensures url does not ends with a trailing slash.

```ts
withoutTrailingSlash('/foo/')
// /foo
```

Set the second option to `true` to support query parameters:

```ts
withoutTrailingSlash('/path/?query=true', true)
// /path?query=true
```

### `cleanDoubleSlashes`

Ensures url does not have double slash (except for protocol).

```ts
cleanDoubleSlashes('//foo//bar//')
// /foo/bar/

cleanDoubleSlashes('http://example.com/analyze//http://localhost:3000//')
// http://example.com/analyze/http://localhost:3000/
```

### `isSamePath`

Check two paths are equal or not. Trailing slash and encoding are normalized before comparation.

```ts
isSamePath('/foo', '/foo/')
// true
```

### `isRelative`

Check if a path starts with `./` or `../`.

```ts
isRelative('./foo')
// true
```

### `withHttp`

Ensures url protocol is `http`

```ts
withHttp('https://example.com')
// http://example.com
```

### `withHttps`

Ensures url protocol is `https`

```ts
withHttps('http://example.com')
// https://example.com
```

### `withProtocol`

Changes url protocol passed as second argument

```ts
withProtocol('http://example.com', 'ftp://')
// ftp://example.com
```

### `withoutProtocol`

Removes url protocol

```ts
withoutProtocol('http://example.com')
// example.com
```

### `isEqual`

Compare two URLs regardless of their slash condition or encoding:

```ts
isEqual('/foo', 'foo')
// true
isEqual('foo/', 'foo')
// true
isEqual('/foo bar', '/foo%20bar')
// true

// Strict compare
isEqual('/foo', 'foo', { leadingSlash: true })
// false
isEqual('foo/', 'foo', { trailingSlash: true })
// false
isEqual('/foo bar', '/foo%20bar', { encoding: true })
// false
```

## License

[MIT](./LICENSE)

Special thanks to Eduardo San Martin Morote ([posva](https://github.com/posva)) for [encoding utlities](https://github.com/vuejs/vue-router-next/blob/v4.0.1/src/encoding.ts)

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/ufo?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/ufo
[npm-downloads-src]: https://img.shields.io/npm/dm/ufo?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/ufo
[codecov-src]: https://img.shields.io/codecov/c/gh/unjs/ufo/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/ufo
[bundle-src]: https://img.shields.io/bundlephobia/minzip/ufo?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=ufo
[license-src]: https://img.shields.io/github/license/unjs/ufo.svg?style=flat&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/unjs/ufo/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsDocs.io-reference-18181B?style=flat&colorA=18181B&colorB=F0DB4F
[jsdocs-href]: https://www.jsdocs.io/package/ufo
