# PostCSS Custom Media [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][postcss]

[<img alt="npm version" src="https://img.shields.io/npm/v/postcss-custom-media.svg" height="20">][npm-url] [<img alt="CSS Standard Status" src="https://cssdb.org/images/badges/custom-media-queries.svg" height="20">][css-url] [<img alt="Build Status" src="https://github.com/csstools/postcss-plugins/workflows/test/badge.svg" height="20">][cli-url] [<img alt="Discord" src="https://shields.io/badge/Discord-5865F2?logo=discord&logoColor=white">][discord]

[PostCSS Custom Media] lets you define `@custom-media` in CSS following the [Custom Media Specification].

```pcss
@custom-media --small-viewport (max-width: 30em);

@media (--small-viewport) {
	/* styles for small viewport */
}

/* becomes */

@media (max-width: 30em) {
	/* styles for small viewport */
}
```

## Usage

Add [PostCSS Custom Media] to your project:

```bash
npm install postcss postcss-custom-media --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssCustomMedia = require('postcss-custom-media');

postcss([
	postcssCustomMedia(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

[PostCSS Custom Media] runs in all Node environments, with special
instructions for:

| [Node](INSTALL.md#node) | [PostCSS CLI](INSTALL.md#postcss-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### preserve

The `preserve` option determines whether the original notation
is preserved. By default, it is not preserved.

```js
postcssCustomMedia({ preserve: true })
```

```pcss
@custom-media --small-viewport (max-width: 30em);

@media (--small-viewport) {
	/* styles for small viewport */
}

/* becomes */

@custom-media --small-viewport (max-width: 30em);

@media (max-width: 30em) {
	/* styles for small viewport */
}

@media (--small-viewport) {
	/* styles for small viewport */
}
```


### importFrom

The `importFrom` option specifies sources where custom media can be imported
from, which might be CSS, JS, and JSON files, functions, and directly passed
objects.

```js
postcssCustomMedia({
	importFrom: 'path/to/file.css' // => @custom-selector --small-viewport (max-width: 30em);
});
```

```pcss
@media (max-width: 30em) {
	/* styles for small viewport */
}

@media (--small-viewport) {
	/* styles for small viewport */
}
```

Multiple sources can be passed into this option, and they will be parsed in the
order they are received. JavaScript files, JSON files, functions, and objects
will need to namespace custom media using the `customMedia` or
`custom-media` key.

```js
postcssCustomMedia({
	importFrom: [
		'path/to/file.css',
		'and/then/this.js',
		'and/then/that.json',
		{
			customMedia: { '--small-viewport': '(max-width: 30em)' }
		},
		() => {
			const customMedia = { '--small-viewport': '(max-width: 30em)' };

			return { customMedia };
		}
	]
});
```

### exportTo

The `exportTo` option specifies destinations where custom media can be exported
to, which might be CSS, JS, and JSON files, functions, and directly passed
objects.

```js
postcssCustomMedia({
	exportTo: 'path/to/file.css' // @custom-media --small-viewport (max-width: 30em);
});
```

Multiple destinations can be passed into this option, and they will be parsed
in the order they are received. JavaScript files, JSON files, and objects will
need to namespace custom media using the `customMedia` or
`custom-media` key.

```js
const cachedObject = { customMedia: {} };

postcssCustomMedia({
	exportTo: [
		'path/to/file.css',   // @custom-media --small-viewport (max-width: 30em);
		'and/then/this.js',   // module.exports = { customMedia: { '--small-viewport': '(max-width: 30em)' } }
		'and/then/this.mjs',  // export const customMedia = { '--small-viewport': '(max-width: 30em)' } }
		'and/then/that.json', // { "custom-media": { "--small-viewport": "(max-width: 30em)" } }
		cachedObject,
		customMedia => {
			customMedia    // { '--small-viewport': '(max-width: 30em)' }
		}
	]
});
```

See example exports written to [CSS](test/export-media.css),
[JS](test/export-media.js), [MJS](test/export-media.mjs), and
[JSON](test/export-media.json).

[cli-url]: https://github.com/csstools/postcss-plugins/actions/workflows/test.yml?query=workflow/test
[css-url]: https://cssdb.org/#custom-media-queries
[discord]: https://discord.gg/bUadyRwkJS
[npm-url]: https://www.npmjs.com/package/postcss-custom-media

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS Custom Media]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media
[Custom Media Specification]: https://www.w3.org/TR/mediaqueries-5/#at-ruledef-custom-media
