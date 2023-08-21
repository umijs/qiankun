# unist-util-filter

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**unist**][unist] utility to create a new tree with all nodes that pass the
given test.

## Install

[npm][]:

```sh
npm install unist-util-filter
```

## Use

```js
var u = require('unist-builder')
var filter = require('unist-util-filter')

var tree = u('root', [
  u('leaf', '1'),
  u('node', [u('leaf', '2'), u('node', [u('leaf', '3')])]),
  u('leaf', '4')
])

var newTree = filter(tree, node => node.type !== 'leaf' || node.value % 2 === 0)

console.dir(newTree, {depth: null})
```

Yields:

```js
{
  type: 'root',
  children: [
    {type: 'node', children: [{type: 'leaf', value: '2'}]},
    {type: 'leaf', value: '4'}
  ]
}
```

## API

### `filter(tree[, options][, test])`

Create a new [tree][] consisting of copies of all nodes that pass `test`.
The tree is walked in [preorder][] (NLR), visiting the node itself, then its
[head][], etc.

###### Parameters

*   `tree` ([`Node?`][node])
    — [Tree][] to filter
*   `options.cascade` (`boolean`, default: `true`)
    — Whether to drop parent nodes if they had children, but all their children
    were filtered out
*   `test` ([`Test`][is], optional) — [`is`][is]-compatible test (such as a
    [type][])

###### Returns

[`Node?`][node] — New filtered [tree][].
`null` is returned if `tree` itself didn’t pass the test, or is cascaded away.

## Related

*   [`unist-util-visit`](https://github.com/syntax-tree/unist-util-visit)
    — Recursively walk over nodes
*   [`unist-util-visit-parents`](https://github.com/syntax-tree/unist-util-visit-parents)
    — Like `visit`, but with a stack of parents
*   [`unist-util-map`](https://github.com/syntax-tree/unist-util-map)
    — Create a new tree with all nodes mapped by a given function
*   [`unist-util-flatmap`](https://gitlab.com/staltz/unist-util-flatmap)
    — Create a new tree by mapping (to an array) by a given function
*   [`unist-util-remove`](https://github.com/syntax-tree/unist-util-remove)
    — Remove nodes from a tree that pass a test
*   [`unist-util-select`](https://github.com/syntax-tree/unist-util-select)
    — Select nodes with CSS-like selectors

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © Eugene Sharygin

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/syntax-tree/unist-util-filter.svg

[build]: https://travis-ci.org/syntax-tree/unist-util-filter

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/unist-util-filter.svg

[coverage]: https://codecov.io/github/syntax-tree/unist-util-filter

[downloads-badge]: https://img.shields.io/npm/dm/unist-util-filter.svg

[downloads]: https://www.npmjs.com/package/unist-util-filter

[size-badge]: https://img.shields.io/bundlephobia/minzip/unist-util-filter.svg

[size]: https://bundlephobia.com/result?p=unist-util-filter

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[unist]: https://github.com/syntax-tree/unist

[node]: https://github.com/syntax-tree/unist#node

[tree]: https://github.com/syntax-tree/unist#tree

[preorder]: https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/

[head]: https://github.com/syntax-tree/unist#head

[type]: https://github.com/syntax-tree/unist#type

[is]: https://github.com/syntax-tree/unist-util-is

[contributing]: https://github.com/syntax-tree/.github/blob/HEAD/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/HEAD/support.md

[coc]: https://github.com/syntax-tree/.github/blob/HEAD/code-of-conduct.md
