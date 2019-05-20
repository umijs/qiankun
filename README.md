# qiankun（乾坤）
> In Chinese traditional culture `qian` means heaven and `kun` stands for earth, so `qiankun` is the universe.


An implementation of [Micro Frontends](https://micro-frontends.org/), based on [single-spa](https://github.com/CanopyTax/single-spa), but made it production-ready.

## Usage

```shell
npm i qiankun -S
```

## Examples

```shell
npm i
npm run build
cd examples/main && npm i && npm start
cd examples/react && npm i && npm start
cd examples/vue && npm i && npm start
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
function registerMicroApps(apps: RegistrableApp[], options: Options): void
```
