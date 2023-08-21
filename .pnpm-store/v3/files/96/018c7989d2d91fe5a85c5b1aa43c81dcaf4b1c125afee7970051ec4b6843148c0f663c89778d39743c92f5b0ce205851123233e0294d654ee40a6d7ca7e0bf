# PostCSS Focus Within [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[<img alt="npm version" src="https://img.shields.io/npm/v/postcss-focus-within.svg" height="20">][npm-url]
[<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/focus-within-pseudo-class.svg" height="20">][css-url]
[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/tree/main/postcss-focus-within/workflows/test/badge.svg" height="20">][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Focus Within] lets you use the `:focus-within` pseudo-class in CSS,
following the [Selectors Level 4 specification].

It is the companion to the [focus-within polyfill].

[!['Can I use' table](https://caniuse.bitsofco.de/image/css-focus-within.png)](https://caniuse.com/#feat=css-focus-within)

```css
.my-form-field:focus-within label {
  background-color: yellow;
}

/* becomes */

.my-form-field[focus-within] label {
  background-color: yellow;
}

.my-form-field:focus-within label {
  background-color: yellow;
}
```

[PostCSS Focus Within] duplicates rules using the `:focus-within` pseudo-class
with a `[focus-within]` attribute selector, the same selector used by the
[focus-within polyfill]. This replacement selector can be changed using the
`replaceWith` option. Also, the preservation of the original `:focus-within`
rule can be disabled using the `preserve` option.

## Usage

Add [PostCSS Focus Within] to your project:

```bash
npm install postcss postcss-focus-within --save-dev
```

Use [PostCSS Focus Within] to process your CSS:

```js
const postcssFocusWithin = require('postcss-focus-within');

postcssFocusWithin.process(YOUR_CSS /*, processOptions, pluginOptions */);
```

Or use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssFocusWithin = require('postcss-focus-within');

postcss([
  postcssFocusWithin(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Focus Within] runs in all Node environments, with special
instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option defines whether the original selector should remain. By
default, the original selector is preserved.

```js
focusWithin({ preserve: false });
```

```css
.my-form-field:focus-within label {
  background-color: yellow;
}

/* becomes */

.my-form-field[focus-within] label {
  background-color: yellow;
}
```

### replaceWith

The `replaceWith` option defines the selector to replace `:focus-within`. By
default, the replacement selector is `[focus-within]`.

```js
focusWithin({ replaceWith: '.focus-within' });
```

```css
.my-form-field:focus-within label {
  background-color: yellow;
}

/* becomes */

.my-form-field.focus-within label {
  background-color: yellow;
}

.my-form-field:focus-within label {
  background-color: yellow;
}
```

[css-url]: https://cssdb.org/#focus-within-pseudo-class
[cli-url]: https://github.com/csstools/postcss-plugins/tree/main/postcss-focus-within/actions/workflows/test.yml?query=workflow/test
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/postcss-focus-within

[focus-within polyfill]: https://github.com/jsxtools/focus-within
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Focus Within]: https://github.com/csstools/postcss-plugins/tree/main/postcss-focus-within
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[Selectors Level 4 specification]: https://www.w3.org/TR/selectors-4/#the-focus-within-pseudo
