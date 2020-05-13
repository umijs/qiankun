# 从 0 到 1 搭建微前端

本教程将分享如何使用 `qiankun` 如何搭建主应用基座，然后接入不同技术栈的微应用，完成微前端架构的从 0 到 1。

本教程采用 `Vue` 作为主应用基座，接入不同技术栈的微应用。如果你不懂 `Vue` 也没关系，我们在搭建主应用基座的教程尽量不涉及 `Vue` 的 `API`，涉及到 `API` 的地方都会给出解释。

> 注意：`qiankun` 属于无侵入性的微前端框架，对主应用基座和微应用的技术栈都没有要求。

## 构建主应用基座

我们以 [实战案例 - feature-inject-sub-apps 分支](https://github.com/a1029563229/micro-front-template/tree/feature-inject-sub-apps) （案例是以 `Vue` 为基座的主应用，接入多个微应用） 为例，来介绍一下如何在 `qiankun` 中如何接入不同技术栈的微应用。

我们先使用 `vue-cli` 生成一个 `Vue` 的项目，初始化主应用。

> [vue-cli](https://cli.vuejs.org/zh/guide/) 是 `Vue` 官方提供的脚手架工具，用于快速搭建一个 `Vue` 项目。如果你想跳过这一步，可以直接 `clone` [实战案例 - feature-inject-sub-apps 分支](https://github.com/a1029563229/micro-front-template/tree/feature-inject-sub-apps) 的代码。

将普通的项目改造成 `qiankun` 主应用基座，需要进行三步操作：

1. 创建微应用容器 - 用于承载微应用，渲染显示微应用；
2. 注册微应用 - 设置微应用激活条件，微应用地址等等；
3. 启动 `qiankun`；

### 创建微应用容器

我们先在主应用中创建微应用的承载容器，这个容器规定了微应用的显示区域，微应用将在该容器内渲染并显示。

我们先设置路由，路由文件规定了主应用自身的路由匹配规则，代码实现如下：

```ts
// micro-app-main/src/routes/index.ts
import Home from "@/pages/home/index.vue";

const routes = [
  {
    /**
     * path: 路径为 / 时触发该路由规则
     * name: 路由的 name 为 Home
     * component: 触发路由时加载 `Home` 组件
     */
    path: "/",
    name: "Home",
    component: Home,
  },
];

export default routes;

// micro-app-main/src/main.ts
//...
import Vue from "vue";
import VueRouter from "vue-router";

import routes from "./routes";

/**
 * 注册路由实例
 * 即将开始监听 location 变化，触发路由规则
 */
const router = new VueRouter({
  mode: "history",
  routes,
});

// 创建 Vue 实例
// 该实例将挂载/渲染在 id 为 main-app 的节点上
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#main-app");
```

从上面代码可以看出，我们设置了主应用的路由规则，设置了 `Home` 主页的路由匹配规则。

我们现在来设置主应用的布局，我们会有一个菜单和显示区域，代码实现如下：

```ts
// micro-app-main/src/App.vue
//...
export default class App extends Vue {
  /**
   * 菜单列表
   * key: 唯一 Key 值
   * title: 菜单标题
   * path: 菜单对应的路径
   */
  menus = [
    {
      key: "Home",
      title: "主页",
      path: "/",
    },
  ];
}
```

上面的代码是我们对菜单配置的实现，我们还需要实现基座和微应用的显示区域（如下图）

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/12.png)

我们来分析一下上面的代码：

- `第 5 行`：主应用菜单，用于渲染菜单；
- `第 9 行`：主应用渲染区。在触发主应用路由规则时（由路由配置表的 `$route.name` 判断），将渲染主应用的组件；
- `第 10 行`：微应用渲染区。在未触发主应用路由规则时（由路由配置表的 `$route.name` 判断），将渲染微应用节点；

从上面的分析可以看出，我们使用了在路由表配置的 `name` 字段进行判断，判断当前路由是否为主应用路由，最后决定渲染主应用组件或是微应用节点。

由于篇幅原因，样式实现代码就不贴出来了，最后主应用的实现效果如下图所示：

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/11.png)

从上图可以看出，我们主应用的组件和微应用是显示在同一片内容区域，根据路由规则决定渲染规则。

### 注册微应用

在构建好了主框架后，我们需要使用 `qiankun` 的 `registerMicroApps` 方法注册微应用，代码实现如下：

```ts
// micro-app-main/src/micro/apps.ts
// 此时我们还没有微应用，所以 apps 为空
const apps = [];

export default apps;

// micro-app-main/src/micro/index.ts
// 一个进度条插件
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { message } from "ant-design-vue";
import {
  registerMicroApps,
  addGlobalUncaughtErrorHandler,
  start,
} from "qiankun";

// 微应用注册信息
import apps from "./apps";

/**
 * 注册微应用
 * 第一个参数 - 微应用的注册信息
 * 第二个参数 - 全局生命周期钩子
 */
registerMicroApps(apps, {
  // qiankun 生命周期钩子 - 微应用加载前
  beforeLoad: (app: any) => {
    // 加载微应用前，加载进度条
    NProgress.start();
    console.log("before load", app.name);
    return Promise.resolve();
  },
  // qiankun 生命周期钩子 - 微应用挂载后
  afterMount: (app: any) => {
    // 加载微应用前，进度条加载完成
    NProgress.done();
    console.log("after mount", app.name);
    return Promise.resolve();
  },
});

/**
 * 添加全局的未捕获异常处理器
 */
addGlobalUncaughtErrorHandler((event: Event | string) => {
  console.error(event);
  const { message: msg } = event as any;
  // 加载失败时提示
  if (msg && msg.includes("died in status LOADING_SOURCE_CODE")) {
    message.error("微应用加载失败，请检查应用是否可运行");
  }
});

// 导出 qiankun 的启动函数
export default start;
```

从上面可以看出，我们的微应用注册信息在 `apps` 数组中（此时为空，我们在后面接入微应用时会添加微应用注册信息），然后使用 `qiankun` 的 `registerMicroApps` 方法注册微应用，最后导出了 `start` 函数，注册微应用的工作就完成啦！

### 启动主应用

我们在注册好了微应用，导出 `start` 函数后，我们需要在合适的地方调用 `start` 启动主应用。

我们一般是在入口文件启动 `qiankun` 主应用，代码实现如下：

```ts
// micro-app-main/src/main.ts
//...
import startQiankun from "./micro";

startQiankun();
```

最后，启动我们的主应用，效果图如下：

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/11.png)

因为我们还没有注册任何微应用，所以这里的效果图和上面的效果图是一样的。

到这一步，我们的主应用基座就创建好啦！

## 接入微应用

我们现在的主应用基座只有一个主页，现在我们需要接入微应用。

`qiankun` 内部通过 `import-entry-html` 加载微应用，要求微应用需要导出生命周期钩子函数（见下图）。

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/13.png)

从上图可以看出，`qiankun` 内部会校验微应用的生命周期钩子函数，如果微应用没有导出这三个生命周期钩子函数，则微应用会加载失败。

如果我们使用了脚手架搭建微应用的话，我们可以通过 `webpack` 配置在入口文件处导出这三个生命周期钩子函数。如果没有使用脚手架的话，也可以直接在微应用的 `window` 上挂载这三个生命周期钩子函数。

现在我们来接入我们的各个技术栈微应用吧！

> 注意，下面的内容对相关技术栈 `API` 不会再有过多介绍啦，如果你要接入不同技术栈的微应用，最好要对该技术栈有一些基础了解。

## 接入 `Vue` 微应用

我们以 [实战案例 - feature-inject-sub-apps 分支](https://github.com/a1029563229/micro-front-template/tree/feature-inject-sub-apps) 为例，我们在主应用的同级目录（`micro-app-main` 同级目录），使用 `vue-cli` 先创建一个 `Vue` 的项目，在命令行运行如下命令：

```bash
vue create micro-app-vue
```

本文的 `vue-cli` 选项如下图所示，你也可以根据自己的喜好选择配置。

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/14.png)

在新建项目完成后，我们创建几个路由页面再加上一些样式，最后效果如下：

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/15.png)

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/16.png)

### 注册微应用

在创建好了 `Vue` 微应用后，我们可以开始我们的接入工作了。首先我们需要在主应用中注册该微应用的信息，代码实现如下：

```ts
// micro-app-main/src/micro/apps.ts
const apps = [
  /**
   * name: 微应用名称 - 具有唯一性
   * entry: 微应用入口 - 通过该地址加载微应用
   * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
   * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
   */
  {
    name: "VueMicroApp",
    entry: "//localhost:10200",
    container: "#frame",
    activeRule: "/vue",
  },
];

export default apps;
```

通过上面的代码，我们就在主应用中注册了我们的 `Vue` 微应用，进入 `/vue` 路由时将加载我们的 `Vue` 微应用。

我们在菜单配置处也加入 `Vue` 微应用的快捷入口，代码实现如下：

```ts
// micro-app-main/src/App.vue
//...
export default class App extends Vue {
  /**
   * 菜单列表
   * key: 唯一 Key 值
   * title: 菜单标题
   * path: 菜单对应的路径
   */
  menus = [
    {
      key: "Home",
      title: "主页",
      path: "/",
    },
    {
      key: "VueMicroApp",
      title: "Vue 主页",
      path: "/vue",
    },
    {
      key: "VueMicroAppList",
      title: "Vue 列表页",
      path: "/vue/list",
    },
  ];
}
```

菜单配置完成后，我们的主应用基座效果图如下

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/17.png)

### 配置微应用

在主应用注册好了微应用后，我们还需要对微应用进行一系列的配置。首先，我们在 `Vue` 的入口文件 `main.js` 中，导出 `qiankun` 主应用所需要的三个生命周期钩子函数，代码实现如下：

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/19.png)

从上图来分析：

- `第 6 行`：`webpack` 默认的 `publicPath` 为 `""` 空字符串，会基于当前路径来加载资源。我们在主应用中加载微应用时需要重新设置 `publicPath`，这样才能正确加载微应用的相关资源。（`public-path.js` 具体实现在后面）
- `第 21 行`：微应用的挂载函数，在主应用中运行时将在 `mount` 生命周期钩子函数中调用，可以保证在沙箱内运行。
- `第 38 行`：微应用独立运行时，直接执行 `render` 函数挂载微应用。
- `第 46 行`：微应用导出的生命周期钩子函数 - `bootstrap`。
- `第 53 行`：微应用导出的生命周期钩子函数 - `mount`。
- `第 61 行`：微应用导出的生命周期钩子函数 - `unmount`。

完整代码实现如下：

```js
// micro-app-vue/src/public-path.js
if (window.__POWERED_BY_QIANKUN__) {
  // 动态设置 webpack publicPath，防止资源加载出错
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

// micro-app-vue/src/main.js
import Vue from "vue";
import VueRouter from "vue-router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import "./public-path";
import App from "./App.vue";
import routes from "./routes";

Vue.use(VueRouter);
Vue.use(Antd);
Vue.config.productionTip = false;

let instance = null;
let router = null;

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render() {
  // 在 render 中创建 VueRouter，可以保证在卸载微应用时，移除 location 事件监听，防止事件污染
  router = new VueRouter({
    // 运行在主应用中时，添加路由命名空间 /vue
    base: window.__POWERED_BY_QIANKUN__ ? "/vue" : "/",
    mode: "history",
    routes,
  });

  // 挂载应用
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#app");
}

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log("VueMicroApp bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log("VueMicroApp mount", props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("VueMicroApp unmount");
  instance.$destroy();
  instance = null;
  router = null;
}
```

在配置好了入口文件 `main.js` 后，我们还需要配置 `webpack`，使 `main.js` 导出的生命周期钩子函数可以被 `qiankun` 识别获取。

我们直接配置 `vue.config.js` 即可，代码实现如下：

```js
// micro-app-vue/vue.config.js
const path = require("path");

module.exports = {
  devServer: {
    // 监听端口
    port: 10200,
    // 关闭主机检查，使微应用可以被 fetch
    disableHostCheck: true,
    // 配置跨域请求头，解决开发环境的跨域问题
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: "VueMicroApp",
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: "umd",
      // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
      jsonpFunction: `webpackJsonp_VueMicroApp`,
    },
  },
};
```

我们需要重点关注一下 `output` 选项，当我们把 `libraryTarget` 设置为 `umd` 后，我们的 `library` 就暴露为所有的模块定义下都可运行的方式了，主应用就可以获取到微应用的生命周期钩子函数了。

在 `vue.config.js` 修改完成后，我们重新启动 `Vue` 微应用，然后打开主应用基座 `http://localhost:9999`。我们点击左侧菜单切换到微应用，此时我们的 `Vue` 微应用被正确加载啦！（见下图）

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/20.png)

此时我们打开控制台，可以看到我们所执行的生命周期钩子函数（见下图）

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/21.png)

到这里，`Vue` 微应用就接入成功了！

## 接入 `React` 微应用

我们以 [实战案例 - feature-inject-sub-apps 分支](https://github.com/a1029563229/micro-front-template/tree/feature-inject-sub-apps) 为例，我们在主应用的同级目录（`micro-app-main` 同级目录），使用 `react-create-app` 先创建一个 `React` 的项目，在命令行运行如下命令：

```bash
npx create-react-app micro-app-react
```

在项目创建完成后，我们在根目录下添加 `.env` 文件，设置项目监听的端口，代码实现如下：

```bash
# micro-app-react/.env
PORT=10100
BROWSER=none
```

然后，我们创建几个路由页面再加上一些样式，最后效果如下：

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/23.png)

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/24.png)

### 注册微应用

在创建好了 `React` 微应用后，我们可以开始我们的接入工作了。首先我们需要在主应用中注册该微应用的信息，代码实现如下：

```ts
// micro-app-main/src/micro/apps.ts
const apps = [
  /**
   * name: 微应用名称 - 具有唯一性
   * entry: 微应用入口 - 通过该地址加载微应用
   * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
   * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
   */
  {
    name: "ReactMicroApp",
    entry: "//localhost:10100",
    container: "#frame",
    activeRule: "/react",
  },
];

export default apps;
```

通过上面的代码，我们就在主应用中注册了我们的 `React` 微应用，进入 `/react` 路由时将加载我们的 `React` 微应用。

我们在菜单配置处也加入 `React` 微应用的快捷入口，代码实现如下：

```ts
// micro-app-main/src/App.vue
//...
export default class App extends Vue {
  /**
   * 菜单列表
   * key: 唯一 Key 值
   * title: 菜单标题
   * path: 菜单对应的路径
   */
  menus = [
    {
      key: "Home",
      title: "主页",
      path: "/",
    },
    {
      key: "ReactMicroApp",
      title: "React 主页",
      path: "/react",
    },
    {
      key: "ReactMicroAppList",
      title: "React 列表页",
      path: "/react/list",
    },
  ];
}
```

菜单配置完成后，我们的主应用基座效果图如下

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/25.png)

### 配置微应用

在主应用注册好了微应用后，我们还需要对微应用进行一系列的配置。首先，我们在 `React` 的入口文件 `index.js` 中，导出 `qiankun` 主应用所需要的三个生命周期钩子函数，代码实现如下：

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/27.png)

从上图来分析：

- `第 5 行`：`webpack` 默认的 `publicPath` 为 `""` 空字符串，会基于当前路径来加载资源。我们在主应用中加载微应用时需要重新设置 `publicPath`，这样才能正确加载微应用的相关资源。（`public-path.js` 具体实现在后面）
- `第 12 行`：微应用的挂载函数，在主应用中运行时将在 `mount` 生命周期钩子函数中调用，可以保证在沙箱内运行。
- `第 17 行`：微应用独立运行时，直接执行 `render` 函数挂载微应用。
- `第 25 行`：微应用导出的生命周期钩子函数 - `bootstrap`。
- `第 32 行`：微应用导出的生命周期钩子函数 - `mount`。
- `第 40 行`：微应用导出的生命周期钩子函数 - `unmount`。

完整代码实现如下：

```js
// micro-app-react/src/public-path.js
if (window.__POWERED_BY_QIANKUN__) {
  // 动态设置 webpack publicPath，防止资源加载出错
  // eslint-disable-next-line no-undef
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

// micro-app-react/src/index.js
import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";

import "./public-path";
import App from "./App.jsx";

/**
 * 渲染函数
 * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
 */
function render() {
  ReactDOM.render(<App />, document.getElementById("root"));
}

// 独立运行时，直接挂载应用
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log("ReactMicroApp bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  console.log("ReactMicroApp mount", props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("ReactMicroApp unmount");
  ReactDOM.unmountComponentAtNode(document.getElementById("root"));
}
```

在配置好了入口文件 `index.js` 后，我们还需要配置路由命名空间，以确保主应用可以正确加载微应用，代码实现如下：

```js
// micro-app-react/src/App.jsx
const BASE_NAME = window.__POWERED_BY_QIANKUN__ ? "/react" : "";
const App = () => {
  //...

  return (
    // 设置路由命名空间
    <Router basename={BASE_NAME}>{/* ... */}</Router>
  );
};
```

接下来，我们还需要配置 `webpack`，使 `index.js` 导出的生命周期钩子函数可以被 `qiankun` 识别获取。

我们需要借助 `react-app-rewired` 来帮助我们修改 `webpack` 的配置，我们直接安装该插件：

```bash
npm install react-app-rewired -D
```

在 `react-app-rewired` 安装完成后，我们还需要修改 `package.json` 的 `scripts` 选项，修改为由 `react-app-rewired` 启动应用，就像下面这样

```json
// micro-app-react/package.json

//...
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-app-rewired eject"
}
```

在 `react-app-rewired` 配置完成后，我们新建 `config-overrides.js` 文件来配置 `webpack`，代码实现如下：

```js
const path = require("path");

module.exports = {
  webpack: (config) => {
    // 微应用的包名，这里与主应用中注册的微应用名称一致
    config.output.library = `ReactMicroApp`;
    // 将你的 library 暴露为所有的模块定义下都可运行的方式
    config.output.libraryTarget = "umd";
    // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
    config.output.jsonpFunction = `webpackJsonp_ReactMicroApp`;

    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    return config;
  },

  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      // 关闭主机检查，使微应用可以被 fetch
      config.disableHostCheck = true;
      // 配置跨域请求头，解决开发环境的跨域问题
      config.headers = {
        "Access-Control-Allow-Origin": "*",
      };
      // 配置 history 模式
      config.historyApiFallback = true;

      return config;
    };
  },
};
```

我们需要重点关注一下 `output` 选项，当我们把 `libraryTarget` 设置为 `umd` 后，我们的 `library` 就暴露为所有的模块定义下都可运行的方式了，主应用就可以获取到微应用的生命周期钩子函数了。

在 `config-overrides.js` 修改完成后，我们重新启动 `React` 微应用，然后打开主应用基座 `http://localhost:9999`。我们点击左侧菜单切换到微应用，此时我们的 `React` 微应用被正确加载啦！（见下图）

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/28.png)

此时我们打开控制台，可以看到我们所执行的生命周期钩子函数（见下图）

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/29.png)

到这里，`React` 微应用就接入成功了！

## 接入 `Angular` 微应用

`Angular` 与 `qiankun` 目前的兼容性并不太好，接入 `Angular` 微应用需要一定的耐心与技巧。

> 对于选择 `Angular` 技术栈的前端开发来说，对这类情况应该驾轻就熟（没有办法）。

我们以 [实战案例 - feature-inject-sub-apps 分支](https://github.com/a1029563229/micro-front-template/tree/feature-inject-sub-apps) 为例，我们在主应用的同级目录（`micro-app-main` 同级目录），使用 `@angular/cli` 先创建一个 `Angular` 的项目，在命令行运行如下命令：

```bash
ng new micro-app-angular
```

本文的 `@angular/cli` 选项如下图所示，你也可以根据自己的喜好选择配置。

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/30.png)

然后，我们创建几个路由页面再加上一些样式，最后效果如下：

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/31.png)

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/32.png)

### 注册微应用

在创建好了 `Angular` 微应用后，我们可以开始我们的接入工作了。首先我们需要在主应用中注册该微应用的信息，代码实现如下：

```ts
// micro-app-main/src/micro/apps.ts
const apps = [
  /**
   * name: 微应用名称 - 具有唯一性
   * entry: 微应用入口 - 通过该地址加载微应用
   * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
   * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
   */
  {
    name: "AngularMicroApp",
    entry: "//localhost:10300",
    container: "#frame",
    activeRule: "/angular",
  },
];

export default apps;
```

通过上面的代码，我们就在主应用中注册了我们的 `Angular` 微应用，进入 `/angular` 路由时将加载我们的 `Angular` 微应用。

我们在菜单配置处也加入 `Angular` 微应用的快捷入口，代码实现如下：

```ts
// micro-app-main/src/App.vue
//...
export default class App extends Vue {
  /**
   * 菜单列表
   * key: 唯一 Key 值
   * title: 菜单标题
   * path: 菜单对应的路径
   */
  menus = [
    {
      key: "Home",
      title: "主页",
      path: "/",
    },
    {
      key: "AngularMicroApp",
      title: "Angular 主页",
      path: "/angular",
    },
    {
      key: "AngularMicroAppList",
      title: "Angular 列表页",
      path: "/angular/list",
    },
  ];
}
```

菜单配置完成后，我们的主应用基座效果图如下

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/33.png)

最后我们在主应用的入口文件，引入 `zone.js`，代码实现如下：

> `Angular` 运行依赖于 `zone.js`。
>
> `qiankun` 基于 `single-spa` 实现，`single-spa` 明确指出一个项目的 `zone.js` 只能存在一份实例，所以我们在主应用注入 `zone.js`。

```js
// micro-app-main/src/main.js

// 为 Angular 微应用所做的 zone 包注入
import "zone.js/dist/zone";
```

### 配置微应用

在主应用的工作完成后，我们还需要对微应用进行一系列的配置。首先，我们使用 `single-spa-angular` 生成一套配置，在命令行运行以下命令：

```bash
# 安装 single-spa
yarn add single-spa -S

# 添加 single-spa-angular
ng add single-spa-angular
```

运行命令时，根据自己的需求选择配置即可，本文配置如下：

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/34.png)

在生成 `single-spa` 配置后，我们需要进行一些 `qiankun` 的接入配置。我们在 `Angular` 微应用的入口文件 `main.single-spa.ts` 中，导出 `qiankun` 主应用所需要的三个生命周期钩子函数，代码实现如下：

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/35.png)

从上图来分析：

- `第 21 行`：微应用独立运行时，直接执行挂载函数挂载微应用。
- `第 46 行`：微应用导出的生命周期钩子函数 - `bootstrap`。
- `第 50 行`：微应用导出的生命周期钩子函数 - `mount`。
- `第 54 行`：微应用导出的生命周期钩子函数 - `unmount`。

完整代码实现如下：

```ts
// micro-app-angular/src/main.single-spa.ts
import { enableProdMode, NgZone } from "@angular/core";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { Router } from "@angular/router";
import { ɵAnimationEngine as AnimationEngine } from "@angular/animations/browser";

import {
  singleSpaAngular,
  getSingleSpaExtraProviders,
} from "single-spa-angular";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import { singleSpaPropsSubject } from "./single-spa/single-spa-props";

if (environment.production) {
  enableProdMode();
}

// 微应用单独启动时运行
if (!(window as any).__POWERED_BY_QIANKUN__) {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
}

const { bootstrap, mount, unmount } = singleSpaAngular({
  bootstrapFunction: (singleSpaProps) => {
    singleSpaPropsSubject.next(singleSpaProps);
    return platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(
      AppModule
    );
  },
  template: "<app-root />",
  Router,
  NgZone,
  AnimationEngine,
});

/** 主应用生命周期钩子中运行 */
export {
  /**
   * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
   * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
   */
  bootstrap,
  /**
   * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
   */
  mount,
  /**
   * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
   */
  unmount,
};
```

在配置好了入口文件 `main.single-spa.ts` 后，我们还需要配置 `webpack`，使 `main.single-spa.ts` 导出的生命周期钩子函数可以被 `qiankun` 识别获取。

我们直接配置 `extra-webpack.config.js` 即可，代码实现如下：

```js
// micro-app-angular/extra-webpack.config.js
const singleSpaAngularWebpack = require("single-spa-angular/lib/webpack")
  .default;
const webpackMerge = require("webpack-merge");

module.exports = (angularWebpackConfig, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(
    angularWebpackConfig,
    options
  );

  const singleSpaConfig = {
    output: {
      // 微应用的包名，这里与主应用中注册的微应用名称一致
      library: "AngularMicroApp",
      // 将你的 library 暴露为所有的模块定义下都可运行的方式
      libraryTarget: "umd",
    },
  };
  const mergedConfig = webpackMerge.smart(
    singleSpaWebpackConfig,
    singleSpaConfig
  );
  return mergedConfig;
};
```

我们需要重点关注一下 `output` 选项，当我们把 `libraryTarget` 设置为 `umd` 后，我们的 `library` 就暴露为所有的模块定义下都可运行的方式了，主应用就可以获取到微应用的生命周期钩子函数了。

在 `extra-webpack.config.js` 修改完成后，我们还需要修改一下 `package.json` 中的启动命令，修改如下：

```json
// micro-app-angular/package.json
{
  //...
  "script": {
    //...
    // --disable-host-check: 关闭主机检查，使微应用可以被 fetch
    // --port: 监听端口
    // --base-href: 站点的起始路径，与主应用中配置的一致
    "start": "ng serve --disable-host-check --port 10300 --base-href /angular"
  }
}
```

修改完成后，我们重新启动 `Angular` 微应用，然后打开主应用基座 `http://localhost:9999`。我们点击左侧菜单切换到微应用，此时我们的 `Angular` 微应用被正确加载啦！（见下图）

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/36.png)

到这里，`Angular` 微应用就接入成功了！

## 接入 `Jquery、xxx...` 微应用

> 这里的 `Jquery、xxx...` 微应用指的是没有使用脚手架，直接采用 `html + css + js` 三剑客开发的应用。
> 
> 本案例使用了一些高级 `ES` 语法，请使用谷歌浏览器运行查看效果。

我们以 [实战案例 - feature-inject-sub-apps 分支](https://github.com/a1029563229/micro-front-template/tree/feature-inject-sub-apps) 为例，我们在主应用的同级目录（`micro-app-main` 同级目录），手动创建目录 `micro-app-static`。

我们使用 `express` 作为服务器加载静态 `html`，我们先编辑 `package.json`，设置启动命令和相关依赖。

```json
// micro-app-static/package.json
{
  "name": "micro-app-jquery",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "start": "nodemon index.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^2.0.2"
  }
}
```

然后添加入口文件 `index.js`，代码实现如下：

```js
// micro-app-static/index.js
const express = require("express");
const cors = require("cors");

const app = express();
// 解决跨域问题
app.use(cors());
app.use('/', express.static('static'));

// 监听端口
app.listen(10400, () => {
  console.log("server is listening in http://localhost:10400")
});
```

使用 `npm install` 安装相关依赖后，我们使用 `npm start` 启动应用。

我们新建 `static` 文件夹，在文件夹内新增一个静态页面 `index.html`（代码在后面会贴出），加上一些样式后，打开浏览器，最后效果如下：

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/37.png)

### 注册微应用

在创建好了 `Static` 微应用后，我们可以开始我们的接入工作了。首先我们需要在主应用中注册该微应用的信息，代码实现如下：

```ts
// micro-app-main/src/micro/apps.ts
const apps = [
  /**
   * name: 微应用名称 - 具有唯一性
   * entry: 微应用入口 - 通过该地址加载微应用
   * container: 微应用挂载节点 - 微应用加载完成后将挂载在该节点上
   * activeRule: 微应用触发的路由规则 - 触发路由规则后将加载该微应用
   */
  {
    name: "StaticMicroApp",
    entry: "//localhost:10400",
    container: "#frame",
    activeRule: "/static"
  },
];

export default apps;
```

通过上面的代码，我们就在主应用中注册了我们的 `Static` 微应用，进入 `/static` 路由时将加载我们的 `Static` 微应用。

我们在菜单配置处也加入 `Static` 微应用的快捷入口，代码实现如下：

```ts
// micro-app-main/src/App.vue
//...
export default class App extends Vue {
  /**
   * 菜单列表
   * key: 唯一 Key 值
   * title: 菜单标题
   * path: 菜单对应的路径
   */
  menus = [
    {
      key: "Home",
      title: "主页",
      path: "/"
    },
    {
      key: "StaticMicroApp",
      title: "Static 微应用",
      path: "/static"
    }
  ];
}
```

菜单配置完成后，我们的主应用基座效果图如下

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/38.png)

### 配置微应用

在主应用注册好了微应用后，我们还需要直接写微应用 `index.html` 的代码即可，代码实现如下：

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/39.png)

从上图来分析：
  - `第 70 行`：微应用的挂载函数，在主应用中运行时将在 `mount` 生命周期钩子函数中调用，可以保证在沙箱内运行。
  - `第 77 行`：微应用独立运行时，直接执行 `render` 函数挂载微应用。
  - `第 88 行`：微应用注册的生命周期钩子函数 - `bootstrap`。
  - `第 95 行`：微应用注册的生命周期钩子函数 - `mount`。
  - `第 102 行`：微应用注册的生命周期钩子函数 - `unmount`。

完整代码实现如下：

```html
<!-- micro-app-static/static/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <!-- 引入 bootstrap -->
    <link
      href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/4.4.1/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <title>Jquery App</title>
  </head>

  <body>
    <section
      id="jquery-app-container"
      style="padding: 20px; color: blue;"
    ></section>
  </body>
  <!-- 引入 jquery -->
  <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script>
    /**
     * 请求接口数据，构建 HTML
     */
    async function buildHTML() {
      const result = await fetch("http://dev-api.jt-gmall.com/mall", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // graphql 的查询风格
        body: JSON.stringify({
          query: `{ vegetableList (page: 1, pageSize: 20) { page, pageSize, total, items { _id, name, poster, price } } }`,
        }),
      }).then((res) => res.json());
      const list = result.data.vegetableList.items;
      const html = `<table class="table">
  <thead>
    <tr>
      <th scope="col">菜名</th>
      <th scope="col">图片</th>
      <th scope="col">报价</th>
    </tr>
  </thead>
  <tbody>
    ${list
      .map(
        (item) => `
    <tr>
      <td>
        <img style="width: 40px; height: 40px; border-radius: 100%;" src="${item.poster}"></img>
      </td>
      <td>${item.name}</td>
      <td>￥ ${item.price}</td>
    </tr>
      `
      )
      .join("")}
  </tbody>
</table>`;
      return html;
    }

    /**
     * 渲染函数
     * 两种情况：主应用生命周期钩子中运行 / 微应用单独启动时运行
     */
    const render = async ($) => {
      const html = await buildHTML();
      $("#jquery-app-container").html(html);
      return Promise.resolve();
    };

    // 独立运行时，直接挂载应用
    if (!window.__POWERED_BY_QIANKUN__) {
      render($);
    }

    ((global) => {
      /**
       * 注册微应用生命周期钩子函数
       * global[appName] 中的 appName 与主应用中注册的微应用名称一致
       */
      global["StaticMicroApp"] = {
        /**
         * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
         * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
         */
        bootstrap: () => {
          console.log("MicroJqueryApp bootstraped");
          return Promise.resolve();
        },
        /**
         * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
         */
        mount: () => {
          console.log("MicroJqueryApp mount");
          return render($);
        },
        /**
         * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
         */
        unmount: () => {
          console.log("MicroJqueryApp unmount");
          return Promise.resolve();
        },
      };
    })(window);
  </script>
</html>
```

在构建好了 `Static` 微应用后，我们打开主应用基座 `http://localhost:9999`。我们点击左侧菜单切换到微应用，此时可以看到，我们的 `Static` 微应用被正确加载啦！（见下图）

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/40.png)

此时我们打开控制台，可以看到我们所执行的生命周期钩子函数（见下图）

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/41.png)

到这里，`Static` 微应用就接入成功了！

### 扩展阅读

如果在 `Static` 微应用的 `html` 中注入 `SPA` 路由功能的话，将演变成单页应用，只需要在主应用中注册一次。

如果是多个 `html` 的多页应用 - `MPA`，则需要在服务器（或反向代理服务器）中通过 `referer` 头返回对应的 `html` 文件，或者在主应用中注册多个微应用（不推荐）。

## 小结

最后，我们所有微应用都注册在主应用和主应用的菜单中，效果图如下：

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/42.png)

从上图可以看出，我们把不同技术栈 `Vue、React、Angular、Jquery...` 的微应用都已经接入到主应用基座中啦！