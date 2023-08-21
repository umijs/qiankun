# hast-util-to-text

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**hast**][hast] utility to get the plain-text value of a [*node*][node].

This is like the DOMs `Node#innerText` getter but there are some deviations from
the spec.
The resulting text is returned.

You’d typically want to use [`hast-util-to-string`][to-string]
(`textContent`), but `hast-util-to-text` (`innerText`) adds for example line
breaks where `<br>` elements are used.

## Install

[npm][]:

```sh
npm install hast-util-to-text
```

## Use

```js
var h = require('hastscript')
var toText = require('hast-util-to-text')

var tree = h('div', [
  h('h1', {hidden: true}, 'Alpha.'),
  h('article', [
    h('p', ['Bravo', h('br'), 'charlie.']),
    h('p', 'Delta echo \t foxtrot.')
  ])
])

console.log(toText(tree))
```

Yields:

```txt
Bravo
charlie.

Delta echo foxtrot.
```

## API

### `toText(node)`

Utility to get the plain-text value of a [*node*][node].

*   If `node` is a [*comment*][comment], returns its `value`
*   If `node` is a [*text*][text], applies normal white-space collapsing to its
    `value`, as defined by the [CSS Text][css] spec
*   If `node` is a [*root*][root] or [*element*][element], applies an algorithm
    similar to the `innerText` getter as defined by [HTML][]

###### Parameters

*   `node` ([`Node`][node]) — Thing to stringify

###### Returns

`string` — Stringified `node`.

###### Notes

*   If `node` is an [*element*][element] that is not displayed (such as a
    `head`), we’ll still use the `innerText` algorithm instead of switching to
    `textContent`
*   If [*descendants*][descendant] of `node` are [*elements*][element] that are
    not displayed, they are ignored
*   CSS is not considered, except for the default user agent style sheet
*   A line feed is collapsed instead of ignored in cases where Fullwidth, Wide,
    or Halfwidth East Asian Width characters are used, the same goes for a case
    with Chinese, Japanese, or Yi writing systems
*   Replaced [*elements*][element] (such as `audio`) are treated like
    non-replaced *elements*

## Security

`hast-util-to-text` does not change the syntax tree so there are no
openings for [cross-site scripting (XSS)][xss] attacks.

## Related

*   [`hast-util-to-string`](https://github.com/rehypejs/rehype-minify/tree/HEAD/packages/hast-util-to-string)
    — Get the plain-text value (`textContent`)
*   [`hast-util-from-text`](https://github.com/syntax-tree/hast-util-from-text)
    — Set the plain-text value (`innerText`)
*   [`hast-util-from-string`](https://github.com/rehypejs/rehype-minify/tree/HEAD/packages/hast-util-from-string)
    — Set the plain-text value (`textContent`)

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/syntax-tree/hast-util-to-text.svg

[build]: https://travis-ci.org/syntax-tree/hast-util-to-text

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/hast-util-to-text.svg

[coverage]: https://codecov.io/github/syntax-tree/hast-util-to-text

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-to-text.svg

[downloads]: https://www.npmjs.com/package/hast-util-to-text

[size-badge]: https://img.shields.io/bundlephobia/minzip/hast-util-to-text.svg

[size]: https://bundlephobia.com/result?p=hast-util-to-text

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/syntax-tree/.github/blob/HEAD/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/HEAD/support.md

[coc]: https://github.com/syntax-tree/.github/blob/HEAD/code-of-conduct.md

[html]: https://html.spec.whatwg.org/#the-innertext-idl-attribute

[css]: https://drafts.csswg.org/css-text/#white-space-phase-1

[to-string]: https://github.com/rehypejs/rehype-minify/tree/HEAD/packages/hast-util-to-string

[descendant]: https://github.com/syntax-tree/unist#descendant

[hast]: https://github.com/syntax-tree/hast

[node]: https://github.com/syntax-tree/hast#nodes

[root]: https://github.com/syntax-tree/hast#root

[comment]: https://github.com/syntax-tree/hast#comment

[text]: https://github.com/syntax-tree/hast#text

[element]: https://github.com/syntax-tree/hast#element

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting
