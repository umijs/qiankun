---
toc: menu
---

# 项目实践

本教程适合刚接触 `qiankun` 的新人，介绍了如何从 0 构建一个 `qiankun` 项目。

## 主应用

主应用不限技术栈，只需要提供一个容器 DOM，然后注册微应用并 `start` 即可。

先安装 `qiankun` ：

```shell
$ yarn add qiankun # 或者 npm i qiankun -S
```

注册微应用并启动：

```js
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'reactApp',
    entry: '//localhost:3000',
    container: '#container',
    activeRule: '/app-react',
  },
  {
    name: 'vueApp',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/app-vue',
  },
  {
    name: 'angularApp',
    entry: '//localhost:4200',
    container: '#container',
    activeRule: '/app-angular',
  },
]);
// 启动 qiankun
start();
```

## 微应用

微应用分为有 `webpack` 构建和无 `webpack` 构建项目，有 `webpack` 的微应用（主要是指 Vue、React、Angular）需要做的事情有：

1. 新增 `public-path.js` 文件，用于修改运行时的 `publicPath`。[什么是运行时的 publicPath ？](https://webpack.docschina.org/guides/public-path/#on-the-fly)。

<Alert>
注意：运行时的 publicPath 和构建时的 publicPath 是不同的，两者不能等价替代。
</Alert>

2. 微应用建议使用 `history` 模式的路由，需要设置路由 `base`，值和它的 `activeRule` 是一样的。
3. 在入口文件最顶部引入 `public-path.js`，修改并导出三个生命周期函数。
4. 修改 `webpack` 打包，允许开发环境跨域和 `umd` 打包。

主要的修改就是以上四个，可能会根据项目的不同情况而改变。例如，你的项目是 `index.html` 和其他的所有文件分开部署的，说明你们已经将构建时的 `publicPath` 设置为了完整路径，则不用修改运行时的 `publicPath` （第一步操作可省）。

无 `webpack` 构建的微应用直接将 `lifecycles` 挂载到 `window` 上即可。

### React 微应用

以 `create react app` 生成的 `react 16` 项目为例，搭配 `react-router-dom` 5.x。

1. 在 `src` 目录新增 `public-path.js`：

   ```js
   if (window.__POWERED_BY_QIANKUN__) {
     __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
   }
   ```

2. 设置 `history` 模式路由的 `base`：

   ```html
   <BrowserRouter basename={window.__POWERED_BY_QIANKUN__ ? '/app-react' : '/'}>
   ```

3. 入口文件 `index.js` 修改，为了避免根 id `#root` 与其他的 DOM 冲突，需要限制查找范围。

   ```js
   import './public-path';
   import React from 'react';
   import ReactDOM from 'react-dom';
   import App from './App';

   function render(props) {
     const { container } = props;
     ReactDOM.render(<App />, container ? container.querySelector('#root') : document.querySelector('#root'));
   }

   if (!window.__POWERED_BY_QIANKUN__) {
     render({});
   }

   export async function bootstrap() {
     console.log('[react16] react app bootstraped');
   }

   export async function mount(props) {
     console.log('[react16] props from main framework', props);
     render(props);
   }

   export async function unmount(props) {
     const { container } = props;
     ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
   }
   ```

4. 修改 `webpack` 配置

   安装插件 `@rescripts/cli`，当然也可以选择其他的插件，例如 `react-app-rewired`。

   ```dash
   npm i -D @rescripts/cli
   ```

   根目录新增 `.rescriptsrc.js`：

   ```js
   const { name } = require('./package');

   module.exports = {
     webpack: (config) => {
       config.output.library = `${name}-[name]`;
       config.output.libraryTarget = 'umd';
       config.output.jsonpFunction = `webpackJsonp_${name}`;
       config.output.globalObject = 'window';

       return config;
     },

     devServer: (_) => {
       const config = _;

       config.headers = {
         'Access-Control-Allow-Origin': '*',
       };
       config.historyApiFallback = true;
       config.hot = false;
       config.watchContentBase = false;
       config.liveReload = false;

       return config;
     },
   };
   ```

   修改 `package.json`：

   ```diff
   -   "start": "react-scripts start",
   +   "start": "rescripts start",
   -   "build": "react-scripts build",
   +   "build": "rescripts build",
   -   "test": "react-scripts test",
   +   "test": "rescripts test",
   -   "eject": "react-scripts eject"
   ```

### Vue 微应用

以 `vue-cli 3+` 生成的 `vue 2.x` 项目为例，`vue 3` 版本等稳定后再补充。

1. 在 `src` 目录新增 `public-path.js`：

   ```js
   if (window.__POWERED_BY_QIANKUN__) {
     __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
   }
   ```

2. 入口文件 `main.js` 修改，为了避免根 id `#app` 与其他的 DOM 冲突，需要限制查找范围。

   ```js
   import './public-path';
   import Vue from 'vue';
   import VueRouter from 'vue-router';
   import App from './App.vue';
   import routes from './router';
   import store from './store';

   Vue.config.productionTip = false;

   let router = null;
   let instance = null;
   function render(props = {}) {
     const { container } = props;
     router = new VueRouter({
       base: window.__POWERED_BY_QIANKUN__ ? '/app-vue/' : '/',
       mode: 'history',
       routes,
     });

     instance = new Vue({
       router,
       store,
       render: (h) => h(App),
     }).$mount(container ? container.querySelector('#app') : '#app');
   }

   // 独立运行时
   if (!window.__POWERED_BY_QIANKUN__) {
     render();
   }

   export async function bootstrap() {
     console.log('[vue] vue app bootstraped');
   }
   export async function mount(props) {
     console.log('[vue] props from main framework', props);
     render(props);
   }
   export async function unmount() {
     instance.$destroy();
     instance.$el.innerHTML = '';
     instance = null;
     router = null;
   }
   ```

3. 打包配置修改（`vue.config.js`）：

   ```js
   const { name } = require('./package');
   module.exports = {
     devServer: {
       headers: {
         'Access-Control-Allow-Origin': '*',
       },
     },
     configureWebpack: {
       output: {
         library: `${name}-[name]`,
         libraryTarget: 'umd', // 把微应用打包成 umd 库格式
         jsonpFunction: `webpackJsonp_${name}`,
       },
     },
   };
   ```

### Angular 微应用

以 `Angular-cli 9` 生成的 `angular 9` 项目为例，其他版本的 `angular` 后续会逐渐补充。

1. 在 `src` 目录新增 `public-path.js` 文件，内容为：

   ```js
   if (window.__POWERED_BY_QIANKUN__) {
     // eslint-disable-next-line no-undef
     __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
   }
   ```

2. 设置 `history` 模式路由的 `base`，`src/app/app-routing.module.ts` 文件：

   ```diff
   + import { APP_BASE_HREF } from '@angular/common';

   @NgModule({
     imports: [RouterModule.forRoot(routes)],
     exports: [RouterModule],
     // @ts-ignore
   +  providers: [{ provide: APP_BASE_HREF, useValue: window.__POWERED_BY_QIANKUN__ ? '/app-angular' : '/' }]
   })
   ```

3. 修改入口文件，`src/main.ts` 文件。

   ```ts
   import './public-path';
   import { enableProdMode, NgModuleRef } from '@angular/core';
   import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
   import { AppModule } from './app/app.module';
   import { environment } from './environments/environment';

   if (environment.production) {
     enableProdMode();
   }

   let app: void | NgModuleRef<AppModule>;
   async function render() {
     app = await platformBrowserDynamic()
       .bootstrapModule(AppModule)
       .catch((err) => console.error(err));
   }
   if (!(window as any).__POWERED_BY_QIANKUN__) {
     render();
   }

   export async function bootstrap(props: Object) {
     console.log(props);
   }

   export async function mount(props: Object) {
     render();
   }

   export async function unmount(props: Object) {
     console.log(props);
     // @ts-ignore
     app.destroy();
   }
   ```

4. 修改 `webpack` 打包配置

   先安装 `@angular-builders/custom-webpack` 插件，**注意：`angular 9` 项目只能安装 `9.x` 版本，`angular 10` 项目可以安装最新版**。

   ```bash
   npm i @angular-builders/custom-webpack@9.2.0 -D
   ```

   在根目录增加 `custom-webpack.config.js` ，内容为：

   ```js
   const appName = require('./package.json').name;
   module.exports = {
     devServer: {
       headers: {
         'Access-Control-Allow-Origin': '*',
       },
     },
     output: {
       library: `${appName}-[name]`,
       libraryTarget: 'umd',
       jsonpFunction: `webpackJsonp_${appName}`,
     },
   };
   ```

   修改 `angular.json`，将 `[packageName] > architect > build > builder` 和 `[packageName] > architect > serve > builder` 的值改为我们安装的插件，将我们的打包配置文件加入到 `[packageName] > architect > build > options`。

   ```diff
   - "builder": "@angular-devkit/build-angular:browser",
   + "builder": "@angular-builders/custom-webpack:browser",
     "options": {
   +    "customWebpackConfig": {
   +      "path": "./custom-webpack.config.js"
   +    }
     }
   ```

   ```diff
   - "builder": "@angular-devkit/build-angular:dev-server",
   + "builder": "@angular-builders/custom-webpack:dev-server",
   ```

5. 解决 `zone.js` 的问题

   在**父应用**引入 `zone.js`，需要在 `import qiankun` 之前引入。

   将微应用的 `src/polyfills.ts` 里面的引入 `zone.js` 代码删掉。

   ```diff
   - import 'zone.js/dist/zone';
   ```

   在微应用的 `src/index.html` 里面的 `<head>` 标签加上下面内容，微应用独立访问时使用。

   ```html
   <!-- 也可以使用其他的CDN/本地的包 -->
   <script src="https://unpkg.com/zone.js" ignore></script>
   ```

6. 修正 `ng build` 打包报错问题，修改 `tsconfig.json` 文件，参考[issues/431](https://github.com/umijs/qiankun/issues/431)

   ```diff
   - "target": "es2015",
   + "target": "es5",
   + "typeRoots": [
   +   "node_modules/@types"
   + ],
   ```

7. 为了防止主应用或其他微应用也为 `angular` 时，`<app-root></app-root>` 会冲突的问题，建议给`<app-root>` 加上一个唯一的 id，比如说当前应用名称。

   src/index.html ：

   ```diff
   - <app-root></app-root>
   + <app-root id="angular9"></app-root>
   ```

   src/app/app.component.ts ：

   ```diff
   - selector: 'app-root',
   + selector: '#angular9 app-root',
   ```

当然，也可以选择使用 `single-spa-angular` 插件，参考[ single-spa-angular 的官网](https://single-spa.js.org/docs/ecosystem-angular) 和 [angular demo](https://github.com/umijs/qiankun/tree/master/examples/angular9)

（**补充**）angular7 项目除了第 4 步以外，其他的步骤和 angular9 一模一样。angular7 修改 `webpack` 打包配置的步骤如下：

除了安装 `angular-builders/custom-webpack` 插件的 7.x 版本外，还需要安装 `angular-builders/dev-server`。

```bash
npm i @angular-builders/custom-webpack@7 -D
npm i @angular-builders/dev-server -D
```

在根目录增加 `custom-webpack.config.js` ，内容同上。

修改 `angular.json`， `[packageName] > architect > build > builder` 的修改和 angular9 一样， `[packageName] > architect > serve > builder` 的修改和 angular9 不同。

```diff
- "builder": "@angular-devkit/build-angular:browser",
+ "builder": "@angular-builders/custom-webpack:browser",
  "options": {
+    "customWebpackConfig": {
+      "path": "./custom-webpack.config.js"
+    }
  }

```

```diff
- "builder": "@angular-devkit/build-angular:dev-server",
+ "builder": "@angular-builders/dev-server:generic",
```

### 非 webpack 构建的微应用

一些非 `webpack` 构建的项目，例如 `jQuery` 项目、`jsp` 项目，都可以按照这个处理。

接入之前请确保你的项目里的图片、音视频等资源能正常加载，如果这些资源的地址都是完整路径（例如 `https://qiankun.umijs.org/logo.png`），则没问题。如果都是相对路径，需要先将这些资源上传到服务器，使用完整路径。

接入非常简单，只需要额外声明一个 `script`，用于 `export` 相对应的 `lifecycles`。例如:

1. 声明 entry 入口

   ```diff
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Purehtml Example</title>
   </head>
   <body>
     <div>
       Purehtml Example
     </div>
   </body>

   + <script src="//yourhost/entry.js" entry></script>
   </html>
   ```

2. 在 entry js 里声明 lifecycles

   ```js
   const render = ($) => {
     $('#purehtml-container').html('Hello, render with jQuery');
     return Promise.resolve();
   };

   ((global) => {
     global['purehtml'] = {
       bootstrap: () => {
         console.log('purehtml bootstrap');
         return Promise.resolve();
       },
       mount: () => {
         console.log('purehtml mount');
         return render($);
       },
       unmount: () => {
         console.log('purehtml unmount');
         return Promise.resolve();
       },
     };
   })(window);
   ```

你也可以直接参照 examples 中 purehtml 部分的[代码](https://github.com/umijs/qiankun/tree/master/examples/purehtml)

同时，你也需要开启相关资源的 CORS，具体请参照[此处](/zh/faq#微应用静态资源一定要支持跨域吗？)

### umi-qiankun 项目

`umi-qiankun` 的教程请移步 [umi 官网](https://umijs.org/zh-CN/plugins/plugin-qiankun) 和 [umi-qiankun 的官方 demo](https://github.com/umijs/umi-plugin-qiankun/tree/master/examples)
