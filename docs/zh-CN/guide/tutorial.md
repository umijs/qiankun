# 教程

本教程适合新接触 `qiankun` 的人群，从零开始介绍如何构建一个 `qiankun` 项目。

## 主应用

主应用不限技术栈，只需要提供一个容器 DOM，然后注册微应用并启动 qiankun 即可。

首先安装 `qiankun`：

```shell
$ yarn add qiankun # 或者 npm i qiankun -S
```

注册微应用并启动：

```js
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'angularApp',
    entry: '//localhost:4200',
    container: '#container',
    activeRule: '/app-angular',
  },
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
]);
// 启动 qiankun
start();
```

## 微应用

微应用分为有 `webpack` 构建和无 `webpack` 构建项目，有 `webpack` 的微应用（主要是指 Vue、React、Angular）需要做的事情有：

1. 新增 `public-path.js` 文件，用于修改运行时的 `publicPath`。[什么是运行时的 publicPath？](https://webpack.js.org/guides/public-path/#on-the-fly)

::: warning
注意：运行时的 `publicPath` 和构建时的 `publicPath` 是不同的，两者不能等价替代。
:::

2. 微应用建议使用 `history` 模式的路由，需要设置路由 `base`，值和它的 `activeRule` 是一样的。
3. 在入口文件最顶部引入 `public-path.js`，修改并导出三个生命周期函数。
4. 修改 `webpack` 配置，在开发环境下允许跨域、并以 `umd` 格式打包。

主要的修改就是以上 4 个，可能根据项目的不同情况而改变。比如，如果你的项目是 `index.html` 和其他所有文件分开部署的，说明你们已经将构建时的 `publicPath` 设置为了完整路径，则不用修改运行时的 `publicPath`（第 1 步可省略）。

对于无 `webpack` 构建的微应用，只需要将生命周期函数挂载到 `window` 上即可。

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

::: tip
重要提示：在通过 ReactDOM.render 挂载子应用时，需要确保每个子应用都使用新的路由实例加载。
:::

4. 修改 `webpack` 配置

   安装插件 `@rescripts/cli`，当然你也可以选择其他的插件，例如 `react-app-rewired`。

   ```bash
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

### React MicroApp 组件

1. 安装

```bash
npm i qiankun
npm i @qiankunjs/react
```

2. 使用

直接通过 `<MicroApp/>` 组件加载（或卸载）子应用，该组件提供了加载和错误捕获相关能力：

```tsx
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  return <MicroApp name="app1" entry="http://localhost:8000" />;
}
```

### Vue 微应用

以 `vue-cli 3+` 生成的 `vue 2.x` 项目为例，`vue 3` 版本等稳定之后再补充。

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

3. 修改 `webpack` 配置（`vue.config.js`）：

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

### Vue MicroApp 组件

1. 安装

```bash
npm i qiankun
npm i @qiankunjs/vue
```

2. 使用

直接通过 `<MicroApp/>` 组件加载（或卸载）子应用，该组件提供了加载和错误捕获相关能力：

```vue
<script setup>
import { MicroApp } from '@qiankunjs/vue';
</script>

<template>
  <micro-app name="app1" entry="http://localhost:8000" />
</template>
```

### Angular 微应用

以 `Angular-cli 9` 生成的 `angular 9` 项目为例，其他版本的 `angular` 后续再补充。

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

3. 修改入口文件，`src/main.ts` 文件：

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

   先安装 `@angular-builders/custom-webpack` 插件，**注意：`Angular 9` 项目只能安装 `9.x` 版本，`angular 10` 项目可以安装最新版本**。

   ```bash
   npm i @angular-builders/custom-webpack@9.2.0 -D
   ```

   根目录增加 `custom-webpack.config.js` 文件，内容为：

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

   修改 `angular.json`，将 `[项目名称] > architect > build > builder` 和 `[项目名称] > architect > serve > builder` 的值改为我们安装的插件，将我们的 webpack 配置文件加入到 `[项目名称] > architect > build > options`。

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

   在**主应用**中导入 `zone.js`，需要在 `import qiankun` 之前导入。

   将微应用的 `src/polyfills.ts` 里面的 `zone.js` 导入删除。

   ```diff
   - import 'zone.js/dist/zone';
   ```

   在微应用的 `src/index.html` 的 `<head>` 中加入如下内容，用于独立访问微应用时使用。

   ```html
   <!-- 也可以使用其他 CDN/本地 包 -->
   <script src="https://unpkg.com/zone.js" ignore></script>
   ```

6. 修复 `ng build` 命令报错的问题，修改 `tsconfig.json` 文件，参考 [issues/431](https://github.com/umijs/qiankun/issues/431)。

   ```diff
   - "target": "es2015",
   + "target": "es5",
   + "typeRoots": [
   +   "node_modules/@types"
   + ],
   ```

7. 为了防止主应用或其他微应用也为 `angular` 时，`<app-root></app-root>` 发生冲突，建议给 `<app-root>` 加上一个唯一的 id，比如说当前应用名称。

   src/index.html：

   ```diff
   - <app-root></app-root>
   + <app-root id="angular9"></app-root>
   ```

   src/app/app.component.ts：

   ```diff
   - selector: 'app-root',
   + selector: '#angular9 app-root',
   ```

当然，你也可以选择使用 `single-spa-angular` 插件，参考 [single-spa-angular 官网](https://single-spa.js.org/docs/ecosystem-angular) 和 [angular demo](https://github.com/umijs/qiankun/tree/master/examples/angular9)

（**补充**）angular7 的步骤和 angular9 基本一致，除了第 4 步。angular7 修改 `webpack` 配置的步骤如下：

除了安装 7.x 版本的 `angular-builders/custom-webpack` 外，还需要安装 `angular-builders/dev-server`。

```bash
npm i @angular-builders/custom-webpack@7 -D
npm i @angular-builders/dev-server -D
```

根目录增加 `custom-webpack.config.js` 文件，内容同上。

修改 `angular.json`，`[项目名称] > architect > build > builder` 和 Angular9 一样，`[项目名称] > architect > serve > builder` 和 Angular9 不一样。

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

### 无 webpack 构建的微应用

一些不是由 `webpack` 构建的应用，比如 `jQuery` 应用、`jsp` 应用，都可以按照这个处理。

修改前请确保你的项目里的图片、音视频等资源能够正常加载。如果这些资源的地址都是完整路径（例如 `https://qiankun.umijs.org/logo.png`），则没有问题。如果都是相对路径，需要先将这些资源上传到服务器，再引用完整路径。

我们需要声明一个 script 标签，来导出相应的生命周期钩子。

示例：

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

2. 在 entry js 里导出生命周期

   ```javascript
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

可以参考 [purehtml 例子](https://github.com/umijs/qiankun/tree/master/examples/purehtml)

同时，[子应用必须支持跨域](/faq#子应用静态资源一定要支持跨域吗)

### umi-qiankun 应用

关于 `umi-qiankun` 的教程请前往 [umi 官网](https://umijs.org/zh-CN/plugins/plugin-qiankun) 和 [umi-qiankun 官方 demo](https://github.com/umijs/umi-plugin-qiankun/tree/master/examples) 