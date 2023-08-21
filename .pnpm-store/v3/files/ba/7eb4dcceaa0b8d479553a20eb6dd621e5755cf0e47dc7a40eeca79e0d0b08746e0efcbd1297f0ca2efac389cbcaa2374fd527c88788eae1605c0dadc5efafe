# Record & Tuple Polyfill
The [Record and Tuple](https://github.com/tc39/proposal-record-tuple) ECMAScript proposal introduces new deeply immutable value types to JavaScript
that have similar access idioms to objects and arrays.

This is an **experiemental and explicitly not production ready** polyfill for the `Record and Tuple` proposal, and a [babel](https://babeljs.io) transform to support using the literal syntax.

The polyfill and transform are **constant works in progress** and are not the source of truth for the proposal.

# Requirements

In order to use the syntax transform, [babel](https://babeljs.io) must be installed with at least version `7.9.0`.

In order to use the polyfill, the environment must support `WeakMap`, [`WeakRef`, and `FinalizationRegistry`](https://github.com/tc39/proposal-weakrefs). If implementations of these features are not provided, an error will be thrown.

# Installation

> Note: the Babel transform described below is not currently published on NPM, [as it is awaiting review](https://github.com/babel/babel/pull/12145).
> If you really want to try the Babel transform plugin in it's packaged state, publishing locally via [verdaccio](https://verdaccio.org/) is an excellent option.

To install the transform and polyfill:

```
# install the babel transform as a dev dependency, only needed at compile time
npm install -D @bloomberg/babel-plugin-proposal-record-tuple

# install the polyfill as a regular dependency, needed at runtime
npm install --save @bloomberg/record-tuple-polyfill
```

Next, add the plugin to your `babel` configuration. Example:

```json
{
    "plugins": [["@bloomberg/babel-plugin-proposal-record-tuple", { "syntaxType": "hash" }]]
}
```

> Note, the `syntaxType` option is required, and must be set to either `hash` or `bar`.

# Usage

If the `babel` transform and the polyfill are setup, you can start using the `Record and Tuple` literal syntax.

```js
console.log(#{ a: 1 } === #{ a: 1 });
console.log(#[1, 2, 3] === #[1, 2, 3]);
```

If you want to use the Record or Tuple global objects, you can import them from the polyfill directly.

```js
import { Record, Tuple } from "@bloomberg/record-tuple-polyfill";

const record = Record({ a: 1 });
const tuple = Tuple(1, 2, 3);
const array = [1,2,3];

console.log(Record.isRecord(record));
console.log(Record.keys(record));
console.log(Tuple.from(array));
```

# Unsupported Features

`typeof` will return an incorrect value when provided a `Record` or `Tuple`.
This is because the polyfill implements the proposal via [interning](https://en.wikipedia.org/wiki/String_interning) frozen objects.

# Playground

The Record and Tuple polyfill has been deployed in an easy to use REPL [here](https://rickbutton.github.io/record-tuple-playground/).

## Supported Environments/Browsers

The Record and Tuple polyfill requires several JavaScript features that are only available experimentally in browsers, specifically `WeakRef` and `FinalizationRegistry`.

The following environments support these experimental features out-of-the-box.

| environment     | supported                                |
|-----------------|------------------------------------------|
| [Chrome Canary](https://www.google.com/chrome/canary/)   | :heavy_check_mark:                       |


In order to use these experimental features other browsers, you must run the browser/environment with specific flags:

| environment     | flags                                    |
|-----------------|------------------------------------------|
| node            | --harmony-weak-refs                      |
| Chrome          | --js-flags="--harmony-weak-refs"         |
| Firefox Nightly | javascript.options.experimental.weakrefs |
