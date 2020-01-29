# Getting Started

## Installation

```bash
$ yarn add qiankun # or npm i qiankun -S
```

## Register Sub Apps In The Master Application

```ts
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'react app', // app name registered
    entry: '//localhost:7100',
    render: ({ appContent, loading }) => yourRenderFunction({ appContent, loading }),
    activeRule: location => yourActiveRule(location),
  },
  {
    name: 'vue app',
    entry: { scripts: ['//localhost:7100/main.js'] },
    render: ({ appContent, loading }) => yourRenderFunction({ appContent, loading }),
    activeRule: location => yourActiveRule(location),
  },
]);

start();
```

When the subapplication information is registered, the matching logic of the qiankun will be automatically triggered if the browser url changes, and all the render methods corresponding to the subapplications whose activeRule methods return `true` will be called, in turn calling the subapplications' exposed lifecycle hooks.

In general, the render and activeRule configurations of our subapplications can be extracted into public methods. Take react as an example:

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
  { name: 'react app', entry: '//localhost:7100', render, activeRule: genActiveRule('/react') },
  { name: 'vue app', entry: { scripts: ['//localhost:7100/main.js'] }, render, activeRule: genActiveRule('/vue') },
]);

start();
```

## Exports The Lifecycles From Your Sub App Entry

The child application needs to export `bootstrap`,`mount`, `unmount` three lifecycle hooks in its own entry js (usually the entry js of webpack you configure) for the main application to call at the appropriate time.

```ts
/**
 * bootstrap will only be called once when the child application initializes,
 * and the next child application will directly call the mount hook when it re-enters, so bootstrap will not be fired again.
 * usually we can do some initialization of global variables here,
 * such as application-level caches that will not be destroyed during the unmount phase.
 */
export async function bootstrap() {
  console.log('react app bootstraped');
}

/**
 * The mount method is called every time the application enters,
 * which is where we normally trigger the render method of the application.
 */
export async function mount(props) {
  console.log(props);
  ReactDOM.render(<App />, document.getElementById('react15Root'));
}

/**
 * Methods that are called each time the application is switched/unloaded,
 * usually in this case we uninstall the application instance of the subapplication
 */
export async function unmount() {
  ReactDOM.unmountComponentAtNode(document.getElementById('react15Root'));
}
```

Qiankun based on single-spa, you can be in [here](https://single-spa.js.org/docs/building-applications.html#registered-application-lifecycle) to find out more about applying life cycle related documentation.

## Config Your Sub App Bundler

In addition to exposing the appropriate lifecycle hooks in the code, in order for the main application to correctly recognize some of the information exposed by the child application, the packaging tool for the child application needs to add the following configuration:

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

You can check the configuration description from [webpack doc](https://webpack.js.org/configuration/output/#outputlibrary)。
