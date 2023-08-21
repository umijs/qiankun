# hast-util-to-html

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**hast**][hast] utility to transform to HTML.

## Install

[npm][]:

```sh
npm install hast-util-to-html
```

## Usage

```js
var h = require('hastscript')
var toHtml = require('hast-util-to-html')

var tree = h('.alpha', [
  'bravo ',
  h('b', 'charlie'),
  ' delta ',
  h('a.echo', {download: true}, 'foxtrot')
])

console.log(toHtml(tree))
```

Yields:

```html
<div class="alpha">bravo <b>charlie</b> delta <a class="echo" download>foxtrot</a></div>
```

## API

### `toHtml(tree[, options])`

Stringify the given [**hast**][hast] [*tree*][tree].

###### `options.space`

Whether the [*root*][root] of the [*tree*][tree] is in the `'html'` or `'svg'`
space (enum, `'svg'` or `'html'`, default: `'html'`).

If an `svg` element is found in the HTML space, `toHtml` automatically switches
to the SVG space when entering the element, and switches back when exiting.

###### `options.entities`

Configuration for [`stringify-entities`][stringify-entities] (`Object`, default:
`{}`).
Do not use `escapeOnly`, `attribute`, or `subset` (`toHtml` already passes
those, so they won’t work).
However, `useNamedReferences`, `useShortestReferences`, and
`omitOptionalSemicolons` are all fine.

###### `options.voids`

Tag names of [*elements*][element] to stringify without closing tag
(`Array.<string>`, default: [`html-void-elements`][html-void-elements]).

Not used in the SVG space.

###### `options.upperDoctype`

Use an `<!DOCTYPE…` instead of `<!doctype…`.
Useless except for XHTML (`boolean`, default: `false`).

###### `options.quote`

Preferred quote to use (`'"'` or `'\''`, default: `'"'`).

###### `options.quoteSmart`

Use the other quote if that results in less bytes (`boolean`, default: `false`).

###### `options.preferUnquoted`

Leave attributes unquoted if that results in less bytes (`boolean`, default:
`false`).

Not used in the SVG space.

###### `options.omitOptionalTags`

Omit optional opening and closing tags (`boolean`, default: `false`).
For example, in `<ol><li>one</li><li>two</li></ol>`, both `</li>`
closing tags can be omitted.
The first because it’s followed by another `li`, the last because it’s followed
by nothing.

Not used in the SVG space.

###### `options.collapseEmptyAttributes`

Collapse empty attributes: `class=""` is stringified as `class` instead
(`boolean`, default: `false`).
**Note**: boolean attributes, such as `hidden`, are always collapsed.

Not used in the SVG space.

###### `options.closeSelfClosing`

Close self-closing nodes with an extra slash (`/`): `<img />` instead of
`<img>` (`boolean`, default: `false`).
See `tightSelfClosing` to control whether a space is used before the slash.

Not used in the SVG space.

###### `options.closeEmptyElements`

Close SVG elements without any content with slash (`/`) on the opening tag
instead of an end tag: `<circle />` instead of `<circle></circle>` (`boolean`,
default: `false`).
See `tightSelfClosing` to control whether a space is used before the slash.

Not used in the HTML space.

###### `options.tightSelfClosing`

Do not use an extra space when closing self-closing elements: `<img/>` instead
of `<img />` (`boolean`, default: `false`).
**Note**: Only used if `closeSelfClosing: true` or `closeEmptyElements: true`.

###### `options.tightCommaSeparatedLists`

Join known comma-separated attribute values with just a comma (`,`), instead of
padding them on the right as well (`,·`, where `·` represents a space)
(`boolean`, default: `false`).

###### `options.tightAttributes`

Join attributes together, without white-space, if possible: `class="a b"
title="c d"` is stringified as `class="a b"title="c d"` instead to save bytes
(`boolean`, default: `false`).
**Note**: creates invalid (but working) markup.

Not used in the SVG space.

###### `options.tightDoctype`

Drop unneeded spaces in doctypes: `<!doctypehtml>` instead of `<!doctype html>`
to save bytes (`boolean`, default: `false`).
**Note**: creates invalid (but working) markup.

###### `options.allowParseErrors`

Do not encode characters which cause parse errors (even though they work), to
save bytes (`boolean`, default: `false`).
**Note**: creates invalid (but working) markup.

Not used in the SVG space.

###### `options.allowDangerousCharacters`

Do not encode some characters which cause XSS vulnerabilities in older browsers
(`boolean`, default: `false`).
**Note**: Only set this if you completely trust the content.

###### `options.allowDangerousHTML`

Allow `raw` nodes and insert them as raw HTML.
When falsey, encodes `raw` nodes (`boolean`, default: `false`).
**Note**: Only set this if you completely trust the content.

## Security

Use of `hast-util-to-html` can open you up to a
[cross-site scripting (XSS)][xss] attack if the hast tree is unsafe.
Use [`hast-util-santize`][sanitize] to make the hast tree safe.

## Related

*   [`hast-util-sanitize`][hast-util-sanitize]
    — Sanitize hast nodes
*   [`rehype-stringify`](https://github.com/wooorm/rehype/tree/master/packages/rehype-stringify)
    — Wrapper around this project for [**rehype**](https://github.com/wooorm/rehype)

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/syntax-tree/hast-util-to-html.svg

[build]: https://travis-ci.org/syntax-tree/hast-util-to-html

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/hast-util-to-html.svg

[coverage]: https://codecov.io/github/syntax-tree/hast-util-to-html

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-to-html.svg

[downloads]: https://www.npmjs.com/package/hast-util-to-html

[size-badge]: https://img.shields.io/bundlephobia/minzip/hast-util-to-html.svg

[size]: https://bundlephobia.com/result?p=hast-util-to-html

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/syntax-tree

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/syntax-tree/.github/blob/master/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/master/support.md

[coc]: https://github.com/syntax-tree/.github/blob/master/code-of-conduct.md

[html-void-elements]: https://github.com/wooorm/html-void-elements

[stringify-entities]: https://github.com/wooorm/stringify-entities

[hast-util-sanitize]: https://github.com/syntax-tree/hast-util-sanitize

[tree]: https://github.com/syntax-tree/unist#tree

[root]: https://github.com/syntax-tree/unist#root

[hast]: https://github.com/syntax-tree/hast

[element]: https://github.com/syntax-tree/hast#element

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[sanitize]: https://github.com/syntax-tree/hast-util-sanitize
