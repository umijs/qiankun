# PostCSS Focus Visible [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[<img alt="npm version" src="https://img.shields.io/npm/v/postcss-focus-visible.svg" height="20">][npm-url]
[<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/focus-within-pseudo-class.svg" height="20">][css-url]
[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Focus Visible] lets you use the `:focus-visible` pseudo-class in
CSS, following the [Selectors Level 4 specification].

It is the companion to the [focus-visible polyfill].

[!['Can I use' table](https://caniuse.bitsofco.de/image/css-focus-visible.png)](https://caniuse.com/#feat=css-focus-visible)

```css
:focus:not(:focus-visible) {
  outline: none;
}

/* becomes */

:focus:not(.focus-visible) {
  outline: none;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

[PostCSS Focus Visible] duplicates rules using the `:focus-visible` pseudo-class
with a `.focus-visible` class selector, the same selector used by the
[focus-visible polyfill]. This replacement selector can be changed using the
`replaceWith` option. Also, the preservation of the original `:focus-visible`
rule can be disabled using the `preserve` option.

## Usage

Add [PostCSS Focus Visible] to your project:

```bash
npm install postcss-focus-visible --save-dev
```

Use [PostCSS Focus Visible] to process your CSS:

```js
const postcssFocusVisible = require('postcss-focus-visible');

postcssFocusVisible.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssFocusVisible = require('postcss-focus-visible');

postcss([
  postcssFocusVisible(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Focus Visible] runs in all Node environments, with special
instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option defines whether the original selector should remain. By
default, the original selector is preserved.

```js
focusVisible({ preserve: false });
```

```css
:focus:not(:focus-visible) {
  outline: none;
}

/* becomes */

:focus:not(.focus-visible) {
  outline: none;
}
```

### replaceWith

The `replaceWith` option defines the selector to replace `:focus-visible`. By
default, the replacement selector is `.focus-visible`.

```js
focusVisible({ replaceWith: '[focus-visible]' });
```

```css
:focus:not(:focus-visible) {
  outline: none;
}

/* becomes */

:focus:not([focus-visible]) {
  outline: none;
}

:focus:not(:focus-visible) {
  outline: none;
}
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#focus-visible-pseudo-class
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/postcss-focus-visible

[focus-visible polyfill]: https://github.com/WICG/focus-visible
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Focus Visible]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-focus-visible
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[Selectors Level 4 specification]: https://www.w3.org/TR/selectors-4/#the-focus-visible-pseudo
