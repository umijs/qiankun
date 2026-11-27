# prepareClassicApps

为 classic HTML 入口提前获取脚本并登记可复用工厂，减少之后激活时的部分解析、编译和源码处理工作。准备阶段不创建微应用或沙箱，不执行业务代码，也不调用生命周期。

该能力默认关闭。仅在性能测量确认 classic 大包的激活耗时需要优化、且业务能够提供足够提前量时使用。它不保证浏览器已编译所有内部函数，也不适用于 ESM 模块图。

## 函数签名

```ts
import { prepareClassicApps, loadMicroApp } from 'qiankun';

const preparation = prepareClassicApps([{ name: 'orders', entry: 'https://example.com/orders/' }], {
  maxBytes: 16 * 1024 * 1024,
  maxEntries: 32,
  ttl: 30_000,
});

// 可选；实际加载不会等待尚未完成的工厂登记。
const results = await preparation.ready;

const app = loadMicroApp(
  { name: 'orders', entry: 'https://example.com/orders/', container },
  { classicPreparation: preparation },
);
await app.mountPromise;

// 停止准备并清空缓存，不卸载 app。幂等，释放后不能再次准备。
preparation.dispose();
// 应用的生命周期仍由调用方管理。
await app.unmount();
await app.unload();
```

路由驱动应用通过注册项的 `configuration.classicPreparation` 传入同一句柄；不通过 `start()` 开启，也不恢复已废弃的 `prefetchApps` 策略。

## 参数

`apps` 为只读应用元数据数组，每项包含 `name` 和 `entry`。

| options 字段 | 类型 | 说明 |
| --- | --- | --- |
| `fetch` | `typeof window.fetch` | 默认值为 `window.fetch`。加载时必须使用同一个函数对象，否则回退到原路径。 |
| `signal` | `AbortSignal` | 中止信号触发时取消准备并释放句柄；不取消已加载应用。 |
| `maxBytes` | `number` | 默认值为 `16777216`。响应 body 字节与保留源码的 UTF-16 字节预算，不包含浏览器内部编译制品的精确内存。 |
| `maxEntries` | `number` | 默认值为 `32`。资源条目上限，包括进行中的请求；已登记的入口元数据也有相同数量上限。 |
| `ttl` | `number` | 默认值为 `30000`，单位为毫秒。条目从请求开始计算的最长存活时间，且不得超过 HTTP 显式新鲜度。 |
| `nonce` | `string` | 可选，设置准备阶段 blob script 元素的 nonce；仍须满足宿主有效 CSP。 |

三个预算字段必须为正安全整数。准备过程串行获取资源并逐脚本调度空闲任务；浏览器不提供空闲回调时按任务让出主线程。单个大脚本的处理不能被空闲预算抢占，因此应在主应用关键工作完成后按需准备。

## 返回值

- `ready`：解析为每个应用的准备结果，包含 `name`、`entry`、`preparedScripts` 以及 `status`（`ready`、`skipped`、`failed` 或 `cancelled`）。局部失败记录为结果，并在 `error` 字段保留原因，不使整个 Promise 拒绝。`ready` 表示当时至少登记了一个工厂，之后仍可能因过期或预算淘汰而未命中。
- `dispose()`：取消准备期请求和登记，清除保留响应、源码、工厂、临时节点、URL 和回调。已被加载器排队的求值由应用持有到执行结束或应用销毁；释放句柄不使该求值失效。
- `getStats()`：返回 `{ entries, bytes, preparedScripts }`。`bytes` 是上述预算的占用量，不是进程 RSS 或浏览器编译内存峰值。

## 命中、回退与新鲜度

句柄独立于运行时共享响应 LRU，按 URL 和有效 credentials 区分请求，工厂命中还必须满足源码逐字相同、源 URL 和有序全局配置相同。登录态、请求头语义、发布版本或 fetch 上下文发生变化时，应释放旧句柄并重新准备。

仅保留具有有效 `Cache-Control: max-age` 或 `Expires` 新鲜度的响应；`no-store`、`no-cache`、过期或重定向响应不进入缓存。未保留的 HTML 仍可用于发现脚本，真正加载时重新获取该 HTML。CSS、inline 脚本、ESM、动态 chunk 和共享依赖重定向不预编译。

下列情况走原加载路径，不等待工厂登记完成：未准备、未就绪、已释放、已过期、超预算、源码或配置不符，以及 `sandbox: false`、自定义 `nodeTransformer` / `streamTransformer` 或除 `styleIsolation` 外的沙箱自定义配置。正在获取的脚本可被加载阶段等待复用；未完成的 HTML 快照不复用，避免把流式入口缓冲到响应结束。若准备被取消，则加载改用自身的 fetch，不复用已中止的请求。

准备句柄不改变实例复用策略。已有可复用实例时，重新挂载仍复用其生命周期，不会为了消费新工厂而重新求值。

## CSP 与内存边界

工厂通过原生 blob classic script 登记，不使用 `eval` 或 `new Function`。宿主仍须允许相应脚本元素和 blob URL；nonce 不会绕过 CSP 或 Trusted Types。参见 [内容安全策略（CSP）](/zh-CN/guide/csp-requirements)。

预算约束框架保留的响应和源码；引擎编译内存由浏览器管理，无法精确计量或保证在 `dispose()` 返回时已被 GC。应结合准备命中率、主应用交互、多实例数量及释放后的内存测量判断是否启用。

## 相关内容

- [优化微应用加载](/zh-CN/cookbook/optimize-loading)
- [AppConfiguration](/zh-CN/api/configuration)
- [loadMicroApp](/zh-CN/api/load-micro-app)
