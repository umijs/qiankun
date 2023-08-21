# PostCSS Custom Selectors [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[<img alt="npm version" src="https://img.shields.io/npm/v/postcss-custom-selectors.svg" height="20">][npm-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/custom-selectors.svg" height="20">][css-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Custom Selectors] lets you define `@custom-selector` in CSS following the [Custom Selectors Specification].

```pcss
@custom-selector :--heading h1, h2, h3;

article :--heading + p {
	margin-top: 0;
}

/* becomes */

article h1 + p,article h2 + p,article h3 + p {
	margin-top: 0;
}
```

## Usage

Add [PostCSS Custom Selectors] to your project:

```bash
npm install postcss postcss-custom-selectors --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssCustomSelectors = require('postcss-custom-selectors');

postcss([
	postcssCustomSelectors(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Custom Selectors] runs in all Node environments, with special
instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is not preserved.

```js
postcssCustomSelectors({ preserve: true })
```

```pcss
@custom-selector :--heading h1, h2, h3;

article :--heading + p {
	margin-top: 0;
}

/* becomes */

@custom-selector :--heading h1, h2, h3;

article h1 + p,article h2 + p,article h3 + p {
	margin-top: 0;
}

article :--heading + p {
	margin-top: 0;
}
```

### importFrom

The `importFrom` option specifies sources where custom selectors can be
imported from, which might be CSS, JS, and JSON files, functions, and directly
passed objects.

```js
postcssCustomSelectors({
	importFrom: 'path/to/file.css' // => @custom-selector :--heading h1, h2, h3;
});
```

```pcss
article :--heading + p {
	margin-top: 0;
}

/* becomes */

article h1 + p, article h2 + p, article h3 + p {}
```

Multiple sources can be passed into this option, and they will be parsed in the
order they are received. JavaScript files, JSON files, functions, and objects
will need to namespace custom selectors using the `customProperties` or
`custom-properties` key.

```js
postcssCustomSelectors({
	importFrom: [
		'path/to/file.css',
		'and/then/this.js',
		'and/then/that.json',
		{
			customSelectors: { ':--heading': 'h1, h2, h3' }
		},
		() => {
			const customProperties = { ':--heading': 'h1, h2, h3' };

			return { customProperties };
		}
	]
});
```

### exportTo

The `exportTo` option specifies destinations where custom selectors can be
exported to, which might be CSS, JS, and JSON files, functions, and directly
passed objects.

```js
postcssCustomSelectors({
	exportTo: 'path/to/file.css' // @custom-selector :--heading h1, h2, h3;
});
```

Multiple destinations can be passed into this option, and they will be parsed
in the order they are received. JavaScript files, JSON files, and objects will
need to namespace custom selectors using the `customProperties` or
`custom-properties` key.

```js
const cachedObject = { customSelectors: {} };

postcssCustomSelectors({
	exportTo: [
		'path/to/file.css',   // @custom-selector :--heading h1, h2, h3;
		'and/then/this.js',   // module.exports = { customSelectors: { ':--heading': 'h1, h2, h3' } }
		'and/then/this.mjs',  // export const customSelectors = { ':--heading': 'h1, h2, h3' } }
		'and/then/that.json', // { "custom-selectors": { ":--heading": "h1, h2, h3" } }
		cachedObject,
		customProperties => {
			customProperties    // { ':--heading': 'h1, h2, h3' }
		}
	]
});
```

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#custom-selectors
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/postcss-custom-selectors

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Custom Selectors]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-selectors
[Custom Selectors Specification]: https://drafts.csswg.org/css-extensions/#custom-selectors
