# RFC: classic 微应用预执行机制

- **状态**：Draft，提供默认关闭的 opt-in 实现
- **范围**：classic HTML-entry；不预编译 ESM 图、inline 脚本或动态 chunk

## 结论

提前准备 classic 脚本工厂可以缩短准备命中后的激活关键路径，值得继续推进。真实依赖大包的验证已观察到约 20–60 ms 的激活收益；该结论只适用于准备已完成并命中的条件，不能外推为所有应用的端到端收益。

V8 诊断表明，准备阶段提前完成了整段源码的初次解析、内部函数预解析，以及部分外层函数和 IIFE 的编译；内部函数仍可能在首次调用时编译。注册工厂既不代表所有函数已编译，也不允许为强制编译而提前执行业务代码。

准备会占用 CPU 和内存，可能影响主应用交互。因此提供有界、可取消、可释放的显式机制，默认不开启；业务自行决定是否准备及何时准备。预测命中率、多应用竞争、真实低端设备和释放后的稳定内存仍需业务验证。

## 设计

源码制品与实例绑定分离。准备阶段只取回入口和有效外链 classic 脚本，通过原生 blob classic 元素登记实例无关工厂，不创建沙箱、调用插件、读取实例 globals/getter 或运行微应用顶层代码。

正常包装与准备工厂使用同一个沙箱源码生成器。激活时保留原 script 节点及同步、async、defer 调度；命中后仅将大段源码替换成调用桩，在现有 `q:bse` 恢复原始 src 后，绑定当前隔离膜并创建独立执行闭包。不同实例共享工厂，不共享闭包和生命周期导出。保持 `currentScript`、顶层 `this` / `arguments`、声明作用域和 `sourceURL` 语义。

工厂登记和调用桥位于已有的内部屏蔽命名空间。每个实例的调用桥使用独立标识，避免已销毁实例的排队调用影响后续实例。业务异常沿用原生脚本语义，不重试业务求值。

## API 与默认限制

```ts
const preparation = prepareClassicApps([{ name: 'orders', entry }], {
  fetch,
  signal,
  maxBytes: 16 * 1024 * 1024,
  maxEntries: 32,
  ttl: 30_000,
});

await preparation.ready; // 可选；加载不等待尚未完成的工厂登记。
const app = loadMicroApp({ name: 'orders', entry, container }, { classicPreparation: preparation });
await app.mountPromise;
preparation.dispose(); // 释放准备资源，不卸载 app。
```

路由方式通过注册项的 `configuration.classicPreparation` 传入同一句柄。不恢复自动 prefetch 策略，不扩展已废弃的 `prefetchApps`。

句柄独立拥有响应和工厂缓存，绑定 fetch 身份与声明入口；资源按 URL 和有效 credentials 区分。工厂消费还需逐字核验源码、源 URL 和有序全局名称配置。登录态、请求头语义、发布版本或 fetch 上下文变化时，应释放旧句柄。

资源条目默认最多 32 个，响应 body 与保留的 UTF-16 源码预算默认 16 MiB，TTL 默认 30 秒。TTL 不得超过显式 HTTP 新鲜度；无明确新鲜度、no-store、no-cache、Vary:*、过期、无效新鲜度或重定向响应不保留。框架预算不包含无法精确计量的浏览器编译内存。

准备过程按资源串行执行，逐脚本调度空闲任务；缺少空闲回调时按任务让出主线程。单个大脚本不能被空闲预算抢占。

## 回退与生命周期

未就绪、过期、超预算、已释放、内容或配置不匹配时，走原加载路径。首版仅支持默认沙箱及可选 styleIsolation；自定义 globals、plugins、realm、模块钩子、节点/流转换器或 `sandbox: false` 均回退。

加载可复用进行中的脚本下载；未完成的 HTML 快照不阻塞原请求，避免破坏流式首屏。准备被取消时，加载改用自身的 fetch；不同读取者的响应体独立响应取消，不影响共享准备。

AbortSignal 或 `dispose()` 取消准备请求和登记，清除保留响应、源码、工厂、临时节点、URL、回调及过期定时器。加载器已排队的求值由应用独立持有，到执行、脚本失败或 Compartment 销毁时释放。句柄释放不卸载应用，也不改变已有实例的温重挂载行为；浏览器内部编译内存的实际回收时刻由 GC 决定。

## 实现边界

- `sandbox` 维护统一包装、实例无关源码制品、工厂消费和实例调用桥。
- `qiankun` 提供准备 API，拥有请求分区、预算、调度、取消和缓存释放，并通过 `loadApp` 显式接入。
- `loader` 与资源转换器只传递结构化门面和清理回调，保持 script 节点、导出发现、共享依赖和容器闸门的原有语义。
- 不修改 writable-dom fork 或 single-spa；ESM 继续由原引擎处理。

登记不使用 eval 或 new Function，宿主有效 CSP 仍须允许相关 blob classic 元素；nonce 不绕过 CSP 或 Trusted Types。

验收需覆盖准备期零业务副作用、源码与配置失效、预算和取消、释放竞态、多实例独立闭包、同步/async/defer 顺序、strict UMD、this/arguments/currentScript、CSP 及默认关闭路径的兼容性。API 用法与边界见 [prepareClassicApps](/zh-CN/api/prepare-classic-apps)。
