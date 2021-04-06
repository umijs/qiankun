---
toc: menu
---

# 快速上手

## 主应用

### 1. 安装 qiankun

```bash
$ yarn add qiankun # 或者 npm i qiankun -S
```

### 2. 在主应用中注册微应用

```ts
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'react app', // app name registered
    entry: '//localhost:7100',
    container: '#yourContainer',
    activeRule: '/yourActiveRule',
  },
  {
    name: 'vue app',
    entry: { scripts: ['//localhost:7100/main.js'] },
    container: '#yourContainer2',
    activeRule: '/yourActiveRule2',
  },
]);

start();
```

当微应用信息注册完之后，一旦浏览器的 url 发生变化，便会自动触发 qiankun 的匹配逻辑，所有 activeRule 规则匹配上的微应用就会被插入到指定的 container 中，同时依次调用微应用暴露出的生命周期钩子。

如果微应用不是直接跟路由关联的时候，你也可以选择手动加载微应用的方式：

```ts
import { loadMicroApp } from 'qiankun';

loadMicroApp({
  name: 'app',
  entry: '//localhost:7100',
  container: '#yourContainer',
});
```

## 微应用

微应用不需要额外安装任何其他依赖即可接入 qiankun 主应用。

### 1. 导出相应的生命周期钩子

微应用需要在自己的入口 js (通常就是你配置的 webpack 的 entry js) 导出 `bootstrap`、`mount`、`unmount` 三个生命周期钩子，以供主应用在适当的时机调用。

```jsx
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('react app bootstraped');
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  ReactDOM.render(<App />, props.container ? props.container.querySelector('#root') : document.getElementById('root'));
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(
    props.container ? props.container.querySelector('#root') : document.getElementById('root'),
  );
}

/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log('update props', props);
}
```

qiankun 基于 single-spa，所以你可以在[这里](https://single-spa.js.org/docs/building-applications.html#registered-application-lifecycle)找到更多关于微应用生命周期相关的文档说明。

无 webpack 等构建工具的应用接入方式请见[这里](/zh/guide/tutorial#%E9%9D%9E-webpack-%E6%9E%84%E5%BB%BA%E7%9A%84%E5%BE%AE%E5%BA%94%E7%94%A8)

### 2. 配置微应用的打包工具

除了代码中暴露出相应的生命周期钩子之外，为了让主应用能正确识别微应用暴露出来的一些信息，微应用的打包工具需要增加如下配置：

#### webpack:

```js
const packageName = require('./package.json').name;

module.exports = {
  output: {
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${packageName}`,
  },
};
```

相关配置介绍可以查看 [webpack 相关文档](https://webpack.js.org/configuration/output/#outputlibrary)。
