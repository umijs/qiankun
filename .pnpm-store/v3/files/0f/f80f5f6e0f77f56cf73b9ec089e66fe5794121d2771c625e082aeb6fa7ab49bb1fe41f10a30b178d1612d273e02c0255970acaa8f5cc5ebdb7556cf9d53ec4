# rehype-autolink-headings

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**rehype**][rehype] plugin to automatically add links to headings (h1-h6).

## Install

[npm][]:

```sh
npm install rehype-autolink-headings
```

## Use

Say we have the following file, `fragment.html`:

```html
<h1>Lorem ipsum 😪</h1>
<h2>dolor—sit—amet</h2>
<h3>consectetur &amp; adipisicing</h3>
<h4>elit</h4>
<h5>elit</h5>
```

And our script, `example.js`, looks as follows:

```js
var fs = require('fs')
var rehype = require('rehype')
var slug = require('rehype-slug')
var link = require('rehype-autolink-headings')

var doc = fs.readFileSync('fragment.html')

rehype()
  .data('settings', {fragment: true})
  .use(slug)
  .use(link)
  .process(doc, function(err, file) {
    if (err) throw err
    console.log(String(file))
  })
```

Now, running `node example` yields:

```html
<h1 id="lorem-ipsum-"><a aria-hidden="true" href="#lorem-ipsum-"><span class="icon icon-link"></span></a>Lorem ipsum 😪</h1>
<h2 id="dolorsitamet"><a aria-hidden="true" href="#dolorsitamet"><span class="icon icon-link"></span></a>dolor—sit—amet</h2>
<h3 id="consectetur--adipisicing"><a aria-hidden="true" href="#consectetur--adipisicing"><span class="icon icon-link"></span></a>consectetur &#x26; adipisicing</h3>
<h4 id="elit"><a aria-hidden="true" href="#elit"><span class="icon icon-link"></span></a>elit</h4>
<h5 id="elit-1"><a aria-hidden="true" href="#elit-1"><span class="icon icon-link"></span></a>elit</h5>
```

## API

### `rehype().use(link[, options])`

Add links to headings (h1-h6) with an `id`.

##### `options`

###### `options.behavior`

How to add a link (`string`, default: `prepend`).
Can be:

*   `'prepend'` and `'append'` — insert a link with `content` in it respectively
    before or after the heading contents
*   `'wrap'` — wrap a link around the current heading contents

###### `options.properties`

Properties for the added link (`Object`, default: `{}` if `'wrap'`,
`{ariaHidden: true}` otherwise).

###### `options.content`

Content to add in link (`Node` or `Array.<Node>`, default: a `span` element
with `icon` and `icon-link` classes).
Ignored if `'wrap'`.

## Related

*   [`rehype-slug`](https://github.com/rehypejs/rehype-slug)

## Contribute

See [`contributing.md`][contributing] in [`rehypejs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/rehypejs/rehype-autolink-headings.svg

[build]: https://travis-ci.org/rehypejs/rehype-autolink-headings

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-autolink-headings.svg

[coverage]: https://codecov.io/github/rehypejs/rehype-autolink-headings

[downloads-badge]: https://img.shields.io/npm/dm/rehype-autolink-headings.svg

[downloads]: https://www.npmjs.com/package/rehype-autolink-headings

[size-badge]: https://img.shields.io/bundlephobia/minzip/rehype-autolink-headings.svg

[size]: https://bundlephobia.com/result?p=rehype-autolink-headings

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/rehype

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/master/contributing.md

[support]: https://github.com/rehypejs/.github/blob/master/support.md

[coc]: https://github.com/rehypejs/.github/blob/master/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[rehype]: https://github.com/rehypejs/rehype
