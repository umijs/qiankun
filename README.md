# qiankun（乾坤）

[![npm version](https://img.shields.io/npm/v/qiankun.svg?style=flat-square)](https://www.npmjs.com/package/qiankun)
[![coverage](https://img.shields.io/codecov/c/github/umijs/qiankun.svg?style=flat-square)](https://codecov.io/gh/umijs/qiankun)
[![npm downloads](https://img.shields.io/npm/dt/qiankun.svg?style=flat-square)](https://www.npmjs.com/package/qiankun)
[![Build Status](https://img.shields.io/travis/umijs/qiankun.svg?style=flat-square)](https://travis-ci.org/umijs/qiankun)

> In Chinese traditional culture `qian` means heaven and `kun` stands for earth, so `qiankun` is the universe.

An implementation of [Micro Frontends](https://micro-frontends.org/), based on [single-spa](https://github.com/CanopyTax/single-spa), but made it production-ready.

## 🤔 Motivation

As we know what micro-frontends aims for:

> Techniques, strategies and recipes for building a **modern web app** with **multiple teams** using **different JavaScript frameworks**.				— [Micro Frontends](https://micro-frontends.org/)

An independent development experience is very important for a large system, especially with an enterprise application. But if you've tried to implement a micro-frontends architecture in such a system, you'll usually hurt your brain with such problems:

* How to compose your independent sub apps into your main system?
* How to guarantee your sub apps to be isolated by each other?  
* and so on...

We built an library to help you solve these glitch problems automatically without any mental burden of yours, then named it `qiankun`.

**Probably the most complete micro-frontends solution you ever met🧐.**

## 📦 Installation

```shell
npm i qiankun -S
```

## 🔨 Getting Started

### 1. Create master framework with qiankun

```ts
import { registerMicroApps, start } from 'qiankun';

function render({ appContent, loading }) {
  const container = document.getElementById('container');
  ReactDOM.render(<Framework loading={loading} content={appContent}/>, container);
}

function genActiveRule(routerPrefix) {
  return (location) => location.pathname.startsWith(routerPrefix);
}

registerMicroApps(
  [
    { 
      name: 'react app', // app name registered
      entry: '//localhost:7100',
      render, 
      activeRule: genActiveRule('/react') },
    { 
      name: 'vue app',
      entry: { scripts: [ '//localhost:7100/main.js' ] }, 
      render, 
      activeRule: genActiveRule('/vue') 
    },
  ],
);

start();
```

### 2. Export the lifecycles from your sub app entry

```ts
export async function bootstrap() {
  console.log('react app bootstraped');
}

export async function mount(props) {
  console.log(props);
  ReactDOM.render(<App/>, document.getElementById('react15Root'));
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
   output: {
     library: packageName,
     libraryTarget: 'umd',
     jsonpFunction: `webpackJsonp_${packageName}`,
   }
   ```

see https://webpack.js.org/configuration/output/#outputlibrary

#### parcel:

   ```shell
   parcel serve entry.js --global myvariable
   ```

   see https://en.parceljs.org/cli.html#expose-modules-as-umd

## 💿 Examples

```shell
npm i
npm run install:examples
npm start
```

Visit `http://localhost:7099`

![](./examples/example.gif)



## :sparkles: Features

* Based on [single-spa](https://github.com/CanopyTax/single-spa)
* HTML Entry
* Config Entry
* **Isolated styles**
* **JS Sandbox**
* Assets Prefetch
* [@umijs/plugin-qiankun](https://github.com/umijs/umi-plugin-qiankun) integration

## 📖 API

### registerMicroApps

```typescript
type RegistrableApp = {
	// name to identify your app
  name: string;
  // where your sub app served from, supported html entry and config entry
  entry: string | { scripts?: string[]; styles?: string[]; html?: string };
  // render function called around sub app lifecycle
  render: (props?: { appContent: string, loading: boolean }) => any;
  // when sub app active
  activeRule: (location: Location) => boolean;
  // props pass through to sub app
  props?: object;
};

type Lifecycle<T extends object> = (app: RegistrableApp<T>) => Promise<any>;
type LifeCycles<T extends object> = {
    beforeLoad?: Lifecycle<T> | Array<Lifecycle<T>>;
    beforeMount?: Lifecycle<T> | Array<Lifecycle<T>>;
    afterMount?: Lifecycle<T> | Array<Lifecycle<T>>;
    beforeUnmount?: Lifecycle<T> | Array<Lifecycle<T>>;
    afterUnmount?: Lifecycle<T> | Array<Lifecycle<T>>;
};

function registerMicroApps<T extends object = {}>(apps: Array<RegistrableApp<T>>, lifeCycles?: LifeCycles<T>): void;
```

### start

```typescript
function start({ prefetch: boolean, jsSandbox: boolean, singular: boolean }): void;
```

### setDefaultMountApp

Set which sub app shoule be active by default after master loaded.

```typescript
function setDefaultMountApp(defaultAppLink: string): void
```

### runAfterFirstMounted

```typescript
function runAfterFirstMounted(effect: () => void): void
```

## 🎯 Roadmap

- [ ] Parcel apps integration (multiple sub apps displayed at the same time, but only one uses router at most)
- [ ] Communication development kits between master and sub apps 
- [ ] Custom side effects hijacker
- [ ] Nested Microfrontends

## ❓ FAQ

https://github.com/umijs/qiankun/wiki/FAQ


## 👬 Community

https://github.com/umijs/umi#community

## 🎁 Acknowledgements

* [single-spa](https://github.com/CanopyTax/single-spa) What an awesome meta-framework for micro-fronteds!
