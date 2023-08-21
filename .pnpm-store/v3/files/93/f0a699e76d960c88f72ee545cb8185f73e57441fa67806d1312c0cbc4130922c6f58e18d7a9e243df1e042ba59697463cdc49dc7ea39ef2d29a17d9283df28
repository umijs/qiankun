# utf8-byte-length [![build status](https://secure.travis-ci.org/parshap/utf8-byte-length.svg?branch=master)](http://travis-ci.org/parshap/utf8-byte-length)

Get the utf8 byte length of a string, taking into account multi-byte
characters and surrogate pairs.

By default, this module defers to `Buffer.byteLength`. A browser
implementation is also provided that doesn't use `Buffer.byteLength`
minimize build size.

## Example

```js
var getLength = require("utf8-byte-length")
console.log(truncate("a☃", 2)) // a = 1 byte, ☃ = 3 bytes
// -> 4
```

## API

### `var getLength = require("utf8-byte-length")`

*When using browserify or webpack*, this automatically resolves to an
implementation that does not use `Buffer.byteLength`.

### `getLength(string)`

Returns the byte length of `string`. Throws an error if `string` is not
a string.
