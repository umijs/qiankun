# Installing PostCSS HWB Function

[PostCSS HWB Function] runs in all Node environments, with special instructions for:

| [Node](#node) | [PostCSS CLI](#postcss-cli) | [Webpack](#webpack) | [Create React App](#create-react-app) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- | --- |

## Node

Add [PostCSS HWB Function] to your project:

```bash
npm install postcss @csstools/postcss-hwb-function --save-dev
```

Use it as a [PostCSS] plugin:

```js
const postcss = require('postcss');
const postcssHWBFunction = require('@csstools/postcss-hwb-function');

postcss([
	postcssHWBFunction(/* pluginOptions */)
]).process(YOUR_CSS /*, processOptions */);
```

## PostCSS CLI

Add [PostCSS CLI] to your project:

```bash
npm install postcss-cli @csstools/postcss-hwb-function --save-dev
```

Use [PostCSS HWB Function] in your `postcss.config.js` configuration file:

```js
const postcssHWBFunction = require('@csstools/postcss-hwb-function');

module.exports = {
	plugins: [
		postcssHWBFunction(/* pluginOptions */)
	]
}
```

## Webpack

_Webpack version 5_

Add [PostCSS Loader] to your project:

```bash
npm install postcss-loader @csstools/postcss-hwb-function --save-dev
```

Use [PostCSS HWB Function] in your Webpack configuration:

```js
module.exports = {
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: { importLoaders: 1 },
					},
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								plugins: [
									[
										"@csstools/postcss-hwb-function",
										{
											// Options
										},
									],
								],
							},
						},
					},
				],
			},
		],
	},
};
```

## Create React App

Add [React App Rewired] and [React App Rewire PostCSS] to your project:

```bash
npm install react-app-rewired react-app-rewire-postcss @csstools/postcss-hwb-function --save-dev
```

Use [React App Rewire PostCSS] and [PostCSS HWB Function] in your
`config-overrides.js` file:

```js
const reactAppRewirePostcss = require('react-app-rewire-postcss');
const postcssHWBFunction = require('@csstools/postcss-hwb-function');

module.exports = config => reactAppRewirePostcss(config, {
	plugins: () => [
		postcssHWBFunction(/* pluginOptions */)
	]
});
```

## Gulp

Add [Gulp PostCSS] to your project:

```bash
npm install gulp-postcss @csstools/postcss-hwb-function --save-dev
```

Use [PostCSS HWB Function] in your Gulpfile:

```js
const postcss = require('gulp-postcss');
const postcssHWBFunction = require('@csstools/postcss-hwb-function');

gulp.task('css', function () {
	var plugins = [
		postcssHWBFunction(/* pluginOptions */)
	];

	return gulp.src('./src/*.css')
		.pipe(postcss(plugins))
		.pipe(gulp.dest('.'));
});
```

## Grunt

Add [Grunt PostCSS] to your project:

```bash
npm install grunt-postcss @csstools/postcss-hwb-function --save-dev
```

Use [PostCSS HWB Function] in your Gruntfile:

```js
const postcssHWBFunction = require('@csstools/postcss-hwb-function');

grunt.loadNpmTasks('grunt-postcss');

grunt.initConfig({
	postcss: {
		options: {
			processors: [
			postcssHWBFunction(/* pluginOptions */)
			]
		},
		dist: {
			src: '*.css'
		}
	}
});
```

[Gulp PostCSS]: https://github.com/postcss/gulp-postcss
[Grunt PostCSS]: https://github.com/nDmitry/grunt-postcss
[PostCSS]: https://github.com/postcss/postcss
[PostCSS CLI]: https://github.com/postcss/postcss-cli
[PostCSS Loader]: https://github.com/postcss/postcss-loader
[PostCSS HWB Function]: https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-hwb-function
[React App Rewire PostCSS]: https://github.com/csstools/react-app-rewire-postcss
[React App Rewired]: https://github.com/timarney/react-app-rewired
