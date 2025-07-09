# Quick Start

This guide will help you set up a basic qiankun micro-frontend application in 5 minutes.

## Prerequisites

- Node.js 16+
- Basic JavaScript/TypeScript knowledge
- Understanding of React, Vue or other frontend frameworks

## 🚀 Step 1: Install qiankun

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

## 🏠 Step 2: Main Application Configuration

### 2.1 Create Main Application

```bash
# Create main application using your favorite framework
npx create-react-app main-app
cd main-app
npm install qiankun
```

### 2.2 Register Micro Applications

Register micro applications in the main application's entry file:

```typescript
// src/index.js
import { registerMicroApps, start } from 'qiankun';

// register micro applications
registerMicroApps([
  {
    name: 'vue-app', // micro app name, unique
    entry: '//localhost:8080', // micro app entry
    container: '#subapp-viewport', // micro app mount node
    activeRule: '/vue', // micro app activation rule
  },
  {
    name: 'react-app',
    entry: '//localhost:3001',
    container: '#subapp-viewport',
    activeRule: '/react',
  },
]);

// start qiankun
start();

// render main application normally
ReactDOM.render(<App />, document.getElementById('root'));
```

### 2.3 Create Micro Application Container

Reserve mount nodes for micro applications in the main application:

```jsx
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="mainapp">
        <header>
          <h1>qiankun Main Application</h1>
          <nav>
            <Link to="/vue">Vue App</Link>
            <Link to="/react">React App</Link>
          </nav>
        </header>
        {/* micro application mount point */}
        <main id="subapp-viewport"></main>
      </div>
    </Router>
  );
}

export default App;
```

## 📦 Step 3: Micro Application Configuration

### 3.1 Create Vue Micro Application

```bash
npm install -g @vue/cli
vue create vue-micro-app
cd vue-micro-app
```

### 3.2 Export Lifecycle

Modify `src/main.js`:

```javascript
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import routes from './router';

let instance = null;
let router = null;

/**
 * Render function
 * Two scenarios: called by main app lifecycle / micro app runs independently
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

// run independently
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
  instance.unmount();
  instance._container.innerHTML = '';
  instance = null;
  router = null;
}
```

### 3.3 Configure Webpack

Modify `vue.config.js`:

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

### 3.4 Create React Micro Application

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
  console.log('[react16] react app bootstraped');
}

export async function mount(props) {
  console.log('[react16] props from main framework', props);
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

Modify scripts in `package.json`:

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

## 🎉 Step 4: Start Applications

### 4.1 Start All Applications

```bash
# Terminal 1: Start main application
cd main-app
npm start

# Terminal 2: Start Vue micro application
cd vue-micro-app  
npm run serve

# Terminal 3: Start React micro application
cd react-micro-app
npm start
```

### 4.2 Access Applications

- Main application: http://localhost:3000
- Click navigation to switch to different micro applications

## ✅ Verify Integration

If everything is configured correctly, you should see:

1. ✅ Main application loads normally
2. ✅ Clicking navigation links switches to corresponding micro applications
3. ✅ Micro applications can be accessed independently (http://localhost:8080, http://localhost:3001)
4. ✅ Browser console shows lifecycle logs

## 🎯 Common Issues

::: warning CORS Issues
Make sure your micro application's webpack devServer is configured with CORS headers:
```javascript
headers: {
  'Access-Control-Allow-Origin': '*',
}
```
:::

::: warning Routing Conflicts
In integration mode, micro application routing needs to add corresponding prefixes:
```javascript
// Vue Router
history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/vue' : '/')

// React Router
<BrowserRouter basename={window.__POWERED_BY_QIANKUN__ ? '/react' : '/'}>
```
:::

## 🚀 Next Steps

Congratulations! You have successfully built your first qiankun micro-frontend application. Next you can:

- [Core Concepts](/guide/concepts) - Deeply understand qiankun's design principles
- [Main Application](/guide/main-app) - Learn more main application configuration options
- [Micro Application](/guide/micro-app) - Learn how to transform existing applications
- [Best Practices](/cookbook/) - Learn production environment best practices 