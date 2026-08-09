# 不依赖 qiankun，独立使用沙箱

浏览器宿主可以直接引入 `@qiankunjs/sandbox`，无需同时使用 qiankun 或 HTML loader。这个包提供两层能力：

- 只需要隔离 JavaScript 全局变量时，使用 `StandardSandbox`。它可以执行 Classic 脚本，也可以加载 ESM。
- 还需要约束动态 DOM、隔离样式并管理定时器和监听器时，使用 `createSandbox()`。

包内也公开了更底层的 `Compartment`，供需要自行接入模块 hook 或组装宿主能力的场景使用。Classic 脚本不应直接从这里起步。

## 安装

```bash
pnpm add @qiankunjs/sandbox@rc
```

该包仅面向浏览器，运行时依赖 DOM、Blob URL 和动态 import map。不要在 Node.js 或 SSR 渲染阶段初始化沙箱。

## 如何选择入口

| 使用场景 | 推荐入口 |
| --- | --- |
| 执行 Classic 脚本或加载 ESM，不接管 DOM | `StandardSandbox` |
| 限制动态 DOM 和样式，并统一清理副作用 | 传入容器的 `createSandbox()` |
| 只管理定时器、window 监听器等副作用 | 不传容器的 `createSandbox()` |
| 自行实现 Compartment 宿主 | `Compartment` |

`StandardSandbox` 会让 `window`、`self` 和 `globalThis` 正确指向当前沙箱。裸 `Compartment` 不会主动补上这些浏览器自引用，因为它们不属于 Compartment 的标准形状。开发环境下，如果直接调用 `Compartment.evaluateScript()` 且没有定义沙箱内的 `window`，控制台只会提示一次风险；这条提示不会改变运行结果，`window.x = 1` 仍可能写入宿主页面。

## 只隔离 JavaScript

### 执行 Classic 脚本

```ts
import { StandardSandbox } from '@qiankunjs/sandbox';

const sandbox = new StandardSandbox('analytics-job', {
  reportId: 'weekly-42',
});

await sandbox.evaluateScript(
  `
    window.analyticsResult = {
      reportId,
      generatedAt: Date.now(),
    };
  `,
  { sourceURL: 'https://analytics.example/job.js' },
);

const view = sandbox.globalThis as Window & {
  analyticsResult?: { reportId: string; generatedAt: number };
};

console.log(view.analyticsResult);
console.log(Reflect.get(window, 'analyticsResult')); // undefined

sandbox.dispose();
```

脚本会通过原生 Blob script 执行，不依赖 `eval` 或 `new Function`。`sourceURL` 不是必填项，但保留原始地址有助于查看错误堆栈和调试源码。

### 加载 ESM

```ts
const sandbox = new StandardSandbox('analytics-module');
const entryUrl = new URL('/modules/analytics-entry.js', document.baseURI).href;
const namespace = await sandbox.import(entryUrl);

console.log(namespace);
sandbox.dispose();
```

模块默认以 `document.baseURI` 为基准，并通过浏览器原生 fetch 获取。`StandardSandbox` 的第四个参数用于传递模块配置；`createSandbox()` 则把 `modules`、`resolveHook`、`importHook` 和 `loadHook` 放在顶层。需要接入私有协议或预编译模块时，可参考[用插件扩展沙箱](/zh-CN/cookbook/sandbox-plugins)。

## 将第三方组件限制在容器内

下面的宿主代码直接加载一个第三方 Classic 脚本，全程不依赖 qiankun 或 loader：

```html
<div id="widget-host"></div>
```

```ts
import { createSandbox } from '@qiankunjs/sandbox';

const container = document.querySelector<HTMLElement>('#widget-host')!;
const controller = createSandbox('support-widget', {
  container,
  styleIsolation: true,
});

try {
  // 先启用副作用追踪，再执行第三方代码。
  await controller.mount();

  const response = await fetch('https://widgets.example/support.js');
  if (!response.ok) {
    throw new Error(`Widget request failed: ${response.status}`);
  }

  const source = await response.text();
  await controller.instance.evaluateScript(source, {
    sourceURL: response.url,
  });
} catch (error) {
  // 即使 mount 或脚本执行只完成了一部分，dispose 也能安全收尾。
  await controller.dispose();
  throw error;
}
```

第三方代码看到的是经过处理的 document：

- `document.body` 指向传入的容器；
- `document.head` 指向容器内的 `<qiankun-head>`；
- 动态插入的 script、style 和 stylesheet link 会先经过沙箱转换；
- 开启 `styleIsolation` 后，样式会限制在 `[data-name="support-widget"]` 内。

业务组件如何卸载仍由宿主决定。如果组件公开了 unmount 方法，应先执行组件自身的清理，再停用沙箱：

```ts
const widgetView = controller.instance.globalThis as Window & {
  widgetUnmount?: () => void | Promise<void>;
};
await widgetView.widgetUnmount?.();
await controller.unmount();

// 后续再次启用时，沙箱会恢复需要保留的集成状态。
await controller.mount();

// 永久移除。dispose 之后不能继续使用这个 controller。
await controller.dispose();
container.replaceChildren();
```

`unmount()` 不会代替组件执行业务卸载，也不会清空容器。`dispose()` 可以在挂载状态下直接调用，多次调用也不会重复释放资源。

## 每次挂载使用新的容器

如果宿主在页面切换时会重建挂载节点，可以传入 getter：

```ts
let currentContainer = document.querySelector<HTMLElement>('#widget-a')!;

const controller = createSandbox('support-widget', {
  container: () => currentContainer,
  styleIsolation: true,
});

await controller.mount();
await controller.unmount();

currentContainer = document.querySelector<HTMLElement>('#widget-b')!;
await controller.mount();
```

下一次 mount 时，控制器会重新读取 getter。也可以调用 `mount(container)`，仅为当前这次挂载覆盖预先配置的容器。

## 不接管 DOM，只管理副作用

不传 `container` 时，`createSandbox()` 不会安装动态 DOM 插件，但仍会管理定时器、window 监听器和 history 监听器：

```ts
const controller = createSandbox('background-integration');

await controller.mount();
await controller.instance.evaluateScript(`
  window.addEventListener('message', () => {});
  window.setInterval(() => {}, 1000);
`);

await controller.unmount();
await controller.dispose();
```

应在执行脚本前调用 `mount()`。在此之前创建的副作用不属于 mount 阶段的追踪范围。样式隔离必须依附于容器，因此 `createSandbox('name', { styleIsolation: true })` 会直接抛出 `TypeError`。

## 准备容器协议

只要向 `createSandbox()` 传入容器，controller 就会自动完成准备工作。只有在自行组合底层能力时，才需要直接调用公开 helper：

```ts
import { prepareSandboxContainer } from '@qiankunjs/sandbox';

const container = document.querySelector<HTMLElement>('#widget-host')!;
const { styleIsolation, cleanup } = prepareSandboxContainer(container, 'support-widget');

console.log(styleIsolation.appName); // support-widget
console.log(styleIsolation.scopeRoot); // [data-name="support-widget"]

// 自定义宿主永久销毁时，释放这次准备工作留下的状态。
cleanup();
```

这项准备工作包含三部分：

1. 为容器设置 `data-name="support-widget"`；
2. 确保容器内存在承接 `document.head` 写入的 `<qiankun-head>`；
3. 返回样式隔离所需的 `{ appName, scopeRoot }`。

`cleanup` 只撤销本次调用产生的修改。容器原本已有的 `<qiankun-head>` 会保留，原有 `data-name` 会恢复；如果宿主后来又修改了属性，cleanup 也不会覆盖新的值。重复调用 cleanup 是安全的。

## 配置项

```ts
const controller = createSandbox(appName, {
  container,
  provisionContainerHead,
  globals,
  incubatorContext,
  modules,
  resolveHook,
  importHook,
  loadHook,
  plugins,
  styleIsolation,
  fetch,
  nodeTransformer,
  compartmentOptions,
});
```

| 配置 | 用途 |
| --- | --- |
| `container` | 开启 DOM 约束，可传元素或 getter |
| `provisionContainerHead` | mount 时容器内缺少 `<qiankun-head>` 是否由沙箱自动补建，默认 `true`；容器结构由外部管线（如 qiankun 的流式 loader）从 entry HTML 生成时传 `false` |
| `globals` | 向沙箱全局对象补充值或属性描述符 |
| `incubatorContext` | 指定全局读取向下透传时使用的宿主 window |
| `modules` | 提供预置模块表 |
| `resolveHook` | 自定义模块地址解析 |
| `importHook` / `loadHook` | 返回自定义模块描述；两者为别名关系 |
| `plugins` | 在内置插件之后追加隔离插件 |
| `styleIsolation` | 开启运行时 CSS 作用域，需要同时配置容器 |
| `fetch` | 替换 ESM 和动态资源共用的 fetch |
| `nodeTransformer` | 替换默认的动态资源转换逻辑 |
| `compartmentOptions` | 传递 `moduleHost` 等底层宿主选项 |

若顶层模块配置与 `compartmentOptions` 重复，以顶层配置为准。控制器会公开标准化后的 `instance`、`nodeTransformer`、可选的 `styleIsolation`，以及 `mount`、`unmount`、`dispose` 三个生命周期方法。

自定义 globals 和插件的写法见[用插件扩展沙箱](/zh-CN/cookbook/sandbox-plugins)。

## 为什么默认 transformer 不能省

动态 DOM 插件只能拦截 script 元素，单纯改变插入位置并不能隔离 JavaScript。默认 transformer 会先获取 Classic 脚本内容，再用当前 Compartment 的 classic-script transformer 包装源码，最后交给浏览器通过 Blob URL 执行。正是这一步保证了 `window.someValue = ...` 只写入沙箱。

动态 style 和 stylesheet link 也走同一条转换路径。开启样式隔离后，内部生成的作用域参数会自动传给 transformer；独立使用时，资源基准地址为 `document.baseURI`。

高级宿主可以替换 transformer：

```ts
const controller = createSandbox('trusted-widget', {
  container,
  nodeTransformer: (node) => node,
});
```

上面这个「原样返回节点」的 transformer 只是风险示例，不是推荐配置。它会跳过 Classic 脚本包装，动态插入的脚本可能直接访问宿主 window；默认的样式转换也会一并失效。只有在自定义实现提供了同等保护，或相关资源全部可信时，才应采用这种配置。

如果外部 HTML 管线也要在节点落入 DOM 前执行转换，应使用 `controller.nodeTransformer`，不要直接复用 options 中未经处理的回调。控制器暴露的版本已经注入 Compartment、fetch、Classic 脚本包装器和样式隔离配置。

它的输出还带有一层归属语义：控制器 transformer 会把节点标记为「管线成品」，沙箱打过补丁的插入点会原样放行，不再把它二次送入动态转译管线。特别地，经它处理的 `<style>` / `<link>` **不会**进入沙箱的动态样式台账——`unmount()` 后它会留在原处，之后的 `mount()` 也不会自动补挂。它的生命周期归属于准备它的管线：如果你的嵌入场景会反复 unmount / remount，请自行移除或重新插入。而沙箱内代码在运行时动态注入的样式（走补丁后的 DOM 方法、不带标记）仍保有完整的台账生命周期——unmount 时移除、remount 时恢复。

## 了解隔离边界

这套沙箱优先保证浏览器兼容性和对象身份一致，因此 membrane 有意采用非传递设计。

```ts
const sharedSettings = { theme: 'light' };
const sandbox = new StandardSandbox('settings-demo', { sharedSettings });

await sandbox.evaluateScript(`
  window.localFlag = true;
  sharedSettings.theme = 'dark';
`);
```

执行后会得到以下结果：

- 宿主的 `window.localFlag` 仍是 `undefined`，因为全局属性写入被隔离；
- 宿主和沙箱看到的 `sharedSettings.theme` 都变成了 `"dark"`，因为双方持有的是同一个对象；
- DOM 节点、事件、函数和库实例同样保持原始身份，`===` 与 `instanceof` 不会因为穿过边界而失效。

因此，它不适合直接执行恶意或不受信任的代码。沙箱不会冻结共享对象，不会 harden intrinsics，也不会创建新的源，更不会提供 iframe 或 Worker 那样的调用边界。需要安全边界时，应采用浏览器原生隔离机制。设计取舍详见 [Compartment Alignment RFC](https://github.com/umijs/qiankun/blob/next/docs/rfcs/compartment-alignment.md)。

## Content Security Policy

Classic 脚本求值器和 ESM 引擎都不会调用 `eval` 或 `new Function`，因此无需在 CSP 中加入 `'unsafe-eval'`。生成后的代码通过 Blob URL 执行，需要为相关指令放行实际使用的资源：

- `script-src` 需要允许 `blob:`；
- ESM 引擎会动态插入内联的 `script[type="importmap"]`，脚本策略也要允许这类节点；
- 远程脚本和模块会先通过 fetch 获取，相应源需要出现在 `connect-src` 中；
- 外链样式经过隔离转换后可能使用 Blob URL，此时 `style-src` 也要允许 `blob:`；
- 动态创建的 `<style>` 仍受页面现有的 nonce、hash 或内联样式策略约束。

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' blob:; style-src 'self' 'unsafe-inline' blob:; connect-src 'self' https://widgets.example
```

上面的示例同时放行了运行时 import map 和组件创建的内联样式。实际策略应根据所用执行路径和资源继续收紧，跨源 fetch 还必须满足 CORS。缺少 Blob、内联脚本或网络源权限时，添加 `'unsafe-eval'` 无法解决问题，也不是这个包的运行要求。

## 上线前检查

- Classic 脚本使用 `StandardSandbox`，不要直接交给裸 `Compartment`；
- 在应用安装定时器或监听器之前完成 `mount()`；
- 除非替代实现保留了脚本隔离，否则不要覆盖默认 transformer；
- 由宿主负责业务卸载和容器内容清理；
- 永久移除或加载失败时调用 `dispose()`；
- 在目标浏览器中实际验证 CSP、CORS 和资源地址；
- 不受信任的代码使用 iframe、Worker 或源隔离。
