# remark-rehype

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**remark**][remark] plugin to bridge or mutate to [**rehype**][rehype].

> Note: `remark-rehype` doesn’t deal with HTML inside the Markdown.
> You’ll need [`rehype-raw`][raw] if you’re planning on doing that.

## Install

[npm][]:

```sh
npm install remark-rehype
```

## Use

Say we have the following file, `example.md`:

```markdown
# Hello world

> Block quote.

Some _emphasis_, **importance**, and `code`.
```

And our script, `example.js`, looks as follows:

```js
var vfile = require('to-vfile')
var report = require('vfile-reporter')
var unified = require('unified')
var markdown = require('remark-parse')
var remark2rehype = require('remark-rehype')
var doc = require('rehype-document')
var format = require('rehype-format')
var html = require('rehype-stringify')

unified()
  .use(markdown)
  .use(remark2rehype)
  .use(doc)
  .use(format)
  .use(html)
  .process(vfile.readSync('example.md'), function(err, file) {
    console.error(report(err || file))
    console.log(String(file))
  })
```

Now, running `node example` yields:

```html
example.md: no issues found
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>example</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body>
    <h1>Hello world</h1>
    <blockquote>
      <p>Block quote.</p>
    </blockquote>
    <p>Some <em>emphasis</em>, <strong>importance</strong>, and <code>code</code>.</p>
  </body>
</html>
```

## API

### `origin.use(remark2rehype[, destination][, options])`

[**remark**][remark] ([**mdast**][mdast]) plugin to bridge or mutate to
[**rehype**][rehype] ([**hast**][hast]).

###### `destination`

If a [`Unified`][processor] processor is given, runs the destination processor
with the new hast tree, then, after running discards that tree and continues on
running the origin processor with the original tree ([*bridge mode*][bridge]).
Otherwise, passes the tree to further plugins (*mutate mode*).

###### `options`

Passed to [`mdast-util-to-hast`][to-hast].

## Related

*   [`rehype-raw`][raw]
    — Properly deal with HTML in Markdown (used after `remark-rehype`)
*   [`rehype-remark`](https://github.com/rehypejs/rehype-remark)
    — Transform HTML ([hast][]) to Markdown ([mdast][])
*   [`rehype-retext`](https://github.com/rehypejs/rehype-retext)
    — Transform HTML ([hast][]) to natural language ([nlcst][])
*   [`remark-retext`](https://github.com/remarkjs/remark-retext)
    — Transform Markdown ([mdast][]) to natural language ([nlcst][])

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/remarkjs/remark-rehype/master.svg

[build]: https://travis-ci.org/remarkjs/remark-rehype

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-rehype.svg

[coverage]: https://codecov.io/github/remarkjs/remark-rehype

[downloads-badge]: https://img.shields.io/npm/dm/remark-rehype.svg

[downloads]: https://www.npmjs.com/package/remark-rehype

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-rehype.svg

[size]: https://bundlephobia.com/result?p=remark-rehype

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/remark

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/master/contributing.md

[support]: https://github.com/remarkjs/.github/blob/master/support.md

[coc]: https://github.com/remarkjs/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[processor]: https://github.com/unifiedjs/unified#processor

[bridge]: https://github.com/unifiedjs/unified#processing-between-syntaxes

[remark]: https://github.com/remarkjs/remark

[rehype]: https://github.com/rehypejs/rehype

[raw]: https://github.com/rehypejs/rehype-raw

[mdast]: https://github.com/syntax-tree/mdast

[hast]: https://github.com/syntax-tree/hast

[nlcst]: https://github.com/syntax-tree/nlcst

[to-hast]: https://github.com/syntax-tree/mdast-util-to-hast#tohastnode-options
