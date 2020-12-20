---
nav:
  title: 新手教程
toc: menu
---

# 新手教程

## 如何开发

本教程适合刚接触 `qiankun` 的新人，介绍了如何从 0 构建一个 `qiankun` 项目。

### 主应用

主应用不限技术栈，只需要提供一个容器 DOM，然后注册微应用并 `start` 即可。

先安装 `qiankun` ：

```shell
$ yarn add qiankun # 或者 npm i qiankun -S
```

注册微应用并启动：

```js
import { registerMicroApps, start, initGlobalState } from 'qiankun';

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

// 如果没有双向传值需求，可以不使用 initGlobalState
// 初始化 state 
const actions = initGlobalState({ username: '张三' });
actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log(state, prev);
});
```

### 微应用

微应用分为有 `webpack` 构建和无 `webpack` 构建项目，有 `webpack` 的微应用（主要是指Vue、React、Angular）需要做的事情有：

1. 新增 `public-path.js` 文件，用于修改运行时的 `publicPath`。[什么是运行时的 publicPath ？](https://webpack.docschina.org/guides/public-path/#on-the-fly)。

    <Alert>
    注意：运行时的 publicPath 和构建时的 publicPath 是不同的，两者不能等价替代。
    </Alert>

2. `history` 路由需要设置路由 `base`，值和它的 `activeRule` 是一样的，`hash` 模式无需设置。
3. 在入口文件最顶部引入 `public-path.js`，修改并导出三个生命周期函数。
4. 修改 `webpack` 打包，允许开发环境跨域和 `umd` 打包。

主要的修改就是以上四个，可能会根据项目的不同情况而改变。例如，你的项目是 `index.html` 和其他的所有文件分开部署的，说明你们已经将构建时的 `publicPath` 设置为了完整路径，则不用修改运行时的 `publicPath` （第一步操作可省）。

无 `webpack` 构建的微应用直接将 `lifecycles` 挂载到 `window` 上即可。

#### Angular 微应用

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
        .catch(err => console.error(err));
    }
    if (!(window as any).__POWERED_BY_QIANKUN__) {
      render();
    }

    export async function bootstrap (props: Object) {
      console.log(props);
    }

    export async function mount (props: Object) {
      render();
    }

    export async function unmount (props: Object) {
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
   
    在**父应用**引入 `zone.js`，加载 `angular` 微应用前引入即可。

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
#### React 微应用

以 `create react app` 生成的 `react 16` 项目为例，搭配 `react-router-dom` 5.x。

1. 在 `src` 目录新增 `public-path.js`：

    ```js
    if (window.__POWERED_BY_QIANKUN__) {
      __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    }
    ```
2. 设置 `history` 模式路由的 `base`：

    ```html
    <!-- hash 模式不需要 -->
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

    function storeTest(props) {
      props.onGlobalStateChange((value, prev) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev), true);
      props.setGlobalState({
        ignore: props.name,
        user: {
          name: props.name,
        },
      });
    }

    if (!window.__POWERED_BY_QIANKUN__) {
      render({});
    }

    export async function bootstrap() {
      console.log('[react16] react app bootstraped');
    }

    export async function mount(props) {
      console.log('[react16] props from main framework', props);
      storeTest(props);
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
      webpack: config => {
        config.output.library = `${name}-[name]`;
        config.output.libraryTarget = 'umd';
        config.output.jsonpFunction = `webpackJsonp_${name}`;
        config.output.globalObject = 'window';

        return config;
      },

      devServer: _ => {
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
#### Vue 微应用

以 `vue-cli 3+` 生成的 `vue 2.x` 项目为例，`vue 3` 版本等稳定后再补充。

1. 在 `src` 目录新增 `public-path.js`：

    ```js
    if (window.__POWERED_BY_QIANKUN__) {
      __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
    }
    ```

3. 入口文件 `main.js` 修改，为了避免根 id `#app` 与其他的 DOM 冲突，需要限制查找范围。

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
        // hash 模式不需要设置 base
        base: window.__POWERED_BY_QIANKUN__ ? '/app-vue/' : '/',
        mode: 'history',
        routes,
      });

      instance = new Vue({
        router,
        store,
        render: h => h(App),
      }).$mount(container ? container.querySelector('#app') : '#app');
    }

    // 独立运行时
    if (!window.__POWERED_BY_QIANKUN__) {
      render();
    }

    function storeTest(props) {
      props.onGlobalStateChange &&
        props.onGlobalStateChange(
          (value, prev) => console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev),
          true,
        );
      props.setGlobalState &&
        props.setGlobalState({
          ignore: props.name,
          user: {
            name: props.name,
          },
        });
    }

    export async function bootstrap() {
      console.log('[vue] vue app bootstraped');
    }
    export async function mount(props) {
      console.log('[vue] props from main framework', props);
      storeTest(props); // 测试双向传递数据
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
          libraryTarget: 'umd',// 把微应用打包成 umd 库格式
          jsonpFunction: `webpackJsonp_${name}`,
        },
      },
    };
    ```

#### 非 webpack 构建的微应用

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

同时，你也需要开启相关资源的 CORS，具体请参照[此处](#微应用静态资源一定要支持跨域吗？)

#### umi-qiankun 项目

`umi-qiankun` 的教程请移步 [umi 官网](https://umijs.org/zh-CN/plugins/plugin-qiankun) 和 [umi-qiankun 的官方 demo](https://github.com/umijs/umi-plugin-qiankun/tree/master/examples)

### 微应用的路由模式如何选择

`react-router`，`angular-router`，`vue-router` 这三种路由，都支持 `hash` 和 `history` 模式，微应用使用不同的模式在 `qiankun` 中略有差别。

#### `activeRule` 使用 `location.pathname` 区分微应用

主应用使用 `location.pathname` 来区分微应用时，微应用可以是 `hash` 和 `history` 模式。

注册微应用时 `activeRule` 这样写即可：

```js
registerMicroApps([
  { 
    name: 'app', 
    entry: 'http://localhost:8080', 
    container: '#container', 
    activeRule: '/app', 
  },
]);
```

1. 当微应用是 `history` 模式时，设置路由 `base` 即可

2. 当微应用是 `hash` 模式时，三种路由的表现不一致

    | 路由           | 主应用跳转/app/#/about | 特殊配置             |
    | ---------------| ----------------------| --------------------|
    | vue-router     | 响应 about 路由        | 无                  |
    | react-router   | 不响应 about 路由      | 无                  |
    | angular-router | 响应 about 路由        | 需要设置 --base-href |

    `angular` 应用在 `package.json` 里面设置 `--base-href`：
    ```diff
    - "start": "ng serve",
    + "start": "ng serve --base-href /angular9",
    - "build": "ng build",
    + "build": "ng build --base-href /angular9",
    ```

    打包部署后，`angular` 微应用可以被主应用访问。但是独立访问时，懒加载的路由会报错，路径不正确。这里有两个解决办法：

    - 方法1：修改 `public-path.js` 为：

        ```js
        __webpack_public_path__ = window.__POWERED_BY_QIANKUN__ ? window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ : `http://${ip}:${port}/`; // 填写你的实际部署地址
        ```
    - 方法2：修改打包命令，并且将微应用部署在 `angular9` 目录：

        ```diff
        - "build": "ng build",
        + "build": "ng build --base-href /angular9 --deploy-url /angular9/",
        ```

#### `activeRule` 使用 `location.hash` 区分微应用

当微应用都是 `hash` 模式时可以使用 `hash` 区分微应用，主应用的路由模式不限。

注册微应用时 `activeRule` 需要这样写：

```js
const getActiveRule = hash => location => location.hash.startsWith(hash);
registerMicroApps([
  { 
    name: 'app-hash', 
    entry: 'http://localhost:8080', 
    container: '#container', 
    activeRule: getActiveRule('#/app-hash'), 
    // 这里也可以直接写 activeRule: '#/app-hash'，但是如果主应用是 history 模式或者主应用部署在非根目录，这样写不会生效。
  },
]);
```

`react-router` 和 `angular-router` 微应用需要设置 `activeRule` 的值为路由的 `base` ，写法同 `history` 模式。

`vue-router` 的 `hash` 模式下不支持设置路由的 `base`，需要额外新建一个空的路由页面，将其他所有路由都作为它的 `children`：

```js
const routes = [
  {
    path: '/app-vue-hash',
    name: 'Home',
    component: Home,
    children: [
      // 其他的路由都写到这里
    ]
  }
]
```

#### 同时存在多个微应用时

如果一个页面同时展示多个微应用，需要使用 `loadMicroApp` 来加载。

如果这些微应用都有路由跳转的需求，要保证这些路由能互不干扰，需要使用 `momery` 路由。`vue-router` 使用 `abstract` 模式，`react-router` 使用 `memory history` 模式，`angular-router` 不支持。

## 如何部署

**建议**：主应用和微应用都是独立开发和部署，即它们都属于不同的仓库和服务。

### 场景1：主应用和微应用部署到同一个服务器（同一个IP和端口）

如果服务器数量有限，或不能跨域等原因需要把主应用和微应用部署到一起。

通常的做法是主应用部署在一级目录，微应用部署在二/三级目录。

微应用想部署在非根目录，在微应用打包之前需要做两件事：

1. 必须配置 `webpack` 构建时的 `publicPath` 为**目录名称**，更多信息请看 [webpack 官方说明](https://www.webpackjs.com/configuration/output/#output-publicpath) 和 [vue-cli3 的官方说明](https://cli.vuejs.org/zh/config/#publicpath) 

2. `history` 路由的微应用需要设置 `base` ，值为**目录名称**，用于独立访问时使用。

部署之后注意三点：

1. `activeRule` 不能和**微应用的真实访问路径一样**，否则在主应用页面刷新会直接变成微应用页面。
2. 微应用的真实访问路径就是微应用的 `entry`，`entry` 可以为相对路径。
3. 微应用的 `entry` 路径最后面的 `/` 不可省略，否则 `publicPath` 会设置错误，例如子项的访问路径是 `http://localhost:8080/app1`,那么 `entry` 就是 `http://localhost:8080/app1/`。

具体的部署有以下两种方式，选择其一即可。

#### 方案1：微应用都放在在一个特殊名称（**不会和微应用重名**）的文件夹下（**建议使用**）

假设我们有一个主应用和 6 个微应用（分别为 `vue-hash`、`vue-history`、`react-hash`、`react-history`、`angular-hash`、`angular-history` ），打包后如下放置：
```
└── html/                     # 根文件夹
    |
    ├── child/                # 存放所有微应用的文件夹
    |   ├── vue-hash/         # 存放微应用 vue-hash 的文件夹
    |   ├── vue-history/      # 存放微应用 vue-history 的文件夹
    |   ├── react-hash/       # 存放微应用 react-hash 的文件夹
    |   ├── react-history/    # 存放微应用 react-history 的文件夹
    |   ├── angular-hash/     # 存放微应用 angular-hash 的文件夹
    |   ├── angular-history/  # 存放微应用 angular-history 的文件夹
    ├── index.html            # 主应用的index.html
    ├── css/                  # 主应用的css文件夹
    ├── js/                   # 主应用的js文件夹
```

此时需要设置微应用构建时的 `publicPath` 和 `history` 模式的路由 `base`，然后才能打包放到对应的目录里。

| 项目            | 路由 base                | publicPath              | 真实访问路径                                  |
| --------------- | ------------------------| ------------------------| ---------------------------------------------|
| vue-hash        | 无                      | /child/vue-hash/        | http://localhost:8080/child/vue-hash/        |
| vue-history     | /child/vue-history/     | /child/vue-history/     | http://localhost:8080/child/vue-history/     |
| react-hash      | 无                      | /child/react-hash/      | http://localhost:8080/child/react-hash/      |
| react-history   | /child/react-history/   | /child/react-history/   | http://localhost:8080/child/react-history/   |
| angular-hash    | 无                      | /child/angular-hash/    | http://localhost:8080/child/angular-hash/    |
| angular-history | /child/angular-history/ | /child/angular-history/ | http://localhost:8080/child/angular-history/ |

- vue-history 微应用

    路由设置：
    ```js
    base: window.__POWERED_BY_QIANKUN__ ? '/app-vue/' : '/child/vue-history/',
    ```
    webpack 打包 publicPath 配置（`vue.config.js`）：
    ```js
    module.exports = {
      publicPath: '/child/vue-history/'
    }
    ```

- react-history 微应用

    路由设置：
    ```html
    <BrowserRouter basename={window.__POWERED_BY_QIANKUN__ ? '/app-react' : '/child/react-history/'}>
    ```
    webpack 打包 publicPath 配置：
    ```js
    module.exports = {
      output: {
        publicPath: '/child/react-history/',
      }
    }
    ```

- angular-history 微应用

    路由设置：
    ```js
    providers: [{ 
      provide: APP_BASE_HREF, 
      useValue: window.__POWERED_BY_QIANKUN__ ? '/app-angular/' : '/child/angular-history/' 
    }]
    ```
    webpack 打包的 `publicPath` 通过 `deploy-url` 来修改，修改 `package.json`：
    ```diff
    - "build": "ng build",
    + "build": "ng build --deploy-url /child/angular-history/",
    ```

那么此时的注册函数是这样的（需要保证 `activeRule` 和 `entry` 不同）：

```js
registerMicroApps([
  {
    name: 'app-vue-hash', 
    entry: '/child/vue-hash/', // http://localhost:8080/child/vue-hash/
    container: '#container', 
    activeRule: '/app-vue-hash', 
  },
  { 
    name: 'app-vue-history',
    entry: '/child/vue-history/', // http://localhost:8080/child/vue-history/
    container: '#container', 
    activeRule: '/app-vue-history',
  },
  // angular 和 react 同上
],
```

至此主应用已经和微应用都能跑起来了，但是主应用和 `vue-history`、`react-history`、`angular-history` 微应用是 `history` 路由，需要解决刷新 404 的问题，`nginx` 还需要配置一下：

```conf
server {
  listen       8080;
  server_name  localhost;

  location / {
    root   html;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  location /child/vue-history {
    root   html;
    index  index.html index.htm;
    try_files $uri $uri/ /child/vue-history/index.html;
  }
  # angular 和 react 的history 配置同上
}
```

#### 方案2：微应用直接放在二级目录，但是设置特殊的 `activeRule`

```
└── html/                     # 根文件夹
    |
    ├── vue-hash/             # 存放微应用 vue-hash 的文件夹
    ├── vue-history/          # 存放微应用 vue-history 的文件夹
    ├── react-hash/           # 存放微应用 react-hash 的文件夹
    ├── react-history/        # 存放微应用 react-history 的文件夹
    ├── angular-hash/         # 存放微应用 angular-hash 的文件夹
    ├── angular-history/      # 存放微应用 angular-history 的文件夹
    ├── index.html            # 主应用的index.html
    ├── css/                  # 主应用的css文件夹
    ├── js/                   # 主应用的js文件夹
```

基本操作和上面是一样的，只要保证 `activeRule` 和微应用的存放路径名不一样即可。

### 场景2：主应用和微应用部署在不同的服务器，使用 Nginx 代理访问

一般这么做是因为**不允许主应用跨域访问微应用**，做法就是将主应用服务器上一个特殊路径的请求全部转发到微应用的服务器上，即通过代理实现“微应用部署在主应用服务器上”的效果。

例如，主应用在 A 服务器，微应用在 B 服务器，使用路径 `/app1` 来区分微应用，即 A 服务器上所有 `/app1` 开头的请求都转发到 B 服务器上。

此时主应用的 `Nginx` 代理配置为：

```
/app1/ {
  proxy_pass http://www.b.com/app1/;
  proxy_set_header Host $host:$server_port;    
}
```

主应用注册微应用时，`entry` 可以为相对路径，`activeRule` 不可以和 `entry` 一样（否则主应用页面刷新就变成微应用）：

```js
registerMicroApps([
  {
    name: 'app1', 
    entry: '/app1/', // http://localhost:8080/app1/
    container: '#container', 
    activeRule: '/child-app1', 
  },
],
```

对于 `webpack` 构建的微应用，微应用的 `webpack` 打包的 `publicPath` 需要配置成 `/app1/`，否则微应用的 `index.html` 能正确请求，但是微应用 `index.html` 里面的 `js/css` 路径不会带上 `/app1/`。

```js
module.exports = {
  output: {
    publicPath: `/app1/`,
  }
}
```

微应用打包的 `publicPath` 加上 `/app1/` 之后，必须部署在 `/app1` 目录，否则无法独立访问。

另外，如果不想微应用通过代理路径被独立访问，可以根据请求的一些信息判断下，主应用中请求微应用是用 `fetch` 请求的，可以带参数和 `cookie`。例如通过请求头参数判断：

```js
if ($http_custom_referer != "main") {
  rewrite /index /404.html;
}
```

## 从 1.x 版本升级到 2.x 版本

微应用无需改动，主应用需要做一些调整。

`registerMicroApps` 函数基本修改如下：

1. 去掉 `render` 参数，只需要提供容器 `container` 即可。
2. 增加 `loader` 参数，用于展示 `loading` 状态，原本 `loading` 状态是提供给 `render` 参数的。
3. `activeRule` 参数可以简写为 `/app`，兼容之前的函数写法。
4. `RegisterMicroAppsOpts` 参数去掉了，放在了 `start` 函数的参数里面。

`start` 函数基本修改如下：

1. `jsSandbox` 配置去掉，改为 `sandbox` ，可选值也修改了。
2. 新增了 `getPublicPath` 和 `getTemplate` ，用于替代`RegisterMicroAppsOpts`。