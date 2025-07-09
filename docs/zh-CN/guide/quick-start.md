# 快速开始

本指南将帮助你在 5 分钟内搭建一个基础的 qiankun 微前端应用。

## 前置条件

- Node.js 16+
- 基础的 JavaScript/TypeScript 知识
- 了解 React、Vue 或其他前端框架

## 🚀 步骤 1：安装 qiankun

::: code-group

```bash [npm]
npm install qiankun
```

```bash [yarn]
yarn add qiankun
```

```bash [pnpm]
pnpm add qiankun
```

:::

## 🏠 步骤 2：主应用配置

### 2.1 创建主应用

```bash
# 使用你喜欢的框架创建主应用
npx create-react-app main-app
cd main-app
npm install qiankun
```

### 2.2 注册微应用

在主应用的入口文件中注册微应用：

```typescript
// src/index.js
import { registerMicroApps, start } from 'qiankun';

// 注册微应用
registerMicroApps([
  {
    name: 'vue-app', // 微应用名称，唯一
    entry: '//localhost:8080', // 微应用入口
    container: '#subapp-viewport', // 微应用挂载节点
    activeRule: '/vue', // 微应用激活规则
  },
  {
    name: 'react-app',
    entry: '//localhost:3001',
    container: '#subapp-viewport',
    activeRule: '/react',
  },
]);

// 启动 qiankun
start();

// 正常渲染主应用
ReactDOM.render(<App />, document.getElementById('root'));
```

### 2.3 创建微应用容器

在主应用中为微应用预留挂载节点：

```jsx
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="mainapp">
        <header>
          <h1>qiankun 主应用</h1>
          <nav>
            <Link to="/vue">Vue 应用</Link>
            <Link to="/react">React 应用</Link>
          </nav>
        </header>
        {/* 微应用挂载点 */}
        <main id="subapp-viewport"></main>
      </div>
    </Router>
  );
}

export default App;
```

## 📦 步骤 3：微应用配置

### 3.1 创建 Vue 微应用

```bash
npm install -g @vue/cli
vue create vue-micro-app
cd vue-micro-app
```

### 3.2 导出生命周期

修改 `src/main.js`：

```javascript
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import routes from './router';

let instance = null;
let router = null;

/**
 * 渲染函数
 * 两种情况：主应用生命周期调用 / 微应用独立运行
 */
function render(props = {}) {
  const { container } = props;
  
  router = createRouter({
    history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/vue' : '/'),
    routes,
  });

  instance = createApp(App);
  instance.use(router);
  instance.mount(container ? container.querySelector('#app') : '#app');
}

// 独立运行
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap() {
  console.log('[vue] vue 应用启动');
}

export async function mount(props) {
  console.log('[vue] 来自主框架的参数', props);
  render(props);
}

export async function unmount() {
  instance.unmount();
  instance._container.innerHTML = '';
  instance = null;
  router = null;
}
```

### 3.3 配置 Webpack

修改 `vue.config.js`：

```javascript
const { defineConfig } = require('@vue/cli-service');
const packageName = require('./package.json').name;

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  configureWebpack: {
    output: {
      library: `${packageName}-[name]`,
      libraryTarget: 'umd',
      chunkLoadingGlobal: `webpackJsonp_${packageName}`,
    },
  },
});
```

### 3.4 创建 React 微应用

```bash
npx create-react-app react-micro-app
cd react-micro-app
npm install react-app-rewired --save-dev
```

修改 `src/index.js`：

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

function render(props) {
  const { container } = props;
  ReactDOM.render(
    <App />, 
    container ? container.querySelector('#root') : document.querySelector('#root')
  );
}

if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log('[react16] react 应用启动');
}

export async function mount(props) {
  console.log('[react16] 来自主框架的参数', props);
  render(props);
}

export async function unmount(props) {
  const { container } = props;
  ReactDOM.unmountComponentAtNode(
    container ? container.querySelector('#root') : document.querySelector('#root')
  );
}
```

创建 `config-overrides.js`：

```javascript
const { name } = require('./package');

module.exports = {
  webpack: (config) => {
    config.output.library = `${name}-[name]`;
    config.output.libraryTarget = 'umd';
    config.output.chunkLoadingGlobal = `webpackJsonp_${name}`;
    return config;
  },

  devServer: function (configFunction) {
    return function(proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.port = 3001;
      config.headers = {
        'Access-Control-Allow-Origin': '*',
      };
      return config;
    };
  },
};
```

修改 `package.json` 中的脚本：

```json
{
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  }
}
```

## 🎉 步骤 4：启动应用

### 4.1 启动所有应用

```bash
# 终端 1：启动主应用
cd main-app
npm start

# 终端 2：启动 Vue 微应用
cd vue-micro-app  
npm run serve

# 终端 3：启动 React 微应用
cd react-micro-app
npm start
```

### 4.2 访问应用

- 主应用：http://localhost:3000
- 点击导航切换到不同的微应用

## ✅ 验证集成

如果一切配置正确，你应该看到：

1. ✅ 主应用正常加载
2. ✅ 点击导航链接切换到对应的微应用
3. ✅ 微应用可以独立访问（http://localhost:8080, http://localhost:3001）
4. ✅ 浏览器控制台显示生命周期日志

## 🎯 常见问题

::: warning CORS 问题
确保你的微应用 webpack devServer 配置了 CORS 头：
```javascript
headers: {
  'Access-Control-Allow-Origin': '*',
}
```
:::

::: warning 路由冲突
在集成模式下，微应用路由需要添加对应前缀：
```javascript
// Vue Router
history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/vue' : '/')

// React Router
<BrowserRouter basename={window.__POWERED_BY_QIANKUN__ ? '/react' : '/'}>
```
:::

## 🚀 下一步

恭喜！你已经成功构建了第一个 qiankun 微前端应用。接下来你可以：

- [核心概念](/zh-CN/guide/concepts) - 深入理解 qiankun 的设计原理
- [主应用](/zh-CN/guide/main-app) - 了解更多主应用配置选项
- [微应用](/zh-CN/guide/micro-app) - 学习如何改造现有应用
- [最佳实践](/zh-CN/cookbook/) - 学习生产环境最佳实践 