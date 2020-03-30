# API

## `registerMicroApps(apps, lifeCycles?)`

- Parameters

  - apps - `Array<RegistrableApp<T>>` - required, registration information for the child application
  - lifeCycles - `LifeCycles<T>` - optional, global sub app lifecycle hooks

- Type

  - `RegistrableApp<T>`

    - name - `string` - required, the name of the child application and must be unique between the child applications.

    - entry - `string | { scripts?: string[]; styles?: string[]; html?: string }` - required, The entry url of the child application.

    - render - `(props?: { appContent: string; loading: boolean }) => any` - required, the child application triggers the render method when it needs to be activated.

    - activeRule - `(location: Location) => boolean` - optional, activation rules for subapplications.

      This function is called when the browser url changes, and `activeRule` returns `true` to indicate that the subapplication needs to be activated.

    - props - `object` - optional, data that the primary application needs to pass to the child application.

  - `LifeCycles<T>`

    ```ts
    type Lifecycle<T extends object> = (app: RegistrableApp<T>) => Promise<any>;
    ```

    - beforeLoad - `Lifecycle<T> | Array<Lifecycle<T>>` - optional
    - beforeMount - `Lifecycle<T> | Array<Lifecycle<T>>` - optional
    - afterMount - `Lifecycle<T> | Array<Lifecycle<T>>` - optional
    - beforeUnmount - `Lifecycle<T> | Array<Lifecycle<T>>` - optional
    - afterUnmount - `Lifecycle<T> | Array<Lifecycle<T>>` - optional

- Usage

  Configuration information for registered subapplications in the main application.

- Sample

  ```tsx
  import { registerMicroApps } from 'qiankun';

  registerMicroApps(
    [{
      name: 'app1',
      entry: '//localhost:8080',
      render: ({ appContent }) => ReactDOM.render(<App appContent={appContent}>, document.getElementById('container')),
      activeRule: location => location.pathname.startsWith('/react'),
      props: {
        name: 'kuitos',
      }
    }],
    {
      beforeLoad: app => console.log('before load', app.name),
      beforeMount: [
        app => console.log('before mount', app.name),
      ],
    },
  );
  ```

## `start(opts?)`

- Parameters

  - opts - `Options` optional

- Type

  - `Options`

    - prefetch - `boolean | 'all' | string[] | (( apps: RegistrableApp[] ) => { criticalAppNames: string[]; minorAppsName: string[] })` - optional, whether to enable prefetch, default is `true`.

      A configuration of `true` starts prefetching static resources for other subapplications after the first subapplication mount completes.
  
      If configured as `'all'`, the main application `start` will begin to preload all subapplication static resources.

      If configured as `string[]`, starts prefetching static resources for subapplications after the first subapplication mount completes which be declared in this list.

      If configured as `function`, the timing of all subapplication static resources will be controlled by yourself.

    - jsSandbox - `boolean` - optional, whether to open the js sandbox, default is `true`.

    - singular - `boolean | ((app: RegistrableApp<any>) => Promise<boolean>);` - optional，whether is a singular mode，default is `true`.

    - fetch - `Function` - optional
    
    - getPublicPath - `(url: string) => string` - optional
    
    - getTemplate - `(tpl: string) => string` - optional

- Usage

  Start qiankun.

- Sample

  ```ts
  import { start } from 'qiankun';

  start();
  ```

## `setDefaultMountApp(appLink)`

- Parameters

  - appLink - `string` - required

- Usage

  Sets the child application that enters by default after the main application starts.

- Sample

  ```ts
  import { setDefaultMountApp } from 'qiankun';

  setDefaultMountApp('/homeApp');
  ```

## `runAfterFirstMounted(effect)`

- Parameters

  - effect - `() => void` - required

- Usage

  Methods that need to be called after the first subapplication mount, such as turning on some monitoring or buried scripts.

- Sample

  ```ts
  import { runAfterFirstMounted } from 'qiankun';

  runAfterFirstMounted(() => startMonitor());
  ```

## [addErrorHandler/removeErrorHandler](https://single-spa.js.org/docs/api#adderrorhandler)

## `addGlobalUncaughtErrorHandler(handler)`

- Parameters

  - handler - `(...args: any[]) => void` - 必选

- Usage

  Add the global uncaught error hander.

- Sample

  ```ts
  import { addGlobalUncaughtErrorHandler } from 'qiankun';
  
  addGlobalUncaughtErrorHandler(event => console.log(event));
  ```

## `removeGlobalUncaughtErrorHandler(handler)`

- Parameters

  - handler - `(...args: any[]) => void` - 必选

- Usage

  Remove the global uncaught error hander.

- Sample

  ```ts
  import { removeGlobalUncaughtErrorHandler } from 'qiankun';
  
  removeGlobalUncaughtErrorHandler(handler);
  ```
