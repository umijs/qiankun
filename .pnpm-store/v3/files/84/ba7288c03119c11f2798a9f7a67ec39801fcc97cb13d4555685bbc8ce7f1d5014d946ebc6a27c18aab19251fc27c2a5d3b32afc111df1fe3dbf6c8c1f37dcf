# CSS Has Pseudo [<img src="http://jonathantneal.github.io/js-logo.svg" alt="" width="90" height="90" align="right">][CSS Has Pseudo]

[![NPM Version][npm-img]][npm-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[CSS Has Pseudo] lets you style elements relative to other elements in CSS,
following the [Selectors Level 4] specification.

[!['Can I use' table](https://caniuse.bitsofco.de/image/css-has.png)](https://caniuse.com/#feat=css-has)

```css
a:has(> img) {
  /* style links that contain an image */
}

h1:has(+ p) {
  /* style level 1 headings that are followed by a paragraph */
}

section:not(:has(h1, h2, h3, h4, h5, h6)) {
  /* style sections that don’t contain any heading elements */
}

body:has(:focus) {
  /* style the body if it contains a focused element */
}
```

## Usage

From the command line, transform CSS files that use `:has` selectors:

```bash
npx css-has-pseudo SOURCE.css --output TRANSFORMED.css
```

Next, use your transformed CSS with this script:

```html
<link rel="stylesheet" href="TRANSFORMED.css">
<script src="https://unpkg.com/css-has-pseudo/dist/browser-global.js"></script>
<script>cssHasPseudo(document)</script>
```

⚠️ Please use a versioned url, like this : `https://unpkg.com/css-has-pseudo@3.0.0/dist/browser-global.js`
Without the version, you might unexpectedly get a new major version of the library with breaking changes.

⚠️ If you were using an older version via a CDN, please update the entire url.
The old URL will no longer work in a future release.

That’s it. The script is 765 bytes and works in most browser versions, including
Internet Explorer 11. With a [Mutation Observer polyfill], the script will work
down to Internet Explorer 9.

See [README BROWSER](README-BROWSER.md) for more information.

## How it works

The [PostCSS plugin](README-POSTCSS.md) clones rules containing `:has`,
replacing them with an alternative `[:has]` selector.

```css
body:has(:focus) {
  background-color: yellow;
}

section:not(:has(h1, h2, h3, h4, h5, h6)) {
  background-color: gray;
}

/* becomes */

body[\:has\(\:focus\)] {
  background-color: yellow;
}

body:has(:focus) {
  background-color: yellow;
}

section[\:not-has\(h1\,\%20h2\,\%20h3\,\%20h4\,\%20h5\,\%20h6\)] {
  background-color: gray;
}

section:not(:has(h1, h2, h3, h4, h5, h6)) {
  background-color: gray;
}
```

Next, the [JavaScript library](README-BROWSER.md) adds a `[:has]` attribute to
elements otherwise matching `:has` natively.

```html
<body :has(:focus)>
  <input value="This element is focused">
</body>
```

[discord]: https://discord.gg/bUadyRwkJS
[npm-img]: https://img.shields.io/npm/v/css-has-pseudo.svg
[npm-url]: https://www.npmjs.com/package/css-has-pseudo

[CSS Has Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/plugins/css-has-pseudo
[Mutation Observer polyfill]: https://github.com/webmodules/mutation-observer
[Selectors Level 4]: https://drafts.csswg.org/selectors-4/#has-pseudo
