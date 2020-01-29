---
home: true
actionText: Get Started →
actionLink: /guide/
features:
  - title: Simple
    details: Build your micro-frontend system just like using with iframe, but not iframe actually.
  - title: Complete
    details: Almost contains all the basic capabilities you need for a micro frontend system.
  - title: Production-Ready
    details: Had been extensively applied and polished by a large number of online applications.
footer: MIT Licensed | Copyright © 2019-present
---

## 📦 Installation

```shell
$ yarn add qiankun  # or npm i qiankun -S
```

## 🔨 Getting Started

### 1. Create master framework with qiankun

```ts
import { registerMicroApps, start } from 'qiankun';

function render({ appContent, loading }) {
  const container = document.getElementById('container');
  ReactDOM.render(<Framework loading={loading} content={appContent} />, container);
}

function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}

registerMicroApps([
  {
    name: 'react app', // app name registered
    entry: '//localhost:7100',
    render,
    activeRule: genActiveRule('/react'),
  },
  {
    name: 'vue app',
    entry: { scripts: ['//localhost:7100/main.js'] },
    render,
    activeRule: genActiveRule('/vue'),
  },
]);

start();
```

### 2. Export the lifecycles from your sub app entry

```ts
export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  console.log(props);
  ReactDOM.render(<App />, document.getElementById('react15Root'));
}

export async function unmount() {
  ReactDOM.unmountComponentAtNode(document.getElementById('react15Root'));
}
```

For more lifecycle information, see [single-spa lifecycles](https://single-spa.js.org/docs/building-applications.html#registered-application-lifecycle)

### 3. Config your sub app bundler

While you wanna build a sub app to integrate to qiankun, pls make sure your bundler have the required configuration below:

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

see https://webpack.js.org/configuration/output/#outputlibrary

#### parcel:

```shell
parcel serve entry.js --global myvariable
```

see https://en.parceljs.org/cli.html#expose-modules-as-umd

## Community

| Github Issue | 钉钉群 |
| --- | --- |
| [umijs/qiankun/issues](https://github.com/umijs/qiankun/issues) | <img src="https://gw.alipayobjects.com/mdn/rms_655822/afts/img/A*HMVERqOue-AAAAAAAAAAAABkARQnAQ" width="60" /> |
