# API 说明

## 基于路由自动激活

适用于 route-based 场景。通过将子应用关联到一些 url 规则的方式，实现当浏览器 url 发生变化时，自动加载相应的子应用的功能。

### registerMicroApps(apps, lifeCycles?)

- 参数

  - apps - `Array<RegistrableApp>` - 必选，子应用的一些注册信息
  - lifeCycles - `LifeCycles` - 可选，全局的子应用生命周期钩子
  
- 类型

  - `RegistrableApp`

    - name - `string` - 必选，子应用的名称，子应用之间必须确保唯一。

    - entry - `string | { scripts?: string[]; styles?: string[]; html?: string }` - 必选，子应用的 entry 地址。

    - container - `string | HTMLElement` - 必选，子应用的容器节点的选择器或者 Element 实例。如`container: '#root'` 或 `container: document.querySelector('#root')`。

    - activeRule - `string | (location: Location) => boolean | Array<string | (location: Location) => boolean> ` - 必选，子应用的激活规则。

      * 支持直接配置字符串或字符串数组，如 `activeRule: '/app1'` 或 `activeRule: ['/app1', '/app2']`，当配置为字符串时会直接跟 url 中的路径部分做前缀匹配，匹配成功表明当前应用会被激活。
      * 支持配置一个 active function 函数或一组 active function。函数会传入当前 location 作为参数，函数返回 true 时表明当前子应用会被激活。如 `location => location.pathname.startsWith('/app1')`。

      规则示例：

      `'/app1'`

      * ✅ https://app.com/app1

      * ✅ https://app.com/app1/anything/everything

      * 🚫 https://app.com/app2

      `'/users/:userId/profile'`

      * ✅ https://app.com/users/123/profile
      * ✅ https://app.com/users/123/profile/sub-profile/
      * 🚫 https://app.com/users//profile/sub-profile/
      * 🚫 https://app.com/users/profile/sub-profile/

      `'/pathname/#/hash'`

      * ✅ https://app.com/pathname/#/hash
      * ✅ https://app.com/pathname/#/hash/route/nested
      * 🚫 https://app.com/pathname#/hash/route/nested
      * 🚫 https://app.com/pathname#/another-hash

      `['/pathname/#/hash', '/app1']`

      * ✅ https://app.com/pathname/#/hash/route/nested
      * ✅ https://app.com/app1/anything/everything
      * 🚫 https://app.com/pathname/app1
      * 🚫 https://app.com/app2

      浏览器 url 发生变化会调用 activeRule 里的规则，`activeRule` 任意一个返回 `true` 时表明该子应用需要被激活。

    - props - `object` - 可选，主应用需要传递给子应用的数据。

  - `LifeCycles`

    ```ts
    type Lifecycle = (app: RegistrableApp) => Promise<any>;
    ```

    - beforeLoad - `Lifecycle | Array<Lifecycle>` - 可选
    - beforeMount - `Lifecycle | Array<Lifecycle>` - 可选
    - afterMount - `Lifecycle | Array<Lifecycle>` - 可选
    - beforeUnmount - `Lifecycle | Array<Lifecycle>` - 可选
    - afterUnmount - `Lifecycle | Array<Lifecycle>` - 可选

- 用法

  注册子应用的基础配置信息。当浏览器 url 发生变化时，会自动检查每一个子应用注册的 `activeRule` 规则，符合规则的应用将会被自动激活。

- 示例

  ```tsx
  import { registerMicroApps } from 'qiankun';

  registerMicroApps(
    [
      {
        name: 'app1',
        entry: '//localhost:8080',
        container: '#container',
        activeRule: '/react',
        props: {
          name: 'kuitos',
        }
      }
    ],
    {
      beforeLoad: app => console.log('before load', app.name),
      beforeMount: [
        app => console.log('before mount', app.name),
      ],
    },
  );
  ```

### `start(opts?)`

- 参数

  - opts - `Options` 可选

- 类型

  - `Options`

    - prefetch - `boolean | 'all' | string[] | (( apps: RegistrableApp[] ) => { criticalAppNames: string[]; minorAppsName: string[] })` - 可选，是否开启预加载，默认为 `true`。

      配置为 `true` 则会在第一个子应用 mount 完成后开始预加载其他子应用的静态资源，配置为 `'all'` 则主应用 `start` 后即开始预加载所有子应用静态资源。

      配置为 `string[]` 则会在第一个子应用 mounted 后开始加载数组内的子应用资源

      配置为 `function` 则可完全自定义应用的资源加载时机 (首屏应用及次屏应用)

    - sandbox - `boolean` | `{ strictStyleIsolation?: boolean }` - 可选，是否开启沙箱，默认为 `true`。

      当配置为 `{ strictStyleIsolation: true }` 表示开启严格的样式隔离模式。这种模式下 qiankun 会为每个子应用的容器包裹上一个 [shadow dom](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM) 节点，从而确保子应用的样式不会对全局造成影响。

    - singular - `boolean | ((app: RegistrableApp<any>) => Promise<boolean>);` - 可选，是否为单实例场景，默认为 `true`。

    - fetch - `Function` - 可选，自定义的 fetch 方法。

    - getPublicPath - `(url: string) => string` - 可选

    - getTemplate - `(tpl: string) => string` - 可选

- 用法

  启动 qiankun。

- 示例

  ```ts
  import { start } from 'qiankun';

  start();
  ```

### setDefaultMountApp(appLink)`

- 参数

  - appLink - `string` - 必选

- 用法

  设置主应用启动后默认进入的子应用。

- 示例

  ```ts
  import { setDefaultMountApp } from 'qiankun';

  setDefaultMountApp('/homeApp');
  ```

### `runAfterFirstMounted(effect)`

- 参数

  - effect - `() => void` - 必选

- 用法

  第一个子应用 mount 后需要调用的方法，比如开启一些监控或者埋点脚本。

- 示例

  ```ts
  import { runAfterFirstMounted } from 'qiankun';

  runAfterFirstMounted(() => startMonitor());
  ```
  
## 手动加载微应用

适用于需要手动 加载/卸载 一个微应用的场景。

### `loadMicroApp(app, configuration?)`

* 参数
  * app - `LoadableApp` - 必选，子应用的一些基础信息
    * name - `string` - 必选，子应用的名称，子应用之间必须确保唯一。
    * entry - `string | { scripts?: string[]; styles?: string[]; html?: string }` - 必选，子应用的 entry 地址。
    * container - `string | HTMLElement` - 必选，子应用的容器节点的选择器或者 Element 实例。如`container: '#root'` 或 `container: document.querySelector('#root')`。
    * props - `object` - 可选，初始化时需要传递给微应用的数据。
  * configuration - `Configuration`
  
* 返回值 - `MicroApp` - 微应用实例
  * mount(): Promise<null>;
  * unmount(): Promise<null>;
  * update(customProps: object): Promise<any>;
  * getStatus():
      | "NOT_LOADED"
      | "LOADING_SOURCE_CODE"
      | "NOT_BOOTSTRAPPED"
      | "BOOTSTRAPPING"
      | "NOT_MOUNTED"
      | "MOUNTING"
      | "MOUNTED"
      | "UPDATING"
      | "UNMOUNTING"
      | "UNLOADING"
      | "SKIP_BECAUSE_BROKEN"
      | "LOAD_ERROR";
  * loadPromise: Promise<null>;
  * bootstrapPromise: Promise<null>;
  * mountPromise: Promise<null>;
  * unmountPromise: Promise<null>;
  
* 用法

  手动加载一个微应用。

* 示例

  ```jsx
  import { loadMicroApp } from 'qiankun';
  import React from 'react';
  
  class App extends React.Component {
    
    microApp = null;
    
    componentDidMount() {
      this.microApp = loadMicroApp(
    		{ name: 'app1', entry: '//localhost:1234', container: '#app1', props: { name: 'qiankum' } },
  		);
    }
  
    componentWillUnmount() {
      this.microApp.unmount();
    }
  
  	componentDidUpdate() {
      this.microApp.update({ name: 'kuitos' });
    }
    
  	render() {
      return <div id="app1"></div>;
    }
  }
  ```

## [addErrorHandler/removeErrorHandler](https://single-spa.js.org/docs/api#adderrorhandler)

## `addGlobalUncaughtErrorHandler(handler)`

- 参数

  - handler - `(...args: any[]) => void` - 必选

- 用法

  添加全局的未捕获异常处理器。

- 示例

  ```ts
  import { addGlobalUncaughtErrorHandler } from 'qiankun';
  
  addGlobalUncaughtErrorHandler(event => console.log(event));
  ```

## `removeGlobalUncaughtErrorHandler(handler)`

- 参数

  - handler - `(...args: any[]) => void` - 必选

- 用法

  移除全局的未捕获异常处理器。

- 示例

  ```ts
  import { removeGlobalUncaughtErrorHandler } from 'qiankun';
  
  removeGlobalUncaughtErrorHandler(handler);
  ```

## `initGloabalState(state)`

- 参数

  - state - `Record<string, any>` - 必选

- 用法

  定义全局状态，并返回通信方法，建议在主应用使用，子应用通过 props 获取通信方法。

- 返回

  - MicroAppStateActions

    - onGlobalStateChange: `(callback: OnGlobalStateChangeCallback, fireImmediately?: boolean) => void`， 在当前应用监听全局状态，有变更触发 callback，fireImmediately = true 立即触发 callback

    - setGlobalState: `(state: Record<string, any>) => boolean`， 按一级属性设置全局状态，子应用中只能修改已存在的一级属性

    - offGlobalStateChange: `() => boolean`，移除当前应用的状态监听，子应用 umount 时会默认调用

- 示例

  主应用：
  ```ts
  import { initGloabalState, MicroAppStateActions } from 'qiankun';

  // 初始化 state
  const actions: MicroAppStateActions = initGloabalState(state);

  actions.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log(state, prev);
  });
  actions.setGlobalState(state);
  actions.offGlobalStateChange();
  ```

  子应用：
  ```ts
  // 从生命周期 mount 中获取通信方法，使用方式和 master 一致
  export function mount(props) {

    props.onGlobalStateChange((state, prev) => {
      // state: 变更后的状态; prev 变更前的状态
      console.log(state, prev);
    });
    props.setGlobalState(state);
  
    // 子应用 umount 时会默认调用，非特殊情况不需要使用
    props.offGlobalStateChange();

    // ...
  }
  ```
