# RFC: Container Occupancy Gate — Serialize DOM Writes for Micro Apps Sharing One Container

- **Status**: Draft(已实现,见本分支:两段临界区 + FIFO 闸门 + 失败兜底,附闸门单测与 loadApp 集成单测)
- **Author**: qiankun maintainers
- **Created**: 2026-07-25
- **Target Release**: qiankun v3.x
- **Tracking Issue**: #3139
- **Last Revision**: 2026-07-27(实现修订:①段释放点从「loadEntry settle」收紧为「entry promise settle ∧ DOM 流 settle」,见 §释放点修订)

## 背景

qiankun 3 的 streaming loader 在 **load 阶段**就向容器流式写入 DOM 并执行脚本(必须执行才能拿到 lifecycle exports)。而 single-spa 的调度语义是:**incoming app 的 `load` 与 outgoing app 的 `unmount` 并发执行**,只有 `mount` 才等待 unmount 全部完成。

两者叠加后,多个微应用共享同一容器时存在结构性竞态(A→B 切换),完整时序是**两拍互抹**:

1. `load(B)` 与 `unmount(A)` 并发:B 的 load 阶段 `initContainer` **先把仍处于 mounted 状态的 A 的 live DOM 同步抹掉**,随后 B 的 HTML 流入共享容器、模块求值、动态样式注入(如 Vite dev 的 CSS-as-JS 模块);
2. `unmount(A)` 的最后一步 `clearContainer()`(`loadApp.ts` unmount 链末尾)再把 B 刚流入的一切抹掉;
3. `mount(B)` 命中 `!initializedContainers.has(container)` 分支,用 `getPureHTMLStringWithoutScripts` **二次渲染**(脚本被剥掉以避免重复执行)→ 静态 DOM 恢复,但脚本执行的副作用(动态注入的 style 等)不会重来(ESM 模块缓存也不允许重跑)。

### 已有缓解与其局限

- #3138 中的 `reattachDynamicStylesheets` 在每次 sandbox mount 时把已记录但脱离容器的动态样式补挂回去——这是**兜底**,治标不治本:竞态窗口内的 DOM 抹除 + 二次渲染依然发生(浪费一整轮流式渲染、可见闪烁)。
- `loadMicroApp` 内置的时序控制(`wrapParcelConfigForRemount`)只覆盖**同名应用 + 同容器**的重复挂载(registry key 为 `${name}-${xpath}`);跨应用共享容器不受保护——调用方不 `await prevApp.unmountPromise` 就调 `loadMicroApp(next)` 时与 register 路径一样竞态。

## 设计:容器占用注册表(container occupancy gate)

**目标:同一容器上先后渲染多个微应用时,DOM 写入全序化,无竞态。**

粒度 = 容器元素(`container: HTMLElement`,`WeakMap<HTMLElement, Holding>` 按元素引用键控;主应用重渲染产生新元素时新旧元素天然不冲突)。持有凭证用 release 闭包身份(而非 appName 匹配),避免同名多实例歧义;等待者 FIFO 排队。

### 持有周期:两段临界区,而非一段长持有

一个应用对容器的占用不是「load 时 acquire、unmount 时 release」的一段连续持有,而是两类独立的临界区,每段都有确定的退出点:

**① load 流式渲染临界区**

- acquire:`loadApp` 在 load 阶段 `initContainer` 之前(也先于 `createSandbox`——沙箱 bootstrap 会在容器挂载点上安装实例方法 patch,同属容器写入);
- release:**entry lifecycles promise settle ∧ DOM 流 settle**,两个信号齐备即释放(finally 语义,成功失败都放)。见 §释放点修订。

不能持有到 unmount 才释放:single-spa 的 `tryToBootstrapAndMount` 在 load 完成后会**复查 `shouldBeActive`**,A→B→A 快速导航下 B 会 load 完成但永不 mount、也就永不 unmount——若持有延续到 unmount,闸门被 B 永久持有,此后该容器上一切 acquire 全部饿死(死锁)。load settle 即释放则该场景自然消解。

**② mount→unmount 占用期**

- acquire:mount 链内、remount 二次渲染(`initContainer` + `loadEntry` 重放)**之前**——这段同样是 DOM 写入,必须在闸内,否则 loadMicroApp 跨应用 + remount 的组合下竞态依旧;
- release:
  - 正常路径:`clearContainer`(unmount 链最后一步);
  - 失败兜底(**防死锁的关键**):**mount 链任一 hook reject、unmount 链任一 hook reject** 时都要释放。single-spa 对 mount **或 unmount** 失败的应用都标记 `SKIP_BECAUSE_BROKEN`,此后不再调它的 unmount,链末尾的 `clearContainer` 不会执行,必须显式兜底(`loadMicroApp.ts` 过滤 `LOAD_ERROR`/`SKIP_BECAUSE_BROKEN` 实例是同一问题的既有先例)。unmount 失败兜底释放后容器可能残留旧 DOM——无害,下一个持有者自己的 `initContainer` 会清掉,正好自洽。

两段之间(load settle 后、mount acquire 前)存在一个可插队窗口。插队者同样被全序化,不破坏正确性:若真有 C 在窗口内占走容器,B 之后 mount 时命中 `!initializedContainers.has(container)` 走 pure-HTML 重放,只在这个罕见交错下退化为一次二次渲染(且全程无竞态)。正常 A→B 切换该窗口无人插队,单次渲染的收益保持。

**预热不受闸**:闸门只拦 DOM 写入;acquire 前 `void enhancedFetch(entry)` 预热 entry HTML(`makeFetchCacheable` 是全局 LRU,会与 loadEntry 内部 fetch 去重;缓存对 rejection 与无效 status 主动逐出,预热失败不会污染正式加载)。

### 释放点修订(2026-07-27,实现时收紧)

Issue 原文的①段释放点是「`loadEntry` settle 即释放」。实现时发现该表述不精确:`loadEntry` 返回的 promise 在 **entry script 的 onload 即可 settle**(「complete the entry process in advance」,`loader/src/index.ts`),此刻 writable-dom 可能仍在写入 HTML 尾部节点。若此时释放,插队者的 `initContainer` 清容器后,前者的尾部节点会继续追加进来——**交错污染**,且因 `initializedContainers` 已含该容器,mount 不会触发 pure-HTML 重放来修复。

因此释放条件收紧为两个信号的合取:

1. entry lifecycles promise settle(loadApp 等待的那个信号);
2. DOM 流 settle——loader 新增可选回调 `LoaderOpts.onDOMStreamSettled`,约定**所有路径恰好通知一次**:流完整写完、流中途出错、或流根本未启动(fetch 失败/空 body)。

两个信号都无条件 settle(不依赖 mount/unmount 是否发生),①段的防饿死论证不受影响。此修订使 loader 增加约 15 行(原 issue 估计 sandbox/loader/shared 零改动),回调是通用的「DOM 写入阶段结束」信号,不携带 qiankun 语义。

### 影响面评估

| 路径 | 现状 | 加闸后 |
|---|---|---|
| register 共享容器切换 | 流入→被抹→mount 二次渲染(pure HTML);动态样式靠 reattach 兜底 | 只渲染一次(`initializedContainers` 命中,mount 跳过 reload)、无闪烁、动态样式天然不丢 |
| register A→B→A 快速导航(B load 完成但未 mount 即切走) | B 的流式写入与 A 的 remount 竞态 | B 在 load settle 时已释放;A 的 remount 过闸串行执行,无死锁 |
| loadMicroApp 同名重复挂载 | 已有闸门 + load memoize | 无感知,等价于现有机制 |
| loadMicroApp 跨应用共享容器(含 remount) | 调用方不 await 即竞态 | load 临界区与 mount 占用期均过闸,自动串行化 |
| prefetch | 纯 fetch 预热,不碰 DOM | 零影响 |
| 多实例/多容器/嵌套 qiankun | — | 闸门按容器元素隔离,互不干扰 |

### 行为变更

1. **`loadMicroApp` 塞进被占用容器:静默踩掉 → 显式等待。** 把新应用塞进一个**仍被挂载中应用占用**且调用方从不 unmount 的容器,今天是静默踩掉(前应用沙箱仍活着,本就是坏状态),加闸后变为显式等待,等待期间该应用的 single-spa status 停在 `LOADING_SOURCE_CODE`(load 排队)或 mount 前的对应状态(mount 排队),调用方可观察。对策:dev 模式下等待超过 ~3s 打警告(`app B is waiting for container held by A — did you forget to unmount it?`),不设强制超时(正确性优先)。
2. **切换时序变化。** B 的脚本执行从「与 unmount(A) 并行」推迟到「unmount(A) 完成之后」,依赖该重叠时序的边缘用法会感知。总 wall-clock 大体不变甚至更好:今天是 max(unmount A, load B) 之后还要追加一整轮 pure-HTML 二次渲染,加闸后是 unmount(A) + load(B),省掉整轮浪费渲染。

changelog 需注明以上两点。

### 实现注记

- 闸门模块:`packages/qiankun/src/core/containerOccupancy.ts`;接入点全部在 `loadApp.ts`。
- mount/unmount 链的失败兜底通过包裹链内每个 hook 实现(`guardHooksWithMountHoldRelease`)。`registerMicroApps` 在链外自行前后追加的 `loader(true/false)` 指示器 hook 不在包裹范围内——指示器抛异常属病态用法,不做防御。
- unmount 链中途失败的兜底释放会留下「沙箱实例 patch 未拆、闸门已放行」的残留态:下一个持有者的流式节点可能落在残留 patch 上。这正是 passthrough 效果位必须保持 `Symbol.for` 注册符号(跨 qiankun 副本可读)的原因之一,见 insertion-point-ownership RFC。

### 测试计划

- 现有 e2e 全绿;「loading-phase dynamic styles survive replacing another app in a shared container」用例从"靠 reattach 救回"升级为"根本不丢",并断言整个切换过程只发生一次流式渲染;
- 新增:
  - register A→B→A 快速导航:B load 完成但从未 mount,A 的 remount 不死锁、渲染正确(①段 release 的回归用例);
  - loadMicroApp 跨应用同容器不 await 的竞态用例(含 remount 场景);
  - A mount 链抛错后 B 不死锁;A unmount 链中途抛错后 B 不死锁(两类 `SKIP_BECAUSE_BROKEN` 兜底各一);
  - 闸门 FIFO 顺序、两段临界区 acquire/release 配对的单测(`containerOccupancy.test.ts`、`loadApp.containerGate.test.ts`)。

## 参考

- 竞态的完整分析与讨论见 #3138
- single-spa reroute 调度:`toLoadPromise` 立即启动、`tryToBootstrapAndMount` 等待 `unmountAllPromise`,且在 mount 前**复查 `shouldBeActive`**(load 完成但已不活跃的应用永不 mount——①段 release 时机的直接依据)
