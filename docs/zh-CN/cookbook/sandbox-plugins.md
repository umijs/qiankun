# 用插件扩展沙箱

`loadMicroApp` 的 `sandbox` 配置提供两个扩展入口：

- `globals` 用于向当前应用的全局对象补充值或属性描述符；
- `plugins` 用于安装需要初始化、清理或重建的隔离能力。

只需提供一个值时，优先使用 `globals`。如果还要管理副作用或处理应用再次挂载，就需要实现插件。

## 补充应用全局变量

```ts
loadMicroApp(
  {
    name: 'reporting',
    entry: '/apps/reporting/',
    container: document.querySelector('#reporting')!,
  },
  {
    sandbox: {
      globals: {
        tenantId: 'acme',
        featureClient: {
          configurable: true,
          enumerable: true,
          value: createFeatureClient(),
          writable: false,
        },
      },
    },
  },
);
```

普通值会直接成为应用全局变量。如果对象包含 `value`、`get`、`set`、`writable`、`enumerable` 或 `configurable` 中的任意字段，qiankun 会把它视为 `PropertyDescriptor`。若业务对象本身恰好包含这些字段，请使用 `{ value: object }` 明确表达。

Classic 脚本可通过 `window` 读取这些变量；ESM 脚本也可直接使用已配置的变量名。它们都不会写入主应用的 `window`。

## 编写隔离插件

下面的插件为每个微应用提供带前缀的 `localStorage` 方法视图。它只引入 qiankun 的公开类型，也只调用 Compartment 的公开接口。

```ts
import type { IsolationPlugin } from 'qiankun';

export function localStoragePrefix(prefix: string): IsolationPlugin {
  return {
    name: `local-storage:${prefix}`,
    bootstrap({ compartment }) {
      const nativeStorage = window.localStorage;
      const keys = () =>
        Array.from({ length: nativeStorage.length }, (_, index) => nativeStorage.key(index))
          .filter((key): key is string => key?.startsWith(prefix) ?? false)
          .map((key) => key.slice(prefix.length));
      const storage = Object.freeze({
        get length() {
          return keys().length;
        },
        clear: () => keys().forEach((key) => nativeStorage.removeItem(`${prefix}${key}`)),
        getItem: (key: string) => nativeStorage.getItem(`${prefix}${key}`),
        key: (index: number) => keys()[index] ?? null,
        removeItem: (key: string) => nativeStorage.removeItem(`${prefix}${key}`),
        setItem: (key: string, value: string) => nativeStorage.setItem(`${prefix}${key}`, value),
      });

      compartment.defineUnshadowableGlobals({
        localStorage: {
          configurable: true,
          enumerable: true,
          value: storage,
          writable: false,
        },
      });

      return () => () => Promise.resolve();
    },
  };
}
```

这个示例只开放 `Storage` 的方法，不支持 `storage.theme` 这类属性式访问。如果要用 Proxy 支持具名属性，需要同时虚拟化 `get`、`set`、`deleteProperty`、`has`、`ownKeys` 和属性描述符；不能把未处理的操作直接转发给原生 `Storage`，否则其他前缀下的键仍可能泄露。

按应用注册插件：

```ts
loadMicroApp(app, {
  sandbox: {
    plugins: [localStoragePrefix('reporting:')],
  },
});
```

## 生命周期约定

用户插件排在 qiankun 内置隔离插件之后执行。

- `bootstrap(context)` 只执行一次，并且一定早于任何子应用脚本；
- `mount(context)` 每次挂载都会执行，可返回 `Free`，也可返回 `Promise<Free>`；
- 卸载时，qiankun 调用 `Free` 清理副作用，并保存其返回的 `Rebuild`；
- 再次挂载时，`Rebuild(container)` 会在挂载完成前恢复需要保留的副作用。

```ts
type Free = () => Rebuild;
type Rebuild = (container: HTMLElement) => Promise<void>;
```

应用级状态放在钩子闭包中。如果插件修改了共享原型，则要在浏览器 realm 级维护引用计数，避免一个应用卸载时提前还原其他应用仍在使用的能力。如果页面可能同时加载多份独立打包的 qiankun，应通过原生全局对象上的稳定 `Symbol.for(...)` 键共享协调记录，不能只依赖模块局部状态。

插件只能依赖公开的 `Compartment` 接口。Membrane、求值器和模块链接器属于可替换的机制层；document 代理、动态 DOM 插入、样式隔离以及定时器和监听器清理仍由 qiankun 负责，即使浏览器未来提供原生 Compartment，也不会替代这些能力。

## 自定义模块 hook

需要接入私有协议或预编译模块时，可通过 `sandbox` 配置上的模块 hook 自定义模块解析与加载：

```ts
import { precompileModuleSource } from 'qiankun';

const entryUrl = new URL('/private-app/entry.js', location.href).href;
const dependencyUrl = new URL('./dependency.js', entryUrl).href;
const resolveHook = (specifier: string, referrer: string) => new URL(specifier, referrer).href;

// 先于 hook 完成链接。实际项目通常在构建阶段或制品加载阶段执行，
// 返回结果可以缓存，也可以序列化保存。
const artifacts = new Map([
  [
    entryUrl,
    precompileModuleSource({
      source: `import { message } from './dependency.js';
const status = document.querySelector('#status');
if (status) status.textContent = message;`,
      url: entryUrl,
      globalsBaseSet: ['document'],
      resolveHook,
    }),
  ],
  [
    dependencyUrl,
    precompileModuleSource({
      source: `export const message = 'ready';`,
      url: dependencyUrl,
      globalsBaseSet: ['document'],
      resolveHook,
    }),
  ],
]);

loadMicroApp(app, {
  sandbox: {
    resolveHook,
    async importHook(fullSpecifier) {
      const source = artifacts.get(fullSpecifier);
      if (!source) throw new Error(`Missing module artifact: ${fullSpecifier}`);
      return { source };
    },
  },
});
```

返回 `{ source: string }` 只会跳过默认 fetch，源码仍会进入 qiankun 的词法分析与链接改写。`precompileModuleSource` 返回的是完整且可移植的 `ModuleSource`：静态依赖已解析为规范化地址，链接代码使用与实例无关的占位键。引擎消费制品时会先复制描述符，只把生成的静态 import 前缀重定位为当前 Compartment 的私有键，全程不再 fetch，也不再重复 rewrite；用户代码里与占位键相似的文本及规范化地址都不会被改动。保留的原始 `source` 不是单纯的诊断信息；若碰撞探测发现注入变量与模块声明重名，引擎会用它缩小注入集合并重新生成代码。

模块以裸标识符读取哪些浏览器全局变量，就要把这些名称列入 `globalsBaseSet`，这样访问才会经过 Compartment 视图。如果目标是让 `importHook` 路径不再执行源码链接 rewrite，应在 hook 之外完成预编译；引擎仍会解析一次已链接制品，但只用于重定位其中由工具生成的 import 前缀。

`modules` 表的优先级高于 `importHook`。`loadHook` 是 `importHook` 的别名，不应同时传入两个不同的函数。新建 Compartment 后再次加载同一模块时，自定义 hook 应返回等价的描述符。
