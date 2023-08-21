# inflation

[![NPM version](https://badge.fury.io/js/inflation.svg)](http://badge.fury.io/js/inflation)
[![Build Status](https://travis-ci.org/stream-utils/inflation.svg?branch=master)](https://travis-ci.org/stream-utils/inflation)
[![Coverage Status](https://img.shields.io/coveralls/stream-utils/inflation.svg?branch=master)](https://coveralls.io/r/stream-utils/inflation)

Automatically unzip an HTTP stream.

## API

```js
var inflate = require('inflation')
```

### inflate(stream, options)

Returns a stream that emits inflated data from the given stream.

Options:

- `encoding` - The encoding of the stream (`gzip` or `deflate`).
  If not given, will look in `stream.headers['content-encoding']`.

## Example

```js
var inflate = require('inflation')
var raw     = require('raw-body')

http.createServer(function (req, res) {
  raw(inflate(req), 'utf-8', function (err, string) {
    console.dir(string)
  })
})
```
