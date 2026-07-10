# isRuntimeCompatible

检查当前浏览器是否具备 qiankun v3 运行时所需的最低能力。主应用需要为不受支持的浏览器展示降级内容时，可以在加载应用前调用它。

## 函数签名

```ts
function isRuntimeCompatible(): boolean;
```

这项检查同步执行、不接收参数，也不会修改运行时状态。

## 检查范围

只有以下三项 API 都可用时，`isRuntimeCompatible()` 才返回 `true`：

| 能力 | qiankun 的用途 |
| --- | --- |
| `Proxy` | JavaScript 隔离 |
| `TransformStream` | 流式加载 HTML Entry |
| `URL.createObjectURL` | 隔离执行脚本 |

应用代码应优先使用这项能力检测，而不是自行维护浏览器版本表。

## 使用方式

```ts
import { isRuntimeCompatible, loadMicroApp } from 'qiankun';

const container = document.getElementById('micro-app-slot');
if (!container) throw new Error('micro-app-slot not found');

if (!isRuntimeCompatible()) {
  container.textContent = '请使用受支持的浏览器。';
} else {
  const microApp = loadMicroApp({
    name: 'account-app',
    entry: 'https://account.example.com',
    container,
  });

  void microApp.mountPromise.catch((error: unknown) => {
    console.error('account-app 挂载失败', error);
  });

  // 保存 microApp，并在当前视图移除时调用 microApp.unmount()。
}
```

路由驱动的主应用也可以在 `registerMicroApps` 和 `start` 之前执行同一项检查。

## 不在检查范围内的能力

返回值只覆盖上面的三项核心运行时 API，并不会验证：

- [原生 ESM 应用](/zh-CN/concepts/esm-sandbox)额外依赖的浏览器行为；
- 可选[样式隔离](/zh-CN/concepts/style-isolation)所需的 CSS `@scope`；
- Content Security Policy、CORS 响应头、入口地址或资源是否可用。

特别是，原生 ESM 路径需要动态注入多份 import map。即使 `isRuntimeCompatible()` 返回 `true`，Firefox 默认也没有开启这项能力；需要支持 Firefox 时，请使用 Classic/Webpack 交付路径。

## 相关链接

- [`loadMicroApp`](/zh-CN/api/load-micro-app)
- [原生 ESM 支持](/zh-CN/concepts/esm-sandbox)
- [运行环境要求](/zh-CN/guide/getting-started)
