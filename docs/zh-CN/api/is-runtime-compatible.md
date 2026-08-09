# isRuntimeCompatible

检查当前浏览器是否满足 qiankun v3 的最低运行条件。主应用需要在不受支持的浏览器中显示替代内容时，可在加载微应用前调用该函数。

## 函数签名

```ts
function isRuntimeCompatible(): boolean;
```

该检查同步执行，不接收参数，也不会修改运行时状态。

## 检查范围

只有以下三项 API 都可用时，`isRuntimeCompatible()` 才返回 `true`：

| 能力 | qiankun 的用途 |
| --- | --- |
| `Proxy` | JavaScript 隔离 |
| `TransformStream` | 流式加载 HTML 入口 |
| `URL.createObjectURL` | 隔离执行脚本 |

建议使用该函数检测运行时能力，而不是自行维护浏览器版本列表。

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

返回值仅表示上述三项核心运行时 API 是否可用，不会验证：

- [原生 ESM 支持](/zh-CN/concepts/esm-sandbox)额外依赖的浏览器行为；
- 可选[样式隔离](/zh-CN/concepts/style-isolation)所需的 CSS `@scope`；
- Content Security Policy、CORS 响应头、入口地址或资源是否可用。

原生 ESM 执行路径需要动态注入多个 import map。即使 `isRuntimeCompatible()` 返回 `true`，Firefox 默认也不支持该能力。需要支持 Firefox 时，应改用 Classic 脚本方式交付（例如 Webpack 构建产物）。

## 相关内容

- [`loadMicroApp`](/zh-CN/api/load-micro-app)。
- [原生 ESM 支持](/zh-CN/concepts/esm-sandbox)。
- [浏览器支持](/zh-CN/guide/browser-support)。
- [快速上手](/zh-CN/guide/getting-started)。
