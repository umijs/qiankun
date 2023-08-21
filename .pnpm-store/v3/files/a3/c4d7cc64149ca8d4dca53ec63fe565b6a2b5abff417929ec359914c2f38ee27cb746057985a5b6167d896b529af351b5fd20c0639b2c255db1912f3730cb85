# PostCSS Environment Variables [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[<img alt="NPM Version" src="https://img.shields.io/npm/v/postcss-env-function.svg" height="20">][npm-url]
[<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/environment-variables.svg" height="20">][css-url]
[<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/actions/workflows/test.yml/badge.svg" height="20">][cli-url]
[<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Environment Variables] lets you use `env()` variables in CSS, following the [CSS Environment Variables] specification.

```pcss
@media (max-width: env(--branding-small)) {
  body {
    padding: env(--branding-padding);
  }
}

/* becomes */

@media (min-width: 600px) {
  body {
    padding: 20px;
  }
}

/* when the `importFrom` option is: {
  "environmentVariables": {
    "--branding-small": "600px",
    "--branding-padding": "20px"
  }
} */
```

## Usage

Add [PostCSS Environment Variables] to your project:

```bash
npm install postcss postcss-env-function --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss')
const postcssEnvFunction = require('postcss-env-function')

postcss([
  postcssEnvFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */)
```

[PostCSS Environment Variables] runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### importFrom

The `importFrom` option specifies sources where Environment Variables can be imported from, which might be JS and JSON files, functions, and directly passed objects.

```js
postcssEnvFunction({
  importFrom: 'path/to/file.js' /* module.exports = {
      environmentVariables: {
        '--branding-padding': '20px',
        '--branding-small': '600px'
      }
    } */
})
```

```pcss
@media (max-width: env(--branding-small)) {
  body {
    padding: env(--branding-padding);
  }
}

/* becomes */

@media (min-width: 600px) {
  body {
    padding: 20px;
  }
}
```

Multiple sources can be passed into this option, and they will be parsed in the order they are received. JavaScript files, JSON files, functions, and objects will need to namespace Custom Properties using the `environmentVariables` or `environment-variables` key.

```js
postcssEnvFunction({
  importFrom: [
    /* Import from a CommonJS file:
    
    module.exports = {
      environmentVariables: {
        '--branding-padding': '20px'
      }
    } */
    'path/to/file.js',

    /* Import from a JSON file:

    {
      "environment-variables": {
        "--branding-padding": "20px"
      }
    } */
    'and/then/this.json',

    /* Import from an JavaScript Object: */
    {
      environmentVariables: { '--branding-padding': '20px' }
    },

    /* Import from a JavaScript Function: */
    () => {
      const environmentVariables = { '--branding-padding': '20px' }

      return { environmentVariables }
    }
  ]
})
```

See example imports written in [JS](test/import-variables.js) and [JSON](test/import-variables.json).
Currently only valid [custom property names] (beginning with `--`) are accepted.
Not all valid [declaration value names] are accepted.

### disableDeprecationNotice

Silence the deprecation notice that is printed to the console when using `importFrom``.

> postcss-env-function is deprecated and will be removed.
> Check the discussion on github for more details. https://github.com/csstools/postcss-plugins/discussions/192

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#environment-variables
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/postcss-env-function

[CSS Environment Variables]: https://drafts.csswg.org/css-env-1/
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Environment Variables]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-env-function

[custom property names]: https://drafts.csswg.org/css-variables-1/#typedef-custom-property-name
[declaration value names]: https://drafts.csswg.org/css-syntax-3/#typedef-declaration-value
