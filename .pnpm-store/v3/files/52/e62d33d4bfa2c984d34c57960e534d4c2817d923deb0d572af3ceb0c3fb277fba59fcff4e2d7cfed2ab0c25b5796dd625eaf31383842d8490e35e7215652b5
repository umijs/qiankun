# stylelint-config-prettier

[![NPM version][npm-img]][npm-url] [![Downloads][downloads-img]][npm-url] [![Build Status][travis-img]][travis-url] [![Coverage Status][coveralls-img]][coveralls-url]

Turns off all rules that are unnecessary or might conflict with Prettier. This lets you use your favorite shareable config without letting its stylistic choices get in the way when using Prettier.

## Installation

Install `stylelint-config-prettier`:

```
$ npm install --save-dev stylelint-config-prettier
```

Then, append `stylelint-config-prettier` to the [`extends` array](https://stylelint.io/user-guide/configuration/#extends) in your `.stylelintrc.*` file. Make sure to put it **last,** so it will override other configs.

```js
{
  "extends": [
    // other configs ...
    "stylelint-config-prettier"
  ]
}
```

## CLI helper tool

`stylelint-config-prettier` is shipped with a little CLI tool to help you check if your configuration contains any rules that are in conflict with Prettier.

In order to execute the CLI tool, first add a script for it to `package.json`:

```json
{
  "scripts": {
    "stylelint-check": "stylelint-config-prettier-check"
  }
}
```

Then run `npm run stylelint-check`.

## Attribution

- Inspired by [`eslint-config-prettier`](http://npm.im/eslint-config-prettier).
- CLI helper inspired by [`tslint-config-prettier`](https://github.com/alexjoverm/tslint-config-prettier).
- Original disabled ruleset copied from [`prettier-stylelint`](http://npm.im/prettier-stylelint).

----

[MIT](license)

[coveralls-img]: http://img.shields.io/coveralls/shannonmoeller/stylelint-config-prettier/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/shannonmoeller/stylelint-config-prettier
[downloads-img]: http://img.shields.io/npm/dm/stylelint-config-prettier.svg?style=flat-square
[npm-img]:       http://img.shields.io/npm/v/stylelint-config-prettier.svg?style=flat-square
[npm-url]:       https://npmjs.org/package/stylelint-config-prettier
[travis-img]:    http://img.shields.io/travis/prettier/stylelint-config-prettier.svg?style=flat-square
[travis-url]:    https://travis-ci.org/prettier/stylelint-config-prettier
