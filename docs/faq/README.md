# FAQ

## `Application died in status LOADING_SOURCE_CODE: You need to export the functional lifecycles in xxx entry`

This error thrown as qiankun could not find the exported lifecycle method from your entry js.

To solve the exception, try the following steps:

1. check you have exported the specified lifecycles, see the [doc](https://github.com/umijs/qiankun#2-export-the-lifecycles-from-your-sub-app-entry)
2. check you have set the specified configuration with your bundler, see the [doc](https://github.com/umijs/qiankun#3-config-your-sub-app-bundler)
3. check your `package.json` name field is unique between sub apps.

If it still not works after the steps above, this is usually due to browser compatibility issues. Try to **set the name field in `package.json` of the broken sub app the same with your main app configuration**, such as:

```js
// main app
registerMicroApps([
  // the name is same with the name field of subapp's `package.json`
  { name: 'brokenSubApp', entry: '//localhost:7100', render, activeRule: genActiveRule('/react') },
]);
```

`package.json` of the broken sub app

```json
{
  "name": "brokenSubApp"
}
```

## Why dynamic imported assets missing?

Two way to solve that:

### 1. With webpack live public path config

qiankun will inject a live public path variable before your sub app bootstrap, what you need is to add this code at the top of your entry js

```js
__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
```

For more details, check the [webpack doc](https://webpack.js.org/guides/public-path/#on-the-fly)

### 2. With webpack static public path config

You need to set your publicPath configuration to an absolute url, and in development with webpack it might be:

```js
{
  output: {
    publicPath: `//localhost:${port}`;
  }
}
```

## Must a sub app asseta support cors?

Yes it is.

Since qiankun get assets which imported by sub app via fetch, these static resources must be required to support [cors](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

See [Enable Nginx Cors](https://enable-cors.org/server_nginx.html).

## How to guarantee the main app stylesheet isolated with sub apps?

Qiankun will isolate stylesheet between your sub apps automatically, you can manually ensure isolation between master and child applications. Such as add a prefix to all classes in the master application, and if you are using [ant-design](https://ant.design), you can follow [this doc](https://ant.design/docs/react/customize-theme) to make it works.

## How to make sub app to run independently?

Use the builtin global variable to identify the environment which provided by qiankun master:

```js
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export const mount = async () => render();
```

## Could I active two sub apps at the same time?

When the subapp should be active depends on your `activeRule` config, like the example below, we set `activeRule` logic the same between `reactApp` and `react15App`:

```js {2,3,7}
registerMicroApps([
  // define the activeRule by your self
  { name: 'reactApp', entry: '//localhost:7100', render, activeRule: () => window.isReactApp },
  { name: 'react15App', entry: '//localhost:7102', render, activeRule: () => window.isReactApp },
  { name: 'vue app', entry: '//localhost:7101', render, activeRule: () => window.isVueApp },
]);

start({ singular: false });
```

After setting `singular: false` in `start` method, `reactApp` and `react15App` should be active at the same time once `isReactApp` method returns `true`.

::: warning
Notice that no more than one application that relies on router can be displayed on the page at the same time, as the browser has only one url location, if there is more than one routing apps, it will definitely result in one of them to be 404 found.
:::

## How to extract the common library？

> Don’t share a runtime, even if all teams use the same framework. - [Micro Frontends](https://micro-frontends.org/)

Although sharing dependencies isn't a good idea, but if you really need it, you can external the common dependencies from sub apps and then import them in master app.

In the future qiankun will provide a smarter way to make it automatically.

## Does qiankun compatible with ie?

Not compatible now, will be supported if enough user appeal for.

If you have to support ie now actually, you could try to disable the `jsSandbox` to make your app work(but not guarantee correctly).
