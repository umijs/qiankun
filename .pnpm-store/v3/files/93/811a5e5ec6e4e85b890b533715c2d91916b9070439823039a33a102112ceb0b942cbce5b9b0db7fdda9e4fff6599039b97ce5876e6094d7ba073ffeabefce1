
# Node.js mixme

![Build Status](https://github.com/adaltas/node-mixme/actions/workflows/test.yml/badge.svg)

Merge multiple object recursively, with TypeScript support. The last object takes precedence over the previous ones. Only objects are merged. Arrays are overwritten.

- Zero dependencies
- Small size
- Pure functions
- ESM and CommonJS support

## API

### Function `merge(...data)`

The API is minimalist, pass as many literal objects as you wish, they will all be merged. This function is immutable, the source objects won't be altered.

```js
import { merge } from 'mixme'

const target = merge({a: '1'}, {b: '2'});
// target is {a: '1', b: '2'}
```

### Function `mutate(...data)`

Use the `mutate` function to enrich an object. The first argument will be mutated:

```js
import { mutate } from 'mixme'

const source = {a: '1'};
const target = mutate(source, {b: '2'});
target.c = '3';
// source and target are both {a: '1', b: '2', c: '3'}
```

### Function `clone(data)`

It is possible to clone a literal object by simply calling `mixme` with this object as the first argument. Use the `clone` function in case you wish to clone any type of argument including arrays:

```js
import { clone } from 'mixme'

const target = clone(['a', 'b'])
// target is now a copy of source
```

### Function `is_object_literal(object)`

Use the `is_object_literal` function to ensure an object is literate.

```js
import { is_object_literal } from 'mixme'

// {} is literate
is_object_literal({})

// error is not literate
is_object_literal(new Error('Catch me'))

// Array is not literate
is_object_literal([])
```

### Function `snake_case(object)`

Clone a object and convert its properties into snake case.

```js
import { snake_case } from 'mixme'

snake_case({aA: '1', bB: cC: '2'})
// Return {a_a: '1', b_b: c_c: '2'}
```

### Function `compare(item_1, item_2)`

Compare two items and return true if their values match.

```js
import { compare } from 'mixme'

compare([{a: 1}], [{a: 1}])
// Return true

compare({a: 1}, {a: 2})
// Return false
```

## Example

Create a new object from two objects:

```js
import { merge } from 'mixme'

const obj1 = { a_key: 'a value', b_key: 'b value'}
const obj2 = { b_key: 'new b value'}
const result = merge(obj1, obj2)

assert.eql(result.b_key, 'new b value')
```

Merge an existing object with a second one:

```js
import { mutate } from 'mixme'

const obj1 = { a_key: 'a value', b_key: 'b value'};
const obj2 = { b_key: 'new b value'};
const result = mutate(obj1, obj2)

assert.eql(result, obj1)
assert.eql(obj1.b_key, 'new b value')
```

## Testing

Clone the repo, install the development dependencies and run the tests:

```bash
git clone http://github.com/wdavidw/node-mixme.git .
npm install
npm run test
```

## Developers

To automatically generate a new version:

```bash
yarn run release
git push --follow-tags origin master
```

Package publication is handled by the CI/CD with GitHub action.

Note:

- On release, both the publish and test workflows run in parallel. Not very happy about it but I haven't found a better way.
- `yarn` does not call the "postrelease" script and `npm` fails if the `package-lock.json` file is present and git ignored.

## Contributors

- David Worms: <https://github.com/wdavidw>
- Paul Farault: <https://github.com/PaulFarault>

This package is developed by [Adaltas](https://www.adaltas.com).
