Mimer [![Build Status](https://secure.travis-ci.org/data-uri/mimer.png?branch=master)](http://travis-ci.org/data-uri/mimer) [![NPM version](https://badge.fury.io/js/mimer.png)](http://badge.fury.io/js/mimer)
=========

A simple [MIME][mime] type getter built on top of [Node.js][nodejs].

MODULE
---------

**Browser version:**: [Minified][browserminified] (amd and CommonJS ready) [Source][browsersource]

**Node.js version:** `npm install mimer` into your project


### Getting started
```js
// node and browserify
const Mimer = require('mimer');

// amd (Require.js and etc)
require('path/to/mimer', function (Mimer) {});

// browser (through script tag)
window.Mimer
```

#### Get a MIME type
```js
Mimer('file.css'); // => "text/css"

// or
var mime = new Mimer();
mime.get('file.css');  // => "text/css"
```

#### Set a MIME type
```js
var mime = new Mimer();

mime.set('.monster', 'movie/thriller')
	.get('zombie.monster');
	// => "movie/thriller"

mime.set(['.rctycoon','.simcity'], 'cms/game');
mime.get('/land/park.rctycoon'); // => "cms/game"
mime.get('maps/city.simcity'); // => "cms/game"
```

CLIENT
---------

`npm install -g mimer` (it may require Root privileges)

### pritting a mime type
```CLI
$ mimer brand.png
```

DEVELOPING
----------

```CLI
$ make install
$ make test
```

Build web version with:

```CLI
$ make build
```

If you'd like to test the full process including npm installer, just run:

```CLI
$ make fulltest
```

## Release notes

See more in [Releases section](https://github.com/data-uri/mimer/releases).

## License

MIT License
(c) [Helder Santana](http://heldr.com)

[nodejs]: http://nodejs.org/download
[bower]: http://bower.io
[mime]: http://en.wikipedia.org/wiki/MIME
[browserminified]: https://raw.github.com/heldr/mimer/master/dist/mimer.min.js
[browsersource]: https://raw.github.com/heldr/mimer/master/dist/mimer.js