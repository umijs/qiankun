---
nav:
  title: 常见问题
toc: menu
---

# 常见问题

## `Application died in status LOADING_SOURCE_CODE: You need to export the functional lifecycles in xxx entry`

qiankun 抛出这个错误是因为无法从微应用的 entry js 中识别出其导出的生命周期钩子。

可以通过以下几个步骤解决这个问题：

1. 检查微应用是否已经导出相应的生命周期钩子，参考[文档](/zh/guide/getting-started#1-导出相应的生命周期钩子)。

2. 检查微应用的 webpack 是否增加了指定的配置，参考[文档](/zh/guide/getting-started#2-配置微应用的打包工具)。

3. 检查微应用的 webpack 是否配置了 `output.globalObject` 的值，如果有请确保其值为 `window`，或者移除该配置从而使用默认值。

4. 检查微应用的 `package.json` 中的 `name` 字段是否是微应用中唯一的。

5. 检查微应用的 entry html 中入口的 js 是不是最后一个加载的脚本。如果不是，需要移动顺序将其变成最后一个加载的 js，或者在 html 中将入口 js 手动标记为 `entry`，如：

   ```html {2}
   <script src="/antd.js"></script>
   <script src="/appEntry.js" entry></script>
   <script src="https://www.google.com/analytics.js"></script>
   ```

6. 如果开发环境可以，生产环境不行，检查微应用的 `index.html` 和 `entry js` 是否正常返回，比如说返回了 `404.html`。

7. 如果你正在使用 webpack5，请看[这个 issues](https://github.com/umijs/qiankun/issues/1092)

如果在上述步骤完成后仍有问题，通常说明是浏览器兼容性问题导致的。可以尝试 **将有问题的微应用的 webpack `output.library` 配置成跟主应用中注册的 `name` 字段一致**，如：

假如主应用配置是这样的：

```ts {4}
// 主应用
registerMicroApps([
  {
    name: 'brokenSubApp',
    entry: '//localhost:7100',
    container: '#yourContainer',
    activeRule: '/react',
  },
]);
```

将微应用的 `output.library` 改为跟主应用中注册的一致：

```js {4}
module.exports = {
  output: {
    // 这里改成跟主应用中注册的一致
    library: 'brokenSubApp',
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${packageName}`,
  },
};
```

## `Application died in status NOT_MOUNTED: Target container with #container not existed after xxx mounted!`

qiankun 抛出这个错误是因为微应用加载后容器 DOM 节点不存在了。可能的原因有：

1. 微应用的根 `id` 与其他 DOM 冲突。解决办法是：修改根 `id` 的查找范围。

   `vue` 微应用：

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

   `react` 微应用：

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

2. 微应用的某些 js 里面使用了 `document.write`，比如高德地图 1.x 版本，腾讯地图 2.x 版本。

   如果是地图 js 导致的，先看看升级能否解决，比如说高德地图升级到 2.x 版本即可。

   如果升级无法解决，建议将地图放到主应用加载，微应用也引入这个地图 js（独立运行时使用），但是给 `<script>` 标签加上 `ignore` 属性：

   ```html
   <script src="https://map.qq.com/api/gljs?v=1.exp" ignore></script>
   ```

   如果是其他的情况，请不要使用 `document.write` 。

## `Application died in status NOT_MOUNTED: Target container with #container not existed while xxx mounting!`

这个报错通常出现在主应用为 vue 时，容器写在了路由页面并且使用了路由过渡效果，一些特殊的过渡效果会导致微应用在 mounting 的过程中容器不存在，解决办法就是换成其他的过渡效果，或者去掉路由过渡。

## `Application died in status NOT_MOUNTED: Target container with #container not existed while xxx loading!`

与上面的报错类似，这个报错是因为微应用加载时容器 DOM 不存在。一般是因为 `start` 函数调用时机不正确导致的，调整 `start` 函数调用时机即可。

如何判断容器 DOM 加载完成？vue 应用可以在 `mounted` 生命周期调用，react 应用可以在 `componentDidMount` 生命周期调用。

如果仍然报错，检查容器 DOM 是否放在了主应用的某个路由页面，请参考[如何在主应用的某个路由页面加载微应用](#如何在主应用的某个路由页面加载微应用)。

## 如何在主应用的某个路由页面加载微应用

必须保证微应用加载时主应用这个路由页面也加载了。

`vue` + `vue-router` 技术栈的主应用：

1. 主应用注册这个路由时给 `path` 加一个 `*`，**注意：如果这个路由有其他子路由，需要另外注册一个路由，仍然使用这个组件即可**。
   ```js
   const routes = [
     {
       path: '/portal/*',
       name: 'portal',
       component: () => import('../views/Portal.vue'),
     },
   ];
   ```
2. 微应用的 `activeRule` 需要包含主应用的这个路由 `path`。
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
3. 在 `Portal.vue` 这个组件的 `mounted` 周期调用 `start` 函数，**注意不要重复调用**。
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

`react` + `react-router` 技术栈的主应用：只需要让微应用的 `activeRule` 包含主应用的这个路由即可。

`angular` + `angular-router` 技术栈的主应用，与 vue 项目类似：

1. 主应用给这个路由注册一个通配符的子路由，内容为空。

   ```ts
   const routes: Routes = [
     {
       path: 'portal',
       component: PortalComponent,
       children: [{ path: '**', component: EmptyComponent }],
     },
   ];
   ```

2. 微应用的 `activeRule` 需要包含主应用的这个路由 `path`。
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
3. 在这个路由组件的 `ngAfterViewInit` 周期调用 `start` 函数，**注意不要重复调用**。
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

## Vue Router 报错 `Uncaught TypeError: Cannot redefine property: $router`

qiankun 中的代码使用 Proxy 去代理父页面的 window，来实现的沙箱，在微应用中访问 `window.Vue` 时，会先在自己的 window 里查找有没有 `Vue` 属性，如果没有就去父应用里查找。

在 VueRouter 的代码里有这样三行代码，会在模块加载的时候就访问 `window.Vue` 这个变量，微应用中报这个错，一般是由于父应用中的 Vue 挂载到了父应用的 `window` 对象上了。

```javascript
if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}
```

可以从以下方式中选择一种来解决问题：

1. 在主应用中不使用 CDN 等 external 的方式来加载 `Vue` 框架，使用前端打包软件来加载模块
2. 在主应用中，将 `window.Vue` 变量改个名称，例如 `window.Vue2 = window.Vue; window.Vue = undefined`

## 为什么微应用加载的资源会 404？

原因是 webpack 加载资源时未使用正确的 `publicPath`。

可以通过以下两个方式解决这个问题：

### a. 使用 webpack 运行时 publicPath 配置

qiankun 将会在微应用 bootstrap 之前注入一个运行时的 publicPath 变量，你需要做的是在微应用的 entry js 的顶部添加如下代码：

```js
__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
```

关于运行时 publicPath 的技术细节，可以参考 [webpack 文档](https://webpack.js.org/guides/public-path/#on-the-fly)。

<Alert type="info">
runtime publicPath 主要解决的是微应用动态载入的 脚本、样式、图片 等地址不正确的问题。
</Alert>

### b. 使用 webpack 静态 publicPath 配置

你需要将你的 webpack `publicPath` 配置设置成一个绝对地址的 url，比如在开发环境可能是：

```js
{
  output: {
    publicPath: `//localhost:${port}`,
  }
}
```

### 微应用打包之后 css 中的字体文件和图片加载 404

原因是 `qiankun` 将外链样式改成了内联样式，但是字体文件和背景图片的加载路径是相对路径。

而 `css` 文件一旦打包完成，就无法通过动态修改 `publicPath` 来修正其中的字体文件和背景图片的路径。

主要有以下几个解决方案：

1. 所有图片等静态资源上传至 `cdn`，`css` 中直接引用 `cdn` 地址（**推荐**）

2. 借助 `webpack` 的 `url-loader` 将字体文件和图片打包成 `base64`（适用于字体文件和图片体积小的项目）（**推荐**）

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

`vue-cli3` 项目写法：

```js
module.exports = {
  chainWebpack: (config) => {
    config.module.rule('fonts').use('url-loader').loader('url-loader').options({}).end();
    config.module.rule('images').use('url-loader').loader('url-loader').options({}).end();
  },
};
```

3. 借助 `webpack` 的 `file-loader` ，在打包时给其注入完整路径（适用于字体文件和图片体积比较大的项目）

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

`vue-cli3` 项目写法：

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

4. 将两种方案结合起来，小文件转 `base64` ，大文件注入路径前缀

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

`vue-cli3` 项目写法：

```js
const publicPath = process.env.NODE_ENV === 'production' ? 'https://qiankun.umijs.org/' : `http://localhost:${port}`;
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // 小于4kb将会被打包成 base64
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
        limit: 4096, // 小于4kb将会被打包成 base64
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

5. `vue-cli3` 项目可以将 `css` 打包到 `js`里面，不单独生成文件(不推荐，仅适用于 `css` 较少的项目)

配置参考 [vue-cli3 官网](https://cli.vuejs.org/zh/config/#css-extract):

```js
module.exports = {
  css: {
    extract: false,
  },
};
```

## 微应用静态资源一定要支持跨域吗？

是的。

由于 qiankun 是通过 fetch 去获取微应用的引入的静态资源的，所以必须要求这些静态资源支持[跨域](https://developer.mozilla.org/zh/docs/Web/HTTP/Access_control_CORS)。

如果是自己的脚本，可以通过开发服务端跨域来支持。如果是三方脚本且无法为其添加跨域头，可以将脚本拖到本地，由自己的服务器 serve 来支持跨域。

参考：[Nginx 跨域配置](https://segmentfault.com/a/1190000012550346)

## 如何解决由于运营商动态插入的脚本加载异常导致微应用加载失败的问题

运营商插入的脚本通常会用 async 标记从而避免 block 微应用的加载，这种通常没问题，如：

```html
<script async src="//www.rogue.com/rogue.js"></script>
```

但如果有些插入的脚本不是被标记成 async 的，这类脚本一旦运行失败，将会导致整个应用被 block 且后续的脚本也不再执行。我们可以通过以下几个方式来解决这个问题：

### 使用自定义的 getTemplate 方法

通过自己实现的 getTemplate 方法过滤微应用 HTML 模板中的异常脚本

```js
import { start } from 'qiankun';

start({
  getTemplate(tpl) {
    return tpl.replace('<script src="/to-be-replaced.js"><script>', '');
  },
});
```

### 使用自定义的 fetch 方法

通过自己实现的 fetch 方法拦截有问题的脚本

```js
import { start } from 'qiankun';

start({
  fetch(url, ...args) {
    if (url === 'http://to-be-replaced.js') {
      return {
        async text() {
          return '';
        },
      };
    }

    return window.fetch(url, ...args);
  },
});
```

### 将微应用的 HTML 的 response content-type 改为 text/plain（终极方案）

原理是运营商只能识别 response content-type 为 text/html 的请求并插入脚本，text/plain 类型的响应则不会被劫持。

修改微应用 HTML 的 content-type 方法可以自行 google，也有一个更简单高效的方案：

1. 微应用发布时从 index.html 复制出一个 index.txt 文件出来

2. 将主应用中的 entry 改为 txt 地址，如：

   ```diff
   registerMicroApps(
     [
   -    { name: 'app1', entry: '//localhost:8080/index.html', container, activeRule },
   +    { name: 'app1', entry: '//localhost:8080/index.txt', container, activeRule },
     ],
   );
   ```

## 如何确保主应用跟微应用之间的样式隔离

qiankun 将会自动隔离微应用之间的样式（开启沙箱的情况下），你可以通过手动的方式确保主应用与微应用之间的样式隔离。比如给主应用的所有样式添加一个前缀，或者假如你使用了 [ant-design](https://ant.design) 这样的组件库，你可以通过[这篇文档](https://ant.design/docs/react/customize-theme)中的配置方式给主应用样式自动添加指定的前缀。

以 antd 为例：

1. 配置 webpack 修改 less 变量

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

2. 配置 antd [ConfigProvider](https://ant.design/components/config-provider-cn/)

   ```jsx
   import { ConfigProvider } from 'antd';

   export const MyApp = () => (
     <ConfigProvider prefixCls="yourPrefix">
       <App />
     </ConfigProvider>
   );
   ```

详细文档参考 [antd 官方指南](https://ant.design/docs/react/customize-theme)。

<Alert type="info">
在最新的 qiankun 版本中，你也可以尝试通过配置 `{ sandbox : { experimentalStyleIsolation: true } }` 的方式开启运行时的 scoped css 功能，从而解决应用间的样式隔离问题。
PS：目前该特性还处于实验阶段，如果碰到一些问题欢迎提 <a href="https://github.com/umijs/qiankun/issues/new?assignees=&labels=&template=bug_report_cn.md&title=%5BBug%5D%E8%AF%B7%E9%81%B5%E5%BE%AA%E4%B8%8B%E6%96%87%E6%A8%A1%E6%9D%BF%E6%8F%90%E4%BA%A4%E9%97%AE%E9%A2%98%EF%BC%8C%E5%90%A6%E5%88%99%E6%82%A8%E7%9A%84%E9%97%AE%E9%A2%98%E4%BC%9A%E8%A2%AB%E5%85%B3%E9%97%AD" target="_blank">issue</a> 来帮助我们一起改善。
</Alert>

## 如何独立运行微应用？

有些时候我们希望直接启动微应用从而更方便的开发调试，你可以使用这个全局变量来区分当前是否运行在 qiankun 的主应用的上下文中：

```ts
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export const mount = async () => render();
```

## 如何同时激活两个微应用？

微应用何时被激活完全取决于你的 `activeRule` 配置，比如下面的例子里，我们将 `reactApp` 和 `react15App` 的 `activeRule` 逻辑设置成一致的：

```js {2,3,7}
registerMicroApps([
  { name: 'reactApp', entry: '//localhost:7100', container, activeRule: () => isReactApp() },
  { name: 'react15App', entry: '//localhost:7102', container, activeRule: () => isReactApp() },
  { name: 'vueApp', entry: '//localhost:7101', container, activeRule: () => isVueApp() },
]);

start({ singular: false });
```

当在 `start` 方法中配置好 `singular: false` 后，只要 `isReactApp()` 返回 `true` 时，`reactApp` 和 `react15App` 将会同时被 mount。

<Alert>
页面上不能同时显示多个依赖于路由的微应用，因为浏览器只有一个 url，如果有多个依赖路由的微应用同时被激活，那么必定会导致其中一个 404。
</Alert>

## 如何提取出公共的依赖库？

> 不要共享运行时，即便所有的团队都是用同一个框架。- [微前端](https://micro-frontends.org/)

虽然共享依赖并不建议，但如果你真的有这个需求，你可以在微应用中将公共依赖配置成 `external`，然后在主应用中导入这些公共依赖。

qiankun 2.0 版本将提供一种更智能的方式使其自动化。

## qiankun 能兼容 ie 吗？

> 兼容.

但是 IE 环境下（不支持 Proxy 的浏览器）只能使用单实例模式，qiankun 会自动将 `singular` 配置为 `true`。

你可以在[这里](/zh/api#startopts)找到 singular 相关说明。

### 如何给 ie 打补丁？

如果希望 qiankun （或其依赖库、或者您的应用本身）在 IE 下正常运行，你**至少**需要在应用入口引入以下这些 polyfills：

<Alert type="info">
什么是 <a href="https://developer.mozilla.org/zh-CN/docs/Glossary/Polyfill" target="_blank">polyfill</a>
</Alert>

```javascript
import 'whatwg-fetch';
import 'custom-event-polyfill';
import 'core-js/stable/promise';
import 'core-js/stable/symbol';
import 'core-js/stable/string/starts-with';
import 'core-js/web/url';
```

**通常我们建议您直接使用 @babel/preset-env 插件完成自动引入 IE 需要的 polyfill 的能力，所有的操作文档您都可以在 [babel 官方文档](https://babeljs.io/docs/en/babel-preset-env) 找到。**

<Alert type="info">
您也可以查看<a href="https://www.yuque.com/kuitos/gky7yw/qskte2" target="_blank">这篇文章</a>来获取更多 IE 兼容相关的知识。
</Alert>

## 报错 `Here is no "fetch" on the window env, you need to polyfill it`

qiankun 依赖的 import-html-entry 通过 `window.fetch` 来获取微应用的资源， 部分[不支持 fetch 的浏览器](https://caniuse.com/#search=fetch)需要在入口处打上相应的 [polyfill](https://github.com/github/fetch)

## 微应用 JSONP 跨域错误怎么处理？

qiankun 会将微应用的动态 script 加载（例如 JSONP）转化为 fetch 请求，因此需要相应的后端服务支持跨域，否则会导致错误。

在单实例模式下，你可以使用 `excludeAssetFilter` 参数来放行这部分资源请求，但是注意，被该选项放行的资源会逃逸出沙箱，由此带来的副作用需要你自行处理。

若在多实例模式下使用 JSONP，单纯使用 `excludeAssetFilter` 并不能取得好的效果，因为各应用被沙箱所隔离；你可以在主应用提供统一的 JSONP 工具，微应用调用主应用提供的该工具来曲线救国。

## 微应用路径下刷新后 404？

通常是因为你使用的是 browser 模式的路由，这种路由模式的开启需要服务端配合才行。具体配置方式参考：

- [HTML5 History 模式](https://router.vuejs.org/zh/guide/essentials/history-mode.html)
- [browserHistory](https://react-guide.github.io/react-router-cn/docs/guides/basics/Histories.html#browserHistory)

## 主应用如何配置 404 页面？

首先不应该写通配符 `*` ，可以将 404 页面注册为一个普通路由页面，比如说 `/404` ，然后在主应用的路由钩子函数里面判断一下，如果既不是主应用路由，也不是微应用，就跳转到 404 页面。

以`vue-router`为例，伪代码如下：

```js
const childrenPath = ['/app1', '/app2'];
router.beforeEach((to, from, next) => {
  if (to.name) {
    // 有 name 属性，说明是主应用的路由
    next();
  }
  if (childrenPath.some((item) => to.path.includes(item))) {
    next();
  }
  next({ name: '404' });
});
```

## 微应用之间如何跳转？

- 主应用和微应用都是 `hash` 模式，主应用根据 `hash` 来判断微应用，则不用考虑这个问题。

- 主应用根据 `path` 来判断微应用

  `history` 模式的微应用之间的跳转，或者微应用跳主应用页面，直接使用微应用的路由实例是不行的，原因是微应用的路由实例跳转都基于路由的 `base`。有两种办法可以跳转：

  1. `history.pushState()`：[mdn 用法介绍](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState)
  2. 将主应用的路由实例通过 `props` 传给微应用，微应用这个路由实例跳转。

## 微应用文件更新之后，访问的还是旧版文件

服务器需要给微应用的 `index.html` 配置一个响应头：`Cache-Control no-cache`，意思就是每次请求都检查是否更新。

以 `Nginx` 为例:

```
location = /index.html {
  add_header Cache-Control no-cache;
}
```

## 使用 config entry 时微应用样式丢失

有些场景下我们会使用 config entry 的方式加载微应用（**不推荐**）：

```js
loadMicroApp({
  name: 'configEntry',
  entry: {
    scripts: ['//t.com/t.js'],
    styles: ['//t.com/t.css'],
  },
});
```

微应用的 entry js 由于没有附属的 html，mount 钩子直接这么写的：

```js
export async function mount(props) {
  ReactDOM.render(<App />, props.container);
}
```

因为 `props.container` 并不是一个空的容器，里面会包含微应用通过 styles 配置注册进来的样式表等信息，所以当我们直接以`props.container` 为 react 应用的容器渲染时，会把容器里原来的所有 dom 结构全部覆盖掉，从而导致样式表丢失。

我们需要给使用 config entry 的微应用构造一个空的渲染容器，专门用来挂载 react 应用：

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

mount 钩子里不是直接渲染到 `props.container` ，而是渲染到其 `root` 节点里：

```diff
export async function mount(props) {
- ReactDOM.render(<App/>, props.container);
+ ReactDOM.render(<App/>, props.container.querySelector('#root'));
}
```

## 如何解决拉取微应用 entry 时 cookie 未携带的问题

因为拉取微应用 entry 的请求都是跨域的，所以当你的微应用是依赖 cookie (如登陆鉴权)的情况下，你需要通过自定义 fetch 的方式，开启 fetch 的 cors 模式：

- 如果你是通过 [registerMicroApps](/zh/api#registermicroappsapps-lifecycles) 加载微应用的，你需要在 start 方法里配置自定义 fetch，如：

  ```js
  import { start } from 'qiankun';

  start({
    fetch(url, ...args) {
      // 给指定的微应用 entry 开启跨域请求
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

- 如果你是通过 [loadMicroApp](/zh/api#loadmicroappapp-configuration) 加载微应用的，你需要在调用时配置自定义 fetch，如：

  ```js
  import { loadMicroApp } from 'qiankun';

  loadMicroApp(app, {
    fetch(url, ...args) {
      // 给指定的微应用 entry 开启跨域请求
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

- 如果你是通过 [umi plugin](https://umijs.org/zh-CN/plugins/plugin-qiankun) 来使用 qiankun 的，那么你只需要给对应的微应用开启 credentials 配置即可：

  ```diff
  export default {
    qiankun: {
      master: {
        apps: [
          {
            name: 'app',
            entry: '//app.alipay.com/entry.html',
  +         credentials: true,
          }
        ]
      }
    }
  }
  ```
