# 常见问题

## `Application died in status LOADING_SOURCE_CODE: You need to export the functional lifecycles in xxx entry`

qiankun 抛出这个错误是因为无法从子应用的 entry js 中识别出其导出的生命周期钩子。

可以通过以下几个步骤解决这个问题：

1. 检查子应用是否已经导出相应的生命周期钩子，参考[文档](/zh/guide/getting-started.html#_1-导出相应的生命周期钩子)。

2. 检查子应用的 webpack 是否增加了指定的配置，参考[文档](/zh/guide/getting-started.html#_2-配置子应用的打包工具)。

3. 检查子应用的 `package.json` 中的 `name` 字段是否是子应用中唯一的。

4. 检查子应用的 entry html 中入口的 js 是不是最后一个加载的脚本。如果不是，需要移动顺序将其变成最后一个加载的 js，或者在 html 中将入口 js 手动标记为 `entry`，如：

   ```html {2}
   <script src="/antd.js"></script>
   <script src="/appEntry.js" entry></script>
   <script src="https://www.google.com/analytics.js"></script>
   ```

如果在上述步骤完成后仍有问题，通常说明是浏览器兼容性问题导致的。可以尝试 **将有问题的子应用的 webpack `output.library` 配置成跟主应用中注册的 `name` 字段一致**，如：

假如主应用配置是这样的：

```ts {4}
// 主应用
registerMicroApps([
  {
    name: 'brokenSubApp',
    entry: '//localhost:7100',
    render,
    activeRule: genActiveRule('/react'),
  },
]);
```

将子应用的 `output.library` 改为跟主应用中注册的一致：

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

## 为什么子应用加载的资源会 404？

原因是 webpack 加载资源时未使用正确的 `publicPath`。

可以通过以下两个方式解决这个问题：

### a. 使用 webpack 运行时 publicPath 配置

qiankun 将会在子应用 bootstrap 之前注入一个运行时的 publicPath 变量，你需要做的是在子应用的 entry js 的顶部添加如下代码：

```js
__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
```

关于运行时 publicPath 的技术细节，可以参考 [webpack 文档](https://webpack.js.org/guides/public-path/#on-the-fly)。

::: tip
runtime publicPath 主要解决的是子应用动态载入的 脚本、样式、图片 等地址不正确的问题。
:::

### b. 使用 webpack 静态 publicPath 配置

你需要将你的 webpack `publicPath` 配置设置成一个绝对地址的 url，比如在开发环境可能是：

```js
{
  output: {
    publicPath: `//localhost:${port}`;
  }
}
```

## 子应用静态资源一定要支持跨域吗？

是的。

由于 qiankun 是通过 fetch 去获取子应用的引入的静态资源的，所以必须要求这些静态资源支持[跨域](https://developer.mozilla.org/zh/docs/Web/HTTP/Access_control_CORS)。

如果是自己的脚本，可以通过开发服务端跨域来支持。如果是三方脚本且无法为其添加跨域头，可以将脚本拖到本地，由自己的服务器 serve 来支持跨域。

参考：[Nginx 跨域配置](https://segmentfault.com/a/1190000012550346)

## 如何解决由于运营商动态插入的脚本加载异常导致子应用加载失败的问题

运营商插入的脚本通常会用 async 标记从而避免 block 子应用的加载，这种通常没问题，如：

```html
<script async src="//www.rogue.com/rogue.js"></script>
```

但如果有些插入的脚本不是被标记成 async 的，这类脚本一旦运行失败，将会导致整个应用被 block 且后续的脚本也不再执行。我们可以通过以下几个方式来解决这个问题：

### 使用自定义的 getTemplate 方法

通过自己实现的 getTemplate 方法过滤子应用 HTML 模板中的异常脚本

```js
import { registerMicroApps, start } from 'qiankun';

const customImportConfig = {
  getTemplate(tpl) {
    return tpl.replace('<script src="/to-be-replaced.js"><script>', '');
  }
};

registerMicroApps(
  [{ name: 'app1', entry: '//localhost:8080', render, activeRule: location => location.pathname.startsWith('/react')}],
  {},
  customImportConfig,
);

start(customImportConfig);
```

### 使用自定义的 fetch 方法

通过自己实现的 fetch 方法拦截有问题的脚本

```js
import { registerMicroApps, start } from 'qiankun';

const customImportConfig = {
  fetch(url, ...args) {
    if (url === 'http://to-be-replaced.js')  
      return {  
        async text() { return '' }
      };
    
    return window.fetch(url, ...args);
  }
};

registerMicroApps(
  [{ name: 'app1', entry: '//localhost:8080', render, activeRule: location => location.pathname.startsWith('/react')}],
  {},
  customImportConfig,
);

start(customImportConfig);
```

### 将子应用的 HTML 的 response content-type 改为 text/plain（终极方案）

原理是运营商只能识别 response content-type 为 text/html 的请求并插入脚本，text/plain 类型的响应则不会被劫持。

修改子应用 HTML 的 content-type 方法可以自行 google，也有一个更简单高效的方案：

1. 子应用发布时从 index.html 复制出一个 index.txt 文件出来

2. 将主应用中的 entry 改为 txt 地址，如：

   ```diff
   registerMicroApps(
     [
   -    { name: 'app1', entry: '//localhost:8080/index.html', render, activeRule },
   +    { name: 'app1', entry: '//localhost:8080/index.txt', render, activeRule },
     ],
   );
   ```

## 如何确保主应用跟子应用之间的样式隔离

qiankun 将会自动隔离子应用之间的样式（开启沙箱的情况下），你可以通过手动的方式确保主应用与子应用之间的样式隔离。比如给主应用的所有样式添加一个前缀，或者假如你使用了 [ant-design](https://ant.design) 这样的组件库，你可以通过[这篇文档](https://ant.design/docs/react/customize-theme)中的配置方式给主应用样式自动添加指定的前缀。

## 如何独立运行子应用？

有些时候我们希望直接启动子应用从而更方便的开发调试，你可以使用这个全局变量来区分当前是否运行在 qiankun 的主应用的上下文中：

```ts
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export const mount = async () => render();
```

## 如何同时激活两个子应用？

子应用何时被激活完全取决于你的 `activeRule` 配置，比如下面的例子里，我们将 `reactApp` 和 `react15App` 的 `activeRule` 逻辑设置成一致的：

```js {2,3,7}
registerMicroApps([
  { name: 'reactApp', entry: '//localhost:7100', render, activeRule: () => isReactApp() },
  { name: 'react15App', entry: '//localhost:7102', render, activeRule: () => isReactApp() },
  { name: 'vueApp', entry: '//localhost:7101', render, activeRule: () => isVueApp() },
]);

start({ singular: false });
```

当在 `start` 方法中配置好 `singular: false` 后，只要 `isReactApp()` 返回 `true` 时，`reactApp` 和 `react15App` 将会同时被 mount。

::: warning
页面上不能同时显示多个依赖于路由的子应用，因为浏览器只有一个 url，如果有多个依赖路由的子应用同时被激活，那么必定会导致其中一个 404。
:::

## 如何提取出公共的依赖库？

> 不要共享运行时，即便所有的团队都是用同一个框架。- [微前端](https://micro-frontends.org/)

虽然共享依赖并不建议，但如果你真的有这个需求，你可以在子应用中将公共依赖配置成 `external`，然后在主应用中导入这些公共依赖。

qiankun 2.0 版本将提供一种更智能的方式使其自动化。

## qiankun 能兼容 ie 吗？

目前不兼容，如果有足够多的用户有[诉求](https://github.com/umijs/qiankun/issues/182)，我们会考虑加入这个特性。

如果你现在就需要 ie 支持，你可以尝试关掉 `jsSandbox` 配置来让你的应用可以跑在 ie 下（但要承担关掉沙箱后子应用之间可能造成冲突的风险）。

## 非 webpack 构建的子应用支持接入 qiankun 么？

> 支持

需要额外声明一个 `script`，用于 `export` 相对应的 `lifecycles`

例如:

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
  <div style="display: flex; justify-content: center; align-items: center; height: 200px;">
    Purehtml Example
  </div>
</body>

+ <script src="//yourhost/entry.js" entry></script>
</html>
```

2. 在 entry js 里声明 lifecycles

```javascript
(global => {
  global['purehtml'] = {
    bootstrap: () => {
      console.log('purehtml bootstrap');
      return Promise.resolve();
    },
    mount: () => {
      console.log('purehtml mount');
      return Promise.resolve();
    },
    unmount: () => {
      console.log('purehtml unmount');
      return Promise.resolve();
    },
  };
})(window);
```

你也可以直接参照 examples 中 purehtml 部分的[代码](https://github.com/umijs/qiankun/tree/master/examples/purehtml)

同时，你也需要开启相关资源的 CORS，具体请参照[此处](/zh/faq/#%E5%AD%90%E5%BA%94%E7%94%A8%E9%9D%99%E6%80%81%E8%B5%84%E6%BA%90%E4%B8%80%E5%AE%9A%E8%A6%81%E6%94%AF%E6%8C%81%E8%B7%A8%E5%9F%9F%E5%90%97%EF%BC%9F)