# truncate-utf8-bytes [![build status](https://secure.travis-ci.org/parshap/truncate-utf8-bytes.svg?branch=master)](http://travis-ci.org/parshap/truncate-utf8-bytes)

Truncate a string to the given length in bytes. Correctly handles
multi-byte characters and surrogate pairs.

A browser implementation that doesn't use `Buffer.byteLength` is
provided to minimize build size.

## Example

```js
var truncate = require("truncate-utf8-bytes")
var str = "a☃" // a = 1 byte, ☃ = 3 bytes
console.log(truncate(str, 2))
// -> "a"
```

## API

### `var truncate = require("truncate-utf8-bytes")`

*When using browserify or webpack*, this automatically resolves to an
implementation that does not use `Buffer.byteLength`.

### `truncate(string, length)`

Returns `string` truncated to at most `length` bytes in length.
