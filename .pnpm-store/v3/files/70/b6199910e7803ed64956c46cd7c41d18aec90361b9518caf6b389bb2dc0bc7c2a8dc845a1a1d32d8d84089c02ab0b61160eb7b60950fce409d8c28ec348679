# Prefers Color Scheme [<img src="https://jonathantneal.github.io/js-logo.svg" alt="" width="90" height="90" align="right">][Prefers Color Scheme]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[Prefers Color Scheme] lets you use light and dark color schemes in all
browsers, following the [Media Queries] specification.

[!['Can I use' table](https://caniuse.bitsofco.de/image/prefers-color-scheme.png)](https://caniuse.com/#feat=prefers-color-scheme)

## Usage

From the command line, transform CSS files that use `prefers-color-scheme`
media queries:

```bash
npx css-prefers-color-scheme SOURCE.css TRANSFORMED.css
```

Next, use that transformed CSS with this script:

```html
<link rel="stylesheet" href="TRANSFORMED.css">
<script src="https://unpkg.com/css-prefers-color-scheme/dist/browser-global.js"></script>
<script>
colorScheme = initPrefersColorScheme('dark') // apply "dark" queries (you can change it afterward, too)
</script>
```

⚠️ Please use a versioned url, like this : `https://unpkg.com/css-prefers-color-scheme@6.0.0/dist/browser-global.js`
Without the version, you might unexpectedly get a new major version of the library with breaking changes.

⚠️ If you were using an older version via a CDN, please update the entire url.
The old URL will no longer work in a future release.

## Usage

- First, transform `prefers-color-scheme` queries using this
  [PostCSS plugin](README-POSTCSS.md).
- Next, apply light and dark color schemes everywhere using this
  [browser script](README-BROWSER.md).

---

## How does it work?

_This plugin used to work with `color-index` as detailed here : [color-index](https://github.com/csstools/css-prefers-color-scheme#how-does-it-work)._
_This is deprecated but will continue to work for now._
_`color` has better browser support and enables complex media queries._

[Prefers Color Scheme] uses a [PostCSS plugin](README-POSTCSS.md) to transform
`prefers-color-scheme` queries into `color` queries. This changes
`prefers-color-scheme: dark` into `(color: 48842621)`,
`prefers-color-scheme: light` into `(color: 70318723)`, and
`prefers-color-scheme: no-preference` into `(color: 22511989)`.

The frontend receives these `color` queries, which are understood in all
major browsers going back to Internet Explorer 9.
However, since browsers can only have a reasonably small number of bits per color,
our color scheme values are ignored.

[Prefers Color Scheme] uses a [browser script](README-BROWSER.md) to change
`(color: 48842621)` queries into `(max-color: 48842621)` in order to
activate “dark mode” specific CSS, and it changes `(color: 70318723)` queries
into `(max-color: 48842621)` to activate “light mode” specific CSS.

```css
@media (color: 70318723) { /* prefers-color-scheme: light */
  body {
    background-color: white;
    color: black;
  }
}
```

Since these media queries are accessible to `document.styleSheet`, no CSS
parsing is required.

## Why does the fallback work this way?

The value of `48` is chosen for dark mode because it is the keycode for `0`,
the hexidecimal value of black. Likewise, `70` is chosen for light mode because
it is the keycode for `f`, the hexidecimal value of white.
These are suffixed with a random large number.

[cli-img]: https://github.com/csstools/postcss-plugins/workflows/test/badge.svg
[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[discord]: https://discord.gg/bUadyRwkJS
[npm-img]: https://img.shields.io/npm/v/css-prefers-color-scheme.svg
[npm-url]: https://www.npmjs.com/package/css-prefers-color-scheme

[PostCSS]: https://github.com/postcss/postcss
[Prefers Color Scheme]: https://github.com/csstools/postcss-plugins/tree/main/plugins/css-prefers-color-scheme
[Media Queries]: https://drafts.csswg.org/mediaqueries-5/#descdef-media-prefers-color-scheme
