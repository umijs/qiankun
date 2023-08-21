<h1 align="center">
  <br>
  <img width="365" src="https://cdn.rawgit.com/data-uri/datauri/master/media/datauri.svg" alt="datauri">
  <br>
  <br>
  <br>
</h1>

Node.js [Module](#module) and [CLI](http://npm.im/datauri-cli) to generate [Data URI scheme](http://en.wikipedia.org/wiki/Data_URI_scheme).

>  The data URI scheme is a uniform resource identifier (URI) scheme that provides a way to include data in-line in web pages as if they were external resources.

from: [Wikipedia](http://en.wikipedia.org/wiki/Data_URI_scheme)

MODULE [![Build Status](https://travis-ci.org/data-uri/datauri.svg?branch=master)](http://travis-ci.org/data-uri/datauri)
-------
For Node 8+ compatibility:

`npm install --save datauri`

### Getting started
By default, datauri module returns a promise, which is resolved with `data:uri` string or rejected with file read error:

```js
const datauri = require('datauri');

const content = await datauri('test/myfile.png');

console.log(content)
//=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
```

### Callback style and meta data
```js
const datauri = require('datauri');

datauri('test/myfile.png', (err, content, meta) => {
  if (err) {
      throw err;
  }

  console.log(content); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."

  console.log(meta.mimetype); //=> "image/png"
  console.log(meta.base64); //=> "iVBORw0KGgoAAAANSUhEUgAA..."
  console.log(meta.getCSS()); //=> "\n.case {\n    background-image: url('data:image/png;base64,iVBORw..."
  console.log(meta.getCSS({
    class: "myClass",
    width: true,
    height: true
  })); //=> adds image width and height and custom class name
});
```

### Synchronous calls

```js
const Datauri = require('datauri/sync');
const meta = Datauri('test/myfile.png');

console.log(meta.content); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
console.log(meta.mimetype); //=> "image/png"
console.log(meta.base64); //=> "iVBORw0KGgoAAAANSUhEUgAA..."
console.log(meta.getCSS()); //=> "\n.case {\n    background-image: url('data:image/png;base64,iVBORw..."
console.log(meta.getCSS("myClass")); //=> "\n.myClass {\n    background-image: url('data:image/png;base64,iVBORw..."
```

### From a Buffer
If you already have a file Buffer, that's the way to go:

```js
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

const buffer = fs.readFileSync('./hello');

parser.format('.png', buffer); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
```

### From a string
```js
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

parser.format('.png', 'xkcd'); //=> "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
```

Contribute
-------

```CLI
$ npm install
```

To run test specs

```CLI
$ npm test
```


## [ChangeLog](https://github.com/data-uri/datauri/releases)

## Requirements

Node.js 8+

Previous Node versions and deprecated features:

`npm install --save datauri@2`

docs: https://github.com/data-uri/datauri/blob/v2.0.0/docs/datauri.md

## License

MIT License

(c) [Data-URI.js](https://github.com/data-uri)

(c) [Helder Santana](https://heldr.com)
