#is-arrow-function <sup>[![Version Badge][npm-version-svg]][npm-url]</sup>

[![Build Status][travis-svg]][travis-url]
[![dependency status][deps-svg]][deps-url]
[![dev dependency status][dev-deps-svg]][dev-deps-url]

[![npm badge][npm-badge-png]][npm-url]

[![browser support][testling-png]][testling-url]

npm module to determine if a function is an ES6 arrow function or not.

NOTE: Only works in Firefox at the moment.

## Example

```js
var isArrowFunction = require('is-arrow-function');
assert(!isArrowFunction(function () {}));
assert(!isArrowFunction(null));
assert(isArrowFunction((a, b) => a * b));
assert(isArrowFunction(() => 42));
assert(isArrowFunction(x => x * x));
assert(isArrowFunction(x => () => x * x));
```

## Tests
Simply clone the repo, `npm install`, and run `npm test`

[npm-url]: https://npmjs.org/package/is-arrow-function
[npm-version-svg]: http://versionbadg.es/ljharb/is-arrow-function.svg
[travis-svg]: https://travis-ci.org/ljharb/is-arrow-function.svg
[travis-url]: https://travis-ci.org/ljharb/is-arrow-function
[deps-svg]: https://david-dm.org/ljharb/is-arrow-function.svg
[deps-url]: https://david-dm.org/ljharb/is-arrow-function
[dev-deps-svg]: https://david-dm.org/ljharb/is-arrow-function/dev-status.svg
[dev-deps-url]: https://david-dm.org/ljharb/is-arrow-function#info=devDependencies
[testling-png]: https://ci.testling.com/ljharb/is-arrow-function.png
[testling-url]: https://ci.testling.com/ljharb/is-arrow-function
[npm-badge-png]: https://nodei.co/npm/is-arrow-function.png?downloads=true&stars=true

