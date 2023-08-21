# react-attr-converter [![travis-ci](https://travis-ci.org/noraesae/react-attr-converter.svg)](https://travis-ci.org/noraesae/react-attr-converter)

Convert HTML attribute names to React props.

## Convert how?

It converts HTML attribute names into prop names used by React.

```js
convert('class'); // => 'className'
convert('for'); // => 'htmlFor'
convert('onclick'); // => 'onClick'
convert('onCLICK'); // => 'onClick'
```

It bypasses attribute names which are not supported by React.

```js
convert('data-hello'); // => 'data-hello'
convert('lovelive'); // => 'lovelive'
```

## How to use

Install with NPM:

```
npm i --save react-attr-converter
```

Import with CommonJS or whatever:

```js
const convert = require('react-attr-converter');

import convert from 'react-attr-converter';
import * as convert from 'react-attr-converter'; // both of them work
```

## A bug!

When a bug is found, please report them in [Issues](https://github.com/noraesae/react-attr-converter/issues).

Also, any form of contribution(especially a PR) will absolutely be welcomed :beers:

## License

[MIT](LICENSE)
