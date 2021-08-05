---
nav:
  title: FAQ
toc: menu
---

# FAQ

## `Application died in status LOADING_SOURCE_CODE: You need to export the functional lifecycles in xxx entry`

This error thrown as qiankun could not find the exported lifecycle method from your entry js.

To solve the exception, try the following steps:

1. check you have exported the specified lifecycles, see the [doc](/guide/getting-started#1-exports-lifecycles-from-sub-app-entry)

2. check you have set the specified configuration with your bundler, see the [doc](/guide/getting-started#2-config-sub-app-bundler)

3. Check the webpack of micro app whether it configured with `output.globalObject` or not, be sure its value was `window` if it had, or remove it to use default value.

4. Check your `package.json` name field is unique between sub apps.

5. Check if the entry js in the sub-app's entry HTML is the last script to load. If not, move the order to make it be the last, or manually mark the entry js as `entry` in the HTML, such as:

   ```html {2}
   <script src="/antd.js"></script>
   <script src="/appEntry.js" entry></script>
   <script src="https://www.google.com/analytics.js"></script>
   ```

6. If the development environment is OK but the production environment is not, check whether the `index.html` and `entry js` of the micro app are returned normally, for example, `404.html` is returned.

7. If you're using webpack5, please see [here](https://github.com/umijs/qiankun/issues/1092) If it still not works after the steps above, this is usually due to browser compatibility issues. Try to **set the webpack `output.library` of the broken sub app the same with your main app registration for your app**, such as:

Such as here is the main configuration:

```ts {4}
// main app
registerMicroApps([
  {
    name: 'brokenSubApp',
    entry: '//localhost:7100',
    container: '#yourContainer',
    activeRule: '/react',
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

## `Application died in status NOT_MOUNTED: Target container with #container not existed after xxx mounted!`

This error thrown as the container DOM does not exist after the micro app is loaded. The possible reasons are:

1. The root id of the micro app conflicts with other DOM, and the solution is to modify the search range of the root id.

   `vue` micro app:

   ```js
   function render(props = {}) {
     const { container } = props;
     instance = new Vue({
       router,
       store,
       render: (h) => h(App),
     }).$mount(container ? container.querySelector('#app') : '#app');
   }
   export async function mount(props) {
     render(props);
   }
   ```

   `react` micro app：

   ```js
   function render(props) {
     const { container } = props;
     ReactDOM.render(<App />, container ? container.querySelector('#root') : document.querySelector('#root'));
   }
   export async function mount(props) {
     render(props);
   }
   export async function unmount(props) {
     const { container } = props;
     ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
   }
   ```

2. Some js of micro app use `document.write`, such as AMAP 1.x version, Tencent Map 2.x version.

   If it is caused by the map js, see if the upgrade can be resolved, for example, upgrade the AMAP map to version 2.x.

   If the upgrade cannot be resolved, it is recommended to put the map on the main app to load. The micro app also introduces this map js (used in run independently), but add the `ignore` attribute to the `<script>` tag:

   ```html
   <script src="https://map.qq.com/api/gljs?v=1.exp" ignore></script>
   ```

   In other cases, please do not use `document.write`.

## `Application died in status NOT_MOUNTED: Target container with #container not existed while xxx mounting!`

This error usually occurs when the main app is Vue, and the container is written on a routing page and uses the routing transition effect. Some special transition effect caused the container not to exist in the mounting process of the micro app. The solution is to use other transition effects, or remove the routing transition.

## `Application died in status NOT_MOUNTED: Target container with #container not existed while xxx loading!`

Similar to the above error, This error thrown as the container DOM does not exist when the micro app is loaded. Generally, it is caused by incorrect calling timing of the `start` function, just adjust the calling timing of the `start` function.

How to determine the completion of the container DOM loading? The vue app can be called during the `mounted` life cycle, and the react app can be called during the `componentDidMount` life cycle.

If it still reports an error, check whether the container DOM is placed on a routing page of the main app, please refer to [How to load micro apps on a routing page of the main app](#How to load micro apps on a routing page of the main app)

## How to load micro apps on a routing page of the main app

It must be ensured that the routing page of the main app is also loaded when the micro app is loaded.

`vue` + `vue-router` main app:

1. When the main app registers this route, add a `*` to `path`, **Note: If this route has other sub-routes, you need to register another route, just use this component**.
   ```js
   const routes = [
     {
       path: '/portal/*',
       name: 'portal',
       component: () => import('../views/Portal.vue'),
     },
   ];
   ```
2. The `activeRule` of the micro app needs to include the route `path` of the main app.
   ```js
   registerMicroApps([
     {
       name: 'app1',
       entry: 'http://localhost:8080',
       container: '#container',
       activeRule: '/portal/app1',
     },
   ]);
   ```
3. Call the `start` function in the `mounted` cycle of the `Portal.vue` component, **be careful not to call it repeatedly**.
   ```js
   import { start } from 'qiankun';
   export default {
     mounted() {
       if (!window.qiankunStarted) {
         window.qiankunStarted = true;
         start();
       }
     },
   };
   ```

`react` + `react-router` main app：only need to make the activeRule of the sub app include the route of the main app.

`angular` + `angular-router` main app，similar to the Vue app：

1. The main app registers a wildcard sub route for this route, and the content is empty.

   ```ts
   const routes: Routes = [
     {
       path: 'portal',
       component: PortalComponent,
       children: [{ path: '**', component: EmptyComponent }],
     },
   ];
   ```

2. The `activeRule` of the micro app needs to include the route `path` of the main app.
   ```js
   registerMicroApps([
     {
       name: 'app1',
       entry: 'http://localhost:8080',
       container: '#container',
       activeRule: '/portal/app1',
     },
   ]);
   ```
3. Call the `start` function in the `ngAfterViewInit` cycle of this routing component, **be careful not to call it repeatedly**.
   ```ts
   import { start } from 'qiankun';
   export class PortalComponent implements AfterViewInit {
     ngAfterViewInit(): void {
       if (!window.qiankunStarted) {
         window.qiankunStarted = true;
         start();
       }
     }
   }
   ```

## Vue Router Error - `Uncaught TypeError: Cannot redefine property: $router`

If you pass `{ sandbox: true }` to `start()` function, `qiankun` will use `Proxy` to isolate global `window` object for sub applications. When you access `window.Vue` in sub application's code，it will check whether the `Vue` property in the proxyed `window` object. If the property does not exist, it will look it up in the global `window` object and return it.

There are three lines code in the `vue-router` as followed, and it will access `window.Vue` once the `vue-router` module is loaded. And the `window.Vue` in following code is your master application's `Vue`.

```javascript
if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
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

<Alert type="info">
Runtime publicPath addresses the problem of incorrect scripts, styles, images, and other addresses for dynamically loaded in sub application.
</Alert>

### 2. With webpack static public path config

You need to set your publicPath configuration to an absolute url, and in development with webpack it might be:

```js
{
  output: {
    publicPath: `//localhost:${port}`;
  }
}
```

### After the micro-app is bundled, the font files and images in the css load 404

The reason is that `qiankun` changed the external link style to the inline style, but the loading path of the font file and background image is a relative path.

Once the `css` file is packaged, you cannot modify the path of the font file and background image by dynamically modifying the `publicPath`.

There are mainly the following solutions:

1. Upload all static resources such as pictures to `cdn`, and directly reference the address of `cdn` in `css` (**recommended**)

2. Use the `url-loader` of `webpack` to package font files and images as `base64` (suitable for projects with small font files and images)(**recommended**)

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp|woff2?|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {},
          },
        ],
      },
    ],
  },
};
```

`vue-cli3` project:

```js
module.exports = {
  chainWebpack: (config) => {
    config.module.rule('fonts').use('url-loader').loader('url-loader').options({}).end();
    config.module.rule('images').use('url-loader').loader('url-loader').options({}).end();
  },
};
```

3. Use the `file-loader` of `webpack` to inject the full path when packaging it (suitable for projects with large font files and images)

```js
const publicPath = process.env.NODE_ENV === 'production' ? 'https://qiankun.umijs.org/' : `http://localhost:${port}`;
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]',
              publicPath,
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:8].[ext]',
              publicPath,
            },
          },
        ],
      },
    ],
  },
};
```

`vue-cli3` project:

```js
const publicPath = process.env.NODE_ENV === 'production' ? 'https://qiankun.umijs.org/' : `http://localhost:${port}`;
module.exports = {
  chainWebpack: (config) => {
    const fontRule = config.module.rule('fonts');
    fontRule.uses.clear();
    fontRule
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'fonts/[name].[hash:8].[ext]',
        publicPath,
      })
      .end();
    const imgRule = config.module.rule('images');
    imgRule.uses.clear();
    imgRule
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'img/[name].[hash:8].[ext]',
        publicPath,
      })
      .end();
  },
};
```

4. Combine the two schemes, convert small files to `base64`, and inject path prefixes for large files

```js
const publicPath = process.env.NODE_ENV === 'production' ? 'https://qiankun.umijs.org/' : `http://localhost:${port}`;
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webp)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {},
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'img/[name].[hash:8].[ext]',
                publicPath,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {},
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'fonts/[name].[hash:8].[ext]',
                publicPath,
              },
            },
          },
        ],
      },
    ],
  },
};
```

`vue-cli3` project：

```js
const publicPath = process.env.NODE_ENV === 'production' ? 'https://qiankun.umijs.org/' : `http://localhost:${port}`;
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // Less than 4kb will be packaged as base64
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[hash:8].[ext]',
            publicPath,
          },
        },
      })
      .end();
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // Less than 4kb will be packaged as base64
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash:8].[ext]',
            publicPath,
          },
        },
      });
  },
};
```

5. The `vue-cli3` project can package `css` into `js` without generating files separately (not recommended, only suitable for projects with less `css`)

Configuration reference [vue-cli3 official website](https://cli.vuejs.org/zh/config/#css-extract):

```js
module.exports = {
  css: {
    extract: false,
  },
};
```

## Must a sub app asset support cors?

Yes it is.

Since qiankun get assets which imported by sub app via fetch, these static resources must be required to support [cors](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

See [Enable Nginx Cors](https://enable-cors.org/server_nginx.html).

## How to guarantee the main app stylesheet isolated with sub apps?

Qiankun will isolate stylesheet between your sub apps automatically, you can manually ensure isolation between master and child applications. Such as add a prefix to all classes in the master application, and if you are using [ant-design](https://ant.design), you can follow [this doc](https://ant.design/docs/react/customize-theme) to make it works.

Example for antd：

1. use webpack to modify antd less variable

   ```diff
   {
     loader: 'less-loader',
   + options: {
   +   modifyVars: {
   +     '@ant-prefix': 'yourPrefix',
   +   },
   +   javascriptEnabled: true,
   + },
   }
   ```

2. set antd [ConfigProvider](https://ant.design/components/config-provider-cn/)

   ```jsx
   import { ConfigProvider } from 'antd';

   export const MyApp = () => (
     <ConfigProvider prefixCls="yourPrefix">
       <App />
     </ConfigProvider>
   );
   ```

Detailed documentation pls check [antd official guide](https://ant.design/docs/react/customize-theme).

<Alert type="info">
In the latest version, you can also try to config ` {sandbox: {experimentalStyleIsolation: true}} ` to open the runtime scoped CSS feature, thus solving the problem of the style of the isolation between applications.
PS: Currently, this feature is still in the experimental stage, if encounter some problems please submit an <a href="https://github.com/umijs/qiankun/issues/new?assignees=&labels=&template=bug_report.md&title=" target="_blank">issue</a> to help us improve together.
</Alert>

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
  { name: 'reactApp', entry: '//localhost:7100', container, activeRule: () => window.isReactApp },
  { name: 'react15App', entry: '//localhost:7102', container, activeRule: () => window.isReactApp },
  { name: 'vue app', entry: '//localhost:7101', container, activeRule: () => window.isVueApp },
]);

start({ singular: false });
```

After setting `singular: false` in `start` method, `reactApp` and `react15App` should be active at the same time once `isReactApp` method returns `true`.

<Alert>
Notice that no more than one application that relies on router can be displayed on the page at the same time, as the browser has only one url location, if there is more than one routing apps, it will definitely result in one of them to be 404 found.
</Alert>

## How to extract the common library？

> Don’t share a runtime, even if all teams use the same framework. - [Micro Frontends](https://micro-frontends.org/)

Although sharing dependencies isn't a good idea, but if you really need it, you can external the common dependencies from sub apps and then import them in master app.

In the future qiankun will provide a smarter way to make it automatically.

## Does qiankun compatible with ie?

Yes.

However, the IE environment (browsers that do not support Proxy) can only use the single-instance pattern, where the `singular` configuration will be set `true` automatically by qiankun if IE detected.

You can find the singular usage [here](/api#startopts).

### How to polyfill IE?

If you want qiankun (or its dependent libraries, or your own application) to work properly in IE, you need to introduce the following polyfills at the portal **at least**:

<Alert type="info">
What's <a href="https://developer.mozilla.org/en-US/docs/Glossary/Polyfill" target="_blank">polyfill</a>
</Alert>

```javascript
import 'whatwg-fetch';
import 'custom-event-polyfill';
import 'core-js/stable/promise';
import 'core-js/stable/symbol';
import 'core-js/stable/string/starts-with';
import 'core-js/web/url';
```

**We recommend that you use @babel/preset-env plugin directly to polyfill IE automatically, all the instructions for @babel/preset-env you can found in [babel official document](https://babeljs.io/docs/en/babel-preset-env).**

## Error `Here is no "fetch" on the window env, you need to polyfill it`

Qiankun use `window.fetch` to get resources of the micro applications, but [some browsers does not support it](https://caniuse.com/#search=fetch), you should get the [polyfill](https://github.com/github/fetch) in the entry.

## How to handle subapplication JSONP cross-domain errors?

qiankun will convert the dynamic script loading of the subapplication (such as JSONP) into a fetch request, so the corresponding back-end service needs to support cross-domain, otherwise it will cause an error.

In singular mode, you can use the `excludeAssetFilter` parameter to release this part of the resource request, but note that the resources released by this option will escape the sandbox, and the resulting side effects need to be handled by you.

If you use JSONP in not-singular mode, simply using `excludeAssetFilter` does not achieve good results, because each application is isolated by the sandbox; you can provide a unified JSONP tool in the main application, and the subapplication just calls the tool.

## 404 after refresh of child application？

It is usually because you are routing in Browser mode, which requires the server to open it. Specific configuration mode reference:

- [HTML5 History Mode](https://router.vuejs.org/guide/essentials/history-mode.html)
- [browserRouter](https://reactrouter.com/web/api/BrowserRouter)

## How to configure the 404 page in the main application?

First of all, you cannot use the wildcard `*`. You can register the 404 page as a normal routing page, such as `/404`, and then judge in the routing hook function of the main project, if it is neither the main application routing nor the micro application , Then jump to the 404 page.

Take `vue-router` as an example, the pseudo code is as follows:

```js
const childrenPath = ['/app1', '/app2'];
router.beforeEach((to, from, next) => {
  if (to.name) {
    // There is a name attribute, indicating that it is the route of the main project
    next();
  }
  if (childrenPath.some((item) => to.path.includes(item))) {
    next();
  }
  next({ name: '404' });
});
```

## How to jump between micro apps?

-Both the main application and the micro application are in the `hash` mode. The main application judges the micro application based on the `hash`, so this issue is not considered.

-The main application judges the micro application based on the `path`

It is not possible to directly use the routing instance of the micro-application to jump between micro-applications in the `history` mode or to jump to the main application page. The reason is that the routing instance jumps of the micro-application are all based on the `base` of the route. There are two ways to jump:

1. `history.pushState()`: [mdn usage introduction](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState)
2. Pass the routing instance of the main application to the micro application through `props`, and the micro application will jump to this routing instance.

## After the microapp file is updated, the old version of the file is still accessed

The server needs to configure a response header for the `index.html` of the micro application: `Cache-Control no-cache`, which means to check whether it is updated every time it requests.

Take `Nginx` as an example:

```
location = /index.html {
  add_header Cache-Control no-cache;
}
```

## micro app styles was lost when using config entry

Some scenarios we had to use config entry to load micro app (** not recommended **):

```js
loadMicroApp({
  name: 'configEntry',
  entry: {
    scripts: ['//t.com/t.js'],
    styles: ['//t.com/t.css'],
  },
});
```

Since there is no HTML attached to entry JS for microapp, the mount hook simply says:

```js
export async function mount(props) {
  ReactDOM.render(<App />, props.container);
}
```

As `props.container` is not an empty container and will contain information such as the style sheet that the microapp registers through the styles configuration, when we render directly for the container that the react application is applying with 'props.container', all the original DOM structures in the container will be overwritten, causing the style sheet to be lost.

We need to build an empty render container for micro applications that use Config Entry to mount react applications:

```diff
loadMicroApp({
  name: 'configEntry',
  entry: {
+   html: '<div id="root"></div>',
    scripts: ['//t.com/t.js'],
    styles: ['//t.com/t.css']
  }
});
```

The mount hook is not directly render to `props.container`, but to its 'root' node:

```diff
export async function mount(props) {
- ReactDOM.render(<App/>, props.container);
+ ReactDOM.render(<App/>, props.container.querySelector('#root'));
}
```

## How to solve the problem that cookies are not carried when pulling micro-app entries

As the requests to pull micro-app entry are all cross-domain, when your micro-app relies on cookies (such as authentication), you need to customize the fetch method to enable the cors mode:

- If you load the microapps through [registerMicroApps](/api#registermicroappsapps-lifecycles), you need to configure a custom fetch in the start method, such as:

  ```js
  import { start } from 'qiankun';

  start({
    fetch(url, ...args) {
      // Enable cors mode for the specified microapp
      if (url === 'http://app.alipay.com/entry.html') {
        return window.fetch(url, {
          ...args,
          mode: 'cors',
          credentials: 'include',
        });
      }

      return window.fetch(url, ...args);
    },
  });
  ```

- If you load the microapp via [loadMicroApp](/api#loadmicroappapp-configuration), you need to configure a custom fetch when invoking, such as:

  ```js
  import { loadMicroApp } from 'qiankun';

  loadMicroApp(app, {
    fetch(url, ...args) {
      // Enable cors mode for the specified microapp
      if (url === 'http://app.alipay.com/entry.html') {
        return window.fetch(url, {
          ...args,
          mode: 'cors',
          credentials: 'include',
        });
      }

      return window.fetch(url, ...args);
    },
  });
  ```
