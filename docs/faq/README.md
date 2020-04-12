# FAQ

## `Application died in status LOADING_SOURCE_CODE: You need to export the functional lifecycles in xxx entry`

This error thrown as qiankun could not find the exported lifecycle method from your entry js.

To solve the exception, try the following steps:

1. check you have exported the specified lifecycles, see the [doc](/guide/getting-started.html#_1-exports-lifecycles-from-sub-app-entry)

2. check you have set the specified configuration with your bundler, see the [doc](/guide/getting-started.html#_2-config-sub-app-bundler)

3. check your `package.json` name field is unique between sub apps.

4. Check if the entry js in the sub-app's entry HTML is the last script to load. If not, move the order to make it be the last, or manually mark the entry js as `entry` in the HTML, such as:
   ```html {2}
   <script src="/antd.js"></script>
   <script src="/appEntry.js" entry></script>
   <script src="https://www.google.com/analytics.js"></script>
   ```

If it still not works after the steps above, this is usually due to browser compatibility issues. Try to **set the webpack `output.library` of the broken sub app the same with your main app registration for your app**, such as:

Such as here is the main configuration:

```ts {4}
// main app
registerMicroApps([
  {
    name: 'brokenSubApp',
    entry: '//localhost:7100',
    render,
    activeRule: genActiveRule('/react'),
  },
]);
```

Set the `output.library` the same with main app registration:

```js {4}
module.exports = {
  output: {
    // Keep the same with the registration in main app
    library: 'brokenSubApp',
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${packageName}`,
  },
};
```

## Vue Router Error - `Uncaught TypeError: Cannot redefine property: $router`

If you pass `{ sandbox: true }` to `start()` function, `qiankun` will use `Proxy` to isolate global `window` object for sub applications. When you access `window.Vue` in sub application's code，it will check whether the `Vue` property in the proxyed `window` object. If the property does not exist, it will look it up in the global `window` object and return it.

There are three lines code in the `vue-router` as followed, and it will access `window.Vue` once the `vue-router` module is loaded. And the `window.Vue` in following code is your master application's `Vue`.

```javascript
if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter)
}
```

To solve the error, choose one of the options listed below:

1. Use bundler to pack `Vue` library, instead of CDN or external module
2. Rename `Vue` to other name in master application, eg: `window.Vue2 = window.Vue; window.Vue = undefined`

## Why dynamic imported assets missing?

Two way to solve that:

### 1. With webpack live public path config

qiankun will inject a live public path variable before your sub app bootstrap, what you need is to add this code at the top of your sub app entry js:

```js
__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
```

For more details, check the [webpack doc](https://webpack.js.org/guides/public-path/#on-the-fly).

::: tip
Runtime publicPath addresses the problem of incorrect scripts, styles, images, and other addresses for dynamically loaded in sub application.
:::

### 2. With webpack static public path config

You need to set your publicPath configuration to an absolute url, and in development with webpack it might be:

```js
{
  output: {
    publicPath: `//localhost:${port}`;
  }
}
```

## Must a sub app asset support cors?

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

Yes.

However, the IE environment (browsers that do not support Proxy) can only use the single-instance pattern, where the `singular` configuration will be set `true` automatically.

You can find the singular usage [here](/api/#start-opts).

## Does qiankun support the subApp without bundler?

> Yes

The only change is that we need to declare a script tag, to export the `lifecycles`

example:

1. declare entry script

```diff
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Purehtml Example</title>
</head>
<body>
  <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
    Purehtml Example
  </div>
</body>

+ <script src="//yourhost/entry.js" entry></script>
</html>
```

2. export lifecycles in the entry

```javascript
const render = ($) => {
  $('#purehtml-container').html("Hello, render with jQuery");
  return Promise.resolve();
}

(global => {
  global['purehtml'] = {
    bootstrap: () => {
      console.log('purehtml bootstrap');
      return Promise.resolve();
    },
    mount: () => {
      console.log('purehtml mount');
      return render($)
    },
    unmount: () => {
      console.log('purehtml unmount');
      return Promise.resolve();
    },
  };
})(window);
```

refer to the [purehtml examples](https://github.com/umijs/qiankun/tree/master/examples/purehtml)

At the same time, [the subApp must support the CORS](/faq/#must-a-sub-app-asset-support-cors)
