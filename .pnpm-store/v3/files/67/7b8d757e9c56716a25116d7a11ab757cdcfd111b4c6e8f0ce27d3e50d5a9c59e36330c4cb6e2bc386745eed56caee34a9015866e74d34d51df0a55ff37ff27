[![SWUbanner](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)

<div align="center">

<img alt="" width="300" src="./media/logo.svg" />
<h1>Fork TS Checker Webpack Plugin</h1>
<p>Webpack plugin that runs TypeScript type checker on a separate process.</p>

[![npm version](https://img.shields.io/npm/v/fork-ts-checker-webpack-plugin.svg)](https://www.npmjs.com/package/fork-ts-checker-webpack-plugin)
[![build status](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/workflows/CI/CD/badge.svg?branch=main&event=push)](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/actions?query=branch%3Amain+event%3Apush)
[![downloads](http://img.shields.io/npm/dm/fork-ts-checker-webpack-plugin.svg)](https://npmjs.org/package/fork-ts-checker-webpack-plugin)
[![commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

</div>

## Features

 * Speeds up [TypeScript](https://github.com/Microsoft/TypeScript) type checking (by moving it to a separate process) 🏎
 * Supports modern TypeScript features like [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) and [incremental mode](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#faster-subsequent-builds-with-the---incremental-flag) ✨
 * Displays nice error messages with the [code frame](https://babeljs.io/docs/en/next/babel-code-frame.html) formatter 🌈

## Installation

This plugin requires **Node.js >=12.13.0+**, **Webpack ^5.11.0**, **TypeScript ^3.6.0**

* If you depend on **TypeScript 2.1 - 2.6.2**, please use [version 4](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/tree/v4.1.4) of the plugin.
* If you depend on **Webpack 4**, **TypeScript 2.7 - 3.5.3** or **ESLint** feature, please use [version 6](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/tree/v6.2.6) of the plugin.
* If you need Vue.js support, please use [version 6](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/tree/v6.5.2) of ths plugin

```sh
# with npm
npm install --save-dev fork-ts-checker-webpack-plugin

# with yarn
yarn add --dev fork-ts-checker-webpack-plugin
```

The minimal webpack config (with [ts-loader](https://github.com/TypeStrong/ts-loader))

```js
// webpack.config.js
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  context: __dirname, // to automatically find tsconfig.json
  entry: './src/index.ts',
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        // add transpileOnly option if you use ts-loader < 9.3.0 
        // options: {
        //   transpileOnly: true
        // }
      }
    ]
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
  watchOptions: {
    // for some systems, watching many files can result in a lot of CPU or memory usage
    // https://webpack.js.org/configuration/watch/#watchoptionsignored
    // don't use this pattern, if you have a monorepo with linked packages
    ignored: /node_modules/,
  },
};
```

> Examples how to configure it with [babel-loader](https://github.com/babel/babel-loader), [ts-loader](https://github.com/TypeStrong/ts-loader)
> and [Visual Studio Code](https://code.visualstudio.com/) are in the [**examples**](./examples) directory.

## Modules resolution

It's very important to be aware that **this plugin uses [TypeScript](https://github.com/Microsoft/TypeScript)'s, not
[webpack](https://github.com/webpack/webpack)'s modules resolution**. It means that you have to setup `tsconfig.json` correctly.

> It's because of the performance - with TypeScript's module resolution we don't have to wait for webpack to compile files.
>
> To debug TypeScript's modules resolution, you can use `tsc --traceResolution` command.

## Options

This plugin uses [`cosmiconfig`](https://github.com/davidtheclark/cosmiconfig). This means that besides the plugin constructor,
you can place your configuration in the:
 * `"fork-ts-checker"` field in the `package.json`
 * `.fork-ts-checkerrc` file in JSON or YAML format
 * `fork-ts-checker.config.js` file exporting a JS object

Options passed to the plugin constructor will overwrite options from the cosmiconfig (using [deepmerge](https://github.com/TehShrike/deepmerge)).

| Name         | Type                                 | Default value                             | Description                                                                                                                                                                                                                                                                                                                   |
|--------------|--------------------------------------|-------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `async`      | `boolean`                            | `compiler.options.mode === 'development'` | If `true`, reports issues **after** webpack's compilation is done. Thanks to that it doesn't block the compilation. Used only in the `watch` mode.                                                                                                                                                                            |
| `typescript` | `object`                             | `{}`                                      | See [TypeScript options](#typescript-options).                                                                                                                                                                                                                                                                                |
| `issue`      | `object`                             | `{}`                                      | See [Issues options](#issues-options).                                                                                                                                                                                                                                                                                        |
| `formatter`  | `string` or `object` or `function`   | `codeframe`                               | Available formatters are `basic`, `codeframe` and a custom `function`. To [configure](https://babeljs.io/docs/en/babel-code-frame#options) `codeframe` formatter, pass: `{ type: 'codeframe', options: { <coderame options> } }`. To use absolute file path, pass: `{ type: 'codeframe', pathType: 'absolute' }`. |
| `logger`     | `{ log: function, error: function }` or `webpack-infrastructure` | `console`     | Console-like object to print issues in `async` mode.                                                                                                                                                                                                                                                                          |
| `devServer`  | `boolean`                            | `true`                                    | If set to `false`, errors will not be reported to Webpack Dev Server.                                                                                                                                                                                                                                                         |

### TypeScript options

Options for the TypeScript checker (`typescript` option object).

| Name                | Type                                                                           | Default value                                                                                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
|---------------------|--------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `memoryLimit`       | `number`                                                                       | `2048`                                                                                                         | Memory limit for the checker process in MB. If the process exits with the allocation failed error, try to increase this number.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `configFile`        | `string`                                                                       | `'tsconfig.json'`                                                                                              | Path to the `tsconfig.json` file (path relative to the `compiler.options.context` or absolute path)                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `configOverwrite`   | `object`                                                                       | `{ compilerOptions: { skipLibCheck: true, sourceMap: false, inlineSourceMap: false, declarationMap: false } }` | This configuration will overwrite configuration from the `tsconfig.json` file. Supported fields are: `extends`, `compilerOptions`, `include`, `exclude`, `files`, and `references`.                                                                                                                                                                                                                                                                                                                                                                                            |
| `context`           | `string`                                                                       | `dirname(configuration.configFile)`                                                                            | The base path for finding files specified in the `tsconfig.json`. Same as the `context` option from the [ts-loader](https://github.com/TypeStrong/ts-loader#context). Useful if you want to keep your `tsconfig.json` in an external package. Keep in mind that **not** having a `tsconfig.json` in your project root can cause different behaviour between `fork-ts-checker-webpack-plugin` and `tsc`. When using editors like `VS Code` it is advised to add a `tsconfig.json` file to the root of the project and extend the config file referenced in option `configFile`. |
| `build`             | `boolean`                                                                      | `false`                                                                                                        | The equivalent of the `--build` flag for the `tsc` command.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `mode`              | `'readonly'` or `'write-dts'` or `'write-tsbuildinfo'` or `'write-references'` | `build === true ? 'write-tsbuildinfo' ? 'readonly'`                                                            | Use `readonly` if you don't want to write anything on the disk, `write-dts` to write only `.d.ts` files, `write-tsbuildinfo` to write only `.tsbuildinfo` files, `write-references` to write both `.js` and `.d.ts` files of project references (last 2 modes requires `build: true`).                                                                                                                                                                                                                                                                                         |
| `diagnosticOptions` | `object`                                                                       | `{ syntactic: false, semantic: true, declaration: false, global: false }`                                      | Settings to select which diagnostics do we want to perform.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `profile`           | `boolean`                                                                      | `false`                                                                                                        | Measures and prints timings related to the TypeScript performance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `typescriptPath`    | `string`                                                                       | `require.resolve('typescript')`                                                                                | If supplied this is a custom path where TypeScript can be found.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

### Issues options

Options for the issues filtering (`issue` option object).
I could write some plain text explanation of these options but I think code will explain it better:

```typescript
interface Issue {
  severity: 'error' | 'warning';
  code: string;
  file?: string;
}

type IssueMatch = Partial<Issue>; // file field supports glob matching
type IssuePredicate = (issue: Issue) => boolean;
type IssueFilter = IssueMatch | IssuePredicate | (IssueMatch | IssuePredicate)[];
```

| Name      | Type          | Default value | Description                                                                                                                                                |
|-----------|---------------|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `include` | `IssueFilter` | `undefined`   | If `object`, defines issue properties that should be [matched](src/issue/issue-match.ts). If `function`, acts as a predicate where `issue` is an argument. |
| `exclude` | `IssueFilter` | `undefined`   | Same as `include` but issues that match this predicate will be excluded.                                                                                   |

<details>
<summary>Expand example</summary>

Include issues from the `src` directory, exclude issues from `.spec.ts` files:

```js
module.exports = {
  // ...the webpack configuration
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      issue: {
        include: [
          { file: '**/src/**/*' }
        ],
        exclude: [
          { file: '**/*.spec.ts' }
        ]
      }
    })
  ]
};
```

</details>

## Plugin hooks

This plugin provides some custom webpack hooks:

| Hook key   | Type                       | Params                | Description                                                                                                                                                        |
|------------|----------------------------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `start`    | `AsyncSeriesWaterfallHook` | `change, compilation` | Starts issues checking for a compilation. It's an async waterfall hook, so you can modify the list of changed and removed files or delay the start of the service. |
| `waiting`  | `SyncHook`                 | `compilation`         | Waiting for the issues checking.                                                                                                                                   |
| `canceled` | `SyncHook`                 | `compilation`         | Issues checking for the compilation has been canceled.                                                                                                             |
| `error`    | `SyncHook`                 | `compilation`         | An error occurred during issues checking.                                                                                                                          |
| `issues`   | `SyncWaterfallHook`        | `issues, compilation` | Issues have been received and will be reported. It's a waterfall hook, so you can modify the list of received issues.                                              |

To access plugin hooks and tap into the event, we need to use the `getCompilerHooks` static method.
When we call this method with a [webpack compiler instance](https://webpack.js.org/api/node/), it returns the object with
[tapable](https://github.com/webpack/tapable) hooks where you can pass in your callbacks.

```js
// ./src/webpack/MyWebpackPlugin.js
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

class MyWebpackPlugin {
  apply(compiler) {
    const hooks = ForkTsCheckerWebpackPlugin.getCompilerHooks(compiler);

    // log some message on waiting
    hooks.waiting.tap('MyPlugin', () => {
      console.log('waiting for issues');
    });
    // don't show warnings
    hooks.issues.tap('MyPlugin', (issues) =>
      issues.filter((issue) => issue.severity === 'error')
    );
  }
}

module.exports = MyWebpackPlugin;

// webpack.config.js
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MyWebpackPlugin = require('./src/webpack/MyWebpackPlugin');

module.exports = {
  /* ... */
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new MyWebpackPlugin()
  ]
};
```

## Profiling types resolution

When using TypeScript 4.3.0 or newer you can profile long type checks by
setting "generateTrace" compiler option. This is an instruction from [microsoft/TypeScript#40063](https://github.com/microsoft/TypeScript/pull/40063):

1. Set "generateTrace": "{folderName}" in your `tsconfig.json` (under `compilerOptions`)
2. Look in the resulting folder. If you used build mode, there will be a `legend.json` telling you what went where.
   Otherwise, there will be `trace.json` file and `types.json` files.
3. Navigate to [edge://tracing](edge://tracing) or [chrome://tracing](chrome://tracing) and load `trace.json`
4. Expand Process 1 with the little triangle in the left sidebar
5. Click on different blocks to see their payloads in the bottom pane
6. Open `types.json` in an editor
7. When you see a type ID in the tracing output, go-to-line {id} to find data about that type

## Enabling incremental mode

You must both set "incremental": true in your `tsconfig.json` (under `compilerOptions`) and also specify mode: 'write-references' in `ForkTsCheckerWebpackPlugin` settings.


## Related projects

 * [`ts-loader`](https://github.com/TypeStrong/ts-loader) - TypeScript loader for webpack.
 * [`babel-loader`](https://github.com/babel/babel-loader) - Alternative TypeScript loader for webpack.
 * [`fork-ts-checker-notifier-webpack-plugin`](https://github.com/johnnyreilly/fork-ts-checker-notifier-webpack-plugin) - Notifies about build status using system notifications (similar to the [webpack-notifier](https://github.com/Turbo87/webpack-notifier)).

## Credits

This plugin was created in [Realytics](https://www.realytics.io/) in 2017. Thank you for supporting Open Source.

## License

MIT License

