# @qiankunjs/bundler-plugin

`@qiankunjs/bundler-plugin` prepares a micro-app HTML Entry for qiankun. The host does not install it.

The package provides separate Vite and Webpack plugins. Use the matching import path; the package does not auto-detect the bundler.

## Install

```bash
npm install --save-dev @qiankunjs/bundler-plugin@rc
```

It supports Vite 5 and later and Webpack 4 / 5. Both peer dependencies are optional, so install only the bundler your project uses.

## Exports

| Import path | Export | Purpose |
| --- | --- | --- |
| `@qiankunjs/bundler-plugin/vite` | `qiankun` (named and default) | Vite plugin |
| `@qiankunjs/bundler-plugin` | `QiankunWebpackPlugin` (named and default) | Webpack plugin |
| `@qiankunjs/bundler-plugin/webpack` | `QiankunWebpackPlugin` (named and default) | Explicit Webpack subpath |

## Vite

The Vite plugin is a zero-option function:

```ts
import { qiankun } from '@qiankunjs/bundler-plugin/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [qiankun()],
  server: { port: 7101, strictPort: true },
});
```

It has two observable effects:

- configures cross-origin response headers for the Vite dev and preview servers;
- marks the entry module script in built HTML.

The plugin takes no options and does not change micro-app lifecycle code. The entry module still exports `bootstrap`, `mount`, and `unmount`.

Development CORS configuration does not replace production server configuration. Deployed HTML, modules, and other assets must receive correct CORS and MIME headers from the real server or CDN.

See [Prepare a Vite app](/cookbook/prepare-a-vite-app) for the complete integration.

## Webpack

Use the Webpack plugin with `html-webpack-plugin` so it can produce an HTML Entry:

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { QiankunWebpackPlugin } = require('@qiankunjs/bundler-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new QiankunWebpackPlugin({ packageName: 'sub-app' }),
  ],
};
```

```ts
interface QiankunWebpackPluginOptions {
  packageName?: string;
}
```

| Option | Default | Description |
| --- | --- | --- |
| `packageName` | current `package.json` name | Global library name for the Classic build output. |

The plugin configures the output as a browser global library and marks the entry script in the document produced by `html-webpack-plugin`. Keep a stable package name, and pass `packageName` explicitly when it cannot be read from `package.json`.

The Webpack plugin does not configure dev-server CORS. Both development and production servers must let the host fetch HTML, scripts, and styles across origins.

See [Prepare a Webpack app](/cookbook/prepare-a-webpack-app) for the complete integration.

## Entry constraints

- An HTML Entry may contain at most one script with the `entry` attribute.
- Do not add another marker by hand after the plugin has marked the entry.
- The micro-app must export the [lifecycle contract](/concepts/lifecycle-and-props).
- Production assets must satisfy browser CORS, CSP, and MIME requirements.

See [HTML Entry and execution](/concepts/html-entry-loading) for how the loader consumes the result.
