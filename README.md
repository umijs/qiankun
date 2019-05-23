# qiankun（乾坤）

[![npm version](https://img.shields.io/npm/v/qiankun.svg?style=flat-square)](https://www.npmjs.com/package/qiankun)
[![coverage](https://img.shields.io/codecov/c/github/umijs/qiankun.svg?style=flat-square)](https://codecov.io/gh/umijs/qiankun)
[![npm downloads](https://img.shields.io/npm/dt/qiankun.svg?style=flat-square)](https://www.npmjs.com/package/qiankun)
[![Build Status](https://img.shields.io/travis/umijs/qiankun.svg?style=flat-square)](https://travis-ci.org/umijs/qiankun)

> In Chinese traditional culture `qian` means heaven and `kun` stands for earth, so `qiankun` is the universe.

An implementation of [Micro Frontends](https://micro-frontends.org/), based on [single-spa](https://github.com/CanopyTax/single-spa), but made it production-ready.

## Usage

```shell
npm i qiankun -S
```

## Examples

```shell
npm i
npm run install:examples
npm start
```

Visit `http://localhost:7099`

![](./examples/example.gif)

```js
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
    { name: 'react app', entry: '//localhost:7100', render, activeRule: genActiveRule('/react') },
    { name: 'vue app', entry: { scripts: [ '//localhost:7100/main.js' ] }, render, activeRule: genActiveRule('/vue') },
  ],
  {
    beforeLoadHooks: [async app => {
      console.log('before load', app);
    }],
    beforeMountHooks: [async app => {
      console.log('before mount', app);
    }],
    afterUnloadHooks: [async app => {
      console.log('after unload', app);
    }],
  },
);

start({ prefetch: true, jsSandbox: true });
```

## Features

- [x] HTML Entry
- [x] Config Entry
- [x] Isolated styles
- [x] JS Sandbox
- [x] Assets Prefetch
- [ ] Nested Microfrontends
- [ ] [umi-plugin-single-spa](https://github.com/umijs/umi-plugin-single-spa) integration

## API

### registerMicroApps

```typescript
type RegistrableApp = {
  name: string; // app name
  entry: string | { scripts?: string[]; styles?: string[]; html?: string };  // app entry
  render: (props?: { appContent: string, loading: boolean }) => any;
  activeRule: (location: Location) => boolean;
  props?: object; // props pass through to app
};

type Options = {
  beforeLoadHooks?: Array<(app: RegistrableApp) => Promise<void>>; // function before app load
  beforeMountHooks?: Array<(app: RegistrableApp) => Promise<void>>; // function before app mount
  afterUnloadHooks?: Array<(app: RegistrableApp) => Promise<void>>; // function after app unmount
};

function registerMicroApps(apps: RegistrableApp[], options: Options): void

function start({ prefetch: boolean, jsSandbox: boolean }): void;
```
