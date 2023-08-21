# CSS Blank Pseudo [<img src="http://jonathantneal.github.io/js-logo.svg" alt="" width="90" height="90" align="right">][CSS Blank Pseudo]

[![NPM Version][npm-img]][npm-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[CSS Blank Pseudo] lets you style form elements when they are empty, following
the [Selectors Level 4] specification.

```css
input {
  /* style an input */
}

input:blank {
  /* style an input without a value */
}
```

## Usage

From the command line, transform CSS files that use `:blank` selectors:

```bash
npx css-blank-pseudo SOURCE.css --output TRANSFORMED.css
```

Next, use your transformed CSS with this script:

```html
<link rel="stylesheet" href="TRANSFORMED.css">
<script src="https://unpkg.com/css-blank-pseudo/dist/browser-global.js"></script>
<script>cssBlankPseudo(document)</script>
```

⚠️ Please use a versioned url, like this : `https://unpkg.com/css-blank-pseudo@3.0.0/dist/browser-global.js`
Without the version, you might unexpectedly get a new major version of the library with breaking changes.

⚠️ If you were using an older version via a CDN, please update the entire url.
The old URL will no longer work in a future release.

That’s it. The script works in most browsers.

## How it works

The [PostCSS plugin](README-POSTCSS.md) clones rules containing `:blank`,
replacing them with an alternative `[blank]` selector.

```css
input:blank {
  background-color: yellow;
}

/* becomes */

input[blank] {
  background-color: yellow;
}

input:blank {
  background-color: yellow;
}
```

Next, the [JavaScript library](README-BROWSER.md) adds a `blank` attribute to
elements otherwise matching `:blank` natively.

```html
<input value="" blank>
<input value="This element has a value">
```

## ⚠️ `:not(:blank)`

with option : `preserve` `true`

```css
input:not(:blank) {
  background-color: yellow;
}

/* becomes */

input:not([blank]) {
  background-color: yellow;
}

input:not(:blank) {
  background-color: yellow;
}
```

When you do not include the JS polyfill one will always match in browsers that support `:blank` natively.
In browsers that do not support `:blank` natively the rule will be invalid.

_currently no browsers support `:blank`_


[discord]: https://discord.gg/bUadyRwkJS
[npm-img]: https://img.shields.io/npm/v/css-blank-pseudo.svg
[npm-url]: https://www.npmjs.com/package/css-blank-pseudo

[CSS Blank Pseudo]: https://github.com/csstools/postcss-plugins/tree/main/plugins/css-blank-pseudo
[PostCSS Preset Env]: https://preset-env.cssdb.org/
[Selectors Level 4]: https://drafts.csswg.org/selectors-4/#blank
