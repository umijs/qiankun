# sanitize-filename [![build status](https://secure.travis-ci.org/parshap/node-sanitize-filename.svg?branch=master)](http://travis-ci.org/parshap/node-sanitize-filename)

Sanitize a string to be safe for use as a filename by removing directory
paths and invalid characters.

## Install

[npm: *sanitize-filename*](https://www.npmjs.com/package/sanitize-filename)

```
npm install sanitize-filename
```

## Example

```js
var sanitize = require("sanitize-filename");

// Some string that may be unsafe or invalid as a filename
var UNSAFE_USER_INPUT = "~/.\u0000ssh/authorized_keys";

// Sanitize the string to be safe for use as a filename.
var filename = sanitize(UNSAFE_USER_INPUT);
// -> "~.sshauthorized_keys"
```

## Details

*sanitize-filename* removes the following:

 * [Control characters][] (`0x00`–`0x1f` and `0x80`–`0x9f`)
 * [Reserved characters][] (`/`, `?`, `<`, `>`, `\`, `:`, `*`, `|`, and
   `"`)
 * Unix reserved filenames (`.` and `..`)
 * Trailing periods and spaces ([for Windows][windows trailing])
 * Windows reserved filenames (`CON`, `PRN`, `AUX`, `NUL`, `COM1`,
   `COM2`, `COM3`, `COM4`, `COM5`, `COM6`, `COM7`, `COM8`, `COM9`,
   `LPT1`, `LPT2`, `LPT3`, `LPT4`, `LPT5`, `LPT6`, `LPT7`, `LPT8`, and
   `LPT9`)

[control characters]: https://en.wikipedia.org/wiki/C0_and_C1_control_codes
[reserved characters]: https://kb.acronis.com/content/39790
[windows trailing]: https://msdn.microsoft.com/en-us/library/aa365247(v=vs.85).aspx#Naming_Conventions

The resulting string is truncated to [255 bytes in length][255]. The
string will not contain any directory paths and will be safe to use as a
filename.

[255]: http://unix.stackexchange.com/questions/32795/what-is-the-maximum-allowed-filename-and-folder-size-with-ecryptfs

### Empty String `""` Result

An empty string `""` can be returned. For example:

```js
var sanitize = require("sanitize-filename");
sanitize("..")
// -> ""

```

### Non-unique Filenames

Two different inputs can return the same value. For example:

```js
var sanitize = require("sanitize-filename");
sanitize("file?")
// -> "file"
sanitize ("*file*")
// -> "file"
```

### File Systems

Sanitized filenames will be safe for use on modern Windows, OS X, and
Unix file systems (`NTFS`, `ext`, etc.).

[`FAT` 8.3 filenames][8.3] are not supported.

[8.3]: https://en.wikipedia.org/wiki/8.3_filename

#### Test Your File System

The test program will use various strings (including the [Big List of
Naughty Strings][blns]) to create files in the working directory. Run
`npm test` to run tests against your file system.

[blns]: https://github.com/minimaxir/big-list-of-naughty-strings

## API

### `sanitize(inputString, [options])`

Sanitize `inputString` by removing or replacing invalid characters.

Options:

 * `options.replacement`: *optional, string/function, default: `""`*. If passed
 as a string, it's used as the replacement for invalid characters. If passed as
 a function, the function will be called with the invalid characters and it's
 return value will be used as the replacement. See [`String.prototype.replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
 for more info.
