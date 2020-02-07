# 常见问题

## `Application died in status LOADING_SOURCE_CODE: You need to export the functional lifecycles in xxx entry`

qiankun 抛出这个错误是因为无法从子应用的 entry js 中识别出其导出的生命周期钩子。

可以通过以下几个步骤解决这个问题：

1. 检查子应用是否已经导出相应的生命周期钩子，参考[文档](/zh/guide/getting-started.html#子应用导出相应的生命周期钩子)。
2. 检查子应用的 webpack 是否增加了指定的配置，参考[文档](/zh/guide/getting-started.html#配置子应用的打包工具)。
3. 检查子应用的 `package.json` 中的 `name` 字段是否是子应用中唯一的。

如果在上述步骤完成后仍有问题，通常说明是浏览器兼容性问题导致的。可以尝试 **将有问题的子应用的 `package.json` 中的 `name` 字段设置成跟主应用中注册的对应子应用的 `name` 字段一致**，如：

假如子应用的 `package.json` 是这样的：

```json
{
  "name": "brokenSubApp"
}
```

则将主应用中的 name 配置设置成一致的即可：

```ts
// 主应用
registerMicroApps([
  {
    // 这里配置成跟子应用的 package.json 的 name 字段一致即可。
    name: 'brokenSubApp',
    entry: '//localhost:7100',
    render,
    activeRule: genActiveRule('/react'),
  },
]);
```

::: warning
如果你的 webpack 开启了分包策略(即打出了 1 个以上的 js)，子应用的 name 则需要配置为 `brokenSubApp-[name]` 的形式，`[name]` 指代的你的 webpack chunk 的名字（通常会是 main，比如上面的就是 `brokenSubApp-main`）。
:::

## 为什么子应用加载的资源会 404？

原因是 webpack 加载资源时未使用正确的 `publicPath`。

可以通过以下两个方式解决这个问题：

### a. 使用 webpack 运行时 publicPath 配置

qiankun 将会在子应用 bootstrap 之前注入一个运行时的 publicPath 变量，你需要做的是在你的 entry js 的顶部添加如下代码：

```js
__webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
```

关于运行时 publicPath 的技术细节，可以参考 [webpack 文档](https://webpack.js.org/guides/public-path/#on-the-fly)。

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

参考：[Nginx 跨域配置](https://segmentfault.com/a/1190000012550346)

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
