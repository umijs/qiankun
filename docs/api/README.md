---
nav:
  title: API
  order: 1
toc: menu
---

# API

## Route based configuration

Suitable for route-based scenarios.

By linking the micro-application to some url rules, the function of automatically loading the corresponding micro-application when the browser url changes.

### `registerMicroApps(apps, lifeCycles?)`

- Parameters

  - apps - `Array<RegistrableApp>` - required, registration information for the child application
  - lifeCycles - `LifeCycles` - optional, global sub app lifecycle hooks

- Type

  - `RegistrableApp`

    - name - `string` - required, the name of the child application and must be unique between the child applications.

    - entry - `string | { scripts?: string[]; styles?: string[]; html?: string }` - required, The entry of the micro application.
      - If configured as `string`, it represents the access address of the micro application. such as `https://qiankun.umijs.org/guide/`.
      - If configured as `object`, the value of `html` is the html content string of the micro application, not the access address of the micro application. The `publicPath` of the micro application will be set to `/`.
    - container - `string | HTMLElement` - required，A selector or Element instance of the container node of a micro application. Such as `container: '#root'` or `container: document.querySelector('#root')`.

    - activeRule - - `string | (location: Location) => boolean | Array<string | (location: Location) => boolean> ` - required,activation rules for micro-apps.

      - Support direct configuration of string or string array, such as `activeRule: '/app1'` or `activeRule: ['/app1', '/app2']`, when configured as a string, it will directly follow the path part in the url Do a prefix match. A successful match indicates that the current application will be activated.
      - Support to configure an active function or a group of active functions. The function will pass in the current location as a parameter. When the function returns true, it indicates that the current micro application will be activated. Such as `location => location.pathname.startsWith ('/app1')`.

      Example rules:

      `'/app1'`

      - ✅ https://app.com/app1

      - ✅ https://app.com/app1/anything/everything

      - 🚫 https://app.com/app2

      `'/users/:userId/profile'`

      - ✅ https://app.com/users/123/profile
      - ✅ https://app.com/users/123/profile/sub-profile/
      - 🚫 https://app.com/users//profile/sub-profile/
      - 🚫 https://app.com/users/profile/sub-profile/

      `'/pathname/#/hash'`

      - ✅ https://app.com/pathname/#/hash
      - ✅ https://app.com/pathname/#/hash/route/nested
      - 🚫 https://app.com/pathname#/hash/route/nested
      - 🚫 https://app.com/pathname#/another-hash

      `['/pathname/#/hash', '/app1']`

      - ✅ https://app.com/pathname/#/hash/route/nested
      - ✅ https://app.com/app1/anything/everything
      - 🚫 https://app.com/pathname/app1
      - 🚫 https://app.com/app2

      This function is called when the browser url changes, and `activeRule` returns `true` to indicate that the subapplication needs to be activated.

    - loader - `(loading: boolean) => void` - optional, function will be invoked while the loading state changed.

    - props - `object` - optional, data that the primary application needs to pass to the child application.

  - `LifeCycles`

    ```ts
    type Lifecycle = (app: RegistrableApp) => Promise<any>;
    ```

    - beforeLoad - `Lifecycle | Array<Lifecycle>` - optional
    - beforeMount - `Lifecycle | Array<Lifecycle>` - optional
    - afterMount - `Lifecycle | Array<Lifecycle>` - optional
    - beforeUnmount - `Lifecycle | Array<Lifecycle>` - optional
    - afterUnmount - `Lifecycle | Array<Lifecycle>` - optional

- Usage

  Configuration information for registered subapplications in the main application.

- Sample

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
        },
      },
    ],
    {
      beforeLoad: (app) => console.log('before load', app.name),
      beforeMount: [(app) => console.log('before mount', app.name)],
    },
  );
  ```

### `start(opts?)`

- Parameters

  - opts - `Options` optional

- Type

  - `Options`

    - prefetch - `boolean | 'all' | string[] | (( apps: RegistrableApp[] ) => { criticalAppNames: string[]; minorAppsName: string[] })` - optional, whether to enable prefetch, default is `true`.

      A configuration of `true` starts prefetching static resources for other subapplications after the first subapplication mount completes.

      If configured as `'all'`, the main application `start` will begin to preload all subapplication static resources.

      If configured as `string[]`, starts prefetching static resources for subapplications after the first subapplication mount completes which be declared in this list.

      If configured as `function`, the timing of all subapplication static resources will be controlled by yourself.

    - sandbox - `boolean` | `{ strictStyleIsolation?: boolean, experimentalStyleIsolation?: boolean }` - optional, whether to open the js sandbox, default is `true`.

      When configured as `{strictStyleIsolation: true}`, qiankun will convert the container dom of each application to a [shadow dom](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM), to ensure that the style of the application will not leak to the global.

      And qiankun offered an experimental way to support css isolation, when experimentalStyleIsolation is set to true, qiankun will limit their scope of influence by add selector constraint, therefore styles of sub-app will like following case:

      ```css
      // if app name is react16
      .app-main {
        font-size: 14px;
      }

      div[data-qiankun-react16] .app-main {
        font-size: 14px;
      }
      ```

      notice: @keyframes, @font-face, @import, @page are not supported (i.e. will not be rewritten)

    - singular - `boolean | ((app: RegistrableApp<any>) => Promise<boolean>);` - Optional, whether it is a singleton scenario, singleton means just rendered one micro app at one time. default is `true`.

    - fetch - `Function` - optional

    - getPublicPath - `(entry: Entry) => string` - optional，The parameter is the entry value of the micro application.

    - getTemplate - `(tpl: string) => string` - optional

    - excludeAssetFilter - `(assetUrl: string) => boolean` - optional，some special dynamic loaded micro app resources should not be handled by qiankun hijacking

- Usage

  Start qiankun.

- Sample

  ```ts
  import { start } from 'qiankun';

  start();
  ```

### `setDefaultMountApp(appLink)`

- Parameters

  - appLink - `string` - required

- Usage

  Sets the child application that enters by default after the main application starts.

- Sample

  ```ts
  import { setDefaultMountApp } from 'qiankun';

  setDefaultMountApp('/homeApp');
  ```

### `runAfterFirstMounted(effect)`

- Parameters

  - effect - `() => void` - required

- Usage

  Methods that need to be called after the first subapplication mount, such as turning on some monitoring or buried scripts.

- Sample

  ```ts
  import { runAfterFirstMounted } from 'qiankun';

  runAfterFirstMounted(() => startMonitor());
  ```

## Manually load micro applications

It is suitable for scenarios where a micro application needs to be manually loaded / unloaded.

:::info
Usually in this scenario, the micro application is a business component that can run independently without routing.
Micro applications should not be split too fine, it is recommended to split according to the business domain. Functional units with close business associations should be made into one micro-application, and conversely, those with less close association can be considered to be split into multiple micro-applications.
A criterion for judging whether the business is closely related: <strong>Look at whether this micro application has frequent communication needs with other micro applications</strong>. If it is possible to show that these two micro-applications are serving the same business scenario, it may be more appropriate to merge them into one micro-application.
:::

### `loadMicroApp(app, configuration?)`

- Parameters

  - app - `LoadableApp` - Required, basic information of micro application

    - name - `string` - Required, the name of the micro application must be unique among the micro applications.
    - entry - `string | { scripts?: string[]; styles?: string[]; html?: string }` - Required, The entry of the micro application(The detailed description is the same as above).
    - container - `string | HTMLElement` - Required, selector or Element instance of the container node of the micro application. Such as `container: '#root'` or `container: document.querySelector('#root')`.
    - props - `object` - Optional, the data that needs to be passed to the micro-application during initialization.

  - configuration - `Configuration` - Optional, configuration information of the micro application

    - sandbox - `boolean` | `{ strictStyleIsolation?: boolean, experimentalStyleIsolation?: boolean }` - optional, whether to open the js sandbox, default is `true`.

      When configured as `{strictStyleIsolation: true}`, qiankun will convert the container dom of each application to a [shadow dom](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM), to ensure that the style of the application will not leak to the global.

      And qiankun offered an experimental way to support css isolation, when experimentalStyleIsolation is set to true, qiankun will limit their scope of influence by add selector constraint, thereforce styles of sub-app will like following case:

      ```css
      // if app name is react16
      .app-main {
        font-size: 14px;
      }

      div[data-qiankun-react16] .app-main {
        font-size: 14px;
      }
      ```

      notice: @keyframes, @font-face, @import, @page are not supported (i.e. will not be rewritten)

    - singular - `boolean | ((app: RegistrableApp<any>) => Promise<boolean>);` - Optional, whether it is a singleton scenario, singleton means just rendered one micro app at one time. Default is `false`.

    - fetch - `Function` - Optional, custom fetch method.

    - getPublicPath - `(url: string) => string` - Optional，The parameter is the entry value of the micro application.

    - getTemplate - `(tpl: string) => string` - Optional

    - excludeAssetFilter - `(assetUrl: string) => boolean` - optional，some special dynamic loaded micro app resources should not be handled by qiankun hijacking

- Return - `MicroApp` - Micro application examples

  - mount(): Promise&lt;null&gt;;
  - unmount(): Promise&lt;null&gt;;
  - update(customProps: object): Promise&lt;any&gt;;
  - getStatus(): | "NOT_LOADED" | "LOADING_SOURCE_CODE" | "NOT_BOOTSTRAPPED" | "BOOTSTRAPPING" | "NOT_MOUNTED" | "MOUNTING" | "MOUNTED" | "UPDATING" | "UNMOUNTING" | "UNLOADING" | "SKIP_BECAUSE_BROKEN" | "LOAD_ERROR";
  - loadPromise: Promise&lt;null&gt;;
  - bootstrapPromise: Promise&lt;null&gt;;
  - mountPromise: Promise&lt;null&gt;;
  - unmountPromise: Promise&lt;null&gt;;

- Usage

  Load a micro application manually.

  If you need to support the main application to manually update the micro application, you need to export an update hook for the micro application entry:

  ```ts
  export async function mount(props) {
    renderApp(props);
  }

  // Added update hook to allow the main application to manually update the micro application
  export async function update(props) {
    renderPatch(props);
  }
  ```

- Sample

  ```jsx
  import { loadMicroApp } from 'qiankun';
  import React from 'react';

  class App extends React.Component {
    containerRef = React.createRef();
    microApp = null;

    componentDidMount() {
      this.microApp = loadMicroApp({
        name: 'app1',
        entry: '//localhost:1234',
        container: this.containerRef.current,
        props: { brand: 'qiankun' },
      });
    }

    componentWillUnmount() {
      this.microApp.unmount();
    }

    componentDidUpdate() {
      this.microApp.update({ name: 'kuitos' });
    }

    render() {
      return <div ref={this.containerRef}></div>;
    }
  }
  ```

### `prefetchApps(apps, importEntryOpts?)`

- Parameters

  - apps - `AppMetadata[]` - Required - list of preloaded apps
  - importEntryOpts - Optional - Load configuration

- Type

  - `AppMetadata`
    - name - `string` - Required - Application name
    - entry - `string | { scripts?: string[]; styles?: string[]; html?: string }` - Required,The entry address of the microapp

- Usage

  Manually preload the specified micro application static resources. Only needed to manually load micro-application scenarios, you can directly configure the `prefetch` attribute based on the route automatic activation scenario.

- Sample

  ```ts
  import { prefetchApps } from 'qiankun';

  prefetchApps([
    { name: 'app1', entry: '//localhost:7001' },
    { name: 'app2', entry: '//localhost:7002' },
  ]);
  ```

## component load micro applications
### React project
#### Install

```bash
npm i @qiankun
npm i @qiankunjs/react
```

#### MicroApp component

Load (or unload) child apps directly through the `<MicroApp/>` component, which provides loading and error catching-related capabilities:

```tsx
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  return <MicroApp name="app1" entry="http://localhost:8000" />;
}
```

When the sub-app loading animation or error capture capability is enabled, the sub-app accepts an additional style class `wrapperClassName`, and the rendered result is as follows:

```tsx
<div style={{ position: 'relative' }} className={wrapperClassName}>
  <MicroAppLoader loading={loading} />
  <ErrorBoundary error={e} />
  <MicroApp className={className} />
</div>
```

#### Load animation

When this capability is enabled, loading animations are automatically displayed when child apps are loading. When the sub-application is mounted and changes to the `MOUNTED` state, the loading status ends and the sub-application content is displayed.

Just pass `autoSetLoading` as a parameter:

```tsx
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  return <MicroApp name="app1" entry="http://localhost:8000" autoSetLoading />;
}
```

#### Custom loading animation

If you want to override the default loading animation style, you can set a custom loading component `loader` as the loading animation for the child app.

```tsx
import CustomLoader from '@/components/CustomLoader';
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  return (
    <MicroApp name="app1" entry="http://localhost:8000" loader={(loading) => <CustomLoader loading={loading} />} />
  );
}
```

where `loading` is the `boolean` type parameter, `true` indicates that the loading state is still being loaded, and `false` indicates that the loading state has ended.

#### Error catching

When this capability is enabled, an error message is automatically displayed when a child app loads unexpectedly. You can pass the `autoCaptureError` property to the sub-app to enable sub-app error capture capabilities:

```tsx
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  return <MicroApp name="app1" entry="http://localhost:8000" autoCaptureError />;
}
```

#### Custom error capture

If you want to override the default error capture component style, you can set a custom component `errorBoundary` as the error capture component for the child app:

```tsx
import CustomErrorBoundary from '@/components/CustomErrorBoundary';
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  return (
    <MicroApp
      name="app1"
      entry="http://localhost:8000"
      errorBoundary={(error) => <CustomErrorBoundary error={error} />}
    />
  );
}
```

#### Component Props

| Name | Required | Description | Type | Default |
| --- | --- | --- | --- | --- |
| `name` | yes | The name of the microapp | `string` |
| `entry` | yes | The HTML address of the microapp | `string` |
| `autoSetLoading` | no | Automatically set the loading state of your microapp | `boolean` | `false` |
| `loader` | no | Custom microapps load state components | `(loading) => React.ReactNode` | `undefined` |
| `autoCaptureError` | no | Automatically set up error capture for microapps | `boolean` | `false` |
| `errorBoundary` | no | Custom microapp error capture component | `(error: any) => React.ReactNode` | `undefined` |
| `className` | no | The style class for the microapp | `string` | `undefined` |
| `wrapperClassName` | no | Wrap the microapp loading component, error capture component, and microapp's style classes, and are only valid when the load component or error capture component is enabled | `string` | `undefined` |

#### Get the child app load status

The loading status includes: "NOT_LOADED" | "LOADING_SOURCE_CODE" | "NOT_BOOTSTRAPPED" | "BOOTSTRAPPING" | "NOT_MOUNTED" | "MOUNTING" | "MOUNTED" | "UPDATING" | "UNMOUNTING" | "UNLOADING" |

```tsx
import { useRef } from 'react';
import { MicroApp } from '@qiankunjs/react';

export default function Page() {
  const microAppRef = useRef();

  useEffect(() => {
    // Get the child app load status
    console.log(microAppRef.current?.getStatus());
  }, []);

  return <MicroApp name="app1" entry="http://localhost:8000" ref={microAppRef} />;
}
```


### Vue project
#### Install

```bash
npm i @qiankun
npm i @qiankunjs/vue
```

#### MicroApp component

Load (or unload) a sub-application directly through the `<MicroApp />` component, which provides capabilities related to loading and error capturing:

```vue
<script setup>
import { MicroApp } from '@qiankunjs/vue';
</script>

<template>
  <micro-app name="app1" entry="http://localhost:8000" />
</template>
```

When enabling the sub-application loading animation or error capturing capabilities, an additional style class `wrapperClassName` is accepted by the sub-application. The rendered result is as follows:

```vue
<div :class="wrapperClassName">
  <MicroAppLoader :loading="loading" />
  <ErrorBoundary :error="e" />
  <MicroApp :class="className" />
</div>
```

#### Loading Animation

After enabling this feature, a loading animation will automatically be displayed while the sub-application is loading. When the sub-application finishes mounting and becomes in the MOUNTED state, the loading state ends, and the sub-application content is displayed.

Simply pass `autoSetLoading` as a parameter:

```vue
<script setup>
import { MicroApp } from '@qiankunjs/vue';
</script>

<template>
  <micro-app name="app1" entry="http://localhost:8000" autoSetLoading />
</template>
```

#### Custom Loading Animation

If you wish to override the default loading animation style, you can customize the loading component by using the loader slot as the sub-application's loading animation.

```vue
<script setup>
import CustomLoader from '@/components/CustomLoader.vue';
import { MicroApp } from '@qiankunjs/vue';
</script>

<template>
  <micro-app name="app1" entry="http://localhost:8000">
    <template #loader="{ loading }">
      <custom-loader :loading="loading" />
    </template>
  </micro-app>
</template>
```

Here, `loading` is a boolean type parameter; when true, it indicates that it is still in the loading state, and when false, it indicates that the loading state has ended.

#### Error Capturing

After enabling this feature, when the sub-application encounters an exception while loading, an error message will automatically be displayed. You can pass the `autoCaptureError` property to the sub-application to enable error capturing capabilities:

```vue
<script setup>
import { MicroApp } from '@qiankunjs/vue';
</script>

<template>
  <micro-app name="app1" entry="http://localhost:8000" autoCaptureError />
</template>
```

#### Custom Error Capturing

If you wish to override the default error capturing component style, you can customize the error capturing component for the sub-application using the errorBoundary slot:

```vue
<script setup>
import CustomErrorBoundary from '@/components/CustomErrorBoundary.vue';
import { MicroApp } from '@qiankunjs/vue';
</script>

<template>
  <micro-app name="app1" entry="http://localhost:8000">
    <template #error-boundary="{ error }">
      <custom-error-boundary :error="error" />
    </template>
  </micro-app>
</template>
```

#### Component Properties

| Property | Required | Description | Type | Default Value |
| --- | --- | --- | --- | --- |
| `name` | Yes | The name of the micro-application | `string` |  |
| `entry` | Yes | The HTML address of the micro-application | `string` |  |
| `autoSetLoading` | No | Automatically set the loading status of the micro-application | `boolean` | `false` |
| `autoCaptureError` | No | Automatically set error capturing for the micro-application | `boolean` | `false` |
| `className` | No | The style class for the micro-application | `string` | `undefined` |
| `wrapperClassName` | No | The style class wrapping the micro-application's loading and error components | `string` | `undefined` |

#### Component Slots

| Slot            | Description          |
| --------------- | -------------------- |
| `loader`        | Loading state slot   |
| `errorBoundary` | Error capturing slot |


## [addErrorHandler/removeErrorHandler](https://single-spa.js.org/docs/api#adderrorhandler)

## `addGlobalUncaughtErrorHandler(handler)`

- Parameters

  - handler - `(...args: any[]) => void` - Required

- Usage

  Add the global uncaught error hander.

- Sample

  ```ts
  import { addGlobalUncaughtErrorHandler } from 'qiankun';

  addGlobalUncaughtErrorHandler((event) => console.log(event));
  ```

## `removeGlobalUncaughtErrorHandler(handler)`

- Parameters

  - handler - `(...args: any[]) => void` - Required

- Usage

  Remove the global uncaught error hander.

- Sample

  ```ts
  import { removeGlobalUncaughtErrorHandler } from 'qiankun';

  removeGlobalUncaughtErrorHandler(handler);
  ```

## `initGlobalState(state)`

- Parameters

  - state - `Record<string, any>` - Required

- Usage

  init global state, and return actions for communication. It is recommended to use in master, and slave get actions through props.

- Return

  - MicroAppStateActions

    - onGlobalStateChange: `(callback: OnGlobalStateChangeCallback, fireImmediately?: boolean) => void` - Listen the global status in the current application: when state changes will trigger callback; fireImmediately = true, will trigger callback immediately when use this method.

    - setGlobalState: `(state: Record<string, any>) => boolean` - Set global state by first layer props, it can just modify first layer props what has defined.

    - offGlobalStateChange: `() => boolean` - Remove Listener in this app, will default trigger when app unmount.

- Sample

  Master:

  ```ts
  import { initGlobalState, MicroAppStateActions } from 'qiankun';

  // Initialize state
  const actions: MicroAppStateActions = initGlobalState(state);

  actions.onGlobalStateChange((state, prev) => {
    // state: new state; prev old state
    console.log(state, prev);
  });
  actions.setGlobalState(state);
  actions.offGlobalStateChange();
  ```

  Slave:

  ```ts
  // get actions from mount
  export function mount(props) {
    props.onGlobalStateChange((state, prev) => {
      // state: new state; prev old state
      console.log(state, prev);
    });
    props.setGlobalState(state);

    // It will trigger when slave umount,  not necessary to use in non special cases.
    props.offGlobalStateChange();

    // ...
  }
  ```
