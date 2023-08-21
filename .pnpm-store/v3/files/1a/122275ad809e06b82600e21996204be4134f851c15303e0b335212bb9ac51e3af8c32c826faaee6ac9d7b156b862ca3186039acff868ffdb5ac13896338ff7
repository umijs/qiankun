# flatMap — the missing function for functional Node

Those who use [underscorejs](https://github.com/jashkenas/underscore) are often
[very](https://github.com/jashkenas/underscore/issues/436) [sad](https://github.com/jashkenas/underscore/issues/452), because there is no `flatMap` function.

So, ...

## Usage

```
npm install flatmap
```

```
var flatMap = require('flatmap');
```

Just like `map`, `flatMap` accepts three arguments:

  * the `array` to be traversed
  * the `iterator` function, which is invoked with three parameters

        * `value` currently iterated
        * optional `index` of current iteration
        * and optional `array` being iterated

  * the `context` value, which will be `this` inside the `iterator` function.

Example:

```
flatMap(['Hi', 'World'], function(word) {
  return word.split('');
});
// ['H', 'i', 'W', 'o', 'r', 'l', 'd']
```

The `iterator` function can return either a value (in that case it is simply appended to results) or an array (in that case the array is concatenated with results).

Returning `null` or `undefined` from `iterator` will append nothing to the results.

**Heads up!** This is not equivalent to `_.compose(_.flatten, _.map)`, since nested sub-arrays are **not flattened**.

### License

Copyright (C) 2013 Boris Okunskiy <boris@okunskiy.name> (MIT license)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished
to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.





