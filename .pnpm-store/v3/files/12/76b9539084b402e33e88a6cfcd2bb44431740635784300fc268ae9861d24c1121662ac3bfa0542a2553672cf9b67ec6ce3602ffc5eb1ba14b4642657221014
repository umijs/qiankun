# hast-util-has-property

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**hast**][hast] utility to check if an [*element*][element] has a
[*property*][property].

## Install

[npm][]:

```sh
npm install hast-util-has-property
```

## Use

```js
var has = require('hast-util-has-property')

has({type: 'text', value: 'alpha'}, 'bravo') // => false

has(
  {
    type: 'element',
    tagName: 'div',
    properties: {id: 'bravo'},
    children: []
  },
  'className'
) // => false

has(
  {
    type: 'element',
    tagName: 'div',
    properties: {id: 'charlie'},
    children: []
  },
  'id'
) // => true
```

## API

### `hasProperty(node, name)`

Check if `node` is an [*element*][element] that has a `name`
[*property name*][property].

###### Parameters

*   `node` ([`Node`][node], optional) — [*Node*][node] to check
*   `name` (`string`) - [*Property name*][property]

###### Returns

`boolean` — Whether `node` is an [*element*][element] that has a `name`
[*property name*][property].

## Security

`hast-util-has-property` does not change the syntax tree so there are no
openings for [cross-site scripting (XSS)][xss] attacks.

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definition -->

[build-badge]: https://img.shields.io/travis/syntax-tree/hast-util-has-property.svg

[build]: https://travis-ci.org/syntax-tree/hast-util-has-property

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/hast-util-has-property.svg

[coverage]: https://codecov.io/github/syntax-tree/hast-util-has-property

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-has-property.svg

[downloads]: https://www.npmjs.com/package/hast-util-has-property

[size-badge]: https://img.shields.io/bundlephobia/minzip/hast-util-has-property.svg

[size]: https://bundlephobia.com/result?p=hast-util-has-property

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/syntax-tree

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/syntax-tree/.github/blob/master/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/master/support.md

[coc]: https://github.com/syntax-tree/.github/blob/master/code-of-conduct.md

[hast]: https://github.com/syntax-tree/hast

[node]: https://github.com/syntax-tree/hast#nodes

[element]: https://github.com/syntax-tree/hast#element

[property]: https://github.com/syntax-tree/hast#property-names

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
