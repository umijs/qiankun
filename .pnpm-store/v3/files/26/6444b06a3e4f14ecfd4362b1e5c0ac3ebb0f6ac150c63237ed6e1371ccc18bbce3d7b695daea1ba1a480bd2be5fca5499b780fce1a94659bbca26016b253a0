# safe-regex

Detect potentially
[catastrophic](http://regular-expressions.mobi/catastrophic.html)
[exponential-time](http://perlgeek.de/blog-en/perl-tips/in-search-of-an-exponetial-regexp.html)
regular expressions by limiting the
[star height](https://en.wikipedia.org/wiki/Star_height) to 1.

WARNING: This module has both false positives and false negatives.
Use [vuln-regex-detector](https://github.com/davisjam/vuln-regex-detector) for improved accuracy.

[![Build Status](https://travis-ci.org/davisjam/safe-regex.svg?branch=master)](https://travis-ci.org/davisjam/safe-regex)

## Example

Suppose you have a script named `safe.js`:

``` js
var safe = require('safe-regex');
var regex = process.argv.slice(2).join(' ');
console.log(safe(regex));
```

This is its behavior:

```
$ node safe.js '(x+x+)+y'
false
$ node safe.js '(beep|boop)*'
true
$ node safe.js '(a+){10}'
false
$ node safe.js '\blocation\s*:[^:\n]+\b(Oakland|San Francisco)\b'
true
```

## Methods

``` js
const safe = require('safe-regex')
```

### const ok = safe(re, opts={})

Return a boolean `ok` whether or not the regex `re` is safe and not possibly
catastrophic.

`re` can be a `RegExp` object or just a string.

If the `re` is a string and is an invalid regex, returns `false`.

* `opts.limit` - maximum number of allowed repetitions in the entire regex.
Default: `25`.

## Install

With [npm](https://npmjs.org) do:

```
npm install safe-regex
```

## Resources

### What should I do if my project has a super-linear regex?

1. Confirm that it is *reachable* by untrusted input.
2. If it is, you can consider whether you can prevent worst-case behavior by trimming the input, revising the regex, or replacing the regex with another algorithm like string functions. For examples, see Table 5 in [this article](http://people.cs.vt.edu/davisjam/downloads/publications/DavisCoghlanServantLee-EcosystemREDOS-ESECFSE18.pdf).
3. If none of those solutions looks feasible, you might also consider changing regex engines. The [RE2 bindings](https://www.npmjs.com/package/re2) might work, though test carefully to confirm there are no [semantic portability problems](https://medium.com/@davisjam/why-arent-regexes-a-lingua-franca-esecfse19-a36348df3a2?source=friends_link&sk=d21be7f8f723e2080dc993385c6973d1).

### Further reading

The following documents may be edifying:

- [Research brief on the extent of super-linear regexes in practice](https://medium.com/@davisjam/introduction-987fdc4c7b0?source=friends_link&sk=ceefa4a4ca9617e08ab782c3b1580aea)
- [Research brief on the variability of super-linear regex behavior across programming languages](https://medium.com/@davisjam/why-arent-regexes-a-lingua-franca-esecfse19-a36348df3a2?source=friends_link&sk=d21be7f8f723e2080dc993385c6973d1)
- [Comparing regex matching algorithms](https://swtch.com/~rsc/regexp/regexp1.html)

## Project policies

### Versioning

This project follows [Semantic Versioning 2.0 (semver)](https://semver.org/).

Here are the project-specific meanings of MAJOR, MINOR, and PATCH updates:

- MAJOR: "Incompatible" API changes were introduced. There are two types in this module:
  - Changes that modify the interface
  - Changes that cause any regexes to be marked as unsafe that were formerly marked as safe
- MINOR: Functionality was added in a backwards-compatible manner. There are two types in this module:
  - Refactoring the analyses but not changing their results
  - Modifying the analyses to reduce false positives, without affecting negatives (false or true)
- PATCH: I don't anticipate using PATCH for this module

### License

[MIT](https://github.com/davisjam/safe-regex/blob/master/LICENSE)