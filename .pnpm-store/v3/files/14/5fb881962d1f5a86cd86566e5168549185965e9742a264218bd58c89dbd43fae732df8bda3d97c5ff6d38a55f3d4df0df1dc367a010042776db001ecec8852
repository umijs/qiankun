# PostCSS Overflow Shorthand [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![CSS Standard Status][css-img]][css-url]
[![Build Status][cli-img]][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Overflow Shorthand] lets you use the `overflow` shorthand in CSS,
following the [CSS Overflow] specification.

[!['Can I use' table](https://caniuse.bitsofco.de/image/css-overflow.png)](https://caniuse.com/#feat=css-overflow)

```pcss
html {
  overflow: hidden auto;
}

/* becomes */

html {
  overflow-x: hidden;
  overflow-y: auto;
  overflow: hidden auto;
}
```

## Usage

Add [PostCSS Overflow Shorthand] to your project:

```bash
npm install postcss postcss-overflow-shorthand --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssOverflowShorthand = require('postcss-overflow-shorthand');

postcss([
  postcssOverflowShorthand(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Overflow Shorthand] runs in all Node environments, with special
instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option determines whether the original `overflow` declaration is
preserved. By default, it is preserved.

```js
postcssOverflowShorthand({ preserve: false })
```

```pcss
html {
  overflow: hidden auto;
}

/* becomes */

html {
  overflow-x: hidden;
  overflow-y: auto;
}
```

[cli-img]: https://github.com/csstools/postcss-plugins/workflows/test/badge.svg
[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-img]: https://cssdb.org/images/badges/overflow-property.svg
[css-url]: https://cssdb.org/#overflow-property
[discord]: https://discord.gg/bUadyRwkJS
[npm-img]: https://img.shields.io/npm/v/postcss-overflow-shorthand.svg
[npm-url]: https://www.npmjs.com/package/postcss-overflow-shorthand

[CSS Overflow]: https://drafts.csswg.org/css-overflow/#propdef-overflow
[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Overflow Shorthand]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-overflow-shorthand
