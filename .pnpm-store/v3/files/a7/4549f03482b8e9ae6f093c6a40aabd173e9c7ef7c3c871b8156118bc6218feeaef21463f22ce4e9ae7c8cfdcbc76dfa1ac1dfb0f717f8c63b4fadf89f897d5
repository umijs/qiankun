# parse-git-config [![NPM version](https://img.shields.io/npm/v/parse-git-config.svg?style=flat)](https://www.npmjs.com/package/parse-git-config) [![NPM monthly downloads](https://img.shields.io/npm/dm/parse-git-config.svg?style=flat)](https://npmjs.org/package/parse-git-config)  [![NPM total downloads](https://img.shields.io/npm/dt/parse-git-config.svg?style=flat)](https://npmjs.org/package/parse-git-config) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/parse-git-config.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/parse-git-config)

> Parse `.git/config` into a JavaScript object. sync or async.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save parse-git-config
```

## Usage

```js
var parse = require('parse-git-config');

// sync
var config = parse.sync();

// or async
parse(function (err, config) {
  // do stuff with err/config
});
```

**Custom path and/or cwd**

```js
parse.sync({cwd: 'foo', path: '.git/config'});

// async
parse({cwd: 'foo', path: '.git/config'}, function (err, config) {
  // do stuff 
});
```

**Example result**

Config object will be something like:

```js
{ core:
   { repositoryformatversion: '0',
     filemode: true,
     bare: false,
     logallrefupdates: true,
     ignorecase: true,
     precomposeunicode: true },
  'remote "origin"':
   { url: 'https://github.com/jonschlinkert/parse-git-config.git',
     fetch: '+refs/heads/*:refs/remotes/origin/*' },
  'branch "master"': { remote: 'origin', merge: 'refs/heads/master', ... } }
```

## API

### [parse](index.js#L33)

Asynchronously parse a `.git/config` file. If only the callback is passed, the `.git/config` file relative to `process.cwd()` is used.

**Example**

```js
parse(function(err, config) {
  if (err) throw err;
  // do stuff with config
});
```

**Params**

* `options` **{Object|String|Function}**: Options with `cwd` or `path`, the cwd to use, or the callback function.
* `cb` **{Function}**: callback function if the first argument is options or cwd.
* `returns` **{Object}**

### [.sync](index.js#L71)

Synchronously parse a `.git/config` file. If no arguments are passed, the `.git/config` file relative to `process.cwd()` is used.

**Example**

```js
var config = parse.sync();
```

**Params**

* `options` **{Object|String}**: Options with `cwd` or `path`, or the cwd to use.
* `returns` **{Object}**

### [.keys](index.js#L109)

Returns an object with only the properties that had ini-style keys converted to objects (example below).

**Example**

```js
var config = parse.sync();
var obj = parse.keys(config);
```

**Params**

* `config` **{Object}**: The parsed git config object.
* `returns` **{Object}**

### .keys examples

Converts ini-style keys into objects:

**Example 1**

```js
var parse = require('parse-git-config');
var config = { 
  'foo "bar"': { doStuff: true },
  'foo "baz"': { doStuff: true } 
};

console.log(parse.keys(config));
```

Results in:

```js
{ 
  foo: { 
    bar: { doStuff: true }, 
    baz: { doStuff: true } 
  } 
}
```

**Example 2**

```js
var parse = require('parse-git-config');
var config = {
  'remote "origin"': { 
    url: 'https://github.com/jonschlinkert/normalize-pkg.git',
    fetch: '+refs/heads/*:refs/remotes/origin/*' 
  },
  'branch "master"': { 
    remote: 'origin', 
    merge: 'refs/heads/master' 
  },
  'branch "dev"': { 
    remote: 'origin', 
    merge: 'refs/heads/dev', 
    rebase: true 
  }
};

console.log(parse.keys(config));
```

Results in:

```js
{
  remote: {
    origin: {
      url: 'https://github.com/jonschlinkert/normalize-pkg.git',
      fetch: '+refs/heads/*:refs/remotes/origin/*'
    }
  },
  branch: {
    master: {
      remote: 'origin',
      merge: 'refs/heads/master'
    },
    dev: {
      remote: 'origin',
      merge: 'refs/heads/dev',
      rebase: true
    }
  }
}
```

## About

### Related projects

* [git-user-name](https://www.npmjs.com/package/git-user-name): Get a user's name from git config at the project or global scope, depending on… [more](https://github.com/jonschlinkert/git-user-name) | [homepage](https://github.com/jonschlinkert/git-user-name "Get a user's name from git config at the project or global scope, depending on what git uses in the current context.")
* [git-username](https://www.npmjs.com/package/git-username): Get the username from a git remote origin URL. | [homepage](https://github.com/jonschlinkert/git-username "Get the username from a git remote origin URL.")
* [parse-author](https://www.npmjs.com/package/parse-author): Parse a string into an object with `name`, `email` and `url` properties following npm conventions… [more](https://github.com/jonschlinkert/parse-author) | [homepage](https://github.com/jonschlinkert/parse-author "Parse a string into an object with `name`, `email` and `url` properties following npm conventions. Useful for the `authors` property in package.json or for parsing an AUTHORS file into an array of authors objects.")
* [parse-authors](https://www.npmjs.com/package/parse-authors): Parse a string into an array of objects with `name`, `email` and `url` properties following… [more](https://github.com/jonschlinkert/parse-authors) | [homepage](https://github.com/jonschlinkert/parse-authors "Parse a string into an array of objects with `name`, `email` and `url` properties following npm conventions. Useful for the `authors` property in package.json or for parsing an AUTHORS file into an array of authors objects.")
* [parse-github-url](https://www.npmjs.com/package/parse-github-url): Parse a github URL into an object. | [homepage](https://github.com/jonschlinkert/parse-github-url "Parse a github URL into an object.")
* [parse-gitignore](https://www.npmjs.com/package/parse-gitignore): Parse a gitignore file into an array of patterns. Comments and empty lines are stripped. | [homepage](https://github.com/jonschlinkert/parse-gitignore "Parse a gitignore file into an array of patterns. Comments and empty lines are stripped.")

### Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Contributors

| **Commits** | **Contributor**<br/> | 
| --- | --- |
| 48 | [jonschlinkert](https://github.com/jonschlinkert) |
| 1 | [sam3d](https://github.com/sam3d) |
| 1 | [jsdnxx](https://github.com/jsdnxx) |

### Building docs

_(This document was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme) (a [verb](https://github.com/verbose/verb) generator), please don't edit the readme directly. Any changes to the readme must be made in [.verb.md](.verb.md).)_

To generate the readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-generate-readme && verb
```

### Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

### Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

### License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/jonschlinkert/parse-git-config/blob/master/LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.2.0, on December 14, 2016._