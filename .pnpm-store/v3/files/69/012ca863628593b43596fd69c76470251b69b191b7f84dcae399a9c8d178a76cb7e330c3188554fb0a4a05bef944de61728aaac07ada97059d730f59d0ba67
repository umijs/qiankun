# PostCSS Custom Properties [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS" width="90" height="90" align="right">][postcss]

[![NPM Version][npm-img]][npm-url]
[![CSS Standard Status][css-img]][css-url]
[![Build Status][cli-img]][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Custom Properties] lets you use Custom Properties in CSS, following
the [CSS Custom Properties] specification.

[!['Can I use' table](https://caniuse.bitsofco.de/image/css-variables.png)](https://caniuse.com/#feat=css-variables)

```pcss
:root {
  --color: red;
}

h1 {
  color: var(--color);
}

/* becomes */

:root {
  --color: red;
}

h1 {
  color: red;
  color: var(--color);
}
```

**Note:** This plugin only processes variables that are defined in the `:root` selector.

## Usage

Add [PostCSS Custom Properties] to your project:

```bash
npm install postcss-custom-properties --save-dev
```

Use [PostCSS Custom Properties] as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssCustomProperties = require('postcss-custom-properties');

postcss([
  postcssCustomProperties(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Custom Properties] runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option determines whether Custom Properties and properties using
custom properties should be preserved in their original form. By default, both
of these are preserved.

```js
postcssCustomProperties({
  preserve: false
});
```

```pcss
:root {
  --color: red;
}

h1 {
  color: var(--color);
}

/* becomes */

h1 {
  color: red;
}
```

### importFrom

The `importFrom` option specifies sources where Custom Properties can be imported
from, which might be CSS, JS, and JSON files, functions, and directly passed
objects.

```js
postcssCustomProperties({
  importFrom: 'path/to/file.css' // => :root { --color: red }
});
```

```pcss
h1 {
  color: var(--color);
}

/* becomes */

h1 {
  color: red;
}
```

Multiple sources can be passed into this option, and they will be parsed in the
order they are received. JavaScript files, JSON files, functions, and objects
will need to namespace Custom Properties using the `customProperties` or
`custom-properties` key.

```js
postcssCustomProperties({
  importFrom: [
    'path/to/file.css',   // :root { --color: red; }
    'and/then/this.js',   // module.exports = { customProperties: { '--color': 'red' } }
    'and/then/that.json', // { "custom-properties": { "--color": "red" } }
    {
      customProperties: { '--color': 'red' }
    },
    () => {
      const customProperties = { '--color': 'red' };

      return { customProperties };
    }
  ]
});
```

See example imports written in [CSS](test/import-properties.css),
[JS](test/import-properties.js), and [JSON](test/import-properties.json).

### overrideImportFromWithRoot

The `overrideImportFromWithRoot` option determines if properties added via `importFrom` are overridden by properties that exist in `:root`.
Defaults to `false`.

```js
postcssCustomProperties({
  overrideImportFromWithRoot: true
});
```

### exportTo

The `exportTo` option specifies destinations where Custom Properties can be exported
to, which might be CSS, JS, and JSON files, functions, and directly passed
objects.

```js
postcssCustomProperties({
  exportTo: 'path/to/file.css' // :root { --color: red; }
});
```

Multiple destinations can be passed into this option, and they will be parsed
in the order they are received. JavaScript files, JSON files, and objects will
need to namespace Custom Properties using the `customProperties` or
`custom-properties` key.

```js
const cachedObject = { customProperties: {} };

postcssCustomProperties({
  exportTo: [
    'path/to/file.css',   // :root { --color: red; }
    'and/then/this.js',   // module.exports = { customProperties: { '--color': 'red' } }
    'and/then/this.mjs',  // export const customProperties = { '--color': 'red' } }
    'and/then/that.json', // { "custom-properties": { "--color": "red" } }
    'and/then/that.scss', // $color: red;
    cachedObject,
    customProperties => {
      customProperties    // { '--color': 'red' }
    }
  ]
});
```

See example exports written to [CSS](test/export-properties.css),
[JS](test/export-properties.js), [MJS](test/export-properties.mjs),
[JSON](test/export-properties.json) and [SCSS](test/export-properties.scss).

### disableDeprecationNotice

Silence the deprecation notice that is printed to the console when using `importFrom` or `exportTo`.

> "importFrom" and "exportTo" will be removed in a future version of postcss-custom-properties.
> Check the discussion on github for more details. https://github.com/csstools/postcss-plugins/discussions/192

[cli-img]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg
[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-img]: https://cssdb.org/images/badges/custom-properties.svg
[css-url]: https://cssdb.org/#custom-properties
[discord]: https://discord.gg/bUadyRwkJS
[npm-img]: https://img.shields.io/npm/v/postcss-custom-properties.svg
[npm-url]: https://www.npmjs.com/package/postcss-custom-properties

[CSS Custom Properties]: https://www.w3.org/TR/css-variables-1/
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Custom Properties]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-properties
