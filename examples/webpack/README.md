# webpack-app

A React 19 + webpack 5 micro app demonstrating qiankun's classic (non-ESM) loading path.

`QiankunWebpackPlugin` from `@qiankunjs/bundler-plugin` sets `output.library { name, type: 'window' }`,
so the entry module's `bootstrap` / `mount` / `unmount` exports land on `window['webpack-app']`,
and marks the html entry script with the `entry` attribute for qiankun to pick up.

## Run

```bash
pnpm dev    # serves on http://localhost:7102
pnpm build  # production build
```

Open it standalone at `//localhost:7102`, or via the main example app on port 7099.
